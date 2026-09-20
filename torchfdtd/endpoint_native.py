"""Native closed-wall PMC dispatch. Ordinary Yee paths must reject these walls."""
import math
import time
from dataclasses import asdict
import numpy as np
import torch



def uses_endpoint(region):
    return any(face.kind in ('pmc','symmetric') for axis in range(3) for face in region.boundaries.pair(axis))


def validate_endpoint_project(project):
    """Metadata-only admission shared by Project parsing and native dispatch."""
    r=project.region
    if not uses_endpoint(r):return
    if any(f.kind not in ('pec','antisymmetric','pmc','symmetric') for a in range(3) for f in r.boundaries.pair(a)):
        raise ValueError('PMC native dispatch requires closed PEC/PMC walls on every face; PML/periodic mixing is unsupported.')
    if r.dimension!='3d' or r.precision!='float32' or r.complex_fields or r.mesh_type not in ('uniform','explicit'):
        raise ValueError('PMC native dispatch requires fixed uniform/explicit real FP32 3D meshes.')
    if r.memory_mode!='resident' or r.run_control.auto_shutoff:
        raise ValueError('PMC native dispatch requires resident fixed-duration execution, without automatic shutoff.')
    if r.interface_method!='staircase' or r.material_sampling!='yee':
        raise ValueError('PMC native dispatch requires staircase Yee material sampling.')
    active={obj.material for obj in project.structures if obj.enabled}
    if any(m.oscillators for m in project.materials if m.name in active):
        raise ValueError('PMC native dispatch does not support ADE/dispersive materials.')
    if not project.monitors:raise ValueError('PMC native dispatch requires at least one point monitor.')
    if any(not s.enabled or s.kind!='point' or s.injection!='soft' or not s.component.startswith('E') for s in project.sources):
        raise ValueError('PMC native dispatch accepts enabled point soft electric sources only.')
    if any(not m.enabled or m.kind!='point' or m.time_downsample!=1 for m in project.monitors):
        raise ValueError('PMC native dispatch accepts enabled point E/H monitors at every timestep only.')
    if r.backend=='cpu' and math.prod(r.shape)>32768:
        raise ValueError('PMC CPU reference is limited to 32768 cells; select CUDA or reduce the mesh.')
    seen=set()
    for item in [*project.sources,*project.monitors]:
        terms=project.resolved_source(item).polarization_components if item in project.sources else ((item.component,1.),)
        for field,_ in terms:
            component='xyz'.index(field[1].lower());indices=[]
            for a,nodes in enumerate(r.mesh_nodes):
                nodal=(component!=a) if field[0]=='E' else (component==a)
                coords=nodes if nodal else (nodes[:-1]+nodes[1:])/2
                index=int(np.argmin(abs(coords-item.center[a])));indices.append(index)
                if nodal and ((index==0 and r.boundaries.pair(a)[0].kind in ('pec','antisymmetric')) or
                              (index==len(nodes)-1 and r.boundaries.pair(a)[1].kind in ('pec','antisymmetric'))):
                    raise ValueError(f'{item.name}: nearest {field} sample is constrained by a PEC wall.')
            if item in project.sources:
                key=(field,tuple(indices))
                if key in seen:raise ValueError('PMC source terms must map to unique electric DOFs.')
                seen.add(key)


def estimate_endpoint(project):
    from .pmc_cuda import CompactEndpointTopology
    from .mesh import mesh_summary
    r=project.region
    faces=tuple(tuple('pmc' if f.kind in ('pmc','symmetric') else 'pec' for f in r.boundaries.pair(a)) for a in range(3))
    topology=CompactEndpointTopology(r.mesh_nodes,faces)
    count=sum(topology.counts.values());cells=math.prod(r.shape)
    terms=sum(len(project.resolved_source(s).polarization_components) for s in project.sources)
    # Conservative native setup/runtime payload; no adjoint checkpoints here.
    tensor=12*4*count+12*topology.counts['E']+8*r.steps*(terms+len(project.monitors))+8*terms
    use_cuda=r.backend=='cuda' or (r.backend=='auto' and torch.cuda.is_available())
    if not use_cuda:tensor+=81*count
    else:tensor+=sum(4*(2*n+1) for n in r.shape)
    interval=max(r.snapshot_interval,math.ceil(r.steps/100))
    snapshots=math.ceil(r.steps/interval)
    plane=math.prod(min(256,n) for a,n in enumerate(r.shape) if a!='xyz'.index(r.slice_axis))
    preparation=512*min(65536,topology.counts['E'])+r.steps*(8+16*terms)
    host=preparation+8*count+4*plane*(2*snapshots+3)+4*r.steps*len(project.monitors)
    return {**mesh_summary(project),'shape':r.shape,'actual_size_um':r.actual_size,'cells':cells,
        'dt_fs':r.time_step*1e15,'duration_fs':r.steps*r.time_step*1e15,
        'estimated_memory_mb':(tensor+host)/2**20,'endpoint_tensor_bytes':tensor,'endpoint_host_bytes':host,
        'endpoint_counts':topology.counts,'endpoint_preparation_bytes':preparation,
        'endpoint_tensor_budget_bytes':tensor,'endpoint_host_reservation_bytes':host,
        'warnings':['Closed PMC endpoint solver: point sources/monitors only; volume plots crop upper stored faces and edges.'],
        'oneway_planes':[],'tfsf_boxes':[],'tfsf_auxiliary_estimated_bytes':0}



def admit_endpoint(stats,*,use_cuda,gpu_free_bytes=None,host_available_bytes=None):
    """Check the complete planned payload against physical free-memory headroom.

    Explicit free-byte arguments support read-only deployment planning/tests.
    They never bypass the required tensor or host reservation calculation.
    """
    required_host=stats['endpoint_host_bytes']+(0 if use_cuda else stats['endpoint_tensor_bytes'])
    if host_available_bytes is not None and required_host>.8*host_available_bytes:
        raise ValueError('Insufficient free host memory for PMC endpoint reservation.')
    if use_cuda and (gpu_free_bytes is None or stats['endpoint_tensor_bytes']>.75*gpu_free_bytes):
        raise ValueError('Insufficient free CUDA memory for PMC endpoint reservation.')
    return dict(tensor_budget_bytes=stats['endpoint_tensor_bytes'],
                host_preparation_budget_bytes=stats['endpoint_preparation_bytes'])


def run_endpoint(project,progress=None,cancel=None):
    from .endpoint_project import endpoint_from_project
    from .solver import Result,field_axes,index_at
    from .run_control import DecayDecision,source_end_time
    validate_endpoint_project(project);r=project.region;started=time.perf_counter()
    stats=estimate_endpoint(project)
    use_cuda=r.backend=='cuda' or (r.backend=='auto' and torch.cuda.is_available())
    if use_cuda:
        if not torch.cuda.is_available():raise ValueError('CUDA requested but unavailable.')
    from .memory_profile import host_memory
    available=host_memory()['available_bytes']
    budgets=admit_endpoint(stats,use_cuda=use_cuda,gpu_free_bytes=torch.cuda.mem_get_info()[0] if use_cuda else None,host_available_bytes=available)
    adapter=endpoint_from_project(project,device='cuda' if use_cuda else 'cpu',checkpoints=0,
        **budgets)
    sim=adapter.simulation;epsilon=adapter.rasterize();waveforms=adapter.waveforms()
    material=sim._material(epsilon);state=sim._zero();base=3*math.prod(r.shape)
    trace=torch.empty((r.steps,len(project.monitors)),dtype=torch.float32,device=sim.device)
    axis='xyz'.index(r.slice_axis);component='xyz'.index(r.field[1].lower())
    slice_index=index_at(tuple(r.slice_position if a==axis else 0 for a in range(3)),r,r.field)[axis]
    def plane(values):
        data=values[:base].reshape(*r.shape,3)[...,component].select(axis,slice_index)
        return data[::max(1,math.ceil(data.shape[0]/256)),::max(1,math.ceil(data.shape[1]/256))].detach().cpu().numpy().copy()
    eps_plane=plane(epsilon)
    source_end=source_end_time(project);decision=DecayDecision(r.run_control,source_end,r.time_step)
    frames=[];frame_steps=[];completed=0;reason='max_steps';interval=max(r.snapshot_interval,math.ceil(r.steps/100))
    if use_cuda:torch.cuda.synchronize()
    setup=time.perf_counter()-started;begin=time.perf_counter()
    with torch.no_grad():
        for n in range(r.steps):
            if cancel is not None and cancel.is_set():reason='cancelled';break
            state=sim._step(state,material,waveforms[n]);completed=n+1
            for j,(family,index) in enumerate(sim.observation_ids):trace[n,j]=(state.electric if family=='E' else state.magnetic)[index]
            if completed%r.run_control.check_interval==0 or completed==r.steps:
                peak=max(float(state.electric.abs().max()),float(state.magnetic.abs().max()))
                norm=float(state.electric.double().square().sum()+state.magnetic.double().square().sum())
                decision.update(completed,norm,peak)
            if completed%interval==0 or completed==r.steps:
                image=plane(state.electric if r.field[0]=='E' else state.magnetic)
                image={'real':np.real,'imag':np.imag,'magnitude':np.abs,'phase':np.angle}[r.complex_display](image)
                frames.append(image);frame_steps.append(completed)
                if progress:progress(dict(step=completed,total=r.steps,frame=image.tolist(),elapsed=time.perf_counter()-begin,termination_reason=None,diagnostics=decision.history[-1] if decision.history else None))
        if not bool(torch.isfinite(state.electric).all() & torch.isfinite(state.magnetic).all()):raise FloatingPointError('Non-finite PMC endpoint fields detected.')
    if use_cuda:torch.cuda.synchronize()
    seconds=time.perf_counter()-begin
    full_e=state.electric.detach().cpu().numpy();full_h=state.magnetic.detach().cpu().numpy()
    stats.update(engine='TorchFDTD exact-endpoint PEC/PMC',backend='cuda' if use_cuda else 'cpu',precision='float32',
        gpu=torch.cuda.get_device_name() if use_cuda else None,steps=completed,requested_steps=r.steps,
        seconds=seconds,setup_seconds=setup,cancelled=reason=='cancelled',termination_reason=reason,
        cuda_graph=False,cuda_graph_steps=1,cuda_graph_replays=0,cuda_kernel='endpoint-direct' if use_cuda else None,cuda_monitor_kernel=None,auto_shutoff=False,
        field_peak=float(np.max(abs(full_e))),mcells_per_second=math.prod(r.shape)*completed/max(seconds,1e-9)/1e6,
        slice_index=slice_index,slice_position=float(field_axes(r,r.field)[axis][slice_index]),
        complex_fields=False,complex_display=r.complex_display,material_update='nondispersive',material_sampling='yee',
        boundaries=r.boundaries.model_dump(),diagnostics=decision.history,diagnostic_backend='endpoint full packed-state norm',
        endpoint_plan=adapter.plan(),endpoint_blocks={f:[asdict(b) for b in sim.topology.blocks[f]] for f in ('E','H')},
        endpoint_view='E/H base volume and plot crop upper faces/edges; NPZ endpoint_E_upper/endpoint_H_upper retain every extra DOF',
        units='geometry: um; time: s; E/H: reduced fields')
    return Result(project,stats,np.asarray(frames,dtype=np.float32).reshape(-1,*eps_plane.shape),np.asarray(frame_steps,dtype=np.int64),eps_plane,
        trace[:completed].detach().cpu().numpy(),np.arange(1,completed+1)*r.time_step,
        full_e[:base].reshape(*r.shape,3).copy(),full_h[:base].reshape(*r.shape,3).copy(),
        endpoint_fields={'E_upper':full_e[base:].copy(),'H_upper':full_h[base:].copy()})
