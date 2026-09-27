"""Paired end-to-end comparison of direct recorded CPML observations."""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import hashlib
import json
from pathlib import Path
import statistics
import time

import torch
from torchfdtd import FieldMonitor, Project, Region, ReversibleCPMLOptions, ReversibleCPMLPlaneSimulation, Source
from torchfdtd.solver import field_axes


@contextmanager
def variant(mode):
    import torchfdtd.reversible_cpml as recorded
    original_recorder = recorded.recorder
    def legacy_recorder(system, samples):
        def record(row):
            samples[row].copy_(system.observe(system.state()))
        return record
    if mode == 'baseline':
        recorded.recorder = legacy_recorder
    try:
        yield
    finally:
        recorded.recorder = original_recorder


def run(nx=192, steps=512, repeats=15, diagonal=True, complex_fields=False, quadrature=8):
    from torchfdtd.cuda_bootstrap import prepare_cuda_kernels
    prepare_cuda_kernels()
    torch.set_num_threads(2)
    device = torch.device('cuda:0')
    faces = {f'{a}_{s}': {'kind': 'bloch' if complex_fields else 'periodic'}
             for a in 'xy' for s in ('min', 'max')}
    faces.update(z_min={'kind': 'pml', 'layers': 12}, z_max={'kind': 'pml', 'layers': 12})
    region = Region(dimension='3d', size=(nx*.02, nx*.02, 2.5), mesh=.02,
        steps=steps, precision='float32', boundaries=faces, material_sampling='yee',
        memory_mode='budgeted', bloch_phase=(.23, -.17, 0.) if complex_fields else (0., 0., 0.))
    axes = field_axes(region, 'Ex')
    project = Project(region=region, sources=[Source(kind='plane', normal='z', size=(nx*.02, nx*.02, 0),
        center=(0, 0, float(axes[2][28])), component='Ex', wavelength=.98,
        time_definition='standard', pulse_length=.4e-15, pulse_offset=.6e-15)],
        monitors=[FieldMonitor(id='output', normal='z', size=(nx*.02, nx*.02, 0),
            center=(0, 0, float(axes[2][95])), spectrum={'sampling': 'frequency', 'apodization': 'none'})])
    fixed = torch.ones((*region.shape, 3) if diagonal else region.shape, device=device)
    base = fixed.clone()
    base[nx//4:3*nx//4, nx//4:3*nx//4, 46:81] = (torch.tensor([2.1, 2.25, 2.4], device=device) if diagonal else 2.25)
    model = ReversibleCPMLPlaneSimulation(project,
        ReversibleCPMLOptions(interior_z=(45, 81), resident_budget_bytes=9*1024**3,
                              diagnostic_chunk_elements=1 << 24), quadrature_counts={'output': (quadrature, quadrature)})
    frequency = [299792458./(.98e-6)]
    modes = ('baseline', 'observations')
    rows = {mode: [] for mode in modes}
    reference = None
    def sample(mode, verify):
        nonlocal reference
        epsilon = base.clone().requires_grad_()
        torch.cuda.synchronize(device)
        torch.cuda.reset_peak_memory_stats(device)
        start = time.perf_counter()
        with variant(mode):
            plane = model(epsilon, frequency, fixed_epsilon=fixed, block_size=32)['output']
            fields = plane.fields/region.time_step
            gradient, = torch.autograd.grad(fields.abs().square().mean(), epsilon)
        torch.cuda.synchronize(device)
        result = {'seconds': time.perf_counter()-start,
                  'forward_seconds': plane.report['forward_seconds'],
                  'backward_seconds': plane.report['last_backward']['seconds'],
                  'peak_torch_cuda_bytes': torch.cuda.max_memory_allocated(device),
                  'reconstruction_relative_l2': plane.report['last_backward']['initial_relative_l2']}
        if verify:
            actual = fields.detach().cpu(), gradient.detach().cpu()
            if reference is None:
                reference = actual
                assert torch.count_nonzero(actual[1]) > 0
            assert torch.equal(reference[0], actual[0]), (mode, 'spectrum')
            assert torch.equal(reference[1], actual[1]), (mode, 'gradient')
            assert result['reconstruction_relative_l2'] < 1e-4
        return result
    for mode in modes:
        sample(mode, True)
    for repeat in range(repeats):
        order = modes[repeat % len(modes):]+modes[:repeat % len(modes)]
        for mode in order:
            row = sample(mode, True)
            rows[mode].append(row)
            print(f'{nx} {mode} {repeat+1}/{repeats}: {row["seconds"]:.6f} s', flush=True)
    medians = {mode: statistics.median(row['seconds'] for row in samples) for mode, samples in rows.items()}
    paired = {mode: [1-b['seconds']/a['seconds'] for a, b in zip(rows['baseline'], rows[mode])]
              for mode in modes[1:]}
    return {'shape': list(region.shape), 'steps': steps, 'repeats': repeats,
            'quadrature_counts': [quadrature, quadrature],
            'material_components': 3 if diagonal else 1, 'complex_fields': complex_fields,
            'samples': rows, 'median_seconds': medians,
            'reduction_fraction': {mode: 1-value/medians['baseline'] for mode, value in medians.items() if mode != 'baseline'},
            'paired_reduction_fraction': paired,
            'all_spectra_and_gradients_bitwise_equal': True,
            'baseline': '1.1.0 recorded kernels and observation loop, reproduced with the optional changes disabled'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--nx', type=int, nargs='+', default=[64, 192])
    parser.add_argument('--steps', type=int, default=512)
    parser.add_argument('--repeats', type=int, default=15)
    parser.add_argument('--scalar', action='store_true')
    parser.add_argument('--complex', action='store_true')
    parser.add_argument('--quadrature', type=int, default=8)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if min(args.nx) < 16 or args.steps < 128 or args.repeats < 5 or not 1 <= args.quadrature <= min(args.nx):
        parser.error('Use nx >= 16, steps >= 128, repeats >= 5 and 1 <= quadrature <= nx.')
    cases = [run(nx, args.steps, args.repeats, not args.scalar, args.complex, args.quadrature) for nx in args.nx]
    root = Path(__file__).resolve().parents[1]
    paths = ['torchfdtd/reversible_cpml.py', 'torchfdtd/reversible_cpml_kernels.py',
             'torchfdtd/recorded_observations.py', 'torchfdtd/reversible_cpml_memory.py',
             'benchmarks/recorded_cpml_dispatch_perf.py']
    result = {'device': torch.cuda.get_device_name(0), 'torch_version': torch.__version__,
              'cuda_version': torch.version.cuda, 'cases': cases,
              'timing': 'Synchronized wall time for material setup, recorded forward, spectrum and backward, after warmup',
              'source_sha256': {p: hashlib.sha256((root/p).read_bytes()).hexdigest() for p in paths}}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    print(json.dumps([{'shape': c['shape'], 'median_seconds': c['median_seconds'],
                      'reduction_fraction': c['reduction_fraction']} for c in cases], indent=2))
