import gc

import numpy as np
import pytest
import torch

from photonweave.cuda_kernels import _compile, _direct_cuda_view
from photonweave.tile_workspace import TileWorkspace
from test_differentiable import gpu


def test_workspace_reuses_storage_and_invalidates_old_pointer_bindings():
    workspace = TileWorkspace('cpu', cache_entries=2)
    value = workspace.array('payload', (20,), torch.float64)
    pointer = value.data_ptr()
    assert workspace.array('payload', (10,), torch.float64).data_ptr() == pointer
    calls = []
    def bind(tensor):
        calls.append(tensor.data_ptr())
        return tensor.detach()
    first = workspace.cuda_arguments('source', [value], bind)
    assert workspace.cuda_arguments('source', [value], bind) is first
    assert len(calls) == 1
    larger = workspace.array('payload', (40,), torch.float64)
    assert not workspace.bindings
    assert larger.data_ptr() != pointer
    for key in ('a', 'b', 'c'):workspace.cuda_arguments(key, [larger], bind)
    assert len(workspace.bindings) == 2
    assert workspace.allocated_bytes == 320


def test_direct_view_owns_offset_allocation_on_nondefault_stream():
    gpu()
    import cupy
    producer = torch.arange(128, device='cuda', dtype=torch.float64)
    selected = producer[8:120]
    expected = selected.cpu().numpy().copy()*2
    stream = torch.cuda.Stream()
    stream.wait_stream(torch.cuda.current_stream())
    with torch.cuda.stream(stream), cupy.cuda.Device(torch.cuda.current_device()), cupy.cuda.ExternalStream(stream.cuda_stream):
        array = _direct_cuda_view(cupy, selected)
        assert array.data.ptr == selected.data_ptr()
        del selected, producer
        gc.collect()
        code = 'extern "C" __global__ void scale(double* a){int i=threadIdx.x;if(i<112)a[i]*=2.0;}'
        kernel, module = _compile(code, torch.cuda.current_device(), cupy.cuda.Device().compute_capability, 'scale')
        kernel((1,), (128,), (array,))
        actual = cupy.asnumpy(array)
    np.testing.assert_array_equal(actual, expected)
    with pytest.raises(ValueError, match='contiguous CUDA'):
        _direct_cuda_view(cupy, torch.ones(4))


@pytest.mark.parametrize('binding', ['direct', 'dlpack'])
@pytest.mark.parametrize('buffers', [0, 1, 2, 3])
def test_reused_streamed_workspaces_match_unreused_on_nondefault_stream(binding, buffers):
    gpu()
    from photonweave import StreamedAdjointOptions, StreamedSimulation
    from test_differentiable import project
    from dataclasses import replace
    p = project(steps=13, periodic=False)
    options = StreamedAdjointOptions(slab_width=3, temporal_depth=2, cuda_binding=binding,
                                     tile_transfers='async' if buffers else 'sync', tile_buffers=buffers or 1)
    epsilon = torch.full(p.region.shape, 1.8, dtype=torch.float64, requires_grad=True)
    expected = StreamedSimulation(p, replace(options, reuse_tile_buffers=False, tile_transfers='sync'))(epsilon)
    wanted, = torch.autograd.grad(expected.signals.square().sum(), epsilon)
    stream = torch.cuda.Stream()
    stream.wait_stream(torch.cuda.current_stream())
    with torch.cuda.stream(stream):
        independent = epsilon.detach().clone().requires_grad_()
        result = StreamedSimulation(p, options)(independent)
        got, = torch.autograd.grad(result.signals.square().sum(), independent)
    torch.cuda.current_stream().wait_stream(stream)
    torch.testing.assert_close(result.signals, expected.signals, rtol=0, atol=0)
    torch.testing.assert_close(got, wanted, rtol=0, atol=0)
    assert result.report['backward_workspace']['binding_hits'] > 0
    if buffers:
        assert result.report['backward_workspace']['h2d_bytes'] > 0
        assert result.report['backward_workspace']['d2h_bytes'] > 0
        assert result.report['backward_workspace']['pinned_bytes'] > 0


@pytest.mark.parametrize('failure_point', ['_tile', '_return'])
def test_async_pipeline_drains_after_partial_failure_and_can_retry(monkeypatch, failure_point):
    gpu()
    from photonweave.differentiable import _System
    from photonweave.spacetime import SlabBlockOperator
    from test_differentiable import project
    p = project(steps=10, periodic=True)
    epsilon = torch.full(p.region.shape, 1.6, dtype=torch.float64)
    host = _System(p, epsilon)
    operation = SlabBlockOperator(host, 3, tile_transfers='async', tile_buffers=2)
    original = getattr(operation, failure_point)
    calls = 0
    def fail_second(*args, **kwargs):
        nonlocal calls
        calls += 1
        if calls == 2:raise RuntimeError('injected tile preparation failure')
        return original(*args, **kwargs)
    monkeypatch.setattr(operation, failure_point, fail_second)
    with pytest.raises(RuntimeError, match='injected'):operation.forward(epsilon, host.state(), 0, 2)
    assert all(not w.events for w in operation.workspaces)
    monkeypatch.setattr(operation, failure_point, original)
    got, signals = operation.forward(epsilon, host.state(), 0, 2)
    expected, observed = SlabBlockOperator(host, 3).forward(epsilon, host.state(), 0, 2)
    for actual, want in zip(got, expected):torch.testing.assert_close(actual, want, rtol=0, atol=0)
    torch.testing.assert_close(signals, observed, rtol=0, atol=0)
