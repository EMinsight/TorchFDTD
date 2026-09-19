import pytest
import torch

from photonweave import AdjointOptions,DifferentiableSimulation
from photonweave.cuda_adjoint import FusedAdjointCUDA
from photonweave.differentiable import _System
from test_differentiable import project,gpu


@pytest.mark.parametrize('precision',['float32','float64'])
@pytest.mark.parametrize('periodic,diagonal',[(False,False),(True,True)])
def test_random_physical_and_adjoint_state_transpose(precision,periodic,diagonal):
    gpu()
    p=project('3d',precision=precision,steps=12,periodic=periodic)
    dtype=getattr(torch,precision)
    generator=torch.Generator(device='cuda').manual_seed(82)
    eps=1.4+torch.rand(p.region.shape+((3,) if diagonal else ()),device='cuda',dtype=dtype,generator=generator)
    system=_System(p,eps)
    for state in system.state():state.copy_(torch.randn(state.shape,device='cuda',dtype=dtype,generator=generator))
    adjoint=tuple(torch.randn(x.shape,device='cuda',dtype=dtype,generator=generator) for x in system.state())
    signals=torch.randn((len(system.monitors),3),device='cuda',dtype=dtype,generator=generator).T
    gradient=torch.zeros_like(eps)
    fused=FusedAdjointCUDA(system,gradient,signals)
    fused.e_bar.copy_(adjoint[0]);fused.h_bar.copy_(adjoint[1])
    for target,value in zip(fused.psi_bars[0],adjoint[2:]):target.copy_(value)
    expected=tuple(x.clone() for x in adjoint)
    total=torch.zeros_like(eps)
    tolerance=2e-6 if precision=='float32' else 2e-13
    for step in (2,1,0):
        expected,part=system.transpose_step(system.state(),expected,signals[step])
        total.add_(part)
        fused.step(step)
        actual=(fused.e_bar,fused.h_bar,*fused.psi_bars[fused.phase])
        for a,b in zip(actual,expected):torch.testing.assert_close(a,b,rtol=tolerance,atol=tolerance)
        torch.testing.assert_close(gradient,total,rtol=tolerance,atol=tolerance)


def test_fused_rejects_cpu_and_unknown_selection():
    with pytest.raises(ValueError,match='backward_kernel'):AdjointOptions(backward_kernel='invalid')
    p=project()
    with pytest.raises(ValueError,match='CUDA'):
        DifferentiableSimulation(p,AdjointOptions(backward_kernel='fused'))(torch.ones(p.region.shape,dtype=torch.float64))
