"""One bounded CUDA recorded-policy CR correctness gate, no speed claim."""
from pathlib import Path
from dataclasses import asdict
import copy
import gc
import hashlib
import json
import subprocess
import sys
import traceback
import weakref

ROOT = Path(__file__).resolve().parents[1]
sys.path[:0] = [str(ROOT), str(ROOT/'tests')]
import torch
from torchfdtd import (AdjointBatchOptions, AdjointExecutionPolicy, AdjointOptions,
                       PeriodicLayerResponse, ReversibleCPMLOptions)
from test_recorded_periodic_response import SPEC, objective
import torchfdtd.reversible_cpml as core
from torchfdtd.cuda_bootstrap import prepare_cuda_kernels

OUTPUT = Path(__file__).with_suffix('.json')
PATHS = [Path(__file__), *[ROOT/'torchfdtd'/name for name in (
    'recorded_execution.py', 'execution_tuning.py', 'adjoint_batch.py',
    'periodic_adjoint.py', 'density_layer.py', 'reversible_cpml.py',
    'reversible_cpml_planes.py', 'reversible_cpml_memory.py', 'reversible_trace.py',
    'reversible_cpml_kernels.py', 'cuda_adjoint.py', 'cuda_complex_adjoint.py')],
    ROOT/'tests/test_recorded_periodic_response.py']


def hashes():
    return {str(p.relative_to(ROOT)).replace('\\', '/'): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in PATHS}


def compare(actual, expected):
    assert torch.isfinite(actual).all() and torch.isfinite(expected).all()
    error = (actual-expected).double()
    reference = expected.double()
    assert reference.norm() > 0 and reference.abs().max() > 0
    result = dict(relative_l2=float(error.norm()/reference.norm()),
                  relative_peak=float(error.abs().max()/reference.abs().max()),
                  maximum_absolute=float(error.abs().max()))
    assert result['relative_l2'] <= 1e-4 and result['relative_peak'] <= 1e-4, result
    return result


def make(recorded):
    budget = 1024**3
    common = dict(device='cuda', host_budget_bytes=budget)
    if recorded:
        common['recorded'] = ReversibleCPMLOptions(trace_storage='cpu', trace_transfers='async',
            trace_chunk_steps=7, host_budget_bytes=budget, gpu_budget_bytes=budget,
            resident_budget_bytes=budget)
    else:
        common['resident'] = AdjointOptions(checkpoints=1, backward_kernel='fused',
            host_budget_bytes=budget, gpu_budget_bytes=budget, resident_budget_bytes=budget)
    return PeriodicLayerResponse(SPEC, density_shape=(2, 2), dtype=torch.float32,
        policy=AdjointExecutionPolicy(**common),
        batch_options=AdjointBatchOptions(host_budget_bytes=budget, gpu_budget_bytes=budget),
        mesh=.1, steps=160, pml_cells=6, quadrature_counts=(4, 4), forward_kernel='fused')


def main():
    if OUTPUT.exists():
        raise FileExistsError('Gate result already exists; never overwrite measured evidence.')
    record = dict(status='running', scope='Actual CUDA PeriodicLayerResponse CPU-density bridge; async CPU recorded trace vs checkpointed; no throughput or general parity claim',
        criteria=dict(response_relative_l2=1e-4, response_relative_peak=1e-4,
                      gradient_relative_l2=1e-4, gradient_relative_peak=1e-4,
                      retained_noncontiguous_seeds=2, peak_not_above_reservation=True),
        spec=SPEC, density=[[.2, .4], [.5, .3]], mesh_um=.1, steps=160,
        pml_cells=6, quadrature_counts=[4, 4], trace_chunk_steps=7,
        source_sha256_before=hashes(), revision=subprocess.check_output(
            ['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
        working_tree_sources=True)
    original = core._RecordedCPML.forward
    owners = []
    def tracked(ctx, *args):
        assert not any(ref() is not None for group in owners for ref in group), 'Previous recorded case owner retained'
        result = original(ctx, *args)
        owners.append((weakref.ref(ctx.system), weakref.ref(ctx.transport),
                       weakref.ref(ctx.saved_tensors[1]) if ctx.saved_tensors else weakref.ref(ctx.transport.archive)))
        return result
    try:
        assert torch.cuda.is_available()
        torch.set_num_threads(1)
        prepare_cuda_kernels()
        record.update(device_name=torch.cuda.get_device_name(), torch_version=torch.__version__,
                      cuda_version=torch.version.cuda)
        core._RecordedCPML.forward = staticmethod(tracked)
        generator = torch.Generator().manual_seed(903)
        seeds = [torch.randn((4, 2), generator=generator).T for _ in range(2)]
        assert all(not seed.is_contiguous() for seed in seeds)
        density = torch.tensor(record['density'], dtype=torch.float32)
        outputs = []
        for recorded in (False, True):
            model = make(recorded)
            plan = model.plan()
            shapes = [list(case.spec.project.region.shape) for case in model._batch._cases]
            assert shapes == [[8, 8, 58], [8, 8, 58]], shapes
            value = density.clone().requires_grad_()
            torch.cuda.synchronize()
            before = torch.cuda.memory_allocated()
            torch.cuda.reset_peak_memory_stats()
            was_enabled = gc.isenabled()
            if recorded:
                gc.disable()
            try:
                response = model(value)
                loss = objective(response)
                gradient, = torch.autograd.grad(loss, value, retain_graph=True)
                batch_first = copy.deepcopy(model.last_report['batch'])
                assert batch_first['forward_cases'] == 2 and batch_first['replayed_cases'] == 2
                assert batch_first['full_case_graph_retention'] is False
                gradients = [gradient.detach()]
                for seed in seeds:
                    g, = torch.autograd.grad(response, value, seed, retain_graph=True)
                    gradients.append(g.detach())
                torch.cuda.synchronize()
                peak = torch.cuda.max_memory_allocated()-before
                assert peak <= plan['gpu_reservation_bytes'], (peak, plan['gpu_reservation_bytes'])
                outputs.append((response.detach(), gradients))
                record['recorded' if recorded else 'checkpointed'] = dict(
                    shape=shapes[0], response=response.detach().tolist(),
                    objective=float(loss), full_density_gradient=gradient.detach().tolist(),
                    retained_seed_gradients=[g.tolist() for g in gradients[1:]],
                    peak_increment_bytes=peak, gpu_reservation_bytes=plan['gpu_reservation_bytes'],
                    host_reservation_bytes=plan['host_reservation_bytes'],
                    first_backward=dict(forward_cases=batch_first['forward_cases'],
                        replayed_cases=batch_first['replayed_cases'],
                        full_case_graph_retention=batch_first['full_case_graph_retention']),
                    last_backward_replayed_cases=model.last_report['batch']['replayed_cases'],
                    backward_invocations=3,
                    case_trace_storage=[c['trace_storage'] for c in plan['batch']['case_reservations']] if recorded else None)
                del response, loss, gradient, g, value
                if recorded:
                    assert owners and not any(ref() is not None for group in owners for ref in group)
            finally:
                if was_enabled:
                    gc.enable()
            del model
        record['response_error'] = compare(outputs[1][0], outputs[0][0])
        record['density_vjp_error'] = compare(outputs[1][1][0], outputs[0][1][0])
        record['retained_seed_errors'] = [compare(a, b) for a, b in zip(outputs[1][1][1:], outputs[0][1][1:])]
        record.update(recorded_case_owners_checked=len(owners), owners_released_without_gc=True,
                      one_recorded_case_alive_at_a_time=True)
        record['source_sha256_after'] = hashes()
        assert record['source_sha256_before'] == record['source_sha256_after'], 'Measured sources changed during gate'
        record['status'] = 'passed'
    except BaseException:
        record['status'] = 'failed'
        record['failure'] = traceback.format_exc()
        raise
    finally:
        core._RecordedCPML.forward = original
        with OUTPUT.open('x', encoding='utf-8', newline='\n') as handle:
            json.dump(record, handle, indent=2, allow_nan=False)
            handle.write('\n')
    print(json.dumps(record, indent=2, allow_nan=False))


if __name__ == '__main__':
    main()
