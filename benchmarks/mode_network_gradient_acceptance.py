"""One predeclared h=.025 native-gradient and actual descent-step acceptance.

Only this new mesh is run. No native finite-difference pair or warm-up run.
Existing source and evidence files are read-only. The three acceptance limits
below are written to the new JSON before material/field execution.
"""
import argparse
from dataclasses import asdict
from datetime import datetime, timezone
import gc
import hashlib
import json
from pathlib import Path
import subprocess
import time

import numpy as np
import torch
from torchfdtd import AdjointOptions
from torchfdtd.adjoint_memory import _resident_reservation
from torchfdtd.memory_profile import host_memory
import torchfdtd.mode_network as network_module
from torchfdtd.solver import field_axes
from benchmarks.mode_network_refinement import make, digest, summarize
from benchmarks.mode_network_slab_oracle import continuum_slab, discrete_slab


CRITERIA = dict(discrete_derivative_relative_error_max=1e-4,
                continuum_derivative_relative_error_max=.02,
                require_native_and_continuum_loss_decrease=True)
EPSILON_CHANGE = -.001


def objective(s):
    return s[1, 0].real+.3*s[0, 1].imag


def derivative(function, delta=1e-5):
    return float((objective(function(2.6+delta))-objective(function(2.6-delta)))/(2*delta))


def dump(path, report):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, indent=2, allow_nan=False)+'\n', encoding='utf-8', newline='\n')


def run(device, output):
    root = Path(__file__).resolve().parents[1]
    # Capture only source paths used by this measurement, preserving exact bytes.
    prior = root/'docs/validation/mode_network_gradient_refinement_3060.json'
    prior_bytes = prior.read_bytes()
    old = json.loads(prior_bytes)
    names = [name for name in old['source_sha256']
             if name != 'benchmarks/mode_network_gradient_refinement.py']
    names.append('benchmarks/mode_network_gradient_acceptance.py')
    raw = {name: (root/name).read_bytes() for name in names}
    hashes = {name: hashlib.sha256(data).hexdigest() for name, data in raw.items()}
    manifest = digest(hashes)
    snapshot = root/'.local'/'mode_network_gradient_acceptance_sources'/manifest
    for name, data in raw.items():
        target = snapshot/name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    report = dict(declared_utc=datetime.now(timezone.utc).isoformat(), status='criteria_declared',
        complete=False, criteria=CRITERIA, fixed_epsilon_change=EPSILON_CHANGE,
        objective='Re(S21) + 0.3 Im(S12)', target_slab_epsilon=2.6,
        planned_native_network_calls=dict(forward_with_backward=1, additional_forward_for_descent=1),
        planned_native_fdtd_finite_difference_calls=0,
        revision=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
        source_sha256=hashes, source_manifest_sha256=manifest,
        raw_source_snapshot_directory=str(snapshot.relative_to(root)).replace('\\', '/'),
        previous_gradient_record_sha256=hashlib.sha256(prior_bytes).hexdigest(),
        scope='Uniform slab epsilon parameter in the fixed isotropic opposing-port network only. Not general CR or shape-gradient completion.',
        timing_policy='No explicit GPU warmup. First invocation includes process-local lazy initialization. Existing on-disk compiler cache may be reused.')
    dump(output, report)
    device = torch.device(device)
    if device.type != 'cuda' or not torch.cuda.is_available():
        raise ValueError('The local RTX3060 CUDA device is required.')
    torch.cuda.set_device(device)
    hardware = torch.cuda.get_device_name(device)
    if '3060' not in hardware:
        raise ValueError('Only local RTX3060 execution is authorized.')
    project, ports, config = make(.025)
    budget = 2*1024**3
    options = AdjointOptions(checkpoints=4, storage='device', backward_kernel='auto',
                             gpu_budget_bytes=budget, host_budget_bytes=budget,
                             resident_budget_bytes=budget)
    network = network_module.ModeNetwork(project, ports, 2.25, options)
    wrapper = network._admit()
    planned = []
    for case, launch in zip(network._projects, network._launches):
        plane = network_module.ModeInjectedPlaneSimulation(case, launch, options)
        # Scalar CPU metadata carrier, no full epsilon/E/H volume allocation.
        spectral = plane._spectral(torch.empty((), dtype=torch.float32), [299792458/1.55e-6], 32)
        base_plan = _resident_reservation(plane.model.project, options, device, spectral)
        modal_extra = 2*launch.storage_bytes+math_prod(project.region.shape)*3*4
        planned.append(dict(base=base_plan, modal_extra_bytes=modal_extra,
                            host_layout_bytes=plane.layout_reservation_bytes))
        del plane, spectral
    planned_gpu = max(p['base']['gpu_reservation_bytes']+p['modal_extra_bytes'] for p in planned)+wrapper
    planned_host = max(p['base']['host_reservation_bytes']+p['modal_extra_bytes']+p['host_layout_bytes'] for p in planned)+wrapper
    available_gpu, total_gpu = torch.cuda.mem_get_info(device)
    available_host = host_memory()['available_bytes']
    admitted = (planned_gpu <= min(budget, .8*available_gpu) and planned_host <= budget
                and (available_host is None or planned_host <= .8*available_host))
    report.update(hardware=hardware, device=str(device), torch_version=torch.__version__, cuda_version=torch.version.cuda,
        precision='float32', configuration=config, physical_configuration_sha256=digest(config),
        grid=list(project.region.shape), steps=project.region.steps, time_step_s=project.region.time_step,
        duration_s=project.region.steps*project.region.time_step,
        checkpoint_options=asdict(options),
        checkpoint_scope='Four device restart states per active launch and one launch graph at a time via recompute_cases. No full Nstep autograd graph.',
        memory_preflight=dict(passed=admitted, checked_before_volume_allocation=True,
            per_case_plans=planned, wrapper_reservation_bytes=wrapper,
            combined_gpu_reservation_bytes=planned_gpu, combined_host_reservation_bytes=planned_host,
            explicit_gpu_and_host_budget_bytes=budget,
            available_gpu_bytes=available_gpu, total_gpu_bytes=total_gpu, available_host_bytes=available_host),
        status='memory_preflight_passed' if admitted else 'memory_preflight_failed')
    dump(output, report)
    print(json.dumps({'stage':report['status'], 'combined_gpu_reservation_bytes':planned_gpu,
                      'combined_host_reservation_bytes':planned_host}), flush=True)
    if not admitted:
        raise ValueError('Memory preflight failed. No FDTD run attempted.')
    base = network.reference_epsilon(device=device)
    mask = torch.zeros_like(base)
    changed = []
    for c, name in enumerate(('Ex', 'Ey', 'Ez')):
        x = np.asarray(field_axes(project.region, name)[0])
        ids = np.flatnonzero((x >= -.2-1e-9) & (x < .2-1e-9))
        mask[torch.tensor(ids, device=device), :, :, c] = 1
        changed.append(dict(component=name, indices=ids.tolist(), coordinates_um=x[ids].tolist()))
    parameter = torch.tensor(.35, device=device, dtype=torch.float32, requires_grad=True)
    reports = []
    stage = ['gradient_forward']
    original = network_module.ModeInjectedPlaneSimulation
    class ReportingSimulation(original):
        def forward(self, *args, **kwargs):
            value = super().forward(*args, **kwargs)
            reports.append(dict(stage=stage[0], direction=self.launch.direction,
                                report=next(iter(value.values())).report))
            return value
    network_module.ModeInjectedPlaneSimulation = ReportingSimulation
    try:
        torch.cuda.synchronize(device)
        torch.cuda.reset_peak_memory_stats(device)
        started = time.perf_counter()
        result = network(base+parameter*mask)
        loss = objective(result.s)
        torch.cuda.synchronize(device)
        forward_seconds = time.perf_counter()-started
        print(json.dumps({'stage':'gradient_forward_complete','seconds':forward_seconds}), flush=True)
        stage[0] = 'gradient_backward_reconstruction'
        started = time.perf_counter()
        gradient, = torch.autograd.grad(loss, parameter)
        torch.cuda.synchronize(device)
        backward_seconds = time.perf_counter()-started
        native_gradient, native_loss = float(gradient), float(loss.detach())
        base_s = result.s.detach().cpu().numpy().copy()
        gradient_peaks = dict(allocated_bytes=torch.cuda.max_memory_allocated(device),
                              reserved_bytes=torch.cuda.max_memory_reserved(device))
        print(json.dumps({'stage':'gradient_backward_complete','seconds':backward_seconds,
                          'native_gradient':native_gradient}), flush=True)
        del result, loss, gradient
        gc.collect()
        torch.cuda.empty_cache()
        stage[0] = 'fixed_descent_forward'
        torch.cuda.reset_peak_memory_stats(device)
        started = time.perf_counter()
        with torch.no_grad():
            changed_result = network(base+(parameter.detach()+EPSILON_CHANGE)*mask)
            changed_loss = float(objective(changed_result.s))
            changed_s = changed_result.s.detach().cpu().numpy().copy()
        torch.cuda.synchronize(device)
        descent_seconds = time.perf_counter()-started
        descent_peaks = dict(allocated_bytes=torch.cuda.max_memory_allocated(device),
                             reserved_bytes=torch.cuda.max_memory_reserved(device))
        del changed_result
    finally:
        network_module.ModeInjectedPlaneSimulation = original
    discrete = derivative(lambda value: discrete_slab(.025, project.region.time_step, epsilon=value))
    continuum = derivative(lambda value: continuum_slab(epsilon=value))
    continuum_before = float(objective(continuum_slab(epsilon=2.6)))
    continuum_after = float(objective(continuum_slab(epsilon=2.6+EPSILON_CHANGE)))
    discrete_error = abs(native_gradient/discrete-1)
    continuum_error = abs(native_gradient/continuum-1)
    native_change = changed_loss-native_loss
    continuum_change = continuum_after-continuum_before
    checks = dict(discrete_derivative=discrete_error <= CRITERIA['discrete_derivative_relative_error_max'],
        continuum_derivative=continuum_error <= CRITERIA['continuum_derivative_relative_error_max'],
        native_and_continuum_descent=native_change < 0 and continuum_change < 0)
    keys = ('forward_seconds','backward_seconds','forward_backend','backward_backend',
            'restart_bytes','checkpoint_capacity','checkpoint_storage','peak_checkpoints',
            'replayed_steps','checkpoint_tiers','checkpoint_bytes_written','checkpoint_bytes_read',
            'full_time_autograd','higher_order','gpu_reservation_bytes','source_neighborhood_gradient')
    compact_reports = [dict(stage=r['stage'],direction=r['direction'],
                           report={key:r['report'][key] for key in keys if key in r['report']}) for r in reports]
    report.update(status='completed', complete=True, recorded_utc=datetime.now(timezone.utc).isoformat(),
        changed_yee_coordinates=changed, changed_electric_dofs=int(mask.sum().item()),
        measured_template_project=project.model_dump(mode='json'),
        measured_template_project_sha256=digest(project.model_dump(mode='json')),
        prepared_launch_project_sha256=[digest(p.model_dump(mode='json')) for p in network._projects],
        native_gradient=native_gradient, discrete_oracle_derivative=discrete, continuum_derivative=continuum,
        oracle_central_epsilon_step=1e-5, relative_error_vs_discrete=discrete_error,
        relative_error_vs_continuum=continuum_error,
        native_base_loss=native_loss, native_changed_loss=changed_loss, native_loss_change=native_change,
        continuum_base_loss=continuum_before, continuum_changed_loss=continuum_after,
        continuum_loss_change=continuum_change, fixed_change_is_native_descent_direction=bool(native_gradient*EPSILON_CHANGE < 0),
        base_s_parameters=summarize(base_s), changed_s_parameters=summarize(changed_s),
        gradient_forward_seconds=forward_seconds, gradient_backward_seconds=backward_seconds,
        fixed_descent_forward_seconds=descent_seconds,
        gradient_torch_cuda_peaks=gradient_peaks, descent_torch_cuda_peaks=descent_peaks,
        peak_vram_scope='Torch allocated/reserved peaks include live input arrays, but exclude CUDA context, CuPy driver/module allocations and other processes. Not total-device VRAM.',
        native_launch_reports=compact_reports, acceptance_checks=checks, accepted=all(checks.values()),
        actual_native_network_calls=dict(forward_with_backward=1, additional_forward_for_descent=1),
        native_fdtd_finite_difference_calls=0,
        conclusion_scope='Only this fixed isotropic slab material-parameter objective and declared tolerances. No general CR, arbitrary shape, port eigenmode, or continuous-shape-gradient claim.')
    for name, data in raw.items():
        if (root/name).read_bytes() != data:
            raise RuntimeError('Measured source changed during execution: '+name)
    assert prior.read_bytes() == prior_bytes
    dump(output, report)
    print(json.dumps({key: report[key] for key in ('native_gradient','discrete_oracle_derivative',
        'continuum_derivative','relative_error_vs_discrete','relative_error_vs_continuum',
        'native_loss_change','continuum_loss_change','acceptance_checks','accepted')}), flush=True)
    return report


def math_prod(shape):
    result = 1
    for value in shape:
        result *= value
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--device', default='cuda:0')
    parser.add_argument('--output', default='docs/validation/mode_network_gradient_acceptance_3060.json')
    args = parser.parse_args()
    run(args.device, Path(args.output))
