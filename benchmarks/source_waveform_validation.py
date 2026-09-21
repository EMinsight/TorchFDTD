"""Bounded FP32 CUDA waveform/material VJP acceptance, not a speed benchmark.

The CPU oracle unrolls the existing native functional Yee update with replaced
source columns. It does not use the new packed source-adjoint implementation.
All fields stay FP32 or complex64. Scalar error reductions use CPU FP64 only.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import time

import numpy as np
import torch

from torchfdtd import (AdjointOptions, BoundaryFace, DifferentiableSimulation,
    FieldMonitor, Monitor, Project, Region, Simulation, Source,
    SourceWaveformSimulation, SourceWaveformPlaneSimulation)
from torchfdtd.adjoint_planes import COMPONENTS
from torchfdtd.differentiable import _System
from torchfdtd.field_monitors import interpolation_map, plane_plan


def scene(complex_fields=False):
    region = Region(dimension='3d', size=(1.5,1.4,1.3), mesh=.1, pml_cells=3,
        steps=18, precision='float32', backend='cpu', cuda_kernel='fused')
    for side in ('min','max'):
        setattr(region.boundaries,'x_'+side,BoundaryFace(kind='bloch' if complex_fields else 'periodic'))
    if complex_fields: region.bloch_phase=(.31,0.,0.)
    return Project(name='Fixed source temporal derivatives',region=region,
        sources=[Source(id='eplane',kind='plane',normal='z',size=(.6,.5,0),component='Ex',pulse='continuous'),
                 Source(id='hplane',kind='plane',normal='z',size=(.6,.5,0),component='Hy',pulse='continuous'),
                 Source(id='epoint',component='Ex',pulse='continuous'),
                 Source(id='hpoint',component='Hy',pulse='continuous')],
        monitors=[Monitor(component=c,center=(0,0,0)) for c in ('Ex','Hy','Ex')])


def oracle(project,epsilon,waveforms,frequencies=None):
    system=_System(project,epsilon)
    counters={'E':0,'H':0}
    column=0
    for raw in project.sources:
        source=project.resolved_source(raw)
        if not source.enabled:continue
        for component,_ in source.polarization_components:
            family=component[0]; index=counters[family]; counters[family]+=1
            loc,axis,_,profile=system.sources[family][index]
            system.sources[family][index]=(loc,axis,waveforms[:,column],profile)
            column+=1
    state=tuple(torch.zeros_like(x) for x in system.state())
    samples=[]
    plane=project.monitors[0] if project.monitors[0].kind=='field' else None
    if plane is not None:
        plan=plane_plan(project.region,plane)
        maps=[interpolation_map(project.region,c,plan['points_um']) for c in COMPONENTS]
    for step in range(project.region.steps):
        state=system.reference_step(state,step,epsilon)
        if plane is None:samples.append(system.observe(state));continue
        fields=[]
        for component,(indices,weights) in zip(COMPONENTS,maps):
            values=(state[0 if component[0]=='E' else 1].reshape(-1)[torch.as_tensor(indices)]*
                    torch.as_tensor(weights,dtype=system.field_dtype if np.iscomplexobj(weights) else epsilon.dtype)).sum(0)
            t=(step+1+(.5 if component[0]=='H' else 0))*project.region.time_step
            # Native fixed-plane spectra use the positive exponential convention.
            fields.append(torch.exp(2j*torch.pi*frequencies[:,None]*t)*values[None,:])
        samples.append(torch.stack(fields,dim=-1))
    return torch.stack(samples).sum(0) if plane is not None else torch.stack(samples)


def error(actual,expected):
    a=actual.detach().cpu().to(torch.complex128 if actual.is_complex() else torch.float64)
    b=expected.detach().cpu().to(a.dtype)
    delta=a-b
    return dict(relative_l2=float(delta.norm()/b.norm().clamp_min(1e-30)),max_abs=float(delta.abs().max()))


def objective(values):
    return (values.real + (.3*values.imag if values.is_complex() else 0)).square().mean()


def run():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,default=Path('results/source-waveform-validation.json'))
    args=parser.parse_args()
    if not torch.cuda.is_available():raise SystemExit('A CUDA device is required, no CPU fallback.')
    torch.set_num_threads(1)
    source_root=Path(__file__).resolve().parents[1]
    source_paths=sorted((source_root/'torchfdtd').glob('*.py'))
    hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in source_paths}
    records=[]
    started=time.perf_counter()
    generator=torch.Generator().manual_seed(73141)
    for complex_fields,complex_waves in ((False,False),(True,False),(True,True)):
        p=scene(complex_fields)
        epsilon=(1.5+.1*torch.rand(p.region.shape+(3,),generator=generator)).requires_grad_()
        dtype=torch.complex64 if complex_waves else torch.float32
        waves=(.02*torch.randn((p.region.steps,4),generator=generator,dtype=dtype)).requires_grad_()
        for observation in ('point','spectrum','plane'):
            q=p.model_copy(deep=True)
            frequencies=torch.tensor([.037,.063],dtype=torch.float32)/q.region.time_step
            if observation=='plane':
                q.monitors=[FieldMonitor(id='plane',normal='z',center=(.02,.01,.1),size=(.4,.3,0),downsample=2)]
            expected=oracle(q,epsilon,waves,frequencies)
            if observation=='spectrum':
                times=(torch.arange(q.region.steps,dtype=torch.float32)+1)*q.region.time_step
                columns=[]
                for i,m in enumerate(q.monitors):
                    t=times+(.5*q.region.time_step if m.component[0]=='H' else 0)
                    columns.append(torch.exp(-2j*torch.pi*frequencies[:,None]*t)@expected[:,i].to(torch.complex64))
                expected=torch.stack(columns,dim=-1)
            expected_grads=torch.autograd.grad(objective(expected),(epsilon,waves))
            e=epsilon.detach().cuda().requires_grad_();w=waves.detach().cuda().requires_grad_()
            options=AdjointOptions(checkpoints=2,backward_kernel='fused',gpu_budget_bytes=512*1024**2)
            if observation=='plane':
                result=SourceWaveformPlaneSimulation(q,options)(e,w,frequencies.cuda(),block_size=5)['plane']
                actual=result.fields/q.region.time_step
            else:
                model=SourceWaveformSimulation(q,options)
                result=model(e,w) if observation=='point' else model.spectrum(e,w,frequencies.cuda(),block_size=5)
                actual=result.signals if observation=='point' else result.fields/q.region.time_step
            actual_grads=torch.autograd.grad(objective(actual),(e,w))
            values={'fields':error(actual,expected),'epsilon_vjp':error(actual_grads[0],expected_grads[0]),
                    'waveform_vjp':error(actual_grads[1],expected_grads[1])}
            for key,val in values.items():
                if val['relative_l2']>8e-5:raise AssertionError((complex_fields,complex_waves,observation,key,val))
            if any(float(v.norm())<=1e-12 for v in expected_grads):raise AssertionError('Degenerate VJP oracle')
            records.append(dict(complex_fields=complex_fields,complex_waveforms=complex_waves,
                observation=observation,errors=values,report=result.report))
            print(json.dumps({k:v for k,v in records[-1].items() if k!='report'}),flush=True)
            del result,actual,actual_grads,e,w
    # Independent native forward compatibility for native waveform defaults.
    p=scene();p.region.background_index=float(np.sqrt(1.6));p.region.cuda_kernel='torch'
    eps=torch.full(p.region.shape,1.6)
    model=SourceWaveformSimulation(p)
    observed=model(eps,model.default_waveforms()).signals
    native=torch.as_tensor(Simulation(p).run(cuda_graph=False).signals,dtype=observed.dtype)
    legacy=DifferentiableSimulation(p)(eps).signals
    compatibility=dict(native=error(observed,native),legacy=error(observed,legacy))
    if max(v['relative_l2'] for v in compatibility.values())>2e-5:raise AssertionError(compatibility)
    for path in source_paths:
        if hashlib.sha256(path.read_bytes()).hexdigest()!=hashes[path.name]:raise AssertionError('Runtime changed during validation')
    report=dict(status='passed',scope='Small FP32 derivative integration. No performance, physical convergence or capacity claim.',
        hardware=torch.cuda.get_device_name(),torch_version=torch.__version__,relative_l2_gate=8e-5,
        native_compatibility=compatibility,cases=records,source_sha256=hashes,wall_seconds=time.perf_counter()-started)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,indent=2)+'\n',encoding='utf8')
    print(json.dumps(dict(status=report['status'],cases=len(records),native_compatibility=compatibility,output=str(args.output))),flush=True)


if __name__=='__main__':run()
