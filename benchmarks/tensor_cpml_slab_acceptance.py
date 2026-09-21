"""Fixed-criterion normal-incidence tensor-slab CPML acceptance, local GPU only.

Run python -m benchmarks.tensor_cpml_slab_acceptance --gradient
The optional coarse-grid rotation VJP is a separate diagnostic. No tuning.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import time

import numpy as np
import torch

from torchfdtd import AdjointOptions, Monitor, Project, Region, Source
from torchfdtd.anisotropy import TensorDielectricSimulation
from benchmarks.provenance import git_revision

SPEC = dict(background_index=1.2, eigen_indices=[1.5,2.0], rotation_deg=25.,
    slab_thickness_um=.6, wavelength_um=1.55, domain_um=[.5,.5,6.],
    transverse_mesh_um=.1, normal_meshes_um=[.05,.025], pml_thickness_um=1.,
    source_z_um=-1.2, probe_z_um=1.2, pulse_fwhm_s=6e-15,
    pulse_offset_s=18e-15, duration_s=80e-15, precision='float32')
CRITERIA = dict(coarse_complex_vector_relative_error_max=.05,
    fine_complex_vector_relative_error_max=.03, fine_to_coarse_error_ratio_max=.8,
    fine_total_transmission_absolute_error_max=.03, tail_rms_to_peak_max=1e-3,
    rotation_vjp_relative_error_max=.15)


def oracle(theta, spec=SPEC):
    n0=spec['background_index'];d=spec['slab_thickness_um'];k=2*math.pi/spec['wavelength_um']
    channels=[]
    for n in spec['eigen_indices']:
        delta=k*n*d
        channels.append(np.exp(1j*k*n0*d)/(np.cos(delta)+.5j*(n/n0+n0/n)*np.sin(delta)))
    c,s=np.cos(theta),np.sin(theta)
    transmission=np.array([c*c*channels[0]+s*s*channels[1],c*s*(channels[0]-channels[1])])
    cross_gradient=2*np.real(np.conj(transmission[1])*(c*c-s*s)*(channels[0]-channels[1]))
    return transmission,float(cross_gradient)


def make_project(dz):
    faces={a+'_'+side:dict(kind='pml' if a=='z' else 'periodic',
        **({'layers':round(SPEC['pml_thickness_um']/dz)} if a=='z' else {}))
        for a in 'xyz' for side in ('min','max')}
    region=Region(dimension='3d',size=tuple(SPEC['domain_um']),
        mesh_steps=(SPEC['transverse_mesh_um'],SPEC['transverse_mesh_um'],dz),
        steps=10,precision='float32',material_sampling='yee',pml_cells=3,boundaries=faces)
    region.steps=math.ceil(SPEC['duration_s']/region.time_step)
    project=Project(region=region,sources=[Source(kind='plane',component='Ex',normal='z',
        size=(SPEC['domain_um'][0],SPEC['domain_um'][1],0),center=(0,0,SPEC['source_z_um']),
        pulse='gaussian',time_definition='standard',pulse_length=SPEC['pulse_fwhm_s'],
        pulse_offset=SPEC['pulse_offset_s'],wavelength=SPEC['wavelength_um'])],
        monitors=[Monitor(component=c,center=(0,0,SPEC['probe_z_um'])) for c in ('Ex','Ey')])
    return project


def epsilon(project,dz,theta=None):
    r=project.region; bg=SPEC['background_index']**2
    identity=torch.eye(3,device='cuda',dtype=torch.float32)
    if theta is None:
        return (bg*identity).expand(r.shape+(3,3)).clone(),None
    c,s=torch.cos(theta),torch.sin(theta)
    zero=theta*0;one=zero+1
    rotation=torch.stack((c,-s,zero,s,c,zero,zero,zero,one)).reshape(3,3)
    diagonal=torch.diag(torch.tensor([SPEC['eigen_indices'][0]**2,SPEC['eigen_indices'][1]**2,2.25],device='cuda'))
    tensor=rotation@diagonal@rotation.T
    tensor=(tensor+tensor.T)/2
    count=round(SPEC['slab_thickness_um']/dz)
    begin=(r.shape[2]-count)//2;end=begin+count
    index=torch.arange(r.shape[2],device='cuda')
    mask=((index>=begin)&(index<end))[None,None,:,None,None]
    value=torch.where(mask,tensor,bg*identity).expand(r.shape+(3,3)).contiguous()
    nodes=r.mesh_nodes[2]
    return value,dict(first_node=begin,last_node=end-1,
        effective_faces_um=[float(nodes[begin]-.5*dz),float(nodes[end-1]+.5*dz)],
        effective_thickness_um=count*dz)


def run(dz,gradient=False):
    project=make_project(dz)
    model=TensorDielectricSimulation(project,AdjointOptions(checkpoints=8),
        cpml_background_epsilon=SPEC['background_index']**2)
    frequency=299792458./(SPEC['wavelength_um']*1e-6)
    records=[]; spectra=[]
    for name in ('reference','slab'):
        theta=(torch.tensor(math.radians(SPEC['rotation_deg']),device='cuda',requires_grad=gradient)
            if name=='slab' else None)
        material,geometry=epsilon(project,dz,theta)
        torch.cuda.reset_peak_memory_stats()
        torch.cuda.synchronize();started=time.perf_counter()
        result=model(material)
        spectrum=result.spectrum([frequency])[0]
        torch.cuda.synchronize();forward=time.perf_counter()-started
        signal=result.signals.detach()
        tail=signal[-max(1,math.ceil(len(signal)*.1)):]
        ratio=float(tail.square().mean().sqrt()/signal.abs().max().clamp_min(1e-30))
        record=dict(case=name,forward_seconds=forward,tail_rms_to_peak=ratio,
            cuda_peak_allocated_bytes=torch.cuda.max_memory_allocated(),
            gpu_reservation_bytes=result.report['gpu_reservation_bytes'])
        if name=='reference':
            reference=spectrum.detach()
            if float(reference[0].abs())<1e-25:
                raise RuntimeError('Reference spectral amplitude is insufficient.')
        else:
            transmission=spectrum/reference[0]
            if gradient:
                objective=transmission[1].abs().square()
                torch.cuda.synchronize();started=time.perf_counter()
                derivative,=torch.autograd.grad(objective,theta)
                torch.cuda.synchronize()
                record.update(backward_seconds=time.perf_counter()-started,
                    rotation_vjp_per_radian=float(derivative),
                    cuda_peak_allocated_bytes=torch.cuda.max_memory_allocated(),
                    replayed_steps=result.report['replayed_steps'])
            observed=transmission.detach().cpu().numpy()
        records.append(record)
        del material,result,spectrum,signal,tail
    expected,derivative=oracle(math.radians(SPEC['rotation_deg']))
    error=float(np.linalg.norm(observed-expected)/np.linalg.norm(expected))
    return dict(dz_um=dz,shape=list(project.region.shape),steps=project.region.steps,
        time_step_s=project.region.time_step,actual_duration_s=project.region.steps*project.region.time_step,
        geometry=geometry,transmission=[[float(v.real),float(v.imag)] for v in observed],
        oracle_transmission=[[float(v.real),float(v.imag)] for v in expected],
        complex_vector_relative_error=error,total_transmission=float(np.sum(abs(observed)**2)),
        oracle_total_transmission=float(np.sum(abs(expected)**2)),
        oracle_rotation_vjp_per_radian=derivative,records=records)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',default='docs/validation/tensor_cpml_slab_3060.json')
    parser.add_argument('--gradient',action='store_true')
    args=parser.parse_args()
    root=Path(__file__).resolve().parents[1]
    names=('benchmarks/tensor_cpml_slab_acceptance.py','torchfdtd/anisotropy.py','torchfdtd/differentiable.py','torchfdtd/boundaries.py')
    source_before={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    if not torch.cuda.is_available():raise RuntimeError('This acceptance run requires the assigned local CUDA device.')
    # DifferentiableResult.spectrum uses exp(-i omega t), unlike the positive
    # sign native monitor/network convention. Lock this before measurements.
    matched=dict(SPEC,eigen_indices=[SPEC['background_index']]*2)
    assert np.allclose(oracle(.3,matched)[0],[1,0],rtol=0,atol=1e-12)
    weak=dict(SPEC,eigen_indices=[SPEC['background_index']+1e-6]*2)
    assert np.angle(oracle(0.,weak)[0][0])<0
    torch.set_num_threads(1)
    start=time.perf_counter();rows=[]
    print(json.dumps(dict(spec=SPEC,predeclared_criteria=CRITERIA)),flush=True)
    for i,dz in enumerate(SPEC['normal_meshes_um']):
        row=run(dz,gradient=args.gradient and i==0)
        rows.append(row);print(json.dumps(row),flush=True)
    coarse,fine=rows
    checks=dict(coarse_accuracy=coarse['complex_vector_relative_error']<=CRITERIA['coarse_complex_vector_relative_error_max'],
        fine_accuracy=fine['complex_vector_relative_error']<=CRITERIA['fine_complex_vector_relative_error_max'],
        refinement=fine['complex_vector_relative_error']<=CRITERIA['fine_to_coarse_error_ratio_max']*coarse['complex_vector_relative_error'],
        transmission=abs(fine['total_transmission']-fine['oracle_total_transmission'])<=CRITERIA['fine_total_transmission_absolute_error_max'],
        tail=all(r['tail_rms_to_peak']<=CRITERIA['tail_rms_to_peak_max'] for row in rows for r in row['records']),
        memory=all(r['cuda_peak_allocated_bytes']<=r['gpu_reservation_bytes'] for row in rows for r in row['records']))
    if args.gradient:
        value=coarse['records'][1]['rotation_vjp_per_radian'];expected=coarse['oracle_rotation_vjp_per_radian']
        checks['rotation_vjp']=abs(value-expected)/max(abs(expected),1e-12)<=CRITERIA['rotation_vjp_relative_error_max']
    source_after={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    checks['source_integrity']=source_before==source_after
    output=dict(schema='torchfdtd.tensor_cpml_slab_acceptance.v1',dft_convention='DifferentiableResult.spectrum: exp(-i omega t); forward +z phase exp(-i k z)',spec=SPEC,predeclared_criteria=CRITERIA,
        accepted=all(checks.values()),checks=checks,meshes=rows,wall_seconds=time.perf_counter()-start,
        torch_version=torch.__version__,cuda_version=torch.version.cuda,device=torch.cuda.get_device_name(),
        device_uuid=str(getattr(torch.cuda.get_device_properties(0),'uuid','unavailable')),
        revision=git_revision(root),
        source_sha256_before=source_before,source_sha256=source_after,
        limitations=['Fixed isotropic exterior/collar only','Normal incidence and homogeneous transverse plane',
            'No general anisotropic CPML matching or long-time stability claim','Two meshes do not establish asymptotic convergence'])
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    temporary=path.with_suffix('.tmp');temporary.write_text(json.dumps(output,indent=2)+'\n',newline='\n');temporary.replace(path)
    print(json.dumps(dict(accepted=output['accepted'],checks=checks,wall_seconds=output['wall_seconds'])),flush=True)
    if not output['accepted']:
        raise SystemExit(1)


if __name__=='__main__':main()
