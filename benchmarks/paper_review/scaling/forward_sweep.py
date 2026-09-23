"""Fused forward throughput and device memory over grid sizes on one GPU.

Scene: the dielectric sphere of benchmarks/cuda_kernels.py (4.8 um cube, six CPML faces, float32,
Yee sampling, one point trace, one final snapshot) with the fused CUDA kernel and a CUDA graph.
One warm-up per size, then three measured full simulations. No solver comparison.
"""
import argparse
import gc
import hashlib
import json
import platform
import statistics
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO))

import torch  # noqa: E402
from benchmarks.cuda_kernels import scene  # noqa: E402
from torchfdtd import Simulation  # noqa: E402
from torchfdtd.solver import hardware  # noqa: E402

parser = argparse.ArgumentParser()
parser.add_argument('--sizes', nargs='+', type=int, default=[64, 96, 128, 192, 256, 320, 384, 448, 512])
parser.add_argument('--steps', type=int, default=200)
parser.add_argument('--repeats', type=int, default=3)
parser.add_argument('--output', required=True)
args = parser.parse_args()

sources = [Path(__file__).resolve(), REPO / 'benchmarks/cuda_kernels.py']
data = dict(hardware=hardware(), platform=platform.platform(), torch=torch.__version__, steps=args.steps,
            repeats=args.repeats, method=__doc__,
            source_sha256={p.relative_to(REPO).as_posix() if p.is_relative_to(REPO) else p.name:
                           hashlib.sha256(p.read_bytes()).hexdigest() for p in sources},
            cases=[])
out = Path(args.output)
out.parent.mkdir(parents=True, exist_ok=True)
for n in args.sizes:
    project = scene(n, args.steps)
    project.region.cuda_kernel = 'fused'
    case = dict(n=n, shape=project.region.shape, cells=int(torch.tensor(project.region.shape).prod()), runs=[])
    try:
        for repeat in range(-1, args.repeats):
            gc.collect()
            torch.cuda.empty_cache()
            torch.cuda.reset_peak_memory_stats()
            start = time.perf_counter()
            result = Simulation(project).run()
            wall = time.perf_counter() - start
            row = dict(wall_seconds=wall, loop_seconds=result.summary['seconds'], setup_seconds=result.summary['setup_seconds'],
                       mcells_per_second=result.summary['mcells_per_second'],
                       peak_allocated_bytes=torch.cuda.max_memory_allocated(), peak_reserved_bytes=torch.cuda.max_memory_reserved())
            del result
            if repeat >= 0:
                case['runs'].append(row)
            print(json.dumps(dict(n=n, repeat=repeat, **row)), flush=True)
        case['median'] = {k: statistics.median(r[k] for r in case['runs']) for k in case['runs'][0]}
        case['cell_steps_per_second_loop'] = case['cells'] * args.steps / case['median']['loop_seconds']
    except Exception as exc:  # record the size at which the device refuses, and continue with nothing larger
        case['error'] = repr(exc)
        print(json.dumps(dict(n=n, error=repr(exc))), flush=True)
    data['cases'].append(case)
    out.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    if 'error' in case:
        break
