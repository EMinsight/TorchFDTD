# General anisotropic materials: implementation plan

Status: the bounded periodic nondispersive foundation and a restricted fixed-isotropic-exterior CPML composition are implemented in `torchfdtd/anisotropy.py`. General anisotropic media extending into CPML remain unsupported. This is not general anisotropic source, open-boundary, dispersive, streamed, or production-performance parity.

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

The wrapper rejects anisotropic CPML coefficients, walls, graded meshes, 2D reductions, spatial streaming, full-tensor ADE, one-way/TFSF injection, and fused tensor kernels. It does not expose modal source coupling or promise anisotropic interface homogenization. Epsilon is explicit input, not a tensor material schema in Project. Scene geometry does not generate these node tensors automatically. Native soft sources remain impressed field increments, not calibrated physical current sources. Higher derivatives are unsupported.

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
`D = (1/8) sum R¢ÓR`: one for ordinary edges and one half for the final edge of
its own finite axis. The implemented gather is `R D^(-1/2)` and its scatter is
`D^(-1/2) R¢Ó`. Thus

```text
S = D^(-1/2) [(1/8) sum R¢Ó K R] D^(-1/2)
(1/8) sum (R D^(-1/2))¢Ó (R D^(-1/2)) = I
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
curl and its memory update first, applies S¢Ó to the electric seed, accumulates
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

## Current supported scope

| Interface | Supported constitutive scope | Limitation |
| --- | --- | --- |
| `models.Material` | Scalar real index or scalar instantaneous permittivity, with scalar passive Drude/Lorentz parameters | No full tensor material schema |
| Native staircase voxelization | Scalar material sampled separately at the three electric Yee locations | Three samples do not represent off-diagonal coupling |
| `DifferentiableSimulation` | Real FP32/FP64 epsilon of shape `(Nx, Ny, Nz)` or `(Nx, Ny, Nz, 3)` | Componentwise scalar or diagonal update and material VJP |
| Differentiable ADE | Scalar or componentwise diagonal instantaneous epsilon and pole parameters, subject to the existing broadcast contracts | No off-diagonal oscillator coupling |
| New `TensorDielectricSimulation` | Real symmetric full node tensors with eigenvalues at least one, periodic/Bloch or fixed-isotropic-exterior CPML, CPU/Torch CUDA | No anisotropy inside CPML/collar, full-tensor ADE, streaming, or calibrated modal injection |
| Streamed dielectric and ADE paths | Their existing scalar/diagonal material contracts | No general tensor constitutive operator |
| Native subpixel path | A symmetric off-diagonal inverse constitutive operator built from isotropic dielectric interfaces | Not a bulk anisotropic material API, not a full-tensor differentiable path |

Real material coefficients can coexist with complex Bloch fields. Complex fields do not imply complex, gyrotropic, or general anisotropic material support. The present mode solver and modal launch also assume isotropic nondispersive cross-sections.

Relevant interfaces are `solver.field_axes`, `solver.voxelize`, `boundaries.update_E`, `differentiable._System.reference_step`, `differentiable._System.transpose_step`, `dispersive_adjoint._ParameterLayout`, `dispersive_adjoint._DispersiveSystem.electric_step`, `subpixel.interface_tensor`, `subpixel.prepare_interfaces`, `SubpixelPlan.apply`, and `spacetime._prepare_permittivity`/`_tile`. Streamed ADE already exists. An older statement that ADE streaming is pending is not an accurate description of current coverage.

## Foundation design and remaining milestone gates

The implemented foundation uses fixed real symmetric positive-definite bulk permittivity on uniform rectangular, periodic Yee grids, with relative permeability one and nondispersive materials. It includes an explicit operator transpose and tensor material VJP. General anisotropic CPML, nonperiodic walls, tensor dispersion, streamed execution, anisotropic interface homogenization, and anisotropic modal sources remain excluded from the acceptance claim.

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

The existing subpixel update composes derivative CPML before its constitutive operator. That composition and its algebraic transpose can be extended, but the periodic Hermitian energy argument does not prove anisotropic CPML matching or stability. Acceptance requires rotated tensors, oblique incidence, reflection measurements, long-time stability, and separate PML thickness and time controls. A tensor-aware stretched-coordinate treatment may be needed. PEC and other nonperiodic walls require independent staggered boundary closure and transpose checks.

## Source, ADE, and streaming gates

A soft additive E source may remain an explicitly documented impressed-E source. A physical impressed-current or displacement-field source must be mapped through the full S operator rather than componentwise inverse epsilon. Existing scalar one-way injection must reject anisotropic launch neighborhoods. Current isotropic modal launch must also reject them until anisotropic modes, impedance, Yee phase corrections, and directional calibration are implemented and validated. Checking only reciprocal operator diagonals cannot establish that a source neighborhood is isotropic.

Full-tensor ADE is a separate derivation. Require SPD instantaneous epsilon, passive positive-semidefinite tensor oscillator strengths, and nonnegative damping, with consistent staggered auxiliary variables. The current trapezoidal ADE denominator is componentwise. Replacing it with a same-index 3 by 3 solve incorrectly treats Yee electric values as colocated. Derive a stable passive update, its transpose, and its parameter VJP. A triplet auxiliary-variable formulation may require different state storage or a global solve. Do not assume the existing diagonal ADE algebra or CUDA kernel remains valid.

Streaming requires tensor coefficient ownership, constitutive neighbor gathers, repeated periodic-wrap reduction, and correct material VJPs. Material halos must not receive field Bloch phases. Derive the support of the complete electric/magnetic time-step stencil before selecting temporal-tile halo depth. Neither automatic reuse of the current halo contract nor an unsupported blanket doubling of halo depth is justified. Budget coefficient banks, halos, replay buffers, transfer slots, and tensor VJP workspace before allocation.

## Acceptance sequence

1. Verify constant diagonal tensor parity against the existing solver, including all three axes and rectangular spacing. Reject nonfinite, asymmetric, non-SPD, or unsupported eigenvalue inputs before expensive allocation.
2. Verify constant rotated uniaxial and biaxial media against an independently assembled discrete Fourier Maxwell symbol. Check propagation, polarization, and cross-component coupling, then refine toward the continuum analytic dispersion relation. Do not substitute a scalar effective index.
3. On tiny grids, independently assemble the global operator to check Hermitian symmetry, positive eigenvalues, local spectral bounds, and forward/transpose dot products. Include complex Bloch seams. Dense assembly is a diagnostic only.
4. Check material finite differences for all six symmetric components and a tensor rotation angle, using an actual field or plane objective. Use FP32 by default and FP64 only for bounded diagnostics where cancellation warrants it.
5. Check long-time periodic discrete energy, smooth spatially varying rotated tensors, contrast sweeps, and the enforced CFL boundary. Keep physical duration fixed in mesh studies.
6. Validate anisotropic slab transmission, reflection, and cross-polarization against an independent analytic or Berreman transfer-matrix calculation. Validate objective gradients and distinguish bulk discretization from interface-model error.
7. Add CPML and physical sources only after their separate reflection, directionality, conservation, and long-time tests pass. Keep PML thickness and source duration fixed during spatial refinement.
8. Validate optimized CPU/CUDA forward and transpose against the reference. Record peak memory and scaling with cell count, tensor storage, checkpoint count, and parameter count. Require early admission failure without large allocation.
9. Add streamed repeated-wrap parity and memory scaling, then anisotropic modal ports and full-tensor ADE passivity/gradient tests under separately declared contracts.

Completion of the first milestone establishes a periodic nondispersive tensor foundation. It does not establish general anisotropic source, open-boundary, dispersive, or streamed parity.
