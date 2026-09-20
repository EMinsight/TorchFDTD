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

All native coordinates, Z bounds, port dimensions and tolerance values are **micrometres**. The file's GDS library unit and precision are recorded in metres. The importer converts XY geometry into micrometres. Cell references, nested rotation, positive magnification, X reflection and reference arrays are flattened before native geometry creation. PATHs are transformed before polygonization so negative-WIDTH absolute-width paths retain their physical width under magnification. Polygonized PATH elements use the explicit `path_tolerance_um`, default 0.001 um. Native output consists of simple polygon extrusions with preserved layer-stack material and mesh order. One input layer may be extruded at multiple explicitly supplied Z intervals. At equal mesh order, later stack entries win where different materials overlap, following native project ordering.

## Admission and reporting

`cell` and a nonempty layer/datatype stack are required. Default `unmapped="error"` rejects geometry on unselected layer/datatype pairs. `unmapped="report"` explicitly allows their omission and records every omitted pair and polygon count. Unconfigured text labels are counted separately as descriptive metadata. Reports include the file hash, original units, visited cells, expanded polygon/path counts, physical bounds, selected stack, ignored metadata records and port metadata. Repeated imports of unchanged input/configuration produce identical structures and reports.

`GDSLimits` bounds file bytes, hierarchy depth, expanded cell/geometry/label instances, total vertices, final structures and physical coordinates. The default maximum of 1000 structures matches the native project model. Reference expansion is counted before flattening. Optional `xy_bounds_um=(xmin, ymin, xmax, ymax)` rejects geometry or port apertures outside a specified physical box. These admission checks do not automatically fit a simulation mesh or guarantee that a selected resolution fits memory.

The native polygon model accepts 3–2048 vertices on a simple contour. Self-intersections, touching contours and keyhole bridges used to represent holes are rejected explicitly. Separate filled polygons do not mean a hole, regardless of winding. Decompose hole-bearing layouts into simple filled polygons before import. No automatic fill or topology-changing repair is applied. Unresolved/cyclic references, unsupported GDS element records and absolute STRANS flags are rejected. GDS properties and presentation metadata are reported but are not interpreted as simulation physics. OASIS is outside this workflow.

On Windows, gdstk's narrow filename handling can reject Unicode absolute paths. This workflow uses a scoped ASCII staging path in the current directory, without changing the process working directory. The temporary directory is removed after the read/write. The current directory must therefore be writable on Windows. Python reads/writes the requested Unicode paths directly.

## Port marker contract

`GDSPortLayer` is an explicit **TEXT marker** convention, not a universal foundry convention. Its `layer` selects GDS LAYER and its `datatype` selects the TEXT record's **TEXTTYPE**. Geometry polygons and paths instead use their DATATYPE. These are distinct record fields.

Label text is a unique port name. The contract supplies a local unit `normal_xy`, a local width in micrometres and physical Z bounds. Nested label/reference rotation and reflection transform the direction, and magnification scales width. Label origin sets the transformed XY center. Z bounds stay fixed physical stack coordinates. Port metadata validates finite positions, unit directions and positive dimensions. Repeated arrays that create duplicate port names are rejected instead of silently assigning ambiguous sources. Rename or uniquely label instances before requesting their port metadata.

`layout.ports` contains center, normal, width, height and originating layer/type. These records are suitable inputs for a later explicit mode/source/detector mapping step. **The importer does not create a runnable mode source, mode detector or source normalization.** Arbitrary in-plane normals may also require resampling or restrictions in a later Cartesian mode API.

## Export supported native geometry

```python
from torchfdtd.gds import export_gds

sidecar = export_gds(
    "native.gds", project.structures,
    layers={obj.id: (1, 0) for obj in project.structures if obj.enabled},
    cell="TOP", unit_m=1e-6, precision_m=1e-9,
)
```

Export supports native polygons and rectangles whose extrusion remains normal to XY, including in-plane rotation. Other primitives and tilted extrusions are rejected. Every enabled structure needs an explicit layer/datatype mapping. Disabled structures are omitted with a count. Coordinates are rounded to the requested GDS precision and checked again for valid simple polygons and signed 32-bit coordinate range. Output uses a fixed timestamp for reproducible bytes.

GDS stores XY geometry only. Save the returned `layer_stack` sidecar to retain Z extents, material names and mesh order. Sources, detectors, port metadata, solver settings and material definitions are not exported. Export/reimport is a geometry workflow, not a complete project-file interchange.

## Verification

[Tests](../tests/test_gds.py) create synthetic GDS independently with gdstk and check physical units, nested transforms/arrays, PATH conversion, port transforms, unsupported contours/records, admission limits, deterministic export and native material sampling followed by an actual CPU simulation. [Example](../examples/gds_workflow.py) converts a supplied file and explicit JSON stack/material configuration into a native project and reports.

Primary dependency references: [gdstk Cell traversal](https://heitzmann.github.io/gdstk/library/gdstk.Cell.html), [Reference transforms](https://heitzmann.github.io/gdstk/library/gdstk.Reference.html), and [GDS read/write units](https://heitzmann.github.io/gdstk/gettingstarted.html).

## Browser workflow

Choose **GDS** in the Project ribbon, upload a GDSII file (maximum 32 MB), select the exact cell, and check the layer/datatype rows to extrude. Enter Z bounds in µm and choose an existing project material for every included row. Use Duplicate to extrude one pair at multiple Z intervals. The strict default rejects unmapped geometry. Choosing explicit omission retains the omitted counts in the report.

Preview validates the conversion and native project before Apply changes the scene. Inspect/download the report before applying. Geometry is appended by default. The explicit replace option replaces structures only. The FDTD region remains unchanged, so inspect the imported bounds and adjust the region when needed. Changing the project or import settings invalidates the preview. Port contracts remain separately downloaded metadata, not runnable sources.

Imported objects use the ordinary native CAD editor, Save project and Python export. The browser does not export GDS itself. The Python `export_gds` API provides that bounded XY geometry export. Optional dependency errors include the installation command. Uploaded files are stored under opaque IDs in this local server's result directory, and IDs are valid only in the current server session.

`tests/test_gds_api.py` compares browser API conversion with direct Python import and validates optional-dependency/upload errors. `tests/ui/gds.spec.js` generates an independent synthetic GDS and exercises actual upload, explicit stack, report, native CAD, project save and Python download. Set `TORCHFDTD_TEST_PYTHON` to a Python interpreter with gdstk when running that UI test.
