"""Throughput and exact independence for actual CUDA batch-axis launches."""
import argparse
import gc
import json
from pathlib import Path
import statistics
import time

import numpy as np
import torch

from photonweave import BatchCase, BatchRunner, Simulation, run_tensor_batch
from photonweave.solver import hardware
from .open_source import scene, upstream_run, relative


def objective(result):return float(np.max(abs(result.signals)))


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--sizes',nargs='+',type=int,default=[32,64])
    parser.add_argument('--batches',nargs='+',type=int,default=[1,2,4,8,16])
    parser.add_argument('--steps',type=int,default=800)
    parser.add_argument('--repeats',type=int,default=3)
    parser.add_argument('--skip-upstream',action='store_true')
    parser.add_argument('--process-workers',type=int,default=2)
    parser.add_argument('--output',default='results/open-source/tensor-batch.json')
    args=parser.parse_args()
    data=dict(hardware=hardware(),method='Native sphere radius sweep. Fixed steps, real float32, identical source and point outputs. One warmup per mode and three alternating measured repetitions by default. Each repetition rebuilds fields, geometry and CUDA graphs, transfers full E/H and traces, and evaluates trace-peak objectives. Cold interpreter/CUDA/NVRTC startup and file I/O excluded. Fused cohort shares E/H/source/trace launches across cases. The separately reported process baseline includes dispatch and IPC but excludes worker startup. All fields/traces are tested bitwise against native independent solves. Upstream graph uses unmodified flaport updates and the documented shared-source adapter, with its PML-stencil difference and a predeclared 1% trace tolerance.',cases=[],process_cases=[])
    for n in args.sizes:
        for size in args.batches:
            cases=[]
            for i in range(size):
                p=scene('sphere',n,args.steps);p.structures[0].radius=.35+.01*i
                cases.append(BatchCase(f'radius-{i:02d}',p,{'radius_um':p.structures[0].radius}))
            modes=['sequential_fused','tensor']+([] if args.skip_upstream else ['flaport_graph'])
            case=dict(shape=list(cases[0].project.region.shape),batch_size=size,projects=[c.project.model_dump() for c in cases],
                      runs={mode:[] for mode in modes},checks=[])
            for repeat in range(-1,args.repeats):
                results={}
                for mode in (modes if repeat%2==0 else list(reversed(modes))):
                    gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats()
                    start=time.perf_counter()
                    if mode=='tensor':
                        report=run_tensor_batch(cases,objective=objective)
                        report.raise_for_errors();outputs=[(x.load().electric,x.load().magnetic,x.load().signals) for x in report.items]
                        loop=report.plan['loop_seconds'];metrics=[x.metrics['objective'] for x in report.items]
                    elif mode=='sequential_fused':
                        runs=[Simulation(c.project).run() for c in cases]
                        outputs=[(r.electric,r.magnetic,r.signals) for r in runs]
                        loop=sum(r.summary['seconds'] for r in runs);metrics=[objective(r) for r in runs]
                    else:
                        runs=[upstream_run(c.project,True) for c in cases]
                        outputs=[arrays for _,arrays in runs]
                        loop=sum(timing['loop_seconds'] for timing,_ in runs)
                        metrics=[float(np.max(abs(arrays[2]))) for arrays in outputs]
                    wall=time.perf_counter()-start
                    if repeat<0:continue
                    row=dict(wall_seconds=wall,loop_seconds=loop,cases_per_second=size/wall,
                             objective_evaluations_per_second=size/wall,peak_allocated_bytes=torch.cuda.max_memory_allocated(),objectives=metrics)
                    case['runs'][mode].append(row);results[mode]=outputs
                    print(json.dumps(dict(n=n,batch=size,repeat=repeat,mode=mode,wall_seconds=wall,loop_seconds=loop)),flush=True)
                if repeat>=0:
                    identical=all(np.array_equal(a,b) for left,right in zip(results['sequential_fused'],results['tensor']) for a,b in zip(left,right))
                    assert identical,'Batched fields/traces differ from independent runs.'
                    check=dict(native_bitwise_identical=identical)
                    if 'flaport_graph' in results:
                        check['upstream_trace_relative_l2']=[relative(a[2],b[2]) for a,b in zip(results['tensor'],results['flaport_graph'])]
                        check['upstream_trace_accuracy_pass']=max(check['upstream_trace_relative_l2'])<.01
                    case['checks'].append(check)
            case['medians']={mode:{key:statistics.median(row[key] for row in rows)
                                  for key in ('wall_seconds','loop_seconds','cases_per_second','peak_allocated_bytes','objective_evaluations_per_second')}
                             for mode,rows in case['runs'].items()}
            data['cases'].append(case)
            target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text(json.dumps(data,indent=2,allow_nan=False)+'\n',encoding='utf-8')
        if args.process_workers:
            row=dict(shape=list(cases[0].project.region.shape),batch_size=len(cases),workers=args.process_workers,runs=[])
            with BatchRunner(backend='cuda',max_workers=args.process_workers,cpu_threads=1) as runner:
                runner.run(cases,objective=objective,keep_results=True).raise_for_errors()
                for _ in range(args.repeats):
                    start=time.perf_counter();report=runner.run(cases,objective=objective,keep_results=True);wall=time.perf_counter()-start
                    report.raise_for_errors()
                    assert all(np.array_equal(item.load().signals,ref[2]) for item,ref in zip(report.items,results['tensor']))
                    row['runs'].append(dict(wall_seconds=wall,cases_per_second=len(cases)/wall))
            row['median_wall_seconds']=statistics.median(r['wall_seconds'] for r in row['runs'])
            data['process_cases'].append(row)
            target.write_text(json.dumps(data,indent=2,allow_nan=False)+'\n',encoding='utf-8')


if __name__=='__main__':main()
