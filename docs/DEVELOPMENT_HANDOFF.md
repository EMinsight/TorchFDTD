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
```
