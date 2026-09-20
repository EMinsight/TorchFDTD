"""Alternating complete coupled-objective iterations, stacked versus recomputed."""
import argparse
import gc
import json
from pathlib import Path
import statistics
import time
import torch
from torchfdtd import (Project,Region,Source,Monitor,BoundaryFace,Boundaries,
                        AdjointOptions,DifferentiableSimulation,recompute_cases)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--cases',type=int,default=8)
    parser.add_argument('--size',type=int,default=64)
    parser.add_argument('--steps',type=int,default=24)
    parser.add_argument('--repeats',type=int,default=3)
    args=parser.parse_args()
    if min(args.cases,args.size,args.steps,args.repeats)<1:parser.error('Counts must be positive.')
    cases=[]
    for index in range(args.cases):
        p=Project(region=Region(dimension='3d',size=(args.size*.1,)*3,mesh=.1,pml_cells=3,
            steps=args.steps,precision='float32',cuda_kernel='torch',bloch_phase=(.1+.7*index/max(1,args.cases-1),0,0),
            boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'),x_max=BoundaryFace(kind='bloch'))),
            sources=[Source(center=(-.2,0,0),pulse='continuous')],
            monitors=[Monitor(center=(.1,0,0),component='Ez'),Monitor(center=(0,.1,0),component='Hy')])
        model=DifferentiableSimulation(p,AdjointOptions(checkpoints=2,backward_kernel='torch'))
        def case(x,model=model):
            eps=torch.ones(model.project.region.shape,device=x.device,dtype=x.dtype)*(1.4+x)
            return model.spectrum(eps,[.03/model.project.region.time_step],block_size=8).fields.flatten()/model.project.region.time_step
        cases.append(case)
    x=torch.tensor(.2,device='cuda',requires_grad=True)
    reference=None;records={'stacked':[],'recomputed':[]}
    def run(policy,record):
        nonlocal reference
        gc.collect();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
        start=time.perf_counter()
        output=torch.stack([f(x) for f in cases]).cpu() if policy=='stacked' else recompute_cases(cases,x)
        loss=output.mean(0).abs().square().sum()+output.real.square().mean()
        gradient,=torch.autograd.grad(loss,x)
        torch.cuda.synchronize();elapsed=time.perf_counter()-start
        if reference is None:reference=(output.detach().clone(),gradient.detach().cpu().clone())
        torch.testing.assert_close(output,reference[0],rtol=2e-5,atol=1e-7)
        torch.testing.assert_close(gradient.cpu(),reference[1],rtol=2e-5,atol=1e-7)
        if record:records[policy].append(dict(seconds=elapsed,peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),
            gradient=float(gradient),gradient_relative_error=float((gradient.cpu()-reference[1]).abs()/reference[1].abs().clamp_min(1e-20))))
    for policy in records:run(policy,False)
    for repeat in range(args.repeats):
        for policy in (tuple(records) if repeat%2==0 else tuple(reversed(records))):run(policy,True)
    result=dict(hardware=torch.cuda.get_device_name(),torch_version=torch.__version__,grid=p.region.shape,
        steps=args.steps,cases=args.cases,records=records,
        summary={key:dict(median_seconds=statistics.median(v['seconds'] for v in rows),
                         peak_cuda_allocated_bytes=max(v['peak_cuda_allocated_bytes'] for v in rows)) for key,rows in records.items()},
        scope='Synthetic coupled point-spectrum objective, fixed complex Bloch cases. Torch allocator peak only. Sequential recomputation, not CR validation or competitor speed comparison.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(result,indent=2)+'\n',encoding='utf8')
    print(json.dumps(result['summary']))


if __name__=='__main__':main()
