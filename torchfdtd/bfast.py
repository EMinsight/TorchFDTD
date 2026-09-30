"""Broadband fixed-angle source technique (BFAST) for periodic structures.

A plane wave with a fixed incidence angle has, at every frequency, the in-plane
wavevector k_par = (omega/c) k, where k = n*sin(theta)*(cos(phi), sin(phi)) is
dimensionless (Meep's bfast_scaled_k). Writing the physical field as

    E(r, omega) = E~(r, omega) exp(+i omega k.r / c)      (DFT kernel exp(+i omega t))

makes E~ periodic on the unit cell for all frequencies at once, so one real,
periodic, broadband run replaces a Bloch run per frequency. Maxwell's equations
for the transformed fields gain a time-derivative cross product
(B. Liang et al., IEEE Trans. Antennas Propag. 62(1), 354-360, 2014):

    eps dE~/dt = curl H~ - (k/c) x dH~/dt
    mu  dH~/dt = -curl E~ + (k/c) x dE~/dt

The k x dF/dt terms act like material-independent D and B increments, so the
update adds them to the curl before the permittivity, ADE, subpixel and PML
steps see it. As in Meep (src/step_generic.cpp, step_bfast), the auxiliary array
Q of each family carries the cross product at the next integer (E) or half (H)
time level through Q_new + Q_old = 2 k x avg(F), where avg is the two-point
average of F along each wavevector axis; the field receives Q_new - Q_old.

In the reduced time c*t, the update is stable for Courant numbers up to
(n_min - |k|)/sqrt(D) (von Neumann analysis of this scheme, docs/BFAST.md).
Regions scale the time step by 1 - |k|, which holds for every medium of index 1
or more. A PML that sees the k terms amplifies spurious grid modes, so k tapers to
zero before the PML, where a compensated medium keeps the zeroth order matched
(taper_profile, BfastUpdate.compensate). Physical fields are the transformed fields
delayed by k.r/c: multiply a frequency-domain field by exp(+i omega k.r/c),
physical_field below.
"""
from __future__ import annotations

import math

import numpy as np
import torch

C0 = 299792458.0

# (derivative axis, input component, output component, curl sign), as boundaries.CURL_TERMS.
_TERMS = ((0, 2, 1, -1), (0, 1, 2, 1),
          (1, 2, 0, 1), (1, 0, 2, -1),
          (2, 1, 0, -1), (2, 0, 1, 1))


def bfast_scaled_k(theta, phi=0., index=1., normal='z'):
    """Dimensionless BFAST wavevector for incidence at theta degrees from the normal axis.

    ``phi`` (degrees) turns the plane of incidence about the normal, from the first
    transverse axis in the cyclic order (x for normal z, y for normal x, z for normal y)
    towards the second. ``index`` is the refractive index of the incident medium. The
    in-plane propagation direction of the incident wave is +k.
    """
    if not 0 <= theta < 90:
        raise ValueError('BFAST incidence angles lie in [0, 90) degrees.')
    axis = 'xyz'.index(normal)
    first, second = (axis+1) % 3, (axis+2) % 3
    magnitude = index*math.sin(math.radians(theta))
    k = [0., 0., 0.]
    k[first] = magnitude*math.cos(math.radians(phi))
    k[second] = magnitude*math.sin(math.radians(phi))
    # Exact cardinal planes of incidence keep the other component zero (and its axis free of the periodic requirement).
    return tuple(0. if abs(v) < 1e-15*max(magnitude, 1e-300) else v for v in k)


def bfast_angle(k, index=1., normal='z'):
    """(theta, phi) in degrees of a scaled wavevector, the inverse of bfast_scaled_k."""
    axis = 'xyz'.index(normal)
    a, b = k[(axis+1) % 3], k[(axis+2) % 3]
    return math.degrees(math.asin(min(1., math.hypot(a, b)/index))), math.degrees(math.atan2(b, a))


def physical_field(values, points_um, frequency_hz, k):
    """Physical frequency-domain field from a BFAST field: values * exp(+i omega k.r / c).

    ``values`` has leading axes (frequency, point, ...), as the ``fields`` of a frequency
    plane result; ``points_um`` (point, 3) are the plane points of that result.
    """
    delay = np.asarray(points_um, dtype=float) @ np.asarray(k, dtype=float)*1e-6/C0
    phase = np.exp(2j*np.pi*np.asarray(frequency_hz, dtype=float)[:, None]*delay[None, :])
    values = np.asarray(values)
    return values*phase.reshape(phase.shape+(1,)*(values.ndim-2))


def reject_bfast(region, path):
    """Explicit refusal for execution paths without the BFAST update."""
    if getattr(region, 'bfast', False):
        raise ValueError(f'BFAST (bfast_scaled_k) is implemented by the resident Simulation on the Torch/NumPy '
                         f'update (cuda_kernel="torch" on CUDA), not by {path}.')


def tapered_axis(region):
    """The non-periodic axis with PML faces, where the BFAST wavevector tapers, or None."""
    active = 2 if region.dimension == '2d' else 3
    axes = [a for a in range(active) if region.shape[a] > 1 and any(region.pml_layers(a, side) for side in (0, 1))]
    return axes[0] if axes else None


def full_wavevector_bounds(region):
    """(axis, low, high): the span along the tapered axis where the full BFAST wavevector applies, in um, or None.

    Sources, monitors and the structures they measure belong inside it; outside, the taper and the PML
    carry the compensated medium of BfastUpdate.compensate, whose fields are not the physical ones.
    """
    axis = tapered_axis(region)
    if axis is None:
        return None
    nodes = region.mesh_nodes[axis]
    n = region.shape[axis]
    low = region.pml_layers(axis, 0) + (region.bfast_taper_cells if region.pml_layers(axis, 0) else 0)
    high = n - region.pml_layers(axis, 1) - (region.bfast_taper_cells if region.pml_layers(axis, 1) else 0)
    return axis, float(nodes[low]), float(nodes[high])


def trapped_band(region, index=None):
    """[(axis, low_um, high_um)]: wavelengths whose first negative diffraction order along a wavevector axis
    propagates in a medium of this index (region.background_index by default) but is evanescent in the
    compensated PML, Lambda*sqrt(n**2 - k**2) <= wavelength < Lambda*(n + |k|). Such an order reflects at the
    PML switch and rings in the cell (docs/BFAST.md)."""
    if not region.bfast or tapered_axis(region) is None:
        return []
    n = region.background_index if index is None else index
    k = math.sqrt(sum(v*v for v in region.bfast_scaled_k))
    return [(axis, region.actual_size[axis]*math.sqrt(n*n-k*k), region.actual_size[axis]*(n+k))
            for axis, v in enumerate(region.bfast_scaled_k) if v]


def taper_profile(region, axis, nodal):
    """Weight of the BFAST wavevector along a non-periodic axis: 1 in the interior, a sin**2 ramp over the
    region.bfast_taper_cells cells before each PML face, and 0 inside the PML.

    A stretched-coordinate PML that sees the BFAST terms amplifies spurious high-frequency modes of the update,
    so the PML runs the plain Yee update; BfastUpdate.compensate keeps the zeroth order matched (docs/BFAST.md).
    Positions are in cells: nodal samples on integer nodes, the others on half nodes.
    """
    n = region.shape[axis]
    position = np.arange(n) + (0. if nodal else .5)
    weight = np.ones(n)
    taper = region.bfast_taper_cells
    for side in (0, 1):
        layers = region.pml_layers(axis, side)
        if not layers:
            continue
        depth = position-layers if side == 0 else (n-layers)-position
        ramp = np.clip(depth/taper, 0, 1) if taper else (depth >= 0).astype(float)
        weight = np.minimum(weight, np.sin(np.pi/2*ramp)**2)
    return weight


class BfastUpdate:
    """The k x dF/dt increments of one YeeGrid, with their two auxiliary arrays."""

    def __init__(self, grid, region):
        from .boundaries import is_nodal
        self.k = tuple(float(v) for v in region.bfast_scaled_k)
        self.courant = grid.courant_number
        self.torch = grid.is_torch
        self.region = region
        # The axis whose PML faces end the wavevector (Region validation allows one). The two samples each
        # term pairs differ only along the wavevector axis, so the weight at the output sample is the pair's.
        self.normal = tapered_axis(region)
        self.terms = {}
        for family in 'EH':
            terms = []
            for axis, component, output, sign in _TERMS:
                if not self.k[axis] or region.shape[axis] == 1:
                    continue
                weight = sign*self.k[axis]
                if self.normal is not None:
                    shape = [1, 1, 1]
                    shape[self.normal] = region.shape[self.normal]
                    profile = taper_profile(region, self.normal, is_nodal(family, output, self.normal))
                    weight = grid._coefficient(weight*profile.reshape(shape))
                terms.append((axis, component, output, weight))
            self.terms[family] = terms
        self.state = {family: grid._zeros(grid.E.shape) for family in 'EH'}
        grid.memory_states.extend(self.state.values())

    def compensate(self, grid):
        """Keep the medium the specular order sees where the wavevector tapers.

        With k along x and the tapered (normal) axis y, the zeroth order (q_x = 0) of a TE field (E_z, H_x, H_y) has
        H_y = k/mu_yy E_z, so it obeys E_z = (curl H)_z/(eps_zz - k**2/mu_yy), and a TM field the dual with
        mu_zz - k**2/eps_yy. Where k falls to k0*w, eps_zz and mu_zz lose k0**2*(1 - w**2)/mu_yy and /eps_yy, so that
        order keeps its wavenumber and impedance and the taper and the switch into the PML do not reflect it. The
        result is a lossless diagonal medium with eps*mu > k**2 on every coupled pair and wave speeds below
        1/sqrt(1 - k0**2), which the plain Yee update and the CPML treat stably.

        Other orders see a different medium: an order with |q_x/omega| >= sqrt(n**2 - k0**2) is evanescent in the PML
        and reflects there (trapped_band). The in-plane directions normal to k get the terms by their squared
        share (exact for k along an axis). Call after the grid's permittivity is set,
        after subpixel interfaces (which rewrite the inverse permittivity). Dispersive (ADE) samples take
        their permittivity from the material and keep the uncompensated medium.
        """
        if self.normal is None:
            return
        from .boundaries import is_nodal
        t = self.normal
        k2 = sum(v*v for v in self.k)
        shape = [1, 1, 1]
        shape[t] = self.region.shape[t]
        copy = (lambda a: a.clone()) if self.torch else (lambda a: a.copy())
        normal = {'E': copy(grid.inverse_permeability[..., t]), 'H': copy(grid.inverse_permittivity[..., t])}
        for component in range(3):
            share = 1-self.k[component]**2/k2
            if component == t or share <= 0:
                continue
            # E_c pairs with H_t and H_c with E_t; both samples of a pair share their coordinate on t.
            for family, inverse in (('E', grid.inverse_permittivity), ('H', grid.inverse_permeability)):
                w = taper_profile(self.region, t, is_nodal(family, component, t))
                loss = grid._coefficient((share*k2*(1-w*w)).reshape(shape))
                values = inverse[..., component]
                inverse[..., component] = values/(1-loss*normal[family]*values)

    def _roll(self, field, shift, axis):
        return torch.roll(field, shift, axis) if self.torch else np.roll(field, shift, axis)

    def curl_increment(self, family, field):
        """The increment to add to the curl of this family's update.

        E: D += S curl H - k x dH, so the curl receives -(Q_new - Q_old)/S for Q = k x H;
        H: B += -S curl E + k x dE, so the curl (subtracted) receives -(Q_new - Q_old)/S for Q = k x E.
        E derivatives are backward (H[i] - H[i-1]) and H derivatives forward (E[i+1] - E[i]),
        so the averages pair the same two neighbours; the wavevector axes are periodic.
        """
        shift = 1 if family == 'E' else -1
        cross = torch.zeros_like(field) if self.torch else np.zeros_like(field)
        for axis, component, output, weight in self.terms[family]:
            source = field[..., component]
            cross[..., output] += weight*(source+self._roll(source, shift, axis))
        old = self.state[family]
        # Q_new = 2 k x avg(F) - Q_old, with the pair sum already carrying the factor 2.
        new = cross - old
        delta = new - old
        old[...] = new
        return -delta/self.courant
