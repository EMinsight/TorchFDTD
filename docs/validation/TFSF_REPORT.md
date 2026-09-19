# Closed-box TFSF validation

Native inputs and independent references only. The independent discrete comparison uses float64 NumPy. Sphere solves use float32 fused CUDA on RTX 5880 Ada, PyTorch 2.10/CUDA 12.8. This is accuracy validation, not an external-library speed comparison.

## Independent homogeneous reference

All 20 active-axis, direction and Cartesian transverse-polarization combinations in 2D/3D were evaluated. The independent recurrence reconstructs the Gaussian directly, advances on a scalar line whose ends cannot affect the sampled fields, and applies geometric masks at each Yee coordinate. It does not call the native waveform, curl, CPML or surface-map routines. At 90 steps the maximum full-field relative L2 difference is 4.279e-07. The maximum exterior field peak divided by the full field peak is 5.032e-13. These short runs do not measure long-duration incident-line error.

For 1600-step entry E/H and exit E histories, background indices 1, 1.5 and 3 give the following worst relative L2 differences from the independent line:

| Auxiliary PML cells per end | Max relative L2 difference |
|---:|---:|
| 32 | 2.132e-04 |
| 96 | 1.040e-06 |
| 192 | 6.580e-08 |

[All discrete cases and incident-line histories' errors](tfsf-sources.json). Reproduce with `python -m benchmarks.tfsf_sources`.

## Dielectric sphere scattering

A radius-0.3 µm, index-1.5 sphere is illuminated along +x with transverse Ez. The cubic domain is 3.2 µm, the TFSF box is 1.6 µm and each exterior PML has physical thickness 0.4 µm. Six scattered-field planes at ±1.1 µm integrate outward flux. A matched empty-box run supplies incident intensity and residual-field subtraction. Nine wavelengths span 1.3–1.8 µm. The Gaussian power FWHM is 8 fs with offset 30 fs. Physical duration is rounded upward to whole steps and the actual duration is retained in each result.

The analytic reference evaluates the standard Mie coefficients using SciPy spherical Bessel functions. Zero index contrast and the small-sphere Rayleigh limit are checked separately. This reference is intended for the modest real size parameters in this fixture, not arbitrary absorbing or very large spheres. Formula context: [Prahl, Mie Scattering Algorithms](https://miepython.readthedocs.io/en/latest/07_algorithm.html). No external Mie implementation is called.

| Mesh (µm) | Grid | Requested time (fs) | Max relative Mie error | Empty-box cross section (µm²) |
|---|---:|---:|---:|---:|
| 0.1 | 32³ | 120 | 8.8963% | 6.683e-15 |
| 0.05 | 64³ | 120 | 0.3086% | 1.110e-14 |
| 0.025 | 128³ | 120 | 1.0474% | 2.189e-15 |
| 0.02 | 160³ | 120 | 0.5514% | 1.370e-14 |
| 0.025 | 128³ | 240 | 1.0474% | 2.322e-15 |

**The mesh error is not monotonic.** The 0.05 µm result is unusually close to the analytic series. It is not a demonstrated asymptotic error estimate or a reason to prefer that mesh generally. Increasing the 0.025 µm run from 120 to 240 fs changes the cross section by at most 6.449e-09 relative. This rules out a significant duration effect for that comparison, but does not isolate staircase geometry, monitor interpolation, numerical dispersion or physical-PML error. The source and geometry still require convergence studies for each new problem.

The attempted 0.0125 µm mesh requires 256³ cells and was rejected by the existing eight-million-cell job limit. It produced no calculation result and is not included as a measured point.

[Three initial meshes](tfsf-sphere.json), [0.02 µm refinement](tfsf-sphere-finer.json), [240 fs control](tfsf-sphere-long.json), [executable sphere example](../../examples/tfsf_sphere.py).

## Execution and scope checks

`tests/test_tfsf.py` covers float32/64 CPU agreement, Torch/fused and graph/eager equivalence, independent tensor cases, transverse vector polarization, both directions, overlapping boxes, soft-source superposition, graded exterior mesh and passive dispersive scatterers. It checks invalid shell material, geometry and boundary combinations. Full incident-line state contributes to decay and non-finite diagnostics, including delayed drives. A zero-area sampled pulse verifies that automatic termination preserves the fixed-duration trace prefix.

The UI test creates a box, changes axis/direction without losing spans, previews incidence and runs an empty-box exterior-leakage check. Native support does not imply FSP TFSF conversion or oblique injection. See [source definition and limits](../TFSF_SOURCES.md).
