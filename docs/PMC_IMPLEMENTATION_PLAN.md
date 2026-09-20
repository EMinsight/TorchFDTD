# Exact-endpoint PMC implementation plan

Status: production integration pending. A private exact-endpoint CPU reference now implements the volume, upper-face and upper-edge topology below. PEC and anti-symmetric production boundaries are verified separately. Public PMC/symmetric labels remain rejected. This plan contains no vendor execution or equivalence claims.

The existing mesh has N cell intervals with endpoints x_0 and x_N. E_a occupies half nodes along a and integer nodes along transverse axes. H_a occupies integer nodes along a and half nodes along transverse axes. Existing arrays omit every upper integer node. PMC has even tangential E and normal H, and odd normal E and tangential H. Replacing the missing E_t(N) with E_t(N-1) freezes the last H sample and shifts the wall to x_(N-1/2). That shortcut is prohibited.

## Concrete PMC state topology for subsequent implementation

For N_a cells on axis a, complete Yee support has E_a half indices along a and node indices along its two transverse axes, and H_a node indices along a and half indices on its transverse axes. Add an upper node only on a PMC/symmetric face. Upper PEC values remain known zeros and need no storage.

A minimal sparse representation can retain the current volume arrays and add disjoint arrays keyed by (family, component, upper_axes_bitmask):
- E_a needs one upper-face array for each transverse upper PMC axis, plus the edge array where both transverse upper PMC faces intersect. Each selected node axis has length 1, each unselected axis retains N entries.
- H_a needs one upper-face array only if its own normal axis has upper PMC. It has no upper-edge array, since its other two axes are half-staggered.
- No triple-upper-corner field exists on this Yee lattice. E edge values at intersection with a PEC face are constrained zero and must be omitted/projected. Face arrays must exclude separately owned edge locations to avoid duplicate state.
- Every E face/edge requires epsilon and every ADE pole P/J state at exactly that Yee sample. A scalar design-to-Yee material map must define parameter sharing rather than inventing a duplicate independent endpoint parameter. Subpixel cross-component reconstruction needs its own face-aware stencil before admission.

Upper PMC E_t(N) evolves from the normal derivative -2 H_t(N-1/2)/dx_last plus its tangential derivatives of stored H_n(N). Upper H_n(N) evolves from tangential derivatives of stored E_t(N). Interior H_t(N-1/2) uses (E_t(N)-E_t(N-1))/dx_last. For explicit nonuniform nodes, mirrored outer half spacing equals the last cell width. For lower PMC the corresponding factor is +2/dx_first.

The transpose scatters the interior last-half derivative seed to both volume E_t(N-1) and face E_t(N), and scatters face E normal-derivative seed with coefficient -2/dx_last onto volume H_t(N-1/2). Tangential face curls transpose within face arrays and into edge arrays using the same signed incidence. Identity paths and ADE states transpose on each disjoint array. All coefficients use the actual local time-step and material scaling. Euclidean adjoint tests require no arbitrary energy half weights. Energy diagnostics separately need dual-cell quadrature at endpoint nodes.

For X-slab streaming only the global last tile owns X-upper face arrays. Y/Z face arrays extend over slab X and participate in usual halos, while E edges shared with X upper face appear only on the last tile. Stores/checkpoints must include these state tensors explicitly. Byte accounting is the sum of each tensor's unique element count, not a padded N+1 volume approximation. CUDA batch compatibility includes the face topology and every face material-state bank. Production streaming remains unimplemented.


## Direct CUDA foundation

`torchfdtd/pmc_cuda.py` adds real FP32 direct gathers and their exact transpose
for the same disjoint topology, with fused forward and explicit reverse steps.
It retains compact block descriptors and six one-dimensional metric arrays,
not volume incidence tables. A 128-cubed grid uses 3,084 GPU metric bytes.
This figure excludes fields, material arrays, outputs and CUDA runtime memory.

Fifteen targeted CUDA tests passed, including mixed PEC/PMC faces, nonuniform
metrics, nine-step state/material adjoints against the CPU autograd reference,
and a 128-cubed nondefault-stream check. A further targeted guard check rejects
an ordinary Torch in-place material change after preparation. External pointer
writes remain a caller responsibility. The compact topology copies read-only
nodes and its prepared material checks conservative CFL.

This kernel foundation has no public solver dispatch, automatic Torch backward,
source/monitor integration, ADE, checkpoint admission or spatial streaming.
Its test memory sizes are for kernel correctness, not a 48 GB capacity claim.

## Acceptance tests and admission

- Keep wall coordinates equal to the requested mesh endpoints, including explicit nonuniform meshes.
- Verify PEC/PEC, PMC/PMC and mixed quarter-wave cavity spectra against discrete analytic dispersion, every active axis and both polarizations.
- Compare a full reflection-compatible domain with its reduced domain using the correct component-dependent Yee reflection indices. Include asymmetric source mistakes as validation failures.
- Test face and edge transpose inner products with independent nonzero volume, face and edge seeds. Compare material gradients with full autograd and finite differences near all walls.
- Match CPU/Torch, real/complex fused CUDA, batch and streamed traces and gradients. Tile cuts must exercise physical faces, internal halos and intersecting upper edges.
- Cover ADE face/edge states, checkpoint replay, storage lifetime, exact memory accounting and serialized source/monitor locations before admitting those combinations.
- Expose PMC/symmetric in model, facade, JSON and UI only after the corresponding numerical path is complete. Update the feature inventory separately from PEC material status. Explicitly reject unsupported subpixel, material, source or storage combinations.

The native PMC and symmetry feature rows remain missing until these requirements are met. No partial storage implementation should be presented as complete boundary support.

## CPU reference evidence

`torchfdtd/pmc_reference.py` implements the disjoint state and sparse incidence
curl as an independent correctness reference. Its 21 CPU tests cover 15
analytic three-dimensional cavity cases, including mixed face parities and
three polarizations, and compare all stored degrees of freedom with doubled
periodic or antiperiodic domains. Additional checks exercise nonuniform real
and complex transposes, autograd and directional finite-difference material
derivatives, endpoint geometry sampling and exact field payload counts.

`sample_epsilon` samples geometry at each actual electric Yee coordinate.
`shared_volume_epsilon` is a separately named nearest-interior parameter-sharing
model. It must not be substituted for endpoint geometry sampling without
explicitly choosing that material model. Reference sparse-index storage and
Python construction are for small validation problems, not production capacity.

These checks establish a boundary-state foundation. They do not establish
production PMC sources, monitors, CUDA/adjoint dispatch, ADE, streaming,
checkpoint budgeting or UI support. Those integrations remain release gates.

## Bounded resident Python simulation API

`torchfdtd.pmc_simulation.EndpointSimulation` is a separate usable resident
closed-cavity API. It does not enable PMC in `Project`, the ordinary facade,
JSON, browser, streamed, or batch dispatch. Its implemented combinations are:

- Exact physical endpoint nodes in micrometres, including nonuniform axes.
- PEC/PMC on every face. The local `symmetric` alias means PMC and the local
  `antisymmetric` alias means PEC with the same field parity conventions.
- Real FP32 positive nondispersive sampled diagonal relative epsilon, unit
  relative permeability, zero initial state, no conductivity or ADE.
- CPU sparse reference for up to 32,768 cells, or compact direct CUDA with CuPy.
- Active electric point DOFs as sources, and active electric/magnetic point
  DOFs as observations. Upper faces and electric edges are addressable.
- First derivatives of sampled epsilon and source waveforms through a custom
  backward. A differentiable sampler may connect exact endpoint samples to
  shared material or geometry parameters. No nearest-cell material inference.

A minimal Python workflow is:

```python
import numpy as np
import torch
from torchfdtd.pmc_simulation import EndpointSimulation

sim = EndpointSimulation(
    [np.linspace(0, 1, 9)] * 3,
    [('symmetric', 'symmetric')] * 3,
    dt_seconds=1e-16,
    sources=[(2, (8, 8, 3))],  # Ez on the intersecting upper x/y edges
    observations=[('E', 2, (8, 8, 3)), ('H', 0, (8, 4, 3))],
    device='cpu', checkpoints=4, tensor_budget_bytes=64_000_000,
)
parameter = torch.tensor(2.0, requires_grad=True)
epsilon = sim.sample_epsilon(lambda xyz, component: parameter.expand(len(xyz)))
waveform = torch.zeros(30, 1)
waveform[0, 0] = 1
traces = sim(epsilon, waveform)
traces.square().sum().backward()
print(parameter.grad, sim.memory_plan(30))
```

The internal time increment is `dt_seconds * c0 * 1e6`. Magnetic field values
are impedance scaled (`Z0 H`) so the stored electric and magnetic values have
the same units. Source waveform entries are additive electric field increments,
not current-density amplitudes. Injection occurs between electric and magnetic
substeps, so the magnetic update sees the injected electric field. Each trace
row samples the completed step: E at the next integer time, H at the following
half time. No interpolation, source impedance calibration, plane mode, TFSF,
pulse normalization, DFT monitor or port mapping is inferred by this API.

The custom backward saves only sampled epsilon and waveform inputs through
Torch's saved-tensor mechanism, plus at most the requested number of detached
resident field checkpoints. A binomial bounded-slot reverse schedule reuses `differentiable._split`,
with tail iteration and recursion depth bounded by checkpoint slots. It retains
no segment-state list or timestep autograd graph.
Zero checkpoints is valid but costs quadratic replay time. More checkpoints
reduce recomputation. `last_report` exposes replayed steps, checkpoint saves,
peak live checkpoints, forward steps and reverse steps. Ordinary in-place edits of saved inputs are rejected by
Torch version checks. External raw-pointer or `.data` changes remain the
caller's responsibility. Second derivatives are unsupported.

`memory_plan(steps)` reports a conservative tensor payload upper bound including
checkpoints, state/transpose workspaces, material arrays, waveform and trace
inputs/outputs/cotangents, and backend tensor metadata. The constructor admits
its minimum working set before constructing the backend, and each call checks
the complete requested trace plan. This is not a total process-memory guarantee:
CUDA allocator/runtime memory, caller geometry-sampler graph, and CPU Python
sparse topology metadata are excluded explicitly. There is no disk/host tier,
spatial streaming, multidevice execution, complex FP64 path, full tensor epsilon,
ADE, global solver dispatch or UI support in this resident API.

`tests/test_pmc_simulation.py` checks independent full-autograd reference traces
and parameter/waveform gradients with 0, 1, 4 and 64 checkpoint requests,
nonuniform mixed walls, upper-face/edge observations, endpoint material sampling,
a directional finite difference, saved-tensor count, input mutation, type/CFL/
budget admission, and real FP32 CUDA trace/gradient agreement. Nine focused
CPU/CUDA tests passed on the local RTX 3060. Existing cavity-spectrum and doubled
reflection-domain tests remain in the endpoint reference foundation. The native
PMC feature remains incomplete until the other release gates above are covered.

A logical 10,000-step schedule check exercises four resident slots without
allocating fields and compares replay work with zero checkpoints. A separate
31-step field/adjoint test verifies reduced replay counts and the live slot
bound. This supports long-duration bounded checkpoint scheduling; complete
trace storage still grows as steps times observation count and is budgeted.

Four targeted admission/lifetime checks additionally verify that changing or
replacing the source index tensor, or mutating CPU incidence coefficients,
between forward and backward raises an error. The same identity/version
contract includes CUDA metric tensors and CPU activity masks. Numeric input
scans occur only after metadata-only shape and byte-budget admission. External
raw-pointer writes that bypass version counters remain caller responsibility.
