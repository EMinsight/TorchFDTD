"""G7-02: refine the 2D silicon-ridge metalens from three deterministic starts and validate every final design.

The fixed declaration is docs/G7_WORKFLOWS.md (section G7-02) and docs/validation/cases/G7-02.json. The lens,
grid, source and DFT lines are those of the Meep comparison (examples/meep_comparison/metalens/geometry.json);
the lens and line builders, the observables and the focusing-efficiency definition are reused from
torchfdtd_metalens.py and metalens_common.py, which compare.py applies to the comparison records.

Design model. Each ridge is a DifferentiableSolid box whose width is a Torch parameter; smooth_geometry_epsilon
rasterizes the 33 boxes with a fixed physical transition width (TRANSITION_UM) and its bounded shape VJP carries
the adjoint epsilon gradient back to the widths. The transition width is part of the design: every validation
run rasterizes the same regularized boxes, so the 0.0125 um run refines the mesh of one physical permittivity
profile. Widths are kept inside the library range after each Adam step.

Runs. The objective is |Ez|^2 at the declared focal point (x = 0, y = focal line) at 1.55 um, relative to the
bare-cell incident intensity, through DifferentiableSimulation with an online DFT. Validation runs use
DifferentiablePlaneSimulation forwards (no gradient) with the recorded incident, focal and axis lines, whose
interpolation and time convention are those of the native plane monitors; the library design is also run
through the native Simulation to tie this path to the recorded comparison.

    python examples/g7/metalens/metalens_workflow.py --output-dir docs/validation/g7/G7-02
    python examples/g7/metalens/metalens_workflow.py --reduced --backend cpu --iterations 1 --output-dir <dir>

The first form is the declared run (CUDA, float32). --reduced builds a five-ridge lens on a coarse short grid for
the fast tests; its numbers have no meaning beyond exercising the same code.
"""
from __future__ import annotations

import argparse
import copy
import json
import math
import platform
import subprocess
import sys
import time
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
LENS = REPO / 'examples' / 'meep_comparison' / 'metalens'
for path in (str(LENS), str(REPO)):
    if path not in sys.path:
        sys.path.insert(0, path)
import metalens_common as mc  # noqa: E402
import torchfdtd_metalens as tm  # noqa: E402

import torch  # noqa: E402
import torchfdtd  # noqa: E402
from torchfdtd import (AdjointOptions, Boundaries, BoundaryFace, DifferentiablePlaneSimulation,  # noqa: E402
                       DifferentiableSimulation, Monitor, Project, Region, Simulation)
from torchfdtd.angular_spectrum import propagate_points  # noqa: E402
from torchfdtd.differentiable_geometry import DifferentiableSolid, smooth_geometry_epsilon  # noqa: E402
from torchfdtd.solver import voxelize  # noqa: E402

CASE_PATH = REPO / 'docs' / 'validation' / 'cases' / 'G7-02.json'
DESIGN_PATH = LENS / 'design_2d.json'
STARTS = ('library', 'wider', 'narrower')
TRANSITION_UM = .05          # regularized-fill transition width: two cells of the design grid, four of the fine grid
CHECKPOINTS = 32             # device checkpoints of the adjoint replay
ANGULAR_PAD = 4              # zero padding of the aperture line for the angular spectrum
MAX_PML_CELLS = 50           # Region.pml_cells limit; thicker absorbers are set per face
MAX_SNAPSHOT_INTERVAL = 10000  # Region.snapshot_interval limit
SCHEMA = 'torchfdtd-g7-02-v1'
# Numeric limits of the acceptance text of docs/validation/cases/G7-02.json (tests/test_g7_metalens.py checks that the text carries them).
LIMITS = dict(efficiency_min=.5571, mesh_efficiency=.02, mesh_axis_peak_um=.1, time_efficiency=.005, propagation_relative_l2=.05, fwhm_um=1.76)


def load_case():
    return json.loads(CASE_PATH.read_text(encoding='utf-8'))


def library_widths():
    return [row['width_um'] for row in json.loads(DESIGN_PATH.read_text(encoding='utf-8'))['library']]


def start_widths(design_widths, library, start):
    """The three declared starts: the library design, and every ridge one library step wider or narrower where one exists."""
    library = list(library)
    indices = [int(np.argmin(np.abs(np.asarray(library) - w))) for w in design_widths]
    assert all(abs(library[i] - w) < 1e-9 for i, w in zip(indices, design_widths)), 'design widths must be library widths'
    step = {'library': 0, 'wider': 1, 'narrower': -1}[start]
    return [library[min(max(i + step, 0), len(library) - 1)] for i in indices]


# ----------------------------------------------------------------------------
# Specifications: the declared lens, its grid variants and the reduced test lens
# ----------------------------------------------------------------------------
def declared_spec():
    spec = mc.load_geometry('2d')
    spec['pml_um'] = spec['pml_cells'] * spec['mesh_um']
    spec['transition_um'] = TRANSITION_UM
    return spec


def reduced_spec(ridges=5, mesh=.1, margin=1.5, run_time_fs=150.):
    """A small lens with the declared structure (central ridges of the library design, one-cycle pulse) on a short coarse grid."""
    spec = declared_spec()
    pitch = spec['pitch_um']
    half = (ridges // 2) * pitch
    aperture = ridges * pitch
    pml = .5
    sx, sy = aperture + 2 * margin + 2 * pml, 6.
    y_min = -sy / 2
    bottom = y_min + pml + .5
    top = bottom + spec['ridge_height_um']
    incident = round(y_min + round((top + .125 - y_min) / mesh) * mesh, 6)
    focal = round(y_min + round((1.2 - y_min) / mesh) * mesh, 6)
    courant = spec['courant_factor'] / math.sqrt(2)
    dt = courant * mesh * 1e-6 / mc.C0
    wave = dict(spec['source']['waveform'], pulse_cycles=1)
    spec.update(mesh_um=mesh, cell_um=[sx, sy], pml_um=pml, pml_cells=int(round(pml / mesh)), courant_number=courant, dt_s=dt,
                steps=int(round(run_time_fs * 1e-15 / dt)), aperture_um=aperture, ridges=[r for r in spec['ridges'] if abs(r['x_um']) <= half + 1e-9],
                ridge_bottom_um=bottom, ridge_top_um=top, ridge_y_center_um=bottom + spec['ridge_height_um'] / 2,
                source=dict(spec['source'], y_um=round(y_min + pml + .25, 6), x_span_um=aperture, waveform=wave),
                monitors=dict(incident=dict(y_um=incident, x_span_um=aperture), focal=dict(y_um=focal, x_span_um=sx - 2 * pml),
                              axis=dict(x_um=0., y_range_um=[incident, sy / 2 - pml])))
    spec['run_time_fs'] = spec['steps'] * dt * 1e15
    spec['transition_um'] = 2 * mesh
    spec['reduced'] = True
    return spec


def grid_variant(spec, *, mesh=None, time_factor=1.):
    """The same lens, lines and absorber thickness on another mesh and/or for a longer physical time."""
    out = copy.deepcopy(spec)
    mesh = spec['mesh_um'] if mesh is None else mesh
    ratio = spec['mesh_um'] / mesh
    out['mesh_um'] = mesh
    out['pml_cells'] = int(round(spec['pml_um'] / mesh))
    out['steps'] = int(round(spec['steps'] * ratio * time_factor))
    out['dt_s'] = spec['courant_number'] * mesh * 1e-6 / mc.C0
    out['run_time_fs'] = out['steps'] * out['dt_s'] * 1e15
    assert abs(out['pml_cells'] * mesh - spec['pml_um']) < 1e-9 and abs(spec['steps'] * ratio * time_factor - out['steps']) < 1e-6
    return out


def build(spec, *, backend, precision='float32', monitors='all'):
    """tm.build_2d without ridges; the absorber keeps its physical thickness when it needs more than 50 cells.

    The snapshot interval (unused by the adjoint path, at most 10000 in the Region model) is capped for the long fine-mesh run.
    """
    cells, steps = spec['pml_cells'], spec['steps']
    project = tm.build_2d(dict(spec, pml_cells=min(cells, MAX_PML_CELLS), steps=min(steps, MAX_SNAPSHOT_INTERVAL)), with_lens=False, backend=backend,
                          monitors=monitors)
    region = project.region.model_dump()
    region.update(precision=precision, steps=steps, snapshot_interval=min(steps, MAX_SNAPSHOT_INTERVAL))
    if cells > MAX_PML_CELLS:
        face = BoundaryFace(layers=cells)
        region['boundaries'] = Boundaries(x_min=face, x_max=face, y_min=face, y_max=face).model_dump()
    project = Project.model_validate(dict(project.model_dump(), region=Region(**region).model_dump()))
    assert project.region.steps == steps and all(project.region.pml_layers(axis, side) == cells for axis in (0, 1) for side in (0, 1))
    return project


def focal_point(spec):
    return (spec['monitors']['axis']['x_um'], spec['monitors']['focal']['y_um'], 0.)


def frequencies(spec):
    return mc.frequencies_hz(spec['frequencies'])


def centre_index(spec, wavelength=1.55):
    return spec['frequencies']['wavelengths_um'].index(wavelength)


# ----------------------------------------------------------------------------
# Geometry: ridge widths to a regularized Yee permittivity through the shape VJP
# ----------------------------------------------------------------------------
def ridge_solids(widths, spec):
    epsilon = spec['material']['index'] ** 2
    height, yc = spec['ridge_height_um'], spec['ridge_y_center_um']
    return [DifferentiableSolid.box((widths[i], height, 2.), epsilon=epsilon, center=(r['x_um'], yc, 0.))
            for i, r in enumerate(spec['ridges'])]


def epsilon_of(region, widths, spec):
    return smooth_geometry_epsilon(region, ridge_solids(widths, spec), background=1., width=spec['transition_um'])


def device_of(backend):
    return torch.device('cuda' if backend == 'cuda' else 'cpu')


def dtype_of(precision):
    return torch.float64 if precision == 'float64' else torch.float32


def synchronize(device):
    if device.type == 'cuda':
        torch.cuda.synchronize(device)


# ----------------------------------------------------------------------------
# Models
# ----------------------------------------------------------------------------
class FocalObjective:
    """|Ez|^2 at the declared focal point at 1.55 um through the discrete adjoint, relative to the bare incident intensity."""

    def __init__(self, spec, *, backend, precision='float32', checkpoints=CHECKPOINTS):
        project = build(spec, backend=backend, precision=precision, monitors='none')
        project.monitors = [Monitor(id='focus', name='focus', component='Ez', center=focal_point(spec))]
        self.model = DifferentiableSimulation(project, AdjointOptions(checkpoints=checkpoints))
        self.region = self.model.project.region
        self.spec = spec
        self.device, self.dtype = device_of(backend), dtype_of(precision)
        self.frequency = [frequencies(spec)[centre_index(spec)]]
        self.reference = None   # bare incident intensity at 1.55 um, set by the caller

    def __call__(self, widths):
        epsilon = epsilon_of(self.region, widths, self.spec)
        field = self.model.spectrum(epsilon, self.frequency).fields[0, 0]
        value = field.abs().square()
        return value / self.reference if self.reference is not None else value

    def value_and_gradient(self, widths):
        w = widths.detach().clone().requires_grad_(True)
        value = self(w)
        value.backward()
        return float(value.detach()), w.grad.detach().clone()


class _Planes:
    """Adapter from DifferentiablePlaneResult to the native field-monitor dicts that tm.observables_2d reads."""

    def __init__(self, planes, model):
        self.planes = planes
        self.plans = {identifier: plan for identifier, _, plan, _ in model.plans}

    def field_monitor(self, name):
        plane, plan = self.planes[name], self.plans[name]
        return dict(fields=plane.fields.detach().cpu().numpy().astype(np.complex128), components=list(plane.components),
                    points_um=np.asarray(plan['points_um']), weights=np.asarray(plan['weights']), shape=list(plan['shape']))


class LineModel:
    """The recorded incident, focal and axis lines of one grid, for any epsilon (forward only)."""

    def __init__(self, spec, *, backend, precision='float32'):
        self.spec = spec
        self.project = build(spec, backend=backend, precision=precision, monitors='all')
        self.model = DifferentiablePlaneSimulation(self.project, AdjointOptions(checkpoints=0))
        self.region = self.model.project.region
        self.device, self.dtype = device_of(backend), dtype_of(precision)

    def run(self, epsilon):
        synchronize(self.device)
        started = time.perf_counter()
        with torch.no_grad():
            planes = self.model(epsilon, frequencies(self.spec))
        synchronize(self.device)
        return _Planes(planes, self.model), time.perf_counter() - started

    def bare(self):
        epsilon = torch.ones((*self.region.shape, 3), device=self.device, dtype=self.dtype)
        return self.run(epsilon)

    def lens(self, widths):
        with torch.no_grad():
            epsilon = epsilon_of(self.region, torch.as_tensor(widths, device=self.device, dtype=self.dtype), self.spec)
        return self.run(epsilon)


# ----------------------------------------------------------------------------
# Observables
# ----------------------------------------------------------------------------
def side_lobe_ratio(x, intensity):
    """Largest focal-line intensity outside the main lobe (bounded by the first minima on each side of the peak) over the peak.

    The descent from the peak continues through equal samples, so a peak shared by two samples stays inside the main lobe.
    """
    values = np.asarray(intensity, dtype=np.float64)
    i = int(np.argmax(values))
    left = i
    while left > 0 and values[left - 1] <= values[left]:
        left -= 1
    right = i
    while right < len(values) - 1 and values[right + 1] <= values[right]:
        right += 1
    outside = np.r_[values[:left], values[right + 1:]]
    return dict(ratio=float(outside.max() / values[i]) if len(outside) else 0., main_lobe_um=[float(x[left]), float(x[right])])


def line_observables(lens, bare, spec):
    """tm.observables_2d (the comparison's reductions) plus the side-lobe ratio, at every wavelength."""
    obs = tm.observables_2d(lens, bare, spec)
    for k, row in enumerate(obs['summary']):
        row['side_lobe'] = side_lobe_ratio(obs['focal']['x_um'], np.asarray(obs['focal']['intensity'])[k])
    return obs


def centre_row(obs, spec):
    return obs['summary'][centre_index(spec)]


def compact_lines(obs, spec):
    """Focal-line and axial intensity at 1.55 um only (the full-band arrays are summarized, not stored)."""
    k = centre_index(spec)
    return dict(focal_x_um=obs['focal']['x_um'], focal_intensity=obs['focal']['intensity'][k], focal_poynting_y=obs['focal']['poynting_y'][k],
                axis_y_um=obs['axis']['y_um'], axis_intensity=obs['axis']['intensity'][k])


def wide_line_spec(spec):
    """The same grid with the aperture line widened to the whole interior (information: the effect of truncating the line)."""
    out = copy.deepcopy(spec)
    out['monitors']['incident']['x_span_um'] = spec['monitors']['focal']['x_span_um']
    return out


def angular_spectrum_check(lens, bare, obs, spec):
    """Propagate the lens aperture-line Ez to the focal and axis lines; bare and obs are those of the recorded lines."""
    k = centre_index(spec)
    plane = lens.planes['incident']
    device = plane.fields.device
    f, c, _, _, _ = tm.plane_arrays(bare.field_monitor('incident'))
    incident_intensity = float(np.mean(np.abs(f[k, :, c.index('Ez')]) ** 2))
    focal_x = np.asarray(obs['focal']['x_um'])
    axis_y = np.asarray(obs['axis']['y_um'])
    focal_points = np.stack([focal_x, np.full_like(focal_x, spec['monitors']['focal']['y_um']), np.zeros_like(focal_x)], -1)
    axis_points = np.stack([np.full_like(axis_y, spec['monitors']['axis']['x_um']), axis_y, np.zeros_like(axis_y)], -1)
    started = time.perf_counter()
    with torch.no_grad():
        values = {}
        for name, points in (('focal', focal_points), ('axis', axis_points)):
            result = propagate_points(plane, torch.as_tensor(points, device=device), components=('Ez',), pad=ANGULAR_PAD, point_chunk=64)
            values[name] = (result.fields[k, :, 0].abs().square().double().cpu().numpy() / incident_intensity)
    seconds = time.perf_counter() - started
    direct_focal = np.asarray(obs['focal']['intensity'])[k]
    direct_axis = np.asarray(obs['axis']['intensity'])[k]
    def rel_l2(a, b):
        return float(np.linalg.norm(a - b) / np.linalg.norm(b))
    y_prop, _ = mc.peak_parabolic(axis_y, values['axis'])
    y_direct, _ = mc.peak_parabolic(axis_y, direct_axis)
    return dict(method=f'angular spectrum (torchfdtd.angular_spectrum.propagate_points) of the complex Ez on the aperture line y = '
                       f"{spec['monitors']['incident']['y_um']} um (the recorded incident line, {spec['monitors']['incident']['x_span_um']} um wide) "
                       f'from the design-grid lens run, zero padding {ANGULAR_PAD}, air; intensities relative to the bare incident intensity',
                wavelength_um=spec['frequencies']['wavelengths_um'][k], pad=ANGULAR_PAD, seconds=seconds,
                focal_relative_l2=rel_l2(values['focal'], direct_focal), axis_relative_l2=rel_l2(values['axis'], direct_axis),
                axis_peak_y_um=dict(propagated=y_prop, direct=y_direct, difference=abs(y_prop - y_direct)),
                focal_peak=dict(propagated=float(values['focal'].max()), direct=float(direct_focal.max())),
                propagated_focal_intensity=mc.as_list(values['focal']), propagated_axis_intensity=mc.as_list(values['axis']))


# ----------------------------------------------------------------------------
# The workflow
# ----------------------------------------------------------------------------
def environment(device):
    try:
        commit = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=REPO, capture_output=True, text=True, timeout=30, check=True).stdout.strip()
        dirty = bool(subprocess.run(['git', 'status', '--porcelain', '--untracked-files=no'], cwd=REPO, capture_output=True, text=True, timeout=30,
                                    check=True).stdout.strip())
    except (OSError, subprocess.SubprocessError):
        commit, dirty = None, None
    return dict(python=platform.python_version(), torch=torch.__version__, cuda=torch.version.cuda, numpy=np.__version__, platform=platform.platform(),
                device=torch.cuda.get_device_name(device) if device.type == 'cuda' else platform.processor() or 'cpu',
                torchfdtd_file=torchfdtd.__file__, commit=commit, tracked_changes=dirty, gpu=mc.nvidia_smi() if device.type == 'cuda' else None)


def design_summary(row):
    keys = ('axis_peak_y_um', 'axis_peak_intensity', 'focal_plane_peak_x_um', 'focal_plane_peak_intensity', 'fwhm_um', 'efficiency', 'transmission')
    out = {k: row[k] for k in keys}
    out['side_lobe_ratio'] = row['side_lobe']['ratio']
    return out


def refine(objective, widths, *, iterations, learning_rate, bounds, log=print):
    """Adam on the ridge widths (um); the objective is maximized; widths are clipped to the library range after each step."""
    parameters = torch.nn.Parameter(torch.as_tensor(widths, device=objective.device, dtype=objective.dtype).clone())
    optimizer = torch.optim.Adam([parameters], lr=learning_rate)
    history = []
    for iteration in range(iterations):
        synchronize(objective.device)
        started = time.perf_counter()
        optimizer.zero_grad()
        value = objective(parameters)
        (-value).backward()
        gradient = parameters.grad.detach().cpu().double().numpy()
        before = parameters.detach().cpu().double().numpy()
        optimizer.step()
        with torch.no_grad():
            parameters.clamp_(*bounds)
        synchronize(objective.device)
        history.append(dict(iteration=iteration, objective=float(value.detach()), widths_um=mc.as_list(before, 9),
                            gradient_per_um=mc.as_list(gradient, 7), seconds=time.perf_counter() - started))
        log(f'  iteration {iteration}: focal intensity {history[-1]["objective"]:.5f} ({history[-1]["seconds"]:.1f} s)')
    return parameters.detach(), history


def finite_difference_check(objective, widths, *, steps):
    """Adjoint derivative of the objective against central differences for the ridge with the largest adjoint derivative.

    The cubic transition makes the central difference carry a truncation error of order (step / transition)^2, and float32
    rounding of the objective grows as the step shrinks, so several steps are reported.
    """
    base = torch.as_tensor(widths, device=objective.device, dtype=objective.dtype)
    value, gradient = objective.value_and_gradient(base)
    ridge = int(torch.argmax(gradient.abs()))
    adjoint = float(gradient[ridge])
    rows = []
    for step in steps:
        values = []
        for sign in (1., -1.):
            shifted = base.clone()
            shifted[ridge] += sign * step
            with torch.no_grad():
                values.append(float(objective(shifted)))
        central = (values[0] - values[1]) / (2 * step)
        rows.append(dict(step_um=step, central_difference_per_um=central, relative_difference=abs(adjoint - central) / abs(central)))
    return dict(ridge=ridge, x_um=objective.spec['ridges'][ridge]['x_um'], width_um=float(base[ridge]), objective=value, adjoint_per_um=adjoint,
                precision=str(objective.dtype).replace('torch.', ''), central_differences=rows)


def run(*, spec, backend='cuda', iterations=None, learning_rate=None, starts=STARTS, output_dir=None, fd_steps=(.004, .002, .001), log=print):
    case = load_case()
    refinement = case['fixture']['refinement']
    iterations = refinement['iterations'] if iterations is None else iterations
    learning_rate = refinement['learning_rate_um'] if learning_rate is None else learning_rate
    device = device_of(backend)
    env = environment(device)   # the commit and tree state the run loaded, before any later edit
    started_all = time.perf_counter()
    library = library_widths()
    bounds = (min(library), max(library))
    design = [r['width_um'] for r in spec['ridges']]
    fine = round(case['fixture']['validation']['fine_mesh_um'] * spec['mesh_um'] / case['fixture']['mesh_um'], 12)
    variants = dict(design_grid=spec, fine_mesh=grid_variant(spec, mesh=fine),
                    longer_time=grid_variant(spec, time_factor=case['fixture']['validation']['longer_time_factor']))
    # Bare cells: the normalization of every run of that grid.
    lines, bare, walls = {}, {}, {}
    for name, variant in variants.items():
        log(f'bare cell {name}: mesh {variant["mesh_um"]} um, {variant["steps"]} steps')
        lines[name] = LineModel(variant, backend=backend)
        bare[name], walls[f'bare_{name}'] = lines[name].bare()
    wide = LineModel(wide_line_spec(spec), backend=backend)
    k = centre_index(spec)
    f, c, _, _, _ = tm.plane_arrays(bare['design_grid'].field_monitor('incident'))
    incident_intensity = float(np.mean(np.abs(f[k, :, c.index('Ez')]) ** 2))
    objective = FocalObjective(spec, backend=backend)
    objective.reference = incident_intensity
    # Tie the plane path to the recorded comparison: the staircase library design through both forwards.
    log('library design, staircase: native Simulation and DifferentiablePlaneSimulation')
    native_project = tm.build_2d(spec, with_lens=True, backend=backend)
    native_bare = Simulation(tm.build_2d(spec, with_lens=False, backend=backend)).run()
    native_lens = Simulation(native_project).run()
    native_row = centre_row(line_observables(native_lens, native_bare, spec), spec)
    staircase = torch.as_tensor(voxelize(native_project)[0], device=device, dtype=torch.float32)
    plane_lens, _ = lines['design_grid'].run(staircase)
    plane_row = centre_row(line_observables(plane_lens, bare['design_grid'], spec), spec)
    consistency = dict(note='library design with staircase ridges (voxelize), design grid, 1.55 um: native Simulation against the '
                            'DifferentiablePlaneSimulation forward used for every validation below',
                       native=design_summary(native_row), plane_forward=design_summary(plane_row),
                       efficiency_difference=abs(native_row['efficiency'] - plane_row['efficiency']),
                       axis_peak_difference_um=abs(native_row['axis_peak_y_um'] - plane_row['axis_peak_y_um']),
                       recorded_comparison_efficiency=case['baseline']['focusing_efficiency'])
    log(f'  native efficiency {native_row["efficiency"]:.6f}, plane forward {plane_row["efficiency"]:.6f}')
    log('finite-difference check of the shape gradient (library start)')
    gradient_check = finite_difference_check(objective, start_widths(design, library, 'library'), steps=fd_steps)
    log(f'  ridge {gradient_check["ridge"]}: adjoint {gradient_check["adjoint_per_um"]:.6g}, central '
        + ', '.join(f'{r["central_difference_per_um"]:.6g} (step {r["step_um"]})' for r in gradient_check['central_differences']))
    records = []
    for start in starts:
        log(f'start {start}')
        initial = start_widths(design, library, start)
        t0 = time.perf_counter()
        final, history = refine(objective, initial, iterations=iterations, learning_rate=learning_rate, bounds=bounds, log=log)
        refine_seconds = time.perf_counter() - t0
        with torch.no_grad():
            final_objective = float(objective(final))
        final_widths = final.cpu().double().numpy()
        evaluations, lines_1550, run_seconds = {}, {}, {}
        observed = {}
        for name in variants:
            planes, run_seconds[name] = lines[name].lens(final_widths)
            obs = line_observables(planes, bare[name], variants[name])
            observed[name] = (planes, obs)
            evaluations[name] = dict(summary=obs['summary'], transmission=obs['incident']['transmission'])
            lines_1550[name] = compact_lines(obs, variants[name])
            log(f'  {name}: efficiency {centre_row(obs, variants[name])["efficiency"]:.5f}, axis peak {centre_row(obs, variants[name])["axis_peak_y_um"]:.4f} um')
        planes, obs = observed['design_grid']
        propagation = angular_spectrum_check(planes, bare['design_grid'], obs, spec)
        wide_planes, _ = wide.lens(final_widths)
        propagation['full_width_line'] = angular_spectrum_check(wide_planes, bare['design_grid'], obs, wide.spec)
        for key in ('propagated_focal_intensity', 'propagated_axis_intensity'):
            propagation['full_width_line'].pop(key)
        propagation['full_width_line']['note'] = 'information only: the aperture line widened to the interior, direct lines and normalization unchanged'
        log(f'  angular spectrum: focal-line relative L2 {propagation["focal_relative_l2"]:.4f} '
            f'(full-width line {propagation["full_width_line"]["focal_relative_l2"]:.4f})')
        initial_planes, initial_seconds = lines['design_grid'].lens(np.asarray(initial))
        initial_obs = line_observables(initial_planes, bare['design_grid'], spec)
        t, fine, longer = (centre_row(observed[n][1], variants[n]) for n in ('design_grid', 'fine_mesh', 'longer_time'))
        record = dict(schema=SCHEMA, case_id='G7-02', start=start, reduced=bool(spec.get('reduced')), iterations=iterations, learning_rate_um=learning_rate,
                      width_bounds_um=list(bounds), transition_um=spec['transition_um'],
                      ridges_x_um=[r['x_um'] for r in spec['ridges']], initial_widths_um=list(initial), final_widths_um=mc.as_list(final_widths, 9),
                      widths_at_bounds=int(np.sum((final_widths <= bounds[0] + 1e-7) | (final_widths >= bounds[1] - 1e-7))),
                      history=history, final_objective=final_objective,
                      initial_design=dict(design_grid=design_summary(centre_row(initial_obs, spec)), seconds=initial_seconds),
                      final_design={n: design_summary(centre_row(observed[n][1], variants[n])) for n in variants},
                      final_design_all_wavelengths=evaluations,
                      checks=dict(mesh_efficiency_change=abs(fine['efficiency'] - t['efficiency']), mesh_axis_peak_change_um=abs(fine['axis_peak_y_um'] - t['axis_peak_y_um']),
                                  time_efficiency_change=abs(longer['efficiency'] - t['efficiency']), propagation_focal_relative_l2=propagation['focal_relative_l2']),
                      propagation=propagation, lines_1550=lines_1550,
                      seconds=dict(refinement=refine_seconds, **{f'validation_{n}': s for n, s in run_seconds.items()}))
        record = finite_or_none(record)
        records.append(record)
        if output_dir is not None:
            write_json(Path(output_dir) / f'start-{start}.json', record)
    summary = judge(records, case, spec)
    summary.update(schema=SCHEMA, case_id='G7-02', reduced=bool(spec.get('reduced')), date=time.strftime('%Y-%m-%d'), environment=env,
                   design=dict(transition_um=spec['transition_um'], width_bounds_um=list(bounds), checkpoints=CHECKPOINTS, optimizer='torch.optim.Adam, default betas',
                               objective=f'|Ez|^2 at (x, y) = {focal_point(spec)[:2]} um, 1.55 um, relative to the bare-cell mean incident |Ez|^2 '
                                         f'({incident_intensity:.6g} reduced units) through DifferentiableSimulation.spectrum'),
                   grids={n: dict(mesh_um=v['mesh_um'], steps=v['steps'], pml_cells=v['pml_cells'], pml_um=v['pml_um'], run_time_fs=v['run_time_fs'],
                                  shape=list(lines[n].region.shape)) for n, v in variants.items()},
                   consistency=consistency, gradient_check=gradient_check,
                   wall_seconds=dict(total=time.perf_counter() - started_all, **walls, **{f'start_{r["start"]}': sum(r['seconds'].values()) for r in records}),
                   records=[f'start-{r["start"]}.json' for r in records])
    summary = finite_or_none(summary)
    if output_dir is not None:
        write_json(Path(output_dir) / 'summary.json', summary)
    return summary, records


def judge(records, case, spec):
    """Every declared criterion with its value, limit and verdict; (c) to (e) apply to every start's final design."""
    acc = case['acceptance']
    assert LIMITS['efficiency_min'] == case['baseline']['focusing_efficiency']
    limits = dict(efficiency=LIMITS['efficiency_min'], mesh_efficiency=LIMITS['mesh_efficiency'], mesh_axis_peak_um=LIMITS['mesh_axis_peak_um'],
                  time_efficiency=LIMITS['time_efficiency'], propagation=LIMITS['propagation_relative_l2'], fwhm_um=LIMITS['fwhm_um'])
    by_start = {r['start']: r for r in records}
    best = max(records, key=lambda r: -math.inf if r['final_design']['design_grid']['efficiency'] is None else r['final_design']['design_grid']['efficiency'])

    def at_most(value, limit):
        return value is not None and value <= limit

    def at_least(value, limit):
        return value is not None and value >= limit
    rows = [
        dict(id='a', criterion=acc['all_starts'], value=sorted(by_start), limit=sorted(STARTS), passed=sorted(by_start) == sorted(STARTS)),
        dict(id='b', criterion=acc['performance'], value=best['final_design']['design_grid']['efficiency'], best_start=best['start'], limit=limits['efficiency'],
             comparison='>=', passed=at_least(best['final_design']['design_grid']['efficiency'], limits['efficiency']),
             all_starts={s: r['final_design']['design_grid']['efficiency'] for s, r in by_start.items()}),
        dict(id='c', criterion=acc['mesh'], value=dict(efficiency={s: r['checks']['mesh_efficiency_change'] for s, r in by_start.items()},
                                                       axis_peak_um={s: r['checks']['mesh_axis_peak_change_um'] for s, r in by_start.items()}),
             limit=dict(efficiency=limits['mesh_efficiency'], axis_peak_um=limits['mesh_axis_peak_um']), comparison='<=',
             passed=all(at_most(r['checks']['mesh_efficiency_change'], limits['mesh_efficiency'])
                        and at_most(r['checks']['mesh_axis_peak_change_um'], limits['mesh_axis_peak_um']) for r in records)),
        dict(id='d', criterion=acc['time'], value={s: r['checks']['time_efficiency_change'] for s, r in by_start.items()}, limit=limits['time_efficiency'],
             comparison='<=', passed=all(at_most(r['checks']['time_efficiency_change'], limits['time_efficiency']) for r in records)),
        dict(id='e', criterion=acc['propagation'], value={s: r['checks']['propagation_focal_relative_l2'] for s, r in by_start.items()}, limit=limits['propagation'],
             comparison='<=', passed=all(at_most(r['checks']['propagation_focal_relative_l2'], limits['propagation']) for r in records)),
        dict(id='f', criterion=acc['psf'], value=best['final_design']['design_grid']['fwhm_um'], best_start=best['start'], limit=limits['fwhm_um'], comparison='<=',
             passed=at_most(best['final_design']['design_grid']['fwhm_um'], limits['fwhm_um']),
             all_starts={s: r['final_design']['design_grid']['fwhm_um'] for s, r in by_start.items()}),
        dict(id='scope', criterion=acc['scope'], value=f'every reported number comes from a full-aperture {len(spec["ridges"])}-ridge run; '
                                                         'the unit-cell library only supplies the start widths', passed=True),
    ]
    return dict(criteria=rows, all_pass=all(r['passed'] for r in rows), best_start=best['start'])


def time_study(spec, output_dir, *, backend='cuda', factors=(1., 1.5, 2., 3., 4.), log=print):
    """Information, not a criterion: the recorded designs on the design grid against the physical run time.

    Reads the records of a finished run in output_dir and evaluates every start's initial and final widths and the
    staircase library design (the recorded comparison baseline) at multiples of the declared window, each with its
    own bare cell. Writes time_convergence.json next to the records.
    """
    output_dir = Path(output_dir)
    summary = json.loads((output_dir / 'summary.json').read_text(encoding='utf-8'))
    records = [json.loads((output_dir / name).read_text(encoding='utf-8')) for name in summary['records']]
    device = device_of(backend)
    env = environment(device)
    staircase = torch.as_tensor(voxelize(tm.build_2d(spec, with_lens=True, backend=backend))[0], device=device, dtype=torch.float32)
    designs = {'library staircase': None}
    for record in records:
        designs[f"{record['start']} initial"] = record['initial_widths_um']
        designs[f"{record['start']} final"] = record['final_widths_um']
    started = time.perf_counter()
    rows = []
    for factor in factors:
        variant = grid_variant(spec, time_factor=factor)
        lines = LineModel(variant, backend=backend)
        bare, _ = lines.bare()
        for name, widths in designs.items():
            planes, _ = lines.run(staircase) if widths is None else lines.lens(widths)
            row = centre_row(line_observables(planes, bare, variant), variant)
            rows.append(dict(design=name, time_factor=factor, steps=variant['steps'], run_time_fs=variant['run_time_fs'], **design_summary(row)))
            log(f"  {name}, {factor} x time: efficiency {row['efficiency']:.5f}, focal peak {row['focal_plane_peak_intensity']:.4f}")
    result = finite_or_none(dict(schema=SCHEMA, case_id='G7-02', reduced=bool(spec.get('reduced')), date=time.strftime('%Y-%m-%d'),
                                 note='information only, after the judged run: the recorded widths (regularized fill) and the staircase library design '
                                      'on the design grid for multiples of the declared window; no criterion is evaluated here',
                                 environment=env, records=summary['records'], transition_um=spec['transition_um'], factors=list(factors),
                                 rows=rows, wall_seconds=time.perf_counter() - started))
    write_json(output_dir / 'time_convergence.json', result)
    return result


def finite_or_none(value):
    """Records hold JSON numbers only: a non-finite value (a profile that never crosses half maximum) is recorded as null and fails its criterion."""
    if isinstance(value, float) and not math.isfinite(value):
        return None
    if isinstance(value, dict):
        return {k: finite_or_none(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [finite_or_none(v) for v in value]
    return value


def write_json(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes((json.dumps(payload, indent=1, allow_nan=False) + '\n').encode('utf-8'))


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--backend', choices=('cuda', 'cpu'), default='cuda')
    parser.add_argument('--reduced', action='store_true', help='five-ridge lens on a coarse short grid (tests only)')
    parser.add_argument('--iterations', type=int, default=None, help='Adam iterations (default: the declared 20)')
    parser.add_argument('--starts', nargs='*', choices=STARTS, default=list(STARTS))
    parser.add_argument('--output-dir', default=None)
    parser.add_argument('--time-study', action='store_true',
                        help='information only: evaluate the records in --output-dir at several run times (writes time_convergence.json)')
    args = parser.parse_args(argv)
    spec = reduced_spec() if args.reduced else declared_spec()
    if args.time_study:
        return time_study(spec, args.output_dir, backend=args.backend)
    summary, _ = run(spec=spec, backend=args.backend, iterations=args.iterations, starts=args.starts, output_dir=args.output_dir)
    print(json.dumps(dict(all_pass=summary['all_pass'], criteria=[{k: r.get(k) for k in ('id', 'value', 'limit', 'passed')} for r in summary['criteria']]), indent=1))
    return summary


if __name__ == '__main__':
    main()
