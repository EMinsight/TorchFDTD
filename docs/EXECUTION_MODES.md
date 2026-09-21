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
| Tiled (approximate, large devices) | Overlapping resident tiles of a planar device with near-field stitching. Never chosen by Auto; see below. |

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

## Tiled (approximate, large devices)

The fifth Memory entry runs the [overlapping-tile decomposition](TILED_STITCHING.md)
forward only. It is not an exact method and Auto never selects it: use it for a
planar device that fits no memory tier, and read the indicator.

The panel that appears holds `Region.tiling`:

| Control | Field | Meaning |
| --- | --- | --- |
| tile size | `tiling.size_um` | Core of each tile along every lateral axis; `round(size / mesh)` cells |
| tile overlap | `tiling.overlap_um` | Margin on every lateral side; `ceil(overlap / mesh)` cells |
| max diffraction angle | `tiling.max_angle_deg` | Steepest ray leaving the device, default 45 degrees, for the suggestion |
| suggested overlap | read-only | `suggest_overlap`: output-plane distance x tan(angle) plus the tile absorber, from the farthest device point, the first source's wavelength and the CPML thickness |
| propagate to a focal plane / distance | `tiling.propagation_um` | Optional angular-spectrum propagation of the stitched plane by that distance in the background medium |

The scene contract is the planner's: a uniform mesh, CPML on the lateral and
normal faces, soft `plane` sheet sources normal to the output plane that span
the whole non-PML lateral extent (tick **Extend sheet through PML** on the
sheet, which makes the empty region stitch exactly) and exactly one enabled
frequency-plane monitor, the output plane, with no enabled point monitors.
Point, one-way and TFSF sources, Bloch phases and graded meshes are rejected
with the planner's message in the status line before anything runs. Dispersive
materials are not rejected by the planner; the resident tiles run them.

The status line shows the tile count and layout, the largest tile's cells and
resident estimate, the total tile cells relative to the device, the
suggestion, the focal-plane settings and a warning when the overlap is below
the suggestion or the largest tile exceeds the resident margin.

The job runs `run_tiled(project, plan, executor='sequential')`: one resident
`Simulation.run` per tile, CPU or GPU as the switch says, with progress and
Stop per tile. Its outputs are

- the stitched output plane as a frequency-plane record under the monitor's id
  (all six components, Poynting density and flux, `flux.csv`, the
  field-monitor endpoint, normalization against another tiled run of the same
  plan), the same outputs a plane monitor of the whole device gives;
- the per-pair mismatch table (`mismatch` over the full shared band,
  `mismatch_center` over its central half) with `max_mismatch_center` in the
  results panel, the error indicator of an approximate method: it bounds the
  stitched error, at two to three times that error in the record, but does not
  calibrate it;
- with a distance, the propagated plane as a second record under
  `<monitor id>-focal`, zero padded so that rays at the entered angle stay in
  the window (`pad` between 2 and 8);
- the field visualizer shows |E|^2 of the stitched plane and, when present,
  the focal plane at the first frequency, each relative to its own peak (the
  DFT values themselves are reduced field x seconds).

Costs from the record: with 1.5 um overlaps the tiles of the 3D pillar array
simulate about 2.5 times the cells of the whole device and take longer than the
whole device would; the near-field error falls from 12% at 0.25 um overlap to
5.7% at 2 um with a floor of about 5% away from the cuts, and the focal
intensity error from 4.8% to 1 to 2%. The tiled adjoint is Python only
(`TiledPlaneSimulation`); the browser runs no gradients.

## Angular-spectrum post-processing

Any finished forward run, resident, streamed or tiled, that stored a DFT plane
can be propagated through the homogeneous exterior beyond that plane without
another FDTD run: the **Angular spectrum** button in the results panel and in
the flux dialog opens the panel. It calls the same implementation as the tiled
focal plane ([ANGULAR_SPECTRUM.md](ANGULAR_SPECTRUM.md)): `propagate_section`
for a section through the normal at one fixed transverse coordinate and
`propagate_volume` at one distance for a plane parallel to the monitor. The
computation runs on the run's device (CUDA for a GPU run) and the fields stay
on the server; the panel receives an intensity image decimated to at most 512
samples per axis.

| Control | Meaning |
| --- | --- |
| Monitor, frequency | One stored plane and one of its recorded frequencies |
| Direction | Auto infers the propagation side from the enabled sources (all behind the plane or all in front); +normal or −normal override it |
| Exterior index | Real index of the homogeneous exterior, defaulting to the background index |
| Zero padding factor | The plane is padded this many times before the FFT; light beyond `(pad - 1) x span / 2` wraps around |
| Kind | A section `xz` or `yz` (the transverse axis with the normal; a 2D device offers one) or a plane parallel to the monitor |
| Section offset, distance start/stop, planes | The fixed transverse coordinate and the uniform distance grid of a section |
| Plane distance | The distance of the parallel plane |

The report below the image gives the **focus** (peak intensity, its distance
from the plane and absolute coordinate along the normal, its transverse
position and the FWHM along the section through it by linear interpolation
of the half-maximum crossings; on a parallel plane the peak position on both
axes and the FWHM along the first) and the **spectrum** (largest angle the
plane spacing can represent, `sin(theta) = wavelength / (2 spacing)`, the
evanescent fraction of the padded spectrum, spacing, wavelength in the
exterior, pad and padded shape). When the monitor spacing exceeds half the
wavelength in the exterior the panel shows the aliasing warning: angles above
the representable one alias instead of failing.

The route refuses with the library's message (HTTP 422) when the selected id
is not a stored DFT plane, when the plane holds no electric component or is
not a uniform tensor-product grid, when the section axis is not transverse to
the plane, and when the section or volume needs more than the budget: half of
the free device memory on CUDA, a quarter of the available host memory on the
CPU. The contract of the method applies: a homogeneous, lossless, source-free
exterior with outgoing waves only, and a recorded window outside which the
field is taken as zero; the focus report names the global intensity maximum
of what was computed, hot spots included. The API is
`GET /api/jobs/{id}/propagation-monitors` and `POST /api/jobs/{id}/propagate`.

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
