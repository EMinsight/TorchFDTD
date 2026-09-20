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
