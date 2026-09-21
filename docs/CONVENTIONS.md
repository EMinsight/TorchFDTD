# Conventions

The sign, timing and unit conventions every public path of TorchFDTD shares.
Each statement below is fixed by a test in `tests/test_conventions.py` that
computes the quantity on a tiny problem against the stated formula; the
table at the end maps statements to tests. The resolved plan
(`torchfdtd.plan.resolve_plan`) carries the constants named here
(`SAMPLE_TIME_STEPS`, `FOURIER_CONVENTION`) and the realized quantities they
apply to, so a change of convention is a change of plan hash.

## 1. Fourier transforms

**Native transforms use the positive sign with `dt` normalization.** Point
monitors with explicit samples (`sampling` frequency, wavelength, chebyshev or
custom), native frequency planes and the differentiable planes
(`DifferentiablePlaneSimulation` and its dispersive, streamed, modal and
reversible variants) evaluate

```
X(f) = dt * sum_n x(t_n) w(t_n) exp(+2 pi i f t_n)
```

with `w` the apodization window and `t_n` the sample times of section 2. The
result has units of reduced field times seconds (`'reduced field * s'`). A
complex exponential `exp(-2 pi i f0 t)` transforms to `N dt` at `+f0`; a real
`sin(2 pi f0 t)` carries phase `+pi/2`. The radiation transforms consume
these positive-sign plane phasors.

**The legacy FFT point path uses the negative sign.** `sampling='fft'`
returns `FFT exp(-2 pi i f t)`, scaled by `2/N` for a real trace and `1/N`
for a complex trace, with the phase referenced to `t = 0` and no window-gain
correction; its units are `'reduced field'` and the same `sin` carries phase
`-pi/2`.

**The differentiable point-signal spectrum uses the negative sign.**
`DifferentiableResult.spectrum` and `DifferentiableSpectrum` evaluate
`dt * sum_n x(t_n) exp(-2 pi i f t_n)`; the plane wrappers conjugate this
kernel to return the native positive-sign planes.

**Phasors.** The positive transform pairs with `exp(-i omega t)` time
dependence: a passive material has `Im(epsilon) >= 0` (the ADE oscillators
`A / (w0^2 - w^2 - i gamma w)`), and an outgoing wave in the radiation
transforms carries `exp(+i k r)` (section 6).

## 2. E/H half step and sample times

Time step `n` (`n = 0 ... N-1`) updates E and then H. After step `n`, E is
tagged at `t = (n+1) dt` and H at `t = (n+1.5) dt`:

| Quantity | Sample time |
| --- | --- |
| `Result.times`, E point traces, E plane samples | `(n+1) dt` |
| H point traces (spectra and time views), H plane samples | `(n+1.5) dt` (`times + dt/2`, plane factor `exp(+i pi f dt)`) |
| E-component source terms (soft, one-way E table, TFSF drive) | injected after the E update, sampled at `(n+1) dt` |
| H-component source terms (soft, one-way H table) | injected after the H update, sampled at `(n+1.5) dt` (`Source.time_offset_steps = 0.5`) |

`torchfdtd.plan.SAMPLE_TIME_STEPS == {'E': 1.0, 'H': 1.5}` and every source
term of a plan records its sample times. The native frequency planes and the
differentiable planes reproduce, to round-off, a full-state reference that
applies these tags explicitly.

## 3. Bloch spatial phase

A Bloch axis with phase `phi` (radians per positive unit-cell translation)
enforces

```
F(r + L e_axis) = exp(+i phi) F(r)
```

- The curl seam uses the ghost value `exp(+i phi) F[0]` beyond the last cell
  and `exp(-i phi) F[n-1]` before the first.
- A soft sheet source of a Bloch run is multiplied by the profile
  `exp(+i phi (x - x_0) / L)` about its center.
- Monitor interpolation above the last sample wraps to the first sample with
  weight `q exp(+i phi)`, and below the first sample with `exp(-i phi)`.

## 4. Monitor normal and outward flux

`FieldMonitor.normal` names an axis, not an orientation. The recorded flux is

```
flux = sum_points weight * 0.5 Re(E x H*) . e_normal
```

positive when power flows toward the positive axis and negative when it flows
toward the negative axis. `record_poynting` stores the same density
`0.5 Re(E x H*)` along `+x`, `+y` and `+z`. A closed radiation box fixes each
face's outward normal by its name (`x_min` faces `-x`, `x_max` faces `+x`)
and integrates `J = n_out x H`, `M = -n_out x E`.

## 5. Reduced units versus SI calibration

Calibrated in SI:

- geometry, mesh nodes, Yee sample positions and monitor spans in
  micrometres, converted to metres where a physical quantity needs them;
- time in seconds, from the SI speed of light: `dt = courant_factor /
  sqrt(dimension) * mesh_um * 1e-6 / c` on a uniform mesh;
- frequencies in hertz and material rates in radians per second, so the ADE
  coefficient `0.5 (w0 dt)^2` is dimensionless and `permittivity(material,
  f)` is the relative permittivity;
- plane quadrature weights: SI areas (`m^2`) in 3D, transverse widths (`m`
  per unit invariant length) in 2D.

Reduced, not calibrated:

- E and H amplitudes: the solver's reduced fields with `eta_0 = 1`, so a
  vacuum plane wave has `|H| = |E|`; they are not V/m or A/m;
- source amplitudes: injected field increments, not dipole moments or
  incident powers;
- flux: `reduced E*H * s^2 * m^2` (3D) or `reduced E*H * s^2 * m per
  invariant length` (2D); only ratios to a matched reference
  (`normalize_flux`, `normalized_flux`) are dimensionless power fractions.

Every result states this: `summary['units']`, `field_units`, `flux_units`
and the point spectra `units`.

## 6. Lossy exterior of the radiation transforms

The far-field and near-zone projections take a fixed exterior
`refractive_index n` and `relative_permeability mu_r`, real or complex, with
`k = k0 n`. Under the `exp(-i omega t)` phasors of section 1 a passive
exterior needs `Im(n) >= 0`, `Im(mu_r) >= 0` and `Im(n^2 / mu_r) >= 0`, so
the outgoing factor `exp(+i k r) / r` decays: the field at radius `r2` is
`(r1 / r2) exp(-Im(k) (r2 - r1))` times the field at `r1`. A negative
imaginary part is a growing exterior and is rejected by name. Diffraction
orders require a real lossless exterior.

## 7. Two-dimensional power per unit length

A 2D simulation is invariant along `z`. Its plane monitors have one
quadrature row along `z` with unit weight, so the quadrature weights are
transverse widths in metres and the flux is power per unit invariant length:
a `y`-uniform wave through a monitor of width `2w` carries twice the flux of a
monitor of width `w`, and for a vacuum plane wave
`flux = 0.5 sum |E|^2 * width` in reduced units (`|H| = |E|`).

## Statements and their tests

| Statement | Test in `tests/test_conventions.py` |
| --- | --- |
| Positive DFT sign, `dt` normalization, `sin` phase `+pi/2`; legacy FFT negative sign, `2/N`, phase `-pi/2` | `test_native_point_and_plane_dft_use_the_positive_sign_with_dt_normalization` |
| Differentiable point spectrum negative sign, H at `t + dt/2` | `test_differentiable_point_spectrum_uses_the_negative_sign_and_the_half_step_for_h` |
| Native and differentiable planes equal the explicit formula with E at `(n+1) dt`, H at `(n+1.5) dt` | `test_native_and_differentiable_planes_match_the_documented_dft_and_sample_times` |
| Bloch seam, sheet profile and interpolation wrap with `exp(+i phi)` | `test_bloch_field_is_multiplied_by_exp_plus_i_phase_per_positive_period` |
| `Result.times`, H spectra at `times + dt/2`, source sample times | `test_e_is_tagged_at_n_plus_one_dt_and_h_half_a_step_later` |
| Flux density `0.5 Re(E x H*)` along `+normal`, Poynting components along `+x`, `+y`, `+z`, sign reversal, unit strings | `test_flux_density_is_half_re_e_cross_h_conjugate_along_the_positive_normal` |
| 2D weights in metres, flux per unit length, `|H| = |E|`, sheet power, sign of a reversed wave | `test_two_dimensional_flux_is_signed_power_per_unit_length_with_unit_reduced_impedance` |
| SI `dt`, `m^2` weights in 3D, SI material rates and relative permittivity, dimensionless ADE coefficient, reduced unit strings | `test_reduced_units_and_si_calibration` |
| Passive exterior `Im(n) >= 0`, growing exterior rejected, `exp(+i k r) / r` decay | `test_lossy_exterior_uses_exp_minus_i_omega_t_phasors_with_decaying_exp_ikr` |
| Diffraction orders reject a complex exterior | `tests/test_radiation.py::test_growing_or_per_frequency_exterior_is_rejected` |
| Closed-box outward normals and equivalent currents | `tests/test_radiation.py::test_closed_surface_dipole_complex_amplitude_converges_and_translation_phase` |
