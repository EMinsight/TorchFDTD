# TorchFDTD 1.1.2 validation

## Patch validation scope

This patch uses checks selected for the changes since v1.1.1. The complete
WORKSTATION gate replay and `release-full` suite were not rerun to completion.
Historical gate records remain attached to the versions they tested.

The [installed-wheel regression run](validation/release112_fasttrack/result.json)
passed **417 tests**, with no failures, errors or skips among selected tests.
One legacy CUDA reconstruction test marked `long` was deselected.
The selected checks cover optional
fused E/H updates, one-pass field adjoints, launch tuning and fallbacks,
recorded observations, CPML reconstruction, memory admission, shared CUDA
defaults and benchmark output recovery. Tests ran from a separate working
directory. All 152 installed Python package files matched the wheel.

The [clean-install record](validation/clean_install/20260929T184509Z-bb3620f0.json)
passed CPU/CUDA execution, save/load, server/API, doctor and README examples.
G0-01 through G0-05 and G1-01 through G1-05 also completed on this wheel before
the remaining repeated gate runs were omitted. Unchanged application and
physics workflows were not rerun for this patch. Multi-GPU execution remains
unvalidated.

## Performance and accuracy

The [five-repeat comparison](validation/fused_cpml_112_380.json) used a
380 x 380 x 125 grid and 1,200 steps on an RTX 3060. Fused E/H with automatic
block sizing reduced median forward-plus-gradient time from 21.162 to 18.930 s
(10.5%) and forward-only time from 7.466 to 5.500 s (26.3%). All five paired
total times improved. Compared spectra and gradients were bitwise identical.
Defaults remain unchanged. These timings describe this single-tile fixture.

## Artifact

`torchfdtd-1.1.2-py3-none-any.whl`

SHA-256: `3b2ba5290469791de89957fe70f29d76cd9a65630bd536b07d828e2bd5671ce2`

The released wheel is the same file used for clean-install and scoped checks.
The GitHub release links the CI run for its exact final commit. CI retains the
normal Linux CPU and browser checks. The complete gate history is in the
[validation report](VALIDATION_REPORT.md).

## Regression modules

- `tests/test_benchmark_atomic_output.py`
- `tests/test_compatibility_policy.py`
- `tests/test_cr_optimization.py`
- `tests/test_cr_precision.py`
- `tests/test_cr_resume.py`
- `tests/test_cuda_adjoint.py`
- `tests/test_cuda_edge_fixtures.py`
- `tests/test_cuda_graph_steps.py`
- `tests/test_cuda_kernels.py`
- `tests/test_cuda_robustness.py`
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
