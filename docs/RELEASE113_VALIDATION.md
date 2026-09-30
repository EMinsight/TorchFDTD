# TorchFDTD 1.1.3 validation

## Patch validation scope

This patch uses changed-scope validation for fixed host observation tables,
recorded plane spectra and their adjoints, common observation gathers,
PMC fallbacks, memory admission and version metadata. The [installed-wheel run](validation/release113_fasttrack/result.json)
passed **528 tests**, with no failures, errors or skips.
All 152 installed Python files matched the wheel.
The [clean-install check](validation/clean_install/20260930T172039Z-c1570ab2.json)
passed CPU/CUDA execution, save/load, server/API, doctor and README examples.
Tests ran from a working directory outside the source checkout.

The complete WORKSTATION gate replay, `release-full` suite and unchanged
application benchmarks are outside this patch run. Historical gate records
remain attached to the sources they tested. Multi-GPU execution remains
unvalidated.

## Performance and accuracy

The [three-repeat comparison](validation/observation_table_cache.json) used
224 x 224 x 32 cells, 32 steps, two dense field planes, three frequencies and
1,204,224 observations on an RTX 3060. Median forward-plus-gradient time was
5.432 s with table reuse disabled and 0.813 s with reuse enabled, an 85.0%
reduction. Forward-only time was 2.015 s and 0.656 s, a 67.5% reduction.
All compared spectra and material gradients were bitwise identical.

These are warmed repeated solves on the same model. Model construction and
warm-up are excluded. This improvement comes from host index preparation
and does not measure a faster time-step kernel. The benefit depends on the
observation count, time-step count and host. Reused host tables retain the
exact observation order. Each solve creates its own CUDA maps and bindings.

## Artifact

`torchfdtd-1.1.3-py3-none-any.whl`

SHA-256: `a455411071bce53030a4584bc32e843fb18252817d37bc12922475221f079262`

The release uses the same file tested by clean-install and scoped checks.
The GitHub release links the CI run for its exact final commit.

## Regression modules

- `tests/test_adjoint_memory.py`
- `tests/test_benchmark_atomic_output.py`
- `tests/test_clean_install.py`
- `tests/test_compatibility_policy.py`
- `tests/test_cr_optimization.py`
- `tests/test_cr_precision.py`
- `tests/test_cr_resume.py`
- `tests/test_cuda_adjoint.py`
- `tests/test_cuda_edge_fixtures.py`
- `tests/test_cuda_graph_steps.py`
- `tests/test_cuda_kernels.py`
- `tests/test_cuda_robustness.py`
- `tests/test_differentiable.py`
- `tests/test_observation_cache.py`
- `tests/test_pmc_cpml.py`
- `tests/test_pmc_general.py`
- `tests/test_recorded_adjoint_batch.py`
- `tests/test_recorded_cpml_dispatch.py`
- `tests/test_recorded_execution.py`
- `tests/test_recorded_periodic_response.py`
- `tests/test_recorded_policy_workflow.py`
- `tests/test_reversible_cpml.py`
- `tests/test_reversible_cpml_async_cuda.py`
- `tests/test_reversible_cpml_complex_kernels.py`
- `tests/test_reversible_cpml_cuda.py`
- `tests/test_reversible_cpml_extended.py`
- `tests/test_reversible_cpml_fast_paths.py`
- `tests/test_reversible_cpml_fused_updates.py`
- `tests/test_reversible_cpml_interval.py`
- `tests/test_reversible_cpml_kernel_fusion.py`
- `tests/test_reversible_cpml_kernels.py`
- `tests/test_reversible_cpml_memory.py`
- `tests/test_reversible_cpml_planes.py`
- `tests/test_reversible_cpml_planes_cuda.py`
- `tests/test_reversible_cuda.py`
- `tests/test_streamed_policy_benchmark.py`
