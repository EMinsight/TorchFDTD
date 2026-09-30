"""Compare repeated recorded plane solves with and without fixed host tables.

Run CUDA measurements under the workstation's exclusive GPU lock. The baseline
uses the same numerical kernels and builders, with the private model cache
disabled. Warmup and model construction are excluded from the repeated-solve
timings. This measures setup savings, not a change in per-timestep throughput.
"""
import argparse
import hashlib
import json
from pathlib import Path
import platform
import statistics
import time

import torch

from torchfdtd import Project, Region, Source, FieldMonitor, ReversibleCPMLOptions
from torchfdtd.cuda_adjoint import FusedAdjointCUDA
from torchfdtd.differentiable import _System
from torchfdtd.reversible_cpml_planes import ReversibleCPMLPlaneSimulation


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--width', type=int, default=224)
    parser.add_argument('--steps', type=int, default=32)
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if args.width < 8 or args.steps < 10 or args.repeats < 3:
        parser.error('width >= 8, steps >= 10 and repeats >= 3 are required.')
    torch.set_num_threads(1)
    device = torch.device('cuda:0')
    size = args.width * .1
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
    options = ReversibleCPMLOptions(forward_kernel='fused_eh', adjoint_kernel='one_pass', block_size=256)
    model = ReversibleCPMLPlaneSimulation(project, options,
        quadrature_counts={'incident': (args.width, args.width), 'detector': (args.width, args.width)})
    cache = model._observation_cache
    generator = torch.Generator().manual_seed(20260930)
    base = torch.full((*region.shape, 3), 1.4)
    base[:, :, 14:18] += .5 * torch.rand(base[:, :, 14:18].shape, generator=generator)
    material_sha = hashlib.sha256(base.numpy().tobytes()).hexdigest()
    base = base.to(device)
    fixed = torch.full_like(base, 1.4)
    frequencies = torch.tensor([.033, .045, .057], device=device) / region.time_step
    point_count = sum(len(plan['weights']) for _, _, plan, _ in model.plans)
    cotangent = torch.randn((2, 3, point_count // 2, 6), generator=generator,
                            dtype=torch.complex64).to(device)
    stage_times = {}
    prepare_original = _System.prepare_observations
    observer_original = FusedAdjointCUDA.observer_kernel
    def timed(function, label):
        def invoke(instance):
            torch.cuda.synchronize(device)
            start = time.perf_counter()
            result = function(instance)
            torch.cuda.synchronize(device)
            stage_times[label] = stage_times.get(label, 0) + time.perf_counter() - start
            return result
        return invoke
    _System.prepare_observations = timed(prepare_original, 'forward_map_seconds')
    FusedAdjointCUDA.observer_kernel = timed(observer_original, 'adjoint_layout_seconds')
    def run(enabled, gradient=True):
        model._observation_cache = cache if enabled else None
        stage_times.clear()
        parameter = base.clone().requires_grad_(gradient)
        torch.cuda.synchronize(device)
        before = torch.cuda.memory_allocated(device)
        torch.cuda.reset_peak_memory_stats(device)
        start = time.perf_counter()
        with torch.set_grad_enabled(gradient):
            planes = model(parameter, frequencies, fixed_epsilon=fixed, block_size=8)
        torch.cuda.synchronize(device)
        forward = time.perf_counter() - start
        fields = torch.stack([plane.fields for plane in planes.values()]) / region.time_step
        if gradient:
            start = time.perf_counter()
            derivative, = torch.autograd.grad(fields, parameter, cotangent)
            torch.cuda.synchronize(device)
            backward = time.perf_counter() - start
        else:
            derivative, backward = None, 0
        report = next(iter(planes.values())).report
        row = dict(forward_seconds=forward, backward_seconds=backward,
                   pair_seconds=forward + backward, **stage_times,
                   peak_increment_bytes=torch.cuda.max_memory_allocated(device) - before,
                   gpu_reservation_bytes=report['gpu_reservation_bytes'],
                   forward_kernel_used=report['forward_kernel_used'],
                   adjoint_kernel_used=report['adjoint_kernel_used'])
        result = fields.detach().cpu(), None if derivative is None else derivative.detach().cpu()
        return row, result
    rows = {'uncached': [], 'cached': [], 'no_grad_uncached': [], 'no_grad_cached': []}
    try:
        print('warming', region.shape, 'observations', len(model.observers), flush=True)
        _, expected = run(False)
        _, cold = run(True)
        assert all(torch.equal(a, b) for a, b in zip(expected, cold))
        for repeat in range(args.repeats):
            for enabled in ((False, True) if repeat % 2 == 0 else (True, False)):
                name = 'cached' if enabled else 'uncached'
                row, result = run(enabled)
                assert all(torch.equal(a, b) for a, b in zip(expected, result))
                assert row['peak_increment_bytes'] <= row['gpu_reservation_bytes']
                rows[name].append(row)
                print(repeat, name, row, flush=True)
            for enabled in ((False, True) if repeat % 2 == 0 else (True, False)):
                name = 'no_grad_cached' if enabled else 'no_grad_uncached'
                row, result = run(enabled, gradient=False)
                assert torch.equal(result[0], expected[0])
                rows[name].append(row)
                print(repeat, name, row, flush=True)
    finally:
        _System.prepare_observations = prepare_original
        FusedAdjointCUDA.observer_kernel = observer_original
        model._observation_cache = cache
    medians = {name: {key: statistics.median(row.get(key, 0) for row in values)
                        for key in ('forward_seconds', 'backward_seconds', 'pair_seconds',
                                    'forward_map_seconds', 'adjoint_layout_seconds')}
               for name, values in rows.items()}
    import torchfdtd
    root = Path(torchfdtd.__file__).resolve().parent
    source_files = ('differentiable.py', 'reversible_cpml.py', 'reversible_cpml_planes.py',
                    'cuda_adjoint.py', 'cuda_kernels.py', 'reversible_cpml_kernels.py',
                    'reversible_cuda_fused.py')
    record = dict(passed=True, scope='warmed repeated plane solves; identical numerical kernels',
                  baseline='same source with model host-table cache disabled',
                  device=torch.cuda.get_device_name(device), platform=platform.platform(),
                  torch_version=torch.__version__, package_path=str(root), shape=list(region.shape),
                  steps=args.steps, observations=len(model.observers), frequencies=3,
                  material_components=3, repeats=args.repeats, model_construction_timed=False,
                  accuracy=dict(fields_bit_identical=True, material_vjp_bit_identical=True,
                                no_grad_bit_identical=True, max_absolute_difference=0),
                  material_sha256=material_sha,
                  project_sha256=hashlib.sha256(project.model_dump_json().encode()).hexdigest(),
                  source_sha256={name: hashlib.sha256((root / name).read_bytes()).hexdigest() for name in source_files},
                  driver_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                  medians=medians, samples=rows)
    record['pair_reduction_fraction'] = 1 - medians['cached']['pair_seconds'] / medians['uncached']['pair_seconds']
    record['no_grad_reduction_fraction'] = 1 - medians['no_grad_cached']['forward_seconds'] / medians['no_grad_uncached']['forward_seconds']
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(dict(medians=medians, pair_reduction_fraction=record['pair_reduction_fraction'],
                         accuracy=record['accuracy']), indent=2), flush=True)


if __name__ == '__main__':
    main()
