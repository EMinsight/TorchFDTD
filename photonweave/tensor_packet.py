"""Lossless internal transport for fixed mixed-dtype solver tensors."""
from dataclasses import dataclass
import torch


@dataclass(frozen=True)
class TensorLayout:
    dtype: torch.dtype
    count: int
    entries: tuple

    def unpack(self,payload):
        if payload.dtype!=self.dtype or payload.ndim!=1 or payload.numel()!=self.count:
            raise ValueError('Packet does not match its tensor layout.')
        result=[]
        for shape,dtype,offset,length in self.entries:
            value=payload.narrow(0,offset,length)
            if value.dtype!=dtype:value=value.view(dtype)
            result.append(value.reshape(shape))
        return tuple(result)


def pack_tensors(tensors):
    """Pack detached logical values, preserving dtype, shape and precision.

    Homogeneous packets retain the existing typed concatenation. Mixed packets
    use aligned byte views, avoiding promotion of real gradients to complex or
    rounding integer values through floating point. Returned views share packet
    storage. This is transport for a manual solver, not an autograd operation.
    """
    values=tuple(tensors)
    if not values or any(not isinstance(t,torch.Tensor) or t.layout!=torch.strided for t in values):
        raise ValueError('Expected a nonempty sequence of strided tensors.')
    if any(t.device!=values[0].device for t in values):raise ValueError('Packet tensors must share a device.')
    mixed=any(t.dtype!=values[0].dtype for t in values)
    alignment=max(t.element_size() for t in values)
    padding=torch.zeros(alignment,dtype=torch.uint8,device=values[0].device) if mixed else None
    parts=[];entries=[];offset=0
    for original in values:
        value=original.detach().resolve_conj().resolve_neg().contiguous().reshape(-1)
        if mixed:
            pad=(-offset)%alignment
            if pad:parts.append(padding[:pad]);offset+=pad
            value=value.view(torch.uint8)
        length=value.numel()
        entries.append((original.shape,original.dtype,offset,length))
        parts.append(value);offset+=length
    payload=torch.cat(parts)
    return payload,TensorLayout(payload.dtype,payload.numel(),tuple(entries))
