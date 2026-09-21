"""Workbench execution modes: GPU or CPU placement and resident or streamed memory.

`resolve_execution` turns `Region.execution_mode` into a concrete plan from the
resources the server reports. Resident scenes keep running through
`Simulation`. Scenes resolved to a streamed mode run the `StreamedSimulation`
slab operator forward only, with DRAM or file-backed field banks, point and
plane monitors as tile observations and one field snapshot at the final step.
Thresholds are documented in docs/EXECUTION_MODES.md.
"""
from __future__ import annotations

from dataclasses import asdict, replace
import math
import os
from pathlib import Path
import time
from types import SimpleNamespace

import numpy as np
import torch

from .models import Project, Monitor
from .memory_profile import host_memory

RESIDENT_CELL_LIMIT = 8_000_000
# The resident CUDA solver refuses estimates above 75% of free device memory.
RESIDENT_DEVICE_FRACTION = .75
# Host admission everywhere in the streamed engine uses 80% of available RAM.
RESIDENT_HOST_FRACTION = .8
STREAMED_HOST_FRACTION = .8
STREAMED_DEVICE_FRACTION = .8
STREAMED_DISK_FRACTION = .8
DEFAULT_SLAB_WIDTH = 32
DEFAULT_TEMPORAL_DEPTH = 4
OBSERVER_WARNING = 50_000


def execution_resources():
    """Live resource record: the /api/health fields the resolver reads."""
    cuda = torch.cuda.is_available()
    record = dict(cuda=cuda, cupy=False, gpu=None, gpu_free_bytes=0, gpu_total_bytes=0)
    if cuda:
        free, total = torch.cuda.mem_get_info()
        record.update(gpu=torch.cuda.get_device_name(0), gpu_free_bytes=int(free), gpu_total_bytes=int(total))
        try:
            from .cuda_bootstrap import prepare_cuda_kernels
            prepare_cuda_kernels()
            record['cupy'] = True
        except RuntimeError:
            record['cupy'] = False
    host = host_memory()
    record.update(host_total_bytes=host['total_bytes'], host_available_bytes=host['available_bytes'])
    return record


def scratch_directory(root):
    """Scratch for file-backed banks: TORCHFDTD_SCRATCH or <results>/scratch."""
    return Path(os.environ.get('TORCHFDTD_SCRATCH') or Path(root)/'scratch').resolve()


def _gib(value):
    if value is None:
        return 'unknown'
    return f'{value/2**30:.2f} GiB' if value >= 2**30 else f'{value/2**20:.1f} MiB'


class _Cancelled(Exception):
    pass


class BrowserObservations:
    """Tile observations for point time histories and plane DFT accumulators.

    Conventions follow the resident solver: a sample is taken after the
    completed step, E at (n+1) dt and H half a step later; planes accumulate
    exp(+2 pi i f t) with the monitor's apodization window and time stride and
    are interpolated from the observed Yee cells after accumulation.
    """
    def __init__(self, project):
        from .field_monitors import plane_plan, interpolation_map
        from .solver import index_at
        from .spectra import frequency_samples, apodization_window
        self.project = project
        r = self.region = project.region
        self.dt, self.steps = r.time_step, r.steps
        points, specs = [], []
        for raw in project.monitors:
            if not raw.enabled:
                continue
            m = project.resolved_monitor(raw)
            if m.kind == 'point':
                points.append((m, m.component, int(np.ravel_multi_index(index_at(m.center, r, m.component), r.shape))))
                continue
            plan = plane_plan(r, m)
            maps = [(component,)+tuple(interpolation_map(r, component, plan['points_um'])) for component in m.required_fields]
            specs.append((m, plan, maps))
        # One observer per distinct (component, Yee cell), grouped by component.
        cells = {c: [] for c in ('Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz')}
        for _, component, cell in points:
            cells[component].append(np.array([cell], dtype=np.int64))
        for _, _, maps in specs:
            for component, indices, _ in maps:
                cells[component].append(indices.ravel()//3)
        observers, offsets, unique = [], {}, {}
        for component, arrays in cells.items():
            if not arrays:
                continue
            offsets[component], unique[component] = len(observers), np.unique(np.concatenate(arrays))
            axis = 'xyz'.index(component[1])
            observers.extend((component, (int(i), int(j), int(k)), axis) for i, j, k in zip(*np.unravel_index(unique[component], r.shape)))
        def column(component, index):
            return offsets[component]+np.searchsorted(unique[component], index)
        self.points = [m for m, _, _ in points]
        self.point_columns = [int(column(component, cell)) for _, component, cell in points]
        self.planes = []
        for m, plan, spec in specs:
            maps = [(column(component, indices//3), weights) for component, indices, weights in spec]
            times = np.arange(1, r.steps+1)*self.dt
            mask = (np.arange(r.steps) % m.time_downsample == 0)*m.time_downsample
            windows = {family: apodization_window(times+shift, m.spectrum)*self.dt*mask
                       for family, shift in (('E', 0.), ('H', self.dt/2))}
            columns = np.array(sorted({int(c) for cols, _ in maps for c in cols.ravel()}), dtype=np.int64)
            position = {int(c): i for i, c in enumerate(columns)}
            families = {family: np.array([i for i, c in enumerate(columns) if observers[c][0][0] == family], dtype=np.int64)
                        for family in 'EH'}
            frequency = frequency_samples(m.spectrum)
            self.planes.append(SimpleNamespace(monitor=m, plan=plan, maps=maps, frequency=frequency, windows=windows,
                                               columns=columns, position=position, families=families,
                                               accumulator=np.zeros((len(frequency), len(columns)), dtype=np.complex128)))
        self.observers = tuple(observers)
        self.components = tuple(o[0] for o in observers)
        self.signals = None

    def reservation(self, depth):
        """Host bytes for retained histories, accumulators and one block of samples."""
        item = 8 if self.region.precision == 'float64' else 4
        item *= 2 if self.region.complex_fields else 1
        histories = 2*self.steps*len(self.points)*item
        accumulators = 2*sum(p.accumulator.nbytes for p in self.planes)
        block = 4*depth*len(self.observers)*max(item, 16)
        maps = sum(c.nbytes+w.nbytes for p in self.planes for c, w in p.maps)+sum(p.columns.nbytes*2 for p in self.planes)
        return dict(spectral_reservation_bytes=histories+accumulators+block+maps,
                    point_history_bytes=histories, plane_accumulator_bytes=accumulators, block_sample_bytes=block)

    def start(self, field_dtype):
        dtype = {torch.float32: np.float32, torch.float64: np.float64, torch.complex64: np.complex64, torch.complex128: np.complex128}[field_dtype]
        self.signals = np.zeros((self.steps, len(self.points)), dtype=dtype)

    def accumulate(self, values, start):
        v = values.numpy() if isinstance(values, torch.Tensor) else np.asarray(values)
        if not np.isfinite(v).all():
            raise FloatingPointError('Fields diverged. Check mesh, sources and precision.')
        depth = v.shape[0]
        if self.point_columns:
            self.signals[start:start+depth] = v[:, self.point_columns]
        for plane in self.planes:
            block = v[:, plane.columns]
            for family, local in plane.families.items():
                if not len(local):
                    continue
                t = (np.arange(start, start+depth)+1)*self.dt+(self.dt/2 if family == 'H' else 0.)
                kernel = np.exp(2j*np.pi*plane.frequency[:, None]*t[None, :])*plane.windows[family][None, start:start+depth]
                plane.accumulator[:, local] += kernel@block[:, local]

    def plane_results(self):
        from .field_monitors import plane_result
        results = []
        for plane in self.planes:
            fields = []
            for columns, weights in plane.maps:
                local = np.vectorize(plane.position.__getitem__)(columns)
                fields.append((plane.accumulator[:, local]*weights[None]).sum(axis=1))
            values = np.stack(fields, axis=-1)
            results.append(plane_result(plane.monitor, plane.plan, plane.frequency, plane.monitor.required_fields,
                                        values, self.region.dimension))
        return results


def _browser_scene(project):
    """Internal streamed project (dummy point monitor) and the real observations."""
    p = Project.model_validate(project.model_dump())
    from .tensor_project import uses_tensor
    if uses_tensor(p):
        raise ValueError('Anisotropic tensor materials stream only through the Python StreamedTensorSimulation API. Run this scene resident.')
    from .endpoint_native import uses_endpoint
    if uses_endpoint(p.region):
        raise ValueError('PMC/symmetric faces run resident only in the workbench.')
    observations = BrowserObservations(p)
    internal = p.model_copy(deep=True)
    internal.region.memory_mode = 'streamed'
    internal.monitors = [Monitor()]
    return Project.model_validate(internal.model_dump()), observations


def _base_options(storage, backend, health, scratch):
    from .streamed import StreamedAdjointOptions
    device = 'cuda' if backend == 'cuda' and health.get('cupy') else 'cpu'
    available = health.get('host_available_bytes')
    host_budget = max(1, int(available*STREAMED_HOST_FRACTION)) if available is not None else 1 << 62
    gpu_budget = max(1, int((health.get('gpu_free_bytes') or 0)*STREAMED_DEVICE_FRACTION)) if device == 'cuda' else 1
    options = StreamedAdjointOptions(slab_width=DEFAULT_SLAB_WIDTH, temporal_depth=DEFAULT_TEMPORAL_DEPTH, checkpoints=0,
                                     device=device, host_budget_bytes=host_budget, gpu_budget_bytes=gpu_budget)
    if storage == 'disk':
        from .state_store import disk_free
        free = disk_free(scratch)
        options = replace(options, state_storage='disk', state_directory=str(scratch),
                          disk_budget_bytes=max(1, int(free*STREAMED_DISK_FRACTION)))
    return options


def _select_policy(internal, base, observations):
    """Default slab 32 x depth 4, else the nearest admitted planner candidate."""
    from .streamed_planning import plan_streamed_work
    from .streamed import _reservation
    from .boundaries import material_shape
    diagonal = internal.region.material_sampling == 'yee'
    plan = plan_streamed_work(internal, base, diagonal=diagonal)
    report = plan.report
    admitted = [report['candidates'][i] for i in report['admitted_indices']]
    if not admitted:
        reasons = sorted({c.get('reason', '') for c in report['candidates']})
        raise ValueError('No streamed tile policy is admitted. '+' | '.join(reasons))
    def distance(candidate):
        o = candidate['options']
        return (abs(math.log2(o['temporal_depth']/base.temporal_depth)), abs(math.log2(o['slab_width']/base.slab_width)), -o['slab_width'])
    admitted.sort(key=distance)
    epsilon = torch.empty(material_shape(internal.region, diagonal), dtype=getattr(torch, internal.region.precision), device='meta')
    rejected = []
    for candidate in admitted:
        options = replace(base, slab_width=candidate['options']['slab_width'], temporal_depth=candidate['options']['temporal_depth'])
        try:
            reservation = _reservation(internal, epsilon, options, observations)
        except ValueError as exc:
            rejected.append(str(exc))
            continue
        policy = dict(slab_width=options.slab_width, temporal_depth=options.temporal_depth, checkpoints=0,
                      state_storage=options.state_storage, tile_device=options.device, tile_transfers=options.tile_transfers,
                      selection='default slab 32 x depth 4, else the nearest admitted candidate from the planner set',
                      planner_candidates=len(report['candidates']), planner_admitted=len(report['admitted_indices']),
                      observers=len(observations.observers))
        return options, reservation, policy
    raise ValueError('No admitted tile policy also fits the scene observations. '+rejected[0])


def _streamed_candidate(project, storage, backend, health, scratch):
    result = dict(storage=storage, admitted=False, reason=None, policy=None, reservation=None, options=None)
    try:
        internal, observations = _browser_scene(project)
        base = _base_options(storage, backend, health, scratch)
        options, reservation, policy = _select_policy(internal, base, observations)
    except (ValueError, RuntimeError, OSError) as exc:
        result['reason'] = str(exc)
        return result
    result.update(admitted=True, options=asdict(options), policy=policy,
                  reservation={k: v for k, v in reservation.items() if isinstance(v, (int, float))})
    result['reason'] = _describe(storage, options, reservation, health)
    return result


def _describe(storage, options, reservation, health):
    parts = [f'host reservation {_gib(reservation["host_reservation_bytes"])} of {_gib(health.get("host_available_bytes"))} available']
    if storage == 'disk':
        parts.append(f'disk banks {_gib(reservation["disk_reservation_bytes"])} (budget {_gib(options.disk_budget_bytes)})')
    if options.device == 'cuda':
        parts.append(f'GPU tiles {_gib(reservation["gpu_reservation_bytes"])} of {_gib(health.get("gpu_free_bytes"))} free')
    parts.append(f'slab {options.slab_width} x depth {options.temporal_depth}')
    return ' · '.join(parts)


def _resident_fit(project, summary, backend, health, cells):
    from .solver import estimate
    summary = summary or estimate(project)
    required = int(summary['estimated_memory_mb']*2**20)
    if backend == 'cuda':
        free, fraction, pool = health.get('gpu_free_bytes'), RESIDENT_DEVICE_FRACTION, 'free device memory'
    else:
        free, fraction, pool = health.get('host_available_bytes'), RESIDENT_HOST_FRACTION, 'available host memory'
    limit = int(free*fraction) if free is not None else None
    fits, reason = True, f'resident estimate {_gib(required)} within {fraction:.0%} of {pool} ({_gib(free)})'
    if project.region.memory_mode == 'streamed':
        fits, reason = False, 'memory_mode is streamed'
    elif cells > RESIDENT_CELL_LIMIT:
        fits, reason = False, f'{cells:,} cells exceed the resident limit of {RESIDENT_CELL_LIMIT:,}'
    elif limit is not None and required > limit:
        fits, reason = False, f'resident estimate {_gib(required)} exceeds {fraction:.0%} of {pool} ({_gib(free)})'
    return dict(fits=fits, reason=reason, estimated_bytes=required, free_bytes=free, limit_bytes=limit,
                fraction=fraction, cell_limit=RESIDENT_CELL_LIMIT)


def resolve_execution(project, *, health, scratch, summary=None):
    """Resolve Region.execution_mode against a resource record.

    Auto picks resident when the estimate fits the documented margin, then a
    streamed host policy, then streamed disk. The record is JSON-compatible and
    carries the reasons; it never raises for a scene that fits nothing.
    """
    r = project.region
    requested = r.execution_mode
    backend = 'cuda' if r.backend == 'cuda' or (r.backend == 'auto' and health.get('cuda')) else 'cpu'
    cells = math.prod(r.shape)
    record = dict(requested=requested, mode=None, backend=backend, gpu=health.get('gpu') if backend == 'cuda' else None,
                  cells=cells, reason=None, error=None, warnings=[], scratch_directory=str(scratch),
                  policy=None, reservation=None, options=None)
    record['resident'] = resident = _resident_fit(project, summary, backend, health, cells)
    if r.memory_mode == 'budgeted' or requested == 'resident' or (requested == 'auto' and resident['fits']):
        record.update(mode='resident', reason=resident['reason'] if r.memory_mode != 'budgeted' else 'budgeted scenes use the adjoint API')
        if requested == 'resident' and not resident['fits']:
            record['warnings'].append('Resident execution was requested but '+resident['reason']+'.')
        return record
    storages = {'streamed_host': ('host',), 'streamed_disk': ('disk',), 'auto': ('host', 'disk')}[requested]
    reasons = [] if requested != 'auto' else ['resident: '+resident['reason']]
    for storage in storages:
        candidate = record['streamed_'+storage] = _streamed_candidate(project, storage, backend, health, scratch)
        if candidate['admitted']:
            record.update(mode='streamed_'+storage, reason=candidate['reason'], policy=candidate['policy'],
                          reservation=candidate['reservation'], options=candidate['options'])
            if backend == 'cuda' and candidate['policy']['tile_device'] == 'cpu':
                record['warnings'].append('CuPy is unavailable, so streamed tiles run on the CPU. Install the cuda-kernels extra for GPU tiles.')
            if candidate['policy']['observers'] > OBSERVER_WARNING:
                record['warnings'].append(f'{candidate["policy"]["observers"]:,} plane observation cells slow every streamed tile. Increase the monitor downsample.')
            return record
        reasons.append(f'{storage}: {candidate["reason"]}')
    record['error'] = 'No execution mode fits. '+' | '.join(reasons)
    return record


class _BrowserOperator:
    """Mixed into the slab operator: tile start callback for progress and cancellation."""
    observer = None

    def tiles(self, depth):
        count = math.ceil(self.host.region.shape[0]/self.width)
        for index, descriptor in enumerate(super().tiles(depth)):
            if self.observer is not None:
                self.observer(index, count)
            yield descriptor


def _display_plane(data, r, axis):
    """Downsample a transverse slice exactly as the resident snapshot does."""
    from .solver import field_axes
    if r.mesh_type != 'uniform':
        indices = []
        for i, coords in enumerate(field_axes(r, r.field)):
            if i == axis:
                continue
            count = min(256, r.base_shape[i])
            pixels = (np.arange(count)+.5)*r.actual_size[i]/count-r.actual_size[i]/2
            indices.append(np.abs(coords[:, None]-pixels).argmin(axis=0))
        return data[indices[0][:, None], indices[1][None, :]]
    return data[::max(1, math.ceil(data.shape[0]/256)), ::max(1, math.ceil(data.shape[1]/256))]


def _final_snapshot(state, r, width):
    """Assemble the configured slice from x slabs of the final bank; returns (slice, index, peak)."""
    from .solver import index_at
    axis = 'xyz'.index(r.slice_axis)
    plane_index = index_at(tuple(r.slice_position if i == axis else 0 for i in range(3)), r, r.field)[axis]
    component = 'xyz'.index(r.field[1].lower())
    bank = state[0] if r.field[0] == 'E' else state[1]
    peak = 0.
    def rows(lo, hi):
        nonlocal peak
        block = bank[lo:hi]
        peak = max(peak, float(torch.linalg.vector_norm(block, float('inf'))))
        return block.numpy()
    if axis == 0:
        data = rows(plane_index, plane_index+1)[0, :, :, component]
    else:
        pieces = []
        for lo in range(0, r.shape[0], width):
            block = rows(lo, min(r.shape[0], lo+width))
            pieces.append(block[:, plane_index, :, component] if axis == 1 else block[:, :, plane_index, component])
        data = np.concatenate(pieces)
    return np.array(data), plane_index, peak


def run_streamed_job(project, resolution, *, progress=None, cancel=None):
    """Forward-only streamed execution of a browser job; returns a solver Result."""
    from .streamed import StreamedAdjointOptions, StreamedSimulation, _reservation, _backing, _StreamedExecution
    from .spacetime import SlabBlockOperator
    from .solver import Result, estimate, voxelize, field_axes, run_signature
    started = time.perf_counter()
    p = Project.model_validate(project.model_dump())
    r = p.region
    options = StreamedAdjointOptions(**resolution['options'])
    internal, observations = _browser_scene(p)
    StreamedSimulation(internal, options)  # the streamed API's scene contract
    stats = estimate(p)
    eps, counts, _ = voxelize(p, with_ownership=True)
    for obj in p.structures:
        if obj.enabled and counts.get(obj.id) == 0:
            stats['warnings'].append(f'{obj.name}: no cells intersect this object. Refine mesh or reposition it.')
    epsilon = torch.from_numpy(np.ascontiguousarray(eps))
    reservation = _reservation(internal, epsilon, options, observations)

    class Operator(_BrowserOperator, SlabBlockOperator):
        pass

    class Execution(_StreamedExecution):
        @property
        def operator_type(self):
            return Operator
    execution = Execution()
    host = execution.host(internal, epsilon, observations)
    observations.start(host.field_dtype)
    report = dict(state_storage=options.state_storage, slab_width=options.slab_width, temporal_depth=options.temporal_depth,
                  checkpoints=0, execution_device=options.device, **reservation)
    starts = list(range(0, r.steps, options.temporal_depth))+[r.steps]
    blocks = len(starts)-1
    completed, termination = 0, 'max_steps'
    setup_seconds = time.perf_counter()-started
    compute_start = time.perf_counter()
    def report_progress(block, tile, tiles):
        if progress:
            progress(dict(step=completed, total=r.steps, frame=None, elapsed=time.perf_counter()-compute_start,
                          block=block, blocks=blocks, tile=tile, tiles=tiles, mode=resolution['mode']))
    def tile_started(block, tile, tiles):
        if cancel is not None and cancel.is_set():
            raise _Cancelled()
        report_progress(block, tile, tiles)
    with torch.no_grad(), _backing(options, report, 'forward') as store:
        operator = execution.operator(host, options, store)
        tiles = math.ceil(r.shape[0]/operator.width)
        state = host.state()
        try:
            for index in range(blocks):
                operator.observer = lambda tile, count, block=index+1: tile_started(block, tile+1, count)
                state, values = operator.forward(epsilon, state, starts[index], starts[index+1]-starts[index])
                observations.accumulate(values, starts[index])
                completed = starts[index+1]
        except _Cancelled:
            termination = 'cancelled'
        operator.observer = None
        report_progress(min(blocks, completed//options.temporal_depth), tiles, tiles)
        snapshot, plane_index, peak = _final_snapshot(state, r, operator.width)
        if operator.workspace is not None:
            report['forward_workspace'] = operator.workspace_report()
    seconds = time.perf_counter()-compute_start
    report.update(forward_seconds=seconds, blocks=blocks, completed_blocks=completed//options.temporal_depth+(completed % options.temporal_depth > 0), tiles_per_block=tiles)
    if not np.isfinite(snapshot).all():
        raise FloatingPointError('Fields diverged. Check mesh, sources and precision.')
    axis = 'xyz'.index(r.slice_axis)
    component = 'xyz'.index(r.field[1].lower())
    field = {'real': np.real, 'imag': np.imag, 'magnitude': np.abs, 'phase': np.angle}[r.complex_display](_display_plane(snapshot, r, axis))
    volume = eps[..., component] if eps.ndim == 4 else eps
    eps_plane = _display_plane(np.take(volume, plane_index, axis=axis), r, axis)
    tile_cuda = options.device == 'cuda'
    stats.update(backend=resolution['backend'], precision=r.precision, gpu=resolution.get('gpu') if tile_cuda else None,
                 cuda_graph=False, cuda_graph_steps=0, cuda_graph_replays=0,
                 cuda_kernel='fused' if tile_cuda else None, cuda_monitor_kernel=None,
                 steps=completed, requested_steps=r.steps, cancelled=termination == 'cancelled',
                 termination_reason=termination, auto_shutoff=False, diagnostics=[], diagnostic_seconds=0.,
                 diagnostic_backend=None, source_end_s=None, seconds=seconds, setup_seconds=setup_seconds,
                 mcells_per_second=math.prod(r.shape)*completed/max(seconds, 1e-9)/1e6,
                 field_peak=peak, field_peak_scope='final-step rows read for the snapshot', slice_index=plane_index,
                 slice_position=float(field_axes(r, r.field)[axis][plane_index]) if r.material_sampling == 'yee' else (0 if r.dimension == '2d' else (plane_index+.5)*r.mesh-r.actual_size[axis]/2),
                 complex_fields=r.complex_fields, complex_display=r.complex_display,
                 material_update='nondispersive', dispersive_samples=0, material_sampling=r.material_sampling,
                 epsilon_definition='instantaneous relative permittivity',
                 boundaries=r.boundaries.model_dump(), bloch_phase=r.bloch_phase,
                 units='geometry: um; time: s; E/H: reduced fields; Bloch phase: rad',
                 engine='TorchFDTD streamed Yee/CPML slabs (forward only)',
                 execution=dict(mode=resolution['mode'], policy=resolution['policy'], scratch_directory=resolution['scratch_directory'],
                                reservation={k: v for k, v in reservation.items() if isinstance(v, (int, float))},
                                report=report, blocks=blocks, tiles_per_block=tiles,
                                snapshot='final step only', full_fields_saved=False))
    frequency_results = observations.plane_results()
    signature = run_signature(p, completed)
    for m in frequency_results:
        m['run_signature'] = signature
    empty = np.zeros((0, 0, 0, 3), dtype=eps.dtype)
    return Result(p, stats, np.array([field]), np.array([completed]), eps_plane,
                  observations.signals[:completed], np.arange(1, completed+1)*r.time_step, empty, empty, frequency_results)
