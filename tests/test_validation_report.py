"""docs/VALIDATION_REPORT.md is the renderer's output for the committed records, and it says what it must and must not say (G9-07)."""
import importlib.util
import json
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / 'docs' / 'VALIDATION_REPORT.md'
SCOPE = ROOT / 'docs' / 'RELEASE_SCOPE.md'
FORBIDDEN = ('certificate', 'certified', 'certification', 'certify')


def load_script(name):
    spec = importlib.util.spec_from_file_location(name, ROOT / 'scripts' / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


builder = load_script('build_validation_report')


@pytest.fixture(scope='module')
def rendered():
    return builder.render(ROOT, check_scope=True)


def test_report_is_the_renderer_output_for_the_current_tree(rendered, tmp_path):
    fresh = tmp_path / 'VALIDATION_REPORT.md'
    fresh.write_bytes(rendered['report'].encode('utf-8'))
    assert fresh.read_bytes() == REPORT.read_bytes(), \
        'docs/VALIDATION_REPORT.md differs from a fresh render of the records; run scripts/build_validation_report.py on a clean tree'


def test_release_scope_cells_and_stage_block_match_the_gate_file(rendered):
    assert rendered['scope_cells'] >= 20
    assert not rendered['scope_changed'], 'docs/RELEASE_SCOPE.md verification cells or stage block drifted from the gate file; rerun the builder'
    text = SCOPE.read_text(encoding='utf-8')
    assert text.count(builder.STAGE_BEGIN) == 1 and text.count(builder.STAGE_END) == 1
    gates = json.loads((ROOT / 'docs' / 'validation' / 'completion_gates.json').read_text(encoding='utf-8'))
    block = text[text.index(builder.STAGE_BEGIN):text.index(builder.STAGE_END)]
    for stage in gates['stages']:
        assert f"| {stage['id']} |" in block


def test_report_title_and_forbidden_words():
    text = REPORT.read_text(encoding='utf-8')
    assert text.startswith('# TorchFDTD internal validation report\n')
    assert 'internal validation report' in text.lower()
    lower = text.lower()
    for word in FORBIDDEN:
        assert word not in lower, word
    assert '**PROVISIONAL**' not in text, 'the committed report must be rendered on a clean tree'


def test_consistency_section_reports_no_mismatch(rendered):
    failing = [(name, detail) for name, ok, detail in rendered['checks'] if not ok]
    assert not failing, failing
    consistency = rendered['report'].split('## Consistency', 1)[1]
    assert '**MISMATCH**' not in consistency and ', 0 mismatch(es).' in consistency
    names = [name for name, _, _ in rendered['checks']]
    assert 'package version' in names and 'RELEASE_SCOPE.md support claims' in names and 'attestation wording' in names
    assert sum(name.startswith('README row check') for name in names) >= 5
    assert 'third-party notices and SBOM' in names


def test_platform_section_lists_every_record_with_its_g4_evidence(rendered):
    section = rendered['report'].split('## Platform records', 1)[1].split('\n## ', 1)[0]
    records = sorted((ROOT / 'docs' / 'validation' / 'platforms').glob('*.json'))
    assert len(records) >= 2
    for path in records:
        platform_id = json.loads(path.read_text(encoding='utf-8'))['platform_id']
        assert section.count(f'| {platform_id} |') == 2, platform_id
    gates = json.loads((ROOT / 'docs' / 'validation' / 'completion_gates.json').read_text(encoding='utf-8'))
    g4 = next(stage for stage in gates['stages'] if stage['id'] == 'G4')
    for task in g4['tasks']:
        if task['evidence']:
            assert f"{task['id']} `{task['evidence'][-1]}`" in section


def test_report_lists_every_gate_task_and_every_g3_task_once(rendered):
    gates = json.loads((ROOT / 'docs' / 'validation' / 'completion_gates.json').read_text(encoding='utf-8'))
    report = rendered['report']
    physics = report.split('## Physics validation (stage G3)', 1)[1].split('\n## ', 1)[0]
    for stage in gates['stages']:
        for task in stage['tasks']:
            assert f"| {task['id']} | " in report
            if stage['id'] == 'G3':
                assert physics.count(f"| {task['id']} | ") == 1
    assert '**FAIL**' in physics or 'FAILED' in physics  # the recorded G3-05 and G3-08 findings stay visible


def test_check_mode_passes_on_the_committed_tree(capsys):
    assert builder.main(['--check']) == 0
    out = capsys.readouterr().out
    assert 'report matches docs/VALIDATION_REPORT.md' in out and 'MISMATCH' not in out


def test_scope_cells_are_regenerated_only_where_they_state_a_gate_result():
    gates = dict(stages=[dict(id='G4', tasks=[
        dict(id='G4-01', verification_state='VERIFIED', blocker=None), dict(id='G4-02', verification_state='VERIFIED', blocker=None),
        dict(id='G4-03', verification_state='NOT_RUN', blocker=None), dict(id='G4-04', verification_state='NOT_RUN', blocker='BLOCKED_EXTERNAL: x')])])
    assert builder.task_ids_in('NOT_RUN (G4-01 to G4-03)', gates) == ['G4-01', 'G4-02', 'G4-03']
    assert builder.render_cell(['G4-01', 'G4-02'], gates) == 'VERIFIED (G4-01, G4-02)'
    assert builder.render_cell(['G4-01', 'G4-03', 'G4-04'], gates) == 'MIXED: VERIFIED G4-01; NOT_RUN G4-03; BLOCKED_EXTERNAL G4-04'
    document = '\n'.join([
        '| Row | Implemented scope and record | Verified for release |', '| --- | --- | --- |',
        '| A | N-port \\|S_ij\\|² objectives | NOT_RUN (G4-01 to G4-02) |',
        '| B | prose | Not a gate row; decision pending (G4-03) |',
        '| C | prose | VERIFIED (G4-01, G4-04) |', '',
        '| Other | table | without the column |', '| --- | --- | --- |', '| x | NOT_RUN (G4-01) | y |', '',
        '## Stage status', '', builder.STAGE_BEGIN, 'old', builder.STAGE_END, ''])

    gates.update(profiles={}, stages=[dict(id='G4', title='cuda', profile='WORKSTATION', tasks=gates['stages'][0]['tasks'])])
    verdicts = {task['id']: (('PASS', 'ok') if task['verification_state'] == 'VERIFIED' else ('FAIL', 'not verified'))
                for task in gates['stages'][0]['tasks']}
    text, count = builder.render_scope(document, gates, verdicts)
    again, _ = builder.render_scope(text, gates, verdicts)
    assert count == 2
    lines = text.split('\n')
    assert lines[2] == '| A | N-port \\|S_ij\\|² objectives | VERIFIED (G4-01, G4-02) |'
    assert lines[3] == '| B | prose | Not a gate row; decision pending (G4-03) |'
    assert lines[4] == '| C | prose | MIXED: VERIFIED G4-01; BLOCKED_EXTERNAL G4-04 |'
    assert lines[8] == '| x | NOT_RUN (G4-01) | y |'
    assert 'old' not in text and '| G4 | cuda | WORKSTATION | 4 | 2 | 0 | 1 | 1 | 2 pass, 2 fail |' in text
    assert again == text
