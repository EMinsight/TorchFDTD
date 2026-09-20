# Matched TorchFDTD and FDTDX correctness

A bounded GPU comparison passed for a **16³-cell, 64-step periodic dielectric
fixture**. Both implementations ran sequentially in the same Linux environment
on an RTX3060. This establishes agreement for the recorded quantities in this
fixture. It is not a throughput result or a general feature-parity claim.

The [machine-readable record](validation/fdtdx_periodic_correctness.json) contains
the configuration, versions, source and artifact hashes, numerical errors and
limitations. Native execution used the audited wheel from revision
`6fa0c3518efba5d0e93c4c1125b52665a5b7713b`, SHA256
`56ae40b83e74e3e643f21ce06b29f22dabab174d3946825a4f8e08861e674ee5`.
FDTDX used upstream revision
[`60c1c2712da8bb0ccaa55c77846217932bb665a2`](https://github.com/ymahlau/fdtdx/tree/60c1c2712da8bb0ccaa55c77846217932bb665a2).
Installed native and FDTDX Python files were checked against their frozen
artifacts. No upstream solver implementation was modified.

## Shared calculation

The cell spacing was 100 nm, the timestep was
`1.7332498813918235e-16 s`, and all six faces were periodic. Both solvers used
zero initial fields, the same sampled scalar permittivity array, a fixed soft
Ex point-source kick table, and two raw Ex point histories sampled after each
complete E/H update. The slab occupied z indices 8 and 9 with relative
permittivity 2.25, surrounded by relative permittivity 1. The source cell stayed
in vacuum. No PML, dispersion or interpolation was involved.

The objective was `mean(trace0²) + 0.3 mean(trace1²)`. Its scalar material
derivative varied permittivity within the slab mask. Both implementations
requested four device checkpoints. Native execution reported fused CUDA
forward and transpose kernels. FDTDX used its public checkpointed simulation
API, point dipole source and custom sampled temporal profile. Its profile was
scaled by `-1/C` to reproduce the native additive E kick between the E and H
updates. Detector interpolation was explicitly disabled.

Dynamic fields, material arrays and source samples were FP32. **Geometry
coordinates were FP64 in both setups.** In FDTDX, only public grid construction
used `jax.enable_x64(True)`. The default returned to x64-disabled before
simulation, and every floating dynamic array was checked to be FP32.

## Results

| Quantity | Result |
|---|---:|
| Cross-framework history maximum absolute error | 0 |
| Cross-framework history relative L2 error | 0 |
| Loss, both implementations | 0.0001640023838263005 |
| Scalar material VJP, both implementations | −7.226401066873223e−5 |
| Loss and VJP relative differences | 0 |
| FDTDX one-step E/H errors against explicit source/curl expectation | 0 |
| FDTDX homogeneous history error against independent Fourier reference | 4.55182e−8 |
| Best native centered finite-difference relative error | 4.47045e−5 |
| Best FDTDX centered finite-difference relative error | 6.14183e−5 |

Finite differences used parameter steps 0.01, 0.003 and 0.001. The full record
retains each result. Exact agreement above concerns the two recorded histories,
the loss and the scalar material VJP. Full terminal fields were not compared
across the 64-step calculations.

## Configuration checks and limits

An initial setup failed before the first FDTDX timestep: subtraction of centered
FP32 grid coordinates changed the inferred uniform cell width and timestep by
approximately 2×10⁻⁷ relative. The strict timestep check rejected it. Constructing
the geometry in FP64 preserved the same physical endpoints and timestep without
relaxing the check or shifting the domain. A subsequent pre-step attempt used an
obsolete JAX context API, corrected to the public JAX 0.10.1 API. Failed logs are
retained with the private raw evidence.

The environment used Python 3.12.14, Torch 2.10.0+cu128, CuPy 13.6.0,
JAX/jaxlib 0.10.1, Equinox 0.13.8, NumPy 2.4.6, SciPy 1.17.1 and Optax 0.2.8.
The dependency lock is hashed in the record.

This finite periodic box is not an open-boundary transmission or continuum
convergence study. The result does not establish PML, ADE, anisotropy, arbitrary
sources or monitors, batch, streaming or distributed equivalence. Equal requested
checkpoint counts do not imply identical memory use or reverse schedules.
No comparative timing or memory conclusion is reported.
