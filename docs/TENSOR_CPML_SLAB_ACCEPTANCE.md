# Restricted tensor CPML: polarized slab acceptance

The first fixed-criterion run passed on the local NVIDIA GeForce RTX 3060.
Normal-direction refinement from 0.05 to 0.025 micrometres reduced the coherent
transmission-vector error from **1.0088% to 0.2421%**. The coarse-grid rotation
material VJP differs from the independent continuum derivative by **1.5077%**.
This is a physical transmission test of a rotated slab inside a fixed isotropic
exterior, not an isolated CPML reflection measurement or a general anisotropic
CPML stability result.

The executable is [tensor_cpml_slab_acceptance.py](../benchmarks/tensor_cpml_slab_acceptance.py).
Exact inputs, declared criteria, complex amplitudes, hardware, software/source
hashes, allocation peaks, timing and pass flags are in the
[recorded result](validation/tensor_cpml_slab_3060.json).

```sh
python -m benchmarks.tensor_cpml_slab_acceptance --gradient
```

## Independent physical oracle and phase convention

A plane pulse travels along +z through a 0.6 micrometre slab. The exterior index
is 1.2. The transverse principal slab indices are 1.5 and 2.0, rotated 25 degrees
around z. The third principal permittivity is 2.25. At normal incidence, the
transverse principal polarizations are independent continuum eigenchannels.
The incident field is x polarized. No scalar effective index is substituted.

For `k0 = 2*pi/wavelength`, thickness d, background index n0 and principal
index nj, the exact transfer-matrix solution, normalized to propagation through
the same thickness of background, is

```text
tj = exp(+i*k0*n0*d) / [cos(k0*nj*d) + (i/2)*(nj/n0+n0/nj)*sin(k0*nj*d)]
Tx = cos(theta)^2*t1 + sin(theta)^2*t2
Ty = cos(theta)*sin(theta)*(t1-t2)
Tpower = |Tx|^2 + |Ty|^2
```

This sign is specific to `DifferentiableResult.spectrum`, which actually uses
`exp(-i*omega*t)`. Its positive-frequency phasor has time dependence
`exp(+i*omega*t)` and +z spatial dependence `exp(-i*k*z)`. This differs from the
positive-sign native monitor/network convention. The matched-index limit gives
`tj=1`; increasing the index weakly gives a negative reference-normalized phase.
Both limits were locked in executable assertions before the first measurement.

The field spectra are divided by the co-polarized slab-free reference spectrum
using exactly the same impressed-E plane source, position, exterior, mesh and
sampling. By linearity, its absolute impressed-field calibration cancels. The
reference is not a lossless-energy normalization inferred from the slab itself.
Because input and output media are identical and both outgoing polarizations
share the same impedance, the sum of squared normalized electric amplitudes is
the transmitted power fraction. This avoids treating uncollocated raw E/H point
samples as a calibrated plane-flux measurement.

The independent rotation derivative is
`d|Ty|^2/dtheta = 2*Re(conj(Ty)*(cos(theta)^2-sin(theta)^2)*(t1-t2))`.
The actual coarse-grid VJP differentiates rotation through the symmetric tensor,
material assembly, checkpointed FDTD history and coherent normalized spectrum.
The fixed exterior/collar is not differentiated. No optimization descent or
optimizer-quality claim is made from this one derivative.

## Fixed experiment and criteria declared before execution

The domain is 0.5 by 0.5 by 6 micrometres. Transverse axes are periodic and the
plane source covers the entire transverse domain. Transverse fields are exactly
uniform, so the physically relevant refinement is along z. Transverse spacing
stays at 0.1 micrometres; normal spacing is 0.05 and 0.025 micrometres. There are
5 by 5 by 120 and 5 by 5 by 240 cells.

Both z faces have 1 micrometre CPML thickness, implemented with 20 and 40 layers.
The source is at z=-1.2 micrometres and the Ex/Ey probe at z=+1.2 micrometres.
The Gaussian pulse has a 6 fs power FWHM, offset 18 fs, and wavelength 1.55
micrometres. The target physical duration is 80 fs on both grids, rounded upward
to a whole step: 594 steps / 80.0802 fs and 1028 steps / 80.0150 fs. FP32 is used
throughout the FDTD simulations. The scalar continuum oracle uses standard
complex double arithmetic.

All CPML nodes plus the required adjacent node row are exactly `1.44*I`.
The slab contains exactly 12 and 24 node rows, maintaining physical thickness
0.6 micrometres. Because transverse electric fields lie on z nodes, the effective
material faces lie halfway between the adjacent node rows. Recorded faces are
[-0.325, 0.275] and [-0.3125, 0.2875] micrometres. Their centers shift by half a
normal cell while thickness remains fixed. Translation of this slab between
fixed source/probe planes in a homogeneous exterior does not change its
reference-normalized transmission. It would change a reflection phase, which
is not the observable used here.

The following gates were fixed before execution and were not tuned afterward:

| Gate | Threshold | Observed |
| --- | ---: | ---: |
| Coarse complex-vector relative error | <=5% | 1.0088% |
| Fine complex-vector relative error | <=3% | 0.2421% |
| Fine/coarse complex-error ratio | <=0.8 | 0.2400 |
| Fine total-transmission absolute error | <=0.03 | 0.0005318 |
| Last-10%-time field RMS / peak, every run | <=0.001 | maximum 1.266e-7 |
| Coarse rotation VJP relative error | <=15% | 1.5077% |
| Each CUDA allocated peak | <=reported reservation | passed |

The continuum transmitted power is 0.9514786. The coarse and fine values are
0.9492915 and 0.9509468. The continuum rotation derivative is 0.5483669 per radian;
the coarse FDTD value is 0.5566346 per radian.

## Execution evidence and remaining limits

One run performed four forward simulations (one reference and one slab per
mesh), plus one coarse rotation backward. Wall time was 54.56 seconds. Forward
times were 5.06/4.64 seconds at coarse resolution and 7.89/9.76 seconds at fine
resolution. The coarse backward took 26.81 seconds with eight checkpoints and
2158 replayed steps. The maximum allocated CUDA peak was 25,789,952 bytes, below
the corresponding 75,590,480-byte reservation. These small-case timings are
recorded for reproducibility and are not a hardware scaling benchmark.

The runtime revision was `6fa0c3518efba5d0e93c4c1125b52665a5b7713b`, with
PyTorch 2.10.0+cu126 and CUDA 12.6. No runtime code changes, repeated existing
tests, parameter retuning, remote GPU use or additional physical runs were
needed. The benchmark source hash and all measured runtime source hashes are
included in the result JSON.

Two meshes show the expected error reduction here, but do not establish a
broad asymptotic convergence study. Tail decay controls finite-duration
contamination at the sampled transmitted field; it does not independently
bound CPML reflection, which would require incident/reflected separation and
its own physical sweep. This run does not validate anisotropy inside CPML,
oblique incidence, general interfaces, long-time stability, broadband accuracy,
large-memory scaling or general FDTD feature parity.

## Postmeasurement driver-only hardening

After the successful physical run, the exact measured driver bytes were
preserved privately under a content-addressed snapshot with SHA256
`8b213f589b3f7336b262ee69d8b91db4618f34f65749c30e938a18182f8063c5`.
The raw result JSON and its measured source hashes remain unchanged. The current
driver adds a nonzero process exit after writing a failed acceptance record,
and captures source hashes before execution and verifies them afterward as a
metadata-integrity gate. No physics, input, oracle, numerical criterion or
measured result changed. No physical rerun was justified by these harness-only
changes. A mocked failure path checks JSON retention and the nonzero exit
without executing FDTD or touching CUDA.
