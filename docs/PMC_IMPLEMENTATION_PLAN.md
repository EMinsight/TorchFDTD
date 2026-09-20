# Exact-endpoint PMC implementation plan

Status: bounded native closed-cavity integration implemented. Native Project JSON and Simulation now admit PMC/symmetric only for the supported resident real FP32 3D point-source/point-monitor contract described below. Other numerical paths reject these labels explicitly. Full boundary parity remains incomplete. This plan contains no vendor execution or equivalence claims.

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

The native PMC and symmetry scope is partial until all these requirements are met. The bounded resident dispatch below is not complete boundary support across every numerical path.

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
closed-cavity API. The native JSON/Simulation dispatch below now wraps its
forward kernel; ordinary adjoint, streamed and tensor-batch dispatch remain unsupported. Its implemented combinations are:

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

## Native Project adapter

`torchfdtd.endpoint_project.endpoint_from_project(project, boundary_faces=...)`
accepts a native `Project` or its JSON dictionary and returns an `EndpointProject`
adapter. Its optional boundary override can still select a separate closed-wall
calculation. Without an override it uses native project face labels. Native
PMC/symmetric labels are now admitted only under the bounded contract below. `adapter.plan()` is a JSON-serializable review record
containing original and effective boundaries, exact nodes, source/monitor
requested and sampled positions, displacements, precedence and memory plan.
Save the original Project dictionary and boundary override together to recreate
this calculation. Ordinary native simulation of the original Project still
uses its original boundary conditions.

```python
import json
from torchfdtd.endpoint_project import endpoint_from_project

bundle = json.load(open("endpoint-scene.json", encoding="utf-8"))
adapter = endpoint_from_project(
    bundle["project"], boundary_faces=bundle["boundary_faces"],
    device="cpu", checkpoints=4, tensor_budget_bytes=128_000_000,
)
print(json.dumps(adapter.plan(), indent=2))
result = adapter()  # native DifferentiableResult, with .signals and .spectrum()
# Optional sampled epsilon and per-source-term waveform tensors keep gradients:
# result = adapter(epsilon=sampled_epsilon, waveforms=source_waveforms)
```

Supported native inputs are fixed uniform or explicitly supplied nonuniform
3D meshes, real FP32, staircase analytic solids, Yee sampling, nondispersive
isotropic native materials, point soft electric sources, and point E/H monitors
at every timestep. Native pulse/global-source settings and polarization weights
produce waveform columns in the reported source-term order. The source contract
is the resident solver's additive electric field increment, not current density.
Nearest Yee selection uses each component's physical nodal/half-cell axes,
including true upper endpoints. Exact ties select the lower coordinate. Requests
outside the physical mesh or landing on constrained PEC nodes are rejected,
not shifted to an interior active DOF. Coincident source terms mapping to the
same component/DOF are rejected, not silently merged. Disabled sources/monitors
must be removed explicitly. Disabled structures are skipped and reported.

Default material rasterization evaluates native analytic solid membership at
original FP64 mesh coordinates in bounded CPU NumPy chunks, including every
upper electric face/edge. Lower mesh order wins and later objects win equal
orders, matching the native material precedence. This fixed staircase rasterizer
is not a differentiable shape sampler. Supply packed sampled epsilon linked to
a differentiable sampler for material/shape parameter gradients. The separately
named `host_preparation_budget_bytes` (default 64 MB) admits conservative chunk
scratch and native pulse preparation before rasterization/waveform creation.
These CPU temporaries are separate from the resident tensor budget. Existing
Project objects, Python/runtime overhead and caller parameterization graphs are
not included in that preparation bound. Defaults are generated on demand rather
than retaining unused duplicate material/waveform tensors when overrides exist.

Material-aware graded/automatic mesh generation is rejected. Native subpixel,
ADE, complex fields, spatial quadrature/field monitors, plane/mode/current/TFSF
sources, monitor downsampling, adaptive stop and spatial streaming remain
unsupported. Public Project edits require rebuilding the adapter. The familiar
Project geometry can still be inspected in the native CAD, but its PMC override
and endpoint sampling report have no browser editor yet.

Seven focused CPU tests validate Project/dictionary parsing, independent full
endpoint rasterization and native base-volume agreement, native pulse samples,
actual native-compatible traces, material and waveform derivatives, disabled/
wall/unsupported admission, preparation budgets, polarization-term mapping, and
fixed nonuniform node preservation, and coincident-source rejection. The underlying resident solver's CUDA
kernels and adjoint are tested separately; this adapter adds no CUDA kernels.

Native Project validation now permits exact upper endpoint point positions
when the project selects the closed PMC dispatch. A nearest sample constrained
by an intersecting PEC face is still rejected. Other native boundary paths
retain their existing strict upper-coordinate validation.

## Native JSON, Simulation, CLI and local API dispatch

A Project with any `pmc` or `symmetric` face now selects the exact-endpoint
forward solver through ordinary `Simulation(project).run()`. All six faces must
be PEC/antisymmetric or PMC/symmetric. Native schema admission requires real
FP32 3D, fixed uniform or explicit meshes, staircase Yee sampling, resident
storage, nondispersive active materials, enabled point soft electric sources,
and enabled point E/H monitors sampled every step. At least one point monitor
is required. Source polarization terms must address unique active electric DOFs.
Mixed PML/periodic walls, ADE, subpixel, complex/FP64 fields, graded meshes,
plane/TFSF/current sources, disabled source/monitor entries, field monitors,
adaptive shutoff and streamed storage are rejected before dispatch. Ordinary
YeeGrid and BoundaryDescription also reject PMC, preventing unimplemented
adjoint, tensor-batch and streamed paths from silently using different walls.

```python
from torchfdtd import demo_project, Simulation
project = demo_project('pmc')  # 16 cubed, 160 steps, real FP32 CPU
project.save('pmc.json')
result = Simulation(project).run()
result.save('pmc.npz')
```

The same JSON runs with `torchfdtd run pmc.json --output pmc.npz` and the existing
local `/api/validate` and `/api/jobs` endpoints. Native pulse definitions,
source/monitor nearest-Yee sampling reports and analytic material rasterization
are shared with EndpointProject. The optional explicit override API remains
available. The familiar facade's boundary aliases and general parameterized
shape/adjoint dispatch are not expanded by this change.

Results use the existing Result, monitor spectra, progress frames and NPZ
workflow. Base `E`, `H`, epsilon images and slice frames deliberately crop upper
stored faces/edges for compatibility with the native volume display. True
endpoint data are never discarded: NPZ `endpoint_E_upper` and
`endpoint_H_upper` retain the suffixes. Concatenate each flattened base field
with its suffix and interpret `summary.endpoint_blocks` to recover the complete
packed topology. `Result.load()` retains these arrays in `endpoint_fields`.
Source and monitor requested/sampled coordinates remain in
`summary.endpoint_plan`. Display crops do not alter the solver or monitors.

Native forward admission selects its tensor budget from the complete conservative
endpoint tensor plan, including the resident EndpointSimulation workspace and
trace requirement. Total host preparation/results are planned separately. There
is no fixed 256 MB tensor or 64 MB total-host cap: native runs must fit 75% of
currently free GPU memory and 80% of available host memory when reported. CPU
runs include their solver tensor plan in the host check. Raster preparation
retains bounded 65,536-sample chunks, while pulse/result buffers are sized and
admitted for the actual project. Python topology objects, allocator/runtime
overhead and caller parameter graphs are excluded explicitly. The CPU
correctness backend remains limited to 32,768 cells. The separate EndpointProject
API retains its explicit caller-selected budget contract. Native CUDA dispatch uses direct kernels, not CUDA graph capture.
Diagnostics include the complete packed E/H states, including endpoints, as an
unweighted state-norm growth heuristic, not a conserved electromagnetic energy.
Field-limit and nonfinite checks, fixed-duration progress, and cancellation are
preserved. Automatic decay stopping remains unsupported.

`tests/test_endpoint_native.py` contains 14 focused CPU checks covering actual
native JSON/Simulation/CLI/API calculations, adapter trace agreement, complete
NPZ endpoint preservation, ordinary PEC path preservation, unsupported schema
and fallback guards, runtime field-limit/cancellation, and the native demo.
One additional native CPU/CUDA parity check passed on RTX 3060, comparing
traces, cropped fields/frames, complete upper DOFs and GPU NPZ roundtrip. No
full material/shape-gradient, general tensor-batch, or streamed PMC parity is
claimed by this forward integration.

A metadata-only 128-cubed CUDA planning regression exceeds the former fixed
caps, admits against a simulated 16 GB free GPU/32 GB available host, and
rejects insufficient GPU or host headroom. No large field allocation or
large-GPU capacity claim is involved in this admission test.

The SI editing facade also accepts `FDTD.set("x min bc", "PMC")` and
`"Symmetric"`/`"Symmetry"` aliases. As with other facade properties, sequential
region edits can temporarily leave an incomplete project. `save()` and `run()`
still validate the entire closed-cavity contract. A focused CPU workflow checks
editing, JSON save/load, actual propagation, retained endpoint results and
rejection of unsupported mixed-PML execution.

## Next mixed PMC/CPML execution gate

The minimum extension must split the current endpoint step into electric/psi-E
update, electric source injection, then magnetic/psi-H update. The existing
post-step magnetic correction for the electric source cannot call a stateful
CPML curl again. Psi-H must advance exactly once, and the waveform transpose
must include its cotangent.

Place each derivative's psi on the target Yee row, including intersections of
transverse PML slabs with upper PMC faces. Construct these intersections from
the endpoint block descriptors. PML termination uses finite PEC constraints,
while the last magnetic half-cell still needs its derivative to the zero outer
electric node. Reusing a volume stencil that omits that row is insufficient.
Keep the existing PMC endpoint metric and PEC projections in both operators.

For each derivative, use `psi_new=b*psi+c*d` and
`d_eff=d/kappa+psi_new`. Given curl cotangent `q` and future psi cotangent `p`,
the reverse is `u=p+q`, `psi_bar=b*u`, `d_bar=q/kappa+c*u`, followed by the
endpoint derivative transpose. Material gradients use the modified curl.
Checkpoint, reset, result and admission contracts must include all psi arrays.

Acceptance requires full-domain versus half-domain reflected fields and
objectives, physical PMC/PEC reflection signs and endpoint phases, matched
material/source gradients, and oblique-pulse decay at PMC/PML intersections.
PML profiles must be physically mirrored in the full/reduced comparison.
Report actual cell, psi, checkpoint and elapsed-time savings from halving the
mesh. Merely changing a boundary label is not a domain-reduction measurement.
