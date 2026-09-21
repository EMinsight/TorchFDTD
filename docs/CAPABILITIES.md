# Capability tables

Generated from [torchfdtd/capabilities.py](../torchfdtd/capabilities.py) by
`scripts/build_capability_tables.py`; do not edit by hand. The same registry is served
to the workbench as the `combinations` block of `/api/capabilities` and is checked
against the code by [tests/test_capability_pairs.py](../tests/test_capability_pairs.py).
The Lumerical property inventory is a different document,
[FEATURE_CHECKLIST.md](FEATURE_CHECKLIST.md); this one states which combinations of
the solver contract run and which are rejected, and where.

## What a cell means

Every combination of one value per axis is one small scene (the recipe below) executed
through the entry point of its execution mode. A cell of an axis-pair table is admitted (✓)
when at least one full combination containing the two values runs; the count after the mark
is admitted combinations over all combinations with that pair. A rejected cell (✗) names the
rule that explains the pair (the most frequent rejecting rule whose condition names both axes,
else one of them); the rules table gives the code path and the exact
message prefix. "Rejected" is a contract, not a defect: the code refuses the input before
allocating fields, with that message.

Axes: 9. Combinations: 211,680 (11,878 admitted, 199,802 rejected). Rules: 86. Lanes: 25.

## Axes

| Axis | Values |
| --- | --- |
| Dimension | `2d` (2D), `3d` (3D) |
| Mesh | `uniform` (uniform), `graded` (graded), `explicit` (explicit nodes) |
| Material | `dielectric` (dielectric), `dispersive_ade` (dispersive ADE), `anisotropic_tensor` (anisotropic tensor), `tensor_ade` (tensor ADE), `pec` (PEC material) |
| Boundaries | `cpml` (CPML), `periodic` (periodic), `bloch` (Bloch), `pec` (PEC), `antisymmetric` (antisymmetric), `pmc` (PMC), `symmetric` (symmetric) |
| Source | `point` (point), `sheet` (sheet), `plane_oneway` (plane one-way), `tfsf` (TFSF), `mode` (mode), `tiled_sheet` (tiled sheet) |
| Monitor | `point` (point), `plane_dft` (plane DFT), `mode_port` (mode port), `radiation_box` (radiation box) |
| Execution | `forward` (forward), `checkpointed_adjoint` (checkpointed adjoint), `reversible_adjoint` (reversible adjoint), `streamed` (streamed), `streamed_adjoint` (streamed adjoint), `tensor_batch` (tensor batch), `tiled` (tiled) |
| Precision | `float32` (float32), `float64` (float64) |
| Backend | `cpu` (CPU), `cuda_torch` (CUDA Torch), `cuda_fused` (CUDA fused) |

## Scene recipe

* Region 2.4 x 2.4 um transverse and 2.4 um along the propagation axis d
  (z in 3D, y in 2D), mesh 0.1 um, 3 PML cells, 12 steps, Yee material
  sampling, staircase interfaces. ``graded`` refines the mesh around the
  structure (mesh_max 0.2 um, 6 points per wavelength); ``explicit`` freezes
  those graded nodes as fixed coordinates.
* The material sits in one block of 0.45 x 0.45 x 0.45 um at the centre; mode
  scenes (mode source or mode-port monitor) stretch it into a straight guide
  along d instead.
  ``dielectric`` is a constant index 2; ``dispersive_ade`` a two-pole
  Drude/Lorentz multipole material; ``anisotropic_tensor`` a symmetric tensor
  material; ``tensor_ade`` the same tensor material whose Lorentz pole is
  passed to the tensor-ADE API as explicit pole tensors; ``pec`` an ideal
  conductor material, which the schema does not offer.
* The boundary kind applies to every active face. Directional scenes (sheet,
  one-way, TFSF, mode and tiled-sheet sources, plane, mode-port and
  radiation-box monitors, tiled execution) carry CPML on the two d faces and
  the boundary kind on the transverse faces. CPML faces use alpha = 0 so that the PMC
  endpoint profile contract can accept them. Bloch faces carry a phase of
  0.3 rad on their axis.
* Sources are Gaussian, 1 um carrier, two cycles. ``point`` is an Ez point
  source; ``sheet`` a soft plane through the interior; ``plane_oneway`` a
  one-way plane over the whole transverse cell; ``tfsf`` a 0.8 um box;
  ``mode`` the soft plane template of a fixed-eigenmode launch;
  ``tiled_sheet`` a soft plane extended through the lateral PML.
* Monitors: ``point`` one Ez probe; ``plane_dft`` one d-normal frequency plane
  over the transverse interior (one cell short of PEC/PMC walls);
  ``mode_port`` two opposing fixed mode ports (no project monitors);
  ``radiation_box`` six frequency planes on a closed 0.8 um box, projected
  to the far field after the run.
* ``precision`` is Region.precision; ``cpu`` is backend cpu, ``cuda_torch`` is
  backend cuda with the Torch kernels, ``cuda_fused`` backend cuda with the
  fused CuPy kernels.

## Support tables per axis pair

### Dimension × Mesh

| Dimension \ Mesh | uniform | graded | explicit nodes |
| --- | --- | --- | --- |
| 2D | ✓ 1736/35280 | ✓ 1724/35280 | ✓ 1724/35280 |
| 3D | ✓ 2396/35280 | ✓ 2146/35280 | ✓ 2152/35280 |

### Dimension × Material

| Dimension \ Material | dielectric | dispersive ADE | anisotropic tensor | tensor ADE | PEC material |
| --- | --- | --- | --- | --- | --- |
| 2D | ✓ 2646/21168 | ✓ 2538/21168 | ✗ tensor_project_2d | ✗ tensor_project_2d | ✗ material_pec_schema |
| 3D | ✓ 3493/21168 | ✓ 3154/21168 | ✓ 35/21168 | ✓ 12/21168 | ✗ material_pec_schema |

### Dimension × Boundaries

| Dimension \ Boundaries | CPML | periodic | Bloch | PEC | antisymmetric | PMC | symmetric |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2D | ✓ 1140/15120 | ✓ 1236/15120 | ✓ 792/15120 | ✓ 1008/15120 | ✓ 1008/15120 | ✗ pmc_2d_schema | ✗ pmc_2d_schema |
| 3D | ✓ 1530/15120 | ✓ 1741/15120 | ✓ 1155/15120 | ✓ 888/15120 | ✓ 888/15120 | ✓ 246/15120 | ✓ 246/15120 |

### Dimension × Source

| Dimension \ Source | point | sheet | plane one-way | TFSF | mode | tiled sheet |
| --- | --- | --- | --- | --- | --- | --- |
| 2D | ✓ 1608/17640 | ✓ 1608/17640 | ✓ 228/17640 | ✓ 120/17640 | ✗ modal_periodic_launch_region | ✓ 1620/17640 |
| 3D | ✓ 2482/17640 | ✓ 2424/17640 | ✓ 282/17640 | ✓ 120/17640 | ✓ 78/17640 | ✓ 1308/17640 |

### Dimension × Monitor

| Dimension \ Monitor | point | plane DFT | mode port | radiation box |
| --- | --- | --- | --- | --- |
| 2D | ✓ 2586/26460 | ✓ 2598/26460 | ✗ port_periodic_launch_region | ✗ radiation_box_2d_schema |
| 3D | ✓ 2804/26460 | ✓ 2316/26460 | ✓ 54/26460 | ✓ 1520/26460 |

### Dimension × Execution

| Dimension \ Execution | forward | checkpointed adjoint | reversible adjoint | streamed | streamed adjoint | tensor batch | tiled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2D | ✓ 1152/15120 | ✓ 1116/15120 | ✗ reversible_cpml_region | ✓ 1116/15120 | ✓ 1116/15120 | ✓ 672/15120 | ✓ 12/15120 |
| 3D | ✓ 1088/15120 | ✓ 1611/15120 | ✓ 51/15120 | ✓ 1626/15120 | ✓ 1626/15120 | ✓ 680/15120 | ✓ 12/15120 |

### Dimension × Precision

| Dimension \ Precision | float32 | float64 |
| --- | --- | --- |
| 2D | ✓ 2592/52920 | ✓ 2592/52920 |
| 3D | ✓ 3417/52920 | ✓ 3277/52920 |

### Dimension × Backend

| Dimension \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| 2D | ✓ 1528/35280 | ✓ 1864/35280 | ✓ 1792/35280 |
| 3D | ✓ 2047/35280 | ✓ 2387/35280 | ✓ 2260/35280 |

### Mesh × Material

| Mesh \ Material | dielectric | dispersive ADE | anisotropic tensor | tensor ADE | PEC material |
| --- | --- | --- | --- | --- | --- |
| uniform | ✓ 2173/14112 | ✓ 1912/14112 | ✓ 35/14112 | ✓ 12/14112 | ✗ material_pec_schema |
| graded | ✓ 1980/14112 | ✓ 1890/14112 | ✗ tensor_project_mesh | ✗ tensor_project_mesh | ✗ material_pec_schema |
| explicit nodes | ✓ 1986/14112 | ✓ 1890/14112 | ✗ tensor_project_mesh | ✗ tensor_project_mesh | ✗ material_pec_schema |

### Mesh × Boundaries

| Mesh \ Boundaries | CPML | periodic | Bloch | PEC | antisymmetric | PMC | symmetric |
| --- | --- | --- | --- | --- | --- | --- | --- |
| uniform | ✓ 950/10080 | ✓ 1077/10080 | ✓ 675/10080 | ✓ 632/10080 | ✓ 632/10080 | ✓ 83/10080 | ✓ 83/10080 |
| graded | ✓ 860/10080 | ✓ 950/10080 | ✓ 636/10080 | ✓ 632/10080 | ✓ 632/10080 | ✓ 80/10080 | ✓ 80/10080 |
| explicit nodes | ✓ 860/10080 | ✓ 950/10080 | ✓ 636/10080 | ✓ 632/10080 | ✓ 632/10080 | ✓ 83/10080 | ✓ 83/10080 |

### Mesh × Source

| Mesh \ Source | point | sheet | plane one-way | TFSF | mode | tiled sheet |
| --- | --- | --- | --- | --- | --- | --- |
| uniform | ✓ 1420/11760 | ✓ 1368/11760 | ✓ 170/11760 | ✓ 80/11760 | ✓ 78/11760 | ✓ 1016/11760 |
| graded | ✓ 1332/11760 | ✓ 1332/11760 | ✓ 170/11760 | ✓ 80/11760 | ✗ modal_periodic_launch_mesh | ✓ 956/11760 |
| explicit nodes | ✓ 1338/11760 | ✓ 1332/11760 | ✓ 170/11760 | ✓ 80/11760 | ✗ modal_periodic_launch_mesh | ✓ 956/11760 |

### Mesh × Monitor

| Mesh \ Monitor | point | plane DFT | mode port | radiation box |
| --- | --- | --- | --- | --- |
| uniform | ✓ 1840/17640 | ✓ 1690/17640 | ✓ 54/17640 | ✓ 548/17640 |
| graded | ✓ 1772/17640 | ✓ 1612/17640 | ✗ port_periodic_launch_mesh | ✓ 486/17640 |
| explicit nodes | ✓ 1778/17640 | ✓ 1612/17640 | ✗ port_periodic_launch_mesh | ✓ 486/17640 |

### Mesh × Execution

| Mesh \ Execution | forward | checkpointed adjoint | reversible adjoint | streamed | streamed adjoint | tensor batch | tiled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| uniform | ✓ 794/10080 | ✓ 947/10080 | ✓ 51/10080 | ✓ 930/10080 | ✓ 930/10080 | ✓ 456/10080 | ✓ 24/10080 |
| graded | ✓ 720/10080 | ✓ 890/10080 | ✗ reversible_cpml_mesh | ✓ 906/10080 | ✓ 906/10080 | ✓ 448/10080 | ✗ tiled_mesh |
| explicit nodes | ✓ 726/10080 | ✓ 890/10080 | ✗ reversible_cpml_mesh | ✓ 906/10080 | ✓ 906/10080 | ✓ 448/10080 | ✗ tiled_mesh |

### Mesh × Precision

| Mesh \ Precision | float32 | float64 |
| --- | --- | --- |
| uniform | ✓ 2133/35280 | ✓ 1999/35280 |
| graded | ✓ 1935/35280 | ✓ 1935/35280 |
| explicit nodes | ✓ 1941/35280 | ✓ 1935/35280 |

### Mesh × Backend

| Mesh \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| uniform | ✓ 1249/23520 | ✓ 1477/23520 | ✓ 1406/23520 |
| graded | ✓ 1162/23520 | ✓ 1386/23520 | ✓ 1322/23520 |
| explicit nodes | ✓ 1164/23520 | ✓ 1388/23520 | ✓ 1324/23520 |

### Material × Boundaries

| Material \ Boundaries | CPML | periodic | Bloch | PEC | antisymmetric | PMC | symmetric |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dielectric | ✓ 1342/6048 | ✓ 1671/6048 | ✓ 978/6048 | ✓ 948/6048 | ✓ 948/6048 | ✓ 126/6048 | ✓ 126/6048 |
| dispersive ADE | ✓ 1312/6048 | ✓ 1290/6048 | ✓ 954/6048 | ✓ 948/6048 | ✓ 948/6048 | ✓ 120/6048 | ✓ 120/6048 |
| anisotropic tensor | ✓ 12/6048 | ✓ 12/6048 | ✓ 11/6048 | ✗ tensor_project_faces | ✗ tensor_project_faces | ✗ tensor_project_faces | ✗ tensor_project_faces |
| tensor ADE | ✓ 4/6048 | ✓ 4/6048 | ✓ 4/6048 | ✗ tensor_project_faces | ✗ tensor_project_faces | ✗ tensor_project_faces | ✗ tensor_project_faces |
| PEC material | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema |

### Material × Source

| Material \ Source | point | sheet | plane one-way | TFSF | mode | tiled sheet |
| --- | --- | --- | --- | --- | --- | --- |
| dielectric | ✓ 2035/7056 | ✓ 2034/7056 | ✓ 390/7056 | ✓ 120/7056 | ✓ 78/7056 | ✓ 1482/7056 |
| dispersive ADE | ✓ 2008/7056 | ✓ 1998/7056 | ✓ 120/7056 | ✓ 120/7056 | ✗ modal_periodic_launch_materials | ✓ 1446/7056 |
| anisotropic tensor | ✓ 35/7056 | ✗ tensor_project_sources | ✗ tensor_project_sources | ✗ tensor_project_sources | ✗ tensor_project_sources | ✗ tensor_project_sources |
| tensor ADE | ✓ 12/7056 | ✗ tensor_project_sources | ✗ tensor_project_sources | ✗ tensor_project_sources | ✗ tensor_project_sources | ✗ tensor_project_sources |
| PEC material | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema |

### Material × Monitor

| Material \ Monitor | point | plane DFT | mode port | radiation box |
| --- | --- | --- | --- | --- |
| dielectric | ✓ 2739/10584 | ✓ 2538/10584 | ✓ 54/10584 | ✓ 808/10584 |
| dispersive ADE | ✓ 2604/10584 | ✓ 2376/10584 | ✗ port_periodic_launch_materials | ✓ 712/10584 |
| anisotropic tensor | ✓ 35/10584 | ✗ tensor_project_monitors | ✗ tensor_project_monitors | ✗ tensor_project_monitors |
| tensor ADE | ✓ 12/10584 | ✗ tensor_project_monitors | ✗ tensor_project_monitors | ✗ tensor_project_monitors |
| PEC material | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema |

### Material × Execution

| Material \ Execution | forward | checkpointed adjoint | reversible adjoint | streamed | streamed adjoint | tensor batch | tiled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| dielectric | ✓ 1140/6048 | ✓ 1422/6048 | ✓ 51/6048 | ✓ 1419/6048 | ✓ 1419/6048 | ✓ 676/6048 | ✓ 12/6048 |
| dispersive ADE | ✓ 1086/6048 | ✓ 1290/6048 | ✗ reversible_cpml_materials | ✓ 1314/6048 | ✓ 1314/6048 | ✓ 676/6048 | ✓ 12/6048 |
| anisotropic tensor | ✓ 8/6048 | ✓ 9/6048 | ✗ reversible_materials | ✓ 9/6048 | ✓ 9/6048 | ✗ tensor_batch_tensor_material | ✗ tensor_project_2d |
| tensor ADE | ✓ 6/6048 | ✓ 6/6048 | ✗ tensor_ade_unavailable | ✗ tensor_ade_streamed_unavailable | ✗ tensor_ade_streamed_unavailable | ✗ tensor_ade_unavailable | ✗ tensor_ade_unavailable |
| PEC material | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema |

### Material × Precision

| Material \ Precision | float32 | float64 |
| --- | --- | --- |
| dielectric | ✓ 3116/21168 | ✓ 3023/21168 |
| dispersive ADE | ✓ 2846/21168 | ✓ 2846/21168 |
| anisotropic tensor | ✓ 35/21168 | ✗ tensor_project_fp64 |
| tensor ADE | ✓ 12/21168 | ✗ tensor_project_fp64 |
| PEC material | ✗ material_pec_schema | ✗ material_pec_schema |

### Material × Backend

| Material \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| dielectric | ✓ 1853/14112 | ✓ 2191/14112 | ✓ 2095/14112 |
| dispersive ADE | ✓ 1704/14112 | ✓ 2042/14112 | ✓ 1946/14112 |
| anisotropic tensor | ✓ 12/14112 | ✓ 12/14112 | ✓ 11/14112 |
| tensor ADE | ✓ 6/14112 | ✓ 6/14112 | ✗ tensor_ade_fused_backward |
| PEC material | ✗ material_pec_schema | ✗ material_pec_schema | ✗ material_pec_schema |

### Boundaries × Source

| Boundaries \ Source | point | sheet | plane one-way | TFSF | mode | tiled sheet |
| --- | --- | --- | --- | --- | --- | --- |
| CPML | ✓ 816/5040 | ✓ 786/5040 | ✗ oneway_needs_periodic_transverse | ✓ 240/5040 | ✓ 18/5040 | ✓ 810/5040 |
| periodic | ✓ 805/5040 | ✓ 801/5040 | ✓ 510/5040 | ✗ tfsf_needs_pml_everywhere | ✓ 60/5040 | ✓ 801/5040 |
| Bloch | ✓ 657/5040 | ✓ 645/5040 | ✗ oneway_needs_periodic_transverse | ✗ tfsf_needs_pml_everywhere | ✗ modal_periodic_launch_region | ✓ 645/5040 |
| PEC | ✓ 780/5040 | ✓ 780/5040 | ✗ oneway_needs_periodic_transverse | ✗ tfsf_needs_pml_everywhere | ✗ sheet_writes_pec_wall | ✓ 336/5040 |
| antisymmetric | ✓ 780/5040 | ✓ 780/5040 | ✗ oneway_needs_periodic_transverse | ✗ tfsf_needs_pml_everywhere | ✗ sheet_writes_pec_wall | ✓ 336/5040 |
| PMC | ✓ 126/5040 | ✓ 120/5040 | ✗ oneway_needs_periodic_transverse | ✗ tfsf_needs_pml_everywhere | ✗ modal_periodic_launch_mesh | ✗ pmc_sheet_reaches_wall |
| symmetric | ✓ 126/5040 | ✓ 120/5040 | ✗ oneway_needs_periodic_transverse | ✗ tfsf_needs_pml_everywhere | ✗ modal_periodic_launch_mesh | ✗ pmc_sheet_reaches_wall |

### Boundaries × Monitor

| Boundaries \ Monitor | point | plane DFT | mode port | radiation box |
| --- | --- | --- | --- | --- |
| CPML | ✓ 1144/7560 | ✓ 1164/7560 | ✓ 18/7560 | ✓ 344/7560 |
| periodic | ✓ 1261/7560 | ✓ 1269/7560 | ✓ 36/7560 | ✓ 411/7560 |
| Bloch | ✓ 813/7560 | ✓ 801/7560 | ✗ port_periodic_launch_region | ✓ 333/7560 |
| PEC | ✓ 840/7560 | ✓ 840/7560 | ✗ port_periodic_launch_region | ✓ 216/7560 |
| antisymmetric | ✓ 840/7560 | ✓ 840/7560 | ✗ port_periodic_launch_region | ✓ 216/7560 |
| PMC | ✓ 246/7560 | ✗ planes_pmc | ✗ port_periodic_launch_mesh | ✗ planes_pmc |
| symmetric | ✓ 246/7560 | ✗ planes_pmc | ✗ port_periodic_launch_mesh | ✗ planes_pmc |

### Boundaries × Execution

| Boundaries \ Execution | forward | checkpointed adjoint | reversible adjoint | streamed | streamed adjoint | tensor batch | tiled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CPML | ✓ 605/4320 | ✓ 557/4320 | ✗ reversible_cpml_region | ✓ 546/4320 | ✓ 546/4320 | ✓ 392/4320 | ✓ 24/4320 |
| periodic | ✓ 611/4320 | ✓ 665/4320 | ✓ 27/4320 | ✓ 645/4320 | ✓ 645/4320 | ✓ 384/4320 | ✗ tiled_faces |
| Bloch | ✓ 292/4320 | ✓ 545/4320 | ✓ 24/4320 | ✓ 543/4320 | ✓ 543/4320 | ✗ tensor_batch_complex | ✗ tiled_complex |
| PEC | ✓ 360/4320 | ✓ 432/4320 | ✗ reversible_cpml_region | ✓ 432/4320 | ✓ 432/4320 | ✓ 240/4320 | ✗ tiled_faces |
| antisymmetric | ✓ 360/4320 | ✓ 432/4320 | ✗ reversible_cpml_region | ✓ 432/4320 | ✓ 432/4320 | ✓ 240/4320 | ✗ tiled_faces |
| PMC | ✓ 6/4320 | ✓ 48/4320 | ✗ reversible_cpml_pmc_planes | ✓ 72/4320 | ✓ 72/4320 | ✓ 48/4320 | ✗ tiled_faces |
| symmetric | ✓ 6/4320 | ✓ 48/4320 | ✗ reversible_cpml_pmc_planes | ✓ 72/4320 | ✓ 72/4320 | ✓ 48/4320 | ✗ tiled_faces |

### Boundaries × Precision

| Boundaries \ Precision | float32 | float64 |
| --- | --- | --- |
| CPML | ✓ 1358/15120 | ✓ 1312/15120 |
| periodic | ✓ 1510/15120 | ✓ 1467/15120 |
| Bloch | ✓ 993/15120 | ✓ 954/15120 |
| PEC | ✓ 948/15120 | ✓ 948/15120 |
| antisymmetric | ✓ 948/15120 | ✓ 948/15120 |
| PMC | ✓ 126/15120 | ✓ 120/15120 |
| symmetric | ✓ 126/15120 | ✓ 120/15120 |

### Boundaries × Backend

| Boundaries \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| CPML | ✓ 760/10080 | ✓ 956/10080 | ✓ 954/10080 |
| periodic | ✓ 865/10080 | ✓ 1057/10080 | ✓ 1055/10080 |
| Bloch | ✓ 698/10080 | ✓ 698/10080 | ✓ 551/10080 |
| PEC | ✓ 552/10080 | ✓ 672/10080 | ✓ 672/10080 |
| antisymmetric | ✓ 552/10080 | ✓ 672/10080 | ✓ 672/10080 |
| PMC | ✓ 74/10080 | ✓ 98/10080 | ✓ 74/10080 |
| symmetric | ✓ 74/10080 | ✓ 98/10080 | ✓ 74/10080 |

### Source × Monitor

| Source \ Monitor | point | plane DFT | mode port | radiation box |
| --- | --- | --- | --- | --- |
| point | ✓ 1910/8820 | ✓ 1614/8820 | ✗ port_periodic_launch_template | ✓ 566/8820 |
| sheet | ✓ 1854/8820 | ✓ 1614/8820 | ✓ 18/8820 | ✓ 546/8820 |
| plane one-way | ✓ 228/8820 | ✓ 228/8820 | ✗ port_periodic_launch_template | ✓ 54/8820 |
| TFSF | ✓ 120/8820 | ✓ 120/8820 | ✗ port_open_launch_tfsf_template | ✗ radiation_box_mesh |
| mode | ✗ modal_planes_need_field_monitors | ✓ 36/8820 | ✓ 18/8820 | ✓ 24/8820 |
| tiled sheet | ✓ 1278/8820 | ✓ 1302/8820 | ✓ 18/8820 | ✓ 330/8820 |

### Source × Execution

| Source \ Execution | forward | checkpointed adjoint | reversible adjoint | streamed | streamed adjoint | tensor batch | tiled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| point | ✓ 710/5040 | ✓ 963/5040 | ✓ 15/5040 | ✓ 981/5040 | ✓ 981/5040 | ✓ 440/5040 | ✗ tiled_sources |
| sheet | ✓ 681/5040 | ✓ 957/5040 | ✓ 18/5040 | ✓ 972/5040 | ✓ 972/5040 | ✓ 432/5040 | ✗ tiled_sheet_span |
| plane one-way | ✓ 144/5040 | ✓ 90/5040 | ✗ reversible_cpml_sources | ✓ 90/5040 | ✓ 90/5040 | ✓ 96/5040 | ✗ mode_port_unavailable |
| TFSF | ✓ 144/5040 | ✗ differentiable_tfsf | ✗ mode_port_unavailable | ✗ differentiable_tfsf | ✗ differentiable_tfsf | ✓ 96/5040 | ✗ tiled_sources |
| mode | ✓ 24/5040 | ✓ 24/5040 | ✗ mode_source_unavailable | ✓ 15/5040 | ✓ 15/5040 | ✗ mode_source_unavailable | ✗ mode_source_unavailable |
| tiled sheet | ✓ 537/5040 | ✓ 693/5040 | ✓ 18/5040 | ✓ 684/5040 | ✓ 684/5040 | ✓ 288/5040 | ✓ 24/5040 |

### Source × Precision

| Source \ Precision | float32 | float64 |
| --- | --- | --- |
| point | ✓ 2082/17640 | ✓ 2008/17640 |
| sheet | ✓ 2028/17640 | ✓ 2004/17640 |
| plane one-way | ✓ 255/17640 | ✓ 255/17640 |
| TFSF | ✓ 120/17640 | ✓ 120/17640 |
| mode | ✓ 48/17640 | ✓ 30/17640 |
| tiled sheet | ✓ 1476/17640 | ✓ 1452/17640 |

### Source × Backend

| Source \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| point | ✓ 1243/11760 | ✓ 1463/11760 | ✓ 1384/11760 |
| sheet | ✓ 1224/11760 | ✓ 1440/11760 | ✓ 1368/11760 |
| plane one-way | ✓ 138/11760 | ✓ 186/11760 | ✓ 186/11760 |
| TFSF | ✓ 48/11760 | ✓ 96/11760 | ✓ 96/11760 |
| mode | ✓ 26/11760 | ✓ 26/11760 | ✓ 26/11760 |
| tiled sheet | ✓ 896/11760 | ✓ 1040/11760 | ✓ 992/11760 |

### Monitor × Execution

| Monitor \ Execution | forward | checkpointed adjoint | reversible adjoint | streamed | streamed adjoint | tensor batch | tiled |
| --- | --- | --- | --- | --- | --- | --- | --- |
| point | ✓ 1106/7560 | ✓ 1155/7560 | ✓ 15/7560 | ✓ 1197/7560 | ✓ 1197/7560 | ✓ 720/7560 | ✗ tiled_monitor |
| plane DFT | ✓ 1089/7560 | ✓ 1053/7560 | ✓ 18/7560 | ✓ 1053/7560 | ✓ 1053/7560 | ✓ 624/7560 | ✓ 24/7560 |
| mode port | ✓ 27/7560 | ✓ 27/7560 | ✗ mode_port_unavailable | ✗ mode_network_streamed | ✗ mode_network_streamed | ✗ mode_port_unavailable | ✗ mode_port_unavailable |
| radiation box | ✓ 18/7560 | ✓ 492/7560 | ✓ 18/7560 | ✓ 492/7560 | ✓ 492/7560 | ✓ 8/7560 | ✗ tiled_monitor |

### Monitor × Precision

| Monitor \ Precision | float32 | float64 |
| --- | --- | --- |
| point | ✓ 2732/26460 | ✓ 2658/26460 |
| plane DFT | ✓ 2472/26460 | ✓ 2442/26460 |
| mode port | ✓ 36/26460 | ✓ 18/26460 |
| radiation box | ✓ 769/26460 | ✓ 751/26460 |

### Monitor × Backend

| Monitor \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| point | ✓ 1599/17640 | ✓ 1959/17640 | ✓ 1832/17640 |
| plane DFT | ✓ 1454/17640 | ✓ 1766/17640 | ✓ 1694/17640 |
| mode port | ✓ 18/17640 | ✓ 18/17640 | ✓ 18/17640 |
| radiation box | ✓ 504/17640 | ✓ 508/17640 | ✓ 508/17640 |

### Execution × Precision

| Execution \ Precision | float32 | float64 |
| --- | --- | --- |
| forward | ✓ 1139/15120 | ✓ 1101/15120 |
| checkpointed adjoint | ✓ 1377/15120 | ✓ 1350/15120 |
| reversible adjoint | ✓ 51/15120 | ✗ reversible_cpml_fp64 |
| streamed | ✓ 1377/15120 | ✓ 1365/15120 |
| streamed adjoint | ✓ 1377/15120 | ✓ 1365/15120 |
| tensor batch | ✓ 676/15120 | ✓ 676/15120 |
| tiled | ✓ 12/15120 | ✓ 12/15120 |

### Execution × Backend

| Execution \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| forward | ✓ 796/10080 | ✓ 796/10080 | ✓ 648/10080 |
| checkpointed adjoint | ✓ 926/10080 | ✓ 926/10080 | ✓ 875/10080 |
| reversible adjoint | ✓ 17/10080 | ✓ 17/10080 | ✓ 17/10080 |
| streamed | ✓ 914/10080 | ✓ 914/10080 | ✓ 914/10080 |
| streamed adjoint | ✓ 914/10080 | ✓ 914/10080 | ✓ 914/10080 |
| tensor batch | ✗ tensor_batch_cpu | ✓ 676/10080 | ✓ 676/10080 |
| tiled | ✓ 8/10080 | ✓ 8/10080 | ✓ 8/10080 |

### Precision × Backend

| Precision \ Backend | CPU | CUDA Torch | CUDA fused |
| --- | --- | --- | --- |
| float32 | ✓ 1812/35280 | ✓ 2150/35280 | ✓ 2047/35280 |
| float64 | ✓ 1763/35280 | ✓ 2101/35280 | ✓ 2005/35280 |

## Lanes (admitted entry points)

| Lane | Applies when | Code path | Test | Description |
| --- | --- | --- | --- | --- |
| `forward.mode_network` | execution: forward; monitor: mode_port | `torchfdtd/mode_network.py::ModeNetwork.__call__` | `tests/test_capability_pairs.py::test_pairwise` | Two-port complex S matrix of the fixed mode ports without gradients (prepare_modal_launch for periodic/Bloch transverse faces, prepare_open_modal_launch for CPML). |
| `forward.modal_planes` | execution: forward; source: mode | `torchfdtd/mode_injection.py::ModeInjectedPlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Fixed-eigenmode sheet launch with spectral plane observers, no gradient. |
| `forward.tensor_ade` | execution: forward; material: tensor_ade | `torchfdtd/anisotropy_dispersive.py::TensorDispersiveSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Full-tensor trapezoidal ADE on node tensors, no gradient. |
| `forward.tensor` | execution: forward; material: anisotropic_tensor | `torchfdtd/tensor_native.py::run_tensor` | `tests/test_capability_pairs.py::test_pairwise` | Native tensor solver dispatched by Simulation.run (Torch operations). cuda_kernel="fused" is not honoured: the summary warns that tensor execution uses Torch operations. |
| `forward.endpoint` | execution: forward; boundary: pmc, symmetric | `torchfdtd/endpoint_native.py::run_endpoint` | `tests/test_capability_pairs.py::test_pairwise` | Exact-endpoint PEC/PMC/CPML solver dispatched by Simulation.run. |
| `forward.grid` | execution: forward | `torchfdtd/solver.py::Simulation.run` | `tests/test_capability_pairs.py::test_pairwise` | Native Yee/CPML forward on the fdtd grid; radiation boxes project the stored planes through native_radiation_box. |
| `checkpointed.mode_network` | execution: checkpointed_adjoint; monitor: mode_port | `torchfdtd/mode_network.py::ModeNetwork.__call__` | `tests/test_capability_pairs.py::test_pairwise` | Interior material VJP of the two-port S matrix. |
| `checkpointed.modal_planes` | execution: checkpointed_adjoint; source: mode | `torchfdtd/mode_injection.py::ModeInjectedPlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Checkpointed adjoint through the fixed modal sheets. |
| `checkpointed.tensor_ade` | execution: checkpointed_adjoint; material: tensor_ade | `torchfdtd/anisotropy_dispersive.py::TensorDispersiveSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Checkpointed derivatives of node epsilon_inf and tensor poles. |
| `checkpointed.tensor` | execution: checkpointed_adjoint; material: anisotropic_tensor | `torchfdtd/tensor_project.py::TensorProject.__call__` | `tests/test_capability_pairs.py::test_pairwise` | Project-rasterized node tensors through TensorDielectricSimulation with the fixed isotropic CPML collar. |
| `checkpointed.dispersive_planes` | execution: checkpointed_adjoint; material: dispersive_ade; monitor: plane_dft, radiation_box | `torchfdtd/dispersive_adjoint.py::DispersivePlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | ADE material VJPs of spectral planes; radiation boxes project through project_farfield. |
| `checkpointed.dispersive` | execution: checkpointed_adjoint; material: dispersive_ade | `torchfdtd/dispersive_adjoint.py::DispersiveSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Checkpointed derivatives of epsilon_inf and the passive poles. |
| `checkpointed.planes` | execution: checkpointed_adjoint; monitor: plane_dft, radiation_box | `torchfdtd/adjoint_planes.py::DifferentiablePlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Checkpointed adjoint of fixed spectral planes; radiation boxes project through project_farfield. |
| `checkpointed.point` | execution: checkpointed_adjoint | `torchfdtd/differentiable.py::DifferentiableSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Discrete Yee/CPML adjoint with bounded checkpoints and point observations. |
| `streamed.modal_planes` | execution: streamed, streamed_adjoint; source: mode | `torchfdtd/mode_injection.py::ModeInjectedPlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Streamed X-slab execution of the fixed modal sheets and plane observers. |
| `streamed.tensor` | execution: streamed, streamed_adjoint; material: anisotropic_tensor | `torchfdtd/streamed_tensor.py::StreamedTensorSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Streamed node-tensor slabs with the geometric CPML criterion. |
| `streamed.dispersive_planes` | execution: streamed, streamed_adjoint; material: dispersive_ade; monitor: plane_dft, radiation_box | `torchfdtd/dispersive_adjoint.py::DispersivePlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Streamed ADE slabs with spectral plane observers. |
| `streamed.dispersive` | execution: streamed, streamed_adjoint; material: dispersive_ade | `torchfdtd/streamed_dispersive.py::StreamedDispersiveSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Streamed ADE slabs with point observations. |
| `streamed.planes` | execution: streamed, streamed_adjoint; monitor: plane_dft, radiation_box | `torchfdtd/adjoint_planes.py::DifferentiablePlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Streamed slabs with spectral plane observers. |
| `streamed.point` | execution: streamed, streamed_adjoint | `torchfdtd/streamed.py::StreamedSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Host or file-backed streamed slabs with point observations; the streamed execution mode runs it without gradient, the streamed adjoint with backward. |
| `reversible.periodic` | execution: reversible_adjoint; source: point; monitor: point; boundary: periodic | `torchfdtd/reversible.py::ReversibleSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Lossless periodic reconstruction adjoint on a closed periodic cell. |
| `reversible.cpml_planes` | execution: reversible_adjoint; monitor: plane_dft, radiation_box | `torchfdtd/reversible_cpml_planes.py::ReversibleCPMLPlaneSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Recorded-interface CPML adjoint with spectral planes. |
| `reversible.cpml` | execution: reversible_adjoint | `torchfdtd/reversible_cpml.py::ReversibleCPMLSimulation.forward` | `tests/test_capability_pairs.py::test_pairwise` | Recorded-interface CPML adjoint with point observations. |
| `tensor_batch` | execution: tensor_batch | `torchfdtd/tensor_batch.py::run_tensor_batch` | `tests/test_capability_pairs.py::test_pairwise` | One-case fused CUDA cohort; radiation boxes project the stored planes through native_radiation_box. The cohort always runs the fused batch kernel; cuda_kernel="torch" is reported as fused_batch in the summary. |
| `tiled` | execution: tiled | `torchfdtd/tiled.py::run_tiled` | `tests/test_capability_pairs.py::test_pairwise` | plan_tiles partitions the lateral extent; each tile runs Simulation.run and the output planes are stitched. |

## Incidence definition of plane sources

The realized definition of an oblique source, served as the `incidence` block and reported by
`torchfdtd.source_preview.preview_source`; a fixed-angle source has no code path and is refused.

| Definition | Status | Code path | Statement |
| --- | --- | --- | --- |
| `normal` | admitted | `torchfdtd/solver.py::source_profile` | No Bloch phase on a transverse axis: k_parallel = 0 at every frequency. |
| `fixed_k_parallel` | admitted | `torchfdtd/solver.py::source_profile` | Bloch phase phi on a transverse axis of length L: k_parallel = phi / L is fixed and the angle asin(k_parallel / (n k0)) varies across the band; frequencies with k_parallel > n k0 are evanescent. |
| `fixed_angle` | rejected | `torchfdtd/source_preview.py::preview_source` | Fixed-angle broadband injection is not implemented: a Bloch cell fixes k_parallel, so the incidence angle varies across the band (feature inventory source.angle and boundary.bfast are missing). Preview the fixed-k_parallel source instead. |

## Rules (rejections, in the order the code checks them)

| # | Rule | Applies when | Stage | Code path | Exception | Message prefix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `mode_source_unavailable` | source: mode (executions: reversible_adjoint, tensor_batch, tiled) | unavailable | `torchfdtd/models.py::Source.kind` | Unavailable | The Project schema offers point, plane and TFSF sources; fixed-eigenmode launches exist only as inputs of ModeInjectedPlaneSimulation and ModeNetwork. |
| 2 | `mode_port_unavailable` | monitor: mode_port (executions: reversible_adjoint, tensor_batch, tiled) | unavailable | `torchfdtd/models.py::Monitor.kind` | Unavailable | The Project schema offers point and field monitors; mode ports exist only as ModeNetwork inputs. |
| 3 | `tensor_ade_unavailable` | material: tensor_ade (executions: reversible_adjoint, tensor_batch, tiled) | unavailable | `torchfdtd/models.py::Material.model` | Unavailable | The Project schema offers no tensor ADE material; tensor poles exist only as TensorDispersiveSimulation inputs. |
| 4 | `tensor_ade_streamed_unavailable` | material: tensor_ade (executions: streamed, streamed_adjoint) | unavailable | `torchfdtd/streamed_tensor.py::StreamedTensorSimulation.forward` | Unavailable | The streamed tensor path takes node tensors only; it has no pole inputs. |
| 5 | `material_pec_schema` | material: pec | schema | `torchfdtd/models.py::Material` | ValidationError | Input should be 'dielectric', 'tensor', 'drude', 'lorentz' or 'multipole' No ideal-conductor material model exists; PEC enters as a boundary face only. |
| 6 | `tensor_project_2d` | material: anisotropic_tensor, tensor_ade; dimension: 2d | schema | `torchfdtd/tensor_project.py::validate_tensor_project` | ValidationError | Native tensor materials require FP32 material on uniform 3D grids. |
| 7 | `tensor_project_fp64` | material: anisotropic_tensor, tensor_ade; precision: float64 | schema | `torchfdtd/tensor_project.py::validate_tensor_project` | ValidationError | Native tensor materials require FP32 material on uniform 3D grids. TensorDielectricSimulation also takes FP64 node tensors on a project that declares no tensor material (diagnostics). |
| 8 | `tensor_project_mesh` | material: anisotropic_tensor, tensor_ade; mesh: explicit, graded | schema | `torchfdtd/tensor_project.py::validate_tensor_project` | ValidationError | Native tensor materials require FP32 material on uniform 3D grids. |
| 9 | `tensor_project_faces` | material: anisotropic_tensor, tensor_ade; boundary: antisymmetric, pec, pmc, symmetric | schema | `torchfdtd/tensor_project.py::validate_tensor_project` | ValidationError | Native tensor faces must be periodic/Bloch or isotropic-exterior PML. The explicit node-tensor APIs accept PEC walls on a project that declares no tensor material. |
| 10 | `tensor_project_sources` | material: anisotropic_tensor, tensor_ade; source: mode, plane_oneway, sheet, tfsf, tiled_sheet | schema | `torchfdtd/tensor_project.py::validate_tensor_project` | ValidationError | Native tensor sources must be point soft electric field increments. |
| 11 | `tensor_project_monitors` | material: anisotropic_tensor, tensor_ade; monitor: mode_port, plane_dft, radiation_box | schema | `torchfdtd/tensor_project.py::validate_tensor_project` | ValidationError | Native tensor requires point monitors at every timestep. |
| 12 | `pmc_2d_schema` | boundary: pmc, symmetric; dimension: 2d | schema | `torchfdtd/endpoint_native.py::validate_pmc_project` | ValidationError | PMC/symmetric faces require a 3D region; two-dimensional PMC walls are not implemented by any path. |
| 13 | `tfsf_needs_pml_everywhere` | source: tfsf; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric | schema | `torchfdtd/tfsf.py::tfsf_plan` | ValidationError | {source}: the current isolated TFSF box requires PML on every active face. |
| 14 | `oneway_needs_periodic_transverse` | source: plane_oneway; boundary: antisymmetric, bloch, cpml, pec, pmc, symmetric | schema | `torchfdtd/injection.py::oneway_plan` | ValidationError | {source}: normal-incidence planes require periodic transverse boundaries (zero Bloch phase). |
| 15 | `sheet_writes_pec_wall` | source: mode, tiled_sheet; boundary: antisymmetric, pec; dimension: 3d | schema | `torchfdtd/models.py::Project.valid_scene` | ValidationError | {source}: source writes a constrained PEC/antisymmetric wall component A sheet spanning the whole cell reaches the tangential Ex on the lower y PEC wall; in 2D Ex is normal to the x walls. |
| 16 | `radiation_box_2d_schema` | monitor: radiation_box; dimension: 2d | schema | `torchfdtd/models.py::Project.valid_scene` | ValidationError | A 2D flux monitor must be x-normal or y-normal. |
| 17 | `mode_network_streamed` | monitor: mode_port (executions: streamed, streamed_adjoint) | entry | `torchfdtd/mode_network.py::ModeNetwork.__init__` | ValueError | Mode networks require resident AdjointOptions, not streaming. |
| 18 | `port_periodic_launch_region` | monitor: mode_port; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric; dimension: 2d (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Modal launch requires a real uniform 3D Yee-sampled region. |
| 19 | `port_periodic_launch_mesh` | monitor: mode_port; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric; mesh: explicit, graded (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Modal launch requires a real uniform 3D Yee-sampled region. |
| 20 | `port_periodic_launch_bloch` | monitor: mode_port; boundary: bloch (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Modal launch requires a real uniform 3D Yee-sampled region. Bloch faces make the fields complex; the modal launch is real. |
| 21 | `port_periodic_launch_materials` | monitor: mode_port; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric; material: dispersive_ade (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Only real nondispersive staircase materials are supported. |
| 22 | `port_periodic_launch_template` | monitor: mode_port; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric; source: plane_oneway, point, tfsf (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Use one soft Gaussian plane source with cycle-based timing. |
| 23 | `port_periodic_launch_transverse` | monitor: mode_port; boundary: antisymmetric, pec, pmc, symmetric (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/injection.py::oneway_plan` | ValueError | {source}: normal-incidence planes require periodic transverse boundaries (zero Bloch phase). |
| 24 | `port_open_launch_tfsf_template` | monitor: mode_port; boundary: cpml; source: tfsf (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | schema | `torchfdtd/tfsf.py::tfsf_plan` | ValidationError | {source}: leave at least two interior cells between each TFSF face and PML. ModeNetwork moves the timing source to the port source plane and revalidates the copy (open_mode_injection._open_geometry) before checking its kind. |
| 25 | `port_open_launch_region` | monitor: mode_port; boundary: cpml; dimension: 2d (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires real FP32 uniform 3D staircase Yee sampling. |
| 26 | `port_open_launch_mesh` | monitor: mode_port; boundary: cpml; mesh: explicit, graded (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires real FP32 uniform 3D staircase Yee sampling. |
| 27 | `port_open_launch_fp64` | monitor: mode_port; boundary: cpml; precision: float64 (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires real FP32 uniform 3D staircase Yee sampling. |
| 28 | `port_open_launch_materials` | monitor: mode_port; boundary: cpml; material: dispersive_ade (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires nondispersive isotropic materials. |
| 29 | `port_open_launch_template` | monitor: mode_port; boundary: cpml; source: point (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Use a soft Gaussian plane timing template with at least two carrier cycles. |
| 30 | `modal_periodic_launch_region` | source: mode; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric; dimension: 2d (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Modal launch requires a real uniform 3D Yee-sampled region. |
| 31 | `modal_periodic_launch_mesh` | source: mode; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric; mesh: explicit, graded (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Modal launch requires a real uniform 3D Yee-sampled region. |
| 32 | `modal_periodic_launch_bloch` | source: mode; boundary: bloch (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Modal launch requires a real uniform 3D Yee-sampled region. Bloch faces make the fields complex; the modal launch is real. |
| 33 | `modal_periodic_launch_materials` | source: mode; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric; material: dispersive_ade (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/mode_injection.py::prepare_modal_launch` | ValueError | Only real nondispersive staircase materials are supported. |
| 34 | `modal_periodic_launch_transverse` | source: mode; boundary: antisymmetric, pec, pmc, symmetric (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/injection.py::oneway_plan` | ValueError | {source}: normal-incidence planes require periodic transverse boundaries (zero Bloch phase). |
| 35 | `modal_open_launch_region` | source: mode; boundary: cpml; dimension: 2d (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires real FP32 uniform 3D staircase Yee sampling. |
| 36 | `modal_open_launch_mesh` | source: mode; boundary: cpml; mesh: explicit, graded (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires real FP32 uniform 3D staircase Yee sampling. |
| 37 | `modal_open_launch_fp64` | source: mode; boundary: cpml; precision: float64 (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires real FP32 uniform 3D staircase Yee sampling. |
| 38 | `modal_open_launch_materials` | source: mode; boundary: cpml; material: dispersive_ade (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::_open_geometry` | ValueError | Open modal launch requires nondispersive isotropic materials. |
| 39 | `modal_open_detectors` | source: mode; boundary: cpml; monitor: radiation_box (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/open_mode_injection.py::OpenModalLaunch.detector_mode` | ValueError | Validated modal detectors must lie on longitudinal E-node planes. ModeInjectedPlaneSimulation validates every plane against the open launch; the box faces normal to the transverse axes are not d-node planes. |
| 40 | `modal_planes_need_field_monitors` | source: mode; monitor: point (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/adjoint_planes.py::DifferentiablePlaneSimulation.__init__` | ValueError | DifferentiablePlaneSimulation requires enabled field monitors only. |
| 41 | `tensor_ade_fused_backward` | material: tensor_ade; backend: cuda_fused (executions: forward, checkpointed_adjoint) | entry | `torchfdtd/anisotropy.py::TensorDielectricSimulation.__init__` | ValueError | Full-tensor fused kernels are not validated. TensorProject (anisotropic_tensor) always uses the Torch transpose and takes no kernel choice. |
| 42 | `endpoint_fp64` | boundary: pmc, symmetric; precision: float64 (executions: forward) | entry | `torchfdtd/endpoint_native.py::validate_endpoint_project` | ValueError | PMC native dispatch requires fixed uniform/explicit real FP32 3D meshes. |
| 43 | `endpoint_graded` | boundary: pmc, symmetric; mesh: graded (executions: forward) | entry | `torchfdtd/endpoint_native.py::validate_endpoint_project` | ValueError | PMC native dispatch requires fixed uniform/explicit real FP32 3D meshes. |
| 44 | `endpoint_ade` | boundary: pmc, symmetric; material: dispersive_ade (executions: forward) | entry | `torchfdtd/endpoint_native.py::validate_endpoint_project` | ValueError | PMC native dispatch does not support ADE/dispersive materials. |
| 45 | `endpoint_sources` | boundary: pmc, symmetric; source: plane_oneway, sheet, tfsf, tiled_sheet (executions: forward) | entry | `torchfdtd/endpoint_native.py::validate_endpoint_project` | ValueError | PMC native dispatch accepts enabled point soft electric sources only. |
| 46 | `endpoint_monitors` | boundary: pmc, symmetric; monitor: plane_dft, radiation_box (executions: forward) | entry | `torchfdtd/endpoint_native.py::validate_endpoint_project` | ValueError | PMC native dispatch accepts enabled point E/H monitors at every timestep only. |
| 47 | `forward_fused_complex` | backend: cuda_fused; boundary: bloch (executions: forward) | entry | `torchfdtd/solver.py::Simulation._run` | ValueError | The fused CUDA kernel currently supports real fields. Select cuda_kernel="torch" for Bloch fields. Refused before the grid is allocated; FusedYeeCUDA repeats the refusal. |
| 48 | `differentiable_tfsf` | source: tfsf (executions: checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/differentiable.py::DifferentiableSimulation.__init__` | ValueError | Live TFSF incident-state derivatives are not implemented yet. |
| 49 | `dispersive_pmc_fused` | material: dispersive_ade; boundary: pmc, symmetric; backend: cuda_fused; monitor: point (executions: checkpointed_adjoint) | entry | `torchfdtd/dispersive_adjoint.py::DispersiveSimulation.__init__` | ValueError | The fused CUDA ADE kernels do not implement stored PMC/symmetric faces. Use cuda_kernel="torch" and backward_kernel="torch". |
| 50 | `dispersive_oneway` | material: dispersive_ade; source: plane_oneway; monitor: point (executions: checkpointed_adjoint) | entry | `torchfdtd/dispersive_adjoint.py::DispersiveSimulation.__init__` | ValueError | Dispersive differentiation currently requires soft source injection. |
| 51 | `streamed_dispersive_oneway` | material: dispersive_ade; source: plane_oneway; monitor: point (executions: streamed, streamed_adjoint) | entry | `torchfdtd/streamed_dispersive.py::StreamedDispersiveSimulation.__init__` | ValueError | Streamed ADE differentiation currently requires soft source injection. |
| 52 | `planes_pmc` | material: dielectric; monitor: plane_dft, radiation_box; boundary: pmc, symmetric (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/boundaries.py::reject_pmc_faces` | ValueError | PMC/symmetric faces are not implemented by {path}. Use DifferentiableSimulation, StreamedSimulation, run_tensor_batch or the endpoint Simulation dispatch. |
| 53 | `dispersive_planes_pmc` | material: dispersive_ade; monitor: plane_dft, radiation_box; boundary: pmc, symmetric (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | entry | `torchfdtd/boundaries.py::reject_pmc_faces` | ValueError | PMC/symmetric faces are not implemented by {path}. Use DifferentiableSimulation, StreamedSimulation, run_tensor_batch or the endpoint Simulation dispatch. |
| 54 | `dispersive_planes_oneway` | material: dispersive_ade; source: plane_oneway; monitor: plane_dft, radiation_box (executions: checkpointed_adjoint) | entry | `torchfdtd/dispersive_adjoint.py::DispersiveSimulation.__init__` | ValueError | Dispersive differentiation currently requires soft source injection. |
| 55 | `streamed_dispersive_planes_oneway` | material: dispersive_ade; source: plane_oneway; monitor: plane_dft, radiation_box (executions: streamed, streamed_adjoint) | entry | `torchfdtd/streamed_dispersive.py::StreamedDispersiveSimulation.__init__` | ValueError | Streamed ADE differentiation currently requires soft source injection. |
| 56 | `adjoint_pmc_fused_backward` | boundary: pmc, symmetric; backend: cuda_fused (executions: checkpointed_adjoint) | run | `torchfdtd/differentiable.py::DifferentiableSimulation._run` | ValueError | The fused CUDA backward kernel does not implement PMC/symmetric faces. Use backward_kernel="auto" or "torch". |
| 57 | `pmc_sheet_reaches_wall` | boundary: pmc, symmetric; source: tiled_sheet (executions: forward, checkpointed_adjoint, streamed, streamed_adjoint) | run | `torchfdtd/differentiable.py::_System.__init__` | ValueError | {source}: only point sources may address a stored upper PMC/symmetric face; plane sources must end below the wall. Checked from the prepared source terms before the Yee system allocates its fields. |
| 58 | `reversible_pmc` | source: point; monitor: point; boundary: pmc, symmetric (executions: reversible_adjoint) | entry | `torchfdtd/boundaries.py::reject_pmc_faces` | ValueError | PMC/symmetric faces are not implemented by {path}. Use DifferentiableSimulation, StreamedSimulation, run_tensor_batch or the endpoint Simulation dispatch. |
| 59 | `reversible_region` | source: point; monitor: point; boundary: antisymmetric, bloch, pec, periodic; dimension: 2d (executions: reversible_adjoint) | entry | `torchfdtd/reversible.py::_validate_project` | ValueError | ReversibleSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps. |
| 60 | `reversible_fp64` | source: point; monitor: point; boundary: antisymmetric, bloch, pec, periodic; precision: float64 (executions: reversible_adjoint) | entry | `torchfdtd/reversible.py::_validate_project` | ValueError | ReversibleSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps. |
| 61 | `reversible_mesh` | source: point; monitor: point; boundary: antisymmetric, bloch, pec, periodic; mesh: explicit, graded (executions: reversible_adjoint) | entry | `torchfdtd/reversible.py::_validate_project` | ValueError | ReversibleSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps. |
| 62 | `reversible_faces` | source: point; monitor: point; boundary: antisymmetric, bloch, pec (executions: reversible_adjoint) | entry | `torchfdtd/reversible.py::_validate_project` | ValueError | ReversibleSimulation requires all six boundaries to be periodic, without Bloch phase. |
| 63 | `reversible_materials` | source: point; monitor: point; boundary: periodic; material: anisotropic_tensor, dispersive_ade (executions: reversible_adjoint) | entry | `torchfdtd/reversible.py::_validate_project` | ValueError | ReversibleSimulation supports only nondispersive dielectric material declarations. |
| 64 | `reversible_cpml_pmc_point` | boundary: pmc, symmetric; monitor: point (executions: reversible_adjoint) | entry | `torchfdtd/boundaries.py::reject_pmc_faces` | ValueError | PMC/symmetric faces are not implemented by {path}. Use DifferentiableSimulation, StreamedSimulation, run_tensor_batch or the endpoint Simulation dispatch. |
| 65 | `reversible_cpml_pmc_planes` | boundary: pmc, symmetric; monitor: plane_dft, radiation_box (executions: reversible_adjoint) | entry | `torchfdtd/boundaries.py::reject_pmc_faces` | ValueError | PMC/symmetric faces are not implemented by {path}. Use DifferentiableSimulation, StreamedSimulation, run_tensor_batch or the endpoint Simulation dispatch. |
| 66 | `reversible_cpml_region` | boundary: antisymmetric, bloch, cpml, pec, periodic; dimension: 2d (executions: reversible_adjoint) | entry | `torchfdtd/reversible_cpml.py::_validate_project` | ValueError | ReversibleCPMLSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps. |
| 67 | `reversible_cpml_fp64` | boundary: antisymmetric, bloch, cpml, pec, periodic; precision: float64 (executions: reversible_adjoint) | entry | `torchfdtd/reversible_cpml.py::_validate_project` | ValueError | ReversibleCPMLSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps. |
| 68 | `reversible_cpml_mesh` | boundary: antisymmetric, bloch, cpml, pec, periodic; mesh: explicit, graded (executions: reversible_adjoint) | entry | `torchfdtd/reversible_cpml.py::_validate_project` | ValueError | ReversibleCPMLSimulation requires uniform 3D FP32 Yee staircase sampling and fixed resident steps. |
| 69 | `reversible_cpml_faces` | boundary: antisymmetric, cpml, pec (executions: reversible_adjoint) | entry | `torchfdtd/reversible_cpml.py::_validate_project` | ValueError | ReversibleCPMLSimulation requires periodic or Bloch x/y and CPML on both z faces. |
| 70 | `reversible_cpml_materials` | boundary: bloch, periodic; material: anisotropic_tensor, dispersive_ade (executions: reversible_adjoint) | entry | `torchfdtd/reversible_cpml.py::_validate_project` | ValueError | ReversibleCPMLSimulation supports only nondispersive dielectric declarations. |
| 71 | `reversible_cpml_sources` | boundary: bloch, periodic; source: plane_oneway, tfsf (executions: reversible_adjoint) | entry | `torchfdtd/reversible_cpml.py::_validate_project` | ValueError | ReversibleCPMLSimulation supports fixed soft electric point or z-normal plane sources only. |
| 72 | `tensor_batch_cpu` | backend: cpu (executions: tensor_batch) | entry | `torchfdtd/tensor_batch.py::run_tensor_batch` | ValueError | Tensor batch cannot execute a CPU project. Set backend="cuda" or "auto" explicitly. |
| 73 | `tensor_batch_complex` | boundary: bloch (executions: tensor_batch) | entry | `torchfdtd/tensor_batch.py::run_tensor_batch` | ValueError | Tensor batch currently requires real fields. Use BatchRunner for complex Bloch fields. |
| 74 | `tensor_batch_pmc_planes` | boundary: pmc, symmetric; monitor: plane_dft, radiation_box (executions: tensor_batch) | entry | `torchfdtd/tensor_batch.py::_validate_pmc_case` | ValueError | Tensor batch does not implement field monitors with PMC/symmetric faces; use point monitors. |
| 75 | `tensor_batch_tensor_material` | material: anisotropic_tensor (executions: tensor_batch) | entry | `torchfdtd/tensor_batch.py::run_tensor_batch` | ValueError | Tensor batch does not implement tensor materials; run the native tensor solver per project. |
| 76 | `tensor_batch_pmc_sheet_reaches_wall` | boundary: pmc, symmetric; source: tiled_sheet (executions: tensor_batch) | entry | `torchfdtd/tensor_batch.py::_validate_pmc_case` | ValueError | {source}: only point sources may address a stored upper PMC/symmetric face; plane sources must end below the wall. Checked from the prepared source terms before the cohort grids are allocated; FusedBatchIO repeats the refusal. |
| 77 | `tiled_mesh` | mesh: explicit, graded (executions: tiled) | entry | `torchfdtd/tiled.py::plan_tiles` | ValueError | Tiling requires a uniform mesh with one spacing on every axis. |
| 78 | `tiled_complex` | boundary: bloch (executions: tiled) | entry | `torchfdtd/tiled.py::plan_tiles` | ValueError | Tiling requires real fields; a Bloch phase describes a periodic cell, not a finite device. |
| 79 | `tiled_faces` | boundary: antisymmetric, pec, periodic, pmc, symmetric (executions: tiled) | entry | `torchfdtd/tiled.py::plan_tiles` | ValueError | Tiling requires CPML on the lateral and normal faces of the global project; each tile adds its own CPML at the cuts. |
| 80 | `tiled_sources` | source: plane_oneway, point, tfsf (executions: tiled) | entry | `torchfdtd/tiled.py::plan_tiles` | ValueError | {source}: tiling requires soft plane sources normal to {normal}; point, one-way and TFSF sources are not partitioned. |
| 81 | `tiled_sheet_span` | source: sheet (executions: tiled) | entry | `torchfdtd/tiled.py::plan_tiles` | ValueError | {source}: the sheet must span the whole non-PML lateral extent so that every tile sees the same incidence. |
| 82 | `tiled_monitor` | monitor: point, radiation_box (executions: tiled) | entry | `torchfdtd/tiled.py::plan_tiles` | ValueError | Tiling requires exactly one enabled field monitor normal to {normal}: the output plane. |
| 83 | `radiation_box_mesh` | monitor: radiation_box; source: plane_oneway, point, sheet, tfsf, tiled_sheet; mesh: explicit, graded (executions: forward, tensor_batch) | post | `torchfdtd/radiation_box.py::_axis_workspace_bytes` | ValueError | Stored far fields require isolated uniform 3D geometry. The stored-result adapter checks the native mesh after the run; the differentiable project_farfield has no such check. |
| 84 | `radiation_box_faces` | monitor: radiation_box; source: plane_oneway, point, sheet, tfsf, tiled_sheet; boundary: antisymmetric, bloch, pec, periodic, pmc, symmetric (executions: forward, tensor_batch) | post | `torchfdtd/radiation_box.py::_geometry` | ValueError | Stored far fields require isolated uniform 3D geometry with PML on all six outer faces. Checked after the run on the stored planes; the differentiable project_farfield accepts any six planes. |
| 85 | `radiation_box_sheet_support` | monitor: radiation_box; source: sheet, tiled_sheet (executions: forward, tensor_batch) | post | `torchfdtd/radiation_box.py::_sources` | ValueError | Total-field source support must be enclosed and clear of the measurement faces. A soft sheet outside the box is a total-field source; the closed-box transform needs it enclosed. |
| 86 | `radiation_box_tfsf_support` | monitor: radiation_box; source: tfsf (executions: forward, tensor_batch) | post | `torchfdtd/radiation_box.py::_sources` | ValueError | TFSF box faces cross or approach the measurement faces; enclose the TFSF box with one cell |
