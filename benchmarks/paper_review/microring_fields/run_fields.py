"""Ez frequency-domain field maps of the microring fixture (TorchFDTD, ring scene), for a paper figure.

Builds the ring scene exactly as examples/meep_comparison/microring/torchfdtd_microring.py does (its
build_project(g, True), which calls its sources(g); the fixture module is imported, not copied) and adds

- one y-normal line monitor per Ez node row of the kept window, recording the DFT of Ez at the two field
  wavelengths. 2D TorchFDTD accepts x- or y-normal frequency monitors only (the Project validator rejects a
  z-normal plane in 2D) and at most 512 monitors per project, hence line monitors and a 509-row window;
- one x-normal flux plane identical to the fixture's 'out' plane but sampled at the two field wavelengths.

The fixture's own 'in' and 'out' planes (401 wavelengths) are kept unchanged. One ring run on the GPU with the
fixture's fused CUDA Yee kernel and fused CUDA monitor kernel. Writes
docs/validation/meep_comparison/microring_fields_torchfdtd.npz and .json (data only, no figure).

    D:/TorchFDTD/.venv/Scripts/python.exe .local/paper_review/microring_fields/run_fields.py [--probe-steps N]
"""
from __future__ import annotations

import argparse
import hashlib
import importlib.metadata
import importlib.util
import json
import platform
import subprocess
import sys
import time
from pathlib import Path

import numpy as np

sys.dont_write_bytecode = True
REPO = Path(r'D:\TorchFDTD')
FIXTURE = REPO / 'examples' / 'meep_comparison' / 'microring'
VALIDATION = REPO / 'docs' / 'validation' / 'meep_comparison'
RECORD = VALIDATION / 'microring_torchfdtd.json'
OUT_NPZ = VALIDATION / 'microring_fields_torchfdtd.npz'
OUT_JSON = VALIDATION / 'microring_fields_torchfdtd.json'
C0 = 299792458.0
WAVELENGTH_ON_UM = 1.564481  # Lorentzian centre of minimum 5 in microring_comparison.json (extinction 3.03 dB)
WAVELENGTH_OFF_UM = 1.550    # between the 1537.5 and 1564.5 nm resonances; also sample 200 of the fixture grid
ROWS = (43, 552)             # Ez node rows j kept, half-open: 509 rows, one line monitor each
COLS = (43, 707)             # one sample between Ez node columns i and i+1 for each i in [43, 707): 664 samples

if str(REPO) not in sys.path:
    sys.path.insert(0, str(REPO))
_spec = importlib.util.spec_from_file_location('torchfdtd_microring', FIXTURE / 'torchfdtd_microring.py')
fixture = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fixture)  # the fixture asserts that torchfdtd is imported from REPO

import torch  # noqa: E402
import torchfdtd  # noqa: E402
from torchfdtd import FieldMonitor, Project, SpectrumSettings  # noqa: E402
from torchfdtd.field_monitors import interpolation_map  # noqa: E402
from torchfdtd.solver import field_axes, voxelize  # noqa: E402

TORCHFDTD_FILE = Path(torchfdtd.__file__).resolve()
assert TORCHFDTD_FILE.is_relative_to(REPO), TORCHFDTD_FILE


def git(*args):
    return subprocess.run(['git', '-C', str(REPO), *args], capture_output=True, text=True, check=True).stdout.strip()


def field_frequencies():
    f = [C0 / (WAVELENGTH_ON_UM * 1e-6), C0 / (WAVELENGTH_OFF_UM * 1e-6)]
    assert f[0] < f[1]  # custom samples must increase; index 0 = on resonance, 1 = off resonance
    return f


def build(g, base, row_precision):
    exact = SpectrumSettings(sampling='custom', custom_frequencies_hz=field_frequencies(), apodization='none')
    xn, yn = field_axes(base.region, 'Ez')[:2]
    lo, hi = float(xn[COLS[0]]), float(xn[COLS[1]])
    rows = [FieldMonitor(id=f'ez_row_{j}', name=f'ez_row_{j}', normal='y', center=((lo + hi) / 2, float(yn[j]), 0),
                         size=(hi - lo, 0, 1), spectrum=exact, record_fields=('Ez',), record_poynting=(), record_flux=False,
                         dft_precision=row_precision, spatial_interpolation='nearest')
            for j in range(*ROWS)]
    mon = g['monitors']
    out_exact = FieldMonitor(id='out_exact', name='out_exact', normal='x', center=(mon['out_x_um'], mon['center_y_um'], 0),
                             size=(0, mon['width_um'], 1), spectrum=exact, dft_precision='float64')
    payload = base.model_dump()
    payload['monitors'] = payload['monitors'] + [m.model_dump() for m in (out_exact, *rows)]
    return Project.model_validate(payload)


def check_row_weights(region, points, j):
    """Each row sample must be exactly 0.5*Ez[i, j] + 0.5*Ez[i+1, j] for its own i."""
    indices, weights = interpolation_map(region, 'Ez', points)
    ny, nz = region.shape[1:]
    live = np.abs(weights) > 1e-12
    assert np.all(live.sum(axis=0) == 2), 'expected two live interpolation terms per sample'
    flat = indices // 3
    ix, iy = flat // (ny * nz), (flat // nz) % ny
    assert np.all(iy[live] == j)
    assert np.allclose(weights[live], .5, rtol=0, atol=1e-9)
    lower = np.where(live, ix, 10**9).min(axis=0)
    upper = np.where(live, ix, -1).max(axis=0)
    assert np.array_equal(lower, np.arange(*COLS)) and np.array_equal(upper, np.arange(*COLS) + 1)


def main():
    parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    parser.add_argument('--probe-steps', type=int, default=0, help='run only this many steps, print the timing, write nothing')
    parser.add_argument('--row-dft-precision', choices=('float64', 'field'), default='float64',
                        help="DFT accumulator precision of the row monitors ('field' = complex64)")
    args = parser.parse_args()
    wall_start = time.perf_counter()
    geometry = FIXTURE / 'geometry.json'
    g = json.loads(geometry.read_text(encoding='utf-8'))
    record = json.loads(RECORD.read_text(encoding='utf-8'))
    torch.backends.cudnn.benchmark = False
    assert torch.cuda.is_available(), 'the fixture runs on the GPU'

    base = fixture.build_project(g, True)
    checks = fixture.check_grid(g, base)
    stairs = fixture.staircase(g, base)
    assert stairs['interior_ez_epsilon_sha256'] == record['staircase']['interior_ez_epsilon_sha256']
    p = build(g, base, args.row_dft_precision)
    assert len(p.monitors) <= 512 and [m.id for m in p.monitors[:2]] == ['in', 'out']
    assert p.monitors[0] == base.monitors[0] and p.monitors[1] == base.monitors[1]
    assert p.region == base.region and p.sources == base.sources and p.structures == base.structures
    print(json.dumps(dict(monitors=len(p.monitors), row_dft_precision=args.row_dft_precision)), flush=True)

    if args.probe_steps:
        payload = p.model_dump()
        payload['region']['steps'] = args.probe_steps
        _, timing = fixture.solve(Project.model_validate(payload))
        per_step = timing['stepping_seconds'] / args.probe_steps
        print(json.dumps(dict(probe=timing, seconds_per_step=per_step,
                              projected_stepping_seconds=per_step * g['steps'])), flush=True)
        return

    result, timing = fixture.solve(p)
    print(json.dumps(dict(solve=timing)), flush=True)
    planes = {m['id']: m for m in result.frequency_fields}
    region = p.region

    # Ez DFT maps on the kept window, indexed [iy, ix]
    xn, yn = (np.asarray(a, dtype=np.float64) for a in field_axes(region, 'Ez')[:2])
    x_nodes = xn[COLS[0]:COLS[1] + 1]
    x_mid = (x_nodes[:-1] + x_nodes[1:]) / 2
    y_rows = yn[ROWS[0]:ROWS[1]]
    frequency = np.asarray(planes[f'ez_row_{ROWS[0]}']['frequency_hz'], dtype=np.float64)
    assert np.array_equal(frequency, np.asarray(field_frequencies()))
    ez = np.empty((2, len(y_rows), len(x_mid)), dtype=np.complex128)
    for k, j in enumerate(range(*ROWS)):
        m = planes[f'ez_row_{j}']
        points = np.asarray(m['points_um'])
        assert tuple(m['shape']) == (len(x_mid), 1, 1) and m['components'] == ['Ez']
        assert np.array_equal(np.asarray(m['frequency_hz']), frequency)
        assert np.allclose(points[:, 0], x_mid, rtol=0, atol=1e-9) and np.all(points[:, 1] == yn[j])
        check_row_weights(region, points, j)
        ez[:, k, :] = m['fields'][:, :, 0]
    assert np.isfinite(ez).all()

    # Staircase permittivity at the Ez nodes (the array the fixture hashes), and its two-node mean at the samples
    eps, _ = voxelize(p)
    ez_eps = np.asarray(eps[..., 2][:, :, 0], dtype=np.float64)
    eps_nodes = ez_eps[COLS[0]:COLS[1] + 1, ROWS[0]:ROWS[1]].T
    eps_mid = .5 * (eps_nodes[:, :-1] + eps_nodes[:, 1:])
    assert set(np.round(np.unique(eps_nodes), 6)) <= {round(g['background_index']**2, 6), round(g['core_index']**2, 6)}

    # Transmission check against the committed record (straight-bus flux taken from the record)
    from scipy.interpolate import CubicSpline
    wl = np.asarray(record['wavelength_um'])
    out, fin, out_exact = planes['out'], planes['in'], planes['out_exact']
    assert np.allclose(C0 / np.asarray(out['frequency_hz']) * 1e6, wl, rtol=1e-12, atol=0)
    rec_ring_out, rec_straight_out = np.asarray(record['flux_out_ring']), np.asarray(record['flux_out_straight'])
    rec_ring_in, rec_T = np.asarray(record['flux_in_ring']), np.asarray(record['T'])
    T_grid = np.asarray(out['flux']) / rec_straight_out
    f_ascending = np.asarray(out['frequency_hz'])[::-1]
    straight_at = CubicSpline(f_ascending, rec_straight_out[::-1])(frequency)
    rec_T_at = CubicSpline(f_ascending, rec_T[::-1])(frequency)
    T_exact = np.asarray(out_exact['flux']) / straight_at
    i_off = int(np.argmin(abs(wl - WAVELENGTH_OFF_UM)))
    assert abs(wl[i_off] - WAVELENGTH_OFF_UM) < 1e-12
    i_on = sorted(np.argsort(abs(wl - WAVELENGTH_ON_UM))[:2].tolist())
    t_check = dict(
        normalisation='T = out-plane flux of this ring run / out-plane flux of the committed straight-bus run '
                      '(microring_torchfdtd.json flux_out_straight; cubic spline in frequency at the two field wavelengths). '
                      'The straight-bus scene was not rerun.',
        flux_out_ring_max_relative_difference_vs_record=float(np.max(abs(np.asarray(out['flux']) / rec_ring_out - 1))),
        flux_in_ring_max_relative_difference_vs_record=float(np.max(abs(np.asarray(fin['flux']) / rec_ring_in - 1))),
        T_grid_max_abs_difference_vs_record=float(np.max(abs(T_grid - rec_T))),
        off=dict(wavelength_um=WAVELENGTH_OFF_UM, T_this_run_exact_frequency=float(T_exact[1]),
                 T_this_run_grid_sample=float(T_grid[i_off]), T_record_grid_sample=float(rec_T[i_off]), grid_index=i_off,
                 out_exact_vs_grid_flux_relative_difference=float(np.asarray(out_exact['flux'])[1] / np.asarray(out['flux'])[i_off] - 1)),
        on=dict(wavelength_um=WAVELENGTH_ON_UM, T_this_run_exact_frequency=float(T_exact[0]),
                T_record_cubic_spline_at_wavelength=float(rec_T_at[0]),
                T_record_neighbour_samples={f'{wl[i] * 1e3:.3f} nm': float(rec_T[i]) for i in i_on},
                T_this_run_neighbour_samples={f'{wl[i] * 1e3:.3f} nm': float(T_grid[i]) for i in i_on}))
    print(json.dumps(dict(T_check=t_check)), flush=True)

    # Pulse spectrum with the monitors' DFT convention, sum_n s(t_n) exp(+2 pi i f t_n) dt, t_n = n dt, n = 1..steps
    dt, steps = region.time_step, region.steps
    times = np.arange(1, steps + 1) * dt
    pulse = fixture.waveform(g['source'], times)
    source_dft = np.array([np.sum(pulse * np.exp(2j * np.pi * f * times)) * dt for f in frequency])

    # Peak |Ez|^2 in the ring core versus the bus core
    X, Y = np.meshgrid(x_mid, y_rows)
    ring, bus = g['ring'], g['bus']
    radius = np.hypot(X - ring['center_um'][0], Y - ring['center_um'][1])
    ring_core = (radius >= ring['inner_radius_um']) & (radius <= ring['outer_radius_um'])
    bus_core = abs(Y - bus['center_y_um']) <= bus['width_um'] / 2
    bus_in = bus_core & (X >= -7.0) & (X <= -3.0)
    bus_out = bus_core & (X >= 3.0) & (X <= 7.5)
    intensity_summary = {}
    for tag, field in (('on', ez[0]), ('off', ez[1])):
        I = abs(field)**2
        intensity_summary[tag] = dict(
            ring_core_peak=float(I[ring_core].max()), bus_input_peak=float(I[bus_in].max()), bus_output_peak=float(I[bus_out].max()),
            ring_to_bus_input_peak_ratio=float(I[ring_core].max() / I[bus_in].max()),
            ring_to_bus_output_peak_ratio=float(I[ring_core].max() / I[bus_out].max()),
            ring_to_bus_input_mean_ratio=float(I[ring_core].mean() / I[bus_in].mean()),
            map_peak=float(I.max()), map_peak_at_um=[float(X.flat[I.argmax()]), float(Y.flat[I.argmax()])])
    print(json.dumps(dict(intensity=intensity_summary)), flush=True)

    arrays = dict(x_um=x_mid, y_um=y_rows, epsilon=eps_mid.astype(np.float32),
                  Ez_on=ez[0].astype(np.complex64), Ez_off=ez[1].astype(np.complex64),
                  wavelength_on_um=np.float64(WAVELENGTH_ON_UM), wavelength_off_um=np.float64(WAVELENGTH_OFF_UM),
                  T_on=np.float64(T_exact[0]), T_off=np.float64(T_exact[1]),
                  x_nodes_um=x_nodes, epsilon_nodes=eps_nodes.astype(np.float32),
                  source_dft_on=np.complex128(source_dft[0]), source_dft_off=np.complex128(source_dft[1]))
    np.savez_compressed(OUT_NPZ, **arrays)
    smi = fixture.nvidia_smi()
    sidecar = dict(
        schema='torchfdtd-microring-fields-v1', example='microring', solver='torchfdtd', date=time.strftime('%Y-%m-%d'),
        purpose='Ez DFT maps of the ring scene on and off resonance for a paper figure; data only, no figure.',
        data_file=OUT_NPZ.name, data_sha256=fixture.sha256_file(OUT_NPZ), data_bytes=OUT_NPZ.stat().st_size,
        arrays={k: dict(shape=list(np.shape(v)), dtype=str(np.asarray(v).dtype)) for k, v in arrays.items()},
        conventions=dict(
            indexing='2D arrays are indexed [iy, ix]: row k is y_um[k], column i is x_um[i]; both coordinate arrays increase. '
                     'imshow(abs(Ez_on)**2, origin="lower", extent=[x_um[0]-dx/2, x_um[-1]+dx/2, y_um[0]-dx/2, y_um[-1]+dx/2]) '
                     'draws it with +x to the right and +y up (source on the left, bus at the bottom, ring centre at the origin).',
            units='x_um, y_um, x_nodes_um in um (ring centre at 0, 0); wavelengths in um; epsilon relative permittivity (n^2); '
                  'Ez_on, Ez_off, source_dft_* in TorchFDTD reduced field units times seconds; T dimensionless.',
            sampling=('Ez_*[k, i] is the DFT of 0.5*(Ez[ix0, jy] + Ez[ix0 + 1, jy]) with ix0 = 43 + i, jy = 43 + k on the Yee Ez node '
                      'lattice x = ix*0.024 - 9.0, y = jy*0.024 - 7.512 (um): exact node rows in y, the midpoint of two neighbouring '
                      'nodes in x, so x_um lies half a cell (12 nm) to the right of the Ez nodes. The 0.5/0.5 weights and node '
                      'indices were verified for every sample from the solver interpolation map.'),
            epsilon=('epsilon = 0.5*(epsilon_nodes[:, :-1] + epsilon_nodes[:, 1:]), the mean of the two node permittivities that '
                     'enter each field sample (values 2.085136, 8.0089, or their mean 5.047018 on the x-boundary samples); '
                     'epsilon_nodes is the solver staircase at the Ez nodes x_nodes_um (665 columns) and y_um, the array the fixture '
                     'hashes (sha256 of the full interior recorded below matches the committed record).'),
            dft=('Ez(f) = sum_n Ez(t_n) exp(+2 pi i f t_n) dt, t_n = n dt, n = 1..steps, whole run, no apodization; '
                 'source_dft_* is the same transform of the shared source pulse (amplitude 1), so Ez_*/source_dft_* is the '
                 'response per unit source spectrum, which removes the pulse-spectrum difference between the two wavelengths.'),
            wavelengths=f'index 0 of the DFT = on resonance {WAVELENGTH_ON_UM} um (f = {frequency[0]:.6e} Hz), '
                        f'index 1 = off resonance {WAVELENGTH_OFF_UM} um (f = {frequency[1]:.6e} Hz)'),
        crop=dict(
            reason='TorchFDTD allows at most 512 monitors per project (2 fixture planes + 1 exact-wavelength out plane + 509 rows).',
            x=('full non-PML interior: samples between Ez nodes 43..707 (interior nodes [43, 708)), '
               f'x_um {x_mid[0]:.3f} .. {x_mid[-1]:.3f}; includes the source column (x = -7.512) and both flux planes (x = +-6.0)'),
            y=(f'Ez node rows [{ROWS[0]}, {ROWS[1]}) of the interior rows [43, 584): y_um {y_rows[0]:.3f} .. {y_rows[-1]:.3f}; '
               'the 32 top interior rows (y 5.736 .. 6.480, cladding only) are omitted. Margins: 0.926 um below the bus '
               'bottom edge (y = -5.554), 0.712 um above the ring top (y = 5.0).'),
            full_grid_cells=g['cells'][:2], pml_cells=g['pml_cells']),
        monitors=dict(
            rows=dict(count=ROWS[1] - ROWS[0], kind='FieldMonitor', normal='y', spatial_interpolation='nearest',
                      record_fields=['Ez'], record_poynting=[], record_flux=False, dft_precision=args.row_dft_precision,
                      spectrum='custom, 2 frequencies, apodization none', x_span_um=[float(x_nodes[0]), float(x_nodes[-1])],
                      note='2D TorchFDTD rejects z-normal frequency monitors, so the map is assembled from one y-normal line monitor '
                           'per Ez node row, all accumulated by the fused CUDA monitor kernel during the single run.'),
            out_exact='x-normal flux plane identical to the fixture out plane (x = 6.0 um, 83 rows), sampled at the two field wavelengths',
            fixture_planes='in and out planes exactly as built by build_project(g, True), 401 wavelengths 1.50..1.60 um'),
        run=dict(steps=region.steps, mesh_um=region.mesh, dt_s=dt, run_time_ps=steps * dt * 1e12, cells=g['cells'], pml_cells=g['pml_cells'],
                 courant_number=region.rectangular_courant, precision=region.precision, cuda_kernel=region.cuda_kernel,
                 cuda_monitor_kernel=region.cuda_monitor_kernel, cuda_graph=timing['cuda_graph'],
                 termination_reason=result.summary['termination_reason'], scene='ring (build_project(g, True)) only',
                 timing_s=dict(setup=timing['setup_seconds'], stepping=timing['stepping_seconds'], full_solve=timing['full_seconds'],
                               script_wall=time.perf_counter() - wall_start),
                 timing_note='shared workstation GPU, another job may have been running; timing not a benchmark'),
        grid_checks=dict(fixture_check_grid=checks, staircase=stairs,
                         staircase_hash_matches_record=stairs['interior_ez_epsilon_sha256'] == record['staircase']['interior_ez_epsilon_sha256']),
        T_check=t_check, intensity_summary=dict(
            definition='|Ez|^2 of the saved maps; ring core: 4.5 <= r <= 5.0 um; bus core: |y + 5.304| <= 0.25 um; '
                       'bus input section x in [-7.0, -3.0] um, bus output section x in [3.0, 7.5] um',
            **intensity_summary),
        source_dft_abs_ratio_on_over_off=float(abs(source_dft[0]) / abs(source_dft[1])),
        provenance=dict(
            git_commit=git('rev-parse', 'HEAD'),
            git_status_solver_and_fixture=git('status', '--porcelain', '--', 'torchfdtd', 'examples/meep_comparison/microring',
                                              'docs/validation/meep_comparison/microring_torchfdtd.json') or 'clean',
            geometry_sha256=fixture.sha256_file(geometry), driver_sha256=fixture.sha256_file(__file__),
            driver_path=str(Path(__file__).resolve()), fixture_script_sha256=fixture.sha256_file(FIXTURE / 'torchfdtd_microring.py'),
            record_sha256=fixture.sha256_file(RECORD), torchfdtd_file=str(TORCHFDTD_FILE),
            gpu=torch.cuda.get_device_name(0), nvidia_smi=smi, torch=torch.__version__, torch_cuda=torch.version.cuda,
            cupy=fixture.package_version('cupy-cuda12x') or fixture.package_version('cupy'),
            numpy=np.__version__, python=sys.version.split()[0], platform=platform.platform(),
            interpreter=sys.executable))
    OUT_JSON.write_bytes((json.dumps(sidecar, indent=2, allow_nan=False) + '\n').encode('utf-8'))
    print('wrote', OUT_NPZ, OUT_NPZ.stat().st_size, 'bytes')
    print('wrote', OUT_JSON)


if __name__ == '__main__':
    main()
