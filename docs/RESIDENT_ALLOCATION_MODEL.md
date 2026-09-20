# Allocation-derived resident CUDA admission

The fused CUDA forward and transpose operate on reusable arrays. Reserving the
generic Torch tensor-expression bound for those kernels can reject grids that
fit device memory. The resident planner now distinguishes the two operator
families and reports its named allocation components before field creation.
All CPU and partially fused/Torch combinations retain the conservative tensor
workspace bound. Checkpoint and staging slots use the actual restart size in
both families.

This refines admission. It does not compress fields, change the Yee equations,
reduce the number of physical time steps or establish a faster CUDA kernel.

## Native array inventory

Let N be the cell count, P the pole count, C the number of CPML scalars in one
physical restart, and f/r the field/real scalar sizes. Complex fields have
f = 2r. The following terms describe simultaneously owned native arrays.

| Array group | Reserved bytes |
| --- | ---: |
| Primal and adjoint E/H | 12 N f |
| Primal and adjoint P/Q, when dispersive | 12 P N f |
| Primal CPML plus two adjoint CPML banks | 3 C f |
| Dielectric inverse coefficients, contiguous epsilon and gradient, without ADE | 9 N r |
| ADE numerator adjoint and recomputed electric field | 6 N f |
| ADE shared-parameter reduction upper bound | 3 P ceil(N / 256) r |
| Replay/conversion allowance | One complete restart state |

The dielectric estimate permits diagonal and noncontiguous input. ADE packing
and its normalization graph have a separate four-carrier reservation based on
the original parameter shapes. Shared pole parameters are not expanded into
full spatial coefficient arrays. The reduction bound allows every material
parameter to have one shared scalar per pole.

The restart size is R = (6N + 6PN + C) f. Each device checkpoint and asynchronous
device staging slot reserves exactly R. This replaces the earlier bound that
treated CPML as twelve full-volume arrays per saved state. Host and file tiers
retain their explicit limits, including staging and archive overhead.

Boundary coefficient arrays, persistent Bloch source profiles, the largest
source-injection support and observation gathers are counted separately.
Profile admission derives support from geometry without constructing a profile
or waveform. Multiple prepared polarizations and multiple sources retain their
own profile reservations.

The sum of workspace, checkpoints, staging, histories, parameter packing,
indices and spectral library workspace receives an additional five-percent
allowance plus 8 MiB in the fully fused CUDA path. This is operational headroom
for setup and allocation granularity, not a platform-independent upper-bound
proof. CUDA context, caller-owned geometry/objective/optimizer graphs and
unrelated processes are outside this estimate. Current available-memory checks
still apply and admission is repeated at execution.

Real fused backward now reserves an additional bounded observation packet
and host grouping workspace. [Dense-observer details](DENSE_ADJOINT_OBSERVERS.md)
describe its deterministic duplicate accumulation and integration checks.

## Cold spectral library workspace

Point spectra and detector planes use Torch matrix products. Their first use
can allocate library workspace in addition to the field and observer tensors.
The planner reserves separate cuBLAS and cuBLASLt pools for the calling and
autograd threads. It accounts for the selected device and configured
`CUBLAS_WORKSPACE_CONFIG` and `CUBLASLT_WORKSPACE_SIZE`, retaining the larger
of the configured and default sizes. It does not create a handle or perform
a warm-up to make a candidate fit. Unknown devices use the larger default.
The defaults and configuration units are based on the
[PyTorch 2.10 implementation](https://github.com/pytorch/pytorch/blob/v2.10.0/aten/src/ATen/cuda/CublasHandlePool.cpp).

An explicitly shared cuBLAS/Lt pool does not reduce this conservative estimate.
Existing warm library caches are also not subtracted. CUDA library versions,
different execution threads/streams or future Torch implementations require
fresh validation. This is a single-invocation admission contract, not a shared
budget for concurrent optimization jobs.

## Executed checks and scope

Both large-index cases below ran twelve FP32 steps with two device checkpoints
and a 4 GiB resident budget on RTX 3060. They compare the near-PML signals and
first-order gradients against the complete finite-cone Torch autograd oracle.
The prior conservative reservation rejected this budget even with zero
checkpoints. The updated source admits the two-checkpoint runs.

| Case | Reservation, bytes | Peak Torch CUDA allocation, bytes | Largest output/VJP relative L2 |
| --- | ---: | ---: | ---: |
| 256 cubed, dielectric | 2,855,588,105 | 2,024,842,752 | 1.12e-7 |
| 208 cubed, one Lorentz pole | 2,719,927,954 | 2,104,136,192 | 1.78e-7 |

[Dielectric record](validation/resident-allocations-256-3060.json) and
[ADE record](validation/resident-allocations-ade-208-3060.json) retain exact source
hashes and all comparison groups. The measured peaks include the benchmark's
design tensor and objective. A separate CR job was active. These records are
capacity/allocation checks and do not provide solver speed ratios.

Metadata-only checks additionally admit a real FP32 512-cubed dielectric grid
with two checkpoints and a one-pole grid with zero checkpoints under a 32 GiB
solver budget and mocked 48 GiB free capacity. They reject the same budget
with the explicit Torch transpose. This planning result is not evidence that
the 512-cubed jobs have executed. Subsequent RTX 5880 execution completed
both cases, with results recorded below.

| RTX 5880 case | Reservation, bytes | Peak Torch CUDA bytes | Largest relative L2 |
| --- | ---: | ---: | ---: |
| 512 cubed dielectric, two checkpoints | 22,389,615,266 | 15,884,920,320 | 1.12e-7 |
| 512 cubed ADE, zero checkpoints | 26,210,101,973 | 17,911,821,824 | 1.80e-7 |

The [dielectric](validation/resident-allocations-512-dielectric-5880.json) and
[ADE](validation/resident-allocations-512-ade-5880.json) records both report
`forward_backward_validated` and `driver_smoke=false`. All 73 driver/runtime
hashes match revision `5e396ff`. These are twelve-step, near-PML finite-cone
checks on 134,217,728 cells. They establish executed large-index capacity and
discrete gradients, not long-time convergence or speed superiority.

CUDA regression covers real and complex FP32/FP64, scalar/spatial/diagonal
materials, noncontiguous inputs, nonuniform CPML profiles, device checkpoints,
asynchronous host and mixed device/host/file tiers. It measures allocator peaks
through backward and compares VJPs to full-time Torch autograd. Separate cold
point-spectrum and detector-plane checks include the library allocation.
Large-grid long-time physical convergence remains a separate requirement.

The local regression groups passed 148, 48, 111 and 8 tests. They overlap,
giving 208 distinct passing cases. The final 111-case group includes the cold
library-pool correction and all three spectral/plane allocation checks. The
separate eight-case policy-driver group also passes with the new reservation.
