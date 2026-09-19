## Rectilinear mesh and batch ablation

**NVIDIA RTX 5880 Ada Generation, 4 independent cases per row, 800 float32 steps, median of 3 warmed repetitions.**

The native solver now supports independent axis spacing and explicit rectilinear node arrays. This experiment retains the same physical domain, propagation step, actual time step, sources, PML, duration and 17 flux frequencies. Transverse spacing changes from 0.05 to 0.2 µm, removing 93.75% of cells. The geometries and normal-incidence excitation are uniform in both transverse directions. This is a native mesh ablation, separate from the cross-library tables below.

| Workload | Uniform → rectangular grid | Uniform batch (s) | Rectangular batch (s) | Mesh gain | Batch gain at rectangular mesh | Torch peak allocated, uniform → rectangular (MiB) |
|---|---|---:|---:|---:|---:|---:|
| Vacuum | 128 × 64 × 64 → 128 × 16 × 16 | 0.312 | 0.060 | 5.18× | 1.80× | 120.71 → 7.63 |
| Slab | 128 × 64 × 64 → 128 × 16 × 16 | 0.326 | 0.075 | 4.33× | 1.62× | 120.71 → 7.63 |
| Bilayer | 128 × 64 × 64 → 128 × 16 × 16 | 0.326 | 0.075 | 4.34× | 1.54× | 120.71 → 7.63 |
| Multilayer | 128 × 64 × 64 → 128 × 16 × 16 | 0.336 | 0.069 | 4.88× | 1.70× | 120.71 → 7.63 |
| Vacuum | 192 × 96 × 96 → 192 × 24 × 24 | 1.175 | 0.088 | 13.39× | 1.48× | 386.24 → 24.23 |
| Slab | 192 × 96 × 96 → 192 × 24 × 24 | 1.199 | 0.099 | 12.09× | 1.41× | 386.24 → 24.23 |
| Bilayer | 192 × 96 × 96 → 192 × 24 × 24 | 1.203 | 0.095 | 12.67× | 1.42× | 386.24 → 24.23 |
| Multilayer | 192 × 96 × 96 → 192 × 24 × 24 | 1.255 | 0.094 | 13.37× | 1.46× | 386.24 → 24.23 |

**All 72 timed-ensemble gates pass.** Maximum relative L2 across centerline final E/H, full point traces and signed flux is **5.95e-15** (gate: 3e-5). Every final E/H array is constant along the transverse directions in this experiment. Different grids contain different sample counts. This does not establish a curved-geometry accuracy improvement, a resolution-independent speedup, or superiority over another library.

Full wall includes preparation, graph capture, and final fields/monitor transfer. Cold compilation/context, validation and disk writes are excluded. Memory is the Torch allocator peak, excluding external context, driver and graph allocations. Three repetitions do not establish confidence intervals.

[Python and UI controls](../RECTILINEAR_MESH.md), [example](../../examples/rectilinear_mesh.py), [inputs, repetitions, errors and source hashes](rectilinear-ensembles.json).
