# Material-aware streamed policy tuning

`tune_streamed` calibrates dielectric Yee/CPML execution.
`tune_streamed_dispersive` extends the same scheduler to the coupled
E/H/CPML/P/Q state and all four material gradients. Both accept point time
signals or online point spectra. Reuse the selected options with the original
full-duration project across optimization iterations.

```python
from photonweave import (
    StreamedAdjointOptions, StreamedDispersiveSimulation,
    tune_streamed_dispersive,
)

base = StreamedAdjointOptions(
    device="cuda", slab_width=32, temporal_depth=8,
    checkpoints=2, gpu_budget_bytes=24 * 1024**3,
    host_budget_bytes=64 * 1024**3,
)
selection = tune_streamed_dispersive(
    project, epsilon_inf, strength, omega0, gamma,
    options=base, frequency_hz=frequency_hz,
    probe_steps=16, repeats=2,
    reference_cache_bytes=64 * 1024**2,
)
model = StreamedDispersiveSimulation(project, selection.options)
result = model.spectrum(epsilon_inf, strength, omega0, gamma, frequency_hz)
loss = result.fields.abs().square().sum()
loss.backward()
```

Input tensors reside on CPU. Material tensor dtypes must match epsilon.
Python scalars and pole sequences are accepted. Tuning uses detached leaves
without changing user tensors, their graph or existing `.grad` values.
It evaluates a field-energy proxy rather than the user's device objective.
Timing includes input packing, solver preparation, forward, the proxy
objective, replay and backward. It excludes model construction, gradient
comparison, the caller's geometry graph, optimizer and device objective.

Use `--tune --streamed` with
`examples.differentiable_dispersive_design.py` to select a policy before the
small geometry-and-damping Adam example. Tuning costs time and should be
amortized across enough subsequent iterations.

## Budget fitting and cost selection

Default proposals compare core width, temporal depth, synchronous/asynchronous
staging and global checkpoint counts. They include zero global checkpoints and
up to two more than the base count. A base temporal depth of at least eight
also enables a local-checkpoint comparison. There are at most twelve policies.

For a generated proposal that does not fit, the planner searches for the largest
admitted core width up to the proposal's width at fixed temporal depth. If even
one owned x cell fails admission, it halves the temporal depth and retries.
The reservation includes the full target duration, P/Q, material gradients,
local/global checkpoints and tuner comparison memory. It uses current free
resources as well as explicit byte budgets.

If DRAM cannot admit a generated proposal, file banks are considered only when
both `state_directory` and `disk_budget_bytes` were explicitly configured.
The planner preserves `disk_free_reserve_bytes`. It never invents a path or
spills into another drive. This is a capacity fallback, not a claim that file
execution is faster. Each resulting candidate is measured before selection.

An explicit `candidates=[...]` list is preserved. Such candidates are measured
or rejected with their admission reason. The scheduler does not silently alter
an explicit policy. Execution rechecks admission because a plan is not a
resource reservation lease.

Two whole-block calibration durations feed the checkpoint-replay cost model.
Ordering uses predicted full-duration cost, or a measured full duration when
the calibration reaches the target. Optional refinement remeasures the
initially fastest candidates for longer. Reports retain proposals, capacity
adjustments, rejection reasons, probe samples, predictions and reference
overhead. `warmups_per_probe=1` means one warmup for each calibration duration,
not one for the entire candidate.

## Bounded reference memory and meaningful gradient checks

The former tuner retained a full reference gradient for every calibration
duration. References now use a byte-bounded LRU cache.
`reference_cache_bytes=0` disables retention and recomputes references when
needed. Oversized references bypass the cache. Peak retained bytes and
hits/misses are separate from temporary comparison workspace.

Cached gradients own compact copies. A small autograd slice cannot retain a
larger packed material carrier unnoticed. Admission includes the cache plus
temporary candidate/reference gradients and outputs. Disabling caching does
not imply zero reference memory. Full CPU material-gradient buffers remain
necessary. The caller's geometry and optimizer memory are additional.

ADE derivatives are checked independently in the coordinates
`epsilon_inf`, `strength * dt**2`, `omega0 * dt` and `gamma * dt`.
The SI strength derivative is divided by `dt**2` before comparison. This avoids
accepting a wrong derivative merely because its value is around `1e-30` and
below an ordinary absolute tolerance. No division by omega0 is needed, so the
Drude limit remains well-defined.

For spectral calibration, fields are divided by `steps * dt` before the proxy
loss and comparison. Every duration uses the same frequencies, with a supplied
full window sliced to each prefix. This keeps tiny DFT units from hiding
disagreement. The original project and window remain unchanged.

## Limits and validation

An [RTX 5880 held-out study](validation/MATERIAL_POLICY_REPORT.md#held-out-rtx-5880-real-fp32-policy-comparison)
now records a 128-step two-pole FP32 case selected using at most 32 calibration
steps. The chosen policy was fastest among the six tested full-duration
policies. This is a resident-size scheduling ablation with the earlier halo,
not a beyond-VRAM throughput claim.

The experimental [unified selection API](EXECUTION_SELECTION.md) extends the
same search to resident candidates and includes CPU/GPU interface-copy costs.
Full-duration validation of that broader selection remains separate.

Tests include a policy error isolated to a material derivative while forward
values remain exactly unchanged, CPU/file equivalence, complex spectra,
input/gradient preservation, compact-cache eviction, rejection before packing,
default budget fitting and CUDA asynchronous staging.

This is bounded empirical selection rather than a globally optimal scheduler.
It does not establish a full-duration speed advantage or a speed guarantee when
the workload changes. File timings include OS cache effects and cannot be
interpreted as sustained physical-device bandwidth. Resident execution,
multi-GPU decomposition and joint batch memory remain outside the search.
The point-observation proxy does not calibrate a complete fixed-plane or CR
reconstruction objective. Validate the selected policy on the intended workload
and retain its accuracy and full-duration timing checks.

## Full-duration policy check

The `benchmarks.streamed_policy` driver now accepts `--dispersive` for two
Drude/Lorentz poles and `--spectrum` for online point DFTs. It checks every
admitted policy against a separate resident calculation at the target duration.
All four material-gradient groups are compared in scaled coordinates.
Rejected candidates remain in the report and are not run again.

```console
python -m benchmarks.streamed_policy --dispersive --spectrum --checkpoint-tiles --nx 128 --ny 128 --nz 128 --steps 128 --probe-steps 12 --repeats 3 --precision float32 --gpu-budget-gib 16 --host-budget-gib 64 --require-held-out --output results/ade-policy-128.json
```

`--checkpoint-tiles` compares width/depth, asynchronous staging, local replay
and global checkpoint counts. Add `--complex-bloch --precision float64` for
the complex case, or `--device cpu` for a driver correctness check. The CPU
path omits CUDA asynchronous policies.

The report preserves the original selection, every full-duration repetition,
the measured fastest policy and the selected-to-fastest time ratio. It also
records total tuning wall time, including planning and validation, and the
number of subsequent iterations needed to repay tuning relative to the first
admitted baseline. If the selected policy saves no time, payback is `null`.
Calibration reaching the target is explicitly marked as overlapping rather
than held out. `--require-held-out` rejects such a configuration before solving.
Partial records identify the active stage and completed repetitions. They are
progress records, not restartable solver state.

This benchmark needs a resident reference and does not demonstrate physical
VRAM overflow. The separate capacity driver serves that purpose. Small driver
tests validate recording and numerical agreement, not scheduler speed or
generalization. Full-sized measurements must run without competing GPU jobs.
