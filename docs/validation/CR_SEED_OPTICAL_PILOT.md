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
| FDTD 16.67 nm, 9600 steps | 0.269447 | 0.189952 | 0.203641 | 0.311875 |

At equal physical duration, the maximum channel discrepancy relative to the
original TORCWA setting decreased from 0.04682 to 0.00711 when mesh spacing
was halved. This is an encouraging convergence trend, not a validated error
bound. Doubling the duration at 50 nm changed the unpolarized response by up
to 0.00133. At 25 nm, doubling duration changed a channel by 0.00105 and left a maximum
discrepancy of 0.00816 against the original TORCWA setting. Finer meshes,
longer-duration checks, detector/PML sensitivity,
RCWA order convergence and other rays/wavelengths remain
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

## Finer mesh continuation

The 120 x 120 x 498 grid with 9600 steps has the same physical duration as
25 nm / 6400 steps and 50 nm / 3200 steps. Its maximum unpolarized channel
discrepancy against the original RCWA setting is 0.001460. Runtime was 795.79 s
and peak Torch CUDA allocation 1,514,204,160 bytes on RTX 5880. The raw
[16.67 nm record](cr-case-16p67nm-9600.json) was measured with the `5465ffd`
runner, before the explicit PML CLI/metadata addition. All of these initial
mesh runs use 12 PML cells, so physical PML thickness changes with mesh.
Their trend is not an isolated interior-grid convergence proof. A separate
[relaxed-pattern derivative check](CR_DENSITY_ADJOINT_PILOT.md) validates one
discrete directional derivative, not the converged physical gradient.

## PML thickness control at 25 nm

At 25 nm / 3200 steps on RTX 3060, changing PML from 12 to 24 cells
(0.3 to 0.6 micrometres) changed the unpolarized response by at most 8.65e-7.
The 12-cell cross-device response agrees with RTX 5880 within 3e-8. This
controls PML thickness for one mesh/duration, not all conditions. The timing
records are diagnostic and are not used for a performance claim. A brief
local CUDA test may have overlapped the end of the 24-cell measurement.
See [12 cells](cr-case-25nm-3200-pml12-3060.json) and
[24 cells](cr-case-25nm-3200-pml24-3060.json).

## Pixel-origin control

TORCWA's material convolution uses normalized FFT samples without an explicit
half-pixel phase or pixel-box sinc factor. The shared density array therefore
does not by itself establish identical continuous geometry. The optional
`sample_centers` convention shifts the piecewise-constant FDTD pixels by half
a source pixel in both axes. At 25 nm, 3200 steps and 24 PML cells on RTX 5880,
this gives a maximum channel discrepancy of 0.006839 against the original
TORCWA setting, compared with 0.007112 for `cell_edges`. The origin change
alters a channel by up to 0.003625. It does not resolve optical convergence.
Even centered box pixels retain sinc factors absent from the normalized DFT.
The default remains `cell_edges`, preserving preceding measurements.
See the [sample-center record](cr-case-25nm-3200-pml24-centers.json).
