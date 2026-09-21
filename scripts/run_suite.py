"""Launch one of the three declared test suites (docs/GPU_RUNNER_POLICY.md).

  cpu-pr        CPU only. CUDA is hidden from the child process with
                CUDA_VISIBLE_DEVICES=-1, ``cuda`` and ``long`` tests are
                deselected. This is the GitHub Actions job.
  gpu-nightly   Everything except ``long`` tests, with ``--gpu-required`` so a
                CUDA test that skips fails. Refuses to start without a CUDA
                device. Launched by hand on a lab GPU host for trusted commits.
  release-full  Every test including the opt-in ``long`` tests, with
                ``--gpu-required``. Launched by hand on an idle lab GPU host
                for a release candidate.

Extra arguments after the suite name go to pytest unchanged, for example
``--junitxml``. ``--dry-run`` prints the command and environment without
running anything. The exit status is pytest's.
"""
import argparse
import os
import subprocess
import sys
from pathlib import Path

SUITES = {
    'cpu-pr': dict(marks='not cuda and not long', gpu_required=False, needs_cuda=False, hide_cuda=True, environment={}),
    'gpu-nightly': dict(marks='not long', gpu_required=True, needs_cuda=True, hide_cuda=False, environment={}),
    'release-full': dict(marks=None, gpu_required=True, needs_cuda=True, hide_cuda=False,
                         environment={'TORCHFDTD_RUN_CUDA_BOOTSTRAP_TEST': '1', 'TORCHFDTD_RUN_CPML_KERNEL_CUDA_TEST': '1'}),
}


def command_for(suite, extra):
    spec = SUITES[suite]
    args = [sys.executable, '-m', 'pytest', '-q', '-p', 'no:cacheprovider']
    if spec['marks']:
        args += ['-m', spec['marks']]
    if spec['gpu_required']:
        args.append('--gpu-required')
    return args + list(extra)


def environment_for(suite):
    spec = SUITES[suite]
    env = dict(os.environ)
    env.update(spec['environment'])
    if spec['hide_cuda']:
        env['CUDA_VISIBLE_DEVICES'] = '-1'  # an empty string leaves torch.cuda.is_available() True on some builds
    return env


def cuda_available():
    try:
        import torch
    except ImportError:
        return False
    return bool(torch.cuda.is_available())


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('suite', choices=sorted(SUITES))
    parser.add_argument('--dry-run', action='store_true', help='print the pytest command and suite environment, run nothing')
    parser.add_argument('pytest_args', nargs=argparse.REMAINDER, help='arguments passed to pytest unchanged')
    args = parser.parse_args(argv)
    extra = [a for a in args.pytest_args if a != '--']
    if '--dry-run' in extra:  # given after the suite name, where argparse hands it to pytest
        args.dry_run = True
        extra = [a for a in extra if a != '--dry-run']
    command = command_for(args.suite, extra)
    env = environment_for(args.suite)
    spec = SUITES[args.suite]
    shown = {key: env[key] for key in [*spec['environment'], *(['CUDA_VISIBLE_DEVICES'] if spec['hide_cuda'] else [])]}
    print(f'suite: {args.suite}')
    print('command: ' + subprocess.list2cmdline(command))
    print('environment: ' + (', '.join(f'{k}={v!r}' for k, v in shown.items()) or 'inherited'))
    if args.dry_run:
        return 0
    if spec['needs_cuda'] and not cuda_available():
        print(f'{args.suite} requires a CUDA device; none is available, and a GPU suite without a GPU is a failure, not a skip.')
        return 2
    return subprocess.run(command, cwd=Path(__file__).resolve().parents[1], env=env).returncode


if __name__ == '__main__':
    sys.exit(main())
