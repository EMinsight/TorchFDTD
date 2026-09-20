> Interoperability distribution review is unresolved. Historical vendor readback/comparison evidence is not used as current release validation. Synthetic parser tests remain available.

# Independent FSP record reader and constrained writer

`torchfdtd.fsp_binary` reads the observed **FSP 1.1 layout records written by Lumerical v241**, without loading its runtime. This is an independent file-format implementation. It is **not complete FSP compatibility** or a general project encoder. The separate [native scene converter](FSP_NATIVE.md) now executes a subset of these records.

The implementation was derived from controlled, user-authored FSP data files and verified through separate application readback. Vendor executable code was not examined. No vendor material database or original FSP fixtures are distributed with the package.

## Coverage

- Bounded little-endian records: terminated UTF-8 strings, integer/real scalars, real/complex double matrices and integer matrices. Matrix dimensions and payload sizes are checked before reading.
- Embedded material dictionaries. Decoding data does not fit or execute the material in the native solver.
- Generic property dictionaries and object trees. Duplicate siblings remain distinct by record offset. Class UUIDs identify classes, not unique instances.
- Legacy revisions: rectangle 6/32, sphere 8/25, circle 4/25, ring 5/26, polygon 11/22, structure group 13/18. Selected geometry values and enabled flags are decoded. Controlled scalar forms of three rotation axes/angles, material mesh-order override/priority and sphere/cylinder ellipsoid flags/radii are decoded. Unknown expression forms are explicitly marked as not decoded. Other drawing fields are retained in the original bytes.
- The observed empty table of contents and project footer. Nonempty tables of contents, result/dataset records and unfamiliar revisions are explicitly rejected. The tested result-bearing sphere file is not accepted.

Saving without edits preserves every original byte. Existing destinations cannot be overwritten. Successful decoding does not establish physical or script compatibility.

## Independent commands

```powershell
torchfdtd fsp-read-native input.fsp --output inspection.json
torchfdtd fsp-edit-native input.fsp --patches monitor-edits.json --output edited.fsp
```

Inspection reports the tree, class IDs, record offsets, embedded materials, selected geometry and raw property names, with `requires_lumerical: false` and `native_execution_allowed: false`. This developer-facing interface is separate from the workbench's existing familiar-property licensed bridge.

Edits use the monitor's `record_offset` from that exact input. For example, replace the placeholder `12345` with its actual offset:

```json
[
  {"record_offset": 12345, "property": "apodizationCenter", "value": 8e-14},
  {"record_offset": 12345, "property": "apodizationWidth", "value": 4.5e-14}
]
```

Time values are in seconds. Allowed raw fields cover apodization, desired frequency count, wavelength/global/source-limit switches, custom frequency limits and time-monitor start/stop. Only the recognized DFT and time-monitor classes accept these edits. Invalid values or unsupported targets are rejected.

The raw monitor writer replaces scalar payloads at their original byte positions, reparses the file and checks its object layout. It does not resize records, rename objects, run scripts or recompute results.

The separate [native geometry writer](FSP_NATIVE.md#independent-geometry-writeback) supports existing primitive edits, Unicode names and variable-length polygon vertex matrices. It preserves untouched segments, reports shifted record offsets and checks the reparsed native geometry and material response. It does not provide general whole-project serialization.

## Validation status

The [scene-settings writer](FSP_NATIVE.md#independent-scene-settings-writeback) extends this with recognized source, monitor and FDTD settings, including [uniform target mesh edits](FSP_MESH_WRITE.md), [primitive list reconstruction](FSP_OBJECTS_WRITE.md) and [source/monitor list editing](FSP_INSTRUMENTS_WRITE.md). It updates controlling input properties, reparses the candidate and compares supported native semantics. Its sampling, PML and topology limits are explicit. New record metadata defaults require external-reader verification. Neither writer is a general whole-project serializer.

Synthetic tests check parser integrity, supported mappings and byte preservation. No vendor computation or readback results are used as release evidence. General format/version compatibility remains unestablished.
