# Transmission-rescaled electric-intensity allocation

The inspected active CR reference distributes total transmission among four
wells using detector-plane electric intensity. It does not integrate local
Poynting flux independently in each well. TorchFDTD now provides this
differentiable allocation separately from its physical power monitor.

For quadrature point weights w and electric components E, the well integrals
are Q[j] = sum(points in j) w * (abs(Ex)^2 + abs(Ey)^2 + abs(Ez)^2).
The returned response is T * Q[j] / sum(Q), with frequency as the first axis
and R, G2, G1, B as the second. R is low-x/low-y, G2 high-x/low-y,
G1 low-x/high-y and B high-x/high-y. Split coordinates are explicit physical
coordinates. An origin translation must also translate the split.

```python
from torchfdtd import DifferentiablePlaneSimulation, quadrant_intensity_allocation

# project contains a z-normal monitor named detector, spanning the periodic cell.
model = DifferentiablePlaneSimulation(
    project, quadrature_counts={"detector": (24, 24)}
)
sample = model(epsilon, frequencies)["detector"]
# reference must use the same source, grid, duration and detector sampling.
transmission = sample.normalized_flux(reference)
response = quadrant_intensity_allocation(sample, transmission, split_um=(0., 0.))
loss = objective(response)
loss.backward()
```

Explicit quadrature counts use endpoint-free, uniformly spaced midpoints
independent of the field mesh. The two counts follow increasing transverse
axis order, x/y for a z-normal monitor. They override monitor downsampling for
that plane only. The underlying staggered fields are still interpolated from
the Yee mesh, including complex Bloch seams. Fixed quadrature does not improve
an under-resolved mesh. Counts currently apply to the Python differentiable
plane API, not the UI/native forward monitor configuration.

Coordinates, weights and split locations are fixed. Both electric fields and
the supplied total transmission differentiate. The function rejects missing
quadrants, zero/nonfinite integrated intensity and negative transmission without
clipping. Transmission above one is not silently clipped. The four entries sum
to the supplied transmission. They are not collected electrons or absorption.
For an incoherent pupil, compute and rescale each ray/polarization separately,
then average responses with the specified weights. Averaging fields or
rescaling an averaged intensity would change the model.

The original reference obtains T from power-normalized RCWA S parameters.
FDTD obtains T from a separately validated, matched-reference power flux.
These are comparable only after illumination and numerical convergence are
established. This API does not establish that equivalence for CR structures.
In particular, the reference detector z offset is relative to the output layer
and must be mapped to the FDTD coordinate origin explicitly.

## Validation scope

Ten synthetic complex-field cases (five CPU, five CUDA) match the active
reference's quadrant integrals after normalization. Maximum output difference
was 8.33e-17 and maximum gradient relative L2 difference was 6.33e-16.
The [parity record](validation/detector-allocation-parity.json) identifies the
reference source hash. No original design mask, image prior or commercial data
was used. The local read-only audit executes only the active quadrant mask and
field-integral functions on generated tensors.

Tests separately check complex field/total-transmission gradcheck, origin
translation, well order, total conservation, midpoint axes, and a 3D FDTD
material-to-allocation directional derivative on CPU/CUDA with and without
Bloch phase. That derivative test uses synthetic total transmission to isolate
the joint chain rule, not a physical CR measurement. Matched oblique sources,
the full optical response and locked electron calibration remain pending.
