#!/usr/bin/env bash
# Run every fixture for every solver in sequence, then combine the records and write the document.
# Usage (from Windows, with the repository on D:): wsl.exe -d torchfdtd-bench -- bash /mnt/d/TorchFDTD/benchmarks/cross_solver/run_all.sh
set -eu
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=${TORCHFDTD_BENCH_ROOT:-$HOME/torchfdtd-bench}
IDLE=${IDLE_LIMIT_MB:-3200}
LOG=$ROOT/logs/run_all_$(date +%Y%m%d_%H%M%S).log
mkdir -p "$ROOT/logs"
echo "log: $LOG"
{
  echo "== accuracy fixtures =="
  bash "$HERE/run_gpu.sh" torchfdtd_driver.py --fixture slab
  bash "$HERE/run_gpu.sh" torchfdtd_driver.py --fixture sphere
  bash "$HERE/run_gpu.sh" fdtdx_driver.py --fixture slab
  bash "$HERE/run_gpu.sh" fdtdx_driver.py --fixture sphere
  bash "$HERE/run_meep.sh" 1 --fixture slab
  bash "$HERE/run_meep.sh" 12 --fixture sphere
  echo "== GPU timing fixtures =="
  bash "$HERE/run_gpu.sh" torchfdtd_driver.py --fixture throughput --idle-limit-mb "$IDLE"
  bash "$HERE/run_gpu.sh" fdtdx_driver.py --fixture throughput --idle-limit-mb "$IDLE"
  bash "$HERE/run_gpu.sh" torchfdtd_driver.py --fixture adjoint --idle-limit-mb "$IDLE"
  bash "$HERE/run_gpu.sh" fdtdx_driver.py --fixture adjoint --mode checkpointed --idle-limit-mb "$IDLE"
  bash "$HERE/run_gpu.sh" fdtdx_driver.py --fixture adjoint --mode reversible --idle-limit-mb "$IDLE"
  bash "$HERE/run_gpu.sh" fdtdx_driver.py --fixture adjoint --mode checkpointed --num-checkpoints 16 --idle-limit-mb "$IDLE"
  echo "== CPU timing fixtures =="
  bash "$HERE/run_meep.sh" 12 --fixture throughput
  bash "$HERE/meep_rank_sweep.sh"
  echo "== combine =="
  cd "$HERE/../.."
  "$ROOT/venv/bin/python" benchmarks/cross_solver/combine.py
  "$ROOT/venv/bin/python" benchmarks/cross_solver/report.py
  echo RUN_ALL_DONE
} 2>&1 | grep -v "^WARNING:\|^I0000\|^W0000\|donated buffers\|warnings.warn\|explanation at" | tee "$LOG"
