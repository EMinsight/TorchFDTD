# Beyond-VRAM crash and resume, RTX 5880, 21 September 2026

One measurement of a real FP32 streamed adjoint whose E/H state exceeds
physical VRAM, interrupted after its first backward journal record and resumed
by a second process. It records recovery cost, whole-machine memory and disk
traffic on this workstation and policy. It is not a sustained-throughput,
convergence or competitor claim. The machine-readable record is
[validation/beyond_vram_restart_5880.json](validation/beyond_vram_restart_5880.json).

## Problem and policy

| Item | Value |
|---|---|
| Grid | 1152 x 1024 x 1920, 2,264,924,160 cells, 10 steps, float32 |
| E/H bytes | 54.36 GB (50.6 GiB), state with CPML 54.63 GB |
| Physical VRAM | 51.53 GB (48 GiB), exceeded |
| Policy | slab width 4, temporal depth 4, no interior checkpoints, disk state storage, synchronous tiles |
| Journal | `restart_every_blocks=1`, three forward records and one backward record per block boundary |
| Reservation | host 51.7 GB, GPU 12.1 GB, disk banks 163.9 GB, journal 127.4 GB |

The driver is `benchmarks/beyond_vram.py` with `--checkpoints 0 --restart-every 1
--kill-after-backward-records 1` for the first process and the same arguments
without the kill option for the second. Both processes were started as
scheduled tasks on the workstation so that they outlive the SSH session.
`scripts/sample_system_counters.ps1` sampled whole-machine counters every five
seconds during both processes. `benchmarks/report_beyond_vram_restart.py`
combined the two driver records and the counter CSV into the sanitized record.

## Killed process

| Item | Value |
|---|---|
| Forward | 559.1 s, three forward journal records in 96.6 s |
| Exit | right after publishing the backward record of the highest block |
| Elapsed | 1137.4 s |
| Peak process RSS | 28.5 GB |

## Resumed process

| Item | Value |
|---|---|
| Forward | 7.7 s, restored from the completed forward record |
| Backward | 946.0 s, resumed below the recorded block, one block replayed from the initial state |
| Journal writes | one backward record, 64.8 s |
| Elapsed | 957.5 s |
| Peak Torch CUDA allocation | 3.03 GB |
| Peak process RSS | 30.0 GB |
| Backward file banks | 4 created, peak logical 163.9 GB, 546.3 GB read, 437.0 GB written |
| Signal error | 0 (forward signals restored bitwise) |
| Gradient crop relative L2 | 9.08e-8 against the causal-cone oracle, tolerance 2e-4 |
| Gradient norm relative error | 8.23e-8 |
| Cells outside the causal cone with nonzero gradient | 0 |

Both processes together took 2094.9 s. An uninterrupted run of the same
problem and policy is not part of this record, so the overhead of the crash
itself is bounded only from above by the resumed process's 957.5 s plus the
forward journal cost.

## Whole-machine counters

Sampled over 2584 s covering both processes, including the operating system,
its file cache and every other process on the workstation.

| Item | Value |
|---|---|
| Installed RAM | 137.1 GB (127.7 GiB) |
| Peak system in use | 38.9 GB (36.3 GiB), minimum available 98.2 GB |
| Peak committed | 46.2 GB |
| Peak OS file cache | 0.27 GB, peak standby cache 1.32 GB |
| Disk write | mean 0.59 GB/s, peak 2.68 GB/s, integrated 1.52 TB |
| Disk read | mean 0.15 GB/s, peak 1.12 GB/s, integrated 0.39 TB |
| CPU | mean 24.0 %, peak 59.3 % |

Peak system use is an upper bound on what the run added to the machine. The
integrated bytes are counter rates times the sampling interval, not an exact
I/O count. The file cache stayed small because the state banks are written and
read once per block and their files are removed after use.

## What this does and does not show

- The journal records a killed backward pass at a block boundary and a fresh
  process continues it with the same gradient as the uninterrupted oracle.
- The measured host RSS of both processes stays below the host reservation,
  and the whole machine stays below one third of its RAM.
- Buffered file traffic during backward, about 1 TB for ten steps, is the cost
  of `checkpoints=0` with disk banks on this policy. Longer runs scale this
  with the number of blocks. Sustained NVMe behaviour over hours, and the
  application-level throughput of a converged optimization, are not measured.
- The journal contract rejects a changed runtime, so a resume needs the source
  tree that wrote the records. Leftover `torchfdtd-state-*` scratch of the
  killed process must be removed before the resume, as documented in
  [STREAMED_RESTART.md](STREAMED_RESTART.md).
