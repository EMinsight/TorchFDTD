# Replay-cost policy and explicit streamed admission

RTX 5880 Ada, Torch 2.10.0, 2026-09-20. These are development measurements,
not external-solver comparisons or public-release clearance.

## Checkpoint-aware selection

The selector measures 12 and 24 steps and predicts a held-out 48-step complete
forward/backward iteration on a 64 x 16 x 16 FP64 grid. Four candidates share
two block checkpoints. One warm-up and two measurements per duration are used.
The prediction separates startup, forward-block and transpose-block costs and
counts the current schedule's forward replays exactly. It does not optimize the
checkpoint schedule itself. Every candidate passes signal and gradient parity
against the resident solver in the held-out benchmark.

| Slab / K / transfers | Predicted full (s) | Measured full median (s) | Prediction error |
| --- | ---: | ---: | ---: |
| 8 / 1 / sync | 4.587921 | 4.852977 | -5.46% |
| 16 / 3 / sync | 0.867760 | 0.852299 | +1.81% |
| 32 / 4 / sync | 0.424788 | 0.444326 | -4.40% |
| 32 / 4 / async | 0.346151 | 0.342882 | +0.95% |

The selector chose candidate 3, the fastest of
these four measured candidates. Calibration cost was 13.010638 s.
Compared with the wide synchronous candidate, the measured saving was
0.101444 s per iteration,
so recovering calibration cost against that fixed policy would take about
128 iterations if these timings remain unchanged.
Earlier single-prefix selection missed the fastest candidate in two trials,
as preserved in [the preceding report](TILE_RUNTIME_REPORT.md). This one successful
held-out trial does not prove general duration or hardware portability.

## Explicit large-scene admission

`Region(memory_mode="streamed")` permits grids above the resident eight-million
cell cap only through the streamed Python execution path. Resident entry points
reject this mode before allocating full fields. Streamed admission checks explicit
budgets before state construction. A per-axis metadata limit remains in force.

The capacity smoke test uses 256 x 256 x 128 = 8,388,608 cells, FP32, 10 steps,
one checkpoint, a point source, point observations and CPML. The GPU budget is
512 MiB and host budget is 12 GiB. Each row is a single cold complete iteration,
not a warmed throughput benchmark.

| Slab / K | Complete iteration (s) | Torch CUDA peak (MiB) | GPU reservation (MiB) | Host reservation (GiB) |
| --- | ---: | ---: | ---: | ---: |
| 8 / 1 | 10.153055 | 62.29 | 192.00 | 3.00 |
| 16 / 2 | 4.250417 | 117.66 | 384.00 | 3.19 |

Both policies produced finite nonzero signals and gradients. Their gradient
relative L2 difference was 9.04853e-08.
This is policy parity, not an independent large-grid physics reference. The
short duration leaves much of the domain unexcited. The test exceeds the old
scene-size guard but does not exceed this GPU's physical 48 GB VRAM. Reported
host reservations are estimates, not measured whole-process RSS. Torch CUDA
peaks exclude context and allocator caching, and user geometry/optimizer memory
is outside solver admission.

## Reproduction and evidence

```sh
python -m benchmarks.streamed_policy --output results/streamed-replay-cost-5880.json
python -m benchmarks.streamed_capacity --output results/streamed-capacity-5880.json
```

[Policy measurements](streamed-replay-cost-5880.json),
[capacity measurements](streamed-capacity-5880.json), and
[source hashes](replay-policy-source-evidence.json) preserve the execution scope.
Physical VRAM overflow, long propagation, unified resident/DRAM/NVMe selection,
CR objective validation and full-physics derivatives remain unfinished.

Regression checks passed on both local RTX 3060 and remote RTX 5880:
717 passed, one skipped. The final six admission tests, including the two
subsequently added estimate-scope and tensor-batch rejection checks, also passed
on both devices. The isolated wheel build was checked against every current
package file, including web assets. Its SHA-256 is
`11681b58144d32b2bf1afd1bdab54fcc96ff1b09d8105eaa9cffb5afbfdecd07`.
The source allowlist audit found no matching restricted-file or credential
patterns. Its publication status remains `NOT_CLEARED_FOR_PUBLICATION`.
