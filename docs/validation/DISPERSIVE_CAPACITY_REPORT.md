# Dispersive state beyond physical GPU memory

On 20 September 2026, a one-pole complex-FP64 ADE run completed forward and
first-order backward on an RTX 5880 Ada. The 1024 x 768 x 384 grid contains
301,989,888 cells. E/H occupy 27 GiB and polarization P/Q another 27 GiB,
exceeding the device's reported 51,526,500,352 physical bytes before CPML.
The [curated record](beyond-vram-ade-5880.json) has
`stage="forward_backward_validated"` and `driver_smoke=false`.

| Measurement | Observed value |
| --- | ---: |
| Complete forward/objective/backward elapsed time | 3289.839 s |
| Driver forward time, including parameter preparation | 714.675 s |
| Internal backward time | 2574.441 s |
| Peak Torch CUDA allocation | 5,170,448,384 bytes |
| Sampled peak process RSS | 14,584,545,280 bytes |
| Peak live scratch fields during backward | 175,078,637,568 bytes |
| Maximum point-signal absolute error | 8.67e-19 |
| Maximum local epsilon-gradient absolute error | 1.36e-20 |
| Global epsilon-gradient norm | 3.68483e-5 |

The finite-dependency-cone oracle is a smaller resident Torch ADE solve with
the same alignment. Nonzero point signals, local epsilon derivatives, the
global epsilon-gradient norm and all three shared material derivatives passed
the driver's comparisons. Strength, resonance and damping derivatives are
compared in the driver's scaled coordinates, not by applying a loose absolute
tolerance to SI strength derivatives. All transient field banks were closed
and had zero live logical file bytes after forward and backward.

The run used synchronous file-backed slabs with core width 8, temporal depth 2,
zero global checkpoints and zero local checkpoints. Source revision `d77e958`
used the earlier 2K halo. Its 70 runtime modules and benchmark driver were
checked byte-for-byte against all 71 recorded SHA-256 values. It predates both
the buffer-growth lifetime fix and the narrower K halo. The corrected run
below is retained separately rather than attributing this record to newer
code. The only removed raw-record field is the workstation scratch path.

The admitted reservation was 291,797,729,280 disk bytes, 43,486,545,472 host
bytes and 20,535,312,512 CUDA bytes. The driver retained a 100 GiB disk floor
and 16 GiB available-RAM floor outside the configured budgets. The disk floor
was also checked when each file bank was allocated.

Backward recorded 1,692,426,829,824 logical file-read bytes and
1,167,190,917,120 logical file-write bytes. These buffered I/O counters include
OS-cache effects and are not physical SSD traffic. Sampled process RSS does
not measure the complete OS file cache, and Torch allocation does not include
the entire CUDA context or driver. This single ten-step run establishes
capacity and discrete VJP consistency. It does not establish long-time
stability, optical convergence, sustained storage bandwidth or a speed
advantage over resident, CPU or external solvers.

## Causal-halo rerun

The same grid, precision, pole, ten steps and width/depth/checkpoint policy
completed on source revision `d4dd7c2`, with the K-cell causal halo and expired
output-buffer fix. All 71 driver/runtime SHA-256 values in the
[corrected record](beyond-vram-ade-halo-5880.json) match that revision. The
record is terminal, reports `driver_smoke=false` and has closed forward and
backward stores with zero live logical file bytes.

| Measurement | Corrected run |
| --- | ---: |
| Complete forward/objective/backward | 2976.734 s |
| Driver forward, including preparation | 663.718 s |
| Internal backward | 2312.188 s |
| Peak Torch CUDA allocation | 3,651,167,232 bytes |
| Sampled peak process RSS | 14,113,513,472 bytes |
| Maximum point-signal absolute error | 8.67e-19 |
| Maximum local epsilon-gradient absolute error | 1.36e-20 |

The global epsilon-gradient norm and all three scaled material derivatives
also agree with the finite-cone reference. Logical backward reads are
1,254,730,235,904 bytes and writes 1,021,292,052,480 bytes. Peak logical live
scratch remains 175,078,637,568 bytes. The 100 GiB disk floor and 16 GiB RAM
floor are unchanged. Torch allocation is about 29.4% lower than in the older
record. These two runs were sequential and not alternated or repeated, so
their elapsed-time difference is not an isolated causal speed estimate. The
same capacity-only and buffered-I/O limitations apply.
