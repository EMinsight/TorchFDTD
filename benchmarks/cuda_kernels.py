"""Reproducible native CUDA baseline vs fused updates, including field error."""
import argparse
import gc
import json
import platform
import statistics
import time
from pathlib import Path

import numpy as np
import torch

from photonweave import Project, Region, Structure, Source, Monitor, Simulation, Material
from photonweave.solver import hardware


def scene(n, steps):
    return Project(name=f'Native dielectric sphere {n}',
                   region=Region(dimension='3d', size=(4.8, 4.8, 4.8), mesh=4.8/n,
                                 pml_cells=8, steps=steps, precision='float32',
                                 material_sampling='yee', backend='cuda', snapshot_interval=steps),
                   materials=[Material(name='dielectric', index=1.444)],
                   structures=[Structure(kind='sphere', radius=.5, material='dielectric')],
                   sources=[Source(center=(-1.2, 0, 0), wavelength=1.55, pulse_cycles=2)],
                   monitors=[Monitor(center=(1.2, 0, 0))])


def relative(a, b):
    return float(np.linalg.norm(a.astype(np.float64)-b)/max(np.linalg.norm(b.astype(np.float64)), 1e-30))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sizes', nargs='+', type=int, default=[64, 96, 128])
    ap.add_argument('--steps', type=int, default=800)
    ap.add_argument('--repeats', type=int, default=3)
    ap.add_argument('--output', default='results/cuda-kernels/validation.json')
    args = ap.parse_args()
    data = dict(hardware=hardware(), platform=platform.platform(), numpy=np.__version__,
                method='Identical native dielectric sphere, Yee material sampling, float32, six CPML faces, Gaussian soft dipole, one point trace, one final snapshot. One warmup per size/kernel then paired repeated full simulations. CUDA graph enabled for both. Loop and end-to-end wall times separated. CUDA events are not used for end-to-end timing. No other solver comparison.',
                cases=[])
    for n in args.sizes:
        p = scene(n, args.steps)
        case = dict(shape=p.region.shape, project=p.model_dump(), runs={'torch': [], 'fused': []})
        reference = None
        for repeat in range(-1, args.repeats):
            # Alternate measured order to reduce clock/thermal ordering bias.
            order = ('torch', 'fused') if repeat % 2 == 0 else ('fused', 'torch')
            for kernel in order:
                p.region.cuda_kernel = kernel
                gc.collect()
                torch.cuda.empty_cache()
                torch.cuda.reset_peak_memory_stats()
                start = time.perf_counter()
                result = Simulation(p).run()
                wall = time.perf_counter()-start
                if repeat < 0:
                    del result
                    continue
                row = dict(loop_seconds=result.summary['seconds'], setup_seconds=result.summary['setup_seconds'],
                           wall_seconds=wall, peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                           peak_reserved_bytes=torch.cuda.max_memory_reserved(),
                           mcells_per_second=result.summary['mcells_per_second'])
                case['runs'][kernel].append(row)
                if kernel == 'torch':
                    reference = result
                else:
                    candidate = result
                print(json.dumps(dict(n=n, repeat=repeat, kernel=kernel, **row)), flush=True)
            if repeat >= 0:
                case['electric_relative_l2'] = relative(candidate.electric, reference.electric)
                case['magnetic_relative_l2'] = relative(candidate.magnetic, reference.magnetic)
                case['trace_relative_l2'] = relative(candidate.signals, reference.signals)
                print(json.dumps(dict(n=n, errors={key:case[key] for key in ('electric_relative_l2','magnetic_relative_l2','trace_relative_l2')},
                                      electric_max_abs=float(np.max(abs(candidate.electric-reference.electric))),
                                      reference_peak=float(np.max(abs(reference.electric))),
                                      candidate_peak=float(np.max(abs(candidate.electric))),
                                      trace_peak=float(np.max(abs(reference.signals))))), flush=True)
                if max(case[key] for key in ('electric_relative_l2','magnetic_relative_l2','trace_relative_l2')) > 1e-4:
                    raise AssertionError('Fused field error exceeds the declared tolerance.')
                del candidate, reference
        med = {kernel: {key:statistics.median(row[key] for row in rows) for key in rows[0]}
               for kernel, rows in case['runs'].items()}
        case['median'] = med
        case['loop_speedup'] = med['torch']['loop_seconds']/med['fused']['loop_seconds']
        case['wall_speedup'] = med['torch']['wall_seconds']/med['fused']['wall_seconds']
        data['cases'].append(case)
        target = Path(args.output)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(json.dumps(data, indent=2), encoding='utf-8')
        print(json.dumps({key:val for key,val in case.items() if key not in ('project','runs')}), flush=True)


if __name__ == '__main__':
    main()
