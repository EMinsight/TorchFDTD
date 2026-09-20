"""Matched end-to-end FP32/FP64 periodic response and density-VJP study.

Each run uses one precision for density, fields, response and scalar objective.
The real FP32 and FP64 paths use complex64 and complex128 fields respectively.
This synthetic case is not the original CR application or an optical oracle.
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import statistics
import time

import torch

from photonweave import AdjointBatchOptions, AdjointExecutionPolicy, AdjointOptions, PeriodicLayerResponse


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    parser.add_argument('--steps', type=int, default=1600)
    parser.add_argument('--repeats', type=int, default=3)
    args = parser.parse_args(argv)
    if args.steps < 128 or args.repeats < 3 or not torch.cuda.is_available():
        raise ValueError('Require CUDA, at least 128 steps and three repetitions.')
    torch.set_num_threads(4)
    root = Path(__file__).resolve().parents[1]
    files = [Path(__file__).resolve(), *sorted((root/'photonweave').glob('*.py'))]
    report = dict(stage='running', scope=__doc__, hardware=torch.cuda.get_device_name(),
        torch_version=torch.__version__, cpu_threads=4, steps=args.steps, repeats=args.repeats,
        warmups_per_precision=1, design_and_objective_precision='Matches each run precision',
        records={'float64':[], 'float32':[]},
        error_limits=dict(response_relative_l2=1e-4, density_vjp_relative_l2=1e-3),
        timing_scope='Warm complete periodic response, squared-response objective and CPU density VJP, including '
            'internal solver setup and CPU/GPU transfers. Excludes outer module construction, '
            'reference warmup, input allocation, checks and cleanup. No optimizer update is timed.',
        source_sha256={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files})
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    def save():
        path.write_bytes((json.dumps(report, indent=2, allow_nan=False)+'\n').encode())
    save()
    budget = 4*1024**3
    spec = dict(wavelength_um=.55, background_index=1.4, design_index=2., period_um=(2.,2.),
        height_um=.6, detector_offset_um=.5, theta_inside_rad=.1, phi_rad=.3)
    models = {precision:PeriodicLayerResponse(spec, density_shape=(32,32), dtype=getattr(torch,precision),
        mesh=.05, steps=args.steps, pml_cells=12,
        policy=AdjointExecutionPolicy(device='cuda', host_budget_bytes=budget,
            resident=AdjointOptions(checkpoints=4, backward_kernel='fused', resident_budget_bytes=budget,
                gpu_budget_bytes=budget, host_budget_bytes=budget)),
        batch_options=AdjointBatchOptions(host_budget_bytes=budget, gpu_budget_bytes=budget))
        for precision in report['records']}
    report.update(grid=models['float64'].project.region.shape, spec=spec,
        density_shape=[32,32], mesh_um=.05, pml_cells=12, quadrature_counts=[24,24])
    seed = torch.linspace(.25,.65,32**2,dtype=torch.float64).reshape(32,32)
    densities = {p:seed.to(getattr(torch,p)).clone().requires_grad_() for p in models}
    def evaluate(precision):
        density = densities[precision]
        density.grad = None
        gc.collect()
        torch.cuda.synchronize()
        torch.cuda.reset_peak_memory_stats()
        baseline = torch.cuda.memory_allocated()
        started = time.perf_counter()
        response = models[precision](density)
        loss = response.square().sum()
        loss.backward()
        torch.cuda.synchronize()
        elapsed = time.perf_counter()-started
        result = (response.detach().clone(), density.grad.detach().clone())
        if any(not torch.isfinite(value).all() or not value.norm() > 0 for value in result):
            raise RuntimeError('Expected finite nonzero response and density VJP.')
        return result, dict(seconds=elapsed, objective=float(loss.detach()),
            gradient_l2=float(density.grad.norm()), baseline_torch_cuda_bytes=baseline,
            peak_torch_cuda_bytes=torch.cuda.max_memory_allocated(),
            peak_torch_reserved_bytes=torch.cuda.max_memory_reserved(),
            reference_cache_hits=models[precision].last_report['reference_cache_hits'])
    def verify(result, expected):
        errors = [float((a.double()-b.double()).norm()/b.double().norm()) for a,b in zip(result,expected)]
        if errors[0] > 1e-4 or errors[1] > 1e-3:
            raise RuntimeError('Single-precision response/VJP discrepancy exceeds the preset limits: '+str(errors))
        return errors
    try:
        expected, _ = evaluate('float64')
        warm, _ = evaluate('float32')
        verify(warm, expected)
        for repeat in range(args.repeats):
            order = list(models) if repeat%2 == 0 else list(reversed(models))
            for precision in order:
                result, measured = evaluate(precision)
                measured['relative_l2_response_and_density_vjp'] = verify(result, expected)
                report['records'][precision].append(measured)
                save()
                print(precision, repeat+1, measured['seconds'], flush=True)
        report['median_seconds'] = {p:statistics.median(r['seconds'] for r in rows) for p,rows in report['records'].items()}
        report['fp64_over_fp32_full_wall'] = report['median_seconds']['float64']/report['median_seconds']['float32']
        report['stage'] = 'complete'
    except Exception as exc:
        report.update(stage='failed', error=str(exc))
        raise
    finally:
        save()
    return report


if __name__ == '__main__':
    main()
