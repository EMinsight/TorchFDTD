# Platform matrix (WORKSTATION profile)

Task G4-01 of the [completion program](COMPLETION_PROGRAM_KO.md). A row lists a
platform's GPU, driver, CUDA runtime, Torch, CuPy, Python and OS only when a
record written by `scripts/platform_report.py` exists under
`validation/platforms/`; every other cell of a platform without a record reads
`not recorded`. `tests/test_platform_matrix.py` checks that every value in this
table comes from its record file, so no platform is assumed. "Verified by"
names the G4 gate tasks whose evidence runs were recorded on that platform; a
platform with a record but no evidence is inventoried, not verified.

| Platform id | GPU | Compute capability | Driver | CUDA runtime | torch | CuPy | Python | OS | Record | Verified by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rtx3060-win11-lab | NVIDIA GeForce RTX 3060 | 8.6 | 591.86 | 12.6 | 2.10.0+cu126 | 13.6.0 | 3.10.2 | Windows-10-10.0.26200-SP0 | [rtx3060-win11-lab](validation/platforms/rtx3060-win11-lab.json) | G4-01 to G4-06 evidence runs listed in [validation/completion_gates.json](validation/completion_gates.json) |
| rtx5880-ada-win11-remote | not recorded | not recorded | not recorded | not recorded | not recorded | not recorded | not recorded | not recorded | not recorded | none: the G4 tests have not been run there |

## Notes

- The RTX 3060 host is shared by several agents during development; the G4
  tests keep every CUDA grid at or below 32^3 cells so they run beside other
  work. The record's `free_memory_bytes_at_record` is the free memory at the
  moment of the inventory, not a guarantee.
- The remote RTX 5880 Ada workstation appears in earlier measurement records
  (for example `validation/tiled-stitching-scale-5880.json` names the GPU and
  torch 2.10.0, and [ACCEPTANCE.md](ACCEPTANCE.md) records full-suite passes
  there), but no `platform_report.py` record exists for it, so its row stays
  `not recorded` until one is written on that machine with
  `python scripts/platform_report.py --id rtx5880-ada-win11-remote`.
- Linux appears only as the CPU-only GitHub Actions job (`cpu-pr` suite, no
  GPU); it is not a CUDA platform and has no row here. macOS has no test
  record of any kind.
- The two-GPU HPC profile has no platform at all; see
  [RELEASE_SCOPE.md](RELEASE_SCOPE.md).
