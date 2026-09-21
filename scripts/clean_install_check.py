"""Build the wheel, install it into clean virtual environments and record what an end user gets.

The record answers G8-05 and G8-07 of docs/COMPLETION_PROGRAM_KO.md with
measurements, not claims: the wheel's hash and payload, whether its browser
assets are the committed ones, the package list of each environment and the
result of every step. Steps run from a working directory outside the checkout
so that a source tree on sys.path cannot mask a packaging defect.

    CPU environment   torch from the CPU index, the wheel, import, a 2D run, save and load,
                      the server on a loopback port (index page, assets, two API routes),
                      `torchfdtd doctor`, then every runnable README block
    CUDA environment  a CUDA torch wheel, the wheel with the cuda-kernels extra,
                      one fused CUDA forward run, `torchfdtd doctor`, the README blocks marked cuda

Everything the script creates (venvs, wheel, scratch, pip cache) lives under
--local-root. Example, from the checkout root:

    python scripts/clean_install_check.py --local-root D:/TorchFDTD/.local ^
        --find-links D:/TorchFDTD/.local/wheels --cuda-torch "torch==2.10.0+cu126"

tests/test_clean_install.py reads the newest record under docs/validation/clean_install.
"""
from __future__ import annotations

import argparse
import datetime
import hashlib
import json
import os
import platform
import re
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
import uuid
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from run_readme_examples import parse_blocks, run_blocks, runnable_blocks_sha256  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
RECORD_DIR = ROOT / 'docs' / 'validation' / 'clean_install'
PAYLOAD_FILES = ('pyproject.toml', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.txt')
# Inputs whose change makes an existing record stale; solver source changes do not.
PACKAGING_INPUTS = ('pyproject.toml', 'scripts/clean_install_check.py', 'scripts/run_readme_examples.py')
FRONTEND_SOURCES = ('frontend', 'vite.config.js', 'package.json', 'package-lock.json')

PROBE_CPU = '''
import json, pathlib, sys, time
import numpy as np
started = time.perf_counter()
import torchfdtd
package = pathlib.Path(torchfdtd.__file__).resolve()
assert package.is_relative_to(pathlib.Path(sys.prefix).resolve()), package
assert not package.is_relative_to(pathlib.Path(CHECKOUT).resolve()), package
from torchfdtd import Project, Region, Source, Monitor, Simulation, Result
project = Project(region=Region(dimension='2d', size=(2, 2, .1), mesh=.1, pml_cells=3, steps=80, backend='cpu'),
                  sources=[Source(wavelength=1, pulse_cycles=1)], monitors=[Monitor(center=(.4, 0, 0))])
result = Simulation(project).run()
assert np.isfinite(result.electric).all() and np.max(np.abs(result.electric)) > 0 and np.max(np.abs(result.signals)) > 0
result.save('results/probe.npz')
loaded = Result.load('results/probe.npz')
assert loaded.summary['steps'] == 80 and loaded.summary['backend'] == 'cpu'
np.testing.assert_array_equal(loaded.electric, result.electric)
print(json.dumps(dict(package=str(package), backend=result.summary['backend'], steps=result.summary['steps'],
                      field_peak=float(np.max(np.abs(result.electric))), seconds=round(time.perf_counter() - started, 2))))
'''

PROBE_CUDA = '''
import json, pathlib, sys, time
import numpy as np
import torch
started = time.perf_counter()
import torchfdtd
package = pathlib.Path(torchfdtd.__file__).resolve()
assert package.is_relative_to(pathlib.Path(sys.prefix).resolve()), package
assert not package.is_relative_to(pathlib.Path(CHECKOUT).resolve()), package
assert torch.cuda.is_available(), 'torch reports no CUDA device'
import cupy
from torchfdtd import Project, Region, Source, Monitor, Simulation
project = Project(region=Region(dimension='2d', size=(2, 2, .1), mesh=.1, pml_cells=3, steps=20, backend='cuda',
                                cuda_kernel='fused', cuda_monitor_kernel='fused'),
                  sources=[Source(wavelength=1, pulse_cycles=1)], monitors=[Monitor(center=(.4, 0, 0))])
result = Simulation(project).run()
assert np.isfinite(result.electric).all() and np.max(np.abs(result.electric)) > 0
assert result.summary['backend'] == 'cuda' and result.summary['cuda_kernel'] == 'fused'
print(json.dumps(dict(package=str(package), backend=result.summary['backend'], cuda_kernel=result.summary['cuda_kernel'],
                      gpu=result.summary['gpu'], steps=result.summary['steps'], cupy=cupy.__version__,
                      torch=torch.__version__, seconds=round(time.perf_counter() - started, 2))))
'''


def sha256_bytes(data):
    return hashlib.sha256(data).hexdigest()


def sha256_file(path):
    digest = hashlib.sha256()
    with open(path, 'rb') as handle:
        for chunk in iter(lambda: handle.read(1 << 20), b''):
            digest.update(chunk)
    return digest.hexdigest()


def git(*args, check=True):
    completed = subprocess.run(['git', *args], cwd=ROOT, capture_output=True, check=check)
    return completed.stdout.decode('utf-8', 'replace').strip()


def committed_bytes(path):
    try:
        return subprocess.run(['git', 'show', f'HEAD:{path}'], cwd=ROOT, capture_output=True, check=True).stdout
    except subprocess.CalledProcessError:
        return None


def dirty_paths(prefixes):
    """Tracked files under the prefixes that differ from HEAD, plus untracked ones git does not ignore."""
    status = git('status', '--porcelain', '--untracked-files=all', '--', *prefixes, check=False)
    return sorted(line[3:] for line in status.splitlines() if line.strip())


def packaging_inputs_sha256():
    """Digest over the working-tree bytes of the packaging inputs and the committed browser assets."""
    digest = hashlib.sha256()
    paths = sorted([*PACKAGING_INPUTS, *(p.relative_to(ROOT).as_posix() for p in (ROOT / 'torchfdtd' / 'web').rglob('*') if p.is_file())])
    for path in paths:
        digest.update(f'{path}\0{sha256_file(ROOT / path)}\n'.encode('utf-8'))
    return digest.hexdigest()


def free_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


class Check:
    def __init__(self, args):
        self.args = args
        self.local = Path(args.local_root).resolve()
        self.scratch = self.local / 'tmp' / 'clean_install'
        self.scratch.mkdir(parents=True, exist_ok=True)
        self.steps = []
        self.env = dict(os.environ)
        self.env.pop('PYTHONPATH', None)
        self.env.update(TMP=str(self.scratch), TEMP=str(self.scratch), TMPDIR=str(self.scratch),
                        PIP_CACHE_DIR=str(self.local / 'pip-cache'), PIP_DISABLE_PIP_VERSION_CHECK='1',
                        PYTHONDONTWRITEBYTECODE='1')
        self.record = dict(kind='clean_install_record', schema_version=1)

    def step(self, name, function, *positional):
        """Run one step, record its outcome and return its detail; a failed step raises after being recorded."""
        started = time.perf_counter()
        print(f'--- {name}', flush=True)
        try:
            detail = function(*positional)
            entry = dict(name=name, status='passed', seconds=round(time.perf_counter() - started, 2), detail=detail)
        except Exception as exc:  # noqa: BLE001 - the failure is the record
            entry = dict(name=name, status='failed', seconds=round(time.perf_counter() - started, 2),
                         detail=f'{type(exc).__name__}: {exc}'[:4000])
            self.steps.append(entry)
            print(f'    FAILED: {entry["detail"][:500]}', flush=True)
            raise
        self.steps.append(entry)
        print(f'    passed in {entry["seconds"]} s', flush=True)
        return detail

    def run(self, command, cwd, log_name, timeout=3600):
        log = self.scratch / f'{log_name}.log'
        with open(log, 'w', encoding='utf-8', errors='replace') as handle:
            completed = subprocess.run([str(c) for c in command], cwd=str(cwd), env=self.env, stdout=handle,
                                       stderr=subprocess.STDOUT, timeout=timeout)
        text = log.read_text(encoding='utf-8', errors='replace')
        if completed.returncode != 0:
            raise RuntimeError(f'exit {completed.returncode}: {" ".join(str(c) for c in command)}\n{text[-3000:]}')
        return text

    # --- wheel -----------------------------------------------------------------------------------------------------
    def build_wheel(self):
        """Build from a fresh staging copy of the package sources so a stale build/ directory cannot leak in."""
        staging = self.local / 'wheel-builds' / uuid.uuid4().hex
        staging.mkdir(parents=True)
        package_files = sorted(p for p in (ROOT / 'torchfdtd').rglob('*') if p.is_file()
                               and '__pycache__' not in p.parts and p.suffix != '.pyc')
        for path in [*package_files, *(ROOT / name for name in PAYLOAD_FILES)]:
            target = staging / path.relative_to(ROOT)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(path, target)
        outdir = self.local / 'dist' / self.record['source_commit'][:12]
        if outdir.exists():
            shutil.rmtree(outdir)
        self.run([sys.executable, '-m', 'build', '--wheel', '--outdir', outdir], staging, 'build_wheel')
        shutil.rmtree(staging, ignore_errors=True)
        wheels = list(outdir.glob('torchfdtd-*.whl'))
        if len(wheels) != 1:
            raise RuntimeError(f'expected one wheel in {outdir}, found {wheels}')
        wheel = wheels[0]
        expected = {p.relative_to(ROOT).as_posix() for p in package_files}
        web_assets, mismatched = {}, []
        with zipfile.ZipFile(wheel) as archive:
            names = archive.namelist()
            actual = {n for n in names if n.startswith('torchfdtd/')}
            if actual != expected:
                raise RuntimeError(f'wheel payload differs from the tree: extra={sorted(actual - expected)}, missing={sorted(expected - actual)}')
            for name in sorted(expected):
                data = archive.read(name)
                if data != (ROOT / name).read_bytes():
                    mismatched.append(name)
                if name.startswith('torchfdtd/web/'):
                    web_assets[name] = dict(sha256=sha256_bytes(data), bytes=len(data),
                                            committed_sha256=(sha256_bytes(committed_bytes(name)) if committed_bytes(name) is not None else None))
            metadata = next(n for n in names if n.endswith('.dist-info/METADATA'))
            requires = re.findall(r'^Requires-Dist: (.*)$', archive.read(metadata).decode('utf-8'), re.M)
        if mismatched:
            raise RuntimeError('wheel bytes differ from the tree for ' + ', '.join(mismatched))
        if not any(n.startswith('torchfdtd/web/assets/') for n in web_assets) or 'torchfdtd/web/index.html' not in web_assets:
            raise RuntimeError('the wheel carries no built browser assets under torchfdtd/web')
        web_commit = git('log', '-1', '--format=%H', '--', 'torchfdtd/web')
        frontend_after_web = git('log', '--format=%H', f'{web_commit}..HEAD', '--', *FRONTEND_SOURCES).split()
        self.wheel = wheel
        self.record['wheel'] = dict(
            path=str(wheel), name=wheel.name, sha256=sha256_file(wheel), bytes=wheel.stat().st_size, entries=len(names),
            package_files=len(expected), requires_dist=requires, web_assets=web_assets,
            web_assets_match_committed=all(v['sha256'] == v['committed_sha256'] for v in web_assets.values()),
            web_assets_last_commit=web_commit, frontend_commits_after_web_assets=frontend_after_web,
            frontend_assets_current=not frontend_after_web)
        return dict(name=wheel.name, sha256=self.record['wheel']['sha256'], bytes=self.record['wheel']['bytes'],
                    entries=len(names), web_assets=sorted(web_assets),
                    web_assets_match_committed=self.record['wheel']['web_assets_match_committed'],
                    frontend_assets_current=not frontend_after_web)

    # --- environments ---------------------------------------------------------------------------------------------
    def venv(self, name):
        path = self.local / 'venvs' / name
        if path.exists():
            shutil.rmtree(path)
        self.run([self.args.python, '-m', 'venv', path], self.local, f'{name}_venv')
        python = path / ('Scripts/python.exe' if sys.platform == 'win32' else 'bin/python')
        self.record.setdefault('environments', {})[name] = dict(path=str(path), python=str(python),
                                                                 base_python=platform.python_version())
        return python

    def pip(self, python, name, *arguments):
        links = [arg for path in self.args.find_links for arg in ('--find-links', path)]
        return self.run([python, '-m', 'pip', 'install', *links, *arguments], self.local, name)

    def package_list(self, python, name):
        text = self.run([python, '-m', 'pip', 'list', '--format=freeze'], self.local, f'{name}_packages')
        packages = sorted(line.strip() for line in text.splitlines() if '==' in line)
        self.record['environments'][name]['packages'] = packages
        pins = {line.split('==')[0].lower(): line.split('==')[1] for line in packages}
        return {key: pins.get(key) for key in ('torch', 'numpy', 'scipy', 'fastapi', 'uvicorn', 'pydantic', 'fdtd', 'cupy-cuda12x', 'torchfdtd', 'pip')}

    def probe(self, python, code, workdir, name):
        workdir.mkdir(parents=True, exist_ok=True)
        script = workdir / f'{name}.py'
        script.write_text(f'CHECKOUT = {str(ROOT)!r}\n' + code, encoding='utf-8', newline='\n')
        text = self.run([python, script], workdir, name, timeout=1800)
        return json.loads(text.strip().splitlines()[-1])

    def doctor(self, python, workdir, name):
        console = python.parent / ('torchfdtd.exe' if sys.platform == 'win32' else 'torchfdtd')
        log = self.scratch / f'{name}.log'
        with open(log, 'w', encoding='utf-8', errors='replace') as handle:
            completed = subprocess.run([str(console), 'doctor', '--json'], cwd=str(workdir), env=self.env,
                                       stdout=handle, stderr=subprocess.STDOUT, timeout=900)
        text = log.read_text(encoding='utf-8', errors='replace')
        try:
            report = json.loads(text)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f'doctor exit {completed.returncode}, output is not JSON: {text[-2000:]}') from exc
        self.record.setdefault('doctor', {})[name] = dict(exit_code=completed.returncode, report=report)
        if completed.returncode != 0 or not report['ok']:
            raise RuntimeError(f'doctor exit {completed.returncode}: ' + '; '.join(c['message'] for c in report['checks'] if c['status'] == 'error'))
        return dict(exit_code=completed.returncode, backend=report['backend'], checks={c['name']: c['status'] for c in report['checks']})

    def server(self, python, workdir):
        port = free_port()
        log = open(self.scratch / 'cpu_server.log', 'w', encoding='utf-8', errors='replace')
        process = subprocess.Popen([str(python), '-m', 'torchfdtd.cli', 'serve', '--port', str(port)], cwd=str(workdir),
                                   env=self.env, stdout=log, stderr=subprocess.STDOUT)
        base = f'http://127.0.0.1:{port}'
        try:
            deadline = time.time() + 180
            health = None
            while time.time() < deadline:
                if process.poll() is not None:
                    raise RuntimeError(f'the server exited early with {process.returncode}')
                try:
                    with urllib.request.urlopen(base + '/api/health', timeout=5) as response:
                        health = json.loads(response.read().decode('utf-8'))
                    break
                except (urllib.error.URLError, ConnectionError, TimeoutError):
                    time.sleep(1)
            if health is None:
                raise RuntimeError('the server did not answer /api/health within 180 s')
            routes = {}
            with urllib.request.urlopen(base + '/', timeout=30) as response:
                index = response.read().decode('utf-8')
                routes['/'] = response.status
            assets = re.findall(r'(?:src|href)="(/assets/[^"]+)"', index)
            if not assets:
                raise RuntimeError('the index page references no /assets/ files')
            for asset in assets:
                with urllib.request.urlopen(base + asset, timeout=30) as response:
                    response.read()
                    routes[asset] = response.status
            with urllib.request.urlopen(base + '/api/capabilities', timeout=30) as response:
                capabilities = json.loads(response.read().decode('utf-8'))
                routes['/api/capabilities'] = response.status
            routes['/api/health'] = 200
            return dict(port=port, routes=routes, health=dict(version=health.get('version'), cuda=health.get('cuda'),
                                                             torch=health.get('torch'), cupy=health.get('cupy')),
                        capabilities_keys=len(capabilities) if isinstance(capabilities, (dict, list)) else None)
        finally:
            process.terminate()
            try:
                process.wait(timeout=30)
            except subprocess.TimeoutExpired:
                process.kill()
            log.close()

    # --- driver ---------------------------------------------------------------------------------------------------
    def main(self):
        commit = git('rev-parse', 'HEAD')
        started = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0)
        self.record.update(
            recorded_at=started.isoformat(),
            source_commit=commit, dirty_paths=dirty_paths(['torchfdtd', *PAYLOAD_FILES, 'scripts', 'frontend']),
            packaging_inputs_sha256=packaging_inputs_sha256(),
            host=dict(os=platform.platform(), machine=platform.machine(), base_python=platform.python_version()),
            checkout=str(ROOT), local_root=str(self.local), find_links=list(self.args.find_links),
            cpu_torch=dict(spec=self.args.torch_cpu, index_url=self.args.torch_index),
            cuda_torch=None if self.args.skip_cuda else dict(spec=self.args.cuda_torch, index_url=self.args.cuda_index))
        readme_text = (ROOT / 'README.md').read_text(encoding='utf-8')
        blocks = parse_blocks(readme_text)
        self.record['readme'] = dict(sha256=sha256_bytes(readme_text.encode('utf-8')), runnable_blocks_sha256=runnable_blocks_sha256(blocks),
                                     blocks=[{k: b[k] for k in ('index', 'line', 'language', 'mode', 'reason', 'sha256')} for b in blocks])
        work = self.scratch / 'work'
        if work.exists():
            shutil.rmtree(work)
        cuda_python = None
        try:
            self.step('build_wheel', self.build_wheel)
            cpu = self.step('cpu_venv_create', self.venv, 'g8-cpu')
            self.step('cpu_pip_install_torch', lambda: self.pip(cpu, 'cpu_pip_install_torch', self.args.torch_cpu,
                                                                '--index-url', self.args.torch_index)[-1500:])
            self.step('cpu_pip_install_wheel', lambda: self.pip(cpu, 'cpu_pip_install_wheel', self.wheel)[-1500:])
            self.step('cpu_package_list', self.package_list, cpu, 'g8-cpu')
            self.step('cpu_import_run_save_load', self.probe, cpu, PROBE_CPU, work / 'cpu', 'cpu_probe')
            self.step('cpu_server_index_assets_api', self.server, cpu, work / 'cpu')
            self.step('cpu_doctor', self.doctor, cpu, work / 'cpu', 'cpu')
            if not self.args.skip_cuda:
                cuda_python = self.step('cuda_venv_create', self.venv, 'g8-cuda')
                self.step('cuda_pip_install_torch', lambda: self.pip(cuda_python, 'cuda_pip_install_torch', self.args.cuda_torch,
                                                                     '--index-url', self.args.cuda_index)[-1500:])
                self.step('cuda_pip_install_wheel_extras', lambda: self.pip(cuda_python, 'cuda_pip_install_wheel_extras',
                                                                            f'{self.wheel}[cuda-kernels]')[-1500:])
                self.step('cuda_package_list', self.package_list, cuda_python, 'g8-cuda')
                self.step('cuda_fused_forward_run', self.probe, cuda_python, PROBE_CUDA, work / 'cuda', 'cuda_probe')
                self.step('cuda_doctor', self.doctor, cuda_python, work / 'cuda', 'cuda')
            else:
                self.steps.append(dict(name='cuda_environment', status='skipped', seconds=0, detail='--skip-cuda was given'))
            outcome = self.step('readme_examples', run_blocks, blocks, str(cpu), str(cuda_python) if cuda_python else None,
                                work / 'readme', ROOT)
            self.record['readme_examples'] = outcome
            if not outcome['all_runnable_passed']:
                self.steps[-1].update(status='failed')
        finally:
            self.record['steps'] = self.steps
            self.record['all_passed'] = all(s['status'] == 'passed' for s in self.steps) and 'readme_examples' in self.record
            output = Path(self.args.output) if self.args.output else RECORD_DIR / f"{started.strftime('%Y%m%dT%H%M%SZ')}-{commit[:8]}.json"
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_text(json.dumps(self.record, indent=2, default=str) + '\n', encoding='utf-8', newline='\n')
            print(f'record: {output}')
            print('all steps passed' if self.record['all_passed'] else 'FAILED: ' + ', '.join(s['name'] for s in self.steps if s['status'] != 'passed'))
        return 0 if self.record['all_passed'] else 1


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--local-root', default=str(ROOT / '.local'), help='directory for venvs, wheels, scratch and the pip cache')
    parser.add_argument('--python', default=sys.executable, help='interpreter that creates the virtual environments')
    parser.add_argument('--torch-cpu', default='torch', help='pip requirement for the CPU torch build')
    parser.add_argument('--torch-index', default='https://download.pytorch.org/whl/cpu', help='index for the CPU torch build')
    parser.add_argument('--cuda-torch', default='torch==2.10.0+cu126', help='pip requirement for the CUDA torch build')
    parser.add_argument('--cuda-index', default='https://download.pytorch.org/whl/cu126', help='index for the CUDA torch build')
    parser.add_argument('--find-links', action='append', default=[], help='local wheel directory consulted before any index')
    parser.add_argument('--skip-cuda', action='store_true', help='do not create the CUDA environment (the record then fails G8-05)')
    parser.add_argument('--output', default=None, help='record path (default: docs/validation/clean_install/<time>-<commit>.json)')
    args = parser.parse_args(argv)
    return Check(args).main()


if __name__ == '__main__':
    sys.exit(main())
