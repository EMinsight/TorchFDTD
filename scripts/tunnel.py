"""Forward a loopback web port to the GPU workstation through encrypted SSH."""
import argparse
import base64
import getpass
import os
import select
import socketserver
import threading
from pathlib import Path

import paramiko


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--host',required=True);ap.add_argument('--user',default='admin');ap.add_argument('--port',type=int,default=8766);ap.add_argument('--remote-port',type=int,default=8765);ap.add_argument('--start-server',action='store_true');ap.add_argument('--remote-root',default='C:/Users/admin/photonweave');args=ap.parse_args()
    client=paramiko.SSHClient();client.load_system_host_keys()
    known=Path('.local/known_hosts')
    if known.exists():client.load_host_keys(str(known))
    client.set_missing_host_key_policy(paramiko.RejectPolicy())
    client.connect(args.host,username=args.user,password=os.environ.pop('PHOTONWEAVE_SSH_PASSWORD',None) or getpass.getpass('SSH password: '),timeout=20)
    transport=client.get_transport();transport.set_keepalive(30)
    if args.start_server:
        # Windows OpenSSH can terminate detached children when a command exits.
        # Keep the server command channel alive for the lifetime of this tunnel.
        script=f"""$ProgressPreference = 'SilentlyContinue'
Set-Location -LiteralPath '{args.remote_root}'
try {{ $health = Invoke-RestMethod -Uri http://127.0.0.1:{args.remote_port}/api/health -TimeoutSec 2 }} catch {{ $health = $null }}
if (-not $health) {{ & '{args.remote_root}/.venv/Scripts/python.exe' -m photonweave.cli serve --port {args.remote_port} }}
"""
        server_channel=transport.open_session()
        server_channel.set_combine_stderr(True)
        server_channel.exec_command('powershell -NoProfile -EncodedCommand '+base64.b64encode(script.encode('utf-16-le')).decode())
        def drain():
            while True:
                data=server_channel.recv(65536)
                if not data:break
                print(data.decode('utf-8','replace'),end='',flush=True)
        threading.Thread(target=drain,daemon=True).start()
    class Handler(socketserver.BaseRequestHandler):
        def handle(self):
            try:
                channel=transport.open_channel('direct-tcpip',('127.0.0.1',args.remote_port),self.request.getpeername())
            except (paramiko.SSHException, EOFError):
                return
            try:
                while transport.is_active():
                    ready,_,_=select.select([self.request,channel],[],[],30)
                    for source in ready:
                        data=source.recv(65536)
                        if not data:return
                        (channel if source is self.request else self.request).sendall(data)
            except (ConnectionError,OSError):
                pass
            finally:
                channel.close()
    class Server(socketserver.ThreadingTCPServer):
        allow_reuse_address=True
        daemon_threads=True
    print(f'GPU workbench: http://127.0.0.1:{args.port}',flush=True)
    try:
        with Server(('127.0.0.1',args.port),Handler) as server:
            server.serve_forever()
    finally:
        client.close()


if __name__=='__main__':main()
