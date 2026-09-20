# Restartable spectral CR density optimization

`benchmarks.cr_inverse_design` connects the complete supplied wavelength/ray
schedule to a CPU density parameter, periodic FDTD, electron information,
`backward()` and projected Adam. It maximizes the same fixed-calibration
`weighted_bits_per_pixel` objective as the explicit CR evaluator. Both use
`information_objective` from `benchmarks.cr_spectral_objective`.

The supplied binary seed initializes `density = 0.01 + 0.98 * seed`.
Adam updates the continuous density and projects it into `[0,1]`. Wavelengths,
ray weights, material indices, thickness, detector layout and electron context
remain fixed. The objective includes all supplied cases at every update.
There is no wavelength minibatching or surrogate objective.

Run the driver from a source checkout:

```console
python -m benchmarks.cr_inverse_design --schedule schedule.json --density seed.npy --context electron-context.pt --output-directory results/design --mesh 0.05 --steps 1600 --pml-cells 12 --iterations 10 --learning-rate 0.001 --execution-policy resident --gpu-budget-gib 32 --host-budget-gib 64
```

This example's numerical settings are not a convergence recommendation. Inputs
are supplied explicitly and are not included with the package. The driver
requires CUDA and uses FP64 density, complex-FP64 fields and fused kernels.
Resident, asynchronous DRAM and file-backed execution share the same objective.
File mode additionally requires `--state-directory` and `--disk-budget-gib`.
Both file execution and the default optimizer checkpoint policy preserve
100 GiB of free storage. A separate checkpoint allowance is reserved before
writing a new archive. Small local tests explicitly lower the checkpoint floor.

The driver preflights every case before allocating optical fields. It subtracts
a design/Adam copy allowance from the shared solver host budget. Solver state,
source-basis replay and fixed references use the existing bounded hierarchy.
The density/material map still resides in CPU RAM. Caller context, iteration
metadata, Python/runtime overhead and OS file cache are outside these tensor
reservations. This is not an exact process-RSS limit.

To extend the same run, repeat the command with `--resume` and a larger total
`--iterations`. Inputs, source hashes, runtime, memory policy, learning rate
and CPU thread count must match. Changed settings require a new output directory.

`checkpoint.pt` is the authoritative atomically replaced state. It retains
density, Adam moments and step count, scalar/compact response history, the
best evaluated density and an internal checksum. It never stores a retained
FDTD autograd graph. A partial `.tmp` archive is ignored on resume.

Per-update case journals retain only completed compact forward responses.
If a run is interrupted during a gradient, restarting reuses those responses
and executes the differentiable case replay again. An optimizer update is
committed only after its complete gradient and checkpoint write finish.
An OS file lock prevents two writers from owning the same run.

After the requested updates, the final density receives a complete forward
evaluation. `result.json`, `latest-density.npy` and `best-density.npy` are
derived exports. The best design is selected among evaluated densities.
`progress.json` indicates whether a later extension is running or failed.
The previous completed export can remain present during an extension.

This driver does not establish physical gradient convergence, a finished
original CR optimization, binarization or manufacturing feasibility. Those
remain application validation requirements before interpreting a design as
an improved device.

## Executed checks

Five optimizer/driver tests pass on the local RTX 3060 environment. They check
Adam moment restart, exact resumed designs, partial archive writes, rejected
nonfinite gradients, free-space failures, projection bounds, checkpoint
checksums, exclusive ownership and the real optical/information computation.
The existing CR/periodic regression group contributes another 28 passing tests.

The [synthetic record](validation/cr-optimizer-synthetic-3060.json) uses three
wavelengths, one ray and a 2 x 2 density. Two resident updates increase the
information score from 0.07000366558 to 0.07002771570 bits per pixel. Saving
after one update and resuming gives the exact same final response and density.
One asynchronous DRAM update matches its resident counterpart to the recorded
tolerance. All 80 driver/runtime hashes in the record match the tested sources.
These small checks validate optimizer connectivity and restart behavior, not
the original 144-case application or memory capacity.
