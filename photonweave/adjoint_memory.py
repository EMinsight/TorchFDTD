"""Resident adjoint admission before material packing or field allocation."""
import math

import torch

from .boundaries import BoundaryDescription
from .memory_profile import host_memory
from .state_store import disk_free


def _resident_contract(region,options):
    if options.resident_budget_bytes is None:
        region.require_resident()
    elif region.memory_mode=='streamed':
        raise ValueError('Use memory_mode="budgeted" for byte-admitted resident execution.')


def _cuda_index_contract(region,monitor_count,observation_steps):
    # Fused Yee field offsets use signed int arithmetic. Complex forward uses
    # two real lanes. ADE pole and packed-parameter offsets already use int64.
    lanes=2 if region.complex_fields else 1
    if 3*lanes*math.prod(region.shape)>=2**31:
        raise ValueError('Resident CUDA field indexing exceeds the signed 32-bit range. Use spatial streaming.')
    # The real fused observation kernel forms step*monitor_count in int32.
    # Spectral observations seed bounded time blocks instead of full history.
    if lanes*monitor_count*observation_steps>=2**31:
        raise ValueError('Resident CUDA observation indexing exceeds the signed 32-bit range. Use online spectra or fewer observations.')


def _material_shapes(region, parameter_shapes):
    shapes=tuple(tuple(s) for s in parameter_shapes)
    grid=region.shape
    if len(shapes)!=4 or shapes[0] not in (grid,grid+(3,)):
        raise ValueError('Provide four material shapes starting with the epsilon_inf grid shape.')
    if not shapes[1] or isinstance(shapes[1][0],bool) or not isinstance(shapes[1][0],int) or not 1<=shapes[1][0]<=64:
        raise ValueError('Strength needs a leading pole axis of length 1 to 64.')
    poles=shapes[1][0]
    for shape in shapes[1:]:
        if any(isinstance(v,bool) or not isinstance(v,int) for v in shape) or shape not in ((),(poles,),(poles,*grid),(poles,*grid,3)):
            raise ValueError('Oscillator shape must be scalar, (P,), (P,Nx,Ny,Nz), or (P,Nx,Ny,Nz,3).')
    return shapes,poles


def _resident_reservation(project, options, device, spectral=None, *, pole_count=0, parameter_elements=0):
    """Shared planner/execution calculation, including original tier semantics."""
    region=project.region
    _resident_contract(region,options)
    device=torch.device(device)
    if device.type not in ('cpu','cuda'):raise ValueError('Only CPU and CUDA execution are supported.')
    if device.type!='cuda' and options.backward_kernel=='fused':raise ValueError('The fused backward requires a CUDA tensor.')
    if device.type!='cuda' and options.checkpoint_transfers=='async':raise ValueError('Asynchronous checkpoints require a CUDA tensor.')
    monitor_count=sum(m.enabled for m in project.monitors) if spectral is None else len(spectral.components)
    if device.type=='cuda':
        _cuda_index_contract(region,monitor_count,region.steps if spectral is None else spectral.block_size)
    n=math.prod(region.shape)
    real_item=8 if region.precision=='float64' else 4
    item=real_item*(2 if region.complex_fields else 1)
    boundary=BoundaryDescription(region)
    segments=[s for group in boundary.cpml.values() for s in group]
    cpml=sum(math.prod(s['shape']) for s in segments)
    state=(6*n+cpml+6*pole_count*n)*item
    state_upper=(18+6*pole_count)*n*item
    workspace=102*n*item
    if pole_count:workspace+=(36*pole_count+12)*n*(item+real_item)
    # Packing and its normalization graph precede field creation. Budget those
    # carriers before torch.cat, rather than testing only the packed output.
    packing=4*parameter_elements*real_item
    terms=sum(len(s.polarization_components)*(2 if s.injection=='oneway' else 1)
              for s in project.sources if s.enabled)
    output=region.steps*monitor_count*item if spectral is None else spectral.reservation(spectral.block_size)['spectral_output_bytes']
    source=region.steps*terms*item
    history=2*output+source if spectral is None else spectral.reservation(spectral.block_size)['spectral_reservation_bytes']+source
    index_bytes=16*monitor_count
    if options.storage=='hierarchical':
        device_slots=options.device_checkpoints
        host_slots=options.host_checkpoints
        disk_slots=options.checkpoints-device_slots-host_slots
    else:
        device_slots=options.checkpoints if options.storage=='device' else 0
        host_slots=options.checkpoints if options.storage=='host' else 0
        disk_slots=options.checkpoints if options.storage=='disk' else 0
    asynchronous=options.checkpoint_transfers=='async' and (host_slots or disk_slots)
    staging_slots=options.staging_slots if asynchronous else 0
    host_checkpoint=state*(host_slots+staging_slots+(1 if disk_slots else 0))
    array_count=2+len(segments)+(2 if pole_count else 0)
    disk_checkpoint=(state+4096+512*array_count)*disk_slots
    required=workspace+(device_slots+staging_slots)*state_upper+history+index_bytes+packing
    # The resident one-way validator currently copies epsilon to CPU. Reserve
    # the diagonal worst case plus its three-plane NumPy comparison temporaries.
    oneway=any(s.enabled and s.injection=='oneway' for s in project.sources)
    source_validation=(3*n+18*max(region.shape[0]*region.shape[1],region.shape[0]*region.shape[2],region.shape[1]*region.shape[2]))*real_item if oneway and device.type=='cuda' else 0
    host_required=host_checkpoint+(required if device.type=='cpu' else 0)+source_validation
    if options.resident_budget_bytes is not None:
        active=host_required if device.type=='cpu' else required
        if active>options.resident_budget_bytes:
            raise ValueError('Resident solver reservation exceeds the explicit resident byte budget.')
    # host_budget_bytes retains its existing checkpoint-tier meaning. The
    # current available-host check additionally covers CPU working fields.
    if options.host_budget_bytes is not None and host_checkpoint>options.host_budget_bytes:
        raise ValueError('Host checkpoint budget cannot hold its slots and disk staging state.')
    available=host_memory()['available_bytes']
    if available is not None and host_required>int(available*.8):
        raise ValueError('Resident workspace and checkpoints exceed available host memory.')
    if disk_slots:
        if disk_checkpoint>options.disk_budget_bytes:
            raise ValueError('Disk checkpoint budget must include its slots and archive headers.')
        if disk_checkpoint>int(disk_free(options.checkpoint_directory)*.8):
            raise ValueError('Disk checkpoint reservation exceeds available storage.')
    if device.type=='cuda':
        free,_=torch.cuda.mem_get_info(device)
        limit=min(int(free*.8),options.gpu_budget_bytes or int(free*.8))
        if required>limit:raise ValueError('Adjoint workspace and checkpoint reservation exceed the GPU budget.')
    return dict(memory_reservation_bytes=required,workspace_reservation_bytes=workspace,
        history_reservation_bytes=history,output_history_bytes=output if spectral is None else 0,
        source_history_bytes=source,observation_index_bytes=index_bytes,
        material_packing_reservation_bytes=packing,restart_state_bytes=state,
        host_checkpoint_reservation_bytes=host_checkpoint,disk_checkpoint_reservation_bytes=disk_checkpoint,
        host_source_validation_bytes=source_validation,
        host_reservation_bytes=host_required,gpu_reservation_bytes=required if device.type=='cuda' else 0,
        budgeted_resident=options.resident_budget_bytes is not None)


def estimate_adjoint_memory(project, options=None, *, device='cpu', parameter_shapes=None,
                            frequency_hz=None, window=None, block_size=32):
    """Admit resident Yee/CPML or ADE without creating fields or scratch files.

    Supply four original material shapes for ADE. Omit them for nondispersive
    epsilon. Point histories and online point spectra are supported here.
    The same calculation also serves internal fixed-plane execution admission.
    Geometry/optimizer graphs and CUDA context are outside this estimate.
    host_budget_bytes limits the checkpoint tier, as in AdjointOptions.
    Current available RAM additionally bounds CPU solver workspace. Execution
    rechecks resources and validates actual tensors and supported physics.
    """
    from .differentiable import AdjointOptions, DifferentiableSimulation
    options=options or AdjointOptions()
    if not isinstance(options,AdjointOptions):raise ValueError('Resident planning requires AdjointOptions.')
    model_type=DifferentiableSimulation
    if parameter_shapes is not None:
        from .dispersive_adjoint import DispersiveSimulation
        model_type=DispersiveSimulation
    # Constructors validate the supported physics and observations without
    # creating fields. Do not admit a plane as if it were one point sample.
    model=model_type(project,options)
    project,options=model.project,model.options
    poles=elements=0
    if parameter_shapes is not None:
        shapes,poles=_material_shapes(project.region,parameter_shapes)
        elements=sum(math.prod(s) for s in shapes)
    if window is not None and frequency_hz is None:raise ValueError('A spectral window requires frequency_hz.')
    spectral=None
    if frequency_hz is not None:
        from .adjoint_spectrum import SpectralObservation
        scalar=torch.empty((),dtype=getattr(torch,project.region.precision),device='cpu')
        spectral=SpectralObservation(scalar,project.region,[m.component for m in project.monitors if m.enabled],
            frequency_hz,window,block_size)
    report=_resident_reservation(project,options,device,spectral,pole_count=poles,parameter_elements=elements)
    if spectral is not None:report.update(spectral.reservation(spectral.block_size))
    return report
