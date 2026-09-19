"""Regenerate README comparison tables from recorded measurements, without CUDA."""
import json
import math
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'docs/validation'
BEGIN='<!-- BEGIN MEASURED OPEN SOURCE -->'
END='<!-- END MEASURED OPEN SOURCE -->'


def load(name):return json.loads((DATA/name).read_text(encoding='utf-8'))


def ensemble_tables():
    data=load('ensembles.json');design=load('design-throughput.json')
    lines=['### Four workloads with 16 independent cases each', '',
        'A follow-up repeats vacuum amplitude, sphere radius, slab thickness and waveguide width sweeps. '
        'Each row contains 16 complete 800-step solves. The upstream graph adapter runs those cases sequentially. '
        'PhotonWeave uses shared CUDA launches and the cohort size selected by a separate full-workload timing trial. '
        '**These are ensemble throughput ratios, not single-solve speedups or comparisons with an upstream fused batch implementation.**', '',
        '| Workload | Grid | flaport graph sequential (s) | Native sequential (s) | Selected cohort | Native batch (s) | vs flaport sequence | vs native sequence |',
        '|---|---:|---:|---:|---:|---:|---:|---:|']
    for c in data['cases']:
        m=c['medians'];a=m['flaport_graph']['wall_seconds'];s=m['sequential']['wall_seconds'];b=m['tuned']['wall_seconds']
        lines.append(f"| {c['name'].capitalize()} | {c['shape'][0]}³ | {a:.3f} | {s:.3f} | {c['tuning']['cohort_size']} | {b:.3f} | {a/b:.2f}× | {s/b:.2f}× |")
    errors=[e['relative_l2']['trace'] for c in data['cases'] for check in c['checks'] if check['mode']=='flaport_graph' for e in check['upstream_errors']]
    lines+=['',f"Every native E/H/point-trace result matches the independent native solve bitwise. The largest upstream point-trace relative L2 difference is {max(errors)*100:.4f}% (gate: 1%). Full upstream field errors and weak-field reference scales are retained in the raw records. These point-driven fixtures do not measure mode efficiency, resonator Q or mesh-converged accuracy.", '',
        '**Tuning is an up-front cost.** `tune_tensor_batch()` tests sizes 1/2/4/8/16 with one warmup and three measured repetitions each. '
        'The following runs are independent of the selection samples. A noisy timing winner need not remain fastest. '
        'The break-even column divides the entire tuning cost by the later median saving against native sequential execution, '
        'rounded up. It assumes that saving persists across repeated identical ensembles and excludes user-objective/disk costs.', '',
        '| Workload | Grid | Tuning cost (s) | Batch speedup vs fixed cohort 16 | Estimated ensembles to repay tuning vs native sequential |',
        '|---|---:|---:|---:|---:|']
    for c in data['cases']:
        m=c['medians'];b=m['tuned']['wall_seconds'];saving=m['sequential']['wall_seconds']-b
        count=str(math.ceil(c['tuning']['seconds']/saving)) if saving>0 else 'No break-even'
        lines.append(f"| {c['name'].capitalize()} | {c['shape'][0]}³ | {c['tuning']['seconds']:.2f} | {m['cohort_16']['wall_seconds']/b:.3f}× | {count} |")
    lines+=['', 'A ratio below 1 retains a regression. For a single short sweep, an explicit size can cost less overall than tuning. '
        'All fixed-size measurements, all trial samples and peak Torch allocations are in [the ensemble record](docs/validation/ensembles.json).', '',
        '### Complete black-box inverse-design loop', '',
        '`optimize(execution="tensor", cohort_size=...)` now evaluates differential-evolution populations in CUDA cohorts. '
        'These timings include all 64 forward solves, proposal/replacement logic and scalar objectives: population 16, '
        'three trial generations, seed 73. The objective is an unnormalized integrated point-field intensity. '
        'The full parameter and objective histories are identical to native independent execution. This is **forward-only**, with no adjoint.', '',
        '| Grid | Cohort | Independent design loop (s) | Tensor design loop (s) | Speedup | Tensor objective evaluations/s |',
        '|---|---:|---:|---:|---:|---:|']
    for c in design['cases']:
        a=c['medians']['sequential'];b=c['medians']['tensor']
        lines.append(f"| {c['shape'][0]}³ | {c['cohort_size']} | {a['wall_seconds']:.3f} | {b['wall_seconds']:.3f} | {a['wall_seconds']/b['wall_seconds']:.2f}× | {b['evaluations_per_second']:.2f} |")
    lines+=['', 'Design timings use explicit cohort sizes and exclude cohort tuning. '
        '[Raw complete histories](docs/validation/design-throughput.json), '
        '[reproduction and interpretation](docs/validation/ENSEMBLE_REPORT.md), '
        '[Python tuning and design example](examples/tuned_inverse_design.py).', '']
    return lines


def tables():
    single=load('open-source-flaport.json');batch=load('tensor-batch.json');cohort=load('cohorts.json')
    lines=['## Measured CUDA comparisons', '',
        '**RTX 5880 Ada 48 GB, Windows, float32, 800 steps, three warmed repetitions.** '
        'Times below are median full-solve wall times, including construction, CUDA graph preparation and final field transfer. '
        'Cold interpreter/context startup and first compilation are excluded. These are fixed-step forward benchmarks, not mesh-convergence or adjoint benchmarks.', '',
        'The external baseline is **flaport/fdtd 0.2.2 with an added CUDA Graph adapter**, '
        'calling its unmodified E/H updates. Its eager timings are retained in the raw records. '
        'Both engines receive identical voxel permittivity, timestep, sampled source and point monitor. '
        'The upstream high-side PML interface stencil differs, so agreement is assessed separately.', '',
        '| Example | Grid | flaport + graph (ms) | PhotonWeave fused (ms) | Speedup | Point-trace relative L2 |',
        '|---|---:|---:|---:|---:|---:|']
    for c in single['cases']:
        a=c['medians']['flaport_graph'];b=c['medians']['photonweave_fused']
        err=max(e['photonweave_relative_l2']['trace'] for e in c['errors'])
        lines.append(f"| {c['name'].capitalize()} | {c['shape'][0]}³ | {1000*a['wall_seconds']:.2f} | {1000*b['wall_seconds']:.2f} | {a['wall_seconds']/b['wall_seconds']:.2f}× | {100*err:.4f}% |")
    lines+=['', 'All eight point traces pass the predeclared 1% relative-L2 tolerance. '
        'This is cross-solver agreement, not error against an exact solution. '
        '**Final full fields are not identical across libraries:** for the late-time 64³ vacuum case, '
        'H relative L2 is 31.45% with maximum absolute difference 1.89e-7 in reduced units '
        '(reference final H peak 1.23e-7). All E/H errors and reference scales are retained. '
        'The upstream graph adapter itself matches upstream eager E/H/traces bitwise in these cases.', '',
        'Torch peak allocated memory is **17.85 vs 52.51 MiB** at 64³ and **56.99 vs 141.76 MiB** at 96³ '
        '(PhotonWeave vs graph-adapted upstream). This excludes CUDA context and driver allocations.', '',
        '### Independent structures in one CUDA launch', '',
        '`run_tensor_batch()` adds a real CUDA batch axis to the E/H updates and shares source/point-trace launches. '
        'The sweep varies the sphere radius. All timed native batch E/H arrays and point traces match separate native solves **bitwise**. '
        'Cases/s also equals scalar objective evaluations/s for the measured trace-peak objective.', '',
        '| Grid | Cases | Native sequential (ms) | Native tensor batch (ms) | Tensor cases/s | Batch speedup vs native sequential |',
        '|---|---:|---:|---:|---:|---:|']
    for c in batch['cases']:
        a=c['medians']['sequential_fused'];b=c['medians']['tensor']
        lines.append(f"| {c['shape'][0]}³ | {c['batch_size']} | {1000*a['wall_seconds']:.2f} | {1000*b['wall_seconds']:.2f} | {b['cases_per_second']:.2f} | {a['wall_seconds']/b['wall_seconds']:.2f}× |")
    lines+=['', '**Larger batches can be slower.** The 64³, B=8 and B=16 regressions are retained above. '
        'Use an explicit `cohort_size` to bound the cases processed together. '
        'A follow-up 64³, 16-case experiment measures the cost of splitting rather than extrapolating it:', '',
        '| 16 × 64³ execution | Full wall (ms) | Cases/s | Torch peak allocated (MiB) |',
        '|---|---:|---:|---:|']
    names={'sequential_fused':'Independent sequential', 'cohort_4':'Four cohorts of four', 'cohort_16':'One cohort of sixteen'}
    for mode,m in cohort['medians'].items():
        lines.append(f"| {names[mode]} | {1000*m['wall_seconds']:.2f} | {m['cases_per_second']:.2f} | {m['peak_allocated_bytes']/2**20:.2f} |")
    lines+=['', 'This initial follow-up used user-selected sizes. The measured selector is evaluated separately below. Splitting preserves bitwise E/H/traces in this follow-up. '
        'It reduces GPU allocation but still retains host results when `keep_results=True`.', '',
        '| 16-case sweep | flaport + graph, sequential (s) | Native, 2 process workers (s) | Native, one tensor cohort (s) |',
        '|---|---:|---:|---:|']
    for process in batch['process_cases']:
        c=next(c for c in batch['cases'] if c['shape']==process['shape'] and c['batch_size']==process['batch_size'])
        lines.append(f"| {c['shape'][0]}³ | {c['medians']['flaport_graph']['wall_seconds']:.3f} | {process['median_wall_seconds']:.3f} | {c['medians']['tensor']['wall_seconds']:.3f} |")
    lines+=['', 'The process comparison excludes worker startup and includes IPC. '
        'The upstream ensemble runs cases sequentially through our graph adapter, so it does not establish a limit on a separately optimized upstream batch implementation. '
        'The 32³ batch traces differ from upstream by at most 0.267%, still below the predeclared 1% threshold.', '',
        '**FDTDX, fdtdz and fdtd3d have not been timed on this GPU.** '
        'Their capabilities are compared below, but there is no measured speed ranking against them. '
        'The current GPU host lacks a Linux CUDA environment. See '
        '[method, environment and limitations](docs/validation/OPEN_SOURCE_REPORT.md), '
        '[raw single-case data](docs/validation/open-source-flaport.json), '
        '[raw batch data](docs/validation/tensor-batch.json), '
        '[raw cohort data](docs/validation/cohorts.json), and the [Python batch API](docs/TENSOR_BATCH.md).', '']
    lines+=ensemble_tables()
    return '\n'.join(lines)


def main():
    path=ROOT/'README.md';readme=path.read_text(encoding='utf-8');content=tables()
    if BEGIN in readme:
        before,tail=readme.split(BEGIN,1);_,after=tail.split(END,1)
        readme=before+BEGIN+'\n'+content+END+after
    else:
        readme=readme.replace('## Quick start',BEGIN+'\n'+content+END+'\n\n## Quick start',1)
    path.write_text(readme,encoding='utf-8')
    print('README measurement tables regenerated from recorded JSON.')


if __name__=='__main__':main()
