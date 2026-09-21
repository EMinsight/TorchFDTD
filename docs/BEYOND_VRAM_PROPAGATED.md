# Beyond-VRAM propagated case: pillar-array lens, streamed plane adjoint

Context: **rehearsal**, driver stage `complete`, recorded 2026-09-22T04:40:28+0900 on NVIDIA GeForce RTX 3060 (12.88 GB VRAM, 85.63 GB RAM), torch 2.10.0+cu126. Rendered from the record by `benchmarks/report_beyond_vram_propagated.py`; every number below is copied from it. Verdict against the declared cases: **PASS**.

## Fixture

| Item | Value |
|---|---|
| Grid, cells | 320 x 320 x 64, 6,553,600 |
| Mesh, footprint, period, pillars | 0.05 um, 14.0 um, 1.0 um, 196 |
| Pillar height, radii, epsilon | 0.6 um, 0.15 to 0.42 um, 4.0 |
| Source plane, monitor plane, focal distance | z = -0.8 um, z = 0.6 um, 150.0 um |
| Wavelengths | 1.65, 1.55, 1.45 um |
| Steps, time step, duration | 1836, 0.0953 fs, 175.0 fs (source ends at 84.7 fs) |
| DFT resolution, minimum separation | 5.71 THz, 11.72 THz |
| Source amplitude ratio at the wavelengths | 0.801, 0.995, 0.752 |
| Plane samples, observers | 1225 (35 x 35 x 1), 58,800 |
| E/H bytes, state with CPML | 0.16 GB, 0.20 GB |

## Policy and reservation

| Item | Value |
|---|---|
| Slab width, temporal depth, global and local checkpoints | 32, 16, 2, 1 |
| State storage | host banks, capacity 5 states |
| Host reservation, GPU reservation | 2.05 GB, 0.77 GB |
| Dense parameter reservation, extended tile cells | 0.21 GB, 1,310,720 |

## Results

| Item | Value |
|---|---|
| Objective (on-axis focal intensity, time-normalized, summed over wavelengths) | 2.203528e-03 |
| Focal intensity per wavelength | 3.3078e-04, 1.3530e-03, 5.1970e-04 |
| Plane electric energy per wavelength | 4.0491e-13, 5.1686e-13, 1.2653e-13 |
| Plane energy peak, rise step, final fraction | step 388 (37.1 fs), step 135, 1.069e-04 |
| Gradient norm, design-slab norm, nonzero cells | 1.3012e-04, 3.5548e-05, 6,552,961 |
| Directional derivative, finite difference | -5.796778e-03, -5.743961e-03 (central, step 0.05, 478,464 cells) |
| Finite-difference relative error, relative response | 9.111e-03, 2.607e-01 |

## Resident reference (rehearsal)

| Item | Value |
|---|---|
| Objective relative difference | 1.057e-07 |
| Design-slab gradient relative L2 | 5.766e-07 |
| Energy history relative L2 | 1.156e-16 |
| Resident forward, backward | 6.9 s, 134.6 s |

## Timings

| Phase | Wall |
|---|---|
| Streamed forward | 40.0 s |
| Streamed backward (VJP) | 400.5 s |
| Finite-difference forward (plus) | 55.8 s |
| Finite-difference forward (minus) | 44.8 s |
| Driver total | 696.1 s |

## Memory and disk, measured separately

| Quantity | Forward | Backward |
|---|---|---|
| Peak Torch allocated | 0.10 GB | 0.30 GB |
| Peak Torch reserved | 0.17 GB | 0.50 GB |
| Peak process RSS | 3.07 GB | 3.26 GB |
| Peak process private bytes | 5.67 GB | 6.23 GB |
| Peak whole-device CUDA in use | 1.31 GB | 1.64 GB |
| Machine disk read bytes | 0.02 GB | 0.20 GB |
| Machine disk write bytes | 0.03 GB | 0.37 GB |

RSS and private bytes are this process, sampled every half second; device in use is the whole GPU (every process) from cudaMemGetInfo; disk bytes are psutil machine-wide counters over the phase. None of these are added together.

## Criteria

| Case | Criterion | Value | Limit | Result |
|---|---|---|---|---|
| G5-05 | grid equals the declared grid | [320, 320, 64]  | [320, 320, 64] | PASS |
| G5-05 | steps equal the declared steps | 1836  | 1836 | PASS |
| G5-05 | E/H bytes at least the declared minimum | 157286400 bytes | 157286400 | PASS |
| G5-05 | plane energy rises before its peak | 135 step | 388 | PASS |
| G5-05 | plane energy decayed fraction at the final step | 1.0692e-04  | 1.0000e-03 | PASS |
| G5-05 | DFT resolution over the minimum wavelength separation | 4.8741e-01  | 5.0000e-01 | PASS |
| G5-05 | source amplitude ratio at the weakest declared wavelength | 7.5169e-01  | 5.0000e-01 | PASS |
| G5-05 | gradient finite | True  | True | PASS |
| G5-05 | gradient nonzero entries | 6552961 cells | 1 | PASS |
| G5-05 | design-slab gradient norm positive | 3.5548e-05  | 0.0000e+00 | PASS |
| G5-05 | finite-difference kind | central  | central | PASS |
| G5-05 | finite-difference step | 5.0000e-02  | 5.0000e-02 | PASS |
| G5-05 | finite-difference direction radius | 1.0000e+01 um | 1.0000e+01 | PASS |
| G5-05 | finite-difference relative response | 2.6067e-01  | 2.0000e-04 | PASS |
| G5-05 | finite-difference relative error | 9.1115e-03  | 3.0000e-02 | PASS |
| G5-05 | resident/streamed objective relative difference | 1.0566e-07  | 1.0000e-04 | PASS |
| G5-05 | resident/streamed design-slab gradient relative L2 | 5.7658e-07  | 1.0000e-04 | PASS |
| G5-05 | resident finite-difference relative error | 9.1100e-03  | 3.0000e-02 | PASS |
| G5-06 | wall time of the driver | 6.9608e+02 s | 3600 | PASS |
| G5-06 | machine disk writes over the run phases | 533565440 bytes | 100000000000 | PASS |
| G5-06 | forward memory and disk measurements recorded separately | True  | True | PASS |
| G5-06 | backward memory and disk measurements recorded separately | True  | True | PASS |
| G5-06 | driver stage complete | complete  | complete | PASS |

Case files: G5-05 `3eb4df6c4c98607d46c59436cba9b593ea3941f7d7d8e578d2a0554061dbe462`, G5-06 `eefe69dcbea013ac8dacf90dea96c5346d79a2b98665ef2a002f30759677ff3c`.

## What this does and does not show

- The pulse crosses the pillar layer and reaches the output plane: the plane energy history rises, peaks and decays to the recorded fraction within the declared duration; the spectrum is accumulated online at three wavelengths whose separation exceeds twice the DFT resolution.
- The streamed adjoint returns the dense epsilon VJP; its directional derivative along the declared pillar direction agrees with the recorded finite difference within the declared tolerance. This is a first-derivative check, not a converged or optimized design.
- The E/H state of one bank is below the physical VRAM of the workstation; what exceeds it is the live adjoint state at the declared checkpoint schedule. Memory, timing and disk figures are separate measurements and are not added together.
- The wall-time model in the driver is a fit to earlier records, not a throughput claim; the recorded timings are single cold runs on a shared machine.
