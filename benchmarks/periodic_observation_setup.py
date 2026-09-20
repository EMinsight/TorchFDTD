"""Matched periodic objective/VJP ablation of dense observation setup.

The reference repeats Region.shape per observation as revision 8d9ae7a did.
The production path reuses the shape within one setup. Both execute identical
Yee kernels and the same two-polarization density objective. The temporary
method substitution is serial and restored on exit. Do not use this harness
inside an application concurrently running other solvers.
"""
import argparse
import gc
import hashlib
import json
from pathlib import Path
import statistics
import time

import torch

from torchfdtd import (AdjointBatchOptions, AdjointExecutionPolicy, AdjointOptions,
                        PeriodicLayerResponse)
from torchfdtd.differentiable import _System


def repeated_shape_setup(self):
    """Unmodified observation setup from revision 8d9ae7a."""
    self.observation_maps = []
    for family in ('E', 'H'):
        positions, indices = [], []
        for position, (name, loc, component) in enumerate(self.monitors):
            if name[0] == family:
                positions.append(position)
                indices.append(((loc[0]*self.region.shape[1]+loc[1])*self.region.shape[2]+loc[2])*3+component)
        self.observation_maps.append((torch.tensor(positions, device=self.device, dtype=torch.long),
                                      torch.tensor(indices, device=self.device, dtype=torch.long)))


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', required=True)
    parser.add_argument('--steps', type=int, nargs='+', default=[128, 1600])
    parser.add_argument('--repeats', type=int, default=3)
    args = parser.parse_args(argv)
    if not torch.cuda.is_available():
        raise ValueError('A CUDA device is required.')
    if args.repeats < 3 or any(n < 128 for n in args.steps):
        raise ValueError('Use at least three repetitions and 128 steps.')
    torch.set_num_threads(4)
    root = Path(__file__).resolve().parents[1]
    sources = [Path(__file__).resolve(), *sorted((root/'torchfdtd').glob('*.py'))]
    report = dict(stage='running', scope=__doc__, hardware=torch.cuda.get_device_name(),
        torch_version=torch.__version__, cpu_threads=torch.get_num_threads(), repeats=args.repeats,
        warmups_per_variant=1, baseline_revision='8d9ae7a', cases=[],
        timing_scope='Warm full response/objective/density VJP including internal solver setup and CPU/GPU transfers. '
            'Excludes outer module construction, reference warmup, input allocation, verification and cleanup.',
        source_sha256={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sources})
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    def save():
        path.write_bytes((json.dumps(report, indent=2)+'\n').encode())
    save()
    production = _System.prepare_observations
    methods = dict(repeated_shape=repeated_shape_setup, reused_shape=production)
    budget = 4*1024**3
    spec = dict(wavelength_um=.55, background_index=1.4, design_index=2., period_um=(2., 2.),
                height_um=.6, detector_offset_um=.5, theta_inside_rad=.1, phi_rad=.3)
    try:
        for steps in args.steps:
            model = PeriodicLayerResponse(spec, density_shape=(32, 32), mesh=.05, steps=steps, pml_cells=12,
                policy=AdjointExecutionPolicy(device='cuda', host_budget_bytes=budget,
                    resident=AdjointOptions(checkpoints=4, backward_kernel='fused', resident_budget_bytes=budget,
                        gpu_budget_bytes=budget, host_budget_bytes=budget)),
                batch_options=AdjointBatchOptions(host_budget_bytes=budget, gpu_budget_bytes=budget))
            density = torch.linspace(.25, .65, 32**2, dtype=torch.float64).reshape(32, 32).requires_grad_()
            case = dict(steps=steps, grid=model.project.region.shape, dtype=str(density.dtype),
                        spec=spec, density_shape=list(density.shape), quadrature_counts=[24,24],
                        records={name:[] for name in methods})
            report['cases'].append(case)
            def evaluate(name):
                _System.prepare_observations = methods[name]
                density.grad = None
                gc.collect()
                torch.cuda.synchronize()
                torch.cuda.reset_peak_memory_stats()
                started = time.perf_counter()
                response = model(density)
                loss = response.square().sum()
                loss.backward()
                torch.cuda.synchronize()
                elapsed = time.perf_counter()-started
                if not torch.isfinite(response).all() or not torch.isfinite(density.grad).all() or not density.grad.norm() > 0:
                    raise RuntimeError('Expected finite outputs and a nonzero finite density gradient.')
                result = (response.detach().clone(), density.grad.detach().clone())
                return result, dict(seconds=elapsed, objective=float(loss.detach()),
                    gradient_l2=float(density.grad.norm()), peak_torch_cuda_bytes=torch.cuda.max_memory_allocated(),
                    reference_cache_hits=model.last_report['reference_cache_hits'])
            expected, _ = evaluate('repeated_shape')
            warm, _ = evaluate('reused_shape')
            for actual, reference in zip(warm, expected):
                torch.testing.assert_close(actual, reference, rtol=0, atol=0)
            for repeat in range(args.repeats):
                order = list(methods) if repeat % 2 == 0 else list(reversed(methods))
                for name in order:
                    result, measured = evaluate(name)
                    for actual, reference in zip(result, expected):
                        torch.testing.assert_close(actual, reference, rtol=0, atol=0)
                    measured['bitwise_response_and_density_gradient'] = True
                    case['records'][name].append(measured)
                    save()
                    print(steps, name, repeat+1, measured['seconds'], flush=True)
            case['median_seconds'] = {name:statistics.median(x['seconds'] for x in rows)
                                      for name, rows in case['records'].items()}
            case['full_wall_speedup'] = case['median_seconds']['repeated_shape']/case['median_seconds']['reused_shape']
            save()
            del model, density, expected, warm, result
        report['stage'] = 'complete'
    except Exception as exc:
        report.update(stage='failed', error=str(exc))
        raise
    finally:
        _System.prepare_observations = production
        save()
    return report


if __name__ == '__main__':
    main()
