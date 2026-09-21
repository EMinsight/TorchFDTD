# Design workflow

`DesignProblem` (`torchfdtd.design_problem`) is the one public entry point that runs an
inverse design from objective to final re-evaluation on the existing differentiable APIs:

```
objective -> parameterization -> optimizer step -> history record -> resume -> fabrication
checks -> binary export -> re-import -> final evaluation at a finer mesh
```

It owns no solver. The objective is any callable that maps the parameterization's density
to a scalar Torch loss through `PeriodicLayerResponse`, `DifferentiablePlaneSimulation`,
`ModeNetwork` or another differentiable model, and the final evaluation is any object that
evaluates a density or a native structure list with a forward the caller built at a finer
mesh. The two examples below are executed by `tests/test_design_workflow.py` (short runs,
resume determinism) and judged by `tests/test_design_reimport.py` (three declared starts
each, gate tasks G6-05 to G6-07, cases [G6-05](validation/cases/G6-05.json),
[G6-06](validation/cases/G6-06.json) and [G6-07](validation/cases/G6-07.json)).

```python
from torchfdtd import DensityParameterization, DesignProblem, Continuation
import torch

design = DensityParameterization((30, 1), spacing_um=(.05, .25), filter_radius_um=.125, beta=4.)
problem = DesignProblem(design, objective, torch.optim.Adam(design.parameters(), lr=.1),
                        continuation=Continuation(every=4, factor=2., maximum=64.))
history = problem.run(24, checkpoint='scratch/design.pt', resume=True)
report = problem.fabrication(spacing_um=.05, min_linewidth_um=.1, min_gap_um=.1, perturbation_um=.05,
                             boundary=('periodic', 'extend'))
exported = problem.export('scratch/export', origin_um=(-.75, -.125), spacing_um=(.05, .25),
                          z_min_um=-.25, z_max_um=.25, material='tio2-like')
final = problem.final_evaluation(evaluator, exported)
```

## Interface

- `objective(density)` returns the loss to minimize, or `(loss, metrics)`; the metrics
  (floats) enter the history, never the gradient.
- `step()` records `iteration`, `objective`, `metrics`, `gradient_norm`, `beta` (used) and
  `beta_next`, then applies the optimizer, the box projection of a direct-density
  parameterization, and the `Continuation` (`every`, `factor`, `maximum`) which calls
  `DensityParameterization.advance_beta`.
- `run(iterations, checkpoint, resume)` advances to the total count and saves the state
  after every step; the state holds the parameterization `state_dict` (its configuration
  is checked on load), the optimizer state, the Torch RNG state, the history and a
  fingerprint of the problem. A resumed run reproduces the uninterrupted history bitwise on
  the CPU; the tests assert it on the toy problem and on both FDTD examples.
- `fabrication(spacing_um, min_linewidth_um, min_gap_um, perturbation_um, boundary)`
  thresholds the density, measures the minimum linewidth and gap by morphological opening
  (`fabrication.measure_feature_sizes`), names the violated constraints, and evaluates the
  objective on the eroded and the dilated binary design by the declared amount
  (`fabrication_perturbation`), recording the objective change of each.
- `export(directory, origin_um, spacing_um, z_min_um, z_max_um, material)` writes the binary
  design as native rectangles (`fabrication.binary_structures`, JSON of `Structure`) and as
  GDS (`export_gds`) with the layer-stack sidecar; `reimport(exported)` reads both back
  through `Structure.model_validate` and `import_gds`.
- `final_evaluation(evaluator, exported)` calls `evaluator.evaluate_density` on the smooth and
  on the thresholded density, `evaluator.evaluate_structures` on the re-imported rectangles
  and on the GDS polygons, optionally `evaluator.evaluate_holdout` on the GDS polygons, and
  records every stage with the metric differences between consecutive stages: mesh
  refinement, thresholding, smoothing (staircase structures against the volume-averaged
  binary density) and the GDS path. A negative difference of a maximized metric is a loss.

## Fabrication constraints

The filter radius of `DensityParameterization` bounds the smoothness of the continuous
density; it does not bound the minimum feature of the thresholded design, because the
projection and the threshold can leave a one-pixel line or gap wherever the filtered density
crosses one half. `measure_feature_sizes` therefore measures the binarized design: the
minimum linewidth is the largest digital-square side whose morphological opening leaves the
solid unchanged, the minimum gap the same on the void, so a feature of L pixels measures
exactly L pixels (squares rather than disks, which would report right-angle corners as
narrower than their rectangle). `boundary` is `'periodic'` (wrap) or `'extend'` (continue the
edge pixel outward) per axis. `tests/test_design_workflow.py` shows two blocks through a
150 nm filter radius and a hard projection that keep a 100 nm gap: the design satisfies the
filter radius and is reported as violating a 150 nm minimum gap. The perturbation is the
erosion and dilation of the binary design by a whole number of pixels; the objective
evaluated on both is recorded with its change from the nominal binary design.

## Export and re-import

Solid pixels become native rectangles (runs along x merged, equal runs merged along y),
widened by 1e-9 um so that a Yee node on a pixel edge is material whichever side it rounds
to; the widening vanishes at the 1 nm GDS precision. `export_gds` writes them, `import_gds`
reads them back as polygons whose boundary is material, and both voxelize identically on a
mesh whose nodes lie on the pixel edges, so the recorded GDS difference of both examples is
zero. The smoothing difference is not zero: the density transfers (`periodic_density_layer`,
`bounded_density_layer`) volume-average the binary pixels over each component's Yee cell,
while the re-imported structures are staircased at the component positions.

## Examples

Both examples are thin periodic slabs of five coarse cells along the invariant axis, so
they are two-dimensional problems on the three-dimensional solver, and both run on the CPU.

`examples/design_metagrating.py`: a 30-pixel (50 nm) density of a 0.5 um high layer of
epsilon 4 in air over a 1.5 um period deflects a normally incident 1.0 um plane wave into
the +1 transmitted order. Objective: the +1 efficiency at 1.0 um (`diffraction_efficiency`
against the background reference of the same `DifferentiablePlaneSimulation`); holdout: the
+1 efficiency at 0.95 um from the same run, never optimized. Coarse mesh 50 nm and 800 steps;
final evaluation at 25 nm and 1600 steps. Filter radius 125 nm, beta 4 doubled every 4 steps
to 64, Adam at 0.1, initial logits `0.5 * randn` from the declared seed.

`examples/design_mode_coupler.py`: two slab guides (epsilon 4 in 2.25, 0.6 um wide) offset
by 0.6 um from each other, the left one at y in (0, 0.6) um and the right one at y in
(-0.6, 0) um, each a fixed-mode port of a two-port `ModeNetwork` with its own calibration
section (`port_permittivities`), are joined by a 6 by 10 pixel (200 nm) design box whose
density selects cladding or core; the transfer is `bounded_density_layer` on the base
epsilon assembled from the two `reference_epsilon` guides. Objective: |S21|^2 at 1.55 um;
holdout: |S21|^2 at 1.50 um of the final GDS design through a second network at that
wavelength, never optimized. Coarse mesh 200 nm and 500 steps; final evaluation at 100 nm and
1000 steps. A 180-degree rotation symmetry maps the left guide onto the right one; filter
radius 400 nm, the same continuation and optimizer.

## Recorded starts

<!-- g6:records begin -->

Rendered by `scripts/render_design_workflow.py` from `docs/validation/g6/*.json`; a difference is the metric after a stage minus before it (mesh: fine smooth minus coarse last; threshold: binary minus smooth; smoothing: staircase structures minus volume-averaged binary; GDS: polygons minus structures), so a negative value is a loss. dJ is the change of the coarse objective (a loss to be minimized) under a one-pixel erosion or dilation.

### metagrating: 3 starts, 24 iterations each

Judged metric `efficiency` at the fine GDS stage, threshold 0.35; holdout `holdout_efficiency` threshold 0.15.

| Seed | Coarse last | Fine smooth | Fine binary | Fine structures | Fine GDS | Holdout | Mesh | Threshold | Smoothing | GDS | Linewidth (px) | Gap (px) | Violations | Erosion dJ | Dilation dJ | Wall time (s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.5531 | 0.5669 | 0.5695 | 0.4985 | 0.4985 | 0.5917 | 0.0116 | 0.0026 | -0.0711 | 0.0000 | 4 | 2 | none | 0.2653 | 0.1606 | 303 |
| 2 | 0.5837 | 0.5814 | 0.5509 | 0.5185 | 0.5185 | 0.2765 | -0.0141 | -0.0305 | -0.0324 | 0.0000 | 2 | 2 | none | 0.2170 | 0.1289 | 283 |
| 3 | 0.4554 | 0.4244 | 0.4204 | 0.4684 | 0.4684 | 0.4731 | -0.0310 | -0.0040 | 0.0480 | 0.0000 | 17 | 13 | none | 0.2065 | 0.0165 | 290 |

### coupler: 3 starts, 16 iterations each

Judged metric `transmission` at the fine GDS stage, threshold 0.5; holdout `holdout_transmission` threshold 0.45.

| Seed | Coarse last | Fine smooth | Fine binary | Fine structures | Fine GDS | Holdout | Mesh | Threshold | Smoothing | GDS | Linewidth (px) | Gap (px) | Violations | Erosion dJ | Dilation dJ | Wall time (s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.6980 | 0.6132 | 0.6100 | 0.6136 | 0.6136 | 0.5783 | -0.0871 | -0.0032 | 0.0036 | 0.0000 | 1 | 1 | min_linewidth, min_gap | 0.2860 | 0.0979 | 321 |
| 2 | 0.7223 | 0.6226 | 0.6244 | 0.5760 | 0.5760 | 0.5562 | -0.1056 | 0.0018 | -0.0484 | 0.0000 | 1 | 2 | min_linewidth | 0.2637 | 0.2094 | 356 |
| 3 | 0.7252 | 0.6167 | 0.6244 | 0.5760 | 0.5760 | 0.5562 | -0.1148 | 0.0077 | -0.0484 | 0.0000 | 1 | 2 | min_linewidth | 0.2637 | 0.2094 | 302 |

<!-- g6:records end -->

## Limits

The examples are demonstrations of the interface, not converged device designs: the coarse
meshes resolve the core wavelength with about 4 (coupler) and 10 (metagrating) cells, the
iteration counts are small, and the mesh-refinement differences in the tables above are the
measured cost of that. The fabrication measurement is exact on the pixel grid and says nothing
about sub-pixel lithography; the perturbation moves whole pixels. Neither the eigenmode nor
the reference planes are design variables (see [PORTS.md](PORTS.md)).
