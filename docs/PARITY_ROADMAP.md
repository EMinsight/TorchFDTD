# Replacement requirements and remaining work

The goal is a familiar, independently implemented photonics workbench with
complete Python access and native GPU execution for the required linear-photonics workflows. The current goal implements required checklist items in priority order, activates conditional items only for concrete use cases and excludes product-specific replication. It is not yet a complete
Lumerical replacement. The detailed record is the [feature checklist](FEATURE_CHECKLIST.md).
The [ordered priorities](IMPLEMENTATION_PRIORITIES.md) distinguish necessary,
conditional and deliberately excluded scope for every row.

Numerical validation uses analytic solutions, native CPU/GPU comparisons,
conservation identities and documented open reference methods. The user's
later exception allows aggregate historical timing facts in the local README,
with their accuracy and publication limits. It does not authorize restoring
retired commercial fields, waveform fixtures or comparison plots.

| Family | Current native scope | Open work |
| --- | --- | --- |
| CAD | Boxes, ellipsoids, elliptical cylinders/ring sectors, extruded simple polygons, ordered three-axis rotations and overlap order | General solids, paths, groups, builders, GDS/STL and hierarchical FSP transforms |
| Materials | Constant index, isotropic coupled multipole Drude/Lorentz, user sampled-data import and passive fitting with Python/UI error reports | Anisotropy and wider device validation. Magnetic/nonlinear/sheet response is conditional |
| Mesh | Uniform/static graded/explicit rectilinear, independent axis steps, Yee sampling, preview and Python convergence studies | Conformal/subpixel interfaces, subgrids, error-driven adaptation, GUI study runner |
| Boundaries | CPML, Periodic/Bloch | PEC/PMC, symmetry, BFAST, grazing/dispersive validation |
| Sources | Reduced electric/magnetic point/sheet, theta/phi, normal-incidence one-way planes and closed TFSF boxes, temporal controls | Oblique/finite-aperture planes, modes/ports, Gaussian beams, imported fields, calibration, general FSP source conversion, legacy rule provenance |
| Monitors | Point spectra, selective planar E/H/Poynting/flux, global/custom/Chebyshev, per-axis/time strides | Distributed time/volume, averaging, modes |
| Analysis | Controlled slab R/T, complex incident subtraction, fields/flux | General R/T/A, S-matrix, near-to-far, diffraction, resonance and radiation |
| Execution | CPU/CUDA/Graph, decay shutoff, diagnostics, process batches, real-field CUDA tensor cohorts and exact mixed-topology grouping | Restart, single-grid multi-GPU/MPI, complex/auto-stopping tensor cohorts and graphical batch control |
| Design | Sweeps, custom Python objectives, parallel differential evolution | Adjoint/autograd, fabrication constraints, more optimizers, graphical sweeps |
| Interoperability | Independent layout subset with explicit mesh, rotated primitives, polygon pivots and ellipse sectors. Mapped primitive/source/monitor list edits, existing geometry, uniform target meshes and a source/monitor/region settings subset can be written through Python/CLI/UI with retained-byte and ID maps | External acceptance of new records/remeshing, graded/user mesh-generator export, Use-case-dependent general FSP versions/results, unmapped source/monitor classes and general settings writeback, groups, contract/provenance |
| UI | Tree, CAD views, properties, materials, plots and Python export | Complete property coverage, frequency maps, grouping/results/resources |

## Required validation

1. Derive and test each new operator independently. Include analytic cases,
   convergence, phase and conservation where applicable.
2. Compare native CPU/CUDA and graph/eager with identical settings. Separate
   stepping-loop time from whole-workflow time.
3. Verify Python-only creation, execution and full result extraction.
4. Check batch independence, memory bounds, failures, cancellation and resume.
   Measure rather than assume same-GPU concurrency benefits.
5. Validate optimized devices on a finer independent mesh and a physically
   justified objective.
6. Resolve the release/provenance review. Legacy automatic pulse rules and
   FSP work require specific attention.

See the [acceptance record](ACCEPTANCE.md), [batch report](validation/BATCH_REPORT.md)
and [technical manuscript](paper/manuscript.tex) for the tested subset.
