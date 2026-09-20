# Sequential case-recompute measurement

RTX 5880 Ada, Torch 2.10.0, FP32 real permittivity and complex fields,
64 x 64 x 64 cells, 24 steps, eight fixed Bloch phases, two point observations
at one frequency. Each case uses the resident Torch forward and explicit
transpose with two checkpoint slots. A single scalar material parameter is
shared. The synthetic loss includes the squared magnitude of the mean complex
response and a mean squared real-response term, coupling the cases.

| Method | Complete iteration median | Peak Torch CUDA allocation |
|---|---:|---:|
| Stack all case graphs | 4.161 s | 358,044,672 bytes |
| Sequential case recomputation | 6.778 s | 159,702,528 bytes |

Peak allocation decreased by 55.4%, while median time increased by 62.9%.
The recorded scalar gradients agree exactly. Each policy receives one warm-up
and three measured iterations with alternating policy order. Timings include
geometry construction, forward, CPU output packing, coupled objective and
backward, with CUDA synchronization at the boundaries. The CUDA peak is the
Torch allocator's live allocation peak, not total device memory or host RSS.

The [raw repetitions](recomputed-batch-5880.json) and
[source hashes](recomputed-batch-source-evidence.json) accompany the executable
`python -m benchmarks.recomputed_batch --output results/recomputed-batch.json`.
The benchmark is a memory trade-off experiment, not a converged optical design,
the locked CR objective, a throughput advantage, or a competitor comparison.
Long propagation, many-case scaling and end-to-end CR optimization remain
unmeasured. Retained design tensors, objective tensors and compact outputs
remain outside the one-case graph-residency claim.
