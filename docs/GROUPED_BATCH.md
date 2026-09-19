# Mixed-grid CUDA ensembles

`run_grouped_batch()` accepts interleaved projects with different meshes, durations, boundaries or real precisions. It groups exact compatible topologies, runs shared CUDA cohorts and returns results in the original input order. It never pads grids, resamples fields or changes requested time steps. The browser is not required.

```python
from photonweave import Project, plan_grouped_batch, run_grouped_batch

cases = [Project.load(path) for path in ('coarse.json', 'fine.json', 'coarse-2.json')]
for p in cases:
    p.region.backend = 'cuda'
plan = plan_grouped_batch(cases, cohort_size=4)  # No CUDA initialization.
print(plan['group_count'], plan['cohorts'])
report = run_grouped_batch(cases, cohort_size=4,
    objective=lambda r: float(abs(r.signals).max()),
    output_dir='results/new-mixed-ensemble', keep_results=False)
report.raise_for_errors()
for item in report.items:
    print(item.id, item.metrics)
    result = item.load()
```

The [standalone example](../examples/grouped_batch.py) creates all inputs itself. `BatchCase` preserves explicit IDs and parameter dictionaries. Plain `Project` inputs receive IDs according to their original indices.

## Scheduling and memory

The grouping key contains dimension, precision, number of time steps, CFL factor, reference spacing, actual time step and update coefficient, mesh representation, complete boundary parameters, resolved PML layer counts and every mesh node. Inherited default PML layers are resolved before grouping. Groups retain first-appearance order and cases retain order within each group. Different geometry, material assignments, sources and monitor definitions can share one topology. The underlying tensor executor verifies the same key again.

`cohort_size` is a maximum from 1 to 64, with default 4. The scheduler also splits cohorts according to the native memory estimate and `memory_fraction` of free CUDA memory, default 0.6. An individual case exceeding the allowance fails before execution. Each cohort rechecks admission immediately before allocating. Estimates exclude some context, graph and driver costs and do not guarantee allocation under competing GPU activity. No OOM retry or implicit autotuning is performed.

`plan_grouped_batch(cases, memory_limit_bytes=...)` can inspect estimated memory splitting without a GPU. Real execution recalculates its allowance on the selected device. `keep_results=False` with a new output directory avoids retaining every result in host memory. Results are stored in separate cohort subdirectories with a root plan and final report. Existing output directories are rejected. Resume is not supported by this API.

Groups execute successively on one selected GPU. Cases inside each cohort share CUDA E/H, source and monitor launches. This is independent-case scheduling, not MPI decomposition of a single simulation. There is no claim that this scheduling capability is unique among GPU frameworks.

## Semantics and limits

- Fixed-duration, real float32/64 native tensor cases are accepted, including supported rectilinear meshes, CPML, periodic boundaries, materials and sources. Complex Bloch fields, CPU cases and automatic decay termination are rejected. Use `BatchRunner` for these and for process fault isolation.
- Result items are returned in input order. Objectives execute in cohort order and should be pure functions of their result. Each failed objective marks its own item failed while other groups continue.
- Cancellation stops the current cohort and marks remaining cases cancelled without launching them. A pre-set cancellation event launches no cohort. Numerical or executor errors raise, leaving already saved files available.
- Progress reports include the cohort number, group and original input indices. Native `Result.summary` timing describes a whole cohort. Do not sum that repeated value over individual items.
- `report.seconds` includes planning, execution, objectives and file output. The plan separately records planning, summed cohort setup and synchronized stepping time. These intervals are not a mutually exclusive decomposition of all wall time.
- This API is available from Python. Existing tensor differential evolution still requires a common topology. Automatic grouped optimizer routing and GUI ensemble submission are future work. There is no adjoint or autodiff implementation.

## Reproduction

```sh
python -m pytest tests/test_grouped_batch.py tests/test_tensor_batch.py
python -m benchmarks.grouped_ensembles --repeats 3
python -m benchmarks.report_grouped_ensembles
```

The measurement uses vacuum, sphere, slab and waveguide families, interleaved across two mesh or duration conditions. Every row includes 16 complete solves with three six-component frequency planes. Native complete outputs must match independent native runs bitwise. The external flaport adapter receives the same source, voxel material and fused observation implementation. Its point trace and complex DFT gates are 1% relative L2, while final field differences are retained without claiming equivalence. Raw inputs, repeated timings, errors and source hashes accompany the [report](validation/GROUPED_ENSEMBLE_REPORT.md).
