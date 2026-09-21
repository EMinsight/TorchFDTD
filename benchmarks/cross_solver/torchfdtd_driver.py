"""TorchFDTD side of the cross-solver comparison (fixtures A-D).

Run inside the GPU venv from the repository root:
    python benchmarks/cross_solver/torchfdtd_driver.py --fixture slab
Each fixture writes docs/validation/cross_solver/torchfdtd_<fixture>.json.
"""
from __future__ import annotations

import argparse
import gc
import json
import math
import sys
import time
from pathlib import Path

import numpy as np
import torch

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parents[1]))
import common  # noqa: E402

from torchfdtd import (AdjointOptions, Boundaries, BoundaryFace, DifferentiableSimulation, FieldMonitor,  # noqa: E402
                       Material, Monitor, Project, Region, Simulation, Source, SpectrumSettings, Structure,
                       normalize_flux)
from torchfdtd.injection import source_terms  # noqa: E402
from torchfdtd.solver import hardware, index_at, source_slice  # noqa: E402
from torchfdtd.waveforms import source_time_signal  # noqa: E402

PACKAGES = ('torchfdtd', 'torch', 'cupy-cuda12x', 'fdtd', 'numpy', 'scipy')
SOLVER = 'torchfdtd'


def base_record(fixture, spec, extra_env=None):
    return dict(schema='torchfdtd-cross-solver-v1', solver=SOLVER, fixture=fixture, fixture_sha256=spec['_sha256'],
                date=time.strftime('%Y-%m-%d'), environment=common.environment(dict(packages=common.package_versions(PACKAGES),
                torch_hardware=hardware(), torch_cuda=torch.version.cuda, **(extra_env or {}))),
                driver_sha256=common.driver_hashes('torchfdtd_driver.py', 'common.py'))


# ----------------------------------------------------------------------------
# A. Analytic slab
# ----------------------------------------------------------------------------
def slab_project(spec, with_slab=True):
    s = spec
    region = Region(dimension='2d', size=tuple(s['size_um']), mesh=s['mesh_um'], steps=s['steps'], pml_cells=s['pml_cells'],
                    backend='cuda', precision='float32', material_sampling='yee', cuda_kernel='fused', snapshot_interval=s['steps'],
                    boundaries=Boundaries(y_min=BoundaryFace(kind='periodic'), y_max=BoundaryFace(kind='periodic')))
    wave = s['source']['waveform']
    spectrum = SpectrumSettings(sampling='frequency', wavelength_start=s['spectrum']['wavelength_start_um'],
                                wavelength_stop=s['spectrum']['wavelength_stop_um'], frequency_points=s['spectrum']['points'],
                                apodization='none')
    structures = [Structure(center=(s['slab']['center_x_um'], 0, 0), size=(s['slab']['thickness_um'], s['size_um'][1], s['size_um'][2]),
                            material='slab')] if with_slab else []
    return Project(name='cross-solver slab', region=region, materials=[Material(name='slab', index=s['slab']['index'])],
                   structures=structures,
                   sources=[Source(id='source', kind='plane', component='Ez', center=(s['source']['x_um'], 0, 0), size=(0, s['size_um'][1], 0),
                                   wavelength=wave['wavelength_um'], pulse_cycles=wave['pulse_cycles'], amplitude=wave['amplitude'])],
                   monitors=[FieldMonitor(id=label, name=label, center=(x, 0, 0), size=(0, s['size_um'][1], s['size_um'][2]), spectrum=spectrum)
                             for label, x in [('reflection', s['monitors']['reflection_x_um']), ('transmission', s['monitors']['transmission_x_um'])]])


def run_slab(spec):
    p = slab_project(spec)
    r = p.region
    assert list(r.shape) == spec['shape'], r.shape
    assert math.isclose(r.time_step, spec['dt_s'], rel_tol=1e-12), (r.time_step, spec['dt_s'])
    loc = source_slice(p.sources[0], r)
    assert loc[0] == slice(spec['source']['x_index'], spec['source']['x_index'] + 1), loc
    times = np.arange(1, r.steps + 1) * r.time_step
    native = source_time_signal(p.sources[0], times)
    shared = common.waveform(spec['source']['waveform'], times)
    assert np.allclose(native, shared, rtol=0, atol=1e-15), 'shared waveform differs from torchfdtd waveform'
    from torchfdtd.solver import voxelize
    eps, _ = voxelize(p)
    ez_cells = np.flatnonzero(eps[:, 0, 0, 2] > 1)
    assert ez_cells.tolist() == list(range(*spec['slab']['ez_cell_indices'])), ez_cells
    sample = Simulation(p).run()
    air = Simulation(slab_project(spec, with_slab=False)).run()
    reflect = normalize_flux(sample.field_monitor('reflection'), air.field_monitor('reflection'), subtract_incident=True)
    transmit = normalize_flux(sample.field_monitor('transmission'), air.field_monitor('transmission'))
    valid = reflect['valid'] & transmit['valid']
    assert valid.all()
    wavelength = common.C0 / transmit['frequency_hz'] * 1e6
    R, T = -reflect['ratio'], transmit['ratio']
    exact_T = common.fresnel_slab_transmission(wavelength, spec['slab']['index'], spec['slab']['thickness_um'])
    record = base_record('slab', spec)
    record.update(
        method='Soft Ez sheet, air reference run, plane monitors with trilinear Yee interpolation and half-step H phase, '
               'T=flux/flux_air, R=-(flux of sample-minus-air fields)/flux_air.',
        grid=dict(shape=list(r.shape), mesh_um=r.mesh, dt_s=r.time_step, steps=r.steps, courant_number=r.rectangular_courant,
                  pml_cells=spec['pml_cells'], precision='float32', backend=sample.summary['backend'], cuda_kernel='fused',
                  cuda_graph=sample.summary['cuda_graph']),
        pml=dict(formulation='stretched-coordinate CPML, cubic sigma profile sigma=40*rho^3/(L+1) in Courant units, kappa=1, alpha=1e-8',
                 layers=spec['pml_cells']),
        source_ez_cell_indices_inside_slab=ez_cells.tolist(),
        wavelength_um=wavelength.tolist(), T=T.tolist(), R=R.tolist(), analytic_T=exact_T.tolist(), analytic_R=(1 - exact_T).tolist(),
        max_T_absolute_error=float(np.max(abs(T - exact_T))), max_R_absolute_error=float(np.max(abs(R - (1 - exact_T)))),
        max_energy_residual=float(np.max(abs(R + T - 1))),
        timing=dict(sample_setup_seconds=sample.summary['setup_seconds'], sample_loop_seconds=sample.summary['seconds'],
                    reference_setup_seconds=air.summary['setup_seconds'], reference_loop_seconds=air.summary['seconds']),
        sample_field_peak=sample.summary['field_peak'])
    return record


# ----------------------------------------------------------------------------
# B. Mie sphere
# ----------------------------------------------------------------------------
def sphere_project(spec, with_sphere=True):
    s = spec
    spectrum = SpectrumSettings(sampling='wavelength', wavelength_start=s['spectrum']['wavelength_start_um'],
                                wavelength_stop=s['spectrum']['wavelength_stop_um'], frequency_points=s['spectrum']['points'], apodization='none')
    r = Region(dimension='3d', size=tuple(s['size_um']), mesh=s['mesh_um'], pml_cells=s['pml_cells'], backend='cuda', cuda_kernel='fused',
               precision='float32', material_sampling='yee', snapshot_interval=10000, steps=s['steps'])
    monitors = []
    half = s['flux_box']['plane_positions_um']
    for axis in range(3):
        for side, sign in (('min', -1), ('max', 1)):
            center = tuple(sign * half if a == axis else 0 for a in range(3))
            size = tuple(0 if a == axis else s['flux_box']['size_um'] for a in range(3))
            monitors.append(FieldMonitor(id='xyz'[axis] + '_' + side, name='xyz'[axis] + '_' + side, normal='xyz'[axis], center=center, size=size, spectrum=spectrum))
    inc = s['incident_plane']
    monitors.append(FieldMonitor(id='incident', name='incident', center=(inc['x_um'], 0, 0), size=(0, inc['size_um'], inc['size_um']), spectrum=spectrum))
    wave = s['source']['waveform']
    box = s['tfsf_box']
    return Project(name='cross-solver sphere', region=r, materials=[Material(name='sphere', index=s['sphere']['index'])],
                   structures=[Structure(kind='sphere', radius=s['sphere']['radius_um'], material='sphere')] if with_sphere else [],
                   sources=[Source(kind='tfsf', size=(box['size_um'],) * 3, component=box['component'], normal=box['normal'], direction=box['direction'],
                                   wavelength=wave['wavelength_um'], time_definition='standard', pulse_length=wave['pulse_length_s'],
                                   pulse_offset=wave['pulse_offset_s'], amplitude=wave['amplitude'])],
                   monitors=monitors)


def evaluate_sphere(sample, reference, spec):
    incident = reference.field_monitor('incident')
    intensity = abs(incident['flux']) / sum(incident['weights'])
    power = np.zeros_like(intensity)
    empty = np.zeros_like(intensity)
    for axis in 'xyz':
        for side, sign in (('min', -1), ('max', 1)):
            a = sample.field_monitor(axis + '_' + side)
            b = reference.field_monitor(axis + '_' + side)
            fields = a['fields'] - b['fields']
            flux = .5 * np.real(np.cross(fields[..., :3], fields[..., 3:].conj()))[..., 'xyz'.index(axis)] @ a['weights']
            power += sign * flux
            empty += abs(b['flux'])
    wavelength = common.C0 / incident['frequency_hz'] * 1e6
    actual = power / intensity * 1e12
    analytic = common.mie_cross_section(wavelength, spec['sphere']['radius_um'], spec['sphere']['index'])
    return wavelength, actual, analytic, empty / intensity * 1e12


def run_sphere(spec):
    p = sphere_project(spec)
    r = p.region
    assert list(r.shape) == spec['shape'] and r.steps == spec['steps'], (r.shape, r.steps)
    assert math.isclose(r.time_step, spec['dt_s'], rel_tol=1e-12)
    from torchfdtd.tfsf import tfsf_metadata
    meta = tfsf_metadata(p.sources[0], r)
    assert meta['lower_node_indices'][0] == spec['tfsf_box']['lower_node_index'] and meta['upper_node_indices'][0] == spec['tfsf_box']['upper_node_index'], meta
    from torchfdtd.solver import voxelize
    eps, _ = voxelize(p)
    shared = common.sphere_epsilon_yee(r.shape, r.mesh, r.actual_size, spec['sphere']['radius_um'], spec['sphere']['index'])
    assert np.array_equal(eps.astype(np.float32), shared), 'sphere staircase differs from the shared array'
    sample = Simulation(p).run()
    reference = Simulation(sphere_project(spec, with_sphere=False)).run()
    wavelength, actual, analytic, empty = evaluate_sphere(sample, reference, spec)
    record = base_record('sphere', spec)
    record.update(
        method='Closed TFSF box (live 1D Yee incident line, 96 auxiliary CPML cells), six scattered-field plane monitors at +-1.1 um, '
               'matched empty-box reference subtracted field-wise, incident intensity from the empty-box centre plane.',
        grid=dict(shape=list(r.shape), mesh_um=r.mesh, dt_s=r.time_step, steps=r.steps, duration_fs=r.steps * r.time_step * 1e15,
                  courant_number=r.rectangular_courant, pml_cells=spec['pml_cells'], precision='float32', cuda_kernel='fused'),
        pml=dict(formulation='stretched-coordinate CPML, cubic sigma profile, kappa=1, alpha=1e-8', layers=spec['pml_cells']),
        tfsf=meta, sphere_cells=int(np.count_nonzero(shared[..., 2] > 1)), shared_epsilon_sha256=common.sha256_array(shared),
        wavelength_um=wavelength.tolist(), scattering_cross_section_um2=actual.tolist(), mie_cross_section_um2=analytic.tolist(),
        relative_error=(actual / analytic - 1).tolist(), max_relative_error=float(np.max(abs(actual / analytic - 1))),
        max_empty_box_cross_section_um2=float(np.max(empty)),
        timing=dict(sample_setup_seconds=sample.summary['setup_seconds'], sample_loop_seconds=sample.summary['seconds'],
                    reference_setup_seconds=reference.summary['setup_seconds'], reference_loop_seconds=reference.summary['seconds']))
    return record


# ----------------------------------------------------------------------------
# C. Forward throughput
# ----------------------------------------------------------------------------
def run_throughput(spec, sizes, repeats, idle_limit_mb, artifact_dir):
    from benchmarks.open_source import scene
    artifact_dir.mkdir(parents=True, exist_ok=True)
    record = base_record('throughput', spec)
    record.update(method='benchmarks.open_source.scene projects, fused CUDA kernels, CUDA graph capture, float32. Full solve = Simulation(project).run() '
                         'wall time including voxelization, grid and graph construction and the final host copy of E, H and the point trace. '
                         'Stepping = summary["seconds"] (captured loop only). One warm-up solve per case, then the listed repetitions.',
                  cases=[])
    for case in spec['cases']:
        if case['n'] not in sizes:
            continue
        p = scene(case['kind'], case['n'], case['steps'])
        r = p.region
        assert list(r.shape) == case['shape'] and math.isclose(r.time_step, case['dt_s'], rel_tol=1e-12)
        assert r.pml_layers(0, 0) == case['pml_cells']
        assert index_at(p.sources[0].center, r, 'Ez') == tuple(case['source_index']), index_at(p.sources[0].center, r, 'Ez')
        assert index_at(p.monitors[0].center, r, 'Ez') == tuple(case['monitor_index'])
        row = dict(name=case['name'], shape=list(r.shape), cells=math.prod(r.shape), steps=r.steps, dt_s=r.time_step, mesh_um=r.mesh,
                   pml_cells=case['pml_cells'])
        trace_path = artifact_dir / f"torchfdtd_throughput_{case['name']}_trace.npy"

        def sample(repeat):
            gc.collect()
            torch.cuda.empty_cache()
            torch.cuda.reset_peak_memory_stats()
            start = time.perf_counter()
            result = Simulation(p).run()
            wall = time.perf_counter() - start
            row_ = dict(wall_seconds=wall, setup_seconds=result.summary['setup_seconds'], loop_seconds=result.summary['seconds'],
                        peak_allocated_bytes=torch.cuda.max_memory_allocated(), field_peak=result.summary['field_peak'],
                        trace_sha256=common.sha256_array(result.signals), cuda_graph=result.summary['cuda_graph'])
            print(json.dumps(dict(case=case['name'], repeat=repeat, **row_)), flush=True)
            np.save(trace_path, result.signals[:, 0].astype(np.float64))
            return row_
        row.update(common.stable_runs(sample, repeats, idle_limit_mb))
        row['trace_artifact'] = str(trace_path)
        row['median_wall_seconds'] = common.median_of(row['runs'], 'wall_seconds')
        row['median_loop_seconds'] = common.median_of(row['runs'], 'loop_seconds')
        row['median_setup_seconds'] = common.median_of(row['runs'], 'setup_seconds')
        row['cell_steps_per_second_full'] = row['cells'] * row['steps'] / row['median_wall_seconds']
        row['cell_steps_per_second_stepping'] = row['cells'] * row['steps'] / row['median_loop_seconds']
        row['peak_allocated_bytes'] = max(s['peak_allocated_bytes'] for s in row['runs'])
        record['cases'].append(row)
        common.write_record(f'{SOLVER}_throughput', record)
    return record


# ----------------------------------------------------------------------------
# D. Adjoint
# ----------------------------------------------------------------------------
def adjoint_project(spec):
    s = spec
    mesh, size = s['mesh_um'], s['size_um']
    periodic = Boundaries(**{f'{a}_{side}': BoundaryFace(kind='periodic') for a in 'xyz' for side in ('min', 'max')})
    region = Region(dimension='3d', size=tuple(size), mesh=mesh, steps=s['steps'], courant_factor=s['courant_factor'], backend='cuda',
                    precision='float32', material_sampling='yee', cuda_kernel='fused', boundaries=periodic, snapshot_interval=s['steps'])

    def ex_center(index):
        # Ex lives at x half-nodes and y,z integer nodes.
        return ((index[0] + .5) * mesh - size[0] / 2, index[1] * mesh - size[1] / 2, index[2] * mesh - size[2] / 2)
    wave = s['source']['waveform']
    src = Source(id='source', component='Ex', center=ex_center(s['source']['index']), wavelength=wave['wavelength_um'],
                 time_definition='standard', pulse_length=wave['pulse_length_s'], pulse_offset=wave['pulse_offset_s'], amplitude=wave['amplitude'])
    monitors = [Monitor(id=f'probe{i}', name=f'probe{i}', component=probe['component'], center=ex_center(probe['index']))
                for i, probe in enumerate(s['probes'])]
    return Project(name='cross-solver adjoint', region=region, sources=[src], monitors=monitors)


def run_adjoint(spec, repeats, idle_limit_mb, artifact_dir):
    p = adjoint_project(spec)
    r = p.region
    assert list(r.shape) == spec['shape'] and r.steps == spec['steps']
    assert math.isclose(r.time_step, spec['dt_s'], rel_tol=1e-12), (r.time_step, spec['dt_s'])
    terms = list(source_terms(p, p.sources[0]))
    assert len(terms) == 1 and terms[0][0] == 'Ex' and terms[0][1] == tuple(spec['source']['index']), terms[0][:2]
    kick = common.adjoint_kick(spec)
    assert np.array_equal(terms[0][2].astype(np.float32), kick), 'shared kick differs from torchfdtd source table'
    for probe, monitor in zip(spec['probes'], p.monitors):
        assert index_at(monitor.center, r, monitor.component) == tuple(probe['index'])
    eps_host = common.adjoint_epsilon(spec)
    options = AdjointOptions(checkpoints=spec['torchfdtd']['checkpoints'], storage='device')
    model = DifferentiableSimulation(p, options)
    weights = (1.0, 0.3)

    def solve():
        eps = torch.tensor(eps_host, device='cuda', requires_grad=True)
        result = model(eps)
        signals = result.signals
        loss = weights[0] * signals[:, 0].square().mean() + weights[1] * signals[:, 1].square().mean()
        loss.backward()
        torch.cuda.synchronize()
        return loss, eps.grad, signals.detach(), result.report

    outcome = {}

    def sample(repeat):
        gc.collect()
        torch.cuda.empty_cache()
        torch.cuda.reset_peak_memory_stats()
        start = time.perf_counter()
        loss, grad, signals, report = solve()
        wall = time.perf_counter() - start
        row = dict(wall_seconds=wall, forward_seconds=report['forward_seconds'], backward_seconds=report['backward_seconds'],
                   replayed_steps=report.get('replayed_steps'), peak_allocated_bytes=torch.cuda.max_memory_allocated(), loss=float(loss.detach()))
        print(json.dumps(dict(repeat=repeat, **row)), flush=True)
        outcome.update(loss=loss, grad=grad, signals=signals, report=report)
        return row
    stable = common.stable_runs(sample, repeats, idle_limit_mb)
    runs, idle = stable['runs'], stable['gpu_idle']
    loss, grad, signals, report = outcome['loss'], outcome['grad'], outcome['signals'], outcome['report']
    grad = grad.cpu().numpy()
    signals = signals.cpu().numpy()
    artifact_dir.mkdir(parents=True, exist_ok=True)
    np.save(artifact_dir / 'torchfdtd_adjoint_gradient.npy', grad)
    np.save(artifact_dir / 'torchfdtd_adjoint_signals.npy', signals)
    src = tuple(spec['source']['index'])
    record = base_record('adjoint', spec)
    record.update(
        method='DifferentiableSimulation, discrete adjoint of the fused CUDA Yee step, device checkpoints (binomial replay), '
               'loss.backward() on the full scalar-per-cell epsilon tensor. Time to gradient = wall time of tensor upload, forward, '
               'backward and synchronize after one warm-up call.',
        grid=dict(shape=list(r.shape), mesh_um=r.mesh, dt_s=r.time_step, steps=r.steps, courant_number=r.rectangular_courant, precision='float32'),
        options=dict(checkpoints=options.checkpoints, storage=options.storage, forward_backend=report['forward_backend'],
                     backward_backend=report['backward_backend']),
        shared=dict(epsilon_sha256=common.sha256_array(eps_host), kick_sha256=common.sha256_array(kick), loss_weights=list(weights)),
        gpu_idle=idle, runs=runs, timing_attempts=stable['attempts'], spread=stable['spread'], accepted_attempt=stable['accepted_attempt'],
        median_wall_seconds=common.median_of(runs, 'wall_seconds'), median_forward_seconds=common.median_of(runs, 'forward_seconds'),
        median_backward_seconds=common.median_of(runs, 'backward_seconds'), peak_allocated_bytes=max(s['peak_allocated_bytes'] for s in runs),
        loss=float(loss.detach()), gradient=dict(sha256=common.sha256_array(grad), shape=list(grad.shape), dtype=str(grad.dtype),
                                        l2_norm=float(np.linalg.norm(grad.astype(np.float64))), max_abs=float(np.max(abs(grad))),
                                        source_cell_value=float(grad[src]), nonzero=int(np.count_nonzero(grad)), finite=bool(np.isfinite(grad).all())),
        probe_history=dict(sha256=common.sha256_array(signals), shape=list(signals.shape), max_abs=float(np.max(abs(signals))),
                           first_nonzero_step=int(np.flatnonzero(signals.any(axis=1))[0]) if signals.any() else None),
        artifacts=dict(gradient=str(artifact_dir / 'torchfdtd_adjoint_gradient.npy'), signals=str(artifact_dir / 'torchfdtd_adjoint_signals.npy')))
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--fixture', required=True, choices=['slab', 'sphere', 'throughput', 'adjoint'])
    parser.add_argument('--sizes', nargs='+', type=int, default=[64, 96])
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--idle-limit-mb', type=float, default=1500)
    parser.add_argument('--artifacts', default='/root/torchfdtd-bench/artifacts')
    args = parser.parse_args()
    spec = common.load_fixture(args.fixture)
    torch.backends.cudnn.benchmark = False
    context = common.own_context_mb(lambda: torch.zeros(1, device='cuda'))
    args.idle_limit_mb += context['own_mb']
    print(json.dumps(dict(gpu_context=context, idle_limit_mb=args.idle_limit_mb)), flush=True)
    if args.fixture == 'slab':
        record = run_slab(spec)
    elif args.fixture == 'sphere':
        record = run_sphere(spec)
    elif args.fixture == 'throughput':
        record = run_throughput(spec, args.sizes, args.repeats, args.idle_limit_mb, Path(args.artifacts))
    else:
        record = run_adjoint(spec, args.repeats, args.idle_limit_mb, Path(args.artifacts))
    record['gpu_context'] = context
    path = common.write_record(f'{SOLVER}_{args.fixture}', record)
    print('wrote', path)
    summary = {k: record[k] for k in record if k.startswith('max_') or k in ('median_wall_seconds', 'loss')}
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
