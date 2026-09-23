"""Fused forward solves of the cross-solver throughput scenes in single and double precision on one GPU.

The scenes are benchmarks.open_source.scene (vacuum and dielectric sphere, 64^3 and 96^3 cells, 800 steps), the
same projects that benchmarks/cross_solver/torchfdtd_driver.py times against Meep and FDTDX. Only the precision of
the project changes. Full solve = Simulation(project).run() wall time, stepping = the captured loop alone. One
warm-up per case, then the listed repetitions. The double-precision point traces are saved for the comparison
with the double-precision Meep traces.

Usage: python torchfdtd_precision.py --output OUT.json --traces DIR [--repeats 3]
"""
import argparse
import gc
import hashlib
import json
import math
import platform
import statistics
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO))

import numpy as np  # noqa: E402
import torch  # noqa: E402
from benchmarks.open_source import scene  # noqa: E402
from torchfdtd import Simulation  # noqa: E402
from torchfdtd.solver import hardware  # noqa: E402

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
parser.add_argument('--traces', required=True)
parser.add_argument('--repeats', type=int, default=3)
args = parser.parse_args()
traces = Path(args.traces)
traces.mkdir(parents=True, exist_ok=True)

sources = [Path(__file__).resolve(), REPO / 'benchmarks/open_source.py']
record = dict(hardware=hardware(), platform=platform.platform(), torch=torch.__version__,
              method=__doc__.strip(), repeats=args.repeats,
              source_sha256={p.relative_to(REPO).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in sources},
              cases=[])
out = Path(args.output)
out.parent.mkdir(parents=True, exist_ok=True)
for precision in ('float64', 'float32'):
    for kind in ('sphere', 'vacuum'):
        for n in (64, 96):
            project = scene(kind, n, 800)
            project.region.precision = precision
            r = project.region
            case = dict(name=f'{kind}-{n}', precision=precision, shape=list(r.shape), cells=math.prod(r.shape),
                        steps=r.steps, dt_s=r.time_step, runs=[])
            for repeat in range(-1, args.repeats):
                gc.collect()
                torch.cuda.empty_cache()
                torch.cuda.synchronize()
                torch.cuda.reset_peak_memory_stats()
                start = time.perf_counter()
                result = Simulation(project).run()
                torch.cuda.synchronize()
                wall = time.perf_counter() - start
                trace = np.asarray(result.signals[:, 0], dtype=np.float64)
                row = dict(wall_seconds=wall, loop_seconds=result.summary['seconds'],
                           setup_seconds=result.summary['setup_seconds'], cuda_graph=result.summary.get('cuda_graph'),
                           peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                           trace_sha256=hashlib.sha256(trace.tobytes()).hexdigest())
                print(json.dumps(dict(case=case['name'], precision=precision, repeat=repeat, **row)), flush=True)
                if repeat >= 0:
                    case['runs'].append(row)
                del result
            np.save(traces / f'torchfdtd_{precision}_{kind}-{n}_trace.npy', trace)
            case['median_wall_seconds'] = statistics.median(x['wall_seconds'] for x in case['runs'])
            case['median_loop_seconds'] = statistics.median(x['loop_seconds'] for x in case['runs'])
            case['cell_steps_per_second_full'] = case['cells'] * case['steps'] / case['median_wall_seconds']
            case['cell_steps_per_second_stepping'] = case['cells'] * case['steps'] / case['median_loop_seconds']
            case['trace_file'] = f'torchfdtd_{precision}_{kind}-{n}_trace.npy'
            record['cases'].append(case)
            out.write_bytes((json.dumps(record, indent=2) + '\n').encode('utf-8'))
print('wrote', out)
