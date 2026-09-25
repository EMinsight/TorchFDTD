"""Dispersive subpixel interfaces: the averaging tensor of a node cell with dispersive laminate branches.

A node cell spans WINDOW mesh steps per axis around a Yee node. When it holds a
fraction f of one dispersive medium eps_m(w) and nondispersive media elsewhere,
with C and B the cell averages of eps and 1/eps over the nondispersive part and
n the unit normal of the dispersive surface, the constitutive map E = Z D is

    Z(w) = n n^T (B + f/eps_m(w)) + (I - n n^T)/(C + f eps_m(w))

(the averaging tensor of Farjadpour et al., Opt. Lett. 31, 2972, 2006 and Kottke,
Farjadpour and Johnson, Phys. Rev. E 77, 036611, 2008, with the dispersive
response split into its normal and tangential laminate branches as by Deinega
and Valuev, Opt. Lett. 32, 3429, 2007). The eight edge triplets of the node,
each with weight 1/8 as in the coupled operator of torchfdtd.subpixel, give the
edge of axis a and side s the share 1/2 [(Z Dbar)_a + s Z_aa delta_a], with Dbar
and delta the half sum and half difference of D on the two edges of axis a.
Every branch is a passive medium driven by D: the normal one is the dispersive
medium itself in series with B, the tangential one the parallel laminate
C + f eps_m, both advanced by the trapezoidal ADE update, so each node share is a
passive impedance whose high-frequency value is at most one. A node cell wholly
inside the medium gives its edges 1/2 D/eps_m; an edge between two such cells
keeps the Yee ADE of the material. Nondispersive cells next to a dispersive cell
use the static tensor n n^T B + (I - n n^T)/C. See docs/SUBPIXEL_INTERFACES.md.
"""
from dataclasses import dataclass
import time

import numpy as np
import torch

from .subpixel_geometry import DielectricGeometry

ORDINARY, MIXED, WHOLE, NEXT = 0, 1, 2, 3
# Averaging window of a node cell, in mesh steps per axis: two steps was the most
# accurate on development Drude spheres of 3.6 to 11 cells per radius (window 1 to 3
# compared, docs/SUBPIXEL_INTERFACES.md); wider windows oversmooth small spheres.
WINDOW = 2.


def branch_coefficients(epsilon, oscillators, dt, n):
    """(eps, a, d, k) of a D-driven trapezoidal ADE bank of n samples; a, d and k have the poles on the first axis."""
    w0, strength, gamma = (np.stack([np.broadcast_to(np.asarray(o[j], dtype=float), (n,)) for o in oscillators]) for j in range(3))
    den = 1+.5*gamma*dt+.25*(w0*dt)**2
    return np.broadcast_to(np.asarray(epsilon, dtype=float), (n,)), .5*(w0*dt)**2, den, strength*dt*dt/(4*den)


class Branch:
    """eps x + sum_j P_j = d with P_j'' + g_j P_j' + w_j^2 P_j = s_j x: MaterialADE's update for a known drive."""
    def __init__(self, grid, epsilon, oscillators, shape):
        eps, a, d, k = branch_coefficients(epsilon, oscillators, grid.time_step, shape[-1])
        self.x = grid._zeros(shape)
        self.P = grid._zeros((len(oscillators),)+tuple(shape)); self.Q = grid._zeros((len(oscillators),)+tuple(shape))
        grid.memory_states.extend((self.x, self.P, self.Q))
        lead = (1,)*(len(shape)-1)
        self.eps = grid._coefficient(eps.reshape(lead+eps.shape))
        self.a, self.d, self.k = (grid._coefficient(v.reshape(v.shape[:1]+lead+v.shape[1:])) for v in (a, d, k))
        self.k_sum = self.k.sum(0)
        self.host = eps, oscillators

    def step(self, drive):
        response = (self.Q-self.a*self.P)/self.d
        new = (self.eps*self.x+drive-self.k_sum*self.x-response.sum(0))/(self.eps+self.k_sum)
        change = new-self.x
        delta = response+self.k*(new+self.x)
        self.P += delta
        self.Q *= -1
        self.Q += 2*delta
        self.x += change
        return change

    def energy_terms(self, grid, scale):
        """(array, weight) pairs of scale (eps x^2 + sum_j (Q_j^2/dt^2 + w_j^2 P_j^2)/s_j), weights shaped like the arrays."""
        eps, oscillators = self.host
        shaped = lambda v: grid._coefficient(np.broadcast_to(np.asarray(v, dtype=float)*scale, self.x.shape).copy())
        terms = [(self.x, shaped(eps))]
        for j, (w0, strength, _) in enumerate(oscillators):
            strength = np.asarray(strength, dtype=float)
            inverse = np.divide(1, strength, out=np.zeros_like(strength), where=strength > 0)
            terms += [(self.Q[j], shaped(inverse/grid.time_step**2)), (self.P[j], shaped(np.asarray(w0)**2*inverse))]
        return terms


@dataclass
class DispersiveTensor:
    """Node kinds, the static tensors of NEXT nodes, and the D-driven samples, nodes and edges.

    ``kind`` holds one of ORDINARY, MIXED, WHOLE, NEXT per node. ``driven`` marks
    the samples whose field comes from the dispersive state (an end in a MIXED or
    WHOLE cell, not both WHOLE); ``standard`` samples lie between two WHOLE cells
    and keep the material ADE. ``active`` marks the nodes whose triplets change
    (every kind but ORDINARY and WHOLE cells away from the surface). ``groups``
    has one entry per dispersive material."""
    node_shape: tuple
    kind: np.ndarray
    active: np.ndarray
    next_ids: np.ndarray
    next_tensors: np.ndarray
    driven: np.ndarray
    standard: np.ndarray
    owners: np.ndarray
    instantaneous: np.ndarray
    groups: list
    metadata: dict

    def static_tensors(self, ids):
        return self.next_tensors[np.searchsorted(self.next_ids, ids)]


def _node_points(region, coords, dim):
    return np.column_stack([region.mesh_nodes[a][coords[:, a]] if a < dim else np.zeros(len(coords)) for a in range(3)])


def _edge(region, coords, axis, side, dim, periodic):
    """Flat sample index, validity and Bloch phase of the edge of ``axis`` on ``side`` (0 upper, 1 lower) of each node."""
    shape = region.shape
    edge = coords.copy()
    if axis < dim and side:
        edge[:, axis] -= 1
    if axis >= dim:
        edge[:, axis] = 0
    good = np.ones(len(edge), bool); phase = np.ones(len(edge), complex)
    for b in range(3):
        if b in periodic:
            turns = np.floor_divide(edge[:, b], shape[b]); phase *= np.exp(1j*turns*region.bloch_phase[b]); edge[:, b] %= shape[b]
        else:
            good &= (edge[:, b] >= 0) & (edge[:, b] < shape[b]); edge[:, b] = np.clip(edge[:, b], 0, shape[b]-1)
    return np.ravel_multi_index(edge.T, shape)*3+axis, good, phase


def prepare_dispersive(project, ownership):
    """The dispersive tensor of every node cell that meets or touches a dispersive object, or None."""
    r = project.region; materials = project.materials
    active = {s.material for s in project.structures if s.enabled}
    dispersive = [i for i, m in enumerate(materials) if m.oscillators and m.name in active]
    if not dispersive:
        return None
    started = time.perf_counter()
    index = {m.name: i for i, m in enumerate(materials)}
    marks = DielectricGeometry(project, lambda m: 0. if m is None or not m.oscillators else 1.+dispersive.index(index[m.name]))
    media = DielectricGeometry(project, lambda m: 0. if m is None else 1.+index[m.name])
    plain = DielectricGeometry(project)
    background = r.background_index**2
    table = np.zeros((len(materials)+1, len(dispersive)+2)); table[0, -2:] = background, 1/background
    for i, m in enumerate(materials):
        if i in dispersive:
            table[i+1, dispersive.index(i)] = 1
        elif m.name in active:
            table[i+1, -2:] = m.instantaneous_epsilon, 1/m.instantaneous_epsilon
    dim, periodic = marks.dim, marks.periodic
    shape = np.array(r.shape); steps = np.array([v[1]-v[0] for v in r.mesh_nodes])
    node_shape = tuple(int(shape[a]) if a in periodic or a >= dim else int(shape[a]+1) for a in range(3))
    count = int(np.prod(node_shape)); tolerance = 1e-12
    window = steps*WINDOW
    radius = np.linalg.norm(window[:dim])/2*(1+1e-12)
    fraction = np.zeros(count, np.float32); material = np.full(count, -1, np.int16)
    cells = {}
    for start in range(0, count, 32768):
        ids = np.arange(start, min(start+32768, count))
        points = _node_points(r, np.stack(np.unravel_index(ids, node_shape), 1), dim)
        normal, near = marks.normals_and_candidates(points, radius)
        label = marks.epsilon(points).astype(int)
        inside = ~near & (label > 0)
        fraction[ids[inside]] = 1; material[ids[inside]] = label[inside]-1
        if np.any(near):
            values = media.volume_average(points[near], window, r.subpixel_quadrature, normal[near], table)
            parts = values[:, :len(dispersive)]; present = parts > tolerance
            if np.any(present.sum(axis=1) > 1):
                raise ValueError(f'Dispersive subpixel interfaces allow one dispersive material per node cell; '
                                 f'{int(np.count_nonzero(present.sum(axis=1) > 1))} node cells mix two. Separate the objects by at least one averaging window ({WINDOW:g} cells) or choose staircase interfaces.')
            total = parts.sum(axis=1); hit = total > tolerance
            fraction[ids[near][hit]] = np.minimum(total[hit], 1); material[ids[near][hit]] = np.argmax(parts[hit], axis=1)
            for k in np.flatnonzero(hit):
                cells[int(ids[near][k])] = (values[k, -2], values[k, -1], normal[near][k], min(total[k], 1.))
    kind = np.where(fraction >= 1-tolerance, WHOLE, np.where(fraction > 0, MIXED, ORDINARY)).astype(np.int8)
    grid = kind.reshape(node_shape)
    touching = np.zeros(node_shape, bool); boundary = np.zeros(node_shape, bool)
    for a in range(dim):
        for shift in (1, -1):
            for source, target in ((grid > 0, touching), (grid != WHOLE, boundary)):
                rolled = np.roll(source, shift, axis=a)
                if a not in periodic:
                    edge = [slice(None)]*3; edge[a] = slice(0, 1) if shift == 1 else slice(-1, None); rolled[tuple(edge)] = False
                target |= rolled
    kind[(touching.reshape(-1)) & (kind == ORDINARY)] = NEXT
    boundary = boundary.reshape(-1) & (kind == WHOLE)
    # Static tensors of the nondispersive cells next to a dispersive cell.
    next_ids = np.flatnonzero(kind == NEXT); next_tensors = np.zeros((len(next_ids), 3, 3))
    for start in range(0, len(next_ids), 32768):
        ids = next_ids[start:start+32768]
        points = _node_points(r, np.stack(np.unravel_index(ids, node_shape), 1), dim)
        normal = plain.normals_and_candidates(points, radius)[0]
        values = media.volume_average(points, window, r.subpixel_quadrature, normal, table)
        projector = normal[:, :, None]*normal[:, None, :]
        next_tensors[start:start+len(ids)] = projector*values[:, -1, None, None]+(np.eye(3)-projector)/values[:, -2, None, None]
    # Edges of MIXED nodes and of WHOLE nodes on the surface: the candidates for D-driven samples.
    size = int(np.prod(shape))*3
    driven = np.zeros(size, bool); standard = []; owners = []
    wholes = {}
    for ids in (np.flatnonzero(kind == MIXED), np.flatnonzero(boundary)):
        coords = np.stack(np.unravel_index(ids, node_shape), 1)
        for axis in range(3):
            for side in range(2):
                sample, good, _ = _edge(r, coords, axis, side, dim, periodic)
                sample = sample[good]
                ends = np.stack(np.unravel_index(sample//3, r.shape), 1)
                lower = np.ravel_multi_index(np.where(np.arange(3) < dim, ends, 0).T, node_shape)
                upper_coords = ends.copy()
                if axis < dim:
                    upper_coords[:, axis] += 1
                    if axis in periodic:
                        upper_coords[:, axis] %= shape[axis]
                upper_coords[:, dim:] = 0
                upper = np.ravel_multi_index(upper_coords.T, node_shape)
                both = (kind[lower] == WHOLE) & (kind[upper] == WHOLE)
                driven[sample[~both]] = True
                standard.append(sample[both]); owners.append(material[lower][both])
                for s, lo, hi in zip(sample[~both], lower[~both], upper[~both]):
                    wholes[int(s)] = (lo, hi)
    standard = np.concatenate(standard) if standard else np.empty(0, np.int64)
    owners = np.array([dispersive[k] for k in np.concatenate(owners)], np.int32) if len(standard) else np.empty(0, np.int32)
    standard, first = np.unique(standard, return_index=True); owners = owners[first]
    instantaneous = np.zeros(size)
    groups = []
    for k, i in enumerate(dispersive):
        m = materials[i]
        # Half-dispersive edges: each WHOLE end contributes 1/2 D/eps_m.
        half_index, half_weight = [], []
        for s, (lo, hi) in wholes.items():
            weight = .5*((kind[lo] == WHOLE and material[lo] == k)+(kind[hi] == WHOLE and material[hi] == k))
            if weight:
                half_index.append(s); half_weight.append(weight)
        half_index = np.array(half_index, np.int64); half_weight = np.array(half_weight)
        np.add.at(instantaneous, half_index, half_weight/m.epsilon_inf)
        ids = np.flatnonzero((kind == MIXED) & (material == k))
        coords = np.stack(np.unravel_index(ids, node_shape), 1)
        edges = np.zeros((3, 2, len(ids)), np.int64); phases = np.ones((3, 2, len(ids)), complex)
        for axis in range(3):
            for side in range(2):
                sample, good, phase = _edge(r, coords, axis, side, dim, periodic)
                if not np.all(good):
                    raise ValueError(f'Dispersive subpixel interfaces need at least one averaging window ({WINDOW:g} cells) between a dispersive surface '
                                     'and a nonperiodic grid boundary. Enlarge the region or choose staircase interfaces.')
                edges[axis, side] = sample; phases[axis, side] = phase
        f = np.array([cells[int(n)][3] for n in ids])
        C = np.array([cells[int(n)][0] for n in ids]); B = np.array([cells[int(n)][1] for n in ids])
        normal = np.array([cells[int(n)][2] for n in ids]).reshape(-1, 3)
        # High-frequency share of each edge: 1/2 Z_aa at the instantaneous permittivity.
        z = normal**2*(B+f/m.epsilon_inf)[:, None]+(1-normal**2)/(C+f*m.epsilon_inf)[:, None]
        for axis in range(3):
            for side in range(2):
                np.add.at(instantaneous, edges[axis, side], .5*z[:, axis])
        groups.append(dict(material=i, epsilon_inf=m.epsilon_inf, oscillators=[tuple(map(float, o)) for o in m.oscillators],
                           half_index=half_index, half_weight=half_weight, edges=edges,
                           phases=phases if r.complex_fields else None, fraction=f, arithmetic=C, harmonic=B, normal=normal))
    metadata = dict(method='node_tensor_dispersive_laminate', materials=[materials[i].name for i in dispersive],
                    mixed_nodes=int(np.count_nonzero(kind == MIXED)), whole_surface_nodes=int(np.count_nonzero(boundary)),
                    next_nodes=int(len(next_ids)), driven_samples=int(np.count_nonzero(driven)), standard_surface_samples=int(len(standard)),
                    preparation_seconds=time.perf_counter()-started)
    active = (kind == MIXED) | (kind == NEXT) | boundary
    return DispersiveTensor(node_shape, kind, active, next_ids, next_tensors, driven, standard, owners, instantaneous, groups, metadata)


def refuse_driven_sources(tensor, terms, shape):
    """Soft E terms act on E directly; a D-driven sample derives E from D, so an E term there would leave a static offset."""
    driven = tensor.driven.reshape(tuple(shape)+(3,))
    for field, loc, *_ in terms:
        if field[0] == 'E' and np.any(driven[tuple(loc)+('xyz'.index(field[1].lower()),)]):
            raise ValueError(f'A soft {field} source overlaps node cells cut by a dispersive surface (dispersive subpixel interfaces). '
                             'Move it at least one cell away from the surface or choose staircase interfaces.')


class DispersiveState:
    """The D-driven branches of one grid: half-dispersive edges and MIXED node tensors, per material."""
    def __init__(self, grid, tensor):
        self.torch = grid.is_torch
        device = grid.E.device if self.torch else None
        index = (lambda a: torch.as_tensor(a, device=device, dtype=torch.long)) if self.torch else (lambda a: np.asarray(a, np.int64))
        complex_phase = (lambda a: torch.as_tensor(a, device=device, dtype=grid.E.dtype)) if self.torch else (lambda a: a.astype(grid.E.dtype))
        self.grid = grid
        self.groups = []
        self.scales = []
        for g in tensor.groups:
            e, poles = g['epsilon_inf'], g['oscillators']
            n = len(g['fraction']); f, C, B = g['fraction'], g['arithmetic'], g['harmonic']
            parallel = [(w0, f*s, gamma) for w0, s, gamma in poles]
            group = dict(half_index=index(g['half_index']), half_weight=grid._coefficient(g['half_weight']),
                         half=Branch(grid, e, poles, (len(g['half_index']),)), nodes=n)
            if n:
                group.update(edges=[[index(g['edges'][a, s]) for s in range(2)] for a in range(3)],
                             phases=None if g['phases'] is None else [[complex_phase(g['phases'][a, s]) for s in range(2)] for a in range(3)],
                             fraction=grid._coefficient(f), harmonic=grid._coefficient(B),
                             normal=[grid._coefficient(g['normal'][:, a]) for a in range(3)],
                             square=[grid._coefficient(g['normal'][:, a]**2) for a in range(3)],
                             across=Branch(grid, e, poles, (n,)), along=Branch(grid, C+f*e, parallel, (3, n)),
                             across_diagonal=Branch(grid, e, poles, (3, n)), along_diagonal=Branch(grid, C+f*e, parallel, (3, n)))
            self.groups.append(group)
            # Node energy D^T Z D + sum_a Z_aa delta_a^2: each branch weighed by its share of Z.
            square = g['normal'].T**2
            self.scales.append(dict(half=g['half_weight'], across=f, along=np.ones((3, n)), across_diagonal=square*f, along_diagonal=1-square))

    def apply(self, curl):
        """Add the dispersive shares of E for the drive D = courant * curl(H) of this step."""
        g = self.grid; c = g.courant_number
        flat = curl.reshape(-1); field = g.E.reshape(-1)
        take = (lambda i: flat.index_select(0, i)) if self.torch else (lambda i: flat[i])
        stack = torch.stack if self.torch else np.stack
        for group in self.groups:
            if len(group['half_index']):
                self._add(field, group['half_index'], group['half_weight']*group['half'].step(c*take(group['half_index'])))
            if not group['nodes']:
                continue
            edges, phases = group['edges'], group['phases']
            drive = [[c*take(edges[a][s])*(1 if phases is None else phases[a][s]) for s in range(2)] for a in range(3)]
            mean = stack([(drive[a][0]+drive[a][1])/2 for a in range(3)]); half = stack([(drive[a][0]-drive[a][1])/2 for a in range(3)])
            n = group['normal']
            normal_drive = n[0]*mean[0]+n[1]*mean[1]+n[2]*mean[2]
            across = group['fraction']*group['across'].step(normal_drive)+group['harmonic']*normal_drive
            along = group['along'].step(stack([mean[a]-n[a]*normal_drive for a in range(3)]))
            across_diagonal = group['across_diagonal'].step(half); along_diagonal = group['along_diagonal'].step(half)
            for a in range(3):
                share = n[a]*across+along[a]
                difference = group['square'][a]*(group['fraction']*across_diagonal[a]+group['harmonic']*half[a])+(1-group['square'][a])*along_diagonal[a]
                for s, sign in ((0, 1), (1, -1)):
                    value = (share+sign*difference)/2
                    self._add(field, edges[a][s], value if phases is None else value*phases[a][s].conj())

    def _add(self, field, index, values):
        if self.torch:
            field.index_add_(0, index, values)
        else:
            np.add.at(field, index, values)

    def energy_terms(self):
        terms = []
        for group, scales in zip(self.groups, self.scales):
            for name in ('half', 'across', 'along', 'across_diagonal', 'along_diagonal'):
                if name in group:
                    terms += group[name].energy_terms(self.grid, scales[name])
        return terms
