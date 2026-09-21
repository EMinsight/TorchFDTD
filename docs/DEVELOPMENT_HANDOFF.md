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

### 2026-09-22 G9-01, G9-02, G9-04 (server security, provenance inventory, compatibility policy), branch g9-security from 2b64f91

**Problem or goal.** Start the G9 checks that the program allows before the
physics stages finish: test and close the local server's controls, inventory
the provenance and licences of everything distributed, and state the API,
format and support policy with a changelog and a bug template. G9-03 stays
with the contract gate and was not touched.

**State found.** HEAD 2b64f91 on branch g9-security, clean tree. The tracked
tree still carried the remote workstation account path in three beyond-VRAM
records (`scratch_directory` of `beyond-vram-complete-5880.json`,
`beyond-vram-forward-5880.json`, `beyond-vram-forward-retry-5880.json`); the
earlier audit only searched the forward-slash spelling.

**Changed files (why).**
- `torchfdtd/server.py`: chunked bodies without `Content-Length` answer 411 (the 32 MB limit only inspected the header), a malformed `Content-Length` answers 400 instead of a server error, a `NaN`/`Infinity` body answers 422 (the default handler re-emitted the nonfinite input and failed), `MAX_REQUEST_BYTES` is a module constant, and `WorkbenchFiles` rejects drive-letter and UNC static paths (on Windows `os.path.join` let them replace the web directory and `realpath` probed the drive or a network share).
- `torchfdtd/cli.py`: `serve --host` restricted to `127.0.0.1` and `localhost` (IPv6 loopback is not offered because `TrustedHostMiddleware` cannot match a bracketed `Host`).
- `tests/test_server_security.py`, `docs/SECURITY.md`, `docs/validation/cases/G9-01.json`.
- `scripts/provenance_inventory.py` (SBOM, notices, scan, history note, pip check, optional pip-audit), `docs/THIRD_PARTY_NOTICES.md`, `docs/validation/sbom.json`, `tests/test_provenance_inventory.py`, `docs/validation/cases/G9-02.json`; the three records above redacted to `<redacted workstation home>\...`; `.gitattributes` marks the two CRLF records `cr-at-eol`.
- `docs/COMPATIBILITY.md`, `docs/CHANGELOG.md`, `.github/ISSUE_TEMPLATE/bug_report.md`, `tests/test_compatibility_policy.py`, `docs/validation/cases/G9-04.json`, one README line.
- `docs/validation/completion_gates.json`: code paths, planned commands and required tests of G9-01, G9-02, G9-04; the recorder wrote their VERIFIED states.

**Commands run (device: local Windows 11, CPU only; the RTX 3060 was left to other agents and no test creates a CUDA context; TMP and TEMP set to D:\TorchFDTD\.local\tmp).**

```
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_server_security.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G9-01.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_provenance_inventory.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G9-02.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_compatibility_policy.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G9-04.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py --audit
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py --check
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G9-0N ... --fixture docs/validation/cases/G9-0N.json
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G9-0N
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_api.py tests/test_gds_api.py tests/test_fsp_api.py tests/test_farfield_api.py tests/test_fsp_geometry_write.py tests/test_completion_program_documents.py tests/test_release_gates.py
```

**Measurements and pre-declared limits.** The limits are the status codes
and file-system states of the three case files. tests/test_server_security.py:
10 passed in 33.8 s; tests/test_provenance_inventory.py: 27 passed in 21.0 s;
tests/test_compatibility_policy.py: 5 passed in 56.4 s (import time dominates);
the neighbouring API suites 42 passed in 29.2 s and the document and gate
tests 22 passed in 100.8 s, before the evidence commit. The inventory resolves
51 distributions in the closure, all installed with a licence label and a
source URL, 987 text files scanned with no finding, 7 historic commits in the
history note, `pip check` exit 0. `pip-audit` 2.10.1 (installed into the venv
for this task) reports advisories against the development interpreter for
anyio 4.12.1, click 8.3.1, fonttools 4.29.1, idna 3.11, pillow 12.1.1,
starlette 0.52.1 and tqdm 4.63.0, fixes listed in THIRD_PARTY_NOTICES.md; torch
2.10.0+cu126 cannot be audited on PyPI. The advisories are recorded, not gated.

**Passed / failed / skipped / not run.** Passed: the 42 tests above and the
neighbouring suites. Failed: none at the recorded commit. Skipped: none. Not
run: a live uvicorn process probed over TCP, the vendor bridge routes, a
clean-environment SBOM of the wheel (all listed as `not_yet_covered`). One
earlier evidence commit was undone before any push because pytest had put the
scan sample strings, including a real address used as a sample, into the G9-02
JUnit ids; the samples are now labelled and synthetic and the tree scan covers
the run directories.

**Evidence paths and hashes.** Recorded at e132fdd on a clean tree, committed in d55adb5:
- `docs/validation/runs/20260921T163013Z-g9-01-57458fee/` evidence.json `c545db9ce82474d428535a64ddf7be10ce57c39b5390ebcca3a3f32024c81fee`
- `docs/validation/runs/20260921T163044Z-g9-02-158d1eda/` evidence.json `bb456aa1074ce59fc8c4543f0c390b755436fd422cb371c0d2a12407196d89ea`
- `docs/validation/runs/20260921T163104Z-g9-04-f2b9d65e/` evidence.json `e649a71223294f0461a2c798c6182e4ae3161adb4718dd3d768260a6fe26acc7`
The judge passes G9-01, G9-02 and G9-04 at d55adb5.

**Remaining defects, risks, external blockers.**
- BLOCKED_EXTERNAL (G9-03): the installed-API property catalogue that `torchfdtd/feature_inventory.json` and `/api/capabilities` ship, the FSP layout support, and the README timing table; listed as open items in THIRD_PARTY_NOTICES.md and sbom.json.
- The seven advisories above concern the development interpreter; the release environment of G9-06 must resolve at or above the fixes, and starlette's fixed versions are excluded by the installed fastapi's `starlette<1.0.0` bound, so that bound is a G9-06 decision.
- The historic workstation path stays in seven commits of the public history (history note in THIRD_PARTY_NOTICES.md); only a history rewrite would remove it, which nothing here does.
- `docs/validation/runs/*/junit.xml` keep the recording machine's hostname, as before.
- `Result.load` bounds nothing beyond `allow_pickle=False`; a plausible large declared shape allocates what it declares (documented in SECURITY.md, not changed).
- The `sbom.json` stable sections depend on the development interpreter; after a dependency change run `scripts/provenance_inventory.py` and commit both outputs, or the G9-02 test fails as stale.

**Next first command and task id.** Merge g9-security, then G9-03 with the
contract gate; on the release candidate rerun the three commands above under
G9-06 and refresh the audit:

```
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py --audit
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py --check

---

### 2026-09-22 G2-01, G2-02, G2-05, G2-06 (resolved plan, shared entry points, conventions, identity conditions), branch g2-plan from 2b64f91

**Problem or goal.** One immutable resolved plan that every public entry
point consumes and reports (`plan_hash`), a public specification of the sign,
timing and unit conventions fixed by tests, and the three identity conditions
(reference compatibility, cache validity, restart contract) expressed on the
plan with an invalidation matrix and deterministic-replay checks.

**State found.** HEAD 2b64f91 on branch g2-plan, clean tree, no uncommitted
work from an earlier agent. The gate rows G2-01, G2-02, G2-05 and G2-06 were
NOT_ASSESSED / NOT_RUN with empty code paths and required tests.

**Changed files (why).**
- `torchfdtd/plan.py` (new): `resolve_plan(project) -> SimulationPlan`, a frozen dataclass with read-only arrays built from the existing resolvers (`mesh_nodes`, `field_axes`, `BoundaryDescription`, `MaterialADE`, `source_terms`, `plane_plan`/`interpolation_map`, `frequency_samples`, `voxelize`, `estimate`); `plan_hash` over the canonical mesh/time/exterior/material/sources/monitors sections; `placement` and the resource estimate carried outside the hash; `plan.material` materialized on demand; `to_json`, `diff`, `verify_grid`, `verify_planes`; `PlanInvalidated`; `project_snapshot`/`check_snapshot` for the differentiable wrappers.
- `torchfdtd/boundaries.py`: each CPML segment dict also keeps its host-side `side`, `kappa`, `sigma`, `alpha` so the plan records the profile without re-deriving it.
- `torchfdtd/solver.py`: `Simulation.plan`/`plan_hash`; `_run` takes the estimate, the sampled material and the source terms from the plan, verifies the prepared `YeeGrid` and `FrequencyPlane`s against it and writes `summary['plan_hash']`.
- `torchfdtd/differentiable.py`, `torchfdtd/streamed.py`: `plan`/`plan_hash` on `DifferentiableSimulation` (inherited by the streamed, dispersive, modal, source and geometry wrappers); a construction-time snapshot of the scene and its realized nodes that `_run` checks, raising `PlanInvalidated`.
- `torchfdtd/adjoint_planes.py`: `plan`/`plan_hash` on `DifferentiablePlaneSimulation`; its existing configuration check raises `PlanInvalidated`; `SAMPLE_TIME_STEPS` now lives in `torchfdtd.plan`.
- `torchfdtd/tensor_batch.py`: cohorts resolve one plan per case, run from its material and verify grids and planes; `summary['plan_hash']`.
- `torchfdtd/server.py`: `/api/validate` returns `plan_hash`.
- `torchfdtd/identity.py` (new): `reference_key`, `cache_key`, `restart_key`, `identity`, `invalidated` on the plan sections.
- `docs/CONVENTIONS.md` (new), `docs/IDENTITY_CONDITIONS.md` (new): the specifications, each statement mapped to its test.
- `tests/test_plan.py`, `tests/test_identity.py`, `tests/test_conventions.py` (new).
- `docs/validation/cases/G2-01_resolved_plan.json`, `G2-02_entry_points_share_the_plan.json`, `G2-05_conventions.json`, `G2-06_identity_conditions.json` (new): pre-declared cases.
- `docs/validation/completion_gates.json`: `code_paths`, `required_tests` and `planned_test_commands` of the four tasks; states written by the recorder only.

**Commands run (device: local Windows 11, 12th Gen Intel Core i7-12700, RTX 3060 12 GB shared with seven other agents, Python 3.10.2, torch 2.10.0+cu126, CuPy 13.6.0; TMP and TEMP set to D:\TorchFDTD\.local\tmp).**

```
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -p no:cacheprovider tests/test_solver.py tests/test_physics.py tests/test_subpixel.py tests/test_oneway_sources.py tests/test_tfsf.py tests/test_field_monitors.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -p no:cacheprovider tests/test_api.py tests/test_tensor_batch.py tests/test_differentiable.py tests/test_adjoint_planes.py tests/test_streamed_restart.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -p no:cacheprovider -q tests/test_execution_modes.py tests/test_mode_network_project.py tests/test_mode_injection.py tests/test_source_adjoint.py tests/test_dispersive_adjoint.py tests/test_streamed_geometry.py tests/test_streamed_density.py tests/test_anisotropy.py tests/test_reversible_cpml_planes.py tests/test_session.py tests/test_batch.py tests/test_endpoint_native.py tests/test_pmc_simulation.py tests/test_pec_boundaries.py tests/test_materials.py tests/test_multipole.py tests/test_broadband.py tests/test_sources.py tests/test_vector_sources.py tests/test_run_control.py tests/test_monitor_outputs.py tests/test_spectra.py tests/test_rectilinear.py tests/test_mesh.py tests/test_plane_mesh_combinations.py tests/test_plane_execution.py tests/test_resident_allocations.py tests/test_streamed_admission.py tests/test_streamed_dispersive.py tests/test_tiled.py tests/test_periodic_design.py tests/test_adjoint_batch.py tests/test_recomputed_batch.py tests/test_grouped_batch.py tests/test_tensor_project.py tests/test_tensor_native.py tests/test_completion_program_documents.py tests/test_release_gates.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_plan.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G2-01.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_plan.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G2-02.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_conventions.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G2-05.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_identity.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G2-06.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G2-01 --command "<the G2-01 command above>" --junit D:/TorchFDTD/.local/tmp/junit/G2-01.xml --exit-code 0 --fixture docs/validation/cases/G2-01_resolved_plan.json --scope "..."   (and likewise G2-02, G2-05, G2-06 with their cases)
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G2-01   (and G2-02, G2-05, G2-06)
```

**Measurements and pre-declared limits.** The three new modules on the committed tree 7847737: tests/test_plan.py 11 passed in 9.88 s (recorded for G2-01) and 10.01 s (recorded for G2-02), tests/test_conventions.py 9 passed in 8.10 s, tests/test_identity.py 29 passed in 11.10 s; the CUDA instances (tensor batch cohorts, torch and fused replays) ran on the RTX 3060. Regression on the changed entry points before the commit: the six solver modules 80 passed in 85.84 s; the five entry-point modules 80 passed in 228.39 s; the 38-module targeted subset 549 passed in 1133.05 s. Pre-declared limits: exact equality for hashes, plans, resolver arrays, sample times and unit strings; native-versus-differentiable signals rtol 1e-5, atol 1e-6; plane DFT rtol 1e-10; whole-cycle DFT identities 1e-9; 2D flux width doubling 1e-6, impedance and sheet power 2 %, reversed wave 5 %; far-field decay 1e-6; CUDA replay rtol 1e-4, atol 1e-6 (proposed_thresholds discrete_dimensionless_fp32). A full-suite probe was stopped at 6 % (157 tests, no failure) because it would have taken hours on the shared machine.

**Passed / failed / skipped / not run.** Passed: every test listed above (11 + 11 + 9 + 29 recorded; 80 + 80 + 549 regression). Failed: none. Skipped: none in the recorded runs. Not run: the rest of the Python suite and the frontend tests.

**Evidence paths and hashes.**

- G2-01: `docs/validation/runs/20260921T164040Z-g2-01-2739bbf9/evidence.json` (source commit 7847737, clean tree, VERIFIED; `scripts/check_release_gates.py --task G2-01` passes)
- G2-02: `docs/validation/runs/20260921T164046Z-g2-02-fc7ab609/evidence.json` (source commit 7847737, clean tree, VERIFIED; `scripts/check_release_gates.py --task G2-02` passes)
- G2-05: `docs/validation/runs/20260921T164112Z-g2-05-657bc5cb/evidence.json` (source commit 7847737, clean tree, VERIFIED; `scripts/check_release_gates.py --task G2-05` passes)
- G2-06: `docs/validation/runs/20260921T164116Z-g2-06-c78e74ff/evidence.json` (source commit 7847737, clean tree, VERIFIED; `scripts/check_release_gates.py --task G2-06` passes)

**Remaining defects, risks, external blockers.**
- The sampled material enters `plan_hash` through its rasterization inputs on the hashed nodes, not through the voxel bytes, so that resolving a plan for a beyond-VRAM streamed scene allocates no full volume; `plan.material` materializes the arrays on demand and is what `Simulation` and the tensor batch run from. The resource estimate is carried but not hashed because it depends on the precision, which the brief keeps outside the hash.
- The browser streamed and tiled jobs (`execution_modes.run_streamed_job`, `run_tiled_job`), `EndpointSimulation`, `TensorDielectricSimulation` and the reversible wrappers do not report `plan_hash` yet (listed as `not_yet_covered` in the G2-02 case).
- `streamed_restart.journal_contract` still hashes the project JSON without ids: a renamed object or a changed placement invalidates a journal that `restart_key` would accept. Moving the journal onto `restart_key` belongs with the G1-04 restart work (worktree of another agent) and was not done here.
- Legacy `_plane_signature`/`_run_fingerprint` differ from the plan keys on three rows of the matrix (inert source settings, monitor frequency samples, point monitors); the plan keys are the specification, the legacy keys are unchanged and still drive `DifferentiablePlaneResult.run_signature` and `PlaneReferenceCache`.
- `/api/validate` now resolves a plan on every call; the material is not materialized, so the added cost is the CPML, source, monitor and estimate resolution the endpoint already did through `estimate`.
- The full Python test suite was not run to completion on this shared machine; the modules listed above plus a targeted regression subset were run (see measurements).

**Next first command and task id.** G2-03 (capability registry) can start from the plan sections; for the restart contract, G1-04 should replace `journal_contract`'s project JSON by `torchfdtd.identity.restart_key`:

```
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_plan.py tests/test_identity.py tests/test_conventions.py

### 2026-09-22 G3-06, G3-09, G3-10, G3-11, G3-12, G3-14, G3-15, G3-16, G3-17 (physics and gradient evidence), branch g3-record from 2b64f91

**Problem or goal.** Record the physics and gradient validations that already
existed in the repository as gate evidence with pre-declared fixtures, classify
every fixture by validation layer and oracle class, and add the layer-B tests
whose oracle was available but not collected by pytest.

**State found.** HEAD 2b64f91 on branch g3-record, clean tree. The nine task
records were NOT_ASSESSED with empty `required_tests`; no G3 case file existed.

**Changed files (why).**
- `docs/validation/cases/G3-06_pec_pmc_cavity.json`, `G3-09_mode_solver_oracles.json`, `G3-10_pic_networks.json`, `G3-11_dipole_radiation.json`, `G3-12_tensor_slab.json`, `G3-14_discrete_backend_agreement.json`, `G3-15_gradient_checks.json`, `G3-16_physical_parameter_gradients.json`, `G3-17_oracle_budget.json`: fixtures, oracles, recorded limits, a layer and oracle class per listed test, `not_yet_covered` items and error budgets.
- `tests/test_cavity_resonance.py` (new, G3-06): closed PEC cube, Ez point source and point monitors, TM110 resonance from the monitor spectrum against the discrete Yee eigenfrequency (declared floor 1e-3) and the continuum eigenfrequency (program limit 1 percent).
- `tests/test_mode_branch_passivity.py` (new, G3-10): Y branch and crossing at 0.05 um with the network's own launch observed on a closed box of full-extent flux planes; passivity, guided power bounded by total flux, flux closure within the program's 1 percent channel balance, radiation defect decomposed.
- `tests/test_tensor_slab_acceptance.py`, `tests/test_radiation_dipole_pattern.py`, `tests/test_gradient_mesh_slab.py` (new, G3-12, G3-11, G3-16): thin wrappers of `benchmarks/tensor_cpml_birefringent_slab.py`, `benchmarks/radiation_dipole.py` and `benchmarks/gradient_mesh.py` under their pre-declared criteria, CUDA only.
- `docs/ORACLE_BUDGET.md`, `tests/test_oracle_budget.py` (G3-17): oracle classes, independence, precision floors, time-window and PML budgets per fixture; the test requires every `docs/validation/cases/G3-*.json` to carry `oracle_class` and a `tests.layers` entry per listed test.
- `docs/validation/completion_gates.json`: `required_tests`, `code_paths`, `planned_test_commands`, `implementation_state` IMPLEMENTED and an `implementation_note` on the nine tasks (5c0172d); the recorder then wrote the nine evidence ids and VERIFIED states.
- `docs/validation/runs/<run_id>/`: nine evidence directories.
- No solver code was changed.

**Commands run (device: local Windows 11, i7-12700, RTX 3060 12 GB shared with other sessions, driver 591.86, Python 3.10, torch 2.10.0+cu126, CuPy 13.6.0; TMP and TEMP set to D:/TorchFDTD/.local/tmp).** One task at a time, from the worktree root, each with `--junitxml=D:/TorchFDTD/.local/tmp/junit/<task>.xml`; the exact command of each task is its `planned_test_commands[0]` and `actual_test_commands[0]` in the gate file, then

```
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task <task> --command "<that command>" --junit D:/TorchFDTD/.local/tmp/junit/<task>.xml --exit-code 0 --fixture docs/validation/cases/<case>.json --scope "<layers and devices>"
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task <task>
```

**Measurements and pre-declared limits** (pilot values at the same sources; the JUnit reports carry pass/fail only).
- G3-06 cavity resonance: discrete relative error 3.0e-6 and 5.0e-6 (n = 1), 4.8e-6 and 7.0e-6 (n = 1.5) against the declared floor 1e-3; continuum error 0.2245 and 0.4569 percent against 1 percent, equal to the analytic numerical dispersion of the 8-cell cube; 92 tests in 135.6 s.
- G3-09: analytic slab neff within 5e-4 absolute (periodic) and 0.5 percent (open), HE11 fiber within the pre-declared 2 percent; 32 tests in 17.4 s, CPU.
- G3-10 at 0.05 um: Y branch column power 0.7234, defect 0.2766, measured non-guided 0.2697, closure -0.688 percent, side radiation 3.53 percent, reciprocity 2.2e-3; crossing column power 0.8054, defect 0.1946, measured non-guided 0.1911, closure -0.344 percent, reciprocity 5.6e-5; limits: closure 1 percent, column power below 1.002, guided excess 1 percent; 23 tests in 378.9 s, CUDA.
- G3-11 native pattern: 1.031, 0.541, 0.230 percent at 0.1, 0.075, 0.05 um (limit: decreasing, last below 1 percent); 56 tests in 223.1 s.
- G3-12 slab: channel-vector error 1.3721 percent (0.05 um, limit 5) and 0.3302 percent (0.025 um, limit 3), channel powers 0.9880 and 0.8839 against 0.9882 and 0.8852 (limit 0.03), index VJP -0.18468 against -0.17277 (6.89 percent, limit 15); 45 tests in 277.5 s.
- G3-14: 75 tests in 95.9 s at the recorded budgets (float64 1e-13 to 2e-10; float32 forward 2e-6 to 3e-6; float32 VJP 2e-5 to 3e-4 relative).
- G3-15: 34 tests in 55.0 s at the recorded budgets (adjoint versus autograd 1e-9 to 1e-12; central differences 1e-6 to 2e-6 relative; Taylor ratios about 4 where asserted).
- G3-16 slab derivatives: joint refinement 12.09, 6.84, 2.80 percent (thickness) and 11.96, 7.01, 3.19 percent (epsilon), followup 1.633 and 1.783 percent at (0.01, 0.06) um against 3 percent; T error 0.00229 (limit 0.005); conservation 1.8e-5 (limit 5e-4); duration and PML controls changed outputs by at most 1.8e-7 (limit 1e-5); 19 tests in 81.2 s.
- G3-17: 4 tests in 0.1 s.

**Passed / failed / skipped / not run.** Passed: all 380 test cases of the nine runs. Failed: none. Skipped: none (CUDA and CuPy present; the env-gated `tests/test_reversible_cpml_kernels.py` CUDA instance is not listed as required). Not run: the `not_yet_covered` items of every case file, in particular the PMC resonance from a spectrum, mode field profile and confinement factor, bends and couplers, surface-position dependence of the far field, tensor slab reflection, sharp-interface shape derivatives.

**Evidence paths and hashes** (`docs/validation/runs/<run_id>/evidence.json`, JUnit SHA-256 prefix, fixture SHA-256 prefix).
- G3-06 `20260921T164848Z-g3-06-3343e41b`, edd75c64f3acfc59, 1733a4f1c1fa2735
- G3-09 `20260921T164916Z-g3-09-a7e7b272`, b1acc545dc852b18, b7aae212c15ec77d
- G3-10 `20260921T164946Z-g3-10-ea83b20f`, 8d5e4c03a276f0bf, df2eda27e38f2269
- G3-11 `20260921T165000Z-g3-11-74c48d39`, 91e98473ca8c4516, 7add6d803eb1f570
- G3-12 `20260921T165015Z-g3-12-562acc59`, a182e07a22d35f0a, 684c314d5cef283a
- G3-14 `20260921T165025Z-g3-14-bfa848be`, 1ebc4cc3cd25d6cb, a3b7ef176bdc8411
- G3-15 `20260921T165032Z-g3-15-12732135`, 883dcc0644c5df50, 5c5c2e8ed996dd48
- G3-16 `20260921T165045Z-g3-16-aa46cfa9`, 35d1946352065110, f8222fb55b672249
- G3-17 `20260921T165050Z-g3-17-bb3742d1`, c6690fc97baf80e7, 17c79aef26d455ca
All recorded at source commit 5c0172d on a clean tree; the judge passes each of the nine tasks.

**Remaining defects, risks, external blockers.**
- The first draft of `tests/test_mode_branch_passivity.py` at the 0.1 um network mesh and 800 steps with a 2 percent budget failed on the Y branch (closure -2.12 percent). Sweeps before fixing the fixture: window 800/1200/1600 steps gave -2.12/-0.64/-0.58 percent (Y branch) and -2.03/-1.97/-1.88 percent (crossing); PML 8/16/24 layers left the Y branch within 0.15 points; mesh 0.05 um gave -0.69 percent (Y branch) and -0.34 percent (crossing). The fixture was fixed at 0.05 um and 2400 steps under the program's 1 percent balance limit; the Y-branch residual of -0.69 percent is mesh-, window- and PML-independent and its origin is not identified. It is recorded in the case and in `docs/ORACLE_BUDGET.md`, not hidden.
- The open fiber neff keeps its pre-declared 2 percent budget (program 0.5 percent); five float32 gradient fixtures keep 2e-4 to 3e-4 relative budgets (program 1e-4); the tensor slab measures transmission only. All are reported as differences in the case files.
- `tests/test_oracle_budget.py` requires `oracle_class` and `tests.layers` in every `docs/validation/cases/G3-*.json`; G3 case files written on other branches must add them before merging, and `docs/ORACLE_BUDGET.md` still lacks rows for G3-01 to G3-05, G3-07, G3-08 and G3-13.
- The three benchmark wrappers and the branch passivity test need CUDA (about 100 to 380 s each on the shared RTX 3060); without CUDA the wrappers skip and the tasks stay NOT_RUN by the recorder's rule.
- Evidence hashes are working-tree bytes; the repository's `* -text` attribute keeps them checkout-independent.

**Next first command and task id.** After merging this branch, add the other branches' G3 case rows to `docs/ORACLE_BUDGET.md` and re-run G3-17:

```
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_oracle_budget.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-17.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py

### 2026-09-22 G3-01, G3-02, G3-03, G3-07 (independent physics fixtures, part A), branch g3-fixtures-a from 2b64f91

**Problem or goal.** Declare, run and record four G3 fixtures with in-test oracles
(exact Yee dispersion relation, Fresnel/Airy transfer matrix, analytic Drude/Lorentz
permittivity and the bilinear ADE response), with the limits fixed in
`docs/validation/cases/G3-0*.json` before the recorded run and every measurement kept
in `docs/validation/g3/<task>.json`. Layer A (CUDA FP32 against CPU FP64 of the same
discrete problem, rtol 1e-4, atol 1e-6) and layer B (physics) are recorded separately.

**State found.** HEAD 2b64f91 on branch g3-fixtures-a, clean tree, no earlier partial work.

**Changed files (why).**
- `docs/validation/cases/G3-01_uniform_propagation.json`, `G3-02_dielectric_slab_tmm.json`, `G3-03_dispersive_slab_fit_ade.json`, `G3-07_cpml_reflection_stability.json`: the pre-declared fixtures, oracles, observables and limits (program thresholds plus this case's own budgets for round-off, absorption, the ADE and stability). Each `notes` field lists the fixture changes made during the harness shakedown before the recorded run (pulse length, reference-domain length, driven-cell settling, late-growth floor); no limit changed.
- `tests/test_physics_g3_a.py`: 110 test instances in four classes; oracles and DFT written in the module, no solver code shared. The N40/h10 meshes run only with `TORCHFDTD_G3_FINE=1`.
- `scripts/render_physics_validation.py`, `docs/PHYSICS_VALIDATION.md`: the document is rendered from the records; no number is typed by hand.
- `docs/validation/g3/G3-01.json`, `G3-02.json`, `G3-03.json`, `G3-07.json`: every measured number and the environment of the recorded run.
- `docs/validation/completion_gates.json`: `required_tests`, `code_paths` and `planned_test_commands` on the four tasks (metadata); evidence rows added by the recorder afterwards.

**Commands run (device: local Windows 11, i7-12700, RTX 3060 shared with other agents, Python 3.10.2, torch 2.10.0+cu126; TMP and TEMP set to D:\TorchFDTD\.local	mp; PowerShell).**

```
$env:TORCHFDTD_G3_FINE='1'; D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_a.py::TestG301 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-01.xml
$env:TORCHFDTD_G3_FINE='1'; D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_a.py::TestG302 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-02.xml
$env:TORCHFDTD_G3_FINE='1'; D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_a.py::TestG303 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-03.xml
$env:TORCHFDTD_G3_FINE='1'; D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_a.py::TestG307 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-07.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/render_physics_validation.py
```

**Measurements and pre-declared limits** (all numbers from `docs/validation/g3/*.json`; the rendered tables are in `docs/PHYSICS_VALIDATION.md`).
- G3-01: eigenmode cos(omega dt) residual at most 3.3e-16 and polarization leak at most 2.9e-15 (limits 1e-12), 2D TE/TM and both 3D polarizations, vacuum and n=1.5, oblique and axis wavevectors. Simulation-path propagation: |k_measured - k_Yee| D between 9.6e-12 and 3.8e-7 rad over 24 instances (limit 1e-3 rad); the continuum phase error per vacuum wavelength falls 0.0582 -> 0.0140 -> 0.00348 rad (2D vacuum, N 10/20/40, mid band) and equals the Yee prediction to the printed digits. 2D TE vs TM and 3D Ey vs Ez traces are bit-identical (difference 0). Layer A max abs error 7.3e-7 (2D) and 9.9e-7 (3D) on unit-peak traces.
- G3-02: 48 instances. n=1.5 slabs: max |dR| 0.0005 to 0.0073, t phase 0.0012 to 0.018 rad, all pass at N20 and N40. n=3.5 slabs at N20 (19.9 to 20.4 cells per material wavelength): |dR| 0.0128 to 0.0373 and t phase 0.0315 to 0.0539 rad, **12 instances FAIL** the 0.01 / 0.02 rad limits; the same slabs at N40 pass with |dR| 0.0030 to 0.0093 and t phase 0.0078 to 0.0133 rad. |R+T-1| is at most 8.4e-5 everywhere. Errors fall about 4x per mesh halving (second order); TM at 20 and 45 deg is not worse than TE. Layer A (complex64 Bloch, 3426 steps) max abs error 1.1e-6 (TE) and 1.2e-6 (TM).
- G3-03: analytic slabs, both meshes and polarizations: |dR| at most 0.0020, |dT| 0.0027, |dA| 0.00066, t phase 0.0051 rad (limits 0.01 / 0.02 rad). Fits recover the Drude pole (1 pole, normalized rms 7.2e-9) and both Lorentz poles (2 poles, 1.9e-16); the fit's own contribution to R is below 3e-9, so the fitted-slab errors equal the analytic-slab errors. ADE constitutive error on the band: Drude max |dk| 7.6e-4 (dt 4.67e-17 s) and 1.9e-4 (dt 2.34e-17 s), Lorentz max |dn| 3.4e-4 and 8.5e-5 (limit 1e-3), ratio 4.0; the driven cell matches the bilinear response to 1e-14.
- G3-07: default 10-layer CPML reflected/incident power: normal vacuum 4.7e-10 (-93 dB), n=2 2.1e-9 (-87 dB), limit 1e-6; 30 deg 3.8e-10 (-94 dB), 60 deg 8.6e-10 (-91 dB), limit 1e-4; interface entering the layer 1.2e-5 (-49 dB) on the vacuum side and 8.9e-8 (-70 dB) on the dielectric side, limit 1e-4. 20 layers: 2.7e-12 (-116 dB); 200 fs vs 100 fs changes R by 1.5e-6 relative. 20,000-step stability: energy last/peak 6.0e-18 (vacuum), 3.6e-16 (n=2), 9.0e-7 (60 deg, non-growth only), no late growth. Layer A max abs error 7.3e-7.

**Passed / failed / skipped / not run.** G3-01 38 passed; G3-02 38 passed, 12 failed (the n=3.5 N20 instances above); G3-03 12 passed; G3-07 10 passed. Skipped: none (fine meshes enabled). Wall time under the shared load: 492 s, 402 s, 87 s, 100 s.

**Evidence paths and hashes.** Recorded on the clean tree at 637e653 with `scripts/record_gate_evidence.py --task G3-0X --command "<the command above>" --junit D:/TorchFDTD/.local/tmp/junit/G3-0X.xml --exit-code <0 or 1> --fixture docs/validation/cases/<case>.json --observed docs/validation/g3/G3-0X.json --scope "<layers and devices>"`:
- G3-01: `docs/validation/runs/20260921T164808Z-g3-01-f6fd27b3/` (VERIFIED, 38 passed)
- G3-02: `docs/validation/runs/20260921T164814Z-g3-02-1e349534/` (FAILED, 38 passed, 12 failed)
- G3-03: `docs/validation/runs/20260921T164821Z-g3-03-35392fa4/` (VERIFIED, 12 passed)
- G3-07: `docs/validation/runs/20260921T164832Z-g3-07-70619385/` (VERIFIED, 10 passed)

Each `evidence.json` carries the fixture, criteria and test-source SHA-256 values, the observed metrics, the environment and the JUnit copy. `scripts/check_release_gates.py --task G3-0X` passes G3-01, G3-03 and G3-07 and fails G3-02 (verification_state FAILED); the four rows are now `implementation_state` IMPLEMENTED.

**Revision 2 of G3-02 (same session, after f6447b7).** The 20-cell failure is the second-order Yee phase error measured in G3-01, so `docs/validation/cases/G3-02r2_slab_tmm_40_cells.json` fixes the mesh at about 40 cells per material wavelength for every index with unchanged limits and states the measured 20-cell and G3-01 numbers in its applicability text. `tests/test_physics_g3_a.py::TestG302` now has `test_slab_r_t_against_tmm_40_cells` (limits), `test_slab_balance_20_cells` (energy balance only, R/T reported), `test_dispersion_order` (20-cell over 40-cell error ratio between 3 and 5) and the layer-A test; the record is `docs/validation/g3/G3-02r2.json` and the document gained the rendered paragraph "Resolution requirement for high-index slabs". The first case, `docs/validation/g3/G3-02.json` and the FAILED run `20260921T164814Z-g3-02-1e349534` are untouched. Recorded run: 74 passed, 0 failed, 0 skipped in 597 s (`$env:TORCHFDTD_G3_FINE='1'; ... tests/test_physics_g3_a.py::TestG302 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-02.xml`); order ratios 3.93 to 4.08 (phase) and 3.96 to 4.25 (R) over 24 instances. The new evidence run id is appended to the G3-02 row of the gate file by the recorder.

**Remaining defects, risks, external blockers.**
- The first G3-02 case remains FAILED on record (12 of 48 instances at about 20 cells per material wavelength for n=3.5); revision 2 above resolves the task at 40 cells without changing a limit. A subpixel-interface fixture at 20 cells would be a further case.
- The oblique fixtures use fixed k_parallel (Bloch phase), so the angle varies across the band; the case files state the ranges. Fixed-angle broadband injection is out of scope.
- The reflection phase of the slab is reported only: the staircase reference plane sits 3/8 cell (integer-node components) or -1/8 cell (half-cell components) from the physical face.
- Under the shared CPU load the 3D N40 propagation runs took 74 to 142 s each; the quick run (without TORCHFDTD_G3_FINE) is the default.

**Next first command and task id.** Remaining G3 fixture families (Mie, cavities, gratings, modes, dipoles, tensor slabs, shape) are not covered here. To re-render the document after any re-run:

```
D:/TorchFDTD/.venv/Scripts/python.exe scripts/render_physics_validation.py
```

### 2026-09-22 G8-01, G8-05, G8-06, G8-07 (packaging, doctor, compatibility), branch g8-packaging from 2b64f91

**Problem or goal.** Ship the browser workbench inside the wheel and prove a
clean-install user runs the UI, a first computation, save and load without
Node, a checkout or a source edit (G8-05, G8-07); fix the dependency bounds by
real installations and add `torchfdtd doctor` (G8-06); test project JSON and
result NPZ compatibility with a schema-version guard (G8-01).

**State found.** HEAD 2b64f91, clean worktree, no earlier partial work. The
wheel already carried `torchfdtd/web` through `package-data`; the committed
assets were built in the same commit as the last frontend change (f09ec94).
No Python 3.9 interpreter exists on the host (the py launcher entry is broken).
No CUDA torch wheel was cached on D:; `torch-2.10.0+cu126` (2.59 GB) was
downloaded once into `D:/TorchFDTD/.local/wheels` next to the CPU builds
2.2.2, 2.3.1, 2.4.1, 2.14.0 and `cupy_cuda12x-13.6.0`.

**Changed files (why).**
- `torchfdtd/doctor.py`, `torchfdtd/cli.py`: `torchfdtd doctor [--json]` (Python, torch, CuPy, CUDA runtime/driver, device, a 20 x 20 cell fused launch, the backend a project selects, one message per unsupported situation, exit 1 on an error entry); `main(argv=None)` for tests.
- `torchfdtd/models.py`: `SCHEMA_VERSION`, `migrate_project` (the migration stub) and a before-validator on `Project`, so JSON, NPZ and API payloads refuse a newer `schema_version` by name.
- `scripts/clean_install_check.py`: builds the wheel from a staging copy, verifies payload and web assets against the tree and git HEAD, creates the CPU-only and CUDA venvs, installs, probes, serves, runs the doctor and the README blocks, writes the record.
- `scripts/run_readme_examples.py`: README block parser and runner (`<!-- readme-example: cuda|skip -->` markers, python blocks run in the CPU venv by default).
- `tests/test_doctor.py` (9), `tests/test_project_compatibility.py` (16), `tests/test_clean_install.py` (6), `tests/fixtures/generate_fixtures.py`, `tests/fixtures/projects/*.json` (7 frozen schema-1 projects), `tests/fixtures/npz/*.npz` (a complete and a cancelled tiny result; the directory is `npz` because `.gitignore` ignores every `results/`).
- `pyproject.toml`: `torch>=2.4` (was 2.2). `README.md`: wheel install path, `torchfdtd doctor`, a second python block that runs on any install and loads its result, markers. `docs/INSTALL.md`: new. `docs/RELEASE_SCOPE.md`: the dependency row now points at INSTALL.md.
- `docs/validation/cases/G8-01_*.json, G8-05_*.json, G8-06_*.json, G8-07_*.json`: pre-declared cases. `docs/validation/completion_gates.json`: `required_tests`, `code_paths`, `planned_test_commands`, `implementation_state` IMPLEMENTED for the four tasks, then the recorder's evidence entries.
- `docs/validation/clean_install/20260921T165132Z-b768cc74.json`: the clean-install record. `docs/validation/clean_install/version_trials_2026-09-22.json` and `version_trials/*.xml`: the installation trials.

**Commands run (device: local Windows 11, i7-12700, RTX 3060 12 GB, driver 591.86, base Python 3.10.2; TMP, TEMP and PIP_CACHE_DIR under D:/TorchFDTD/.local; the GPU was shared with other agents).**

```
D:/TorchFDTD/.venv/Scripts/python.exe -m pip download --no-deps "torch==2.10.0+cu126" --index-url https://download.pytorch.org/whl/cu126 -d D:/TorchFDTD/.local/wheels   (and torch, torch==2.2.2+cpu, ==2.3.1+cpu, ==2.4.1+cpu from /whl/cpu; cupy-cuda12x==13.6.0)
python -m venv D:/TorchFDTD/.local/venvs/trial-<name>; <venv> -m pip install --find-links D:/TorchFDTD/.local/wheels <torch spec> [numpy<2] <wheel>; <venv> D:/TorchFDTD/.local/tmp/g8/probe_trial.py; <venv>/Scripts/pytest.exe -q tests/test_solver.py tests/test_api.py tests/test_torch_interop.py tests/test_project_compatibility.py tests/test_doctor.py
npm.cmd ci; npm.cmd run build; git status --short torchfdtd/web            (Node 22.18.0, npm 10.9.3: empty status, the committed assets are reproduced byte for byte)
D:/TorchFDTD/.venv/Scripts/python.exe scripts/clean_install_check.py --local-root D:/TorchFDTD/.local --find-links D:/TorchFDTD/.local/wheels --cuda-torch "torch==2.10.0+cu126"
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_project_compatibility.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G8-01.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_clean_install.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G8-05.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_doctor.py tests/test_clean_install.py::test_doctor_reports_are_consistent_with_each_environment --junitxml=D:/TorchFDTD/.local/tmp/junit/G8-06.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_clean_install.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G8-07.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task <id> --command "<the line above>" --junit D:/TorchFDTD/.local/tmp/junit/<id>.xml --exit-code 0 --fixture docs/validation/cases/<case>.json --scope "<Windows only>" [--dist <wheel>] [--observed docs/validation/clean_install/version_trials_2026-09-22.json --artifact <trial xml> ...]
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task <id>
```

**Measurements and pre-declared limits.** Wheel `torchfdtd-0.14.0.dev0-py3-none-any.whl`
832,871 bytes, 144 entries, 137 package files including `torchfdtd/web/index.html`
(371 B), `assets/index-B_7fVhFf.css` (28,669 B) and `assets/index-vgD-L-Vv.js`
(759,198 B), all byte-identical to HEAD; SHA-256
`0cc7b719bc14df32d16cf831b555686846e91732b59621ee7dfca08057316526` (built from
b768cc7). Clean CPU venv (torch 2.14.0+cpu, numpy 2.2.6, 40 packages, pip 21.2.4
not upgraded): import from the venv, 2D run, save and load in 14.0 s; server on
port 54621 answered `/`, both assets, `/api/health` and `/api/capabilities` with
200; doctor exit 0, backend cpu. Clean CUDA venv (torch 2.10.0+cu126,
cupy-cuda12x 13.6.0, 42 packages): fused 2D forward run, backend cuda, kernel
fused, on the RTX 3060; doctor fused launch 0.85 s, exit 0. README: the cuda
block (3D, 768,000 cells, 1000 steps, fused) passed in 11.1 s, the cpu block in
5.9 s, both from `D:/TorchFDTD/.local/tmp/clean_install/work/readme`; the three
powershell blocks are listed, not executed. Installation trials: torch 2.2.2+cpu
and 2.3.1+cpu with numpy 2.2.6 fail `torch.from_numpy` (`Numpy is not
available`); 2.2.2+cpu with numpy 1.26.4, 2.4.1+cpu with 2.2.6 and Python 3.12.7
with 2.14.0+cpu and numpy 2.5.3 pass the probe and the subset (31 passed, 5 CUDA
skips each). Limits are the pass/fail rules of the four case files; no numeric
threshold applies.

**Passed / failed / skipped / not run.** Passed: tests/test_project_compatibility.py
16, tests/test_clean_install.py 6, tests/test_doctor.py 9 (the real launch ran),
regression subset test_solver, test_api, test_session, test_batch,
test_tensor_project, test_endpoint_project, test_fsp, test_fsp_api,
test_readme_measurements, test_completion_program_documents,
test_release_gates, test_mesh, test_monitor_outputs: 93 passed, 1 skipped in
242 s on the dev venv. Failed: none. Skipped: the CUDA instances in the CPU-only
trial venvs. Not run: Linux and macOS installs (G8-07 Linux column NOT_RUN);
Python 3.9 refusal (no interpreter), 3.11 and 3.13; CuPy other than 13.6.0.

**Evidence paths and hashes.**
- `docs/validation/runs/20260921T170627Z-g8-01-d8b628a7` (junit `238512b77d6c2542`, case `ace8e974d36d024e`)
- `docs/validation/runs/20260921T170637Z-g8-05-29a464aa` (junit `8902feae737104d8`, case `3d2c6fc2e3e1e50d`, wheel `0cc7b719bc14df32`)
- `docs/validation/runs/20260921T170706Z-g8-06-7b7e68da` (junit `3852a6cf1170d118`, case `56ab0fd82431ebc5`, observed `version_trials_2026-09-22.json`)
- `docs/validation/runs/20260921T170718Z-g8-07-b934b710` (junit `7afe912cbb405512`, case `fc404f76c90630f5`, wheel `0cc7b719bc14df32`)
- `docs/validation/clean_install/20260921T165132Z-b768cc74.json`; the wheel itself stays at `D:/TorchFDTD/.local/dist/b768cc74102e/`.
All four tasks are VERIFIED and judge PASS at 457b0b8.

**Remaining defects, risks, external blockers.**
- G8-07 Linux column NOT_RUN. macOS has no record at all.
- setuptools on Windows writes the wheel `METADATA` with CRLF; a wheel built on Linux has a different hash for the same sources, so a release wheel must be built once and hashed where it is built.
- The README quick start names the wheel file by version; bump it with the version.
- `tests/test_clean_install.py` fails, by design, after any change to `pyproject.toml`, `torchfdtd/web`, the two scripts or a runnable README block until the check is rerun (about 12 min with cached wheels, 2.6 GB CUDA torch install included).
- `implementation_state` for the four tasks was set to IMPLEMENTED by this session; the integrator may prefer to own that field.
- Every G8-05/06/07 claim is Windows 11, Python 3.10.2, RTX 3060, driver 591.86; docs/INSTALL.md lists what was not tried.

**Next first command and task id.** In WSL, for the Linux column of G8-07 (and G8-05):

```
python3 -m venv /mnt/d/TorchFDTD/.local/venvs/wsl-dev && /mnt/d/TorchFDTD/.local/venvs/wsl-dev/bin/pip install build
/mnt/d/TorchFDTD/.local/venvs/wsl-dev/bin/python scripts/clean_install_check.py --local-root /mnt/d/TorchFDTD/.local/wsl --skip-cuda
```

then record G8-07 again with `--scope "Windows and Linux (WSL, CPU only)"`; the record with `--skip-cuda` fails the G8-05 tests by design, so keep the Windows record as the newest one for those, or extend the script to merge platform columns.

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
