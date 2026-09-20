# Physical VRAM capacity validation

The author clarified that the target is a problem exceeding the RTX 5880's
physical memory, not an artificial small allocation budget. The earlier
256 x 96 x 96 measurements validate correctness and overhead only. They do not
demonstrate beyond-VRAM execution.

## Machine inspection

Read-only inspection on 2026-09-20 found 51,526,500,352 bytes total CUDA memory,
49,643,782,144 bytes currently free, 137,065,152,512 bytes total RAM and
112,792,899,584 bytes available RAM. The only filesystem drive reported was C,
with 455,137,873,920 bytes free. Availability must be rechecked before launch.

## Target and admission

A 1024 x 1024 x 576 complex FP64 grid has 603,979,776 cells. E/H alone require
57,982,058,496 bytes (54 GiB), already larger than the device's total memory.
Epsilon, CPML, checkpoints, gradients and transfer workspaces are additional.
The forward phase completed. Backward was interrupted by a workstation restart,
so the complete forward/VJP capacity gate remains unproven. Windows event 1074
attributes the restart to the Start menu process on behalf of the admin user.
After reboot the calculation process was absent and the result remained at
`forward_complete`. This is not a completed gradient run or evidence of OOM.
The transient field banks do not support resuming after reboot.

The reservation now charges `checkpoints + 5` complete field banks. Instrumented
file-backed replay tests disable cyclic garbage collection and exercise repeated
backward calls, multiple checkpoint counts and uneven temporal blocks. They
observe at most two forward banks and `checkpoints + 3` backward banks. The
reservation retains two additional banks of margin and separately charges
tile, I/O, material and gradient workspaces.

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
python -m benchmarks.beyond_vram --execute --output results/beyond-vram-5880.json --scratch C:/Users/admin/photonweave/.local/beyond-vram-state --disk-gib 280 --host-gib 76
```

Do not bypass admission checks or delete user data to make a case fit. The
short smaller driver smoke is correctness evidence only, never evidence of
physical VRAM overflow.

## Required evidence

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
The final record must still establish backward accuracy, peak device/host
allocation, full elapsed time and backward scratch cleanup.

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
