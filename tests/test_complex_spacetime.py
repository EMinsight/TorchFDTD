"""CPU oracle for complex slab extension and its Hermitian transpose."""
import pytest
import torch
from photonweave.differentiable import _System
from photonweave.spacetime import SlabBlockOperator
from photonweave import Source, Monitor
from test_bloch_adjoint import scene


@pytest.mark.parametrize('dtype', [torch.float32, torch.float64])
@pytest.mark.parametrize('depth,nonuniform,diagonal', [(3, False, False), (10, True, True)])
@pytest.mark.parametrize('checkpoints', [0, 2])
@pytest.mark.parametrize('pml_axis', [None, 'x', 'z'])
def test_complex_slab_against_resident_autograd(dtype, depth, nonuniform, diagonal, checkpoints, pml_axis):
    p = scene(nonuniform)
    if pml_axis is not None:
        p.region.dimension = '3d'
        p.region.mesh_type = 'uniform'
        p.region.mesh_coordinates = None
        for axis in 'xyz':
            for side in ('min', 'max'):
                getattr(p.region.boundaries, axis+'_'+side).kind = 'pml' if axis == pml_axis else 'bloch'
        p.region.bloch_phase = tuple(0 if a == pml_axis else (-.47 if a == 'x' else .82) for a in 'xyz')
        center = [0., 0., 0.]
        center['xyz'.index(pml_axis)] = -.3
        size = list(p.region.size)
        size['xyz'.index(pml_axis)] = 0
        component = 'Ey' if pml_axis == 'x' else 'Ex'
        p.sources = [Source(kind='plane', normal=pml_axis, size=tuple(size), center=tuple(center),
                            component=component, pulse='continuous')]
        p.monitors = [Monitor(component=component, center=(.1,.1,.1)),
                      Monitor(component='Hz', center=(-.6,.1,.1))]
    p.region.precision = 'float64' if dtype == torch.float64 else 'float32'
    torch.manual_seed(729)
    epsilon = 1.4+torch.rand(p.region.shape+((3,) if diagonal else ()), dtype=dtype)
    host = _System(p, epsilon, prepare_updates=False)
    state = tuple(torch.randn_like(s)*.03 for s in host.state())
    endpoint = tuple(torch.randn_like(s)*.02 for s in state)
    weights = torch.randn(depth, len(host.monitors), dtype=host.field_dtype)
    old = tuple(s.clone() for s in state)
    operator = SlabBlockOperator(host, 5, 'cpu', local_checkpoints=checkpoints)
    result, signals = operator.forward(epsilon, state, 1, depth)
    bars, gradient = operator.transpose(epsilon, state, 1, depth, endpoint, weights)
    eps = epsilon.clone().requires_grad_()
    inputs = tuple(s.clone().requires_grad_() for s in state)
    current, observed = inputs, []
    for j in range(depth):
        current = host.reference_step(current, j+1, eps)
        observed.append(host.observe(current))
    observed = torch.stack(observed)
    loss = (observed.conj()*weights).real.sum()
    loss = loss+sum((s.conj()*b).real.sum() for s,b in zip(current, endpoint))
    expected = torch.autograd.grad(loss, (*inputs, eps))
    tolerance = dict(rtol=8e-5, atol=3e-6) if dtype == torch.float32 else dict(rtol=3e-10, atol=3e-12)
    for actual, want in zip(result, current):torch.testing.assert_close(actual, want, **tolerance)
    torch.testing.assert_close(signals, observed, **tolerance)
    for actual, want in zip(bars, expected[:-1]):torch.testing.assert_close(actual, want, **tolerance)
    torch.testing.assert_close(gradient, expected[-1], **tolerance)
    assert not gradient.is_complex()
    for actual, want in zip(state, old):torch.testing.assert_close(actual, want, rtol=0, atol=0)
    if depth == 10 and pml_axis != 'x':
        assert any(len(d[2]) > 2*p.region.shape[0] for d in operator.tiles(depth))


def test_complex_cuda_spatial_guard_precedes_allocation():
    p = scene()
    host = _System(p, torch.ones(p.region.shape, dtype=torch.float64), prepare_updates=False)
    with pytest.raises(ValueError, match='CPU validation'):
        SlabBlockOperator(host, 5, 'cuda')
