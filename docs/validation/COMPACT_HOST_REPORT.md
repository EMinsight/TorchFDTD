# Compact host initialization and larger streamed grids

RTX 5880 Ada, Torch 2.10.0, 2026-09-20. This report measures explicit tensor
storage and execution within declared budgets. It does not establish peak
process RSS, a commercial-solver comparison or public-release readiness.

## Removed persistent host allocations

Streamed execution no longer builds a full host inverse-permittivity array.
Each tile constructs its own coefficients. Its all-zero initial E/H/CPML bank
uses scalar-backed views read by tile extraction. In-place advancement of this
storage-only host template is rejected. Evolved global states and adjoints
remain dense in DRAM, and no field update is omitted. One-way validation uses
a broadcast background ownership view instead of a dense integer volume.

The 256 x 256 x 128 FP32 constructor comparison measures only initial state
and inverse-permittivity tensor storage. It excludes epsilon, sources, mesh
metadata, later state banks and allocator overhead.

| Host template | Logical initial state (bytes) | Initial state storage (bytes) | Inverse-permittivity storage (bytes) |
| --- | ---: | ---: | ---: |
| Dense | 211812352 | 211812352 | 100663296 |
| Streamed | 211812352 | 104 | 0 |

This removes 312,475,544 persistent tensor bytes,
approximately 298.00 MiB. Admission releases
one full initial bank and adds back its scalar storage, reducing the host
reservation by 211,812,248 bytes, approximately
202.00 MiB. Remaining conservative workspace
headroom is retained. Constructor timings in the raw record are single cold
observations and are not a preparation-throughput comparison.

## Complete forward/backward capacity checks

Both tests use FP32, CPML, a continuous point source, two point observations,
one global checkpoint and one local checkpoint. Every row is a single cold
complete first-order iteration. Each pair compares different slab/block
policies for the same problem. Signals and gradients must be finite, nonzero
and agree at rtol 5e-5 and atol 2e-6.

| Grid | Steps | Slab / K | Complete iteration (s) | Torch CUDA peak (GiB) | GPU reservation (GiB) | Host reservation (GiB) |
| --- | ---: | --- | ---: | ---: | ---: | ---: |
| 256 x 256 x 128 | 128 | 32 / 16 | 10.083255 | 0.584 | 1.711 | 4.328 |
| 256 x 256 x 128 | 128 | 64 / 32 | 5.675160 | 1.148 | 3.422 | 6.039 |
| 512 x 512 x 512 | 16 | 16 / 2 | 66.879634 | 1.192 | 3.422 | 44.125 |
| 512 x 512 x 512 | 16 | 32 / 4 | 29.274550 | 2.311 | 6.844 | 47.547 |

The 8,388,608-cell pair has gradient relative L2 difference 9.9546e-08.

The 134,217,728-cell pair has gradient relative L2 difference 3.55114e-08.

The 8,388,608-cell test uses declared GPU/host budgets of 4/24 GiB. The
134,217,728-cell test uses 8/64 GiB. Admission is checked with a metadata-only
epsilon tensor before the benchmark allocates its actual design tensor.
Both policies pass their GPU-reservation check. Caller-owned design and
reference gradients are outside solver admission.

The 512-cubed test increases demonstrated cell count, but only propagates for
16 steps. Most cells are not reached by its point-source wavefront. This is a
capacity and discrete-policy-parity check, not an independent optical-accuracy,
long-time stability, mesh-convergence or inverse-design demonstration. Evolved
arrays and updates remain dense despite the localized wavefront. The test does
not exceed the RTX 5880's physical 48 GB VRAM. It demonstrates execution within
the smaller declared budget, not a measured resident-solver OOM.

Torch peaks exclude CUDA context and allocator caching. Host numbers are
reservations, not measured RSS. No speedup is inferred by comparing these cold
rows with earlier runs on different dates or under different load.

## Validation and reproduction

The local full regression suite passed 755 tests with one skip. A final check
of the scalar reservation passed eight admission tests. The RTX 5880 run passed
101 affected tests covering the resident adjoint, compact host state, random
CPML and endpoint adjoints, diagonal/scalar epsilon, periodic replication,
nonuniform and one-way sources, async workspaces and geometry gradients.

```sh
python -m benchmarks.streamed_host_storage --output results/host-storage-5880.json
python -m benchmarks.streamed_capacity --steps 128 --width 32 --depth 16 --local-checkpoints 1 --gpu-budget-mib 4096 --host-budget-gib 24 --output results/compact-host-capacity-5880.json
python -m benchmarks.streamed_capacity --nx 512 --ny 512 --nz 512 --steps 16 --width 16 --depth 2 --local-checkpoints 1 --gpu-budget-mib 8192 --host-budget-gib 64 --output results/compact-host-large-5880.json
```

[Storage measurements](host-storage-5880.json),
[128-step measurements](compact-host-capacity-5880.json),
[512-cubed measurements](compact-host-large-5880.json) and
[source hashes](compact-host-source-evidence.json) preserve the scope.
Spatial NVMe backing, physical VRAM overflow, full-physics derivatives, CR
validation and integrated UI controls remain unfinished.
