# Normal-incidence one-way planes

Version 0.13 adds a discrete electric/magnetic injection pair for a plane travelling along +x, -x, +y, -y, +z or -z. In 2D, propagation is along x or y. Both transverse electric polarizations and their linear combinations are available. CPU, Torch CUDA, fused CUDA, graph/eager execution and compatible tensor cohorts use the same prepared source terms.

## Python

```python
from photonweave import Project, Region, Source, Monitor, Simulation, Boundaries, BoundaryFace

p = Project(
    region=Region(size=(8, .5, 1), mesh=.025, steps=1600,
                  pml_cells=16, backend='cuda', material_sampling='yee',
                  boundaries=Boundaries(y_min=BoundaryFace(kind='periodic'),
                                        y_max=BoundaryFace(kind='periodic'))),
    sources=[Source(kind='plane', injection='oneway', normal='x', direction='+',
                    center=(-1.5, 0, 0), size=(0, .5, 0), component='Ez',
                    wavelength=1.55, pulse_cycles=1, incident_pml_cells=96)],
    monitors=[Monitor(center=(.5, 0, 0))],
)
result = Simulation(p).run()
result.save('results/oneway.npz')
print(result.summary['oneway_planes'])
```

`Source` geometry uses micrometres. The `FDTD` facade uses metres and provides `addplane(injection_axis='x-axis', direction='Forward', x=-1.5e-6)`. Configure its transverse periodic boundaries before running. `addplane()` defaults to one-way injection. `Source(kind='plane')` retains the existing soft, bidirectional sheet unless `injection='oneway'` is selected. The facade also accepts `injection='soft'`.

The [slab example](../examples/oneway_slab.py) runs a dielectric slab and its matching background reference, compares R/T with the analytic Fresnel solution, and measures reflection on the scattered side:

```sh
python -m examples.oneway_slab --backend cuda --direction +
python -m examples.oneway_slab --backend cuda --direction - --output results/backward-slab
```

## Geometry and UI

The source spans the complete transverse unit cell, centered on it. Transverse boundaries must be Periodic or zero-phase Bloch. The propagation axis must have PML at both ends. The snapped E plane and its neighboring cells must have the nondispersive background index. Structures may occupy the total-field or scattered-field region but may not cross that injection neighborhood. The local normal mesh must remain at the uniform fine spacing. Graded cells are allowed elsewhere, and their artificial reflections remain subject to mesh convergence.

Choose **Sheet source → injection → One-way plane / normal incidence**. This fills the transverse spans and sets the transverse boundaries to Periodic and the propagation axis to PML. Select **propagation axis**, **direction**, polarization and **incident PML layers**. Source previews expose both E/H correction arrays and their application times. Saved JSON, Python export and NPZ preserve these choices.

The source snaps to a normal-axis E node. The paired H correction occupies the adjacent staggered plane. Preview metadata and `summary['oneway_planes']` report both actual coordinates. Sources with theta/phi orientation must remain transverse. General oblique incidence, finite apertures and eigenmode ports remain open. A separate [closed TFSF box](TFSF_SOURCES.md) is available for isolated scatterers. FSP plane-source conversion is not added by this native capability.

## Discrete construction and amplitude

The construction uses the equivalent-current principle described by [Oskooi and Johnson](https://arxiv.org/abs/1301.5366). The implementation and validation code are independently authored.

A scalar 1D Yee line uses the simulation timestep, fine mesh spacing and background permittivity. Its electric soft drive uses the selected Gaussian, continuous, broadband or sampled waveform. A probe eight cells downstream supplies the incident E/H pair. With L incident PML cells at each end, the line has 2L+64 cells. It runs in float64 on the host before GPU capture. Up to eight prepared tables are cached, keyed by the actual drive samples, Courant factor, index and incident PML size.

For +normal propagation, the total-field electric samples begin at index k, and the neighboring H sample k-1 is on the scattered side. After the main E update, the algorithm adds `C / n² * h_incident[k-1]` from the old incident H time. After the main H update, it adds `C * e_incident[k]` from the new incident E time, with the Cartesian cross-product sign. The negative direction mirrors this placement and reverses the magnetic sign. These corrections preserve the discrete temporal and spatial staggering. A continuum impedance ratio alone would not do so for a broadband discrete wave.

Amplitude scales the auxiliary soft drive. It is not a prescribed unit incident E amplitude or an absolute power calibration. The eight-cell propagation delay, frequency response and numerical dispersion are retained, rather than silently subtracted from time or phase. Use a matching reference for spectra and power ratios. On the side toward propagation, fields include incident and scattered waves. On the opposite side, the incident wave is suppressed, leaving scattered fields plus finite injection/PML error. A near-zero empty scattered-side flux is not a valid denominator for transmission normalization.

Finite incident-line PML causes small residual injection error. Increase `incident_pml_cells` from its default 96 toward 192 or higher to check convergence when measuring very weak reflection. The allowed range is 32–512. More layers cost host preparation time. This control is independent of the simulation-region PML.

Automatic termination waits for the declared drive end plus travel time and for the prepared correction tables to fall below the configured source-tail threshold. Delayed sources beyond the current time horizon cannot be declared finished from an all-zero table. This is a stopping heuristic, not an error bound for spectra.

## Evidence and limits

| Check | Recorded result |
|---|---|
| 20 homogeneous float64 cases, 120 steps, 2D/3D active axes, both directions and transverse polarizations | Maximum full E/H relative L2 difference 4.46e-9 against an independent long-line recurrence |
| Same early propagation cases | Maximum electric peak on the scattered side / full-domain peak 1.17e-9 |
| Independent incident-line comparison, 1600 steps, n=1/1.5/3 | At 96 layers, maximum correction relative L2 4.54e-7. At 192 layers, 8.75e-9. These are finite auxiliary-line errors |
| RTX 5880 slab R/T, both directions, 31 wavelengths | Maximum absolute R/T error 0.001536, maximum energy residual 5.09e-6 |
| Scattered-side reflection versus matched-reference field subtraction | Maximum difference 2.91e-6. Empty scattered-side flux / incident flux at most 1.46e-11 |

The early propagation reference has boundaries beyond the finite discrete light cone, constructs the Gaussian independently and calls no native curl, waveform or source-preparation code. Those early tests do not establish a long-time reflection floor. The longer auxiliary-line tests measure finite absorption error separately. The slab error also includes the main Yee discretization, interfaces, monitor interpolation and main PML.

[Source inputs and raw errors](validation/oneway-sources.json), [GPU slab records](validation/oneway-slab.json), [validation program](../benchmarks/oneway_sources.py), [regression tests](../tests/test_oneway_sources.py).

Tests additionally exercise float32/float64 CPU/CUDA agreement, graph/eager equality, independent versus tensor-cohort equality, transverse vectors, graded grids, temporal modes, global settings, delayed-source termination, invalid geometry/material rejection and UI editing with actual GPU execution.
