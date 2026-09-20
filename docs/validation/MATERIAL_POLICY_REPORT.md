# Material-aware policy and allocation validation

The [policy API](../STREAMED_POLICY.md) now calibrates dielectric and ADE point
histories or spectra, checks dimensionless material derivatives separately,
and bounds reference-gradient storage. Generated policies fit current budgets
and compare global checkpoint counts. Explicit candidates retain their settings.

Final local RTX 3060 checks on 2026-09-20:

| Scope | Result |
| --- | --- |
| Existing policy tuning, material tuning and complex streamed API | 33 passed |
| Tile allocation/ownership, complex CUDA slabs, streamed ADE and graph lifetime | 90 passed |
| CPU tuning followed by two geometry/damping Adam evaluations | Completed |
| CUDA spectral tuning followed by the same two evaluations | Completed |

The material suite deliberately corrupts only the gamma VJP while keeping
forward values unchanged. The normalized comparison rejects that policy in
both FP32 and FP64. Other tests cover bounded compact references, eviction
without cyclic GC, no mutation of user `.grad`, full-budget rejection before
packing and automatic width fitting with global checkpoint counts 0, 2 and 4.

The [example record](material-policy-example-3060.json) records the selected
CUDA spectral policy and its probes. Its reference cache retains 46,208 bytes
within a 64 MiB limit. Comparison-memory reservation is 92,416 bytes. Tuning
takes about 24 seconds in this small example. The following point-spectrum
losses are `9.310127345711881e-5` and `9.286054878265005e-5`, matching the
untuned and CPU examples. This proves connectivity, not optimality or useful
device performance. An independent CR run was active on the workstation, so
these timings must not be used as a solver-speed comparison.

The completed 54 GiB nondispersive packet rerun found a transient CUDA peak
increase rather than an improvement. Its record is retained in the
[capacity report](../BEYOND_VRAM_VALIDATION.md#reusable-packet-rerun).
Inspection identified a forward output allocation retained during growth
of the backward output buffer. The workspace now releases its expired owner
before requesting the replacement. A caller retaining a view still keeps it
valid. This is an ownership change, without changes to the field equations.

The [corrected ADE driver check](streamed-ade-growth-smoke-3060.json) retains
the same 64-cubed complex FP64 one-pole calculation and VJP oracle. Peak Torch
CUDA allocation decreases from 76,226,560 to 69,622,272 bytes. Both records are
explicitly small driver checks. Neither establishes dispersive capacity beyond
VRAM, and a large run of this lifetime fix remains required.

The running 54 GiB E/H/P/Q experiment uses a frozen earlier snapshot `d77e958`.
It does not include the new policy tuner or output-growth fix. Its results must
be attributed to that snapshot rather than the current implementation.
