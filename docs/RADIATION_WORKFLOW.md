# Native stored-plane diffraction workflow

A completed browser run can now postprocess its stored frequency planes through
the existing vector `diffraction_orders` and `diffraction_efficiency` APIs.
Open **Flux results**, then **Diffraction orders**. Select the stored plane,
frequency and integer order pairs, enter the known exterior refractive index,
and confirm the exterior assumptions. Calculation uses the stored complex E/H
fields; it does not launch another FDTD run.

The plane must cover one entire periodic/Bloch unit cell, with uniform midpoint
quadrature and at least two samples on each transverse axis. Orders use cyclic
transverse axes: y,z for x-normal; z,x for y-normal; x,y for z-normal. The server
derives periods and Bloch wavevectors from the completed project, checks the
transverse boundary types, and requires the plane strictly inside the non-PML
normal interval. The transform separately validates quadrature, Nyquist limits
and grazing cutoff. Partial-cell, graded/nonuniform or downsampled remainder
quadratures may fail these checks; choose a uniformly sampled complete cell.

Record **all six** Ex/Ey/Ez/Hx/Hy/Hz fields, use no apodization, and set time
downsampling to one. Flux-only data and time snapshots cannot reconstruct these
complex fields. Two-dimensional invariant-length results are rejected. Disabling
raw flux storage is allowed when all six fields are retained.

Raw forward/backward directional powers are labeled in reduced spectral units,
not watts or efficiencies. An optional matched reference adds dimensionless
efficiencies. Source/run signatures, frequencies, quadrature, normal, dtype,
periods and Bloch wavevectors must match. Keep monitor IDs when creating the
reference. Both planes must be in the same declared homogeneous, lossless,
isotropic exterior. The fields cannot establish that material condition by
themselves; the explicit confirmation is a user declaration, not automatic
material verification. No reference is fabricated from total transmitted power.

Incident subtraction applies to the normalized columns. Raw columns continue
to show total sample fields. Evanescent orders remain listed with zero real
directional power. A grazing-cutoff order is rejected with an actionable error,
not silently marked evanescent. Request one frequency at a time; requests are
bounded to 49 orders and two million order-point products.

## Python and downloaded NPZ results

```python
from torchfdtd.radiation_io import load_native_radiation_plane
from torchfdtd.radiation import diffraction_orders, diffraction_efficiency

plane, project = load_native_radiation_plane(
    "result.npz", "stored-monitor-id", frequency_index=0)
orders = diffraction_orders(plane, [(0, 0), (1, 0)],
    period_um=(1.2, 1.2), refractive_index=1.0)
# period and Bloch vector must describe this actual monitor's cyclic axes.
# supply bloch_wavevector_per_um for nonzero Bloch phase.
print(orders.forward_power, orders.propagating)
```

`python -m examples.native_diffraction result.npz MONITOR_ID --index 1.0`
provides a zero-order example using periods/Bloch phases from the saved project.
`native_radiation_plane(result.frequency_fields[i])` adapts an in-memory native
result. These are CPU postprocessing adapters, with no reconstruction or
simulation autograd graph. The existing differentiable radiation APIs continue
to preserve graphs when used directly with differentiable planes.

The NPZ loader disables pickle and reads only project/monitor metadata and the
selected monitor's fields, frequencies, points and weights. It never loads the
full E/H, epsilon or frame arrays. Selected monitor archive data has a 256 MiB
pre-load budget, and conversion has a two-million-complex-sample limit. Selecting
one frequency reduces conversion/transform size, but NPZ decompression still
loads that monitor's whole frequency array. It does not stream NPZ frequency
slices.

All adapted fields retain the native positive-time DFT convention
`exp(+2*pi*i*f*t)`, corresponding to the radiation API's `exp(-i*omega*t)`
phasors. No conjugation or unit conversion is invented by the adapter.

## Closed-box far field remains a distinct Python operation

The same loader can supply six correctly positioned native field monitors to
`project_farfield`, using keys `x_min`, `x_max`, `y_min`, `y_max`, `z_min`,
`z_max` and explicit physical box bounds. Every face must have compatible
frequency/run metadata and full uniform midpoint quadrature. The closed surface
must enclose all sources/scatterers and lie entirely in a homogeneous exterior
outside PML. For scattered fields, subtract matched incident fields on every
face before projection. A substrate-crossing box, periodic unit cell or single
open plane is not an isolated-object far-field surface. This browser workflow
therefore exposes diffraction only; it does not relabel a plane intensity plot
as far-field radiation.

## Focused verification

Two CPU API/adapter tests run actual small native simulations, exercise matched
reference normalization, compare API output to direct diffraction, reject
missing fields/reference metadata and invalid inputs, and load NPZ data with
guards that forbid reading full-domain E/H/epsilon/frames. One Playwright test
runs a real CPU project and checks exterior errors, calculation, raw-power
labels and evanescent order rows. No GPU or existing full-suite rerun is involved.
