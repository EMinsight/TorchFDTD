# GDS TEXT to fixed opposing mode ports

`torchfdtd.gds_ports.prepare_gds_mode_network` connects two explicitly selected
GDS TEXT names to the existing `ModeNetwork`. This is a restricted adapter,
not general foundry port support or a completed GDS-to-device parity claim.

The caller supplies the process layer/material mapping during `import_gds`,
the project region and pulse timing template, wavelength, one common fixed
isotropic modal permittivity, per-name source offsets and mode indices. The
caller must declare whether marker normals point outward or inward. No process
index, source timing, normalization, or normal convention is inferred.

## One call from markers to a runnable network

```python
from torchfdtd.gds_ports import prepare_gds_two_port

two_port = prepare_gds_two_port(imported, project, wavelength_um=1.55)
result = two_port.run()          # ModeNetworkResult with complex S
gradient_carrier = two_port.epsilon   # Yee-sampled imported geometry
```

`prepare_gds_two_port` wraps the adapter with defaults taken from the import
and the project: both markers when `imported.ports` holds exactly two (pass
`port_names` otherwise), outward marker normals, the wavelength of the
project's plane source template (a zero-size Gaussian plane template is added
when the project has no source, and `wavelength_um` is then required), source
planes four mesh cells outside each phase plane, the fundamental mode, and a
modal cross-section sampled from the imported structures and project
materials on the lower phase plane with the same mesh-order rule as native
voxelization. It returns the `ModeNetwork` together with `voxelize` of the
network project as a float tensor, so `run()` is the complete two-port
simulation and the tensor is the carrier for material gradients. Every
keyword of `prepare_gds_mode_network` can still be passed explicitly, and
`permittivity` overrides the sampled section.

The adapter contract is unchanged: full-cell marker apertures, cardinal
opposing normals on one axis, phase planes on E nodes, and exterior guides
that are straight from each boundary through its phase plane so the sampled
section equals the runtime material there. Branches and more than two ports
are not part of this helper; it selects from `layout.ports` so a wider port
model can extend the same entry point.

The supported markers have opposing cardinal x or y normals. Their transverse
centers must be zero. Width must equal the entire other XY cell extent and
height must equal the entire z cell extent. This makes the finite GDS aperture
exactly the complete periodic transverse supercell used by the native port.
Ordinary waveguide-width markers narrower than that cell are rejected. Oblique
ports, offset apertures, open transverse boundaries and multibranch networks
are unsupported. Native requirements still apply, including uniform real 3D
Yee sampling, nondispersive staircase materials, longitudinal CPML, E-node
source and detector planes, and sufficient source/port/PML separation.

Positive source offsets are distances outward from each detector phase plane.
Output channel order is increasing propagation coordinate, then the explicitly
selected mode indices. Original GDS names are retained, independent of the
order in `port_names`. Complex S amplitudes retain the detector-plane phase
convention and matched incident calibration of `ModeNetwork`.

## Actual geometry and differentiable material

`network.reference_epsilon()` is only the straight calibration guide. It does
not contain imported structures. The adapter adds imported structures to a
project copy but does not rasterize them. Use native Yee rasterization to
construct the sample epsilon explicitly:

```python
import torch
from torchfdtd.gds_ports import prepare_gds_mode_network
from torchfdtd.solver import voxelize

# imported comes from import_gds with explicit GDSLayer/GDSPortLayer contracts.
# project declares the named materials, background index and one Gaussian
# plane pulse template. The selected marker apertures cover the whole cell.
network = prepare_gds_mode_network(
    imported, project,
    port_names=("west", "east"), normal_convention="outward",
    source_offsets_um={"west": 1., "east": 1.},
    mode_indices={"west": (0,), "east": (0,)},
    wavelength_um=1.55, permittivity=2.25,
    options=adjoint_options,
)
epsilon_np, counts = voxelize(network.project)
epsilon = torch.from_numpy(epsilon_np)  # CPU, native precision, (..., 3)
# interior_mask is explicitly supplied by the caller and excludes both guides.
delta_epsilon = torch.tensor(0., dtype=epsilon.dtype, requires_grad=True)
result = network(epsilon + delta_epsilon * interior_mask)
loss = result.s[1, 0].real + .3 * result.s[0, 1].imag
gradient, = torch.autograd.grad(loss, delta_epsilon)
```

Both actual exterior guides must match the same supplied modal cross-section.
The existing network validates the runtime epsilon in both fixed exterior
regions and rejects unequal guides. Imported geometry extending into a guide
cannot silently replace that contract. Exterior material, source profiles and
eigenmodes remain fixed. Gradients flow through the caller's interior material
carrier and native checkpointed solver, not through GDS polygons, topology,
eigenvalues, or mode profiles. Geometry-to-permittivity gradients require a
separate explicitly differentiable material construction.

`network_budget_bytes` admits native modal packets and wrapper tensors.
`AdjointOptions` controls each resident solve and checkpoint storage. The
adapter adds no full-volume material allocation. Native `voxelize`, conversion,
the caller's material graph and the sparse eigensolver are outside these
budgets. The caller must separately admit sufficient CPU memory before calling
`voxelize`. This example is not a budgeted rasterizer or streamed route.

## Focused CPU evidence

The new test generates an independent GDS file with two TEXT markers and a
nontrivial slab polygon. Explicit extrusion produces a 0.4 um long slab of
index 1.7 in an index 1.5 background. The domain is 8 by 1 by 1 um, mesh 0.2 um,
400 steps and five longitudinal PML cells. The wavelength is 1.55 um, phase
planes are at -1 and +1 um, and source planes at -2 and +2 um.

Native Yee sampling changed 200 component samples. The CPU FP32 network gave
maximum complex S change 0.614452 relative to its straight calibration guide.
The uniform slab-permittivity derivative of Re(S21) + 0.3 Im(S12) was
-0.693175. This is evidence of a connected native material VJP, not a mesh
convergence or continuum-gradient accuracy claim. The test also checks
reciprocity, straight-guide discrete phase, and rejection of an altered
exterior guide. No GPU was used. Metadata tests reject unsupported apertures,
centers and normals before constructing a network.

The one-call test imports a straight 0.6 um wide guide of index 1.7 spanning
the same 8 by 1 by 1 um cell with two TEXT markers at -1 and +1 um and no
project source. `prepare_gds_two_port` with `wavelength_um=1.55` places the
source planes at -1.8 and +1.8 um, samples the guide itself as the modal
section, and its calibration guide equals the sampled runtime epsilon
everywhere. The CPU FP32 run gives a finite, reciprocal S matrix with
|S21| above 0.5 and S21 within 0.05 of the discrete straight-guide phase. A
supplied template source provides the default wavelength, and a single
marker is rejected with a request for explicit `port_names`.
