"""Experimental DRAM-backed differentiable FDTD with bounded CUDA slabs."""
from dataclasses import dataclass
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

    def __post_init__(self):
        for name in ('slab_width', 'temporal_depth', 'gpu_budget_bytes', 'host_budget_bytes'):
            value = getattr(self, name)
            if isinstance(value, bool) or not isinstance(value, int) or value < 1:
                raise ValueError(f'{name} must be a positive integer.')
        if isinstance(self.checkpoints, bool) or not isinstance(self.checkpoints, int) or not 0 <= self.checkpoints <= 32:
            raise ValueError('checkpoints must be an integer between zero and 32.')
        if torch.device(self.device).type not in ('cpu', 'cuda'):
            raise ValueError('Streamed execution supports CPU or CUDA tiles.')


def _reservation(project, epsilon, options):
    region = project.region
    n = math.prod(region.shape)
    boundary = BoundaryDescription(region)
    cpml = sum(math.prod(s['shape']) for segments in boundary.cpml.values() for s in segments)
    item = epsilon.element_size()
    state = (6*n+cpml)*item
    depth = min(options.temporal_depth, region.steps)
    width = min(options.slab_width, region.shape[0])+4*depth
    if 0 not in boundary.wrap:width = min(width, region.shape[0])
    tile_cells = width*region.shape[1]*region.shape[2]
    if 3*tile_cells >= 2**31:raise ValueError('A CUDA tile exceeds the supported integer index range.')
    monitors = sum(m.enabled for m in project.monitors)
    terms = sum(len(s.polarization_components)*(2 if s.injection == 'oneway' else 1)
                for s in project.sources if s.enabled)
    history = region.steps*(2*monitors+terms)*item
    # Conservative bounds cover restart banks, two adjoint banks, tile gather/
    # scatter copies, validation temporaries and recursive saved block states.
    # Geometry graphs and optimizer/objective allocations remain caller-owned.
    source_copies = math.ceil(width/region.shape[0])+1
    tile_history = depth*(monitors+terms*source_copies)*item
    tile_workspace = 128*tile_cells*item
    host = (options.checkpoints+12)*state+8*epsilon.numel()*item+history+tile_workspace+2*tile_history
    gpu = tile_workspace+tile_history
    available = host_memory()['available_bytes']
    host_limit = min(options.host_budget_bytes, int(available*.8)) if available is not None else options.host_budget_bytes
    if host > host_limit:
        raise ValueError('Streamed state and checkpoint reservation exceed the host budget.')
    if torch.device(options.device).type == 'cuda':
        free, _ = torch.cuda.mem_get_info(torch.device(options.device))
        if gpu > min(options.gpu_budget_bytes, int(free*.8)):
            raise ValueError('Streamed tile workspace reservation exceeds the GPU budget.')
    return dict(host_reservation_bytes=host, gpu_reservation_bytes=gpu,
                state_bytes=state, max_extended_tile_cells=tile_cells,
                source_and_output_history_bytes=history, host_tile_reservation_bytes=tile_workspace+2*tile_history)


class _Streamed(torch.autograd.Function):
    @staticmethod
    def forward(ctx, epsilon, project, options, report):
        ctx.save_for_backward(epsilon)
        ctx.project, ctx.options, ctx.report = project.model_copy(deep=True), options, report
        started = time.perf_counter()
        host = _System(project, epsilon)
        operator = SlabBlockOperator(host, options.slab_width, options.device)
        state = host.state()
        signals = epsilon.new_empty((project.region.steps, len(host.monitors)))
        for start in range(0, project.region.steps, options.temporal_depth):
            depth = min(options.temporal_depth, project.region.steps-start)
            state, values = operator.forward(epsilon, state, start, depth)
            signals[start:start+depth].copy_(values)
        report['forward_seconds'] = time.perf_counter()-started
        # No physical time history is retained by the autograd context.
        return signals

    @staticmethod
    def backward(ctx, signal_bar):
        if torch.is_grad_enabled():raise RuntimeError('Higher-order streamed derivatives are not implemented.')
        epsilon, = ctx.saved_tensors
        options, project, report = ctx.options, ctx.project, ctx.report
        _reservation(project, epsilon, options)
        started = time.perf_counter()
        host = _System(project, epsilon)
        operator = SlabBlockOperator(host, options.slab_width, options.device)
        steps = project.region.steps
        starts = list(range(0, steps, options.temporal_depth))+[steps]
        gradient = torch.zeros_like(epsilon)
        adjoint = tuple(torch.zeros_like(s) for s in host.state())
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
                                                                   adjoint, signal_bar[start:stop])
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

        reverse(0, len(starts)-1, host.state(), options.checkpoints)
        report['backward_seconds'] = time.perf_counter()-started
        return gradient, None, None, None


class StreamedSimulation(DifferentiableSimulation):
    """First-order epsilon-to-signal operation with CPU-resident global state.

    Geometry tensors and outputs reside on CPU. CUDA receives one extended slab
    at a time. Transfers are currently synchronous. The manual slab/depth policy
    and conservative admission are explicit, not an automatic throughput claim.
    """
    def __init__(self, project, options=None):
        super().__init__(project)
        self.streaming_options = options or StreamedAdjointOptions()

    def forward(self, epsilon):
        region = self.project.region
        if not isinstance(epsilon, torch.Tensor) or epsilon.device.type != 'cpu':
            raise ValueError('Streamed epsilon must be a CPU tensor to avoid full-volume VRAM allocation.')
        if epsilon.dtype not in (torch.float32, torch.float64) or (epsilon.dtype == torch.float64) != (region.precision == 'float64'):
            raise ValueError('Epsilon dtype must match the real project precision.')
        if tuple(epsilon.shape) not in (region.shape, region.shape+(3,)):
            raise ValueError('Epsilon shape must match the project grid.')
        options = self.streaming_options
        reservation = _reservation(self.project, epsilon, options)
        if not bool(torch.isfinite(epsilon).all()) or bool((epsilon < 1).any()):
            raise ValueError('The CFL contract requires finite epsilon >= 1.')
        report = dict(experimental=True, spatial_streaming=True, full_time_autograd=False,
                      higher_order=False, slab_width=options.slab_width,
                      temporal_depth=options.temporal_depth, checkpoint_capacity=options.checkpoints,
                      execution_device=options.device, tile_transfers='synchronous',
                      policy='manual', precision=str(epsilon.dtype), **reservation)
        signals = _Streamed.apply(epsilon, self.project, options, report)
        return DifferentiableResult(signals, region.time_step,
                                    tuple(m.component for m in self.project.monitors if m.enabled), report)
