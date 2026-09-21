# Real FP32 beyond-VRAM capacity acceptance

The frozen native run completed ten forward steps and a full spatial epsilon VJP
on RTX 5880. Its real FP32 E/H arrays alone exceed physical GPU memory. This
closes the short FP32 capacity gate, separate from earlier complex-FP64 records.
It does not establish sustained application throughput, recovery or competitor
speed superiority.

| Quantity | Recorded value |
|---|---:|
| Grid | 1152 x 1024 x 2048 |
| Cells | 2,415,919,104 |
| Steps | 10 |
| Fields/materials | Real FP32 |
| E/H state | 57,982,058,496 bytes, 54 GiB |
| E/H plus CPML state | 58,265,174,016 bytes, 54.2637 GiB |
| Reported physical VRAM | 51,526,500,352 bytes, 47.9878 GiB |
| Peak Torch CUDA allocation | 2,225,672,704 bytes, 2.23 GB |
| Sampled peak process RSS | 31,949,930,496 bytes, 31.95 GB |
| Forward including input allocation | 730.006 s |
| Backward operator wall time | 2,770.935 s |
| Total timed run | 3,504.525 s, 58.41 min |
| Signal relative L2 error | 0 |
| Gradient crop relative L2 error | 9.1234e-8 |
| Full gradient norm relative error | 7.8975e-8 |
| Nonzero gradient entries outside the causal cone | 0 |

The predeclared relative gate was 2e-4. A homogeneous epsilon=1.7 point-source
problem is compared with a 56^3 native full-autograd causal-cone oracle. Every
large-domain field cell is stepped, including cells outside the excited cone.
The full dense epsilon gradient is produced and scanned in bounded chunks.
FP64 is used only for bounded diagnostic reductions, not field/material storage.
Short propagation does not exercise late-time boundary reflections or device
physics convergence.

The policy uses slab width four, temporal depth two, zero global/local saved
checkpoints, synchronous CUDA tiles and buffered file-backed state on C. It has
five time blocks, ten global replay blocks and 1,440 local replay steps summed
over tiles. No low-precision storage, sparse-cone execution, mmap, GPUDirect
Storage or asynchronous tile overlap was used in this frozen run.

| Logical file I/O | Read bytes | Write bytes |
|---|---:|---:|
| Forward | 466,121,392,128 | 291,325,870,080 |
| Backward | 1,689,690,046,464 | 1,165,303,480,320 |

Total logical file traffic is 3,364.35 GiB. The peak live logical file-bank
size is 174,795,522,048 bytes. Both stores closed with zero live bank bytes.
These are buffered logical operations, not measured physical disk traffic.
The new metadata work model independently reproduces these byte totals.

The launch admitted 88 GiB host, 32 GiB GPU and 280 GiB disk budgets with an
initial 16 GiB RAM floor and a 100 GiB disk-free floor. Each new bank checks the
disk floor. The RAM floor was an initial admission check, not continuous OS
memory enforcement. Process RSS was sampled every 0.1 seconds and excludes
system-wide page-cache accounting. Torch peak allocation excludes the CUDA
context and non-Torch allocations. The timer starts after preparing the small
oracle and includes large epsilon allocation, forward, backward and diagnostic
comparisons. It is not a cold end-to-end installation or compilation timing.

The [machine record](validation/beyond_vram_fp32_61326d2.json) retains source
hashes and numerical results. All 80 source hashes match frozen revision
`61326d2663f6fc2885b3ef73f0382d188dfe62a4`, which predates the package rename.
The original JSON/log bytes are preserved privately. Only the local scratch
path is redacted from the distributed JSON. The original JSON SHA-256 is
`a252ef7f891908b26bfc93b2401a1458a25fdb3026c19aa060105f45b73e4482`.

Remaining capacity work concerns useful-duration applications, recovery,
system-wide memory accounting and performance. The current structural planner
can compare deeper policies without another capacity run. Its hypothetical
traffic reduction is not a measured speedup of this experiment.
