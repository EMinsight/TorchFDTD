"""Failure-injection tests of the completion-gate recorder and judge on a temporary repository."""
import importlib.util
import json
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / 'scripts'
REAL_GATES = ROOT / 'docs' / 'validation' / 'completion_gates.json'


def load_script(name):
    spec = importlib.util.spec_from_file_location(name, SCRIPTS / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module


recorder = load_script('record_gate_evidence')
judge = load_script('check_release_gates')

TEST_SOURCE = 'def test_one():\n    assert True\n\n\ndef test_two():\n    assert True\n'


def git(root, *args):
    return subprocess.run(['git', '-c', 'user.name=gate', '-c', 'user.email=gate@example.invalid',
                           '-c', 'core.autocrlf=false', '-c', 'commit.gpgsign=false', *args],
                          cwd=root, capture_output=True, text=True, check=True).stdout.strip()


def junit(path, cases):
    """Write a pytest-shaped JUnit file; cases are (classname, name, outcome) with outcome pass/fail/skip/error.

    ``outcome`` may also be ``('skip', reason)`` to inject a specific skip reason.
    """
    rows = []
    for classname, name, outcome in cases:
        reason = 'injected skip'
        if isinstance(outcome, tuple):
            outcome, reason = outcome
        inner = {'pass': '', 'fail': '<failure message="injected failure">assert False</failure>',
                 'error': '<error message="injected error">boom</error>',
                 'skip': f'<skipped type="pytest.skip" message="{reason}">{reason}</skipped>'}[outcome]
        rows.append(f'<testcase classname="{classname}" name="{name}" time="0.001">{inner}</testcase>')
    counts = dict(tests=len(cases), failures=sum(o == 'fail' for _, _, o in cases),
                  errors=sum(o == 'error' for _, _, o in cases), skipped=sum(o == 'skip' for _, _, o in cases))
    path.write_text('<?xml version="1.0" encoding="utf-8"?><testsuites><testsuite name="pytest" '
                    + ' '.join(f'{k}="{v}"' for k, v in counts.items())
                    + ' time="0.01" timestamp="2026-09-21T12:00:00.000000+09:00">' + ''.join(rows)
                    + '</testsuite></testsuites>', encoding='utf-8')
    return path


@pytest.fixture
def repo(tmp_path):
    """A committed miniature repository with the real gate-file contract and two tasks."""
    root = tmp_path / 'repo'
    (root / 'tests').mkdir(parents=True)
    (root / 'docs' / 'validation' / 'runs').mkdir(parents=True)
    (root / 'tests' / 'test_alpha.py').write_text(TEST_SOURCE, encoding='utf-8')
    real = json.loads(REAL_GATES.read_text(encoding='utf-8'))

    def task(task_id, title, required_tests=()):
        return dict(id=task_id, title=title, specification=title, required_by_current_plan=True,
                    implementation_state='IMPLEMENTED', verification_state='NOT_RUN', owner=None, code_paths=[],
                    planned_test_commands=[], actual_test_commands=[], required_tests=list(required_tests), evidence=[],
                    blocker=None, scope_change_approval=None)

    gates = {key: real[key] for key in ('schema_version', 'kind', 'profiles', 'implementation_states', 'verification_states',
                                        'required_evidence_fields', 'release_rule')}
    gates['adopted_commit'] = None
    gates['profiles'] = {'WORKSTATION': {'required_stages': ['G0', 'G1'], 'scope_status': 'TEST'},
                         'HPC': {'required_stages': ['G0', 'G1', 'H1'], 'scope_status': 'TEST'}}
    gates['stages'] = [
        dict(id='G0', title='baseline', depends_on_stages=[], profile='WORKSTATION', priority='P0',
             tasks=[task('G0-01', 'baseline check')]),
        dict(id='G1', title='regressions', depends_on_stages=['G0'], profile='WORKSTATION', priority='P0',
             tasks=[task('G1-03', 'allocation scaling', ['tests/test_alpha.py::test_two'])]),
        dict(id='H1', title='hpc', depends_on_stages=['G1'], profile='HPC', priority='P1',
             tasks=[dict(task('H1-02', 'two gpu'), blocker='BLOCKED_EXTERNAL: no second GPU')]),
    ]
    gate_path = root / 'docs' / 'validation' / 'completion_gates.json'
    gate_path.write_text(json.dumps(gates, indent=2) + '\n', encoding='utf-8')
    git(root, 'init', '-q')
    git(root, 'add', '.')
    git(root, 'commit', '-q', '-m', 'baseline')
    return root


def record(root, task_id, junit_path, **extra):
    argv = ['--root', str(root), '--task', task_id, '--command', f'pytest tests/test_alpha.py ({task_id})', '--junit', str(junit_path)]
    for key, value in extra.items():
        argv += [f'--{key.replace("_", "-")}', str(value)]
    return recorder.main(argv)


def gates_of(root):
    return json.loads((root / 'docs' / 'validation' / 'completion_gates.json').read_text(encoding='utf-8'))


def task_of(root, task_id):
    return next(t for s in gates_of(root)['stages'] for t in s['tasks'] if t['id'] == task_id)


def judge_run(root, capsys, *args):
    code = judge.main(['--root', str(root), *args])
    return code, capsys.readouterr().out


def passing_junit(tmp_path):
    return junit(tmp_path / 'pass.xml', [('tests.test_alpha', 'test_one', 'pass'), ('tests.test_alpha', 'test_two', 'pass')])


def test_passing_junit_records_verified_evidence_with_every_required_field(repo, tmp_path, capsys):
    assert record(repo, 'G1-03', passing_junit(tmp_path)) == 0
    task = task_of(repo, 'G1-03')
    assert task['verification_state'] == 'VERIFIED'
    assert len(task['evidence']) == 1 and task['actual_test_commands'] == ['pytest tests/test_alpha.py (G1-03)']
    run_dir = repo / 'docs' / 'validation' / 'runs' / task['evidence'][0]
    evidence = json.loads((run_dir / 'evidence.json').read_text(encoding='utf-8'))
    assert (run_dir / 'junit.xml').is_file()
    for field in gates_of(repo)['required_evidence_fields']:
        assert field in evidence, field
    for field in ('fixture_sha256', 'acceptance_criteria_sha256', 'package_or_wheel_sha256', 'seed', 'observed_metrics'):
        assert evidence[field] is None and field in evidence['null_reasons']
    assert evidence['source_commit'] == git(repo, 'rev-parse', 'HEAD')
    assert evidence['dirty_source_manifest'] == []
    assert evidence['test_source_sha256'] == {'tests/test_alpha.py': recorder.file_sha256(repo / 'tests' / 'test_alpha.py')}
    assert evidence['test_results']['passed'] == ['tests/test_alpha.py::test_one', 'tests/test_alpha.py::test_two']
    assert evidence['skipped_required_tests'] == [] and evidence['exit_code'] == 0
    assert evidence['environment']['python'] and 'cpu_model' in evidence['hardware']
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 0 and 'G1-03 passes' in out


def test_injected_failure_marks_failed_and_judge_rejects(repo, tmp_path, capsys):
    failing = junit(tmp_path / 'fail.xml', [('tests.test_alpha', 'test_one', 'pass'), ('tests.test_alpha', 'test_two', 'fail')])
    record(repo, 'G1-03', failing)
    assert task_of(repo, 'G1-03')['verification_state'] == 'FAILED'
    assert '-> FAILED' in capsys.readouterr().out
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'verification_state is FAILED' in out and 'NOT RELEASABLE' in out


def test_injected_error_marks_failed(repo, tmp_path):
    erroring = junit(tmp_path / 'error.xml', [('tests.test_alpha', 'test_one', 'error'), ('tests.test_alpha', 'test_two', 'pass')])
    record(repo, 'G1-03', erroring)
    assert task_of(repo, 'G1-03')['verification_state'] == 'FAILED'


def test_skipped_required_test_stays_not_run_and_judge_exits_nonzero(repo, tmp_path, capsys):
    skipping = junit(tmp_path / 'skip.xml', [('tests.test_alpha', 'test_one', 'pass'), ('tests.test_alpha', 'test_two', 'skip')])
    record(repo, 'G1-03', skipping)
    out = capsys.readouterr().out
    task = task_of(repo, 'G1-03')
    assert task['verification_state'] == 'NOT_RUN' and len(task['evidence']) == 1
    assert 'required tests were skipped: tests/test_alpha.py::test_two' in out
    evidence = json.loads((repo / 'docs' / 'validation' / 'runs' / task['evidence'][0] / 'evidence.json').read_text(encoding='utf-8'))
    assert evidence['skipped_required_tests'] == ['tests/test_alpha.py::test_two']
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'verification_state is NOT_RUN' in out


def test_skipped_unrequired_test_still_verifies_but_required_absence_does_not(repo, tmp_path):
    skipping = junit(tmp_path / 'skip.xml', [('tests.test_alpha', 'test_one', 'skip'), ('tests.test_alpha', 'test_two', 'pass')])
    record(repo, 'G0-01', skipping)
    assert task_of(repo, 'G0-01')['verification_state'] == 'VERIFIED'
    absent = junit(tmp_path / 'absent.xml', [('tests.test_alpha', 'test_one', 'pass')])
    record(repo, 'G1-03', absent)
    assert task_of(repo, 'G1-03')['verification_state'] == 'NOT_RUN'


def test_gpu_required_skip_of_an_unlisted_test_is_a_failure(repo, tmp_path, capsys):
    """G4-05: a CUDA test that skipped in a recorded run fails the task even when required_tests does not name it."""
    skipping = junit(tmp_path / 'gpu.xml', [('tests.test_alpha', 'test_one', ('skip', 'CUDA unavailable')), ('tests.test_alpha', 'test_two', 'pass')])
    record(repo, 'G1-03', skipping)
    out = capsys.readouterr().out
    task = task_of(repo, 'G1-03')
    assert task['verification_state'] == 'FAILED'
    assert 'GPU-required tests skipped in a required run: tests/test_alpha.py::test_one' in out
    evidence = json.loads((repo / 'docs' / 'validation' / 'runs' / task['evidence'][0] / 'evidence.json').read_text(encoding='utf-8'))
    assert evidence['gpu_required_skips'] == ['tests/test_alpha.py::test_one'] and evidence['skipped_required_tests'] == []
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'verification_state is FAILED' in out


@pytest.mark.parametrize('reason', ["could not import 'cupy': No module named cupy", 'Requires installed GPU', 'CUDA GPU not available'])
def test_gpu_skip_reasons_are_classified_and_optional_checks_are_not(repo, tmp_path, reason):
    record(repo, 'G0-01', junit(tmp_path / 'gpu.xml', [('tests.test_alpha', 'test_one', ('skip', reason)), ('tests.test_alpha', 'test_two', 'pass')]))
    assert task_of(repo, 'G0-01')['verification_state'] == 'FAILED'
    optional = junit(tmp_path / 'optional.xml', [('tests.test_alpha', 'test_one', ('skip', 'optional platform check: ' + reason)),
                                                 ('tests.test_alpha', 'test_two', 'pass')])
    record(repo, 'G1-03', optional)
    task = task_of(repo, 'G1-03')
    assert task['verification_state'] == 'VERIFIED'
    evidence = json.loads((repo / 'docs' / 'validation' / 'runs' / task['evidence'][0] / 'evidence.json').read_text(encoding='utf-8'))
    assert evidence['gpu_required_skips'] == []


def test_judge_classifies_gpu_skips_in_evidence_recorded_without_the_field(repo, tmp_path, capsys):
    record(repo, 'G1-03', passing_junit(tmp_path))
    task = task_of(repo, 'G1-03')
    path = repo / 'docs' / 'validation' / 'runs' / task['evidence'][0] / 'evidence.json'
    evidence = json.loads(path.read_text(encoding='utf-8'))
    del evidence['gpu_required_skips']
    evidence['test_results']['skipped'] = ['tests/test_alpha.py::test_three']
    evidence['test_results']['skipped_reasons'] = {'tests/test_alpha.py::test_three': 'CUDA unavailable'}
    path.write_text(json.dumps(evidence, indent=2) + '\n', encoding='utf-8')
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'GPU-required tests skipped in a required run: tests/test_alpha.py::test_three' in out


def test_nonzero_exit_code_without_failures_does_not_verify(repo, tmp_path):
    record(repo, 'G1-03', passing_junit(tmp_path), exit_code=3)
    assert task_of(repo, 'G1-03')['verification_state'] == 'NOT_RUN'


def test_parametrized_required_test_matches_instances(repo, tmp_path):
    cases = [('tests.test_alpha', 'test_one', 'pass'), ('tests.test_alpha', 'test_two[cpu]', 'pass'), ('tests.test_alpha', 'test_two[cuda]', 'skip')]
    record(repo, 'G1-03', junit(tmp_path / 'param.xml', cases))
    assert task_of(repo, 'G1-03')['verification_state'] == 'NOT_RUN'


def test_modified_test_file_after_recording_is_a_hash_mismatch(repo, tmp_path, capsys):
    record(repo, 'G1-03', passing_junit(tmp_path))
    (repo / 'tests' / 'test_alpha.py').write_text(TEST_SOURCE + '\n# edited after the run\n', encoding='utf-8')
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'STALE: test source changed since the run: tests/test_alpha.py' in out
    code, out = judge_run(repo, capsys, '--task', 'G1-03', '--allow-stale')
    assert code == 0 and 'STALE-ACCEPTED' in out and 'NOT a release judgement' in out and 'stale evidence accepted for: G1-03' in out


def test_evidence_from_a_commit_that_is_not_an_ancestor_is_stale(repo, tmp_path, capsys):
    base = git(repo, 'rev-parse', 'HEAD')
    (repo / 'note.txt').write_text('second commit\n', encoding='utf-8')
    git(repo, 'add', 'note.txt')
    git(repo, 'commit', '-q', '-m', 'second')
    record(repo, 'G1-03', passing_junit(tmp_path))
    assert judge_run(repo, capsys, '--task', 'G1-03')[0] == 0
    git(repo, 'checkout', '-q', base)  # the uncommitted gate file and evidence directory carry over to the older commit
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'is not an ancestor of HEAD' in out
    code, out = judge_run(repo, capsys, '--task', 'G1-03', '--allow-stale')
    assert code == 0 and 'STALE-ACCEPTED' in out


def test_missing_evidence_file_is_reported(repo, tmp_path, capsys):
    record(repo, 'G1-03', passing_junit(tmp_path))
    run_id = task_of(repo, 'G1-03')['evidence'][0]
    (repo / 'docs' / 'validation' / 'runs' / run_id / 'evidence.json').unlink()
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'evidence file missing' in out


def test_hand_marked_verified_without_evidence_is_rejected(repo, capsys):
    gate_path = repo / 'docs' / 'validation' / 'completion_gates.json'
    gates = gates_of(repo)
    for stage in gates['stages']:
        for task in stage['tasks']:
            if task['id'] == 'G1-03':
                task['verification_state'] = 'VERIFIED'
    gate_path.write_text(json.dumps(gates, indent=2) + '\n', encoding='utf-8')
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'VERIFIED without any evidence run' in out


def test_hand_marked_verified_over_failed_evidence_is_rejected(repo, tmp_path, capsys):
    failing = junit(tmp_path / 'fail.xml', [('tests.test_alpha', 'test_one', 'fail'), ('tests.test_alpha', 'test_two', 'pass')])
    record(repo, 'G1-03', failing)
    gate_path = repo / 'docs' / 'validation' / 'completion_gates.json'
    gate_path.write_text(gate_path.read_text(encoding='utf-8').replace('"verification_state": "FAILED"', '"verification_state": "VERIFIED"'), encoding='utf-8')
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and "assigned 'FAILED'" in out


def test_profile_judgement_needs_every_required_task_and_reports_blockers(repo, tmp_path, capsys):
    record(repo, 'G1-03', passing_junit(tmp_path))
    code, out = judge_run(repo, capsys)
    assert code == 1 and 'G0-01' in out and 'verification_state is NOT_RUN' in out
    record(repo, 'G0-01', junit(tmp_path / 'g0.xml', [('tests.test_alpha', 'test_one', 'pass')]))
    code, out = judge_run(repo, capsys)
    assert code == 0 and 'all judged tasks pass' in out
    code, out = judge_run(repo, capsys, '--profile', 'HPC')
    assert code == 1 and 'external blocker unresolved: BLOCKED_EXTERNAL: no second GPU' in out


def test_failed_task_outside_the_profile_blocks_release(repo, tmp_path, capsys):
    record(repo, 'G1-03', passing_junit(tmp_path))
    record(repo, 'G0-01', junit(tmp_path / 'g0.xml', [('tests.test_alpha', 'test_one', 'pass')]))
    record(repo, 'H1-02', junit(tmp_path / 'h1.xml', [('tests.test_alpha', 'test_one', 'fail')]))
    code, out = judge_run(repo, capsys)
    assert code == 1 and 'FAILED tasks outside the selection: H1-02' in out


def test_dirty_tree_is_recorded_in_the_manifest(repo, tmp_path):
    (repo / 'tests' / 'test_alpha.py').write_text(TEST_SOURCE + '\n# uncommitted\n', encoding='utf-8')
    (repo / 'untracked.txt').write_text('x\n', encoding='utf-8')
    record(repo, 'G1-03', passing_junit(tmp_path))
    run_id = task_of(repo, 'G1-03')['evidence'][0]
    evidence = json.loads((repo / 'docs' / 'validation' / 'runs' / run_id / 'evidence.json').read_text(encoding='utf-8'))
    manifest = {row['path']: row for row in evidence['dirty_source_manifest']}
    assert manifest['tests/test_alpha.py']['status'] == 'M' and manifest['tests/test_alpha.py']['head_sha256']
    assert manifest['untracked.txt']['status'] == '??' and manifest['untracked.txt']['head_sha256'] is None


def test_fixture_and_criteria_hashes_are_recorded_and_checked(repo, tmp_path, capsys):
    case = repo / 'docs' / 'validation' / 'cases' / 'demo.json'
    case.parent.mkdir(parents=True)
    case.write_text(json.dumps(dict(fixture=dict(mesh=0.05), seed=7, precision='float32', backend='cpu',
                                    reference_method='analytic', observables=['ratio'], acceptance=dict(rtol=1e-4))) + '\n', encoding='utf-8')
    record(repo, 'G1-03', passing_junit(tmp_path), fixture=case)
    run_id = task_of(repo, 'G1-03')['evidence'][0]
    evidence = json.loads((repo / 'docs' / 'validation' / 'runs' / run_id / 'evidence.json').read_text(encoding='utf-8'))
    assert evidence['fixture_sha256'] == evidence['acceptance_criteria_sha256'] == recorder.file_sha256(case)
    assert evidence['seed'] == 7 and evidence['acceptance_limits'] == dict(rtol=1e-4) and evidence['physics_configuration'] == dict(mesh=0.05)
    assert judge_run(repo, capsys, '--task', 'G1-03')[0] == 0
    edited = case.read_text(encoding='utf-8').replace('0.0001', '0.01')
    assert edited != case.read_text(encoding='utf-8')
    case.write_text(edited, encoding='utf-8')
    code, out = judge_run(repo, capsys, '--task', 'G1-03')
    assert code == 1 and 'fixture changed since the run' in out


def test_unknown_task_is_refused(repo, tmp_path):
    with pytest.raises(SystemExit):
        record(repo, 'G9-99', passing_junit(tmp_path))


def test_repository_gate_file_is_adopted_and_not_yet_releasable(capsys):
    gates = json.loads(REAL_GATES.read_text(encoding='utf-8'))
    assert gates['kind'] == 'completion_gates' and gates['adopted_commit'] and gates['planning_snapshot_commit']
    ids = [t['id'] for s in gates['stages'] for t in s['tasks']]
    assert len(ids) == len(set(ids)) == gates['task_count']
    code = judge.main(['--root', str(ROOT)])
    out = capsys.readouterr().out
    assert code == 1 and 'NOT RELEASABLE' in out and 'verification_state is NOT_RUN' in out
