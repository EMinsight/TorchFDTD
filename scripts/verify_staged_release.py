"""Verify the exact Git index against the audited source manifest before push."""
import hashlib
import json
from pathlib import Path
import subprocess


def main():
    report=json.loads(Path('results/release-review/source-audit.json').read_text(encoding='utf8'))
    if report['findings']:
        raise SystemExit('Resolve release-audit findings before staging a delivery.')
    expected={row['path']:row['sha256'] for row in report['files']}
    paths=subprocess.check_output(['git','ls-files','-z']).decode('utf8').split('\0')[:-1]
    if set(paths)!=set(expected):
        raise SystemExit(f'Staged allowlist differs: extra={set(paths)-set(expected)}, missing={set(expected)-set(paths)}')
    request=''.join(':'+name+'\n' for name in paths).encode('utf8')
    result=subprocess.run(['git','cat-file','--batch'],input=request,capture_output=True,check=True).stdout
    cursor=0
    for name in paths:
        newline=result.index(b'\n',cursor)
        header=result[cursor:newline].split();size=int(header[-1])
        if header[1]!=b'blob':raise SystemExit('Unexpected staged object type: '+name)
        data=result[newline+1:newline+1+size];cursor=newline+size+2
        if hashlib.sha256(data).hexdigest()!=expected[name]:
            raise SystemExit('Staged file differs from audited bytes: '+name)
        if size>50*1024*1024:raise SystemExit('Review oversized source file: '+name)
    print(f'Exact staged bytes verified for {len(paths)} allowlisted files. Public release remains a separate decision.')


if __name__=='__main__':main()
