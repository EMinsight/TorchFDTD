"""One finer-mesh conservation check, retaining the historical coarse result.

Run from repository root: python -m benchmarks.mode_network_refinement --output ...
No material gradients or unchanged acceptance suite are rerun here.
"""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import time
from datetime import datetime, timezone
import numpy as np
import torch
from torchfdtd import Project, Region, Source, Boundaries, BoundaryFace, AdjointOptions
from torchfdtd.mode_network import FixedModePort, ModeNetwork
from torchfdtd.solver import field_axes


COARSE_S = [[[.04124605283141136, .020350085571408272],
             [.8277258276939392, .5658244490623474]],
            [[.8277257680892944, .5658245086669922],
             [-.0457790307700634, .004412192385643721]]]


def digest(value):
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(',', ':'), allow_nan=False).encode()).hexdigest()


def configuration(h):
    return dict(domain_um=[8., 1., 1.], spacing_um=h,
        steps=int(round(120/h)), pml_cells=int(round(1/h)), pml_thickness_um=1.,
        transverse_boundaries='periodic', longitudinal_boundaries='CPML',
        carrier_wavelength_um=1.55, gaussian_pulse_cycles=2,
        source_planes_um=[-2., 2.], port_phase_planes_um=[-1., 1.],
        background_epsilon=2.25, epsilon_increment=.35,
        perturbation='-0.2 <= actual Yee component x coordinate < 0.2 um, all y/z',
        perturbation_bounds_um=[-.2, .2], mode_indices=[0], precision='float32')


def make(h):
    config = configuration(h)
    boundaries = Boundaries(**{a+'_'+side: BoundaryFace(kind='periodic')
                              for a in 'yz' for side in ('min', 'max')})
    r = Region(dimension='3d', size=(8., 1., 1.), mesh=h, pml_cells=config['pml_cells'],
               steps=config['steps'], material_sampling='yee', boundaries=boundaries, precision='float32')
    project = Project(region=r, sources=[Source(kind='plane', normal='x', center=(-2., 0., 0.),
                size=(0., 1., 1.), pulse_cycles=2)], monitors=[])
    ports = (FixedModePort('left', -1., -2., 1), FixedModePort('right', 1., 2., -1))
    return project, ports, config


def summarize(s):
    return dict(s_real_imag=np.stack((s.real, s.imag), -1).tolist(),
        column_power=np.sum(abs(s)**2, axis=0).tolist(),
        maximum_power_defect=float(np.max(abs(np.sum(abs(s)**2, axis=0)-1))),
        reciprocal_transmission_error=float(abs(s[0, 1]-s[1, 0])))


def run(device):
    root = Path(__file__).resolve().parents[1]
    names = ['benchmarks/mode_network_refinement.py', 'torchfdtd/mode_network.py',
             'torchfdtd/mode_injection.py', 'torchfdtd/mode_ports.py',
             'torchfdtd/adjoint_planes.py', 'torchfdtd/differentiable.py',
             'torchfdtd/recomputed_batch.py', 'torchfdtd/solver.py',
             'torchfdtd/boundaries.py', 'torchfdtd/cuda_kernels.py',
             'torchfdtd/waveforms.py', 'torchfdtd/models.py']
    hashes = {name: hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    started = time.perf_counter()
    project, ports, fine_config = make(.1)
    coarse_project, _, coarse_config = make(.2)
    assert np.isclose(project.region.steps*project.region.time_step,
                      coarse_project.region.steps*coarse_project.region.time_step, rtol=1e-14, atol=0)
    prepared = time.perf_counter()
    network = ModeNetwork(project, ports, 2.25, AdjointOptions(checkpoints=4))
    preparation_seconds = time.perf_counter()-prepared
    epsilon = network.reference_epsilon(device=device)
    changed = []
    # Sample one fixed physical slab separately at each E component location.
    for c, name in enumerate(('Ex', 'Ey', 'Ez')):
        x = np.asarray(field_axes(project.region, name)[0])
        selected = (x >= -.2-1e-9) & (x < .2-1e-9)
        ids = np.flatnonzero(selected)
        epsilon[torch.tensor(ids, device=device), :, :, c] += .35
        changed.append(dict(component=name, indices=ids.tolist(), coordinates_um=x[ids].tolist()))
    measured = time.perf_counter()
    with torch.no_grad():
        result = network(epsilon)
    if device == 'cuda':torch.cuda.synchronize()
    solve_seconds = time.perf_counter()-measured
    s = result.s.detach().cpu().numpy()
    coarse = np.array(COARSE_S)[..., 0]+1j*np.array(COARSE_S)[..., 1]
    fine = summarize(s)
    output = dict(recorded_utc=datetime.now(timezone.utc).isoformat(),
        revision=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
        device=device, hardware=torch.cuda.get_device_name() if device == 'cuda' else 'CPU',
        torch_version=torch.__version__, source_sha256=hashes,
        source_hash_scope='Measured finer run driver/runtime bytes. Not attributed to the historical coarse run.',
        coarse=dict(**summarize(coarse), configuration=coarse_config,
            physical_configuration_sha256=digest(coarse_config),
            time_step_s=coarse_project.region.time_step,
            duration_s=coarse_project.region.steps*coarse_project.region.time_step,
            measured_source_sha256=None, measured_full_project_sha256=None,
            provenance='Verbatim S entries from prior test_mode_network physical test console output. Physical configuration reconstructed from that test. Source/config hashes were not recorded contemporaneously. No coarse solve rerun.',
            individual_solve_seconds=None, original_three_test_suite_seconds=24.25),
        fine=dict(**fine, configuration=fine_config,
            physical_configuration_sha256=digest(fine_config),
            measured_project=project.model_dump(mode='json'),
            measured_project_sha256=digest(project.model_dump(mode='json')),
            grid=list(project.region.shape), time_step_s=project.region.time_step,
            duration_s=project.region.steps*project.region.time_step,
            changed_yee_coordinates=changed,
            preparation_seconds=preparation_seconds, network_call_seconds=solve_seconds,
            beta_per_um=network._launches[0].mode.beta_per_um),
        defect_ratio_fine_over_coarse=fine['maximum_power_defect']/summarize(coarse)['maximum_power_defect'],
        elapsed_seconds=time.perf_counter()-started,
        scope='One spatial refinement with fixed physical geometry, duration, PML thickness, source and port planes. Not a completed convergence study.')
    if any(hashlib.sha256((root/name).read_bytes()).hexdigest()!=value for name, value in hashes.items()):
        raise RuntimeError('Measured source files changed during refinement run.')
    return output


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--device', choices=['cpu', 'cuda'], default='cuda')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    result = run(args.device)
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(result, indent=2, allow_nan=False)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps({key: result[key] for key in ('defect_ratio_fine_over_coarse', 'elapsed_seconds')}))
    print(json.dumps({key: result['fine'][key] for key in ('s_real_imag', 'column_power', 'maximum_power_defect', 'reciprocal_transmission_error', 'network_call_seconds')}))
