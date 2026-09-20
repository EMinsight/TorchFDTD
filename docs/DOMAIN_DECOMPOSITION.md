# Experimental single-problem domain decomposition

`torchfdtd.domain_decomposition.DistributedYeeDomain` is an initial-value Yee
propagator for one electromagnetic problem split into nonoverlapping x slabs.
Each process supplies only its owned E, H and scalar or diagonal epsilon.
There is no replicated global field/material allocation and no gather API.
This is an experimental foundation, not a complete distributed `Simulation`
or `PeriodicLayerResponse` execution route.

## Supported contract

Uniform cubic 3D staircase dielectric grids, epsilon >= 1, fixed time steps,
and periodic or unit-modulus Bloch boundaries on every axis are admitted.
Default Region precision remains FP32. FP64 is available for diagnostics.
PML, physical mirror boundaries, sources, monitor histories, ADE dispersion,
nonuniform metrics and early stopping are rejected or absent from this API.
First-order derivatives include local initial E/H and local scalar/diagonal
epsilon. No optical geometry tensor is constructed by the propagator.

Initialize a torch.distributed group externally. Use CPU/Gloo or CUDA/NCCL,
with one explicitly bound CUDA device per rank. Every rank must participate in
the same ordered calls, with the same propagation count and gradient mode.
The library validates common configuration and input errors collectively.
It cannot recover missing/crashed ranks or inconsistent calls by application
code. Configure an appropriate process-group timeout at initialization.

```python
import torch
import torch.distributed as dist
from torchfdtd.domain_decomposition import DistributedYeeDomain

# Launcher initializes the process group and binds the device first.
# region is an identical supported Region on every rank.
domain = DistributedYeeDomain(region, device="cpu", checkpoints=2,
    rank_budget_bytes=512 * 1024**2, max_replayed_steps=100_000)
e, h = domain.zero_state()
# Populate local initial fields using domain.ownership global x offsets.
epsilon = torch.full(domain.shape, 2.25, dtype=domain.dtype,
                     device=domain.device, requires_grad=True)
e_final, h_final = domain.propagate(e, h, epsilon, steps=region.steps)
local_loss = e_final.abs().square().sum()
loss = domain.global_sum(local_loss)
loss.backward()  # Exactly once on every rank, with the same objective seed.
```

`global_sum` replicates the scalar objective while its backward supplies one
local seed, avoiding a world-size multiplier. A rank without observations must
still supply a zero-weight field objective connected to its propagation.
Arbitrarily weighted, different rank seeds do not define this contract.

## Halos and replay

Each H-to-E curl reads the previous x row. Each updated E-to-H curl reads the
next x row. Only global wrap rows receive the Bloch phase. Transverse periodic
and Bloch differences remain local. Halo transposes reverse communication and
conjugate the wrap factor. Complex messages use paired real storage on the wire.
Low-level `exchange_halo` and `transpose_halo` assume correctly shaped local
fields/one-row seeds and the same side on every rank. They are protocol helpers,
not independently differentiable operations. `propagate` supplies the complete
custom transpose, including material accumulation.

Backward uses a fixed number of local E/H checkpoints and binomial replay.
The planned number of recomputed steps is checked before propagation against
`max_replayed_steps`. Zero checkpoints has quadratic recomputation cost and is
intended for small diagnostic cases. Domain configuration cannot be reassigned.
Saved input version errors are shared collectively before backward halo traffic.
The original Region can subsequently change without changing this domain.

Admission reserves local fields, halo buffers, checkpoint banks, transpose and
material-gradient workspace before field allocation. The conservative formula
is `(96 + 2*checkpoints)*3*local_cells*field_itemsize +
16*3*row_cells*field_itemsize + 24*local_cells*real_itemsize + 4096` bytes per rank.
It is a tensor-workspace reservation, not an observed process peak. Caller
objectives, optimizer state, backend allocations and process/runtime memory are
excluded and require a separate reserve. Noncontiguous input copies and complex
row wire storage are covered by the workspace allowance. Neither global state
nor a time-history factor enters the reservation. `last_report` exposes owned
range, reservation, communication bytes, replay work and peak checkpoints.

## Validation and limits

Focused CPU protocol tests compare 2 and 3 ranks, unequal slabs including a
one-cell slab, real/complex FP64 and complex FP32, scalar/diagonal epsilon,
nonzero transverse Bloch phases, fields and all material/initial-state VJPs to
the resident solver. Independent halo Hermitian identities and local material
central differences check the seams. This local protocol emulator substitutes
only transport/collectives and is explicitly not distributed-runtime evidence.

On the current Windows PyTorch 2.10.0+cu126 host, Gloo reports compiled support
but `ProcessGroupGloo.create_device(hostname="127.0.0.1")` raises
`makeDeviceForHostname(): unsupported gloo device`. Actual spawned group
initialization also failed. The real Gloo tests therefore skip on this runtime.
A process-local UV transport override did not fix it and no global environment
was changed. Real Gloo tests remain enabled where device creation succeeds.
The real two-CUDA test requires at least two visible GPUs and NCCL and skips on
this single-GPU, non-NCCL host. No multi-GPU speed, scaling, >48 GB capacity or
complete source-to-observable distributed simulation has been demonstrated.
