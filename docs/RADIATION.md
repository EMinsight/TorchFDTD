# Differentiable diffraction and far fields

The Python APIs consume `DifferentiablePlaneResult`, including results from
resident, streamed and dispersive fixed-plane adjoints. They operate on all
six collocated complex E/H components and preserve the field computation
graph. They do not require a commercial runtime.

They are **continuum radiation transforms**, with an isotropic homogeneous
exterior and the native positive-time DFT convention. Diffraction orders
require a real lossless exterior with relative permeability one; the
closed-box and near-zone projections also accept a complex passive exterior.
They do not correct Yee dispersion or interpolation errors. Their frequency,
quadrature, exterior index and projection directions are fixed metadata.
Material/geometry derivatives reach the objective through the FDTD fields.
Differentiation of the exterior index or monitor geometry is not implemented
here.

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
come from `project_nearzone` below. Layered backgrounds and periodic lattice
sums remain unsupported.

## Lossy exterior

```python
far = project_farfield(faces, directions, bounds_um=bounds,
                       refractive_index=1.3 + .05j, relative_permeability=1.1 + .02j)
near = project_nearzone(faces, points, bounds_um=bounds, refractive_index=1.3 + .05j)
```

`refractive_index` and `relative_permeability` are one fixed scalar each, real
or complex. They set `k = k0 n`, the reduced impedance `mu_r / n`, and
`eps_r = n^2 / mu_r`; the far field carries `exp(ikr)/r` with complex `k`, the
H field is `(n / mu_r) s x E`, and `intensity()` is the source-referred
`.5 Re(n / mu_r) |A|^2` without the `exp(-2 Im(k) r)` attenuation. With the
`exp(-i omega t)` phasors a passive exterior needs `Im(n) >= 0`,
`Im(mu_r) >= 0` and `Im(n^2 / mu_r) >= 0`; a negative imaginary part is a
growing exterior and is rejected by name, as are non-positive real parts,
per-frequency arrays and trainable values. Real inputs keep Python floats and
the real lossless path is bitwise unchanged (checked against saved outputs
of the previous revision for FP32/FP64 amplitude, intensity, radius fields,
point fields and near zone). Per-frequency exteriors are not supported: select
one frequency per call. The stored adapter does not take a complex exterior
because the projection medium must equal the real native background.

## Open surfaces (approximation)

```python
single = project_farfield({'z_max': faces['z_max']}, directions, bounds_um=bounds,
                          open_surface=True, edge_window=(.2, .2))
five = project_nearzone({k: v for k, v in faces.items() if k != 'z_min'}, points,
                        bounds_um=bounds, open_surface=True)
assert single.approximation == 'open surface' and single.surfaces == ('z_max',)
```

`open_surface=True` admits one to five of the named box faces; the name fixes
the outward normal, so a single plane is `{'z_max': plane}` radiating toward
+z. The retained faces are integrated with the same equivalence currents and
the omitted faces are assumed to carry negligible fields. This is the
Kirchhoff-type approximation FDTDX makes with a planar detector or
`exclude_surfaces`; it is exact only when the omitted fields vanish. Results
carry `approximation='open surface'` and `surfaces`; the closed box remains
the default and passing all six faces with the flag, or a subset without it,
is rejected. `edge_window=(u, v)` multiplies a single plane's weights by
FDTDX's Gaussian taper over the fractions `u`, `v` of both edges of each
cyclic transverse span (amplitude 5e-4 at the edge) and is rejected for
several faces. It suppresses truncation ringing; it does not recover the
omitted faces and slightly widens the error for a smooth beam.

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

[Twenty-four focused tests](../tests/test_radiation.py) cover Bloch Fourier waves
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

The same dipole in a lossy exterior, `n = 1.3 + .05i` (`Im k = .2/um`) with
`mu_r = 1` and with `mu_r = 1.1 + .02i`, uses the closed forms with complex
`k`. Near-zone relative L2 errors at the five points are 4.1e-3, 1.0e-3 and
2.6e-4 for 14, 28 and 56 samples; far-field amplitude errors are 2.9e-3,
7.2e-4 and 1.8e-4 (both gated at ratios above 3.5 and 5e-4). The radius
fields satisfy `H = (n/mu_r) s x E` to roundoff and the near-zone/far-field
model difference halves from 30 to 60 um (1.25e-2 to 6.3e-3) while both stay
within 1.9e-4 of the analytic fields; FP32 gives 1.0e-3 at 28 samples.

Open surfaces are checked on a fixed 8 x 8 x 6 wavelength box around a
Gaussian-apodized sheet of Huygens pairs radiating toward +z, with 64 samples
per face axis and the far field in the forward 30 degree cone. As the waist
grows from .4 to .6 to .8 wavelengths, the largest field on an omitted face
falls from .23 to .057 to .015 of the top-face field, and the single-plane
error against the closed box falls from 9.6e-2 to 2.4e-2 to 3.8e-3 (near zone
2.2e-2 to 5.6e-3 to 1.0e-3; five faces without `z_min` 6.8e-3 to 1.7e-3 to
3.0e-4; the .2 edge window gives 1.0e-1, 3.0e-2 and 6.2e-3). The gates are
monotone decrease, a first error above 3e-2, a last below 8e-3 (near zone
3e-3) and the windowed error within three times the plain one. A single
dipole, whose fields on every face are comparable, gives a single-plane
error of .79 at both 16 and 32 samples per axis: the approximation does not
converge under face refinement when the omitted fields are not negligible.

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
