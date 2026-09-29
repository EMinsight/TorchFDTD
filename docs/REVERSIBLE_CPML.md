# Recorded-interface CPML differentiation

`ReversibleCPMLSimulation` is an opt-in, experimental material-gradient API for a lossless dielectric interior surrounded by a fixed absorbing exterior. It runs the native full-domain CPML forward update, records a small boundary history, and reconstructs the interior during backward instead of replaying volume checkpoints.

It is separate from the lossless all-periodic `ReversibleSimulation`. Boundary recording and interior reconstruction are established ideas in reverse-time wave simulation. This implementation does not claim a new recording principle, overall FDTDX feature parity, or a speed advantage.

## Supported contract

The admitted problem has uniform 3D Yee sampling, staircase interfaces, real FP32 or fixed-Bloch complex64 fields and real FP32 scalar or diagonal Yee permittivity. The x and y face pairs may be periodic or Bloch with fixed phases. Both z faces must use CPML. The timestep count is fixed and fields remain resident on CPU or CUDA.

Sources are fixed soft electric point increments or z-normal plane increments. Each resolved polarization component must lie wholly inside or wholly outside the reconstruction interval. Sources outside the interval contribute through the recorded boundary planes and are not undone in the interior. The point API observes E/H after each complete native step. `ReversibleCPMLPlaneSimulation` instead returns online spectra on fixed collocated field planes. Project validation requires sources and monitors inside the non-PML physical region. Both may lie outside the reconstructed interval.

Off-diagonal tensor coupling, ADE dispersion, nonuniform meshes, subpixel interfaces, spatial streaming, adaptive stopping, H sources, and one-way/TFSF injection are outside this API. The derivative contract is first order. The API does not differentiate source settings or the boundary configuration.

## Optional CUDA launch and fusion settings

The point and plane APIs accept these settings in `ReversibleCPMLOptions`:

| Option | Default | Choices |
|---|---|---|
| `block_size` | `None` | `None` keeps the existing launch sizes. `128`, `256`, `512`, or `1024` selects a fixed size. `'auto'` measures each kernel on scratch storage. |
| `forward_kernel` | `'split'` | `'fused_eh'` combines the E update, soft electric source injection, and H update. |
| `adjoint_kernel` | `'split'` | `'one_pass'` combines the H and E transposes, using separate input/output cotangent buffers. |

```python
options = ReversibleCPMLOptions(
    interior_z=(45, 79),  # inclusive pillar-layer indices for this particular grid
    block_size='auto',
    forward_kernel='fused_eh',
    adjoint_kernel='split',
)
model = ReversibleCPMLSimulation(project, options)
```

These optimizations require CUDA, real FP32 fields, uniform periodic x/y,
z-only CPML, scalar or diagonal dielectric permittivity, and constant scalar
permeability. Fused forward additionally requires contiguous soft electric
source support without spatial profiles. Jones components are injected in the
same order as the split update. Sources and monitors may lie outside
`interior_z`, subject to the existing source-support and physical-region checks.

Fused forward uses a shared-memory marching layout when the z extent fits its
thread/shared-memory limits, and a per-cell gather layout otherwise. The
marching layout has a fixed two-dimensional block. `block_size` applies to the
other kernels. It does not override the marching layout.

Within the recorded CPML API's supported physics, unavailable optimizations use
the existing split path. `report['forward_kernel_used']`,
`report['forward_kernel_variant']` (when fused), `report['adjoint_kernel_used']`,
and `report['fallback_reason']` identify the actual path and any fallback.
The adjoint-used field is updated when backward executes. Unsupported physics
such as dispersion, PMC, subpixel interfaces, and nonuniform meshes retain the
API's existing validation errors. The options do not expand the physics contract.
CUDA runtime and allocation failures propagate.

Autotuning measures five alternating sweeps of 128/256/512/1024-thread launches
on copies of writable arguments, chooses the lowest median time, and caches
only metadata in the current process by device, compute capability and kernel
source hash. `report['cuda_launches']` records the source hashes, chosen blocks,
timings, cache reuse and optional specialization compilation failures. The
first call includes this setup cost. Tuning must precede CUDA graph capture.
It is opt-in because its setup cost can outweigh savings on short simulations.

Forward E/H and electric CPML buffers, adjoint E/H buffers, and peak autotuning
scratch are included in memory admission. The report exposes
`fused_forward_buffer_bytes`, `fused_adjoint_buffer_bytes`, and
`cuda_tuning_scratch_bytes`. These buffers can materially increase VRAM needs.

For the same interval and inputs, the fused and block-size variants retain
IEEE compilation (`--fmad=false`, `--ftz=false`) and the split expressions'
operation order. Tests compare fields, traces, spectra, cotangents, CPML
memories and material gradients with `torch.equal`. Changing the reconstruction
interval still has the separately documented FP32 reconstruction error and
requires a tolerance comparison with checkpointed exact-primal gradients.
No precomputed `cn/epsilon` volume is required by these options.

Run the tile benchmark under an exclusive GPU lock:

```bash
python benchmarks/reversible_cpml_fused_updates.py --core 4 --over 1.8 \
  --steps 1200 --repeats 5 --trace cpu --out results/fused-tile.json
```

It alternates split, auto, fused forward, one-pass adjoint and combined modes
after warmup, checks identical spectra/gradients, and reports forward-only,
recorded forward, backward and complete-call times with source hashes. Larger
16/24 micrometer cores require sufficient VRAM for the full reservation.
Performance is workload- and device-dependent. The default paths stay split.

### Measured tile performance

RTX 3060, PyTorch 2.10.0+cu126, real diagonal permittivity, one polarization,
1200 steps, reconstruction layers 45–79, asynchronous CPU boundary storage,
and `diagnostic_chunk_elements=2**24`. Each mode was warmed once, followed by
three measurements with alternating mode order. Times below are medians of
the complete public forward-plus-gradient call, including per-call setup.
Compilation and the first autotuning pass are outside the warmed measurements.

| Mode | 240 × 240 × 125 (s) | 380 × 380 × 125 (s) |
|---|---:|---:|
| Split, original block sizes | 7.935 | 21.594 |
| Split, automatic block sizes | 7.450 | 21.689 |
| Fused E+H, original backward blocks | 7.242 | 20.364 |
| Fused E+H, automatic backward blocks | Not measured | 19.241 |
| Split forward, one-pass adjoint | 8.035 | 21.577 |
| Fused E+H, one-pass adjoint, automatic blocks | 7.502 | 20.285 |

Fused E+H with split adjoint reduced complete-call time by 8.7% on the smaller
grid using original blocks and 10.9% on the larger grid using automatic blocks.
On the larger grid the latter combination reduced forward-only time from
7.772 to 5.758 seconds (25.9%). Automatic block selection alone did not improve
both grids. One-pass adjoint did not provide a repeatable benefit on this GPU,
so the example above keeps the split adjoint.

All compared spectra and gradients were bitwise identical. On the larger grid,
the largest measured Torch allocation increment was 2.935 GiB with all options,
within the 5.139 GiB reservation. The records include every sample and source
hash: [240-grid measurements](validation/fused_cpml_240.json) and
[380-grid measurements](validation/fused_cpml_380.json). The latter also records
per-kernel CUDA event times and an ideal unique-array byte model. Its GB/s
figures exclude CPML traffic, repeated gathers and cache effects and are not
measured DRAM bandwidth. Kernel profiles use separate zero-state scratch
systems, while the complete-call measurements use the simulated tile fields.

A [five-repeat confirmation on the final source](validation/fused_cpml_final_380.json)
compares split with fused E+H plus automatic blocks on the 380-grid. Complete-call
medians were 21.654 and 18.927 seconds (12.6% reduction). Every paired repetition
favored the fused combination. Forward-only medians were 7.600 and 5.654 seconds
(25.6% reduction). Spectra and gradients remained bitwise equal. This run also
includes the final fallback-reporting and benchmark preflight changes, which
do not change the kernel arithmetic measured in the earlier records.

These are single-tile measurements, with core widths 1.2 and 4 micrometers plus
1.8-micrometer margins on each side. They do not establish full-lens throughput
or performance on 16/24-micrometer cores, RTX 5880, A100 or B200.

## Material parameters and the fixed exterior

Call the model with two contiguous, resolved real FP32 tensors of the same full grid shape on the same CPU or CUDA device. Use `(Nx,Ny,Nz)` for scalar epsilon or `(Nx,Ny,Nz,3)` for component-specific diagonal Yee epsilon:

```python
result = model(epsilon, fixed_epsilon=background)
```

Both maps must be finite with values at least one. `fixed_epsilon` must not require gradients. Geometry declarations do not rasterize these inputs automatically: the two tensors supply the actual sampled scalar or diagonal permittivity. Complex fields do not make epsilon complex. Diagonal inputs receive three separate real component derivatives, without summing them into a scalar map.

`model.interior_z` returns inclusive indices `(a, b)`. The forward material is defined by:

```python
effective = fixed_epsilon.clone()
effective[:, :, a:b + 1] = epsilon[:, :, a:b + 1]
```

Consequently, the derivative with respect to `epsilon` is exactly zero outside that interval. This is the actual derivative of the declared parameterization, not an unrestricted full-domain material gradient subsequently discarded in the exterior. Source cells inside the interval receive their actual material derivative because the impressed increments are fixed independently of epsilon. To keep additional design cells fixed, use a differentiable mask such as `torch.where` before calling the model.

The interval comes from the union of the actual staggered E- and H-update CPML descriptor rows. `collar_cells` removes additional lossless rows on each side, with a minimum of one. Excessive CPML thickness or collar width is rejected if fewer than two reconstruction planes remain. Sources use the native nearest-Yee sampling convention, checked independently for each resolved component.

### Restricting reconstruction to the design layers

`ReversibleCPMLOptions(interior_z=(a, b))` selects inclusive z indices inside
the CPML-free interval defined above. At least two planes must remain. The
default `None` reconstructs the original full interior.

```python
options = ReversibleCPMLOptions(interior_z=(45, 81))
model = ReversibleCPMLSimulation(project, options)
result = model(epsilon, fixed_epsilon=background)
```

Choose the interval to contain every cell that the parameterization may change,
including the support of all three Yee components for diagonal maps. With an
explicit interval, each call requires `epsilon == fixed_epsilon` everywhere
outside it and rejects a mismatch before field allocation. Put fixed substrates
and other exterior materials in both maps. The interval is specified in advance,
so `plan()` can compute storage without inspecting the material tensors.

The full-domain forward and field adjoint are unchanged. Forward signals and
spectra remain bitwise equal when the effective material maps agree. Material
gradients are zero outside the selected interval. Inside it, changing the
recording cuts changes floating-point reconstruction rounding, so compare the
gradients with a checkpointed adjoint for the intended design. The reconstruction
residual is normalized over the selected interval and is not directly comparable
to a residual measured over a different interval.

A narrower interval reduces reconstruction work and terminal E/H storage. It
does not reduce the boundary-trace size or the full-domain forward/adjoint arrays.
Admission retains its conservative full-state allowance. `PeriodicLayerResponse`
checks the design layer's component support against the selected interval and
uses a separate cache identity for each option setting.

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

## Forward-only calls

A call that cannot request a gradient runs forward only: under `torch.no_grad()` or `torch.inference_mode()`, or with an `epsilon` that does not require gradients. It performs the recorded forward's field updates, source injections, observations and DFT blocks in the same order on the same CPU or fused CUDA path, so its signals and spectra are bitwise equal to those of the recorded forward. It keeps no boundary trace or terminal interior copy and computes no reconstruction scale, so its result has no adjoint. The report then has `forward_only=True`, `sampled_forward_peak=None`, `sampled_forward_l2=None` and `terminal_copies=0`. Both material maps are validated as on the recorded path, and the observations and the final E and H fields must be finite. Admission is unchanged: the reservation still includes the trace and the terminal copies. Use `ReversibleCPMLOptions(forward_only="never")` to record every call, for example to read the forward drift scales without requesting a gradient.

## Online fixed-plane spectra

`ReversibleCPMLPlaneSimulation` returns the same monitor-ID mapping of six-component `DifferentiablePlaneResult` objects as the checkpointed plane API. Plane positions, interpolation maps, quadrature, frequencies, and source settings remain fixed. Construction builds host quadrature/interpolation maps before `plan()`. Planning and execution charge their layout allowance, but construction is not allocation-free.

With M unique sampled Yee components, F frequencies, and B=min(block_size,T), the solver stores B by M sample/seed buffers and an F by M spectral accumulator. It regenerates bounded DFT-adjoint seed blocks during backward instead of retaining T by M plane histories. The boundary archive still scales with T. Plane spectra use the native positive exponential `exp(+2*pi*i*f*t)`, with E sampled at `(n+1)*dt` and H at `(n+1.5)*dt`. This differs from the point result's negative-exponential spectrum convention.

This independent CPU example uses fixed nonzero Bloch phases, diagonal real epsilon, a soft Ex plane, and two field planes. It illustrates a material VJP, not a complete CR calibration or optimization:

```python
import torch
from torchfdtd import (
    Project, Region, Source, FieldMonitor,
    ReversibleCPMLPlaneSimulation, ReversibleCPMLOptions,
)

faces = {f"{axis}_{side}": {"kind": "bloch"}
         for axis in "xy" for side in ("min", "max")}
faces.update(z_min={"kind": "pml", "layers": 3},
             z_max={"kind": "pml", "layers": 4})
project = Project(
    region=Region(dimension="3d", size=(0.6, 0.7, 2.0), mesh=0.1,
                  precision="float32", material_sampling="yee", backend="cpu",
                  steps=32, boundaries=faces, bloch_phase=(0.31, -0.47, 0)),
    sources=[Source(kind="plane", normal="z", size=(0.6, 0.7, 0),
                    center=(0, 0, -0.4), component="Ex", wavelength=0.6,
                    time_definition="standard", pulse_length=0.4e-15,
                    pulse_offset=0.6e-15)],
    monitors=[FieldMonitor(id=name, normal="z", size=(0.6, 0.7, 0),
                           center=(0, 0, z),
                           spectrum={"sampling": "frequency", "apodization": "none"})
              for name, z in (("incident", -0.2), ("detector", 0.5))],
)
model = ReversibleCPMLPlaneSimulation(
    project, ReversibleCPMLOptions(trace_storage="cpu"),
    quadrature_counts={"incident": (3, 4), "detector": (3, 4)},
)
frequency = torch.tensor([0.033, 0.057], dtype=torch.float32) / project.region.time_step
plan = model.plan(frequency, device="cpu", material_components=3, block_size=7)
background = torch.full((*project.region.shape, 3), 1.3, dtype=torch.float32)
epsilon = torch.full_like(background, 1.4, requires_grad=True)
planes = model(epsilon, frequency, fixed_epsilon=background, block_size=7)
fields = planes["detector"].fields / project.region.time_step
loss = fields.abs().square().mean()
loss.backward()
assert torch.isfinite(epsilon.grad).all()
print(model.interior_z, planes["detector"].fields.shape)
```

For asynchronous CPU trace storage on CUDA, use `ReversibleCPMLOptions(trace_storage="cpu", trace_transfers="async", trace_chunk_steps=32)` and CUDA material tensors, with the stream and budget restrictions below. This is a resident plane solver. It does not select a `PeriodicLayerResponse` execution policy, build matched homogeneous references, or perform polarization calibration automatically.

## Periodic responses and sequential case replay

To build matched homogeneous references and calibrate both source polarizations, select the recorded algorithm explicitly through `AdjointExecutionPolicy`. `PeriodicLayerResponse` accepts a real FP32 CPU density tensor and returns a CPU `(2, 4)` response in R/G2/G1/B order. It derives the homogeneous fixed exterior as `spec["background_index"]**2` and rejects any component's Yee layer support outside the reconstruction interval before constructing material maps. This is a fixed-frequency density derivative, not a source, angle or geometry-boundary derivative.

```python
import torch
from torchfdtd import (
    AdjointBatchOptions, AdjointExecutionPolicy, PeriodicLayerResponse,
    PeriodicDesignConfig, ReversibleCPMLOptions,
)

config = PeriodicDesignConfig(
    execution="recorded", device="cpu", steps=160, mesh_um=0.1,
    pml_cells=6, quadrature_counts=(4, 4), theta_deg=5.0, phi_deg=17.0,
    initial_density=[[0.2, 0.4], [0.5, 0.3]], iterations=1,
)
budget = 1024**3
policy = AdjointExecutionPolicy(
    device=config.device, host_budget_bytes=budget,
    recorded=ReversibleCPMLOptions(
        trace_storage="cpu", host_budget_bytes=budget,
        resident_budget_bytes=budget,
    ),
)
response_model = PeriodicLayerResponse(
    config.spec(), density_shape=(2, 2), policy=policy,
    batch_options=AdjointBatchOptions(host_budget_bytes=budget),
    mesh=config.mesh_um, steps=config.steps, pml_cells=config.pml_cells,
    quadrature_counts=config.quadrature_counts, dtype=torch.float32,
)
density = torch.tensor(config.initial_density, dtype=torch.float32,
                       requires_grad=True)
response = response_model(density)
loss = -response[:, 0].mean()
loss.backward()
```

The shared batch runs the two source-basis cases sequentially and replays one case graph at a time during backward. Material gradients return through the CPU density-to-diagonal-Yee map. Compact spectra and homogeneous references may be cached, but live field, terminal and trace ownership is not cached across cases. Shared host admission includes the active solver, density/material construction, reference storage and batch carriers. Caller optimizer state and unrelated graphs remain outside this reservation.

For lower-level `AdjointCase` construction, supply `fixed_background_epsilon=1.3`, for example, alongside the recorded policy and fixed field-plane frequencies. The value must be a finite Python `float` at least one. Recorded cases require it and non-recorded cases reject it. The same keyword is required by `policy.simulation(project, fixed_background_epsilon=...)`. This bridge supports a homogeneous exterior only. Its effective material uses that fixed value outside the reconstruction interval, so the supplied design tensor has zero derivatives there. Use the standalone plane API above when an explicitly resolved nonuniform fixed map is needed.

The higher-level optimizer uses the same route:

```python
from torchfdtd import periodic_design_plan, run_periodic_design

plan = periodic_design_plan(config)
result = run_periodic_design(config)
```

In the browser's periodic density design dialog, choose **Execution mode → Boundary-history adjoint**. **Boundary history**, **Transfer block (steps)** and **Fixed collar (cells)** map to `recorded_trace_storage`, `recorded_trace_chunk_steps` and `recorded_collar_cells` in `PeriodicDesignConfig`. With CUDA and CPU boundary storage, this workflow selects asynchronous transfers. CPU execution uses synchronous transfers. This independent periodic layer is not an automatic conversion of an arbitrary CAD project.

All forward and adjoint fields and CPML state remain resident on the compute device. Only the boundary archive can be placed on CPU, with `O(T*A)` storage. This is not spatial streaming or SSD recording. Recorded execution is opt-in, is excluded from automatic policy selection and tuning, and uses no volume checkpoints. Neither this example nor successful discrete-gradient checks establish mesh convergence or a throughput advantage.

## What is recorded and reconstructed

For an interval `[a,b]`, each timestep stores four transverse component planes in a tensor of shape `(steps, 2, Nx, Ny, 2)`:

- `Ex` and `Ey` at z index `b+1`, after the electric update and electric-source injection.
- `Hx` and `Hy` at z index `a-1`, before the magnetic update.

Backward starts from one owned terminal copy of the interior E/H fields. It restores the upper electric trace, reverses the interior H update, restores the lower magnetic trace, removes electric increments inside the interval, and reverses the interior E update. It does not invert CPML memory variables or reconstruct the exterior primal fields.

The CUDA path combines the inverse E update and material-gradient accumulation
in one kernel, sharing the same curl H. Its full-domain adjoint runs before that
kernel because it does not read the reconstructed primal fields. The component
arithmetic retains its original order and disables FMA contraction. Interior
kernels use bounded 32-bit indices and 128-thread blocks. Separate inverse-E and
gradient kernels remain available internally for numerical comparisons.

The adjoint remains full-domain: all E/H cotangents and all CPML auxiliary cotangents propagate through the normal discrete transpose. Only the material contribution is evaluated on the reconstructed interior. Truncating the field adjoint at the recording planes would lose effects of radiation leaving and returning through the exterior.

The forward and initial-state scales are computed over the interior in chunks of at most `diagnostic_chunk_elements` real lanes, with a float64 sum. A larger value launches fewer, larger reductions: over a 1200-step forward of a 920 x 920 x 125 grid with 99 interior planes, the 65536-lane default makes 146,224 chunk reductions and 2**24 makes 570. Above the default the summation order changes, so the reported L2 scales and residuals are not bitwise equal to those of the default (the peaks are); signals, spectra and gradients are unaffected. Floating-point reconstruction is approximate. The report includes initial-state reconstruction residuals normalized by sampled forward interior field scales. Exceeding `reconstruction_tolerance` raises an error and asks for a checkpointed run. A small residual is a drift diagnostic, not a universal gradient-error guarantee. Tolerances must lie in `(0, 1e-3]`.

## Storage and admission

With `N` grid cells, transverse area `A = Nx*Ny`, and `T` timesteps, storage is `O(N + T*A)` plus point/source histories. It is not constant in simulation duration. The real FP32 trace payload alone is `16*T*Nx*Ny` bytes, and complex64 doubles it to `32*T*Nx*Ny`. Terminal interior E/H copies require `24*Nx*Ny*(b-a+1)` bytes for real fields or twice that for complex fields. Full resident forward fields, CPML state, material maps, adjoint buffers, output gradients, and working temporaries also remain necessary.

`ReversibleCPMLOptions` inherits `gpu_budget_bytes`, `host_budget_bytes`, `resident_budget_bytes`, and `reconstruction_tolerance` from `ReversibleOptions`, and adds:

| Option | Values | Meaning |
| --- | --- | --- |
| `collar_cells` | Positive integer, default `1` | Additional lossless rows excluded at each recording cut. |
| `interior_z` | Inclusive integer pair `(a, b)` with `a < b`, default `None` | Optional subset of the CPML-free reconstruction interval. Exterior epsilon must match the fixed map. |
| `trace_storage` | `"device"` or `"cpu"`, default `"device"` | Store boundary history on the field device or in CPU memory. |
| `trace_transfers` | `"sync"` or `"async"`, default `"sync"` | Async requires CUDA execution and CPU trace storage. |
| `trace_chunk_steps` | Integer 1 through 1024, default `32` | Requested async chunk length K, effectively min(K,T). |
| `forward_only` | `"auto"` or `"never"`, default `"auto"` | `"auto"` runs a call that cannot request a gradient forward only (below). `"never"` records the tape on every call. |
| `diagnostic_chunk_elements` | Integer 65536 through 2**26, default `65536` | Real lanes per chunk of the drift diagnostic and the finite/material checks. The scratch is reserved at 24 bytes per lane. |

On CPU, both storage choices use host memory and require synchronous transfers. On CUDA, CPU trace storage can use synchronous copies or an asynchronous two-slot transport. The asynchronous mode owns two pinned host chunks, two device chunks, eight reusable events, and one copy stream in addition to the full pageable host archive. Requested chunk length K is clamped to T, so a short run does not reserve unused full-length chunks. Field packing and backward consumption must run on the CUDA compute stream captured during forward. A different-stream backward is rejected. Error cleanup drains the original streams. Sequential retained backward opens a fresh reverse reader after resetting the solver state. A rejected stream call can be retried on the original stream with a retained graph, but a failed transport is not a promise of arbitrary CUDA-error recovery. Run a new forward after a transport failure. This API creates no SSD archive, and asynchronous trace transfers do not make the fields spatially streamed or establish a performance gain.

`plan(device=..., material_components=1)` performs metadata-only admission for scalar maps. Use `material_components=3` for diagonal maps. It reports interval, trace shape, terminal bytes, complete conservative resident/host/GPU reservations, and allocation scope. It includes solver working buffers and transfer allowances, and checks explicit budgets and available memory before creating effective material or fields. Caller input ownership, optimizer state, external autograd graphs, and CUDA context are distinct from solver-owned allocations. The report identifies retained caller-input sizes. The estimate is an engineering reservation, not a platform-independent measurement of peak process memory.

Use checkpointed `DifferentiableSimulation` when a problem falls outside this contract or reconstruction drift is unacceptable. The measured observation comparisons below are limited to their stated fixtures.

## Targeted validation

The [previous-version integration evidence](validation/reversible_cpml_workflow.json) covers the original real scalar point API and records 11 CPU workflow tests, including a 2048-step case, and 11 metadata admission tests without field allocation. Two CUDA cases cover device and synchronous CPU trace storage. Both matched checkpoint histories bitwise and produced complete admitted material-gradient relative L2 error of approximately `5.34e-7`.

The complete two-iteration CPU example above was also executed with one Torch CPU thread. Both backward passes completed with finite gradients. These checks establish the stated discrete workflow and admission scope, not general absorption convergence, throughput, or overall FDTDX parity.

The [extended workflow evidence](validation/reversible_cpml_extended_workflow.json) records the separately validated Bloch, diagonal-material, asynchronous trace, and online-plane integration scope. The earlier record above remains evidence for its original version, not a substitute for those extension checks.


## Recorded observation performance

CUDA E/H observations copy field bits directly into the existing sample block. This removes temporary gather/scatter outputs and retains monitor order, duplicate locations, complex values and subnormals. Field updates, source timing, DFT accumulation and the adjoint arithmetic are unchanged. Admission includes one int64 index per observation on the host and GPU.

Measured on an RTX 3060 with PyTorch 2.10.0+cu126, using 512 steps and synchronized forward-plus-backward wall time including setup. Each path was warmed first and execution order alternated. Windows desktop rendering remained active. The baseline reproduces the previous recorded observation loop.

| Grid | Material / field | Plane quadrature | Repeats | Previous loop (s) | Direct recording (s) | Median time reduction |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| 64 × 64 × 125 | diagonal / real | 8 × 8 | 15 | 0.355574 | 0.301016 | 15.34% |
| 192 × 192 × 125 | diagonal / real | 8 × 8 | 15 | 1.965040 | 1.948509 | 0.84% |
| 64 × 64 × 125 | scalar / real | 8 × 8 | 9 | 0.305794 | 0.258143 | 15.58% |
| 64 × 64 × 125 | diagonal / complex | 8 × 8 | 9 | 0.502109 | 0.475268 | 5.35% |
| 64 × 64 × 125 | diagonal / real | 64 × 64 | 9 | 0.585422 | 0.532866 | 8.98% |

All compared spectra and gradients were bitwise equal. Timing differences depend on grid size and observation density. These measurements do not establish a speedup for larger metalenses, A100, H200 or B200. The [raw measurements](validation/recorded_cpml_observations_111.json) include every sample, paired variability and peak Torch CUDA memory. Reproduce with `python -m benchmarks.recorded_cpml_dispatch_perf --output comparison.json`.
