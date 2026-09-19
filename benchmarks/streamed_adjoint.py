"""Compare native resident and DRAM-streamed full first-order iterations."""
import argparse
import gc
import json
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
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    if args.repeats < 1:raise ValueError('repeats must be positive')
    region = Region(dimension='3d', size=(args.nx*.1, args.ny*.1, args.ny*.1),
                    mesh=.1, precision='float64', steps=args.steps, pml_cells=3)
    region.boundaries.x_min = BoundaryFace(kind='periodic')
    region.boundaries.x_max = BoundaryFace(kind='periodic')
    project = Project(region=region, sources=[Source(center=(-.2,0,0), pulse='continuous')],
                      monitors=[Monitor(center=(.2,0,0)), Monitor(center=(0,.1,0),component='Hy')])
    options = StreamedAdjointOptions(slab_width=args.width, temporal_depth=args.depth, checkpoints=2)
    models = {'resident':DifferentiableSimulation(project, AdjointOptions(checkpoints=2)),
              'streamed':StreamedSimulation(project, options)}
    records = {name:[] for name in models}
    outputs, gradients = {}, {}

    def iteration(name, record):
        gc.collect()
        torch.cuda.synchronize()
        torch.cuda.reset_peak_memory_stats()
        started = time.perf_counter()
        epsilon = torch.full(region.shape, 1.7, dtype=torch.float64,
                             device='cuda' if name == 'resident' else 'cpu', requires_grad=True)
        result = models[name](epsilon)
        loss = result.signals.square().sum()
        gradient, = torch.autograd.grad(loss, epsilon)
        torch.cuda.synchronize()
        row = dict(full_iteration_seconds=time.perf_counter()-started,
                   torch_cuda_peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                   report=result.report)
        outputs[name] = result.signals.detach().cpu()
        gradients[name] = gradient.detach().cpu()
        if record:records[name].append(row)

    for name in models:iteration(name, False)
    for repeat in range(args.repeats):
        for name in (('resident','streamed') if repeat%2 == 0 else ('streamed','resident')):
            iteration(name, True)
    torch.testing.assert_close(outputs['streamed'], outputs['resident'], rtol=1e-10, atol=1e-12)
    torch.testing.assert_close(gradients['streamed'], gradients['resident'], rtol=1e-9, atol=1e-11)
    denominator = torch.linalg.vector_norm(gradients['resident'])
    if denominator == 0:raise RuntimeError('Degenerate benchmark gradient')
    medians = {name:statistics.median(row['full_iteration_seconds'] for row in rows)
               for name,rows in records.items()}
    data = dict(device=torch.cuda.get_device_name(), torch_version=torch.__version__,
                cuda_version=torch.version.cuda, grid=region.shape, steps=region.steps,
                precision='float64', repeats=args.repeats, warmups_per_mode=1,
                median_seconds=medians, streamed_over_resident_time=medians['streamed']/medians['resident'],
                gradient_relative_l2=float(torch.linalg.vector_norm(gradients['streamed']-gradients['resident'])/denominator),
                records=records,
                scope='Native resident/streamed ablation, synchronous slab transfers. CUDA memory is Torch allocations only. No external solver speed claim or physical VRAM-overflow demonstration.')
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding='utf8')
    print(json.dumps({key:data[key] for key in ('median_seconds','streamed_over_resident_time','gradient_relative_l2')}))


if __name__ == '__main__':main()
