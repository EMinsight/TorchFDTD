# Fixed Bloch phases in the discrete adjoint

The resident `DifferentiableSimulation` and `DifferentiablePlaneSimulation`
accept fixed Bloch boundaries with complex fields and **real nondispersive**
scalar or diagonal epsilon. Geometry and epsilon differentiate. Bloch phase,
source parameters, mesh and monitor positions remain fixed.
Each resident call snapshots its project for replay, so configuring a later
ray or wavelength cannot modify an earlier result's backward calculation.

The boundary convention is `F(r + L) = exp(+i*phase) F(r)`. The forward and
backward Yee differences use their distinct seam factors. The adjoint uses
conjugate seam factors and the real part of the complex field/material product
for real epsilon gradients. CPML memories are complex and included in replay.
Dropping imaginary fields or transposing the phase without conjugation would
give an incorrect derivative.

```python
project.region.boundaries.x_min.kind = 'bloch'
project.region.boundaries.x_max.kind = 'bloch'
project.region.bloch_phase = (0.5, 0, 0)
model = DifferentiableSimulation(project, AdjointOptions(checkpoints=4))
result = model.spectrum(epsilon, [2.0e14])
loss = result.fields.abs().square().sum()
loss.backward()
```

Use a real loss or an explicit complex output seed. Epsilon remains FP32/FP64,
with complex64/complex128 physical states. CPU uses Torch updates. Resident
CUDA adjoints optionally select fused complex Yee/CPML forward updates with
`project.region.cuda_kernel='fused'`. The default remains Torch. Both forward
choices can use the discrete Torch transpose or the optional fused complex
transpose selected by `AdjointOptions(backward_kernel='fused')`. The default
`'auto'` retains the Torch complex transpose. Execution reports
name the actual forward and backward backends. This opt-in applies to the
resident differentiable APIs. The native `Simulation` fused kernel remains
real-only. See [complex CUDA validation](COMPLEX_CUDA.md).

Point histories, bounded online point spectra and collocated spectral planes
are supported. Point spectra use a negative Fourier exponential and plane
spectra use the native positive convention. Plane interpolation retains the
complex periodic-seam weights. Preserve that convention when comparing fields.

Physical checkpoints can use device, host, disk or the existing hierarchical
policy. Optional asynchronous checkpoint staging preserves complex arrays.
Resident workspace estimates conservatively account for complex state storage.
Complex **spatial** streaming is rejected, including when an existing streamed
project is mutated. Checkpoint offload is not spatial domain decomposition.
The CPU workspace cap limitation of the resident API remains unchanged.

Prepared soft plane sources include the fundamental Bloch spatial phase at
their component's sample positions. Normal-incidence one-way sources retain
their zero-transverse-phase restriction. General oblique one-way sources,
trainable source/phase derivatives, ADE and complex spatial streaming remain
pending. A fixed selected-frequency Bloch calculation is not automatically a
broadband constant-angle illumination.

For a selected frequency in a background of index n, a transverse phase is
`2*pi*n*L*sin(theta)/wavelength` in consistent length units. A frequency sweep
with a fixed physical angle generally needs the corresponding phase and index
for each frequency. Full pupil reproduction also requires matched polarization
and incident-power conventions, not only setting this phase.

[Validation](validation/BLOCH_ADJOINT_REPORT.md) includes full-autograd comparisons,
native forward parity, complex checkpoint replay, nonuniform and two-phase 3D
checks, finite differences and a normalized oblique TE slab. It does not prove
full-pupil CR equivalence, a mode-port model or physical shape convergence.
