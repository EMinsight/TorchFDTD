# Default FP32 execution

The CR evaluator and optimizer use FP32 by default for density, optical
response, information, gradients and Adam moments. PeriodicLayerResponse also
defaults to FP32. Bloch optical fields use complex64. An explicit
`--precision float64` selects FP64 throughout the CR drivers. Resume contracts
bind precision. Imported fixed calibration matrices follow the selected
response dtype, without promoting the calculation to FP64.

## Executed checks

The changed CR/restart tests and periodic integration checks cover 39 cases on
RTX 3060, including default FP32 evaluation, information gradients, Adam
moments, exact resumed optimizer states and resident/DRAM agreement. The
strict existing FP64 integration test now requests FP64 explicitly. Its
numerical tolerances were preserved.

The [matched measurement](periodic-full-fp32-3060.json) uses a synthetic
40 x 40 x 84 periodic grid, 1,600 steps, two source bases, four device
checkpoints and four CPU threads. Each precision receives one warmup and
three interleaved repetitions. Timing includes the complete warm response,
squared-response objective and density VJP. Outer module construction,
reference warmup, checks and cleanup are excluded. No optimizer is timed.

| Precision | Median full response/objective/VJP | Peak Torch CUDA allocation |
|---|---:|---:|
| float64 | 17.9629 s | 201.666 MB |
| float32 | 7.6893 s | 111.016 MB |

FP32 is 2.34x faster in this experiment. Maximum relative L2 differences
are 2.30e-7 for response and 3.79e-6 for density VJP, below the preset
1e-4 and 1e-3 limits. All 77 recorded source hashes were verified. Reported
allocation is not total process/device memory. The allocator's reserved pool
is retained between runs and is recorded separately. This is a desktop
measurement, not a general GPU throughput guarantee.

The [original-context algebra check](cr-information-fp32.json) evaluates the
actual fixed CR electron context on an archived full response. FP32 differs
from FP64 by 3.50e-6 bits per pixel, with response-gradient relative L2
1.08e-5. It does not rerun optics or certify the full density gradient.

Full 144-case FP32 optical/density-gradient validation is a separate pending
application check. Neither record establishes physical mesh convergence,
complete inverse design, external-solver superiority or beyond-VRAM speed.
Subsequent capacity tests must exceed VRAM with FP32 state, rather than using
FP64 storage size as an FP32 capacity boundary.
