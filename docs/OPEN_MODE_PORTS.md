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

## N-port aperture networks

`ModePort` and `ModeBranchNetwork` in `torchfdtd.mode_branches` place any
number of fixed-mode ports on any of the six cardinal faces. Each port has its
own transverse aperture, which may be a sub-rectangle of the cell, its own
straight calibration guide through `port_permittivities`, and its own selected
mode indices. The result is the complex S matrix over every channel pair in
the existing normalization: outgoing amplitude at the row phase plane divided
by the matched incident amplitude at the column phase plane, with the
same-port matched-guide outgoing baseline subtracted. The report carries
`column_power` and `power_defect`, summed over the selected guided channels
only; radiation and omitted modes are not included, so a defect is reported,
never corrected.

```python
import numpy as np
from torchfdtd import AdjointOptions, ModePort, ModeBranchNetwork

ports = (ModePort('in', 'x', +1, (-1., 0., 0.), (0., 1.2, .5), .4),
         ModePort('up', 'x', -1, (1., .7, 0.), (0., 1.2, .5), .4),
         ModePort('down', 'x', -1, (1., -.7, 0.), (0., 1.2, .5), .4))
sections = {'in': lambda y, z: np.where(abs(y) < .2, 12., 2.1),
            'up': lambda y, z: np.where(abs(y-.7) < .2, 12., 2.1),
            'down': lambda y, z: np.where(abs(y+.7) < .2, 12., 2.1)}
network = ModeBranchNetwork(project, ports, options=AdjointOptions(checkpoints=4),
                            port_permittivities=sections)
result = network(epsilon)          # result.s is 3 by 3, result.report['column_power']
```

Port apertures are periodic-supercell eigenmodes solved on the aperture
rectangle by `prepare_aperture_modal_launch`. Unless the rectangle is the
complete periodic cell on an axis, the outermost cell ring must hold at most
`confinement_tolerance` (default 1e-3) of the squared six-component amplitude;
the fraction is reported per port. Aperture edges lie on Yee cell boundaries
and, on a CPML axis, inside the physical region. Injection, the fixed-material
check and the detector quadrature cover only the rectangle. Material beside
the aperture is free. Each port's exterior footprint, its aperture times the
cells from one cell inside the phase plane outward through the source and
CPML, must equal that port's calibration guide and carries zero derivative.
Footprints may not overlap. Phase planes lie on longitudinal E nodes and
sources a whole number of at least two cells outside them. `ModePort` accepts
the x, y and z normals with either sign. Mode profiles, eigenvalues, source
packets and calibration stay fixed reference quantities, as in FDTDX.

`branch_network_from_ports` builds the same network from in-plane port
markers such as `GDSImport.ports`, taking `normal_convention`,
`wavelength_um`, `source_offset_um`, `mode_indices`, `options` and either
core/cladding rectangle epsilons or explicit `permittivity` or
`port_permittivities` sections, the keywords of the two-port GDS helper;
marker selection is the caller's list.
Marker normals must be cardinal x or y; use `ModePort` directly for z faces.
Marker geometry is not rasterized.

`ModeInjectedPlaneSimulation` now admits `StreamedAdjointOptions`. Each X slab
injects only its rows of the fixed sheets and accumulates only its own plane
observers, through the existing tile transposes; the same holds for
`ModeBranchNetwork`. The `reference` method runs the identical fixed sheets
through full Torch autograd on small resident problems, admitted by its
estimated graph memory (optional `graph_budget_bytes` cap), as the oracle for
the checkpointed adjoint.

### Recorded checks

`tests/test_mode_branches.py`, `tests/test_mode_streamed_injection.py` and
`tests/test_mode_adjoint_oracle.py` record these on the RTX 3060 and CPU with
0.1 micrometre meshes, two-cycle pulses and cores of epsilon 12 in 2.1. They
are discrete consistency checks at one mesh, not convergence claims.

On a straight guide, a 1.2 micrometre aperture port and a mixed aperture pair
differed from the full-cell `ModeNetwork` by at most 1.6e-5 and 1.0e-5 in
complex S, with straight propagation phase error 2.8e-4 and column powers
1.000002 and 0.99981. A staircase symmetric Y branch with 800 steps gave
column powers 0.816, 0.549 and 0.549, reciprocity error 2.0e-3, arm asymmetry
1.2e-4, and a derivative of a mixed complex S objective of 0.189753 against a
central difference of 0.189749, relative error 2.2e-5. A four-port crossing on
the x and y normals gave column powers 0.760, reciprocity error 2.4e-4, a
four-fold rotation gap of 1.2e-7 and a mirror gap of 2.6e-3. Ports on the z
faces reproduced the x-normal scene under cyclic relabelling to 4.1e-8 in S
with identical derivatives. The power lost by the crude junctions goes to
radiation outside the selected basis.

Streamed versus resident execution agreed to 1.3e-7 in normalized plane
fields, to 1.5e-6 (CPU, x normal) and 1.1e-5 (CUDA, y normal) relative in
material derivatives, and to 8.2e-8 in network S with 2.3e-7 relative
derivative agreement. The checkpointed adjoint matched full Torch autograd to
1.3e-15 (CPU) and 5.4e-15 (CUDA) relative in FP64, Taylor residuals 1.56e-8,
3.90e-9 and 9.76e-10 for steps 2e-3, 1e-3 and 5e-4, and the central difference
agreed to 8.3e-9 relative. A network-level |S21|^2 objective had residuals
2.65e-8, 6.62e-9 and 1.65e-9 with central difference agreement 1.7e-8 relative.

Current exclusions are open-boundary (transverse CPML) modes on sub-cell
apertures, since aperture modes are periodic supercells and `OpenPortOptions`
remains a two-port `ModeNetwork` feature, oblique or non-cardinal port normals,
leaky/resonant channel normalization, eigenmode and source-parameter
differentiation, anisotropic or dispersive mode profiles, nonuniform grids,
and z-normal GDS markers. A restricted
[native CAD and browser workflow](MODE_NETWORK_WORKFLOW.md) exposes the fixed
opposing two ports, complex S and interior material derivatives. FDTDX feature
parity remains a separate checklist with these restrictions explicit.
