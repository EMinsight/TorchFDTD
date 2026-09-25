"""Acceptance runs of the adiabatic absorber for dispersive media crossing the PML.

Run python -m benchmarks.dispersive_pml_absorber [--rows id ...] [--skip-cuda | --only-cuda] [--merge]
to write docs/validation/dispersive_pml_absorber.json for the pre-declared case
docs/validation/cases/DISPERSIVE_PML_ABSORBER.json, and --rejudge to recompute every
verdict of the record from its own numbers. CUDA rows belong under the shared GPU lock.

Reflection rows follow G3-07: a normal-incidence plane pulse in a 2D x strip, the
reflected/incident power ratio at a monitor 0.5 um before the x_max layer from the
difference against a domain whose x_max layer is 16 um farther away; the half-space
rows fill y from -0.9875 to 0.0125 um of a 2 um periodic cell across the whole x range,
both layers included. Stability rows run a SiN Lorentz or Drude post that fills the
outer five cells of the x_max/y_max CPML corner of a 3D box (the smallest fixture found
to diverge with the CPML) and a 6 um SiN pillar array through the lateral PML, and sample
the run-control state norm and the interior energy every 250 steps.
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

from torchfdtd import (Project, Region, Structure, Source, Monitor, Material, Simulation, RunControl, Boundaries, BoundaryFace)
from torchfdtd.materials import permittivity
from torchfdtd.run_control import source_end_time
from benchmarks.stability_sweep import Capture, judge

ROOT = Path(__file__).resolve().parents[1]
CASE = ROOT/'docs'/'validation'/'cases'/'DISPERSIVE_PML_ABSORBER.json'
RECORD = ROOT/'docs'/'validation'/'dispersive_pml_absorber.json'
DOCUMENT = ROOT/'docs'/'DISPERSIVE_PML_ABSORBER.md'
C0 = 299792458.
SAMPLE = 250
# Absorber depth of the judged reflection rows and of the stability fixtures (docs/validation/cases/DISPERSIVE_PML_ABSORBER.json).
LAYERS = 40
POST_LAYERS = 12
# Criterion of the half-space rows at LAYERS (None: recorded, not judged).
HALF_SPACE = None
# One-cycle Gaussian at 1.55 um (G3-07 normal incidence) and three-cycle Gaussian at 1.45 um (G3-07 oblique).
PULSE = dict(pulse='gaussian', time_definition='standard', wavelength=1.55, pulse_length=8.609020092789869e-15,
             pulse_offset=25e-15, eliminate_discontinuities=True)
PULSE3_145 = dict(pulse='gaussian', time_definition='standard', wavelength=1.45, pulse_length=2.4160798324926404e-14,
                  pulse_offset=70e-15, eliminate_discontinuities=True)
# Visible pulse of the stability sweep's SiN post fixture.
VISIBLE_PULSE = dict(pulse='gaussian', time_definition='standard', wavelength=.55, pulse_length=9.164e-15, pulse_offset=27e-15,
                     eliminate_discontinuities=True)
MATERIALS = dict(
    # Single-pole Lorentz silicon nitride of the documented divergence: n = 2.0 at 1.55 um, negative between 1.4e16 and 2.8e16 rad/s.
    sin=Material(name='medium', model='lorentz', epsilon_inf=1., resonance_rad_s=1.4e16, linewidth_rad_s=1e13, delta_epsilon=3.),
    # G3-03 Drude metal: eps about -1.70 + 0.22i at 1.55 um.
    drude=Material(name='medium', model='drude', epsilon_inf=1., plasma_rad_s=2e15, collision_rad_s=1e14),
    # Stability-sweep Drude dielectric: Re eps 3.1 to 3.5 over 1.3 to 1.8 um, negative below 5e14 rad/s.
    drude_dielectric=Material(name='medium', model='drude', epsilon_inf=4., plasma_rad_s=1e15, collision_rad_s=1e14),
    # Vacuum carrying a 1e-6 Lorentz pole: a dispersive fill makes its faces absorbers while the medium stays vacuum to 1e-6.
    dilute=Material(name='medium', model='lorentz', epsilon_inf=1., resonance_rad_s=1.4e16, linewidth_rad_s=1e13, delta_epsilon=1e-6))


# ----------------------------------------------------------------------------------------------- fixtures
def reflection_project(*, long, material='vacuum', pol='TE', mode='absorber', layers=LAYERS, angle_deg=0., duration_fs=150.,
                       h=.025, far=16., fill='half'):
    """Source at x=0, monitor at 1 um, x_max layer from 1.5 um; x_min layer from -9.5 um in both domains.

    fill 'half' is the G3-07 half space (a 2 um periodic cell, monitors 0.5 um either side of the interface);
    'full' fills a 0.3 um periodic cell with the medium, which then crosses the layers everywhere.
    """
    depth = layers*h
    x_max = 1.5+(far if long else 0.)+depth
    x_min = -9.5-depth
    shift = (x_max+x_min)/2
    interface = material != 'vacuum' and fill == 'half'
    period = 2. if interface else .3
    bloch = angle_deg != 0
    ky = 2*np.pi/1.55*math.sin(math.radians(angle_deg))
    dt = .99/math.sqrt(2)*h*1e-6/C0
    kind = 'bloch' if bloch else 'periodic'
    region = Region(dimension='2d', size=(x_max-x_min, period, 1), mesh=h, steps=round(duration_fs*1e-15/dt), pml_cells=min(layers, 50),
                    backend='cpu', precision='float64', material_sampling='yee', snapshot_interval=10000, pml_dispersion=mode,
                    boundaries=Boundaries(x_min=BoundaryFace(layers=layers), x_max=BoundaryFace(layers=layers),
                                          y_min=BoundaryFace(kind=kind), y_max=BoundaryFace(kind=kind)),
                    bloch_phase=(0, ky*period if bloch else 0, 0), run_control=RunControl(check_interval=100))
    component, observed = ('Ez', 'Ez') if pol == 'TE' else ('Ey', 'Hz')
    if interface:
        monitors = [Monitor(id='v', name='vacuum side', component=observed, center=(1.-shift, .5, 0)),
                    Monitor(id='d', name='medium side', component=observed, center=(1.-shift, -.5, 0))]
        structures = [Structure(name='half space', center=(0, -.4875, 0), size=(1000., 1., 2.), material='medium')]
        materials = [Material(name='void', index=1), MATERIALS[material]]
    else:
        monitors = [Monitor(id='m', name='m', component=observed, center=(1.-shift, 0, 0))]
        structures, materials = [], [Material(name='void', index=1)]
        if material != 'vacuum':
            structures = [Structure(name='fill', center=(0, 0, 0), size=(1000., 100., 2.), material='medium')]
            materials.append(MATERIALS[material])
    source = Source(kind='plane', center=(-shift, 0, 0), size=(0, period, 0), component=component, **(PULSE3_145 if bloch else PULSE))
    return Project(name=f'{material} {fill} {pol} {mode} L{layers} {angle_deg:g}deg {"long" if long else "short"}', region=region,
                   materials=materials, structures=structures, sources=[source], monitors=monitors)


def corner_post_project(material, mode, *, size=(1.2, 1.2, 1.), steps=20000, sample=SAMPLE, precision='float64', backend='cpu',
                        kernel='torch', depth=.1, mesh=.02, layers=POST_LAYERS, inside=False, face=None, linewidth=None):
    """A 0.6 um post filling the outer `depth` of the x_max/y_max corner of a 12-layer CPML box (20 nm cells).

    inside moves the post 0.35 um into the interior; face overrides the CPML profile of every face;
    linewidth replaces the Lorentz damping; material 'dielectric' is a nondispersive n=2 post.
    """
    X, Y, Z = size
    r = Region(dimension='3d', size=size, mesh=mesh, steps=steps, precision=precision, backend=backend, cuda_kernel=kernel,
               pml_cells=layers, material_sampling='yee', snapshot_interval=10000, pml_dispersion=mode,
               boundaries=Boundaries(**{f'{a}_{side}': BoundaryFace(**(face or {})) for a in 'xyz' for side in ('min', 'max')}),
               run_control=RunControl(check_interval=sample, growth_limit=1e300))
    medium = Material(name='medium', index=2.) if material == 'dielectric' else MATERIALS[material]
    if linewidth is not None:
        medium = medium.model_copy(update=dict(linewidth_rad_s=linewidth))
    center = (X/2-.35, Y/2-.35, 0) if inside else (X/2, Y/2, 0)
    post = Structure(name='post', center=center, size=(2*depth, 2*depth, .6), material='medium')
    return Project(name=f'{material} corner post {mode}', region=r, materials=[Material(name='void', index=1), medium],
                   structures=[post], sources=[Source(kind='point', component='Ex', center=(X/2-.4, Y/2-.4, .05), **VISIBLE_PULSE)],
                   monitors=[Monitor(component='Ex', center=(X/2-.35, Y/2-.35, 0.))])


def pillar_array_project(mode, *, steps=20000, sample=SAMPLE, lateral=6., height=1.4, period=.3):
    """0.2 x 0.2 x 0.6 um SiN pillars on a 0.3 um lattice through the lateral PML of a 6 um box, Ex plane pulse from below."""
    r = Region(dimension='3d', size=(lateral, lateral, height), mesh=.02, steps=steps, precision='float32', backend='cuda',
               cuda_kernel='fused', pml_cells=POST_LAYERS, material_sampling='yee', snapshot_interval=10000, pml_dispersion=mode,
               run_control=RunControl(check_interval=sample, growth_limit=1e300))
    n = int(math.ceil(lateral/2/period))+1
    pillars = [Structure(name=f'pillar {i} {j}', center=(i*period, j*period, 0), size=(.2, .2, .6), material='medium')
               for i in range(-n, n+1) for j in range(-n, n+1)]
    sheet = Source(kind='plane', component='Ex', center=(0, 0, -height/2+.3), size=(lateral-.6, lateral-.6, 0), **VISIBLE_PULSE)
    return Project(name=f'SiN pillar array {mode}', region=r, materials=[Material(name='void', index=1), MATERIALS['sin']],
                   structures=pillars, sources=[sheet], monitors=[Monitor(component='Ex', center=(0, 0, height/2-.3))])


# ----------------------------------------------------------------------------------------------- rows
def rows():
    out = []
    # Normal incidence through a homogeneous medium that fills the layers: the vacuum and SiN fills are judged at the program's
    # normal limit; the strongly dispersive Drude dielectric is recorded (the E loss is matched at the source centre only).
    for material, pols in (('dilute', ('TE',)), ('sin', ('TE', 'TM')), ('drude_dielectric', ('TE',))):
        for pol in pols:
            for mode, judged in (('absorber', 'normal' if material != 'drude_dielectric' else None), ('ade', None)):
                out.append(dict(id=f'reflection-{material}-fill-{pol}-{"absorber" if mode == "absorber" else "cpml"}', kind='reflection',
                                material=material, fill='full', pol=pol, mode=mode, layers=LAYERS, judged=judged))
    # The G3-07 half space crossing the layers: every passive absorber scatters at the interface; recorded with a depth sweep.
    for material in ('drude', 'sin'):
        for pol in ('TE', 'TM'):
            for mode, layers in (('absorber', LAYERS), ('absorber', 2*LAYERS), ('ade', LAYERS)):
                out.append(dict(id=f'reflection-{material}-half-{pol}-{"absorber" if mode == "absorber" else "cpml"}'
                                   + (f'-L{layers}' if layers != LAYERS else ''),
                                kind='reflection', material=material, fill='half', pol=pol, mode=mode, layers=layers,
                                judged=HALF_SPACE if (mode, layers) == ('absorber', LAYERS) else None))
    for angle in (30, 60):
        for mode in ('absorber', 'ade'):
            out.append(dict(id=f'reflection-dilute-fill-TE-{angle}deg-{"absorber" if mode == "absorber" else "cpml"}', kind='reflection',
                            material='dilute', fill='full', pol='TE', mode=mode, layers=LAYERS, angle_deg=angle, judged=None))
    # Mechanism: the CPML corner post varied one parameter at a time (reported, not judged).
    for name, options in (('interior', dict(inside=True)), ('dielectric', dict(material='dielectric')), ('depth10', dict(depth=.2)),
                          ('depth3', dict(depth=.06)), ('sigma025', dict(face=dict(sigma_scale=.25))),
                          ('cfs-alpha02', dict(face=dict(alpha=.2, alpha_polynomial=1))), ('kappa4', dict(face=dict(kappa=4))),
                          ('linewidth1e14', dict(linewidth=1e14)), ('linewidth1e15', dict(linewidth=1e15))):
        out.append(dict(id=f'mechanism-{name}-cpml-cpu-float64', kind='stability', fixture='corner_post', material='sin', mode='ade',
                        steps=4000, precision='float64', backend='cpu', kernel='torch', judged=None, **{'options': options}))
    out.append(dict(id='mechanism-mesh10nm-cpml-cuda-float64', kind='stability', fixture='corner_post', material='sin', mode='ade',
                    steps=8000, precision='float64', backend='cuda', kernel='fused', judged=None,
                    options=dict(mesh=.01, layers=2*POST_LAYERS, sample=2*SAMPLE)))
    for material in ('sin', 'drude'):
        out.append(dict(id=f'stability-{material}-post-cpml-cpu-float64', kind='stability', fixture='corner_post', material=material, mode='ade',
                        steps=4000, precision='float64', backend='cpu', kernel='torch', judged='diverges'))
        for precision, backend, kernel in (('float64', 'cpu', 'torch'), ('float32', 'cuda', 'fused')):
            out.append(dict(id=f'stability-{material}-post-absorber-{backend}-{precision}', kind='stability', fixture='corner_post',
                            material=material, mode='absorber', steps=20000, precision=precision, backend=backend, kernel=kernel,
                            judged=f'stable_{precision}'))
    out.append(dict(id='stability-sin-post-absorber-cuda-float32-torch', kind='stability', fixture='corner_post', material='sin',
                    mode='absorber', steps=20000, precision='float32', backend='cuda', kernel='torch', judged='stable_float32'))
    out.append(dict(id='stability-sin-post-absorber-tensor-batch-float32', kind='stability', fixture='corner_post', material='sin',
                    mode='absorber', steps=20000, precision='float32', backend='cuda', kernel='fused', path='tensor_batch',
                    judged='stable_float32'))
    out.append(dict(id='stability-sin-post-cpml-cuda-float32', kind='stability', fixture='corner_post', material='sin', mode='ade',
                    steps=4000, precision='float32', backend='cuda', kernel='fused', judged='diverges'))
    out.append(dict(id='stability-sin-array-cpml-cuda-float32', kind='stability', fixture='pillar_array', material='sin', mode='ade',
                    steps=4000, precision='float32', backend='cuda', kernel='fused', judged='diverges'))
    out.append(dict(id='stability-sin-array-absorber-cuda-float32', kind='stability', fixture='pillar_array', material='sin',
                    mode='absorber', steps=20000, precision='float32', backend='cuda', kernel='fused', judged='stable_float32'))
    for spec in out:
        spec['cuda'] = spec.get('backend') == 'cuda'
    return out


def build(spec):
    if spec['kind'] == 'reflection':
        kw = dict(material=spec['material'], pol=spec['pol'], mode=spec['mode'], layers=spec['layers'], angle_deg=spec.get('angle_deg', 0.),
                  fill=spec['fill'])
        return reflection_project(long=False, **kw), reflection_project(long=True, **kw)
    if spec['fixture'] == 'corner_post':
        options = dict(spec.get('options', {}))
        material = options.pop('material', spec['material'])
        return corner_post_project(material, spec['mode'], steps=spec['steps'], precision=spec['precision'],
                                   backend=spec['backend'], kernel=spec['kernel'], **options)
    return pillar_array_project(spec['mode'], steps=spec['steps'])


# ----------------------------------------------------------------------------------------------- measurements
def band(points, low=1.3, high=1.8):
    return np.linspace(C0/(high*1e-6), C0/(low*1e-6), points)


def dft(times, signal, frequencies):
    """Sum s(t) exp(+2 pi i f t) dt: the exp(-i omega t) component of the trace."""
    dt = times[1]-times[0]
    return (np.exp(2j*np.pi*np.multiply.outer(frequencies, times)) @ signal)*dt


def reflection(short, long, monitor, low=1.3, high=1.8):
    """G3-07 power ratio |DFT(short - long)|^2 / |DFT(long)|^2 on 21 frequencies of the band."""
    f = band(21, low, high)
    incident = dft(long.times, long.signals[:, monitor], f)
    reflected = dft(short.times, short.signals[:, monitor]-long.signals[:, monitor], f)
    R = abs(reflected)**2/abs(incident)**2
    difference = short.signals[:, monitor]-long.signals[:, monitor]
    return dict(wavelength_um=(C0/f*1e6).tolist(), R=R.tolist(), R_max_on_band=float(np.max(R)),
                R_broadband=float(np.sum(abs(difference)**2)/np.sum(abs(long.signals[:, monitor])**2)),
                incident_peak=float(np.max(abs(long.signals[:, monitor]))))


def run_samples(p, path='simulation'):
    """Run-control samples (state norm, interior energy, peak field), the monitor traces of a completed run and the error of a raised one."""
    with Capture() as capture:
        try:
            if path == 'tensor_batch':
                from torchfdtd import run_tensor_batch
                run_tensor_batch([p], device=0, keep_results=False)
                return capture.samples, None, None
            result = Simulation(p).run()
            return capture.samples, result.signals, None
        except FloatingPointError as exc:
            return capture.samples, None, f'{type(exc).__name__}: {exc}'


def growth(samples, signals, dt, material):
    """Exponential rate of the state norm over the second half and the dominant frequency of the monitor trace there."""
    steps = np.array([s['step'] for s in samples], dtype=float)
    energy = np.array([s['state_norm'] for s in samples], dtype=float)
    later = slice(len(steps)//2, None)
    rate = float(np.polyfit(steps[later], np.log(energy[later]), 1)[0])
    out = dict(energy_rate_per_step=rate, amplitude_rate_per_s=rate/2/dt)
    if signals is None or rate <= 0:
        return out
    trace = np.asarray(signals[len(signals)//2:, 0], dtype=float)
    trace = trace*np.exp(-rate/2*np.arange(len(trace)))*np.hanning(len(trace))
    f = np.fft.rfftfreq(len(trace), dt)
    peak = float(f[1+np.argmax(abs(np.fft.rfft(trace))[1:])])
    eps = permittivity(material, peak, dt)
    out.update(frequency_hz=peak, omega_rad_s=2*np.pi*peak, bilinear_epsilon=dict(re=float(eps.real), im=float(eps.imag)))
    return out


def execute(spec):
    started = time.perf_counter()
    out = {k: v for k, v in spec.items()}
    try:
        if spec['kind'] == 'reflection':
            short_p, long_p = build(spec)
            short, long = Simulation(short_p).run(), Simulation(long_p).run()
            band_um = (1.3, 1.6) if spec.get('angle_deg') else (1.3, 1.8)
            out.update(shape_short=list(short_p.region.shape), shape_long=list(long_p.region.shape), steps=short_p.region.steps,
                       dt_s=short_p.region.time_step, band_um=list(band_um),
                       monitors={m.name: reflection(short, long, k, *band_um) for k, m in enumerate(short.point_monitors)},
                       error=None)
        else:
            p = build(spec)
            samples, signals, error = run_samples(p, spec.get('path', 'simulation'))
            out.update(shape=list(p.region.shape), cells=int(math.prod(p.region.shape)), dt_s=p.region.time_step,
                       source_end_fs=source_end_time(p)*1e15, steps_completed=int(samples[-1]['step']) if samples else 0,
                       sample_interval=p.region.run_control.check_interval, samples=samples, error=error)
            if spec['mode'] == 'ade' and samples:
                medium = next(m for m in p.materials if m.name == 'medium')
                out['growth'] = growth(samples, signals if medium.oscillators else None, p.region.time_step, medium)
    except Exception as exc:   # an admission or contract error is a recorded outcome
        traceback.print_exc()
        out['error'] = f'{type(exc).__name__}: {exc}'
    if torch.cuda.is_available():
        torch.cuda.synchronize()
    out['seconds'] = time.perf_counter()-started
    return out


def stability_numbers(out, sweep_limits):
    """G3-07 decay and late growth and the stability sweep's post-source ratios of the recorded samples."""
    samples = out['samples']
    steps = np.array([s['step'] for s in samples])
    energy = np.array([s['state_norm'] for s in samples], dtype=float)
    finite = bool(np.all(np.isfinite(energy)))
    peak = float(np.nanmax(energy))
    half = int(np.searchsorted(steps, steps[-1]//2))
    return dict(finite=finite, energy_peak=peak, energy_last_over_peak=float(energy[-1]/peak),
                late_growth=float(np.max(energy[half:])/max(energy[half], 1e-12*peak)), half_step=int(steps[half]),
                sweep=judge(samples, out['source_end_fs']*1e-15, out['dt_s'], False, sweep_limits))


def verdict(out, acceptance):
    """Judgement of one row from its recorded numbers and the case's acceptance block."""
    kind = out['judged']
    if out.get('error') and kind != 'diverges':
        out['judgement'] = dict(judged=bool(kind), reason='error')
        out['passed'] = not kind
        return out
    if out['kind'] == 'reflection':
        values = {name: m['R_max_on_band'] for name, m in out['monitors'].items()}
        if not kind:
            out['judgement'], out['passed'] = dict(judged=False, R_max_on_band=values), True
            return out
        limit = acceptance['reflection'][kind]['R_max_on_band']
        out['judgement'] = dict(judged=True, criterion=kind, R_max_on_band=values, limit=limit)
        out['passed'] = bool(all(v <= limit for v in values.values()))
        return out
    limits = acceptance['stability']
    numbers = stability_numbers(out, limits['sweep']) if out['samples'] else None
    if not kind:
        out['judgement'], out['passed'] = dict(judged=False, numbers=numbers), True
        return out
    if kind == 'diverges':
        sn = (numbers or {}).get('sweep', {}).get('state_norm') or {}
        growth = sn.get('growth_ratio')
        diverged = bool((out.get('error') is not None and 'FloatingPointError' in out['error']) or
                        (growth is not None and growth >= limits['diverges']['growth_ratio_min']))
        out['judgement'] = dict(judged=True, criterion=kind, growth_ratio=growth, error=out.get('error'), diverged=diverged)
        out['passed'] = diverged
        return out
    rule = limits[kind]
    checks = dict(finite=numbers['finite'], energy_last_over_peak=numbers['energy_last_over_peak'] <= rule['energy_last_over_peak_max'])
    if 'late_growth_max' in rule:
        checks['late_growth'] = numbers['late_growth'] <= rule['late_growth_max']
    for name in ('state_norm', 'interior_energy'):
        j = numbers['sweep'].get(name)
        checks[f'{name}_growth_ratio'] = bool(j and j['growth_ratio'] <= rule['growth_ratio_max'])
        checks[f'{name}_last_over_peak'] = bool(j and j['last_over_peak'] <= rule['last_over_peak_max'])
    checks['steps'] = out['steps_completed'] == out['steps']
    out['judgement'] = dict(judged=True, criterion=kind, numbers=numbers, checks=checks)
    out['passed'] = bool(all(checks.values()))
    return out


# ----------------------------------------------------------------------------------------------- record
LIMITATIONS = [
    'Stability is empirical non-growth over 20,000 steps on these fixtures, not a spectral proof; the general argument is that the '
    'absorber is a passive medium (non-negative E and H conductivity, trapezoidal in time, solved together with the passive ADE)',
    'Reflection is measured in 2D at normal incidence (and at 30 and 60 deg in vacuum) on a 25 nm mesh at 1.3 to 1.8 um; in the continuum '
    'the matched absorber is reflectionless only for a homogeneous medium at normal incidence, and a transverse interface that crosses '
    'the layer reflects at every depth the model admits (the half-space rows)',
    'The E loss of a pole cell is matched to the real permittivity at the source centre, so a homogeneous dispersive fill reflects more '
    'away from that frequency; the fill rows measure it over 1.3 to 1.8 um',
    'CUDA rows run on the shared RTX 3060; the 6 um pillar array runs in float32 only',
    'The mechanism rows vary one parameter of one fixture at a time; they locate the growth, they do not map where the CPML is unstable',
]


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
    names = ('benchmarks/dispersive_pml_absorber.py', 'torchfdtd/boundaries.py', 'torchfdtd/materials.py', 'torchfdtd/cuda_kernels.py',
             'torchfdtd/solver.py', 'torchfdtd/tensor_batch.py', 'torchfdtd/run_control.py')
    return {name: hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in names}


def summary(out):
    j = out.get('judgement') or {}
    return dict(id=out['id'], passed=out['passed'], error=out.get('error'), seconds=round(out['seconds'], 1),
                **({'R_max_on_band': j.get('R_max_on_band')} if out['kind'] == 'reflection' else
                   {'growth_ratio': j.get('growth_ratio'), 'checks': j.get('checks'),
                    'last_over_peak': (j.get('numbers') or {}).get('energy_last_over_peak')}))


def write(record, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(record, indent=2)+'\n', encoding='utf-8', newline='\n')
    temporary.replace(path)


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


def verdict_text(row):
    if not row['judged']:
        return 'recorded'
    return 'pass' if row['passed'] else 'FAIL'


def render(record):
    env = record['environment']
    rows = record['rows']
    merged = env.get('merged') or []
    lines = ['# Dispersive media crossing the absorbing layer', '',
             f"Record: `docs/validation/{RECORD.name}` (case `{record['case']['path']}`, declared at commit "
             f"{record['case']['declared_at_commit'][:12]}). Driver `benchmarks/dispersive_pml_absorber.py`. Every number below is copied from "
             'the record; nothing here is typed by hand. The absorber and the measured mechanism are described in '
             '[BOUNDARIES.md](BOUNDARIES.md#dispersive-materials-inside-pml).', '',
             f"Environment: Python {env['python']}, torch {env['torch']} (CUDA {env['cuda_runtime']}), GPU {env['gpu']}, {env['os']}; "
             f"run at {env['recorded_at']} on commit {env['commit']} with {env['dirty_paths']} dirty paths"
             + (f"; rows merged from {len(merged)} later run(s) on commit(s) {', '.join(sorted({m['commit'][:12] for m in merged}))}"
                if merged else '') + '.', '',
             f"Verdict: {'every judged row passes' if record['passed'] else 'failing rows: ' + ', '.join(record['failing_ids'])} "
             f"({sum(1 for r in rows if r['judged'])} judged rows, {sum(1 for r in rows if not r['judged'])} recorded rows).", '',
             '## Reflection', '',
             'G3-07 power ratio |DFT(short - long)|^2 / |DFT(long)|^2 at each monitor, maximum over 21 frequencies of the band, and the '
             'time-domain energy ratio of the difference trace. `fill`: the medium fills the periodic cell and crosses the layers everywhere; '
             '`half`: the G3-07 half space, monitors 0.5 um on the vacuum side and on the medium side of the interface. `cpml` rows use '
             "`pml_dispersion='ade'` with the same depth.", '',
             '| row | medium | fill | pol | layer | layers | angle (deg) | R max on band (per monitor) | R broadband (per monitor) | limit | verdict |',
             '| --- | --- | --- | --- | --- | ---: | ---: | --- | --- | ---: | --- |']
    for r in rows:
        if r['kind'] != 'reflection':
            continue
        monitors = r.get('monitors') or {}
        lines.append(f"| {r['id']} | {r['material']} | {r['fill']} | {r['pol']} | {'absorber' if r['mode'] == 'absorber' else 'cpml'} | "
                     f"{r['layers']} | {fmt(r.get('angle_deg', 0))} | "
                     + '; '.join(f"{name} {fmt(m['R_max_on_band'])}" for name, m in monitors.items()) + ' | '
                     + '; '.join(f"{name} {fmt(m['R_broadband'])}" for name, m in monitors.items()) + ' | '
                     + f"{fmt(r['judgement'].get('limit'))} | {verdict_text(r)} |")
    lines += ['', '## Long-time stability', '',
              'Run-control state norm and interior energy every 250 steps. `last/peak` and `late growth` follow G3-07 (overall peak; '
              'maximum of the second half over the half-way sample, floored at 1e-12 of the peak); `growth` and `last/post-source peak` '
              'follow the stability sweep for the state norm and the interior energy. The CPML controls must diverge.', '',
              '| row | fixture | medium | layer | execution | cells | steps | last/peak | late growth | growth (norm; interior) | last/post-source peak (norm; interior) | error | verdict |',
              '| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |']
    for r in rows:
        if r['kind'] != 'stability' or r['id'].startswith('mechanism'):
            continue
        numbers = r['judgement'].get('numbers') or (stability_numbers(r, record['acceptance']['stability']['sweep']) if r.get('samples') else {})
        sweep = numbers.get('sweep') or {}
        pair = lambda key: '; '.join(fmt((sweep.get(name) or {}).get(key)) for name in ('state_norm', 'interior_energy'))
        execution = f"{r['backend']} {r['precision']} {r.get('path', r['kernel'])}"
        lines.append(f"| {r['id']} | {r['fixture']} | {r['material']} | {'absorber' if r['mode'] == 'absorber' else 'cpml'} | {execution} | "
                     f"{r.get('cells')} | {r.get('steps_completed')} | {fmt(numbers.get('energy_last_over_peak'))} | {fmt(numbers.get('late_growth'))} | "
                     f"{pair('growth_ratio')} | {pair('last_over_peak')} | {r.get('error') or ''} | {verdict_text(r)} |")
    lines += ['', '## Growth with the CPML', '',
              'Least-squares rate of ln(state norm) over the second half of the samples, the amplitude rate per second, the dominant '
              'frequency of the monitor trace there and the bilinear permittivity of the medium at that frequency (growing rows only). '
              'The mechanism rows vary one parameter of the SiN corner post at a time.', '',
              '| row | variation | energy rate per step | amplitude rate (1/s) | frequency (rad/s) | bilinear eps | last state norm / peak |',
              '| --- | --- | ---: | ---: | ---: | --- | ---: |']
    for r in rows:
        if r['kind'] != 'stability' or r['mode'] != 'ade':
            continue
        g = r.get('growth') or {}
        eps = g.get('bilinear_epsilon')
        peak = max(s['state_norm'] for s in r['samples']) if r.get('samples') else None
        variation = json.dumps(r['options'], sort_keys=True) if r.get('options') else 'control'
        lines.append(f"| {r['id']} | {variation} | {fmt(g.get('energy_rate_per_step'))} | {fmt(g.get('amplitude_rate_per_s'))} | "
                     f"{fmt(g.get('omega_rad_s'))} | {fmt(eps['re']) + ' + ' + fmt(eps['im']) + 'i' if eps else 'n/a'} | "
                     f"{fmt(r['samples'][-1]['state_norm']/peak) if peak else 'n/a'} |")
    lines += ['', '## Limits of this record', '']
    lines += [f'- {item}' for item in record['limitations']]
    return '\n'.join(lines)+'\n'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', default=str(RECORD))
    parser.add_argument('--rows', nargs='*', help='row ids to run (default: every row)')
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--skip-cuda', action='store_true')
    group.add_argument('--only-cuda', action='store_true')
    parser.add_argument('--merge', action='store_true', help='replace the selected rows inside the existing record')
    parser.add_argument('--rejudge', action='store_true', help='recompute every verdict of the existing record from its numbers')
    parser.add_argument('--render', action='store_true', help=f'rewrite {DOCUMENT.name} from the existing record and exit')
    parser.add_argument('--list', action='store_true')
    args = parser.parse_args()
    specs = rows()
    if args.list:
        for spec in specs:
            print(spec['id'], spec['judged'], 'cuda' if spec['cuda'] else 'cpu')
        return
    if args.render:
        DOCUMENT.write_text(render(json.loads(Path(args.output).read_text(encoding='utf-8'))), encoding='utf-8', newline='\n')
        print(DOCUMENT)
        return
    case = json.loads(CASE.read_text(encoding='utf-8'))
    acceptance = case['acceptance']
    path = Path(args.output)
    previous = json.loads(path.read_text(encoding='utf-8')) if (args.merge or args.rejudge) and path.is_file() else None
    if args.rejudge:
        done = [verdict({k: v for k, v in row.items() if k not in ('judgement', 'passed')}, acceptance) for row in previous['rows']]
    else:
        if args.rows and set(args.rows)-{s['id'] for s in specs}:
            raise SystemExit(f'unknown rows: {sorted(set(args.rows)-{s["id"] for s in specs})}')
        selected = [s for s in specs if (not args.rows or s['id'] in args.rows) and not (args.skip_cuda and s['cuda'])
                    and not (args.only_cuda and not s['cuda'])]
        torch.set_num_threads(2)
        done = []
        for spec in selected:
            out = verdict(execute(spec), acceptance)
            print(json.dumps(summary(out)), flush=True)
            done.append(out)
        if previous is not None:
            fresh = {o['id']: o for o in done}
            done = [fresh.pop(o['id'], o) for o in previous['rows']]+list(fresh.values())
    order = {spec['id']: i for i, spec in enumerate(specs)}
    done.sort(key=lambda o: order.get(o['id'], len(order)))
    failing = [o['id'] for o in done if not o['passed']]
    record = dict(schema='torchfdtd.dispersive_pml_absorber.v1',
                  case=dict(path=str(CASE.relative_to(ROOT)).replace('\\', '/'), case_id=case['case_id'],
                            declared_at_commit=case['declared_at_commit']),
                  acceptance=acceptance, environment=previous['environment'] if args.rejudge else environment(),
                  source_sha256=previous['source_sha256'] if args.rejudge else source_hashes(),
                  spec=dict(layers=LAYERS, post_layers=POST_LAYERS, sample_interval=SAMPLE, pulse=PULSE, oblique_pulse=PULSE3_145,
                            visible_pulse=VISIBLE_PULSE, materials={k: v.model_dump(mode='json') for k, v in MATERIALS.items()}),
                  rows=done, failing_ids=failing, passed=not failing, limitations=LIMITATIONS)
    if args.merge and previous is not None and not args.rejudge:
        record['environment'] = dict(previous['environment'], merged=[*previous['environment'].get('merged', []),
                                                                     dict(environment(), rows=[s['id'] for s in selected],
                                                                          source_sha256=source_hashes())])
        record['source_sha256'] = previous['source_sha256']
    write(record, path)
    if path.resolve() == RECORD.resolve():
        DOCUMENT.write_text(render(record), encoding='utf-8', newline='\n')
    print(json.dumps(dict(rows=len(done), failing=failing)), flush=True)


if __name__ == '__main__':
    main()
