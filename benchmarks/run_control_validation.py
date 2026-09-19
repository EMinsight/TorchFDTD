"""Native full-duration vs automatic decay termination, with DFT error checks."""
import argparse
import gc
import json
from pathlib import Path
import statistics
import time

import numpy as np
import torch

from photonweave import RunControl, Simulation, SpectrumSettings, TimeSignal
from photonweave.solver import hardware
from .cuda_kernels import scene


def zero_area_pulse(project):
    """A native sampled current obtained by differencing a finite dipole pulse.

    An ordinary truncated soft Gaussian current can leave a static charge.
    Use a discrete zero-area waveform for the decay timing case, without
    changing the original Gaussian implementation or relaxing the threshold.
    """
    r, s = project.region, project.sources[0]
    dt = r.courant_factor/np.sqrt(3)*r.mesh*1e-6/299792458.
    f = 299792458./(s.wavelength*1e-6)
    sigma = s.pulse_cycles/f
    n = int(np.ceil(12*sigma/dt))
    times = np.arange(n+1)*dt
    x = times-times[-1]/2
    dipole = np.exp(-.5*(x/sigma)**2)*np.cos(2*np.pi*f*x)
    dipole[[0,-1]] = 0
    current = np.r_[0.,np.diff(dipole),0.]
    current /= np.max(abs(current))
    s.pulse='sampled'
    s.signal=TimeSignal(time_s=(np.arange(n+2)*dt).tolist(),
                        amplitude=current.tolist(),phase_rad=[np.pi/2]*(n+2))


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--size',type=int,default=64)
    ap.add_argument('--steps',type=int,default=4000)
    ap.add_argument('--repeats',type=int,default=3)
    ap.add_argument('--output',default='results/run-control/validation.json')
    args=ap.parse_args()
    p=scene(args.size,args.steps)
    p.region.cuda_kernel='fused'
    p.monitors[0].spectrum=SpectrumSettings(sampling='frequency',frequency_points=31,apodization='none')
    p.region.run_control=RunControl(auto_shutoff=True,check_interval=50,decay_threshold=1e-7)
    residual=Simulation(p).run()
    residual_check={k:residual.summary[k] for k in ('steps','termination_reason','source_end_s','diagnostics')}
    zero_area_pulse(p)
    controls={
        'fixed_unchecked':RunControl(divergence_check=False),
        'fixed_checked':RunControl(check_interval=50),
        'decay_checked':RunControl(auto_shutoff=True,check_interval=50,decay_threshold=1e-7),
    }
    data=dict(hardware=hardware(),project=p.model_dump(),
              method=f'Native 3D sphere driven by a sampled zero-area current, with the original Gaussian residual case recorded separately. Fused CUDA with graph capture. Identical source, grid and explicit DFT frequencies across the three timed modes. One warmup per mode, {args.repeats} alternating measured repetitions. End-to-end wall includes setup and transfers. A full-duration unchecked solve is a timing baseline, not an external accuracy reference. Diagnostic host time includes waiting for preceding queued GPU steps and is not isolated device cost.',
              original_gaussian_residual=residual_check,
              controls={k:v.model_dump() for k,v in controls.items()},runs={k:[] for k in controls},comparisons=[])
    for repeat in range(-1,args.repeats):
        results={}
        for mode in (list(controls) if repeat%2==0 else list(reversed(controls))):
            p.region.run_control=controls[mode]
            gc.collect();torch.cuda.empty_cache();torch.cuda.reset_peak_memory_stats()
            start=time.perf_counter();result=Simulation(p).run();wall=time.perf_counter()-start
            if repeat<0:continue
            row=dict(wall_seconds=wall,loop_seconds=result.summary['seconds'],
                     diagnostic_seconds=result.summary['diagnostic_seconds'],steps=result.summary['steps'],
                     termination_reason=result.summary['termination_reason'],peak_allocated_bytes=torch.cuda.max_memory_allocated())
            data['runs'][mode].append(row)
            results[mode]=result
            print(json.dumps(dict(repeat=repeat,mode=mode,**row)),flush=True)
        if repeat>=0:
            full,checked,decay=(results[k] for k in controls)
            n=len(decay.times)
            scale=np.linalg.norm(full.spectra[0]['value'])
            comparison=dict(
                full_diagnostics_identical=bool(np.array_equal(full.electric,checked.electric) and np.array_equal(full.magnetic,checked.magnetic)),
                prefix_identical=bool(np.array_equal(decay.signals,full.signals[:n])),
                dft_relative_l2=float(np.linalg.norm(decay.spectra[0]['value']-full.spectra[0]['value'])/scale),
                omitted_trace_relative_l2=float(np.linalg.norm(full.signals[n:])/np.linalg.norm(full.signals)))
            assert comparison['full_diagnostics_identical'] and comparison['prefix_identical']
            assert comparison['dft_relative_l2']<.001
            assert decay.summary['auto_shutoff'] and not decay.summary['cancelled']
            data['comparisons'].append(comparison)
    data['medians']={mode:{key:statistics.median(row[key] for row in rows)
                           for key in ('wall_seconds','loop_seconds','diagnostic_seconds','steps','peak_allocated_bytes')}
                     for mode,rows in data['runs'].items()}
    fixed,checked,decay=(data['medians'][k] for k in controls)
    data['wall_speedup_vs_fixed_unchecked']=fixed['wall_seconds']/decay['wall_seconds']
    data['wall_speedup_vs_fixed_checked']=checked['wall_seconds']/decay['wall_seconds']
    data['checked_wall_overhead_fraction']=checked['wall_seconds']/fixed['wall_seconds']-1
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(data,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    print(json.dumps({k:v for k,v in data.items() if k.startswith(('wall_','checked_'))}),flush=True)


if __name__=='__main__':main()
