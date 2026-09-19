## Selective-output CUDA ensembles

**NVIDIA RTX 5880 Ada Generation, 8 cases per row, 800 float32 steps, three planes with 65 frequencies, cohorts of 4, 3 measured repetitions after warmup.** Full wall includes setup, graph capture, final E/H, point traces and selected results. Cold compilation/context and disk writes are excluded.

When the requested observable is signed flux, the new output selector accumulates **four tangential E/H components instead of six**, and omits unused field/Poynting exports. The same flux frequencies, quadrature and time samples are retained. The full-output column is the native batch with all six fields and three Poynting components stored. The external flaport/fdtd 0.2.2 sequence also receives the **same selective fused observer**, using the lower median of its one-step/eight-step graph options. Native graphs use one step.

| Workload | Grid | flaport sequence (s) | Native full-output batch (s) | Native flux-only batch (s) | Output-selection gain | vs flaport sequence |
|---|---:|---:|---:|---:|---:|---:|
| Vacuum | 32³ | 3.404 | 0.241 | 0.211 | 1.14× | 16.11× |
| Sphere | 32³ | 3.381 | 0.220 | 0.175 | 1.26× | 19.32× |
| Slab | 32³ | 3.324 | 0.239 | 0.194 | 1.23× | 17.14× |
| Waveguide | 32³ | 3.475 | 0.244 | 0.213 | 1.14× | 16.30× |
| Vacuum | 64³ | 4.388 | 0.833 | 0.492 | 1.69× | 8.91× |
| Sphere | 64³ | 4.298 | 0.882 | 0.541 | 1.63× | 7.95× |
| Slab | 64³ | 4.208 | 0.847 | 0.544 | 1.56× | 7.74× |
| Waveguide | 64³ | 4.204 | 0.889 | 0.533 | 1.67× | 7.89× |

Cohort scheduling and memory are separate from output selection:

| Workload | Grid | Flux-only native sequential (s) | Flux-only batch gain | Batch cases/s | Torch peak allocated, full / flux-only (MiB) |
|---|---:|---:|---:|---:|---:|
| Vacuum | 32³ | 0.304 | 1.44× | 37.86 | 18.51 / 14.88 |
| Sphere | 32³ | 0.280 | 1.60× | 45.70 | 18.51 / 14.88 |
| Slab | 32³ | 0.283 | 1.46× | 41.24 | 18.51 / 14.88 |
| Waveguide | 32³ | 0.309 | 1.45× | 37.54 | 18.51 / 14.88 |
| Vacuum | 64³ | 0.535 | 1.09× | 16.25 | 103.15 / 96.25 |
| Sphere | 64³ | 0.576 | 1.07× | 14.80 | 103.15 / 96.25 |
| Slab | 64³ | 0.546 | 1.00× | 14.71 | 103.15 / 96.25 |
| Waveguide | 64³ | 0.557 | 1.04× | 15.02 | 103.15 / 96.25 |

**All 120 timed-ensemble accuracy gates pass.** Native final E/H, point traces and signed flux agree bitwise with independent full-output runs. Maximum external trace relative L2 is 0.3267% (gate 1%) and flux relative L2 is 0.1314% (gate 2%). External full-field differences remain in the raw record without a full-field equivalence claim.

These gains apply when the omitted fields are not requested. They are not six-field-output speedups, mesh-converged error claims or adjoint measurements. Temporal/spatial decimation was **not** used in this comparison. Torch memory excludes context, driver and graph-executable allocations outside its allocator. Three repetitions do not establish confidence intervals. FDTDX, fdtdz and fdtd3d remain unmeasured on this GPU.

[Python/UI controls](../CUDA_SPECTRA.md), [all modes and repetitions](../validation/SELECTIVE_MONITOR_REPORT.md), [input/settings/hash/error record](../validation/selective-monitors.json).

## Every execution mode

| Workload | Grid | Mode | Full wall (s) | Setup (s) | Loop (s) | Torch allocated / reserved (MiB) | Repetitions, full wall (s) |
|---|---:|---|---:|---:|---:|---:|---|
| vacuum | 32³ | flaport_flux_1 | 3.403525 | 0.417978 | 2.955453 | 31.41 / 38.00 | 3.619777, 3.403525, 3.402492 |
| vacuum | 32³ | flaport_flux_8 | 3.804397 | 0.786271 | 2.969018 | 31.41 / 40.00 | 3.995436, 3.804397, 3.734429 |
| vacuum | 32³ | native_sequential_flux | 0.303544 | 0.142184 | 0.120193 | 3.72 / 10.00 | 0.303544, 0.326284, 0.276443 |
| vacuum | 32³ | native_batch_full | 0.240934 | 0.126415 | 0.051582 | 18.51 / 22.00 | 0.258836, 0.240934, 0.213961 |
| vacuum | 32³ | native_batch_flux | 0.211303 | 0.127198 | 0.047204 | 14.88 / 18.00 | 0.211916, 0.211303, 0.171889 |
| sphere | 32³ | flaport_flux_1 | 3.381422 | 0.357664 | 3.020445 | 31.41 / 38.00 | 3.381422, 3.359935, 3.633368 |
| sphere | 32³ | flaport_flux_8 | 3.651942 | 0.642975 | 2.961674 | 31.41 / 40.00 | 3.651942, 3.640529, 3.982552 |
| sphere | 32³ | native_sequential_flux | 0.280022 | 0.120275 | 0.118102 | 3.72 / 10.00 | 0.279337, 0.280022, 0.305353 |
| sphere | 32³ | native_batch_full | 0.219798 | 0.103753 | 0.051495 | 18.51 / 22.00 | 0.219798, 0.218768, 0.258067 |
| sphere | 32³ | native_batch_flux | 0.175065 | 0.092221 | 0.047000 | 14.88 / 18.00 | 0.174534, 0.175065, 0.213648 |
| slab | 32³ | flaport_flux_1 | 3.324064 | 0.328782 | 2.965125 | 31.41 / 38.00 | 3.411985, 3.320350, 3.324064 |
| slab | 32³ | flaport_flux_8 | 3.683376 | 0.643508 | 2.977744 | 31.41 / 40.00 | 3.739104, 3.683376, 3.659033 |
| slab | 32³ | native_sequential_flux | 0.283491 | 0.123522 | 0.118269 | 3.72 / 10.00 | 0.293076, 0.283491, 0.281265 |
| slab | 32³ | native_batch_full | 0.238659 | 0.124758 | 0.051625 | 18.51 / 22.00 | 0.238659, 0.249823, 0.217308 |
| slab | 32³ | native_batch_flux | 0.193964 | 0.108911 | 0.047196 | 14.88 / 18.00 | 0.195451, 0.193964, 0.175663 |
| waveguide | 32³ | flaport_flux_1 | 3.474545 | 0.460143 | 2.984506 | 31.41 / 38.00 | 3.319806, 3.634469, 3.474545 |
| waveguide | 32³ | flaport_flux_8 | 3.973317 | 0.913736 | 3.011783 | 31.41 / 40.00 | 3.973317, 3.977639, 3.747462 |
| waveguide | 32³ | native_sequential_flux | 0.308531 | 0.145812 | 0.119292 | 3.72 / 10.00 | 0.308531, 0.308812, 0.292680 |
| waveguide | 32³ | native_batch_full | 0.243611 | 0.127589 | 0.051950 | 18.51 / 22.00 | 0.243611, 0.260565, 0.238373 |
| waveguide | 32³ | native_batch_flux | 0.213098 | 0.128643 | 0.047448 | 14.88 / 18.00 | 0.213098, 0.213825, 0.194839 |
| vacuum | 64³ | flaport_flux_1 | 4.387540 | 0.663736 | 3.605360 | 251.25 / 338.00 | 4.090355, 4.389533, 4.387540 |
| vacuum | 64³ | flaport_flux_8 | 4.540662 | 0.791595 | 3.611469 | 251.25 / 360.00 | 4.445669, 4.748207, 4.540662 |
| vacuum | 64³ | native_sequential_flux | 0.535148 | 0.192396 | 0.194997 | 24.08 / 32.00 | 0.512859, 0.559821, 0.535148 |
| vacuum | 64³ | native_batch_full | 0.833179 | 0.159080 | 0.335685 | 103.15 / 122.00 | 0.828540, 0.833179, 0.847464 |
| vacuum | 64³ | native_batch_flux | 0.492253 | 0.144601 | 0.204225 | 96.25 / 100.00 | 0.492253, 0.490231, 0.519272 |
| sphere | 64³ | flaport_flux_1 | 4.298203 | 0.569455 | 3.613062 | 251.25 / 338.00 | 4.125812, 4.425485, 4.298203 |
| sphere | 64³ | flaport_flux_8 | 4.630204 | 0.876779 | 3.620723 | 251.25 / 360.00 | 4.477509, 4.783534, 4.630204 |
| sphere | 64³ | native_sequential_flux | 0.575797 | 0.231292 | 0.195563 | 24.08 / 32.00 | 0.540194, 0.586266, 0.575797 |
| sphere | 64³ | native_batch_full | 0.882447 | 0.204286 | 0.337159 | 103.15 / 122.00 | 0.851240, 0.905923, 0.882447 |
| sphere | 64³ | native_batch_flux | 0.540581 | 0.187727 | 0.206951 | 96.25 / 100.00 | 0.511792, 0.540581, 0.550733 |
| slab | 64³ | flaport_flux_1 | 4.207719 | 0.480428 | 3.613037 | 251.25 / 338.00 | 4.109537, 4.379233, 4.207719 |
| slab | 64³ | flaport_flux_8 | 4.548128 | 0.792837 | 3.622120 | 251.25 / 360.00 | 4.484605, 4.764203, 4.548128 |
| slab | 64³ | native_sequential_flux | 0.545629 | 0.199597 | 0.195020 | 24.08 / 32.00 | 0.520105, 0.560373, 0.545629 |
| slab | 64³ | native_batch_full | 0.847004 | 0.172688 | 0.337347 | 103.15 / 122.00 | 0.842687, 0.885970, 0.847004 |
| slab | 64³ | native_batch_flux | 0.543890 | 0.183944 | 0.208870 | 96.25 / 100.00 | 0.544473, 0.543890, 0.499593 |
| waveguide | 64³ | flaport_flux_1 | 4.204070 | 0.477953 | 3.612826 | 251.25 / 338.00 | 4.113722, 4.208095, 4.204070 |
| waveguide | 64³ | flaport_flux_8 | 4.534991 | 0.778397 | 3.625604 | 251.25 / 360.00 | 4.453042, 4.756988, 4.534991 |
| waveguide | 64³ | native_sequential_flux | 0.556755 | 0.209074 | 0.195896 | 24.08 / 32.00 | 0.556755, 0.563529, 0.522174 |
| waveguide | 64³ | native_batch_full | 0.889329 | 0.207007 | 0.336785 | 103.15 / 122.00 | 0.889329, 0.889368, 0.836487 |
| waveguide | 64³ | native_batch_flux | 0.532796 | 0.188022 | 0.205464 | 96.25 / 100.00 | 0.541555, 0.532796, 0.502479 |

## Reproduce

```bash
python -m benchmarks.selective_monitors
python -m benchmarks.report_selective_monitors
python -m pytest tests/test_monitor_outputs.py tests/test_cuda_monitors.py
```
