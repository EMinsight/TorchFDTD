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
| 16-case parameter sweeps vs flaport/fdtd sequential | 32³ and 64³ | **31 to 44×** and **15 to 16×** |
| Torch CPU vs GPU, differentiable forward and backward | 128 × 64 × 64, 32 steps | **69×** resident, **12×** with DRAM streaming |
| CPU worker vs CUDA worker ensemble | 4 × 64³, 800 steps | **40×** |
| Larger than the GPU | 2.26 billion cells, 54 GiB of E/H on a 48 GB GPU | 2.2 GB peak CUDA memory; a killed run resumes with the gradient matched to 9e-8 |

Every row has its conditions, hardware and raw records in [docs/MEASUREMENTS.md](docs/MEASUREMENTS.md). The Lumerical rows are aggregate timings of earlier builds; no commercial data is redistributed.

## Compared with FDTDX

Ahead: browser CAD, FSP interoperability, same-GPU structure batches, beyond-VRAM streaming with restart, GDS export and browser import, shape derivatives on top of density parameterization.
Equal: nonuniform meshes, dispersive materials, anisotropic materials, boundaries, mode sources and ports, far-field projection, differentiable physics with fixed eigenmodes.
Behind: single-problem multi-GPU (verified with CPU ranks only). Row-by-row evidence: [docs/FDTDX_PARITY_KO.md](docs/FDTDX_PARITY_KO.md).

## Quick start

Python 3.10+ and Node.js 20.19+ / 22.12+. Install a [CUDA-enabled PyTorch](https://pytorch.org/get-started/locally/) first; CPU execution also works.

```powershell
python -m venv --system-site-packages .venv
.venv/Scripts/python.exe -m pip install -e ".[dev]"
npm.cmd ci
npm.cmd run build
.venv/Scripts/python.exe -m torchfdtd.cli serve
```

Open http://127.0.0.1:8765 (loopback only; use SSH forwarding for a remote GPU).

```python
from torchfdtd import Project, Region, Structure, Source, Monitor, Simulation

project = Project(
    name="My waveguide",
    region=Region(size=(8, 6, 2), mesh=0.05, steps=1000, backend="cuda"),
    structures=[Structure(name="core", size=(8, 0.65, 0.4))],
    sources=[Source(center=(-2.5, 0, 0), wavelength=1.55)],
    monitors=[Monitor(name="output", center=(2, 0, 0))],
)
project.save("project.json")          # opens in the browser
result = Simulation(project).run()
result.save("results/run.npz")
```

Lengths are in µm and time arrays in seconds. `Project.load()` runs browser-made scenes; `Result.load()` restores saved results.

## Documentation

- [Python and batch API](docs/PYTHON_BATCH.md), [tensor batches](docs/TENSOR_BATCH.md), [differentiable FDTD](docs/DIFFERENTIABLE_FDTD.md), [shape gradients](docs/SHAPE_GRADIENTS.md)
- [Streamed execution](docs/STREAMED_FDTD.md), [planner](docs/STREAMED_WORK_PLANNING.md), [restart journal](docs/STREAMED_RESTART.md), [beyond-VRAM records](docs/BEYOND_VRAM_RESTART.md)
- [Mode ports](docs/OPEN_MODE_PORTS.md), [far field](docs/FARFIELD_WORKFLOW.md), [GDS](docs/GDS.md), [FSP](docs/FSP.md), [materials](docs/MATERIALS.md), [boundaries](docs/BOUNDARIES.md)
- [Measurements and feature record](docs/MEASUREMENTS.md), [feature checklist](docs/FEATURE_CHECKLIST.md), [acceptance record](docs/ACCEPTANCE.md)

## Verification

```powershell
python -m pytest -q
npm run test:ui
```

Validation uses analytic solutions and independently authored CPU/CUDA references; no commercial solver results are used.

## Attribution

[flaport/fdtd](https://github.com/flaport/fdtd) (MIT) supplies the grid foundation. PyTorch, NumPy, FastAPI, Three.js, Lucide and Vite keep their licenses. Contributions are welcome; back numerical changes with CPU/GPU parity checks and reproducible benchmark conditions.
