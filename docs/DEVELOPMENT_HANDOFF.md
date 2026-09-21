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
- docs/PHYSICS_VALIDATION.md: both G3 branches create this file. On g3-fixtures-a (commit 80f91d9) `scripts/render_physics_validation.py` imports `RENDERERS` from `benchmarks/render_g3_b.py` (no-op until the merge) and renders all eight sections, so the integrator resolves the add/add conflict by taking that branch's document and running that script once after the merge. `benchmarks/render_g3_b.py` writes its own `<!-- g3-b:<task> begin/end -->` regions only while that script is absent; once it exists, this script writes the observed-metric summaries only (also selectable with `--summaries-only`), so the sections cannot be rendered twice. The fine-mesh gate is `TORCHFDTD_G3_FULL` here and `TORCHFDTD_G3_FINE` on g3-fixtures-a; renaming after the recorded runs would change the test source and stale the four evidence runs, so both names stay.

**Next first command and task id.** After merging, decide whether to add the
corrected G3-08 layer-A case and rerun the G3-08 selection, then continue with
the remaining G3 tasks:

```
TORCHFDTD_G3_FULL=1 TORCHFDTD_G3_RECORD=docs/validation/g3 D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_b.py -k g3_08 --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-08.xml
```

### 2026-09-22 G4-01 to G4-06 (real CUDA matrix, robustness, edge fixtures, suite separation, GPU runner policy), branch g4-cuda from 2b64f91

**Problem or goal.** Verify the CUDA paths on the GPU actually present,
record which platforms are verified and which are not, separate the CPU PR
suite from the GPU suites so that a skipped GPU-required test is a failure,
and state how untrusted code is kept off the lab GPU hosts.

**State found.** HEAD 2b64f91 on branch g4-cuda, clean tree. One RTX 3060
(12 GB, driver 591.86, CUDA runtime 12.6, torch 2.10.0+cu126, CuPy 13.6.0,
Python 3.10.2, Windows 11 build 26200) shared with seven other agents; the RTX
5880 Ada workstation is reachable only by the parent session. A CUDA 11.6
compute-sanitizer exists on this host but cannot instrument the CUDA 12.6
runtime torch uses (probe: `Target application terminated before first
instrumented API call`), so it was not used. `CUDA_VISIBLE_DEVICES=""` leaves
`torch.cuda.is_available()` true on this build; `-1` hides the device.

**Changed files (why).**
- `scripts/platform_report.py`, `docs/validation/platforms/rtx3060-win11-lab.json`, `docs/PLATFORM_MATRIX.md`, `tests/test_platform_matrix.py` (G4-01): the inventory tool, the one record that exists, and a matrix whose cells must come from a record file; the RTX 5880 row reads `not recorded`.
- `tests/test_cuda_matrix.py`, `docs/validation/cases/G4-02_cuda_valid_path_matrix.json` (G4-02): 64 forward cells and 32 adjoint cells on a 20 x 18 x 16 problem against the CPU float64 solution; 24 complex-plus-fused cells assert the named `ValueError`.
- `tests/test_cuda_robustness.py`, `docs/validation/cases/G4-03_cuda_robustness.json` (G4-03).
- `tests/test_cuda_edge_fixtures.py`, `docs/validation/cases/G4-04_cuda_edge_fixtures.json` (G4-04): five named fixtures, twenty seeded random fixtures (seeds 2026092200 to 2026092219), three streamed configurations.
- `tests/conftest.py` (new), `pyproject.toml` markers, `scripts/run_suite.py`, `.github/workflows/test.yml`, `scripts/release_audit.py`, `scripts/record_gate_evidence.py`, `scripts/check_release_gates.py`, `tests/test_release_gates.py` (three injection tests), `tests/test_suite_policy.py`, `docs/validation/runs/README.md`, `docs/validation/cases/G4-05_suite_separation.json` (G4-05). `tests/test_cuda_bootstrap.py`, `tests/test_reversible_cpml_kernels.py` gained the `long` marker on their opt-in tests; `tests/test_domain_decomposition.py` and `tests/test_fsp.py` the `optional` marker on the NCCL, Gloo and Lumerical tests.
- `docs/GPU_RUNNER_POLICY.md`, `tests/test_gpu_runner_policy.py`, `docs/validation/cases/G4-06_untrusted_code_policy.json` (G4-06).
- `docs/validation/completion_gates.json`: `code_paths`, `required_tests`, `planned_test_commands` and `implementation_state` IMPLEMENTED on G4-01 to G4-06; the recorder wrote the VERIFIED states and evidence ids.

**Commands run (device: RTX 3060 host above; every CUDA grid at most 21 cells per axis; TMP and TEMP set to D:\TorchFDTD\.local\tmp; each test file run alone from the worktree root at commit a73f479, G4-05 at e66e499).**

```
D:/TorchFDTD/.venv/Scripts/python.exe scripts/platform_report.py --id rtx3060-win11-lab
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_platform_matrix.py --junitxml=D:/TorchFDTD/.local/tmp/junit/g4-01.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_cuda_matrix.py --junitxml=D:/TorchFDTD/.local/tmp/junit/g4-02.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_cuda_robustness.py --junitxml=D:/TorchFDTD/.local/tmp/junit/g4-03.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_cuda_edge_fixtures.py --junitxml=D:/TorchFDTD/.local/tmp/junit/g4-04.xml
PYTORCH_NO_CUDA_MEMORY_CACHING=1 CUDA_LAUNCH_BLOCKING=1 D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_cuda_edge_fixtures.py --junitxml=D:/TorchFDTD/.local/tmp/junit/g4-04-oob.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_suite_policy.py tests/test_release_gates.py --junitxml=D:/TorchFDTD/.local/tmp/junit/g4-05.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_gpu_runner_policy.py --junitxml=D:/TorchFDTD/.local/tmp/junit/g4-06.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task <id> --command "<the line above>" --junit <xml> --exit-code 0 --fixture docs/validation/cases/<case>.json --scope "..."
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py
```

Marker inventory, before the evidence runs, at the uncommitted tree that
became a73f479: `CUDA_VISIBLE_DEVICES=-1 python -m pytest -q -p no:cacheprovider -m cuda -rA`
gave 603 skipped, 0 passed, 0 failed in 16.53 s (no CPU test carries the
`cuda` marker). `python scripts/run_suite.py cpu-pr -rs --junitxml=D:/TorchFDTD/.local/tmp/junit/cpu_pr_hidden.xml`
(CUDA hidden by the runner) gave 1779 passed, 9 skipped, 603 deselected in
3263.89 s on the loaded host. The nine skips: three Gloo transport cases and
the Lumerical round trip (all `optional platform check:`), and five CUDA
skips the collection rules missed (tests/test_adjoint_lifetime.py:13, four
instances, and tests/test_shape_gradients.py:29, one instance: their CUDA
parameters are named `torch`/`fused` or gated through a helper). Those
parameters now carry an explicit `cuda` marker (commit after 4a14c4b); with
it the two files give 12 passed and 8 deselected in cpu-pr mode and 20 passed
on the GPU.

**Measurements and pre-declared limits.** Every comparison is on quantities
divided by the reference maximum, at the program's layer-A limits declared in
the case files before the runs: float32 rtol 1e-4, atol 1e-6; float64 rtol
1e-7, atol 1e-9. A design pilot before the declaration measured at most 1.6e-6
(float32) and 2.1e-15 (float64) normalized deviation on the G4-02 fixture; the
declared limits are the program thresholds. G4-03 declares zero bytes of
`torch.cuda.memory_allocated` residue after a cancelled run and after an
exception, and bitwise identity of forward results across a caller-owned
stream; both held. G4-04 declares bitwise identity of a repeated fused run as
the race check available here. Wall times of the evidence runs: G4-01 30.6 s,
G4-02 69.3 s, G4-03 21.6 s, G4-04 25.6 s and 101.1 s (out-of-bounds mode),
G4-05 89.7 s, G4-06 0.06 s.

**Passed / failed / skipped / not run.** Passed: 4 + 98 + 29 + 34 + 34 + 31 + 5
= 235 tests in the seven evidence runs, 0 failed, 0 skipped. Existing files
touched by the marker change were rerun: tests/test_cuda_kernels.py,
tests/test_cuda_bootstrap.py, tests/test_reversible_cpml_kernels.py and the
two `optional` tests, 18 passed and 4 skipped (two opt-in `long` gates, the
Lumerical and the two-GPU NCCL checks, the latter two now reported with the
`optional platform check:` prefix). Not run: every G4 test on the RTX 5880 Ada
(commands below); compute-sanitizer memcheck/racecheck (no CUDA 12.x tool on
this host); a gpu-nightly run on any host. No solver defect was found; the
one behaviour worth naming is that CUDA graphs cannot be captured under
`PYTORCH_NO_CUDA_MEMORY_CACHING=1` (cudaMalloc during capture), which is a
torch limitation, so the out-of-bounds run launches the fused kernels eagerly.

**Evidence paths and hashes.** Run ids (at source commit a73f479, G4-05 at e66e499 after the runner display fix, clean
tree): 20260921T163708Z-g4-01-53b82748, 20260921T163724Z-g4-02-b5c11b4f,
20260921T163744Z-g4-03-5f80ac67, 20260921T163749Z-g4-04-e68ad29a and
20260921T163757Z-g4-04-7e1cdb0f (out-of-bounds mode, judged last),
20260921T164503Z-g4-05-300f0a95, 20260921T163823Z-g4-06-f3d8a42a. JUnit
SHA-256: g4-01 `1f1d7bae37fbaba7fce083398e379818c796231a804123c923f75ff1bfb90922`,
g4-02 `b7d0487d3b97071373b6c92742a92f7a0c43409b548f9830996a424f5e4726eb`,
g4-03 `411d5293ba6a870d8e687ee1d33fa33c9515fbeffe09a26335b4406bd1db0c97`,
g4-04 `c14477526e7fb9dc844d04c028614ea312e87a1df2a8d5d004946d6cdd4392c1`,
g4-04-oob `223f760f840da7f7de0bdaf99c2b13f135aad4d7c15b47d80515e064ab16b546`,
g4-05 `db4d98839cc55e8849680f00234c1d68f55991ecad1bb4c0a91a531b2417f3ea`,
g4-06 `283f8ac00f8406a1b2bcb562c4d8132b9654141405617c6104b072eb57ec6d3d`.
The judge reports G4-01 to G4-06 PASS.

**Remaining defects, risks, external blockers.**
- G0-04 and G0-05 are now STALE: their evidence hashes tests/test_release_gates.py, which gained the three G4-05 injection tests. Re-record both after merging.
- The RTX 5880 Ada has no platform record and no G4 evidence; the matrix row and every case file say so. The G4 acceptance ("reproduced in at least one third environment") is therefore still open.
- The `cuda` marker is derived at collection for the existing inline-gated tests (rules in tests/conftest.py, fixed by tests/test_suite_policy.py). A new CUDA test that gates itself in an unforeseen way would be missed by cpu-pr deselection and would skip there; under --gpu-required its skip still fails, because that rule reads the skip reason.
- The cpu-pr job in CI now deselects CUDA tests instead of skipping them, so the CI JUnit no longer lists them.

**Next first command and task id.** On the RTX 5880 Ada workstation, from a
checkout of the merged commit with the same venv layout:

```
python scripts/platform_report.py --id rtx5880-ada-win11-remote
```

then add its row to docs/PLATFORM_MATRIX.md from that record, run the seven
evidence commands above with `-5880` in the JUnit names, record each with
`scripts/record_gate_evidence.py --task G4-0X ... --scope "... RTX 5880 Ada ..."`,
and run `python scripts/run_suite.py gpu-nightly --junitxml=...` there once.
Then re-record G0-04 and G0-05 and continue with G5-01.

---

### 2026-09-22 G3-08 revision 2 and G3-05 limitation, branch g3-fixtures-b on top of ff72020

**Problem or goal.** Follow-up requested after the merge 73203d2: (1) a
separately declared revision-2 case for G3-08 whose only change is the layer-A
tolerance stated as the program pair rtol 1e-4 and atol 1e-6, recorded again
with the first case and its FAILED run kept; (2) decide whether the subpixel
interface can treat the G3-05 Drude sphere and, if not, state the limitation.

**Changed files (why).**
- `docs/validation/cases/G3-08r2_bloch_grating_rcwa_layer_a.json` (75f781d): the revision-2 case; fixture, observables and physics limits are identical to `G3-08_bloch_grating_rcwa.json` (checked by loading both), the layer-A block carries the pair and an applicability note quoting the failing instance.
- `tests/test_physics_g3_b_r2.py` (75f781d): `test_g3_08r2_grating_cuda_layer_a` (twelve instances, criterion abs(cuda - cpu) <= rtol abs(cpu) + atol) and `test_g3_05_subpixel_rejects_dispersive`. A new module keeps `tests/test_physics_g3_b.py` byte-identical, so the G3-04, G3-05 and G3-13 evidence stays valid; revision-2 records are written under `docs/validation/g3/r2` so the first record `docs/validation/g3/G3-08.json` is not rewritten.
- `benchmarks/render_g3_b.py`, `docs/PHYSICS_VALIDATION.md` (75f781d, 6e4f71a, spacing fix after): the G3-08 section gains the revision-2 table and the re-run summary; the G3-05 section gains the limitation paragraph with the convergence sequence from the record and the rejection message from `docs/validation/g3/G3-05_subpixel.json`.
- `docs/RELEASE_SCOPE.md` (75f781d): the Materials row of the WORKSTATION physics table lists subpixel interfaces on dispersive materials as rejected and carries the G3-05 known limitation.
- `docs/validation/completion_gates.json`: G3-08 required tests point at the revision-2 layer-A test, code paths and planned command extended (75f781d); the recorder appended the revision-2 evidence and set VERIFIED (024249a). G3-05 was not touched and stays FAILED.

**Commands run (same host as the previous entry; the GPU was shared).**

```
TORCHFDTD_G3_RECORD=docs/validation/g3 D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_b_r2.py -k g3_05
TORCHFDTD_G3_FULL=1 TORCHFDTD_G3_RECORD=docs/validation/g3/r2 D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_physics_g3_b.py tests/test_physics_g3_b_r2.py -k "g3_08 and not g3_08_grating_cuda_layer_a" --junitxml=D:/TorchFDTD/.local/tmp/junit/G3-08r2.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.render_g3_b
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G3-08 --command "<the command above>" --junit D:/TorchFDTD/.local/tmp/junit/G3-08r2.xml --exit-code 0 --fixture docs/validation/cases/G3-08r2_bloch_grating_rcwa_layer_a.json --observed docs/validation/g3/r2/G3-08r2_observed.json --artifact docs/validation/g3/r2/G3-08.json --artifact docs/validation/g3/r2/G3-08r2.json --scope "..." --note "..."
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G3-08   (and G3-04, G3-05, G3-13)
```

**Measurements and pre-declared limits.**
- G3-08 revision 2: all twelve layer-A instances pass the pair; the former failing instance TM 20 degrees 0.92 um has relative difference 1.15e-4 and sits 6.7e-7 inside rtol abs(cpu) + atol, the largest margin is 1.4e-5. The re-run of the twelve judged physics rows (subpixel, h = 0.005 um, 300 fs, CUDA FP32) gives efficiency errors at most 0.0031, dominant phase errors at most 0.0143 rad and sums of T and R within 0.0069 of one, all within the unchanged limits; staircase and duration controls re-recorded. 28 passed, 0 failed, 0 skipped, 2638 s.
- G3-05: the subpixel operator rejects dispersive materials at project validation ("Subpixel interfaces currently require lossless nondispersive materials. Choose staircase for dispersive materials.", from `torchfdtd/models.py` and `torchfdtd/subpixel_geometry.py`), so no subpixel run was possible. The rendered limitation states the sequence from the record: scattering 1658, 271, 138 percent (20 nm), 478, 69, 46 (35 nm), 85, 64, 45 (50 nm) and absorption 3682, 2506, 673; 1813, 559, 499; 309, 340, 345 percent at h = 0.02, 0.01, 0.005 um.

**Passed / failed / skipped / not run.** Revision-2 run 28 passed; the fast run of the new module 1 passed (subpixel rejection) with the twelve layer-A instances skipped behind TORCHFDTD_G3_FULL. Not run: no G3-05 subpixel simulation (rejected by the package); G3-05 was not re-recorded.

**Evidence paths and hashes.** Run 20260921T192159Z-g3-08-12eb742b (VERIFIED) at source commit 6e4f71a plus the spacing fix commit, fixture SHA-256 in its evidence.json; the first run 20260921T181948Z-g3-08-6ccad85a (FAILED) remains first in the task's evidence list. The judge now passes G3-04, G3-08 and G3-13 and fails G3-05.

**Remaining defects, risks, external blockers.** G3-05 stays FAILED by design of the fixture; a conformal or subpixel treatment of dispersive interfaces does not exist in the package. The merged `scripts/render_physics_validation.py` on main imports `RENDERERS` from `benchmarks/render_g3_b.py`, so after merging this branch one run of that script renders the revision-2 table and the limitation paragraph; `docs/validation/g3/r2` and `G3-05_subpixel.json` are read by those functions.

**Next first command and task id.** Merge, rerun `python scripts/render_physics_validation.py` on main, then continue with the remaining G3 tasks.
---

### 2026-09-22 G8-02, G8-03, G8-04 (chunked result storage, workbench journey, editing integrity), branch g8-gui from 73203d2

**Problem or goal.** Choose one chunked result format and read it lazily
with a measured memory bound (G8-02); test the workbench from a GDS import
through materials, source, boundaries, mesh preview, resource preflight, the
job queue with cancel and resubmit, the results overlay and the data and GDS
exports on a CPU-only server (G8-03); implement or verify undo/redo,
multi-select and copy, autosave and recovery, a versioned project, field
validation and stale-result marking (G8-04).

**State found.** HEAD 73203d2, clean worktree, no earlier partial work. The
workbench already had undo/redo (80 snapshots in `remember()`), Duplicate of
one object and autosave to `localStorage` with recovery on load; it had no
multi-selection, no field validation beyond the HTML `min` attribute, no
version fields, no GDS export and cleared the results on Layout. `h5py` 3.16.0
was importable from the interpreter's user site-packages (installed for
tidy3d), not from the project venv; no Zarr. Several source files carry mixed
CRLF/LF endings (`solver.py`, `server.py`, `main.js`, `views.js`,
`style.css`, `pyproject.toml`); edits were re-applied line by line so that only
changed lines differ.

**Changed files (why).**
- `torchfdtd/result_store.py` (new): HDF5 layout 1, `save_hdf5`, `ResultFile`, `PlaneFile`; the format decision (HDF5 over Zarr) in the module docstring. `torchfdtd/solver.py`: `Result.save(path, format=None)`, `Result.open`, `Result.load` dispatch on `.h5`/`.hdf5`. `pyproject.toml`: extra `hdf5 = ["h5py>=3.8"]`; `scripts/provenance_inventory.py` group list, `docs/THIRD_PARTY_NOTICES.md` and `docs/validation/sbom.json` regenerated (h5py BSD-3-Clause; the torch `>=2.4` specifier of the merged packaging branch now appears in the SBOM).
- `torchfdtd/models.py`: `Project.revision`, `Project.content_sha256`, `content_hash`, `content_matches`, `stamped`. `torchfdtd/server.py`: `/api/validate` returns `revision`, `content_sha256`, `stored_content_sha256_matches` and echoes the stamped project; `POST /api/jobs` resolves the plan before taking the queue lock and stores `plan_hash` and `revision` on the job. `torchfdtd/gds_service.py`: `POST /api/gds/export` (base64 GDS plus the layer-stack sidecar, temporary file removed).
- `frontend/src/main.js`: multi-selection (`state.multi`, Ctrl/Cmd+click in the tree and the viewports), Copy/Paste (Ctrl+C/Ctrl+V, ribbon buttons, `placeCopies`), Duplicate and Delete over the selection, `acceptNumber` field validation with `.field-error`, `persist` advancing the revision and clearing the hash, `validate` storing the server hash and the plan hash, `markStale`, the stale banner, Layout keeping results, Save after validation, the recovery message, the Export GDS action. `frontend/src/views.js`: Ctrl-click passes through, every selected object is highlighted. `frontend/src/gds.js`: `setupGdsExport`. `frontend/src/style.css`: stale, field-error, revision, selection and export styles.
- `tests/test_result_store.py` (7), `tests/test_project_versioning.py` (5), `tests/test_workbench_journeys.py` (5), `tests/ui/g8-journey.spec.js` (1), `tests/ui/g8-editing.spec.js` (6), `scripts/run_workbench_journeys.py` (runner and record writer), `docs/validation/workbench/` (the record and its Playwright JSON report).
- `docs/validation/cases/G8-02_chunked_result_storage.json`, `G8-03_workbench_journey.json`, `G8-04_editing_integrity.json`; `docs/validation/completion_gates.json`: `code_paths`, `planned_test_commands`, `required_tests`, `implementation_state` IMPLEMENTED and an `implementation_note` on the three tasks (metadata; states written by the recorder).
- `docs/COMPATIBILITY.md` (Result HDF5 row, the version keys in the Project JSON row, the limitation rewritten), `docs/CHANGELOG.md`, `docs/GDS.md` (browser export), `docs/SECURITY.md` (export path).
- `torchfdtd/web/*`: the bundle is rebuilt in its own commit, the last code commit of the branch, so that other branches rebuilding it conflict on one commit only.

**Commands run (device: local Windows 11, i7-12700, RTX 3060 12 GB shared with other agents, Python 3.10.2 in D:/TorchFDTD/.venv, torch 2.10.0+cu126, Node 22.18.0, Playwright 1.63.0 Chromium headless; TMP and TEMP under D:/TorchFDTD/.local/tmp; `node_modules` was a junction to D:/TorchFDTD/node_modules, removed afterwards).**

```
TORCHFDTD_G8_OBSERVED=D:/TorchFDTD/.local/tmp/junit/G8-02_observed.json D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_result_store.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G8-02.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_project_versioning.py tests/test_project_compatibility.py tests/test_api.py tests/test_compatibility_policy.py tests/test_gds.py tests/test_provenance_inventory.py tests/test_completion_program_documents.py tests/test_release_gates.py tests/test_server_security.py
npm.cmd run build; D:/TorchFDTD/.venv/Scripts/python.exe -m torchfdtd.cli serve --port 8771            (development server for the spec runs below)
TORCHFDTD_URL=http://127.0.0.1:8771 TORCHFDTD_TEST_PYTHON=D:/TorchFDTD/.venv/Scripts/python.exe npx.cmd playwright test tests/ui/g8-journey.spec.js tests/ui/g8-editing.spec.js
TORCHFDTD_URL=http://127.0.0.1:8771 TORCHFDTD_TEST_PYTHON=... npx.cmd playwright test tests/ui/workbench.spec.js tests/ui/gds.spec.js tests/ui/geometry.spec.js tests/ui/materials.spec.js tests/ui/mesh.spec.js tests/ui/execution-modes.spec.js tests/ui/sources.spec.js tests/ui/monitor-outputs.spec.js tests/ui/boundaries.spec.js tests/ui/spectra.spec.js
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py; ... --check
D:/TorchFDTD/.venv/Scripts/python.exe scripts/run_workbench_journeys.py                                  (on the clean tree after the bundle commit: its own CPU-only server on a free port)
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_workbench_journeys.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G8-03.xml
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_project_versioning.py tests/test_workbench_journeys.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G8-04.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G8-0N --command "<the line above>" --junit D:/TorchFDTD/.local/tmp/junit/G8-0N.xml --exit-code 0 --fixture docs/validation/cases/<case>.json [--observed ... --artifact ...] --scope "..."
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G8-0N
```

**Measurements and pre-declared limits.** G8-02: the synthetic E dataset is
(512, 512, 512, 3) float32, 1,610,612,736 bytes nominal; the file with one
written plane is 1,201,056 bytes (0.075% of the volume, limit 1%); opening it
and reading the stored x plane and a y plane across all 512 x chunks grew the
working set by 3,690,496 bytes (0.23% of the volume) and the peak working set
by 10,047,488 bytes (0.62%) in the development run (5,627,904 and 11,956,224
bytes in the recorded run), both against the declared 5%; every round trip is
exact and the spectra recompute within rtol 1e-12. G8-03: the journey passed
in 9.3 s on the development server (GDS import at 1.8 s, materials 2.1 s,
source and monitor 2.9 s, boundaries 3.6 s, mesh preview 3.8 s, preflight
4.0 s, cancel 5.2 s, rerun 7.4 s, overlay 7.6 s, exports 9.2 s cumulative) and
in 13.9 s in the runner's dry run; the recorded run's numbers are in
`docs/validation/workbench/`. The mesh preview, the summary card and
`/api/mesh/preview` agreed on 160 x 120 x 1 cells (19,200); the cancelled job
reported `cancelled` with fewer than 20000 steps, the rerun 400 / 400 steps;
zero page errors and zero console errors. G8-04: 85 edits then 80 undos land
on the fifth edit's value and an 81st undo changes nothing; three edits raise
the revision by exactly 3 and `/api/validate` confirms the saved hash; the
six editing specs took 32.4, 2.8, 3.4, 2.2, 2.6 and 5.4 s in the dry run.

**Passed / failed / skipped / not run.** Passed: tests/test_result_store.py
7, tests/test_project_versioning.py 5, tests/test_workbench_journeys.py 5
(after the record), the two new specs 7 of 7, the regression selection of
ten existing specs 13 passed and 2 skipped (the two FSP-file tests, skipped
before this branch too), and the 39 tests of the compatibility, API, GDS and
policy files plus 27 provenance and 37 document, gate and security tests.
Failed: none. Skipped: the two pre-existing FSP skips above. Not run: the
full UI suite (40 specs) and the CUDA variants of the journey; the
clean-install check (`tests/test_clean_install.py`) was not rerun and fails
by design on this branch because `pyproject.toml` and the bundle changed
(G8-05 and G8-07 records need the 12-minute rerun after merging).

**Evidence paths and hashes.** Runs 20260921T192908Z-g8-02-76c35baa,
20260921T192925Z-g8-03-25de93db and 20260921T192929Z-g8-04-705af196, all
VERIFIED at source commit 579c27d (the record commit after the bundle commit
eb20946) with an empty dirty manifest; evidence.json SHA-256 prefixes
f495beffc83b1826, 7fd01c2f4f81049f and d1e8839e8eeb9683. The journey record
is `docs/validation/workbench/20260921T192723Z-eb209464.json` (7 of 7 passed,
52.4 s wall, journey 8.7 s: GDS import 1.65 s, materials 2.03 s, source and
monitor 2.79 s, boundaries 3.44 s, mesh preview 3.69 s, preflight 3.85 s,
cancel 5.03 s, rerun 7.17 s, overlay 7.32 s, exports 8.70 s cumulative; the
editing specs 28.3, 2.4, 1.8, 1.7, 1.8 and 4.3 s) with its Playwright JSON
report beside it (SHA-256 889d861bd4b39a8d). The recorded G8-02
metrics: working-set growth 5,627,904 bytes (0.35% of the nominal volume),
peak working-set growth 11,956,224 bytes (0.74%), stored file 1,201,056 bytes.
The judge passes all three tasks; its two failures are G3-05 and G3-08, outside
this branch.

**Remaining defects, risks, external blockers.**
- `tests/test_clean_install.py::test_record_matches_the_current_packaging_inputs_and_wheel` fails until `scripts/clean_install_check.py` is rerun (pyproject extra and the bundle changed), as every bundle rebuild does.
- Project JSON files that carry `revision` and `content_sha256` are refused by builds before this branch (`extra='forbid'`); schema 1 keeps its number because files without the keys load unchanged. The G8-01 fixtures and their evidence are untouched.
- Stale marking follows `plan_hash`; a precision or backend change alone does not mark results stale (the run summary prints both). Dragging in a viewport moves the dragged object only, not the whole selection.
- The workbench downloads NPZ only; the HDF5 form is reachable from Python. h5py came from the user site-packages of the interpreter, not from the venv; a clean venv needs `pip install torchfdtd[hdf5]`.
- `scripts/run_workbench_journeys.py` needs Node, `npm ci` and the Playwright Chromium; it starts the server with `CUDA_VISIBLE_DEVICES=-1` so the record is CPU-only by construction (an empty value leaves `torch.cuda.is_available()` true with no device and `/api/health` fails on `get_device_name(0)`).

**Next first command and task id.** Rerun the clean-install check after the
merge so the G8-05 and G8-07 records match the merged bundle and pyproject:

```
D:/TorchFDTD/.venv/Scripts/python.exe scripts/clean_install_check.py --local-root D:/TorchFDTD/.local --find-links D:/TorchFDTD/.local/wheels --cuda-torch "torch==2.10.0+cu126"
```

---

### 2026-09-22 stability sweep and adjoint leak soak, branch soak-stability from 6eb7996

**Problem or goal.** Hunt two defect classes seen before: field-energy
divergence in long runs and unbounded memory or cache growth across repeated
adjoint calls. Declare the criteria first, run a bounded matrix on the shared
RTX 3060 and the CPU, record everything, render the documents from the
records, and add the validation-time warning for dispersive media inside the
PML that the default `pml_dispersion='ade'` still needs.

**State found.** HEAD 6eb7996, clean worktree, no earlier partial work. The
recorded dispersive-in-PML divergence (docs/BOUNDARIES.md: 20 nm SiN posts,
12-layer CPML, RTX 5880, domains beyond a few micrometres) had the opt-in
`'frozen'` remedy but no warning. The per-process reservation registry named
in the brief is on branch g5-memory (649ad79), not in this tree.

**Changed files (why).**
- `benchmarks/stability_sweep.py` (new): 56 rows of 20,000 steps sampled every 250 steps (state norm through a wrapped `DecayDecision.update`, interior epsilon|E|^2+|H|^2 through a wrapped `StateDiagnostics.measure`, manual loops for the reversible, streamed and tensor-media paths), `--rows`, `--skip-cuda`, `--quick`, `--merge`, `--rejudge`, `--render`. `docs/validation/cases/STABILITY_SWEEP.json` (criteria before the run, commit 8167030), `docs/validation/stability_sweep_3060.json`, `docs/STABILITY_SWEEP.md` (rendered).
- `torchfdtd/stability_checks.py` (new): `dispersive_structures_in_pml` and `stability_warnings`; `torchfdtd/server.py` appends them to the `/api/validate` warnings and `torchfdtd/cli.py` to the printed and saved `run` summary (two lines each, endings preserved). The numeric modules owned by fix-review-core and `solver.py` are untouched: an earlier commit of this branch put the warning into `estimate()`, and d1a0018 moved it out again. `docs/BOUNDARIES.md`: the warning and the sweep's numbers under "Dispersive materials inside PML".
- `benchmarks/adjoint_leak_soak.py` (new): eight paths, 150 forward+backward+Adam iterations, samples every 10 after `synchronize` and two `gc.collect`, `--paths`, `--iterations`, `--merge`, `--rejudge`, `--note`, `--render`. `docs/validation/cases/ADJOINT_LEAK_SOAK.json` (declared at 8167030), `docs/validation/adjoint_leak_soak_3060.json`, `docs/ADJOINT_LEAK_SOAK.md` (rendered, with the module-level state statement).
- `tests/test_stability_sweep.py` (16): the record covers the matrix, every verdict re-derived from the samples, failing rows need findings, the document equals `render(record)`, the warning through `stability_warnings`, `/api/validate` and the CLI, five 3000-step fixture regressions, the rejected tensor admission, the capture of a fired check, the interior mask. `tests/test_adjoint_leak_soak.py` (12): record and document checks plus 30-iteration CPU regressions of the seven differentiable families asserting zero growth of live tensors and solver state holders.
- `docs/CHANGELOG.md` (three lines).

**Commands run (device: local Windows 11, i7-12700, RTX 3060 12 GB shared with other agents and a running suite, Python 3.10.2 in D:/TorchFDTD/.venv, torch 2.10.0+cu126, CuPy 13.6.0, psutil 7.2.2; TMP and TEMP under D:/TorchFDTD/.local/tmp; CPU rows with 4 torch threads).**

```
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.stability_sweep --skip-cuda                       (43 rows, 1703 s)
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.stability_sweep --merge --rows sin-posts-ade-2d sin-posts-frozen-2d sin-posts-ade-2d-cuda sin-posts-frozen-2d-cuda tensorbatch-vacuum-2d tensorbatch-n35-2d vacuum-2d-cuda slab-n35-2d-cuda drude-slab-ade-2d-cuda drude-slab-frozen-2d-cuda lorentz-slab-ade-2d-cuda lorentz-slab-frozen-2d-cuda metal-slab-ade-2d-cuda
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.stability_sweep --rejudge                         (adds the reported late-trend columns, no rerun)
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.adjoint_leak_soak                                 (8 paths, 738 s)
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.adjoint_leak_soak --rejudge; ... --note "..." (five notes)
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_stability_sweep.py tests/test_adjoint_leak_soak.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_solver.py tests/test_api.py tests/test_materials.py tests/test_multipole.py tests/test_run_control.py tests/test_capability_pairs.py tests/test_plan.py tests/test_boundaries.py tests/test_completion_program_documents.py tests/test_provenance_inventory.py tests/test_compatibility_policy.py
```

**Measurements and pre-declared limits.** Stability: 56 of 56 rows pass
(growth ratio limit 1.5; last/peak limit 1.0 open, 1.001 closed; no fired
check). Float64 CPU rows: worst growth ratio 0.192 (subpixel-3d, still
draining after 20,000 steps), worst last/peak 0.0639 (subpixel-2d); the
dispersive slabs crossing the lateral PML with `ade` end at 7.7e-9 to 8.7e-7
of their post-source peak; the 20 nm SiN post array ends at 5.9e-17 (float64)
and 4.5e-11 (CUDA float32). Float32 rows settle on a round-off floor of 1.7e-13
to 3.1e-13 of the overall peak whose state norm creeps 17 to 39 percent over
the last 15,000 steps with a constant peak field (recorded in the late-trend
table, judged ratios at most 0.25). Closed cavities: pmc-pec-cavity-3d growth
1.034 and last/peak 0.891, reversible-vacuum-3d 1.003 / 0.999, reversible-n35-3d
1.005 / 0.892. The rejected tensor diag(2,3,4) is refused by the y_min face
admission. Leak soak: after the 20-iteration warm-up every path has exactly
zero growth of torch allocated and reserved bytes, CuPy pool (0 bytes, unused),
live tensors, CUDA graphs, the four `lru_cache` sizes and every counted state
holder; gc objects grow by one per sample (the sample dict). Three paths fail
the 2 MiB host allowance by one step each: differentiable_cuda_torch RSS
+2,670,592 B (iteration 40 to 50), dispersive_cuda private +33,353,728 B with
RSS +49,152 B (iteration 30 to 40), tensor_project_cuda RSS +2,146,304 B
(iteration 20 to 30); over iterations 50 to 150 the same measures move by at
most 61,440 B. Unrecorded probes: 500 iterations of differentiable_cuda_torch
in a fresh process moved RSS by 0.8 MiB with no step above 0.5 MiB; 80
iterations of dispersive_cuda showed no step above 1.1 MiB; a 200 s pure-torch
CUDA autograd loop showed none.

**Passed / failed / skipped / not run.** Passed: tests/test_stability_sweep.py
16, tests/test_adjoint_leak_soak.py 12, the eight existing solver/API/material
suites 219, the three document/provenance/policy suites 36. Failed: none in
tests; three leak-soak paths fail the declared host allowance by one-time
steps and are recorded as findings, not fixed (no Python reference holds
anything). Not run: 3D variants of the streamed and tensor-batch rows (2D only),
CUDA variants of the 3D rows, the RTX 5880 fixture of the documented
divergence (domains beyond 200 x 200 cells are outside the shared-GPU budget),
CuPy-pool paths (the fused kernels allocate through torch, so the pool stays at
zero and its allowance was never exercised).

**Evidence paths and hashes.** `docs/validation/stability_sweep_3060.json`
(run at 8167030 with the working files dirty, 1757 s wall),
`docs/validation/adjoint_leak_soak_3060.json` (run at a248548, 738 s wall);
both carry the SHA-256 of the driver and the solver modules they exercise;
the recorded hash of `torchfdtd/solver.py` is that of the LF-normalized
working copy the runs used, which carried the warning inside `estimate()`
(warnings only; no numerical path differs from the committed 6eb7996 file the
branch now keeps).

**Remaining defects, risks, external blockers.**
- The documented `ade` divergence is not reproduced within the sweep's bounded fixtures; the warning is the only behavioural change. Reproducing it needs the larger domain of the BOUNDARIES.md paragraph on a GPU that is not shared.
- No patch is pending for the files owned by fix-review-core (`plan.py`, `identity.py`, `materials.py`, `models.py`, `capabilities.py`, `streamed_restart.py`, `execution_modes.py`); neither the sweep nor the soak needed a change inside them.
- Float32 rows show a linear creep of the state norm on the round-off floor (1e-13 of the peak) with a constant peak field; it is recorded, not judged, and needs a longer run to separate accumulated round-off from a very slow mode.
- The 31.8 MiB private-bytes step is consistent with WDDM relocating device allocations on the shared display GPU but was not proven with driver tools; rerun the soak on a dedicated GPU to confirm it disappears.
- When g5-memory's live-reservation registry merges, add its size to `benchmarks/adjoint_leak_soak.py::cache_sizes` and to the case's measure list.

**Next first command and task id.** After merging, rerun the soak on a GPU
without display clients to settle the host-step attribution:

```
D:/TorchFDTD/.venv/Scripts/python.exe -m benchmarks.adjoint_leak_soak --paths differentiable_cuda_torch dispersive_cuda tensor_project_cuda --merge
```
