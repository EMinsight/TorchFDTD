"""Render spectral ensemble tables exclusively from retained measurements."""
import argparse
import json
from pathlib import Path


BEGIN = '<!-- BEGIN MEASURED SPECTRAL ENSEMBLES -->'
END = '<!-- END MEASURED SPECTRAL ENSEMBLES -->'


def tables(record):
    first=record['cases'][0]
    region=first['projects'][0]['region']
    repetitions=len(first['runs']['fused_batch'])
    lines = [
        '## Spectral ensembles: monitor fusion and independent CUDA batches', '',
        f"{first['count']} independent cases per row, {region['steps']} steps, {region['precision']}, {record['hardware']['gpu']}. Every case records three spatial planes, "
        f"six complex E/H components at nine frequencies, one point trace and final E/H. Cohorts contain {first['cohort']} cases. "
        f'Medians of {repetitions} warmed full-solve timings include preparation and result transfer. No output resolution or time step is reduced.', '',
        'The external baseline uses **flaport/fdtd 0.2.2 + CUDA Graph + the same new fused DFT adapter**, executing cases sequentially. '
        'The external Torch-DFT baseline is also retained in the full report. The native reference already uses fused Yee updates, with Torch DFT per plane. '
        'The new selectable monitor path shares interpolation and spectral accumulation launches across planes and cases.', '',
        '| Workload | Grid | flaport + adapters, sequential (s) | Native Torch DFT, batch (s) | Shared CUDA DFT, batch (s) | vs flaport sequence | Monitor improvement at same cohort |',
        '|---|---:|---:|---:|---:|---:|---:|']
    for c in record['cases']:
        m=c['medians'];f=m['fused_batch']['wall_seconds'];passed=c['accuracy_pass']
        ratios = [f"{m[k]['wall_seconds']/f:.2f}×" if passed else 'Gate failed' for k in ('flaport_fused_dft','native_batch')]
        lines.append(f"| {c['name'].title()} | {c['shape'][0]}³ | {m['flaport_fused_dft']['wall_seconds']:.3f} | "
                     f"{m['native_batch']['wall_seconds']:.3f} | {f:.3f} | {' | '.join(ratios)} |")
    lines.extend(['', 'Batch scheduling contributes separately from monitor fusion:', '',
        '| Workload | Grid | Shared DFT, native sequential (s) | Shared DFT, batch (s) | Batch vs sequential | Batch cases/s | Torch peak allocated, sequential / batch (MiB) |',
        '|---|---:|---:|---:|---:|---:|---:|'])
    for c in record['cases']:
        s,b=(c['medians'][k] for k in ('fused_sequential','fused_batch'))
        ratio=f"{s['wall_seconds']/b['wall_seconds']:.2f}×" if c['accuracy_pass'] else 'Gate failed'
        lines.append(f"| {c['name'].title()} | {c['shape'][0]}³ | {s['wall_seconds']:.3f} | {b['wall_seconds']:.3f} | "
                     f"{ratio} | {b['cases_per_second']:.2f} | {s['peak_allocated_bytes']/2**20:.2f} / {b['peak_allocated_bytes']/2**20:.2f} |")
    upstream = [v['relative_l2'] for c in record['cases'] for check in c['checks'] if check['mode'].startswith('flaport') for e in check['errors'] for v in e[3:]]
    native = [v['relative_l2'] for c in record['cases'] for check in c['checks'] if check['mode'].startswith('fused') for e in check['errors'] for v in e[3:]]
    passed=all(c['accuracy_pass'] for c in record['cases'])
    lines.extend(['', f"**Accuracy gates: {'passed in every row' if passed else 'some failed, see raw checks'}.** "
        f"Maximum complete complex-plane DFT relative L2 difference is **{max(upstream)*100:.4f}%** against the external adapter (gate: 1%), "
        f"and **{max(native):.3g}** against native Torch DFT (gate: 3e-6). "
        'Native final E/H and point traces match bitwise. Fused single and batch complex DFTs match bitwise. '
        'The previous Torch and new fused DFTs are tolerance-equivalent, with small reduction-order rounding differences.', '',
        'These are measured forward ensemble ratios against the stated adapters, not speed rankings against FDTDX, fdtdz or fdtd3d. '
        'They do not establish mesh-converged accuracy, mode efficiency or adjoint performance. '
        'Batching raises resident memory. Torch allocation excludes CUDA context/driver overhead. '
        'The raw record retains late-time external full-field differences without claiming full-field equivalence.', '',
        '[Python/UI selection and algorithm](docs/CUDA_SPECTRA.md), '
        '[full record](docs/validation/spectral-ensembles.json), '
        '[reproduction and all timing modes](docs/validation/SPECTRAL_ENSEMBLE_REPORT.md).'])
    return '\n'.join(lines)


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--input', default='results/open-source/spectral-ensembles.json')
    args=ap.parse_args();source=Path(args.input);record=json.loads(source.read_text(encoding='utf-8'))
    data=Path('docs/validation');data.mkdir(parents=True,exist_ok=True)
    (data/'spectral-ensembles.json').write_bytes(source.read_bytes())
    section=tables(record)
    readme=Path('README.md');text=readme.read_text(encoding='utf-8')
    block=BEGIN+'\n'+section+'\n'+END
    if BEGIN in text:
        start=text.index(BEGIN);end=text.index(END,start)+len(END)
        text=text[:start]+block+text[end:]
    else:
        anchor='<!-- BEGIN MEASURED OPEN SOURCE -->'
        text=text.replace(anchor,block+'\n\n'+anchor)
    readme.write_text(text,encoding='utf-8')
    detail=section.replace('(docs/', '(../')
    detail+='\n\n## Every measured execution mode\n\n'
    detail+='| Workload | Grid | Mode | Full wall median (s) | Loop median (s) | Raw full wall repetitions (s) |\n|---|---:|---|---:|---:|---|\n'
    for c in record['cases']:
        for mode,m in c['medians'].items():
            values=', '.join(f"{r['wall_seconds']:.6f}" for r in c['runs'][mode])
            detail+=f"| {c['name']} | {c['shape'][0]}³ | {mode} | {m['wall_seconds']:.6f} | {m['loop_seconds']:.6f} | {values} |\n"
    detail+='\n## Reproduction\n\n```bash\npython -m benchmarks.spectral_ensemble --sizes 32 64 --count 8 --cohort 4 --steps 800 --repeats 3\npython -m benchmarks.report_spectral --input results/open-source/spectral-ensembles.json\n```\n\n'
    detail+='Raw JSON retains full input projects, package versions, source SHA-256 hashes, declared accuracy gates, all timed output errors and absolute reference scales. No commercial solver inputs or outputs are used.\n'
    (data/'SPECTRAL_ENSEMBLE_REPORT.md').write_text(detail,encoding='utf-8')
    print('Generated README spectral tables and retained raw record/report.')


if __name__ == '__main__':main()
