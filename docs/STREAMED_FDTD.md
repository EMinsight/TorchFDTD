# Experimental DRAM space-time execution

`StreamedSimulation` keeps the global epsilon, E/H, CPML and block checkpoints
in CPU DRAM. Only an extended x slab is moved to the selected execution device.
Its first-order custom backward returns a CPU epsilon gradient, so ordinary
Torch geometry parameters and optimizers can remain on CPU.

```python
from photonweave import StreamedSimulation, StreamedAdjointOptions

# project is a validated real, nondispersive point-observation scene.
# epsilon is a CPU float32/float64 tensor matching the region precision.
model = StreamedSimulation(project, StreamedAdjointOptions(
    slab_width=32, temporal_depth=4, checkpoints=2,
    gpu_budget_bytes=1024**3, host_budget_bytes=8*1024**3,
))
result = model(epsilon)
loss = result.signals.square().sum()
loss.backward()
```

The default uses reusable buffers and synchronous transfers. Set
`tile_transfers="async", tile_buffers=2` to use bounded pinned staging, separate
H2D/D2H streams and ordered host reductions. One to three slots are supported.
Every slot is released only after its previous copy and host consumer finish.
Errors drain outstanding work before retry. More slots consume more memory and
are charged to admission. Asynchrony is not a promise of full transfer/compute
overlap or faster execution for every workload.

Device buffers are shared across geometry specializations instead of retaining
one field bank per tile. CUDA argument views are cached against source text,
pointers, shapes, dtype and device. Buffer growth invalidates these bindings.
The direct view path retains Torch ownership and records the consumer stream.
`cuda_binding="dlpack"` and `reuse_tile_buffers=False` retain comparison paths.
Disabling reuse requires synchronous transfers.

For grids above eight million cells, construct `Region(memory_mode="streamed",
...)` and use this Python API with explicit budgets. This opt-in cannot run
through the resident solver or workbench. The resident limit remains unchanged.
Each grid axis is limited to one million cells to bound mesh metadata. Passing
admission is not evidence of physical-VRAM-overflow performance. A unified
resident/DRAM/NVMe policy remains unfinished.

## Measured policy selection

```python
from photonweave import tune_streamed

tuning = tune_streamed(project, epsilon, probe_steps=24, repeats=2)
model = StreamedSimulation(project, tuning.options)
result = model(epsilon)
print(tuning.report)  # includes the total cost of tuning
```

The default small candidate set varies slab width, temporal depth and transfer
policy. An explicit list of `StreamedAdjointOptions` can also vary checkpoint
and buffer counts. Every candidate must fit the full-duration reservation before
its shorter prefixes are timed. One warm-up and repeated complete prefix iterations
include forward, replay and backward. Candidate signals and gradients must agree.
The user's design values and accumulated gradients are preserved.

The default `strategy="replay_cost"` rounds `probe_steps` up to a whole temporal
block for each candidate and measures that duration and twice it, clipped to
the full duration. For example, K=32 and `probe_steps=12` use 32 and 64 steps.
Only a measurement of the complete requested run may end on a partial block.
It separates startup and per-block
costs and counts the actual checkpoint schedule's forward replays to predict a
full iteration. Negative fitted costs trigger a work-count fallback. A partial
terminal block is counted as a full block. `strategy="prefix"` retains the old
single-prefix selection for comparison.

`max_calibration_steps=512` bounds each calibration duration. Candidates that
would exceed it are rejected before simulation, with the reason recorded.
Increasing this limit explicitly permits longer calibration runs. Each row
records its actual `calibration_steps`. All distinct durations are checked
against the first admitted policy, including additional reference evaluations
when another depth introduces a new duration. Reference signal/gradient buffers
are charged to the host budget, and all additional runs count in total tuning
time. Different candidates are compared by their predicted full-duration cost,
not by raw times from unequal calibration lengths.

Optional `refine_candidates=2` remeasures the two initially fastest predicted
candidates at twice their longer calibration duration, clipped to the target.
This extra duration is used only when it is longer and within the calibration
limit. Predictions are then refitted using the two longest measurements.
Potential reference buffers for this stage are reserved up front. Set
`refine_candidates=0`, the default, to disable refinement. The report retains initial
predictions, refined indices and all timings. This is a bounded additional
measurement, not a statistical confidence guarantee or exhaustive search.
In sequential trials without concurrent agent-launched regression tests, both modes selected the fastest
candidate but refinement increased tuning cost. It therefore remains opt-in.

This is a timing model, not a proof of full-run optimality. Amortize tuning across
repeated optimization iterations and re-evaluate when the workload or hardware
changes. The earlier prefix selector chose a policy 20–29% slower than the best
candidate in two longer-duration runs. The replay-cost selector chose the best
of those four candidates in a subsequent held-out run, with 13 seconds of tuning
overhead. This does not establish general superiority. Construct the returned
policy's model with the original full project. See the
[replay-cost validation](validation/REPLAY_POLICY_REPORT.md).

For a base temporal depth of at least eight and no local checkpoints, the default
candidate set also tries one local checkpoint on the wide synchronous and,
when available, asynchronous policies. Explicit candidates can vary
`local_checkpoints` from zero to 32. The tuner still compares complete iterations
and reserves checkpoint space before running them. Whole-block calibration
preserves each candidate's halo volume and local replay work. Startup noise and
partial blocks in the full target can still bias extrapolation. Validate the
selected policy at the intended duration. The
[aligned-calibration report](validation/ALIGNED_POLICY_REPORT.md) records
held-out measurements of deeper tiles.

## Dependency and transpose

Every tile in a time block reads the same immutable old global state. Two
radius-one curl updates per full step admit a conservative x halo of 2K for
K steps. The full y/z extent is retained. Only the owned x interior is written
to the next global state. Global CPML ends are clipped instead of extending
evolving ghost cells. Real periodic x boundaries use replicated wrapped inputs,
including nonuniform seam metrics and source copies.

CPML state ownership follows the derivative's target cell. The forward and
backward staggerings therefore require different ownership offsets. A point
observation is emitted only by the tile owning that physical point.

Backward seeds each tile's owned output and intermediate observations, replays
its physical state, and uses the native fused CUDA transpose. All initial-state
and epsilon halo contributions are added back to their original host indices.
Repeated periodic copies accumulate rather than overwrite. The global temporal
schedule uses bounded block checkpoints. By default, local replay retains one
tile restart and recomputes prefixes, requiring K(K-1)/2 replay steps per tile.
Optional `local_checkpoints` adds bounded complete local E/H/CPML states and a
recursive replay schedule. Both local and global checkpoint counts remain fixed
as the full simulation duration grows. Each workspace slot is charged for its
local checkpoint banks. The report records local replay steps and peak live
local checkpoints.

Local checkpoint copies can outweigh the eliminated forward updates. In one
RTX 5880 case, K=32 with one local checkpoint reduced a complete iteration from
0.591 to 0.396 seconds. A smaller K=12 case became slower. The zero-checkpoint
path therefore remains the default and stays in the automatic candidate set.
See [the local replay measurements](validation/LOCAL_REPLAY_REPORT.md).

## Admission and validation

Explicit host and device budgets are checked before physical state allocation.
The conservative reservation charges state banks, checkpoint capacity, local
primal/adjoint workspace, coefficients and source/output histories. This is an
allocation estimate, not a measured whole-process cap. Caller-owned geometry,
objectives, optimizer storage, CUDA context and allocator caching remain outside
the reservation. Reported CUDA peaks from the benchmark are Torch allocations.

`tests/test_spacetime.py` compares both the operator and its transpose with the
full-domain Torch autograd oracle. Tests include random E/H and CPML memories,
nonzero endpoint adjoints, duplicate observations, scalar/diagonal epsilon,
periodic replication beyond one domain length, nonuniform meshes, plane sources,
multiple temporal blocks and a geometry-radius chain.

Run the reproducible native capacity/time ablation with:

```sh
python -m benchmarks.streamed_adjoint --nx 64 --steps 24 --repeats 3 --compare-bindings --compare-transfers --output results/streamed.json
python -m benchmarks.streamed_policy --output results/policy.json
```

It measures complete iterations after warm-up, compares signals and gradients,
and records resident and streamed CUDA allocation peaks. It does not compare
external solvers or prove execution beyond the GPU's physical VRAM capacity.
The small-grid implementation still incurs substantial Python, transfer and
replay overhead. A reduction in device storage is not itself a speedup. The
[runtime validation report](validation/TILE_RUNTIME_REPORT.md) records both
improvements and the prefix selector's longer-duration prediction errors.
