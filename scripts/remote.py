"""Deploy/run on a Windows CUDA workstation over SSH without saving passwords.

TORCHFDTD_SSH_PASSWORD can be supplied by the shell, or entered interactively.
Use an existing CUDA-enabled interpreter as --python; dependencies install only
into a new per-project venv. No existing simulation environment is modified.
"""
import argparse
import base64
import getpass
import os
import sys
from pathlib import Path

import paramiko


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    ap = argparse.ArgumentParser()
    ap.add_argument('action', choices=['deploy', 'sync', 'exec', 'fetch'])
    ap.add_argument('--host', required=True)
    ap.add_argument('--user', default='admin')
    ap.add_argument('--python', default='C:/Users/admin/miniconda3/envs/gpu/python.exe')
    ap.add_argument('--root', default='C:/Users/admin/torchfdtd')
    ap.add_argument('--command', default='')
    ap.add_argument('--file')
    args = ap.parse_args()
    client = paramiko.SSHClient()
    client.load_system_host_keys()
    known = Path('.local/known_hosts'); known.parent.mkdir(exist_ok=True)
    if known.exists():
        client.load_host_keys(str(known))
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(args.host, username=args.user, password=os.environ.get('TORCHFDTD_SSH_PASSWORD') or os.environ.get('PHOTONWEAVE_SSH_PASSWORD') or getpass.getpass('SSH password: '), timeout=20)
    client.save_host_keys(str(known))
    def execute(command):
        _, out, err = client.exec_command(command)
        for line in iter(out.channel.makefile('rb').readline, b''):
            print(line.decode('utf-8', 'replace').rstrip(), flush=True)
        error = err.read().decode('utf-8', 'replace')
        if error:
            print(error, flush=True)
        code = out.channel.recv_exit_status()
        if code:
            raise SystemExit(code)
    try:
        if args.action in ('deploy', 'sync'):
            sftp = client.open_sftp()
            def mkdir(path):
                try:
                    sftp.stat(path)
                except FileNotFoundError:
                    parent=path.rsplit('/',1)[0]
                    if parent!=path:
                        mkdir(parent)
                    sftp.mkdir(path)
            mkdir(args.root)
            files = [Path(x) for x in ['pyproject.toml', 'LICENSE', 'THIRD_PARTY_NOTICES.txt', 'README.md'] if Path(x).exists()]
            for folder in ['torchfdtd','examples','tests','benchmarks']:
                files.extend(p for p in Path(folder).rglob('*') if p.is_file() and '__pycache__' not in str(p))
            for path in files:
                target = args.root+'/'+path.as_posix()
                mkdir(target.rsplit('/',1)[0]);sftp.put(str(path),target)
            sftp.close()
            if args.action == 'deploy':
                execute(f'{args.python} -m venv --system-site-packages {args.root}/.venv')
                execute(f'{args.root}/.venv/Scripts/python.exe -m pip install -e {args.root}[dev]')
            print('Deployed to '+args.root)
        elif args.action == 'exec':
            script = f"[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n$ProgressPreference = 'SilentlyContinue'\nSet-Location -LiteralPath '{args.root}'\n{args.command}\nexit $LASTEXITCODE"
            encoded = base64.b64encode(script.encode('utf-16-le')).decode('ascii')
            execute('powershell -NoProfile -EncodedCommand '+encoded)
        elif args.action == 'fetch':
            target=Path(args.file)
            target.parent.mkdir(parents=True,exist_ok=True)
            sftp=client.open_sftp();sftp.get(args.root+'/'+target.as_posix(),str(target));sftp.close()
    finally:
        client.close()


if __name__ == '__main__':
    main()
