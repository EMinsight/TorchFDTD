"""Judge and render a propagated beyond-VRAM record against its pre-declared cases.

Inputs are the driver record of benchmarks/beyond_vram_propagated.py, the case
files docs/validation/cases/G5-05.json and G5-06.json, and optionally the CSV
written by scripts/sample_system_counters.ps1 during the run. The output is a
sanitized evidence record (absolute machine paths dropped) with the criteria
verdicts, and a Markdown document rendered from that record alone.

python -m benchmarks.report_beyond_vram_propagated --record results/run.json --context workstation \
    --counters counters.csv --total-ram-gib 127.7 \
    --evidence docs/validation/beyond_vram_propagated_5880.json --output docs/BEYOND_VRAM_PROPAGATED.md
"""
import argparse
import hashlib
import json
from pathlib import Path

from benchmarks.report_beyond_vram_restart import load_counters, summarize_counters

CASES = ('docs/validation/cases/G5-05.json', 'docs/validation/cases/G5-06.json')
PRIVATE_ARGUMENTS = ('scratch', 'journal', 'output', 'artifacts')
MEMORY_KEYS = ('peak_torch_allocated_bytes', 'peak_torch_reserved_bytes', 'peak_process_rss_bytes',
               'peak_process_private_bytes', 'peak_device_in_use_bytes', 'machine_disk_read_bytes', 'machine_disk_write_bytes')


def sanitize(record):
    clean = json.loads(json.dumps(record))
    clean.pop('artifacts_directory', None)
    for key in PRIVATE_ARGUMENTS:
        if clean.get('arguments', {}).get(key):
            clean['arguments'][key] = '<redacted path>'
    for execution in clean.get('executions', {}).values():
        options = execution.get('options') or {}
        for key in ('state_directory', 'restart_directory', 'checkpoint_directory'):
            if options.get(key):
                options[key] = '<redacted path>'
        for phase in ('reservation',):
            execution.get(phase, {}).pop('restart_journal', None)
    for run in clean.get('runs', {}).values():
        run.get('report', {}).pop('restart_journal', None)
    return clean


def _criterion(name, value, limit, ok, unit='', case='G5-05'):
    return dict(name=name, value=value, limit=limit, unit=unit, passed=bool(ok), case=case)


def evaluate(record, cases, context):
    """Criteria verdicts of one record in one context ('rehearsal' or 'workstation'); nothing is rerun."""
    c05, c06 = cases['G5-05']['acceptance'], cases['G5-06']['acceptance']
    fixture = c05['fixture_of_record'][context]
    rows = []
    mode = 'streamed'
    execution = record['executions'][mode]
    forward = record['runs'][mode+'_forward']
    backward = execution['backward']
    rows.append(_criterion('grid equals the declared grid', record['grid'], fixture['grid'], record['grid'] == fixture['grid']))
    rows.append(_criterion('steps equal the declared steps', record['steps'], fixture['steps'], record['steps'] == fixture['steps']))
    rows.append(_criterion('E/H bytes at least the declared minimum', record['eh_bytes'], fixture['minimum_eh_bytes'], record['eh_bytes'] >= fixture['minimum_eh_bytes'], 'bytes'))
    p = c05['propagation']
    rows.append(_criterion('plane energy rises before its peak', forward['energy_rise_step'], forward['energy_peak_step'],
                           forward['energy_peak'] > 0 and forward['energy_rise_step'] < forward['energy_peak_step'], 'step'))
    rows.append(_criterion('plane energy decayed fraction at the final step', forward['energy_decayed_fraction'], p['energy_decayed_fraction_max'],
                           forward['energy_decayed_fraction'] is not None and forward['energy_decayed_fraction'] <= p['energy_decayed_fraction_max']))
    s = c05['spectrum']
    ratio = record['frequency_resolution_hz']/record['minimum_frequency_separation_hz']
    rows.append(_criterion('DFT resolution over the minimum wavelength separation', ratio, s['frequency_resolution_max_fraction_of_separation'],
                           ratio <= s['frequency_resolution_max_fraction_of_separation']))
    rows.append(_criterion('source amplitude ratio at the weakest declared wavelength', min(record['source_amplitude_ratio']), s['source_amplitude_ratio_min'],
                           min(record['source_amplitude_ratio']) >= s['source_amplitude_ratio_min']))
    g = c05['gradient']
    rows.append(_criterion('gradient finite', backward['gradient_finite'], True, backward['gradient_finite']))
    rows.append(_criterion('gradient nonzero entries', backward['gradient_nonzero'], 1, backward['gradient_nonzero'] >= 1, 'cells'))
    rows.append(_criterion('design-slab gradient norm positive', backward['design_slab_gradient_norm'], 0., backward['design_slab_gradient_norm'] > 0))
    fd = execution.get('fd')
    kind = g['finite_difference'][context]
    rows.append(_criterion('finite-difference kind', fd['kind'] if fd else None, kind['kind'], bool(fd) and fd['kind'] == kind['kind']))
    rows.append(_criterion('finite-difference step', fd['step'] if fd else None, g['finite_difference']['step'], bool(fd) and fd['step'] == g['finite_difference']['step']))
    rows.append(_criterion('finite-difference direction radius', execution['fd_radius_um'], g['finite_difference']['radius_um'], execution['fd_radius_um'] == g['finite_difference']['radius_um'], 'um'))
    rows.append(_criterion('finite-difference relative response', fd['relative_response'] if fd else None, g['finite_difference']['relative_response_min'],
                           bool(fd) and fd['relative_response'] >= g['finite_difference']['relative_response_min']))
    rows.append(_criterion('finite-difference relative error', fd['relative_error'] if fd else None, kind['relative_error_max'],
                           bool(fd) and fd['relative_error'] is not None and fd['relative_error'] <= kind['relative_error_max']))
    if context == 'rehearsal':
        a = c05['resident_agreement']
        comparison = record.get('comparison') or {}
        rows.append(_criterion('resident/streamed objective relative difference', comparison.get('objective_relative_difference'), a['objective_relative_difference_max'],
                               comparison.get('objective_relative_difference') is not None and comparison['objective_relative_difference'] <= a['objective_relative_difference_max']))
        rows.append(_criterion('resident/streamed design-slab gradient relative L2', comparison.get('design_slab_gradient_relative_l2'), a['design_slab_gradient_relative_l2_max'],
                               comparison.get('design_slab_gradient_relative_l2') is not None and comparison['design_slab_gradient_relative_l2'] <= a['design_slab_gradient_relative_l2_max']))
        resident_fd = record['executions'].get('resident', {}).get('fd')
        rows.append(_criterion('resident finite-difference relative error', resident_fd['relative_error'] if resident_fd else None, kind['relative_error_max'],
                               bool(resident_fd) and resident_fd['relative_error'] <= kind['relative_error_max']))
    b = c06['budget'][context]
    rows.append(_criterion('wall time of the driver', record.get('elapsed_seconds'), b['wall_seconds_max'],
                           record.get('elapsed_seconds') is not None and record['elapsed_seconds'] <= b['wall_seconds_max'], 's', case='G5-06'))
    writes = sum(run['memory']['machine_disk_write_bytes'] for run in record['runs'].values())+backward['memory']['machine_disk_write_bytes']
    rows.append(_criterion('machine disk writes over the run phases', writes, b['disk_write_bytes_max'], writes <= b['disk_write_bytes_max'], 'bytes', case='G5-06'))
    counters = record.get('system_counters')
    if counters is not None:
        rows.append(_criterion('integrated machine disk writes from the counters', counters['integrated_write_bytes'], b['disk_write_bytes_max'],
                               counters['integrated_write_bytes'] <= b['disk_write_bytes_max'], 'bytes', case='G5-06'))
    for phase, holder in (('forward', forward), ('backward', backward)):
        present = all(k in holder or k in holder['memory'] for k in MEMORY_KEYS)
        rows.append(_criterion(f'{phase} memory and disk measurements recorded separately', present, True, present, case='G5-06'))
    if context == 'workstation':
        v = c06['vram']
        rows.append(_criterion('physical VRAM recorded', record['environment'].get('physical_vram_bytes'), v['physical_vram_bytes_min'],
                               (record['environment'].get('physical_vram_bytes') or 0) >= v['physical_vram_bytes_min'], 'bytes', case='G5-06'))
        live = execution['reservation']['state_bank_capacity']*execution['reservation']['state_bytes']+execution['reservation']['dense_parameter_reservation_bytes']
        rows.append(_criterion('live adjoint state (checkpoint banks plus dense parameters) over physical VRAM', live/record['environment']['physical_vram_bytes'], 1.,
                               live > record['environment']['physical_vram_bytes'], case='G5-06'))
        rows.append(_criterion('E/H bytes over physical VRAM (reported, below one by design of the budget)', record['eh_bytes']/record['environment']['physical_vram_bytes'], None, True, case='G5-06'))
    rows.append(_criterion('driver stage complete', record.get('stage'), 'complete', record.get('stage') == 'complete', case='G5-06'))
    return dict(context=context, criteria=rows, all_passed=all(r['passed'] for r in rows),
                case_sha256={k: v for k, v in cases['sha256'].items()})


def load_cases(root):
    cases = {}
    hashes = {}
    for path in CASES:
        text = (Path(root)/path).read_bytes()
        case = json.loads(text.decode('utf-8'))
        cases[case['task']] = case
        hashes[case['task']] = hashlib.sha256(text).hexdigest()
    cases['sha256'] = hashes
    return cases


def gb(value):
    return '-' if value is None else f'{value/1e9:.2f} GB'


def seconds(value):
    return '-' if value is None else f'{value:.1f} s'


def render(evidence):
    r = evidence['record']
    verdict = evidence['verdict']
    fx = r['fixture']
    execution = r['executions']['streamed']
    forward = r['runs']['streamed_forward']
    backward = execution['backward']
    reservation = execution['reservation']
    env = r['environment']
    lines = ['# Beyond-VRAM propagated case: pillar-array lens, streamed plane adjoint', '',
             f"Context: **{verdict['context']}**, driver stage `{r['stage']}`, recorded {r.get('execution_timestamp', '-')} on {env.get('hardware')} "
             f"({gb(env.get('physical_vram_bytes'))} VRAM, {gb(env.get('total_ram_bytes'))} RAM), torch {env['torch']}. "
             'Rendered from the record by `benchmarks/report_beyond_vram_propagated.py`; every number below is copied from it. '
             f"Verdict against the declared cases: **{'PASS' if verdict['all_passed'] else 'FAIL'}**.", '',
             '## Fixture', '', '| Item | Value |', '|---|---|',
             f"| Grid, cells | {r['grid'][0]} x {r['grid'][1]} x {r['grid'][2]}, {r['cells']:,} |",
             f"| Mesh, footprint, period, pillars | {fx['mesh_um']} um, {fx['footprint_um']} um, {fx['period_um']} um, {fx['pillar_count']} |",
             f"| Pillar height, radii, epsilon | {fx['height_um']} um, {fx['radius_um'][0]} to {fx['radius_um'][1]} um, {fx['epsilon_pillar']} |",
             f"| Source plane, monitor plane, focal distance | z = {fx['source_z_um']} um, z = {fx['monitor_z_um']} um, {fx['focal_um']} um |",
             f"| Wavelengths | {', '.join(str(w) for w in fx['wavelengths_um'])} um |",
             f"| Steps, time step, duration | {r['steps']}, {r['time_step_s']*1e15:.4f} fs, {fx['duration_fs']:.1f} fs (source ends at {fx['source_end_fs']:.1f} fs) |",
             f"| DFT resolution, minimum separation | {r['frequency_resolution_hz']/1e12:.2f} THz, {r['minimum_frequency_separation_hz']/1e12:.2f} THz |",
             f"| Source amplitude ratio at the wavelengths | {', '.join(f'{v:.3f}' for v in r['source_amplitude_ratio'])} |",
             f"| Plane samples, observers | {forward['plane_points']} ({' x '.join(str(n) for n in forward['plane_shape'])}), {execution['observers']:,} |",
             f"| E/H bytes, state with CPML | {gb(r['eh_bytes'])}, {gb(reservation['state_bytes'])} |", '',
             '## Policy and reservation', '', '| Item | Value |', '|---|---|',
             f"| Slab width, temporal depth, global and local checkpoints | {execution['options']['slab_width']}, {execution['options']['temporal_depth']}, {execution['options']['checkpoints']}, {execution['options']['local_checkpoints']} |",
             f"| State storage | {execution['options']['state_storage']} banks, capacity {reservation['state_bank_capacity']} states |",
             f"| Host reservation, GPU reservation | {gb(reservation['host_reservation_bytes'])}, {gb(reservation['gpu_reservation_bytes'])} |",
             f"| Dense parameter reservation, extended tile cells | {gb(reservation['dense_parameter_reservation_bytes'])}, {reservation['max_extended_tile_cells']:,} |", '',
             '## Results', '', '| Item | Value |', '|---|---|',
             f"| Objective (on-axis focal intensity, time-normalized, summed over wavelengths) | {forward['objective']:.6e} |",
             f"| Focal intensity per wavelength | {', '.join(f'{v:.4e}' for v in forward['focal_intensity_per_frequency'])} |",
             f"| Plane electric energy per wavelength | {', '.join(f'{v:.4e}' for v in forward['plane_electric_energy_per_frequency'])} |",
             f"| Plane energy peak, rise step, final fraction | step {forward['energy_peak_step']} ({forward['energy_peak_fs']:.1f} fs), step {forward['energy_rise_step']}, {forward['energy_decayed_fraction']:.3e} |",
             f"| Gradient norm, design-slab norm, nonzero cells | {backward['gradient_norm']:.4e}, {backward['design_slab_gradient_norm']:.4e}, {backward['gradient_nonzero']:,} |",
             f"| Directional derivative, finite difference | {backward['directional_derivative']:.6e}, {execution['fd']['finite_difference']:.6e} ({execution['fd']['kind']}, step {execution['fd']['step']}, {execution['fd_cells']:,} cells) |" if execution.get('fd') else '| Finite difference | not run |',
             f"| Finite-difference relative error, relative response | {execution['fd']['relative_error']:.3e}, {execution['fd']['relative_response']:.3e} |" if execution.get('fd') else '',
             '']
    if r.get('comparison'):
        cmp = r['comparison']
        lines += ['## Resident reference (rehearsal)', '', '| Item | Value |', '|---|---|',
                  f"| Objective relative difference | {cmp['objective_relative_difference']:.3e} |",
                  f"| Design-slab gradient relative L2 | {cmp['design_slab_gradient_relative_l2']:.3e} |",
                  f"| Energy history relative L2 | {cmp['energy_history_relative_l2']:.3e} |",
                  f"| Resident forward, backward | {seconds(r['runs']['resident_forward']['seconds'])}, {seconds(r['executions']['resident']['backward']['seconds'])} |", '']
    lines += ['## Timings', '', '| Phase | Wall |', '|---|---|',
              f"| Streamed forward | {seconds(forward['seconds'])} |",
              f"| Streamed backward (VJP) | {seconds(backward['seconds'])} |"]
    for label in ('streamed_fd_plus', 'streamed_fd_minus'):
        if label in r['runs']:
            lines.append(f"| Finite-difference forward ({label.split('_')[-1]}) | {seconds(r['runs'][label]['seconds'])} |")
    lines += [f"| Driver total | {seconds(r.get('elapsed_seconds'))} |", '',
              '## Memory and disk, measured separately', '', '| Quantity | Forward | Backward |', '|---|---|---|']
    for key, label in (('peak_torch_allocated_bytes', 'Peak Torch allocated'), ('peak_torch_reserved_bytes', 'Peak Torch reserved')):
        lines.append(f"| {label} | {gb(forward.get(key))} | {gb(backward.get(key))} |")
    for key, label in (('peak_process_rss_bytes', 'Peak process RSS'), ('peak_process_private_bytes', 'Peak process private bytes'),
                       ('peak_device_in_use_bytes', 'Peak whole-device CUDA in use'), ('machine_disk_read_bytes', 'Machine disk read bytes'),
                       ('machine_disk_write_bytes', 'Machine disk write bytes')):
        lines.append(f"| {label} | {gb(forward['memory'].get(key))} | {gb(backward['memory'].get(key))} |")
    lines += ['', forward['memory']['scope'], '']
    if r.get('system_counters'):
        c = r['system_counters']
        lines += ['## Whole-machine counters', '', '| Item | Value |', '|---|---|',
                  f"| Samples, span | {c['samples']}, {c['span_seconds']:.0f} s |",
                  f"| Installed RAM, peak in use, minimum available | {gb(c['total_ram_bytes'])}, {gb(c['peak_system_in_use_bytes'])}, {gb(c['min_available_bytes'])} |",
                  f"| Peak committed, peak file cache, peak standby | {gb(c['max_committed_bytes'])}, {gb(c['max_cache_bytes'])}, {gb(c['max_standby_cache_bytes'])} |",
                  f"| Disk write mean, peak, integrated | {c['mean_write_bytes_per_second']/1e9:.2f} GB/s, {c['max_write_bytes_per_second']/1e9:.2f} GB/s, {gb(c['integrated_write_bytes'])} |",
                  f"| Disk read mean, peak, integrated | {c['mean_read_bytes_per_second']/1e9:.2f} GB/s, {c['max_read_bytes_per_second']/1e9:.2f} GB/s, {gb(c['integrated_read_bytes'])} |",
                  f"| CPU mean, peak | {c['mean_cpu_percent']:.1f} %, {c['max_cpu_percent']:.1f} % |", '', c['scope'], '']
    lines += ['## Criteria', '', '| Case | Criterion | Value | Limit | Result |', '|---|---|---|---|---|']
    for row in verdict['criteria']:
        value = row['value']
        value = f'{value:.4e}' if isinstance(value, float) else str(value)
        limit = row['limit']
        limit = f'{limit:.4e}' if isinstance(limit, float) else str(limit)
        lines.append(f"| {row['case']} | {row['name']} | {value} {row['unit']} | {limit} | {'PASS' if row['passed'] else 'FAIL'} |")
    lines += ['', f"Case files: {', '.join(f'{k} `{v}`' for k, v in verdict['case_sha256'].items())}.", '',
              '## What this does and does not show', '',
              '- The pulse crosses the pillar layer and reaches the output plane: the plane energy history rises, peaks and decays to the recorded fraction within the declared duration; the spectrum is accumulated online at three wavelengths whose separation exceeds twice the DFT resolution.',
              '- The streamed adjoint returns the dense epsilon VJP; its directional derivative along the declared pillar direction agrees with the recorded finite difference within the declared tolerance. This is a first-derivative check, not a converged or optimized design.',
              '- The E/H state of one bank is below the physical VRAM of the workstation; what exceeds it is the live adjoint state at the declared checkpoint schedule. Memory, timing and disk figures are separate measurements and are not added together.',
              '- The wall-time model in the driver is a fit to earlier records, not a throughput claim; the recorded timings are single cold runs on a shared machine.']
    return '\n'.join(lines)+'\n'


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument('--record', required=True)
    parser.add_argument('--context', choices=['rehearsal', 'workstation'], required=True)
    parser.add_argument('--root', default='.')
    parser.add_argument('--counters', default=None)
    parser.add_argument('--total-ram-gib', type=float, default=None)
    parser.add_argument('--evidence', required=True, help='Sanitized evidence record to write')
    parser.add_argument('--output', required=True, help='Markdown document to render')
    args = parser.parse_args(argv)
    record = sanitize(json.loads(Path(args.record).read_text(encoding='utf-8')))
    if args.counters:
        if args.total_ram_gib is None:
            raise ValueError('--counters needs --total-ram-gib.')
        header, rows = load_counters(args.counters)
        record['system_counters'] = summarize_counters(header, rows, int(args.total_ram_gib*1024**3))
    cases = load_cases(args.root)
    verdict = evaluate(record, cases, args.context)
    evidence = dict(kind='beyond_vram_propagated', context=args.context, record=record, verdict=verdict)
    out = Path(args.evidence)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(evidence, indent=1, allow_nan=False)+'\n', encoding='utf-8', newline='\n')
    Path(args.output).write_text(render(evidence), encoding='utf-8', newline='\n')
    print(json.dumps(dict(all_passed=verdict['all_passed'], failed=[r['name'] for r in verdict['criteria'] if not r['passed']],
                          evidence_sha256=hashlib.sha256(out.read_bytes()).hexdigest())))
    return verdict


if __name__ == '__main__':
    main()
