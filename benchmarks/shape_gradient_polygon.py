"""Polygon vertex-gradient convergence against fine-mesh central differences.

Run: python -m benchmarks.shape_gradient_polygon --output docs/validation/shape_gradient_polygon_3060.json
A 2D periodic dielectric pillar grating is refined at fixed physical domain,
source, duration, PML thickness and transition width. The adjoint vertex
gradient at each mesh is compared with central differences of the forward
solver at a finer mesh and the same width. Tolerances are declared below.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import time

import numpy as np
import torch

from torchfdtd import (Project, Region, Source, FieldMonitor, Boundaries, BoundaryFace,
    AdjointOptions, DifferentiablePlaneSimulation, DifferentiableSolid, smooth_geometry_epsilon)
from torchfdtd.solver import C0

# Off-grid coordinates so no vertex coincides with a Yee sample at any mesh.
VERTICES = ((-.1837, -.1512), (.1421, -.2033), (.2117, .0489), (.0231, .1908), (-.2044, .1027))
EPSILON = 4.
TOLERANCES = dict(fine_relative_l2=.03, reference_step_halving=.005, conservation=5e-4,
                  control_transmission=1e-4, control_gradient_relative=2e-3)


def make_project(mesh, precision='float32', duration_fs=60., pml_um=.24, period=.6):
    region = Region(size=(4., period, 1.), mesh=mesh, steps=100, pml_cells=round(pml_um/mesh),
        precision=precision, material_sampling='yee', boundaries=Boundaries(
            y_min=BoundaryFace(kind='periodic'), y_max=BoundaryFace(kind='periodic')))
    steps = math.ceil(duration_fs*1e-15/region.time_step)
    region = Region.model_validate(dict(region.model_dump(), steps=steps, time_step_override=duration_fs*1e-15/steps))
    return Project(region=region, sources=[Source(kind='plane', center=(-1.3, 0, 0),
        size=(0, period, 0), wavelength=1.55, pulse_cycles=1)], monitors=[
            FieldMonitor(id='T', center=(.9, 0, 0), size=(0, period, 1.)),
            FieldMonitor(id='R', center=(-.9, 0, 0), size=(0, period, 1.))])


class Grating:
    def __init__(self, mesh, width, precision, device, duration_fs=60., pml_um=.24):
        self.project = make_project(mesh, precision, duration_fs, pml_um)
        self.width, self.device = width, device
        self.dtype = getattr(torch, precision)
        self.model = DifferentiablePlaneSimulation(self.project, AdjointOptions(checkpoints=8))
        self.frequency = torch.tensor([C0/1.55e-6], device=device, dtype=self.dtype)
        with torch.no_grad():
            self.reference = self.model(torch.ones_like(self.epsilon(self.vertices())), self.frequency)

    def vertices(self, requires_grad=False):
        return torch.tensor(VERTICES, dtype=self.dtype, device=self.device, requires_grad=requires_grad)

    def epsilon(self, vertices):
        solid = DifferentiableSolid.polygon(vertices, (-1., 1.), epsilon=EPSILON)
        return smooth_geometry_epsilon(self.project.region, [solid], width=self.width, device=self.device)

    def solve(self, vertices):
        result = self.model(self.epsilon(vertices), self.frequency)
        transmission = result['T'].normalized_flux(self.reference['T']).sum()
        reflection = -result['R'].normalized_flux(self.reference['R'], subtract_incident=True).sum()
        return transmission, reflection

    def describe(self):
        r = self.project.region
        return dict(mesh_um=r.mesh, width_um=self.width, width_in_cells=self.width/r.mesh, precision=r.precision,
                    duration_fs=r.steps*r.time_step*1e15, pml_um=r.pml_cells*r.mesh, pml_cells=r.pml_cells,
                    steps=r.steps, time_step_s=r.time_step, grid=list(r.shape))


def adjoint_case(mesh, width, precision, device, duration_fs=60., pml_um=.24):
    started = time.perf_counter()
    grating = Grating(mesh, width, precision, device, duration_fs, pml_um)
    vertices = grating.vertices(requires_grad=True)
    transmission, reflection = grating.solve(vertices)
    gradient, = torch.autograd.grad(transmission, vertices)
    return dict(grating.describe(), method='checkpointed adjoint', transmission=float(transmission.detach()),
                reflection=float(reflection.detach()), conservation_error=abs(float((transmission+reflection).detach())-1),
                gradient=gradient.detach().cpu().flatten().tolist(), elapsed_seconds=time.perf_counter()-started)


def finite_difference_case(mesh, width, precision, device, step_um):
    started = time.perf_counter()
    grating = Grating(mesh, width, precision, device)
    base = grating.vertices()
    with torch.no_grad():
        transmission, reflection = grating.solve(base)
        gradient = []
        for index in range(base.numel()):
            values = []
            for sign in (1., -1.):
                shifted = base.clone().flatten()
                shifted[index] += sign*step_um
                values.append(float(grating.solve(shifted.reshape(-1, 2))[0]))
            gradient.append((values[0]-values[1])/(2*step_um))
    return dict(grating.describe(), method='central difference', step_um=step_um, transmission=float(transmission),
                reflection=float(reflection), conservation_error=abs(float(transmission+reflection)-1),
                gradient=gradient, elapsed_seconds=time.perf_counter()-started)


def sharp_case(mesh, precision, device):
    """Vanishing width reduces the fill to the staircase sampling; no gradient is defined."""
    started = time.perf_counter()
    grating = Grating(mesh, 1e-9, precision, device)
    with torch.no_grad():
        transmission, reflection = grating.solve(grating.vertices())
    return dict(grating.describe(), method='staircase forward', transmission=float(transmission),
                reflection=float(reflection), conservation_error=abs(float(transmission+reflection)-1),
                elapsed_seconds=time.perf_counter()-started)


def relative_l2(a, b):
    a, b = np.asarray(a), np.asarray(b)
    return float(np.linalg.norm(a-b)/np.linalg.norm(b))


def summarize(report):
    references = {(row['width_um'], row['step_um']): row for row in report['references']}
    checks = {}
    for width in (.08, .04):
        checks[f'reference_step_halving_{width}'] = relative_l2(references[width, .002]['gradient'], references[width, .001]['gradient']) < TOLERANCES['reference_step_halving']
    for row in report['cases']:
        reference = references[row['width_um'], .001]
        row['reference_mesh_um'] = reference['mesh_um']
        row['relative_l2_error'] = relative_l2(row['gradient'], reference['gradient'])
        row['max_component_error_over_norm'] = float(np.max(np.abs(np.array(row['gradient'])-reference['gradient']))/np.linalg.norm(reference['gradient']))
        row['cosine_similarity'] = float(np.dot(row['gradient'], reference['gradient'])/(np.linalg.norm(row['gradient'])*np.linalg.norm(reference['gradient'])))
    series = [row for row in report['cases'] if row['group'] == 'fixed_width']
    errors = [row['relative_l2_error'] for row in series]
    checks['fixed_width_errors_decrease'] = bool(errors[0] > errors[1] > errors[2])
    checks['fixed_width_fine_error'] = bool(errors[2] < TOLERANCES['fine_relative_l2'])
    narrow = [row for row in report['cases'] if row['group'] == 'narrow_width']
    checks['narrow_width_fine_error'] = bool(narrow[-1]['relative_l2_error'] < TOLERANCES['fine_relative_l2'])
    checks['conservation'] = bool(max(row['conservation_error'] for row in report['cases']+report['references']+report['sharp']) < TOLERANCES['conservation'])
    baseline = series[-1]
    for group in ('precision_control', 'duration_control', 'pml_control'):
        row = next(row for row in report['cases'] if row['group'] == group)
        row['transmission_change_from_baseline'] = abs(row['transmission']-baseline['transmission'])
        row['gradient_relative_change_from_baseline'] = relative_l2(row['gradient'], baseline['gradient'])
        checks[group] = bool(row['transmission_change_from_baseline'] < TOLERANCES['control_transmission']
                             and row['gradient_relative_change_from_baseline'] < TOLERANCES['control_gradient_relative'])
    report['checks'] = checks


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True)
    parser.add_argument('--device', default='cuda')
    args = parser.parse_args()
    cases = [('fixed_width', .04, .08, 'float32', 60., .24), ('fixed_width', .02, .08, 'float32', 60., .24),
             ('fixed_width', .01, .08, 'float32', 60., .24),
             ('narrow_width', .02, .04, 'float32', 60., .24), ('narrow_width', .01, .04, 'float32', 60., .24),
             ('precision_control', .01, .08, 'float64', 60., .24), ('duration_control', .01, .08, 'float32', 90., .24),
             ('pml_control', .01, .08, 'float32', 60., .30)]
    references = [(.005, .08, 'float64', .002), (.005, .08, 'float64', .001),
                  (.005, .04, 'float64', .002), (.005, .04, 'float64', .001)]
    report = dict(device=args.device, hardware=torch.cuda.get_device_name() if args.device == 'cuda' else 'CPU',
        torch_version=torch.__version__, driver_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        scope='2D TM periodic dielectric pentagon grating, normal incidence, nondispersive. The reference is the same '
              'regularized fill at a finer mesh, not a sharp-interface solution.',
        vertices=[list(v) for v in VERTICES], epsilon=EPSILON, objective='normalized transmitted flux at 1.55 um',
        tolerances=TOLERANCES, cases=[], references=[], sharp=[])
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)

    def save():
        path.write_text(json.dumps(report, indent=2, allow_nan=False)+'\n', encoding='utf8', newline='\n')
    for group, mesh, width, precision, duration, pml in cases:
        row = adjoint_case(mesh, width, precision, args.device, duration, pml)
        row['group'] = group
        report['cases'].append(row)
        save()
        print(json.dumps(row), flush=True)
    for mesh, width, precision, step in references:
        row = finite_difference_case(mesh, width, precision, args.device, step)
        report['references'].append(row)
        save()
        print(json.dumps(row), flush=True)
    for mesh in (.01, .005):
        row = sharp_case(mesh, 'float64', args.device)
        report['sharp'].append(row)
        save()
        print(json.dumps(row), flush=True)
    summarize(report)
    save()
    print(json.dumps(report['checks']), flush=True)
    if not all(report['checks'].values()):
        raise AssertionError(f"Shape-gradient convergence checks failed: {report['checks']}")


if __name__ == '__main__':
    main()
