# Polygon and spline shape gradients

`DifferentiableSolid.polygon` and `DifferentiableSolid.spline` add extruded
simple contours to the [regularized geometry VJP](DIFFERENTIABLE_GEOMETRY.md).
Vertex coordinates, spline control points, the two local z limits, the
three rotation angles, the center and the permittivity are Torch tensors
whose gradients flow through `smooth_geometry_epsilon` into the checkpointed
FDTD adjoint. The native `Structure(kind='polygon')` sampler, `voxelize` and
the GDS importer are unchanged; the differentiable path is a separate solid.

```python
import torch
from torchfdtd import DifferentiableSolid, smooth_geometry_epsilon, spline_outline

vertices = torch.nn.Parameter(torch.tensor([[-.18, -.15], [.14, -.2], [.21, .05], [.02, .19], [-.2, .1]]))
controls = torch.nn.Parameter(torch.tensor([[-.3, -.2], [.3, -.25], [.35, .1], [0., .3], [-.3, .15]]))
angle = torch.nn.Parameter(torch.tensor(15.))
solids = [
    DifferentiableSolid.polygon(vertices, (-.11, .11), epsilon=4., rotation=(0., 0., angle)),
    DifferentiableSolid.spline(controls, (-.3, -.12), epsilon=2.1, kind='bspline',
                               samples_per_segment=8, center=(0., 0., .5)),
]
epsilon = smooth_geometry_epsilon(project.region, solids, width=.08)
result = model(epsilon)          # DifferentiableSimulation or DifferentiablePlaneSimulation
result.signals.square().sum().backward()
```

Vertices and control points are local (x, y) pairs in micrometres. The
contour is extruded between the two local z limits and then rotated about
`center` with the same fixed-axis convention (x, then y, then z, degrees) as
the other solids, so the in-plane rotation is the third angle. Clockwise and
counterclockwise contours are accepted. The sampled contour must be a simple
polygon with 3 to 2048 vertices; the same validator that guards the native
polygon structure rejects crossings, touching edges and zero area, so a
self-intersecting spline raises `ValueError` instead of producing a fill.
The `holes` keyword mirrors the native structure's field but a nonempty
value raises `ValueError`; holes are not differentiated. Overlay a second
solid with the background permittivity in the existing precedence order
instead.

## Formulation

For a sample point `p` the local coordinate is `q = Rᵀ (p - c)`. Let
`d(q_xy)` be the signed Euclidean distance to the contour, positive inside by
the even-odd parity rule, with `|d|` the minimum over edges of the
point-to-segment distance. Let `s(q_z) = min(q_z - z_lo, z_hi - q_z)` be the
signed slab distance. With the cubic step used by every solid,

```text
S(t) = u² (3 - 2u),   u = clamp(t / w + 1/2, 0, 1)
occupancy = S(d) · S(s)
epsilon_next = (1 - occupancy) · epsilon_previous + occupancy · epsilon_solid
```

`w` is the fixed physical transition width in micrometres, by default the
reference mesh step. As `w → 0`, `S(d)` tends to 1 inside, 0 outside and
1/2 exactly on the contour, so the fill reduces to the even-odd sampling of
`voxelize` at every sample that is not exactly on the contour or on an
extrusion face. The test compares both paths on the same rotated pentagon
and checks the sampler's SHA-256 against its value before this change.

A closed spline outline is a polygon whose vertices are linear in the
control points. Segment `i` blends `P_{i-1}, P_i, P_{i+1}, P_{i+2}` with
periodic indexing at `u = 0, 1/s, ..., (s-1)/s`:

```text
bspline:      [u³ u² u 1] · (1/6) [[-1 3 -3 1] [3 -6 3 0] [-3 0 3 0] [1 4 1 0]]
catmull_rom:  [u³ u² u 1] · (1/2) [[-1 3 -3 1] [2 -5 4 -1] [-1 0 1 0] [0 2 0 0]]
```

Catmull-Rom passes through each control at its segment start; the B-spline
starts each segment at `(P_{i-1} + 4 P_i + P_{i+1}) / 6`. `spline_outline`
exposes the sampled vertices for a tensor of controls, and the solid stores
the controls so that lists adopt the region precision like other inputs.

## VJP construction

The forward stores only the packed parameters and the one-dimensional axes.
The backward replays one spatial chunk and one electric component at a time,
as before. Parameters are packed as one flat vector with a per-solid layout:
ten values for boxes, ellipsoids and cylinders, and `9 + 2N` values for a
polygon (center, z limits, rotation, permittivity, vertices). The existing
solids evaluate the same arithmetic on the same values; the regression test
holds their FP64 forward hash and gradients fixed to their previous values.

Inside each chunk the nearest edge index and the parity sign are found
without gradient, in blocks of 64 edges, so the transient search costs
`O(chunk_cells × 64)` and never retains an `O(chunk_cells × N)` graph. The
distance is then recomputed from the selected edge alone:

```text
t = clamp(((q - a)·(b - a)) / |b - a|², 0, 1)
d = sign · sqrt(|q - a - t (b - a)|² + tiny)
```

Because `t` is the constrained minimizer of that quadratic, its derivative
does not contribute (envelope condition), and the result equals the
derivative of the true distance with respect to `a`, `b` and `q` wherever
the nearest point is unique. Center and rotation gradients arrive through
`q`. Two cases are only subgradients: on the medial axis, where two edges
are equally close at different points, the distance is Lipschitz but not
C¹ and the first minimal edge is used; and at a vertex that coincides with
a sample point, where `|q - a|` is a cone and the `tiny` offset returns a
finite value. Both are measure-zero sets. A control point placed exactly on
a Yee sample is the practical way to hit the second case, so the tests use
off-grid coordinates.

## Focused tests

`python -m pytest -q -p no:cacheprovider tests/test_shape_gradients.py`

- Reduction to the sampler and a bitwise-unchanged `voxelize` for Yee and
  cell sampling in FP32 and FP64.
- FP64 Taylor remainder and central difference of the voxel VJP on CPU and
  CUDA with all nineteen polygon parameters trainable (vertices, z limits,
  rotation, center, permittivity) and a noncontiguous seed. The remainder
  falls from 7.9e-3 at step 1e-3 to 4.5e-4 at step 2.5e-4, and the
  central difference at step 1e-5 matches the slope to 2e-4.
- Spline interpolation identities, periodic equivariance, `gradcheck` of the
  outline map and central differences of the control-point gradient through
  the fill (relative agreement 1e-4 at step 1e-5; the observed values are
  2e-8 for Catmull-Rom and 3e-8 for B-spline).
- Vertex and control-point gradients through `DifferentiableSimulation`
  point signals, point spectra and `DifferentiablePlaneSimulation` plane
  flux against FP64 central differences on CPU, and against the full-autograd
  reference on CUDA in FP32 (relative 3e-4).
- Input contracts and an unchanged `DensityParameterization` gradient.

## Physical convergence with mesh refinement

`python -m benchmarks.shape_gradient_polygon --output docs/validation/shape_gradient_polygon_3060.json`

The problem is a 2D TM periodic grating of dielectric pentagon pillars
(relative permittivity 4, period 0.6 micrometres, vertices at off-grid
coordinates) in air, illuminated at normal incidence by a one-cycle
1.55 micrometre plane pulse. The domain is 4 by 0.6 micrometres with
0.24 micrometre CPML on the x faces, a 60 fs window and a time step scaled
so that every mesh reaches the same physical time. The objective is the
transmitted flux at 1.55 micrometres normalized by a matched air reference.
The gradient is the ten-component derivative with respect to the vertex
coordinates.

There is no closed-form shape derivative for a pentagon, so the reference is
the same regularized fill at a finer mesh (0.005 micrometres, FP64) with
central differences of the forward solver over each vertex coordinate, at
steps 0.002 and 0.001 micrometres. The declared tolerances, fixed in the
benchmark before it ran, are a relative L2 error below 3% at the finest
adjoint mesh, strictly decreasing error over the three fixed-width meshes,
a step-halving change of the reference below 0.5%, conservation
`|T + R - 1|` below 5e-4, and duration, PML and precision controls that
change T by less than 1e-4 and the gradient by less than 2e-3 relative.

| Group | Mesh (um) | Width (um) | Width (cells) | Precision | T | Relative L2 gradient error | Max component error / norm | Cosine |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fixed width | 0.040 | 0.08 | 2 | float32 | 0.8819762 | 11.592% | 8.342% | 0.993428 |
| fixed width | 0.020 | 0.08 | 4 | float32 | 0.8811862 | 1.778% | 1.099% | 0.999842 |
| fixed width | 0.010 | 0.08 | 8 | float32 | 0.8811333 | 0.509% | 0.229% | 0.999987 |
| narrow width | 0.020 | 0.04 | 2 | float32 | 0.8750337 | 5.385% | 3.481% | 0.998562 |
| narrow width | 0.010 | 0.04 | 4 | float32 | 0.8749074 | 0.988% | 0.519% | 0.999953 |
| precision control | 0.010 | 0.08 | 8 | float64 | 0.8811329 | 0.509% | 0.229% | 0.999987 |
| duration control | 0.010 | 0.08 | 8 | float32 | 0.8811331 | 0.509% | 0.230% | 0.999987 |
| pml control | 0.010 | 0.08 | 8 | float32 | 0.8811329 | 0.509% | 0.229% | 0.999987 |

Errors are measured against the FP64 central-difference reference at
0.005 micrometres with the 0.001 micrometre step and the same width. The
reference rows and their step-halving consistency are:

| Width (um) | Step (um) | T | Gradient norm (per um) | Change on halving the step |
| --- | --- | --- | --- | --- |
| 0.08 | 0.002 | 0.8811164 | 1.56921 |  |
| 0.08 | 0.001 | 0.8811164 | 1.56903 | 0.066% |
| 0.04 | 0.002 | 0.8748857 | 1.60639 |  |
| 0.04 | 0.001 | 0.8748857 | 1.60642 | 0.055% |

The staircase forward transmission (vanishing width, FP64) is 0.8730281 at
0.01 micrometres and 0.8729182 at 0.005 micrometres, against 0.8811164 for
width 0.08 and 0.8748857 for width 0.04 at 0.005 micrometres. The FP64,
90 fs and 0.30 micrometre PML controls at 0.01 micrometres change T by at
most 4.4e-07 and the gradient by at most 5.8e-06 relative. The largest
conservation residual over all rows is 2.0e-05, in the 0.04 micrometre
adjoint row. All nine declared checks in the record passed:
`reference_step_halving_0.08`, `reference_step_halving_0.04`,
`fixed_width_errors_decrease`, `fixed_width_fine_error`,
`narrow_width_fine_error`, `conservation`, `precision_control`,
`duration_control` and `pml_control`.

The reference gradient is the derivative of the width-regularized problem,
not of a sharp dielectric pentagon. The two width rows differ by a bias that
mesh refinement cannot remove, and the staircase forward rows show the same
trend for T itself. This experiment supports mesh convergence of the
polygon vertex gradient to the fine-mesh regularized derivative for one
polarization, one frequency, normal incidence and resolved widths of at
least four cells. It does not establish an asymptotic order, sharp-interface
convergence, 3D or rotated-extrusion convergence, or oblique incidence.

## Limits

- The width is fixed per graph. Choose it after a mesh and width study: the
  two-cell rows above still carry 11.6% and 5.4% error, and a transition
  below the mesh resolution can give sampling-phase dependent or vanishing
  derivatives, as the [planar slab study](gradient_mesh.md) found.
- Vertex count and topology are fixed; there is no vertex insertion, hole
  contour, or fabrication constraint on polygons. Density parameterizations
  keep their separate filter, symmetry and projection contract.
- The extruded occupancy is the product of the contour and slab steps, not
  the exact signed distance to the prism; edges and corners of the extrusion
  therefore differ slightly from a Euclidean smoothing.
- The subpixel interface operator remains non-differentiable; regularized
  solids supply diagonal epsilon only.
- Only first derivatives exist through the replayed backward.
- Very dense outlines increase the nearest-edge search cost linearly in
  the vertex count; reduce `chunk_cells` if the transient blocks exceed the
  available memory.
