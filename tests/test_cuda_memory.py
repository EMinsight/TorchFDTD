"""Cached blocks must not cause false denial or count as guaranteed capacity."""
from contextlib import contextmanager

import pytest
import torch

from photonweave.cuda_memory import cuda_budget_limit


def allocator(monkeypatch,*,free=300,total=1000,reserved=400,allocated=100,after=800):
    state=dict(free=free,total=total,reserved=reserved,allocated=allocated,releases=0,devices=[])
    monkeypatch.setattr(torch.cuda,'mem_get_info',lambda device:(state['free'],state['total']))
    monkeypatch.setattr(torch.cuda,'memory_reserved',lambda device:state['reserved'])
    monkeypatch.setattr(torch.cuda,'memory_allocated',lambda device:state['allocated'])
    @contextmanager
    def selected(device):
        state['devices'].append(str(device))
        yield
    monkeypatch.setattr(torch.cuda,'device',selected)
    def release():
        state['releases']+=1;state['free']=after
    monkeypatch.setattr(torch.cuda,'empty_cache',release)
    return state


@pytest.mark.parametrize('required,budget',[(200,None),(450,400),(801,None),(900,950)])
def test_no_release_for_admitted_or_infeasible_reservations(monkeypatch,required,budget):
    state=allocator(monkeypatch)
    assert cuda_budget_limit('cuda:2',required,budget)==min(240,budget or 1000)
    assert state['releases']==0 and not state['devices']


@pytest.mark.parametrize('after,limit',[(800,600),(500,400),(100,80)])
def test_releases_once_then_uses_actual_free_memory(monkeypatch,after,limit):
    state=allocator(monkeypatch,after=after)
    assert cuda_budget_limit('cuda:2',450,600)==limit
    assert state['releases']==1 and state['devices']==['cuda:2']
    # A fragmented block, delayed free or other allocator may return less than
    # reserved-minus-allocated. That estimate never bypasses the fresh check.


@pytest.mark.parametrize('reserved,allocated',[(100,100),(80,100),(120,100)])
def test_live_or_insufficient_cached_memory_is_not_evicted(monkeypatch,reserved,allocated):
    state=allocator(monkeypatch,reserved=reserved,allocated=allocated)
    assert cuda_budget_limit('cuda',450)==240
    assert state['releases']==0


@pytest.mark.parametrize('path',['native','unified','streamed'])
def test_adjoint_admission_paths_recover_before_field_allocation(monkeypatch,path):
    from photonweave import AdjointOptions,AdjointExecutionPolicy,StreamedAdjointOptions,estimate_adjoint_memory,estimate_streamed_memory
    from photonweave.execution_tuning import _resident_reservation
    from test_differentiable import project
    p=project(steps=10)
    budget=64*1024**2
    state=allocator(monkeypatch,free=1,total=2*1024**3,reserved=1024**3,allocated=0,after=1024**3)
    def forbidden(*a,**kw):pytest.fail('Constructed fields while checking capacity')
    monkeypatch.setattr('photonweave.differentiable._System',forbidden)
    options=AdjointOptions(gpu_budget_bytes=budget,backward_kernel='fused')
    if path=='native':report=estimate_adjoint_memory(p,options,device='cuda')
    elif path=='unified':
        report=_resident_reservation(p,(p.region.shape,),AdjointExecutionPolicy(resident=options))
    else:
        report=estimate_streamed_memory(p,StreamedAdjointOptions(device='cuda',gpu_budget_bytes=budget))
    assert 0<report['gpu_reservation_bytes']<=budget
    assert state['releases']==1


def test_automatic_real_fused_backward_counts_observer_packet(monkeypatch):
    from photonweave import AdjointOptions,estimate_adjoint_memory
    from test_differentiable import project
    allocator(monkeypatch,free=1024**3,total=2*1024**3)
    p=project(steps=10)
    automatic=estimate_adjoint_memory(p,AdjointOptions(backward_kernel='auto'),device='cuda')
    explicit=estimate_adjoint_memory(p,AdjointOptions(backward_kernel='fused'),device='cuda')
    assert automatic['observer_layout_bytes']==explicit['observer_layout_bytes']>0


@pytest.mark.skipif(not torch.cuda.is_available(),reason='CUDA unavailable')
def test_real_cache_release_preserves_live_tensor_and_rechecks_capacity(monkeypatch):
    device=torch.device('cuda',torch.cuda.current_device())
    live=torch.arange(4096,device=device,dtype=torch.float64)
    expected=live.cpu().clone()
    retired=torch.empty(32*1024**2,device=device,dtype=torch.uint8)
    del retired
    torch.cuda.synchronize(device)
    assert torch.cuda.memory_reserved(device)-torch.cuda.memory_allocated(device)>=32*1024**2
    query=torch.cuda.mem_get_info
    release=torch.cuda.empty_cache
    state=dict(queries=0,releases=0)
    def pressure(selected):
        state['queries']+=1
        free,total=query(selected)
        return (1,total) if state['queries']==1 else (free,total)
    def checked_release():
        state['releases']+=1;release()
    monkeypatch.setattr(torch.cuda,'mem_get_info',pressure)
    monkeypatch.setattr(torch.cuda,'empty_cache',checked_release)
    assert cuda_budget_limit(device,1024**2,2*1024**2)>=1024**2
    assert state==dict(queries=2,releases=1)
    torch.testing.assert_close(live.cpu(),expected,rtol=0,atol=0)
