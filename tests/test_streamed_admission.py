"""Large-scene opt-in must never silently invoke a resident allocator."""
import pytest
import torch

from photonweave import Region, Simulation, DifferentiableSimulation, StreamedSimulation, StreamedAdjointOptions
from photonweave.boundaries import YeeGrid
from test_differentiable import project


def test_large_region_requires_explicit_streamed_mode():
    settings = dict(dimension='3d', size=(25.6,25.6,12.8), mesh=.1, pml_cells=3)
    with pytest.raises(ValueError,match='8 million'):
        Region(**settings)
    region = Region(**settings,memory_mode='streamed')
    assert region.shape == (256,256,128)
    assert Region.model_validate(region.model_dump()).memory_mode == 'streamed'
    with pytest.raises(ValueError,match='one million'):
        Region(dimension='3d',size=(100001,2,2),mesh=.1,pml_cells=3,memory_mode='streamed')


def test_streamed_mode_rejects_resident_entry_points_before_allocation(monkeypatch):
    p = project(steps=10)
    p.region.memory_mode = 'streamed'
    with pytest.raises(ValueError,match='StreamedSimulation'):Simulation(p)
    with pytest.raises(ValueError,match='StreamedSimulation'):YeeGrid(p.region)
    resident = DifferentiableSimulation(p)
    with pytest.raises(ValueError,match='StreamedSimulation'):resident(None)


def test_streamed_small_scene_preserves_gradient_and_budget_precedes_state(monkeypatch):
    p = project(steps=10)
    p.region.memory_mode = 'streamed'
    epsilon = torch.full(p.region.shape,1.7,dtype=torch.float64,requires_grad=True)
    expected = DifferentiableSimulation(p).reference(epsilon)
    expected_gradient, = torch.autograd.grad(expected.square().sum(),epsilon)
    model = StreamedSimulation(p,StreamedAdjointOptions(device='cpu',slab_width=4,temporal_depth=2))
    result = model(epsilon)
    actual_gradient, = torch.autograd.grad(result.signals.square().sum(),epsilon)
    torch.testing.assert_close(result.signals,expected,rtol=1e-11,atol=1e-12)
    torch.testing.assert_close(actual_gradient,expected_gradient,rtol=1e-10,atol=1e-12)
    def forbidden(*args,**kwargs):raise AssertionError('State allocated before admission')
    monkeypatch.setattr('photonweave.streamed._System',forbidden)
    rejected = StreamedSimulation(p,StreamedAdjointOptions(device='cpu',host_budget_bytes=1))
    with pytest.raises(ValueError,match='host budget'):rejected(epsilon)


def test_resident_guard_rechecks_mutated_shape():
    region = Region()
    region.dimension = '3d'
    region.size = (100,100,100)
    with pytest.raises(ValueError,match='8 million'):region.require_resident()


def test_estimate_labels_streamed_storage_scope():
    from photonweave.solver import estimate
    p = project(steps=10)
    p.region.memory_mode = 'streamed'
    assert any('not streamed budget admission' in text for text in estimate(p)['warnings'])


@pytest.mark.skipif(not torch.cuda.is_available(),reason='CUDA unavailable')
def test_tensor_batch_rejects_streamed_scene(tmp_path):
    from photonweave import run_tensor_batch
    p = project(steps=10)
    p.region.memory_mode = 'streamed'
    with pytest.raises(ValueError,match='StreamedSimulation'):
        run_tensor_batch([p],output_dir=tmp_path)


def test_local_checkpoints_are_bounded_and_charged_to_admission(monkeypatch):
    from dataclasses import replace
    from photonweave.streamed import _reservation
    p = project(steps=10)
    epsilon = torch.ones(p.region.shape,dtype=torch.float64)
    options = StreamedAdjointOptions(device='cpu',temporal_depth=4)
    baseline = _reservation(p,epsilon,options)
    policy = replace(options,local_checkpoints=2)
    expanded = _reservation(p,epsilon,policy)
    added = expanded['local_checkpoint_reservation_bytes']
    assert added == 2*18*expanded['max_extended_tile_cells']*epsilon.element_size()
    assert expanded['gpu_reservation_bytes'] == baseline['gpu_reservation_bytes']+added
    assert expanded['host_reservation_bytes'] == baseline['host_reservation_bytes']+added
    with pytest.raises(ValueError,match='host budget'):
        _reservation(p,epsilon,replace(policy,host_budget_bytes=baseline['host_reservation_bytes']))
    monkeypatch.setattr(torch.cuda,'mem_get_info',lambda *a:(2**40,2**40))
    with pytest.raises(ValueError,match='GPU budget'):
        _reservation(p,epsilon,replace(policy,device='cuda',gpu_budget_bytes=baseline['gpu_reservation_bytes']))
    for invalid in (-1,33,True,1.5):
        with pytest.raises(ValueError,match='local_checkpoints'):
            replace(options,local_checkpoints=invalid)
