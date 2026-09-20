# Spatially streamed dispersive adjoint

`StreamedDispersiveSimulation` connects epsilon-infinity, oscillator strength,
resonance frequency and damping to first-order Torch gradients while keeping
global field banks in DRAM or explicitly configured file storage. CUDA receives
extended space-time slabs. The path includes E/H, CPML and Drude/Lorentz P/Q.
It uses the same coupled trapezoidal material recurrence as the
[resident implementation](DISPERSIVE_ADJOINT.md).

```python
from photonweave import (
    StreamedAdjointOptions, StreamedDispersiveSimulation,
    estimate_streamed_dispersive_memory,
)

options = StreamedAdjointOptions(
    device="cuda", slab_width=16, temporal_depth=4,
    checkpoints=2, local_checkpoints=1,
    tile_transfers="async", tile_buffers=2,
    gpu_budget_bytes=16 * 1024**3,
    host_budget_bytes=64 * 1024**3,
)
shapes = (project.region.shape, (1, *project.region.shape), (), ())
admission = estimate_streamed_dispersive_memory(project, shapes, options)
model = StreamedDispersiveSimulation(project, options)

# Inputs and their geometry graph reside on CPU. The spatial strength tensor
# has a leading pole dimension. Frequency is in rad/s, strength in (rad/s)^2.
result = model.spectrum(epsilon_inf, strength, omega0, gamma, frequency_hz)
loss = result.fields.abs().square().sum()
loss.backward()
optimizer.step()
```

Set `project.region.memory_mode="streamed"` when constructing a project above
the resident cell limit. Capacity admission is repeated before execution and
backward. The estimator accepts the four original parameter shapes without
allocating domain fields. It includes full material-gradient carriers and P/Q
banks. Caller-owned geometry graphs, optimizer storage and OS file cache are
outside its scope. Its conservative pole-dependent tile bound still needs
calibration against large dispersive runs.

To use file banks, set `state_storage="disk"`, `state_directory`, an explicit
`disk_budget_bytes`, and suitable `disk_free_reserve_bytes`. All banks are
transient scratch. Only files created by the store are removed after success
or failure. A file tier can increase capacity but is not a speed guarantee.

`DispersivePlaneSimulation(project, options)` accepts the same streamed options
and returns fixed E/H spectral planes, flux and reference-normalized flux with
material gradients. The point and plane paths accumulate spectra online.
CUDA tiles use fused ADE forward and transpose, with direct Torch/CUDA argument
views. CPU tiles use the explicit Torch recurrence. The `dlpack` binding option
is currently rejected for streamed ADE.

Run a geometry-and-damping Adam example with:

```bash
python -m examples.differentiable_dispersive_design --streamed --device cuda --kernel fused
```

Add `--state-directory <scratch-directory>` to exercise file banks. This small
point-spectrum example demonstrates graph connectivity, not device quality,
optical convergence or a capacity result.

## State ownership and transpose

Each temporal block reads an immutable initial bank. A slab owns its x interval
and reads a `K`-cell halo on both sides for `K` complete Yee steps.
ADE adds pointwise P/Q recurrence and therefore does not enlarge the spatial
dependency cone. The E backward difference followed by the H forward difference
has x support from `i-1` to `i+1`, so their radii do not add to two.
Only owned cells are written to the next global bank.

Global material states use `(Nx, P, Ny, Nz, 3)` so x-slab reads and writes remain
contiguous in the file tier. Native tile kernels use `(P, Tx, Ny, Nz, 3)`.
Packing converts this layout without loss of precision. A zero initial P/Q bank
uses scalar-backed views instead of allocating the global volume.

For fixed Bloch x boundaries, replicated E/H, transverse CPML and P/Q values
receive the winding phase. The transpose applies its conjugate before summing
halo copies into the global state adjoint. Material coefficients are periodic
real data and never receive this field phase.

Spatial material derivatives sum along the global x index. Scalar and pole
parameters sum contributions from every tile after each tile's own spatial
reduction. Original scalar, pole, spatial and component shapes are preserved.
Global block checkpoints and local tile checkpoints use the existing bounded
binomial replay schedule. E/H, P/Q and CPML all participate in restart and
endpoint seeding. No time-axis autograd graph is retained.

CUDA scratch for the material numerator, pre-source electric recomputation,
P/Q adjoints and shared-parameter partials is reused per transfer slot. The
tile workspace reports these high-water buffers alongside payload, restart,
local checkpoint and output pools. There is no whole-domain GPU field bank.

## Verification and remaining work

`tests/test_streamed_dispersive.py` compares the complete block Jacobian with a
resident full-time autograd oracle. Random nonzero P/Q, CPML, endpoint seeds and
signal seeds exercise all state derivatives. Cases include real and fixed Bloch
fields, repeated periodic windings, 2D/3D, compact and spatial material inputs,
scalar and diagonal epsilon, both precisions, spectral planes, repeated backward,
file cleanup and CPU/CUDA staging. A separate allocation test doubles the x
domain at fixed tile size and checks that GPU allocation stays bounded and is
released with cyclic garbage collection disabled.

These discrete tests are necessary before large runs. They do not establish
dispersive state beyond 48 GiB, a speed advantage, physical mesh convergence or
an inverse-designed device. The completed 54 GiB capacity measurement in
`BEYOND_VRAM_VALIDATION.md` is for the earlier **nondispersive** path. ADE capacity
and sustained I/O measurements remain separate follow-up work.

`benchmarks/beyond_vram_dispersive.py` prepares that capacity experiment with
one pole and a default 1024 by 768 by 384 complex FP64 grid. E/H occupy 27 GiB
and P/Q another 27 GiB, before CPML. Its finite-cone reference uses a smaller
resident Torch solve with the same source alignment. It compares point signals,
the local epsilon gradient, the global epsilon-gradient norm and three shared
material derivatives. The default budget leaves 100 GiB of disk space and
16 GiB of available RAM outside the configured reservations. Install the
`benchmark` and `cuda-kernels` extras before running it. A completed record with
`driver_smoke=false` and actual state exceeding physical VRAM is required for
capacity evidence. A `--smoke` result only validates the driver and uses reduced
headroom floors of 8 GiB disk and 4 GiB RAM. Those reduced floors are never used
by a capacity-evidence run.

Soft sources, fixed boundaries and fixed observations are supported. TFSF,
one-way dispersive sources, moving boundaries/monitors, coupled subpixel
material tensors, sparse pole-state allocation and higher-order derivatives
remain unsupported. The [material-aware tuner](STREAMED_POLICY.md) compares
admitted ADE tile and checkpoint policies with bounded reference memory and
separate material VJP checks. It calibrates point histories or point spectra.
Full-duration policy quality on large dispersive domains remains unverified.
