"""Execute the runnable code blocks of README.md on an installed torchfdtd.

Every fenced ```python block is runnable in the CPU environment unless the
nearest non-blank line above its fence is a marker comment:

    <!-- readme-example: cuda -->   run with --cuda-python (needs a CUDA device and the cuda-kernels extra)
    <!-- readme-example: skip: reason -->   never executed; the reason is recorded

Blocks in other languages (the shell quick start) are listed, not executed.
Blocks run in order in one working directory outside the checkout, each in a
fresh interpreter process, so a later block may read files an earlier one
wrote. Each interpreter is first checked to import torchfdtd from its own
site-packages and not from a source checkout.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

MARKER = re.compile(r'^<!--\s*readme-example:\s*(cpu|cuda|skip)\s*(?::\s*(.*?))?\s*-->$')
FENCE = re.compile(r'^```(\w*)\s*$')
TIMEOUT_SECONDS = 1800


def parse_blocks(text):
    """Return every fenced block with its language, mode and marker reason."""
    blocks, lines = [], text.splitlines()
    index, previous, open_block = 0, None, None
    for number, line in enumerate(lines, start=1):
        fence = FENCE.match(line)
        if open_block is None and fence is not None:
            language = fence.group(1)
            marker = MARKER.match(previous or '')
            mode = marker.group(1) if marker else ('cpu' if language == 'python' else 'not_python')
            index += 1
            open_block = dict(index=index, line=number, language=language, mode=mode,
                              reason=(marker.group(2) or None) if marker else None, code=[])
        elif open_block is not None and fence is not None and fence.group(1) == '':
            code = '\n'.join(open_block.pop('code')) + '\n'
            open_block.update(code=code, sha256=hashlib.sha256(code.encode('utf-8')).hexdigest())
            blocks.append(open_block)
            open_block = None
        elif open_block is not None:
            open_block['code'].append(line)
        if line.strip():
            previous = line.strip()
    if open_block is not None:
        raise ValueError(f'README code fence opened at line {open_block["line"]} is never closed')
    return blocks


def runnable_blocks_sha256(blocks):
    """One digest over the code of the cpu and cuda blocks, in README order; changes when a runnable example changes."""
    digest = hashlib.sha256()
    for block in blocks:
        if block['mode'] in ('cpu', 'cuda'):
            digest.update(f'{block["mode"]}\0{block["sha256"]}\n'.encode('utf-8'))
    return digest.hexdigest()


def _environment(workdir):
    env = dict(os.environ)
    env.pop('PYTHONPATH', None)
    env['PYTHONDONTWRITEBYTECODE'] = '1'
    scratch = str(Path(workdir) / 'tmp')
    Path(scratch).mkdir(parents=True, exist_ok=True)
    env.update(TMP=scratch, TEMP=scratch, TMPDIR=scratch)
    return env


def check_interpreter(python, workdir, checkout):
    """The interpreter must import torchfdtd from its own prefix, never from the checkout."""
    code = ('import json, pathlib, sys, torchfdtd\n'
            'print(json.dumps(dict(prefix=sys.prefix, file=torchfdtd.__file__, python=sys.version.split()[0])))\n')
    completed = subprocess.run([python, '-c', code], cwd=workdir, env=_environment(workdir), capture_output=True, text=True,
                               encoding='utf-8', errors='replace', timeout=600)
    if completed.returncode != 0:
        raise RuntimeError(f'{python} cannot import torchfdtd: {completed.stderr.strip()[-2000:]}')
    record = json.loads(completed.stdout.strip().splitlines()[-1])
    package = Path(record['file']).resolve()
    if not package.is_relative_to(Path(record['prefix']).resolve()):
        raise RuntimeError(f'{python} imports torchfdtd from {package}, outside its prefix {record["prefix"]}')
    if checkout is not None and package.is_relative_to(Path(checkout).resolve()):
        raise RuntimeError(f'{python} imports torchfdtd from the checkout {checkout}; install the wheel instead')
    return record


def run_blocks(blocks, python, cuda_python=None, workdir=None, checkout=None):
    """Execute the blocks in order; return per-block records and whether every runnable block passed."""
    workdir = Path(workdir).resolve()
    if checkout is not None and workdir.is_relative_to(Path(checkout).resolve()):
        raise ValueError(f'the working directory {workdir} must lie outside the checkout {checkout}')
    workdir.mkdir(parents=True, exist_ok=True)
    interpreters = {'cpu': check_interpreter(python, workdir, checkout)}
    interpreters['cpu']['executable'] = python
    if cuda_python:
        interpreters['cuda'] = check_interpreter(cuda_python, workdir, checkout)
        interpreters['cuda']['executable'] = cuda_python
    records = []
    for block in blocks:
        record = {key: block[key] for key in ('index', 'line', 'language', 'mode', 'reason', 'sha256')}
        if block['mode'] == 'not_python':
            record.update(status='not_executed', detail=f'{block["language"] or "untagged"} block; only python blocks run')
        elif block['mode'] == 'skip':
            record.update(status='skipped', detail=block['reason'] or 'marked skip without a reason')
        elif block['mode'] == 'cuda' and 'cuda' not in interpreters:
            record.update(status='skipped', detail='no --cuda-python interpreter was given')
        else:
            script = workdir / f'readme_block_{block["index"]}.py'
            script.write_text(block['code'], encoding='utf-8', newline='\n')
            executable = interpreters[block['mode']]['executable']
            started = time.perf_counter()
            try:
                completed = subprocess.run([executable, str(script)], cwd=workdir, env=_environment(workdir),
                                           capture_output=True, text=True, encoding='utf-8', errors='replace',
                                           timeout=TIMEOUT_SECONDS)
                exit_code, stdout, stderr = completed.returncode, completed.stdout, completed.stderr
            except subprocess.TimeoutExpired as exc:
                exit_code, stdout, stderr = None, (exc.stdout or b'').decode('utf-8', 'replace'), f'timeout after {TIMEOUT_SECONDS} s'
            record.update(status='passed' if exit_code == 0 else 'failed', interpreter=executable, exit_code=exit_code,
                          seconds=round(time.perf_counter() - started, 2), stdout_tail=stdout[-2000:], stderr_tail=stderr[-2000:])
        records.append(record)
    runnable = [r for r in records if r['mode'] in ('cpu', 'cuda')]
    return dict(interpreters=interpreters, blocks=records, runnable_blocks=len(runnable),
                all_runnable_passed=bool(runnable) and all(r['status'] == 'passed' for r in runnable))


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--python', required=True, help='interpreter of the CPU environment with the wheel installed')
    parser.add_argument('--cuda-python', default=None, help='interpreter of the environment with the cuda-kernels extra')
    parser.add_argument('--readme', default=None, help='README to read (default: the checkout README.md)')
    parser.add_argument('--workdir', required=True, help='working directory for the blocks, outside the checkout')
    parser.add_argument('--output', default=None, help='JSON file for the per-block records')
    args = parser.parse_args(argv)
    checkout = Path(__file__).resolve().parents[1]
    readme = Path(args.readme) if args.readme else checkout / 'README.md'
    text = readme.read_text(encoding='utf-8')
    blocks = parse_blocks(text)
    result = run_blocks(blocks, args.python, args.cuda_python, args.workdir, checkout)
    result.update(readme=str(readme), readme_sha256=hashlib.sha256(text.encode('utf-8')).hexdigest(),
                  runnable_blocks_sha256=runnable_blocks_sha256(blocks))
    if args.output:
        Path(args.output).write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8', newline='\n')
    for block in result['blocks']:
        print(f'block {block["index"]} line {block["line"]} [{block["mode"]}] {block["status"]}'
              + (f' in {block["seconds"]} s' if 'seconds' in block else '')
              + (f': {block["detail"]}' if 'detail' in block else ''))
    print('every runnable block passed' if result['all_runnable_passed'] else 'a runnable block failed or none ran')
    return 0 if result['all_runnable_passed'] else 1


if __name__ == '__main__':
    sys.exit(main())
