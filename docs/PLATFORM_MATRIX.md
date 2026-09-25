# Platform matrix (WORKSTATION profile)

Task G4-01 of the [completion program](COMPLETION_PROGRAM_KO.md). A row lists a
platform's GPU, driver, CUDA runtime, Torch, CuPy, Python and OS only when a
record written by `scripts/platform_report.py` exists under
`validation/platforms/`; every other cell of a platform without a record reads
`not recorded`. `tests/test_platform_matrix.py` checks that every value in this
table comes from its record file, so no platform is assumed. "Verified by"
names the G4 gate tasks whose evidence runs were recorded on that platform, or
links the platform's G4 run record under `validation/platforms/g4/` when the G4
tests ran there in full outside the gate file (written by
`scripts/record_platform_g4.py` from the JUnit reports and checked by the same
test); a platform with a record but neither is inventoried, not verified.

| Platform id | GPU | Compute capability | Driver | CUDA runtime | torch | CuPy | Python | OS | Record | Verified by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rtx3060-win11-lab | NVIDIA GeForce RTX 3060 | 8.6 | 591.86 | 12.6 | 2.10.0+cu126 | 13.6.0 | 3.10.2 | Windows-10-10.0.26200-SP0 | [rtx3060-win11-lab](validation/platforms/rtx3060-win11-lab.json) | G4-01 to G4-06 evidence runs listed in [validation/completion_gates.json](validation/completion_gates.json) |
| rtx5880-ada-win11-remote | NVIDIA RTX 5880 Ada Generation | 8.9 | 581.80 | 12.8 | 2.10.0 | 13.6.0 | 3.11.14 | Windows-10-10.0.26100-SP0 | [rtx5880-ada-win11-remote](validation/platforms/rtx5880-ada-win11-remote.json) | none yet: the G4 tests have not been recorded on this platform
| rtx3060-wsl2-ubuntu2204 | NVIDIA GeForce RTX 3060 | 8.6 | 591.86 | 12.8 | 2.11.0+cu128 | 13.6.0 | 3.12.14 | Linux-5.15.167.4-microsoft-standard-WSL2-x86_64-with-glibc2.35 | [rtx3060-wsl2-ubuntu2204](validation/platforms/rtx3060-wsl2-ubuntu2204.json) | none yet: the G4 run on this platform has not been recorded |

## Notes

- The RTX 3060 host is shared by several agents during development; the G4
  tests keep every CUDA grid at or below 32^3 cells so they run beside other
  work. The record's `free_memory_bytes_at_record` is the free memory at the
  moment of the inventory, not a guarantee.
- The remote RTX 5880 Ada workstation record was written on that machine with
  `python scripts/platform_report.py --id rtx5880-ada-win11-remote` (deployment
  root redacted in the record); its G4 evidence is recorded separately when the
  G4 tests run there.
- Linux with CUDA appears only as WSL2 (Ubuntu 22.04) on the RTX 3060 lab
  host, row `rtx3060-wsl2-ubuntu2204`: the same GPU and Windows driver reached
  through the WSL CUDA driver, not a native Linux install. Its record was
  written inside the distribution with
  `python scripts/platform_report.py --id rtx3060-wsl2-ubuntu2204` from a venv
  holding torch 2.11.0+cu128 and the extras `dev,cuda-kernels,gds,hdf5`. The
  CPU-only GitHub Actions job (`cpu-pr` suite) is Linux without a GPU and has
  no row here. macOS has no test record of any kind.
- The two-GPU HPC profile has no platform at all; see
  [RELEASE_SCOPE.md](RELEASE_SCOPE.md).
