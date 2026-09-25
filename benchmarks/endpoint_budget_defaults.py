"""Endpoint runs with the old fixed budget defaults against the derived defaults.

tensor_budget_bytes and host_preparation_budget_bytes only admit a planned
payload; neither sets a chunk, slot or checkpoint count. Each case runs one
forward and material VJP through EndpointProject, alternating the old defaults
(256 MB tensor, 64 MB host preparation) and the new ones (None, derived from
free CUDA or available host memory), and records wall times, the executed
step counts of every run, the GPU load around every CUDA timing, and the peak
memory of the derived-default run against the memory it was derived from.
--cases splits a device run into short pieces; --merge takes every piece.

  python benchmarks/endpoint_budget_defaults.py --device cuda --cases closed:32 closed:64 --output cuda-a.json
  python benchmarks/endpoint_budget_defaults.py --device cpu --output cpu.json
  python benchmarks/endpoint_budget_defaults.py --merge cpu.json cuda-a.json cuda-b.json --output docs/validation/endpoint_budget_defaults.json
"""
import argparse
import datetime
import json
import os
import platform
import statistics
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT/'benchmarks'))

OLD = dict(tensor_budget_bytes=256_000_000, host_preparation_budget_bytes=64_000_000)
# (kind, cells per axis) per device. The CPU reference is limited to 32768 cells.
CASES = {
    'cuda': [('closed', 32), ('closed', 64), ('closed', 80), ('cpml', 32), ('cpml', 48), ('cpml', 64), ('closed', 100)],
    'cpu': [('closed', 12), ('closed', 20), ('closed', 30), ('cpml', 16), ('cpml', 20), ('cpml', 24)],
}
STEPS = {'cuda': 400, 'cpu': 200}
REPEATS = 3
SOURCE_STATE = ('recorded from the uncommitted working tree on top of environment.commit; the code measured is the '
                'commit that adds this record')
BUDGET_ROLE = ('tensor_budget_bytes and host_preparation_budget_bytes are only compared with the planned payload '
               '(EndpointSimulation/EndpointCPMLSimulation constructors and memory_plan checks, EndpointProject._admit); the '
               'checkpoint count and the raster chunk size are separate arguments, so a budget cannot change the executed work. '
               'identical_work compares the executed step counts of every old- and new-default run.')
EXECUTION_KEYS = ('forward_steps', 'replayed_steps', 'reverse_steps', 'checkpoint_saves', 'peak_checkpoints')


def project(kind, cells, steps, device):
    from torchfdtd.models import Material, Monitor, Project, Region, Source, Structure
    size = cells*.1
    faces = {a+'_'+s: {'kind': 'pmc'} for a in 'xyz' for s in ('min', 'max')}
    if kind == 'cpml':
        faces['x_min'] = faces['x_max'] = {'kind': 'pml', 'alpha': 0, 'layers': 4, 'sigma_scale': .3}
    region = Region(dimension='3d', size=(size,)*3, mesh=.1, steps=steps, pml_cells=4, material_sampling='yee',
                    backend=device, boundaries=faces)
    return Project(region=region, materials=[Material(name='core', index=1.5)],
                   structures=[Structure(material='core', center=(0, 0, 0), size=(size/4,)*3)],
                   sources=[Source(component='Ez', center=(0, 0, 0), pulse='continuous')],
                   monitors=[Monitor(component='Ez', center=(.1, 0, 0)), Monitor(component='Hy', center=(.1, 0, 0))])


def run_once(p, device, budgets):
    import torch
    from torchfdtd.endpoint_project import endpoint_from_project
    sync = torch.cuda.synchronize if device == 'cuda' else (lambda: None)
    sync()
    start = time.perf_counter()
    adapter = endpoint_from_project(p, device=device, checkpoints=4, **budgets)
    epsilon = adapter.rasterize().requires_grad_()
    sync()
    built = time.perf_counter()
    result = adapter(epsilon)
    gradient, = torch.autograd.grad(result.signals.square().sum(), epsilon)
    sync()
    done = time.perf_counter()
    assert bool(torch.isfinite(gradient).all())
    execution = {k: adapter.simulation.last_report[k] for k in EXECUTION_KEYS}
    return adapter, dict(build_seconds=built-start, run_seconds=done-built, total_seconds=done-start, execution=execution)


def measure(kind, cells, device):
    """One case in a fresh process: peak of the first derived-default run, then alternating timings."""
    import psutil
    import torch
    torch.set_num_threads(2)
    from torchfdtd.memory_profile import host_memory
    p = project(kind, cells, STEPS[device], device)
    report = dict(kind=kind, cells_per_axis=cells, cells=cells**3, steps=STEPS[device], device=device, checkpoints=4)
    process = psutil.Process()
    host_before = process.memory_info()
    report['host_available_bytes'] = host_memory()['available_bytes']
    if device == 'cuda':
        torch.cuda.synchronize()
        # Under WDDM the runtime reading of one process ignores other processes'
        # allocations; admission takes the smaller of it and NVML's device-wide reading.
        from torchfdtd.cuda_memory import cuda_mem_info, nvml_free_bytes
        report['cuda_runtime_free_bytes'], report['cuda_total_bytes'] = torch.cuda.mem_get_info()
        report['cuda_nvml_free_bytes'] = nvml_free_bytes(torch.device('cuda', torch.cuda.current_device()))
        report['cuda_free_bytes'] = cuda_mem_info()[0]
        allocated = torch.cuda.memory_allocated()
        torch.cuda.reset_peak_memory_stats()
    adapter, first = run_once(p, device, {})
    plan = adapter.simulation.memory_plan(p.region.steps)
    preparation = adapter.plan()['memory']['adapter_host_preparation_bytes']
    # The None budgets are derived at each admission for the bytes admitted.
    from torchfdtd.pmc_simulation import derived_budget_bytes
    report.update(first_run_new_default=first,
                  derived_tensor_budget_bytes=derived_budget_bytes(adapter.simulation.device, plan['tensor_upper_bound_bytes']),
                  derived_host_preparation_budget_bytes=derived_budget_bytes('cpu', preparation),
                  planned_tensor_bytes=plan['tensor_upper_bound_bytes'], planned_host_preparation_bytes=preparation)
    host_after = process.memory_info()
    report.update(host_peak_growth_bytes=host_after.peak_pagefile-host_before.private,
                  host_new_process_peak=host_after.peak_pagefile > host_before.peak_pagefile)
    if device == 'cuda':
        torch.cuda.synchronize()
        report['cuda_peak_allocated_growth_bytes'] = torch.cuda.max_memory_allocated()-allocated
        report['cuda_peak_reserved_bytes'] = torch.cuda.max_memory_reserved()
        report['peak_over_available'] = report['cuda_peak_allocated_growth_bytes']/report['cuda_free_bytes']
    else:
        report['peak_over_available'] = report['host_peak_growth_bytes']/report['host_available_bytes']
    del adapter
    try:
        run_once(p, device, OLD)
        report['old_default_admits'] = True
    except ValueError as error:
        report.update(old_default_admits=False, old_default_refusal=str(error))
    timings = {'old': [], 'new': []}
    for repeat in range(REPEATS):
        for mode, budgets in (('old', OLD), ('new', {})):
            if mode == 'old' and not report['old_default_admits']:
                continue
            # The GPU is shared: read its load just outside every timed run.
            before = load() if device == 'cuda' else None
            timing = run_once(p, device, budgets)[1]
            if device == 'cuda':
                timing.update(gpu_load_before=before, gpu_load_after=load())
            timings[mode].append(dict(timing, repeat=repeat))
    report['runs'] = {mode: values for mode, values in timings.items() if values}
    works = {json.dumps(v['execution'], sort_keys=True) for values in timings.values() for v in values}
    report.update(identical_work=len(works) == 1, execution=json.loads(next(iter(works))))
    for mode, values in timings.items():
        if not values:
            continue
        summary = {}
        for key in ('build_seconds', 'run_seconds', 'total_seconds'):
            series = [v[key] for v in values]
            summary[key] = dict(values=series, median=statistics.median(series), min=min(series), max=max(series))
        report[mode+'_default'] = summary
    if report['old_default_admits']:
        report['new_over_old_median_total'] = report['new_default']['total_seconds']['median']/report['old_default']['total_seconds']['median']
    return report


def load():
    """GPU utilization and memory of every process, as seen by nvidia-smi."""
    try:
        out = subprocess.run(['nvidia-smi', '--query-gpu=utilization.gpu,memory.used,memory.total', '--format=csv,noheader,nounits'],
                             capture_output=True, text=True, timeout=20).stdout.strip()
        used = out.split(',')
        return dict(utilization_percent=int(used[0]), memory_used_mib=int(used[1]), memory_total_mib=int(used[2]))
    except Exception as error:  # noqa: BLE001  (a record without a reading states why)
        return dict(error=str(error))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--device', choices=('cpu', 'cuda'))
    parser.add_argument('--case', nargs=2)
    parser.add_argument('--cases', nargs='+', help='kind:cells entries, a subset of CASES for one device run')
    parser.add_argument('--output')
    parser.add_argument('--merge', nargs='+')
    args = parser.parse_args()
    if args.case:
        print(json.dumps(measure(args.case[0], int(args.case[1]), args.device)))
        return
    if args.merge:
        parts = [json.loads(Path(p).read_text()) for p in args.merge]
        cases = [c for part in parts for c in part['cases']]
        ratios = [c['new_over_old_median_total'] for c in cases if 'new_over_old_median_total' in c]
        record = dict(schema='torchfdtd.endpoint_budget_defaults.v2', budget_role=BUDGET_ROLE,
                      old_defaults=OLD, new_defaults='None: tensor budget = 80% of free CUDA memory (cuda_budget_limit) or of available host memory; '
                                                     'host preparation budget = 80% of available host memory; derived when the adapter is built',
                      workload='EndpointProject, point Ez source and two point monitors, a centred index-1.5 cube, checkpoints=4, one forward '
                               'and one material VJP; closed = PMC on every face, cpml = PML on both x faces (4 layers) and PMC elsewhere',
                      timing=f'{REPEATS} repeats per default after one untimed derived-default run, old and new alternating in one process '
                             '(runs.*.repeat); build = adapter construction and rasterization, run = forward and VJP. On CUDA every '
                             'run carries the nvidia-smi utilization and memory in use (all processes) just before and after it.',
                      peak='first derived-default run in a fresh process: CUDA allocator allocated growth against the admission '
                           'reading of free CUDA memory at start (cuda_free_bytes, the smaller of the runtime reading cuda_runtime_free_bytes '
                           'and the device-wide NVML reading cuda_nvml_free_bytes); CPU: peak private bytes growth against available host '
                           'memory (host_new_process_peak marks a resolved peak)',
                      steps=STEPS, cases_per_device=CASES, source_state=SOURCE_STATE,
                      environments=[dict(p['environment'], device=p['device']) for p in parts], cases=cases,
                      identical_work=all(c['identical_work'] for c in cases),
                      new_over_old_median_total_range=[min(ratios), max(ratios)] if ratios else None,
                      maximum_peak_over_available=max(c['peak_over_available'] for c in cases),
                      refused_by_old_defaults=[f"{c['device']} {c['kind']} {c['cells_per_axis']}^3" for c in cases if not c['old_default_admits']])
        Path(args.output).write_text(json.dumps(record, indent=2)+'\n', newline='\n')
        print(json.dumps(record['new_over_old_median_total_range']))
        return
    import torch
    env = dict(os.environ, OMP_NUM_THREADS='2', MKL_NUM_THREADS='2')
    environment = dict(python=platform.python_version(), torch=torch.__version__, os=platform.platform(), threads=2)
    if args.device == 'cuda':
        environment.update(gpu=torch.cuda.get_device_name(), load_at_start=load())
    else:
        environment['cpu'] = platform.processor()
    from provenance import git_revision
    environment['commit'] = git_revision(ROOT)
    environment['recorded_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
    cases = []
    selected = CASES[args.device] if not args.cases else [(c.split(':')[0], int(c.split(':')[1])) for c in args.cases]
    for kind, cells in selected:
        before = load() if args.device == 'cuda' else None
        out = subprocess.run([sys.executable, __file__, '--case', kind, str(cells), '--device', args.device],
                             capture_output=True, text=True, env=env, cwd=ROOT)
        if out.returncode:
            raise SystemExit(f'{kind} {cells}: {out.stderr[-3000:]}')
        case = json.loads(out.stdout.strip().splitlines()[-1])
        if args.device == 'cuda':
            case['gpu_load_before'], case['gpu_load_after'] = before, load()
        print(json.dumps({k: case.get(k) for k in ('kind', 'cells_per_axis', 'old_default_admits', 'new_over_old_median_total',
                                                   'planned_tensor_bytes', 'peak_over_available')}), flush=True)
        cases.append(case)
    environment['load_at_end'] = load() if args.device == 'cuda' else None
    Path(args.output).write_text(json.dumps(dict(device=args.device, environment=environment, cases=cases), indent=2)+'\n', newline='\n')


if __name__ == '__main__':
    main()
