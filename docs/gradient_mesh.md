# Physical transmission and shape-gradient convergence

`python -m benchmarks.gradient_mesh --output docs/validation/gradient_mesh_3060.json`
reproduces the FP32 experiment. The saved record uses the local NVIDIA GeForce
RTX 3060 and contains every measured case, control and declared threshold.
The two cheap tests in `tests/test_gradient_mesh.py` check the physical experiment
invariants and validate the analytic derivatives against an independent complex
amplitude slab formula. They do not replace the CUDA experiment.

The domain is 8 by 0.24 micrometres in 2D with a periodic transverse boundary.
The slab is 0.23 micrometres thick, centred at x = 0.013 micrometres, with relative
permittivity 2.25 in air. The source wavelength is 1.55 micrometres and its pulse
length is one optical cycle. Each refinement keeps the physical source, monitor
locations, domain, 90 fs time window and 0.4 micrometre CPML thickness fixed.
The time step is adjusted down from CFL so the final physical time is identical.
Each grid has its own matched air reference. Both electric and magnetic fields
are interpolated to the spectral planes before computing power. The objective
is transmitted power divided by the incident reference power.

The independent sharp-interface comparator is

T = 1 / [1 + ((epsilon - 1)^2 / (4 epsilon)) sin^2(2 pi sqrt(epsilon) d / lambda)].

The benchmark differentiates this expression analytically with respect to
thickness d in micrometres and dimensionless relative permittivity epsilon.
The FDTD derivatives propagate through the regularized geometry VJP and the
checkpointed electromagnetic adjoint. They are not judged solely against a
finite difference of the same discretized solver.

| Mesh (um) | Transition width (um) | T absolute error | Thickness derivative relative error | Epsilon derivative relative error |
| --- | --- | --- | --- | --- |
| 0.04 | 0.16 | 0.0152381 | 12.0901% | 11.9563% |
| 0.02 | 0.12 | 0.0089792 | 6.8438% | 7.0096% |
| 0.01 | 0.08 | 0.0040911 | 2.7977% | 3.1889% |
| 0.01 | 0.06, followup | 0.0022881 | 1.6326% | 1.7834% |

The initial 0.08 micrometre configuration **failed the declared 3% derivative
criterion** because the material derivative error was 3.1889%. The explicit
followup reduced the transition width to 0.06 micrometres, still six grid cells.
It passed the same 3% threshold without a precision change. The saved
`initial_validation` entry preserves the failed initial result. The followup
has T = 0.85807955, dT/dd = -0.25688773 per micrometre and dT/depsilon = -0.15317631.
The sharp values are 0.85579145, -0.26115131 per micrometre and -0.15595767.

Separate controls establish that the remaining error is not removed by simply
running longer or thickening the absorber. Extending the followup from 90 to
120 fs changes T and the derivatives by at most 1.79e-7. Increasing CPML from
0.4 to 0.5 micrometres changes them by at most 1.20e-7. The followup power
conservation residual is 4.77e-7. Holding the transition width at 0.12 micrometres
while refining from 0.04 through 0.02 to 0.01 micrometres leaves thickness and
material derivative errors of 6.39% and 7.13% at the finest grid. A fixed smooth
profile therefore retains a measurable bias relative to a sharp dielectric
interface. Mesh refinement and regularization reduction have distinct roles.

The small design steps were specified in physical units before evaluation.
Their signs come from the adjoint, with no line search. Decreasing thickness by
0.001 micrometres increased simulated T by 0.00026125, compared with a linear
adjoint prediction of 0.00025689 and sharp analytic increase of 0.00026565.
Decreasing epsilon by 0.01 increased simulated T by 0.00153273, compared with
0.00153176 predicted and 0.00156060 analytically. These are actual forward
reevaluations of the proposed designs, not gradient-sign checks alone.

This experiment supports physical convergence for one normally incident,
nondispersive planar slab and these resolved transition widths. It does not
establish asymptotic order, universal convergence for a one-cell default width,
curved or rotated-interface shape derivatives, oblique incidence, dispersive
shape derivatives, or large-design memory scaling. In particular, taking the
transition below the mesh resolution can produce phase-dependent or vanishing
shape derivatives. The checkpointed adjoint uses eight checkpoints here. This
small physical validation is complementary to the separate large-domain
resident and streamed memory benchmarks.

The executable checks also require all conservation residuals below 5e-4 and
smaller changes in T and both gradients from the medium to fine grid than from
the coarse to medium grid at fixed 0.12 micrometre width. These fixed-width
checks pass, while the bias relative to the sharp interface remains visible.

Runtime provenance is revision `377eb04d8250ffe2ab4d051a8e974fef22eccb2a`.
The report hashes the committed blobs of the relevant runtime modules from
that revision. The recorded benchmark hash identifies the final reproduction
driver, not the original driver bytes used during measurement. The report
preserves the experiment history and explicitly identifies the metadata and
group-label changes made after measurement. No simulations were repeated just
to add provenance metadata.

A bounded curved-interface followup should use a dielectric cylinder and an
independent cylindrical Mie series for scattering power and its radius
sensitivity. Compare the adjoint radius derivative against a converged
high-accuracy derivative of that analytic series. Hold the source bandwidth,
physical domain, observation contour, duration and PML thickness fixed across
meshes. Resolve the smooth transition at several widths before reducing it.
Use several subcell centre offsets to expose sampling-phase dependence, compare
both supported polarizations, and test a predeclared small radius step against
both the FDTD and analytic objectives. Demonstrating this case would extend the
present planar evidence. No such curved-interface solve is claimed here.
