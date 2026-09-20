# Coupled objectives with sequential case replay

`recompute_cases` allows a single objective to combine independent wavelength,
angle or polarization outputs without retaining every case's autograd graph.
It evaluates all cases without recording gradients, packs their compact outputs,
then recomputes one case at a time during backward. Each case receives the seed
from the complete coupled objective, so this is not a sum-of-independent-losses
approximation.

```python
import torch
from photonweave import recompute_cases

# models and frequencies are fixed for this optimizer iteration.
# build_epsilon must preserve Torch differentiation through the design.
cases = [
    lambda design, model=model, frequency=frequency:
        model.spectrum(build_epsilon(design), frequency).fields.flatten()
    for model, frequency in zip(models, frequencies)
]
optimizer.zero_grad()
responses = recompute_cases(cases, design, output_device="cpu",
                           output_budget_bytes=64 * 1024**2)
loss = coupled_objective(responses)
loss.backward()
optimizer.step()
```

Pass every trainable tensor explicitly. Cases must be deterministic and unchanged
until backward. Do not capture hidden trainable tensors, reuse an already-built
geometry graph, change models, or retain case graphs in an external list. Rebuild
geometry from the explicit inputs inside each call. Random sampling, mutable
running statistics and side effects are outside the contract. Replay compares
values against the saved forward outputs, but equal values cannot prove equal
derivatives for arbitrary stateful code.

All cases must return finite, nonempty tensors of identical shape and dtype.
Real and complex outputs are supported. The default output device is CPU.
The byte budget covers the packed output only. It does not cap a case's initial
allocation, solver workspace, geometry, design tensors, gradients or objective.
Per-solver memory admission still applies. CPU output avoids retaining the full
packed result on the GPU, at the cost of transfers. Only first-order gradients
are supported.

One additional forward solve per case buys bounded case-graph residency.
This is sequential execution and is separate from the forward CUDA cohort batch
API. It does not introduce complex spatial streaming, fused complex kernels or
an automatic multi-GPU scheduler.

Tests cover a nonseparable objective, Gaussian target information, complex Bloch
resident/disk-checkpoint solves, real DRAM/file-backed spatial solves, unused
parameters, replay drift and graph lifetimes. The [RTX 5880 measurement](validation/RECOMPUTED_CASES_REPORT.md)
documents the memory/time trade-off. The locked CR illumination and detector
proxy still require implementation and physical validation.
