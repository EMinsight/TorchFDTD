"""Measure independent-case throughput, including setup, transfer and IPC.

No commercial program or commercial-program output is used in this benchmark.
"""
import argparse
import json
from pathlib import Path
import numpy as np

from torchfdtd import Project,Region,Structure,Source,Monitor,Simulation,BatchRunner,parameter_sweep
from torchfdtd.solver import hardware


def objective(result):
    return dict(trace_energy=float(np.sum(abs(result.signals)**2)),field_peak=result.summary['field_peak'])


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',default='results/batch/validation.json')
    args=parser.parse_args()
    out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True)
    p=Project(name='Independent dielectric sphere ensemble',
        region=Region(dimension='3d',size=(4.8,4.8,4.8),mesh=.075,steps=800,pml_cells=8,
                      material_sampling='yee',snapshot_interval=800,precision='float32'),
        structures=[Structure(kind='sphere',radius=.45,material='SiO2 (constant n)')],
        sources=[Source(center=(-1,0,0),pulse_cycles=1)],monitors=[Monitor(center=(1,0,0))])
    cases=parameter_sweep(p,{'structures.0.radius':[.4,.45,.5,.55]},prefix='sphere')
    report=dict(hardware=hardware(),project=p.model_dump(),cases=[c.parameters for c in cases],measurements=[],
                timing='Wall time for all four cases, including voxelization, graph capture, host transfers, worker IPC and cache release. Process startup excluded by one warm batch. Three measured batches.',
                method='Independent spawned processes. GPU kernels from different contexts need not overlap on one GPU. Not a fused tensor batch or MPI.')
    for backend,workers in [('cpu',1),('cuda',1),('cuda',2),('cuda',4)]:
        if backend=='cuda' and not report['hardware']['cuda']:continue
        with BatchRunner(backend=backend,max_workers=workers) as runner:
            warm=runner.run(cases,objective=objective).raise_for_errors()
            measured=[runner.run(cases,objective=objective).raise_for_errors() for _ in range(3)]
            times=[r.seconds for r in measured]
            row=dict(backend=backend,workers=workers,seconds=times,median_seconds=float(np.median(times)),
                     cases_per_second=len(cases)/float(np.median(times)),plan=measured[-1].plan,
                     metrics=[item.metrics for item in measured[-1].items],
                     compute_seconds=[item.summary['seconds'] for item in measured[-1].items],
                     setup_seconds=[item.summary['setup_seconds'] for item in measured[-1].items],
                     concurrent_process_intervals=[dict(pid=i.pid,start=i.started,end=i.finished) for i in measured[-1].items])
            report['measurements'].append(row)
            out.write_text(json.dumps(report,indent=2),encoding='utf-8')
            print(backend,workers,'wall',row['median_seconds'],'case/s',row['cases_per_second'],flush=True)
    cpu=report['measurements'][0]
    for row in report['measurements']:
        row['speedup_vs_cpu_1']=cpu['median_seconds']/row['median_seconds']
        ref=np.asarray([m['trace_energy'] for m in cpu['metrics']]);actual=np.asarray([m['trace_energy'] for m in row['metrics']])
        row['max_trace_energy_relative_error']=float(np.max(abs(actual-ref)/np.maximum(abs(ref),1e-30)))
    out.write_text(json.dumps(report,indent=2),encoding='utf-8')


if __name__=='__main__':main()
