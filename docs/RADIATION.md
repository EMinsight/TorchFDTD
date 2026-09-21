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
`fields_at_radius` accepts one scalar radius or one fixed radius per direction
and evaluates the propagation phase in double precision before casting to the
field dtype. The FDTD and returned fields remain FP32 when FP32 is selected.
This avoids large coherent phase errors over millions of optical radians.

The entire surface must lie in the declared homogeneous material outside
PML, enclosing all radiators of the supplied fields. A surface intersecting
a substrate, a periodic unit cell or an incomplete aperture is outside this
API's physical contract. Those facts cannot be inferred from field arrays.
For isolated scattering, subtract matched incident fields on **every face**.
`project_farfield` returns the asymptotic far field; finite-distance fields
come from `project_nearzone` below. Layered backgrounds, lossy or magnetic
exteriors, single open planes and periodic lattice sums remain unsupported.

## Finite-distance near zone and observation grids

```python
from torchfdtd import (project_nearzone, farfield_at_points, spherical_directions,
                       spherical_points, cartesian_plane_points)

theta, phi = torch.linspace(0, math.pi, 19), torch.linspace(0, 2*math.pi, 36)[:-1]
far = project_farfield(faces, spherical_directions(theta, phi), bounds_um=bounds)
near = project_nearzone(faces, spherical_points(theta, phi, 5.), bounds_um=bounds)
plane = project_nearzone(faces, cartesian_plane_points('z', 3., x_um, y_um), bounds_um=bounds)
remote = farfield_at_points(faces, spherical_points(theta, phi, 2000.), bounds_um=bounds)
objective = near.poynting()[..., 2].sum()      # .5 Re(E x H*), reduced E*H * s^2
objective.backward()
```

`spherical_directions(theta, phi)` returns unit vectors on the tensor-product
grid with theta from +z, phi from +x toward +y and theta varying slowest, the
same ordering the browser uses. `spherical_points` places that grid at one
radius around an origin and `cartesian_plane_points(normal, offset, u, v)`
builds a plane grid with the cyclic transverse axes of the plane APIs. All
three return fixed float64 micrometre coordinates; any fixed finite `(P, 3)`
array is accepted as well.

`project_nearzone` evaluates the exact free-space Green function
`g = exp(ikR)/(4 pi R)` of the same equivalent currents. With `A = int J g dS`
and `F = int M g dS` in reduced units (`mu_r = 1`, `eta_0 = 1`),
`E = i k0 [A + grad div A / k^2] - curl F` and
`H = i k0 n^2 [F + grad div F / k^2] + curl A`, where the derivatives act on
`g` and keep its `1/R`, `1/R^2` and `1/R^3` terms. The result is `(F, P, 6)`
E/H in the plane field units, with a radial electric component. `R`, the
Green function and its derivatives are computed in double precision and cast
to the field dtype, so millimetre radii keep a coherent phase in FP32.
Observation points must lie strictly outside the box: inside a closed
surface the same integral returns the negative field of exterior sources,
not the interior field. `farfield_at_points` evaluates the far-field model at
the same kind of points, using each point's own direction and radius from the
phase origin. Cost is `faces x face samples x points`; `observation_chunk`
and `point_chunk` bound the `(F, chunk, chunk, 3)` temporaries.

Both models are linear in the plane fields, so an objective built from
`NearZoneResult.fields`, `poynting()`, `FarFieldResult.intensity()` or
`fields_at_radius` differentiates back into the stored plane spectra and,
through the plane adjoint, into material parameters.

## Validation and limits

[Twenty focused tests](../tests/test_radiation.py) cover Bloch Fourier waves
in all three normals, counterpropagating separation, propagating power sums,
evanescent orders, FP32 cutoff/normalization, complex metadata rejection and
coherent radius phase. A translated vector dipole verifies complex amplitude,
polarization and second-order surface-quadrature convergence. Integrated
far-field power agrees with closed-surface near flux. An actual native FDTD
material VJP agrees with central differences (relative tolerance 2e-6) for a
two-component objective: far-field intensity in two directions and near-zone
Poynting flux at two points outside a 5 x 5 sample box.

The same analytic dipole (all `1/r`, `1/r^2`, `1/r^3` terms) checks the near
zone at five points 0.55 to 1.35 um outside the 1.3 x 1.4 x 1.2 um box.
Relative L2 errors of E and H together are 4.6e-3, 1.1e-3 and 2.8e-4 for
14, 28 and 56 samples per face axis: second order in the midpoint spacing,
gated at ratios above 3.5 and a 5e-4 ceiling. The tolerance follows from the
mesh: the midpoint rule is second order in `h` relative to both the wavelength
(`k h = 0.12` at 56 samples) and the distance to the nearest face. A point
only 0.05 um from a face gave 9.1e-5 at 56 samples (`h = 0.023 um`), 3.5e-2
at 28 (`h = 0.046 um`) and 0.33 at 14 (`h = 0.093 um`), so a near-face point
needs the face spacing at least about twice smaller than its face distance.
The largest radial electric fraction at those points is 0.48. FP32 faces give
the same 1.1e-3 at 28 samples, gated at 2e-3. On a sphere of 5 x 6 points the near-zone
and far-field models differ by 1.9e-3 at 200 um and 1.9e-4 at 2000 um, the
`1/r` decay of the omitted `k a^2/(2 r)` phase and `1/(k r)` terms, while the
near zone stays at its 8.5e-4 quadrature floor for 28 samples; the gate is a
ratio above 8 and 4e-4 at 2000 um. Observation helpers are checked against
an independent NumPy grid, `farfield_at_points` equals the per-direction
radius form exactly, and inside-box points, complex or trainable coordinates,
bad chunk sizes and out-of-range angles are rejected. A CUDA variant compares
FP32 near-zone and per-point far fields with the CPU result and skips without
a GPU.

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
