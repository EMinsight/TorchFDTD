# FSP primitive scene-list editing

`write_fsp_scene` supports adding, deleting, duplicating and reordering the
mapped top-level primitives: boxes, spheres/ellipsoids, circular/elliptical
cylinders, full/partial elliptical rings and polygon extrusions. Existing
geometry, source/monitor settings and uniform mesh edits can be saved in the
same transaction. Mapped [source and monitor lists](FSP_INSTRUMENTS_WRITE.md)
can now be edited in that transaction as well.

Native reimport, material assignment and CPU/CUDA execution are tested.
**Acceptance of newly generated records by external readers has not been
verified.** New primitive records use authored defaults for reserved drawing
metadata in the explicitly decoded legacy revisions. They are not copied
binary fixtures. Existing records preserve their opaque fields. These tests
do not establish general FSP file compatibility.

## Python

```python
from uuid import uuid4
from torchfdtd import Structure, write_fsp_scene
from torchfdtd.fsp_binary import FspDocument
from torchfdtd.fsp_native import convert_fsp

original = FspDocument.load('input.fsp')
conversion = convert_fsp(original, backend='cuda')
if conversion.project is None:
    raise ValueError(conversion.issues)
p = conversion.project

# Duplicate with a distinct ID and move the new object.
copy = p.structures[0].model_copy(deep=True)
copy.id = uuid4().hex
copy.name += '_copy'
copy.center = (copy.center[0] + 0.2, *copy.center[1:])
p.structures.append(copy)

# Add a new primitive, even when the input has no record of that class.
p.structures.append(Structure(
    name='New box', kind='rectangle', material=p.materials[0].name,
    center=(-0.6, 0.0, 0.0), size=(0.4, 0.6, 0.5),
))
del p.structures[0]
p.structures.reverse()

edited, report = write_fsp_scene(original, p)
edited.save('edited-objects.fsp')  # exclusive creation
p.save('edited-native.json')

# The exported file has new offsets and a new fingerprint.
reimported = convert_fsp(edited, backend='cuda').project
assert reimported is not None
```

The example expects a mapped source file with at least one structure and room
for the specified objects. Geometry must satisfy the same native validation
and supported FSP/PML constraints as other scene exports. The exporter reports
an error before returning a file when a mapping cannot be preserved.

CLI: `torchfdtd fsp-write-scene original.fsp edited-native.json --output edited.fsp --report edits.json`.
The geometry-only `write_fsp_geometry` API and `fsp-write-geometry` command keep
their existing-object contract.

## Workbench

Use **FSP → GPU → Open converted scene**, then the normal **Duplicate**,
**Delete** and primitive creation controls. A selected structure's **Structure
order** section provides **Move earlier in tree** and **Move later in tree**.
The project order determines the tie break when mesh orders are equal: the
later structure takes priority in an overlap. Lower numerical mesh order takes
priority independently of tree position.

Choose **FSP → GPU → Export current scene** to save. The dialog shows counts of
added, removed and remaining structures. Reimport the edited file when editing
that file further. Native JSON preserves the full edited project independently
of the FSP representation.

## Record identity and preservation

The present independent reader derives native IDs from record offsets. A new
or resized record can shift later objects. The export report therefore includes
`id_mapping` for structures, sources and monitor components. It also records
the source/output fingerprints. Reusing the old IDs with the new fingerprint
would identify different records and is not supported. Multiple objects can
have the same display name, since names are not used as record identity.

During a scene-list change, structures occupy the first original structure
position in the requested native order. Other records retain their relative
order. If the original has no structures, the new structures follow its
existing records. Moving records does not rewrite untouched record bytes.

`edits` describes the count and child-list replacement envelope.
`property_edits` describes the individual field edits inside that reconstruction.
`preserved_segments` maps every unchanged retained byte range to its new output
range, and the writer checks exact byte equality before returning. Deleted
records are deliberately omitted. The material section and footer are retained.
Retained record classes, final object counts, geometry, material response,
source pulses and monitor settings are checked after reparsing.

New objects can use object-defined constant dielectrics or unchanged supported
Drude/Lorentz entries already present in the original material database. They
can set their own mesh order independently of the database priority. New
dispersive database records are not generated. Native labels, colours and
inactive primitive controls remain in JSON and are identified in the report.

## Remaining compatibility work

The writer still requires a fully mapped layout input. It does not yet create
an entire FSP project without an original document. In-place primitive type
changes, unmapped source/monitor classes, hierarchical groups, result-bearing files,
arbitrary versions and general metadata semantics remain open. Opaque references
are preserved, not interpreted or repaired when a referenced object is deleted.
Reserved defaults for new records require external-reader validation. No
commercial simulation or external readback was performed for these tests.

## Verification

`tests/test_fsp_objects_write.py` checks each new primitive, Unicode and
duplicate names, deletion to an empty scene, additions to that empty scene,
repeat edits, interleaved source/structure records, point-monitor component ID
mapping, retained opaque metadata, unchanged database reuse and exclusive CLI
outputs. Material arrays verify the overlap-order effect. Combined topology and
mesh edits compare full E/H and plane DFT outputs on CPU/CUDA, and shared CUDA
cohorts retain the independently executed GPU outputs.

`tests/ui/fsp-objects-write.spec.js` exercises duplicate, delete, add, both tree
order controls, download, reimport, Python export and a native GPU solve with
nonzero flux. These checks support the stated native roundtrip scope. They are
not proof of optical equivalence with another solver.
