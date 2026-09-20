"""ADE capacity/VJP validation above physical VRAM, with a finite-cone oracle.

The default E/H/P/Q state is 54 GiB before CPML. This short experiment does
not establish long-time optical accuracy or an out-of-core speed advantage.
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import shutil
import threading
import time

import psutil
import torch
import photonweave
from photonweave import (Region, Project, Source, Monitor, BoundaryFace,
    DispersiveSimulation, AdjointOptions, StreamedDispersiveSimulation,
    StreamedAdjointOptions, estimate_streamed_dispersive_memory)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',required=True)
    parser.add_argument('--scratch',required=True)
    parser.add_argument('--execute',action='store_true')
    parser.add_argument('--smoke',action='store_true',help='Driver check only, never capacity evidence')
    parser.add_argument('--nx',type=int,default=1024)
    parser.add_argument('--ny',type=int,default=768)
    parser.add_argument('--nz',type=int,default=384)
    parser.add_argument('--width',type=int,default=8)
    parser.add_argument('--depth',type=int,default=2)
    parser.add_argument('--gpu-gib',type=int,default=32)
    parser.add_argument('--host-gib',type=int,default=76)
    parser.add_argument('--disk-gib',type=int,default=280)
    args = parser.parse_args()
    if any(n < 64 or n % 2 for n in (args.nx,args.ny,args.nz)):
        raise ValueError('Use even dimensions at least 64 to preserve source alignment.')
    def project(shape):
        r = Region(dimension='3d',size=tuple(n*.1 for n in shape),mesh=.1,steps=10,
            precision='float64',pml_cells=3,memory_mode='streamed',cuda_kernel='fused')
        r.boundaries.x_min = r.boundaries.x_max = BoundaryFace(kind='bloch')
        r.bloch_phase = (.63,0,0)
        return Project(region=r,sources=[Source(center=(0,0,0),pulse='continuous')],
            monitors=[Monitor(center=(.1,0,0)),Monitor(center=(0,.1,0),component='Hy')])
    p = project((args.nx,args.ny,args.nz))
    disk_floor = (8 if args.smoke else 100)*1024**3
    ram_floor = (4 if args.smoke else 16)*1024**3
    options = StreamedAdjointOptions(device='cuda',state_storage='disk',state_directory=args.scratch,
        disk_budget_bytes=args.disk_gib*1024**3,disk_free_reserve_bytes=disk_floor,
        host_budget_bytes=args.host_gib*1024**3,gpu_budget_bytes=args.gpu_gib*1024**3,
        slab_width=args.width,temporal_depth=args.depth,checkpoints=0,local_checkpoints=0)
    reservation = estimate_streamed_dispersive_memory(p,(p.region.shape,(1,),(),()),options)
    scratch = Path(args.scratch).resolve();scratch.mkdir(parents=True,exist_ok=True)
    disk_free = shutil.disk_usage(scratch).free
    ram_free = psutil.virtual_memory().available
    if disk_free < options.disk_budget_bytes+disk_floor:
        raise RuntimeError(f'Disk budget would leave less than {disk_floor/1024**3:g} GiB free.')
    if ram_free < options.host_budget_bytes+ram_floor:
        raise RuntimeError(f'Host budget would leave less than {ram_floor/1024**3:g} GiB available RAM.')
    free,total = torch.cuda.mem_get_info()
    n = args.nx*args.ny*args.nz
    eh_bytes = n*6*16
    pq_bytes = eh_bytes
    if eh_bytes+pq_bytes <= total and not args.smoke:
        raise ValueError('E/H/P/Q must exceed physical VRAM for this benchmark.')
    record = dict(stage='admitted_not_executed',grid=p.region.shape,steps=10,oscillator_count=1,
        hardware=torch.cuda.get_device_name(),physical_vram_bytes=total,free_vram_bytes=free,
        eh_bytes=eh_bytes,pq_bytes=pq_bytes,reservation=reservation,
        physical_vram_exceeded=eh_bytes+pq_bytes>total,driver_smoke=args.smoke,
        scratch_directory=str(scratch),initial_disk_free_bytes=disk_free,initial_available_ram_bytes=ram_free,
        disk_headroom_bytes=disk_floor,ram_headroom_bytes=ram_floor,
        source_sha256={path.name:hashlib.sha256(path.read_bytes()).hexdigest()
            for path in [Path(__file__),*sorted(Path(photonweave.__file__).parent.glob('*.py'))]},
        scope='Short complex FP64 one-pole ADE capacity/VJP test. E/H and P/Q together exceed VRAM in the default case. Oracle uses checkpointed resident Torch ADE and a finite dependency cone. No long-time, optical-convergence or throughput-superiority claim.')
    output = Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    def save():
        temp=output.with_suffix('.tmp');temp.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');temp.replace(output)
    save()
    print(json.dumps({k:record[k] for k in ('stage','grid','eh_bytes','pq_bytes','reservation')}),flush=True)
    if not args.execute:return
    def material(epsilon,variables):
        return epsilon, variables[:1]*1e30, variables[1]*1e15, variables[2]*1e15
    # >2*T cells separate source and observation from the oracle CPML.
    # Material recurrence is pointwise and does not widen this dependency cone.
    small = project((56,56,56));small.region.memory_mode='resident';small.region.cuda_kernel='torch'
    eps_ref = torch.full(small.region.shape,1.7,dtype=torch.float64,device='cuda',requires_grad=True)
    theta_ref = torch.tensor([.8,1.4,.15],dtype=torch.float64,device='cuda',requires_grad=True)
    oracle = DispersiveSimulation(small,AdjointOptions(checkpoints=2,backward_kernel='torch'))(*material(eps_ref,theta_ref))
    grad_ref,rate_ref = torch.autograd.grad(oracle.signals.abs().square().sum(),(eps_ref,theta_ref))
    expected_signals=oracle.signals.detach().cpu();expected_gradient=grad_ref.cpu();expected_rates=rate_ref.cpu()
    del oracle,grad_ref,rate_ref,eps_ref,theta_ref
    gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize()
    process=psutil.Process();stop=threading.Event();peak=[process.memory_info().rss]
    def sample():
        while not stop.wait(.1):peak[0]=max(peak[0],process.memory_info().rss)
    sampler=threading.Thread(target=sample,daemon=True);sampler.start()
    started=time.perf_counter();torch.cuda.reset_peak_memory_stats()
    try:
        epsilon=torch.full(p.region.shape,1.7,dtype=torch.float64,requires_grad=True)
        theta=torch.tensor([.8,1.4,.15],dtype=torch.float64,requires_grad=True)
        result=StreamedDispersiveSimulation(p,options)(*material(epsilon,theta))
        torch.testing.assert_close(result.signals,expected_signals,rtol=1e-10,atol=1e-12)
        record.update(stage='forward_complete',forward_seconds=time.perf_counter()-started,report=result.report)
        save();print('ADE forward complete, beginning VJP',flush=True)
        gradient,rates=torch.autograd.grad(result.signals.abs().square().sum(),(epsilon,theta))
        crop=tuple(slice(n//2-28,n//2+28) for n in p.region.shape)
        torch.testing.assert_close(gradient[crop],expected_gradient,rtol=1e-9,atol=1e-11)
        torch.testing.assert_close(rates,expected_rates,rtol=1e-9,atol=1e-11)
        norm=torch.linalg.vector_norm(gradient)
        torch.testing.assert_close(norm,torch.linalg.vector_norm(expected_gradient),rtol=1e-9,atol=1e-11)
        if not bool(torch.isfinite(gradient).all()) or norm <= 0:raise AssertionError('Invalid global gradient.')
        torch.cuda.synchronize()
        record.update(stage='forward_backward_validated',elapsed_seconds=time.perf_counter()-started,
            gradient_norm=float(norm),material_gradient=rates.tolist(),oracle_material_gradient=expected_rates.tolist(),
            signal_max_abs_error=float((result.signals.detach()-expected_signals).abs().max()),
            gradient_crop_max_abs_error=float((gradient[crop]-expected_gradient).abs().max()),
            peak_torch_cuda_bytes=torch.cuda.max_memory_allocated(),peak_process_rss_bytes=peak[0],report=result.report)
        assert record['peak_torch_cuda_bytes'] < total
        assert all(result.report[k+'_backing_store']['closed'] for k in ('forward','backward'))
        save();print('ADE capacity and VJP validated',flush=True)
    except BaseException as exc:
        record.update(stage='failed',error=repr(exc),elapsed_seconds=time.perf_counter()-started,peak_process_rss_bytes=peak[0])
        save();raise
    finally:
        stop.set();sampler.join()


if __name__=='__main__':main()
