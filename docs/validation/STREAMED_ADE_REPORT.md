# Streamed ADE discrete validation

The implementation connects the coupled Drude/Lorentz recurrence and its
material transpose to bounded spatial slabs. Global E/H, CPML and P/Q banks
use DRAM or file storage. Native CUDA tile scratch is reused, and material
parameters keep their original scalar, pole, spatial or component shapes.
The [API and limits](../STREAMED_DISPERSIVE.md) describe its experimental scope.

Local RTX 3060 verification on 2026-09-20:

| Scope | Result |
| --- | --- |
| Streamed ADE, resident native ADE, lifetime and tile workspace regression | 100 passed |
| Nondispersive slabs, complex slabs, resident ADE, admission, tuning and bank bounds with CUDA disabled | 123 passed, 33 CUDA-dependent skips |
| Final streamed ADE suite after reusable host material packing | 37 passed |
| Three Adam steps through geometry and damping with CPU/file execution | Completed, finite nonzero gradients |
| Same optimizer with fused CUDA and asynchronous file-backed slabs | Completed, matching loss and parameter sequence |
| TeX build, two passes | Completed, no overfull-box warning |

These scopes overlap. Counts describe test executions, not unique features or
a completion percentage. An independent CR run was active on the workstation,
so these runs are correctness evidence rather than timing benchmarks.

The complete block tests seed nonzero E/H, P/Q and CPML states and endpoint
adjoints, then compare every state VJP and material derivative to a resident
full-time autograd oracle. They include 2D/3D, repeated Bloch windings and
shared/spatial/component material layouts. Other cases cover FP32/FP64,
spectral plane flux, directional finite differences, repeated backward,
file cleanup on injected failure and release without cyclic garbage collection.
Doubling the x domain with fixed CUDA tile dimensions satisfies the GPU
allocation bound in the tested small cases.

The optimizer's point-spectrum objective changes from
`9.31012734571188e-5` to `9.26206193749126e-5` over three evaluated iterates.
This verifies graph connectivity and optimizer updates. It is not a useful
optical-device design result.

The [capacity-driver smoke record](streamed-ade-smoke-3060.json) uses
64 by 64 by 64 cells, complex FP64, one pole and ten steps. Its signals match
the finite-cone resident Torch oracle to `8.68e-19` maximum absolute error.
The epsilon-gradient crop differs by at most `1.36e-20`. Shared strength,
resonance and damping derivatives also pass the recorded tolerances.
The record includes exact hashes for the benchmark and package Python files.
It explicitly marks `driver_smoke=true` and `physical_vram_exceeded=false`.
It does **not** establish beyond-VRAM dispersive capacity.

The separate full capacity driver defaults to a 54 GiB combined E/H/P/Q state.
Its non-smoke execution, large-run memory reservation calibration, sustained
I/O behavior and physically converged dispersive applications remain follow-up
work. Nondispersive large-run results must not be relabeled as ADE results.
