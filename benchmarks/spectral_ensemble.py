"""Fixed-work spectral ensembles with complete output and accuracy checks.

The external solver uses unmodified flaport E/H updates and explicitly added
common Torch or fused plane-DFT observation adapters. All native modes keep the
same fused Yee updates. Only monitor implementation and cohort size change.
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

from torchfdtd import FieldMonitor, SpectrumSettings, Simulation, run_tensor_batch
from torchfdtd.solver import hardware
from .ensemble_comparison import ensemble, digest
from .open_source import upstream_run


def projects_for(kind, n, steps, count):
    projects = ensemble(kind, n, steps, count)
    for p in projects:
        for axis, location in (('x', -.6), ('x', 1.2), ('z', .75)):
            index = 'xyz'.index(axis)
            center = [0., 0., 0.];center[index] = location
            size = [2.4, 2.4, 2.4];size[index] = 0
            p.monitors.append(FieldMonitor(normal=axis, center=tuple(center), size=tuple(size),
                spectrum=SpectrumSettings(sampling='frequency', frequency_points=9, apodization='none')))
    return projects


def arrays(result):
    return [result.electric, result.magnetic, result.signals,
            *[m['fields'] for m in result.frequency_fields]]


def error(a, b):
    # Preserve complex quadratures. Casting to float silently loses phase.
    a, b = np.asarray(a, dtype=np.complex128), np.asarray(b, dtype=np.complex128)
    scale = float(np.linalg.norm(b))
    return dict(relative_l2=float(np.linalg.norm(a-b)/max(scale, 1e-300)),
                max_absolute=float(np.max(abs(a-b))), reference_l2=scale,
                reference_peak=float(np.max(abs(b))))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sizes', type=int, nargs='+', default=[32, 64])
    parser.add_argument('--cases', nargs='+', default=['vacuum', 'sphere', 'slab', 'waveguide'])
    parser.add_argument('--steps', type=int, default=800)
    parser.add_argument('--count', type=int, default=8)
    parser.add_argument('--cohort', type=int, default=4)
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--modes', nargs='+', default=['flaport_graph', 'flaport_fused_dft', 'native_sequential',
                        'native_batch', 'fused_sequential', 'fused_batch'])
    parser.add_argument('--output', default='results/open-source/spectral-ensembles.json')
    args = parser.parse_args()
    gates = dict(native_complex_dft_relative_l2=3e-6, upstream_complex_dft_relative_l2=.01,
                 upstream_point_trace_relative_l2=.01, native_fields_and_trace='bitwise')
    record = dict(hardware=hardware(), platform=platform.platform(),
        packages={k:importlib.metadata.version(k) for k in ('torchfdtd','fdtd','torch','numpy','cupy-cuda12x')},
        source_sha256={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in map(Path,
            ('torchfdtd/cuda_monitors.py','torchfdtd/field_monitors.py','torchfdtd/tensor_batch.py',
             'benchmarks/spectral_ensemble.py','benchmarks/open_source.py'))},
        method='800 steps by default, float32, three 6-component frequency planes with 9 frequencies, no downsampling, point trace and final E/H. Full setup, graph preparation, loop and output transfers. One warmup and alternating run order, no disk output, cold context/compilation excluded. Upstream is flaport 0.2.2 with CUDA Graph and either common Torch or identical fused DFT adapter, not an upstream DFT capability claim. Native reference retains fused Yee updates and Torch plane DFT. Cohort size is explicit, never tuned on these timing samples.',
        gates=gates, cases=[])
    for n in args.sizes:
        for kind in args.cases:
            projects = projects_for(kind, n, args.steps, args.count)
            refs = [arrays(Simulation(p).run()) for p in projects]
            hashes = [digest(a[:3]) for a in refs]
            fused_refs = None
            case = dict(name=kind,shape=list(projects[0].region.shape),count=args.count,cohort=args.cohort,
                        projects=[p.model_dump() for p in projects],runs={m:[] for m in args.modes},checks=[])
            for repeat in range(-1, args.repeats):
                for mode in (args.modes if repeat%2==0 else args.modes[::-1]):
                    for p in projects:
                        p.region.cuda_monitor_kernel='fused' if mode.startswith('fused') else 'torch'
                    gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats();torch.cuda.synchronize()
                    start = time.perf_counter()
                    if mode.startswith('flaport'):
                        results = [upstream_run(p, with_planes=True,
                            plane_kernel='fused' if mode=='flaport_fused_dft' else 'torch') for p in projects]
                        actual = [r[1] for r in results]
                        loop = sum(r[0]['loop_seconds'] for r in results)
                    elif mode.endswith('sequential'):
                        results = [Simulation(p).run() for p in projects]
                        actual = [arrays(r) for r in results]
                        loop = sum(r.summary['seconds'] for r in results)
                    else:
                        results = run_tensor_batch(projects, cohort_size=args.cohort)
                        results.raise_for_errors()
                        actual = [arrays(item.load()) for item in results.items]
                        loop = results.plan['loop_seconds']
                    torch.cuda.synchronize()
                    wall = time.perf_counter()-start
                    row = dict(wall_seconds=wall,loop_seconds=loop,cases_per_second=args.count/wall,
                               peak_allocated_bytes=torch.cuda.max_memory_allocated())
                    errors = [[error(a,b) for a,b in zip(got,ref)] for got,ref in zip(actual,refs)]
                    check = dict(repeat=repeat,mode=mode,errors=errors)
                    if mode.startswith('flaport'):
                        check['accuracy_pass'] = all(e[2]['relative_l2']<.01 and
                            all(v['relative_l2']<.01 for v in e[3:]) for e in errors)
                    else:
                        check['native_fields_trace_bitwise'] = [digest(a[:3]) for a in actual] == hashes
                        check['accuracy_pass'] = check['native_fields_trace_bitwise'] and all(
                            v['relative_l2']<3e-6 for e in errors for v in e[3:])
                        if mode.startswith('fused'):
                            spectral_hashes=[digest(a[3:]) for a in actual]
                            if fused_refs is None:fused_refs=spectral_hashes
                            check['fused_spectra_bitwise_across_modes'] = spectral_hashes == fused_refs
                            check['accuracy_pass'] &= check['fused_spectra_bitwise_across_modes']
                    if repeat>=0:
                        case['runs'][mode].append(row);case['checks'].append(check)
                    print(json.dumps(dict(name=kind,n=n,repeat=repeat,mode=mode,
                                          accuracy_pass=check['accuracy_pass'],**row)),flush=True)
                    del results, actual
            case['medians']={m:{k:statistics.median(r[k] for r in rows) for k in
                ('wall_seconds','loop_seconds','cases_per_second','peak_allocated_bytes')}
                for m,rows in case['runs'].items()}
            case['accuracy_pass']=all(c['accuracy_pass'] for c in case['checks'])
            record['cases'].append(case)
            target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    if not all(c['accuracy_pass'] for c in record['cases']):
        raise SystemExit('Accuracy gate failed. Results retained, no qualified speedup claim.')


if __name__ == '__main__':
    main()
