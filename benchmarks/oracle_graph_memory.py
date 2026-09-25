"""Measure the peak memory of the full-autograd reference oracles.

Each case runs one reference forward and the backward of a weighted sum in a
fresh process. CUDA peaks are the allocator's allocated and reserved growth;
CPU peaks are the growth of the process's peak private bytes (PeakPagefileUsage
on Windows), which also counts allocator and graph-node overhead. The record
compares each peak with the bytes admit_oracle checks (oracle_graph_bytes and
oracle_requirements), which must never be below it. Held-out cases are not
used to choose the constants; they check the estimate outside the fitted set.
The merge recomputes the estimates from the current constants and, for the
CUDA library allowance, queries the first CUDA device, so run it where that
device is visible. --cases splits a device run into short pieces.

  python benchmarks/oracle_graph_memory.py --device cpu --output cpu.json
  python benchmarks/oracle_graph_memory.py --device cuda --cases yee_2d_cpml_f64 ... --output cuda-a.json
  python benchmarks/oracle_graph_memory.py --merge cpu.json cuda-a.json cuda-b.json --output docs/validation/oracle_graph_memory.json
"""
import argparse
import datetime
import json
import os
import platform
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT/'benchmarks'))


def case(builder, kind, steps, cuda_steps=None, held_out=False, **options):
    return dict(builder=builder, kind=kind, steps=steps, cuda_steps=cuda_steps or steps, held_out=held_out, options=options)


# Two step counts per case give the per-step slope. cuda_steps keep the
# large held-out graphs within the device memory another job leaves free.
CASES = {
    'yee_2d_cpml_f64': case('yee', 'yee', (24, 2000), dimension='2d'),
    'yee_3d_cpml_diag_f64': case('yee', 'yee', (24, 400), diag=True),
    'yee_3d_periodic_f32': case('yee', 'yee', (24, 800), boundary='periodic', diag=True, precision='float32'),
    'yee_3d_pmc_f64': case('yee', 'yee', (14, 800), boundary='pmc', diag=True),
    'yee_3d_bloch_complex_f64': case('yee', 'yee', (24, 300), boundary='bloch'),
    'yee_3d_periodic3_diag_f64_20': case('yee', 'yee', (24, 400), boundary='periodic3', diag=True, cells=20),
    'yee_3d_sources40_f32': case('yee', 'yee', (24, 400), precision='float32', sources=40),
    'ade_2d_p2_f64': case('ade', 'ade', (15, 2000), dimension='2d', poles=2),
    'ade_3d_p1_diag_f64': case('ade', 'ade', (15, 200), poles=1, diag=True),
    'ade_3d_p4_f32': case('ade', 'ade', (15, 200), poles=4, precision='float32'),
    'ade_3d_p2_pn3_f64': case('ade', 'ade', (15, 200), poles=2, diag=True, parameters='PN3'),
    'ade_3d_p2_pn_f32': case('ade', 'ade', (15, 300), poles=2, parameters='PN', precision='float32'),
    'tensor_ade_pml_p2_f64': case('tensor_ade', 'tensor_ade', (12, 60), poles=2, boundary='pml'),
    'tensor_ade_periodic_p1_f32': case('tensor_ade', 'tensor_ade', (12, 120), poles=1, boundary='periodic', precision='float32'),
    'modal_3d_f64': case('modal', 'yee', (60, 300)),
    'source_3d_f32': case('source', 'yee', (11, 1000)),
    'source_3d_complex_f64': case('source', 'yee', (11, 400), complex_case=True),
    # Held out: not used to choose the constants.
    'heldout_yee_periodic3_diag_f64_30': case('yee', 'yee', (150, 700), (60, 300), True, boundary='periodic3', diag=True, cells=30),
    'heldout_yee_periodic3_diag_f64_40': case('yee', 'yee', (100, 300), (40, 120), True, boundary='periodic3', diag=True, cells=40),
    'heldout_ade_p4_pn3_f64_periodic3': case('ade', 'ade', (15, 150), (15, 100), True, poles=4, diag=True, parameters='PN3',
                                             boundary='periodic3', cells=20),
    'heldout_yee_sources160_f32': case('yee', 'yee', (24, 300), None, True, precision='float32', sources=160),
}


def _region(steps, dimension='3d', precision='float64', boundary='cpml', cells=None):
    from torchfdtd import BoundaryFace, Region
    size = (cells*.1,)*3 if cells else (1.6, 1.5, 1.4)
    r = Region(dimension=dimension, size=size, mesh=.1, pml_cells=3, steps=steps, precision=precision, backend='cpu')
    if boundary == 'periodic':
        r.boundaries.x_min = BoundaryFace(kind='periodic')
        r.boundaries.x_max = BoundaryFace(kind='periodic')
    elif boundary == 'periodic3':
        for a in 'xyz':
            setattr(r.boundaries, a+'_min', BoundaryFace(kind='periodic'))
            setattr(r.boundaries, a+'_max', BoundaryFace(kind='periodic'))
    elif boundary == 'bloch':
        r.boundaries.x_min = r.boundaries.x_max = BoundaryFace(kind='bloch')
        r.bloch_phase = (.3, 0, 0)
    else:
        r.boundaries.x_min = BoundaryFace(layers=4, kappa=2, alpha=.03, alpha_polynomial=1)
    return r


def _yee(steps, device, dimension='3d', precision='float64', boundary='cpml', diag=False, cells=None, sources=1):
    import torch
    from torchfdtd import BoundaryFace, DifferentiableSimulation, Monitor, Project, Region, Source
    from torchfdtd.boundaries import material_shape
    from torchfdtd.oracle_memory import oracle_source_terms
    if boundary == 'pmc':
        from torchfdtd.models import Boundaries
        kinds = (('pml', 'pmc'), ('pmc', 'pec'), ('pec', 'pmc'))
        faces = {}
        for axis, a in enumerate('xyz'):
            for side, kind in zip(('min', 'max'), kinds[axis]):
                faces[a+'_'+side] = BoundaryFace(kind=kind, **(dict(layers=4, kappa=3., alpha=.05) if kind == 'pml' else {}))
        r = Region(dimension='3d', size=(1.0, .6, .6), mesh=.1, steps=steps, boundaries=Boundaries(**faces),
                   material_sampling='yee', precision=precision, pml_cells=3, backend='cpu', cuda_kernel='torch')
        p = Project(region=r, sources=[Source(center=(.2, .1, .1), component='Ez', pulse='continuous', wavelength=.5)],
                    monitors=[Monitor(component='Ez', center=(.3, .2, .2)), Monitor(component='Hx', center=(.1, .1, .3))])
    else:
        r = _region(steps, dimension, precision, boundary, cells)
        # Distinct points of a 7 x 7 grid per z plane, all outside the PML.
        centres = [(-.3+.1*(i % 7), -.3+.1*((i//7) % 7), -.2+.1*(i//49)) for i in range(sources)] if sources > 1 else [(-.2, 0, 0)]
        p = Project(region=r, sources=[Source(center=c, pulse='continuous', wavelength=1.1) for c in centres],
                    monitors=[Monitor(component='Ez', center=(.1, 0, 0)), Monitor(component='Hy', center=(0, .1, 0)),
                              Monitor(component='Ez', center=(.1, 0, 0))])
    p = Project.model_validate(p.model_dump())
    shape = material_shape(p.region, diag)
    dtype = torch.float64 if p.region.precision == 'float64' else torch.float32
    g = torch.Generator().manual_seed(82)
    epsilon = (1.4+.1*torch.rand(shape, dtype=dtype, generator=g)).to(device).requires_grad_()
    model = DifferentiableSimulation(p)
    extra = dict(material_elements=epsilon.numel(), source_terms=oracle_source_terms(p))
    return p.region, extra, (lambda: model.reference(epsilon)), (epsilon,)


def _ade(steps, device, dimension='3d', precision='float64', boundary='cpml', diag=False, cells=None, poles=1, parameters='P'):
    import torch
    from torchfdtd import DispersiveSimulation, Monitor, Project, Source
    from torchfdtd.oracle_memory import oracle_source_terms
    p = Project(region=_region(steps, dimension, precision, boundary, cells),
                sources=[Source(center=(-.2, 0, 0), pulse='continuous', wavelength=1.1)],
                monitors=[Monitor(component='Ez', center=(.1, 0, 0)), Monitor(component='Hy', center=(0, .1, 0))])
    p = Project.model_validate(p.model_dump())
    dtype = torch.float64 if precision == 'float64' else torch.float32
    shape = p.region.shape+((3,) if diag else ())
    g = torch.Generator().manual_seed(54)
    epsilon = (1.5+.1*torch.rand(shape, dtype=dtype, generator=g)).to(device).requires_grad_()
    # Oscillator parameters per pole, per cell or per cell and component.
    pshape = {'P': (poles,), 'PN': (poles, *p.region.shape), 'PN3': (poles, *p.region.shape, 3)}[parameters]
    def rates(low, high):
        values = torch.linspace(low, high, poles, dtype=dtype).reshape((poles,)+(1,)*(len(pshape)-1))
        return values.expand(pshape).clone().to(device).requires_grad_()
    strength, omega, gamma = rates(.4, .8), rates(0., 1.7), rates(.2, .3)
    model = DispersiveSimulation(p)
    run = lambda: model.reference(epsilon, strength*1e30, omega*1e15, gamma*1e15)
    extra = dict(pole_count=poles, material_elements=epsilon.numel(), parameter_elements=strength.numel(),
                 source_terms=oracle_source_terms(p))
    return p.region, extra, run, (epsilon, strength, omega, gamma)


def _tensor_ade(steps, device, precision='float64', boundary='pml', poles=1):
    import torch
    from torchfdtd import Monitor, Project, Region, Source
    from torchfdtd.anisotropy_dispersive import TensorDispersiveSimulation
    from torchfdtd.oracle_memory import oracle_source_terms
    dtype = torch.float64 if precision == 'float64' else torch.float32
    boundaries = {a+'_'+side: dict(kind=boundary) for a in 'xyz' for side in ('min', 'max')}
    r = Region(dimension='3d', size=(1.2,)*3, mesh=.1, steps=steps, precision=precision, pml_cells=3,
               material_sampling='yee', boundaries=boundaries)
    p = Project(region=r, sources=[Source(component='Ez', center=(0, 0, 0), wavelength=.7, pulse='gaussian',
                time_definition='standard', pulse_length=.5e-15, pulse_offset=.7e-15)],
                monitors=[Monitor(component=c, center=(.1, 0, 0)) for c in ('Ex', 'Ey', 'Ez', 'Hx')])
    p = Project.model_validate(p.model_dump())
    shape = p.region.shape
    g = torch.Generator().manual_seed(11)
    # Isotropic in the CPML layers and collar, anisotropic inside, where the
    # strength is also confined, keeps every face admissible.
    mask = torch.zeros(shape, dtype=dtype)
    mask[4:-4, 4:-4, 4:-4] = 1
    base = torch.randn(shape+(3, 3), dtype=dtype, generator=g)*.1*mask[..., None, None]
    epsilon = (2*torch.eye(3, dtype=dtype)+(base+base.transpose(-1, -2))/2).to(device).requires_grad_()
    strength = (mask[None, ..., None, None]*torch.eye(3, dtype=dtype)*torch.linspace(.4, .9, poles, dtype=dtype)[:, None, None, None, None, None]
                ).to(device).requires_grad_()
    omega = torch.linspace(0., 1.7, poles, dtype=dtype, device=device).requires_grad_()
    gamma = torch.linspace(.2, .3, poles, dtype=dtype, device=device).requires_grad_()
    model = TensorDispersiveSimulation(p)
    args = lambda: (epsilon, strength*1e30, omega*1e15, gamma*1e15)
    with torch.no_grad():
        _, layout, _ = model._pack(*args())
    run = lambda: model.reference(*args())
    extra = dict(pole_count=poles, iterations=layout.iterations, source_terms=oracle_source_terms(p))
    return p.region, extra, run, (epsilon, strength, omega, gamma)


def _modal(steps, device):
    import numpy as np
    import torch
    from torchfdtd import AdjointOptions, FieldMonitor, Project, Region, Source
    from torchfdtd.mode_branches import prepare_aperture_modal_launch
    from torchfdtd.mode_injection import ModeInjectedPlaneSimulation
    faces = {a+'_'+s: dict(kind='periodic') for a in 'yz' for s in ('min', 'max')}
    r = Region(dimension='3d', size=(2.4, 1.4, .5), mesh=.1, pml_cells=5, steps=steps, material_sampling='yee',
               boundaries=faces, precision='float64')
    p = Project(region=r, sources=[Source(kind='plane', normal='x', center=(-.5, 0., 0.), size=(0., 1.2, .5), pulse_cycles=2)],
                monitors=[FieldMonitor(id='out', normal='x', center=(.3, 0., 0.), size=(0., 1.2, .5))])
    guide = lambda u, v: np.where(np.abs(u) < .2-1e-9, 12., 2.1)
    launch = prepare_aperture_modal_launch(p, guide)
    out = np.empty(r.shape+(3,))
    for c in range(3):
        axes = [float(r.mesh_nodes[a][0])+(np.arange(r.shape[a])+(.5 if a == c else 0.))*r.axis_steps[a] for a in range(3)]
        out[..., c] = guide(*np.meshgrid(*axes, indexing='ij')[1:])
    epsilon = torch.tensor(out, device=device).requires_grad_()
    model = ModeInjectedPlaneSimulation(p, launch, AdjointOptions(checkpoints=1))
    frequency = [299792458/1.55e-6]
    run = lambda: model.reference(epsilon, frequency)['out'].fields
    extra = dict(material_elements=epsilon.numel(), source_terms=len(launch.terms))
    return model.model.project.region, extra, run, (epsilon,)


def _source(steps, device, complex_case=False):
    import torch
    from torchfdtd import BoundaryFace, Monitor, Project, Region, Source
    from torchfdtd.source_adjoint import SourceWaveformSimulation
    precision = 'float64' if complex_case else 'float32'
    r = Region(dimension='3d', size=(1.5, 1.5, 1.5), mesh=.1, pml_cells=3, steps=steps, precision=precision, backend='cpu')
    if complex_case:
        r.boundaries.x_min = r.boundaries.x_max = BoundaryFace(kind='bloch')
        r.bloch_phase = (.2, 0, 0)
    p = Project(region=r, sources=[Source(component='Ex', center=(0, 0, 0), pulse='continuous'),
                Source(component='Hy', center=(0, 0, 0), pulse='continuous')],
                monitors=[Monitor(component='Ex', center=(0, 0, 0)), Monitor(component='Hy', center=(0, 0, 0))])
    p = Project.model_validate(p.model_dump())
    model = SourceWaveformSimulation(p)
    dtype = torch.float64 if complex_case else torch.float32
    epsilon = torch.full(p.region.shape+((3,) if complex_case else ()), 1.6, dtype=dtype, device=device, requires_grad=True)
    wave_dtype = torch.complex128 if complex_case else torch.float32
    g = torch.Generator().manual_seed(82)
    waves = (torch.randn(steps, 2, dtype=wave_dtype, generator=g)*.1).to(device).requires_grad_()
    extra = dict(material_elements=epsilon.numel(), source_terms=len(model.term_layout))
    return p.region, extra, (lambda: model.reference(epsilon, waves)), (epsilon, waves)


BUILDERS = {'yee': _yee, 'ade': _ade, 'tensor_ade': _tensor_ade, 'modal': _modal, 'source': _source}


def build(name, steps, device):
    """(region, oracle_graph_bytes keyword arguments, run, differentiated inputs) of one case."""
    spec = CASES[name]
    return BUILDERS[spec['builder']](steps, device, **spec['options'])


def estimate(report, region, extra):
    """Compare a measured case with the bytes admit_oracle checks on its device and host."""
    from torchfdtd.oracle_memory import oracle_graph_bytes, oracle_requirements, oracle_state_bytes
    value = oracle_graph_bytes(region, report['kind'], **extra)
    # The CUDA library allowance is evaluated on this host's first device.
    required = oracle_requirements(value, 'cuda:0' if report['device'] == 'cuda' else 'cpu')
    report.update(state_bytes=oracle_state_bytes(region, extra.get('pole_count', 0)),
                  estimate_tensor_bytes=value['tensor_bytes'], estimate_node_bytes=value['node_bytes'],
                  estimate_bytes=required['graph'])
    if report['device'] == 'cuda':
        report['host_estimate_bytes'] = required['host']
        report['host_estimate_over_peak'] = required['host']/max(1, report['host_peak_bytes'])
    report['estimate_over_peak'] = report['estimate_bytes']/max(1, report['peak_bytes'])
    report['peak_per_step_over_state'] = report['peak_bytes']/(report['steps']*report['state_bytes'])
    return report


def measure(name, steps, device):
    """One case in this process: peak growth through reference forward and backward."""
    import gc
    import torch
    torch.set_num_threads(2)
    region, extra, run, inputs = build(name, steps, device)
    gc.collect()
    report = dict(case=name, kind=CASES[name]['kind'], held_out=CASES[name]['held_out'], device=device, steps=steps,
                  shape=list(region.shape), precision=region.precision, complex_fields=region.complex_fields, **extra)
    import psutil
    process = psutil.Process()
    if device == 'cuda':
        torch.cuda.synchronize()
        allocated, reserved = torch.cuda.memory_allocated(), torch.cuda.memory_reserved()
        torch.cuda.reset_peak_memory_stats()
    before = process.memory_info()
    signals = run()
    weights = torch.randn(signals.shape, dtype=signals.dtype, generator=torch.Generator().manual_seed(3)).to(signals.device)
    loss = (signals.conj()*weights).real.sum()
    grads = torch.autograd.grad(loss, inputs)
    if device == 'cuda':
        torch.cuda.synchronize()
        report.update(peak_allocated_bytes=torch.cuda.max_memory_allocated()-allocated,
                      peak_reserved_bytes=torch.cuda.max_memory_reserved()-reserved)
        report['device_peak_bytes'] = max(report['peak_allocated_bytes'], report['peak_reserved_bytes'])
    after = process.memory_info()
    # Peak private bytes include every allocation of this process, and the
    # growth is valid only when this run set a new process peak.
    report.update(private_before_bytes=before.private, peak_private_before_bytes=before.peak_pagefile,
                  peak_private_after_bytes=after.peak_pagefile,
                  host_peak_bytes=after.peak_pagefile-before.private,
                  new_process_peak=after.peak_pagefile > before.peak_pagefile)
    report['peak_bytes'] = report['device_peak_bytes'] if device == 'cuda' else report['host_peak_bytes']
    assert all(torch.isfinite(g).all() for g in grads)
    return estimate(report, region, extra)


def environment(device):
    import torch
    info = dict(python=platform.python_version(), torch=torch.__version__, os=platform.platform(),
                machine=platform.machine(), threads=2)
    if device == 'cuda':
        from torchfdtd.cuda_memory import cuda_mem_info, nvml_free_bytes
        runtime_free, total = torch.cuda.mem_get_info()
        info.update(gpu=torch.cuda.get_device_name(), gpu_capability=list(torch.cuda.get_device_capability()),
                    cuda_runtime=torch.version.cuda, gpu_total_bytes=total,
                    gpu_runtime_free_bytes_at_start=runtime_free, gpu_nvml_free_bytes_at_start=nvml_free_bytes(torch.device('cuda', 0)),
                    gpu_admission_free_bytes_at_start=cuda_mem_info()[0])
    else:
        import psutil
        info.update(cpu=platform.processor(), host_total_bytes=psutil.virtual_memory().total,
                    host_available_bytes_at_start=psutil.virtual_memory().available)
    from provenance import git_revision
    info['commit'] = git_revision(ROOT)
    info['recorded_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds')
    return info


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--device', choices=('cpu', 'cuda'))
    parser.add_argument('--case')
    parser.add_argument('--cases', nargs='+', help='a subset of CASES for one device run')
    parser.add_argument('--steps', type=int)
    parser.add_argument('--output')
    parser.add_argument('--merge', nargs='+')
    args = parser.parse_args()
    if args.case:
        print(json.dumps(measure(args.case, args.steps, args.device)))
        return
    if args.merge:
        from torchfdtd import oracle_memory as m
        parts = [json.loads(Path(p).read_text()) for p in args.merge]
        cases = []
        for part in parts:
            for item in part['cases']:
                # Estimates follow the current constants; the peaks are as measured.
                region, extra = build(item['case'], item['steps'], 'cpu')[:2]
                cases.append(estimate(item, region, extra))
        cuda = [c for c in cases if c['device'] == 'cuda']
        library = m.oracle_requirements(dict(tensor_bytes=0, node_bytes=0), 'cuda:0')['graph'] if cuda else None
        def minimum(rows, key):
            return min((c[key] for c in rows), default=None)
        fitted, held = [c for c in cases if not c['held_out']], [c for c in cases if c['held_out']]
        record = dict(schema='torchfdtd.oracle_graph_memory.v2',
                      estimate=dict(tensor_factors=m.GRAPH_TENSOR_FACTORS, small_tensor_bytes=m.GRAPH_SMALL_TENSOR_BYTES,
                                    node_bytes=m.GRAPH_NODE_BYTES, source_term_bytes=m.GRAPH_SOURCE_TERM_BYTES,
                                    extra_steps=m.GRAPH_EXTRA_STEPS,
                                    fixed_host_bytes=m.GRAPH_FIXED_HOST_BYTES, cuda_library_allowance_bytes=library,
                                    rule='tensor_bytes = (steps + extra_steps) * (tensor_factor * unit + small_tensor_bytes); '
                                         'node_bytes = (steps + extra_steps) * (node_bytes * applications + source_term_bytes * source_terms); '
                                         'unit = one restart state (E, H, CPML memories, stored PMC faces, pole banks) at the field element '
                                         'size + 2 * material elements * real size (reciprocal and scaled permittivity) + for ADE 4 * '
                                         'largest oscillator parameter elements * real size (coefficients a, d, 4d, k); tensor ADE adds '
                                         '3 * cells * element size per operator application to the state instead, with applications = '
                                         '2P + 1 + iterations * (1 + P) (otherwise 1)'),
                      admission='CPU: tensor_bytes + node_bytes + fixed_host_bytes.cpu against 80% of available host memory. CUDA: '
                                'tensor_bytes + the cuBLAS workspace allowance of the resident spectral reservation against cuda_budget_limit '
                                '(80% of the smaller of the CUDA runtime and NVML free memory, after releasing unused cache when that makes '
                                'it fit), node_bytes + fixed_host_bytes.cuda against 80% of available host memory, plus the device graph '
                                'under Windows, where WDDM commits host memory for device allocations. graph_budget_bytes caps the device '
                                'estimate.',
                      measurement='Fresh process per case; one reference forward and the backward of a weighted sum. CUDA peak: '
                                  'max(allocated, reserved) growth of the Torch caching allocator. Host peak: growth of the process peak '
                                  'private bytes (PeakPagefileUsage) over the private bytes before the run; it is a resolved peak only when '
                                  'the run set a new process peak (new_process_peak). estimate_bytes is the admitted device quantity '
                                  '(CPU: all host bytes) against peak_bytes; on CUDA host_estimate_bytes is the admitted host quantity '
                                  'against host_peak_bytes. held_out cases were not used to choose the constants.',
                      source_state=('recorded from the uncommitted working tree on top of environments[*].commit; the code '
                                    'measured is the commit that adds this record'),
                      environments=[dict(p['environment'], device=p['device']) for p in parts], cases=cases,
                      minimum_estimate_over_peak=minimum(cases, 'estimate_over_peak'),
                      minimum_fitted_estimate_over_peak=minimum(fitted, 'estimate_over_peak'),
                      minimum_held_out_estimate_over_peak=minimum(held, 'estimate_over_peak'),
                      minimum_cuda_host_estimate_over_peak=minimum([c for c in cuda if c['new_process_peak']], 'host_estimate_over_peak'),
                      all_estimates_at_or_above_peak=all(c['estimate_bytes'] >= c['peak_bytes'] for c in cases)
                      and all(c['host_estimate_bytes'] >= c['host_peak_bytes'] for c in cuda if c['new_process_peak']),
                      cpu_peaks_resolved=all(c['new_process_peak'] for c in cases if c['device'] == 'cpu'))
        Path(args.output).write_text(json.dumps(record, indent=2)+'\n', newline='\n')
        print(json.dumps({k: record[k] for k in ('minimum_estimate_over_peak', 'minimum_fitted_estimate_over_peak',
                                                 'minimum_held_out_estimate_over_peak', 'minimum_cuda_host_estimate_over_peak',
                                                 'all_estimates_at_or_above_peak', 'cpu_peaks_resolved')}))
        return
    cases = []
    env = dict(os.environ, OMP_NUM_THREADS='2', MKL_NUM_THREADS='2')
    for name in args.cases or CASES:
        spec = CASES[name]
        for steps in spec['cuda_steps' if args.device == 'cuda' else 'steps']:
            out = subprocess.run([sys.executable, __file__, '--case', name, '--steps', str(steps), '--device', args.device],
                                 capture_output=True, text=True, env=env, cwd=ROOT)
            if out.returncode:
                raise SystemExit(f'{name} {steps}: {out.stderr[-3000:]}')
            row = json.loads(out.stdout.strip().splitlines()[-1])
            print(json.dumps({k: row[k] for k in ('case', 'steps', 'peak_bytes', 'estimate_bytes', 'estimate_over_peak',
                                                  'peak_per_step_over_state')}), flush=True)
            cases.append(row)
    Path(args.output).write_text(json.dumps(dict(device=args.device, environment=environment(args.device), cases=cases), indent=2)+'\n', newline='\n')


if __name__ == '__main__':
    main()
