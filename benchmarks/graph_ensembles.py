"""Full-wall graph-unrolling ablation with the same option on both solvers."""
from __future__ import annotations

import argparse
import gc
from functools import partial
import hashlib
import importlib.metadata
import inspect
import json
from pathlib import Path
import platform
import statistics
import time
from unittest.mock import patch

import fdtd
import torch

from photonweave import Simulation, run_tensor_batch
from photonweave.solver import hardware
from photonweave.tuning import _result_digest
from photonweave.cuda_monitors import FusedFrequencyPlanes
from benchmarks.open_source import upstream_run
from benchmarks.spectral_ensemble import projects_for, arrays, digest, error


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sizes',nargs='+',type=int,default=[32,64])
    parser.add_argument('--cases',nargs='+',default=['vacuum','sphere','slab','waveguide'])
    parser.add_argument('--steps',type=int,default=800)
    parser.add_argument('--count',type=int,default=8)
    parser.add_argument('--cohort',type=int,default=4)
    parser.add_argument('--graph-steps',type=int,default=8)
    parser.add_argument('--repeats',type=int,default=3)
    parser.add_argument('--output',default='results/open-source/graph-ensembles.json')
    args=parser.parse_args()
    target=Path(args.output)
    if target.exists():raise FileExistsError('Preserve measurements. Choose a new output path.')
    if args.graph_steps<=1 or args.repeats<1:raise ValueError('Use graph steps > 1 and repeats >= 1.')
    modes={f'{engine}_{width}':(engine,width) for engine in ('flaport','sequential','batch')
           for width in (1,args.graph_steps)}
    modes['batch_torch_phase']=('batch_torch_phase',1)
    paths=['photonweave/cuda_graph.py','photonweave/solver.py','photonweave/tensor_batch.py',
           'photonweave/cuda_kernels.py','photonweave/cuda_batch.py','photonweave/cuda_monitors.py',
           'photonweave/field_monitors.py','benchmarks/graph_ensembles.py',
           'benchmarks/open_source.py','benchmarks/spectral_ensemble.py']
    record=dict(hardware=hardware(),platform=platform.platform(),
        packages={k:importlib.metadata.version(k) for k in ('photonweave','fdtd','torch','numpy','cupy-cuda12x')},
        source_sha256={p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in paths},
        upstream_sha256={k:hashlib.sha256(Path(inspect.getfile(v)).read_bytes()).hexdigest()
                         for k,v in [('grid',fdtd.Grid),('boundary',fdtd.PML)]},
        configuration=vars(args),
        method='Full solve includes setup, both graph captures, loop, snapshots (native), all final E/H and complex DFT transfers. '
               'All engines use the same fused DFT adapter, frequency tables and original time-step sampling. '
               'One warmup, alternating measured order, fixed cohort and graph sizes. '
               'Cold interpreter/context/compilation and disk writes excluded. '
               'External ensemble remains sequential and uses unmodified upstream E/H updates. '
               'Unrolling changes graph launch frequency only, never time step, precision or monitor resolution. '
               'batch_torch_phase retains the earlier Torch phase expression with the same fused sampling/DFT '
               'through a scoped constructor override for ablation. No production solver operations are skipped.',
        gates=dict(native_complete_output='bitwise against single native step graph',
                   upstream_unroll='bitwise against single upstream step graph',
                   previous_phase_complex_dft_relative_l2=3e-6,
                   upstream_trace_and_complex_dft_relative_l2=.01),cases=[])
    for n in args.sizes:
        for kind in args.cases:
            projects=projects_for(kind,n,args.steps,args.count)
            for p in projects:p.region.cuda_monitor_kernel='fused'
            reference=[Simulation(p).run() for p in projects]
            native_arrays=[arrays(r) for r in reference]
            native_hashes=[_result_digest(r) for r in reference]
            del reference
            upstream=[upstream_run(p,with_planes=True,plane_kernel='fused')[1] for p in projects]
            upstream_hashes=[digest(a) for a in upstream]
            del upstream
            case=dict(name=kind,shape=list(projects[0].region.shape),count=args.count,cohort=args.cohort,
                projects=[p.model_dump() for p in projects],runs={m:[] for m in modes},checks=[])
            for repeat in range(-1,args.repeats):
                for name in (list(modes) if repeat%2==0 else list(modes)[::-1]):
                    engine,width=modes[name]
                    gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats();torch.cuda.synchronize()
                    tick=time.perf_counter()
                    if engine=='flaport':
                        results=[upstream_run(p,with_planes=True,plane_kernel='fused',cuda_graph_steps=width) for p in projects]
                        actual=[r[1] for r in results]
                        loop=sum(r[0]['loop_seconds'] for r in results)
                        setup=sum(r[0]['setup_seconds'] for r in results)
                    elif engine=='sequential':
                        results=[Simulation(p).run(cuda_graph_steps=width) for p in projects]
                        loop=sum(r.summary['seconds'] for r in results)
                        setup=sum(r.summary['setup_seconds'] for r in results)
                    elif engine=='batch_torch_phase':
                        with patch('photonweave.cuda_monitors.FusedFrequencyPlanes',
                                   partial(FusedFrequencyPlanes,phase_kernel='torch')):
                            report=run_tensor_batch(projects,cohort_size=args.cohort)
                        report.raise_for_errors();results=[item.load() for item in report.items]
                        loop=report.plan['loop_seconds'];setup=report.plan['setup_seconds']
                    else:
                        report=run_tensor_batch(projects,cohort_size=args.cohort,cuda_graph_steps=width)
                        report.raise_for_errors();results=[item.load() for item in report.items]
                        loop=report.plan['loop_seconds'];setup=report.plan['setup_seconds']
                    torch.cuda.synchronize()
                    wall=time.perf_counter()-tick
                    sample=dict(wall_seconds=wall,loop_seconds=loop,setup_seconds=setup,
                        cases_per_second=args.count/wall,peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                        peak_reserved_bytes=torch.cuda.max_memory_reserved())
                    if engine=='flaport':
                        errors=[[error(a,b) for a,b in zip(got,ref)] for got,ref in zip(actual,native_arrays)]
                        check=dict(repeat=repeat,mode=name,errors=errors,
                                   unrolling_bitwise=[digest(a) for a in actual]==upstream_hashes)
                        check['accuracy_pass']=check['unrolling_bitwise'] and all(
                            e[2]['relative_l2']<.01 and all(v['relative_l2']<.01 for v in e[3:]) for e in errors)
                    elif engine=='batch_torch_phase':
                        actual=[arrays(r) for r in results]
                        errors=[[error(a,b) for a,b in zip(got,ref)] for got,ref in zip(actual,native_arrays)]
                        check=dict(repeat=repeat,mode=name,errors=errors,
                            fields_trace_bitwise=all(digest(a[:3])==digest(b[:3]) for a,b in zip(actual,native_arrays)))
                        check['accuracy_pass']=check['fields_trace_bitwise'] and all(
                            v['relative_l2']<3e-6 for e in errors for v in e[3:])
                    else:
                        check=dict(repeat=repeat,mode=name,
                            unrolling_bitwise=[_result_digest(r) for r in results]==native_hashes)
                        check['accuracy_pass']=check['unrolling_bitwise']
                    if repeat>=0:
                        case['runs'][name].append(sample);case['checks'].append(check)
                    print(json.dumps(dict(name=kind,n=n,repeat=repeat,mode=name,
                        accuracy_pass=check['accuracy_pass'],**sample)),flush=True)
                    del results
                    if engine in ('flaport','batch_torch_phase'):del actual
                    if engine.startswith('batch'):del report
            case['medians']={name:{k:statistics.median(s[k] for s in samples) for k in samples[0]}
                             for name,samples in case['runs'].items()}
            case['accuracy_pass']=all(c['accuracy_pass'] for c in case['checks'])
            record['cases'].append(case)
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf8')
    if not all(c['accuracy_pass'] for c in record['cases']):raise SystemExit('Accuracy gate failed. Measurements retained.')


if __name__=='__main__':main()
