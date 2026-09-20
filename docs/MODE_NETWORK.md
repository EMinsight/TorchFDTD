# Fixed-mode opposing-port S matrices

`torchfdtd.mode_network.ModeNetwork` implements a bounded two-port network around the native modal source and plane adjoint. Each port can contain multiple validated modes. It runs one independent launch per incident channel and returns a complex matrix with outgoing channels on rows and incident channels on columns.

The supported physical arrangement has two opposing complete transverse-cell ports on one shared propagation axis. The transverse boundaries are periodic and the propagation axis uses CPML. Both exterior guides must have the same fixed isotropic nondispersive cross-section, repeated along the propagation axis for calibration. The material between the port neighborhoods may scatter and differentiate. This is not arbitrary multi-branch routing, unequal port cross-sections, anisotropic eigenmodes, transverse open/PML modes, or spatial streaming.

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

Material through both source/exterior guides and the detector neighborhoods must equal the same fixed calibration cross-section. The wrapper freezes these exterior material derivatives once per network invocation, without retaining a full-volume mask. Only the material between those neighborhoods differentiates. This includes the existing launcher's fixed-source material convention and excludes eigenmode/material derivatives at the ports.

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
