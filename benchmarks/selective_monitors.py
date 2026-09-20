"""Same signed flux, fewer accumulated components. End-to-end CUDA ensembles."""
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
from torchfdtd import Simulation, run_tensor_batch
from torchfdtd.solver import hardware
from .open_source import upstream_run
from .spectral_ensemble import projects_for, digest, error


def common_outputs(result):
    return [result.electric,result.magnetic,result.signals,*[m['flux'] for m in result.frequency_fields]]


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--sizes',nargs='+',type=int,default=[32,64])
    ap.add_argument('--cases',nargs='+',default=['vacuum','sphere','slab','waveguide'])
    ap.add_argument('--count',type=int,default=8);ap.add_argument('--cohort',type=int,default=4)
    ap.add_argument('--steps',type=int,default=800);ap.add_argument('--frequencies',type=int,default=65)
    ap.add_argument('--repeats',type=int,default=3)
    ap.add_argument('--output',default='results/open-source/selective-monitors.json')
    args=ap.parse_args();target=Path(args.output)
    if target.exists():raise FileExistsError('Choose a new output path to preserve prior measurements.')
    modes=['flaport_flux_1','flaport_flux_8','native_sequential_flux','native_batch_full','native_batch_flux']
    paths=['torchfdtd/models.py','torchfdtd/field_monitors.py','torchfdtd/cuda_monitors.py',
           'torchfdtd/solver.py','torchfdtd/tensor_batch.py','torchfdtd/cuda_kernels.py',
           'torchfdtd/cuda_batch.py','torchfdtd/cuda_graph.py','benchmarks/open_source.py',
           'benchmarks/selective_monitors.py','benchmarks/spectral_ensemble.py','benchmarks/ensemble_comparison.py']
    record=dict(hardware=hardware(),platform=platform.platform(),configuration=vars(args),
        packages={k:importlib.metadata.version(k) for k in ('torchfdtd','fdtd','torch','numpy','cupy-cuda12x')},
        source_sha256={p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in paths},
        upstream_sha256={k:hashlib.sha256(Path(inspect.getfile(v)).read_bytes()).hexdigest()
                         for k,v in [('grid',fdtd.Grid),('boundary',fdtd.PML)]},
        method='Full wall: setup, graph capture, loop, native snapshots, all final E/H, point trace and selected output transfers. '
               'Three planar monitors with 65 frequencies by default. All time samples retained, float32 fields/complex64 DFT. '
               'Flux-only modes accumulate four tangential components per plane and export the same signed flux as the '
               'six-component full-output mode. The same selective fused DFT observer is supplied to unmodified flaport E/H updates. '
               'External graph sizes 1 and 8 both measured. Native graph size 1 and fixed cohort size 4. '
               'One warmup and three alternating-order measured repetitions by default. Cold compilation/context, checks and disk writes excluded. '
               'Torch allocated/reserved peaks exclude CUDA context, graph executables and other non-Torch allocations.',
        gates=dict(native_common_outputs='bitwise versus independent full-output native runs',
                   external_trace_relative_l2=.01,external_flux_relative_l2=.02),cases=[])
    for n in args.sizes:
        for kind in args.cases:
            projects=projects_for(kind,n,args.steps,args.count)
            for p in projects:
                p.region.cuda_monitor_kernel='fused'
                for m in p.monitors:
                    if m.kind=='field':m.spectrum.frequency_points=args.frequencies
            reference=[common_outputs(Simulation(p).run()) for p in projects]
            hashes=[digest(a) for a in reference]
            case=dict(name=kind,shape=list(projects[0].region.shape),projects=[p.model_dump() for p in projects],
                      runs={m:[] for m in modes},checks=[])
            for repeat in range(-1,args.repeats):
                for mode in modes if repeat%2==0 else modes[::-1]:
                    for p in projects:
                        for m in p.monitors:
                            if m.kind!='field':continue
                            m.record_fields=('Ex','Ey','Ez','Hx','Hy','Hz') if mode=='native_batch_full' else ()
                            m.record_poynting=('x','y','z') if mode=='native_batch_full' else ()
                    gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats();torch.cuda.synchronize()
                    start=time.perf_counter()
                    if mode.startswith('flaport'):
                        results=[upstream_run(p,with_planes=True,plane_kernel='fused',
                                 cuda_graph_steps=int(mode[-1]),plane_result='flux') for p in projects]
                        actual=[r[1] for r in results];loop=sum(r[0]['loop_seconds'] for r in results)
                        setup=sum(r[0]['setup_seconds'] for r in results)
                    elif mode=='native_sequential_flux':
                        results=[Simulation(p).run() for p in projects]
                        actual=[common_outputs(r) for r in results];loop=sum(r.summary['seconds'] for r in results)
                        setup=sum(r.summary['setup_seconds'] for r in results)
                    else:
                        batch=run_tensor_batch(projects,cohort_size=args.cohort);batch.raise_for_errors()
                        results=[i.load() for i in batch.items];actual=[common_outputs(r) for r in results]
                        loop=batch.plan['loop_seconds'];setup=batch.plan['setup_seconds']
                    torch.cuda.synchronize();wall=time.perf_counter()-start
                    row=dict(wall_seconds=wall,loop_seconds=loop,setup_seconds=setup,cases_per_second=args.count/wall,
                        peak_allocated_bytes=torch.cuda.max_memory_allocated(),peak_reserved_bytes=torch.cuda.max_memory_reserved())
                    if mode.startswith('flaport'):
                        errors=[[error(a,b) for a,b in zip(got,ref)] for got,ref in zip(actual,reference)]
                        check=dict(repeat=repeat,mode=mode,errors=errors,
                            accuracy_pass=all(e[2]['relative_l2']<.01 and all(x['relative_l2']<.02 for x in e[3:]) for e in errors))
                    else:
                        check=dict(repeat=repeat,mode=mode,accuracy_pass=[digest(a) for a in actual]==hashes)
                    if repeat>=0:case['runs'][mode].append(row);case['checks'].append(check)
                    print(json.dumps(dict(name=kind,n=n,repeat=repeat,mode=mode,accuracy_pass=check['accuracy_pass'],**row)),flush=True)
                    if not check['accuracy_pass']:raise RuntimeError('Common-output accuracy gate failed.')
                    del results,actual
                    if mode.startswith('native_batch'):del batch
            case['medians']={m:{k:statistics.median(s[k] for s in samples) for k in samples[0]} for m,samples in case['runs'].items()}
            case['accuracy_pass']=all(c['accuracy_pass'] for c in case['checks']);record['cases'].append(case)
            target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf8')


if __name__=='__main__':main()
