# Full spectral/pupil spatial refinement

The locked relaxed seed completed all nine wavelengths and sixteen pupil rays
on a 25 nm mesh with 6,400 steps and 24 PML cells. The preceding 50 nm run uses
3,200 steps and 12 PML cells. Both preserve physical duration
`3.050519791249609e-13 s` and PML thickness `0.6 um`. Input schedule, density
and electron-context hashes match. All 69 runtime/driver source hashes in the
new record match frozen revision `c94e3e0`.

| Quantity | 50 nm FDTD | 25 nm FDTD | Recorded TORCWA order 16 |
| --- | ---: | ---: | ---: |
| Maximum absolute response discrepancy from order 16 | 0.029442 | 0.005160 | Reference |
| Relative L2 response discrepancy from order 16 | 4.847% | 0.888% | Reference |
| Weighted information, bits per pixel | 1.234563 | 1.216623 | 1.206575 |

The response contains four detector channels across nine wavelengths after
the fixed pupil and polarization reductions. Information uses the same fixed
development electron calibration. These are forward results for the same
relaxed seed, not optimized structures. The 25 nm information discrepancy is
approximately 0.833 percent relative to the recorded reference.

This is a spatial convergence trend, not a certified error bound. The reference
uses FP32/complex64 TORCWA with imaginary-frequency regularizer `1e-4`, while
FDTD uses FP64 fields at real frequency and arithmetic Yee-box density averaging.
TORCWA order 12 versus 16 changes the response by relative L2 `0.000968` and
maximum absolute `0.000484`. Finer spatial checks, duration/PML controls at the
fine mesh and physical density-gradient convergence remain open.

The [raw forward record](cr-full-mesh25nm6400-3060.json) retains the small
response matrix, objective and source/input hashes. The [comparison record](cr-full-spatial-refinement.json)
retains per-wavelength discrepancies. Original density and electron-context
arrays are not included. This run overlapped local development tests, so its
elapsed time is diagnostic and supports no cross-solver speed claim.

This result uses the legacy periodic response implementation. It is separate
from the new [budgeted periodic API](../PERIODIC_HIERARCHICAL_DESIGN.md), whose
full-schedule validation is pending. A completed forward result does not certify
a completed gradient calculation, inverse optimization or release readiness.
