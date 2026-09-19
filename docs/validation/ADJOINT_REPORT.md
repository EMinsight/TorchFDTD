# Initial discrete adjoint and memory validation

Measured on 20 September 2026 using an NVIDIA RTX 5880 Ada, Windows and
PyTorch CUDA. These are native solver experiments. They do not use commercial
simulation data or establish a ranking against external FDTD solvers.

These measurements predate fused backward and asynchronous checkpoint staging.
The later [DRAM slab validation](STREAMED_REPORT.md) records spatial forward and
backward parity, final targeted tests and a warmed resident/streamed ablation.
Historical timings below do not describe the new runtime's current speed.

## Complete iteration measurements

The benchmark initializes the CUDA context, then times scene preparation,
forward observation, point-energy objective and backward. Each row is one
fresh-process run, without a warmed repetition protocol. Kernel compilation
cache and system conditions can affect time. These diagnostic times must not
be presented as a robust speed comparison between checkpoint policies or
against the reference. All rows use FP32.

| Method and raw record | Grid | Steps | Peak allocated MiB | Peak reserved MiB | Full wall s | Replayed steps |
|---|---|---:|---:|---:|---:|---:|
| [Full autograd](adjoint-reference-1000.json) | 24 × 24 × 1 | 1,000 | 12.3193 | 14.00 | 16.062 | 0 |
| [Discrete adjoint, device](adjoint-device-1000.json) | 24 × 24 × 1 | 1,000 | 0.2505 | 2.00 | 11.203 | 6,409 |
| [Discrete adjoint, device](adjoint-device-10000.json) | 24 × 24 × 1 | 10,000 | 0.4229 | 2.00 | 81.893 | 115,061 |
| [Discrete adjoint, hierarchical](adjoint-hierarchy-1000.json) | 24 × 24 × 1 | 1,000 | 0.1860 | 2.00 | 7.443 | 6,409 |
| [Discrete adjoint, device](adjoint-3d-128-device.json) | 128 × 128 × 128 | 200 | 540.1665 | 568.00 | 1.716 | 843 |

MiB = 1,048,576 bytes. Allocation/reservation are PyTorch allocator statistics,
not total board usage. They exclude CUDA context, driver, external CUDA
allocations, CPU RSS and filesystem cache. The baseline design tensor is
included. The benchmark objective is the sum of squared point signals, not a
normalized port objective. It stores two point histories and a prepared source.

At 1,000 steps the full tape allocates 12,917,760 bytes
versus 262,656 bytes for the four-device-checkpoint
adjoint, a 49.2-fold
reduction in this allocator metric on this tiny grid. This does not mean an
equivalent reduction in total GPU memory, nor does it extrapolate to large
geometry, many monitors or other physics. The 10,000-step run keeps four
physical checkpoint slots. Source, signal and signal-adjoint arrays still grow
with duration, and the replay count shows the compute cost of that choice.

The three-tier row uses two disk slots, one host slot and one device slot.
Transfers are synchronous and checkpoints are uncompressed. It is an exact
restart-placement check, not a demonstration of asynchronous overlap, sustained
NVMe bandwidth or spatial out-of-core execution. Its raw record confirms every
tier was used. The 128 cubed row has 2,097,152 cells and exercises a larger 3D
backward, but its whole physical state still fits in VRAM.

The full-autograd and device-adjoint 1,000-step cases both return loss
0.828026294708252 and gradient norm 1.06656050682068.
Matching norms alone do not prove gradient equality. Full-tensor tests below
provide that check. The full-autograd record predates the final admission and
checkpoint refinements. Its mathematical reference path is unchanged. Raw reports
retain the actual metadata produced by their runs.

## Gradient and restart checks

The focused suite checks CPU/CUDA, 2D/3D, scalar and diagonal epsilon, periodic
seams and CPML against the full-autograd derivative of the discrete update.
It also checks the existing native forward solver, E/H point timing, coincident
observations, a differentiable DFT and accumulation across separate runs.

Radius/centre directional tests show second-order Taylor residual decay across
three perturbations. Central differences also check nonuniform mesh metrics,
magnetic sources and both directions of a vector-polarized one-way plane.
The one-way source's injection neighborhood remains fixed at its homogeneous
background, and only the design region away from that neighborhood changes.
These checks validate the implemented discrete derivative. Physical
sharp-interface shape-gradient convergence remains a separate open gate.

Zero, one and four checkpoint schedules agree with full autograd. Device,
host and disk storage are compared. Mixed three-tier FP32/FP64 CUDA gradients
are bitwise equal to the corresponding device-only policy. Simulated partial
disk-write failure leaves no owned checkpoint file. Long-history admission is
rejected before native state allocation when the source/output budget cannot fit.

The full RTX 5880 Python suite before the final schedule refinement passed
654 tests with one optional skip in 213.21 s. After that refinement, the
focused suite passed **38 tests on each GPU**:
17.82 s on RTX 3060 and 14.20 s on RTX 5880. Two local browser checks passed in
7.3 s for priority filtering and existing material/Python-export controls.
This is not a new browser adjoint interface test.

## Torch optimizer example

The [eight-iteration record](differentiable-design-5880.json) runs the complete
regularized sphere radius → epsilon → FDTD → point-energy loss → Adam chain.
The first evaluated loss is 0.000997538329225621, and the eighth evaluated
loss is 0.000953251524228204. The decrease is
4.44% for this toy objective.
The final radius after the eighth update is
0.27338259235917 µm. That updated radius
has not been evaluated as an additional ninth loss. This record uses the final
checkpoint schedule.

This is not a fabricated design, transmission optimum or physical gradient
convergence study. Port-normalized devices, fabrication constraints and a
finer hard-geometry validation remain required.

## Measured transfer inputs

The [bounded hardware profile](memory-transfers-5880.json) uses a 64 MiB pinned
buffer and five CUDA-event-timed repetitions per direction. Median H2D is
24.26 GB/s and D2H is
26.24 GB/s. These directions
were measured separately. Copy/compute overlap was not measured. Host physical
capacity is 127.65 GiB.

The 256 MiB ordinary file probe includes fsync in its write and verifies a
warm-cache read. It does not establish sustained NVMe bandwidth or GDS support.
Its rates must not be inserted into a physical-NVMe throughput claim. Capacity
and available bytes are observations at profiling time, not reserved resources.

## Reproduction and limits

```console
python -m pytest tests/test_differentiable.py tests/test_memory_profile.py -q
python -m benchmarks.adjoint_memory --steps 1000 --reference --output results/reference.json
python -m benchmarks.adjoint_memory --steps 1000 --storage device --output results/device.json
python -m benchmarks.adjoint_memory --steps 10000 --storage device --output results/long.json
python -m benchmarks.adjoint_memory --steps 1000 --storage hierarchical --output results/tiers.json
python -m benchmarks.adjoint_memory --size 128 --dimension 3d --steps 200 --output results/three-d.json
python -m examples.differentiable_design --device cuda
python -m benchmarks.memory_transfers --output results/transfers.json
```

The [implementation contract](../DIFFERENTIABLE_FDTD.md) and
[next delivery gates](../HIERARCHICAL_EXECUTION.md) remain authoritative.
No all-physics differentiation, normalized inverse-design advantage, single-grid
multi-GPU, FP16 storage or VRAM-overflow spatial execution is claimed. The
normal scene size limit remains. The [source evidence](adjoint-source-evidence.json)
records hashes of the final implementation and checks, distinct from historical
benchmark metadata and the earlier full-autograd reference record.
