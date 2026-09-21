# Fixed full-vector mode-port foundation

`torchfdtd.mode_ports` solves a coupled vector Maxwell eigenproblem on a uniform
2D transverse Yee mesh. This is a CPU sparse eigensolver with periodic transverse
boundaries. It supplies propagation constants, six-component fields, signed
power normalization, component-aware interpolation and a differentiable fixed-mode
plane objective. The time-domain layers built on it are documented
separately: [fixed modal injection](MODE_INJECTION.md), [opposing two-port
networks](MODE_NETWORK.md), [open transverse CPML ports and N-port aperture
networks](OPEN_MODE_PORTS.md) and the [GDS adapter](GDS_MODE_PORTS.md).

```python
import numpy as np
from torchfdtd.mode_ports import solve_waveguide_modes, normalized_mode_power

modes = solve_waveguide_modes(
    lambda u, v: np.where((abs(u) < .4) & (abs(v) < .25), 4., 2.25),
    shape=(40, 32), spacing_um=(.1, .1), wavelength_um=1.55,
    normal='x', num_modes=2,
)
# sample and reference are DifferentiablePlaneResult at this one frequency.
# objective = normalized_mode_power(sample, reference, modes[0]).sum()
# objective.backward()
```

The material input is a positive real scalar or one isotropic function
`epsilon(u_um, v_um)`. The same function is sampled independently at the three
electric-component Yee locations. Arbitrary anisotropic tensors, loss,
dispersion, transverse Bloch phase, graded meshes and evanescent/zero-power
mode normalization are excluded. The eigenmode calculation has no Torch graph.
`normalized_mode_power` preserves gradients with respect to both sample and
reference plane fields. It does not differentiate the eigenvalue or mode profile
with respect to permittivity.

## Discrete vector formulation

For port normal w, choose cyclic transverse axes u and v so that (u,v,w) is
right-handed. For normal x these are y and z. The six transverse offsets are

| Component | u offset | v offset |
| --- | --- | --- |
| Eu | 1/2 | 0 |
| Ev | 0 | 1/2 |
| Ew | 0 | 0 |
| Hu | 0 | 1/2 |
| Hv | 1/2 | 0 |
| Hw | 1/2 | 1/2 |

They match native `solver.field_axes` restricted to the transverse coordinates.
Periodic forward differences D+ map node to half-cell locations and backward
differences D- map half-cell to node locations, with D- = -(D+) transpose.
All lengths in the sparse operators are micrometres, so k = 2 pi/lambda and beta
have units of inverse micrometres.

The phasor is exp(i beta w - i omega t), with reduced magnetic field H. Maxwell's
curl equations are curl E = i k H and curl H = -i k epsilon E. The longitudinal
fields are recovered as

Ew = i epsilon_w^-1 (Du- Hv - Dv- Hu) / k,

Hw = -i (Du+ Ev - Dv+ Eu) / k.

Substitution into the other four curl equations gives beta Et = P Ht and
beta Ht = Q Et. The solver forms the sparse coupled system P Q Et = beta^2 Et.
Both transverse polarizations and their coupling remain in this 2N-dimensional
system. It is not a scalar TE approximation. Ht is recovered through Q Et/beta.
The implementation records both the squared eigenpair residual and a separate
residual of all six original Maxwell curl equations.

This follows the general full-vector Yee formulation described by
[Yu and Chang, Optics Express 12, 6165–6177 (2004)](https://scholars.lib.ntu.edu.tw/bitstreams/03e92674-2584-4295-b66e-186eb068e28a/download).
That paper also treats PML and interface corrections. Those features are not
implemented here. The present code directly assembles its stated periodic
isotropic curl operators and uses simple component-sampled permittivity.

FP32 matrices, eigenvectors and output fields are the default. SciPy ARPACK uses
shift-invert near `target_neff`, or just above the maximum material index by
default. The solve requests extra candidate eigenvectors to handle repeated
polarization eigenvalues, then selects the requested modes nearest the shift.
Degenerate modes are orthogonalized using their Hermitian power pairing and
then rotated onto a canonical basis: within one equal-beta cluster the modes
diagonalize the overlap of their Eu components, ordered by descending Eu power,
so a uniform or square section returns the u-polarized mode first and the
v-polarized mode second on every machine. ARPACK alone returns an arbitrary
basis of such a cluster, and that basis differs between BLAS builds and CPUs:
before this rule the two ports of a uniform interface network received
orthogonal polarizations on one workstation and reported no transmission. A
cluster whose Eu overlaps are themselves equal keeps its orthogonalized
basis. The requested subset is not a proof of complete mode enumeration for
every guide.
`precision='float64'` is available for targeted numerical diagnostics. No FP64
solve was required for the recorded validation. Sparse LU fill-in can consume
substantial CPU memory. This solver does not inherit the streamed FDTD memory
budget guarantee.

## Power and directional overlap

Native signed power is the transverse sum of
0.5 Re(Eu Hv* - Ev Hu*) times the SI cell area. Each product uses matching
transverse Yee locations. Forward modes have positive beta and unit positive
reduced power. `mode.backward()` reverses beta, Hu, Hv and Ew, retaining Eu, Ev
and Hw. Its power is minus one. Reduced power is not labelled as physical watts.

`sample_plane` bilinearly interpolates each component from its own periodic Yee
locations to a common reference plane. The frequency-domain profile is already
co-phased in the longitudinal coordinate. It has no FDTD half-cell propagation
phase or discrete temporal/longitudinal dispersion correction. Native
`DifferentiablePlaneResult` uses the positive-time Fourier kernel, so these
exp(-i omega t) phasors have the matching time convention. Tests compare the
interpolation to native `interpolation_map` and explicitly check the E/H
half-time-step Fourier convention.

For collocated forward-mode fields (Em,Hm) with quadrature power Pm, the forward
and backward amplitudes are

a+ = integral[(E cross Hm*) + (Em* cross H)] dot w / (4 Pm),

a- = integral[(E cross Hm*) - (Em* cross H)] dot w / (4 Pm).

The objective returns |a_sample/a_reference,+|^2 in the selected direction.
It rescales fixed basis fields, the reference field scale and quadrature weights
before division to keep photonic SI-scale FP32 derivatives finite. The reference
scale is detached, while the reference amplitude retains its graph. Its fixed
mode must have positive beta and the same single frequency as both planes.

The supported quadrature is deliberately narrow: one complete uniform midpoint
tensor product over the mode supercell, at least two points per transverse axis,
with uniform positive SI cell-area weights. Both planes must have identical
coordinates, weights, frequency and run signature. Duplicate points, shifted or
cropped coverage, and nonuniform weights are rejected even when their total
area matches. General clipped/nonuniform plane quadrature remains future work.

## Recorded CPU validation

Run `python -m benchmarks.mode_ports_limits --output docs/validation/mode_ports_cpu.json`.
The record includes source hashes, versions, residuals and synthetic field-VJP
evidence. `python -m pytest tests/test_mode_ports.py -q` passes 10 targeted tests.

The six homogeneous modes agree with the independent periodic Yee dispersion
relation, including the repeated polarization and sine/cosine eigenspaces.
Their power Gram matrix differs from the identity by at most 1.68e-7.

A symmetric slab with epsilon_core = 4, epsilon_cladding = 2.25, thickness
0.5 micrometres and wavelength 1.55 micrometres has independent continuum
TE0/TM0 effective indices 1.80765916 and 1.73723117. Both are solved from the
coupled vector matrix, then compared to scalar analytic slab dispersion roots.
The discontinuity value is assigned the arithmetic mean exactly on an interface.

| Mesh (um), box width 4 um | TE0 index error | TM0 index error |
| --- | --- | --- |
| 0.100 | 0.00513142 | 0.00821360 |
| 0.050 | 0.00078671 | 0.00159765 |
| 0.025 | 0.00019599 | 0.00040141 |

At fixed 0.05 micrometre mesh, enlarging the transverse box from 4 to 6
micrometres changes the two indices by at most 9.35e-7. Both satisfy
n_cladding < n_eff < n_core, so the exterior solution is evanescent. In the
6 micrometre box, the outer three cells at each transverse edge contain at
most 3.27e-9 of the sum of squared six-component field amplitudes. These checks
support the isolated-slab interpretation for this padded supercell. They do
not turn the periodic solver into an open boundary solver.

The largest six-curl residual in these slab runs is 1.10e-5. A nonseparable
rectangular dielectric core produces hybrid modes with all six components
nonzero, and Maxwell residuals below 4.8e-6. That case checks vector coupling,
not an independent propagation-constant reference.

For synthetic superpositions on the native plane-result interface, undesired
forward/backward power is zero at reported FP32 precision and cross-polarization
power is 1.80e-16 in the homogeneous validation. A complex plane-field directional
VJP is -0.28886348 versus a centered difference of -0.28896332, giving relative
error 3.46e-4 at step 0.001. Separate analytic amplitude tests check both sample
and reference gradients. These are synthetic overlap tests, not measured FDTD
reflection or source cross-polarization results.

Bounded source-current construction, longitudinal and temporal Yee
phase/dispersion matching, incident calibration, mode-launched propagation
tests and FDTD reflection/transmission and objective-gradient validation live
in the injection and network layers listed above. `prepare_aperture_modal_launch`
applies this periodic solver to a transverse sub-rectangle of the cell, with
the mesh origin at the rectangle corner, and gates the result on the squared
amplitude in the outermost cell ring. Open/PML transverse modes are a separate
solver in `open_mode_ports`. Eigenmode derivatives with respect to
permittivity remain unimplemented in every layer.

The numerical record retains the exact source hashes measured before a
line-ending cleanup. No numerical run was repeated for that cleanup.
`validation/mode_ports_source_normalization.json` records the measured and LF
source hashes and the original inclusive CRLF line ranges. First restore the recorded number of removed trailing LF bytes, then replace
LF with CRLF only on the recorded lines to reconstruct the measured source
bytes exactly.
