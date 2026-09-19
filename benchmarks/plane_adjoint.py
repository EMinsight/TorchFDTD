"""Dielectric slab: normalized plane power, Fresnel conservation and index VJP."""
import argparse
import json
from pathlib import Path
import time
import numpy as np
import torch
from photonweave import (Project,Region,Source,Structure,FieldMonitor,Boundaries,BoundaryFace,
                        SpectrumSettings,AdjointOptions,DifferentiablePlaneSimulation)
from photonweave.solver import voxelize,C0


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--device',default='cuda')
    parser.add_argument('--mesh',type=float,default=.025)
    parser.add_argument('--steps',type=int,default=1600)
    args=parser.parse_args()
    settings=SpectrumSettings(sampling='frequency',frequency_points=9,apodization='none')
    p=Project(region=Region(size=(8,.5,1),mesh=args.mesh,steps=args.steps,pml_cells=16,precision='float64',
                  material_sampling='yee',boundaries=Boundaries(y_min=BoundaryFace(kind='periodic'),y_max=BoundaryFace(kind='periodic'))),
              structures=[Structure(center=(.0125,0,0),size=(.2,.5,1),material='SiO2 (constant n)')],
              sources=[Source(kind='plane',size=(0,.5,0),center=(-1.5,0,0),wavelength=1.55,pulse_cycles=1)],
              monitors=[FieldMonitor(id='reflection',center=(-.8,0,0),size=(0,.5,1),spectrum=settings),
                        FieldMonitor(id='transmission',center=(.8,0,0),size=(0,.5,1),spectrum=settings)])
    p.materials[1].index=1.5
    from photonweave.spectra import frequency_samples
    frequencies=frequency_samples(settings)
    eps,_=voxelize(p)
    mask=torch.as_tensor((eps-1)/(1.5**2-1),device=args.device,dtype=torch.float64)
    model=DifferentiablePlaneSimulation(p,AdjointOptions(checkpoints=8))
    started=time.perf_counter()
    with torch.no_grad():reference=model(torch.ones_like(mask),frequencies)
    def solve(index):
        result=model(1+(index.square()-1)*mask,frequencies)
        transmission=result['transmission'].normalized_flux(reference['transmission'])
        reflection=-result['reflection'].normalized_flux(reference['reflection'],subtract_incident=True)
        return transmission,reflection
    index=torch.tensor(1.5,device=args.device,dtype=torch.float64,requires_grad=True)
    transmission,reflection=solve(index)
    derivative,=torch.autograd.grad(transmission.mean(),index)
    h=1e-4
    with torch.no_grad():finite=(solve(index+h)[0].mean()-solve(index-h)[0].mean())/(2*h)
    expected=1/(1+((1.5**2-1)/3)**2*np.sin(2*np.pi*1.5*.2/(C0/frequencies*1e6))**2)
    t=transmission.detach().cpu().numpy();r=reflection.detach().cpu().numpy()
    error=float(np.max(np.abs(t-expected)))
    conservation=float(np.max(np.abs(t+r-1)))
    relative=float(abs(derivative-finite)/abs(finite))
    output=dict(hardware=torch.cuda.get_device_name() if args.device=='cuda' else 'CPU',torch_version=torch.__version__,
                mesh_um=args.mesh,steps=args.steps,grid=p.region.shape,unique_yee_samples=len(model.observers),
                frequency_hz=frequencies.tolist(),transmission=t.tolist(),reflection=r.tolist(),
                fresnel_transmission=expected.tolist(),max_transmission_error=error,max_conservation_error=conservation,
                index_gradient=float(derivative),index_finite_difference=float(finite),gradient_relative_error=relative,
                elapsed_seconds=time.perf_counter()-started,
                scope='Fixed staircase slab, scalar refractive-index derivative, real nondispersive periodic cell. Includes air reference and two finite-difference evaluations. Not shape convergence, CR validation or competitor timing.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(output,indent=2)+'\n',encoding='utf8')
    print(json.dumps({k:output[k] for k in ('max_transmission_error','max_conservation_error','gradient_relative_error','elapsed_seconds')}))
    if error>.005 or conservation>.005 or relative>2e-6:
        raise AssertionError('Slab physical or index-gradient validation did not meet its declared tolerance.')


if __name__=='__main__':main()
