# Differentiable Drude and Lorentz materials

`DispersiveSimulation` extends the resident checkpointed adjoint to coupled
trapezoidal ADE states. The inputs are epsilon-infinity, oscillator strength,
resonance angular frequency and damping rate. They can depend on Torch geometry
or design variables. `DispersivePlaneSimulation` adds fixed spectral E/H planes,
Poynting flux and the existing reference-normalized flux operation.

```python
import torch
from torchfdtd import DispersiveSimulation, AdjointOptions

# project has a fixed mesh, soft sources and point monitors.
model = DispersiveSimulation(project, AdjointOptions(checkpoints=4, storage="host"))
density = torch.sigmoid(logits)
epsilon_inf = 1.0 + density
strength = (density * 2e30)[None]       # leading pole axis
omega0 = torch.tensor([1.8e15], dtype=density.dtype, device=density.device)
gamma = torch.tensor([2e14], dtype=density.dtype, device=density.device)
result = model(epsilon_inf, strength, omega0, gamma)
loss = result.signals.square().mean()
loss.backward()
```

This point-field loss is a computational example, not normalized transmission.
Run `python -m examples.differentiable_dispersive_design --device cpu` for a
complete geometry-and-damping Adam example. Three tested iterations reduced
its point-spectrum loss from 9.31013e-5 to 9.26206e-5. This checks the optimizer
connection and does not establish a useful optical design.
For a project with field-plane monitors, call
`DispersivePlaneSimulation(project)(epsilon_inf, strength, omega0, gamma, frequency_hz)`.
It returns the same plane result type as `DifferentiablePlaneSimulation`.
Reference fields for normalized flux must obey its mesh, source, frequency and
sampling contract. Physical convergence and power conservation remain necessary.

All rates use radians per second. Strength uses radians squared per second
squared. A pole contributes `strength / (omega0**2 - omega**2 - 1j*gamma*omega)`
in the continuum material model. `omega0=0` selects Drude. These explicit tensor
inputs replace scene material assignments. Material objects are not converted
automatically. In particular, the `Material` Lorentz `linewidth_rad_s` field is
half its oscillator damping rate. `material.oscillators` supplies the actual
`(omega0, strength, gamma)` tuples used by the native engine.

Strength must have shape `(P,)`, `(P,Nx,Ny,Nz)` or `(P,Nx,Ny,Nz,3)`. Resonance
and damping additionally accept a shared scalar. All poles are diagonal in
the Yee components. Inputs must be finite, real and nonnegative, and
epsilon-infinity must satisfy the existing conservative `epsilon >= 1` contract.
The engine uses timestep-scaled coefficients to avoid squaring large physical
rates in FP32. Torch differentiates this parameter conversion and any preceding
geometry map. Only first-order solver derivatives are implemented.

The explicit transpose includes P and Q in every restart state and propagates
their adjoints through every replayed timestep. Device, host, file and mixed
checkpoint tiers use the existing bounded scheduler. Online point spectra
avoid a complete time-history output. Material P/Q state alone costs
`6*P*Ncells*field_item_bytes`. Parameter inputs retain their original compact
shapes. Shared pole rates are not copied into every cell and Yee component.
The local transpose sums shared-parameter derivatives before accumulation,
including a rate shared by all poles. Spatial parameters still retain their
full supplied maps. The packed parameter buffer has
`(epsilon_inf.numel() + strength.numel() + omega0.numel() + gamma.numel())`
real elements. Temporary field derivatives and P/Q states remain spatial.
User geometry graphs and other live solver calls have separate allocations.

For a 240-cell grid with scalar epsilon-infinity, two pole strengths, two
resonances and one shared damping rate, the FP64 packed parameter buffer now
uses 1,960 bytes instead of the former 40,320 bytes of fully expanded
parameters. This is a parameter-buffer comparison only, not the whole solver
peak. The Torch path omits the unused inverse-permittivity field. The fused
path uses a scalar placeholder for the shared curl generator.
Tests compare compact and explicitly expanded inputs for shared, spatial and
component-dependent poles under real and Bloch fields. Forward values and VJPs
agree within FP64 tolerances. Summation order can differ, so bitwise gradient
equality is not required. No reduced storage precision is used.

The default implementation uses Torch updates and an analytic discrete
transpose. CPU FP32/FP64, CPML, real/complex Bloch and diagonal material
gradients are covered by targeted tests. The material suite also passed on
RTX 3060 after its CR duration run finished. It covers CUDA FP32/FP64, real
and complex Bloch VJPs, plane-flux derivatives and asynchronous
device/host/file restoration of the P/Q state.
Optional resident fused CUDA forward/backward is also available. Sparse
material-state allocation remains pending. Experimental spatial out-of-core
ADE is described in [the streamed guide](STREAMED_DISPERSIVE.md).
Streamed plane options select the same material recurrence with spatial slabs.
Live TFSF, one-way sources, subpixel
interfaces, moving monitors and higher derivatives are also outside this API.

Validation checks the native Drude/Lorentz/multipole forward, a small full-time
autograd oracle for all material parameters, a joint parameter finite
difference, a geometry Taylor test, online spectra, normalized plane-flux
gradients, checkpoint restoration including P/Q and buffer lifetime without
cyclic garbage collection. These establish the tested discrete operation.
They do not establish sharp-interface shape-gradient convergence, large
dispersive-domain capacity or a competing-solver performance advantage.
The initial CPU regression run covering this implementation and the existing resident,
plane, Bloch, spectral and spatial-checkpoint paths passed 192 tests, with
59 CUDA-dependent tests skipped. The TeX supplement includes the recurrence
and transpose and compiles without an overfull-box warning.
After compact parameter storage was added, the same regression scope plus
broadcast-layout checks passed 201 tests with 59 CUDA-dependent skips.
A subsequent dedicated material suite passed all 32 CPU/CUDA tests, including
the extended GPU cases and pre-allocation rejection of an oversized oracle.
This does not establish CUDA throughput or large dispersive-domain capacity.

## Native CUDA material transpose

Set `project.region.cuda_kernel="fused"` for native ADE forward and
`AdjointOptions(backward_kernel="fused")` for native backward, then supply
CUDA parameter tensors. Both choices are independent. `auto` backward keeps
the Torch path. The implementation supports the same compact scalar, pole,
spatial and Yee-component parameter layouts as the Torch path, for real or
fixed-Bloch complex FP32/FP64 fields and one to 64 poles.

The forward kernel solves the coupled electric/ADE update per component and
updates P/Q directly. The magnetic Yee update follows electric source
injection. Backward re-evaluates pre-source E without modifying checkpointed
E/H, P/Q or CPML memories. It then applies the magnetic curl transpose, one
material-transpose kernel and the electric curl transpose. Spatial parameter
gradients have unique cell writers. Shared rates use fixed-order CUDA block
reductions, with one partial per shared parameter per 256-cell block. A final
Torch sum returns those derivatives to the compact input tensor. There are no
material-gradient atomics or dense pole-by-cell temporaries for shared rates.
The reduction allocation is reported as `material_gradient_reduction_bytes`.
Field states and their adjoints remain spatial, and the conservative memory
admission is unchanged.

Tests compare every material VJP with a full-time autograd oracle, including
the complete one-step state transpose with nonzero incoming P/Q and CPML
adjoints. They also check a 64-pole Drude limit, normalized plane flux, repeated
backward, geometry Taylor residuals, nondefault streams and asynchronous mixed
checkpoint tiers. The reference path remains independent of the native kernels.

Run the geometry-and-damping optimizer with
`python -m examples.differentiable_dispersive_design --device cuda --kernel fused`.
The [matched benchmark driver](../benchmarks/dispersive_adjoint_kernels.py)
separates Torch, fused-backward-only and fused-forward/backward modes. Its
measurements cover resident discrete problems and do not establish large-domain
optical convergence, streamed ADE support or an external-solver speed advantage.

The [RTX 5880 measurements](validation/DISPERSIVE_CUDA_REPORT.md) cover six
resident cases at 32 cubed, 64 cubed and 128 cubed. Matched fused forward and
backward reduce full wall by 4.30 to 16.15 times against our Torch CUDA path.
At 128 cubed and 128 steps, peak Torch allocation changes from 1.572 to
0.804 GiB for real FP32 and from 5.512 to 3.129 GiB for complex FP64. The
backward-only ablation gives a smaller full-wall gain because replay still
uses Torch forward. All timed repetitions pass signal and material-gradient
comparisons. The raw records retain exact source hashes and measurement scope.
