"""Compare native resident and DRAM-streamed full first-order iterations."""
import argparse
from dataclasses import replace
import gc
import json
import os
import platform
from pathlib import Path
import statistics
import time

import torch

from photonweave import (AdjointOptions, BoundaryFace, DifferentiableSimulation,
                        Monitor, Project, Region, Source, StreamedAdjointOptions,
                        StreamedSimulation)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--nx', type=int, default=64)
    parser.add_argument('--ny', type=int, default=16)
    parser.add_argument('--steps', type=int, default=24)
    parser.add_argument('--width', type=int, default=8)
    parser.add_argument('--depth', type=int, default=3)
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--compare-bindings', action='store_true')
    parser.add_argument('--compare-transfers', action='store_true')
    parser.add_argument('--compare-local-checkpoints', action='store_true')
    parser.add_argument('--complex-bloch', action='store_true')
    parser.add_argument('--compare-cpu', action='store_true')
    parser.add_argument('--cpu-threads', type=int, default=8)
    parser.add_argument('--gpu-budget-gib', type=float, default=1.)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    if args.repeats < 1:raise ValueError('repeats must be positive')
    if args.cpu_threads<1:raise ValueError('cpu-threads must be positive')
    if args.compare_cpu:torch.set_num_threads(args.cpu_threads)
    region = Region(dimension='3d', size=(args.nx*.1, args.ny*.1, args.ny*.1),
                    mesh=.1, precision='float64', steps=args.steps, pml_cells=3)
    region.boundaries.x_min = BoundaryFace(kind='periodic')
    region.boundaries.x_max = BoundaryFace(kind='periodic')
    if args.complex_bloch:
        region.boundaries.x_min.kind = region.boundaries.x_max.kind = 'bloch'
        region.bloch_phase = (.63,0,0)
        region.cuda_kernel = 'fused'
    project = Project(region=region, sources=[Source(center=(-.2,0,0), pulse='continuous')],
                      monitors=[Monitor(center=(.2,0,0)), Monitor(center=(0,.1,0),component='Hy')])
    options = StreamedAdjointOptions(slab_width=args.width, temporal_depth=args.depth, checkpoints=2,
                                    gpu_budget_bytes=int(args.gpu_budget_gib*1024**3))
    models = {'resident':DifferentiableSimulation(project, AdjointOptions(checkpoints=2,backward_kernel='fused')),
              'streamed':StreamedSimulation(project, options)}
    if args.compare_cpu:
        models['cpu_dram']=DifferentiableSimulation(project,AdjointOptions(checkpoints=2,backward_kernel='torch'))
    if args.compare_bindings:
        models['streamed_direct_unreused'] = StreamedSimulation(project, replace(options, reuse_tile_buffers=False))
        models['streamed_dlpack'] = StreamedSimulation(project, replace(options, cuda_binding='dlpack', reuse_tile_buffers=False))
    if args.compare_transfers:
        models['streamed_async'] = StreamedSimulation(project, replace(options, tile_transfers='async', tile_buffers=2))
    if args.compare_local_checkpoints:
        for count in (1,2,4):
            models[f'streamed_local_{count}'] = StreamedSimulation(project,replace(options,local_checkpoints=count))
    records = {name:[] for name in models}
    outputs, gradients = {}, {}

    def iteration(name, record):
        gc.collect()
        torch.cuda.synchronize()
        baseline = torch.cuda.memory_allocated()
        torch.cuda.reset_peak_memory_stats()
        started = time.perf_counter()
        epsilon = torch.full(region.shape, 1.7, dtype=torch.float64,
                             device='cuda' if name == 'resident' else 'cpu', requires_grad=True)
        result = models[name](epsilon)
        torch.cuda.synchronize()
        forward_end=time.perf_counter()
        loss = result.signals.abs().square().sum()
        gradient, = torch.autograd.grad(loss, epsilon)
        torch.cuda.synchronize()
        finished=time.perf_counter()
        row = dict(full_iteration_seconds=finished-started,
                   forward_seconds=forward_end-started,objective_backward_seconds=finished-forward_end,
                   torch_cuda_baseline_allocated_bytes=baseline,
                   torch_cuda_peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                   report=result.report)
        outputs[name] = result.signals.detach().cpu()
        gradients[name] = gradient.detach().cpu()
        if name != 'resident':
            torch.testing.assert_close(outputs[name], outputs['resident'], rtol=1e-10, atol=1e-12)
            torch.testing.assert_close(gradients[name], gradients['resident'], rtol=1e-9, atol=1e-11)
            row['signal_max_abs_difference'] = float((outputs[name]-outputs['resident']).abs().max())
            row['gradient_max_abs_difference'] = float((gradients[name]-gradients['resident']).abs().max())
        print(f'{name}: {row["full_iteration_seconds"]:.3f}s, peak={row["torch_cuda_peak_allocated_bytes"]}, measured={record}',flush=True)
        if record:records[name].append(row)

    for name in models:iteration(name, False)
    for repeat in range(args.repeats):
        for name in (tuple(models) if repeat%2 == 0 else tuple(reversed(models))):
            iteration(name, True)
    for name in models:
        torch.testing.assert_close(outputs[name], outputs['resident'], rtol=1e-10, atol=1e-12)
        torch.testing.assert_close(gradients[name], gradients['resident'], rtol=1e-9, atol=1e-11)
    denominator = torch.linalg.vector_norm(gradients['resident'])
    if denominator == 0:raise RuntimeError('Degenerate benchmark gradient')
    medians = {name:statistics.median(row['full_iteration_seconds'] for row in rows)
               for name,rows in records.items()}
    data = dict(device=torch.cuda.get_device_name(), torch_version=torch.__version__,
                cpu_model=platform.processor() or os.environ.get('PROCESSOR_IDENTIFIER','unknown'),
                cpu_threads=torch.get_num_threads(),cpu_thread_policy='Explicit fixed count, not tuned to the fastest CPU configuration.',
                cuda_version=torch.version.cuda, grid=region.shape, steps=region.steps,
                precision='float64', repeats=args.repeats, warmups_per_mode=1,
                complex_bloch=args.complex_bloch, bloch_phase=region.bloch_phase,
                median_seconds=medians, streamed_over_resident_time=medians['streamed']/medians['resident'],
                gradient_relative_l2=float(torch.linalg.vector_norm(gradients['streamed']-gradients['resident'])/denominator),
                records=records,
                scope='Native resident/streamed ablation. Per-mode reports identify bindings, reuse and transfer policy. CUDA memory is Torch allocations only. No external solver speed claim or physical VRAM-overflow demonstration.')
    if args.compare_cpu:
        data['cpu_dram_over_gpu_resident_time']=medians['cpu_dram']/medians['resident']
        data['cpu_dram_over_gpu_streamed_time']=medians['cpu_dram']/medians['streamed']
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding='utf8')
    print(json.dumps({key:data[key] for key in ('median_seconds','streamed_over_resident_time','gradient_relative_l2')}))


if __name__ == '__main__':main()
