"""Cross-check of the air-clad SiN colour router of arXiv:2608.13019 with TorchFDTD.

Geometry (TORCWA champion): 2 x 2 um period, 128 x 128 binary density,
SiN h = 0.6 um in air, SiO2 substrate, detector plane 1.25 um below the SiN
bottom, normal incidence, unpolarised (x/y average). Fixed lossless indices.

Modes
  forward : spectrum of the four wells R/G2/G1/B + detector/xz field maps
  grad    : density gradient of a routing objective + finite-difference check
  opt     : a few projected Adam steps on the density (does the objective rise?)

All numbers are written to <out>/*.npz|json; plotting is a separate script.
"""
import argparse
from dataclasses import replace
import json
import math
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

import numpy as np
import torch

from torchfdtd import AdjointOptions, FieldMonitor, Project, Region, Source
from torchfdtd.adjoint_planes import DifferentiablePlaneSimulation
from torchfdtd.density_layer import periodic_density_layer
from torchfdtd.detector_allocation import quadrant_intensity_allocation
from torchfdtd.models import Boundaries, BoundaryFace
from torchfdtd.solver import C0, field_axes

PERIOD = 2.0
HEIGHT = 0.6
DETECTOR_OFFSET = 1.25
N_SIN = 2.0634   # SiN_nk table at 550 nm
N_SIO2 = 1.4623  # SiO2_nk table at 550 nm
WELLS = ('R', 'G2', 'G1', 'B')


def build_project(mesh, steps, pml_cells, xz_plane):
    source_z = -HEIGHT / 2 - 1.2
    probe_z = -HEIGHT / 2 - 0.6
    detector_z = HEIGHT / 2 + DETECTOR_OFFSET
    half = math.ceil((max(detector_z, -source_z) + 0.45 + pml_cells * mesh) / mesh) * mesh
    face = BoundaryFace(kind='periodic')
    region = Region(dimension='3d', size=(PERIOD, PERIOD, 2 * half), mesh=mesh, steps=steps,
                    pml_cells=pml_cells, precision='float32', background_index=1.0,
                    material_sampling='yee', cuda_kernel='fused', memory_mode='resident',
                    boundaries=Boundaries(x_min=face, x_max=face, y_min=face, y_max=face))
    monitors = [FieldMonitor(id='incident', normal='z', size=(PERIOD, PERIOD, 0), center=(0, 0, probe_z)),
                FieldMonitor(id='detector', normal='z', size=(PERIOD, PERIOD, 0), center=(0, 0, detector_z))]
    if xz_plane:
        lo, hi = region.interior_bounds(2)
        zc, zs = (lo + hi) / 2, (hi - lo) - 2 * mesh
        monitors.append(FieldMonitor(id='xz', normal='y', size=(PERIOD, 0, zs), center=(0, -0.5, zc)))
    project = Project(region=region, monitors=monitors, sources=[
        Source(id='plane', kind='plane', normal='z', size=(PERIOD, PERIOD, 0), center=(0, 0, source_z),
               component='Ex', pulse='broadband', time_definition='wavelength',
               wavelength=0.55, wavelength_start=0.40, wavelength_stop=0.70)])
    return project, dict(source_z=source_z, probe_z=probe_z, detector_z=detector_z, half=half)


def epsilon_map(density, region):
    eps = periodic_density_layer(density, region, bottom_um=-HEIGHT / 2, top_um=HEIGHT / 2,
                                 background_epsilon=1.0, design_epsilon=N_SIN ** 2)
    dz = region.axis_steps[2]
    parts = []
    for i, component in enumerate(('Ex', 'Ey', 'Ez')):
        z = torch.tensor(field_axes(region, component)[2], dtype=density.dtype, device=density.device)
        below = ((z + dz / 2 - HEIGHT / 2) / dz).clamp(0, 1)
        parts.append(eps[..., i] + (N_SIO2 ** 2 - 1.0) * below[None, None, :])
    return torch.stack(parts, -1)


class Router:
    def __init__(self, args):
        self.args = args
        self.device = torch.device(args.device)
        self.project, self.geometry = build_project(args.mesh, args.steps, args.pml, args.xz)
        self.region = self.project.region
        self.wavelengths = np.arange(args.wl_start, args.wl_stop + 1e-9, args.wl_step)
        self.frequency = [C0 / (w * 1e-9) for w in self.wavelengths]
        cuda = self.device.type == 'cuda'
        gib = 1024 ** 3
        options = AdjointOptions(checkpoints=args.checkpoints, backward_kernel='fused' if cuda else 'torch',
                                 gpu_budget_bytes=int(args.gpu_gib * gib) if cuda else None,
                                 host_budget_bytes=int(args.host_gib * gib),
                                 resident_budget_bytes=int((args.gpu_gib if cuda else args.host_gib) * gib))
        q = dict(incident=(args.quad, args.quad), detector=(args.quad, args.quad))
        if args.xz:
            q['xz'] = (args.quad, args.quad_z)
        self.models = {}
        for component in ('Ex', 'Ey'):
            p = self.project.model_copy(deep=True)
            p.sources[0].component = component
            self.models[component] = DifferentiablePlaneSimulation(p, options, quadrature_counts=q)
        self.reference = None

    def references(self):
        if self.reference is None:
            shape = tuple(self.region.shape) + (3,)
            eps = torch.ones(shape, dtype=torch.float32, device=self.device)
            with torch.no_grad():
                self.reference = {c: m(eps, self.frequency) for c, m in self.models.items()}
        return self.reference

    def response(self, density, keep_fields=False):
        """(4, n_wavelength) fraction of incident power per well, x/y averaged."""
        refs = self.references()
        eps = epsilon_map(density, self.region)
        rows, fields = [], {}
        for component, model in self.models.items():
            planes = model(eps, self.frequency)
            det = planes['detector']
            transmission = det.normalized_flux(refs[component]['detector'])
            # Reduced SI-scale fields underflow FP32 in |E|^2 * area; the
            # allocation only uses ratios, so rescale by detached constants.
            scaled = replace(det, fields=det.fields / det.fields.detach().abs().amax(),
                             weights=det.weights / det.weights.detach().amax())
            rows.append(quadrant_intensity_allocation(scaled, transmission))
            if keep_fields:
                fields[component] = {k: v for k, v in planes.items()}
        resp = 0.5 * (rows[0] + rows[1]).T  # (4, n_wl)
        return (resp, fields) if keep_fields else resp


def objective(resp, wavelengths, bands):
    """Sum of well fractions in their bands: R in red, G1+G2 in green, B in blue."""
    wl = torch.as_tensor(wavelengths, dtype=resp.dtype, device=resp.device)
    total = resp.new_zeros(())
    for well, (lo, hi) in bands.items():
        sel = (wl >= lo) & (wl <= hi)
        idx = [WELLS.index(w) for w in well.split('+')]
        total = total + resp[idx][:, sel].sum() / (len(idx) * int(sel.sum()))
    return total


BANDS = {'B': (600, 670), 'G1+G2': (510, 580), 'R': (420, 490)}  # champion routes red into the quadrant named B


def plane_to_map(plane):
    """Return |E|^2 (n_wl, n1, n2) and the axes of a plane result."""
    f = plane.fields.detach().cpu()
    intensity = f[..., :3].abs().square().sum(-1).reshape(f.shape[0], *plane.shape)
    pts = plane.points_um.detach().cpu().numpy().reshape(*plane.shape, 3)
    return intensity.numpy(), pts


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--mode', choices=['forward', 'grad', 'opt'], default='forward')
    ap.add_argument('--mask', required=True, help='128 x 128 boolean mask, e.g. data/masks/champion_r1a.npy of the colour-router repository')
    ap.add_argument('--out', default='out')
    ap.add_argument('--device', default='cuda')
    ap.add_argument('--mesh', type=float, default=PERIOD / 128)
    ap.add_argument('--steps', type=int, default=4000)
    ap.add_argument('--pml', type=int, default=16)
    ap.add_argument('--quad', type=int, default=64)
    ap.add_argument('--quad-z', type=int, default=128)
    ap.add_argument('--xz', action='store_true')
    ap.add_argument('--checkpoints', type=int, default=8)
    ap.add_argument('--gpu-gib', type=float, default=40)
    ap.add_argument('--host-gib', type=float, default=64)
    ap.add_argument('--wl-start', type=float, default=420)
    ap.add_argument('--wl-stop', type=float, default=670)
    ap.add_argument('--wl-step', type=float, default=10)
    ap.add_argument('--downsample', type=int, default=1, help='density block-average factor (dev only)')
    ap.add_argument('--fd-eps', type=float, default=0.02)
    ap.add_argument('--fd-dirs', type=int, default=2)
    ap.add_argument('--opt-steps', type=int, default=5)
    ap.add_argument('--lr', type=float, default=0.05)
    ap.add_argument('--seed', type=int, default=0)
    args = ap.parse_args()
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    torch.manual_seed(args.seed)

    mask = np.load(args.mask).astype(np.float32)
    if args.downsample > 1:
        d = args.downsample
        mask = mask.reshape(mask.shape[0] // d, d, mask.shape[1] // d, d).mean((1, 3))
    density = torch.tensor(mask, dtype=torch.float32, device=args.device)
    router = Router(args)
    r = router.region
    info = dict(vars(args), grid=list(r.shape), cells=int(np.prod(r.shape)), time_step_s=float(r.time_step),
                duration_fs=float(r.time_step * r.steps * 1e15), geometry=router.geometry,
                indices=dict(SiN=N_SIN, SiO2=N_SIO2), wavelengths_nm=router.wavelengths.tolist())
    print(json.dumps({k: info[k] for k in ('grid', 'cells', 'duration_fs', 'geometry')}))

    t0 = time.time()
    if args.mode == 'forward':
        with torch.no_grad():
            resp, fields = router.response(density, keep_fields=True)
        info['forward_seconds'] = time.time() - t0
        info['report'] = {k: str(v) for k, v in fields['Ex']['detector'].report.items()}
        arrays = dict(wavelengths_nm=router.wavelengths, response=resp.cpu().numpy(),
                      transmission=resp.sum(0).cpu().numpy(), density=density.cpu().numpy())
        for component in ('Ex', 'Ey'):
            for name, plane in fields[component].items():
                m, pts = plane_to_map(plane)
                arrays[f'{component}_{name}_E2'] = m
                arrays[f'{name}_points'] = pts
        np.savez(out / 'forward.npz', **arrays)
        print('response (rows R,G2,G1,B):')
        print(np.array2string(resp.cpu().numpy(), precision=4, max_line_width=250))
        print('transmission:', np.array2string(resp.sum(0).cpu().numpy(), precision=4, max_line_width=250))
    elif args.mode == 'grad':
        def adjoint_gradient(point):
            rho = point.clone().requires_grad_(True)
            resp = router.response(rho)
            J = objective(resp, router.wavelengths, BANDS)
            J.backward()
            return float(J.detach()), rho.grad.detach().clone(), resp.detach()

        # 1. gradient at the binary champion mask (compared against TORCWA)
        J0, g0, resp0 = adjoint_gradient(density)
        info['binary'] = dict(objective=J0, grad_norm=float(g0.norm()), seconds=time.time() - t0)
        print(json.dumps(info['binary']), flush=True)
        # 2. central finite differences need an interior point
        interior = 0.1 + 0.8 * density
        J1, g1, resp1 = adjoint_gradient(interior)
        info['interior'] = dict(objective=J1, grad_norm=float(g1.norm()), seconds=time.time() - t0)
        print(json.dumps(info['interior']), flush=True)
        checks = []
        gen = torch.Generator(device='cpu').manual_seed(args.seed)
        for k in range(args.fd_dirs):
            v = torch.randn(interior.shape, generator=gen).to(interior.device)
            v = v / v.norm()
            h = args.fd_eps
            with torch.no_grad():
                jp = float(objective(router.response(interior + h * v), router.wavelengths, BANDS))
                jm = float(objective(router.response(interior - h * v), router.wavelengths, BANDS))
            fd = (jp - jm) / (2 * h)
            ad = float((g1 * v).sum())
            checks.append(dict(direction=k, finite_difference=fd, adjoint=ad,
                               relative_error=abs(fd - ad) / max(abs(fd), 1e-12), seconds=time.time() - t0))
            print(json.dumps(checks[-1]), flush=True)
        info['finite_difference_checks'] = checks
        np.savez(out / 'grad.npz', wavelengths_nm=router.wavelengths,
                 response_binary=resp0.cpu().numpy(), gradient_binary=g0.cpu().numpy(),
                 response_interior=resp1.cpu().numpy(), gradient_interior=g1.cpu().numpy(),
                 density=density.cpu().numpy(), density_interior=interior.cpu().numpy())
    else:
        logits = torch.logit(0.1 + 0.8 * density).clone().requires_grad_(True)
        optimizer = torch.optim.Adam([logits], lr=args.lr)
        history = []
        for step in range(args.opt_steps + 1):
            optimizer.zero_grad(set_to_none=True)
            rho = torch.sigmoid(logits)
            resp = router.response(rho)
            J = objective(resp, router.wavelengths, BANDS)
            history.append(dict(step=step, objective=float(J), seconds=time.time() - t0,
                                response=resp.detach().cpu().numpy().tolist()))
            print(json.dumps({k: history[-1][k] for k in ('step', 'objective', 'seconds')}), flush=True)
            if step == args.opt_steps:
                break
            (-J).backward()
            optimizer.step()
        info['history'] = history
        np.savez(out / 'opt.npz', wavelengths_nm=router.wavelengths,
                 density_final=torch.sigmoid(logits).detach().cpu().numpy(),
                 density_initial=density.cpu().numpy(),
                 objective=np.array([h['objective'] for h in history]),
                 response=np.array([h['response'] for h in history]))
    (out / f'{args.mode}.json').write_text(json.dumps(info, indent=2, default=str), encoding='utf-8')
    print('done', time.time() - t0, 's')


if __name__ == '__main__':
    main()
