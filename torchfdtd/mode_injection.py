"""Discrete single-frequency modal Huygens sheets on the native Yee adjoint.

Uniform 3D meshes, periodic transverse axes, longitudinal CPML, real isotropic
fixed launch materials only. Eigensystem and source profiles are fixed inputs.
"""
from dataclasses import dataclass, replace
import hashlib
import json
import math
import numpy as np
import torch
from .mode_ports import solve_waveguide_modes, _amplitudes, _uniform_cell_quadrature, C0
from .adjoint_planes import DifferentiablePlaneSimulation
from .differentiable import DifferentiableSimulation, _System
from .injection import oneway_plan
from .waveforms import source_time_signal


def _profile(value, normal):
    w='xyz'.index(normal)
    return value[None].transpose(np.argsort((w,(w+1)%3,(w+2)%3)))


@dataclass(frozen=True)
class ModalLaunch:
    mode: object
    epsilon: np.ndarray
    region_signature: str
    source_signature: str
    normal_origin_um: float
    normal_step_um: float
    electric_index: int
    direction: int
    beta_tilde_per_um: float
    temporal_k_per_um: float
    terms: tuple
    identity: str

    def detector_mode(self, coordinate_um):
        q=(coordinate_um-self.normal_origin_um)/self.normal_step_um
        if not math.isclose(q,round(q),abs_tol=2e-5,rel_tol=0):
            raise ValueError('Validated modal detectors must lie on longitudinal E-node planes.')
        fields=self.mode.fields.copy()
        w='xyz'.index(self.mode.normal)
        factor=math.cos(self.mode.beta_per_um*self.normal_step_um/2)
        fields[...,w]*=factor
        for axis in ((w+1)%3,(w+2)%3):fields[...,3+axis]*=factor
        fields.setflags(write=False)
        return replace(self.mode,fields=fields)

    @property
    def storage_bytes(self):
        return self.epsilon.nbytes+self.mode.fields.nbytes+sum(w.nbytes+p.nbytes for _,_,w,p in self.terms)


def prepare_modal_launch(project, permittivity, *, mode_index=0, num_modes=2, source_budget_bytes=256*1024**2):
    """Solve a temporally/longitudinally discrete mode and prepare fixed currents.

    The sole project source is a Gaussian plane carrier with cycle-based timing.
    Its normal/direction/center/size/time settings define the launch. The spatial
    Cartesian polarization is replaced by the selected full-vector mode.
    """
    r=project.region
    active=[project.resolved_source(s) for s in project.sources if s.enabled]
    if len(active)!=1:raise ValueError('Modal launch requires exactly one enabled source.')
    s=active[0]
    if r.dimension!='3d' or r.mesh_type!='uniform' or r.complex_fields or r.material_sampling!='yee':
        raise ValueError('Modal launch requires a real uniform 3D Yee-sampled region.')
    if r.interface_method!='staircase' or any(m.oscillators for m in project.materials):
        raise ValueError('Only real nondispersive staircase materials are supported.')
    if s.kind!='plane' or s.injection!='soft' or s.pulse!='gaussian' or s.time_definition!='cycles':
        raise ValueError('Use one soft Gaussian plane source with cycle-based timing.')
    if s.pulse_cycles<2:raise ValueError('Validated modal pulses require at least two carrier cycles.')
    w,k,d=oneway_plan(s,r)
    u,v=(w+1)%3,(w+2)%3
    if not math.isclose(s.center[w],r.mesh_nodes[w][k],abs_tol=1e-7,rel_tol=0):
        raise ValueError('The source must lie on a longitudinal E-node plane.')
    shape=(r.shape[u],r.shape[v])
    dtype=np.float32 if r.precision=='float32' else np.float64
    # Admission precedes source tables. Sparse eigensystem memory is separate.
    required=(8*r.steps+40*math.prod(shape))*np.dtype(dtype).itemsize
    if required>source_budget_bytes:raise ValueError('Modal source tables exceed the source byte budget.')
    dt=r.time_step
    omega=2*np.pi*C0/(s.wavelength*1e-6)
    kt=2*np.sin(omega*dt/2)/(C0*dt)*1e-6
    modes=solve_waveguide_modes(permittivity,shape=shape,spacing_um=(r.axis_steps[u],r.axis_steps[v]),
        origin_um=(r.mesh_nodes[u][0],r.mesh_nodes[v][0]),wavelength_um=2*np.pi/kt,
        normal=s.normal,num_modes=num_modes,precision=r.precision)
    if not isinstance(mode_index,int) or not 0<=mode_index<len(modes):raise ValueError('Invalid mode index.')
    base=modes[mode_index]
    h=r.axis_steps[w]
    ratio=base.beta_per_um*h/2
    if not 0<ratio<1:raise ValueError('Mode exceeds the longitudinal Yee propagation band.')
    beta=2*np.arcsin(ratio)/h
    mode=replace(base,wavelength_um=s.wavelength,beta_per_um=float(beta))
    epsilon=np.empty((*shape,3),dtype=dtype)
    for c in range(3):
        axes=mode.component_axes('E'+'xyz'[c])
        coords=np.meshgrid(*axes,indexing='ij')
        values=permittivity(*coords) if callable(permittivity) else permittivity
        epsilon[...,c]=np.broadcast_to(values,shape)
    if np.min(epsilon)<1:raise ValueError('Native FDTD CFL requires epsilon at least one.')
    amplitude_scale=float(np.max(np.abs(mode.fields[...,:3])))
    incident=mode if d==1 else mode.backward()
    fields=incident.fields/amplitude_scale
    courant=C0*dt/(h*1e-6)
    phase=np.exp(-1j*beta*h/2)
    loc_e=[slice(None)]*3
    loc_h=[slice(None)]*3
    loc_e[w]=slice(k,k+1)
    hat=k-1 if d==1 else k
    loc_h[w]=slice(hat,hat+1)
    terms=[]
    for c,partner,sign in ((u,v,-1),(v,u,1)):
        # (w cross H)_u=-H_v and (w cross H)_v=H_u.
        electric=-d*courant*sign*fields[...,3+partner]*phase/epsilon[...,c]
        magnetic=d*courant*sign*fields[...,partner]
        for family,component,loc,profile,tshift in (
                ('E',c,tuple(loc_e),electric,.5),('H',c,tuple(loc_h),magnetic,1.)):
            times=(np.arange(r.steps)+tshift)*dt
            for imag,offset in ((False,90.),(True,0.)):
                waveform=source_time_signal(s.model_copy(update={'phase':s.phase+offset}),times).astype(dtype)
                spatial=_profile(profile.imag if imag else profile.real,s.normal).astype(dtype)
                waveform.setflags(write=False)
                spatial.setflags(write=False)
                terms.append((family+'xyz'[component],loc,waveform,spatial))
    region_signature=json.dumps(r.model_dump(mode='json'),sort_keys=True)
    source_signature=json.dumps(s.model_dump(mode='json'),sort_keys=True)
    digest=hashlib.sha256(region_signature.encode()+source_signature.encode()+mode.fields.tobytes()+epsilon.tobytes()).hexdigest()
    epsilon.setflags(write=False)
    return ModalLaunch(mode,epsilon,region_signature,source_signature,float(r.mesh_nodes[w][0]),h,k,d,
                       base.beta_per_um,float(kt),tuple(terms),digest)


class _ModalSystem(_System):
    def __init__(self,project,epsilon,*,launch,observation_monitors=None):
        super().__init__(project,epsilon,observation_monitors=observation_monitors)
        self.sources={'E':[],'H':[]}
        for component,loc,waveform,profile in launch.terms:
            self.sources[component[0]].append((loc,'xyz'.index(component[1].lower()),
                self.tensor(np.array(waveform,copy=True)),self.tensor(np.array(profile,copy=True))))


class _ModalSimulation(DifferentiableSimulation):
    def _run(self,epsilon,spectral):
        launch=self.launch
        region=self.project.region
        if json.dumps(region.model_dump(mode='json'),sort_keys=True)!=launch.region_signature:
            raise ValueError('Modal launch region changed. Rebuild its fixed tables.')
        active=[self.project.resolved_source(s) for s in self.project.sources if s.enabled]
        if len(active)!=1 or json.dumps(active[0].model_dump(mode='json'),sort_keys=True)!=launch.source_signature:
            raise ValueError('Modal launch source changed. Rebuild its fixed tables.')
        if not isinstance(epsilon,torch.Tensor):raise ValueError('Modal epsilon must be a Torch tensor.')
        if epsilon.shape!=region.shape+(3,):raise ValueError('Modal propagation requires explicit Yee diagonal epsilon.')
        from .adjoint_memory import _resident_reservation
        from .memory_profile import host_memory
        base=_resident_reservation(self.project,self.options,epsilon.device,spectral)
        extra=2*launch.storage_bytes+(epsilon.numel()*epsilon.element_size() if epsilon.requires_grad else 0)
        # Use explicit budget fields below rather than depending on report labels.
        from .cuda_memory import cuda_budget_limit
        device_required=base['gpu_reservation_bytes']
        host_required=base.get('host_reservation_bytes',0)+extra
        # The modal API treats an explicit host budget as the full admitted
        # host footprint, including its packet and gradient-freezing carrier.
        if self.options.host_budget_bytes is not None and host_required>self.options.host_budget_bytes:
            raise ValueError('Modal source storage exceeds the explicit host byte budget.')
        if epsilon.is_cuda:
            limit=cuda_budget_limit(str(epsilon.device),device_required+extra,self.options.gpu_budget_bytes)
            if device_required+extra>limit:raise ValueError('Modal source storage exceeds the GPU budget.')
        available=host_memory()['available_bytes']
        if available is not None and host_required>int(available*.8):raise ValueError('Modal source storage exceeds available host memory.')
        if self.options.resident_budget_bytes is not None and (device_required+extra if epsilon.is_cuda else host_required)>self.options.resident_budget_bytes:
            raise ValueError('Modal source storage exceeds the resident budget.')
        w='xyz'.index(launch.mode.normal)
        selection=[slice(None)]*3
        selection[w]=slice(launch.electric_index-1,launch.electric_index+2)
        expected=torch.tensor(np.stack([_profile(launch.epsilon[...,c],launch.mode.normal) for c in range(3)],axis=-1),
                              dtype=epsilon.dtype,device=epsilon.device)
        if not torch.allclose(epsilon[tuple(selection)],expected.expand_as(epsilon[tuple(selection)]),rtol=2e-6,atol=1e-7):
            raise ValueError('Injection-neighborhood epsilon must match the fixed modal cross-section.')
        # Keep source-neighborhood material derivatives excluded, since its fixed
        # electric sheet contains inverse epsilon and the eigenmode is frozen.
        if epsilon.requires_grad:
            epsilon=epsilon.clone()
            epsilon[tuple(selection)]=epsilon[tuple(selection)].detach()
        factory=lambda p,e,**kwargs:_ModalSystem(p,e,launch=launch,**kwargs)
        result=super()._run(epsilon,spectral,system_factory=factory)
        result.report['memory_reservation_bytes']+=extra
        result.report['host_reservation_bytes']+=extra
        if epsilon.is_cuda:result.report['gpu_reservation_bytes']+=extra
        result.report.update(modal_source=True,modal_source_storage_bytes=launch.storage_bytes,modal_source_extra_reservation_bytes=extra,
            modal_beta_per_um=launch.mode.beta_per_um,modal_beta_tilde_per_um=launch.beta_tilde_per_um,
            source_neighborhood_gradient='frozen',modal_source_identity=launch.identity)
        return result


class ModeInjectedPlaneSimulation(DifferentiablePlaneSimulation):
    """Native resident Yee/CPML forward and adjoint with fixed modal sheets."""
    _resident_model_type=_ModalSimulation

    def __init__(self,project,launch,options=None,*,quadrature_counts=None):
        from .streamed import StreamedAdjointOptions
        if isinstance(options,StreamedAdjointOptions):raise ValueError('Modal sources are not yet supported by streamed execution.')
        super().__init__(project,options,quadrature_counts=quadrature_counts)
        self.model.launch=launch
        self.launch=launch
        self.signature=hashlib.sha256((self.signature+launch.identity).encode()).hexdigest()


def modal_plane_amplitudes(plane,launch):
    """Signed-axis forward/backward complex amplitudes in the fixed mode basis.

    Amplitudes include the native time-integral DFT factor (seconds). They are
    referenced to the underlying unit reduced-power mode, not a peak-E basis.
    """
    if plane.normal!=launch.mode.normal:raise ValueError('Modal plane normal mismatch.')
    normal='xyz'.index(plane.normal)
    mode=launch.detector_mode(float(plane.points_um[0,normal]))
    if plane.frequency_hz.numel()!=1 or not torch.isclose(plane.frequency_hz[0],plane.frequency_hz.new_tensor(C0/(mode.wavelength_um*1e-6)),rtol=1e-6):
        raise ValueError('Modal amplitudes require the solved carrier frequency.')
    _uniform_cell_quadrature(plane,mode)
    basis=torch.tensor(mode.sample_plane(plane.points_um.detach().cpu().numpy()),device=plane.fields.device,dtype=plane.fields.dtype)
    basis_scale=basis.abs().max()
    basis=basis/basis_scale
    scale=plane.fields.detach().abs().max()
    if not bool(torch.isfinite(scale)):raise ValueError('Modal fields must be finite.')
    if not bool(scale>0):scale=scale.new_ones(())
    weights=plane.weights/plane.weights.detach().abs().max()
    forward,backward=_amplitudes(plane.fields/scale,basis,weights,normal)
    return dict(forward=forward*scale/basis_scale,backward=backward*scale/basis_scale)


def modal_s_parameters(plane,reference,launch,*,subtract_reference_backward=True):
    """Complex t and r, referenced to propagation in the launch direction.

    t uses the matched reference at the same plane, so an unchanged guide has
    t=1. r subtracts the matched counterpropagating baseline. For a minus launch,
    the incident amplitude is the negative-axis mode. Source eigenmodes stay fixed.
    """
    if plane.run_signature!=reference.run_signature or plane.normal!=reference.normal:
        raise ValueError('Matched modal reference configuration required.')
    for name in ('points_um','weights','frequency_hz'):
        a,b=getattr(plane,name),getattr(reference,name)
        if a.device!=b.device or a.dtype!=b.dtype or a.shape!=b.shape or not torch.equal(a,b):
            raise ValueError('Matched modal reference sampling required.')
    # Common detached spectral-field scaling keeps division seeds in FP32 range.
    scale=reference.fields.detach().abs().max()
    if not bool(torch.isfinite(scale)) or not bool(scale>0):raise ValueError('Modal reference is zero or nonfinite.')
    sample=modal_plane_amplitudes(replace(plane,fields=plane.fields/scale),launch)
    incident=modal_plane_amplitudes(replace(reference,fields=reference.fields/scale),launch)
    f,b=('forward','backward') if launch.direction==1 else ('backward','forward')
    normalization=incident[f]
    # Threshold relative to modal reference support, independent of SI units.
    support=incident[f].abs()+incident[b].abs()
    if not bool(torch.isfinite(support).all()) or bool((support<=0).any()) or bool((normalization.abs()<1e-6*support).any()):
        raise ValueError('Reference has no supported mode in the launch direction.')
    return dict(transmission=sample[f]/normalization,
                reflection=(sample[b]-incident[b] if subtract_reference_backward else sample[b])/normalization,
                forward_amplitude=sample['forward']*scale,backward_amplitude=sample['backward']*scale)
