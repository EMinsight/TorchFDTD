# Open transverse guided-mode ports

The runnable [inverse-design example](../examples/open_waveguide_inverse.py)
connects fixed open ports to a bounded scalar design variable and PyTorch Adam.

`OpenPortOptions` enables fixed bound modes on transverse CPML boundaries in
`ModeNetwork`. The mode solve, source sheets, detector collocation and material
adjoint use the same native Yee grid and discrete CPML recurrence. The Python
API supports one or two open transverse axes. A remaining transverse periodic
axis has zero Bloch phase. Two opposing ports share one propagation axis.

```python
import numpy as np
import torch
from torchfdtd import (
    Project, Region, Source, AdjointOptions,
    FixedModePort, ModeNetwork, OpenPortOptions,
)

project = Project(
    region=Region(dimension="3d", size=(8., 4., 4.), mesh=.1,
                  pml_cells=8, steps=1300, material_sampling="yee",
                  precision="float32"),
    sources=[Source(kind="plane", normal="x", center=(-2., 0., 0.),
                    size=(0., 2.4, 2.4), pulse_cycles=2)],
    monitors=[],
)
ports = (FixedModePort("left", -1., -2., +1),
         FixedModePort("right", +1., +2., -1))
section = lambda y, z: np.where(y*y+z*z < .4**2-1e-10, 2.2**2, 1.)
network = ModeNetwork(project, ports, section,
                      AdjointOptions(checkpoints=8), num_modes=1,
                      open_ports=OpenPortOptions(cladding_epsilon=1.))
epsilon = network.reference_epsilon(device="cuda")
mask = torch.zeros_like(epsilon)
mask[38:42, 17:23, 17:23] = 1
parameter = torch.tensor(.3, device=epsilon.device, requires_grad=True)
result = network(epsilon + parameter * mask)
loss = result.s[1, 0].real + .3 * result.s[0, 1].imag
loss.backward()
print(result.s, parameter.grad)
```

Lengths are micrometres. The timing source and detector span the complete
physical rectangle inside CPML. The dedicated launch packet also carries the
full computational-plane modal tails. Ordinary plane-source aperture validation
is preserved. The propagation axis has CPML on both ends. Every open transverse
axis has CPML on both ends and a homogeneous cladding collar extending one cell
into the physical domain. Asymmetric transverse CPML depths are supported by
the aperture geometry. The grid is uniform, rectangular, real FP32, with
staircase isotropic nondispersive material sampled independently at all three
electric Yee positions. Sparse operators and mode profiles are complex64.

`solve_open_waveguide_modes` exposes the standalone fixed mode solver.
`prepare_open_modal_launch` and `ModeInjectedPlaneSimulation` expose individual
launches and differentiable spectral planes. `modal_plane_amplitudes` returns
signed forward/backward amplitudes, and `modal_s_parameters` uses a matched
incident reference. `ModeNetwork` retains physical propagation phase and uses
fresh calibration followed by one recomputed adjoint column at a time.

## Admission, power and derivatives

The solver uses the harmonic response of the actual native CPML recurrence,
including distinct forward/backward destination rows. It retains complex beta
and rejects modes below the cladding light line, excessive attenuation,
insufficient confinement, nonpositive physical power and large six-field
Maxwell residuals. Physical power excludes artificial PML volume. Midpoint
detector quadrature must cover the full physical rectangle, with positive SI
area weights. Interpolation never wraps across an open boundary.

Mode profiles, eigenvalues, source tables and port calibration remain fixed.
Only material inside the design region differentiates. Source neighborhoods,
both exterior guides and transverse CPML collars have exactly zero material
gradient. Packet arrays have immutable bytes storage. Configuration changes
require rebuilding the network and are rejected before calibration.

The sampled forward and reverse Gram blocks are checked at the actual detector
quadrature before any volume fields are allocated. Each forward mode must have
positive unit power, different selected modes must be orthogonal, and their
backward overlap must vanish within the declared tolerance. A matrix of
selected modal powers does not automatically include radiated or omitted modes.

Numerically degenerate eigenvectors may be orthogonalized only within a
beta-tilde cluster with relative separation at most
`min(4e-5, max(64*eps32, 4*tolerance))`. The mixed fields must pass fresh
eigenpair and six-field residual checks. Rank-deficient clusters or
nonorthogonal modes with distinct propagation constants are rejected.
Polarization identity is repeatable for the tested software stack and grid,
not guaranteed invariant under mesh or platform changes.

`mode_budget_bytes` is a conservative dense-fill engineering reservation for
the sparse shift-invert solver and its workspace. It is checked against live
host capacity before sampling or sparse allocation. It is not a promise about
SciPy/BLAS process RSS. `source_budget_bytes`, `network_budget_bytes` and native
`AdjointOptions` cover separate packet, wrapper and field/checkpoint scopes.
The network keeps one calibration volume at a time.

## Recorded native checks

On the RTX 3060, the confined circular guide above used an 80 by 40 by 40 grid
and 1,300 timesteps. Both launch directions and two plane separations passed.
Maximum straight-guide complex propagation error was 1.21e-6 and reverse-mode
power was below 1.62e-7. A separately longer four-cycle pulse also passed the
same predefined gates. These are discrete propagation checks, not a speed
comparison or continuum convergence claim.

An actual four-channel straight fiber run, with both HE11 polarizations at
each port, gave maximum complex S error 4.15e-6, reciprocity error 1.82e-7 and
column-power defect 1.67e-6. Before propagation, the signed collocated basis
Gram error was 2.31e-8 against a 1e-4 admission limit.

For an interior epsilon increment of 0.3, the complex S objective in the example
had material derivative -0.37694317. Centered differences at steps 0.008 and
0.004 differed by 2.06e-5 and 1.07e-5 relatively. Fixed-region gradients were
exactly zero. Through-entry reciprocity mismatch was 1.12e-4. Selected guided
column powers were 0.99764 and 0.99782, with radiation outside the selected basis
not included. No total energy-conservation claim follows from these sums.

Independent continuum slab and vector step-index fiber oracles exercise the
mode solver separately. The finest tested slab TE/TM beta errors were 0.150%
and 0.0119%. Fiber errors at 100 and 80 nm were 0.551% and 0.330%. The latter two
meshes establish neither an asymptotic convergence order nor general geometry
gradient convergence. The tests preserve nonmonotone slab error caused by
staircase interface and dispersion cancellation.

At fixed 100 nm mesh, enlarging the transverse box from 4 to 4.8 micrometres
and separately increasing PML thickness from 0.8 to 1 micrometre changed beta
by at most 2.10e-7 relatively. Both cases passed the predeclared 1e-4 beta-shift
and collar-tail gates. This checks finite-box sensitivity at one mesh.

Current exclusions are general multi-branch routing, leaky/resonant channel
normalization, eigenmode differentiation, anisotropic or dispersive mode
profiles, nonuniform grids, spatially streamed modal injection, and a browser
mode-network editor. FDTDX feature parity remains a separate checklist with
these restrictions explicit.
