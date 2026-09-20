# Color-router inverse-design validation

## Selected reference

The user selected the recent TORCWA-based color-router study with color
reconstruction and information objectives on 2026-09-20. Its original geometry,
optical sampling, material models, reconstruction model and objective definitions
are the reference contract. A generic RGB transmission objective is not a
substitute for this study's objective.

The selected seed and dependency hashes have been checked against the research
lock manifests. Active objective source hashes and the production prior/calibration
replay are recorded in the validation evidence. The optical pilot records its
exact input hash and settings. A directory name or a file labelled latest, best
or final does not establish a reference, and the whole research tree is not
claimed to be frozen by these per-file checks.

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
change the study. The [electron objective adapter](ELECTRON_OBJECTIVE.md) now reproduces the
active information objective and response gradients using the locked development
prior and common CFA calibration. Optical integration remains pending, including
full-pupil replay and wavelength-dependent indices.

## CR comparison contract

The inspected SiN/SiO2 tables have wavelength-dependent real indices and zero
tabulated extinction. A separate selected-frequency solve may use the exact
epsilon and transverse Bloch phase at that wavelength, provided temporal and
spectral convergence are demonstrated there. This preserves the frequency-domain
comparison without claiming broadband ADE differentiation. A single constant
index shared across the whole band is not equivalent. The resident
[fixed Bloch adjoint](BLOCH_ADJOINT.md) now passes discrete and oblique TE slab
checks. A [sequential case-recompute API](RECOMPUTED_CASES.md) now bounds multi-case
graph residency and passes coupled-gradient checks. [Calibrated two-basis polarization synthesis](POLARIZATION_SYNTHESIS.md) now
passes a 3D oblique slab check for Cartesian x/y inputs. Matching the full CR
pupil and fused/streamed complex execution remain requirements.
The [electric-intensity allocation](DETECTOR_ALLOCATION.md) and independent
24-by-24 midpoint quadrature are implemented and pass synthetic reference
parity. Physical transmission and detector z origin have been exercised in the selected-ray pilot. Full ray-schedule optical validation remains pending. Locked electron calibration and prior loading passed in an
isolated byte-restored copy with the original required production runtime.

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

## First locked-seed optical pilot

A [540 nm/ray-zero seed comparison](validation/CR_SEED_OPTICAL_PILOT.md) now
uses the exact seed hash, selected-frequency indices, refracted ray, output-face
detector offset and two calibrated Cartesian polarizations. At matched short
duration, reducing mesh from 50 to 25 nm reduced maximum unpolarized channel
discrepancy from 0.04682 to 0.00711. At doubled 25 nm duration the discrepancy
is 0.00816. This remains an exploratory convergence pilot. The full pupil,
other wavelengths and independent mesh/time convergence remain gates before optimization. The actual relaxed structure now passes a selected-ray discrete directional-derivative check, which does not establish physical gradient convergence.

## Full spectral/pupil integration

The [spectral/pupil API](SPECTRAL_PUPIL_RESPONSE.md) now connects selected-frequency
FDTD cases to the exact-weight incoherent pupil and electron information model.
The locked schedule contains nine wavelengths and sixteen rays. Its weight sum
is 0.996198318172399 and is preserved without normalization. A first full forward
run at 50 nm and 1600 steps has been launched on RTX 5880. Completion and optical
convergence are not yet established. No optimization has been launched.

The original full-schedule TORCWA response for the same 0.01/0.99 relaxed seed
is now recorded at Fourier orders (8,8), with the original 1e-4 frequency nudge.
Its locked development objective is 1.2064319578769425 bits per pixel. Applying
the candidate electron model to that response differs by 4.22e-15. This isolates
the objective adapter from the remaining optical comparison. The reference
uses complex64 and has not passed an independent order-convergence study.
See [full reference](validation/cr-full-torcwa-reference.json).

The full relaxed-seed density-gradient execution has now been launched using
fused complex forward and transpose kernels, exact supplied ray weights and
the locked electron context. A small physical multi-case integration test
first verified objective/VJP parity and directional finite differences through
the combined cache/recompute/objective path. Full CR response and gradient
results remain pending. The intermediate forward snapshot is not evidence of
gradient completion, and no optimization has been launched.
