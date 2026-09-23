#!/usr/bin/env bash
# Time the Meep throughput scenes on 4 and on 12 MPI ranks of the i7-12700 with no other workload on the host.
# Run from Git Bash on the Windows side while nothing else uses the CPU. Each run executes
# benchmarks/cross_solver/run_meep.sh inside the WSL distribution torchfdtd-bench, and Meep is double precision.
# The records are docs/validation/cross_solver/meep_throughput_ranks4_quiet.json and meep_throughput_ranks12_quiet.json.
set -u
for ranks in 4 12; do
  MSYS_NO_PATHCONV=1 wsl.exe -d torchfdtd-bench -- bash -lc \
    "cd /mnt/d/TorchFDTD && mkdir -p /root/torchfdtd-bench/artifacts_quiet && bash benchmarks/cross_solver/run_meep.sh $ranks --fixture throughput --record-suffix _ranks${ranks}_quiet --artifacts /root/torchfdtd-bench/artifacts_quiet" \
    || exit $?
done
