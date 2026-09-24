"""G7-03: fabrication-aware density design of the offset-guide mode coupler from three declared seeds.

The device is the coupler of examples/design_mode_coupler.py: two slab guides of epsilon 4 in a
cladding of 2.25, 0.6 um wide and offset by 0.6 um, a fixed-mode port on each guide (ModeNetwork),
and a 6 by 10 pixel design box of 0.2 um under a 180-degree rotation symmetry. The declaration is
docs/G7_WORKFLOWS.md (section G7-03) with docs/validation/cases/G7-03.json; the fixed quantities
below are copied from there. For every seed the workflow

  1. checks the adjoint derivative of |S21|^2 at 1.55 um with respect to the design logits against
     central finite differences at three pixels of the start design;
  2. maximizes |S21|^2 at 1.55 um at the 0.05 um mesh from logits 0.5 randn(seed);
  3. thresholds the design, measures its minimum linewidth and gap against the declared 0.4 um, and
     evaluates the design eroded and dilated by 0.1 um on a 0.05 um sub-pixel grid;
  4. exports the binary design as native rectangles and GDS, re-imports both, and evaluates the
     full 2 x 2 modal S matrix with phases at 1.50, 1.55 and 1.60 um for the binary density, the
     pre-export rectangles and the re-imported GDS polygons (1.50 um is held out, never optimized);
  5. evaluates the re-imported GDS design again at the 0.025 um mesh over the same physical time.

judge() evaluates the seven acceptance criteria of the case from the seed records.

Judged run (CUDA, float32):
    python -m examples.g7.coupler.workflow --output-dir docs/validation/g7/G7-03
Reduced mechanics run (CPU, a few minutes, never judged):
    python -m examples.g7.coupler.workflow --reduced --seeds 1 --output-dir <scratch>
"""
import argparse
import cmath
from dataclasses import asdict, dataclass, replace
import hashlib
import json
import math
from pathlib import Path
import platform
import subprocess
import time

import numpy as np
import torch

from examples import design_mode_coupler as base
from torchfdtd.design_parameterization import DensityParameterization
from torchfdtd.design_problem import Continuation, DesignProblem
from torchfdtd.fabrication import binary_structures, fabrication_perturbation, measure_feature_sizes

ROOT = Path(__file__).resolve().parents[3]
CASE = 'docs/validation/cases/G7-03.json'
SEEDS = (1, 2, 3)
WAVELENGTHS_UM = (1.5, 1.55, 1.6)
DESIGN_UM, HOLDOUT_UM = base.WAVELENGTH_UM, base.HOLDOUT_UM
MIN_FEATURE_UM = .4           # declared minimum linewidth and minimum gap
EROSION_UM = .1               # declared erosion and dilation
SUBPIXEL = 4                  # the 0.1 um perturbation acts on a grid of 0.05 um, a quarter pixel
LIMITS = dict(performance=.6136, passivity=1.01, reciprocity=1e-3, gradient=.02, gds=.005, mesh=.02)


@dataclass(frozen=True)
class Settings:
    """Workflow parameters. mesh_um and check_mesh_um are declared; the others are workflow choices
    fixed before the judged run on development seeds 11 to 13, never on the declared seeds: steps
    keep the physical time of G6's 500 steps at 0.2 um; a filter radius of 0.6 um was the only one
    of 0.4, 0.6 and 0.8 um whose designs met the 0.4 um linewidth and gap (0.5 um gave the same
    design as 0.6 um); the central-difference step 0.02 agreed with the adjoint within 1.1e-4."""
    mesh_um: float = .05
    steps: int = 2000
    check_mesh_um: float = .025
    check_steps: int = 4000
    iterations: int = 50
    beta: float = 4.
    continuation_every: int = 10
    beta_maximum: float = 64.
    learning_rate: float = .1
    filter_radius_um: float = .6
    fd_step: float = .02
    fd_pixels: int = 3
    device: str = 'cuda'
    reduced: bool = False


# G6's mesh and physical time; exercises every stage on the CPU, judges nothing.
REDUCED = Settings(mesh_um=.2, steps=500, check_mesh_um=.1, check_steps=1000, iterations=2, device='cpu', reduced=True)


class Coupler(base.CouplerForward):
    """The two-port network of the coupler at one mesh, step count and wavelength, on one device.

    The design density stays wherever the parameterization lives and moves to the network device
    inside epsilon(), so the parameterization, fabrication checks and export remain on the CPU.
    """
    def __init__(self, mesh_um, steps, wavelength_um, device='cpu'):
        super().__init__(mesh_um, steps, wavelength_um)
        self.base = self.base.to(device)
        self.wavelength_um = wavelength_um

    def epsilon(self, density):
        return super().epsilon(density.to(self.base.device))

    @torch.no_grad()
    def s_density(self, density):
        return self.network(self.epsilon(density)).s

    @torch.no_grad()
    def s_structures(self, structures):
        return self.network(self.structure_epsilon(structures)).s


def s_record(s):
    """The 2 x 2 modal S[out, in] (port 1 = left guide, port 2 = right guide) with its checks.

    Each entry is recorded as real and imaginary part, power and phase (radians, at the port phase
    planes of ModeNetwork). column_power holds |S11|^2 + |S21|^2 and |S22|^2 + |S12|^2 (passivity),
    reciprocity is |S21 - S12|.
    """
    values = s.detach().cpu().to(torch.complex128).numpy()
    if values.shape != (2, 2) or not np.isfinite(values).all():
        raise ValueError('Expected one finite 2 x 2 S matrix.')
    record = {}
    for name, (row, column) in dict(S11=(0, 0), S21=(1, 0), S12=(0, 1), S22=(1, 1)).items():
        value = complex(values[row, column])
        record[name] = dict(real=value.real, imag=value.imag, power=abs(value)**2, phase_rad=cmath.phase(value))
    record['column_power'] = [float(np.sum(np.abs(values[:, 0])**2)), float(np.sum(np.abs(values[:, 1])**2))]
    record['reciprocity'] = float(abs(values[1, 0]-values[0, 1]))
    record['transmission'] = record['S21']['power']
    return record


def build_problem(seed, settings, objective):
    """The declared start (logits 0.5 randn from torch.Generator().manual_seed(seed), as in G6) and schedule."""
    initial = .5*torch.randn(base.PIXELS, generator=torch.Generator().manual_seed(seed))
    design = DensityParameterization(base.PIXELS, spacing_um=base.PIXEL_UM, initial=initial, mode='logits',
                                     filter_radius_um=settings.filter_radius_um, boundary='truncate', symmetry='rotate180',
                                     beta=settings.beta, eta=.5)
    optimizer = torch.optim.Adam(design.parameters(), lr=settings.learning_rate)
    return DesignProblem(design, objective, optimizer, name=f'g7-coupler-seed{seed}',
                         continuation=Continuation(every=settings.continuation_every, factor=2., maximum=settings.beta_maximum))


def orbit(pixel):
    """Representative of a pixel's orbit under the 180-degree rotation of the design box."""
    image = (base.PIXELS[0]-1-pixel[0], base.PIXELS[1]-1-pixel[1])
    return min(tuple(pixel), image)


def gradient_check(problem, model, settings):
    """Adjoint derivative of |S21|^2 against central finite differences at the current design logits.

    The pixels are the settings.fd_pixels largest adjoint magnitudes taken from distinct rotation
    orbits (a fixed rule: a relative comparison needs derivatives above the float32 floor). The
    logits are restored exactly afterwards and the gradients cleared.
    """
    design = problem.parameterization
    logits = design.design.detach().clone()

    def transmission():
        return model.network(model.epsilon(design())).s[1, 0].abs().square()
    started = time.perf_counter()
    design.zero_grad(set_to_none=True)
    value = transmission()
    value.backward()
    adjoint = design.design.grad.detach().clone()
    design.zero_grad(set_to_none=True)
    order = torch.argsort(adjoint.abs().reshape(-1), descending=True).tolist()
    pixels, orbits = [], set()
    for flat in order:
        pixel = divmod(flat, base.PIXELS[1])
        if orbit(pixel) not in orbits:
            orbits.add(orbit(pixel))
            pixels.append(pixel)
        if len(pixels) == settings.fd_pixels:
            break
    rows = []
    for pixel in pixels:
        values = []
        for sign in (1, -1):
            with torch.no_grad():
                design.design.copy_(logits)
                design.design[pixel] += sign*settings.fd_step
                values.append(float(transmission()))
        with torch.no_grad():
            design.design.copy_(logits)
        finite = (values[0]-values[1])/(2*settings.fd_step)
        derivative = float(adjoint[pixel])
        rows.append(dict(pixel=list(pixel), adjoint=derivative, finite_difference=finite, transmission_plus=values[0],
                         transmission_minus=values[1], relative_error=abs(derivative-finite)/abs(finite)))
    assert torch.equal(design.design.detach(), logits)
    return dict(variable='design logits (optimization variables) at the start design', quantity='|S21|^2 at 1.55 um',
                step=settings.fd_step, beta=float(design.beta), transmission=float(value.detach()), pixel_rule=(
                    f'the {settings.fd_pixels} largest adjoint magnitudes from distinct rotation orbits'),
                pixels=rows, max_relative_error=max(r['relative_error'] for r in rows), wall_time_s=time.perf_counter()-started)


def perturbed_designs(binary):
    """The binary design eroded and dilated by EROSION_UM on the sub-pixel grid (extended box edges)."""
    fine = np.kron(np.asarray(binary, dtype=bool), np.ones((SUBPIXEL, SUBPIXEL), dtype=bool))
    eroded, dilated, realized = fabrication_perturbation(fine, EROSION_UM, base.PIXEL_UM/SUBPIXEL, boundary='extend')
    return fine, eroded, dilated, realized


def structures_of(fine, name):
    return binary_structures(fine, origin_um=(base.BOX_UM[0], base.BOX_UM[2]), spacing_um=base.PIXEL_UM/SUBPIXEL,
                             z_min_um=-base.SLAB_UM/2, z_max_um=base.SLAB_UM/2, material=base.MATERIAL, id_prefix=name)


def _sync(settings):
    if torch.device(settings.device).type == 'cuda':
        torch.cuda.synchronize()


class Models:
    """The networks of every wavelength at the design mesh and at the check mesh, shared by all seeds."""
    def __init__(self, settings):
        started = time.perf_counter()
        self.design = {w: Coupler(settings.mesh_um, settings.steps, w, settings.device) for w in WAVELENGTHS_UM}
        self.check = {w: Coupler(settings.check_mesh_um, settings.check_steps, w, settings.device) for w in WAVELENGTHS_UM}
        self.wall_time_s = time.perf_counter()-started


def run_seed(seed, settings, models, export_dir):
    """Gradient check, optimization, fabrication, export and every evaluation of one declared seed."""
    started = time.perf_counter()
    times = {}
    problem = build_problem(seed, settings, models.design[DESIGN_UM].objective)
    gradient = gradient_check(problem, models.design[DESIGN_UM], settings)
    _sync(settings)
    times['gradient_check'] = gradient['wall_time_s']
    mark = time.perf_counter()
    history = problem.run(settings.iterations)
    _sync(settings)
    times['optimization'] = time.perf_counter()-mark

    smooth, binary = problem.density(), problem.density(hard=True)
    sizes = measure_feature_sizes(binary, base.PIXEL_UM, boundary='extend')
    violations = sizes.violations(min_linewidth_um=MIN_FEATURE_UM, min_gap_um=MIN_FEATURE_UM)
    exported = problem.export(Path(export_dir)/f'seed{seed}', origin_um=(base.BOX_UM[0], base.BOX_UM[2]),
                              spacing_um=base.PIXEL_UM, z_min_um=-base.SLAB_UM/2, z_max_um=base.SLAB_UM/2,
                              material=base.MATERIAL)
    reimported = problem.reimport(exported)
    fine, eroded, dilated, realized = perturbed_designs(binary.numpy())
    shapes = dict(eroded=structures_of(eroded, f'seed{seed}-eroded'), dilated=structures_of(dilated, f'seed{seed}-dilated'))

    mark = time.perf_counter()
    evaluations = {name: {} for name in ('smooth_density', 'binary_density', 'structures', 'gds', 'eroded', 'dilated',
                                         'gds_check_mesh')}
    for wavelength in WAVELENGTHS_UM:
        key = f'{wavelength:.2f}'
        model = models.design[wavelength]
        evaluations['smooth_density'][key] = s_record(model.s_density(smooth))
        evaluations['binary_density'][key] = s_record(model.s_density(binary))
        evaluations['structures'][key] = s_record(model.s_structures(exported['structures']))
        evaluations['gds'][key] = s_record(model.s_structures(reimported['gds_structures']))
        for name, structures in shapes.items():
            evaluations[name][key] = s_record(model.s_structures(structures))
        evaluations['gds_check_mesh'][key] = s_record(models.check[wavelength].s_structures(reimported['gds_structures']))
    _sync(settings)
    times['evaluation'] = time.perf_counter()-mark
    design_key = f'{DESIGN_UM:.2f}'
    transmission = {name: {key: value['transmission'] for key, value in stage.items()} for name, stage in evaluations.items()}
    nominal = transmission['structures'][design_key]
    fabrication = dict(
        feature_sizes=sizes.report(), declared=dict(min_linewidth_um=MIN_FEATURE_UM, min_gap_um=MIN_FEATURE_UM,
                                                    erosion_dilation_um=EROSION_UM, boundary='extend'),
        violations=list(violations), satisfies_declared_constraints=not violations,
        enforcement=f'conic filter radius {settings.filter_radius_um} um with tanh projection to beta {settings.beta_maximum}, '
                    'then this morphological check of the thresholded design',
        perturbation=dict(realized_um=realized, grid_um=base.PIXEL_UM/SUBPIXEL, operation='digital-square erosion and dilation',
                          nominal_transmission=nominal, solid_fraction=float(fine.mean()),
                          eroded=dict(transmission=transmission['eroded'][design_key],
                                      change=transmission['eroded'][design_key]-nominal, solid_fraction=float(eroded.mean())),
                          dilated=dict(transmission=transmission['dilated'][design_key],
                                       change=transmission['dilated'][design_key]-nominal, solid_fraction=float(dilated.mean()))))
    differences = {key: dict(gds_round_trip=transmission['gds'][key]-transmission['structures'][key],
                             smoothing=transmission['structures'][key]-transmission['binary_density'][key],
                             thresholding=transmission['binary_density'][key]-transmission['smooth_density'][key],
                             check_mesh=transmission['gds_check_mesh'][key]-transmission['gds'][key]) for key in transmission['gds']}
    gds = Path(exported['gds_path'])
    times['total'] = time.perf_counter()-started
    return dict(
        task='G7-03', case=CASE, seed=seed, iterations=problem.iteration, settings=asdict(settings),
        start='logits 0.5 * torch.randn((6, 10), generator=torch.Generator().manual_seed(seed))',
        history=history, gradient_check=gradient, final_density=smooth.tolist(), binary=binary.int().tolist(),
        fabrication=fabrication, evaluations=evaluations, transmission=transmission, differences=differences,
        holdout=dict(wavelength_um=HOLDOUT_UM, gds_transmission=transmission['gds'][f'{HOLDOUT_UM:.2f}']),
        export=dict(gds=gds.relative_to(Path(export_dir).parent).as_posix(), gds_sha256=hashlib.sha256(gds.read_bytes()).hexdigest(), structure_count=len(exported['structures']),
                    reimported_structure_count=len(reimported['structures']), gds_structure_count=len(reimported['gds_structures']),
                    gds_maximum_rounding_um=exported['sidecar']['maximum_rounding_um']),
        conventions=dict(s='S[out, in], port 1 = left guide (x = -1 um), port 2 = right guide (x = +1 um), phases at the port phase planes',
                         binary_density='thresholded pixels through bounded_density_layer (volume average per Yee component)',
                         smooth_density='final continuous density (last beta) through the same transfer',
                         structures='pre-export native rectangles, inclusive staircase voxelization',
                         gds='polygons read back by import_gds from the exported file, same voxelization',
                         gds_check_mesh='the re-imported GDS polygons at check_mesh_um over the same physical time',
                         eroded_dilated='binary design on the 0.05 um grid eroded or dilated by 0.1 um, as rectangles',
                         differences='after minus before: gds_round_trip = gds - structures, smoothing = structures - binary_density, '
                                     'thresholding = binary_density - smooth_density, check_mesh = gds_check_mesh - gds'),
        wall_time_s=times)


def _criterion(name, value, limit, passed, **details):
    return dict(criterion=name, value=value, limit=limit, passed=bool(passed), **details)


def judge(records):
    """The seven acceptance criteria of G7-03 from the seed records; every seed enters, none is dropped."""
    records = sorted(records, key=lambda r: r['seed'])
    seeds = [r['seed'] for r in records]
    design_key = f'{DESIGN_UM:.2f}'
    complete = all(r['iterations'] == r['settings']['iterations'] and len(r['history']) == r['iterations']
                   and all(len(stage) == len(WAVELENGTHS_UM) for stage in r['evaluations'].values()) for r in records)
    per_seed = {r['seed']: dict(gds_transmission=r['transmission']['gds'][design_key],
                                holdout_gds_transmission=r['holdout']['gds_transmission'],
                                violations=r['fabrication']['violations'],
                                linewidth_um=r['fabrication']['feature_sizes']['min_linewidth_um'],
                                gap_um=r['fabrication']['feature_sizes']['min_gap_um']) for r in records}
    best = max(records, key=lambda r: r['transmission']['gds'][design_key])
    cases = [(r['seed'], stage, key, value) for r in records for stage, values in r['evaluations'].items() for key, value in values.items()]
    passivity = max(cases, key=lambda c: max(c[3]['column_power']))
    reciprocity = max(cases, key=lambda c: c[3]['reciprocity'])
    gradients = [(r['seed'], row) for r in records for row in r['gradient_check']['pixels']]
    gradient = max(gradients, key=lambda g: g[1]['relative_error'])
    round_trips = [(r['seed'], key, abs(d['gds_round_trip'])) for r in records for key, d in r['differences'].items()]
    round_trip = max(round_trips, key=lambda g: g[2])
    mesh = best['differences'][design_key]['check_mesh']
    criteria = [
        _criterion('a_all_seeds', seeds, list(SEEDS), seeds == list(SEEDS) and complete,
                   note='every declared seed with its full history and every evaluation'),
        _criterion('b_performance', best['transmission']['gds'][design_key], LIMITS['performance'],
                   best['transmission']['gds'][design_key] >= LIMITS['performance'] and not best['fabrication']['violations'],
                   best_seed=best['seed'], best_seed_violations=best['fabrication']['violations'], per_seed=per_seed,
                   note='|S21|^2 at 1.55 um of the re-imported GDS at the design mesh; the best seed must also meet the '
                        'declared 0.4 um linewidth and gap'),
        _criterion('c_passivity', max(passivity[3]['column_power']), LIMITS['passivity'],
                   max(passivity[3]['column_power']) <= LIMITS['passivity'], worst=dict(seed=passivity[0], stage=passivity[1],
                   wavelength_um=float(passivity[2])), cases=len(cases)),
        _criterion('d_reciprocity', reciprocity[3]['reciprocity'], LIMITS['reciprocity'],
                   reciprocity[3]['reciprocity'] <= LIMITS['reciprocity'], worst=dict(seed=reciprocity[0], stage=reciprocity[1],
                   wavelength_um=float(reciprocity[2])), cases=len(cases)),
        _criterion('e_gradient', gradient[1]['relative_error'], LIMITS['gradient'], gradient[1]['relative_error'] <= LIMITS['gradient'],
                   worst=dict(seed=gradient[0], pixel=gradient[1]['pixel']), checked=len(gradients)),
        _criterion('f_gds_round_trip', round_trip[2], LIMITS['gds'], round_trip[2] <= LIMITS['gds'],
                   worst=dict(seed=round_trip[0], wavelength_um=float(round_trip[1])),
                   note='|T(re-imported GDS) - T(pre-export rectangles)| at every seed and wavelength, same mesh and voxelization'),
        _criterion('g_mesh', abs(mesh), LIMITS['mesh'], abs(mesh) <= LIMITS['mesh'], best_seed=best['seed'], signed=mesh,
                   per_seed={r['seed']: r['differences'][design_key]['check_mesh'] for r in records},
                   note='|T(GDS, check mesh) - T(GDS, design mesh)| at 1.55 um for the best seed'),
    ]
    return dict(task='G7-03', case=CASE, seeds=seeds, best_seed=best['seed'], criteria=criteria,
                passed=all(c['passed'] for c in criteria), settings=records[0]['settings'])


def environment(settings):
    try:
        commit = subprocess.run(['git', 'rev-parse', 'HEAD'], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        commit = None
    device = torch.device(settings.device)
    return dict(python=platform.python_version(), torch=torch.__version__, numpy=np.__version__, os=platform.platform(),
                device=torch.cuda.get_device_name(device) if device.type == 'cuda' else platform.processor() or 'cpu',
                commit=commit, torchfdtd=str(Path(__import__('torchfdtd').__file__).parent))


def write_json(path, payload):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=1, allow_nan=False)+'\n', encoding='utf-8', newline='\n')


def summarize(output_dir):
    """Judge every seed record in output_dir (one settings set) and write summary.json next to them."""
    output_dir = Path(output_dir)
    records = [json.loads(path.read_text(encoding='utf-8')) for path in sorted(output_dir.glob('seed*.json'))]
    if not records:
        raise ValueError(f'No seed records in {output_dir}.')
    if len({json.dumps(r['settings'], sort_keys=True) for r in records}) != 1:
        raise ValueError('The seed records were produced with different settings; judge one run only.')
    summary = judge(records)
    seeds = tuple(summary['seeds'])
    summary.update(judged=not records[0]['settings']['reduced'] and seeds == SEEDS,
                   environment={r['seed']: r['environment'] for r in records},
                   wall_time_s=dict(per_seed={r['seed']: r['wall_time_s'] for r in records},
                                    network_setup={r['seed']: r['network_setup_s'] for r in records},
                                    total=sum(r['wall_time_s']['total']+r['network_setup_s'] for r in records)))
    write_json(output_dir/'summary.json', summary)
    return summary


def run(seeds, settings, output_dir):
    """Run the seeds, write one record per seed, then judge every seed record in output_dir."""
    output_dir = Path(output_dir)
    models = Models(settings)
    records = []
    for index, seed in enumerate(seeds):
        record = run_seed(seed, settings, models, output_dir/'export')
        record.update(environment=environment(settings), network_setup_s=models.wall_time_s if index == 0 else 0.)
        write_json(output_dir/f'seed{seed}.json', record)
        records.append(record)
        print(json.dumps(dict(seed=seed, gds_transmission=record['transmission']['gds'][f'{DESIGN_UM:.2f}'],
                              violations=record['fabrication']['violations'],
                              gradient_error=record['gradient_check']['max_relative_error'],
                              wall_time_s=round(record['wall_time_s']['total'], 1))), flush=True)
    return records, summarize(output_dir)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--output-dir', type=Path, required=True)
    parser.add_argument('--seeds', type=int, nargs='+', default=list(SEEDS))
    parser.add_argument('--reduced', action='store_true', help='CPU mechanics run at a coarse mesh; never judged')
    parser.add_argument('--device', help='override the settings device')
    parser.add_argument('--summary-only', action='store_true', help='judge the seed records already in --output-dir')
    args = parser.parse_args(argv)
    settings = REDUCED if args.reduced else Settings()
    if args.device:
        settings = replace(settings, device=args.device)
    summary = summarize(args.output_dir) if args.summary_only else run(args.seeds, settings, args.output_dir)[1]
    print(json.dumps({c['criterion']: dict(value=c['value'], limit=c['limit'], passed=c['passed']) for c in summary['criteria']}, indent=1))
    return summary


if __name__ == '__main__':
    main()
