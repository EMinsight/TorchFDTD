# Overlapping tiles with near-field stitching

`torchfdtd.tiled` cuts a large planar device, such as a millimetre-scale
metasurface whose full grid fits no memory tier, into lateral tiles that each
fit the GPU. Every tile is an ordinary `Project` on the global uniform mesh
with CPML on all faces, the same normal-incidence sheet source and one output
plane; its core is cropped into a stitched output plane, and the disagreement
of neighbouring tiles inside their shared overlap is the error indicator. The
stitched plane propagates to a focal plane by an angular spectrum and feeds the
open-surface radiation transforms, and `TiledPlaneSimulation` runs one plane
adjoint per tile so that a focal objective differentiates back to the global
permittivity.

This is an **approximate overlapping-domain method**: each tile misses every
scatterer beyond its extended region and carries its own absorber at the cuts.
The exact [streamed X-slab execution](STREAMED_FDTD.md) is a different method:
it stitches halos exactly, step by step, for one problem that fits DRAM or
disk. Use that when the problem fits a tier; use tiles when it does not, and
read the indicator.

## Workflow

```python
from torchfdtd import (Project, Region, Source, FieldMonitor, Structure, plan_tiles, run_tiled,
                       propagate_plane, farfield_from_stitched, suggest_overlap)

project = Project(
    region=Region(dimension='3d', size=(1007., 1007., 3.), mesh=.05, pml_cells=10,
                  steps=2100, memory_mode='streamed', backend='cuda', cuda_kernel='fused'),
    structures=[...],                                  # the whole device, in global coordinates
    sources=[Source(kind='plane', normal='z', center=(0, 0, -.85), size=(1007., 1007., 0),
                    component='Ex', wavelength=1.55, extend_through_pml=True)],
    monitors=[FieldMonitor(id='out', normal='z', center=(0, 0, .5), size=(1006., 1006., 0),
                           spectrum=dict(sampling='custom', custom_frequencies_hz=[1.934e14], apodization='none'))],
)
plan = plan_tiles(project, tile_um=40., overlap_um=3., max_angle_deg=30.)   # warns below suggest_overlap
stitched = run_tiled(project, plan, backend='cuda', executor='tensor', options=dict(cohort_size=4))
print(stitched.report['max_mismatch'], stitched.report['max_mismatch_center'])
focal = propagate_plane(stitched, 1000., 1., pad=2)          # focal plane, |E|^2 in focal.intensity()
far = farfield_from_stitched(stitched, directions)           # open-surface far field
```

The global `Project` describes the whole device: a uniform mesh, CPML on the
lateral and normal faces, one or more soft `plane` sources normal to the
propagation axis that span the whole non-PML lateral extent, and exactly one
enabled `FieldMonitor` with that normal, the output plane. A device beyond the
resident cell limit validates with `memory_mode='streamed'`; the tiles are
resident. Lengths are micrometres.

`plan_tiles(project, tile_um, overlap_um)` partitions the non-PML lateral
extent (x and y in 3D, x in 2D with `normal='y'`) into cores of
`round(tile_um / mesh)` cells plus `ceil(overlap_um / mesh)` overlap cells on
every lateral side, both clipped at the device edge; the last core takes the
remainder. Each `TileSpec` holds the global cell ranges of its core, extended
region (core plus overlap, the non-PML tile region) and full grid (extended
region plus the tile's own CPML), its centre in global coordinates and its
`Project`. The tile region size is a whole number of cells and its centre a
global node or half node, so every tile node coincides with a global node.
The tile keeps the global mesh, precision, duration, materials and boundary
settings and switches to `memory_mode='resident'`; a tile that still exceeds
the resident limit fails validation, so choose a smaller `tile_um`.

Structures whose support reaches the tile grid are kept whole in the tile's
frame and the rest are dropped. A structure crossing a cut therefore continues
into the tile's absorber, where the Yee rasteriser clips it at the grid edge;
nothing is truncated at the extended bounds, so no artificial interface stands
in front of the absorber. The sheet source is restricted to the extended region
(or, with `extend_through_pml`, to the whole tile grid) and the monitor spans
the extended region with all six components, no downsampling and the global
monitor's spectrum settings.

## The sheet source and the absorber

A soft sheet that stops at the non-PML boundary radiates an edge wave: its end
is a half-plane diffraction edge whose Fresnel ripple decays only as one over
the distance. The whole-device reference has that ripple from the device edge,
each tile has it from its own cut, and the difference dominates the stitched
error; the recorded empty region below shows it directly. The new
`Source.extend_through_pml` flag lets a soft `plane` sheet span the lateral
CPML as well. A sheet that is uniform along the absorber's normal has no
transverse derivative there, so the stretched coordinate leaves it untouched,
and its edge wave now starts at the outer grid boundary and is absorbed on
the way in. With that flag the empty region stitches to machine precision. The
validator still keeps the sheet's position along its normal inside the non-PML
region, and the flag is rejected for point, one-way and TFSF sources.

## Overlap rule

`suggest_overlap(distance_um, max_angle_deg, wavelength_um, absorber_um=None)`
returns the margin `distance * tan(angle) + absorber` with its two parts: the
lateral excursion of the steepest ray between the device and the output plane,
plus the absorber thickness, because the fields within about one CPML thickness
of the cut carry the absorber's residual reflection. Without an explicit
absorber half a wavelength is used, the thickness of a ten-cell CPML at twenty
cells per wavelength. `plan_tiles(..., max_angle_deg=...)` computes the
suggestion from the plane's distance to the farthest device point (the
structures' support, else the sheet), the first source's wavelength and the
tile CPML thickness, stores it in `plan.suggestion` and warns when the
requested overlap is below it. The rule bounds the geometric spread of light
that leaves the device at up to that angle; it does not bound light guided
laterally along a dense array, which the indicator reveals.

## Stitching and the indicator

`run_tiled(project, plan, backend=..., executor=..., options=...)` runs the
tiles through `Simulation.run` in sequence, through `run_batch` across
processes (`options` are `BatchRunner` arguments) or through
`run_grouped_batch` (`options` such as `cohort_size`), which puts tiles of equal
shape into fused CUDA cohorts. It returns a `StitchedPlane`: `fields` of shape
`(frequency, u, v, 6)` on the global cell-centre grid of the tiled extent,
`u_um`/`v_um` coordinates (one zero `v` sample in 2D), the plane offset,
propagation direction and a report. `stitch_planes(plan, planes, blend=...)`
is the Torch assembly itself and accepts native `field_monitor` dicts,
`DifferentiablePlaneResult` objects or `(F, Nu_ext, Nv_ext, 6)` tensors (some
entry must carry the frequencies); `run_tiled` keeps the tile planes in
`stitched.tile_planes` so a second blend needs no rerun.

`blend='hard'` crops each tile to its core. `blend='linear'` ramps
neighbouring tiles linearly across their shared band, which is
`2 * overlap_cells` wide and centred on the cut, with the weights normalised
to one. The report lists every neighbouring pair with `mismatch`, the relative
L2 difference of the two tiles' six-component fields over the full shared
band, and `mismatch_center`, the same over the central half of the band
(within half the overlap of the cut). The full band reaches the cells next to
each neighbour's absorber, where a tile is worst, so it is the more
conservative number; the central band is what the hard crop actually joins.
`max_mismatch`, `mean_mismatch` and their `_center` forms summarise the pairs.

## Propagation and far field

`propagate_plane(stitched, distance_um, index, pad=2)` propagates every
Cartesian component of E and H to a parallel plane `distance_um` away from the
device along the propagation direction in a homogeneous medium of the given
index. Each component satisfies the scalar Helmholtz equation there, so the
plane is zero padded `pad` times its size, transformed with `fft2`, multiplied
by `exp(i k_n d)` with `k_n = sqrt(k^2 - ku^2 - kv^2)` (imaginary for
evanescent waves, which decay) and cropped back; the transfer function is
built in double precision. The plane holds only outgoing waves, so a negative
distance is rejected. Light leaving the padded window wraps around: choose
`pad` so that `(pad - 1) * span / 2` exceeds `distance * tan(max angle)`.
`intensity()` returns |E|^2 and `poynting()` the normal Poynting component.

`stitched.as_plane()` is the same data as a `DifferentiablePlaneResult` with
full midpoint quadrature, and `stitched.radiation_surface(depth_um=None)`
names it as the outward face of a box reaching back through the device (to the
global region boundary by default). `farfield_from_stitched(stitched,
directions, **kwargs)` passes that pair to `project_farfield(...,
open_surface=True)`; `project_nearzone` and `farfield_at_points` take the same
pair. These are the documented [open-surface approximation](RADIATION.md);
the result carries `approximation='open surface'`. Both the propagator and
the radiation transforms are Torch operations, so gradients flow through them.

## Differentiable tiles

`TiledPlaneSimulation(project, plan, options)` builds one
`DifferentiablePlaneSimulation` per tile. Its forward takes the permittivity of
the whole global grid, `(Nx, Ny, Nz)` or with three Yee components, crops each
tile's full grid (extended region plus its own CPML) as a view, runs the tiles
one after another, each with the checkpointed adjoint of `options`, and stitches
the plane results on the autograd graph. The objective, for example the
propagated focal intensity, differentiates back to the global permittivity; a
cell that several tiles contain receives the sum of those tiles' gradients
through the view.

That sum is consistent because the stitched plane uses each tile's core fields
only, and a tile's core fields depend on that tile's crop alone. The stitched
model is the composition global permittivity -> tile crops -> tile core planes
-> stitched plane -> objective; its exact derivative is the chain rule of that
composition, which is one adjoint per tile seeded with the objective's
sensitivity to that tile's core, summed over the tiles containing each cell.
Nothing is double counted, because the cores are disjoint, and nothing is
missing as long as the light a design cell sends to the output plane lands
inside the extended region of a tile that contains the cell: the same overlap
rule as for the forward field. Inside a tile's own absorber the tile gradient
is meaningless, so compare gradients on the design cells. With the linear
blend the seed extends across the band with the blend weights and the argument
is unchanged.

The tiles run sequentially, but each keeps its checkpoint state and observation
buffers until backward. For many tiles use host or disk checkpoint storage in
`AdjointOptions`, or fewer, larger tiles.

## Validation

The tables below are rendered from the recorded JSON by
`python -m benchmarks.report_tiled_stitching`; the records come from
`python -m benchmarks.tiled_stitching`. The 3D device is the 12 x 12 array of
index-2 cylinders (period 0.5 um, radii 0.08 to 0.22 um, height 0.6 um) on a
6 x 6 um footprint at 0.05 um mesh, lit at 1.55 um with the output plane 0.5 um
above the pillars, simulated whole once and then as 2 x 2 tiles. The 2D
variant has rectangles of the same widths along x.

The reading of the 3D record: the empty region stitches exactly with the sheet
through the absorber, so every remaining error comes from the pillars. The
near-field error of the hard crop falls from 12% at 0.25 um overlap to 5.7% at
2 um and rises slightly at 2.5 um; the central indicator falls from 0.23 to 0.10
and rises with it; the linear blend is a little better at every overlap; the
focal-plane intensity error falls from 4.8% to about 1 to 2%. The error is not
confined to the cuts: the distance table shows a floor of about 5% two to three
micrometres from the nearest cut, the light that pillars beyond the extended
region scatter laterally at grazing angles, which is why the decrease is slow.
The central indicator is conservative, about two to three times the stitched
error; it reproduces the step at 2.5 um but overshoots at 0.5 um, where the
error barely changes, so it bounds the error rather than calibrating it. With
the sheet inside the non-PML region the empty region alone has a 35% error at
0.25 um overlap and the pillar array is dominated by that edge wave.

The 3D gradient record separates two questions. The tiled adjoint is exact for
the tiled model: it agrees with central differences of the tiled forward to
a few 1e-4 in FP32 on the most sensitive pillar, as the full-device adjoint
does with its own (the weakly sensitive pillar's FP32 central difference is
itself noisy at the percent level). The
decomposition error of the gradient is, however, larger than that of the
field: at 1.5 um overlap the tiled and full permittivity gradients differ by
27% over the pillar cells and by 17% over the vector of per-pillar
derivatives, while the objective itself differs by 0.14%. A cell's gradient is
the interference of its scattered field with the adjoint field, both of which
carry the tile error, and for most cells that interference is small and
oscillatory. The most sensitive pillar's derivative agrees to 5%; the pillar
at (-1.75, -1.75), whose derivative is near zero from cancellation, comes out
with the opposite sign. An optimiser on the tiled model therefore descends the
tiled objective, whose gap to the whole-device objective is the forward error,
and should not read single-cell sensitivities as those of the whole device.
The 2D FP64 record shows the same pattern: central differences agree to 1e-5
and better, the dense row's design-cell gradient error stays at 30 to 40% at
every overlap, and the strongest pillar's derivative agrees to 14 to 25%.

The throughput row states the cost honestly: with 1.5 um overlaps the four
tiles simulate about 2.5 times the cells of the whole device and take longer;
the sequential executor peaks below the whole-device memory because only one
tile is resident, while the tensor executor holds all four tiles at once and
peaks above it. The decomposition buys the ability to run a device that does
not fit, not speed.

<!-- tiled-validation:start -->

Recorded by `python -m benchmarks.tiled_stitching --dimension 3d --device cuda` on NVIDIA GeForce RTX 3060 (PyTorch 2.10.0+cu126) and `--dimension 2d --device cpu`, into [tiled-stitching-3d-3060.json](validation/tiled-stitching-3d-3060.json) and [tiled-stitching-2d-cpu.json](validation/tiled-stitching-2d-cpu.json). Timings were taken on a GPU shared with other jobs.

### 3D pillar array

The whole device is 140 x 140 x 60 cells (1,176,000) for 2059 steps in FP32 with the fused CUDA kernels; 2 x 2 tiles of 3 um cores. Near-field errors are relative L2 over all six components of the output plane; the focal intensity is |E|^2 after angular-spectrum propagation over 10 um with pad 4. The indicator columns are the largest neighbour mismatch over the full shared band and over its central half.

**Sheet through the absorber (`extend_through_pml=True`)**

| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | Focal intensity error, hard | Focal intensity error, linear | Wall (s) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.25 | 5 | 433,500 | 0.1200 | 0.1160 | 0.240 | 0.228 | 0.0476 | 0.0445 | 2.8 |
| 0.5 | 10 | 486,000 | 0.1086 | 0.1021 | 0.372 | 0.314 | 0.0224 | 0.0288 | 3.0 |
| 1 | 20 | 600,000 | 0.0947 | 0.0863 | 0.269 | 0.210 | 0.0202 | 0.0186 | 3.5 |
| 1.5 | 30 | 726,000 | 0.0793 | 0.0710 | 0.188 | 0.171 | 0.0207 | 0.0157 | 4.0 |
| 2 | 40 | 864,000 | 0.0568 | 0.0545 | 0.197 | 0.102 | 0.0120 | 0.0096 | 4.7 |
| 2.5 | 50 | 1,014,000 | 0.0632 | 0.0597 | 0.193 | 0.133 | 0.0164 | 0.0128 | 5.4 |

The same tiles on the empty region (no pillars):

| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | Wall (s) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.25 | 5 | 433,500 | 0.0000 | 0.0000 | 0.000 | 0.000 | 2.7 |
| 0.5 | 10 | 486,000 | 0.0000 | 0.0000 | 0.000 | 0.000 | 3.0 |

**Sheet inside the non-PML region** (the default `Source`), pillar array and empty region:

| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | Focal intensity error, hard | Focal intensity error, linear | Wall (s) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.25 | 5 | 433,500 | 0.3180 | 0.3136 | 0.595 | 0.544 | 0.1749 | 0.1800 | 2.8 |
| 0.5 | 10 | 486,000 | 0.3111 | 0.2982 | 0.618 | 0.494 | 0.0801 | 0.0993 | 2.9 |
| 1 | 20 | 600,000 | 0.2060 | 0.1871 | 0.397 | 0.288 | 0.0656 | 0.0571 | 3.4 |
| 1.5 | 30 | 726,000 | 0.1148 | 0.1103 | 0.403 | 0.244 | 0.0179 | 0.0227 | 4.0 |

| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | Wall (s) |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.25 | 5 | 433,500 | 0.3463 | 0.3444 | 0.456 | 0.393 | 2.7 |
| 0.5 | 10 | 486,000 | 0.3068 | 0.2996 | 0.445 | 0.321 | 2.9 |

RMS relative field error against the distance to the nearest cut, through-absorber sheet, 1.5 um overlap, hard crop:

| Distance to the nearest cut (um) | RMS relative field error |
|---|---:|
| 0 to 0.25 | 0.0920 |
| 0.25 to 0.5 | 0.0868 |
| 0.5 to 1 | 0.0828 |
| 1 to 1.5 | 0.0782 |
| 1.5 to 2 | 0.0673 |
| 2 to 3 | 0.0523 |

### 3D gradient consistency

Objective: focal intensity summed over the central 20 x 20 cells after 10 um of propagation; FP32, 4 device checkpoints, overlap 1.5 um, central differences with delta 0.05 on the pillar's 624 cells. `Design-cell gradient error` is the relative L2 difference between the tiled and full permittivity gradients over the 52,800 pillar cells, `Whole-grid` over every cell including the absorbers, and the pillar-derivative vector holds the derivative with respect to the permittivity of each of the 144 pillars.

| Overlap (um) | Objective difference | Design-cell gradient error | Whole-grid gradient error | Pillar-derivative vector error | Parameter | Cells | Tiled adjoint | Tiled central difference | Full adjoint | Full central difference | Tiled vs full |
|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|
| 1.5 | 1.38e-03 | 2.72e-01 | 1.92e-01 | 1.66e-01 | pillar 26 at (-1.75, -1.75) | 384 | -5.857429e-01 | -5.859375e-01 | 1.734331e-01 | 1.782227e-01 | 4.38e+00 |
| | | | | | pillar 66 at (-0.25, 0.25) | 624 | 2.265318e+01 | 2.265625e+01 | 2.161940e+01 | 2.162109e+01 | 4.78e-02 |

Adjoint wall time: tiled 54.0 s for four tiles, full device 20.3 s.

### 3D throughput and memory

| Run | Cells simulated | Wall (s) | Peak Torch CUDA bytes |
|---|---:|---:|---:|
| Whole device | 1,176,000 | 2.28 | 85,206,016 |
| 4 tiles, sequential executor, overlap 1.5 um | 2,904,000 | 4.03 | 51,540,992 |
| 4 tiles, tensor executor, overlap 1.5 um | 2,904,000 | 5.62 | 206,816,256 |

The reference loop alone took 1.45 s (1667 Mcells/s) plus 0.80 s of setup. Peak bytes are `torch.cuda.max_memory_allocated` over each run.

### 2D variant (CPU)

Rectangles of the same widths along x, 140 x 60 cells for 1681 steps, two tiles of 3 um cores, sheet through the absorber:

| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | Focal intensity error, hard | Focal intensity error, linear | Wall (s) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.25 | 5 | 5,100 | 0.0883 | 0.0859 | 0.207 | 0.185 | 0.0156 | 0.0164 | 1.1 |
| 0.5 | 10 | 5,400 | 0.0721 | 0.0689 | 0.235 | 0.178 | 0.0249 | 0.0319 | 1.0 |
| 1 | 20 | 6,000 | 0.0920 | 0.0870 | 0.326 | 0.235 | 0.0140 | 0.0254 | 1.1 |
| 1.5 | 30 | 6,600 | 0.0602 | 0.0599 | 0.246 | 0.150 | 0.0247 | 0.0276 | 1.1 |
| 2 | 40 | 7,200 | 0.0343 | 0.0333 | 0.195 | 0.105 | 0.0062 | 0.0042 | 1.2 |
| 2.5 | 50 | 7,800 | 0.0676 | 0.0637 | 0.271 | 0.134 | 0.0149 | 0.0147 | 1.2 |

Sheet inside the non-PML region:

| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | Focal intensity error, hard | Focal intensity error, linear | Wall (s) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.25 | 5 | 5,100 | 0.2203 | 0.2181 | 0.451 | 0.399 | 0.1273 | 0.1295 | 1.1 |
| 0.5 | 10 | 5,400 | 0.1625 | 0.1567 | 0.420 | 0.322 | 0.0641 | 0.0745 | 1.1 |
| 1 | 20 | 6,000 | 0.0828 | 0.0819 | 0.357 | 0.211 | 0.0198 | 0.0334 | 1.1 |
| 1.5 | 30 | 6,600 | 0.0659 | 0.0730 | 0.406 | 0.208 | 0.0200 | 0.0275 | 1.3 |

A sparse row of four pillars (period 1.25 um): the error is set by the pillars a tile does not contain, and vanishes once both tiles hold the whole row.

| Overlap (um) | Cells | Largest tile | Near-field error, hard | Near-field error, linear | Indicator, full band | Indicator, central | Focal intensity error, hard | Focal intensity error, linear | Wall (s) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0.25 | 5 | 5,100 | 0.1690 | 0.1636 | 0.548 | 0.499 | 0.0232 | 0.0257 | 1.0 |
| 0.5 | 10 | 5,400 | 0.1188 | 0.1130 | 0.307 | 0.279 | 0.0199 | 0.0235 | 1.1 |
| 1 | 20 | 6,000 | 0.0552 | 0.0502 | 0.151 | 0.138 | 0.0095 | 0.0088 | 1.1 |
| 1.5 | 30 | 6,600 | 0.0670 | 0.0601 | 0.263 | 0.177 | 0.0080 | 0.0109 | 1.2 |
| 2 | 40 | 7,200 | 0.0000 | 0.0000 | 0.000 | 0.000 | 0.0000 | 0.0000 | 1.1 |
| 2.5 | 50 | 7,800 | 0.0000 | 0.0000 | 0.000 | 0.000 | 0.0000 | 0.0000 | 1.3 |

### 2D gradient consistency

FP64 on a 0.1 um mesh (7 x 3 um), 4 checkpoints, delta 0.001; the objective sums the focal intensity over the central 10 cells after 10 um.

| Overlap (um) | Objective difference | Design-cell gradient error | Whole-grid gradient error | Pillar-derivative vector error | Parameter | Cells | Tiled adjoint | Tiled central difference | Full adjoint | Full central difference | Tiled vs full |
|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|---:|
| 0.5 | 1.45e-02 | 4.04e-01 | 1.26e-01 | 3.67e-01 | cell (18, 12, 0) | 1 | -7.666163e-03 | -7.666163e-03 | 2.747108e-03 | 2.747108e-03 | 3.79e+00 |
| | | | | | pillar 3 at (-1.25, -0.3) | 18 | 1.708120e-01 | 1.708120e-01 | -4.091868e-02 | -4.091873e-02 | 5.17e+00 |
| | | | | | pillar 1 at (-2.25, -0.3) | 18 | -9.744631e-01 | -9.744632e-01 | -1.128536e+00 | -1.128536e+00 | 1.37e-01 |
| 1.5 | 1.95e-03 | 3.15e-01 | 8.12e-02 | 2.88e-01 | cell (18, 12, 0) | 1 | -4.683005e-03 | -4.683005e-03 | 2.747108e-03 | 2.747108e-03 | 2.70e+00 |
| | | | | | pillar 3 at (-1.25, -0.3) | 18 | -1.985328e-03 | -1.985359e-03 | -4.091868e-02 | -4.091873e-02 | 9.51e-01 |
| | | | | | pillar 1 at (-2.25, -0.3) | 18 | -8.434955e-01 | -8.434955e-01 | -1.128536e+00 | -1.128536e+00 | 2.53e-01 |
| 2.5 | 2.21e-02 | 2.96e-01 | 7.11e-02 | 2.40e-01 | cell (18, 12, 0) | 1 | 3.818303e-05 | 3.818304e-05 | 2.747108e-03 | 2.747108e-03 | 9.86e-01 |
| | | | | | pillar 3 at (-1.25, -0.3) | 18 | 4.551114e-02 | 4.551109e-02 | -4.091868e-02 | -4.091873e-02 | 2.11e+00 |
| | | | | | pillar 1 at (-2.25, -0.3) | 18 | -9.268262e-01 | -9.268262e-01 | -1.128536e+00 | -1.128536e+00 | 1.79e-01 |

<!-- tiled-validation:end -->

## Limitations

- The method is approximate. The error floor away from the cuts is set by
  laterally scattered light from structures a tile does not contain and does
  not vanish with modest overlaps; the 2D dense-slab variant varies between
  3 and 9% without a monotone trend, the 3D cylinders decrease slowly. Read
  `mismatch_center` and compare overlaps before trusting a design.
- The gradient of the tiled model is exact for that model but its cell-level
  difference from the whole-device gradient is larger than the field error
  (27% on the pillar cells of the 3D record at 1.5 um overlap).
- Structures continuing into a tile's absorber see a CPML matched to the
  background. In the 3D record that is still better than truncating the
  pillars at the extended bounds; it is part of the floor.
- One propagation axis, soft normal-incidence sheet sources spanning the device
  and a single output plane are supported; point, one-way and TFSF sources,
  Bloch phases, graded meshes and dispersive materials are rejected.
- `TiledPlaneSimulation` retains every tile's checkpoint state until backward
  and runs the tiles one at a time; there is no recomputation or multi-GPU
  path, and only first-order derivatives.
- The tensor executor holds a whole cohort of tiles on the device; the batch
  and sequential executors bound memory by one tile per worker. Resume across
  tiles is not implemented.
- The angular-spectrum propagator assumes a homogeneous medium beyond the
  plane and only outgoing waves; the radiation adapter is the open-surface
  approximation and inherits its contract.
