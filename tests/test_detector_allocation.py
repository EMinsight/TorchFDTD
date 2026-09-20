from types import SimpleNamespace
import numpy as np
import pytest
import torch
from photonweave import (quadrant_intensity_allocation,DifferentiablePlaneSimulation,
                        FieldMonitor,AdjointOptions)
from photonweave.field_monitors import plane_plan
from test_differentiable import project


def plane(fields=None):
    axis=torch.tensor([-.75,-.25,.25,.75],dtype=torch.float64)
    x,y=torch.meshgrid(axis,axis,indexing='ij')
    points=torch.stack((x.flatten(),y.flatten(),torch.zeros(16,dtype=x.dtype)),1)
    if fields is None:
        rng=torch.Generator().manual_seed(12)
        fields=torch.randn(2,16,6,generator=rng,dtype=torch.complex128)
    return SimpleNamespace(fields=fields,points_um=points,weights=torch.full((16,),.25e-12,dtype=axis.dtype),
                           normal='z',components=('Ex','Ey','Ez','Hx','Hy','Hz'))


def test_matches_independent_quadrant_integrals_and_sum():
    p=plane();transmission=torch.tensor([.7,1.1],dtype=torch.float64)
    actual=quadrant_intensity_allocation(p,transmission)
    intensity=np.sum(abs(p.fields.numpy()[...,:3])**2,axis=-1).reshape(2,4,4)
    q=np.stack([intensity[:,:2,:2].sum((1,2)),intensity[:,2:,:2].sum((1,2)),
                intensity[:,:2,2:].sum((1,2)),intensity[:,2:,2:].sum((1,2))],-1)
    expected=q/q.sum(-1,keepdims=True)*transmission.numpy()[:,None]
    np.testing.assert_allclose(actual.numpy(),expected,rtol=1e-14)
    torch.testing.assert_close(actual.sum(-1),transmission)
    shifted=plane(p.fields);shifted.points_um[:,:2]+=1
    torch.testing.assert_close(quadrant_intensity_allocation(shifted,transmission,split_um=(1,1)),actual)
    # Magnetic fields cannot alter this electric allocation proxy.
    modified=plane(p.fields.clone());modified.fields[...,3:]*=100
    torch.testing.assert_close(quadrant_intensity_allocation(modified,transmission),actual)


def test_field_and_total_transmission_gradcheck():
    p=plane();fields=p.fields.requires_grad_();t=torch.tensor([.6,.8],dtype=torch.float64,requires_grad=True)
    assert torch.autograd.gradcheck(lambda e,t:quadrant_intensity_allocation(plane(e),t),(fields,t))


@pytest.mark.parametrize('kind',['zero','negative_t','weights','missing_quadrant','normal','nan'])
def test_invalid_contract(kind):
    p=plane();t=torch.ones(2,dtype=torch.float64)
    if kind=='zero':p.fields.zero_()
    if kind=='negative_t':t[0]=-1
    if kind=='weights':p.weights[0]=0
    if kind=='missing_quadrant':p.points_um[:,0]=1
    if kind=='normal':p.normal='x'
    if kind=='nan':p.fields[0,0,0]=float('nan')
    with pytest.raises(ValueError):quadrant_intensity_allocation(p,t)


@pytest.mark.parametrize('normal',['x','y','z'])
def test_fixed_midpoint_quadrature(normal):
    size=[.8,.6,.4];size['xyz'.index(normal)]=0
    p=project(dimension='3d');m=FieldMonitor(normal=normal,center=(0,0,0),size=tuple(size),downsample=4)
    plan=plane_plan(p.region,m,(24,24));a='xyz'.index(normal)
    transverse=[i for i in range(3) if i!=a]
    assert len(plan['weights'])==576
    assert np.sum(plan['weights'])==pytest.approx(np.prod([m.size[i] for i in transverse])*1e-12)
    for i in transverse:
        np.testing.assert_allclose(np.unique(plan['points_um'][:,i]),(-.5+(np.arange(24)+.5)/24)*m.size[i])
    assert np.all(plan['points_um'][:,a]==0)


@pytest.mark.parametrize('device',['cpu','cuda'])
@pytest.mark.parametrize('bloch',[False,True])
def test_fdtd_geometry_and_allocation_directional_derivative(device,bloch):
    if device=='cuda' and not torch.cuda.is_available():pytest.skip('CUDA unavailable')
    p=project(dimension='3d',steps=14)
    if bloch:
        p.region.boundaries.x_min.kind=p.region.boundaries.x_max.kind='bloch'
        p.region.bloch_phase=(.4,0,0)
    p.monitors=[FieldMonitor(id='detector',normal='z',center=(0,0,.1),size=(.8,.8,0))]
    model=DifferentiablePlaneSimulation(p,AdjointOptions(checkpoints=2),quadrature_counts={'detector':(6,6)})
    mask=torch.zeros(p.region.shape,dtype=torch.float64,device=device);mask[5:9,5:8,5:9]=1
    def objective(x):
        output=model(1.5+x*mask,[.03/p.region.time_step])['detector']
        assert output.fields.shape==(1,36,6)
        # Synthetic total transmission isolates the joint chain rule, not optics.
        allocation=quadrant_intensity_allocation(output,(.5+x.square())[None])
        return (allocation*torch.tensor([1.,2.,3.,4.],device=device)).sum()
    x=torch.tensor(.2,dtype=torch.float64,device=device,requires_grad=True)
    gradient,=torch.autograd.grad(objective(x),x)
    with torch.no_grad():finite=(objective(x+1e-5)-objective(x-1e-5))/(2e-5)
    torch.testing.assert_close(gradient,finite,rtol=2e-6,atol=1e-8)


def test_bad_quadrature_configuration():
    p=project(dimension='3d');p.monitors=[FieldMonitor(id='p',normal='z',size=(.8,.8,0))]
    with pytest.raises(ValueError,match='IDs'):DifferentiablePlaneSimulation(p,quadrature_counts={'absent':(24,24)})
    with pytest.raises(ValueError,match='positive'):DifferentiablePlaneSimulation(p,quadrature_counts={'p':(0,24)})
