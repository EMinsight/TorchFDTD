#!/usr/bin/env bash
# Run one GPU-side driver inside the comparison venv from the repository root.
# Usage: run_gpu.sh <driver.py> [args...]
set -eu
ROOT=${TORCHFDTD_BENCH_ROOT:-$HOME/torchfdtd-bench}
WORKTREE=$(cd "$(dirname "$0")/../.." && pwd)
export XLA_PYTHON_CLIENT_PREALLOCATE=false
export JAX_PLATFORMS=cuda
export CUPY_CACHE_DIR=$ROOT/cupy-cache
export JAX_COMPILATION_CACHE_DIR=$ROOT/jax-cache
export PYTHONUNBUFFERED=1
mkdir -p "$ROOT/artifacts" "$ROOT/logs" "$CUPY_CACHE_DIR"
cd "$WORKTREE"
driver=$1; shift
exec "$ROOT/venv/bin/python" "benchmarks/cross_solver/$driver" "$@"
