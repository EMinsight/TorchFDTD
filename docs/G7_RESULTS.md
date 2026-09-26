# G7 results

Results of the G7 application workflows and cost measurements declared in
[G7_WORKFLOWS.md](G7_WORKFLOWS.md). Each section is written from its own committed records.

## G7-02: small finite metalens (application B)

Declared in [G7_WORKFLOWS.md](G7_WORKFLOWS.md) (section G7-02 and its revision G7-02r2) and
[`docs/validation/cases/G7-02r2.json`](validation/cases/G7-02r2.json), which supersedes
[`G7-02.json`](validation/cases/G7-02.json) with a time rule and keeps its acceptance limits. Code:
[`examples/g7/metalens/metalens_workflow.py`](../examples/g7/metalens/metalens_workflow.py). Records:
[`docs/validation/g7/G7-02/`](validation/g7/G7-02): `common.json` (the native tie, the shutoff cross-check and
the gradient check), `start-library.json`, `start-wider.json`, `start-narrower.json` and `summary.json`.
`tests/test_g7_metalens.py` re-judges the records against the case file.

**Verdict: every criterion passes for all three starts.** The best refined design (narrower start) has a
focusing efficiency of 0.6988 against the declared 0.5571; the library start ends 0.0002 below it. Doubling the
stop time changes the efficiency of the final designs by at most 0.0015 (limit 0.005). For the wider start the
doubled run reaches the declared cap and covers 1.18 times its stop time, not two times (see Time rule).

### Run

| Item | Value |
|---|---|
| Command | `TORCHFDTD_G7_FULL=1 TORCHFDTD_G7_RECORD=<checkout>/docs/validation/g7/G7-02 python -m pytest -q -p no:cacheprovider <checkout>/tests/test_g7_metalens.py -k declared_workflow`, with the interpreter of the wheel environment, from a working directory outside the checkout |
| Package | the release wheel `torchfdtd-0.16.0-py3-none-any.whl` (built from 2612d831ef91), SHA-256 `57920904d42fe76bd0a38ce002223a0f1fb0174fd890abc2f1781bac8d8794dd`, installed with the `dev` and `cuda-kernels` extras in a fresh virtual environment without system site-packages, with torch 2.10.0+cu126 and cupy-cuda12x 13.6.0. Every record names the imported file (that environment's site-packages), version 0.16.0, `torchfdtd_import: installed` and the wheel's SHA-256 |
| Code | examples and tests of this branch at commit 0fb8d51, no tracked changes outside the record directory (recorded in every record) |
| Device | NVIDIA GeForce RTX 3060, float32, fused CUDA kernels; the GPU lock was held exclusively, so no other GPU job ran |
| Wall time | 5139 s: common stage 133 s, library 1373 s, wider 2371 s, narrower 1261 s; one refinement iteration (stop search, value and gradient) took 43 to 129 s, growing with the stop step count |

A first run of the same command and wheel, with the GPU shared with other jobs, stopped in iteration 4 of the
narrower start with a CUDA illegal memory access, at the same second as Windows driver events (nvlddmkm 153). Its
common stage and its library and wider starts gave values identical to these records in every field except wall
times. It is kept outside the repository.

### Method

- Lens and grid as declared: `examples/meep_comparison/metalens/geometry.json` (33 ridges on a 0.6 um pitch,
  height 1.0 um, n = 3.48, Ez), 0.025 um, 1.0 um CPML, the recorded source sheet and the incident (y = -7.9 um,
  20 um wide), focal (y = 5.6 um) and axis (x = 0) lines. Lens and line builders, the observables and the focusing
  efficiency come from `torchfdtd_metalens.py` and `metalens_common.py`, the functions `compare.py` applies to the
  comparison records.
- Time rule (G7-02r2): every forward run, of the lens and of the bare cell, continues until the total field energy
  in the cell (the StateDiagnostics measure, float64) is at most 1e-3 of its running peak, checked every 20 steps
  once the source has ended (step 2676), capped at 10 times the declared 5200-step (303.6 fs) window. The energy is
  evaluated on the adjoint's own Yee system for the regularized permittivity; the run of the found length follows.
- Starts: the widths of `design_2d.json`, every ridge one library step (0.05 um) wider, and one step narrower. Four
  ridges already have the widest library width and keep it in the wider start; no ridge has the narrowest.
- Design model: each ridge is a `DifferentiableSolid.box` whose width is a Torch parameter, rasterized by
  `smooth_geometry_epsilon` with a 0.05 um transition (two cells of the design grid, four of the 0.0125 um grid).
  The bounded shape VJP of that function carries the adjoint permittivity gradient to the widths. Every
  validation run rasterizes the same regularized boxes.
- Refinement: objective |Ez|^2 at (0, 5.6) um at 1.55 um relative to the bare-cell incident intensity, through
  `DifferentiableSimulation.spectrum` (online DFT, 32 device checkpoints); `torch.optim.Adam` with default betas,
  learning rate 0.01 um, 20 iterations. Each iteration first finds the stop of the current widths and then runs the
  value and gradient for that step count. Widths are clipped to the library range 0.075 to 0.575 um after each step.
  The final design is the iterate after the 20th step; no iterate is selected.
- Validation of each final design: `DifferentiablePlaneSimulation` forwards with the recorded lines, whose
  interpolation and time convention are those of the native plane monitors, each normalized by its own bare cell
  at its own stop: the design grid; 0.0125 um (80 CPML cells per face, window 10400 steps, cap 100000 steps, which is
  9.6 windows because of the Region step limit); and the design grid with lens and bare cell run for twice their
  stops, within the cap.
- Tie to the recorded comparison: the staircase library design (the voxelized structures) at its stop (18000
  steps, 3.46 times the window) gives efficiency 0.5567197 through the native `Simulation` and 0.5567203 through
  the plane forward. The recorded comparison value 0.5571 was taken at the declared window; (b) keeps it as the
  limit.
- Native shutoff cross-check: `RunControl(auto_shutoff=True, decay_threshold=1e-3, check_interval=20,
  consecutive_checks=2)` on the same staircase lens stops at 18100 steps, the rule at 18000.
- Gradient check (library start at its stop, 17360 steps, ridge at x = -5.4 um, float32): adjoint 15.6864 per um
  against central differences 15.4419, 15.6288 and 15.6736 at steps of 4, 2 and 1 nm, relative differences 1.58,
  0.37 and 0.081 percent, falling as the square of the step (the truncation error of the cubic transition). The fast
  test repeats the check in float64 on the CPU on a reduced lens and requires agreement within 1e-4.

### Starts and final designs

Efficiency is the compare.py focusing efficiency at 1.55 um (power within 1.5 FWHM of the focal-line peak over the
bare-cell power through the incident line). The focal-point intensity is the objective, relative to the incident
intensity. Stop steps are on the grid named; a window is 5200 steps at 0.025 um and 10400 at 0.0125 um.

| Start | Initial efficiency | Initial stop (steps) | Focal-point intensity, initial / final | Stops during the refinement (steps) | Widths at a bound after the refinement |
|---|---|---|---|---|---|
| library | 0.5598 | 17360 (3.34 windows) | 9.561 / 12.183 | 15480 to 20200 | 2 |
| wider | 0.4384 | 25940 (4.99 windows) | 6.760 / 11.295 | 25760 to 48520 | 4 |
| narrower | 0.4565 | 14400 (2.77 windows) | 7.291 / 12.351 | 13960 to 25660 | 0 |

| Start | Final efficiency: design grid / 0.0125 um / twice the stop | Final stop: design grid / 0.0125 um (steps) | Twice-the-stop run (steps) | Axial peak y (um): design grid / 0.0125 um | Focal-line FWHM (um) | Side-lobe ratio | Transmission |
|---|---|---|---|---|---|---|---|
| library | 0.6986 / 0.6979 / 0.6988 | 18960 (3.65 windows) / 38520 (3.70) | 37920 | 5.877 / 5.902 | 1.127 | 0.091 | 0.861 |
| wider | 0.6230 / 0.6313 / 0.6240 | 44120 (8.48 windows) / 80780 (7.77) | 52000 (the cap) | 5.404 / 5.386 | 1.108 | 0.089 | 0.792 |
| narrower | 0.6988 / 0.6918 / 0.6973 | 17860 (3.43 windows) / 34500 (3.32) | 35720 | 5.217 / 5.221 | 1.144 | 0.053 | 0.845 |

The initial efficiency of the library start (0.5598) is that of the regularized fill at its stop; the staircase of
the same widths gives 0.5567 at its stop. The side-lobe ratio is the largest focal-line intensity outside the main
lobe, bounded by the first minima on each side of the peak, over the peak. The objective does not constrain the
axial peak: the axial maxima of the final designs lie at 5.22 to 5.88 um while the intensity at the declared focal
point rose.

### Criteria

| Criterion | Value | Limit | Result |
|---|---|---|---|
| (a) all three starts reported | library, wider, narrower | three starts | pass |
| (b) best refined efficiency (narrower start, design grid) | 0.6988 | at least 0.5571 | pass |
| (c) 0.0125 um: efficiency change, library / wider / narrower | 0.0007 / 0.0083 / 0.0070 | at most 0.02 | pass |
| (c) 0.0125 um: axial peak change (um) | 0.025 / 0.019 / 0.004 | at most 0.1 | pass |
| (d) twice the stop time: efficiency change | 0.00015 / 0.0010 / 0.0015 | at most 0.005 | pass |
| (e) propagated against direct focal-line intensity, relative L2 | 0.022 / 0.0074 / 0.0034 | at most 0.05 | pass |
| (f) focal-line FWHM of the best design (um) | 1.144 | at most 1.76 | pass |
| scope | every number comes from full-aperture 33-ridge runs; the unit-cell library only supplies the start widths | - | pass |

(c) to (e) are judged on every start's final design, not only the best one.

### Time rule

Every stop search of the run reached 1e-3 before the cap: the bare cell at 2820 steps (0.54 windows, 164.6 fs) on
the design grid and 5620 steps at 0.0125 um, the 60 refinement iterations and every validation run. The stops depend
on the design. The library and narrower starts stay between 2.7 and 4.9 windows. The wider start rises from 4.99
windows at iteration 0 to 9.33 windows (48520 steps) at iteration 19, and its final design stops at 8.48 windows.
Twice that is beyond the declared cap of 10 windows, so its (d) run is capped at 52000 steps, 1.18 times its stop:
for this start (d) compares the efficiency at the stop with the efficiency 0.18 stops later, not at twice the time.
This follows the declared rule ("twice the stop time of the 1e-3 rule, capped at 10 times the declared window").
The other two starts are compared at exactly twice their stops.

### Propagation

The angular spectrum of the complex Ez on the 20 um incident line (zero padding 4, air) reproduces the direct focal
line within 2.2, 0.74 and 0.34 percent (relative L2, library, wider, narrower) and the direct axial line within 1.9,
1.7 and 0.86 percent. As information, the same propagation from a line widened to the whole interior (22 um) gives
1.1, 1.2 and 0.61 percent on the focal line. The axial profiles are flat near their maxima, so the propagated axial
peak lies 0.17, 0.50 and 0.17 um from the direct one from the 20 um line (0.013, 0.37 and 0.21 um from the
full-width line); no criterion applies to it.

### Limits

- The validated object is the regularized fill with a 0.05 um transition, not sharp-edged ridges. Its mesh check
  refines one permittivity profile; the staircase or subpixel model of the same widths was not evaluated.
- The objective is the intensity at one point and one wavelength, for one polarization in 2D; nothing is claimed for
  1.50 and 1.60 um (their values are in the records), for TE, or for a 3D lens.
- Widths were clipped to the library range; the declaration does not name a bound. Two widths of the library start
  and four of the wider start end on the upper bound.
- For the wider start, (d) covers 1.18 times the stop, not two times (Time rule).
- The records store the focal and axial lines at 1.55 um for every grid and summaries at all three wavelengths; each
  start record is about 290 kB.

### Reproduce

The judged run needs a CUDA GPU and takes about 1.5 hours on an otherwise idle RTX 3060.

```bash
# wheel environment outside the checkout
python -m venv <env>
<env>/python -m pip install torch==2.10.0+cu126 --index-url https://download.pytorch.org/whl/cu126
<env>/python -m pip install "torchfdtd-0.16.0-py3-none-any.whl[dev,cuda-kernels]"
# judged run, from a working directory outside the checkout
TORCHFDTD_G7_FULL=1 TORCHFDTD_G7_RECORD=<checkout>/docs/validation/g7/G7-02 <env>/python -m pytest -q -p no:cacheprovider <checkout>/tests/test_g7_metalens.py -k declared_workflow
# fast checks and the re-judgement of the committed records, from the repository root
python -m pytest tests/test_g7_metalens.py
```

## G7-04: independent solver at matched accuracy

Declared in [G7_WORKFLOWS.md](G7_WORKFLOWS.md) (section G7-04) and
[`docs/validation/cases/G7-04r2.json`](validation/cases/G7-04r2.json), which states the reference check used here. Code:
[`examples/g7/solvers/`](../examples/g7/solvers). Records:
[`docs/validation/g7/G7-04/`](validation/g7/G7-04), one JSON file per point plus `rcwa_reference.json`
and `summary.json`. `summary.json`, the tables below and the figure are produced by
`examples/g7/solvers/analyze.py` from the point records; `tests/test_g7_solvers.py` recomputes them.

**Hardware.** TorchFDTD ran on a GPU (NVIDIA RTX 3060, fused CUDA kernels) and Meep 1.34 on a CPU (Intel i7-12700, 4 MPI ranks in WSL). Wall times therefore compare two solver-and-hardware combinations on a shared workstation; no conclusion about the algorithms is drawn from the cost ratio. The cell-count axis is hardware-independent.

**Package.** The TorchFDTD records come from a checkout import of this branch (each record names the file,
version 0.15.0, `torchfdtd_import: checkout` and the git commit). The release-candidate round re-runs the
TorchFDTD points with the installed wheel; the driver imports an installed package when one exists.

### Fixture

| Quantity | Value |
|---|---|
| Problem | two-ridge metagrating of `examples/meep_comparison/metagrating/geometry.json`, TE (Ez), normal incidence from the substrate |
| Observables | T+1 at 1.55 um; band-mean T+1 over the 41 wavelengths 1.50 to 1.60 um; error = absolute difference to the reference |
| Order decomposition | the Fourier decomposition of `examples/meep_comparison/metagrating/compare.py`, applied to the recorded per-order Fourier means of Ez and Hx on the two DFT lines |
| TorchFDTD | NVIDIA RTX 3060, fused CUDA kernels, CUDA graph, float32 and float64 fields (DFT in float64); meshes 0.04, 0.02, 0.01, 0.005 um |
| Meep | 1.34.0, float64, 4 MPI ranks on the Intel i7-12700 in the WSL distribution torchfdtd-bench; resolutions 25, 50, 100, 200 per um |
| Time and absorber | 560.4 fs (the base 12,000 steps at 0.02 um) and 0.4 um at every mesh, Courant number 0.700036 |
| Staircase series | Meep `eps_averaging=False`, TorchFDTD staircase Yee sampling; at 0.01 and 0.005 um all six material edges would lie on Ez nodes, so the whole structure moves by half a cell in +x and +y (0.005 and 0.0025 um); source and DFT lines stay |
| Smoothed series | Meep default subpixel averaging, TorchFDTD experimental subpixel interfaces (quadrature 8), no shift |
| Timing | per point one bare-substrate reference run, one warm-up and three timed grating runs; cost = wall time of one full grating solve (setup and stepping), median and range of the three |

Derived geometry per mesh (`common.derive_geometry`, the same for both solvers):

| mesh (um) | Meep resolution (1/um) | cells | absorber cells per y face | steps | dt (s) | staircase shift (um) | Ez rows in the ridge, TorchFDTD / Meep (staircase) |
|---|---|---|---|---|---|---|---|
| 0.04 | 25 | 50 x 91 | 10 | 6,000 | 9.340271e-17 | 0 | 13 / 12 |
| 0.02 | 50 | 100 x 182 | 20 | 12,000 | 4.670136e-17 | 0 | 25 / 25 |
| 0.01 | 100 | 200 x 364 | 40 | 24,000 | 2.335068e-17 | 0.005 | 50 / 50 |
| 0.005 | 200 | 400 x 728 | 80 | 48,000 | 1.167534e-17 | 0.0025 | 100 / 100 |

Two grid facts shape the coarse end of the curves. TorchFDTD places Ez nodes at -L/2 + i h, and Meep
places them at integer multiples of h from the cell centre (read back from `get_chi1inv`). The two sets
coincide on an axis with an even cell count, so the solvers share their staircase at 0.02, 0.01 and
0.005 um. At 0.04 um the 3.64 um cell has 91 rows, and the y nodes lie half a cell apart: TorchFDTD
samples the 0.5 um ridges on 13 rows and Meep on 12 (recorded `silicon_rows`). The staircase curves of
the two solvers at 0.04 um therefore describe different discrete structures. Separately,
`Region.pml_cells` is capped at 50, so the TorchFDTD absorber is set per face with
`BoundaryFace(kind='pml', layers=n)` (80 cells at 0.005 um), with no package change.

### Reference

| TORCWA orders | T+1(1.55) | band-mean T+1 | role |
|---|---|---|---|
| 101 | 0.774640 | 0.770030 | reference |
| 241 | 0.774649 | 0.770031 | check (case G7-04r2) |
| largest difference, six efficiencies x 41 wavelengths | 6.4e-05 (T+1 at 1.50 um) | limit 1e-04 | pass |

The reference is TORCWA 0.1.4.2 with 101 Fourier orders (complex128 on CUDA, `solve()` of `rcwa_metagrating.py` on the unshifted geometry). As declared in case G7-04r2, it is checked against 241 orders: the largest difference over the six efficiencies and 41 wavelengths is 6.4e-05 (T+1 at 1.50 um), within the limit 1e-04. T+1(1.55) and the band mean differ by 9.7e-06 and 8.7e-07, far below the smallest error target 0.002. Every error below is measured against the 101-order values.

### All points

| solver | series | precision | mesh (um) | resolution (1/um) | cells | steps | median time (s) | range (s) | T+1(1.55) | error | band-mean T+1 | error |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TorchFDTD | staircase | float32 | 0.04 | 25 | 50 x 91 = 4,550 | 6,000 | 0.134 | 0.121-0.261 | 0.77406 | 5.78e-04 | 0.77113 | 1.10e-03 |
| TorchFDTD | staircase | float32 | 0.02 | 50 | 100 x 182 = 18,200 | 12,000 | 0.401 | 0.312-0.433 | 0.77612 | 1.48e-03 | 0.77063 | 6.04e-04 |
| TorchFDTD | staircase | float32 | 0.01 | 100 | 200 x 364 = 72,800 | 24,000 | 1.393 | 1.368-1.423 | 0.77521 | 5.74e-04 | 0.77032 | 2.95e-04 |
| TorchFDTD | staircase | float32 | 0.005 | 200 | 400 x 728 = 291,200 | 48,000 | 6.936 | 6.925-7.031 | 0.77484 | 1.99e-04 | 0.77009 | 5.64e-05 |
| TorchFDTD | staircase | float64 | 0.04 | 25 | 50 x 91 = 4,550 | 6,000 | 0.329 | 0.287-0.400 | 0.77406 | 5.78e-04 | 0.77113 | 1.10e-03 |
| TorchFDTD | staircase | float64 | 0.02 | 50 | 100 x 182 = 18,200 | 12,000 | 0.675 | 0.652-0.679 | 0.77612 | 1.48e-03 | 0.77063 | 6.04e-04 |
| TorchFDTD | staircase | float64 | 0.01 | 100 | 200 x 364 = 72,800 | 24,000 | 2.537 | 2.537-2.561 | 0.77521 | 5.74e-04 | 0.77032 | 2.95e-04 |
| TorchFDTD | staircase | float64 | 0.005 | 200 | 400 x 728 = 291,200 | 48,000 | 15.072 | 14.977-15.074 | 0.77484 | 1.99e-04 | 0.77009 | 5.64e-05 |
| TorchFDTD | smoothed | float32 | 0.04 | 25 | 50 x 91 = 4,550 | 6,000 | 0.293 | 0.173-0.316 | 0.78464 | 1.00e-02 | 0.77913 | 9.10e-03 |
| TorchFDTD | smoothed | float32 | 0.02 | 50 | 100 x 182 = 18,200 | 12,000 | 0.538 | 0.513-0.546 | 0.77612 | 1.48e-03 | 0.77063 | 6.04e-04 |
| TorchFDTD | smoothed | float32 | 0.01 | 100 | 200 x 364 = 72,800 | 24,000 | 1.718 | 1.705-1.730 | 0.77510 | 4.60e-04 | 0.77039 | 3.64e-04 |
| TorchFDTD | smoothed | float32 | 0.005 | 200 | 400 x 728 = 291,200 | 48,000 | 8.354 | 8.340-8.486 | 0.77481 | 1.69e-04 | 0.77010 | 7.17e-05 |
| TorchFDTD | smoothed | float64 | 0.04 | 25 | 50 x 91 = 4,550 | 6,000 | 0.319 | 0.240-0.358 | 0.78464 | 1.00e-02 | 0.77913 | 9.10e-03 |
| TorchFDTD | smoothed | float64 | 0.02 | 50 | 100 x 182 = 18,200 | 12,000 | 0.767 | 0.734-0.853 | 0.77612 | 1.48e-03 | 0.77063 | 6.04e-04 |
| TorchFDTD | smoothed | float64 | 0.01 | 100 | 200 x 364 = 72,800 | 24,000 | 2.679 | 2.629-2.707 | 0.77510 | 4.60e-04 | 0.77039 | 3.64e-04 |
| TorchFDTD | smoothed | float64 | 0.005 | 200 | 400 x 728 = 291,200 | 48,000 | 16.032 | 16.032-16.044 | 0.77481 | 1.69e-04 | 0.77010 | 7.16e-05 |
| Meep | staircase | float64 | 0.04 | 25 | 50 x 91 = 4,550 | 6,000 | 0.443 | 0.437-0.502 | 0.74398 | 3.07e-02 | 0.74111 | 2.89e-02 |
| Meep | staircase | float64 | 0.02 | 50 | 100 x 182 = 18,200 | 12,000 | 0.965 | 0.924-0.969 | 0.77612 | 1.48e-03 | 0.77063 | 5.97e-04 |
| Meep | staircase | float64 | 0.01 | 100 | 200 x 364 = 72,800 | 24,000 | 3.197 | 3.195-3.236 | 0.77561 | 9.69e-04 | 0.77074 | 7.11e-04 |
| Meep | staircase | float64 | 0.005 | 200 | 400 x 728 = 291,200 | 48,000 | 31.316 | 27.483-34.272 | 0.77491 | 2.70e-04 | 0.77020 | 1.66e-04 |
| Meep | smoothed | float64 | 0.04 | 25 | 50 x 91 = 4,550 | 6,000 | 0.431 | 0.389-0.445 | 0.78425 | 9.62e-03 | 0.77896 | 8.93e-03 |
| Meep | smoothed | float64 | 0.02 | 50 | 100 x 182 = 18,200 | 12,000 | 1.073 | 1.016-1.137 | 0.77610 | 1.46e-03 | 0.77064 | 6.11e-04 |
| Meep | smoothed | float64 | 0.01 | 100 | 200 x 364 = 72,800 | 24,000 | 3.768 | 3.161-3.796 | 0.77512 | 4.82e-04 | 0.77050 | 4.67e-04 |
| Meep | smoothed | float64 | 0.005 | 200 | 400 x 728 = 291,200 | 48,000 | 24.005 | 23.218-26.039 | 0.77479 | 1.46e-04 | 0.77013 | 1.05e-04 |

### Equal cell count

Same mesh, therefore the same cells and steps in both solvers. Errors are for T+1 at 1.55 um and for
the band mean; time is the median full solve.

| mesh (um) | cells | steps | series | TorchFDTD float32: error 1.55 / error band / time (s) | TorchFDTD float64: error 1.55 / error band / time (s) | Meep float64: error 1.55 / error band / time (s) |
|---|---|---|---|---|---|---|
| 0.04 | 4,550 | 6,000 | staircase | 5.78e-04 / 1.10e-03 / 0.134 | 5.78e-04 / 1.10e-03 / 0.329 | 3.07e-02 / 2.89e-02 / 0.443 |
| 0.04 | 4,550 | 6,000 | smoothed | 1.00e-02 / 9.10e-03 / 0.293 | 1.00e-02 / 9.10e-03 / 0.319 | 9.62e-03 / 8.93e-03 / 0.431 |
| 0.02 | 18,200 | 12,000 | staircase | 1.48e-03 / 6.04e-04 / 0.401 | 1.48e-03 / 6.04e-04 / 0.675 | 1.48e-03 / 5.97e-04 / 0.965 |
| 0.02 | 18,200 | 12,000 | smoothed | 1.48e-03 / 6.04e-04 / 0.538 | 1.48e-03 / 6.04e-04 / 0.767 | 1.46e-03 / 6.11e-04 / 1.073 |
| 0.01 | 72,800 | 24,000 | staircase | 5.74e-04 / 2.95e-04 / 1.393 | 5.74e-04 / 2.95e-04 / 2.537 | 9.69e-04 / 7.11e-04 / 3.197 |
| 0.01 | 72,800 | 24,000 | smoothed | 4.60e-04 / 3.64e-04 / 1.718 | 4.60e-04 / 3.64e-04 / 2.679 | 4.82e-04 / 4.67e-04 / 3.768 |
| 0.005 | 291,200 | 48,000 | staircase | 1.99e-04 / 5.64e-05 / 6.936 | 1.99e-04 / 5.64e-05 / 15.072 | 2.70e-04 / 1.66e-04 / 31.316 |
| 0.005 | 291,200 | 48,000 | smoothed | 1.69e-04 / 7.17e-05 / 8.354 | 1.69e-04 / 7.16e-05 / 16.032 | 1.46e-04 / 1.05e-04 / 24.005 |

### Equal error

Cost to reach each error, as wall time / cell-steps (cells times steps). Interpolation is log-log
between the two meshes that bracket the last crossing of the target, in refinement order; every finer
point stays at or below the target. "<=" means the coarsest mesh already meets the target, so its cost
is an upper bound. "not reached" means the finest point exceeds it.

| curve | observable | error 0.01 | error 0.005 | error 0.002 |
|---|---|---|---|---|
| TorchFDTD staircase float32 | T+1 at 1.55 um | <= 0.134 s / <= 2.73e+07 | <= 0.134 s / <= 2.73e+07 | <= 0.134 s / <= 2.73e+07 |
| TorchFDTD staircase float32 | band-mean T+1 | <= 0.134 s / <= 2.73e+07 | <= 0.134 s / <= 2.73e+07 | <= 0.134 s / <= 2.73e+07 |
| TorchFDTD staircase float64 | T+1 at 1.55 um | <= 0.329 s / <= 2.73e+07 | <= 0.329 s / <= 2.73e+07 | <= 0.329 s / <= 2.73e+07 |
| TorchFDTD staircase float64 | band-mean T+1 | <= 0.329 s / <= 2.73e+07 | <= 0.329 s / <= 2.73e+07 | <= 0.329 s / <= 2.73e+07 |
| TorchFDTD smoothed float32 | T+1 at 1.55 um | <= 0.293 s / <= 2.73e+07 | 0.365 s / 5.8e+07 | 0.489 s / 1.57e+08 |
| TorchFDTD smoothed float32 | band-mean T+1 | <= 0.293 s / <= 2.73e+07 | 0.335 s / 4.32e+07 | 0.411 s / 8.72e+07 |
| TorchFDTD smoothed float64 | T+1 at 1.55 um | <= 0.319 s / <= 2.73e+07 | 0.438 s / 5.8e+07 | 0.667 s / 1.57e+08 |
| TorchFDTD smoothed float64 | band-mean T+1 | <= 0.319 s / <= 2.73e+07 | 0.387 s / 4.32e+07 | 0.521 s / 8.72e+07 |
| Meep staircase | T+1 at 1.55 um | 0.591 s / 5.89e+07 | 0.706 s / 9.48e+07 | 0.893 s / 1.78e+08 |
| Meep staircase | band-mean T+1 | 0.548 s / 4.82e+07 | 0.63 s / 6.99e+07 | 0.757 s / 1.14e+08 |
| Meep smoothed | T+1 at 1.55 um | <= 0.431 s / <= 2.73e+07 | 0.591 s / 5.61e+07 | 0.921 s / 1.54e+08 |
| Meep smoothed | band-mean T+1 | <= 0.431 s / <= 2.73e+07 | 0.525 s / 4.28e+07 | 0.717 s / 8.71e+07 |

![G7-04 accuracy against cost](figures/g7/G7-04.png)

Top row: error against the median wall time, with bars for the range of the three timed runs. Bottom
row: error against the cell count, which does not depend on the hardware. Dotted lines mark the targets.

### Observations

1. **Shared staircase.** Where the two solvers share their Ez nodes (0.02, 0.01 and 0.005 um) their staircases are identical (recorded silicon columns and rows). At 0.02 um the T+1(1.55) errors are 1.5e-03 (TorchFDTD) and 1.5e-03 (Meep). At 0.01 and 0.005 um they are 5.7e-04 and 2.0e-04 for TorchFDTD against 9.7e-04 and 2.7e-04 for Meep. At those two meshes the fixture's DFT lines fall on Ez rows instead of between them, and Meep's sum of order efficiencies at 1.55 um rises to 1.00036 and 1.00011 (TorchFDTD 0.99992 and 1.00005). A development check at 0.01 um (`readout_check.py`, records `readout_check_*.json`, not a declared quantity) that moves both lines by +h/2 onto pixel centres moves Meep's T+1(1.55) by -5.4e-04 and its order sum from 1.00036 to 0.99974 and moves TorchFDTD's by -1.2e-04 (order sum 0.99992 to 0.99978). With the moved lines the two solvers give T+1(1.55) = 0.775095 and 0.775071, a difference of 2.4e-05. The solver difference at 0.01 um therefore comes almost entirely from how each solver reads fields on a line that lies on a node row, not from the discretization. The curves keep the fixture's lines.
2. **The coarsest mesh is decided by grid registration.** At 0.04 um the 91 rows put TorchFDTD's and Meep's y nodes half a cell apart, so the 0.5 um ridges cover 13 rows in TorchFDTD and 12 in Meep, and the ridge-2 width is sampled as 5 nodes (0.20 um against 0.22 um) in both. TorchFDTD's staircase (ridges 0.02 um too tall, ridge 2 0.02 um too narrow) happens to land close to the reference: error 5.8e-04, smaller than at 0.02 um (1.5e-03). Meep's (0.02 um too short) has 3.1e-02. The staircase equal-error rows follow from this: TorchFDTD meets every target already at 0.04 um, and Meep needs about 0.02 um. This is a property of the node placement with an odd cell count, not of either solver's accuracy.
3. **Smoothed series.** The two smoothed curves track each other at every mesh: T+1(1.55) errors 1.0e-02, 1.5e-03, 4.6e-04, 1.7e-04 (TorchFDTD subpixel) against 9.6e-03, 1.5e-03, 4.8e-04, 1.5e-04 (Meep subpixel averaging). At 0.02 um every edge lies on a dual-cell face, so TorchFDTD's subpixel operator reduces to the staircase (observables equal within 2e-08). At 0.01 and 0.005 um, where the shifted staircase puts every edge midway between nodes, smoothing lowers TorchFDTD's T+1(1.55) error only slightly (4.6e-04 against 5.7e-04, 1.7e-04 against 2.0e-04); at 0.04 um both smoothed errors are about 1e-2, far above TorchFDTD's staircase error there. On this axis-aligned structure the smoothing gains little over a staircase whose edges sit midway between nodes.
4. **float32 against float64.** TorchFDTD's two precisions give the same observables within 8.6e-08 at every mesh. float64 costs 2.17 times the float32 wall time at 0.005 um (staircase) and 1.92 times (smoothed).
5. **Equal error.** For T+1(1.55) at 0.002: TorchFDTD staircase float32 at most 0.13 s, Meep staircase 0.89 s; TorchFDTD smoothed float32 0.49 s, Meep smoothed 0.92 s. In cell-steps, which does not depend on the hardware, the smoothed series need 1.57e+08 (TorchFDTD) and 1.54e+08 (Meep) for the same target, about the same grid; the wall-time ratio comes from the GPU against the CPU and says nothing about the algorithms. One entry is marginal: TorchFDTD's smoothed error at 0.04 um is 0.009997, below 0.01 by 3.2e-06; against the 241-order value it is 0.009987, so the '<=' entry at 0.01 holds either way.
6. **Equal cell count.** At the same mesh the wall times differ by the hardware and by fixed overheads: at 0.04 um (4,550 cells, 6,000 steps) TorchFDTD takes 0.134 s and Meep 0.443 s; at 0.005 um (291,200 cells, 48,000 steps) 6.94 s against 31.3 s (staircase). That is 204 million cell-steps per second for TorchFDTD at 0.04 um against 2015 million at 0.005 um (Meep 62 and 446 million): the small meshes measure fixed per-run and per-step overheads more than stepping.

### Acceptance

| Acceptance item | Result | Evidence |
|---|---|---|
| every point recorded with median and range | pass | 24 points (16 TorchFDTD, 8 Meep), each one warm-up and three timed runs; `min`, `median`, `max` and every sample in the point records |
| accuracy-versus-cost curves of both solvers rendered from the record | pass | `docs/figures/g7/G7-04.png`, rendered by `analyze.py` from `summary.json`; `tests/test_g7_solvers.py` recomputes the summary from the point records |
| cost to reach 0.01, 0.005, 0.002 by log-log interpolation per solver and series | pass | the equal-error table, for both observables, both series and both TorchFDTD precisions |
| equal-cell-count and equal-error comparisons reported separately | pass | the two tables above |
| the record states CPU against GPU and draws no algorithmic conclusion | pass | `hardware_statement` in `summary.json`, the Hardware paragraph and the figure subtitle |
| reference check of the fixture: 101 against 241 orders, every efficiency at most 1e-04 | pass | 6.4e-05; see Reference |

### Notes and open items

- Package: the TorchFDTD records come from a checkout import of this branch; the release-candidate round re-runs the TorchFDTD points with the installed wheel. The driver imports an installed torchfdtd when one exists (repository root appended to the end of `sys.path`). Every record states `torchfdtd_file`, `torchfdtd_version`, `torchfdtd_import` and the git commit. The Windows venv also holds an editable install of the main checkout; path imports take precedence over its finder, and the records name the file that ran.
- Absorber: `Region.pml_cells` is capped at 50, so the 80-cell absorber at 0.005 um (and every other mesh) is set with `BoundaryFace(kind='pml', layers=n)` on the y faces; no package change. The derived geometry notes record this.
- The two solvers do not share Ez nodes in y at 0.04 um (91 rows); their staircases differ there (13 against 12 ridge rows).
- Host load: timed runs were taken on a quiet host, each gated on a Windows host load of at most 30 % (sampled before the run and recorded in every sample). Runs first taken at 90-100 % host load (Meep resolution 25 at 4.9 s against 0.44 s quiet, TorchFDTD about 2x slower) were re-measured; their accuracy values were identical, and they are kept outside the repository. Three timed samples have no load reading (the PowerShell query returned nothing): Meep smoothed resolution 100 run 1 and TorchFDTD staircase float32 0.005 um runs 1 and 3; their times lie within the ranges of their points. No other job used the GPU during the TorchFDTD timings (GPU memory in use before every point stayed at the 1.25-1.44 GB desktop level).
- Meep runs in WSL with 4 MPI ranks on a 12-core CPU and TorchFDTD on the GPU; the cost ratio compares these two setups only.

### Reproduce

From the repository root. The timed runs need an otherwise idle GPU and host; the TorchFDTD and TORCWA runs
use CUDA, and Meep runs with MPI (here in a Linux environment under WSL).

```bash
# reference: a Python environment with TORCWA 0.1.4.2 (CUDA)
python examples/g7/solvers/rcwa_reference.py
# TorchFDTD, four calls: --series staircase|smoothed, --precision float32|float64
python examples/g7/solvers/torchfdtd_sweep.py --series staircase --precision float32 --max-host-cpu-percent 30
# Meep 1.34, two calls: --series staircase|smoothed
OMP_NUM_THREADS=1 mpirun -np 4 python examples/g7/solvers/meep_sweep.py --ranks 4 --series staircase --max-host-cpu-percent 30
# analysis, tables and figure (reads records only)
python examples/g7/solvers/analyze.py
# tests: fast checks, then the acceptance check from the committed records
python -m pytest tests/test_g7_solvers.py
TORCHFDTD_G7_FULL=1 python -m pytest tests/test_g7_solvers.py
```
