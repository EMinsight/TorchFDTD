"""TORCWA normal-incidence reference for the champion mask (CPU).

Writes torcwa_reference.npz with well fractions (fraction of incident power,
rows R/G2/G1/B) for constant 550-nm indices and for the dispersive production
tables, detector-plane |E|^2 maps, and the density gradient of the same
routing objective used by cr_fdtd_verify.py (constant indices).
"""
import argparse
import dataclasses
import json
import sys
import time
from pathlib import Path

import numpy as np
import torch

import os
# Source tree of https://github.com/hyoseokp/information-optimal-color-router (its src/ directory).
sys.path.insert(0, os.environ.get('CR_REPO_SRC', 'information-optimal-color-router/src'))
from cr_itd_v2.forward import materials  # noqa: E402
from cr_itd_v2.forward.contracts import DEFAULT_R1A_STACK  # noqa: E402
from cr_itd_v2.forward.torcwa_local import (  # noqa: E402
    detector_axes, power_honest_well_powers, solve_plane_wave)

materials._CONSTANT_INDEX['SiN_550'] = 2.0634
materials._CONSTANT_INDEX['SiO2_550'] = 1.4623
WELLS = ('R', 'G2', 'G1', 'B')
BANDS = {'B': (600, 670), 'G1+G2': (510, 580), 'R': (420, 490)}  # champion routes red into the quadrant named B


def stack_for(variant):
    if variant == 'constant':
        mats = dict(superstrate_material='air', design_material='SiN_550', substrate_material='SiO2_550')
    else:
        mats = dict(superstrate_material='air', design_material='SiN_nk', substrate_material='SiO2_nk')
    return dataclasses.replace(DEFAULT_R1A_STACK, design_height_um=0.6, detector_z_um=1.25, **mats)


def response(density, wavelengths_nm, stack, axes):
    rows = []
    for wl in wavelengths_nm:
        per_pol = []
        for pol in ('x', 'y'):
            sol = solve_plane_wave(density, wl * 1e-3, 0.0, 0.0, pol, stack)
            per_pol.append(power_honest_well_powers(sol, axes[0], axes[1], stack) / stack.cell_area_um2)
        rows.append(0.5 * (per_pol[0] + per_pol[1]))
    return torch.stack(rows, 1)  # (4, n_wl)


def objective(resp, wavelengths):
    wl = torch.as_tensor(wavelengths, dtype=resp.dtype)
    total = resp.new_zeros(())
    for well, (lo, hi) in BANDS.items():
        sel = (wl >= lo) & (wl <= hi)
        idx = [WELLS.index(w) for w in well.split('+')]
        total = total + resp[idx][:, sel].sum() / (len(idx) * int(sel.sum()))
    return total


def field_map(density, wl_nm, stack, n=128):
    ax = (torch.arange(n, dtype=torch.float32) + 0.5) * (stack.period_um[0] / n)
    total = torch.zeros(n, n)
    for pol in ('x', 'y'):
        sol = solve_plane_wave(density, wl_nm * 1e-3, 0.0, 0.0, pol, stack)
        e, _ = sol.simulation.field_xy(sol.simulation.layer_N, ax, ax, z_prop=stack.detector_z_um)
        total += 0.5 * sum(c.abs().square() for c in e)
    return total.numpy()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--mask', default='best_mask.npy')
    ap.add_argument('--out', default='torcwa_reference.npz')
    ap.add_argument('--wl-step', type=float, default=10)
    ap.add_argument('--map-wavelengths', default='450,550,650')
    args = ap.parse_args()
    torch.set_num_threads(8)
    density = torch.tensor(np.load(args.mask).astype(np.float32))
    wavelengths = np.arange(420, 670 + 1e-9, args.wl_step)
    out = dict(wavelengths_nm=wavelengths, density=density.numpy())
    t0 = time.time()
    for variant in ('constant', 'dispersive'):
        stack = stack_for(variant)
        axes = detector_axes(stack, 'cpu')
        with torch.no_grad():
            resp = response(density, wavelengths, stack, axes)
        out[f'response_{variant}'] = resp.numpy()
        out[f'transmission_{variant}'] = resp.sum(0).numpy()
        print(variant, 'done', time.time() - t0, 's', flush=True)
        print(np.array2string(resp.numpy(), precision=4, max_line_width=250))
    stack = stack_for('constant')
    axes = detector_axes(stack, 'cpu')
    rho = density.clone().requires_grad_(True)
    J = objective(response(rho, wavelengths, stack, axes), wavelengths)
    J.backward()
    out['objective_constant'] = np.array(float(J))
    out['gradient_constant'] = rho.grad.numpy()
    print('objective', float(J), 'grad norm', float(rho.grad.norm()), time.time() - t0, 's', flush=True)
    with torch.no_grad():
        for wl in [float(v) for v in args.map_wavelengths.split(',')]:
            out[f'E2_constant_{int(wl)}'] = field_map(density, wl, stack)
    np.savez(args.out, **out)
    print('saved', args.out, time.time() - t0, 's')


if __name__ == '__main__':
    main()
