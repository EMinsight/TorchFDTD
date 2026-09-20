"""Matched-dt transverse mesh reduction for normal-incidence layer ensembles.

This is a native mesh ablation, not a cross-library or general 3D accuracy claim.
"""
import argparse
import gc
import hashlib
import importlib.metadata
import json
from pathlib import Path
import platform
import statistics
import time

import numpy as np
import torch
from torchfdtd import (Project,Region,Source,Monitor,FieldMonitor,SpectrumSettings,
                        Material,Structure,Boundaries,BoundaryFace,RunControl,Simulation,run_tensor_batch)
from torchfdtd.solver import hardware


def projects_for(kind,n,steps,count):
    bc=Boundaries(**{a+'_'+s:BoundaryFace(kind='periodic') for a in 'yz' for s in ('min','max')})
    r=Region(dimension='3d',size=(n*.05,n*.025,n*.025),mesh=.05,steps=steps,pml_cells=16,
             material_sampling='yee',backend='cuda',cuda_kernel='fused',cuda_monitor_kernel='fused',
             snapshot_interval=steps,boundaries=bc,run_control=RunControl(divergence_check=False))
    layouts={'vacuum':[], 'slab':[(0,.3,'low')],
             'bilayer':[(-.15,.2,'low'),(.1,.3,'high')],
             'multilayer':[(-.6,.2,'high'),(-.35,.3,'low'),(-.1,.2,'high'),(.15,.3,'low'),(.4,.2,'high')]}
    projects=[]
    for j in range(count):
        p=Project(name=f'{kind}-{n}-{j}',region=r.model_copy(deep=True),
            materials=[Material(name='low',index=1.5+j*.03),Material(name='high',index=2.1+j*.02)],
            structures=[Structure(center=(x,0,0),size=(d,r.size[1]*2,r.size[2]*2),material=m) for x,d,m in layouts[kind]],
            sources=[Source(kind='plane',injection='oneway',normal='x',center=(-1.3,0,0),
                            size=(0,r.size[1],r.size[2]),wavelength=1.55,pulse_cycles=1,phase=j*17)],
            monitors=[Monitor(center=(1.1,0,0)),FieldMonitor(center=(1.1,0,0),size=(0,r.size[1],r.size[2]),
                record_fields=(),record_poynting=(),spectrum=SpectrumSettings(sampling='frequency',frequency_points=17,apodization='none'))])
        projects.append(p)
    return projects


def reduced(project):
    p=project.model_copy(deep=True)
    p.region.time_step_override=project.region.time_step
    p.region.mesh_steps=(.05,.2,.2)
    return Project.model_validate(p.model_dump())


def observables(result):
    return [result.electric[:,0,0],result.magnetic[:,0,0],result.signals,result.frequency_fields[0]['flux']]


def errors(actual,reference):
    return [float(np.linalg.norm(a.astype(np.float64)-b.astype(np.float64))/max(np.linalg.norm(b.astype(np.float64)),1e-300)) for a,b in zip(actual,reference)]


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sizes',type=int,nargs='+',default=[128,192])
    parser.add_argument('--cases',nargs='+',default=['vacuum','slab','bilayer','multilayer'])
    parser.add_argument('--steps',type=int,default=800);parser.add_argument('--count',type=int,default=4)
    parser.add_argument('--repeats',type=int,default=3);parser.add_argument('--output',default='results/open-source/rectilinear-ensembles.json')
    args=parser.parse_args();target=Path(args.output)
    if target.exists():raise FileExistsError('Choose a fresh path to preserve recorded measurements.')
    paths=list(Path('torchfdtd').glob('*.py'))+[Path(__file__)]
    record=dict(hardware=hardware(),platform=platform.platform(),configuration=vars(args),
        packages={k:importlib.metadata.version(k) for k in ('torch','numpy','fdtd','cupy-cuda12x')},
        source_sha256={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in paths},
        method='Native mesh ablation. Same domain, dx, actual dt, duration, source, boundaries and flux frequencies. '
            'Only transverse spacing grows from 0.05 to 0.2 um. All geometries and excitations are transverse-invariant. '
            'Full wall includes preparation, graph capture, final E/H and monitor transfer. '
            'One warmup, then three alternating-order repetitions. No cold context/compilation, accuracy checks or disk writes. '
            'Torch memory excludes context/driver/graph allocations outside its allocator. '
            'Centerline final E/H, full point traces and area-integrated signed flux are compared at a 3e-5 relative L2 gate. '
            'No field interpolation and no change to propagation-axis resolution. Transverse field uniformity is checked separately. '
            'No comparison against another library or general-geometry accuracy/convergence claim.',
        gate_relative_l2=3e-5,cases=[])
    modes=['uniform_batch','rectangular_sequential','rectangular_batch']
    for n in args.sizes:
        for kind in args.cases:
            baseline=projects_for(kind,n,args.steps,args.count);coarse=[reduced(p) for p in baseline]
            reference=[observables(Simulation(p).run()) for p in baseline]
            row=dict(name=kind,uniform_shape=baseline[0].region.shape,rectangular_shape=coarse[0].region.shape,
                uniform_projects=[p.model_dump() for p in baseline],rectangular_projects=[p.model_dump() for p in coarse],
                runs={mode:[] for mode in modes},checks=[])
            for repeat in range(-1,args.repeats):
                for mode in modes if repeat%2==0 else modes[::-1]:
                    projects=baseline if mode=='uniform_batch' else coarse
                    gc.collect();torch.cuda.empty_cache();torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats()
                    start=time.perf_counter()
                    if mode.endswith('batch'):
                        batch=run_tensor_batch(projects,cohort_size=args.count);batch.raise_for_errors()
                        results=[item.load() for item in batch.items]
                        setup=batch.plan['setup_seconds'];loop=batch.plan['loop_seconds']
                    else:
                        results=[Simulation(p).run() for p in projects]
                        setup=sum(r.summary['setup_seconds'] for r in results);loop=sum(r.summary['seconds'] for r in results)
                    torch.cuda.synchronize();wall=time.perf_counter()-start
                    sample=dict(wall_seconds=wall,loop_seconds=loop,setup_seconds=setup,
                        peak_allocated_bytes=torch.cuda.max_memory_allocated(),peak_reserved_bytes=torch.cuda.max_memory_reserved())
                    discrepancies=[errors(observables(r),ref) for r,ref in zip(results,reference)]
                    spread=max(float(np.max(np.abs(a-a[:,0:1,0:1]))/max(np.max(abs(a)),1e-30)) for r in results for a in (r.electric,r.magnetic))
                    passed=max(max(e) for e in discrepancies)<record['gate_relative_l2'] and spread<1e-6
                    check=dict(repeat=repeat,mode=mode,relative_l2=discrepancies,transverse_spread=spread,accuracy_pass=passed)
                    print(json.dumps(dict(n=n,kind=kind,mode=mode,repeat=repeat,**sample,**{k:v for k,v in check.items() if k not in ('mode','repeat')})),flush=True)
                    row['checks'].append(check)
                    if repeat>=0:row['runs'][mode].append(sample)
                    if not passed:raise RuntimeError('Matched-observable accuracy gate failed.')
                    del results
                    if mode.endswith('batch'):del batch
            row['medians']={mode:{k:statistics.median(s[k] for s in samples) for k in samples[0]} for mode,samples in row['runs'].items()}
            row['accuracy_pass']=all(c['accuracy_pass'] for c in row['checks']);record['cases'].append(row)
            target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf8')


if __name__=='__main__':main()
