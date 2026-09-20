# Resident adjoints admitted by memory budget

Large grids that fit GPU memory should not be forced into slower spatial
streaming by the workbench's eight-million-cell guard. The experimental adjoint
API accepts `Region(memory_mode="budgeted")` with an explicit
`AdjointOptions.resident_budget_bytes`. The planner checks bytes and CUDA index
ranges before creating fields, packing ADE material arrays or copying CPU
design parameters to CUDA. The default workbench guard remains unchanged.

The newer [allocation-derived CUDA planner](RESIDENT_ALLOCATION_MODEL.md)
counts native field/adjoint owners and exact checkpoint states separately from
the conservative Torch workspace. It also reserves cold spectral library
workspace and explicit allocation headroom.

```python
from photonweave import (
    Region, Project, Source, Monitor, AdjointOptions, estimate_adjoint_memory,
)

project = Project(
    region=Region(
        dimension="3d", size=(25.6, 25.6, 25.6), mesh=0.1,
        steps=12, pml_cells=3, precision="float32", memory_mode="budgeted",
    ),
    sources=[Source()], monitors=[Monitor()],
)
options = AdjointOptions(checkpoints=0, resident_budget_bytes=16 * 1024**3)
plan = estimate_adjoint_memory(project, options, device="cuda")
print(project.region.shape, plan["gpu_reservation_bytes"])
```

Lengths use the native project unit, micrometres. This example plans a 256-cubed
grid without allocating its fields. Execution uses the same `options` with
`DifferentiableSimulation` or `DispersiveSimulation`, and rechecks live capacity.
Use nonzero checkpoint capacity for long durations where zero-checkpoint replay
would be expensive. Supported physics and observation restrictions still apply.

## Budget contract

On CPU, `resident_budget_bytes` limits the solver's host reservation, including
workspace and host checkpoints. On CUDA, it limits the device reservation.
The existing GPU, host-checkpoint and disk budgets also apply. Available RAM,
free CUDA memory and free disk capacity retain their independent admission
checks. CUDA one-way-source validation reserves its temporary CPU material copy.
Caller-owned inputs, geometry and optimizer graphs, CUDA context and OS file
cache are outside the estimate. The estimate is conservative, not an exclusive
resource reservation or a prediction of peak allocator usage.

The CUDA field check accounts for real or complex lanes in the signed 32-bit
field offsets. Full-history observation offsets are checked separately.
Online spectra use bounded observation seed blocks. An overflowing field index
is rejected with a spatial-streaming instruction even if the byte budget fits.
Native ADE pole and packed-parameter offsets already use 64-bit arithmetic.

The [unified selector](EXECUTION_SELECTION.md) gives generated resident
candidates the corresponding GPU or host byte budget. It can therefore consider
resident execution above eight million cells. Explicit custom candidates keep
their declared options. A custom resident candidate without the new budget
retains the old guard. Neither the caller's region mode nor its design tensors
are modified. This mode does not enable large grids in the ordinary GUI/NumPy
solver, and it does not imply that a grid exceeding VRAM fits resident execution.

## Completed large-index validation

The following RTX 3060 checks ran on 2026-09-20. Both use twelve FP32 time steps,
zero checkpoints and a source near the high-x PML at a large flattened index.
They compare the point observations, epsilon-gradient crop and global gradient
norm against a 40-cubed Torch full-autograd oracle. The ADE case additionally
compares scaled strength, resonance and damping derivatives. Nonzero CPML
states in the oracle confirm that the test excites the absorbing boundary.

| Grid | Cells | Material | Largest output/VJP relative L2 | Peak Torch CUDA bytes |
| --- | ---: | --- | ---: | ---: |
| 256 cubed | 16,777,216 | Nondispersive | 1.12e-7 | 1,188,079,104 |
| 208 cubed | 8,998,912 | One Lorentz pole | 1.78e-7 | 1,219,473,920 |

Raw records: [256-cubed dielectric](validation/budgeted-resident-256-3060.json)
and [208-cubed ADE](validation/budgeted-resident-ade-208-3060.json). Each records
the exact driver and runtime source hashes. Both exceed the workbench guard
and preserve the finite-cone oracle's full gradient norm.

A separate CR job was active on this workstation. The recorded elapsed times
are not speed-comparison evidence. These are short resident capacity/index and
first-order VJP checks, not beyond-VRAM demonstrations, long-time convergence
studies or validation of every large-grid physics combination. The separate
[54 GiB streamed ADE study](validation/DISPERSIVE_CAPACITY_REPORT.md) addresses
a different capacity question.

```console
python -m benchmarks.budgeted_resident --execute --size 256 --resident-gib 8 --output results/budgeted-resident.json
python -m benchmarks.budgeted_resident --execute --size 208 --resident-gib 8 --dispersive --output results/budgeted-resident-ade.json
```

Actual execution requires available device and host capacity. Without
`--execute`, the driver admits and records the plan only. A small `--smoke`
driver run cannot be reported as large-grid capacity evidence.

The byte-admission revision `d16579f` covered 190 passing tests across resident memory,
unified selection, streamed admission, point spectra, planes, native CUDA
adjoints and solver lifetime. The budget-specific suite then passed 17 tests,
including three added denials before field allocation, ADE packing or CUDA
input transfer. The groups overlap, giving 193 distinct passing tests.
