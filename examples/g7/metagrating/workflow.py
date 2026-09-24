"""G7-01: the metagrating application workflow of docs/G7_WORKFLOWS.md.

A density of 100 pixels (0.02 um) across the 2.0 um period of the metagrating fixture
(examples/meep_comparison/metagrating/geometry.json: grid, absorbers, pulse and DFT lines) is
extruded through the 0.5 um silicon layer on SiO2 and designed with DesignProblem from three
seeds for the mean +1 transmitted order efficiency at 1.50, 1.55 and 1.60 um (TE, E along the
ridges, normal incidence from the substrate). Every seed's design is binarized, checked for the
declared linewidth and gap, evaluated at 0.02 and 0.01 um for TE and TM at normal incidence and
at a fixed Bloch wavevector over 41 wavelengths, and checked against TORCWA 0.1.4.2
(rcwa_check.py, run in the interpreter that holds TORCWA). The case file
docs/validation/cases/G7-01.json supplies the declared quantities and criteria.

    python -m examples.g7.metagrating.workflow --out docs/validation/g7/G7-01
    python -m examples.g7.metagrating.workflow --small --out <dir>      (CPU-sized development run)

The full run needs CUDA; on the shared workstation it runs under D:/TorchFDTD/.local/gpu_lock.py.
"""
from __future__ import annotations

import argparse
from dataclasses import asdict, dataclass, replace
import hashlib
import json
import math
import os
from pathlib import Path
import platform
import subprocess
import time

import numpy as np
import torch

from torchfdtd import (AdjointOptions, Boundaries, BoundaryFace, DifferentiablePlaneSimulation, FieldMonitor, Project, Region,
                       Source, SpectrumSettings)
from torchfdtd.density_layer import _overlap
from torchfdtd.design_parameterization import DensityParameterization
from torchfdtd.design_problem import Continuation, DesignProblem
from torchfdtd.solver import field_axes

C0 = 299792458.0
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
CASE_PATH = ROOT/'docs'/'validation'/'cases'/'G7-01.json'
GEOMETRY_PATH = ROOT/'examples'/'meep_comparison'/'metagrating'/'geometry.json'
RCWA_SCRIPT = HERE/'rcwa_check.py'
ORDERS = (-1, 0, 1)
ALL_ORDERS = tuple(range(-3, 4))           # every order that can propagate in the band, for the energy balance
DESIGN_WAVELENGTHS_UM = (1.50, 1.55, 1.60)
ANGLE_DEG = 10.
ANGLE_WAVELENGTH_UM = 1.55
POLARIZATIONS = ('TE', 'TM')
INCIDENCES = ('normal', 'bloch')
TWO_RIDGE_PIXELS = (range(2, 6), range(29, 40))   # the fixture's ridges as pixels (Ez columns 2-5 and 29-39)


@dataclass(frozen=True)
class Settings:
    """Sizes of one run. The defaults are the declared workflow; small_run() is a CPU development size."""
    design_mesh_um: float = .02
    fine_mesh_um: float = .01
    time_fraction: float = 1.            # fraction of the fixture's physical time (12,000 steps at 0.02 um)
    iterations_per_beta: int = 20
    betas: tuple = (8., 16., 32., 64.)
    band_points: int = 41
    seeds: tuple = (1, 2, 3)
    backend: str = 'cuda'
    checkpoints: int = 32
    # TORCWA applies the Laurent rule to TM too, whose error falls as 1/N: on the fixture's two ridges the
    # largest change at 1.55 um was 0.0043 from 80 to 160 and 0.0014 from 160 to 240 harmonics (TE 6e-5 from 40 to 80).
    rcwa_harmonics: tuple = (40, 80, 160, 240, 320)
    rcwa_tolerance: float = 2e-3
    rcwa_device: str = 'cuda'
    small: bool = False

    @classmethod
    def small_run(cls):
        return cls(design_mesh_um=.04, fine_mesh_um=.02, time_fraction=.25, iterations_per_beta=1, band_points=5, seeds=(1,),
                   backend='cpu', checkpoints=4, rcwa_harmonics=(10, 20), rcwa_tolerance=1., rcwa_device='cpu', small=True)

    @property
    def iterations(self):
        return self.iterations_per_beta*len(self.betas)


def load_json(path):
    raw = Path(path).read_bytes()
    return json.loads(raw.decode('utf-8')), hashlib.sha256(raw).hexdigest()


def declared():
    """The case file and the fixture geometry, with the shared quantities checked against each other."""
    case, case_sha = load_json(CASE_PATH)
    g, geometry_sha = load_json(GEOMETRY_PATH)
    f = case['fixture']
    bottom, top = f['design_layer_um']
    checks = dict(period=math.isclose(f['period_um'], g['period_um']), substrate=math.isclose(f['substrate_index'], g['substrate_index']),
                  ridge=math.isclose(f['ridge_index'], g['ridge_index']), layer_bottom=math.isclose(bottom, g['substrate_top_y_um']),
                  layer_height=math.isclose(top-bottom, g['ridge_height_um']), pixels=math.isclose(f['pixels']*f['pixel_um'], g['period_um']),
                  mesh=math.isclose(f['pixel_um'], g['mesh_um']), band=(f['evaluation']['wavelengths_um'] == [g['spectrum']['wavelength_start_um'],
                  g['spectrum']['wavelength_stop_um'], g['spectrum']['points']]))
    if not all(checks.values()):
        raise ValueError(f'the case file and geometry.json disagree: {checks}')
    return case, g, dict(case_sha256=case_sha, geometry_sha256=geometry_sha)


def pixel_count(g):
    """100 pixels of the fixture mesh (0.02 um) across the period."""
    return int(round(g['period_um']/g['mesh_um']))


def bloch_kx(g):
    """The declared fixed Bloch wavevector (per um): 10 degrees in the substrate at 1.55 um."""
    return 2*math.pi*g['substrate_index']*math.sin(math.radians(ANGLE_DEG))/ANGLE_WAVELENGTH_UM


def band_wavelengths(g, settings):
    s = g['spectrum']
    return np.linspace(s['wavelength_start_um'], s['wavelength_stop_um'], settings.band_points)


def build_project(g, mesh_um, polarization, incidence, settings, *, monitors=('reflection', 'transmission'), kappa=1.):
    """The fixture scene without structures: the permittivity is supplied explicitly by layer_epsilon.

    A finer mesh keeps the physical cell, absorber thickness and duration of the fixture.
    TE drives Ez (E along the ridges), TM drives Hz (H along the ridges); the Bloch incidence sets
    the declared k_x on both periodic faces, and the plane source carries its phase exp(i k_x x).
    kappa > 1 grades the CPML stretching of both y absorbers (diagnosis only; the fixture uses 1).
    """
    scale = g['mesh_um']/mesh_um
    lx, ly = g['cell_size_um']
    kind = 'bloch' if incidence == 'bloch' else 'periodic'
    phase = bloch_kx(g)*g['period_um'] if incidence == 'bloch' else 0.
    cuda = settings.backend == 'cuda'
    region = Region(dimension='2d', size=(lx, ly, 1), mesh=mesh_um, steps=int(round(g['steps']*scale*settings.time_fraction)),
                    pml_cells=int(round(g['pml_cells']*scale)), courant_factor=.99, backend=settings.backend, precision='float32',
                    material_sampling='yee', cuda_kernel='fused' if cuda else 'torch', cuda_monitor_kernel='fused' if cuda else 'torch',
                    boundaries=Boundaries(x_min=BoundaryFace(kind=kind), x_max=BoundaryFace(kind=kind), y_min=BoundaryFace(kappa=kappa),
                                          y_max=BoundaryFace(kappa=kappa)), bloch_phase=(phase, 0, 0))
    wave = g['source']['waveform']
    source = Source(id='source', name='source', kind='plane', component='Ez' if polarization == 'TE' else 'Hz', normal='y',
                    center=(0, g['source']['y_um'], 0), size=(lx, 0, 0), wavelength=wave['wavelength_um'],
                    pulse_cycles=wave['pulse_cycles'], amplitude=wave['amplitude'])
    lines = [FieldMonitor(id=name, name=name, normal='y', center=(0, g['monitors'][name+'_y_um'], 0), size=(lx, 0, 1),
                          spectrum=SpectrumSettings(sampling='frequency', apodization='none')) for name in monitors]
    return Project(name=f'g7-01-{polarization}-{incidence}-{mesh_um:g}um', region=region, sources=[source], monitors=lines)


def layer_epsilon(density, region, g):
    """Yee-component permittivity (Nx, Ny, 1, 3) of the substrate, the extruded density layer and air.

    Pixel k is centred on the Ez node x = -L/2 + k p, so its edges lie midway between the Ez nodes
    of the 0.02 um grid, as the fixture's ridges do. Every component receives the arithmetic mean
    of eps = 1 + (n_Si^2 - 1) rho (layer), n_sub^2 (below the layer) or 1 (above) over a cell-sized
    box centred at its own Yee position, the rule of periodic_density_layer: on the 0.02 um grid the
    Ez boxes coincide with the pixels and the layer rows, so a binary density is an exact staircase,
    and on the 0.01 um grid a component on an interface receives the mean of both sides.
    """
    rho = density.reshape(-1)
    period, n_sub2, n_si2 = g['period_um'], g['substrate_index']**2, g['ridge_index']**2
    bottom = g['substrate_top_y_um']
    top = bottom+g['ridge_height_um']
    dx, dy = region.axis_steps[:2]
    fields = []
    for component in ('Ex', 'Ey', 'Ez'):
        x, y, _ = field_axes(region, component)
        row = _overlap(np.asarray(x), dx, rho.numel(), period, rho, 'sample_centers')@rho
        lo, hi = np.asarray(y)-dy/2, np.asarray(y)+dy/2
        substrate = np.clip(np.minimum(hi, bottom)-lo, 0, dy)/dy
        layer = np.clip(np.minimum(hi, top)-np.maximum(lo, bottom), 0, dy)/dy
        background = torch.as_tensor(substrate*n_sub2+(1-substrate), dtype=rho.dtype, device=rho.device)
        fields.append(background[None, :]+(n_si2-1)*row[:, None]*torch.as_tensor(layer, dtype=rho.dtype, device=rho.device)[None, :])
    return torch.stack(fields, -1)[:, :, None, :]


def order_wavevectors(wavelength_um, index, kx0, period_um, orders, device=None):
    """k_0 (F, 1), k_x (M,), k_y (F, M) in 1/um and the propagating mask of every order in a medium of `index`."""
    k0 = (2*math.pi/torch.as_tensor(np.asarray(wavelength_um), dtype=torch.float64, device=device))[:, None]
    kx = kx0+2*math.pi*torch.as_tensor(orders, dtype=torch.float64, device=device)/period_um
    ky2 = (index*k0)**2-kx[None, :]**2
    propagating = ky2 > 0
    return k0, kx, torch.sqrt(torch.where(propagating, ky2, torch.ones_like(ky2))), propagating


def order_branches(plane, wavelength_um, index, kx0, period_um, polarization, orders):
    """Forward and backward complex amplitudes of the diffraction orders on one DFT line.

    Order m has k_x = k_x0 + 2 pi m / L; its amplitude is the weighted Fourier mean of the line
    fields times exp(-i k_x x). The plane spectra use exp(+2 pi i f t) (exp(-i omega t) phasors), so a
    +y wave is exp(+i k_y y). TE: e = Ez, h = Hx, a +y wave has Hx = (k_y/k_0) Ez, e+- = (e +- (k_0/k_y) h)/2,
    branch power 0.5 (k_y/k_0) |e+-|^2 (the compare.py decomposition of the fixture). TM: h = Hz, e = Ex,
    a +y wave has Ex = -(k_y/(k_0 n^2)) Hz, h+- = (h -+ (k_0 n^2/k_y) e)/2, branch power
    0.5 (k_y/(k_0 n^2)) |h+-|^2. Returns (plus, minus, factor, ky) in complex128/float64 with branch
    power 0.5 factor |amplitude|^2 and factor 0 for an evanescent order.
    """
    fields, x, w = plane.fields.to(torch.complex128), plane.points_um[:, 0].to(torch.float64), plane.weights.to(torch.float64)
    k0, kx, ky, propagating = order_wavevectors(wavelength_um, index, kx0, period_um, orders, x.device)
    phase = torch.exp(-1j*kx[:, None]*x[None, :])*(w/w.sum())[None, :]
    if polarization == 'TE':
        ae, ah = fields[..., 2]@phase.T, fields[..., 3]@phase.T
        ratio = k0/ky
        plus, minus, factor = (ae+ratio*ah)/2, (ae-ratio*ah)/2, ky/k0
    else:
        ah, ae = fields[..., 5]@phase.T, fields[..., 0]@phase.T
        ratio = index**2*k0/ky
        plus, minus, factor = (ah-ratio*ae)/2, (ah+ratio*ae)/2, ky/(k0*index**2)
    return plus, minus, torch.where(propagating, factor, torch.zeros_like(factor)), ky


def incident(reference, wavelength_um, g, kx0, polarization):
    """Incident amplitude and branch-power factor: order 0, forward, reflection line of the bare-substrate run."""
    plus, _, factor, _ = order_branches(reference['reflection'], wavelength_um, g['substrate_index'], kx0, g['period_um'], polarization, (0,))
    return plus[:, 0], factor[:, 0]


def transmitted_efficiency(plane, incident_amplitude, incident_factor, wavelength_um, g, kx0, polarization, orders):
    plus, _, factor, _ = order_branches(plane, wavelength_um, 1., kx0, g['period_um'], polarization, orders)
    return factor*plus.abs()**2/(incident_factor*incident_amplitude.abs()**2)[:, None]


def fresnel_reflectance(g, wavelength_um, kx0, polarization):
    """Power reflectance of the bare substrate-air interface for the incident order."""
    n1, n2 = g['substrate_index'], 1.
    k0 = 2*np.pi/np.asarray(wavelength_um)
    c1 = np.sqrt(1-(kx0/(n1*k0))**2)
    c2 = np.sqrt(1-(kx0/(n2*k0))**2+0j)
    r = (n1*c1-n2*c2)/(n1*c1+n2*c2) if polarization == 'TE' else (n2*c1-n1*c2)/(n2*c1+n1*c2)
    return abs(r)**2


def order_table(sample, reference, wavelength_um, g, kx0, polarization):
    """Efficiencies of every order in ALL_ORDERS, complex amplitudes of ORDERS and the energy balance.

    Efficiencies are branch powers over the incident power of the bare-substrate reference. An
    amplitude a satisfies |a|^2 = efficiency (TE: E field, TM: H field); its phase is referenced to
    x = 0, to the incident wave at the substrate top (y = 0.01 um), to the layer top (y = 0.51 um)
    for transmitted and to the substrate top for reflected orders, with exp(-i omega t) phasors.
    """
    n_sub, period = g['substrate_index'], g['period_um']
    bottom = g['substrate_top_y_um']
    top = bottom+g['ridge_height_um']
    y_r, y_t = g['monitors']['reflection_y_um'], g['monitors']['transmission_y_um']
    ref_plus, _, ref_factor, ref_ky = order_branches(reference['reflection'], wavelength_um, n_sub, kx0, period, polarization, (0,))
    a_inc, f_inc = ref_plus[:, 0], ref_factor[:, 0]
    p_inc = f_inc*a_inc.abs()**2
    t_plus, _, t_factor, t_ky = order_branches(sample['transmission'], wavelength_um, 1., kx0, period, polarization, ALL_ORDERS)
    _, r_minus, r_factor, r_ky = order_branches(sample['reflection'], wavelength_um, n_sub, kx0, period, polarization, ALL_ORDERS)
    T = (t_factor*t_plus.abs()**2/p_inc[:, None]).cpu().numpy()
    R = (r_factor*r_minus.abs()**2/p_inc[:, None]).cpu().numpy()
    a_bottom = a_inc*torch.exp(1j*ref_ky[:, 0]*(bottom-y_r))
    t = (torch.sqrt(t_factor/f_inc[:, None])*t_plus*torch.exp(1j*t_ky*(top-y_t))/a_bottom[:, None]).cpu().numpy()
    r = (torch.sqrt(r_factor/f_inc[:, None])*r_minus*torch.exp(-1j*r_ky*(bottom-y_r))/a_bottom[:, None]).cpu().numpy()
    total = T.sum(axis=1)+R.sum(axis=1)
    declared_total = sum(T[:, ALL_ORDERS.index(m)]+R[:, ALL_ORDERS.index(m)] for m in ORDERS)

    def amplitudes(values):
        return {str(m): dict(re=values[:, ALL_ORDERS.index(m)].real.tolist(), im=values[:, ALL_ORDERS.index(m)].imag.tolist()) for m in ORDERS}
    return dict(T={str(m): T[:, k].tolist() for k, m in enumerate(ALL_ORDERS)}, R={str(m): R[:, k].tolist() for k, m in enumerate(ALL_ORDERS)},
                amplitudes=dict(t=amplitudes(t), r=amplitudes(r)), energy_sum=total.tolist(), declared_order_sum=declared_total.tolist(),
                max_abs_energy_residual=float(np.max(abs(1-total))),
                propagating_orders=dict(T=[m for k, m in enumerate(ALL_ORDERS) if bool((t_factor[:, k] > 0).any())],
                                        R=[m for k, m in enumerate(ALL_ORDERS) if bool((r_factor[:, k] > 0).any())]))


def reference_diagnostics(reference, wavelength_um, g, kx0, polarization):
    """Bare-substrate checks: order-0 T and R against Fresnel, power in any other order."""
    n_sub, period = g['substrate_index'], g['period_um']
    plus, minus, factor, _ = order_branches(reference['reflection'], wavelength_um, n_sub, kx0, period, polarization, ALL_ORDERS)
    t_plus, _, t_factor, _ = order_branches(reference['transmission'], wavelength_um, 1., kx0, period, polarization, ALL_ORDERS)
    i0 = ALL_ORDERS.index(0)
    p_inc = factor[:, i0]*plus[:, i0].abs()**2
    T0 = (t_factor[:, i0]*t_plus[:, i0].abs()**2/p_inc).cpu().numpy()
    R0 = (factor[:, i0]*minus[:, i0].abs()**2/p_inc).cpu().numpy()
    fresnel = fresnel_reflectance(g, wavelength_um, kx0, polarization)
    others = [k for k in range(len(ALL_ORDERS)) if k != i0]
    stray = ((factor*(plus.abs()**2+minus.abs()**2)+t_factor*t_plus.abs()**2)[:, others]/p_inc[:, None]).cpu().numpy()
    return dict(T0=T0.tolist(), R0=R0.tolist(), fresnel_R0=fresnel.tolist(), max_abs_T0_minus_fresnel=float(np.max(abs(T0-(1-fresnel)))),
                max_abs_R0_minus_fresnel=float(np.max(abs(R0-fresnel))), max_other_order_power_over_incident=float(stray.max()))


class CaseEvaluator:
    """One evaluated case (mesh, polarization, incidence): its bare-substrate reference once, then any design."""
    def __init__(self, g, settings, mesh_um, polarization, incidence, *, kappa=1.):
        self.g, self.mesh_um, self.polarization, self.incidence = g, mesh_um, polarization, incidence
        self.kx0 = bloch_kx(g) if incidence == 'bloch' else 0.
        self.device = torch.device(settings.backend)
        self.wavelength = band_wavelengths(g, settings)
        self.frequency = C0/(self.wavelength*1e-6)
        self.project = build_project(g, mesh_um, polarization, incidence, settings, kappa=kappa)
        self.model = DifferentiablePlaneSimulation(self.project, AdjointOptions(checkpoints=0))
        started = _clock(self.device)
        self.reference = self.planes(np.zeros(pixel_count(g)))
        self.reference_seconds = _clock(self.device)-started
        self.diagnostics = reference_diagnostics(self.reference, self.wavelength, g, self.kx0, polarization)

    @torch.no_grad()
    def planes(self, density):
        epsilon = layer_epsilon(torch.as_tensor(np.asarray(density), dtype=torch.float32, device=self.device), self.project.region, self.g)
        return self.model(epsilon, self.frequency)

    def evaluate(self, density):
        started = _clock(self.device)
        table = order_table(self.planes(density), self.reference, self.wavelength, self.g, self.kx0, self.polarization)
        return dict(self.describe(), wall_seconds=_clock(self.device)-started, **table)

    def describe(self):
        r = self.project.region
        return dict(mesh_um=self.mesh_um, polarization=self.polarization, incidence=self.incidence, kx_per_um=self.kx0,
                    bloch_phase_rad=r.bloch_phase[0], cells=list(r.shape[:2]), steps=r.steps, dt_s=r.time_step,
                    pml_cells=r.pml_cells, source_component=self.project.sources[0].component, wavelength_um=self.wavelength.tolist())


def _clock(device):
    if device.type == 'cuda':
        torch.cuda.synchronize(device)
    return time.perf_counter()


class TransmissionObjective:
    """DesignProblem objective: minus the mean T+1 (TE, normal incidence) at the design wavelengths.

    The transmission line of the design-mesh scene is a differentiable plane; the incident power
    comes once from the reflection line of the bare-substrate run of the same scene.
    """
    def __init__(self, g, settings):
        self.g = g
        self.device = torch.device(settings.backend)
        self.wavelength = np.asarray(DESIGN_WAVELENGTHS_UM)
        self.frequency = C0/(self.wavelength*1e-6)
        project = build_project(g, settings.design_mesh_um, 'TE', 'normal', settings, monitors=('transmission',))
        self.region = project.region
        self.model = DifferentiablePlaneSimulation(project, AdjointOptions(checkpoints=settings.checkpoints))
        reference = DifferentiablePlaneSimulation(build_project(g, settings.design_mesh_um, 'TE', 'normal', settings, monitors=('reflection',)),
                                                  AdjointOptions(checkpoints=0))
        with torch.no_grad():
            planes = reference(layer_epsilon(torch.zeros(pixel_count(g), device=self.device), self.region, g), self.frequency)
        self.incident = incident(planes, self.wavelength, g, 0., 'TE')

    def efficiencies(self, density):
        epsilon = layer_epsilon(density.to(self.device), self.region, self.g)
        plane = self.model(epsilon, self.frequency)['transmission']
        return transmitted_efficiency(plane, *self.incident, self.wavelength, self.g, 0., 'TE', ORDERS)

    def __call__(self, density):
        T = self.efficiencies(density)
        plus = T[:, ORDERS.index(1)]
        metrics = {f'T+1 {w:.2f} um': plus[i] for i, w in enumerate(self.wavelength)}
        metrics.update({f'T{m:+d} mean': T[:, k].mean() for k, m in enumerate(ORDERS)})
        return -plus.mean(), metrics


def design_seed(seed, objective, settings, case, *, checkpoint=None):
    """One declared start: 0.5 randn logits, conic filter, tanh projection continuation, Adam; binarized at 0.5."""
    f = case['fixture']
    pixels, pixel_um = f['pixels'], f['pixel_um']
    started = time.perf_counter()
    generator = torch.Generator().manual_seed(seed)
    initial = .5*torch.randn((pixels, 1), generator=generator)
    design = DensityParameterization((pixels, 1), spacing_um=(pixel_um, f['design_layer_um'][1]-f['design_layer_um'][0]), initial=initial,
                                     mode='logits', filter_radius_um=f['filter_radius_um'], boundary='periodic', beta=settings.betas[0], eta=.5)
    optimizer = torch.optim.Adam(design.parameters(), lr=f['learning_rate'])
    problem = DesignProblem(design, objective, optimizer, name=f'g7-01-seed{seed}',
                            continuation=Continuation(every=settings.iterations_per_beta, factor=2., maximum=settings.betas[-1]))
    history = problem.run(settings.iterations, checkpoint=checkpoint, resume=checkpoint is not None)
    fab = f['fabrication']
    fabrication = problem.fabrication(spacing_um=pixel_um, min_linewidth_um=fab['min_linewidth_um'], min_gap_um=fab['min_gap_um'],
                                      perturbation_um=pixel_um, boundary=(fab['boundary'], 'extend'))
    binary = problem.density(hard=True)
    loss, metrics = problem.evaluate(binary)
    return dict(seed=seed, iterations=problem.iteration, history=history, initial_logits=initial[:, 0].tolist(),
                final_logits=design.design.detach()[:, 0].tolist(), smooth_density=problem.density()[:, 0].tolist(),
                binary=binary[:, 0].int().tolist(), design_mesh_binary=dict(objective=loss, metrics=metrics), fabrication=fabrication,
                design_wall_seconds=time.perf_counter()-started, iteration_seconds=sum(h['elapsed_s'] for h in history))


def two_ridge_density(g):
    rho = np.zeros(pixel_count(g))
    for ridge in TWO_RIDGE_PIXELS:
        rho[list(ridge)] = 1
    return rho


def fixture_reproduction(evaluator, g):
    """The fixture's two-ridge metagrating through this workflow's forward, against its committed native-solver record."""
    path = ROOT/'docs'/'validation'/'meep_comparison'/'metagrating_comparison.json'
    committed, _ = load_json(path)
    recorded = committed['efficiencies']['torchfdtd']
    e = evaluator.evaluate(two_ridge_density(g))
    difference = max(float(np.max(abs(np.asarray(e[kind][str(m)])-np.asarray(recorded[kind][str(m)])))) for kind in ('T', 'R') for m in ORDERS)
    return dict(record=path.relative_to(ROOT).as_posix(), band_mean_T_plus1=float(np.mean(e['T']['1'])),
                recorded_band_mean_T_plus1=float(np.mean(recorded['T']['1'])), max_abs_order_efficiency_difference=difference)


def rcwa_job(g, settings, designs):
    """Every design, polarization and incidence over the band, with the harmonic sweep at the design wavelengths."""
    kx = bloch_kx(g)
    return dict(period_um=g['period_um'], substrate_index=g['substrate_index'], ridge_index=g['ridge_index'],
                thickness_um=g['ridge_height_um'], samples_per_pixel=200, orders=list(ALL_ORDERS), harmonics=list(settings.rcwa_harmonics),
                tolerance=settings.rcwa_tolerance, device=settings.rcwa_device, designs=designs,
                cases=[dict(design=name, polarization=p, incidence=i, kx_per_um=kx if i == 'bloch' else 0.,
                            wavelengths_um=band_wavelengths(g, settings).tolist(), convergence_wavelengths_um=list(DESIGN_WAVELENGTHS_UM))
                       for name in designs for p in POLARIZATIONS for i in INCIDENCES])


def run_rcwa(job, python, directory):
    job_path, out = Path(directory)/'rcwa-job.json', Path(directory)/'rcwa-result.json'
    job_path.write_text(json.dumps(job), encoding='utf-8')
    subprocess.run([python, str(RCWA_SCRIPT), '--job', str(job_path), '--out', str(out)], check=True)
    return json.loads(out.read_text(encoding='utf-8'))


def find(record, mesh_um, polarization, incidence):
    matches = [e for e in record['evaluations']
               if math.isclose(e['mesh_um'], mesh_um) and e['polarization'] == polarization and e['incidence'] == incidence]
    if len(matches) != 1:
        raise ValueError(f"seed {record['seed']}: {len(matches)} evaluations of {mesh_um} um {polarization} {incidence}")
    return matches[0]


def worst_difference(evaluation, reference):
    """Largest |TorchFDTD - TORCWA| over every order efficiency (T and R) and wavelength, with its location."""
    worst = (-1., None, None)
    for kind in ('T', 'R'):
        for m in ALL_ORDERS:
            diff = abs(np.asarray(evaluation[kind][str(m)])-np.asarray(reference[kind][str(m)]))
            i = int(np.argmax(diff))
            if diff[i] > worst[0]:
                worst = (float(diff[i]), evaluation['wavelength_um'][i], f'{kind}{m:+d}')
    return dict(value=worst[0], at_wavelength_um=worst[1], at_order=worst[2])


def declared_seeds(case):
    """The seeds named by the case file ('logits 0.5 * randn with seeds 1, 2, 3')."""
    return [int(s) for s in case['seed'].split('seeds', 1)[1].replace('and', ',').split(',') if s.strip()]


def judge(records, case, settings):
    """Every acceptance criterion of the case file, from the seed records alone."""
    f = case['fixture']
    design, fine = settings.design_mesh_um, settings.fine_mesh_um
    for key in ('rcwa_agreement', 'mesh', 'energy_balance'):
        if '0.02' not in case['acceptance'][key]:
            raise ValueError(f'the case file no longer states the 0.02 limit of {key}')
    limit = .02
    expected = {(m, p, i) for m in (design, fine) for p in POLARIZATIONS for i in INCIDENCES}
    complete = {r['seed']: dict(history=len(r['history']) == settings.iterations, design=len(r['binary']) == f['pixels'],
                                evaluations={(e['mesh_um'], e['polarization'], e['incidence']) for e in r['evaluations']} == expected
                                and all(len(e['wavelength_um']) == settings.band_points for e in r['evaluations']),
                                rcwa={(c['polarization'], c['incidence']) for c in r.get('rcwa') or []}
                                == {(p, i) for p in POLARIZATIONS for i in INCIDENCES})
                for r in records}
    criteria = dict(all_seeds=dict(value=sorted(complete), declared=declared_seeds(case), complete=complete,
                                   passed=sorted(complete) == declared_seeds(case) and all(all(v.values()) for v in complete.values())))

    scores = {r['seed']: float(np.mean(find(r, design, 'TE', 'normal')['T']['1'])) for r in records}
    best = max(scores, key=scores.get)
    baseline = case['baseline']['band_mean_T_plus1']
    criteria['performance'] = dict(value=scores[best], limit_min=baseline, best_seed=best, per_seed=scores,
                                   statistic='band-mean T+1, TE, normal incidence, binary design, design mesh', passed=scores[best] >= baseline)

    judged, other = [], []
    for r in records:
        for c in r.get('rcwa') or []:
            for mesh in (design, fine):
                row = dict(seed=r['seed'], polarization=c['polarization'], incidence=c['incidence'], mesh_um=mesh, rcwa_harmonics=c['harmonics'],
                           rcwa_converged=c['converged'], **worst_difference(find(r, mesh, c['polarization'], c['incidence']), c))
                (judged if mesh == (design if c['polarization'] == 'TE' else fine) else other).append(row)
    worst = max(judged, key=lambda row: row['value']) if judged else None
    criteria['rcwa_agreement'] = dict(
        value=None if worst is None else worst['value'], limit_max=limit, worst=worst, judged=judged, not_judged=other,
        rcwa_converged=bool(judged) and all(row['rcwa_converged'] for row in judged),
        statistic='max |eta_TorchFDTD - eta_TORCWA| over every propagating order (T and R) and wavelength; TE at the design mesh, TM at 0.01 um',
        passed=len(judged) == len(records)*len(POLARIZATIONS)*len(INCIDENCES) and worst is not None and worst['value'] <= limit)

    mesh_change = {}
    for r in records:
        coarse, refined = find(r, design, 'TE', 'normal'), find(r, fine, 'TE', 'normal')
        diff = abs(np.asarray(refined['T']['1'])-np.asarray(coarse['T']['1']))
        mesh_change[r['seed']] = dict(value=float(diff.max()), at_wavelength_um=coarse['wavelength_um'][int(np.argmax(diff))])
    value = max(v['value'] for v in mesh_change.values())
    criteria['mesh'] = dict(value=value, limit_max=limit, per_seed=mesh_change, passed=value <= limit,
                            statistic='max over wavelengths of |T+1(0.01 um) - T+1(design mesh)|, TE, normal incidence, every seed')

    energy = [dict(seed=r['seed'], mesh_um=e['mesh_um'], polarization=e['polarization'], incidence=e['incidence'], value=e['max_abs_energy_residual'],
                   at_wavelength_um=e['wavelength_um'][int(np.argmax(abs(1-np.asarray(e['energy_sum']))))],
                   declared_orders_only=float(np.max(abs(1-np.asarray(e['declared_order_sum'])))), propagating_orders=e['propagating_orders'])
              for r in records for e in r['evaluations']]
    worst = max(energy, key=lambda row: row['value'])
    criteria['energy_balance'] = dict(value=worst['value'], limit_max=limit, worst=worst, cases=energy, passed=worst['value'] <= limit,
                                      statistic='max |1 - sum R - sum T| over every propagating order and wavelength of every evaluated case')

    violations = {r['seed']: r['fabrication']['violations'] for r in records}
    criteria['fabrication'] = dict(value=violations[best], best_seed=best, per_seed=violations, passed=not violations[best],
                                   feature_sizes={r['seed']: r['fabrication']['feature_sizes'] for r in records},
                                   declared=dict(min_linewidth_um=f['fabrication']['min_linewidth_um'], min_gap_um=f['fabrication']['min_gap_um']))
    return criteria


def environment(device):
    def git(*args):
        try:
            return subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True, timeout=60, check=True).stdout.strip()
        except (OSError, subprocess.SubprocessError):
            return None
    import importlib.metadata
    import torchfdtd
    version = getattr(torchfdtd, '__version__', None)
    return dict(platform=platform.platform(), python=platform.python_version(), torch=torch.__version__, torch_cuda=torch.version.cuda,
                numpy=np.__version__, torchfdtd=dict(file=torchfdtd.__file__, version=version or importlib.metadata.version('torchfdtd'),
                                                     version_source='__version__' if version else 'distribution metadata'),
                device=str(device),
                device_name=torch.cuda.get_device_name(device) if device.type == 'cuda' else platform.processor(),
                commit=git('rev-parse', 'HEAD'), tracked_changes=bool(git('status', '--porcelain', '--untracked-files=no')))


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes((json.dumps(value, indent=1, allow_nan=False)+'\n').encode('utf-8'))


def run(settings, out, *, rcwa_python, checkpoint_dir=None, skip_rcwa=False):
    """Design every seed, evaluate every case, run the TORCWA check, judge and write the records."""
    case, g, provenance = declared()
    if not settings.small and tuple(settings.seeds) != tuple(declared_seeds(case)):
        raise ValueError(f'the declared workflow runs seeds {declared_seeds(case)}, all of them')
    f = case['fixture']
    if not settings.small and (settings.betas != tuple(float(b) for b in f['projection_beta'])
                               or settings.iterations_per_beta != f['iterations_per_beta'] or settings.band_points != f['evaluation']['wavelengths_um'][2]
                               or [settings.design_mesh_um, settings.fine_mesh_um] != f['evaluation']['meshes_um']):
        raise ValueError('the full run uses the declared schedule, band and meshes')
    if any(b != settings.betas[0]*2**k for k, b in enumerate(settings.betas)):
        raise ValueError('the beta schedule doubles every iterations_per_beta steps')
    device = torch.device(settings.backend)
    started = time.perf_counter()
    wall = {}
    objective = TransmissionObjective(g, settings)
    records = []
    for seed in settings.seeds:
        checkpoint = None if checkpoint_dir is None else Path(checkpoint_dir)/f'seed{seed}.pt'
        records.append(design_seed(seed, objective, settings, case, checkpoint=checkpoint))
        last = records[-1]
        print(json.dumps(dict(seed=seed, last_objective=last['history'][-1]['objective'], binary=last['design_mesh_binary']['metrics'],
                              violations=last['fabrication']['violations'], seconds=round(last['design_wall_seconds'], 1))), flush=True)
    wall['design'] = time.perf_counter()-started
    del objective

    evaluation_started = time.perf_counter()
    references, fixture = [], None
    for mesh in (settings.design_mesh_um, settings.fine_mesh_um):
        for polarization in POLARIZATIONS:
            for incidence in INCIDENCES:
                evaluator = CaseEvaluator(g, settings, mesh, polarization, incidence)
                references.append(dict(evaluator.describe(), reference_wall_seconds=evaluator.reference_seconds, **evaluator.diagnostics))
                for record in records:
                    record.setdefault('evaluations', []).append(evaluator.evaluate(record['binary']))
                if not settings.small and (mesh, polarization, incidence) == (settings.design_mesh_um, 'TE', 'normal'):
                    fixture = fixture_reproduction(evaluator, g)
                print(json.dumps(dict(mesh_um=mesh, polarization=polarization, incidence=incidence,
                                      band_mean={r['seed']: round(float(np.mean(r['evaluations'][-1]['T']['1'])), 4) for r in records},
                                      energy={r['seed']: round(r['evaluations'][-1]['max_abs_energy_residual'], 4) for r in records})), flush=True)
                del evaluator
    wall['evaluation'] = time.perf_counter()-evaluation_started

    rcwa = None
    if not skip_rcwa:
        import tempfile
        rcwa_started = time.perf_counter()
        with tempfile.TemporaryDirectory(prefix='g7-01-rcwa-') as directory:
            rcwa = run_rcwa(rcwa_job(g, settings, {f"seed{r['seed']}": r['binary'] for r in records}), rcwa_python, directory)
        wall['rcwa'] = time.perf_counter()-rcwa_started
        for record in records:
            record['rcwa'] = [c for c in rcwa['cases'] if c['design'] == f"seed{record['seed']}"]
    wall['total'] = time.perf_counter()-started

    criteria = judge(records, case, settings)
    env = environment(device)
    for record in records:
        record.update(schema='torchfdtd-g7-01-seed-v1', task='G7-01', settings=asdict(settings), provenance=provenance, environment=env)
        write_json(Path(out)/f"seed{record['seed']}.json", record)
    summary = dict(
        schema='torchfdtd-g7-01-summary-v1', task='G7-01', date=time.strftime('%Y-%m-%d'), declaration='docs/G7_WORKFLOWS.md',
        case='docs/validation/cases/G7-01.json', provenance=provenance, settings=asdict(settings), environment=env,
        rcwa=None if rcwa is None else dict(interpreter=rcwa_python, package=rcwa['package'], citation=rcwa['citation'], method=rcwa['method'],
                                            samples_per_pixel=rcwa['samples_per_pixel'], tolerance=rcwa['tolerance'],
                                            harmonic_sequence=rcwa['harmonic_sequence'], seconds=rcwa['seconds']),
        wall_seconds=wall, design_wall_seconds={r['seed']: r['design_wall_seconds'] for r in records},
        seeds={r['seed']: dict(band_mean_T_plus1_TE_normal_design_mesh=criteria['performance']['per_seed'][r['seed']],
                               objective_binary_design_mesh=r['design_mesh_binary']['metrics'], violations=r['fabrication']['violations'],
                               feature_sizes=r['fabrication']['feature_sizes'], binary=r['binary']) for r in records},
        references=references, fixture_reproduction=fixture,
        conventions=dict(
            epsilon='arithmetic mean of the permittivity over a cell-sized box at each Yee component; pixel k centred on the Ez node '
                    'x = -1 + 0.02 k um; a binary density is an exact staircase for Ez on the 0.02 um grid',
            efficiency='order branch power over the forward order-0 power at the reflection line of the bare-substrate run of the same case',
            amplitudes='|a|^2 = efficiency; TE amplitudes of E, TM amplitudes of H; exp(-i omega t); phase referenced to x = 0, to the '
                       'incident wave at y = 0.01 um, to y = 0.51 um for transmitted and y = 0.01 um for reflected orders',
            bloch=f'k_x = 2 pi n_sub sin({ANGLE_DEG:g} deg)/{ANGLE_WAVELENGTH_UM} um on both periodic faces; the incidence angle in the substrate '
                  'is asin(k_x lambda/(2 pi n_sub)) and follows the wavelength',
            energy_balance='sum over every propagating order in ALL_ORDERS (-3..3); at the Bloch wavevector R-2 propagates in the substrate over '
                           'the whole band and T+1 propagates in air below 1.511 um; declared_order_sum keeps orders -1, 0, +1 only',
            finer_mesh='0.01 um keeps the physical cell, the 0.4 um absorbers and the 560 fs duration (24,000 steps)'),
        criteria=criteria, all_passed=all(c['passed'] for c in criteria.values()))
    write_json(Path(out)/'summary.json', summary)
    for name, c in criteria.items():
        print(f"{name}: value {c['value']} {'pass' if c['passed'] else 'FAIL'}", flush=True)
    return summary, records


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--out', type=Path, required=True, help='directory of the seed records and summary.json')
    parser.add_argument('--small', action='store_true', help='CPU development size: coarser meshes, shorter runs, one seed, few iterations')
    parser.add_argument('--seeds', type=int, nargs='+', help='override the seeds (development only; the declared run uses 1 2 3)')
    parser.add_argument('--checkpoint-dir', type=Path, help='save the design state after every iteration and resume from it')
    parser.add_argument('--rcwa-python', default=os.environ.get('TORCHFDTD_RCWA_PYTHON', 'C:/anaconda3/python.exe'),
                        help='interpreter that holds TORCWA 0.1.4.2')
    parser.add_argument('--skip-rcwa', action='store_true', help='development only: no TORCWA check (criterion c then fails)')
    args = parser.parse_args(argv)
    settings = Settings.small_run() if args.small else Settings()
    if args.seeds:
        settings = replace(settings, seeds=tuple(args.seeds))
    return run(settings, args.out, rcwa_python=args.rcwa_python, checkpoint_dir=args.checkpoint_dir, skip_rcwa=args.skip_rcwa)


if __name__ == '__main__':
    main()
