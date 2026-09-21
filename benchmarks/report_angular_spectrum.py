"""Render the angular-spectrum validation tables into docs/ANGULAR_SPECTRUM.md from the recorded JSON."""
import json
from pathlib import Path

DATA = Path('docs/validation/angular-spectrum-3060.json')
DOC = Path('docs/ANGULAR_SPECTRUM.md')
START, END = '<!-- angular-spectrum-validation:start -->', '<!-- angular-spectrum-validation:end -->'


def analytic_tables(a):
    rows = ['| Waist / wavelength | Rayleigh range (um) | Error at 0.5 z_R | at z_R | at 2 z_R |', '|---:|---:|---:|---:|---:|']
    for w in a['waist_series']:
        rows.append(f"| {w['w0_over_wavelength']:g} | {w['rayleigh_um']:.2f} | " + ' | '.join(f'{e:.2e}' for e in w['errors']) + ' |')
    t = a['tilted_spacing_series']
    tilt = ['| Spacing / wavelength | Samples | Largest representable angle (deg) | Error at z_R |', '|---:|---:|---:|---:|']
    for r in t['rows']:
        tilt.append(f"| {r['spacing_over_wavelength']:g} | {r['samples']} | {r['max_angle_deg']:.1f} | {r['error']:.2e} |")
    return ('\n'.join(rows), '\n'.join(tilt), t['nyquist_spacing_over_wavelength'], t['w0_over_wavelength'], t['tilt_deg'],
            a['plane_wave']['error'], a['plane_wave']['distance_um'])


def green_tables(g):
    d = g['dipole']
    dipole = ['| Point (um) | Height above the plane (um) | ASM vs exact | Closed box vs exact | ASM vs closed box |', '|---|---:|---:|---:|---:|']
    for p, h, a, n, an in zip(d['points_um'], d['height_above_plane_um'], d['asm_vs_exact'], d['nearzone_vs_exact'], d['asm_vs_nearzone']):
        dipole.append(f"| ({p[0]:g}, {p[1]:g}, {p[2]:g}) | {h:.2f} | {a:.2e} | {n:.2e} | {an:.2e} |")
    b = g['beam']
    beam = ['| Point (um) | Height above the plane (um) | ASM pad 2 vs closed box | ASM pad 4 vs closed box | ASM pad 4 vs exact | Closed box vs exact |', '|---|---:|---:|---:|---:|---:|']
    for i, (p, h) in enumerate(zip(b['points_um'], b['height_above_plane_um'])):
        beam.append(f"| ({p[0]:g}, {p[1]:g}, {p[2]:.2f}) | {h:.2f} | {b['pad_2']['asm_vs_nearzone'][i]:.2e} | {b['pad_4']['asm_vs_nearzone'][i]:.2e} | "
                    f"{b['pad_4']['asm_vs_exact'][i]:.2e} | {b['nearzone_vs_exact'][i]:.2e} |")
    return '\n'.join(dipole), '\n'.join(beam), d['plane'], b['plane'], b['waist_um']


def metalens_tables(m):
    planes = ['| Distance from the plane (um) | Lens: intensity error | Lens: peak ratio ASM / FDTD | Beam alone: intensity error |', '|---:|---:|---:|---:|']
    for lens, empty in zip(m['planes'], m['empty']['planes']):
        planes.append(f"| {lens['distance_um']:g} | {lens['intensity_error']:.4f} | {lens['peak_ratio']:.3f} | {empty['intensity_error']:.4f} |")
    runs = m['runs']
    def bytes_of(r):
        return f"{r['peak_torch_bytes']:,}" if r.get('peak_torch_bytes') is not None else 'not measured (CPU)'
    through, short = runs['through_focus'], runs['to_plane']
    cost = ['| Run | Grid | Cells | Steps | Wall (s) | Peak Torch bytes |', '|---|---|---:|---:|---:|---:|',
            f"| FDTD through the focus | {' x '.join(str(v) for v in through['shape'])} | {through['cells']:,} | {through['steps']} | {through['wall_seconds']:.1f} | {bytes_of(through)} |",
            f"| FDTD to the output plane | {' x '.join(str(v) for v in short['shape'])} | {short['cells']:,} | {short['steps']} | {short['wall_seconds']:.1f} | {bytes_of(short)} |",
            f"| ASM volume, {runs['asm_volume']['bytes']['planes']} planes | padded {' x '.join(str(v) for v in runs['asm_volume']['bytes']['padded_shape'])} | | | {runs['asm_volume']['wall_seconds']:.3f} | {bytes_of(runs['asm_volume'])} |"]
    if 'asm_section' in runs:
        cost.append(f"| ASM section, {runs['asm_section']['planes']} planes | | | | {runs['asm_section']['wall_seconds']:.3f} | {bytes_of(runs['asm_section'])} |")
    s = m['section']
    if 'focus_fdtd' in s:
        focus = ['| | FDTD section monitor | ASM section |', '|---|---:|---:|',
                 f"| Peak intensity position above the plane (um) | {s['focus_fdtd']['z_um']:.3f} | {s['focus_asm']['z_um']:.3f} |",
                 f"| Transverse position of the peak (um) | {s['focus_fdtd']['a_um']:.3f} | {s['focus_asm']['a_um']:.3f} |",
                 f"| FWHM along x at the peak (um) | {s['focus_fdtd']['fwhm_um']:.3f} | {s['focus_asm']['fwhm_um']:.3f} |",
                 f"| Peak intensity ratio ASM / FDTD | | {s['focus_asm']['peak_intensity'] / s['focus_fdtd']['peak_intensity']:.4f} |"]
        section_error = s['intensity_error']
    else:
        f, a, fine = s['focus_fdtd_from_recorded_planes'], s['focus_asm_at_that_plane'], s['focus_asm']
        focus = ['| | FDTD recorded planes | ASM at the same plane | ASM on a 0.05 um z grid |', '|---|---:|---:|---:|',
                 f"| Peak intensity position above the plane (um) | {f['z_um']:.3f} | {a['z_um']:.3f} | {fine['z_um']:.3f} |",
                 f"| FWHM along x at the peak (um) | {f['fwhm_um']:.3f} | {a['fwhm_um']:.3f} | {fine['fwhm_um']:.3f} |",
                 f"| Peak intensity ratio to the FDTD plane | | {a['peak_intensity'] / f['peak_intensity']:.4f} | {fine['peak_intensity'] / f['peak_intensity']:.4f} |"]
        section_error = None
    return '\n'.join(planes), '\n'.join(cost), '\n'.join(focus), section_error


def render():
    r = json.loads(DATA.read_text(encoding='utf-8'))
    waist, tilt, nyquist, w0, angle, wave_error, wave_distance = analytic_tables(r['analytic'])
    dipole, beam, dipole_plane, beam_plane, waist_um = green_tables(r['green_function'])
    m3, m2, p = r['metalens_3d'], r['metalens_2d'], r['performance']
    planes3, cost3, focus3, section3 = metalens_tables(m3)
    planes2, cost2, focus2, _ = metalens_tables(m2)
    parts = [START, '',
             f"Recorded by `python -m benchmarks.angular_spectrum --device cuda` on {r['gpu']} (PyTorch {r['torch']}) into "
             '[angular-spectrum-3060.json](validation/angular-spectrum-3060.json); the 2D comparison inside it ran on the CPU. '
             'The GPU was shared with other jobs while the times were taken.', '',
             '### Closed-form beams', '',
             'Gaussian beam waist on the plane (0.25 wavelength spacing, 256 samples per axis, pad 2), section through the axis against the '
             'paraxial closed form. The transform is exact for these band-limited fields, so what remains is the paraxial error, which falls '
             'fourfold when the waist doubles:', '', waist, '',
             f"A beam of waist {w0:g} wavelengths tilted by {angle:g} degrees at one Rayleigh range. Its carrier needs a spacing below "
             f"{nyquist:.2f} wavelengths; above that the plane cannot hold the tilt and the transform aliases:", '', tilt, '',
             f"A tilted plane wave commensurate with the unpadded grid propagated {wave_distance:g} um reproduces exp(i k_n d) with relative error {wave_error:.1e}.", '',
             '### Single-plane ASM against the closed-box Green function', '',
             f"A vector dipole 0.55 um below its top face; the ASM plane is {dipole_plane}. The dipole field decays only as 1/r, so a finite "
             'plane truncates it and the single-plane result drifts away from the plane while the closed box stays at the quadrature floor:', '',
             dipole, '',
             f"A Gaussian-apodized Huygens sheet of waist {waist_um:.2f} um radiating toward +z, {beam_plane}: a compact top-face field, "
             'where the single plane agrees with the closed box at the level of both quadratures:', '', beam, '',
             '### Metalens: FDTD through the focus against FDTD to the plane plus ASM (3D)', '',
             f"{m3['pillars']} silicon (index {m3['index']:g}) cylinders of height {m3['height_um']:g} um on a {m3['period_um']:g} um lattice inside a "
             f"{m3['aperture_um']:g} um aperture, hyperbolic phase for f = {m3['focal_um']:g} um at 1.55 um, {m3['mesh_um']:g} um mesh; the library covers "
             f"{m3['phase_range_rad']:.2f} rad and the lens needs {m3['required_phase_rad']:.2f} rad. The sheet source is the aperture, the interior is "
             f"{m3['margin_um']:g} um wider on every side, the output plane lies {m3['plane_above_top_um']:g} um above the pillar tops, and the ASM uses pad {m3['pad']}. "
             f"The two FDTD grids agree on the output plane itself to {m3['runs']['plane_agreement']:.1e} (beam alone {m3['empty']['runs']['plane_agreement']:.1e}). "
             'Intensity errors are relative L2 of |E|^2 over the recorded plane:', '', planes3, '',
             f"Over the whole xz section monitor ({len(m3['section']['z_um'])} planes) the intensity error is {section3:.4f}. The focus from both sections:", '',
             focus3, '', 'Cost of the two routes:', '', cost3, '',
             '### The same comparison in 2D on the CPU', '',
             f"{m2['pillars']} silicon slabs, {m2['mesh_um']:g} um mesh, otherwise the same layout; the FDTD focus comes from planes recorded every 0.5 um.", '',
             planes2, '', focus2, '', cost2, '',
             '### Performance target', '',
             f"A synthetic {p['plane'][0]} x {p['plane'][1]} plane at {p['spacing_um']:g} um spacing ({p['aperture_radius_um']:g} um aperture radius, "
             f"hyperbolic phase for f = {p['focal_um']:g} um, three wavelengths, complex64, {p['near_field_bytes'] / 2**20:.0f} MiB of near field) "
             f"propagated to {p['planes']} planes on {p['device']}: xz section of Ex, Ey and Ez.", '',
             '| Pass | Wall (s) | Peak Torch CUDA bytes |', '|---|---:|---:|',
             f"| first call | {p['warmup']['wall_seconds']:.1f} | {p['warmup']['peak_torch_bytes']:,} |",
             f"| second call | {p['section']['wall_seconds']:.1f} | {p['section']['peak_torch_bytes']:,} |", '',
             f"The section is {' x '.join(str(v) for v in p['section']['shape'])}; its peak lies {p['focus']['z_um']:.1f} um from the plane with a "
             f"{p['focus']['fwhm_um']:.2f} um FWHM. The full volume of the same three components would need "
             f"{p['volume_estimate']['output_bytes'] / 2**30:.0f} GiB, which `propagate_volume` refuses under any smaller budget; "
             'its working set is ' + f"{p['volume_estimate']['working_bytes'] / 2**20:.0f} MiB.", '', END]
    text = DOC.read_text(encoding='utf-8')
    start, end = text.index(START), text.index(END) + len(END)
    DOC.write_text(text[:start] + '\n'.join(parts) + text[end:], encoding='utf-8', newline='\n')
    print('Rendered validation tables into', DOC)


if __name__ == '__main__':
    render()
