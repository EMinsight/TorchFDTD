# Selectable mesh settings — v0.8

Select **FDTD → Mesh settings**. Geometry and step values use µm.

| Control | Meaning |
| --- | --- |
| Mesh type | Uniform, or Graded with local refinement |
| Fine mesh step | Explicit smallest spacing, retained inside refinement regions and PML |
| Interface sampling | Legacy shared cell centers, or physical Yee component locations. Graded requires Yee. |
| Maximum step | Upper bound for background spacing |
| Grading factor | Maximum neighboring step ratio, 1.05–1.5, default 1.25 |
| Background cells / λ | Additional background spacing cap: shortest configured wavelength / background index / this value. Default 24. |
| Refine structures, sources and monitors | Uses rotated structure bounds and source/monitor support, with two fine cells of padding on either side |
| Add refinement region | Editable center, spans and enabled state. These regions retain the fine step. |
| Freeze automatic refinements | Copies automatic bounds to manual regions and turns off automatic refinement. Useful before removing structures for an air reference. |
| Preview simulation mesh | Actual node lines, axis projections, bounds, cell reduction, estimated memory, timestep and spacing range |

Uniform mode and legacy sampling remain available for existing projects. Switching to Graded selects Yee sampling. Imported supported FSP files retain their original uniform legacy behavior until this setting is changed. FSP nonuniform and conformal mesh import remains unsupported.

## Algorithm and scope

This is an independently implemented **static rectilinear graded Yee mesh**, not a copy of Lumerical's mesher. Structure bounds are projected onto coordinate axes. Their intervals retain the original fine lattice. Empty gaps use analytic metric equidistribution: the requested spacing grows linearly with distance from a refined edge, up to the wavelength/user cap. Equidistant points in the integrated reciprocal-spacing metric create smooth cells. Short gaps fall back to uniform if minimum spacing, maximum spacing or grading constraints cannot be met. No remainder cell is smaller than the fine step.

PML layers and one adjacent interior cell retain fine spacing. Periodic/Bloch seam cells are also fine. Nonuniform curls use primal cell widths for forward derivatives and dual widths for backward derivatives. CPU and CUDA share these metric coefficients. Uniform axes bypass metric multiplication. The timestep remains the conservative fine-grid CFL value, so selecting Graded retains the same number of steps and physical duration.

The grid is a tensor product. A refinement region therefore refines coordinate planes across the whole domain, rather than only its 3D box. This avoids hanging nodes and subcycling but saves less memory than a validated octree/subgrid implementation might. Meshes are generated before a run and do not adapt to evolving fields. Manual regions all use the same fine step. Choose that step to resolve material wavelength, skin depth, small gaps and geometric details. Background cells/λ is a spacing heuristic, not an error estimator, and it does not capture every tail of a broadband pulse.

Yee sampling evaluates geometry and epsilon separately at Ex, Ey and Ez positions. Electric components are centered on their own axis and located on nodes along transverse axes. Magnetic components use the dual positions. Dispersive auxiliary states follow each owned electric component. Interfaces are still staircase approximations. There is no conformal integration or subpixel smoothing in this release.

The preview shows structure bounds, not their exact curved surfaces. For large grids, only the preview lines are decimated. Field images on a graded grid are resampled onto regular physical pixels by nearest field location. NPZ retains full final E/H arrays and exact `mesh_x_um`, `mesh_y_um`, `mesh_z_um` node arrays. Yee offsets must be applied when interpreting each component. Point monitors sample the nearest component location without interpolation.

## Python

```python
from torchfdtd import Project, Region, MeshRefinement, Simulation, freeze_refinements

p = Project(region=Region(
    dimension='3d', size=(6, 6, 6), mesh=0.046875,
    mesh_type='graded', material_sampling='yee',
    mesh_max=0.15, mesh_ppw=24, mesh_grading=1.25,
    mesh_refinements=[MeshRefinement(center=(0, 0, 0), size=(1.4, 1.4, 1.4))],
    backend='cuda',
))
# Add materials, structures, sources and monitors before freezing.
p = freeze_refinements(p)
result = Simulation(p).run()
air = Project.model_validate(p.model_dump())
air.structures = []
# Keep the sources, region and frozen refinements identical.
air_result = Simulation(air).run()
```

The familiar editing facade additionally supports `set('mesh type', 'graded')`, `set('material sampling', 'yee')`, `set('maximum mesh step', value_in_metres)`, `set('mesh grading', 1.25)`, `set('mesh ppw', 24)` and `set('mesh auto refine', True)`. These are native extension properties, not a promise of full LSF compatibility.

## Choosing accuracy and speed

Start with Uniform + Yee as the accuracy baseline. Try Graded with 24 background cells/λ, then compare the complex response with the uniform case and refine the fine spacing. Increasing cells/λ or adding refinement regions reduces coarsening. If almost all cells are already fine, Graded can be slower because metric operations still cost time. Strong resonances can require a smaller **dt stability factor** as well as a finer spatial grid.

Lumerical describes nonuniform grid resolution and conformal interface treatment as distinct techniques in its official [mesh refinement guide](https://optics.ansys.com/hc/en-us/articles/360034382614-Selecting-the-best-mesh-refinement-option-in-the-FDTD-simulation-object) and [FDTD simulation object documentation](https://optics.ansys.com/hc/en-us/articles/360034382534-FDTD-solver-Simulation-Object). TorchFDTD's controls implement the specific algorithm above, with separately measured behavior.


Current validation uses discrete identities, analytic propagation and CPU/CUDA agreement. Grading is a selectable heuristic, with no universal accuracy or speed guarantee. Earlier commercial comparisons are excluded.
