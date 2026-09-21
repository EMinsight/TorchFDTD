"""Long-run field-energy stability of small fixtures after the source has ended.

Run python -m benchmarks.stability_sweep [--rows id ...] [--skip-cuda] [--quick]
and python -m benchmarks.stability_sweep --render to rewrite docs/STABILITY_SWEEP.md
from the record.

Every row runs 20,000 steps (docs/validation/cases/STABILITY_SWEEP.json declares the
fixtures and the limits) and samples every 250 steps the run-control state norm, the
volume-weighted epsilon|E|^2 + |H|^2 on the cells outside the PML, the peak field and
whether run_control's divergence check fired. The resident paths are observed through
run_control.DecayDecision.update, which every dispatch calls with the same numbers it
judges, so a sample is recorded even for the check that raises; the reversible,
streamed and tensor-media rows drive their own step loops and measure the state
directly.
"""
from __future__ import annotations

import argparse
import datetime
import hashlib
import json
import math
import platform
import subprocess
import sys
import time
import traceback
from pathlib import Path

import numpy as np
import torch

from torchfdtd import (Project, Region, Structure, Source, Monitor, Material, LorentzPole, Simulation,
                       Boundaries, BoundaryFace, RunControl)
from torchfdtd.materials import pml_cell_mask
from torchfdtd.run_control import DecayDecision, StateDiagnostics, source_end_time

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT/'docs'/'validation'/'cases'/'STABILITY_SWEEP.json'
RECORD = ROOT/'docs'/'validation'/'stability_sweep_3060.json'
DOCUMENT = ROOT/'docs'/'STABILITY_SWEEP.md'
C0 = 299792458.
LAMBDA = 1.55
STEPS = 20000
SAMPLE = 250
PULSE = dict(pulse='gaussian', time_definition='standard', wavelength=LAMBDA, pulse_length=2.5827060278369606e-14,
             pulse_offset=75e-15, eliminate_discontinuities=True)
LORENTZ_POLES = ((1.9e15, .5*1.9e15**2, 2e14), (7.5e14, .3*7.5e14**2, 1e14))
MATERIALS = dict(
    n35=Material(name='n35', index=3.5),
    drude_dielectric=Material(name='drude_dielectric', model='drude', epsilon_inf=4., plasma_rad_s=1e15, collision_rad_s=1e14),
    lorentz_two_pole=Material(name='lorentz_two_pole', model='multipole', epsilon_inf=2.25,
                              poles=[LorentzPole(resonance_rad_s=w0, strength_rad_s_squared=s, damping_rad_s=g) for w0, s, g in LORENTZ_POLES]),
    drude_metal=Material(name='drude_metal', model='drude', epsilon_inf=1., plasma_rad_s=2e15, collision_rad_s=1e14))
TENSORS = dict(tensor_admitted=(4., 2., 2.), tensor_rejected=(2., 3., 4.))
# Single-pole Lorentz silicon nitride of the documented divergence (docs/BOUNDARIES.md): n = 2.05 at 550 nm,
# negative permittivity between 1.4e16 and 2.8e16 rad/s, inside the band of a 20 nm grid.
SIN = Material(name='sin_lorentz', model='lorentz', epsilon_inf=1., resonance_rad_s=1.4e16, linewidth_rad_s=1e13, delta_epsilon=3.)
VISIBLE_PULSE = dict(pulse='gaussian', time_definition='standard', wavelength=.55, pulse_length=9.164e-15, pulse_offset=27e-15,
                     eliminate_discontinuities=True)


# ----------------------------------------------------------------------------------------------- fixtures
def region(dimension, *, steps=STEPS, precision='float64', backend='cpu', faces=None, pml_cells=None, size=None,
           mesh=None, **extra):
    two = dimension == '2d'
    size = size or ((6., 4., 1.) if two else (3.2, 3.2, 3.2))
    boundaries = Boundaries(**{k: v for k, v in (faces or {}).items()})
    return Region(dimension=dimension, size=size, mesh=mesh or (.05 if two else .1), steps=steps, precision=precision,
                  backend=backend, pml_cells=pml_cells or (10 if two else 6), material_sampling='yee',
                  snapshot_interval=10000, boundaries=boundaries,
                  run_control=RunControl(check_interval=SAMPLE), **extra)


def point_source(dimension, **overrides):
    center = (-1., .3, 0) if dimension == '2d' else (-.5, .2, .1)
    return Source(kind='point', component='Ez', center=center, **PULSE, **overrides)


def monitor(dimension):
    return Monitor(component='Ez', center=(1., 0, 0) if dimension == '2d' else (.5, 0, 0))


def crossing_slab(material, dimension):
    """Finite along x, filling the lateral (y, and z in 3D) CPML layers to the outer boundary."""
    return Structure(name=f'{material} slab crossing the lateral PML', center=(0, 0, 0), size=(.8, 100., 100.), material=material)


def project(dimension, *, materials=(), structures=(), sources=None, monitors=None, name='', **region_kwargs):
    r = region(dimension, **region_kwargs)
    return Project(name=name or 'stability sweep', region=r,
                   materials=[Material(name='void', index=1), *(MATERIALS[m] for m in materials)],
                   structures=list(structures), sources=sources if sources is not None else [point_source(dimension)],
                   monitors=monitors or [monitor(dimension)])


def periodic_pair(axis, kind='periodic'):
    return {f'{axis}_min': BoundaryFace(kind=kind), f'{axis}_max': BoundaryFace(kind=kind)}


def cpml_faces(dimension, **face):
    active = 'xy' if dimension == '2d' else 'xyz'
    return {f'{a}_{side}': BoundaryFace(**face) for a in active for side in ('min', 'max')}


def bloch_project(dimension):
    two = dimension == '2d'
    size = (6., 2., 1.) if two else (3.2, 3.2, 3.2)
    ly = size[1]
    ky = 2*math.pi/LAMBDA*math.sin(math.radians(30.))
    faces = periodic_pair('y', 'bloch')
    phase = [0., ky*ly, 0.]
    if not two:
        faces.update(periodic_pair('z', 'bloch'))
        phase[2] = ky*size[2]
    sheet = Source(kind='plane', component='Ez', center=(-2. if two else -1., 0, 0), size=(0, ly, 0 if two else size[2]), **PULSE)
    slab = Structure(name='lorentz slab', center=(0, 0, 0), size=(.8, 100., 100.), material='lorentz_two_pole')
    return project(dimension, materials=('lorentz_two_pole',), structures=[slab], sources=[sheet], size=size,
                   faces=faces, bloch_phase=tuple(phase), name='Bloch 30 deg with a two-pole Lorentz slab')


def pec_project_2d():
    faces = {**periodic_pair('x', 'pec')}
    block = Structure(name='n35 block on the x_min PEC wall', center=(-2.6, 0, 0), size=(.8, 2., 2.), material='n35')
    return project('2d', materials=('n35',), structures=[block], sources=[Source(kind='point', component='Ez', center=(0, .3, 0), **PULSE)],
                   faces=faces, name='PEC x faces, n=3.5 block touching the wall')


def pmc_project_3d(closed):
    faces = {'x_min': BoundaryFace(kind='pmc'), 'x_max': BoundaryFace(kind='pmc'),
             'y_min': BoundaryFace(kind='pec'), 'y_max': BoundaryFace(kind='pec')}
    if closed:
        faces.update(z_min=BoundaryFace(kind='pec'), z_max=BoundaryFace(kind='pec'))
    else:
        faces.update(z_min=BoundaryFace(alpha=0.), z_max=BoundaryFace(alpha=0.))
    block = Structure(name='n35 block on the x_min PMC and y_min PEC walls', center=(-1.2, -1.2, 0), size=(.8, .8, 1.), material='n35')
    source = Source(kind='point', component='Ez', center=(.2, .3, .1), **PULSE)
    return project('3d', materials=('n35',), structures=[block], sources=[source], faces=faces, precision='float32',
                   name='PMC x faces, PEC y faces, '+('PEC z faces (closed cavity)' if closed else 'CPML z faces'))


def graded_project(dimension):
    two = dimension == '2d'
    block = Structure(name='n35 block', center=(.5, 0, 0), size=(1., 1., 2.) if two else (.8, .8, .8), material='n35')
    return project(dimension, materials=('n35',), structures=[block], mesh_type='graded', mesh_max=.15 if two else .2,
                   courant_factor=.99, name='graded mesh at courant_factor 0.99 with an n=3.5 block')


def subpixel_project(dimension):
    two = dimension == '2d'
    shape = Structure(name='n35 '+('circle' if two else 'sphere'), kind='circle' if two else 'sphere', center=(.5, 0, 0), radius=.6 if two else .5, material='n35')
    return project(dimension, materials=('n35',), structures=[shape], interface_method='subpixel', name='subpixel n=3.5 / n=1 interface')


def sheet_project(dimension):
    two = dimension == '2d'
    sheet = Source(kind='plane', component='Ez', center=(-1.5 if two else -.8, 0, 0), size=(0, 2., 0) if two else (0, 1.6, 1.6), **PULSE)
    return project(dimension, sources=[sheet], name='soft sheet source')


def oneway_project(dimension):
    two = dimension == '2d'
    size = (6., 4., 1.) if two else (3.2, 3.2, 3.2)
    faces = periodic_pair('y')
    if not two:
        faces.update(periodic_pair('z'))
    plane = Source(kind='plane', injection='oneway', normal='x', direction='+', component='Ez',
                   center=(-1.5 if two else -.8, 0, 0), size=(0, size[1], 0 if two else size[2]), **PULSE)
    return project(dimension, sources=[plane], faces=faces, size=size, name='one-way plane, periodic transverse faces')


def tfsf_project(dimension):
    two = dimension == '2d'
    box = Source(kind='tfsf', normal='x', direction='+', component='Ez', center=(0, 0, 0),
                 size=(3., 2.4, 1.) if two else (1.6, 1.6, 1.6), **PULSE)
    return project(dimension, sources=[box], name='closed TFSF box in vacuum')


def reversible_project(material):
    faces = {**periodic_pair('x'), **periodic_pair('y'), **periodic_pair('z')}
    structures = [Structure(name='n35 block', center=(.5, 0, 0), size=(.8, .8, .8), material='n35')] if material else []
    return project('3d', materials=('n35',) if material else (), structures=structures, faces=faces, precision='float32',
                   name='all-periodic reversible forward'+(' with an n=3.5 block' if material else ''))


def sin_posts_project(mode, *, precision='float64', backend='cpu', cuda_kernel='torch'):
    """The documented case: a 20 nm grid, 12-layer CPML, SiN posts whose array runs through the lateral (y) PML."""
    r = Region(dimension='2d', size=(3., 4., 1.), mesh=.02, steps=STEPS, precision=precision, backend=backend, cuda_kernel=cuda_kernel,
               pml_cells=12, material_sampling='yee', snapshot_interval=10000, pml_dispersion=mode,
               run_control=RunControl(check_interval=SAMPLE))
    posts = [Structure(name=f'post {k}', center=(0, -1.95+.3*k, 0), size=(.6, .1, 2.), material='sin_lorentz') for k in range(14)]
    sheet = Source(kind='plane', component='Ez', center=(-1., 0, 0), size=(0, 3.4, 0), **VISIBLE_PULSE)
    return Project(name=f'SiN post array through the lateral PML, {mode}', region=r, materials=[Material(name='void', index=1), SIN],
                   structures=posts, sources=[sheet], monitors=[Monitor(component='Ez', center=(1., 0, 0))])


def tensor_project():
    return project('3d', precision='float32', structures=[], name='node-tensor slab crossing the lateral PML')


ROWS = []


def row(id, group, description, build, *, dimension, path='simulation', execution='cpu float64', closed=False,
        expect='stable', energy='epsilon-weighted', **extra):
    ROWS.append(dict(id=id, group=group, description=description, build=build, dimension=dimension, path=path,
                     execution=execution, closed=closed, expect=expect, energy_definition=energy, **extra))


def declare_rows():
    for d in ('2d', '3d'):
        row(f'vacuum-{d}', 'vacuum', 'vacuum, default CPML profile, point source', lambda d=d: project(d, name='vacuum'), dimension=d)
        row(f'slab-n35-{d}', 'dielectric', 'n=3.5 slab crossing the lateral PML',
            lambda d=d: project(d, materials=('n35',), structures=[crossing_slab('n35', d)], name='n=3.5 slab crossing the lateral PML'), dimension=d)
        for material, label in (('drude_dielectric', 'Drude (Re eps 3.3)'), ('lorentz_two_pole', 'two-pole Lorentz')):
            for mode in ('ade', 'frozen'):
                row(f'{material.split("_")[0]}-slab-{mode}-{d}', 'dispersive in PML', f'{label} slab crossing the lateral PML, pml_dispersion={mode}',
                    lambda d=d, m=material, mode=mode: project(d, materials=(m,), structures=[crossing_slab(m, d)], pml_dispersion=mode,
                                                              name=f'{m} slab crossing the lateral PML, {mode}'), dimension=d)
        row(f'metal-slab-ade-{d}', 'dispersive in PML', 'Drude metal (Re eps -1.7) slab crossing the lateral PML, pml_dispersion=ade',
            lambda d=d: project(d, materials=('drude_metal',), structures=[crossing_slab('drude_metal', d)], name='Drude metal slab crossing the lateral PML, ade'), dimension=d)
        row(f'bloch-lorentz-{d}', 'Bloch', 'Bloch faces at 30 deg with a two-pole Lorentz slab spanning the unit cell', lambda d=d: bloch_project(d), dimension=d)
        row(f'graded-{d}', 'mesh', 'graded mesh at the maximum admitted Courant factor with an n=3.5 block', lambda d=d: graded_project(d), dimension=d)
        row(f'subpixel-{d}', 'mesh', 'subpixel n=3.5 / n=1 interface', lambda d=d: subpixel_project(d), dimension=d)
        for kappa in (1, 4):
            for alpha in (0., .2):
                row(f'cpml-k{kappa}-a{alpha:g}-{d}', 'CPML profile', f'vacuum, CPML kappa {kappa}, alpha {alpha:g}'+(' (alpha_polynomial 1)' if alpha else ''),
                    lambda d=d, k=kappa, a=alpha: project(d, faces=cpml_faces(d, kappa=k, alpha=a, alpha_polynomial=1 if a else 0), name=f'CPML kappa {k} alpha {a}'),
                    dimension=d)
        row(f'src-sheet-{d}', 'sources', 'soft sheet source', lambda d=d: sheet_project(d), dimension=d)
        row(f'src-oneway-{d}', 'sources', 'one-way plane with periodic transverse faces', lambda d=d: oneway_project(d), dimension=d)
        row(f'src-tfsf-{d}', 'sources', 'closed TFSF box in vacuum (leakage energy bounded)', lambda d=d: tfsf_project(d), dimension=d)
    for mode in ('ade', 'frozen'):
        row(f'sin-posts-{mode}-2d', 'dispersive in PML', f'SiN single-pole Lorentz post array through the lateral PML on a 20 nm grid (documented divergence fixture), pml_dispersion={mode}',
            lambda mode=mode: sin_posts_project(mode), dimension='2d')
        row(f'sin-posts-{mode}-2d-cuda', 'dispersive in PML', f'SiN post array through the lateral PML, 20 nm grid, pml_dispersion={mode} (CUDA float32, fused kernel)',
            lambda mode=mode: sin_posts_project(mode, precision='float32', backend='cuda', cuda_kernel='fused'), dimension='2d', cuda=True, execution='cuda float32 fused')
    row('pec-2d', 'PEC/PMC', 'PEC x faces with an n=3.5 block touching the wall, CPML y faces', pec_project_2d, dimension='2d')
    row('pmc-pec-cpml-3d', 'PEC/PMC', 'PMC x faces, PEC y faces, CPML z faces, n=3.5 block touching both walls (exact-endpoint dispatch, FP32)',
        lambda: pmc_project_3d(False), dimension='3d', execution='cpu float32 endpoint')
    row('pmc-pec-cavity-3d', 'PEC/PMC', 'closed PMC/PEC cavity with an n=3.5 block touching the walls (exact-endpoint dispatch, FP32)',
        lambda: pmc_project_3d(True), dimension='3d', execution='cpu float32 endpoint', closed=True)
    row('tensor-admitted-3d', 'tensor in CPML', 'diag(4,2,2) slab crossing the y and z CPML (admitted)', lambda: ('tensor_admitted', tensor_project()),
        dimension='3d', path='tensor', execution='cpu float32 tensor', energy='unweighted |E|^2+|H|^2')
    row('tensor-rejected-3d', 'tensor in CPML', 'diag(2,3,4) slab crossing the y and z CPML (rejected by the BFJ admission)', lambda: ('tensor_rejected', tensor_project()),
        dimension='3d', path='tensor', execution='cpu float32 tensor', expect='rejected', energy='unweighted |E|^2+|H|^2')
    row('reversible-vacuum-3d', 'paths', "reversible adjoint's forward pass, vacuum, all-periodic", lambda: reversible_project(False),
        dimension='3d', path='reversible', execution='cpu float32', closed=True)
    row('reversible-n35-3d', 'paths', "reversible adjoint's forward pass, n=3.5 block, all-periodic", lambda: reversible_project(True),
        dimension='3d', path='reversible', execution='cpu float32', closed=True)
    row('streamed-vacuum-2d', 'paths', 'streamed forward on host banks, vacuum', lambda: project('2d', name='vacuum'), dimension='2d',
        path='streamed', execution='cpu float64 streamed')
    row('streamed-n35-2d', 'paths', 'streamed forward on host banks, n=3.5 slab crossing the lateral PML',
        lambda: project('2d', materials=('n35',), structures=[crossing_slab('n35', '2d')], name='n=3.5 slab'), dimension='2d',
        path='streamed', execution='cpu float64 streamed')
    for material, label in (('', 'vacuum'), ('n35', 'n=3.5 slab crossing the lateral PML')):
        row(f'tensorbatch-{material or "vacuum"}-2d', 'paths', f'run_tensor_batch forward, {label}',
            lambda m=material: project('2d', materials=(m,) if m else (), structures=[crossing_slab(m, '2d')] if m else [], precision='float32', backend='cuda', name=label),
            dimension='2d', path='tensor_batch', execution='cuda float32 fused batch', cuda=True)
    for base in ('vacuum', 'slab-n35', 'drude-slab-ade', 'drude-slab-frozen', 'lorentz-slab-ade', 'lorentz-slab-frozen', 'metal-slab-ade'):
        source = next(r for r in ROWS if r['id'] == f'{base}-2d')
        row(f'{base}-2d-cuda', source['group'], source['description']+' (CUDA float32, fused kernel)',
            lambda b=source['build']: b().model_copy(update=dict(region=b().region.model_copy(update=dict(precision='float32', backend='cuda', cuda_kernel='fused')))),
            dimension='2d', cuda=True, execution='cuda float32 fused')


declare_rows()


# ----------------------------------------------------------------------------------------------- energies
def interior_weight(grid):
    """StateDiagnostics volume weight with every PML cell zeroed."""
    r = grid.region
    mask = ~pml_cell_mask(r, r.shape)
    return grid._coefficient(mask.astype(np.float64))


def interior_from_diagnostics(diag):
    g = diag.grid
    weight = diag.real64(diag.volume)*diag.real64(interior_weight(g))
    energy = 0.
    for j in range(3):
        energy = energy+diag.square_sum(g.E[..., j], weight/diag.real64(g.inverse_permittivity[..., j]))
        energy = energy+diag.square_sum(g.H[..., j], weight)
    return float(energy)


def state_energies(e, h, extra, eps, mask):
    """(state norm, interior epsilon|E|^2+|H|^2) of a manual step loop; eps broadcasts over the last axis."""
    e64, h64 = e.to(torch.complex128 if e.is_complex() else torch.float64), h.to(torch.complex128 if h.is_complex() else torch.float64)
    norm = float(e64.abs().square().sum()+h64.abs().square().sum()+sum(v.to(torch.float64).abs().square().sum() for v in extra))
    weight = torch.as_tensor(mask, dtype=torch.float64)[..., None]
    interior = float((e64.abs().square()*eps.to(torch.float64)*weight).sum()+(h64.abs().square()*weight).sum())
    peak = max(float(e.abs().max()), float(h.abs().max()))
    return norm, interior, peak


class Capture:
    """Record every run-control sample of the resident paths, including the one that raises."""
    def __enter__(self):
        self.samples, self.pending = [], None
        capture = self
        original_update, original_measure = DecayDecision.update, StateDiagnostics.measure

        def update(decision, step, energy, field_peak):
            capture.samples.append(dict(step=int(step), state_norm=float(energy), field_peak=float(field_peak), interior_energy=capture.pending))
            capture.pending = None
            return original_update(decision, step, energy, field_peak)

        def measure(diag):
            values = original_measure(diag)
            capture.pending = interior_from_diagnostics(diag)
            return values
        self.restore = (original_update, original_measure)
        DecayDecision.update, StateDiagnostics.measure = update, measure
        return self

    def __exit__(self, *exc):
        DecayDecision.update, StateDiagnostics.measure = self.restore
        return False


# ----------------------------------------------------------------------------------------------- runners
def run_simulation(p):
    with Capture() as capture:
        try:
            result = Simulation(p).run()
            return capture.samples, dict(termination=result.summary['termination_reason'], engine=result.summary.get('engine'),
                                         backend=result.summary.get('backend'), cuda_graph=result.summary.get('cuda_graph')), None
        except FloatingPointError as exc:
            return capture.samples, dict(termination='raised'), f'{type(exc).__name__}: {exc}'


def run_tensor_batch_row(p):
    from torchfdtd import run_tensor_batch
    with Capture() as capture:
        try:
            report = run_tensor_batch([p], device=0, keep_results=False)
            item = report.items[0]
            return capture.samples, dict(termination=item.summary['termination_reason'], engine=item.summary.get('engine'), status=item.status), None
        except FloatingPointError as exc:
            return capture.samples, dict(termination='raised'), f'{type(exc).__name__}: {exc}'


def manual_loop(system, steps, eps, mask, advance, extra_state):
    samples = []
    for step in range(steps):
        advance(step)
        if (step+1) % SAMPLE == 0 or step+1 == steps:
            e, h, *rest = system.state()
            norm, interior, peak = state_energies(e, h, extra_state(rest), eps, mask)
            samples.append(dict(step=step+1, state_norm=norm, field_peak=peak, interior_energy=interior))
            if not math.isfinite(norm) or not math.isfinite(peak):
                return samples, 'FloatingPointError: non-finite state at step %d' % (step+1)
    return samples, None


def run_reversible(p):
    from torchfdtd.reversible import ReversibleSimulation
    from torchfdtd.differentiable import _System
    from torchfdtd.plan import resolve_plan
    model = ReversibleSimulation(p)
    project_ = model._snapshot()
    eps = torch.as_tensor(np.ascontiguousarray(resolve_plan(project_).material.epsilon), dtype=torch.float32)
    if eps.ndim == 4:
        eps = eps[..., 0].contiguous()
    system = _System(project_, eps, prepare_kernels=False)
    mask = ~pml_cell_mask(project_.region, project_.region.shape)
    samples, error = manual_loop(system, project_.region.steps, eps[..., None], mask, lambda step: system.advance(step, step+1), lambda rest: rest)
    return samples, dict(termination='raised' if error else 'max_steps', engine='reversible _System advance loop (CPU torch)', backend='cpu'), error


def run_streamed(p):
    from torchfdtd import StreamedSimulation, StreamedAdjointOptions
    from torchfdtd.differentiable import _System
    from torchfdtd.spacetime import SlabBlockOperator
    from torchfdtd.plan import resolve_plan
    options = StreamedAdjointOptions(device='cpu', slab_width=40, temporal_depth=10)
    model = StreamedSimulation(p, options)
    r = model.project.region
    eps = torch.as_tensor(np.ascontiguousarray(resolve_plan(model.project).material.epsilon), dtype=torch.float64)
    host = _System(model.project, eps, prepare_updates=False)
    operator = SlabBlockOperator(host, options.slab_width, 'cpu')
    state = operator.new_state()
    mask = ~pml_cell_mask(r, r.shape)
    samples, error = [], None
    eps4 = eps if eps.ndim == 4 else eps[..., None]
    for start in range(0, r.steps, options.temporal_depth):
        depth = min(options.temporal_depth, r.steps-start)
        state, _ = operator.forward(eps, state, start, depth)
        done = start+depth
        if done % SAMPLE == 0 or done == r.steps:
            e, h, *rest = state
            norm, interior, peak = state_energies(e, h, rest, eps4, mask)
            samples.append(dict(step=done, state_norm=norm, field_peak=peak, interior_energy=interior))
            if not math.isfinite(norm) or not math.isfinite(peak):
                error = 'FloatingPointError: non-finite state at step %d' % done
                break
    return samples, dict(termination='raised' if error else 'max_steps', engine='streamed SlabBlockOperator block loop (CPU host banks)',
                         backend='cpu', slab_width=options.slab_width, temporal_depth=options.temporal_depth), error


def run_tensor(tensor_name, p):
    from torchfdtd.anisotropy import TensorDielectricSimulation, _TensorSystem
    values = TENSORS[tensor_name]
    r = p.region
    model = TensorDielectricSimulation(p, cpml_material='tensor')
    epsilon = torch.eye(3, dtype=torch.float32).expand(r.shape+(3, 3)).clone()
    axes = [torch.as_tensor(np.array(v[:-1]), dtype=torch.float32) for v in r.mesh_nodes]
    inside = (axes[0].abs() <= .4)[:, None, None].expand(r.shape)
    epsilon[inside] = torch.diag(torch.tensor(values, dtype=torch.float32))
    model._validate_input_shape(epsilon)
    try:
        with torch.no_grad():
            model._validate_epsilon(epsilon)
    except ValueError as exc:
        return [], dict(termination='rejected', engine='TensorDielectricSimulation admission'), f'ValueError: {exc}'
    with torch.no_grad():
        system = _TensorSystem(p.model_copy(deep=True), epsilon, None, fixed_collar=False)
        mask = ~pml_cell_mask(r, r.shape)
        ones = torch.ones(r.shape+(1,), dtype=torch.float32)
        samples, error = manual_loop(system, r.steps, ones, mask, lambda step: system.advance(step, step+1), lambda rest: rest)
    return samples, dict(termination='raised' if error else 'max_steps', engine='_TensorSystem advance loop (CPU torch, D-field CPML)', backend='cpu',
                         tensor=list(values)), error


def judge(samples, source_end_s, dt, closed, limits):
    steps = np.array([s['step'] for s in samples])
    after = steps*dt >= source_end_s
    if not after.any():
        return dict(judged=False, reason='no post-source sample')
    post = np.flatnonzero(after)
    window = post[:max(1, len(post)//4)]
    later = post[len(window):]
    out = dict(judged=True, post_source_samples=int(len(post)), reference_samples=int(len(window)), later_samples=int(len(later)))
    for name in ('state_norm', 'interior_energy'):
        values = np.array([s[name] if s[name] is not None else np.nan for s in samples], dtype=float)
        if np.isnan(values[post]).all():
            out[name] = None
            continue
        overall = float(np.nanmax(values))
        peak = float(max(np.nanmax(values[window]), 1e-12*overall))
        growth = float(np.nanmax(values[later])/peak) if len(later) else 1.
        last = float(values[-1]/peak)
        # Trend over the judged samples themselves: last sample over the first sample after the reference
        # window. Reported, not judged; it shows a round-off floor that creeps while the ratios above stay small.
        trend = float(values[-1]/values[later[0]]) if len(later) and values[later[0]] > 0 else None
        limit = limits['last_over_peak_max_closed'] if closed else limits['last_over_peak_max_open']
        out[name] = dict(post_source_peak=peak, growth_ratio=growth, last_over_peak=last, last=float(values[-1]),
                         late_trend=trend, floor_over_peak=float(values[-1]/overall) if overall else None,
                         growth_pass=bool(growth <= limits['growth_ratio_max']), decay_pass=bool(last <= limit), last_limit=limit)
    return out


def execute(spec, quick):
    started = time.perf_counter()
    built = spec['build']()
    tensor_name = None
    if isinstance(built, tuple):
        tensor_name, p = built
    else:
        p = built
    if quick:
        p = p.model_copy(update=dict(region=p.region.model_copy(update=dict(steps=quick))))
    r = p.region
    torch.set_num_threads(4)
    error = None
    try:
        if spec['path'] == 'simulation':
            samples, info, error = run_simulation(p)
        elif spec['path'] == 'tensor_batch':
            samples, info, error = run_tensor_batch_row(p)
        elif spec['path'] == 'reversible':
            samples, info, error = run_reversible(p)
        elif spec['path'] == 'streamed':
            samples, info, error = run_streamed(p)
        elif spec['path'] == 'tensor':
            samples, info, error = run_tensor(tensor_name, p)
        else:
            raise ValueError(spec['path'])
    except Exception as exc:   # an admission or contract error is a recorded outcome, not a crash of the sweep
        samples, info, error = [], dict(termination='error'), f'{type(exc).__name__}: {exc}'
        traceback.print_exc()
    if torch.cuda.is_available():
        torch.cuda.synchronize()
    dt = r.time_step
    source_end = source_end_time(p)
    diverged = error is not None and ('FloatingPointError' in error or 'nonfinite' in error.lower())
    out = dict(id=spec['id'], group=spec['group'], description=spec['description'], dimension=spec['dimension'], path=spec['path'],
               execution=spec['execution'], closed=spec['closed'], expect=spec['expect'], energy_definition=spec['energy_definition'],
               project_name=p.name, shape=list(r.shape), cells=int(math.prod(r.shape)), steps_requested=int(r.steps),
               steps_completed=int(samples[-1]['step']) if samples else 0, dt_s=dt, duration_fs=r.steps*dt*1e15,
               source_end_fs=source_end*1e15 if math.isfinite(source_end) else None, pml_dispersion=r.pml_dispersion,
               boundaries={k: v['kind'] for k, v in r.boundaries.model_dump().items()}, precision=r.precision,
               sample_interval=SAMPLE, samples=samples, info=info, error=error, divergence_check_fired=bool(diverged),
               seconds=time.perf_counter()-started)
    return out


def verdict(out, limits):
    if out['expect'] == 'rejected':
        rejected = out['error'] is not None and 'geometric PML stability criterion' in out['error']
        out['rejected_as_declared'] = bool(rejected)
        out['passed'] = bool(rejected)
        out['judgement'] = dict(judged=False, reason='rejected row: admission message checked')
        return out
    judgement = judge(out['samples'], out['source_end_fs']*1e-15 if out['source_end_fs'] is not None else math.inf, out['dt_s'],
                      out['closed'], limits) if out['samples'] else dict(judged=False, reason='no samples')
    out['judgement'] = judgement
    checks = [not out['divergence_check_fired'], out['error'] is None, judgement.get('judged', False)]
    for name in ('state_norm', 'interior_energy'):
        j = judgement.get(name)
        if j:
            checks += [j['growth_pass'], j['decay_pass']]
    out['passed'] = bool(all(checks))
    return out


# ----------------------------------------------------------------------------------------------- record and document
def environment():
    cuda = torch.cuda.is_available()
    def git(*args):
        try:
            return subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
        except (OSError, subprocess.CalledProcessError):
            return None
    return dict(python=sys.version.split()[0], numpy=np.__version__, torch=torch.__version__, cuda_runtime=torch.version.cuda,
                cuda_available=cuda, gpu=torch.cuda.get_device_name(0) if cuda else None, os=platform.platform(), machine=platform.machine(),
                commit=git('rev-parse', 'HEAD'), dirty_paths=len((git('status', '--porcelain') or '').splitlines()),
                recorded_at=datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat())


def source_hashes():
    names = ('benchmarks/stability_sweep.py', 'torchfdtd/run_control.py', 'torchfdtd/materials.py', 'torchfdtd/boundaries.py',
             'torchfdtd/solver.py', 'torchfdtd/differentiable.py', 'torchfdtd/spacetime.py', 'torchfdtd/anisotropy.py',
             'torchfdtd/tensor_batch.py', 'torchfdtd/endpoint_native.py')
    return {name: hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in names}


def fmt(value, digits=3):
    if value is None:
        return 'n/a'
    if isinstance(value, bool):
        return 'yes' if value else 'no'
    if isinstance(value, (int, np.integer)):
        return str(int(value))
    if not math.isfinite(value):
        return str(value)
    return f'{value:.{digits}g}'


def render(record):
    limits = record['acceptance']
    lines = ['# Stability sweep', '',
             f"Record: `docs/validation/{Path(record['record_path']).name}` (case `docs/validation/cases/STABILITY_SWEEP.json`, "
             f"declared at commit {record['case']['declared_at_commit']}). Driver `benchmarks/stability_sweep.py`. "
             'Every number below is copied from the record; nothing here is typed by hand.', '',
             f"Environment: Python {record['environment']['python']}, torch {record['environment']['torch']} (CUDA {record['environment']['cuda_runtime']}), "
             f"GPU {record['environment']['gpu']}, {record['environment']['os']}; run at {record['environment']['recorded_at']} on commit "
             f"{record['environment']['commit']} with {record['environment']['dirty_paths']} dirty paths; wall time {fmt(record['wall_seconds'], 4)} s.", '',
             '## What is measured', '',
             f"Each row runs {record['spec']['steps']} steps and samples every {record['spec']['sample_interval']} steps: the run-control state norm "
             '(the quantity the production divergence check judges: volume-weighted epsilon|E|^2 + |H|^2 over the whole grid plus the ADE oscillator energy), '
             'the volume-weighted epsilon|E|^2 + |H|^2 on the cells outside every PML layer, the peak field and whether the divergence check fired. '
             'The post-source peak is the maximum over the first quarter of the samples after `source_end_time`; growth is the maximum later sample over that '
             f"peak (limit {limits['growth_ratio_max']}); last/peak is the final sample over that peak (limit {limits['last_over_peak_max_open']} for rows with an absorbing face, "
             f"{limits['last_over_peak_max_closed']} for closed lossless cavities). A row passes only if both energies satisfy both limits and no check fired.", '',
             f"Summary: {record['passed_rows']} of {record['rows_run']} rows pass; {record['failed_rows']} fail; {record['rejected_rows']} rejected as declared."
             + (f" Failing rows: {', '.join(record['failing_ids'])}." if record['failing_ids'] else ''), '',
             '## Matrix', '',
             '| row | group | dim | execution | cells | steps | source end (fs) | state norm growth | state norm last/peak | interior growth | interior last/peak | last / overall peak | late trend | peak field (last) | check fired | s | verdict |',
             '| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |']
    for out in record['rows']:
        j = out.get('judgement') or {}
        sn, ie = j.get('state_norm'), j.get('interior_energy')
        last_peak = out['samples'][-1]['field_peak'] if out['samples'] else None
        if out['expect'] == 'rejected':
            verdict_text = 'rejected as declared' if out['passed'] else 'NOT rejected'
        else:
            verdict_text = 'pass' if out['passed'] else 'FAIL'
        lines.append(f"| {out['id']} | {out['group']} | {out['dimension']} | {out['execution']} | {out['cells']} | {out['steps_completed']} | {fmt(out['source_end_fs'], 4)} | "
                     f"{fmt(sn and sn['growth_ratio'], 4)} | {fmt(sn and sn['last_over_peak'], 3)} | {fmt(ie and ie['growth_ratio'], 4)} | {fmt(ie and ie['last_over_peak'], 3)} | "
                     f"{fmt(sn and sn.get('floor_over_peak'), 2)} | {fmt(sn and sn.get('late_trend'), 3)} | "
                     f"{fmt(last_peak, 3)} | {fmt(out['divergence_check_fired'])} | {fmt(out['seconds'], 3)} | {verdict_text} |")
    lines += ['', '## Late trend of the settled rows', '',
              'Rows whose state norm at the last sample exceeds its value at the first judged sample by more than 10 percent, with the level '
              'they sit at relative to the overall peak and the peak field at the first judged and the last sample. A level of 1e-12 or below '
              'of the overall peak is the float round-off floor of the fields (1e-6 in amplitude); a creep at that level with a constant peak field '
              'is accumulated round-off, not a growing mode; a closed lossless cavity (all faces periodic, PEC or PMC) keeps its energy and its state '
              'norm oscillates with the staggered E/H sampling. The growth and last/peak criteria above are what is judged.', '',
              '| row | execution | state norm last / first judged | level: last / overall peak | peak field at first judged | peak field at last |',
              '| --- | --- | ---: | ---: | ---: | ---: |']
    for out in record['rows']:
        j = out.get('judgement') or {}
        sn = j.get('state_norm')
        if not sn or sn.get('late_trend') is None or sn['late_trend'] <= 1.1:
            continue
        before = len([1 for s in out['samples'] if s['step']*out['dt_s'] < (out['source_end_fs'] or 0)*1e-15])
        first = min(before+j['reference_samples'], len(out['samples'])-1)
        lines.append(f"| {out['id']} | {out['execution']} | {fmt(sn['late_trend'], 3)} | {fmt(sn['floor_over_peak'], 2)} | "
                     f"{fmt(out['samples'][first]['field_peak'], 3)} | {fmt(out['samples'][-1]['field_peak'], 3)} |")
    lines += ['', '## Rows with an error, a fired check or a rejection', '']
    noted = [out for out in record['rows'] if out['error'] or out['divergence_check_fired']]
    if not noted:
        lines.append('None.')
    for out in noted:
        lines.append(f"- `{out['id']}`: {out['error']} (termination `{out['info'].get('termination')}`, samples {len(out['samples'])}, last step {out['steps_completed']}).")
    lines += ['', '## Findings', '']
    for finding in record['findings']:
        lines.append(f'- {finding}')
    if not record['findings']:
        lines.append('None.')
    lines += ['', '## Limits of this sweep', '']
    for item in record['limitations']:
        lines.append(f'- {item}')
    return '\n'.join(lines)+'\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', default=str(RECORD))
    parser.add_argument('--rows', nargs='*', help='row ids to run (default: every row)')
    parser.add_argument('--skip-cuda', action='store_true')
    parser.add_argument('--quick', type=int, default=0, help='shakedown: run this many steps instead of 20000 and do not write the record')
    parser.add_argument('--render', action='store_true', help='rewrite docs/STABILITY_SWEEP.md from the existing record and exit')
    parser.add_argument('--list', action='store_true')
    parser.add_argument('--merge', action='store_true', help='replace the selected rows inside the existing record instead of rewriting it')
    parser.add_argument('--rejudge', action='store_true', help='recompute every verdict of the existing record from its samples and rerender')
    args = parser.parse_args()
    if args.list:
        for spec in ROWS:
            print(spec['id'], spec['path'], spec['execution'])
        return
    if args.render:
        record = json.loads(Path(args.output).read_text(encoding='utf-8'))
        DOCUMENT.write_text(render(record), encoding='utf-8', newline='\n')
        print(DOCUMENT)
        return
    case = json.loads(CASE.read_text(encoding='utf-8'))
    limits = case['acceptance']
    if args.rejudge:
        # Recompute every verdict from the recorded samples with the case limits; no simulation is rerun.
        record = json.loads(Path(args.output).read_text(encoding='utf-8'))
        record['rows'] = [verdict({k: v for k, v in row.items() if k not in ('judgement', 'passed', 'rejected_as_declared')}, limits) for row in record['rows']]
        record['failing_ids'] = [o['id'] for o in record['rows'] if not o['passed']]
        record.update(passed_rows=sum(o['passed'] for o in record['rows']), failed_rows=len(record['failing_ids']), acceptance=limits)
        Path(args.output).write_text(json.dumps(record, indent=2)+'\n', encoding='utf-8', newline='\n')
        DOCUMENT.write_text(render(record), encoding='utf-8', newline='\n')
        print(json.dumps(dict(rejudged=len(record['rows']), failing=record['failing_ids'])))
        return
    selected = [s for s in ROWS if (not args.rows or s['id'] in args.rows) and not (args.skip_cuda and s.get('cuda'))]
    if args.rows:
        missing = set(args.rows)-{s['id'] for s in ROWS}
        if missing:
            raise SystemExit(f'unknown rows: {sorted(missing)}')
    started = time.perf_counter()
    rows = []
    for spec in selected:
        out = verdict(execute(spec, args.quick), limits)
        j = out.get('judgement') or {}
        sn = j.get('state_norm') or {}
        ie = j.get('interior_energy') or {}
        print(json.dumps(dict(id=out['id'], passed=out['passed'], growth=sn.get('growth_ratio'), last_over_peak=sn.get('last_over_peak'),
                              interior_growth=ie.get('growth_ratio'), interior_last_over_peak=ie.get('last_over_peak'),
                              fired=out['divergence_check_fired'], error=out['error'], reason=j.get('reason'),
                              source_end_fs=out['source_end_fs'], seconds=round(out['seconds'], 1))), flush=True)
        rows.append(out)
    previous = json.loads(Path(args.output).read_text(encoding='utf-8')) if args.merge and Path(args.output).is_file() and not args.quick else None
    if previous is not None:
        done = {o['id']: o for o in rows}
        rows = [done.pop(o['id'], o) for o in previous['rows']]+list(done.values())
        order = {spec['id']: i for i, spec in enumerate(ROWS)}
        rows.sort(key=lambda o: order.get(o['id'], len(order)))
    failing = [o['id'] for o in rows if not o['passed']]
    record = dict(schema='torchfdtd.stability_sweep.v1', case=dict(path=str(CASE.relative_to(ROOT)).replace('\\', '/'), declared_at_commit=case['declared_at_commit']),
                  record_path=str(Path(args.output)).replace('\\', '/'), acceptance=limits,
                  spec=dict(steps=STEPS if not args.quick else args.quick, sample_interval=SAMPLE, pulse=PULSE, lambda_um=LAMBDA,
                            materials={k: v.model_dump(mode='json') for k, v in MATERIALS.items()}, tensors=TENSORS),
                  environment=environment(), source_sha256=source_hashes(), quick=bool(args.quick),
                  rows_run=len(rows), passed_rows=sum(o['passed'] for o in rows), failed_rows=len(failing),
                  rejected_rows=sum(o['expect'] == 'rejected' and o['passed'] for o in rows), failing_ids=failing,
                  findings=[], limitations=[
                      'Bounded fixtures (120 x 80, 120 x 40 and 32^3 cells) and 20,000 steps: empirical non-growth on these grids, not a spectral proof',
                      'The 3D dispersive rows use 0.1 um cells (4.4 cells per material wavelength in n=3.5); they test stability, not accuracy',
                      'The state norm samples E, H and the ADE state at staggered times; last/peak of a closed cavity therefore carries the staggering and round-off, not a conserved discrete energy',
                      'CUDA rows run the fused kernel on the shared RTX 3060 in float32; other precisions and the RTX 5880 of the documented divergence are not covered here'],
                  rows=rows, wall_seconds=time.perf_counter()-started+(previous['wall_seconds'] if previous is not None else 0.))
    if args.quick:
        print(json.dumps(dict(quick=True, rows=len(rows), failing=failing)))
        return
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(record, indent=2)+'\n', encoding='utf-8', newline='\n')
    temporary.replace(path)
    DOCUMENT.write_text(render(record), encoding='utf-8', newline='\n')
    print(json.dumps(dict(rows=len(rows), failing=failing, wall_seconds=record['wall_seconds'])), flush=True)


if __name__ == '__main__':
    main()
