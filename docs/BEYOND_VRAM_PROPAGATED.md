# Beyond-VRAM propagated case: pillar-array lens, streamed plane adjoint

Context: **rtx3060**, driver stage `complete`, recorded 2026-09-22T19:15:29+0900 on NVIDIA GeForce RTX 3060 (12.88 GB VRAM, 85.63 GB RAM), torch 2.10.0+cu126. Rendered from the record by `benchmarks/report_beyond_vram_propagated.py`; every number below is copied from it. Verdict against the declared cases: **PASS**.

## Fixture

| Item | Value |
|---|---|
| Grid, cells | 920 x 920 x 64, 54,169,600 |
| Mesh, footprint, period, pillars | 0.05 um, 44.0 um, 1.0 um, 1936 |
| Pillar height, radii, epsilon | 0.6 um, 0.15 to 0.42 um, 4.0 |
| Source plane, monitor plane, focal distance | z = -0.8 um, z = 0.6 um, 150.0 um |
| Wavelengths | 1.65, 1.55, 1.45 um |
| Steps, time step, duration | 1836, 0.0953 fs, 175.0 fs (source ends at 84.7 fs) |
| DFT resolution, minimum separation | 5.71 THz, 11.72 THz |
| Source amplitude ratio at the wavelengths | 0.801, 0.995, 0.752 |
| Plane samples, observers | 12100 (110 x 110 x 1), 580,800 |
| E/H bytes, state with CPML | 1.30 GB, 1.59 GB |

## Policy and reservation

| Item | Value |
|---|---|
| Slab width, temporal depth, global and local checkpoints | 64, 32, 6, 1 |
| State storage | host banks, capacity 9 states |
| Host reservation, GPU reservation | 21.37 GB, 4.50 GB |
| Dense parameter reservation, extended tile cells | 1.73 GB, 7,536,640 |

## Results

| Item | Value |
|---|---|
| Objective (on-axis focal intensity, time-normalized, summed over wavelengths) | 6.004725e-02 |
| Focal intensity per wavelength | 1.6509e-02, 2.4449e-02, 1.9090e-02 |
| Plane electric energy per wavelength | 4.0914e-12, 6.0615e-12, 3.0044e-12 |
| Plane energy peak, rise step, final fraction | step 382 (36.5 fs), step 130, 5.914e-04 |
| Gradient norm, design-slab norm, nonzero cells | 8.2766e-04, 1.9166e-04, 54,167,761 |
| Directional derivative, finite difference | 3.821848e-02, 3.792115e-02 (central, step 0.05, 729,216 cells) |
| Finite-difference relative error, relative response | 7.780e-03, 6.315e-02 |

## Timings

| Phase | Wall |
|---|---|
| Streamed forward | 176.0 s |
| Streamed backward (VJP) | 1234.0 s |
| Finite-difference forward (plus) | 176.8 s |
| Finite-difference forward (minus) | 176.0 s |
| Driver total | 1774.8 s |

## Memory and disk, measured separately

| Quantity | Forward | Backward |
|---|---|---|
| Peak Torch allocated | 0.48 GB | 1.61 GB |
| Peak Torch reserved | 0.68 GB | 2.60 GB |
| Peak process RSS | 6.63 GB | 22.19 GB |
| Peak process private bytes | 9.60 GB | 28.00 GB |
| Peak whole-device CUDA in use | 1.79 GB | 3.71 GB |
| Machine disk read bytes | 0.13 GB | 0.31 GB |
| Machine disk write bytes | 0.76 GB | 3.72 GB |

RSS and private bytes are this process, sampled every half second; device in use is the whole GPU (every process) from cudaMemGetInfo; disk bytes are psutil machine-wide counters over the phase. None of these are added together.

## Whole-machine counters

| Item | Value |
|---|---|
| Samples, span | 358, 1792 s |
| Installed RAM, peak in use, minimum available | 85.63 GB, 76.68 GB, 8.95 GB |
| Peak committed, peak file cache, peak standby | 120.24 GB, 4.15 GB, 10.84 GB |
| Disk write mean, peak, integrated | 0.00 GB/s, 0.41 GB/s, 7.92 GB |
| Disk read mean, peak, integrated | 0.00 GB/s, 0.09 GB/s, 1.39 GB |
| CPU mean, peak | 63.4 %, 93.7 % |

Whole-machine Windows performance counters sampled every five seconds: OS file cache and every process are included, so peak_system_in_use is an upper bound on what this run added to the machine. Integrated bytes are rate times sampling interval, not a byte-exact I/O count.

## Criteria

| Case | Criterion | Value | Limit | Result |
|---|---|---|---|---|
| G5-05 | grid equals the declared grid | [920, 920, 64]  | [920, 920, 64] | PASS |
| G5-05 | steps equal the declared steps | 1836  | 1836 | PASS |
| G5-05 | E/H bytes at least the declared minimum | 1300070400 bytes | 1300070400 | PASS |
| G5-05 | plane energy rises before its peak | 130 step | 382 | PASS |
| G5-05 | plane energy decayed fraction at the final step | 5.9142e-04  | 1.0000e-03 | PASS |
| G5-05 | DFT resolution over the minimum wavelength separation | 4.8741e-01  | 5.0000e-01 | PASS |
| G5-05 | source amplitude ratio at the weakest declared wavelength | 7.5169e-01  | 5.0000e-01 | PASS |
| G5-05 | gradient finite | True  | True | PASS |
| G5-05 | gradient nonzero entries | 54167761 cells | 1 | PASS |
| G5-05 | design-slab gradient norm positive | 1.9166e-04  | 0.0000e+00 | PASS |
| G5-05 | finite-difference kind | central  | central | PASS |
| G5-05 | finite-difference step | 5.0000e-02  | 5.0000e-02 | PASS |
| G5-05 | finite-difference direction radius | 1.0000e+01 um | 1.0000e+01 | PASS |
| G5-05 | finite-difference relative response | 6.3152e-02  | 2.0000e-04 | PASS |
| G5-05 | finite-difference relative error | 7.7797e-03  | 5.0000e-02 | PASS |
| G5-06 | wall time of the driver | 1.7748e+03 s | 14400 | PASS |
| G5-06 | machine disk writes over the run phases | 7103095808 bytes | 2000000000000 | PASS |
| G5-06 | integrated machine disk writes from the counters | 7.9211e+09 bytes | 2000000000000 | PASS |
| G5-06 | forward memory and disk measurements recorded separately | True  | True | PASS |
| G5-06 | backward memory and disk measurements recorded separately | True  | True | PASS |
| G5-06 | physical VRAM recorded | 12884377600 bytes | 12500000000 | PASS |
| G5-06 | live adjoint state (checkpoint banks plus dense parameters) over physical VRAM | 1.2474e+00  | 1.0000e+00 | PASS |
| G5-06 | E/H bytes over physical VRAM (reported, below one by design of the budget) | 1.0090e-01  | None | PASS |
| G5-06 | driver stage complete | complete  | complete | PASS |

Case files: G5-05 `4e0cb0ffcf2bab73cb19f8c68d610217dce6619db900972c4b913abf75d3bf13`, G5-06 `db86c4c419d4f3932e59273828e13ca82336782081b9966086f964f444bfbda0`.

## What this does and does not show

- The pulse crosses the pillar layer and reaches the output plane: the plane energy history rises, peaks and decays to the recorded fraction within the declared duration; the spectrum is accumulated online at three wavelengths whose separation exceeds twice the DFT resolution.
- The streamed adjoint returns the dense epsilon VJP; its directional derivative along the declared pillar direction agrees with the recorded finite difference within the declared tolerance. This is a first-derivative check, not a converged or optimized design.
- The E/H state of one bank is below the physical VRAM of the workstation; what exceeds it is the live adjoint state at the declared checkpoint schedule. Memory, timing and disk figures are separate measurements and are not added together.
- The wall-time model in the driver is a fit to earlier records, not a throughput claim; the recorded timings are single cold runs on a shared machine.
