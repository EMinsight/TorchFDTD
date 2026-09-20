"""Directional derivative of a relaxed, hash-identified patterned layer."""
import argparse
from dataclasses import replace
import hashlib,json,math,time
from pathlib import Path
import numpy as np
import torch
from torchfdtd import (Project,Region,Source,FieldMonitor,BoundaryFace,Boundaries,
    AdjointOptions,DifferentiablePlaneSimulation,periodic_density_layer,recompute_cases,
    calibrate_plane_polarization,mix_plane_fields,quadrant_intensity_allocation)
from torchfdtd.solver import C0


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--spec',required=True);ap.add_argument('--density',required=True)
    ap.add_argument('--output',required=True);ap.add_argument('--steps',type=int,default=1600)
    args=ap.parse_args();spec=json.loads(Path(args.spec).read_text(encoding='utf8'))
    if hashlib.sha256(Path(args.density).read_bytes()).hexdigest()!=spec['density_sha256']:raise ValueError('Density hash mismatch.')
    seed=torch.tensor(np.load(args.density,allow_pickle=False),device='cuda',dtype=torch.float64)
    density=(.01+.98*seed).requires_grad_()
    if not bool(((seed==0)|(seed==1)).all()):raise ValueError('This validation relaxation expects a binary seed.')
    wavelength=spec['wavelength_um'];n=spec['background_index'];height=spec['height_um'];period=spec['period_um']
    theta=spec['theta_inside_rad'];phi=spec['phi_rad'];detector=height/2+spec['detector_offset_um'];mesh=.05
    source_z=-height/2-2*wavelength/n;probe_z=-height/2-wavelength/n
    half=math.ceil((max(detector,abs(source_z))+max(1.,20*mesh))/mesh)*mesh
    kt=[2*math.pi*n/wavelength*math.sin(theta)*v for v in (math.cos(phi),math.sin(phi))]
    project=Project(region=Region(dimension='3d',size=(*period,2*half),mesh=mesh,steps=args.steps,pml_cells=12,
        precision='float64',background_index=n,material_sampling='yee',cuda_kernel='torch',
        bloch_phase=(kt[0]*period[0],kt[1]*period[1],0),
        boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'),x_max=BoundaryFace(kind='bloch'),
                             y_min=BoundaryFace(kind='bloch'),y_max=BoundaryFace(kind='bloch'))),
        sources=[Source(kind='plane',normal='z',size=(*period,0),center=(0,0,source_z),component='Ex',wavelength=wavelength,pulse_cycles=1)],
        monitors=[FieldMonitor(id=name,normal='z',size=(*period,0),center=(0,0,z)) for name,z in [('incident',probe_z),('detector',detector)]])
    def epsilon(d):return periodic_density_layer(d,project.region,bottom_um=-height/2,top_um=height/2,
        background_epsilon=n*n,design_epsilon=spec['design_index']**2)
    frequency=[C0/(wavelength*1e-6)];models=[];refs=[];start=time.perf_counter()
    with torch.no_grad():
        background=torch.full_like(epsilon(density),n*n)
        for component in ('Ex','Ey'):
            p=project.model_copy(deep=True);p.sources[0].component=component
            model=DifferentiablePlaneSimulation(p,AdjointOptions(checkpoints=4),quadrature_counts={'incident':(24,24),'detector':(24,24)})
            models.append(model);refs.append(model(background,frequency));print(component+' reference complete',flush=True)
        pvec=density.new_tensor([math.cos(theta)*math.cos(phi),math.cos(theta)*math.sin(phi)])
        svec=density.new_tensor([-math.sin(phi),math.cos(phi)])
        targets=[math.cos(phi)*pvec-math.sin(phi)*svec,math.sin(phi)*pvec+math.cos(phi)*svec]
        coefficients=[calibrate_plane_polarization([r['incident'] for r in refs],[kt],v[None]) for v in targets]
    cases=[lambda d,model=model:model(epsilon(d),frequency)['detector'].fields for model in models]
    channel_weights=density.new_tensor([.1,.3,-.2,.7])
    def loss(d):
        fields=recompute_cases(cases,d,output_device='cuda',replay_rtol=1e-10,replay_atol=1e-30)
        planes=[replace(refs[i]['detector'],fields=fields[i]) for i in range(2)]
        responses=[]
        for c in coefficients:
            sample=mix_plane_fields(planes,c);reference=mix_plane_fields([r['detector'] for r in refs],c)
            responses.append(quadrant_intensity_allocation(sample,sample.normalized_flux(reference))[0])
        response=torch.stack(responses).mean(0)
        return (response*channel_weights).sum()+.2*response.square().sum()
    torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats();iteration_start=time.perf_counter()
    objective=loss(density);gradient,=torch.autograd.grad(objective,density)
    torch.cuda.synchronize();iteration_seconds=time.perf_counter()-iteration_start
    peak=torch.cuda.max_memory_allocated();print('Adjoint complete',flush=True)
    x=(torch.arange(seed.shape[0],device=seed.device,dtype=seed.dtype)+.5)/seed.shape[0]
    y=(torch.arange(seed.shape[1],device=seed.device,dtype=seed.dtype)+.5)/seed.shape[1]
    direction=torch.cos(2*torch.pi*x[:,None])*torch.sin(4*torch.pi*y[None,:])
    derivative=(gradient*direction).sum();checks=[]
    with torch.no_grad():
        for h in (1e-3,5e-4):
            difference=(loss(density+h*direction)-loss(density-h*direction))/(2*h)
            relative=float((difference-derivative).abs()/derivative.abs().clamp_min(1e-12))
            checks.append(dict(step=h,finite_difference=float(difference),relative_error=relative))
            print(json.dumps(checks[-1]),flush=True)
    record=dict(hardware=torch.cuda.get_device_name(),grid=project.region.shape,steps=args.steps,mesh_um=mesh,
        seed_sha256=spec['density_sha256'],relaxation='0.01 + 0.98 * binary seed',objective=float(objective.detach()),
        directional_derivative=float(derivative),gradient_l2=float(gradient.norm()),checks=checks,
        iteration_seconds=iteration_seconds,peak_cuda_allocated_bytes=peak,validation_seconds=time.perf_counter()-start,
        scope='FP64 selected-ray relaxed-seed discrete gradient with sequential source-case recomputation. Weighted allocation test loss, not the full CR information objective or converged optical gradient.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(record,indent=2)+'\n')
    if abs(float(derivative))<1e-8 or any(c['relative_error']>2e-4 for c in checks):raise AssertionError('Directional derivative validation failed.')
    print(json.dumps(record),flush=True)


if __name__=='__main__':main()
