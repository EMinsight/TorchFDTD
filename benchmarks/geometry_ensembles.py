"""Native support-pruning ablation including complete CUDA cohort execution.

Both modes use identical analytic solids, grids, outputs and CUDA kernels.
Only the host-side region evaluated for material membership differs.
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import platform
import statistics
import time
import numpy as np
import torch
from torchfdtd import (Project,Region,Structure,Source,Monitor,FieldMonitor,
                        SpectrumSettings,RunControl,run_tensor_batch)
from torchfdtd import solver
from torchfdtd.geometry import contains


def unpruned(p,axes,with_ownership):
    xyz=np.meshgrid(*axes,indexing='ij',sparse=True)
    eps=np.full(p.region.shape,p.region.background_index**2,dtype=p.region.precision)
    ownership=np.full(p.region.shape,-1,np.int32) if with_ownership else None
    counts={};materials={m.name:(i,m.instantaneous_epsilon) for i,m in enumerate(p.materials)}
    for obj in sorted(p.structures,key=lambda s:-s.mesh_order):
        if not obj.enabled:continue
        mask=contains(obj,*xyz);idx,value=materials[obj.material]
        eps[mask]=value
        if ownership is not None:ownership[mask]=idx
        counts[obj.id]=int(np.count_nonzero(mask))
    return (eps,counts,ownership) if with_ownership else (eps,counts)


def projects_for(kind,n,steps,count):
    templates={
        'spheres':dict(kind='sphere',radius=.24),
        'rotated_boxes':dict(kind='rectangle',size=(.48,.28,.32),rotation_axes=('x','y','z'),rotation_angles=(17,31,-29)),
        'concave_polygons':dict(kind='polygon',size=(1,1,.3),vertices=((- .25,-.2),(.25,-.2),(.25,0),(0,0),(0,.2),(-.25,.2)),rotation_axes=('x','y','z'),rotation_angles=(17,31,-29)),
        'elliptical_sectors':dict(kind='ring',radius=.3,radius_2=.21,inner_radius=.18,inner_radius_2=.11,make_ellipsoid=True,theta_start=315,theta_stop=180,size=(1,1,.3),rotation_axes=('x','y','z'),rotation_angles=(17,31,-29))}
    projects=[]
    for case in range(count):
        structures=[Structure(id=f's{i}',name=f'solid-{i}',center=(x+.011*case,y+.009*case,z),**templates[kind])
                    for i,(x,y,z) in enumerate((x,y,z) for x in (-.55,.55) for y in (-.55,.55) for z in (-.55,.55))]
        projects.append(Project(name=f'{kind}-{n}-{case}',
            region=Region(dimension='3d',size=(4,4,4),mesh=4/n,pml_cells=8,steps=steps,material_sampling='yee',
                          backend='cuda',cuda_kernel='fused',cuda_monitor_kernel='fused',snapshot_interval=steps,
                          run_control=RunControl(divergence_check=False)),structures=structures,
            sources=[Source(id='s',center=(-1,0,0),wavelength=1.3,pulse_cycles=1,phase=case*17)],
            monitors=[Monitor(id='point',center=(1,0,0)),FieldMonitor(id='plane',center=(1,0,0),size=(0,1.5,1.5),
                spectrum=SpectrumSettings(sampling='frequency',frequency_points=9,apodization='none'))]))
    return projects


def outputs(result):
    return [result.epsilon,result.electric,result.magnetic,result.signals,result.times,
            result.frames,result.frequency_fields[0]['fields'],result.frequency_fields[0]['flux']]


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--sizes',nargs='+',type=int,default=[64,96]);ap.add_argument('--steps',type=int,default=800)
    ap.add_argument('--cases',nargs='+',default=['spheres','rotated_boxes','concave_polygons','elliptical_sectors'])
    ap.add_argument('--count',type=int,default=4);ap.add_argument('--repeats',type=int,default=3)
    ap.add_argument('--output',default='results/open-source/geometry-ensembles.json');args=ap.parse_args();target=Path(args.output)
    if target.exists():raise FileExistsError('Use a fresh output path to preserve measurements.')
    original=solver._voxelize_at
    record=dict(hardware=solver.hardware(),platform=platform.platform(),configuration=vars(args),
        source_sha256={str(p).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in [*Path('torchfdtd').glob('*.py'),Path(__file__)]},
        method='Native host material-preparation ablation with identical CUDA kernels. Four independent scenes, eight solids per scene. '
        'Three warmed alternating-order repetitions. Full wall includes preparation, graph capture, stepping and output transfers. '
        'Cold compilation/context, validation and disk writes excluded. Host voxelization time is nested inside full wall. '
        'Torch peak allocation excludes host memory, context, driver and graph allocations outside the allocator. '
        'Bitwise checks cover epsilon, complete final E/H, point signals, times, snapshots, complex plane fields and flux. '
        'No external-library speed or general mesh-accuracy claim.',cases=[])
    try:
        for n in args.sizes:
            for kind in args.cases:
                projects=projects_for(kind,n,args.steps,args.count)
                row=dict(name=kind,shape=projects[0].region.shape,projects=[p.model_dump() for p in projects],runs={'unpruned':[],'support_pruned':[]},checks=[])
                reference=None
                for repeat in range(-1,args.repeats):
                    for mode in (['unpruned','support_pruned'] if repeat%2 else ['support_pruned','unpruned']):
                        membership_seconds=[0.]
                        function=unpruned if mode=='unpruned' else original
                        def timed(*a,**kw):
                            start=time.perf_counter();value=function(*a,**kw);membership_seconds[0]+=time.perf_counter()-start;return value
                        solver._voxelize_at=timed
                        gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
                        start=time.perf_counter();batch=run_tensor_batch(projects,cohort_size=args.count);batch.raise_for_errors()
                        results=[item.load() for item in batch.items];torch.cuda.synchronize();wall=time.perf_counter()-start
                        sample=dict(wall_seconds=wall,voxelize_seconds=membership_seconds[0],setup_seconds=batch.plan['setup_seconds'],
                                    loop_seconds=batch.plan['loop_seconds'],peak_allocated_bytes=torch.cuda.max_memory_allocated())
                        values=[outputs(r) for r in results]
                        if reference is None:reference=[[a.copy() for a in v] for v in values]
                        matches=[[bool(np.array_equal(a,b)) for a,b in zip(v,ref)] for v,ref in zip(values,reference)]
                        check=dict(repeat=repeat,mode=mode,bitwise_by_case_output=matches,passed=all(all(v) for v in matches))
                        row['checks'].append(check)
                        if repeat>=0:row['runs'][mode].append(sample)
                        print(json.dumps(dict(n=n,kind=kind,repeat=repeat,mode=mode,passed=check['passed'],**sample)),flush=True)
                        if not check['passed']:raise RuntimeError('Bitwise output gate failed.')
                        del batch,results,values
                row['medians']={mode:{k:statistics.median(v[k] for v in runs) for k in runs[0]} for mode,runs in row['runs'].items()}
                record['cases'].append(row);target.parent.mkdir(parents=True,exist_ok=True)
                target.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf8')
    finally:solver._voxelize_at=original


if __name__=='__main__':main()
