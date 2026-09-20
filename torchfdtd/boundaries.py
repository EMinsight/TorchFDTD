"""Yee derivatives with true unit-cell wrapping and stretched-coordinate CPML.

Periodic axes contain N independent cells, with period N*dx, not two copied
end planes. Bloch fields obey F(r+L) = exp(+i*phase) F(r). CPML applies
D/kappa + psi and psi <- b*psi + c*D to each transverse derivative.
"""
from __future__ import annotations

import cmath
import math

import fdtd
import numpy as np
import torch


# (derivative axis, input component, output component, curl sign)
CURL_TERMS = ((0, 2, 1, -1), (0, 1, 2, 1),
              (1, 2, 0, 1), (1, 0, 2, -1),
              (2, 1, 0, -1), (2, 0, 1, 1))


def _slice(axis, value, component=None):
    parts = [slice(None)] * 3
    parts[axis] = value
    if component is not None:
        parts.append(component)
    return tuple(parts)


class YeeGrid(fdtd.Grid):
    """Extend the open-source fdtd grid with complex fields and native CPML."""
    def __init__(self, region):
        region.require_resident()
        super().__init__(shape=region.shape, grid_spacing=region.reference_step * 1e-6,
                         courant_number=region.courant_factor/math.sqrt(2 if region.dimension == '2d' else 3))
        # fdtd validates a cubic-grid Courant number in its constructor. The
        # native metric curls below use the independently validated rectangular CFL.
        self.courant_number=region.rectangular_courant
        self.time_step=region.time_step
        self.region = region
        self.is_torch = isinstance(self.E, torch.Tensor)
        if region.complex_fields:
            if self.is_torch:
                kind = torch.complex128 if region.precision == 'float64' else torch.complex64
                self.E, self.H = self.E.to(kind), self.H.to(kind)
            else:
                kind = np.complex128 if region.precision == 'float64' else np.complex64
                self.E, self.H = self.E.astype(kind), self.H.astype(kind)
        self._prepare_boundaries(region)

    def _prepare_boundaries(self,region):
        self.wrap = {}
        # PEC planes are exactly mesh endpoints. Upper tangential E is a
        # zero ghost node. Lower tangential E / normal H are zero states.
        self.pec_upper = {
            axis: float(region.reference_step / (nodes[-1]-nodes[-2]))
            for axis, nodes in enumerate(region.mesh_nodes)
            if region.shape[axis] > 1 and region.boundaries.pair(axis)[1].kind in ('pec', 'antisymmetric')
        }
        self.metric = {}
        if region.mesh_type != 'uniform' or region.mesh_steps is not None:
            for axis, nodes in enumerate(region.mesh_nodes):
                if region.shape[axis] == 1: continue
                widths = np.diff(nodes)
                if np.allclose(widths,region.reference_step,rtol=1e-10,atol=0): continue
                shape = [1, 1, 1]; shape[axis] = len(widths)-1
                self.metric[True, axis] = (self._coefficient((region.reference_step/widths[:-1]).reshape(shape)), float(region.reference_step/widths[-1]))
                dual = (widths[1:]+widths[:-1])/2
                self.metric[False, axis] = (self._coefficient((region.reference_step/dual).reshape(shape)), float(2*region.reference_step/(widths[0]+widths[-1])))
        for axis, n in enumerate(region.shape):
            if n > 1 and region.boundaries.pair(axis)[0].kind in ('periodic', 'bloch'):
                self.wrap[axis] = cmath.exp(1j*region.bloch_phase[axis]) if region.complex_fields else 1.0
        self.cpml = {}
        self.memory_states = []
        self.material_states = []
        self.incident_states = []
        for forward in (False, True):
            for axis, component, _, _ in CURL_TERMS:
                n = region.shape[axis]
                if n == 1:
                    continue
                segments = []
                for side, face in enumerate(region.boundaries.pair(axis)):
                    if face.kind != 'pml':
                        continue
                    layers = region.pml_layers(axis, side)
                    base = 0 if side == 0 else n - layers
                    # E derivatives are backward and H derivatives forward.
                    active_start, active_stop = (0, n-1) if forward else (1, n)
                    lo, hi = max(base, active_start), min(base+layers, active_stop)
                    if lo >= hi:
                        continue
                    target = np.arange(lo, hi) - base
                    depth = layers - target - (1 if forward else .5) if side == 0 else target + (1 if forward else .5)
                    rho = depth / (layers + 1)
                    sigma = face.sigma_scale * 40 * rho**face.polynomial / (layers + 1)
                    if region.mesh_type=='explicit' or region.mesh_steps is not None:
                        nodes=region.mesh_nodes[axis];widths=np.diff(nodes)
                        location=nodes[lo+1:hi+1] if forward else (nodes[lo:hi]+nodes[lo+1:hi+1])/2
                        interface=nodes[layers] if side==0 else nodes[base]
                        length=(nodes[layers]-nodes[0]+widths[layers]) if side==0 else (nodes[-1]-nodes[base]+widths[base-1])
                        rho=((interface-location) if side==0 else (location-interface))/length
                        sigma=face.sigma_scale*40*region.reference_step/length*rho**face.polynomial
                    kappa = 1 + (face.kappa-1) * rho**face.polynomial
                    alpha = face.alpha * (1-rho)**face.alpha_polynomial
                    decay = np.exp(-(sigma/kappa + alpha) * self.courant_number)
                    denominator = sigma*kappa + alpha*kappa*kappa
                    coupling = np.divide((decay-1)*sigma, denominator, out=np.zeros_like(sigma), where=denominator != 0)
                    coeff_shape = [1, 1, 1]
                    coeff_shape[axis] = hi-lo
                    shape = list(region.shape)
                    shape[axis] = hi-lo
                    psi = self._zeros(tuple(shape))
                    self.memory_states.append(psi)
                    segments.append({'slice': _slice(axis, slice(lo-active_start, hi-active_start)),
                                     'shape':tuple(shape),
                                     'psi': psi, 'b': self._coefficient(decay.reshape(coeff_shape)),
                                     'c': self._coefficient(coupling.reshape(coeff_shape)),
                                     'inv_k': self._coefficient((1/kappa).reshape(coeff_shape))})
                self.cpml[forward, axis, component] = segments

    def _zeros(self, shape):
        return torch.zeros(shape, device=self.E.device, dtype=self.E.dtype) if self.is_torch else np.zeros(shape, dtype=self.E.dtype)

    def _coefficient(self, array):
        return torch.as_tensor(array, device=self.E.device, dtype=self.E.real.dtype) if self.is_torch else array.astype(self.E.real.dtype)

    def curl(self, field, forward):
        result = self._zeros(field.shape)
        for axis, component, output, sign in CURL_TERMS:
            if field.shape[axis] == 1:
                continue
            low = _slice(axis, slice(None, -1), component)
            high = _slice(axis, slice(1, None), component)
            derivative = field[high] - field[low]
            if (forward, axis) in self.metric:
                derivative *= self.metric[forward, axis][0]
            for segment in self.cpml[forward, axis, component]:
                data = derivative[segment['slice']]
                psi = segment['psi']
                psi *= segment['b']
                psi += segment['c'] * data
                data *= segment['inv_k']
                data += psi
            target = _slice(axis, slice(None, -1) if forward else slice(1, None), output)
            result[target] += sign * derivative
            if axis in self.wrap:
                phase = self.wrap[axis]
                first, last = _slice(axis, 0, component), _slice(axis, -1, component)
                edge = phase*field[first] - field[last] if forward else field[first] - field[last]/phase
                if (forward, axis) in self.metric:
                    edge *= self.metric[forward, axis][1]
                result[_slice(axis, -1 if forward else 0, output)] += sign*edge
            elif forward and axis in self.pec_upper:
                edge = -self.pec_upper[axis] * field[_slice(axis, -1, component)]
                result[_slice(axis, -1, output)] += sign * edge
        return result

    def update_E(self):
        prepared = [state.prepare(self.E) for state in self.material_states]
        curl=self.curl(self.H,False)
        self.E += self.courant_number * self.inverse_permittivity * curl
        if getattr(self,'subpixel',None) is not None:self.subpixel.add(curl)
        for state, (old, response) in zip(self.material_states, prepared):
            state.correct(self.E, old, response)

    def update_H(self):
        self.H -= self.courant_number * self.inverse_permeability * self.curl(self.E, True)


class BoundaryDescription:
    """Boundary coefficients and state shapes without allocating volume fields."""
    def __init__(self,region):
        self.courant_number=region.rectangular_courant
        YeeGrid._prepare_boundaries(self,region)

    def _zeros(self,shape):return None

    def _coefficient(self,array):return np.asarray(array,dtype=np.float64)
