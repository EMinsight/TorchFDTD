# Adjoint leak soak

Record: `docs/validation/adjoint_leak_soak_3060.json` (case `docs/validation/cases/ADJOINT_LEAK_SOAK.json`, declared at commit 8167030). Driver `benchmarks/adjoint_leak_soak.py`. Every number below is copied from the record.

Environment: Python 3.10.2, torch 2.10.0+cu126 (CUDA 12.6), CuPy 13.6.0, psutil 7.2.2, GPU NVIDIA GeForce RTX 3060, Windows-10-10.0.26200-SP0; run at 2026-09-21T21:33:36+00:00 on commit a248548e94e773d1d2774c5c5248599e8ef0a4c7 with 2 dirty paths; wall time 737.6 s.

## What is measured

Each path runs 150 iterations of forward, backward and an Adam step on its trainable inputs and is sampled every 10 iterations after `torch.cuda.synchronize()` and two `gc.collect()` calls. Growth is the maximum over the samples after the 20-iteration warm-up minus the warm-up value. Limits: torch reserved 20971520 B (one 20 MiB large-pool segment), torch allocated 0 B, CuPy pool total 2097152 B, CuPy pool used 0 B, RSS and private bytes 2097152 B, gc objects 100, live tensors 0, CUDA graphs 0, every cache and instance count 0.

Summary: 5 of 8 paths pass; failing: differentiable_cuda_torch, dispersive_cuda, tensor_project_cuda.

## Growth per path (max after warm-up minus warm-up)

| path | s | torch allocated | torch reserved | CuPy used | CuPy total | RSS | private | gc objects | tensors | graphs | caches | instances | verdict |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| differentiable_cuda_fused | 15.0 | +0 B | +0 B | +0 B | +0 B | +0.121 MiB | +0 B | 13 | 0 | 0 | +0 | +0 | pass |
| differentiable_cuda_torch | 39.7 | +0 B | +0 B | +0 B | +0 B | +2.547 MiB | +2.387 MiB | 13 | 0 | 0 | +0 | +0 | FAIL |
| plane_cuda | 17.2 | +0 B | +0 B | +0 B | +0 B | +0.039 MiB | +0 B | 13 | 0 | 0 | +0 | +0 | pass |
| reversible_cuda | 6.5 | +0 B | +0 B | +0 B | +0 B | +0.004 MiB | +0 B | 13 | 0 | 0 | +0 | +0 | pass |
| dispersive_cuda | 168.4 | +0 B | +0 B | +0 B | +0 B | +0.047 MiB | +31.809 MiB | 13 | 0 | 0 | +0 | +0 | FAIL |
| tensor_project_cuda | 302.0 | +0 B | +0 B | +0 B | +0 B | +2.047 MiB | +1.867 MiB | 13 | 0 | 0 | +0 | +0 | FAIL |
| streamed_host_banks_cuda | 171.0 | +0 B | +0 B | +0 B | +0 B | +0.113 MiB | -0.027 MiB | 13 | 0 | 0 | +0 | +0 | pass |
| source_waveform_cuda | 16.4 | +0 B | +0 B | +0 B | +0 B | +0 B | +0 B | 13 | 0 | 0 | +0 | +0 | pass |

## Second half of the run (iteration 50 to 150, reported, not judged)

Change of each host measure between the sample at iteration 50 and the last sample. A one-time step that lands after the warm-up fails the judged growth above but shows zero here; a leak that continues per iteration shows here as well.

| path | torch allocated | torch reserved | RSS | private | gc objects | tensors |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| differentiable_cuda_fused | +0 B | +0 B | +0.059 MiB | +0 B | 10 | 0 |
| differentiable_cuda_torch | +0 B | +0 B | +0.039 MiB | +0 B | 10 | 0 |
| plane_cuda | +0 B | +0 B | +0.012 MiB | +0 B | 10 | 0 |
| reversible_cuda | +0 B | +0 B | +0 B | +0 B | 10 | 0 |
| dispersive_cuda | +0 B | +0 B | +0.023 MiB | +0.035 MiB | 10 | 0 |
| tensor_project_cuda | +0 B | +0 B | +0.020 MiB | -0.035 MiB | 10 | 0 |
| streamed_host_banks_cuda | +0 B | +0 B | -0.008 MiB | -0.035 MiB | 10 | 0 |
| source_waveform_cuda | +0 B | +0 B | +0 B | +0 B | 10 | 0 |

## Warm-up absolute values

| path | torch allocated | torch reserved | CuPy total | RSS | gc objects | live tensors | _System | _Checkpoints | FusedYeeCUDA | FusedAdjointCUDA | SlabBlockOperator |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| differentiable_cuda_fused | 0.02 MiB | 2.00 MiB | 0.00 MiB | 1160.0 MiB | 365187 | 5 | 0 | 0 | 0 | 0 | 0 |
| differentiable_cuda_torch | 0.02 MiB | 2.00 MiB | 0.00 MiB | 1184.8 MiB | 365221 | 5 | 0 | 0 | 0 | 0 | 0 |
| plane_cuda | 16.27 MiB | 22.00 MiB | 0.00 MiB | 1320.7 MiB | 365369 | 6 | 0 | 0 | 0 | 0 | 0 |
| reversible_cuda | 16.28 MiB | 22.00 MiB | 0.00 MiB | 1368.1 MiB | 365242 | 5 | 0 | 0 | 0 | 0 | 0 |
| dispersive_cuda | 16.28 MiB | 22.00 MiB | 0.00 MiB | 1381.6 MiB | 365331 | 20 | 0 | 0 | 0 | 0 | 0 |
| tensor_project_cuda | 16.28 MiB | 44.00 MiB | 0.00 MiB | 1430.2 MiB | 365369 | 6 | 0 | 0 | 0 | 0 | 0 |
| streamed_host_banks_cuda | 16.25 MiB | 22.00 MiB | 0.00 MiB | 1440.1 MiB | 365458 | 5 | 0 | 0 | 0 | 0 | 0 |
| source_waveform_cuda | 16.27 MiB | 22.00 MiB | 0.00 MiB | 1440.2 MiB | 365538 | 10 | 0 | 0 | 0 | 0 | 0 |

## Failing measures

- `differentiable_cuda_torch` rss: growth 2670592 (last minus warm-up 2670592), limit 2097152.
- `differentiable_cuda_torch` private: growth 2502656 (last minus warm-up 2502656), limit 2097152.
- `dispersive_cuda` private: growth 33353728 (last minus warm-up 33316864), limit 2097152.
- `tensor_project_cuda` rss: growth 2146304 (last minus warm-up 2146304), limit 2097152.

## Module-level state of the package

- `torchfdtd/cuda_kernels.py` `_compile`: `functools.lru_cache(maxsize=64)` keyed on (kernel source text, device index, capability, kernel name); holds compiled CuPy modules, never tensors; bounded at 64 entries.
- `torchfdtd/injection.py` `_incident_line`: `lru_cache(maxsize=8)` keyed on (drive bytes, courant, index, layers); host float64 arrays of one-way tables; bounded at 8.
- `torchfdtd/streamed_cost.py` `replay_blocks`: `lru_cache(maxsize=1024)` keyed on two integers, integer values; bounded.
- `torchfdtd/streamed_work.py` `_replay_summary`: `lru_cache(maxsize=4096)` keyed on two integers, small tuples; bounded.
- `torchfdtd/cuda_bootstrap.py` `_module`, `_failure` (with `global`): one compiled helper module or one failure record for the process; bounded at one.
- `torchfdtd/batch.py` `_WORKER_CANCEL` (with `global`): one worker-side cancel event; bounded at one.
- `torchfdtd/capabilities.py` `RULES`, `LANES`: module lists filled once at import by `rule()`/`lane()` calls in the module body; fixed size after import.
- `torchfdtd/reference_cache.py` `PlaneReferenceCache`: instance-owned `OrderedDict` with a byte budget and LRU eviction, CPU copies only; no module-level instance exists, so nothing is retained unless the caller keeps the cache.
- `torchfdtd/solver.py` `ENGINE_LOCK`, `torchfdtd/fsp.py` `BRIDGE_LOCK`, `torchfdtd/cuda_bootstrap.py` `_lock`: locks, no payload.
- `torchfdtd/spacetime.py`: no module-level container; observer maps live on each `SlabBlockOperator`/`_System` instance and die with it.
- `torchfdtd/server.py` `jobs` dict: per-application job registry created in `create_app`; entries are Result records the workbench serves and are the intended lifetime of a job, bounded by the single-worker pool and explicit cancellation/deletion, not by iteration count.
- `torchfdtd/tile_workspace.py` `TileWorkspace`: per-operator `buffers`, `pinned` and `host_staging` dicts keyed by a fixed set of slot names (replaced in place when a larger slot is needed), a `bindings` OrderedDict evicted above `cache_entries=32`, and an `events` list cleared by `drain()`; all bounded per operator and freed with it.
- No `weakref`-less module-level registry of solver objects exists in this tree. The per-process live-reservation registry of branch g5-memory (commit 649ad79, not merged at 6eb7996) is absent here and must be added to the sampled measures when it lands; `FusedYeeCUDA` holds its grid through `weakref.ref`.

## Findings

- No path retains anything per iteration: after the 20-iteration warm-up every path shows zero growth of torch allocated and reserved bytes, of the CuPy pool (unused, 0 bytes: the fused kernels run on torch storage), of live tensors, of CUDA graphs, of every module cache and of every solver state holder; the gc object count grows by exactly one per sample, the sample dict itself.
- differentiable_cuda_torch fails the RSS allowance by one step: RSS 1184.81 to 1187.31 MiB and private bytes 2872.6 to 2875.0 MiB between the iteration-40 and iteration-50 samples (growth 2,670,592 and 2,502,656 bytes against 2,097,152), then flat; the second half of the run (iteration 50 to 150) moves RSS by 40,960 bytes and private bytes by 0. A separate 500-iteration run of the same path in a fresh process (not recorded) moved RSS from 1177.4 to 1178.2 MiB with no sample-to-sample step above 0.5 MiB, so the step is a one-time host heap growth, not a per-iteration retention.
- dispersive_cuda fails the private-bytes allowance by one step: private bytes 3127.3 to 3159.1 MiB (33,353,728 bytes) between the iteration-30 and iteration-40 samples while RSS moved by 49,152 bytes over the whole judged window; the second half moves private bytes by 36,864 bytes. Committed-but-untouched host memory of that size with no device, tensor or object change is the signature of the WDDM driver backing device allocations of a display GPU shared with about fifty graphical processes and the other agents' runs; an identical 31.8 MiB step appeared in the tensor_project_cuda path in two earlier shakedown runs at iteration 25 to 29 and did not appear in an 80-iteration run of dispersive_cuda in a fresh process (not recorded), nor in a 200 s pure-torch CUDA autograd loop of 6,493 iterations (not recorded). It is not attributable to a torchfdtd reference.
- tensor_project_cuda fails the RSS allowance by one step: RSS 1430.18 to 1432.20 MiB (2,146,304 bytes against 2,097,152) between the iteration-20 and iteration-30 samples, then flat; the second half moves RSS by 20,480 bytes and private bytes by -36,864 bytes. Same character as the differentiable_cuda_torch step: a one-time host heap growth in a torch-backward path, not a per-iteration retention.
- The declared criterion (maximum after the warm-up minus the warm-up value) was kept as declared; the three flagged paths are recorded as failing it. The second-half table above is the evidence that nothing grows per iteration, and tests/test_adjoint_leak_soak.py asserts zero growth of live tensors and solver state holders over 30 CPU iterations of all seven differentiable families.
