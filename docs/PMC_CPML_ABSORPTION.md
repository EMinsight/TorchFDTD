# Restricted endpoint CPML pulse absorption

The [recorded CPU gate](validation/pmc_cpml_absorption_cpu.json) passed its
predeclared limits of 1% reflected field amplitude and 0.1% reflected flux.
This tests the direct `EndpointCPMLSimulation` API with native-translated
coefficients. It does not validate native Project dispatch on the two-cell
transverse mesh, nor general absorption, mesh convergence or performance.

| Right CPML depth | Peak reflected field / incident peak | Returned flux / incident flux |
| --- | ---: | ---: |
| 6 cells | 0.0019915202 | 0.00000373113 |
| 12 cells | 0.0018412584 | 0.00000318060 |

Both residual fluxes point backward. Increasing depth gives a modest reduction
in this setup, which is insufficient to claim a convergence rate. All material
is isotropic epsilon one. The experiment uses one normal-incidence polarization.

## Fixed experiment and independent reference

The mesh spacing is 0.1 micrometre, `c*dt` is 0.05 micrometre, and the run lasts
240 steps (`c*T=12` micrometres). A sinusoidal Gaussian Ez increment has carrier
wavelength 1.6 micrometres, center `c*t=3` micrometres and envelope standard
deviation 0.65 micrometre. Its source plane is x=0 and the probe is x=1.

The y faces are PMC and the z faces PEC. Identical Ez kicks are applied to all
six admitted transverse Ez degrees of freedom: three y nodes times two z
half-cell positions. This creates the transverse-uniform Ez/Hy plane wave.
The left PEC endpoint is x=-8. Right CPML starts at x=3, and its thickness grows
outward from that fixed interface when depth changes from 6 to 12 cells.
Source, interface, mesh spacing, timestep and duration remain fixed.

The endpoint profile has kappa one, alpha zero and cubic grading. Native
`sigma_scale=0.3` translates to
`reflection=exp(-20*0.3*L/(L+1))` for depth L and background epsilon one.
This parameter defines the decay profile, not a promised reflection level.

A long-domain endpoint reference moves the right CPML interface to x=20.
Its source-to-boundary-to-probe path lies beyond the discrete stencil causal
cone during the recorded interval. An independent NumPy scalar Yee recurrence
with distant PEC endpoints checks that reference using

```text
Ez[i] += (c*dt/dx) * (Hy[i] - Hy[i-1])
Ez[source] += drive
Hy[i] += (c*dt/dx) * (Ez[i+1] - Ez[i])
```

The maximum relative discrepancy across the three recorded E/H samples is
3.33672e-7, below the predeclared 2e-5 limit. The incident flux integrals are
0.5845186575 from the endpoint reference and 0.5845186627 from the independent
recurrence, in reduced-field units integrated over `c*t`.

Reflection is the candidate-minus-long-reference field in `c*t=[6,12]`.
The incident normalization uses `c*t<6`. Flux is `-Ez*Hy`, with Hy averaged
between the two neighboring x half-cell samples and then between consecutive
magnetic half timesteps to align with Ez. Returned flux uses the residual E
and H together, avoiding incident/reflected cross terms. Ratios are unchanged
by the common physical unit factors. This is a discrete sampled pulse-flux
measure, not a broadband frequency-resolved reflectance guarantee.

## Reproduction and provenance

From a source checkout:

```console
python benchmarks/pmc_cpml_absorption.py --output-dir results/new-absorption-run
```

The destination must not exist. The launcher writes its contract, raw traces
and result before returning a nonzero exit status on failed acceptance.
The published launcher was not rerun solely for changing output paths and
adding this CLI. The validation JSON records both measured and published
driver hashes and an exact matching numerical-body hash covering setup,
recurrences, metrics and acceptance expressions.

The measured runtime revision is
`d942f2f4818b0d9845ec22d3b91c41c01e875854`. Exact runtime SHA256 hashes are in
the validation record, and matched before and after execution. The endpoint
solver used CPU FP32, while the independent oracle and metric accumulation
used NumPy FP64. No GPU was used.

The first run failed overall because the independent oracle used the wrong
sign for the electric update. Its driver, failure result and traces remain
preserved. Correcting only that oracle sign produced the reported passing run.
The contract, thresholds and native candidate results were unchanged. Neither
the first failure nor the correction is represented as a runtime physics fix.
