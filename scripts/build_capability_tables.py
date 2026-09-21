"""Render docs/CAPABILITIES.md and torchfdtd/capabilities.json from the capability registry.

Both files are generated; edit torchfdtd/capabilities.py and rerun this script.
tests/test_capability_pairs.py fails when the committed files differ from the
registry. `--check` exits 1 instead of writing.
"""
import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from torchfdtd import capabilities as C  # noqa: E402

MARKDOWN = ROOT/'docs'/'CAPABILITIES.md'
JSON = ROOT/'torchfdtd'/'capabilities.json'
MARK = {'admitted': '✓', 'rejected': '✗'}


def _label(axis, value):
    return C.VALUE_LABELS[axis][value]


def render_markdown(data):
    axes = data['axes']
    summary = data['summary']
    lines = ['# Capability tables', '',
             'Generated from [torchfdtd/capabilities.py](../torchfdtd/capabilities.py) by',
             '`scripts/build_capability_tables.py`; do not edit by hand. The same registry is served',
             'to the workbench as the `combinations` block of `/api/capabilities` and is checked',
             'against the code by [tests/test_capability_pairs.py](../tests/test_capability_pairs.py).',
             'The Lumerical property inventory is a different document,',
             '[FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md); this one states which combinations of',
             'the solver contract run and which are rejected, and where.', '',
             '## What a cell means', '',
             'Every combination of one value per axis is one small scene (the recipe below) executed',
             'through the entry point of its execution mode. A cell of an axis-pair table is admitted (✓)',
             'when at least one full combination containing the two values runs; the count after the mark',
             'is admitted combinations over all combinations with that pair. A rejected cell (✗) names the',
             'rule that explains the pair (the most frequent rejecting rule whose condition names both axes,',
             'else one of them); the rules table gives the code path and the exact',
             'message prefix. "Rejected" is a contract, not a defect: the code refuses the input before',
             'allocating fields, with that message.', '',
             f'Axes: {len(axes)}. Combinations: {summary["total"]:,} '
             f'({summary["admitted"]:,} admitted, {summary["rejected"]:,} rejected). '
             f'Rules: {summary["rules"]}. Lanes: {summary["lanes"]}.', '',
             '## Axes', '', '| Axis | Values |', '| --- | --- |']
    for axis, values in axes.items():
        lines.append(f'| {C.AXIS_LABELS[axis]} | '+', '.join(f'`{v}` ({_label(axis, v)})' for v in values)+' |')
    lines += ['', '## Scene recipe', '', data['recipe'], '']
    lines += ['## Support tables per axis pair', '']
    names = list(axes)
    for i, a in enumerate(names):
        for b in names[i+1:]:
            cells = data['pairs'][f'{a}|{b}']
            lines.append(f'### {C.AXIS_LABELS[a]} × {C.AXIS_LABELS[b]}')
            lines.append('')
            lines.append('| '+C.AXIS_LABELS[a]+' \\ '+C.AXIS_LABELS[b]+' | '+' | '.join(_label(b, v) for v in axes[b])+' |')
            lines.append('| --- |'+' --- |'*len(axes[b]))
            for va in axes[a]:
                row = []
                for vb in axes[b]:
                    cell = cells[f'{va}|{vb}']
                    if cell['status'] == 'admitted':
                        row.append(f'✓ {cell["admitted"]}/{cell["total"]}')
                    else:
                        row.append(f'✗ {cell["reason"]}')
                lines.append(f'| {_label(a, va)} | '+' | '.join(row)+' |')
            lines.append('')
    lines += ['## Lanes (admitted entry points)', '',
              '| Lane | Applies when | Code path | Test | Description |', '| --- | --- | --- | --- | --- |']
    for item in data['lanes']:
        when = '; '.join(f'{k}: {", ".join(v)}' for k, v in item['when'].items()) or 'otherwise'
        note = (' '+item['note']) if item['note'] else ''
        lines.append(f'| `{item["name"]}` | {when} | `{item["code_path"]}` | `{item["test"]}` | {item["description"]}{note} |')
    lines += ['', '## Incidence definition of plane sources', '',
              'The realized definition of an oblique source, served as the `incidence` block and reported by',
              '`torchfdtd.source_preview.preview_source`; a fixed-angle source has no code path and is refused.', '',
              '| Definition | Status | Code path | Statement |', '| --- | --- | --- | --- |']
    for name, item in data['incidence'].items():
        text = item.get('description') or item.get('message', '')
        lines.append(f'| `{name}` | {item["status"]} | `{item["code_path"]}` | {text} |')
    lines += ['', '## Rules (rejections, in the order the code checks them)', '',
              '| # | Rule | Applies when | Stage | Code path | Exception | Message prefix |',
              '| --- | --- | --- | --- | --- | --- | --- |']
    for index, item in enumerate(data['rules'], 1):
        when = '; '.join(f'{k}: {", ".join(v)}' for k, v in item['when'].items())
        if item['executions']:
            when += f' (executions: {", ".join(item["executions"])})'
        message = item['message'].replace('|', '\\|')
        note = (' '+item['note']) if item['note'] else ''
        lines.append(f'| {index} | `{item["name"]}` | {when} | {item["stage"]} | `{item["code_path"]}` | {item["exception"]} | {message}{note} |')
    lines.append('')
    return '\n'.join(lines)


def build():
    data = C.registry_json()
    return render_markdown(data), json.dumps(data, indent=1, ensure_ascii=False)+'\n'


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='exit 1 when the committed files are stale')
    args = parser.parse_args(argv)
    markdown, payload = build()
    stale = []
    for path, content in ((MARKDOWN, markdown), (JSON, payload)):
        current = path.read_text(encoding='utf-8') if path.exists() else None
        if current != content:
            stale.append(path)
            if not args.check:
                path.write_text(content, encoding='utf-8', newline='\n')
    if args.check and stale:
        print('stale: '+', '.join(str(p.relative_to(ROOT)) for p in stale))
        return 1
    print('up to date' if not stale else 'wrote: '+', '.join(str(p.relative_to(ROOT)) for p in stale))
    return 0


if __name__ == '__main__':
    sys.exit(main())
