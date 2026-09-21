"""Overlapping-tile stitching error against the tile core size.

The recorded 6 x 6 um array has 3 um cores, so every core sample lies within a
few micrometres of a cut. This driver repeats the measurement on a larger pillar
array whose 2 x 2 tiles have wide cores (20 um by default) and reports the
stitched error against overlap and against the distance to the nearest cut, so
that the overlap rule can be stated per core size. The mesh is coarser than the
6 um record so that the whole-device reference still runs resident; the
comparison is between the tiled and the whole-device solution on the same mesh.
"""
import argparse
import json
import math
from pathlib import Path
import time
import warnings

import numpy as np
import torch

from torchfdtd import FieldMonitor, Project, Region, Simulation, Source, Structure, plan_tiles, propagate_plane, run_tiled, stitch_planes
from torchfdtd.run_control import source_end_time

C0 = 299792458.0
WAVELENGTH = 1.55
FREQUENCY = C0 / (WAVELENGTH * 1e-6)


def relative(a, b):
    return float(((a - b).abs().square().sum() / b.abs().square().sum()).sqrt())


def error_by_distance(stitched, reference, plan, bins):
    """RMS relative field error binned by the distance to the nearest cut, in um."""
    difference = (stitched.fields - reference).abs().square().sum((0, 3))
    scale = reference.abs().square().sum((0, 3)).mean()
    u = stitched.u_um.cpu().numpy()
    v = stitched.v_um.cpu().numpy()
    cuts = [[float(plan.project.region.mesh_nodes[a][t.core[i][1]]) for t in plan.tiles if t.index[i] < plan.counts[i] - 1]
            for i, a in enumerate(plan.lateral)]
    du = np.min(np.abs(u[:, None] - np.array(cuts[0])[None, :]), axis=1)
    dv = np.min(np.abs(v[:, None] - np.array(cuts[1])[None, :]), axis=1)
    distance = np.minimum(du[:, None], dv[None, :])
    rows = []
    for lo, hi in bins:
        mask = torch.as_tensor((distance >= lo) & (distance < hi), device=difference.device)
        if bool(mask.any()):
            rows.append(dict(distance_um=[lo, hi], rms_relative_error=float((difference[mask].mean() / scale).sqrt()),
                             samples=int(mask.sum())))
    return rows


def device(footprint, *, period, radius, mesh, backend, seed=3, extra_fs=40., height=.6, z_size=3.):
    """A square array of index-2 cylinders on a footprint of the given side, lit through the lateral PML."""
    count = int(round(footprint / period))
    pml = round(.5 / mesh)
    size = (footprint + 1., footprint + 1., z_size)
    region = Region(dimension='3d', size=size, mesh=mesh, pml_cells=pml, steps=1000, precision='float32',
                    backend=backend, cuda_kernel='fused' if backend == 'cuda' else 'torch')
    source = Source(kind='plane', normal='z', center=(0., 0., -.85), size=(size[0], size[1], 0.), component='Ex',
                    wavelength=WAVELENGTH, extend_through_pml=True)
    monitor = FieldMonitor(id='out', normal='z', center=(0., 0., .5), size=(footprint, footprint, 0.),
                           spectrum=dict(sampling='custom', custom_frequencies_hz=[FREQUENCY], apodization='none'))
    rng = np.random.default_rng(seed)
    start = -(count - 1) * period / 2
    structures = [Structure(kind='circle', center=(start + period * i, start + period * j, -.3),
                            radius=float(rng.uniform(*radius)), size=(1., 1., height), material='SiN (constant n)')
                  for i in range(count) for j in range(count)]
    project = Project(region=region, structures=structures, sources=[source], monitors=[monitor])
    project.region.steps = math.ceil((source_end_time(project) + extra_fs * 1e-15) / project.region.time_step)
    return Project.model_validate(project.model_dump())


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--footprint', type=float, default=40.)
    parser.add_argument('--tile', type=float, default=20.)
    parser.add_argument('--overlaps', type=float, nargs='+', default=[2., 5., 10.])
    parser.add_argument('--period', type=float, default=1.)
    parser.add_argument('--radius', type=float, nargs=2, default=[.2, .4])
    parser.add_argument('--mesh', type=float, default=.1)
    parser.add_argument('--focal', type=float, default=30.)
    parser.add_argument('--device', choices=('cpu', 'cuda'), default='cuda')
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    warnings.simplefilter('ignore')
    torch.manual_seed(0)
    started = time.perf_counter()
    project = device(args.footprint, period=args.period, radius=tuple(args.radius), mesh=args.mesh, backend=args.device)
    print('device', project.region.shape, project.region.steps, 'steps', len(project.structures), 'pillars', flush=True)
    if args.device == 'cuda':
        torch.cuda.reset_peak_memory_stats()
    t0 = time.perf_counter()
    result = Simulation(project).run()
    reference = dict(wall_seconds=time.perf_counter() - t0, cells=math.prod(project.region.shape), shape=list(project.region.shape),
                     steps=result.summary['steps'], mcells_per_second=result.summary['mcells_per_second'],
                     peak_torch_bytes=int(torch.cuda.max_memory_allocated()) if args.device == 'cuda' else None)
    whole = plan_tiles(project, project.region.size[0], .25)
    assert len(whole.tiles) == 1
    plane = stitch_planes(whole, [result.field_monitor('out')])
    pad = 4
    focal = propagate_plane(plane, args.focal, 1., pad=pad).intensity()
    bins = ((0, .5), (.5, 1.), (1., 2.), (2., 3.), (3., 5.), (5., 7.5), (7.5, 10.), (10., 15.))
    rows = []
    for overlap in args.overlaps:
        plan = plan_tiles(project, args.tile, overlap)
        if args.device == 'cuda':
            torch.cuda.reset_peak_memory_stats()
        t0 = time.perf_counter()
        hard = run_tiled(project, plan, backend=args.device)
        wall = time.perf_counter() - t0
        linear = stitch_planes(plan, hard.tile_planes, blend='linear')
        row = dict(overlap_um=overlap, tiles=len(plan.tiles), tile_shapes=sorted({tuple(t.project.region.shape) for t in plan.tiles}),
                   largest_tile_cells=plan.report['largest_tile_cells'], total_tile_cells=plan.report['total_tile_cells'],
                   cell_ratio=plan.report['total_tile_cells'] / reference['cells'], wall_seconds=wall,
                   peak_torch_bytes=int(torch.cuda.max_memory_allocated()) if args.device == 'cuda' else None,
                   near_error_hard=relative(hard.fields, plane.fields), near_error_linear=relative(linear.fields, plane.fields),
                   mismatch_max=hard.report['max_mismatch'], mismatch_center_max=hard.report['max_mismatch_center'],
                   error_by_distance=error_by_distance(hard, plane.fields, plan, bins))
        for label, stitched in (('hard', hard), ('linear', linear)):
            propagated = propagate_plane(stitched, args.focal, 1., pad=pad).intensity()
            row['focal_intensity_error_' + label] = relative(propagated, focal)
        rows.append(row)
        print(f"  overlap {overlap:g}: near {row['near_error_hard']:.4f}/{row['near_error_linear']:.4f} "
              f"focal {row['focal_intensity_error_hard']:.4f}/{row['focal_intensity_error_linear']:.4f} "
              f"mismatch {row['mismatch_max']:.3f} center {row['mismatch_center_max']:.3f} cells x{row['cell_ratio']:.2f} wall {wall:.1f}s", flush=True)
        for r in row['error_by_distance']:
            print(f"      {r['distance_um'][0]:>4}-{r['distance_um'][1]:<4} um: {r['rms_relative_error']:.4f} ({r['samples']} samples)", flush=True)
    record = dict(device=args.device, gpu=torch.cuda.get_device_name() if args.device == 'cuda' else None, torch=torch.__version__,
                  wavelength_um=WAVELENGTH, mesh_um=args.mesh, footprint_um=args.footprint, tile_um=args.tile, period_um=args.period,
                  radius_um=list(args.radius), focal_um=args.focal, pad=pad, project=project.model_dump(mode='json'),
                  reference=reference, overlaps=rows, total_seconds=time.perf_counter() - started,
                  scope='Overlapping-tile stitching of a pillar array with wide tile cores against its whole-device reference on the same mesh. '
                        'Relative L2 errors of the six-component output plane, the focal intensity after angular-spectrum propagation, and the RMS error binned by distance to the nearest cut.')
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(record, indent=1, allow_nan=False) + '\n', encoding='utf-8', newline='\n')
    print('wrote', path, f'{record["total_seconds"]:.0f}s')


if __name__ == '__main__':
    main()
