"""Meep side of the cross-solver comparison (fixtures A-C; Meep is excluded from D).

Run inside the micromamba "meep" environment from the repository root:
    mpirun -np 12 python benchmarks/cross_solver/meep_driver.py --fixture throughput
    python benchmarks/cross_solver/meep_driver.py --fixture slab
Only the MPI master writes the record. Meep is a double-precision CPU solver with
its own PML formulation (not CPML), so the record states every difference.
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

import numpy as np
import meep as mp

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import common  # noqa: E402

PACKAGES = ('meep', 'numpy', 'scipy', 'mpich', 'mpi4py')
SOLVER = 'meep'
RECORD_SUFFIX = ['']
PROBE = [True]
UM = 1e-6
TIME_UNIT = UM / common.C0  # one Meep time unit in seconds (a = 1 um)


def log(*args):
    if mp.am_master():
        print(*args, flush=True)


def conda_versions(names, listing=Path('/root/torchfdtd-bench/meep-list.txt')):
    """Versions of conda-forge packages (mpich, pymeep, ...) from the micromamba listing written by setup_env.sh."""
    out = {}
    try:
        for line in listing.read_text(encoding='utf-8').splitlines():
            parts = line.split()
            if len(parts) >= 3 and parts[0] in names:
                out[parts[0]] = parts[1] + ' ' + parts[2]
    except OSError:
        pass
    return out


def base_record(fixture, spec):
    conda = conda_versions(('mpich', 'pymeep', 'libmeep', 'meep', 'python', 'numpy', 'scipy'))
    return dict(schema='torchfdtd-cross-solver-v1', solver=SOLVER, fixture=fixture, fixture_sha256=spec['_sha256'],
                date=time.strftime('%Y-%m-%d'),
                environment=common.environment(dict(packages=common.package_versions(PACKAGES), meep_version=mp.__version__,
                                                    conda_packages=conda, mpich_version=conda.get('mpich'),
                                                    meep_mpi=bool(mp.with_mpi()), mpi_processes=int(mp.count_processors()),
                                                    omp_num_threads=os.environ.get('OMP_NUM_THREADS'), precision='float64 (Meep build)')),
                driver_sha256=common.driver_hashes('meep_driver.py', 'common.py'))


def custom_source(wave):
    """Meep CustomSource reproducing the shared waveform; t is in Meep units of a/c."""
    def src_func(t):
        return float(common.waveform(wave, np.array([t * TIME_UNIT]))[0])
    return src_func


def meep_frequencies(spectrum):
    return (common.frequencies_hz(spectrum) * TIME_UNIT).tolist()  # 1/um


# ----------------------------------------------------------------------------
# A. Analytic slab (2D TMz cell, periodic in y through k_point=0)
# ----------------------------------------------------------------------------
def slab_simulation(spec, with_slab):
    s = spec
    resolution = 1 / s['mesh_um']
    cell = mp.Vector3(s['size_um'][0], s['size_um'][1], 0)
    wave = s['source']['waveform']
    duration = s['steps'] * s['dt_s'] / TIME_UNIT
    src = mp.Source(mp.CustomSource(src_func=custom_source(wave), start_time=0, end_time=duration + 1, is_integrated=False),
                    component=mp.Ez, center=mp.Vector3(s['source']['x_um'], 0, 0), size=mp.Vector3(0, s['size_um'][1], 0))
    geometry = [mp.Block(size=mp.Vector3(s['slab']['thickness_um'], mp.inf, mp.inf), center=mp.Vector3(s['slab']['center_x_um'], 0, 0),
                         material=mp.Medium(index=s['slab']['index']))] if with_slab else []
    sim = mp.Simulation(cell_size=cell, resolution=resolution, boundary_layers=[mp.PML(s['pml_cells'] * s['mesh_um'], direction=mp.X)],
                        geometry=geometry, sources=[src], k_point=mp.Vector3(0, 0, 0), Courant=s['courant_number'],
                        eps_averaging=False, dimensions=2)
    freqs = meep_frequencies(s['spectrum'])
    refl = sim.add_flux(freqs, mp.FluxRegion(center=mp.Vector3(s['monitors']['reflection_x_um'], 0, 0), size=mp.Vector3(0, s['size_um'][1], 0)))
    tran = sim.add_flux(freqs, mp.FluxRegion(center=mp.Vector3(s['monitors']['transmission_x_um'], 0, 0), size=mp.Vector3(0, s['size_um'][1], 0)))
    return sim, refl, tran, duration


def run_slab(spec):
    s = spec
    mp.verbosity(0)
    sim, refl, tran, duration = slab_simulation(s, False)
    dt = sim.Courant / sim.resolution * TIME_UNIT
    assert math.isclose(dt, s['dt_s'], rel_tol=1e-12), (dt, s['dt_s'])
    started = time.perf_counter()
    sim.run(until=duration)
    air_seconds = time.perf_counter() - started
    steps_air = int(sim.fields.t)
    refl_data = sim.get_flux_data(refl)
    air_refl = np.asarray(mp.get_fluxes(refl))
    air_tran = np.asarray(mp.get_fluxes(tran))
    freqs_meep = np.asarray(mp.get_flux_freqs(tran))
    sim.reset_meep()
    sim, refl, tran, duration = slab_simulation(s, True)
    sim.load_minus_flux_data(refl, refl_data)
    started = time.perf_counter()
    sim.run(until=duration)
    slab_seconds = time.perf_counter() - started
    steps_slab = int(sim.fields.t)
    R = -np.asarray(mp.get_fluxes(refl)) / abs(air_refl)
    T = np.asarray(mp.get_fluxes(tran)) / abs(air_tran)
    eps = sim.get_epsilon()
    ez_line = np.asarray(eps)[:, 0] if np.ndim(eps) == 2 else np.asarray(eps)
    slab_cells = np.flatnonzero(ez_line > 1.5)
    wavelength = 1 / freqs_meep
    exact_T = common.fresnel_slab_transmission(wavelength, s['slab']['index'], s['slab']['thickness_um'])
    record = base_record('slab', s)
    record.update(
        method='2D TMz cell (Ez, Hx, Hy), y periodic through k_point=0, PML of the same thickness on x (Meep stretched-coordinate PML, '
               'quadratic default profile), Ez CustomSource current sheet with the shared waveform, eps_averaging=False, DFT flux '
               'monitors; air reference run, load_minus_flux_data on the reflection monitor: T=flux/flux_air, R=-flux_scattered/flux_air.',
        grid=dict(shape=[int(round(s['size_um'][0] / s['mesh_um'])), int(round(s['size_um'][1] / s['mesh_um'])), 1], epsilon_array_shape=list(np.shape(eps)),
                  mesh_um=s['mesh_um'], resolution_per_um=sim.resolution, dt_s=dt, courant_number=sim.Courant, requested_steps=s['steps'],
                  steps_run=dict(air=steps_air, slab=steps_slab), pml_cells=s['pml_cells'], precision='float64'),
        pml=dict(formulation='Meep PML (stretched-coordinate, quadratic profile by default, R_asymptotic=1e-15), same thickness 0.4 um',
                 thickness_um=s['pml_cells'] * s['mesh_um']),
        slab_cells_from_epsilon=slab_cells.tolist(),
        wavelength_um=wavelength.tolist(), T=T.tolist(), R=R.tolist(), analytic_T=exact_T.tolist(), analytic_R=(1 - exact_T).tolist(),
        max_T_absolute_error=float(np.max(abs(T - exact_T))), max_R_absolute_error=float(np.max(abs(R - (1 - exact_T)))),
        max_energy_residual=float(np.max(abs(R + T - 1))),
        frequency_match=dict(max_relative_difference=float(np.max(abs(freqs_meep / np.asarray(meep_frequencies(s['spectrum'])) - 1)))),
        timing=dict(reference_run_seconds=air_seconds, sample_run_seconds=slab_seconds, mpi_processes=int(mp.count_processors())))
    return record


# ----------------------------------------------------------------------------
# B. Mie sphere (native plane-wave current sheet plus flux box; no TFSF box)
# ----------------------------------------------------------------------------
def sphere_simulation(spec, with_sphere):
    s = spec
    resolution = 1 / s['mesh_um']
    cell = mp.Vector3(*s['size_um'])
    wave = s['source']['waveform']
    duration = s['steps'] * s['dt_s'] / TIME_UNIT
    plane = s['meep_plane_source']
    # The sheet extends into the PML, which requires is_integrated=True in Meep (the source
    # function is then the time integral of the current; ratios are unaffected).
    src = mp.Source(mp.CustomSource(src_func=custom_source(wave), start_time=0, end_time=duration + 1, is_integrated=True),
                    component=mp.Ez, center=mp.Vector3(plane['x_um'], 0, 0), size=mp.Vector3(0, s['size_um'][1], s['size_um'][2]))
    geometry = [mp.Sphere(radius=s['sphere']['radius_um'], center=mp.Vector3(*s['sphere']['center_um']),
                          material=mp.Medium(index=s['sphere']['index']))] if with_sphere else []
    sim = mp.Simulation(cell_size=cell, resolution=resolution, boundary_layers=[mp.PML(s['pml_cells'] * s['mesh_um'])], geometry=geometry,
                        sources=[src], Courant=s['courant_number'], eps_averaging=False, dimensions=3)
    freqs = meep_frequencies(s['spectrum'])
    half = s['flux_box']['plane_positions_um']
    size = s['flux_box']['size_um']
    boxes = {}
    for axis in range(3):
        for side, sign in (('min', -1), ('max', 1)):
            center = mp.Vector3(*[sign * half if a == axis else 0 for a in range(3)])
            extent = mp.Vector3(*[0 if a == axis else size for a in range(3)])
            boxes['xyz'[axis] + '_' + side] = sim.add_flux(freqs, mp.FluxRegion(center=center, size=extent))
    inc = s['incident_plane']
    incident = sim.add_flux(freqs, mp.FluxRegion(center=mp.Vector3(inc['x_um'], 0, 0), size=mp.Vector3(0, inc['size_um'], inc['size_um'])))
    return sim, boxes, incident, duration


def run_sphere(spec):
    s = spec
    mp.verbosity(0)
    sim, boxes, incident, duration = sphere_simulation(s, False)
    dt = sim.Courant / sim.resolution * TIME_UNIT
    assert math.isclose(dt, s['dt_s'], rel_tol=1e-12), (dt, s['dt_s'])
    started = time.perf_counter()
    sim.run(until=duration)
    empty_seconds = time.perf_counter() - started
    steps_empty = int(sim.fields.t)
    box_data = {name: sim.get_flux_data(flux) for name, flux in boxes.items()}
    empty_flux = {name: np.asarray(mp.get_fluxes(flux)) for name, flux in boxes.items()}
    inc_flux = np.asarray(mp.get_fluxes(incident))
    freqs_meep = np.asarray(mp.get_flux_freqs(incident))
    sim.reset_meep()
    sim, boxes, incident, duration = sphere_simulation(s, True)
    for name, flux in boxes.items():
        sim.load_minus_flux_data(flux, box_data[name])
    started = time.perf_counter()
    sim.run(until=duration)
    sphere_seconds = time.perf_counter() - started
    steps_sphere = int(sim.fields.t)
    scattered = {name: np.asarray(mp.get_fluxes(flux)) for name, flux in boxes.items()}
    power = np.zeros_like(inc_flux)
    for axis in 'xyz':
        power += scattered[axis + '_max'] - scattered[axis + '_min']
    intensity = abs(inc_flux) / s['incident_plane']['size_um']**2
    actual = power / intensity
    wavelength = 1 / freqs_meep
    analytic = common.mie_cross_section(wavelength, s['sphere']['radius_um'], s['sphere']['index'])
    eps = np.asarray(sim.get_epsilon())
    record = base_record('sphere', s)
    record.update(
        method='No TFSF box: Meep Mie-tutorial setup. Ez current sheet spanning the full cell (including the PML, hence '
               'is_integrated=True) at x=-1.2 um with the shared waveform as the integrated current, six DFT flux planes at +-1.1 um, empty-cell run subtracted with load_minus_flux_data, incident '
               'intensity from the empty-cell centre plane (0.4 x 0.4 um). Sphere geometry rasterised by Meep at each Yee component '
               'position with eps_averaging=False.',
        grid=dict(shape=[int(round(v / s['mesh_um'])) for v in s['size_um']], epsilon_array_shape=list(eps.shape), mesh_um=s['mesh_um'],
                  resolution_per_um=sim.resolution, dt_s=dt, courant_number=sim.Courant, requested_steps=s['steps'],
                  steps_run=dict(empty=steps_empty, sphere=steps_sphere), duration_fs=s['steps'] * dt * 1e15, pml_cells=s['pml_cells'], precision='float64'),
        pml=dict(formulation='Meep PML (stretched-coordinate, quadratic profile by default, R_asymptotic=1e-15), same thickness 0.4 um',
                 thickness_um=s['pml_cells'] * s['mesh_um']),
        sphere_cells_from_epsilon=int(np.count_nonzero(eps > 1.5)),
        wavelength_um=wavelength.tolist(), scattering_cross_section_um2=actual.tolist(), mie_cross_section_um2=analytic.tolist(),
        relative_error=(actual / analytic - 1).tolist(), max_relative_error=float(np.max(abs(actual / analytic - 1))),
        max_empty_box_cross_section_um2=float(np.max(sum(abs(v) for v in empty_flux.values()) / intensity)),
        empty_box_note='Sum of |flux| over the six faces in the empty run divided by the incident intensity: the incident flux crossing '
                       'the box in this total-field setup, not a TFSF leakage figure.',
        frequency_match=dict(max_relative_difference=float(np.max(abs(freqs_meep / np.asarray(meep_frequencies(s['spectrum'])) - 1)))),
        timing=dict(reference_run_seconds=empty_seconds, sample_run_seconds=sphere_seconds, mpi_processes=int(mp.count_processors())))
    return record


# ----------------------------------------------------------------------------
# C. Forward throughput
# ----------------------------------------------------------------------------
def throughput_simulation(spec, case):
    s = spec
    resolution = case['n'] / s['size_um'][0]
    cell = mp.Vector3(*s['size_um'])
    wave = s['source']['waveform']
    duration = case['steps'] * case['dt_s'] / TIME_UNIT
    src = mp.Source(mp.CustomSource(src_func=custom_source(wave), start_time=0, end_time=duration + 1, is_integrated=False),
                    component=mp.Ez, center=mp.Vector3(*s['source']['center_um']))
    geometry = [mp.Sphere(radius=st['radius_um'], center=mp.Vector3(*st['center_um']), material=mp.Medium(index=st['index']))
                for st in case['structures']]
    sim = mp.Simulation(cell_size=cell, resolution=resolution, boundary_layers=[mp.PML(case['pml_cells'] * case['mesh_um'])], geometry=geometry,
                        sources=[src], Courant=case['courant_number'], eps_averaging=False, dimensions=3)
    return sim, duration


TOKEN_DIR = Path('/root/torchfdtd-bench/tmp') / f'sync_{os.getppid()}'


def master_broadcast(tag, value=None):
    """Share one string from the master rank through a token file while the other ranks sleep.

    An MPI barrier busy-waits on every other rank and registers as host load, so decisions
    that depend on host-side measurements are published through the file system first; the
    ranks only meet at a barrier once everyone holds the same value.
    """
    token = TOKEN_DIR / f'{tag}.token'
    if mp.am_master():
        TOKEN_DIR.mkdir(parents=True, exist_ok=True)
        token.write_text(str(value), encoding='utf-8')
    else:
        while not token.exists():
            time.sleep(1.0)
        value = token.read_text(encoding='utf-8')
    mp.all_wait()
    return value


def cpu_idle_check(limit_percent, tag):
    """Master rank waits for a quiet host CPU; the other ranks sleep until it publishes the go token."""
    result = common.wait_for_idle_cpu(limit_percent, samples=2, timeout=1800, log=log) if mp.am_master() else None
    master_broadcast(f'{tag}_go', 'go')
    return result


def stable_cpu_runs(sample, repeats, cpu_idle_limit, tag, *, max_spread=1.25, attempts=4):
    """Meep analogue of common.stable_runs: a light host-CPU gate, then repeat the block while the wall times spread too much.

    The Windows host shares its cores with other processes that cannot be seen from WSL, so the
    host load is sampled (master rank) before and after every block and stored with the samples.
    """
    history = []
    for attempt in range(attempts):
        gate = cpu_idle_check(cpu_idle_limit, f'{tag}_{attempt}')
        host_before = common.host_cpu_load_percent() if mp.am_master() else None
        runs = []
        for repeat in range(-1, repeats):
            row = sample(repeat)
            if repeat >= 0:
                runs.append(row)
        host_after = common.host_cpu_load_percent() if mp.am_master() else None
        spread = max(r['wall_seconds'] for r in runs) / max(min(r['wall_seconds'] for r in runs), 1e-12)
        # Every rank times its own barriers, so the acceptance decision is taken on the master
        # and published; otherwise ranks could diverge and deadlock at the next barrier.
        accepted = master_broadcast(f'{tag}_{attempt}_decision', 'accept' if spread <= max_spread else 'retry') == 'accept'
        history.append(dict(attempt=attempt, cpu_idle=gate, host_cpu_percent_before=host_before, host_cpu_percent_after=host_after,
                            runs=runs, spread=spread, accepted=accepted))
        log(json.dumps(dict(attempt=attempt, spread=spread, accepted=accepted, host_cpu_percent_before=host_before,
                            host_cpu_percent_after=host_after)))
        if accepted:
            break
    accepted = next((h for h in history if h['accepted']), history[-1])
    return dict(runs=accepted['runs'], cpu_idle=accepted['cpu_idle'], host_cpu_percent_before=accepted['host_cpu_percent_before'],
                host_cpu_percent_after=accepted['host_cpu_percent_after'], spread=accepted['spread'], accepted_attempt=accepted['attempt'],
                attempts=history, max_spread=max_spread)


def run_throughput(spec, sizes, repeats, artifact_dir, cpu_idle_limit):
    s = spec
    mp.verbosity(0)
    if mp.am_master():
        artifact_dir.mkdir(parents=True, exist_ok=True)
    record = base_record('throughput', s)
    record.update(method='mp.Simulation with the shared point Ez CustomSource, sphere geometry rasterised by Meep (eps_averaging=False), '
                         'same PML thickness (Meep PML formulation), all MPI ranks on the CPU. Full solve = init_sim + run(until=steps*dt) with '
                         'a per-step get_field_point probe + get_array of all six field components. Stepping = run() alone. '
                         'One warm-up solve per case, then the listed repetitions; a block starts after the Windows host CPU load fell below the '
                         'recorded limit and is repeated while its wall times spread by more than the recorded factor. Host CPU load is sampled '
                         'before and after every block. Wall time measured on the master rank after MPI barriers.',
                  cases=[])
    probe = mp.Vector3(*s['monitor']['center_um'])
    for case in s['cases']:
        if case['n'] not in sizes:
            continue
        row = dict(name=case['name'], shape=list(case['shape']), cells=math.prod(case['shape']), steps=case['steps'], dt_s=case['dt_s'],
                   mesh_um=case['mesh_um'], pml_cells=case['pml_cells'], load_average_before=list(os.getloadavg()))
        trace_path = artifact_dir / f"meep_throughput_{case['name']}_trace.npy"

        def sample(repeat):
            gc.collect()
            mp.all_wait()
            start = time.perf_counter()
            sim, duration = throughput_simulation(s, case)
            dt = sim.Courant / sim.resolution * TIME_UNIT
            assert math.isclose(dt, case['dt_s'], rel_tol=1e-12), (dt, case['dt_s'])
            sim.init_sim()
            mp.all_wait()
            setup = time.perf_counter() - start
            trace = []

            def record_probe(sim):
                trace.append(float(np.real(sim.get_field_point(mp.Ez, probe))))
            loop_start = time.perf_counter()
            if PROBE[0]:
                sim.run(record_probe, until=duration)
            else:
                sim.run(until=duration)
            mp.all_wait()
            loop = time.perf_counter() - loop_start
            transfer_start = time.perf_counter()
            fields = [sim.get_array(center=mp.Vector3(), size=sim.cell_size, component=c) for c in (mp.Ex, mp.Ey, mp.Ez, mp.Hx, mp.Hy, mp.Hz)]
            mp.all_wait()
            transfer = time.perf_counter() - transfer_start
            wall = time.perf_counter() - start
            steps_run = int(sim.fields.t)
            row_ = dict(wall_seconds=wall, setup_seconds=setup, loop_seconds=loop, transfer_seconds=transfer, steps_run=steps_run,
                        probe_samples=len(trace), per_step_probe=PROBE[0], field_peak=float(max(np.max(abs(np.real(np.asarray(f)))) for f in fields)),
                        array_shape=list(np.shape(fields[2])), trace_sha256=common.sha256_array(np.asarray(trace, dtype=np.float64)) if trace else None,
                        finite=bool(all(np.isfinite(np.real(np.asarray(f))).all() for f in fields)))
            log(json.dumps(dict(case=case['name'], repeat=repeat, **row_)))
            if trace and mp.am_master():
                np.save(trace_path, np.asarray(trace, dtype=np.float64))
            sim.reset_meep()
            return row_
        row.update(stable_cpu_runs(sample, repeats, cpu_idle_limit, case['name']))
        if PROBE[0]:
            row['trace_artifact'] = str(trace_path)
        row['median_wall_seconds'] = common.median_of(row['runs'], 'wall_seconds')
        row['median_loop_seconds'] = common.median_of(row['runs'], 'loop_seconds')
        row['median_setup_seconds'] = common.median_of(row['runs'], 'setup_seconds')
        # Meep's run(until=...) may take one step more than steps*dt/dt; the rate uses the steps it ran.
        row['steps_run'] = int(common.median_of(row['runs'], 'steps_run'))
        row['cell_steps_per_second_full'] = row['cells'] * row['steps_run'] / row['median_wall_seconds']
        row['cell_steps_per_second_stepping'] = row['cells'] * row['steps_run'] / row['median_loop_seconds']
        row['load_average_after'] = list(os.getloadavg())
        record['cases'].append(row)
        if mp.am_master():
            common.write_record(f'{SOLVER}_throughput{RECORD_SUFFIX[0]}', record)
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--fixture', required=True, choices=['slab', 'sphere', 'throughput'])
    parser.add_argument('--sizes', nargs='+', type=int, default=[64, 96])
    parser.add_argument('--repeats', type=int, default=3)
    parser.add_argument('--record-suffix', default='', help='Suffix for the record name (used by the MPI rank sweep).')
    parser.add_argument('--no-probe', action='store_true', help='Throughput without the per-step get_field_point probe.')
    parser.add_argument('--artifacts', default='/root/torchfdtd-bench/artifacts')
    parser.add_argument('--cpu-idle-limit', type=float, default=50.0, help='Host CPU load (percent) that must not be exceeded before a timing block.')
    args = parser.parse_args()
    spec = common.load_fixture(args.fixture)
    RECORD_SUFFIX[0] = args.record_suffix
    PROBE[0] = not args.no_probe
    if args.fixture == 'slab':
        record = run_slab(spec)
    elif args.fixture == 'sphere':
        record = run_sphere(spec)
    else:
        record = run_throughput(spec, args.sizes, args.repeats, Path(args.artifacts), args.cpu_idle_limit)
    if mp.am_master():
        path = common.write_record(f'{SOLVER}_{args.fixture}{args.record_suffix}', record)
        print('wrote', path, flush=True)
        summary = {k: record[k] for k in record if k.startswith('max_')}
        print(json.dumps(summary, indent=2), flush=True)


if __name__ == '__main__':
    main()
