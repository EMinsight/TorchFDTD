"""Generate README mixed-workload tables only from verified measured records."""
import argparse
import json
from pathlib import Path
import shutil
import statistics


ROOT = Path(__file__).resolve().parents[1]
BEGIN = '<!-- BEGIN GROUPED MEASUREMENTS -->'
END = '<!-- END GROUPED MEASUREMENTS -->'
NAMES = {'mixed-mesh-32-48': '32³ + 48³, 800 steps',
         'mixed-mesh-32-64': '32³ + 64³, 800 steps',
         'mixed-duration-32': '32³, 400 + 800 steps',
         'mixed-duration-64': '64³, 400 + 800 steps'}


def render(record):
    rows = record['cases']
    if not rows: raise ValueError('No measured workloads.')
    repeats = record['configuration']['repeats']
    if len(rows) != len(record['configuration']['workloads']): raise ValueError('Incomplete benchmark.')
    for c in rows:
        if not c['accuracy_pass'] or not all(x['accuracy_pass'] for x in c['checks']):
            raise ValueError('Accuracy gates must pass before reporting.')
        if len(c['checks']) != repeats * len(c['runs']): raise ValueError('Missing checks.')
        for mode, runs in c['runs'].items():
            if len(runs) != repeats: raise ValueError('Missing measured repetitions.')
            for key, median in c['medians'][mode].items():
                if median != statistics.median(r[key] for r in runs): raise ValueError('Stale median.')
    errors = [e for c in rows for check in c['checks'] for e in check.get('errors', [])]
    trace = max(e[2]['relative_l2'] for e in errors)
    dft = max(x['relative_l2'] for e in errors for x in e[3:])
    if trace >= .01 or dft >= .01: raise ValueError('External observable gate failed.')
    gpu = record['hardware'].get('gpu')
    # Hardware dictionaries from earlier versions differ. Do not invent a label.
    device = str(gpu or record['hardware'])
    text = ['## Mixed meshes and durations in one Python batch', '',
        f'**RTX 5880 Ada, 16 cases per row, float32, median of {repeats} warmed repetitions.** '
        'Every row interleaves vacuum, sphere, slab and waveguide cases across two meshes or durations. '
        'Three planes retain all six complex field components at nine frequencies, plus complete final E/H, point traces and native snapshots.', '',
        '`run_grouped_batch()` automatically groups exact compatible cases and restores input result order. '
        'The four-case cohort cap is fixed before measurement. Full wall includes grouping, setup, graph capture, '
        'stepping and output transfer. No grid padding, precision reduction, decimation or shortened run is used.', '',
        '| Mixed conditions | flaport sequence (s) | Native sequence (s) | Native grouped (s) | vs flaport sequence | vs native sequence | Grouped cases/s |',
        '|---|---:|---:|---:|---:|---:|---:|']
    if '5880' not in device: raise ValueError('README hardware label requires a measured RTX 5880 record.')
    for c in rows:
        m = c['medians']
        a = min(m[k]['wall_seconds'] for k in ('flaport_graph_1', 'flaport_graph_8'))
        s, b = (m[k]['wall_seconds'] for k in ('native_sequential', 'native_grouped'))
        text.append(f"| {NAMES[c['name']]} | {a:.3f} | {s:.3f} | {b:.3f} | {a/b:.2f}× | {s/b:.2f}× | {c['count']/b:.2f} |")
    text += ['', 'The external baseline is **flaport/fdtd 0.2.2 with CUDA Graph and the same fused DFT observer**. '
        'It calls unchanged upstream E/H updates. Both one-step and eight-step graphs are measured, and the table uses the lower median. '
        'This compares ensemble workflows against an external sequence, not an independently optimized upstream batch implementation.', '',
        f"**All {sum(len(c['checks']) for c in rows)} timed-ensemble gates pass.** Native complete outputs agree bitwise with independent native runs. "
        f'Maximum external point-trace and complex-plane DFT relative L2 differences are **{100*trace:.4f}%** and **{100*dft:.4f}%**, '
        'respectively, below the predeclared 1% gates. External final E/H differences remain in the raw record without an equivalence claim.', '',
        '| Mixed conditions | Grouping and preflight (ms) | Torch peak allocated, sequential / grouped (MiB) |',
        '|---|---:|---:|']
    for c in rows:
        s, b = (c['medians'][k] for k in ('native_sequential', 'native_grouped'))
        text.append(f"| {NAMES[c['name']]} | {1000*b['planning_seconds']:.1f} | {s['peak_allocated_bytes']/2**20:.2f} / {b['peak_allocated_bytes']/2**20:.2f} |")
    text += ['', 'The speedup uses existing fused cohort kernels. The new capability schedules heterogeneous inputs automatically. '
        'Groups execute successively on one GPU and objective callbacks follow cohort order. '
        'Complex fields, automatic per-case termination, grouped optimizer routing and GUI ensemble submission remain open. '
        'Cold interpreter/context/compiler, checks and disk I/O are excluded. Torch memory excludes external graph, driver and context allocations. '
        'Three repetitions do not establish confidence intervals. **FDTDX, fdtdz and fdtd3d remain unmeasured on this GPU.**', '',
        '[Python API and semantics](docs/GROUPED_BATCH.md), [standalone example](examples/grouped_batch.py), '
        '[all inputs, repetitions, errors and source hashes](docs/validation/grouped-ensembles.json).', '']
    return '\n'.join(text)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--input', default='results/open-source/grouped-ensembles.json')
    args = ap.parse_args()
    source = ROOT / args.input
    record = json.loads(source.read_text(encoding='utf8'))
    content = render(record)
    dest = ROOT/'docs/validation/grouped-ensembles.json'
    if source.resolve() != dest.resolve(): shutil.copyfile(source, dest)
    readme = ROOT/'docs/MEASUREMENTS.md'
    old = readme.read_text(encoding='utf8')
    if BEGIN in old:
        head, tail = old.split(BEGIN, 1)
        _, tail = tail.split(END, 1)
        result = head+BEGIN+'\n'+content+END+tail
    else:
        result = old.replace('<!-- BEGIN GEOMETRY MEASUREMENTS -->',
            BEGIN+'\n'+content+END+'\n\n<!-- BEGIN GEOMETRY MEASUREMENTS -->', 1)
    readme.write_text(result, encoding='utf8')
    report = content.replace('(docs/', '(../').replace('(examples/', '(../../examples/')
    (ROOT/'docs/validation/GROUPED_ENSEMBLE_REPORT.md').write_text(report, encoding='utf8')
    print('Verified mixed-workload tables and raw data written.')


if __name__ == '__main__': main()
