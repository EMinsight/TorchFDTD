"""Publish only fully checked native geometry-preparation measurements."""
import json
from pathlib import Path


def main():
    source=Path('results/open-source/geometry-ensembles.json');raw=source.read_bytes();data=json.loads(raw)
    assert len(data['cases'])==8
    assert all(len(runs)==3 for c in data['cases'] for runs in c['runs'].values())
    assert all(check['passed'] and all(all(v) for v in check['bitwise_by_case_output']) for c in data['cases'] for check in c['checks'])
    target=Path('docs/validation/geometry-ensembles.json');target.write_bytes(raw)
    labels={'spheres':'Spheres','rotated_boxes':'Rotated boxes','concave_polygons':'Concave polygons','elliptical_sectors':'Elliptical ring sectors'}
    lines=['## Analytic CAD and material-preparation ablation','',
        '**RTX 5880 Ada, four independent scenes per row, eight solids per scene, 800 float32 steps, median of three warmed repetitions.**',
        '', 'Native CAD now includes extruded concave polygons, ellipsoids, elliptical cylinders/ring sectors and ordered three-axis rotations. '
        'The new preparation path tests membership only inside conservative solid bounds. The baseline tests the same analytic equations over the whole domain. '
        'Both use identical Yee grids, sources, CPML, CUDA kernels, cohort sizes and complete outputs. This is a native implementation ablation, not a comparison with another library.', '',
        '| Solids | Grid | Unpruned batch (s) | Bounded batch (s) | Full-wall gain | Host material preparation, before → after (s) |',
        '|---|---:|---:|---:|---:|---:|']
    for c in data['cases']:
        a,b=(c['medians'][k] for k in ('unpruned','support_pruned'))
        lines.append(f"| {labels[c['name']]} | {c['shape'][0]}³ | {a['wall_seconds']:.3f} | {b['wall_seconds']:.3f} | {a['wall_seconds']/b['wall_seconds']:.2f}× | {a['voxelize_seconds']:.3f} → {b['voxelize_seconds']:.3f} |")
    lines += ['', '**All 48 timed-ensemble gates pass bitwise** for permittivity, complete final E/H, point traces, time arrays, snapshots, complex plane fields and signed flux. '
        'Display tessellation does not enter the material equations. Independent tests also compare analytic volumes and equivalent box/polygon optical representations.', '',
        'Full wall includes host preparation, CUDA Graph capture, stepping and output transfer. Cold compilation/context, checks and disk writes are excluded. '
        'The GPU still updates every Yee cell. These gains primarily remove host preparation work for compact solids and do not establish a faster CUDA update kernel. '
        'Unchanged kernels also show different loop timings in some repetitions, so loop fluctuations are retained in the raw record without attributing them to a new kernel. '
        'Longer propagation runs or large overlapping solids may benefit less. No geometry-result cache is used in either mode. Three repetitions do not establish confidence intervals.', '',
        '[Geometry controls and conventions](docs/ANALYTIC_GEOMETRY.md), [Python batch example](examples/analytic_solids.py), [inputs, repetitions and source hashes](docs/validation/geometry-ensembles.json).']
    table='\n'.join(lines)
    readme=Path('README.md');text=readme.read_text(encoding='utf8')
    begin='<!-- BEGIN GEOMETRY MEASUREMENTS -->';end='<!-- END GEOMETRY MEASUREMENTS -->';block=begin+'\n'+table+'\n'+end
    if begin in text:text=text[:text.index(begin)]+block+text[text.index(end)+len(end):]
    else:text=text.replace('<!-- BEGIN RECTILINEAR MEASUREMENTS -->',block+'\n\n<!-- BEGIN RECTILINEAR MEASUREMENTS -->',1)
    readme.write_text(text,encoding='utf8')
    report=table.replace('## Analytic','# Analytic').replace('(docs/ANALYTIC_GEOMETRY.md)','(../ANALYTIC_GEOMETRY.md)').replace('(examples/analytic_solids.py)','(../../examples/analytic_solids.py)').replace('(docs/validation/geometry-ensembles.json)','(geometry-ensembles.json)')
    report+='\n\nReproduce on a CUDA workstation with `python -m benchmarks.geometry_ensembles --output results/open-source/geometry-ensembles-new.json`. The script refuses to overwrite an existing record.\n'
    Path('docs/validation/GEOMETRY_ENSEMBLE_REPORT.md').write_text(report,encoding='utf8')
    print(table)


if __name__=='__main__':main()
