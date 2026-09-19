"""Complete spectral-loss iterations, full-history versus online observations."""
import argparse
import gc
import json
from pathlib import Path
import statistics
import time

import torch

from photonweave import (Project,Region,Source,Monitor,AdjointOptions,DifferentiableSimulation,
                        StreamedAdjointOptions,StreamedSimulation)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--steps',type=int,default=128)
    parser.add_argument('--repeats',type=int,default=3)
    parser.add_argument('--mode',choices=('resident','host','disk'),default='resident')
    parser.add_argument('--block-size',type=int,default=32)
    args=parser.parse_args()
    if args.repeats<1:parser.error('repeats must be positive')
    project=Project(region=Region(dimension='2d',size=(2.4,2.0,1),mesh=.1,pml_cells=3,steps=args.steps,precision='float64'),
                    sources=[Source(center=(-.4,0,0),pulse='continuous')],
                    monitors=[Monitor(center=(x,y,0),component=c) for x in (-.2,0,.2,.4)
                              for y in (-.2,0,.2) for c in ('Ez','Hy')])
    device='cuda' if args.mode=='resident' else 'cpu'
    epsilon=torch.full(project.region.shape,1.7,device=device,dtype=torch.float64,requires_grad=True)
    if args.mode=='resident':model=DifferentiableSimulation(project,AdjointOptions(checkpoints=4))
    else:
        model=StreamedSimulation(project,StreamedAdjointOptions(slab_width=6,temporal_depth=8,local_checkpoints=1,
                                  state_storage=args.mode,state_directory='results/spectral-state' if args.mode=='disk' else None,
                                  disk_budget_bytes=256*1024**2 if args.mode=='disk' else None))
    frequencies=[.017/project.region.time_step,.041/project.region.time_step,.082/project.region.time_step]
    records={'history':[],'online':[]}
    reference=None
    def run(policy,record):
        nonlocal reference
        gc.collect();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
        start=time.perf_counter()
        if policy=='history':
            result=model(epsilon)
            values=result.spectrum(frequencies)
        else:
            result=model.spectrum(epsilon,frequencies,**({'block_size':args.block_size} if args.mode=='resident' else {}))
            values=result.fields
        scaled=values/project.region.time_step
        loss=(scaled.real+.7*scaled.imag).square().mean()
        gradient,=torch.autograd.grad(loss,epsilon)
        torch.cuda.synchronize()
        elapsed=time.perf_counter()-start
        values,gradient=scaled.detach().cpu(),gradient.detach().cpu()
        if reference is None:reference=(values.clone(),gradient.clone())
        torch.testing.assert_close(values,reference[0],rtol=1e-10,atol=1e-11)
        torch.testing.assert_close(gradient,reference[1],rtol=2e-9,atol=1e-11)
        error=float(torch.linalg.vector_norm(gradient-reference[1])/torch.linalg.vector_norm(reference[1]))
        if record:records[policy].append(dict(seconds=elapsed,gradient_relative_l2=error,
                                             peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),report=result.report))
    for policy in records:run(policy,False)
    for repeat in range(args.repeats):
        for policy in (tuple(records) if repeat%2==0 else tuple(reversed(records))):run(policy,True)
    output=dict(hardware=torch.cuda.get_device_name(),torch_version=torch.__version__,mode=args.mode,
                grid=project.region.shape,steps=args.steps,monitors=len(project.monitors),frequencies=frequencies,
                observation_block_size=args.block_size if args.mode=='resident' else 8,
                warmups_per_policy=1,repeats=args.repeats,records=records,
                median_seconds={k:statistics.median(v['seconds'] for v in rows) for k,rows in records.items()},
                scope='Complete spectral-loss forward/backward on one fixed small scene. Torch CUDA allocation peak excludes context and cache. Admission is an estimate. Point observations, not a plane flux or CR validation. No external-solver or physical-memory-overflow claim.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(output,indent=2)+'\n',encoding='utf8')
    print(json.dumps(output['median_seconds']))


if __name__=='__main__':main()
