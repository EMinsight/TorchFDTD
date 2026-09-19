# Reusable and asynchronous tile runtime validation

Measured on 20 September 2026 with RTX 5880 Ada. This follows the
[initial slab prototype](STREAMED_REPORT.md), not an external solver benchmark.

## Validation

The full local and RTX 5880 Python suites each passed 707 tests with one skip.
The local full suite preceded a transfer-counter-only correction, followed
by 14 passing workspace/tuning checks. The remote full suite includes that
correction. Tests cover FP32/FP64 forward and transpose parity, nondefault
streams, one to three asynchronous slots, allocation ownership, cache
invalidation, failures before output staging and safe retry.

## Matched 24-step runtime ablation

All modes use the same 64 x 16 x 16 grid and FP64 problem. Streamed modes
use width eight, depth three and two temporal checkpoints. The asynchronous
mode uses two staging slots. One warm-up per mode precedes three repetitions
in alternating mode order. Timings include a complete forward/backward
iteration. Peak bytes count Torch CUDA allocations, not total board memory.

| Mode | Median iteration (s) | Peak Torch CUDA bytes |
| --- | ---: | ---: |
| resident | 0.036497 | 5,467,648 |
| streamed | 0.701000 | 2,090,496 |
| streamed_direct_unreused | 0.878407 | 2,090,496 |
| streamed_dlpack | 1.163277 | 2,090,496 |
| streamed_async | 0.634432 | 4,180,480 |

The reused synchronous gradient relative L2 is 4.75923e-16.
Every mode passes the recorded signal and elementwise gradient tolerances.
Reuse and asynchronous staging improve this streamed implementation but
remain slower than resident execution for this small problem. Additional
asynchronous slots trade memory for pipeline concurrency. No hardware
utilization or complete transfer/compute overlap was measured.

## Prefix policy selection and held-out duration

Each trial times the same 12-step prefix, with one warm-up and two measured
iterations per admitted policy. It then independently times the full 48-step
problem using every candidate. Tuning cost is reported separately and must
be amortized over subsequent optimization iterations. Candidate IDs are:

- 0: width 8, K=1, synchronous.
- 1: width 16, K=3, synchronous.
- 2: width 32, K=4, synchronous.
- 3: width 32, K=4, two asynchronous slots.

| Trial | Selected | Tuning cost (s) | Selected full / fastest full | Full medians by candidate (s) |
| --- | ---: | ---: | ---: | --- |
| Initial | 2 | 5.302903 | 1.1991 | 4.770832, 0.845263, 0.402949, 0.336030 |
| Final | 2 | 4.608717 | 1.2852 | 4.749296, 0.832783, 0.443106, 0.344771 |

The initial trial selected a policy about 20% slower than the best full-run
candidate. These results do not prove that a short prefix predicts the
best policy for arbitrary durations, geometries or devices. Selection is
currently among streamed policies only, not resident versus DRAM/NVMe.

## Evidence and remaining work

[Runtime rows](tile-runtime-5880.json), [initial policy trial](tile-policy-initial-5880.json),
[final policy trial](tile-policy-final-5880.json) and
[source hashes](tile-runtime-source-evidence.json) preserve the evidence.
The initial policy trial predates the logical transfer-counter correction.
Its zero counters on synchronous paths are unavailable measurements, not
evidence of zero traffic. Final counters report logical workspace payload
bytes, not measured PCIe transactions.

The eight-million-cell guard, true physical VRAM-overflow validation,
long-duration policy validation, local replay improvements, unified tier
selection and CR validation remain open. No public-release clearance or
all-physics differentiation is claimed.
