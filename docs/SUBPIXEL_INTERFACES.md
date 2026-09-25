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
isotropic Drude/Lorentz/multipole dispersive materials, 2D or 3D, with constant
spacing on each axis. Different x/y/z spacings are supported. Nonuniform nodes,
two dispersive materials in one node cell, a dispersive surface within one
averaging window (two cells) of a nonperiodic grid boundary and
`pml_dispersion="frozen"` with a dispersive structure raise validation errors. Dispersive cells use the
construction of [Dispersive interfaces](#dispersive-interfaces) below.
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
- Cells mixing two dispersive materials, nonuniform subpixel metrics and
  independent equal-error performance comparisons remain required follow-up work.

## Dispersive interfaces

Node cells that meet a dispersive object leave the coupled operator above and
take the dispersive averaging tensor of `torchfdtd.subpixel_dispersive`. A node
cell here is the box of `WINDOW` = 2 mesh steps per axis centred on a Yee node.
When it holds a fraction `f` of one dispersive medium `eps_m(w)` (any number of
Drude or Lorentz poles) and nondispersive media elsewhere, with `C` and `B` the
cell averages of `eps` and `1/eps` over the nondispersive part and `n` the unit
normal of the dispersive surface, the constitutive map `E = Z D` of the cell is

```text
Z(w) = n n^T (B + f/eps_m(w)) + (I - n n^T)/(C + f eps_m(w))
```

the averaging tensor of Farjadpour et al. (Opt. Lett. 31, 2972, 2006) and
Kottke, Farjadpour and Johnson (Phys. Rev. E 77, 036611, 2008) with its
dispersive response split into the normal (series) and tangential (parallel)
laminate branches, as in Deinega and Valuev (Opt. Lett. 32, 3429, 2007). The
fractions and averages come from the analytic line integrals of the geometry
pass with `subpixel_quadrature` Gauss-Legendre nodes on the other two axes.

**Assembly.** As in the coupled operator, each node contributes through its
eight edge triplets with weight 1/8. For one tensor per node this gives the edge
of axis `a` on side `s` the share `1/2 [(Z Dbar)_a + s Z_aa delta_a]`, where
`Dbar` and `delta` are the half sum and half difference of `D` on the two edges of
each axis. The node kinds are:

- **Mixed** (`0 < f < 1`): the share above. Five D-driven banks advance it:
  - the medium in series with `B` for the normal part of `Dbar`;
  - the laminate `C + f eps_m` for its tangential part;
  - the same two for the `Z_aa delta_a` terms.
- **Whole** (`f = 1`): the node gives each adjacent edge whose other end is not
  whole the share `1/2 D/eps_m` (a D-driven bank per edge). An edge between two
  whole cells keeps the ordinary ADE of the material.
- **Next** (nondispersive cells adjacent to a mixed or whole cell): the static
  tensor `n n^T B + (I - n n^T)/C` in the coupled operator, without its coupling
  between a D-driven edge and an E-updated edge. What remains is a block-diagonal
  principal part of the tensor, so it stays positive and within the bounds.
- **Ordinary:** unchanged.

Edges with a mixed or whole end ("D-driven samples") keep `D` as their state,
advanced by `c curl(H)` each step. Every bank solves `eps x + sum_j P_j = d`
with the trapezoidal update of the ADE for its share `d` of the new `D`. The E
of a D-driven sample is then assigned from `D`: the static share of a next-cell
end (its diagonal and couplings, which link D-driven samples only) plus the bank
outputs. E there is never incremented, so neither a direct write nor rounding
leaves a lasting offset between E and the E of its `D`. An incremented E, as in
the first version of this method, kept such an offset as a static source: one
E perturbation at the D-driven samples grew |H| linearly in lossless scenes.

**Passivity and stability.** Each branch is a passive medium driven by `D`, so
every node share is a passive impedance. The discrete response is the bilinear
image of `Z(w)` at `(2/dt) tan(w dt/2)`, as for every ADE material. The
high-frequency value of each share is at most one (`B + f/eps_inf <= 1` and
`1/(C + f eps_inf) <= 1` for permittivities `>= 1`), so the instantaneous
operator, static and dispersive together, is Hermitian and positive with
eigenvalues in `(0, 1]`, and the vacuum CFL bound is unchanged.
`tests/test_subpixel_dispersive.py` checks each of these claims:

- the assembled instantaneous operator is Hermitian and bounded, for real and Bloch fields;
- the complete one-step map (fields, ADE and dispersive states) has no eigenvalue outside the unit circle for damped Drude media: a sphere in a 6^3 periodic box (real and Bloch), a 2D cylinder, a slab whose faces sit a hair inside and outside node windows, and a slab tilted by 3 degrees. A lossless Drude medium carries persistent currents, Jordan chains at 1 in which `P` and `D` grow while the fields stay put (the staircase update of the same slab has them as well), so its spectral radius is 1 up to a rounding-dependent 1e-8 and the lossless scenes are checked by their field norms;
- the driven state reproduces the static share plus the node tensors at the bilinear frequency (relative 2e-6), for a Drude and a two-pole material;
- a regression guard, not a judged case, for a two-pole (Drude plus Lorentz) metal: a TE cylinder of radius 0.05 um off the node lattice at h = 0.01 um stays within 10 percent (scattering) and 100 percent (absorption) of the infinite-cylinder Mie series and within a third of the staircase errors. These limits come from one development run (3.6 and 47 percent, against 24 and 932 percent for staircase) with a margin of about two;
- closed boxes started from random E and H keep a bounded state norm for 3,000 steps (default suite) and 200,000 steps (`long`), lossless and damped, for the sphere, a two-pole material, the lossless cylinder and both lossless slabs;
- an E write at the D-driven samples between the E and H updates leaves no static source: over 4,000 steps |H| stays within 10 times its one-step kick, lossless and damped.

**Window and development record.** Development runs chose the window of two
steps: a 2D TE Drude cylinder of radius 0.05 um at h = 0.01 to 0.0025 um, and
3D Drude spheres centred on a node in the G3-05 fixture (its domain, PML, TFSF
box, monitors and band) at h = 0.005 um, the judged mesh of G3-05, with radii
0.018 to 0.055 um that bracket its judged radii within 10 percent. Windows of
0.75 to 3 steps were compared. With one step, each mixed cell's laminate
resonance adds absorption at the blue edge of the plasmon band. Two steps
reduce the largest scattering and absorption errors by factors of 1.5 to 4 on
every development sphere. Wider windows oversmooth spheres of four cells per
radius. Because this development used the G3-05 fixture and its neighbourhood,
G3-05 does not judge the method. The held-out case G3-05r4
(`docs/validation/cases/G3-05r4.json`, other radii, spheres off the node
lattice) does, and it lists every development run.

**Scope and refusals.** Resident CPU, Torch CUDA and fused CUDA forwards, CUDA
graphs and tensor cohorts share the state: the fused kernel writes the curl
buffer and the D-driven banks run after it. The following raise errors:

- two dispersive materials in one node cell;
- a dispersive surface within one window of a nonperiodic grid boundary, so a
  metal film or waveguide that runs into the PML needs staircase interfaces;
- `pml_dispersion="frozen"` with a dispersive structure;
- a soft E source, a TFSF face neighbourhood or a one-way injection
  neighbourhood on a D-driven sample. Their E is assigned from `D` each step,
  so a direct E write there would be discarded. The TFSF and one-way checks see
  the D-driven samples with their material, although the ADE ownership map
  leaves them unowned.

Complex fused updates, the differentiable and reversible solvers, streamed and
budgeted execution, the tensor-material path, mode ports and PMC/endpoint scenes
refuse subpixel scenes as before.

`result.summary["subpixel"]["dispersive"]` reports the mixed, whole-surface and
next nodes, the D-driven samples and `device_bytes`, the modelled device memory
of the state (branch states and coefficients, their norm weights, the node
data, `D`, the full-volume norm weights and the temporaries of one update). The
resident estimate adds an upper bound of it before planning: every node within
one window of a dispersive object's bounding box counted as a mixed node. The permittivity image shows the reciprocal
of the instantaneous diagonal. The state norm weighs E with it and adds the
branch energies weighted by their share of `Z`. The construction is first order
at curved surfaces, and the two-step window smooths features thinner than about
two cells, such as thin films.
