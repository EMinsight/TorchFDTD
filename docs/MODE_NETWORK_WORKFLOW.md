# Native CAD mode-network workflow

The browser and Python use the same versioned `ModeNetworkConfig`. It owns a
snapshot of a native `Project`, two fixed opposing ports, execution budgets,
an optional complex S objective, and selected material-permittivity derivatives.
Geometry and overlap precedence are sampled by the native Yee rasterizer.
No user-supplied Python callback or vendor runtime is needed.

## Python

```python
from pathlib import Path
from torchfdtd import ModeNetworkConfig, mode_network_plan, run_mode_network

config = ModeNetworkConfig.model_validate_json(
    Path("examples/open_mode_network.json").read_text(encoding="utf8")
)
config.execution.device = "cuda"  # or "cpu"
plan = mode_network_plan(config)
result = run_mode_network(config)
print(result["channels"], result["s_real"], result["s_imag"])
print(result["material_gradients"])
```

The [native CAD example](../examples/open_mode_network_project.py) creates an
open slab guide and an interior dielectric object. It can export its setup or
execute the same workflow without the browser:

```sh
python -m examples.open_mode_network_project --export-config setup.json
python -m examples.open_mode_network_project --device cuda --output results/modes.json
```

`objective.quantity` selects `real`, `imag` or `power` for one S entry.
`differentiate_materials` selects named materials. The derivative is with
respect to relative permittivity epsilon, not refractive index, geometric
dimensions, the mode profile or the port position. A material shared by several
objects receives the sum over its allowed interior cells. Source, calibration,
port exterior and CPML regions remain fixed. The wrapper returns ordinary JSON
and releases its field graph. The lower-level [ModeNetwork](MODE_NETWORK.md)
retains the tensor interface for constructing custom PyTorch objectives.

## Browser

Start `torchfdtd serve`, open **Mode ports**, and import the example setup.
The editor accepts named phase/source planes, mode indices, the carrier and
pulse duration, device and memory limits, the objective and selected materials.
**Validate setup** performs metadata and capacity checks. It does not solve
the eigenproblem or validate optical confinement. **Run mode network** prepares
the modes and checks the actual exterior material before FDTD allocation.

The completed view shows the complex S matrix, channel order, phase planes,
selected objective and material derivatives. NPZ contains a complex64 matrix,
FP32 real/imaginary matrices and the complete JSON record. CSV contains channel
pairs, real/imaginary S and power. Setup JSON and a runnable Python script can
be exported independently of the result.

The setup owns its Project copy. Editing the main scene does not silently alter
that copy. Editing a submitted setup invalidates its displayed result and never
automatically submits another calculation. The shared native queue allows one
active job and two waiting jobs. Closing the editor requests cancellation of
its owned run. Running modal jobs use a separately spawned process, which the
server terminates and reaps on cancellation. Cancelled or failed jobs do not
publish result files. Cancellation and final publication share the same lock,
including cancellation through the general job-list endpoint.

## Admission and current restrictions

The supported scope is uniform 3D FP32, staircase Yee-sampled, real isotropic
nondispersive dielectrics, one soft Gaussian plane pulse and a longitudinal
PML pair. Transverse boundaries are zero-phase periodic or explicitly selected
open CPML guide boundaries. Exactly two opposing port groups are supported.
Plane placement, mode counts and fixed exterior regions are checked explicitly.

The planner reserves sparse mode preparation, source packets, plane layouts,
native voxelization, material-table graphs, field/checkpoint storage and compact
JSON serialization. Host and GPU reservations are combined before allocation
and checked again after mode preparation. Complete result-JSON admission is
separate from S-array bytes. These conservative allocation estimates do not
measure total process RSS or promise that external libraries use no extra memory.

This workflow does not provide arbitrary branch ports, leaky-mode normalization,
mode-profile gradients, dispersive/tensor modes, spatially streamed modal
injection, wavelength sweeps or a browser optimizer for geometry. The existing
density optimizer is a separate workflow.

## Recorded checks

The focused set contains 33 passing CPU contract/integration cases, including
native CAD sampling and S/VJP equivalence to a directly assembled network,
pre-allocation failures, live readmission, actual process ownership, alternate
cancel routes and result publication races. Five browser cases pass across
targeted runs. The actual browser case executes the imported open-guide setup,
computes a nonzero material derivative and downloads NPZ, CSV and Python.

For the same 20 by 5 by 30 grid and 420-step Project, the native CUDA wrapper
differs from the CPU browser result by at most 1.43e-7 in complex S. The selected
epsilon derivative is 0.2631390095 in both observed runs. This small example
checks workflow integration. Its coarse mesh is not an optical convergence
result, a memory-capacity test or a speed comparison. Independent mode physics
and physical-gradient evidence remain in [open modes](OPEN_MODE_PORTS.md) and
[the fixed-slab gradient gate](MODE_NETWORK_GRADIENT_ACCEPTANCE.md).

See the [workflow evidence](validation/mode_network_project_workflow.json).
Full CI for the new native workflow is recorded separately when it completes.
