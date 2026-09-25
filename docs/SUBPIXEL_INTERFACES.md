# Experimental dielectric subpixel interfaces

This optional method is under numerical validation. It does not complete the
interface-accuracy priority or establish an advantage for every device.
Staircase remains the default. Measured sphere results, including regressions,
are recorded in [the validation report](validation/SUBPIXEL_REPORT.md).

## Select in Python or the workbench

```python
from torchfdtd import Project, Simulation, FDTD

project = Project()
project.region.material_sampling = "yee"
project.region.interface_method = "subpixel"
project.region.subpixel_quadrature = 16  # allowed: 2 through 32
result = Simulation(project).run()
print(result.summary["subpixel"])

# The SI editing facade shares the same validated model.
fdtd = FDTD()
fdtd.set("interface method", "subpixel")  # also selects Yee locations
fdtd.set("subpixel quadrature", 16)
```

In **Simulation → interface method**, choose **Subpixel · experimental
dielectric**. The quadrature order and scope appear alongside the selection.
Python export, JSON and NPZ retain both settings. Returning to Staircase restores
the original update. Native batch functions accept subpixel projects.
Grouped batches separate different interface methods before forming cohorts.

The present scope is isotropic, lossless, nondispersive dielectrics and
single-pole (Drude or one Lorentz pole) dispersive materials, 2D or 3D, with
constant spacing on each axis. Different x/y/z spacings are supported.
Multipole materials, two dispersive materials in one Yee cell,
`pml_dispersion="frozen"` with a dispersive structure and nonuniform nodes raise
validation errors. Dispersive cells use the diagonal construction of
[Dispersive interfaces](#dispersive-interfaces) below.
Real-field fused CUDA and tensor cohorts support float32/float64. Complex
Bloch fields use the reference Torch path. This is not a mapping to a
commercial conformal algorithm, and unsupported FSP writes remain errors.

## Constitutive construction

The geometry pass integrates permittivity along Yee edges by finding analytic
primitive intersections. Interval membership resolves overlap order. Dual-face
averages use Gauss-Legendre quadrature of these line integrals. The analytic
integration direction follows the dominant transverse normal, so axis-aligned
layers have exact fractions. Normals use exposed surfaces of the final clipped
unit cell. Hidden surfaces and surfaces outside that cell cannot determine the
normal. A periodic seam can itself be an interface.

At a node, let `l` contain edge averages of inverse permittivity, `f` contain
dual-face averages of permittivity, and `P = n nᵀ` for a unit normal. Local
matrices are

```text
Gamma = I + diag(l - 1) P
Pi    = diag(f) (I - P) + P
Xi    = sym(Gamma inverse(Pi))
```

Each local Xi is spectrally bounded between the smallest and largest
constituent inverse permittivities. Eight edge-triplet permutations assemble
the global operator with equal weight. Wrapped couplings carry conjugate Bloch
phases. This assembly preserves a Hermitian positive operator and a conservative
vacuum CFL bound in the lossless periodic problem. The tests check the assembled
matrix and a 3,000-step discrete energy identity, including index contrast 20.
That periodic argument is not a proof of every CPML or driven configuration.

Method context is the edge/face and triplet construction described by
[Werner, Bauer and Cary (2013)](https://arxiv.org/abs/1212.4857).
Geometry integration, spectral bounding and kernels here are independently
implemented. The spectral bound is an explicit modification whose accuracy
tradeoff needs measurement. No claim of general second-order interface
convergence is made.

With fixed nondispersive Xi, the update is `E += c Xi curl(H)`. The fused CUDA
path writes the curl during its normal update and adds sparse interface
couplings in one further kernel. Each row is written once, without atomics.
Tensor cohorts share a launch while retaining independent fields and material
operators. This requires a curl buffer and sparse coefficient storage, so a
fixed-grid solve can cost more than staircase. Smaller equal-error grids, if
demonstrated, are the intended benefit.

## Interpretation and remaining work

The permittivity image is **the reciprocal diagonal of the global inverse
constitutive operator**. It is not a complete representation of the tensor
acting on fields. Result metadata reports quadrature, coupled edges, spectral
bounding counts, preparation time and auxiliary device memory. A zero count of
Yee centers inside a structure does not prove that its subpixel integrals vanish.

- Increase quadrature as well as mesh resolution. Finite face quadrature can
  miss unresolved thin features and cannot resolve arbitrary geometry exactly.
- Corners, multiple interfaces in one support and intersecting surfaces do not
  have a unique normal. The bounded fallback is not an accuracy guarantee.
- A low error at one mesh or translation is insufficient evidence. Retain
  translations, both polarizations and matched physical time/PML controls.
- High-index resonances still need tighter error targets, longer-duration
  controls and more device geometries. The current sphere study is not a mode
  port, waveguide or inverse-design validation.
- Multipole and mixed dispersive cells, the off-diagonal (full tensor)
  dispersive coupling, nonuniform subpixel metrics and independent equal-error
  performance comparisons remain required follow-up work.

## Dispersive interfaces

An electric Yee sample whose cell (one mesh step per axis, centred on the
sample) meets a dispersive object leaves the coupled operator above and carries
a diagonal, sample-wise dispersive medium instead. With the cell holding a
fraction `f` of one single-pole medium
`eps_m(w) = eps_inf + s/(w0^2 - w^2 - i g w)` and nondispersive media elsewhere,
`C` and `B` the cell averages of `eps` and `1/eps` over the nondispersive part,
and `n` the unit normal of the dispersive surface nearest the sample, the
tangential and normal laminate averages and the component `c` of the diagonal
inverse tensor are

```text
eps_par(w)    = C + f eps_m(w)
1/eps_perp(w) = B + f/eps_m(w)
1/eps_c(w)    = (1 - n_c^2)/eps_par(w) + n_c^2/eps_perp(w)
```

This is the normal/tangential split of the dispersive response of Deinega and
Valuev (Opt. Lett. 32, 3429, 2007) applied to the averaging tensor of Farjadpour
et al. (Opt. Lett. 31, 2972, 2006) and Kottke, Farjadpour and Johnson (Phys.
Rev. E 77, 036611, 2008), kept diagonal like the planar-interface diagonal of the
coupled operator. The fractions, `C` and `B` come from the analytic line
integrals of the geometry pass with Gauss-Legendre nodes on the two other axes
(`subpixel_quadrature` per axis).

**Exact pole form and passivity.** In the metal denominator
`L = w0^2 - w^2 - i g w`, `1/eps_c = c0 - a1/(L + b1) - a2/(L + b2)` with
`c0 = (1 - n_c^2)/(C + f eps_inf) + n_c^2 (B + f/eps_inf)` and nonnegative
`a_j`, `b_j`. With `lambda = -L` the zeros of `1/eps_c` are the eigenvalues
`lambda_j` of the symmetric 2x2 matrix `diag(b) - v v^T`, `v_k^2 = a_k/c0`, and

```text
eps_c(w) = eps' + sum_j r_j/(w0^2 + lambda_j - w^2 - i g w)
eps' = 1/c0,   r_j = (x_j . v)^2/c0 >= 0,   lambda_j >= 0
```

for the eigenvectors `x_j`. `lambda_j >= 0` because `diag(b) - v v^T` is
positive semidefinite exactly when `1/eps_c` at `L = 0` is nonnegative, and that
value is `n_c^2 B >= 0`. `eps' >= 1` because `C + f eps_inf >= 1` and
`B + f/eps_inf <= 1` for `eps_inf >= 1` and nondispersive permittivities
`>= 1`. Each sample is therefore a passive Lorentz sum with instantaneous
permittivity at least one, the model class the trapezoidal ADE already
integrates for staircased materials; `torchfdtd.subpixel_dispersive.InterfaceADE`
is `MaterialADE` with per-sample `eps_inf`, `w0`, strength and damping, so the
discrete response is `eps_c` at `(2/dt) tan(w dt/2)` like every other ADE
material. Samples of a dispersive material and every sample touched by one are
removed from the coupled operator together with every edge triplet they belong
to. A kept sample takes its own sampled inverse permittivity for the one-eighth
share of each dropped triplet, so the coupled operator remains an equal-weight
sum of spectrally bounded Hermitian 3x3 blocks; the global instantaneous
operator is block diagonal with eigenvalues in `(0, 1]` and the vacuum CFL bound
is unchanged. A
residue below `1e-12` of the metal strength is decomposition round-off of a
vanishing pole and is set to zero.

The long-run evidence is `tests/test_subpixel_dispersive.py`: a closed periodic
box with a Drude sphere and a dielectric slab started from random fields keeps a
bounded state norm without growth for 3,000 steps (default suite) and 200,000
steps (`long`), lossless and damped. The same module checks the pole form
against the direct laminate (relative `1e-12`, including the degenerate normals),
the bilinear discrete response of `InterfaceADE` (relative `1e-5`), exact slab
fractions and branches, the refusals, and CPU, Torch CUDA, fused CUDA and tensor
cohort agreement.

**Choice of diagonal.** Development runs on a 2D Drude cylinder and on 3D Drude
spheres of sizes other than the judged G3-05 ones compared three diagonals: the
fill-fraction average of `eps_m` alone was worse than staircase; the diagonal of
the tensor `(1 - n_c^2) eps_par + n_c^2 eps_perp` was best in 2D but worst in
3D; the diagonal of the inverse tensor above was the best in 3D. In 3D a clear
excess of absorption remains on the red side of the plasmon band, where the
laminate resonance of each mixed cell lies; a longer run time does not change
it. Curved metal interfaces are therefore not yet within the accuracy claims of
this method; the off-diagonal dispersive coupling of the full tensor is the
next step.

**Execution.** The resident CPU, Torch CUDA and fused CUDA forwards and the
tensor cohorts run it through the shared ADE prepare/correct path. Complex fused
updates, the differentiable and reversible solvers, streamed and budgeted
execution, the tensor-material path, mode ports and PMC/endpoint scenes refuse
subpixel scenes as before. `result.summary["subpixel"]["dispersive"]` reports the
mixed and full samples and the range of `eps'`; the permittivity image shows
`eps'` at mixed samples.

Reproduce checks with `python -m pytest tests/test_subpixel.py` and the commands
in the validation report. The UI selection/run check is
`npx playwright test tests/ui/subpixel.spec.js` against a running workbench.
