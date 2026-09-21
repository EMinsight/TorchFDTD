# Release-candidate procedure (G9-06)

Task G9-06 of the [completion program](COMPLETION_PROGRAM_KO.md) requires every
required gate to be run on the exact source tree and wheel of the release
candidate. A pass recorded at an earlier commit, combined with partial checks
after it, is not a pass of the candidate; long-run evidence is reused only when
the hashes it was tied to are unchanged and the judge accepts it. This page is
the ordered list of commands that produces that record. Each step names the
tool, what it writes and what must be true before the next step starts.

Preconditions on the RTX 3060 host: a clean checkout of the candidate commit at
`D:/TorchFDTD` (or a worktree checked out by hash as
[GPU_RUNNER_POLICY.md](GPU_RUNNER_POLICY.md) describes), the development
interpreter `D:/TorchFDTD/.venv/Scripts/python.exe`, `TMP` and `TEMP` set to
`D:/TorchFDTD/.local/tmp`, a local wheel cache under `D:/TorchFDTD/.local/wheels`,
no other GPU work on the host, and the [RELEASE_REVIEW.md](RELEASE_REVIEW.md)
gates read. Every command below runs from the checkout root in PowerShell.

## 1. Fix the candidate

```powershell
git status --porcelain            # must print nothing
git rev-parse HEAD                # the candidate commit; every record below cites it
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py    # the state before the run, for the handoff entry
```

Any change to code, tests, fixtures or documents after this point starts the
procedure again from step 1. The only commits allowed during the procedure add
files under `docs/validation/` (records, evidence runs, the gate file), the
notices and SBOM of step 2 and the two rendered documents of step 6.

## 2. Regenerate the third-party notices and the SBOM

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py
D:/TorchFDTD/.venv/Scripts/python.exe scripts/provenance_inventory.py --check   # must exit 0 with problems: []
```

The write mode rewrites `docs/THIRD_PARTY_NOTICES.md` and
`docs/validation/sbom.json` from the interpreter's package metadata and the
tracked tree; `--check` is stale whenever the tracked tree changed since the
last write (it compares the committed outputs with a fresh build), so the
candidate must carry outputs written from its own tree. Commit both files
("Regenerate the third-party notices and the SBOM for the release candidate")
before the wheel is built, so the wheel and the notices describe the same tree.
The report of step 6 runs the same check and prints its result.

## 3. Build the wheel and check the clean install

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/clean_install_check.py --local-root D:/TorchFDTD/.local `
    --find-links D:/TorchFDTD/.local/wheels --cuda-torch "torch==2.10.0+cu126"
```

This builds the wheel from a fresh staging copy of the package sources into
`D:/TorchFDTD/.local/dist/<commit12>/torchfdtd-<version>-py3-none-any.whl`,
verifies that its payload equals the tree byte for byte, installs it into fresh
CPU and CUDA environments, runs the probes, the server, `torchfdtd doctor` and
the README blocks, and writes `docs/validation/clean_install/<time>-<commit8>.json`.
The record must say `all_passed: true` and `dirty_paths: []`. Commit the record
("Record the clean install of the release candidate"). Note the wheel path and
its SHA-256 from the record; the wheel is the release artifact and is not
rebuilt afterwards.

Check before step 4 that the candidate commit and the wheel's commit differ only
under `docs/validation/`:

```powershell
git diff --stat <wheel source_commit> HEAD -- torchfdtd pyproject.toml README.md LICENSE THIRD_PARTY_NOTICES.txt   # must print nothing
```

## 4. Re-record every gate with the wheel

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/rerecord_gates.py --all --platform rtx3060-win11-lab `
    --wheel D:/TorchFDTD/.local/dist/<commit12>/torchfdtd-<version>-py3-none-any.whl `
    --torch "torch==2.10.0+cu126" --find-links D:/TorchFDTD/.local/wheels
```

`rerecord_gates.py` refuses a dirty tree (the gate file and the runs directory
excepted), installs the wheel with the `dev`, `cuda-kernels` and `gds` extras
into a fresh `D:/TorchFDTD/.local/venvs/rc`, checks that this interpreter imports
`torchfdtd` from its own site-packages and not from the checkout, and then, for
every task whose newest evidence exists, reruns the recorded command with that
interpreter from a working directory under `.local/tmp/rc-work`, with the
recorded environment variables, a fresh JUnit report and absolute test paths.
Each run is recorded with the same case file, the wheel's SHA-256 (`--dist`),
the interpreter's environment (`--interpreter`), the host's platform id
(`--platform`, a record under `docs/validation/platforms/`), a note naming the
replayed run and a scope ending in `re-recorded on <commit> for the release
candidate`. The
table it prints lists task, previous run id, new run id and the state written
to the gate file; the exit status is 0 only when every task is VERIFIED.

Tasks whose recorded command writes records into the tree (the G3 fixtures with
`TORCHFDTD_G3_RECORD=docs/validation/g3`) leave those files modified; the
recorder lists them in `dirty_source_manifest` and the judge reports the
warning. Re-render `docs/PHYSICS_VALIDATION.md` with
`scripts/render_physics_validation.py` and commit the regenerated records with
the evidence.

Every recording of this round runs after the candidate commit, so none needs
`--allow-precommit-junit`, and every guarded file is committed, so none needs
`--allow-dirty`; a run that would need either is not a release-candidate run.
The recorder enumerates every file-level required test with
`pytest --collect-only` under the wheel interpreter and hashes the task's
`watch_paths`, so a partial run or a changed data file cannot pass as VERIFIED.

Tasks that fail here are findings of the candidate. A FAILED task is not
re-run until the defect is fixed, and a fix restarts the procedure at step 1.
Commit the gate file and the new run directories ("Record the release-candidate
gate runs at <commit12>").

## 5. Run the release-full suite on both hosts

On the RTX 3060 host, with the wheel interpreter of step 4 so that the suite
sees the installed package's dependencies and the `--gpu-required` policy:

```powershell
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe scripts/run_suite.py release-full `
    --junitxml=D:/TorchFDTD/.local/tmp/junit/release-full-rtx3060-<commit12>.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G9-06 `
    --command "D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe scripts/run_suite.py release-full --junitxml=D:/TorchFDTD/.local/tmp/junit/release-full-rtx3060-<commit12>.xml" `
    --junit D:/TorchFDTD/.local/tmp/junit/release-full-rtx3060-<commit12>.xml --exit-code $LASTEXITCODE `
    --dist D:/TorchFDTD/.local/dist/<commit12>/torchfdtd-<version>-py3-none-any.whl `
    --interpreter D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe --platform rtx3060-win11-lab `
    --scope "G9-06: release-full suite with --gpu-required on rtx3060-win11-lab at commit <commit12> against wheel <sha256 head>"
```

`run_suite.py` launches pytest from the checkout root, so this suite exercises
the source tree of the candidate; its identity with the wheel is the byte
comparison of step 3, and the installed-package import of step 4 covers the
package as installed. The suite includes the opt-in `long` tests and sets
`TORCHFDTD_RUN_CUDA_BOOTSTRAP_TEST` and `TORCHFDTD_RUN_CPML_KERNEL_CUDA_TEST`;
a CUDA test that skips is a failure. Under `--gpu-required` the only permitted
skips are `optional platform check:` ones (the two-GPU NCCL case, Gloo,
licensed tools).

On the RTX 5880 Ada host (platform record
`docs/validation/platforms/rtx5880-ada-win11-remote.json`; rewrite it with
`python scripts/platform_report.py --id rtx5880-ada-win11-remote` when the
driver, torch or CuPy there changed), check out the same commit by hash,
install the same wheel into a fresh environment, run the same suite and record
it against G9-06 with that checkout's recorder (its hardware and environment
are then the ones written into the evidence):

```powershell
git worktree add D:/TorchFDTD/.local/worktrees/rc-<commit12> <commit>
cd D:/TorchFDTD/.local/worktrees/rc-<commit12>
python -m venv D:/TorchFDTD/.local/venvs/rc
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe -m pip install "torch==2.10.0+cu126" --index-url https://download.pytorch.org/whl/cu126
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe -m pip install "<wheel path on this host>[dev,cuda-kernels,gds]"
D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe scripts/run_suite.py release-full `
    --junitxml=D:/TorchFDTD/.local/tmp/junit/release-full-rtx5880-<commit12>.xml
python scripts/record_gate_evidence.py --task G9-06 --command "..." `
    --junit D:/TorchFDTD/.local/tmp/junit/release-full-rtx5880-<commit12>.xml --exit-code $LASTEXITCODE `
    --dist <wheel path on this host> --interpreter D:/TorchFDTD/.local/venvs/rc/Scripts/python.exe --platform rtx5880-ada-win11-remote `
    --scope "G9-06: release-full suite with --gpu-required on rtx5880-ada-win11-remote at commit <commit12> against wheel <sha256 head>"
git add docs/validation && git commit -m "Record the release-full suite on rtx5880-ada-win11-remote at <commit12>"
```

Transfer that commit to the local repository (fetch from the remote checkout or
a `git bundle`) and merge it; the gate file then lists both runs under G9-06
and the newest one is the judged one, so verify with
`scripts/check_release_gates.py --task G9-06` that both evidence files are
VERIFIED. The remote wheel must have the same SHA-256 as the local one; copy
the file, do not rebuild it.

## 6. Render the report and judge

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe scripts/build_validation_report.py
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_validation_report.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G9-07.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G9-07 `
    --command "D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_validation_report.py --junitxml=D:/TorchFDTD/.local/tmp/junit/G9-07.xml" `
    --junit D:/TorchFDTD/.local/tmp/junit/G9-07.xml --exit-code $LASTEXITCODE --fixture docs/validation/cases/G9-07.json
D:/TorchFDTD/.venv/Scripts/python.exe scripts/build_validation_report.py     # the G9-07 row now carries its run; must print 0 mismatches
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --profile HPC
```

`build_validation_report.py` writes `docs/VALIDATION_REPORT.md` and the
verification cells and stage-status block of `docs/RELEASE_SCOPE.md` from the
gate file, the evidence runs and the records, and prints its consistency
checks (version strings, README numbers, the notices and SBOM check of step 2,
the scope cells); a MISMATCH is a finding to fix at its source, never in the
report. The platform section lists, per platform record, the G4 evidence runs
recorded there.
Commit the two documents with the G9-07 evidence ("Render the validation
report of the release candidate at <commit12>").

The judge's exit status is the technical answer for the WORKSTATION profile:
`RESULT: all judged tasks pass` with exit 0 means every required task is
VERIFIED by evidence tied to this commit, no required test skipped, no
GPU-required skip, no stale hash and no external blocker. HPC stays
`NOT RELEASABLE` while the two-GPU blocker stands. Any other result names the
first failing reason per task. The judge's warnings (runs that predate their
commit, cases declared with their evidence, scope changes pending approval)
do not change the exit status; the report lists them, and the pending scope
changes need the owner's `scope_change_approval` in the gate file before the
candidate is called RC_READY.

## 7. What the result means

- Exit 0 of step 6 is `RC_READY` in the sense of section 11 of the program:
  the technical gates hold on this tree and this wheel. It is recorded in the
  handoff entry with the commit, the wheel hash and the run ids.
- `PUBLIC_RELEASE_AUTHORIZED` is a separate decision of the owner that no file
  in this repository grants; the open gates of
  [RELEASE_REVIEW.md](RELEASE_REVIEW.md) (contract and provenance questions,
  G9-03) are not closed by a passing judge.
- The validation report is an internal record of what was run. It is not an
  attestation by a third party and does not state that the solver is correct
  for problems outside the recorded fixtures.
