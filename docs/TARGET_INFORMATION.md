# Differentiable Gaussian target information

`gaussian_target_information` evaluates a real linear Gaussian measurement
`Y = A X + noise` using explicitly supplied joint scene/target covariances.
It does not assume that the target Z is determined by the sampled scene X.
The irreducible target covariance `ZZ - XZ.T @ solve(XX, XZ)` is retained.

```python
from torchfdtd import gaussian_target_information, shot_read_covariance

# All tensors have a common device and real FP32/FP64 dtype.
# A: (measurement, scene), XX: (scene, scene), XZ: (scene, target),
# ZZ: (target, target), mean_electrons: (measurement,).
noise = shot_read_covariance(mean_electrons, read_noise_e_rms=1.5)
result = gaussian_target_information(A, XX, XZ, ZZ, noise)
loss = -result.information_bits
loss.backward()
```

The caller must supply compatible physical units, optical response conversion,
means, QE, exposure and priors. The library does not insert a color model or
renormalize design brightness. The mean-dependent shot-noise derivative remains
in the graph. A fixed read-noise RMS contributes its squared value to each
diagonal variance. Trainable read-noise RMS also retains its derivative.

Results include information in bits with the real-Gaussian factor one half,
posterior target covariance, residual target-given-scene covariance, the linear
MMSE decoder, recovered target-trace fraction and recovered whitened fraction.
The decoder maps centered Y to centered Z. Add the target mean after decoding.
The two trace fractions are different objectives and are not silently equated.

Leading batch dimensions must be identical or absent for shared matrices.
Partial broadcasting is rejected. XX, ZZ and noise must be positive definite.
The joint X/Z covariance must be positive semidefinite. Nonfinite, asymmetric,
inconsistent or singular inputs fail instead of being repaired with jitter or
eigenvalue clipping. Numerically ill-conditioned posterior factorizations also
fail. The implementation is real-valued. It is not a proper-complex Gaussian
or spatial Q64 information convention, nor a singular dense-latent API.

The posterior is formed from the target residual plus a noise-whitened scene
posterior. This avoids subtracting the complete recovered target covariance
from its prior at high SNR. It does not eliminate all floating-point limits.
Tiny roundoff-level negative information is not clipped into a false exact zero.

## CR adaptation status

A read-only audit of the supplied S11 r1a research protocol identified:

| Contract item | Required meaning |
| --- | --- |
| Geometry | 2 × 2 micrometre periodic cell, 128 × 128 density samples, 750 nm SiN layer between SiO2 regions |
| Optical sampling | Nine nodes from 420 to 670 nm, 16 incoherent pupil rays at NA 0.30, equal x/y polarization weights |
| Incidence | Shifted pupil with CRA 2.5 degrees and azimuth 22.5 degrees for r1a |
| Detector | 24 × 24 midpoint samples at the locked detector coordinate, four wells ordered R,G2,G1,B |
| Optical proxy | Quadrant electric-intensity fractions rescaled to total power transmission, not quadrant local Poynting flux or silicon absorption |
| Color target | Full CIE XYZ on 380:5:780 nm, separate from the nine-node measurement latent |
| Statistics | Explicit joint XX/XZ/ZZ moments, common contrast scaling 0.18 squared, unscaled stored means |
| Noise/exposure | Candidate shot variance plus 1.5-electron RMS read noise, fixed common CFA-based calibration, five exposure levels |
| Optimized score | Probability-weighted information over the five exposures, divided by four for bits per raw pixel |

The S11 seed, its two parent lock files and the active-context configuration
matched their recorded hashes. This verifies those dependencies only. It does
not freeze the entire research tree, establish promotion gates or select an
unverified optimized mask. No original mask, measured dataset or private prior
is included in this library.

The tabulated optical indices vary with wavelength. The FDTD adapter must
preserve those values and oblique pupil phases. A resident fixed-Bloch adjoint
is now available, while matched oblique polarization/source calibration,
the exact intensity-allocation proxy, calibrated electron integration and the
locked prior replay still need implementation/integration. A single normal-ray
constant-index solve or a sum of RGB transmissions would change the experiment.
The local target objective must not be presented as full-camera spatial
information. Six-mask optimization remains behind the research protocol gates.

[Validation](validation/TARGET_INFORMATION_REPORT.md) includes an independent
Schur-complement oracle, response/noise gradients, a synthetic FDTD-to-information
chain and synthetic parity with the supplied active objective module. It does
not establish the requested full CR reproduction.
