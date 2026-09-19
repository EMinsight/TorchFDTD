## Current spectral throughput and optimization ablations

**NVIDIA RTX 5880 Ada Generation, 8 independent cases per row, 800 float32 steps, cohorts of 4, median of 3 warmed repetitions.** Three planes retain all six complex components at nine frequencies, with point traces and full final E/H. Full wall includes preparation, graph capture and output transfer. Cold context/compilation and disk writes are excluded.

The current fused monitor adds one shared CUDA phase kernel. The external **flaport/fdtd 0.2.2** sequence receives the identical observer and both one-step and 8-step graph options. The external column uses the **lower measured median** of those two options. PhotonWeave uses a fixed one-step graph and shared case launches. This compares ensemble workflows, not an upstream fused-batch implementation.

| Workload | Grid | flaport + shared observer, sequence (s) | PhotonWeave batch (s) | vs flaport sequence |
|---|---:|---:|---:|---:|
| Vacuum | 32³ | 3.371 | 0.179 | 18.86× |
| Sphere | 32³ | 3.409 | 0.198 | 17.25× |
| Slab | 32³ | 3.613 | 0.171 | 21.11× |
| Waveguide | 32³ | 3.301 | 0.154 | 21.44× |
| Vacuum | 64³ | 4.026 | 0.396 | 10.17× |
| Sphere | 64³ | 4.324 | 0.382 | 11.32× |
| Slab | 64³ | 4.107 | 0.416 | 9.87× |
| Waveguide | 64³ | 4.147 | 0.390 | 10.63× |

Optimization effects are measured separately. Ratios below one are retained slowdowns:

| Workload | Grid | CUDA phase gain, full wall / loop | 8-step graph gain, full wall / loop | Batch cases/s |
|---|---:|---:|---:|---:|
| Vacuum | 32³ | 1.03× / 1.19× | 1.01× / 1.03× | 44.76 |
| Sphere | 32³ | 1.03× / 1.18× | 0.96× / 1.04× | 40.47 |
| Slab | 32³ | 0.95× / 1.16× | 1.02× / 1.04× | 46.75 |
| Waveguide | 32³ | 1.06× / 1.19× | 0.99× / 1.03× | 51.97 |
| Vacuum | 64³ | 0.94× / 1.06× | 1.09× / 1.02× | 20.21 |
| Sphere | 64³ | 1.03× / 1.08× | 0.99× / 0.98× | 20.93 |
| Slab | 64³ | 1.04× / 1.13× | 0.96× / 0.93× | 19.22 |
| Waveguide | 64³ | 0.99× / 1.08× | 1.01× / 1.00× | 20.51 |

**Accuracy gates: passed throughout.** With the current phase kernel, native single/batch/unrolled complete output arrays match bitwise. The previous phase expression differs by at most 3.42e-08 in complete complex DFT relative L2 (gate: 3e-6). The maximum external complex DFT difference is 0.3875% (gate: 1%). External unrolling matches its own original graph outputs bitwise. Cross-library final fields remain different.

`cuda_graph_steps=8` is optional in single runs, tensor batches, tuning and tensor design. Every physical step and requested output is retained. Snapshot, diagnostic and callback steps are exact barriers. Additional capture cost can erase loop savings, so the default remains one. Cancellation is polled between replays. This adds no adjoint. **FDTDX, fdtdz and fdtd3d remain unmeasured on this GPU.**

[Algorithm and Python controls](../CUDA_SPECTRA.md), [all timings, setup costs and memory](../validation/GRAPH_ENSEMBLE_REPORT.md), [raw input/settings/checks](../validation/graph-ensembles.json).

## Every execution mode

| Workload | Grid | Mode | Full wall (s) | Setup (s) | Loop (s) | Torch allocated / reserved (MiB) | Full wall repetitions (s) |
|---|---:|---|---:|---:|---:|---:|---|
| vacuum | 32³ | flaport_1 | 3.370994 | 0.420104 | 2.944375 | 34.54 / 40.00 | 3.661608, 3.370994, 3.297671 |
| vacuum | 32³ | flaport_8 | 3.734898 | 0.742352 | 2.961313 | 34.54 / 42.00 | 3.983094, 3.734898, 3.712610 |
| vacuum | 32³ | sequential_1 | 0.256775 | 0.131408 | 0.103040 | 2.66 / 10.00 | 0.256775, 0.296562, 0.246983 |
| vacuum | 32³ | sequential_8 | 0.292456 | 0.158774 | 0.096961 | 2.66 / 12.00 | 0.292456, 0.329186, 0.257414 |
| vacuum | 32³ | batch_1 | 0.178738 | 0.120201 | 0.038631 | 10.61 / 14.00 | 0.178738, 0.199997, 0.151976 |
| vacuum | 32³ | batch_8 | 0.177534 | 0.121474 | 0.037392 | 10.61 / 14.00 | 0.177534, 0.197714, 0.154563 |
| vacuum | 32³ | batch_torch_phase | 0.184927 | 0.119583 | 0.045837 | 10.61 / 18.00 | 0.184927, 0.194186, 0.160816 |
| sphere | 32³ | flaport_1 | 3.409016 | 0.437208 | 2.957728 | 34.54 / 40.00 | 3.293058, 3.656850, 3.409016 |
| sphere | 32³ | flaport_8 | 3.732702 | 0.747334 | 2.960825 | 34.54 / 42.00 | 3.682460, 4.022138, 3.732702 |
| sphere | 32³ | sequential_1 | 0.261702 | 0.136106 | 0.101455 | 2.66 / 10.00 | 0.258159, 0.339373, 0.261702 |
| sphere | 32³ | sequential_8 | 0.301944 | 0.178829 | 0.097529 | 2.66 / 12.00 | 0.301944, 0.366208, 0.277670 |
| sphere | 32³ | batch_1 | 0.197677 | 0.138384 | 0.038942 | 10.61 / 14.00 | 0.197677, 0.226673, 0.178519 |
| sphere | 32³ | batch_8 | 0.205707 | 0.145048 | 0.037621 | 10.61 / 14.00 | 0.205707, 0.223515, 0.179482 |
| sphere | 32³ | batch_torch_phase | 0.203595 | 0.137892 | 0.046061 | 10.61 / 18.00 | 0.203595, 0.213760, 0.187080 |
| slab | 32³ | flaport_1 | 3.612648 | 0.595380 | 3.003467 | 34.54 / 40.00 | 3.428552, 3.612648, 3.659563 |
| slab | 32³ | flaport_8 | 3.654971 | 0.651551 | 2.975393 | 34.54 / 42.00 | 3.634823, 3.654971, 3.977246 |
| slab | 32³ | sequential_1 | 0.266319 | 0.124949 | 0.104668 | 2.66 / 10.00 | 0.248016, 0.271669, 0.266319 |
| slab | 32³ | sequential_8 | 0.301957 | 0.138605 | 0.097774 | 2.66 / 12.00 | 0.259612, 0.301957, 0.303036 |
| slab | 32³ | batch_1 | 0.171134 | 0.097382 | 0.039390 | 10.61 / 14.00 | 0.153678, 0.171134, 0.196128 |
| slab | 32³ | batch_8 | 0.167693 | 0.100045 | 0.037769 | 10.61 / 14.00 | 0.155762, 0.167693, 0.204349 |
| slab | 32³ | batch_torch_phase | 0.163257 | 0.099445 | 0.045834 | 10.61 / 18.00 | 0.163257, 0.163072, 0.204639 |
| waveguide | 32³ | flaport_1 | 3.301387 | 0.332951 | 2.955198 | 34.54 / 40.00 | 3.380320, 3.301387, 3.299498 |
| waveguide | 32³ | flaport_8 | 3.653516 | 0.644583 | 2.967521 | 34.54 / 42.00 | 3.752169, 3.653516, 3.630319 |
| waveguide | 32³ | sequential_1 | 0.249507 | 0.125559 | 0.101394 | 2.66 / 10.00 | 0.249507, 0.276149, 0.247682 |
| waveguide | 32³ | sequential_8 | 0.260579 | 0.139046 | 0.097322 | 2.66 / 12.00 | 0.260579, 0.301457, 0.259647 |
| waveguide | 32³ | batch_1 | 0.153950 | 0.096902 | 0.038482 | 10.61 / 14.00 | 0.153950, 0.168594, 0.153913 |
| waveguide | 32³ | batch_8 | 0.155141 | 0.099319 | 0.037442 | 10.61 / 14.00 | 0.154529, 0.169060, 0.155141 |
| waveguide | 32³ | batch_torch_phase | 0.162873 | 0.098831 | 0.045906 | 10.61 / 18.00 | 0.163106, 0.162303, 0.162873 |
| vacuum | 64³ | flaport_1 | 4.025607 | 0.423580 | 3.562549 | 273.06 / 350.00 | 4.071682, 4.025607, 4.006266 |
| vacuum | 64³ | flaport_8 | 4.483751 | 0.857459 | 3.571852 | 273.06 / 372.00 | 4.483751, 4.367157, 4.607024 |
| vacuum | 64³ | sequential_1 | 0.408172 | 0.181177 | 0.159778 | 17.92 / 32.00 | 0.408172, 0.405505, 0.456879 |
| vacuum | 64³ | sequential_8 | 0.420434 | 0.193919 | 0.156725 | 17.92 / 34.00 | 0.416402, 0.420434, 0.471636 |
| vacuum | 64³ | batch_1 | 0.395809 | 0.192712 | 0.141408 | 71.63 / 86.00 | 0.368987, 0.395809, 0.406687 |
| vacuum | 64³ | batch_8 | 0.361842 | 0.156359 | 0.138575 | 71.63 / 86.00 | 0.358176, 0.361842, 0.412289 |
| vacuum | 64³ | batch_torch_phase | 0.370572 | 0.156211 | 0.149971 | 71.63 / 90.00 | 0.370572, 0.368946, 0.415564 |
| sphere | 64³ | flaport_1 | 4.324456 | 0.714665 | 3.567743 | 273.06 / 350.00 | 4.094611, 4.325016, 4.324456 |
| sphere | 64³ | flaport_8 | 4.605982 | 0.963740 | 3.577395 | 273.06 / 372.00 | 4.396845, 4.605982, 4.617975 |
| sphere | 64³ | sequential_1 | 0.433684 | 0.205192 | 0.160172 | 17.92 / 32.00 | 0.433684, 0.432176, 0.455853 |
| sphere | 64³ | sequential_8 | 0.443783 | 0.217084 | 0.157121 | 17.92 / 34.00 | 0.442680, 0.443783, 0.471345 |
| sphere | 64³ | batch_1 | 0.382149 | 0.176933 | 0.139501 | 71.63 / 86.00 | 0.382149, 0.380970, 0.404275 |
| sphere | 64³ | batch_8 | 0.384862 | 0.179691 | 0.141785 | 71.63 / 86.00 | 0.380409, 0.384862, 0.408195 |
| sphere | 64³ | batch_torch_phase | 0.394968 | 0.181411 | 0.150734 | 71.63 / 90.00 | 0.394968, 0.392683, 0.404809 |
| slab | 64³ | flaport_1 | 4.106862 | 0.497129 | 3.569787 | 273.06 / 350.00 | 4.087617, 4.163278, 4.106862 |
| slab | 64³ | flaport_8 | 4.491940 | 0.859526 | 3.583422 | 273.06 / 372.00 | 4.418673, 4.521556, 4.491940 |
| slab | 64³ | sequential_1 | 0.419245 | 0.190946 | 0.160135 | 17.92 / 32.00 | 0.412264, 0.505812, 0.419245 |
| slab | 64³ | sequential_8 | 0.443481 | 0.215671 | 0.156945 | 17.92 / 34.00 | 0.443481, 0.538605, 0.422292 |
| slab | 64³ | batch_1 | 0.416145 | 0.200166 | 0.145556 | 71.63 / 86.00 | 0.416145, 0.472757, 0.362014 |
| slab | 64³ | batch_8 | 0.431515 | 0.206197 | 0.155822 | 71.63 / 86.00 | 0.431515, 0.469980, 0.371694 |
| slab | 64³ | batch_torch_phase | 0.433587 | 0.202462 | 0.164864 | 71.63 / 90.00 | 0.433587, 0.433994, 0.370594 |
| waveguide | 64³ | flaport_1 | 4.147124 | 0.535827 | 3.573228 | 273.06 / 350.00 | 4.312655, 4.033631, 4.147124 |
| waveguide | 64³ | flaport_8 | 4.496785 | 0.835495 | 3.583298 | 273.06 / 372.00 | 4.652097, 4.496785, 4.352348 |
| waveguide | 64³ | sequential_1 | 0.458720 | 0.208364 | 0.160690 | 17.92 / 32.00 | 0.458720, 0.460032, 0.411473 |
| waveguide | 64³ | sequential_8 | 0.467455 | 0.223379 | 0.158176 | 17.92 / 34.00 | 0.479164, 0.467455, 0.425273 |
| waveguide | 64³ | batch_1 | 0.390117 | 0.182901 | 0.143208 | 71.63 / 86.00 | 0.413961, 0.390117, 0.362461 |
| waveguide | 64³ | batch_8 | 0.385011 | 0.184916 | 0.143433 | 71.63 / 86.00 | 0.408741, 0.385011, 0.364967 |
| waveguide | 64³ | batch_torch_phase | 0.387853 | 0.171195 | 0.154342 | 71.63 / 90.00 | 0.405781, 0.387853, 0.375066 |

Torch allocated/reserved metrics exclude driver, CUDA context and graph-executable allocations outside the Torch allocator. They are not total process GPU memory. One warmup precedes alternating measured order. Three samples do not establish confidence intervals. The older phase ablation changes only phase evaluation, retaining fused plane sampling and accumulation. All inputs are independently authored native projects. Source hashes identify this measured implementation.

## Reproduce

```bash
python -m benchmarks.graph_ensembles --sizes 32 64 --count 8 --cohort 4 --steps 800 --repeats 3
python -m benchmarks.report_graph_ensembles
python -m pytest tests/test_cuda_graph_steps.py tests/test_cuda_monitors.py
```
