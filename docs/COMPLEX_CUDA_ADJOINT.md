# Fused complex discrete adjoint

Resident `DifferentiableSimulation` and `DifferentiablePlaneSimulation` accept
`AdjointOptions(backward_kernel='fused')` for CUDA complex64/complex128 fields
and real scalar or diagonal dielectric epsilon. The default complex `'auto'`
path remains the Torch transpose. Forward independently selects Torch or
fused updates through `project.region.cuda_kernel`.

The kernel gathers the Hermitian transpose of each Yee difference. At Bloch
seams, the phase coefficients are conjugated separately for forward and backward
differences. Real-epsilon derivatives accumulate
`-courant * real(conj(E_bar) * curl(H)) / epsilon**2`. One cell thread owns its
material gradient, avoiding atomic reduction. Scalar epsilon sums the three
electric-component contributions, while diagonal epsilon retains them.

Complex CPML adjoints use two state buffers. Each transpose reads one buffer
and writes the other, so neighbors never read a concurrently overwritten
memory state. H and E transpose launches remain globally ordered. Dense point
or spectral seeds use prepared Torch gather/scatter maps before these launches,
including accumulation for duplicate samples. Observation injection is not
itself a fused CUDA kernel. Online spectral seeds retain their complex dtype.

The same checkpoint engine supplies primal states. Device, host, disk and
hierarchical checkpoint settings retain their existing budgets and first-order
restriction. This implementation does not enable complex spatial streaming,
ADE differentiation, trainable source/phase or higher-order derivatives.

Tests compare FP32/FP64 uniform and nonuniform cases against full autograd,
including online spectra. Random nonzero primal and adjoint CPML states test
the complete one-step transpose and buffer swap. Three-dimensional cases move
the PML axis between x and z to exercise all Bloch seam axes and asynchronous
disk replay. Actual CR selected-ray objective/VJP timing is measured separately
by `benchmarks.complex_layer_adjoint` with the same fused forward in both paths,
one warmup per path and alternating measured repetitions.

For the explicit-input CR runner, use:

```console
python -m benchmarks.cr_spectral_objective --schedule schedule.json --density seed.npy --context context.pt --output results/objective.json --mesh .05 --steps 1600 --forward-kernel fused --backward-kernel fused
```

These numerical settings illustrate execution and are not convergence defaults.
The ongoing original full-pupil forward run uses its unchanged Torch revision.

## Replay lifetime

A recursive Python closure previously retained resident solver buffers until
cyclic garbage collection, even after a caller released its completed result.
The recursive closure is now explicitly broken in resident, global streamed
and local tile backward replay, including the cleanup path. Lifetime tests
disable cyclic collection and check weak references, rather than relying on
allocator peaks alone. Streamed host/disk cases also cover asynchronous CUDA
staging and removal of temporary state files. Users who retain their autograd
result graphs still retain the associated contexts as expected.

## Selected CR objective and gradient measurement

At 540 nm, one locked relaxed-seed pupil ray, 50 nm mesh and 1600 FP64 steps,
both paths use fused forward, four checkpoint slots and no reference cache.
One warmup per path precedes three alternating measurements.

| Backward path | Complete call median (s) | Peak Torch CUDA bytes |
|---|---:|---:|
| Torch transpose | 50.2011 | 359,952,384 |
| Fused complex transpose | 32.4018 | 328,486,400 |

This is a 1.5493x improvement in the complete objective/VJP call, including
two reference solves and both source cases. It is not the ratio of isolated
backward kernels. Every measured repetition had the listed peak and a common
17,170,944-byte starting allocation. The maximum per-pixel gradient difference
was 2.17e-19. Objective 0.2843927415139927 and directional derivative
0.21922469270490433 reproduce the preceding selected-ray validation.
[Raw repetitions](validation/cr-complex-adjoint-3060.json) include all timings
and allocator baselines. These results do not establish full-pupil optimization,
physical convergence or performance relative to another solver. Earlier pilot
peaks measured before the closure-lifetime fix are not directly comparable.

The final affected local suite passed 91 tests, including real and complex
adjoints, lifetime checks, spatial/temporal tiling and streamed admission.
Remote validation of the new kernel is pending while the original full CR run
continues on RTX 5880.
