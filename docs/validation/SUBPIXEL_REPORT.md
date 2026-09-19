# Experimental subpixel sphere validation

This study measures accuracy against an independent analytic Mie series on an
RTX 5880 Ada. It does not establish general device accuracy or a performance
ranking. The interface-accuracy priority remains open.

The sphere radius is 0.3 µm. The domain is 3.2 µm cubed, the TFSF box is 1.6 µm
cubed, and the six scattered-field planes lie at ±1.1 µm. PML thickness remains
0.4 µm. Nine wavelengths span 1.3–1.8 µm. A Gaussian pulse has 8 fs intensity
FWHM and 30 fs offset. The requested duration is rounded up to whole steps.
The shifted center is (0.013, -0.019, 0.007) µm at every mesh. Each pair uses
the same physical settings and a matched homogeneous reference. Runs use
float32 fused CUDA. Inputs, spectra and actual durations remain in the raw files.

The Mie evaluator uses independently written Riccati-Bessel coefficients,
with its zero-contrast and small-particle limits checked in the existing TFSF
tests. This study uses no commercial solver results or models.

## All requested pairs

| Index | Time (fs) | Face order | Mesh (nm) | Center | Staircase max error | Subpixel max error |
|---:|---:|---:|---:|---|---:|---:|
| 1.5 | 120 | 8 | 20 | centered | 0.5514% | 0.1887% |
| 1.5 | 120 | 8 | 20 | shifted | 0.5352% | 0.1886% |
| 1.5 | 120 | 8 | 25 | centered | 1.0474% | 0.2921% |
| 1.5 | 120 | 8 | 25 | shifted | 1.2242% | 0.2877% |
| 1.5 | 120 | 8 | 50 | centered | 0.3086% | 1.1344% |
| 1.5 | 120 | 8 | 50 | shifted | 4.9730% | 1.1337% |
| 1.5 | 120 | 8 | 100 | centered | 8.8963% | 4.3735% |
| 1.5 | 120 | 8 | 100 | shifted | 10.7603% | 4.7575% |
| 3.48 | 120 | 8 | 20 | centered | 12.1900% | 19.5505% |
| 3.48 | 120 | 8 | 20 | shifted | 15.5334% | 19.5102% |
| 3.48 | 120 | 8 | 25 | centered | 14.8036% | 21.1974% |
| 3.48 | 120 | 8 | 25 | shifted | 18.5903% | 21.1630% |
| 3.48 | 120 | 8 | 50 | centered | 14.4301% | 29.0427% |
| 3.48 | 120 | 8 | 50 | shifted | 30.7697% | 29.1110% |
| 3.48 | 120 | 8 | 100 | centered | 200.1719% | 136.4981% |
| 3.48 | 120 | 8 | 100 | shifted | 176.8838% | 133.2269% |
| 3.48 | 480 | 8 | 16 | centered | 5.5065% | 4.4590% |
| 3.48 | 480 | 8 | 16 | shifted | 4.6760% | 4.3473% |
| 3.48 | 480 | 8 | 20 | centered | 27.4619% | 7.2233% |
| 3.48 | 480 | 8 | 20 | shifted | 6.4148% | 7.1948% |
| 3.48 | 480 | 8 | 25 | centered | 7.7139% | 11.2819% |
| 3.48 | 480 | 8 | 25 | shifted | 10.0053% | 11.5451% |
| 3.48 | 480 | 8 | 50 | centered | 60.3863% | 40.7592% |
| 3.48 | 480 | 8 | 50 | shifted | 41.1592% | 39.8580% |
| 3.48 | 480 | 32 | 25 | centered | 7.7139% | 11.2828% |
| 3.48 | 1920 | 8 | 25 | centered | 8.0197% | 11.5055% |

The low-index sphere shows reduced translation sensitivity and smaller fine-grid
errors with subpixel. It also includes a centered 50 nm case where staircase is
closer to the analytic answer. High-index resonances need finer grids and longer
time windows. At 25 nm, extending 120 fs to 480 fs changes the comparison
substantially. Extending to 1920 fs changes it further. The 480 fs values must
therefore not be presented as certified time-converged values.

Some high-index cases remain less accurate with subpixel. The spectral bounding
needed for the stability construction can affect interface accuracy. These
measurements do not isolate that contribution from numerical dispersion,
quadrature, flux interpolation, CPML or residual time truncation.

Face-order and duration controls are included in the table. Tighter targets,
independent waveguide/port devices, rotated interfaces, dispersive mixtures and
nonuniform subpixel remain follow-up requirements. See [the method and scope](../SUBPIXEL_INTERFACES.md).

## Reproduction and records

```sh
python -m benchmarks.subpixel_sphere --meshes .1 .05 --indices 1.5 3.48 --output results/subpixel-sphere-initial.json
python -m benchmarks.subpixel_sphere --meshes .025 .02 --indices 1.5 3.48 --output results/subpixel-sphere-fine.json
python -m benchmarks.subpixel_sphere --meshes .05 .025 .02 --indices 3.48 --duration-fs 480 --output results/subpixel-sphere-long.json
python -m benchmarks.subpixel_sphere --meshes .025 --indices 3.48 --translations centered --duration-fs 1920 --output results/subpixel-sphere-duration.json
python -m benchmarks.subpixel_sphere --meshes .016 --indices 3.48 --duration-fs 480 --output results/subpixel-sphere-finest.json
python -m benchmarks.subpixel_sphere --meshes .025 --indices 3.48 --translations centered --duration-fs 480 --quadrature 32 --output results/subpixel-sphere-quadrature.json
```

Raw records: [initial](subpixel-sphere-initial.json), [fine](subpixel-sphere-fine.json), [long](subpixel-sphere-long.json), [duration](subpixel-sphere-duration.json), [finest](subpixel-sphere-finest.json), [quadrature](subpixel-sphere-quadrature.json).

Single-run setup, loop and wall timers are retained only as diagnostic data.
The final fine-grid pair and the beginning of the longer-duration study overlapped
on the workstation. Those timings cannot support a speed comparison. No timing
ratio or equal-error speed claim is made from this exploratory study.
