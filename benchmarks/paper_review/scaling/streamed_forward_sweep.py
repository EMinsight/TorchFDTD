"""Host-streamed forward solves above the eight-million-cell resident limit on one GPU.

Scene: the periodic-x slab fixture of benchmarks/cpu_gpu_adjoint.py (0.1 um mesh, three CPML
cells on the other faces, continuous source) with two point monitors in place of its plane
monitors, since the streamed forward model accepts point monitors only, float32, fused CUDA
kernels, uniform epsilon 1.7 on the CPU.
StreamedSimulation with host state banks is called without gradient tracking, which is the
forward path the package offers above the resident limit. One warm-up per size, then three
measured solves from model construction to the returned signals.
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
from benchmarks.cpu_gpu_adjoint import _MemorySample  # noqa: E402
from torchfdtd import BoundaryFace, Monitor, Project, Region, Source, StreamedAdjointOptions  # noqa: E402
from torchfdtd.streamed import StreamedSimulation  # noqa: E402
from torchfdtd.solver import hardware  # noqa: E402

parser = argparse.ArgumentParser()
parser.add_argument('--sizes', nargs='+', type=int, default=[256, 320, 384, 448])
parser.add_argument('--steps', type=int, default=200)
parser.add_argument('--repeats', type=int, default=3)
parser.add_argument('--gpu-budget-gib', type=float, default=10.)
parser.add_argument('--host-budget-gib', type=float, default=24.)
parser.add_argument('--output', required=True)
args = parser.parse_args()


def project_for(size, steps):
    region = Region(dimension='3d', size=(size * .1,) * 3, mesh=.1, steps=steps,
                    precision='float32', pml_cells=3, cuda_kernel='fused', memory_mode='streamed')
    region.boundaries.x_min = BoundaryFace(kind='periodic')
    region.boundaries.x_max = BoundaryFace(kind='periodic')
    return Project(region=region, sources=[Source(center=(-.2, 0, 0), pulse='continuous')],
                   monitors=[Monitor(name=name, center=(x, 0, 0)) for name, x in (('near', .2), ('far', .3))])


def options_for(size):
    return StreamedAdjointOptions(device='cuda', slab_width=32 if size < 384 else 16, temporal_depth=8, checkpoints=2,
                                  gpu_budget_bytes=int(args.gpu_budget_gib * 1024**3),
                                  host_budget_bytes=int(args.host_budget_gib * 1024**3),
                                  tile_transfers='async', tile_buffers=2)


sources = [Path(__file__).resolve(), REPO / 'benchmarks/cpu_gpu_adjoint.py']
data = dict(hardware=hardware(), platform=platform.platform(), torch=torch.__version__, steps=args.steps,
            repeats=args.repeats, method=__doc__, gpu_budget_gib=args.gpu_budget_gib, host_budget_gib=args.host_budget_gib,
            source_sha256={p.relative_to(REPO).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in sources},
            cases=[])
out = Path(args.output)
out.parent.mkdir(parents=True, exist_ok=True)
for n in args.sizes:
    project = project_for(n, args.steps)
    opts = options_for(n)
    case = dict(n=n, shape=list(project.region.shape), cells=int(torch.tensor(project.region.shape).prod()),
                slab_width=opts.slab_width, temporal_depth=opts.temporal_depth, runs=[])
    try:
        epsilon = torch.full(project.region.shape, 1.7, dtype=torch.float32)
        for repeat in range(-1, args.repeats):
            gc.collect()
            torch.cuda.empty_cache()
            torch.cuda.synchronize()
            torch.cuda.reset_peak_memory_stats()
            with torch.no_grad(), _MemorySample() as rss:
                start = time.perf_counter()
                result = StreamedSimulation(project.model_copy(deep=True), opts)(epsilon)
                torch.cuda.synchronize()
                wall = time.perf_counter() - start
            row = dict(wall_seconds=wall, peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                       peak_reserved_bytes=torch.cuda.max_memory_reserved(),
                       sampled_peak_process_rss_bytes=rss.peak, sampled_rss_growth_bytes=rss.peak - rss.baseline,
                       host_reservation_bytes=result.report.get('host_reservation_bytes'),
                       gpu_reservation_bytes=result.report.get('gpu_reservation_bytes'))
            del result
            if repeat >= 0:
                case['runs'].append(row)
            print(json.dumps(dict(n=n, repeat=repeat, **row)), flush=True)
        case['median'] = {k: statistics.median(r[k] for r in case['runs']) for k in ('wall_seconds', 'peak_allocated_bytes', 'sampled_peak_process_rss_bytes')}
        case['cell_steps_per_second_full'] = case['cells'] * args.steps / case['median']['wall_seconds']
    except Exception as exc:  # record the refusal and stop at this size
        case['error'] = repr(exc)
        print(json.dumps(dict(n=n, error=repr(exc))), flush=True)
    data['cases'].append(case)
    out.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    if 'error' in case:
        break
