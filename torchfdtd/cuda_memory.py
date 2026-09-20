"""CUDA admission that can release unused allocator cache before denying work."""
import torch


def cuda_budget_limit(device,required,budget=None):
    """Return min(explicit budget, 80% of freshly observed free CUDA memory).

    Repeated solves leave unused blocks in Torch's allocator. If those blocks
    could make an otherwise denied reservation fit, release unused cache once
    and query the device again. Never count reserved-minus-allocated bytes as
    guaranteed free memory. Live tensors and other processes are not evicted.
    Planning callers may therefore release unused cache without creating fields.
    This is not an exclusive device reservation or an allocation/OOM retry.
    """
    device=torch.device(device)
    if device.type!='cuda':raise ValueError('CUDA capacity requires a CUDA device.')
    free,total=torch.cuda.mem_get_info(device)
    cap=total if budget is None else budget
    limit=min(cap,int(free*.8))
    if required<=limit or required>min(cap,int(total*.8)):
        return limit
    unused=max(0,torch.cuda.memory_reserved(device)-torch.cuda.memory_allocated(device))
    if unused and required<=min(cap,int(min(total,free+unused)*.8)):
        with torch.cuda.device(device):
            torch.cuda.empty_cache()
        free,_=torch.cuda.mem_get_info(device)
        limit=min(cap,int(free*.8))
    return limit
