"""Keep both improvements and regressions from the phase/graph experiment."""
import argparse
import json
from pathlib import Path


BEGIN='<!-- BEGIN MEASURED PHASE AND GRAPH -->'
END='<!-- END MEASURED PHASE AND GRAPH -->'


def tables(record):
    cfg=record['configuration'];width=cfg['graph_steps']
    passed=all(c['accuracy_pass'] for c in record['cases'])
    def ratio(a,b,c):return f'{a/b:.2f}×' if c['accuracy_pass'] else 'Gate failed'
    lines=['## Current spectral throughput and optimization ablations','',
        f"**{record['hardware']['gpu']}, {cfg['count']} independent cases per row, {cfg['steps']} float32 steps, "
        f"cohorts of {cfg['cohort']}, median of {cfg['repeats']} warmed repetitions.** Three planes retain all six complex components "
        'at nine frequencies, with point traces and full final E/H. Full wall includes preparation, graph capture and output transfer. '
        'Cold context/compilation and disk writes are excluded.','',
        'The current fused monitor adds one shared CUDA phase kernel. The external **flaport/fdtd 0.2.2** sequence receives '
        f'the identical observer and both one-step and {width}-step graph options. The external column uses the **lower measured median** '
        'of those two options. PhotonWeave uses a fixed one-step graph and shared case launches. '
        'This compares ensemble workflows, not an upstream fused-batch implementation.','',
        '| Workload | Grid | flaport + shared observer, sequence (s) | PhotonWeave batch (s) | vs flaport sequence |',
        '|---|---:|---:|---:|---:|']
    for c in record['cases']:
        m=c['medians'];b=m['batch_1']['wall_seconds']
        u=min(m[f'flaport_{w}']['wall_seconds'] for w in (1,width))
        lines.append(f"| {c['name'].title()} | {c['shape'][0]}³ | {u:.3f} | {b:.3f} | {ratio(u,b,c)} |")
    lines.extend(['','Optimization effects are measured separately. Ratios below one are retained slowdowns:','',
        f'| Workload | Grid | CUDA phase gain, full wall / loop | {width}-step graph gain, full wall / loop | Batch cases/s |',
        '|---|---:|---:|---:|---:|'])
    for c in record['cases']:
        m=c['medians'];old=m['batch_torch_phase'];b=m['batch_1'];g=m[f'batch_{width}']
        phase=' / '.join(ratio(old[k],b[k],c) for k in ('wall_seconds','loop_seconds'))
        graph=' / '.join(ratio(b[k],g[k],c) for k in ('wall_seconds','loop_seconds'))
        lines.append(f"| {c['name'].title()} | {c['shape'][0]}³ | {phase} | {graph} | {b['cases_per_second']:.2f} |")
    external=[v['relative_l2'] for c in record['cases'] for check in c['checks'] if check['mode'].startswith('flaport')
              for e in check['errors'] for v in e[3:]]
    phase=[v['relative_l2'] for c in record['cases'] for check in c['checks'] if check['mode']=='batch_torch_phase'
           for e in check['errors'] for v in e[3:]]
    lines.extend(['',f"**Accuracy gates: {'passed throughout' if passed else 'failed in some rows, see raw record'}.** "
        'With the current phase kernel, native single/batch/unrolled complete output arrays match bitwise. '
        f"The previous phase expression differs by at most {max(phase):.3g} in complete complex DFT relative L2 (gate: 3e-6). "
        f"The maximum external complex DFT difference is {100*max(external):.4f}% (gate: 1%). "
        'External unrolling matches its own original graph outputs bitwise. Cross-library final fields remain different.','',
        f'`cuda_graph_steps={width}` is optional in single runs, tensor batches, tuning and tensor design. '
        'Every physical step and requested output is retained. Snapshot, diagnostic and callback steps are exact barriers. '
        'Additional capture cost can erase loop savings, so the default remains one. Cancellation is polled between replays. '
        'This adds no adjoint. **FDTDX, fdtdz and fdtd3d remain unmeasured on this GPU.**','',
        '[Algorithm and Python controls](docs/CUDA_SPECTRA.md), '
        '[all timings, setup costs and memory](docs/validation/GRAPH_ENSEMBLE_REPORT.md), '
        '[raw input/settings/checks](docs/validation/graph-ensembles.json).'])
    return '\n'.join(lines)


def main():
    p=argparse.ArgumentParser();p.add_argument('--input',default='results/open-source/graph-ensembles.json')
    args=p.parse_args();source=Path(args.input);record=json.loads(source.read_text(encoding='utf8'))
    section=tables(record)
    raw=Path('docs/validation/graph-ensembles.json');raw.write_bytes(source.read_bytes())
    path=Path('README.md');text=path.read_text(encoding='utf8');block=BEGIN+'\n'+section+'\n'+END
    if BEGIN in text:
        start=text.index(BEGIN);end=text.index(END,start)+len(END);text=text[:start]+block+text[end:]
    else:
        anchor='<!-- BEGIN MEASURED SPECTRAL ENSEMBLES -->';text=text.replace(anchor,block+'\n\n'+anchor)
    path.write_text(text,encoding='utf8')
    detail=section.replace('(docs/','(../')+'\n\n## Every execution mode\n\n'
    detail+='| Workload | Grid | Mode | Full wall (s) | Setup (s) | Loop (s) | Torch allocated / reserved (MiB) | Full wall repetitions (s) |\n'
    detail+='|---|---:|---|---:|---:|---:|---:|---|\n'
    for c in record['cases']:
        for name,m in c['medians'].items():
            samples=', '.join(f"{s['wall_seconds']:.6f}" for s in c['runs'][name])
            detail+=f"| {c['name']} | {c['shape'][0]}³ | {name} | {m['wall_seconds']:.6f} | {m['setup_seconds']:.6f} | "
            detail+=f"{m['loop_seconds']:.6f} | {m['peak_allocated_bytes']/2**20:.2f} / {m['peak_reserved_bytes']/2**20:.2f} | {samples} |\n"
    detail+='\nTorch allocated/reserved metrics exclude driver, CUDA context and graph-executable allocations outside the Torch allocator. '
    detail+='They are not total process GPU memory. One warmup precedes alternating measured order. Three samples do not establish confidence intervals. '
    detail+='The older phase ablation changes only phase evaluation, retaining fused plane sampling and accumulation. '
    detail+='All inputs are independently authored native projects. Source hashes identify this measured implementation.\n'
    detail+='\n## Reproduce\n\n```bash\npython -m benchmarks.graph_ensembles --sizes 32 64 --count 8 --cohort 4 --steps 800 --repeats 3\n'
    detail+='python -m benchmarks.report_graph_ensembles\npython -m pytest tests/test_cuda_graph_steps.py tests/test_cuda_monitors.py\n```\n'
    Path('docs/validation/GRAPH_ENSEMBLE_REPORT.md').write_text(detail,encoding='utf8')
    print('Generated phase/graph README tables and complete measurement report.')


if __name__=='__main__':main()
