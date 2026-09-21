"""Independent continuum/slab and Yee-recurrence scattering oracles.

One new h=.05 native network measurement. Existing h=.2/.1 records are inputs
and remain unchanged. Scalar normal-incidence algebra applies to this isotropic
homogeneous-transverse test only, not the general full-vector mode solver.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import time
import numpy as np
import torch
from torchfdtd import AdjointOptions
from torchfdtd.mode_network import ModeNetwork
from torchfdtd.solver import field_axes
from benchmarks.mode_network_refinement import make, summarize, digest
from benchmarks.provenance import git_revision


C_UM_S = 299792458.0 * 1e6


def continuum_slab(*, epsilon=2.6, background=2.25, wavelength_um=1.55,
                   slab=(-.2, .2), ports=(-1., 1.)):
    """Four continuity equations for E/H with exp(+ikx-iwt) phasors.

    r and t are defined at the slab's respective interfaces first. Explicit
    propagation then references them to both port planes. No FDTD code is used.
    """
    n0, ns = np.sqrt(background), np.sqrt(epsilon)
    k0 = 2*np.pi/wavelength_um
    left, right = slab
    phase = np.exp(1j*k0*ns*(right-left))
    # Unknowns are reflected amplitude, slab + wave, slab - wave, transmitted
    # interface amplitude. H is reduced Z0*H, so its admittance is n.
    matrix = np.array([[1, -1, -1, 0], [-n0, -ns, ns, 0],
                       [0, phase, 1/phase, -1], [0, ns*phase, -ns/phase, -n0]], complex)
    reflection, _, _, transmission = np.linalg.solve(matrix, [-1, -n0, 0, 0])
    through = transmission*np.exp(1j*k0*n0*((left-ports[0])+(ports[1]-right)))
    return np.array([[reflection*np.exp(2j*k0*n0*(left-ports[0])), through],
                     [through, reflection*np.exp(2j*k0*n0*(ports[1]-right))]])


def discrete_slab(h, dt, *, epsilon=2.6, background=2.25, wavelength_um=1.55,
                  slab=(-.2, .2), ports=(-1., 1.)):
    """Exact 1D harmonic Yee recurrence for the selected transverse E samples.

    E[j+1] - (2-epsilon[j]*kappa^2) E[j] + E[j-1] = 0,
    kappa = 2 sin(omega*dt/2) / (c*dt/h). The first changed nodal E sample
    is slab[0] and the last is slab[1]-h, exactly as in the FDTD input.
    Interface location is not adjusted to improve continuum agreement.
    """
    courant = C_UM_S*dt/h
    omega = 2*np.pi*C_UM_S/wavelength_um
    kappa = 2*np.sin(omega*dt/2)/courant
    q = 2*np.arcsin(np.sqrt(background)*kappa/2)
    beta = q/h
    count = int(round((slab[1]-slab[0])/h))
    if not np.isclose(count*h, slab[1]-slab[0], rtol=0, atol=1e-12):
        raise ValueError('The oracle requires an integer number of changed samples.')
    def step(value):
        return np.array([[2-value*kappa*kappa, -1], [1., 0]])
    # Start at [E[-1],E[-2]], end at [E[N+1],E[N]], both in background.
    transfer = step(background) @ np.linalg.matrix_power(step(epsilon), count) @ step(background)
    left_x = np.array([slab[0]-h, slab[0]-2*h])
    right_x = np.array([slab[0]+(count+1)*h, slab[0]+count*h])
    incident = np.exp(1j*beta*(left_x-ports[0]))
    reflected = np.exp(-1j*beta*(left_x-ports[0]))
    outgoing = np.exp(1j*beta*(right_x-ports[1]))
    r, t = np.linalg.solve(np.stack((transfer@reflected, -outgoing), 1), -transfer@incident)
    effective_center = slab[0]+(count-1)*h/2
    r_right = r*np.exp(2j*beta*(ports[1]+ports[0]-2*effective_center))
    return np.array([[r, t], [t, r_right]])


def unpack(row):
    values = np.asarray(row['s_real_imag'])
    return values[..., 0]+1j*values[..., 1]


def compare(s, continuum, discrete):
    error = abs(s-continuum)
    return dict(**summarize(s), continuum_absolute_error=error.tolist(),
                maximum_continuum_error=float(error.max()),
                transmission_phase_error_rad=float(np.angle(s[1, 0]/continuum[1, 0])),
                discrete_oracle=summarize(discrete),
                maximum_discrete_error=float(abs(s-discrete).max()))


def run(device):
    root = Path(__file__).resolve().parents[1]
    previous_path = root/'docs/validation/mode_network_refinement_3060.json'
    previous_bytes = previous_path.read_bytes()
    previous = json.loads(previous_bytes)
    names = ['benchmarks/mode_network_slab_oracle.py', 'benchmarks/mode_network_refinement.py',
             *[name for name in previous['source_sha256'] if name.startswith('torchfdtd/')]]
    hashes = {name: hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    started = time.perf_counter()
    project, ports, config = make(.05)
    assert np.isclose(project.region.steps*project.region.time_step,
                      previous['fine']['duration_s'], rtol=1e-14, atol=0)
    network = ModeNetwork(project, ports, 2.25, AdjointOptions(checkpoints=4))
    material = network.reference_epsilon(device=device)
    coordinates = []
    for c, name in enumerate(('Ex', 'Ey', 'Ez')):
        x = np.asarray(field_axes(project.region, name)[0])
        ids = np.flatnonzero((x >= -.2-1e-9) & (x < .2-1e-9))
        material[torch.tensor(ids, device=device), :, :, c] += .35
        coordinates.append(dict(component=name, indices=ids.tolist(), coordinates_um=x[ids].tolist()))
    solving = time.perf_counter()
    with torch.no_grad():
        result = network(material)
    if device == 'cuda':torch.cuda.synchronize()
    solve_seconds = time.perf_counter()-solving
    measured = result.s.detach().cpu().numpy()
    continuum = continuum_slab()
    rows = []
    for key, h in (('coarse', .2), ('fine', .1)):
        old = previous[key]
        row = compare(unpack(old), continuum, discrete_slab(h, old['time_step_s']))
        row.update(spacing_um=h, provenance='Unchanged previous record '+key,
                   time_step_s=old['time_step_s'], duration_s=old['duration_s'])
        rows.append(row)
    row = compare(measured, continuum, discrete_slab(.05, project.region.time_step))
    row.update(spacing_um=.05, provenance='New native FP32 physical measurement',
        configuration=config, physical_configuration_sha256=digest(config),
        measured_template_project=project.model_dump(mode='json'),
        measured_template_project_sha256=digest(project.model_dump(mode='json')),
        prepared_launch_project_sha256=[digest(p.model_dump(mode='json')) for p in network._projects],
        launch_identities=[launch.identity for launch in network._launches],
        grid=list(project.region.shape), time_step_s=project.region.time_step,
        duration_s=project.region.steps*project.region.time_step,
        changed_yee_coordinates=coordinates, network_call_seconds=solve_seconds)
    rows.append(row)
    output = dict(recorded_utc=datetime.now(timezone.utc).isoformat(),
        revision=git_revision(root),
        device=device, hardware=torch.cuda.get_device_name() if device == 'cuda' else 'CPU',
        torch_version=torch.__version__, source_sha256=hashes,
        prior_record_sha256=hashlib.sha256(previous_bytes).hexdigest(),
        prior_record='docs/validation/mode_network_refinement_3060.json',
        continuum=summarize(continuum), meshes=rows, elapsed_seconds=time.perf_counter()-started,
        oracle_convention='exp(+ikx-iwt), same-medium power-normalized t/r at -1,+1 um planes',
        scope='One new spatial refinement. Independent continuum interface continuity and scalar Yee lattice recurrence for the homogeneous-transverse isotropic slab. No general vector/guide oracle claim.')
    assert previous_path.read_bytes() == previous_bytes
    if any(hashlib.sha256((root/name).read_bytes()).hexdigest() != value for name, value in hashes.items()):
        raise RuntimeError('Measured source changed during the run.')
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
    print(json.dumps({'continuum': result['continuum'], 'meshes': [
        {key: row[key] for key in ('spacing_um','s_real_imag','maximum_power_defect',
         'maximum_continuum_error','maximum_discrete_error','transmission_phase_error_rad')}
        for row in result['meshes']], 'elapsed_seconds': result['elapsed_seconds']}))
