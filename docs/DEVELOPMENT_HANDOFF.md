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

### 2026-09-22 G2-03 and G2-04 (capability registry and pairwise combination tests), branch g2-registry from 2b64f91

**Problem or goal.** State the admitted and rejected combinations of the
solver contract as data, generate the documents and the workbench tables from
it, and check it against the code with a risk-based pairwise design in which
every rejected input is refused with a concrete reason before any field is
allocated.

**State found.** HEAD 2b64f91 on branch g2-registry, clean tree, no earlier
partial work.

**Changed files (why).**
- `torchfdtd/capabilities.py`: the registry. Nine axes (dimension, mesh, material, boundaries, source, monitor, execution, precision, backend; 211,680 combinations), the scene recipe `example_project(config)` (one Project per combination), 86 ordered rejection rules with code path, exception and exact message prefix (13 schema, 4 unavailable, 63 entry, 2 run, 4 post-processing), 25 admitted lanes with entry point and test, `verdict()`, `pair_tables()` and `registry_json()`.
- `scripts/build_capability_tables.py`, `docs/CAPABILITIES.md`, `torchfdtd/capabilities.json`: renderer and its outputs (36 axis-pair support tables, lanes, rules); `--check` reports stale files.
- `torchfdtd/server.py`, `pyproject.toml`: `/api/capabilities` returns the Lumerical inventory plus `combinations`; the JSON ships as package data.
- `frontend/src/capabilities.js`, `frontend/src/style.css`, `torchfdtd/web/*`: the checklist dialog shows the axis-pair grid with rule tooltips (bundle rebuilt with the repository's vite); `tests/ui/capability-combinations.spec.js` covers it.
- `docs/FEATURE_CHECKLIST.md`, `benchmarks/build_feature_inventory.py`: one line linking the Lumerical inventory to the tables; the inventory itself is unchanged.
- `tests/test_capability_pairs.py`: the pairwise covering array (54 cases, all 660 value pairs), 89 rule/lane coverage cases, four high-risk combinations, static code-path checks, rendered-file and API checks.
- `torchfdtd/solver.py`, `torchfdtd/differentiable.py`, `torchfdtd/tensor_batch.py`: three refusals moved before field allocation with unchanged messages (fused kernel on Bloch fields in `Simulation.run`; plane source reaching a stored PMC face in `_System.__init__` and in `run_tensor_batch`) and one missing refusal added (`run_tensor_batch` with a tensor material). `tests/test_cuda_kernels.py`, `tests/test_pmc_general.py`, `tests/test_tensor_batch.py` assert them with CUDA allocation checks.
- `docs/validation/cases/G2-03.json`, `docs/validation/cases/G2-04.json`, `docs/validation/completion_gates.json`: declared criteria, code paths, required tests, notes; evidence recorded by the recorder.

**Commands run (device: local Windows 11, i7-12700, RTX 3060 12 GB shared with other agents, Python 3.10.2, torch 2.10.0+cu126, CuPy 13.6.0; TMP and TEMP set to D:\TorchFDTD\.local\tmp).**

```
D:/TorchFDTD/.venv/Scripts/python.exe scripts/build_capability_tables.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_capability_pairs.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G2-03.xml -p no:warnings
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_capability_pairs.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G2-04.xml -p no:warnings
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G2-03 ... --fixture docs/validation/cases/G2-03.json
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G2-04 ... --fixture docs/validation/cases/G2-04.json
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G2-03   (and --task G2-04)
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_differentiable.py tests/test_pmc_general.py tests/test_pmc_dispersive.py tests/test_streamed_admission.py tests/test_complex_streamed.py tests/test_tensor_batch.py tests/test_cuda_kernels.py tests/test_api.py tests/test_solver.py tests/test_mode_injection.py tests/test_oneway_sources.py tests/test_adjoint_planes.py tests/test_dispersive_adjoint.py tests/test_pmc_cuda.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_streamed_geometry.py tests/test_streamed_density.py tests/test_mode_streamed_injection.py tests/test_reversible_cpml_planes.py tests/test_tiled.py tests/test_source_adjoint.py tests/test_streamed_dispersive.py tests/test_streamed_tensor.py
playwright test tests/ui/frequency.spec.js tests/ui/priorities.spec.js tests/ui/capability-combinations.spec.js   (against torchfdtd serve)
```

**Measurements and pre-declared limits.** Registry over the full product:
11,878 admitted and 199,802 rejected combinations, 0 unused entries (limit:
0). tests/test_capability_pairs.py: 151 passed, 0 failed, 0 skipped, in
109.3 s (G2-03 run) and 97.8 s (G2-04 run); 143 combination cases (25
admitted, 118 rejected, 97 on CUDA) plus 4 high-risk cases and 4 static
tests; 0 disagreements (limit: 0). Development probes outside the test:
49,440 CPU combinations (all uniform/graded/explicit float32, all uniform
float64, a 2,400 sample of graded/explicit float64) and 2,400 uniform CUDA
combinations agreed with the registry after the rules were fixed. Touched
suites: 220 passed (first batch) and 109 passed (second batch); UI specs 4
passed.

**Passed / failed / skipped / not run.** Passed: everything listed above.
Failed: none at commit. Skipped: none. Not run: the full test suite and the
remaining UI specs; graded/explicit CUDA combinations were not probed
exhaustively and are covered by the covering-array cases only.

**Evidence paths and hashes.** Runs
`docs/validation/runs/20260921T171604Z-g2-03-53e2e466` and
`docs/validation/runs/20260921T171624Z-g2-04-481b2694`, both at source
commit bca0a7b with an empty dirty manifest; both tasks VERIFIED and judged
PASS. Cases `docs/validation/cases/G2-03.json` and `G2-04.json`.

**Remaining defects, risks, external blockers.**
- The registry describes project-declared scenes. `TensorDielectricSimulation` and `TensorDispersiveSimulation` also accept FP64 node tensors and PEC walls on projects without a tensor material; those are notes on the rules, not axis values.
- `project_farfield` (differentiable) accepts non-isolated six-plane sets that `native_radiation_box` rejects after a run; recorded as post-processing rules, not changed.
- A frequency plane touching a PEC or antisymmetric upper wall passes the schema and is refused later by `interpolation_map` (after the Yee grid exists in the forward path); the recipe keeps planes one cell inside such walls. A clipped last tile smaller than five interior cells fails in `plan_tiles` with the generic mesh message. `Material(model='tensor', poles=[...])` and other non-multipole models silently ignore `poles` (the UI keeps the pole list across model changes, so a schema rejection would break that flow). The native tensor forward ignores `cuda_kernel='fused'` with a warning in the summary; `run_tensor_batch` always runs the fused batch kernel. None of these were changed.
- `ModeNetwork` revalidates the moved timing source before checking its kind, so a point or TFSF template on open ports fails with the moved copy's schema message.
- The covering array is seeded; editing the registry changes the coverage cases, and `registry_json()` re-evaluates the full product (about 3 s idle, longer under load).

**Next first command and task id.** Merge g2-registry, then G2-05:

```
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G2-03
D:/TorchFDTD/.venv/Scripts/python.exe scripts/build_capability_tables.py --check
```
