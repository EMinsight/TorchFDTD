"""Ledger of full-parameter-size host tensors and process peaks for one streamed adjoint.

Scope: nondispersive real scalar epsilon, contiguous on CPU, CUDA tiles with
reusable buffers, file-backed state banks and fixed point observations. Every
Python-level allocation of a CPU tensor at least half the parameter size is
recorded with its call site and released through a weak reference, so the peak
number of simultaneously live full-size host tensors is a lifetime count, not a
guess. Process RSS is sampled in a thread. Torch CUDA peaks come from the
allocator statistics. Sampled RSS can miss transient peaks, excludes the OS file
cache, and is not a host-budget guarantee for other physics paths.

python -m benchmarks.streamed_host_ledger --nx 384 --ny 192 --nz 192 --steps 20 \
    --scratch D:/scratch --output docs/validation/streamed_host_ledger_3060.json
"""
import argparse
import gc
import hashlib
import json
import platform
import threading
import time
import traceback
import weakref
from pathlib import Path

import psutil
import torch

from torchfdtd import Project, Region, Source, Monitor, StreamedSimulation, StreamedAdjointOptions
from torchfdtd import streamed, spacetime, state_store


class Ledger:
    """Record large CPU tensor allocations made through the wrapped torch entry points."""

    def __init__(self, threshold):
        self.threshold = threshold
        self.live = 0
        self.peak = 0
        self.events = []
        self.originals = {}

    def _site(self):
        for frame in reversed(traceback.extract_stack(limit=12)):
            if 'torchfdtd' in frame.filename.replace('\\', '/') and 'streamed_host_ledger' not in frame.filename:
                return f"{Path(frame.filename).name}:{frame.lineno} {frame.name}"
        return 'caller'

    def _track(self, tensor):
        if isinstance(tensor, torch.Tensor) and tensor.device.type == 'cpu' and tensor.numel() * tensor.element_size() >= self.threshold:
            self.live += 1
            self.peak = max(self.peak, self.live)
            site = self._site()
            self.events.append(dict(site=site, bytes=tensor.numel() * tensor.element_size(), live_after=self.live))

            def released(_ref, ledger=self):
                ledger.live -= 1
            weakref.finalize(tensor, released, None)
        return tensor

    def _wrap(self, owner, name):
        original = getattr(owner, name)
        self.originals[(owner, name)] = original

        def wrapper(*args, **kwargs):
            return self._track(original(*args, **kwargs))
        setattr(owner, name, wrapper)

    def __enter__(self):
        for name in ('zeros_like', 'zeros', 'empty', 'empty_like', 'full', 'full_like', 'ones', 'ones_like'):
            self._wrap(torch, name)
        for name in ('clone', 'contiguous'):
            self._wrap(torch.Tensor, name)
        return self

    def __exit__(self, *exc):
        for (owner, name), original in self.originals.items():
            setattr(owner, name, original)


class RssSampler(threading.Thread):
    def __init__(self, interval=0.01):
        super().__init__(daemon=True)
        self.process = psutil.Process()
        self.interval = interval
        self.peak = 0
        self.samples = 0
        self.stop = threading.Event()

    def run(self):
        while not self.stop.is_set():
            self.peak = max(self.peak, self.process.memory_info().rss)
            self.samples += 1
            time.sleep(self.interval)


def build(nx, ny, nz, steps, periodic):
    mesh = .05
    region = Region(dimension='3d', size=(nx * mesh, ny * mesh, nz * mesh), mesh=mesh, pml_cells=6,
                    steps=steps, precision='float32', backend='cpu', memory_mode='streamed')
    if periodic:
        region.boundaries.x_min.kind = region.boundaries.x_max.kind = 'periodic'
    p = Project(region=region,
                sources=[Source(center=(-.2, 0, 0), pulse='continuous', wavelength=1.1)],
                monitors=[Monitor(component='Ez', center=(.1, 0, 0)), Monitor(component='Hy', center=(0, .1, 0))])
    assert tuple(p.region.shape) == (nx, ny, nz), p.region.shape
    return p


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--nx', type=int, default=384)
    parser.add_argument('--ny', type=int, default=192)
    parser.add_argument('--nz', type=int, default=192)
    parser.add_argument('--steps', type=int, default=20)
    parser.add_argument('--width', type=int, default=16)
    parser.add_argument('--depth', type=int, default=2)
    parser.add_argument('--checkpoints', type=int, default=1)
    parser.add_argument('--periodic', action='store_true')
    parser.add_argument('--device', default='cuda')
    parser.add_argument('--scratch', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    p = build(args.nx, args.ny, args.nz, args.steps, args.periodic)
    cells = args.nx * args.ny * args.nz
    parameter_bytes = cells * 4
    options = StreamedAdjointOptions(device=args.device, state_storage='disk', state_directory=args.scratch,
                                     disk_budget_bytes=64 * 1024 ** 3, host_budget_bytes=48 * 1024 ** 3,
                                     gpu_budget_bytes=10 * 1024 ** 3, slab_width=args.width,
                                     temporal_depth=args.depth, checkpoints=args.checkpoints, local_checkpoints=1)
    gc.collect()
    if args.device == 'cuda':
        torch.cuda.synchronize()
        torch.cuda.reset_peak_memory_stats()
        cuda_baseline = torch.cuda.memory_allocated()
    process = psutil.Process()
    rss_before_parameter = process.memory_info().rss
    epsilon = torch.full(p.region.shape, 1.7, dtype=torch.float32, requires_grad=True)
    assert epsilon.is_contiguous()
    rss_baseline = process.memory_info().rss
    sampler = RssSampler()
    sampler.start()
    started = time.perf_counter()
    with Ledger(parameter_bytes // 2) as ledger:
        model = StreamedSimulation(p, options)
        result = model(epsilon)
        forward_peak_live = ledger.peak
        forward_rss_peak = sampler.peak
        forward_events = len(ledger.events)
        gradient, = torch.autograd.grad(result.signals.square().sum(), epsilon)
        backward_peak_live = ledger.peak
    elapsed = time.perf_counter() - started
    sampler.stop.set()
    sampler.join()
    if args.device == 'cuda':
        torch.cuda.synchronize()
        cuda_peak = torch.cuda.max_memory_allocated() - cuda_baseline
        cuda_reserved_peak = torch.cuda.max_memory_reserved()
    report = result.report
    sites = {}
    for event in ledger.events:
        sites.setdefault(event['site'], dict(count=0, bytes=event['bytes']))['count'] += 1
    record = dict(
        scope='One nondispersive real FP32 scalar-epsilon streamed adjoint with CUDA tiles, reusable buffers, '
              'file-backed banks and point observations. Python-level CPU allocations of at least half the parameter '
              'size are counted by identity; C-level temporaries appear only in sampled RSS. Not a guarantee for '
              'ADE, tensor, spectral-plane or geometry paths.',
        platform=platform.platform(), torch_version=torch.__version__,
        device=torch.cuda.get_device_name(0) if args.device == 'cuda' else 'cpu',
        runtime_source_sha256={name: hashlib.sha256(Path(module.__file__).read_bytes()).hexdigest()
                               for name, module in (('streamed.py', streamed), ('spacetime.py', spacetime), ('state_store.py', state_store))},
        grid=[args.nx, args.ny, args.nz], cells=cells, steps=args.steps, periodic_x=args.periodic,
        options=dict(slab_width=args.width, temporal_depth=args.depth, checkpoints=args.checkpoints, local_checkpoints=1,
                     state_storage='disk', device=args.device),
        parameter_bytes=parameter_bytes, state_bytes=report['state_bytes'],
        full_size_host_tensors=dict(
            forward_peak_live=forward_peak_live, backward_peak_live=backward_peak_live,
            includes_caller_epsilon=False, allocation_sites=sites, forward_allocations=forward_events,
            total_allocations=len(ledger.events)),
        reservation=dict(host_bytes=report['host_reservation_bytes'], gpu_bytes=report['gpu_reservation_bytes'],
                         disk_bytes=report['disk_reservation_bytes'],
                         dense_parameter_term_bytes=report.get('dense_parameter_reservation_bytes', 8 * parameter_bytes),
                         dense_parameter_multiplier=report.get('dense_parameter_multiplier', 8)),
        measured=dict(
            rss_before_parameter=rss_before_parameter, rss_baseline_with_parameter=rss_baseline,
            forward_rss_peak_delta=forward_rss_peak - rss_baseline, rss_peak_delta=sampler.peak - rss_baseline,
            rss_peak_delta_over_parameter_bytes=(sampler.peak - rss_baseline) / parameter_bytes,
            rss_samples=sampler.samples,
            cuda_peak_allocated_delta=cuda_peak if args.device == 'cuda' else None,
            cuda_peak_reserved=cuda_reserved_peak if args.device == 'cuda' else None,
            cuda_peak_over_gpu_reservation=(cuda_peak / report['gpu_reservation_bytes']) if args.device == 'cuda' else None,
            forward_seconds=report['forward_seconds'], backward_seconds=report['backward_seconds'], elapsed_seconds=elapsed),
        backing=dict(forward=report['forward_backing_store'], backward=report['backward_backing_store']),
        gradient_finite=bool(torch.isfinite(gradient).all()), gradient_norm=float(gradient.norm()),
        peak_block_checkpoints=report['peak_block_checkpoints'], replayed_blocks=report['replayed_blocks'])
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes((json.dumps(record, indent=2) + '\n').encode('utf-8'))
    print(json.dumps({k: v for k, v in record.items() if k not in ('backing', 'runtime_source_sha256')}, indent=2))


if __name__ == '__main__':
    main()
