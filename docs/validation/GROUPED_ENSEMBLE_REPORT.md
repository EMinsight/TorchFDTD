## Mixed meshes and durations in one Python batch

**RTX 5880 Ada, 16 cases per row, float32, median of 3 warmed repetitions.** Every row interleaves vacuum, sphere, slab and waveguide cases across two meshes or durations. Three planes retain all six complex field components at nine frequencies, plus complete final E/H, point traces and native snapshots.

`run_grouped_batch()` automatically groups exact compatible cases and restores input result order. The four-case cohort cap is fixed before measurement. Full wall includes grouping, setup, graph capture, stepping and output transfer. No grid padding, precision reduction, decimation or shortened run is used.

| Mixed conditions | flaport sequence (s) | Native sequence (s) | Native grouped (s) | vs flaport sequence | vs native sequence | Grouped cases/s |
|---|---:|---:|---:|---:|---:|---:|
| 32³ + 48³, 800 steps | 6.958 | 0.649 | 0.455 | 15.30× | 1.43× | 35.18 |
| 32³ + 64³, 800 steps | 7.892 | 0.722 | 0.578 | 13.66× | 1.25× | 27.70 |
| 32³, 400 + 800 steps | 5.827 | 0.522 | 0.348 | 16.76× | 1.50× | 46.00 |
| 64³, 400 + 800 steps | 6.337 | 0.891 | 0.852 | 7.44× | 1.05× | 18.78 |

The external baseline is **flaport/fdtd 0.2.2 with CUDA Graph and the same fused DFT observer**. It calls unchanged upstream E/H updates. Both one-step and eight-step graphs are measured, and the table uses the lower median. This compares ensemble workflows against an external sequence, not an independently optimized upstream batch implementation.

**All 48 timed-ensemble gates pass.** Native complete outputs agree bitwise with independent native runs. Maximum external point-trace and complex-plane DFT relative L2 differences are **0.3233%** and **0.3875%**, respectively, below the predeclared 1% gates. External final E/H differences remain in the raw record without an equivalence claim.

| Mixed conditions | Grouping and preflight (ms) | Torch peak allocated, sequential / grouped (MiB) |
|---|---:|---:|
| 32³ + 48³, 800 steps | 38.8 | 8.00 / 31.98 |
| 32³ + 64³, 800 steps | 39.0 | 17.92 / 71.63 |
| 32³, 400 + 800 steps | 38.2 | 2.66 / 10.61 |
| 64³, 400 + 800 steps | 39.5 | 17.92 / 71.63 |

The speedup uses existing fused cohort kernels. The new capability schedules heterogeneous inputs automatically. Groups execute successively on one GPU and objective callbacks follow cohort order. Complex fields, automatic per-case termination, grouped optimizer routing and GUI ensemble submission remain open. Cold interpreter/context/compiler, checks and disk I/O are excluded. Torch memory excludes external graph, driver and context allocations. Three repetitions do not establish confidence intervals. **FDTDX, fdtdz and fdtd3d remain unmeasured on this GPU.**

[Python API and semantics](../GROUPED_BATCH.md), [standalone example](../../examples/grouped_batch.py), [all inputs, repetitions, errors and source hashes](../validation/grouped-ensembles.json).
