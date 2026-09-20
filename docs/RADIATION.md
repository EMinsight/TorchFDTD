# Differentiable diffraction and far fields

The Python APIs consume `DifferentiablePlaneResult`, including results from
resident, streamed and dispersive fixed-plane adjoints. They operate on all
six collocated complex E/H components and preserve the field computation
graph. They do not require a commercial runtime.

They are **continuum radiation transforms**, with a real isotropic homogeneous
exterior, relative permeability one, and the native positive-time DFT
convention. They do not correct Yee dispersion or interpolation errors.
Their frequency, quadrature, exterior index and projection directions are
fixed metadata. Material/geometry derivatives reach the objective through
the FDTD fields. Differentiation of the exterior index or monitor geometry
is not implemented here.

## Periodic diffraction orders

```python
from torchfdtd import diffraction_orders, diffraction_efficiency

# Both results cover the same full periodic cell in homogeneous material.
orders = [(0, 0), (1, 0), (-1, 0)]
result = diffraction_orders(
    transmitted_plane, orders, period_um=(2., 2.),
    refractive_index=1.45, bloch_wavevector_per_um=(0., 0.),
)
efficiency = diffraction_efficiency(
    transmitted_plane, reference_plane, orders, period_um=(2., 2.),
    refractive_index=1.45, direction='forward',
)
loss = -efficiency[:, 0].sum()
loss.backward()
```

Periods and Bloch components follow cyclic transverse order: y,z for an
x-normal plane, z,x for y-normal, and x,y for z-normal. Bloch wavevectors
are radians per micrometre. Order amplitudes use the plane centre as phase
origin and the spatial Fourier mean, not an unnormalized FFT sum.

For tangential electric field `e` and `q = -normal cross H`, the two outgoing
branches are `e_plus/minus = (e +/- Y^-1 q)/2`, where
`Y = (k_normal I + k_transverse k_transverse^T/k_normal)/k0`.
Both E and H are therefore needed to separate overlapping forward/backward
waves. Signed-axis power follows the vector Poynting flux, including oblique
incidence. Evanescent amplitudes are retained and have zero directional real
power. Their interference contribution to total near-field flux is not
represented as independent propagating power.

The quadrature must cover one complete rectangular unit cell with uniform
midpoint samples and SI area weights. Supply `quadrature_counts` when
constructing `DifferentiablePlaneSimulation`. Cropped planes, duplicate points,
incorrect areas and aliased orders are rejected. Grazing cutoff makes E/H
separation singular and is rejected using both an explicit tolerance and a
dtype-dependent roundoff bound. Do not request every order through Nyquist
without checking the physical propagation band.

`diffraction_efficiency` divides directional order power by the absolute net
incident reference-plane flux. It validates matching simulation signature,
frequency, quadrature and normal. The reference should contain incident
power, not a standing wave with nearly cancelling net flux.
`subtract_incident=True` subtracts matched complex incident fields before
decomposition. Sample and reference gradients are retained. Common detached
scales prevent FP32 underflow/overflow at optical DFT and SI-area scales.

## Closed-surface vector far field

```python
from torchfdtd import project_farfield, normalized_farfield_intensity

# A mapping containing x_min/x_max/y_min/y_max/z_min/z_max plane results.
far = project_farfield(
    faces, directions=[[1., 0., 0.], [0., 1., 0.]],
    bounds_um=((-0.6, 0.6),)*3, refractive_index=1.,
)
electric_amplitude = far.electric_amplitude
fields = far.fields_at_radius(0.5)  # leading far-field term at 0.5 metres
objective = normalized_farfield_intensity(
    faces, incident_plane, [[1., 0., 0.]], bounds_um=((-0.6, 0.6),)*3,
)
objective.sum().backward()
```

All six faces must have matching frequencies, source/time/mesh signature and
precision. The API checks the declared closed box, complete midpoint face
quadrature and outward signs. It integrates equivalent currents
`J = outward_normal cross H` and `M = -outward_normal cross E`, with the
outgoing phase `exp(-i k direction dot (point-origin))`.
Direction and point chunks bound temporary projection arrays.

The returned amplitude satisfies
`E(r) = electric_amplitude * exp(i k r)/r` to leading order, with metres for
radius. Its reduced differential power per steradian is
`0.5 * exterior_index * sum(abs(electric_amplitude)**2)`.
`fields_at_radius` evaluates the fixed propagation phase in double precision
before casting to the field dtype. The FDTD and returned fields remain FP32
when FP32 is selected. This avoids large coherent phase errors over millions
of optical radians.

The entire surface must lie in the declared homogeneous material outside
PML, enclosing all radiators of the supplied fields. A surface intersecting
a substrate, a periodic unit cell or an incomplete aperture is outside this
API's physical contract. Those facts cannot be inferred from field arrays.
For isolated scattering, subtract matched incident fields on **every face**.
The output is the asymptotic far field, not a finite-distance near-field
Green-function evaluation. Layered backgrounds and periodic lattice sums
remain unsupported.

## Validation and limits

[Thirteen focused tests](../tests/test_radiation.py) cover Bloch Fourier waves
in all three normals, counterpropagating separation, propagating power sums,
evanescent orders, FP32 cutoff/normalization, complex metadata rejection and
coherent radius phase. A translated vector dipole verifies complex amplitude,
polarization and second-order surface-quadrature convergence. Integrated
far-field power agrees with closed-surface near flux. An actual native FDTD
material VJP agrees with central differences for a far-field objective.

The separate [native FP32 dipole study](validation/radiation_dipole_3060.json)
holds domain, PML thickness and approximate physical duration fixed. Meshes
of 100, 75 and 50 nm give normalized angular-pattern relative L2 errors of
1.0314%, 0.5412% and 0.2304%. This validates one vacuum radiation problem, not
absolute dipole-source power, arbitrary scatterers or every far-field gradient.
The measured times include different one-time preparation costs and are not
a solver speed comparison. Run the study with
`python -m benchmarks.radiation_dipole --output result.json`.

The underlying physical assumptions are also described in the primary
[Meep near-to-far documentation](https://meep.readthedocs.io/en/latest/Python_Tutorials/Near_to_Far_Field_Spectra/)
and [mode-decomposition documentation](https://meep.readthedocs.io/en/latest/Mode_Decomposition/).
No Meep implementation code is used by these transforms.
