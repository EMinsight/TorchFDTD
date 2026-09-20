# Native modal injection and directional port calibration

The experimental `torchfdtd.mode_injection` API launches a fixed full-vector
waveguide mode through the existing resident Yee/CPML solver and its checkpointed
adjoint. It prepares electric and magnetic Huygens sheets rather than running a
separate propagation solver. Actual homogeneous and slab-guide FDTD propagation,
complex directional amplitudes and a scattering-material objective derivative
are recorded in `docs/validation/mode_injection_3060.json`.

```python
from torchfdtd import AdjointOptions
from torchfdtd.mode_injection import (
    prepare_modal_launch, ModeInjectedPlaneSimulation, modal_s_parameters,
)

# project has one Gaussian plane source, field-plane monitors and a uniform
# 3D mesh. epsilon_at_uv describes the fixed launch waveguide cross-section.
launch = prepare_modal_launch(project, epsilon_at_uv, mode_index=0)
model = ModeInjectedPlaneSimulation(project, launch, AdjointOptions(checkpoints=8))
frequency = [299792458 / (launch.mode.wavelength_um * 1e-6)]
reference = model(reference_epsilon, frequency)
sample = model(design_epsilon, frequency)
port = modal_s_parameters(sample['transmission'], reference['transmission'], launch)
loss = port['transmission'].abs().square().sum()
loss.backward()
```

The actual arrays supplied to the model have shape `region.shape + (3,)`, with
permittivity sampled at each electric component's native Yee location. Construct
the reference without a gradient graph if only the design is to be differentiated.
The returned modal coefficients retain gradients through both sample and
reference fields when both are differentiable.

## Supported contract

The current source supports uniform 3D real-valued, nondispersive Yee simulations,
with periodic transverse boundaries and CPML at both longitudinal ends. The
launch material is an isotropic scalar or one isotropic function of the two
cyclic transverse coordinates. Source and detector planes cover the full
transverse cell. Directions plus and minus and normals x, y and z are implemented.
Homogeneous propagation is validated for x+/x-/y+/z+, and a dielectric slab guide
is validated for x+.

The project must contain exactly one enabled soft Gaussian plane source with
cycle-based timing and at least two carrier cycles. Its normal, direction,
position, size, amplitude, phase and pulse settings determine the launch. Its
Cartesian polarization setting is replaced by the selected full-vector mode.
The source must lie on a longitudinal electric-node plane, away from CPML.
The existing `oneway_plan` geometry rules establish the cut and clearance.

The source cross-section is fixed. The solver checks all three Yee permittivity
components in the three-cell injection neighborhood against that cross-section
on every solve. A changed source neighborhood is rejected. Material gradients in
that neighborhood are explicitly frozen to zero, and this restriction appears
in the result report. Design changes must stay outside it. This includes the
inverse-permittivity factor in the electric source increment, not just the
mode profile. Mode eigenvalues, mode shapes and source-current profiles do not
have material derivatives.

Graded meshes, complex/Bloch transverse modes, dispersive/PML transverse modes,
TFSF and arbitrary time signals are rejected. Streamed execution is not yet
supported by this source wrapper. The underlying plane quadrature must be a
complete uniform midpoint tensor product with positive uniform SI area weights.
Detectors must lie on longitudinal electric-node planes. General offset planes
and cropped/nonuniform quadrature are not accepted for modal extraction.

## Discrete phase and Huygens increments

The native source ordering updates and injects E first, then H. At step j, the
new electric field is at (j+1) dt and the new magnetic field is at (j+3/2) dt.
The electric source correction therefore uses old H at (j+1/2) dt. The magnetic
source correction uses new E at (j+1) dt.

For physical carrier omega, the mode solver uses the temporal discrete wavenumber

k_t = 2 sin(omega dt/2) / (c dt).

All wavenumbers passed to the mode solver use inverse micrometres. Solve the
existing transverse vector eigenproblem using effective wavelength 2 pi/k_t.
If its longitudinal eigenvalue is beta_tilde, the physical longitudinal Yee phase
is recovered through

beta = 2 asin(beta_tilde h_w/2) / h_w.

Modes outside the longitudinal propagation band are rejected. For a forward
cut at electric index k, the magnetic correction lies at k-1. The incident H
needed by the electric update is at w_k-h_w/2 and receives exp(-i beta h_w/2).
The backward cut instead uses magnetic index k and the reciprocal backward-mode
fields. The same phase factor represents its outward half-cell displacement.

With direction d equal to plus or minus one, the fixed sheet increments are

Delta E_t = -d c dt / (h_w epsilon_t) [w cross H_inc]_t,

Delta H_t = +d c dt / h_w [w cross E_inc]_t.

Each complex spatial profile is split into real cosine and imaginary sine
terms using the existing Gaussian waveform generator. This produces real-valued
source increments under the exp(i beta w - i omega t) convention. The prepared
terms feed native `_System.sources`, so native forward injection and the existing
field/material transpose remain the execution path.

Source-table admission occurs before source waveform allocation. Resident
admission additionally charges fixed packets, preparation/copy headroom and the
full epsilon carrier used to freeze the source-neighborhood gradient. This
admission precedes source-neighborhood arrays and the full epsilon clone. The
extra reservation and source storage are included in the result report. Sparse
CPU mode factorization still follows the separate limitations in `mode_ports.md`.

## Detector convention and complex calibration

Native `DifferentiablePlaneResult` already corrects the E/H temporal staggering
with its positive-time DFT. A detector on an electric-node plane interpolates
normal-half-cell components from both sides. The corresponding mode components
E_w and H_t are therefore multiplied by cos(beta h_w/2) before overlap. Ignoring
this longitudinal interpolation factor would bias the forward/backward
separation even for a pure propagating mode.

`modal_plane_amplitudes` returns complex positive-axis and negative-axis modal
amplitudes. Their units retain the time-integral DFT factor in seconds relative
to the fixed unit reduced-power mode. `modal_s_parameters` divides by the matched
reference amplitude travelling in the source direction. A minus launch therefore
uses the negative-axis amplitude as incident.

The returned transmission coefficient is the sample amplitude divided by the
reference amplitude at the same detector. An unchanged guide has t=1, with its
reference propagation phase removed. Reflection subtracts the matched
counterpropagating baseline before division. Its phase is referenced to that
measurement plane. Use a detector before the scatterer for reflection and one
after it for transmission. The API provides one selected-mode channel, not a
complete automatically assembled multimode S matrix. Separate fixed modes can
be projected with `modal_plane_amplitudes`, but cross-mode power normalization
and a full multiport sweep are not claimed here.

The implementation rescales common spectral fields before complex division,
keeping physical FP32 DFT scales from overflowing backward seeds. Zero or
unsupported incident modal references are rejected. Reference sampling and run
signatures must match. The launch identity is included in the run signature.

## Actual FDTD evidence

Run the bounded GPU study with

`python -m benchmarks.mode_injection --output docs/validation/mode_injection_3060.json`

It ran on the local RTX 3060 in FP32. No remote jobs were used. Each case uses a
0.1 micrometre mesh, 1300 steps, a 247.855 fs window, a two-cycle Gaussian pulse
and an 0.8 micrometre longitudinal CPML. The homogeneous region has epsilon 2.25.
The slab core has epsilon 4, cladding epsilon 2.25 and thickness 0.5 micrometres.
The carrier wavelength is 1.55 micrometres. Propagation is measured between planes
2 micrometres apart and compared with exp(i beta times 2 micrometres).

| Actual native run | Complex propagation error | Counterpropagating power | Other-mode power |
| --- | --- | --- | --- |
| Homogeneous x+ | 8.72e-7 | 2.91e-9 | 1.92e-16 |
| Homogeneous x- | 8.97e-7 | 2.95e-9 | 9.18e-16 |
| Homogeneous y+ | 8.43e-7 | 2.92e-9 | 1.96e-16 |
| Homogeneous z+ | 8.43e-7 | 2.91e-9 | 1.61e-16 |
| Slab guide x+ | 2.24e-5 | 2.14e-7 | 1.84e-12 |

Outside-source power relative to the incident guide mode is below 2.89e-9 for
the homogeneous cases and 1.95e-7 for the slab guide. These finite-window values
include pulse truncation and CPML reflection. They are not a claim of exact
zero reflection at every frequency.

The measured homogeneous numerical effective index is 1.520606, rather than the
continuum value 1.5. This coarse-grid difference is expected numerical dispersion
and is deliberately retained in both source and propagation comparison. The
source benchmark does not replace a continuum mesh-convergence study. The
separate fixed-mode foundation documents slab eigenmode mesh and box convergence.

For a local 240-cell dielectric perturbation away from the slab-guide source,
Delta epsilon = 0.3 gives

t = 0.9899917 + 0.1133046 i,

r = 0.00153558 - 0.00193118 i,

|t|^2 = 0.9929214.

The native checkpointed material adjoint gives d|t|^2/dDelta epsilon = -0.03968025.
A centered difference with step 0.003 gives -0.03971656, a relative discrepancy
of 9.14e-4. This is an actual FDTD scatterer and objective gradient, not a
synthetic overlap-only test. The unaccounted power cannot be inferred solely
from this one guided channel and may include radiation or other modes.

Four fast CPU contract tests pass. The GPU acceptance test calls the same five-case
propagation and scattering validation used by the recorded benchmark. This
bounded experiment establishes the stated fixed-mode source/detector scope.
It does not establish arbitrary broadband modal launch, production multiport
or multimode parity, open/PML eigenmode support, or source/eigenmode material
optimization.

The admission-only followup in `mode_injection_admission_followup.json` records
an explicit host-budget guard added after the physical runs. For this modal API,
`host_budget_bytes` limits the complete admitted host footprint, including the
modal packet and the gradient-freezing epsilon carrier. Rejection occurs before
material validation arrays or the full epsilon clone. The targeted CPU regression
failed before the guard and passes with it. The original GPU report and its
source hashes remain unchanged. The followup records the updated source hash
without presenting it as the source used for those earlier measurements.
