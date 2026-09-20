# Selected-frequency oblique polarization synthesis

An oblique Cartesian x/y polarization in the CR reference denotes fixed p/s
Jones coefficients, not a single Ex or Ey electric-current sheet. At polar
angle theta and azimuth phi, the x input has (p,s) = (cos(phi),-sin(phi)),
while y has (sin(phi),cos(phi)). For propagation toward +z, the tangential
p electric vector is cos(theta)*(cos(phi),sin(phi)) and s is
(-sin(phi),cos(phi)). The longitudinal component is supplied by Maxwell's
equations, not discarded.

TorchFDTD can synthesize these selected-frequency responses from two
independent source-basis solves. First run both sources in a homogeneous
reference medium under `torch.no_grad()`. At a downstream reference plane,
remove the known transverse Bloch phase and quadrature-average the tangential
electric fields. These two vectors form a 2-by-2 matrix M at each frequency.
`calibrate_plane_polarization` solves M c = target for fixed coefficients c.

```python
from torchfdtd import calibrate_plane_polarization, mix_plane_fields

# references and samples each contain two DifferentiablePlaneResult objects.
# kt has shape (frequency, 2), in radians per micrometre.
# target_xy has shape (frequency, 2), using the Jones convention above.
c = calibrate_plane_polarization(references, kt, target_xy)
incident = mix_plane_fields(references, c)
transmitted = mix_plane_fields(samples, c)
transmission = transmitted.normalized_flux(incident)
```

In this normalization example the reference and sample monitors must have
matching locations, quadrature, sources, mesh and duration. Calibration may
instead occur at an upstream homogeneous reference plane. The same calibrated
coefficients must then be reused at each corresponding monitor. Mixed-source
signatures include both original source signatures and the coefficient bytes,
so different synthesis settings cannot silently pass reference matching.

Combine complex fields before power or detector allocation. Within one Jones
state the bases are coherent. Across independent pupil rays and the two
unpolarized input states, average the final responses incoherently with the
specified weights. Geometry gradients propagate through both basis solves.
Calibration and source coefficients are fixed, with no angle/source gradient.

This is spectral linear superposition. It does not introduce an oblique
one-way time-domain source, eliminate the upward-going wave from a soft sheet,
or establish broadband angle consistency. The calibration plane must see a
predominantly forward wave in a homogeneous isotropic reference. Reflections,
finite duration, mesh dispersion and interpolation require independent
convergence checks. Ill-conditioned source bases are rejected. The routine
does not decompose forward/backward or higher diffraction orders.

The executable physical check is `python -m benchmarks.polarization_slab
--output results/polarization-slab.json`. It compares two calibrated Cartesian
inputs in a 3D dielectric slab with analytic p/s Fresnel transmission, energy
balance and a central finite-difference material derivative. This is distinct
from a matched full-pupil CR simulation.

## Recorded 3D slab check

RTX 5880 Ada, FP64, 8 x 8 x 160 cells, 0.05 micrometre mesh, 512 steps,
1.55 micrometre wavelength, 20 degree incidence and 22.5 degree azimuth.
The index-1.5 slab is 0.2 micrometres thick in air. Cartesian x/y
transmissions were 0.880490 and 0.850707 versus Fresnel 0.884494 and 0.855069.
Maximum transmission error was 0.004362 and energy-balance error 1.06e-5.
The derivative of summed transmission with respect to slab index differed
from central finite differences by 1.14e-8 relative. Declared acceptance limits
were 0.02, 0.005 and 2e-6 respectively. Complete validation took 142.2 seconds,
including reference/sample solves, backward and two perturbed solves. This is
not a performance comparison. One mesh/angle/wavelength does not establish
full-pupil, spectral or shape convergence. See the [raw record](validation/polarization-slab-5880.json).
