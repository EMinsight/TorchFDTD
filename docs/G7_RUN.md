# Run the three application workflows from an installed wheel

These commands reproduce the declared G7 metagrating, finite metalens and
photonic integrated circuit studies. Scripts and inputs are in the examples
archive. The solver is imported from the installed release wheel. The archive
contains no `torchfdtd/` source directory.

## Installation

Use Python 3.10 or 3.12 and a CUDA-capable NVIDIA GPU. Download the release wheel
and `torchfdtd-g7-examples.zip` from the same
[GitHub Release](https://github.com/hyoseokp/TorchFDTD/releases/latest).
Keep the environment and working directory outside a source checkout.
In PowerShell, replace the download paths with your local files:

```powershell
python -m venv D:/torchfdtd-study/venv
$py = 'D:/torchfdtd-study/venv/Scripts/python.exe'
& $py -m pip install 'torch==2.10.0+cu126' --index-url https://download.pytorch.org/whl/cu126
& $py -m pip install 'D:/downloads/torchfdtd-1.0.0-py3-none-any.whl[cuda-kernels,gds]'
& $py -m pip install 'torcwa==0.1.4.2'
Expand-Archive -LiteralPath 'D:/downloads/torchfdtd-g7-examples.zip' -DestinationPath D:/torchfdtd-study/examples
New-Item -ItemType Directory -Force D:/torchfdtd-study/results
Set-Location D:/torchfdtd-study/results
$examples = 'D:/torchfdtd-study/examples'
$env:OMP_NUM_THREADS = '2'
$env:MKL_NUM_THREADS = '2'
& $py -c 'import torchfdtd; print(torchfdtd.__file__)'
```

The printed path must be inside the new environment's `site-packages`.
Run the following commands sequentially with the GPU free of other jobs.
Allow several hours in total on an RTX 3060. The full declarations, limitations
and numerical criteria are in [G7_WORKFLOWS.md](G7_WORKFLOWS.md).

## Metagrating: seeds 7, 8 and 9

```powershell
& $py "$examples/examples/g7/metagrating/wheel_entry_r4.py" --stage all --out metagrating --rcwa-python $py
```

This performs six design steps for each seed, eight FDTD evaluations per design,
the two-ridge baseline and the TORCWA comparison. `metagrating/summary.json`
must have `all_passed: true`. Each seed is retained. The TORCWA-assisted
initializer is disclosed in G7-01r4, so the solver comparison is not blind to
initialization. Checkpoint replay is unavailable for this six-step design.
To resume between complete seeds, use `--stage seed --seed N`, then
`--stage baseline`, `--stage rcwa` and `--stage judge` with the same output
directory and `--rcwa-python` argument.

## Finite metalens: library, wider and narrower starts

```powershell
& $py "$examples/examples/g7/metalens/metalens_workflow.py" --output-dir metalens
```

`metalens/summary.json` must have `all_pass: true`. This is the 2D finite lens
fixture at 1.55 um. Its FDTD domain includes the lens and focal region. It also
compares angular-spectrum propagation with direct focal-plane sampling. It is
not a full 3D DBR metalens calculation.

## Photonic integrated circuit: seeds 1, 2 and 3

The filter radius was fixed by the committed development records. Copy those
inputs to the new output directory before running the declared seeds:

```powershell
New-Item -ItemType Directory -Force coupler
Copy-Item -LiteralPath "$examples/docs/validation/g7/G7-03/development" -Destination coupler/development -Recurse
& $py "$examples/examples/g7/coupler/workflow.py" --output-dir coupler
```

Every entry in `coupler/summary.json` under `criteria` must have `passed: true`,
and `judged` must be true. Outputs include binary designs, GDS round trips,
the modal S matrix, gradient checks and fine-mesh checks. The baseline values
are fixed in G7-03r2 and need not be recomputed to run these seeds.

## CPU development examples

These small examples check installation and workflow mechanics. Their coarse
grids and short runs do not satisfy the full acceptance criteria above.

```powershell
& $py "$examples/examples/g7/metalens/metalens_workflow.py" --reduced --backend cpu --iterations 1 --output-dir metalens-small
& $py "$examples/examples/g7/coupler/workflow.py" --reduced --seeds 1 2 3 --output-dir coupler-small
```

## Build the examples archive from a checkout

Release maintainers can reproduce the archive with the standard library alone:

```powershell
python scripts/package_g7_examples.py --out D:/artifacts/torchfdtd-g7-examples.zip
```

`manifest.json` gives the checkout commit and SHA-256 of every included file.
The archive carries input fixtures and examples, with no solver source or
precomputed acceptance outputs. Use a new filename when rebuilding.
