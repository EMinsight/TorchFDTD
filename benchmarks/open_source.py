"""Pinned, native-input comparisons against separately installed open solvers.

The flaport adapter calls its unmodified public Grid.update_E/update_H methods.
Both engines receive the same sampled source, voxel epsilon and point location.
A graph-adapted upstream baseline is also reported, not just eager PyTorch.
No commercial input or output is used.
"""
from __future__ import annotations

import argparse
import gc
import hashlib
import importlib.metadata
import inspect
import json
import math
from pathlib import Path
import platform
import statistics
import time

import fdtd
import numpy as np
import torch

from photonweave import Project, Region, Structure, Material, Source, Monitor, RunControl, Simulation
from photonweave.solver import voxelize, source_slice, source_profile, index_at, hardware
from photonweave.waveforms import source_time_signal


def scene(kind='sphere', n=64, steps=800):
    structures={
        'vacuum':[],
        'sphere':[Structure(kind='sphere',radius=.5,material='dielectric')],
        'slab':[Structure(size=(.3,4.8,4.8),material='dielectric')],
        'waveguide':[Structure(size=(4.8,.6,.4),material='dielectric')],
    }
    return Project(name=f'{kind}-{n}',region=Region(dimension='3d',size=(4.8,4.8,4.8),
        mesh=4.8/n,steps=steps,pml_cells=min(8,max(3,n//8)),backend='cuda',precision='float32',
        material_sampling='yee',cuda_kernel='fused',snapshot_interval=steps,
        run_control=RunControl(divergence_check=False)),
        materials=[Material(name='dielectric',index=1.5)],structures=structures[kind],
        sources=[Source(center=(-1.2,0,0),wavelength=1.55,pulse_cycles=2)],
        monitors=[Monitor(center=(1.2,0,0))])


def upstream_run(project, graph=True, with_planes=False, plane_kernel='torch', cuda_graph_steps=1, plane_result='fields'):
    if plane_result not in ('fields','flux'):raise ValueError('plane_result must be fields or flux.')
    """Return the same final arrays and point trace as the native benchmark.

    Upstream PML omits one interface derivative at each high-side E boundary.
    The two solvers consequently have small boundary-discretization differences.
    Their physical coefficient profiles, grid, dt and source table are equal.
    """
    from photonweave.cuda_graph import CudaStepGraphs, observation_schedule, validate_graph_steps
    validate_graph_steps(cuda_graph_steps,graph)
    r=project.region
    old_dtype=torch.get_default_dtype()
    started=time.perf_counter()
    try:
        dtype=torch.float32 if r.precision=='float32' else torch.float64
        fdtd.set_backend(f'torch.cuda.{r.precision}');fdtd.backend.float=dtype
        eps,_=voxelize(project)
        grid=fdtd.Grid(shape=r.shape,grid_spacing=r.mesh*1e-6,
                       courant_number=r.courant_factor/math.sqrt(3))
        grid.inverse_permittivity[:]=torch.as_tensor(1/eps,device='cuda',dtype=dtype)
        for axis in range(3):
            for side in range(2):
                loc=[slice(None)]*3
                layers=r.pml_layers(axis,side)
                loc[axis]=slice(None,layers) if side==0 else slice(-layers,None)
                grid[tuple(loc)]=fdtd.PML(a=1e-8)
        src=project.resolved_source(project.sources[0])
        location=source_slice(src,r);component='xyz'.index(src.component[1].lower())
        profile=source_profile(src,location,r)
        if profile is not None:raise ValueError('This adapter requires a point source.')
        signal=torch.as_tensor(source_time_signal(src,np.arange(1,r.steps+1)*grid.time_step),device='cuda',dtype=dtype)
        monitor=project.monitors[0];mi=index_at(monitor.center,r,monitor.component)
        mc='xyz'.index(monitor.component[1].lower())
        counter=torch.zeros(1,device='cuda',dtype=torch.int64)
        trace=torch.zeros((r.steps,1),device='cuda',dtype=dtype)
        planes=[]
        if with_planes:
            # Common observation adapter, not an upstream plane-DFT feature.
            # Either observer can be shared fairly with the native solver.
            from types import SimpleNamespace
            from photonweave.field_monitors import FrequencyPlane,FrequencyUpdates
            observed=SimpleNamespace(E=grid.E,H=grid.H,region=r.model_copy(update={'cuda_monitor_kernel':plane_kernel}),is_torch=True,
                                     time_step=grid.time_step,memory_states=[])
            planes=[FrequencyPlane(observed,project.resolved_monitor(m))
                    for m in project.monitors if m.enabled and m.kind=='field']
            plane_updates=FrequencyUpdates(planes)
        def step():
            grid.update_E()
            grid.E[location+(component,)]+=signal.index_select(0,counter)[0]
            grid.update_H()
            if with_planes:plane_updates.update(counter)
            trace.index_copy_(0,counter,grid.E[mi+(mc,)].reshape(1,1))
            counter.add_(1)
        mutable=[grid.E,grid.H,counter,trace,*[m.value for m in planes]]
        for boundary in grid.boundaries:
            mutable.extend(v for key,v in vars(boundary).items()
                           if key.startswith(('phi_','psi_')) and isinstance(v,torch.Tensor))
        captured=None
        if graph:
            captured=CudaStepGraphs(step,mutable,r.steps,cuda_graph_steps)
        torch.cuda.synchronize()
        setup=time.perf_counter()-started
        loop_start=time.perf_counter()
        width=captured.width if captured is not None else 1
        for _,advance in observation_schedule(r.steps,width):
            captured.replay(advance) if captured is not None else step()
        torch.cuda.synchronize()
        loop=time.perf_counter()-loop_start
        arrays=[v.cpu().numpy().copy() for v in (grid.E,grid.H,trace)]
        arrays.extend(m.result()[plane_result] for m in planes)
        return dict(setup_seconds=setup,loop_seconds=loop),arrays
    finally:
        fdtd.set_backend('numpy');fdtd.backend.float=np.float64;torch.set_default_dtype(old_dtype)


def relative(a,b):
    a,b=np.asarray(a,dtype=np.float64),np.asarray(b,dtype=np.float64)
    return float(np.linalg.norm(a-b)/max(np.linalg.norm(b),1e-30))


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--sizes',nargs='+',type=int,default=[64,96])
    parser.add_argument('--cases',nargs='+',default=['vacuum','sphere','slab','waveguide'])
    parser.add_argument('--steps',type=int,default=800)
    parser.add_argument('--repeats',type=int,default=3)
    parser.add_argument('--output',default='results/open-source/flaport.json')
    args=parser.parse_args()
    record=dict(hardware=hardware(),platform=platform.platform(),
                packages={k:importlib.metadata.version(k) for k in ('fdtd','numpy','torch','cupy-cuda12x')},
                upstream_grid_sha256=hashlib.sha256(Path(inspect.getfile(fdtd.Grid)).read_bytes()).hexdigest(),
                upstream_boundary_sha256=hashlib.sha256(Path(inspect.getfile(fdtd.PML)).read_bytes()).hexdigest(),
                method='Identical native voxel grids, dt, sampled soft source, point trace and full final E/H. Six PML faces with matched cubic sigma/kappa/alpha profiles, with small high-side E interface stencil differences documented in the adapter. Fixed 800 steps by default. No auto termination or periodic state diagnostics. Each mode has one warmup and alternating measured order. The upstream graph adapter captures unmodified public field updates with common device-side source/trace operations. Full solve includes construction, graph preparation and field transfers. Python interpreter/context startup and first kernel compilation are excluded by warmup. Accuracy tolerance is 1% point-trace relative L2, declared before runs. Final-field relative errors are also recorded, with no field-wise equivalence claim.',
                cases=[])
    runners={'flaport_eager':lambda p:upstream_run(p,False),
             'flaport_graph':lambda p:upstream_run(p,True)}
    def native(p):
        result=Simulation(p).run()
        return dict(setup_seconds=result.summary['setup_seconds'],loop_seconds=result.summary['seconds']),[result.electric,result.magnetic,result.signals]
    runners['photonweave_fused']=native
    for n in args.sizes:
        for kind in args.cases:
            p=scene(kind,n,args.steps)
            case=dict(name=kind,shape=list(p.region.shape),project=p.model_dump(),runs={k:[] for k in runners},errors=[])
            for repeat in range(-1,args.repeats):
                outputs={}
                for name in (list(runners) if repeat%2==0 else list(reversed(runners))):
                    gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats()
                    start=time.perf_counter();timing,arrays=runners[name](p);wall=time.perf_counter()-start
                    if repeat<0:continue
                    row=dict(**timing,wall_seconds=wall,peak_allocated_bytes=torch.cuda.max_memory_allocated())
                    case['runs'][name].append(row);outputs[name]=arrays
                    print(json.dumps(dict(case=kind,n=n,repeat=repeat,engine=name,**row)),flush=True)
                if repeat>=0:
                    eager,graph,ours=(outputs[k] for k in runners)
                    error=dict(upstream_graph_relative_l2=[relative(a,b) for a,b in zip(eager,graph)],
                               photonweave_relative_l2=dict(zip(('E','H','trace'),[relative(a,b) for a,b in zip(ours,graph)])))
                    error['max_absolute_difference']=dict(zip(('E','H','trace'),[float(np.max(abs(a-b))) for a,b in zip(ours,graph)]))
                    error['reference_final_peak']=dict(zip(('E','H','trace'),[float(np.max(abs(a))) for a in graph]))
                    assert all(np.isfinite(v).all() for v in ours+graph+eager)
                    assert max(error['upstream_graph_relative_l2'])<1e-6
                    error['trace_accuracy_pass']=error['photonweave_relative_l2']['trace']<.01
                    case['errors'].append(error)
                    print(json.dumps(error),flush=True)
            case['medians']={name:{k:statistics.median(row[k] for row in rows) for k in rows[0]}
                             for name,rows in case['runs'].items()}
            case['accuracy_pass']=all(e['trace_accuracy_pass'] for e in case['errors'])
            record['cases'].append(case)
            target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
            target.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf-8')


if __name__=='__main__':main()
