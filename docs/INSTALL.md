# Installation

TorchFDTD ships as one pure-Python wheel that carries the built browser
workbench under `torchfdtd/web`. An end user needs Python and a PyTorch build
for the machine; Node.js and a source checkout are only needed to change the
frontend. This page lists the versions that were actually installed and run,
the two install routes, `torchfdtd doctor`, and the maintainer steps that keep
the packaged assets current.

## Versions that were installed and run

Every row is an actual installation into a fresh virtual environment (no
system site-packages) followed by the listed check. Nothing outside this table
is claimed. The raw pip and probe logs of the trial rows are summarised in
[validation/clean_install/version_trials_2026-09-22.json](validation/clean_install/version_trials_2026-09-22.json);
the clean-install rows are the newest record under
[validation/clean_install/](validation/clean_install/), written by
`scripts/clean_install_check.py`.

| Python | torch | numpy | CuPy / CUDA | Check | Outcome |
| --- | --- | --- | --- | --- | --- |
| 3.10.2 | 2.2.2+cpu | 2.2.6 (pip's choice) | none | probe | **failed**: the 2D run passes but `torch.from_numpy` raises `RuntimeError: Numpy is not available` (Windows torch wheels before 2.4 were built against NumPy 1) |
| 3.10.2 | 2.2.2+cpu | 1.26.4 (`numpy<2`) | none | probe, CPU subset | passed; 31 passed, 5 CUDA skips |
| 3.10.2 | 2.3.1+cpu | 2.2.6 | none | probe | **failed**: same `Numpy is not available` |
| 3.10.2 | 2.4.1+cpu | 2.2.6 | none | probe, CPU subset | passed; 31 passed, 5 CUDA skips |
| 3.10.2 | 2.14.0+cpu | 2.2.6 | none | full clean install, README blocks | passed (clean-install record) |
| 3.10.2 | 2.10.0+cu126 | 2.2.6 | cupy-cuda12x 13.6.0, CUDA runtime 12.6, driver 591.86, RTX 3060 | full clean install with `[cuda-kernels]`, fused launch, README CUDA block | passed (clean-install record) |
| 3.12.7 (Anaconda base) | 2.14.0+cpu | 2.5.3 | none | probe, CPU subset | passed; 31 passed, 5 CUDA skips |
| 3.9 | any | any | none | none | not tried: the host has no 3.9 interpreter; the wheel metadata carries `Requires-Python >=3.10` |

The probe imports `torchfdtd` from the environment's own `site-packages`
(never from a checkout), runs a 20 x 20 cell, 80 step 2D scene on the CPU,
saves and reloads the NPZ result and converts a NumPy array through torch. The
CPU subset is `tests/test_solver.py tests/test_api.py tests/test_torch_interop.py
tests/test_project_compatibility.py tests/test_doctor.py`, run by the
environment's `pytest` entry point so that the checkout is not on `sys.path`.

Bounds in `pyproject.toml` that follow from the table:

- `torch>=2.4`: the oldest torch whose Windows wheel works with the NumPy 2
  that pip resolves. torch 2.2 and 2.3 run only with `numpy<2`, a combination
  pip does not pick by itself, so they are excluded rather than documented as
  a trap.
- `numpy>=1.24`: 1.26.4 (with torch 2.2.2), 2.2.6 (with every other torch on
  Python 3.10) and 2.5.3 (Python 3.12) were run; nothing between them was tried.
- `cupy-cuda12x>=13.6,<14`: only 13.6.0 on CUDA runtime 12.6 was run. A CuPy
  build must match the CUDA major version of the torch wheel (`cupy-cuda12x`
  for `+cu12x` torch builds); `torchfdtd doctor` reports a mismatch.
- `requires-python >=3.10`: 3.10.2 carries every record; 3.12.7 passed the
  probe and the subset; 3.11 and 3.13 were not tried.

Not tried: Linux and macOS installs (the CI job in `.github/workflows/test.yml`
installs a CPU torch on Ubuntu with Python 3.11 from a checkout, not from the
wheel), torch builds between 2.4.1 and 2.10.0 or between 2.10.0 and 2.14.0,
CUDA runtimes other than 12.6, drivers other than 591.86.

## Install the wheel

```powershell
python -m venv torchfdtd-env
torchfdtd-env/Scripts/python.exe -m pip install torch --index-url https://download.pytorch.org/whl/cu126
torchfdtd-env/Scripts/python.exe -m pip install "torchfdtd-0.15.0-py3-none-any.whl[cuda-kernels]"
torchfdtd-env/Scripts/torchfdtd doctor
torchfdtd-env/Scripts/torchfdtd serve
```

Use `https://download.pytorch.org/whl/cpu` and drop `[cuda-kernels]` on a
machine without an NVIDIA GPU; every simulation then runs on the CPU. The
pip bundled with Python 3.10 (21.2.4) installs the wheel; upgrading pip is not
required. The wheel is built from a checkout (below) or taken from a release;
`torchfdtd serve` listens on `http://127.0.0.1:8765` only.

Optional extras: `gds` (gdstk for GDS import and export), `dev` (pytest,
httpx, build, psutil), `benchmark` (psutil).

## Install from a checkout

```powershell
python -m venv --system-site-packages .venv
.venv/Scripts/python.exe -m pip install -e ".[dev,cuda-kernels]"
npm.cmd ci
npm.cmd run build
.venv/Scripts/python.exe -m torchfdtd.cli serve
```

`--system-site-packages` reuses a CUDA torch that is already installed in the
base interpreter. Node.js 20.19+ / 22.12+ is needed only for `npm run build`,
which writes the workbench into `torchfdtd/web`; the committed copy there is
what the wheel ships, so a checkout runs the workbench without Node as long as
`frontend/` is unchanged.

## `torchfdtd doctor`

```
torchfdtd doctor          # text report
torchfdtd doctor --json   # the same report as JSON
```

The report lists Python and the platform, torch with its CUDA runtime and
whether a device is available, the NVIDIA driver and the highest CUDA version
it supports, CuPy and whether it imports, the device name, compute capability
and free memory, the result of compiling and launching the fused Yee/CPML
kernels on a 20 x 20 cell, 20 step grid, and the backend and kernel a project
with `backend="auto"` will use. Each check is `OK`, `NOTICE` (a supported
fallback: CPU execution without CUDA, the torch kernels without CuPy) or
`ERROR` (an installation that cannot run as configured: a CUDA torch with a
driver but no usable device, a driver older than the torch CUDA runtime, a
CuPy that does not import, a fused kernel that fails to compile or launch).
The exit code is 0 without errors and 1 otherwise. `tests/test_doctor.py`
covers each situation by monkeypatching, and the real launch runs on the
development GPU.

## Maintainer: frontend assets and the wheel

The wheel ships whatever is committed under `torchfdtd/web`. After any change
under `frontend/`, `vite.config.js`, `package.json` or `package-lock.json`:

```powershell
npm.cmd ci
npm.cmd run build          # vite build --outDir ../torchfdtd/web --emptyOutDir
git add torchfdtd/web
```

and commit the rebuilt assets together with the frontend change. On
2026-09-22 these two commands (Node 22.18.0, npm 10.9.3) in a fresh worktree of
2b64f91 reproduced the committed assets byte for byte, so the build is
deterministic for the locked dependency versions.
`scripts/clean_install_check.py` records `frontend_assets_current`, which is
false when a commit touched the frontend sources after the last commit that
touched `torchfdtd/web`, and `web_assets_match_committed`, which compares the
wheel's `torchfdtd/web` entries with git HEAD byte for byte;
`tests/test_clean_install.py` asserts both.

Build the wheel from a fresh staging copy so that a stale `build/` directory
cannot leak old files in:

```powershell
.venv/Scripts/python.exe scripts/build_preview.py --output dist/private-preview
```

or run the full clean-install check, which builds the wheel the same way and
then installs it into a CPU-only and a CUDA environment, runs the server, the
doctor and every runnable README block, and writes the record that
`tests/test_clean_install.py` reads:

```powershell
.venv/Scripts/python.exe scripts/clean_install_check.py --local-root D:/TorchFDTD/.local --find-links D:/TorchFDTD/.local/wheels --cuda-torch "torch==2.10.0+cu126"
```

`--local-root` holds the venvs, the wheel, the scratch directory and the pip
cache; `--find-links` points at a directory of already downloaded torch and
CuPy wheels so that nothing large is downloaded again; `--skip-cuda` omits the
CUDA environment (the record then fails the G8-05 tests). On Linux the same
command runs unchanged with a Linux `--local-root`. Rerun the check whenever
`pyproject.toml`, `torchfdtd/web`, the two scripts or a runnable README block
changes; the tests compare those inputs with the record.

README blocks: a fenced ```` ```python ```` block runs in the CPU environment
unless the nearest non-blank line above it is `<!-- readme-example: cuda -->`
(runs in the CUDA environment) or `<!-- readme-example: skip: reason -->`.
