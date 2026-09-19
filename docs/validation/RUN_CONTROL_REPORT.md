# Native run-control validation

19 September 2026, NVIDIA RTX 5880 Ada Generation. Reproduce with
`python -m benchmarks.run_control_validation`. Raw observations and the full
native project are in [run-control.json](run-control.json).

The case is a 64³ dielectric sphere, 4000 maximum steps, float32, eight CPML
layers per face, fused CUDA with graph capture, and 31 explicit point-DFT
frequencies. A sampled zero-area current drives the same scene in all three
timed modes. One warmup per mode precedes three measured repetitions with
alternating order. Wall time includes setup and transfers but excludes initial
context/compilation warmup. These are comparisons within the native solver.

| Mode | Steps | Median loop | Median complete solve |
|---|---:|---:|---:|
| Fixed duration, periodic diagnostics disabled | 4000 | 0.074572 s | 0.099369 s |
| Fixed duration, diagnostics every 50 steps | 4000 | 0.082472 s | 0.110668 s |
| Automatic decay, same diagnostics | 1000 | 0.020714 s | 0.047473 s |

Automatic decay uses a 1e-7 state-norm ratio and three consecutive checks after
the source has ended. It is 2.09× faster than the unchecked full solve and
2.33× faster than the checked full solve in this case. Diagnostics add 11.37%
to complete fixed-duration wall time. The two diagnostic kernels promote
values to double before squaring and accumulate block partials without atomics
or full-size double field copies. Torch peak allocated memory is 18,714,624
bytes in all three modes, excluding CUDA context and driver allocations.

The checked and unchecked fixed-duration final E/H arrays agree bitwise. The
automatically terminated time trace agrees bitwise with the full-run prefix.
The DFT relative L2 difference is 1.8267e-8 and the omitted time-trace relative
L2 norm is 1.4281e-6, identical over the three repetitions. This does not bound
error for a different geometry, resonance, source or observable.

The original truncated Gaussian soft dipole is also recorded. Its residual
whole-domain norm ratio settles near 1.3991e-7 and the calculation correctly
reaches 4000 steps rather than reporting decay below 1e-7. A current pulse
with nonzero integral can leave electrostatic charge. The timed case therefore
uses a separately specified finite dipole pulse and its discrete difference as
the current. The original waveform and the threshold are not altered. This
distinction is physically relevant, as discussed in the [Meep source
documentation](https://meep.readthedocs.io/en/master/Python_User_Interface/).

`diagnostic_seconds` records host time spent inside diagnostic calls. It includes
waiting for previously queued GPU work and cannot be interpreted as isolated
kernel time. The fixed checked/unchecked wall-time comparison above measures
the actual overhead. Neither this experiment nor early termination establishes
an overall speed ranking against another FDTD library.
