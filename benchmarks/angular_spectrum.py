"""Angular-spectrum validation: analytic beams, the Green-function cross-check, a metalens FDTD comparison, the performance target.

Records go to docs/validation; `benchmarks.report_angular_spectrum` renders the
tables of docs/ANGULAR_SPECTRUM.md from them.
"""
import argparse
import json
import math
from pathlib import Path
import time
import warnings

import numpy as np
import torch

from torchfdtd import (BoundaryFace, Boundaries, FieldMonitor, Material, Project, Region, SectionResult, Simulation, Source,
                       StitchedPlane, Structure, project_nearzone, propagate_points, propagate_section, propagate_volume, volume_bytes)
from torchfdtd.adjoint_planes import COMPONENTS, DifferentiablePlaneResult
from torchfdtd.run_control import source_end_time

C0 = 299792458.0
WAVELENGTH = 1.55
FREQUENCY = C0 / (WAVELENGTH * 1e-6)
SIX = COMPONENTS


# ---------------------------------------------------------------- analytic beams
def gaussian_plane(w0, wavelength, spacing, count, *, tilt_deg=0., device='cpu', dtype=torch.complex128):
    """Ex of a Gaussian beam sampled on the z = 0 plane, rotated about y by ``tilt_deg``; other components zero."""
    u = (torch.arange(count, dtype=torch.float64) - (count - 1) / 2) * spacing
    ug, vg = torch.meshgrid(u, u, indexing='ij')
    fields = torch.zeros((1, count, count, 6), dtype=dtype)
    fields[0, :, :, 0] = paraxial_beam(w0, wavelength, ug, vg, torch.zeros_like(ug), tilt_deg=tilt_deg).to(dtype)
    plane = StitchedPlane(fields.to(device), torch.tensor([C0 / (wavelength * 1e-6)], dtype=torch.float64, device=device),
                          u.to(device), u.to(device), 'z', 0., 1, (spacing, spacing), '3d', (-1., 0.), 'synthetic', {})
    return plane, ug, vg


def paraxial_beam(w0, wavelength, x, y, z, *, tilt_deg=0.):
    """Closed-form paraxial Gaussian beam with exp(+ikz) phasors, waist at the origin, optionally rotated about y."""
    t = math.radians(tilt_deg)
    xr, zr = x * math.cos(t) - z * math.sin(t), x * math.sin(t) + z * math.cos(t)
    k = 2 * math.pi / wavelength
    rayleigh = math.pi * w0**2 / wavelength
    width = w0 * torch.sqrt(1 + (zr / rayleigh)**2)
    radius2 = xr**2 + y**2
    curvature = zr / (zr**2 + rayleigh**2)
    return (w0 / width) * torch.exp(-radius2 / width**2) * torch.exp(1j * (k * zr + k * radius2 * curvature / 2 - torch.atan(zr / rayleigh)))


def analytic_checks():
    """Waist series at a fixed fine spacing and a tilted-beam spacing series across the Nyquist limit."""
    wavelength, distances = 1., (.5, 1., 2.)
    waists = []
    for w0 in (2., 4., 8.):
        plane, ug, vg = gaussian_plane(w0, wavelength, .25, 256)
        rayleigh = math.pi * w0**2 / wavelength
        section = propagate_section(plane, [d * rayleigh for d in distances], section='xz', components=('Ex',), pad=2)
        u = plane.u_um
        errors = [float((section.fields[0, i, :, 0] - paraxial_beam(w0, wavelength, u, torch.zeros_like(u), torch.tensor(d * rayleigh))).norm()
                        / paraxial_beam(w0, wavelength, u, torch.zeros_like(u), torch.tensor(d * rayleigh)).norm()) for i, d in enumerate(distances)]
        waists.append(dict(w0_over_wavelength=w0, rayleigh_um=rayleigh, distances_in_rayleigh=list(distances), errors=errors))
    tilted = []
    w0, tilt = 3., 30.
    rayleigh = math.pi * w0**2 / wavelength
    for spacing in (1.25, 1., .75, .5, .25):
        count = int(round(96 / spacing))
        plane, ug, vg = gaussian_plane(w0, wavelength, spacing, count, tilt_deg=tilt)
        z = rayleigh
        section = propagate_section(plane, [z], section='xz', components=('Ex',), pad=2)
        u = plane.u_um
        expected = paraxial_beam(w0, wavelength, u, torch.zeros_like(u), torch.tensor(z), tilt_deg=tilt)
        report = section.report
        tilted.append(dict(spacing_over_wavelength=spacing, samples=count, max_angle_deg=report['max_angle_deg'][0],
                           error=float((section.fields[0, 0, :, 0] - expected).norm() / expected.norm())))
    plane, ug, vg = gaussian_plane(1e9, wavelength, .25, 96)
    ku, kv = 2 * math.pi * 3 / (96 * .25), 2 * math.pi * 2 / (96 * .25)
    wave = torch.exp(1j * (ku * ug + kv * vg))
    plane.fields[0, :, :, 0] = wave
    distance, k = 7.3, 2 * math.pi / wavelength
    out = propagate_volume(plane, [distance], components=('Ex',), pad=1)
    expected = wave * complex(math.cos(math.sqrt(k**2 - ku**2 - kv**2) * distance), math.sin(math.sqrt(k**2 - ku**2 - kv**2) * distance))
    return dict(waist_series=waists, tilted_spacing_series=dict(w0_over_wavelength=w0, tilt_deg=tilt, rows=tilted,
                                                                nyquist_spacing_over_wavelength=1 / (math.sin(math.radians(tilt)) + 2 * wavelength / (math.pi * w0))),
                plane_wave=dict(distance_um=distance, error=float((out.fields[0, 0, :, :, 0] - expected).norm() / expected.norm())))


# ---------------------------------------------------------------- Green-function cross-check
def face(normal, bounds, side, count, wavelength, dtype=torch.float64):
    a = 'xyz'.index(normal)
    coords = [torch.tensor([bounds[d][side]], dtype=dtype) if d == a else bounds[d][0] + (torch.arange(count, dtype=dtype) + .5) * (bounds[d][1] - bounds[d][0]) / count
              for d in range(3)]
    points = torch.stack(torch.meshgrid(*coords, indexing='ij'), -1).reshape(-1, 3)
    area = math.prod(bounds[d][1] - bounds[d][0] for d in range(3) if d != a) * 1e-12
    return DifferentiablePlaneResult(torch.zeros((1, len(points), 6), dtype=torch.complex128), torch.tensor([C0 / (wavelength * 1e-6)], dtype=dtype),
                                     points, torch.full((len(points),), area / len(points), dtype=dtype), tuple(len(c) for c in coords), normal, 'same-run', {})


def analytic_dipole(points, *, n=1.3, shift=(.12, -.08, .05), dipole=None):
    """Exact E/H of a vector dipole at 1.55 um with every near, intermediate and far term, (1, P, 6)."""
    dipole = torch.tensor([.3 + .1j, -.2j, 1.], dtype=torch.complex128) if dipole is None else dipole
    rvec = points - torch.tensor(shift, dtype=torch.float64)
    r = rvec.norm(dim=-1)
    unit = rvec.to(dipole.dtype) / r[:, None]
    dot = (unit * dipole).sum(-1, keepdim=True)
    transverse = dipole - unit * dot
    k = 2 * math.pi * n / WAVELENGTH
    wave = torch.exp(1j * k * r)[:, None]
    electric = wave / n**2 * (k * k * transverse / r[:, None] + (3 * unit * dot - dipole) * (1 / r**3 - 1j * k / r**2)[:, None])
    magnetic = wave * k * k / n * torch.linalg.cross(unit, dipole.expand_as(unit)) * (1 / r + 1j / (k * r * r))[:, None]
    return torch.cat((electric, magnetic), -1)[None]


def huygens_sheet(points, waist, spacing=.5 * WAVELENGTH):
    """Gaussian-apodized sheet of Huygens pairs in z = 0 radiating toward +z (duality gives the magnetic dipoles)."""
    extent = 2.5 * waist
    coords = torch.arange(-extent, extent + 1e-9, spacing, dtype=torch.float64)
    x, y = torch.meshgrid(coords, coords, indexing='ij')
    amplitude = torch.exp(-(x**2 + y**2) / waist**2).reshape(-1)
    px = torch.tensor([1., 0, 0], dtype=torch.complex128)
    py = torch.tensor([0, 1., 0], dtype=torch.complex128)
    fields = torch.zeros((1, len(points), 6), dtype=torch.complex128)
    for xi, yi, a in zip(x.reshape(-1).tolist(), y.reshape(-1).tolist(), amplitude.tolist()):
        ex = analytic_dipole(points, n=1., shift=(xi, yi, 0.), dipole=px)
        ey = analytic_dipole(points, n=1., shift=(xi, yi, 0.), dipole=py)
        fields = fields + a * torch.cat((ex[..., :3] - ey[..., 3:], ex[..., 3:] + ey[..., :3]), -1)
    return fields


def green_function_check():
    """Single-plane ASM against the closed-box dyadic Green function and the exact fields."""
    from dataclasses import replace
    record = {}
    # A vector dipole 0.55 um below the top face: its field decays only as 1/r, so a finite plane truncates it.
    bounds = ((-.65, .65), (-.7, .7), (-.6, .6))
    faces = {d + ('_min' if side == 0 else '_max'): replace(p := face(d, bounds, side, 56, WAVELENGTH), fields=analytic_dipole(p.points_um))
             for d in 'xyz' for side in (0, 1)}
    top = replace(p := face('z', ((-4., 4.), (-4., 4.), (-.6, .6)), 1, 160, WAVELENGTH), fields=analytic_dipole(p.points_um))
    points = torch.tensor([[.12, -.08, .65], [.12, -.08, .8], [.12, -.08, 1.], [.12, -.08, 1.4], [.12, -.08, 2.4], [.4, .1, 1.], [1.2, .3, .9], [2.5, 0., 1.5]], dtype=torch.float64)
    exact = analytic_dipole(points)
    near = project_nearzone(faces, points, bounds_um=bounds, refractive_index=1.3)
    asm = propagate_points(top, points, index=1.3, components=SIX, pad=2)
    def errors(a, b):
        return ((a - b).norm(dim=-1) / b.norm(dim=-1))[0].tolist()
    record['dipole'] = dict(plane='8 x 8 um at z = 0.6 um, 0.05 um spacing, pad 2', points_um=points.tolist(),
                            height_above_plane_um=(points[:, 2] - .6).tolist(), asm_vs_exact=errors(asm.fields, exact),
                            nearzone_vs_exact=errors(near.fields, exact), asm_vs_nearzone=errors(asm.fields, near.fields))
    # A directed Gaussian-apodized Huygens beam whose top-face field is compact.
    waist, half, height = .8 * WAVELENGTH, 4 * WAVELENGTH, 3 * WAVELENGTH
    bounds = ((-half, half), (-half, half), (-height, height))
    faces = {d + ('_min' if side == 0 else '_max'): replace(p := face(d, bounds, side, 64, WAVELENGTH), fields=huygens_sheet(p.points_um, waist))
             for d in 'xyz' for side in (0, 1)}
    points = torch.tensor([[0, 0, height + .3], [0, 0, height + 1], [0, 0, height + 3], [0, 0, height + 8], [1., .5, height + 1],
                           [2., 0, height + 3], [3., 1., height + 5], [5., 0, height + 8]], dtype=torch.float64)
    exact = huygens_sheet(points, waist)
    near = project_nearzone(faces, points, bounds_um=bounds, refractive_index=1.)
    rows = {}
    for pad in (2, 4):
        asm = propagate_points(faces['z_max'], points, components=SIX, pad=pad)
        rows[f'pad_{pad}'] = dict(asm_vs_exact=errors(asm.fields, exact), asm_vs_nearzone=errors(asm.fields, near.fields))
    record['beam'] = dict(plane=f'{2 * half:.2f} x {2 * half:.2f} um top face at z = {height:.2f} um, 64 samples per axis', waist_um=waist,
                          points_um=points.tolist(), height_above_plane_um=(points[:, 2] - height).tolist(),
                          nearzone_vs_exact=errors(near.fields, exact), **rows)
    return record


# ---------------------------------------------------------------- metalens
def unit_cell(dimension, radius, *, period, height, mesh, index, backend, precision='float32'):
    """One periodic pillar cell lit by a sheet, with the transmitted plane 0.3 um above the pillar top."""
    three = dimension == '3d'
    pml = round(.5 / mesh)
    size = (period, period, 3.) if three else (period, 3., 1.)
    normal = 'z' if three else 'y'
    faces = {'x_min': BoundaryFace(kind='periodic'), 'x_max': BoundaryFace(kind='periodic')}
    if three:
        faces.update(y_min=BoundaryFace(kind='periodic'), y_max=BoundaryFace(kind='periodic'))
    region = Region(dimension=dimension, size=size, mesh=mesh, pml_cells=pml, steps=1000, precision=precision, backend=backend,
                    cuda_kernel='fused' if backend == 'cuda' else 'torch', boundaries=Boundaries(**faces))
    at = lambda z: (0., 0., z) if three else (0., z, 0.)
    source = Source(kind='plane', normal=normal, center=at(-.85), size=(period, period, 0.) if three else (period, 0., 0.),
                    component='Ex', wavelength=WAVELENGTH)
    monitor = FieldMonitor(id='out', normal=normal, center=at(height / 2 + .3), size=(period, period, 0.) if three else (period, 0., 1.),
                           spectrum=dict(sampling='custom', custom_frequencies_hz=[FREQUENCY], apodization='none'))
    structures = []
    if radius > 0:
        structures = [Structure(kind='circle', center=(0., 0., 0.), radius=radius, size=(1., 1., height), material='pillar') if three
                      else Structure(kind='rectangle', center=(0., 0., 0.), size=(2 * radius, height, 1.), material='pillar')]
    project = Project(region=region, materials=[Material(name='Air', index=1.), Material(name='pillar', index=index)],
                      structures=structures, sources=[source], monitors=[monitor])
    project.region.steps = math.ceil((source_end_time(project) + 60e-15) / project.region.time_step)
    return Project.model_validate(project.model_dump())


def pillar_library(dimension, radii, **kw):
    """Transmission phase (unwrapped) and amplitude of each pillar radius relative to the empty cell."""
    if not radii:
        return [dict(radius_um=.1, phase_rad=0., amplitude=1.), dict(radius_um=.2, phase_rad=1., amplitude=1.)]
    reference = Simulation(unit_cell(dimension, 0., **kw)).run().field_monitor('out')
    base = np.mean(reference['fields'][0, :, reference['components'].index('Ex')])
    rows = []
    for radius in radii:
        plane = Simulation(unit_cell(dimension, radius, **kw)).run().field_monitor('out')
        t = np.mean(plane['fields'][0, :, plane['components'].index('Ex')]) / base
        rows.append(dict(radius_um=radius, phase_rad=float(np.angle(t)), amplitude=float(abs(t))))
    phases = np.unwrap([r['phase_rad'] for r in rows])
    for row, phase in zip(rows, phases):
        row['phase_rad'] = float(phase)
    return rows


def metalens(dimension, library, *, aperture, focal, mesh, height, index, period, through_focus, backend,
             distances_um, precision='float32', extra_fs=40., plane_um=.5, margin_um=1., pillars=True):
    """A hyperbolic-phase pillar lens lit by a sheet of its own aperture; the pillar top is at normal coordinate zero.

    The interior is ``margin_um`` wider than the aperture on every side, so the
    beam's edge diffraction stays inside the recorded planes, and the sheet
    stops at the aperture: both models then see the same finite beam. Returns
    the Project and the offset converting frame to centred coordinates.
    """
    three = dimension == '3d'
    pml_um = .5
    pml = round(pml_um / mesh)
    lower = -height - 1.
    upper = (focal + 2. + pml_um) if through_focus else (plane_um + .5 + pml_um)
    centre = (lower + upper) / 2
    span = upper - lower
    interior = aperture + 2 * margin_um
    lateral = interior + 2 * pml_um
    size = (lateral, lateral, span) if three else (lateral, span, 1.)
    normal = 'z' if three else 'y'
    at = lambda z: (0., 0., z - centre) if three else (0., z - centre, 0.)
    region = Region(dimension=dimension, size=size, mesh=mesh, pml_cells=pml, steps=1000, precision=precision, backend=backend,
                    cuda_kernel='fused' if backend == 'cuda' else 'torch')
    source = Source(kind='plane', normal=normal, center=at(-height - .35), size=(aperture, aperture, 0.) if three else (aperture, 0., 0.),
                    component='Ex', wavelength=WAVELENGTH)
    spectrum = dict(sampling='custom', custom_frequencies_hz=[FREQUENCY], apodization='none')
    window = (interior, interior, 0.) if three else (interior, 0., 1.)
    monitors = [FieldMonitor(id='plane', normal=normal, center=at(plane_um), size=window, spectrum=spectrum)]
    if through_focus:
        for i, distance in enumerate(distances_um):
            monitors.append(FieldMonitor(id=f'z{i}', normal=normal, center=at(plane_um + distance), size=window, spectrum=spectrum))
        if three:
            top = upper - pml_um
            monitors.append(FieldMonitor(id='section', normal='y', center=(0., 0., (plane_um + top) / 2 - centre),
                                         size=(interior, 0., top - plane_um), spectrum=spectrum))
    # Hyperbolic phase, relative to the edge, mapped to the library's unwrapped phase; a lens beyond the library range wraps.
    phases = np.array([row['phase_rad'] for row in library])
    radii = np.array([row['radius_um'] for row in library])
    k = 2 * math.pi / WAVELENGTH
    edge = aperture / 2
    structures = []
    count = int(math.floor(aperture / period))
    start = -(count - 1) * period / 2
    positions = [(start + period * i, start + period * j) for i in range(count) for j in range(count)] if three else [(start + period * i, 0.) for i in range(count)]
    for x, y in positions:
        r = math.hypot(x, y)
        if r > edge or not pillars:
            continue
        target = k * (math.sqrt(edge**2 + focal**2) - math.sqrt(r**2 + focal**2))   # 0 at the edge, largest at the centre
        if target > phases[-1] - phases[0]:
            target = target % (2 * math.pi)
        radius = float(np.interp(phases[0] + target, phases, radii))
        structures.append(Structure(kind='circle', center=(x, y, -height / 2 - centre), radius=radius, size=(1., 1., height), material='pillar') if three
                          else Structure(kind='rectangle', center=(x, -height / 2 - centre, 0.), size=(2 * radius, height, 1.), material='pillar'))
    project = Project(region=region, materials=[Material(name='Air', index=1.), Material(name='pillar', index=index)],
                      structures=structures, sources=[source], monitors=monitors)
    project.region.steps = math.ceil((source_end_time(project) + (span / C0 * 1e-6) + extra_fs * 1e-15) / project.region.time_step)
    return Project.model_validate(project.model_dump()), centre


def fdtd_section(plane, centre, plane_um):
    """The y-normal section monitor of the through-focus run as a SectionResult in the frame of the pillar top."""
    fields = torch.as_tensor(np.asarray(plane['fields']))
    shape = tuple(plane['shape'])   # (nx, 1, nz)
    grid = fields.reshape(fields.shape[0], *shape, fields.shape[-1]).squeeze(2).permute(0, 2, 1, 3)   # (F, nz, nx, C)
    points = np.asarray(plane['points_um']).reshape(*shape, 3)
    x = torch.as_tensor(points[:, 0, 0, 0])
    z = torch.as_tensor(points[0, 0, :, 2]) + centre
    order = [plane['components'].index(c) for c in ('Ex', 'Ey', 'Ez')]
    return SectionResult(grid[..., order], z - plane_um, x, z, 'xz', ('z', 'x'), 0., torch.as_tensor(np.asarray(plane['frequency_hz'])),
                         ('Ex', 'Ey', 'Ez'), 1., dict(method='FDTD section monitor'))


def peak_memory(backend):
    if backend == 'cuda':
        torch.cuda.synchronize()
        return int(torch.cuda.max_memory_allocated())
    return None


def reset_memory(backend):
    if backend == 'cuda':
        torch.cuda.synchronize()
        torch.cuda.reset_peak_memory_stats()


def fdtd_comparison(dimension, backend, *, mesh=.05, aperture=6., focal=6., height=.6, index=3.48, period=.5,
                    distances_um=None, radii=None, pad=3, plane_um=.5, margin_um=1., extra_fs=40., empty=True):
    """FDTD through the focus against FDTD to the output plane plus ASM, on the same device."""
    radii = list(radii) if radii is not None else [.05, .07, .09, .11, .13, .15, .17, .19, .21, .225, .24]
    distances_um = tuple(distances_um) if distances_um is not None else tuple(np.round(np.arange(.5, focal + 1.51, .5), 3).tolist())
    started = time.perf_counter()
    library = pillar_library(dimension, radii, period=period, height=height, mesh=mesh, index=index, backend=backend)
    record = dict(dimension=dimension, device=backend, mesh_um=mesh, aperture_um=aperture, focal_um=focal, height_um=height,
                  index=index, period_um=period, plane_above_top_um=plane_um, margin_um=margin_um, pad=pad, library=library,
                  library_seconds=time.perf_counter() - started, distances_um=list(distances_um))
    common = dict(aperture=aperture, focal=focal, mesh=mesh, height=height, index=index, period=period, backend=backend,
                  distances_um=distances_um, plane_um=plane_um, margin_um=margin_um, extra_fs=extra_fs)
    if empty:
        # The beam alone: how far the two FDTD grids and the ASM agree without any scatterer.
        record['empty'] = fdtd_comparison(dimension, backend, mesh=mesh, aperture=aperture, focal=focal, height=height, index=index,
                                          period=period, distances_um=distances_um, radii=[], pad=pad, plane_um=plane_um,
                                          margin_um=margin_um, extra_fs=extra_fs, empty=False)
        for key in ('library', 'library_seconds'):
            record['empty'].pop(key, None)
    full, centre_full = metalens(dimension, library, through_focus=True, pillars=bool(radii), **common)
    short, centre_short = metalens(dimension, library, through_focus=False, pillars=bool(radii), **common)
    record['pillars'] = len(full.structures)
    record['phase_range_rad'] = float(library[-1]['phase_rad'] - library[0]['phase_rad']) if radii else None
    record['required_phase_rad'] = 2 * math.pi / WAVELENGTH * (math.sqrt((aperture / 2)**2 + focal**2) - focal)
    runs = {}
    results = {}
    for name, project in (('through_focus', full), ('to_plane', short)):
        reset_memory(backend)
        t0 = time.perf_counter()
        results[name] = Simulation(project).run()
        runs[name] = dict(wall_seconds=time.perf_counter() - t0, loop_seconds=results[name].summary['seconds'],
                          cells=math.prod(project.region.shape), shape=list(project.region.shape), steps=results[name].summary['steps'],
                          peak_torch_bytes=peak_memory(backend))
        print(f"  {name}: {project.region.shape} {results[name].summary['steps']} steps {runs[name]['wall_seconds']:.1f} s", flush=True)
    plane = results['to_plane'].field_monitor('plane')
    # The same output plane in the through-focus run: how far the two FDTD grids agree before any propagation.
    reference_plane = results['through_focus'].field_monitor('plane')
    ex = plane['components'].index('Ex')
    runs['plane_agreement'] = float(np.linalg.norm(plane['fields'][..., :3] - reference_plane['fields'][..., :3]) / np.linalg.norm(reference_plane['fields'][..., :3]))
    device = 'cuda' if backend == 'cuda' else 'cpu'
    plane_device = dict(plane, fields=torch.as_tensor(np.asarray(plane['fields'])).to(device))
    # Intensity at every recorded distance from the volume propagator.
    reset_memory(backend)
    t0 = time.perf_counter()
    volume = propagate_volume(plane_device, list(distances_um), components=('Ex', 'Ey', 'Ez'), pad=pad, chunk=8)
    runs['asm_volume'] = dict(wall_seconds=time.perf_counter() - t0, peak_torch_bytes=peak_memory(backend), bytes=volume.bytes)
    intensity = volume.intensity().cpu()
    rows = []
    for i, distance in enumerate(distances_um):
        monitor = results['through_focus'].field_monitor(f'z{i}')
        shape = tuple(monitor['shape'])
        fields = torch.as_tensor(np.asarray(monitor['fields'])).reshape(1, *shape, 6).squeeze('xyz'.index(monitor['normal_axis']) + 1)
        order = [monitor['components'].index(c) for c in ('Ex', 'Ey', 'Ez')]
        target = fields[..., order].abs().square().sum(-1)
        rows.append(dict(distance_um=distance, intensity_error=float((intensity[0, i] - target[0]).norm() / target[0].norm()),
                         peak_ratio=float(intensity[0, i].max() / target[0].max())))
    record['planes'] = rows
    if dimension == '3d':
        section = fdtd_section(results['through_focus'].field_monitor('section'), centre_full, plane_um)
        reset_memory(backend)
        t0 = time.perf_counter()
        asm = propagate_section(plane_device, section.z_um, section='xz', offset_um=0., components=('Ex', 'Ey', 'Ez'), pad=pad, chunk=64)
        runs['asm_section'] = dict(wall_seconds=time.perf_counter() - t0, peak_torch_bytes=peak_memory(backend), planes=len(section.z_um))
        asm_intensity, fdtd_intensity = asm.intensity().cpu(), section.intensity()
        per_z = ((asm_intensity[0] - fdtd_intensity[0]).norm(dim=-1) / fdtd_intensity[0].norm(dim=-1))
        record['section'] = dict(z_um=section.z_um.tolist(), intensity_error_per_z=per_z.tolist(),
                                 intensity_error=float((asm_intensity - fdtd_intensity).norm() / fdtd_intensity.norm()),
                                 focus_fdtd=section.focus(), focus_asm=asm.focus())
    else:
        # 2D: the recorded planes give the FDTD focus at their spacing; the ASM section uses a fine z grid.
        z = torch.arange(.05, focal + 2.01, .05)
        asm = propagate_section(plane_device, z, section='xy', offset_um=0., components=('Ex', 'Ey', 'Ez'), pad=pad, chunk=64)
        targets = []
        for i in range(len(distances_um)):
            monitor = results['through_focus'].field_monitor(f'z{i}')
            fields = torch.as_tensor(np.asarray(monitor['fields'])).reshape(1, *tuple(monitor['shape']), 6).squeeze(2)
            targets.append(fields[0, :, 0, [monitor['components'].index(c) for c in ('Ex', 'Ey', 'Ez')]])
        x = torch.as_tensor(np.asarray(monitor['points_um']).reshape(*tuple(monitor['shape']), 3)[:, 0, 0, 0])
        recorded = SectionResult(torch.stack(targets)[None], torch.tensor(distances_um, dtype=torch.float64), x,
                                 plane_um + torch.tensor(distances_um, dtype=torch.float64), 'xy', ('y', 'x'), 0.,
                                 torch.as_tensor(np.asarray(monitor['frequency_hz'])), ('Ex', 'Ey', 'Ez'), 1., dict(method='FDTD line monitors'))
        focus = recorded.focus()
        # The ASM at the recorded plane that holds the FDTD peak, so both widths are measured at one distance.
        same = propagate_section(plane_device, [focus['z_um']], section='xy', offset_um=0., components=('Ex', 'Ey', 'Ez'), pad=pad)
        record['section'] = dict(focus_fdtd_from_recorded_planes=focus, focus_asm_at_that_plane=same.focus(), focus_asm=asm.focus())
    record['runs'] = runs
    record['total_seconds'] = time.perf_counter() - started
    return record


# ---------------------------------------------------------------- performance
def performance(device='cuda', *, count=1750, spacing=.12, planes=900, aperture_radius=104., focal=1000.):
    """A synthetic hyperbolic-phase aperture of the target size, xz section for every z, and the volume estimate."""
    u = (torch.arange(count, dtype=torch.float64) - (count - 1) / 2) * spacing
    frequency = torch.tensor([C0 / 1.5e-6, C0 / 1.55e-6, C0 / 1.6e-6], dtype=torch.float64)
    ug, vg = torch.meshgrid(u, u, indexing='ij')
    fields = torch.zeros((3, count, count, 6), dtype=torch.complex64, device=device)
    for f in range(3):
        k = 2 * math.pi * float(frequency[f]) / C0 * 1e-6
        phase = -k * (torch.sqrt(ug**2 + vg**2 + focal**2) - focal)
        fields[f, :, :, 0] = (torch.polar(torch.ones_like(ug), phase) * (ug**2 + vg**2 < aperture_radius**2)).to(device)
        fields[f, :, :, 4] = fields[f, :, :, 0]
    plane = StitchedPlane(fields, frequency.to(device), u.to(device), u.to(device), 'z', 0., 1, (spacing, spacing), '3d', (-1., 0.), 'synthetic', {})
    z = torch.linspace(focal - 100., focal + 100., planes, dtype=torch.float64)
    record = dict(device=torch.cuda.get_device_name() if device == 'cuda' else 'cpu', plane=[count, count], frequencies=3, planes=planes,
                  spacing_um=spacing, aperture_radius_um=aperture_radius, focal_um=focal, dtype='complex64',
                  near_field_bytes=int(fields.numel() * fields.element_size()))
    for label, chunk in (('warmup', 64), ('section', 64)):
        reset_memory(device)
        t0 = time.perf_counter()
        section = propagate_section(plane, z, section='xz', components=('Ex', 'Ey', 'Ez'), pad=2, chunk=chunk)
        if device == 'cuda':
            torch.cuda.synchronize()
        record[label] = dict(wall_seconds=time.perf_counter() - t0, peak_torch_bytes=peak_memory(device), shape=list(section.fields.shape))
    record['focus'] = section.focus(1)
    record['volume_estimate'] = volume_bytes(plane, z, components=('Ex', 'Ey', 'Ez'), pad=2, chunk=8)
    return record


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--device', choices=('cpu', 'cuda'), default='cuda')
    parser.add_argument('--output', required=True)
    parser.add_argument('--skip', nargs='*', default=(), choices=('analytic', 'green', 'metalens', 'metalens2d', 'performance'))
    args = parser.parse_args()
    warnings.simplefilter('ignore')
    torch.manual_seed(0)
    started = time.perf_counter()
    record = dict(torch=torch.__version__, gpu=torch.cuda.get_device_name() if args.device == 'cuda' else None,
                  scope='Angular-spectrum propagation against closed-form beams, the dyadic Green function, and FDTD through the focus of a small metalens.')
    if 'analytic' not in args.skip:
        print('analytic beams', flush=True)
        record['analytic'] = analytic_checks()
    if 'green' not in args.skip:
        print('Green-function cross-check', flush=True)
        record['green_function'] = green_function_check()
    if 'metalens' not in args.skip:
        print('3D metalens FDTD comparison', flush=True)
        record['metalens_3d'] = fdtd_comparison('3d', args.device)
    if 'metalens2d' not in args.skip:
        print('2D metalens FDTD comparison (CPU)', flush=True)
        record['metalens_2d'] = fdtd_comparison('2d', 'cpu')
    if 'performance' not in args.skip:
        print('performance target', flush=True)
        record['performance'] = performance(args.device)
    record['total_seconds'] = time.perf_counter() - started
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(record, indent=1, allow_nan=False, default=lambda v: v.tolist() if hasattr(v, 'tolist') else str(v)) + '\n',
                    encoding='utf-8', newline='\n')
    print('wrote', path, f'{record["total_seconds"]:.0f}s')


if __name__ == '__main__':
    main()
