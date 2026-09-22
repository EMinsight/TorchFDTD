"""Judge the completion gates from their recorded evidence.

Exit status 0 means every required task of the chosen profile is VERIFIED by an
evidence record that still matches the current checkout. Anything else exits 1:
a task that is not VERIFIED or is FAILED, a missing or unreadable evidence file,
a VERIFIED state without evidence behind it, evidence whose source commit is
not an ancestor of HEAD or whose test sources, fixtures or criteria have since
changed, a skipped or absent required test, a skipped GPU-required test (a skip
whose reason names CUDA, CuPy or a GPU and is not an optional platform check),
a copied JUnit report that does not restate evidence.json or its stored hash,
a partial run of a file-level required test (the recorder enumerates the file),
evidence recorded with --allow-dirty, a watched data file (the task's
``watch_paths``) that changed or appeared since the run, or an unresolved
external blocker. Warnings never decide: a run that started before its commit,
a case file first committed with or after its evidence, a dirty tree at
recording, an un-enumerated file-level entry from before that rule, and a
scope change (revised case or a limit looser than the program threshold)
whose ``scope_change_approval`` is still null are printed and listed by the
validation report for the owner.
`--allow-stale` downgrades only the stale-evidence reasons and is reported loudly.
"""
import argparse
import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from release_audit import file_sha256, gpu_required_skips  # noqa: E402
from record_gate_evidence import commit_time, expand_watch_paths, optional_skip, parse_junit, parse_timestamp  # noqa: E402

GATE_FILE = Path('docs') / 'validation' / 'completion_gates.json'
RUNS_DIR = Path('docs') / 'validation' / 'runs'
STALE = 'STALE'


def repo_root():
    return Path(__file__).resolve().parents[1]


def is_ancestor(root, commit):
    try:
        completed = subprocess.run(['git', 'merge-base', '--is-ancestor', commit, 'HEAD'], cwd=root, capture_output=True)
    except OSError:
        return False
    return completed.returncode == 0


def head(root):
    try:
        return subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=root, capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return None


def matches(required, test_id):
    if required.endswith('.py'):
        return test_id.startswith(required + '::')
    return test_id == required or test_id.startswith(required + '[')


def validate_gates(gates):
    problems = []
    seen = set()
    states_v = set(gates.get('verification_states', []))
    states_i = set(gates.get('implementation_states', []))
    for stage in gates.get('stages', []):
        for task in stage.get('tasks', []):
            if task['id'] in seen:
                problems.append(f"duplicate task id {task['id']}")
            seen.add(task['id'])
            if task.get('verification_state') not in states_v:
                problems.append(f"{task['id']}: unknown verification_state {task.get('verification_state')!r}")
            if task.get('implementation_state') not in states_i:
                problems.append(f"{task['id']}: unknown implementation_state {task.get('implementation_state')!r}")
            watch = task.get('watch_paths')
            if watch is not None and not (isinstance(watch, list) and all(isinstance(item, str) and item for item in watch)):
                problems.append(f"{task['id']}: watch_paths must be a list of file paths or globs relative to the root")
    return problems


def hard_skips(results):
    """Skipped test ids whose reason is not an optional platform check (tests/conftest.py prefixes those)."""
    reasons = results.get('skipped_reasons') or {}
    return [test for test in results.get('skipped', []) if not optional_skip(reasons.get(test))]


def leaves(node, path):
    if isinstance(node, dict):
        for key, value in node.items():
            yield from leaves(value, f'{path}/{key}')
    elif isinstance(node, list):
        for index, value in enumerate(node):
            yield from leaves(value, f'{path}[{index}]')
    else:
        yield path, node


def scope_change_reasons(root, gates, task):
    """Why a task's case files amount to a scope change that needs the owner's approval; empty when none or when approved."""
    if task.get('scope_change_approval'):
        return []
    loosest = {}
    for value in (gates.get('proposed_thresholds') or {}).values():
        if isinstance(value, dict):
            for key in ('rtol', 'atol'):
                if isinstance(value.get(key), (int, float)):
                    loosest[key] = max(loosest.get(key, 0), value[key])
    reasons = []
    for path in sorted((root / 'docs' / 'validation' / 'cases').glob(f"{task['id']}*.json"), key=lambda p: p.name):
        try:
            case = json.loads(path.read_text(encoding='utf-8'))
        except (OSError, ValueError):
            continue
        if case.get('task') not in (None, task['id']):
            continue
        name = path.relative_to(root).as_posix()
        for key in ('supersedes', 'superseded_by', 'revision_of', 'revises', 'replaces'):
            if case.get(key):
                reasons.append(f'{name} declares {key} (a revised case)')
        for where, value in leaves(case.get('acceptance') or {}, 'acceptance'):
            key = where.rsplit('/', 1)[-1]
            if key in ('difference_from_common_criterion', 'looser_than_program_thresholds'):
                reasons.append(f'{name} {where} states a limit looser than the program threshold')
            elif key in loosest and isinstance(value, (int, float)) and not isinstance(value, bool) and value > loosest[key]:
                reasons.append(f'{name} {where} = {value} is looser than the loosest program {key} {loosest[key]}')
            elif isinstance(value, str) and 'declared not applicable' in value:
                reasons.append(f'{name} {where} declares a program threshold not applicable')
    return reasons


def pending_scope_changes(root, gates):
    """Task id -> reasons, for every task whose case files declare a scope change without scope_change_approval."""
    out = {}
    for stage in gates.get('stages', []):
        for task in stage.get('tasks', []):
            reasons = scope_change_reasons(root, gates, task)
            if reasons:
                out[task['id']] = reasons
    return out


def judge_task(root, gates, task, runs_dir):
    """Return (failures, stale, warnings) for one task; empty failures and stale mean the task passes."""
    failures, stale, warnings = [], [], []
    state = task.get('verification_state')
    if task.get('blocker'):
        failures.append(f"external blocker unresolved: {task['blocker']}")
    if state == 'FAILED':
        failures.append('verification_state is FAILED')
        return failures, stale, warnings
    if state != 'VERIFIED':
        failures.append(f'verification_state is {state}')
        return failures, stale, warnings
    evidence_ids = task.get('evidence') or []
    if not evidence_ids:
        failures.append('VERIFIED without any evidence run')
        return failures, stale, warnings
    run_id = evidence_ids[-1]
    path = runs_dir / run_id / 'evidence.json'
    if not path.is_file():
        failures.append(f'evidence file missing: {path.as_posix()}')
        return failures, stale, warnings
    try:
        evidence = json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        failures.append(f'evidence unreadable: {error}')
        return failures, stale, warnings
    if evidence.get('task') != task['id']:
        failures.append(f"evidence {run_id} belongs to task {evidence.get('task')!r}")
    if evidence.get('verification_state_assigned') != 'VERIFIED':
        failures.append(f"latest evidence {run_id} assigned {evidence.get('verification_state_assigned')!r}, so the VERIFIED state was not set by the recorder")
    missing = [field for field in gates.get('required_evidence_fields', []) if field not in evidence]
    if missing:
        failures.append('evidence lacks required fields: ' + ', '.join(missing))
    results = evidence.get('test_results') or {}
    # The copied JUnit report is the record; evidence.json must restate it, not replace it.
    junit_copy = runs_dir / run_id / 'junit.xml'
    stored = next((a for a in evidence.get('artifact_paths_and_sha256') or [] if str(a.get('path', '')).endswith('/junit.xml')), None)
    if not junit_copy.is_file():
        failures.append('junit copy missing from the run directory')
    else:
        if stored and file_sha256(junit_copy) != stored.get('sha256'):
            failures.append('junit copy does not match the SHA-256 stored in the evidence')
        try:
            reparsed, _, _ = parse_junit(root, junit_copy)
        except ET.ParseError as error:
            reparsed = None
            failures.append(f'junit copy unreadable: {error}')
        if reparsed is not None:
            differing = [key for key in ('passed', 'failed', 'errors', 'skipped') if sorted(reparsed.get(key, [])) != sorted(results.get(key, []))]
            if differing:
                failures.append('evidence does not match its junit: ' + ', '.join(differing) + ' differ')
            else:
                results = reparsed
    if results.get('failed') or results.get('errors'):
        failures.append('evidence records failed or errored tests')
    if evidence.get('exit_code') != 0:
        failures.append(f"evidence exit code is {evidence.get('exit_code')}")
    if evidence.get('skipped_required_tests'):
        failures.append('required tests skipped: ' + ', '.join(evidence['skipped_required_tests']))
    gpu_skips = evidence.get('gpu_required_skips')
    if gpu_skips is None:  # evidence recorded before the field existed is classified from its skip reasons
        gpu_skips = gpu_required_skips(results.get('skipped_reasons'))
    if gpu_skips:
        failures.append('GPU-required tests skipped in a required run: ' + ', '.join(gpu_skips))
    ran = [*results.get('passed', []), *results.get('failed', []), *results.get('errors', []), *results.get('skipped', [])]
    skipped = hard_skips(results)
    for required in task.get('required_tests') or []:
        if any(matches(required, s) for s in skipped):
            failures.append(f'required test skipped: {required}')
        elif not any(matches(required, r) for r in ran):
            failures.append(f'required test absent from evidence: {required}')
    enumerated = evidence.get('enumerated_required_tests')
    required_files = [entry for entry in task.get('required_tests') or [] if entry.endswith('.py')]
    if enumerated is None and required_files:
        warnings.append('file-level required tests were not enumerated at recording time (evidence predates that rule); a partial run cannot be excluded')
    for file, tests in (enumerated or {}).items():
        absent = [test for test in tests if test not in ran]
        skipped_here = [test for test in tests if test in skipped]
        if skipped_here:
            failures.append(f'collected tests of {file} skipped: ' + ', '.join(skipped_here))
        if absent:
            failures.append(f'collected tests of {file} absent from the junit (partial run): ' + ', '.join(absent))
    if evidence.get('dirty_allowed'):
        failures.append(f"recorded with --allow-dirty ({evidence.get('dirty_allowed_reason')}): dirty guarded paths "
                        + ', '.join(evidence.get('dirty_guarded_paths') or []))
    commit = evidence.get('source_commit')
    if not commit or not is_ancestor(root, commit):
        stale.append(f'source commit {commit} is not an ancestor of HEAD')
    for test_path, recorded in (evidence.get('test_source_sha256') or {}).items():
        current = root / test_path
        if not current.is_file():
            stale.append(f'test source missing: {test_path}')
        elif file_sha256(current) != recorded:
            stale.append(f'test source changed since the run: {test_path}')
    for label, path_key, hash_key in (('fixture', 'fixture_path', 'fixture_sha256'),
                                      ('acceptance criteria', 'acceptance_criteria_path', 'acceptance_criteria_sha256')):
        recorded_path, recorded_hash = evidence.get(path_key), evidence.get(hash_key)
        if recorded_path and recorded_hash:
            current = root / recorded_path
            if not current.is_file():
                stale.append(f'{label} file missing: {recorded_path}')
            elif file_sha256(current) != recorded_hash:
                stale.append(f'{label} changed since the run: {recorded_path}')
    watched = evidence.get('watch_sha256')
    patterns = task.get('watch_paths') or []
    if patterns and watched is None:
        stale.append('the task watches data files but the evidence predates the watch list: ' + ', '.join(patterns))
    for watch_path, recorded in (watched or {}).items():
        current = root / watch_path
        if not current.is_file():
            stale.append(f'watched file missing: {watch_path}')
        elif file_sha256(current) != recorded:
            stale.append(f'watched file changed since the run: {watch_path}')
    if watched is not None:
        for watch_path in expand_watch_paths(root, patterns):
            if watch_path not in watched:
                stale.append(f'a file matching a watched pattern did not exist at recording: {watch_path}')
    if evidence.get('unresolved_test_classnames'):
        failures.append('evidence has unresolved test sources: ' + ', '.join(evidence['unresolved_test_classnames']))
    if evidence.get('dirty_source_manifest'):
        warnings.append(f"evidence was recorded on a dirty tree ({len(evidence['dirty_source_manifest'])} paths); it is not tied to commit {str(commit)[:12]} alone")
    precommit = evidence.get('junit_started_before_commit')
    if precommit is None and commit and evidence.get('execution_timestamp'):
        try:
            precommit = parse_timestamp(evidence['execution_timestamp']) < commit_time(root, commit)
        except (ValueError, subprocess.CalledProcessError):
            precommit = None
    if precommit:
        warnings.append(f"run predates its commit: the tests started at {evidence.get('execution_timestamp')} before commit {str(commit)[:12]} was made"
                        + (f" ({evidence['precommit_junit_reason']})" if evidence.get('precommit_junit_reason') else ''))
    if evidence.get('declared_before_run_verified') is False:
        warnings.append(f"declaration order not verified: {evidence.get('declaration_note') or 'the case file was not committed before the run'}")
    reasons = scope_change_reasons(root, gates, task)
    if reasons:
        warnings.append(f'scope change pending approval ({len(reasons)} declaration(s), scope_change_approval is null): ' + reasons[0]
                        + (f'; and {len(reasons) - 1} more' if len(reasons) > 1 else ''))
    return failures, stale, warnings


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--profile', default='WORKSTATION', help='release profile from the gate file (default WORKSTATION)')
    parser.add_argument('--task', default=None, help='judge one task id only')
    parser.add_argument('--allow-stale', action='store_true', help='accept evidence from non-ancestor commits or changed test sources; reported loudly and never a release judgement')
    parser.add_argument('--root', default=None, help='repository root (default: the checkout containing this script)')
    parser.add_argument('--gates', default=None, help='gate file (default: docs/validation/completion_gates.json under root)')
    parser.add_argument('--runs-dir', default=None, help='evidence directory (default: docs/validation/runs under root)')
    args = parser.parse_args(argv)
    root = Path(args.root).resolve() if args.root else repo_root()
    gate_path = Path(args.gates) if args.gates else root / GATE_FILE
    runs_dir = Path(args.runs_dir) if args.runs_dir else root / RUNS_DIR
    try:
        gates = json.loads(gate_path.read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        print(f'gate file unreadable: {gate_path}: {error}')
        return 2
    problems = validate_gates(gates)
    if problems:
        print('gate file invalid:')
        for problem in problems:
            print('  ' + problem)
        return 2
    if gates.get('kind') != 'completion_gates':
        print(f"gate file kind is {gates.get('kind')!r}, not 'completion_gates'")
        return 2

    all_tasks = [(stage, task) for stage in gates['stages'] for task in stage['tasks']]
    if args.task:
        selected = [(stage, task) for stage, task in all_tasks if task['id'] == args.task]
        if not selected:
            print(f'unknown task id {args.task!r}')
            return 2
        required_stage_ids = None
    else:
        profile = gates.get('profiles', {}).get(args.profile)
        if profile is None:
            print(f'unknown profile {args.profile!r}; known: {", ".join(gates.get("profiles", {}))}')
            return 2
        required_stage_ids = list(profile['required_stages'])
        selected = [(stage, task) for stage, task in all_tasks if stage['id'] in required_stage_ids]

    banner = '!!! --allow-stale is set: stale evidence is accepted below. This output is NOT a release judgement. !!!'
    if args.allow_stale:
        print(banner)
    current_head = head(root)
    print(f"gate file: {gate_path.as_posix()} (adopted at {gates.get('adopted_commit')}); HEAD: {current_head}")
    if args.task:
        print(f'judging task {args.task} only')
    else:
        print(f"profile: {args.profile}; required stages: {', '.join(required_stage_ids)}; scope status: {profile.get('scope_status')}")
    rule = gates.get('release_rule') or {}
    print('release rule: ' + ', '.join(f'{key}={value}' for key, value in rule.items()))

    header = f"{'stage':<6} {'task':<7} {'impl':<14} {'verification':<17} {'evid':>4}  judgement / first reason"
    print(header)
    print('-' * len(header))
    counts = dict(PASS=0, FAIL=0, STALE_ACCEPTED=0)
    stale_accepted = []
    all_warnings = []
    for stage, task in selected:
        if task.get('required_by_current_plan') is False:
            judgement, reason = 'optional', 'not required by the current plan'
        else:
            failures, stale, warnings = judge_task(root, gates, task, runs_dir)
            all_warnings += [(task['id'], warning) for warning in warnings]
            if failures:
                judgement, reason = 'FAIL', failures[0]
                counts['FAIL'] += 1
            elif stale and not args.allow_stale:
                judgement, reason = 'FAIL', STALE + ': ' + stale[0]
                counts['FAIL'] += 1
            elif stale:
                judgement, reason = 'STALE-ACCEPTED', stale[0]
                counts['STALE_ACCEPTED'] += 1
                stale_accepted.append(task['id'])
            else:
                judgement, reason = 'PASS', (warnings[0] if warnings else 'evidence matches the current checkout')
                counts['PASS'] += 1
            if warnings and judgement != 'PASS':
                reason += f' (+{len(warnings)} warning)'
        print(f"{stage['id']:<6} {task['id']:<7} {task.get('implementation_state', ''):<14} {task.get('verification_state', ''):<17} "
              f"{len(task.get('evidence') or []):>4}  {judgement}: {reason}")

    failed_elsewhere = [task['id'] for stage, task in all_tasks
                        if task.get('verification_state') == 'FAILED' and (stage, task) not in selected]
    if failed_elsewhere:
        counts['FAIL'] += len(failed_elsewhere)
        print('FAILED tasks outside the selection: ' + ', '.join(failed_elsewhere))

    if all_warnings:
        print(f'warnings ({len(all_warnings)}; a warning never passes or fails a task by itself):')
        for task_id, warning in all_warnings:
            print(f'  {task_id}: {warning}')
    pending = {task_id: reasons for task_id, reasons in pending_scope_changes(root, gates).items()
               if args.task is None or task_id == args.task}
    if pending:
        print('scope changes pending owner approval (scope_change_approval is null): ' + ', '.join(pending))
    print(f"summary: {counts['PASS']} pass, {counts['FAIL']} fail, {counts['STALE_ACCEPTED']} stale accepted, {len(selected)} judged")
    if args.allow_stale:
        print(banner)
        if stale_accepted:
            print('stale evidence accepted for: ' + ', '.join(stale_accepted))
    if counts['FAIL']:
        print('RESULT: NOT RELEASABLE')
        return 1
    if args.allow_stale and counts['STALE_ACCEPTED']:
        print('RESULT: all judged tasks pass only with stale evidence accepted; rerun without --allow-stale for a release judgement')
        return 0
    print('RESULT: all judged tasks pass' if args.task is None else f'RESULT: {args.task} passes')
    return 0


if __name__ == '__main__':
    sys.exit(main())
