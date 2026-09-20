# General anisotropic materials: implementation plan

Status: proposed and unimplemented. This document records a read-only audit of the current interfaces. It does not establish general anisotropic material support or report new simulation results.

## Current supported scope

| Interface | Supported constitutive scope | Limitation |
| --- | --- | --- |
| `models.Material` | Scalar real index or scalar instantaneous permittivity, with scalar passive Drude/Lorentz parameters | No full tensor material schema |
| Native staircase voxelization | Scalar material sampled separately at the three electric Yee locations | Three samples do not represent off-diagonal coupling |
| `DifferentiableSimulation` | Real FP32/FP64 epsilon of shape `(Nx, Ny, Nz)` or `(Nx, Ny, Nz, 3)` | Componentwise scalar or diagonal update and material VJP |
| Differentiable ADE | Scalar or componentwise diagonal instantaneous epsilon and pole parameters, subject to the existing broadcast contracts | No off-diagonal oscillator coupling |
| Streamed dielectric and ADE paths | Their existing scalar/diagonal material contracts | No general tensor constitutive operator |
| Native subpixel path | A symmetric off-diagonal inverse constitutive operator built from isotropic dielectric interfaces | Not a bulk anisotropic material API, not a full-tensor differentiable path |

Real material coefficients can coexist with complex Bloch fields. Complex fields do not imply complex, gyrotropic, or general anisotropic material support. The present mode solver and modal launch also assume isotropic nondispersive cross-sections.

Relevant interfaces are `solver.field_axes`, `solver.voxelize`, `boundaries.update_E`, `differentiable._System.reference_step`, `differentiable._System.transpose_step`, `dispersive_adjoint._ParameterLayout`, `dispersive_adjoint._DispersiveSystem.electric_step`, `subpixel.interface_tensor`, `subpixel.prepare_interfaces`, `SubpixelPlan.apply`, and `spacetime._prepare_permittivity`/`_tile`. Streamed ADE already exists. An older statement that ADE streaming is pending is not an accurate description of current coverage.

## First implementation milestone

Implement fixed real symmetric positive-definite bulk permittivity on uniform rectangular, periodic Yee grids, with relative permeability one and nondispersive materials. Include an exact operator transpose and tensor material VJP before claiming differentiable support. Initially exclude CPML, nonperiodic walls, tensor dispersion, streamed execution, anisotropic interface homogenization, and anisotropic modal sources from the acceptance claim.

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

Nonperiodic edge-triplet completion requires a separate derivation. An isotropic baseline for missing triplets does not prove the same bounds for general anisotropic boundary tensors. Abrupt anisotropic interfaces also require separate accuracy evidence or tensor-aware homogenization. Bulk nodal assembly alone is not a claim of general subpixel interface accuracy.

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
