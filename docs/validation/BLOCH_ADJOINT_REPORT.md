# Complex Bloch discrete-adjoint validation

Development validation, 20 September 2026. Real epsilon controls complex Yee
and CPML states. The resident CUDA path uses Torch updates and an explicit
Hermitian transpose. It does not invoke the real-only fused CUDA kernels.

## Discrete and replay checks

Twelve Bloch tests cover CPU/CUDA, scalar/diagonal epsilon, complex electric and
magnetic point histories, real/imaginary objective terms, online DFT blocks,
fixed windows, nonuniform seam metrics, overlapping observations, complex plane
interpolation, disk checkpoints and asynchronous CUDA checkpoint staging.
A 3D FP32 case has nonzero phases on two transverse axes. A selected-frequency
material-parameter derivative is also compared with a central difference.
Unsupported fused backward and complex spatial streaming fail explicitly.
An additional replay check changes the model's ray/source configuration after
forward and verifies that the existing graph retains its original derivative.

The Bloch/resident suite passed 43 tests locally. The wider Bloch, resident,
plane, spectrum and slab suite passed 131 tests on RTX 5880. Complex native
forward traces agree with the workbench solver, while the explicit adjoint
agrees with a small full-time autograd oracle.
The local full suite passed 843 tests with one skip before the final replay
configuration-snapshot test was added. The final 12-test Bloch suite then passed
locally and on RTX 5880, including that snapshot guard.

## Oblique TE physical check

RTX 5880 Ada, Torch 2.10.0, FP64, 8 × 160 × 1 grid, 0.05 micrometre mesh,
512 steps. A 0.4 micrometre transverse cell uses the Bloch phase for 20 degrees
incidence in air at wavelength 1.55 micrometres. The propagation ends use
12 CPML layers. A fixed slab has index 1.5 and thickness 0.2 micrometres.
An air reference normalizes transmission and supplies incident fields for
reflection subtraction. Source and detector positions are in the raw benchmark.

| Quantity | Observed error | Declared tolerance |
| --- | ---: | ---: |
| TE Fresnel transmission | 0.00444113 | 0.02 |
| T + R = 1 | 9.576e-6 | 0.005 |
| Index-gradient relative error, central difference step 1e-4 | 1.180e-8 | 2e-6 |

For air incidence, `q1=cos(theta)` and `q2=sqrt(n*n-sin(theta)**2)`.
The independent slab reference is
`T = 1 / (1 + ((q2*q2-q1*q1)/(2*q1*q2))**2 * sin(2*pi*q2*d/lambda)**2)`.
The material gradient holds the geometry, background and Bloch phase fixed.
It is not a moving-interface shape derivative or an angle derivative.

The recorded 21.55 seconds includes an air reference, sample forward/backward
and two finite-difference evaluations. This is a validation duration, not a
warmed throughput or external-solver comparison. One coarse mesh, one TE angle
and one frequency do not establish a convergence study or the full CR pupil.

```sh
python -m benchmarks.bloch_adjoint --output results/bloch-adjoint-slab.json
python -m pytest tests/test_bloch_adjoint.py -q
```

[Raw physical result](bloch-adjoint-slab-5880.json).
[Source hashes](bloch-adjoint-source-evidence.json).
[Supported API and remaining work](../BLOCH_ADJOINT.md).
