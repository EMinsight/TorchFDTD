"""Explicit private input contract for a selected-frequency patterned layer."""
import argparse,hashlib,json,math,time
from pathlib import Path
import numpy as np
import torch
from photonweave import (Project,Region,Source,FieldMonitor,BoundaryFace,Boundaries,
    AdjointOptions,DifferentiablePlaneSimulation,periodic_density_layer,
    calibrate_plane_polarization,mix_plane_fields,quadrant_intensity_allocation)
from photonweave.solver import C0


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--spec',required=True);ap.add_argument('--density',required=True)
    ap.add_argument('--output',required=True);ap.add_argument('--mesh',type=float,default=.05)
    ap.add_argument('--steps',type=int,default=1600);ap.add_argument('--pml-cells',type=int,default=12)
    ap.add_argument('--pixel-origin',choices=('cell_edges','sample_centers'),default='cell_edges');args=ap.parse_args()
    spec=json.loads(Path(args.spec).read_text(encoding='utf8'));raw=Path(args.density).read_bytes()
    if hashlib.sha256(raw).hexdigest()!=spec['density_sha256']:raise ValueError('Density hash mismatch.')
    density=torch.tensor(np.load(args.density,allow_pickle=False),device='cuda',dtype=torch.float32)
    wavelength=spec['wavelength_um'];n=spec['background_index'];height=spec['height_um'];period=spec['period_um']
    theta=spec['theta_inside_rad'];phi=spec['phi_rad'];detector=height/2+spec['detector_offset_um']
    # Extra vertical space leaves source and detector clear of CPML.
    source_z=-height/2-2*wavelength/n;probe_z=-height/2-wavelength/n
    half=max(detector,abs(source_z))+max(1.,20*args.mesh)
    half=math.ceil(half/args.mesh)*args.mesh
    kt=[2*math.pi*n/wavelength*math.sin(theta)*v for v in (math.cos(phi),math.sin(phi))]
    project=Project(region=Region(dimension='3d',size=(*period,2*half),mesh=args.mesh,steps=args.steps,pml_cells=args.pml_cells,
        precision='float32',background_index=n,material_sampling='yee',cuda_kernel='torch',
        bloch_phase=(kt[0]*period[0],kt[1]*period[1],0),
        boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'),x_max=BoundaryFace(kind='bloch'),
                             y_min=BoundaryFace(kind='bloch'),y_max=BoundaryFace(kind='bloch'))),
        sources=[Source(kind='plane',normal='z',size=(*period,0),center=(0,0,source_z),component='Ex',wavelength=wavelength,pulse_cycles=1)],
        monitors=[FieldMonitor(id=name,normal='z',size=(*period,0),center=(0,0,z)) for name,z in [('incident',probe_z),('detector',detector)]])
    epsilon=periodic_density_layer(density,project.region,bottom_um=-height/2,top_um=height/2,
        background_epsilon=n*n,design_epsilon=spec['design_index']**2,pixel_origin=args.pixel_origin)
    refs=[];samples=[];start=time.perf_counter();torch.cuda.reset_peak_memory_stats()
    with torch.no_grad():
        for component in ('Ex','Ey'):
            p=project.model_copy(deep=True);p.sources[0].component=component
            model=DifferentiablePlaneSimulation(p,AdjointOptions(checkpoints=2),quadrature_counts={'incident':(24,24),'detector':(24,24)})
            refs.append(model(torch.full_like(epsilon,n*n),[C0/(wavelength*1e-6)]))
            print(component+' reference complete',flush=True)
            samples.append(model(epsilon,[C0/(wavelength*1e-6)]))
            print(component+' sample complete',flush=True)
        pvec=torch.tensor([math.cos(theta)*math.cos(phi),math.cos(theta)*math.sin(phi)],device='cuda')
        svec=torch.tensor([-math.sin(phi),math.cos(phi)],device='cuda')
        targets=[math.cos(phi)*pvec-math.sin(phi)*svec,math.sin(phi)*pvec+math.cos(phi)*svec]
        rows=[]
        for target in targets:
            c=calibrate_plane_polarization([v['incident'] for v in refs],[kt],target[None])
            sample=mix_plane_fields([v['detector'] for v in samples],c)
            reference=mix_plane_fields([v['detector'] for v in refs],c)
            transmission=sample.normalized_flux(reference)
            rows.append(quadrant_intensity_allocation(sample,transmission)[0])
        torch.cuda.synchronize()
        output=torch.stack(rows).cpu()
    record=dict(grid=project.region.shape,mesh_um=args.mesh,steps=args.steps,pml_cells=args.pml_cells,
        pml_thickness_um=args.mesh*args.pml_cells,pixel_origin=args.pixel_origin,elapsed_seconds=time.perf_counter()-start,
        hardware=torch.cuda.get_device_name(),peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),
        spec_sha256=hashlib.sha256(Path(args.spec).read_bytes()).hexdigest(),density_sha256=spec['density_sha256'],
        response_xy=output.tolist(),unpolarized_response=output.mean(0).tolist(),
        scope='One wavelength/ray. No pupil weight applied. Arithmetic Yee-box material averaging. Optical convergence not yet established.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(record,indent=2)+'\n')
    print(json.dumps(record),flush=True)


if __name__=='__main__':main()
