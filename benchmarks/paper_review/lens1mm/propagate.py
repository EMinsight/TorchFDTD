"""Stitch the quadrant tiles of the 1 mm lens, mirror them to the full aperture and propagate the exit-plane field
with the TorchFDTD angular spectrum to the xz section through the axis and to the focal plane of each wavelength.

Mirror rules for x-polarized illumination of a lens symmetric in x and y:
  x -> -x : Ex even, Ey odd, Ez odd;   y -> -y : Ex even, Ey odd, Ez even.
usage: python lens1mm_propagate.py <run_dir> [--z-step 1.0] [--z-max 1500] [--stride 1]
writes <run_dir>/stitched_quadrant.npz, xz_section.npz, focal_planes.npz and propagate_summary.json
(figures are rendered separately from these files)
"""
import argparse
import glob
import json
import math
import time
from pathlib import Path

import numpy as np
import torch
from scipy.interpolate import RegularGridInterpolator
from torchfdtd.angular_spectrum import PlaneGrid, propagate_section, propagate_volume

ap = argparse.ArgumentParser()
ap.add_argument('run')
ap.add_argument('--z-step', type=float, default=1.0)
ap.add_argument('--z-max', type=float, default=1500.0)
ap.add_argument('--stride', type=int, default=1, help='subsample the stitched plane (smoke tests only)')
args = ap.parse_args()
RUN = Path(args.run)
dev = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
HALF = 500.0
t_start = time.time()

files = sorted(glob.glob(str(RUN / 'nearfield' / 'tile_*.npz')))
D0 = np.load(files[0])
lam = D0['lam']
ZM = float(D0['zm'])
dxy = float(np.round(D0['px'][1, 0] - D0['px'][0, 0], 6))
print(f'{len(files)} tiles, sample spacing {dxy * 1e3:.0f} nm, exit plane z = {ZM} um', flush=True)

# ---- stitch the quadrant x, y >= 0 onto one lattice by complex bilinear interpolation ----
g = np.arange(0.0, HALF, dxy)
U = np.zeros((3, 3, len(g), len(g)), np.complex64)
cnt = np.zeros((len(g), len(g)), np.int16)
for f in files:
    d = np.load(f)
    px1, py1 = d['px'][:, 0], d['py'][0, :]
    sx = (g >= px1[0]) & (g <= px1[-1])
    sy = (g >= py1[0]) & (g <= py1[-1])
    if not sx.any() or not sy.any():
        continue
    P = np.stack(np.meshgrid(g[sx], g[sy], indexing='ij'), -1).reshape(-1, 2)
    for k in range(3):
        for comp in range(3):
            fld = d['fields'][k, comp]
            val = RegularGridInterpolator((px1, py1), fld.real)(P) + 1j * RegularGridInterpolator((px1, py1), fld.imag)(P)
            U[k, comp][np.ix_(sx, sy)] += val.reshape(sx.sum(), sy.sum()).astype(np.complex64)
    cnt[np.ix_(sx, sy)] += 1
assert cnt.max() == 1, f'overlapping samples: max count {cnt.max()}'
gaps = cnt == 0
print(f'quadrant lattice {len(g)}^2, gaps before fill: {int(gaps.sum())} of {gaps.size}', flush=True)
for _ in range(3):                              # seam gaps are one or two samples wide
    if not gaps.any():
        break
    filled = cnt > 0
    nb = np.zeros_like(U)
    nn = np.zeros(cnt.shape, np.float32)
    for sh in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nb += np.roll(U * filled, sh, axis=(2, 3))
        nn += np.roll(filled.astype(np.float32), sh, axis=(0, 1))
    fillable = gaps & (nn > 0)
    U[:, :, fillable] = nb[:, :, fillable] / nn[fillable]
    cnt[fillable] = 1
    gaps = cnt == 0
print(f'gaps after fill: {int(gaps.sum())}', flush=True)
np.savez(RUN / 'stitched_quadrant.npz', U=U, g=g, lam=lam, zm=ZM, n_tiles=len(files))

# ---- mirror to the full aperture ----
sign_x = np.array([1, -1, -1], np.float32)[None, :, None, None]
sign_y = np.array([1, -1, 1], np.float32)[None, :, None, None]
top = np.concatenate([sign_x * U[:, :, :0:-1, :], U], axis=2)                  # x < 0 then x >= 0
full = np.concatenate([sign_y * top[:, :, :, :0:-1], top], axis=3)              # y < 0 then y >= 0
x = np.concatenate([-g[:0:-1], g])
if args.stride > 1:
    full, x = full[:, :, ::args.stride, ::args.stride], x[::args.stride]
del top
fields = torch.from_numpy(np.ascontiguousarray(full.transpose(0, 2, 3, 1))).to(dev)   # (F, Nx, Ny, C)
del full
xt = torch.as_tensor(x, dtype=torch.float64)
plane = PlaneGrid(fields, xt, xt.clone(), (float(x[1] - x[0]),) * 2, 'z', ZM, 1,
                  torch.as_tensor(299792458.0 / (lam * 1e-6), dtype=torch.float64), ('Ex', 'Ey', 'Ez'), '3d')
print(f'full plane {tuple(fields.shape)} on {dev}, {fields.numel() * 8 / 1e9:.1f} GB', flush=True)

# ---- xz section through the axis ----
z = np.arange(args.z_step, args.z_max + 1e-9, args.z_step)
t0 = time.time()
section = propagate_section(plane, z, section='xz', offset_um=0.0, pad=2, chunk=32)
intensity = section.intensity().float().cpu().numpy()                             # (F, Nz, Nx)
t_section = time.time() - t0
focus = [section.focus(k) for k in range(len(lam))]
np.savez(RUN / 'xz_section.npz', intensity=intensity, z_um=section.z_um.cpu().numpy(), normal_um=section.normal_um.cpu().numpy(),
         x_um=section.a_um.cpu().numpy(), lam=lam)
print(f'xz section {intensity.shape} in {t_section:.0f} s; foci {json.dumps(focus)}', flush=True)
del section

# ---- focal plane of each wavelength at its axial maximum: one full-plane inverse FFT, cropped ----
w = 12.0
keep = np.flatnonzero(np.abs(x) <= w)
fx = x[keep]
focal = np.zeros((len(lam), len(fx), len(fx)), np.float32)
freq = plane.frequency_hz
t0 = time.time()
for k in range(len(lam)):
    single = PlaneGrid(fields[k:k + 1], xt, xt.clone(), plane.spacing_um, 'z', ZM, 1, freq[k:k + 1], ('Ex', 'Ey', 'Ez'), '3d')
    volume = propagate_volume(single, [focus[k]['z_um']], pad=2, chunk=1)
    focal[k] = volume.intensity()[0, 0][keep[0]:keep[-1] + 1, keep[0]:keep[-1] + 1].float().cpu().numpy()
    del volume
    torch.cuda.empty_cache()
t_focal = time.time() - t0
np.savez(RUN / 'focal_planes.npz', intensity=focal, x_um=fx, z_um=np.array([f['normal_um'] for f in focus]), lam=lam)


def fwhm(profile, coords):
    p = profile / profile.max()
    i = int(np.argmax(p))
    left = np.interp(0.5, p[:i + 1], coords[:i + 1]) if i > 0 else coords[0]
    right = np.interp(0.5, p[i:][::-1], coords[i:][::-1])
    return float(right - left)


na = HALF / math.hypot(HALF, 1000.0)
summary = dict(tiles=len(files), stitched_spacing_um=dxy, plane_samples=int(len(x)), exit_plane_z_um=ZM,
               section_seconds=t_section, focal_seconds=t_focal, total_seconds=time.time() - t_start,
               design=dict(focal_length_um=1000.0, design_wavelength_um=0.51, na_edge=na))
for k, l in enumerate(lam):
    c = len(fx) // 2
    summary[f'{l * 1e3:.0f}nm'] = dict(focus_distance_from_plane_um=focus[k]['z_um'], focus_z_um=focus[k]['normal_um'],
                                       fwhm_x_um=fwhm(focal[k][:, c], fx), fwhm_y_um=fwhm(focal[k][c, :], fx),
                                       diffraction_limit_um=float(l / (2 * na)))
(RUN / 'propagate_summary.json').write_text(json.dumps(summary, indent=1))
print(json.dumps(summary, indent=1))
print('PROPAGATE_DONE', flush=True)
