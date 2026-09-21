"""Overlapping-tile stitching validation on a pillar array that still fits one GPU.

The 3D device is a 12 x 12 array of index-2 cylinders (period 0.5 um, radii
0.08-0.22 um, height 0.6 um) on a 6 x 6 um footprint at 0.05 um mesh, lit by a
normal-incidence sheet at 1.55 um with the output plane 0.5 um above the
pillars. The 2D variant uses the same layout with rectangles along x and a
sparse four-pillar row. The whole device is simulated once, then 2 x 2 tiles
(2D: two tiles) with several overlaps. Records go to docs/validation and the
tables in docs/TILED_STITCHING.md are rendered from them by
benchmarks.report_tiled_stitching.
"""
import argparse
import json
import math
from pathlib import Path
import time
import warnings

import numpy as np
import torch

from torchfdtd import (AdjointOptions, DifferentiablePlaneSimulation, FieldMonitor, Project, Region, Simulation,
                       Source, Structure, TiledPlaneSimulation, plan_tiles, propagate_plane, run_tiled, stitch_planes)
from torchfdtd.run_control import source_end_time
from torchfdtd.solver import voxelize

C0 = 299792458.0
WAVELENGTH = 1.55
FREQUENCY = C0 / (WAVELENGTH * 1e-6)


def device(dimension, *, through_pml=True, period=.5, count=12, radius=(.08, .22), seed=3, backend='cuda',
           precision='float32', extra_fs=40., mesh=.05):
    """The pillar array. ``through_pml=False`` keeps the sheet inside the non-PML region."""
    three = dimension == '3d'
    size = (7., 7., 3.) if three else (7., 3., 1.)
    region = Region(dimension=dimension, size=size, mesh=mesh, pml_cells=round(.5 / mesh), steps=1000, precision=precision,
                    backend=backend, cuda_kernel='fused' if backend == 'cuda' else 'torch')
    normal = 'z' if three else 'y'
    sheet = (7., 7., 0.) if three else (7., 0., 0.)
    if not through_pml:
        sheet = (6., 6., 0.) if three else (6., 0., 0.)
    source = Source(kind='plane', normal=normal, center=(0., 0., -.85) if three else (0., -.85, 0.), size=sheet,
                    component='Ex', wavelength=WAVELENGTH, extend_through_pml=through_pml)
    monitor = FieldMonitor(id='out', normal=normal, center=(0., 0., .5) if three else (0., .5, 0.),
                           size=(6., 6., 0.) if three else (6., 0., 1.),
                           spectrum=dict(sampling='custom', custom_frequencies_hz=[FREQUENCY], apodization='none'))
    rng = np.random.default_rng(seed)
    structures = []
    start = -(count - 1) * period / 2
    if three:
        for i in range(count):
            for j in range(count):
                structures.append(Structure(kind='circle', center=(start + period * i, start + period * j, -.3),
                                            radius=float(rng.uniform(*radius)), size=(1., 1., .6), material='SiN (constant n)'))
    else:
        for i in range(count):
            structures.append(Structure(kind='rectangle', center=(start + period * i, -.3, 0.),
                                        size=(2 * float(rng.uniform(*radius)), .6, 1.), material='SiN (constant n)'))
    project = Project(region=region, structures=structures, sources=[source], monitors=[monitor])
    project.region.steps = math.ceil((source_end_time(project) + extra_fs * 1e-15) / project.region.time_step)
    return Project.model_validate(project.model_dump())


def plane_tensor(result, monitor_id, plan):
    """Reference plane as (F, Nu, Nv, 6) on the same grid as a stitched plane."""
    return stitch_planes(plan, [result.field_monitor(monitor_id)]).fields


def relative(a, b):
    return float((a - b).norm() / b.norm())


def peak_memory(device):
    if device == 'cuda':
        torch.cuda.synchronize()
        return int(torch.cuda.max_memory_allocated())
    return None


def reset_memory(device):
    if device == 'cuda':
        torch.cuda.synchronize()
        torch.cuda.reset_peak_memory_stats()


def error_by_distance(stitched, reference, plan):
    """RMS relative field error binned by the distance to the nearest cut, in um."""
    difference = (stitched.fields - reference).abs().square().sum((0, 3))
    scale = reference.abs().square().sum((0, 3)).mean()
    u = stitched.u_um.cpu().numpy()
    v = stitched.v_um.cpu().numpy()
    cuts = [[float(plan.project.region.mesh_nodes[a][t.core[i][1]]) for t in plan.tiles if t.index[i] < plan.counts[i] - 1]
            for i, a in enumerate(plan.lateral)]
    du = np.min(np.abs(u[:, None] - np.array(cuts[0])[None, :]), axis=1) if cuts[0] else np.full(len(u), np.inf)
    if len(cuts) == 2:
        dv = np.min(np.abs(v[:, None] - np.array(cuts[1])[None, :]), axis=1)
        distance = np.minimum(du[:, None], dv[None, :])
    else:
        distance = du[:, None] * np.ones((1, len(v)))
    rows = []
    for lo, hi in ((0, .25), (.25, .5), (.5, 1.), (1., 1.5), (1.5, 2.), (2., 3.)):
        mask = torch.as_tensor((distance >= lo) & (distance < hi), device=difference.device)
        if bool(mask.any()):
            rows.append(dict(distance_um=[lo, hi], rms_relative_error=float((difference[mask].mean() / scale).sqrt())))
    return rows


def overlap_series(project, overlaps, *, tile_um, backend, focal_um, pad, distance_map_overlap=None):
    """Reference once, then the tiled runs; errors, indicators and timings per overlap."""
    reset_memory(backend)
    started = time.perf_counter()
    result = Simulation(project).run()
    reference = dict(wall_seconds=time.perf_counter() - started, loop_seconds=result.summary['seconds'],
                     setup_seconds=result.summary['setup_seconds'], cells=math.prod(project.region.shape),
                     shape=list(project.region.shape), steps=result.summary['steps'],
                     peak_torch_bytes=peak_memory(backend), mcells_per_second=result.summary['mcells_per_second'])
    whole = plan_tiles(project, project.region.size[0], .25)  # one tile: the reference on the stitched grid
    assert len(whole.tiles) == 1
    plane = stitch_planes(whole, [result.field_monitor('out')])
    focal = propagate_plane(plane, focal_um, 1., pad=pad)
    intensity = focal.intensity()
    rows = []
    for overlap in overlaps:
        plan = plan_tiles(project, tile_um, overlap)
        reset_memory(backend)
        started = time.perf_counter()
        hard = run_tiled(project, plan, backend=backend)
        wall = time.perf_counter() - started
        linear = stitch_planes(plan, hard.tile_planes, blend='linear')
        row = dict(overlap_um=overlap, overlap_cells=plan.overlap_cells, tiles=len(plan.tiles),
                   tile_shapes=sorted({tuple(t.project.region.shape) for t in plan.tiles}),
                   largest_tile_cells=plan.report['largest_tile_cells'], total_tile_cells=plan.report['total_tile_cells'],
                   wall_seconds=wall, peak_torch_bytes=peak_memory(backend),
                   near_error_hard=relative(hard.fields, plane.fields), near_error_linear=relative(linear.fields, plane.fields),
                   mismatch_max=hard.report['max_mismatch'], mismatch_mean=hard.report['mean_mismatch'],
                   mismatch_center_max=hard.report['max_mismatch_center'], mismatch_center_mean=hard.report['mean_mismatch_center'],
                   pairs=hard.report['pairs'])
        for label, stitched in (('hard', hard), ('linear', linear)):
            propagated = propagate_plane(stitched, focal_um, 1., pad=pad).intensity()
            row['focal_intensity_error_' + label] = relative(propagated, intensity)
            row['focal_peak_error_' + label] = float((propagated.max() - intensity.max()).abs() / intensity.max())
        if distance_map_overlap is not None and math.isclose(overlap, distance_map_overlap):
            row['error_by_distance'] = error_by_distance(hard, plane.fields, plan)
        rows.append(row)
        print(f"  overlap {overlap:g}: near {row['near_error_hard']:.4f}/{row['near_error_linear']:.4f} "
              f"focal {row['focal_intensity_error_hard']:.4f}/{row['focal_intensity_error_linear']:.4f} "
              f"mismatch {row['mismatch_max']:.3f} center {row['mismatch_center_max']:.3f} wall {wall:.1f}s", flush=True)
    return reference, rows


def throughput(project, overlap, *, tile_um, backend, cohort_size):
    """Sequential and tensor executors against the reference, with peak Torch memory."""
    records = {}
    plan = plan_tiles(project, tile_um, overlap)
    for executor, options in (('sequential', {}), ('tensor', dict(cohort_size=cohort_size))):
        if executor == 'tensor' and backend != 'cuda':
            continue
        reset_memory(backend)
        started = time.perf_counter()
        stitched = run_tiled(project, plan, backend=backend, executor=executor, options=options)
        records[executor] = dict(wall_seconds=time.perf_counter() - started, peak_torch_bytes=peak_memory(backend),
                                 tiles=len(plan.tiles), largest_tile_cells=plan.report['largest_tile_cells'],
                                 total_tile_cells=plan.report['total_tile_cells'], execution=stitched.report['execution'],
                                 tiles_run=stitched.report['tiles_run'], options=options)
        print(f"  {executor}: wall {records[executor]['wall_seconds']:.2f}s peak {records[executor]['peak_torch_bytes']}", flush=True)
    return dict(overlap_um=overlap, executors=records)


def parameter_mask(project, epsilon, parameter):
    """``('cell', (i, j, k))`` selects one permittivity cell; ``('pillar', n)`` every cell of that pillar."""
    kind, target = parameter
    mask = torch.zeros_like(epsilon, dtype=torch.bool)
    if kind == 'cell':
        mask[tuple(target)] = True
        return mask
    pillar = project.structures[target]
    r = project.region
    lateral = range(2) if r.dimension == '3d' else range(1)
    window = [slice(None)] * 3
    for a in lateral:
        half = pillar.radius if pillar.kind == 'circle' else pillar.size[a] / 2
        window[a] = slice(int(round((pillar.center[a] - half + r.size[a] / 2) / r.mesh)) - 1,
                          int(round((pillar.center[a] + half + r.size[a] / 2) / r.mesh)) + 1)
    mask[tuple(window)] = True
    return mask & (epsilon > 1.5)


def gradient_check(project, overlap, parameters, *, tile_um, backend, focal_um, pad, window_cells, checkpoints=4):
    """Tiled adjoint against the full-device adjoint and central differences of both forwards.

    One backward per model gives the whole permittivity gradient; each
    parameter derivative is the sum over its cells, checked against a central
    difference of the same forward model with ``delta`` on those cells.
    """
    dtype = torch.float64 if project.region.precision == 'float64' else torch.float32
    epsilon = torch.as_tensor(voxelize(project)[0], dtype=dtype, device=backend)
    plan = plan_tiles(project, tile_um, overlap)
    whole = plan_tiles(project, project.region.size[0], .25)
    delta = .05 if dtype == torch.float32 else 1e-3
    options = AdjointOptions(checkpoints=checkpoints)
    tiled = TiledPlaneSimulation(project, plan, options)
    full = DifferentiablePlaneSimulation(project, options)
    scale = 1e-28

    def objective(stitched):
        intensity = propagate_plane(stitched, focal_um, 1., pad=pad).intensity()[0]
        nu, nv = intensity.shape
        return intensity[nu // 2 - window_cells:nu // 2 + window_cells, max(0, nv // 2 - window_cells):nv // 2 + window_cells].sum() / scale

    def tiled_objective(eps):
        return objective(tiled(eps, [FREQUENCY]))

    def full_objective(eps):
        return objective(stitch_planes(whole, [full(eps, [FREQUENCY])['out']]))

    record = dict(overlap_um=overlap, overlap_cells=plan.overlap_cells, tiles=len(plan.tiles), delta=delta,
                  precision=project.region.precision, checkpoints=checkpoints, window_cells=window_cells, parameters=[])
    gradients = {}
    for label, function in (('tiled', tiled_objective), ('full', full_objective)):
        started = time.perf_counter()
        design = epsilon.clone().requires_grad_()
        value = function(design)
        value.backward()
        gradients[label] = design.grad.detach()
        record[label + '_adjoint_seconds'] = time.perf_counter() - started
        record[label + '_objective'] = float(value)
        record[label + '_gradient_norm'] = float(gradients[label].norm())
        print(f"  {label}: objective {float(value):.6e} gradient norm {record[label + '_gradient_norm']:.4e} "
              f"({record[label + '_adjoint_seconds']:.1f}s)", flush=True)
    record['gradient_relative_l2_tiled_vs_full'] = float((gradients['tiled'] - gradients['full']).norm() / gradients['full'].norm())
    # Inside a tile's own absorber the tile gradient has no meaning; the design cells are what an optimizer uses.
    design = epsilon > 1.5
    record['design_cells'] = int(design.sum())
    record['design_gradient_relative_l2_tiled_vs_full'] = float((gradients['tiled'][design] - gradients['full'][design]).norm() / gradients['full'][design].norm())
    record['objective_relative_difference'] = abs(record['tiled_objective'] - record['full_objective']) / abs(record['full_objective'])
    # The permittivity derivative of every pillar is a masked sum of the same gradients.
    pillars = []
    for index, structure in enumerate(project.structures):
        mask = parameter_mask(project, epsilon, ('pillar', index))
        pillars.append(dict(index=index, center=list(structure.center[:2]), cells=int(mask.sum()),
                            tiled=float(gradients['tiled'][mask].sum()), full=float(gradients['full'][mask].sum())))
    record['pillar_derivatives'] = pillars
    tiled_vector = torch.tensor([q['tiled'] for q in pillars])
    full_vector = torch.tensor([q['full'] for q in pillars])
    record['pillar_vector_relative_l2'] = float((tiled_vector - full_vector).norm() / full_vector.norm())
    strongest = int(full_vector.abs().argmax())
    parameters = list(parameters) + ([('pillar', strongest)] if ('pillar', strongest) not in parameters else [])
    for parameter in parameters:
        mask = parameter_mask(project, epsilon, parameter)
        kind, target = parameter
        item = dict(kind=kind, target=list(target) if kind == 'cell' else target, cells=int(mask.sum()))
        for label, function in (('tiled', tiled_objective), ('full', full_objective)):
            item[label + '_adjoint'] = float(gradients[label][mask].sum())
            with torch.no_grad():
                plus, minus = epsilon.clone(), epsilon.clone()
                plus[mask] += delta
                minus[mask] -= delta
                item[label + '_central_difference'] = float((function(plus) - function(minus)) / (2 * delta))
            item[label + '_adjoint_vs_central_difference'] = abs(item[label + '_adjoint'] - item[label + '_central_difference']) / abs(item[label + '_central_difference'])
        item['tiled_vs_full'] = abs(item['tiled_adjoint'] - item['full_adjoint']) / abs(item['full_adjoint'])
        record['parameters'].append(item)
        print(f"  {kind} {target}: tiled {item['tiled_adjoint']:.6e} (cd {item['tiled_central_difference']:.6e}) "
              f"full {item['full_adjoint']:.6e} (cd {item['full_central_difference']:.6e})", flush=True)
    return record


def run(dimension, backend, *, quick=False):
    three = dimension == '3d'
    tile_um, focal_um, pad = 3., 10., 4
    overlaps = [.25, .5, 1., 1.5, 2., 2.5] if not quick else [.5, 1.5]
    record = dict(dimension=dimension, device=backend, gpu=torch.cuda.get_device_name() if backend == 'cuda' else None,
                  torch=torch.__version__, wavelength_um=WAVELENGTH, mesh_um=.05, tile_um=tile_um, focal_um=focal_um, pad=pad,
                  scope='Overlapping-tile stitching of one pillar array against its whole-device reference. '
                        'Relative L2 errors of the six-component output plane and of the focal intensity after angular-spectrum propagation.')
    main = device(dimension, backend=backend)
    record['project'] = main.model_dump(mode='json')
    print('through-PML sheet, pillar array', main.region.shape, main.region.steps, 'steps', flush=True)
    record['reference'], record['through_pml'] = overlap_series(main, overlaps, tile_um=tile_um, backend=backend,
                                                                focal_um=focal_um, pad=pad, distance_map_overlap=1.5)
    empty = Project.model_validate({**main.model_dump(), 'structures': []})
    print('through-PML sheet, empty device', flush=True)
    _, record['through_pml_empty'] = overlap_series(empty, overlaps[:2], tile_um=tile_um, backend=backend, focal_um=focal_um, pad=pad)
    truncated = device(dimension, backend=backend, through_pml=False)
    print('sheet inside the non-PML region, pillar array', flush=True)
    _, record['truncated_sheet'] = overlap_series(truncated, overlaps[:4], tile_um=tile_um, backend=backend, focal_um=focal_um, pad=pad)
    empty_truncated = Project.model_validate({**truncated.model_dump(), 'structures': []})
    print('sheet inside the non-PML region, empty device', flush=True)
    _, record['truncated_sheet_empty'] = overlap_series(empty_truncated, overlaps[:2], tile_um=tile_um, backend=backend, focal_um=focal_um, pad=pad)
    if not three:
        sparse = device(dimension, backend=backend, period=1.25, count=4, radius=(.1, .15), seed=5)
        record['sparse_project'] = sparse.model_dump(mode='json')
        print('through-PML sheet, sparse four-pillar row', flush=True)
        record['sparse_reference'], record['sparse'] = overlap_series(sparse, [.25, .5, 1., 1.5, 2., 2.5], tile_um=tile_um,
                                                                      backend=backend, focal_um=focal_um, pad=pad)
    print('throughput', flush=True)
    record['throughput'] = throughput(main, 1.5, tile_um=tile_um, backend=backend, cohort_size=4)
    print('gradient consistency', flush=True)
    if three:
        # The pillar at (-1.75, -1.75) lies inside the core of tile-0-0, 1.25 um from both cuts.
        index = [i for i, s in enumerate(main.structures) if abs(s.center[0] + 1.75) < 1e-9 and abs(s.center[1] + 1.75) < 1e-9][0]
        record['gradient'] = [gradient_check(main, 1.5, [('pillar', index)], tile_um=tile_um, backend=backend,
                                             focal_um=focal_um, pad=pad, window_cells=10)]
    else:
        # FP64 on a 0.1 um mesh keeps the Torch CPU adjoint affordable; one cell and one whole pillar in the core of tile-0.
        precise = device(dimension, backend=backend, precision='float64', mesh=.1)
        record['gradient_project'] = precise.model_dump(mode='json')
        cell = (int(round((-1.75 + 3.5) / .1)), int(round((-.3 + 1.5) / .1)), 0)
        record['gradient'] = [gradient_check(precise, overlap, [('cell', cell), ('pillar', 3)], tile_um=tile_um, backend=backend,
                                             focal_um=focal_um, pad=pad, window_cells=5)
                              for overlap in ([.5, 1.5, 2.5] if not quick else [1.5])]
    return record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dimension', choices=('2d', '3d'), default='3d')
    parser.add_argument('--device', choices=('cpu', 'cuda'), default='cuda')
    parser.add_argument('--output', required=True)
    parser.add_argument('--quick', action='store_true', help='fewer overlaps, for a smoke run')
    args = parser.parse_args()
    warnings.simplefilter('ignore')
    torch.manual_seed(0)
    started = time.perf_counter()
    record = run(args.dimension, args.device, quick=args.quick)
    record['total_seconds'] = time.perf_counter() - started
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(record, indent=1, allow_nan=False, default=lambda v: v.tolist() if hasattr(v, 'tolist') else str(v)) + '\n',
                    encoding='utf-8', newline='\n')
    print('wrote', path, f'{record["total_seconds"]:.0f}s')


if __name__ == '__main__':
    main()
