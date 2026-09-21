# Oracle independence and error budgets of the G3 fixtures

Bookkeeping for stage G3 of [COMPLETION_PROGRAM_KO.md](COMPLETION_PROGRAM_KO.md)
section 5. For every fixture that a G3 case file under
`docs/validation/cases/` names, this document records what the oracle is, how
independent it is of the code under test, the precision floor of the
comparison, and the time-window and PML budgets as they were recorded. It
does not restate the acceptance limits; those live in the case files, and
`tests/test_oracle_budget.py` checks that every G3 case names its oracle
classes and that this document covers every case.

## Oracle classes and validation layers

Section 1 rule 8 of the program separates an analytic oracle, an independent
implementation, another backend of the same discrete equations, and a rerun of
the same code. The case files use these class names:

| Class | Meaning | Layer |
| --- | --- | --- |
| `analytic_continuum` | Closed-form solution of the continuous problem (Fresnel, Airy, Mie, slab or fiber dispersion, Hertzian dipole, transfer matrix) | B |
| `analytic_discrete` | Closed-form solution of the Yee discretisation itself (discrete dispersion, discrete eigenfrequency, discrete interface algebra). It verifies that the implemented operator is the intended one; it closes to the continuum only when the case also compares against `analytic_continuum` or states the analytic numerical dispersion | B |
| `independent_solver` | A separately written solver of the same continuum physics by another method (none is used by the fixtures recorded here) | B |
| `physical_invariant` | A theorem that a correct solution must satisfy: reciprocity, passivity, Poynting flux balance through a closed surface, energy conservation | B |
| `convergence_study` | Refinement of mesh, time window or PML of the same solver at fixed physical geometry, with the continuum limit or a stored fine reference as oracle | B |
| `stored_record` | A benchmark record under `docs/validation/` whose numbers a test checks without recomputing; the record's own oracle class is stated next to it | either |
| `independent_implementation_same_scheme` | A second, separately coded implementation of the same discrete scheme (exact-endpoint engine, NumPy YeeGrid, dense one-step matrix). Independent code, not independent physics | A |
| `shared_discrete_operator` | The same discrete operator on another device, kernel or execution mode, or an explicit adjoint against autograd of the same discretisation | A |
| `finite_difference_same_discretisation` | Central differences, Taylor remainders or `gradcheck` of the same discretisation | A |

Layer A is discrete-operator agreement; layer B is accuracy of the continuous
problem. A case whose only classes are layer A cannot verify physics, which is
what G3-14 and G3-15 record by definition.

## Fixture table

Precision floor: the level at which the comparison is limited by round-off or
by the estimator, as asserted or measured. Time window and PML: what the
fixture fixes, and whether a control run was made. Numbers are the recorded
values of the pilot runs at commit 2b64f91 or of the stored records; none is
an acceptance limit.

### G3-06 `G3-06_pec_pmc_cavity`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| PEC cube resonance, `tests/test_cavity_resonance.py` | Discrete and continuum TM110 eigenfrequency (`analytic_discrete`, `analytic_continuum`) | Closed forms derived from the Yee stencil and from Maxwell, no shared code | Estimator floor declared 1e-3 relative; measured 3e-6 to 7e-6; numerical dispersion 0.225 percent (n = 1) and 0.457 percent (n = 1.5) reproduced | 4000 steps, 763 fs; source interval of 600 steps excluded; no window sweep | none |
| Seeded eigenmode marching, `tests/test_pec_boundaries.py`, `tests/test_pmc_general.py`, `tests/test_pmc_reference.py` | Discrete Yee dispersion (`analytic_discrete`) | Closed form | float32 round-off 2e-6 to 4e-6 after 24 to 35 steps | 24 to 35 steps | none |
| Mirrored half versus full domain, `tests/test_pmc_general.py`, `tests/test_pmc_dispersive.py` | Full-domain autograd folded onto the half domain (`shared_discrete_operator`) | Same operator | float32 4e-6 absolute on signals, 2e-6 of the gradient maximum | 16 steps | 3 to 4 CPML layers on the non-mirrored axis; not mirrored because uniform PML profiles are half-cell offset |
| Exact-endpoint engine, `tests/test_pmc_general.py` | Sparse-incidence PEC/PMC engine (`independent_implementation_same_scheme`) | Separate code, same scheme | float32 rtol 3e-5, atol 2e-6 | 40 steps | none |

Open residual: the folded gradient of the reduced domain is checked against the
same discretisation only; no continuum derivative exists for this fixture.

### G3-09 `G3-09_mode_solver_oracles`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Periodic slab TE0/TM0, `tests/test_mode_ports.py` | Analytic slab dispersion by root finding (`analytic_continuum`) | Independent closed form | float64 eigenpair residual below 1e-4, Maxwell residual below 2e-5; neff absolute error below 5e-4 at h = 0.025 um | frequency domain | periodic box 2, 4, 6 um; box sensitivity below 2e-6 between 4 and 6 um |
| Open slab, `tests/test_open_mode_ports.py` | `benchmarks/open_mode_oracles.py` `solve_slab` (`analytic_continuum`) | Independent closed form, itself checked by `tests/test_open_mode_oracles.py` | float32 Maxwell residual below 2e-4, collar energy below 1e-4; recorded beta errors 0.150 percent (TE) and 0.0119 percent (TM) at h = 0.025 um | frequency domain | 0.8 um CPML fixed across meshes |
| Open fiber HE11, `tests/test_open_mode_ports.py`, `tests/test_open_mode_padding.py` | `solve_fiber_he11` (`analytic_continuum`) | Independent characteristic equation | recorded beta errors 0.551 and 0.330 percent at h = 0.1 and 0.08 um; staircase circle at 8 to 10 cells per diameter, hence the 2 percent fixture budget | frequency domain | 0.8 um CPML; box and PML sensitivity of beta below 1e-4 |
| Homogeneous medium, `tests/test_mode_ports.py` | Discrete periodic dispersion (`analytic_discrete`) | Closed form | rtol 2e-5 | frequency domain | none |

Open residual: field profile, confinement factor and modal power are not
compared with an analytic value; power normalisation is self-consistency.

### G3-10 `G3-10_pic_networks`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Y branch and crossing flux closure at 0.05 um, `tests/test_mode_branch_passivity.py` | Passivity and Poynting balance through a closed box (`physical_invariant`) | Flux planes do not use the modal projection; the incident power is the calibration guide's own flux | Closure -0.688 percent (Y branch) and -0.344 percent (crossing); Y-branch residual is mesh-, window- and PML-independent and unexplained; crossing residual is O(h^2) quadrature (-1.97 percent at 0.1 um) | 2400 steps, 229 fs; unchanged to five digits at 3200 steps; at 0.1 um 800 steps was truncation-limited (-2.12 percent falling to -0.64 percent at 1200 steps) | 0.8 um CPML; 1.6 and 2.4 um controls at 0.1 um changed the closure by less than 0.15 percentage points |
| Y branch and crossing S at 0.1 um, `tests/test_mode_branches.py` | Reciprocity, passivity bound, symmetry (`physical_invariant`) | Theorems | reciprocity 2.0e-3 (Y branch), 2.4e-4 (crossing) recorded; float32 | 800 steps, 152 fs | 0.8 um CPML |
| Straight guide, `tests/test_mode_branches.py`, `tests/test_mode_network.py` | exp(2 i beta L) from the mode solver (`analytic_discrete`); aperture versus full-cell network (`shared_discrete_operator`) | beta shares the eigensolver | column power within 1e-3 (aperture), 0.74 percent defect recorded for the perturbed full-cell guide | 600 steps | 0.8 um (mesh 0.1) and 5 cells (mesh 0.2) |
| Index step 1.0 to 1.2, `tests/test_mode_network_unequal.py` | Fresnel R and T (`analytic_continuum`); scalar discrete Yee interface (`independent_implementation_same_scheme`) | Fresnel is independent; the interface oracle is separate code of the same scheme, checked unitary to 2e-15 | complex S within 0.004 (recorded 1.29e-5) | 600 steps | 15 cells in the benchmark |

Open residuals: no bend or coupler fixture; no independent solver for the
junction S values; the 0.1 um network mesh cannot meet the 1 percent balance
limit because of the flux quadrature error, so the balance is declared at
0.05 um only.

### G3-11 `G3-11_dipole_radiation`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Analytic six-face dipole, `tests/test_radiation.py` | Hertzian dipole fields and far amplitude with phase (`analytic_continuum`); near flux versus far power (`physical_invariant`) | Closed forms | float64 quadrature convergence with halving ratios above 3.5 to 3.8, final errors below 2e-4 (far) and 5e-4 (near); float32 2e-3 | none (frequency domain input) | none |
| Native vacuum dipole pattern, `tests/test_radiation_dipole_pattern.py` | sin^2 theta with mesh refinement (`convergence_study`) | Closed form; scale factor fitted | pattern errors 1.03, 0.54, 0.23 percent at 0.1, 0.075, 0.05 um; float32; magnitude only | 50 fs fixed within one time step | 0.3 um fixed; no sweep |
| Native far and near objectives VJP, `tests/test_radiation.py` | central difference (`finite_difference_same_discretisation`) | Same discretisation | float64 rtol 2e-6 | 35 steps | 3 cells |

Open residuals: surface-position dependence and the phase of the native far
field are not tested; the native study sweeps the mesh only.

### G3-12 `G3-12_tensor_slab`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Birefringent slab, `tests/test_tensor_slab_acceptance.py` | Scalar-channel transfer matrix and its n_1 derivative (`analytic_continuum`) | Closed form; normal incidence with shared principal axes only | channel-vector error 1.372 percent (0.05 um) and 0.330 percent (0.025 um); index VJP 6.89 percent; tail RMS to peak 9.1e-8; float32 | 80 fs fixed, 594 and 1028 steps; tail decay bounds truncation; no sweep | 1 um tensor-filled CPML; no isolated reflection measurement |
| Coupled PEC standing wave, `tests/test_anisotropy_walls.py` | Discrete eigenpolarization frequency (`analytic_discrete`) with a 3 percent continuum bound | Closed form | float64 rtol 1e-9 | 400 steps | none |
| Fourier symbol and refinement, `tests/test_anisotropy.py` | Independently derived symbol (`analytic_discrete`); continuum eigenfrequency refinement ratio below 0.27 | Closed form | float64 2e-12 | 256 steps for energy conservation | none |
| Tensor gradients, `tests/test_anisotropy*.py` | central differences and Taylor (`finite_difference_same_discretisation`); full autograd (`shared_discrete_operator`) | Same discretisation | float64 rtol 2e-5 (six components), 1e-6 (rotation angle) | 12 to 16 steps | 3 layers |

Open residuals: reflection and channel balance of the tensor slab are not
measured; oblique incidence and unshared axes are outside the fixture.

### G3-14 `G3-14_discrete_backend_agreement`

All fixtures are `shared_discrete_operator` (layer A) by definition. Precision
floors: float32 forward 2e-6 to 3e-6 relative after 23 to 180 steps, float32
VJP 2e-5 to 3e-4 relative after 12 to 512 backward steps, float64 1e-13 to
2e-10. The float32 gradient budgets of 2e-4 to 3e-4 relative (tensor table
VJP, endpoint CPML VJPs, streamed density gradient, all-modes driver,
reversible) exceed the program's float32 rtol 1e-4 and are reported as
differences. Time window: the same steps on both paths. PML: part of the
compared operator, with CPML states compared directly.

### G3-15 `G3-15_gradient_checks`

All fixtures are `finite_difference_same_discretisation` or
`shared_discrete_operator` (layer A). Precision floors: float64 adjoint against
autograd 1e-9 to 1e-12; central differences 1e-6 to 2e-6 relative at h = 1e-5
(difference-quotient floor); float32 checks use steps of 2e-3 to 2e-2 with
2e-2 to 3e-2 budgets. Step sweeps with an asserted second-order trend: the two
PMC tests only; Taylor ratios of about 4 asserted in four tests, superlinear
only in the rest. No test detects the round-off floor adaptively; no
waveform parameter is checked through an FDTD run.

### G3-16 `G3-16_physical_parameter_gradients`

| Fixture | Oracle (class) | Independence | Precision floor | Time window | PML |
| --- | --- | --- | --- | --- | --- |
| Planar slab thickness and permittivity derivatives, `tests/test_gradient_mesh_slab.py` | Airy T, dT/dd, dT/depsilon (`analytic_continuum`), checked against an independent transfer formula | Closed form | float32 adjoint; conservation error 1.8e-5; followup errors 1.63 and 1.78 percent at (0.01, 0.06) um; the first width 0.08 um missed 3 percent (2.80 and 3.19 percent) and is kept in the record | 90 fs exact; 120 fs control changed outputs by at most 1.8e-7 | 0.4 um; 0.5 um control changed outputs by at most 1.2e-7 |
| Polygon vertices, `tests/test_shape_gradients.py` record | Fine-mesh float64 central differences of the same regularised fill (`stored_record` of a `convergence_study`) | Not sharp-interface; regularised derivative only | float64 control changed the gradient by 6.6e-7 relative; reference step halving 0.066 and 0.055 percent; fine error 0.51 percent | 60 fs; 90 fs control 5.8e-6 relative | 0.24 um; 0.30 um control 1.8e-6 relative |
| Geometry maps, `tests/test_differentiable_geometry.py` | central differences and full autograd (layer A) | Same discretisation | float64 rtol 2e-6; float32 chain 3e-4 | 18 steps | 3 cells |

Open residuals: no sharp-interface shape derivative; no analytic derivative
for curved interfaces; no absolute-scale test of a near-zero derivative.

### G3-17 `G3-17_oracle_budget`

This document and `tests/test_oracle_budget.py`. The test checks every
`docs/validation/cases/G3-*.json` present in the tree, so G3 case files that
other branches add must carry `oracle_class` and a `tests.layers` entry per
listed test; the tasks recorded here (G3-06, G3-09, G3-10, G3-11, G3-12 and
G3-16) must keep at least one layer-B entry.

## Other G3 tasks

G3-01 to G3-05, G3-07, G3-08 and G3-13 are recorded in their own case files by
other sessions; add their rows here when those files merge. The test above
already enforces the class naming on them.
