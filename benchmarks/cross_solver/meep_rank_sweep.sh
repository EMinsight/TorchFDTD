#!/usr/bin/env bash
# Supplementary: Meep throughput versus MPI rank count on the same CPU (64^3 and 96^3, per-step probe on).
set -eu
HERE=$(cd "$(dirname "$0")" && pwd)
for ranks in 4 8 12 16; do
  bash "$HERE/run_meep.sh" "$ranks" --fixture throughput --sizes 64 96 --repeats 3 --record-suffix "_ranks$ranks"
done
