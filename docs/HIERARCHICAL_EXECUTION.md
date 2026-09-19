# Differentiable and hierarchical execution priorities

The two main development objectives are a useful Torch inverse-design path and
large FDTD runs that are not limited by a single GPU's resident state capacity.
Correct gradients and memory-efficient execution must advance together. The
adjoint cannot be postponed until every multi-GPU and storage feature is done.

The first [differentiable implementation](DIFFERENTIABLE_FDTD.md) provides a
discrete Yee/CPML adjoint, bounded replay checkpoints, explicit three-tier
checkpoint placement and a Torch geometry/Adam example. The new experimental
[DRAM slab API](STREAMED_FDTD.md) streams spatial state and transposes its halo
dependencies. It now has reusable buffers, an optional asynchronous tile pipeline
and two-duration replay-cost policy selection, with small-grid parity tests and an
[8.39-million-cell admission smoke test](validation/REPLAY_POLICY_REPORT.md). It is not a
completed oversized-domain or high-throughput runtime. The UI continues
to use the normal forward solver.

## Adopted design choices

1. **Hardware measurements.** Record actual H2D/D2H throughput, host capacity,
   storage capacity and honest cache semantics before cost-model selection.
   The initial bounded profiler is implemented. Sustained NVMe tests, copy/compute
   overlap and a calibrated full-iteration model remain to be implemented.
2. **DRAM spatial streaming before SSD spatial spill.** Start with slabs and
   an exact Yee domain of dependence, then asymmetric/shrinking space-time tiles.
   Reuse the existing fused Yee/CPML operator and the checkpoint state contract.
3. **Event-owned asynchronous buffers.** Overlap H2D for the next tile, current
   compute and D2H for the prior tile using bounded double/triple buffering.
   Never overwrite a pinned/GPU buffer until its consumer event completes.
4. **Joint tile and temporal-depth selection.** Search feasible tile dimensions
   and K with measured compute, host-copy, halo and launch costs. K=32–128 is a
   candidate range, not a required setting. Shorter blocks may win for small
   tiles or high halo costs. Charge tuning time and validate held-out cases.
5. **Gradient-aware execution.** Transpose the actual tile dependencies, source
   injection, halo exchange/reductions, CPML and later ADE. Reordered forward
   parity does not establish backward parity. Measure both.
6. **NVMe as a bounded backing store.** Add sequential layouts, prefetch,
   integrity/version metadata and failure recovery after the DRAM path works.
   GDS is optional after confirming platform/driver/filesystem support. Current
   Windows execution has no validated GDS path.

VRAM holds active fields and nearby checkpoints. DRAM holds future tiles and
additional checkpoints, with only the staging pool pinned. NVMe holds less
frequently reused state. A finite-difference step eventually updates the full
domain, so a cold tile is cold relative to the schedule, not permanently inactive.
No active region may be skipped merely because it was placed on disk.

The model minimizes complete simulation or optimization-iteration time under
VRAM, host and storage limits and verified observable/gradient error tolerances.
An ideal overlapped stage approaches the maximum of independent stage times,
but pipeline fill/drain, shared PCIe paths, launch costs, halo duplication and
backward synchronization remain. Full overlap is a hypothesis to measure.

## Delivery gates

| Order | Milestone | Required evidence |
|---|---|---|
| 1 | Limited real dielectric discrete adjoint and physical restart | Full-autograd, Taylor and restart-gradient parity. Initial implementation available. |
| 2 | Fused backward, functional observers/ports, exact peak accounting | Full iteration speed and memory, output/normalization correctness. |
| 3 | Bounded host staging and async checkpoint pipeline | Same gradients under randomized delays and cancellation, queue limits, useful overlap. |
| 4 | DRAM-backed space-time slab execution | Complete E/H/CPML parity, source/observer crossings, periodic seams, residency limit proof. |
| 5 | Hardware-aware tile/K/checkpoint/microbatch policy | Compare with tuned fixed policies and charge selection cost. |
| 6 | Required ADE/Bloch/subpixel geometry derivative combinations and robust design | Physical shape-gradient convergence and finer hard-geometry revalidation. |
| 7 | NVMe spatial backing and single-domain multi-GPU | Larger feasible cases, I/O and per-device memory measured, exact supported backward. |

This order is revisable when a concrete target device requires an earlier
physics feature. The small correct adjoint remains a regression oracle while
the spatial execution engine changes. Existing forward UI/Python features remain
available, and unsupported differentiable combinations raise explicit errors.

## Competitive evidence and research claims

FDTDX's [June 2026 refactor discussion](https://github.com/ymahlau/fdtdx/discussions/349)
explicitly proposes a PyTorch rewrite and CPU↔GPU memory swapping. Its
[performance issue](https://github.com/ymahlau/fdtdx/issues/104) proposes
DiamondCandy scheduling including sources, detectors, boundaries and gradient
execution. These are documented plans, not our measurements of delivered speed.
The earlier observation that its public README describes JAX does not contradict
the announced rewrite.

The [July multi-GPU gradient issue](https://github.com/ymahlau/fdtdx/issues/417)
reports replicated backward memory and slower two-GPU execution for one example.
It is an external user report with specific settings, not a general ranking or
an independently reproduced benchmark. We do not place its numbers into a table
as PhotonWeave comparative results.

Space-time blocking and hierarchical checkpointing are established methods.
The candidate contribution is an accurate differentiable electromagnetic
execution policy with demonstrated equal-error capacity/time advantages. The
claims of preserving 70–90% resident speed, retaining 20–50% speed on SSD, or
handling 10–50 times larger problems are **unmeasured targets**, not promises.
A storage-capacity ratio alone does not establish maximum solvable cells because
coefficients, CPML/ADE, halos, double buffers, adjoints, results and checkpoints
all use space. Current fixed scene limits remain until end-to-end admission and
large-index allocation tests justify changing them.

The first application is a normalized photonic objective with fabrication-aware
batch design. A regularized sphere/point-energy Adam example is an API proof,
not yet that application. Shape-gradient and hierarchy hypotheses should be
tested separately before attributing a combined improvement to either one.

## Lessons adopted from LLM memory systems

The [FlexGen paper](https://proceedings.mlr.press/v202/sheng23a.html) and its
[offloading formulation](https://proceedings.mlr.press/v202/sheng23a/sheng23a.pdf)
optimize tensor placement and access across GPU, CPU and disk. Its objective is
throughput-oriented language-model inference. We adopt the explicit capacity
constraints and measured cost-model approach, not its LLM throughput claims or
its assumption that very low-bit state is accurate for electromagnetics.

The versioned [vLLM offloading guide](https://docs.vllm.ai/en/v0.27.0/features/kv_offloading_usage/)
documents pinned host blocks, asynchronous GPU copies and secondary storage
behind the CPU tier. This motivates bounded staging and completion-owned
buffers. FDTD field blocks are repeatedly modified and share causal halos,
so prefix-cache reuse and eviction semantics cannot be copied unchanged.

[PowerInfer](https://arxiv.org/abs/2312.12456) exploits neuron activation locality.
In our plan, hot/warm/cold denotes scheduled reuse distance only. Field magnitude
does not authorize skipping cells. Both forward and backward dependencies must
be represented even in a region with small current field amplitude. Static
material coefficients can be cached differently from evolving fields and
CPML/ADE state. Checkpoints also have distinct next-use times.

No code from those runtimes has been incorporated by this change. Hierarchical
offloading, deterministic prefetch and space-time stencil blocking are prior
art. Novelty must be demonstrated in the verified electromagnetic execution
policy and its measured capacity/time/error trade-off.

### Concrete scheduler contract

The planned decision variables are tile dimensions, temporal depth K, buffer
count, state/checkpoint placement and compatible design microbatch size.
Minimize full forward-plus-backward iteration time, subject to all three byte
budgets and observable/gradient accuracy tolerances. A candidate must charge:

- Coefficients, forward and adjoint E/H, CPML and supported material states.
- Input halo, redundant halo computation, gradient halo reductions and outputs.
- Every simultaneously live device, pinned-host and file buffer.
- Checkpoint replay, source history, geometry VJP and optimizer allocations.
- Pipeline fill/drain, synchronization, tuning and serialization costs.

The first search will enumerate feasible slab/K/buffer candidates and evaluate
their dependency graph using measured operator and transfer costs. Halo growth,
integer shapes and overlap contention make the complete problem nonlinear.
FlexGen's linear program is not itself a solution to this FDTD problem. Any
later linear or mixed-integer approximation must be checked against measured
candidate executions and a tuned fixed-policy baseline.

Construct the dependency cone from the actual staggered E and H updates, with
component-specific offsets and periodic seams. Do not assume one-cell halo per
full step without deriving it. Load a tile and its initial dependencies, perform
only updates valid at each local time, and write the owned interior at the
common block endpoint. Independent tiles read the same old block state, never
a mixture of already advanced and old neighbors. Backward transposes this
graph and sums all shared-halo contributions to their owners.

The scheduled pipeline is disk-to-host, host-to-device, compute, device-to-host
and host-to-disk. Each slot carries a tile identifier, physical time/version,
precision and completion state. A transfer event protects reuse. Delayed I/O,
cancellation and failure cannot release a buffer still in use. A known future
access sequence allows deterministic prefetch, but shared PCIe/DRAM resources
and CUDA copy-engine limits still determine actual overlap. Profile simultaneous
directions and compute, not just isolated bandwidth.

Lossless FP32/FP64 is the first supported storage policy. FP16/BF16 or scaled
tile storage is a later opt-in experiment. Quantized checkpoint restoration
changes the replayed trajectory and can bias gradients. It cannot inherit the
exact-replay label or silently use a straight-through gradient. Acceptance needs
long-duration phase/energy/stability checks, resonant and high-index structures,
small-amplitude signals, central differences and Taylor tests, and a complete
optimization revalidated at the reference precision. Conversion and scale
metadata also count toward transfer and runtime costs.

Measure resident, K=1 streamed, temporally blocked, async, auto-selected and
optional compressed policies separately. Report GCUPS, complete optimization
time, maximum admitted cells, all-tier peak memory, transferred bytes, redundant
updates and error. Capacity and speed form a measured Pareto frontier only
after these runs. Neither a memory-capacity ratio nor an LLM result establishes
our achievable FDTD problem size or speed.
