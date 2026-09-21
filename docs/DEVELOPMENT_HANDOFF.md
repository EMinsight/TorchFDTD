# Development handoff

The latest real state of the completion program, written at the end of every
working session as [COMPLETION_PROGRAM_KO.md](COMPLETION_PROGRAM_KO.md)
section 13 requires. Each entry records the commit, the changed files, the
exact commands, the devices, the measurements, what passed, failed, skipped or
was not run, the evidence paths, the blockers and the first command of the next
session. Nothing here promises that a later session runs automatically.

## Entry format

```
### <date> <stage/task ids> at <commit>
Problem or goal:
Changed files (why):
Commands run (device):
Measurements and pre-declared limits:
Passed / failed / skipped / not run:
Evidence paths and hashes:
Remaining defects, risks, external blockers:
Next first command and task id:
```

---

### 2026-09-21 G0-01 to G0-05 (evidence and gate infrastructure), branch completion-gates from f3efd34

**Problem or goal.** Adopt the owner's completion package (2026-09-21,
MASTER_PROMPT_KO.md SHA-256 `f410a65dfbb906f92ff6111bc049f3d3a64761dc9e851b86e2f2e9f21c998ff4`,
completion_checklist.json SHA-256 `e1244686b4992b0718ce24c36efbe2d3c8c710260ebc6c2be962d1ded32d02a3`)
as the specification of record, connect the gate file, the case and run
directories and the release-scope document, and build a recorder and a judge
that refuse hand-written VERIFIED states.

**State found.** HEAD f3efd34 on branch completion-gates, clean tree, no
uncommitted work from an earlier agent. The package's planning snapshot
2b8f493 is an ancestor of HEAD; commits since then are ca79616 (README rows and
quick start, G1-06), f6deadb (manuscript wording) and f3efd34 (quadrant
allocation scaling, G1-03).

**Changed files (why).**
- `docs/COMPLETION_PROGRAM_KO.md`: the master prompt verbatim with a two-line header (`tail -n +4` reproduces the package hash).
- `docs/COMPLETION_PLAN_KO.md`: one section pointing to the program, the gate file, the scope, cases, runs and this file.
- `docs/validation/completion_gates.json`: the checklist adopted with `kind` `completion_gates`, `adopted_commit` f3efd34, `specification_of_record`, a `required_tests` list on every task, code paths for G0, G1, G5-07 to G5-09, G8-05, G9-01 to G9-03 and H1-01 to H1-03, `implementation_state` IMPLEMENTED for G0-01 to G0-05, G1-03 (fixed in f3efd34) and G1-06 (README in ca79616), the two-GPU blocker on H1-02 to H1-06. Every `verification_state` is NOT_RUN.
- `docs/RELEASE_SCOPE.md`: WORKSTATION and HPC rows with implemented versus verified columns; HPC BLOCKED_EXTERNAL.
- `docs/validation/cases/README.md`, `docs/validation/cases/G1-03_quadrant_allocation_scaling.json`: case format and the first pre-declared case.
- `docs/validation/runs/README.md`: run directory layout and the recorder's decision table.
- `scripts/release_audit.py`: `file_sha256` helper extracted from the inline hash so the gate tools share it.
- `scripts/record_gate_evidence.py`: the recorder. `scripts/check_release_gates.py`: the judge.
- `tests/test_release_gates.py`: 18 failure-injection tests on a temporary git repository.

**Commands run (device: local Windows 11, 12th Gen Intel Core i7-12700, RTX 3060 12 GB, driver 591.86, Python 3.10.2, torch 2.10.0+cu126, CuPy 13.6.0; TMP and TEMP set to D:\TorchFDTD\.local\tmp).**

```
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_release_gates.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_detector_allocation.py --junitxml=D:/TorchFDTD/.local/tmp/junit_probe.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --profile HPC
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G1-03
```

**Measurements.** tests/test_release_gates.py: 18 passed, 0 failed, 0 skipped
in 18.42 s on the final run (an earlier run took 30.11 s, and the first run
with a cold torch import took 67.66 s and exposed one test bug, fixed before
commit). tests/test_detector_allocation.py: 26 passed,
0 skipped, 9.76 s, CUDA instances ran on the RTX 3060. The judge exits 1 on
both profiles with 77 (WORKSTATION) and 83 (HPC) tasks judged, 0 pass, all
NOT_RUN, and the H1 rows report the two-GPU blocker. A dry run of the recorder
on the real tree produced a VERIFIED evidence record for G1-03 in 5.4 s; it was
deleted and the gate file regenerated because the tree was dirty with the new
scripts and the integrator, not this session, records gate evidence.

**Passed / failed / skipped / not run.** Passed: the 18 gate tests and the 26
allocation tests above. Failed: none. Skipped: none. Not run: every gate task
remains NOT_RUN by design; no evidence directory exists under
docs/validation/runs yet.

**Evidence paths and hashes.** None recorded in the gate file. The JUnit of the
allocation run is a scratch file, D:/TorchFDTD/.local/tmp/junit_probe.xml,
SHA-256 `7e69d223bbfa66500b6745a23c20609eb44ff11cc7bb5cfb67300c4ba6f586c9`,
executed 2026-09-21T22:42:38+09:00 at f3efd34 with the new scripts untracked.

**Remaining defects, risks, external blockers.**
- HPC: BLOCKED_EXTERNAL, no two-GPU host (blocker text on H1-02 to H1-06).
- G1-01, G1-02, G1-04 and G1-05 are being worked on in separate worktrees; their gate rows stay NOT_ASSESSED until those fixes merge.
- G1-03 has a pre-declared case with three `not_yet_covered` items (amplitude 1e-8, nonuniform areas/frequencies/phases at DFT scale, whole-source scale invariance) that need tests before the task is complete against the specification.
- The gate file's profile `scope_status` is still DRAFT_PENDING_RECONCILIATION_WITH_EXISTING_REQUIREMENTS; the judge prints it and does not fail on it.
- The recorder hashes the working tree of tracked files; a run recorded on a dirty tree is warned about, not rejected.

**Next first command and task id.** After merging this branch, record the
G0 evidence and then start G1-01:

```
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_release_gates.py --junitxml=D:/TorchFDTD/.local/tmp/junit_release_gates.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G0-05 --command "D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_release_gates.py --junitxml=D:/TorchFDTD/.local/tmp/junit_release_gates.xml" --junit D:/TorchFDTD/.local/tmp/junit_release_gates.xml --exit-code 0
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G0-05
```

Then G1-01: run `tests/test_adjoint_planes.py` and `tests/test_plane_execution.py`
with `--junitxml`, reproduce the graded-mesh regeneration on the current
candidate, and record the result.

---

### 2026-09-22 G3-04, G3-05, G3-08, G3-13 (Mie cylinder/sphere, Drude sphere, Bloch grating against RCWA, curved interfaces), branch g3-fixtures-b from 2b64f91

**Problem or goal.** Declare, run and record four independent physics
fixtures of stage G3 with criteria fixed before the judged runs: the Mie
cylinder (2D, TM and TE, plus one resonant size parameter) and sphere (3D),
a Drude metal sphere at three radii with a mesh sequence h, h/2, h/4, a
Bloch-periodic binary grating against TORCWA at normal and 20-degree
incidence, and the curved-interface convergence study (staircase and
subpixel mesh sequences, sub-cell shifts, differentiable-solid smoothing width).

**State found.** HEAD 2b64f91 on branch g3-fixtures-b, clean tree, no
uncommitted work from an earlier agent.

**Changed files (why).**
- `docs/validation/cases/G3-04_mie_cylinder_sphere.json`, `G3-05_drude_sphere.json`, `G3-08_bloch_grating_rcwa.json`, `G3-13_curved_interface_convergence.json`: the pre-declared fixtures, references, observables and limits. Three sanity-check definitions were corrected before the recorded runs after the fast suite exposed them (the empty-cell limit at 20 degrees follows the program's oblique PML target, the Drude inner/outer check is normalised to the band maximum, the vanishing smoothing width keeps the documented half value on contour samples); each correction is stated in the case notes. No judged limit was changed.
- `tests/test_physics_g3_b.py` (commit 84cc2bd): fixtures, the infinite-cylinder Mie series and the complex-index Bohren-Huffman series (checked against the optical theorem, the small-size limits and the repository's real-index series), measurements and tests. The fast suite runs the coarse meshes in about five minutes; `TORCHFDTD_G3_FULL=1` adds the judged meshes and the recorded-only rows; `TORCHFDTD_G3_RECORD=<dir>` writes one JSON record per task. No pytest marker was registered because pyproject.toml is shared with the other G3 branch.
- `benchmarks/g3_torcwa_grating.py`, `docs/validation/g3/G3-08_torcwa_reference.json`: the TORCWA 0.1.4.2 oracle (Kim and Lee, Comput. Phys. Commun. 282, 108552, 2023) run in the C:/anaconda3 interpreter, complex128, harmonics 20 to 640; the TE sequence changes by at most 6.6e-8 at the last doubling, the TM sequence (Laurent rule) by 4.1e-4 in efficiency and 1.1e-3 rad in phase.
- `benchmarks/render_g3_b.py`, `docs/PHYSICS_VALIDATION.md`, `docs/validation/g3/G3-0X.json` and `G3-0X_observed.json` (commit 487de42): records of the full runs and the rendered sections between the `g3-b:<task> begin/end` comment markers.
- `docs/validation/completion_gates.json` (metadata in 84cc2bd, states in f5160dd), `docs/validation/runs/20260921T1819*-g3-*`: gate metadata and evidence.

**Commands run (device: local Windows 11, i7-12700, RTX 3060 12 GB shared with other agents, Python 3.10.2, torch 2.10.0+cu126; TMP and TEMP set to D:/TorchFDTD/.local/tmp; TORCWA in C:/anaconda3 Python 3.12, torch 2.6.0+cu118 on the CPU).**

```
C:/anaconda3/python.exe benchmarks/g3_torcwa_grating.py --output docs/validation/g3/G3-08_torcwa_reference.json
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_b.py
TORCHFDTD_G3_FULL=1 TORCHFDTD_G3_RECORD=docs/validation/g3 D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_b.py -k g3_04 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-04.xml
    (the same with -k g3_05, -k g3_08 and -k g3_13)
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.render_g3_b
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G3-04 --command "<the command above>" --junit D:/TorchFDTD/.local/tmp/junit/G3-04.xml --exit-code 0 --fixture docs/validation/cases/G3-04_mie_cylinder_sphere.json --observed docs/validation/g3/G3-04_observed.json --artifact docs/validation/g3/G3-04.json --scope "<layers and devices>"
    (the same for G3-13 with exit code 0 and for G3-08 and G3-05 with exit code 1)
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G3-04
```

**Measurements and pre-declared limits.** The four full runs executed
concurrently from 01:48 to 03:18 KST; wall times in the records are not
performance measurements.
- G3-04 (limit 2 percent at the judged mesh): cylinder TM 3.83, 5.12, 1.74 percent at h = 0.05, 0.025, 0.0125 um (judged 1.74, pass, non-monotone); TE 11.16, 0.70, 0.37 percent (pass); sphere 9.59, 0.31, 1.05 percent at h = 0.1, 0.05, 0.025 um (judged 0.31 at 48^3, pass; the 96^3 CPU FP64 row is 1.05, non-monotone as in the earlier TFSF report). Resonance of the 0.25 um n = 3.5 TE cylinder at h = 0.0125 um: peak 1.1299 um against Mie 1.1365 um (-0.58 percent, limit 1 percent), FWHM 0.0691 against 0.0653 um (+5.7 percent, limit 15 percent), pass; at h = 0.025 um the errors are -1.33 and +19 percent. Layer A CUDA FP32 against CPU FP64: at most 2.1e-6 (limit 1e-4).
- G3-05 (fixture budgets at h/4 = 0.005 um: scattering 50/30/20 percent, absorption 100/60/40 percent for r = 20/35/50 nm): scattering 138/46/45 percent, absorption 673/499/345 percent; FAIL for every radius. Mesh sequence of the scattering error: 1658, 271, 138 percent (20 nm), 478, 69, 46 (35 nm), 85, 64, 45 (50 nm); the absorption error at the long-wavelength end of the band does not decrease with the mesh. Peak positions converge (20 nm: 0.420, 0.386, 0.376 um against Mie 0.374). The Mie result with the ADE-sampled permittivity differs from the continuum by at most 1 percent, so the error is the staircased grid, not the time discretisation. Inner and outer scattered powers agree within 0.32 percent of the band maximum. Layer A at most 7.0e-5.
- G3-08 (efficiency error 0.01, dominant-order phase 0.02 rad, balance 0.01): all twelve judged rows (subpixel, h = 0.005 um, 300 fs, CUDA FP32) pass with efficiency errors at most 0.0031, dominant phase errors at most 0.0143 rad and sums of T and R within 0.007 of one. Staircase controls at normal incidence fail the TE phase limit at both meshes (0.068 and 0.033 rad, an O(h) half-cell asymmetry of the ridge on the Yee sub-lattices) while their efficiencies stay within 0.0071; the 150 fs control raises the TE efficiency error from 0.0009 to 0.0023. Empty cell: T0 = 1 - 3.8e-12 at normal incidence and 1 - 2.7e-6 at 20 degrees on CPU FP64. Layer A at h = 0.01 um: eleven of twelve configurations within 1e-4; TM 20 degrees 0.92 um is 1.15e-4 (an absolute 2.6e-6 on a reflected zero-order efficiency of 0.0224) against the declared rtol 1e-4 with atol 0, so the task is FAILED. The program's own pair rtol 1e-4, atol 1e-6 would accept it; a corrected case is a new case file, not an edit.
- G3-13 (pass item: subpixel error at h below staircase error at h): TM 1.00 against 3.83 percent, TE 1.97 against 11.16 percent, pass. Order estimates: staircase TM -0.42 then 1.56, TE 4.00 then 0.91; subpixel TM 1.98 then 1.97, TE 2.12 then 2.10. Subpixel at h beats the staircase at h/2 for TM (1.00 against 5.12 percent) but not for TE (1.97 against 0.70 percent), at lower wall time in both cases. Centre shifts of 0, h/4, h/2 change the staircase error by 2.1 (TM) and 8.9 (TE) percentage points and the subpixel error by 0.19 and 0.04. Smoothing width at h = 0.05 um: TM error 1.34, 1.34, 0.64, 0.83, 0.42, 1.82 percent and TE 11.16, 6.23, 3.99, 1.90, 4.61, 8.71 percent for w/h = 1e-6, 1/8, 1/4, 1/2, 1, 2; the vanishing width differs from the staircase only on the four Ez nodes on the contour (2.7 percent of the TM width, zero for TE).

**Passed / failed / skipped / not run.** Fast suite: 25 passed, 20 skipped
(the skips are the judged meshes behind TORCHFDTD_G3_FULL), 304 s. Full runs:
G3-04 8 passed (2098 s); G3-13 5 passed (452 s); G3-08 27 passed, 1 failed
(test_g3_08_grating_cuda_layer_a[TM-20.0-0.92], 3467 s); G3-05 1 passed,
3 failed (test_g3_05_drude_sphere[0.02], [0.035], [0.05], 5391 s). Nothing
skipped in the full runs. Not run: nothing declared was left out.

**Evidence paths and hashes.** Runs 20260921T181942Z-g3-04-b95d2106
(VERIFIED), 20260921T181945Z-g3-13-ecfade50 (VERIFIED),
20260921T181948Z-g3-08-6ccad85a (FAILED), 20260921T181951Z-g3-05-8fafa59e
(FAILED), all at source commit 487de42 with an empty dirty manifest; the
record SHA-256 prefixes are G3-04 2396c2a9f5c85820, G3-05 34b3d7927bd9f9e4,
G3-08 b3031295d7f789f6, G3-13 805292c474b7a1fb, with full hashes in each
evidence.json. The judge passes G3-04 and G3-13 and fails G3-05 and G3-08.

**Remaining defects, risks, external blockers.**
- G3-05: a staircased Drude sphere at 4 to 10 cells per radius does not reach even the loose budgets; the absorption tail error grows toward 0.45 um. A conformal or subpixel dispersive interface, or a finer sequence (h/8 needs 192^3 cells), is required before any metallic-sphere accuracy claim.
- G3-08: the physics passes; the single layer-A miss is 1.15e-4 against rtol 1e-4 with atol 0 on a 0.022 efficiency. A new case with the program's atol 1e-6 and a rerun would resolve it; TORCWA's Laurent-rule TM oracle carries about 4e-4 uncertainty, well inside the 0.01 limit.
- G3-04 and G3-13: the staircase interface is non-monotone and registration-sensitive on curved surfaces; subpixel is second order on this cylinder but not better than the staircase at h/2 for TE.
- docs/PHYSICS_VALIDATION.md: both G3 branches create this file and both renderers rewrite only their own marked regions (`<!-- g3-a begin -->` ... `<!-- g3-a end -->` from `scripts/render_physics_validation.py` on g3-fixtures-a at 080303f; `<!-- g3-b:<task> begin -->` ... `<!-- g3-b:<task> end -->` per task from `benchmarks/render_g3_b.py` here), appending their region when the markers are absent. The integrator resolves the add/add conflict by keeping one header and both marked regions in any order; either script can then be rerun without touching the other's region. The fine-mesh gate is `TORCHFDTD_G3_FULL` here and `TORCHFDTD_G3_FINE` on g3-fixtures-a; renaming after the recorded runs would change the test source and stale the four evidence runs, so both names stay.

**Next first command and task id.** After merging, decide whether to add the
corrected G3-08 layer-A case and rerun the G3-08 selection, then continue with
the remaining G3 tasks:

```
TORCHFDTD_G3_FULL=1 TORCHFDTD_G3_RECORD=docs/validation/g3 D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_b.py -k g3_08 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-08.xml
```
