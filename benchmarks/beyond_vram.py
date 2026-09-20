"""Explicit physical-VRAM-overflow forward/VJP capacity validation.

The short-run local oracle uses finite stencil propagation from a point source.
It is a capacity/correctness check, not a converged photonic application.
"""
import argparse
import gc
import hashlib
import json
import shutil
from pathlib import Path
import threading
import time

import psutil
import torch
import photonweave
from photonweave import (Region, Project, Source, Monitor, BoundaryFace,
    StreamedSimulation, StreamedAdjointOptions, DifferentiableSimulation,
    estimate_streamed_memory)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--scratch',required=True)
    parser.add_argument('--execute',action='store_true')
    parser.add_argument('--smoke',action='store_true',help='Driver check only, never capacity evidence')
    parser.add_argument('--nx',type=int,default=1024)
    parser.add_argument('--ny',type=int,default=1024)
    parser.add_argument('--nz',type=int,default=576)
    parser.add_argument('--steps',type=int,default=10)
    parser.add_argument('--width',type=int,default=16)
    parser.add_argument('--depth',type=int,default=2)
    parser.add_argument('--gpu-gib',type=int,default=32)
    parser.add_argument('--host-gib',type=int,default=76)
    parser.add_argument('--disk-gib',type=int,default=280)
    args=parser.parse_args()
    if not 10<=args.steps<=11:raise ValueError('This local-cone oracle supports 10 to 11 steps.')
    if any(n<64 or n%2 for n in (args.nx,args.ny,args.nz)):
        raise ValueError('Use even dimensions at least 64 to preserve source alignment.')
    def project(shape):
        r=Region(dimension='3d',size=tuple(n*.1 for n in shape),mesh=.1,steps=args.steps,
            precision='float64',pml_cells=3,memory_mode='streamed',cuda_kernel='fused')
        r.boundaries.x_min=r.boundaries.x_max=BoundaryFace(kind='bloch')
        r.bloch_phase=(.63,0,0)
        return Project(region=r,sources=[Source(center=(0,0,0),pulse='continuous')],
            monitors=[Monitor(center=(.1,0,0)),Monitor(center=(0,.1,0),component='Hy')])
    p=project((args.nx,args.ny,args.nz))
    options=StreamedAdjointOptions(device='cuda',state_storage='disk',state_directory=args.scratch,
        disk_budget_bytes=args.disk_gib*1024**3,disk_free_reserve_bytes=100*1024**3,
        host_budget_bytes=args.host_gib*1024**3,
        gpu_budget_bytes=args.gpu_gib*1024**3,slab_width=args.width,temporal_depth=args.depth,
        checkpoints=0,local_checkpoints=0)
    meta=torch.empty(p.region.shape,dtype=torch.float64,device='meta')
    reservation=estimate_streamed_memory(p,options)
    scratch=Path(args.scratch).resolve()
    scratch.mkdir(parents=True,exist_ok=True)
    disk_free=shutil.disk_usage(scratch).free
    ram_free=psutil.virtual_memory().available
    # Leave substantial system headroom even at the conservative reservation.
    disk_floor=100*1024**3
    ram_floor=16*1024**3
    if disk_free < options.disk_budget_bytes + disk_floor:
        raise RuntimeError('Disk budget would leave less than 100 GiB free.')
    if ram_free < options.host_budget_bytes + ram_floor:
        raise RuntimeError('Host budget would leave less than 16 GiB available RAM.')
    free,total=torch.cuda.mem_get_info()
    field_bytes=meta.numel()*6*16
    if field_bytes<=total and not args.smoke:raise ValueError('E/H alone must exceed physical VRAM for this benchmark.')
    record=dict(stage='admitted_not_executed',grid=p.region.shape,steps=args.steps,
        hardware=torch.cuda.get_device_name(),physical_vram_bytes=total,free_vram_bytes=free,
        eh_bytes=field_bytes,reservation=reservation,physical_vram_exceeded=field_bytes>total,
        driver_smoke=args.smoke,
        scratch_directory=str(scratch),initial_disk_free_bytes=disk_free,
        initial_available_ram_bytes=ram_free,disk_headroom_bytes=disk_floor,
        ram_headroom_bytes=ram_floor,
        source_sha256={path.name:hashlib.sha256(path.read_bytes()).hexdigest()
            for path in [Path(__file__),*sorted(Path(photonweave.__file__).parent.glob('*.py'))]},
        scope='Short complex FP64 capacity/VJP test. Only a non-smoke completed record exceeding physical VRAM is capacity evidence. No throughput superiority or converged application claim.')
    output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    def save():
        temp=output.with_suffix('.tmp')
        temp.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');temp.replace(output)
    save();print(json.dumps(record),flush=True)
    if not args.execute:return
    # 2*T cells conservatively bound the two radius-one curls per step.
    # The 56-cell oracle leaves >2*T cells from center to its CPML region,
    # while respecting the public two-million-cell-step autograd limit.
    small=project((56,56,56))
    small.region.memory_mode='resident'
    oracle_eps=torch.full(small.region.shape,1.7,dtype=torch.float64,device='cuda',requires_grad=True)
    oracle=DifferentiableSimulation(small).reference(oracle_eps)
    oracle_grad,=torch.autograd.grad(oracle.abs().square().sum(),oracle_eps)
    expected_signals=oracle.detach().cpu();expected_gradient=oracle_grad.cpu()
    del oracle,oracle_grad,oracle_eps
    gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize()
    stop=threading.Event();process=psutil.Process();peak=[process.memory_info().rss]
    def sample():
        while not stop.wait(.1):peak[0]=max(peak[0],process.memory_info().rss)
    sampler=threading.Thread(target=sample,daemon=True);sampler.start()
    started=time.perf_counter();torch.cuda.reset_peak_memory_stats()
    try:
        epsilon=torch.full(p.region.shape,1.7,dtype=torch.float64,requires_grad=True)
        result=StreamedSimulation(p,options)(epsilon)
        record.update(stage='forward_complete',forward_seconds=time.perf_counter()-started,
            signals_real_imag=torch.view_as_real(result.signals.detach()).tolist(),report=result.report)
        torch.testing.assert_close(result.signals,expected_signals,rtol=1e-10,atol=1e-12)
        save();print('Full beyond-VRAM forward complete, beginning VJP',flush=True)
        gradient,=torch.autograd.grad(result.signals.abs().square().sum(),epsilon)
        crop=tuple(slice(n//2-28,n//2+28) for n in p.region.shape)
        torch.testing.assert_close(gradient[crop],expected_gradient,rtol=1e-9,atol=1e-11)
        norm=torch.linalg.vector_norm(gradient)
        torch.testing.assert_close(norm,torch.linalg.vector_norm(expected_gradient),rtol=1e-9,atol=1e-11)
        if not bool(torch.isfinite(gradient).all()) or norm<=0:raise AssertionError('Invalid global gradient.')
        torch.cuda.synchronize()
        record.update(stage='forward_backward_validated',elapsed_seconds=time.perf_counter()-started,
            gradient_norm=float(norm),signal_max_abs_error=float((result.signals.detach()-expected_signals).abs().max()),
            gradient_crop_max_abs_error=float((gradient[crop]-expected_gradient).abs().max()),
            peak_torch_cuda_bytes=torch.cuda.max_memory_allocated(),peak_process_rss_bytes=peak[0],report=result.report)
        assert record['peak_torch_cuda_bytes']<total
        assert all(result.report[k+'_backing_store']['closed'] for k in ('forward','backward'))
        save();print(json.dumps(record),flush=True)
    except BaseException as exc:
        record.update(stage='failed',error=repr(exc),elapsed_seconds=time.perf_counter()-started,
                      peak_process_rss_bytes=peak[0]);save();raise
    finally:
        stop.set();sampler.join()


if __name__=='__main__':main()
