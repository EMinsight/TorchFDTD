"""Compare DRAM and buffered file banks, including cleanup in iteration time."""
import argparse
from dataclasses import replace
from contextlib import contextmanager
import gc
import json
from pathlib import Path
import statistics
import time

import torch

from photonweave import Region,Project,Source,Monitor,StreamedSimulation,StreamedAdjointOptions
from photonweave.streamed import _reservation
from photonweave.state_store import DiskArray


@contextmanager
def accumulation_baseline(enabled):
    """Serial benchmark only: isolate reading known-zero rows from row tracking."""
    original=DiskArray.index_add_
    def read_then_add(self,axis,indices,value):
        if axis!=0:raise ValueError('Baseline only supports x-slab accumulation.')
        for begin,end,row in self._groups(indices):
            selected=torch.arange(row,row+end-begin,dtype=torch.int64,device='cpu')
            current=self.index_select(0,selected)
            current.add_(value[begin:end])
            self.index_copy_(0,selected,current)
        return self
    try:
        if enabled:DiskArray.index_add_=read_then_add
        yield
    finally:DiskArray.index_add_=original


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--directory',default='results/state-scratch')
    parser.add_argument('--repeats',type=int,default=3)
    parser.add_argument('--nx',type=int,default=128)
    parser.add_argument('--ny',type=int,default=32)
    parser.add_argument('--nz',type=int,default=32)
    parser.add_argument('--steps',type=int,default=32)
    parser.add_argument('--width',type=int,default=16)
    parser.add_argument('--depth',type=int,default=4)
    parser.add_argument('--precision',choices=('float32','float64'),default='float64')
    parser.add_argument('--gpu-budget-mib',type=int,default=256)
    parser.add_argument('--disk-budget-mib',type=int,default=512)
    parser.add_argument('--compare-zero-reads',action='store_true',
                        help='Interleave a read-then-add baseline with row-aware disk accumulation.')
    args=parser.parse_args()
    if args.repeats<1:raise ValueError('repeats must be positive')
    p=Project(region=Region(dimension='3d',size=(args.nx*.1,args.ny*.1,args.nz*.1),mesh=.1,pml_cells=3,
                           steps=args.steps,precision=args.precision,memory_mode='streamed'),
              sources=[Source(pulse='continuous')],monitors=[Monitor(center=(.1,0,0))])
    dtype=getattr(torch,args.precision)
    metadata=torch.empty(p.region.shape,dtype=dtype,device='meta')
    base=StreamedAdjointOptions(slab_width=args.width,temporal_depth=args.depth,checkpoints=2,gpu_budget_bytes=args.gpu_budget_mib*1024**2)
    disk=replace(base,state_storage='disk',state_directory=args.directory,disk_budget_bytes=args.disk_budget_mib*1024**2)
    disk_reservation=_reservation(p,metadata,disk)
    policies={'host':base,'disk':replace(disk,host_budget_bytes=disk_reservation['host_reservation_bytes'])}
    if args.compare_zero_reads:policies['disk_read_zeros']=policies['disk']
    _reservation(p,metadata,base)
    epsilon=torch.full(p.region.shape,1.7,dtype=dtype,requires_grad=True)
    records={key:[] for key in policies}
    reference=None
    def iteration(name,record):
        nonlocal reference
        gc.collect();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
        started=time.perf_counter()
        with accumulation_baseline(name=='disk_read_zeros'):
            result=StreamedSimulation(p,policies[name])(epsilon)
            gradient,=torch.autograd.grad(result.signals.square().sum(),epsilon)
        elapsed=time.perf_counter()-started
        if reference is None:reference=(result.signals.detach().clone(),gradient.clone())
        torch.testing.assert_close(result.signals,reference[0],rtol=1e-11,atol=1e-12)
        torch.testing.assert_close(gradient,reference[1],rtol=1e-10,atol=1e-12)
        error=float(torch.linalg.vector_norm(gradient-reference[1])/torch.linalg.vector_norm(reference[1]))
        if record:records[name].append(dict(seconds=elapsed,gradient_relative_l2=error,
                                           peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),report=result.report))
    for name in policies:iteration(name,False)
    for repeat in range(args.repeats):
        for name in (tuple(policies) if repeat%2==0 else tuple(reversed(policies))):iteration(name,True)
    disk_reservation=_reservation(p,epsilon,policies['disk'])
    try:_reservation(p,epsilon,replace(base,host_budget_bytes=disk_reservation['host_reservation_bytes']))
    except ValueError:host_fits=False
    else:host_fits=True
    output=dict(hardware=torch.cuda.get_device_name(),torch_version=torch.__version__,grid=p.region.shape,
                steps=p.region.steps,precision=args.precision,warmups_per_mode=1,repeats=args.repeats,
                median_seconds={name:statistics.median(r['seconds'] for r in rows) for name,rows in records.items()},
                host_fits_disk_host_reservation=host_fits,records=records,
                comparison_method=('Alternating policy order. disk_read_zeros uses read-then-add, '
                    'disk skips unwritten rows. Both use identical write-row tracking. '
                    'This isolates accumulation methods, not complete source revisions.') if args.compare_zero_reads else None,
                scope='Buffered file banks versus DRAM, not cold SSD/NVMe throughput. OS cache is uncontrolled and excluded from host reservation. Complete iteration includes file creation, reads, writes and cleanup. Torch GPU peaks exclude context/cache. No physical-memory-overflow or external-solver claim.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(output,indent=2),encoding='utf8')
    print(json.dumps(dict(median_seconds=output['median_seconds'],host_fits_disk_host_reservation=host_fits)))


if __name__=='__main__':main()
