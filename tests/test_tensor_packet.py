import pytest
import torch
from photonweave.tensor_packet import pack_tensors
from photonweave.spacetime import _host_copies


def test_mixed_precision_complex_integer_and_alignment():
    values=(torch.tensor([2**60+3],dtype=torch.int64),
            torch.tensor([1.,-0.,float('inf')],dtype=torch.float32),
            torch.tensor([[1+2j,-3+4j]],dtype=torch.complex128).conj(),
            torch.arange(6,dtype=torch.float64).reshape(2,3).T,
            torch.tensor([True,False]),torch.empty((0,3),dtype=torch.float64),
            torch.tensor([0x7ff8000000000015],dtype=torch.int64).view(torch.float64))
    packet,layout=pack_tensors(values)
    assert packet.dtype==torch.uint8
    recovered=layout.unpack(packet.clone())
    for a,b in zip(recovered,values):
        assert a.dtype==b.dtype and a.shape==b.shape
        torch.testing.assert_close(a,b,rtol=0,atol=0,equal_nan=True)
        assert a.reshape(-1).view(torch.uint8).tolist()==b.resolve_conj().contiguous().reshape(-1).view(torch.uint8).tolist()
    for (_,dtype,offset,_) in layout.entries:
        assert offset%torch.empty((),dtype=dtype).element_size()==0
    for a,b in zip(_host_copies(values),recovered):torch.testing.assert_close(a,b,rtol=0,atol=0,equal_nan=True)


def test_homogeneous_fast_path_and_layout_guard():
    values=(torch.arange(3,dtype=torch.float64,requires_grad=True),torch.ones(2,dtype=torch.float64))
    packet,layout=pack_tensors(values)
    assert packet.dtype==torch.float64 and packet.numel()==5 and not packet.requires_grad
    result=layout.unpack(packet)
    result[0][0]=7
    assert packet[0]==7 and values[0][0]==0
    with pytest.raises(ValueError):layout.unpack(packet[:-1])
    with pytest.raises(ValueError):pack_tensors([])


def test_cpu_workspace_mixed_roundtrip():
    from photonweave.tile_workspace import TileWorkspace
    values=(torch.tensor([1+2j],dtype=torch.complex64),torch.tensor([.25],dtype=torch.float64))
    workspace=TileWorkspace('cpu')
    packet,layout=pack_tensors(values)
    copied=workspace.copy('payload',packet)
    staged=layout.unpack(copied)
    recovered=workspace.to_host(staged).wait()
    for a,b in zip(recovered,values):
        assert a.dtype==b.dtype
        torch.testing.assert_close(a,b,rtol=0,atol=0)
