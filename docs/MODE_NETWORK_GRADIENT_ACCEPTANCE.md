# Fixed-slab material-gradient acceptance at h = 0.025 micrometre

The single new native FP32 gradient measurement and fixed descent step satisfy all three criteria declared before execution. This result applies only to the uniform slab permittivity parameter and complex modal S objective described below. It does not establish general CR, arbitrary geometry, shape-gradient, eigenmode-gradient, or full photonic mode-port completion.

The reproducible driver is `benchmarks/mode_network_gradient_acceptance.py`. The measurement record is `docs/validation/mode_network_gradient_acceptance_3060.json`. Existing source files, earlier mesh results, documentation and evidence records were not modified by this task.

## Predeclared criteria and scope

The driver wrote these criteria to the new JSON before FDTD execution:

1. Native derivative relative error against the independent discrete oracle must be at most `1e-4`.
2. Native derivative relative error against the independent continuum oracle must be at most `0.02`.
3. Both native and continuum objectives must decrease for the fixed epsilon change `-0.001`.

The objective is `L = Re(S21) + 0.3 Im(S12)`. Background epsilon is 2.25 and the slab epsilon is 2.6. The physical slab is `-0.2 <= x < 0.2` micrometre across the full transverse cell, sampled at each electric component's actual Yee coordinates. Its uniform permittivity increment is the sole differentiable parameter.

The domain is 8 by 1 by 1 micrometres. Source planes remain at x = -2 and +2 micrometres, and port phase planes remain at -1 and +1 micrometres. The source uses a 1.55 micrometre carrier and a two-cycle Gaussian pulse. Transverse boundaries are periodic. This mesh has 320 by 40 by 40 cells, 4,800 steps, and 40 CPML cells per end. The 1 micrometre PML thickness and approximately 228.789 femtosecond physical duration are unchanged from the previous meshes.

Exactly one network forward/backward was run, followed by exactly one additional network forward at epsilon 2.599. A network invocation includes separate launches from both ports and fresh matched-guide calibration. Backward reconstructs the two launch cases sequentially. No native finite-difference pair, extra mesh, warm-up FDTD solve, or existing test suite was run.

## Results

| Quantity | Measured or independently calculated value |
| --- | --- |
| Native FP32 derivative | +0.249719023705 |
| Independent discrete-oracle derivative | +0.249719012230 |
| Independent continuum derivative | +0.253724791571 |
| Relative error versus discrete oracle | 4.5951e-8 |
| Relative error versus continuum | 0.01578785, or 1.5788% |
| Fixed epsilon change | -0.001 |
| Native objective change | -0.000249803066 |
| Continuum objective change | -0.000253862616 |

The independent derivatives use the existing scalar interface-continuity and exact harmonic Yee-recurrence oracles, with central epsilon step `1e-5`. Those are scalar calculations, not additional FDTD runs. The agreement with the discrete derivative is at FP32 roundoff scale and must not be interpreted as corresponding physical precision.

The native objective decreases from 0.9130741358 to 0.9128243327. The continuum objective decreases from 0.9076909559 to 0.9074370933. The measured positive gradient is consistent with the declared negative epsilon step being a descent direction. All three predeclared checks are true in the JSON. No threshold was relaxed after measuring the result.

This closes the stated fixed-slab material-gradient direction and 2% derivative-accuracy check at this mesh. The continuum derivative discrepancy remains 1.58%. The coarse mesh's opposite-sign derivative and the previous finer-mesh errors are preserved in their earlier records. This acceptance does not retroactively validate those meshes or establish all other physical gradients.

## Memory, checkpoint and timing evidence

Memory admission occurred before allocating a full material or E/H volume for execution. The conservative combined per-case and wrapper plan was 258,304,999 GPU bytes and 132,795,656 host bytes, below the explicit 2 GiB budgets and the checked available-memory limits. The JSON records the individual solver, modal packet, plane layout and wrapper estimates.

The process ran only on the local NVIDIA GeForce RTX 3060. There was no explicit GPU warm-up. The first invocation includes process-local lazy initialization, while an existing on-disk compiler cache may be reused.

| Measurement | Result |
| --- | --- |
| Gradient forward, including matched calibration | 27.0687 s |
| Native backward, including sequential case reconstruction | 73.0397 s |
| Fixed-step forward, including matched calibration | 21.1017 s |
| Forward/backward peak allocated CUDA tensor memory | 181,353,472 bytes |
| Forward/backward peak reserved Torch CUDA memory | 205,520,896 bytes |
| Fixed-step forward peak allocated CUDA tensor memory | 75,914,752 bytes |
| Fixed-step forward peak reserved Torch CUDA memory | 88,080,384 bytes |

These peaks come from the Torch CUDA allocator. They include live input tensors, but exclude CUDA context, CuPy driver/module allocations and other processes. They are not total-device or total-process VRAM measurements.

Each active launch used four device checkpoint states. One complete restart state occupied 14,310,400 bytes. Each of the two gradient launches replayed 47,106 steps, with measured peak checkpoint count four. The native reports have `full_time_autograd=false`. The outer network uses one reconstructed launch graph at a time, so it does not retain an autograd field graph over all 4,800 steps or over both launch cases simultaneously. Fixed source waveforms and observation metadata still have their ordinary storage costs.

The benchmark-only reporting subclass collected existing native report dictionaries. It did not change the solver update, transpose, source, detector or checkpoint algorithm.

## Provenance

The driver and measured runtime source hashes are in the JSON. Its final hash check confirmed that all measured source files remained unchanged, including the shared models, solver and boundary modules. The previous gradient record's SHA-256 was also checked without modifying it.

Exact raw measured source bytes are preserved privately under:

```text
.local/mode_network_gradient_acceptance_sources/d619d7d439d7f4659ea060761d349c7fcfdc62986dfa28d3a34512a9d1449cd4/
```

The measured driver SHA-256 is:

```text
3a8ac81a3c2afbea8b26807bd1a1323486beea89b9c12e34a83879207780377c
```

No remote GPU jobs were accessed. No additional mesh iteration follows from this bounded acceptance run.
