# Bounded local replay checkpoints

RTX 5880 Ada, Torch 2.10.0, 2026-09-20. These measurements concern the native
DRAM-streamed discrete adjoint. They do not establish an external-solver speed
advantage or completion of the public-release requirements.

Each optional checkpoint contains the complete local E/H/CPML state. The
recursive local schedule reconstructs primal states before each transpose step.
Global block checkpoints remain in DRAM. The per-workspace local checkpoint
capacity is explicit, bounded and charged before allocation. Zero local slots
retain triangular replay and remain the default.

## Complete-iteration trade-off

Both FP64 cases use periodic x, CPML y/z, a point source, point observations,
two global block checkpoints and synchronous transfers. Each mode has one
warm-up and three timed full forward/backward iterations. Order alternates.
All modes pass signal and gradient agreement with the native resident adjoint
at signal rtol 1e-10/atol 1e-12 and gradient rtol 1e-9/atol 1e-11. These are
discrete-solver parity checks, not physical accuracy or convergence tests.

| Grid / steps / slab / K | Local slots | Median iteration (s) | Local replay steps across all tiles | Torch CUDA peak (MiB) |
| --- | ---: | ---: | ---: | ---: |
| 64 x 16 x 16 / 48 / 16 / 12 | resident | 0.060591 | n/a | 5.22 |
| 64 x 16 x 16 / 48 / 16 / 12 | 0 | 0.312895 | 1056 | 6.38 |
| 64 x 16 x 16 / 48 / 16 / 12 | 1 | 0.398731 | 496 | 7.44 |
| 64 x 16 x 16 / 48 / 16 / 12 | 2 | 0.381737 | 416 | 8.50 |
| 64 x 16 x 16 / 48 / 16 / 12 | 4 | 0.369976 | 320 | 10.63 |
| 128 x 32 x 32 / 64 / 32 / 32 | resident | 0.072846 | n/a | 35.28 |
| 128 x 32 x 32 / 64 / 32 / 32 | 0 | 0.591234 | 3968 | 56.69 |
| 128 x 32 x 32 / 64 / 32 / 32 | 1 | 0.395562 | 1168 | 65.13 |
| 128 x 32 x 32 / 64 / 32 / 32 | 2 | 0.400188 | 768 | 74.19 |
| 128 x 32 x 32 / 64 / 32 / 32 | 4 | 0.434860 | 584 | 92.31 |

K=32 with one local checkpoint was about 1.49 times faster than zero local
checkpoints in the measured full iteration. It remained slower than the native
resident solver. The smaller K=12 case regressed with every tested nonzero
checkpoint count. Fewer replay steps alone therefore do not establish a speedup.
Memory use also increases with the checkpoint count. Three samples do not give
a robust confidence interval or a cross-workload performance ranking.

For base depths of at least eight, the default policy search now also considers
one local checkpoint on its wide-tile candidates. The zero-slot policies remain
eligible. Explicit candidates can compare other local capacities. This is a
bounded measured search, not a proof of globally optimal scheduling. Short
probes that truncate the temporal block remain a cost-model limitation.

## Larger-grid propagation check

The 256 x 256 x 128 FP32 test runs 128 steps with CPML, a point source and point
observations. It uses one global and one local checkpoint, a 4 GiB GPU budget
and a 24 GiB host budget. Each row is a single complete cold iteration.

| Slab / K | Full iteration (s) | Torch CUDA peak (MiB) | GPU reservation (MiB) | Host reservation (GiB) |
| --- | ---: | ---: | ---: | ---: |
| 32 / 16 | 11.741025 | 598.41 | 1752.00 | 4.53 |
| 64 / 32 | 6.846298 | 1175.63 | 3504.00 | 6.24 |

Both policies produced finite nonzero signals and gradients. The gradient
relative L2 difference was 9.9546e-08. This extends
the earlier ten-step admission smoke test, but is still a comparison between
two streamed policies rather than an independent large-grid physics reference.
It exceeds the former scene cap, not the GPU's physical 48 GB memory capacity.

Torch peaks exclude CUDA context and allocator caching. Host reservations are
conservative admission estimates, not measured RSS. Geometry, optimizer and
objective allocations are caller-owned. Every row passed the declared GPU
reservation check.

## Reproduction

```sh
python -m benchmarks.streamed_adjoint --nx 64 --ny 16 --steps 48 --width 16 --depth 12 --repeats 3 --compare-local-checkpoints --output results/local-replay-5880.json
python -m benchmarks.streamed_adjoint --nx 128 --ny 32 --steps 64 --width 32 --depth 32 --repeats 3 --compare-local-checkpoints --output results/local-replay-deep-5880.json
python -m benchmarks.streamed_capacity --steps 128 --width 32 --depth 16 --local-checkpoints 1 --gpu-budget-mib 4096 --host-budget-gib 24 --output results/local-replay-capacity-5880.json
```

[Small-block measurements](local-replay-5880.json),
[deep-block measurements](local-replay-deep-5880.json),
[larger-grid measurements](local-replay-capacity-5880.json), and
[source hashes](local-replay-source-evidence.json) retain the evidence.
The [TeX methods supplement](../paper/hierarchical-adjoint-notes.tex) describes
the discrete transpose and the two replay levels. It is a development supplement,
not a completed novelty assessment or submission-ready manuscript.

Validation: the full local regression suite passed 744 tests with one skip.
The affected RTX 5880 tests passed 76 tests. The subsequently added deep-policy
search test passed together with the other two tuner tests on both devices.
Physical VRAM overflow, spatial NVMe backing, full-physics derivatives, CR
inverse design and the integrated UI remain open.
