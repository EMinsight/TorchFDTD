# Native resident dispersive CUDA comparison

RTX 5880 Ada, two poles (Drude and Lorentz), three device checkpoints. Each mode has one warmup and three timed repetitions, with rotating mode order. Real FP32 uses CPML on all faces. Complex FP64 uses a fixed x-Bloch phase and transverse CPML. Every repetition checks both signals and all material gradients against the Torch result.

Full wall includes parameter packing, forward, objective, checkpoint replay, backward and the final shared-gradient reduction. Model creation, input allocation and final CPU copies are excluded. The final JSON contains exact package and benchmark source hashes. No other numerical GPU job ran during these measurements.

| Grid / steps | Fields | Torch CUDA (s) | Fused backward only (s) | Fused forward + backward (s) | Torch / fused | Peak Torch CUDA GiB, Torch / fused | Raw record |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| 32^3 / 64 | Real FP32 | 1.3021 | 1.0595 | 0.0806 | 16.15x | 0.026 / 0.014 | [JSON](fused-ade-5880-32-fp32.json) |
| 32^3 / 64 | Complex FP64 | 1.4252 | 1.0477 | 0.0905 | 15.75x | 0.092 / 0.054 | [JSON](fused-ade-5880-32-complex-fp64.json) |
| 64^3 / 64 | Real FP32 | 1.4026 | 1.0892 | 0.1033 | 13.58x | 0.204 / 0.106 | [JSON](fused-ade-5880-64-fp32.json) |
| 64^3 / 64 | Complex FP64 | 1.2523 | 0.9500 | 0.2637 | 4.75x | 0.700 / 0.401 | [JSON](fused-ade-5880-64-complex-fp64.json) |
| 128^3 / 128 | Real FP32 | 4.2505 | 3.3296 | 0.5307 | 8.01x | 1.572 / 0.804 | [JSON](fused-ade-5880-128-fp32.json) |
| 128^3 / 128 | Complex FP64 | 19.9781 | 15.5960 | 4.6447 | 4.30x | 5.512 / 3.129 | [JSON](fused-ade-5880-128-complex-fp64.json) |

Fused-backward-only improves full wall by 1.23 to 1.36 times in these cases. Accelerating forward also accelerates checkpoint replay, which explains why the combined path has a larger effect. Small grids include substantial launch overhead. The results do not predict asymptotic throughput or an arbitrary dispersive design.

These are internal ablations against our Torch CUDA implementation. They are not CPU speedups, external-solver rankings, converged optical simulations, complete optimization timings or beyond-VRAM ADE results. Peak bytes cover the Torch allocator and exclude CUDA context and other allocators. Each raw record retains timing variability and parity tolerances.

The RTX 5880 regression suite passed 161 checks across ADE, real/complex Yee/CPML, subpixel/cohort execution, checkpoint lifetime and spatial streaming. An extended native ADE suite then passed 29 checks, including fully spatial parameters with no shared reduction buffer and the 64-pole limit in both precisions. A three-step fused geometry/damping Adam example reduced its point-spectrum loss from 9.310127e-5 to 9.262062e-5. This checks the optimizer connection, not useful device improvement.

```console
python -m benchmarks.dispersive_adjoint_kernels --size 128 --steps 128 --repeats 3 --precision float64 --complex-bloch --output results/ade-kernels.json
```
