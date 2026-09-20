"""FP32 native dipole radiation mesh study, with a fixed physical box/PML/time."""
import argparse
import hashlib
import json
from pathlib import Path
import time
import numpy as np
import torch
from torchfdtd import Project, Region, Source, FieldMonitor, DifferentiablePlaneSimulation, AdjointOptions
from torchfdtd.radiation import project_farfield, C0


def run(device='cuda'):
    torch.set_num_threads(1)
    theta = np.linspace(0, np.pi, 13)
    directions = np.array([[np.sin(t)*np.cos(phi), np.sin(t)*np.sin(phi), np.cos(t)]
                           for phi in (0., np.pi/4, np.pi/2) for t in theta])
    expected = 1 - directions[:, 2]**2
    cases = []
    for mesh in (.1, .075, .05):
        region = Region(dimension='3d', size=(2.4,)*3, mesh=mesh, precision='float32',
                        material_sampling='yee', backend=device, pml_cells=round(.3/mesh), steps=100)
        region.steps = round(50e-15/region.time_step)
        source = Source(center=(0., 0., 0.), component='Ez', wavelength=1.1, pulse='gaussian', pulse_cycles=2.)
        monitors = []
        for a in range(3):
            for side in (0, 1):
                center, size = [0.]*3, [1.2]*3
                center[a], size[a] = (-.6 if side == 0 else .6), 0.
                monitors.append(FieldMonitor(id='xyz'[a]+('_min' if side == 0 else '_max'),
                    center=tuple(center), size=tuple(size), normal='xyz'[a]))
        project = Project(region=region, sources=[source], monitors=monitors)
        model = DifferentiablePlaneSimulation(project, AdjointOptions(checkpoints=0),
                                              quadrature_counts={m.id: (32, 32) for m in monitors})
        epsilon = torch.ones(region.shape, device=device, dtype=torch.float32)
        start = time.perf_counter()
        with torch.no_grad():
            faces = model(epsilon, [C0/1.1e-6])
            # Common scale avoids underflow when evaluating very small SI DFT fields.
            from dataclasses import replace
            scale = max(float(v.fields.abs().max()) for v in faces.values())
            faces = {k: replace(v, fields=v.fields/scale) for k, v in faces.items()}
            far = project_farfield(faces, directions, bounds_um=((- .6, .6),)*3)
            power = far.intensity()[0].cpu().numpy()
        factor = np.dot(power, expected)/np.dot(expected, expected)
        normalized = power/factor
        error = float(np.linalg.norm(normalized-expected)/np.linalg.norm(expected))
        cases.append(dict(mesh_um=mesh, shape=list(region.shape), steps=region.steps,
            physical_time_s=region.steps*region.time_step, pml_um=region.pml_cells*mesh,
            full_wall_s=time.perf_counter()-start, pattern_relative_l2=error,
            pattern=normalized.tolist()))
    passed = all(cases[i+1]['pattern_relative_l2'] < cases[i]['pattern_relative_l2'] for i in range(2)) and cases[-1]['pattern_relative_l2'] < .01
    return dict(dtype='float32', device=device, gpu=torch.cuda.get_device_name() if device=='cuda' else None,
        scope='Homogeneous vacuum native dipole normalized angular intensity. Not absolute source-power calibration or substrate projection.',
        wavelength_um=1.1, surface_bounds_um=[[-.6,.6]]*3, surface_quadrature=[32,32],
        directions=directions.tolist(), analytic_pattern=expected.tolist(), cases=cases, passed=passed)


if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--device',default='cuda',choices=['cpu','cuda'])
    args=parser.parse_args()
    report=run(args.device)
    report['source_sha256']={p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in
        ('torchfdtd/radiation.py','benchmarks/radiation_dipole.py','torchfdtd/adjoint_planes.py')}
    Path(args.output).write_text(json.dumps(report,indent=2)+'\n',encoding='utf8',newline='\n')
    print(json.dumps({'passed':report['passed'],'cases':[{k:v for k,v in c.items() if k!='pattern'} for c in report['cases']]}))
    if not report['passed']:
        raise SystemExit('Radiation physical acceptance did not pass.')
