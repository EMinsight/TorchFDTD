"""Matched warmed full-iteration measurements for Torch and fused adjoints."""
import argparse
import gc
import json
from pathlib import Path
import statistics
import time

import torch
from photonweave import AdjointOptions,DifferentiableSimulation,Monitor,Project,Region,Source


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--size',type=int,default=32)
    ap.add_argument('--steps',type=int,default=400)
    ap.add_argument('--repeats',type=int,default=3)
    ap.add_argument('--output',required=True)
    args=ap.parse_args()
    if args.repeats<1:raise ValueError('repeats must be positive')
    p=Project(region=Region(dimension='3d',size=(args.size*.1,)*3,mesh=.1,pml_cells=3,
                            precision='float32',steps=args.steps),
              sources=[Source(center=(-.3,0,0),pulse_cycles=1)],
              monitors=[Monitor(center=(.3,0,0)),Monitor(center=(.2,0,0),component='Hy')])
    eps=torch.full(p.region.shape,1.8,device='cuda',requires_grad=True)
    models={name:DifferentiableSimulation(p,AdjointOptions(checkpoints=4,backward_kernel=name)) for name in ('torch','fused')}
    records={name:[] for name in models}
    gradients={}
    def iteration(name,record):
        gc.collect();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
        start=time.perf_counter()
        result=models[name](eps)
        loss=result.signals.square().sum()
        gradient,=torch.autograd.grad(loss,eps)
        torch.cuda.synchronize()
        row=dict(full_wall_seconds=time.perf_counter()-start,loss=float(loss.detach()),
                 peak_allocated_bytes=torch.cuda.max_memory_allocated(),report=result.report)
        gradients[name]=gradient.detach().cpu()
        if record:records[name].append(row)
    for name in models:iteration(name,False)
    for repeat in range(args.repeats):
        for name in (('torch','fused') if repeat%2==0 else ('fused','torch')):iteration(name,True)
    error=float(torch.linalg.vector_norm(gradients['torch']-gradients['fused'])/torch.linalg.vector_norm(gradients['torch']))
    torch.testing.assert_close(gradients['torch'],gradients['fused'],rtol=3e-5,atol=1e-7)
    medians={name:statistics.median(r['full_wall_seconds'] for r in rows) for name,rows in records.items()}
    output=dict(grid=p.region.shape,steps=p.region.steps,precision='float32',device=torch.cuda.get_device_name(),
                torch_version=torch.__version__,cuda_version=torch.version.cuda,
                warmups_per_mode=1,repeats=args.repeats,records=records,median_seconds=medians,
                full_iteration_speedup=medians['torch']/medians['fused'],gradient_relative_l2=error,
                scope='Matched native backward ablation. Full iteration includes preparation, forward, checkpoint replay and backward. Torch allocator only. Not an external solver comparison.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(output,indent=2),encoding='utf8')
    print(json.dumps({k:output[k] for k in ('median_seconds','full_iteration_speedup','gradient_relative_l2')}))


if __name__=='__main__':main()
