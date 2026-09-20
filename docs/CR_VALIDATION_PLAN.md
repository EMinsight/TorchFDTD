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
is 0.996198318172399 and is preserved without normalization. Full forward runs
at 50 nm and 1600 steps have completed using Torch on RTX 5880 and fused CUDA
on RTX 3060. Their maximum response difference is 5.55e-17 and objective
difference is 4.22e-15. This establishes implementation parity for this schedule,
not optical convergence or a cross-hardware speed comparison.
See [forward parity](validation/cr-full-forward-kernel-parity.json).
No optimization has been launched.

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
the combined cache/recompute/objective path. The full 144-case gradient now
completed on RTX 3060, with norm 0.029781743905171024 and peak Torch CUDA
allocation of 328,878,592 bytes. Total forward/replay/backward time was
5416.329 seconds. The reference cache held 42,471,936 bytes within its 64 MiB
budget. See [the completed record](validation/cr-full-gradient-3060.json).
Earlier overlapping development tests make this elapsed time diagnostic rather
than an isolated performance measurement. No optimization has been launched.

The coarse FDTD objective is 1.236263348891092 bits per pixel, versus
1.2064319578769425 for TORCWA. The 2.47% difference is a solver discrepancy,
not a design improvement. The maximum channel-response difference is 0.03262.
[The comparison record](validation/cr-full-coarse-comparison.json) retains
per-wavelength errors and numerical limitations. Mesh/time/PML convergence and
TORCWA order convergence remain requirements before interpreting optimization.

The full nine-wavelength, sixteen-ray TORCWA evaluation at orders (12,12)
completed on RTX 3060 with the same relaxed seed, pupil weights, frequency
nudge and locked electron objective. The objective is
1.2065544902558776 bits per pixel, versus 1.2064319578769425 at (8,8), a
0.01016% change. Maximum absolute channel-response change is 0.00316614.
See [order-12 record](validation/cr-full-torcwa-order12.json).
This increment alone does not explain the approximately 2.47% coarse-FDTD
objective discrepancy. It also does not prove RCWA convergence. A full (16,16)
evaluation has started on the local GPU while the RTX 5880 independently
executes FDTD directional validation. No additional GPU workload shares either
solver's device. FDTD mesh, duration and PML refinement remain necessary.

The (16,16) run subsequently completed. Its objective is
1.2065752346315706 bits per pixel, a 0.0017193% change from (12,12), with
maximum channel-response change 0.000483781. The smaller successive increment
supports order stability for this seed and schedule, but does not bound the
error of every optical observable or establish convergence after optimization.
See [order-16 record](validation/cr-full-torcwa-order16.json).
FDTD still differs by approximately 2.46% in the coarse information objective.

After that local GPU job exited, a full 144-case FDTD forward evaluation began
on RTX 3060 with 3200 steps, the same 50 nm mesh, 12 PML cells, fixed source,
pupil weights and relaxed seed. This isolates duration sensitivity relative
to the existing 1600-step evaluation. Its output is
`results/cr-full-time3200-3060.json`. No gradients or directional probes are
requested in this duration run. The original duration process subsequently
stopped before saving a complete forward result. Duration results are pending
and the run must restart with case persistence, followed by mesh and PML
refinement as required by their observed errors.

Future evaluator runs persist the complete relaxed-density gradient as an NPY
artifact, with its hash, shape and variable definition in the result JSON.
Non-finite gradients fail the run. The completed gradient job predates
this artifact extension and reports the gradient norm only. Neither form of
record replaces directional-derivative and physical-convergence validation.

## Full-objective directional verification

The evaluator accepts `--directional-steps 0.002 0.001 0.0005` with
`--directional-seed 1729` for a gradient run. It first saves the gradient and
marks the requested check pending, then evaluates the same full spectral/pupil
and electron objective at the baseline and both sides of each perturbation.
The fixed CPU-generated Rademacher direction perturbs relaxed density directly.
Perturbations outside [0, 1] are rejected rather than clipped. This adds seven
full forward objective evaluations for the three-step example, so it should
run after the capacity job, without competing GPU workloads.

The JSON retains each central difference, adjoint projection, absolute and
relative error, first-order Taylor residual and check timing. Failure at the
smallest supplied step saves the results and exits with an error. The default
tolerance is `1e-8 + 1e-3 * max(abs(fd), abs(adjoint))`. Inspect the whole sweep
for truncation and cancellation. A single directional pass establishes neither
all gradient entries nor physical mesh/time convergence. Small multi-case
fused-FDTD integration and analytic wrong-gradient tests exercise this driver.
The locked 144-case directional run has now started on RTX 5880 after the
completed 54 GiB capacity/VJP run and both CPU thread sweeps. Its input hashes
match the original schedule, binary seed and electron context. It uses 50 nm,
1600 steps, 12 PML cells, fused forward/backward, a 64 MiB reference cache and
the three perturbations above. The output is
`results/cr-full-directional-5880.json`, with a gradient NPY saved before the
additional forward probes. That execution completed its gradient with norm
0.029781743905171316, but the subsequent directional check failed with
`OSError(22, 'Invalid argument')`. The recorded exception does not identify
the failing system call. It is not a failed gradient-tolerance result.
After verifying that its process had exited, a new full evaluation started
at `results/cr-full-directional-5880-retry.json` with stdout and stderr directed
to files. It is still pending. No CR optimization has been started, and
optical convergence remains an independent gate.

## Restartable evaluation

New executions of `benchmarks.cr_spectral_objective` save each completed
two-polarization, four-quadrant response in an adjacent `.cases.json` journal.
Restart the same command with `--resume` to reuse completed cases. The key
includes the complete density tensor, so positive and negative directional
probes cannot share the wrong response. A partial current case is recomputed.
An OS file lock prevents two processes from writing the same journal and is
released when its owner exits. The small `.lock` file may remain on disk.

Reuse requires identical input hashes, solver/evaluator source hashes,
numerical settings and recorded runtime identity. A mismatch fails before
solver execution and requires a new output. Older records lacking this
contract are deliberately ineligible. Saved gradient bytes, shape, dtype and
variable are checked before a completed VJP is reused. If interruption occurs
during backward, the full VJP is recomputed. Gradient replay never reads a
detached case result in place of a differentiable solver execution.

The journal contains compact optical responses, not field states or a general
FDTD restart facility. Timing includes journal I/O and resumed elapsed times
cover only that invocation. Such times are not fresh performance measurements.
This restart path does not alter the already running RTX 5880 retry.

Verification includes an interruption after two completed spectral/pupil
cases, restored forward values with fresh differentiable replay, interruption
during a directional sweep, mismatched contracts, corrupt artifacts and
concurrent-writer exclusion. The targeted CPU and fused CUDA tests passed
(16 tests). A separate nine-wavelength, one-ray, 100 nm, 600-step CLI run on
RTX 3060 passed its directional check at step 0.0005 with relative discrepancy
3.67e-8. Restart then restored its gradient and all 27 directional case
responses without executing new FDTD cases. This is restart integration
evidence, not the full CR accuracy study.

The complete 144-case, 50 nm, 3200-step duration study restarted on RTX 3060
with this journal at `results/cr-full-time3200-3060-restartable.json`. The
result is pending. Each completed case now survives a process interruption.
