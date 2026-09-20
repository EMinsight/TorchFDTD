# Native CPU and GPU differentiable execution

The first direct pilot compares the same complex FP64 Yee/CPML problem on the
local Intel Core i7-12700 / RTX 3060 workstation. It uses 64 x 32 x 32 cells, 24 steps, two global
checkpoints, slab width 16 and temporal depth 4. The CPU path uses the native
Torch discrete adjoint and eight intra-op threads. GPU paths use fused kernels.
All three timed repetitions check signals and full gradients against the
resident GPU result. One warmup per policy precedes alternating policy order.

| Execution | Median full iteration | CPU / execution time |
|---|---:|---:|
| CPU + DRAM | 1.587 s | 1.00 |
| GPU resident | 0.088 s | 18.04 |
| GPU + DRAM spatial streaming | 0.737 s | 2.15 |

The full iteration includes epsilon construction, forward, objective and
backward. Separate phase times are in the [raw record](cpu-dram-pilot-3060.json).
GPU resident repetitions range from 0.053 to 0.096 seconds, so the small sample
does not establish confidence intervals. This measures our CPU implementation,
not an optimized external C++/MPI solver. It is not a physical-VRAM-overflow
test and does not establish the RTX 5880 or 54 GiB workload speedup.

```powershell
python -m benchmarks.streamed_adjoint --compare-cpu --cpu-threads 8 --nx 64 --ny 32 --steps 24 --width 16 --depth 4 --repeats 3 --complex-bloch --output results/cpu-dram-pilot.json
```

The large matched CPU comparison still requires separate memory admission.
Failure to fit a CPU adjoint in DRAM must be reported as such, never converted
into a timing ratio or replaced silently with a disk-backed baseline.

For the 54 GiB case, the present zero-checkpoint streamed policy reserves five
full state banks. Replacing its disk banks with host banks adds
292,531,732,480 bytes and removes 8,153,726,976 bytes of disk-I/O workspace
from the recorded 75,799,463,264-byte host reservation. The resulting
360,177,468,768-byte host requirement exceeds the workstation's
137,065,152,512-byte physical RAM. Thus this exact DRAM-only policy cannot be
admitted on that machine. This is a limit of our present policy, not proof
that every CPU FDTD implementation requires that memory. No same-size
CPU-to-GPU ratio can be inferred from the capacity record.

## Larger resident-size pilot

The same workstation and eight CPU threads were also tested at 128 x 64 x 64
cells and 32 steps, with slab width 32 and temporal depth 8. Three repetitions
after warmup gave 26.144 seconds for CPU + DRAM, 0.381 seconds for resident
GPU and 2.104 seconds for GPU + DRAM streaming. Their measured CPU/time ratios
are approximately 68.54 and 12.43. All signal and gradient checks passed.
The streamed gradient relative L2 difference is 1.42e-16.
[Raw record](cpu-dram-medium-3060.json).

The CPU thread count is fixed, not tuned. The problem still fits in GPU memory,
and timing variability remains visible in individual repetitions. These ratios
do not predict file-backed execution beyond 48 GB or external solver speed.

A separate one-thread run of this larger case gave a CPU median of 32.000
seconds, compared with 26.144 seconds at eight threads. Signal and gradient
checks passed again. This rejects using the slower one-thread value as the
primary baseline but does not establish that eight threads is optimal.
[One-thread record](cpu-dram-medium-1thread-3060.json).
Further matched comparisons are to run on the RTX 5880 workstation after the
capacity job, without concurrent solver workloads.

## RTX 5880 comparison preparation

A read-only hardware query identifies the GPU workstation CPU as Intel Xeon
w3-2435, with eight physical cores and sixteen logical processors. The matched
comparison should include CPU thread counts 1, 4, 8 and 16 rather than assume
that the local i7's best measured setting transfers to this machine.

The driver now accepts independent `--nz` and `--precision float32|float64`.
Resident CUDA forward/backward use fused kernels for both real and complex
fields. CPU remains the native Torch implementation, not an optimized external
CPU solver. The JSON records signal/gradient tolerances and the driver/package
source hashes. Existing records retain their original source and conditions.

```console
python -m benchmarks.streamed_adjoint --compare-cpu --cpu-threads 8 --nx 128 --ny 64 --nz 64 --steps 32 --width 32 --depth 8 --precision float32 --compare-transfers --repeats 3 --output results/cpu-dram-5880-fp32.json
```

Repeat with the other thread counts, then add `--complex-bloch` and repeat in
FP64. Keep each configuration's raw record and report the faster measured CPU
baseline per workload, with all tested settings disclosed. The FP32 comparison
uses `rtol=5e-5, atol=2e-6` for signals and gradients. These are implementation
parity tolerances, not an optical accuracy guarantee. The new FP32 driver paths
passed real and complex asymmetric-grid smoke checks locally. Their single
timed repetitions are not performance evidence. No RTX 5880 CPU speed ratio is
inferred from those smoke checks. The capacity job has now finished, and the
first matched workstation measurements are recorded below.

## Completed RTX 5880 real-FP32 comparison

On 2026-09-20 the 128 x 64 x 64, 32-step real-FP32 case completed after the
capacity process exited and scratch cleanup was verified. All modes evaluate
the same full forward/objective/backward iteration. CUDA uses fused kernels,
slab width 32, temporal depth 8 and two global checkpoints. Each configuration
has one warmup and three timed repetitions, alternating mode order.

| CPU threads | CPU + DRAM median | Raw record |
| ---: | ---: | --- |
| 1 | 6.640 s | [JSON](cpu-dram-5880-fp32-t1.json) |
| 4 | 2.549 s | [JSON](cpu-dram-5880-fp32-t4.json) |
| 8 | 1.955 s | [JSON](cpu-dram-5880-fp32-t8.json) |
| 16 | 2.216 s | [JSON](cpu-dram-5880-fp32-t16.json) |

The eight-thread CPU is fastest among these tested counts. Using GPU medians
from that same eight-thread run gives the following comparison. This does not
select each GPU mode's fastest timing across independent runs.

| Mode | Full iteration median | CPU median / mode median | Peak Torch CUDA bytes |
| --- | ---: | ---: | ---: |
| CPU + DRAM | 1.955 s | 1.00 | 0 |
| Resident RTX 5880 | 0.04189 s | 46.68 | 67,401,216 |
| RTX 5880 + DRAM, synchronous | 0.4612 s | 4.24 | 38,211,072 |
| RTX 5880 + DRAM, asynchronous | 0.3896 s | 5.02 | 77,533,184 |

All signal and gradient comparisons passed. The synchronous streamed gradient
relative L2 error is 3.69e-8. Double buffering is faster here than synchronous
streaming, but uses more allocated GPU memory, even more than resident in this
small case. Individual repetitions and separate runs show timing variability.
These measurements cover 524,288 cells that fit comfortably in VRAM, native
Torch CPU code and a short discrete workload. They are not ratios for the
54 GiB case, converged optics, Lumerical, Meep MPI or another optimized solver.
The beyond-VRAM run establishes capacity separately and took 3121.894 seconds.

## Completed RTX 5880 complex-FP64 comparison

The same grid, 32 steps, slab/checkpoint policy and repetition scheme were
also measured with complex FP64 fields and fixed x-Bloch phase 0.63. The
explicit CUDA budget was 2 GiB. The initial attempt with the default 1 GiB
budget correctly rejected async admission by 1024 bytes, before its warmup.
That incomplete attempt contributes no timing sample below.

| CPU threads | CPU + DRAM median | Raw record |
| ---: | ---: | --- |
| 1 | 28.276 s | [JSON](cpu-dram-5880-complex-fp64-t1.json) |
| 4 | 10.031 s | [JSON](cpu-dram-5880-complex-fp64-t4.json) |
| 8 | 8.031 s | [JSON](cpu-dram-5880-complex-fp64-t8.json) |
| 16 | 7.899 s | [JSON](cpu-dram-5880-complex-fp64-t16.json) |

Sixteen threads was fastest in this sweep, only 1.65% faster than eight.
This limited sampling does not establish a stable global CPU optimum.
The following GPU medians come from the same sixteen-thread run.

| Mode | Full iteration median | CPU median / mode median | Peak Torch CUDA bytes |
| --- | ---: | ---: | ---: |
| CPU + DRAM | 7.899 s | 1.00 | 0 |
| Resident RTX 5880 | 0.09191 s | 85.94 | 248,543,744 |
| RTX 5880 + DRAM, synchronous | 0.9151 s | 8.63 | 140,251,648 |
| RTX 5880 + DRAM, asynchronous | 0.7736 s | 10.21 | 280,500,224 |

Every repetition passed signal and gradient parity checks. Synchronous
streamed gradient relative L2 error was 1.42e-16. The variability is retained
in the raw records, including a resident outlier in the one-thread run.
As with FP32, this is native Torch CPU versus native fused GPU on a small,
resident-size discrete problem. It is neither a commercial-solver comparison
nor the 54 GiB out-of-core timing ratio. No competing solver workload ran
during the comparison, and the CR job started only after this sweep exited.
