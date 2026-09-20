"""Actual native modal FDTD propagation and fixed-source scattering adjoint."""
import argparse
import hashlib
import json
from pathlib import Path
import time
import numpy as np
import torch
from torchfdtd import Project,Region,Source,FieldMonitor,Boundaries,BoundaryFace,AdjointOptions
from torchfdtd.mode_injection import (prepare_modal_launch,ModeInjectedPlaneSimulation,
    modal_s_parameters,modal_plane_amplitudes,_profile)
from torchfdtd.mode_ports import C0


def make_case(kind='homogeneous',direction='+',steps=1300,normal='x'):
    width=4. if kind=='slab' else 2.
    w='xyz'.index(normal)
    axes=(w,(w+1)%3,(w+2)%3)
    def xyz(values):return tuple(values[axes.index(i)] for i in range(3))
    boundaries=Boundaries(**{axis+'_'+side:BoundaryFace(kind='periodic') for axis in 'xyz' if axis!=normal for side in ('min','max')})
    region=Region(dimension='3d',size=xyz((8,width,1.2)),mesh=.1,pml_cells=8,steps=steps,
        precision='float32',material_sampling='yee',boundaries=boundaries)
    d=1 if direction=='+' else -1
    project=Project(region=region,sources=[Source(kind='plane',normal=normal,direction=direction,
        center=xyz((-2*d,0,0)),size=xyz((0,width,1.2)),pulse_cycles=2)],monitors=[
            FieldMonitor(id=key,center=xyz((x*d,0,0)),size=xyz((0,width,1.2)),normal=normal)
            for key,x in [('outside',-2.8),('near',-1.),('far',1.)]])
    epsilon=(lambda u,v:np.where(abs(u)<.25-1e-9,4.,np.where(abs(abs(u)-.25)<1e-9,3.125,2.25))) if kind=='slab' else 2.25
    return project,epsilon


def run_physical_validation(device='cuda'):
    started=time.perf_counter()
    report=dict(device=device,hardware=torch.cuda.get_device_name() if device=='cuda' else 'CPU',
        precision='float32',torch=torch.__version__,cases=[],scope='Actual native resident modal Yee/CPML source, detectors and fixed-source material adjoint. No PML transverse eigenmodes or mode-profile differentiation.')
    for kind,direction,normal in [('homogeneous','+','x'),('slab','+','x'),('homogeneous','-','x'),('homogeneous','+','y'),('homogeneous','+','z')]:
        p,epsilon=make_case(kind,direction,normal=normal)
        launch=prepare_modal_launch(p,epsilon)
        model=ModeInjectedPlaneSimulation(p,launch,AdjointOptions(checkpoints=8))
        cross_section=np.stack([_profile(launch.epsilon[...,c],normal) for c in range(3)],axis=-1)
        base=torch.tensor(np.broadcast_to(cross_section,p.region.shape+(3,)).copy(),device=device)
        frequency=[C0/1.55e-6]
        with torch.no_grad():reference=model(base,frequency)
        amplitudes={key:modal_plane_amplitudes(plane,launch) for key,plane in reference.items()}
        f,b=('forward','backward') if direction=='+' else ('backward','forward')
        incident=amplitudes['near'][f]
        ratio=amplitudes['far'][f]/incident
        expected=np.exp(2j*launch.mode.beta_per_um)
        other=prepare_modal_launch(p,epsilon,mode_index=1)
        cross=modal_plane_amplitudes(reference['far'],other)[f]
        row=dict(kind=kind,direction=direction,normal=normal,grid=p.region.shape,steps=p.region.steps,
            duration_fs=p.region.steps*p.region.time_step*1e15,
            neff_discrete=launch.mode.neff,beta_per_um=launch.mode.beta_per_um,
            beta_tilde_per_um=launch.beta_tilde_per_um,temporal_k_per_um=launch.temporal_k_per_um,
            propagation_ratio=[float(ratio.real),float(ratio.imag)],
            expected_propagation_ratio=[float(expected.real),float(expected.imag)],
            complex_propagation_error=float(abs(ratio-expected)),
            relative_counterpropagating_power=float((amplitudes['far'][b]/amplitudes['far'][f]).abs().square()),
            outside_source_power_ratio=float((amplitudes['outside'][b]/incident).abs().square()),
            cross_mode_power_ratio=float((cross/amplitudes['far'][f]).abs().square()),
            mode_residual=launch.mode.maxwell_residual,
            source_storage_bytes=launch.storage_bytes)
        assert row['complex_propagation_error']<1e-3
        assert row['relative_counterpropagating_power']<1e-5
        assert row['outside_source_power_ratio']<1e-5
        assert row['cross_mode_power_ratio']<1e-6
        if kind=='slab':
            mask=torch.zeros_like(base)
            mask[38:42,18:23,:,:]=1
            parameter=torch.tensor(.3,device=device,requires_grad=True)
            def solve(value):
                sample=model(base+value*mask,frequency)
                t=modal_s_parameters(sample['far'],reference['far'],launch)['transmission']
                r=modal_s_parameters(sample['near'],reference['near'],launch)['reflection']
                return t.abs().square().sum(),t,r
            loss,t,r=solve(parameter)
            derivative,=torch.autograd.grad(loss,parameter)
            h=.003
            with torch.no_grad():finite=(solve(parameter+h)[0]-solve(parameter-h)[0])/(2*h)
            row['scattering']=dict(epsilon_increment=float(parameter.detach()),mask_cells=int(mask[...,0].sum()),
                transmission=[float(t.real.detach()),float(t.imag.detach())],
                reflection=[float(r.real.detach()),float(r.imag.detach())],
                transmitted_modal_power=float(loss.detach()),gradient=float(derivative),finite_difference=float(finite),
                finite_difference_step=h,relative_gradient_error=float(abs((derivative-finite)/finite)))
            assert row['scattering']['relative_gradient_error']<.003
            assert row['scattering']['transmitted_modal_power']<.999
        report['cases'].append(row)
    report['elapsed_seconds']=time.perf_counter()-started
    root=Path(__file__).resolve().parents[1]
    report['source_sha256']={name:hashlib.sha256((root/name).read_bytes()).hexdigest()
        for name in ('torchfdtd/mode_injection.py','torchfdtd/mode_ports.py','benchmarks/mode_injection.py')}
    return report


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--device',default='cuda')
    args=parser.parse_args()
    report=run_physical_validation(args.device)
    path=Path(args.output)
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(report,indent=2,allow_nan=False)+'\n',encoding='utf8')
    print(json.dumps(report,indent=2))


if __name__=='__main__':main()
