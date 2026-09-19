# Differentiable plane fields and normalized power

Development validation, 20 September 2026. The real nondispersive discrete
adjoint now supports fixed collocated spectral detector planes through a
deduplicated set of indexed Yee observations. Torch differentiates the fixed
interpolation and signed Poynting objective. No whole time history is retained.

## Numerical checks

The plane suite compares resident, streamed DRAM and file-backed spectra and
gradients with full-state time-domain Torch autograd. Cases include CPU/CUDA,
scalar and diagonal epsilon, multiple overlapping planes, more than 32 internal
samples, CPML, real periodic wrapping, nonuniform meshes, 3D planes and optional
asynchronous CUDA tile staging. Affine fields verify trilinear collocation and
the clipped physical area independently of the solver. Native frequency-monitor
complex fields and flux also agree. Plane spectra use the native positive
Fourier exponential, unlike the negative exponential in the point-spectrum API.

Matched-reference normalization is checked with analytic field amplitudes and
a finite-difference material derivative. Invalid/weak references and changed
fixed configurations are rejected. Duplicate planes share their raw support
samples. Host-budget rejection occurs before physical field allocation.

The final plane suite passes all 16 tests locally and on RTX 5880. Before the
two fixed-configuration mutation tests were added, the local full suite passed
816 tests with one skip. The broader GPU observer/adjoint/slab/file-bank suite
passed 134 tests before those final guards. The final targeted rerun covers
the guard additions.

## Physical slab check

RTX 5880 Ada, Torch 2.10.0, FP64, mesh 0.025 micrometres, 1,600 steps,
320 × 20 × 1 cells. The lossless slab has index 1.5 and thickness 0.2 micrometres.
The transverse boundary is periodic. The x ends use 16 CPML layers. Nine
frequencies cover wavelengths from 1.3 to 1.8 micrometres. A pulsed plane source
illuminates the slab. An otherwise identical air run supplies the reference.
Reflected fields are subtracted before their signed power is evaluated.

| Quantity | Measured error | Declared tolerance |
| --- | ---: | ---: |
| Maximum transmission error against Fresnel slab formula | 0.00153445 | 0.005 |
| Maximum absolute error in T + R = 1 | 4.440e-6 | 0.005 |
| Mean-transmission index-gradient relative error against central difference | 1.139e-8 | 2e-6 |

The finite-difference index step is 1e-4. The analytic formula is
`T = 1 / (1 + ((n*n-1)/(2*n))**2 * sin(2*pi*n*d/lambda)**2)`.
The test differentiates refractive index on a fixed staircase material mask.
It does not test motion of a sharp interface, a converged shape gradient,
dispersion, a mode port, CR reconstruction or an inverse-design optimum.
One mesh and duration do not establish a convergence study.

The measured 18.73 seconds includes the reference solve, sample forward and
backward, and two finite-difference evaluations. It is a validation duration,
not a warmed performance comparison or a competitor speedup.

```sh
python -m benchmarks.plane_adjoint --output results/plane-adjoint-slab.json
python -m pytest tests/test_adjoint_planes.py -q
```

[Raw slab result](plane-adjoint-slab-5880.json).
[Final source hashes and measurement scope](plane-adjoint-source-evidence.json).
[API and units](../DIFFERENTIABLE_PLANES.md).
