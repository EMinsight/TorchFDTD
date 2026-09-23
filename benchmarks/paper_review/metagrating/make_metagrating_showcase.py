"""Data (no figures) for the metagrating inverse-design showcase of the software paper.

Reads the recorded runs docs/validation/g6/metagrating-seed{1,2,3}.json, picks the
seed with the best final objective (lowest loss = highest +1 efficiency), and
computes with the workflow's own forward classes in examples/design_metagrating.py:

1. the initial density of build_problem(seed) (logits -> filter -> projection at
   beta 4, before any step) and the final binary density stored in the record;
2. broadband order efficiencies (T+1, T0, T-1) at 41 wavelengths 0.90-1.10 um
   with GratingForward at the design mesh (50 nm, 800 steps) and at the
   FineEvaluator mesh (25 nm, 1600 steps), the module frequency list replaced by
   the 41 frequencies for both the reference and the design runs; total T and R
   from a copy of the same project with one extra reflection plane;
3. frequency-domain x-z field maps at 1.0 um (FineEvaluator mesh, z extended);
4. the objective histories of all three seeds.

Writes docs/validation/paper_review/metagrating_showcase.json and
docs/validation/paper_review/metagrating_fields.npz. No optimization is run.
"""
import hashlib
import json
import math
import platform
import subprocess
import sys
import time
from contextlib import contextmanager
from pathlib import Path
from types import SimpleNamespace

import numpy as np
import torch

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
sys.path.insert(0, str(ROOT))
import examples.design_metagrating as dm  # noqa: E402
from torchfdtd.adjoint_planes import COMPONENTS  # noqa: E402
from torchfdtd.field_monitors import interpolation_map  # noqa: E402
from torchfdtd.models import Project  # noqa: E402
from torchfdtd.waveforms import pulse_parameters, source_time_signal  # noqa: E402

RECORDS = {s: ROOT/'docs'/'validation'/'g6'/f'metagrating-seed{s}.json' for s in (1, 2, 3)}
EXAMPLE = ROOT/'examples'/'design_metagrating.py'
OUT_DIR = ROOT/'docs'/'validation'/'paper_review'
OUT_JSON = OUT_DIR/'metagrating_showcase.json'
OUT_NPZ = OUT_DIR/'metagrating_fields.npz'

WAVELENGTHS_UM = [float(np.round(.9+.005*i, 6)) for i in range(41)]
FREQUENCIES_HZ = [dm.C0/(w*1e-6) for w in WAVELENGTHS_UM]
I_DESIGN, I_HOLDOUT = WAVELENGTHS_UM.index(1.), WAVELENGTHS_UM.index(.95)
ORDER_KEYS = ('T_plus1', 'T_zero', 'T_minus1')  # columns of dm.ORDERS = [[1,0],[0,0],[-1,0]]

COARSE = dict(mesh_um=.05, steps=800)
FINE = dict(mesh_um=.025, steps=1600)
REFLECTION_Z_UM = -.8          # between the source (-1.2) and the layer bottom (-0.25)
FIELD_HALF_Z_UM = 2.95         # field-map domain: +-2.95 um incl. 0.4 um PML -> interior +-2.55 um
FIELD_SOURCE_Z_UM = -2.45      # below the saved window
WINDOW_HALF_Z_UM = 2.25        # saved window z in [-2.25, 2.25] um: layer +-0.25 um and 2 um on each side
LONG = 4                       # duration factor of the time-converged spectra
FIELD_STEPS, FIELD_CHECK_STEPS = 8000, 12000
FIELD_NX = round(dm.PERIOD_UM/FINE['mesh_um'])
FIELD_NZ = round(2*WINDOW_HALF_Z_UM/FINE['mesh_um'])


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


@contextmanager
def frequencies(values):
    """Swap the module frequency list read by GratingForward.__init__ and .efficiencies."""
    old = dm.FREQUENCIES_HZ
    dm.FREQUENCIES_HZ = list(values)
    try:
        yield
    finally:
        dm.FREQUENCIES_HZ = old


def epsilon_on(project, density):
    """The workflow's own GratingForward.epsilon transfer on a given project's region."""
    return dm.GratingForward.epsilon(SimpleNamespace(project=project), density)


def forward_quadrature(mesh_um):
    """build_problem uses (PIXELS, SLAB/mesh), FineEvaluator (PERIOD/mesh, SLAB/mesh); equal at 50 nm."""
    return (round(dm.PERIOD_UM/mesh_um), round(dm.SLAB_UM/mesh_um))


def forward_time_step(mesh_um):
    return dm.build_project(mesh_um, 10).region.time_step


def forward(mesh_um, steps):
    """The forward of build_problem (coarse) or FineEvaluator (fine)."""
    return dm.GratingForward(mesh_um, steps, forward_quadrature(mesh_um))


def broadband(mesh_um, steps, densities):
    """Order efficiencies (41 x 3) with the frequency list swapped for reference and designs."""
    started = time.perf_counter()
    with frequencies(FREQUENCIES_HZ):
        fwd = forward(mesh_um, steps)
        with torch.no_grad():
            out = {name: fwd.efficiencies(fwd.epsilon(d)).double().numpy() for name, d in densities.items()}
    return out, time.perf_counter()-started


def energy_balance(mesh_um, steps, densities):
    """Total T (net flux through the transmitted plane) and R (scattered flux below the layer).

    The project is build_project(mesh, steps) plus one z-normal plane at z=-0.8 um.
    The orders on the transmitted plane are recomputed to show the extra monitor
    leaves them unchanged.
    """
    started = time.perf_counter()
    project = dm.build_project(mesh_um, steps)
    project.monitors.append(dm.FieldMonitor(id='reflected', normal='z', size=(dm.PERIOD_UM, dm.SLAB_UM, 0),
                                            center=(0, 0, REFLECTION_Z_UM)))
    quad = forward_quadrature(mesh_um)
    model = dm.DifferentiablePlaneSimulation(project, dm.AdjointOptions(checkpoints=4),
                                             quadrature_counts={'transmitted': quad, 'reflected': quad})
    out = {}
    with torch.no_grad():
        ref = model(torch.ones(project.region.shape+(3,)), FREQUENCIES_HZ)
        for name, d in densities.items():
            run = model(epsilon_on(project, d), FREQUENCIES_HZ)
            t_total = run['transmitted'].normalized_flux(ref['transmitted'])
            r_total = -run['reflected'].normalized_flux(ref['reflected'], subtract_incident=True)
            orders = dm.diffraction_efficiency(run['transmitted'], ref['transmitted'], dm.ORDERS,
                                               period_um=(dm.PERIOD_UM, dm.SLAB_UM), refractive_index=1.)
            out[name] = dict(T_total=t_total.double().numpy(), R_total=r_total.double().numpy(),
                             orders=orders.double().numpy())
    return out, time.perf_counter()-started


def field_project(steps):
    """FineEvaluator project with a taller z span, the source below the window and one x-z plane."""
    base = dm.build_project(FINE['mesh_um'], steps).model_dump()
    base['region']['size'] = [dm.PERIOD_UM, dm.SLAB_UM, 2*FIELD_HALF_Z_UM]
    base['sources'][0]['center'] = [0., 0., FIELD_SOURCE_Z_UM]
    base['monitors'].append(dm.FieldMonitor(id='xz', normal='y', size=(dm.PERIOD_UM, 0, 2*WINDOW_HALF_Z_UM),
                                            center=(0, 0, 0)).model_dump())
    return Project.model_validate(base)


def field_maps(steps, densities):
    """Complex DFT fields at 1.0 um on the x-z plane (y=0), plus the transmitted-plane orders."""
    started = time.perf_counter()
    project = field_project(steps)
    model = dm.DifferentiablePlaneSimulation(project, dm.AdjointOptions(checkpoints=4), quadrature_counts={
        'transmitted': forward_quadrature(FINE['mesh_um']), 'xz': (FIELD_NX, FIELD_NZ)})
    f0 = [dm.C0/(dm.WAVELENGTH_UM*1e-6)]
    region = model.project.region
    result = {}
    with torch.no_grad():
        ref = model(torch.ones(region.shape+(3,)), f0)
        points = next(plan['points_um'] for identifier, _, plan, _ in model.plans if identifier == 'xz')
        shape = ref['xz'].shape
        assert shape == (FIELD_NX, 1, FIELD_NZ), shape
        x = points[:, 0].reshape(FIELD_NX, FIELD_NZ)[:, 0]
        z = points[:, 2].reshape(FIELD_NX, FIELD_NZ)[0, :]
        grid = lambda values: values.reshape(FIELD_NX, FIELD_NZ).T  # -> [z, x]
        ref_fields = {c: grid(ref['xz'].fields[0, :, k].cdouble().numpy()) for k, c in enumerate(COMPONENTS)}
        # Incident Ex phasor at z=0 from the empty-cell run: geometric mean of the two
        # rows at z=+-h, exact for a single plane wave exp(ikz).
        below, above = np.argsort(np.abs(z))[:2]
        a, b = ref_fields['Ex'][below].mean(), ref_fields['Ex'][above].mean()
        e0 = np.sqrt(a*b)
        if (e0*np.conj(.5*(a+b))).real < 0:
            e0 = -e0
        result['reference'] = dict(fields=ref_fields, e0=e0)
        indices, weights = interpolation_map(region, 'Ex', points)
        for name, d in densities.items():
            eps = epsilon_on(model.project, d)
            run = model(eps, f0)
            fields = {c: grid(run['xz'].fields[0, :, k].cdouble().numpy()) for k, c in enumerate(COMPONENTS)}
            orders = dm.diffraction_efficiency(run['transmitted'], ref['transmitted'], dm.ORDERS,
                                               period_um=(dm.PERIOD_UM, dm.SLAB_UM), refractive_index=1.)
            flat = eps.reshape(-1).double().numpy()
            eps_xx = grid((flat[indices]*weights).sum(0))
            result[name] = dict(fields=fields, orders=orders.double().numpy()[0], eps_xx=eps_xx)
    result['x_um'], result['z_um'] = x, z
    result['region'] = dict(shape=list(region.shape), interior_z_um=list(region.interior_bounds(2)),
                            time_step_s=region.time_step, steps=region.steps,
                            duration_s=region.steps*region.time_step)
    result['wall_time_s'] = time.perf_counter()-started
    return result


def band_metrics(wl, values):
    """Peak, band minimum and mean, and the contiguous range around the peak above 50 % and 90 % of it.

    Crossings are linearly interpolated between samples; None means the range
    reaches the edge of the computed band (0.90 or 1.10 um) without crossing.
    """
    wl, values = np.asarray(wl), np.asarray(values)
    k = int(np.argmax(values))
    result = dict(peak=float(values[k]), peak_wavelength_um=float(wl[k]), band_minimum=float(values.min()),
                  band_minimum_wavelength_um=float(wl[int(np.argmin(values))]), band_mean=float(values.mean()))
    for fraction in (.5, .9):
        level = fraction*values[k]
        left = right = None
        for i in range(k, 0, -1):
            if values[i-1] < level <= values[i]:
                left = wl[i-1]+(level-values[i-1])/(values[i]-values[i-1])*(wl[i]-wl[i-1])
                break
        for i in range(k, len(values)-1):
            if values[i+1] < level <= values[i]:
                right = wl[i]+(values[i]-level)/(values[i]-values[i+1])*(wl[i+1]-wl[i])
                break
        result[f'above_{round(100*fraction)}pct_of_peak'] = dict(
            level=float(level), lower_um=None if left is None else float(left),
            upper_um=None if right is None else float(right),
            width_um=None if left is None or right is None else float(right-left),
            reaches_band_edge=left is None or right is None)
    return result


def band_table(eff, balance=None):
    table = {key: eff[:, j].tolist() for j, key in enumerate(ORDER_KEYS)}
    table['T_orders_sum'] = eff.sum(1).tolist()
    if balance is not None:
        table['T_total'] = balance['T_total'].tolist()
        table['R_total'] = balance['R_total'].tolist()
        table['T_total_plus_R'] = (balance['T_total']+balance['R_total']).tolist()
    return table


def history_rows(record):
    return [dict(iteration=h['iteration'], beta=h['beta'], beta_next=h['beta_next'], objective=h['objective'],
                 efficiency=h['metrics']['efficiency'], holdout_efficiency=h['metrics']['holdout_efficiency'],
                 zero_order=h['metrics']['zero_order'], minus_one=h['metrics']['minus_one'],
                 gradient_norm=h['gradient_norm']) for h in record['history']]


def git(*args):
    return subprocess.run(['git', '-C', str(ROOT), *args], capture_output=True, text=True, check=True).stdout.strip()


def main():
    started = time.perf_counter()
    torch.set_num_threads(4)
    records = {s: json.loads(p.read_text(encoding='utf-8')) for s, p in RECORDS.items()}
    final = {s: dict(last_objective=r['history'][-1]['objective'],
                     last_efficiency=r['history'][-1]['metrics']['efficiency'],
                     coarse_smooth=r['final_evaluation']['stages']['coarse_smooth']['efficiency'],
                     fine_gds=r['final_evaluation']['stages']['fine_gds']['efficiency'],
                     fine_gds_holdout=r['final_evaluation']['stages']['fine_gds']['holdout_efficiency'])
             for s, r in records.items()}
    seed = min(final, key=lambda s: final[s]['last_objective'])
    record = records[seed]
    timings = {}

    # 1. Densities.
    t0 = time.perf_counter()
    problem, coarse_fwd = dm.build_problem(seed)
    logits = problem.parameterization.design.detach().clone()
    initial = problem.density()
    initial_beta = float(problem.parameterization.beta)
    binary = torch.tensor(record['binary'], dtype=torch.float32).reshape(dm.PIXELS, 1)
    export_pixels = json.loads((ROOT/'docs'/'validation'/'g6'/'export'/'metagrating'/f'seed{seed}'/
                                f'metagrating-seed{seed}-binary.json').read_text(encoding='utf-8'))['pixels']
    # Record checks through the workflow's own two-frequency objective path.
    _, initial_metrics = problem.evaluate(initial)
    _, binary_metrics = problem.evaluate(binary)
    timings['densities_and_two_frequency_checks_s'] = time.perf_counter()-t0
    densities = dict(initial=initial, final_binary=binary)

    # 2. Broadband spectra, same class and normalization, 41 frequencies.
    # Workflow duration (x1, matches the record), x2, and x4 (time-converged), same forward class.
    spectra, balance, duration = {}, {}, {}
    for label, cfg in (('coarse', COARSE), ('fine', FINE)):
        duration[label] = {}
        for factor in (1, 2, LONG):
            duration[label][factor], timings[f'spectra_{label}_x{factor}_s'] = broadband(
                cfg['mesh_um'], factor*cfg['steps'], densities)
        spectra[label] = duration[label][1]
        balance[label] = {}
        for factor in (1, LONG):
            balance[label][factor], timings[f'energy_balance_{label}_x{factor}_s'] = energy_balance(
                cfg['mesh_um'], factor*cfg['steps'], densities)

    # 3. Field maps at 1.0 um.
    maps = field_maps(FIELD_STEPS, densities)
    check = field_maps(FIELD_CHECK_STEPS, densities)
    timings['field_maps_s'] = maps['wall_time_s']
    timings['field_duration_check_s'] = check['wall_time_s']

    # Field post-processing: normalize by the incident Ex phasor at z=0, tile three periods.
    e0 = maps['reference']['e0']
    x, z = maps['x_um'], maps['z_um']
    x3 = np.concatenate([x-dm.PERIOD_UM, x, x+dm.PERIOD_UM])
    tile = lambda a: np.tile(a, (1, 3))
    pixel = np.clip(np.floor((x+dm.PERIOD_UM/2)/dm.PIXEL_UM).astype(int), 0, dm.PIXELS-1)
    inside = (np.abs(z) < dm.HEIGHT_UM/2)[:, None]
    arrays = dict(x_um=x3, z_um=z, x_um_unit_cell=x, pixel_edges_x_um=-dm.PERIOD_UM/2+dm.PIXEL_UM*np.arange(dm.PIXELS+1),
                  incident_Ex_phasor_at_z0=np.array([e0.real, e0.imag]))
    field_checks = {}
    ref_ex = maps['reference']['fields']['Ex']/e0
    field_checks['reference_abs_Ex_over_window'] = dict(min=float(np.abs(ref_ex).min()), max=float(np.abs(ref_ex).max()))
    transmitted_rows = z > dm.HEIGHT_UM/2+.25
    for name in ('initial', 'final_binary'):
        f = {c: v/e0 for c, v in maps[name]['fields'].items()}
        for c in ('Ex', 'Ez', 'Hy'):
            arrays[f'{c}_real_{name}'] = tile(f[c].real).astype(np.float32)
            arrays[f'{c}_imag_{name}'] = tile(f[c].imag).astype(np.float32)
        arrays[f'Ex_abs_{name}'] = tile(np.abs(f['Ex'])).astype(np.float32)
        arrays[f'eps_xx_{name}'] = tile(maps[name]['eps_xx']).astype(np.float32)
        d = densities[name].reshape(-1).double().numpy()
        arrays[f'eps_geometric_{name}'] = tile(np.where(inside, 1.+(dm.DESIGN_EPSILON-1.)*d[pixel][None, :], 1.)).astype(np.float32)
        sx = .5*(f['Ey']*np.conj(f['Hz'])-f['Ez']*np.conj(f['Hy'])).real
        sz = .5*(f['Ex']*np.conj(f['Hy'])-f['Ey']*np.conj(f['Hx'])).real
        row = int(np.argmin(np.abs(z-dm.MONITOR_Z_UM)))
        c_plus = np.mean(f['Ex'][row]*np.exp(-2j*np.pi*x/dm.PERIOD_UM))
        c_minus = np.mean(f['Ex'][row]*np.exp(2j*np.pi*x/dm.PERIOD_UM))
        fc = check[name]['fields']['Ex']/check['reference']['e0']
        field_checks[name] = dict(
            orders_at_1um_from_field_run=dict(zip(ORDER_KEYS, maps[name]['orders'].tolist())),
            orders_at_1um_fine_spectra_x4=dict(zip(ORDER_KEYS, duration['fine'][LONG][name][I_DESIGN].tolist())),
            orders_at_1um_fine_spectra_workflow=dict(zip(ORDER_KEYS, spectra['fine'][name][I_DESIGN].tolist())),
            mean_Sx_over_Sz_above_layer=float(sx[transmitted_rows].mean()/sz[transmitted_rows].mean()),
            mean_power_flow_angle_deg_above_layer=float(np.degrees(np.arctan2(sx[transmitted_rows].mean(), sz[transmitted_rows].mean()))),
            Ex_fourier_power_ratio_plus1_over_minus1_at_z_1p2um=float(abs(c_plus)**2/abs(c_minus)**2),
            abs_Ex_max_in_window=float(np.abs(f['Ex']).max()),
            duration_check=dict(steps=[FIELD_STEPS, FIELD_CHECK_STEPS],
                                relative_l2_difference_Ex=float(np.linalg.norm(f['Ex']-fc)/np.linalg.norm(fc)),
                                orders_at_1um_check_steps=dict(zip(ORDER_KEYS, check[name]['orders'].tolist()))))

    # Checks against the record at 1.0 um (and the 0.95 um holdout).
    stages = record['final_evaluation']['stages']
    nominal = record['fabrication']['perturbation']['nominal']['metrics']
    first = record['history'][0]['metrics']
    record_check = dict(
        note='coarse = build_problem forward (50 nm, 800 steps); fine = FineEvaluator forward (25 nm, 1600 steps). '
             'Recorded coarse binary values are fabrication.perturbation.nominal, recorded initial values are history[0] '
             '(iteration 1 evaluates the design before the first optimizer step), recorded fine binary values are '
             'final_evaluation.stages.fine_binary. No recorded fine value exists for the initial design.',
        initial_coarse=dict(record_T_plus1_1um=first['efficiency'],
                            two_frequency_path_T_plus1_1um=initial_metrics['efficiency'],
                            broadband_T_plus1_1um=float(spectra['coarse']['initial'][I_DESIGN, 0]),
                            record_T_plus1_0p95um=first['holdout_efficiency'],
                            broadband_T_plus1_0p95um=float(spectra['coarse']['initial'][I_HOLDOUT, 0]),
                            record_T_zero_1um=first['zero_order'], broadband_T_zero_1um=float(spectra['coarse']['initial'][I_DESIGN, 1]),
                            record_T_minus1_1um=first['minus_one'], broadband_T_minus1_1um=float(spectra['coarse']['initial'][I_DESIGN, 2])),
        final_binary_coarse=dict(record_T_plus1_1um=nominal['efficiency'],
                                 two_frequency_path_T_plus1_1um=binary_metrics['efficiency'],
                                 broadband_T_plus1_1um=float(spectra['coarse']['final_binary'][I_DESIGN, 0]),
                                 record_T_plus1_0p95um=nominal['holdout_efficiency'],
                                 broadband_T_plus1_0p95um=float(spectra['coarse']['final_binary'][I_HOLDOUT, 0]),
                                 record_T_zero_1um=nominal['zero_order'], broadband_T_zero_1um=float(spectra['coarse']['final_binary'][I_DESIGN, 1]),
                                 record_T_minus1_1um=nominal['minus_one'], broadband_T_minus1_1um=float(spectra['coarse']['final_binary'][I_DESIGN, 2])),
        final_binary_fine=dict(record_T_plus1_1um=stages['fine_binary']['efficiency'],
                               broadband_T_plus1_1um=float(spectra['fine']['final_binary'][I_DESIGN, 0]),
                               record_T_plus1_0p95um=stages['fine_binary']['holdout_efficiency'],
                               broadband_T_plus1_0p95um=float(spectra['fine']['final_binary'][I_HOLDOUT, 0]),
                               record_T_zero_1um=stages['fine_binary']['zero_order'], broadband_T_zero_1um=float(spectra['fine']['final_binary'][I_DESIGN, 1]),
                               record_T_minus1_1um=stages['fine_binary']['minus_one'], broadband_T_minus1_1um=float(spectra['fine']['final_binary'][I_DESIGN, 2])),
        record_binary_equals_export_binary=[p[0] for p in export_pixels] == record['binary'])
    worst = 0.
    for block in ('initial_coarse', 'final_binary_coarse', 'final_binary_fine'):
        entry = record_check[block]
        for key in list(entry):
            if key.startswith('record_'):
                other = 'broadband_'+key[len('record_'):]
                worst = max(worst, abs(entry[key]-entry[other]))
    record_check['max_abs_difference_broadband_vs_record'] = worst

    # Pulse coverage of the band (the workflow source: Gaussian, 1 cycle, centred at 1.0 um).
    project = dm.build_project(**COARSE)
    source = project.resolved_source(project.sources[0])
    times = np.arange(1, project.region.steps+1)*project.region.time_step
    signal = source_time_signal(source, times)
    dense = np.linspace(.3, 3., 2701)*dm.C0/1e-6
    spectrum = lambda f: np.abs(np.exp(2j*np.pi*np.asarray(f)[:, None]*times[None, :])@signal)
    peak = spectrum(dense).max()
    band = spectrum(FREQUENCIES_HZ)/peak
    pulse = dict(parameters=pulse_parameters(source).as_dict(), time_definition=source.time_definition, pulse=source.pulse,
                 pulse_cycles=source.pulse_cycles, component=source.component,
                 relative_spectral_amplitude_in_band=dict(min=float(band.min()), max=float(band.max()),
                                                          at_0p90um=float(band[0]), at_1p10um=float(band[-1])),
                 covers_band=bool(band.min() > .5),
                 note='|DFT of the source waveform| over the 800-step coarse run, relative to its global maximum; '
                      'the reference run at the same frequencies divides it out.')

    # Bandwidth of the +1 efficiency, workflow duration and x4.
    bandwidth = {label: {f'x{factor}': {name: band_metrics(WAVELENGTHS_UM, duration[label][factor][name][:, 0])
                                        for name in densities} for factor in (1, LONG)}
                 for label in duration}

    energy = {label: {f'x{factor}': {name: dict(
        max_abs_orders_difference_vs_workflow_forward=float(
            np.abs(balance[label][factor][name]['orders']-duration[label][factor][name]).max()),
        max_abs_T_orders_sum_minus_T_total=float(
            np.abs(duration[label][factor][name].sum(1)-balance[label][factor][name]['T_total']).max()),
        max_abs_one_minus_T_plus_R=float(
            np.abs(1-balance[label][factor][name]['T_total']-balance[label][factor][name]['R_total']).max()))
        for name in densities} for factor in (1, LONG)} for label in balance}
    duration_check = {label: {name: dict(
        steps={f'x{f}': f*cfg['steps'] for f in (1, 2, LONG)},
        max_abs_difference_x1_vs_x4=float(np.abs(duration[label][1][name]-duration[label][LONG][name]).max()),
        max_abs_difference_x2_vs_x4=float(np.abs(duration[label][2][name]-duration[label][LONG][name]).max()),
        T_plus1_1um={f'x{f}': float(duration[label][f][name][I_DESIGN, 0]) for f in (1, 2, LONG)})
        for name in densities} for label, cfg in (('coarse', COARSE), ('fine', FINE))}

    def spectra_block(label, cfg, role):
        return dict(mesh_um=cfg['mesh_um'], quadrature=list(forward_quadrature(cfg['mesh_um'])), role=role,
                    workflow_duration=dict(steps=cfg['steps'], duration_s=cfg['steps']*forward_time_step(cfg['mesh_um']),
                                           note='the workflow run length; matches the record',
                                           **{name: band_table(duration[label][1][name], balance[label][1][name])
                                              for name in densities}),
                    long_duration=dict(steps=LONG*cfg['steps'], duration_s=LONG*cfg['steps']*forward_time_step(cfg['mesh_um']),
                                       note=f'same forward with {LONG}x the steps; time-converged for the final design',
                                       **{name: band_table(duration[label][LONG][name], balance[label][LONG][name])
                                          for name in densities}))

    runtime = time.perf_counter()-started
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    arrays['readme'] = np.array(
        'Arrays indexed [z, x] (rows z_um, columns x_um). x_um spans three periods; the simulated unit cell is '
        'columns 60:120 (x_um_unit_cell), tiled exactly because the cell is periodic at normal incidence. '
        'Fields are 1.0 um DFT phasors (torchfdtd convention exp(+2 pi i f t)) on the plane y=0, divided by the '
        'incident Ex phasor at z=0 of the empty-cell run; Re() is the field when the incident Ex at z=0 is at its '
        'positive maximum. eps_xx = solver permittivity at the Ex Yee locations interpolated to the same points; '
        'eps_geometric = pixel density geometry (1 + 3*rho inside |z|<0.25 um). Hy uses the same scale (reduced units). '
        'See metagrating_showcase.json field_maps for all settings and checks.')
    np.savez_compressed(OUT_NPZ, **arrays)

    scripts = sorted(HERE.glob('*.py'))
    output = dict(
        description='Metagrating inverse-design showcase data (examples/design_metagrating.py, DesignProblem). '
                    'No optimization was run; densities come from build_problem(seed) and the record.',
        chosen_seed=seed,
        seed_selection=dict(
            rule='Recorded objective is the loss -(T+1 at 1.0 um); best final objective = lowest last loss = highest '
                 'last +1 efficiency. The same seed also leads at the coarse smooth and fine GDS stages.',
            per_seed={str(s): v for s, v in final.items()}),
        geometry=dict(period_um=dm.PERIOD_UM, slab_y_um=dm.SLAB_UM, layer_z_um=[-dm.HEIGHT_UM/2, dm.HEIGHT_UM/2],
                      design_epsilon=dm.DESIGN_EPSILON, background_epsilon=1., pixels=dm.PIXELS, pixel_um=dm.PIXEL_UM,
                      pixel_centers_um=(-dm.PERIOD_UM/2+dm.PIXEL_UM*(np.arange(dm.PIXELS)+.5)).tolist(),
                      pixel_edges_um=(-dm.PERIOD_UM/2+dm.PIXEL_UM*np.arange(dm.PIXELS+1)).tolist(),
                      source=dict(kind='plane', normal='z', direction='+z', z_um=dm.SOURCE_Z_UM, component='Ex',
                                  polarization='E along x (the grating vector); TM with respect to the y-invariant lines'),
                      transmitted_monitor_z_um=dm.MONITOR_Z_UM, orders=dm.ORDERS),
        densities=dict(
            initial=initial.reshape(-1).tolist(),
            initial_beta=initial_beta,
            initial_logits=logits.reshape(-1).tolist(),
            initial_definition='build_problem(seed): logits 0.5*randn(Generator seed), sigmoid, periodic conic filter '
                               'radius 0.125 um, tanh projection beta 4 eta 0.5 (DesignProblem.density() before any step)',
            final_binary=[int(v) for v in record['binary']],
            final_binary_definition='record["binary"] = DesignProblem.density(hard=True) after 24 steps (beta 64), '
                                    'identical to the exported binary pixels',
            final_binary_solid_fraction=float(np.mean(record['binary']))),
        spectra=dict(
            wavelength_um=WAVELENGTHS_UM, frequency_hz=FREQUENCIES_HZ,
            columns=dict(T_plus1='+1 transmitted order', T_zero='0 transmitted order', T_minus1='-1 transmitted order',
                         T_orders_sum='sum of the three transmitted orders',
                         T_total='net flux through the transmitted plane / reference flux',
                         R_total='scattered (total minus incident) flux toward -z at z=-0.8 um / reference flux'),
            method='GratingForward with the module frequency list replaced by these 41 frequencies for the reference '
                   'and the design runs, efficiencies() = diffraction_efficiency against that matched reference. '
                   'T_total and R_total come from build_project(mesh, steps) plus one extra z-normal plane at '
                   'z=-0.8 um (DifferentiablePlaneSimulation, normalized_flux, subtract_incident for R).',
            coarse=spectra_block('coarse', COARSE, 'design mesh (build_problem forward)'),
            fine=spectra_block('fine', FINE, 'final-evaluation mesh (FineEvaluator forward)'),
            bandwidth_T_plus1=bandwidth,
            energy_checks=energy,
            duration_check=dict(note='same forward class with 1x, 2x and 4x the steps (the time step is fixed by the '
                                     'mesh, so the simulated time grows); differences are absolute efficiency',
                                **duration_check),
            pulse=pulse),
        record_check=record_check,
        field_maps=dict(
            file='docs/validation/paper_review/metagrating_fields.npz',
            wavelength_um=dm.WAVELENGTH_UM, component='Ex (dominant, source polarization); Ez and Hy also saved',
            plane='x-z at y=0 (fields are y-invariant: periodic y, normal incidence)',
            layout='[z, x]',
            grid=dict(nx_unit_cell=FIELD_NX, nx_tiled=3*FIELD_NX, nz=FIELD_NZ, dx_um=dm.PERIOD_UM/FIELD_NX,
                      dz_um=2*WINDOW_HALF_Z_UM/FIELD_NZ, x_range_um=[float(x3[0]), float(x3[-1])],
                      z_range_um=[float(z[0]), float(z[-1])], points='cell centres of a uniform subdivision; '
                      'fields trilinearly interpolated from the Yee grid (collocated)'),
            method='DifferentiablePlaneSimulation (the workflow model class) with a y-normal FieldMonitor: frequency-'
                   'domain (running DFT) plane at 1.0 um, one broadband Gaussian pulse run per design plus one empty-'
                   'cell reference run for the normalization.',
            project='FineEvaluator settings (25 nm mesh, 16 PML cells = 0.4 um, periodic x/y, Yee material sampling, '
                    'float32, same plane source Ex 1.0 um 1 cycle) with three changes: z span +-2.95 um instead of '
                    '+-1.8 um, source at z=-2.45 um instead of -1.2 um (below the saved window, so the region under '
                    f'the layer shows incident plus reflected light), and {FIELD_STEPS} steps instead of 1600 '
                    f'(time-converged fields, cf. spectra.duration_check; checked against {FIELD_CHECK_STEPS} steps).',
            steps=FIELD_STEPS, region=maps['region'],
            normalization='fields / incident Ex phasor at z=0 of the empty-cell run (geometric mean of the rows '
                          'z=+-0.0125 um, exact for one plane wave)',
            incident_Ex_phasor_at_z0=[float(e0.real), float(e0.imag)],
            checks=field_checks,
            tiling='three periods along x in the saved arrays; columns 60:120 are the simulated cell'),
        histories={str(s): history_rows(r) for s, r in records.items()},
        history_columns=dict(objective='loss = -(T+1 at 1.0 um), coarse mesh, current smooth density at beta',
                             efficiency='T+1 at 1.0 um', holdout_efficiency='T+1 at 0.95 um (never optimized)',
                             zero_order='T0 at 1.0 um', minus_one='T-1 at 1.0 um',
                             beta='projection beta used for this evaluation', beta_next='beta after the step'),
        provenance=dict(
            git_commit=git('rev-parse', 'HEAD'),
            git_status_torchfdtd_examples=git('status', '--porcelain', '--', 'torchfdtd', 'examples') or 'clean',
            sha256={str(EXAMPLE.relative_to(ROOT)).replace('\\', '/'): sha256(EXAMPLE),
                    **{str(p.relative_to(ROOT)).replace('\\', '/'): sha256(p) for p in RECORDS.values()},
                    **{str(p.relative_to(ROOT)).replace('\\', '/'): sha256(p) for p in scripts}},
            producing_script=str(Path(__file__).resolve().relative_to(ROOT)).replace('\\', '/'),
            device='cpu', torch_threads=torch.get_num_threads(), torch_version=torch.__version__,
            numpy_version=np.__version__, python=platform.python_version(), platform=platform.platform(),
            processor=platform.processor(), timings_s=timings, runtime_s=runtime,
            date=time.strftime('%Y-%m-%dT%H:%M:%S%z')))
    OUT_JSON.write_text(json.dumps(output, indent=1), encoding='utf-8')
    print(json.dumps(dict(seed=seed, record_check=record_check, bandwidth=bandwidth, energy=energy,
                          duration=duration_check, fields=field_checks, pulse=pulse['relative_spectral_amplitude_in_band'],
                          runtime_s=runtime, timings=timings), indent=1))


if __name__ == '__main__':
    main()
