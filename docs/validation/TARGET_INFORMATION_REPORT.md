# Real Gaussian target objective validation

Development validation, 20 September 2026. The new objective takes real response,
XX, XZ, ZZ and noise matrices. No optical data, color prior or exposure constant
is bundled. Cholesky solves retain target nuisance and differentiate through
candidate-dependent noise without explicit matrix inversion or jitter.

Tests compare information, posterior covariance, decoder and trace metrics
against an independent NumPy measurement-space Schur complement. Further checks
cover target-basis invariance, exact batch semantics, a high-SNR nuisance floor,
FP32 agreement, response/read-noise gradcheck and invalid covariance rejection.
A small synthetic detector-plane FDTD loss also agrees with a material-parameter
central difference. Its intensity response and prior are synthetic and are not
the research CR optical proxy or its locked statistical data.

## Synthetic research-module comparison

The active research `information/local_gaussian.py` module was evaluated
read-only on ten synthetic cases, five each on CPU and local RTX 3060 CUDA.
Each has four measurements, nine scene components and three target components.
XX and a residual target covariance construct a valid joint prior. Noise uses
the response-dependent mean plus read variance. Both implementations differentiate
through response and noise. No research input arrays were loaded for this test.

- Maximum absolute information difference: 2.443e-15 bits.
- Maximum response-gradient relative L2 difference: 1.654e-15.

The [raw record](cr-information-synthetic-parity.json) includes deterministic
seeds, device, software version and the reference module SHA-256. This comparison
does not validate prior preparation, electron calibration, angular weighting,
the optical solver, color decoding on measured data, mask optimization or
research promotion. It is not a performance benchmark.

The information/plane/spectral suite passed 61 tests locally and on RTX 5880.
After adding rejection of complex read-noise values and empty channels, the
14-test information suite passed again locally. The final input guards do not
change valid-case numerical results.

```sh
python -m pytest tests/test_information.py tests/test_adjoint_planes.py tests/test_adjoint_spectrum.py -q
```

[Public API and CR mapping requirements](../TARGET_INFORMATION.md).
[Implementation source hashes](target-information-source-evidence.json).
