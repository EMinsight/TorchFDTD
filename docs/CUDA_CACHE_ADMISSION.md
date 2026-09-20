# Repeated adjoint admission and unused CUDA cache

The first RTX 5880 eight-case 512-cubed ADE batch stopped during backward
admission. Its preceding case had already released its tensors, but Torch
retained unused allocator blocks. The planner used driver-reported free bytes
alone and therefore denied a workload that fitted before the first replay.
The [failed record](validation/adjoint-batch-8x512-ade-cache-denial-5880.json)
is retained separately from completed validations.

A two-case diagnostic rerun at revision `f47cae9` reproduced the denial before
the second replay. The [snapshot](validation/adjoint-cache-denial-snapshot-5880.json)
shows zero live Torch CUDA bytes, 18,662,555,648 reserved bytes and
30,924,603,392 driver-free bytes. Eighty percent of that free memory was below
the native solver reservation of approximately 26.21 GB. This was an admission
failure, not a CUDA out-of-memory exception or a numerical-gradient mismatch.

Resident adjoint admission, unified CPU-to-CUDA wrappers, streamed tiles and
ADE material packing now use the same capacity helper. It behaves as follows:

1. Accept a reservation that already fits the explicit budget and 80 percent
   of current free memory without releasing cache.
2. Reject requests that exceed the explicit budget or physical-capacity bound
   without attempting cache release.
3. If unused Torch cache could make an otherwise denied request fit, call
   `torch.cuda.empty_cache()` once and query actual free memory again.
4. Apply the original budget and 80-percent rule to that new measurement.

Reserved-minus-allocated bytes only decide whether a release attempt could be
useful. They are never treated as guaranteed free capacity. Fragmented blocks,
pending work and allocations from other libraries or processes may prevent
admission even after release. Live tensors are preserved. No solver precision,
checkpoint count, execution policy or device is changed to make a run fit.
There is no retry of a partially executed forward or backward operation.

Metadata-only planning can now release unused Torch cache when necessary.
It still does not allocate domain fields. Cache release may synchronize work
and affect the cache of this process, so its cost belongs to admission and any
timed API call that performs it. It is not an exclusive memory reservation.

The related 162-test group covers admission, shared cases, resident allocation,
ADE streaming and execution selection. New checks include fragmented or
unavailable cache, explicit-budget denial, fresh capacity revalidation, all
three admission paths and preservation of a live CUDA tensor. The real
automatic fused-backward path also now counts its indexed observation packet.
The [fresh eight-case ADE run](validation/adjoint-batch-8x512-ade-cache-recovery-5880.json)
at revision `45d9e5c` completed every forward and backward case on RTX 5880.
Peak Torch CUDA allocation was 17,911,820,288 bytes. Full outputs agreed
exactly with the finite-cone reference, and the largest material-gradient
relative L2 discrepancy was 1.22e-7. The [dielectric rerun](validation/adjoint-batch-8x512-dielectric-cache-recovery-5880.json)
also passed, with 15,884,919,296 bytes and a 3.08e-7 epsilon-gradient discrepancy.
All 79 unique driver/runtime source hashes in these and the dense-plane
integration records match that revision. These eight-case, twelve-step runs
resolve the observed admission failure. They do not establish sustained
optical convergence, universal OOM recovery or a performance advantage.
