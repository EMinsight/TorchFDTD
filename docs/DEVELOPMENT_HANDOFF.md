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
