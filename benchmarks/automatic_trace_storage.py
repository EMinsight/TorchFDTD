"""Measure whole recorded-plane solves with automatic boundary-history placement.

Run under an exclusive GPU lock on an otherwise idle device. Compare automatic
selection with each identical explicit storage path, including admission in the
synchronized wall time. The constrained case admits the CPU archive while the
complete device reservation is refused. This does not benchmark a graph keeper
or infer the separate external full-aperture workload's H200 speedup.
"""
import argparse
from dataclasses import replace
import hashlib
import json
from pathlib import Path
import platform
import statistics
import time

import torch
import torchfdtd
from torchfdtd import (FieldMonitor, Project, Region, ReversibleCPMLOptions,
                      ReversibleCPMLPlaneSimulation, Source)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--width', type=int, default=64)
    parser.add_argument('--steps', type=int, default=256)
    parser.add_argument('--repeats', type=int, default=5)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.width < 8 or args.steps < 65 or args.repeats < 3:
        parser.error('width >= 8, steps >= 65 and repeats >= 3 required')
    torch.set_num_threads(1)
    device = torch.device('cuda:0')
    size = args.width*.1
    faces = {f'{axis}_{side}': dict(kind='periodic') for axis in 'xy' for side in ('min', 'max')}
    faces.update(z_min=dict(kind='pml', layers=3, kappa=2, alpha=.03),
                 z_max=dict(kind='pml', layers=4, kappa=2, alpha=.03))
    region = Region(dimension='3d', size=(size, size, 3.2), mesh=.1, steps=args.steps,
                    precision='float32', backend='cpu', material_sampling='yee', boundaries=faces)
    project = Project(region=region, sources=[Source(kind='plane', normal='z',
        size=(size, size, 0), center=(0, 0, -.4), component='Ex', wavelength=.6,
        time_definition='standard', pulse_length=.4e-15, pulse_offset=.6e-15)],
        monitors=[FieldMonitor(id=name, normal='z', size=(size, size, 0), center=(0, 0, z),
            spectrum=dict(sampling='frequency', apodization='none'))
            for name, z in [('incident', -.2), ('detector', .5)]])
    common = ReversibleCPMLOptions(host_budget_bytes=1024**3, trace_chunk_steps=32,
        forward_kernel='fused_eh', adjoint_kernel='one_pass', block_size=256)
    quadrature = {'incident': (8, 8), 'detector': (8, 8)}
    def model(opts):
        return ReversibleCPMLPlaneSimulation(project, opts, quadrature_counts=quadrature)
    generator = torch.Generator().manual_seed(20261001)
    host_material = torch.full((*region.shape, 3), 1.4)
    host_material[:, :, 14:18] += .5*torch.rand(host_material[:, :, 14:18].shape, generator=generator)
    material_sha = hashlib.sha256(host_material.numpy().tobytes()).hexdigest()
    base = host_material.to(device)
    fixed = torch.full_like(base, 1.4)
    frequencies = torch.tensor([.033, .045, .057], device=device)/region.time_step
    models = {'device': model(common), 'cpu_async': model(replace(common,
        trace_storage='cpu', trace_transfers='async'))}
    plans = {name: instance.plan(frequencies, device=device, material_components=3, block_size=8)
             for name, instance in models.items()}
    budget = plans['cpu_async']['gpu_reservation_bytes']
    assert budget < plans['device']['gpu_reservation_bytes']
    try:
        model(replace(common, gpu_budget_bytes=budget)).plan(
            frequencies, device=device, material_components=3, block_size=8)
    except ValueError as error:
        assert 'CUDA budget' in str(error), str(error)
        refusal = str(error)
    else:
        raise RuntimeError('Constrained explicit device reservation was not refused')
    models.update(auto_device=model(replace(common, trace_storage='auto')),
                  auto_cpu=model(replace(common, trace_storage='auto', gpu_budget_bytes=budget)))
    points = sum(len(plan['weights']) for _, _, plan, _ in models['device'].plans)
    cotangent = torch.randn((2, 3, points//2, 6), dtype=torch.complex64,
                            generator=generator).to(device)
    cotangent_sha = hashlib.sha256(cotangent.cpu().numpy().tobytes()).hexdigest()
    def run(name):
        parameter = base.clone().requires_grad_()
        torch.cuda.synchronize(device)
        before = torch.cuda.memory_allocated(device)
        torch.cuda.reset_peak_memory_stats(device)
        start = time.perf_counter()
        planes = models[name](parameter, frequencies, fixed_epsilon=fixed, block_size=8)
        torch.cuda.synchronize(device)
        forward = time.perf_counter()-start
        fields = torch.stack([plane.fields for plane in planes.values()])/region.time_step
        start = time.perf_counter()
        derivative, = torch.autograd.grad(fields, parameter, cotangent)
        torch.cuda.synchronize(device)
        backward = time.perf_counter()-start
        report = next(iter(planes.values())).report
        expected = 'cpu' if name in ('cpu_async', 'auto_cpu') else 'device'
        assert report['trace_storage'] == expected
        row = dict(forward_seconds=forward, backward_seconds=backward,
            pair_seconds=forward+backward,
            peak_increment_bytes=torch.cuda.max_memory_allocated(device)-before,
            **{key: report[key] for key in ('gpu_reservation_bytes', 'host_reservation_bytes',
                'trace_storage_requested', 'trace_storage', 'trace_transfers', 'trace_bytes',
                'trace_device_bytes', 'trace_host_bytes', 'trace_pinned_host_bytes',
                'trace_transfer_device_bytes', 'trace_chunk_steps')})
        assert row['peak_increment_bytes'] <= row['gpu_reservation_bytes']
        values = fields.detach().cpu(), derivative.detach().cpu()
        return row, values
    expected = None
    names = ('device', 'auto_device', 'cpu_async', 'auto_cpu')
    print('warming', region.shape, 'steps', args.steps, flush=True)
    for name in names:
        _, actual = run(name)
        if expected is None:
            expected = actual
        assert all(torch.equal(a, b) for a, b in zip(expected, actual)), name
    samples = {name: [] for name in names}
    for repeat in range(args.repeats):
        order = names[repeat % len(names):]+names[:repeat % len(names)]
        for name in order:
            row, actual = run(name)
            assert all(torch.equal(a, b) for a, b in zip(expected, actual)), name
            samples[name].append(row)
            print(repeat, name, row, flush=True)
    keys = ('forward_seconds', 'backward_seconds', 'pair_seconds', 'peak_increment_bytes')
    medians = {name: {key: statistics.median(row[key] for row in rows) for key in keys}
               for name, rows in samples.items()}
    root = Path(torchfdtd.__file__).resolve().parent
    files = ('reversible_cpml.py', 'reversible_cpml_memory.py', 'reversible_trace.py',
             'reversible_cpml_planes.py', 'reversible_cpml_kernels.py', 'reversible_cuda_fused.py',
             'cuda_kernels.py', 'cuda_adjoint.py', 'differentiable.py')
    result = dict(passed=True, scope='automatic placement, fixed complete reservations, whole solve wall time',
        package_path=str(root), torch_version=torch.__version__, device=torch.cuda.get_device_name(device),
        platform=platform.platform(), shape=list(region.shape), steps=args.steps, material_components=3,
        frequencies=3, quadrature=[8, 8], repeats=args.repeats, model_construction_timed=False,
        constrained_gpu_budget_bytes=budget, explicit_device_refusal=refusal,
        accuracy=dict(fields_bit_identical=True, material_vjp_bit_identical=True, max_absolute_difference=0),
        project_sha256=hashlib.sha256(project.model_dump_json().encode()).hexdigest(),
        material_sha256=material_sha, cotangent_sha256=cotangent_sha,
        source_sha256={name: hashlib.sha256((root/name).read_bytes()).hexdigest() for name in files},
        driver_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), medians=medians, samples=samples)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(dict(medians=medians, accuracy=result['accuracy']), indent=2), flush=True)


if __name__ == '__main__':
    main()
