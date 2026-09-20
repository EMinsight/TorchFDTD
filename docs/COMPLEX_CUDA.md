# Fused complex forward updates

The resident differentiable APIs support an optional CUDA kernel for
complex64/complex128 E/H and CPML states with real scalar or diagonal
permittivity. Set `project.region.cuda_kernel='fused'`, or pass
`forward_kernel='fused'` to `periodic_layer_response`. The default complex path
remains Torch. The option affects forward and checkpoint replay updates.
Backward defaults to the Torch explicit transpose. An optional
[fused complex transpose](COMPLEX_CUDA_ADJOINT.md) is now separately selectable.

Each CUDA thread updates one real or imaginary lane of one cell. The two
lanes read adjacent complex storage, while CPML and material coefficients stay
real. Internal Yee differences and CPML recurrences are fused into the same
kernel. Bloch seams multiply the appropriate neighboring complex field by the
forward phase or its reciprocal. Source injection remains between separately
ordered H and E launches. NVRTC compilation retains subnormals and disables
fused multiply-add, matching the existing real-kernel arithmetic policy.

The implementation uses Torch-owned arrays and CuPy zero-copy views. It creates
no full-volume derivative or curl temporary during the fused update. This does
not remove checkpoint, observation or backward workspace. The existing
conservative admission estimate remains in force.

Tests compare all E/H and CPML states after randomized initialization on
uniform and nonuniform grids in both precisions. Three-dimensional tests cover
two nonzero Bloch phases, including a negative phase, real-epsilon VJPs and
asynchronous disk-checkpoint replay. Fifty relevant local tests passed, covering
existing real adjoints and complex Torch paths as well as the new kernel.
No remote validation is claimed while the full CR run occupies that GPU.

`benchmarks.complex_layer_kernel` compares the complete selected-layer forward
API, including two homogeneous references, two sample solves, preparation,
polarization calibration and allocation. It excludes one warmup per backend
and alternates backend order across measured repetitions. The benchmark checks
responses against the same Torch calculation. It is not an equal-accuracy
comparison against another solver and does not include backward.

Native `Simulation` fused execution, ADE/subpixel-interface updates, complex spatial streaming are outside this forward implementation. The fused
complex transpose is documented and validated separately.
The current full-pupil CR run started before this option and continues using
the original Torch path.

## Selected CR layer measurement on RTX 3060

The locked relaxed CR seed at 540 nm and one pupil ray was measured at 50 nm,
1600 steps and FP64. Three alternating measurements followed one warmup per
backend. Both paths included the same two homogeneous and two sample solves.

| Complete forward API | Median seconds | Peak Torch CUDA bytes |
|---|---:|---:|
| Torch complex updates | 31.4499 | 143,787,520 |
| Fused complex updates | 8.3904 | 88,134,144 |

The measured speedup is 3.7483x. The final response difference is 5.55e-17.
This measures one ray and wavelength with fixed coarse numerical settings.
It does not establish converged optical accuracy, full-pupil runtime,
backward speedup or superiority over a competing solver. See the
[raw repetitions](validation/cr-complex-forward-3060.json).

The actual relaxed seed also reproduces objective 0.2843927415139927 and
its recorded directional derivative 0.21922469270490433 when fused forward
and replay are combined with the Torch transpose. This complete call took
52.00 seconds and peaked at 413,641,728 Torch CUDA bytes. It is a single
functional validation, not a repeated backward timing comparison. See the
[gradient record](validation/cr-complex-forward-gradient.json).
Eighteen additional existing real CUDA forward/adjoint tests passed after the
shared kernel initialization change, bringing the relevant local total to 68.
