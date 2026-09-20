"""Build a wheel from fresh source staging and reject stale packaged files."""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path
import shutil
import subprocess
import sys
import uuid
import zipfile


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',default='dist/private-preview')
    args=parser.parse_args()
    root=Path(__file__).resolve().parents[1]
    output=(root/args.output).resolve()
    staging_root=(root/'.local/wheel-builds').resolve()
    stage=(staging_root/uuid.uuid4().hex).resolve()
    if not stage.is_relative_to(staging_root):
        raise ValueError('Build staging must remain inside its dedicated directory.')
    stage.mkdir(parents=True)
    package_files=[p for p in (root/'torchfdtd').rglob('*') if p.is_file()
                   and '__pycache__' not in p.parts and p.suffix!='.pyc']
    for path in package_files+[root/name for name in ('pyproject.toml','README.md','LICENSE','THIRD_PARTY_NOTICES.txt')]:
        target=stage/path.relative_to(root)
        target.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(path,target)
    result=subprocess.run([sys.executable,'-m','build','--wheel','--outdir',str(output)],
                          cwd=stage,capture_output=True,text=True,encoding='utf8',errors='replace')
    (stage/'build.log').write_text(result.stdout+'\n'+result.stderr,encoding='utf8')
    if result.returncode:
        print(result.stdout);print(result.stderr,file=sys.stderr)
        raise SystemExit(result.returncode)
    wheels=list(output.glob('torchfdtd-*.whl'))
    wheel=max(wheels,key=lambda p:p.stat().st_mtime_ns)
    expected={p.relative_to(root).as_posix() for p in package_files}
    with zipfile.ZipFile(wheel) as archive:
        actual={n for n in archive.namelist() if n.startswith('torchfdtd/')}
        if actual!=expected:
            raise ValueError(f'Wheel payload differs from source: extra={actual-expected}, missing={expected-actual}')
        for name in expected:
            if archive.read(name)!=(root/name).read_bytes():
                raise ValueError('Wheel source mismatch: '+name)
    print(f'Verified {len(expected)} package files: {wheel.name}')
    print('SHA256 '+hashlib.sha256(wheel.read_bytes()).hexdigest())


if __name__=='__main__':
    main()
