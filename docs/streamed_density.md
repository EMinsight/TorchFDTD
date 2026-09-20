# Periodic density streaming

`PeriodicLayerResponse` now uses bounded density material production whenever
its `AdjointExecutionPolicy` selects streamed execution. This applies to host
and disk field banks. The resident path retains `periodic_density_layer` and its
dense epsilon array.

The streamed path accepts the same CPU `(Nx_density, Ny_density)` tensor and
returns the same `(2, 4)` Cartesian-polarization response. It synthesizes one
extended x slab at a time and reduces each slab's material adjoint directly to
the 2D density. There is no global 3D epsilon array or global epsilon gradient.
The two source-basis cases still execute sequentially and replay individually
for backward through the existing shared-budget batch scheduler.

```python
import torch
from torchfdtd import (
    AdjointBatchOptions, AdjointExecutionPolicy, PeriodicLayerResponse,
    StreamedAdjointOptions,
)

# spec is the existing fixed periodic optical specification.
host_budget = 8 * 1024**3
gpu_budget = 4 * 1024**3
disk_budget = 100 * 1024**3
tiles = StreamedAdjointOptions(
    device='cuda', slab_width=16, temporal_depth=4, checkpoints=2,
    host_budget_bytes=host_budget, gpu_budget_bytes=gpu_budget,
    state_storage='disk', state_directory='scratch/density-banks',
    disk_budget_bytes=disk_budget, disk_free_reserve_bytes=100 * 1024**3,
)
model = PeriodicLayerResponse(
    spec, density_shape=(32, 32), mesh=0.04, steps=1000,
    policy=AdjointExecutionPolicy(streamed=tiles, device='cuda',
                                 host_budget_bytes=host_budget),
    batch_options=AdjointBatchOptions(host_budget_bytes=host_budget,
        gpu_budget_bytes=gpu_budget, disk_budget_bytes=disk_budget),
)
density = torch.full((32, 32), 0.5, dtype=torch.float32, requires_grad=True)
print(model.plan()['material_input'])  # streamed_density
response = model(density)
response.square().sum().backward()
```

Budgets and physical resolution above are examples, not a convergence result or
a guarantee of admission. Retain at least 100 GiB free scratch-volume space and
16 GiB available RAM beyond the chosen host budget on the GPU workstation. The
library checks configured budgets and current capacity again before execution.

The producer uses exactly the existing arithmetic-volume transfer conventions:
periodic xy overlap weights, separate Ex/Ey/Ez Yee locations, either density
pixel origin, and the fixed lower/upper layer interface fractions in z. Wrapped
halo rows repeat primary-cell material without Bloch phase. Their transpose
contributions are all accumulated. Overlap matrices are rebuilt per component
and slab rather than cached as a global xy map. The producer and transpose run
on CPU, even when field tiles use CUDA.

Homogeneous reference solves use zero density with the same background epsilon.
Reference polarization calibration, coherent field mixing, detector ordering,
flux normalization and response-cache derivatives retain their previous
semantics. Streamed reference-cache keys use a new producer-specific version,
so old dense-path cache entries are not silently reused. Resident keys remain
unchanged.

Admission includes 2D parameter/gradient carriers, overlap/matrix-product
workspace, real material/seed tiles, immutable axis snapshots, field replay,
plane layouts, output buffers and reference caches. Plane layout construction
is checked before allocating Cartesian points or interpolation maps. Caller
optimizer state, unrelated process allocations and OS file cache remain outside
the solver's accounting.

Direct material APIs are also available: `streamed_density_layer`,
`StreamedDensitySimulation` and `StreamedDensityPlaneSimulation`. They support
fixed uniform 3D Yee grids with periodic/Bloch x and y boundaries. Heights and
selected-frequency lossless permittivities are fixed, and derivatives are first
order in density only. One-way injection, TFSF and dispersive density models are
not supported by this producer.

Synthetic tests compare material values, density VJPs, full two-polarization
responses and gradients against the existing dense path. They include both
pixel origins, fractional-height interfaces, repeated periodic seams, host/disk
storage and cache reuse. These checks do not establish large-workstation
throughput, optical convergence, or operation above 48 GB. Existing remote CR
jobs and their frozen inputs are not changed by these local tests.
