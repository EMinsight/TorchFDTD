"""Diagnosis runs for the failed G7-01 criteria. They are outside the declaration and its criteria.

    python -m examples.g7.metagrating.diagnose --records docs/validation/g7/G7-01 --out docs/validation/g7/G7-01/diagnosis.json

Each row evaluates one design (the fixture's two ridges or a recorded seed's binary design) in one
case of the declared workflow with one quantity changed: the run duration, or air and substrate
added on both sides of the cell, which moves both absorbers outward and keeps every other position.
A row records the energy residual over the band and, for a recorded seed, the largest difference
to that seed's recorded TORCWA efficiencies.
"""
import argparse
import json
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


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--records', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args(argv)
    case, g, provenance = workflow.declared()
    seeds = {f'seed{r["seed"]}': r for r in (json.loads(p.read_text(encoding='utf-8')) for p in sorted(args.records.glob('seed*.json')))}
    rows = []
    for design, mesh, polarization, incidence, extra, duration in ROWS:
        geometry = dict(g, cell_size_um=[g['cell_size_um'][0], g['cell_size_um'][1]+2*extra])
        settings = replace(workflow.Settings(), time_fraction=duration)
        started = time.perf_counter()
        evaluator = workflow.CaseEvaluator(geometry, settings, mesh, polarization, incidence)
        density = workflow.two_ridge_density(g) if design == 'two_ridge' else seeds[design]['binary']
        e = evaluator.evaluate(density)
        residual = abs(1-np.asarray(e['energy_sum']))
        row = dict(design=design, mesh_um=mesh, polarization=polarization, incidence=incidence, added_um_per_side=extra, duration_factor=duration,
                   cells=e['cells'], steps=e['steps'], max_abs_energy_residual=float(residual.max()),
                   at_wavelength_um=e['wavelength_um'][int(np.argmax(residual))], seconds=time.perf_counter()-started)
        if design != 'two_ridge':
            reference = next(c for c in seeds[design]['rcwa'] if c['polarization'] == polarization and c['incidence'] == incidence)
            row['rcwa'] = workflow.worst_difference(e, reference)
        rows.append(row)
        print(json.dumps(row), flush=True)
    workflow.write_json(args.out, dict(schema='torchfdtd-g7-01-diagnosis-v1', task='G7-01', provenance=provenance, date=time.strftime('%Y-%m-%d'),
                                       note=__doc__.split('\n\n', 2)[2].strip(), environment=workflow.environment(evaluator.device), rows=rows))


if __name__ == '__main__':
    main()
