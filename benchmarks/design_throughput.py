"""Measure a complete seeded forward-only design loop, including all proposals."""
import argparse
import gc
import json
from pathlib import Path
import statistics
import time

import numpy as np
import torch

from torchfdtd import BatchItem, BatchReport, Simulation, optimize
from torchfdtd.solver import hardware
from .open_source import scene


def objective(result):
    # A local field objective, not normalized efficiency or a modal quantity.
    return float(np.sum(np.square(result.signals), dtype=np.float64))


class SerialRunner:
    def run(self, cases, objective, **kwargs):
        items=[]
        for case in cases:
            result=Simulation(case.project).run()
            items.append(BatchItem(case.id,'completed',case.parameters,
                metrics={'objective':objective(result)}))
        return BatchReport(items,0,dict(execution='independent_native_fused'))


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--repeats',type=int,default=3)
    parser.add_argument('--output',default='results/open-source/design-throughput.json')
    args=parser.parse_args()
    data=dict(hardware=hardware(),method='DE/rand/1/bin, seed 73, population 16, three trial generations, 64 full forward solves per run. Radius bounds [0.25,0.75] um, maximized integrated squared point trace. Fixed 800 steps. One warmup and three alternating measured repetitions. Includes generation logic, setup, graph preparation, stepping, final E/H transfer and objective. Excludes disk output and cold context/compiler. No gradients, no calibrated efficiency or global-optimum claim.',cases=[])
    for n,cohort in ((32,16),(64,4)):
        p=scene('sphere',n,800)
        case=dict(shape=list(p.region.shape),project=p.model_dump(),cohort_size=cohort,
            runs={'sequential':[],'tensor':[]},checks=[])
        for repeat in range(-1,args.repeats):
            results={}
            for mode in (['sequential','tensor'] if repeat%2==0 else ['tensor','sequential']):
                gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats();torch.cuda.synchronize()
                tick=time.perf_counter()
                options=dict(runner=SerialRunner()) if mode=='sequential' else dict(execution='tensor',cohort_size=cohort)
                result=optimize(p,{'structures.0.radius':(.25,.75)},objective,
                    population=16,generations=3,seed=73,maximize=True,**options)
                torch.cuda.synchronize()
                wall=time.perf_counter()-tick
                results[mode]=result.as_dict()
                row=dict(wall_seconds=wall,evaluations_per_second=result.evaluations/wall,
                    peak_allocated_bytes=torch.cuda.max_memory_allocated(),result=result.as_dict())
                if repeat>=0:case['runs'][mode].append(row)
                print(json.dumps(dict(n=n,repeat=repeat,mode=mode,wall_seconds=wall)),flush=True)
            assert results['sequential']==results['tensor'],'Optimizer history changed.'
            if repeat>=0:case['checks'].append(dict(identical_history=True))
        case['medians']={mode:{k:statistics.median(row[k] for row in rows) for k in
            ('wall_seconds','evaluations_per_second','peak_allocated_bytes')} for mode,rows in case['runs'].items()}
        data['cases'].append(case)
        target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(json.dumps(data,indent=2,allow_nan=False)+'\n',encoding='utf-8')


if __name__=='__main__':main()
