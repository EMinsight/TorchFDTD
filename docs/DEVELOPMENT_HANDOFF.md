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
