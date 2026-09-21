"""Run the workbench journey specs against a CPU-only server and write a record.

    python scripts/run_workbench_journeys.py                 start a server on a free port, run the G8-03 and G8-04 specs
    python scripts/run_workbench_journeys.py --url http://127.0.0.1:8771   use a running server
    python scripts/run_workbench_journeys.py --spec tests/ui/g8-journey.spec.js --output D:/tmp/record.json

The Playwright JSON report is kept next to the record and referenced by path
and SHA-256. The record lists every spec file and every committed browser asset
with its hash, so tests/test_workbench_journeys.py fails when a spec or the
bundle changed after the record was written. Playwright, Node and a browser
are development dependencies (package.json); the server is the package's own.
"""
import argparse
import base64
import datetime
import hashlib
import json
import os
import platform
import shutil
import socket
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT / 'docs' / 'validation' / 'workbench'
DEFAULT_SPECS = ['tests/ui/g8-journey.spec.js', 'tests/ui/g8-editing.spec.js']
WEB = ROOT / 'torchfdtd' / 'web'


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def git(*args):
    completed = subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True)
    return completed.stdout.strip() if completed.returncode == 0 else None


def command_output(*command):
    try:
        completed = subprocess.run(command, capture_output=True, text=True, shell=os.name == 'nt')
    except OSError:
        return None
    return completed.stdout.strip() if completed.returncode == 0 else None


def relative(path):
    path = Path(path).resolve()
    return str(path.relative_to(ROOT)).replace(os.sep, '/') if path.is_relative_to(ROOT) else str(path)


def bundle_files():
    return {str(p.relative_to(ROOT)).replace('\\', '/'): sha256(p) for p in sorted(WEB.rglob('*')) if p.is_file()}


def free_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def wait_for(url, seconds=60):
    import urllib.request
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(url + '/api/health', timeout=2) as response:
                return json.loads(response.read().decode('utf-8'))
        except Exception:  # noqa: BLE001 - the server is still starting
            time.sleep(.5)
    raise SystemExit(f'server at {url} did not answer /api/health within {seconds} s')


def flatten(suite, file=None, out=None):
    """Every test of a Playwright JSON report with its file, title, status, duration and attachments."""
    out = [] if out is None else out
    file = suite.get('file', file)
    for spec in suite.get('specs', []):
        for test_ in spec.get('tests', []):
            results = test_.get('results', [])
            last = results[-1] if results else {}
            out.append(dict(file=file, title=spec['title'], status=test_.get('status'), outcome=last.get('status'),
                            duration_ms=int(sum(r.get('duration', 0) for r in results)), attempts=len(results),
                            attachments=[a for a in last.get('attachments', []) if a.get('body')],
                            error=(last.get('error') or {}).get('message')))
    for child in suite.get('suites', []):
        flatten(child, file, out)
    return out


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--url', default=None, help='a running workbench server; default: start one on a free port')
    parser.add_argument('--python', default=sys.executable, help='interpreter for the server and the spec fixtures')
    parser.add_argument('--spec', action='append', default=[], help='spec file (repeatable); default: the G8-03 and G8-04 specs')
    parser.add_argument('--output', default=None, help='record path (default: docs/validation/workbench/<time>-<commit>.json)')
    parser.add_argument('--report', default=None, help='Playwright JSON report path (default: next to the record)')
    args = parser.parse_args(argv)
    specs = args.spec or DEFAULT_SPECS
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    commit = git('rev-parse', 'HEAD') or 'unknown'
    output = Path(args.output) if args.output else RECORDS / f'{stamp}-{commit[:8]}.json'
    report = Path(args.report) if args.report else output.with_suffix('.playwright.json')
    output.parent.mkdir(parents=True, exist_ok=True)
    npx = shutil.which('npx.cmd') or shutil.which('npx')
    if npx is None:
        raise SystemExit('npx not found; install Node and run npm ci')
    server, scratch = None, None
    url = args.url
    try:
        if url is None:
            port = free_port()
            url = f'http://127.0.0.1:{port}'
            scratch = tempfile.mkdtemp(prefix='torchfdtd-journeys-', dir=str(ROOT / '.local' / 'tmp') if (ROOT / '.local' / 'tmp').is_dir() else None)
            env = {**os.environ, 'TORCHFDTD_RESULTS': scratch, 'CUDA_VISIBLE_DEVICES': ''}
            server = subprocess.Popen([args.python, '-m', 'torchfdtd.cli', 'serve', '--port', str(port)], cwd=ROOT, env=env,
                                      stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        health = wait_for(url)
        env = {**os.environ, 'TORCHFDTD_URL': url, 'TORCHFDTD_TEST_PYTHON': args.python, 'PLAYWRIGHT_JSON_OUTPUT_NAME': str(report)}
        env.pop('TORCHFDTD_TEST_CUDA', None)
        started = time.monotonic()
        completed = subprocess.run([npx, 'playwright', 'test', *specs, '--reporter=json'], cwd=ROOT, env=env,
                                   capture_output=True, text=True, encoding='utf-8', errors='replace')
        wall = time.monotonic() - started
    finally:
        if server is not None:
            server.terminate()
            try:
                server.wait(timeout=20)
            except subprocess.TimeoutExpired:
                server.kill()
        if scratch:
            shutil.rmtree(scratch, ignore_errors=True)
    if not report.is_file():
        sys.stderr.write(completed.stdout[-4000:] + completed.stderr[-4000:])
        raise SystemExit(f'Playwright wrote no JSON report to {report} (exit code {completed.returncode})')
    parsed = json.loads(report.read_text(encoding='utf-8'))
    # Playwright names files relative to its testDir; the record names them relative to the repository.
    test_dir = Path(parsed['config']['projects'][0]['testDir'])
    tests = []
    for suite in parsed.get('suites', []):
        flatten(suite, out=tests)
    for entry in tests:
        entry['file'] = relative(test_dir / entry['file'])
        timing = next((a for a in entry['attachments'] if a.get('name') == 'journey-timing'), None)
        if timing:
            entry['journey_timing_ms'] = json.loads(base64.b64decode(timing['body']).decode('utf-8'))
        entry.pop('attachments', None)
    own = {relative(output), relative(report)}
    status = git('status', '--porcelain')
    playwright_package = ROOT / 'node_modules' / '@playwright' / 'test' / 'package.json'
    record = dict(
        kind='workbench_journey_record', schema_version=1, timestamp=stamp, commit=commit,
        dirty_paths=None if status is None else [line[3:] for line in status.splitlines() if line[3:] not in own],
        server_url=url, server_started_here=server is not None, server_health=health,
        environment=dict(platform=platform.platform(), python=sys.version.split()[0], node=command_output('node', '--version'),
                         playwright=json.loads(playwright_package.read_text(encoding='utf-8')).get('version') if playwright_package.is_file() else None,
                         torch=health.get('torch'), cuda_visible_to_server=bool(health.get('cuda'))),
        backend='cpu (every spec selects the CPU resource)',
        specs={spec: sha256(ROOT / spec) for spec in specs},
        bundle=bundle_files(),
        playwright_exit_code=completed.returncode, wall_seconds=round(wall, 3),
        tests=tests, all_passed=completed.returncode == 0 and bool(tests) and all(t['status'] == 'expected' for t in tests),
        report=dict(path=relative(report), sha256=sha256(report)),
    )
    output.write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(f"{output}: {len(tests)} tests, all_passed={record['all_passed']}, wall {wall:.1f} s, exit {completed.returncode}")
    for entry in tests:
        print(f"  {entry['status']:10s} {entry['duration_ms']/1000:7.1f} s  {entry['file']} > {entry['title']}")
    return 0 if record['all_passed'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
