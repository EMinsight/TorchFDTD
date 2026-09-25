# Trainable source waveforms

`SourceWaveformSimulation` connects fixed spatial source terms to trainable
temporal increments and dielectric material parameters. It uses the resident
Yee/CPML checkpoint adjoint, with an optional fused CUDA transpose. It does not
retain an autograd graph for every field at every timestep.

```python
import torch
from torchfdtd import SourceWaveformSimulation, AdjointOptions, gaussian_waveform

# project supplies fixed geometry, mesh, soft sources and point monitors.
model = SourceWaveformSimulation(project, AdjointOptions(checkpoints=4))
epsilon = epsilon.to(device="cuda", dtype=torch.float32).requires_grad_()
times = model.source_times(device="cuda")
amplitudes = torch.nn.Parameter(torch.full((len(model.term_layout),), 0.02,
                                           device="cuda"))
waveforms = torch.stack([
    gaussian_waveform(times[:, i], frequency_hz=5e14, sigma_s=2e-15,
                      delay_s=8e-15, amplitude=amplitudes[i])
    for i in range(len(model.term_layout))
], dim=1)
result = model(epsilon, waveforms)
loss = result.signals.square().mean()
loss.backward()  # epsilon.grad and amplitudes.grad
```

The [executable example](../examples/differentiable_sources.py) optimizes electric
and magnetic pulse amplitude/phase together with an interior material parameter.
It is a small API demonstration, not a converged photonic device design.

## Input and output contract

`waveforms` has shape `(project.region.steps, prepared_terms)`. Columns follow
enabled source order, then the native polarization-component order. Use
`term_layout` for source ID, component, ordinal, fixed polarization weight and
native time offset. `default_waveforms(device=...)` reproduces the native temporal
increments, including polarization weights. A custom column is already the
**actual additive increment** for that component. Its spatial profile is applied
once. Multiply by a polarization weight yourself only if your own parameterization
needs that convention.

`source_times(device=...)` returns one clock column per prepared term, preserving
the native source time offsets. Magnetic monitor DFT sampling is a separate
half-step convention. Do not add another magnetic source half-step to these clocks.

Both inputs must share a device and real precision. Real fields require real
waveforms. Fixed Bloch/complex fields also accept complex waveforms and return
PyTorch complex cotangents. Noncontiguous inputs are accepted. Replay uses owned
packed values, so editing caller inputs after forward cannot change that replay.
Rebuild the simulation after changing its fixed Project configuration.

- `model(epsilon, waveforms)` returns point histories.
- `model.spectrum(epsilon, waveforms, frequency_hz, block_size=32)` accumulates
  point spectra online with fixed frequencies and an optional fixed window.
- `SourceWaveformPlaneSimulation(project, options)(epsilon, waveforms,
  frequency_hz, block_size=32)` returns the existing collocated six-field plane
  results. All enabled monitors must be compatible field planes.
- Plane reference normalization includes the actual waveform identity and rejects
  references with a different excitation. It remains a fixed-source reference
  contract, not differentiation through source-dependent normalization settings.

`gaussian_waveform` is a pure Torch parameterization with differentiable amplitude,
phase, carrier frequency, delay and envelope width. It preserves the sample clock's
device/precision. The real convention is a Gaussian envelope times a sine. The
analytic convention is an envelope times `exp(1j * phase)`. Width is the amplitude
standard deviation in seconds. This helper is not an assertion that every native
pulse definition uses the same envelope convention.

## Memory and derivative scope

The input waveform table and its gradient scale with timesteps times source terms,
not timesteps times grid cells. E/H and CPML state use bounded checkpoint replay.
Packing, source tables and execution are admitted before large allocations.
The waveform cotangent is accumulated into one temporal row at a time. The fused
path places the magnetic source reduction before the H-update transpose and the
electric source reduction before the E-update transpose, after observation seeds.

This API supports first-order derivatives of resident scalar/diagonal nondispersive
epsilon and ordinary soft point/plane temporal sources, including overlapping
terms and fixed complex spatial profiles. Existing resident boundary restrictions
apply. Spatial source positions/profiles, Bloch phases, eigenmodes and monitor
settings remain fixed. TFSF, one-way incident-line sources, ADE/tensor/PMC endpoint
routes and spatially streamed waveform derivatives are not exposed by this API.
Higher-order gradients are rejected. The full-autograd reference is admitted by
its estimated graph memory, with `graph_budget_bytes` as an optional cap, and is
only an implementation oracle.

## Validation

Focused CPU tests cover joint material/waveform VJPs, complex input packing,
retained backward seeds, default source equality, caller mutation, memory admission,
online spectra and plane reference matching. CUDA validation uses independent
full-state CPU autograd oracles and a nondefault CUDA stream.

The reproducible [integration driver](../benchmarks/source_waveform_validation.py)
keeps fields/materials FP32 or complex64 and evaluates real/complex point, spectrum
and plane paths. These small derivative checks are separate from the RTX 5880
FP32 state-capacity run and do not establish speed or full physical convergence.

The [recorded CUDA run](validation/source_waveform_adjoint.json) passed all nine
FP32/complex64 cases with maximum relative L2 errors 4.98e-7 (fields), 8.51e-7
(epsilon) and 8.55e-7 (waveforms). The predeclared gate was 8e-5. Native default
waveform histories agreed exactly. Three nondefault-stream full-state transpose
cases also passed, and the joint source/material example ran three CUDA updates.
