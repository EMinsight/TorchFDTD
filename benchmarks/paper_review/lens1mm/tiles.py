"""1 mm x 1 mm hyperbolic SiN metalens: 40 um tiles of one quadrant, exit-plane near field saved per tile.

The lens and the x-polarized illumination are mirror-symmetric in x and in y, so the tiles of the quadrant x >= 0,
y >= 0 (tile centres k * TILE, k = 0..12) determine the whole aperture. The post widths come from
docs/validation/paper_review/lens1mm-widths.npz (half-nanometre integers). Materials are constant-index at the 510 nm
design wavelength. Each tile runs resident; the solver admits it by its memory estimate (about 43 GiB of free GPU
memory for these tiles).
usage: python tiles.py <out_dir> [--widths NPZ] [--only X0,Y0] [--max-tiles N]
"""
import argparse
import json
import time
from pathlib import Path

import numpy as np
import torch
from torchfdtd import (FieldMonitor, Material, MeshRefinement, Project, Region, RunControl, Simulation, Source,
                       SpectrumSettings, Structure)
from torchfdtd.models import default_materials

REPO = Path(__file__).resolve().parents[3]
ap = argparse.ArgumentParser()
ap.add_argument('out')
ap.add_argument('--widths', default=str(REPO / 'docs/validation/paper_review/lens1mm-widths.npz'))
ap.add_argument('--only', default=None)
ap.add_argument('--max-tiles', type=int, default=None)
args = ap.parse_args()
W = np.load(args.widths)['widths_half_nm'].astype(np.float64) * 0.5e-3          # micrometres
OUT = Path(args.out)
NF = OUT / 'nearfield'
NF.mkdir(parents=True, exist_ok=True)
PITCH, H, OVER, MESH, STEPS, TILE = 0.29, 0.7, 0.5, 0.02, 1600, 40.0
Z0 = 0.3
ZM = H + 0.15                    # exit plane, 150 nm above the posts
LAM = [0.45, 0.51, 0.635]
DS = 6                           # 20 nm cells averaged to 120 nm samples for the propagation
PMLC = 12
N_SIN, N_SIO2 = 2.0608, 1.4617
L = TILE + 2 * OVER
LI = L - 2 * PMLC * MESH - 0.04
n = W.shape[0]
xs = (np.arange(n) - n // 2) * PITCH
MATERIALS = default_materials() + [Material(name='SiN n510', index=N_SIN, color='#69a1e8'),
                                   Material(name='SiO2 n510', index=N_SIO2, color='#80c4d7')]


def run_tile(X0, Y0):
    structures = [Structure(name='substrate', kind='rectangle', center=(0, 0, -0.5 - Z0), size=(L, L, 1.0),
                            material='SiO2 n510', mesh_order=3)]
    ix = np.flatnonzero(np.abs(xs - X0) <= L / 2)
    iy = np.flatnonzero(np.abs(xs - Y0) <= L / 2)
    for i in ix:
        for j in iy:
            w = float(W[i, j])
            structures.append(Structure(name=f'p{i}_{j}', kind='rectangle', center=(xs[i] - X0, xs[j] - Y0, H / 2 - Z0),
                                        size=(w, w, H), material='SiN n510'))
    spec = SpectrumSettings(sampling='custom', custom_frequencies_hz=sorted(299792458.0 / (l * 1e-6) for l in LAM),
                            apodization='none')
    project = Project(name=f'lens1mm tile {X0} {Y0}', materials=MATERIALS,
        region=Region(dimension='3d', size=(L, L, 2.6), mesh=MESH, mesh_type='graded', mesh_auto_refine=False, mesh_max=0.04,
                      mesh_ppw=10, mesh_grading=1.25,
                      mesh_refinements=[MeshRefinement(name='post layer', center=(0, 0, H / 2 - Z0), size=(L, L, H + 0.1))],
                      run_control=RunControl(auto_shutoff=True, decay_threshold=1e-5, check_interval=50, consecutive_checks=2,
                                             min_steps=400),
                      steps=STEPS, pml_cells=PMLC, backend='cuda', cuda_kernel='fused', cuda_monitor_kernel='fused',
                      precision='float32', material_sampling='yee', interface_method='staircase', snapshot_interval=10000),
        structures=structures,
        sources=[Source(name='plane', kind='plane', injection='soft', normal='z', direction='+', center=(0, 0, -0.55 - Z0),
                        size=(LI, LI, 0), component='Ex', pulse='broadband', time_definition='wavelength',
                        wavelength_start=0.40, wavelength_stop=0.70)],
        monitors=[FieldMonitor(id='xy', name='exit', normal='z', center=(0, 0, ZM - Z0), size=(LI, LI, 0), spectrum=spec,
                               spatial_interpolation='nearest', record_fields=['Ex', 'Ey', 'Ez'], record_poynting=[],
                               record_flux=False)])
    torch.cuda.reset_peak_memory_stats()
    res = Simulation(project).run(cuda_graph=True)
    fm = res.field_monitor('xy')
    pts, F = fm['points_um'], fm['fields']
    order = np.argsort(-fm['frequency_hz'])                   # 450, 510, 635 nm
    nx = len(np.unique(np.round(pts[:, 0], 6)))
    ny = len(np.unique(np.round(pts[:, 1], 6)))
    px = pts[:, 0].reshape(nx, ny) + X0
    py = pts[:, 1].reshape(nx, ny) + Y0
    keep = (px >= X0 - TILE / 2) & (px < X0 + TILE / 2) & (py >= Y0 - TILE / 2) & (py < Y0 + TILE / 2)
    r0, r1 = np.where(keep.any(1))[0][[0, -1]]
    c0, c1 = np.where(keep.any(0))[0][[0, -1]]
    r1 = r0 + ((r1 - r0 + 1) // DS) * DS
    c1 = c0 + ((c1 - c0 + 1) // DS) * DS

    def ds(a):
        return a[r0:r1, c0:c1].reshape((r1 - r0) // DS, DS, (c1 - c0) // DS, DS).mean((1, 3))
    fields = np.stack([np.stack([ds(F[order[k], :, comp].reshape(nx, ny)) for comp in range(3)]) for k in range(3)])
    info = {k: v for k, v in res.summary.items() if 'step' in k or 'shutoff' in k or 'cell' in k}
    info['peak_torch_allocated_gb'] = torch.cuda.max_memory_allocated() / 1e9
    info['cells'] = int(np.prod(project.region.shape))
    return ds(px), ds(py), fields, len(structures) - 1, info


tiles = [(k * TILE, l * TILE) for k in range(13) for l in range(13)]
if args.only:
    tiles = [tuple(float(v) for v in args.only.split(','))]
if args.max_tiles:
    tiles = tiles[:args.max_tiles]
print(f'{len(tiles)} tiles', flush=True)
for X0, Y0 in tiles:
    path = NF / f'tile_{X0:.0f}_{Y0:.0f}.npz'
    if path.exists():
        continue
    t0 = time.time()
    px, py, fields, posts, info = run_tile(X0, Y0)
    info['seconds'] = time.time() - t0
    np.savez(path, px=px, py=py, fields=fields, lam=np.array(LAM), zm=ZM, info=json.dumps(info))
    print(f"tile {X0:.0f},{Y0:.0f}: {posts} pillars, {info['seconds']:.0f} s, {json.dumps(info)}", flush=True)
    torch.cuda.empty_cache()
print('NF_DONE', flush=True)
