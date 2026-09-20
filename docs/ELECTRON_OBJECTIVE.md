# Spectral response to equivalent-electron information

`spectral_electron_model` converts a nonnegative channel-by-wavelength response
into a mean electron vector and a linear latent-scene measurement matrix.
The conversion multiplies response by mean spectral irradiance per metre,
QE, wavelength quadrature in metres, photon conversion lambda/(h c), and a
fixed common calibration. It then applies the supplied scene basis.

The basis has latent-by-wavelength axes. For the locked CR fractional identity
basis, multiplying the mean spectrum by that basis cancels the source in the
linear perturbation model. The mean charge still contains the source. An
arbitrary basis is accepted explicitly, without silently constructing an
identity or normalizing the response.

```python
from photonweave import spectral_electron_model, exposure_target_information

# response has shape (4, 9), in the locked R, G2, G1, B row order.
model = spectral_electron_model(
    response, wavelengths_nm, qe, mean_spectrum, scene_basis,
    calibration=common_cfa_calibration,
)
result = exposure_target_information(
    model, covariance_xx, covariance_xz, covariance_zz,
    exposure_scales=[.02, .04, .08, .16, .32],
    probabilities=[.2] * 5, read_noise_e_rms=1.5, raw_pixels=4,
)
loss = -result.weighted_bits_per_pixel
loss.backward()
```

Those exposure scales correspond to 20, 40, 80, 160 and 320 equivalent CFA
green electrons relative to the locked reference of 1000. They do not set each
router's output brightness. Each exposure scales the measurement and mean,
and recomputes shot-plus-read covariance from that mean. Information is
divided by four raw pixels before averaging with exposure probabilities.
Gradients include the response dependence of shot noise.

All spectral arrays must share an explicit grid. `spectral_interpolate`
provides differentiable linear interpolation without extrapolation. To preserve
dense calibration or passband-cut quadrature, supply `quadrature_nm` explicitly.
Otherwise the model uses trapezoid weights on its given grid. In particular,
the dense CFA calibration integral and nine-node latent optical model are
different quadratures and must not be conflated. Wavelengths, quadrature,
calibration and exposure weights are fixed. The model does not supply QE,
illumination, prior data or an area/exposure convention implicitly.

## Locked-context comparison

The active research loader was executed with its required Python 3.12.7,
NumPy 2.4.2 production runtime. It passed the original input-integrity and
development-prior reconstruction checks. A local isolated input copy restored
28 legacy text files from LF to CRLF, each verified against its original SHA-256.
The other 49 legacy files already matched. No original research file, expected
hash, tolerance or loader check was modified.

Three generated positive optical responses were evaluated by the original
five-exposure information objective with that locked context. PhotonWeave
reproduced their scores and response VJPs on CPU and CUDA. Maximum score error
was 6.0e-15 and maximum gradient relative L2 error was 4.81e-14. The
[record](validation/electron-locked-context-parity.json) contains source hashes
and errors, without the private prior or reference tensors. The original
runtime used Torch 2.6.0+cu118 and the comparison runtime Torch 2.10.0+cu126.

Tests also cover an independent NumPy quadrature, interpolation endpoints,
finite-difference gradcheck through mean-dependent noise, explicit exposure
loops and sequential case recomputation. This validates the objective adapter,
not the original mask's FDTD optical response or a completed CR optimization.
Matched geometry, material interpolation, detector origin and full-pupil
optical convergence remain required before that claim.
