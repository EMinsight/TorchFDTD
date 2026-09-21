"""Record the raw evidence of one completed verification against a completion-gate task.

This tool executes nothing. The integrator runs the verification first, with a
JUnit report, and then records what happened here. The evidence is judged by
scripts/check_release_gates.py; a VERIFIED state written by this tool is only
as good as the recorded run, and is never a general certification of the solver.
"""
import argparse
import datetime
import hashlib
import importlib
import json
import os
import platform
import shutil
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from release_audit import file_sha256  # noqa: E402

RECORDER_VERSION = 1
GATE_FILE = Path('docs') / 'validation' / 'completion_gates.json'
RUNS_DIR = Path('docs') / 'validation' / 'runs'
CASE_FIELDS = {
    'seed': 'seed', 'precision': 'precision', 'backend': 'backend',
    'physics_configuration': 'fixture', 'reference_method': 'reference_method',
    'observables': 'observables', 'acceptance_limits': 'acceptance',
}


def repo_root():
    return Path(__file__).resolve().parents[1]


def git_bytes(root, *args):
    return subprocess.run(['git', *args], cwd=root, capture_output=True, check=True).stdout


def git_text(root, *args):
    return git_bytes(root, *args).decode('utf-8').strip()


def tracked_paths(root):
    return [p for p in git_bytes(root, 'ls-files', '-z').decode('utf-8').split('\0') if p]


def source_tree_sha256(root, paths):
    """One digest over the working-tree bytes of every tracked path, in sorted path order."""
    digest = hashlib.sha256()
    for path in sorted(paths):
        file = root / path
        entry = file_sha256(file) if file.is_file() else 'missing'
        digest.update(f'{path}\0{entry}\n'.encode('utf-8'))
    return digest.hexdigest()


def head_blob_sha256(root, path):
    try:
        return hashlib.sha256(git_bytes(root, 'show', f'HEAD:{path}')).hexdigest()
    except subprocess.CalledProcessError:
        return None


def dirty_source_manifest(root, excluded):
    """Tracked files that differ from HEAD, plus untracked files git does not ignore.

    The gate file and the evidence directory are excluded because the recorder itself writes them.
    """
    tokens = git_bytes(root, 'status', '--porcelain', '-z', '--untracked-files=normal').decode('utf-8').split('\0')
    manifest = []
    index = 0
    while index < len(tokens):
        token = tokens[index]
        index += 1
        if not token:
            continue
        status, path = token[:2], token[3:]
        original = None
        if 'R' in status or 'C' in status:
            original = tokens[index]
            index += 1
        if any(path == item or path.startswith(item.rstrip('/') + '/') for item in excluded):
            continue
        file = root / path
        manifest.append(dict(
            path=path, status=status.strip() or status, renamed_from=original,
            working_tree_sha256=file_sha256(file) if file.is_file() else None,
            head_sha256=None if status == '??' else head_blob_sha256(root, original or path),
        ))
    return manifest


def resolve_test_source(root, classname):
    """Map a JUnit classname such as tests.test_x.TestY to tests/test_x.py and the class path."""
    parts = classname.split('.')
    for count in range(len(parts), 0, -1):
        candidate = '/'.join(parts[:count]) + '.py'
        if (root / candidate).is_file():
            return candidate, parts[count:]
    return None, parts


def parse_junit(root, junit_path):
    tree = ET.parse(junit_path)
    top = tree.getroot()
    suites = [top] if top.tag == 'testsuite' else list(top.iter('testsuite'))
    results = dict(total=0, passed=[], failed=[], errors=[], skipped=[], skipped_reasons={},
                   failure_messages={}, suite_time_seconds=0.0, suite_timestamp=None)
    sources, unresolved = {}, []
    for suite in suites:
        results['suite_time_seconds'] += float(suite.get('time') or 0)
        if suite.get('timestamp') and not results['suite_timestamp']:
            results['suite_timestamp'] = suite.get('timestamp')
        for case in suite.iter('testcase'):
            classname, name = case.get('classname') or '', case.get('name') or ''
            source, class_path = resolve_test_source(root, classname)
            if source is None:
                if classname not in unresolved:
                    unresolved.append(classname)
                test_id = f'{classname}::{name}'
            else:
                sources.setdefault(source, file_sha256(root / source))
                test_id = '::'.join([source, *class_path, name])
            results['total'] += 1
            if case.find('failure') is not None:
                results['failed'].append(test_id)
                results['failure_messages'][test_id] = (case.find('failure').get('message') or '')[:2000]
            elif case.find('error') is not None:
                results['errors'].append(test_id)
                results['failure_messages'][test_id] = (case.find('error').get('message') or '')[:2000]
            elif case.find('skipped') is not None:
                results['skipped'].append(test_id)
                results['skipped_reasons'][test_id] = (case.find('skipped').get('message') or '')[:500]
            else:
                results['passed'].append(test_id)
    return results, sources, unresolved


def matches(required, test_id):
    """A required entry names a file, a test function, or one parametrized instance."""
    if required.endswith('.py'):
        return test_id.startswith(required + '::')
    return test_id == required or test_id.startswith(required + '[')


def decide(task, results, exit_code, unresolved):
    ran = results['passed'] + results['failed'] + results['errors'] + results['skipped']
    required = task.get('required_tests') or []
    skipped_required = sorted({t for t in required for s in results['skipped'] if matches(t, s)})
    absent_required = [t for t in required if not any(matches(t, r) for r in ran)]
    if results['failed'] or results['errors']:
        return 'FAILED', f"{len(results['failed'])} failed and {len(results['errors'])} errored test cases", skipped_required
    if exit_code != 0:
        return 'NOT_RUN', f'exit code {exit_code} although the report lists no failure; the run did not complete normally', skipped_required
    if results['total'] == 0:
        return 'NOT_RUN', 'the JUnit report contains no test cases', skipped_required
    if skipped_required:
        return 'NOT_RUN', 'required tests were skipped: ' + ', '.join(skipped_required), skipped_required
    if absent_required:
        return 'NOT_RUN', 'required tests are absent from the report: ' + ', '.join(absent_required), skipped_required
    if unresolved:
        return 'NOT_RUN', 'test sources could not be resolved for: ' + ', '.join(unresolved), skipped_required
    return 'VERIFIED', 'no failures or errors, and no required test skipped or absent', skipped_required


def command_output(*command):
    try:
        completed = subprocess.run(command, capture_output=True, text=True, timeout=30)
    except (OSError, subprocess.TimeoutExpired):
        return None
    return completed.stdout.strip() if completed.returncode == 0 else None


def module_version(name):
    try:
        return getattr(importlib.import_module(name), '__version__', None)
    except Exception:  # noqa: BLE001 - an absent or broken optional dependency is a fact to record, not an error.
        return None


def environment():
    env = dict(python=sys.version.split()[0], python_executable=sys.executable,
               os=platform.platform(), machine=platform.machine())
    for name in ('torch', 'cupy', 'numpy', 'scipy'):
        env[name] = module_version(name)
    env['cuda_runtime'] = None
    if env['torch']:
        import torch
        env['cuda_runtime'] = torch.version.cuda
        env['torch_cuda_available'] = bool(torch.cuda.is_available())
    env['cuda_driver'] = command_output('nvidia-smi', '--query-gpu=driver_version', '--format=csv,noheader')
    if env['cuda_driver']:
        env['cuda_driver'] = env['cuda_driver'].splitlines()[0].strip()
    return env


def cpu_model():
    if sys.platform == 'win32':
        try:
            import winreg
            key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r'HARDWARE\DESCRIPTION\System\CentralProcessor\0')
            return winreg.QueryValueEx(key, 'ProcessorNameString')[0].strip()
        except OSError:
            pass
    cpuinfo = Path('/proc/cpuinfo')
    if cpuinfo.is_file():
        for line in cpuinfo.read_text(encoding='utf-8', errors='replace').splitlines():
            if line.lower().startswith('model name'):
                return line.split(':', 1)[1].strip()
    return platform.processor() or None


def gpus():
    listing = command_output('nvidia-smi', '--query-gpu=name,memory.total', '--format=csv,noheader,nounits')
    if listing:
        rows = []
        for line in listing.splitlines():
            name, _, memory = line.rpartition(',')
            rows.append(dict(name=name.strip(), memory_total_mib=int(float(memory.strip()))))
        return rows
    try:
        import torch
        return [dict(name=torch.cuda.get_device_properties(i).name,
                     memory_total_mib=torch.cuda.get_device_properties(i).total_memory // 2**20)
                for i in range(torch.cuda.device_count())]
    except Exception:  # noqa: BLE001
        return []


def hardware():
    total = None
    try:
        import psutil
        total = psutil.virtual_memory().total
    except Exception:  # noqa: BLE001
        pass
    return dict(cpu_model=cpu_model(), logical_cpus=os.cpu_count(), ram_total_bytes=total, gpus=gpus())


def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def write_json(path, payload):
    with open(path, 'w', encoding='utf-8', newline='\n') as handle:
        handle.write(json.dumps(payload, ensure_ascii=False, indent=2) + '\n')


def find_task(gates, task_id):
    for stage in gates['stages']:
        for task in stage['tasks']:
            if task['id'] == task_id:
                return stage, task
    raise SystemExit(f'Unknown task id {task_id!r} in the gate file.')


def relative(root, path):
    path = Path(path).resolve()
    try:
        return path.relative_to(root.resolve()).as_posix()
    except ValueError:
        return path.as_posix()


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--task', required=True, help='gate task id, for example G1-03')
    parser.add_argument('--command', required=True, help='the exact command that produced the JUnit report')
    parser.add_argument('--junit', required=True, help='JUnit XML written by that command')
    parser.add_argument('--exit-code', type=int, default=None, help='exit code of the command; derived from the report when omitted')
    parser.add_argument('--fixture', help='pre-declared case file under docs/validation/cases')
    parser.add_argument('--criteria', help='acceptance-criteria file; defaults to the fixture when it embeds an "acceptance" block')
    parser.add_argument('--observed', help='JSON file of observed metrics produced by the run')
    parser.add_argument('--artifact', action='append', default=[], help='raw result or log file to reference by path and SHA-256')
    parser.add_argument('--dist', help='wheel or source archive the run installed, hashed as package_or_wheel_sha256')
    parser.add_argument('--note', default=None, help='free-text note kept with the evidence')
    parser.add_argument('--scope', default=None, help='applicable-scope statement; a conservative default is written otherwise')
    parser.add_argument('--root', default=None, help='repository root (default: the checkout containing this script)')
    parser.add_argument('--gates', default=None, help='gate file (default: docs/validation/completion_gates.json under root)')
    parser.add_argument('--runs-dir', default=None, help='evidence directory (default: docs/validation/runs under root)')
    args = parser.parse_args(argv)

    root = Path(args.root).resolve() if args.root else repo_root()
    gate_path = Path(args.gates) if args.gates else root / GATE_FILE
    runs_dir = Path(args.runs_dir) if args.runs_dir else root / RUNS_DIR
    junit_path = Path(args.junit)
    if not junit_path.is_file():
        raise SystemExit(f'JUnit report not found: {junit_path}')
    gates = load_json(gate_path)
    stage, task = find_task(gates, args.task)

    results, test_sources, unresolved = parse_junit(root, junit_path)
    if args.exit_code is None:
        exit_code = 0 if results['total'] and not results['failed'] and not results['errors'] else (5 if not results['total'] else 1)
        exit_code_source = 'derived_from_junit'
    else:
        exit_code, exit_code_source = args.exit_code, 'argument'
    state, reason, skipped_required = decide(task, results, exit_code, unresolved)

    null_reasons = {}
    fixture, criteria = None, None
    fixture_sha, criteria_sha = None, None
    if args.fixture:
        fixture = load_json(args.fixture)
        fixture_sha = file_sha256(args.fixture)
    else:
        null_reasons['fixture_sha256'] = 'no pre-declared fixture file was supplied; the test module fixes its own inputs'
    if args.criteria:
        criteria = load_json(args.criteria)
        criteria_sha = file_sha256(args.criteria)
    elif fixture is not None and 'acceptance' in fixture:
        criteria, criteria_sha = fixture, fixture_sha
    else:
        null_reasons['acceptance_criteria_sha256'] = 'no acceptance-criteria file was supplied; the pass/fail assertions inside the test sources are the criteria'
    case_values = {}
    for field, key in CASE_FIELDS.items():
        source = criteria if field == 'acceptance_limits' else fixture
        if source is not None and key in source:
            case_values[field] = source[key]
        elif field == 'acceptance_limits' and criteria is not None:
            case_values[field] = criteria
        else:
            case_values[field] = None
            null_reasons[field] = f'not declared: no case file supplied the "{key}" entry for this run'
    if args.observed:
        case_values['observed_metrics'] = load_json(args.observed)
    else:
        case_values['observed_metrics'] = None
        null_reasons['observed_metrics'] = 'no observed-metrics file was supplied; the JUnit pass/fail record is the only measurement'
    if args.dist:
        package_sha = file_sha256(args.dist)
    else:
        package_sha = None
        null_reasons['package_or_wheel_sha256'] = 'no distribution file was supplied; the evidence applies to the source tree at source_commit'

    commit = git_text(root, 'rev-parse', 'HEAD')
    tree_sha = source_tree_sha256(root, tracked_paths(root))
    manifest = dirty_source_manifest(root, [relative(root, gate_path), relative(root, runs_dir)])
    execution_timestamp = results['suite_timestamp'] or datetime.datetime.now(datetime.timezone.utc).isoformat()
    recorded_at = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0)
    short = hashlib.sha256(f'{args.task}\n{args.command}\n{commit}\n{execution_timestamp}'.encode('utf-8')).hexdigest()[:8]
    run_id = f"{recorded_at.strftime('%Y%m%dT%H%M%SZ')}-{args.task.lower()}-{short}"
    run_dir = runs_dir / run_id
    run_dir.mkdir(parents=True, exist_ok=False)
    shutil.copyfile(junit_path, run_dir / 'junit.xml')

    artifacts = []
    for item in [*args.artifact, *([args.observed] if args.observed else [])]:
        path = Path(item)
        if not path.is_file():
            raise SystemExit(f'Artifact not found: {path}')
        artifacts.append(dict(path=relative(root, path), sha256=file_sha256(path), bytes=path.stat().st_size))
    artifacts.append(dict(path=relative(root, run_dir / 'junit.xml'), sha256=file_sha256(junit_path), bytes=junit_path.stat().st_size,
                          original_path=relative(root, junit_path)))
    hardware_info = hardware()
    gpu_names = ', '.join(g['name'] for g in hardware_info['gpus']) or 'no GPU'
    scope = args.scope or (f"{task['id']} {task['title']}: one recorded run of the listed command at source commit {commit[:12]} "
                           f"on {hardware_info['cpu_model'] or 'unknown CPU'} with {gpu_names}. "
                           'It is evidence for this task only, not a general certification of the solver.')

    evidence = dict(
        recorder_version=RECORDER_VERSION, run_id=run_id, task=task['id'], stage=stage['id'], task_title=task['title'],
        command=args.command, exit_code=exit_code, exit_code_source=exit_code_source,
        execution_timestamp=execution_timestamp, recorded_at=recorded_at.isoformat(),
        source_commit=commit, source_tree_sha256=tree_sha,
        dirty_source_manifest=manifest, package_or_wheel_sha256=package_sha,
        package_path=relative(root, args.dist) if args.dist else None,
        test_source_sha256=test_sources, unresolved_test_classnames=unresolved,
        fixture_path=relative(root, args.fixture) if args.fixture else None, fixture_sha256=fixture_sha,
        acceptance_criteria_path=relative(root, args.criteria) if args.criteria else (relative(root, args.fixture) if criteria is not None else None),
        acceptance_criteria_sha256=criteria_sha,
        environment=environment(), hardware=hardware_info,
        **case_values,
        test_results=results, required_tests=task.get('required_tests') or [], skipped_required_tests=skipped_required,
        artifact_paths_and_sha256=artifacts, applicable_scope=scope, note=args.note,
        verification_state_assigned=state, verification_reason=reason, null_reasons=null_reasons,
        gate_file=relative(root, gate_path),
    )
    missing = [field for field in gates.get('required_evidence_fields', []) if field not in evidence]
    if missing:
        raise SystemExit('Recorder does not produce required evidence fields: ' + ', '.join(missing))
    write_json(run_dir / 'evidence.json', evidence)

    task.setdefault('required_tests', [])
    task['evidence'].append(run_id)
    if args.command not in task['actual_test_commands']:
        task['actual_test_commands'].append(args.command)
    task['verification_state'] = state
    write_json(gate_path, gates)

    print(f'run_id: {run_id}')
    print(f'evidence: {relative(root, run_dir / "evidence.json")}')
    print(f"tests: {len(results['passed'])} passed, {len(results['failed'])} failed, {len(results['errors'])} errors, {len(results['skipped'])} skipped")
    print(f"{task['id']} verification_state -> {state}: {reason}")
    if evidence['dirty_source_manifest']:
        print(f"warning: {len(evidence['dirty_source_manifest'])} dirty or untracked paths at recording time; the run is not tied to commit {commit[:12]} alone")
    return 0


if __name__ == '__main__':
    sys.exit(main())
