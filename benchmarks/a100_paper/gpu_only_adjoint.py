"""Run benchmarks/cpu_gpu_adjoint.py with its GPU modes only.

The A100 session has four CPU cores, so the six- and twelve-thread CPU
references of the RTX 5880 record cannot be reproduced there. This wrapper
drops the cpu_* policies and summarizes the GPU medians without a CPU
baseline. The benchmark source itself is unchanged, and the record keeps its
source hashes.
"""
import statistics
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parents[2]  # repository root
sys.path.insert(0, str(SRC))

import benchmarks.cpu_gpu_adjoint as bench  # noqa: E402

_policies = bench.policies


def gpu_policies(args):
    return {name: value for name, value in _policies(args).items() if not name.startswith('cpu_')}


def gpu_summary(records, cpu_names):
    medians = {name: statistics.median(row['seconds'] for row in rows) for name, rows in records.items()}
    return dict(median_seconds=medians, fastest_tested_cpu=None, speedup_over_fastest_tested_cpu={},
                cpu_reference='omitted: four-core container, see the RTX 5880 record for CPU timings')


bench.policies = gpu_policies
bench.summarize = gpu_summary

if __name__ == '__main__':
    bench.main(sys.argv[1:])
