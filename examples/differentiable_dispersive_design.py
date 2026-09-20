"""Small geometry/material optimizer through checkpointed Drude/Lorentz FDTD.

This demonstrates a point-spectrum loss, not a normalized optical device score.
"""
import argparse
import json

import torch
from photonweave import (AdjointOptions, DispersiveSimulation, Monitor, Project,
                        Region, Source, smooth_sphere_epsilon)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--device', choices=['cpu','cuda'], default='cpu')
    parser.add_argument('--iterations', type=int, default=4)
    args = parser.parse_args()
    if args.iterations < 1:
        parser.error('--iterations must be positive')
    project = Project(region=Region(dimension='2d',size=(1.6,1.5,1.4),mesh=.1,
        pml_cells=3,steps=50,precision='float64'),
        sources=[Source(center=(-.2,0,0),pulse='continuous',wavelength=1.1)],
        monitors=[Monitor(component='Ez',center=(.1,0,0))])
    radius = torch.nn.Parameter(torch.tensor(.25,device=args.device,dtype=torch.float64))
    raw_damping = torch.nn.Parameter(torch.tensor(-1.,device=args.device,dtype=torch.float64))
    optimizer = torch.optim.Adam([radius,raw_damping],lr=.003)
    model = DispersiveSimulation(project,AdjointOptions(checkpoints=3,storage='host',host_budget_bytes=64*1024**2))
    for iteration in range(args.iterations):
        optimizer.zero_grad()
        density = smooth_sphere_epsilon(project.region,radius,inside=1.,outside=0.,width=.08,yee=True)
        epsilon = 1.2+.6*density
        strength = (.8e30*density)[None]
        damping = (torch.nn.functional.softplus(raw_damping)+.01)*1e15
        result = model.spectrum(epsilon,strength,1.5e15,damping,[2e14],block_size=8)
        loss = (result.fields.abs()/ (project.region.steps*project.region.time_step)).square().mean()
        loss.backward()
        print(json.dumps(dict(iteration=iteration,point_spectrum_loss=float(loss.detach()),
            radius_um=float(radius.detach()),damping_rad_s=float(damping.detach()),
            radius_gradient=float(radius.grad),raw_damping_gradient=float(raw_damping.grad),
            material_state_bytes=result.report['material_state_bytes'],
            checkpoint_bytes=result.report['restart_bytes'])),flush=True)
        optimizer.step()
        with torch.no_grad():
            radius.clamp_(.05,.5)


if __name__ == '__main__':
    main()
