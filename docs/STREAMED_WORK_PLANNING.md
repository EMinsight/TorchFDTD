# Plan streamed work without probe simulations

`estimate_streamed_work` counts the current slab/checkpoint algorithm's logical
state-file traffic and field-update cell-steps from project metadata. It creates
no epsilon values, field arrays, gradient arrays or scratch banks. This makes it
usable before constructing a domain larger than VRAM, without the extra dense
gradient references required by the measured tuner.

`plan_streamed_work` adds the existing live CPU/GPU/disk admission checks and a
bounded candidate set. It includes larger temporal depths, narrower slabs to
accommodate them, and wider slabs. It returns admitted candidates and their
Pareto frontier. Precision, physical grid, duration and global checkpoint count
are preserved. File backing requires an explicit directory and disk budget.

```python
from torchfdtd import StreamedAdjointOptions, StreamedSimulation, plan_streamed_work

options = StreamedAdjointOptions(
    device="cuda", slab_width=4, temporal_depth=2, checkpoints=0,
    host_budget_bytes=88 * 1024**3, gpu_budget_bytes=32 * 1024**3,
    state_storage="disk", state_directory="C:/fdtd-scratch",
    disk_budget_bytes=280 * 1024**3,
    disk_free_reserve_bytes=100 * 1024**3,
)
plan = plan_streamed_work(project, options,
    host_free_reserve_bytes=16 * 1024**3,
    selection="min_disk_traffic")
if plan.options is None:
    raise RuntimeError(plan.report)  # Candidate-specific admission failures.

# Build epsilon separately, and replan immediately before execution if resource
# availability or caller-owned geometry/optimizer allocations have changed.
result = StreamedSimulation(project, plan.options)(epsilon)
result.signals.square().sum().backward()
```

The byte budgets above illustrate the user's workstation contract, not a hardware
recommendation or guaranteed reservation. RAM floors are checked at planning
time and reported explicitly. Selected options do not lock OS memory or add a
persistent RAM-floor monitor. The solver rechecks its normal execution budgets,
and callers must replan to check the requested extra RAM floor again. Disk-bank
creation retains the existing live disk-free floor.

## Selection means a declared metric

The default `selection=None` returns evidence without choosing a policy.
`min_disk_traffic` minimizes logical state-bank reads plus writes.
`min_compute_work` minimizes field-update cell-steps including global and local
checkpoint replay. Ties use the other work metric and admitted memory bounds.
These are work counts, not elapsed-time estimates or a claim of the fastest policy.
Host-only candidates have zero actual file traffic, so the secondary compute
metric resolves their ties. The report also includes hypothetical file traffic.

Use `candidates=[...]` for explicit policies or `temporal_depths=[...]` for a
bounded generated search. Up to 64 candidates are accepted. Different local
checkpoint or transfer policies can be supplied explicitly. Their live memory
admission still applies. Candidate reports and the Project snapshot are returned
as independent JSON copies.

The Pareto axes are logical file bytes, cell-steps, host reservation and active GPU
reservation. A CPU policy has zero active GPU reservation. A policy is retained
when another admitted candidate does not improve all these axes simultaneously.

## What is counted

- Every field and CPML state row, including unequal face layers and repeated
  periodic/Bloch halo images.
- The exact binomial global checkpoint schedule, implicit-zero initial state,
  actual partial terminal block and local checkpoint replay.
- Forward state reads/writes and backward primal, owned adjoint and overlapping
  halo-reduction traffic. Initial zero rows do not incur reduction reads.
- Extended-tile cell visits for original forward, global replay, local replay
  and adjoint updates, plus tile visits and checkpoint-save counts.

Logical `StateStore` bytes are buffered file I/O. They are not physical SSD/HDD
transactions, PCIe traffic or OS cache use. Compute counts omit packing, source
and observer kernels, material synthesis, checkpoint copies, full-domain material
gradient reduction and optimizer work. They are not FLOPs. Asynchronous transfer
overlap is not predicted by this model. The existing `tune_streamed` measured
two-duration policy search remains available separately.

The initial planner supports native nondispersive scalar/diagonal epsilon and
fixed point observations in the existing streamed source/boundary scope. It
does not admit ADE, endpoint PMC, tensor, trainable-waveform or specialized
geometry/density carriers under this dense-parameter memory model. Spectral
plane planning requires its own observation reservation and is not exposed by
this first API. Actual values, materials and source placement are revalidated by
execution. The pure work estimator does not itself admit a device or storage tier.

## Recorded checks

Five independent CPU file-bank cases compare predictions with actual executed
methods and I/O counters. They cover asymmetric CPML, scalar/diagonal epsilon,
partial blocks, global/local checkpoints and repeated periodic/Bloch windings.
All byte counts and replay/cell-step counts agree exactly. Histories and material
VJPs also agree with resident execution. Six planner checks cover metadata-only
allocation, immutable reports, candidate scope and memory-floor rejection.

The [CUDA driver](../benchmarks/streamed_work_validation.py) tests two explicit
policies on the same 64 x 32 x 32, ten-step FP32 problem. It selects depth four
instead of two at slab width four. Measured logical state I/O falls from
117,833,728 to 64,618,496 bytes, a **45.16% reduction**. Output histories are
identical and material-gradient relative L2 difference is 7.30e-9. Every
predicted phase-specific byte count matches the actual file-store record.
The selected policy does more replay cell-work, 8,519,680 versus 5,898,240.
Cold execution times are retained only as run diagnostics, not a speed comparison.

A separate metadata-only calculation for 1152 x 1024 x 2048 real FP32 cells
counts 58,265,174,016 state bytes. For the same two policies, hypothetical total
logical file traffic is 3,364.35 versus 1,844.96 GiB. No large simulation was
executed or admitted by that calculation. It does not alter the separate frozen
RTX 5880 capacity run or establish its performance.

The depth-two prediction was checked against the completed frozen 61326d2
RTX 5880 run. Every phase-specific byte count and the 3,364.35 GiB total match
that run's recorded counters exactly. Depth four was never executed at this
size and remains a prediction only.

See the [machine evidence](validation/streamed_work_planning.json) for source
hashes, actual CUDA counters and the separately labeled large metadata report.
