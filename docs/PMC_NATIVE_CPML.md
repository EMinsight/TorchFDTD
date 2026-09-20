# Native endpoint PMC with restricted CPML

Projects containing PMC or magnetic-symmetry faces can combine those walls
with PEC and restricted endpoint CPML. Native Python `Simulation(project)`,
the CLI `torchfdtd run project.json`, and browser jobs share this dispatch.
Closed PEC/PMC projects keep their existing endpoint path. Pure PEC/PML
projects continue to use the ordinary solver.

This connects the existing `EndpointCPMLSimulation` physics to native results.
It does not establish equivalence to the ordinary scalar-Yee PML sampling,
nor add general combinations of sources, ports or materials.

## Admitted project

- Three-dimensional, real FP32, resident, fixed-duration execution with
  automatic shutoff disabled. Meshes must have equal uniform spacing along
  all axes, including when represented by explicit coordinates.
- Staircase geometry with Yee material sampling. Native material rasterization
  is isotropic and nondispersive. ADE materials are rejected.
- Face kinds are PEC, PMC, their symmetry aliases, or PML. Periodic and Bloch
  faces are rejected when endpoint dispatch is selected.
- Every active PML face must have the same resolved depth and `sigma_scale`.
  Resolution honors each face's `layers`, falling back to `region.pml_cells`.
  Unequal resolved depths or strengths are rejected, not replaced by defaults.
- PML requires `kappa=1`, `alpha=0`, `polynomial=3`, and
  `alpha_polynomial=0`. In particular the ordinary default `alpha=1e-8` must
  be explicitly changed to zero. Unrepresentable translated decay strengths
  are rejected. Native schema depth and dimension constraints also apply.
- Only enabled point soft electric sources and enabled point E/H monitors
  sampled every timestep are accepted. At least one monitor is required.
  Nearest Yee sample coordinates, including stored upper PMC endpoints, are
  reported. Samples inside CPML or constrained by PEC are rejected. Source
  electric degrees of freedom must be unique.
- Every electric material sample in PML and its one-cell collar must exactly
  equal `region.background_index**2`. This exterior is fixed and its material
  VJP is zero. Structures intersecting this collar with other material fail
  before time stepping. Epsilon must be finite and at least one, and must
  satisfy the conservative Yee CFL constraint.
- The CPU reference is limited to 32768 cells. Native dispatch preflights
  tensor and host reservations against available memory before construction.
  The effective plan includes CPML auxiliary state and its workspace. CPU
  Python topology and allocator/runtime overhead remain outside the direct
  adapter tensor budget, as reported by its memory plan.

```python
from torchfdtd import Project, Region, Source, Monitor
from torchfdtd.solver import Simulation

faces = {a + '_' + side: {'kind': 'pmc'}
         for a in 'xyz' for side in ('min', 'max')}
for side in ('min', 'max'):
    faces['x_' + side] = {'kind': 'pml', 'layers': 3, 'alpha': 0,
                         'sigma_scale': .3}
project = Project(
    region=Region(dimension='3d', size=(1.6, .6, .6), mesh=.1,
                  steps=20, material_sampling='yee', backend='cpu',
                  boundaries=faces),
    sources=[Source(component='Ez', center=(0, 0, 0), pulse='continuous')],
    monitors=[Monitor(component='Ez', center=(.1, 0, 0))],
)
result = Simulation(project).run()
print(result.summary['endpoint_plan']['cpml'])
result.save('endpoint-cpml.npz')
```

The separate `endpoint_from_project(project)` adapter also uses this
translation. Its optional sampled epsilon and waveform tensors retain the
existing first-order endpoint adjoint contract. Native geometry rasterization
itself does not differentiate shape parameters.

## Exact effective profile

Let `h` be the equal cell spacing in micrometres, `L` the resolved layer count,
`s` the native sigma scale, and `epsilon_bg` the fixed background permittivity.
The adapter supplies the existing endpoint solver with

```text
reflection = exp(-20 * s * L * sqrt(epsilon_bg) / (L + 1))
rho = max(1 - distance_from_outer_face / (L * h), 0)
rate = 40 * s / ((L + 1) * h) * rho**3
b = exp(-rate * c0_in_um_per_second * dt_seconds)
c = b - 1
```

Each E or H curl derivative samples `rho` at its own endpoint target
coordinate. Kappa is one and alpha is zero. PML outer faces terminate at PEC.
The `reflection` argument parametrizes the cubic profile and is not a measured
reflection guarantee. The endpoint rho convention differs from ordinary
scalar-Yee PML, so equal GUI coefficients do not imply identical samples.
The complete mapping and `scalar_yee_profile_equivalence=false` are included
in `summary.endpoint_plan.cpml`. Both field and CPML auxiliary finiteness are
checked during the native run. Final E/H arrays and separately stored upper
endpoint arrays follow the established native endpoint result format.

## Browser workflow and focused checks

Open **Edit six faces together**, select the desired PML faces, then explicitly
press **Set supported endpoint CPML profile**. The button stages default region
layers, sigma scale one, kappa one, alpha zero and cubic grading for the selected
PML faces. It does not change geometry, sources, materials or mesh. The visible
description explains those changes before **Apply boundaries** validates the
entire draft. Unsupported combinations leave the saved project unchanged.
Custom common sigma scale and layer counts can be edited in region properties.

Ten focused CPU cases cover native/direct-adapter trace and final-field
agreement, effective profile and memory reporting, translated-parameter
rejections, source placement, fixed collar rejection, nonfinite auxiliary
states, CLI/NPZ and early budget admission. One existing closed-PMC native
trace/NPZ case also passed. The actual browser CPU test exercises explicit
profile selection, atomic rejection, submission and result metadata. It passed
in 3.9 seconds using an isolated API server and Vite, without building tracked
frontend assets. This integration adds no GPU performance or reflection
acceptance claim.
