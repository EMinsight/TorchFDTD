"""Same scene / dtype / timesteps, NumPy CPU vs CUDA graph on this host."""
import argparse
import gc
import json
import platform
import statistics
import time
from pathlib import Path

import numpy as np
import torch

from torchfdtd import Project, Region, Structure, Source, Monitor, Simulation
from torchfdtd.solver import hardware


def scene(n=96, steps=300):
    return Project(name=f'Dielectric sphere {n}^3',
                   region=Region(dimension='3d', size=(6,6,6), mesh=6/n, steps=steps,
                                 pml_cells=10, precision='float32', snapshot_interval=steps),
                   structures=[Structure(name='sphere', kind='sphere', radius=.6)],
                   sources=[Source(center=(-1.5,0,0),wavelength=1.55,pulse_cycles=2)],
                   monitors=[Monitor(name='output',center=(1.5,0,0))])


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--sizes',nargs='+',type=int,default=[64,96,128]);ap.add_argument('--steps',type=int,default=300);ap.add_argument('--repeats',type=int,default=3);ap.add_argument('--output',default='results/performance.json');args=ap.parse_args()
    data={'hardware':hardware(),'cpu':platform.processor(),'method':'Identical project, float32, all six fields, six PML faces, Gaussian soft dipole, one point monitor. Solver loop includes snapshot transfer. Setup and end-to-end time separately measured. Medians of repeated runs after warmup. CPU is upstream NumPy with matching precision, not a compiled multithreaded engine.','cases':[]}
    Simulation(scene(48,20)).run()  # GPU context / graph warmup outside measurement.
    for n in args.sizes:
        p=scene(n,args.steps);case={'n':n,'shape':p.region.shape,'project':p.model_dump(),'runs':{}};signals={};fields={}
        for backend in ['cpu','cuda']:
            p.region.backend=backend;rows=[]
            for repeat in range(args.repeats):
                t=time.perf_counter();result=Simulation(p).run();wall=time.perf_counter()-t
                rows.append({**result.summary,'wall_seconds':wall})
                signals[backend]=result.signals.copy();fields[backend]=result.electric.copy()
                print(json.dumps({'n':n,'backend':backend,'repeat':repeat,'solver_s':result.summary['seconds'],'wall_s':wall}),flush=True)
                del result;gc.collect()
            case['runs'][backend]=rows
        case['solver_speedup']=statistics.median(r['seconds'] for r in case['runs']['cpu'])/statistics.median(r['seconds'] for r in case['runs']['cuda'])
        case['wall_speedup']=statistics.median(r['wall_seconds'] for r in case['runs']['cpu'])/statistics.median(r['wall_seconds'] for r in case['runs']['cuda'])
        case['signal_relative_l2_error']=float(np.linalg.norm(signals['cpu']-signals['cuda'])/max(np.linalg.norm(signals['cpu']),1e-30))
        case['field_relative_l2_error']=float(np.linalg.norm(fields['cpu']-fields['cuda'])/max(np.linalg.norm(fields['cpu']),1e-30))
        data['cases'].append(case);target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True);target.write_text(json.dumps(data,indent=2))
        print(json.dumps({k:v for k,v in case.items() if k not in ('runs','project')}),flush=True)
        del fields,signals;fields={};signals={};gc.collect();torch.cuda.empty_cache()


if __name__=='__main__':
    main()
