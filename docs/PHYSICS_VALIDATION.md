# Physics validation records (stage G3)

Rendered by `scripts/render_physics_validation.py` from `docs/validation/g3/<task>.json`, which `tests/test_physics_g3_a.py` writes before it asserts. Every number below comes from those records; none is typed by hand. The fixtures and limits were declared in `docs/validation/cases/` before the recorded run (see [COMPLETION_PROGRAM_KO.md](COMPLETION_PROGRAM_KO.md) section 5). A **FAIL** is a finding against a pre-declared limit and is kept as such.

## G3-01 Uniform-medium propagation

Case: `docs/validation/cases/G3-01_uniform_propagation.json`. Part A initialises a real discrete plane wave on an all-periodic Yee grid and measures cos(omega dt) from the three-term recurrence of the field; the oracle is the exact Yee relation written in the test. Part B propagates a one-cycle pulse from a sheet through two point monitors 3.1 um apart (2 vacuum wavelengths) inside a 24.8 um domain for 100 fs and compares the measured k(f) with the Yee relation and the continuum.

Environment: Python 3.10.2, numpy 2.2.6, torch 2.10.0+cu126 (CUDA runtime 12.6), NVIDIA GeForce RTX 3060, 12th Gen Intel(R) Core(TM) i7-12700, Windows-10-10.0.26200-SP0; run at 2026-09-21T16:25:56+00:00 on commit 2b64f9133af6 with 7 dirty paths (the records themselves were being written); fine meshes on.

### Part A: discrete relation at an oblique wavevector (limits 1e-12 on both residuals)

| cells | n | polarization | abs cos residual | polarization leak | v_p / (c/n) - 1 | verdict |
| --- | --- | --- | --- | --- | --- | --- |
| [24, 20, 1] | 1 | TE | 0 | 1.8e-15 | -0.00507 | pass |
| [24, 20, 1] | 1 | TM | 0 | 2e-15 | -0.00507 | pass |
| [24, 20, 16] | 1 | pol1 | 2.2e-16 | 2e-15 | -0.00408 | pass |
| [24, 20, 16] | 1 | pol2 | 1.1e-16 | 1.5e-15 | -0.00408 | pass |
| [24, 20, 1] | 1.5 | TE | 1.1e-16 | 1.5e-15 | -0.0103 | pass |
| [24, 20, 1] | 1.5 | TM | 0 | 1.7e-15 | -0.0103 | pass |
| [24, 20, 16] | 1.5 | pol1 | 1.1e-16 | 1.5e-15 | -0.00873 | pass |
| [24, 20, 16] | 1.5 | pol2 | 1.1e-16 | 1.4e-15 | -0.00873 | pass |

### Part A: mesh sweep along an axis (cells per wavelength in the medium)

| N | n | polarization | abs cos residual | leak | v_p / (c/n) - 1 | phase error per wavelength (rad) |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | 1 | TE | 0 | 3.2e-16 | -0.00853 | 0.0541 |
| 10 | 1 | TM | 1.1e-16 | 3.2e-16 | -0.00853 | 0.0541 |
| 20 | 1 | TE | 0 | 5.4e-16 | -0.00211 | 0.0133 |
| 20 | 1 | TM | 1.1e-16 | 5.4e-16 | -0.00211 | 0.0133 |
| 40 | 1 | TE | 2.2e-16 | 5e-16 | -0.000525 | 0.0033 |
| 40 | 1 | TM | 2.2e-16 | 5e-16 | -0.000525 | 0.0033 |
| 10 | 1 | pol1 | 0 | 3.8e-16 | -0.0112 | 0.071 |
| 10 | 1 | pol2 | 2.2e-16 | 3.8e-16 | -0.0112 | 0.071 |
| 20 | 1 | pol1 | 1.1e-16 | 2.9e-15 | -0.00278 | 0.0175 |
| 20 | 1 | pol2 | 1.1e-16 | 2.9e-15 | -0.00278 | 0.0175 |
| 40 | 1 | pol1 | 1.1e-16 | 8.9e-16 | -0.000693 | 0.00435 |
| 40 | 1 | pol2 | 1.1e-16 | 8.9e-16 | -0.000693 | 0.00435 |
| 10 | 1.5 | TE | 0 | 4.4e-16 | -0.0129 | 0.0823 |
| 10 | 1.5 | TM | 2.2e-16 | 4.4e-16 | -0.0129 | 0.0823 |
| 20 | 1.5 | TE | 1.1e-16 | 6.6e-16 | -0.00322 | 0.0203 |
| 20 | 1.5 | TM | 1.1e-16 | 6.6e-16 | -0.00322 | 0.0203 |
| 40 | 1.5 | TE | 1.1e-16 | 7.8e-16 | -0.000804 | 0.00506 |
| 40 | 1.5 | TM | 1.1e-16 | 7.8e-16 | -0.000804 | 0.00506 |
| 10 | 1.5 | pol1 | 0 | 8.8e-16 | -0.0141 | 0.0897 |
| 10 | 1.5 | pol2 | 0 | 8.8e-16 | -0.0141 | 0.0897 |
| 20 | 1.5 | pol1 | 1.1e-16 | 3.8e-16 | -0.00352 | 0.0222 |
| 20 | 1.5 | pol2 | 1.1e-16 | 3.8e-16 | -0.00352 | 0.0222 |
| 40 | 1.5 | pol1 | 2.2e-16 | 5.6e-16 | -0.000879 | 0.00553 |
| 40 | 1.5 | pol2 | 3.3e-16 | 5.6e-16 | -0.000879 | 0.00553 |

### Part B: pulse propagation through the Simulation path (limit 1e-3 rad on abs(k_measured - k_Yee) D)

| dim | N | n | component | steps | max abs(k_meas - k_Yee) D (rad) | limit | phase error/wavelength at mid band (rad) | Yee prediction | mid-band wavelength (um) | largest phase error/wavelength on band | trace end / peak | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2d | 10 | 1 | Ez | 276 | 5.6e-08 | 0.001 | 0.0582 | 0.0582 | 1.51 | 0.0797 | 6.4e-07 | pass |
| 2d | 20 | 1 | Ez | 553 | 6.9e-10 | 0.001 | 0.014 | 0.014 | 1.51 | 0.019 | 1e-08 | pass |
| 2d | 40 | 1 | Ez | 1105 | 9.6e-12 | 0.001 | 0.00348 | 0.00348 | 1.51 | 0.0047 | 7.8e-10 | pass |
| 2d | 10 | 1.5 | Ez | 276 | 3.5e-07 | 0.001 | 0.214 | 0.214 | 1.51 | 0.302 | 5.1e-07 | pass |
| 2d | 20 | 1.5 | Ez | 553 | 8.3e-09 | 0.001 | 0.0492 | 0.0492 | 1.51 | 0.067 | 4.3e-08 | pass |
| 2d | 40 | 1.5 | Ez | 1105 | 1.7e-09 | 0.001 | 0.0121 | 0.0121 | 1.51 | 0.0163 | 5.1e-08 | pass |
| 2d | 10 | 1 | Ey | 276 | 5.6e-08 | 0.001 | 0.0582 | 0.0582 | 1.51 | 0.0797 | 6.4e-07 | pass |
| 2d | 20 | 1 | Ey | 553 | 6.9e-10 | 0.001 | 0.014 | 0.014 | 1.51 | 0.019 | 1e-08 | pass |
| 2d | 40 | 1 | Ey | 1105 | 9.6e-12 | 0.001 | 0.00348 | 0.00348 | 1.51 | 0.0047 | 7.8e-10 | pass |
| 2d | 10 | 1.5 | Ey | 276 | 3.5e-07 | 0.001 | 0.214 | 0.214 | 1.51 | 0.302 | 5.1e-07 | pass |
| 2d | 20 | 1.5 | Ey | 553 | 8.3e-09 | 0.001 | 0.0492 | 0.0492 | 1.51 | 0.067 | 4.3e-08 | pass |
| 2d | 40 | 1.5 | Ey | 1105 | 1.7e-09 | 0.001 | 0.0121 | 0.0121 | 1.51 | 0.0163 | 5.1e-08 | pass |
| 3d | 10 | 1 | Ey | 338 | 8.1e-08 | 0.001 | 0.0769 | 0.0769 | 1.51 | 0.105 | 5.6e-07 | pass |
| 3d | 20 | 1 | Ey | 677 | 8.4e-10 | 0.001 | 0.0185 | 0.0185 | 1.51 | 0.0251 | 2.6e-08 | pass |
| 3d | 40 | 1 | Ey | 1354 | 8.3e-11 | 0.001 | 0.0046 | 0.0046 | 1.51 | 0.00621 | 7.3e-09 | pass |
| 3d | 10 | 1.5 | Ey | 338 | 3.8e-07 | 0.001 | 0.235 | 0.235 | 1.51 | 0.331 | 1.4e-06 | pass |
| 3d | 20 | 1.5 | Ey | 677 | 9.6e-09 | 0.001 | 0.0538 | 0.0538 | 1.51 | 0.0732 | 4.2e-08 | pass |
| 3d | 40 | 1.5 | Ey | 1354 | 1.1e-09 | 0.001 | 0.0132 | 0.0132 | 1.51 | 0.0178 | 4.4e-08 | pass |
| 3d | 10 | 1 | Ez | 338 | 8.1e-08 | 0.001 | 0.0769 | 0.0769 | 1.51 | 0.105 | 5.6e-07 | pass |
| 3d | 20 | 1 | Ez | 677 | 8.4e-10 | 0.001 | 0.0185 | 0.0185 | 1.51 | 0.0251 | 2.6e-08 | pass |
| 3d | 40 | 1 | Ez | 1354 | 8.3e-11 | 0.001 | 0.0046 | 0.0046 | 1.51 | 0.00621 | 7.3e-09 | pass |
| 3d | 10 | 1.5 | Ez | 338 | 3.8e-07 | 0.001 | 0.235 | 0.235 | 1.51 | 0.331 | 1.4e-06 | pass |
| 3d | 20 | 1.5 | Ez | 677 | 9.6e-09 | 0.001 | 0.0538 | 0.0538 | 1.51 | 0.0732 | 4.2e-08 | pass |
| 3d | 40 | 1.5 | Ez | 1354 | 1.1e-09 | 0.001 | 0.0132 | 0.0132 | 1.51 | 0.0178 | 4.4e-08 | pass |

### Polarization identity (limit 1e-12 on the normalised trace difference)

| dim | N | n | components | max difference / peak | limit | verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 2d | 10 | 1 | Ez vs Ey | 0 | 1e-12 | pass |
| 2d | 10 | 1.5 | Ez vs Ey | 0 | 1e-12 | pass |
| 3d | 10 | 1 | Ey vs Ez | 0 | 1e-12 | pass |
| 3d | 10 | 1.5 | Ey vs Ez | 0 | 1e-12 | pass |
| 2d | 20 | 1 | Ez vs Ey | 0 | 1e-12 | pass |
| 2d | 20 | 1.5 | Ez vs Ey | 0 | 1e-12 | pass |
| 3d | 20 | 1 | Ey vs Ez | 0 | 1e-12 | pass |
| 3d | 20 | 1.5 | Ey vs Ez | 0 | 1e-12 | pass |

### Layer A: CUDA FP32 against CPU FP64 (rtol 1e-4, atol 1e-6 on traces / FP64 peak)

| dim | n | component | steps | max abs error | relative L2 | verdict |
| --- | --- | --- | --- | --- | --- | --- |
| 2d | 1 | Ez | 553 | 7.3e-07 | 6e-07 | pass |
| 3d | 1.5 | Ey | 677 | 9.9e-07 | 7.6e-07 | pass |

## G3-02 Dielectric slab, normal and oblique TE/TM

Case: `docs/validation/cases/G3-02r2_slab_tmm_40_cells.json` (revision 2; the first case `docs/validation/cases/G3-02_dielectric_slab_tmm.json`, its record `docs/validation/g3/G3-02.json` and its FAILED evidence run `20260921T164814Z-g3-02-1e349534` are kept in place as the finding). A lossless slab in a 6 um 2D cell with periodic (normal) or Bloch (fixed k_parallel) transverse boundaries, a three-cycle sheet pulse, point monitors 1 um before and after the slab and a slab-free reference run. r and t are the +f DFT ratios referred to the physical faces with the discrete vacuum wavenumber; the oracle is a Fresnel/Airy transfer matrix written in the test. Limits at about 40 cells per material wavelength: R and T absolute error 0.01, abs(R+T-1) 0.01, transmission phase 0.02 rad wherever |t| > 0.1 (everywhere here). The 20-cell mesh is recorded with the energy-balance limit only and feeds the convergence-order test (ratio between 3 and 5). The reflection phase is reported only (staircase reference-plane ambiguity).

Environment: Python 3.10.2, numpy 2.2.6, torch 2.10.0+cu126 (CUDA runtime 12.6), NVIDIA GeForce RTX 3060, 12th Gen Intel(R) Core(TM) i7-12700, Windows-10-10.0.26200-SP0; run at 2026-09-21T16:55:32+00:00 on commit f6447b776eb0 with 5 dirty paths (the records themselves were being written); fine meshes on.

| n | d (um) | angle (deg) | pol | N | h (um) | cells/material wavelength | steps | max abs dR | max abs dT | max abs(R+T-1) | max t phase error (rad) | max r phase error (rad, info) | criteria | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.5 | 0.2 | 0 | TE | 40 | 0.025 | 41.3 | 6852 | 0.0015 | 0.0015 | 1.8e-06 | 0.0015 | 0.062 | R, T, balance, phase | pass |
| 1.5 | 0.2 | 20 | TE | 40 | 0.025 | 41.3 | 6852 | 0.0016 | 0.0016 | 2.1e-05 | 0.0014 | 0.059 | R, T, balance, phase | pass |
| 1.5 | 0.2 | 45 | TE | 40 | 0.025 | 41.3 | 6852 | 0.0018 | 0.0019 | 5.9e-05 | 0.0013 | 0.05 | R, T, balance, phase | pass |
| 1.5 | 0.2 | 0 | TM | 40 | 0.025 | 41.3 | 6852 | 0.0015 | 0.0015 | 2.8e-06 | 0.0015 | 0.062 | R, T, balance, phase | pass |
| 1.5 | 0.2 | 20 | TM | 40 | 0.025 | 41.3 | 6852 | 0.0015 | 0.0015 | 2.4e-06 | 0.0015 | 0.07 | R, T, balance, phase | pass |
| 1.5 | 0.2 | 45 | TM | 40 | 0.025 | 41.3 | 6852 | 0.0013 | 0.0014 | 5.2e-06 | 0.0012 | 0.22 | R, T, balance, phase | pass |
| 1.5 | 0.5 | 0 | TE | 40 | 0.025 | 41.3 | 6852 | 0.00094 | 0.00094 | 5.4e-07 | 0.0044 | 0.065 | R, T, balance, phase | pass |
| 1.5 | 0.5 | 20 | TE | 40 | 0.025 | 41.3 | 6852 | 0.00084 | 0.00082 | 2e-05 | 0.0042 | 0.062 | R, T, balance, phase | pass |
| 1.5 | 0.5 | 45 | TE | 40 | 0.025 | 41.3 | 6852 | 0.0005 | 0.00048 | 1.8e-05 | 0.0035 | 0.052 | R, T, balance, phase | pass |
| 1.5 | 0.5 | 0 | TM | 40 | 0.025 | 41.3 | 6852 | 0.00094 | 0.00094 | 8.3e-07 | 0.0044 | 0.065 | R, T, balance, phase | pass |
| 1.5 | 0.5 | 20 | TM | 40 | 0.025 | 41.3 | 6852 | 0.00069 | 0.00069 | 5.6e-06 | 0.0041 | 0.073 | R, T, balance, phase | pass |
| 1.5 | 0.5 | 45 | TM | 40 | 0.025 | 41.3 | 6852 | 0.00059 | 0.00059 | 5.4e-06 | 0.003 | n/a | R, T, balance, phase | pass |
| 3.5 | 0.2 | 0 | TE | 40 | 0.01111 | 39.9 | 15417 | 0.0055 | 0.0055 | 1e-07 | 0.0092 | 0.036 | R, T, balance, phase | pass |
| 3.5 | 0.2 | 20 | TE | 40 | 0.01111 | 39.9 | 15417 | 0.0057 | 0.0057 | 9e-07 | 0.0094 | 0.035 | R, T, balance, phase | pass |
| 3.5 | 0.2 | 45 | TE | 40 | 0.01111 | 39.9 | 15417 | 0.0065 | 0.0065 | 3.9e-05 | 0.01 | 0.032 | R, T, balance, phase | pass |
| 3.5 | 0.2 | 0 | TM | 40 | 0.01111 | 39.9 | 15417 | 0.0055 | 0.0055 | 9.9e-08 | 0.0092 | 0.036 | R, T, balance, phase | pass |
| 3.5 | 0.2 | 20 | TM | 40 | 0.01111 | 39.9 | 15417 | 0.0049 | 0.0049 | 1.9e-06 | 0.009 | 0.039 | R, T, balance, phase | pass |
| 3.5 | 0.2 | 45 | TM | 40 | 0.01111 | 39.9 | 15417 | 0.003 | 0.003 | 1.7e-05 | 0.0079 | 0.067 | R, T, balance, phase | pass |
| 3.5 | 0.5 | 0 | TE | 40 | 0.01087 | 40.7 | 15760 | 0.0066 | 0.0066 | 1.9e-07 | 0.0095 | 0.033 | R, T, balance, phase | pass |
| 3.5 | 0.5 | 20 | TE | 40 | 0.01087 | 40.7 | 15760 | 0.007 | 0.007 | 8.4e-06 | 0.01 | 0.032 | R, T, balance, phase | pass |
| 3.5 | 0.5 | 45 | TE | 40 | 0.01087 | 40.7 | 15760 | 0.0093 | 0.0093 | 2.6e-05 | 0.013 | 0.026 | R, T, balance, phase | pass |
| 3.5 | 0.5 | 0 | TM | 40 | 0.01087 | 40.7 | 15760 | 0.0066 | 0.0066 | 3e-07 | 0.0095 | 0.033 | R, T, balance, phase | pass |
| 3.5 | 0.5 | 20 | TM | 40 | 0.01087 | 40.7 | 15760 | 0.0062 | 0.0062 | 2.2e-05 | 0.009 | 0.037 | R, T, balance, phase | pass |
| 3.5 | 0.5 | 45 | TM | 40 | 0.01087 | 40.7 | 15760 | 0.0051 | 0.0051 | 2.9e-05 | 0.0078 | 0.069 | R, T, balance, phase | pass |
| 1.5 | 0.2 | 0 | TE | 20 | 0.05 | 20.7 | 3426 | 0.0063 | 0.0063 | 1.8e-05 | 0.0062 | 0.19 | balance only | pass |
| 1.5 | 0.2 | 20 | TE | 20 | 0.05 | 20.7 | 3426 | 0.0065 | 0.0065 | 1.7e-05 | 0.0058 | 0.18 | balance only | pass |
| 1.5 | 0.2 | 45 | TE | 20 | 0.05 | 20.7 | 3426 | 0.0073 | 0.0073 | 8.4e-05 | 0.005 | 0.15 | balance only | pass |
| 1.5 | 0.2 | 0 | TM | 20 | 0.05 | 20.7 | 3426 | 0.0063 | 0.0063 | 3.4e-05 | 0.0062 | 0.19 | balance only | pass |
| 1.5 | 0.2 | 20 | TM | 20 | 0.05 | 20.7 | 3426 | 0.006 | 0.006 | 2.8e-05 | 0.0059 | 0.2 | balance only | pass |
| 1.5 | 0.2 | 45 | TM | 20 | 0.05 | 20.7 | 3426 | 0.0055 | 0.0055 | 8.6e-06 | 0.005 | 0.45 | balance only | pass |
| 1.5 | 0.5 | 0 | TE | 20 | 0.05 | 20.7 | 3426 | 0.0039 | 0.0039 | 4.8e-06 | 0.018 | 0.2 | balance only | pass |
| 1.5 | 0.5 | 20 | TE | 20 | 0.05 | 20.7 | 3426 | 0.0035 | 0.0035 | 2e-05 | 0.017 | 0.19 | balance only | pass |
| 1.5 | 0.5 | 45 | TE | 20 | 0.05 | 20.7 | 3426 | 0.002 | 0.0019 | 8.2e-05 | 0.014 | 0.16 | balance only | pass |
| 1.5 | 0.5 | 0 | TM | 20 | 0.05 | 20.7 | 3426 | 0.0039 | 0.0039 | 7.9e-06 | 0.018 | 0.2 | balance only | pass |
| 1.5 | 0.5 | 20 | TM | 20 | 0.05 | 20.7 | 3426 | 0.0029 | 0.0029 | 9.6e-06 | 0.017 | 0.21 | balance only | pass |
| 1.5 | 0.5 | 45 | TM | 20 | 0.05 | 20.7 | 3426 | 0.0024 | 0.0024 | 5.3e-06 | 0.012 | n/a | balance only | pass |
| 3.5 | 0.2 | 0 | TE | 20 | 0.02222 | 19.9 | 7709 | 0.023 | 0.023 | 1.5e-06 | 0.037 | 0.016 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.2 | 20 | TE | 20 | 0.02222 | 19.9 | 7709 | 0.024 | 0.024 | 3.3e-06 | 0.038 | 0.015 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.2 | 45 | TE | 20 | 0.02222 | 19.9 | 7709 | 0.027 | 0.027 | 3.8e-05 | 0.042 | 0.02 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.2 | 0 | TM | 20 | 0.02222 | 19.9 | 7709 | 0.023 | 0.023 | 1.3e-06 | 0.037 | 0.016 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.2 | 20 | TM | 20 | 0.02222 | 19.9 | 7709 | 0.021 | 0.021 | 5.2e-07 | 0.036 | 0.028 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.2 | 45 | TM | 20 | 0.02222 | 19.9 | 7709 | 0.013 | 0.013 | 1.6e-05 | 0.032 | 0.12 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.5 | 0 | TE | 20 | 0.02174 | 20.4 | 7880 | 0.027 | 0.027 | 2.8e-06 | 0.038 | 0.018 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.5 | 20 | TE | 20 | 0.02174 | 20.4 | 7880 | 0.028 | 0.028 | 6.1e-06 | 0.04 | 0.022 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.5 | 45 | TE | 20 | 0.02174 | 20.4 | 7880 | 0.037 | 0.037 | 2.4e-05 | 0.054 | 0.038 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.5 | 0 | TM | 20 | 0.02174 | 20.4 | 7880 | 0.026 | 0.027 | 4.5e-06 | 0.038 | 0.018 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.5 | 20 | TM | 20 | 0.02174 | 20.4 | 7880 | 0.025 | 0.025 | 1.8e-05 | 0.036 | 0.013 | balance only | pass (R/T limits not met, reported) |
| 3.5 | 0.5 | 45 | TM | 20 | 0.02174 | 20.4 | 7880 | 0.021 | 0.021 | 3.5e-05 | 0.031 | 0.1 | balance only | pass (R/T limits not met, reported) |

Instances failing an applicable pre-declared limit: 0 of 48.

### Convergence order, 20-cell over 40-cell errors (limit: ratio between 3 and 5)

| n | d (um) | angle (deg) | pol | abs dR N20 | abs dR N40 | ratio | t phase N20 (rad) | t phase N40 (rad) | ratio | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1.5 | 0.2 | 0 | TE | 0.0063 | 0.0015 | 4.09 | 0.0062 | 0.0015 | 4.04 | pass |
| 1.5 | 0.2 | 20 | TE | 0.0065 | 0.0016 | 4.11 | 0.0058 | 0.0014 | 4.08 | pass |
| 1.5 | 0.2 | 45 | TE | 0.0073 | 0.0018 | 4.03 | 0.005 | 0.0013 | 3.93 | pass |
| 1.5 | 0.2 | 0 | TM | 0.0063 | 0.0015 | 4.09 | 0.0062 | 0.0015 | 4.04 | pass |
| 1.5 | 0.2 | 20 | TM | 0.006 | 0.0015 | 4.08 | 0.0059 | 0.0015 | 4.04 | pass |
| 1.5 | 0.2 | 45 | TM | 0.0055 | 0.0013 | 4.08 | 0.005 | 0.0012 | 4.05 | pass |
| 1.5 | 0.5 | 0 | TE | 0.0039 | 0.00094 | 4.16 | 0.018 | 0.0044 | 4.05 | pass |
| 1.5 | 0.5 | 20 | TE | 0.0035 | 0.00084 | 4.18 | 0.017 | 0.0042 | 4.05 | pass |
| 1.5 | 0.5 | 45 | TE | 0.002 | 0.0005 | 3.96 | 0.014 | 0.0035 | 4.02 | pass |
| 1.5 | 0.5 | 0 | TM | 0.0039 | 0.00094 | 4.16 | 0.018 | 0.0044 | 4.05 | pass |
| 1.5 | 0.5 | 20 | TM | 0.0029 | 0.00069 | 4.19 | 0.017 | 0.0041 | 4.05 | pass |
| 1.5 | 0.5 | 45 | TM | 0.0024 | 0.00059 | 4.01 | 0.012 | 0.003 | 4.05 | pass |
| 3.5 | 0.2 | 0 | TE | 0.023 | 0.0055 | 4.16 | 0.037 | 0.0092 | 4.05 | pass |
| 3.5 | 0.2 | 20 | TE | 0.024 | 0.0057 | 4.17 | 0.038 | 0.0094 | 4.05 | pass |
| 3.5 | 0.2 | 45 | TE | 0.027 | 0.0065 | 4.16 | 0.042 | 0.01 | 4.03 | pass |
| 3.5 | 0.2 | 0 | TM | 0.023 | 0.0055 | 4.16 | 0.037 | 0.0092 | 4.05 | pass |
| 3.5 | 0.2 | 20 | TM | 0.021 | 0.0049 | 4.18 | 0.036 | 0.009 | 4.05 | pass |
| 3.5 | 0.2 | 45 | TM | 0.013 | 0.003 | 4.25 | 0.032 | 0.0079 | 4.07 | pass |
| 3.5 | 0.5 | 0 | TE | 0.027 | 0.0066 | 4.03 | 0.038 | 0.0095 | 4.02 | pass |
| 3.5 | 0.5 | 20 | TE | 0.028 | 0.007 | 4.03 | 0.04 | 0.01 | 4.02 | pass |
| 3.5 | 0.5 | 45 | TE | 0.037 | 0.0093 | 4.02 | 0.054 | 0.013 | 4.04 | pass |
| 3.5 | 0.5 | 0 | TM | 0.026 | 0.0066 | 4.03 | 0.038 | 0.0095 | 4.02 | pass |
| 3.5 | 0.5 | 20 | TM | 0.025 | 0.0062 | 4.02 | 0.036 | 0.009 | 4.03 | pass |
| 3.5 | 0.5 | 45 | TM | 0.021 | 0.0051 | 4.02 | 0.031 | 0.0078 | 4.02 | pass |

### Resolution requirement for high-index slabs

At 19.9 to 20.4 cells per material wavelength the n=3.5 slabs reach max abs dR 0.0128 to 0.0373 and transmission phase errors of 0.0315 to 0.0539 rad, above the 0.01 and 0.02 rad limits, while at 39.9 to 40.7 cells they reach 0.00302 to 0.00928 and 0.00782 to 0.0133 rad; the n=1.5 slabs stay within the limits at both meshes (abs dR at most 0.00725, phase at most 0.018 rad). The energy balance abs(R+T-1) is at most 8.4e-05 everywhere, and every error falls by a factor 3.93 to 4.08 (phase) and 3.96 to 4.25 (R) when the mesh is halved. This is the second-order Yee phase error measured independently in G3-01: 0.0203 rad per material wavelength at 20 cells and 0.00506 rad at 40 cells (eigenmode, n=1.5), and 0.0582, 0.014 and 0.00348 rad per vacuum wavelength at 10, 20 and 40 cells on the Simulation path; a 0.5 um n=3.5 slab is 1.13 material wavelengths thick, so its accumulated phase error at 20 cells is of the order of the limit. The first fixture therefore failed on a resolution requirement of the staircase Yee scheme, not on a defect: the revision-2 case fixes the mesh at about 40 cells per material wavelength for every index and leaves the limits unchanged.

### Layer A: CUDA FP32 (complex64 Bloch fields) against CPU FP64, n=1.5, d=0.2 um, 45 deg, N20

| pol | steps | max abs error | relative L2 | verdict |
| --- | --- | --- | --- | --- |
| TE | 3426 | 1.1e-06 | 1.5e-06 | pass |
| TM | 3426 | 1.2e-06 | 1.4e-06 | pass |

## G3-03 Drude and Lorentz slabs: fitting error and ADE error separated

Case: `docs/validation/cases/G3-03_dispersive_slab_fit_ade.json`. Normal incidence in the G3-02 cell with the analytic Drude (eps_inf 1, omega_p 2e15 rad/s, gamma 1e14 rad/s, 0.1 um) and two-pole Lorentz (eps_inf 2.25, poles at 1.9e15 and 7.5e14 rad/s, 0.5 um) slabs; the oracle is the transfer matrix with the same analytic permittivity. Limits: abs dR, abs dT, abs dA 0.01, t phase 0.02 rad.

Environment: Python 3.10.2, numpy 2.2.6, torch 2.10.0+cu126 (CUDA runtime 12.6), NVIDIA GeForce RTX 3060, 12th Gen Intel(R) Core(TM) i7-12700, Windows-10-10.0.26200-SP0; run at 2026-09-21T16:41:54+00:00 on commit 2b64f9133af6 with 8 dirty paths (the records themselves were being written); fine meshes on.

### Part a: analytic materials given directly

| material | pol | h (um) | cells across slab | steps | max abs dR | max abs dT | max abs dA | max t phase error (rad) | max A (TMM) | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| drude | TE | 0.02 | 5 | 8565 | 0.00068 | 0.0011 | 0.00041 | 0.0013 | 0.0882 | pass |
| drude | TE | 0.01 | 10 | 17130 | 0.00017 | 0.00027 | 9.9e-05 | 0.00033 | 0.0882 | pass |
| drude | TM | 0.02 | 5 | 8565 | 0.00069 | 0.0011 | 0.0004 | 0.0013 | 0.0882 | pass |
| drude | TM | 0.01 | 10 | 17130 | 0.00017 | 0.00027 | 9.9e-05 | 0.00033 | 0.0882 | pass |
| lorentz | TE | 0.02 | 25 | 8565 | 0.002 | 0.0027 | 0.00066 | 0.0051 | 0.238 | pass |
| lorentz | TE | 0.01 | 50 | 17130 | 0.00051 | 0.00067 | 0.00016 | 0.0013 | 0.238 | pass |
| lorentz | TM | 0.02 | 25 | 8565 | 0.002 | 0.0027 | 0.00066 | 0.0051 | 0.238 | pass |
| lorentz | TM | 0.01 | 50 | 17130 | 0.00051 | 0.00067 | 0.00016 | 0.0013 | 0.238 | pass |

### Part b: n/k tables through the passive fit (h20, TE); fit error and discretization error separated

| material | converged | poles | fit normalized rms | max abs dn on band | max abs dk on band | fit only: abs dR | fit only: abs dT | FDTD(fit) vs TMM(fit): abs dR | abs dT | abs dA | t phase (rad) | FDTD(fit) vs TMM(analytic): abs dR | abs dT | abs dA | t phase (rad) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| drude | yes | 1 | 7.2e-09 | 4.2e-10 | 7.8e-09 | 2.9e-09 | 2.8e-09 | 0.00068 | 0.0011 | 0.00041 | 0.0013 | 0.00068 | 0.0011 | 0.00041 | 0.0013 |
| lorentz | yes | 2 | 1.9e-16 | 2.2e-16 | 6.2e-17 | 2.5e-16 | 1.1e-15 | 0.002 | 0.0027 | 0.00066 | 0.0051 | 0.002 | 0.0027 | 0.00066 | 0.0051 |

### Part c: trapezoidal ADE constitutive error at the 21 band frequencies (limit 1e-3 on abs dn and abs dk; solver vs bilinear 1e-12; driven cell 1e-9)

| material | time step | dt (s) | max abs(n_ADE - n) | max abs(k_ADE - k) | max rel eps error | solver permittivity vs bilinear (rel) | driven cell vs bilinear (rel) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| drude | h20 | 4.67e-17 | 3.4e-05 | 0.00076 | 0.0016 | 1.1e-16 | 2e-15 |
| drude | h10 | 2.335e-17 | 8.6e-06 | 0.00019 | 0.0004 | 1.1e-16 | 9.5e-15 |
| drude | ratio dt / (dt/2) |  | 4 | 4 |  |  |  |
| lorentz | h20 | 4.67e-17 | 0.00034 | 0.00013 | 0.0004 | 2.2e-16 | 1.1e-15 |
| lorentz | h10 | 2.335e-17 | 8.5e-05 | 3.2e-05 | 0.0001 | 2.2e-16 | 6.7e-16 |
| lorentz | ratio dt / (dt/2) |  | 4 | 4.01 |  |  |  |

## G3-07 CPML reflection and long-time stability

Case: `docs/validation/cases/G3-07_cpml_reflection_stability.json`. Default profile (10 layers, 0.25 um, sigma_scale 1, kappa 1, alpha 1e-8, cubic). The reflected wave is the difference between a short domain and a long reference domain with identical source, monitor and near-end geometry; R(f) = |DFT(short - long)|^2 / |DFT(long)|^2. Limits: normal 1e-6, oblique and interface 1e-4, stability: energy last/peak 1e-6 (normal runs) and no late growth.

Environment: Python 3.10.2, numpy 2.2.6, torch 2.10.0+cu126 (CUDA runtime 12.6), NVIDIA GeForce RTX 3060, 12th Gen Intel(R) Core(TM) i7-12700, Windows-10-10.0.26200-SP0; run at 2026-09-21T16:43:27+00:00 on commit 2b64f9133af6 with 8 dirty paths (the records themselves were being written); fine meshes on.

### Reflected / incident power

| fixture | steps | max R on band | dB | R at design wavelength | broadband energy ratio | limit | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| normal n=1.0 L10 | 1713 | 4.7e-10 | -93.3 | 4.6e-10 | 4.6e-10 | 1e-06 | pass |
| normal n=2.0 L10 | 1713 | 2.1e-09 | -86.7 | 2.1e-09 | 2.1e-09 | 1e-06 | pass |
| oblique 30deg L10 | 2570 | 3.8e-10 | -94.2 | 3.5e-10 | 3.6e-10 | 0.0001 | pass |
| oblique 60deg L10 | 2570 | 8.6e-10 | -90.6 | 6.6e-10 | 1.2e-09 | 0.0001 | pass |
| interface, vacuum side | 2570 | 1.2e-05 | -49.2 | 2.2e-06 | 2.4e-06 | 0.0001 | pass |
| interface, dielectric side | 2570 | 8.9e-08 | -70.5 | 4e-09 | 1.7e-08 | 0.0001 | pass |

### Separate sweeps (vacuum, normal incidence; reported only)

| sweep | value A | value B |
| --- | --- | --- |
| layers 10 vs 20: max R on band | 4.7e-10 (-93.3 dB) | 2.7e-12 (-116 dB) |
| duration 100 fs vs 200 fs: max R on band | 4.7e-10 | 4.7e-10 (relative change 1.5e-06) |

### 20,000-step stability

| run | steps | duration (fs) | source end (fs) | energy last / peak | energy at half / peak | late growth | decay limit applies | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| vacuum normal | 20000 | 1168 | 49.4 | 6e-18 | 9.4e-18 | 1.07117e-05 | yes | pass |
| n=2 normal | 20000 | 1168 | 49.4 | 3.6e-16 | 6e-16 | 0.000595636 | yes | pass |
| vacuum 60deg | 20000 | 1168 | 139 | 9e-07 | 1.5e-06 | 1 | no | pass |

### Layer A: CUDA FP32 against CPU FP64 (short vacuum normal fixture)

| steps | max abs error | relative L2 | verdict |
| --- | --- | --- | --- |
| 1713 | 7.3e-07 | 8.9e-07 | pass |
