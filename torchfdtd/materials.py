"""Passive isotropic Drude/Lorentz sums, using a coupled trapezoidal ADE.

E uses exp(-i omega t). P is relative polarization and Q = dt*dP/dt.
Trapezoidal integration solves E and the oscillator together at each cell.
The scaled current Q avoids femtosecond-scale overflow in float32.
"""
from __future__ import annotations

import numpy as np
import torch


def permittivity(material, frequency_hz, dt=0):
    f = np.asarray(frequency_hz, dtype=float)
    if np.any(~np.isfinite(f)) or np.any(f <= 0):
        raise ValueError('Material frequencies must be finite and positive.')
    if not np.isfinite(dt) or dt < 0 or (dt and np.any(f*dt >= .5)):
        raise ValueError('Material timestep must be nonnegative and frequencies below Nyquist.')
    omega = 2*np.pi*f if not dt else 2/dt*np.tan(np.pi*f*dt)
    epsilon = np.full(f.shape, material.instantaneous_epsilon, dtype=complex)
    for w0, strength, gamma in material.oscillators:
        with np.errstate(divide='ignore', invalid='ignore'):
            epsilon += strength/(w0*w0-omega*omega-1j*gamma*omega)
    return epsilon


class MaterialADE:
    """State only at the final, non-overlapping cells owned by one material."""
    def __init__(self, grid, material, indices, components=False):
        self.torch = grid.is_torch
        self.indices = (torch.as_tensor(indices, device=grid.E.device, dtype=torch.long)
                        if self.torch else indices)
        self.components = components
        sample_shape = (len(indices),) if components else (len(indices),3)
        self.oscillators = material.oscillators
        if not self.oscillators:
            raise ValueError('MaterialADE requires at least one oscillator.')
        # Retain the old single-pole array layout and operation order.
        self.multiple = len(self.oscillators) > 1
        shape = (len(self.oscillators), *sample_shape) if self.multiple else sample_shape
        self.P = grid._zeros(shape)
        self.Q = grid._zeros(shape)
        grid.memory_states.extend((self.P, self.Q))
        rates = np.asarray(self.oscillators, dtype=float)
        if self.multiple:
            rates = rates.reshape(len(rates), 3, *([1]*len(sample_shape)))
            w0, strength, gamma = (rates[:, j] for j in range(3))
        else:
            w0, strength, gamma = rates[0]
        dt = grid.time_step
        denominator = 1 + .5*gamma*dt + .25*(w0*dt)**2
        def coefficient(value):
            return grid._coefficient(value) if self.multiple else float(value)
        self.a = coefficient(.5*(w0*dt)**2)
        self.d = coefficient(denominator)
        self.k = coefficient(strength*dt*dt/(4*denominator))
        self.k_sum = self.k.sum(axis=0) if self.multiple else self.k
        self.eps = material.epsilon_inf

    def take(self, field):
        flat = field.reshape(-1) if self.components else field.reshape(-1, 3)
        return flat.index_select(0, self.indices) if self.torch else flat[self.indices]

    def prepare(self, field):
        return self.take(field), (self.Q-self.a*self.P)/self.d

    def correct(self, field, old, response):
        free = self.take(field)
        total_response = response.sum(axis=0) if self.multiple else response
        new = (self.eps*free-self.k_sum*old-total_response)/(self.eps+self.k_sum)
        delta = response+self.k*(new+old)
        self.P += delta
        self.Q *= -1
        self.Q += 2*delta
        flat = field.reshape(-1) if self.components else field.reshape(-1, 3)
        if self.torch:
            flat.index_copy_(0, self.indices, new)
        else:
            flat[self.indices] = new


def configure_materials(grid, project, ownership):
    grid.material_states = [MaterialADE(grid, m, np.flatnonzero(ownership.reshape(-1) == i), ownership.ndim == 4)
                            for i, m in enumerate(project.materials)
                            if m.oscillators and np.any(ownership == i)]
