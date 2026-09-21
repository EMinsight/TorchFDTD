"""Re-run and re-record the completion-gate tasks on one exact source tree, for the release candidate (G9-06).

Each selected task's newest evidence run supplies the exact command, the environment
variables written into it (``$env:NAME='1'; ...`` or ``NAME=1 ...``), the case file and the
scope. The command is run again on the current clean tree with a fresh JUnit report and
recorded with ``scripts/record_gate_evidence.py``, so every gate of the candidate is judged
on the same commit instead of on a mixture of earlier passes and later partial checks.

Selection: every task whose newest evidence exists and whose recorded tests can run on this
host (the test files are present and, when the recorded run used CUDA, this host has a CUDA
device); ``--tasks``, ``--stage`` and ``--all`` narrow or widen it. ``--dry-run`` prints the
plan without running anything.

``--wheel <path>`` installs that wheel into a fresh virtual environment under
``.local/venvs/rc`` and runs every command with that interpreter from a working directory
under ``.local/tmp`` (outside the tracked tree, so the installed package is what the tests
import; a probe checks this before the first task). The recorder still runs with this
interpreter from the checkout and hashes the source tree; the wheel's SHA-256 is recorded
through the recorder's ``--dist`` option.

The tree must be clean apart from the gate file and the runs directory, which the recorder
writes. The exit status is 0 when every re-recorded task is VERIFIED, 1 otherwise; the
release judgement itself is ``scripts/check_release_gates.py``.
"""
import argparse
import importlib.util
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
GATE_FILE = Path('docs') / 'validation' / 'completion_gates.json'
RUNS_DIR = Path('docs') / 'validation' / 'runs'
RC_NOTE = 're-recorded on {commit} for the release candidate'
RC_NOTE_PATTERN = re.compile(r'\s*re-recorded on [0-9a-f]{7,40} for the release candidate\.?\s*$')
PS_ENV = re.compile(r"^\s*\$env:([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?:'([^']*)'|\"([^\"]*)\"|([^;\s]+))\s*;\s*")
POSIX_ENV = re.compile(r'^([A-Za-z_][A-Za-z0-9_]*)=([^\s]*)$')
IMPORT_PROBE = ('import pathlib, sys, torchfdtd; print(pathlib.Path(torchfdtd.__file__).resolve()); '
                'print(pathlib.Path(sys.prefix).resolve())')


def load_script(name):
    spec = importlib.util.spec_from_file_location(name, SCRIPTS / f'{name}.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


recorder = load_script('record_gate_evidence')


def repo_root():
    return SCRIPTS.parent


def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8'))


def parse_command(command):
    """Split a recorded command into its environment assignments and its argument vector."""
    env = {}
    rest = command
    while True:
        match = PS_ENV.match(rest)
        if match is None:
            break
        name, single, double, bare = match.groups()
        env[name] = single if single is not None else double if double is not None else bare
        rest = rest[match.end():]
    lexer = shlex.shlex(rest, posix=True)
    lexer.whitespace_split = True
    lexer.escape = ''  # Windows paths keep their backslashes; quotes still group
    tokens = list(lexer)
    while tokens:
        match = POSIX_ENV.match(tokens[0])
        if match is None:
            break
        env[match.group(1)] = match.group(2)
        tokens = tokens[1:]
    if not tokens:
        raise ValueError(f'the recorded command has no executable: {command!r}')
    return env, tokens


def is_python(token):
    name = Path(token).name.lower()
    return name in ('python', 'python.exe', 'python3', 'python3.exe')


def absolute_under(root, token):
    """A token naming a path that exists relative to the root, made absolute; ``file::node`` keeps its node id."""
    head, sep, tail = token.partition('::')
    candidate = root / head
    if head and not Path(head).is_absolute() and candidate.exists():
        return candidate.resolve().as_posix() + sep + tail
    return token


def prepare(command, root, interpreter, junit, absolute_paths):
    """The environment and argument vector to run: interpreter substituted, JUnit path replaced, paths resolved."""
    env, argv = parse_command(command)
    if is_python(argv[0]):
        argv[0] = Path(interpreter).as_posix()
    elif absolute_paths:
        raise ValueError(f'cannot run this command with the wheel interpreter because it does not start with python: {command!r}')
    kept, skip = [], False
    for token in argv:
        if skip:
            skip = False
            continue
        if token.startswith('--junitxml='):
            continue
        if token == '--junitxml':
            skip = True
            continue
        kept.append(token)
    argv = kept + [f'--junitxml={Path(junit).as_posix()}']
    if absolute_paths:
        argv = [argv[0]] + [absolute_under(root, token) for token in argv[1:]]
        env = {name: absolute_under(root, value) for name, value in env.items()}
    return env, argv


def shown_command(env, argv):
    prefix = ''.join(f"$env:{name}='{value}'; " for name, value in env.items())
    return prefix + subprocess.list2cmdline(argv)


def run_command(argv, env, cwd):
    """Run one recorded command; returns its exit status."""
    return subprocess.run(argv, cwd=str(cwd), env=env).returncode


def newest_evidence(root, task, runs_dir):
    ids = task.get('evidence') or []
    if not ids:
        return None, None
    path = runs_dir / ids[-1] / 'evidence.json'
    if not path.is_file():
        return ids[-1], None
    return ids[-1], load_json(path)


def cuda_available():
    try:
        import torch
    except ImportError:
        return False
    return bool(torch.cuda.is_available())


def select(gates, root, runs_dir, tasks=None, stage=None, everything=False, cuda=None):
    """(stage, task, run_id, evidence, reason) rows; a non-empty reason means the task is skipped."""
    cuda = cuda_available() if cuda is None else cuda
    rows = []
    for stage_entry in gates['stages']:
        if stage and stage_entry['id'] != stage:
            continue
        for task in stage_entry['tasks']:
            if tasks and task['id'] not in tasks:
                continue
            run_id, evidence = newest_evidence(root, task, runs_dir)
            reason = None
            if run_id is None:
                reason = 'no evidence run to replay'
            elif evidence is None:
                reason = f'evidence file missing for {run_id}'
            else:
                missing = [p for p in (evidence.get('test_source_sha256') or {}) if not (root / p).is_file()]
                if missing:
                    reason = 'recorded test sources missing: ' + ', '.join(missing)
                elif not everything and (evidence.get('environment') or {}).get('torch_cuda_available') and not cuda:
                    reason = 'the recorded run used a CUDA device and this host has none (use --all to force)'
            rows.append((stage_entry, task, run_id, evidence, reason))
    if tasks:
        known = {row[1]['id'] for row in rows}
        unknown = sorted(set(tasks) - known)
        if unknown:
            raise SystemExit('unknown task ids: ' + ', '.join(unknown))
    return rows


def rc_scope(previous, commit):
    base = RC_NOTE_PATTERN.sub('', previous or '').rstrip()
    note = RC_NOTE.format(commit=commit[:12])
    return (base + ' ' if base else '') + note + '.'


def pip(python, log_dir, name, *arguments, find_links=()):
    links = [arg for path in find_links for arg in ('--find-links', path)]
    log = log_dir / f'{name}.log'
    with open(log, 'w', encoding='utf-8', errors='replace') as handle:
        completed = subprocess.run([str(python), '-m', 'pip', 'install', *links, *arguments], stdout=handle, stderr=subprocess.STDOUT)
    if completed.returncode != 0:
        raise SystemExit(f'pip install {name} failed with exit {completed.returncode}; see {log}')


def create_rc_venv(root, wheel, base_python, torch_spec, torch_index, find_links, extras):
    """A fresh virtual environment under .local/venvs/rc with the wheel (and its extras) installed; returns its interpreter."""
    venv = root / '.local' / 'venvs' / 'rc'
    log_dir = root / '.local' / 'tmp' / 'rerecord'
    log_dir.mkdir(parents=True, exist_ok=True)
    if venv.exists():
        shutil.rmtree(venv)
    subprocess.run([str(base_python), '-m', 'venv', str(venv)], check=True)
    python = venv / ('Scripts/python.exe' if sys.platform == 'win32' else 'bin/python')
    if torch_spec:
        pip(python, log_dir, 'torch', torch_spec, '--index-url', torch_index, find_links=find_links)
    requirement = f'{Path(wheel).resolve()}[{extras}]' if extras else str(Path(wheel).resolve())
    pip(python, log_dir, 'wheel', requirement, find_links=find_links)
    return python


def probe_installed_package(python, root, cwd, env):
    """Refuse to continue unless the interpreter imports torchfdtd from its own prefix, not from the checkout."""
    completed = subprocess.run([str(python), '-c', IMPORT_PROBE], cwd=str(cwd), env=env, capture_output=True, text=True)
    if completed.returncode != 0:
        raise SystemExit('the wheel interpreter cannot import torchfdtd:\n' + completed.stderr[-2000:])
    package, prefix = [Path(line.strip()) for line in completed.stdout.strip().splitlines()[-2:]]
    source = (root / 'torchfdtd').resolve()
    if package == source or source in package.parents:
        raise SystemExit(f'the wheel interpreter imports torchfdtd from the checkout ({package}); the installed package is not what would run')
    if prefix not in package.parents:
        raise SystemExit(f'the wheel interpreter imports torchfdtd from {package}, outside its prefix {prefix}')
    return package


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--tasks', nargs='+', default=None, help='task ids to re-record (default: every replayable task)')
    parser.add_argument('--stage', default=None, help='re-record the tasks of one stage only')
    parser.add_argument('--all', action='store_true', help='include tasks whose recorded run used CUDA even when this host has none')
    parser.add_argument('--dry-run', action='store_true', help='print the plan and run nothing')
    parser.add_argument('--wheel', default=None, help='wheel to install into a fresh .local/venvs/rc environment and run the commands with')
    parser.add_argument('--python', default=sys.executable, help='interpreter that creates the wheel environment (default: this one)')
    parser.add_argument('--torch', default=None, help='pip requirement for torch in the wheel environment, for example torch==2.10.0+cu126')
    parser.add_argument('--torch-index', default='https://download.pytorch.org/whl/cu126', help='index for the torch requirement')
    parser.add_argument('--find-links', action='append', default=[], help='local wheel directory consulted before any index')
    parser.add_argument('--extras', default='dev,cuda-kernels,gds', help='extras installed with the wheel (default dev,cuda-kernels,gds)')
    parser.add_argument('--root', default=None, help='repository root (default: the checkout containing this script)')
    parser.add_argument('--gates', default=None, help='gate file (default: docs/validation/completion_gates.json under root)')
    parser.add_argument('--runs-dir', default=None, help='evidence directory (default: docs/validation/runs under root)')
    parser.add_argument('--junit-dir', default=None, help='directory for the fresh JUnit reports (default: .local/tmp/junit/rerecord under root)')
    args = parser.parse_args(argv)

    root = Path(args.root).resolve() if args.root else repo_root()
    gate_path = Path(args.gates).resolve() if args.gates else root / GATE_FILE
    runs_dir = Path(args.runs_dir).resolve() if args.runs_dir else root / RUNS_DIR
    junit_dir = Path(args.junit_dir).resolve() if args.junit_dir else root / '.local' / 'tmp' / 'junit' / 'rerecord'
    gates = load_json(gate_path)

    excluded = [recorder.relative(root, gate_path), recorder.relative(root, runs_dir)]
    dirty = recorder.dirty_source_manifest(root, excluded)
    if dirty and not args.dry_run:
        print('the tree is dirty; re-recording needs a clean tree so every run is tied to one commit:')
        for entry in dirty:
            print(f"  {entry['status']} {entry['path']}")
        return 2
    commit = recorder.git_text(root, 'rev-parse', 'HEAD')

    rows = select(gates, root, runs_dir, tasks=args.tasks, stage=args.stage, everything=args.all)
    planned = [row for row in rows if row[4] is None]
    skipped = [row for row in rows if row[4] is not None]
    print(f'HEAD {commit[:12]}; {len(planned)} task(s) to re-record, {len(skipped)} skipped')
    for stage, task, run_id, evidence, reason in skipped:
        print(f"  skip {task['id']}: {reason}")
    if not planned:
        return 0 if not args.tasks else 1

    tmp = root / '.local' / 'tmp'
    tmp.mkdir(parents=True, exist_ok=True)
    junit_dir.mkdir(parents=True, exist_ok=True)
    env_base = dict(os.environ, TMP=str(tmp), TEMP=str(tmp), TMPDIR=str(tmp))
    interpreter, work_root, dist = Path(sys.executable), root, None
    if args.wheel:
        dist = Path(args.wheel).resolve()
        if not dist.is_file():
            raise SystemExit(f'wheel not found: {dist}')
        env_base.pop('PYTHONPATH', None)
        work_root = tmp / 'rc-work'
        if work_root.exists():
            shutil.rmtree(work_root)
        work_root.mkdir(parents=True)
        if args.dry_run:
            interpreter = root / '.local' / 'venvs' / 'rc' / ('Scripts/python.exe' if sys.platform == 'win32' else 'bin/python')
        else:
            interpreter = Path(create_rc_venv(root, dist, args.python, args.torch, args.torch_index, args.find_links, args.extras))
            package = probe_installed_package(interpreter, root, work_root, env_base)
            print(f'wheel interpreter {interpreter} imports torchfdtd from {package}')

    results = []
    for stage, task, run_id, evidence, _ in planned:
        junit = junit_dir / f"{task['id']}.xml"
        if junit.exists():
            junit.unlink()
        env_extra, argv = prepare(evidence['command'], root, interpreter, junit, absolute_paths=bool(args.wheel))
        shown = shown_command(env_extra, argv)
        cwd = work_root / task['id'].lower() if args.wheel else root
        print(f"== {task['id']} (previous {run_id})")
        print('   ' + shown)
        if args.dry_run:
            results.append((task['id'], run_id, '(dry run)', '(dry run)', 0))
            continue
        cwd.mkdir(parents=True, exist_ok=True)
        exit_code = run_command(argv, dict(env_base, **env_extra), cwd)
        print(f"   exit {exit_code}", flush=True)
        if not junit.is_file():
            results.append((task['id'], run_id, '(not recorded)', f'no JUnit report was written (exit {exit_code})', exit_code))
            continue
        record_argv = ['--root', str(root), '--gates', str(gate_path), '--runs-dir', str(runs_dir),
                       '--task', task['id'], '--command', shown, '--junit', str(junit), '--exit-code', str(exit_code),
                       '--scope', rc_scope(evidence.get('applicable_scope'), commit),
                       '--note', f'rerecord_gates.py replay of {run_id}']
        if evidence.get('fixture_path'):
            record_argv += ['--fixture', str(root / evidence['fixture_path'])]
        if evidence.get('acceptance_criteria_path') and evidence['acceptance_criteria_path'] != evidence.get('fixture_path'):
            record_argv += ['--criteria', str(root / evidence['acceptance_criteria_path'])]
        if dist is not None:
            record_argv += ['--dist', str(dist)]
        if args.wheel:
            record_argv += ['--interpreter', str(interpreter)]
        recorder.main(record_argv)
        updated = next(t for s in load_json(gate_path)['stages'] for t in s['tasks'] if t['id'] == task['id'])
        new_id = updated['evidence'][-1]
        new_evidence = load_json(runs_dir / new_id / 'evidence.json')
        state = new_evidence['verification_state_assigned']
        if new_evidence.get('dirty_source_manifest'):
            state += f" (dirty: {len(new_evidence['dirty_source_manifest'])} paths)"
        results.append((task['id'], run_id, new_id, state, exit_code))

    width = max(len(row[2]) for row in results)
    print()
    print(f"{'task':<7} {'previous run':<40} {'new run':<{width}}  state")
    for task_id, previous, new_id, state, _ in results:
        print(f'{task_id:<7} {previous:<40} {new_id:<{width}}  {state}')
    if args.dry_run:
        return 0
    return 0 if all(state == 'VERIFIED' for _, _, _, state, _ in results) else 1


if __name__ == '__main__':
    sys.exit(main())
