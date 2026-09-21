# Integrated results

`torchfdtd.results` reads the public outputs of a run and returns one record
type for reflection, transmission and absorption, complex S-parameters with
phase and group delay, mode decomposition, diffraction orders and far-field or
near-zone projections. Every value in a record names its unit and its
calibration ([CONVENTIONS.md](CONVENTIONS.md) section 5: reduced fields and
fluxes, dimensionless ratios to a matched reference run, SI frequencies, times
and lengths), and every entry a normalization cannot support is NaN with a
reason ([NUMERICAL_GUARDS.md](NUMERICAL_GUARDS.md)). Gate task G6-03; tests in
`tests/test_results.py` on the slab flux, straight guide, Y branch, slab guide,
grating and analytic dipole fixtures.

## The record

```python
record = torchfdtd.reflection_transmission(sample, reference, reflection='reflection', transmission='transmission')
record['T']                 # numpy array, NaN where unsupported
record.valid['T']           # boolean mask
record.reasons['T']         # one reason per entry, None where valid
record.units['T']           # 'dimensionless'
record.calibration['T']     # 'dimensionless ratio to the matched reference run'
record.definitions['T']     # how the number was formed
record.notes                # the bookkeeping of the whole record
record.as_dict()            # JSON-ready (complex values as [real, imag])
```

`ResultRecord.add(name, value, units=..., calibration=..., definition=...,
valid=..., reasons=...)` is how the functions below fill a record; a custom
post-processing step can use it for its own quantities.

## Reflection, transmission, absorption

`reflection_transmission(sample, reference, *, reflection, transmission,
direction='+', absorption=None)` takes two `Result` objects (or mappings of
monitor id to `Result.frequency_fields` records) of the same scene with and
without the structure, the ids of the reflection and transmission monitors
(both normal to the incident axis) and the incident direction along that axis.

- `T` is the signed transmitted flux along the incident direction over the
  reference flux through the transmission monitor; `R` is the flux of the
  sample-minus-reference fields through the reflection monitor, taken against
  the incident direction, over the reference flux through it (the
  `normalize_flux` subtraction, which needs the tangential E and H stored on
  both runs).
- `A` is measured only when `absorption` names the faces of a closed box of the
  sample run (`x_min` ... `z_max`, or the four `x`/`y` faces in 2D): the net
  inward flux through the box over the reference transmitted flux. Without a
  box, `A` is NaN with the reason `not measured` and `balance = 1 - R - T` is
  reported as a balance, not as absorption: it also contains the power that
  leaves through channels the two monitors do not see.
- `T_signed` keeps the signed ratio without any threshold; a transmission
  monitor whose net flux runs back toward the source makes `T` NaN with the
  reason `backflow` while `T_signed` shows the negative number. A declared
  direction that contradicts the reference run makes every ratio NaN with the
  reason `reference backflow`.
- The raw fluxes of both runs are in the record in reduced units.

## S-parameters, phase and group delay

`s_parameters(frequency_hz, s, *, channels=None, magnitude_floor=None)` takes
one S matrix per frequency, `(F, n, m)`, one column `(F, n)` or one element
`(F,)`, as `ModeNetwork`, `ModeBranchNetwork` or `modal_s_parameters` return at
each carrier of a wavelength sweep. It returns `S`, `magnitude`, `phase_rad`
(unwrapped along frequency through the supported entries) and `group_delay_s =
+d(arg S)/d(omega)` by central differences (one-sided at the band ends). The
sign follows the `exp(-i omega t)` convention: a delay `tau` carries the phase
`+omega tau` and a straight guide of length `L` has `arg S21 = +beta L`. The
group delay of an FDTD sweep is that of the Yee grid: on the 0.1 um straight
guide of `tests/test_results.py` it equals `2 um * d beta_yee / d omega` with
`beta_yee = (2/h) asin(beta h / 2)` within 3 percent and exceeds the continuum
`d beta / d omega` of the mode solver by 27 percent at eight cells per guided
wavelength. A single carrier gives no group delay (reason `needs at least three
frequencies`), an element at the magnitude floor no phase, and a sweep whose
neighbouring phases differ by π/2 or more no group delay at that point.

## Mode decomposition

`mode_decomposition(plane, launches, *, names=None)` projects a
`DifferentiablePlaneResult` at the carrier of the given `ModalLaunch` objects
with the public `modal_plane_amplitudes`: forward and backward complex
amplitudes referenced to the unit reduced-power mode (units `reduced field *
s`), the plane's signed flux, and `forward_fraction` and `backward_fraction` as
`|amplitude|^2` over the magnitude of the plane flux. The fraction is an overlap
estimate on the sampled mode basis; at coarse meshes it can exceed one by the
discretization error of that basis (1.09 on the 0.1 um slab guide). A plane
without flux supports no fraction; a mode below the rounding floor of the
largest modal power is flagged as weak.

## Diffraction orders

`diffraction_record(plane, reference, orders, *, period_um, refractive_index=1.,
bloch_wavevector_per_um=(0., 0.), direction='forward', subtract_incident=False)`
decomposes the sample plane with `diffraction_orders` and divides each order's
real power by the magnitude of the matched reference plane's flux (the same
plane of the empty run, whose fields `subtract_incident` removes on a
reflection plane). Evanescent orders are NaN with the reason; an order at
grazing cutoff refuses the call; the wavevectors, the reduced order powers and
the reference flux are in the record.

## Far field and near zone

`farfield_record(faces, directions, *, bounds_um, reference=None, **kwargs)`
wraps `project_farfield`: without a reference the intensity is the reduced
spectral power per steradian; with a reference plane it is divided by the
reference flux magnitude under the near-zero guard (`1/sr`). The far-field
electric amplitude is kept in reduced units. `nearzone_record(faces, points_um,
*, bounds_um, **kwargs)` wraps `project_nearzone` and returns the six field
components and the Poynting vector at the points, all reduced.

## What the records do not do

- No absolute calibration: every ratio is to a matched reference run of the
  same mesh, sources, duration and monitors (`run_signature`); reduced fluxes
  are not watts.
- No inference of a direction from the fields: the incident direction is the
  caller's declaration and is checked against the reference run.
- The differentiable paths (`diffraction_efficiency`,
  `normalized_farfield_intensity`, `normalized_mode_power`) are unchanged and
  keep their whole-call refusals; the records are numpy post-processing.
