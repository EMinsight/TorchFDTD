"""Memory admission of the full-autograd reference oracles.

Full autograd keeps the saved tensors of every timestep until backward, so the
retained graph grows with cells times steps. It is admitted by an estimate of
that graph against 80 percent of free CUDA memory or of available host memory,
the rules of the resident solvers, and an optional caller cap. The tensor part
counts one restart state per step (fields, CPML memories, stored PMC faces and
pole banks) at the field element size. The graph nodes and their tensor
metadata live in host memory on either device and cost about as much per step
as the tensors of a small grid. The constants are upper bounds of the peaks
measured on CPU and CUDA through forward and backward, recorded in
docs/validation/oracle_graph_memory.json by benchmarks/oracle_graph_memory.py.
"""
import math

import torch

from .boundaries import BoundaryDescription
from .cuda_memory import cuda_budget_limit
from .memory_profile import host_memory

# Retained tensor bytes per step in restart states. Tensor ADE adds three
# field components per operator application of one step to its unit.
GRAPH_TENSOR_FACTORS={'yee':2,'ade':2,'tensor_ade':9}
# Per-step tensor bytes independent of the grid: small saved tensors and the
# 512-byte rounding of small CUDA allocations.
GRAPH_SMALL_TENSOR_BYTES=32*1024
# Host bytes per step for graph nodes and tensor metadata (tensor ADE: per
# operator application).
GRAPH_NODE_BYTES={'yee':1024**2,'ade':1024**2,'tensor_ade':3*1024**2//2}
# Steps' worth of graph added for the initial state, inputs and the backward.
GRAPH_EXTRA_STEPS=4
# Host memory of the first call: autograd engine and thread pools, and on CUDA
# the kernel modules and libraries loaded on first use.
GRAPH_FIXED_HOST_BYTES={'cpu':16*1024**2,'cuda':1024**3}


def oracle_state_bytes(region,pole_count=0):
    """One restart state: E, H, CPML memories, stored faces and pole banks."""
    boundary=BoundaryDescription(region)
    n=math.prod(region.shape)
    cpml=sum(math.prod(s['shape']) for group in boundary.cpml.values() for s in group)
    faces=sum(math.prod(shape) for blocks in boundary.pmc_blocks.values() for _,_,shape in blocks)
    electric_faces=sum(math.prod(shape) for _,_,shape in boundary.pmc_blocks['E'])
    item=(8 if region.precision=='float64' else 4)*(2 if region.complex_fields else 1)
    return (6*n+cpml+faces+pole_count*(6*n+2*electric_faces))*item


def oracle_graph_bytes(region,kind,*,pole_count=0,iterations=0):
    """Estimated per-run graph tensor bytes and graph node bytes, before fixed allowances.

    kind is 'yee' (dielectric, modal and source oracles), 'ade' or 'tensor_ade';
    iterations is the fixed Neumann length of the tensor ADE step.
    """
    steps=region.steps+GRAPH_EXTRA_STEPS
    unit=oracle_state_bytes(region,pole_count)
    applies=1
    if kind=='tensor_ade':
        item=(8 if region.precision=='float64' else 4)*(2 if region.complex_fields else 1)
        applies=2*pole_count+1+iterations*(1+pole_count)
        unit+=3*math.prod(region.shape)*item*applies
    return dict(tensor_bytes=math.ceil(steps*(GRAPH_TENSOR_FACTORS[kind]*unit+GRAPH_SMALL_TENSOR_BYTES)),
                node_bytes=steps*GRAPH_NODE_BYTES[kind]*applies)


def oracle_requirements(estimate,device):
    """Bytes admitted on the oracle's device (graph) and on the host.

    On CPU the tensors and nodes share host memory. On CUDA the tensors, plus
    the cuBLAS workspaces the resident spectral reservation also counts, are
    on the device and the nodes on the host.
    """
    device=torch.device(device)
    if device.type=='cuda':
        from .adjoint_memory import _spectral_library_reservation
        host=estimate['node_bytes']+GRAPH_FIXED_HOST_BYTES['cuda']
        return dict(graph=estimate['tensor_bytes']+_spectral_library_reservation(device),host=host)
    host=estimate['tensor_bytes']+estimate['node_bytes']+GRAPH_FIXED_HOST_BYTES['cpu']
    return dict(graph=host,host=host)


def admit_oracle(estimate,device,graph_budget_bytes=None):
    """Refuse a reference graph above device or host memory, or above the caller cap.

    graph_budget_bytes caps the graph estimate on the oracle's device.
    """
    if graph_budget_bytes is not None and (isinstance(graph_budget_bytes,bool) or not isinstance(graph_budget_bytes,int) or graph_budget_bytes<=0):
        raise ValueError('graph_budget_bytes must be a positive integer or None.')
    device=torch.device(device)
    cuda=device.type=='cuda'
    required=oracle_requirements(estimate,device)
    def refuse(what,value,limit,memory):
        raise ValueError(f'Full-autograd reference needs an estimated {value:,} bytes of {what}; the limit is '
                         f'{limit:,} bytes ({memory}). Reduce the grid or steps, or use the checkpointed adjoint; '
                         'graph_budget_bytes sets an explicit cap on the graph estimate.')
    if graph_budget_bytes is not None and required['graph']>graph_budget_bytes:
        refuse('retained graph',required['graph'],graph_budget_bytes,f'graph_budget_bytes={graph_budget_bytes:,}')
    if cuda:
        limit=cuda_budget_limit(device,required['graph'])
        if required['graph']>limit:
            refuse('retained graph on CUDA',required['graph'],limit,
                   f'80% of {torch.cuda.mem_get_info(device)[0]:,} bytes of free CUDA memory')
    available=host_memory()['available_bytes']
    if available is not None and required['host']>int(available*.8):
        refuse('host memory for the graph nodes' if cuda else 'retained graph',required['host'],int(available*.8),
               f'80% of {available:,} bytes of available host memory')
    return dict(oracle_graph_bytes=required['graph'],oracle_host_bytes=required['host'])
