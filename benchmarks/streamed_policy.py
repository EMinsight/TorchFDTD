"""Check prefix-selected streamed policies against full-duration resident VJPs.

Calibration overlap is reported explicitly. This driver retains a resident
reference, so it is not evidence of execution beyond physical GPU capacity.
"""
import argparse
from dataclasses import replace
import gc
import hashlib
import json
import math
from pathlib import Path
import statistics
import time
from types import SimpleNamespace

import torch

from photonweave import (AdjointOptions, BoundaryFace, DifferentiableSimulation, Monitor, FieldMonitor, Project,
                        Region, Source, StreamedAdjointOptions, StreamedSimulation,
                        DispersiveSimulation, StreamedDispersiveSimulation,
                        tune_streamed, tune_streamed_dispersive,
                        AdjointExecutionPolicy, tune_adjoint_execution)


def evaluate(model, design, region, *, dispersive=False, spectrum=False, planes=False):
    """Return outputs and VJPs in well-scaled, shared material coordinates."""
    parameters = (design[0], design[1]*1e30, design[2]*1e15, design[3]*1e15) if dispersive else design
    if planes:
        output=model(*parameters,frequency_hz=[1.5e14,2e14,2.5e14])
        scale=region.steps*region.time_step
        values=torch.cat([p.fields.reshape(-1) for p in output.values()])/scale
        loss=values.abs().square().sum()
        for plane in output.values():
            normalized=replace(plane,fields=plane.fields/scale,weights=plane.weights/plane.weights.sum())
            loss=loss+normalized.flux().sum()
        gradients=torch.autograd.grad(loss,design)
        return SimpleNamespace(report=next(iter(output.values())).report),values.detach(),tuple(g.detach() for g in gradients)
    if spectrum:
        result = model.spectrum(*parameters, [1.5e14, 2e14, 2.5e14])
        values = result.fields/(region.steps*region.time_step)
    else:
        result = model(*parameters)
        values = result.signals
    gradients = torch.autograd.grad(values.abs().square().sum(), design)
    return result, values.detach(), tuple(g.detach() for g in gradients)


def compare(values, gradients, reference, dtype):
    tolerance = dict(rtol=2e-4, atol=3e-6) if dtype == torch.float32 else dict(rtol=2e-9, atol=2e-11)
    errors = []
    for actual, expected in zip((values, *gradients), reference):
        if not bool(torch.isfinite(actual).all()):raise AssertionError('Nonfinite benchmark output or gradient.')
        torch.testing.assert_close(actual, expected, **tolerance)
        norm = torch.linalg.vector_norm(expected)
        if norm <= 0:raise AssertionError('Degenerate benchmark output or parameter-gradient group.')
        errors.append(float(torch.linalg.vector_norm(actual-expected)/norm))
    return errors


def selection_metrics(tuning, medians, tuning_seconds):
    """Keep failed admission out of rankings and charge calibration explicitly."""
    selected = tuning['selected_index']
    measured = {i:t for i,t in enumerate(medians) if t is not None}
    best = min(measured, key=measured.get)
    baseline = min(measured)
    saved = medians[baseline]-medians[selected]
    longest = max(tuning['calibration_steps'])
    return dict(selected_index=selected, best_measured_index=best, baseline_index=baseline,
        selected_full_over_best=medians[selected]/medians[best],
        baseline_over_selected=medians[baseline]/medians[selected],
        tuning_payback_iterations=math.ceil(tuning_seconds/saved) if saved > 0 else None,
        held_out_duration=longest < tuning['full_steps'], longest_calibration_steps=longest)


def main(argv=None):
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
    parser.add_argument('--nz',type=int)
    parser.add_argument('--device',choices=('cpu','cuda'),default='cuda')
    parser.add_argument('--cpu-threads',type=int,default=4)
    parser.add_argument('--precision',choices=('float32','float64'),default='float64')
    parser.add_argument('--dispersive',action='store_true')
    parser.add_argument('--spectrum',action='store_true')
    parser.add_argument('--planes',action='store_true',help='Validate fixed detector fields and flux VJPs, requires --unified')
    parser.add_argument('--plane-stride',type=int,default=4)
    parser.add_argument('--checkpoint-tiles',action='store_true')
    parser.add_argument('--unified',action='store_true')
    parser.add_argument('--require-held-out',action='store_true')
    parser.add_argument('--complex-bloch',action='store_true')
    parser.add_argument('--capacity-tiles',action='store_true')
    parser.add_argument('--gpu-budget-gib',type=float,default=1/16)
    parser.add_argument('--host-budget-gib',type=float,default=8.)
    args = parser.parse_args(argv)
    if args.repeats < 1:raise ValueError('repeats must be positive')
    if args.cpu_threads < 1:raise ValueError('cpu-threads must be positive')
    if args.planes and not args.unified:raise ValueError('Plane policy validation requires --unified.')
    if args.plane_stride<1:raise ValueError('plane-stride must be positive')
    if args.planes:args.spectrum=True
    if args.unified and args.strategy!='replay_cost':raise ValueError('Unified selection requires replay_cost strategy.')
    if sum((args.deep_tiles,args.capacity_tiles,args.checkpoint_tiles))>1:raise ValueError('Select one policy family.')
    torch.set_num_threads(args.cpu_threads)
    region = Region(dimension='3d',size=(args.nx*.1,args.ny*.1,(args.nz or args.ny)*.1),mesh=.1,steps=args.steps,
                    precision=args.precision,pml_cells=3,cuda_kernel='fused' if args.device=='cuda' else 'torch')
    region.boundaries.x_min = BoundaryFace(kind='periodic')
    region.boundaries.x_max = BoundaryFace(kind='periodic')
    if args.complex_bloch:
        region.boundaries.x_min.kind=region.boundaries.x_max.kind='bloch'
        region.bloch_phase=(.63,0,0)
    project = Project(region=region,sources=[Source(center=(-.2,0,0),pulse='continuous')],
                      monitors=[Monitor(center=(.2,0,0)),Monitor(center=(0,.1,0),component='Hy')])
    if args.planes:
        size=(0,(region.shape[1]-8)*region.mesh,(region.shape[2]-8)*region.mesh)
        project.monitors=[FieldMonitor(id='near',center=(.2,0,0),size=size,normal='x',downsample=args.plane_stride),
                          FieldMonitor(id='far',center=(.3,0,0),size=size,normal='x',downsample=args.plane_stride)]
        project=Project.model_validate(project.model_dump())
    dtype = getattr(torch,args.precision)
    epsilon = torch.full(region.shape,1.7,dtype=dtype,requires_grad=True)
    design = (epsilon,)
    if args.dispersive:
        # Two poles include a Drude limit and a Lorentz resonance. Coordinates
        # stay O(1), so SI-scale gradients cannot silently pass absolute checks.
        design += tuple(torch.tensor(v,dtype=dtype,requires_grad=True) for v in ([.7,.4],[0.,1.8],.2))
    base = StreamedAdjointOptions(device=args.device,slab_width=8,temporal_depth=1,
        gpu_budget_bytes=int(args.gpu_budget_gib*1024**3),host_budget_bytes=int(args.host_budget_gib*1024**3))
    def asynchronous(policy):
        return replace(policy,tile_transfers='async',tile_buffers=2) if args.device=='cuda' else policy
    candidates = [base,replace(base,slab_width=16,temporal_depth=3),
                  replace(base,slab_width=32,temporal_depth=4),
                  asynchronous(replace(base,slab_width=32,temporal_depth=4))]
    if args.deep_tiles:
        candidates = [replace(base,slab_width=16,temporal_depth=8),
                      replace(base,slab_width=32,temporal_depth=16),
                      replace(base,slab_width=32,temporal_depth=32),
                      replace(base,slab_width=32,temporal_depth=32,local_checkpoints=1)]
    if args.capacity_tiles:
        if args.deep_tiles:raise ValueError('Select either deep-tiles or capacity-tiles.')
        candidates=[replace(base,slab_width=16,temporal_depth=4),
                    replace(base,slab_width=32,temporal_depth=8),
                    asynchronous(replace(base,slab_width=32,temporal_depth=8)),
                    asynchronous(replace(base,slab_width=64,temporal_depth=8))]
    if args.checkpoint_tiles:
        baseline = replace(base,slab_width=16,temporal_depth=4)
        wider = replace(baseline,slab_width=32,temporal_depth=8)
        candidates = [baseline,wider,asynchronous(wider),
                      replace(wider,local_checkpoints=1),replace(wider,checkpoints=0),replace(wider,checkpoints=4)]
    candidates = list(dict.fromkeys(candidates))
    if args.unified:
        resident=AdjointOptions(checkpoints=base.checkpoints,gpu_budget_bytes=base.gpu_budget_bytes,
            host_budget_bytes=base.host_budget_bytes,backward_kernel='fused' if args.device=='cuda' else 'torch')
        resident_policies=[resident,replace(resident,checkpoints=0)]
        if args.device=='cuda':resident_policies.append(replace(resident,storage='host',checkpoint_transfers='async'))
        candidates=([AdjointExecutionPolicy(resident=p,device=args.device,host_budget_bytes=base.host_budget_bytes)
                     for p in resident_policies]+
                    [AdjointExecutionPolicy(streamed=p,device=args.device,host_budget_bytes=base.host_budget_bytes)
                     for p in candidates])
    # Validate the intended holdout before any calibration or field allocation.
    from photonweave.streamed_tuning import _calibration_lengths
    possible = [_calibration_lengths(region.steps,args.probe_steps,p.temporal_depth,args.strategy,512) for p in candidates]
    maximum = max(min(region.steps,(2 if args.refine_candidates and args.strategy=='replay_cost' else 1)*max(v)) for v in possible)
    if args.require_held_out and maximum >= region.steps:
        raise ValueError('Calibration can reach the target duration. Increase steps or reduce probe/depth/refinement.')
    path = Path(args.output)
    path.parent.mkdir(parents=True,exist_ok=True)
    root = Path(__file__).resolve().parents[1]
    data = dict(stage='tuning',full_steps=region.steps,grid=region.shape,
        precision=args.precision,dispersive=args.dispersive,spectrum=args.spectrum,unified_selection=args.unified,
        fixed_planes=args.planes,plane_stride=args.plane_stride if args.planes else None,
        complex_bloch=args.complex_bloch,bloch_phase=region.bloch_phase,
        torch_version=torch.__version__,device=args.device,cpu_threads=torch.get_num_threads(),
        hardware=torch.cuda.get_device_name() if args.device=='cuda' else 'CPU',
        source_sha256={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest()
            for p in [Path(__file__).resolve(),*sorted((root/'photonweave').glob('*.py'))]},
        gradient_coordinates=['epsilon_inf','strength / 1e30','omega0 / 1e15','gamma / 1e15'] if args.dispersive else ['epsilon'],
        eh_material_state_bytes=math.prod(region.shape)*6*(3 if args.dispersive else 1)*epsilon.element_size()*(2 if region.complex_fields else 1),
        state_size_scope='E/H and two-pole P/Q only, excludes CPML, workspaces, checkpoints and observations.',
        full_records=[[] for _ in candidates],warmups_per_full_policy=1,repeats=args.repeats,
        scope='Native resident-reference policy calibration check. Full timers include model construction, material scaling/packing, '
              'forward, observation proxy objective, replay and backward. Input allocation, oracle, checks and final host copies excluded. '
              'Tuning wall time includes planning and comparison. Torch peaks exclude context and non-Torch allocations. '
              'No beyond-VRAM, physical optical-convergence, complete optimizer or external-solver claim.')
    if args.unified:
        data['scope']+=' Unified resident candidates include differentiable CPU-to-GPU input and CPU output/gradient transfers in their timed operation.'
    def save():
        temp=path.with_suffix('.tmp');temp.write_bytes((json.dumps(data,indent=2)+'\n').encode('utf8'));temp.replace(path)
    save()
    try:
        started = time.perf_counter()
        parameters = (epsilon,design[1]*1e30,design[2]*1e15,design[3]*1e15) if args.dispersive else design
        tune = tune_adjoint_execution if args.unified else tune_streamed_dispersive if args.dispersive else tune_streamed
        tuning = tune(project,*parameters,candidates=candidates,probe_steps=args.probe_steps,repeats=args.repeats,
            **({} if args.unified else dict(strategy=args.strategy)),refine_candidates=args.refine_candidates,
            frequency_hz=[1.5e14,2e14,2.5e14] if args.spectrum else None)
        del parameters
        data.update(tuning=tuning.report,tuning_wall_seconds=time.perf_counter()-started,stage='resident_reference')
        save()
        print(f'Tuning complete: selected {tuning.report["selected_index"]}, resident reference next',flush=True)
        reference_design = tuple(v.detach().to(args.device).requires_grad_() for v in design)
        resident = DispersiveSimulation if args.dispersive else DifferentiableSimulation
        if args.planes:
            from photonweave import DifferentiablePlaneSimulation, DispersivePlaneSimulation
            resident=DispersivePlaneSimulation if args.dispersive else DifferentiablePlaneSimulation
        reference_model = resident(project,AdjointOptions(backward_kernel='fused' if args.device=='cuda' else 'torch'))
        reference_result,values,gradients = evaluate(reference_model,reference_design,region,
            dispersive=args.dispersive,spectrum=args.spectrum,planes=args.planes)
        reference = tuple(t.detach().cpu().clone() for t in (values,*gradients))
        compare(reference[0],reference[1:],reference,dtype)
        del reference_design,reference_model,reference_result,values,gradients
        data.update(stage='full_duration_validation',reference_gradient_norms=[float(torch.linalg.vector_norm(g)) for g in reference[1:]])
        save()
        feasible = [row['index'] for row in tuning.report['candidates'] if row['status']=='measured']
        records = data['full_records']
        def iteration(index, record):
            gc.collect()
            if args.device=='cuda':
                torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
            started = time.perf_counter()
            streamed = StreamedDispersiveSimulation if args.dispersive else StreamedSimulation
            model = candidates[index].simulation(project,dispersive=args.dispersive) if args.unified else streamed(project,candidates[index])
            result,values,gradients = evaluate(model,design,region,dispersive=args.dispersive,spectrum=args.spectrum,planes=args.planes)
            if args.device=='cuda':torch.cuda.synchronize()
            elapsed = time.perf_counter()-started
            errors = compare(values,gradients,reference,dtype)
            if record:
                records[index].append(dict(seconds=elapsed,report=result.report,relative_l2_output_and_gradients=errors,
                    peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated() if args.device=='cuda' else 0))
                save()
            print(f'candidate {index}: {elapsed:.3f}s, measured={record}',flush=True)
        for index in feasible:iteration(index,False)
        for repeat in range(args.repeats):
            for index in (feasible if repeat%2==0 else reversed(feasible)):iteration(index,True)
        medians = [statistics.median(row['seconds'] for row in rows) if rows else None for rows in records]
        metrics = selection_metrics(tuning.report,medians,data['tuning_wall_seconds'])
        data.update(stage='complete',full_median_seconds=medians,**metrics)
        save();print(json.dumps(dict(full_medians=medians,tuning_wall_seconds=data['tuning_wall_seconds'],**metrics)),flush=True)
    except BaseException as exc:
        data.update(stage='failed',error=repr(exc));save();raise
    return data


if __name__ == '__main__':main()
