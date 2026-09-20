"""Dense real-plane CUDA VJP parity against the explicit Torch transpose.

This is an integration/compilation check, not a speedup or optical-convergence study.
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import time

import torch

from photonweave import (AdjointOptions, BoundaryFace, DispersivePlaneSimulation,
    FieldMonitor, Project, Region, Source)
from benchmarks.streamed_policy import evaluate, compare


def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True)
    parser.add_argument('--size',type=int,default=128)
    parser.add_argument('--steps',type=int,default=32)
    parser.add_argument('--precision',choices=('float32','float64'),default='float32')
    args=parser.parse_args(argv)
    if args.size<32 or args.steps<10:raise ValueError('Use size >= 32 and steps >= 10.')
    if not torch.cuda.is_available():raise ValueError('CUDA required.')
    torch.set_num_threads(4)
    region=Region(dimension='3d',size=(args.size*.1,)*3,mesh=.1,steps=args.steps,
        precision=args.precision,pml_cells=3,cuda_kernel='fused')
    region.boundaries.x_min=BoundaryFace(kind='periodic')
    region.boundaries.x_max=BoundaryFace(kind='periodic')
    span=(args.size-8)*.1
    project=Project(region=region,sources=[Source(center=(-.2,0,0),pulse='continuous')],
        monitors=[FieldMonitor(id=name,center=(x,0,0),size=(0,span,span),normal='x',downsample=4)
            for name,x in (('near',.2),('far',.3))])
    dtype=getattr(torch,args.precision)
    root=Path(__file__).resolve().parents[1]
    sources=[Path(__file__).resolve(),root/'benchmarks/streamed_policy.py',*sorted((root/'photonweave').glob('*.py'))]
    report=dict(stage='running',scope=__doc__,grid=region.shape,steps=args.steps,precision=args.precision,
        hardware=torch.cuda.get_device_name(),torch_version=torch.__version__,runs={},
        source_sha256={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sources})
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    def save():path.write_bytes((json.dumps(report,indent=2)+'\n').encode())
    save()
    reference=None
    for kernel in ('fused','torch'):
        gc.collect();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
        started=time.perf_counter()
        model=DispersivePlaneSimulation(project,AdjointOptions(checkpoints=2,backward_kernel=kernel))
        design=(torch.full(region.shape,1.7,dtype=dtype,device='cuda',requires_grad=True),
            *(torch.tensor(v,dtype=dtype,device='cuda',requires_grad=True) for v in ([.7,.4],[0.,1.8],.2)))
        result,values,gradients=evaluate(model,design,region,dispersive=True,planes=True)
        torch.cuda.synchronize()
        measured=dict(seconds=time.perf_counter()-started,observers=len(model.observers),
            peak_torch_cuda_bytes=torch.cuda.max_memory_allocated(),solver=result.report)
        detached=tuple(t.cpu().clone() for t in (values,*gradients))
        if reference is None:reference=detached
        else:report['relative_l2_outputs_and_material_vjps']=compare(detached[0],detached[1:],reference,dtype)
        report['runs'][kernel]=measured
        del model,design,result,values,gradients,detached
        save()
        print(kernel,'completed',measured['observers'],'internal observers',flush=True)
    report['stage']='dense_plane_vjp_validated';save()
    return report


if __name__=='__main__':main()
