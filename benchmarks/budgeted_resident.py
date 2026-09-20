"""Resident allocation above the workbench cell guard with a near-PML VJP oracle.

This is a short index/capacity check, not a converged optical or timing study.
"""
import argparse
import gc
import hashlib
import json
import math
from pathlib import Path
import time

import torch

from photonweave import (AdjointOptions, DifferentiableSimulation, DispersiveSimulation,
    Monitor, Project, Region, Source, estimate_adjoint_memory)
from photonweave.differentiable import _System
from photonweave.dispersive_adjoint import _DispersiveSystem
from photonweave.solver import index_at


def scene(shape,precision,steps):
    region=Region(dimension='3d',size=tuple(n*.1 for n in shape),mesh=.1,
        steps=steps,pml_cells=3,precision=precision,memory_mode='budgeted',cuda_kernel='fused')
    source=(region.size[0]/2-.75,.05,.05)
    return Project(region=region,sources=[Source(center=source,pulse='continuous')],
        monitors=[Monitor(center=(source[0]+.1,source[1],source[2])),
                  Monitor(center=(source[0],source[1]+.1,source[2]),component='Hy')])


def material(epsilon,theta):
    return epsilon,theta[:1]*1e30,theta[1]*1e15,theta[2]*1e15


def oracle(project,dispersive):
    dtype=getattr(torch,project.region.precision)
    epsilon=torch.full(project.region.shape,1.7,dtype=dtype,requires_grad=True)
    design=(epsilon,)
    if dispersive:
        theta=torch.tensor([.8,1.4,.15],dtype=dtype,requires_grad=True)
        parameters,layout=DispersiveSimulation(project)._pack(*material(epsilon,theta),reference=True)
        system=_DispersiveSystem(project,epsilon,parameters,layout)
        design+=(theta,)
    else:
        parameters=epsilon
        system=_System(project,epsilon)
    state=system.state()
    signals=[]
    for step in range(project.region.steps):
        state=system.reference_step(state,step,parameters)
        signals.append(system.observe(state))
    signals=torch.stack(signals)
    psis=state[2:-2] if dispersive else state[2:]
    cpml_norm=sum(float(torch.linalg.vector_norm(p.detach())) for p in psis)
    if cpml_norm<=0:raise AssertionError('Reference did not exercise CPML.')
    gradients=torch.autograd.grad(signals.abs().square().sum(),design)
    return (signals.detach(),*(g.detach() for g in gradients)),cpml_norm


def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True)
    parser.add_argument('--execute',action='store_true')
    parser.add_argument('--smoke',action='store_true')
    parser.add_argument('--size',type=int,default=256)
    parser.add_argument('--steps',type=int,default=12)
    parser.add_argument('--device',choices=('cpu','cuda'),default='cuda')
    parser.add_argument('--precision',choices=('float32','float64'),default='float32')
    parser.add_argument('--resident-gib',type=float,default=16.)
    parser.add_argument('--cpu-threads',type=int,default=4)
    parser.add_argument('--dispersive',action='store_true')
    args=parser.parse_args(argv)
    if args.size<64 or args.size%4:raise ValueError('Use a size divisible by four and at least 64.')
    if not 10<=args.steps<=12:raise ValueError('The finite-cone oracle supports 10 to 12 steps.')
    if args.size**3<=8_000_000 and not args.smoke:raise ValueError('A non-smoke check must exceed eight million cells.')
    if not math.isfinite(args.resident_gib) or args.resident_gib<=0:raise ValueError('resident-gib must be positive and finite.')
    if args.cpu_threads<1:raise ValueError('cpu-threads must be positive.')
    torch.set_num_threads(args.cpu_threads)
    project=scene((args.size,)*3,args.precision,args.steps)
    options=AdjointOptions(checkpoints=0,resident_budget_bytes=int(args.resident_gib*1024**3),
        backward_kernel='fused' if args.device=='cuda' else 'torch')
    shapes=(project.region.shape,(1,),(),()) if args.dispersive else None
    reservation=estimate_adjoint_memory(project,options,device=args.device,parameter_shapes=shapes)
    small=scene((40,)*3,args.precision,args.steps)
    small.region.memory_mode='resident'
    crop=(slice(args.size-40,args.size),slice(args.size//2-20,args.size//2+20),slice(args.size//2-20,args.size//2+20))
    # Verify physical alignment rather than assuming that floating coordinate
    # rounding selected the same staggered Yee source and observation cells.
    for large_item,small_item in zip([*project.sources,*project.monitors],[*small.sources,*small.monitors]):
        large_index=index_at(large_item.center,project.region,large_item.component)
        small_index=index_at(small_item.center,small.region,small_item.component)
        assert tuple(a-b for a,b in zip(large_index,small_index))==tuple(s.start for s in crop)
    location=index_at(project.sources[0].center,project.region,project.sources[0].component)
    source_flat=(location[0]*args.size+location[1])*args.size+location[2]
    root=Path(__file__).resolve().parents[1]
    record=dict(stage='admitted_not_executed',grid=project.region.shape,steps=args.steps,
        device=args.device,hardware=torch.cuda.get_device_name() if args.device=='cuda' else 'CPU',
        precision=args.precision,dispersive=args.dispersive,driver_smoke=args.smoke,cpu_threads=torch.get_num_threads(),
        exceeds_workbench_cell_guard=args.size**3>8_000_000,source_cell_index=source_flat,
        reservation=reservation,source_sha256={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest()
            for p in [Path(__file__).resolve(),*sorted((root/'photonweave').glob('*.py'))]},
        scope='Short resident index/capacity and near-PML first-order VJP check. A 40-cubed full-autograd Torch oracle exercises nonzero CPML. Not a beyond-VRAM, long-time optical-convergence or speed comparison.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    def save():
        temp=path.with_suffix('.tmp');temp.write_bytes((json.dumps(record,indent=2)+'\n').encode());temp.replace(path)
    save()
    if not args.execute:return record
    expected,cpml_norm=oracle(small,args.dispersive)
    record['oracle_cpml_norm']=cpml_norm
    gc.collect()
    if args.device=='cuda':torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
    started=time.perf_counter()
    try:
        epsilon=torch.full(project.region.shape,1.7,dtype=getattr(torch,args.precision),device=args.device,requires_grad=True)
        design=(epsilon,)
        if args.dispersive:
            theta=torch.tensor([.8,1.4,.15],dtype=epsilon.dtype,device=args.device,requires_grad=True)
            result=DispersiveSimulation(project,options)(*material(epsilon,theta))
            design+=(theta,)
        else:result=DifferentiableSimulation(project,options)(epsilon)
        gradients=torch.autograd.grad(result.signals.abs().square().sum(),design)
        norm=float(torch.linalg.vector_norm(gradients[0]))
        actual=(result.signals.detach().cpu(),gradients[0][crop].cpu(),*(g.cpu() for g in gradients[1:]))
        relative=[]
        tolerance=1e-4 if args.precision=='float32' else 2e-9
        for a,b in zip(actual,expected):
            if not bool(torch.isfinite(a).all()) or torch.linalg.vector_norm(b)<=0:raise AssertionError('Nonfinite or degenerate comparison.')
            error=float(torch.linalg.vector_norm(a-b)/torch.linalg.vector_norm(b))
            if error>tolerance:raise AssertionError('Resident output or VJP disagrees with the finite-cone oracle.')
            relative.append(error)
        expected_norm=float(torch.linalg.vector_norm(expected[1]))
        if not math.isfinite(norm) or abs(norm-expected_norm)>tolerance*expected_norm:
            raise AssertionError('Gradient outside the reference crop or incorrect global gradient norm.')
        if args.device=='cuda':torch.cuda.synchronize()
        record.update(stage='forward_backward_validated',elapsed_seconds=time.perf_counter()-started,
            relative_l2_output_and_gradients=relative,gradient_norm=norm,oracle_gradient_norm=expected_norm,
            report=result.report,peak_torch_cuda_bytes=torch.cuda.max_memory_allocated() if args.device=='cuda' else 0)
        save()
    except BaseException as exc:
        record.update(stage='failed',error=repr(exc));save();raise
    return record


if __name__=='__main__':main()
