"""Explicit transpose of coupled trapezoidal Drude/Lorentz and Yee/CPML.

P is relative polarization and Q = dt*dP/dt. No timestep autograd graph is
retained by the production solve. Material inputs replace scene assignments.
"""
from dataclasses import dataclass, replace
import math

import torch

from .differentiable import AdjointOptions, DifferentiableSimulation, _System


@dataclass(frozen=True)
class _ParameterLayout:
    """Original parameter shapes and their unexpanded Yee broadcast views."""
    shapes: tuple
    pole_count: int

    def views(self, flat):
        values = flat.split([math.prod(shape) for shape in self.shapes])
        return tuple(value.reshape(self.view_shape(i)) for i, value in enumerate(values))

    def originals(self, flat):
        values = flat.split([math.prod(shape) for shape in self.shapes])
        return tuple(value.reshape(shape) for value, shape in zip(values, self.shapes))

    def view_shape(self, index):
        shape = self.shapes[index]
        if index == 0:
            return (*shape, 1) if len(shape) == 3 else shape
        if len(shape) == 0:
            return (1, 1, 1, 1, 1)
        if len(shape) == 1:
            return (*shape, 1, 1, 1, 1)
        return (*shape, 1) if len(shape) == 4 else shape

    def transpose(self, gradients):
        return torch.cat([value.sum_to_size(self.view_shape(i)).reshape(-1)
                          for i, value in enumerate(gradients)])


class _DispersiveSystem(_System):
    def __init__(self, project, epsilon, parameters, layout, *, fused_forward=False, fused_backward=False, **kwargs):
        super().__init__(project, epsilon, prepare_kernels=False, prepare_permittivity=False, **kwargs)
        self.parameters = parameters.detach()
        self.layout = layout
        self.pole_count = layout.pole_count
        shape = (self.pole_count, *self.grid.E.shape)
        if kwargs.get('prepare_updates', True):
            self.P = torch.zeros(shape, dtype=self.field_dtype, device=self.device)
            self.Q = torch.zeros_like(self.P)
        else:
            self.P = torch.zeros((), dtype=self.field_dtype, device=self.device).expand(shape)
            self.Q = torch.zeros((), dtype=self.field_dtype, device=self.device).expand(shape)
        if fused_forward or fused_backward:
            # The ADE kernel replaces the dielectric final update. Its shared
            # curl generator only needs a scalar placeholder, not 3*N inverses.
            self.grid.inverse_permittivity = torch.ones(1,dtype=self.dtype,device=self.device)
        if fused_forward:
            from .cuda_dispersive_adjoint import fused_ade_forward
            self.kernel = fused_ade_forward(self)

    def fused_adjoint(self, gradient, signal_bar):
        from .cuda_dispersive_adjoint import FusedDispersiveAdjointCUDA
        return FusedDispersiveAdjointCUDA(self,gradient,signal_bar)

    def state(self):
        return (*super().state(), self.P, self.Q)

    def coefficients(self, parameters):
        eps, strength, frequency2, damping = self.layout.views(parameters)
        a = .5*frequency2
        d = 1 + .5*damping + .25*frequency2
        k = strength/(4*d)
        return eps, a, d, k

    def electric_step(self, state, parameters):
        e, h = state[:2]
        p, q = state[-2:]
        curl, psis = self.curl(h, state[2:-2], False)
        eps, a, d, k = self.coefficients(parameters)
        response = (q-a*p)/d
        k_sum = k.sum(0)
        new = ((eps-k_sum)*e + self.grid.courant_number*curl - response.sum(0))/(eps+k_sum)
        delta = response + k*(new+e)
        return new, p+delta, -q+2*delta, psis, response

    def reference_step(self, state, step, parameters):
        e, p, q, psis, _ = self.electric_step(state, parameters)
        e = self.inject(e, 'E', step, functional=True)
        curl, psis = self.curl(e, psis, True)
        h = self.inject(state[1]-self.grid.courant_number*curl, 'H', step, functional=True)
        return (e, h, *psis, p, q)

    def advance(self, start, end):
        for step in range(start, end):
            if self.kernel is not None:
                self.kernel.update_E(); self.inject(self.grid.E,'E',step)
                self.kernel.update_H(); self.inject(self.grid.H,'H',step)
            else:
                new = self.reference_step(self.state(), step, self.parameters)
                for target, value in zip(self.state(), new):
                    target.copy_(value)
        self.current_step = end

    def transpose_step(self, state, adjoint, signal_bar):
        e_bar, h_bar = adjoint[:2]
        p_bar, q_bar = adjoint[-2:]
        psi_bar = adjoint[2:-2]
        for target, (positions, indices) in zip((e_bar, h_bar), self.observation_maps):
            if indices.numel():
                target.reshape(-1).index_add_(0, indices, signal_bar.index_select(0, positions))
        contribution, psi_bar = self.curl_transpose(-self.grid.courant_number*h_bar, psi_bar, True)
        e_bar = e_bar + contribution
        old = state[0]
        p = state[-2]
        new, _, _, _, response = self.electric_step(state, self.parameters)
        eps, a, d, k = self.coefficients(self.parameters)
        # Source injection follows ADE correction and does not enter P or Q.
        delta_bar = p_bar + 2*q_bar
        common = (k*delta_bar).sum(0)
        new_bar = e_bar + common
        denominator = eps+k.sum(0)
        numerator_bar = new_bar/denominator
        denominator_bar = -(new_bar.conj()*new).real/denominator
        old_bar = common + (eps-k.sum(0))*numerator_bar
        eps_bar = (numerator_bar.conj()*old).real + denominator_bar
        k_bar = (delta_bar.conj()*(new+old)).real - (numerator_bar.conj()*old).real + denominator_bar
        response_bar = delta_bar - numerator_bar
        previous_p_bar = p_bar - a*response_bar/d
        previous_q_bar = -q_bar + response_bar/d
        a_bar = -(response_bar.conj()*p).real/d
        d_bar = -(response_bar.conj()*response).real/d - k_bar*k/d
        strength_bar = k_bar/(4*d)
        frequency2_bar = .5*a_bar + .25*d_bar
        damping_bar = .5*d_bar
        contribution, psi_bar = self.curl_transpose(self.grid.courant_number*numerator_bar, psi_bar, False)
        gradient = self.layout.transpose((eps_bar, strength_bar, frequency2_bar, damping_bar))
        return (old_bar, h_bar+contribution, *psi_bar, previous_p_bar, previous_q_bar), gradient


class DispersiveSimulation(DifferentiableSimulation):
    """First-order derivatives of epsilon-infinity and passive oscillator fields.

    ``model(epsilon_inf, strength, omega0, gamma)`` uses angular frequencies in
    rad/s and oscillator strength in (rad/s)^2. Pole axis comes first. Strength
    accepts (P,), (P,Nx,Ny,Nz), or (P,Nx,Ny,Nz,3). omega0 and gamma also accept a
    scalar. Pole-vector lengths must match P. Scalars share a rate across poles.
    omega0=0 gives Drude. All parameters may retain a Torch geometry graph.

    Uses Torch CPU/CUDA or explicit fused CUDA updates and transpose, with the
    resident checkpoint tiers. ADE spatial streaming remains pending.
    """
    _explicit_dispersive_parameters = True

    def __init__(self, project, options=None):
        options = options or AdjointOptions()
        if not isinstance(options, AdjointOptions):
            raise ValueError('DispersiveSimulation requires resident AdjointOptions. Use StreamedDispersiveSimulation for spatial streaming.')
        # Keep the Torch fallback as auto until application-scale performance
        # comparisons establish when native ADE kernels are beneficial.
        super().__init__(project, replace(options, backward_kernel='torch') if options.backward_kernel=='auto' else options)
        if any(s.enabled and s.injection != 'soft' for s in self.project.sources):
            raise ValueError('Dispersive differentiation currently requires soft source injection.')

    def _inputs(self, epsilon, strength, omega0, gamma, *, reference=False, streamed=False):
        r = self.project.region
        if not streamed:r.require_resident()
        elif not isinstance(epsilon, torch.Tensor) or epsilon.device.type != 'cpu':
            raise ValueError('Streamed epsilon_inf must be a CPU tensor.')
        if not isinstance(epsilon, torch.Tensor) or epsilon.dtype not in (torch.float32, torch.float64):
            raise ValueError('epsilon_inf must be a real FP32/FP64 tensor.')
        if tuple(epsilon.shape) not in (r.shape, r.shape+(3,)):
            raise ValueError('epsilon_inf shape must match the grid, optionally with three components.')
        if epsilon.device.type not in ('cpu', 'cuda') or (epsilon.dtype == torch.float64) != (r.precision == 'float64'):
            raise ValueError('epsilon_inf device and precision must match the resident CPU/CUDA contract.')
        if not bool(torch.isfinite(epsilon).all()) or bool((epsilon < 1).any()):
            raise ValueError('epsilon_inf must be finite and at least one.')
        def tensor(value):
            raw = value if isinstance(value, torch.Tensor) else torch.as_tensor(value)
            if raw.is_complex():
                raise ValueError('Oscillator parameters must be real.')
            result = torch.as_tensor(value, device=epsilon.device, dtype=epsilon.dtype)
            if not bool(torch.isfinite(result).all()) or bool((result < 0).any()):
                raise ValueError('Passive oscillator parameters must be finite and nonnegative.')
            return result
        strength, omega0, gamma = (tensor(v) for v in (strength, omega0, gamma))
        if strength.ndim == 0 or not 1 <= strength.shape[0] <= 64:
            raise ValueError('Strength needs a leading pole axis of length 1 to 64.')
        count = strength.shape[0]
        if reference and math.prod(r.shape)*r.steps*(1+count)>2_000_000:
            raise ValueError('Full-autograd ADE oracle is restricted to two million pole-cell-steps.')
        for value in (strength, omega0, gamma):
            if value.shape not in ((), (count,), (count, *r.shape), (count, *r.shape, 3)):
                raise ValueError('Oscillator shape must be scalar, (P,), (P,Nx,Ny,Nz), or (P,Nx,Ny,Nz,3).')
        layout = _ParameterLayout(tuple(tuple(value.shape) for value in (epsilon, strength, omega0, gamma)), count)
        return (epsilon, strength, omega0, gamma), layout

    def _pack(self, epsilon, strength, omega0, gamma, *, reference=False, streamed=False, admission=None):
        values, layout = DispersiveSimulation._inputs(self, epsilon, strength, omega0, gamma,
                                                     reference=reference, streamed=streamed)
        epsilon, strength, omega0, gamma = values
        r = self.project.region
        if admission is not None:admission(layout)
        packed_bytes = (epsilon.numel()+sum(v.numel() for v in (strength,omega0,gamma)))*epsilon.element_size()
        if epsilon.is_cuda:
            free, _ = torch.cuda.mem_get_info(epsilon.device)
            if packed_bytes > min(int(free*.8), self.options.gpu_budget_bytes or int(free*.8)):
                raise ValueError('Oscillator parameter packing exceeds the GPU budget.')
        # Scale before broadcasting. The large physical rates are never squared
        # prior to multiplication by dt, avoiding avoidable FP32 overflow.
        dt = r.time_step
        normalized = [strength*dt*dt, (omega0*dt).square(), gamma*dt]
        if any(not bool(torch.isfinite(v).all()) for v in normalized):
            raise ValueError('Normalized oscillator coefficients overflow this precision.')
        values = (epsilon, *normalized)
        return torch.cat([value.reshape(-1) for value in values]), layout

    def _evaluate(self, epsilon, strength, omega0, gamma, spectral):
        from .adjoint_memory import _resident_reservation
        def admit(layout):
            _resident_reservation(self.project,self.options,epsilon.device,spectral,
                pole_count=layout.pole_count,parameter_elements=sum(math.prod(s) for s in layout.shapes))
        parameters, layout = self._pack(epsilon, strength, omega0, gamma,admission=admit)
        count = layout.pole_count
        n = math.prod(self.project.region.shape)
        real_item = epsilon.element_size()
        field_item = real_item*(2 if self.project.region.complex_fields else 1)
        fused_forward = epsilon.is_cuda and self.project.region.cuda_kernel == 'fused'
        fused_backward = epsilon.is_cuda and self.options.backward_kernel == 'fused'
        def factory(project, value, **kwargs):
            return _DispersiveSystem(project, value, parameters, layout,
                                     fused_forward=fused_forward,fused_backward=fused_backward,**kwargs)
        result = super()._run(epsilon, spectral, system_factory=factory, autograd_input=parameters,
            pole_count=count,material_parameter_elements=parameters.numel())
        result.report.update(adjoint='discrete Yee/CPML/trapezoidal ADE',
            forward_backend='fused CUDA ADE' if fused_forward else 'torch CUDA' if epsilon.is_cuda else 'torch CPU',
            backward_backend='fused CUDA ADE transpose' if fused_backward else 'torch explicit ADE transpose', oscillator_count=count,
            material_state_bytes=6*count*n*field_item,
            material_parameter_bytes=parameters.numel()*real_item,
            material_parameter_layout='compact original shapes with broadcast transpose reductions',
            material_parameters='epsilon_inf, strength [(rad/s)^2], omega0 [rad/s], gamma [rad/s]')
        return result

    def forward(self, epsilon_inf, strength, omega0, gamma):
        return self._evaluate(epsilon_inf, strength, omega0, gamma, None)

    def spectrum(self, epsilon_inf, strength, omega0, gamma, frequency_hz, *, window=None, block_size=32):
        from .adjoint_spectrum import SpectralObservation
        spectral = SpectralObservation(epsilon_inf, self.project.region,
            [m.component for m in self.project.monitors if m.enabled], frequency_hz, window, block_size)
        return self._evaluate(epsilon_inf, strength, omega0, gamma, spectral)

    def reference(self, epsilon_inf, strength, omega0, gamma):
        parameters, layout = self._pack(epsilon_inf, strength, omega0, gamma, reference=True)
        system = _DispersiveSystem(self.project, epsilon_inf, parameters, layout)
        state = tuple(torch.zeros_like(x) for x in system.state())
        signals = []
        for step in range(self.project.region.steps):
            state = system.reference_step(state, step, parameters)
            signals.append(system.observe(state))
        return torch.stack(signals)


from .adjoint_planes import DifferentiablePlaneSimulation


class DispersivePlaneSimulation(DifferentiablePlaneSimulation):
    """Fixed spectral planes, flux and normalization with ADE material VJPs."""
    _resident_model_type = DispersiveSimulation

    @property
    def _streamed_model_type(self):
        from .streamed_dispersive import StreamedDispersiveSimulation
        return StreamedDispersiveSimulation

    def __init__(self, project, options=None, *, quadrature_counts=None):
        from .streamed import StreamedAdjointOptions
        if options is not None and not isinstance(options, (AdjointOptions, StreamedAdjointOptions)):
            raise ValueError('Dispersive planes require AdjointOptions or StreamedAdjointOptions.')
        super().__init__(project, options, quadrature_counts=quadrature_counts)

    def forward(self, epsilon_inf, strength, omega0, gamma, frequency_hz, *, block_size=32):
        return self._planes(epsilon_inf, frequency_hz, block_size,
            lambda spectral: self.model._evaluate(epsilon_inf, strength, omega0, gamma, spectral))
