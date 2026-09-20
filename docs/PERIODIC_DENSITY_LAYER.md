# Periodic density layers and selected-ray validation

`periodic_density_layer` maps an x-by-y density array into a finite extruded
layer in a uniform 3D Yee grid. Pixels are piecewise constant over the complete
centered periodic cell. Each electric component receives the arithmetic
permittivity average over a cell-sized box centered at its own Yee location.
Overlap weights wrap at x/y seams. The resulting tensor has shape
`region.shape + (3,)` and differentiates with respect to density.

```python
epsilon = periodic_density_layer(
    density, region, bottom_um=-0.375, top_um=0.375,
    background_epsilon=n_background**2, design_epsilon=n_pattern**2,
)
planes = model(epsilon, [frequency_hz])
loss = objective(planes)
loss.backward()
```

The layer interfaces and material values are fixed. A selected-frequency
experiment supplies n at that frequency. This does not implement broadband
material dispersion or a conformal interface method. Arithmetic averaging can
alter a coarse optical response, so density-transfer conservation alone cannot
establish physical accuracy. Tests check volume preservation for each electric
component, periodic translations, CPU/CUDA density derivatives and a full
FDTD material-to-observation directional derivative.

`benchmarks.periodic_layer_case` consumes an explicit specification and density
file, verifies the density SHA-256, builds two calibrated complex source bases,
and returns x/y and unpolarized quadrant allocation. The detector coordinate is
the layer's output face plus its supplied offset. It uses a 24-by-24 midpoint
quadrature independent of mesh. The specification supplies wavelength, indices,
period, height, detector offset and refracted direction. No implicit material
table, pupil generation or original research mask is embedded in the package.

```console
python -m benchmarks.periodic_layer_case --spec case.json --density density.npy --output results/case.json --mesh .05 --steps 1600
```

The specification keys are `density_sha256`, `wavelength_um`,
`background_index`, `design_index`, `period_um`, `height_um`,
`detector_offset_um`, `theta_inside_rad` and `phi_rad`. The current runner
uses CUDA FP32, positive-z propagation and an identical homogeneous background
on both sides. It runs forward validation only. The density-transfer API itself
supports the existing discrete-adjoint path.

## Dense observation bottleneck

The first selected-ray run exposed per-point Python indexing in the resident
observer and explicit transpose. These now use prepared E/H index arrays and
batched gather/scatter. Repeated observations still accumulate their adjoints.
Resident and streamed host memory reservations include index storage.

An observation-only benchmark on RTX 3060, using 10,000 interleaved complex E/H
samples including duplicates, measured medians of 51.064 ms for scalar Python
indexing and 0.232 ms for batched gathering. Values matched exactly. This is not
a whole-solver speed ratio. The first unoptimized optical run was deliberately
stopped after its first reference solve, then restarted with the verified
observer change. It supplies no completed baseline timing.
