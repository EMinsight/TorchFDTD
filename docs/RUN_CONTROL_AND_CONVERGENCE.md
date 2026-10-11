# Run control, multi-pole materials and mesh convergence

These settings are stored in the Python project model and travel with JSON save, Python export and NPZ results. Numerical validation uses native calculations and analytic solutions only.

## Automatic shutoff and divergence detection

```python
from torchfdtd import Project, Simulation, RunControl

project = Project.load("project.json")
project.region.steps = 4000  # maximum number of steps
project.region.run_control = RunControl(
    auto_shutoff=True,
    decay_threshold=1e-6,
    check_interval=50,
    consecutive_checks=3,
    min_steps=100,
    source_tail_amplitude=1e-8,
    after_source_s=0,
    divergence_check=True,
    growth_limit=1e6,
    field_limit=None,
)
result = Simulation(project).run()
print(result.summary["termination_reason"])
print(result.summary["steps"], result.summary["requested_steps"])
result.save("result.npz")
```

Automatic shutoff is off by default. The divergence check runs every 50 steps by default. The same settings are edited in the workbench under Simulation → **Termination and diagnostics**.

The termination reason is `max_steps`, `decayed` or `cancelled`. `decayed` is a normal completion, and batch objectives are evaluated for it. Traces and time arrays are returned up to the last completed step, and the snapshot just before an automatic shutoff is saved. Divergence raises an exception and is reported as failed in a batch.

The diagnostic is a positive norm of the cell-volume-weighted E/H fields and the stored passive-oscillator states. It does not test a zero of a single E component or one displayed slice. The material term includes `(|Q/dt|² + omega_0² |P|²) / A`. Non-finite CPML states are checked as well. The value is neither an SI energy nor a strict discrete conserved quantity, and it is not an upper bound on the DFT error.

The shutoff check starts only after the envelope of every finite source has ended. A Gaussian source waits until the given tail amplitude; a sampled source waits until the last time of its table. A source that switches on late and a silent stretch inside a sampled source are not skipped. A continuous-wave source keeps decay shutoff from triggering. `after_source_s` and `min_steps` add further waiting conditions.

A sustained decay is measured against the largest norm seen before the sources end. The relative growth limit for divergence applies to a reference fixed after the sources end. While a source drives the fields it supplies energy, so relative growth alone is not treated as divergence. A `field_limit` in reduced field units can be set when needed.

In a CUDA environment with CuPy, two read-only reduction kernels are used. They handle float32/64, complex fields, graded volumes and multipole states, and promote to double before squaring and summing. No double copy of a whole field is made. `diagnostic_backend` reports the path taken. `diagnostic_seconds` is the **host wall time** spent in diagnostic calls, which includes waiting for GPU steps queued earlier. It is not the pure diagnostic kernel time or the added overhead; measure the overhead by comparing the same fixed length with the diagnostic on and off.

A current-type soft dipole whose time integral is not zero can leave a static residual field. A run with a strict threshold then correctly does not shut off and ends at the maximum step. The [Meep source description](https://meep.readthedocs.io/en/master/Python_User_Interface/) also distinguishes the dipole moment from the integral of the current. The native validation records both the residual case of the original Gaussian and a zero-integral sampled current built from the discrete difference of a finite dipole pulse. Existing source definitions and shutoff thresholds are never changed silently. [Measurements](validation/RUN_CONTROL_REPORT.md).

High-Q resonances and weak signals need a stricter threshold and a longer time. A sample and a reference that shut off at different step counts do not have matching normalization signatures. For R/T comparisons use the same fixed time, or rerun both calculations to the actual shutoff step. Automatic shutoff alone does not prove spectral convergence. The [Meep FAQ](https://meep.readthedocs.io/en/latest/FAQ/) also explains how the time length affects Fourier convergence.

## Manual multi-pole materials

```python
from torchfdtd import Material, LorentzPole

material = Material(
    name="Passive multi-pole example", model="multipole", epsilon_inf=2,
    poles=[
        LorentzPole(resonance_rad_s=0, strength_rad_s_squared=1e30,
                    damping_rad_s=6e14),
        LorentzPole(resonance_rad_s=2e15, strength_rad_s_squared=4e30,
                    damping_rad_s=4e14),
    ],
)
project.materials.append(material)
```

The frequency response is `epsilon_inf + sum(A_j / (omega_j² - omega² - i gamma_j omega))`. `resonance_rad_s=0` gives a Drude term. Every A is positive, damping is zero or more, and up to 16 poles are supported. All frequency parameters are angular SI units. In the earlier Lorentz input, `linewidth_rad_s` is half the damping; `damping_rad_s` of a new pole is the gamma of the formula itself.

The common electric field is solved first, and then each P/Q state is updated; per-pole corrections are not applied to E one after another. The calculation order and values of the existing single-pole path are kept. CPU/CUDA, real and Bloch-complex, graph and eager, and the real fused-kernel path all use the same sparse ADE. The memory estimate accounts for the number of poles.

In the workbench, Materials → **Multiple Drude / Lorentz poles** adds, deletes and edits poles and shows n/k and the timestep-dependent ADE response. This is a model in which the user enters the pole coefficients. Spatial discretization, interface and PML stability need to be validated separately from the continuous susceptibility. [Meep Materials](https://meep.readthedocs.io/en/latest/Materials/) describes the common dispersive susceptibility forms.

## Mesh convergence at the same physical conditions

```python
from torchfdtd import mesh_convergence, normalize_flux

reference = project.model_copy(deep=True)
reference.structures = []

def transmission(sample, reference_result):
    values = normalize_flux(sample.field_monitor("transmission"),
                            reference_result.field_monitor("transmission"))
    if not values["valid"].all():
        raise ValueError("Reference signal is too weak")
    return {"transmission": values["ratio"]}

study = mesh_convergence(
    project, [.05, .025, .0125], transmission,
    reference_project=reference,
    rtol=0, atol=.006, consecutive=2,
    output_dir="results/convergence",
)
print(study.status)
```

Runnable example:

```bash
python -m examples.mesh_convergence --backend cpu
python -m examples.mesh_convergence --backend cuda
```

Refining the grid with the same step count shortens the physical simulation time. This API recomputes the step count so that the original `steps * dt` is kept. Rounding up changes the time by less than one timestep, and the report records the actual time. A region size or PML physical thickness that is not an integer multiple of each spacing is rejected explicitly. The existing model limits on PML layers and total steps still apply.

The default is a uniform mesh. With `mesh_type="graded"`, the same graded algorithm is evaluated at every stage. The matched reference freezes the refinements of each sample so that both use the same node arrays. Source and monitor definitions must also match, and `normalize_flux` checks the final signature. Automatic shutoff is off in this study, so sample and reference keep the same time length.

The observable must return a finite real scalar, an array, or a mapping by name, with the same names and array shapes at every stage. The study is `converged` when the last consecutive comparisons all satisfy `abs(a-b) <= atol + rtol * max(abs(a), abs(b))`. Cancellation and invalid values are never reported as success. The report holds each grid, the actual time, the observables, their changes, the compute cost and a summary. An optional output folder receives the sample/reference NPZ files and `convergence.json`.

Agreement between stages alone does not prove the error against an analytic solution. Fix the wavelength table and choose a normalized physical quantity. An unnormalized point-source peak, whose physical dipole strength can change with the grid, is not a transmission.

`mesh_refinement_projects(project, meshes)` builds only the list of projects with matched conditions. Wrapped in `BatchCase` and handed to the existing `BatchRunner`, they run as an independent parallel sweep with memory admission. `mesh_convergence` processes one stage's sample and reference at a time, so it never keeps all large final field arrays in memory.
