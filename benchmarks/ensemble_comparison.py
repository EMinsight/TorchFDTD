"""Full-result ensemble throughput with accuracy gates and held-out tuning runs.

Uses independently authored scenes, never commercial solver inputs or outputs.
An upstream adapter runs unmodified flaport updates through a CUDA graph.
"""
from __future__ import annotations

import argparse
import gc
import hashlib
import importlib.metadata
import json
from pathlib import Path
import platform
import statistics
import time

import numpy as np
import torch

from photonweave import Simulation, run_tensor_batch
from photonweave.solver import hardware
from .open_source import scene, upstream_run, relative


def ensemble(kind, n, steps, count):
    projects = []
    for i in range(count):
        p = scene(kind, n, steps)
        if kind == 'sphere':
            p.structures[0].radius = .35 + .02*i
        elif kind == 'slab':
            p.structures[0].size = (.2 + .02*i, 4.8, 4.8)
        elif kind == 'waveguide':
            p.structures[0].size = (4.8, .4 + .025*i, .4)
        else:
            p.sources[0].amplitude = .5 + .05*i
        projects.append(p)
    return projects


def objective(result):
    return float(np.max(abs(result.signals)))


def digest(arrays):
    h = hashlib.sha256()
    for a in arrays:
        h.update(str((a.shape, a.dtype.str)).encode())
        h.update(np.ascontiguousarray(a).tobytes())
    return h.hexdigest()


def native_arrays(result):
    return [result.electric, result.magnetic, result.signals]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sizes', type=int, nargs='+', default=[32, 64])
    parser.add_argument('--cases', nargs='+', default=['vacuum', 'sphere', 'slab', 'waveguide'])
    parser.add_argument('--steps', type=int, default=800)
    parser.add_argument('--count', type=int, default=16)
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--modes', nargs='+', default=['sequential', 'flaport_graph', 'cohort_4', 'cohort_16', 'tuned'])
    parser.add_argument('--output', default='results/open-source/ensembles.json')
    args = parser.parse_args()
    record = dict(hardware=hardware(), platform=platform.platform(),
        packages={k: importlib.metadata.version(k) for k in ('photonweave', 'fdtd', 'numpy', 'torch', 'cupy-cuda12x')},
        source_sha256={str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in
            (Path('photonweave/tensor_batch.py'), Path(__file__).relative_to(Path.cwd()), Path('benchmarks/open_source.py'))},
        method='Full setup, graph preparation, stepping, full E/H/trace transfer and trace-peak objective. One warmup per mode and alternating measured order. Cold interpreter/CUDA/compiler and disk output excluded. Tuning cost recorded separately, followed by independent timed runs. Same fixed-step projects in every mode. Native E/H/trace bitwise gate, upstream trace relative L2 < 1%. Full upstream field differences retained without an equivalence claim.',
        cases=[])
    for n in args.sizes:
        for kind in args.cases:
            projects = ensemble(kind, n, args.steps, args.count)
            references = [native_arrays(Simulation(p).run()) for p in projects]
            reference_hashes = [digest(a) for a in references]
            case = dict(name=kind, shape=list(projects[0].region.shape), count=args.count,
                projects=[p.model_dump() for p in projects], runs={m: [] for m in args.modes}, checks=[])
            selected = None
            if 'tuned' in args.modes:
                from photonweave import tune_tensor_batch
                tuning = tune_tensor_batch(projects, candidates=(1, 2, 4, 8, 16), repeats=args.repeats)
                case['tuning'] = tuning.as_dict()
                selected = tuning.cohort_size
            for repeat in range(-1, args.repeats):
                for mode in (args.modes if repeat % 2 == 0 else list(reversed(args.modes))):
                    gc.collect()
                    torch.cuda.empty_cache()
                    torch.cuda.reset_peak_memory_stats()
                    torch.cuda.synchronize()
                    tick = time.perf_counter()
                    if mode == 'sequential':
                        results = [Simulation(p).run() for p in projects]
                        metrics = [objective(r) for r in results]
                        arrays = [native_arrays(r) for r in results]
                        loop = sum(r.summary['seconds'] for r in results)
                    elif mode == 'flaport_graph':
                        results = [upstream_run(p) for p in projects]
                        arrays = [r[1] for r in results]
                        metrics = [float(np.max(abs(a[2]))) for a in arrays]
                        loop = sum(r[0]['loop_seconds'] for r in results)
                    else:
                        size = selected if mode == 'tuned' else int(mode.removeprefix('cohort_'))
                        results = run_tensor_batch(projects, cohort_size=size, objective=objective)
                        results.raise_for_errors()
                        arrays = [native_arrays(item.load()) for item in results.items]
                        metrics = [item.metrics['objective'] for item in results.items]
                        loop = results.plan['loop_seconds']
                    torch.cuda.synchronize()
                    wall = time.perf_counter() - tick
                    row = dict(wall_seconds=wall, loop_seconds=loop, cases_per_second=args.count/wall,
                        peak_allocated_bytes=torch.cuda.max_memory_allocated(), objectives=metrics)
                    if mode == 'flaport_graph':
                        errors = [dict(relative_l2=dict(zip(('E', 'H', 'trace'), [relative(a, b) for a, b in zip(ref, got)])),
                            max_absolute=dict(zip(('E', 'H', 'trace'), [float(np.max(abs(a-b))) for a, b in zip(ref, got)])),
                            reference_peak=dict(zip(('E', 'H', 'trace'), [float(np.max(abs(a))) for a in got])))
                            for ref, got in zip(references, arrays)]
                        assert all(e['relative_l2']['trace'] < .01 for e in errors), errors
                        check = dict(mode=mode, upstream_errors=errors, trace_accuracy_pass=True)
                    else:
                        hashes = [digest(a) for a in arrays]
                        assert hashes == reference_hashes, 'Native cohort changed E/H/traces.'
                        check = dict(mode=mode, native_bitwise_identical=True, output_sha256=hashes)
                    if repeat >= 0:
                        case['runs'][mode].append(row)
                        case['checks'].append(dict(repeat=repeat, **check))
                    print(json.dumps(dict(name=kind, n=n, repeat=repeat, mode=mode,
                        wall_seconds=wall, cases_per_second=args.count/wall)), flush=True)
                    del results, arrays
            case['medians'] = {m: {k: statistics.median(r[k] for r in rows) for k in
                ('wall_seconds', 'loop_seconds', 'cases_per_second', 'peak_allocated_bytes')}
                for m, rows in case['runs'].items()}
            record['cases'].append(case)
            target = Path(args.output)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(json.dumps(record, indent=2, allow_nan=False)+'\n', encoding='utf-8')


if __name__ == '__main__':
    main()
