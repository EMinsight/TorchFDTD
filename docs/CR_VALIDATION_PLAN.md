# Color-router inverse-design validation

## Selected reference

The user selected the recent TORCWA-based color-router study with color
reconstruction and information objectives on 2026-09-20. Its original geometry,
optical sampling, material models, reconstruction model and objective definitions
are the reference contract. A generic RGB transmission objective is not a
substitute for this study's objective.

The exact source revision, configuration and input hashes remain to be resolved
from the research project's lock manifests before experiments. A directory name
or a file labelled latest, best or final does not establish the reference.

## Execution gates

Run the CR validation only after the following runtime milestones pass:

1. Fused backward agrees with the reference discrete adjoint, including CPML,
   periodic seams and material gradients.
2. Asynchronous staging preserves lossless checkpoint replay, protects buffer
   lifetimes and propagates delayed I/O failures. Measure transfer overlap
   separately from numerical correctness.
3. DRAM spatial and temporal tiling reproduces resident fields, observables and
   gradients. All tiles in a block read the same physical time. Backward must
   sum shared-halo contributions. Checkpoint offload alone does not satisfy
   this milestone.
4. The automatic scheduler admits only configurations within explicit memory
   budgets and is evaluated against fixed policies, including tuning overhead.

Low-precision storage is deferred until the lossless paths and gradients pass.

The [online spectral adjoint](validation/ONLINE_SPECTRUM_REPORT.md) now avoids
retaining the full point-observation history for spectral losses. This is one
prerequisite for detector-plane objectives, not a CR result. The
[plane adjoint](validation/PLANE_ADJOINT_REPORT.md) now provides collocated E/H,
its interpolation transpose, signed Poynting quadrature and matched-reference
normalization. A fixed dielectric slab passes Fresnel, conservation and material
derivative checks. The next requirement is to preserve the locked CR spatial
detector responses and connect its exact reconstruction/information model.
Required material dispersion and geometry-gradient convergence remain gates.

The [joint Gaussian target objective](TARGET_INFORMATION.md) is now implemented
and checked against synthetic inputs to the supplied active research module.
A read-only S11 audit verified the seed and three recorded dependency hashes.
The audit also establishes that the detector proxy uses electric-intensity
allocation rescaled by total transmission. Replacing it with local flux would
change the study. The exact prior/calibration replay and optical integration
remain pending, including oblique pupil phases and wavelength-dependent indices.

## CR comparison contract

The inspected SiN/SiO2 tables have wavelength-dependent real indices and zero
tabulated extinction. A separate selected-frequency solve may use the exact
epsilon and transverse Bloch phase at that wavelength, provided temporal and
spectral convergence are demonstrated there. This preserves the frequency-domain
comparison without claiming broadband ADE differentiation. A single constant
index shared across the whole band is not equivalent. The resident
[fixed Bloch adjoint](BLOCH_ADJOINT.md) now passes discrete and oblique TE slab
checks. A [sequential case-recompute API](RECOMPUTED_CASES.md) now bounds multi-case
graph residency and passes coupled-gradient checks. Matched two-polarization
oblique illumination and fused/streamed complex execution remain requirements.
The [electric-intensity allocation](DETECTOR_ALLOCATION.md) and independent
24-by-24 midpoint quadrature are implemented and pass synthetic reference
parity. Physical transmission, detector z origin, the CR ray schedule and
locked electron calibration have not yet been replayed.

Record the reference source revision and hashes before translating the model.
Preserve wavelength and angle weights, polarization, detector geometry, material
dispersion, illumination normalization, reconstruction and noise assumptions,
regularization and fabrication constraints. Unsupported physics or observables
are implementation blockers rather than silent substitutions.

First compare the same fixed geometry with TORCWA and FDTD using spatial,
temporal and spectral convergence sweeps. Then compare the resulting optical
response, reconstructed colors and information objective. Check geometry
derivatives using directional finite differences and Taylor residuals before
optimization.

Re-optimize from matched initial designs and record seeds, optimizer settings,
complete iteration time, objective history and memory in every storage tier.
Re-evaluate final designs at independently refined numerical settings. Report
disagreements and numerical tolerances alongside improvements. No CR result or
runtime advantage has been established by this plan.
