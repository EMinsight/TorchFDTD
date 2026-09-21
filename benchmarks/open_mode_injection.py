"""Native open-fiber modal propagation gates, distinct from mode oracles."""
import argparse
import json
from pathlib import Path
import time
import numpy as np
import torch
from torchfdtd import Project, Region, Source, FieldMonitor, AdjointOptions
from torchfdtd.open_mode_injection import OpenPortOptions, prepare_open_modal_launch
from torchfdtd.mode_injection import ModeInjectedPlaneSimulation, modal_plane_amplitudes, _profile


def fiber(u, v):
    return np.where(u*u+v*v < .4**2-1e-10, 2.2**2, 1.)


def make_case(direction='+', steps=1300, normal='x', cycles=2):
    w = 'xyz'.index(normal)
    axes = (w, (w+1)%3, (w+2)%3)
    def xyz(values):
        return tuple(values[axes.index(i)] for i in range(3))
    d = 1 if direction == '+' else -1
    r = Region(dimension='3d', size=xyz((8., 4., 4.)), mesh=.1,
        pml_cells=8, steps=steps, material_sampling='yee', precision='float32')
    aperture = xyz((0., 2.4, 2.4))
    return Project(region=r, sources=[Source(kind='plane', normal=normal, direction=direction,
        center=xyz((-2*d, 0., 0.)), size=aperture, pulse_cycles=cycles)], monitors=[
        FieldMonitor(id=name, normal=normal, center=xyz((x*d, 0., 0.)), size=aperture)
        for name,x in (('outside',-2.8),('near',-1.),('middle',0.),('far',1.))])


def run_case(direction='+', device='cuda', cycles=2):
    started = time.perf_counter()
    p = make_case(direction=direction, cycles=cycles)
    launch = prepare_open_modal_launch(p, fiber, options=OpenPortOptions(1.))
    print('prepared fixed open mode', launch.mode.beta_per_um, flush=True)
    model = ModeInjectedPlaneSimulation(p, launch, AdjointOptions(checkpoints=8))
    section = np.stack([_profile(launch.epsilon[...,c],launch.mode.normal) for c in range(3)],-1)
    base = torch.tensor(section, device=device).expand(p.region.shape+(3,)).clone()
    with torch.no_grad():
        planes = model(base,[299792458/1.55e-6])
    amplitudes = {name:modal_plane_amplitudes(plane,launch) for name,plane in planes.items()}
    f,b = ('forward','backward') if direction=='+' else ('backward','forward')
    rows = []
    for name,distance in (('middle',1.),('far',2.)):
        ratio = complex((amplitudes[name][f]/amplitudes['near'][f]).item())
        expected = np.exp(1j*launch.mode.beta_per_um*distance)
        rows.append(dict(detector=name, distance_um=distance,
            ratio=[ratio.real,ratio.imag],expected=[float(expected.real),float(expected.imag)],
            complex_error=float(abs(ratio-expected)),phase_error_rad=float(abs(np.angle(ratio/expected))),
            transmitted_power_defect=float(abs(abs(ratio)**2-1)),
            reverse_power=float((amplitudes[name][b]/amplitudes[name][f]).abs().square().item())))
    row = dict(direction=direction,cycles=cycles,grid=list(p.region.shape),steps=p.region.steps,
        beta_per_um=[launch.mode.beta_per_um.real,launch.mode.beta_per_um.imag],
        measurements=rows,elapsed_seconds=time.perf_counter()-started,
        outside_power=float((amplitudes['outside'][b]/amplitudes['near'][f]).abs().square().item()),
        mode_residual=launch.mode.maxwell_residual,tail=launch.mode.diagnostics['collar_energy_fraction'],
        packet_storage_bytes=launch.storage_bytes)
    row['accepted'] = (all(x['phase_error_rad']<.01 and x['transmitted_power_defect']<.005
        and x['reverse_power']<1e-3 for x in rows) and row['outside_power']<1e-3)
    return row


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--direction',default='+',choices=['+','-'])
    parser.add_argument('--device',default='cuda')
    parser.add_argument('--cycles',type=int,default=2)
    args=parser.parse_args()
    torch.set_num_threads(1)
    if args.device=='cuda':
        from torchfdtd.cuda_bootstrap import prepare_cuda_kernels
        prepare_cuda_kernels()
    row=run_case(args.direction,args.device,args.cycles)
    Path(args.output).write_text(json.dumps(row,indent=2,allow_nan=False)+'\n',encoding='utf8')
    print(json.dumps(row,indent=2),flush=True)
    if not row['accepted']:
        raise SystemExit('Open modal propagation did not pass the predeclared physical gates.')


if __name__=='__main__':
    main()
