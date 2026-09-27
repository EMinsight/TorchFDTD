"""Measure recorded-plane calls with split, fused and restricted reconstruction.

Run on an otherwise idle CUDA device. The split reference uses the original
64-bit, unrestricted-pointer interior kernels, with E and VJP in separate
launches after the field transpose. This equivalent ordering isolates the
interior kernel changes, rather than timing an older installed distribution.
Each sample includes recorded forward and backward, with synchronized wall time.
"""
from __future__ import annotations

import argparse
from contextlib import contextmanager
import hashlib
import json
from pathlib import Path
import statistics
import time

import torchfdtd
import torch

from torchfdtd import (FieldMonitor, Project, Region, ReversibleCPMLOptions,
                       ReversibleCPMLPlaneSimulation, Source)
import torchfdtd.reversible_cpml_kernels as kernels
from torchfdtd.solver import field_axes


@contextmanager
def split_reference(enabled):
    real, complex_type = kernels._InteriorCUDA, kernels._ComplexInteriorCUDA
    def reference(base):
        class Split(base):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs, legacy=True)

            def run(self, phase):
                if phase == 'eg':
                    super().run('e')
                    super().run('g')
                else:
                    super().run(phase)
        return Split
    if enabled:
        kernels._InteriorCUDA, kernels._ComplexInteriorCUDA = reference(real), reference(complex_type)
    try:
        yield
    finally:
        kernels._InteriorCUDA, kernels._ComplexInteriorCUDA = real, complex_type


def run(nx=256, steps=192, repeats=5):
    if not torch.cuda.is_available():
        raise RuntimeError('This benchmark requires CUDA.')
    torch.set_num_threads(2)
    from torchfdtd.cuda_bootstrap import prepare_cuda_kernels
    prepare_cuda_kernels()
    device = torch.device('cuda:0')
    faces = {f'{a}_{s}': {'kind': 'periodic'} for a in 'xy' for s in ('min', 'max')}
    faces.update(z_min={'kind': 'pml', 'layers': 12}, z_max={'kind': 'pml', 'layers': 12})
    region = Region(dimension='3d', size=(nx*.02, nx*.02, 2.5), mesh=.02,
                    steps=steps, precision='float32', boundaries=faces,
                    material_sampling='yee', memory_mode='budgeted')
    axes = field_axes(region, 'Ex')
    project = Project(region=region, sources=[Source(kind='plane', normal='z',
        size=(nx*.02, nx*.02, 0), center=(0, 0, float(axes[2][28])), component='Ex',
        wavelength=.98, time_definition='standard', pulse_length=.4e-15,
        pulse_offset=.6e-15)], monitors=[FieldMonitor(id='output', normal='z',
            size=(nx*.02, nx*.02, 0), center=(0, 0, float(axes[2][95])),
            spectrum={'sampling': 'frequency', 'apodization': 'none'})])
    fixed = torch.ones((*region.shape, 3), device=device)
    base = fixed.clone()
    cut = (45, 81)
    # A patterned dielectric slab, with all variable material inside the cut.
    base[nx//4:3*nx//4, nx//4:3*nx//4, 46:81] = torch.tensor([2.1, 2.25, 2.4], device=device)
    frequency = [299792458./(.98e-6)]
    modes = ('split', 'fused', 'fused_interval')
    models = {mode: ReversibleCPMLPlaneSimulation(project,
        ReversibleCPMLOptions(interior_z=cut if mode == 'fused_interval' else None,
            resident_budget_bytes=8*1024**3, diagnostic_chunk_elements=1 << 24),
        quadrature_counts={'output': (8, 8)})
        for mode in modes}
    samples = {mode: [] for mode in modes}
    retained = {}

    def sample(mode, keep):
        value = base.clone().requires_grad_()
        torch.cuda.synchronize(device)
        torch.cuda.reset_peak_memory_stats(device)
        start = time.perf_counter()
        with split_reference(mode == 'split'):
            planes = models[mode](value, frequency, fixed_epsilon=fixed, block_size=32)
            fields = planes['output'].fields/region.time_step
            gradient, = torch.autograd.grad(fields.abs().square().mean(), value)
        torch.cuda.synchronize(device)
        elapsed = time.perf_counter()-start
        report = planes['output'].report
        row = dict(seconds=elapsed, peak_torch_cuda_bytes=torch.cuda.max_memory_allocated(device),
                   interval=list(models[mode].interior_z), trace_bytes=report['trace_bytes'],
                   terminal_state_bytes=report['terminal_state_bytes'],
                   reconstruction_relative_l2=report['last_backward']['initial_relative_l2'])
        if keep:
            retained[mode] = (fields.detach().cpu(), gradient.detach().cpu())
        return row

    for mode in modes:
        sample(mode, False)  # Compile and warm each path outside the samples.
    for repeat in range(repeats):
        for mode in modes[repeat % 3:]+modes[:repeat % 3]:
            row = sample(mode, repeat == 0)
            samples[mode].append(row)
            print(f'{mode} {repeat+1}/{repeats}: {row["seconds"]:.6f} s', flush=True)
    split_fields, split_gradient = retained['split']
    fused_fields, fused_gradient = retained['fused']
    cut_fields, cut_gradient = retained['fused_interval']
    assert torch.equal(split_fields, fused_fields) and torch.equal(split_gradient, fused_gradient)
    assert torch.equal(fused_fields, cut_fields)
    reference = fused_gradient[:, :, cut[0]:cut[1]+1]
    actual = cut_gradient[:, :, cut[0]:cut[1]+1]
    relative = float((actual.double()-reference.double()).norm()/reference.double().norm().clamp_min(1e-30))
    assert relative < 1e-4
    assert torch.count_nonzero(cut_gradient[:, :, :cut[0]]) == 0
    assert torch.count_nonzero(cut_gradient[:, :, cut[1]+1:]) == 0
    assert reference.norm() > 0
    assert all(row['reconstruction_relative_l2'] < 1e-4 for rows in samples.values() for row in rows)
    medians = {mode: statistics.median(row['seconds'] for row in rows) for mode, rows in samples.items()}
    root = Path(__file__).resolve().parents[1]
    paths = ['torchfdtd/reversible_cpml.py', 'torchfdtd/reversible_cpml_kernels.py',
             'torchfdtd/reversible_cpml_planes.py', 'benchmarks/reversible_cpml_kernel_perf.py']
    return dict(kind='recorded_cpml_kernel_comparison', device=torch.cuda.get_device_name(device),
        torch_version=torch.__version__, cuda_version=torch.version.cuda, shape=list(region.shape),
        steps=steps, material_components=3, trace_storage='device', repeats=repeats,
        scope='Single-GPU synchronized recorded plane forward plus backward on a reduced tile',
        baseline='Equivalent split 64-bit interior kernels with unrestricted pointers, not an older distribution',
        samples=samples, median_seconds=medians,
        reduction_fraction={mode: 1-medians[mode]/medians['split'] for mode in modes[1:]},
        split_fused_bitwise_equal=True, interval_spectra_bitwise_equal=True,
        interval_gradient_relative_l2=relative,
        source_sha256={name: hashlib.sha256((root/name).read_bytes()).hexdigest() for name in paths})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--nx', type=int, default=256)
    parser.add_argument('--steps', type=int, default=192)
    parser.add_argument('--repeats', type=int, default=5)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.nx < 16 or args.steps < 128 or args.repeats < 3:
        parser.error('Use nx >= 16, steps >= 128 and repeats >= 3.')
    result = run(args.nx, args.steps, args.repeats)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    print(json.dumps({key: result[key] for key in ('median_seconds', 'reduction_fraction',
                                                  'interval_gradient_relative_l2')}, indent=2))
