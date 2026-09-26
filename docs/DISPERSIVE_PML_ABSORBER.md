# Dispersive media crossing the absorbing layer

Record: `docs/validation/dispersive_pml_absorber.json` (case `docs/validation/cases/DISPERSIVE_PML_ABSORBER.json`, declared at commit 639d3ff431bd). Driver `benchmarks/dispersive_pml_absorber.py`. Every number below is copied from the record; nothing here is typed by hand. The absorber and the measured mechanism are described in [BOUNDARIES.md](BOUNDARIES.md#dispersive-materials-inside-pml).

Environment: Python 3.10.2, torch 2.10.0+cu126 (CUDA 12.6), GPU None, Windows-10-10.0.26200-SP0; run at 2026-09-26T01:30:29+00:00 on commit 030581a7759aa520c199e18b5f839e1dbc667227 with 0 dirty paths; rows merged from 2 later run(s) on commit(s) 030581a7759a.

Verdict: every judged row passes (14 judged rows, 37 recorded rows).

## Reflection

G3-07 power ratio |DFT(short - long)|^2 / |DFT(long)|^2 at each monitor, maximum over 21 frequencies of the band, and the time-domain energy ratio of the difference trace. `fill`: the medium fills the periodic cell and crosses the layers everywhere; `half`: the G3-07 half space, monitors 0.5 um on the vacuum side and on the medium side of the interface. `cpml` rows use `pml_dispersion='ade'` with the same depth.

| row | medium | fill | pol | layer | layers | angle (deg) | R max on band (per monitor) | R broadband (per monitor) | limit | verdict |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | ---: | --- |
| reflection-dilute-fill-TE-absorber | dilute | full | TE | absorber | 40 | 0 | m 6.35e-14 | m 2.94e-14 | 1e-06 | pass |
| reflection-dilute-fill-TE-cpml | dilute | full | TE | cpml | 40 | 0 | m 4.93e-14 | m 2.5e-14 | n/a | recorded |
| reflection-sin-fill-TE-absorber | sin | full | TE | absorber | 40 | 0 | m 1.64e-08 | m 7.48e-09 | 1e-06 | pass |
| reflection-sin-fill-TE-cpml | sin | full | TE | cpml | 40 | 0 | m 5.62e-14 | m 5.4e-14 | n/a | recorded |
| reflection-sin-fill-TM-absorber | sin | full | TM | absorber | 40 | 0 | m 1.64e-08 | m 7.47e-09 | 1e-06 | pass |
| reflection-sin-fill-TM-cpml | sin | full | TM | cpml | 40 | 0 | m 5.62e-14 | m 5.4e-14 | n/a | recorded |
| reflection-drude_dielectric-fill-TE-absorber | drude_dielectric | full | TE | absorber | 40 | 0 | m 5.04e-05 | m 3.07e-05 | n/a | recorded |
| reflection-drude_dielectric-fill-TE-cpml | drude_dielectric | full | TE | cpml | 40 | 0 | m 4.46e-14 | m 3.86e-14 | n/a | recorded |
| reflection-drude-half-TE-absorber | drude | half | TE | absorber | 40 | 0 | vacuum side 0.0272; medium side 0.0301 | vacuum side 0.0181; medium side 0.0183 | n/a | recorded |
| reflection-drude-half-TE-absorber-L80 | drude | half | TE | absorber | 80 | 0 | vacuum side 0.0092; medium side 0.00947 | vacuum side 0.00637; medium side 0.00614 | n/a | recorded |
| reflection-drude-half-TE-cpml | drude | half | TE | cpml | 40 | 0 | vacuum side 3.53e-09; medium side 3.74e-09 | vacuum side 6.52e-08; medium side 6.67e-08 | n/a | recorded |
| reflection-drude-half-TM-absorber | drude | half | TM | absorber | 40 | 0 | vacuum side 0.0899; medium side 0.107 | vacuum side 0.0491; medium side 0.0485 | n/a | recorded |
| reflection-drude-half-TM-absorber-L80 | drude | half | TM | absorber | 80 | 0 | vacuum side 0.0313; medium side 0.035 | vacuum side 0.0168; medium side 0.0155 | n/a | recorded |
| reflection-drude-half-TM-cpml | drude | half | TM | cpml | 40 | 0 | vacuum side 1.33e-07; medium side 4.41e-07 | vacuum side 5.36e-09; medium side 9.7e-09 | n/a | recorded |
| reflection-sin-half-TE-absorber | sin | half | TE | absorber | 40 | 0 | vacuum side 0.868; medium side 0.193 | vacuum side 0.205; medium side 0.0288 | n/a | recorded |
| reflection-sin-half-TE-absorber-L80 | sin | half | TE | absorber | 80 | 0 | vacuum side 0.607; medium side 0.148 | vacuum side 0.114; medium side 0.0173 | n/a | recorded |
| reflection-sin-half-TE-cpml | sin | half | TE | cpml | 40 | 0 | vacuum side 6.76e-06; medium side 1.42e-06 | vacuum side 6.78e-07; medium side 1.46e-07 | n/a | recorded |
| reflection-sin-half-TM-absorber | sin | half | TM | absorber | 40 | 0 | vacuum side 1.2; medium side 0.0155 | vacuum side 0.03; medium side 0.00406 | n/a | recorded |
| reflection-sin-half-TM-absorber-L80 | sin | half | TM | absorber | 80 | 0 | vacuum side 0.448; medium side 0.00534 | vacuum side 0.00924; medium side 0.00149 | n/a | recorded |
| reflection-sin-half-TM-cpml | sin | half | TM | cpml | 40 | 0 | vacuum side 3e-07; medium side 4.17e-09 | vacuum side 1.05e-08; medium side 2.13e-09 | n/a | recorded |
| reflection-dilute-fill-TE-30deg-absorber | dilute | full | TE | absorber | 40 | 30 | m 0.00749 | m 0.0047 | n/a | recorded |
| reflection-dilute-fill-TE-30deg-cpml | dilute | full | TE | cpml | 40 | 30 | m 1.12e-14 | m 1.31e-14 | n/a | recorded |
| reflection-dilute-fill-TE-60deg-absorber | dilute | full | TE | absorber | 40 | 60 | m 0.173 | m 0.089 | n/a | recorded |
| reflection-dilute-fill-TE-60deg-cpml | dilute | full | TE | cpml | 40 | 60 | m 8.56e-09 | m 2.03e-09 | n/a | recorded |

## Long-time stability

Run-control state norm and interior energy every 250 steps. `last/peak` and `late growth` follow G3-07 (overall peak; maximum of the second half over the half-way sample, floored at 1e-12 of the peak); `growth` and `last/post-source peak` follow the stability sweep for the state norm and the interior energy. The CPML controls must diverge.

| row | fixture | medium | layer | execution | cells | steps | last/peak | late growth | growth (norm; interior) | last/post-source peak (norm; interior) | error | verdict |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| stability-sin-post-cpml-cpu-float64 | corner_post | sin | cpml | cpu float64 torch | 180000 | 4000 | 1 | 1e+12 | 1e+12; 1e+12 | 1e+12; 1e+12 |  | pass |
| stability-sin-post-absorber-cpu-float64 | corner_post | sin | absorber | cpu float64 torch | 180000 | 20000 | 2.42e-19 | 1.8e-06 | 4.22e-06; 6.4e-07 | 2.42e-07; 4.04e-08 |  | pass |
| stability-sin-post-absorber-cuda-float32 | corner_post | sin | absorber | cuda float32 fused | 180000 | 20000 | 8.23e-14 | 0.0823 | 0.0823; 0.0825 | 0.0823; 0.0825 |  | pass |
| stability-drude-post-cpml-cpu-float64 | corner_post | drude | cpml | cpu float64 torch | 180000 | 4000 | 1 | 1e+12 | 1e+12; 1e+12 | 1e+12; 1e+12 |  | pass |
| stability-drude-post-absorber-cpu-float64 | corner_post | drude | absorber | cpu float64 torch | 180000 | 20000 | 2.42e-19 | 1.8e-06 | 4.22e-06; 6.4e-07 | 2.42e-07; 4.04e-08 |  | pass |
| stability-drude-post-absorber-cuda-float32 | corner_post | drude | absorber | cuda float32 fused | 180000 | 20000 | 8.62e-14 | 0.0862 | 0.0862; 0.0865 | 0.0862; 0.0864 |  | pass |
| stability-sin-post-absorber-cuda-float32-torch | corner_post | sin | absorber | cuda float32 torch | 180000 | 20000 | 1.07e-13 | 0.107 | 0.107; 0.108 | 0.107; 0.108 |  | pass |
| stability-sin-post-absorber-tensor-batch-float32 | corner_post | sin | absorber | cuda float32 tensor_batch | 180000 | 20000 | 8.23e-14 | 0.0823 | 0.0823; 0.0825 | 0.0823; 0.0825 |  | pass |
| stability-sin-post-cpml-cuda-float32 | corner_post | sin | cpml | cuda float32 fused | 180000 | 4000 | 1 | 1e+12 | 1e+12; 1e+12 | 1e+12; 1e+12 |  | pass |
| stability-sin-array-cpml-cuda-float32 | pillar_array | sin | cpml | cuda float32 fused | 6300000 | 4000 | 1 | 1e+12 | 1e+12; 1e+12 | 1e+12; 1e+12 |  | pass |
| stability-sin-array-absorber-cuda-float32 | pillar_array | sin | absorber | cuda float32 fused | 6300000 | 20000 | 1.47e-08 | 1 | 0.00192; 0.00177 | 1.09e-06; 1.51e-06 |  | pass |

## Growth with the CPML

Least-squares rate of ln(state norm) over the second half of the samples, the amplitude rate per second, the dominant frequency of the monitor trace there and the bilinear permittivity of the medium at that frequency (growing rows only). The mechanism rows vary one parameter of the SiN corner post at a time, or the form of the structure (with the CPML and with the absorber).

| row | variation | energy rate per step | amplitude rate (1/s) | frequency (rad/s) | bilinear eps | last state norm / peak |
| --- | --- | ---: | ---: | ---: | --- | ---: |
| mechanism-interior-cpml-cpu-float64 | {"inside": true} | -0.0016 | -2.09e+13 | n/a | n/a | 2.8e-14 |
| mechanism-dielectric-cpml-cpu-float64 | {"material": "dielectric"} | -0.000451 | -5.91e+12 | n/a | n/a | 3.91e-17 |
| mechanism-depth10-cpml-cpu-float64 | {"depth": 0.2} | -0.000443 | -5.81e+12 | n/a | n/a | 4e-17 |
| mechanism-depth3-cpml-cpu-float64 | {"depth": 0.06} | 0.0946 | 1.24e+15 | 2.32e+16 | -0.406 + 0.00167i | 1 |
| mechanism-sigma025-cpml-cpu-float64 | {"face": {"sigma_scale": 0.25}} | 0.0148 | 1.95e+14 | 2.22e+16 | -0.612 + 0.00209i | 1 |
| mechanism-cfs-alpha02-cpml-cpu-float64 | {"face": {"alpha": 0.2, "alpha_polynomial": 1}} | 0.054 | 7.08e+14 | 2.27e+16 | -0.513 + 0.00188i | 1 |
| mechanism-kappa4-cpml-cpu-float64 | {"face": {"kappa": 4}} | 0.0331 | 4.34e+14 | 2.34e+16 | -0.357 + 0.00157i | 1 |
| mechanism-linewidth1e14-cpml-cpu-float64 | {"linewidth": 100000000000000.0} | 0.0527 | 6.9e+14 | 2.24e+16 | -0.571 + 0.02i | 1 |
| mechanism-linewidth1e15-cpml-cpu-float64 | {"linewidth": 1000000000000000.0} | 0.0079 | 1.04e+14 | 2.2e+16 | -0.647 + 0.219i | 8.3e-10 |
| mechanism-mesh10nm-cpml-cuda-float64 | {"layers": 24, "mesh": 0.01, "sample": 500} | 0.0396 | 1.04e+15 | 1.66e+16 | -6.1 + 0.0286i | 1 |
| mechanism-enter-post-cpml-cpu-float64 | {"form": "enter", "size": [0.9, 0.9, 1.0]} | 0.1 | 1.31e+15 | 2.4e+16 | -0.252 + 0.00138i | 1 |
| mechanism-enter-post-absorber-cpu-float64 | {"form": "enter", "size": [0.9, 0.9, 1.0]} | -3.15e-05 | -4.13e+11 | n/a | n/a | 2.91e-17 |
| mechanism-enter-film-cpml-cpu-float64 | {"form": "film", "size": [0.9, 0.9, 1.0]} | 0.0764 | 1e+15 | 2.47e+16 | -0.135 + 0.00117i | 1 |
| mechanism-enter-film-absorber-cpu-float64 | {"form": "film", "size": [0.9, 0.9, 1.0]} | -0.000338 | -4.43e+12 | n/a | n/a | 2.66e-17 |
| mechanism-drude-bar-cpml-cpu-float64 | {"form": "bar", "size": [0.9, 0.9, 1.0]} | 0.00114 | 1.49e+13 | 1.18e+15 | -1.85 + 0.241i | 1.59e-08 |
| mechanism-drude-bar-absorber-cpu-float64 | {"form": "bar", "size": [0.9, 0.9, 1.0]} | -0.00239 | -3.13e+13 | n/a | n/a | 6.84e-24 |
| stability-sin-post-cpml-cpu-float64 | control | 0.0573 | 7.52e+14 | 2.26e+16 | -0.532 + 0.00192i | 1 |
| stability-drude-post-cpml-cpu-float64 | control | 0.0287 | 3.77e+14 | 1.73e+15 | -0.331 + 0.0769i | 1 |
| stability-sin-post-cpml-cuda-float32 | control | 0.0573 | 7.52e+14 | 2.26e+16 | -0.532 + 0.00192i | 1 |
| stability-sin-array-cpml-cuda-float32 | control | 0.0574 | 7.53e+14 | 2.26e+16 | -0.532 + 0.00192i | 1 |

## Limits of this record

- Stability is empirical non-growth over 20,000 steps on these fixtures, not a spectral proof; the general argument is that the absorber is a passive medium (non-negative E and H conductivity, trapezoidal in time, solved together with the passive ADE)
- Reflection is measured in 2D at normal incidence (and at 30 and 60 deg in vacuum) on a 25 nm mesh at 1.3 to 1.8 um; in the continuum the matched absorber is reflectionless only for a homogeneous medium at normal incidence, and a transverse interface that crosses the layer reflects at every depth the model admits (the half-space rows)
- The E loss of a pole cell is matched to the real permittivity at the source centre, so a homogeneous dispersive fill reflects more away from that frequency; the fill rows measure it over 1.3 to 1.8 um
- CUDA rows run on the shared RTX 3060; the 6 um pillar array runs in float32 only
- The mechanism rows vary one parameter of one fixture at a time; they locate the growth, they do not map where the CPML is unstable
