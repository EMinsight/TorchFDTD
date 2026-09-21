"""Metadata admission only, including emulated CUDA arithmetic without CUDA."""
from types import SimpleNamespace

import pytest
import torch

from torchfdtd.reversible_cpml_memory import _cpml_reversible_reservation


def options(storage='device', **budgets):
    return SimpleNamespace(trace_storage=storage, collar_cells=1, **budgets)


def mock_base(monkeypatch):
    import torchfdtd.adjoint_memory as base
    import torchfdtd.memory_profile as host
    import torchfdtd.cuda_memory as cuda
    calls = []
    def reserve(project, opts, device):
        assert opts.checkpoints == 1 and opts.storage == 'device'
        assert opts.host_budget_bytes is opts.gpu_budget_bytes is None
        assert opts.backward_kernel == ('fused' if device.type == 'cuda' else 'torch')
        calls.append(opts.resident_budget_bytes)
        return dict(memory_reservation_bytes=1000, host_reservation_bytes=1000 if device.type == 'cpu' else 100,
            workspace_reservation_bytes=400, workspace_components_bytes={'base': 400},
            workspace_model='test', allocation_headroom_bytes=20,
            device_checkpoint_reservation_bytes=900, output_history_bytes=80)
    monkeypatch.setattr(base, '_resident_reservation', reserve)
    monkeypatch.setattr(host, 'host_memory', lambda: {'available_bytes': 10**12})
    monkeypatch.setattr(cuda, 'cuda_budget_limit', lambda device, required, budget: budget or 10**12)
    project = SimpleNamespace(region=SimpleNamespace(shape=(4, 3, 8), steps=10), sources=[])
    return project, calls


@pytest.mark.parametrize('device,storage', [('cpu', 'device'), ('cpu', 'cpu'), ('cuda', 'device'), ('cuda', 'cpu')])
def test_complete_arithmetic_and_metadata_only(monkeypatch, device, storage):
    p, calls = mock_base(monkeypatch)
    monkeypatch.setattr(torch, 'empty', lambda *a, **k: pytest.fail('tensor allocation'))
    monkeypatch.setattr(torch, 'tensor', lambda *a, **k: pytest.fail('tensor allocation'))
    result = _cpml_reversible_reservation(p, options(storage, resident_budget_bytes=10**8), device, (2, 5))
    diagnostic = 24*(3*4*3*4)+4096
    material, frame, trace = 3*96*4, 4*12*4, 10*4*12*4
    transfer = 2*frame if device == 'cuda' and storage == 'cpu' else 0
    active_extra = diagnostic+material+transfer+(trace if device == 'cuda' and storage == 'device' else 0)
    headroom = (active_extra+19)//20+4096 if device == 'cuda' else 0
    host_extra = (trace if device == 'cpu' or storage == 'cpu' else 0)+(frame if transfer else 0)
    expected_active = 1000+active_extra+headroom+(host_extra if device == 'cpu' else 0)
    expected_host = (1000+active_extra if device == 'cpu' else 100)+host_extra
    assert result['memory_reservation_bytes'] == expected_active
    assert result['host_reservation_bytes'] == expected_host
    assert result['trace_bytes'] == trace
    assert result['trace_shape'] == (10, 2, 4, 3, 2)
    assert result['trace_transfer_device_bytes'] == transfer
    assert result['terminal_state_bytes'] == 6*12*4*4
    assert result['terminal_state_allowance_bytes'] == 900
    assert result['checkpoint_states'] == result['device_checkpoint_reservation_bytes'] == 0
    assert result['diagnostic_buffer_bytes'] == 24*144
    assert result['retained_caller_inputs_bytes'] == 2*96*4
    assert result['conservative_extra_active_bytes'] == active_extra+headroom
    assert calls == [10**8]


@pytest.mark.parametrize('device,storage,budget', [
    ('cpu', 'cpu', 'host_budget_bytes'), ('cpu', 'device', 'resident_budget_bytes'),
    ('cuda', 'device', 'gpu_budget_bytes'), ('cuda', 'cpu', 'host_budget_bytes'),
    ('cuda', 'cpu', 'resident_budget_bytes')])
def test_extras_cannot_bypass_budget(monkeypatch, device, storage, budget):
    p, _ = mock_base(monkeypatch)
    with pytest.raises(ValueError, match='budget'):
        _cpml_reversible_reservation(p, options(storage, **{budget: 1000}), device, (2, 5))


def test_live_host_limit_and_invalid_metadata(monkeypatch):
    p, _ = mock_base(monkeypatch)
    import torchfdtd.memory_profile as host
    monkeypatch.setattr(host, 'host_memory', lambda: {'available_bytes': 1100})
    with pytest.raises(ValueError, match='available host memory'):
        _cpml_reversible_reservation(p, options('cpu'), 'cuda', (2, 5))
    for opts, span, match in [(options('disk'), (2, 5), 'storage'),
                              (options(), (-1, 5), 'interval'),
                              (options(host_budget_bytes=True), (2, 5), 'positive integer')]:
        with pytest.raises(ValueError, match=match):
            _cpml_reversible_reservation(p, opts, 'cpu', span)


def test_real_cpml_budgeted_metadata_plan():
    from torchfdtd.models import Monitor, Project, Region, Source
    faces = {a+'_'+side: {'kind': 'periodic'} for a in 'xy' for side in ('min', 'max')}
    faces.update(z_min={'kind': 'pml', 'layers': 3}, z_max={'kind': 'pml', 'layers': 4})
    project = Project(region=Region(dimension='3d', size=(.6, .7, 2), mesh=.1,
        steps=10, backend='cpu', memory_mode='budgeted', boundaries=faces),
        sources=[Source(component='Ex', center=(0, 0, 0))],
        monitors=[Monitor(component='Ex', center=(0, 0, 0))])
    result = _cpml_reversible_reservation(project,
        options('cpu', resident_budget_bytes=64*1024**2), 'cpu', (4, 14))
    assert result['budgeted_resident']
    assert result['terminal_state_allowance_bytes'] > result['terminal_state_bytes']
    assert result['trace_bytes'] == 10*4*6*7*4
    assert result['source_preparation_host_bytes'] == 10*(128+32)
    assert result['gpu_reservation_bytes'] == 0
    assert result['host_reservation_bytes'] == result['memory_reservation_bytes']
