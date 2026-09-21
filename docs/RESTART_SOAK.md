# Restart journal soak

Long-run stability of the streamed engine with the restart journal enabled, on one light 2D fixture, CPU by design.
Rendered by `benchmarks/restart_soak.py --render` from `docs/validation/g5/G5-10_soak_3060.json`; the criteria were declared in
`docs/validation/cases/G5-10_restart_soak.json` before the run. This is a memory-growth and discrete-stability soak, not a throughput or physics-accuracy measurement.

## Fixture and environment

- Domain 16 x 15 cells (1.6 x 1.5 um, mesh 0.1 um), three-cell PML, one Gaussian point source, three point monitors, float32, epsilon 1.7, CPU tiles, slab width 16.
- Long forward: 100000 steps in blocks of 100, a journal record every 10 blocks (100 records, 149.5 s of journal writes), 259 s.
- Repeated runs: 8 forward-plus-backward runs of 600 steps (blocks of 20), each with its own journal, 439 s.
- Optimization: 100 projected Adam updates over a filtered 16 x 15 density, 120 steps per solve, a journal per iteration and a design checkpoint per update, final beta 8, 397 s.
- Windows-10-10.0.26200-SP0, Intel64 Family 6 Model 151 Stepping 2, GenuineIntel, Python 3.10.2, torch 2.10.0+cu126, 4 threads, commit 767bc8fa5a88c42a284ce14f2e86fd29002f88aa, recorded 2026-09-21T20:08:15+00:00.

## Memory growth after warm-up

Least-squares slope of each counter over the samples after the declared warm-up; the bound is the pre-declared limit. Torch counters are the CUDA allocator statistics and stay zero on CPU.

| Part | Warm-up | RSS slope | Bound | RSS first / last after warm-up | Torch allocated slope | Torch reserved slope | Verdict |
|---|---|---|---|---|---|---|---|
| Long forward | 5000 steps | 0.046 MB per 1000 steps | 1.0 MB | 606.539 / 609.586 MB | 0 B | 0 B | pass |
| Repeated runs | 2 run | 0.009 MB per run | 1.0 MB | 609.930 / 609.969 MB | 0 B | 0 B | pass |
| Optimization | 5 updates | 0.003 MB per update | 0.25 MB | 660.383 / 660.574 MB | 0 B | 0 B | pass |

## Journal and discrete stability

- Journal bytes never exceeded the reservation: peak 2446949 of 2508800 reserved bytes (pass).
- State norm sum eps E^2 + sum H^2 after every block; the source ends at 110.8 fs (step 475), the post-source peak is frozen at 10.3282.
- Largest norm relative to that peak over the 996 later blocks: 1.97349e-11 against the declared growth limit 1.5 (pass); monotone decay is not demanded.
- Largest relative norm over the last half of the run: 3.16e-14 against the declared ceiling 1e-06 (pass); at the last step 3.16e-14; all signals finite: True.
- Repeated runs returned bitwise identical gradients: True (pass); optimization objectives and gradients finite: True (pass).

## Verdict: pass

Every criterion above is judged by `tests/test_restart_soak_record.py` against this record; the test runs nothing long.

Not shown: throughput, CUDA execution, large domains, multi-hour wall time and power-loss durability. RSS is the process resident set sampled between blocks; it includes the interpreter and every library, and transient peaks inside a block are not sampled.
