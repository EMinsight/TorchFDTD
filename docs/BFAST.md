# Broadband fixed-angle source technique (BFAST)

A plane wave at oblique incidence on a periodic structure has, at each frequency, an
in-plane wavevector `k_par = (omega/c) n sin(theta)`. A Bloch-periodic run fixes
`k_par`, so a broadband pulse covers a different angle at every frequency, and a
fixed-angle spectrum needs one Bloch run per frequency. BFAST fixes the *angle*
instead: one real-valued, periodic, broadband run gives the response at a single
incidence angle over the whole source band.

References: B. Liang, M. Bai, H. Ma, N. Ou and J. Miao, *Wideband Analysis of Periodic
Structures at Oblique Incidence by Material Independent FDTD Algorithm*, IEEE Trans.
Antennas Propag. 62(1), 354-360 (2014); the Lumerical BFAST plane-wave source; Meep's
`bfast_scaled_k` (`src/step_generic.cpp`, `step_bfast`).

## Usage

```python
from torchfdtd import Project, Region, Structure, Source, Simulation
from torchfdtd.models import Boundaries, BoundaryFace, FieldMonitor, SpectrumSettings
from torchfdtd.bfast import bfast_scaled_k, physical_field

periodic = dict(x_min=BoundaryFace(kind='periodic'), x_max=BoundaryFace(kind='periodic'))
k = bfast_scaled_k(30, phi=90, normal='y')     # 30 degrees from +y, plane of incidence xy -> (0.5, 0, 0)
region = Region(size=(0.4, 8, 1), mesh=0.02, steps=8000, boundaries=Boundaries(**periodic),
                material_sampling='yee', bfast_scaled_k=k)
spectrum = SpectrumSettings(sampling='wavelength', wavelength_start=1, wavelength_stop=2,
                            frequency_points=51, apodization='none')
project = Project(region=region,
                  structures=[Structure(size=(0.8, 0.3, 1), center=(0, 0.15, 0), material='SiO2 (constant n)')],
                  sources=[Source(kind='plane', normal='y', center=(0, -2, 0), size=(0.4, 0, 0), component='Ez',
                                  pulse='broadband', time_definition='wavelength',
                                  wavelength_start=1, wavelength_stop=2)],
                  monitors=[FieldMonitor(name='T', normal='y', center=(0, 2.5, 0), size=(0.4, 0, 1), spectrum=spectrum)])
result = Simulation(project).run()
```

Normalize the flux by an identical run without the structure, as for any plane-wave
source. `Ez` excites s (TE) polarization in this plane of incidence and `Ex` p (TM)
polarization; any tangential sheet component works, and the sheet needs no phase
profile.

- `Region.bfast_scaled_k` is Meep's dimensionless vector `n sin(theta) (cos(phi), sin(phi))`
  of the incident medium, written in the axes of the periodic plane.
  `torchfdtd.bfast.bfast_scaled_k(theta, phi, index, normal)` builds it: `phi` turns the plane of
  incidence about `normal` from the first transverse axis in cyclic order (x for normal z, y for
  normal x, z for normal y). The incident wave travels towards `+k` in the plane.
- Every axis with a nonzero component must be `periodic` (not `bloch`); the fields stay real.
  PML faces are allowed on one axis, the propagation axis.
- `|k| < 1`. The time step is scaled by `1 - |k|` automatically (see [Stability](#stability)),
  so a run needs about `1/(1 - |k|)` more steps.
- `Region.bfast_taper_cells` (default 10) is the ramp before each PML face, described below.
  Sources and monitors belong between the ramps; `estimate()` warns otherwise.
- Both fields are written to the project JSON only when BFAST is on, so other projects keep their
  serialization and plan hashes.

## Physical fields

The run solves for `E~(r, t) = E(r, t + k.r/c)`: the physical field advanced by the
delay a fixed-angle plane wave accumulates along the periodic plane. In the frequency
domain (TorchFDTD's DFT kernel `exp(+i omega t)`)

    E(r, omega) = E~(r, omega) exp(+i omega k.r / c)

`torchfdtd.bfast.physical_field(fields, points_um, frequency_hz, k)` applies this factor to
a frequency-plane result. Power flux needs nothing: the phase cancels in `E x H*`, so
reflectance and transmittance come directly from the recorded flux.

## Update equations

With the transformed fields, Maxwell's equations become

    eps dE~/dt = curl H~ - (k/c) x dH~/dt
    mu  dH~/dt = -curl E~ + (k/c) x dE~/dt

The cross products are D and B increments, independent of the material, so they are
added to the curl before the permittivity, ADE, subpixel and PML steps see it. As in
Meep, an auxiliary array `Q` per family holds the cross product at the next integer (E)
or half (H) time level, `Q_new + Q_old = 2 k x avg(F)`, where `avg` is the two-point
average along each wavevector axis; the field receives `Q_new - Q_old`
([`torchfdtd/bfast.py`](../torchfdtd/bfast.py)). This time-centered (trapezoidal)
treatment is explicit and second order.

## Stability

A von Neumann analysis of this update in a medium of index `n` gives the Courant limit
`(n - |k|)/sqrt(D)`; the region applies `courant_factor * (1 - |k|)/sqrt(D)`, which holds in every
medium with `n >= 1`. Evaluated numerically (2D, 3D, `k` along one or two axes):

| `k` | medium | largest stable `S sqrt(D)` |
|---|---|---|
| 0.2, 0.5, 0.8 | vacuum | 0.80, 0.50, 0.20 |
| (0.3, 0.4) | vacuum | 0.50 |
| 0.5 | n = 1.5 | 1.00 |
| 1.2 | n = 1.5 | 0.30 |

Inside that limit the scheme conserves a quadratic energy, but that energy is not
positive: spurious grid modes near the temporal Nyquist rate (`omega dt` 1.2 to 2.5) carry
negative energy, and any mechanism that removes energy from them makes them grow.
A stretched-coordinate PML that sees the BFAST terms does exactly that (the one-step
operator of a 40-cell test grid has spectral radius 1.0087 at `k = 0.5`), and so would a
frequency-flat conductivity (1.04 per step for a loss of 1% per step). Dispersive (Lorentz,
Drude) losses are confined to low frequencies and do not excite the growth in practice.

TorchFDTD therefore keeps the wavevector out of the PML:

1. `k` falls to zero over `bfast_taper_cells` cells before each PML face (a `sin^2` ramp); the
   PML runs the plain Yee update, whose energy is positive.
2. In the ramp and the PML, the permittivity and permeability of the in-plane component normal
   to `k` lose `k0^2 (1 - w^2)` (divided by the normal permeability or permittivity), where `w` is
   the ramp weight. With `k` along x and the PML normal to y, the zeroth order has
   `E_z = (curl H)_z / (eps_zz - k^2/mu_yy)` and `H_z = -(curl E)_z / (mu_zz - k^2/eps_yy)`, so
   it keeps its wavenumber and impedance everywhere: the switch does not reflect it. The
   compensated medium is lossless, diagonal and stays inside the reduced time step.

Measured on the step operator and in runs:

| | spectral radius (40-60 cell test grid) | zeroth-order power reflection at the PML |
|---|---|---|
| `k` through the CPML | 1.0087 (`k` = 0.5) | - |
| `k` switched off, uncompensated, 0 / 20 / 40 cells | 1.00002 | 1e-3 / 1e-4 to 1e-3 / 1e-6 to 2e-4 |
| compensated switch (default) | 1 + 1e-5 (smaller on larger grids) | 1e-11 (30 degrees), 1e-9 (53 degrees) |

The remaining growth of about `1e-6` to `1e-5` per step belongs to a high transverse order
trapped between the two switches; its e-folding time is `1e5` steps or more, and the run's
divergence check stops a run that grows. `tests/test_bfast.py` runs 20000 steps with a PML
and requires the late fields to stay below `1e-4` of the peak.

## Accuracy

`tests/test_bfast.py` compares single BFAST runs with the analytic characteristic-matrix
reflectance and transmittance of a free-standing `n = 1.5` film (0.32 um, 1-2 um band) and
with a Bloch run of a grating at one frequency:

| case | mesh | largest error |
|---|---|---|
| film, 30 degrees, s | 0.04 um | T, R within 2.7e-3; R + T - 1 within 1e-4 |
| film, 50 degrees, p | 0.04 um | T, R within 3.3e-3 |
| film, 30 and 50 degrees, s and p | 0.02 um | T, R within 1e-3 |
| grating (period 0.8 um), 20 degrees, 1.7 um, against Bloch | 0.04 um | T within 5e-3; physical-field profile within 2% |

The remaining difference follows the mesh, as it does at normal incidence.

## Limitations

- **Trapped diffraction orders.** The compensation matches the zeroth order exactly. With a
  period `Lambda`, the first negative order is evanescent in the compensated PML medium but
  propagates in a background of index `n` for `Lambda sqrt(n^2 - k^2) <= wavelength < Lambda (n + |k|)`.
  It reflects at the switch, rings, and makes the spectrum unreliable in that band.
  `torchfdtd.bfast.trapped_band(region)` returns the band and `estimate()` warns when a source
  overlaps it. Subwavelength structures (`Lambda < wavelength/(n + |k|)`, only the zeroth order
  propagates) and thin films are unaffected; for diffractive gratings in that band use Bloch runs.
- **Execution paths.** The resident `Simulation` on the Torch/NumPy update implements BFAST, on
  the CPU and on CUDA with `cuda_kernel="torch"`. The fused CUDA kernel, tensor materials, the
  PMC endpoint solver, differentiable, reversible, streamed, tiled, batch and distributed paths
  refuse a region with `bfast_scaled_k` instead of ignoring it.
- **Structures in the taper and PML.** Nondispersive staircase structures (a substrate extending
  through the PML, for instance) are compensated sample by sample. Dispersive (ADE) samples and
  subpixel interface cells there keep their uncompensated medium and reflect part of the zeroth
  order; `estimate()` names such structures.
- **Sources.** Use soft sheets (the default `injection`). One-way and TFSF injection model normal
  incidence and are refused with BFAST.
- **Grazing angles.** `|k|` close to 1 shrinks the time step and slows the transformed waves;
  the run time grows as `1/(1 - |k|)`.
- The browser workbench has no controls for BFAST; set it from Python.
