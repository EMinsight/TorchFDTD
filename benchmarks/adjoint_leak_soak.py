"""Repeated forward+backward+Adam iterations of every differentiable path, watching for growth.

Run python -m benchmarks.adjoint_leak_soak [--paths name ...] [--iterations 150]
and python -m benchmarks.adjoint_leak_soak --render to rewrite docs/ADJOINT_LEAK_SOAK.md
from the record.

docs/validation/cases/ADJOINT_LEAK_SOAK.json declares the fixtures, the measures and the
growth allowances. Every tenth iteration the driver synchronizes CUDA, collects garbage
twice and records the torch and CuPy device footprints, the process RSS and private
bytes, the garbage-collector object count, the live torch tensors, the captured CUDA
graphs, the size of every module-level cache in the package and the number of live
solver state holders. Growth is judged after a warm-up of 20 iterations.
"""
from __future__ import annotations

import argparse
import datetime
import gc
import hashlib
import json
import math
import os
import platform
import subprocess
import sys
import time
import traceback
from pathlib import Path

import numpy as np
import psutil
import torch

from torchfdtd import (Project, Region, Structure, Source, Monitor, FieldMonitor, Material, Boundaries, BoundaryFace,
                       AdjointOptions, DifferentiableSimulation, DifferentiablePlaneSimulation, DispersiveSimulation,
                       StreamedSimulation, StreamedAdjointOptions, PlaneReferenceCache, tensor_from_project)
from torchfdtd.reversible import ReversibleSimulation
from torchfdtd.source_adjoint import SourceWaveformSimulation

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT/'docs'/'validation'/'cases'/'ADJOINT_LEAK_SOAK.json'
RECORD = ROOT/'docs'/'validation'/'adjoint_leak_soak_3060.json'
DOCUMENT = ROOT/'docs'/'ADJOINT_LEAK_SOAK.md'
ITERATIONS, WARM_UP, EVERY = 150, 20, 10
PULSE = dict(pulse='gaussian', wavelength=1.3, pulse_cycles=2, pulse_offset=6e-15)
COUNTED = ('_System', '_DispersiveSystem', '_TensorSystem', '_Checkpoints', 'FusedYeeCUDA', 'FusedAdjointCUDA',
           'FusedDispersiveYeeCUDA', 'FusedDispersiveAdjointCUDA', 'SlabBlockOperator', 'TileWorkspace', 'StateStore',
           'CudaStepGraphs', 'PlaneReferenceCache', 'DifferentiableResult', 'DifferentiablePlaneResult')


# ----------------------------------------------------------------------------------------------- fixtures
def grid_2d(steps=60, precision='float32', monitors=None, sources=None):
    r = Region(dimension='2d', size=(4., 3., 1.), mesh=.1, pml_cells=4, steps=steps, precision=precision, backend='cpu',
               material_sampling='yee', snapshot_interval=10000)
    return Project(name='leak soak 2d', region=r,
                   sources=sources or [Source(component='Ez', center=(-1., .2, 0), **PULSE)],
                   monitors=monitors or [Monitor(component='Ez', center=(1., 0, 0)), Monitor(component='Hy', center=(.5, .3, 0))])


def grid_3d(steps=40, faces=None, pml_cells=3, materials=(), structures=(), size=(1.2, 1.2, 1.2)):
    kwargs = dict(boundaries=Boundaries(**faces)) if faces else {}
    r = Region(dimension='3d', size=size, mesh=.1, pml_cells=pml_cells, steps=steps, precision='float32', backend='cpu',
               material_sampling='yee', snapshot_interval=10000, **kwargs)
    return Project(name='leak soak 3d', region=r, materials=[Material(name='void', index=1), *materials], structures=list(structures),
                   sources=[Source(component='Ez', center=(-.2, .1, 0), **PULSE)], monitors=[Monitor(component='Ez', center=(.3, 0, 0))])


def epsilon_parameter(shape, device, dtype, value=1.8):
    return torch.nn.Parameter(torch.full(shape, value, device=device, dtype=dtype))


def clamp_epsilon(parameter, low=1.):
    with torch.no_grad():
        parameter.clamp_(min=low)


class Path_:
    """One differentiable path: build once, then iterate model -> loss -> backward -> Adam."""
    def __init__(self, name, build):
        self.name, self.build = name, build


def differentiable(kernel):
    def build(device):
        p = grid_2d()
        model = DifferentiableSimulation(p, AdjointOptions(checkpoints=3, backward_kernel=kernel))
        eps = epsilon_parameter(p.region.shape, device, torch.float32)
        return model, [eps], lambda: model(eps).signals.square().mean(), lambda: clamp_epsilon(eps)
    return build


def plane(device):
    p = grid_2d(monitors=[FieldMonitor(center=(.6, 0, 0), size=(0, 1.2, 1.), normal='x', downsample=2),
                          FieldMonitor(center=(1.1, .1, 0), size=(0, 1., 1.), normal='x', downsample=2)])
    model = DifferentiablePlaneSimulation(p, AdjointOptions(checkpoints=3))
    eps = epsilon_parameter(p.region.shape, device, torch.float32)
    frequency = torch.tensor([2.1e14, 2.6e14], device=device, dtype=torch.float32)
    def loss():
        planes = model(eps, frequency, block_size=8)
        return sum(v.fields.abs().square().sum() for v in planes.values())
    return model, [eps], loss, lambda: clamp_epsilon(eps)


def reversible(device):
    faces = {f'{a}_{s}': BoundaryFace(kind='periodic') for a in 'xyz' for s in ('min', 'max')}
    p = grid_3d(faces=faces)
    model = ReversibleSimulation(p)
    eps = torch.nn.Parameter(torch.full(p.region.shape, 1.8, device=device, dtype=torch.float32).contiguous())
    return model, [eps], lambda: model(eps).signals.square().mean(), lambda: clamp_epsilon(eps)


def dispersive(device):
    p = grid_2d()
    model = DispersiveSimulation(p, AdjointOptions(checkpoints=2))
    eps = epsilon_parameter(p.region.shape, device, torch.float32)
    strength = torch.nn.Parameter(torch.tensor([.8, .4], device=device))
    omega = torch.nn.Parameter(torch.tensor([0., 1.7], device=device))
    gamma = torch.nn.Parameter(torch.tensor([.2, .3], device=device))
    def loss():
        return model(eps, strength*1e30, omega*1e15, gamma*1e15).signals.square().mean()
    def clamp():
        clamp_epsilon(eps)
        with torch.no_grad():
            for v in (strength, omega, gamma):
                v.clamp_(min=0.)
    return model, [eps, strength, omega, gamma], loss, clamp


def tensor_project(device):
    tensor = Material(name='tensor', model='tensor', epsilon_tensor=(2.4, 2.1, 2.7, .15, 0., .1))
    p = grid_3d(materials=[tensor], structures=[Structure(name='block', center=(.1, 0, 0), size=(.4, .4, .4), material='tensor')], size=(1.6, 1.6, 1.6))
    adapter = tensor_from_project(p, device=device, checkpoints=2)
    table = torch.nn.Parameter(torch.tensor([[1., 1., 1., 0., 0., 0.], [2.4, 2.1, 2.7, .15, 0., .1]], device=device, dtype=torch.float32))
    def loss():
        return adapter(table).signals.square().mean()
    def clamp():
        with torch.no_grad():
            table[:, :3].clamp_(min=1.5)
            table[:, 3:].clamp_(min=-.1, max=.1)
            table[0] = torch.tensor([1., 1., 1., 0., 0., 0.], device=device)
    return adapter, [table], loss, clamp


def streamed(device):
    p = grid_2d()
    options = StreamedAdjointOptions(device=device, slab_width=8, temporal_depth=4, checkpoints=2, state_storage='host')
    model = StreamedSimulation(p, options)
    eps = epsilon_parameter(p.region.shape, 'cpu', torch.float32)
    return model, [eps], lambda: model(eps).signals.square().mean(), lambda: clamp_epsilon(eps)


def source_waveform(device):
    p = grid_2d(sources=[Source(component='Ez', center=(-1., .2, 0), **PULSE), Source(component='Ey', center=(-.8, -.3, 0), **PULSE)])
    model = SourceWaveformSimulation(p, AdjointOptions(checkpoints=3))
    eps = epsilon_parameter(p.region.shape, device, torch.float32)
    waves = torch.nn.Parameter(model.default_waveforms(device=device))
    return model, [eps, waves], lambda: model(eps, waves).signals.square().mean(), lambda: clamp_epsilon(eps)


PATHS = {
    'differentiable_cuda_fused': differentiable('fused'),
    'differentiable_cuda_torch': differentiable('torch'),
    'plane_cuda': plane,
    'reversible_cuda': reversible,
    'dispersive_cuda': dispersive,
    'tensor_project_cuda': tensor_project,
    'streamed_host_banks_cuda': streamed,
    'source_waveform_cuda': source_waveform,
}


# ----------------------------------------------------------------------------------------------- measures
def cache_sizes():
    from torchfdtd import cuda_kernels, injection, streamed_cost, streamed_work, cuda_bootstrap, capabilities, batch
    return dict(cuda_kernels_compile=cuda_kernels._compile.cache_info().currsize,
                injection_incident_line=injection._incident_line.cache_info().currsize,
                streamed_cost_replay_blocks=streamed_cost.replay_blocks.cache_info().currsize,
                streamed_work_replay_summary=streamed_work._replay_summary.cache_info().currsize,
                cuda_bootstrap_module=int(cuda_bootstrap._module is not None),
                capabilities_rules=len(capabilities.RULES), capabilities_lanes=len(capabilities.LANES),
                batch_worker_cancel=int(batch._WORKER_CANCEL is not None))


def snapshot(process, cuda):
    if cuda:
        torch.cuda.synchronize()
    gc.collect()
    gc.collect()
    objects = gc.get_objects()
    tensors = graphs = 0
    instances = {name: 0 for name in COUNTED}
    reference_cache_bytes = 0
    for o in objects:
        t = type(o)
        mro = t.__mro__
        if torch.Tensor in mro:
            tensors += 1
        elif t is torch.cuda.CUDAGraph:
            graphs += 1
        elif t.__name__ in instances and t.__module__.startswith('torchfdtd'):
            instances[t.__name__] += 1
            if t.__name__ == 'PlaneReferenceCache':
                reference_cache_bytes += o.tensor_bytes
    memory = process.memory_info()
    out = dict(gc_objects=len(objects), live_tensors=tensors, cuda_graphs=graphs, rss=int(memory.rss),
               private=int(getattr(memory, 'private', memory.rss)), instances=instances,
               reference_cache_bytes=reference_cache_bytes, caches=cache_sizes())
    if cuda:
        out.update(torch_allocated=int(torch.cuda.memory_allocated()), torch_reserved=int(torch.cuda.memory_reserved()))
        try:
            import cupy
            pool = cupy.get_default_memory_pool()
            out.update(cupy_pool_used=int(pool.used_bytes()), cupy_pool_total=int(pool.total_bytes()))
        except ImportError:
            pass
    del objects
    return out


def flatten(sample):
    flat = {k: v for k, v in sample.items() if not isinstance(v, dict)}
    flat.update({f'cache:{k}': v for k, v in sample['caches'].items()})
    flat.update({f'instances:{k}': v for k, v in sample['instances'].items()})
    return flat


def judge(samples, limits):
    """growth = max over the post-warm-up samples minus the warm-up sample, per flattened measure."""
    warm = next(s for s in samples if s['iteration'] == WARM_UP)
    later = [s for s in samples if s['iteration'] > WARM_UP]
    base, rest = flatten(warm), [flatten(s) for s in later]
    growth = {k: max(f[k] for f in rest)-base[k] for k in base if isinstance(base[k], (int, float))}
    last = {k: rest[-1][k]-base[k] for k in growth}
    # Reported, not judged: the change over the second half of the run (iteration 50 to the last sample),
    # which separates a one-time step after the warm-up from growth that continues per iteration.
    half = next((flatten(s) for s in later if s['iteration'] >= 50), rest[0])
    steady = {k: rest[-1][k]-half[k] for k in growth}
    rules = dict(torch_reserved=limits['torch_reserved_growth_max_bytes'], torch_allocated=limits['torch_allocated_growth_max_bytes'],
                 cupy_pool_total=limits['cupy_pool_total_growth_max_bytes'], cupy_pool_used=limits['cupy_pool_used_growth_max_bytes'],
                 rss=limits['rss_growth_max_bytes'], private=limits['private_growth_max_bytes'], gc_objects=limits['gc_objects_growth_max'],
                 live_tensors=limits['live_tensors_growth_max'], cuda_graphs=limits['cuda_graphs_growth_max'],
                 reference_cache_bytes=limits['cache_growth_max'])
    checks = {}
    for k, g in growth.items():
        limit = rules.get(k)
        if limit is None:
            limit = limits['cache_growth_max'] if k.startswith('cache:') else limits['instances_growth_max'] if k.startswith('instances:') else None
        if limit is not None:
            checks[k] = dict(growth=g, last_minus_warm=last[k], steady_state=steady[k], limit=limit, passed=bool(g <= limit))
    return dict(warm_up_iteration=WARM_UP, checks=checks, passed=bool(all(c['passed'] for c in checks.values())))


def soak(name, iterations, device):
    process = psutil.Process(os.getpid())
    cuda = device == 'cuda'
    started = time.perf_counter()
    torch.manual_seed(7)
    model, parameters, loss_fn, clamp = PATHS[name](device)
    optimizer = torch.optim.Adam(parameters, lr=1e-3)
    samples, error, first_loss, last_loss = [], None, None, None
    try:
        for i in range(1, iterations+1):
            optimizer.zero_grad(set_to_none=True)
            loss = loss_fn()
            loss.backward()
            optimizer.step()
            clamp()
            value = float(loss.detach())
            first_loss = value if first_loss is None else first_loss
            last_loss = value
            del loss
            if i % EVERY == 0:
                samples.append(dict(iteration=i, seconds=time.perf_counter()-started, **snapshot(process, cuda)))
    except Exception as exc:
        error = f'{type(exc).__name__}: {exc}'
        traceback.print_exc()
    del model, optimizer, parameters, loss_fn, clamp
    after = snapshot(process, cuda)
    return dict(path=name, device=device, iterations=iterations, sample_every=EVERY, warm_up=WARM_UP, samples=samples,
                after_release=after, error=error, first_loss=first_loss, last_loss=last_loss,
                seconds=time.perf_counter()-started)


# ----------------------------------------------------------------------------------------------- record and document
def environment():
    cuda = torch.cuda.is_available()
    def git(*args):
        try:
            return subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
        except (OSError, subprocess.CalledProcessError):
            return None
    cupy_version = None
    try:
        import cupy
        cupy_version = cupy.__version__
    except ImportError:
        pass
    return dict(python=sys.version.split()[0], numpy=np.__version__, torch=torch.__version__, cupy=cupy_version, psutil=psutil.__version__,
                cuda_runtime=torch.version.cuda, cuda_available=cuda, gpu=torch.cuda.get_device_name(0) if cuda else None,
                os=platform.platform(), machine=platform.machine(), commit=git('rev-parse', 'HEAD'),
                dirty_paths=len((git('status', '--porcelain') or '').splitlines()),
                recorded_at=datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat())


def source_hashes():
    names = ('benchmarks/adjoint_leak_soak.py', 'torchfdtd/differentiable.py', 'torchfdtd/adjoint_planes.py', 'torchfdtd/reversible.py',
             'torchfdtd/dispersive_adjoint.py', 'torchfdtd/cuda_dispersive_adjoint.py', 'torchfdtd/cuda_adjoint.py', 'torchfdtd/cuda_kernels.py',
             'torchfdtd/streamed.py', 'torchfdtd/spacetime.py', 'torchfdtd/tile_workspace.py', 'torchfdtd/source_adjoint.py',
             'torchfdtd/tensor_project.py', 'torchfdtd/anisotropy.py', 'torchfdtd/adjoint_memory.py', 'torchfdtd/reference_cache.py',
             'torchfdtd/injection.py', 'torchfdtd/streamed_cost.py', 'torchfdtd/streamed_work.py')
    return {name: hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in names}


def mib(value):
    return f'{value/2**20:+.3f} MiB' if abs(value) >= 1024 else f'{value:+d} B'


def render(record):
    limits = record['acceptance']
    env = record['environment']
    lines = ['# Adjoint leak soak', '',
             f"Record: `docs/validation/{Path(record['record_path']).name}` (case `docs/validation/cases/ADJOINT_LEAK_SOAK.json`, declared at commit "
             f"{record['case']['declared_at_commit']}). Driver `benchmarks/adjoint_leak_soak.py`. Every number below is copied from the record.", '',
             f"Environment: Python {env['python']}, torch {env['torch']} (CUDA {env['cuda_runtime']}), CuPy {env['cupy']}, psutil {env['psutil']}, GPU {env['gpu']}, "
             f"{env['os']}; run at {env['recorded_at']} on commit {env['commit']} with {env['dirty_paths']} dirty paths; wall time {record['wall_seconds']:.1f} s.", '',
             '## What is measured', '',
             f"Each path runs {record['iterations']} iterations of forward, backward and an Adam step on its trainable inputs and is sampled every "
             f"{record['sample_every']} iterations after `torch.cuda.synchronize()` and two `gc.collect()` calls. Growth is the maximum over the samples after the "
             f"{record['warm_up']}-iteration warm-up minus the warm-up value. Limits: torch reserved {limits['torch_reserved_growth_max_bytes']} B (one 20 MiB "
             f"large-pool segment), torch allocated {limits['torch_allocated_growth_max_bytes']} B, CuPy pool total {limits['cupy_pool_total_growth_max_bytes']} B, "
             f"CuPy pool used {limits['cupy_pool_used_growth_max_bytes']} B, RSS and private bytes {limits['rss_growth_max_bytes']} B, gc objects "
             f"{limits['gc_objects_growth_max']}, live tensors {limits['live_tensors_growth_max']}, CUDA graphs {limits['cuda_graphs_growth_max']}, "
             f"every cache and instance count {limits['cache_growth_max']}.", '',
             f"Summary: {record['passed_paths']} of {record['paths_run']} paths pass"+(f"; failing: {', '.join(record['failing'])}." if record['failing'] else '.'), '',
             '## Growth per path (max after warm-up minus warm-up)', '',
             '| path | s | torch allocated | torch reserved | CuPy used | CuPy total | RSS | private | gc objects | tensors | graphs | caches | instances | verdict |',
             '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |']
    for out in record['paths']:
        j = out.get('judgement') or {}
        c = j.get('checks', {})
        def g(key, fmt=mib):
            return fmt(c[key]['growth']) if key in c else 'n/a'
        caches = sum(v['growth'] for k, v in c.items() if k.startswith('cache:'))
        instances = sum(v['growth'] for k, v in c.items() if k.startswith('instances:'))
        verdict_text = 'pass' if out.get('passed') else ('ERROR' if out['error'] else 'FAIL')
        lines.append(f"| {out['path']} | {out['seconds']:.1f} | {g('torch_allocated')} | {g('torch_reserved')} | {g('cupy_pool_used')} | {g('cupy_pool_total')} | "
                     f"{g('rss')} | {g('private')} | {g('gc_objects', str)} | {g('live_tensors', str)} | {g('cuda_graphs', str)} | {caches:+d} | {instances:+d} | {verdict_text} |")
    lines += ['', '## Second half of the run (iteration 50 to 150, reported, not judged)', '',
              'Change of each host measure between the sample at iteration 50 and the last sample. A one-time step that lands after the '
              'warm-up fails the judged growth above but shows zero here; a leak that continues per iteration shows here as well.', '',
              '| path | torch allocated | torch reserved | RSS | private | gc objects | tensors |',
              '| --- | ---: | ---: | ---: | ---: | ---: | ---: |']
    for out in record['paths']:
        c = (out.get('judgement') or {}).get('checks', {})
        def st(key, fmt=mib):
            return fmt(c[key]['steady_state']) if key in c and 'steady_state' in c[key] else 'n/a'
        lines.append(f"| {out['path']} | {st('torch_allocated')} | {st('torch_reserved')} | {st('rss')} | {st('private')} | {st('gc_objects', str)} | {st('live_tensors', str)} |")
    lines += ['', '## Warm-up absolute values', '',
              '| path | torch allocated | torch reserved | CuPy total | RSS | gc objects | live tensors | _System | _Checkpoints | FusedYeeCUDA | FusedAdjointCUDA | SlabBlockOperator |',
              '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |']
    for out in record['paths']:
        warm = next((s for s in out['samples'] if s['iteration'] == record['warm_up']), None)
        if warm is None:
            continue
        i = warm['instances']
        lines.append(f"| {out['path']} | {warm.get('torch_allocated', 0)/2**20:.2f} MiB | {warm.get('torch_reserved', 0)/2**20:.2f} MiB | {warm.get('cupy_pool_total', 0)/2**20:.2f} MiB | "
                     f"{warm['rss']/2**20:.1f} MiB | {warm['gc_objects']} | {warm['live_tensors']} | {i['_System']+i['_DispersiveSystem']+i['_TensorSystem']} | {i['_Checkpoints']} | "
                     f"{i['FusedYeeCUDA']} | {i['FusedAdjointCUDA']} | {i['SlabBlockOperator']} |")
    lines += ['', '## Failing measures', '']
    failing = [(out['path'], k, v) for out in record['paths'] for k, v in (out.get('judgement') or {}).get('checks', {}).items() if not v['passed']]
    if not failing and not any(out['error'] for out in record['paths']):
        lines.append('None.')
    for path, key, v in failing:
        lines.append(f"- `{path}` {key}: growth {v['growth']} (last minus warm-up {v['last_minus_warm']}), limit {v['limit']}.")
    for out in record['paths']:
        if out['error']:
            lines.append(f"- `{out['path']}`: {out['error']}")
    lines += ['', '## Module-level state of the package', '']
    for item in record['module_state']:
        lines.append(f'- {item}')
    lines += ['', '## Findings', '']
    for finding in record['findings']:
        lines.append(f'- {finding}')
    if not record['findings']:
        lines.append('None.')
    return '\n'.join(lines)+'\n'


MODULE_STATE = [
    '`torchfdtd/cuda_kernels.py` `_compile`: `functools.lru_cache(maxsize=64)` keyed on (kernel source text, device index, capability, kernel name); '
    'holds compiled CuPy modules, never tensors; bounded at 64 entries.',
    '`torchfdtd/injection.py` `_incident_line`: `lru_cache(maxsize=8)` keyed on (drive bytes, courant, index, layers); host float64 arrays of one-way tables; bounded at 8.',
    '`torchfdtd/streamed_cost.py` `replay_blocks`: `lru_cache(maxsize=1024)` keyed on two integers, integer values; bounded.',
    '`torchfdtd/streamed_work.py` `_replay_summary`: `lru_cache(maxsize=4096)` keyed on two integers, small tuples; bounded.',
    '`torchfdtd/cuda_bootstrap.py` `_module`, `_failure` (with `global`): one compiled helper module or one failure record for the process; bounded at one.',
    '`torchfdtd/batch.py` `_WORKER_CANCEL` (with `global`): one worker-side cancel event; bounded at one.',
    '`torchfdtd/capabilities.py` `RULES`, `LANES`: module lists filled once at import by `rule()`/`lane()` calls in the module body; fixed size after import.',
    '`torchfdtd/reference_cache.py` `PlaneReferenceCache`: instance-owned `OrderedDict` with a byte budget and LRU eviction, CPU copies only; no module-level instance exists, so nothing is retained unless the caller keeps the cache.',
    '`torchfdtd/solver.py` `ENGINE_LOCK`, `torchfdtd/fsp.py` `BRIDGE_LOCK`, `torchfdtd/cuda_bootstrap.py` `_lock`: locks, no payload.',
    '`torchfdtd/spacetime.py`: no module-level container; observer maps live on each `SlabBlockOperator`/`_System` instance and die with it.',
    '`torchfdtd/server.py` `jobs` dict: per-application job registry created in `create_app`; entries are Result records the workbench serves and are the intended lifetime of a job, bounded by the single-worker pool and explicit cancellation/deletion, not by iteration count.',
    '`torchfdtd/tile_workspace.py` `TileWorkspace`: per-operator `buffers`, `pinned` and `host_staging` dicts keyed by a fixed set of slot names (replaced in place when a larger slot is needed), a `bindings` OrderedDict evicted above `cache_entries=32`, and an `events` list cleared by `drain()`; all bounded per operator and freed with it.',
    'No `weakref`-less module-level registry of solver objects exists in this tree. The per-process live-reservation registry of branch g5-memory (commit 649ad79, not merged at 6eb7996) is absent here and must be added to the sampled measures when it lands; `FusedYeeCUDA` holds its grid through `weakref.ref`.',
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', default=str(RECORD))
    parser.add_argument('--paths', nargs='*')
    parser.add_argument('--iterations', type=int, default=ITERATIONS)
    parser.add_argument('--device', default='cuda')
    parser.add_argument('--render', action='store_true')
    parser.add_argument('--merge', action='store_true', help='replace the selected paths inside the existing record')
    parser.add_argument('--rejudge', action='store_true', help='recompute every verdict of the existing record from its samples and rerender')
    parser.add_argument('--note', action='append', default=[], help='append a finding to the existing record (the text must quote numbers of the record) and rerender')
    args = parser.parse_args()
    if args.render:
        record = json.loads(Path(args.output).read_text(encoding='utf-8'))
        DOCUMENT.write_text(render(record), encoding='utf-8', newline='\n')
        print(DOCUMENT)
        return
    case = json.loads(CASE.read_text(encoding='utf-8'))
    limits = case['acceptance']
    if args.rejudge or args.note:
        record = json.loads(Path(args.output).read_text(encoding='utf-8'))
        if args.rejudge:
            for out in record['paths']:
                out['judgement'] = judge(out['samples'], limits)
                out['passed'] = bool(out['judgement']['passed'] and out['error'] is None)
            record['failing'] = [o['path'] for o in record['paths'] if not o['passed']]
            record.update(passed_paths=sum(o['passed'] for o in record['paths']), acceptance=limits, module_state=MODULE_STATE)
        record['findings'] = record.get('findings', [])+list(args.note)
        Path(args.output).write_text(json.dumps(record, indent=2)+'\n', encoding='utf-8', newline='\n')
        DOCUMENT.write_text(render(record), encoding='utf-8', newline='\n')
        print(json.dumps(dict(rejudged=args.rejudge, notes=len(args.note), failing=record['failing'])))
        return
    if args.device == 'cuda':
        if not torch.cuda.is_available():
            raise SystemExit('CUDA is unavailable')
        free, _ = torch.cuda.mem_get_info()
        if free < 2*1024**3:
            raise SystemExit(f'only {free/2**30:.2f} GiB of device memory is free; the soak needs 2 GiB of headroom on the shared GPU')
    torch.set_num_threads(2)
    names = args.paths or list(PATHS)
    unknown = set(names)-set(PATHS)
    if unknown:
        raise SystemExit(f'unknown paths: {sorted(unknown)}')
    started = time.perf_counter()
    outputs = []
    for name in names:
        out = soak(name, args.iterations, args.device)
        if out['samples'] and any(s['iteration'] > WARM_UP for s in out['samples']) and any(s['iteration'] == WARM_UP for s in out['samples']):
            out['judgement'] = judge(out['samples'], limits)
            out['passed'] = bool(out['judgement']['passed'] and out['error'] is None)
        else:
            out['judgement'] = None
            out['passed'] = False
        c = (out['judgement'] or {}).get('checks', {})
        print(json.dumps(dict(path=name, passed=out['passed'], error=out['error'], seconds=round(out['seconds'], 1),
                              growth={k: v['growth'] for k, v in c.items() if not v['passed'] or k in ('torch_reserved', 'rss', 'gc_objects', 'live_tensors')})), flush=True)
        outputs.append(out)
        if args.device == 'cuda':
            torch.cuda.empty_cache()
    previous = json.loads(Path(args.output).read_text(encoding='utf-8')) if args.merge and Path(args.output).is_file() else None
    if previous is not None:
        done = {o['path']: o for o in outputs}
        outputs = [done.pop(o['path'], o) for o in previous['paths']]+list(done.values())
    failing = [o['path'] for o in outputs if not o['passed']]
    record = dict(schema='torchfdtd.adjoint_leak_soak.v1', case=dict(path='docs/validation/cases/ADJOINT_LEAK_SOAK.json', declared_at_commit=case['declared_at_commit']),
                  record_path=str(Path(args.output)).replace('\\', '/'), acceptance=limits, iterations=args.iterations, warm_up=WARM_UP, sample_every=EVERY,
                  environment=environment(), source_sha256=source_hashes(), paths_run=len(outputs), passed_paths=sum(o['passed'] for o in outputs),
                  failing=failing, findings=[], module_state=MODULE_STATE, paths=outputs,
                  wall_seconds=time.perf_counter()-started+(previous['wall_seconds'] if previous is not None else 0.))
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(record, indent=2)+'\n', encoding='utf-8', newline='\n')
    temporary.replace(path)
    DOCUMENT.write_text(render(record), encoding='utf-8', newline='\n')
    print(json.dumps(dict(paths=len(outputs), failing=failing, wall_seconds=record['wall_seconds'])), flush=True)


if __name__ == '__main__':
    main()
