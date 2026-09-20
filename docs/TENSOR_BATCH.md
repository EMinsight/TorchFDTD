# Fused CUDA batches from Python

`run_tensor_batch` evaluates independent structures in a shared CUDA launch. It returns the existing `BatchReport`, `BatchItem` and `Result` objects. The browser is not required. Install the CUDA kernel extra and a CUDA-enabled PyTorch build first.

```python
from torchfdtd import Project, parameter_sweep, run_tensor_batch

base = Project.load('sphere.json')
base.region.backend = 'cuda'
base.region.run_control.auto_shutoff = False
cases = parameter_sweep(base, {'structures.0.radius': [0.35, 0.40, 0.45, 0.50]})
report = run_tensor_batch(
    cases, device=0, cohort_size=4,
    objective=lambda result: float(abs(result.signals).max()),
    output_dir='results/new-tensor-sweep', keep_results=False,
)
report.raise_for_errors()
for item in report.items:
    print(item.id, item.metrics)
    fields = item.load()  # Native Result, restored from NPZ when not retained.
```

The executable [example](../examples/tensor_batch.py) constructs its own projects. `objective` receives the full native result, including plane frequency fields. A scalar or nonempty dictionary of finite scalars is accepted. `optimize(execution='tensor', cohort_size=4)` evaluates entire differential-evolution populations through this path. Process execution remains the default. Both paths are forward-only and have no adjoint.

## Supported scope

- Real float32/float64, 2D and 3D, periodic and face-specific CPML boundaries.
- Uniform, graded and explicit rectilinear grids, including independent dx/dy/dz, with matching node coordinates and actual time steps within each cohort. Freeze a common mesh before changing geometry if automatic refinement would change nodes. [Controls and matched-dt measurements](RECTILINEAR_MESH.md).
- Different geometry, passive multipole material parameters, source positions/amplitudes and point/plane monitors between cases. Electric/magnetic Cartesian and theta/phi sources are supported, including [normal-incidence one-way planes](ONEWAY_SOURCES.md) with paired E/H corrections. Source supports on the same field family and component within one case must not overlap. Collocated E and H sources are allowed. See [source definitions](DIPOLE_SOURCES.md).
- Native snapshots, full final E/H, point time traces, spectra, planar six-component DFT/flux and NPZ results.
- [Closed normal-incidence TFSF boxes](TFSF_SOURCES.md) use independent live incident lines per case, with shared line/face CUDA launches. Overlapping TFSF boxes are serialized within each case and may coexist with soft sources. The soft-source overlap restriction above does not apply to TFSF face corrections.
- Fixed-duration steps, optional divergence checks, one selected CUDA device, graph or eager execution.

Precision, dimension, shape, node coordinates, timestep, step count and boundary topology must match within a cohort. Complex Bloch fields and per-case automatic decay termination are explicitly rejected. Material correction still runs per case. Set `region.cuda_monitor_kernel="fused"` to share frequency-plane interpolation and DFT accumulation across cases. The default monitor path remains Torch. [Algorithm, selection and measured spectral ensembles](CUDA_SPECTRA.md).

Each CUDA E or H launch uses `blockIdx.y` to select a case and a device pointer table to access its independent arrays. The existing Yee/CPML kernel generator supplies the stencil body. Source injection and point recording also share launches. Electric sources follow the E update and magnetic sources follow the H update at their half-step sample time. This is not a Python loop that calls independent `Simulation.run` instances, and it is not multi-GPU domain decomposition.

## Choosing cohort size

For interleaved projects with different topologies, use [`plan_grouped_batch` and `run_grouped_batch`](GROUPED_BATCH.md). They group exact compatible nodes, boundaries, precisions and durations before shared CUDA execution and restore input result order. No padding or resampling is introduced. `run_tensor_batch` remains the direct API for already compatible cohorts.

Omit `cohort_size` to run the supplied 1–64 cases in one cohort. Set it to an integer from 1 to 64 to split a larger list into consecutive cohorts. The final partial cohort is allowed. The solve does not tune implicitly. Use the explicit measurement API below when useful. Smaller cohorts reduce resident device state, but extra setup and transfers can offset the benefit.

On the measured RTX 5880, 32³ × 16 is 2.40 times faster than native sequential full wall time. At 64³, one 16-case cohort regresses. Four cohorts of four recover a modest 1.10 times improvement against the sequential baseline in the follow-up experiment. These choices are measurements for these inputs, not defaults guaranteed optimal on other GPUs. All sizes and the regressions are in the [README tables](../README.md#measured-cuda-comparisons).

`memory_fraction` limits estimated cohort memory against currently free device memory, by default 60%. This is an admission estimate, not an allocation guarantee. It excludes interference from other applications. `keep_results=True` retains full results in host RAM even when device cohorts are small. Save to `output_dir` with `keep_results=False` to avoid retaining all host arrays.

## Measure a cohort size explicitly

```python
from torchfdtd import tune_tensor_batch, run_tensor_batch, optimize

tuning = tune_tensor_batch(cases, candidates=(1, 2, 4, 8, 16), repeats=3)
print(tuning.cohort_size, tuning.seconds)  # Selected size and complete tuning cost.
tuning.save('results/new-cohort-profile.json')
report = run_tensor_batch(cases, cohort_size=tuning.cohort_size)

design = optimize(base, {'structures.0.radius': (0.25, 0.75)},
                  lambda r: float(abs(r.signals).max()),
                  execution='tensor', cohort_size=tuning.cohort_size,
                  population=16, generations=3, seed=73, maximize=True)
```

The [complete example](../examples/tuned_inverse_design.py) constructs its own scene. Tuning runs each candidate once for warmup and then for the requested measured repetitions in alternating order. It uses the complete supplied ensemble and original duration, including construction, graph preparation and result transfer. It does not call user objectives or save simulation results. Final E/H, traces, snapshots, permittivity and frequency-plane arrays must be bitwise identical across candidates. A failed physics check aborts selection. Sizes rejected by memory admission remain visible in the report.

The winner has the lowest measured median for that workload. This is empirical selection, not an optimality guarantee. Measurements can be noisy and another size can win on a later run. All trial samples, peak Torch allocations, workload hash and device information are retained. `tuning.seconds` includes warmups and output verification as well as trials. Tuning is costly for a single small sweep and is never invoked implicitly. Reuse a chosen integer across similar optimizer generations, then remeasure if grid, material, monitor or hardware costs change. Objectives, disk saves and unrelated GPU work can change the preferred size. The tuner resets the device's peak-memory statistics.

Tensor design supports `device`, `memory_fraction`, `cuda_graph` and `cuda_graph_steps` options. Unlike process execution, objectives may be local Python functions. It rejects resume, a supplied process runner, complex fields and auto shutoff. Geometry proposals must preserve common cohort topology. It is still black-box differential evolution, not gradient-based topology optimization.

`cuda_graph_steps=8` optionally unrolls eight unchanged steps per graph launch. It is supported by single simulations, tensor batches, cohort tuning and tensor design. The default is one. Tuning reports record this option, and the selected cohort should be reused with the same graph setting. Snapshots, diagnostics and progress callbacks remain exact barriers. Cancellation is polled between replays. Extra capture cost and memory can make this slower. See [algorithm and measured limitations](CUDA_SPECTRA.md#optional-multi-step-graph-replay).

## Results, failure and timing

`report.seconds` measures the entire call including result construction, objectives and saves. `plan.loop_seconds` sums synchronized stepping intervals across cohorts. Each result's `summary.seconds` and `summary.setup_seconds` describe its whole cohort, explicitly marked `timing_scope='whole_cohort'`. Do not sum those duplicated per-result cohort times.

An invalid objective marks that item failed. Numerical errors abort the cohort and raise with the failing case ID. Cancellation stops the current cohort and marks later cases cancelled without starting them. There is no independent per-case stopping or process fault isolation. Progress includes `step`, `total`, `cohort_offset` and `total_cases`.

Output saves per-case NPZ and `tensor-batch.json`. Existing result paths are rejected. Tensor batches do not support checksum resume. Use `BatchRunner` for resume, incompatible grids, complex fields, automatic termination, heterogeneous resources or separate-process failure isolation.

## Verification

```sh
python -m pytest tests/test_tensor_batch.py
python -m benchmarks.tensor_batch_validation
python -m benchmarks.cohort_validation
python -m benchmarks.ensemble_comparison
python -m benchmarks.design_throughput
```

Regression checks compare full fields, point traces, snapshots, NPZ recovery and graded dispersive planar DFT with independent native runs. Both precisions, dimensions, graph/eager execution, cancellation, splitting, incompatible-input rejection and objective failure are covered. Performance records use native fixtures without commercial solver data.
