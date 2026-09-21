"""Render the recorded design-workflow starts into docs/DESIGN_WORKFLOW.md.

Reads docs/validation/g6/<example>-seed<n>.json written by the G6-07 runs,
replaces the text between the `<!-- g6:records begin -->` and
`<!-- g6:records end -->` markers, and writes docs/validation/g6/G6-07_observed.json
with the judged values of every start. Every number in that region comes from
the records; nothing is typed by hand.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT/'docs'/'validation'/'g6'
DOCUMENT = ROOT/'docs'/'DESIGN_WORKFLOW.md'
BEGIN, END = '<!-- g6:records begin -->', '<!-- g6:records end -->'
KEYS = dict(metagrating=('efficiency', 'holdout_efficiency'), coupler=('transmission', None))


def fmt(value, digits=4):
    return 'n/a' if value is None else f'{value:.{digits}f}'


def render_example(example, records, case):
    key, holdout_key = KEYS[example]
    declared = case['acceptance'][example]
    lines = [f'### {example}: {len(records)} starts, {declared["iterations"]} iterations each', '',
             f'Judged metric `{declared["objective_key"]}` at the fine GDS stage, threshold {declared["final_objective_min"]}; '
             f'holdout `{declared["holdout_key"]}` threshold {declared["holdout_min"]}.', '',
             '| Seed | Coarse last | Fine smooth | Fine binary | Fine structures | Fine GDS | Holdout | Mesh | Threshold | Smoothing | GDS | Linewidth (px) | Gap (px) | Violations | Erosion dJ | Dilation dJ | Wall time (s) |',
             '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |']
    for record in records:
        final = record['final_evaluation']
        stages, differences = final['stages'], final['differences']
        holdout = stages['fine_gds'][holdout_key] if holdout_key else final['holdout'][declared['holdout_key']]
        sizes = record['fabrication']['feature_sizes']
        perturbation = record['fabrication']['perturbation']
        lines.append('| ' + ' | '.join([str(record['seed']), fmt(record['history'][-1]['metrics'][key]), fmt(stages['fine_smooth'][key]),
                                       fmt(stages['fine_binary'][key]), fmt(stages['fine_structures'][key]), fmt(stages['fine_gds'][key]),
                                       fmt(holdout), fmt(differences['mesh_refinement'][key]), fmt(differences['thresholding'][key]),
                                       fmt(differences['smoothing'][key]), fmt(differences['gds'][key]),
                                       str(sizes['linewidth_pixels']), str(sizes['gap_pixels']),
                                       ', '.join(record['fabrication']['violations']) or 'none',
                                       fmt(perturbation['eroded']['objective_change']), fmt(perturbation['dilated']['objective_change']),
                                       fmt(record['wall_time_s'], 0)]) + ' |')
    lines.append('')
    return lines


def observed(example, records, case):
    key, holdout_key = KEYS[example]
    declared = case['acceptance'][example]
    rows = []
    for record in records:
        final = record['final_evaluation']
        holdout = final['stages']['fine_gds'][holdout_key] if holdout_key else final['holdout'][declared['holdout_key']]
        rows.append(dict(seed=record['seed'], iterations=record['iterations'], final_objective=final['stages']['fine_gds'][key],
                         holdout=holdout, coarse_last_objective=record['history'][-1]['metrics'][key],
                         differences={name: values[key] for name, values in final['differences'].items()},
                         feature_sizes=record['fabrication']['feature_sizes'], violations=record['fabrication']['violations'],
                         perturbation_objective_change=dict(eroded=record['fabrication']['perturbation']['eroded']['objective_change'],
                                                            dilated=record['fabrication']['perturbation']['dilated']['objective_change']),
                         wall_time_s=record['wall_time_s']))
    return dict(thresholds=dict(final_objective_min=declared['final_objective_min'], holdout_min=declared['holdout_min'],
                                iterations=declared['iterations']), starts=rows,
                all_starts_pass=all(r['final_objective'] >= declared['final_objective_min'] and r['holdout'] >= declared['holdout_min'] for r in rows))


def main():
    case = json.loads((ROOT/'docs'/'validation'/'cases'/'G6-07.json').read_text(encoding='utf-8'))
    judged = {}
    body = ['', BEGIN, '', 'Rendered by `scripts/render_design_workflow.py` from `docs/validation/g6/*.json`; a difference is the '
            'metric after a stage minus before it (mesh: fine smooth minus coarse last; threshold: binary minus smooth; smoothing: '
            'staircase structures minus volume-averaged binary; GDS: polygons minus structures), so a negative value is a loss. '
            'dJ is the change of the coarse objective (a loss to be minimized) under a one-pixel erosion or dilation.', '']
    for example in KEYS:
        records = [json.loads(p.read_text(encoding='utf-8')) for p in sorted(RECORDS.glob(f'{example}-seed*.json'))]
        if records:
            body += render_example(example, records, case)
            judged[example] = observed(example, records, case)
    body += [END]
    with open(RECORDS/'G6-07_observed.json', 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(json.dumps(judged, indent=1)+'\n')
    text = DOCUMENT.read_text(encoding='utf-8')
    start, stop = text.index(BEGIN), text.index(END)+len(END)
    DOCUMENT.write_text(text[:start]+'\n'.join(body[1:])+text[stop:], encoding='utf-8', newline='\n')
    print(f'rendered {DOCUMENT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
