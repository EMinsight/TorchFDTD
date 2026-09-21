# Stability sweep

Record: `docs/validation/stability_sweep_3060.json` (case `docs/validation/cases/STABILITY_SWEEP.json`, declared at commit 6eb7996). Driver `benchmarks/stability_sweep.py`. Every number below is copied from the record; nothing here is typed by hand.

Environment: Python 3.10.2, torch 2.10.0+cu126 (CUDA 12.6), GPU NVIDIA GeForce RTX 3060, Windows-10-10.0.26200-SP0; run at 2026-09-21T21:18:06+00:00 on commit 8167030d1c264629b51baa0bd611da87ad14bb8f with 11 dirty paths; wall time 1757 s.

## What is measured

Each row runs 20000 steps and samples every 250 steps: the run-control state norm (the quantity the production divergence check judges: volume-weighted epsilon|E|^2 + |H|^2 over the whole grid plus the ADE oscillator energy), the volume-weighted epsilon|E|^2 + |H|^2 on the cells outside every PML layer, the peak field and whether the divergence check fired. The post-source peak is the maximum over the first quarter of the samples after `source_end_time`; growth is the maximum later sample over that peak (limit 1.5); last/peak is the final sample over that peak (limit 1.0 for rows with an absorbing face, 1.001 for closed lossless cavities). A row passes only if both energies satisfy both limits and no check fired.

Summary: 56 of 56 rows pass; 0 fail; 1 rejected as declared.

## Matrix

| row | group | dim | execution | cells | steps | source end (fs) | state norm growth | state norm last/peak | interior growth | interior last/peak | last / overall peak | late trend | peak field (last) | check fired | s | verdict |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| vacuum-2d | vacuum | 2d | cpu float64 | 9600 | 20000 | 148.2 | 5.338e-07 | 1.1e-07 | 5.41e-07 | 1.13e-07 | 1.1e-19 | 0.207 | 1.83e-11 | no | 7.56 | pass |
| slab-n35-2d | dielectric | 2d | cpu float64 | 9600 | 20000 | 148.2 | 1.727e-13 | 6.33e-15 | 1.888e-13 | 6.83e-15 | 1.6e-19 | 0.0367 | 2.03e-11 | no | 7.46 | pass |
| drude-slab-ade-2d | dispersive in PML | 2d | cpu float64 | 9600 | 20000 | 148.2 | 1.514e-07 | 7.66e-09 | 2.201e-07 | 1.17e-08 | 3.9e-20 | 0.0506 | 1.12e-11 | no | 8.4 | pass |
| drude-slab-frozen-2d | dispersive in PML | 2d | cpu float64 | 9600 | 20000 | 148.2 | 1.645e-07 | 6.71e-09 | 2.302e-07 | 9.78e-09 | 4e-20 | 0.0408 | 1.13e-11 | no | 8.37 | pass |
| lorentz-slab-ade-2d | dispersive in PML | 2d | cpu float64 | 9600 | 20000 | 148.2 | 7.716e-07 | 2.73e-08 | 9.04e-07 | 3.37e-08 | 2.7e-20 | 0.0354 | 1.24e-11 | no | 8.92 | pass |
| lorentz-slab-frozen-2d | dispersive in PML | 2d | cpu float64 | 9600 | 20000 | 148.2 | 8.161e-07 | 2.92e-08 | 9.566e-07 | 3.59e-08 | 2.9e-20 | 0.0358 | 1.22e-11 | no | 8.71 | pass |
| metal-slab-ade-2d | dispersive in PML | 2d | cpu float64 | 9600 | 20000 | 148.2 | 5.505e-07 | 7.07e-08 | 5.965e-07 | 8.3e-08 | 7.1e-20 | 0.128 | 1.31e-11 | no | 8.5 | pass |
| bloch-lorentz-2d | Bloch | 2d | cpu float64 | 4800 | 20000 | 148.2 | 0.0001369 | 2.69e-08 | 0.0001183 | 3.04e-08 | 2.5e-19 | 0.000197 | 7.37e-10 | no | 9.29 | pass |
| graded-2d | mesh | 2d | cpu float64 | 7918 | 20000 | 148.2 | 0.005286 | 0.00279 | 0.005452 | 0.00287 | 8.3e-05 | 0.527 | 0.00054 | no | 9.54 | pass |
| subpixel-2d | mesh | 2d | cpu float64 | 9600 | 20000 | 148.2 | 0.08589 | 0.0639 | 0.08854 | 0.0659 | 0.001 | 0.744 | 0.00509 | no | 10.3 | pass |
| cpml-k1-a0-2d | CPML profile | 2d | cpu float64 | 9600 | 20000 | 148.2 | 5.338e-07 | 1.1e-07 | 5.41e-07 | 1.13e-07 | 1.1e-19 | 0.207 | 1.83e-11 | no | 8.38 | pass |
| cpml-k1-a0.2-2d | CPML profile | 2d | cpu float64 | 9600 | 20000 | 148.2 | 2.719e-06 | 1.19e-07 | 2.123e-06 | 1.22e-07 | 1.2e-19 | 0.0474 | 1.85e-11 | no | 8.77 | pass |
| cpml-k4-a0-2d | CPML profile | 2d | cpu float64 | 9600 | 20000 | 148.2 | 2.684e-06 | 5.74e-07 | 3.036e-06 | 6.25e-07 | 5.7e-19 | 0.226 | 3.57e-11 | no | 9.65 | pass |
| cpml-k4-a0.2-2d | CPML profile | 2d | cpu float64 | 9600 | 20000 | 148.2 | 3.616e-06 | 6.19e-07 | 3.649e-06 | 6.82e-07 | 6.2e-19 | 0.171 | 3.77e-11 | no | 8.21 | pass |
| src-sheet-2d | sources | 2d | cpu float64 | 9600 | 20000 | 148.2 | 3.274e-07 | 1.31e-07 | 2.782e-07 | 1.23e-07 | 1.3e-19 | 0.578 | 3e-10 | no | 7.73 | pass |
| src-oneway-2d | sources | 2d | cpu float64 | 9600 | 20000 | 150 | 2.695e-06 | 2.69e-06 | 2.738e-06 | 2.74e-06 | 2.7e-18 | 9.6 | 1.24e-09 | no | 7.02 | pass |
| src-tfsf-2d | sources | 2d | cpu float64 | 9600 | 20000 | 159.6 | 3.411e-07 | 1.19e-07 | 5.518e-07 | 1.58e-07 | 1.2e-19 | 0.415 | 2.45e-10 | no | 10.6 | pass |
| vacuum-3d | vacuum | 3d | cpu float64 | 32768 | 20000 | 148.2 | 7.463e-05 | 8.57e-07 | 5.592e-05 | 7.11e-07 | 8.6e-19 | 0.0115 | 1.97e-10 | no | 48.8 | pass |
| slab-n35-3d | dielectric | 3d | cpu float64 | 32768 | 20000 | 148.2 | 9.365e-11 | 3.77e-12 | 1.03e-10 | 4.13e-12 | 2.4e-16 | 0.0403 | 5.87e-10 | no | 48.7 | pass |
| drude-slab-ade-3d | dispersive in PML | 3d | cpu float64 | 32768 | 20000 | 148.2 | 7.385e-06 | 9.1e-08 | 5.011e-06 | 9.91e-08 | 9.1e-20 | 0.0123 | 1.94e-10 | no | 50.5 | pass |
| drude-slab-frozen-3d | dispersive in PML | 3d | cpu float64 | 32768 | 20000 | 148.2 | 1.142e-05 | 9.22e-08 | 1.014e-05 | 9.87e-08 | 9.2e-20 | 0.00807 | 1.94e-10 | no | 52.1 | pass |
| lorentz-slab-ade-3d | dispersive in PML | 3d | cpu float64 | 32768 | 20000 | 148.2 | 2.7e-05 | 8.72e-07 | 1.942e-05 | 7e-07 | 8.7e-19 | 0.0323 | 1.91e-10 | no | 56.1 | pass |
| lorentz-slab-frozen-3d | dispersive in PML | 3d | cpu float64 | 32768 | 20000 | 148.2 | 2.904e-05 | 9.1e-07 | 2.134e-05 | 7.24e-07 | 9.1e-19 | 0.0313 | 1.91e-10 | no | 56.4 | pass |
| metal-slab-ade-3d | dispersive in PML | 3d | cpu float64 | 32768 | 20000 | 148.2 | 3.615e-06 | 6.86e-08 | 3.512e-06 | 1.1e-07 | 9.9e-20 | 0.019 | 1.94e-10 | no | 59.7 | pass |
| bloch-lorentz-3d | Bloch | 3d | cpu float64 | 32768 | 20000 | 148.2 | 4.398e-05 | 4.29e-09 | 3.78e-05 | 3.37e-09 | 1.6e-19 | 9.75e-05 | 8.07e-10 | no | 177 | pass |
| graded-3d | mesh | 3d | cpu float64 | 32768 | 20000 | 148.2 | 0.04145 | 0.00223 | 0.04231 | 0.00226 | 7.5e-05 | 0.0537 | 0.000636 | no | 61.3 | pass |
| subpixel-3d | mesh | 3d | cpu float64 | 32768 | 20000 | 148.2 | 0.1917 | 0.0211 | 0.194 | 0.0215 | 0.00025 | 0.113 | 0.00209 | no | 57 | pass |
| cpml-k1-a0-3d | CPML profile | 3d | cpu float64 | 32768 | 20000 | 148.2 | 7.464e-05 | 8.57e-07 | 5.593e-05 | 7.11e-07 | 8.6e-19 | 0.0115 | 1.97e-10 | no | 43.7 | pass |
| cpml-k1-a0.2-3d | CPML profile | 3d | cpu float64 | 32768 | 20000 | 148.2 | 3.39e-07 | 1.15e-07 | 3.36e-07 | 1.19e-07 | 1.1e-19 | 0.338 | 2.02e-10 | no | 47.9 | pass |
| cpml-k4-a0-3d | CPML profile | 3d | cpu float64 | 32768 | 20000 | 148.2 | 7.55e-05 | 8.89e-07 | 5.675e-05 | 7.42e-07 | 8.9e-19 | 0.0118 | 1.99e-10 | no | 47.8 | pass |
| cpml-k4-a0.2-3d | CPML profile | 3d | cpu float64 | 32768 | 20000 | 148.2 | 3.423e-06 | 1.55e-07 | 3.349e-06 | 1.59e-07 | 1.5e-19 | 0.112 | 2.05e-10 | no | 43.5 | pass |
| src-sheet-3d | sources | 3d | cpu float64 | 32768 | 20000 | 148.2 | 0.004216 | 3.42e-05 | 0.005008 | 4.25e-05 | 3.4e-17 | 0.00811 | 4.49e-09 | no | 43 | pass |
| src-oneway-3d | sources | 3d | cpu float64 | 32768 | 20000 | 161.6 | 6.43e-06 | 4.21e-07 | 8.598e-06 | 5.64e-07 | 4.2e-19 | 0.291 | 5.28e-10 | no | 32.3 | pass |
| src-tfsf-3d | sources | 3d | cpu float64 | 32768 | 20000 | 156.2 | 8.824e-07 | 4.48e-07 | 3.481e-06 | 1.71e-06 | 4.5e-19 | 0.593 | 6.67e-10 | no | 44.5 | pass |
| sin-posts-ade-2d | dispersive in PML | 2d | cpu float64 | 30000 | 20000 | 52.98 | 1.117e-08 | 5.9e-17 | 1.268e-08 | 3.91e-17 | 1.8e-19 | 5.28e-09 | 8.17e-10 | no | 21.5 | pass |
| sin-posts-ade-2d-cuda | dispersive in PML | 2d | cuda float32 fused | 30000 | 20000 | 52.98 | 1.122e-08 | 4.5e-11 | 1.272e-08 | 4.33e-11 | 1.3e-13 | 0.00401 | 1.43e-06 | no | 1.6 | pass |
| sin-posts-frozen-2d | dispersive in PML | 2d | cpu float64 | 30000 | 20000 | 52.98 | 1.116e-08 | 5.93e-17 | 1.266e-08 | 3.91e-17 | 1.8e-19 | 5.31e-09 | 8.2e-10 | no | 23.2 | pass |
| sin-posts-frozen-2d-cuda | dispersive in PML | 2d | cuda float32 fused | 30000 | 20000 | 52.98 | 1.119e-08 | 3.46e-11 | 1.27e-08 | 3.18e-11 | 1e-13 | 0.00309 | 1.17e-06 | no | 1.32 | pass |
| pec-2d | PEC/PMC | 2d | cpu float64 | 9600 | 20000 | 148.2 | 0.02638 | 0.00265 | 0.02783 | 0.00284 | 0.00031 | 0.1 | 0.0028 | no | 7.04 | pass |
| pmc-pec-cpml-3d | PEC/PMC | 3d | cpu float32 endpoint | 32768 | 20000 | 148.2 | 0.1343 | 0.0352 | n/a | n/a | 0.0032 | 0.262 | 0.00342 | no | 82.5 | pass |
| pmc-pec-cavity-3d | PEC/PMC | 3d | cpu float32 endpoint | 32768 | 20000 | 148.2 | 1.034 | 0.891 | n/a | n/a | 0.64 | 0.959 | 0.0419 | no | 93.6 | pass |
| tensor-admitted-3d | tensor in CPML | 3d | cpu float32 tensor | 32768 | 20000 | 148.2 | 0.2504 | 0.25 | 0.1805 | 0.181 | 2.5e-13 | 1.05 | 1.37e-07 | no | 222 | pass |
| tensor-rejected-3d | tensor in CPML | 3d | cpu float32 tensor | 32768 | 0 | 148.2 | n/a | n/a | n/a | n/a | n/a | n/a | n/a | no | 0.0221 | rejected as declared |
| reversible-vacuum-3d | paths | 3d | cpu float32 | 32768 | 20000 | 148.2 | 1.003 | 0.999 | 1.003 | 0.999 | 0.57 | 1.1 | 0.0174 | no | 36.5 | pass |
| reversible-n35-3d | paths | 3d | cpu float32 | 32768 | 20000 | 148.2 | 1.005 | 0.892 | 0.9983 | 0.96 | 0.55 | 0.953 | 0.0468 | no | 35.8 | pass |
| streamed-vacuum-2d | paths | 2d | cpu float64 streamed | 9600 | 20000 | 148.2 | 5.336e-07 | 1.1e-07 | 5.41e-07 | 1.13e-07 | 1.1e-19 | 0.206 | 1.83e-11 | no | 51.3 | pass |
| streamed-n35-2d | paths | 2d | cpu float64 streamed | 9600 | 20000 | 148.2 | 9.872e-14 | 4.14e-15 | 1.888e-13 | 6.83e-15 | 9.9e-20 | 0.042 | 2.03e-11 | no | 53.3 | pass |
| tensorbatch-vacuum-2d | paths | 2d | cuda float32 fused batch | 9600 | 20000 | 148.2 | 0.2382 | 0.234 | 0.2231 | 0.218 | 2.3e-13 | 1.39 | 4.86e-08 | no | 0.429 | pass |
| tensorbatch-n35-2d | paths | 2d | cuda float32 fused batch | 9600 | 20000 | 148.2 | 4.711e-09 | 4.71e-09 | 4.619e-09 | 4.61e-09 | 1.2e-13 | 1.05 | 9.03e-08 | no | 0.279 | pass |
| vacuum-2d-cuda | vacuum | 2d | cuda float32 fused | 9600 | 20000 | 148.2 | 0.2382 | 0.234 | 0.2231 | 0.218 | 2.3e-13 | 1.39 | 4.86e-08 | no | 0.424 | pass |
| slab-n35-2d-cuda | dielectric | 2d | cuda float32 fused | 9600 | 20000 | 148.2 | 4.711e-09 | 4.71e-09 | 4.619e-09 | 4.61e-09 | 1.2e-13 | 1.05 | 9.03e-08 | no | 0.391 | pass |
| drude-slab-ade-2d-cuda | dispersive in PML | 2d | cuda float32 fused | 9600 | 20000 | 148.2 | 0.01946 | 0.0195 | 0.02206 | 0.0221 | 1e-13 | 1.04 | 7.39e-08 | no | 0.907 | pass |
| drude-slab-frozen-2d-cuda | dispersive in PML | 2d | cuda float32 fused | 9600 | 20000 | 148.2 | 0.05113 | 0.0511 | 0.05583 | 0.0558 | 3.1e-13 | 1.17 | 8.47e-08 | no | 0.945 | pass |
| lorentz-slab-ade-2d-cuda | dispersive in PML | 2d | cuda float32 fused | 9600 | 20000 | 148.2 | 0.1683 | 0.168 | 0.1694 | 0.169 | 1.7e-13 | 1.2 | 9.01e-08 | no | 0.978 | pass |
| lorentz-slab-frozen-2d-cuda | dispersive in PML | 2d | cuda float32 fused | 9600 | 20000 | 148.2 | 0.127 | 0.105 | 0.1368 | 0.105 | 1.2e-13 | 0.879 | 9.14e-08 | no | 0.968 | pass |
| metal-slab-ade-2d-cuda | dispersive in PML | 2d | cuda float32 fused | 9600 | 20000 | 148.2 | 0.1846 | 0.18 | 0.1789 | 0.173 | 1.8e-13 | 1.34 | 1e-07 | no | 0.883 | pass |

## Late trend of the settled rows

Rows whose state norm at the last sample exceeds its value at the first judged sample by more than 10 percent, with the level they sit at relative to the overall peak and the peak field at the first judged and the last sample. A level of 1e-12 or below of the overall peak is the float round-off floor of the fields (1e-6 in amplitude); a creep at that level with a constant peak field is accumulated round-off, not a growing mode; a closed lossless cavity (all faces periodic, PEC or PMC) keeps its energy and its state norm oscillates with the staggered E/H sampling. The growth and last/peak criteria above are what is judged.

| row | execution | state norm last / first judged | level: last / overall peak | peak field at first judged | peak field at last |
| --- | --- | ---: | ---: | ---: | ---: |
| src-oneway-2d | cpu float64 | 9.6 | 2.7e-18 | 6.22e-10 | 1.24e-09 |
| reversible-vacuum-3d | cpu float32 | 1.1 | 0.57 | 0.0154 | 0.0174 |
| tensorbatch-vacuum-2d | cuda float32 fused batch | 1.39 | 2.3e-13 | 4.54e-08 | 4.86e-08 |
| vacuum-2d-cuda | cuda float32 fused | 1.39 | 2.3e-13 | 4.54e-08 | 4.86e-08 |
| drude-slab-frozen-2d-cuda | cuda float32 fused | 1.17 | 3.1e-13 | 7.62e-08 | 8.47e-08 |
| lorentz-slab-ade-2d-cuda | cuda float32 fused | 1.2 | 1.7e-13 | 9.16e-08 | 9.01e-08 |
| metal-slab-ade-2d-cuda | cuda float32 fused | 1.34 | 1.8e-13 | 1.02e-07 | 1e-07 |

## Rows with an error, a fired check or a rejection

- `tensor-rejected-3d`: ValueError: Tensor CPML face y_min: every node tensor in its PML layers plus one-node collar must have the face normal as a principal axis with an eigenvalue not strictly between the two transverse eigenvalues (geometric PML stability criterion). (termination `rejected`, samples 0, last step 0).

## Findings

None.

## Limits of this sweep

- Bounded fixtures (120 x 80, 120 x 40 and 32^3 cells) and 20,000 steps: empirical non-growth on these grids, not a spectral proof
- The 3D dispersive rows use 0.1 um cells (4.4 cells per material wavelength in n=3.5); they test stability, not accuracy
- The state norm samples E, H and the ADE state at staggered times; last/peak of a closed cavity therefore carries the staggering and round-off, not a conserved discrete energy
- CUDA rows run the fused kernel on the shared RTX 3060 in float32; other precisions and the RTX 5880 of the documented divergence are not covered here
