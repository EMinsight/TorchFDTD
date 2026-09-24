"""Diagnosis runs for the failed G7-01 criteria. They are outside the declaration and its criteria.

    python -m examples.g7.metagrating.diagnose --records <dir> --out <diagnosis.json> [--blocks rows oblique]

`rows`: each row evaluates one design (the fixture's two ridges or a recorded seed's binary design)
in one case of the declared workflow with one quantity changed: the run duration, or air and
substrate added on both sides of the cell, which moves both absorbers outward and keeps every other
position. A row records the energy residual over the band and, for a recorded seed, the largest
difference to that seed's recorded TORCWA efficiencies.

`oblique`: the Rayleigh-anomaly wavelengths of every order in air and in the substrate at the
declared k_x (and at normal incidence), each band wavelength's distance to the nearest anomaly,
and, for the best seed's binary design at k_x (TE at the design mesh, TM at 0.01 um), the energy
residual and every order's |TorchFDTD - TORCWA| per wavelength for the declared cell, for 3 um more
air and substrate per side, and for the same with kappa-graded absorbers, summarized over all
wavelengths and over those at least 0.01 um and 0.02 um from any anomaly.
"""
import argparse
import json
import math
from dataclasses import replace
from pathlib import Path
import time

import numpy as np

from examples.g7.metagrating import workflow

# (design, mesh um, polarization, incidence, added air and substrate per side um, duration factor)
ROWS = (('two_ridge', .02, 'TE', 'bloch', 0., 1.), ('two_ridge', .02, 'TE', 'bloch', 0., 2.),
        ('two_ridge', .02, 'TE', 'bloch', 1., 1.), ('two_ridge', .02, 'TE', 'bloch', 3., 1.),
        ('seed2', .02, 'TE', 'bloch', 0., 1.), ('seed2', .02, 'TE', 'bloch', 3., 1.),
        ('seed2', .01, 'TM', 'bloch', 0., 1.), ('seed2', .01, 'TM', 'bloch', 3., 1.),
        ('seed3', .01, 'TM', 'normal', 0., 1.), ('seed3', .01, 'TM', 'normal', 0., 2.), ('seed3', .01, 'TM', 'normal', 3., 1.),
        ('seed1', .02, 'TE', 'normal', 0., 1.), ('seed1', .02, 'TE', 'normal', 0., 2.))
# (label, added air and substrate per side um, CPML kappa of both y absorbers)
CONFIGURATIONS = (('declared cell', 0., 1.), ('3 um more air and substrate', 3., 1.),
                  ('3 um more, CPML kappa 5', 3., 5.), ('3 um more, CPML kappa 10', 3., 10.))
DISTANCES_UM = (0., .01, .02)


def extended(g, extra):
    return dict(g, cell_size_um=[g['cell_size_um'][0], g['cell_size_um'][1]+2*extra])


def rows_block(g, seeds):
    rows = []
    for design, mesh, polarization, incidence, extra, duration in ROWS:
        started = time.perf_counter()
        evaluator = workflow.CaseEvaluator(extended(g, extra), replace(workflow.Settings(), time_fraction=duration), mesh, polarization, incidence)
        e = evaluator.evaluate(workflow.two_ridge_density(g) if design == 'two_ridge' else seeds[design]['binary'])
        residual = abs(1-np.asarray(e['energy_sum']))
        row = dict(design=design, mesh_um=mesh, polarization=polarization, incidence=incidence, added_um_per_side=extra, duration_factor=duration,
                   cells=e['cells'], steps=e['steps'], max_abs_energy_residual=float(residual.max()),
                   at_wavelength_um=e['wavelength_um'][int(np.argmax(residual))], seconds=time.perf_counter()-started)
        if design != 'two_ridge':
            reference = next(c for c in seeds[design]['rcwa'] if c['polarization'] == polarization and c['incidence'] == incidence)
            row['rcwa'] = workflow.worst_difference(e, reference)
        rows.append(row)
        print(json.dumps(row), flush=True)
    return rows


def rayleigh_anomalies(g, kx0):
    """Wavelengths (um) at which order m grazes in a medium of index n: n L / |k_x0 L / (2 pi) + m|."""
    q = kx0*g['period_um']/(2*math.pi)
    return [dict(order=m, medium=medium, wavelength_um=index*g['period_um']/abs(q+m))
            for m in workflow.ALL_ORDERS for medium, index in (('air', 1.), ('substrate', g['substrate_index'])) if abs(q+m) > 1e-12]


def summarize(wavelength, distance, residual, error, worst_order):
    out = {}
    for minimum in DISTANCES_UM:
        keep = distance >= minimum-1e-12
        i, j = np.flatnonzero(keep)[np.argmax(residual[keep])], np.flatnonzero(keep)[np.argmax(error[keep])]
        out[f'at least {minimum:g} um from any anomaly'] = dict(
            wavelengths=int(keep.sum()), excluded_um=wavelength[~keep].round(6).tolist(), max_energy_residual=float(residual[i]),
            energy_at_wavelength_um=float(wavelength[i]), max_order_error=float(error[j]), error_at_wavelength_um=float(wavelength[j]),
            error_order=worst_order[j])
    return out


def oblique_block(g, seeds, best):
    kx0 = workflow.bloch_kx(g)
    anomalies = rayleigh_anomalies(g, kx0)
    wavelength = workflow.band_wavelengths(g, workflow.Settings())
    distance = np.min(abs(wavelength[:, None]-np.array([a['wavelength_um'] for a in anomalies])[None, :]), axis=1)
    cases = []
    for polarization, mesh in (('TE', .02), ('TM', .01)):
        reference = next(c for c in seeds[best]['rcwa'] if c['polarization'] == polarization and c['incidence'] == 'bloch')
        for label, extra, kappa in CONFIGURATIONS:
            started = time.perf_counter()
            evaluator = workflow.CaseEvaluator(extended(g, extra), workflow.Settings(), mesh, polarization, 'bloch', kappa=kappa)
            e = evaluator.evaluate(seeds[best]['binary'])
            residual = abs(1-np.asarray(e['energy_sum']))
            errors = {f'{kind}{m:+d}': abs(np.asarray(e[kind][str(m)])-np.asarray(reference[kind][str(m)]))
                      for kind in ('T', 'R') for m in workflow.ALL_ORDERS}
            names = list(errors)
            stacked = np.stack([errors[n] for n in names], axis=1)
            worst_order = [names[k] for k in np.argmax(stacked, axis=1)]
            case = dict(polarization=polarization, mesh_um=mesh, configuration=label, added_um_per_side=extra, cpml_kappa=kappa,
                        cells=e['cells'], steps=e['steps'], pml_cells=e['pml_cells'],
                        bare_substrate_max_abs_R0_minus_fresnel=evaluator.diagnostics['max_abs_R0_minus_fresnel'],
                        energy_residual=residual.tolist(), max_order_error=stacked.max(axis=1).tolist(), worst_order=worst_order,
                        order_errors={n: v.tolist() for n, v in errors.items() if v.max() > 0},
                        summary=summarize(wavelength, distance, residual, stacked.max(axis=1), worst_order), seconds=time.perf_counter()-started)
            cases.append(case)
            print(json.dumps(dict(polarization=polarization, configuration=label, summary=case['summary'])), flush=True)
    return dict(design=best, kx_per_um=kx0, anomalies=anomalies,
                normal_incidence_anomalies=rayleigh_anomalies(g, 0.), wavelength_um=wavelength.tolist(),
                distance_to_nearest_anomaly_um=distance.tolist(), rcwa='the recorded TORCWA efficiencies of the same design and polarization',
                cases=cases)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--records', type=Path, required=True, help='directory of the seed records and summary.json of a judged run')
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--blocks', nargs='+', choices=('rows', 'oblique'), default=['rows', 'oblique'])
    args = parser.parse_args(argv)
    _, g, provenance = workflow.declared()
    seeds = {f'seed{r["seed"]}': r for r in (json.loads(p.read_text(encoding='utf-8')) for p in sorted(args.records.glob('seed*.json')))}
    best = json.loads((args.records/'summary.json').read_text(encoding='utf-8'))['criteria']['performance']['best_seed']
    record = dict(schema='torchfdtd-g7-01-diagnosis-v2', task='G7-01', provenance=provenance, date=time.strftime('%Y-%m-%d'),
                  note='Outside the declaration and its criteria. '+__doc__.split('\n\n', 2)[2].strip(), records=args.records.as_posix())
    if 'rows' in args.blocks:
        record['rows'] = rows_block(g, seeds)
    if 'oblique' in args.blocks:
        record['oblique'] = oblique_block(g, seeds, f'seed{best}')
    record['environment'] = workflow.environment(workflow.torch.device('cuda'))
    workflow.write_json(args.out, record)


if __name__ == '__main__':
    main()
