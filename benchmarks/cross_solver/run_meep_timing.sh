#!/usr/bin/env bash
# Meep timing fixtures only (primary 12-rank throughput, then the rank sweep), followed by combine and report.
set -eu
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=${TORCHFDTD_BENCH_ROOT:-$HOME/torchfdtd-bench}
{
  bash "$HERE/run_meep.sh" 12 --fixture throughput
  bash "$HERE/meep_rank_sweep.sh"
  cd "$HERE/../.."
  "$ROOT/venv/bin/python" benchmarks/cross_solver/combine.py
  "$ROOT/venv/bin/python" benchmarks/cross_solver/report.py
  echo MEEP_TIMING_DONE
} 2>&1 | grep -v "^WARNING:" | tee "$ROOT/logs/meep_timing_$(date +%Y%m%d_%H%M%S).log"
