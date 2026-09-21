# Identity conditions

Three questions come up whenever a computed record is reused: may this
run serve as the matched reference of that one (reference compatibility), may
this stored result stand in for a new run (cache validity), and may this
journal continue that interrupted run (restart contract)? Each is a
different equality, and each is answered here by a key computed from the
resolved plan (`torchfdtd.identity`). The keys are pure functions; the
caches, references and journals that hold state apply them.

## The plan

`torchfdtd.plan.resolve_plan(project)` runs the existing resolvers once and
freezes their outputs in a `SimulationPlan`: realized mesh nodes and the six
Yee component coordinates, `dt`, the step count, the run-control settings the
automatic shutoff reads (`auto_shutoff` and, when it is on, the decay threshold,
check interval, consecutive checks, minimum steps, source tail amplitude and
post-source delay; the divergence checks abort a run and are not hashed) and the
half-step convention,
the per-face boundary kinds with the CPML profiles (`kappa`, `sigma`,
`alpha`) and update coefficients (`b`, `c`) of every segment, the Bloch
phases and wrap factors, the ADE coefficients of every dispersive material,
the rasterization inputs of the sampled material (its voxel arrays are
materialized on demand as `plan.material`), every enabled source's realized
support, sampled waveform, sample times and Bloch profile, every monitor's
quadrature points, weights, interpolation maps, frequency samples and
apodization, and the resource estimate. `Simulation`,
`DifferentiableSimulation`, `StreamedSimulation`,
`DifferentiablePlaneSimulation`, `run_tensor_batch` and `/api/validate`
expose the same `plan_hash` for one project; `Simulation` and the tensor
batch run from the plan's material and source terms and verify the prepared
grid and frequency planes against it; the differentiable wrappers fix the
scene and its realized nodes at construction and raise `PlanInvalidated`
when either changes before a forward call.

The canonical serialization has the sections `mesh`, `time`, `exterior`,
`material`, `sources` and `monitors` (`plan.sections`). Object ids, names,
raw settings whose effect is already hashed through what they produce, the
placement (`backend`, `cuda_kernel`, `cuda_monitor_kernel`, `memory_mode`,
`execution_mode`, `tiling`, `precision`), the display settings and the
resource estimate are carried but not hashed. `plan_hash` is the SHA-256 of
all six sections; `plan.diff(other)` names the differing keys.

## The three conditions

| Condition | Sections hashed | Also hashed | Key |
| --- | --- | --- | --- |
| Reference compatibility | `mesh`, `time`, `exterior`, `sources` | observation geometry of the field monitors: normal, points, weights, shape, interpolation maps, time downsampling, DFT precision, apodization | `reference_key(plan)` |
| Cache validity | reference sections plus `material`, `monitors` | `precision` | `cache_key(plan)` |
| Restart contract | cache sections | kernel scheme (`cuda_kernel`, `cuda_monitor_kernel`), the exact epsilon tensor (bytes, shape, dtype), the execution options (without the journal path and cadence), the runtime source hashes, the torch version | `restart_key(plan, epsilon=..., options=...)` |

`exterior` holds the background index, the boundary faces, every CPML
coefficient array and the PML dispersion mode (`pml_dispersion`); `material` holds the sampling mode, the interface method
and quadrature, the enabled structures with their rasterization order, the
effective parameters of the materials they use and the ADE coefficients.

What each change invalidates (`invalidated(before, after)`), as
`tests/test_identity.py` fixes it:

| Change | Reference | Cache | Restart |
| --- | --- | --- | --- |
| ids, names, colors, project name | | | |
| placement: backend, memory mode, execution mode, tiling; display fields | | | |
| precision | | yes | yes |
| kernel scheme: `cuda_kernel`, `cuda_monitor_kernel` | | | yes |
| sampled material: structure geometry, structure removed (air reference), material parameters, interface method | | yes | yes |
| effective waveform: amplitude, phase, source position, polarization | yes | yes | yes |
| a source setting the sampled waveform does not read | | | |
| mesh nodes, time step, step count | yes | yes | yes |
| automatic shutoff and its decay settings (`run_control`) | yes | yes | yes |
| a divergence check setting (`field_limit`, `growth_limit`) | | | |
| background index, PML profile, Bloch phase | yes | yes | yes |
| PML dispersion mode (`pml_dispersion`) | yes | yes | yes |
| field-monitor geometry, downsampling, apodization | yes | yes | yes |
| field-monitor frequency samples, point-monitor position | | yes | yes |
| the epsilon tensor handed to a differentiable run | | | yes |
| streamed execution options (device, slab width, ...) | | | yes |

A scatterer and its matched reference (the same project with the structures
removed, on a frozen mesh) share the reference key; an unfrozen scatterer
whose automatic refinement re-meshes does not.

## Deterministic replay

Two runs of one plan on the CPU are bitwise equal: signals, final E and H,
snapshot frames, plane fields and flux. Two runs of one plan on CUDA, with
the torch or the fused kernel, agree within the fp32 discrete threshold of
`docs/validation/completion_gates.json`, `rtol 1e-4` and `atol 1e-6`;
bitwise CUDA agreement is observed but not promised.

## Relation to the existing keys

- `torchfdtd.adjoint_planes._plane_signature` is today's reference
  compatibility and `_run_fingerprint` today's cache key of the differentiable
  planes. The plan keys agree with them on every row of the table above
  except three, where the plan keys hash what the run reads: a source
  setting the waveform does not read changes both legacy keys but neither
  plan key; the monitors' frequency samples and the point monitors change
  the plan cache key but not the legacy fingerprint, which leaves observation
  samples to the caller (`PlaneReferenceCache` keys them separately).
- `torchfdtd.streamed_restart.journal_contract` is today's restart
  contract. It hashes the project JSON without ids, so a renamed object or a
  changed placement invalidates an existing journal although the run it
  continues is unchanged; the plan-based `restart_key` invalidates neither.
  Moving the journal to `restart_key` is a change of `streamed_restart.py`
  and belongs with the G1-04 restart work, not here.
- `torchfdtd.solver.run_signature` (native frequency planes) hashes the
  region without placement and display fields, the resolved sources and the
  realized nodes; like `_plane_signature` it changes with settings the
  waveform does not read.

## Tests

`tests/test_identity.py`:

- `test_each_change_invalidates_exactly_the_declared_conditions[...]`: one
  instance per row of the table, asserting the invalidated set and the
  behaviour of the two legacy keys.
- `test_scatterer_and_its_air_reference_share_the_reference_key_on_a_graded_mesh`.
- `test_restart_contract_covers_epsilon_options_and_kernel_scheme_only`.
- `test_two_cpu_runs_of_one_plan_are_bitwise_equal`.
- `test_two_cuda_runs_of_one_plan_agree_within_the_declared_tolerance[torch|fused]`.
