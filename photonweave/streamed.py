"""Experimental host/file-backed differentiable FDTD with bounded CUDA slabs."""
from dataclasses import dataclass
from contextlib import contextmanager
from pathlib import Path
import math
import time

import torch

from .boundaries import BoundaryDescription
from .differentiable import DifferentiableResult, DifferentiableSimulation, _System, _split
from .spacetime import SlabBlockOperator
from .memory_profile import host_memory


@dataclass(frozen=True)
class StreamedAdjointOptions:
    slab_width: int = 32
    temporal_depth: int = 4
    checkpoints: int = 2
    gpu_budget_bytes: int = 1024**3
    host_budget_bytes: int = 8*1024**3
    device: str = 'cuda'
    cuda_binding: str = 'direct'
    reuse_tile_buffers: bool = True
    tile_transfers: str = 'sync'
    tile_buffers: int = 2
    local_checkpoints: int = 0
    state_storage: str = 'host'
    state_directory: str | Path | None = None
    disk_budget_bytes: int | None = None
    disk_free_reserve_bytes: int = 0

    def __post_init__(self):
        if isinstance(self.disk_free_reserve_bytes,bool) or not isinstance(self.disk_free_reserve_bytes,int) or self.disk_free_reserve_bytes<0:
            raise ValueError('disk_free_reserve_bytes must be a nonnegative integer.')
        if self.state_storage not in ('host','disk'):raise ValueError('state_storage must be host or disk.')
        if self.disk_budget_bytes is not None and (isinstance(self.disk_budget_bytes,bool) or not isinstance(self.disk_budget_bytes,int) or self.disk_budget_bytes<1):
            raise ValueError('disk_budget_bytes must be a positive integer.')
        if self.state_directory is not None:
            if not isinstance(self.state_directory,(str,Path)):raise ValueError('state_directory must be a path or string.')
            object.__setattr__(self,'state_directory',str(self.state_directory))
        if self.state_storage == 'disk' and (not self.state_directory or self.disk_budget_bytes is None):
            raise ValueError('Disk field banks require a state_directory and explicit disk_budget_bytes.')
        for name in ('slab_width', 'temporal_depth', 'gpu_budget_bytes', 'host_budget_bytes'):
            value = getattr(self, name)
            if isinstance(value, bool) or not isinstance(value, int) or value < 1:
                raise ValueError(f'{name} must be a positive integer.')
        if isinstance(self.checkpoints, bool) or not isinstance(self.checkpoints, int) or not 0 <= self.checkpoints <= 32:
            raise ValueError('checkpoints must be an integer between zero and 32.')
        if isinstance(self.local_checkpoints,bool) or not isinstance(self.local_checkpoints,int) or not 0 <= self.local_checkpoints <= 32:
            raise ValueError('local_checkpoints must be an integer between zero and 32.')
        if torch.device(self.device).type not in ('cpu', 'cuda'):
            raise ValueError('Streamed execution supports CPU or CUDA tiles.')
        if self.cuda_binding not in ('direct', 'dlpack'):raise ValueError('cuda_binding must be direct or dlpack.')
        if not isinstance(self.reuse_tile_buffers,bool):raise ValueError('reuse_tile_buffers must be boolean.')
        if self.tile_transfers not in ('sync','async'):raise ValueError('tile_transfers must be sync or async.')
        if isinstance(self.tile_buffers,bool) or not isinstance(self.tile_buffers,int) or not 1 <= self.tile_buffers <= 3:
            raise ValueError('tile_buffers must be between one and three.')
        if self.tile_transfers == 'async' and (not self.reuse_tile_buffers or torch.device(self.device).type != 'cuda'):
            raise ValueError('Asynchronous tiles require reusable CUDA buffers.')


def _reservation(project, epsilon, options, spectral=None):
    region = project.region
    n = math.prod(region.shape)
    boundary = BoundaryDescription(region)
    cpml = sum(math.prod(s['shape']) for segments in boundary.cpml.values() for s in segments)
    material_item = epsilon.element_size()
    # Fields, CPML memories and source/observation histories are complex for
    # Bloch propagation even though epsilon and its gradient remain real.
    item = material_item*(2 if region.complex_fields else 1)
    state = (6*n+cpml)*item
    depth = min(options.temporal_depth, region.steps)
    width = min(options.slab_width, region.shape[0])+4*depth
    if 0 not in boundary.wrap:width = min(width, region.shape[0])
    tile_cells = width*region.shape[1]*region.shape[2]
    if (6 if region.complex_fields else 3)*tile_cells >= 2**31:
        raise ValueError('A CUDA tile exceeds the supported integer index range.')
    monitors = sum(m.enabled for m in project.monitors) if spectral is None else len(spectral.components)
    terms = sum(len(s.polarization_components)*(2 if s.injection == 'oneway' else 1)
                for s in project.sources if s.enabled)
    history = region.steps*(2*monitors+terms)*item if spectral is None else region.steps*terms*item+spectral.reservation(depth)['spectral_reservation_bytes']
    # Conservative bounds cover restart banks, two adjoint banks, tile gather/
    # scatter copies, validation temporaries and recursive saved block states.
    # Geometry graphs and optimizer/objective allocations remain caller-owned.
    source_copies = math.ceil(width/region.shape[0])+1
    tile_history = depth*(monitors+terms*source_copies)*item
    local_slots = min(options.local_checkpoints,depth-1)
    # A complete local state contains six fields and at most twelve CPML arrays.
    tile_workspace = (128+18*local_slots)*tile_cells*item
    buffers = options.tile_buffers if options.tile_transfers == 'async' else 1
    initial_storage = (2+sum(len(segments) for segments in boundary.cpml.values()))*item
    # The immutable all-zero host initial bank is represented by scalar views.
    # Retain the remaining conservative headroom for replay and transpose banks.
    # At most C saved block states, one current adjoint and two evolving
    # primal banks coexist during replay. Transpose instead holds a primal,
    # old adjoint and new adjoint. Reserve two additional lifetime margins.
    # The initial all-zero bank is scalar-backed and charged separately.
    state_bank_capacity = options.checkpoints+5
    state_banks = state_bank_capacity*state
    disk = state_banks if options.state_storage == 'disk' else 0
    disk_io_workspace = 36*tile_cells*item if disk else 0
    host = (0 if disk else state_banks)+initial_storage+8*epsilon.numel()*material_item+history+buffers*(tile_workspace+2*tile_history)+disk_io_workspace+16*monitors
    gpu = buffers*(tile_workspace+tile_history)
    available = host_memory()['available_bytes']
    host_limit = min(options.host_budget_bytes, int(available*.8)) if available is not None else options.host_budget_bytes
    if host > host_limit:
        raise ValueError(f'Streamed state and checkpoint reservation exceed the host budget: required={host} bytes, admissible={host_limit} bytes.')
    if disk:
        from .state_store import disk_free
        free_disk = disk_free(options.state_directory)
        disk_limit=min(options.disk_budget_bytes,int(free_disk*.8),free_disk-options.disk_free_reserve_bytes)
        if disk > disk_limit:
            raise ValueError(f'Field bank reservation exceeds the disk budget or available disk space: required={disk} bytes, admissible={max(0,disk_limit)} bytes, free={free_disk} bytes.')
    if torch.device(options.device).type == 'cuda':
        free, _ = torch.cuda.mem_get_info(torch.device(options.device))
        gpu_limit=min(options.gpu_budget_bytes, int(free*.8))
        if gpu > gpu_limit:
            raise ValueError(f'Streamed tile workspace reservation exceeds the GPU budget: required={gpu} bytes, admissible={gpu_limit} bytes.')
    return dict(host_reservation_bytes=host, gpu_reservation_bytes=gpu,observation_index_bytes=16*monitors,
                state_bank_capacity=state_bank_capacity,
                disk_reservation_bytes=disk,disk_io_workspace_bytes=disk_io_workspace,
                host_initial_state_reservation_bytes=initial_storage,
                state_bytes=state, max_extended_tile_cells=tile_cells, local_checkpoint_reservation_bytes=buffers*18*local_slots*tile_cells*item,
                source_and_output_history_bytes=history, host_tile_reservation_bytes=buffers*(tile_workspace+2*tile_history))


@contextmanager
def _backing(options,report,phase):
    if options.state_storage == 'host':
        yield None
        return
    from .state_store import StateStore
    store = StateStore(options.state_directory,options.disk_budget_bytes,options.disk_free_reserve_bytes)
    try:yield store
    finally:
        try:store.close()
        finally:report[phase+'_backing_store'] = store.report()


def estimate_streamed_memory(project, options=None, *, diagonal=False):
    """Check time-history memory admission without allocating domain arrays.

    Uses current free resources and the same reservation as StreamedSimulation.
    Does not validate all physics or include caller-owned geometry/optimizer
    graphs or OS file cache. Spectral observers require their own reservation.
    Admission is checked again at execution because resources may change.
    """
    if not isinstance(diagonal,bool):raise ValueError('diagonal must be boolean.')
    options=options or StreamedAdjointOptions()
    shape=project.region.shape+((3,) if diagonal else ())
    epsilon=torch.empty(shape,dtype=getattr(torch,project.region.precision),device='meta')
    return _reservation(project,epsilon,options)


class _Streamed(torch.autograd.Function):
    @staticmethod
    def forward(ctx, epsilon, project, options, report, spectral):
        ctx.save_for_backward(epsilon)
        ctx.project, ctx.options, ctx.report = project.model_copy(deep=True), options, report
        ctx.spectral = spectral
        started = time.perf_counter()
        host = _System(project, epsilon, prepare_updates=False, observation_monitors=None if spectral is None else spectral.observers)
        report['host_initial_state_storage_bytes'] = sum(s.untyped_storage().nbytes() for s in host.state())
        report['host_inverse_permittivity_bytes'] = 0
        with _backing(options,report,'forward') as store:
            operator = SlabBlockOperator(host, options.slab_width, options.device, cuda_binding=options.cuda_binding,
                                        reuse_buffers=options.reuse_tile_buffers, tile_transfers=options.tile_transfers,
                                        tile_buffers=options.tile_buffers,local_checkpoints=options.local_checkpoints,
                                        state_factory=store.new_state if store is not None else None)
            state = host.state()
            signals = torch.empty((project.region.steps, len(host.monitors)), dtype=host.field_dtype,
                                  device='cpu') if spectral is None else spectral.zeros()
            for start in range(0, project.region.steps, options.temporal_depth):
                depth = min(options.temporal_depth, project.region.steps-start)
                state, values = operator.forward(epsilon, state, start, depth)
                if spectral is None:signals[start:start+depth].copy_(values)
                else:spectral.accumulate(signals, values, start)
            if operator.workspace is not None:
                report['forward_workspace'] = operator.workspace_report()
        report['forward_seconds'] = time.perf_counter()-started
        # No physical time history is retained by the autograd context.
        return signals

    @staticmethod
    def backward(ctx, signal_bar):
        if torch.is_grad_enabled():raise RuntimeError('Higher-order streamed derivatives are not implemented.')
        epsilon, = ctx.saved_tensors
        options, project, report = ctx.options, ctx.project, ctx.report
        _reservation(project, epsilon, options, ctx.spectral)
        started = time.perf_counter()
        host = _System(project, epsilon, prepare_updates=False, observation_monitors=None if ctx.spectral is None else ctx.spectral.observers)
        with _backing(options,report,'backward') as store:
            operator = SlabBlockOperator(host, options.slab_width, options.device, cuda_binding=options.cuda_binding,
                                        reuse_buffers=options.reuse_tile_buffers, tile_transfers=options.tile_transfers,
                                        tile_buffers=options.tile_buffers,local_checkpoints=options.local_checkpoints,
                                        state_factory=store.new_state if store is not None else None)
            steps = project.region.steps
            starts = list(range(0, steps, options.temporal_depth))+[steps]
            gradient = torch.zeros_like(epsilon)
            adjoint = host.state()
            live = 0
            report.update(peak_block_checkpoints=0, replayed_blocks=0)

            def replay(state, begin, end):
                for block in range(begin, end):
                    state, _ = operator.forward(epsilon, state, starts[block], starts[block+1]-starts[block])
                    report['replayed_blocks'] += 1
                return state

            def reverse(begin, end, restart, slots):
                nonlocal adjoint, live
                while end > begin:
                    if end-begin == 1 or slots == 0:
                        for block in reversed(range(begin, end)):
                            state = replay(restart, begin, block)
                            start, stop = starts[block], starts[block+1]
                            adjoint, contribution = operator.transpose(epsilon, state, start, stop-start,
                                                                       adjoint, signal_bar[start:stop] if ctx.spectral is None else ctx.spectral.transpose(signal_bar,start,stop))
                            gradient.add_(contribution)
                            del state, contribution
                        return
                    middle = begin+_split(end-begin, slots)
                    saved = replay(restart, begin, middle)
                    live += 1
                    report['peak_block_checkpoints'] = max(live, report['peak_block_checkpoints'])
                    try:reverse(middle, end, saved, slots-1)
                    finally:
                        del saved
                        live -= 1
                    end = middle

            try:reverse(0, len(starts)-1, host.state(), options.checkpoints)
            finally:reverse=None  # Release recursive replay captures without cyclic GC.
            if operator.workspace is not None:
                report['backward_workspace'] = operator.workspace_report()
        report['backward_seconds'] = time.perf_counter()-started
        return gradient, None, None, None, None


class StreamedSimulation(DifferentiableSimulation):
    """First-order epsilon-to-signal operation with host or file-backed state.

    Geometry tensors and outputs reside on CPU. CUDA receives one extended slab
    per reusable slot. Optional asynchronous transfers use bounded pinned pools.
    A manual policy or a policy from tune_streamed is explicit, and conservative
    admission does not itself establish a throughput advantage.
    """
    def __init__(self, project, options=None):
        super().__init__(project)
        self.streaming_options = options or StreamedAdjointOptions()

    def spectrum(self, epsilon, frequency_hz, *, window=None):
        """Accumulate a fixed-frequency DFT without retaining time signals."""
        from .adjoint_spectrum import SpectralObservation
        spectral = SpectralObservation(epsilon, self.project.region,
                                       [m.component for m in self.project.monitors if m.enabled], frequency_hz, window)
        return self._run(epsilon, spectral)

    def forward(self, epsilon):
        return self._run(epsilon, None)

    def _run(self, epsilon, spectral):
        region = self.project.region
        if not isinstance(epsilon, torch.Tensor) or epsilon.device.type != 'cpu':
            raise ValueError('Streamed epsilon must be a CPU tensor to avoid full-volume VRAM allocation.')
        if epsilon.dtype not in (torch.float32, torch.float64) or (epsilon.dtype == torch.float64) != (region.precision == 'float64'):
            raise ValueError('Epsilon dtype must match the real project precision.')
        if tuple(epsilon.shape) not in (region.shape, region.shape+(3,)):
            raise ValueError('Epsilon shape must match the project grid.')
        options = self.streaming_options
        reservation = _reservation(self.project, epsilon, options, spectral)
        if not bool(torch.isfinite(epsilon).all()) or bool((epsilon < 1).any()):
            raise ValueError('The CFL contract requires finite epsilon >= 1.')
        report = dict(experimental=True, spatial_streaming=True, full_time_autograd=False,
                      complex_fields=region.complex_fields,
                      higher_order=False, slab_width=options.slab_width,
                      temporal_depth=options.temporal_depth, checkpoint_capacity=options.checkpoints,
                      local_checkpoint_capacity=options.local_checkpoints,
                      state_storage=options.state_storage,
                      execution_device=options.device, tile_transfers=options.tile_transfers,
                      tile_buffers=options.tile_buffers if options.tile_transfers == 'async' else 1,
                      cuda_binding=options.cuda_binding,
                      reuse_tile_buffers=options.reuse_tile_buffers,
                      policy='manual', precision=str(epsilon.dtype), **reservation)
        report['observation_storage'] = 'time_history' if spectral is None else 'online_spectrum'
        if spectral is not None:report.update(spectral.reservation(min(options.temporal_depth,region.steps)))
        signals = _Streamed.apply(epsilon, self.project, options, report, spectral)
        if spectral is not None:return spectral.result(signals,report)
        return DifferentiableResult(signals, region.time_step,
                                    tuple(m.component for m in self.project.monitors if m.enabled), report)
