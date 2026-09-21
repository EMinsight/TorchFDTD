# Numerical guards of the normalization paths

Every path that divides a measured quantity by a reference, extracts a phase or
differentiates one along frequency refuses what it cannot support, or returns
NaN with a reason, instead of clipping, adding an epsilon or taking an absolute
value. The thresholds are declared here, tied to the precision where a
rounding floor applies, and each guard has a test that injects the situation and
asserts the reason (gate task G6-08). The public entry point of the guards is
`torchfdtd.results.guarded_ratio`; the record type that carries the reasons is
`torchfdtd.results.ResultRecord` (`valid` masks and `reasons` per entry,
[RESULTS.md](RESULTS.md)).

## Declared thresholds

| Name | Value | Where |
| --- | --- | --- |
| `REFERENCE_FRACTION` | 0.01 of the largest \|reference\| over the band | `torchfdtd.results`, the default of `normalize_flux`, `diffraction_efficiency` and `normalized_farfield_intensity` |
| rounding floor | `32 * eps(dtype)` times the largest magnitude: 3.8e-6 (float32, complex64), 7.1e-15 (float64, complex128) | `torchfdtd.results.rounding_floor`; a reference or a mode amplitude below it is rounding noise |
| phase magnitude floor | the rounding floor of the S dtype times the largest \|S\| (overridable per call) | `s_parameters(magnitude_floor=...)` |
| resolved phase step | \|Δ arg S\| < π/2 between neighbouring frequencies after unwrapping | `s_parameters` group delay |
| grazing cutoff | \|k_normal²\| ≤ max(1e-5², 32 eps) k² | `diffraction_orders(cutoff_tolerance=1e-5)` |

## Paths, guards and tests

| Path | Situation | Guard | Threshold | Test |
| --- | --- | --- | --- | --- |
| `results.guarded_ratio` (shared by every record below) | non-finite numerator or reference | NaN, reason `non-finite flux` | none | `tests/test_numerical_guards.py::test_guarded_ratio_names_every_refusal_and_never_clips` |
| | reference exactly zero at an entry | NaN, reason `reference is zero`; zero everywhere: `reference is zero at every frequency` | exact zero | same |
| | reference weak at an entry | NaN, reason `reference below 0.01 of its band peak (or its rounding floor)` | `REFERENCE_FRACTION`, rounding floor of the reference dtype | same |
| | reference flowing against its dominant direction (or the declared `reference_sign`) | NaN, reason `reference backflow` | sign only | same |
| | numerator against the declared `expected_sign` | NaN, reason `backflow: net flux against the propagation direction`; the signed value stays available | sign only | same |
| `field_monitors.normalize_flux` (R/T against a reference; workbench `Plot flux` with a reference run) | zero or weak reference | NaN with `valid` False and `reasons` naming the entry; the ratio keeps the sample's sign over the reference magnitude | `min_reference_fraction` = 0.01 | `tests/test_numerical_guards.py::test_normalize_flux_reports_the_reason_of_every_nan` |
| `results.reflection_transmission` (R, T, A, balance) | zero or weak reference flux, reference against the declared incident direction, transmitted or reflected flux running back toward the source | NaN with the `guarded_ratio` reason; `T_signed` keeps the signed ratio; `balance` is NaN where R or T is | as above | `tests/test_numerical_guards.py::test_reflection_transmission_zero_reference_and_backflow_injections`, `tests/test_results.py::test_wrong_incident_direction_and_reversed_flux_are_backflow_not_a_sign_fix` |
| | no absorption monitor or closed box | `A` NaN with reason `not measured`; `balance = 1 - R - T` is labelled a balance, not absorption | none | `tests/test_results.py::test_slab_reflection_transmission_against_the_reference_run` |
| | closed box whose net flux leaves the box | `A` NaN with reason `negative absorbed power` | sign only | (guard of `guarded_ratio` with `expected_sign=1`; the lossy slab of `tests/test_results.py::test_absorption_is_measured_from_a_closed_box_and_agrees_with_the_balance` measures a positive A) |
| `results.s_parameters` (phase extraction) | \|S\| at or below the magnitude floor | `phase_rad` NaN, reason `\|S\| at or below the magnitude floor ...: phase undefined` | phase magnitude floor | `tests/test_numerical_guards.py::test_s_parameter_phase_floor_aliasing_and_frequency_count` |
| `results.s_parameters` (group delay) | fewer than three frequencies | `group_delay_s` NaN, reason `group delay needs at least three frequencies` | 3 | same, `tests/test_results.py::test_y_branch_single_carrier_s_record` |
| | phase step to a neighbour of π/2 or more | NaN, reason `phase step of pi/2 or more ...: unresolved (possibly aliased) phase` | π/2 | same |
| | frequencies not strictly increasing, non-finite S, shape mismatch | `ValueError` | none | same |
| `mode_injection.modal_s_parameters` | reference with no supported mode in the launch direction, zero or non-finite reference | `ValueError` (`Reference has no supported mode`, `Modal reference is zero or nonfinite`) | 1e-6 of the modal support | `tests/test_numerical_guards.py::test_mode_decomposition_of_a_plane_without_signal_and_the_modal_reference_refusal` |
| `mode_network.ModeNetwork`, `mode_branches.ModeBranchNetwork` calibration | port modes not power orthogonal | `ValueError` | `gram_tolerance` | `tests/test_mode_network.py::test_two_mode_directional_power_normalization_and_gram_rejection` |
| | calibration incident channel unsupported or several incident channels excited | `ValueError` (`Calibration incident channel is unsupported`, `Calibration excites multiple incident channels`) | 1e-6 of the largest amplitude; 1e-3 of the incident amplitude | declared in the code; no injection test yet |
| `results.mode_decomposition` | plane flux zero or below the rounding floor | fractions NaN, reason `reference is zero ...` or `reference below ...` | rounding floor of the plane dtype | `tests/test_numerical_guards.py::test_mode_decomposition_of_a_plane_without_signal_and_the_modal_reference_refusal` |
| | mode amplitude at or below the rounding floor of the largest modal power | fraction NaN, reason `weak mode` | rounding floor | (declared; the slab guide of `tests/test_results.py::test_slab_guide_mode_decomposition_on_the_far_plane` exercises the valid branch) |
| `radiation.diffraction_orders` | order at grazing cutoff | `ValueError` `A requested diffraction order is at grazing cutoff.` | `cutoff_tolerance` | `tests/test_numerical_guards.py::test_diffraction_order_at_cutoff_is_refused_and_evanescent_orders_are_flagged`, `tests/test_radiation.py::test_evanescent_amplitudes_zero_power_and_cutoff_rejection` |
| `results.diffraction_record` | evanescent order | efficiency NaN, reason `evanescent order: k_normal^2 < 0, no real power`; the real power is zero by definition and the amplitude stays in `diffraction_orders` | `propagating` mask | same, `tests/test_results.py::test_grating_diffraction_record_flags_evanescent_orders_and_balances` |
| | reference plane zero or non-finite | `ValueError` | exact zero | same |
| | reference weak at a frequency | efficiency NaN at that frequency with the `guarded_ratio` reason | `REFERENCE_FRACTION` | same |
| `radiation.diffraction_efficiency`, `radiation.normalized_farfield_intensity` | reference zero or weak in the requested band | `ValueError` `Reference power is zero or too weak ...` (whole call; the differentiable path keeps no per-frequency mask) | `min_reference_fraction` = 0.01 | `tests/test_numerical_guards.py::test_differentiable_efficiencies_refuse_a_weak_reference_band` |
| `results.farfield_record` with a reference | reference zero or non-finite | `ValueError` | exact zero | `tests/test_numerical_guards.py::test_farfield_weak_reference_frequency_is_flagged_and_zero_reference_refused` |
| | reference weak at a frequency | intensity NaN at that frequency with the reason | `REFERENCE_FRACTION` | same |
| `detector_allocation.quadrant_intensity_allocation` (allocation ratios) | zero, negative or non-finite integrated intensity, zero area, negative transmission | `ValueError` before any division; no epsilon in a denominator (G1-03) | exact | `tests/test_numerical_guards.py::test_allocation_ratio_refuses_zero_intensity_instead_of_dividing`, `tests/test_detector_allocation.py::test_invalid_contract` |
| `source_preview.preview_source` (incidence angle) | k_parallel above n k0 at a band edge | angle `None` with reason `evanescent, no propagation angle` | sign of k² - k_parallel² | `tests/test_source_preview.py::test_evanescent_band_edge_is_named_not_clipped` |
| | zero injected samples | bandwidth `None` with the reason | exact zero spectrum | `tests/test_source_preview.py::test_effective_bandwidth_matches_the_gaussian_spectrum_and_names_a_zero_spectrum` |

## What is not a guard

- `normalize_flux`, `diffraction_efficiency`, `normalized_farfield_intensity`
  and `modal_s_parameters` divide by the magnitude of the reference on purpose:
  the reference run defines the incident direction and the sample keeps its
  sign, so a reflected wave on an `x`-normal monitor has a negative ratio
  ([CONVENTIONS.md](CONVENTIONS.md) section 4). `guarded_ratio` uses the
  magnitude only after the reference's sign was checked against its dominant
  direction or the declared one.
- The zero real power of an evanescent order in `diffraction_orders` is the
  physics of the order, not a clip; the results record refuses to call it an
  efficiency.
- Detached scaling of fields and areas before a ratio (`normalized_flux`,
  `quadrant_intensity_allocation`, `_decompose`) keeps float32 in range and
  cancels from the ratio; it changes no value and hides no zero.
