# Torch density parameterization

`DensityParameterization` is an ordinary `torch.nn.Module` with one trainable
2D tensor. Its output feeds `PeriodicLayerResponse` or `streamed_density_layer`
without detaching the optimizer graph or constructing a 3D material map.
FP32 is the default. Keep the module on CPU for direct use with streamed FDTD.

```python
import torch
from torchfdtd.design_parameterization import DensityParameterization

design = DensityParameterization(
    (32, 32), spacing_um=(0.04, 0.04), mode='logits', initial=0.,
    filter_radius_um=0.12, boundary='periodic', symmetry='mirror_xy',
    beta=2., eta=0.5,
)
optimizer = torch.optim.Adam(design.parameters(), lr=0.02)
optimizer.zero_grad()
density = design()                     # ordinary differentiable CPU (32,32) tensor
response = periodic_response(density)  # an existing PeriodicLayerResponse instance
loss = objective(response)
loss.backward()
optimizer.step()

# Continuation is a user decision, never an implicit effect of forward().
design.advance_beta(2., maximum=16.)
```

`initial` means raw logits in `mode='logits'`, where zero gives density 0.5.
In `mode='density'`, it means a starting density in [0,1]. Logits use sigmoid.
Direct-density parameters use a forward clamp, which does not modify the
optimizer parameter and has zero derivative outside the box. Call
`design.project_parameters_()` explicitly after an optimizer step if box
projection is part of the chosen optimization algorithm. This method is only
available in direct-density mode.

The transformation order is bounded density, fixed values, spatial filter,
symmetry averaging, smooth projection, then exact fixed values again. Masked
parameters have zero gradient even through neighboring filtered pixels.

## Physical filtering and symmetry

The cone filter assigns weight `max(0, 1 - distance/radius)` using
`spacing_um=(dx,dy)`. Radius zero is identity. Distances and radius are physical
micrometre lengths, not counts of design pixels.
Choose spacing from the physical design span divided by its density counts,
not automatically from the FDTD mesh spacing.

- `boundary='periodic'` uses minimum-image xy distances. Each design pixel is
  counted once, including when the radius exceeds the cell period.
- `boundary='truncate'` ignores outside-domain pixels and renormalizes the
  remaining weights at each target pixel. It preserves constant density near
  edges and does not assume zero-valued material outside the domain.

Available symmetry groups are `none`, `mirror_x`, `mirror_y`, `mirror_xy`,
`rotate180`, `rotate90` and `dihedral4`. Reflections reverse the corresponding
array axis about the domain center. Quarter-turn rotation and dihedral symmetry
require a square array with identical x/y physical spacing. Symmetry computes
one average per pixel orbit and gathers that value to all orbit members, making
the output constraint exact while retaining the ordinary transpose gradient.
These array reversals use centered cell pixels, matching the downstream
`cell_edges` density origin. A `sample_centers` density origin shifts the
physical symmetry axes by half a density pixel and must be interpreted accordingly.

`fixed_mask` is a boolean array of the design shape. `fixed_values` is a scalar
or matching array in [0,1]. Masks and values must respect the chosen symmetry,
otherwise construction fails. Masks are fixed configuration buffers, not
trainable inputs.

These filters and symmetries do not guarantee minimum linewidth, minimum gap,
connectivity, robustness to fabrication variation or manufacturability. Such
requirements need separate constraints and validation.

## Projection and continuation

For filtered, symmetrized density `r`, the smooth projection is

```text
[tanh(beta*eta) + tanh(beta*(r-eta))]
--------------------------------------------------
[tanh(beta*eta) + tanh(beta*(1-eta))]
```

`beta=0` is the identity limit. Eta must lie strictly between zero and one.
Higher beta sharpens the transition. Each finite-beta forward remains
differentiable with respect to the design parameters. Larger beta can also
saturate gradients, so the module does not choose a continuation schedule.
Use `set_beta(value)` or `advance_beta(factor, maximum=...)` at explicit points
in your optimization loop. These calls update the serialized beta and update
counter. Forward calls never advance them.

`design(hard=True)` thresholds the final soft density at 0.5 and has no design
derivative. To request a surrogate explicitly, use
`design(hard=True, straight_through=True)`. Its values are binary but its backward
uses the smooth parameterization derivative. It is not the derivative of the
hard threshold. `gradient_semantics(...)` reports the distinction, including
the label `straight-through surrogate of smooth density`. Binary hard outputs
reject nonbinary fixed values rather than violating the fixed constraint.

## Serialization and a runnable optical example

Save the module and optimizer states together. `state_dict()` includes the
trainable tensor, masks, physical filter buffers, symmetry mapping, beta, eta,
continuation counter and configuration metadata. Reconstruct the module with
the same shape, spacing, filter, boundary, symmetry and parameter mode before
loading. Incompatible physical configuration is rejected before the module's
parameters are overwritten. The same check applies inside a parent module.
Optimizer state remains the optimizer's responsibility.
Bitwise resume additionally requires the same precision, backend and Torch
determinism settings, as with an ordinary Torch optimization.

```python
torch.save({'design': design.state_dict(),
            'optimizer': optimizer.state_dict()}, 'design.pt')
saved = torch.load('design.pt', weights_only=True)
design.load_state_dict(saved['design'])
optimizer.load_state_dict(saved['optimizer'])
```

Run `python -m examples.parameterized_density --iterations 2` for a small CPU
example that sends parameterized density through the actual streamed periodic
solver, differentiates a coupled optical objective and takes SGD steps. Add
`--checkpoint scratch/design.pt`, then `--resume` with a larger total iteration
count to preserve optimizer and beta state. Its deliberately small grid and
short run are an integration example, not an optically converged design.

Tests cover independent physical-filter averages, exact constraints, symmetry
directional derivatives, masks, hard-surrogate semantics, checkpoint/resume and
a real streamed FDTD optimizer connection. No remote research inputs or frozen
CR jobs are used. Polygon/spline rasterization and fabrication guarantees are
outside this module.
