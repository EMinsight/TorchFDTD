# Material-aware policy and allocation validation

The [policy API](../STREAMED_POLICY.md) now calibrates dielectric and ADE point
histories or spectra, checks dimensionless material derivatives separately,
and bounds reference-gradient storage. Generated policies fit current budgets
and compare global checkpoint counts. Explicit candidates retain their settings.

Final local RTX 3060 checks on 2026-09-20:

| Scope | Result |
| --- | --- |
| Existing policy tuning, material tuning and complex streamed API | 33 passed |
| Tile allocation/ownership, complex CUDA slabs, streamed ADE and graph lifetime | 90 passed |
| CPU tuning followed by two geometry/damping Adam evaluations | Completed |
| CUDA spectral tuning followed by the same two evaluations | Completed |
| Full-duration policy driver, including CPU and CUDA ADE spectra | 6 passed |

The material suite deliberately corrupts only the gamma VJP while keeping
forward values unchanged. The normalized comparison rejects that policy in
both FP32 and FP64. Other tests cover bounded compact references, eviction
without cyclic GC, no mutation of user `.grad`, full-budget rejection before
packing and automatic width fitting with global checkpoint counts 0, 2 and 4.

The [example record](material-policy-example-3060.json) records the selected
CUDA spectral policy and its probes. Its reference cache retains 46,208 bytes
within a 64 MiB limit. Comparison-memory reservation is 92,416 bytes. Tuning
takes about 24 seconds in this small example. The following point-spectrum
losses are `9.310127345711881e-5` and `9.286054878265005e-5`, matching the
untuned and CPU examples. This proves connectivity, not optimality or useful
device performance. An independent CR run was active on the workstation, so
these timings must not be used as a solver-speed comparison.

The completed 54 GiB nondispersive packet rerun found a transient CUDA peak
increase rather than an improvement. Its record is retained in the
[capacity report](../BEYOND_VRAM_VALIDATION.md#reusable-packet-rerun).
Inspection identified a forward output allocation retained during growth
of the backward output buffer. The workspace now releases its expired owner
before requesting the replacement. A caller retaining a view still keeps it
valid. This is an ownership change, without changes to the field equations.

The [corrected ADE driver check](streamed-ade-growth-smoke-3060.json) retains
the same 64-cubed complex FP64 one-pole calculation and VJP oracle. Peak Torch
CUDA allocation decreases from 76,226,560 to 69,622,272 bytes. Both records are
explicitly small driver checks. Neither establishes dispersive capacity beyond
VRAM, and a large run of this lifetime fix remains required.

The [completed 54 GiB E/H/P/Q experiment](DISPERSIVE_CAPACITY_REPORT.md) used a
frozen earlier snapshot `d77e958`. It did not include the new policy tuner or
output-growth fix. Its results are attributed to that snapshot rather than
the current implementation.

The extended `benchmarks.streamed_policy` driver records admitted/rejected
candidates, the unchanged prefix selection, full-duration ranking and tuning
payback. Checks cover complex two-pole CUDA spectra, real FP32 time histories,
material-gradient groups, a policy regression with no payback and calibration
overlap. CPU and CUDA driver tests use small grids and are correctness evidence
only. They do not measure a large-domain scheduling advantage.

## Held-out RTX 5880 real-FP32 policy comparison

The [128-cubed two-pole record](material-policy-128-fp32-5880.json) completed
128 steps with three point-spectrum frequencies, one warmup and three timed
full runs per policy. This is the frozen `981b0c3` baseline with the earlier
2K halo. All 71 source hashes were verified against that revision. Prefix
selection was preserved before the full runs. The longest calibration was
32 steps, so the 128-step duration was held out from selection.

| Width / depth | Tile transfer | Global / local checkpoints | Full median, s |
| --- | --- | --- | ---: |
| 16 / 4 | Synchronous | 2 / 0 | 21.5427 |
| 32 / 8 | Synchronous | 2 / 0 | 8.8396 |
| 32 / 8 | Asynchronous, 2 buffers | 2 / 0 | **5.1552** |
| 32 / 8 | Synchronous | 2 / 1 | 8.5015 |
| 32 / 8 | Synchronous | 0 / 0 | 17.4686 |
| 32 / 8 | Synchronous | 4 / 0 | 7.9612 |

The prefix-selected policy was also the fastest measured full-duration policy.
It was 4.18 times faster than the first admitted policy and 1.71 times faster
than the matched synchronous width-32/depth-8 policy. All full runs passed the
resident reference's signal and separate scaled material-gradient checks.
Complete tuning wall time was 70.757 seconds, giving a measured payback of
five iterations against the first policy under this driver's timing contract.
Individual repetitions and prediction errors remain in the record.

E/H and two-pole P/Q occupy only 144 MiB before CPML and other workspaces.
This experiment establishes policy quality in a problem that fits VRAM. It
does not compare streaming against resident performance or establish the same
gain beyond physical VRAM. It is not an external-solver comparison, a complete
device optimizer or a cold-storage benchmark. The causal-halo and complex-FP64
comparisons use separate records.

The [complex-FP64 fixed-Bloch record](material-policy-128-complex-fp64-5880.json)
also completed with the same frozen source, grid, two poles, frequencies,
checkpoint candidates and repetition scheme. Its longest calibration was
32 steps for the held-out 128-step workload. The independent Bloch phase was
0.63 radians. The raw record retains all material-gradient comparisons and
the 71 verified source hashes.

| Width / depth | Tile transfer | Global / local checkpoints | Full median, s |
| --- | --- | --- | ---: |
| 16 / 4 | Synchronous | 2 / 0 | 69.3094 |
| 32 / 8 | Synchronous | 2 / 0 | 35.7122 |
| 32 / 8 | Asynchronous, 2 buffers | 2 / 0 | **22.7809** |
| 32 / 8 | Synchronous | 2 / 1 | 34.4108 |
| 32 / 8 | Synchronous | 0 / 0 | 70.2365 |
| 32 / 8 | Synchronous | 4 / 0 | 32.9150 |

Again the prefix-selected candidate was fastest among the measured full runs.
It gives a 3.04 ratio relative to the first admitted policy and a 1.57 ratio
relative to the matched synchronous width-32/depth-8 policy. Tuning took
265.091 seconds, corresponding to six iterations of payback against the first
policy. This remains a resident-size native scheduling comparison, with the
same limitations as the real-FP32 case. It does not establish unified
resident-versus-streamed policy quality.
