"""Render the G3-04, G3-05, G3-08 and G3-13 sections of docs/PHYSICS_VALIDATION.md from docs/validation/g3/<task>.json.

Run: python -m benchmarks.render_g3_b [--tasks G3-04 ...]
The sections are replaced between the markers "<!-- g3-b:<task> begin -->" and
"<!-- g3-b:<task> end -->"; a missing marker pair is appended at the end of the
file, and a missing file is created with a two-line header.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT/'docs'/'validation'/'g3'
DOC = ROOT/'docs'/'PHYSICS_VALIDATION.md'
HEADER = ('# Physics validation\n\nIndependent physics fixtures of the completion program (stage G3). Every '
          'section is rendered from a record under docs/validation/g3 by a benchmark script and judged against '
          'the pre-declared case under docs/validation/cases.\n')


def load(task):
    path = RECORDS/f'{task}.json'
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else None


def pct(value):
    return f'{100*value:.3f}%'


def rows_with(record, prefix):
    return sorted((k, v) for k, v in record['rows'].items() if k.startswith(prefix))


def verdict(ok):
    return 'pass' if ok else 'FAIL'


def render_g3_04(record):
    case = json.loads((ROOT/'docs'/'validation'/'cases'/'G3-04_mie_cylinder_sphere.json').read_text(encoding='utf-8'))
    limit = case['acceptance']['integrated_cross_section_relative_error']
    out = ['## G3-04 Mie scattering of a dielectric cylinder and sphere', '',
           f'Case `{case["case_id"]}`, record `docs/validation/g3/G3-04.json` generated {record["generated"]}. '
           'Closed TFSF box, matched empty-box reference, cross section from the outward scattered power over the incident intensity, '
           'against the Mie series written in the test with SciPy Bessel functions. '
           f'Limit: relative error at most {pct(limit)} at the judged mesh; the coarser meshes are recorded and non-monotone sequences are allowed on staircased surfaces.', '',
           '| Fixture | Polarization | h (um) | Grid | Steps | Execution | Max relative error | Judged |', '|---|---|---:|---|---:|---|---:|---|']
    judged_c, judged_s = case['fixture']['cylinder']['judged_mesh_um'], case['fixture']['sphere']['judged_mesh_um']
    for key, r in rows_with(record, 'cylinder/'):
        judged = r['mesh_um'] == judged_c and r['backend'] == 'cpu'
        out.append(f'| cylinder | {key.split("/")[1]} | {r["mesh_um"]} | {"x".join(map(str, r["grid"][:2]))} | {r["steps"]} | {r["backend"]} {r["precision"]} | {pct(r["max_relative_error"])} | {verdict(r["max_relative_error"] <= limit) if judged else "recorded"} |')
    for key, r in rows_with(record, 'sphere/'):
        judged = r['mesh_um'] == judged_s and r['backend'] == 'cpu'
        out.append(f'| sphere | Ez | {r["mesh_um"]} | {"x".join(map(str, r["grid"]))} | {r["steps"]} | {r["backend"]} {r["precision"]} | {pct(r["max_relative_error"])} | {verdict(r["max_relative_error"] <= limit) if judged else "recorded"} |')
    out += ['', 'Layer A (CUDA FP32 against CPU FP64, same discrete problem, rtol 1e-4 on the cross section):', '',
            '| Fixture | Polarization | h (um) | Max relative difference | Result |', '|---|---|---:|---:|---|']
    for key, r in rows_with(record, 'cylinder/')+rows_with(record, 'sphere/'):
        if 'layer_a_max_relative_difference' in r:
            out.append(f'| {key.split("/")[0]} | {key.split("/")[1] if key.startswith("cylinder") else "Ez"} | {r["mesh_um"]} | {r["layer_a_max_relative_difference"]:.2e} | {verdict(r["layer_a_max_relative_difference"] <= r["layer_a_rtol"])} |')
    res = rows_with(record, 'resonance/')
    if res:
        lim = case['acceptance']['resonance']
        out += ['', f'Resonance of the 0.25 um, n = 3.5 cylinder (TE): peak position within {pct(lim["peak_position_relative_error"])} and FWHM within {pct(lim["fwhm_relative_error"])} at the judged mesh.', '',
                '| h (um) | Execution | Peak (um) | Mie peak (um) | Position error | FWHM (um) | Mie FWHM (um) | FWHM error | Judged |', '|---:|---|---:|---:|---:|---:|---:|---:|---|']
        judged_r = case['fixture']['resonance']['judged_mesh_um']
        for key, r in res:
            judged = r['mesh_um'] == judged_r
            ok = abs(r['peak_relative_error']) <= lim['peak_position_relative_error'] and abs(r['fwhm_relative_error']) <= lim['fwhm_relative_error']
            out.append(f'| {r["mesh_um"]} | {r["backend"]} {r["precision"]} | {r["peak_um"]:.4f} | {r["mie_peak_um"]:.4f} | {pct(r["peak_relative_error"])} | {r["fwhm_um"]:.4f} | {r["mie_fwhm_um"]:.4f} | {pct(r["fwhm_relative_error"])} | {verdict(ok) if judged else "recorded"} |')
    return out


def render_g3_05(record):
    case = json.loads((ROOT/'docs'/'validation'/'cases'/'G3-05_drude_sphere.json').read_text(encoding='utf-8'))
    per = case['acceptance']['per_radius']
    d = case['fixture']['drude']
    out = ['## G3-05 Drude sphere scattering and absorption', '',
           f'Case `{case["case_id"]}`, record `docs/validation/g3/G3-05.json` generated {record["generated"]}. '
           f'Analytic Drude model epsilon_inf = {d["epsilon_inf"]}, omega_p = {d["plasma_rad_s"]:.3g} rad/s, gamma = {d["collision_rad_s"]:.3g} rad/s, '
           f'radii {case["fixture"]["radii_um"]} um, band {case["fixture"]["band"][0]} to {case["fixture"]["band"][1]} um, mesh sequence {case["fixture"]["mesh_sequence_um"]} um at a fixed {case["fixture"]["domain_um"]} um domain. '
           'Scattering from the outer planes, absorption from the net inward total-field power of the inner planes, both against the complex-index Mie series. '
           'The per-radius budgets are the fixture-specific ones of the case (the 2 percent program threshold is declared not applicable); a failure is a recorded finding.', '',
           '| r (um) | h (um) | Cells/r | Execution | Max scattering error | Budget | Max absorption error | Budget | Peak sca (um) | Mie | Peak abs (um) | Mie | Inner/outer | Judged |',
           '|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|']
    judged_h = case['fixture']['judged_mesh_um']
    for key, r in rows_with(record, 'r='):
        lim = per[str(r['radius_um'])]
        judged = r['mesh_um'] == judged_h and r['backend'] == 'cpu'
        ok = r['max_scattering_relative_error'] <= lim['scattering_relative_error'] and r['max_absorption_relative_error'] <= lim['absorption_relative_error']
        out.append(f'| {r["radius_um"]} | {r["mesh_um"]} | {r["cells_per_radius"]:.0f} | {r["backend"]} {r["precision"]} | {pct(r["max_scattering_relative_error"])} | {pct(lim["scattering_relative_error"])} | '
                   f'{pct(r["max_absorption_relative_error"])} | {pct(lim["absorption_relative_error"])} | {r["peak_scattering_um"]:.3f} | {r["mie_peak_scattering_um"]:.3f} | {r["peak_absorption_um"]:.3f} | {r["mie_peak_absorption_um"]:.3f} | '
                   f'{pct(r["inner_outer_scattering_max_difference_over_band_maximum"])} | {verdict(ok) if judged else "recorded"} |')
    out += ['', 'Per-wavelength relative errors of the CPU FP64 rows (scattering / absorption):', '']
    for key, r in rows_with(record, 'r='):
        if r['backend'] != 'cpu':
            continue
        out.append(f'- r = {r["radius_um"]} um, h = {r["mesh_um"]} um: scattering '+', '.join(f'{100*e:+.0f}%' for e in r['scattering_relative_error'])+'; absorption '+', '.join(f'{100*e:+.0f}%' for e in r['absorption_relative_error']))
    out += ['', 'Layer A (CUDA FP32 against CPU FP64 on scattering and absorption, rtol 1e-4):', '', '| r (um) | h (um) | Max relative difference | Result |', '|---:|---:|---:|---|']
    for key, r in rows_with(record, 'r='):
        if 'layer_a_max_relative_difference' in r:
            out.append(f'| {r["radius_um"]} | {r["mesh_um"]} | {r["layer_a_max_relative_difference"]:.2e} | {verdict(r["layer_a_max_relative_difference"] <= r["layer_a_rtol"])} |')
    return out


def render_g3_08(record):
    case = json.loads((ROOT/'docs'/'validation'/'cases'/'G3-08_bloch_grating_rcwa.json').read_text(encoding='utf-8'))
    oracle = json.loads((RECORDS/'G3-08_torcwa_reference.json').read_text(encoding='utf-8'))
    lim = case['acceptance']
    out = ['## G3-08 Bloch grating diffraction orders against RCWA', '',
           f'Case `{case["case_id"]}`, record `docs/validation/g3/G3-08.json` generated {record["generated"]}. '
           f'Freestanding binary grating, period {case["fixture"]["period_um"]} um, fill {case["fixture"]["fill"]}, height {case["fixture"]["height_um"]} um, n = {case["fixture"]["index"]}, '
           f'wavelengths {case["fixture"]["wavelengths_um"]} um at {case["fixture"]["angles_deg"]} degrees, TE and TM. '
           f'Oracle: {oracle["reference_method"]}, version {oracle["torcwa_version"]}, complex128, harmonics {oracle["harmonic_sequence"]} with the oracle at {oracle["harmonic_sequence"][-1]}; '
           f'empty-layer phase check error {oracle["empty_layer_check"]["max_abs_error"]:.1e}. '
           f'Limits: efficiency error at most {lim["efficiency_absolute_error"]} per propagating order, phase error at most {lim["dominant_order_phase_error_rad"]} rad on orders whose oracle efficiency is at least {lim["dominant_order_efficiency"]}, '
           f'lossless balance within {lim["lossless_balance_absolute_error"]}.', '',
           'TORCWA harmonic convergence (largest change at the last doubling, 320 to 640 harmonics, over all configurations and orders):', '']
    worst = {}
    for c in oracle['configurations']:
        for m, row in c['convergence'].items():
            for pol in ('TE', 'TM'):
                for key in ('t_efficiency', 'r_efficiency', 't_phase_rad', 'r_phase_rad'):
                    dominant = c['oracle'][m][pol][key[0]+'_efficiency'] >= lim['dominant_order_efficiency']
                    if key.endswith('phase_rad') and not dominant:
                        continue
                    worst[(pol, key)] = max(worst.get((pol, key), 0.), abs(row[pol][key+'_change_from_previous']))
    out += ['| Polarization | Efficiency change (T) | Efficiency change (R) | Phase change (T, dominant) | Phase change (R, dominant) |', '|---|---:|---:|---:|---:|']
    for pol in ('TE', 'TM'):
        out.append(f'| {pol} | {worst[(pol, "t_efficiency")]:.1e} | {worst[(pol, "r_efficiency")]:.1e} | {worst[(pol, "t_phase_rad")]:.1e} rad | {worst[(pol, "r_phase_rad")]:.1e} rad |')
    out += ['', 'TORCWA forms the Toeplitz matrix of epsilon directly, so the TM sequence converges like 1/N; the TE sequence is converged to roundoff.', '',
            '| Pol | Angle | Wavelength (um) | Interface | h (um) | Duration (fs) | Execution | Orders | Max efficiency error | Max dominant phase error (rad) | Sum T+R | Judged |',
            '|---|---:|---:|---|---:|---:|---|---|---:|---:|---:|---|']
    for key, r in rows_with(record, 'T'):
        judged = r['mesh_um'] == case['fixture']['judged_mesh_um'] and r['interface'] == 'subpixel' and r['duration_fs'] == case['fixture']['duration_fs']
        ok = r['max_efficiency_error'] <= lim['efficiency_absolute_error'] and r['max_dominant_phase_error_rad'] <= lim['dominant_order_phase_error_rad'] and abs(r['efficiency_sum']-1) <= lim['lossless_balance_absolute_error']
        out.append(f'| {r["polarization"]} | {r["angle_deg"]:g} | {r["wavelength_um"]} | {r["interface"]} | {r["mesh_um"]} | {r["duration_fs"]:g} | {r["backend"]} {r["precision"]} | {" ".join(sorted(r["orders"], key=int))} | '
                   f'{r["max_efficiency_error"]:.4f} | {r["max_dominant_phase_error_rad"]:.4f} | {r["efficiency_sum"]:.4f} | {verdict(ok) if judged else ("within limits" if ok else "outside limits")+", recorded"} |')
    out += ['', 'Per-order values of the judged rows (FDTD / TORCWA efficiency, phase error in rad):', '']
    for key, r in rows_with(record, 'T'):
        if not (r['mesh_um'] == case['fixture']['judged_mesh_um'] and r['interface'] == 'subpixel' and r['duration_fs'] == case['fixture']['duration_fs']):
            continue
        parts = []
        for m in sorted(r['orders'], key=int):
            e = r['orders'][m]
            parts.append(f'm={m}: T {e["transmission"]["efficiency"]:.4f}/{e["transmission"]["torcwa_efficiency"]:.4f} ({e["transmission"]["phase_error_rad"]:+.4f}), R {e["reflection"]["efficiency"]:.4f}/{e["reflection"]["torcwa_efficiency"]:.4f} ({e["reflection"]["phase_error_rad"]:+.4f})')
        out.append(f'- {r["polarization"]} {r["angle_deg"]:g} deg {r["wavelength_um"]} um: '+'; '.join(parts))
    out += ['', 'Layer A (CUDA FP32 against CPU FP64 at h = 0.01 um, every propagating efficiency, rtol 1e-4):', '', '| Pol | Angle | Wavelength (um) | Max relative difference | Result |', '|---|---:|---:|---:|---|']
    for key, r in rows_with(record, 'T'):
        if 'layer_a_max_relative_difference' in r:
            out.append(f'| {r["polarization"]} | {r["angle_deg"]:g} | {r["wavelength_um"]} | {r["layer_a_max_relative_difference"]:.2e} | {verdict(r["layer_a_max_relative_difference"] <= r["layer_a_rtol"])} |')
    out += ['', 'Empty cell (no grating): forward zero-order transmission relative to the incident line, other orders and the backward zero order.', '',
            '| Pol | Angle | Execution | T0 | Other orders (max) | Backward zero order | Limit |', '|---|---:|---|---:|---:|---:|---:|']
    for key, r in rows_with(record, 'empty/'):
        out.append(f'| {r["polarization"]} | {r["angle_deg"]:g} | {r["backend"]} {r["precision"]} | {r["zero_order_transmission"]:.8f} | {max(r["other_orders"]+[0.]):.1e} | {r["backward_zero_order"]:.1e} | {r["zero_order_limit"]:.0e} |')
    return out


def render_g3_13(record):
    case = json.loads((ROOT/'docs'/'validation'/'cases'/'G3-13_curved_interface_convergence.json').read_text(encoding='utf-8'))
    out = ['## G3-13 Curved-interface convergence', '',
           f'Case `{case["case_id"]}`, record `docs/validation/g3/G3-13.json` generated {record["generated"]}. '
           f'The G3-04 cylinder (radius 0.3 um, n = 1.5) at h = {case["fixture"]["mesh_sequence_um"]} um with the staircase and the subpixel interface, '
           f'centre shifts of {case["fixture"]["shift_fractions"]} h at h = {case["fixture"]["shift_mesh_um"]} um, and the differentiable-solid transition width '
           f'{case["fixture"]["smoothing_width_fractions"]} h at h = {case["fixture"]["smoothing_mesh_um"]} um. '
           'Pass/fail item: the subpixel error at h is below the staircase error at h; everything else is reported.', '',
           '| Polarization | Interface | h (um) | Max relative error | Wall (s) |', '|---|---|---:|---:|---:|']
    for key, r in rows_with(record, 'mesh/'):
        out.append(f'| {key.split("/")[1]} | {r["interface"]} | {r["mesh_um"]} | {pct(r["max_relative_error"])} | {r["wall_s"]:.1f} |')
    out += ['', '| Polarization | Staircase order estimates | Subpixel order estimates | Subpixel(h) < staircase(h) | Subpixel(h) error < staircase(h/2) | Subpixel(h) wall < staircase(h/2) |', '|---|---|---|---|---|---|']
    for key, r in rows_with(record, 'verdict/'):
        fmt = lambda v: ', '.join('n/a' if x is None else f'{x:.2f}' for x in v)
        out.append(f'| {r["polarization"]} | {fmt(r["staircase_order_estimates"])} | {fmt(r["subpixel_order_estimates"])} | {verdict(r["subpixel_at_h_beats_staircase_at_h"])} | {r["subpixel_at_h_error_below_staircase_at_half_h"]} | {r["subpixel_at_h_wall_below_staircase_at_half_h"]} |')
    out += ['', 'Sub-cell shift of the centre along x at fixed h (max relative error at shifts 0, h/4, h/2; spread; per-wavelength width variation):', '',
            '| Polarization | Interface | Errors by shift | Spread | Width variation |', '|---|---|---|---:|---:|']
    for key, r in rows_with(record, 'shift/'):
        if key.endswith('/summary'):
            out.append(f'| {r["polarization"]} | {r["interface"]} | {", ".join(pct(v) for v in r["max_relative_error_by_shift"])} | {pct(r["max_relative_error_spread"])} | {pct(r["width_variation_relative"])} |')
    out += ['', 'Differentiable-solid transition width at fixed h through the standard TFSF solver (samples on the contour take the half value at a vanishing width):', '',
            '| Polarization | w / h | Max relative error | Difference from staircase | Samples differing from staircase |', '|---|---:|---:|---:|---:|']
    for key, r in sorted(rows_with(record, 'smoothing/'), key=lambda item: (item[1]['polarization'], item[1]['width_fraction'])):
        out.append(f'| {r["polarization"]} | {r["width_fraction"]:g} | {pct(r["max_relative_error"])} | {pct(r["max_relative_difference_from_staircase"])} | {r["samples_differing_from_staircase"]} |')
    return out


RENDERERS = {'G3-04': render_g3_04, 'G3-05': render_g3_05, 'G3-08': render_g3_08, 'G3-13': render_g3_13}
SUMMARY_KEYS = ('mesh_um', 'backend', 'precision', 'interface', 'polarization', 'angle_deg', 'wavelength_um', 'radius_um', 'duration_fs',
                'max_relative_error', 'max_scattering_relative_error', 'max_absorption_relative_error', 'max_efficiency_error',
                'max_dominant_phase_error_rad', 'efficiency_sum', 'peak_relative_error', 'fwhm_relative_error', 'layer_a_max_relative_difference',
                'layer_a_rtol', 'inner_outer_scattering_max_difference_over_band_maximum', 'subpixel_at_h_beats_staircase_at_h',
                'staircase_order_estimates', 'subpixel_order_estimates', 'max_relative_error_spread', 'max_relative_difference_from_staircase',
                'width_fraction', 'zero_order_transmission', 'zero_order_limit', 'failures')


def summary(task, record):
    """Compact observed metrics for record_gate_evidence.py --observed: the scalar metrics of every row."""
    rows = {key: {k: v for k, v in row.items() if k in SUMMARY_KEYS} for key, row in record['rows'].items()}
    return dict(task=task, case_id=record['case_id'], generated=record['generated'], full_mode=record['full_mode'],
                environment=record['environment'], rows=rows)


def main():
    import argparse
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument('--tasks', nargs='+', default=list(RENDERERS), help='tasks to render (default: all with a record)')
    args = parser.parse_args()
    text = DOC.read_text(encoding='utf-8') if DOC.exists() else HEADER
    for task, renderer in RENDERERS.items():
        record = load(task) if task in args.tasks else None
        if record is None:
            continue
        (RECORDS/f'{task}_observed.json').write_text(json.dumps(summary(task, record), indent=1)+'\n', encoding='utf-8', newline='\n')
        body = f'<!-- g3-b:{task} begin -->\n'+'\n'.join(renderer(record))+f'\n<!-- g3-b:{task} end -->'
        pattern = re.compile(rf'<!-- g3-b:{task} begin -->.*?<!-- g3-b:{task} end -->', re.S)
        text = pattern.sub(lambda _: body, text) if pattern.search(text) else text.rstrip('\n')+'\n\n'+body+'\n'
    DOC.write_text(text if text.endswith('\n') else text+'\n', encoding='utf-8', newline='\n')
    print('rendered', DOC)


if __name__ == '__main__':
    main()
