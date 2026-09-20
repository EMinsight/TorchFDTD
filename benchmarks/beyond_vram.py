"""Explicit physical-VRAM-overflow forward/VJP capacity validation.

The short-run local oracle uses finite stencil propagation from a point source.
It is a capacity/correctness check, not a converged photonic application.
"""
import argparse
import gc
import hashlib
import json
import math
import shutil
from pathlib import Path
import threading
import time

import psutil
import torch
import torchfdtd
from torchfdtd import (Region, Project, Source, Monitor, BoundaryFace,
    StreamedSimulation, StreamedAdjointOptions, DifferentiableSimulation,
    estimate_streamed_memory)


def field_storage_bytes(shape, precision='float32', complex_fields=False):
    item = torch.empty((), dtype=getattr(torch, precision)).element_size()
    return math.prod(shape)*6*item*(2 if complex_fields else 1)


def tensor_stats(value, chunk_elements=4*1024**2):
    """FP64 diagnostic reduction with bounded scratch, without casting fields.

    Solver and gradient storage retain their selected precision. Double
    accumulation belongs only to the verification statistic.
    """
    if not value.is_contiguous():
        raise ValueError('Chunked global gradient verification requires contiguous storage.')
    total, nonzero = 0., 0
    flat = value.detach().view(-1)
    for begin in range(0, flat.numel(), chunk_elements):
        block = flat[begin:begin+chunk_elements]
        if not bool(torch.isfinite(block).all()):
            raise AssertionError('Nonfinite value in global gradient.')
        norm = float(torch.linalg.vector_norm(block, dtype=torch.float64))
        total += norm*norm
        nonzero += int(torch.count_nonzero(block))
    return math.sqrt(total), nonzero


def relative_error(actual, expected):
    reference = float(torch.linalg.vector_norm(expected.double()))
    if not math.isfinite(reference) or reference <= 0:
        raise AssertionError('Reference comparison group must be finite and nonzero.')
    error = float(torch.linalg.vector_norm(actual.double()-expected.double()))/reference
    if not math.isfinite(error):raise AssertionError('Nonfinite comparison error.')
    return error


def main(argv=None):
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--scratch',required=True)
    parser.add_argument('--execute',action='store_true')
    parser.add_argument('--smoke',action='store_true',help='Driver check only, never capacity evidence')
    parser.add_argument('--nx',type=int,default=1152)
    parser.add_argument('--ny',type=int,default=1024)
    parser.add_argument('--nz',type=int,default=2048)
    parser.add_argument('--precision',choices=['float32','float64'],default='float32')
    parser.add_argument('--fields',choices=['real','complex'],default='real')
    parser.add_argument('--steps',type=int,default=10)
    parser.add_argument('--width',type=int,default=4)
    parser.add_argument('--depth',type=int,default=2)
    parser.add_argument('--gpu-gib',type=int,default=32)
    parser.add_argument('--host-gib',type=int,default=88)
    parser.add_argument('--disk-gib',type=int,default=280)
    args=parser.parse_args(argv)
    dtype=getattr(torch,args.precision)
    tolerance=2e-4 if dtype==torch.float32 else 1e-9
    if not 10<=args.steps<=11:raise ValueError('This local-cone oracle supports 10 to 11 steps.')
    if any(n<64 or n%2 for n in (args.nx,args.ny,args.nz)):
        raise ValueError('Use even dimensions at least 64 to preserve source alignment.')
    def project(shape):
        r=Region(dimension='3d',size=tuple(n*.1 for n in shape),mesh=.1,steps=args.steps,
            precision=args.precision,pml_cells=3,memory_mode='streamed',cuda_kernel='fused')
        r.boundaries.x_min=r.boundaries.x_max=BoundaryFace(kind='bloch' if args.fields=='complex' else 'periodic')
        r.bloch_phase=(.63 if args.fields=='complex' else 0.,0,0)
        return Project(region=r,sources=[Source(center=(0,0,0),pulse='continuous')],
            monitors=[Monitor(center=(.1,0,0)),Monitor(center=(0,.1,0),component='Hy')])
    p=project((args.nx,args.ny,args.nz))
    options=StreamedAdjointOptions(device='cuda',state_storage='disk',state_directory=args.scratch,
        disk_budget_bytes=args.disk_gib*1024**3,disk_free_reserve_bytes=100*1024**3,
        host_budget_bytes=args.host_gib*1024**3,
        gpu_budget_bytes=args.gpu_gib*1024**3,slab_width=args.width,temporal_depth=args.depth,
        checkpoints=0,local_checkpoints=0)
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
    field_bytes=field_storage_bytes(p.region.shape,args.precision,p.region.complex_fields)
    if field_bytes<=total and not args.smoke:raise ValueError('E/H alone must exceed physical VRAM for this benchmark.')
    record=dict(stage='admitted_not_executed',grid=p.region.shape,steps=args.steps,
        hardware=torch.cuda.get_device_name(),physical_vram_bytes=total,free_vram_bytes=free,
        eh_bytes=field_bytes,reservation=reservation,physical_vram_exceeded=field_bytes>total,
        driver_smoke=args.smoke,precision=args.precision,complex_fields=p.region.complex_fields,
        comparison_tolerance_relative_l2=tolerance,
        scratch_directory=str(scratch),initial_disk_free_bytes=disk_free,
        initial_available_ram_bytes=ram_free,disk_headroom_bytes=disk_floor,
        ram_headroom_bytes=ram_floor,
        source_sha256={path.name:hashlib.sha256(path.read_bytes()).hexdigest()
            for path in [Path(__file__),*sorted(Path(torchfdtd.__file__).parent.glob('*.py'))]},
        scope='Short selected-precision capacity/VJP test. Only a non-smoke completed record with E/H exceeding physical VRAM is capacity evidence. No throughput superiority or converged application claim.')
    output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    def save():
        temp=output.with_suffix('.tmp')
        temp.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8');temp.replace(output)
    save();print(json.dumps({k:record[k] for k in ('stage','grid','precision','complex_fields','eh_bytes','reservation')}),flush=True)
    if not args.execute:return
    # 2*T cells conservatively bound the two radius-one curls per step.
    # The 56-cell oracle leaves >2*T cells from center to its CPML region,
    # while respecting the public two-million-cell-step autograd limit.
    small=project((56,56,56))
    small.region.memory_mode='resident'
    oracle_eps=torch.full(small.region.shape,1.7,dtype=dtype,device='cuda',requires_grad=True)
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
        epsilon=torch.full(p.region.shape,1.7,dtype=dtype,requires_grad=True)
        result=StreamedSimulation(p,options)(epsilon)
        record.update(stage='forward_complete',forward_seconds=time.perf_counter()-started,
            signals_real=result.signals.detach().real.tolist(),
            signals_imag=result.signals.detach().imag.tolist() if result.signals.is_complex() else None,
            report=result.report)
        # Compare real and imaginary parts together without dropping a component.
        signal_actual=torch.view_as_real(result.signals.detach()) if result.signals.is_complex() else result.signals.detach()
        signal_expected=torch.view_as_real(expected_signals) if expected_signals.is_complex() else expected_signals
        signal_error=relative_error(signal_actual,signal_expected)
        if signal_error>tolerance:raise AssertionError('Full signal relative error exceeds the preset limit.')
        save();print('Full beyond-VRAM forward complete, beginning VJP',flush=True)
        gradient,=torch.autograd.grad(result.signals.abs().square().sum(),epsilon)
        crop=tuple(slice(n//2-28,n//2+28) for n in p.region.shape)
        crop_error=relative_error(gradient[crop],expected_gradient)
        norm,nonzero=tensor_stats(gradient)
        reference_norm,_=tensor_stats(expected_gradient.contiguous())
        outside_cone_nonzero=nonzero-int(torch.count_nonzero(gradient[crop]))
        norm_error=abs(norm-reference_norm)/reference_norm
        if norm<=0 or max(crop_error,norm_error)>tolerance or outside_cone_nonzero:
            raise AssertionError('Global/cropped gradient comparison exceeded its relative limit.')
        torch.cuda.synchronize()
        record.update(stage='forward_backward_validated',elapsed_seconds=time.perf_counter()-started,
            gradient_norm=norm,comparison_errors=dict(signal_relative_l2=signal_error,
                gradient_crop_relative_l2=crop_error,gradient_norm_relative_error=norm_error,
                outside_cone_nonzero=outside_cone_nonzero),
            signal_max_abs_error=float((result.signals.detach()-expected_signals).abs().max()),
            gradient_crop_max_abs_error=float((gradient[crop]-expected_gradient).abs().max()),
            peak_torch_cuda_bytes=torch.cuda.max_memory_allocated(),peak_process_rss_bytes=peak[0],report=result.report)
        assert record['peak_torch_cuda_bytes']<total
        assert all(result.report[k+'_backing_store']['closed'] for k in ('forward','backward'))
        save();print(json.dumps(dict(stage=record['stage'],seconds=record['elapsed_seconds'],errors=record['comparison_errors'])),flush=True)
    except BaseException as exc:
        record.update(stage='failed',error=repr(exc),elapsed_seconds=time.perf_counter()-started,
                      peak_process_rss_bytes=peak[0]);save();raise
    finally:
        stop.set();sampler.join()


if __name__=='__main__':main()
