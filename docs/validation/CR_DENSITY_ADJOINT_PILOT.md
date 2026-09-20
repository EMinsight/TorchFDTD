# Selected-ray CR density derivative

The hash-identified binary CR seed was relaxed to `0.01 + 0.98 * seed` so
central perturbations remain inside the supported density interval. This is a
specified nearby continuous design, not the unchanged binary seed. The case
uses 540 nm, pupil ray zero, a 50 nm mesh (40 x 40 x 166 cells), 1600 steps,
FP64 fields and four discrete-adjoint checkpoint slots.

Both Ex/Ey source bases are calibrated in the homogeneous reference. Their
complex fields are combined into Cartesian input polarizations, normalized by
matched-reference transmission, and reduced to electric-intensity well
allocation. The two source cases are differentiated through sequential
recomputation. The scalar test objective on unpolarized response r is
`[0.1, 0.3, -0.2, 0.7] @ r + 0.2 * sum(r**2)`. It exercises this chain but
is not the full nine-wavelength CR information objective.

The density direction is `cos(2*pi*x) * sin(4*pi*y)` on the 128-by-128 pixel
midpoints in normalized cell coordinates. The adjoint directional derivative
was **0.219224692705**.

| Central-difference step | Finite difference | Relative discrepancy |
|---|---:|---:|
| 0.001 | 0.219222011968 | 1.223e-5 |
| 0.0005 | 0.219224022518 | 3.057e-6 |

Halving the perturbation reduced discrepancy by approximately four, consistent
with second-order central-difference truncation. Both checks pass the 2e-4
relative tolerance declared in the executable before measurement. This is
one directional check of the discrete solver. It does not establish mesh
convergence of the physical gradient or correctness over the full pupil.

On RTX 3060, the complete objective-plus-backward iteration took 158.54 seconds
with peak Torch CUDA allocation **332,274,176 bytes**. The fixed homogeneous
reference was prepared before this timer, but its retained tensors contribute
to the allocation peak. The iteration includes density transfer, both forward
source cases, objective evaluation, case replay and discrete adjoints. Total
validation including reference preparation and four perturbed objective evaluations
took 237.00 seconds. There is no full-history autograd baseline or competitor
speed comparison here.

The [record](cr-case-density-adjoint-3060.json) accompanies
`benchmarks.periodic_layer_adjoint`. Original design arrays remain private.

The same check on RTX 5880 produced identical recorded objective, gradient norm,
directional derivative and finite differences. The complete iteration took
138.49 seconds with the same 332,274,176-byte peak Torch allocation. Total
validation took 209.31 seconds. See the [RTX 5880 record](cr-case-density-adjoint-5880.json).
These single-run timings are not a controlled cross-device speed benchmark.
