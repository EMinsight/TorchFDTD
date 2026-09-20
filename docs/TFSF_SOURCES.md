# Closed total-field/scattered-field sources

Version 0.14 adds `Source(kind="tfsf")`, `FDTD.addtfsf()` and **Design → TFSF box**. The box encloses the scatterer. Samples inside contain the total field, while samples outside contain the scattered field. The source supplies the same incident wave independently of the structure. This is the established equivalent-current construction, implemented on the native discrete Yee grid. See [Oskooi and Johnson, Electromagnetic Wave Source Conditions](https://arxiv.org/abs/1301.5366) for the physical principle.

## Supported scope

- 2D z-invariant and 3D boxes, every active Cartesian propagation axis and either direction. A 2D box has four active faces.
- Transverse Cartesian electric polarization or a transverse theta/phi vector. These angles orient the electric field, not the propagation direction.
- Gaussian, continuous, sampled and broadband drive settings, including global temporal inheritance. Amplitude multiplies the auxiliary soft drive. It does not specify calibrated incident E or power.
- CPU, Torch CUDA and fused CUDA, float32/64, eager/graph execution, process batches and shared CUDA tensor cohorts. Different boxes in one scene are applied in source order. Independent cases share the fused source launches.
- Dielectric or passive dispersive scatterers inside the box. Graded mesh is allowed outside the refined box neighborhood.

All active outer boundaries must be PML. The box faces and their neighboring cells must have uniform minimum mesh spacing and homogeneous nondispersive background material. Leave at least two interior cells between every box face and the PML, and at least three cells across each active box dimension. Material touching a face neighborhood is rejected. Requested box faces snap to mesh nodes. The resolved positions appear in the estimate, preview and result summary.

Oblique incidence, layered incident backgrounds, structures crossing the box faces, periodic TFSF cells, Gaussian beams, eigenmode ports and FSP TFSF conversion remain unsupported. This source does not establish complete application compatibility.

## Python and interface

```python
from torchfdtd import Project, Region, Source, Structure, Simulation

p = Project(
    region=Region(dimension="3d", size=(3.2, 3.2, 3.2), mesh=0.05,
                  pml_cells=8, steps=1300, backend="cuda", cuda_kernel="fused",
                  material_sampling="yee"),
    structures=[Structure(kind="sphere", radius=0.3)],
    sources=[Source(kind="tfsf", size=(1.6, 1.6, 1.6), normal="x",
                    direction="+", component="Ez", wavelength=1.55,
                    time_definition="standard", pulse_length=8e-15,
                    pulse_offset=30e-15, incident_pml_cells=96)],
)
result = Simulation(p).run()
```

Native lengths are micrometres. The optional editing facade uses metres:

```python
from torchfdtd import FDTD
fdtd = FDTD(p)
fdtd.addtfsf(name="second box", x_span=1.6e-6, y_span=1.6e-6,
            z_span=1.6e-6, injection_axis="y-axis", direction="Backward",
            component="Ez")
```

In the UI, add **TFSF box**, set spans, propagation axis, direction and polarization, then use **Preview time signal / spectrum**. The preview shows incident entry E, entry canonical H and exit E. These are actual auxiliary fields, not the values added to the six faces. Changing propagation axis preserves the box spans. Transparent box rendering leaves the enclosed geometry visible.

Pass independent projects to `run_tensor_batch(projects, cohort_size=...)`. Each case has its own incident state. The current tensor API still requires a common real grid, common duration and fixed-step execution. General automatic termination is available in single/process runs.

## Discrete implementation

`tfsf.py` defines component-specific inside masks at each E/H Yee position. Let `M_E` and `M_H` denote these masks and `C-` and `C+` the backward and forward discrete curls. After the ordinary updates, the corrections are

```text
delta E = S / n_background² * (M_E C-(H_inc) - C-(M_H H_inc))
delta H = -S * (M_H C+(E_inc) - C+(M_E E_inc))
```

The mask differences vanish away from the faces. Sparse target indices and incident samples therefore cost O(box surface), without storing full-volume masks or time-by-surface source tables. Duplicate corner contributions are summed before execution.

A live scalar Yee line supplies the discrete incident fields. It has `2*L + 64 + N_normal` cells, with `L` auxiliary CPML cells at each end. Its mesh, timestep and background index match the box. The drive sits eight cells before the entry probe. This delay and the numerical dispersion are retained. Line fields and CPML memory cost O(normal span + L), while the scalar drive table costs O(time steps).

The fused path combines auxiliary E advancement with E-face corrections in one launch, both reading the old incident H. The H phase combines H advancement with H-face corrections, both reading the new incident E. This avoids cross-block read/write dependencies. Each source ordinal gets a separate launch, preventing races between overlapping boxes in one case. Independent cases occupy the second launch dimension.

CUDA graph reset clears all incident fields and memory. Termination diagnostics include a positive area-weighted incident-line norm. Incident CPML memory is checked for non-finite values. The source-finished gate includes travel from the drive through the box, so a delayed pulse cannot trigger premature termination.

## Quantitative validation

The [validation report](validation/TFSF_REPORT.md) retains all mesh results, including a non-monotonic error sequence. Twenty homogeneous axis/direction/polarization cases are compared with an independently written scalar recurrence whose ends lie beyond the finite light cone. Long-duration auxiliary-PML convergence is measured separately. Regression tests cover background indices, overlapping boxes, graded exterior mesh, dispersive scatterers, diagnostics, both precisions and native CPU/CUDA/tensor agreement.

The [sphere example](../examples/tfsf_sphere.py) integrates outward scattered flux on six planes, subtracts a matched empty-box reference and divides by homogeneous incident intensity. It compares with the analytic Mie series computed using SciPy Bessel functions. The 0.05 µm result happens to be closer than the 0.025 µm result. It is not evidence that the coarser mesh is generally more accurate. Time, geometry discretization, physical PML and auxiliary-PML convergence remain separate checks for each quantitative use.

Reproduce with:

```bash
python -m benchmarks.tfsf_sources
python -m examples.tfsf_sphere --backend cuda --meshes 0.1 0.05 0.025 0.02
python -m examples.tfsf_sphere --backend cuda --meshes 0.025 --duration-fs 240 --output results/tfsf-sphere-long.json
python -m pytest -q tests/test_tfsf.py
```

The existing workbench limit is eight million cells per job. The attempted 0.0125 µm mesh of this 3.2 µm cube exceeds that limit and was rejected before solving. No result is inferred for that mesh.
