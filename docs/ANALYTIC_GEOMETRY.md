# Analytic solids, rotations and batch preparation

The native engine supports boxes, circular/elliptical cylinders, spheres/ellipsoids, full/partial circular or elliptical rings, and extruded simple polygons. All properties are serialized by `Project`, editable in the browser and usable in independent CUDA tensor cohorts. [Complete Python example](../examples/analytic_solids.py).

## Coordinates and solids

Native lengths are in micrometres. A solid is defined around its `center`, which is its rotation pivot. Polygon `vertices` are local XY pairs. `size[2]` gives extrusion thickness along local z. Polygon x/y spans are determined by its vertices, not `size[0:2]`. Clockwise and counterclockwise contours are accepted. The validator rejects crossings, touching nonadjacent edges, adjacent overlap, repeated closure and zero area. A contour has 3–2048 vertices and no holes. Rings provide a separate analytic hole representation.

Set `make_ellipsoid=True` to use `radius_2` along local y and, for spheres, `radius_3` along local z. `radius` always belongs to local x. A ring additionally uses `inner_radius_2`. Both inner radii must be positive and smaller than their outer radii, or both zero.

`theta_start` and `theta_stop` select a counterclockwise arc in local XY. A 350° start and 10° stop mean a 20° arc. A difference of ±360° means a full ring. Equal endpoints and differences larger than 360° are rejected. Elliptical sectors use the physical polar angle `atan2(y,x)`, not the ellipse parameter angle. These angles are applied before rigid rotation.

`rotation_axes=("x","y","z")` and `rotation_angles=(17,31,-29)` apply right-handed rotations about fixed world axes in the specified order. `"none"` ignores its angle. The earlier `rotation` field remains a legacy z rotation applied before this sequence. For column vectors, local-to-world is `R3 @ R2 @ R1 @ Rz_legacy`. Membership transforms world samples with its transpose. For isotropic spheres, and full circular cylinders/rings rotated only about z, invariant rotations are bypassed to preserve legacy boundary membership.

The UI shows orthographic projections and a perspective CAD model, all using the same rotation order. Its triangulated display is independent of the solver. The native solver uses analytic equations and an even/odd polygon crossing test at each material sampling point. A 2D calculation samples the rotated solid at z = 0 and assumes invariance along z in the field equations. It does not solve a general tilted 3D structure using 2D physics.

## Python and SI editing facade

```python
from photonweave import FDTD

fd = FDTD()
fd.addpoly(
    vertices=[[-0.5e-6, -0.4e-6], [0.5e-6, -0.4e-6],
              [0.5e-6, 0], [0, 0], [0, 0.4e-6], [-0.5e-6, 0.4e-6]],
    z_span=0.6e-6, first_axis="x", rotation_1=17,
    second_axis="y", rotation_2=31, third_axis="z", rotation_3=-29,
)
fd.setgeometry(first_axis="z", rotation_1=45, z_span=0.8e-6)
fd.save("polygon.json")
```

The facade uses SI metres for lengths and vertex coordinates. Angles remain degrees. `setgeometry()` validates coupled changes atomically. `addring(inner_radius=0, inner_radius_2=0, make_ellipsoid=True, ...)` can create a filled elliptical sector without an invalid intermediate state. Individual properties also work through `set()`.

This facade has the native rotation convention stated above. Similar command names do not establish script-level equivalence with another product. Public product references describe [polygon extrusion](https://optics.ansys.com/hc/en-us/articles/360034901493-Polygon-Simulation-Object), [ellipsoid radii](https://optics.ansys.com/hc/en-us/articles/360034901553-Sphere-Simulation-Object) and [ring controls](https://optics.ansys.com/hc/en-us/articles/360034382194-Ring-Simulation-Object), but do not by themselves validate our general FSP rotation and elliptical-sector mapping.

## Preparation cost and numerical limits

Material preparation computes a conservative axis-aligned bound for each enabled solid, finds the corresponding sorted grid-index intervals, and evaluates membership only inside that support. Bounds are exact for boxes, ellipsoids and polygon vertex extrema. A partial ring uses its full-cylinder bound. Floating-point padding prevents culling boundary samples. Overlap priority, Yee component locations, material ownership and full-domain field allocation are unchanged.

This reduces host-side preparation work for compact objects. It does not reduce the electromagnetic grid, alter the time step or skip updates outside structures. No automatic mesh-error estimate, conformal/subpixel interface, adjoint, or general curved-geometry optical accuracy claim follows from it. A scene dominated by large overlapping solids or long time stepping may gain little. The measurement report separates preparation time and full CUDA batch wall time.

Tests compare independent rotation matrices, concave analytic masks, rotated volumes against analytic volumes under refinement, and support-pruned versus full-domain material arrays including ownership and overlaps. Equivalent rotated box and polygon representations give identical complete optical outputs. Mixed new solids are checked across CPU, fused CUDA and independent shared CUDA cohorts. Browser tests cover invalid/valid vertex edits, export, controls and execution.

## Independent FSP scope

Recognized primitive records now map ordered three-axis rotations, ellipsoid/cylinder radii, partial elliptical ring sectors and polygon vertices with their separate pivot. Their true support is checked against PML. Author-generated byte records test decoding, native material placement and byte-preserving original download, without a commercial runtime or commercial field data.

Python, CLI and UI also support [existing-geometry writeback](FSP_NATIVE.md#independent-geometry-writeback), including variable vertex counts and equivalent composition of the legacy z rotation. Unedited bytes are preserved. Saved mesh nodes stay fixed. Group transforms, object-list edits, nongeometry writeback, result-bearing files and other versions remain open. Native geometry support and FSP compatibility remain separate columns in the checklist.
