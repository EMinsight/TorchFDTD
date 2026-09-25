# Private development preview

Version: **0.16.0**. Repository:
[hyoseokp/TorchFDTD](https://github.com/hyoseokp/TorchFDTD).

This repository is staged privately under the user's GitHub account. It is an
experimental development snapshot, not a completed replacement for another
solver. Public-release conditions remain recorded in
[RELEASE_REVIEW.md](RELEASE_REVIEW.md).

## Included

- Python/JSON simulation API and browser CAD workbench.
- CPU/CUDA FDTD, native fused CUDA updates and selective plane DFT.
- Independent process batches, shared CUDA tensor cohorts and black-box design
  objectives. Checkpointed Torch adjoints support the explicitly documented
  nondispersive subset and resident dispersive parameters. Spatial streaming
  and gradient-driven examples are experimental. General differentiability and
  validated application-level inverse design remain incomplete.
- Authored examples, native/analytic validation, explicit feature checklist and
  supported FSP import/writeback subset.
- Technical manuscript draft by Hyoseok Park, with TeX and PDF. The manuscript
  describes its recorded development snapshot and does not establish later
  interoperability additions or current-release commercial speedups.

The README's primary comparison is the historical Lumerical CPU versus native
GPU timing table. It does not establish current-version, equal-accuracy or
Lumerical GPU performance. The raw commercial projects, logs and field results
are excluded from this repository. Credentials, SSH records, work directories,
virtual environments and local results are also excluded.

## Install and run

Use Python 3.10 or newer in a virtual environment. Install a PyTorch build
appropriate for the machine's CPU or NVIDIA CUDA environment first. Tested
workstation validation used PyTorch 2.10.0 and an RTX 5880 Ada.

From a checkout:

```sh
python -m pip install -e '.[dev]'
torchfdtd serve
```

For the current TorchFDTD APIs, build a wheel from the current checkout:

```sh
python scripts/build_preview.py
cd dist/private-preview
python -m pip install torchfdtd-0.16.0-py3-none-any.whl
torchfdtd serve
```

The older `v0.14.0.dev0` GitHub prerelease is a historical PhotonWeave snapshot.
Its assets predate the TorchFDTD rename and the newer physics APIs. The current
branch and a freshly built wheel are the supported development install routes.
Historical release tags and artifacts are retained rather than overwritten.

The wheel includes the built browser assets. Development builds use
`npm ci && npm run build`. `python scripts/build_preview.py` builds the wheel
from a fresh staging directory and verifies its payload against current source,
avoiding stale assets from an earlier build. The optional `cuda-kernels` extra installs CuPy for
the fused CUDA execution path. See the main README for runtime requirements and
the [Python/batch guide](PYTHON_BATCH.md) for headless execution.

## Remaining public-release work

The full checklist still includes unimplemented physics and workflow functions.
General FSP compatibility and external acceptance of authored records are not
established. Compatibility-derived pulse rules and catalogue provenance also
require the review recorded in the distribution document. Private staging does
not resolve those questions or provide a legal guarantee.

The local and RTX 5880 Python results, browser evidence and package checks are
recorded in [ACCEPTANCE.md](ACCEPTANCE.md). Linux CI for revision `4dc3024`
passed 1,590 Python and 42 browser tests, with 457 and 8 environment-dependent
skips, plus the frontend and wheel builds. Subsequent solver changes require
their own CI evidence. The acceptance record separates historical results from
current feature completion gates.
