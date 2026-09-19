"""Measure explicit cohort splitting, including its overhead and all outputs."""
import gc
import json
from pathlib import Path
import statistics
import time

import numpy as np
import torch

from photonweave import Simulation, run_tensor_batch
from photonweave.solver import hardware
from .open_source import scene
from .tensor_batch_validation import objective


def main():
    projects=[]
    for i in range(16):
        p=scene('sphere',64,800);p.structures[0].radius=.35+.01*i
        projects.append(p)
    modes=['sequential_fused','cohort_4','cohort_16']
    data=dict(hardware=hardware(),shape=[64]*3,batch_size=16,projects=[p.model_dump() for p in projects],
        method='One warmup per mode, then three alternating repetitions. Full construction, graph capture, source/point monitoring, full E/H transfer and objective evaluation included. Cold process/CUDA/NVRTC and file I/O excluded. Cohort size is explicit, not autotuned.',
        runs={m:[] for m in modes},checks=[])
    for repeat in range(-1,3):
        results={}
        for mode in (modes if repeat%2==0 else list(reversed(modes))):
            gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats()
            start=time.perf_counter()
            if mode=='sequential_fused':
                results[mode]=[Simulation(p).run() for p in projects]
                metrics=[objective(r) for r in results[mode]]
                loop=sum(r.summary['seconds'] for r in results[mode])
            else:
                report=run_tensor_batch(projects,cohort_size=int(mode.split('_')[-1]),objective=objective)
                report.raise_for_errors();results[mode]=[item.load() for item in report.items]
                metrics=[item.metrics['objective'] for item in report.items];loop=report.plan['loop_seconds']
            wall=time.perf_counter()-start
            row=dict(wall_seconds=wall,loop_seconds=loop,cases_per_second=16/wall,
                     peak_allocated_bytes=torch.cuda.max_memory_allocated(),objectives=metrics)
            if repeat>=0:data['runs'][mode].append(row)
            print(json.dumps(dict(repeat=repeat,mode=mode,**row)),flush=True)
        if repeat>=0:
            same=all(np.array_equal(getattr(a,k),getattr(b,k)) for m in modes[1:]
                     for a,b in zip(results['sequential_fused'],results[m]) for k in ('electric','magnetic','signals'))
            assert same,'Cohort splitting changed the fields or traces.'
            data['checks'].append(dict(native_bitwise_identical=same))
    data['medians']={m:{k:statistics.median(r[k] for r in rows) for k in
        ('wall_seconds','loop_seconds','cases_per_second','peak_allocated_bytes')} for m,rows in data['runs'].items()}
    target=Path('results/open-source/cohorts.json');target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(data,indent=2,allow_nan=False)+'\n',encoding='utf-8')


if __name__=='__main__':main()
