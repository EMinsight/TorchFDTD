# G7 application workflows: declared fixtures, criteria and measurements

This page fixes, before any G7 run, the three application workflows of section 9 of the
[completion program](COMPLETION_PROGRAM_KO.md), the independent-solver comparison and the cost
measurements. The case files `docs/validation/cases/G7-01.json` to `G7-05.json` carry the same
declarations in machine-readable form; a later change to a fixed quantity is a revised case and
needs the owner's approval. Every workflow runs from the installed wheel in an environment outside
the checkout, on the RTX 3060 workstation (`rtx3060-win11-lab`) unless a row says otherwise.

Baselines quoted below were read from records that predate this page:
`docs/validation/meep_comparison/metagrating_comparison.json` (two-ridge metagrating, band-mean
T+1 = 0.7706 in TorchFDTD, 0.7700 in RCWA) and `docs/validation/g6/coupler-seed*.json` (G6 coupler,
best fine-GDS transmission 0.6136, with declared fabrication constraints violated).

## G7-01: metagrating (application A)

| Quantity | Fixed value |
|---|---|
| Stack | SiO2 substrate (n = 1.444) below y = 0.01 um; design layer 0.01 to 0.51 um; air above; the grid, absorbers, pulse and DFT lines of `examples/meep_comparison/metagrating/geometry.json` |
| Period | 2.0 um, periodic (Bloch) in x |
| Design variables | 100 pixels of 0.02 um across the period, one density per pixel, extruded through the layer; eps = 1 + (3.48^2 - 1) rho |
| Filter and projection | conic filter of radius 0.06 um; tanh projection at beta = 8, 16, 32, 64 for 20 iterations each (80 iterations); Adam, learning rate 0.1 |
| Starts | logits 0.5 * randn with seeds 1, 2 and 3 |
| Objective | mean of the +1 transmitted order efficiency at 1.50, 1.55 and 1.60 um, E along the ridges (TE), normal incidence from the substrate |
| Fabrication | declared minimum linewidth and gap 0.06 um (3 pixels), periodic boundary; binarized at 0.5 after the last beta |
| Final evaluation | every seed's binary design at the design mesh and at 0.01 um: TE and TM (H along the ridges), normal incidence and a fixed Bloch wavevector k_x = 2 pi n_sub sin(10 deg) / 1.55 um (10 degrees in the substrate at 1.55 um; the angle follows the wavelength across the band), 41 wavelengths from 1.50 to 1.60 um, reflected and transmitted orders -1, 0, +1 as complex amplitudes |
| Independent check | TORCWA 0.1.4.2 on the same binary pixel pattern and the same k_x for every evaluated case |

Acceptance: (a) all three seeds reported with history, design and every evaluation; (b) the best
seed's band-mean T+1 (TE, 0 degrees, binary, design mesh) is at least the two-ridge baseline 0.7706;
(c) TorchFDTD and TORCWA differ by at most 0.02 in every order efficiency of every evaluated case, at
the design mesh for TE and at 0.01 um for TM (the staircase error of the normal field component
needs the finer mesh); (d) the 0.01 um mesh changes T+1 (TE, 0 degrees) by at most 0.02 at every wavelength;
(e) |1 - sum R - sum T| <= 0.02 in every evaluated case; (f) the best seed's binary design meets the
declared linewidth and gap, and every seed's violations are reported.

## G7-02: small finite metalens (application B)

| Quantity | Fixed value |
|---|---|
| Lens | the 2D silicon-ridge lens of `examples/meep_comparison/metalens/geometry.json`: 33 ridges on a 0.6 um pitch, 20 um aperture, height 1.0 um, design focal length 15 um, 1.55 um, E out of plane |
| Grid | 0.025 um, 5200 steps, PML 1.0 um, the recorded source and DFT lines (aperture line y = -7.9 um, focal line y = 5.6 um, axis x = 0) |
| Starts | three deterministic width sets: (1) the library design of `design_2d.json`; (2) every ridge one library step wider where the library allows it; (3) one step narrower where it allows it |
| Refinement | ridge widths as shape parameters through the shape VJP, objective the focal-point intensity at 1.55 um, 20 Adam iterations, learning rate 0.01 um |
| Validation of each final design | full-aperture field at the design grid; the same at 0.0125 um with the same physical time; the design grid with 1.5 times the physical time; angular-spectrum propagation of the aperture-line field to the focal and axial lines against the direct DFT lines |
| Observables | focal-line and axial intensity, axial peak position, focal-line FWHM, focusing efficiency as defined in `examples/meep_comparison/metalens/compare.py`, side-lobe ratio |

Acceptance: (a) all three starts reported; (b) the best refined design's focusing efficiency is at
least the library design's recorded 0.5571; (c) the 0.0125 um grid changes the focusing efficiency
by at most 0.02 and the axial peak position by at most 0.1 um; (d) 1.5 times the physical time
changes the focusing efficiency by at most 0.005; (e) the propagated and the direct focal-line
intensities differ by at most 5 percent in relative L2 norm; (f) the focal-line FWHM of the best
design is at most 1.25 times lambda / (2 NA) = 1.76 um. A unit-cell phase library alone is never
reported as a full-lens validation.

## G7-03: passive PIC coupler (application C)

| Quantity | Fixed value |
|---|---|
| Device | the offset-guide coupler of `examples/design_mode_coupler.py`: two slab guides of eps 4 in eps 2.25 cladding, 0.6 um wide, offset 0.6 um, fixed-mode ports on both guides, 6 by 10 pixels of 0.2 um design box with a 180-degree rotation symmetry |
| Starts | logits 0.5 * randn with seeds 1, 2 and 3 |
| Mesh | 0.05 um for the optimization and the evaluation, 0.025 um for the mesh check (G6 optimized at 0.2 um, one cell per pixel) |
| Objective | modal transmission port 1 to port 2 at 1.55 um, held-out wavelength 1.50 um reported and never optimized |
| Fabrication | declared minimum linewidth and gap 0.4 um, enforced through the filter radius and a final check; erosion and dilation of 0.1 um reported |
| Final evaluation | the full 2 x 2 modal S matrix with phases at 1.50, 1.55 and 1.60 um for the binary design; the design exported to GDS, re-imported and simulated again |
| Gradient check | adjoint derivative against central finite differences at three pixels per seed |

Acceptance: (a) all three seeds reported; (b) the best seed's transmission after the GDS round trip
is at least 0.6136 while its design meets the declared linewidth and gap; (c) |S11|^2 + |S21|^2 <= 1.01
and |S22|^2 + |S12|^2 <= 1.01 for every seed and wavelength; (d) |S21 - S12| <= 1e-3 in every case;
(e) the adjoint and finite-difference derivatives agree within 2 percent at every checked pixel;
(f) the GDS round trip changes the transmission by at most 0.005; (g) the 0.025 um mesh changes the
best seed's transmission by at most 0.02.

## G7-04: independent solver at matched accuracy

| Quantity | Fixed value |
|---|---|
| Problem | the fixed two-ridge metagrating of `examples/meep_comparison/metagrating/geometry.json`, TE, normal incidence |
| Reference | TORCWA with 101 Fourier orders, checked against 51 orders (difference at most 1e-4) |
| TorchFDTD | RTX 3060, fused CUDA kernels, meshes 0.04, 0.02, 0.01 and 0.005 um, steps scaled to the same physical time |
| Meep 1.34 | i7-12700, 4 MPI ranks in the torchfdtd-bench WSL distribution, resolutions 25, 50, 100 and 200 per um, the same physical time |
| Observables | T+1 at 1.55 um and the band-mean T+1; error = absolute difference to the reference; cost = wall time (median of three runs), cells and steps |

Acceptance: every point is recorded with its median and range; the accuracy-versus-cost curve of
both solvers is rendered from the record; the cost to reach errors of 0.01, 0.005 and 0.002 is
reported by log-log interpolation for each solver; equal-cell-count and equal-error comparisons are
reported separately; the record states that the two solvers ran on different hardware (CPU against
GPU) and draws no conclusion about algorithms from it.

## G7-05: cost of a design iteration

| Quantity | Fixed value |
|---|---|
| Workloads | one design iteration of G7-01 (three wavelengths, TE) and one of G7-03 |
| Stages | T_geometry, T_setup, T_forward, T_monitor, T_backward, T_transfer/IO, T_optimizer, each bounded by a CUDA synchronization; overlapping asynchronous work is not summed and the overlap definition is recorded |
| Cold and warm | the first iteration of a fresh process (compilation, JIT, mode solve) against the median of iterations 2 to 6 |
| Repeats | five fresh processes; median and range |
| Execution | resident against host-streamed for the G7-01 iteration; the three wavelengths as one tensor batch against three sequential runs, including preparation, normalization and backward |
| Tuning | the cost of the policy autotuner and its break-even iteration count, or the statement that it gives no gain |

Acceptance: every stage is recorded with its median and range for cold and warm iterations; the
streamed and batched comparisons are recorded even where they are slower; the recorded medians
become the baseline and a test flags a later run whose stage median exceeds 1.25 times it.
