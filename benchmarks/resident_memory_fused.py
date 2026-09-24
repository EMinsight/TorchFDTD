"""Peak CUDA memory of resident Simulation runs against the resident estimate.

Each case runs in a fresh process (``--case NAME`` prints one JSON line), so the
Torch allocator starts empty and its peak counters describe that run alone. The
driver runs the cases one after another and writes the record: device, driver,
library versions, source hashes, each case's project, the peak allocated and
reserved Torch bytes and ``estimate(project)``. The forward run is the public
``Simulation(project).run()`` with its CUDA graph, run-control diagnostics and
snapshot frames.

    python benchmarks/resident_memory_fused.py --output docs/validation/resident_memory_fused_3060.json

``--wrap`` prefixes every case process, for example with a GPU slot lock; the
text ``{vram_mib}`` in it is replaced by the case's estimate plus 512 MiB.
"""
import argparse
import hashlib
import json
import math
import platform
import shlex
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from benchmarks.provenance import git_revision  # noqa: E402

MESH = .05
PML = 10
STEPS = 60
SOURCES = ('torchfdtd/models.py', 'torchfdtd/solver.py', 'torchfdtd/boundaries.py', 'torchfdtd/cuda_kernels.py',
           'torchfdtd/cuda_monitors.py', 'torchfdtd/cuda_diagnostics.py', 'torchfdtd/cuda_graph.py',
           'torchfdtd/field_monitors.py', 'torchfdtd/materials.py', 'torchfdtd/run_control.py', 'torchfdtd/plan.py',
           'torchfdtd/tensor_batch.py', 'torchfdtd/cuda_batch.py', 'benchmarks/resident_memory_fused.py')


def _case(shape, precision='float32', kernel='fused', boundary='cpml', plane=False, poles=0, sampling='cell', batch=1,
          monitor_kernel=None, graph_steps=1):
    return dict(shape=shape, precision=precision, kernel=kernel, monitor_kernel=monitor_kernel or kernel, boundary=boundary,
                plane=plane, poles=poles, sampling=sampling, batch=batch, graph_steps=graph_steps)


CUBES = {'1m': (100, 100, 100), '4m': (160, 160, 160), '16m': (252, 252, 252), '32m': (320, 320, 320), '64m': (400, 400, 400)}
CASES = {
    **{f'fused-f32-cpml-{k}': _case(CUBES[k]) for k in ('1m', '4m', '16m', '64m')},
    'fused-f32-cpml-slab-64m': _case((1000, 1000, 64)),
    'fused-f32-cpml-slab-plane-64m': _case((1000, 1000, 64), plane=True),
    **{f'fused-f32-periodic-{k}': _case(CUBES[k], boundary='periodic') for k in ('4m', '16m', '64m')},
    **{f'fused-f32-plane-{k}': _case(CUBES[k], plane=True) for k in ('4m', '16m')},
    'fused-f32-torchplane-4m': _case(CUBES['4m'], plane=True, monitor_kernel='torch'),
    **{f'fused-f32-yee-{k}': _case(CUBES[k], sampling='yee') for k in ('4m', '16m')},
    **{f'fused-f32-lorentz-{k}': _case(CUBES[k], poles=1) for k in ('4m', '16m')},
    'fused-f32-multipole2-4m': _case(CUBES['4m'], poles=2),
    'fused-f32-multipole3-4m': _case(CUBES['4m'], poles=3),
    'fused-f32-yee-lorentz-4m': _case(CUBES['4m'], poles=1, sampling='yee'),
    'fused-f32-yee-multipole2-4m': _case(CUBES['4m'], poles=2, sampling='yee'),
    # cuda_graph_steps=8 captures a second graph, with its own pool of step temporaries.
    'fused-f32-lorentz-graph8-4m': _case(CUBES['4m'], poles=1, graph_steps=8),
    'fused-f32-multipole2-graph8-4m': _case(CUBES['4m'], poles=2, graph_steps=8),
    'fused-f32-multipole3-graph8-4m': _case(CUBES['4m'], poles=3, graph_steps=8),
    'fused-f32-yee-lorentz-graph8-4m': _case(CUBES['4m'], poles=1, sampling='yee', graph_steps=8),
    'fused-f32-yee-multipole2-graph8-4m': _case(CUBES['4m'], poles=2, sampling='yee', graph_steps=8),
    'fused-f32-cpml-graph8-16m': _case(CUBES['16m'], graph_steps=8),
    'fused-f32-plane-graph8-4m': _case(CUBES['4m'], plane=True, graph_steps=8),
    'fused-f32-torchplane-graph8-4m': _case(CUBES['4m'], plane=True, monitor_kernel='torch', graph_steps=8),
    **{f'fused-f64-cpml-{k}': _case(CUBES[k], precision='float64') for k in ('1m', '4m', '16m', '32m')},
    'fused-f64-lorentz-4m': _case(CUBES['4m'], precision='float64', poles=1),
    'fused-f64-multipole2-4m': _case(CUBES['4m'], precision='float64', poles=2),
    'fused-f64-lorentz-graph8-4m': _case(CUBES['4m'], precision='float64', poles=1, graph_steps=8),
    'fused-f64-plane-4m': _case(CUBES['4m'], precision='float64', plane=True),
    **{f'torch-f32-cpml-{k}': _case(CUBES[k], kernel='torch') for k in ('1m', '4m', '16m')},
    'torch-f32-lorentz-4m': _case(CUBES['4m'], kernel='torch', poles=1),
    'torch-f64-cpml-4m': _case(CUBES['4m'], kernel='torch', precision='float64'),
    'tensor-batch-f32-2x16m': _case(CUBES['16m'], batch=2),
    'tensor-batch-f32-lorentz-graph8-2x4m': _case(CUBES['4m'], poles=1, batch=2, graph_steps=8),
}


def project(case, index=0):
    """The case scene: a dielectric block, or a dispersive block filling the grid, a point source and probe."""
    from torchfdtd import BoundaryFace, FieldMonitor, LorentzPole, Material, Monitor, Project, Region, Source
    from torchfdtd.models import ProjectLimits, default_materials
    nx, ny, nz = case['shape']
    size = (nx*MESH, ny*MESH, nz*MESH)
    faces = {} if case['boundary'] == 'cpml' else {f'{a}_{s}': BoundaryFace(kind='periodic') for a in 'xyz' for s in ('min', 'max')}
    region = Region(dimension='3d', size=size, mesh=MESH, pml_cells=PML, steps=STEPS, backend='cuda',
                    cuda_kernel=case['kernel'], cuda_monitor_kernel=case['monitor_kernel'], precision=case['precision'],
                    material_sampling=case['sampling'], resident_cell_limit=None, snapshot_interval=20, boundaries=faces)
    materials = default_materials()
    if case['poles']:
        poles = [LorentzPole(resonance_rad_s=2e15*(k+1), strength_rad_s_squared=2e30, damping_rad_s=1e14) for k in range(case['poles'])]
        materials.append(Material(name='dispersive', model='multipole', epsilon_inf=2., poles=poles))
        block = dict(center=(0, 0, 0), size=size, material='dispersive')
    else:
        block = dict(center=(0, 0, 0), size=tuple(s/2 for s in size))
    monitors = [Monitor(id='probe', center=(4*MESH, 0, 0))]
    if case['plane']:
        span = tuple(s - 2*(PML+1)*MESH for s in size[:2])
        monitors.append(FieldMonitor(id='plane', normal='z', center=(0, 0, size[2]/4), size=(*span, 0),
                                     spectrum=dict(sampling='frequency', wavelength_start=1.0, wavelength_stop=1.2,
                                                   frequency_points=5, apodization='none')))
    return Project(name=f'memory {index}', region=region, limits=ProjectLimits(max_monitor_samples=None), materials=materials,
                   structures=[dict(id='block', **block)], sources=[Source(id='source', center=(0, 0, 0), wavelength=1.1)],
                   monitors=monitors)


def run_case(name):
    import torch
    from torchfdtd import Simulation
    from torchfdtd.solver import estimate
    case = CASES[name]
    projects = [project(case, i) for i in range(case['batch'])]
    torch.cuda.init()
    torch.cuda.synchronize()
    base_allocated, base_reserved = torch.cuda.memory_allocated(), torch.cuda.memory_reserved()
    torch.cuda.reset_peak_memory_stats()
    started = time.perf_counter()
    if case['batch'] == 1:
        result = Simulation(projects[0]).run(cuda_graph_steps=case['graph_steps'])
        finite = bool(torch.isfinite(torch.as_tensor(result.electric)).all())
    else:
        from torchfdtd import run_tensor_batch
        report = run_tensor_batch(projects, memory_fraction=.9, cuda_graph_steps=case['graph_steps'])
        report.raise_for_errors()
        finite = all(bool(torch.isfinite(torch.as_tensor(item.result.electric)).all()) for item in report.items)
    torch.cuda.synchronize()
    seconds = time.perf_counter()-started
    try:
        import cupy
        cupy_pool = int(cupy.get_default_memory_pool().total_bytes())
    except ImportError:
        cupy_pool = None
    estimates = [int(round(estimate(p)['estimated_memory_mb']*2**20)) for p in projects]
    return dict(name=name, **{**case, 'shape': list(case['shape'])}, cells=math.prod(case['shape']), steps=STEPS,
                peak_allocated_bytes=int(torch.cuda.max_memory_allocated()-base_allocated),
                peak_reserved_bytes=int(torch.cuda.max_memory_reserved()-base_reserved),
                cupy_pool_bytes=cupy_pool, estimate_bytes=sum(estimates), seconds=seconds, finite=finite,
                projects=[p.model_dump(mode='json') for p in projects])


def environment():
    import torch
    record = dict(device=torch.cuda.get_device_name(0), device_total_bytes=torch.cuda.get_device_properties(0).total_memory,
                  torch=torch.__version__, cuda_runtime=torch.version.cuda, python=platform.python_version(),
                  platform=platform.platform())
    try:
        import cupy
        record['cupy'] = cupy.__version__
    except ImportError:
        record['cupy'] = None
    try:
        record['driver'] = subprocess.run(['nvidia-smi', '--query-gpu=driver_version', '--format=csv,noheader'],
                                          capture_output=True, text=True, timeout=30).stdout.strip() or None
    except (OSError, subprocess.SubprocessError):
        record['driver'] = None
    return record


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split('\n\n')[0])
    parser.add_argument('--case', help='run one case in this process and print its JSON line')
    parser.add_argument('--cases', nargs='*', default=None, help='subset of case names (default: all)')
    parser.add_argument('--output', type=Path)
    parser.add_argument('--wrap', default='', help='command prefix of every case process; {vram_mib} is substituted')
    args = parser.parse_args(argv)
    if args.case:
        print(json.dumps(run_case(args.case)), flush=True)
        return
    if args.output is None:
        parser.error('--output is required unless --case is given')
    from torchfdtd.solver import estimate
    records = []
    for name in args.cases or list(CASES):
        case = CASES[name]
        vram = int(sum(estimate(project(case, i))['estimated_memory_mb'] for i in range(case['batch'])))+512
        command = [*shlex.split(args.wrap.replace('{vram_mib}', str(vram)), posix=False), sys.executable,
                   str(Path(__file__).resolve()), '--case', name]
        output = subprocess.run(command, capture_output=True, text=True, cwd=ROOT)
        lines = [line for line in output.stdout.splitlines() if line.startswith('{')]
        if output.returncode or not lines:
            raise SystemExit(f'{name} failed ({output.returncode}):\n{output.stdout[-2000:]}\n{output.stderr[-4000:]}')
        records.append(json.loads(lines[-1]))
        r = records[-1]
        print(f'{name}: {r["cells"]:,} cells, peak allocated {r["peak_allocated_bytes"]/2**20:.1f} MiB, '
              f'reserved {r["peak_reserved_bytes"]/2**20:.1f} MiB, estimate {r["estimate_bytes"]/2**20:.1f} MiB', flush=True)
    payload = dict(kind='resident_memory', environment=environment(), revision=git_revision(ROOT),
                   source_sha256={path: hashlib.sha256((ROOT/path).read_bytes()).hexdigest() for path in SOURCES},
                   mesh_um=MESH, pml_cells=PML, steps=STEPS, cases=records,
                   scope='Peak Torch CUDA allocator bytes of one resident forward run per fresh process (Simulation.run '
                         'with its CUDA graph, or one run_tensor_batch cohort), against estimate(project). The CUDA '
                         'context, CuPy module images and other processes are outside the Torch counters.')
    args.output.write_text(json.dumps(payload, indent=1)+'\n', encoding='utf-8')


if __name__ == '__main__':
    main()
