"""Matched native Torch/fused ADE forward and backward ablation on one GPU."""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import statistics
import time

import torch
from photonweave import (AdjointOptions, BoundaryFace, DispersiveSimulation,
                        Monitor, Project, Region, Source)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--size',type=int,default=32)
    parser.add_argument('--steps',type=int,default=64)
    parser.add_argument('--repeats',type=int,default=3)
    parser.add_argument('--precision',choices=['float32','float64'],default='float32')
    parser.add_argument('--complex-bloch',action='store_true')
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    if args.size<16 or args.steps<10 or args.repeats<1:parser.error('Require size>=16, steps>=10, repeats>=1.')
    torch.set_num_threads(4)
    p=Project(region=Region(dimension='3d',size=(args.size*.05,)*3,mesh=.05,pml_cells=4,
                            precision=args.precision,steps=args.steps),
              sources=[Source(center=(-.1,0,0),pulse='continuous',wavelength=.7)],
              monitors=[Monitor(center=(.1,0,0)),Monitor(center=(0,0,0),component='Hy')])
    if args.complex_bloch:
        p.region.boundaries.x_min=BoundaryFace(kind='bloch')
        p.region.boundaries.x_max=BoundaryFace(kind='bloch')
        p.region.bloch_phase=(.43,0,0)
    dtype=getattr(torch,args.precision)
    epsilon=torch.full(p.region.shape,1.7,device='cuda',dtype=dtype,requires_grad=True)
    poles=torch.tensor([.7,.4,0.,1.8,.2],device='cuda',dtype=dtype,requires_grad=True)
    modes={'torch':('torch','torch'),'fused_backward':('torch','fused'),'fused':('fused','fused')}
    models={}
    for name,(forward,backward) in modes.items():
        scene=p.model_copy(deep=True);scene.region.cuda_kernel=forward
        models[name]=DispersiveSimulation(scene,AdjointOptions(checkpoints=3,backward_kernel=backward))
    records={name:[] for name in modes}
    reference=None
    tolerance=dict(rtol=2e-4,atol=3e-6) if dtype==torch.float32 else dict(rtol=2e-9,atol=2e-11)
    def iteration(name,record):
        nonlocal reference
        gc.collect();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
        start=time.perf_counter()
        result=models[name](epsilon,poles[:2]*1e30,poles[2:4]*1e15,poles[4]*1e15)
        loss=result.signals.abs().square().sum()
        gradients=torch.autograd.grad(loss,(epsilon,poles))
        torch.cuda.synchronize()
        row=dict(full_wall_seconds=time.perf_counter()-start,loss=float(loss.detach()),
                 peak_torch_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),report=result.report)
        outputs=(result.signals.detach().cpu(),*(g.detach().cpu() for g in gradients))
        if reference is None:reference=outputs
        errors=[]
        for actual,expected in zip(outputs,reference):
            assert torch.isfinite(actual).all()
            torch.testing.assert_close(actual,expected,**tolerance)
            errors.append(float(torch.linalg.vector_norm(actual-expected)/torch.linalg.vector_norm(expected).clamp_min(torch.finfo(dtype).tiny)))
        row['relative_l2_signal_epsilon_gradient_pole_gradient']=errors
        if record:records[name].append(row)
    names=list(modes)
    for name in names:iteration(name,False)
    for repeat in range(args.repeats):
        for name in names[repeat%3:]+names[:repeat%3]:iteration(name,True)
    medians={name:statistics.median(row['full_wall_seconds'] for row in records[name]) for name in names}
    root=Path(__file__).resolve().parents[1]
    paths=sorted((root/'photonweave').glob('*.py'))+[Path(__file__).resolve()]
    report=dict(grid=p.region.shape,steps=p.region.steps,precision=args.precision,complex_bloch=args.complex_bloch,
        device=torch.cuda.get_device_name(),torch_version=torch.__version__,cuda_version=torch.version.cuda,
        warmups_per_mode=1,repeats=args.repeats,records=records,median_seconds=medians,
        torch_over_mode={name:medians['torch']/value for name,value in medians.items()},
        source_sha256={path.relative_to(root).as_posix():hashlib.sha256(path.read_bytes()).hexdigest() for path in paths},
        parity_tolerance=tolerance,parity_passed=True,
        scope='Native resident ADE ablation. Includes parameter packing, forward, objective, checkpoint replay, backward and shared-gradient reduction. '
              'Model construction, input allocation and final CPU copies excluded. Warmed compilation. '
              'Torch allocation excludes CUDA context. No external solver, optimizer, optical convergence or beyond-VRAM claim.')
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({key:report[key] for key in ('device','median_seconds','torch_over_mode','parity_passed')}),flush=True)


if __name__=='__main__':main()
