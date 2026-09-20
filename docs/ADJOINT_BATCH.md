# Shared-budget FDTD case replay

`RecomputedAdjointBatch` connects independent FDTD projects to one coupled
Torch objective with joint solver-memory admission. It supports point histories,
point spectra and fixed detection planes, with dielectric or ADE materials and
resident, DRAM or file-backed case policies. It returns the ordinary result
objects, so plane flux, reference normalization and downstream Torch objectives
retain their existing interfaces.

```python
from photonweave import AdjointCase, AdjointBatchOptions, RecomputedAdjointBatch

cases = [
    AdjointCase(project_a, policy_a, parameter_indices=(0,), frequency_hz=frequencies),
    AdjointCase(project_b, policy_b, parameter_indices=(0,), frequency_hz=frequencies),
]
batch = RecomputedAdjointBatch(cases, AdjointBatchOptions(
    host_budget_bytes=64 * 1024**3, gpu_budget_bytes=24 * 1024**3,
    output_budget_bytes=128 * 1024**2,
))
epsilon = build_epsilon(radius)  # Preserve the caller's Torch geometry graph.
plan = batch.plan(epsilon)      # No domain fields are allocated.
result = batch(epsilon)
loss = coupled_objective(result.cases)
loss.backward()
optimizer.step()
```

`parameter_indices` selects material tensors from the batch call. One index
binds epsilon. Four indices bind epsilon-infinity, strength, resonance and
damping, in that order. Shared indices accumulate gradients from every case.
Different indices support different grids, material layouts and precisions.
All material tensors are real CPU tensors. CUDA cases include differentiable
input and result transfers. Each case must match its own project's dtype.
Fixed frequencies and optional 3D `quadrature_counts` belong to each case.

Forward evaluates each case without retaining its solver graph. Backward
receives the seeds from the complete coupled objective, replays one case graph
at a time and adds derivatives into the original parameter bindings. It does
not replace a coupled objective by independent per-case losses. Unused cases
are skipped in backward. Unused parameters receive no gradient. Repeated
first-order backward is supported when the caller retains the outer graph.
Higher-order differentiation is rejected.

## Joint admission

Every case's shape, observation layout and reservation are checked before the
first simulation. Resources are checked again immediately before each case
and its replay. The total host reservation is

```
3 * all_output_bytes + 4 * parameter_bytes
+ sum(case_layout_bytes + result_metadata_bytes + 64 KiB)
+ max(active_case_host_reservation)
```

The output term covers retained results, incoming seeds and a comparison/copy
allowance. The parameter term reserves accumulation and gradient carriers.
Interpolation metadata persists across cases. Its contribution can be counted
again in the active case's own conservative reservation. GPU and file budgets
use the maximum active-case reservation because solver graphs and temporary
file states do not overlap between cases. File execution requires an explicit
batch disk budget as well as the case's directory, budget and free-space floor.
All case-specific budget checks remain in effect.

This is an engineering admission model for one batch invocation, not an
exclusive OS reservation or a process-RSS guarantee. Metadata is constructed
before admission and has an allowance for Python objects. Caller input and
geometry storage, fixed reference results owned by the caller, the coupled
objective, optimizer graphs, CUDA context, unrelated allocations and OS file
cache are outside these budgets. Retaining additional batches or objective
graphs requires additional memory. A live resource shortage raises an error
instead of silently changing an existing graph's execution policy.

Replay compares outputs against the saved forward values. The default absolute
tolerance is zero so a small SI-scaled spectrum cannot hide a large relative
drift. Project state used by a prepared case is checked against its snapshot.
Input in-place mutation is also subject to Torch's saved-tensor version checks.
The supported case operations are fixed native FDTD operations, with no hidden
trainable closure parameters.

This API is sequential replay. It does not implement concurrent adjoint
microbatches, multi-GPU scheduling or joint tile/microbatch optimization. The
forward CUDA cohort batch remains a separate API. A previously selected
`AdjointExecutionPolicy` can be reused, but this batch does not retune it.

## Example and checks

```console
python -m examples.differentiable_ensemble_design --device cuda --dispersive --execution mixed
```

The three-case 3D example shares a differentiable sphere radius and optional
material damping. It combines matched-reference plane fluxes with a variance
penalty and applies Adam. `resident`, `streamed` and `mixed` select explicit
policies. Fixed Bloch phases and dipole sources make this a graph-connectivity
demonstration, not converged plane-wave angular performance or CR validation.
The [CPU/CUDA record](validation/budgeted-ensemble-example-3060.json) retains
exact source hashes and both two-iteration histories. Loss, normalized flux,
radius and material/geometry derivatives agree with relative tolerance 1e-9
and absolute tolerance 1e-11. A concurrent local CR job excludes these timings
from performance comparisons.

The final related regression group passed 134 tests, including the batch API,
capacity driver, generic replay, execution selection, detector planes and
spectral adjoints. These targeted checks are not a whole-product acceptance test.

Tests compare coupled objectives and all material VJPs with individually
retained graphs on CPU and CUDA. They include mixed shapes/dtypes, shared and
independent bindings, geometry gradients, file cleanup, repeated backward,
unused cases/parameters, drift in tiny spectra and FP32 normalized flux. Budget
tests reject output, host, GPU and file overcommit before any case executes.
GC-disabled lifetime checks verify that the previous native system is gone
before another case is admitted.

The large-grid driver uses a shared material design across several source
wavelengths and a nonseparable point-history objective:

```console
python -m benchmarks.budgeted_adjoint_batch --execute --size 512 --cases 8 --gpu-budget-gib 32 --host-budget-gib 64 --output results/batch-capacity.json
```

Add `--dispersive` for one-pole material derivatives. Without `--execute`, only
the plan is checked, using scalar-backed logical inputs. Executed runs compare
the complete coupled outputs, gradient crop, global gradient norm and material
VJPs to independent 40-cubed full-time Torch graphs containing the finite cone.
The driver permits only 10 to 12 time steps. A 64-cubed `--smoke` run validates
the driver but does not establish large-grid capacity. No result from this
command is claimed before its terminal record and source hashes are verified.

The [eight-case dielectric record](validation/adjoint-batch-8x512-dielectric-5880.json)
completed all forward and backward cases on RTX 5880 at revision `f47cae9`.
Each case uses 512-cubed real FP32 fields and twelve steps. Peak Torch CUDA
allocation was 15,884,919,296 bytes, against a 23,463,357,166-byte solver and
transfer reservation. Output relative L2 was zero and coupled epsilon-gradient
relative L2 was 3.08e-7. This is sequential replay with a shared material map,
not simultaneous eight-case execution or a measured speedup over retained graphs.

The matching ADE batch exposed a [cache-sensitive admission failure](CUDA_CACHE_ADMISSION.md).
That failed record remains separate. The corrected revision `45d9e5c` passed
fresh eight-case runs for [ADE](validation/adjoint-batch-8x512-ade-cache-recovery-5880.json)
and [dielectrics](validation/adjoint-batch-8x512-dielectric-cache-recovery-5880.json).
ADE reached 17,911,820,288 bytes of Torch CUDA allocation and a largest
material-gradient relative discrepancy of 1.22e-7. Both retain the same
512-cubed, twelve-step finite-cone validation scope.
