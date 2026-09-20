# Parameterized geometry with bounded backward replay

`DifferentiableSolid` and `smooth_geometry_epsilon` connect box dimensions,
ellipsoid radii, cylinder radius and height, positions, rotations and scalar
permittivities to the existing FDTD adjoint. Shared Torch parameters accumulate
all their contributions, including parameters reused by several solids.

```python
import torch
from photonweave import DifferentiableSolid, smooth_geometry_epsilon

# project and model are an existing matching FDTD project and adjoint model.
# Use CPU parameters when model is a StreamedSimulation.
radius = torch.nn.Parameter(torch.tensor(.22, device="cuda"))
height = torch.nn.Parameter(torch.tensor(.36, device="cuda"))
angle = torch.nn.Parameter(torch.tensor(15., device="cuda"))
optimizer = torch.optim.Adam([radius, height, angle], lr=.002)

optimizer.zero_grad()
solids = [DifferentiableSolid.cylinder(
    radius, height, radius_y=.17, epsilon=3., rotation=(0., angle, 10.),
)]
epsilon = smooth_geometry_epsilon(
    project.region, solids, width=.1, chunk_cells=65536,
)
result = model(epsilon)
loss = -result.signals.square().mean()
loss.backward()
optimizer.step()
```

Rebuild the solids and epsilon after every optimizer update. Sizes must stay
positive and permittivities must remain at least one for the solver's CFL
contract. Lengths use micrometres and rotations use degrees. The rotation is
about the solid center, with fixed world axes x, y and then z. Box sizes are
full spans. Ellipsoid inputs are three radii. The cylinder axis is local z,
with an optional independent local-y radius.

The default dtype follows the region, normally FP32. Tensor inputs must share
that dtype and device. There is no automatic FP64 conversion. A scalar
background permittivity can also be a trainable tensor. The output uses the
region's cell locations or three staggered electric-component locations.
Fixed rectilinear coordinates are supported. Periodic copies must be supplied
as explicit solids. The function does not wrap or clip a solid automatically.

## Geometry and memory contract

Each occupancy uses a compact cubic transition
`u² (3 - 2u)`, where `u = clamp(distance / width + 1/2, 0, 1)`.
Boxes multiply three slab occupancies. Ellipsoids use the normalized radial
level set multiplied by the smallest radius. Cylinders multiply the analogous
elliptical occupancy by the axial slab occupancy. The radial level set is not
the exact Euclidean distance to an ellipsoid. The smallest-radius scaling is
piecewise differentiable, with Torch's shared subgradient at equal radii.

Later solids overlay earlier ones with arithmetic interpolation:
`epsilon_next = (1 - occupancy) * epsilon_previous + occupancy * epsilon_solid`.
This gives explicit overlap precedence and a differentiable regularized model.
It is not sharp CAD membership, volume averaging, the coupled subpixel interface
operator or proof of physical sharp-interface gradient convergence. Keep width
fixed during a graph and study mesh and smoothing convergence separately.

Forward stores only packed solid parameters, background and one-dimensional
coordinate arrays for its custom backward. The backward replays one spatial
chunk and one electric component at a time. For N cells, S solids and chunk
size C, the geometry graph workspace scales as O(C S), instead of retaining
O(N S) intermediate geometry arrays. The output epsilon and incoming material
VJP still require O(N) storage. Caller geometry and optimizer allocations are
outside the FDTD execution-policy budgets. This does not yet provide a streamed
material-map producer that avoids the dense output.

Only first derivatives are supported by this replay implementation. Shape
creation, topology changes, smoothing width, mesh locations and periodic phase
are fixed. Splines, polygons and arbitrary imported CAD are follow-up work.

## Example and focused validation

```powershell
python -m examples.differentiable_shape_design --device cuda --execution dram --iterations 2
```

The complete example optimizes radius, height and tilt in FP32, using resident
or DRAM execution, and evaluates the final updated geometry before writing its
history. Its local point-field energy objective is not normalized transmission
or a claim of a useful optimized optical device.

Six focused tests cover independent rotated-box membership and Yee locations,
overlap precedence, a directional finite-difference geometry derivative,
noncontiguous incoming material VJPs, retained-tensor scaling, CPU/CUDA FDTD
adjoints and spatial replay, background gradients and invalid input rejection.
FP64 is used only in the finite-difference derivative check. The optical-chain
checks and optimization example use FP32. Small grids verify the new chain and
do not establish beyond-VRAM capacity or a performance advantage.
