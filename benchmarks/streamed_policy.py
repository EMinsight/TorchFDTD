"""Evaluate a prefix-selected streamed policy on a longer held-out duration."""
import argparse
from dataclasses import replace
import gc
import json
from pathlib import Path
import statistics
import time

import torch

from photonweave import (AdjointOptions, BoundaryFace, DifferentiableSimulation, Monitor, Project,
                        Region, Source, StreamedAdjointOptions, StreamedSimulation,
                        tune_streamed)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True)
    parser.add_argument('--steps', type=int, default=48)
    parser.add_argument('--probe-steps', type=int, default=12)
    parser.add_argument('--repeats', type=int, default=2)
    parser.add_argument('--strategy', choices=('prefix','replay_cost'), default='replay_cost')
    parser.add_argument('--deep-tiles',action='store_true')
    parser.add_argument('--refine-candidates',type=int,default=0)
    parser.add_argument('--nx',type=int,default=64)
    parser.add_argument('--ny',type=int,default=16)
    parser.add_argument('--complex-bloch',action='store_true')
    parser.add_argument('--capacity-tiles',action='store_true')
    parser.add_argument('--gpu-budget-gib',type=float,default=1/16)
    args = parser.parse_args()
    if args.repeats < 1:raise ValueError('repeats must be positive')
    region = Region(dimension='3d',size=(args.nx*.1,args.ny*.1,args.ny*.1),mesh=.1,steps=args.steps,
                    precision='float64',pml_cells=3)
    region.boundaries.x_min = BoundaryFace(kind='periodic')
    region.boundaries.x_max = BoundaryFace(kind='periodic')
    if args.complex_bloch:
        region.boundaries.x_min.kind=region.boundaries.x_max.kind='bloch'
        region.bloch_phase=(.63,0,0)
        region.cuda_kernel='fused'
    project = Project(region=region,sources=[Source(center=(-.2,0,0),pulse='continuous')],
                      monitors=[Monitor(center=(.2,0,0)),Monitor(center=(0,.1,0),component='Hy')])
    epsilon = torch.full(region.shape,1.7,dtype=torch.float64,requires_grad=True)
    base = StreamedAdjointOptions(slab_width=8,temporal_depth=1,gpu_budget_bytes=int(args.gpu_budget_gib*1024**3))
    candidates = [base,replace(base,slab_width=16,temporal_depth=3),
                  replace(base,slab_width=32,temporal_depth=4),
                  replace(base,slab_width=32,temporal_depth=4,tile_transfers='async',tile_buffers=2)]
    if args.deep_tiles:
        candidates = [replace(base,slab_width=16,temporal_depth=8),
                      replace(base,slab_width=32,temporal_depth=16),
                      replace(base,slab_width=32,temporal_depth=32),
                      replace(base,slab_width=32,temporal_depth=32,local_checkpoints=1)]
    if args.capacity_tiles:
        if args.deep_tiles:raise ValueError('Select either deep-tiles or capacity-tiles.')
        candidates=[replace(base,slab_width=16,temporal_depth=4),
                    replace(base,slab_width=32,temporal_depth=8),
                    replace(base,slab_width=32,temporal_depth=8,tile_transfers='async',tile_buffers=2),
                    replace(base,slab_width=64,temporal_depth=8,tile_transfers='async',tile_buffers=2)]
    tuning = tune_streamed(project,epsilon,candidates=candidates,probe_steps=args.probe_steps,repeats=args.repeats,
                          strategy=args.strategy,refine_candidates=args.refine_candidates)
    reference_eps = epsilon.detach().to('cuda').requires_grad_()
    reference = DifferentiableSimulation(project,AdjointOptions(backward_kernel='fused'))(reference_eps)
    gradient, = torch.autograd.grad(reference.signals.abs().square().sum(),reference_eps)
    expected_signals, expected_gradient = reference.signals.detach().cpu(), gradient.cpu()
    del reference_eps, reference, gradient
    records = [[] for _ in candidates]
    def iteration(index, record):
        gc.collect()
        torch.cuda.synchronize()
        torch.cuda.reset_peak_memory_stats()
        started = time.perf_counter()
        result = StreamedSimulation(project,candidates[index])(epsilon)
        gradient, = torch.autograd.grad(result.signals.abs().square().sum(),epsilon)
        elapsed = time.perf_counter()-started
        torch.testing.assert_close(result.signals,expected_signals,rtol=1e-9,atol=1e-11)
        torch.testing.assert_close(gradient,expected_gradient,rtol=1e-8,atol=1e-10)
        if record:records[index].append(dict(seconds=elapsed,report=result.report,
                                             peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated()))
        print(f'candidate {index}: {elapsed:.3f}s, measured={record}',flush=True)
    for index in range(len(candidates)):iteration(index,False)
    for repeat in range(args.repeats):
        for index in (range(len(candidates)) if repeat%2 == 0 else reversed(range(len(candidates)))):
            iteration(index,True)
    medians = [statistics.median(row['seconds'] for row in rows) for rows in records]
    selected = tuning.report['selected_index']
    result = dict(tuning=tuning.report,full_steps=region.steps,grid=region.shape,
                  complex_bloch=args.complex_bloch,bloch_phase=region.bloch_phase,
                  full_records=records,full_median_seconds=medians,
                  selected_full_over_best=medians[selected]/min(medians),
                  scope='One held-out duration on one device. Includes tuning overhead separately. No optimality or external-solver claim.')
    path = Path(args.output)
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(result,indent=2),encoding='utf8')
    print(json.dumps(dict(selected=selected,full_medians=medians,
                         tuning_seconds=tuning.report['tuning_seconds'],selected_full_over_best=result['selected_full_over_best'])))


if __name__ == '__main__':main()
