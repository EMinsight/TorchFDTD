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
operation.

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

The initial source contract supports ordinary native **soft** sources. Total
radiation requires their actual Yee support to be enclosed and clear of the
faces. Matched incident subtraction permits external sources only when their
support stays separated from the measurement surface. TFSF scattered-side and
one-way source provenance are not yet admitted by this adapter. Cancelled or
failed runs and missing completed-step metadata are rejected.

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
subtraction, immutable snapshots and admission/metadata failures.
[Loader tests](../tests/test_radiation_box_io.py) check bounded selected-member
loading and malformed archives. Browser and API integration use the actual
stored six-face native example. No overall FDTDX parity, substrate/lattice
far-field support, or performance advantage is inferred from these checks.
