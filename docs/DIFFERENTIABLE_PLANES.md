# Differentiable spectral detector planes

`DifferentiablePlaneSimulation` connects real nondispersive Yee/CPML fields to
collocated E/H spectra, signed Poynting quadrature and matched-reference power
ratios. It uses the bounded online spectral adjoint and supports resident,
streamed DRAM and streamed file-backed execution. It is a Python API. UI
inverse-design integration and the CR reconstruction objective remain pending.

```python
import torch
from torchfdtd import (
    Project, Region, Source, FieldMonitor, AdjointOptions,
    DifferentiablePlaneSimulation,
)

project = Project(
    region=Region(size=(2.4, 2.0, 1), mesh=.1, pml_cells=3,
                  steps=80, precision='float64'),
    sources=[Source(center=(-.6, 0, 0), pulse='continuous')],
    monitors=[FieldMonitor(id='detector', center=(.45, 0, 0),
                           normal='x', size=(0, .8, 1))],
)
model = DifferentiablePlaneSimulation(project, AdjointOptions(checkpoints=4))
epsilon = torch.full(project.region.shape, 1.7, dtype=torch.float64,
                     device='cuda', requires_grad=True)
planes = model(epsilon, [2.0e14, 2.2e14])
detector = planes['detector']
loss = -detector.flux().mean()
loss.backward()
```

This code differentiates a raw signed flux objective. A physical transmission
ratio requires a matched incident reference, sufficient propagation duration
and numerical convergence. A finite detector aperture can redistribute power,
so its reference ratio is not automatically a whole-device efficiency.

## Data and conventions

Each enabled project monitor must be a `FieldMonitor`. The returned mapping
uses its ID. Each result contains complex `fields` with axes `(frequency,
flattened quadrature point, component)` and components `(Ex,Ey,Ez,Hx,Hy,Hz)`.
All six components are computed even if the monitor's display selection hides
some of them. `shape` records the three quadrature axes. `points_um` gives their
physical coordinates, and `weights` gives SI surface quadrature weights.

Planes use `exp(+2 pi i f t)`, matching the native `FrequencyPlane` forward
monitor. The point-only `model.spectrum` API uses a negative exponential.
Complex fields from those conventions must not be mixed without conjugation.
E and H retain their own half-step times before spatial collocation.
`field_units` and `flux_units` explicitly describe the reduced field units.
For the usual 2D transverse detector, flux is per invariant length.

`poynting(normal=...)` gives signed density and `flux()` integrates the positive
coordinate normal selected by the monitor. This sign is preserved. Reflected
power travelling toward the negative normal has negative flux.

The call's frequency argument explicitly defines one common frequency set for
all planes. Stored frequency-sampling settings do not choose this argument.
Temporal downsampling must be one and apodization must be disabled. Mixed field
and DFT precision is rejected. Plane positions, mesh, quadrature and frequencies
are fixed, while epsilon and preceding Torch geometry operations differentiate.
Rebuild the model after changing its fixed project configuration.
[Fixed complex Bloch fields](BLOCH_ADJOINT.md) are supported in resident and
streamed execution. [Dispersive planes](DISPERSIVE_ADJOINT.md) provide ADE
material gradients through `DispersivePlaneSimulation`.
[Unified policy selection](EXECUTION_SELECTION.md#fixed-detection-planes)
handles both physics families with CPU design and result tensors. Live TFSF,
coupled subpixel and higher-order derivatives remain unsupported.

## Normalization

`normalized_flux` rescales both fields and quadrature weights before their
products. The common detached scales cancel from the ratio and preserve
derivatives of both the sample and reference. This avoids FP32 underflow and
overflowing backward seeds when spectral fields carry seconds and areas
carry square metres. Raw `flux()` retains its documented SI-scaled units.

Run the same model with a reference permittivity, usually under `torch.no_grad()`
when the incident reference is fixed. Then call:

```python
ratio = detector.normalized_flux(reference_planes['detector'])
signed_reflection = reflection.normalized_flux(
    reference_planes['reflection'], subtract_incident=True,
)
```

Incident subtraction subtracts complex E/H fields before forming power. Mesh,
sources, duration, normal, frequencies, points, weights, device and precision
must match. The denominator is the absolute reference flux. Frequencies with
zero, nonfinite or relatively weak reference power raise an error. Select a
well-supported frequency band instead of optimizing NaN or ill-conditioned
ratios. Normalization remains differentiable through either input when requested.
It is not directional mode decomposition or mode-port normalization.

## Storage and validation

Yee support samples shared between planes are deduplicated. Interpolation uses
the existing trilinear maps, real periodic and complex Bloch seams, nonuniform Yee coordinates and
clipped physical-cell quadrature. Torch transposes the interpolation and the
power objective, then the solver seeds its discrete field adjoint. The global
time history is not retained. Resident GPU and streamed admission charge the support-sample spectra,
collocated outputs, map copies and conservative interpolation/VJP workspace.
`spectral_output_bytes` describes the internal support spectra, while
`plane_output_bytes` describes the collocated six-component output.
Model-construction Python metadata and OS cache are not whole-process RSS caps.
The resident CPU path inherits the existing checkpoint-budget checks and does
not enforce a combined CPU workspace cap. Use explicit streamed host budgets
when host workspace admission is required.

Pass `StreamedAdjointOptions` to select the same DRAM/file policies described in
[the streamed guide](STREAMED_FDTD.md). `block_size` controls resident spectral
buffering. Streamed execution uses its `temporal_depth`. Large detector planes
still need performance work on sampling and CUDA observation injection.

[Recorded checks](validation/PLANE_ADJOINT_REPORT.md) include native complex-field
parity, full-autograd and finite-difference derivatives, and a dielectric slab
compared with Fresnel transmission and energy conservation. They do not establish
shape convergence, arbitrary dispersive devices or the CR information objective.
