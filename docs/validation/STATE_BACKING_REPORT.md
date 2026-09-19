# Buffered spatial field banks

Development validation on 2026-09-20, RTX 5880 Ada, Torch 2.10.0.
This extends spatial execution, not only checkpoint serialization. Global
E/H/CPML primal and adjoint states use raw temporary files. Slab reads, owned
writes and overlapping adjoint reductions avoid whole-bank mappings. Immutable
versions are retained by checkpoint references. CPU material and gradient
tensors remain full-sized. Storage uses lossless FP32/FP64.

## Complete iteration measurements

Times include forward, backward, replay, buffered I/O and file cleanup, after
one warm-up per policy. All cases use width 16, temporal depth 4, two global
checkpoints and zero local checkpoints. Transfer policy is synchronous.

| Case | DRAM time (s) | File time (s) | DRAM host reservation | File host reservation | Gradient relative L2 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 128 × 32 × 32, FP64, 32 steps, median of 3 | 1.05665 | 1.66188 | 136.28 MiB | 49.00 MiB | 0 |
| 256 × 256 × 128, FP32, 16 steps, one timed run | 3.14190 | 8.20961 | 3.314 GiB | 0.891 GiB | 0 |

The larger file run sets its declared host budget to exactly 956,301,704 bytes.
The DRAM policy is rejected at that budget. Both measured GPU allocation peaks
are 183,951,872 bytes. Logical file reservation is 2,753,560,576 bytes, peak live
file size is 847,249,408 bytes, and the largest contiguous read is 12,582,912
bytes. Forward and backward finish with zero live file bytes and closed stores.
The smaller initial trial only checked the reduced admission threshold after
execution. Its execution used the default host budget.

These host figures are conservative application allocation estimates, not
measured RSS or machine-memory caps. OS page cache is uncontrolled. Logical I/O
is not physical SSD traffic. The workstation has enough RAM to cache these
files, so neither trial demonstrates actual DRAM overflow, cold NVMe throughput
or SSD acceleration. One larger timed run establishes an execution check, not
a precise performance distribution. File mode is currently slower.

## Gradient and lifecycle checks

The new 16-test file-bank suite passes locally and on RTX 5880. Tests cover
CPU/CUDA, scalar and diagonal epsilon, periodic duplication, CPML states,
nonzero endpoint adjoints, halos wider than a domain, short I/O, truncated
reads, injected forward/backward failures, budget rejection, cleanup,
retained-graph backward and explicit tuner candidates. The local full suite
passed 770 tests with one skip before the final CPU-default-device/volume test
was added. The final 16-test suite passed separately.

Three Adam iterations of the regularized sphere example produce exactly equal
radius, objective and gradient histories for host and file policies. Loss
changes from 0.0009975383292256204 to 0.0009816906800502667. The post-update
radius is 0.25897315278385363 micrometres. This is a point-field objective,
not normalized transmission, a converged shape study or CR validation.

## Reproduction and records

```sh
python -m benchmarks.streamed_backing --output results/state-backing.json
python -m benchmarks.streamed_backing --nx 256 --ny 256 --nz 128 --steps 16 --precision float32 --gpu-budget-mib 1024 --disk-budget-mib 4096 --repeats 1 --output results/state-backing-large.json
python -m examples.differentiable_design --execution disk --device cuda --iterations 3 --output results/disk-design.json
```

Raw records: [small](state-backing-5880.json),
[larger](state-backing-large-5880.json),
[file design](disk-design-5880.json), [host design](host-design-5880.json).
[Source hashes and initial-trial distinction](state-backing-source-evidence.json).
The current benchmark additionally enforces the smaller declared host budget
during file execution. No commercial-solver measurement is part of this study.

Remaining work includes asynchronous disk prefetch, sustained storage tests,
automatic resident/DRAM/file selection, physical overflow validation, broader
differentiable physics and the CR objective. This is not a public-release gate
pass or a claim of superiority over other FDTD solvers.
