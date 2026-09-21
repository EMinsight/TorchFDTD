# GDSII geometry workflow

Install the optional dependency with `pip install "torchfdtd[gds]"`. The Python workflow uses gdstk to read GDSII geometry. It does not execute vendor software or copy another FDTD implementation.

## Import an explicit layer stack

```python
from torchfdtd import Project, Region, Material
from torchfdtd.gds import GDSLayer, GDSPortLayer, import_gds

layout = import_gds(
    "chip.gds",
    cell="TOP",
    layers=[GDSLayer(layer=1, datatype=0, z_min=-0.11, z_max=0.11,
                     material="core", mesh_order=2)],
    port_layers=[GDSPortLayer(layer=10, datatype=5,
                             z_min=-0.11, z_max=0.11,
                             width_um=0.5, normal_xy=(1.0, 0.0))],
)
project = Project(
    region=Region(dimension="3d", size=(6, 4, 2), mesh=0.05,
                  pml_cells=5, material_sampling="yee"),
    materials=[Material(name="core", index=2.0)],
)
project = layout.add_to(project)
project.save("scene.json")
print(layout.report)
```

Choose materials and region dimensions for the actual device. The importer does not infer refractive indices, a fabrication process, the simulation region, sources or detectors. Imported XY positions are preserved without recentering. The stack supplies physical Z coordinates and material names in the existing project. `add_to` returns a validated copy and rejects unknown materials and duplicate structure IDs. Add appropriate excitation and monitors before running the resulting project.

All native coordinates, Z bounds, port dimensions and tolerance values are **micrometres**. The file's GDS library unit and precision are recorded in metres. The importer converts XY geometry into micrometres. Cell references, nested rotation, positive magnification, X reflection and reference arrays are flattened before native geometry creation. PATHs are transformed before polygonization so negative-WIDTH absolute-width paths retain their physical width under magnification. Polygonized PATH elements use the explicit `path_tolerance_um`, default 0.001 um. Native output consists of vertical polygon extrusions, each an outer contour with zero or more explicit holes, with preserved layer-stack material and mesh order. One input layer may be extruded at multiple explicitly supplied Z intervals. At equal mesh order, later stack entries win where different materials overlap, following native project ordering.

## Holes and layer subtraction

GDS has no hole record. gdstk, KLayout and most tools store a hole as one BOUNDARY whose contour runs from the outer boundary along a zero-width bridge to the hole, around it and back, so the two bridge endpoints appear twice. The importer cuts such a contour at repeated vertices into simple loops, collapses the bridge remnants, drops the collinear vertices the bridge inserted, and groups the loops by even-odd nesting depth: an even-depth loop is an outer contour and the odd-depth loops directly inside it are its holes. An island inside a hole becomes its own polygon. The native polygon carries the holes explicitly (`Structure.holes`) and its membership is even-odd over all contours, with every contour edge counted as material exactly as the outer contour was before. Nothing is decomposed into slivers, so Yee sampling, subpixel line integrals and interface normals see one solid with the same boundary rule as any other polygon. This was chosen over splitting into simple pieces because a split would introduce artificial internal seams that subpixel interface detection and structure counts would see, while the explicit model keeps the imported scene identical to the drawn region.

`GDSLayer(..., etch_by=((layer, datatype), ...))` subtracts every polygon on the listed pairs from that entry's polygons with a gdstk boolean NOT before extrusion, the same boolean FDTDX applies for etched vias. Etch pairs count as mapped geometry, are never extruded by that entry, and are listed under `etched_layers` in the report. The boolean runs on the file's precision grid, so a subtraction that crosses an oblique edge snaps its new vertices to that grid like any GDS tool. An etch that touches the base boundary produces a notch, not a hole, and overlapping base polygons of an etched entry are merged by the boolean.

Separate contours on one layer keep GDS union semantics: an inner contour drawn on the same layer as its surrounding contour is filled, exactly as every GDS viewer fills it, never silently reinterpreted as a hole. Draw such holes on another pair and etch with `etch_by`.

## Tapered sidewalls

`GDSLayer(..., sidewall_angle_deg=θ)` with `import_gds(..., sidewall_z_nodes_um=project.region.mesh_nodes[2])` staircases a trapezoidal sidewall on the native z grid. θ is measured from vertical: the drawn polygon is the footprint at `z_min`, a positive angle shrinks the footprint toward `z_max` (a regular etch profile), a negative angle grows it (re-entrant). The layer is cut at every supplied z node inside its Z interval; each slice becomes its own native polygon whose contours are the gdstk offset of the drawn polygons by `-(z_slice_centre - z_min) * tan θ`, with mitered joins and holes offset in the opposite sense. Because each Yee z cell then samples the offset evaluated at its own centre, the staircase is exact for that mesh and no in-plane rasterization or distance transform is involved, unlike FDTDX's mask erosion. Erosion may split a footprint or remove it from the upper slices, dilation may merge footprints, and the report lists each tapered pair under `tapered_layers` with its slice and polygon counts. The default angle 0 leaves the import path, structures and identities unchanged. Only the `z_min` footprint reference is available; a top or middle reference plane and sub-cell interface smoothing of the taper are not.

## Admission and reporting

`cell` and a nonempty layer/datatype stack are required. Default `unmapped="error"` rejects geometry on unselected layer/datatype pairs. `unmapped="report"` explicitly allows their omission and records every omitted pair and polygon count. Unconfigured text labels are counted separately as descriptive metadata. Reports include the file hash, original units, visited cells, expanded polygon/path counts, physical bounds, selected stack, ignored metadata records and port metadata. Repeated imports of unchanged input/configuration produce identical structures and reports.

`GDSLimits` bounds file bytes, hierarchy depth, expanded cell/geometry/label instances, total vertices, final structures and physical coordinates. The default maximum of 1000 structures matches the native project model. Reference expansion is counted before flattening. Optional `xy_bounds_um=(xmin, ymin, xmax, ymax)` rejects geometry or port apertures outside a specified physical box. These admission checks do not automatically fit a simulation mesh or guarantee that a selected resolution fits memory.

The native polygon model accepts 3–2048 vertices per contour and at most 1024 holes per polygon. Holes must lie strictly inside their outer contour and strictly apart from each other. A hole that touches its outer contour at a vertex, overlapping or nested holes, self-intersecting loops and repeated vertices that do not form a bridge are rejected explicitly with the offending rule; nothing is filled, repaired or dropped. Sidewalls are vertical or staircased per z slice; a continuous slanted interface is not represented. Unresolved/cyclic references, unsupported GDS element records and absolute STRANS flags are rejected. GDS properties and presentation metadata are reported but are not interpreted as simulation physics. OASIS is outside this workflow.

On Windows, gdstk's narrow filename handling can reject Unicode absolute paths. This workflow uses a scoped ASCII staging path in the current directory, without changing the process working directory. The temporary directory is removed after the read/write. The current directory must therefore be writable on Windows. Python reads/writes the requested Unicode paths directly.

## Port marker contract

`GDSPortLayer` is an explicit **TEXT marker** convention, not a universal foundry convention. Its `layer` selects GDS LAYER and its `datatype` selects the TEXT record's **TEXTTYPE**. Geometry polygons and paths instead use their DATATYPE. These are distinct record fields.

Label text is a unique port name. The contract supplies a local unit `normal_xy`, a local width in micrometres and physical Z bounds. Nested label/reference rotation and reflection transform the direction, and magnification scales width. Label origin sets the transformed XY center. Z bounds stay fixed physical stack coordinates. Port metadata validates finite positions, unit directions and positive dimensions. Repeated arrays that create duplicate port names are rejected instead of silently assigning ambiguous sources. Rename or uniquely label instances before requesting their port metadata.

`layout.ports` contains center, normal, width, height and originating layer/type. The importer itself does not create a source or detector. `torchfdtd.gds_ports.prepare_gds_two_port(layout, project, wavelength_um=...)` turns two cardinal, full-transverse-cell TEXT markers into a runnable `ModeNetwork` with the modal cross-section and runtime epsilon sampled from the imported geometry; the lower-level adapter and its defaults are described in the [mode-port document](GDS_MODE_PORTS.md). Narrow waveguide apertures, arbitrary normals, unequal guides and branches remain unsupported.

## Export supported native geometry

```python
from torchfdtd.gds import export_gds

sidecar = export_gds(
    "native.gds", project.structures,
    layers={obj.id: (1, 0) for obj in project.structures if obj.enabled},
    cell="TOP", unit_m=1e-6, precision_m=1e-9,
)
```

Export supports native polygons and rectangles whose extrusion remains normal to XY, including in-plane rotation. Other primitives and tilted extrusions are rejected. Every enabled structure needs an explicit layer/datatype mapping. Disabled structures are omitted with a count. Coordinates are rounded to the requested GDS precision and checked again for valid simple contours, admitted holes and signed 32-bit coordinate range; holes that touch their outer contour after rounding are rejected rather than merged. A polygon with holes is written as one bridged contour through gdstk's boolean NOT, the representation the importer reads back into the same outer contour and holes. Output uses a fixed timestamp for reproducible bytes.

GDS stores XY geometry only. Save the returned `layer_stack` sidecar to retain Z extents, material names and mesh order. Sources, detectors, port metadata, solver settings and material definitions are not exported. Export/reimport is a geometry workflow, not a complete project-file interchange.

## Verification

[Tests](../tests/test_gds.py) create synthetic GDS independently with gdstk and check physical units, nested transforms/arrays, PATH conversion, port transforms, unsupported contours/records, admission limits, deterministic export and native material sampling followed by an actual CPU simulation. [Hole tests](../tests/test_gds_holes.py) compare the Yee-sampled epsilon of a bridged ring, an etched via through a slab, an island inside a hole and a two-hole contour against an independent even-odd rasterizer written in the test, run a CPU simulation on the etched slab, check that a hole sharing an outer edge becomes an empty notch and that a vertex-touching hole is rejected, pin the same-layer union rule, round-trip exported holes, exercise subpixel interfaces on hole edges, compare every tapered z slice of a ring against an independent gdstk offset at the slice centre for positive and negative angles, and show that a tapered square changes a CPU simulation relative to the vertical import. [Example](../examples/gds_workflow.py) converts a supplied file and explicit JSON stack/material configuration into a native project and reports.

Primary dependency references: [gdstk Cell traversal](https://heitzmann.github.io/gdstk/library/gdstk.Cell.html), [Reference transforms](https://heitzmann.github.io/gdstk/library/gdstk.Reference.html), and [GDS read/write units](https://heitzmann.github.io/gdstk/gettingstarted.html).

## Browser workflow

Choose **GDS** in the Project ribbon, upload a GDSII file (maximum 32 MB), select the exact cell, and check the layer/datatype rows to extrude. Enter Z bounds in µm and choose an existing project material for every included row. Use Duplicate to extrude one pair at multiple Z intervals. The Etch by field of a row lists layer/datatype pairs such as `2/0, 3/1` whose polygons are subtracted from that row before extrusion; malformed pairs are rejected before conversion. The strict default rejects unmapped geometry. Choosing explicit omission retains the omitted counts in the report. Sidewall angles are a Python-only option.

Preview validates the conversion and native project before Apply changes the scene. Inspect/download the report before applying. Geometry is appended by default. The explicit replace option replaces structures only. The FDTD region remains unchanged, so inspect the imported bounds and adjust the region when needed. Changing the project or import settings invalidates the preview. Port contracts remain separately downloaded metadata, not runnable sources.

Imported objects use the ordinary native CAD editor, Save project and Python export. The three projected views and the perspective view draw polygon holes from the same tessellation as the outer contour, and the vertex editor lists each hole as its own block after a blank line; edits are validated by the same native polygon rules. The browser does not export GDS itself. The Python `export_gds` API provides that bounded XY geometry export. Optional dependency errors include the installation command. Uploaded files are stored under opaque IDs in this local server's result directory, and IDs are valid only in the current server session.

`tests/test_gds_api.py` compares browser API conversion with direct Python import, checks that an `etch_by` layer row returns a project whose polygon carries its hole through validation and Python export, and validates optional-dependency/upload errors. `tests/ui/gds.spec.js` generates an independent synthetic GDS with an etch pair and exercises actual upload, explicit stack with the Etch by field and its rejection of a malformed pair, report hole counts, native CAD with the holed polygon, the hole block in the vertex editor, project save and Python download. Set `TORCHFDTD_TEST_PYTHON` to a Python interpreter with gdstk when running that UI test.
