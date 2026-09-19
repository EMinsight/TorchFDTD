# Whole-block calibration for streamed policy selection

RTX 5880 Ada, Torch 2.10.0, 2026-09-20. A timing model does not establish
full-run optimality, external-solver superiority or public-release readiness.

## Correction and bounded controls

Previously every candidate used the same short calibration durations. For a
K=32 candidate, a 12-step probe reduced its halo and local replay work, so the
measured operation differed from a complete block in the target run. The
revised selector rounds the requested probe up to a complete block separately
for each candidate and measures that duration and twice it. Only a complete
target run may terminate in a partial block. Predictions compare complete
target times, not times from unequal calibration lengths.

Every distinct duration is compared against the first admitted reference
policy. A new duration is not checked against itself merely because no other
candidate used that duration. Reference signals and gradients are retained in
the declared host reservation. Extra reference runs count in total tuning time.
`max_calibration_steps=512` rejects candidates that require longer calibration
before simulation. Failure reports retain the reason.

Optional `refine_candidates=2` adds one doubled calibration duration for the
initially fastest two predictions, within the same duration limit, and refits
from the two longest measurements. Its possible reference buffers are reserved
before execution. This bounded heuristic is disabled by default. It increases
cost and did not improve the selected policy in the sequential trials below.

## Workload and exploratory measurements

The FP64 grid is 64 x 16 x 16 with periodic x, CPML y/z, a continuous point
source and two point monitors. Candidates use two global block checkpoints:
0 is slab 16/K=8, 1 is slab 32/K=16, 2 is slab 32/K=32 and 3 is slab 32/K=32
with one local checkpoint. Transfers are synchronous. All held-out signals and
gradients pass comparison with the resident adjoint. Each duration/mode has
one warm-up. The first three trials use two timed repeats and the last two
use three. Full-run candidate order alternates between repeats.

| Trial | Selected | Tuning cost (s) | Selected full / fastest full | Full median times by candidate (s) |
| --- | ---: | ---: | ---: | --- |
| Initial aligned, 128 steps | 3 | 6.450158 | 1.0000 | 1.152008, 0.561021, 0.838540, 0.468215 |
| Exploratory aligned, 512 steps | 1 | 6.048288 | 1.2791 | 6.397917, 2.863841, 3.824118, 2.238921 |
| Exploratory refined, 512 steps | 1 | 10.494277 | 1.1950 | 6.052890, 2.584691, 3.728885, 2.162870 |
| Sequential refined, 512 steps | 3 | 11.477112 | 1.0000 | 6.057102, 2.640817, 3.658912, 2.208966 |
| Sequential aligned, 512 steps | 3 | 7.677371 | 1.0000 | 5.998536, 2.575555, 3.600296, 2.154262 |

The exploratory 512-step trials selected a slower policy. Their execution may
overlap agent-launched regression tests and they must not be treated as clean
performance comparisons. They are retained rather than discarded. The last
two trials ran sequentially after those tests had completed, with no further
agent-launched tests during measurement. The pre-run GPU utilization snapshot
was 0% with 7,108 MiB allocated in both cases. This snapshot and scheduling
discipline do not establish exclusive hardware access or eliminate OS noise.

Both sequential modes selected candidate 3, the fastest measured candidate.
Refinement added calibration work without changing that outcome. The
unrefined mode therefore remains the default. These observations do not
establish the same ranking for other geometries, devices or durations.

## Predictions in sequential trials

| Mode | Candidate | Calibration steps | Predicted 512-step iteration (s) | Measured median (s) |
| --- | ---: | --- | ---: | ---: |
| Sequential refined, 512 steps | 0 | [16, 32] | 5.237186 | 6.057102 |
| Sequential refined, 512 steps | 1 | [16, 32, 64] | 2.566326 | 2.640817 |
| Sequential refined, 512 steps | 2 | [32, 64] | 3.419392 | 3.658912 |
| Sequential refined, 512 steps | 3 | [32, 64, 128] | 2.294854 | 2.208966 |
| Sequential aligned, 512 steps | 0 | [16, 32] | 5.668459 | 5.998536 |
| Sequential aligned, 512 steps | 1 | [16, 32] | 2.556141 | 2.575555 |
| Sequential aligned, 512 steps | 2 | [32, 64] | 3.453537 | 3.600296 |
| Sequential aligned, 512 steps | 3 | [32, 64] | 0.251946 | 2.154262 |

The model still has measurable prediction error. A partial target block,
startup variation, allocator behavior and hardware contention remain relevant.
Calibration cost must be amortized over repeated use of a stable workload.
The selected policy must pass admission again when the full simulation runs.

## Reproduction and evidence

```sh
python -m benchmarks.streamed_policy --deep-tiles --steps 128 --refine-candidates 0 --output results/aligned-policy-5880.json
python -m benchmarks.streamed_policy --deep-tiles --steps 512 --refine-candidates 0 --output results/aligned-policy-long-5880.json
python -m benchmarks.streamed_policy --deep-tiles --steps 512 --refine-candidates 2 --output results/refined-policy-long-5880.json
python -m benchmarks.streamed_policy --deep-tiles --steps 512 --repeats 3 --refine-candidates 2 --output results/refined-policy-isolated-5880.json
python -m benchmarks.streamed_policy --deep-tiles --steps 512 --repeats 3 --refine-candidates 0 --output results/aligned-policy-isolated-5880.json
```

File names containing `isolated` identify the sequential trials described above,
not a claim of exclusive device ownership. The source does not reproduce
incidental background contention in exploratory runs.

- [Initial aligned, 128 steps](aligned-policy-5880.json)
- [Exploratory aligned, 512 steps](aligned-policy-long-5880.json)
- [Exploratory refined, 512 steps](refined-policy-long-5880.json)
- [Sequential refined, 512 steps](refined-policy-isolated-5880.json)
- [Sequential aligned, 512 steps](aligned-policy-isolated-5880.json)

[Current source hashes](aligned-policy-source-evidence.json) pin the runtime.
The final default refinement count is zero. Explicit flags above reproduce
each trial's requested mode. Initial exploratory records predate refinement
report fields.

The 25 affected local and RTX 5880 tests passed before the final default change.
The final-default local checks also passed. They cover aligned block boundaries,
full-duration clipping, rejection before simulation, reference-policy comparisons
at unique durations, corrupted-result rejection, bounded refinement and design
gradient preservation. The runtime physics and CUDA kernels are unchanged.
Full physical VRAM overflow, spatial NVMe backing, CR validation, all-physics
derivatives and integrated UI controls remain unfinished.
