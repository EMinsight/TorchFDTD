# Spectral and pupil objectives

`periodic_layer_response(density, spec, mesh=..., steps=...)` returns a
`(2, 4)` tensor of Cartesian x/y detector allocations, ordered R, G2, G1, B.
It uses the selected-frequency dielectric indices and refracted incidence in
the supplied specification. It calibrates two homogeneous source responses,
coherently synthesizes each polarization, and then evaluates transmission
and electric-intensity allocation. Only density is differentiated.

`spectral_pupil_response(cases, density, ray_weights)` accepts a rectangular
wavelength-major, ray-minor sequence of callables. Each callable returns
`(polarization, channel)` nonnegative power responses. The result has shape
`(channel, wavelength)`. Polarizations are averaged as mutually incoherent
inputs, and rays are summed with the supplied intensity weights. **Ray weights
are not renormalized.** This preserves field-dependent illumination and allows
exact-weight ray subsets to add back to the full pupil.

```python
from functools import partial
from photonweave import periodic_layer_response, spectral_pupil_response

cases = [[partial(periodic_layer_response, spec=spec, mesh=0.05, steps=1600)
          for spec in wavelength_cases] for wavelength_cases in schedule]
response = spectral_pupil_response(cases, density, ray_weights)
# response feeds spectral_electron_model and exposure_target_information.
```

The example mesh and duration are execution settings, not accuracy defaults.
Specifications contain wavelength_um, background_index, design_index,
period_um, height_um, detector_offset_um, theta_inside_rad and phi_rad.
The layer is centered at z=0 and its detector is at height/2 + offset.
The geometry uses conservative arithmetic Yee-box averaging with selectable
pixel origin. Lossy or broadband dispersive differentiation is not supplied
by this API.

Case replay bounds graph residency to one wavelength/ray at a time. A case
holds both polarization source graphs during its backward. Homogeneous
references are recalculated without gradients on each invocation. This avoids
retaining reference fields for every ray but adds compute. No cross-case
reference cache or parallel GPU launches are claimed. Compact outputs default
to CPU, and the existing output budget counts these tensors only. Workspace,
checkpoints, density, gradients and objective tensors need additional memory.
First-order derivatives and deterministic, immutable cases are required.

`benchmarks.cr_spectral_objective` joins this path to the explicit locked
development electron context. It verifies the density hash, spectral ordering
and complete rectangular schedule, and records input hashes, response,
information, optional gradient norm, runtime and Torch CUDA peak allocation.
Private seed arrays, priors and material tables are not embedded in the runner.

```console
python -m benchmarks.cr_spectral_objective --schedule schedule.json --density seed.npy --context context.pt --output results/objective.json --mesh .05 --steps 1600 --forward-only
```

Omit `--forward-only` for the density gradient. The runner uses the explicit
0.01/0.99 relaxation of a binary seed. It does not optimize the design or
establish optical convergence. Context tensors are loaded with weights-only
deserialization. The caller must supply the matching development prior and
calibration, not held-out evaluation data.

Tests compare ray subset addition, unnormalized weights and coupled electron
information gradients against direct evaluation and finite differences on
CPU/CUDA. A small physical FDTD case checks homogeneous transmission allocation
and its density derivative. These tests do not prove full CR optical accuracy.

The public selected-layer API also reproduces the recorded relaxed CR seed
objective (0.2843927415139927) and directional derivative
(0.21922469270490433) on RTX 3060. Peak Torch CUDA allocation is 420,831,232
bytes because both source graphs remain in one active ray case. This differs
from the earlier source-by-source replay pilot. Its 159.02-second measurement
includes homogeneous references and is not a controlled speed comparison.
See the [API parity record](validation/cr-periodic-response-api.json).
