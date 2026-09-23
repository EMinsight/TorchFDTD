"""Resident and host-streamed adjoint of benchmarks/cpu_gpu_adjoint.py over grid sizes, GPU modes only.

Usage:  python adjoint_sweep.py --modes cuda_resident,cuda_dram --size 256 --output OUT.json
        [--slab-width 32] [--headroom-gib 16] [--plan-only]
The benchmark source is unchanged. The wrapper
  - drops the CPU modes and keeps the GPU policies named in --modes,
  - holds the plane-monitor stride at 32 above 256^3 (the monitor model caps it there),
  - optionally lowers the host RAM headroom the benchmark keeps free (16 GiB by default),
and writes every override into the record under "sweep_overrides".
"""
import argparse
import json
import statistics
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO))

import benchmarks.cpu_gpu_adjoint as bench  # noqa: E402

parser = argparse.ArgumentParser()
parser.add_argument('--modes', required=True)
parser.add_argument('--size', type=int, required=True)
parser.add_argument('--output', required=True)
parser.add_argument('--repeats', type=int, default=3)
parser.add_argument('--slab-width', type=int, default=32)
parser.add_argument('--gpu-budget-gib', type=float, default=10.)
parser.add_argument('--host-budget-gib', type=float, default=24.)
parser.add_argument('--headroom-gib', type=float, default=16.)
parser.add_argument('--plan-only', action='store_true')
args = parser.parse_args()
keep = set(args.modes.split(','))
headroom = int(args.headroom_gib * 1024**3)

_policies, _fixture, _preflight, _require = bench.policies, bench.fixture, bench.preflight, bench.require_headroom
G = _fixture.__globals__


def selected(ns):
    return {name: value for name, value in _policies(ns).items() if name in keep}


def summary(records, cpu_names):
    medians = {name: statistics.median(row['seconds'] for row in rows) for name, rows in records.items()}
    return dict(median_seconds=medians, fastest_tested_cpu=None, speedup_over_fastest_tested_cpu={},
                cpu_reference='omitted: GPU size sweep')


def capped_fixture(size, steps):
    if size <= 256:
        return _fixture(size, steps)
    region = G['Region'](dimension='3d', size=(size * .1,) * 3, mesh=.1, steps=steps,
                         precision='float32', pml_cells=3, cuda_kernel='fused', memory_mode='streamed')
    region.boundaries.x_min = G['BoundaryFace'](kind='periodic')
    region.boundaries.x_max = G['BoundaryFace'](kind='periodic')
    span = (size - 8) * .1
    return G['Project'](region=region, sources=[G['Source'](center=(-.2, 0, 0), pulse='continuous')],
                        monitors=[G['FieldMonitor'](id=name, center=(x, 0, 0), size=(0, span, span), normal='x', downsample=32)
                                  for name, x in (('near', .2), ('far', .3))])


bench.policies = selected
bench.summarize = summary
bench.fixture = capped_fixture
bench.preflight = lambda project, candidates, dispersive, host_budget, _h: _preflight(project, candidates, dispersive, host_budget, headroom)
bench.require_headroom = lambda need, _h: _require(need, headroom)

argv = ['--output', args.output, '--size', str(args.size), '--steps', '128', '--repeats', str(args.repeats),
        '--cpu-threads', '1', '--gpu-host-threads', '4', '--checkpoints', '2', '--slab-width', str(args.slab_width),
        '--temporal-depth', '8', '--gpu-budget-gib', str(args.gpu_budget_gib), '--host-budget-gib', str(args.host_budget_gib)]
if not args.plan_only:
    argv.append('--execute')
try:
    bench.main(argv)
finally:
    out = Path(args.output)
    if out.exists():
        record = json.loads(out.read_text(encoding='utf-8'))
        record['host_headroom_bytes'] = headroom
        record['sweep_overrides'] = dict(
            modes=sorted(keep), cpu_modes='omitted',
            monitor_downsample='size//8 up to 256^3, 32 above (monitor model limit)',
            host_headroom_gib=args.headroom_gib, slab_width=args.slab_width,
            gpu_budget_gib=args.gpu_budget_gib, host_budget_gib=args.host_budget_gib,
            driver='.local/paper_review/scaling/adjoint_sweep.py')
        out.write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
