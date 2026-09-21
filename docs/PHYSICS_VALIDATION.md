# Physics validation

Independent physics fixtures of the completion program (stage G3). Every section is rendered from a record under docs/validation/g3 by a benchmark script and judged against the pre-declared case under docs/validation/cases.

<!-- g3-b:G3-04 begin -->
## G3-04 Mie scattering of a dielectric cylinder and sphere

Case `G3-04_mie_cylinder_sphere`, record `docs/validation/g3/G3-04.json` generated 2026-09-21T17:23:11+00:00. Closed TFSF box, matched empty-box reference, cross section from the outward scattered power over the incident intensity, against the Mie series written in the test with SciPy Bessel functions. Limit: relative error at most 2.000% at the judged mesh; the coarser meshes are recorded and non-monotone sequences are allowed on staircased surfaces.

| Fixture | Polarization | h (um) | Grid | Steps | Execution | Max relative error | Judged |
|---|---|---:|---|---:|---|---:|---|
| cylinder | TE | 0.0125 | 256x256 | 4112 | cpu float64 | 0.373% | pass |
| cylinder | TE | 0.0125 | 256x256 | 4112 | cuda float32 | 0.373% | recorded |
| cylinder | TE | 0.025 | 128x128 | 2056 | cpu float64 | 0.700% | recorded |
| cylinder | TE | 0.025 | 128x128 | 2056 | cuda float32 | 0.700% | recorded |
| cylinder | TE | 0.05 | 64x64 | 1028 | cpu float64 | 11.163% | recorded |
| cylinder | TM | 0.0125 | 256x256 | 4112 | cpu float64 | 1.737% | pass |
| cylinder | TM | 0.0125 | 256x256 | 4112 | cuda float32 | 1.738% | recorded |
| cylinder | TM | 0.025 | 128x128 | 2056 | cpu float64 | 5.117% | recorded |
| cylinder | TM | 0.025 | 128x128 | 2056 | cuda float32 | 5.117% | recorded |
| cylinder | TM | 0.05 | 64x64 | 1028 | cpu float64 | 3.830% | recorded |
| sphere | Ez | 0.025 | 96x96x96 | 2518 | cpu float64 | 1.047% | recorded |
| sphere | Ez | 0.05 | 48x48x48 | 1259 | cpu float64 | 0.309% | pass |
| sphere | Ez | 0.05 | 48x48x48 | 1259 | cuda float32 | 0.309% | recorded |
| sphere | Ez | 0.1 | 24x24x24 | 630 | cpu float64 | 9.587% | recorded |
| sphere | Ez | 0.1 | 24x24x24 | 630 | cuda float32 | 9.587% | recorded |

Layer A (CUDA FP32 against CPU FP64, same discrete problem, rtol 1e-4 on the cross section):

| Fixture | Polarization | h (um) | Max relative difference | Result |
|---|---|---:|---:|---|
| cylinder | TE | 0.0125 | 1.93e-06 | pass |
| cylinder | TE | 0.025 | 2.08e-06 | pass |
| cylinder | TM | 0.0125 | 1.81e-06 | pass |
| cylinder | TM | 0.025 | 1.54e-06 | pass |
| sphere | Ez | 0.05 | 1.50e-06 | pass |
| sphere | Ez | 0.1 | 9.16e-07 | pass |

Resonance of the 0.25 um, n = 3.5 cylinder (TE): peak position within 1.000% and FWHM within 15.000% at the judged mesh.

| h (um) | Execution | Peak (um) | Mie peak (um) | Position error | FWHM (um) | Mie FWHM (um) | FWHM error | Judged |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 0.0125 | cuda float32 | 1.1299 | 1.1365 | -0.583% | 0.0691 | 0.0653 | 5.720% | pass |
| 0.025 | cpu float64 | 1.1214 | 1.1365 | -1.326% | 0.0778 | 0.0653 | 19.086% | recorded |
<!-- g3-b:G3-04 end -->

<!-- g3-b:G3-08 begin -->
## G3-08 Bloch grating diffraction orders against RCWA

Case `G3-08_bloch_grating_rcwa`, record `docs/validation/g3/G3-08.json` generated 2026-09-21T17:46:00+00:00. Freestanding binary grating, period 1.2 um, fill 0.5, height 0.5 um, n = 2.0, wavelengths [0.92, 1.02, 1.06] um at [0.0, 20.0] degrees, TE and TM. Oracle: TORCWA rigorous coupled-wave analysis, Kim and Lee, Comput. Phys. Commun. 282, 108552 (2023), version 0.1.4.2, complex128, harmonics [20, 40, 80, 160, 320, 640] with the oracle at 640; empty-layer phase check error 8.9e-10. Limits: efficiency error at most 0.01 per propagating order, phase error at most 0.02 rad on orders whose oracle efficiency is at least 0.05, lossless balance within 0.01.

TORCWA harmonic convergence (largest change at the last doubling, 320 to 640 harmonics, over all configurations and orders):

| Polarization | Efficiency change (T) | Efficiency change (R) | Phase change (T, dominant) | Phase change (R, dominant) |
|---|---:|---:|---:|---:|
| TE | 4.8e-08 | 3.6e-08 | 6.3e-08 rad | 6.6e-08 rad |
| TM | 4.1e-04 | 2.0e-04 | 9.7e-04 rad | 1.1e-03 rad |

TORCWA forms the Toeplitz matrix of epsilon directly, so the TM sequence converges like 1/N; the TE sequence is converged to roundoff.

| Pol | Angle | Wavelength (um) | Interface | h (um) | Duration (fs) | Execution | Orders | Max efficiency error | Max dominant phase error (rad) | Sum T+R | Judged |
|---|---:|---:|---|---:|---:|---|---|---:|---:|---:|---|
| TE | 0 | 0.92 | subpixel | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0002 | 0.0019 | 1.0001 | pass |
| TE | 0 | 0.92 | subpixel | 0.01 | 300 | cpu float64 | -1 0 1 | 0.0009 | 0.0055 | 0.9997 | within limits, recorded |
| TE | 0 | 0.92 | subpixel | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0009 | 0.0055 | 0.9997 | within limits, recorded |
| TE | 0 | 1.02 | staircase | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0004 | 0.0333 | 1.0004 | outside limits, recorded |
| TE | 0 | 1.02 | staircase | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0004 | 0.0683 | 1.0002 | outside limits, recorded |
| TE | 0 | 1.02 | subpixel | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0006 | 0.0027 | 1.0004 | pass |
| TE | 0 | 1.02 | subpixel | 0.01 | 150 | cuda float32 | -1 0 1 | 0.0023 | 0.0080 | 1.0004 | within limits, recorded |
| TE | 0 | 1.02 | subpixel | 0.01 | 300 | cpu float64 | -1 0 1 | 0.0009 | 0.0073 | 1.0002 | within limits, recorded |
| TE | 0 | 1.02 | subpixel | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0009 | 0.0073 | 1.0002 | within limits, recorded |
| TE | 0 | 1.06 | subpixel | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0006 | 0.0033 | 1.0008 | pass |
| TE | 0 | 1.06 | subpixel | 0.01 | 300 | cpu float64 | -1 0 1 | 0.0008 | 0.0069 | 1.0005 | within limits, recorded |
| TE | 0 | 1.06 | subpixel | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0008 | 0.0069 | 1.0005 | within limits, recorded |
| TE | 20 | 0.92 | subpixel | 0.005 | 300 | cuda float32 | -1 0 | 0.0031 | 0.0143 | 0.9931 | pass |
| TE | 20 | 0.92 | subpixel | 0.01 | 300 | cpu float64 | -1 0 | 0.0041 | 0.0056 | 0.9906 | within limits, recorded |
| TE | 20 | 0.92 | subpixel | 0.01 | 300 | cuda float32 | -1 0 | 0.0041 | 0.0056 | 0.9906 | within limits, recorded |
| TE | 20 | 1.02 | subpixel | 0.005 | 300 | cuda float32 | -1 0 | 0.0013 | 0.0048 | 1.0030 | pass |
| TE | 20 | 1.02 | subpixel | 0.01 | 300 | cpu float64 | -1 0 | 0.0021 | 0.0098 | 1.0028 | within limits, recorded |
| TE | 20 | 1.02 | subpixel | 0.01 | 300 | cuda float32 | -1 0 | 0.0021 | 0.0098 | 1.0028 | within limits, recorded |
| TE | 20 | 1.06 | subpixel | 0.005 | 300 | cuda float32 | -1 0 | 0.0015 | 0.0008 | 1.0031 | pass |
| TE | 20 | 1.06 | subpixel | 0.01 | 300 | cpu float64 | -1 0 | 0.0035 | 0.0031 | 0.9999 | within limits, recorded |
| TE | 20 | 1.06 | subpixel | 0.01 | 300 | cuda float32 | -1 0 | 0.0035 | 0.0031 | 0.9999 | within limits, recorded |
| TM | 0 | 0.92 | subpixel | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0002 | 0.0004 | 0.9999 | pass |
| TM | 0 | 0.92 | subpixel | 0.01 | 300 | cpu float64 | -1 0 1 | 0.0004 | 0.0030 | 0.9999 | within limits, recorded |
| TM | 0 | 0.92 | subpixel | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0004 | 0.0030 | 0.9999 | within limits, recorded |
| TM | 0 | 1.02 | staircase | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0037 | 0.0063 | 1.0002 | within limits, recorded |
| TM | 0 | 1.02 | staircase | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0071 | 0.0142 | 1.0002 | within limits, recorded |
| TM | 0 | 1.02 | subpixel | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0005 | 0.0018 | 1.0002 | pass |
| TM | 0 | 1.02 | subpixel | 0.01 | 150 | cuda float32 | -1 0 1 | 0.0013 | 0.0033 | 1.0016 | within limits, recorded |
| TM | 0 | 1.02 | subpixel | 0.01 | 300 | cpu float64 | -1 0 1 | 0.0009 | 0.0060 | 1.0002 | within limits, recorded |
| TM | 0 | 1.02 | subpixel | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0009 | 0.0060 | 1.0002 | within limits, recorded |
| TM | 0 | 1.06 | subpixel | 0.005 | 300 | cuda float32 | -1 0 1 | 0.0005 | 0.0032 | 0.9997 | pass |
| TM | 0 | 1.06 | subpixel | 0.01 | 300 | cpu float64 | -1 0 1 | 0.0008 | 0.0069 | 0.9997 | within limits, recorded |
| TM | 0 | 1.06 | subpixel | 0.01 | 300 | cuda float32 | -1 0 1 | 0.0008 | 0.0069 | 0.9997 | within limits, recorded |
| TM | 20 | 0.92 | subpixel | 0.005 | 300 | cuda float32 | -1 0 | 0.0009 | 0.0053 | 1.0021 | pass |
| TM | 20 | 0.92 | subpixel | 0.01 | 300 | cpu float64 | -1 0 | 0.0020 | 0.0080 | 1.0031 | within limits, recorded |
| TM | 20 | 0.92 | subpixel | 0.01 | 300 | cuda float32 | -1 0 | 0.0020 | 0.0080 | 1.0031 | within limits, recorded |
| TM | 20 | 1.02 | subpixel | 0.005 | 300 | cuda float32 | -1 0 | 0.0017 | 0.0034 | 0.9965 | pass |
| TM | 20 | 1.02 | subpixel | 0.01 | 300 | cpu float64 | -1 0 | 0.0014 | 0.0088 | 0.9967 | within limits, recorded |
| TM | 20 | 1.02 | subpixel | 0.01 | 300 | cuda float32 | -1 0 | 0.0014 | 0.0088 | 0.9967 | within limits, recorded |
| TM | 20 | 1.06 | subpixel | 0.005 | 300 | cuda float32 | -1 0 | 0.0018 | 0.0031 | 0.9973 | pass |
| TM | 20 | 1.06 | subpixel | 0.01 | 300 | cpu float64 | -1 0 | 0.0025 | 0.0080 | 0.9999 | within limits, recorded |
| TM | 20 | 1.06 | subpixel | 0.01 | 300 | cuda float32 | -1 0 | 0.0025 | 0.0080 | 0.9999 | within limits, recorded |

Per-order values of the judged rows (FDTD / TORCWA efficiency, phase error in rad):

- TE 0 deg 0.92 um: m=-1: T 0.3503/0.3504 (+0.0011), R 0.0614/0.0612 (+0.0010); m=0: T 0.0934/0.0935 (+0.0009), R 0.0834/0.0833 (+0.0019); m=1: T 0.3503/0.3504 (+0.0011), R 0.0614/0.0612 (+0.0010)
- TE 0 deg 1.02 um: m=-1: T 0.3704/0.3699 (+0.0006), R 0.0106/0.0106 (+0.0007); m=0: T 0.0804/0.0803 (+0.0013), R 0.1582/0.1587 (+0.0027); m=1: T 0.3704/0.3699 (+0.0006), R 0.0106/0.0106 (+0.0007)
- TE 0 deg 1.06 um: m=-1: T 0.3315/0.3309 (-0.0001), R 0.0196/0.0196 (+0.0005); m=0: T 0.0765/0.0765 (+0.0005), R 0.2219/0.2224 (+0.0033); m=1: T 0.3315/0.3309 (-0.0001), R 0.0196/0.0196 (+0.0005)
- TE 20 deg 0.92 um: m=-1: T 0.4602/0.4632 (-0.0009), R 0.1298/0.1301 (-0.0050); m=0: T 0.2864/0.2876 (-0.0029), R 0.1167/0.1190 (-0.0143)
- TE 20 deg 1.02 um: m=-1: T 0.1365/0.1357 (+0.0016), R 0.1435/0.1433 (+0.0048); m=0: T 0.5457/0.5444 (+0.0021), R 0.1773/0.1766 (-0.0001)
- TE 20 deg 1.06 um: m=-1: T 0.0276/0.0276 (+0.0057), R 0.0134/0.0132 (+0.0002); m=0: T 0.3382/0.3367 (+0.0000), R 0.6239/0.6225 (-0.0008)
- TM 0 deg 0.92 um: m=-1: T 0.4811/0.4811 (+0.0004), R 0.0002/0.0002 (+0.0021); m=0: T 0.0155/0.0156 (+0.0026), R 0.0219/0.0219 (-0.0014); m=1: T 0.4811/0.4811 (+0.0004), R 0.0002/0.0002 (+0.0018)
- TM 0 deg 1.02 um: m=-1: T 0.4267/0.4264 (+0.0000), R 0.0163/0.0162 (+0.0008); m=0: T 0.0780/0.0785 (+0.0018), R 0.0362/0.0364 (-0.0016); m=1: T 0.4267/0.4264 (+0.0000), R 0.0163/0.0162 (+0.0008)
- TM 0 deg 1.06 um: m=-1: T 0.3961/0.3960 (-0.0004), R 0.0263/0.0262 (-0.0015); m=0: T 0.1061/0.1065 (+0.0032), R 0.0488/0.0492 (+0.0004); m=1: T 0.3961/0.3960 (-0.0004), R 0.0263/0.0262 (-0.0014)
- TM 20 deg 0.92 um: m=-1: T 0.7277/0.7279 (+0.0015), R 0.1374/0.1365 (+0.0049); m=0: T 0.1149/0.1142 (+0.0053), R 0.0222/0.0214 (+0.0125)
- TM 20 deg 1.02 um: m=-1: T 0.5528/0.5539 (-0.0002), R 0.0281/0.0281 (+0.0051); m=0: T 0.3277/0.3294 (+0.0003), R 0.0878/0.0886 (-0.0034)
- TM 20 deg 1.06 um: m=-1: T 0.5448/0.5449 (+0.0018), R 0.0053/0.0052 (+0.0094); m=0: T 0.3100/0.3110 (+0.0031), R 0.1371/0.1389 (+0.0006)

Layer A (CUDA FP32 against CPU FP64 at h = 0.01 um, every propagating efficiency, rtol 1e-4):

| Pol | Angle | Wavelength (um) | Max relative difference | Result |
|---|---:|---:|---:|---|
| TE | 0 | 0.92 | 3.38e-06 | pass |
| TE | 0 | 1.02 | 1.38e-06 | pass |
| TE | 0 | 1.06 | 2.34e-06 | pass |
| TE | 20 | 0.92 | 4.26e-05 | pass |
| TE | 20 | 1.02 | 8.85e-06 | pass |
| TE | 20 | 1.06 | 8.97e-06 | pass |
| TM | 0 | 0.92 | 1.60e-05 | pass |
| TM | 0 | 1.02 | 7.09e-06 | pass |
| TM | 0 | 1.06 | 5.22e-06 | pass |
| TM | 20 | 0.92 | 1.15e-04 | FAIL |
| TM | 20 | 1.02 | 3.40e-05 | pass |
| TM | 20 | 1.06 | 9.52e-05 | pass |

Empty cell (no grating): forward zero-order transmission relative to the incident line, other orders and the backward zero order.

| Pol | Angle | Execution | T0 | Other orders (max) | Backward zero order | Limit |
|---|---:|---|---:|---:|---:|---:|
| TE | 0 | cpu float64 | 1.00000000 | 6.1e-33 | 5.6e-08 | 1e-06 |
| TE | 0 | cuda float32 | 1.00000037 | 3.2e-33 | 5.6e-08 | 1e-04 |
| TM | 20 | cpu float64 | 0.99999732 | 3.0e-31 | 4.2e-08 | 1e-04 |
| TM | 20 | cuda float32 | 0.99999341 | 1.3e-12 | 4.2e-08 | 1e-04 |

**Revision 2 (case `G3-08r2_bloch_grating_rcwa_layer_a`, records under `docs/validation/g3/r2`, generated 2026-09-21T19:20:04+00:00).** Only the layer-A tolerance is restated as the program pair rtol 1e-4 and atol 1e-6; the first case and its FAILED run stay on record.The re-run of the 12 judged physics rows gives a largest efficiency error of 0.0031, a largest dominant phase error of 0.0143 rad and sums of T and R within 0.0069 of one, all within the unchanged limits.

| Pol | Angle | Wavelength (um) | Max relative difference | Largest excess over rtol abs(cpu) + atol | Result |
|---|---:|---:|---:|---:|---|
| TE | 0 | 0.92 | 3.38e-06 | -7.0e-06 | pass |
| TE | 0 | 1.02 | 1.38e-06 | -2.0e-06 | pass |
| TE | 0 | 1.06 | 2.34e-06 | -2.9e-06 | pass |
| TE | 20 | 0.92 | 4.26e-05 | -7.6e-06 | pass |
| TE | 20 | 1.02 | 8.85e-06 | -1.4e-05 | pass |
| TE | 20 | 1.06 | 8.97e-06 | -2.2e-06 | pass |
| TM | 0 | 0.92 | 1.60e-05 | -1.0e-06 | pass |
| TM | 0 | 1.02 | 7.09e-06 | -2.6e-06 | pass |
| TM | 0 | 1.06 | 5.22e-06 | -3.5e-06 | pass |
| TM | 20 | 0.92 | 1.15e-04 | -6.7e-07 | pass |
| TM | 20 | 1.02 | 3.40e-05 | -3.3e-06 | pass |
| TM | 20 | 1.06 | 9.52e-05 | -1.0e-06 | pass |
<!-- g3-b:G3-08 end -->

<!-- g3-b:G3-13 begin -->
## G3-13 Curved-interface convergence

Case `G3-13_curved_interface_convergence`, record `docs/validation/g3/G3-13.json` generated 2026-09-21T16:55:45+00:00. The G3-04 cylinder (radius 0.3 um, n = 1.5) at h = [0.05, 0.025, 0.0125] um with the staircase and the subpixel interface, centre shifts of [0.0, 0.25, 0.5] h at h = 0.05 um, and the differentiable-solid transition width [1e-06, 0.125, 0.25, 0.5, 1.0, 2.0] h at h = 0.05 um. Pass/fail item: the subpixel error at h is below the staircase error at h; everything else is reported.

| Polarization | Interface | h (um) | Max relative error | Wall (s) |
|---|---|---:|---:|---:|
| TE | staircase | 0.0125 | 0.373% | 36.7 |
| TE | staircase | 0.025 | 0.700% | 3.1 |
| TE | staircase | 0.05 | 11.163% | 0.8 |
| TE | subpixel | 0.0125 | 0.106% | 47.1 |
| TE | subpixel | 0.025 | 0.454% | 4.5 |
| TE | subpixel | 0.05 | 1.974% | 0.9 |
| TM | staircase | 0.0125 | 1.737% | 57.1 |
| TM | staircase | 0.025 | 5.117% | 6.4 |
| TM | staircase | 0.05 | 3.830% | 1.1 |
| TM | subpixel | 0.0125 | 0.064% | 38.3 |
| TM | subpixel | 0.025 | 0.253% | 3.4 |
| TM | subpixel | 0.05 | 0.997% | 0.8 |

| Polarization | Staircase order estimates | Subpixel order estimates | Subpixel(h) < staircase(h) | Subpixel(h) error < staircase(h/2) | Subpixel(h) wall < staircase(h/2) |
|---|---|---|---|---|---|
| TE | 4.00, 0.91 | 2.12, 2.10 | pass | False | True |
| TM | -0.42, 1.56 | 1.98, 1.97 | pass | True | True |

Sub-cell shift of the centre along x at fixed h (max relative error at shifts 0, h/4, h/2; spread; per-wavelength width variation):

| Polarization | Interface | Errors by shift | Spread | Width variation |
|---|---|---|---:|---:|
| TE | staircase | 11.163%, 4.802%, 2.214% | 8.949% | 27.121% |
| TE | subpixel | 1.974%, 2.016%, 2.012% | 0.042% | 0.091% |
| TM | staircase | 3.830%, 1.767%, 3.273% | 2.064% | 4.549% |
| TM | subpixel | 0.997%, 1.053%, 1.189% | 0.192% | 0.258% |

Differentiable-solid transition width at fixed h through the standard TFSF solver (samples on the contour take the half value at a vanishing width):

| Polarization | w / h | Max relative error | Difference from staircase | Samples differing from staircase |
|---|---:|---:|---:|---:|
| TE | 1e-06 | 11.163% | 0.000% | 4 |
| TE | 0.125 | 6.232% | 5.571% | 20 |
| TE | 0.25 | 3.985% | 8.096% | 36 |
| TE | 0.5 | 1.900% | 11.752% | 60 |
| TE | 1 | 4.610% | 16.558% | 104 |
| TE | 2 | 8.705% | 20.251% | 216 |
| TM | 1e-06 | 1.343% | 2.682% | 4 |
| TM | 0.125 | 1.343% | 2.682% | 20 |
| TM | 0.25 | 0.642% | 3.516% | 36 |
| TM | 0.5 | 0.828% | 4.650% | 60 |
| TM | 1 | 0.418% | 4.312% | 104 |
| TM | 2 | 1.823% | 5.879% | 216 |
<!-- g3-b:G3-13 end -->

<!-- g3-b:G3-05 begin -->
## G3-05 Drude sphere scattering and absorption

Case `G3-05_drude_sphere`, record `docs/validation/g3/G3-05.json` generated 2026-09-21T18:18:04+00:00. Analytic Drude model epsilon_inf = 5.0, omega_p = 1.37e+16 rad/s, gamma = 1.5e+14 rad/s, radii [0.02, 0.035, 0.05] um, band 0.33 to 0.45 um, mesh sequence [0.02, 0.01, 0.005] um at a fixed 0.48 um domain. Scattering from the outer planes, absorption from the net inward total-field power of the inner planes, both against the complex-index Mie series. The per-radius budgets are the fixture-specific ones of the case (the 2 percent program threshold is declared not applicable); a failure is a recorded finding.

| r (um) | h (um) | Cells/r | Execution | Max scattering error | Budget | Max absorption error | Budget | Peak sca (um) | Mie | Peak abs (um) | Mie | Inner/outer | Judged |
|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 0.02 | 0.005 | 4 | cpu float64 | 137.555% | 50.000% | 673.265% | 100.000% | 0.376 | 0.374 | 0.376 | 0.374 | 0.119% | FAIL |
| 0.02 | 0.01 | 2 | cpu float64 | 270.768% | 50.000% | 2505.893% | 100.000% | 0.386 | 0.374 | 0.387 | 0.374 | 0.160% | recorded |
| 0.02 | 0.01 | 2 | cuda float32 | 270.768% | 50.000% | 2505.877% | 100.000% | 0.386 | 0.374 | 0.387 | 0.374 | 0.160% | recorded |
| 0.02 | 0.02 | 1 | cpu float64 | 1657.979% | 50.000% | 3682.135% | 100.000% | 0.420 | 0.374 | 0.420 | 0.374 | 0.320% | recorded |
| 0.02 | 0.02 | 1 | cuda float32 | 1657.962% | 50.000% | 3682.121% | 100.000% | 0.420 | 0.374 | 0.420 | 0.374 | 0.320% | recorded |
| 0.035 | 0.005 | 7 | cpu float64 | 45.758% | 30.000% | 498.501% | 60.000% | 0.387 | 0.388 | 0.389 | 0.387 | 0.094% | FAIL |
| 0.035 | 0.01 | 4 | cpu float64 | 69.159% | 30.000% | 559.269% | 60.000% | 0.389 | 0.388 | 0.386 | 0.387 | 0.052% | recorded |
| 0.035 | 0.01 | 4 | cuda float32 | 69.159% | 30.000% | 559.269% | 60.000% | 0.389 | 0.388 | 0.386 | 0.387 | 0.052% | recorded |
| 0.035 | 0.02 | 2 | cpu float64 | 477.893% | 30.000% | 1812.565% | 60.000% | 0.413 | 0.388 | 0.365 | 0.387 | 0.114% | recorded |
| 0.035 | 0.02 | 2 | cuda float32 | 477.889% | 30.000% | 1812.565% | 60.000% | 0.413 | 0.388 | 0.365 | 0.387 | 0.115% | recorded |
| 0.05 | 0.005 | 10 | cpu float64 | 44.515% | 20.000% | 344.579% | 40.000% | 0.397 | 0.410 | 0.422 | 0.361 | 0.062% | FAIL |
| 0.05 | 0.01 | 5 | cpu float64 | 64.285% | 20.000% | 340.338% | 40.000% | 0.423 | 0.410 | 0.404 | 0.361 | 0.081% | recorded |
| 0.05 | 0.01 | 5 | cuda float32 | 64.285% | 20.000% | 340.337% | 40.000% | 0.423 | 0.410 | 0.404 | 0.361 | 0.081% | recorded |
| 0.05 | 0.02 | 2 | cpu float64 | 85.438% | 20.000% | 308.670% | 40.000% | 0.390 | 0.410 | 0.446 | 0.361 | 0.032% | recorded |
| 0.05 | 0.02 | 2 | cuda float32 | 85.438% | 20.000% | 308.670% | 40.000% | 0.390 | 0.410 | 0.446 | 0.361 | 0.032% | recorded |

Per-wavelength relative errors of the CPU FP64 rows (scattering / absorption):

- r = 0.02 um, h = 0.005 um: scattering -21%, -13%, -80%, -40%, +13%, -46%, +138%, +55%, +54%; absorption +5%, +49%, -50%, -10%, +90%, +216%, +673%, +277%, +447%
- r = 0.02 um, h = 0.01 um: scattering -38%, -87%, -91%, -81%, +27%, -62%, -91%, -77%, +271%; absorption +17%, -8%, -79%, -65%, +202%, +76%, +135%, +465%, +2506%
- r = 0.02 um, h = 0.02 um: scattering -88%, -94%, -97%, -98%, -79%, +85%, +1658%, +695%, +268%; absorption -87%, -84%, -96%, -96%, -50%, +317%, +3682%, +1489%, +504%
- r = 0.035 um, h = 0.005 um: scattering -6%, -6%, -28%, -27%, -46%, -12%, +5%, -16%, -21%; absorption +2%, +56%, -5%, +28%, +30%, +75%, +201%, +173%, +499%
- r = 0.035 um, h = 0.01 um: scattering +6%, -6%, -33%, -45%, -42%, -44%, -69%, -37%, -27%; absorption +32%, +57%, +35%, +31%, +21%, +26%, +90%, +401%, +559%
- r = 0.035 um, h = 0.02 um: scattering -10%, +34%, +81%, -80%, -98%, -99%, -88%, +38%, +478%; absorption +52%, +91%, +125%, -42%, -79%, -60%, +42%, +583%, +1813%
- r = 0.05 um, h = 0.005 um: scattering -5%, -5%, -21%, -20%, -17%, -34%, -45%, -37%, +5%; absorption +15%, +27%, -40%, +80%, +56%, +92%, +159%, +196%, +345%
- r = 0.05 um, h = 0.01 um: scattering -17%, -18%, -44%, -31%, -37%, -64%, -19%, -23%, +17%; absorption +2%, +4%, -35%, +47%, +116%, +165%, +108%, +199%, +340%
- r = 0.05 um, h = 0.02 um: scattering +9%, +9%, -48%, -15%, -11%, -50%, -85%, -83%, -65%; absorption +85%, +202%, -57%, +26%, +52%, +36%, +41%, +182%, +309%

Layer A (CUDA FP32 against CPU FP64 on scattering and absorption, rtol 1e-4):

| r (um) | h (um) | Max relative difference | Result |
|---:|---:|---:|---|
| 0.02 | 0.01 | 1.71e-05 | pass |
| 0.02 | 0.02 | 7.00e-05 | pass |
| 0.035 | 0.01 | 4.55e-06 | pass |
| 0.035 | 0.02 | 1.20e-05 | pass |
| 0.05 | 0.01 | 7.72e-06 | pass |
| 0.05 | 0.02 | 5.29e-06 | pass |

**Limitation.** The staircased Drude sphere converges slowly and does not reach the budgets: r = 0.02 um: scattering 1657.979%, 270.768%, 137.555% and absorption 3682.135%, 2505.893%, 673.265% at h = 0.02, 0.01, 0.005 um; r = 0.035 um: scattering 477.893%, 69.159%, 45.758% and absorption 1812.565%, 559.269%, 498.501% at h = 0.02, 0.01, 0.005 um; r = 0.05 um: scattering 85.438%, 64.285%, 44.515% and absorption 308.670%, 340.338%, 344.579% at h = 0.02, 0.01, 0.005 um. The subpixel interface operator rejects the same sphere with `interface_method = "subpixel"` at validation ("Subpixel interfaces currently require lossless nondispersive materials. Choose staircase for dispersive materials.", recorded in `docs/validation/g3/G3-05_subpixel.json`), so the package offers no conformal or subpixel treatment of a dispersive interface. Plasmonic nanoparticle cross sections below the recorded errors need a conformal or subpixel treatment of dispersive interfaces that the package does not provide; until then metallic curved scatterers are outside the accuracy claims of this release, and the task stays FAILED in the gate file.
<!-- g3-b:G3-05 end -->
