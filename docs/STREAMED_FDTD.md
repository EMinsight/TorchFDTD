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

This is a manual execution policy. It is not the automatic scheduler and does
not yet remove the workbench's eight-million-cell scene limit. CUDA slab copies
are synchronous. The separate asynchronous checkpoint staging path in the
resident differentiable solver is not an asynchronous spatial tile pipeline.
These remaining limitations prevent claiming the final large-domain runtime
or a general performance advantage.

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
schedule uses bounded block checkpoints. Local replay currently retains one
tile restart and recomputes prefixes, trading bounded memory for triangular
local replay work. This cost must be addressed before choosing large K values.

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
python -m benchmarks.streamed_adjoint --nx 64 --steps 24 --repeats 3 --output results/streamed.json
```

It measures complete iterations after warm-up, compares signals and gradients,
and records resident and streamed CUDA allocation peaks. It does not compare
external solvers or prove execution beyond the GPU's physical VRAM capacity.
The initial small-grid implementation incurs substantial Python, transfer and
replay overhead. A reduction in device storage is not itself a speedup.
