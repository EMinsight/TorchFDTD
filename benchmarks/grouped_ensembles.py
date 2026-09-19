"""Mixed-workload CUDA throughput with unchanged meshes and output gates."""
import argparse
import gc
import hashlib
import importlib.metadata
import inspect
import json
from pathlib import Path
import platform
import statistics
import time

import fdtd
import numpy as np
import torch

from photonweave import BatchCase, Simulation, plan_grouped_batch, run_grouped_batch
from photonweave.solver import hardware
from .ensemble_comparison import digest
from .open_source import upstream_run
from .spectral_ensemble import projects_for, error


WORKLOADS = {
    'mixed-mesh-32-48': [(32, 800), (48, 800)],
    'mixed-mesh-32-64': [(32, 800), (64, 800)],
    'mixed-duration-32': [(32, 400), (32, 800)],
    'mixed-duration-64': [(64, 400), (64, 800)],
}


def make_cases(name):
    cases = []
    # Deliberately interleave unlike grids/times so consecutive chunking fails.
    for variant in range(2):
        for kind in ('vacuum', 'sphere', 'slab', 'waveguide'):
            for n, steps in WORKLOADS[name]:
                p = projects_for(kind, n, steps, 2)[variant]
                p.name = f'{kind}-{n}-{steps}-{variant}'
                p.region.cuda_monitor_kernel = 'fused'
                cases.append(BatchCase(p.name, p))
    return cases


def outputs(r):
    return [r.electric, r.magnetic, r.signals, *[m['fields'] for m in r.frequency_fields]]


def complete_outputs(r):
    return [*outputs(r), r.times, r.epsilon, r.frames, r.frame_steps,
            *[m['flux'] for m in r.frequency_fields]]


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--workloads', nargs='+', choices=WORKLOADS, default=list(WORKLOADS))
    ap.add_argument('--cohort', type=int, default=4)
    ap.add_argument('--repeats', type=int, default=3)
    ap.add_argument('--output', default='results/open-source/grouped-ensembles.json')
    args = ap.parse_args()
    if args.repeats < 1: ap.error('--repeats must be positive')
    path = Path(args.output)
    if path.exists(): raise FileExistsError('Preserve prior measurements. Choose a new output path.')
    modes = ['flaport_graph_1', 'flaport_graph_8', 'native_sequential', 'native_grouped']
    sources = ['photonweave/grouped_batch.py', 'photonweave/tensor_batch.py', 'photonweave/solver.py',
        'photonweave/models.py', 'photonweave/geometry.py', 'photonweave/cuda_kernels.py',
        'photonweave/cuda_batch.py', 'photonweave/cuda_graph.py', 'photonweave/cuda_monitors.py',
        'photonweave/field_monitors.py', 'photonweave/boundaries.py', 'benchmarks/grouped_ensembles.py',
        'benchmarks/open_source.py', 'benchmarks/spectral_ensemble.py', 'benchmarks/ensemble_comparison.py']
    record = dict(hardware=hardware(), platform=platform.platform(), configuration=vars(args),
        packages={k: importlib.metadata.version(k) for k in ('photonweave', 'fdtd', 'torch', 'numpy', 'cupy-cuda12x')},
        source_sha256={p: hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in sources},
        upstream_sha256={k: hashlib.sha256(Path(inspect.getfile(v)).read_bytes()).hexdigest()
                         for k, v in [('grid', fdtd.Grid), ('boundary', fdtd.PML)]},
        method='Sixteen interleaved independent cases, four geometry families, two mesh or duration conditions. '
        'Full wall includes grouping, preparation, graph capture, stepping and output transfer. All native final '
        'fields, point traces, snapshots and three six-component nine-frequency DFT planes are retained. '
        'External flaport 0.2.2 uses unmodified E/H updates and the same fused DFT adapter with 1/8-step graphs. '
        'No padding or discretization changes between modes. One warmup per mode, three measured repetitions '
        'in alternating order by default. Cold interpreter/context/compiler, validation and disk I/O excluded. '
        'Torch memory excludes external graph, context and driver allocations. Native graph width 1.',
        gates=dict(native_complete_outputs='bitwise', external_trace_relative_l2=.01,
                   external_complex_dft_relative_l2=.01), cases=[])
    for name in args.workloads:
        cases = make_cases(name)
        refs = [Simulation(c.project).run() for c in cases]
        native_hashes = [digest(complete_outputs(r)) for r in refs]
        references = [outputs(r) for r in refs]
        row = dict(name=name, count=len(cases), projects=[c.project.model_dump() for c in cases],
                   plan=plan_grouped_batch(cases, cohort_size=args.cohort),
                   runs={m: [] for m in modes}, checks=[])
        del refs
        for repeat in range(-1, args.repeats):
            for mode in modes if repeat % 2 == 0 else modes[::-1]:
                gc.collect()
                torch.cuda.empty_cache()
                torch.cuda.reset_peak_memory_stats()
                torch.cuda.synchronize()
                tick = time.perf_counter()
                if mode.startswith('flaport'):
                    results = [upstream_run(c.project, with_planes=True, plane_kernel='fused',
                                           cuda_graph_steps=int(mode[-1])) for c in cases]
                    actual = [r[1] for r in results]
                    loop = sum(r[0]['loop_seconds'] for r in results)
                    setup = sum(r[0]['setup_seconds'] for r in results)
                    planning = 0.
                elif mode == 'native_sequential':
                    results = [Simulation(c.project).run() for c in cases]
                    actual = [outputs(r) for r in results]
                    loop = sum(r.summary['seconds'] for r in results)
                    setup = sum(r.summary['setup_seconds'] for r in results)
                    planning = 0.
                else:
                    batch = run_grouped_batch(cases, cohort_size=args.cohort)
                    batch.raise_for_errors()
                    assert [i.id for i in batch.items] == [c.id for c in cases]
                    results = [i.load() for i in batch.items]
                    actual = [outputs(r) for r in results]
                    loop, setup, planning = (batch.plan[k] for k in
                                             ('loop_seconds', 'setup_seconds', 'planning_seconds'))
                torch.cuda.synchronize()
                wall = time.perf_counter() - tick
                sample = dict(wall_seconds=wall, loop_seconds=loop, setup_seconds=setup,
                              planning_seconds=planning, cases_per_second=len(cases)/wall,
                              peak_allocated_bytes=torch.cuda.max_memory_allocated())
                if mode.startswith('flaport'):
                    errors = [[error(a, b) for a, b in zip(got, ref)] for got, ref in zip(actual, references)]
                    check = dict(accuracy_pass=all(e[2]['relative_l2'] < .01 and
                        all(x['relative_l2'] < .01 for x in e[3:]) for e in errors), errors=errors)
                else:
                    hashes = [digest(complete_outputs(r)) for r in results]
                    check = dict(accuracy_pass=hashes == native_hashes, complete_output_sha256=hashes)
                if repeat >= 0:
                    row['runs'][mode].append(sample)
                    row['checks'].append(dict(repeat=repeat, mode=mode, **check))
                print(json.dumps(dict(name=name, repeat=repeat, mode=mode, **sample,
                                      accuracy_pass=check['accuracy_pass'])), flush=True)
                if not check['accuracy_pass']: raise RuntimeError('Accuracy gate failed.')
                del results, actual
                if mode == 'native_grouped': del batch
        row['medians'] = {m: {k: statistics.median(v[k] for v in rows) for k in rows[0]}
                          for m, rows in row['runs'].items()}
        row['accuracy_pass'] = all(c['accuracy_pass'] for c in row['checks'])
        record['cases'].append(row)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(record, indent=2, allow_nan=False)+'\n', encoding='utf8')


if __name__ == '__main__': main()
