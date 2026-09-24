"""Memory admission of the full-autograd reference oracles."""
import math

import pytest
import torch

from torchfdtd import BoundaryFace, DifferentiableSimulation, DispersiveSimulation
from torchfdtd import oracle_memory
from torchfdtd.differentiable import _System
from torchfdtd.dispersive_adjoint import _DispersiveSystem
from torchfdtd.oracle_memory import admit_oracle, oracle_graph_bytes, oracle_requirements, oracle_state_bytes
from test_differentiable import project

GIB = 1024**3


def host(monkeypatch, available):
    """Fix the available host memory seen by every admission."""
    import torchfdtd.memory_profile as profile
    monkeypatch.setattr(profile, 'host_memory', lambda: {'total_bytes': 2*available, 'available_bytes': available})
    monkeypatch.setattr(oracle_memory, 'host_memory', profile.host_memory)


def state_bytes(system):
    return sum(x.numel()*x.element_size() for x in system.state())


@pytest.mark.parametrize('dimension,precision,boundary', [('2d', 'float64', 'pml'), ('3d', 'float32', 'periodic'),
                                                          ('3d', 'float64', 'bloch')])
def test_state_bytes_count_every_restart_array(dimension, precision, boundary):
    p = project(dimension, precision, steps=10, periodic=boundary == 'periodic')
    if boundary == 'bloch':
        p.region.boundaries.x_min = p.region.boundaries.x_max = BoundaryFace(kind='bloch')
        p.region.bloch_phase = (.3, 0, 0)
    dtype = torch.float64 if precision == 'float64' else torch.float32
    epsilon = torch.full(p.region.shape, 1.5, dtype=dtype)
    assert oracle_state_bytes(p.region) == state_bytes(_System(p, epsilon))
    model = DispersiveSimulation(p)
    parameters, layout = model._pack(epsilon, torch.tensor([1e30, 2e30], dtype=dtype), 1e15, 1e14)
    system = _DispersiveSystem(p, epsilon, parameters, layout)
    assert oracle_state_bytes(p.region, pole_count=2) == state_bytes(system)


def test_state_bytes_include_stored_pmc_faces_and_their_pole_banks():
    from test_pmc_general import gradient_scene, random_epsilon
    p = gradient_scene('float64')
    epsilon = random_epsilon(p.region, 3)
    assert oracle_state_bytes(p.region) == state_bytes(_System(p, epsilon))
    parameters, layout = DispersiveSimulation(p)._pack(epsilon, torch.tensor([1e30], dtype=torch.float64), 1e15, 1e14)
    assert oracle_state_bytes(p.region, pole_count=1) == state_bytes(_DispersiveSystem(p, epsilon, parameters, layout))


def test_graph_estimate_formula():
    p = project(steps=100)
    r = p.region
    steps = r.steps+oracle_memory.GRAPH_EXTRA_STEPS
    unit = oracle_state_bytes(r)
    small = oracle_memory.GRAPH_SMALL_TENSOR_BYTES
    yee = oracle_graph_bytes(r, 'yee')
    assert yee['tensor_bytes'] == math.ceil(steps*(oracle_memory.GRAPH_TENSOR_FACTORS['yee']*unit+small))
    assert yee['node_bytes'] == steps*oracle_memory.GRAPH_NODE_BYTES['yee']
    # CPU tensors and nodes share host memory with the first-call allowance.
    fixed = oracle_memory.GRAPH_FIXED_HOST_BYTES['cpu']
    assert oracle_requirements(yee, 'cpu') == dict(graph=yee['tensor_bytes']+yee['node_bytes']+fixed,
                                                   host=yee['tensor_bytes']+yee['node_bytes']+fixed)
    ade = oracle_graph_bytes(r, 'ade', pole_count=3)
    assert ade['tensor_bytes'] == math.ceil(steps*(oracle_memory.GRAPH_TENSOR_FACTORS['ade']*oracle_state_bytes(r, 3)+small))
    # Tensor ADE: 2P+1 operator applications plus 1+P per Neumann term, three components each.
    applies = 2*2+1+5*(1+2)
    tensor = oracle_graph_bytes(r, 'tensor_ade', pole_count=2, iterations=5)
    tensor_unit = oracle_state_bytes(r, 2)+3*math.prod(r.shape)*8*applies
    assert tensor['tensor_bytes'] == math.ceil(steps*(oracle_memory.GRAPH_TENSOR_FACTORS['tensor_ade']*tensor_unit+small))
    assert tensor['node_bytes'] == steps*oracle_memory.GRAPH_NODE_BYTES['tensor_ade']*applies
    r.steps = 200
    longer = oracle_graph_bytes(r, 'yee')
    assert longer['tensor_bytes']-yee['tensor_bytes'] == pytest.approx(100*(oracle_memory.GRAPH_TENSOR_FACTORS['yee']*unit+small), abs=1)


def test_calibration_record_bounds_every_measured_peak():
    import json
    from pathlib import Path
    record = json.loads((Path(__file__).resolve().parents[1]/'docs/validation/oracle_graph_memory.json').read_text())
    assert record['estimate']['tensor_factors'] == oracle_memory.GRAPH_TENSOR_FACTORS
    assert record['estimate']['node_bytes'] == oracle_memory.GRAPH_NODE_BYTES
    assert record['estimate']['small_tensor_bytes'] == oracle_memory.GRAPH_SMALL_TENSOR_BYTES
    assert record['estimate']['extra_steps'] == oracle_memory.GRAPH_EXTRA_STEPS
    assert record['estimate']['fixed_host_bytes'] == oracle_memory.GRAPH_FIXED_HOST_BYTES
    assert {c['device'] for c in record['cases']} == {'cpu', 'cuda'}
    for case in record['cases']:
        assert case['estimate_bytes'] >= case['peak_bytes'], case['case']
        if case['device'] == 'cuda' and case['new_process_peak']:
            assert case['host_estimate_bytes'] >= case['host_peak_bytes'], case['case']


def test_old_cell_step_cap_no_longer_refuses_below_memory(monkeypatch):
    # 3360 cells x 600 steps passed the old two-million cell-step cap by 16,000.
    host(monkeypatch, 64*GIB)
    p = project('3d', 'float32', steps=600, periodic=True)
    assert math.prod(p.region.shape)*p.region.steps > 2_000_000
    shape = p.region.shape+(3,)
    epsilon = torch.full(shape, 1.5, requires_grad=True)
    signals = DifferentiableSimulation(p).reference(epsilon)
    gradient, = torch.autograd.grad(signals.square().sum(), epsilon)
    assert signals.shape == (600, 3) and torch.isfinite(gradient).all()
    # The ADE and tensor ADE products also clear their old caps before any allocation.
    region = project('2d', steps=10**4).region
    assert admit_oracle(oracle_graph_bytes(region, 'ade', pole_count=4), 'cpu')['oracle_graph_bytes'] < .8*64*GIB


def test_over_large_graph_is_refused_with_estimate_memory_and_cap_option(monkeypatch):
    host(monkeypatch, 8*GIB)
    model = DifferentiableSimulation(project(steps=10))
    model.project.region.steps = 10**7
    epsilon = torch.full(model.project.region.shape, 1.5, dtype=torch.float64)
    monkeypatch.setattr('torchfdtd.differentiable._System', lambda *a, **k: pytest.fail('Oracle allocated fields'))
    with pytest.raises(ValueError) as error:
        model.reference(epsilon)
    message = str(error.value)
    required = oracle_requirements(oracle_graph_bytes(model.project.region, 'yee'), 'cpu')['graph']
    assert f'{required:,} bytes of retained graph' in message
    assert f'80% of {8*GIB:,} bytes of available host memory' in message
    assert 'graph_budget_bytes' in message


def test_user_cap_refuses_and_admits(monkeypatch):
    host(monkeypatch, 64*GIB)
    p = project(steps=12)
    epsilon = torch.full(p.region.shape, 1.5, dtype=torch.float64, requires_grad=True)
    model = DifferentiableSimulation(p)
    required = oracle_requirements(oracle_graph_bytes(p.region, 'yee'), 'cpu')['graph']
    with pytest.raises(ValueError, match=f'graph_budget_bytes={required-1:,}'):
        model.reference(epsilon, graph_budget_bytes=required-1)
    assert model.reference(epsilon, graph_budget_bytes=required).shape == (12, 3)
    for bad in (0, -1, True, 1.5):
        with pytest.raises(ValueError, match='positive integer'):
            model.reference(epsilon, graph_budget_bytes=bad)
    dispersive = DispersiveSimulation(p)
    ade = oracle_requirements(oracle_graph_bytes(p.region, 'ade', pole_count=1), 'cpu')['graph']
    with pytest.raises(ValueError, match=f'graph_budget_bytes={ade-1:,}'):
        dispersive.reference(epsilon, [1e30], 1e15, 2e14, graph_budget_bytes=ade-1)


def test_cuda_graph_uses_free_device_memory_and_host_nodes(monkeypatch):
    if not torch.cuda.is_available():
        pytest.skip('CUDA unavailable')
    host(monkeypatch, 64*GIB)
    monkeypatch.setattr(torch.cuda, 'mem_get_info', lambda device=None: (GIB, 12*GIB))
    region = project('3d', steps=10).region
    region.steps = 10**5
    estimate = oracle_graph_bytes(region, 'yee')
    assert estimate['tensor_bytes'] > .8*GIB
    with pytest.raises(ValueError, match=f'80% of {GIB:,} bytes of free CUDA memory'):
        admit_oracle(estimate, 'cuda')
    # Graph nodes stay in host memory when the tensors are on the device.
    with pytest.raises(ValueError, match='host memory for the graph nodes'):
        admit_oracle(dict(tensor_bytes=1, node_bytes=60*GIB), 'cuda')
    from torchfdtd.adjoint_memory import _spectral_library_reservation
    library = _spectral_library_reservation(torch.device('cuda'))
    assert admit_oracle(dict(tensor_bytes=1, node_bytes=1), 'cuda') == dict(
        oracle_graph_bytes=1+library, oracle_host_bytes=1+oracle_memory.GRAPH_FIXED_HOST_BYTES['cuda'])
