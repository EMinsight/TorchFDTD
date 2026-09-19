"""Generate the native mesh ablation table from immutable measured JSON."""
import json
from pathlib import Path


def render(data):
    rows=data['cases'];config=data['configuration']
    if not rows or not all(r['accuracy_pass'] for r in rows):raise ValueError('All recorded cases must pass their accuracy gate.')
    lines=['## Rectilinear mesh and batch ablation','',
        f"**{data['hardware']['gpu']}, {config['count']} independent cases per row, {config['steps']} float32 steps, median of {config['repeats']} warmed repetitions.**",
        '', 'The native solver now supports independent axis spacing and explicit rectilinear node arrays. '
        'This experiment retains the same physical domain, propagation step, actual time step, sources, PML, duration and 17 flux frequencies. '
        'Transverse spacing changes from 0.05 to 0.2 µm, removing 93.75% of cells. '
        'The geometries and normal-incidence excitation are uniform in both transverse directions. '
        'This is a native mesh ablation, separate from the cross-library tables below.', '',
        '| Workload | Uniform → rectangular grid | Uniform batch (s) | Rectangular batch (s) | Mesh gain | Batch gain at rectangular mesh | Torch peak allocated, uniform → rectangular (MiB) |',
        '|---|---|---:|---:|---:|---:|---:|']
    for row in rows:
        m=row['medians'];u=m['uniform_batch'];r=m['rectangular_batch'];s=m['rectangular_sequential']
        shapes=[' × '.join(str(n) for n in row[k]) for k in ('uniform_shape','rectangular_shape')]
        lines.append(f"| {row['name'].capitalize()} | {' → '.join(shapes)} | {u['wall_seconds']:.3f} | {r['wall_seconds']:.3f} | {u['wall_seconds']/r['wall_seconds']:.2f}× | {s['wall_seconds']/r['wall_seconds']:.2f}× | {u['peak_allocated_bytes']/2**20:.2f} → {r['peak_allocated_bytes']/2**20:.2f} |")
    checks=[c for r in rows for c in r['checks']];err=max(max(e) for c in checks for e in c['relative_l2'])
    lines += ['',f"**All {sum(c['repeat']>=0 for c in checks)} timed-ensemble gates pass.** Maximum relative L2 across centerline final E/H, full point traces and signed flux is **{err:.3g}** (gate: 3e-5). "
        'Every final E/H array is constant along the transverse directions in this experiment. Different grids contain different sample counts. '
        'This does not establish a curved-geometry accuracy improvement, a resolution-independent speedup, or superiority over another library.', '',
        'Full wall includes preparation, graph capture, and final fields/monitor transfer. Cold compilation/context, validation and disk writes are excluded. '
        'Memory is the Torch allocator peak, excluding external context, driver and graph allocations. Three repetitions do not establish confidence intervals.', '',
        '[Python and UI controls](docs/RECTILINEAR_MESH.md), [example](examples/rectilinear_mesh.py), '
        '[inputs, repetitions, errors and source hashes](docs/validation/rectilinear-ensembles.json).']
    return '\n'.join(lines)+'\n'


def main():
    import sys
    sys.stdout.reconfigure(encoding='utf8')
    raw=Path('results/open-source/rectilinear-ensembles.json').read_bytes();data=json.loads(raw)
    table=render(data);Path('docs/validation/rectilinear-ensembles.json').write_bytes(raw)
    Path('docs/validation/RECTILINEAR_ENSEMBLE_REPORT.md').write_text(table.replace('(docs/validation/','(').replace('(docs/','(../').replace('(examples/','(../../examples/'),encoding='utf8')
    path=Path('README.md');text=path.read_text(encoding='utf8')
    begin='<!-- BEGIN RECTILINEAR MEASUREMENTS -->';end='<!-- END RECTILINEAR MEASUREMENTS -->'
    if begin in text:text=text[:text.index(begin)]+begin+'\n'+table+end+text[text.index(end)+len(end):]
    else:text=text.replace('<!-- BEGIN SELECTIVE MONITOR MEASUREMENTS -->',begin+'\n'+table+end+'\n\n<!-- BEGIN SELECTIVE MONITOR MEASUREMENTS -->',1)
    path.write_text(text,encoding='utf8')
    print(table)


if __name__=='__main__':main()
