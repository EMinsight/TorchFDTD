# Four-workload ensembles and complete design loops

This follow-up uses independently authored native projects on the RTX 5880 Ada,
Windows, float32 and 800 fixed time steps. The [measurement tables](../MEASUREMENTS.md#four-workloads-with-16-independent-cases-each)
are generated from [all ensemble samples](ensembles.json) and
[all design histories](design-throughput.json). It extends the earlier
[external comparison](OPEN_SOURCE_REPORT.md), whose boundary caveats still apply.

## Workloads and equal work

Each of the eight ensemble settings has 16 cases on either 32³ or 64³ cells.
The domain, source and point-monitor definitions are inherited from the original
four forward fixtures. The parameter sequences for case index i = 0,...,15 are:

| Fixture | Parameter |
|---|---|
| Vacuum | Source amplitude 0.5 + 0.05i |
| Sphere | Radius 0.35 + 0.02i µm |
| Slab | Thickness 0.2 + 0.02i µm |
| Waveguide | Width 0.4 + 0.025i µm, height 0.4 µm |

The vacuum ensemble varies excitation rather than geometry. All material and
source arrays, boundary settings, precision, timestep, duration and requested
point outputs match between implementations within each row. Different grid
sizes have different timesteps, so these are not mesh-convergence studies.
The slab and guide are driven by point sources, not eigenmodes or plane waves.

The external baseline is the installed flaport/fdtd 0.2.2 with our CUDA Graph
adapter calling unmodified upstream updates. It solves the ensemble sequentially.
Its absence of a measured shared-launch adapter is not evidence that an optimized
upstream ensemble implementation is impossible. These ratios compare complete
workflows, not the speed of a single CUDA kernel. The initial eight single-case
measurements remain separate in the README.

## Timing and validation

Each mode receives a warmup and three timed repetitions in alternating order.
Full wall time includes geometry construction, state allocation, CUDA graph
preparation, source and trace recording, stepping, final E/H transfers and the
scalar trace-peak objective. Context/interpreter startup, first compilation and
disk output are excluded. Output accuracy checks run after the timed interval.
The independent native result is the reference for every native cohort. SHA-256
digests cover the complete E/H arrays and point traces, not selected pixels.

Every external point trace must satisfy the predeclared 1% relative-L2 agreement
gate. The record also retains final E/H differences, maximum absolute errors and
reference peaks. The PML interface stencils differ. No final-field equivalence,
modal transmission, resonator Q or analytic-accuracy claim follows from a passing
point trace. This is forward performance evidence, not an adjoint benchmark.

All sample timings are retained. Three repetitions do not establish confidence
intervals. Host scheduling, WDDM and device operating conditions can cause large
variation. A before-change sphere record is retained as
[ensemble-before.json](ensemble-before.json). It was collected separately and
does not isolate the effect of the host scheduling code change. No speed claim
for that change is made from an unpaired before/after comparison.

## Measured cohort selection

`tune_tensor_batch` tries sizes 1, 2, 4, 8 and 16 on the actual ensemble. Each size
has one warmup and three measured trials. The complete original simulation is
executed, including full results. It does not truncate the pulse or reduce output
requirements to make a candidate appear faster. Its output check additionally
covers snapshots, times, permittivity and frequency-plane fields. User objectives
and disk saves are excluded from selection, which can affect the best size when
those costs are substantial.

The lowest trial median selects the size. The later `tuned` timings in the
ensemble benchmark are new runs, not the selection samples. Fixed sizes 4 and 16
remain in the raw records even when they outperform selection. A size selected
under one timing sample is not guaranteed to win later. The README discloses
the complete tuning cost and the number of repeated identical ensembles needed
to repay it relative to the later native sequential median, assuming a stable
saving. This number is an amortization estimate, not a future timing measurement.
There is no break-even when the later selected mode is slower than sequential.

Torch peak allocation is recorded per trial and solve. It excludes CUDA context,
driver allocations and CPU result arrays. Cohorts limit device state, while
retaining all results can still use substantial host memory. The tuner resets
Torch's peak counters and should run on an otherwise idle device.

The remote editable installation still reported package metadata version 0.8.0
during these measurements, although the synchronized working source was the
0.13 development follow-up. That observed metadata is preserved in the JSON.
The recorded source hashes identify the measured implementation, including the
updated tensor executor. Installed distribution metadata was refreshed after
measurement. It is not a benchmark of the earlier 0.8 source tree.

## Complete inverse-design measurement

The design test runs seeded DE/rand/1/bin with population 16 and three trial
generations after initialization. Every measured loop evaluates 64 complete
FDTD projects. It maximizes the integrated squared point-field trace by varying
sphere radius in [0.25, 0.75] µm. Independent native execution and CUDA population
execution must produce identical complete histories, objective values and final
parameters. These are small black-box optimization examples. They neither prove
a globally optimal geometry nor provide gradient-based topology design.

Both modes include proposal generation, setup, full fields and objectives. Fixed
cohort sizes are 16 at 32³ and 4 at 64³. Cohort tuning is excluded from these design
timings and is reported separately for the ensemble experiment. Resume remains
available only in the process runner. The tensor optimizer rejects it explicitly.

## Reproduce

```sh
python -m benchmarks.ensemble_comparison
python -m benchmarks.design_throughput
python -m pytest tests/test_tensor_batch.py tests/test_tuning.py tests/test_batch.py
```

After inspecting the completed results, copy the JSON files from
`results/open-source` into `docs/validation` and run
`python -m benchmarks.report_open_source`. Hardware, library versions, exact
projects and implementation hashes are retained in the ensemble record.

FDTDX, fdtdz and fdtd3d still have no measured timing on this host. Its missing
compatible CUDA environment must be resolved before those comparisons, and each
adapter's physics must be validated. Their published performance claims must not
be substituted for measurements on this GPU.
