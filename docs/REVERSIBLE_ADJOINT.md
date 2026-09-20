# Experimental periodic reversible adjoint

`ReversibleSimulation` is an explicit alternative to the checkpointed
`DifferentiableSimulation`. It stores one owned terminal E/H pair and recovers
earlier fields while applying the existing discrete transpose. A backward
performs exactly T inverse steps and T transpose steps, with no checkpoint
replay. Ordinary checkpointed execution remains unchanged.

This implementation supports uniform 3D, real FP32, scalar nondispersive
permittivity, staircase Yee sampling, all-periodic boundaries, fixed impressed
electric point sources and point E/H histories. It supports first material
derivatives, including at source cells. Source increments do not depend on
permittivity. Use an explicit design mask when those cells must remain fixed.
CPML, Bloch phase, tensor/ADE materials, walls, spatial streaming, plane sources,
online spectral accumulation and source-parameter derivatives are excluded.
Unsupported configurations raise an error without silently changing strategy.

## Python use

```python
import torch
from torchfdtd import ReversibleOptions, ReversibleSimulation
from torchfdtd.models import Project, Region, Source, Monitor

device = 'cuda' if torch.cuda.is_available() else 'cpu'
region = Region(
    dimension='3d', size=(3.2, 3.2, 3.2), mesh=.1, steps=512,
    material_sampling='yee', courant_factor=.9,
    boundaries={a + '_' + side: {'kind': 'periodic'}
                for a in 'xyz' for side in ('min', 'max')},
)
project = Project(
    region=region,
    sources=[Source(component='Ey', center=(-1, 0, 0), wavelength=.6)],
    monitors=[Monitor(component='Ey', center=(1, 0, 0))],
)
sim = ReversibleSimulation(project, ReversibleOptions(
    resident_budget_bytes=512 * 1024**2,
    host_budget_bytes=512 * 1024**2,
))
plan = sim.plan(device=device)             # No fields or source waveforms.
mask = torch.zeros(region.shape, device=device)
mask[14:18, :, :] = 1
contrast = torch.tensor(1.25, device=device, requires_grad=True)
result = sim(1 + contrast * mask)
loss = -result.signals.square().mean()
loss.backward()
print(contrast.grad, result.report['last_backward'])
```

Coordinates use the existing micrometre convention. CUDA requires the optional
`cuda-kernels` dependency. The CUDA forward, inverse and local transpose use
native kernels. CPU uses explicit Torch operations without a time-unrolled
autograd graph. Postprocessing `result.spectrum(...)` remains differentiable
through the stored histories. It does not provide online spectral storage.

## Reconstruction and accuracy

Forward updates E, adds the electric source, then updates H. Backward undoes H
first using the still-sourced new E, subtracts electric source increments in
reverse insertion order, then undoes E using recovered old H. The material VJP
uses that reconstructed old H. Simply applying a negative Courant number to
the normal forward update order would be incorrect.

FP32 reversibility is approximate. Every 64 forward steps and at the terminal
step, bounded reductions sample the field norm and peak. Backward reports the
absolute reconstructed initial-state residual and ratios to those sampled
forward scales. The default tolerance is 1e-3 and may be tightened. Exceeding it
raises before returning a gradient. It never triggers an unbudgeted fallback.
The sampled scale is not the maximum over all timesteps. This residual is a
drift alarm, not a mathematical bound on objective-gradient error. Long runs,
strong contrast and cancellation-sensitive objectives still require comparison
with checkpointing and physical convergence checks.

The saved terminal pair remains immutable. Each retained backward restores a
separate live working pair, so distinct noncontiguous seeds work correctly.
Concurrent backwards on one result are rejected. Input mutation receives the
normal autograd version-check error. Higher-order derivatives are rejected.

## Memory and lifetime

Field-state storage is O(cells), with no O(steps times cells) archive. Source and
point-observation histories remain O(steps times sources/monitors). The plan
includes the live E/H pair, terminal pair, adjoints, inverse coefficients,
gradient, output and seed histories, observer indices, source preparation and
bounded diagnostic scratch. FP64 is used only for reductions of at most 65,536
scalars at a time. Dynamic fields and gradients stay FP32.

The planner deliberately retains conservative workspace allowances from the
resident planner. Terminal bytes are named separately and checkpoint bytes are
zero. Total host and active-device budgets are checked before field allocation.
Caller epsilon is retained by autograd and reported separately from additional
solver allocations. Torch peaks do not include every driver, compiler, CUDA
context or dependency allocation and do not establish a process-memory cap.

CuPy 13.6 can retain an optional-dependency import exception whose traceback
includes the importing caller. Initialization now occurs on a dedicated
zero-argument thread before real resident solver buffers are created. This
keeps such dependency frames outside the workload stack without changing
dependency internals. A fresh CUDA subprocess reproducing the missing optional
test dependency verifies caller tensors, original E/H and the solver are freed.
An earlier external CuPy import cannot be retroactively repaired by this helper.

## Validation scope

- CPU 80/512-step tests compare full material gradients, duplicate E/H
  observations, two retained noncontiguous seeds and a source-cell finite
  difference. Mutation, failed drift, concurrent backward and admission checks
  cover the failure paths.
- Native CUDA 12-cubed/96-step and 64-cubed/512-step cases have bitwise-equal
  histories to checkpointed native CUDA. Full-gradient relative L2 errors are
  4.09e-7 and 4.91e-7. Noncontiguous-seed errors are 5.50e-7 and 8.05e-7.
- The respective incremental Torch allocated peaks are 254,464 and 25,191,424
  bytes, below reservations of 8,718,186 and 45,789,706 bytes. Caller allocations
  present before the operation are excluded from these incremental peaks.
- Both CUDA cases release the system, grid, original fields and terminal pair
  after graph release without requiring cyclic collection.

Source hashes and the targeted result are recorded in
[the validation record](validation/reversible_native_workflow.json).
These are restricted implementation checks. They do not establish general
FDTDX parity, throughput superiority, long-time accuracy or beyond-VRAM capacity.
Boundary-recorded reversible differentiation has prior art, including FDTDX.
The separate CPML reconstruction prototype is not part of this public API.
