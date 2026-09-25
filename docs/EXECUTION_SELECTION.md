# Experimental resident and streamed adjoint selection

`tune_adjoint_execution` compares resident and spatially streamed execution
under common solver-memory budgets. It covers dielectric and Drude/Lorentz
ADE point histories, point spectra or fixed spectral detection planes. It uses the existing bounded reference
cache and two-duration checkpoint-replay cost model, with first-order gradient
comparisons between candidates. The selected policy can be reused across
optimization iterations.

```python
from torchfdtd import StreamedAdjointOptions, tune_adjoint_execution

budget = StreamedAdjointOptions(
    device="cuda", gpu_budget_bytes=24 * 1024**3,
    host_budget_bytes=64 * 1024**3, slab_width=32, temporal_depth=8,
)
selection = tune_adjoint_execution(
    project, epsilon_inf, strength, omega0, gamma,
    options=budget, frequency_hz=frequency_hz, probe_steps=16, repeats=2,
)
model = selection.simulation(project)
result = model.spectrum(epsilon_inf, strength, omega0, gamma, frequency_hz)
loss = result.fields.abs().square().sum()
loss.backward()
optimizer.step()
```

For a nondispersive design, pass only `epsilon` before the keyword arguments.
Design tensors and returned observations reside on CPU in both execution modes.
Resident CUDA includes differentiable transfers of the design to the GPU and
observations back to CPU. Their gradients return to the original CPU geometry
graph. An application that already retains its entire design on GPU can still
use the direct resident API without these interface copies.

Run a small geometry-and-damping Adam example with:

```console
python -m examples.differentiable_dispersive_design --auto-execution --device cuda --kernel fused --iterations 2
```

For CPU, omit the device/kernel flags. This demonstrates optimizer graph
connectivity with a point-spectrum objective, not a validated optical design.

Default candidates include resident device checkpoints, zero checkpoints and,
on CUDA, asynchronous host checkpoints. Streamed candidates vary slab width,
temporal depth, global/local checkpoints and synchronous/asynchronous staging.
Generated slabs fit current budgets and can fall back to file banks only when
the supplied options explicitly specify a directory and byte budget. File
headroom is preserved. No drive, file location or multi-GPU configuration is
inferred. Custom lists contain `AdjointExecutionPolicy` objects and retain
their declared settings.

Admission checks the target duration before measuring short prefixes. Resident
candidates include solver workspace, checkpoint tiers, complete source/output
histories, ADE packing and input/gradient transfer carriers. The wrapper's
`host_budget_bytes` limits total solver-owned RAM, while the nested
`AdjointOptions.host_budget_bytes` keeps its checkpoint-tier meaning. Both must
pass. The [resident allocation model](RESIDENT_ALLOCATION_MODEL.md) distinguishes
fully fused CUDA from generic Torch workspace, reserves exact restart slots
and includes cold cuBLAS/Lt pools for spectral observations. Caller inputs,
geometry and optimizer graphs remain outside these budgets. CUDA context and
OS file cache are not included.

Generated resident candidates now use [explicit byte admission](BUDGETED_RESIDENT.md).
Create large projects with `memory_mode="streamed"` or `"budgeted"` to defer
allocation. Resident workspace, checkpoint, transfer and CUDA-index checks must
all pass. Explicit custom resident candidates without `resident_budget_bytes`
are admitted by the resident reservation against the free memory; the Python
API has no cell guard, and the workbench server keeps its eight-million-cell
limit.
Resident denial is recorded as a candidate rejection.
Execution rechecks live resources before copying resident inputs or creating
fields. A selected policy is not an exclusive resource reservation.

Calibration uses detached parameter leaves and does not modify their original
values or `.grad`. Time includes input packing/copies, solver preparation,
forward, a point-energy proxy, replay and backward. Gradient comparison, model
construction, geometry and optimizer operations are outside individual timing
samples. Reports include their overall tuning cost and retain rejected
candidates, measured samples, predictions and the selected index.

This is a bounded empirical search, not a globally optimal scheduler. Prefix
ranking can differ from full-duration ranking. Use a held-out complete workload
to assess policy quality and amortize tuning over enough iterations. A policy
that later loses resource admission raises an error rather than silently
changing tiers inside an existing autograd graph. Mixed point/plane projects,
shared-budget microbatching, dynamic retuning and single-domain multi-GPU are
not part of this entry point.

Selected policies can be used in [shared-budget case replay](ADJOINT_BATCH.md).
That API checks all case reservations together and replays one case graph at
a time. It does not jointly tune concurrent microbatch size and tile policy.

## Fixed detection planes

When all enabled monitors are `FieldMonitor` planes, supply explicit
`frequency_hz` during tuning and during execution. The selected model returns
a mapping from monitor ID to `DifferentiablePlaneResult`:

```python
selection = tune_adjoint_execution(
    project, epsilon, options=budget, frequency_hz=frequencies,
)
model = selection.simulation(project)
with torch.no_grad():
    reference = model(torch.ones_like(epsilon), frequency_hz=frequencies)
planes = model(epsilon, frequency_hz=frequencies)
loss = -planes["detector"].normalized_flux(reference["detector"]).mean()
loss.backward()
```

Use the four material inputs for ADE. Optional `quadrature_counts` maps each
3D plane ID to two transverse quadrature counts and is retained by the
selection. Monitor positions, mesh and frequencies are fixed. Temporal
apodization, time downsampling and mixed field/DFT precision remain outside
the plane-adjoint contract.

Calibration compares all six complex collocated fields. Its proxy combines
duration-normalized field energy and area-normalized signed Poynting flux,
then compares each scaled material gradient. This exercises E/H cross-product
derivatives but does not time the user's complete optical objective. Fields
and area weights are normalized before taking their products, avoiding FP32
underflow or overflowing backward seeds from SI-scale spectral power.
Matched-reference normalization uses common detached field/area scales that
cancel in the ratio while retaining derivatives of both sample and reference.
The resident CPU facade also reserves returned plane fields, their gradient
carriers and metadata. Both modes include retained interpolation arrays and
an allowance for Python observer metadata. Layout planning creates metadata
before admission but allocates no domain fields. The metadata allowance is
an engineering estimate, not a portable process-RSS bound.

Physical reference signatures include resolved source settings, mesh,
duration and boundaries. They exclude backend and memory placement, so a
matched reference can be reused across execution policies. Plane coordinates,
weights, frequencies, dtype and device must still match exactly.

Run the complete radius/damping optimizer example with:

```console
python -m examples.differentiable_plane_design --device cuda --dispersive --iterations 2
```

`--execution resident` and `--execution streamed` exercise explicit policies.
The default `auto` measures candidate policies first. Omit `--dispersive` for
the dielectric case. The short dipole-illuminated example demonstrates graph
connectivity and matched-reference flux, not a converged transmission
efficiency or completed color-router optimization.

Local validation includes CPU/CUDA, 2D/3D and fixed Bloch fields, dielectric
and ADE material gradients, file-backed planes, quadrature overrides, memory
denial before field allocation/material packing/transfers, and no mutation of
caller gradients. A deliberately corrupted backward with unchanged fields is
rejected. GC-disabled checks ensure the preceding solver is released before
an uncached reference. FP32 normalized-flux gradients agree with FP64 and
finite differences, and an analytic test checks both differentiable sample
and reference fields at photonic SI scales.

The [two-iteration CPU/CUDA example record](validation/plane-execution-example-3060.json)
retains matching radius/damping updates and exact runtime hashes. A separate
CR process was active, so these timings establish no performance advantage.

## Full-duration validation driver

The existing policy driver accepts `--unified` to compare resident checkpoint
policies and streamed candidates in the same held-out experiment:

```console
python -m benchmarks.streamed_policy --unified --dispersive --spectrum --checkpoint-tiles --nx 128 --ny 128 --nz 128 --steps 128 --probe-steps 12 --repeats 3 --gpu-budget-gib 16 --host-budget-gib 64 --require-held-out --output results/unified-policy.json
```

Add `--precision float32` for real FP32, or `--complex-bloch` for complex FP64.
Add `--planes --plane-stride 4` for two fixed detector planes. The driver then
checks every complex field and the VJP of field energy plus signed flux,
with scaling performed before the field products. This requires `--unified`.
The driver compares each complete output and scaled material VJP against the
resident reference, preserves the prefix-selected winner, records every full
repetition and reports tuning payback relative to the first admitted resident
policy. A negative saving produces no claimed payback. Because this benchmark
requires a resident reference, it is not a beyond-VRAM capacity experiment.

Validation covers CPU/CUDA design-copy gradients, scalar/pole ADE derivatives,
point history/spectrum objectives, explicit rejection before copies, the
legacy cell guard and opt-in byte admission, no mutation of input `.grad`,
and release of the preceding
native solver before an uncached reference solve with cyclic GC disabled.

The local execution/streamed tuning and existing policy-driver suite passed
47 checks. The extended driver then passed eight CPU/CUDA checks, including
two new unified full-duration cases. Six relevant interface cases were also
rerun after adding keyword-frequency support. These groups overlap.
The [CPU and RTX 3060 Adam record](validation/execution-selection-example-3060.json)
contains two radius/damping iterations with matching loss and gradient values.
Both selected a resident policy for this small example. A separate CR job was
active, so its calibration timings are not performance evidence. Policy
quality on complete physical applications remains unverified.

The subsequent [RTX 5880 point-spectrum comparison](validation/UNIFIED_POLICY_REPORT.md)
completed both real FP32 and complex FP64 held-out workloads. It selected the
fastest measured full-duration resident policy in both cases. Because that
policy was already the first baseline, tuning had no time-saving payback.
This evidence does not cover detector-plane selection or longer applications.
