# Physical VRAM capacity validation

The later [real FP32 capacity gate](BEYOND_VRAM_FP32.md) is complete. The
earlier frozen measurements below retain their original precision and scope.
The [propagated case](BEYOND_VRAM_PROPAGATED.md), a pillar-array lens whose
pulse crosses the device and whose spectrum feeds a focal objective and a
dense VJP, is the separate physical-duration gate; its E/H state is below
physical VRAM and its live adjoint state above it, as its record states.

The author clarified that the target is a problem exceeding the RTX 5880's
physical memory, not an artificial small allocation budget. The earlier
256 x 96 x 96 measurements validate correctness and overhead only. They do not
demonstrate beyond-VRAM execution.

## Machine inspection

Read-only inspection on 2026-09-20 found 51,526,500,352 bytes total CUDA memory,
49,643,782,144 bytes currently free, 137,065,152,512 bytes total RAM and
112,792,899,584 bytes available RAM. The only filesystem drive reported was C,
with 455,137,873,920 bytes free. Availability must be rechecked before launch.

## FP32 default and next capacity run

The current driver defaults to real FP32 throughout the forward and gradient
calculation. Its 1152 x 1024 x 2048 grid has 2,415,919,104 cells and requires
57,982,058,496 bytes (54 GiB) for E/H alone. This exceeds the RTX 5880's physical
VRAM without increasing precision to inflate the storage requirement.

The FP32 run is prepared but has not completed. Metadata-only admission with
synthetic capacities and bounded verification-statistic tests have passed.
Those tests do not constitute hardware execution or capacity evidence. Existing
FP64 results below remain labeled with their original precision and geometry.

The current defaults use a 32 GiB GPU budget, an 88 GiB host budget, a 280 GiB
file budget, slab width 4 and temporal depth 2. Actual launch requires at least
104 GiB available RAM and 380 GiB free space on the selected C-drive directory.
The 100 GiB disk floor is rechecked when allocating file banks. The run uses
ten steps and checks signals and material gradients against the same-precision
finite-cone autograd reference, with a preset relative L2 limit of 2e-4.
The full gradient must be finite and exactly zero outside the comparison cone.
Diagnostic norms accumulate in FP64 in bounded chunks, without converting or
storing the full simulation state or gradient in FP64.

```powershell
python -m benchmarks.beyond_vram --execute --output results/beyond-vram-fp32-5880.json --scratch <scratch-directory-on-a-large-volume>
```

This is a new precision/capacity condition, not a repeat of the completed FP64
experiment. It will run separately from active performance and optimization
jobs. No small driver solve or repeat of the full solver suite is needed before
each launch when the tested source and settings are unchanged.

## Historical FP64 target and admission

A 1024 x 1024 x 576 complex FP64 grid has 603,979,776 cells. E/H alone require
57,982,058,496 bytes (54 GiB), already larger than the device's total memory.
Epsilon, CPML, checkpoints, gradients and transfer workspaces are additional.
The initial forward phase completed, but its backward was interrupted by a
workstation restart. Windows event 1074
attributes the restart to the Start menu process on behalf of the admin user.
After reboot the calculation process was absent and the result remained at
`forward_complete`. This is not a completed gradient run or evidence of OOM.
The transient field banks do not support resuming after reboot.

The author subsequently authorized stopping the competing calculation and
restarting this test. The retry's forward completed in 673.955 seconds and
passed the same point-history check. The retry subsequently completed its
forward and backward validation in 3121.894 seconds. Its
[separate snapshot](validation/beyond-vram-forward-retry-5880.json) records
source hashes and the 100 GiB per-bank disk-headroom setting. The previous
interrupted record is retained. Different machine/cache conditions prevent
interpreting the difference between forward times as an algorithmic speedup.

## Completed capacity and gradient check

The [completed retry record](validation/beyond-vram-complete-5880.json) reports
stage `forward_backward_validated`. This is 603,979,776 cells and ten timesteps,
with E/H storage 1.125 times physical device VRAM. Signals match the finite-cone
full-autograd oracle exactly. The maximum gradient difference in the 56-cubed
comparison region is 3.3881e-21. The global gradient is finite and nonzero,
with norm 4.0470365e-5, and its norm matches the local oracle. This additionally
checks for unintended gradient outside the dependency cone.

| Measurement | Completed retry |
| --- | ---: |
| Forward wall time, including initial epsilon construction | 673.955 s |
| Reported backward wall time | 2446.685 s |
| Complete elapsed time including final gradient checks | 3121.894 s |
| Peak Torch CUDA allocated bytes | 7,091,686,400 |
| Sampled peak process RSS bytes | 22,506,119,168 |
| Peak live backward logical file bytes | 175,519,039,488 |
| Backward logical read bytes | 1,257,886,449,664 |
| Backward logical written bytes | 1,023,861,063,680 |

Both backing stores report closed with zero live bytes. A post-run directory
inspection independently found zero scratch entries and approximately 442 GB
free on C. The completed process was absent before syncing later code and
starting the CPU/GPU benchmark. The result contains the exact source hashes
used by this retry, which precede later automatic observation-aware planning.

This establishes short beyond-physical-VRAM forward/VJP execution. It does not
establish long-duration optical accuracy, fast inverse design, a 10-times-VRAM
problem, or speed superiority. The source has not reached the Bloch seams or
outer CPML in ten steps. Small separate tests cover those boundary derivatives.
Torch allocation excludes CUDA context and external allocations. Sampled RSS
can miss transient peaks and excludes OS file cache. Logical file traffic is
not measured physical SSD traffic. Complete system-level all-tier accounting
and useful-duration application throughput remain open.

The reservation now charges `checkpoints + 3` complete field banks, the
measured replay bound. Instrumented file-backed tests disable cyclic garbage
collection, exercise repeated backward calls, multiple checkpoint counts and
uneven temporal blocks, and count distinct live bank identities: at most two
forward banks and `checkpoints + 3` backward banks, reached exactly when the
block count allows full nesting ([record](validation/streamed_bank_lifetime.json)).
Tile, I/O, material and gradient workspaces are charged separately. The
`checkpoints + 5` figures quoted for the earlier runs below are historical.

The admitted case reserves 292,531,732,480 disk bytes, 75,799,463,264 host bytes
and 28,991,029,376 device bytes. The user selected the GPU PC's C drive. Its
launch-time free space was 455,133,671,424 bytes. The explicit disk budget is
280 GiB and the host budget is 76 GiB. The driver refuses launch unless those
budgets leave at least 100 GiB of free disk and 16 GiB of available RAM.
These are launch-time checks and allocation budgets, not a guarantee against
other programs consuming resources during execution.

Subsequent runs also pass `disk_free_reserve_bytes=100*1024**3` through the public
streamed options. Admission and each new file-bank allocation recheck this
headroom. A competing process can still consume disk space after a check, so
this is not an exclusive filesystem reservation. The interrupted capacity
job predates this per-bank option and must be identified accordingly.

```powershell
python -m benchmarks.beyond_vram --execute --precision float64 --fields complex --nx 1024 --ny 1024 --nz 576 --width 16 --depth 2 --output results/beyond-vram-5880.json --scratch <scratch-directory-on-a-large-volume> --disk-gib 280 --host-gib 76
```

Do not bypass admission checks or delete user data to make a case fit. The
short smaller driver smoke is correctness evidence only, never evidence of
physical VRAM overflow.

## Required evidence

### Reusable-packet rerun

A [later matched capacity run](validation/beyond-vram-packets-5880.json) at
source revision `3e06b66` completed the same 54 GiB E/H problem and ten-step
VJP. Signals match exactly and the gradient crop differs by at most
`3.39e-21`. All file banks were closed and released.

| Measurement | Earlier completed run | Packet rerun |
| --- | ---: | ---: |
| Complete elapsed time, seconds | 3121.894 | 3170.042 |
| Peak Torch CUDA bytes | 7,091,686,400 | 8,005,845,504 |
| Sampled peak process RSS bytes | 22,506,119,168 | 23,094,059,008 |
| Peak live file bytes | 175,519,039,488 | 175,519,039,488 |

These are two individual runs with uncontrolled OS cache/storage state, not
repeated timing statistics. The packet change does not demonstrate an overall
speed or peak-memory improvement here. Backward's retained CUDA pools sum to
7,090,898,144 bytes. The larger measured transient peak is consistent with the
914,161,728-byte forward output pool still being owned while its larger
transpose replacement is allocated.

`TileWorkspace.array` now drops the expired pool owner before replacement
allocation after normal slot drainage. Caller-held views retain their ownership.
A CUDA allocator test checks this transition. A separate 64-cubed ADE driver
check reduces the peak from 76,226,560 to 69,622,272 bytes with unchanged
signals and material VJPs. That small check does not establish the corrected
peak for this 54 GiB problem. A large rerun of the lifetime fix remains pending.

### Dispersive-state extension

A separate [one-pole ADE experiment](validation/DISPERSIVE_CAPACITY_REPORT.md)
has now completed with 27 GiB of E/H and 27 GiB of P/Q. Its 301,989,888 cells,
ten steps and synchronous file policy differ from the nondispersive case
above. The complete run took 3289.839 seconds with 5,170,448,384 peak Torch
CUDA bytes. Point fields, epsilon gradients and shared material gradients
passed the finite-cone reference checks. This is another short capacity/VJP
result, not a matched performance comparison between the two physics models.

### Earlier forward-only snapshot

The [forward snapshot](validation/beyond-vram-forward-5880.json) records
741.239 seconds for ten steps on 603,979,776 cells. The source's finite
dependency cone permits comparison with a 56-cubed full-autograd reference.
Point histories passed the configured absolute/relative tolerance before this
snapshot was saved. This is a short capacity and consistency test, not a
converged optical experiment or a gradient result.

Forward created five successive banks and held at most two simultaneously,
117,012,692,992 logical file bytes. Logical reads were 351,038,078,976 bytes and
writes were 292,531,732,480 bytes. All forward banks were released. Buffered
I/O may hit the OS cache, so these counters do not measure physical SSD traffic.
The completed retry above now establishes its backward accuracy, measured
device/process peaks, full elapsed time and scratch cleanup. The earlier
forward-only record remains separately labeled.

- Report complete resident state/workspace byte accounting relative to the
  actual device capacity. Avoid deliberately causing an OOM just to prove it.
- Run the ordinary supported API through forward and first-order backward.
  A forward-only capacity run must be labeled as such and is not the final gate.
- Record peak live disk banks, process RAM, Torch CUDA allocation, logical I/O,
  complete time, nonzero signals and gradients, and scratch-file cleanup.
- Validate the algorithm against full-domain autograd on smaller matching
  scenes and run a large-case consistency or analytic check. Passing a small
  test does not alone establish large-case correctness.
- Include resident, DRAM and disk execution where they fit. Report inability
  to execute honestly rather than inventing a competitor timing.
- Measure useful-duration simulation/optimization separately from a short
  capacity demonstration. No near-resident throughput claim without evidence.
