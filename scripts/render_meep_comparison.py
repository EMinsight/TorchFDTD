"""Render docs/MEEP_COMPARISON.md and the README "Compared with Meep" block from the Meep comparison records.

Every number in both outputs is read from docs/validation/meep_comparison/*.json (the solver records
and the comparison files written by examples/meep_comparison/<name>/compare.py); the prose here only
names the devices, the run commands and the fairness limits. Run after the records change:

    python scripts/render_meep_comparison.py

Timing: for each solver record <name>_<solver>.json the script uses <name>_<solver>_timing.json when
that file exists and its timing_mode is "timing" (the maintainer's --timing rerun); otherwise the
development record is used and the tables say so. The README block between
<!-- meep-comparison:start --> and <!-- meep-comparison:end --> is replaced in place, or inserted
after the "How much faster" section when absent, so the script is idempotent.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT / 'docs' / 'validation' / 'meep_comparison'
OUTPUT = ROOT / 'docs' / 'MEEP_COMPARISON.md'
README = ROOT / 'README.md'
START = '<!-- meep-comparison:start -->'
END = '<!-- meep-comparison:end -->'

WSL = ('From the repository root inside the WSL2 distribution `torchfdtd-bench` (on Windows: '
       '`wsl.exe -d torchfdtd-bench -- bash -lc "<command>"`); `compare.py` needs only numpy, scipy and matplotlib.')
MEEP_CMD = ('OMP_NUM_THREADS=1 '
            'mpirun -np 4 python ')
TORCH_CMD = 'PYTHONPATH=$PWD python '


def load(name):
    return json.loads((RECORDS / f'{name}.json').read_text(encoding='utf-8'))


def load_timing(name, solver):
    """The timing-mode record when the maintainer has written one, else the development record."""
    timed = RECORDS / f'{name}_{solver}_timing.json'
    if timed.is_file():
        record = json.loads(timed.read_text(encoding='utf-8'))
        if record.get('timing', {}).get('timing_mode') == 'timing':
            return record, timed.name
    return load(f'{name}_{solver}'), f'{name}_{solver}.json'


def load_records():
    out = {}
    for stem in ('microring', 'metagrating', 'metalens_2d', 'metalens_3d'):
        out[stem] = {'torchfdtd': load(f'{stem}_torchfdtd'), 'meep': load(f'{stem}_meep')}
        for solver in ('torchfdtd', 'meep'):
            out[stem][f'{solver}_timing'], out[stem][f'{solver}_timing_file'] = load_timing(stem, solver)
    out['microring']['comparison'] = load('microring_comparison')
    out['metagrating']['comparison'] = load('metagrating_comparison')
    out['metagrating']['rcwa'] = load('metagrating_rcwa')
    comparison = load('metalens_comparison')
    out['metalens_2d']['comparison'] = comparison['2d']
    out['metalens_3d']['comparison'] = comparison['3d']
    return out


def table(header, rows):
    lines = ['| ' + ' | '.join(header) + ' |', '|' + '|'.join('---' for _ in header) + '|']
    lines += ['| ' + ' | '.join(str(c) for c in row) + ' |' for row in rows]
    return '\n'.join(lines)


def cell_count(grid):
    cells = grid['cells']
    if isinstance(cells, list):
        n = 1
        for c in cells:
            n *= int(c)
        return n
    return int(cells)


def cells_per_axis(grid):
    cells = grid.get('shape', grid['cells'])
    cells = [int(c) for c in cells if int(c) > 1]
    return ' x '.join(str(c) for c in cells)


def load_note(timing):
    note = timing.get('host_load_note', '')
    return note['note'] if isinstance(note, dict) else note


def verdict(ok):
    return 'pass' if ok else '**FAIL**'


def timing_summary(rec):
    """Stepping seconds, ranks, mode and load note of the two solver runs, from the chosen timing records."""
    t, m = rec['torchfdtd_timing']['timing'], rec['meep_timing']['timing']
    ranks = rec['meep_timing']['environment']['mpi_processes']
    gpu = rec['torchfdtd_timing']['environment']['gpu']['name']
    return dict(
        cells=cell_count(rec['torchfdtd']['grid']), steps=int(rec['torchfdtd']['grid']['steps']),
        t_step=float(t['stepping_seconds']), t_full=float(t['full_seconds']),
        m_step=float(m['stepping_seconds']), m_full=float(m['full_seconds']),
        ratio=float(m['stepping_seconds']) / float(t['stepping_seconds']),
        ranks=int(ranks), gpu=gpu,
        t_mode=t['timing_mode'], m_mode=m['timing_mode'],
        t_note=load_note(t), m_note=load_note(m),
        t_file=rec['torchfdtd_timing_file'], m_file=rec['meep_timing_file'])


def mode_text(mode):
    return 'development run, shared host' if mode == 'development' else 'timed run (`--timing`, median of three)'


def timing_table(s):
    rows = [(f'{s["cells"]:,}', f'{s["steps"]:,}',
             f'{s["t_step"]:.2f} ({s["t_full"]:.2f} full)', f'{s["m_step"]:.2f} ({s["m_full"]:.2f} full)',
             s['ranks'], f'{s["ratio"]:.1f}', mode_text(s['t_mode']) if s['t_mode'] == s['m_mode'] else f'{mode_text(s["t_mode"])} / {mode_text(s["m_mode"])}')]
    text = table(['Cells', 'Steps', f'TorchFDTD stepping (s), {s["gpu"]}', 'Meep stepping (s), CPU', 'Meep ranks', 'Ratio Meep / TorchFDTD', 'Timing mode'], rows)
    text += (f'\n\nLoad condition, TorchFDTD (`{s["t_file"]}`): {s["t_note"]}\n\n'
             f'Load condition, Meep (`{s["m_file"]}`): {s["m_note"]}')
    return text


def fixture_table(rec, extra=()):
    t, m = rec['torchfdtd'], rec['meep']
    g = t['grid']
    rows = [('Cells per axis', cells_per_axis(g)), ('Cells', f'{cell_count(g):,}'), ('Mesh (um)', g['mesh_um']),
            ('Time step (s)', f'{g["dt_s"]:.6e}'), ('Courant number', f'{g["courant_number"]:.6f}'), ('Steps', f'{int(g["steps"]):,}'),
            ('Absorber (cells)', f'{g["pml_cells"]} (TorchFDTD CPML, Meep PML; the thickness is the only shared parameter)'),
            ('Precision', f'TorchFDTD {g["precision"]}, Meep {m["grid"]["precision"]}'),
            ('Geometry file sha256', t['geometry_sha256'][:12] + ' (both records)')]
    rows += list(extra)
    return table(['Fixture', 'Value'], rows)


def commands(example, torch_args, meep_args):
    return '\n'.join(['```bash', f'{TORCH_CMD}examples/meep_comparison/{example}/torchfdtd_{example}.py{torch_args}',
                      f'{MEEP_CMD}examples/meep_comparison/{example}/meep_{example}.py{meep_args}',
                      f'python examples/meep_comparison/{example}/compare.py', '```'])


# ---------------------------------------------------------------------------------------------- microring

def microring(rec):
    c = rec['comparison']
    cr = c['criteria']
    t_res, m_res = c['nearest_1550']['torchfdtd'], c['nearest_1550']['meep']
    src = rec['torchfdtd']['source']
    rows = [
        ('Resonances found in the band', cr['resonance_wavelength_nm']['count']['torchfdtd'], cr['resonance_wavelength_nm']['count']['meep'],
         'same count', 'same count', verdict(cr['resonance_wavelength_nm']['count']['torchfdtd'] == cr['resonance_wavelength_nm']['count']['meep'])),
        ('Resonance wavelengths, max abs difference (nm)', '-', '-', f'{cr["resonance_wavelength_nm"]["value"]:.1e}',
         f'<= {cr["resonance_wavelength_nm"]["limit"]}', verdict(cr['resonance_wavelength_nm']['passed'])),
        (f'Resonance nearest {src["wavelength_um"]} um, centre (nm)', f'{t_res["center_nm"]:.3f}', f'{m_res["center_nm"]:.3f}',
         f'{abs(t_res["center_nm"] - m_res["center_nm"]):.1e}', f'<= {cr["resonance_wavelength_nm"]["limit"]}', verdict(cr['resonance_wavelength_nm']['passed'])),
        ('Loaded Q of that resonance (Lorentzian fit)', f'{t_res["q_loaded"]:.1f}', f'{m_res["q_loaded"]:.1f}',
         f'{cr["q_relative"]["value"]:.1e} relative', f'<= {cr["q_relative"]["limit"]} relative', verdict(cr['q_relative']['passed'])),
        ('Extinction ratio of that resonance (dB)', f'{t_res["extinction_db"]:.3f}', f'{m_res["extinction_db"]:.3f}',
         f'{cr["extinction_db"]["value"]:.1e}', f'<= {cr["extinction_db"]["limit"]}', verdict(cr['extinction_db']['passed'])),
        ('Free spectral range (nm)', f'{c["fsr_nm"]["torchfdtd"]:.2f}', f'{c["fsr_nm"]["meep"]:.2f}',
         f'{abs(c["fsr_nm"]["torchfdtd"] - c["fsr_nm"]["meep"]):.1e}', 'reported', '-'),
        ('RMS of T_torchfdtd - T_meep over the band', '-', '-', f'{cr["rms_T"]["value"]:.2e}', f'<= {cr["rms_T"]["limit"]}', verdict(cr['rms_T']['passed'])),
        ('Max abs T_torchfdtd - T_meep', '-', '-', f'{c["max_abs_T_difference"]:.2e}', 'reported', '-'),
        ('Grid, dt, steps, PML, geometry and staircase hash', c['staircase']['torchfdtd']['interior_ez_epsilon_sha256'][:12],
         c['staircase']['meep']['interior_ez_epsilon_sha256'][:12], '-', 'equal', verdict(cr['grid_match']['passed'])),
    ]
    agreement = table(['Quantity', 'TorchFDTD', 'Meep', 'Difference', 'Criterion', 'Result'], rows)
    passed = sum(1 for k in cr if cr[k]['passed'])
    s = timing_summary(rec)
    device = (f'A 2D microring resonator side-coupled to a straight bus waveguide, out-of-plane E field (Ez), excited by one '
              f'Gaussian pulse centred at {src["wavelength_um"]} um ({src["pulse_cycles"]:.0f} cycles) on an Ez line across the bus; '
              f'the observable is the through-port transmission T = out-plane flux of the ring run over the same flux of a '
              f'straight-bus run of the same solver, on {len(rec["torchfdtd"]["wavelength_um"])} wavelength samples. '
              f'The ring, bus, gap and index values are in the example README and `geometry.json`.')
    extra = [('Run time (ps)', f'{rec["torchfdtd"]["grid"]["run_time_ps"]:.3f}'),
             ('Interior core Ez nodes (staircase)', f'{c["staircase"]["torchfdtd"]["interior_core_nodes"]:,} (both records)')]
    fairness = [
        'Identical and proven by the records: the geometry file (sha256), the Yee grid, dt, Courant number and step count, the '
        'staircase permittivity at every interior Ez node (one sha256 in both records), the source nodes and weights, the monitor '
        'columns and rows, the frequency samples and the DFT window (whole run, no apodization).',
        f'Different by construction: the absorber formulation (TorchFDTD CPML with a cubic sigma profile, Meep stretched-coordinate '
        f'PML with a quadratic profile; {rec["torchfdtd"]["grid"]["pml_cells"]} cells in both), the stepping precision '
        f'(TorchFDTD {rec["torchfdtd"]["grid"]["precision"]} with float64 DFT accumulators, Meep {rec["meep"]["grid"]["precision"]}) '
        'and the flux quadrature on the monitor plane (TorchFDTD interpolates E and H to cell midpoints, Meep integrates over the '
        'Ez nodes with end weights); these cancel in the ratio T.',
        'No symmetry planes, no subpixel averaging, no coarse-then-fine in either solver.']
    return dict(key='microring', title='Microring resonator', folder='microring', device=device, fixture=fixture_table(rec, extra),
                agreement=agreement, criteria_passed=passed, criteria_total=len(cr), all_passed=bool(c['all_passed']), timing=s,
                figure='microring.png', figure_caption='Through-port transmission of both solvers overlaid, with the difference',
                commands=commands('microring', '', ' --ranks 4'), fairness=fairness,
                headline=f'resonance wavelengths, max difference {cr["resonance_wavelength_nm"]["value"]:.1e} nm (limit {cr["resonance_wavelength_nm"]["limit"]} nm)',
                readme_device='2D microring resonator with a bus waveguide (Ez)')


# ---------------------------------------------------------------------------------------------- metalens

def metalens_part(rec, part):
    c = rec['comparison']
    rows = []
    for r in c['criteria_rows']:
        if r['unit'] == 'um':
            diff, crit = f'{r["difference"]:.2e} um', f'<= {r["limit"]} um'
        elif r['unit'] == 'relative':
            diff, crit = f'{r["difference"]:.2e} relative', f'<= {r["limit"]} relative'
        elif r['unit'] == 'relative to the peak':
            diff, crit = f'{r["difference"]:.2e} of the peak', f'<= {r["limit"]} of the peak'
        else:
            diff, crit = f'{r["difference"]:.2e}', f'<= {r["limit"]}'
        rows.append((r['label'], f'{r["torchfdtd"]:.4f}', f'{r["meep"]:.4f}', diff, crit, verdict(r['pass'])))
    for r in c['information_rows']:
        rows.append((r['label'], f'{r["torchfdtd"]:.4f}', f'{r["meep"]:.4f}', f'{r["difference"]:.2e}', 'information', '-'))
    grid_ok = c['grid_agreement']['all']
    rows.append(('Cells, dt, steps, PML, geometry sha256, silicon staircase counts, source support', '-', '-', '-', 'equal', verdict(grid_ok)))
    agreement = table(['Metric', 'TorchFDTD', 'Meep', 'Difference', 'Criterion', 'Result'], rows)
    passed = sum(1 for r in c['criteria_rows'] if r['pass'])
    efficiency = next(r for r in c['criteria_rows'] if r['name'] == 'efficiency')
    s = timing_summary(rec)
    src = rec['torchfdtd']['source']['waveform']
    wl = src['wavelength_um']
    if part == '2d':
        device = (f'A 2D cylindrical lens of silicon ridges in air, Ez polarisation, illuminated by a {src["pulse_cycles"]}-cycle Gaussian '
                  f'plane-wave pulse centred at {wl} um from below; the focal line and the on-axis line are DFT monitors, and every '
                  f'quantity is a ratio to a bare-cell run of the same solver. Aperture, focal length, pitch and ridge widths are in the '
                  f'example README and `geometry.json`.')
        title, key, readme_device = '2D ridge lens (Part A)', 'metalens_2d', '2D silicon ridge metalens (Ez)'
    else:
        device = (f'A 3D lens of silicon cylinders on a square grid, x-polarised {src["pulse_cycles"]}-cycle plane-wave pulse centred at '
                  f'{wl} um from below; the focal plane and the xz and yz sections are DFT monitors, and every quantity is a ratio to a '
                  f'bare-cell run of the same solver. Aperture, pillar radii and pitch are in the example README and `geometry_3d.json`.')
        title, key, readme_device = '3D pillar lens (Part B)', 'metalens_3d', '3D silicon pillar metalens (Ex)'
    sil = c['grid_agreement']['silicon_cells_per_component']['torchfdtd']
    extra = [('Silicon Yee samples (staircase)', ', '.join(f'{k} {v:,}' for k, v in sil.items()) + ' (TorchFDTD; Meep equal where recorded)')]
    fairness = [
        'Identical and proven by the records: the geometry file (sha256), cells, mesh, dt, step count, the absorber thickness in cells, '
        'the source support with its boundary weights, the silicon sample counts per component, the monitor points and the three DFT '
        'frequencies; the reductions (peak, FWHM, windowed Poynting power) are one shared function set applied to both records.',
        f'Different by construction: the absorber formulation (CPML with a cubic profile against Meep PML with a quadratic profile; '
        f'{rec["torchfdtd"]["grid"]["pml_cells"]} cells in both) and the stepping precision (TorchFDTD {rec["torchfdtd"]["grid"]["precision"]}, '
        f'Meep {rec["meep"]["grid"]["precision"]}).',
        'No symmetry planes, no subpixel smoothing, no coarse-then-fine in either solver.']
    return dict(key=key, title=f'Metalens: {title}', folder='metalens', device=device, fixture=fixture_table(rec, extra), agreement=agreement,
                criteria_passed=passed, criteria_total=len(c['criteria_rows']), all_passed=bool(c['all_pass']), timing=s,
                figure='metalens.png', figure_caption='Focal-plane profiles and on-axis intensity of both parts, both solvers overlaid',
                commands=commands('metalens', f' --part {part}', f' --part {part} --ranks 4'), fairness=fairness,
                headline=f'focusing efficiency, difference {efficiency["difference"]:.1e} (limit {efficiency["limit"]})',
                readme_device=readme_device)


# ---------------------------------------------------------------------------------------------- metagrating

def metagrating(rec):
    c = rec['comparison']
    metrics = c['metrics']
    labels = {'torchfdtd_vs_meep_order_efficiency': 'Order efficiencies, max abs TorchFDTD - Meep over the band',
              'torchfdtd_vs_rcwa_order_efficiency': 'Order efficiencies, max abs TorchFDTD - RCWA over the band',
              'meep_vs_rcwa_order_efficiency': 'Order efficiencies, max abs Meep - RCWA over the band',
              'torchfdtd_energy_balance': 'Energy balance, max abs (sum of orders - 1), TorchFDTD',
              'meep_energy_balance': 'Energy balance, max abs (sum of orders - 1), Meep'}
    rows = []
    for name, m in metrics.items():
        where = f'{m["at_wavelength_um"]} um' + (f', {m["at_order"]}' if 'at_order' in m else '')
        rows.append((labels[name], f'{m["value"]:.2e}', where, f'<= {m["limit_abs"]}', verdict(m['passed'])))
    rows.append(('Cells, dt, steps, PML, geometry sha256, staircase, monitor positions', '-', '-', 'equal', verdict(c['all_grid_checks_passed'])))
    agreement = table(['Criterion', 'Measured', 'Where', 'Limit', 'Result'], rows)
    wl = c['criteria']['design_wavelength_um']
    i = c['design_index']
    orders = c['orders']
    eff_rows = []
    for kind in ('T', 'R'):
        for o in orders:
            key = str(o)
            tv, mv, rv = c['efficiencies']['torchfdtd'][kind][key][i], c['efficiencies']['meep'][kind][key][i], c['efficiencies']['rcwa'][kind][key][i]
            eff_rows.append((f'{kind}{o:+d} at {wl} um', f'{tv:.4f}', f'{mv:.4f}', f'{rv:.4f}', f'{tv - mv:+.1e}', f'{tv - rv:+.1e}'))
    efficiencies = table(['Order', 'TorchFDTD', 'Meep', 'RCWA', 'TorchFDTD - Meep', 'TorchFDTD - RCWA'], eff_rows)
    passed = sum(1 for m in metrics.values() if m['passed'])
    s = timing_summary(rec)
    band = c['criteria']['band_um']
    device = (f'A 2D beam-deflecting metagrating: two silicon ridges per period on a silica half-space, Ez polarisation, normal incidence from '
              f'the substrate, periodic in x; the DFT lines in the substrate and in air are decomposed into the {", ".join(f"{o:+d}" for o in orders)} '
              f'diffraction orders by one Fourier routine applied to both records, on {c["criteria"]["band_points"]} wavelengths from '
              f'{band[0]} to {band[1]} um, each order a ratio to the incident power of a bare-substrate run of the same solver. TORCWA '
              f'{rec["rcwa"]["package"]["torcwa"]} (RCWA, {rec["rcwa"]["harmonics"]} harmonics) supplies a grid-free third answer.')
    fairness = [
        'Identical and proven by the records: the geometry file (sha256), cells, dt, steps, the absorber thickness in cells, the silicon '
        'staircase read back from each solver\'s own permittivity array, the pulse (max difference between the TorchFDTD waveform and the shared function '
        f'{rec["torchfdtd"]["grid"]["waveform_max_abs_difference"]}), the DFT line positions and the frequency samples.',
        f'Different by construction: the absorber formulation (CPML with a cubic profile against Meep PML with a quadratic profile; '
        f'{rec["torchfdtd"]["grid"]["pml_cells"]} cells in both) and the stepping precision (TorchFDTD {rec["torchfdtd"]["grid"]["precision"]} '
        f'with {rec["torchfdtd"]["grid"]["dft_precision"]} DFT accumulation, Meep {rec["meep"]["grid"]["precision"]}).',
        'The RCWA record is a different method (Fourier-series geometry, no grid, no time stepping) and is held to its own, wider limit.']
    return dict(key='metagrating', title='Metagrating with an RCWA oracle', folder='metagrating', device=device, fixture=fixture_table(rec),
                agreement=agreement + '\n\nOrder efficiencies at the design wavelength:\n\n' + efficiencies,
                criteria_passed=passed, criteria_total=len(metrics), all_passed=bool(c['all_criteria_passed']), timing=s,
                figure='metagrating.png', figure_caption='Diffraction-order efficiencies over the band for the three methods',
                commands=commands('metagrating', ' --out docs/validation/meep_comparison/metagrating_torchfdtd.json',
                                  ' --ranks 4 --out docs/validation/meep_comparison/metagrating_meep.json'), fairness=fairness,
                headline=f'order efficiencies, max difference {metrics["torchfdtd_vs_meep_order_efficiency"]["value"]:.1e} (limit {metrics["torchfdtd_vs_meep_order_efficiency"]["limit_abs"]})',
                readme_device='2D silicon metagrating on silica, with an RCWA oracle (Ez)')


def build(records):
    return [microring(records['microring']), metalens_part(records['metalens_2d'], '2d'), metalens_part(records['metalens_3d'], '3d'),
            metagrating(records['metagrating'])]


# ---------------------------------------------------------------------------------------------- outputs

def render_doc(records):
    sections = build(records)
    meep_version = records['microring']['meep']['environment']['meep']
    torch_version = records['microring']['torchfdtd']['environment']['torchfdtd']
    gpu = records['microring']['torchfdtd']['environment']['gpu']['name']
    cpu = records['microring']['meep']['environment']['cpu']
    out = ['# Compared with Meep', '',
           'Rendered by `scripts/render_meep_comparison.py` from the records in `docs/validation/meep_comparison/`; do not edit by hand. '
           'Each example sets up one device from one geometry file and runs it in TorchFDTD '
           f'({torch_version}, {gpu}, fused CUDA kernels) and in Meep {meep_version} (MPI ranks on the {cpu}) on the same grid, time step, '
           'step count, source, monitors and staircase material sampling; the agreement criteria were declared in each example\'s '
           '`criteria.json` before the first comparison run. The rules shared by the three examples are in '
           '[`examples/meep_comparison/BRIEF.md`](../examples/meep_comparison/BRIEF.md).', '',
           'Timing rows marked "development run, shared host" are single runs made while other jobs used the CPU and the GPU; they bound '
           'the solver time from above and are replaced by the maintainer\'s `--timing` rerun (one warm-up, three timed solves, Meep with '
           '12 ranks on a quiet host) once `<name>_<solver>_timing.json` records exist.', '',
           '## Summary', '',
           table(['Example', 'Cells x steps', 'Agreement (headline metric)', 'Criteria', 'TorchFDTD stepping (s)', 'Meep stepping (s), ranks', 'Ratio'],
                 [(f'[{s["title"]}](#{anchor(s["title"])})', f'{s["timing"]["cells"]:,} x {s["timing"]["steps"]:,}', s['headline'],
                   f'{s["criteria_passed"]}/{s["criteria_total"]} pass' if s['all_passed'] else f'**{s["criteria_passed"]}/{s["criteria_total"]} pass, see the section**',
                   f'{s["timing"]["t_step"]:.2f}', f'{s["timing"]["m_step"]:.2f}, {s["timing"]["ranks"]} ranks ({mode_text(s["timing"]["m_mode"])})',
                   f'{s["timing"]["ratio"]:.1f}') for s in sections]), '']
    for s in sections:
        out += [f'## {s["title"]}', '',
                f'Example folder: [`examples/meep_comparison/{s["folder"]}`](../examples/meep_comparison/{s["folder"]}) (README with the full fixture table, the two solver scripts, `compare.py`, `criteria.json`).', '',
                '### Device', '', s['device'], '',
                '### Fixture', '', s['fixture'], '',
                '### Agreement', '',
                f'Declared criteria: {s["criteria_passed"]} of {s["criteria_total"]} pass.' if s['all_passed'] else f'**Declared criteria: {s["criteria_passed"]} of {s["criteria_total"]} pass; the failing rows are marked FAIL below.**', '',
                s['agreement'], '',
                '### Timing', '', timing_table(s['timing']), '',
                '### Figure', '', f'![{s["figure_caption"]}](figures/meep_comparison/{s["figure"]})', '',
                f'{s["figure_caption"]}; rendered by `compare.py` from the records only.', '',
                '### Running it', '', WSL, '', s['commands'], '',
                'Both solver scripts take `--out <path>` and `--timing`; `--ranks 12` with `mpirun -np 12` for the maintainer\'s timed Meep run.', '',
                '### Fairness limits', '']
        out += [f'- {line}' for line in s['fairness']]
        out += ['']
    return '\n'.join(out).rstrip('\n') + '\n'


def anchor(title):
    return re.sub(r'[^a-z0-9 -]', '', title.lower()).replace(' ', '-')


def render_readme_block(records):
    sections = build(records)
    meep_version = records['microring']['meep']['environment']['meep']
    gpu = records['microring']['torchfdtd']['environment']['gpu']['name']
    rows = []
    for s in sections:
        t = s['timing']
        criteria = f'{s["criteria_passed"]}/{s["criteria_total"]} pass' if s['all_passed'] else f'**{s["criteria_passed"]}/{s["criteria_total"]} pass (FAIL)**'
        rows.append((f'[{s["readme_device"]}](examples/meep_comparison/{s["folder"]})', f'{t["cells"]:,} x {t["steps"]:,}',
                     f'{s["headline"]}; {criteria}', f'{t["t_step"]:.2f}',
                     f'{t["m_step"]:.2f} ({t["ranks"]} ranks; {mode_text(t["m_mode"])})', f'{t["ratio"]:.1f}'))
    lines = [START, '## Compared with Meep', '',
             f'Three devices were each set up once from one geometry file and run in TorchFDTD ({gpu}, float32, fused CUDA kernels) and in '
             f'Meep {meep_version} (CPU, float64, MPI) on the same grid, time step, step count, source, monitors and staircase material '
             'sampling, with the agreement criteria declared before the first comparison run. Every number in the table is read from the '
             'records in `docs/validation/meep_comparison/` by `scripts/render_meep_comparison.py`; the timing rows are development runs on a '
             'shared host (Meep with four ranks) until the maintainer\'s `--timing` rerun on a quiet host replaces them.', '',
             table(['Device', 'Cells x steps', 'Agreement versus its criterion', 'TorchFDTD GPU stepping (s)', 'Meep CPU stepping (s), 12 ranks when timed', 'Ratio'], rows), '',
             'Per-example device and fixture tables, all criteria, timing with load notes, figures, run commands and fairness limits: '
             '[docs/MEEP_COMPARISON.md](docs/MEEP_COMPARISON.md); the examples live under [examples/meep_comparison](examples/meep_comparison).',
             END]
    return '\n'.join(lines)


def update_readme(text, block):
    if START in text and END in text:
        head, rest = text.split(START, 1)
        _, tail = rest.split(END, 1)
        return head + block + tail
    marker = '\n## Execution modes'
    if '## How much faster' not in text or marker not in text:
        raise SystemExit('README.md has no "How much faster" section followed by "Execution modes"')
    i = text.index(marker, text.index('## How much faster'))
    return text[:i].rstrip('\n') + '\n\n' + block + '\n' + text[i:]


def main():
    records = load_records()
    OUTPUT.write_bytes(render_doc(records).encode('utf-8'))
    readme = README.read_bytes().decode('utf-8')
    README.write_bytes(update_readme(readme, render_readme_block(records)).encode('utf-8'))
    print(f'wrote {OUTPUT.relative_to(ROOT)} and the README block')


if __name__ == '__main__':
    main()
