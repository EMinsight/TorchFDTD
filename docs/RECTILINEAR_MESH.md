# Rectilinear mesh controls

The native solver accepts uniform, graded, and explicit tensor-product grids. All nonuniform grids and independent axis spacings require `material_sampling="yee"`. Coordinates and geometry use micrometres. The SI editing facade uses metres.

```python
from torchfdtd import Region

r = Region(dimension="3d", size=(6.4, 3.2, 3.2),
           mesh_steps=(0.05, 0.2, 0.2), material_sampling="yee")
print(r.shape, r.time_step)
```

`mesh_steps` sets independent dx, dy, dz values for uniform grids, or independent minimum steps for the native graded generator. With `mesh_steps=None`, `mesh` retains the original common-step behavior.

For explicit grids, set `mesh_type="explicit"` and provide all three `mesh_coordinates` node arrays. Nodes must be finite and strictly increasing, with the first/last endpoints equal to minus/plus half the corresponding `size`. The 2D invariant z direction needs exactly two bounding nodes. The grid contains one fewer cell than nodes on each active axis. Changing geometry keeps explicit nodes fixed. It does not invoke automatic meshing or a conformal algorithm.

The time step uses the conservative bound `eta / (c * sqrt(sum(1 / min_axis_step_m**2)))` over active axes. An optional `time_step_override`, in seconds, can retain a smaller step for matched comparisons. An override above the configured limit is rejected. Explicit steps can have a large adjacent ratio, but abrupt grading may increase reflections and dispersion. A stability bound alone is not an accuracy guarantee.

Primal derivatives divide by their cell widths. Dual derivatives divide by adjacent half-width sums, including periodic/Bloch seams. CPML profiles use physical depth on explicit or independent-axis meshes. PML layer counts refer to actual cells. Native generated graded meshes keep PML cells on the configured fine lattice. Constitutive updates use the actual time step. Tensor batches require matching nodes and time steps.

Normal-incidence one-way planes require constant normal spacing in their injection neighborhood and periodic transverse boundaries. Closed TFSF boxes require constant spacing along each axis throughout their support and neighboring cells, plus a homogeneous incident shell. Different axes may have different spacings. A TFSF box spanning varying normal steps is rejected. Bloch fields use the Torch reference update path and are not supported by real fused tensor batches.

In the UI, select **Mesh settings → Independent axis spacing** to edit dx/dy/dz. **Edit explicit node arrays** opens all current nodes, accepts edits atomically, and validates the scene before applying them. **Preview simulation mesh** shows actual cell boundaries, with decimation labeled for large previews. **Set a smaller fixed time step** exposes the optional time step in fs. Python export preserves these settings.

For the `FDTD` facade, `set("dx", value)`, `set("dy", value)`, and `set("dz", value)` now change their respective axes in metres. Use `set("mesh step", value)` for the old common-spacing intent. `setmesh(x, y, z)` installs centered explicit node vectors atomically in metres. `set("time step", value)` takes seconds, and `None` restores automatic CFL selection.

Synthetic FSP conversion tests cover saved uniform anisotropic and auto/custom nonuniform staircase layouts. The independent importer retains supported saved node arrays and a conservative saved time step. It does not reproduce the source mesher, conformal rules, or proprietary material-interface corrections. It rejects stale CAD/PML bounds, unfamiliar boundary codes, inconsistent periodic ghosts, and excessive stored time steps. The original binary document remains immutable.

Validation includes independent 3D discrete Fourier waves on rectangular cells, weighted curl adjointness and leapfrog energy conservation on irregular periodic/Bloch grids, paired-source scalar references, and CPU/CUDA/single/batch checks with dispersive PML scenes. [Tests](../tests/test_rectilinear.py), [synthetic format tests](../tests/test_fsp_mesh.py), [runnable example](../examples/rectilinear_mesh.py).

The [RTX 5880 mesh ablation](validation/RECTILINEAR_ENSEMBLE_REPORT.md) measures transverse-invariant vacuum and layer stacks. Coarsening transverse axes preserves the propagation step and all compared observables for those scenes. It does not establish an accuracy improvement for arbitrary 3D geometry. Cross-library timings remain separate in the README.
