# Execution modes in the workbench

The FDTD region panel has two execution controls above the general settings:
a **GPU** switch and a **Memory** selector. Both are stored in the project, so a
saved JSON scene keeps the choice (`Region.backend`, `Region.cuda_kernel`,
`Region.cuda_monitor_kernel` and `Region.execution_mode`). The status line under
the Memory selector shows what the server will do with the scene as it is
configured now, and the results panel of a finished run shows what was done.

## GPU switch

| Switch | Region settings | Kernels |
| --- | --- | --- |
| On, CuPy installed | `backend="cuda"`, `cuda_kernel="fused"`, `cuda_monitor_kernel="fused"` | Fused Yee/CPML update and shared plane DFT |
| On, CuPy missing | `backend="cuda"`, both kernels `"torch"` | PyTorch reference updates on the GPU |
| Off | `backend="cpu"`, both kernels `"torch"` | NumPy/PyTorch CPU |

The switch is disabled, with a tooltip, when `/api/health` reports no CUDA
device. `/api/health` also reports `cupy`, the GPU name, `gpu_free_bytes`,
`gpu_total_bytes`, `host_total_bytes` and `host_available_bytes`.

The fused kernels come from the optional `cuda-kernels` extra:

```console
.venv/Scripts/python.exe -m pip install -e ".[cuda-kernels]"
```

Without it the resident GPU path runs the PyTorch reference kernels, and
streamed GPU tiles are not available: streamed jobs then run their tiles on the
CPU and the status line says so. The **Advanced execution** section keeps the
individual `resource`, `precision`, `CUDA kernel` and `Frequency monitor
kernel` controls. Changing them updates the switch: it shows on for `cuda`, or
for `auto` on a CUDA host, and off for `cpu`.

## Memory modes

| Memory | Meaning |
| --- | --- |
| Auto (recommended) | The server picks resident, then streamed host, then streamed disk, from the live resources. |
| Resident (GPU or CPU memory) | The whole grid lives in device memory (GPU) or RAM (CPU). Limited to 8,000,000 cells. |
| Streamed through host memory (DRAM) | Global E/H/CPML banks stay in RAM; extended x slabs move to the compute device one temporal block at a time. |
| Streamed through disk | Same slabs, but the global banks are scratch files. Needs a scratch disk. |

`Region.memory_mode="streamed"` (the Python opt-in) is treated as a streamed
request in the workbench. A `Resident` request with more than 8,000,000 cells is
rejected when the project is validated, exactly as before.

### How Auto decides

Every `/api/validate` call and every job submission resolves the mode again
from the resources at that moment.

1. **Resident** when all of the following hold:
   - `memory_mode` is `resident` and the grid has at most 8,000,000 cells;
   - the resident estimate (`estimated_memory_mb` from `/api/validate`) is at
     most **75% of free device memory** on the GPU (the same check the resident
     CUDA solver applies before allocating) or at most **80% of available host
     memory** on the CPU.
2. Otherwise **streamed through host memory** when a streamed policy is admitted
   with DRAM banks: its host reservation must fit **80% of available host
   memory**, and on the GPU its tile workspace must fit **80% of free device
   memory**.
3. Otherwise **streamed through disk** when the same admission passes with file
   banks: host reservation within 80% of available RAM, tile workspace within
   80% of free device memory, and the bank reservation within **80% of the free
   space** on the scratch volume.
4. Otherwise no mode fits. The status line shows every rejection reason and the
   Run button reports it.

The streamed reservation is the same conservative
`estimate_streamed_memory` accounting the Python API uses: `checkpoints + 3`
complete state banks (three for a forward-only job), eight copies of the
material array (four in the measured disk scope), tile workspace, source and
observation histories and the plane DFT accumulators. It is an allocation bound,
not a measured process peak. Free memory is read live, so a second GPU process
or a browser tab holding results can change the decision between validation and
the run.

### Tile policy

The default streamed policy is a slab of **32 x rows** with a temporal depth of
**4 steps** and no global checkpoints. When that policy is not admitted, the
generated candidate set of `plan_streamed_work` (slab widths 1, 16, 32, 64, 128
and the full grid; depths 1, 4, 8, 16) is searched and the admitted candidate
closest to the default is used, preferring the default depth before the default
width. Each candidate is checked again with the actual point and plane
observations of the scene. The chosen slab, depth, bank storage and tile device
appear in the status line, in the job record (`execution.policy`) and in the
results panel.

## What streaming costs

Streaming replaces one resident field update per step by a host-to-device
copy of every extended slab, its update for one temporal block and a copy back.
The halo of `depth` cells on both sides of every slab is recomputed, so narrow
slabs and deep blocks do more update work; shallow blocks move the global state
more often.

- **Host traffic** (DRAM banks): every temporal block reads the complete
  E/H/CPML state plus halos and writes it back, roughly `2 x state bytes x
  steps / depth`. The state is 6 field values per cell plus CPML memories.
- **Disk traffic** (file banks): the same logical traffic goes through buffered
  file I/O. The `execution.report.forward_backing_store` record of a finished
  job lists the logical read and written bytes; the OS page cache and the
  physical SSD traffic are not measured.
- **Speed.** The recorded measurements in [MEASUREMENTS.md](MEASUREMENTS.md) and
  [STREAMED_FDTD.md](STREAMED_FDTD.md) are complete forward-plus-backward
  iterations of the differentiable API, not browser forward runs, but they set
  the expectation for the slab engine. On the i7-12700 / RTX 3060 workstation a
  complex-FP64 128 x 64 x 64 grid for 32 steps with two checkpoints took
  0.381 s resident on the GPU and 2.104 s streamed through DRAM (5.5x). On the
  RTX 5880 workstation the real-FP32 128 x 64 x 64, 32-step case took 0.0419 s
  resident, 0.461 s streamed with synchronous tiles (11.0x) and 0.390 s with
  asynchronous tiles (9.3x); the complex-FP64 256 x 96 x 96 case with width 32
  / depth 8 took 0.277 s resident and 2.538 s streamed synchronously (9.2x).
  File banks were 2.4x slower than DRAM banks on the 128 x 128 x 64, 32-step
  case on the RTX 3060 (9.06 s versus 3.79 s) and 1.9x slower in the
  interleaved small-grid record (2.883 s versus 1.526 s). The 54 GiB real-FP32
  beyond-VRAM gate ran ten steps in 58.4 minutes with 2.23 GB of peak CUDA
  allocation. Expect a browser streamed job to run several times slower than
  the same scene resident, and file banks to be slower again when the OS cache
  cannot hold the banks. No browser forward-only timing has been recorded yet.
- **Setup.** The material array is voxelized on the host and the whole scene is
  validated by the streamed API before the first block; large scenes spend
  seconds here before the progress bar moves.

## Choosing a scratch disk

File banks are written under `<results>/scratch` by default, where `<results>`
is the server's results directory (`TORCHFDTD_RESULTS`, default `results` under
the directory the server was started from). Set `TORCHFDTD_SCRATCH` to move the
banks to another volume before starting `python -m torchfdtd.cli serve`:

```console
set TORCHFDTD_SCRATCH=D:\fdtd-scratch
python -m torchfdtd.cli serve
```

Pick a local NVMe volume with free space of at least a few times the state size
(`execution.reservation.disk_reservation_bytes` in the job record; three banks
of 6 x 4 bytes per cell for a real FP32 scene, twice that for FP64 or complex
Bloch fields, plus CPML memories). Do not use a nearly full system drive: the
server admits banks only up to 80% of the free space at validation time, and
other programs can consume that space later. Each job creates one private
`torchfdtd-state-*` directory and removes it when the job finishes, fails or is
cancelled. The banks are scratch, not a restart journal.

## Limits of the browser streamed path

- **Forward only.** No gradients, no inverse design; the Python
  `StreamedSimulation` API remains the differentiable entry point.
- **Scene contract** of the streamed API: staircase interfaces, nondispersive
  materials, no TFSF boxes, no PMC/symmetric faces, no anisotropic tensor
  materials, a fixed number of steps (automatic decay shutoff off). Bloch
  boundaries, one-way sheet sources, graded meshes and both precisions work.
- **Monitors.** Point time monitors record their full time history, so their
  time traces, spectra and `monitors.csv` / `spectra.csv` match the resident
  job. Frequency-plane monitors accumulate their DFT on the host from the
  observed Yee cells and produce the same plane record (fields, Poynting
  density, flux, `flux.csv`, normalization against a resident reference of the
  same scene). Every distinct Yee cell a plane touches is one tile observation,
  so keep the quadrature point count per plane modest with the monitor
  downsample; above 50,000 observation cells the status line warns.
- **Field snapshot.** One frame, the configured slice assembled from the x
  slabs of the final completed block, downsampled like the resident snapshot.
  There are no live frames while the job runs and no snapshot series.
- **Divergence.** Non-finite samples or a non-finite final slice fail the job;
  the growth-ratio diagnostics of the resident run control are not evaluated.
- **NPZ download** contains the snapshot, point signals and plane spectra but
  not the full final E/H arrays; `field_peak` is taken over the rows read for
  the snapshot.
- **Progress and cancellation** work at tile granularity: the footer shows
  `block i / n · tile j / m`, and Stop ends the job after the current tile with
  the results of the last completed block.
- **Reservation, not measurement.** Admission uses the conservative streamed
  accounting. A job can still fail if another process takes memory or disk
  after validation, and passing admission is not a statement about speed.
