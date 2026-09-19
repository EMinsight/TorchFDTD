# Electric and magnetic vector sources

Version 0.12 adds arbitrary linear orientation and magnetic excitation to native point and sheet sources. These are reduced-field soft excitations. Absolute electric/magnetic dipole moment, source power and agreement with a commercial source's amplitude calibration remain unestablished.

## Python and UI

```python
from photonweave import Project, Region, Source, Monitor, Simulation

project = Project(
    region=Region(dimension='3d', size=(4, 4, 4), mesh=0.1,
                  steps=300, backend='cuda', cuda_kernel='fused',
                  material_sampling='yee', pml_cells=5),
    sources=[Source(name='magnetic vector', component='Hz', theta=43, phi=219,
                    wavelength=1.55, pulse_cycles=1)],
    monitors=[Monitor(center=(0.5, 0.4, 0), component='Hy')],
)
result = Simulation(project).run()
result.save('results/magnetic-vector.npz')
```

With `theta=None`, `component` selects Ex/Ey/Ez/Hx/Hy/Hz. With `theta` supplied, the E/H prefix selects the field family and the direction is `(sin(theta) cos(phi), sin(theta) sin(phi), cos(theta))`. Angles are in degrees. Theta runs from +z, from 0 to 180 degrees. Phi turns from +x toward +y. Amplitude multiplies this unit vector. Exact cardinal directions have exact zero components. Intentionally tiny components at other angles are retained. Negative components reverse their field increment. Circular/elliptical excitation can be constructed from separate Cartesian sources with different phases. One theta/phi source has one shared phase and linear orientation.

In source properties, select an E or H **polarization**, or enable **Use theta / phi orientation** and choose **Electric/Magnetic** and the angles. Settings persist in JSON, Python export and NPZ. The preview reports the actual temporal sample times and signed vector weights. Its plot is the common scalar envelope before those weights.

The familiar facade accepts `adddipole(dipole_type='Magnetic dipole', theta=43, phi=219)`. `set('polarization', 'Hx')` returns to Cartesian orientation. Facade geometry is in SI metres. Native `Project` geometry is in micrometres.

## Discrete injection

At completed step `n=1,...`, E is updated and electric increments sampled at `n*dt` are added. H is then updated and magnetic increments sampled at `(n+0.5)*dt` are added. Monitors sample after both operations, retaining their existing magnetic half-step Fourier correction.

Every nonzero vector component uses its own Yee sample coordinates for nearest-site point placement, sheet support and Bloch phase. A requested CAD position is represented with finite-grid staggering. Components are not spatially collocated. Source placement and near-field observables need mesh convergence. Legacy shared-cell sampling remains selectable.

CPU/Torch, CUDA Graph, fused real-field CUDA and tensor cohorts support these sources. Bloch sources use the complex Torch path. Tensor batches require real compatible grids and non-overlapping supports within the same case, field family and component. E and H sources at the same position are allowed. Existing electric-only timing and ordering are preserved.

## FSP scope

The independent converter now retains non-axis-aligned electric theta/phi directions from recognized layout records. The convention follows the [official dipole source description](https://optics.ansys.com/hc/en-us/articles/360034382794-Dipole-source-Simulation-object). Validation uses synthetic records and native calculations. Original bytes remain untouched.

The FSP magnetic-source type code is not mapped because its binary meaning has not been verified. Unsupported source types still block conversion. Native magnetic support does not prove arbitrary FSP compatibility or general native-to-FSP writeback.

## Validation

`benchmarks/vector_sources.py` independently evolves periodic fields in Fourier space with `D- = 1-exp(-iq)` and `D+ = exp(iq)-1`. It constructs the standard Gaussian without the native waveform or curl functions. Electric/magnetic vectors in 2D/3D, float64 and 80 steps have maximum full-field relative L2 difference 2.94e-15. This tests the same discrete equations, not continuum radiation-power or convergence. [Inputs and raw errors](validation/vector-sources.json).

Regression tests cover linear superposition, cardinal and weak components, preview times, serialization, CPU/CUDA in both precisions, graph/eager/fused execution, graded CPML/periodic cases, tensor independence, complex Bloch magnetic sheets, plane DFT and synthetic FSP conversion. A browser test edits a magnetic vector, previews its half-step samples and executes it on RTX 5880.

```sh
python -m benchmarks.vector_sources
python -m pytest tests/test_vector_sources.py tests/test_fsp_native.py
```
