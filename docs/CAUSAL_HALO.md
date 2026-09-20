# Yee dependency bound for streamed slabs

The streamed operators now gather `K` cells on either side of an owned x slab
for `K` complete Yee steps. The previous implementation used a conservative
`2*K` on each side. State precision and the update equations are unchanged.

In the implemented update order, an electric x difference uses the old
magnetic values at `i-1` and `i`. A magnetic x difference then uses updated
electric values at `i` and `i+1`. Substitution gives old-state x indices from
`i-1` through `i+1`. The opposite difference orientations matter. Adding two
unsigned radius-one bounds would overestimate this support as radius two.
Terms differentiated along y or z do not add another x shift.

CPML memory is owned by the target cell of its derivative, including the
electric half-step offset. Its recurrence adds no further spatial dependency.
The admitted ADE P/Q updates are pointwise and likewise do not widen x support.
Therefore the complete E/H/CPML/P/Q state has at most one cell of x dependence
per full step, and at most `K` cells after `K` full steps. Fixed additive sources
do not widen it. Only the owned interior and its observations are committed.
Backward differentiates this same local computation and sums all halo VJPs.

The memory planner uses the same width. For a periodic slab of owned width
`W`, the extended width changes from `W+4*K` to `W+2*K`. For example,
`W=32, K=8` changes 64 x planes to 48, a 25% reduction in extended tile cells.
That geometric reduction alone is not a measured wall-time or total-memory
speedup. Owned outputs, full-domain banks, material gradients and launch costs
remain, and physical boundaries can clip the halos differently.

`tests/test_causal_halo.py` checks an independent full-domain propagation:
an H-plane impulse exactly K cells away reaches the selected cell after K
steps, while one K+1 cells away cannot. A deliberately shortened K-1 halo
misses the former signal. This guards both sufficiency and a necessary case.
The block-Jacobian suites compare all random initial fields, CPML and P/Q
states, intermediate observations, endpoint seeds and material derivatives
against resident autograd. Long complex cases cover more than two copies of
the periodic domain, including nonuniform metrics and diagonal permittivity.

Local verification on 2026-09-20 passed 184 tests covering causal impulses,
block Jacobians, complex CUDA/file staging, admission, material policy tuning
and its full-duration driver. The ADE winding case was then extended from
8 to 18 steps to retain multiple-domain coverage under the narrower halo.
All 37 ADE tests passed again. These are numerical and admission checks,
not performance measurements.

Earlier timing and 54 GiB records retain their original source hashes and
the wider halo. They must not be attributed to this change. Large-capacity
reruns and controlled throughput comparisons remain required before reporting
a speed advantage from the tighter dependency bound. The separately frozen
policy benchmark at `981b0c3` also uses the earlier halo.

This change retains full y/z slabs. It does not implement shrinking tiles,
two-axis spatial partitioning, coupled subpixel physics or higher-order
stencils. Those require their own dependency and transpose analysis.
