# Periodic observation preparation ablation

Profiling the prepared periodic response found repeated mesh-count derivation
inside dense observation setup. Each observation queried `Region.shape` twice.
The solver now derives the shape once per setup and reuses its strides. No
field update, observation ordering, interpolation weight, memory policy or
arithmetic precision changes. No persistent cache or domain-sized array is added.

The [ablation driver](../../benchmarks/periodic_observation_setup.py) temporarily
substitutes the preceding setup method and restores it on exit. Both variants
otherwise use exactly the same solver. The synthetic periodic structure has
a 40 x 40 x 84 grid, 50 nm spacing, fixed oblique Bloch phase, FP64 density and
complex-FP64 fields. Two calibrated source bases feed the complete coupled
two-polarization response and its squared-response density objective. Each
detector plane uses 24 x 24 quadrature points. This is not the private CR seed.

| Steps | Repeated shape queries, s | Reused shape, s | Full-call speedup |
| --- | ---: | ---: | ---: |
| 128 | 2.0004 | 1.3154 | 1.521x |
| 1,600 | 18.5272 | 17.8533 | 1.038x |

These RTX 3060 medians use four host Torch threads, one warmup per variant and
three alternating/reversed repetitions. Timing includes the complete warm
response, objective, density VJP, internal solver construction, checkpoint
replay and host/device result transfers. Outer module construction, fixed
reference warmup, input allocation, verification and cleanup are excluded.
Every repetition gives bitwise-identical responses and density gradients.

The absolute median saving is approximately 0.68 s at either duration.
The relative gain shrinks as time stepping dominates. This removes a measured
host preparation cost, without establishing a similar speedup for every grid,
duration, device or complete optimization. It is unrelated to the separate
beyond-VRAM capacity study and establishes no optical convergence or external
solver advantage.

The [raw record](periodic-observation-setup-3060.json) contains every repetition,
memory peak and 77 verified driver/runtime source hashes. Reproduce with:

```console
python -m benchmarks.periodic_observation_setup --output results/observation-setup.json
```

The existing `test_differentiable.py`, `test_adjoint_planes.py`,
`test_periodic_adjoint.py` and `test_cuda_dispersive_adjoint.py` regression group
passed all 92 tests in 199.63 s. It covers CPU/CUDA point and plane derivatives,
resident/DRAM/file periodic responses and CUDA dispersive adjoints. The ablation
above separately checks exact full-response and density-VJP preservation.
