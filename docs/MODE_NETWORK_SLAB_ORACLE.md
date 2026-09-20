# Independent slab S-matrix and mesh-dispersion check

One additional native run at 0.05 micrometre spacing was compared with two independent scalar normal-incidence oracles. This specific structure is uniform transversely and isotropic, so scalar E/H continuity is exact for the physical slab test. The oracle is not a substitute for the full-vector mode solver in general cross-sections.

The new driver is `benchmarks/mode_network_slab_oracle.py`. Its compact measurement record is `docs/validation/mode_network_slab_oracle_3060.json`. Two algebra-only tests in `tests/test_mode_network_slab_oracle.py` passed. There was exactly one new physical mesh run, with no new gradient solves or broad test reruns. The earlier 0.2 and 0.1 micrometre measurement record and the measured `mode_network.py` implementation were not changed.

## Fixed physical problem

The domain is 8 by 1 by 1 micrometres. Background epsilon is 2.25, with epsilon increased by 0.35 in `-0.2 <= x < 0.2` micrometre across the complete transverse cell. The material is sampled at each electric component's actual Yee coordinates. The wavelength is 1.55 micrometres and the Gaussian pulse uses two carrier cycles. Sources are at x = -2 and +2 micrometres, with port phase planes at -1 and +1 micrometres. Transverse boundaries are periodic.

The new grid is 160 by 20 by 20 with 2,400 steps. CPML has 20 cells on each end, preserving its 1 micrometre thickness. Physical duration is `2.2878898434e-13` seconds on all three meshes. The new run used FP32 on the local RTX3060 and took 9.29 seconds for the network invocation, including fresh matched-guide calibration for both columns. Recorded hashes cover the measured driver, runtime files, physical configuration, template project and prepared launch projects. The record also preserves the previous evidence file's SHA-256.

## Independent phase conventions

The continuum oracle solves four interface continuity equations for incident amplitude one, reflected amplitude r, forward/backward slab amplitudes, and transmitted interface amplitude t. It uses `exp(+i k x - i omega t)` and reduced magnetic admittance `Z0 H / E = n` for a forward wave. Port propagation factors are then applied explicitly:

```text
S21 = S12 = t_interface * exp(i k_background * total exterior distance)
S11 = r_interface * exp(2 i k_background * left-port-to-left-interface distance)
S22 = r_interface * exp(2 i k_background * right-interface-to-right-port distance)
```

Both exterior distances are 0.8 micrometre here. The continuum prediction is

```text
S21 = S12 = 0.9743348221 - 0.2221462205 i
S11 = S22 = 0.0080846058 + 0.0354591356 i
```

An independent closed Airy expression agrees with the four-equation solve to numerical roundoff. The no-contrast limit gives zero reflection and the expected background propagation phase. Lossless power conservation is also checked. These tiny scalar calculations use FP64 to isolate algebra from FP32 field accuracy.

The second oracle solves the exact one-dimensional harmonic Yee recurrence for the actual sampled transverse epsilon sequence:

```text
E[j+1] - (2 - epsilon[j] * kappa^2) E[j] + E[j-1] = 0
kappa = 2 sin(omega * dt / 2) / (c * dt / h)
```

Two-by-two transfer matrices propagate this recurrence across the changed samples. Background incoming/outgoing waves are evaluated at the same physical port planes. This includes temporal and longitudinal mesh dispersion without invoking the native FDTD, mode eigensolver, source profiles, or detector projection code.

The changed transverse E nodes start at -0.2 micrometre and end at `0.2-h`. Their discrete material sequence is symmetric about `-h/2`. Thus the sampled problem has different left/right reflection phases at symmetric port planes even though the intended continuum slab is centered at zero. The discrete oracle accounts for this actual sampling. No measured geometry, phase or interface location is adjusted to improve agreement with the continuum oracle.

## Measured results

| Mesh spacing, micrometres | Maximum complex S error versus continuum | Through-phase error, radians | Maximum complex S error versus discrete Yee oracle |
| --- | --- | --- | --- |
| 0.2 | 0.801494 | 0.823793 | 0.0191506 |
| 0.1 | 0.175864 | 0.176211 | 0.0000162507 |
| 0.05 | 0.0425798 | 0.0426114 | 0.0000010129 |

The new measured coefficients are

```text
S21 = S12 = 0.9829038978 - 0.1804375648 i
S11 = 0.0171320029 + 0.0323827080 i
S22 = -0.0045115612 + 0.0363564044 i
```

Through-amplitude error decreases by roughly a factor of four per mesh halving and agrees closely with the independently predicted discrete dispersion. The much larger 0.2-to-0.1 phase change is therefore explained by mesh dispersion, with no evidence of a through-phase sign or port-reference bug in this test. The coarse result has an additional error of about 0.019 relative to the exact discrete problem, whereas the finer two results reduce that error to about `1.6e-5` and `1.0e-6`. This check does not isolate the coarse residual into finite-time, source/calibration and CPML contributions.

Reflection error decreases more slowly because the discrete material sequence's half-cell offset shrinks with h. Left/right absolute reflection errors versus the continuum are respectively 0.03644/0.06217 at h = 0.2, 0.01614/0.02847 at h = 0.1, and 0.00956/0.01263 at h = 0.05. Their asymmetric phases are predicted by the discrete oracle rather than unexplained by reciprocity. Reciprocity constrains the through entries, not equality of reflection entries for the shifted sampled slab.

The new FP32 column-power calculation has maximum defect `1.79e-7`, near FP32 roundoff. Reconstructing power in FP64 from the saved FP32 complex entries gives column powers approximately 0.9999999323 and 0.9999999294. Small differences from the directly recorded power values are arithmetic precision effects. The historical records retain their original arithmetic and values.

The remaining continuum through-phase error is about 0.0426 radians and the largest complex S error is about 0.0426. Excellent power conservation therefore does not imply accurate continuum complex S parameters. These results establish a bounded dispersion/sampling explanation and an improving mesh trend, not a claim of completed convergence or general mode-port parity. No additional mesh run is planned as part of this bounded task.


## Remaining physical-gradient direction gate

A scalar-only followup checks the derivative of `L = Re(S21) + 0.3 Im(S12)` with respect to slab epsilon at epsilon = 2.6. The new driver is `benchmarks/mode_network_gradient_diagnostic.py`, and the compact record is `docs/validation/mode_network_gradient_diagnostic.json`. Previously measured oracle source and evidence files are unchanged. This followup ran no FDTD, native material VJP, GPU simulation, or new mesh.

Central epsilon steps were halved through `4e-5`, `2e-5`, `1e-5`, `5e-6`, and `2.5e-6`. The derivative range across those steps is below `3e-10` for every oracle. Thus the sign difference below is stable under scalar step halving, rather than an observed finite-difference step artifact. Representative values at central step `1e-5` are:

| Calculation | dL / d epsilon | Relative difference from continuum | Same sign as continuum |
| --- | --- | --- | --- |
| Continuum interface oracle | +0.253724791571 | Reference | Yes |
| Discrete oracle, h = 0.2 micrometre | -0.205112994373 | 180.84% | No |
| Discrete oracle, h = 0.1 micrometre | +0.179889839619 | 29.10% | Yes |
| Discrete oracle, h = 0.05 micrometre | +0.237239394901 | 6.50% | Yes |

The historically measured coarse native adjoint was `-0.2035041153`, with native central difference `-0.2034902424` at epsilon step 0.004. These values are quoted from the original physical test console output and the network documentation, not measured again. That original run did not record source hashes contemporaneously. The new diagnostic explicitly records this provenance rather than attributing later source bytes to it.

The coarse native adjoint agrees closely with its native finite difference and has the same sign as the coarse discrete oracle. Its magnitude differs from the exact discrete oracle by about 0.7844%. Nonetheless, its sign is opposite to the continuum physical derivative. Native finite-difference agreement is therefore insufficient to establish a physically useful optimization direction at that mesh.

For an illustrative minimization step, the coarse negative native derivative suggests increasing epsilon. An epsilon increase of 0.001 reduces the coarse discrete oracle objective by approximately 0.00020531 but increases the continuum oracle objective by approximately 0.00025359. This step was evaluated only in the scalar oracles. No new native optimization step was run.

The finer discrete oracles recover the continuum derivative sign and reduce its magnitude error. Their corresponding native material VJPs were not measured in that scalar-only diagnostic. It introduces no new acceptance threshold and does not change the previously declared coarse test thresholds.

### Native fine-mesh derivative follow-up

The subsequent driver `benchmarks/mode_network_gradient_refinement.py` executed exactly one native FP32 network forward/backward at each finer mesh on the RTX3060. The record is [mode_network_gradient_refinement_3060.json](validation/mode_network_gradient_refinement_3060.json). Previous measurements were retained. No extra FDTD finite-difference pair or unchanged test suite was run. The loss and physical setup match the scalar diagnostic, with the same fixed exterior modal basis and a single slab-permittivity parameter.

| Spacing, micrometres | Native dL / d epsilon | Relative error versus discrete oracle | Relative error versus continuum | Forward / backward, seconds |
| --- | --- | --- | --- | --- |
| 0.1 | +0.1798930913 | 0.00181% | 29.10% | 5.20 / 12.29 |
| 0.05 | +0.2372396886 | 0.000124% | 6.50% | 8.35 / 27.42 |

Both native derivatives now have the continuum sign. The independent exact discrete oracle separates adjoint implementation error from the larger physical discretization error. This resolves the sign check for this fixed slab parameter at the two finer meshes. The finest continuum magnitude discrepancy is still 6.50%, so no completed physical-convergence gate or general guided-mode/shape result is claimed. No native optimization step was executed.

Each active launch used four device checkpoint slots, with 7,947 and 19,492 replayed steps per direction on the 1,200- and 2,400-step meshes. The wrapper reconstructs one launch graph at a time. Peak Torch CUDA allocation was 20,937,728 and 41,240,576 bytes, respectively, including live input buffers. Reserved peaks were 25,165,824 and 62,914,560 bytes. These values exclude CUDA context, CuPy/module allocations and other processes, and are not total process VRAM measurements or beyond-VRAM evidence. Source hashes, configuration, prepared launch identities, reporting instrumentation and raw-source snapshot provenance are retained in the new record.

The later [25 nm acceptance](MODE_NETWORK_GRADIENT_ACCEPTANCE.md) is recorded separately. It passes its predeclared 2% derivative criterion and executes one actual descent step. The historical meshes and their discrepancies above remain unchanged.
