# Selected-ray CR seed pilot, not completed CR validation

The hash-pinned 128-by-128 seed was evaluated at 540 nm and pupil ray zero.
The 2-by-2 micrometre cell contains a 0.75 micrometre patterned layer.
Selected-frequency indices are 1.4603 for the homogeneous background and
2.0543 for the pattern. The detector lies 2.77 micrometres beyond the layer's
exit. The refracted angle is 0.1228792743 rad and azimuth 0.6920031857 rad.
The 24-by-24 detector midpoint grid and R/G2/G1/B order are retained.
Each solver averages the two Cartesian input polarization responses after
per-polarization intensity allocation. No pupil weight is applied in this pilot.

| Solver/setting | R | G2 | G1 | B |
|---|---:|---:|---:|---:|
| TORCWA order 8, original frequency nudge 1e-4 | 0.269685 | 0.191412 | 0.202474 | 0.312299 |
| TORCWA order 8, zero nudge | 0.269555 | 0.191481 | 0.202425 | 0.312382 |
| TORCWA order 12, zero nudge | 0.268509 | 0.191614 | 0.203102 | 0.312721 |
| FDTD 50 nm, 1600 steps | 0.284889 | 0.193414 | 0.214292 | 0.265477 |
| FDTD 50 nm, 3200 steps | 0.285276 | 0.193202 | 0.212972 | 0.266806 |
| FDTD 25 nm, 3200 steps | 0.271355 | 0.192006 | 0.205122 | 0.305186 |
| FDTD 25 nm, 6400 steps | 0.271151 | 0.192205 | 0.205939 | 0.304141 |

At equal physical duration, the maximum channel discrepancy relative to the
original TORCWA setting decreased from 0.04682 to 0.00711 when mesh spacing
was halved. This is an encouraging convergence trend, not a validated error
bound. Doubling the duration at 50 nm changed the unpolarized response by up
to 0.00133. At 25 nm, doubling duration changed a channel by 0.00105 and left a maximum
discrepancy of 0.00816 against the original TORCWA setting. Finer meshes,
longer-duration checks, detector/PML sensitivity,
RCWA order convergence, other rays/wavelengths and material gradients remain
separate checks. FDTD is evaluated at real frequency, whereas the original
RCWA setting uses a small imaginary frequency regularizer. The additional
zero-nudge RCWA measurements expose that difference rather than silently
changing the original reference.

RTX 5880 measurements for the four FDTD rows were 30.60, 54.41, 64.64 and
127.63 seconds, with peak Torch CUDA allocations 76.4, 76.4, 467.6 and 467.6 MB. Timings
include two reference and two sample solves, plane preparation, calibration
and output reduction. They exclude input loading and density transfer. They
are not equal-accuracy performance comparisons against TORCWA or another FDTD
solver, and they do not include backward or an optimization iteration.

The public numerical records contain responses and input hashes, not the
private seed array. Reproduction requires that exact input. Source conversion
uses [arithmetic Yee-box density averaging](../PERIODIC_DENSITY_LAYER.md), which
is another convergence variable. See [TORCWA settings](cr-case-torcwa-sweep.json),
[50 nm short](cr-case-50nm-1600.json), [50 nm long](cr-case-50nm-3200.json),
[25 nm short](cr-case-25nm-3200.json), [25 nm long](cr-case-25nm-6400.json), and
[source hashes](cr-density-source-evidence.json).
