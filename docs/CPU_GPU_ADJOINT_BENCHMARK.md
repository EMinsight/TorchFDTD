# Matched CPU and CUDA adjoint measurement

`benchmarks.cpu_gpu_adjoint` compares the same fixed real-FP32 Maxwell problem
through three native execution paths: Torch CPU with DRAM-resident fields,
fused resident CUDA, and fused CUDA with asynchronous DRAM space-time slabs.
It supports dielectric and two-pole ADE materials. This is an internal backend
comparison. The CPU path is not Meep, Lumerical or a separately optimized C++
CPU implementation.

```console
python -m pip install -e ".[benchmark,cuda-kernels]"
python -m benchmarks.cpu_gpu_adjoint --size 256 --steps 128 --cpu-threads 6 12 --output results/cpu-gpu-plan.json
python -m benchmarks.cpu_gpu_adjoint --execute --size 256 --steps 128 --cpu-threads 6 12 --output results/cpu-gpu-dielectric.json
python -m benchmarks.cpu_gpu_adjoint --execute --dispersive --size 256 --steps 128 --cpu-threads 6 12 --output results/cpu-gpu-ade.json
```

The first command performs admission without full-grid design or field
allocation. The default solver budgets are 32 GiB GPU and 64 GiB host. Every
candidate must fit, including an explicit allowance for benchmark inputs,
reference gradients and comparison scratch. Execution preserves an additional
16 GiB of available system RAM. This benchmark does not use disk field backing.

Each mode sees identical mesh, duration, source, CPML, periodic boundaries,
frequencies, detection planes and material parameters. The dielectric is
uniform but its permittivity is a full spatial design tensor, so validation
compares the complete spatial VJP. ADE additionally uses two shared poles with
scaled strength, resonance and damping coordinates. The field-energy and
signed-flux objective is a numerical proxy, not a converged device objective.

The timer includes fresh model construction, admission, material scaling and
packing, differentiable host-to-device copies, forward, the objective, checkpoint
replay, backward and CPU output/gradient transfers. It excludes input leaf
allocation, the fixed project copy, garbage collection, thread-count changes,
verification, final cleanup, geometry construction and optimizer updates.
It must therefore be labelled **forward/objective/backward time**, not complete
inverse-design iteration time or pure Yee-kernel throughput.

Every mode receives one full-duration warm-up. Subsequent trials rotate and
reverse mode order. The report retains all warm-up and measured durations,
thread counts and native solver reports. Speed ratios use medians and the
fastest **tested** CPU thread count. A slower GPU or streamed result produces
a ratio below one. There is no claim that the tested CPU thread counts or the
explicit checkpoint/tile configuration are globally optimal.

The first CPU warm-up supplies the reference. Every warm-up and timed trial
compares all complex field outputs and material-gradient elements, using
bounded chunks to avoid a full-size verification temporary. Each group must
be finite, nonzero and within relative L2 tolerance `2e-4`. There is no absolute
tolerance that could silently accept a tiny, incorrect SI-scaled gradient.
This checks backend agreement, not an independent physical oracle.

The report also retains 50 ms sampled process RSS, baseline and peak Torch
CUDA allocated/reserved bytes, hardware, physical/logical CPU counts and hashes
of the driver and runtime sources. RSS includes the retained CPU reference and
allocator pools, can miss short peaks and is not solver-only memory. Torch
metrics exclude CUDA context and non-Torch allocations. Cache pools are not
flushed between trials. Planning may release unused Torch cache if required
by the usual admission rule.

A failed admission, execution or comparison leaves an atomic JSON record with
the active mode, repetition and failure stage. A speed-ratio summary is emitted
only after every trial passes. `--smoke` permits small fixtures and fewer
repeats for driver tests, marks the record and removes the 16 GiB floor. Such
results must not be presented as large-workload performance evidence. Normal
runs require at least `128^3`, 128 steps and three repetitions.

The seven targeted driver tests passed on the development CUDA host.
The end-to-end driver tests exercise CPU, resident CUDA and asynchronous CUDA
slabs for both material types. Additional tests reject a corrupted gradient
beyond the first comparison chunk, mismatched groups, nonfinite results and a
tiny but relatively incorrect gradient. Failure records and slower-GPU ratios
remain visible. Large-workload measurements are pending. This benchmark does
not establish beyond-VRAM capacity or comparative performance against external
solvers.
