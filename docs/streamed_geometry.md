# Streamed analytic geometry

`streamed_geometry` passes a small differentiable parameter packet to FDTD.
It evaluates only the current slab and reduces its epsilon transpose directly
to shape and material scalars. Neither a full-domain epsilon array nor its
full-domain input gradient is created. Fields still require host or disk banks.

```python
import torch
from torchfdtd import (
    DifferentiableSolid, StreamedAdjointOptions,
    StreamedGeometrySimulation, streamed_geometry,
)

# project is an existing fixed-step project with point monitors.
# Its default precision is float32. Parameters must match its precision.
radius = torch.tensor(0.24, dtype=torch.float32, requires_grad=True)
material = streamed_geometry(
    project.region,
    [DifferentiableSolid.sphere(radius, epsilon=3.1)],
    width=0.08,
    chunk_cells=16384,
)
model = StreamedGeometrySimulation(project, StreamedAdjointOptions(
    device='cuda', slab_width=16, temporal_depth=4, checkpoints=2,
    state_storage='disk', state_directory='scratch/geometry-banks',
    host_budget_bytes=8 * 1024**3,
    disk_budget_bytes=100 * 1024**3,
    disk_free_reserve_bytes=100 * 1024**3,
))
result = model(material)
loss = result.signals.square().sum()
loss.backward()
print(radius.grad)
```

Choose budgets for the workload and scratch volume. This example reserves
100 GiB of free disk space in addition to its 100 GiB scratch allowance. On the
GPU workstation, also retain at least 16 GiB of available RAM beyond the chosen
host budget (at least 24 GiB available for the 8 GiB example). Check those margins
before execution. They are workstation requirements, not universal defaults.

For field-plane monitors, use `StreamedGeometryPlaneSimulation` with the same
options and call `model(material, frequency_hz)`. It returns the existing
monitor-ID mapping of `DifferentiablePlaneResult` objects. Their `flux()` and
`normalized_flux(reference)` methods retain gradients through the geometry.
Build the homogeneous reference with `streamed_geometry(region, [],
background=...)`. Rebuild the material packet from current optimizer parameters
on each optimization iteration.

Yee and cell sampling, ordered overlaps, rotations, and the smooth transition
match `smooth_geometry_epsilon`. Slab halos repeat primary-domain material
indices for periodic and Bloch boundaries. Every replicated halo contribution
is included in the parameter reduction. Material values carry no Bloch phase.
Explicit copies of solids are still needed to define geometry crossing a seam.

Admission includes the packed parameters and VJPs, coordinate axes, bounded
geometry recomputation graph, material and seed tiles (including a possible
noncontiguous seed reshape copy), and plane layout storage when used. The
geometry graph bound depends on `chunk_cells` and the number of solids, while
the slab width and temporal depth bound material tile storage. Coordinate axes
scale with the sum of the grid dimensions. No dense geometry map is cached.
Each run snapshots the coordinate axes and immutable shape/settings after
admission. Replay reads this private snapshot, so later caller mutations of the
original axes or region cannot silently alter the backward result. The snapshot
axes and metadata are explicitly charged. Plane construction separately checks
a conservative layout bound before allocating Cartesian points, interpolation
maps or observers. This bound can exceed the eventual deduplicated layout size.

This is a first-order, nondispersive staircase-coefficient API. One-way source
injection is currently rejected because its material validator expects a dense
array. Only box, ellipsoid and cylinder solids are streamed; the
[polygon and spline solids](SHAPE_GRADIENTS.md) are rejected here and use the
dense `smooth_geometry_epsilon` path. TFSF and dispersive geometry are
outside this path. Automatic execution
tuning and `PeriodicDesignConfig` do not yet route to this producer. Existing
manual point and plane runs can use it directly.

Correctness tests cover CPU host and disk banks, repeated periodic indices,
complex Bloch online spectra, CUDA asynchronous tiles, and normalized plane
flux gradients against the dense material path. Allocation tracing checks a
long disk-backed run for full-domain material or VJP allocations. These tests
do not establish performance or successful operation above 48 GB.
