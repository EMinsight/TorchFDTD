# Periodic density design with shared adjoint memory budgets

`PeriodicLayerResponse` connects a real CPU density tensor to a two-polarization
detector response using resident CPU/CUDA or DRAM/file-backed spatial execution.
`PeriodicLayerResponse` defaults to `dtype=torch.float32`, matching the usual
Torch tensor default. Set both the model and density to `torch.float64` only
when explicitly validating precision. Both source bases share one material map and one adjoint batch budget. Their
fields are coherently combined before the power and quadrant calculations.
Backward receives seeds from the complete coupled objective and replays one
source-basis graph at a time. It does not retain two complete solver graphs.

```python
import torch
from photonweave import (
    AdjointBatchOptions, AdjointExecutionPolicy, PeriodicLayerResponse,
    StreamedAdjointOptions,
)

host_budget = 64 * 1024**3
gpu_budget = 16 * 1024**3
policy = AdjointExecutionPolicy(
    device="cuda", host_budget_bytes=host_budget,
    streamed=StreamedAdjointOptions(
        device="cuda", slab_width=32, temporal_depth=8,
        host_budget_bytes=host_budget, gpu_budget_bytes=gpu_budget,
        tile_transfers="async", tile_buffers=2,
    ),
)
spec = dict(
    wavelength_um=0.5, background_index=1.4, design_index=1.8,
    period_um=(0.8, 0.8), height_um=0.2, detector_offset_um=0.5,
    theta_inside_rad=0.1, phi_rad=0.3,
)
model = PeriodicLayerResponse(
    spec, density_shape=(4, 4), policy=policy,
    batch_options=AdjointBatchOptions(
        host_budget_bytes=host_budget, gpu_budget_bytes=gpu_budget,
    ),
    mesh=0.1, steps=160, pml_cells=6, quadrature_counts=(4, 4),
)
plan = model.plan()  # No full material map or domain fields are allocated.
logits = torch.zeros((4, 4), dtype=torch.float32, requires_grad=True)
optimizer = torch.optim.Adam([logits], lr=0.03)
optimizer.zero_grad(set_to_none=True)
response = model(logits.sigmoid())  # CPU, shape (2, 4), R/G2/G1/B order.
loss = -response[:, 0].mean()
loss.backward()
optimizer.step()
```

These small numerical settings illustrate graph connectivity. They do not
establish optical or design convergence. Run the complete synthetic example:

```console
python -m examples.hierarchical_periodic_design --device cuda --execution resident
python -m examples.hierarchical_periodic_design --device cuda --execution dram
```

For resident execution, provide `AdjointOptions` through the policy's `resident`
field. Large resident grids require explicit `resident_budget_bytes` as well
as the GPU/host limits. For file-backed execution, use the streamed policy's
`state_storage="disk"`, explicit `state_directory`, `disk_budget_bytes` and
`disk_free_reserve_bytes`. Also supply the shared batch's `disk_budget_bytes`.
This is ordinary file-backed field storage, not GPUDirect Storage.

## Automatic memory admission without trial simulations

For normal use, prepare one model with the memory budgets available to the
solver. `auto` does not run warmups, gradients or calibration solves:

```python
model = PeriodicLayerResponse.auto(
    spec, density_shape=(4, 4), mesh=0.1, steps=160, pml_cells=6,
    quadrature_counts=(4, 4),
    gpu_budget_bytes=32 * 1024**3,
    host_budget_bytes=64 * 1024**3,
)
print(model.selection_report)
response = model(logits.sigmoid())
loss = -response[:, 0].mean()
loss.backward()
```

It checks resident execution first. If it does not fit, it tries DRAM-backed
space-time slabs with asynchronous CUDA double buffering. Width decreases
from at most 256 cells, with temporal depth bounded by eight steps and half
the useful width. Both shrink under tighter budgets. Precision, physical
mesh, simulated duration and checkpoint count stay fixed. The first admitted
policy is retained for later calls and backward replay. Execution rechecks
live resources and fails if they no longer suffice, rather than silently
switching numerical policies inside a graph.

File-backed fallback requires both `state_directory` and `disk_budget_bytes`.
It preserves `disk_free_reserve_bytes`, defaulting to 100 GiB. No directory or
field bank is created during selection. Geometry/material maps and caller
optimizer storage still need DRAM. This is capacity-first admission, not a
hardware-calibrated speed guarantee. The existing measured tuner remains an
explicit choice for runs where its calibration cost is justified.

`selection_report` records the selected policy, rejected candidates and their
reservation failures. It returns an inspection copy. The synthetic example
now defaults to this path:

```console
python -m examples.hierarchical_periodic_design --device cuda
```

Four targeted tests cover a real CPU Torch density/gradient chain, metadata-only
DRAM and file admission, tile shrinking, and refusal of unconfigured storage
or insufficient free space. The metadata tests do not claim large-domain
execution or memory throughput. Existing solver correctness tests were not
rerun solely for this selector addition. GUI binding remains follow-up work.

## Memory and state contract

The host reservation includes the active solver, retained outputs and adjoint
gradient carriers, dense material-map construction, density-transfer workspaces
and reference-plane storage. The default reference cache is 64 MiB and can be
replaced by an explicitly bounded `PlaneReferenceCache`. Its full tensor budget
is reserved even when empty. Cache keys include the fixed physical project and
execution policy. Changing policy does not silently reuse a differently
computed reference. Both source references occupy one cache entry.

`plan()` uses a scalar-backed logical material tensor. `forward()` rechecks
admission before references and again before constructing the actual material
map. Reference-cache budget changes require rebuilding the module. The
`project` property returns an inspection copy. Build a new module to change
mesh, wavelength, incidence, layer interfaces, material indices or detectors.

This budget applies to one invocation. Caller optimizer state, other retained
graphs or model instances, runtime overhead and OS file cache are outside it.
The permittivity map is still dense in CPU RAM, including when the time-domain
fields are file-backed. This is not a lazy material/geometry representation.
Native admission and free-memory checks are engineering limits, not exclusive
OS reservations or exact process-RSS bounds.

The input shape and dtype are fixed at construction. Inputs and outputs use
CPU tensors, with differentiable transfers inside the CUDA execution policy.
Select devices with the policy, not `Module.to()`. Only density is trainable.
Arithmetic Yee-box material averaging, fixed selected-frequency lossless
indices and first-order derivatives retain the previous layer API's physical
scope. General shape/material derivatives, converged high-index interfaces,
concurrent adjoint microbatches and completed CR optimization remain separate
requirements.

`last_report` describes the latest forward call. Its `batch` entry is updated
when that call's backward executes. It retains diagnostics, not solver fields.
Instances and shared reference caches are intended for sequential use.

## Spectral schedules and the CR runner

The response tensor can feed `spectral_pupil_response` and the existing
electron-information objective. For large wavelength/ray schedules, construct
the response module inside each callable and share one bounded reference cache.
That avoids retaining every case's interpolation metadata simultaneously.
The outer spectral replay then bounds residency across cases while the inner
batch bounds source-basis solver graphs within each case.

The explicit-input CR runner accepts `--execution-policy resident`, `dram` or
`file`, alongside its existing schedule, density and electron-context inputs.
`legacy` remains the default. Hierarchical modes keep density on CPU, preflight
all wavelength/ray cases before any field execution and add the exact execution
settings to the restart contract. File mode requires an explicit directory and
disk budget, and preserves 100 GiB free storage. The runner records preflight
time separately from forward/backward time. It does not include an optimizer.
The separate [CR inverse-design driver](CR_INVERSE_DESIGN.md) connects the same
full schedule and information objective to projected Adam, committed optimizer
checkpoints, per-update case restart and a final evaluated design export.
It retains continuous densities and does not certify physical convergence.

Use `--forward-kernel fused`, `--gpu-budget-gib`, `--host-budget-gib`,
`--slab-width` and `--temporal-depth` to set the explicit policy. Streamed CUDA
uses fused backward and rejects `--backward-kernel torch`. An existing journal
from another policy or source revision cannot be resumed as the same run.

Tests compare the full polarized response and density gradient against the
previous independent layer path for resident CPU/CUDA and DRAM/file execution.
They also check a directional finite difference through spectral assembly,
optimizer connectivity, cache reuse and policy separation, FP32 gradients,
pre-allocation denial and file cleanup. These are small discrete checks.
Full-schedule CR optical convergence and large application performance remain
unvalidated for this new integration.

The related periodic-response, cache and pupil regression group passed 24 tests.
The [public synthetic example record](validation/periodic-hierarchy-example-3060.json)
retains two Adam iterations for resident CUDA and asynchronous DRAM execution
on RTX 3060. Their losses and final densities agree to the recorded tolerance.
These example results carry no speed or optical-convergence claim.

A separate synthetic-file CR runner check also passes for legacy, budgeted
resident and asynchronous DRAM policies. It exercises actual CLI parsing,
all-case admission, information objectives, saved full density gradients and
restart metadata. Another 15 existing directional/restart tests pass.
