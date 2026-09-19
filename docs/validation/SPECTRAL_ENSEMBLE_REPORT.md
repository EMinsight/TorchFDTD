## Spectral ensembles: monitor fusion and independent CUDA batches

8 independent cases per row, 800 steps, float32, NVIDIA RTX 5880 Ada Generation. Every case records three spatial planes, six complex E/H components at nine frequencies, one point trace and final E/H. Cohorts contain 4 cases. Medians of 3 warmed full-solve timings include preparation and result transfer. No output resolution or time step is reduced.

The external baseline uses **flaport/fdtd 0.2.2 + CUDA Graph + the same new fused DFT adapter**, executing cases sequentially. The external Torch-DFT baseline is also retained in the full report. The native reference already uses fused Yee updates, with Torch DFT per plane. The new selectable monitor path shares interpolation and spectral accumulation launches across planes and cases.

| Workload | Grid | flaport + adapters, sequential (s) | Native Torch DFT, batch (s) | Shared CUDA DFT, batch (s) | vs flaport sequence | Monitor improvement at same cohort |
|---|---:|---:|---:|---:|---:|---:|
| Vacuum | 32³ | 3.444 | 1.367 | 0.182 | 18.89× | 7.50× |
| Sphere | 32³ | 3.458 | 1.434 | 0.204 | 16.91× | 7.01× |
| Slab | 32³ | 3.465 | 1.325 | 0.163 | 21.23× | 8.12× |
| Waveguide | 32³ | 3.364 | 1.331 | 0.181 | 18.58× | 7.35× |
| Vacuum | 64³ | 4.111 | 1.560 | 0.370 | 11.12× | 4.22× |
| Sphere | 64³ | 4.248 | 1.581 | 0.436 | 9.75× | 3.63× |
| Slab | 64³ | 4.114 | 1.606 | 0.395 | 10.41× | 4.06× |
| Waveguide | 64³ | 4.145 | 1.563 | 0.382 | 10.84× | 4.09× |

Batch scheduling contributes separately from monitor fusion:

| Workload | Grid | Shared DFT, native sequential (s) | Shared DFT, batch (s) | Batch vs sequential | Batch cases/s | Torch peak allocated, sequential / batch (MiB) |
|---|---:|---:|---:|---:|---:|---:|
| Vacuum | 32³ | 0.301 | 0.182 | 1.65× | 43.90 | 2.66 / 10.61 |
| Sphere | 32³ | 0.322 | 0.204 | 1.57× | 39.13 | 2.66 / 10.61 |
| Slab | 32³ | 0.283 | 0.163 | 1.73× | 49.02 | 2.66 / 10.61 |
| Waveguide | 32³ | 0.281 | 0.181 | 1.55× | 44.19 | 2.66 / 10.61 |
| Vacuum | 64³ | 0.447 | 0.370 | 1.21× | 21.64 | 17.92 / 71.63 |
| Sphere | 64³ | 0.464 | 0.436 | 1.07× | 18.35 | 17.92 / 71.63 |
| Slab | 64³ | 0.471 | 0.395 | 1.19× | 20.24 | 17.92 / 71.63 |
| Waveguide | 64³ | 0.445 | 0.382 | 1.16× | 20.93 | 17.92 / 71.63 |

**Accuracy gates: passed in every row.** Maximum complete complex-plane DFT relative L2 difference is **0.3875%** against the external adapter (gate: 1%), and **5.28e-08** against native Torch DFT (gate: 3e-6). Native final E/H and point traces match bitwise. Fused single and batch complex DFTs match bitwise. The previous Torch and new fused DFTs are tolerance-equivalent, with small reduction-order rounding differences.

These are measured forward ensemble ratios against the stated adapters, not speed rankings against FDTDX, fdtdz or fdtd3d. They do not establish mesh-converged accuracy, mode efficiency or adjoint performance. Batching raises resident memory. Torch allocation excludes CUDA context/driver overhead. The raw record retains late-time external full-field differences without claiming full-field equivalence.

[Python/UI selection and algorithm](../CUDA_SPECTRA.md), [full record](../validation/spectral-ensembles.json), [reproduction and all timing modes](../validation/SPECTRAL_ENSEMBLE_REPORT.md).

## Every measured execution mode

| Workload | Grid | Mode | Full wall median (s) | Loop median (s) | Raw full wall repetitions (s) |
|---|---:|---|---:|---:|---|
| vacuum | 32³ | flaport_graph | 4.555103 | 4.042316 | 4.795238, 4.555103, 4.437524 |
| vacuum | 32³ | flaport_fused_dft | 3.443565 | 3.001959 | 3.652777, 3.443565, 3.413471 |
| vacuum | 32³ | native_sequential | 1.440014 | 1.191385 | 1.503468, 1.440014, 1.396490 |
| vacuum | 32³ | native_batch | 1.367462 | 1.151189 | 1.427074, 1.367462, 1.322949 |
| vacuum | 32³ | fused_sequential | 0.300665 | 0.130503 | 0.300665, 0.301402, 0.277609 |
| vacuum | 32³ | fused_batch | 0.182250 | 0.046038 | 0.182250, 0.183479, 0.160535 |
| sphere | 32³ | flaport_graph | 4.590974 | 4.057181 | 4.452362, 4.741597, 4.590974 |
| sphere | 32³ | flaport_fused_dft | 3.457900 | 3.010564 | 3.431151, 3.661183, 3.457900 |
| sphere | 32³ | native_sequential | 1.505194 | 1.194405 | 1.505194, 1.509801, 1.441193 |
| sphere | 32³ | native_batch | 1.434182 | 1.155323 | 1.434384, 1.434182, 1.373233 |
| sphere | 32³ | fused_sequential | 0.321594 | 0.130337 | 0.322969, 0.321594, 0.305390 |
| sphere | 32³ | fused_batch | 0.204456 | 0.046306 | 0.205284, 0.204456, 0.185970 |
| slab | 32³ | flaport_graph | 4.769384 | 4.059389 | 4.448915, 4.769505, 4.769384 |
| slab | 32³ | flaport_fused_dft | 3.465173 | 3.013577 | 3.346126, 3.465173, 3.667035 |
| slab | 32³ | native_sequential | 1.401332 | 1.194550 | 1.401332, 1.400976, 1.509574 |
| slab | 32³ | native_batch | 1.325421 | 1.155100 | 1.325421, 1.325242, 1.434504 |
| slab | 32³ | fused_sequential | 0.282898 | 0.130725 | 0.282898, 0.280385, 0.318983 |
| slab | 32³ | fused_batch | 0.163187 | 0.046067 | 0.161668, 0.163187, 0.193572 |
| waveguide | 32³ | flaport_graph | 4.467838 | 4.068332 | 4.467849, 4.466106, 4.467838 |
| waveguide | 32³ | flaport_fused_dft | 3.364337 | 3.014764 | 3.363735, 3.365440, 3.364337 |
| waveguide | 32³ | native_sequential | 1.407037 | 1.198451 | 1.406685, 1.407037, 1.501051 |
| waveguide | 32³ | native_batch | 1.330664 | 1.157980 | 1.329044, 1.330664, 1.439987 |
| waveguide | 32³ | fused_sequential | 0.280653 | 0.130294 | 0.280653, 0.279260, 0.322830 |
| waveguide | 32³ | fused_batch | 0.181043 | 0.046158 | 0.162003, 0.181043, 0.202813 |
| vacuum | 64³ | flaport_graph | 5.412706 | 4.698809 | 5.290945, 5.412706, 5.553825 |
| vacuum | 64³ | flaport_fused_dft | 4.110939 | 3.607732 | 4.108440, 4.110939, 4.339261 |
| vacuum | 64³ | native_sequential | 1.597072 | 1.286254 | 1.589892, 1.597072, 1.702104 |
| vacuum | 64³ | native_batch | 1.560224 | 1.287599 | 1.560126, 1.560224, 1.606638 |
| vacuum | 64³ | fused_sequential | 0.446910 | 0.191254 | 0.437426, 0.446910, 0.470438 |
| vacuum | 64³ | fused_batch | 0.369703 | 0.150330 | 0.369703, 0.367601, 0.394121 |
| sphere | 64³ | flaport_graph | 5.382624 | 4.699432 | 5.328707, 5.402029, 5.382624 |
| sphere | 64³ | flaport_fused_dft | 4.247686 | 3.608535 | 4.070910, 4.276322, 4.247686 |
| sphere | 64³ | native_sequential | 1.610362 | 1.286244 | 1.609055, 1.722965, 1.610362 |
| sphere | 64³ | native_batch | 1.580524 | 1.288620 | 1.580524, 1.700349, 1.578559 |
| sphere | 64³ | fused_sequential | 0.464245 | 0.191390 | 0.463165, 0.554842, 0.464245 |
| sphere | 64³ | fused_batch | 0.435850 | 0.150425 | 0.435850, 0.437088, 0.388985 |
| slab | 64³ | flaport_graph | 5.317513 | 4.702265 | 5.512298, 5.317513, 5.274829 |
| slab | 64³ | flaport_fused_dft | 4.113646 | 3.609965 | 4.312402, 4.113646, 4.079083 |
| slab | 64³ | native_sequential | 1.595000 | 1.287072 | 1.704282, 1.595000, 1.591993 |
| slab | 64³ | native_batch | 1.606297 | 1.287608 | 1.607160, 1.606297, 1.561394 |
| slab | 64³ | fused_sequential | 0.470597 | 0.190577 | 0.470597, 0.474112, 0.445620 |
| slab | 64³ | fused_batch | 0.395298 | 0.150603 | 0.395298, 0.397358, 0.375523 |
| waveguide | 64³ | flaport_graph | 5.424613 | 4.702742 | 5.424613, 5.318637, 5.479683 |
| waveguide | 64³ | flaport_fused_dft | 4.145373 | 3.610292 | 4.145373, 4.108813, 4.359219 |
| waveguide | 64³ | native_sequential | 1.597341 | 1.287435 | 1.590471, 1.597341, 1.704844 |
| waveguide | 64³ | native_batch | 1.562774 | 1.287934 | 1.562774, 1.553426, 1.678991 |
| waveguide | 64³ | fused_sequential | 0.445070 | 0.190611 | 0.441412, 0.445070, 0.487859 |
| waveguide | 64³ | fused_batch | 0.382283 | 0.150928 | 0.382283, 0.369810, 0.402491 |

## Reproduction

```bash
python -m benchmarks.spectral_ensemble --sizes 32 64 --count 8 --cohort 4 --steps 800 --repeats 3
python -m benchmarks.report_spectral --input results/open-source/spectral-ensembles.json
```

Raw JSON retains full input projects, package versions, source SHA-256 hashes, declared accuracy gates, all timed output errors and absolute reference scales. No commercial solver inputs or outputs are used.
