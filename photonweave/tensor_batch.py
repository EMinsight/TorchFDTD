"""Fixed-duration, single-device batched CUDA simulation through native projects.

Unlike BatchRunner's process pool, a cohort shares E/H/source/trace launches.
Use BatchRunner for incompatible grids, complex Bloch fields, per-case decay
termination, overlapping sources, fault isolation or checksum-validated resume.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
from pathlib import Path
import time
from collections import defaultdict

import fdtd
import numpy as np
import torch

from .batch import BatchCase, BatchItem, BatchReport
from .boundaries import YeeGrid
from .materials import configure_materials
from .models import Project
from .solver import ENGINE_LOCK, Result, estimate, voxelize, index_at, field_axes
from .field_monitors import FrequencyPlane,FrequencyUpdates
from .run_control import StateDiagnostics, DecayDecision, source_end_time
from .cuda_graph import CudaStepGraphs, observation_schedule, validate_graph_steps


def _topology(region):
    """Exact compatibility signature shared with the heterogeneous scheduler."""
    return (region.dimension, region.precision, region.steps, region.courant_factor,
            region.reference_step, region.time_step, region.rectangular_courant,
            region.mesh_type, region.mesh_steps is not None,region.interface_method,
            json.dumps(region.boundaries.model_dump(), sort_keys=True),
            tuple(region.pml_layers(axis, side) for axis in range(3) for side in range(2)),
            tuple(tuple(n) for n in region.mesh_nodes))


def run_tensor_batch(cases, *, objective=None, output_dir=None, keep_results=True,
                     device=0, memory_fraction=.6, cuda_graph=True, cancel=None, progress=None,
                     cohort_size=None, cuda_graph_steps=1):
    """Run independent compatible projects in fused CUDA cohorts of 1--64 cases.

    Accepts BatchCase or Project objects. Real float32/64, 2D/3D, periodic/CPML,
    matched graded nodes, multipole materials and native frequency planes are
    supported. Steps and grid topology must match. Auto shutoff is rejected,
    never silently disabled. A numerical failure aborts the cohort, while an
    invalid objective marks only its item failed. Cancellation stops all cases.
    Result.summary seconds/setup_seconds describe the whole cohort, not a
    per-case latency. Results retain native Python/NPZ field and spectrum APIs.
    An explicit cohort_size splits a larger ensemble into consecutive cohorts.
    Use tune_tensor_batch for an explicit measured size selection. Existing
    result files are never overwritten.
    cuda_graph_steps optionally unrolls 1--64 unchanged time steps per replay.
    Snapshots, diagnostics and progress callbacks remain exact barriers.
    Cancellation is polled between replays, at most that many steps apart.
    """
    validate_graph_steps(cuda_graph_steps, cuda_graph)
    cases=list(cases)
    if not cases:raise ValueError('Tensor batch requires at least one case.')
    if cohort_size is None:cohort_size=len(cases)
    if isinstance(cohort_size,bool) or not isinstance(cohort_size,int) or not 1<=cohort_size<=64:
        raise ValueError('cohort_size must be an integer from 1 to 64. Split larger ensembles explicitly.')
    cases=[BatchCase(f'case-{i:04d}',case) if isinstance(case,Project) else case for i,case in enumerate(cases)]
    if any(not isinstance(c,BatchCase) for c in cases):raise TypeError('Supply BatchCase or Project instances.')
    if len({c.id for c in cases})!=len(cases):raise ValueError('Duplicate case ids.')
    root=Path(output_dir) if output_dir is not None else None
    if root and ((root/'tensor-batch.json').exists() or any((root/(c.id+'.npz')).exists() for c in cases)):
        raise FileExistsError('Tensor batch output exists. Use a new directory. Resume is supported by BatchRunner.')
    if not 0<memory_fraction<=.9:raise ValueError('memory_fraction must be positive and at most .9.')
    if not torch.cuda.is_available():raise RuntimeError('Tensor batch requires CUDA.')
    if not isinstance(device,int) or not 0<=device<torch.cuda.device_count():raise ValueError('Invalid CUDA device.')
    projects=[Project.model_validate(c.project.model_dump()) for c in cases]
    for p in projects:
        p.region.require_resident()
        if p.region.backend=='cpu':raise ValueError('Tensor batch cannot execute a CPU project. Set backend="cuda" or "auto" explicitly.')
        if p.region.complex_fields:raise ValueError('Tensor batch currently requires real fields. Use BatchRunner for complex Bloch fields.')
        if p.region.run_control.auto_shutoff:raise ValueError('Tensor batch requires fixed-duration runs. Set auto_shutoff=False or use BatchRunner.')
    with ENGINE_LOCK,torch.cuda.device(device):
        old_dtype=torch.get_default_dtype()
        try:
            start=time.perf_counter();items=[];plans=[]
            for offset in range(0,len(cases),cohort_size):
                if cancel is not None and cancel.is_set() and offset:
                    items.extend(BatchItem(c.id,'cancelled',c.parameters) for c in cases[offset:])
                    break
                cohort=cases[offset:offset+cohort_size]
                def on_progress(state):
                    if progress:progress(dict(state,cohort_offset=offset,total_cases=len(cases)))
                report=_run(cohort,projects[offset:offset+cohort_size],objective,root,keep_results,
                            memory_fraction,cuda_graph,cancel,on_progress if progress else None,cuda_graph_steps)
                items.extend(report.items);plans.append(report.plan)
            plan=plans[0] if len(plans)==1 else dict(execution='fused_cuda_cohorts',cohorts=plans,
                batch_size=len(cases),loop_seconds=sum(p['loop_seconds'] for p in plans),
                setup_seconds=sum(p['setup_seconds'] for p in plans),resume=False)
            plan=dict(plan,total_cases=len(cases),cohort_size=cohort_size,cohorts_completed=len(plans))
            report=BatchReport(items,time.perf_counter()-start,plan)
            if root:
                from .batch import _write_json
                _write_json(root/'tensor-batch.json',report.as_dict())
            return report
        finally:
            fdtd.set_backend('numpy');fdtd.backend.float=np.float64
            torch.set_default_dtype(old_dtype)


def _run(cases,projects,objective,output_dir,keep_results,memory_fraction,cuda_graph,cancel,progress,cuda_graph_steps):
    from .cuda_batch import FusedBatchYeeCUDA,FusedBatchIO
    started=time.perf_counter();wall_started=time.time()
    stats=[estimate(p) for p in projects]
    first=projects[0].region
    baseline=_topology(first)
    if any(_topology(p.region)!=baseline for p in projects):
        raise ValueError('Tensor batch requires identical precision, steps, nodes, timestep and boundaries. Freeze common graded refinements or group compatible projects.')
    estimate_bytes=sum(s['estimated_memory_mb'] for s in stats)*2**20
    free,_=torch.cuda.mem_get_info()
    if estimate_bytes>free*memory_fraction:
        raise ValueError('Tensor cohort exceeds its GPU memory allowance. Split it into smaller cohorts.')
    dtype=torch.float32 if first.precision=='float32' else torch.float64
    fdtd.set_backend(f'torch.cuda.{first.precision}');fdtd.backend.float=dtype
    grids=[];epsilon=[];traces=[];planes=[];diagnostics=[];decisions=[]
    for p,s in zip(projects,stats):
        g=YeeGrid(p.region)
        from .subpixel import prepare_interfaces,configure_interfaces
        interface_plan=prepare_interfaces(p)
        if interface_plan is not None:s['subpixel']=interface_plan.metadata
        eps,counts,ownership=voxelize(p,with_ownership=True,interface_plan=interface_plan)
        from .injection import validate_oneway_materials
        validate_oneway_materials(p,eps,ownership)
        for obj in p.structures:
            if obj.enabled and counts.get(obj.id)==0:
                message='no Yee component centers intersect this object; subpixel integration may still include it. Check quadrature and mesh convergence.' if interface_plan is not None else 'no cells intersect this object. Refine mesh or reposition it.'
                s['warnings'].append(f'{obj.name}: {message}')
        g.inverse_permittivity[:]=torch.as_tensor(1/(eps if eps.ndim==4 else eps[...,None]),device=g.E.device,dtype=dtype)
        configure_materials(g,p,ownership)
        configure_interfaces(g,interface_plan)
        from .tfsf import prepare_tfsf
        prepare_tfsf(g,p,eps,ownership)
        grids.append(g);epsilon.append(eps)
        monitors=[m for m in p.monitors if m.enabled and m.kind=='point']
        traces.append(torch.zeros((p.region.steps,len(monitors)),device=g.E.device,dtype=dtype))
        planes.append([FrequencyPlane(g,p.resolved_monitor(m)) for m in p.monitors if m.enabled and m.kind=='field'])
        c=p.region.run_control
        diagnostics.append(StateDiagnostics(g) if c.divergence_check else None)
        decisions.append(DecayDecision(c,source_end_time(p),g.time_step))
    update=FusedBatchYeeCUDA(grids)
    counter=torch.zeros(1,device=grids[0].E.device,dtype=torch.int64)
    io=FusedBatchIO(grids,projects,traces,counter)
    from .tfsf import TfsfInjection
    tfsf=TfsfInjection(grids,counter,fused=True)
    frequency_updates=FrequencyUpdates(m for group in planes for m in group)
    def step():
        update.update_E();io.inject('E');tfsf.inject('E')
        update.update_H();io.inject('H');tfsf.inject('H')
        frequency_updates.update(counter)
        io.record()
    states=[counter,*traces]
    for g in grids:states.extend((g.E,g.H,*g.memory_states))
    graph=None
    if cuda_graph:
        graph=CudaStepGraphs(step,states,first.steps,cuda_graph_steps)
    torch.cuda.synchronize()
    frames=[[] for _ in cases];frame_steps=[[] for _ in cases]
    slices=[]
    for p in projects:
        r=p.region;axis='xyz'.index(r.slice_axis);component='xyz'.index(r.field[1].lower())
        index=index_at(tuple(r.slice_position if i==axis else 0 for i in range(3)),r,r.field)[axis]
        sl=[slice(None)]*3;sl[axis]=index
        nearest=None
        if r.mesh_type!='uniform':
            nearest=[]
            for i,coords in enumerate(field_axes(r,r.field)):
                if i==axis:continue
                count=min(256,r.base_shape[i]);pixels=(np.arange(count)+.5)*r.actual_size[i]/count-r.actual_size[i]/2
                nearest.append(np.abs(coords[:,None]-pixels).argmin(axis=0))
        slices.append((axis,component,index,tuple(sl),nearest))
    def plane(array,i):
        data=array[slices[i][3]]
        if isinstance(data,torch.Tensor):data=data.detach().cpu().numpy()
        nearest=slices[i][4]
        if nearest is not None:data=data[nearest[0][:,None],nearest[1][None,:]]
        return data[::max(1,math.ceil(data.shape[0]/256)),::max(1,math.ceil(data.shape[1]/256))].copy()
    completed=0;cancelled=False;diagnostic_seconds=[0.]*len(cases)
    # Only visit cases when they have a host-side observation due. In a large
    # cohort, inspecting every case on every time step can starve the CUDA graph.
    # Preserve case order, diagnostic order and every requested sample exactly.
    events=defaultdict(list)
    intervals=[]
    for i,p in enumerate(projects):
        r=p.region
        interval=max(r.snapshot_interval,math.ceil(r.steps/100))
        intervals.append(interval)
        due=set(range(interval,r.steps+1,interval))|{r.steps}
        if diagnostics[i] is not None:
            due.update(range(r.run_control.check_interval,r.steps+1,r.run_control.check_interval))
        for q in due:events[q].append(i)
    barriers=set(events)
    if progress:barriers.update(range(max(1,first.steps//100),first.steps+1,max(1,first.steps//100)))
    width=graph.width if graph is not None else 1
    graph_replays=0
    setup_seconds=time.perf_counter()-started
    loop_start=time.perf_counter()
    with torch.no_grad():
        for target,advance in observation_schedule(first.steps,width,barriers):
            if cancel is not None and cancel.is_set():cancelled=True;break
            graph.replay(advance) if graph is not None else step()
            graph_replays+=graph is not None
            completed=target
            for i in events.get(completed,()):
                p,g,diagnostic,decision=projects[i],grids[i],diagnostics[i],decisions[i]
                r=p.region
                if diagnostic is not None and (completed%r.run_control.check_interval==0 or completed==r.steps):
                    tick=time.perf_counter()
                    try:decision.update(completed,*diagnostic.measure())
                    except FloatingPointError as exc:raise FloatingPointError(f'Case {cases[i].id}, diagnostic step {completed}: {exc}') from exc
                    diagnostic_seconds[i]+=time.perf_counter()-tick
                interval=intervals[i]
                if completed%interval==0 or completed==r.steps:
                    component=slices[i][1]
                    image=plane((g.E if r.field[0]=='E' else g.H)[...,component],i)
                    if not np.isfinite(image).all():raise FloatingPointError(f'Case {cases[i].id}: non-finite displayed field.')
                    image={'real':np.real,'imag':np.imag,'magnitude':np.abs,'phase':np.angle}[r.complex_display](image)
                    frames[i].append(image);frame_steps[i].append(completed)
            if progress and (completed%max(1,first.steps//100)==0 or completed==first.steps):
                progress(dict(step=completed,total=first.steps,cases=len(cases),elapsed=time.perf_counter()-loop_start))
    torch.cuda.synchronize();seconds=time.perf_counter()-loop_start
    root=Path(output_dir) if output_dir is not None else None
    if root:root.mkdir(parents=True,exist_ok=True)
    items=[]
    for i,(case,p,g,s,trace) in enumerate(zip(cases,projects,grids,stats,traces)):
        e,h=(v.detach().cpu().numpy().copy() for v in (g.E,g.H))
        if not np.isfinite(e).all() or not np.isfinite(h).all():raise FloatingPointError(f'Case {case.id}: non-finite final fields.')
        r=p.region;axis,component,index,_,_=slices[i]
        end=source_end_time(p)
        s.update(backend='cuda',precision=r.precision,gpu=torch.cuda.get_device_name(),cuda_graph=graph is not None,
                 cuda_graph_steps=width,cuda_graph_replays=graph_replays,
                 cuda_kernel='fused_batch',batch_size=len(cases),batch_index=i,timing_scope='whole_cohort',
                 cuda_monitor_kernel=r.cuda_monitor_kernel,
                 steps=completed,requested_steps=r.steps,cancelled=cancelled,termination_reason='cancelled' if cancelled else 'max_steps',
                 auto_shutoff=False,diagnostics=decisions[i].history,diagnostic_seconds=diagnostic_seconds[i],
                 diagnostic_backend=diagnostics[i].backend if diagnostics[i] else None,source_end_s=end if math.isfinite(end) else None,
                 seconds=seconds,setup_seconds=setup_seconds,mcells_per_second=math.prod(r.shape)*completed/max(seconds,1e-9)/1e6,
                 field_peak=float(np.max(abs(e))),slice_index=index,
                 slice_position=float(field_axes(r,r.field)[axis][index]) if r.material_sampling=='yee' else (0 if r.dimension=='2d' else (index+.5)*r.mesh-r.actual_size[axis]/2),
                 complex_fields=False,complex_display=r.complex_display,material_update='trapezoidal ADE' if g.material_states else 'nondispersive',
                 dispersive_samples=sum(state.P.numel() for state in g.material_states),material_sampling=r.material_sampling,
                 epsilon_definition=s['subpixel']['epsilon_image'] if 'subpixel' in s else 'instantaneous relative permittivity (epsilon-infinity for dispersive cells)',
                 boundaries=r.boundaries.model_dump(),bloch_phase=r.bloch_phase,
                 units='geometry: um; time: s; E/H: reduced fields; Bloch phase: rad',engine='PhotonWeave batched Yee/CPML CUDA')
        frequency=[m.result() for m in planes[i]]
        if frequency:
            config=dict(region=r.model_dump(exclude={'backend','cuda_kernel','cuda_monitor_kernel','field','slice_axis','slice_position','complex_display','snapshot_interval'}),
                        sources=[p.resolved_source(src).model_dump() for src in p.sources],steps=completed,nodes=[a.tolist() for a in r.mesh_nodes])
            signature=hashlib.sha256(json.dumps(config,sort_keys=True).encode()).hexdigest()
            for m in frequency:m['run_signature']=signature
        eps=epsilon[i][...,component] if epsilon[i].ndim==4 else epsilon[i]
        result=Result(p,s,np.array(frames[i]),np.array(frame_steps[i]),plane(eps,i),
                      trace[:completed].cpu().numpy().copy(),np.arange(1,completed+1)*g.time_step,e,h,frequency)
        item=BatchItem(case.id,'cancelled' if cancelled else 'completed',case.parameters,summary=s,
                       pid=os.getpid(),device=str(g.E.device),started=wall_started)
        if root:
            path=root/(case.id+'.npz');result.save(path);item.output=str(path)
        if not cancelled and objective is not None:
            try:
                value=objective(result)
                if not isinstance(value,dict):value={'objective':value}
                metrics={str(k):float(v) for k,v in value.items()}
                if not metrics or not all(math.isfinite(v) for v in metrics.values()):raise ValueError('Objective must return finite nonempty scalar metrics.')
                item.metrics=metrics
            except Exception as exc:item.status='failed';item.error=f'{type(exc).__name__}: {exc}'
        if keep_results:item.result=result
        item.finished=time.time()
        items.append(item)
    report=BatchReport(items,time.perf_counter()-started,dict(execution='fused_cuda_batch',batch_size=len(cases),
        device=str(grids[0].E.device),estimated_memory_mb=estimate_bytes/2**20,memory_fraction=memory_fraction,
        loop_seconds=seconds,setup_seconds=setup_seconds,graph=cuda_graph,
        cuda_graph_steps=width,cuda_graph_replays=graph_replays,resume=False))
    return report
