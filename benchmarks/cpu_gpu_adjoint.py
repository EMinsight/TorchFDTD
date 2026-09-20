"""Matched CPU, resident CUDA and DRAM-streamed CUDA forward/objective/VJPs.

The CPU reference is PhotonWeave's Torch backend, not an optimized external
CPU solver. This measures a fixed discrete workload, not optical convergence,
kernel-only throughput, beyond-VRAM capacity or a complete optimizer loop.
"""
import argparse
from dataclasses import asdict
import gc
import hashlib
import json
import math
from pathlib import Path
import platform
import statistics
import threading
import time

import torch

from photonweave import (AdjointExecutionPolicy, AdjointOptions, BoundaryFace,
    FieldMonitor, Project, Region, Source, StreamedAdjointOptions)
from photonweave.execution_tuning import _resident_reservation
from photonweave.memory_profile import host_memory
from photonweave.plane_execution import plane_model, plane_reservation
from benchmarks.streamed_policy import evaluate


def check_agreement(actual, reference, tolerance=2e-4):
    """Check every output and material-gradient element with bounded scratch."""
    if len(actual) != len(reference):
        raise AssertionError('Output/gradient group count changed.')
    errors = []
    for a, b in zip(actual, reference):
        if a.shape != b.shape or a.dtype != b.dtype or a.device.type != 'cpu' or b.device.type != 'cpu':
            raise AssertionError('Comparison requires matching CPU shapes and dtypes.')
        squared_error = squared_norm = max_error = 0.
        # Views are contiguous in the public result path. Avoid a hidden full
        # tensor reshape copy if a future path changes that contract.
        if not a.is_contiguous() or not b.is_contiguous():
            raise AssertionError('Benchmark comparison requires contiguous results.')
        af, bf = a.view(-1), b.view(-1)
        for start in range(0, af.numel(), 262144):
            x, y = af[start:start+262144], bf[start:start+262144]
            if not bool(torch.isfinite(x).all() and torch.isfinite(y).all()):
                raise AssertionError('Nonfinite output or gradient.')
            difference = (x-y).abs().to(torch.float64)
            squared_error += float(difference.square().sum())
            squared_norm += float(y.abs().to(torch.float64).square().sum())
            max_error = max(max_error, float(difference.max()))
        if not math.isfinite(squared_error) or not math.isfinite(squared_norm):
            raise AssertionError('Nonfinite comparison norm.')
        if squared_norm <= 0:
            raise AssertionError('Degenerate output or material-gradient group.')
        relative = math.sqrt(squared_error/squared_norm)
        if relative > tolerance:
            raise AssertionError(f'Full output/material VJP relative L2 {relative:g} exceeds {tolerance:g}.')
        errors.append(dict(relative_l2=relative, max_absolute=max_error,
                           reference_l2=math.sqrt(squared_norm)))
    return errors


class _MemorySample:
    """Process RSS sampling, not an exact peak or a solver-only allocation."""
    def __enter__(self):
        import psutil
        self.process = psutil.Process()
        self.baseline = self.peak = self.process.memory_info().rss
        self.stop = threading.Event()
        self.error = None
        def sample():
            try:
                while not self.stop.wait(.05):
                    self.peak = max(self.peak, self.process.memory_info().rss)
            except Exception as exc:
                self.error = exc
        self.thread = threading.Thread(target=sample, daemon=True)
        self.thread.start()
        return self

    def __exit__(self, *_):
        self.stop.set()
        self.thread.join()
        self.peak = max(self.peak, self.process.memory_info().rss)
        if self.error is not None:
            raise RuntimeError('RSS sampler failed.') from self.error


def trial_order(names, repetition):
    offset = repetition % len(names)
    order = list(names[offset:]) + list(names[:offset])
    return order[::-1] if repetition % 2 else order


def summarize(records, cpu_names):
    medians = {name: statistics.median(row['seconds'] for row in rows)
               for name, rows in records.items()}
    if any(not math.isfinite(v) or v <= 0 for v in medians.values()):
        raise AssertionError('Invalid timing sample.')
    baseline = min(cpu_names, key=medians.get)
    return dict(median_seconds=medians, fastest_tested_cpu=baseline,
        speedup_over_fastest_tested_cpu={name: medians[baseline]/v for name, v in medians.items()})


def fixture(size, steps):
    region = Region(dimension='3d', size=(size*.1,)*3, mesh=.1, steps=steps,
        precision='float32', pml_cells=3, cuda_kernel='fused', memory_mode='streamed')
    region.boundaries.x_min = BoundaryFace(kind='periodic')
    region.boundaries.x_max = BoundaryFace(kind='periodic')
    span = (size-8)*.1
    return Project(region=region,
        sources=[Source(center=(-.2, 0, 0), pulse='continuous')],
        monitors=[FieldMonitor(id=name, center=(x, 0, 0), size=(0, span, span),
                               normal='x', downsample=max(1, size//8))
                  for name, x in (('near', .2), ('far', .3))])


def policies(args):
    gpu, host = int(args.gpu_budget_gib*1024**3), int(args.host_budget_gib*1024**3)
    result = {}
    for threads in args.cpu_threads:
        options = AdjointOptions(checkpoints=args.checkpoints, backward_kernel='torch',
            host_budget_bytes=host, resident_budget_bytes=host)
        result[f'cpu_t{threads}'] = (AdjointExecutionPolicy(resident=options,
            device='cpu', host_budget_bytes=host), threads)
    options = AdjointOptions(checkpoints=args.checkpoints, backward_kernel='fused',
        gpu_budget_bytes=gpu, host_budget_bytes=host, resident_budget_bytes=gpu)
    result['cuda_resident'] = (AdjointExecutionPolicy(resident=options,
        device='cuda', host_budget_bytes=host), args.gpu_host_threads)
    streamed = StreamedAdjointOptions(device='cuda', slab_width=args.slab_width,
        temporal_depth=args.temporal_depth, checkpoints=args.checkpoints,
        gpu_budget_bytes=gpu, host_budget_bytes=host, tile_transfers='async', tile_buffers=2)
    result['cuda_dram'] = (AdjointExecutionPolicy(streamed=streamed,
        device='cuda', host_budget_bytes=host), args.gpu_host_threads)
    return result


def preflight(project, candidates, dispersive, host_budget, headroom):
    """Admit every mode before allocating any full-grid design or fields."""
    shapes = (project.region.shape, (2,), (2,), ()) if dispersive else (project.region.shape,)
    parameters = 4*sum(math.prod(s) for s in shapes)
    reservations = {}
    for name, (policy, _) in candidates.items():
        if policy.resident is not None:
            reservation = _resident_reservation(project, shapes, policy, [1.5e14, 2e14, 2.5e14])
        else:
            model = plane_model(project, policy.streamed, dispersive)
            reservation = plane_reservation(model, shapes, policy.streamed, [1.5e14, 2e14, 2.5e14])
        # Caller leaves, retained CPU oracle, candidate VJPs, scaling and
        # comparison scratch lie outside the native solver reservation.
        overhead = 8*parameters + 4*reservation['plane_output_bytes'] + 32*1024**2
        reservation = dict(reservation, benchmark_host_allowance_bytes=overhead)
        reservation['benchmark_host_reservation_bytes'] = reservation['host_reservation_bytes']+overhead
        if reservation['benchmark_host_reservation_bytes'] > host_budget:
            raise ValueError('Solver plus benchmark data exceed the host budget.')
        reservations[name] = reservation
    required = max(r['benchmark_host_reservation_bytes'] for r in reservations.values())
    require_headroom(required, headroom)
    return reservations


def require_headroom(required, headroom):
    available = host_memory()['available_bytes']
    if available is None or required+headroom > available:
        raise ValueError('Cannot preserve required RAM headroom for this benchmark.')


def measure(project, policy, dispersive):
    design = (torch.full(project.region.shape, 1.7, dtype=torch.float32, requires_grad=True),)
    if dispersive:
        design += tuple(torch.tensor(v, dtype=torch.float32, requires_grad=True)
                        for v in ([.7, .4], [0., 1.8], .2))
    p = project.model_copy(deep=True)
    p.region.cuda_kernel = 'torch' if policy.device == 'cpu' else 'fused'
    gc.collect()
    torch.cuda.synchronize()
    torch.cuda.reset_peak_memory_stats()
    allocated_before = torch.cuda.memory_allocated()
    reserved_before = torch.cuda.memory_reserved()
    with _MemorySample() as rss:
        started = time.perf_counter()
        model = policy.simulation(p, dispersive=dispersive)
        result, values, gradients = evaluate(model, design, p.region, dispersive=dispersive, planes=True)
        torch.cuda.synchronize()
        seconds = time.perf_counter()-started
    record = dict(seconds=seconds, solver=result.report,
        torch_cuda_allocated_before_bytes=allocated_before,
        torch_cuda_reserved_before_bytes=reserved_before,
        peak_torch_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),
        peak_torch_cuda_reserved_bytes=torch.cuda.max_memory_reserved(),
        rss_before_bytes=rss.baseline, sampled_peak_process_rss_bytes=rss.peak,
        sampled_rss_growth_bytes=rss.peak-rss.baseline)
    # Unified models return CPU results and gradients. These contiguous copies
    # are only for verification and are outside the timed solver operation.
    detached = tuple(t.detach().contiguous() for t in (values, *gradients))
    return record, detached


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    parser.add_argument('--execute', action='store_true')
    parser.add_argument('--smoke', action='store_true')
    parser.add_argument('--size', type=int, default=256)
    parser.add_argument('--steps', type=int, default=128)
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--cpu-threads', type=int, nargs='+', default=[6, 12])
    parser.add_argument('--gpu-host-threads', type=int, default=4)
    parser.add_argument('--checkpoints', type=int, default=2)
    parser.add_argument('--slab-width', type=int, default=32)
    parser.add_argument('--temporal-depth', type=int, default=8)
    parser.add_argument('--gpu-budget-gib', type=float, default=32.)
    parser.add_argument('--host-budget-gib', type=float, default=64.)
    parser.add_argument('--dispersive', action='store_true')
    args = parser.parse_args(argv)
    if args.size < 16 or args.size % 4 or args.steps < 16 or args.repeats < 1:
        raise ValueError('Use size >= 16 divisible by four, steps >= 16 and positive repeats.')
    if not args.smoke and (args.size < 128 or args.steps < 128 or args.repeats < 3):
        raise ValueError('Non-smoke comparisons require size >= 128, steps >= 128 and three repeats.')
    if min(*args.cpu_threads, args.gpu_host_threads) < 1 or len(set(args.cpu_threads)) != len(args.cpu_threads):
        raise ValueError('Thread counts must be positive and CPU counts unique.')
    if not all(math.isfinite(v) and v > 0 for v in (args.gpu_budget_gib, args.host_budget_gib)):
        raise ValueError('Memory budgets must be finite and positive.')
    if not torch.cuda.is_available():
        raise ValueError('Matched benchmark requires a CUDA GPU.')
    # Fail before planning/execution if the optional memory sampler is absent.
    import psutil
    project = fixture(args.size, args.steps)
    candidates = policies(args)
    cpu_names = [n for n in candidates if n.startswith('cpu_')]
    headroom = 0 if args.smoke else 16*1024**3
    root = Path(__file__).resolve().parents[1]
    sources = [Path(__file__).resolve(), root/'benchmarks/streamed_policy.py',
               *sorted((root/'photonweave').glob('*.py'))]
    data = dict(stage='planning', driver_smoke=args.smoke,
        configuration={k:v for k, v in vars(args).items() if k != 'output'},
        grid=project.region.shape, time_step_seconds=project.region.time_step,
        torch_version=torch.__version__, cpu=platform.processor(),
        physical_cpu_count=psutil.cpu_count(logical=False), logical_cpu_count=psutil.cpu_count(),
        gpu=torch.cuda.get_device_name(), gpu_total_bytes=torch.cuda.get_device_properties(0).total_memory,
        host_memory=host_memory(), host_headroom_bytes=headroom,
        policies={n:dict(policy=asdict(p), threads=t) for n, (p, t) in candidates.items()},
        warmups={}, records={n:[] for n in candidates}, order=[],
        source_sha256={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sources},
        scope=__doc__, timing_scope='Fresh model construction, material scaling/packing, CPU-to-GPU inputs, '
            'forward, plane-field and signed-flux proxy objective, replay/backward and CPU outputs/material VJPs. '
            'Excludes input leaf allocation, project copy, GC, thread changes, verification, final cleanup and optimizer/geometry. '
            'One full-duration warm-up per mode, then interleaved repetitions. No cache flush between trials. '
            'CPU ratios use the fastest tested CPU-thread median, not the fastest possible CPU implementation.',
        memory_scope='50 ms sampled whole-process RSS includes reference, runtime and allocator pools. '
            'Torch allocated/reserved peaks exclude CUDA context and non-Torch allocations. '
            'Native reservations plus benchmark allowances are engineering estimates, not RSS guarantees.',
        comparison_tolerance_relative_l2=2e-4)
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    def save():
        temp = path.with_suffix('.tmp')
        temp.write_bytes((json.dumps(data, indent=2)+'\n').encode())
        temp.replace(path)
    save()
    previous_threads = torch.get_num_threads()
    try:
        data['reservations'] = preflight(project, candidates, args.dispersive,
            int(args.host_budget_gib*1024**3), headroom)
        data['stage'] = 'admitted_not_executed'
        save()
        if not args.execute:
            return data
        reference = None
        for repetition in range(-1, args.repeats):
            order = list(candidates) if repetition == -1 else trial_order(list(candidates), repetition)
            data['order'].append(dict(repetition=repetition, modes=order))
            for name in order:
                data.update(stage='warmup' if repetition == -1 else 'measuring', active_mode=name,
                            active_repetition=repetition)
                save()
                print(data['stage'], name, repetition, flush=True)
                policy, threads = candidates[name]
                torch.set_num_threads(threads)
                require_headroom(data['reservations'][name]['benchmark_host_reservation_bytes'], headroom)
                record, outputs = measure(project, policy, args.dispersive)
                if reference is None:
                    reference = outputs
                record['agreement'] = check_agreement(outputs, reference)
                record['threads'] = torch.get_num_threads()
                if repetition == -1:
                    data['warmups'][name] = record
                else:
                    data['records'][name].append(record)
                del outputs
                save()
        data.update(summarize(data['records'], cpu_names), stage='complete')
        data.pop('active_mode', None)
        data.pop('active_repetition', None)
        save()
        return data
    except BaseException as exc:
        data.update(failed_during=data['stage'], stage='failed', error=repr(exc))
        save()
        raise
    finally:
        torch.set_num_threads(previous_threads)


if __name__ == '__main__':
    main()
