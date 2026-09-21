# Stored closed-box far-field workflow

A completed native run can project its six stored frequency faces into a vector
far field through Python, NPZ loading, or the browser. Open **Flux results** and
choose **Closed-box far field**. Map the six monitor IDs, specify the physical
box bounds and exterior refractive index, choose a frequency and angular grid,
and confirm the isolated homogeneous-exterior contract. Calculation reads the
stored fields and does not start FDTD. Setup/result JSON and CSV exports retain
the selected geometry and angular convention.

This is a restricted isolated-object workflow. A periodic unit-cell diffraction
plane, a substrate-crossing box, or a single open plane is not a closed radiation
surface. [Stored-plane diffraction](RADIATION_WORKFLOW.md) remains a separate
operation. The same stored box also evaluates exact finite-distance fields at
Cartesian or spherical-grid points through Python; the browser exposes the
angular far field only.

## Comparison with FDTDX field projection

FDTDX `FieldProjectionAngleDetector`, `FieldProjectionCartesianDetector`,
`FieldProjectionKSpaceDetector` and `DiffractiveDetector` were read against
`torchfdtd.radiation` and `torchfdtd.radiation_box`. The table records the gap
before this revision and the state after it. "Now" entries are implemented,
tested and documented here; nothing else is claimed.

| Aspect | FDTDX | TorchFDTD before | TorchFDTD now |
|---|---|---|---|
| Observation specification | Tensor-product theta x phi angles at one `projection_distance`; Cartesian plane (`x`, `y` at a distance along `projection_axis`, per-point radius); k-space direction cosines `ux`, `uy` inside the unit disk | Unit direction vectors only; the browser builds a theta x phi grid | Direction vectors; `spherical_directions` theta x phi grid; `kspace_directions(ux, uy, axis)` direction-cosine grid on the hemisphere of a signed axis, rejecting `ux^2 + uy^2 > 1`; `spherical_points` and `cartesian_plane_points`, or any fixed `(P, 3)` micrometre points, for `farfield_at_points` and `project_nearzone` |
| Propagation models | Far field: separable Fourier integrals, prefactor `-i k exp(ikr)/(4 pi r)`, `H` from the medium impedance, `E_r = 0`. Exact (`far_field_approx=False`): dyadic Green function with `G`, `dG/dr`, `d2G/dr2` terms at finite distance, radial components retained | Asymptotic far field only (`electric_amplitude`, `fields_at_radius` with one scalar radius) | Both. `fields_at_radius` takes one radius per direction; `project_nearzone` evaluates the exact free-space Green function of the equivalent currents at finite distance, with radial `E` |
| Radiation surface and quadrature | One plane with an outward `direction` or a box with `exclude_surfaces`; trapezoidal weights on physical coordinates, optional Gaussian edge window, interval subsampling | Six-face closed box, complete uniform midpoint quadrature | Closed box by default. `open_surface=True` admits one to five named faces (a single plane is one named face, its name fixes the outward normal) as a documented approximation flagged `approximation: open surface` in the result and report, with an optional Gaussian `edge_window` on a single plane. Quadrature stays complete uniform midpoint; trapezoidal weights and interval subsampling are not added |
| Exterior assumptions | Homogeneous isotropic medium; real or complex permittivity/permeability through `projection_medium`, per-frequency index and impedance overrides | Real lossless isotropic index, `mu_r = 1`, matching the native background | Differentiable/plane APIs take a complex passive `refractive_index` and `relative_permeability` (complex `k = k0 n`, impedance `mu_r / n`); the real path is bitwise unchanged. Growing exteriors (`Im n < 0`, `Im mu_r < 0`, or `Im(n^2/mu_r) < 0`) are rejected elementwise. Each value is one scalar or one `(F,)` array aligned with the plane frequencies. The stored adapter keeps requiring the real native background. Layered backgrounds remain unsupported |
| Differentiability | Detector state is a JAX pytree; `project` runs inside `jax.grad` | Torch graph through `project_farfield` on differentiable planes; stored NPZ data have no graph | Far field and near zone are both linear Torch maps of the plane fields. One native material VJP test checks both against central differences; stored boxes remain graph-free |
| Admission rules | No provenance checks. The exact path rejects observation points coinciding with source samples; `DiffractiveDetector` rejects symmetry-plane clipping | Rejected TFSF, one-way, non-soft, cancelled/failed runs, substrates, periodic cells, external sources without a reference | TFSF boxes admitted (see below). One-way planes remain impossible in this contract because they need a periodic transverse cell. Cancelled runs stay rejected. Observation points inside or on the box are rejected |
| Diffraction orders | FFT per order on one plane, power from `|E_t x H_t*|` after projecting transverse to `k`, one `k0` for every frequency, no forward/backward separation | `diffraction_orders` separates forward/backward branches from `E` and `H`, keeps Bloch phase, flags evanescent orders, `diffraction_efficiency` with a matched reference | Unchanged |

## Required native data and geometry

Supply exactly `x_min`, `x_max`, `y_min`, `y_max`, `z_min`, `z_max`, each mapped
to a distinct stored monitor ID. Every face must retain Ex/Ey/Ez/Hx/Hy/Hz, use
no apodization and time downsampling one, and cover its complete declared
rectangle with uniform midpoint quadrature. At least two samples are required
on each transverse axis. Face normals, positions, frequencies, field dtype and
native run signature must agree. Flux-only data and time snapshots cannot
reconstruct these complex fields.

The native Project must be three-dimensional and uniform, with PML on all six
outer faces. Every interpolation stencil must stay outside PML. The declared
index must equal the homogeneous isotropic background. All contrast objects'
conservative support bounds must be inside the measurement box and one mesh
cell clear of its faces. This also rejects substrates and outside scatterers.
Rotated objects can be rejected conservatively by their support bounds.

Ordinary native **soft** sources: total radiation requires their actual Yee
support to be enclosed and clear of the faces. Matched incident subtraction
permits external sources only when their support stays separated from the
measurement surface.

**TFSF boxes** are admitted by their staggered face positions. The box corrects
E on its lo/hi node faces and H one half cell outside them. When every
measurement face is at least one cell outside that shell, the faces lie in the
scattered-field region; the stored fields are the scattered field and the report
records `field_kind: scattered` with `incident_removal: tfsf scattered-field
region`. No reference is required, but a matched empty-box reference may still
be subtracted to remove the finite injection error. When the measurement box lies
at least one cell inside the TFSF box, the faces carry total fields and a matched
reference is mandatory; the report then records `matched reference`. A TFSF box
whose faces cross or approach the measurement faces is rejected, because such a
surface mixes total and scattered samples. Objects between the TFSF box and the
measurement faces are not checked beyond the existing enclosure rule.

**One-way planes** stay rejected. They span a complete periodic transverse
cell, and the isolated closed-box contract requires PML on all six faces, so the
Project itself fails validation before the adapter runs.

**Cancelled or failed runs** and missing completed-step metadata stay rejected.
Their stored DFT covers an arbitrary truncated window in which the source may
not have finished and fields may not have decayed, so the six faces are not a
consistent spectral radiation surface. The field arrays cannot reveal this.

## Python and NPZ

```python
from torchfdtd import native_radiation_box, load_native_radiation_box

faces = {axis + "_" + side: axis + "_" + side
         for axis in "xyz" for side in ("min", "max")}
box = load_native_radiation_box(
    "result.npz", faces,
    bounds_um=[[-0.6, 0.6]] * 3,
    refractive_index=1.0,
    frequency_index=0,
    host_budget_bytes=512 * 1024**2,
)
# For an existing native Result instead:
# box = native_radiation_box(result, faces, bounds_um=[[-0.6, 0.6]] * 3,
#                            refractive_index=1.0)
far = box.project([[1., 0., 0.], [0., 1., 0.], [0., 0., 1.]])
print(far.electric_amplitude, box.report)
```

The example monitor IDs above match [native_farfield.json](../examples/native_farfield.json).
Export a fresh example Project with
`python -m examples.native_farfield --export-project six-faces.json`, run that
Project normally, then postprocess its downloaded NPZ with
`python -m examples.native_farfield --result result.npz --output farfield.json`.
The example command itself never starts FDTD.

`native_radiation_box` accepts a native Result or a mapping containing `project`,
`summary`, and `frequency_fields`. The returned StoredRadiationBox owns immutable
field and metadata snapshots. Caller edits cannot alter subsequent projections.
Its public metadata includes bounds, index, frequency tuple, field dtype, and a
copied JSON report. Projection returns the existing FarFieldResult type.

### Finite-distance near zone and observation grids

```python
from torchfdtd import spherical_directions, spherical_points, cartesian_plane_points
import math, torch

theta, phi = torch.linspace(0, math.pi, 19), torch.linspace(0, 2*math.pi, 36)[:-1]
far = box.project(spherical_directions(theta, phi))          # angular grid
near = box.nearzone(spherical_points(theta, phi, 5.))          # sphere of 5 um
plane = box.nearzone(cartesian_plane_points('z', 3., torch.linspace(-2, 2, 41),
                                            torch.linspace(-2, 2, 41)))
print(near.fields.shape, near.poynting().shape)                # (F, P, 6), (F, P, 3)
```

`nearzone` evaluates the exact free-space Green function of the six-face
equivalent currents at fixed CPU points strictly outside the box, in the plane
field units. It is charged against the same host budget as `project`, runs
without autograd, and keeps the stored dtype. Its cost is proportional to
(faces x face samples x observation points), so a 41 x 41 plane over a 24^3
example box is a few seconds on one CPU core; the browser does not expose it.

### Open surfaces (approximation)

```python
top = native_radiation_box(result, {"z_max": "z_max"}, bounds_um=[[-0.6, 0.6]] * 3,
                           refractive_index=1.0, open_surface=True)
far = top.project(directions, edge_window=(0.2, 0.2))
print(top.report["approximation"], top.report["surfaces"], far.approximation)
# 'open surface' ['z_max'] 'open surface'
```

With `open_surface=True`, `monitor_ids` names one to five faces of the declared
box; a single plane is one named face and the name fixes its outward normal.
The retained faces are integrated with the same equivalence currents and the
omitted faces are assumed to carry negligible fields. The declared box must
still enclose the sources and contrast objects, and the same geometry, source
and completion admission applies. `edge_window` tapers both edges of a single
plane with FDTDX's Gaussian window (fractions of each transverse span) and is
rejected for several faces. Passing all six IDs with the flag, or a subset
without it, is rejected, so the closed box remains the default. The loader
`load_native_radiation_box` takes the same `open_surface` flag and reads only
the named monitors. The browser keeps the six-face closed box. A lossy exterior
is not accepted by the stored adapter because the projection medium must equal
the real native background; use the plane API for that case.

For scattering, pass `reference=` to the in-memory adapter or `reference_path=`
to the loader. The reference must be homogeneous with the same native source,
mesh, completed duration, run signature and monitor settings. All six raw
quadrature arrays and frequencies must match before dtype conversion. Python
can map different reference monitor IDs explicitly. The browser initially uses
the same IDs. Complex incident E/H are subtracted on **all six faces before
projection**. Subtracting intensities or only some faces is not supported.

## Units, precision and memory

Fields retain the native `exp(+2*pi*i*f*t)` DFT, corresponding to
`exp(-i*omega*t)` phasors. Outward signs are supplied by the existing vector
closed-box transform. Electric amplitude has units `reduced E * s * m`, and
intensity has units `reduced E*H * s^2 * m^2 / sr`. These are raw spectral
quantities, not watts or normalized efficiencies. Incident subtraction alone
does not provide a power denominator. Relative intensity is a display
normalization to the largest directional value, with a defined zero pattern.

The adapter preserves the stored complex dtype. Native FrequencyPlane currently
stores complex128 arrays even after FP32 FDTD accumulation. This storage cast
does not improve the accuracy of the original FP32 fields. Small CPU float64
intensity reductions can prevent FP32 squaring underflow without changing FDTD
precision. Saved native/NPZ data have no autograd history. Use differentiable
planes directly with `project_farfield` for a field/material graph, as described
in [RADIATION.md](RADIATION.md).

Preparation checks aggregate sample/reference arrays, copies, subtraction,
metadata, validation scratch and the uniform mesh-axis workspace against the
host budget and currently available RAM before allocating snapshots or axes.
Projection separately admits retained faces, tensor copies, complete directional
outputs and bounded integral workspace. Chunking does not eliminate the full
output allocation.

The NPZ loader disables pickle, bounds ZIP/JSON/NPY metadata, validates selected
member headers and aggregate decoded bytes before numeric loading, and reads
only the six selected monitors. It does not load full E/H, epsilon or frames.
The default host budget is 512 MiB and archive metadata budget is 4 MiB.
Selecting one frequency still requires admitting each selected compressed
member's complete frequency payload. The loader does not stream frequency
slices from NPZ.

The browser allows at most 8192 directions, 50 million direction-point products,
a 512 MiB host reservation and 16 MiB serialized output. One postprocessing
request runs at a time. Theta is measured from +z, phi from +x toward +y.
Closing or editing the dialog discards stale responses. It is not a claim that
the server calculation was cancelled.

## Focused evidence and limitations

The final native example uses a 24^3 CPU FP32 grid, six faces with 864 total
quadrature points, and 525 steps lasting 100.095 fs. Its source ends at 73.896 fs.
The earlier 50 fs setup ended before that source tail and is not the accepted
workflow example. The 100 fs record projects 684 directions and has relative
L2 dipole-pattern error 0.0207291 against the predeclared 0.05 limit. This is a
small workflow gate, not a new mesh-convergence study or a general radiation
accuracy claim. See the [native workflow record](validation/native_farfield_workflow.json).

[Adapter tests](../tests/test_radiation_box.py) use an independent analytic
vector dipole for dtype-preserving amplitude checks, coherent incident
subtraction, immutable snapshots, admission/metadata failures, the five TFSF
placements above, the one-way rejection reason, stored near-zone output
equal to the direct transform under the host budget, and open-surface subsets
whose report and results carry the approximation flag and equal the direct
open-surface transform bitwise, with the six-ID/no-flag/lossy rejections.
[Loader tests](../tests/test_radiation_box_io.py) check bounded selected-member
loading, malformed archives and open-surface subset forwarding. Browser and API
integration use the actual stored six-face native example. The near-zone,
lossy-exterior, open-surface and observation-grid analytics, tolerances and
gradient checks are recorded in [RADIATION.md](RADIATION.md). No overall FDTDX
parity, substrate/lattice far-field support, per-frequency exterior,
trapezoidal or subsampled quadrature, or performance advantage is inferred
from these checks.
