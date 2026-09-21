![TorchFDTD](docs/assets/hero.png)

# TorchFDTD

GPU FDTD for photonics: a browser CAD workbench, a Python project API and Torch-differentiable simulations on NVIDIA CUDA. MIT licensed. Not affiliated with Ansys.

## Core features

- **Native CUDA engine.** Fused Yee and CPML kernels, CUDA Graphs, FP32/FP64, complex Bloch fields, CPU fallback.
- **Browser workbench.** Objects tree, XY/XZ/YZ and perspective CAD views, materials, simulation region, layout/analysis modes, field viewer, monitor traces, Python export.
- **Python first.** One `Project` JSON shared with the browser, `BatchRunner` for independent cases across processes and GPUs with resume, `run_tensor_batch` for many structures in one CUDA launch, seeded differential evolution.
- **Inverse design.** Checkpointed and reversible Torch adjoints for dielectric, dispersive (ADE), Bloch, CPML, PEC/PMC, density, polygon/spline shape and source-waveform parameters. Objectives on point signals, plane spectra, N-port S-parameters, far-field and near-zone projections.
- **Beyond VRAM.** Streamed execution across VRAM, DRAM and NVMe with measured memory reservations, a metadata planner and a crash-resumable journal.
- **Physics.** 3D and 2D Yee grids, uniform or graded mesh, per-face CPML, periodic/Bloch, PEC/PMC/symmetry, Drude/Lorentz dispersion with passive fitting, anisotropic tensors, subpixel interfaces, point/sheet/plane/one-way/TFSF/mode sources, DFT monitors, mode ports, near-to-far field, diffraction orders.
- **Interoperability.** GDS import/export with holes, etch layers, sidewall angles and port markers; independent read/write of a documented Lumerical FSP subset.

## How much faster

| Comparison | Setting | Result |
|---|---|---|
| Lumerical FDTD, CPU 16 threads vs TorchFDTD on RTX 5880 | 128³, 2,000 steps, sphere | **15.2×** run wall time (6.5× at 64³) |
| flaport/fdtd on CUDA vs TorchFDTD fused kernels | 64³ and 96³, 800 steps | **16 to 17×** and **10 to 12×** |
| FDTDX 0.6.2 vs TorchFDTD on the same RTX 3060 | 64³ and 96³, 800 steps; 64³ adjoint, 128 steps | **6.8 to 7.3×** and **6.4 to 6.7×** full solve; gradient **2.0×** (reversible) and **52×** (two checkpoints) |
| Meep 1.34, 12 CPU ranks, vs TorchFDTD on the same workstation (RTX 3060, i7-12700) | 64³ and 96³, 800 steps | **38×** and **44×** full solve |
| 16-case parameter sweeps vs flaport/fdtd sequential | 32³ and 64³ | **31 to 44×** and **15 to 16×** |
| Torch CPU vs GPU, differentiable forward and backward | 128 × 64 × 64, 32 steps | **69×** resident, **12×** with DRAM streaming |
| CPU worker vs CUDA worker ensemble | 4 × 64³, 800 steps | **40×** |
| Larger than the GPU, capacity run | 2.42 billion cells, 58 GB (54 GiB) of E/H on a 48 GiB GPU, 10 steps plus full material gradient | 2.23 GB peak CUDA memory, 58 min, gradient within 9.1e-8 of the oracle |
| Larger than the GPU, crash and resume | 2.26 billion cells, 54 GB (50.6 GiB) of E/H, same policy | killed after the first backward record, resumed process finishes with 3.03 GB peak CUDA memory and the gradient within 9.1e-8 |

Every row has its conditions, hardware and raw records in [docs/MEASUREMENTS.md](docs/MEASUREMENTS.md). The FDTDX and Meep rows come from the same-hardware comparison in [docs/CROSS_SOLVER_COMPARISON.md](docs/CROSS_SOLVER_COMPARISON.md), whose slab and Mie-sphere accuracy agrees between the three solvers within 0.7 percent. The two beyond-VRAM rows are ten-step capacity gates, not sustained optimizations. The Lumerical rows are aggregate timings of earlier builds; no commercial data is redistributed.

## Execution modes

The workbench's FDTD panel has a **GPU** switch and a **Memory** selector; `/api/validate` reports the resolved mode before a run and the results panel reports what ran.

| Mode | When | What it costs | Limits |
|---|---|---|---|
| GPU switch ([docs](docs/EXECUTION_MODES.md#gpu-switch)) | A CUDA device is reported; CuPy adds the fused kernels | Nothing beyond the device | Without CuPy the PyTorch kernels run and streamed tiles fall back to the CPU |
| Resident ([docs](docs/EXECUTION_MODES.md#memory-modes)) | The estimate fits 75% of free VRAM (80% of RAM on CPU) and at most 8 million cells | The fastest path, live frames | The whole grid in one memory |
| Streamed DRAM ([docs](docs/EXECUTION_MODES.md#how-auto-decides)) | The grid exceeds the device but the conservative reservation fits 80% of available RAM | Slab traffic every temporal block; 5.5 to 11 times the resident time in the records | Forward only, one final snapshot, no dispersive/TFSF/subpixel/PMC scenes |
| Streamed disk ([docs](docs/EXECUTION_MODES.md#choosing-a-scratch-disk)) | The DRAM banks do not fit; scratch space is admitted up to 80% of the free volume | The same slabs through buffered file I/O; 1.9 to 2.4 times the DRAM time in the records | As above, plus a scratch directory to manage |
| Tiled approximate ([docs](docs/TILED_STITCHING.md)) | A planar device fits no tier at all | Overlapping resident tiles: about 2.5 times the device cells at 1.5 um overlap, longer than the whole device would take | Exact only for an empty region or when every tile holds every scatterer; near-field error of 5 to 12% in the records, read the mismatch indicator; forward only in the browser |

**Large devices.** Auto keeps a scene resident when it fits, then streams it through DRAM or disk: the streamed X-slab engine stitches its halos exactly, step by step, so a scene that fits either tier gives the resident answer. Tiling is for a device that fits no tier. It is an approximate method whose error decays with the distance to the cuts on a scale of a few micrometres: on a 40 um pillar array cut into 20 um cores, the stitched near field differs from the whole device by 23% at 2 um overlap and 6% at 10 um, by 1.7% more than 10 um from the cuts at that overlap, and the focal intensity by 4% ([record](docs/TILED_STITCHING.md#wide-tile-cores)). The neighbour mismatch inside the shared overlap is the indicator the workbench shows; it bounds the error (two to four times the stitched error in the records) but does not calibrate it. The tiled adjoint remains a Python API. Beyond the output plane of any of these runs, the workbench's angular-spectrum panel propagates the stored DFT plane through the exterior instead of meshing it: on the recorded metalens the xz section through the focus differs from FDTD through the focus by 1.8% in intensity and took 0.035 s against 60 s ([docs/ANGULAR_SPECTRUM.md](docs/ANGULAR_SPECTRUM.md)).

## Compared with FDTDX

Ahead: browser CAD, FSP interoperability, same-GPU structure batches, beyond-VRAM streaming with restart, GDS export and browser import, shape derivatives on top of density parameterization.
Equal: nonuniform meshes, dispersive materials, anisotropic materials, boundaries, mode sources and ports, far-field projection, differentiable physics with fixed eigenmodes.
Behind: single-problem multi-GPU (verified with CPU ranks only). Row-by-row evidence: [docs/FDTDX_PARITY_KO.md](docs/FDTDX_PARITY_KO.md).

## Quick start

Python 3.10 or 3.12 and a [PyTorch](https://pytorch.org/get-started/locally/) build for the machine: CUDA for GPU execution, CPU otherwise. The versions that were installed and run are listed in [docs/INSTALL.md](docs/INSTALL.md). The `cuda-kernels` extra installs CuPy, which the fused CUDA kernels and the real-field CUDA adjoint use; without it the `torch` kernel runs.

Install the wheel; it carries the built browser workbench, so no Node.js and no checkout are needed:

```powershell
python -m venv torchfdtd-env
torchfdtd-env/Scripts/python.exe -m pip install torch --index-url https://download.pytorch.org/whl/cu126
torchfdtd-env/Scripts/python.exe -m pip install "torchfdtd-0.14.0.dev0-py3-none-any.whl[cuda-kernels]"
torchfdtd-env/Scripts/torchfdtd doctor
torchfdtd-env/Scripts/torchfdtd serve
```

`torchfdtd doctor` reports Python, torch, CuPy, the CUDA runtime and driver, the device, a fused-kernel launch and the backend a project will use, with one message per unsupported situation. Open http://127.0.0.1:8765 (loopback only; use SSH forwarding for a remote GPU).

To develop from a checkout instead, Node.js 20.19+ / 22.12+ rebuilds the workbench assets under `torchfdtd/web`:

```powershell
python -m venv --system-site-packages .venv
.venv/Scripts/python.exe -m pip install -e ".[dev,cuda-kernels]"
npm.cmd ci
npm.cmd run build
.venv/Scripts/python.exe -m torchfdtd.cli serve
```

<!-- readme-example: cuda -->
```python
from torchfdtd import Project, Region, Structure, Source, Monitor, Simulation

project = Project(
    name="My waveguide",
    region=Region(dimension="3d", size=(8, 6, 2), mesh=0.05, steps=1000,
                  backend="cuda", cuda_kernel="fused"),
    structures=[Structure(name="core", size=(8, 0.65, 0.4))],
    sources=[Source(center=(-2.5, 0, 0), wavelength=1.55)],
    monitors=[Monitor(name="output", center=(2, 0, 0))],
)
project.save("project.json")          # opens in the browser
result = Simulation(project).run()
result.save("results/run.npz")
```

Lengths are in µm and time arrays in seconds. `dimension` defaults to `"2d"` and `cuda_kernel` to `"torch"`, so the example sets both to run the measured 3D fused path; it needs a CUDA device and the `cuda-kernels` extra. The 2D default runs on any install, and `Result.load()` restores a saved result:

```python
from torchfdtd import Project, Structure, Source, Monitor, Simulation, Result

project = Project(name="Any install", structures=[Structure(name="core", size=(8, 0.65, 0.4))],
                  sources=[Source(center=(-2.5, 0, 0), wavelength=1.55)],
                  monitors=[Monitor(name="output", center=(2, 0, 0))])
result = Simulation(project).run()    # 2D, on the CPU or the CUDA device torch reports
result.save("results/first.npz")
print(Result.load("results/first.npz").summary["backend"])
```

`Project.load()` runs browser-made scenes.

## Documentation

- [Python and batch API](docs/PYTHON_BATCH.md), [tensor batches](docs/TENSOR_BATCH.md), [differentiable FDTD](docs/DIFFERENTIABLE_FDTD.md), [shape gradients](docs/SHAPE_GRADIENTS.md)
- [Streamed execution](docs/STREAMED_FDTD.md), [planner](docs/STREAMED_WORK_PLANNING.md), [restart journal](docs/STREAMED_RESTART.md), [beyond-VRAM records](docs/BEYOND_VRAM_RESTART.md)
- [Mode ports](docs/OPEN_MODE_PORTS.md), [far field](docs/FARFIELD_WORKFLOW.md), [GDS](docs/GDS.md), [FSP](docs/FSP.md), [materials](docs/MATERIALS.md), [boundaries](docs/BOUNDARIES.md)
- [Measurements and feature record](docs/MEASUREMENTS.md), [feature checklist](docs/FEATURE_CHECKLIST.md), [acceptance record](docs/ACCEPTANCE.md)
- [Security model](docs/SECURITY.md), [compatibility and support policy](docs/COMPATIBILITY.md), [changelog](docs/CHANGELOG.md), [third-party notices and SBOM](docs/THIRD_PARTY_NOTICES.md)

## Verification

```powershell
python -m pytest -q
npm run test:ui
```

Validation uses analytic solutions and independently authored CPU/CUDA references; no commercial solver results are used.

## Attribution

[flaport/fdtd](https://github.com/flaport/fdtd) (MIT) supplies the grid foundation. PyTorch, NumPy, FastAPI, Three.js, Lucide and Vite keep their licenses. Contributions are welcome; back numerical changes with CPU/GPU parity checks and reproducible benchmark conditions.
