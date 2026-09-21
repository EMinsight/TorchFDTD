# Direct comparisons with Meep: shared rules for the example authors

This directory holds three worked examples that set up the same photonic device in
TorchFDTD and in Meep, run both on the same workstation, and compare the physics and
the wall time. The examples are user-facing: a reader must be able to run each pair
of scripts and reproduce the table in the README. Everything below applies to every
example.

## Environment (one workstation, one GPU)

- Windows 11 host, i7-12700 (12 physical cores, 20 logical CPUs in WSL2), RTX 3060 12 GB.
- Both solvers run inside the WSL2 distribution `torchfdtd-bench`:
  - TorchFDTD: `/root/torchfdtd-bench/venv/bin/python` (torch 2.11 cu128, cupy 14.2, fused CUDA kernels).
    The venv's installed `torchfdtd` points at `/mnt/d/TorchFDTD`; always run with
    `PYTHONPATH=/mnt/d/TorchFDTD/.local/worktrees/meep-examples` and assert in the script that
    `torchfdtd.__file__` starts with that path.
  - Meep 1.34.0 (double precision, MPI): `MAMBA_ROOT_PREFIX=/root/torchfdtd-bench/micromamba /root/torchfdtd-bench/bin/micromamba run -n meep mpirun -np <ranks> python <script>` with `OMP_NUM_THREADS=1`.
- Launch from Windows as `wsl.exe -d torchfdtd-bench -- bash -lc "<command>"`. Paths under
  `/mnt/d/TorchFDTD/.local/worktrees/meep-examples/...`. Write outputs under that worktree only;
  never under `/root` except caches that already exist, never on the C: drive, never in
  other worktrees.
- Development runs: Meep with 4 ranks, so that other jobs on the host keep running.
  The final timing uses 12 ranks and is launched by the maintainer on a quiet host with the
  `--timing` flag described below; you do not run it.
- The existing three-solver benchmark drivers in
  `/mnt/d/TorchFDTD/.local/worktrees/cross-solver/benchmarks/cross_solver/` (uncommitted, read
  only) show how each solver was configured fairly (`common.py`, `torchfdtd_driver.py`,
  `meep_driver.py`): reuse the ideas, not the files. Each example must be self-contained.

## Fairness rules (both scripts must agree, and the record must prove it)

- Same physical geometry from one JSON geometry file that both scripts load.
- Same mesh spacing, same time step (same Courant number), same number of steps, same physical
  run time. Meep works in units of 1 um = 1; convert once and assert the cell counts and `dt`
  match to 1e-9 relative in both records.
- Same absorbing-layer thickness in cells (Meep PML versus TorchFDTD CPML: only the
  thickness is identical; say so in the example README).
- Same source: one sampled Gaussian pulse (centre wavelength, width) injected as an additive
  current with the same spatial support; the amplitude convention differs between the solvers,
  so every reported quantity is a ratio to a normalisation run of the same solver (empty cell,
  straight bus, or bare substrate), never a raw amplitude.
- Same monitor planes at the same cell indices, same frequency samples, same DFT window.
- Same material sampling: Meep `eps_averaging=False`; TorchFDTD staircase (no subpixel).
- No solver-specific tricks that the other solver does not get (no symmetry planes, no
  subpixel smoothing, no coarse-then-fine).

## What each example produces

- `examples/meep_comparison/<name>/geometry.json`: the shared device.
- `examples/meep_comparison/<name>/torchfdtd_<name>.py` and `meep_<name>.py`: each writes
  `docs/validation/meep_comparison/<name>_torchfdtd.json` / `<name>_meep.json` with the raw
  observables (spectra, profiles), the grid facts (cells per axis, dx, dt, steps, PML cells,
  ranks or device), the environment (solver versions, host, GPU name) and timing
  (`setup_seconds`, `stepping_seconds`, `full_seconds`, `host_load_note`). Every script takes
  `--out <path>`, `--ranks` (Meep) and `--timing` (repeats the timed solve three times after
  one warm-up and stores the samples; without it one run is stored and `timing_mode` says
  `development`).
- `examples/meep_comparison/<name>/compare.py`: reads the two JSON records only (no
  simulation), computes the agreement metrics declared in `criteria.json` (declared BEFORE
  the first comparison run; do not edit the criteria after seeing the numbers, add a note
  instead), writes `docs/validation/meep_comparison/<name>_comparison.json` and renders
  `docs/figures/meep_comparison/<name>.png` (matplotlib, both solvers overlaid) from the
  records. Figures are rendered from saved data, never inside the simulation scripts.
- `examples/meep_comparison/<name>/README.md`: what the device is, the fixture numbers, the
  fairness statement, how to run the three commands, and the table produced by `compare.py`
  (paste the rendered table; a test regenerates it and compares).
- Tests in `tests/test_meep_comparison_<name>.py`: (1) `compare.py` reproduces the committed
  comparison JSON and the README table from the committed records; (2) the two records agree
  on cells, dx, dt, steps, PML cells and geometry hash; (3) the declared criteria pass. Tests
  must not run Meep or a long simulation (they read records).

## Reporting

Report numbers, not adjectives: no "excellent agreement", no "significantly faster". State the
measured differences with their criteria, the timing with its load condition, and every
deviation from this brief with the reason.
