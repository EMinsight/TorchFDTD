"""Large-scene opt-in must never silently invoke a resident allocator."""
import pytest
import torch

from photonweave import Region, Simulation, DifferentiableSimulation, StreamedSimulation, StreamedAdjointOptions
from photonweave.boundaries import YeeGrid
from test_differentiable import project


@pytest.mark.parametrize('diagonal',[False,True])
@pytest.mark.parametrize('complex_fields',[False,True])
def test_spectral_plan_matches_storage_execution_and_vjp(diagonal,complex_fields,tmp_path):
    from dataclasses import replace
    from photonweave import estimate_streamed_memory,select_streamed_storage
    p=project('3d',steps=10)
    p.region.size=(6.4,1.6,1.6)
    if complex_fields:
        from photonweave import BoundaryFace
        p.region.boundaries.x_min=p.region.boundaries.x_max=BoundaryFace(kind='bloch')
        p.region.bloch_phase=(.4,0,0)
    options=StreamedAdjointOptions(device='cpu',slab_width=4,temporal_depth=2,
        state_directory=tmp_path/'banks',disk_budget_bytes=1024**3)
    settings=dict(frequency_hz=[1e14,2e14],window=torch.linspace(.2,1.,10,dtype=torch.float64))
    host=select_streamed_storage(p,options,diagonal=diagonal,**settings)
    disk_plan=estimate_streamed_memory(p,replace(options,state_storage='disk'),diagonal=diagonal,**settings)
    disk=select_streamed_storage(p,replace(options,host_budget_bytes=disk_plan['host_reservation_bytes']),diagonal=diagonal,**settings)
    assert host.options.state_storage=='host' and disk.options.state_storage=='disk'
    assert not (tmp_path/'banks').exists()
    epsilon=torch.full(p.region.shape+((3,) if diagonal else ()),1.7,dtype=torch.float64,requires_grad=True)
    results=[StreamedSimulation(p,plan.options).spectrum(epsilon,**settings) for plan in (host,disk)]
    for plan,result in zip((host,disk),results):
        assert all(result.report[k]==v for k,v in plan.reservation.items())
    grads=[torch.autograd.grad(result.fields.abs().square().sum(),epsilon)[0] for result in results]
    torch.testing.assert_close(results[0].fields,results[1].fields,rtol=0,atol=0)
    torch.testing.assert_close(grads[0],grads[1],rtol=0,atol=0)
    assert not list((tmp_path/'banks').iterdir())


def test_spectral_plan_accounts_for_history_reduction_and_validates_settings():
    from dataclasses import replace
    from photonweave import estimate_streamed_memory,select_streamed_storage
    p=project(steps=10);p.region.steps=100000
    options=StreamedAdjointOptions(device='cpu',slab_width=4,temporal_depth=2)
    timed=estimate_streamed_memory(p,options)
    spectral=estimate_streamed_memory(p,options,frequency_hz=[1e14])
    assert spectral['host_reservation_bytes']<timed['host_reservation_bytes']
    bounded=replace(options,host_budget_bytes=spectral['host_reservation_bytes'])
    assert select_streamed_storage(p,bounded,frequency_hz=[1e14]).options.state_storage=='host'
    with pytest.raises(ValueError,match='host budget'):estimate_streamed_memory(p,bounded)
    with pytest.raises(ValueError,match='requires frequency'):estimate_streamed_memory(p,options,window=[1.])
    with pytest.raises(ValueError,match='Nyquist'):estimate_streamed_memory(p,options,frequency_hz=[1/p.region.time_step])
    with pytest.raises(ValueError,match='Window'):estimate_streamed_memory(p,options,frequency_hz=[1e14],window=[1.])


def test_storage_selection_prefers_host_then_explicit_disk_and_rechecks(tmp_path,monkeypatch):
    from dataclasses import replace
    from photonweave import select_streamed_storage,estimate_streamed_memory
    p=project('3d',steps=10)
    p.region.size=(6.4,1.6,1.6)
    base=StreamedAdjointOptions(device='cpu',slab_width=4,temporal_depth=2,
        state_directory=tmp_path/'scratch',disk_budget_bytes=1024**3)
    host=select_streamed_storage(p,base)
    assert host.options.state_storage=='host' and not host.rejected
    disk_size=estimate_streamed_memory(p,replace(base,state_storage='disk'))['host_reservation_bytes']
    assert disk_size<host.reservation['host_reservation_bytes']
    bounded=replace(base,host_budget_bytes=disk_size)
    disk=select_streamed_storage(p,bounded)
    assert disk.options.state_storage=='disk' and 'host' in disk.rejected
    assert disk.options.slab_width==base.slab_width
    assert not (tmp_path/'scratch').exists()
    with pytest.raises(ValueError,match='No streamed storage policy fits'):
        select_streamed_storage(p,replace(bounded,disk_budget_bytes=1))
    with pytest.raises(ValueError,match='No explicit disk'):
        select_streamed_storage(p,replace(bounded,state_directory=None,disk_budget_bytes=None))
    epsilon=torch.full(p.region.shape,1.7,dtype=torch.float64,requires_grad=True)
    expected=StreamedSimulation(p,host.options)(epsilon)
    expected_gradient,=torch.autograd.grad(expected.signals.square().sum(),epsilon)
    actual=StreamedSimulation(p,disk.options)(epsilon)
    actual_gradient,=torch.autograd.grad(actual.signals.square().sum(),epsilon)
    torch.testing.assert_close(actual.signals,expected.signals,rtol=0,atol=0)
    torch.testing.assert_close(actual_gradient,expected_gradient,rtol=0,atol=0)
    assert not list((tmp_path/'scratch').iterdir())
    # A plan is not a resource lease: changed conditions must reject execution.
    monkeypatch.setattr('photonweave.streamed.host_memory',lambda:dict(available_bytes=1))
    with pytest.raises(ValueError,match='host budget'):
        StreamedSimulation(p,disk.options)(epsilon)


def test_public_plan_handles_beyond_vram_shape_without_allocating_fields(tmp_path,monkeypatch):
    from photonweave import estimate_streamed_memory, Project, BoundaryFace
    region=Region(dimension='3d',size=(102.4,102.4,57.6),mesh=.1,steps=10,
                  pml_cells=3,precision='float64',memory_mode='streamed')
    region.boundaries.x_min=region.boundaries.x_max=BoundaryFace(kind='bloch')
    region.bloch_phase=(.63,0,0)
    p=Project(region=region)
    monkeypatch.setattr('photonweave.streamed.host_memory',lambda:dict(available_bytes=1024**4))
    monkeypatch.setattr('photonweave.state_store.disk_free',lambda _:1024**4)
    def forbidden(*args,**kwargs):raise AssertionError('Field system allocated during planning')
    monkeypatch.setattr('photonweave.streamed._System',forbidden)
    options=StreamedAdjointOptions(device='cpu',state_storage='disk',state_directory=tmp_path/'absent',
        disk_budget_bytes=280*1024**3,host_budget_bytes=76*1024**3,
        slab_width=16,temporal_depth=2,checkpoints=0)
    result=estimate_streamed_memory(p,options)
    assert result['state_bytes']==58506346496
    assert result['disk_reservation_bytes']==5*result['state_bytes']
    assert not (tmp_path/'absent').exists()


@pytest.mark.parametrize('diagonal',[False,True])
def test_public_memory_plan_matches_execution_without_domain_allocation(diagonal,monkeypatch):
    from photonweave import estimate_streamed_memory
    p=project(steps=10)
    options=StreamedAdjointOptions(device='cpu',slab_width=4,temporal_depth=2)
    original=torch.empty
    requests=[]
    def checked_empty(*args,**kwargs):
        requests.append((args,kwargs.get('device')))
        return original(*args,**kwargs)
    with monkeypatch.context() as patch:
        patch.setattr(torch,'empty',checked_empty)
        estimate=estimate_streamed_memory(p,options,diagonal=diagonal)
    domain_shape=p.region.shape+((3,) if diagonal else ())
    assert any(args==(domain_shape,) and device=='meta' for args,device in requests)
    assert all(device=='meta' for args,device in requests if args==(domain_shape,))
    result=StreamedSimulation(p,options)(torch.full(domain_shape,1.7,dtype=torch.float64))
    assert all(result.report[key]==value for key,value in estimate.items())


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


def test_storage_only_initial_state_is_small_and_cannot_be_advanced_in_place():
    from photonweave.differentiable import _System
    from photonweave.spacetime import SlabBlockOperator
    p = project(dimension='3d',steps=10,periodic=True)
    epsilon = torch.full(p.region.shape,1.7,dtype=torch.float64)
    host = _System(p,epsilon,prepare_updates=False)
    assert host.grid.inverse_permittivity is None
    assert all(s.untyped_storage().nbytes()==epsilon.element_size() for s in host.state())
    from photonweave.streamed import _reservation
    admitted = _reservation(p,epsilon,StreamedAdjointOptions(device='cpu'))
    assert admitted['host_initial_state_reservation_bytes'] == sum(s.untyped_storage().nbytes() for s in host.state())
    assert all(torch.count_nonzero(s)==0 for s in host.state())
    with pytest.raises(RuntimeError,match='Storage-only'):host.advance(0,1)
    operator = SlabBlockOperator(host,4,'cpu',local_checkpoints=1)
    state,signals = operator.forward(epsilon,host.state(),0,3)
    _,later = operator.forward(epsilon,state,3,3)
    assert all(torch.count_nonzero(s)==0 for s in host.state())
    dense = _System(p,epsilon)
    dense.advance(0,6)
    torch.testing.assert_close(later[-1],dense.observe(dense.state()),rtol=1e-12,atol=1e-13)
