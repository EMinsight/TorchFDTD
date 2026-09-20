# Adjoint memory design and acceptance gates

Status: an initial limited [Torch discrete adjoint](DIFFERENTIABLE_FDTD.md) and
device/host/disk checkpoint implementation now exist. Native fused backward,
event-owned asynchronous checkpoint staging and an experimental synchronous
[DRAM slab/block adjoint](STREAMED_FDTD.md) have since been added. The broader acceptance
requirements below are not all complete. [Measured development results](validation/ADJOINT_REPORT.md)
and [spatial hierarchy milestones](HIERARCHICAL_EXECUTION.md) distinguish current
capabilities from planned large-domain streaming.

The existing `optimize()` API remains gradient-free differential evolution.
The new Torch API is separate. Current native
forward stepping uses `torch.no_grad()` and reusable E/H buffers. CUDA Graph
records a bounded stepping schedule and does not retain a PyTorch differentiation
graph over the full physical duration.

## Concrete large-grid requirement

A 512 × 512 × 256 grid has 67,108,864 cells. Six FP32 E/H components occupy
1,610,612,736 bytes, exactly 1.5 GiB. Saving those fields for 10,000 steps alone
needs 15,000 GiB, about 14.65 TiB. Curl intermediates, CPML, dispersive states and
autograd bookkeeping would add to this lower bound.

Simple equal-sized block checkpointing is also insufficient here. An idealized
scheme retaining `T/L` boundary states and `L` within-block states has a minimum
near `L = sqrt(T)`. At T = 10,000 this is approximately 200 field states or
300 GiB before auxiliary storage. A `torch.utils.checkpoint` wrapper around the
existing in-place fused kernel is not an adjoint implementation and cannot
supply missing kernel derivatives.

The default workbench still rejects grids above 8,000,000 cells. The separate
[budgeted resident adjoint](BUDGETED_RESIDENT.md) now requires an explicit byte
budget and checks device/host workspace, checkpoint tiers and CUDA indices.
Actual 256-cubed dielectric and 208-cubed ADE runs pass short forward/VJP checks.
Those results do not validate the example's 10,000-step workload. Large problems
that fail resident admission still require the spatial-streaming path.

## Required architecture

1. **One differentiable simulation operation.** Expose a custom
   `torch.autograd.Function` with explicit output observables. Its forward calls
   the native solver without recording each time step. Its backward calls a
   discrete adjoint and returns material/design gradients. The normal NumPy
   Result API does not provide such a gradient path. The separate experimental
   DifferentiableResult now retains Torch point signals and their VJP.
2. **Differentiate the actual update.** Reverse the composition of E/H updates,
   source injection, CPML and active ADE recurrences with correct time staggering
   and monitor weights. A forward solver run with time reversed is insufficient.
   Initial scope should be a fixed mesh and a nondispersive permittivity design
   region with the supported source/monitor objective. Subpixel geometry
   compilation, source/material parameters and other physics need their own VJPs
   before being advertised as differentiable.
3. **Budgeted multilevel checkpoint scheduling.** Use a Revolve-style schedule
   to retain a bounded number of full physical restart states and recompute
   missing states during the reverse sweep. Do not keep an unbounded local
   autograd tape. More checkpoints reduce recomputation, and elapsed forward,
   replay and reverse costs must all be measured.
4. **Complete, minimal restart contract.** Save E/H, CPML memories, active ADE
   P/Q, incident-line states and the exact time/source index. Share immutable
   material/geometry coefficients. Rebuild scratch buffers instead of copying
   them. Observers are not replayed twice into the final result. For linear DFT
   outputs, retain final coefficients and inject their transposed time weights
   during backward. Arbitrary time-history output has its own explicit budget.
5. **Batch admission and offload.** Compute checkpoint capacity from measured
   available VRAM after coefficients, forward/adjoint fields, gradients,
   observers and scratch. Split large designs into microbatches and accumulate
   their gradients. Optional pinned-host checkpoints need a separate host limit
   and measured transfer cost. Offload is not assumed free or always faster.

For a rough E/H-only illustration, eight GPU checkpoints occupy 12 GiB on the
example grid. Forward and adjoint E/H add another 3 GiB. The resulting 15 GiB is
only a lower bound, not a claim that the full job fits the RTX 5880. The budget
must use all dynamic state, static arrays, gradient buffers and allocator/context
overhead, including complex fields or multiple poles when applicable.

The target memory form is

```text
M_peak ≈ C * S_restart + S_forward + S_adjoint
         + M_coefficients + M_gradient + M_observers + M_workspace
```

Here C is limited by the memory budget instead of the number of time steps.
Recomputation time grows as the checkpoint budget shrinks. Design filtering,
projection and optimizer operations can use ordinary PyTorch autograd outside
the long time integration.

## Completion criteria

- Compare each discrete VJP against a small full-autograd reference and central
  directional differences in float64. Verify second-order Taylor remainders
  until numerical precision dominates.
- Include CPML, supported sources and monitors in those checks. Add ADE and
  complex/subpixel derivatives only with independent passing checks.
- Verify checkpoint restore/replay against uninterrupted forward trajectories.
  Check gradients against a full-history reference across several schedules.
- At fixed grid and fixed checkpoint budget, measure peak GPU and host memory
  at 1,000, 10,000 and 50,000 steps. Separate observer history from physical
  restart state. Report transfer, replay and adjoint time.
- Verify independent versus microbatch gradients and objective accumulation.
- Run a port-normalized device design with fabrication filtering and measured
  objective improvement. Differential evolution is not evidence for this gate.

The limited tested scope is marked partial in the feature inventory. Remaining
checks precede a full adjoint capability checkmark or broad comparison claim.

## Primary references

- [PyTorch custom autograd operations](https://docs.pytorch.org/docs/stable/notes/extending.html)
- [PyTorch activation checkpointing](https://docs.pytorch.org/docs/stable/checkpoint.html)
- [Kukreja et al., checkpointing for inversion problems](https://arxiv.org/abs/1802.02474)

The checkpoint literature motivates the memory/recomputation tradeoff. It does
not provide a validated electromagnetic adjoint for this code.
