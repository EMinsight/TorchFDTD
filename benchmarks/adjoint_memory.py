"""Measure complete differentiable iterations without retaining the time graph.

Use a fresh process per setting for meaningful allocator peaks. This is a
small correctness/memory baseline, not a large-device performance claim.
"""
import argparse
import gc
import json
from pathlib import Path
import time

import torch

from torchfdtd import AdjointOptions,DifferentiableSimulation,Monitor,Project,Region,Source


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--steps',type=int,default=1000)
    ap.add_argument('--checkpoints',type=int,default=4)
    ap.add_argument('--storage',choices=['device','host','disk','hierarchical'],default='device')
    ap.add_argument('--device',default='cuda')
    ap.add_argument('--precision',choices=['float32','float64'],default='float32')
    ap.add_argument('--size',type=int,default=24)
    ap.add_argument('--dimension',choices=['2d','3d'],default='2d')
    ap.add_argument('--output',required=True)
    ap.add_argument('--checkpoint-directory',default='.local/adjoint-checkpoints')
    ap.add_argument('--reference',action='store_true')
    args=ap.parse_args()
    p=Project(region=Region(size=(args.size*.1,)*3,dimension=args.dimension,mesh=.1,pml_cells=3,
                            steps=args.steps,precision=args.precision),
              sources=[Source(center=(-.3,0,0),pulse='gaussian',pulse_cycles=1)],
              monitors=[Monitor(center=(.3,0,0)),Monitor(center=(.2,0,0),component='Hy')])
    options=AdjointOptions(checkpoints=args.checkpoints,storage=args.storage,
                           checkpoint_directory=args.checkpoint_directory,
                           disk_budget_bytes=1024**3,host_budget_bytes=512*1024**2,
                           device_checkpoints=1 if args.storage=='hierarchical' else 0,
                           host_checkpoints=1 if args.storage=='hierarchical' else 0)
    dtype=torch.float32 if args.precision=='float32' else torch.float64
    eps=torch.full(p.region.shape,1.8,device=args.device,dtype=dtype,requires_grad=True)
    model=DifferentiableSimulation(p,options)
    if eps.is_cuda:
        # Initialize the context before the measured section, preserving cold
        # kernel/scene preparation inside the full wall measurement below.
        torch.cuda.synchronize();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats()
        baseline=torch.cuda.memory_allocated()
    else:baseline=None
    gc.collect()
    started=time.perf_counter()
    result=None
    if args.reference:
        signals=model.reference(eps)
    else:
        result=model(eps);signals=result.signals
    forward_done=time.perf_counter()
    loss=signals.square().sum()
    gradient,=torch.autograd.grad(loss,eps)
    if eps.is_cuda:torch.cuda.synchronize()
    ended=time.perf_counter()
    output=dict(shape=p.region.shape,steps=args.steps,precision=args.precision,
                device=torch.cuda.get_device_name(eps.device) if eps.is_cuda else 'CPU',
                mode='full-autograd reference' if args.reference else 'discrete adjoint',
                options={**vars(args),'checkpoint_directory':'local scratch'},
                full_wall_seconds=ended-started,forward_setup_wall_seconds=forward_done-started,
                loss=float(loss.detach()),gradient_norm=float(torch.linalg.vector_norm(gradient)),
                baseline_gpu_allocated_bytes=baseline,
                peak_gpu_allocated_bytes=torch.cuda.max_memory_allocated() if eps.is_cuda else None,
                peak_gpu_reserved_bytes=torch.cuda.max_memory_reserved() if eps.is_cuda else None,
                report={} if result is None else result.report,
                measurement_scope='PyTorch allocator peak only, not external CUDA/context, CPU RSS or physical NVMe throughput. One cold run, not a speed comparison.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(output,indent=2),encoding='utf-8')
    print(json.dumps({k:output[k] for k in ('steps','mode','full_wall_seconds','peak_gpu_allocated_bytes','loss','gradient_norm')}))


if __name__=='__main__':main()
