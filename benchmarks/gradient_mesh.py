"""Physical slab output and shape/material derivative convergence in FP32.

Run: python -m benchmarks.gradient_mesh --output docs/validation/gradient_mesh.json
The analytic comparator is the sharp-interface Airy transmission, independently
of the discrete solver. Fixed-width refinement and time/PML controls are separate.
"""
import argparse
import json
import math
from pathlib import Path
import time
import numpy as np
import torch
from torchfdtd import (Project, Region, Source, FieldMonitor, Boundaries, BoundaryFace,
    AdjointOptions, DifferentiablePlaneSimulation, DifferentiableSolid, smooth_geometry_epsilon)
from torchfdtd.solver import C0


def airy(thickness=.23, epsilon=2.25, wavelength=1.55):
    """Closed-form T, dT/dd (per um), dT/depsilon for an air/slab/air stack."""
    n=math.sqrt(epsilon)
    phase=2*math.pi*n*thickness/wavelength
    contrast=(epsilon-1)**2/(4*epsilon)
    transmission=1/(1+contrast*math.sin(phase)**2)
    dt=-transmission**2*contrast*math.sin(2*phase)*2*math.pi*n/wavelength
    de=-transmission**2*((1-1/epsilon**2)/4*math.sin(phase)**2
        +contrast*math.sin(2*phase)*math.pi*thickness/(n*wavelength))
    return np.array([transmission,dt,de])


def make_project(mesh, duration_fs=90., pml_um=.4):
    region=Region(size=(8.,.24,1.),mesh=mesh,steps=100,pml_cells=round(pml_um/mesh),
        precision='float32',material_sampling='yee',boundaries=Boundaries(
            y_min=BoundaryFace(kind='periodic'),y_max=BoundaryFace(kind='periodic')))
    steps=math.ceil(duration_fs*1e-15/region.time_step)
    region=Region.model_validate(dict(region.model_dump(),steps=steps,time_step_override=duration_fs*1e-15/steps))
    return Project(region=region,sources=[Source(kind='plane',center=(-1.5,0,0),
        size=(0,.24,0),wavelength=1.55,pulse_cycles=1)],monitors=[
            FieldMonitor(id='T',center=(.8,0,0),size=(0,.24,1.)),
            FieldMonitor(id='R',center=(-.8,0,0),size=(0,.24,1.))])


def run_case(mesh,width,device='cuda',duration_fs=90.,pml_um=.4,improve=False):
    started=time.perf_counter()
    project=make_project(mesh,duration_fs,pml_um)
    model=DifferentiablePlaneSimulation(project,AdjointOptions(checkpoints=8))
    frequency=torch.tensor([C0/(1.55e-6)],device=device,dtype=torch.float32)
    def epsilon(parameters):
        return smooth_geometry_epsilon(project.region,[DifferentiableSolid.box(
            (parameters[0],2.,2.),center=(.013,0,0),epsilon=parameters[1])],width=width,device=device)
    parameters=torch.tensor([.23,2.25],dtype=torch.float32,device=device,requires_grad=True)
    with torch.no_grad():
        reference=model(torch.ones_like(epsilon(parameters)),frequency)
    def solve(parameters):
        result=model(epsilon(parameters),frequency)
        t=result['T'].normalized_flux(reference['T']).sum()
        r=-result['R'].normalized_flux(reference['R'],subtract_incident=True).sum()
        return t,r
    transmission,reflection=solve(parameters)
    gradient,=torch.autograd.grad(transmission,parameters)
    measured=np.array([float(transmission.detach()),*gradient.detach().cpu().tolist()])
    result=dict(mesh_um=mesh,width_um=width,width_in_cells=width/mesh,
        duration_fs=duration_fs,pml_um=pml_um,pml_cells=project.region.pml_cells,
        steps=project.region.steps,time_step_s=project.region.time_step,grid=project.region.shape,
        transmission=measured[0],reflection=float(reflection.detach()),conservation_error=abs(float((transmission+reflection).detach())-1),
        thickness_derivative_per_um=measured[1],epsilon_derivative=measured[2],
        analytic=airy().tolist(),absolute_errors=np.abs(measured-airy()).tolist(),
        relative_gradient_errors=(np.abs((measured-airy())[1:]/airy()[1:])).tolist())
    if improve:
        result['improvement_directions']=[]
        for index,scale in enumerate((.001,.01)):
            direction=torch.zeros_like(parameters)
            direction[index]=math.copysign(scale,float(gradient[index]))
            with torch.no_grad(): after,_=solve(parameters+direction)
            proposed=(parameters+direction).detach().cpu().tolist()
            result['improvement_directions'].append(dict(parameter=('thickness_um','epsilon')[index],
                step=float(direction[index]),predicted_change=float(gradient@direction),
                actual_change=float((after-transmission).detach()),analytic_change=float(airy(*proposed)[0]-airy()[0])))
    result['elapsed_seconds']=time.perf_counter()-started
    return result


def summarize(report):
    initial=[row for row in report['cases'] if row['group']=='joint']
    errors=np.array([r['absolute_errors'] for r in initial])
    report['initial_validation']=dict(gradient_relative_error_threshold=.03,
        fine_gradient_error_passed=bool(max(initial[-1]['relative_gradient_errors'])<.03),
        note='The initial 0.08 um width missed the unchanged 3% gradient criterion. The 0.06 um width is an explicit followup.')
    final=next(row for row in report['cases'] if row['group']=='regularization_followup')
    report['checks']=dict(joint_errors_decrease=bool((np.diff(errors,axis=0)<0).all()),
        followup_errors_decrease=bool((np.array(final['absolute_errors'])<errors[-1]).all()),
        fine_transmission_error=bool(final['absolute_errors'][0]<.005),
        fine_gradient_error=bool(max(final['relative_gradient_errors'])<.03),
        conservation=bool(max(row['conservation_error'] for row in report['cases'])<5e-4),
        improvement=bool(all(r['actual_change']>0 and r['analytic_change']>0 for r in final['improvement_directions'])))
    fixed=sorted([row for row in report['cases'] if row['width_um']==.12 and row['duration_fs']==90. and row['pml_um']==.4],key=lambda row:-row['mesh_um'])
    if len(fixed)==3:
        values=np.array([[row['transmission'],row['thickness_derivative_per_um'],row['epsilon_derivative']] for row in fixed])
        differences=np.abs(np.diff(values,axis=0))
        report['fixed_width_discretization_differences']=differences.tolist()
        report['checks']['fixed_width_discretization_converges']=bool((differences[1]<differences[0]).all())
    baseline=np.array([final['transmission'],final['thickness_derivative_per_um'],final['epsilon_derivative']])
    for row in report['cases']:
        if row['group'] in ('duration_control','pml_control'):
            values=np.array([row['transmission'],row['thickness_derivative_per_um'],row['epsilon_derivative']])
            row['changes_from_baseline']=np.abs(values-baseline).tolist()
            report['checks'][row['group']]=bool(np.max(np.abs(values-baseline))<1e-5)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--device',default='cuda')
    parser.add_argument('--quick',action='store_true',help='Only joint refinement and regularization followup, omit independent controls.')
    args=parser.parse_args()
    cases=[('joint',.04,.16,90.,.4),('joint',.02,.12,90.,.4),('joint',.01,.08,90.,.4),
           ('regularization_followup',.01,.06,90.,.4)]
    if not args.quick:
        cases += [('fixed_width',h,.12,90.,.4) for h in (.04,.01)]
        cases += [('duration_control',.01,.06,120.,.4),('pml_control',.01,.06,90.,.5)]
    report=dict(precision='float32',device=args.device,
        hardware=torch.cuda.get_device_name() if args.device=='cuda' else 'CPU',
        torch_version=torch.__version__,
        scope='Normal-incidence nondispersive planar slab. No claim for curved, rotated, oblique or dispersive shape convergence.',
        improvement_step_magnitudes=dict(thickness_um=.001,epsilon=.01),cases=[])
    path=Path(args.output)
    path.parent.mkdir(parents=True,exist_ok=True)
    for group,h,w,duration,pml in cases:
        row=run_case(h,w,args.device,duration,pml,improve=(group=='regularization_followup'))
        row['group']=group
        report['cases'].append(row)
        path.write_text(json.dumps(report,indent=2,allow_nan=False)+'\n',encoding='utf8')
        print(json.dumps(row),flush=True)
    summarize(report)
    path.write_text(json.dumps(report,indent=2,allow_nan=False)+'\n',encoding='utf8')
    if not all(report['checks'].values()):
        raise AssertionError(f"Physical convergence checks failed: {report['checks']}")


if __name__=='__main__':
    main()
