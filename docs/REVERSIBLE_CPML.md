# Recorded-interface CPML differentiation

`ReversibleCPMLSimulation` is an opt-in, experimental material-gradient API for a lossless dielectric interior surrounded by a fixed absorbing exterior. It runs the native full-domain CPML forward update, records a small boundary history, and reconstructs the interior during backward instead of replaying volume checkpoints.

It is separate from the lossless all-periodic `ReversibleSimulation`. Boundary recording and interior reconstruction are established ideas in reverse-time wave simulation. This implementation does not claim a new recording principle, overall FDTDX feature parity, or a speed advantage.

## Supported contract

The admitted problem has uniform 3D Yee sampling, staircase interfaces, real FP32 fields and scalar nondispersive permittivity. Both x and y faces must be periodic with zero Bloch phase. Both z faces must use CPML. The timestep count is fixed and fields remain resident on CPU or CUDA.

Sources are fixed soft electric point increments. Each resolved polarization component must sample inside the reconstruction interval. Observations are point E/H samples after each complete native step. Current Project validation requires sources and monitors inside the non-PML physical region. Monitors may lie in the fixed non-PML collar outside the reconstructed interval.

Bloch boundaries, anisotropic or diagonal tensor materials, ADE dispersion, nonuniform meshes, subpixel interfaces, spatial streaming, adaptive stopping, H sources, one-way/TFSF injection, and spatial field monitors are outside this API. The derivative contract is first order. The API does not differentiate source settings or the boundary configuration.

## Material parameters and the fixed exterior

Call the model with two contiguous, resolved FP32 tensors of the full grid shape on the same CPU or CUDA device:

```python
result = model(epsilon, fixed_epsilon=background)
```

Both maps must be finite with values at least one. `fixed_epsilon` must not require gradients. Geometry declarations do not rasterize these inputs automatically: the two tensors supply the actual sampled scalar permittivity.

`model.interior_z` returns inclusive indices `(a, b)`. The forward material is defined by:

```python
effective = fixed_epsilon.clone()
effective[:, :, a:b + 1] = epsilon[:, :, a:b + 1]
```

Consequently, the derivative with respect to `epsilon` is exactly zero outside that interval. This is the actual derivative of the declared parameterization, not an unrestricted full-domain material gradient subsequently discarded in the exterior. Source cells inside the interval receive their actual material derivative because the impressed increments are fixed independently of epsilon. To keep additional design cells fixed, use a differentiable mask such as `torch.where` before calling the model.

The interval comes from the union of the actual staggered E- and H-update CPML descriptor rows. `collar_cells` removes additional lossless rows on each side, with a minimum of one. Excessive CPML thickness or collar width is rejected if fewer than two reconstruction planes remain. Sources use the native nearest-Yee sampling convention, checked independently for each resolved component.

## Complete CPU optimization example

Geometry and wavelength values below are in micrometres, while pulse times are in seconds. This small example performs two material optimization iterations with a simple point-signal objective. It is not a converged device design.

```python
import torch
from torchfdtd import (
    Project, Region, Source, Monitor,
    ReversibleCPMLSimulation, ReversibleCPMLOptions,
)

boundaries = {
    face: {"kind": "periodic"}
    for face in ("x_min", "x_max", "y_min", "y_max")
}
boundaries.update(
    z_min={"kind": "pml", "layers": 3},
    z_max={"kind": "pml", "layers": 4},
)
project = Project(
    region=Region(
        dimension="3d", size=(0.6, 0.6, 2.0), mesh=0.1,
        mesh_type="uniform", material_sampling="yee",
        precision="float32", backend="cpu", steps=128,
        boundaries=boundaries,
    ),
    sources=[Source(
        name="drive", kind="point", injection="soft", component="Ex",
        center=(0.0, 0.0, 0.0), wavelength=1.55,
        pulse="gaussian", time_definition="standard",
        pulse_length=3e-15, pulse_offset=6e-15,
    )],
    monitors=[
        Monitor(name="electric", component="Ex", center=(0.0, 0.0, 0.2)),
        Monitor(name="magnetic", component="Hy", center=(0.0, 0.0, 0.3)),
    ],
)
options = ReversibleCPMLOptions(
    collar_cells=1,
    trace_storage="cpu",
    host_budget_bytes=512 * 1024**2,
    resident_budget_bytes=512 * 1024**2,
    reconstruction_tolerance=1e-3,
)
model = ReversibleCPMLSimulation(project, options)
a, b = model.interior_z
plan = model.plan(device="cpu")  # Metadata admission, no field simulation.
print("Inclusive design interval:", (a, b))
print("Trace bytes:", plan["trace_bytes"])
print("Resident reservation:", plan["memory_reservation_bytes"])

background = torch.ones(project.region.shape, dtype=torch.float32)
epsilon = torch.nn.Parameter(torch.full_like(background, 2.25))
optimizer = torch.optim.Adam([epsilon], lr=1e-3)

for iteration in range(2):
    optimizer.zero_grad(set_to_none=True)
    result = model(epsilon, fixed_epsilon=background)
    # Maximize the first point monitor's mean squared electric signal.
    loss = -result.signals[:, 0].square().mean()
    loss.backward()
    assert torch.count_nonzero(epsilon.grad[:, :, :a]) == 0
    assert torch.count_nonzero(epsilon.grad[:, :, b + 1:]) == 0
    optimizer.step()
    with torch.no_grad():
        epsilon.clamp_(min=1.0)  # Keep the admitted CFL/material bound.
    print(iteration, loss.item(), result.report["last_backward"])
```

`result` is a `DifferentiableResult`. Its `signals` shape is `(steps, enabled_point_monitors)`, and its spectrum method retains the native E/H time convention. Each forward snapshots the project settings. Sequential retained backward calls create fresh adjoint state. Concurrent backward calls on the same result and higher-order derivatives are rejected. Release unused results when their graphs are no longer needed.

For CUDA, place both material tensors on the same CUDA device and request the corresponding device in `plan`. The actual input device selects execution. GPU execution requires the supported Torch/CuPy environment. Planning is repeated during execution, so a previous successful plan does not reserve physical memory.

## What is recorded and reconstructed

For an interval `[a,b]`, each timestep stores four transverse scalar planes in a tensor of shape `(steps, 2, Nx, Ny, 2)`:

- `Ex` and `Ey` at z index `b+1`, after the electric update and electric-source injection.
- `Hx` and `Hy` at z index `a-1`, before the magnetic update.

Backward starts from one owned terminal copy of the interior E/H fields. It restores the upper electric trace, reverses the interior H update, restores the lower magnetic trace, removes the known electric increment, and reverses the interior E update. It does not invert CPML memory variables or reconstruct the exterior primal fields.

The adjoint remains full-domain: all E/H cotangents and all CPML auxiliary cotangents propagate through the normal discrete transpose. Only the material contribution is evaluated on the reconstructed interior. Truncating the field adjoint at the recording planes would lose effects of radiation leaving and returning through the exterior.

Floating-point reconstruction is approximate. The report includes initial-state reconstruction residuals normalized by sampled forward interior field scales. Exceeding `reconstruction_tolerance` raises an error and asks for a checkpointed run. A small residual is a drift diagnostic, not a universal gradient-error guarantee. Tolerances must lie in `(0, 1e-3]`.

## Storage and admission

With `N` grid cells, transverse area `A = Nx*Ny`, and `T` timesteps, storage is `O(N + T*A)` plus point/source histories. It is not constant in simulation duration. The FP32 trace payload alone is `16*T*Nx*Ny` bytes. Terminal interior E/H copies require `24*Nx*Ny*(b-a+1)` bytes. Full resident forward fields, CPML state, material maps, adjoint buffers, output gradients, and working temporaries also remain necessary.

`ReversibleCPMLOptions` inherits `gpu_budget_bytes`, `host_budget_bytes`, `resident_budget_bytes`, and `reconstruction_tolerance` from `ReversibleOptions`, and adds:

| Option | Values | Meaning |
| --- | --- | --- |
| `collar_cells` | Positive integer, default `1` | Additional lossless rows excluded at each recording cut. |
| `trace_storage` | `"device"` or `"cpu"`, default `"device"` | Store boundary history on the field device or in CPU memory. |

On CPU, both storage choices use host memory. On CUDA, CPU trace storage uses synchronous device-to-host recording and synchronous staged host-to-device restoration. It reduces device history storage without promising transfer/computation overlap. This API creates no SSD archive and has no asynchronous trace transport.

`plan(device=...)` performs metadata-only admission and reports interval, trace shape, terminal bytes, complete conservative resident/host/GPU reservations, and allocation scope. It includes solver working buffers and transfer allowances, and checks explicit budgets and available memory before creating effective material or fields. Caller input ownership, optimizer state, external autograd graphs, and CUDA context are distinct from solver-owned allocations. The report identifies retained caller-input sizes. The estimate is an engineering reservation, not a platform-independent measurement of peak process memory.

Use checkpointed `DifferentiableSimulation` when a problem falls outside this contract or reconstruction drift is unacceptable. This guide makes no performance comparison or broader feature-completion claim.

## Targeted validation

The [integration evidence](validation/reversible_cpml_workflow.json) records 11 CPU workflow tests, including a 2048-step case, and 11 metadata admission tests without field allocation. Two CUDA cases cover device and synchronous CPU trace storage. Both matched checkpoint histories bitwise and produced complete admitted material-gradient relative L2 error of approximately `5.34e-7`.

The complete two-iteration CPU example above was also executed with one Torch CPU thread. Both backward passes completed with finite gradients. These checks establish the stated discrete workflow and admission scope, not general absorption convergence, throughput, or overall FDTDX parity.
