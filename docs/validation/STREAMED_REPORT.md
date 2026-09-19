# DRAM slab adjoint development validation

Date: 20 September 2026. This report describes a prototype, not the completed
large-domain runtime or a benchmark against an external solver.

This is the baseline from revision `7ea5cb4`. See the later
[reusable/asynchronous runtime and policy measurements](TILE_RUNTIME_REPORT.md)
for the subsequent implementation. The baseline rows below remain unchanged.

The full Python suite passed on both local RTX 3060 and RTX 5880 with 685 passes
and one skip. Those full runs preceded the final tile-payload packing and host
availability admission changes. The final spatial regression file separately
covers those changes and both FP32/FP64: 25 tests passed on RTX 3060 in 18.42 s
and on RTX 5880 in 14.76 s. UI code did not change in this milestone.

## Matched native measurement

The RTX 5880 Ada experiment uses a 64 x 16 x 16 grid, 24 steps, FP64, real x
periodicity, CPML on other axes, fixed sources, two point signals, and the sum
of squared signals as the differentiable objective. Streamed execution uses
width eight, temporal depth three and two block checkpoints. The resident
baseline uses two device checkpoints. One warm-up per mode precedes three
alternating-order measured iterations. Timings include epsilon creation,
preparation, forward, replay and backward.

| Native execution | Median complete iteration | Peak Torch CUDA allocation |
| --- | ---: | ---: |
| Resident | 0.0350538 s | 5,467,648 bytes |
| DRAM streamed, packed synchronous transfers | 1.1760348 s | 1,742,336 bytes |

Gradient relative L2 is 4.75923e-16. Signal and elementwise gradient checks pass
the benchmark's predeclared tolerances. Streamed execution uses about 3.14 times
less peak device allocation in this example but takes 33.55 times as long. The
short, small grid exposes launch, preparation, transfer and replay overhead.
This is evidence of the capacity/time trade-off, not a speed advantage. The
allocation counter excludes CUDA context, non-Torch allocations and reserved
allocator pools. No peak process DRAM measurement is claimed here.

The separate memory-scaling test doubles the global x cell count with fixed
tile width and depth. Incremental Torch CUDA allocation must remain within 5%
plus 4096 bytes, and allocations must be released after backward. This guards
against retaining one GPU state per tile. It does not demonstrate a model larger
than the physical 48GB board capacity.

## Reproduction

```sh
python -m pytest tests/test_spacetime.py -q --tb=short
python -m benchmarks.streamed_adjoint --nx 64 --steps 24 --repeats 3 --output results/streamed-packed-5880.json
```

The [raw record](streamed-adjoint-5880.json) contains every measured iteration.
[Source hashes](streamed-source-evidence.json) identify the implementation and
tests. See the [API contract](../STREAMED_FDTD.md) for the manual policy,
conservative admission, fixed scene-size cap and missing asynchronous tile
pipeline. A hardware-aware automatic policy and CR validation remain pending.
