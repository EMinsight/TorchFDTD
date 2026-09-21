#!/usr/bin/env bash
# Run the Meep driver inside the micromamba "meep" environment from the repository root.
# Usage: run_meep.sh <ranks> [args...]   (ranks=1 runs without mpirun)
set -eu
ROOT=/root/torchfdtd-bench
WORKTREE=/mnt/d/TorchFDTD/.local/worktrees/cross-solver
export MAMBA_ROOT_PREFIX=$ROOT/micromamba
export OMP_NUM_THREADS=1
export PYTHONUNBUFFERED=1
cd "$WORKTREE"
ranks=$1; shift
if [ "$ranks" -gt 1 ]; then
  exec "$ROOT/bin/micromamba" run -n meep mpirun -np "$ranks" python benchmarks/cross_solver/meep_driver.py "$@"
else
  exec "$ROOT/bin/micromamba" run -n meep python benchmarks/cross_solver/meep_driver.py "$@"
fi
