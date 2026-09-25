"""Record a full G4 run on a further platform from its JUnit reports, next to that platform's record.

The gate file keeps one evidence list per task and the judge reads its newest entry, so the
G4 runs of a second platform cannot go there without replacing the evidence of record. This
tool writes them to docs/validation/platforms/g4/<platform id>.json instead, with a byte-for-byte
copy of every JUnit report under docs/validation/platforms/g4/<platform id>/. It executes no
test: run each command first with --junitxml, then pass every report with the exact command,
the G4 task whose planned command it replays (``suite`` for scripts/run_suite.py) and its exit
status. Commands run from the checkout root and name no home directory, since the record keeps them.

    python scripts/record_platform_g4.py --platform rtx3060-wsl2-ubuntu2204 \\
        --run g4-01 G4-01 0 .local/tmp/junit/linux/g4-01.xml "python -m pytest -q ... --junitxml=..." \\
        --run gpu-nightly suite 0 .local/tmp/junit/linux/gpu-nightly.xml "python scripts/run_suite.py gpu-nightly --junitxml=..."

The record states, per run, the counts and every test that did not pass, and, per G4 task,
every test its required_tests name (a file entry enumerated with pytest --collect-only through
the task's own command) with its outcome in the task's runs and the suite run. The tree must be
clean and every report must start after the source commit was made.
tests/test_platform_matrix.py re-parses the copies against the record.
"""
import argparse
import datetime
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import record_gate_evidence as recorder  # noqa: E402

RECORD_VERSION = 1
PLATFORMS = Path('docs') / 'validation' / 'platforms'
SUITE = 'suite'


def outcome(results, test_id):
    for key, name in (('passed', 'passed'), ('failed', 'failed'), ('errors', 'error'), ('skipped', 'skipped')):
        if test_id in results[key]:
            return name
    return 'absent'


def run_entry(label, task, exit_code, copy, command, results, root):
    return dict(label=label, task=task, command=command, exit_code=exit_code, junit=recorder.relative(root, copy),
                junit_sha256=recorder.file_sha256(copy), started=results['suite_timestamp'],
                time_seconds=round(results['suite_time_seconds'], 3),
                counts={key: (results[key] if key == 'total' else len(results[key])) for key in ('total', 'passed', 'failed', 'errors', 'skipped')},
                failed=results['failed'], errors=results['errors'], skipped=results['skipped_reasons'],
                gpu_required_skips=results['gpu_required_skips'])


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--platform', required=True, help='platform id with a record under docs/validation/platforms')
    parser.add_argument('--run', nargs=5, action='append', required=True, metavar=('LABEL', 'TASK', 'EXIT_CODE', 'JUNIT', 'COMMAND'),
                        help=f'one run: a label, the G4 task whose planned command it replays or {SUITE!r}, its exit status, its JUnit report and its exact command')
    parser.add_argument('--root', default=None, help='repository root (default: the checkout containing this script)')
    args = parser.parse_args(argv)

    root = Path(args.root).resolve() if args.root else recorder.repo_root()
    if not (root / PLATFORMS / f'{args.platform}.json').is_file():
        raise SystemExit(f'no platform record {(PLATFORMS / args.platform).as_posix()}.json; write one with scripts/platform_report.py first')
    gates = recorder.load_json(root / recorder.GATE_FILE)
    g4 = next(stage for stage in gates['stages'] if stage['id'] == 'G4')['tasks']
    task_ids = [task['id'] for task in g4]
    labels = [label for label, *_ in args.run]
    if len(set(labels)) != len(labels):
        raise SystemExit('run labels must be unique')
    for label, task, *_ in args.run:
        if task not in (*task_ids, SUITE):
            raise SystemExit(f'run {label}: {task!r} is neither a G4 task ({", ".join(task_ids)}) nor {SUITE!r}')
    missing = [task_id for task_id in task_ids if not any(task == task_id for _, task, *_ in args.run)]
    if missing or not any(task == SUITE for _, task, *_ in args.run):
        raise SystemExit('a G4 record needs a run of every G4 task and the suite run; missing: ' + ', '.join(missing or [SUITE]))

    out_dir = root / PLATFORMS / 'g4'
    record_path = out_dir / f'{args.platform}.json'
    copies = out_dir / args.platform
    dirty = recorder.dirty_source_manifest(root, [recorder.relative(root, out_dir)])  # this tool's own output directory
    if dirty:
        raise SystemExit('refusing to record on a dirty tree: ' + ', '.join(f"{row['status']} {row['path']}" for row in dirty))
    commit = recorder.git_text(root, 'rev-parse', 'HEAD')
    committed_at = recorder.commit_time(root, commit)

    parsed = []
    for label, task, exit_code, junit, command in args.run:
        results, _, unresolved = recorder.parse_junit(root, junit)
        if unresolved:
            raise SystemExit(f'run {label}: test sources could not be resolved for ' + ', '.join(unresolved))
        started = recorder.parse_timestamp(results['suite_timestamp'])
        if started is None or started < committed_at:
            raise SystemExit(f'run {label}: the report started at {results["suite_timestamp"]}, not after commit {commit[:12]} was made')
        parsed.append((label, task, int(exit_code), Path(junit), command, results))

    if copies.exists():
        shutil.rmtree(copies)
    copies.mkdir(parents=True)
    runs = []
    for label, task, exit_code, junit, command, results in parsed:
        copy = copies / f'{label}.xml'
        shutil.copyfile(junit, copy)
        runs.append(run_entry(label, task, exit_code, copy, command, results, root))

    required = {}
    for task in g4:
        own = [entry for entry in parsed if entry[1] == task['id']]
        judged = own + [entry for entry in parsed if entry[1] == SUITE]
        files = [item for item in task.get('required_tests') or [] if item.endswith('.py')]
        try:
            enumerated = recorder.enumerate_tests(root, own[0][4], files) if files else {}
        except ValueError as error:
            raise SystemExit(str(error)) from error
        required[task['id']] = {}
        for item in task.get('required_tests') or []:
            ids = enumerated[item] if item in enumerated else sorted(
                {test for entry in judged for key in ('passed', 'failed', 'errors', 'skipped') for test in entry[5][key] if recorder.matches(item, test)})
            required[task['id']][item] = {test: {entry[0]: outcome(entry[5], test) for entry in judged} for test in ids}

    unexpected = sorted({test for run in runs for test, reason in run['skipped'].items() if not recorder.optional_skip(reason)})
    not_passed = sorted({f'{task_id} {test} ({label}: {state})' for task_id, items in required.items() for tests in items.values()
                         for test, states in tests.items() for label, state in states.items() if state != 'passed'})
    record = dict(
        record_version=RECORD_VERSION, kind='platform_g4_run', platform_id=args.platform,
        platform_record=(PLATFORMS / f'{args.platform}.json').as_posix(),
        recorded_at=datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat(),
        source_commit=commit, source_commit_time=committed_at.isoformat(),
        gate_file=recorder.GATE_FILE.as_posix(), gate_file_sha256=recorder.file_sha256(root / recorder.GATE_FILE),
        environment=dict(recorder.environment(), **recorder.package_locations(root)), hardware=recorder.hardware(),
        runs=runs, required_tests=required,
        totals={key: sum(run['counts'][key] for run in runs) for key in ('total', 'passed', 'failed', 'errors', 'skipped')},
        unexpected_skips=unexpected, required_tests_not_passed=not_passed,
        all_passed=not unexpected and not not_passed and all(run['exit_code'] == 0 and not run['failed'] and not run['errors'] for run in runs),
    )
    recorder.write_json(record_path, record)
    print(f'{recorder.relative(root, record_path)}: {len(runs)} runs at {commit[:12]}; ' + ', '.join(
        f"{run['label']} {run['counts']['passed']} passed, {run['counts']['failed']} failed, {run['counts']['errors']} errors, "
        f"{run['counts']['skipped']} skipped (exit {run['exit_code']})" for run in runs))
    print(f"required tests not passed: {len(not_passed)}; unexpected skips: {len(unexpected)}; all passed: {record['all_passed']}")
    return 0 if record['all_passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
