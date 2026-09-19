# Online spectral observations and their adjoint

Development validation, 20 September 2026, RTX 5880 Ada, Torch 2.10.0.
The new `model.spectrum` path accumulates complex point spectra in bounded
blocks. It regenerates each block's real observation derivative during the
native discrete backward, including the magnetic half-step time convention.
Resident, streamed DRAM and streamed file-backed physical states are supported.
This is a memory improvement for spectral objectives, not a plane-flux or CR
validation, a new Fourier algorithm or a competitor speed claim.

## Values, derivatives and admission

The 31-test observer suite covers CPU/CUDA, FP32/FP64, 2D/3D, scalar/diagonal
epsilon, periodic/CPML, duplicate points, real and imaginary loss terms, uneven
blocks, retained-graph backward, fixed-setting snapshots, disk cleanup and
input rejection. Tests compare against an explicit complex Fourier sum and
full-history Torch autograd. A geometry-radius derivative also agrees with a
central difference. Existing native backward and slab tests remain unchanged.

On the final blocked implementation, 63 observer/resident-adjoint tests passed
on RTX 5880. Before the block refinement, 100 observer/resident/slab tests
passed there. The local full suite passed 798 tests with one skip, collected
before the four final block-argument tests were added. The blocked observer
suite before those four additions passed all 27 tests locally.

The caller receives `(frequency, monitor)` complex values. Observation storage
and temporary transforms scale as `O(F*M + F*B + B*M)` for frequencies F,
monitors M and bounded block depth B. Prepared source histories and an optional
copied window remain `O(T)`. The implementation does not retain a `T*M` history
or a `T*F` transform matrix. Admission includes spectra, incoming seeds,
temporary transform/gather storage and fixed settings. A test with 10,000 steps
and 60 point monitors admits the online path under a host budget that rejects
the history path, reducing the conservative estimate by more than 9 MB.
This is an allocation-contract check, not a measured physical-memory limit.

## Complete iteration times

All rows below use a 24 × 20 × 1 FP64 grid, 128 steps, 24 E/H point observations,
three frequencies, one warm-up per policy and medians of three complete
forward/loss/backward iterations. Measured policies alternate order.

| Physical state policy | DFT block depth | History + DFT (s) | Online DFT (s) | Gradient relative L2 |
| --- | ---: | ---: | ---: | ---: |
| Resident, final block option | 1 | 0.28501 | 0.52333 | 5.30e-17 |
| Resident, final default | 32 | 0.28905 | 0.28658 | 5.42e-17 |
| Streamed DRAM | 8 | 1.30452 | 1.94962 | 1.92e-16 |
| Streamed file banks | 8 | 1.88035 | 1.96547 | 1.92e-16 |

The resident default amortizes transform overhead with a bounded block. Its
small difference from the history path is not evidence of a speed advantage.
Streamed paths remain slower in these tests. The DRAM and disk trials used the
initial implementation, whose streamed accumulation/transpose is unchanged by
the subsequent resident block refinement. An initial resident depth-one trial
is also preserved, rather than replacing it with the improved result.

The returned history requires 24,576 bytes and the returned spectra 1,152
bytes. These output sizes are not total solver memory. In the resident B=32
trial, Torch peak allocations were 17,352,192 bytes for history and 17,332,224
bytes for online observations. Both are dominated by other solver storage.
CUDA context/cache and caller geometry/objective storage are outside admission.
File trials use buffered OS I/O and do not measure cold NVMe performance.

A separate 1,024-step resident B=32 trial uses the same small geometry and
three timed repetitions. History and online medians were 1.21306 and 2.05730
seconds. The online gradient relative L2 difference was 3.51e-15. Returned
history storage grows to 196,608 bytes while the spectral output remains
1,152 bytes. CUDA allocation peaks were 18,815,488 and 17,339,392 bytes.
The history path also materializes its differentiable DFT operations. The
online path avoids their time-length intermediates. Runtime variation is
visible in the raw repetitions, and the online path is slower in this longer
trial. Memory savings do not establish a general throughput advantage.

## Reproduction and evidence

```sh
python -m benchmarks.adjoint_spectrum --mode resident --block-size 32 --output results/online-spectrum.json
python -m benchmarks.adjoint_spectrum --mode resident --block-size 1 --output results/online-spectrum-b1.json
python -m benchmarks.adjoint_spectrum --mode host --output results/online-spectrum-host.json
python -m benchmarks.adjoint_spectrum --mode disk --output results/online-spectrum-disk.json
python -m benchmarks.adjoint_spectrum --mode resident --steps 1024 --block-size 32 --output results/online-spectrum-long.json
```

Raw records: [resident B=32](online-spectrum-block32-5880.json),
[resident B=1](online-spectrum-block1-5880.json),
[initial resident](online-spectrum-resident-5880.json),
[streamed DRAM](online-spectrum-host-5880.json),
[streamed file banks](online-spectrum-disk-5880.json).
[Longer resident trial](online-spectrum-long-5880.json).
[Final source hashes and trial scope](online-spectrum-source-evidence.json).

Next is collocated detector-plane sampling with its interpolation transpose,
signed Poynting integration and matched-reference normalization. Point spectra
alone do not implement the TORCWA color reconstruction/information objective.
