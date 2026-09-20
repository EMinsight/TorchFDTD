"""Experimental full-tensor periodic Yee dielectric and discrete adjoint.

Node-sampled real symmetric epsilon >= I. Eight incident edge triplets define
an SPD inverse constitutive operator. Not anisotropic interface homogenization.
Soft sources are impressed field increments, not calibrated current sources.
"""
from dataclasses import replace
from itertools import product
import math

import torch

from .differentiable import (AdjointOptions, DifferentiableSimulation,
                            DifferentiableResult, _System, _FDTD, _Checkpoints)


def _shift(value, axis, forward, phase):
    """Read neighbor along an axis with the physical Bloch seam convention."""
    result = torch.roll(value, -1 if forward else 1, axis)
    edge = [slice(None)] * 3
    edge[axis] = -1 if forward else 0
    result[tuple(edge)] *= phase if forward else 1 / phase
    return result


class TensorConstitutive:
    """Matrix-free S = sum R^dagger epsilon^-1 R / 8.

    epsilon has shape (Nx,Ny,Nz,3,3), at common mesh nodes. Caller must admit
    storage and validate epsilon first. No global sparse/dense matrix is built.
    """
    def __init__(self, epsilon, phases=(1., 1., 1.)):
        self.inverse = torch.linalg.inv(epsilon)
        self.phases = tuple(phases)

    def gather(self, field, signs):
        return torch.stack([_shift(field[..., a], a, False, self.phases[a])
                            if signs[a] else field[..., a] for a in range(3)], -1)

    def scatter(self, field, signs):
        return torch.stack([_shift(field[..., a], a, True, self.phases[a])
                            if signs[a] else field[..., a] for a in range(3)], -1)

    def multiply(self, field):
        # Multiplication instead of a dtype-converting full coefficient copy.
        return sum(self.inverse[..., :, a] * field[..., a, None] for a in range(3))

    def apply(self, field):
        result = torch.zeros_like(field)
        for signs in product((0, 1), repeat=3):
            result = result + self.scatter(self.multiply(self.gather(field, signs)), signs) / 8
        return result

    def epsilon_vjp(self, field, output_bar):
        gradient = torch.zeros_like(self.inverse)
        for signs in product((0, 1), repeat=3):
            right = self.multiply(self.gather(field, signs))
            left = self.multiply(self.gather(output_bar, signs))
            gradient -= (left.conj()[..., :, None] * right[..., None, :]).real / 8
        return (gradient + gradient.transpose(-1, -2)) / 2


class _TensorSystem(_System):
    def __init__(self, project, epsilon, observation_monitors=None):
        carrier = epsilon.new_ones(()).expand(project.region.shape)
        super().__init__(project, carrier, prepare_kernels=False,
                         prepare_permittivity=False, observation_monitors=observation_monitors)
        self.epsilon = epsilon
        self.operator = TensorConstitutive(epsilon, tuple(self.grid.wrap[a] for a in range(3)))

    def reference_step(self, state, step, epsilon):
        e, h = state
        curl, _ = self.curl(h, (), False)
        e = self.inject(e + self.grid.courant_number * self.operator.apply(curl),
                        'E', step, functional=True)
        curl, _ = self.curl(e, (), True)
        h = self.inject(h - self.grid.courant_number * curl, 'H', step, functional=True)
        return e, h

    def advance(self, start, end):
        for step in range(start, end):
            new = self.reference_step(self.state(), step, self.epsilon)
            for target, value in zip(self.state(), new):
                target.copy_(value)
        self.current_step = end

    def transpose_step(self, state, adjoint, signal_bar):
        e_bar, h_bar = adjoint
        for target, (positions, indices) in zip(adjoint, self.observation_maps):
            if indices.numel():
                target.reshape(-1).index_add_(0, indices, signal_bar.index_select(0, positions))
        courant = self.grid.courant_number
        contribution, _ = self.curl_transpose(-courant * h_bar, (), True)
        e_bar = e_bar + contribution
        curl, _ = self.curl(state[1], (), False)
        gradient = courant * self.operator.epsilon_vjp(curl, e_bar)
        contribution, _ = self.curl_transpose(courant * self.operator.apply(e_bar), (), False)
        return (e_bar, h_bar + contribution), gradient


class TensorDielectricSimulation(DifferentiableSimulation):
    """Checkpointed epsilon-to-point-signals for node-sampled full tensors.

    CPU/CUDA FP32 (default) or FP64 diagnostics, uniform rectangular 3D grids, all
    axes periodic/Bloch, fixed nondispersive tensors with eigenvalues >= 1.
    forward() and spectrum() return the native result types. First derivatives
    only. Caller optimizer/material-construction graphs are outside admission.
    host_budget_bytes bounds total host reservation for this API.
    """
    def __init__(self, project, options=None):
        options = options or AdjointOptions()
        if options.backward_kernel == 'fused':
            raise ValueError('Full-tensor fused kernels are not validated.')
        super().__init__(project, replace(options, backward_kernel='torch'))
        self._validate_project()

    def _validate_project(self):
        p, r = self.project, self.project.region
        if r.dimension != '3d' or r.mesh_type != 'uniform':
            raise ValueError('Tensor dielectric requires a uniform rectangular 3D grid.')
        if r.memory_mode == 'streamed':
            raise ValueError('Tensor spatial streaming is not implemented.')
        if any(face.kind not in ('periodic', 'bloch')
               for a in range(3) for face in r.boundaries.pair(a)):
            raise ValueError('Tensor dielectric requires periodic/Bloch faces, without CPML or walls.')
        if any(n < 2 for n in r.shape):
            raise ValueError('Tensor dielectric requires at least two cells on every axis.')
        if r.interface_method != 'staircase' or r.material_sampling != 'yee':
            raise ValueError('Tensor dielectric uses explicit node tensors and Yee fields, without subpixel geometry.')
        if any(m.oscillators for m in p.materials):
            raise ValueError('Full-tensor ADE is not implemented.')
        if any(s.enabled and (s.injection != 'soft' or s.kind == 'tfsf') for s in p.sources):
            raise ValueError('Only soft impressed-field sources are supported, not one-way/modal/current injection.')

    def _validate_input_shape(self, epsilon):
        self._validate_project()
        r = self.project.region
        if not isinstance(epsilon, torch.Tensor) or epsilon.dtype not in (torch.float32, torch.float64):
            raise ValueError('epsilon must be a real FP32/FP64 tensor.')
        if epsilon.device.type not in ('cpu', 'cuda'):
            raise ValueError('Tensor dielectric supports CPU/CUDA only.')
        if epsilon.shape != r.shape + (3, 3):
            raise ValueError('epsilon must have node-grid shape (Nx,Ny,Nz,3,3).')
        if (epsilon.dtype == torch.float64) != (r.precision == 'float64'):
            raise ValueError('epsilon precision must match the region.')

    def reservation(self, spectral=None, *, device='cpu'):
        """Preallocation bound, including tensor coefficients and VJP workspace."""
        from .adjoint_memory import _resident_reservation
        from .memory_profile import host_memory
        device = torch.device(device)
        base = _resident_reservation(self.project, self.options, device, spectral)
        r = self.project.region
        # Caller tensor, detached inverse, inversion/eigenvalue validation,
        # material gradient and outer products, eight-triplet sequential scratch.
        # Native field/replay workspace and observation history are in base.
        extra = math.prod(r.shape) * (8 if r.precision == 'float64' else 4) * 192
        # Cold CUDA linear-algebra/allocator allowance, not a measured peak.
        library = 64 * 1024**2 if device.type == 'cuda' else 0
        extra += library
        host = base['host_reservation_bytes'] + (extra if device.type == 'cpu' else 0)
        active = base['memory_reservation_bytes'] + extra
        if self.options.host_budget_bytes is not None and host > self.options.host_budget_bytes:
            raise ValueError('Full-tensor reservation exceeds the explicit host byte budget.')
        if self.options.resident_budget_bytes is not None and active > self.options.resident_budget_bytes:
            raise ValueError('Full-tensor reservation exceeds the explicit resident byte budget.')
        available = host_memory()['available_bytes']
        if available is not None and host > .8 * available:
            raise ValueError('Full-tensor reservation exceeds available host memory.')
        if device.type == 'cuda':
            from .cuda_memory import cuda_budget_limit
            if active > cuda_budget_limit(device, active, self.options.gpu_budget_bytes):
                raise ValueError('Full-tensor reservation exceeds the GPU byte budget.')
        return dict(base, host_reservation_bytes=host,
                    memory_reservation_bytes=active,
                    gpu_reservation_bytes=active if device.type == 'cuda' else 0,
                    tensor_reservation_bytes=extra, tensor_cuda_library_allowance_bytes=library)

    def _run(self, epsilon, spectral):
        self._validate_input_shape(epsilon)
        report = self.reservation(spectral, device=epsilon.device)
        # No full-volume validation temporary or inverse before admission.
        with torch.no_grad():
            if not bool(torch.isfinite(epsilon).all()):
                raise ValueError('epsilon must be finite.')
            if not torch.equal(epsilon, epsilon.transpose(-1, -2)):
                raise ValueError('epsilon must be exactly symmetric. Construct it symmetrically.')
            if bool((torch.linalg.eigvalsh(epsilon) < 1).any()):
                raise ValueError('The conservative CFL requires eigenvalues of epsilon >= 1.')
            system = _TensorSystem(self.project.model_copy(deep=True), epsilon,
                                   None if spectral is None else spectral.observers)
        report.update(experimental=True, adjoint='full-tensor Yee explicit transpose',
                      higher_order=False, spatial_streaming=False, full_time_autograd=False,
                      forward_backend='torch ' + epsilon.device.type.upper(), backward_backend='torch explicit transpose',
                      tensor_sampling='common mesh nodes, eight incident edge triplets',
                      source_contract='soft impressed-field increments',
                      steps=system.region.steps)
        admission = _Checkpoints(system, self.options, report, admission=True)
        admission.close()
        signals = _FDTD.apply(epsilon, system, self.options, report, spectral)
        if spectral is not None:
            return spectral.result(signals, report)
        return DifferentiableResult(signals, system.region.time_step,
                                    tuple(m.component for m in self.project.monitors if m.enabled), report)

    def reference(self, epsilon):
        raise NotImplementedError('Use the bounded tensor tests as an independent oracle, not the diagonal reference.')
