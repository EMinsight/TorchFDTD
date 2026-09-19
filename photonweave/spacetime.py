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
    def __init__(self, host_system, width, device='cuda', *, cuda_binding='direct', reuse_buffers=True,
                 tile_transfers='sync', tile_buffers=2):
        if host_system.device.type != 'cpu':
            raise ValueError('The global slab state must reside in CPU DRAM.')
        if isinstance(width, bool) or not isinstance(width, int) or width < 1:
            raise ValueError('Slab width must be a positive integer.')
        self.host = host_system
        self.width = width
        if cuda_binding not in ('direct', 'dlpack'):raise ValueError('cuda_binding must be direct or dlpack.')
        self.direct_views = cuda_binding == 'direct'
        self.device = torch.device(device)
        if self.device.type == 'cuda' and self.device.index is None:
            self.device = torch.device('cuda', torch.cuda.current_device())
        from .tile_workspace import TileWorkspace
        if tile_transfers not in ('sync', 'async'):raise ValueError('tile_transfers must be sync or async.')
        if isinstance(tile_buffers,bool) or not isinstance(tile_buffers,int) or not 1 <= tile_buffers <= 3:
            raise ValueError('tile_buffers must be between one and three.')
        if tile_transfers == 'async' and (not reuse_buffers or self.device.type != 'cuda'):
            raise ValueError('Asynchronous tiles require reusable CUDA buffers.')
        self.workspaces = [TileWorkspace(self.device, asynchronous=tile_transfers == 'async')
                           for _ in range(tile_buffers if tile_transfers == 'async' else 1)] if reuse_buffers else []
        self.workspace = self.workspaces[0] if self.workspaces else None

    def workspace_report(self):
        return dict(allocations=sum(w.allocations for w in self.workspaces),
                    buffer_bytes=sum(w.allocated_bytes for w in self.workspaces),
                    pinned_bytes=sum(w.pinned_bytes for w in self.workspaces),
                    binding_hits=sum(w.binding_hits for w in self.workspaces),
                    binding_misses=sum(w.binding_misses for w in self.workspaces),
                    h2d_bytes=sum(w.h2d_bytes for w in self.workspaces),
                    d2h_bytes=sum(w.d2h_bytes for w in self.workspaces),
                    transfer_scope='Logical workspace payload bytes, not measured PCIe transactions.')

    def _pipeline(self, depth, prepare, commit):
        pending = []
        count = len(self.workspaces) or 1
        completed = False
        try:
            for index, descriptor in enumerate(self.tiles(depth)):
                if len(pending) == count:
                    transfer, metadata = pending.pop(0)
                    commit(transfer.wait(), metadata)
                self.workspace = self.workspaces[index % count] if self.workspaces else None
                if self.workspace is not None:self.workspace.drain()
                transfer, metadata = prepare(descriptor)
                pending.append((transfer, metadata))
            for transfer, metadata in pending:commit(transfer.wait(), metadata)
            completed = True
        finally:
            # Also drain in-flight copies when preparation or reduction fails.
            # An exception before output staging may leave compute with no D2H
            # completion event. Finish it before a caller retries this workspace.
            if not completed and self.device.type == 'cuda':torch.cuda.current_stream(self.device).synchronize()
            for workspace in self.workspaces:workspace.drain()

    def _return(self, tensors):
        if self.workspace is not None:return self.workspace.to_host(tensors)
        from .tile_workspace import HostTransfer
        return HostTransfer(_host_copies(tensors))

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
        packed = torch.cat([value.reshape(-1) for value in tensors])
        packed = self.workspace.copy('payload', packed) if self.workspace is not None else packed.to(self.device)
        views = iter(piece.view_as(original) for piece, original in
                     zip(packed.split([value.numel() for value in tensors]), tensors))
        local.epsilon, grid.E, grid.H, grid.inverse_permeability = [next(views) for _ in range(4)]
        local.eps4 = local.epsilon[..., None] if epsilon.ndim == 3 else local.epsilon
        if self.workspace is None:
            grid.inverse_permittivity = (1/local.eps4).expand_as(grid.E).contiguous()
        else:
            grid.inverse_permittivity = self.workspace.array('inverse', grid.E.shape, epsilon.dtype)
            grid.inverse_permittivity.copy_(local.eps4.expand_as(grid.E)).reciprocal_()
        grid.metric = {key:(next(views), edge) for key, (_, edge) in grid.metric.items()}
        for segment in local.segments:
            for name in ('psi', 'b', 'c', 'inv_k'):segment[name] = next(views)
        for family, terms in local.sources.items():
            local.sources[family] = [(loc, component, next(views), next(views) if profile is not None else None)
                                     for loc, component, _, profile in terms]
        local.kernel = None
        if self.device.type == 'cuda':
            from .cuda_kernels import FusedYeeCUDA
            local.kernel = FusedYeeCUDA(grid, direct_views=self.direct_views, bindings_cache=self.workspace)
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
        def prepare(descriptor):
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
            return self._return((*owned_values, observations)), (lo, hi, mapping, observers)

        def commit(returned, metadata):
            lo, hi, mapping, observers = metadata
            if observers:signals[:, observers] = returned[-1]
            for target, value in zip(output[:2], returned[:2]):target[lo:hi].copy_(value)
            for value, (global_id, _, _, destination) in zip(returned[2:-1], mapping):
                output[global_id].index_copy_(0, destination, value)
        self._pipeline(depth, prepare, commit)
        return output, signals

    @torch.no_grad()
    def transpose(self, epsilon, state, start, depth, endpoint_bar, signal_bar):
        self._validate(epsilon, state, start, depth)
        self._validate(epsilon, endpoint_bar, start, depth)
        if signal_bar.shape != (depth, len(self.host.monitors)) or signal_bar.device.type != 'cpu' or signal_bar.dtype != epsilon.dtype:
            raise ValueError('Signal adjoint must have the host block observation shape.')
        initial_bar = tuple(torch.zeros_like(s) for s in state)
        gradient = torch.zeros_like(epsilon)
        def prepare(descriptor):
            lo, hi, indices, core = descriptor
            local, mapping, observers = self._tile(epsilon, state, descriptor, start, depth)
            restart = tuple(self.workspace.copy(f'restart:{i}', s) if self.workspace is not None else s.clone()
                            for i,s in enumerate(local.state()))
            adjoint = tuple(torch.zeros_like(s, device='cpu') for s in local.state())
            for target, value in zip(adjoint[:2], endpoint_bar[:2]):target[core].copy_(value[lo:hi])
            for target, (global_id, _, owned, destination) in zip(adjoint[2:], mapping):
                target.index_copy_(0, owned, endpoint_bar[global_id].index_select(0, destination))
            seed = torch.cat([s.reshape(-1) for s in adjoint])
            seed = self.workspace.copy('adjoint_seed', seed) if self.workspace is not None else seed.to(self.device)
            adjoint = tuple(part.view_as(original) for part, original in
                            zip(seed.split([s.numel() for s in adjoint]), adjoint))
            samples = self.workspace.copy('signal', signal_bar[:, observers]) if self.workspace is not None else signal_bar[:, observers].to(self.device).contiguous()
            local_gradient = self.workspace.zeros('gradient', local.epsilon) if self.workspace is not None else torch.zeros_like(local.epsilon)
            backward = None
            if self.device.type == 'cuda':
                from .cuda_adjoint import FusedAdjointCUDA
                backward = FusedAdjointCUDA(local, local_gradient, samples, direct_views=self.direct_views, buffers=self.workspace)
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
            return self._return((*adjoint, local_gradient)), (indices, mapping)

        def commit(returned, metadata):
            indices, mapping = metadata
            for target, value in zip(initial_bar[:2], returned[:2]):target.index_add_(0, indices, value)
            for value, (global_id, take, _, _) in zip(returned[2:-1], mapping):
                initial_bar[global_id].index_add_(0, take, value)
            gradient.index_add_(0, indices, returned[-1])
        self._pipeline(depth, prepare, commit)
        return initial_bar, gradient
