# Raw evidence runs

Every verification that is meant to count toward a gate task is recorded here
by `scripts/record_gate_evidence.py`, after the run and without rerunning
anything. The tool derives the run id, hashes the source tree and the test
files, captures the environment and hardware, parses the JUnit report and
writes the task's state into `docs/validation/completion_gates.json`.
`scripts/check_release_gates.py` reads these directories when judging.

## Layout

```
docs/validation/runs/
  README.md
  <run_id>/
    evidence.json     every required evidence field; null fields carry a reason in null_reasons
    junit.xml         byte-for-byte copy of the JUnit report that was passed in
```

`run_id` is `<UTC timestamp>-<task id>-<8 hex>`, for example
`20260921T135356Z-g1-03-45b82b2c`; the hex is the head of a SHA-256 over the
task, command, source commit and execution timestamp. Directories are never
reused or rewritten: a rerun is a new run id appended to the task's `evidence`
list, and the last entry is the one the judge reads. Large artifacts stay where
the run wrote them and are referenced by path, size and SHA-256 in
`artifact_paths_and_sha256`; the JUnit copy is the only file duplicated here.
The copied JUnit keeps pytest's `hostname` attribute; strip it from the report
before recording if the machine name must not be published, since the recorder
hashes the file it is given.

## Recording

```powershell
D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_detector_allocation.py --junitxml=D:/TorchFDTD/.local/tmp/junit_g1-03.xml
D:/TorchFDTD/.venv/Scripts/python.exe scripts/record_gate_evidence.py --task G1-03 `
  --command "D:/TorchFDTD/.venv/Scripts/python.exe -m pytest -q -p no:cacheprovider tests/test_detector_allocation.py --junitxml=D:/TorchFDTD/.local/tmp/junit_g1-03.xml" `
  --junit D:/TorchFDTD/.local/tmp/junit_g1-03.xml --exit-code $LASTEXITCODE `
  --fixture docs/validation/cases/G1-03_quadrant_allocation_scaling.json
D:/TorchFDTD/.venv/Scripts/python.exe scripts/check_release_gates.py --task G1-03
```

Pass `--exit-code` with the real exit status; without it the recorder derives
one from the report and says so in `exit_code_source`. `--dist` hashes the wheel
or source archive the run installed, `--artifact` references raw result files,
`--observed` attaches measured metrics, `--note` and `--scope` add text.

## What the recorder decides

| Report | Task state written | Judge |
| --- | --- | --- |
| No failures or errors, exit code 0, no test named in the task's `required_tests` skipped or absent, every test source resolved | VERIFIED | passes while the source commit is an ancestor of HEAD and the test, fixture and criteria files are unchanged |
| Any failure or error | FAILED | fails |
| A skip whose reason names CUDA, CuPy or a GPU and does not start with `optional platform check:` (G4-05: a GPU-required test that did not run), whether or not `required_tests` names it | FAILED, listed in `gpu_required_skips` | fails; evidence recorded before the field existed is classified from its skip reasons |
| A required test skipped or absent, a nonzero exit code, an empty report or an unresolved test source | NOT_RUN, with the reason printed | fails |

`required_tests` entries are `tests/<file>.py`, `tests/<file>.py::<function>` or
one parametrized id; a function entry matches all of its parametrized
instances, so a CUDA instance that skips keeps the task NOT_RUN. The recorder
never touches the `blocker` field: an external blocker is cleared by hand when
the resource exists, and the judge fails while it is set.

The evidence of a run recorded on a dirty tree lists the modified and untracked
paths in `dirty_source_manifest` (the gate file and this directory excluded);
the judge reports it as a warning because such a run is not tied to one commit.
Evidence recorded before a later commit stays valid only while its test sources
are byte-identical and its commit is an ancestor of HEAD; `--allow-stale`
overrides that with a loud banner and is not a release judgement.
