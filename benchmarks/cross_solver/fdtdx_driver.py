"""FDTDX side of the cross-solver comparison (fixtures A-D).

Run inside the GPU venv from the repository root:
    python benchmarks/cross_solver/fdtdx_driver.py --fixture slab
The adjoint fixture runs one gradient method per process:
    python benchmarks/cross_solver/fdtdx_driver.py --fixture adjoint --mode checkpointed
    python benchmarks/cross_solver/fdtdx_driver.py --fixture adjoint --mode reversible
No upstream FDTDX code is modified; the soft sheet and point kicks reuse
PointDipoleSource over a slice with a sampled temporal profile, and the shared
sampled permittivity arrays replace the placed-object materials.
"""
from __future__ import annotations

import argparse
import gc
import json
import math
import os
import sys
import time
from pathlib import Path

os.environ.setdefault('XLA_PYTHON_CLIENT_PREALLOCATE', 'false')
import numpy as np  # noqa: E402

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import common  # noqa: E402

import jax  # noqa: E402
import jax.numpy as jnp  # noqa: E402
import fdtdx  # noqa: E402
from fdtdx.constants import c as C_LIGHT, eps0 as EPS0, eta0 as ETA0  # noqa: E402

PACKAGES = ('fdtdx', 'jax', 'jaxlib', 'jax-cuda12-plugin', 'jax-cuda12-pjrt', 'equinox', 'optax', 'numpy', 'scipy')
SOLVER = 'fdtdx'


def device_memory():
    stats = jax.devices()[0].memory_stats() or {}
    return dict(peak_bytes_in_use=stats.get('peak_bytes_in_use'), bytes_in_use=stats.get('bytes_in_use'))


def base_record(fixture, spec):
    return dict(schema='torchfdtd-cross-solver-v1', solver=SOLVER, fixture=fixture, fixture_sha256=spec['_sha256'],
                date=time.strftime('%Y-%m-%d'),
                environment=common.environment(dict(packages=common.package_versions(PACKAGES), jax_devices=[str(d) for d in jax.devices()],
                                                    jax_x64=bool(jax.config.read('jax_enable_x64')),
                                                    xla_preallocate=os.environ.get('XLA_PYTHON_CLIENT_PREALLOCATE'))),
                driver_sha256=common.driver_hashes('fdtdx_driver.py', 'common.py'))


def torchfdtd_pml_sigma_end(layers, mesh_um):
    """SI sigma_max reproducing TorchFDTD's cubic profile maximum 40/(L+1) (Courant units)."""
    return 40.0 / ((layers + 1) * ETA0 * mesh_um * 1e-6)


def torchfdtd_pml_alpha(mesh_um):
    return 1e-8 * EPS0 * C_LIGHT / (mesh_um * 1e-6)


def make_config(spec, steps, courant_factor, dt_expected):
    mesh = spec['mesh_um'] * 1e-6
    config = fdtdx.SimulationConfig(time=steps * dt_expected, resolution=mesh, backend='gpu', dtype=jnp.float32,
                                    courant_factor=courant_factor)
    dt = config.time_step_duration
    assert math.isclose(dt, dt_expected, rel_tol=1e-12), (dt, dt_expected)
    assert config.time_steps_total == steps, (config.time_steps_total, steps)
    return config


def boundaries(volume, kinds, layers, mesh_um):
    """PML faces with TorchFDTD-matched cubic sigma, kappa=1 and negligible alpha; periodic elsewhere."""
    override = {}
    for axis, kind in zip('xyz', kinds):
        if kind != 'pml':
            override[f'min_{axis}'] = kind
            override[f'max_{axis}'] = kind
    cfg = fdtdx.BoundaryConfig.from_uniform_bound(thickness=layers, boundary_type='pml', override_types=override,
                                                  kappa_start=1.0, kappa_end=1.0, kappa_order=3.0,
                                                  alpha_start=torchfdtd_pml_alpha(mesh_um), alpha_end=torchfdtd_pml_alpha(mesh_um), alpha_order=1.0,
                                                  sigma_start=0.0, sigma_end=torchfdtd_pml_sigma_end(layers, mesh_um), sigma_order=3.0)
    objects, constraints = fdtdx.boundary_objects_from_config(cfg, volume)
    return list(objects.values()), list(constraints)


def kick_source(name, kick, dt, polarization, grid_shape, wavelength_um, courant_number):
    """Soft additive kick E[pol] += kick[n] after the E update of step n at inv_eps=1 cells.

    FDTDX's PointDipoleSource adds -C*inv_eps*amplitude*profile(n*dt), so the profile is -kick/C
    sampled with nearest interpolation.
    """
    profile = fdtdx.CustomTimeSignalProfile(signal=jnp.asarray(-kick / np.float32(courant_number), dtype=jnp.float32), time_step_duration=dt,
                                            start_time=0.0, interpolation='nearest')
    return fdtdx.PointDipoleSource(name=name, partial_grid_shape=grid_shape, polarization=polarization, source_type='electric',
                                   wave_character=fdtdx.WaveCharacter(wavelength=wavelength_um * 1e-6), temporal_profile=profile,
                                   amplitude=1.0)


def finalize(objects, config, constraints, key=None):
    key = jax.random.PRNGKey(0) if key is None else key
    objects, arrays, params, config, _ = fdtdx.place_objects(object_list=objects, config=config, constraints=constraints, key=key)
    arrays, objects, _ = fdtdx.apply_params(arrays, objects, params, key)
    return objects, arrays, config


def phasor_flux(state, components, dt, axis, area):
    """Signed Poynting flux through a plane detector from FDTDX phasors (exact_interpolation co-located E/H).

    Returns flux per frequency in the TorchFDTD normalization dt^2 * 0.5 * Re(E x H*) . n summed with cell areas.
    """
    ph = np.asarray(state['phasor'])[0].astype(np.complex128)  # (freq, comp, nx, ny, nz); float64 post-processing
    comp = {c: ph[:, i] for i, c in enumerate(components)}
    b, cc = 'xyz'[(axis + 1) % 3], 'xyz'[(axis + 2) % 3]
    density = .5 * np.real(comp['E' + b] * np.conj(comp['H' + cc]) - comp['E' + cc] * np.conj(comp['H' + b]))
    return density.reshape(density.shape[0], -1).sum(axis=1) * area * dt * dt, comp


# ----------------------------------------------------------------------------
# A. Analytic slab (3D grid with one periodic z cell; TMz fields Ez, Hx, Hy)
# ----------------------------------------------------------------------------
def build_slab(spec, with_slab):
    s = spec
    shape = tuple(s['shape'])
    courant_factor = s['courant_number'] * math.sqrt(3)
    config = make_config(s, s['steps'], courant_factor, s['dt_s'])
    dt = config.time_step_duration
    volume = fdtdx.SimulationVolume(name='volume', partial_grid_shape=shape, material=fdtdx.Material(permittivity=1.0))
    objects, constraints = [volume], []
    b_objects, b_constraints = boundaries(volume, ('pml', 'periodic', 'periodic'), s['pml_cells'], s['mesh_um'])
    objects += b_objects
    constraints += b_constraints
    kick = common.waveform(s['source']['waveform'], np.arange(1, s['steps'] + 1) * dt).astype(np.float32)
    source = kick_source('source', kick, dt, 2, (1, shape[1], shape[2]), s['source']['waveform']['wavelength_um'], config.courant_number)
    constraints += [source.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=(s['source']['x_index'], 0, 0))]
    objects.append(source)
    freqs = common.frequencies_hz(s['spectrum'])
    waves = [fdtdx.WaveCharacter(frequency=float(f)) for f in freqs]
    for label, index in (('reflection', s['monitors']['reflection_x_index']), ('transmission', s['monitors']['transmission_x_index'])):
        det = fdtdx.PhasorDetector(name=label, partial_grid_shape=(1, shape[1], shape[2]), wave_characters=waves,
                                   components=('Ey', 'Ez', 'Hy', 'Hz'), exact_interpolation=True, scaling_mode='pulse',
                                   dtype=jnp.complex64, plot=False)
        constraints += [det.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=(index, 0, 0))]
        objects.append(det)
    objects, arrays, config = finalize(objects, config, constraints)
    eps = np.ones(shape, dtype=np.float32)
    if with_slab:
        lo, hi = s['slab']['ez_cell_indices']
        eps[lo:hi] = s['slab']['index']**2
    arrays = arrays.aset('inv_permittivities', jnp.asarray(1 / eps)[None])
    return objects, arrays, config, kick, freqs, eps


def run_slab(spec):
    s = spec
    results = {}
    for with_slab in (True, False):
        objects, arrays, config, kick, freqs, eps = build_slab(s, with_slab)
        key = jax.random.PRNGKey(0)

        @jax.jit
        def solve(arrays):
            _, out = fdtdx.run_fdtd(arrays=arrays, objects=objects, config=config, key=key, show_progress=False)
            return out.detector_states, out.fields.E
        started = time.perf_counter()
        states, E = solve(arrays)
        jax.block_until_ready(states)
        seconds = time.perf_counter() - started
        results[with_slab] = dict(states=jax.device_get(states), seconds=seconds, E_peak=float(jnp.max(jnp.abs(E))))
    dt = s['dt_s']
    area = (s['mesh_um'] * 1e-6)**2
    comps = ('Ey', 'Ez', 'Hy', 'Hz')
    flux_sample_T, _ = phasor_flux(results[True]['states']['transmission'], comps, dt, 0, area)
    flux_air_T, _ = phasor_flux(results[False]['states']['transmission'], comps, dt, 0, area)
    _, comp_sample = phasor_flux(results[True]['states']['reflection'], comps, dt, 0, area)
    flux_air_R, comp_air = phasor_flux(results[False]['states']['reflection'], comps, dt, 0, area)
    diff = {c: comp_sample[c] - comp_air[c] for c in comps}
    density = .5 * np.real(diff['Ey'] * np.conj(diff['Hz']) - diff['Ez'] * np.conj(diff['Hy']))
    flux_reflected = density.reshape(density.shape[0], -1).sum(axis=1) * area * dt * dt
    T = flux_sample_T / abs(flux_air_T)
    R = -flux_reflected / abs(flux_air_R)
    wavelength = common.C0 / freqs * 1e6
    exact_T = common.fresnel_slab_transmission(wavelength, s['slab']['index'], s['slab']['thickness_um'])
    record = base_record('slab', s)
    record.update(
        method='3D grid (320,20,1) with periodic y and z, soft Ez sheet through PointDipoleSource over the sheet slice with a sampled '
               'profile (-kick/C), PhasorDetector planes with exact_interpolation (E/H co-located at the Ez node, H time-centred by '
               '(H_prev+H)/2), pulse scaling; T=flux/flux_air, R=-(flux of sample-minus-air phasors)/flux_air.',
        grid=dict(shape=s['shape'], mesh_um=s['mesh_um'], dt_s=dt, steps=s['steps'], courant_number=s['courant_number'],
                  courant_factor_passed=s['courant_number'] * math.sqrt(3), pml_cells=s['pml_cells'], precision='float32', backend='gpu'),
        pml=dict(formulation='FDTDX CPML, cubic sigma with sigma_end matched to TorchFDTD maximum 40/(L+1) Courant units, kappa=1, '
                             'alpha matched to 1e-8 Courant units; FDTDX grades on d/L with E and H half-cell offsets',
                 layers=s['pml_cells'], sigma_end_S_per_m=torchfdtd_pml_sigma_end(s['pml_cells'], s['mesh_um'])),
        slab_cell_indices=s['slab']['ez_cell_indices'],
        wavelength_um=wavelength.tolist(), T=T.tolist(), R=R.tolist(), analytic_T=exact_T.tolist(), analytic_R=(1 - exact_T).tolist(),
        max_T_absolute_error=float(np.max(abs(T - exact_T))), max_R_absolute_error=float(np.max(abs(R - (1 - exact_T)))),
        max_energy_residual=float(np.max(abs(R + T - 1))),
        timing=dict(sample_run_seconds_including_compile=results[True]['seconds'], reference_run_seconds_including_compile=results[False]['seconds']),
        sample_field_peak=results[True]['E_peak'])
    return record


# ----------------------------------------------------------------------------
# B. Mie sphere (closed TFSF box)
# ----------------------------------------------------------------------------
def build_sphere(spec, with_sphere):
    s = spec
    shape = tuple(s['shape'])
    config = make_config(s, s['steps'], s['courant_number'] * math.sqrt(3), s['dt_s'])
    dt = config.time_step_duration
    volume = fdtdx.SimulationVolume(name='volume', partial_grid_shape=shape, material=fdtdx.Material(permittivity=1.0))
    objects, constraints = [volume], []
    b_objects, b_constraints = boundaries(volume, ('pml', 'pml', 'pml'), s['pml_cells'], s['mesh_um'])
    objects += b_objects
    constraints += b_constraints
    wave = s['source']['waveform']
    signal = common.waveform(wave, np.arange(0, s['steps'] + 1) * dt).astype(np.float32)
    profile = fdtdx.CustomTimeSignalProfile(signal=jnp.asarray(signal), time_step_duration=dt, start_time=0.0, interpolation='linear')
    # fdtdx 0.6.2 (PyPI) has no closed TFSF box. Native scattering setup: a one-way
    # (single-plane TFSF) uniform plane source spanning the whole transverse domain,
    # placed at the first interior x cell (x=-1.2 um), total field downstream.
    plane = s['fdtdx_plane_source']
    source = fdtdx.UniformPlaneSource(name='plane', partial_grid_shape=(1, shape[1], shape[2]), direction=s['tfsf_box']['direction'],
                                      wave_character=fdtdx.WaveCharacter(wavelength=wave['wavelength_um'] * 1e-6), temporal_profile=profile,
                                      fixed_E_polarization_vector=(0, 0, 1), amplitude=wave['amplitude'])
    constraints += [source.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=(plane['x_index'], 0, 0))]
    objects.append(source)
    freqs = common.frequencies_hz(s['spectrum'])
    waves = [fdtdx.WaveCharacter(frequency=float(f)) for f in freqs]
    lo_i, hi_i = s['flux_box']['plane_node_indices']
    span = hi_i - lo_i
    for axis in range(3):
        for side, index in (('min', lo_i), ('max', hi_i)):
            grid_shape = tuple(1 if a == axis else span for a in range(3))
            coords = tuple(index if a == axis else lo_i for a in range(3))
            det = fdtdx.PhasorDetector(name='xyz'[axis] + '_' + side, partial_grid_shape=grid_shape, wave_characters=waves,
                                       exact_interpolation=True, scaling_mode='pulse', dtype=jnp.complex64, plot=False)
            constraints += [det.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=coords)]
            objects.append(det)
    inc = s['incident_plane']
    n_inc = round(inc['size_um'] / s['mesh_um'])
    start = shape[1] // 2 - n_inc // 2
    det = fdtdx.PhasorDetector(name='incident', partial_grid_shape=(1, n_inc, n_inc), wave_characters=waves, exact_interpolation=True,
                               scaling_mode='pulse', dtype=jnp.complex64, plot=False)
    constraints += [det.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=(inc['x_index'], start, start))]
    objects.append(det)
    objects, arrays, config = finalize(objects, config, constraints)
    source = [o for o in objects.sources if o.name == 'plane'][0]
    if with_sphere:
        eps = common.sphere_epsilon_yee(shape, s['mesh_um'], s['size_um'], s['sphere']['radius_um'], s['sphere']['index'])
        arrays = arrays.aset('inv_permittivities', jnp.asarray(np.moveaxis(1 / eps, -1, 0)))
    else:
        eps = np.ones((*shape, 3), dtype=np.float32)
        arrays = arrays.aset('inv_permittivities', jnp.asarray(np.moveaxis(1 / eps, -1, 0)))
    return objects, arrays, config, freqs, eps, source


def run_sphere(spec):
    s = spec
    results = {}
    for with_sphere in (True, False):
        objects, arrays, config, freqs, eps, source = build_sphere(s, with_sphere)
        key = jax.random.PRNGKey(0)

        @jax.jit
        def solve(arrays):
            _, out = fdtdx.run_fdtd(arrays=arrays, objects=objects, config=config, key=key, show_progress=False)
            return out.detector_states, out.fields.E
        started = time.perf_counter()
        states, E = solve(arrays)
        jax.block_until_ready(states)
        results[with_sphere] = dict(states=jax.device_get(states), seconds=time.perf_counter() - started, E_peak=float(jnp.max(jnp.abs(E))),
                                    source=dict(kind='UniformPlaneSource one-way plane', grid_slice=[list(v) for v in source.grid_slice_tuple]))
    dt = s['dt_s']
    area = (s['mesh_um'] * 1e-6)**2
    comps = ('Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz')
    inc_flux, _ = phasor_flux(results[False]['states']['incident'], comps, dt, 0, area)
    n_inc = round(s['incident_plane']['size_um'] / s['mesh_um'])
    intensity = abs(inc_flux) / (n_inc * n_inc * area)
    power = np.zeros_like(intensity)
    empty = np.zeros_like(intensity)
    for axis in range(3):
        for side, sign in (('min', -1), ('max', 1)):
            name = 'xyz'[axis] + '_' + side
            _, cs = phasor_flux(results[True]['states'][name], comps, dt, axis, area)
            flux_b, cb = phasor_flux(results[False]['states'][name], comps, dt, axis, area)
            d = {c: cs[c] - cb[c] for c in comps}
            b, cc = 'xyz'[(axis + 1) % 3], 'xyz'[(axis + 2) % 3]
            density = .5 * np.real(d['E' + b] * np.conj(d['H' + cc]) - d['E' + cc] * np.conj(d['H' + b]))
            power += sign * density.reshape(density.shape[0], -1).sum(axis=1) * area * dt * dt
            empty += abs(flux_b)
    wavelength = common.C0 / freqs * 1e6
    actual = power / intensity * 1e12
    analytic = common.mie_cross_section(wavelength, s['sphere']['radius_um'], s['sphere']['index'])
    eps = common.sphere_epsilon_yee(tuple(s['shape']), s['mesh_um'], s['size_um'], s['sphere']['radius_um'], s['sphere']['index'])
    record = base_record('sphere', s)
    record.update(
        method='No closed TFSF box in fdtdx 0.6.2: native one-way UniformPlaneSource (single-plane TFSF) spanning the full transverse '
               'domain including the PML, at the first interior x cell; total field downstream. Six PhasorDetector planes at +-1.1 um '
               'with exact_interpolation, empty-domain reference subtracted phasor-wise (removes the incident field), incident intensity '
               'from the empty-domain centre plane; shared per-component staircase permittivity array.',
        grid=dict(shape=s['shape'], mesh_um=s['mesh_um'], dt_s=dt, steps=s['steps'], duration_fs=s['steps'] * dt * 1e15,
                  courant_number=s['courant_number'], pml_cells=s['pml_cells'], precision='float32', backend='gpu'),
        pml=dict(formulation='FDTDX CPML, cubic sigma with sigma_end matched to TorchFDTD maximum, kappa=1, alpha matched',
                 layers=s['pml_cells'], sigma_end_S_per_m=torchfdtd_pml_sigma_end(s['pml_cells'], s['mesh_um'])),
        source=results[True]['source'], sphere_cells=int(np.count_nonzero(eps[..., 2] > 1)), shared_epsilon_sha256=common.sha256_array(eps),
        wavelength_um=wavelength.tolist(), scattering_cross_section_um2=actual.tolist(), mie_cross_section_um2=analytic.tolist(),
        relative_error=(actual / analytic - 1).tolist(), max_relative_error=float(np.max(abs(actual / analytic - 1))),
        max_empty_box_cross_section_um2=float(np.max(empty / intensity * 1e12)),
        empty_box_note='Sum of |flux| over the six faces in the empty run divided by the incident intensity. For this one-way plane '
                       'setup the faces lie in the total-field region, so this is the incident flux crossing the box (about twice the '
                       'face area), not a TFSF leakage figure.',
        timing=dict(sample_run_seconds_including_compile=results[True]['seconds'], reference_run_seconds_including_compile=results[False]['seconds']),
        sample_field_peak=results[True]['E_peak'])
    return record


# ----------------------------------------------------------------------------
# C. Forward throughput
# ----------------------------------------------------------------------------
def build_throughput(spec, case):
    s = spec
    shape = tuple(case['shape'])
    config = make_config(dict(mesh_um=case['mesh_um']), case['steps'], case['courant_number'] * math.sqrt(3), case['dt_s'])
    dt = config.time_step_duration
    volume = fdtdx.SimulationVolume(name='volume', partial_grid_shape=shape, material=fdtdx.Material(permittivity=1.0))
    objects, constraints = [volume], []
    b_objects, b_constraints = boundaries(volume, ('pml', 'pml', 'pml'), case['pml_cells'], case['mesh_um'])
    objects += b_objects
    constraints += b_constraints
    kick = common.waveform(s['source']['waveform'], np.arange(1, case['steps'] + 1) * dt).astype(np.float32)
    source = kick_source('source', kick, dt, 2, (1, 1, 1), s['source']['waveform']['wavelength_um'], config.courant_number)
    constraints += [source.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=tuple(case['source_index']))]
    objects.append(source)
    probe = fdtdx.FieldDetector(name='probe', partial_grid_shape=(1, 1, 1), components=('Ez',), exact_interpolation=False, plot=False)
    constraints += [probe.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=tuple(case['monitor_index']))]
    objects.append(probe)
    return objects, constraints, config, kick


def run_throughput(spec, sizes, repeats, idle_limit_mb, artifact_dir):
    artifact_dir.mkdir(parents=True, exist_ok=True)
    record = base_record('throughput', spec)
    record.update(method='run_fdtd inside jax.jit (donated arrays), float32, GPU. Full solve = place_objects + apply_params + shared permittivity '
                         'upload + jitted run + host copy of E, H and the probe trace, after one warm-up that includes XLA compilation '
                         '(recorded separately). Stepping = jitted call alone with block_until_ready.',
                  cases=[])
    for case in spec['cases']:
        if case['n'] not in sizes:
            continue
        shape = tuple(case['shape'])
        eps = common.sphere_epsilon_yee(shape, case['mesh_um'], spec['size_um'], case['structures'][0]['radius_um'], case['structures'][0]['index']) \
            if case['structures'] else np.ones((*shape, 3), dtype=np.float32)
        inv_eps_host = np.ascontiguousarray(np.moveaxis(1 / eps, -1, 0))
        key = jax.random.PRNGKey(0)
        row = dict(name=case['name'], shape=list(shape), cells=math.prod(shape), steps=case['steps'], dt_s=case['dt_s'], mesh_um=case['mesh_um'],
                   pml_cells=case['pml_cells'])
        trace_path = artifact_dir / f"fdtdx_throughput_{case['name']}_trace.npy"
        compiled = {}

        def sample(repeat):
            gc.collect()
            start = time.perf_counter()
            objects, constraints, config, kick = build_throughput(spec, case)
            objects, arrays, config = finalize(objects, config, constraints, key)
            arrays = arrays.aset('inv_permittivities', jnp.asarray(inv_eps_host))
            if not compiled:
                def solve_fn(arrays, objects=objects, config=config):
                    _, out = fdtdx.run_fdtd(arrays=arrays, objects=objects, config=config, key=key, show_progress=False)
                    return out.fields.E, out.fields.H, out.detector_states['probe']['fields']
                solve = jax.jit(solve_fn, donate_argnames=['arrays'])
                compile_start = time.perf_counter()
                compiled['fn'] = solve.lower(arrays).compile()
                row['compile_seconds'] = time.perf_counter() - compile_start
            jax.block_until_ready(arrays)
            setup = time.perf_counter() - start
            loop_start = time.perf_counter()
            E, H, trace = compiled['fn'](arrays)
            jax.block_until_ready(trace)
            loop = time.perf_counter() - loop_start
            transfer_start = time.perf_counter()
            E_host, trace_host = np.asarray(E), np.asarray(trace)
            H_host = np.asarray(H)
            transfer = time.perf_counter() - transfer_start
            wall = time.perf_counter() - start
            row_ = dict(wall_seconds=wall, setup_seconds=setup, loop_seconds=loop, transfer_seconds=transfer,
                        peak_bytes_in_use=device_memory()['peak_bytes_in_use'], field_peak=float(np.max(abs(E_host))),
                        magnetic_peak=float(np.max(abs(H_host))),
                        trace_sha256=common.sha256_array(trace_host.reshape(-1)), finite=bool(np.isfinite(E_host).all()))
            print(json.dumps(dict(case=case['name'], repeat=repeat, **row_)), flush=True)
            np.save(trace_path, trace_host.reshape(-1).astype(np.float64))
            return row_
        row.update(common.stable_runs(sample, repeats, idle_limit_mb))
        row['trace_artifact'] = str(trace_path)
        row['median_wall_seconds'] = common.median_of(row['runs'], 'wall_seconds')
        row['median_loop_seconds'] = common.median_of(row['runs'], 'loop_seconds')
        row['median_setup_seconds'] = common.median_of(row['runs'], 'setup_seconds')
        row['cell_steps_per_second_full'] = row['cells'] * row['steps'] / row['median_wall_seconds']
        row['cell_steps_per_second_stepping'] = row['cells'] * row['steps'] / row['median_loop_seconds']
        row['peak_bytes_in_use'] = max(s['peak_bytes_in_use'] for s in row['runs'])
        row['shared_epsilon_sha256'] = common.sha256_array(eps)
        record['cases'].append(row)
        common.write_record(f'{SOLVER}_throughput', record)
    return record


# ----------------------------------------------------------------------------
# D. Adjoint (full scalar epsilon gradient)
# ----------------------------------------------------------------------------
def build_adjoint(spec, mode, num_checkpoints=None):
    s = spec
    shape = tuple(s['shape'])
    config = make_config(s, s['steps'], s['courant_factor'], s['dt_s'])
    if mode == 'checkpointed':
        gradient = fdtdx.GradientConfig(method='checkpointed', num_checkpoints=num_checkpoints or s['fdtdx']['modes'][0]['num_checkpoints'])
    else:
        gradient = fdtdx.GradientConfig(method='reversible', recorder=fdtdx.Recorder(modules=[]))
    config = config.aset('gradient_config', gradient)
    dt = config.time_step_duration
    volume = fdtdx.SimulationVolume(name='volume', partial_grid_shape=shape, material=fdtdx.Material(permittivity=1.0))
    objects, constraints = [volume], []
    cfg = fdtdx.BoundaryConfig.from_uniform_bound(boundary_type='periodic')
    b_objects, b_constraints = fdtdx.boundary_objects_from_config(cfg, volume)
    objects += list(b_objects.values())
    constraints += list(b_constraints)
    kick = common.adjoint_kick(s)
    source = kick_source('source', kick, dt, 0, (1, 1, 1), s['source']['waveform']['wavelength_um'], config.courant_number)
    constraints += [source.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=tuple(s['source']['index']))]
    objects.append(source)
    for i, probe in enumerate(s['probes']):
        det = fdtdx.FieldDetector(name=f'probe{i}', partial_grid_shape=(1, 1, 1), components=(probe['component'],), exact_interpolation=False, plot=False)
        constraints += [det.set_grid_coordinates(axes=(0, 1, 2), sides=('-', '-', '-'), coordinates=tuple(probe['index']))]
        objects.append(det)
    objects, arrays, config = finalize(objects, config, constraints)
    return objects, arrays, config, kick


def run_adjoint(spec, mode, repeats, idle_limit_mb, artifact_dir, num_checkpoints=None):
    s = spec
    objects, arrays, config, kick = build_adjoint(s, mode, num_checkpoints)
    tag = f'{mode}{num_checkpoints}' if num_checkpoints else mode
    eps_host = common.adjoint_epsilon(s)
    key = jax.random.PRNGKey(0)
    weights = (1.0, 0.3)

    def loss_fn(eps, arrays):
        arrays = arrays.aset('inv_permittivities', (1.0 / eps)[None])
        _, out = fdtdx.run_fdtd(arrays=arrays, objects=objects, config=config, key=key, show_progress=False)
        p0 = out.detector_states['probe0']['fields'][:, 0, 0, 0, 0]
        p1 = out.detector_states['probe1']['fields'][:, 0, 0, 0, 0]
        loss = weights[0] * jnp.mean(p0**2) + weights[1] * jnp.mean(p1**2)
        return loss, jnp.stack([p0, p1], axis=1)

    grad_fn = jax.jit(jax.value_and_grad(loss_fn, has_aux=True))
    common.wait_for_idle_gpu(idle_limit_mb)
    eps = jnp.asarray(eps_host)
    compile_start = time.perf_counter()
    compiled = grad_fn.lower(eps, arrays).compile()
    compile_seconds = time.perf_counter() - compile_start
    outcome = {}

    def sample(repeat):
        gc.collect()
        start = time.perf_counter()
        eps = jnp.asarray(eps_host)
        (loss, signals), grad = compiled(eps, arrays)
        jax.block_until_ready(grad)
        wall = time.perf_counter() - start
        row = dict(wall_seconds=wall, peak_bytes_in_use=device_memory()['peak_bytes_in_use'], loss=float(loss))
        print(json.dumps(dict(mode=mode, repeat=repeat, **row)), flush=True)
        outcome.update(loss=loss, signals=signals, grad=grad)
        return row
    stable = common.stable_runs(sample, repeats, idle_limit_mb)
    runs, idle = stable['runs'], stable['gpu_idle']
    loss, signals, grad = outcome['loss'], outcome['signals'], outcome['grad']
    grad = np.asarray(grad)
    signals = np.asarray(signals)
    artifact_dir.mkdir(parents=True, exist_ok=True)
    np.save(artifact_dir / f'fdtdx_{tag}_adjoint_gradient.npy', grad)
    np.save(artifact_dir / f'fdtdx_{tag}_adjoint_signals.npy', signals)
    src = tuple(s['source']['index'])
    record = base_record(f'adjoint_{tag}', s)
    record.update(
        method=f'jax.value_and_grad of the two-probe loss with respect to the scalar-per-cell epsilon array (inv_permittivities=1/eps), '
               f'run_fdtd with GradientConfig(method={mode!r}); the whole forward+backward is one jitted executable compiled once '
               f'(compile time recorded separately). Time to gradient = host upload of epsilon + executable + block_until_ready.',
        grid=dict(shape=s['shape'], mesh_um=s['mesh_um'], dt_s=config.time_step_duration, steps=s['steps'], courant_number=s['courant_number'], precision='float32'),
        options=dict(method=mode, num_checkpoints=config.gradient_config.num_checkpoints,
                     recorder='Recorder(modules=[])' if mode == 'reversible' else None),
        shared=dict(epsilon_sha256=common.sha256_array(eps_host), kick_sha256=common.sha256_array(kick), loss_weights=list(weights)),
        gpu_idle=idle, compile_seconds=compile_seconds, runs=runs, timing_attempts=stable['attempts'], spread=stable['spread'],
        accepted_attempt=stable['accepted_attempt'],
        median_wall_seconds=common.median_of(runs, 'wall_seconds'), peak_bytes_in_use=max(r['peak_bytes_in_use'] for r in runs),
        loss=float(loss), gradient=dict(sha256=common.sha256_array(grad), shape=list(grad.shape), dtype=str(grad.dtype),
                                        l2_norm=float(np.linalg.norm(grad.astype(np.float64))), max_abs=float(np.max(abs(grad))),
                                        source_cell_value=float(grad[src]), nonzero=int(np.count_nonzero(grad)), finite=bool(np.isfinite(grad).all())),
        probe_history=dict(sha256=common.sha256_array(signals), shape=list(signals.shape), max_abs=float(np.max(abs(signals))),
                           first_nonzero_step=int(np.flatnonzero(signals.any(axis=1))[0]) if signals.any() else None),
        artifacts=dict(gradient=str(artifact_dir / f'fdtdx_{tag}_adjoint_gradient.npy'), signals=str(artifact_dir / f'fdtdx_{tag}_adjoint_signals.npy')))
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--fixture', required=True, choices=['slab', 'sphere', 'throughput', 'adjoint'])
    parser.add_argument('--mode', choices=['checkpointed', 'reversible'], default='checkpointed')
    parser.add_argument('--num-checkpoints', type=int, default=None, help='Override the fixture checkpoint count (supplementary run).')
    parser.add_argument('--sizes', nargs='+', type=int, default=[64, 96])
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--idle-limit-mb', type=float, default=1500)
    parser.add_argument('--artifacts', default=os.path.join(os.environ.get('TORCHFDTD_BENCH_ROOT', os.path.expanduser('~/torchfdtd-bench')), 'artifacts'))
    args = parser.parse_args()
    spec = common.load_fixture(args.fixture)
    context = common.own_context_mb(lambda: jax.block_until_ready(jnp.zeros(1)))
    args.idle_limit_mb += context['own_mb']
    print(json.dumps(dict(gpu_context=context, idle_limit_mb=args.idle_limit_mb)), flush=True)
    if args.fixture == 'slab':
        record, name = run_slab(spec), 'slab'
    elif args.fixture == 'sphere':
        record, name = run_sphere(spec), 'sphere'
    elif args.fixture == 'throughput':
        record, name = run_throughput(spec, args.sizes, args.repeats, args.idle_limit_mb, Path(args.artifacts)), 'throughput'
    else:
        record = run_adjoint(spec, args.mode, args.repeats, args.idle_limit_mb, Path(args.artifacts), args.num_checkpoints)
        name = record['fixture']
    record['gpu_context'] = context
    path = common.write_record(f'{SOLVER}_{name}', record)
    print('wrote', path)
    summary = {k: record[k] for k in record if k.startswith('max_') or k in ('median_wall_seconds', 'loss', 'compile_seconds')}
    print(json.dumps(summary, indent=2))


if __name__ == '__main__':
    main()
