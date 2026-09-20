"""CPU-only physical limits of the fixed full-vector mode-port foundation."""
import argparse
import hashlib
import json
from pathlib import Path
import platform
import time
import numpy as np
import scipy
from scipy.optimize import brentq
import torch
from torchfdtd.mode_ports import solve_waveguide_modes,mode_power_overlap,normalized_mode_power,C0
from torchfdtd.adjoint_planes import DifferentiablePlaneResult
from dataclasses import replace


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    args=parser.parse_args()
    started=time.perf_counter()
    def row(modes):
        values=[]
        for mode in modes:
            intensity=(abs(mode.fields)**2).sum(-1)
            values.append(dict(neff=mode.neff,power=mode.power(),backward_power=mode.backward().power(),
                eigenpair_residual=mode.eigenpair_residual,maxwell_residual=mode.maxwell_residual,
                outer_three_u_cells_field_fraction=float((intensity[:3].sum()+intensity[-3:].sum())/intensity.sum()),
                component_norms=[float(np.linalg.norm(mode.fields[...,c])) for c in range(6)]))
        gram=np.array([[mode_power_overlap(a,b) for b in modes] for a in modes])
        return dict(modes=values,max_power_gram_error=float(abs(gram-np.eye(len(modes))).max()))
    k=2*np.pi/1.55
    V=k*.25*np.sqrt(4.-2.25)
    analytic=[]
    for factor in (1.,4./2.25):
        u=brentq(lambda u:u*np.tan(u)-factor*np.sqrt(V*V-u*u),1e-10,min(V,np.pi/2)-1e-10)
        analytic.append(float(np.sqrt(4.-(u/(.25*k))**2)))
    homogeneous=solve_waveguide_modes(2.25,shape=(20,16),spacing_um=(.1,.1),wavelength_um=1.55,num_modes=6)
    expected=[1.5]*2+[float(np.sqrt(2.25-(2/.1*np.sin(np.pi/20)/k)**2))]*4
    report=dict(scope='Fixed full-vector eigenmodes and synthetic directional overlaps, not validated FDTD mode injection.',
        precision='float32',backend='CPU SciPy sparse ARPACK',python=platform.python_version(),
        numpy=np.__version__,scipy=scipy.__version__,torch=torch.__version__,
        homogeneous=dict(**row(homogeneous),analytic_discrete_neff=expected),analytic_slab_neff=analytic,slab=[])
    def eps(u,v):
        return np.where(abs(u)<.25-1e-9,4.,np.where(abs(abs(u)-.25)<1e-9,3.125,2.25))
    for h,length in ((.1,4.),(.05,4.),(.025,4.),(.05,2.),(.05,6.)):
        modes=solve_waveguide_modes(eps,shape=(round(length/h),4),spacing_um=(h,.05),wavelength_um=1.55,normal='z')
        report['slab'].append(dict(mesh_um=h,box_u_um=length,**row(modes),
            absolute_neff_errors=abs(np.array([m.neff for m in modes])-analytic).tolist()))
    hybrid=solve_waveguide_modes(lambda u,v:np.where((abs(u)<.4)&(abs(v)<.25),4.,2.25),
        shape=(40,32),spacing_um=(.1,.1),wavelength_um=1.55)
    report['hybrid_rectangular_core']=row(hybrid)
    modes=solve_waveguide_modes(2.25,shape=(8,6),spacing_um=(.1,.1),wavelength_um=1.55)
    u,v=np.meshgrid(-.4+(np.arange(8)+.5)*.1,-.3+(np.arange(6)+.5)*.1,indexing='ij')
    points=np.stack([np.zeros(u.size),u.ravel(),v.ravel()],axis=1)
    reference=DifferentiablePlaneResult(fields=torch.tensor(modes[0].sample_plane(points))[None]*1e-22,
        frequency_hz=torch.tensor([C0/1.55e-6]),points_um=torch.tensor(points,dtype=torch.float32),
        weights=torch.full((len(points),),1e-14),shape=(1,8,6),normal='x',run_signature='fixed',report={})
    reverse=replace(reference,fields=torch.tensor(modes[0].backward().sample_plane(points))[None]*1e-22)
    cross=replace(reference,fields=torch.tensor(modes[1].sample_plane(points))[None]*1e-22)
    field=(reference.fields*1.3+reverse.fields*.2).detach().requires_grad_()
    def loss(value):
        plane=replace(reference,fields=value)
        return (normalized_mode_power(plane,reference,modes[0])+.3*normalized_mode_power(plane,reference,modes[0],direction='backward')).sum()
    gradient,=torch.autograd.grad(loss(field),field)
    rng=torch.Generator().manual_seed(293)
    direction=torch.complex(torch.randn(field.shape,generator=rng),torch.randn(field.shape,generator=rng))*field.detach().abs().max()
    h=1e-3
    finite=float((loss(field.detach()+h*direction)-loss(field.detach()-h*direction))/(2*h))
    adjoint=float((gradient.conj()*direction).sum().real)
    report['synthetic_overlap']=dict(backward_leakage=float(normalized_mode_power(reference,reference,modes[0],direction='backward')),
        forward_leakage_of_reverse=float(normalized_mode_power(reverse,reference,modes[0])),
        cross_polarization_leakage=float(normalized_mode_power(cross,reference,modes[0])),
        field_directional_derivative=adjoint,centered_difference=finite,finite_difference_step=h,
        relative_derivative_error=abs(adjoint-finite)/abs(finite))
    errors=np.array([r['absolute_neff_errors'] for r in report['slab'][:3]])
    box_delta=max(abs(a['neff']-b['neff']) for a,b in zip(report['slab'][1]['modes'],report['slab'][-1]['modes']))
    report['checks']=dict(slab_mesh_errors_decrease=bool((np.diff(errors,axis=0)<0).all()),
        slab_fine_neff=bool(errors[-1].max()<5e-4),box_delta=box_delta<2e-6,
        confinement=max(r['outer_three_u_cells_field_fraction'] for r in report['slab'][-1]['modes'])<1e-7,
        field_derivative=report['synthetic_overlap']['relative_derivative_error']<.003)
    report['elapsed_seconds']=time.perf_counter()-started
    root=Path(__file__).resolve().parents[1]
    report['source_sha256']={name:hashlib.sha256((root/name).read_bytes()).hexdigest()
        for name in ('torchfdtd/mode_ports.py','benchmarks/mode_ports_limits.py')}
    path=Path(args.output)
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(report,indent=2,allow_nan=False)+'\n',encoding='utf8')
    print(json.dumps(dict(checks=report['checks'],synthetic_overlap=report['synthetic_overlap'],elapsed_seconds=report['elapsed_seconds']),indent=2))
    if not all(report['checks'].values()):raise AssertionError('Physical mode checks failed.')


if __name__=='__main__':
    main()
