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

The present scope is isotropic, lossless, nondispersive dielectrics, 2D or 3D,
with constant spacing on each axis. Different x/y/z spacings are supported.
Active dispersive materials and nonuniform nodes raise validation errors.
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
- Dispersive interface mixtures, nonuniform subpixel metrics and independent
  equal-error performance comparisons remain required follow-up work.

Reproduce checks with `python -m pytest tests/test_subpixel.py` and the commands
in the validation report. The UI selection/run check is
`npx playwright test tests/ui/subpixel.spec.js` against a running workbench.
