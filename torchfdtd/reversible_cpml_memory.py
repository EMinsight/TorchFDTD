"""Metadata-only complete admission for recorded-interface CPML reversal.

The public caller validates physics, input tensors and the descriptor-derived
inclusive reconstruction interval before allocating its effective material.
Caller inputs, optimizer state and CUDA context are not owned allocations.
"""
import math

import torch


def _cpml_reversible_reservation(project, options, device, interval):
    from .adjoint_memory import _resident_reservation
    from .differentiable import AdjointOptions
    from .memory_profile import host_memory
    from .cuda_memory import cuda_budget_limit
    from .reversible_memory import _source_preparation

    device = torch.device(device)
    if device.type not in ('cpu', 'cuda'):
        raise ValueError('CPML reversible reservation requires CPU or CUDA.')
    storage = options.trace_storage
    if storage not in ('device', 'cpu'):
        raise ValueError('Trace storage must be device or cpu.')
    if type(options.collar_cells) is not int or options.collar_cells < 1:
        raise ValueError('collar_cells must be a positive integer.')
    shape = project.region.shape
    if (len(interval) != 2 or any(type(x) is not int for x in interval)
            or not 0 <= interval[0] <= interval[1] < shape[2]):
        raise ValueError('Invalid inclusive reconstruction interval.')
    budgets = {}
    for name in ('host_budget_bytes', 'gpu_budget_bytes', 'resident_budget_bytes'):
        value = getattr(options, name, None)
        if value is not None and (type(value) is not int or value <= 0):
            raise ValueError(f'{name} must be a positive integer byte budget.')
        budgets[name] = value
    # Explicit resident budget also admits budgeted/large scenes through the
    # base contract. Recheck the complete total after all additions below.
    internal = AdjointOptions(checkpoints=1, storage='device',
        backward_kernel='fused' if device.type == 'cuda' else 'torch',
        resident_budget_bytes=budgets['resident_budget_bytes'])
    base = _resident_reservation(project, internal, device)
    cells = math.prod(shape)
    plane = shape[0]*shape[1]
    frame = 4*plane*4
    trace = project.region.steps*frame
    interior_cells = plane*(interval[1]-interval[0]+1)
    chunk = min(65536, 3*interior_cells)
    # Rectangular packing and abs scratch each require one FP32 chunk,
    # alongside two FP64 reduction chunks. Never flatten a strided volume.
    diagnostics = 24*chunk+4096
    material = 3*cells*4
    preparation = _source_preparation(project)
    # Synchronous CPU archive transfers may temporarily own both packing and
    # incoming device frames. No pinned ring or asynchronous transport claimed.
    transfer_device = 2*frame if device.type == 'cuda' and storage == 'cpu' else 0
    transfer_host = frame if device.type == 'cuda' and storage == 'cpu' else 0
    trace_device = trace if device.type == 'cuda' and storage == 'device' else 0
    trace_host = trace if device.type == 'cpu' or storage == 'cpu' else 0
    extra_active = diagnostics+material+transfer_device+trace_device
    extra_host = preparation+transfer_host+trace_host
    # Inherit the existing runtime reserve and add allocator rounding/headroom
    # for new CUDA allocations rather than consuming the old reserve silently.
    headroom = (extra_active+19)//20+4096 if device.type == 'cuda' else 0
    active = base['memory_reservation_bytes']+extra_active+headroom
    host = base['host_reservation_bytes']+extra_host
    if device.type == 'cpu':
        host += extra_active
        active = host
    if budgets['host_budget_bytes'] is not None and host > budgets['host_budget_bytes']:
        raise ValueError('CPML reversible total host reservation exceeds the explicit host budget.')
    if budgets['resident_budget_bytes'] is not None and active > budgets['resident_budget_bytes']:
        raise ValueError('CPML reversible total resident reservation exceeds the explicit resident budget.')
    available = host_memory()['available_bytes']
    if available is not None and host > int(.8*available):
        raise ValueError('CPML reversible total host reservation exceeds available host memory.')
    if device.type == 'cuda' and active > cuda_budget_limit(device, active, budgets['gpu_budget_bytes']):
        raise ValueError('CPML reversible complete reservation exceeds the CUDA budget.')
    parts = dict(base['workspace_components_bytes'])
    parts.update(reconstruction_diagnostics=diagnostics,
                 effective_material_and_autograd=material,
                 trace_device_transfer=transfer_device)
    actual_terminal = 6*plane*(interval[1]-interval[0]+1)*4
    return dict(base, memory_reservation_bytes=active, host_reservation_bytes=host,
        gpu_reservation_bytes=active if device.type == 'cuda' else 0,
        workspace_reservation_bytes=base['workspace_reservation_bytes']+diagnostics+material+transfer_device,
        workspace_components_bytes=parts,
        workspace_model='cpml_reversible_conservative_'+base['workspace_model'],
        inherited_workspace_model=base['workspace_model'],
        inherited_workspace_note='Retains full primal CPML, full field/CPML transpose, whole-state replay/conversion and worst-case diagonal coefficient allowances. CPU retains the 102-scalar-per-cell tensor bound.',
        allocation_headroom_bytes=base['allocation_headroom_bytes']+headroom,
        additional_allocation_headroom_bytes=headroom,
        conservative_extra_active_bytes=extra_active+headroom,
        conservative_extra_host_bytes=extra_host+(extra_active if device.type == 'cpu' else 0),
        terminal_state_bytes=actual_terminal,
        terminal_state_allowance_bytes=base['device_checkpoint_reservation_bytes'],
        terminal_state_count=1, checkpoint_states=0, checkpoint_replays=0,
        device_checkpoint_reservation_bytes=0, host_checkpoint_reservation_bytes=0,
        disk_checkpoint_reservation_bytes=0, device_staging_reservation_bytes=0,
        trace_storage=storage, trace_shape=(project.region.steps, 2, shape[0], shape[1], 2),
        trace_bytes=trace, trace_device_bytes=trace_device, trace_host_bytes=trace_host,
        trace_frame_bytes=frame, trace_transfer_device_bytes=transfer_device,
        trace_transfer_host_bytes=transfer_host,
        trace_transfer='synchronous' if transfer_device else 'none',
        reconstruction_interval=tuple(interval),
        material_assembly_and_autograd_bytes=material,
        diagnostic_chunk_elements=chunk, diagnostic_buffer_bytes=24*chunk,
        diagnostic_rounding_bytes=4096, diagnostic_reservation_bytes=diagnostics,
        source_preparation_host_bytes=preparation,
        retained_caller_epsilon_bytes=cells*4,
        retained_caller_fixed_epsilon_bytes=cells*4,
        retained_caller_inputs_bytes=2*cells*4,
        contiguous_seed_reservation_bytes=base['output_history_bytes'],
        strategy='recorded_interface_cpml_reversible',
        state_storage='O(volume) fields/CPML/adjoints plus O(steps*transverse area) lossless trace and point/source histories; no whole-volume time trajectory')
