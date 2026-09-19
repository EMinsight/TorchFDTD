"""Opt-in DRAM capacity smoke test, not physical-VRAM-overflow evidence."""
import argparse
from dataclasses import replace
import gc
import json
from pathlib import Path
import time

import torch

from photonweave import Region, Project, Source, Monitor, StreamedSimulation, StreamedAdjointOptions


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--steps',type=int,default=10)
    parser.add_argument('--width',type=int,default=8)
    parser.add_argument('--depth',type=int,default=1)
    parser.add_argument('--local-checkpoints',type=int,default=0)
    parser.add_argument('--gpu-budget-mib',type=int,default=512)
    parser.add_argument('--host-budget-gib',type=int,default=12)
    args = parser.parse_args()
    region = Region(dimension='3d',size=(25.6,25.6,12.8),mesh=.1,steps=args.steps,
                    precision='float32',pml_cells=3,memory_mode='streamed')
    project = Project(region=region,sources=[Source(center=(0,0,0),pulse='continuous')],
                      monitors=[Monitor(center=(.1,0,0)),Monitor(center=(0,.1,0),component='Hy')])
    epsilon = torch.full(region.shape,1.7,dtype=torch.float32,requires_grad=True)
    base = StreamedAdjointOptions(slab_width=args.width,temporal_depth=args.depth,checkpoints=1,
                                 local_checkpoints=args.local_checkpoints,
                                 gpu_budget_bytes=args.gpu_budget_mib*1024**2,host_budget_bytes=args.host_budget_gib*1024**3)
    policies = [base,replace(base,slab_width=2*args.width,temporal_depth=2*args.depth)]
    reference = None
    records = []
    for policy in policies:
        gc.collect()
        torch.cuda.empty_cache()
        torch.cuda.synchronize()
        torch.cuda.reset_peak_memory_stats()
        started = time.perf_counter()
        result = StreamedSimulation(project,policy)(epsilon)
        gradient, = torch.autograd.grad(result.signals.square().sum(),epsilon)
        elapsed = time.perf_counter()-started
        assert torch.isfinite(gradient).all() and torch.linalg.vector_norm(gradient)>0
        assert torch.isfinite(result.signals).all() and torch.linalg.vector_norm(result.signals)>0
        if reference is None:
            reference = (result.signals.detach().clone(),gradient.clone())
            error = None
        else:
            torch.testing.assert_close(result.signals,reference[0],rtol=5e-5,atol=2e-6)
            torch.testing.assert_close(gradient,reference[1],rtol=5e-5,atol=2e-6)
            error = float(torch.linalg.vector_norm(gradient-reference[1])/torch.linalg.vector_norm(reference[1]))
        row = dict(seconds=elapsed,peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),
                   gradient_relative_l2=error,gradient_norm=float(torch.linalg.vector_norm(gradient)),
                   signal_norm=float(torch.linalg.vector_norm(result.signals.detach())),report=result.report)
        assert row['peak_cuda_allocated_bytes'] <= result.report['gpu_reservation_bytes'] <= policy.gpu_budget_bytes
        records.append(row)
        print(json.dumps(dict(slab_width=policy.slab_width,seconds=elapsed,peak_cuda=row['peak_cuda_allocated_bytes'])),flush=True)
        del gradient,result
    output = dict(grid=region.shape,cells=epsilon.numel(),steps=region.steps,
                  hardware=torch.cuda.get_device_name(),torch_version=torch.__version__,records=records,
                  scope='Single cold iteration per policy. Agreement between two streamed policies, not independent large-grid physics validation. Exceeds the former scene cap, not physical GPU VRAM. Torch allocation peak excludes CUDA context and allocator cache.')
    path = Path(args.output)
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(output,indent=2),encoding='utf8')


if __name__ == '__main__':main()
