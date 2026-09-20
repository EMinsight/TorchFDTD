> Interoperability distribution review is unresolved. Historical vendor readback/comparison evidence is not used as current release validation. Synthetic parser tests remain available.

# FSP interoperability bridge

TorchFDTD has two FSP paths. **FSP → GPU** independently imports a supported layout subset into the native CPU/CUDA engine and writes supported scene edits, including uniform target meshes. See [native conversion and export](FSP_NATIVE.md) and [mesh editing](FSP_MESH_WRITE.md). General FSP compatibility remains incomplete.

The optional **FSP inspect** bridge described below inspects and edits settings through an installed, licensed Lumerical FDTD. It is separate from the [independent record reader](FSP_BINARY.md) and native GPU path.

## Browser workflow

1. Click **FSP**, or choose an `.fsp` using **Open**.
2. The connected workstation opens a separate hidden Lumerical session. The inspector lists objects, nested groups, readable object properties, global source/monitor properties and referenced materials.
3. Select an object and filter properties, for example `wavelength`, `pml`, `bc` or `apodization`. Values retain Lumerical units, including metres and seconds rather than the native editor's micrometres. Read-only or inactive vendor properties may reject edits.
4. Download the untouched original, or stage scalar property edits and choose **Save edited .fsp**. The bridge works on a private copy, saves it, reopens it in Lumerical, and checks each requested value before making the export downloadable. The original remains unchanged. Edited exports discard saved simulation results when switching to layout mode.
5. **Preservation archive** downloads a `.pwfsp` ZIP containing `original.fsp` and `inspection.json`. This preserves undecoded information in the original file, with its SHA-256 recorded. It is not a replacement FSP encoding or an independently runnable project.

Arrays and complex values are represented with explicit types and dimensions in inspection JSON. Python property patches accept these encoded values. The browser currently edits scalar values. Scripts and object identities are displayed read-only. Renaming, adding and removing FSP objects through the bridge are not implemented.

## Python and CLI

Set `TORCHFDTD_LUMAPI` to the installed `api/python/lumapi.py` if automatic installation detection fails. License availability is checked when a session opens. Vendor code and material databases are not bundled with TorchFDTD.

```powershell
python -m torchfdtd.cli fsp-inspect project.fsp --output inspection.json --archive project.pwfsp
python -m torchfdtd.cli fsp-export project.fsp --output edited.fsp --patches patches.json
```

`patches.json` is an ordered list. Coupled settings follow Lumerical's own property-update behavior. Requested values are checked together after saving.

```json
[
  {"object_id":"::model::sphere", "property":"radius", "value":5.5e-7},
  {"object_id":"::model::source", "property":"wavelength start", "value":1.4e-6}
]
```

```python
from torchfdtd.fsp import inspect_fsp, export_fsp
inspection = inspect_fsp("project.fsp")
export_fsp("project.fsp", "edited.fsp", [
    {"object_id": "::model::FDTD", "property": "pml layers", "value": 16}
])
```

An export with no patches is a byte-exact copy and needs no Lumerical license through the Python/CLI path. Existing output files are never overwritten.

## Current limitations and evidence

- The bridge is not an independent binary parser. The inspected fixture starts with the `LUMERICAL file version 1.1` header. Recognition of that header alone does not prove a file can be decoded.
- Sweeps, result arrays and data not exposed by object-property getters remain in the original file but are not decoded into inspection JSON. Relative external dependencies are not bundled.
- Duplicate objects of the same type are addressed by tree-order suffixes such as `#1` and `#2`. Mixed-type duplicate names and ambiguous group scopes can exceed installed-API enumeration capabilities. Such failures are recorded as diagnostics, not interpreted as missing objects.
- Vendor setup scripts may follow Lumerical's usual update rules when properties change. They are not translated into native Python. Final readback catches coupled changes to requested values, but does not yet prove every unrelated property is unchanged.
- Optional installed-v241 integration tests are separate from current native release validation. Historical external readback records are not used as current release evidence. Synthetic tests exercise source hashing, mapped settings and failed-export preservation without loading the vendor runtime.

Lumerical exposes object values through its documented [getnamed](https://optics.ansys.com/hc/en-us/articles/360034408574-getnamed-Script-command) and [setnamed](https://optics.ansys.com/hc/en-us/articles/360034928793-setnamed-Script-command) commands. Its separate [project-to-script prototype](https://optics.ansys.com/hc/en-us/articles/1500007185181-FDTD-Project-to-Script-Prototype) also advises checking reconstructed projects. TorchFDTD's preservation and readback checks do not establish full solver equivalence.
