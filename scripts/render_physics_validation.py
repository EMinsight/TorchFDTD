"""Render docs/PHYSICS_VALIDATION.md from the G3 records in docs/validation/g3/*.json.

Every number in the document comes from the records written by tests/test_physics_g3_a.py;
the prose here only names the fixtures and the pre-declared limits. Run after the recorded run:

    python scripts/render_physics_validation.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT / 'docs' / 'validation' / 'g3'
OUTPUT = ROOT / 'docs' / 'PHYSICS_VALIDATION.md'


def load(task):
    path = RECORDS / f'{task}.json'
    return json.loads(path.read_text(encoding='utf-8')) if path.is_file() else None


def g(value, digits=3):
    if value is None:
        return 'n/a'
    if isinstance(value, bool):
        return 'yes' if value else 'no'
    if isinstance(value, (int,)) and not isinstance(value, bool):
        return str(value)
    if isinstance(value, float):
        return f'{value:.{digits}g}'
    return str(value)


def table(header, rows):
    lines = ['| ' + ' | '.join(header) + ' |', '|' + '|'.join(' --- ' for _ in header) + '|']
    lines += ['| ' + ' | '.join(str(c) for c in row) + ' |' for row in rows]
    return '\n'.join(lines)


def verdict(ok):
    return 'pass' if ok else '**FAIL**'


def environment_block(record):
    e = record['environment']
    return (f"Environment: Python {e['python']}, numpy {e['numpy']}, torch {e['torch']} (CUDA runtime {e['cuda_runtime']}), "
            f"{e['gpu'] or 'no GPU'}, {e['cpu']}, {e['os']}; run at {e['recorded_at']} on commit {e['commit'][:12]} "
            f"with {e['dirty_paths']} dirty paths (the records themselves were being written); fine meshes {'on' if e['fine_meshes'] else 'off'}.")


def section_g301(record):
    entries = record['entries']
    out = ['## G3-01 Uniform-medium propagation', '',
           'Case: `docs/validation/cases/G3-01_uniform_propagation.json`. Part A initialises a real discrete plane wave '
           'on an all-periodic Yee grid and measures cos(omega dt) from the three-term recurrence of the field; the oracle is the exact '
           'Yee relation written in the test. Part B propagates a one-cycle pulse from a sheet through two point monitors 3.1 um apart '
           '(2 vacuum wavelengths) inside a 24.8 um domain for 100 fs and compares the measured k(f) with the Yee relation and the continuum.',
           '', environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('eigenmode oblique'):
            rows.append([v['shape'], g(v['index']), v['polarization'], g(v['residual'], 2), g(v['polarization_leak'], 2),
                         g(v['phase_velocity_error'], 3), verdict(v['residual'] <= v['limit_residual'] and v['polarization_leak'] <= v['limit_leak'])])
    out += ['### Part A: discrete relation at an oblique wavevector (limits 1e-12 on both residuals)', '',
            table(['cells', 'n', 'polarization', 'abs cos residual', 'polarization leak', 'v_p / (c/n) - 1', 'verdict'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('eigenmode axis'):
            rows.append([v['shape'][0], g(v['index']), v['polarization'], g(v['residual'], 2), g(v['polarization_leak'], 2),
                         g(v['phase_velocity_error'], 3), g(v['phase_error_per_wavelength'], 3)])
    out += ['### Part A: mesh sweep along an axis (cells per wavelength in the medium)', '',
            table(['N', 'n', 'polarization', 'abs cos residual', 'leak', 'v_p / (c/n) - 1', 'phase error per wavelength (rad)'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('propagation'):
            i = len(v['wavelength_um'])//2
            rows.append([key.split()[1], v['N'], g(v['index']), v['component'], v['steps'], g(v['max_phase_residual_vs_yee'], 2),
                         g(v['limit_phase_residual_rad'], 1), g(v['phase_error_per_wavelength'][i], 3), g(v['phase_error_per_wavelength_yee'][i], 3),
                         g(v['wavelength_um'][i], 4), g(max(v['phase_error_per_wavelength'], key=abs), 3),
                         g(v['trace_end_over_peak'], 2), verdict(v['max_phase_residual_vs_yee'] <= v['limit_phase_residual_rad'])])
    out += ['### Part B: pulse propagation through the Simulation path (limit 1e-3 rad on abs(k_measured - k_Yee) D)', '',
            table(['dim', 'N', 'n', 'component', 'steps', 'max abs(k_meas - k_Yee) D (rad)', 'limit', 'phase error/wavelength at mid band (rad)',
                   'Yee prediction', 'mid-band wavelength (um)', 'largest phase error/wavelength on band', 'trace end / peak', 'verdict'], rows), '']
    rows = [[key.split()[2], v['N'], g(v['index']), ' vs '.join(v['components']), g(v['trace_difference'], 2), g(v['limit'], 1), verdict(v['trace_difference'] <= v['limit'])]
            for key, v in entries.items() if key.startswith('polarization identity')]
    out += ['### Polarization identity (limit 1e-12 on the normalised trace difference)', '', table(['dim', 'N', 'n', 'components', 'max difference / peak', 'limit', 'verdict'], rows), '']
    rows = [[key.split()[4], g(v['index']), v['component'], v['steps'], g(v['max_abs_error'], 2), g(v['relative_l2'], 2), verdict(v['within'])]
            for key, v in entries.items() if key.startswith('layer A')]
    if rows:
        out += ['### Layer A: CUDA FP32 against CPU FP64 (rtol 1e-4, atol 1e-6 on traces / FP64 peak)', '',
                table(['dim', 'n', 'component', 'steps', 'max abs error', 'relative L2', 'verdict'], rows), '']
    return out


def section_g302(record):
    entries = record['entries']
    out = ['## G3-02 Dielectric slab, normal and oblique TE/TM', '',
           'Case: `docs/validation/cases/G3-02_dielectric_slab_tmm.json`. A lossless slab in a 6 um 2D cell with periodic (normal) or Bloch '
           '(fixed k_parallel) transverse boundaries, a three-cycle sheet pulse, point monitors 1 um before and after the slab and a slab-free '
           'reference run. r and t are the +f DFT ratios referred to the physical faces with the discrete vacuum wavenumber; the oracle is a '
           'Fresnel/Airy transfer matrix written in the test. Limits: R and T absolute error 0.01, abs(R+T-1) 0.01, transmission phase 0.02 rad '
           'wherever |t| > 0.1 (everywhere here). The reflection phase is reported only (staircase reference-plane ambiguity).', '',
           environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('slab'):
            rows.append([g(v['index']), g(v['thickness_um']), v['angle_deg'], v['polarization'], v['N'], g(v['mesh_um'], 4),
                         g(v['cells_per_material_wavelength_at_1p55'], 3), v['steps'], g(v['R_abs_error'], 2), g(v['T_abs_error'], 2),
                         g(v['balance_residual'], 2), g(v['t_phase_error'], 2), g(v['r_phase_error'], 2), verdict(v['passed'])])
    out += [table(['n', 'd (um)', 'angle (deg)', 'pol', 'N', 'h (um)', 'cells/material wavelength', 'steps', 'max abs dR', 'max abs dT',
                   'max abs(R+T-1)', 'max t phase error (rad)', 'max r phase error (rad, info)', 'verdict'], rows), '']
    failing = [key for key, v in entries.items() if key.startswith('slab') and not v['passed']]
    out += [f'Instances failing a pre-declared limit: {len(failing)} of {sum(1 for k in entries if k.startswith("slab"))}.' +
            (' ' + '; '.join(failing) if failing else ''), '']
    rows = [[v['polarization'], v['steps'], g(v['max_abs_error'], 2), g(v['relative_l2'], 2), verdict(v['within'])]
            for key, v in entries.items() if key.startswith('layer A')]
    if rows:
        out += ['### Layer A: CUDA FP32 (complex64 Bloch fields) against CPU FP64, n=1.5, d=0.2 um, 45 deg, N20', '',
                table(['pol', 'steps', 'max abs error', 'relative L2', 'verdict'], rows), '']
    return out


def section_g303(record):
    entries = record['entries']
    out = ['## G3-03 Drude and Lorentz slabs: fitting error and ADE error separated', '',
           'Case: `docs/validation/cases/G3-03_dispersive_slab_fit_ade.json`. Normal incidence in the G3-02 cell with the analytic Drude '
           '(eps_inf 1, omega_p 2e15 rad/s, gamma 1e14 rad/s, 0.1 um) and two-pole Lorentz (eps_inf 2.25, poles at 1.9e15 and 7.5e14 rad/s, '
           '0.5 um) slabs; the oracle is the transfer matrix with the same analytic permittivity. Limits: abs dR, abs dT, abs dA 0.01, t phase 0.02 rad.',
           '', environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('analytic'):
            ok = (v['R_abs_error'] <= v['limits']['R'] and v['T_abs_error'] <= v['limits']['T'] and v['A_abs_error'] <= v['limits']['A']
                  and v['t_phase_error'] <= v['limits']['t_phase'])
            rows.append([v['material'], v['polarization'], g(v['mesh_um']), v['cells_across_slab'], v['steps'], g(v['R_abs_error'], 2),
                         g(v['T_abs_error'], 2), g(v['A_abs_error'], 2), g(v['t_phase_error'], 2), g(max(v['A_ref']), 3), verdict(ok)])
    out += ['### Part a: analytic materials given directly', '',
            table(['material', 'pol', 'h (um)', 'cells across slab', 'steps', 'max abs dR', 'max abs dT', 'max abs dA', 'max t phase error (rad)', 'max A (TMM)', 'verdict'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('fitted'):
            a, b, c = v['fdtd_fitted_vs_tmm_fitted'], v['fdtd_fitted_vs_tmm_analytic'], v['tmm_fitted_vs_tmm_analytic']
            rows.append([v['material'], g(v['converged']), v['poles'], g(v['fit_report_analytic']['normalized_rms'], 2),
                         g(v['fit_band_errors']['max_abs_n'], 2), g(v['fit_band_errors']['max_abs_k'], 2),
                         g(c['R_abs_error'], 2), g(c['T_abs_error'], 2), g(a['R_abs_error'], 2), g(a['T_abs_error'], 2), g(a['A_abs_error'], 2), g(a['t_phase_error'], 2),
                         g(b['R_abs_error'], 2), g(b['T_abs_error'], 2), g(b['A_abs_error'], 2), g(b['t_phase_error'], 2)])
    out += ['### Part b: n/k tables through the passive fit (h20, TE); fit error and discretization error separated', '',
            table(['material', 'converged', 'poles', 'fit normalized rms', 'max abs dn on band', 'max abs dk on band',
                   'fit only: abs dR', 'fit only: abs dT', 'FDTD(fit) vs TMM(fit): abs dR', 'abs dT', 'abs dA', 't phase (rad)',
                   'FDTD(fit) vs TMM(analytic): abs dR', 'abs dT', 'abs dA', 't phase (rad)'], rows), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('ade'):
            for mesh, m in v['per_dt'].items():
                rows.append([v['material'], mesh, g(m['dt_s'], 4), g(m['max_abs_n_error'], 2), g(m['max_abs_k_error'], 2), g(m['max_rel_eps_error'], 2),
                             g(m['solver_vs_bilinear_rel'], 2), g(m['driven_vs_bilinear_rel'], 2)])
            rows.append([v['material'], 'ratio dt / (dt/2)', '', g(v['error_ratio_dt_over_half_dt']['n'], 3), g(v['error_ratio_dt_over_half_dt']['k'], 3), '', '', ''])
    out += ['### Part c: trapezoidal ADE constitutive error at the 21 band frequencies (limit 1e-3 on abs dn and abs dk; solver vs bilinear 1e-12; driven cell 1e-9)', '',
            table(['material', 'time step', 'dt (s)', 'max abs(n_ADE - n)', 'max abs(k_ADE - k)', 'max rel eps error', 'solver permittivity vs bilinear (rel)', 'driven cell vs bilinear (rel)'], rows), '']
    return out


def section_g307(record):
    entries = record['entries']
    out = ['## G3-07 CPML reflection and long-time stability', '',
           'Case: `docs/validation/cases/G3-07_cpml_reflection_stability.json`. Default profile (10 layers, 0.25 um, sigma_scale 1, kappa 1, '
           'alpha 1e-8, cubic). The reflected wave is the difference between a short domain and a long reference domain with identical '
           'source, monitor and near-end geometry; R(f) = |DFT(short - long)|^2 / |DFT(long)|^2. Limits: normal 1e-6, oblique and interface 1e-4, '
           'stability: energy last/peak 1e-6 (normal runs) and no late growth.', '', environment_block(record), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('normal') or key.startswith('oblique'):
            rows.append([key, v['steps'], g(v['R_max_on_band'], 2), g(v['R_max_dB'], 3), g(v['R_at_design'], 2), g(v['R_broadband'], 2), g(v['limit'], 1),
                         verdict(v['R_max_on_band'] <= v['limit'])])
    v = entries.get('interface n=2 half space L10')
    if v:
        for label, m in v['monitors'].items():
            rows.append([f'interface, {label}', v['steps'], g(m['R_max_on_band'], 2), g(m['R_max_dB'], 3), g(m['R_at_design'], 2), g(m['R_broadband'], 2),
                         g(v['limit'], 1), verdict(m['R_max_on_band'] <= v['limit'])])
    out += ['### Reflected / incident power', '',
            table(['fixture', 'steps', 'max R on band', 'dB', 'R at design wavelength', 'broadband energy ratio', 'limit', 'verdict'], rows), '']
    v = entries.get('sweeps vacuum normal')
    if v:
        out += ['### Separate sweeps (vacuum, normal incidence; reported only)', '',
                table(['sweep', 'value A', 'value B'],
                      [['layers 10 vs 20: max R on band', g(v['depth']['L10'], 2) + f" ({g(v['depth']['L10_dB'], 3)} dB)", g(v['depth']['L20'], 2) + f" ({g(v['depth']['L20_dB'], 3)} dB)"],
                       ['duration 100 fs vs 200 fs: max R on band', g(v['time']['fs100'], 2), g(v['time']['fs200'], 2) + f" (relative change {g(v['time']['relative_change'], 2)})"]]), '']
    rows = []
    for key, v in entries.items():
        if key.startswith('stability'):
            ok = v['late_growth'] <= v['limits']['late_growth_max'] and (not v['decay_criterion_applies'] or v['energy_last_over_peak'] <= v['limits']['energy_last_over_peak_max'])
            rows.append([key.replace('stability ', ''), v['steps'], g(v['duration_fs'], 4), g(v['source_end_fs'], 3), g(v['energy_last_over_peak'], 2),
                         g(v['energy_at_half_over_peak'], 2), g(v['late_growth'], 6), g(v['decay_criterion_applies']), verdict(ok)])
    out += ['### 20,000-step stability', '',
            table(['run', 'steps', 'duration (fs)', 'source end (fs)', 'energy last / peak', 'energy at half / peak', 'late growth', 'decay limit applies', 'verdict'], rows), '']
    v = entries.get('layer A cuda fp32 short vacuum normal')
    if v:
        out += ['### Layer A: CUDA FP32 against CPU FP64 (short vacuum normal fixture)', '',
                table(['steps', 'max abs error', 'relative L2', 'verdict'], [[v['steps'], g(v['max_abs_error'], 2), g(v['relative_l2'], 2), verdict(v['within'])]]), '']
    return out


SECTIONS = {'G3-01': section_g301, 'G3-02': section_g302, 'G3-03': section_g303, 'G3-07': section_g307}


def main():
    lines = ['# Physics validation records (stage G3)', '',
             'Rendered by `scripts/render_physics_validation.py` from `docs/validation/g3/<task>.json`, which '
             '`tests/test_physics_g3_a.py` writes before it asserts. Every number below comes from those records; none is typed by hand. '
             'The fixtures and limits were declared in `docs/validation/cases/` before the recorded run '
             '(see [COMPLETION_PROGRAM_KO.md](COMPLETION_PROGRAM_KO.md) section 5). A **FAIL** is a finding against a pre-declared limit and is kept as such.', '']
    for task, render in SECTIONS.items():
        record = load(task)
        if record is None:
            lines += [f'## {task}', '', 'No record yet.', '']
            continue
        lines += render(record)
    with open(OUTPUT, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write('\n'.join(lines).rstrip('\n') + '\n')
    print(f'wrote {OUTPUT.relative_to(ROOT).as_posix()}')


if __name__ == '__main__':
    main()
