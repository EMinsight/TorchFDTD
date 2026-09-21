# General anisotropic materials: implementation plan

Status: `torchfdtd/anisotropy.py` implements the bounded nondispersive foundation with periodic/Bloch faces, PEC walls, the restricted fixed-isotropic-exterior CPML composition (`cpml_material='isotropic'`) and tensors extending into CPML under the geometric PML stability criterion (`cpml_material='tensor'`). `torchfdtd/anisotropy_dispersive.py` adds a full-tensor trapezoidal ADE and `torchfdtd/streamed_tensor.py` streams tensor media through X slabs. Rotated tensors whose principal axes are not aligned with a CPML face normal, and biaxial tensors whose face-normal eigenvalue is the intermediate one, are rejected inside CPML because the stretched-coordinate PML is unstable for them. This is not general anisotropic source, PMC/symmetric wall, interface-homogenization or production-performance parity.

## Implemented foundation and usage

`TensorDielectricSimulation` accepts real node-sampled epsilon with shape `(Nx, Ny, Nz, 3, 3)`, exact symmetry, and eigenvalues at least one. It supports uniform rectangular 3D Yee grids with periodic/Bloch faces or CPML behind a fixed isotropic collar, FP32 or FP64, CPU or Torch CUDA, soft impressed-field sources, point histories, and online point DFT. It reuses native curl, source, observation, and bounded checkpoint scheduling machinery. Its constitutive update and analytic material VJP are tensor-aware. A full time-history autograd graph or dense global constitutive matrix is not retained.

```python
import torch
from torchfdtd import AdjointOptions
from torchfdtd.anisotropy import TensorDielectricSimulation

# project must use uniform 3D Yee sampling, periodic/Bloch faces,
# fixed timesteps, nondispersive materials, soft sources, and point monitors.
model = TensorDielectricSimulation(project, AdjointOptions(checkpoints=4))
# Match region precision. Use device="cuda" for the Torch CUDA backend.
lower = torch.zeros(project.region.shape + (3, 3), device="cpu",
                    dtype=torch.float32, requires_grad=True)
epsilon = 1.2 * torch.eye(3, device=lower.device) + lower @ lower.transpose(-1, -2)
result = model(epsilon)
loss = result.signals.abs().square().sum()
loss.backward()
# model.spectrum(epsilon, frequency_hz).fields uses the native DFT convention.
```

The example parameterization keeps a strict margin above the CFL eigenvalue bound. Use a nonzero starting factor when optimizing, since its derivative vanishes at zero. Optimizer and caller material-construction graphs are outside solver admission. The operator includes the input tensor in its conservative extra storage allowance, but this does not bound arbitrary upstream graphs.

The wrapper rejects PMC/symmetric/antisymmetric walls, graded meshes, 2D reductions, project-material oscillators, one-way/TFSF injection, and fused tensor kernels; PEC walls, tensors inside CPML, tensor ADE and streaming have their own sections below. It does not expose modal source coupling or promise anisotropic interface homogenization. Epsilon is explicit input, not a tensor material schema in Project. Scene geometry does not generate these node tensors automatically. Native soft sources remain impressed field increments, not calibrated physical current sources. Higher derivatives are unsupported.

`reservation()` reports admission without allocating constitutive matrices or fields. `host_budget_bytes` limits total host reservation in this wrapper, stronger than the native checkpoint-tier-only meaning. Tensor coefficients, inverse/validation scratch, VJP temporaries, and sequential triplet scratch have a conservative linear allowance of 192 real scalars per cell in addition to the native reservation. CUDA adds 64 MiB for cold linear-algebra/allocator overhead. Eigenvalue validation uses batches of at most 64 matrices to bound solver scratch. These are engineering bounds, not a platform-independent peak proof. CUDA uses ordinary Torch kernels, not an optimized fused anisotropic kernel.

### Completed focused verification

`tests/test_anisotropy.py` contains ten collected cases. Nine initial cases passed together, including both real and complex-Bloch CUDA paths. The extended Fourier energy test and the added reservation-scaling test then passed in a targeted two-case run. Tests use FP32 by default. Tiny FP64 operator/Fourier and central-difference checks isolate cancellation and algebraic errors.

- Constant diagonal tensor signals match the native diagonal solver at FP32 tolerances.
- All six independent symmetric epsilon directions match central differences of actual checkpointed field objectives, for periodic and Bloch cases, with relative tolerance `2e-5` and absolute tolerance `1e-10`.
- Spatially varying SPD operator tests check Hermitian action, positive energy, the upper spectral bound in a sampled direction, and an analytic local epsilon VJP against Torch differentiation.
- A rotated full tensor matches an independently derived Yee Fourier constitutive symbol and one full E/H time step to `2e-12`. Off-diagonal symbols contain `cos(q_a/2) cos(q_b/2)`, with component half-cell phases included explicitly. Three spatial refinements reduce continuum dispersion error by a factor below 0.27 per halving. The same resolved mode preserves modified leapfrog energy over 256 steps to `2e-12`.
- Real and complex-Bloch FP32 Torch CUDA signals and checkpointed gradients match CPU. Measured allocated CUDA peak remains below the reported reservation for these bounded cases. No large-grid performance or scaling claim follows from this check.
- Online DFT agrees with the native history DFT and differentiates. Budget rejection precedes inverse/eigenvalue work. Tensor storage and restart reservations increase eightfold for an eightfold cell-count increase. This is planner scaling, not a measured large-grid peak-memory study.

Remaining acceptance items include independent dense tiny-operator spectral bounds, broader spatially varying material objectives, high-contrast/CFL sweeps, measured large-grid memory/performance scaling, and the physical interface/source/boundary extensions listed below.

## Restricted CPML composition and fixed exterior

Use `TensorDielectricSimulation(project, options,
cpml_background_epsilon=2.0)` when a face is CPML. This explicit finite scalar
must be at least one. Every node tensor in every PML layer plus one adjacent
node row must equal `2.0 * I` exactly in the input dtype. All CPML faces share
that same fixed exterior. The interior can contain rotated, spatially varying
SPD tensors. Periodic/Bloch axes may coexist with CPML axes.

The exterior is **not a design variable**. The explicit scalar argument has no
material derivative, and every tensor VJP entry in its PML/collar is zero,
including diagonal entries. Optimize only the interior, for example by forming
`epsilon = torch.where(interior_mask[..., None, None], design_tensor,
background * torch.eye(3))`. A direct full-grid tensor input retains the same
fixed-collar gradient contract. Changing the fixed scalar is a new simulation
configuration, not a differentiable operation. Shape, dtype, exact symmetry,
spectral bounds and exterior values are validated. Saved input version checks
reject mutation between forward and backward.

For finite axes, missing incident edges use zero extension, never a periodic
roll. Let R contain only existing edge incidences. Its diagonal coverage is
`D = (1/8) sum R^daggerR`: one for ordinary edges and one half for the final edge of
its own finite axis. The implemented gather is `R D^(-1/2)` and its scatter is
`D^(-1/2) R^dagger`. Thus

```text
S = D^(-1/2) [(1/8) sum R^dagger K R] D^(-1/2)
(1/8) sum (R D^(-1/2))^dagger (R D^(-1/2)) = I
```

This yields Hermitian positive S, preserves local bounds on K, and recovers
constant diagonal/isotropic material at every terminal edge. This is a nodal
constitutive closure, not a new physical wall condition. CPML termination uses
the existing scalar curl boundary contract. The CPML derivative target lies
in its outer `layers` field rows. Gathering those edges reaches at most one
additional node row. Fixing `layers + 1` rows therefore contains every tensor
coefficient acting on a CPML-supported curl. A focused support test verifies
that S on such a curl equals scalar division without coupling into the tensor
interior or wrapping to the opposite face.

The update first advances the electric CPML memories and constructs the
CPML-modified H curl, then applies S to that complete curl. The magnetic curl
updates its own memories after the electric field update. Every psi array is
included in native checkpoints. Reverse propagation transposes the magnetic
curl and its memory update first, applies S^dagger to the electric seed, accumulates
the inverse-matrix tensor VJP, then transposes the electric curl and memories.
The reservation reuses the native CPML state/replay accounting plus the existing
192-real-scalars-per-cell tensor allowance. No dense constitutive matrix or
full time graph is used in production.

`tests/test_anisotropy_cpml.py` has seven CPU checks and two CUDA cases. Six passed together in
6.67 seconds; the subsequently added nonzero-memory transpose check passed in
3.50 seconds. Five existing periodic CPU regressions passed in 5.37 seconds.
Evidence includes independently assembled tiny incidence matrices, Hermitian
and spectral bounds, no opposite-face coupling, finite-boundary material VJP,
CPML support reach, FP32 constant-isotropic scalar forward parity, and native
material-gradient parity after the exact nodal-to-Yee diagonal mapping. That
mapping averages neighboring inverse node coefficients, so independent node
and Yee scalar perturbations must not be equated. Real all-CPML and complex
mixed Bloch/CPML tensor-interior pulses match full Torch-autograd histories and
material derivatives in bounded FP64 diagnostics. A random nonzero-psi state
checks every E/H/CPML transpose component against autograd. Fixed-collar
rejection, zero exterior VJP and saved input version checks are covered.

These results validate discrete composition and gradients. They do not validate
a homogeneous rotated anisotropic medium continued into PML, anisotropic
coordinate stretching, long-time CPML stability or quantitative open-boundary
reflection convergence. Such inputs are rejected. Two bounded RTX 3060 FP32
cases (real all-CPML and complex mixed Bloch/CPML) additionally passed against
the CPU full-autograd oracle in 5.79 seconds. Allocated peaks were 9,489,920 and
17,117,696 bytes versus reservations of 69,293,680 and 70,105,248 bytes. Initial
validation exposed CUDA batched-eigenvalue scratch exceeding the reservation;
validation now uses fixed batches of at most 64 matrices, reducing workspace
without increasing the allowance. Invalid-eigenvalue flags accumulate on device
and are read on host once after the scan, avoiding an explicit Python boolean
synchronization per chunk. Python/kernel launch overhead remains, and PyTorch
CUDA eigvalsh may synchronize internally. This conservative bounded-workspace
scan is not an optimized large-grid CPU/CUDA startup path. The CPU validation test enforces that batch
bound. No long-time GPU stability, performance or large-memory result follows
from these small parity checks.

## Tensors extending into CPML: geometric stability criterion

`TensorDielectricSimulation(project, options, cpml_material='tensor')` lets
node tensors fill the PML layers and their one-node collar, with a full tensor
VJP in every node. The discrete update is the D-field composition already used
by the fixed-collar path: the electric CPML memories advance on each transverse
derivative of H, `psi <- b psi + c dH`, the stretched curl is
`dH/kappa + psi`, and the node assembly S acts on that complete curl,

```text
E^{n+1} = E^n + C S curl_cpml(H^{n+1/2})
H^{n+3/2} = H^{n+1/2} - C curl_cpml(E^{n+1})
```

with `S = D^(-1/2) [(1/8) sum R^dagger epsilon^-1 R] D^(-1/2)` from the
sections below. The time step is the vacuum rectangular CFL of the region
(`courant_factor/sqrt(3)`); since every node tensor has eigenvalues at least
one, `S <= I` and the periodic/PEC scheme keeps the vacuum bound. No CPML
coefficient depends on the tensor.

The stretched-coordinate PML is not stable for every medium. Becache, Fauqueux
and Joly (J. Comput. Phys. 188, 2003) showed that a PML normal to axis `a` is
unstable whenever some slowness sheet carries energy against its phase along
`a`, that is `k_a d(omega)/d(k_a) < 0`. For a symmetric permittivity tensor this
happens at the optic-axis cone of a biaxial medium and at the tilted spheroid of
a rotated uniaxial medium: unless `a` is a principal axis, or when it is a
principal axis whose eigenvalue lies strictly between the two transverse
eigenvalues, the lower sheet near the cone is a backward wave along `a`. The
native diagonal solver exhibits exactly this: `diag(1,2,4)` inside six CPML
faces grows exponentially from a point pulse while `diag(2,2,4)` decays, and a
dense one-step map of the source-free update on a 5x11x5 Bloch grid with y CPML
faces has spectral radius above one for `diag(1,2,4)`, for `(1,2,4)` rotated
about y and for `(1,1,4)` tilted about x, but exactly one for `(2,1,4)` and
`(1,4,2)` rotated about y and for every axis-aligned uniaxial tensor. No
choice of `alpha`, `kappa`, `sigma` or Courant number removed the growth, and no
discretization can, because the instability is a continuum property of the PML.

Admission therefore requires, in every CPML face's PML layers plus its collar
row, that the face normal is a principal axis of the node tensor with an
eigenvalue that is not strictly between the two transverse eigenvalues:
`epsilon_ab = epsilon_ac = 0` and `(epsilon_aa - epsilon_bb)(epsilon_aa - epsilon_cc) - epsilon_bc^2 >= 0`,
checked exactly per node with nothing clipped, and reported by face name.
Rotation about the face normal and transverse anisotropy are allowed, so
`(16,1,4)` rotated about x is admitted on the x faces; a node touched by two
faces must be diagonal with both normal eigenvalues extreme, and a node touched
by three faces must be uniaxial or isotropic. The interior is unconstrained.
Because the criterion is necessary for the continuum PML and the discrete
sufficiency rests on measurements, `cpml_face_admissible` and the dense
spectral-radius test in `tests/test_anisotropy_walls.py` document both sides:
admitted tensors give radius `<= 1 + 1e-9`, rejected ones `> 1 + 1e-3`.

`benchmarks/tensor_cpml_stability_sweep.py` records
[the stability sweep](validation/tensor_cpml_stability_sweep.json) on the RTX
3060: 15 admitted 20-cell FP32 cases run 4000 steps after a point pulse (six-face
uniaxial tensors with contrast up to 16, biaxial tensors on their extreme axes
with contrast up to 16, tensors rotated about the x normal through x faces with
periodic or PEC transverse walls, a spatially varying rotated biaxial interior
with admissible collars, and three tensor-ADE cases with proportional poles). Every admitted case is
finite with no late growth of `sum|E|^2 + sum|H|^2` or of `sum|H|^2` (worst
last-window to mid-window ratios 0.981 and 0.440), and every six-face case
keeps decaying (worst late `|H|^2` ratio 0.405). The two rejected `diag(1,2,4)` cases
grow by factors 7.9e+03 (six faces) and 7.6e+12 (x and y faces). The dense
radii over nine transverse Bloch phase pairs are at most 1.000000000 for the four
admitted tensors and 1.004886 for the rejected one. The record keeps its criteria
history: a first execution declared a 1e-4 late-`|H|^2` decay threshold that two
admitted high-contrast six-face cases missed while decaying monotonically; the
decay criterion became the windowed trend and the sweep was rerun in full; a
second execution exposed the non-proportional dispersive class described in
the ADE section and was rerun after tightening that admission. A
soft E pulse deposits charge, so `|E|^2` keeps a static residual by design.
Rotated tensors of the rejected class can look stable over 4000 steps on this
grid; their dense radius above one is the evidence for rejecting them.

## PEC walls

`TensorConstitutive` takes per-axis `(lower, upper)` PEC flags. Wall-tangential
electric components are invariant zero states, each wall node keeps the
admissible closure `e_a e_a^T / epsilon_aa` for its normal component, a node on
two or more walls contributes nothing, and the upper wall is a zero ghost node
row whose tensor row is folded back onto the last real row in the VJP. The
curl keeps the existing scalar PEC contract. `tests/test_anisotropy_walls.py`
checks dense wall incidence matrices (Hermitian, wall rows and columns zero,
positive definite and bounded by one on the admissible subspace), transpose and
VJP parity with full autograd on mixed PEC/CPML/Bloch faces, x-mirror symmetry
of signals with flipped off-diagonal signs, zero wall states after 40 steps and
an exact discrete standing wave in a PEC cavity whose transverse eigenpolarizations
are coupled by a tensor rotated about x. PMC, symmetric and antisymmetric faces
remain explicit errors on every tensor path.

## Full-tensor ADE

`TensorDispersiveSimulation(project, options)` in `torchfdtd/anisotropy_dispersive.py`
takes `(epsilon_inf, strength, omega0, gamma)`: node tensors `(Nx,Ny,Nz,3,3)`
with eigenvalues at least one, positive semidefinite node strength tensors
`(P,Nx,Ny,Nz,3,3)` in `(rad/s)^2`, and one scalar resonance and damping per pole
in rad/s. Pole coupling is a full symmetric tensor of any orientation; the
resonance and damping of a pole are shared by its principal directions, so
dispersion that differs along principal axes uses one pole per axis. The
passivity checks are those of the isotropic ADE: finite values, exact symmetry,
`omega0 >= 0`, `gamma >= 0`, PSD strength, and `epsilon_inf >= I`.

The scheme is the isotropic trapezoidal ADE with its scalar coefficients
replaced by nodal assemblies, the inverse assembly `S` of `epsilon_inf` and the
forward assemblies `X_p = sum R^dagger (chi_p dt^2) R / 8` of the strengths:

```text
a_p = (omega0 dt)^2/2,  d_p = 1 + gamma dt/2 + (omega0 dt)^2/4,  K_p = X_p/(4 d_p)
response_p = (Q_p - a_p P_p)/d_p
(S^-1 + K) E^{n+1} = (S^-1 - K) E^n + C curl_cpml H - sum_p response_p,  K = sum_p K_p
delta_p = response_p + K_p (E^{n+1} + E^n),  P_p += delta_p,  Q_p <- 2 delta_p - Q_p
```

`S^-1` is never applied: the implicit step is `E^{n+1} = E^n + S D` with
`D = (I + K S)^-1 b` and `b = C curl - sum response_p - 2 K E^n`, computed by a
truncated Neumann series. Its length is fixed before execution from the
admitted bound `||K S|| <= max_n sum_p lambda_max(chi_p(n) dt^2)/(4 d_p)` (using
`lambda_min(epsilon_inf) >= 1`), so that the truncation error is below the
input precision; inputs with a bound at or above one, or needing more than 64
terms, are rejected. The fixed polynomial is transposed exactly, and every S and
X_p application contributes to the material VJP. This keeps the semi-discrete
energy structure of the trapezoidal ADE (S and X_p symmetric positive) up to
the truncation, not an exact discrete energy identity.

Inside a CPML face a pole is admitted only where `epsilon_inf` is axis-aligned
with the nondispersive criterion and every strength tensor is a nonnegative
scalar multiple of `epsilon_inf` at that node (compared to within eight units
of the input precision), so the anisotropy is frequency independent: at every
frequency `epsilon(omega)` is a real scalar times the admissible tensor, an
ellipsoid of the same ordering when the scalar is positive and evanescent when
it is negative. The sweep's second execution showed why: a Drude pole
`(.2,.8,.8)` on `epsilon_inf = (16,2,2)`, uniaxial about the x normal, grew to
overflow inside the x faces because `epsilon_t(omega)` turns negative while
`epsilon_x(omega)` is still positive, a hyperbolic band in which the
extraordinary wave runs backward along the normal; a Lorentz pole of the same
shape has a narrow band and a dense radius of 1.00085. A proportional pole on
a tensor rotated about the normal also grows slightly (dense radius 1.00023
for a lossless Drude pole in a diagnostic run, 1.000089 in the recorded
Lorentz case) because the forward assembly
of the strength and the inverse assembly of `epsilon_inf` are not inverses of
each other away from axis alignment, so the discrete anisotropy is not exactly
frequency independent; aligned proportional tensors keep it exactly. Pole-free
collars keep the nondispersive criterion, and the interior is unconstrained.
The fixed isotropic collar mode is not offered with tensor poles.

`tests/test_anisotropy_dispersive.py` compares the checkpointed transpose with
a full-autograd oracle for all four parameter groups on periodic, mixed
Bloch/CPML/PEC and six-face CPML scenes (`rtol 2e-10`), checks isotropic
parity with the scalar trapezoidal ADE (`rtol 1e-10`), a strength-rotation
Taylor and central-difference test, unit spectral radius of the lossless
one-step map with two differently rotated poles on a Bloch box, admission and
rejection messages, and CUDA parity within the reported reservation. The
stability sweep adds 3 admitted long ADE runs with coupling bounds 0.0088, 0.0072, 0.0107 and
4, 4, 4 Neumann terms, the rejected non-proportional Drude run, and dense ADE radii on a
3x7x3 box: at most 1.000000000 for the two admitted aligned proportional poles against
1.027273 for the non-proportional and 1.000089 for the rotated proportional pole. The cost is
`(J+2)(1+P)` nodal operator applications per step; per-node resonance or
damping, fused kernels, streaming of tensor poles and project-material tensor
oscillators are not implemented.

## Streamed X-slab execution

`StreamedTensorSimulation(project, StreamedAdjointOptions(...))` in
`torchfdtd/streamed_tensor.py` runs the nondispersive tensor update and its
explicit transpose on extended slabs, with the same input contract as the
resident `cpml_material='tensor'` path on CPU node tensors. One tensor step
reaches two cells along x (the backward curl reads one row below and the node
assembly scatters one further; the forward curl of the magnetic update cancels
one of them only for a pointwise update), so tiles carry a `2K` halo for `K`
steps instead of the diagonal `K`. The tile operator treats x as a finite axis;
its end-row closure differs from the resident operator only inside the halo,
and the x PEC walls apply on the first and last tile. Node tensors carry no
Bloch phase while fields and CPML memories keep the winding extension. The
reservation extends the diagonal streamed reservation by the extra halo rows,
192 reals per tile cell and the 64 MiB CUDA linear-algebra allowance; it is an
engineering bound checked against measured peaks in tests, not a large-grid
study. `StreamedSimulation` names this class when it receives node tensors.

`tests/test_streamed_tensor.py` compares block forward and transpose with
autograd of the resident system (Bloch windings beyond one period, PEC and CPML
faces, CPU and CUDA), streamed against resident signals, material gradients and
online spectra (`rtol 1e-10`), and checks reservation, halo depth and admission.
The fixed isotropic collar, tensor poles, fused tile kernels and disk/async
policies beyond the inherited options are not exercised on this path.

## Current supported scope

| Interface | Supported constitutive scope | Limitation |
| --- | --- | --- |
| `models.Material` | Scalar real index or scalar instantaneous permittivity, with scalar passive Drude/Lorentz parameters | No full tensor material schema |
| Native staircase voxelization | Scalar material sampled separately at the three electric Yee locations | Three samples do not represent off-diagonal coupling |
| `DifferentiableSimulation` | Real FP32/FP64 epsilon of shape `(Nx, Ny, Nz)` or `(Nx, Ny, Nz, 3)` | Componentwise scalar or diagonal update and material VJP |
| Differentiable ADE | Scalar or componentwise diagonal instantaneous epsilon and pole parameters, subject to the existing broadcast contracts | No off-diagonal oscillator coupling |
| `TensorDielectricSimulation` | Real symmetric full node tensors with eigenvalues at least one; periodic/Bloch faces, PEC walls, fixed-isotropic-exterior CPML or tensors inside CPML under the geometric criterion; CPU/Torch CUDA | Rotated or intermediate-axis biaxial tensors inside CPML are rejected; no PMC/symmetric walls, calibrated modal injection or interface homogenization |
| `TensorDispersiveSimulation` | Tensor `epsilon_inf` with PSD node strength tensors and scalar resonance/damping per pole, trapezoidal tensor ADE with a fixed Neumann solve | Axis-aligned `epsilon_inf` with proportional strengths where poles enter CPML; no per-node pole rates, fused kernels or streaming |
| `StreamedTensorSimulation` | Nondispersive node tensors streamed through X slabs with a 2K halo, CPU or CUDA Torch tiles | No fixed isotropic collar, tensor poles or fused tile kernels |
| Streamed dielectric and ADE paths | Their existing scalar/diagonal material contracts | No general tensor constitutive operator |
| Native subpixel path | A symmetric off-diagonal inverse constitutive operator built from isotropic dielectric interfaces | Not a bulk anisotropic material API, not a full-tensor differentiable path |

Real material coefficients can coexist with complex Bloch fields. Complex fields do not imply complex, gyrotropic, or general anisotropic material support. The present mode solver and modal launch also assume isotropic nondispersive cross-sections.

Relevant interfaces are `solver.field_axes`, `solver.voxelize`, `boundaries.update_E`, `differentiable._System.reference_step`, `differentiable._System.transpose_step`, `dispersive_adjoint._ParameterLayout`, `dispersive_adjoint._DispersiveSystem.electric_step`, `subpixel.interface_tensor`, `subpixel.prepare_interfaces`, `SubpixelPlan.apply`, and `spacetime._prepare_permittivity`/`_tile`. Streamed ADE already exists. An older statement that ADE streaming is pending is not an accurate description of current coverage.

## Separate physical slab evidence

The [rotated-slab acceptance](TENSOR_CPML_SLAB_ACCEPTANCE.md) uses independent
polarized continuum transfer coefficients inside the fixed isotropic exterior.
Two FP32 normal-direction meshes give coherent transmission errors of 1.0088%
and 0.2421%. The coarse rotation VJP error is 1.5077%. All predeclared gates pass.
This does not isolate CPML reflection, oblique incidence, general interfaces or
large-grid speed.

The same document records the birefringent extension: a slab with principal
indices 1.5 and 2.0 inside an exterior with principal indices 1.2 and 1.4 that
shares its principal axes (rotated 25 degrees about z, normal permittivity 2.25)
and fills both z CPML faces under the geometric criterion. Each eigenpolarization
is an exact scalar transfer-matrix channel. The per-channel complex errors are
1.3721% and 0.3302% on the two meshes and the coarse slab-index VJP
differs from the continuum derivative by 6.89%. All predeclared gates pass.

## Foundation design and remaining milestone gates

The implemented foundation uses real symmetric positive-definite bulk permittivity on uniform rectangular Yee grids with periodic/Bloch faces, PEC walls and CPML, relative permeability one, optional tensor Lorentz/Drude poles and X-slab streaming, each with an explicit operator transpose and material VJP. Tensors inside CPML that violate the geometric stability criterion, PMC/symmetric walls, anisotropic interface homogenization, anisotropic modal sources, per-node pole rates, streamed tensor poles and fused tensor kernels remain excluded from the acceptance claim.

Define the tensor sampling location explicitly. A first contract can assign one physical tensor to each common mesh node. Represent six independent symmetric entries, or use a constrained parameterization such as `epsilon = I + L L^T` when the conservative vacuum CFL is required. Check finite values, symmetry, and eigenvalue bounds. Do not clip physical tensors to make an unsupported input appear valid.

### Yee placement and reusable assembly

`field_axes` places electric component `a` half a cell along axis `a` and at nodes along the other axes. Consequently, the three electric values at one array index are not colocated. A pointwise full 3 by 3 multiplication of those values silently changes the constitutive sampling.

The existing subpixel code supplies a useful topology. At each node, its eight edge-triplet orientations gather the three actual incident electric edges. Let `R[n,s]` denote this gather, including periodic or Bloch seam phases, and let `K[n,s]` be the inverse of the explicitly sampled physical permittivity tensor. Assemble

```text
S = (1/8) sum over all nodes n and eight orientations s of R[n,s]^dagger K[n,s] R[n,s].
```

For the initial node-sampled contract, all eight orientations at a node use the same `K[n]`. Invert the matrix epsilon to obtain K. Do not take elementwise reciprocals.

Assembly must cover every bulk node, including homogeneous anisotropic interiors. The current interface-candidate scan and `interface_tensor` isotropic homogenization rule cannot be reused as the physical tensor builder. The current reciprocal diagonal diagnostic `SubpixelPlan.epsilon` is not the complete physical tensor.

Complete periodic coverage gives `(1/8) sum R^dagger R = I`. Thus local bounds `m I <= K <= M I` give the same bounds on S, and S is Hermitian positive definite. The existing sparse row topology can be reused after checking its capacity and duplicate accumulation. A constant full tensor produces cross-component interpolation between distinct Yee edges, not a colocated multiply. Constant diagonal tensors should recover the existing diagonal update exactly.

The normalized finite-node completion below supplies the nonperiodic edge-triplet derivation for the restricted CPML path. An arbitrary isotropic baseline for missing triplets would not establish these bounds. Abrupt anisotropic interfaces also require separate accuracy evidence or tensor-aware homogenization. Bulk nodal assembly alone is not a claim of general subpixel interface accuracy.

## Forward, transpose, and memory contracts

For fixed nondispersive S, the electric update can remain in E form:

```text
E_new = E_old + C * S(curl H).
```

No additional displacement-field state is necessary for this limited contract. A Torch reference operator can integrate through a new system factory while reusing checkpointing and plane observations. Existing diagonal fused kernels cannot be reused unchanged.

The reverse curl receives `C * S^dagger(E_bar)`. The material VJP must include gather/scatter, real-part and conjugation conventions, symmetric parameter projection, and the inverse chain rule

```text
dK = -K * d(epsilon) * K.
```

Bloch seam phases must be conjugated in the transpose. Matrix inversion or eigenvalue parameterization does not by itself validate the complete material VJP.

Admission must include coefficient storage, sparse topology or matrix-free metadata, gathers, temporary work arrays, checkpoints, and tensor-gradient workspace before allocating them. Specify resident CPU/GPU and host-budget behavior explicitly. Do not introduce a hidden dense global constitutive matrix or dense Jacobian in the production path.

## CFL and boundary gates

SPD alone is insufficient for the existing vacuum time step. A positive eigenvalue below one can increase the maximum propagation speed. Requiring `epsilon >= I` in the spectral sense gives `S <= I` under the complete periodic assembly and preserves the conservative rectangular vacuum CFL.

For a broader positive-permittivity contract, establish and enforce a bound such as

```text
dt <= 1 / (c * sqrt(lambda_max(S)) * sqrt(sum_a h_a^(-2))).
```

Use a proven upper bound for `lambda_max(S)` where an exact eigensolve is inappropriate. Elementwise epsilon checks are not a valid substitute. Valid SPD tensors can have negative off-diagonal entries.

The existing subpixel update composes derivative CPML before its constitutive operator. That composition and its algebraic transpose are what the tensor CPML paths use; the periodic Hermitian energy argument does not prove anisotropic CPML stability, and the geometric criterion above is a necessary continuum condition whose discrete sufficiency rests on the recorded dense radii and long runs. Oblique-incidence reflection measurements with separate PML thickness and time controls remain open. PEC walls have their nodal closure and transpose checks; PMC and symmetric walls do not.

## Source, ADE, and streaming gates

A soft additive E source may remain an explicitly documented impressed-E source. A physical impressed-current or displacement-field source must be mapped through the full S operator rather than componentwise inverse epsilon. Existing scalar one-way injection must reject anisotropic launch neighborhoods. Current isotropic modal launch must also reject them until anisotropic modes, impedance, Yee phase corrections, and directional calibration are implemented and validated. Checking only reciprocal operator diagonals cannot establish that a source neighborhood is isotropic.

Full-tensor ADE is implemented as described above: SPD instantaneous epsilon, positive-semidefinite tensor strengths and nonnegative damping, edge-based auxiliary P and Q, nodal assemblies in place of the componentwise denominator, and a fixed Neumann series in place of a global solve. The diagonal ADE CUDA kernel is not reused.

Streaming is implemented as described above: the complete tensor time-step stencil reaches two cells along x, which fixes the 2K halo; material halos carry no Bloch phase; coefficient rows and tensor VJP rows are gathered and reduced by index; the reservation adds the halo rows and tensor workspace before allocation.

## Acceptance sequence

1. Verify constant diagonal tensor parity against the existing solver, including all three axes and rectangular spacing. Reject nonfinite, asymmetric, non-SPD, or unsupported eigenvalue inputs before expensive allocation.
2. Verify constant rotated uniaxial and biaxial media against an independently assembled discrete Fourier Maxwell symbol. Check propagation, polarization, and cross-component coupling, then refine toward the continuum analytic dispersion relation. Do not substitute a scalar effective index.
3. On tiny grids, independently assemble the global operator to check Hermitian symmetry, positive eigenvalues, local spectral bounds, and forward/transpose dot products. Include complex Bloch seams. Dense assembly is a diagnostic only.
4. Check material finite differences for all six symmetric components and a tensor rotation angle, using an actual field or plane objective. Use FP32 by default and FP64 only for bounded diagnostics where cancellation warrants it.
5. Check long-time periodic discrete energy, smooth spatially varying rotated tensors, contrast sweeps, and the enforced CFL boundary. Keep physical duration fixed in mesh studies.
6. Validate anisotropic slab transmission, reflection, and cross-polarization against an independent analytic or Berreman transfer-matrix calculation. Validate objective gradients and distinguish bulk discretization from interface-model error.
7. CPML with tensors follows the geometric criterion, long-run sweep and dense spectral radii above; physical current sources, directionality and isolated reflection measurements remain open. Keep PML thickness and source duration fixed during spatial refinement.
8. Validate optimized CPU/CUDA forward and transpose against the reference. Record peak memory and scaling with cell count, tensor storage, checkpoint count, and parameter count. Require early admission failure without large allocation.
9. Streamed repeated-wrap parity and full-tensor ADE passivity/gradient tests exist under the contracts above; memory scaling studies and anisotropic modal ports remain open.

Completion of the first milestone establishes a periodic nondispersive tensor foundation. It does not establish general anisotropic source, open-boundary, dispersive, or streamed parity.
