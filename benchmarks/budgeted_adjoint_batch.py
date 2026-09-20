"""Large-grid coupled-case replay with a complete finite-cone Torch oracle.

This short capacity/VJP check is not a throughput or optical-convergence study.
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import time

import torch

from photonweave import (AdjointBatchOptions, AdjointCase, AdjointExecutionPolicy,
    AdjointOptions, DifferentiableSimulation, DispersiveSimulation, RecomputedAdjointBatch)
from photonweave.memory_profile import host_memory
from photonweave.solver import index_at
from benchmarks.budgeted_resident import scene, material


def objective(signals):
    return signals.mean(0).square().sum()+.1*signals.square().mean()


def projects(size,precision,steps,count):
    result=[]
    for i in range(count):
        project=scene((size,)*3,precision,steps)
        project.sources[0].wavelength=1.+.07*i
        result.append(project)
    return result


def reference(projects,dispersive):
    epsilon=torch.full(projects[0].region.shape,1.7,dtype=getattr(torch,projects[0].region.precision),requires_grad=True)
    design=(epsilon,)
    if dispersive:
        theta=torch.tensor([.8,1.4,.15],dtype=epsilon.dtype,requires_grad=True)
        design+=(theta,)
    outputs=[]
    for p in projects:
        p=p.model_copy(deep=True);p.region.memory_mode='resident'
        model=(DispersiveSimulation if dispersive else DifferentiableSimulation)(p)
        outputs.append(model.reference(*material(epsilon,theta)) if dispersive else model.reference(epsilon))
    signals=torch.stack(outputs)
    gradients=torch.autograd.grad(objective(signals),design)
    return signals.detach(),tuple(g.detach() for g in gradients)


def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True)
    parser.add_argument('--execute',action='store_true')
    parser.add_argument('--smoke',action='store_true')
    parser.add_argument('--size',type=int,default=512)
    parser.add_argument('--cases',type=int,default=8)
    parser.add_argument('--steps',type=int,default=12)
    parser.add_argument('--device',choices=['cpu','cuda'],default='cuda')
    parser.add_argument('--precision',choices=['float32','float64'],default='float32')
    parser.add_argument('--gpu-budget-gib',type=float,default=32.)
    parser.add_argument('--host-budget-gib',type=float,default=64.)
    parser.add_argument('--cpu-threads',type=int,default=4)
    parser.add_argument('--dispersive',action='store_true')
    args=parser.parse_args(argv)
    if args.size<64 or args.size%4:raise ValueError('Use a size divisible by four and at least 64.')
    if args.size**3<=8_000_000 and not args.smoke:raise ValueError('Non-smoke capacity must exceed eight million cells per case.')
    if not 10<=args.steps<=12 or not 2<=args.cases<=32:raise ValueError('Use 10 to 12 steps and 2 to 32 cases.')
    if args.cpu_threads<1:raise ValueError('cpu-threads must be positive.')
    torch.set_num_threads(args.cpu_threads)
    gpu=int(args.gpu_budget_gib*1024**3);host=int(args.host_budget_gib*1024**3)
    options=AdjointBatchOptions(gpu_budget_bytes=gpu,host_budget_bytes=host)
    native=AdjointOptions(checkpoints=0 if args.dispersive else 2,gpu_budget_bytes=gpu,
        resident_budget_bytes=gpu if args.device=='cuda' else host,
        backward_kernel='fused' if args.device=='cuda' else 'torch')
    policy=AdjointExecutionPolicy(resident=native,device=args.device,host_budget_bytes=host)
    large=projects(args.size,args.precision,args.steps,args.cases)
    small=projects(40,args.precision,args.steps,args.cases)
    crop=(slice(args.size-40,args.size),slice(args.size//2-20,args.size//2+20),slice(args.size//2-20,args.size//2+20))
    for a,b in zip(large,small):
        for x,y in zip([*a.sources,*a.monitors],[*b.sources,*b.monitors]):
            assert tuple(i-j for i,j in zip(index_at(x.center,a.region,x.component),index_at(y.center,b.region,y.component)))==tuple(s.start for s in crop)
    batch=RecomputedAdjointBatch([AdjointCase(p,policy,(0,1,2,3) if args.dispersive else (0,)) for p in large],options)
    dtype=getattr(torch,args.precision)
    scalar=torch.tensor(1.7,dtype=dtype)
    theta=torch.tensor([.8,1.4,.15],dtype=dtype)
    logical=scalar.expand(large[0].region.shape)
    plan=batch.plan(*material(logical,theta)) if args.dispersive else batch.plan(logical)
    root=Path(__file__).resolve().parents[1]
    sources=[Path(__file__).resolve(),root/'benchmarks/budgeted_resident.py',*sorted((root/'photonweave').glob('*.py'))]
    report=dict(stage='admitted_not_executed',grid=large[0].region.shape,cases=args.cases,
        steps=args.steps,precision=args.precision,dispersive=args.dispersive,device=args.device,
        hardware=torch.cuda.get_device_name() if args.device=='cuda' else 'CPU',
        driver_smoke=args.smoke,plan=plan,
        source_sha256={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sources},
        scope=__doc__)
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    def save():
        temp=path.with_suffix('.tmp');temp.write_bytes((json.dumps(report,indent=2)+'\n').encode());temp.replace(path)
    save()
    if not args.execute:return report
    available=host_memory()['available_bytes']
    if not args.smoke and available is not None and plan['host_reservation_bytes']+16*1024**3>available:
        raise ValueError('Execution must preserve 16 GiB available RAM outside the batch reservation.')
    wanted,gradients=reference(small,args.dispersive)
    gc.collect()
    if args.device=='cuda':torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
    started=time.perf_counter()
    try:
        epsilon=torch.full(large[0].region.shape,1.7,dtype=dtype,requires_grad=True)
        design=(epsilon,)
        if args.dispersive:theta=theta.requires_grad_();design+=(theta,)
        result=batch(*material(epsilon,theta)) if args.dispersive else batch(epsilon)
        signals=torch.stack([case.signals for case in result.cases])
        actual=torch.autograd.grad(objective(signals),design)
        rtol=1e-4 if dtype==torch.float32 else 2e-9
        errors=[]
        for a,b in zip((signals,actual[0][crop],*actual[1:]),(wanted,*gradients)):
            if not torch.isfinite(a).all() or torch.linalg.vector_norm(b)<=0:raise AssertionError('Nonfinite or degenerate capacity check.')
            error=float(torch.linalg.vector_norm(a.detach()-b)/torch.linalg.vector_norm(b))
            if error>rtol:raise AssertionError('Coupled-case outputs or gradients disagree with the finite-cone oracle.')
            errors.append(error)
        norm=float(torch.linalg.vector_norm(actual[0]));expected_norm=float(torch.linalg.vector_norm(gradients[0]))
        if abs(norm-expected_norm)>rtol*expected_norm:raise AssertionError('Wrong global gradient norm or gradient outside the finite cone.')
        if args.device=='cuda':torch.cuda.synchronize()
        report.update(stage='forward_backward_validated',relative_l2_output_and_gradients=errors,
            global_epsilon_gradient_norm=norm,reference_epsilon_gradient_norm=expected_norm,
            peak_torch_cuda_bytes=torch.cuda.max_memory_allocated() if args.device=='cuda' else 0,
            elapsed_seconds=time.perf_counter()-started,batch=result.report)
        save()
    except BaseException as exc:
        report.update(stage='failed',error=repr(exc));save();raise
    return report


if __name__=='__main__':main()
