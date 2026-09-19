# Analytic CAD and material-preparation ablation

**RTX 5880 Ada, four independent scenes per row, eight solids per scene, 800 float32 steps, median of three warmed repetitions.**

Native CAD now includes extruded concave polygons, ellipsoids, elliptical cylinders/ring sectors and ordered three-axis rotations. The new preparation path tests membership only inside conservative solid bounds. The baseline tests the same analytic equations over the whole domain. Both use identical Yee grids, sources, CPML, CUDA kernels, cohort sizes and complete outputs. This is a native implementation ablation, not a comparison with another library.

| Solids | Grid | Unpruned batch (s) | Bounded batch (s) | Full-wall gain | Host material preparation, before → after (s) |
|---|---:|---:|---:|---:|---:|
| Spheres | 64³ | 0.242 | 0.161 | 1.50× | 0.091 → 0.013 |
| Rotated boxes | 64³ | 0.608 | 0.185 | 3.28× | 0.437 → 0.018 |
| Concave polygons | 64³ | 3.965 | 0.194 | 20.40× | 3.590 → 0.031 |
| Elliptical ring sectors | 64³ | 2.015 | 0.191 | 10.54× | 1.681 → 0.022 |
| Spheres | 96³ | 0.888 | 0.617 | 1.44× | 0.301 → 0.029 |
| Rotated boxes | 96³ | 2.023 | 0.623 | 3.25× | 1.438 → 0.034 |
| Concave polygons | 96³ | 13.768 | 0.650 | 21.19× | 12.843 → 0.053 |
| Elliptical ring sectors | 96³ | 6.414 | 0.628 | 10.21× | 5.578 → 0.044 |

**All 48 timed-ensemble gates pass bitwise** for permittivity, complete final E/H, point traces, time arrays, snapshots, complex plane fields and signed flux. Display tessellation does not enter the material equations. Independent tests also compare analytic volumes and equivalent box/polygon optical representations.

Full wall includes host preparation, CUDA Graph capture, stepping and output transfer. Cold compilation/context, checks and disk writes are excluded. The GPU still updates every Yee cell. These gains primarily remove host preparation work for compact solids and do not establish a faster CUDA update kernel. Unchanged kernels also show different loop timings in some repetitions, so loop fluctuations are retained in the raw record without attributing them to a new kernel. Longer propagation runs or large overlapping solids may benefit less. No geometry-result cache is used in either mode. Three repetitions do not establish confidence intervals.

[Geometry controls and conventions](../ANALYTIC_GEOMETRY.md), [Python batch example](../../examples/analytic_solids.py), [inputs, repetitions and source hashes](geometry-ensembles.json).

Reproduce on a CUDA workstation with `python -m benchmarks.geometry_ensembles --output results/open-source/geometry-ensembles-new.json`. The script refuses to overwrite an existing record.
