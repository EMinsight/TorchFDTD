# Uniform mesh editing in FSP scenes

The independent `write_fsp_scene` path can now change a recognized layout's
uniform mesh spacing and total domain spans. It writes the controlling uniform
mesh selection, axis steps, CAD bounds, saved grid arrays, CFL fraction and
maximum duration together. Python, CLI and **FSP → GPU → Export current scene**
use this same writer. The geometry-only writer keeps its original fixed-grid
contract.

This is a tested independent import/export subset. No commercial solver was
executed to validate this change. Reopening and remeshing the generated file in
other software remains unverified. Preserving unknown bytes and passing the
native parser do not establish general FSP compatibility.

## Python workflow

```python
from photonweave import Project, Simulation, write_fsp_scene
from photonweave.fsp_binary import FspDocument
from photonweave.fsp_native import convert_fsp

original = FspDocument.load('input.fsp')
conversion = convert_fsp(original, backend='cuda')
if conversion.project is None:
    raise ValueError(conversion.issues)

data = conversion.project.model_dump()
data['region'].update(
    mesh_type='uniform',
    mesh_steps=(0.06, 0.08, 0.10),  # micrometres
    mesh_coordinates=None,
    material_sampling='yee',
    time_step_override=None,
)
edited = Project.model_validate(data)
document, report = write_fsp_scene(original, edited)
document.save('edited-mesh.fsp')  # exclusive creation
edited.save('edited-native.json')
result = Simulation(edited).run()
```

The input must already have a fully mapped native scene. A saved nonuniform
scene can be changed to a uniform target. Edited graded or explicit-node
generators cannot yet be exported. Merely changing geometry continues to leave
the mesh unchanged. Mesh refinement remains a deliberate project edit.

## Grid, PML and time conventions

Native `region.size` is the **total computational extent including PML**. For
each active axis, the uniform cell count is the ceiling of requested span
divided by spacing, with the existing near-integer roundoff guard. Export uses
that actual lattice rather than silently shrinking a final cell. The report
contains requested and actual spans, old/new shapes, stored CFL, time step and
interface sampling.

The source file's computational origin stays fixed. Interior CAD bounds are
the nodes after the minimum-side PML cells and before the maximum-side PML
cells. Unequal layer counts can therefore move the interior CAD centre while
preserving global object positions. Paired Periodic axes receive one saved
duplicate interval on either side. Stored PML profile limits and even-layer
requirements still apply. Native CPML profile coefficients are not translated.

For spacings `h_i` in metres, the uniform conservative time step is
`dt = courant_factor / (c * sqrt(sum(1 / h_i**2)))`, over active axes. When a
smaller native fixed time step is selected, its effective value is encoded by
reducing the stored CFL fraction. The native JSON preserves the separate
override and original CFL ceiling. The source settings and monitor sampling
controls are reevaluated for the changed time step, and maximum duration is
`steps * dt`. Holding the step count fixed does **not** hold physical duration
fixed. Set the steps appropriately for convergence studies.

The public [FDTD solver reference](https://optics.ansys.com/hc/en-us/articles/360034382534-FDTD-solver-Simulation-Object)
describes uniform axis spacing, CFL-controlled time steps and distinct custom
or user-specified mesh modes. Its public UI definitions support these input
conventions, but do not document or validate the binary record encoding.

## Interface sampling and current limits

The current independent reader represents an isotropic uniform record with
legacy **Cell centers** sampling, and an anisotropic uniform record with
**Yee component locations** sampling. Export requires the corresponding target
sampling. Otherwise it raises an error instead of changing dielectric
discretization during a roundtrip. This is a limitation of the present native
mapping, not a claim about the commercial mesher. Resolving it requires a
consistent general interface representation.

An anisotropic uniform record reimports as explicit uniform node arrays with
Yee sampling. In 2D, the invariant z display span reimports as dx, and this is
reported as native-only metadata. Independent 2D tests confirm preservation of
electric fields, point traces, plane spectra and flux despite that display-span
change. No dimensionality changes are written.

Unknown property values, nonuniform generator controls, other file versions,
mesh overrides and external remeshing can have interactions outside this
subset. [Primitive list edits](FSP_OBJECTS_WRITE.md) are supported separately,
alongside mapped [source/monitor lists](FSP_INSTRUMENTS_WRITE.md). Hierarchy editing remains open. No claim
of cross-solver optical equivalence or improved mesh accuracy follows from
these roundtrip tests.

## Verification

`tests/test_fsp_mesh_write.py` uses authored input records only. It checks the
serialized lattice, PML/CAD bounds, periodic duplicate intervals and CFL against
independent formulas. It covers 2D/3D, isotropic/anisotropic spacing, unequal
PML counts, span rounding, a translated source-file origin, repeated edits,
fixed time-step encoding and conversion from saved nonuniform grids. Unedited
byte segments and the original immutable input are checked on every roundtrip.

Numerical tests compare each edited scene with its reimported scene on CPU,
CUDA and shared CUDA batches, including all E/H fields and plane DFT output.
They compare the same edited grid. They do not compare different resolutions
or establish convergence. The browser test
`tests/ui/fsp-mesh-write.spec.js` changes dx/dy/dz, exports and reimports the
file, exports Python and runs the resulting grid with a nonzero flux result.
