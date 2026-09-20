"""3D oblique Cartesian x/y polarization synthesis against a Fresnel slab."""
import argparse,json,math,time
from pathlib import Path
import torch
from torchfdtd import (Project,Region,Source,Structure,FieldMonitor,BoundaryFace,Boundaries,
    AdjointOptions,DifferentiablePlaneSimulation,calibrate_plane_polarization,mix_plane_fields)
from torchfdtd.solver import voxelize,C0


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--output',required=True);ap.add_argument('--steps',type=int,default=512)
    args=ap.parse_args();theta=math.radians(20);phi=math.radians(22.5);period=.4;wavelength=1.55
    kt=[2*math.pi/wavelength*math.sin(theta)*v for v in (math.cos(phi),math.sin(phi))]
    base=Project(region=Region(dimension='3d',size=(period,period,8),mesh=.05,pml_cells=12,steps=args.steps,
        precision='float64',material_sampling='yee',bloch_phase=(kt[0]*period,kt[1]*period,0),cuda_kernel='torch',
        boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'),x_max=BoundaryFace(kind='bloch'),
                              y_min=BoundaryFace(kind='bloch'),y_max=BoundaryFace(kind='bloch'))),
        structures=[Structure(center=(0,0,.025),size=(period,period,.2),material='SiO2 (constant n)')],
        sources=[Source(kind='plane',normal='z',center=(0,0,-1.5),size=(period,period,0),component='Ex',wavelength=wavelength,pulse_cycles=1)],
        monitors=[FieldMonitor(id=name,normal='z',center=(0,0,z),size=(period,period,0)) for name,z in [('r',-.8),('t',.8)]])
    base.materials[1].index=1.5
    eps,_=voxelize(base);mask=torch.as_tensor((eps-1)/1.25,device='cuda',dtype=torch.float64)
    frequency=[C0/(wavelength*1e-6)];models=[]
    for component in ('Ex','Ey'):
        p=base.model_copy(deep=True);p.sources[0].component=component
        models.append(DifferentiablePlaneSimulation(p,AdjointOptions(checkpoints=4,backward_kernel='torch')))
    started=time.perf_counter()
    with torch.no_grad():refs=[model(torch.ones_like(mask),frequency) for model in models]
    pvec=torch.tensor([math.cos(theta)*math.cos(phi),math.cos(theta)*math.sin(phi)],device='cuda',dtype=torch.float64)
    svec=torch.tensor([-math.sin(phi),math.cos(phi)],device='cuda',dtype=torch.float64)
    targets=[math.cos(phi)*pvec-math.sin(phi)*svec,math.sin(phi)*pvec+math.cos(phi)*svec]
    coefficients=[calibrate_plane_polarization([r['r'] for r in refs],[kt],t[None]) for t in targets]
    def solve(index):
        samples=[model(1+(index.square()-1)*mask,frequency) for model in models]
        values=[]
        for c in coefficients:
            sample={key:mix_plane_fields([s[key] for s in samples],c) for key in ('r','t')}
            reference={key:mix_plane_fields([s[key] for s in refs],c) for key in ('r','t')}
            values.append(torch.stack((sample['t'].normalized_flux(reference['t']).sum(),
                -sample['r'].normalized_flux(reference['r'],subtract_incident=True).sum())))
        return torch.stack(values)
    index=torch.tensor(1.5,device='cuda',dtype=torch.float64,requires_grad=True)
    actual=solve(index);gradient,=torch.autograd.grad(actual[:,0].sum(),index)
    with torch.no_grad():finite=(solve(index+1e-4)[:,0].sum()-solve(index-1e-4)[:,0].sum())/2e-4
    kz=math.sqrt(1.5**2-math.sin(theta)**2);phase=2*math.pi*kz*.2/wavelength
    def fresnel(q1,q2):return 1/(1+((q2*q2-q1*q1)/(2*q1*q2))**2*math.sin(phase)**2)
    ts=fresnel(math.cos(theta),kz);tp=fresnel(math.cos(theta),kz/1.5**2)
    exact=[math.cos(phi)**2*tp+math.sin(phi)**2*ts,math.sin(phi)**2*tp+math.cos(phi)**2*ts]
    error=max(abs(float(actual[i,0].detach())-exact[i]) for i in range(2))
    conservation=float((actual.sum(-1)-1).detach().abs().max());ge=float((gradient-finite).abs()/finite.abs())
    result=dict(hardware=torch.cuda.get_device_name(),grid=base.region.shape,steps=args.steps,theta_deg=20,phi_deg=22.5,
        transmission_reflection=actual.detach().cpu().tolist(),fresnel_transmission=exact,transmission_error=error,
        conservation_error=conservation,gradient=float(gradient),finite_difference=float(finite),gradient_relative_error=ge,
        elapsed_seconds=time.perf_counter()-started,
        scope='Single-frequency 3D isotropic slab, calibrated coherent x/y source bases. Not full CR, broadband injection or shape convergence.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result))
    assert error<.02 and conservation<.005 and ge<2e-6,'Physical or gradient tolerance failed.'


if __name__=='__main__':main()
