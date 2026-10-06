"""Local stand-in for torchrun on Windows (this torch build has no libuv TCPStore): N processes with the env:// variables.
usage: python spawn.py <nproc> <script> [args...]"""
import os, socket, subprocess, sys

n = int(sys.argv[1]); script = sys.argv[2:]
with socket.socket() as s:
    s.bind(("127.0.0.1", 0)); port = s.getsockname()[1]
procs = []
for r in range(n):
    env = dict(os.environ, RANK=str(r), LOCAL_RANK=str(r), WORLD_SIZE=str(n), LOCAL_WORLD_SIZE=str(n), MASTER_ADDR="127.0.0.1",
               MASTER_PORT=str(port), USE_LIBUV="0")
    procs.append(subprocess.Popen([sys.executable] + script, env=env))
codes = [p.wait() for p in procs]
print(f"[spawn] exit codes {codes}", flush=True)
sys.exit(max(abs(c) for c in codes))
