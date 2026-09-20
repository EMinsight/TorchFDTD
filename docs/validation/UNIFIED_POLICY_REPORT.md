# Held-out resident and streamed policy selection

Two RTX 5880 runs on 20 September 2026 compare nine resident/streamed policies
on a 128-cubed grid, two Drude/Lorentz poles, three point-spectrum frequencies
and 128 time steps. Calibration sees at most 32 steps. Every admitted policy
has one warm-up and three full-duration repetitions. Complete complex outputs
and all scaled material VJPs are compared to a resident reference.

| Policy | Real FP32 median, s | Complex FP64 median, s |
| --- | ---: | ---: |
| Resident, two device checkpoints | 0.5645 | 5.1187 |
| Resident, zero checkpoints | 3.3770 | 32.6094 |
| Resident, two asynchronous host checkpoints | 2.0964 | 9.2229 |
| Streamed width 16, depth 4, synchronous | 18.0673 | 60.1568 |
| Streamed width 32, depth 8, synchronous | 7.3851 | 28.3114 |
| Same slab, asynchronous double buffering | 4.5078 | 18.1197 |
| Same synchronous slab, one local checkpoint | 7.1475 | 27.5022 |
| Same synchronous slab, zero global checkpoints | 14.6780 | 56.8547 |
| Same synchronous slab, four global checkpoints | 7.0460 | 26.5778 |

Both calibrations select the two-device-checkpoint resident policy, which is
also fastest over the complete duration. The other streamed policies use two
global and zero local checkpoints unless the row states otherwise. The
complex case uses fixed x-Bloch phase 0.63. Each policy has a 16 GiB GPU and
64 GiB host budget.

Tuning costs 60.524 s for FP32 and 223.389 s for complex FP64. Since the first
admitted resident policy is already fastest, tuning does not save time relative
to that baseline and no payback iteration is claimed. The useful outcome is
avoiding unnecessary streaming for this resident-size workload. It is not a
claim that automatic tuning outperforms a well-chosen resident policy.

Largest full-output or material-gradient relative errors are 1.62e-6 and
6.02e-15. The [FP32](unified-policy-128-fp32-5880.json) and
[complex FP64](unified-policy-128-complex-fp64-5880.json) records retain all
repetitions, rejected/selected policies, predictions, calibration costs and
73 verified driver/runtime hashes from revision `780d0aa`. Subsequent byte
admission, allocation accounting and fixed-plane additions are separate code
revisions and cannot be attributed to these measurements.

These are native policy comparisons on problems that fit in VRAM. They do not
establish beyond-VRAM speed, converged optical accuracy, geometry/optimizer
iteration time, detector-plane performance or an external-solver advantage.
