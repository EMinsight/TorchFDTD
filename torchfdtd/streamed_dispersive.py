"""Lossless spatially streamed Yee/CPML/ADE with compact material derivatives.

Global P/Q banks put x first for contiguous slab I/O. Native tile kernels keep
the pole-first resident layout. Every boundary transfer includes the same Bloch
extension and Hermitian transpose as E/H. Material parameters have no phase.
"""
from dataclasses import dataclass
import math

import torch

from .differentiable import DifferentiableResult
from .dispersive_adjoint import DispersiveSimulation, _DispersiveSystem, _ParameterLayout
from .spacetime import SlabBlockOperator
from .tensor_packet import pack_tensors
from .streamed import StreamedSimulation, StreamedAdjointOptions, _Streamed, _StreamedExecution, _reservation


def _pole_state(state):
    return (*state[:-2], state[-2].movedim(0, 1), state[-1].movedim(0, 1))


def _slab_state(state):
    return (*state[:-2], state[-2].movedim(1, 0), state[-1].movedim(1, 0))


class _SlabDispersiveSystem(_DispersiveSystem):
    def state(self):
        return _slab_state(super().state())

    def reference_step(self, state, step, parameters):
        return _slab_state(super().reference_step(_pole_state(state), step, parameters))

    def transpose_step(self, state, adjoint, signal_bar):
        bars, gradient = super().transpose_step(_pole_state(state), _pole_state(adjoint), signal_bar)
        return _slab_state(bars), gradient


def _tile_layout(layout, width):
    shapes = []
    for index, shape in enumerate(layout.shapes):
        if index == 0:shape = (width, *shape[1:])
        elif len(shape) > 1:shape = (shape[0], width, *shape[2:])
        shapes.append(shape)
    return _ParameterLayout(tuple(shapes), layout.pole_count)


class DispersiveSlabBlockOperator(SlabBlockOperator):
    def _new_local(self):
        return object.__new__(_SlabDispersiveSystem)

    def _material_epsilon(self, material):
        if material.device.type != 'cpu' or material.shape != self.host.parameters.shape or material.dtype != self.host.dtype:
            raise ValueError('Packed ADE material must match the CPU host layout.')
        return self.host.layout.originals(material)[0]

    def _extra_payload(self, local, material, state, rows, phase, mapping, descriptor):
        _, _, indices, core = descriptor
        values = self.host.layout.originals(material)
        parameters = [local.epsilon]
        for value in values[1:]:
            parameters.append(value if value.ndim <= 1 else rows(value.movedim(1, 0)).movedim(0, 1))
        local.layout = _tile_layout(self.host.layout, len(indices))
        local.pole_count = local.layout.pole_count
        if self.workspace is not None:
            target = self.workspace.host_array('ade_material',
                (sum(v.numel() for v in parameters),), local.dtype)
            packed, _ = pack_tensors(parameters, out=target)
        else:
            packed, _ = pack_tensors(parameters)
        owned = torch.arange(core.start, core.stop)
        for index in (len(state)-2, len(state)-1):
            mapping.append((index, indices, owned, indices[owned]))
        # P/Q receive field phase. Shared or spatial material coefficients do not.
        p, q = (self._phase_value(rows(s), phase).movedim(0, 1) for s in state[-2:])
        return packed, p, q

    def _restore_payload(self, local, views):
        local.parameters, local.P, local.Q = [next(views) for _ in range(3)]
        local.epsilon = local.layout.originals(local.parameters)[0]
        local.eps4 = local.epsilon[..., None] if local.epsilon.ndim == 3 else local.epsilon

    def _prepare_kernel(self, local):
        if self.device.type == 'cuda':
            from .cuda_dispersive_adjoint import fused_ade_forward
            local.kernel = fused_ade_forward(local, buffers=self.workspace)

    def _prepare_permittivity(self, local):
        # ADE solves the coupled electric update directly. Native curl code
        # needs only this placeholder, not a tile-sized dielectric reciprocal.
        local.grid.inverse_permittivity = torch.ones(1, dtype=local.dtype, device=local.device)

    def _local_material(self, local):
        return local.parameters

    def _backward(self, local, gradient, samples):
        if self.device.type != 'cuda':return None
        from .cuda_dispersive_adjoint import FusedDispersiveAdjointCUDA
        return FusedDispersiveAdjointCUDA(local, gradient, samples, buffers=self.workspace)

    def _adjoint_state(self, backward):
        curl = backward.curl
        return (curl.e_bar, curl.h_bar, *curl.psi_bars[curl.phase],
                backward.p_bar.movedim(1, 0), backward.q_bar.movedim(1, 0))

    def _accumulate_gradient(self, gradient, contribution, indices):
        global_values = self.host.layout.originals(gradient)
        local_values = _tile_layout(self.host.layout, len(indices)).originals(contribution)
        for index, (target, value) in enumerate(zip(global_values, local_values)):
            if index == 0:target.index_add_(0, indices, value)
            elif target.ndim <= 1:target.add_(value)
            else:target.index_add_(1, indices, value)


@dataclass(frozen=True)
class _DispersiveExecution(_StreamedExecution):
    layout: _ParameterLayout
    operator_type = DispersiveSlabBlockOperator

    def host(self, project, value, spectral):
        epsilon = self.layout.originals(value)[0]
        return _SlabDispersiveSystem(project, epsilon, value, self.layout, prepare_updates=False,
            observation_monitors=None if spectral is None else spectral.observers)

    def reservation(self, project, value, options, spectral):
        epsilon = self.layout.originals(value)[0]
        return _reservation(project, epsilon, options, spectral, pole_count=self.layout.pole_count,
                            parameter_shapes=self.layout.shapes)


def estimate_streamed_dispersive_memory(project, parameter_shapes, options=None, *, frequency_hz=None, window=None):
    """Admit an ADE policy from four original input shapes, without field allocation.

    Shapes follow epsilon_inf, strength, omega0, gamma. For one shared pole:
    ``(project.region.shape, (1,), (), ())``. Spatial parameters keep their
    explicit pole axis. Includes P/Q banks, material gradients and tile replay.
    Caller-owned geometry graphs, optimizer allocations and OS cache are excluded.
    """
    options = options or StreamedAdjointOptions()
    from .adjoint_memory import _material_shapes
    shapes,poles=_material_shapes(project.region,parameter_shapes)
    epsilon = torch.empty(shapes[0],dtype=getattr(torch,project.region.precision),device='meta')
    if window is not None and frequency_hz is None:raise ValueError('A spectral window requires frequency_hz.')
    spectral = None
    if frequency_hz is not None:
        from .adjoint_spectrum import SpectralObservation
        spectral = SpectralObservation(torch.empty((),dtype=epsilon.dtype,device='cpu'),project.region,
            [m.component for m in project.monitors if m.enabled],frequency_hz,window)
    report = _reservation(project,epsilon,options,spectral,pole_count=poles,parameter_shapes=shapes)
    if spectral is not None:report.update(spectral.reservation(min(options.temporal_depth,project.region.steps)))
    return report


class StreamedDispersiveSimulation(StreamedSimulation):
    """First-order epsilon-infinity, strength, omega0 and gamma derivatives.

    Same SI material inputs as DispersiveSimulation, supplied on CPU. Only
    extended slabs reach CUDA. E/H, CPML and P/Q banks use the selected host or
    file tier. Soft sources and fixed point/spectral observations are supported.
    CUDA tiles use fused ADE forward and transpose. This is experimental and
    does not establish large-problem throughput or optical convergence.
    """
    _explicit_dispersive_parameters = True

    def __init__(self, project, options=None):
        super().__init__(project, options)
        from .boundaries import reject_pmc_faces
        reject_pmc_faces(self.project.region, 'StreamedDispersiveSimulation')
        if self.streaming_options.cuda_binding != 'direct':
            raise ValueError('Streamed ADE kernels currently require cuda_binding="direct".')
        if any(s.enabled and s.injection != 'soft' for s in self.project.sources):
            raise ValueError('Streamed ADE differentiation currently requires soft source injection.')

    def _evaluate(self, epsilon, strength, omega0, gamma, spectral):
        options = self.streaming_options
        reservation = {}
        def admit(layout):
            reservation.update(_reservation(self.project, epsilon, options, spectral,
                pole_count=layout.pole_count, parameter_shapes=layout.shapes))
        parameters, layout = DispersiveSimulation._pack(self, epsilon, strength, omega0, gamma,
                                                        streamed=True, admission=admit)
        region = self.project.region
        report = dict(experimental=True, spatial_streaming=True, full_time_autograd=False,
            complex_fields=region.complex_fields, higher_order=False,
            slab_width=options.slab_width, temporal_depth=options.temporal_depth,
            checkpoint_capacity=options.checkpoints, local_checkpoint_capacity=options.local_checkpoints,
            state_storage=options.state_storage, execution_device=options.device,
            tile_transfers=options.tile_transfers, tile_buffers=options.tile_buffers if options.tile_transfers == 'async' else 1,
            cuda_binding='direct' if torch.device(options.device).type == 'cuda' else options.cuda_binding,
            reuse_tile_buffers=options.reuse_tile_buffers, policy='manual', precision=str(epsilon.dtype),
            adjoint='space-time tiled Yee/CPML/trapezoidal ADE', oscillator_count=layout.pole_count,
            material_parameter_bytes=parameters.numel()*parameters.element_size(),
            material_state_bytes=6*layout.pole_count*math.prod(region.shape)*epsilon.element_size()*(2 if region.complex_fields else 1),
            material_parameter_layout='compact original shapes with halo reduction and shared-parameter sums',
            forward_backend='fused CUDA ADE' if torch.device(options.device).type == 'cuda' else 'torch CPU',
            backward_backend='fused CUDA ADE transpose' if torch.device(options.device).type == 'cuda' else 'torch explicit ADE transpose',
            observation_storage='time_history' if spectral is None else 'online_spectrum', **reservation)
        if spectral is not None:report.update(spectral.reservation(min(options.temporal_depth, region.steps)))
        signals = _Streamed.apply(parameters, self.project, options, report, spectral, _DispersiveExecution(layout))
        if spectral is not None:return spectral.result(signals, report)
        return DifferentiableResult(signals, region.time_step,
            tuple(m.component for m in self.project.monitors if m.enabled), report)

    def forward(self, epsilon_inf, strength, omega0, gamma):
        return self._evaluate(epsilon_inf, strength, omega0, gamma, None)

    def spectrum(self, epsilon_inf, strength, omega0, gamma, frequency_hz, *, window=None, block_size=32):
        from .adjoint_spectrum import SpectralObservation
        spectral = SpectralObservation(epsilon_inf, self.project.region,
            [m.component for m in self.project.monitors if m.enabled], frequency_hz, window, block_size)
        return self._evaluate(epsilon_inf, strength, omega0, gamma, spectral)
