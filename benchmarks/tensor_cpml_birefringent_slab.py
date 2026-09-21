"""Fixed-criterion birefringent slab inside a birefringent exterior that fills the CPML.

Run python -m benchmarks.tensor_cpml_birefringent_slab --gradient
Local CUDA only. The exterior and the slab share principal axes rotated about z,
so at normal incidence each transverse eigenpolarization is an independent
scalar channel with an exact transfer-matrix transmission, while the exterior
tensor extends through both z CPML faces under the geometric criterion
(z principal with the largest eigenvalue). Per-channel normalization to the
slab-free run cancels the polarization-dependent source calibration of an
impressed field in a birefringent medium. No tuning after the first run.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import time

import numpy as np
import torch

from torchfdtd import AdjointOptions, Monitor, Project, Region, Source
from torchfdtd.anisotropy import TensorDielectricSimulation, _cpml_faces, cpml_face_admissible

SPEC = dict(exterior_indices=[1.2, 1.4], exterior_normal_permittivity=2.25, slab_indices=[1.5, 2.0],
            slab_normal_permittivity=4.5, rotation_deg=25., slab_thickness_um=.6, wavelength_um=1.55,
            domain_um=[.5, .5, 6.], transverse_mesh_um=.1, normal_meshes_um=[.05, .025], pml_thickness_um=1.,
            source_z_um=-1.2, probe_z_um=1.2, pulse_fwhm_s=6e-15, pulse_offset_s=18e-15, duration_s=80e-15,
            precision='float32')
CRITERIA = dict(coarse_channel_vector_relative_error_max=.05, fine_channel_vector_relative_error_max=.03,
                fine_to_coarse_error_ratio_max=.8, fine_channel_power_absolute_error_max=.03,
                tail_rms_to_peak_max=1e-3, index_vjp_relative_error_max=.15)


def channel(n_exterior, n_slab, spec=SPEC):
    d = spec['slab_thickness_um']
    k = 2*math.pi/spec['wavelength_um']
    delta = k*n_slab*d
    return np.exp(1j*k*n_exterior*d)/(np.cos(delta)+.5j*(n_slab/n_exterior+n_exterior/n_slab)*np.sin(delta))


def oracle(spec=SPEC):
    """Per-eigenpolarization transmission and d|t_1|^2/dn_1 by central difference."""
    values = np.array([channel(n0, n, spec) for n0, n in zip(spec['exterior_indices'], spec['slab_indices'])])
    h = 1e-6
    n0, n1 = spec['exterior_indices'][0], spec['slab_indices'][0]
    derivative = (abs(channel(n0, n1+h, spec))**2-abs(channel(n0, n1-h, spec))**2)/(2*h)
    return values, float(derivative)


def make_project(dz):
    faces = {a+'_'+side: dict(kind='pml' if a == 'z' else 'periodic',
                              **({'layers': round(SPEC['pml_thickness_um']/dz)} if a == 'z' else {}))
             for a in 'xyz' for side in ('min', 'max')}
    region = Region(dimension='3d', size=tuple(SPEC['domain_um']),
                    mesh_steps=(SPEC['transverse_mesh_um'], SPEC['transverse_mesh_um'], dz),
                    steps=10, precision='float32', material_sampling='yee', pml_cells=3, boundaries=faces)
    region.steps = math.ceil(SPEC['duration_s']/region.time_step)
    return Project(region=region, sources=[Source(kind='plane', component='Ex', normal='z',
        size=(SPEC['domain_um'][0], SPEC['domain_um'][1], 0), center=(0, 0, SPEC['source_z_um']),
        pulse='gaussian', time_definition='standard', pulse_length=SPEC['pulse_fwhm_s'],
        pulse_offset=SPEC['pulse_offset_s'], wavelength=SPEC['wavelength_um'])],
        monitors=[Monitor(component=c, center=(0, 0, SPEC['probe_z_um'])) for c in ('Ex', 'Ey')])


def rotated(indices, normal, theta, n1=None):
    c, s = math.cos(theta), math.sin(theta)
    rotation = torch.tensor([[c, -s, 0.], [s, c, 0.], [0., 0., 1.]], device='cuda', dtype=torch.float32)
    first = torch.tensor(indices[0]**2, device='cuda') if n1 is None else n1*n1
    diagonal = torch.stack((first, torch.tensor(indices[1]**2, device='cuda'), torch.tensor(normal, device='cuda')))
    value = rotation@torch.diag(diagonal)@rotation.T
    return (value+value.T)/2


def epsilon(project, dz, slab, n1=None):
    r = project.region
    theta = math.radians(SPEC['rotation_deg'])
    exterior = rotated(SPEC['exterior_indices'], SPEC['exterior_normal_permittivity'], theta)
    value = exterior.expand(r.shape+(3, 3)).contiguous()
    if not slab:
        return value, None
    count = round(SPEC['slab_thickness_um']/dz)
    begin = (r.shape[2]-count)//2
    end = begin+count
    index = torch.arange(r.shape[2], device='cuda')
    mask = ((index >= begin) & (index < end))[None, None, :, None, None]
    value = torch.where(mask, rotated(SPEC['slab_indices'], SPEC['slab_normal_permittivity'], theta, n1), exterior)
    nodes = r.mesh_nodes[2]
    return value.expand(r.shape+(3, 3)).contiguous(), dict(
        first_node=begin, last_node=end-1, effective_faces_um=[float(nodes[begin]-.5*dz), float(nodes[end-1]+.5*dz)],
        effective_thickness_um=count*dz)


def run(dz, gradient=False):
    project = make_project(dz)
    model = TensorDielectricSimulation(project, AdjointOptions(checkpoints=8), cpml_material='tensor')
    frequency = 299792458./(SPEC['wavelength_um']*1e-6)
    theta = math.radians(SPEC['rotation_deg'])
    axes = torch.tensor([[math.cos(theta), math.sin(theta)], [-math.sin(theta), math.cos(theta)]],
                        device='cuda', dtype=torch.complex64)
    records = []
    for name in ('reference', 'slab'):
        n1 = torch.tensor(SPEC['slab_indices'][0], device='cuda', requires_grad=gradient) if name == 'slab' else None
        material, geometry = epsilon(project, dz, name == 'slab', n1)
        faces = [bool(cpml_face_admissible(material[index], axis).all()) for axis, _, index in _cpml_faces(project.region)]
        assert all(faces) and len(faces) == 2
        torch.cuda.reset_peak_memory_stats()
        torch.cuda.synchronize()
        started = time.perf_counter()
        result = model(material)
        spectrum = result.spectrum([frequency])[0]
        projected = axes@spectrum  # amplitudes along the shared eigenpolarizations
        torch.cuda.synchronize()
        forward = time.perf_counter()-started
        signal = result.signals.detach()
        tail = signal[-max(1, math.ceil(len(signal)*.1)):]
        ratio = float(tail.square().mean().sqrt()/signal.abs().max().clamp_min(1e-30))
        record = dict(case=name, forward_seconds=forward, tail_rms_to_peak=ratio,
                      cuda_peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                      gpu_reservation_bytes=result.report['gpu_reservation_bytes'],
                      cpml_contract=result.report['cpml_contract'])
        if name == 'reference':
            reference = projected.detach()
            if bool((reference.abs() < 1e-25).any()):
                raise RuntimeError('Reference channel amplitude is insufficient.')
        else:
            transmission = projected/reference
            if gradient:
                objective = transmission[0].abs().square()
                torch.cuda.synchronize()
                started = time.perf_counter()
                derivative, = torch.autograd.grad(objective, n1)
                torch.cuda.synchronize()
                record.update(backward_seconds=time.perf_counter()-started, index_vjp_per_unit_index=float(derivative),
                              cuda_peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                              replayed_steps=result.report['replayed_steps'])
            observed = transmission.detach().cpu().numpy()
        records.append(record)
        del material, result, spectrum, projected, signal, tail
    expected, derivative = oracle()
    error = float(np.linalg.norm(observed-expected)/np.linalg.norm(expected))
    return dict(dz_um=dz, shape=list(project.region.shape), steps=project.region.steps,
                time_step_s=project.region.time_step, actual_duration_s=project.region.steps*project.region.time_step,
                geometry=geometry, channel_transmission=[[float(v.real), float(v.imag)] for v in observed],
                oracle_channel_transmission=[[float(v.real), float(v.imag)] for v in expected],
                channel_vector_relative_error=error, channel_power=[float(abs(v)**2) for v in observed],
                oracle_channel_power=[float(abs(v)**2) for v in expected],
                oracle_index_vjp_per_unit_index=derivative, records=records)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', default='docs/validation/tensor_cpml_birefringent_slab_3060.json')
    parser.add_argument('--gradient', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    names = ('benchmarks/tensor_cpml_birefringent_slab.py', 'torchfdtd/anisotropy.py', 'torchfdtd/differentiable.py',
             'torchfdtd/boundaries.py')
    source_before = {name: hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    if not torch.cuda.is_available():
        raise RuntimeError('This acceptance run requires the assigned local CUDA device.')
    # Index-matched channels transmit exactly one; a weak increase gives a negative
    # reference-normalized phase in the exp(-i omega t) spectrum convention.
    matched = dict(SPEC, slab_indices=list(SPEC['exterior_indices']))
    assert np.allclose(oracle(matched)[0], [1, 1], rtol=0, atol=1e-12)
    weak = dict(SPEC, slab_indices=[n+1e-6 for n in SPEC['exterior_indices']])
    assert all(np.angle(v) < 0 for v in oracle(weak)[0])
    torch.set_num_threads(1)
    start = time.perf_counter()
    rows = []
    print(json.dumps(dict(spec=SPEC, predeclared_criteria=CRITERIA)), flush=True)
    for i, dz in enumerate(SPEC['normal_meshes_um']):
        row = run(dz, gradient=args.gradient and i == 0)
        rows.append(row)
        print(json.dumps(row), flush=True)
    coarse, fine = rows
    checks = dict(
        coarse_accuracy=coarse['channel_vector_relative_error'] <= CRITERIA['coarse_channel_vector_relative_error_max'],
        fine_accuracy=fine['channel_vector_relative_error'] <= CRITERIA['fine_channel_vector_relative_error_max'],
        refinement=fine['channel_vector_relative_error'] <= CRITERIA['fine_to_coarse_error_ratio_max']*coarse['channel_vector_relative_error'],
        power=all(abs(a-b) <= CRITERIA['fine_channel_power_absolute_error_max'] for a, b in zip(fine['channel_power'], fine['oracle_channel_power'])),
        tail=all(r['tail_rms_to_peak'] <= CRITERIA['tail_rms_to_peak_max'] for row in rows for r in row['records']),
        memory=all(r['cuda_peak_allocated_bytes'] <= r['gpu_reservation_bytes'] for row in rows for r in row['records']))
    if args.gradient:
        value = coarse['records'][1]['index_vjp_per_unit_index']
        expected = coarse['oracle_index_vjp_per_unit_index']
        checks['index_vjp'] = abs(value-expected)/max(abs(expected), 1e-12) <= CRITERIA['index_vjp_relative_error_max']
    source_after = {name: hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    checks['source_integrity'] = source_before == source_after
    output = dict(schema='torchfdtd.tensor_cpml_birefringent_slab.v1',
                  dft_convention='DifferentiableResult.spectrum: exp(-i omega t); forward +z phase exp(-i k z)',
                  spec=SPEC, predeclared_criteria=CRITERIA, accepted=all(checks.values()), checks=checks, meshes=rows,
                  wall_seconds=time.perf_counter()-start, torch_version=torch.__version__, cuda_version=torch.version.cuda,
                  device=torch.cuda.get_device_name(),
                  device_uuid=str(getattr(torch.cuda.get_device_properties(0), 'uuid', 'unavailable')),
                  revision=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
                  source_sha256_before=source_before, source_sha256=source_after,
                  limitations=['Normal incidence with slab and exterior sharing principal axes; no cross-channel coupling',
                               'Homogeneous transverse plane; abrupt node-tensor slab faces',
                               'Two meshes do not establish asymptotic convergence',
                               'No isolated CPML reflection measurement; tail decay bounds finite-duration contamination only'])
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(output, indent=2)+'\n', newline='\n')
    temporary.replace(path)
    print(json.dumps(dict(accepted=output['accepted'], checks=checks, wall_seconds=output['wall_seconds'])), flush=True)
    if not output['accepted']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
