# Native boundaries and complex fields

TorchFDTD supports independently configured PML, PEC and anti-symmetric faces, and paired Periodic/Bloch faces in its CPU and CUDA engines. The browser exposes these under FDTD → Boundary conditions. Python uses the same project model.

```python
from torchfdtd import Project, Region, BoundaryFace, Boundaries

project = Project(region=Region(
    boundaries=Boundaries(
        x_min=BoundaryFace(layers=16, kappa=3, alpha=0.02, alpha_polynomial=1),
        x_max=BoundaryFace(layers=20),
        y_min=BoundaryFace(kind="bloch"),
        y_max=BoundaryFace(kind="bloch"),
    ),
    bloch_phase=(0, 0.4, 0),
    complex_display="imag",
))
```

## Periodic and Bloch conventions

- Both ends of a cyclic axis must use the same kind. Browser and familiar `FDTD.set("y min bc", "Bloch")` commands pair the faces automatically. The native model rejects mismatched pairs.
- There are N independent cells on a periodic axis. The period is **N × mesh**, using the mesh-rounded domain size returned by validation. There are no duplicated end planes in saved native arrays.
- `bloch_phase` is in radians, with **F(r + L) = exp(+i φ) F(r)**. A wavevector in rad/m is converted using φ = k × L in metres. A zero Bloch phase matches Periodic, but retains complex storage.
- Periodic/Bloch conditions repeat structures and sources. A dipole becomes a phased array of dipoles. Each E/H sheet component receives the fundamental spatial phase exp(i k·r) along Bloch axes at its own Yee position. A single soft sheet radiates in both directions.
- The phase is fixed across the source spectrum, so this is not broadband fixed-angle/BFAST injection. Diffraction orders can differ by integer multiples of 2π/L.
- The invariant z dimension has no boundary in 2D. Its configuration remains at defaults.

The sign convention follows the documented [Lumerical Bloch phase relationship](https://optics.ansys.com/hc/en-us/articles/360034382714-Bloch-boundary-conditions-in-FDTD-and-MODE). FSP wavevector and mesh mapping are not yet validated for native import.

## PEC and anti-symmetric walls

Use `BoundaryFace(kind="pec")` or `BoundaryFace(kind="antisymmetric")`. The browser offers PEC and Anti-symmetric (PEC). The familiar facade accepts `FDTD.set("x min bc", "PEC")` and `FDTD.set("x max bc", "Anti-Symmetric")`. These faces are independent. Entering a cyclic boundary pairs both faces, and replacing one member of a cyclic pair replaces the other to keep the model valid.

Both labels implement the same electromagnetic parity: tangential E and normal H are odd across the wall, while normal E and tangential H are even. Anti-symmetric reduction is valid only when the full material distribution and excitation obey this parity. It does not automatically mirror or validate the omitted geometry. This terminology follows the [Ansys symmetry convention](https://optics.ansys.com/hc/en-us/articles/360034382694-Symmetric-and-anti-symmetric-BCs-in-FDTD-and-MODE).

Walls lie exactly at `region.mesh_nodes[axis][0]` and `[-1]`. For uniform meshes these are the mesh-rounded region endpoints. Tangential E at the lower wall is a stored zero node. The upper tangential E is a zero ghost node, so the last forward derivative is `-E_last / dx_last`. The wall is never moved to a half-cell location. Production zero initialization and validated source injection preserve lower-wall tangential E and normal H constraints. Low-level callers supplying their own initial fields must satisfy those constraints.

Supported scope: staircase materials, real and complex fields, CPU/Torch and fused CUDA updates and explicit adjoints, streamed slabs, and real CUDA batches. Subpixel interfaces with these walls are rejected. Every component of a vector source is checked at its actual Yee support. Sources that write constrained wall components are rejected. Existing one-way and TFSF source restrictions exclude these walls.

Tests cover discrete cavity eigenfrequencies, both transverse polarizations on all three axes, doubled periodic versus reduced domains, corners, nonuniform edge metrics, transpose identities, resident/streamed gradients and CUDA batch consistency. See [numerical tests](../tests/test_pec_boundaries.py) and [delivery-surface tests](../tests/test_pec_surface.py). These are native verification results, not vendor-equivalence measurements.

**PMC and symmetric boundaries remain unsupported.** Exact upper-endpoint PMC requires additional tangential E and normal H face states, plus intersecting E-edge states. Selecting these kinds raises an explicit error. The next implementation contract is [PMC implementation plan](PMC_IMPLEMENTATION_PLAN.md). PEC boundaries do not implement a PEC material model.

## Native CPML parameters

Each PML face has `layers`, `sigma_scale`, `kappa`, `alpha`, `polynomial` and `alpha_polynomial`. `layers=None` inherits the region's common `pml_cells`. These are **native CPML coefficients**, not a claim of equivalence to Lumerical Standard/Stabilized/Steep-angle profiles or their normalized coefficient values.

For depth fraction ρ at the appropriate staggered E/H derivative location and layer count L:

```
sigma = sigma_scale * 40/(L+1) * rho**polynomial
kappa(rho) = 1 + (kappa_max - 1) * rho**polynomial
alpha(rho) = alpha_max * (1-rho)**alpha_polynomial
b = exp(-(sigma/kappa + alpha) * courant)
c = sigma * (b-1) / (sigma*kappa + alpha*kappa**2)
psi_next = b * psi + c * raw_derivative
stretched_derivative = raw_derivative/kappa + psi_next
```

At zero sigma and alpha, c is defined as zero. The grading uses ρ = depth/(L+1), with E/H half-cell offsets. `polynomial=3`, `kappa=1`, `alpha=1e-8`, `alpha_polynomial=0` and `sigma_scale=1` provide the default cubic profile. Custom coefficients need their own reflection and convergence checks. Lumerical uses a separately documented [PML normalization and profile scheme](https://optics.ansys.com/hc/en-us/articles/360034382674-PML-boundary-conditions-in-FDTD-and-MODE), so FSP values are not copied blindly into these fields.

Unlike the original upstream implementation, the new derivative kernels cover PML interface derivatives directly and implement kappa in both the stretched derivative and convolution coefficients. Corners apply the stretch for each participating axis.

## Results

Bloch runs preserve complex E, H and monitor arrays in NPZ. JSON monitor output includes `signal` (real), `signal_imag` and `complex`. CSV includes a separate imaginary column. Time plots show the real component and label it accordingly. Snapshots can display real, imaginary, magnitude or phase, with phase measured in radians. Their selected display representation does not change stored full fields.

Real traces use a one-sided Hann FFT scaled by 2/N. Complex traces use the positive bins of a full Hann FFT scaled by 1/N. Neither spectrum is normalized transmitted power. E and H remain spatially and temporally staggered.

## Verification and remaining scope

Still required for full parity: independent FSP mapping, named Lumerical PML-profile equivalence, PMC/symmetric boundaries, PEC/subpixel coupling, automatic angle-to-Bloch source settings, BFAST, dispersive-medium and grazing-angle coverage, and the other families in the parity roadmap.
