# FDTD through the device, angular spectrum through the air

For a metalens the FDTD grid can stop just above the device: the output plane
monitor records the six complex field components at every wavelength, and the
field everywhere beyond it follows from one FFT per component and wavelength
multiplied by the free-space transfer function. `torchfdtd.angular_spectrum`
does that for a `StitchedPlane`, a `DifferentiablePlaneResult` or the plane
result of an ordinary `Simulation`, and extracts a section through the
propagation axis, the full volume, or arbitrary points. Everything is a Torch
operation, so a focal objective differentiates back to the plane fields and
through `DifferentiablePlaneSimulation` or `TiledPlaneSimulation` to the
device. `tiled.propagate_plane` is now one call of the same implementation.

```python
from torchfdtd import Project, Simulation, propagate_section, propagate_volume, propagate_points, plane_spectrum

result = Simulation(project).run()                 # grid ends 0.5 um above the pillars
plane = result.field_monitor('out')                # six components at each recorded frequency
z = torch.linspace(0., 1100., 900)                 # distances from the plane, micrometres
section = propagate_section(plane, z, section='xz', offset_um=0., components=('Ex', 'Ey', 'Ez'), pad=2)
focus = section.focus(frequency_index=1)           # z, x, peak intensity and FWHM along x
print(section.intensity().shape, focus, section.report['max_angle_deg'])
volume = propagate_volume(plane, z[::30], components=('Ex',), budget_bytes=4 * 2**30)
points = propagate_points(plane, [[0., 0., 1000.5]], components=('Ex', 'Ey', 'Ez'))
```

## The transfer function and what the plane can hold

Each Cartesian component of E and H satisfies the scalar Helmholtz equation in
the homogeneous exterior, so with the plane's spectrum `S(ku, kv)` the field at
distance `z` is the inverse transform of `S exp(i k_n z)` with
`k_n = sqrt(k^2 - ku^2 - kv^2)`, `k = 2 pi n / wavelength` for the real
exterior index `n`. Beyond the propagation circle `k_n` is imaginary and the
factor is `exp(-|k_n| z)`: evanescent components decay and are never
amplified, which is also why distances must be nonnegative, away from the
device along the plane's propagation direction (`direction=-1` for a plane
whose light travels toward the negative normal).

The plane spacing `h` sets the largest angle the plane can represent,
`sin(theta_max) = wavelength / (2 h)`; a 120 nm spacing holds every
propagating angle at 1.55 um, a spacing above half a wavelength does not, and
a field whose spectrum crosses that limit aliases instead of failing.
`plane_spectrum(plane, pad).report` records `max_angle_deg` and the fraction
of evanescent samples per wavelength. The plane is zero padded `pad` times its
size before the FFT, which assumes no field outside the recorded window and
keeps light that leaves the aperture from wrapping around: choose `pad` so
that `(pad - 1) * span / 2` exceeds `distance * tan(theta)` for the angles that
carry power. The exterior must be homogeneous, lossless and source free, and
the plane must hold outgoing waves only.

`PlaneSpectrum` keeps `ku`, `kv` and `k` and computes each padded spectrum
lazily with `spectrum(f, c)`, so one padded array is resident at a time.
`transfer(f, z, dtype)` builds `exp(i k_n z)` with the phase reduced modulo
2 pi in double precision before it is cast to the field precision; for a
uniform list of distances the section and volume kernels build the exact
factor at the start of every chunk of `chunk` distances and multiply by the
per-step ratio inside it, so the phase error stays below `chunk` times the
field precision. A list of distances within 1e-6 of a uniform grid is snapped
to that grid and the returned `z_um` holds the grid used. Fields of dtype
complex64 propagate in single precision throughout.

## Sections, volumes and points

`propagate_section(plane, z_um, *, index=1., section='xz', offset_um=0.,
components=('Ex','Ey','Ez'), pad=2, chunk=64)` returns the fields on the
section through the normal at one fixed transverse coordinate for all
distances at once, `(F, Nz, Na, C)`: for the xz section at `y = offset` the
spectrum times `exp(i kv y)` is summed over `kv` for every `z` (a running
product over the chunk), then one inverse FFT along `ku` per chunk. There is
no 2D inverse FFT per plane. `SectionResult` carries `z_um` (distance from
the plane), `normal_um` (absolute), `a_um`, `intensity()` (|E|^2 over the
electric components present) and `focus()` (peak position and the FWHM along
the section through it, by linear interpolation of the half-maximum
crossings). `section='yz'` fixes `x` instead; for a y-normal 2D plane the
section is `'xy'`.

`propagate_volume(plane, z_um, *, components, pad=2, chunk=8, budget_bytes=None,
output=None)` returns `(F, Nz, Nu, Nv, C)` by one inverse FFT per distance,
chunked. `volume_bytes` gives the output and working-set estimate that
`budget_bytes` is checked against; with `output` the chunks are written to an
NPZ (`fields_f{f}_z{start}` plus the coordinates) without retaining them, and
only the working set counts against the budget.

`propagate_points(plane, points_um, *, components, pad=2)` evaluates the
spectrum sum directly at global-coordinate points on the propagation side,
`(F, P, C)`, at a cost of points times padded samples.

## Gradients

The section and volume kernels are custom autograd functions whose adjoints
recompute the conjugate transfer function with the same chunked recurrence,
so no per-distance factor is stored; the padded FFT, the offset phase and the
inverse FFTs are ordinary Torch operations. An objective on
`section.intensity()`, `volume.intensity()` or the point fields differentiates
to the plane fields and from there through the plane adjoint of
`DifferentiablePlaneSimulation` or the stitched plane of
`TiledPlaneSimulation` to the material parameters. The validation below
checks the custom adjoints against a plain autograd formulation and a Taylor
expansion. Higher derivatives are not supported.

## Validation

The tables are rendered by `python -m benchmarks.report_angular_spectrum`
from the record of `python -m benchmarks.angular_spectrum`.

The reading of the record: the transform reproduces a commensurate plane wave
to 1e-14 and a Gaussian beam to the paraxial error of the closed form, which
falls fourfold per doubled waist; a tilted beam sampled above its Nyquist
spacing aliases and below it returns to that floor. Against the closed-box
dyadic Green function the single plane agrees at the level of both
quadratures for a compact directed beam, and drifts away from the plane for a
dipole whose 1/r field a finite plane cannot hold; the closed box remains the
reference for such fields. For the metalens the FDTD grid through the focus
and the grid to the output plane agree on that plane to about 1e-2 in 3D, the
ASM intensity error grows from about 1% just above the plane to a few percent
at the far planes, the beam-alone rows show the same growth without any
pillars (light leaving the recorded window laterally is absorbed by the PML in
FDTD and kept by the padded transform), and both routes place the focus at
the same position with the FWHM agreeing to better than 1%. The route through
the plane costs a fraction of the FDTD through the focus in time and memory
(a third of the cells, a fifth of the peak memory, and the ASM itself takes
well under a second at this size). At the target size the xz section of three
components at three wavelengths through 900 planes takes 11 to 15 s on the
shared RTX 3060 with 1.7 GB peak memory; the RTX 5880 Ada has about 2.7 times
the memory bandwidth of the RTX 3060 and these kernels are bandwidth bound,
so about 4 to 6 s are expected there, unmeasured.

<!-- angular-spectrum-validation:start -->

Recorded by `python -m benchmarks.angular_spectrum --device cuda` on NVIDIA GeForce RTX 3060 (PyTorch 2.10.0+cu126) into [angular-spectrum-3060.json](validation/angular-spectrum-3060.json); the 2D comparison inside it ran on the CPU. The GPU was shared with other jobs while the times were taken.

### Closed-form beams

Gaussian beam waist on the plane (0.25 wavelength spacing, 256 samples per axis, pad 2), section through the axis against the paraxial closed form. The transform is exact for these band-limited fields, so what remains is the paraxial error, which falls fourfold when the waist doubles:

| Waist / wavelength | Rayleigh range (um) | Error at 0.5 z_R | at z_R | at 2 z_R |
|---:|---:|---:|---:|---:|
| 2 | 12.57 | 4.19e-03 | 6.34e-03 | 9.52e-03 |
| 4 | 50.27 | 1.03e-03 | 1.57e-03 | 2.35e-03 |
| 8 | 201.06 | 2.67e-04 | 4.03e-04 | 5.74e-04 |

A beam of waist 3 wavelengths tilted by 30 degrees at one Rayleigh range. Its carrier needs a spacing below 1.40 wavelengths; above that the plane cannot hold the tilt and the transform aliases:

| Spacing / wavelength | Samples | Largest representable angle (deg) | Error at z_R |
|---:|---:|---:|---:|
| 1.25 | 77 | 23.6 | 1.42e+00 |
| 1 | 96 | 30.0 | 1.00e+00 |
| 0.75 | 128 | 41.8 | 1.03e-02 |
| 0.5 | 192 | 90.0 | 3.04e-03 |
| 0.25 | 384 | 90.0 | 3.04e-03 |

A tilted plane wave commensurate with the unpadded grid propagated 7.3 um reproduces exp(i k_n d) with relative error 5.4e-15.

### Single-plane ASM against the closed-box Green function

A vector dipole 0.55 um below its top face; the ASM plane is 8 x 8 um at z = 0.6 um, 0.05 um spacing, pad 2. The dipole field decays only as 1/r, so a finite plane truncates it and the single-plane result drifts away from the plane while the closed box stays at the quadrature floor:

| Point (um) | Height above the plane (um) | ASM vs exact | Closed box vs exact | ASM vs closed box |
|---|---:|---:|---:|---:|
| (0.12, -0.08, 0.65) | 0.05 | 8.75e-04 | 1.92e-04 | 9.67e-04 |
| (0.12, -0.08, 0.8) | 0.20 | 4.89e-03 | 3.14e-04 | 5.09e-03 |
| (0.12, -0.08, 1) | 0.40 | 1.32e-02 | 4.82e-04 | 1.35e-02 |
| (0.12, -0.08, 1.4) | 0.80 | 3.68e-02 | 6.44e-04 | 3.67e-02 |
| (0.12, -0.08, 2.4) | 1.80 | 8.96e-02 | 5.99e-04 | 8.97e-02 |
| (0.4, 0.1, 1) | 0.40 | 1.50e-02 | 4.27e-04 | 1.53e-02 |
| (1.2, 0.3, 0.9) | 0.30 | 1.94e-02 | 2.12e-04 | 1.95e-02 |
| (2.5, 0, 1.5) | 0.90 | 1.31e-01 | 2.17e-04 | 1.31e-01 |

A Gaussian-apodized Huygens sheet of waist 1.24 um radiating toward +z, 12.40 x 12.40 um top face at z = 4.65 um, 64 samples per axis: a compact top-face field, where the single plane agrees with the closed box at the level of both quadratures:

| Point (um) | Height above the plane (um) | ASM pad 2 vs closed box | ASM pad 4 vs closed box | ASM pad 4 vs exact | Closed box vs exact |
|---|---:|---:|---:|---:|---:|
| (0, 0, 4.95) | 0.30 | 5.48e-04 | 5.60e-04 | 4.91e-05 | 5.24e-04 |
| (0, 0, 5.65) | 1.00 | 8.99e-05 | 1.22e-04 | 1.53e-04 | 3.29e-05 |
| (0, 0, 7.65) | 3.00 | 1.14e-03 | 7.90e-04 | 8.51e-04 | 6.26e-05 |
| (0, 0, 12.65) | 8.00 | 8.41e-03 | 8.01e-04 | 9.00e-04 | 9.89e-05 |
| (1, 0.5, 5.65) | 1.00 | 3.93e-04 | 2.09e-04 | 1.94e-04 | 3.61e-05 |
| (2, 0, 7.65) | 3.00 | 1.10e-03 | 9.22e-04 | 9.80e-04 | 7.97e-05 |
| (3, 1, 9.65) | 5.00 | 2.98e-03 | 2.62e-03 | 2.75e-03 | 1.44e-04 |
| (5, 0, 12.65) | 8.00 | 1.63e-02 | 5.12e-03 | 5.21e-03 | 1.39e-04 |

### Metalens: FDTD through the focus against FDTD to the plane plus ASM (3D)

112 silicon (index 3.48) cylinders of height 0.6 um on a 0.5 um lattice inside a 6 um aperture, hyperbolic phase for f = 6 um at 1.55 um, 0.05 um mesh; the library covers 5.26 rad and the lens needs 2.87 rad. The sheet source is the aperture, the interior is 1 um wider on every side, the output plane lies 0.5 um above the pillar tops, and the ASM uses pad 3. The two FDTD grids agree on the output plane itself to 1.5e-02 (beam alone 9.6e-06). Intensity errors are relative L2 of |E|^2 over the recorded plane:

| Distance from the plane (um) | Lens: intensity error | Lens: peak ratio ASM / FDTD | Beam alone: intensity error |
|---:|---:|---:|---:|
| 0.5 | 0.0095 | 1.004 | 0.0131 |
| 1 | 0.0119 | 0.997 | 0.0149 |
| 1.5 | 0.0103 | 1.006 | 0.0198 |
| 2 | 0.0122 | 1.008 | 0.0284 |
| 2.5 | 0.0115 | 1.005 | 0.0351 |
| 3 | 0.0112 | 1.003 | 0.0334 |
| 3.5 | 0.0111 | 0.996 | 0.0459 |
| 4 | 0.0199 | 0.976 | 0.0451 |
| 4.5 | 0.0278 | 0.963 | 0.0466 |
| 5 | 0.0216 | 0.980 | 0.0481 |
| 5.5 | 0.0167 | 1.001 | 0.0510 |
| 6 | 0.0251 | 0.978 | 0.0482 |
| 6.5 | 0.0395 | 0.946 | 0.0642 |
| 7 | 0.0266 | 0.983 | 0.0752 |
| 7.5 | 0.0478 | 1.056 | 0.0585 |

Over the whole xz section monitor (150 planes) the intensity error is 0.0178. The focus from both sections:

| | FDTD section monitor | ASM section |
|---|---:|---:|
| Peak intensity position above the plane (um) | 2.775 | 2.775 |
| Transverse position of the peak (um) | -0.025 | -0.025 |
| FWHM along x at the peak (um) | 1.336 | 1.326 |
| Peak intensity ratio ASM / FDTD | | 1.0108 |

Cost of the two routes:

| Run | Grid | Cells | Steps | Wall (s) | Peak Torch bytes |
|---|---|---:|---:|---:|---:|
| FDTD through the focus | 180 x 180 x 202 | 6,544,800 | 2412 | 60.5 | 652,101,120 |
| FDTD to the output plane | 180 x 180 x 62 | 2,008,800 | 2167 | 4.2 | 140,245,504 |
| ASM volume, 15 planes | padded 480 x 480 | | | 0.037 | 43,018,240 |
| ASM section, 150 planes | | | | 0.035 | 56,707,584 |

### The same comparison in 2D on the CPU

12 silicon slabs, 0.05 um mesh, otherwise the same layout; the FDTD focus comes from planes recorded every 0.5 um.

| Distance from the plane (um) | Lens: intensity error | Lens: peak ratio ASM / FDTD | Beam alone: intensity error |
|---:|---:|---:|---:|
| 0.5 | 0.0033 | 1.002 | 0.0077 |
| 1 | 0.0042 | 1.000 | 0.0097 |
| 1.5 | 0.0077 | 1.000 | 0.0112 |
| 2 | 0.0078 | 0.997 | 0.0140 |
| 2.5 | 0.0081 | 0.994 | 0.0131 |
| 3 | 0.0099 | 0.993 | 0.0132 |
| 3.5 | 0.0092 | 0.994 | 0.0171 |
| 4 | 0.0089 | 0.992 | 0.0223 |
| 4.5 | 0.0099 | 0.989 | 0.0153 |
| 5 | 0.0138 | 0.982 | 0.0220 |
| 5.5 | 0.0157 | 0.979 | 0.0163 |
| 6 | 0.0120 | 0.987 | 0.0203 |
| 6.5 | 0.0123 | 0.994 | 0.0193 |
| 7 | 0.0123 | 0.989 | 0.0318 |
| 7.5 | 0.0155 | 0.983 | 0.0281 |

| | FDTD recorded planes | ASM at the same plane | ASM on a 0.05 um z grid |
|---|---:|---:|---:|
| Peak intensity position above the plane (um) | 7.000 | 7.000 | 6.750 |
| FWHM along x at the peak (um) | 2.286 | 2.341 | 2.307 |
| Peak intensity ratio to the FDTD plane | | 0.9889 | 0.9907 |

| Run | Grid | Cells | Steps | Wall (s) | Peak Torch bytes |
|---|---|---:|---:|---:|---:|
| FDTD through the focus | 180 x 202 x 1 | 36,360 | 1969 | 4.5 | not measured (CPU) |
| FDTD to the output plane | 180 x 62 x 1 | 11,160 | 1769 | 1.0 | not measured (CPU) |
| ASM volume, 15 planes | padded 480 x 1 | | | 0.004 | not measured (CPU) |

### Performance target

A synthetic 1750 x 1750 plane at 0.12 um spacing (104 um aperture radius, hyperbolic phase for f = 1000 um, three wavelengths, complex64, 421 MiB of near field) propagated to 900 planes on NVIDIA GeForce RTX 3060: xz section of Ex, Ey and Ez.

| Pass | Wall (s) | Peak Torch CUDA bytes |
|---|---:|---:|
| first call | 15.1 | 1,603,213,312 |
| second call | 10.6 | 1,716,628,992 |

The section is 3 x 900 x 1750 x 3; its peak lies 981.2 um from the plane with a 7.53 um FWHM. The full volume of the same three components would need 185 GiB, which `propagate_volume` refuses under any smaller budget; its working set is 748 MiB.

<!-- angular-spectrum-validation:end -->

## Limitations

- The exterior must be homogeneous, lossless and source free beyond the
  plane, and the plane must carry outgoing waves only; a substrate interface,
  a second device or backward-travelling light beyond the plane is outside the
  contract. Only a real index is accepted.
- The recorded window is zero padded: a field that does not vanish at the
  window edge (an infinite plane wave, a dipole's 1/r tail) is truncated and
  its edge diffracts. Illuminate the device with a beam that ends inside the
  window, or record a window wide enough for the field to decay.
- Half a wavelength of spacing is the limit for a full angular range; a coarser
  plane aliases silently, so read `report['max_angle_deg']`.
- The recurrence inside a chunk accumulates roundoff of the field precision;
  use `chunk=1` for exact factors at every distance, at the cost of a double
  precision transfer per plane.
- `focus()` reports the global intensity maximum of the section and a linear
  interpolation of the half-maximum crossings; a near-field hot spot or a
  sidelobe above half maximum is reported as such.
- Gradients are first order only, and the point evaluator is meant for a few
  points.
