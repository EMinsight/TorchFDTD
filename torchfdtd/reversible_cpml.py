"""Recorded-interface reconstruction with fixed, absorbing exterior material.

Only a lossless interior is reversed. The full CPML field/auxiliary adjoint is
propagated normally. The boundary history occupies O(steps * transverse area),
not O(steps * volume). This is a scoped alternative to checkpoint replay.
"""
from __future__ import annotations

from dataclasses import dataclass
import math
import threading
import time

import torch

from .boundaries import BoundaryDescription
from .differentiable import DifferentiableResult, _System
from .models import Project
from .reversible import ReversibleOptions
from .solver import index_at


@dataclass(frozen=True)
class ReversibleCPMLOptions(ReversibleOptions):
    """Resident state budgets and lossless boundary-history storage.

    CPU trace transfers are synchronous. They reduce device history storage,
    but do not promise copy/compute overlap. No files are created by this API.
    """

    trace_storage: str = 'device'
    collar_cells: int = 1

    def __post_init__(self):
        super().__post_init__()
        if self.trace_storage not in ('device', 'cpu'):
            raise ValueError('trace_storage must be device or cpu.')
        if (isinstance(self.collar_cells, bool) or not isinstance(self.collar_cells, int)
                or self.collar_cells < 1):
            raise ValueError('collar_cells must be a positive integer.')


def _interior_interval(region, collar):
    """Derive free rows from the actual staggered CPML descriptors."""
    description = BoundaryDescription(region)
    active = []
    for (forward, axis, _), segments in description.cpml.items():
        for segment in segments:
            if axis != 2:
                raise ValueError('Recorded-interface reconstruction supports z CPML only.')
            part = segment['slice'][axis]
            offset = 0 if forward else 1
            active.append((part.start + offset, part.stop + offset))
    merged = []
    for lo, hi in sorted(active):
        if merged and lo <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], hi))
        else:
            merged.append((lo, hi))
    nz = region.shape[2]
    if len(merged) != 2 or merged[0][0] != 0 or merged[-1][1] != nz:
        raise ValueError('CPML descriptors must leave one contiguous lossless interior.')
    a, b = merged[0][1] + collar, merged[1][0] - collar - 1
    if b - a < 1:
        raise ValueError('CPML and collar leave fewer than two reconstruction planes.')
    return a, b


def _validate_project(project, options):
    r = project.region
    recommendation = ' Use checkpointed DifferentiableSimulation for other supported physics.'
    if (r.dimension != '3d' or r.precision != 'float32' or r.mesh_type != 'uniform'
            or r.mesh_steps is not None or r.material_sampling != 'yee'
            or r.interface_method != 'staircase' or r.run_control.auto_shutoff
            or r.memory_mode == 'streamed'):
        raise ValueError('ReversibleCPMLSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps.' + recommendation)
    if (any(f.kind != 'periodic' for axis in (0, 1) for f in r.boundaries.pair(axis))
            or any(f.kind != 'pml' for f in r.boundaries.pair(2)) or any(r.bloch_phase)):
        raise ValueError('ReversibleCPMLSimulation requires periodic x/y and CPML on both z faces, without Bloch phase.' + recommendation)
    if any(m.model != 'dielectric' or m.oscillators for m in project.materials):
        raise ValueError('ReversibleCPMLSimulation supports only scalar nondispersive dielectric declarations.' + recommendation)
    a, b = _interior_interval(r, options.collar_cells)
    for raw in project.sources:
        source = project.resolved_source(raw)
        if not source.enabled:
            continue
        if (source.kind != 'point' or source.injection != 'soft'
                or any(not name.startswith('E') for name, _ in source.polarization_components)):
            raise ValueError('ReversibleCPMLSimulation supports fixed soft electric point sources only.' + recommendation)
        for component, _ in source.polarization_components:
            location = index_at(source.center, r, component)
            if not a <= location[2] <= b:
                raise ValueError('Every electric source component must lie inside the reconstruction interval.')
    monitors = [m for m in project.monitors if m.enabled]
    if not monitors or any(m.kind != 'point' or m.time_downsample != 1 for m in monitors):
        raise ValueError('ReversibleCPMLSimulation requires point E/H monitors sampled every timestep.' + recommendation)
    return a, b


def _interior_blocks(field, a, b):
    # Reshape only the complete contiguous native field. Each copied rectangle
    # contains at most 65536 scalars, even for a very long z axis.
    rows = field.view(-1, field.shape[2], 3)
    for z in range(a, b + 1, 65536 // 3):
        end = min(b + 1, z + 65536 // 3)
        row_count = max(1, 65536 // (3 * (end - z)))
        for row in range(0, rows.shape[0], row_count):
            yield rows[row:row + row_count, z:end].reshape(-1)


def _interior_scale(system, a, b):
    square = torch.zeros((), dtype=torch.float64, device=system.device)
    peak = torch.zeros((), dtype=torch.float32, device=system.device)
    for field in system.state()[:2]:
        for block in _interior_blocks(field, a, b):
            peak = torch.maximum(peak, block.abs().amax())
            converted = block.to(torch.float64)
            square.add_(converted.square().sum())
            del converted
    maximum, norm = float(peak), math.sqrt(float(square))
    if not math.isfinite(maximum) or not math.isfinite(norm):
        raise RuntimeError('Reversible interior fields became nonfinite.')
    return maximum, norm


def _require_finite(value, message, chunk):
    flat = value.reshape(-1)
    for start in range(0, flat.numel(), chunk):
        if not bool(torch.isfinite(flat[start:start + chunk]).all()):
            raise RuntimeError(message)


def _advance_recorded(system, step, frame, a, b):
    """The native E-then-H update, with a trace between the two updates."""
    e, h, *psis = system.state()
    if system.kernel is not None:
        system.kernel.update_E()
        system.inject(e, 'E', step)
        frame[0].copy_(e[:, :, b + 1, :2])
        frame[1].copy_(h[:, :, a - 1, :2])
        system.kernel.update_H()
        system.inject(h, 'H', step)
    else:
        curl, psis = system.curl(h, psis, False)
        next_e = system.inject(e + system.grid.courant_number / system.eps4 * curl,
                               'E', step, functional=True)
        del curl
        frame[0].copy_(next_e[:, :, b + 1, :2])
        frame[1].copy_(h[:, :, a - 1, :2])
        curl, psis = system.curl(next_e, psis, True)
        next_h = system.inject(h - system.grid.courant_number * curl,
                               'H', step, functional=True)
        for target, value in zip(system.state(), (next_e, next_h, *psis)):
            target.copy_(value)
    system.current_step = step + 1


class _RecordedCPML(torch.autograd.Function):
    @staticmethod
    def forward(ctx, epsilon, project, options, interval, report):
        system = _System(project, epsilon.detach(), prepare_kernels=False)
        if epsilon.is_cuda:
            from .cuda_kernels import FusedYeeCUDA
            system.kernel = FusedYeeCUDA(system.grid, direct_views=True)
        a, b = interval
        trace_device = epsilon.device if options.trace_storage == 'device' else torch.device('cpu')
        archive = torch.empty((project.region.steps, 2, *epsilon.shape[:2], 2),
                              dtype=torch.float32, device=trace_device)
        signals = epsilon.new_empty((project.region.steps, len(system.monitors)))
        maximum = norm = 0.
        started = time.perf_counter()
        for step in range(project.region.steps):
            _advance_recorded(system, step, archive[step], a, b)
            signals[step] = system.observe(system.state())
            if (step + 1) % 64 == 0 or step + 1 == project.region.steps:
                current_maximum, current_norm = _interior_scale(system, a, b)
                maximum = max(maximum, current_maximum)
                norm = max(norm, current_norm)
        chunk = report['diagnostic_chunk_elements']
        _require_finite(signals, 'Recorded CPML observations became nonfinite.', chunk)
        _require_finite(archive, 'Recorded CPML boundary trace became nonfinite.', chunk)
        terminal = tuple(value[:, :, a:b + 1].clone() for value in system.state()[:2])
        ctx.save_for_backward(epsilon, archive, *terminal)
        ctx.system, ctx.options, ctx.report = system, options, report
        ctx.interval, ctx.scale = interval, (maximum, norm)
        ctx.lock = threading.Lock()
        if epsilon.is_cuda:
            torch.cuda.synchronize(epsilon.device)
        report.update(forward_seconds=time.perf_counter() - started,
                      sampled_forward_peak=maximum, sampled_forward_l2=norm,
                      diagnostic_cadence_steps=64, terminal_copies=1,
                      checkpoint_replays=0, backward_calls=0)
        return signals

    @staticmethod
    def backward(ctx, signal_bar):
        if torch.is_grad_enabled():
            raise RuntimeError('ReversibleCPMLSimulation supports first derivatives only.')
        if not ctx.lock.acquire(blocking=False):
            raise RuntimeError('Concurrent backward calls on one recorded CPML result are not supported.')
        try:
            epsilon, archive, *terminal = ctx.saved_tensors
            system, report = ctx.system, ctx.report
            a, b = ctx.interval
            started = time.perf_counter()
            for target, value in zip(system.state()[:2], terminal):
                # Poison unneeded exterior primal values. No CPML primal
                # inversion or exterior material derivative may consume them.
                target.fill_(float('nan'))
                target[:, :, a:b + 1].copy_(value)
            gradient = torch.zeros_like(epsilon)
            from .reversible_cpml_kernels import InteriorReconstruction
            inverse = InteriorReconstruction(system, a, b, gradient, signal_bar)
            staging = (epsilon.new_empty(archive.shape[1:])
                       if archive.device != epsilon.device else None)
            for step in range(system.region.steps - 1, -1, -1):
                frame = archive[step]
                if staging is not None:
                    staging.copy_(frame)
                    frame = staging
                inverse.step(step, frame)
            absolute, l2 = _interior_scale(system, a, b)
            forward_peak, forward_l2 = ctx.scale
            relative_peak = absolute / forward_peak if forward_peak else (0. if absolute == 0 else math.inf)
            relative_l2 = l2 / forward_l2 if forward_l2 else (0. if l2 == 0 else math.inf)
            diagnostics = dict(initial_max_abs=absolute, initial_l2=l2,
                               initial_relative_peak=relative_peak,
                               initial_relative_l2=relative_l2,
                               inverse_steps=system.region.steps,
                               transpose_steps=system.region.steps)
            report['last_backward'] = diagnostics
            if max(relative_peak, relative_l2) > ctx.options.reconstruction_tolerance:
                raise RuntimeError('Recorded CPML reconstruction drift exceeds the declared tolerance. Rerun with checkpointed DifferentiableSimulation.')
            _require_finite(gradient, 'Recorded CPML material gradient is nonfinite.',
                            report['diagnostic_chunk_elements'])
            if epsilon.is_cuda:
                torch.cuda.synchronize(epsilon.device)
            report['backward_calls'] += 1
            diagnostics['seconds'] = time.perf_counter() - started
            return gradient, None, None, None, None
        finally:
            ctx.lock.release()


class ReversibleCPMLSimulation(torch.nn.Module):
    """Scalar material differentiation in a fixed, absorbing exterior.

    ``model(epsilon, fixed_epsilon=background)`` uses epsilon only on
    ``interior_z`` (inclusive indices). All other material values come from
    background, which must not require gradients. Consequently epsilon's
    exterior gradient is exactly zero by the actual forward definition.

    Both maps have the complete grid shape. Point sources are fixed impressed
    electric increments inside the reconstructed interval. The full resident
    CPML forward and adjoint are retained, while only four boundary planes
    per timestep and one interior terminal state replace checkpoint replay.
    """

    def __init__(self, project: Project, options: ReversibleCPMLOptions | None = None):
        super().__init__()
        self.project = Project.model_validate(project.model_dump())
        self.options = options or ReversibleCPMLOptions()
        if not isinstance(self.options, ReversibleCPMLOptions):
            raise ValueError('ReversibleCPMLSimulation requires ReversibleCPMLOptions.')
        _validate_project(self.project, self.options)

    def _snapshot(self):
        if not isinstance(self.options, ReversibleCPMLOptions):
            raise ValueError('ReversibleCPMLSimulation requires ReversibleCPMLOptions.')
        project = Project.model_validate(self.project.model_dump())
        return project, _validate_project(project, self.options)

    @property
    def interior_z(self):
        return self._snapshot()[1]

    def plan(self, *, device='cpu'):
        project, interval = self._snapshot()
        from .reversible_cpml_memory import _cpml_reversible_reservation
        return _cpml_reversible_reservation(project, self.options, torch.device(device), interval)

    def forward(self, epsilon, *, fixed_epsilon):
        project, interval = self._snapshot()
        for name, value in (('epsilon', epsilon), ('fixed_epsilon', fixed_epsilon)):
            if (not isinstance(value, torch.Tensor) or value.dtype != torch.float32
                    or value.device.type not in ('cpu', 'cuda') or value.layout != torch.strided
                    or not value.is_contiguous() or value.is_conj() or value.is_neg()
                    or tuple(value.shape) != project.region.shape):
                raise ValueError(f'{name} must be a contiguous resolved scalar FP32 CPU/CUDA tensor matching the region shape.')
        if fixed_epsilon.requires_grad:
            raise ValueError('fixed_epsilon must not require gradients. Only the explicit reconstruction interior is differentiable.')
        if fixed_epsilon.device != epsilon.device:
            raise ValueError('epsilon and fixed_epsilon must use the same device.')
        from .reversible_cpml_memory import _cpml_reversible_reservation
        reservation = _cpml_reversible_reservation(project, self.options, epsilon.device, interval)
        chunk = reservation['diagnostic_chunk_elements']
        for value in (epsilon, fixed_epsilon):
            flat = value.reshape(-1)
            for start in range(0, flat.numel(), chunk):
                block = flat[start:start + chunk]
                if not bool(torch.isfinite(block).all()) or bool((block < 1).any()):
                    raise ValueError('The recorded CPML CFL contract requires finite epsilon >= 1 in both maps.')
        if epsilon.is_cuda:
            from .cuda_bootstrap import prepare_cuda_kernels
            prepare_cuda_kernels()
        a, b = interval
        effective = fixed_epsilon.clone()
        effective[:, :, a:b + 1] = epsilon[:, :, a:b + 1]
        report = dict(experimental=True, adjoint='recorded-interface CPML reconstruction',
                      higher_order=False, full_time_autograd=False, spatial_streaming=False,
                      checkpoint_capacity=0, reconstruction_interval_z=[a, b],
                      reconstruction_tolerance=self.options.reconstruction_tolerance,
                      material_gradient_scope='interior only, exterior fixed by explicit background',
                      source_material_gradient='unrestricted interior, fixed impressed increments',
                      trace_transfers='synchronous', cpml_primal_inverted=False,
                      backend='fused CUDA' if epsilon.is_cuda else 'torch CPU', **reservation)
        signals = _RecordedCPML.apply(effective, project, self.options, interval, report)
        return DifferentiableResult(signals, project.region.time_step,
                                    tuple(m.component for m in project.monitors if m.enabled), report)
