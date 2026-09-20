"""Exactly two native FP32 modal-network gradient measurements on local RTX3060.

No old physical case, finite-difference FDTD pair, or existing test is rerun.
The reporting subclass retains report dictionaries only and changes no solver
operation. Raw measured source bytes are copied to a private .local directory.
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
import torchfdtd.mode_network as network_module
from torchfdtd.solver import field_axes
from benchmarks.mode_network_refinement import make, digest, summarize
from benchmarks.mode_network_slab_oracle import continuum_slab, discrete_slab


def objective(s):
    return s[1, 0].real + .3*s[0, 1].imag


def scalar_derivative(function, epsilon=2.6, delta=1e-5):
    return float((objective(function(epsilon+delta))-objective(function(epsilon-delta)))/(2*delta))


def source_manifest(root):
    names = [
        'benchmarks/mode_network_gradient_refinement.py',
        'benchmarks/mode_network_refinement.py', 'benchmarks/mode_network_slab_oracle.py',
        *['torchfdtd/'+name+'.py' for name in (
            'mode_network', 'mode_injection', 'mode_ports', 'recomputed_batch',
            'differentiable', 'adjoint_planes', 'adjoint_spectrum', 'adjoint_memory',
            'cuda_adjoint', 'cuda_kernels', 'cuda_memory', 'memory_profile',
            'models', 'solver', 'boundaries', 'field_monitors', 'injection', 'waveforms')]]
    raw = {name: (root/name).read_bytes() for name in names}
    hashes = {name: hashlib.sha256(data).hexdigest() for name, data in raw.items()}
    manifest_hash = digest(hashes)
    private = root/'.local'/'mode_network_gradient_refinement_sources'/manifest_hash
    for name, data in raw.items():
        target = private/name
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.read_bytes() != data:
            raise RuntimeError('Private raw-source snapshot collision.')
        target.write_bytes(data)
    return raw, hashes, manifest_hash, str(private.relative_to(root)).replace('\\', '/')


def run_mesh(h, device, hashes, manifest_hash):
    gc.collect()
    torch.cuda.empty_cache()
    project, ports, config = make(h)
    options = AdjointOptions(checkpoints=4, storage='device', backward_kernel='auto')
    prepared = time.perf_counter()
    network = network_module.ModeNetwork(project, ports, 2.25, options)
    base = network.reference_epsilon(device=device)
    mask = torch.zeros_like(base)
    coordinates = []
    for c, component in enumerate(('Ex', 'Ey', 'Ez')):
        x = np.asarray(field_axes(project.region, component)[0])
        ids = np.flatnonzero((x >= -.2-1e-9) & (x < .2-1e-9))
        mask[torch.tensor(ids, device=device), :, :, c] = 1
        coordinates.append(dict(component=component, indices=ids.tolist(), coordinates_um=x[ids].tolist()))
    parameter = torch.tensor(.35, device=device, dtype=torch.float32, requires_grad=True)
    torch.cuda.synchronize(device)
    preparation_seconds = time.perf_counter()-prepared
    reports = []
    stage = ['network_forward']
    original = network_module.ModeInjectedPlaneSimulation
    class ReportingSimulation(original):
        def forward(self, *args, **kwargs):
            value = super().forward(*args, **kwargs)
            report = next(iter(value.values())).report
            reports.append(dict(stage=stage[0], source_direction=self.launch.direction,
                                launch_identity=self.launch.identity, report=report))
            return value
    network_module.ModeInjectedPlaneSimulation = ReportingSimulation
    torch.cuda.reset_peak_memory_stats(device)
    baseline_allocated = torch.cuda.memory_allocated(device)
    baseline_reserved = torch.cuda.memory_reserved(device)
    started = time.perf_counter()
    try:
        result = network(base+parameter*mask)
        loss = objective(result.s)
        torch.cuda.synchronize(device)
        forward_seconds = time.perf_counter()-started
        forward_peak_allocated = torch.cuda.max_memory_allocated(device)
        forward_peak_reserved = torch.cuda.max_memory_reserved(device)
        stage[0] = 'network_backward_reconstruction'
        reversing = time.perf_counter()
        gradient, = torch.autograd.grad(loss, parameter)
        torch.cuda.synchronize(device)
        backward_seconds = time.perf_counter()-reversing
        peak_allocated = torch.cuda.max_memory_allocated(device)
        peak_reserved = torch.cuda.max_memory_reserved(device)
    finally:
        network_module.ModeInjectedPlaneSimulation = original
    # Only scalar independent oracle calculations, not finite-difference FDTD.
    exact_discrete = scalar_derivative(lambda value: discrete_slab(h, project.region.time_step, epsilon=value))
    exact_continuum = scalar_derivative(lambda value: continuum_slab(epsilon=value))
    measured = float(gradient)
    s = result.s.detach().cpu().numpy()
    selections = ('forward_seconds', 'backward_seconds', 'forward_backend', 'backward_backend',
                  'restart_bytes', 'checkpoint_capacity', 'checkpoint_storage',
                  'peak_checkpoints', 'replayed_steps', 'checkpoint_tiers',
                  'checkpoint_bytes_written', 'checkpoint_bytes_read',
                  'memory_reservation_bytes', 'gpu_reservation_bytes',
                  'source_neighborhood_gradient', 'modal_source_identity',
                  'full_time_autograd', 'higher_order')
    launches = [dict(stage=item['stage'], source_direction=item['source_direction'],
                    launch_identity=item['launch_identity'],
                    report={key: item['report'][key] for key in selections if key in item['report']})
                for item in reports]
    row = dict(spacing_um=h, grid=list(project.region.shape), steps=project.region.steps,
        time_step_s=project.region.time_step, duration_s=project.region.steps*project.region.time_step,
        configuration=config, physical_configuration_sha256=digest(config),
        measured_template_project=project.model_dump(mode='json'),
        measured_template_project_sha256=digest(project.model_dump(mode='json')),
        prepared_launch_project_sha256=[digest(p.model_dump(mode='json')) for p in network._projects],
        changed_yee_coordinates=coordinates, changed_electric_dofs=int(mask.sum().item()),
        parameter_value=float(parameter.detach()), target_slab_epsilon=2.6,
        represented_slab_epsilon=float((base+parameter.detach()*mask)[mask.bool()][0]),
        native_loss=float(loss.detach()), native_gradient=measured,
        discrete_oracle_derivative=exact_discrete, continuum_derivative=exact_continuum,
        oracle_central_epsilon_step=1e-5,
        relative_error_vs_discrete=abs(measured/exact_discrete-1),
        relative_error_vs_continuum=abs(measured/exact_continuum-1),
        sign_matches_discrete=bool(np.sign(measured)==np.sign(exact_discrete)),
        sign_matches_continuum=bool(np.sign(measured)==np.sign(exact_continuum)),
        s_parameters=summarize(s), preparation_seconds=preparation_seconds,
        network_forward_seconds=forward_seconds, network_backward_seconds=backward_seconds,
        forward_plus_backward_seconds=forward_seconds+backward_seconds,
        baseline_allocated_bytes=baseline_allocated, baseline_reserved_bytes=baseline_reserved,
        forward_peak_allocated_bytes=forward_peak_allocated, forward_peak_reserved_bytes=forward_peak_reserved,
        forward_plus_backward_peak_allocated_bytes=peak_allocated,
        forward_plus_backward_peak_reserved_bytes=peak_reserved,
        peak_vram_scope='Torch CUDA allocator peaks, including live input buffers. CUDA context, CuPy driver/module allocations and other processes are excluded. Not total-device VRAM.',
        checkpoint_options=asdict(options), native_launch_reports=launches,
        network_report=result.report, source_sha256=hashes, source_manifest_sha256=manifest_hash,
        native_fdtd_finite_difference_runs=0, network_forward_calls=1, network_backward_calls=1)
    del result, loss, gradient, base, mask, parameter, network, reports, launches
    gc.collect()
    torch.cuda.empty_cache()
    return row


def run(device, output_path):
    root = Path(__file__).resolve().parents[1]
    device = torch.device(device)
    if device.type != 'cuda' or not torch.cuda.is_available():
        raise ValueError('This diagnostic requires the local RTX3060 CUDA device.')
    torch.cuda.set_device(device)
    hardware = torch.cuda.get_device_name(device)
    if '3060' not in hardware:
        raise ValueError('Only the local RTX3060 is authorized for this diagnostic.')
    raw, hashes, manifest_hash, snapshot = source_manifest(root)
    previous = root/'docs/validation/mode_network_gradient_diagnostic.json'
    previous_bytes = previous.read_bytes()
    report = dict(recorded_utc=datetime.now(timezone.utc).isoformat(),
        revision=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
        hardware=hardware, device=str(device), torch_version=torch.__version__, cuda_version=torch.version.cuda,
        objective='Re(S21) + 0.3 Im(S12)', precision='float32',
        scope='Exactly one native network forward/backward per mesh, fixed homogeneous slab epsilon parameter. Matched calibration and per-column recomputation are part of each invocation. No eigenmode or exterior material gradients, no FDTD finite differences, no physical optimization step.',
        checkpoint_scope='Four device restart states per active native launch. Backward reconstructs one launch graph at a time. No full time-autograd graph and no simultaneous launch graphs.',
        reporting_instrumentation='Benchmark-only subclass retains native result report dictionaries, which the existing adjoint updates during backward. Numerical methods and source files are not modified.',
        source_sha256=hashes, source_manifest_sha256=manifest_hash,
        raw_source_snapshot_directory=snapshot,
        scalar_gradient_record_sha256=hashlib.sha256(previous_bytes).hexdigest(),
        meshes=[])
    total = time.perf_counter()
    for h in (.1, .05):
        row = run_mesh(h, device, hashes, manifest_hash)
        report['meshes'].append(row)
        report['complete'] = len(report['meshes']) == 2
        report['elapsed_seconds'] = time.perf_counter()-total
        for name, data in raw.items():
            if (root/name).read_bytes() != data:
                raise RuntimeError('Measured source changed during diagnostics: '+name)
        assert previous.read_bytes() == previous_bytes
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(report, indent=2, allow_nan=False)+'\n', encoding='utf-8', newline='\n')
        print(json.dumps({key: row[key] for key in ('spacing_um', 'native_gradient',
            'discrete_oracle_derivative', 'continuum_derivative', 'relative_error_vs_discrete',
            'relative_error_vs_continuum', 'forward_plus_backward_seconds',
            'forward_plus_backward_peak_allocated_bytes')}), flush=True)
    return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--device', default='cuda:0')
    parser.add_argument('--output', default='docs/validation/mode_network_gradient_refinement_3060.json')
    args = parser.parse_args()
    run(args.device, Path(args.output))
