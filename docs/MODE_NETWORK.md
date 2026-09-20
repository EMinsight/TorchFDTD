# Fixed-mode opposing-port S matrices

`torchfdtd.mode_network.ModeNetwork` implements a bounded two-port network around the native modal source and plane adjoint. Each port can contain multiple validated modes. It runs one independent launch per incident channel and returns a complex matrix with outgoing channels on rows and incident channels on columns.

The supported physical arrangement has two opposing complete transverse-cell ports on one shared propagation axis. The transverse boundaries are periodic and the propagation axis uses CPML. Each exterior guide has its own fixed isotropic nondispersive cross-section, repeated along the propagation axis for its incident-channel calibration. The material between the port neighborhoods may scatter and differentiate. This is not arbitrary multi-branch routing, finite-aperture ports, anisotropic eigenmodes, transverse open/PML modes, or spatial streaming.

## Usage

```python
import torch
from torchfdtd import Project, Region, Source, Boundaries, BoundaryFace, AdjointOptions
from torchfdtd.mode_network import FixedModePort, ModeNetwork

boundaries = Boundaries(**{
    axis + "_" + side: BoundaryFace(kind="periodic")
    for axis in "yz" for side in ("min", "max")
})
project = Project(
    region=Region(dimension="3d", size=(8., 1., 1.), mesh=.2,
                  pml_cells=5, steps=600, material_sampling="yee",
                  boundaries=boundaries, precision="float32"),
    sources=[Source(kind="plane", normal="x", center=(-2., 0., 0.),
                    size=(0., 1., 1.), pulse_cycles=2)],
    monitors=[],
)
ports = (
    FixedModePort("left", -1., -2., +1, (0, 1)),
    FixedModePort("right", +1., +2., -1, (0, 1)),
)
network = ModeNetwork(project, ports, permittivity=2.25,
                      options=AdjointOptions(checkpoints=4), num_modes=2)
base = network.reference_epsilon(device="cuda")  # "cpu" also supported
mask = torch.zeros_like(base)
mask[19:21] = 1
parameter = torch.tensor(.35, device=base.device, requires_grad=True)
result = network(base + parameter * mask)
# Order: left mode 0, left mode 1, right mode 0, right mode 1.
loss = -result.s[2, 0].abs().square()
loss.backward()
```

`FixedModePort(name, coordinate_um, source_coordinate_um, direction, mode_indices)` fixes a detector phase plane and an exterior launch plane. Directions point inward, so the ordered left/right ports use +1 and -1. Coordinates are micrometres along the sole source template's normal. Port phase planes and source planes must lie on validated longitudinal Yee E-node planes. Sources must remain outside the phase planes and inside the native CPML separation rules. The template provides carrier wavelength, Gaussian pulse timing, and amplitude. The launcher replaces Cartesian polarization with the selected full-vector mode.

Mode indices are copied into immutable tuples. Changes to the project, ports, channel map, prepared launch projects, options, or other captured network configuration require rebuilding the network. They are rejected before calibration. Each invocation captures independent project and port metadata for backward. Eigensolver profiles, eigenvalues, source packets, detector sampling, and calibration are fixed. The current derivatives are first order only.

## Definition and normalization

For incident channel j, the matched straight-guide run measures the inward amplitude at that channel's phase plane. The sample run measures every outward channel at its own phase plane. All channels use positive unit sampled reduced E/H power, including the native longitudinal half-cell correction in the existing modal detector. The native plane DFT convention is `exp(+2 pi i f t)`.

The network uses

```text
S[i,j] = outgoing_sample[i] / incoming_reference[j]
```

At the excited port only, the matched guide's outward baseline is subtracted before dividing. This applies to every selected reflected mode at that port. At the opposite port, no reference transmitted field is subtracted. Consequently an unchanged guide retains `exp(+i beta distance)` in its through coefficient. It does not return through transmission one by removing propagation phase. Rows and columns share `result.channels`, and `result.port_coordinates_um` records the phase planes.

The sampled Hermitian power Gram matrix must be the identity within `gram_tolerance`, default `1e-4`. Dependent or significantly nonorthogonal mode sets are rejected. The matched launch must excite its selected inward channel with other selected inward amplitudes below `1e-3` relative amplitude. This is not a general nonorthogonal-basis least-squares detector. It cannot account for omitted channels automatically, and sums of selected modal powers need not capture radiation or all propagating modes.

Material through both source/exterior guides and the detector neighborhoods must equal the corresponding port's fixed calibration cross-section. The wrapper freezes these exterior material derivatives once per network invocation, without retaining a full-volume mask. Only the material between those neighborhoods differentiates. This includes the existing launcher's fixed-source material convention and excludes eigenmode/material derivatives at the ports.

## Execution and memory

Every invocation performs a fresh matched-guide calibration for every incident channel. There is no persistent calibration cache. Only compact incident and reflection coefficients are retained from these calibration solves, not their plane fields or solver graphs.

The sample columns use `recompute_cases`. Forward retains the compact complex matrix and the explicit design carrier. Backward reconstructs one case graph, applies its native checkpointed field adjoint, releases that graph, then proceeds to the next incident channel. A coupled objective on any entries of S therefore sums contributions without retaining all launch graphs. Deterministic replay is checked by `recompute_cases`. This saves graph memory at the cost of extra forward solves.

The budgets have distinct scopes:

- `AdjointOptions` applies to each native resident launch and its checkpoint workspace.
- `network_budget_bytes` bounds the retained launch packets and a conservative wrapper allowance for parameter carriers, gradients, calibration material, one plane-map construction, and modal overlap scratch. Available host memory is also checked. Eigensolver/library runtime, optimizer state, and caller material-construction graphs are outside this wrapper allowance.
- `output_budget_bytes` bounds the compact stacked matrix and is checked before calibration. The default matrix destination is CPU, with gradients transferred back to the material device by `recompute_cases`.

The default wrapper allowance is not a measured large-network peak-memory proof. Per-case and wrapper budgets are separate, so they must both fit the intended device/host capacity. There is no multi-case execution parallelism or network-level performance scaling claim.

## Verification and limits

`tests/test_mode_network.py` contains seven collected cases. The initial synthetic basis, contract, and physical tests passed together in 24.25 seconds. A later metadata/replay test passed with the other CPU tests. The added physical four-channel case passed separately in 8.14 seconds. The physical runs used the local RTX3060 with FP32, a 40 by 5 by 5 grid, 0.2 micrometre cells, 600 timesteps, a homogeneous epsilon 2.25 guide, detector planes at +/-1 micrometre, and source planes at +/-2 micrometres. CPU execution is supported by the same tests when CUDA is unavailable, but these recorded physical results were measured on CUDA.

- Two synthetic orthogonal modes recover independent complex forward/backward mixtures and their field gradients. A duplicate mode is rejected by the Gram check.
- Actual two-channel straight-guide propagation has complex phase error `2.9231e-6`.
- Actual four-channel straight-guide propagation, with two modes at each port, has maximum complex S-matrix error `2.9643e-6` against the expected same-mode transmission and zero cross-mode/reflection entries.
- A two-cell longitudinal epsilon increment of 0.35 produces reciprocal through entries with mismatch `8.43e-8`. Reciprocity does not require equal left/right reflection phases at distinct reference planes.
- For the complex objective `Re(S[right,left]) + 0.3 Im(S[left,right])`, the material derivative is `-0.2035041`. Central difference with epsilon step 0.004 gives `-0.2034902`, a relative difference of `6.82e-5`.
- The perturbed lossless column-power sums are approximately `1.00740268` and `1.00740254`. The 0.7403% defect is recorded, with a 1.5% acceptance threshold in the test. The contribution of spatial resolution, finite pulse/time, CPML, and calibration has not been separated. This is not a mesh-converged passivity or conservation result.
- A focused metadata test verifies tuple copying, per-invocation replay snapshots after later network mutation, and early budget/configuration rejection.

Further work includes separate spatial/time/PML convergence of complex S and conservation, more confined guided modes and intermode conversion, larger channel-count memory measurements, and calibrated ports with unequal cross-sections. Arbitrary physical multi-branch ports require source and boundary capabilities beyond this wrapper.


### Single finer-mesh conservation check

The unresolved coarse conservation defect prompted one additional physical run with `benchmarks/mode_network_refinement.py`. The compact record is `docs/validation/mode_network_refinement_3060.json`. It contains S entries, column powers, physical configuration hashes, measured driver/runtime hashes, project configuration, Yee sample coordinates, hardware, and timings.

Cell spacing was halved to 0.1 micrometre on an 80 by 10 by 10 grid. The timestep count increased from 600 to 1200 so physical duration stayed fixed. CPML increased from 5 to 10 cells so its physical thickness stayed at 1 micrometre. Domain, source and detector planes, Gaussian carrier timing, and the physical perturbation `-0.2 <= x < 0.2` micrometre remained fixed. The perturbation was sampled separately at each electric component's actual Yee coordinate.

| Quantity | Historical coarse | Finer run |
| --- | --- | --- |
| Left-incident column power | 1.0074026846 | 1.0000046492 |
| Right-incident column power | 1.0074025401 | 1.0000046492 |
| Maximum absolute power defect | 0.0074026846 | 0.0000046492 |
| Reciprocal through-amplitude mismatch | 8.43e-8 | 1.12e-8 |

The defect decreased by about 1,590 times, from 0.7403% to 0.000465%. The finer network invocation, including its fresh calibration solves, took 5.05 seconds on the local RTX3060. No gradient or broad unchanged test suite was rerun for this check. Historical coarse source hashes and individual solve timing were not recorded contemporaneously, so those fields remain explicitly unavailable. The record preserves its original measured S entries and labels the reconstructed physical configuration separately.

This single refinement bounds the earlier conservation concern. It does not establish an asymptotic convergence rate or isolate bulk spatial error from CPML discretization error. The left-to-right complex transmission changes from `0.82772577 + 0.56582451i` to `0.99815458 - 0.04790314i`, an absolute change of about 0.637, so the near-unit fine column power must not be described as convergence of the full S matrix. Coarse acceptance thresholds and recorded defects remain unchanged.


After that measurement, an admission-only guard was extended to reject changes to the public propagation-axis index before calibration. The measured JSON and its source hashes were preserved. `docs/validation/mode_network_refinement_guard_followup.json` records this change and the measured/current source hashes. Exact measured source bytes were also saved privately under `.local/mode_network_measured_refinement.py`. The targeted axis/port mutation regression was run without repeating physical solves.


The subsequent bounded continuum/discrete-oracle analysis and one 0.05 micrometre run are documented in [MODE_NETWORK_SLAB_ORACLE.md](MODE_NETWORK_SLAB_ORACLE.md). They explain the large through-phase change as expected numerical dispersion while retaining a 0.0426-radian continuum phase error on the finest measured mesh.


The [physical-gradient direction diagnostic](MODE_NETWORK_SLAB_ORACLE.md#remaining-physical-gradient-direction-gate) exposes an additional limitation of the coarse material-gradient check. For the same complex S objective, its measured native adjoint is negative while the independent continuum derivative is positive. Scalar step halving confirms this difference. A subsequent native forward/backward at each of 0.1 and 0.05 micrometre gives gradients +0.17989309 and +0.23723969, agreeing with the discrete oracle within 0.00181% and 0.000124%. Both recover the continuum sign, but their continuum magnitude errors remain about 29.1% and 6.50%. These results establish the bounded direction check, not general shape-gradient convergence or a measured optimization step. Agreement with a same-mesh native finite difference alone does not establish a continuum improvement direction.

A further [25 nm acceptance run](MODE_NETWORK_GRADIENT_ACCEPTANCE.md) retains those records and uses a predeclared 2% material-gradient criterion. It measures a 1.58% continuum derivative error and an actual native loss decrease for a fixed epsilon decrement, matching the continuum descent direction. This is a fixed-slab material result, not general shape or CR acceptance.

## Unequal opposing cross-sections

The legacy `ModeNetwork(project, ports, permittivity=...)` call uses one section
at both ports. Alternatively, omit `permittivity` and pass
`port_permittivities={"left": 1.0, "right": 1.44}`. Keys must exactly match the
port names. Values use the native eigensolver's scalar or callable
`epsilon(u_um, v_um)` contract. Passing both APIs is an error. Trainable tensor
values or callable results are rejected. The material profiles, modes and
calibration remain fixed and do not support eigenmode differentiation.

```python
network = ModeNetwork(project, ports,
    port_permittivities={"left": 1.0, "right": 1.44})
epsilon = network.reference_epsilon(port="left", device="cpu")
# This example uses the 40-cell x grid from the usage example above.
epsilon[20:] = 1.44
epsilon.requires_grad_()
result = network(epsilon)
(-result.s[2, 0].abs().square()).backward()
```

For the explicit map API, `reference_epsilon` requires a port name. It returns
that port's straight calibration guide, not a device joining the two sections.
Construct the transition separately inside the admitted design region. The
left fixed region extends through index `left_index + 1`; the right starts at
`right_index - 1`. These include each detector stencil, its source and the
normal-side CPML. Exterior material cotangents are exactly zero. Interior
cotangents retain the caller's PyTorch graph.

Each calibration projects only its incident plane into that port's own basis.
It never projects a straight left-guide reference onto a mismatched right-guide
basis. The sample uses each receiving port's own power-normalized basis. Only
one full calibration epsilon exists at a time, with no full NumPy temporary.
The wrapper reservation includes this volume, and the result reports its actual
`calibration_volume_bytes` and `calibration_volume_limit=1`. Compact calibration
coefficients are retained per channel; no calibration volume enters a case
closure or a persistent cache. The two ports still occupy the same complete
transverse periodic cell. Finite apertures, transverse PML and non-opposing
ports remain unsupported.

`tests/test_mode_network_unequal.py` is explicitly CPU-only. Its public synthetic
normal-incidence dielectric interface checks independently calculated Fresnel
powers, reciprocity, a central finite-difference interior material derivative,
and exactly zero exterior cotangents. Coarse-grid Fresnel tolerances are absolute
0.012 for reflection and 0.025 for transmission power, rather than a continuum
convergence claim. No unequal-port GPU or scaling measurement is claimed.

Focused validation: the new contract check passed, the physical CPU check passed
in 26.63 s, and the reference-lifetime regression passed in 3.91 s. Two legacy
CPU admission/replay cases passed in 4.13 s. The interface material VJP was
-0.3092645 versus central finite difference -0.3092736. The measured through
coefficients were approximately -0.98088+0.16792i and -0.98052+0.16793i.
These checks do not establish arbitrary waveguide-transition accuracy.

### Independent discrete complex-S acceptance

The original continuum power tolerances above are retained as historical
evidence. They admit zero reflection and unit transmission because the
continuum reflectance is only 0.00826446. A subsequent gate therefore requires
absolute complex error at most 0.004 in every S entry, including reflection
phase. This threshold was declared before the new native measurement. It was
not relaxed after the original configuration failed.

`benchmarks/mode_network_unequal_oracle.py` independently solves the scalar
normal-incidence Yee interface equations. With `kappa = 2 sin(omega dt/2)/C`,
the transverse electric samples obey

```text
E[j+1] - (2 - epsilon[j]*kappa**2)*E[j] + E[j-1] = 0
q = 2 asin(sqrt(epsilon)*kappa/2)
```

The first right-medium transverse E sample is index 20 at x = 0 um in the
original 40-cell grid. No interface displacement is fitted. For left incidence,
the equations at j = -1 and j = 0 give `t = 1 + r` and
`exp(-i q_left) + r exp(i q_left) = t exp(-i q_right)`. The reciprocal incidence
is solved separately. Both phase planes remain at -1 and +1 um.

Native temporal DFT offsets align H's half timestep. Spatial interpolation at
an electric-node plane averages its two adjacent magnetic half-cell samples.
The sampled admittance is therefore `Y = sqrt(epsilon)*cos(q/2)`, and electric
transmission amplitudes convert to the port power amplitudes with
`sqrt(Y_out/Y_in)`. The scalar algebra tests check both interface recurrences,
unitarity, reciprocity, the uniform-medium phase limit and rejection of a
reflectionless negative control. The latter differs from this oracle by more
than twenty times the new tolerance.

The [original complex-S record](validation/mode_network_unequal_interface_cpu.json)
preserves its failed gate. Its two reflection errors were 0.0145389 and
0.0146498, while its transmission errors were 0.00174341 and 0.00140824. This
was not a native modal-basis mismatch. Prepared q values agreed with the
independent dispersion within 1.3e-7 rad/cell, and detector H/E ratios agreed
with the collocated admittances within 3.3e-7.

`benchmarks/mode_network_unequal_cpml.py` isolates the boundary effect without
additional time-domain solves. It assembles a scalar harmonic E/H linear
system using native CPML coefficients and actual source-packet DFTs as data.
Each auxiliary response is eliminated with
`stretch = 1/kappa_cpml + c/(1-b*exp(i omega dt))`. Independently assembled
spatial differences, collocation and matched-reference subtraction reproduce
the original measured S within 6.25e-7. Replacing only the outer response with
exact discrete outgoing-wave impedances, while retaining the actual source
packets and native basis, recovers the infinite-interface oracle within
1.30e-8. The original runtime correctly solves its finite problem. Its coarse
five-cell CPML approximation does not meet this stricter open-boundary gate.

One physically defined harmonic trial increased the domain from 8 to 12 um and
PML thickness from 5 to 15 cells, or 1 to 3 um. Mesh spacing remained 0.2 um,
the interface remained at zero, source planes remained at -2 and +2 um, and
the detector planes remained at -1 and +1 um. The same 600 steps and timestep
preserved the 228.789 fs duration. No conductivity fitting or further trials
were used. The harmonic model predicted maximum complex error 1.27537e-5.

The sole [native CPU followup](validation/mode_network_unequal_cpml_followup_cpu.json)
then measured maximum complex error **1.29257e-5**, passing the unchanged
**0.004** criterion. Its maximum difference from the finite-CPML harmonic
prediction was 3.40e-7. Native network forward time was 3.614 s. The measured S
was approximately

```text
[[-0.04519371 - 0.10335823i, -0.97922677 + 0.16848989i],
 [-0.97922701 + 0.16849007i,  0.00807118 - 0.11251775i]]
```

Both records contain raw complex matrices, per-entry errors, source hashes and
the exact physical configuration. The followup also links the unchanged failed
record by SHA256 and records the sole harmonic trial. The new physical test
uses this lower-reflection configuration, while the original coarse power and
VJP checks remain unchanged. No additional VJP/finite-difference run, GPU solve,
mesh refinement or arbitrary waveguide-transition acceptance is implied.
