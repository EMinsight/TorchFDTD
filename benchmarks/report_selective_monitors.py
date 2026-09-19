"""Publish exact-output selection gains with the full benchmark scope."""
import argparse
import json
from pathlib import Path

BEGIN='<!-- BEGIN SELECTIVE MONITOR MEASUREMENTS -->'
END='<!-- END SELECTIVE MONITOR MEASUREMENTS -->'


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--input',default='results/open-source/selective-monitors.json')
    args=ap.parse_args();source=Path(args.input);r=json.loads(source.read_text(encoding='utf8'));cfg=r['configuration']
    if len(r['cases'])!=len(cfg['sizes'])*len(cfg['cases']) or not all(c['accuracy_pass'] for c in r['cases']):
        raise ValueError('Complete passing measurements are required.')
    lines=['## Selective-output CUDA ensembles','',
        f"**{r['hardware']['gpu']}, {cfg['count']} cases per row, {cfg['steps']} float32 steps, three planes with "
        f"{cfg['frequencies']} frequencies, cohorts of {cfg['cohort']}, {cfg['repeats']} measured repetitions after warmup.** "
        'Full wall includes setup, graph capture, final E/H, point traces and selected results. Cold compilation/context and disk writes are excluded.','',
        'When the requested observable is signed flux, the new output selector accumulates **four tangential E/H components instead of six**, '
        'and omits unused field/Poynting exports. The same flux frequencies, quadrature and time samples are retained. '
        'The full-output column is the native batch with all six fields and three Poynting components stored. '
        'The external flaport/fdtd 0.2.2 sequence also receives the **same selective fused observer**, using the lower '
        'median of its one-step/eight-step graph options. Native graphs use one step.','',
        '| Workload | Grid | flaport sequence (s) | Native full-output batch (s) | Native flux-only batch (s) | Output-selection gain | vs flaport sequence |',
        '|---|---:|---:|---:|---:|---:|---:|']
    for c in r['cases']:
        m=c['medians'];b=m['native_batch_flux']['wall_seconds'];full=m['native_batch_full']['wall_seconds']
        external=min(m[k]['wall_seconds'] for k in ('flaport_flux_1','flaport_flux_8'))
        lines.append(f"| {c['name'].title()} | {c['shape'][0]}³ | {external:.3f} | {full:.3f} | {b:.3f} | {full/b:.2f}× | {external/b:.2f}× |")
    lines+=['','Cohort scheduling and memory are separate from output selection:','',
        '| Workload | Grid | Flux-only native sequential (s) | Flux-only batch gain | Batch cases/s | Torch peak allocated, full / flux-only (MiB) |',
        '|---|---:|---:|---:|---:|---:|']
    for c in r['cases']:
        m=c['medians'];b=m['native_batch_flux'];full=m['native_batch_full'];seq=m['native_sequential_flux']['wall_seconds']
        lines.append(f"| {c['name'].title()} | {c['shape'][0]}³ | {seq:.3f} | {seq/b['wall_seconds']:.2f}× | {b['cases_per_second']:.2f} | {full['peak_allocated_bytes']/2**20:.2f} / {b['peak_allocated_bytes']/2**20:.2f} |")
    errors=[e for c in r['cases'] for check in c['checks'] if 'errors' in check for e in check['errors']]
    lines+=['',f"**All {sum(len(c['checks']) for c in r['cases'])} timed-ensemble accuracy gates pass.** "
        'Native final E/H, point traces and signed flux agree bitwise with independent full-output runs. '
        f"Maximum external trace relative L2 is {100*max(e[2]['relative_l2'] for e in errors):.4f}% (gate 1%) and "
        f"flux relative L2 is {100*max(x['relative_l2'] for e in errors for x in e[3:]):.4f}% (gate 2%). "
        'External full-field differences remain in the raw record without a full-field equivalence claim.','',
        'These gains apply when the omitted fields are not requested. They are not six-field-output speedups, '
        'mesh-converged error claims or adjoint measurements. Temporal/spatial decimation was **not** used in this comparison. '
        'Torch memory excludes context, driver and graph-executable allocations outside its allocator. '
        'Three repetitions do not establish confidence intervals. FDTDX, fdtdz and fdtd3d remain unmeasured on this GPU.','',
        '[Python/UI controls](docs/CUDA_SPECTRA.md), [all modes and repetitions](docs/validation/SELECTIVE_MONITOR_REPORT.md), '
        '[input/settings/hash/error record](docs/validation/selective-monitors.json).']
    section='\n'.join(lines);readme=Path('README.md');content=readme.read_text(encoding='utf8')
    block=BEGIN+'\n'+section+'\n'+END
    if BEGIN in content:
        a=content.index(BEGIN);b=content.index(END,a)+len(END);content=content[:a]+block+content[b:]
    else:content=content.replace('<!-- BEGIN MEASURED PHASE AND GRAPH -->',block+'\n\n<!-- BEGIN MEASURED PHASE AND GRAPH -->')
    readme.write_text(content,encoding='utf8');Path('docs/validation/selective-monitors.json').write_bytes(source.read_bytes())
    report=section.replace('(docs/','(../')+'\n\n## Every execution mode\n\n'
    report+='| Workload | Grid | Mode | Full wall (s) | Setup (s) | Loop (s) | Torch allocated / reserved (MiB) | Repetitions, full wall (s) |\n|---|---:|---|---:|---:|---:|---:|---|\n'
    for c in r['cases']:
        for name,m in c['medians'].items():
            samples=', '.join(f"{v['wall_seconds']:.6f}" for v in c['runs'][name])
            report+=f"| {c['name']} | {c['shape'][0]}³ | {name} | {m['wall_seconds']:.6f} | {m['setup_seconds']:.6f} | {m['loop_seconds']:.6f} | {m['peak_allocated_bytes']/2**20:.2f} / {m['peak_reserved_bytes']/2**20:.2f} | {samples} |\n"
    report+='\n## Reproduce\n\n```bash\npython -m benchmarks.selective_monitors\npython -m benchmarks.report_selective_monitors\npython -m pytest tests/test_monitor_outputs.py tests/test_cuda_monitors.py\n```\n'
    Path('docs/validation/SELECTIVE_MONITOR_REPORT.md').write_text(report,encoding='utf8')
    print('Generated README tables, complete report and unchanged raw measurement copy.')


if __name__=='__main__':main()
