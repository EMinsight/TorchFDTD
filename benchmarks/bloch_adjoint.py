"""Oblique TE slab with fixed Bloch phase, normalized power and real-index VJP."""
import argparse
import json
import math
from pathlib import Path
import time
import torch
from photonweave import (Project,Region,Source,Structure,FieldMonitor,BoundaryFace,Boundaries,
                        AdjointOptions,DifferentiablePlaneSimulation)
from photonweave.solver import voxelize,C0


def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--output',required=True)
    ap.add_argument('--device',default='cuda')
    ap.add_argument('--steps',type=int,default=512)
    args=ap.parse_args()
    wavelength=1.55;theta=math.radians(20);period=.4
    phase=2*math.pi*period/wavelength*math.sin(theta)
    p=Project(region=Region(size=(period,8,1),mesh=.05,steps=args.steps,pml_cells=12,precision='float64',
                   material_sampling='yee',cuda_kernel='torch',bloch_phase=(phase,0,0),
                   boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'),x_max=BoundaryFace(kind='bloch'))),
              structures=[Structure(center=(0,.025,0),size=(period,.2,1),material='SiO2 (constant n)')],
              sources=[Source(kind='plane',normal='y',size=(period,0,0),center=(0,-1.5,0),component='Ez',wavelength=wavelength,pulse_cycles=1)],
              monitors=[FieldMonitor(id='r',normal='y',center=(0,-.8,0),size=(period,0,1)),
                        FieldMonitor(id='t',normal='y',center=(0,.8,0),size=(period,0,1))])
    p.materials[1].index=1.5
    eps,_=voxelize(p)
    mask=torch.as_tensor((eps-1)/1.25,dtype=torch.float64,device=args.device)
    model=DifferentiablePlaneSimulation(p,AdjointOptions(checkpoints=8,backward_kernel='torch'))
    frequency=[C0/(wavelength*1e-6)]
    started=time.perf_counter()
    with torch.no_grad():reference=model(torch.ones_like(mask),frequency)
    def solve(index):
        result=model(1+(index.square()-1)*mask,frequency)
        return result['t'].normalized_flux(reference['t']).sum(),-result['r'].normalized_flux(reference['r'],subtract_incident=True).sum()
    index=torch.tensor(1.5,device=args.device,dtype=torch.float64,requires_grad=True)
    transmission,reflection=solve(index)
    gradient,=torch.autograd.grad(transmission,index)
    with torch.no_grad():finite=(solve(index+1e-4)[0]-solve(index-1e-4)[0])/(2e-4)
    q1=math.cos(theta);q2=math.sqrt(1.5**2-math.sin(theta)**2)
    exact=1/(1+((q2*q2-q1*q1)/(2*q1*q2))**2*math.sin(2*math.pi*q2*.2/wavelength)**2)
    data=dict(hardware=torch.cuda.get_device_name() if args.device=='cuda' else 'CPU',torch_version=torch.__version__,
              grid=p.region.shape,mesh_um=.05,steps=args.steps,wavelength_um=wavelength,angle_deg=20,bloch_phase=phase,
              transmission=float(transmission.detach()),reflection=float(reflection.detach()),fresnel_transmission=exact,
              transmission_error=abs(float(transmission.detach())-exact),conservation_error=abs(float((transmission+reflection).detach())-1),
              index_gradient=float(gradient),index_finite_difference=float(finite),gradient_relative_error=float(abs(gradient-finite)/abs(finite)),
              elapsed_seconds=time.perf_counter()-started,
              scope='Fixed selected-frequency real-index TE slab. Torch CUDA complex forward/transpose with bounded checkpoints. No fused-complex, spatial-streaming, full-pupil or shape-convergence claim.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(data,indent=2)+'\n',encoding='utf8')
    print(json.dumps({k:data[k] for k in ('transmission_error','conservation_error','gradient_relative_error','elapsed_seconds')}))
    if data['transmission_error']>.02 or data['conservation_error']>.005 or data['gradient_relative_error']>2e-6:
        raise AssertionError('Oblique slab failed the declared physical/gradient tolerance.')


if __name__=='__main__':main()
