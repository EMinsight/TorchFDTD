"""Lossless DRAM slab blocks and their discrete transpose.

Internal execution primitive, not yet an automatically admitted public solver.
Each tile reads the same immutable block-start state. A conservative 2*K halo
covers the two radius-one curls in each full Yee step. Only owned cells are
committed. The transpose accumulates all replicated halo inputs on the host.
"""
from types import SimpleNamespace

import torch

from .differentiable import _Grid, _System


def _host_copies(tensors):
    """One payload transfer rather than a synchronization per CPML slab."""
    packed = torch.cat([value.reshape(-1) for value in tensors]).cpu()
    return tuple(piece.view_as(original) for piece, original in
                 zip(packed.split([value.numel() for value in tensors]), tensors))


class SlabBlockOperator:
    def __init__(self, host_system, width, device='cuda'):
        if host_system.device.type != 'cpu':
            raise ValueError('The global slab state must reside in CPU DRAM.')
        if isinstance(width, bool) or not isinstance(width, int) or width < 1:
            raise ValueError('Slab width must be a positive integer.')
        self.host = host_system
        self.width = width
        self.device = torch.device(device)
        if self.device.type == 'cuda' and self.device.index is None:
            self.device = torch.device('cuda', torch.cuda.current_device())

    def tiles(self, depth):
        n = self.host.region.shape[0]
        for lo in range(0, n, self.width):
            hi = min(lo + self.width, n)
            begin, end = lo - 2 * depth, hi + 2 * depth
            if 0 not in self.host.grid.wrap:
                begin, end = max(0, begin), min(n, end)
            coordinates = torch.arange(begin, end, dtype=torch.int64)
            yield lo, hi, coordinates.remainder(n), slice(lo-begin, hi-begin)

    def _tile(self, epsilon, state, descriptor, start, depth):
        host = self.host
        lo, hi, indices, core = descriptor
        local = object.__new__(_System)
        local.device, local.dtype = self.device, epsilon.dtype
        local.epsilon = epsilon.index_select(0, indices)
        local.eps4 = local.epsilon[..., None] if epsilon.ndim == 3 else local.epsilon
        local.region = SimpleNamespace(shape=(len(indices), *host.region.shape[1:]))
        local.current_step = 0
        grid = local.grid = _Grid()
        grid.E, grid.H = [s.index_select(0, indices) for s in state[:2]]
        grid.inverse_permeability = torch.ones(1, dtype=epsilon.dtype)
        grid.courant_number = host.grid.courant_number
        grid.time_step = host.grid.time_step
        grid.is_torch = True
        grid.material_states = []
        grid.wrap = {axis: value for axis, value in host.grid.wrap.items() if axis != 0}
        grid.metric = {}
        for (forward, axis), (values, edge) in host.grid.metric.items():
            if axis == 0:
                # A periodic seam becomes an ordinary internal derivative.
                all_values = torch.cat((values.flatten(), values.new_tensor([edge])))
                values = all_values[indices[:-1]].reshape(-1, 1, 1)
            grid.metric[forward, axis] = (values.contiguous(), edge)
        grid.cpml = {}
        local.segments, local.keys = [], {}
        mapping = []
        for key, global_ids in host.keys.items():
            forward, axis, _ = key
            local.keys[key] = []
            grid.cpml[key] = []
            for global_id in global_ids:
                segment = host.segments[global_id]
                if axis == 0:
                    a, b = segment['slice'][0].start, segment['slice'][0].stop
                    selected = torch.nonzero((indices[:-1] >= a) & (indices[:-1] < b)).flatten()
                    if selected.numel() == 0:continue
                    # X CPML cannot coexist with periodic X in the admitted contract.
                    if selected.numel() > 1 and not bool((selected[1:]-selected[:-1] == 1).all()):
                        raise ValueError('Noncontiguous X CPML segment.')
                    first, last = int(selected[0]), int(selected[-1])+1
                    take = indices[selected] - a
                    target = indices[selected] + (0 if forward else 1)
                    owned = torch.nonzero((target >= lo) & (target < hi)).flatten()
                    destination = take[owned]
                    sl = (slice(first, last), slice(None), slice(None))
                    coefficients = {name: segment[name].index_select(0, take)
                                    for name in ('b', 'c', 'inv_k')}
                else:
                    take = indices
                    owned = torch.arange(core.start, core.stop)
                    destination = indices[owned]
                    sl = segment['slice']
                    coefficients = {name: segment[name] for name in ('b', 'c', 'inv_k')}
                item = dict(slice=sl, psi=state[global_id+2].index_select(0, take),
                            **coefficients)
                local.keys[key].append(len(local.segments))
                local.segments.append(item)
                grid.cpml[key].append(item)
                mapping.append((global_id+2, take, owned, destination))
        local.sources = {'E': [], 'H': []}
        for family, terms in host.sources.items():
            for loc, component, wave, profile in terms:
                if isinstance(loc[0], int):
                    positions = torch.nonzero(indices == loc[0]).flatten()
                else:
                    a, b, stride = loc[0].indices(host.region.shape[0])
                    positions = torch.nonzero((indices >= a) & (indices < b) & ((indices-a) % stride == 0)).flatten()
                if not positions.numel():continue
                wave = wave[start:start+depth]
                groups = []
                for position in positions.tolist():
                    if groups and isinstance(loc[0], slice) and position == groups[-1][-1]+1 and indices[position] == indices[position-1]+1:
                        groups[-1].append(position)
                    else:groups.append([position])
                for group in groups:
                    position = group[0]
                    value = profile
                    if value is not None and isinstance(loc[0], slice):
                        offset = (int(indices[position])-a)//stride
                        value = value[offset:offset+len(group)]
                    selection = position if isinstance(loc[0], int) else slice(position, group[-1]+1)
                    local.sources[family].append(((selection, *loc[1:]), component, wave, value))
        local.monitors, observer_ids = [], []
        for m, (name, loc, component) in enumerate(host.monitors):
            if lo <= loc[0] < hi:
                local.monitors.append((name, (loc[0]-lo+core.start, *loc[1:]), component))
                observer_ids.append(m)
        # Pack small CPML/metric/source arrays with the fields to avoid one
        # blocking PCIe transaction for every individual boundary coefficient.
        tensors = [local.epsilon, grid.E, grid.H, grid.inverse_permeability]
        for values, _ in grid.metric.values():tensors.append(values)
        for segment in local.segments:
            tensors.extend(segment[name] for name in ('psi', 'b', 'c', 'inv_k'))
        for terms in local.sources.values():
            for _, _, wave, profile in terms:
                tensors.append(wave)
                if profile is not None:tensors.append(profile)
        packed = torch.cat([value.reshape(-1) for value in tensors]).to(self.device)
        views = iter(piece.view_as(original) for piece, original in
                     zip(packed.split([value.numel() for value in tensors]), tensors))
        local.epsilon, grid.E, grid.H, grid.inverse_permeability = [next(views) for _ in range(4)]
        local.eps4 = local.epsilon[..., None] if epsilon.ndim == 3 else local.epsilon
        grid.inverse_permittivity = (1/local.eps4).expand_as(grid.E).contiguous()
        grid.metric = {key:(next(views), edge) for key, (_, edge) in grid.metric.items()}
        for segment in local.segments:
            for name in ('psi', 'b', 'c', 'inv_k'):segment[name] = next(views)
        for family, terms in local.sources.items():
            local.sources[family] = [(loc, component, next(views), next(views) if profile is not None else None)
                                     for loc, component, _, profile in terms]
        local.kernel = None
        if self.device.type == 'cuda':
            from .cuda_kernels import FusedYeeCUDA
            local.kernel = FusedYeeCUDA(grid)
        return local, mapping, observer_ids

    def _validate(self, epsilon, state, start, depth):
        if isinstance(depth, bool) or not isinstance(depth, int) or depth < 1:
            raise ValueError('Temporal depth must be a positive integer.')
        if start < 0 or start + depth > self.host.region.steps:
            raise ValueError('Block exceeds the prepared source history.')
        expected = self.host.state()
        if len(state) != len(expected):raise ValueError('Incomplete restart state.')
        for value, template in zip(state, expected):
            if value.device.type != 'cpu' or value.shape != template.shape or value.dtype != template.dtype:
                raise ValueError('Restart state must match the host shapes and dtype.')
        if epsilon.device.type != 'cpu' or epsilon.shape != self.host.epsilon.shape or epsilon.dtype != self.host.dtype:
            raise ValueError('Epsilon must match the host shape and dtype.')

    @torch.no_grad()
    def forward(self, epsilon, state, start, depth):
        self._validate(epsilon, state, start, depth)
        output = tuple(torch.zeros_like(s) for s in state)
        signals = epsilon.new_zeros((depth, len(self.host.monitors)))
        for descriptor in self.tiles(depth):
            lo, hi, _, core = descriptor
            local, mapping, observers = self._tile(epsilon, state, descriptor, start, depth)
            observations = torch.empty((depth, len(observers)), device=self.device, dtype=epsilon.dtype)
            for j in range(depth):
                local.advance(j, j+1)
                if observers:observations[j] = local.observe(local.state())
            owned_values = [value[core] for value in local.state()[:2]]
            for value, (_, _, owned, _) in zip(local.state()[2:], mapping):
                owned_slice = slice(int(owned[0]), int(owned[-1])+1) if owned.numel() else slice(0,0)
                owned_values.append(value[owned_slice])
            returned = _host_copies((*owned_values, observations))
            if observers:signals[:, observers] = returned[-1]
            for target, value in zip(output[:2], returned[:2]):target[lo:hi].copy_(value)
            for value, (global_id, _, _, destination) in zip(returned[2:-1], mapping):
                output[global_id].index_copy_(0, destination, value)
            # Do not retain device arrays from previous tiles.
            del local, value, observations, owned_values, returned
        return output, signals

    @torch.no_grad()
    def transpose(self, epsilon, state, start, depth, endpoint_bar, signal_bar):
        self._validate(epsilon, state, start, depth)
        self._validate(epsilon, endpoint_bar, start, depth)
        if signal_bar.shape != (depth, len(self.host.monitors)) or signal_bar.device.type != 'cpu' or signal_bar.dtype != epsilon.dtype:
            raise ValueError('Signal adjoint must have the host block observation shape.')
        initial_bar = tuple(torch.zeros_like(s) for s in state)
        gradient = torch.zeros_like(epsilon)
        for descriptor in self.tiles(depth):
            lo, hi, indices, core = descriptor
            local, mapping, observers = self._tile(epsilon, state, descriptor, start, depth)
            restart = tuple(s.clone() for s in local.state())
            adjoint = tuple(torch.zeros_like(s) for s in local.state())
            for target, value in zip(adjoint[:2], endpoint_bar[:2]):target[core].copy_(value[lo:hi])
            for target, (global_id, _, owned, destination) in zip(adjoint[2:], mapping):
                target.index_copy_(0, owned.to(self.device), endpoint_bar[global_id].index_select(0, destination).to(self.device))
            samples = signal_bar[:, observers].to(self.device).contiguous()
            local_gradient = torch.zeros_like(local.epsilon)
            backward = None
            if self.device.type == 'cuda':
                from .cuda_adjoint import FusedAdjointCUDA
                backward = FusedAdjointCUDA(local, local_gradient, samples)
                backward.e_bar.copy_(adjoint[0]);backward.h_bar.copy_(adjoint[1])
                for target, value in zip(backward.psi_bars[0], adjoint[2:]):target.copy_(value)
                del adjoint
            # Bounded local replay: one restart, independent of temporal depth.
            # A local checkpoint schedule will reduce this triangular replay cost.
            for j in reversed(range(depth)):
                for target, value in zip(local.state(), restart):target.copy_(value)
                local.advance(0, j)
                if backward is not None:backward.step(j)
                else:
                    adjoint, contribution = local.transpose_step(local.state(), adjoint, samples[j])
                    local_gradient.add_(contribution)
            if backward is not None:
                adjoint = (backward.e_bar, backward.h_bar, *backward.psi_bars[backward.phase])
            returned = _host_copies((*adjoint, local_gradient))
            for target, value in zip(initial_bar[:2], returned[:2]):target.index_add_(0, indices, value)
            for value, (global_id, take, _, _) in zip(returned[2:-1], mapping):
                initial_bar[global_id].index_add_(0, take, value)
            gradient.index_add_(0, indices, returned[-1])
            del adjoint, backward, local, restart, local_gradient, value, samples, returned
        return initial_bar, gradient
