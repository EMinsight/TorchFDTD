"""Discrete Yee/CPML derivatives with bounded, recomputed physical checkpoints.

The supported contract is real nondispersive diagonal epsilon, fixed mesh,
prepared point/plane sources and indexed observations. Real CUDA forward/replay
uses native fused kernels. Complex Bloch fields use Torch operations. Backward
transposes the actual staggered updates, including conjugate Bloch seams.
This module does not promise derivatives for unsupported scene features.
"""
from __future__ import annotations

from dataclasses import dataclass, field
import math
from pathlib import Path
import tempfile
import time

import numpy as np
import torch

from .boundaries import BoundaryDescription, CURL_TERMS, _slice
from .models import Project
from .solver import field_axes, index_at


@dataclass(frozen=True)
class AdjointOptions:
    checkpoints: int = 4
    storage: str = 'device'
    gpu_budget_bytes: int | None = None
    host_budget_bytes: int | None = None
    disk_budget_bytes: int | None = None
    checkpoint_directory: str | Path | None = None
    device_checkpoints: int = 0
    host_checkpoints: int = 0
    backward_kernel: str = 'auto'
    checkpoint_transfers: str = 'sync'
    staging_slots: int = 2

    def __post_init__(self):
        if self.backward_kernel not in ('auto','torch','fused'):
            raise ValueError('backward_kernel must be auto, torch or fused.')
        if self.checkpoint_transfers not in ('sync','async'):
            raise ValueError('checkpoint_transfers must be sync or async.')
        if isinstance(self.staging_slots,bool) or not isinstance(self.staging_slots,int) or not 1<=self.staging_slots<=4:
            raise ValueError('staging_slots must be an integer from one to four.')
        if isinstance(self.checkpoints, bool) or not isinstance(self.checkpoints,int) or not 0 <= self.checkpoints <= 64:
            raise ValueError('checkpoints must be an integer between 0 and 64.')
        if self.storage not in ('device','host','disk','hierarchical'):
            raise ValueError('Checkpoint storage must be device, host, disk or hierarchical.')
        if any(isinstance(v,bool) or not isinstance(v,int) or v<0 for v in (self.device_checkpoints,self.host_checkpoints)):
            raise ValueError('Tier checkpoint counts must be nonnegative integers.')
        if self.device_checkpoints+self.host_checkpoints>self.checkpoints:
            raise ValueError('Tier checkpoint counts exceed the total checkpoint count.')
        for name in ('gpu_budget_bytes','host_budget_bytes','disk_budget_bytes'):
            value=getattr(self,name)
            if value is not None and (isinstance(value,bool) or not isinstance(value,int) or value <= 0):
                raise ValueError(f'{name} must be a positive integer byte budget.')
        disk=self.checkpoints if self.storage=='disk' else self.checkpoints-self.device_checkpoints-self.host_checkpoints if self.storage=='hierarchical' else 0
        if (self.storage=='disk' or disk) and (self.checkpoint_directory is None or self.disk_budget_bytes is None):
            raise ValueError('Disk checkpoints require a directory and an explicit disk byte budget.')


@dataclass
class DifferentiableResult:
    signals: torch.Tensor
    time_step: float
    monitor_components: tuple[str,...]
    report: dict = field(default_factory=dict)

    def spectrum(self, frequency_hz, *, window=None):
        """Time-integral DFT, including the existing half-step H time convention."""
        frequency=torch.as_tensor(frequency_hz,device=self.signals.device,dtype=self.signals.real.dtype).reshape(-1)
        if not bool(torch.isfinite(frequency).all()) or bool((frequency<=0).any()):
            raise ValueError('Frequencies must be finite and positive.')
        if bool((frequency*self.time_step>=.5).any()):
            raise ValueError('Frequencies must be below temporal Nyquist.')
        t=(torch.arange(self.signals.shape[0],device=frequency.device,dtype=frequency.dtype)+1)*self.time_step
        if window is None:
            weights=torch.ones_like(t)
        else:
            weights=torch.as_tensor(window,device=t.device,dtype=t.dtype)
            if weights.shape!=t.shape:raise ValueError('Window must have one weight per timestep.')
        values=[]
        for i,comp in enumerate(self.monitor_components):
            times=t+(self.time_step/2 if comp[0]=='H' else 0)
            kernel=torch.exp(-2j*torch.pi*frequency[:,None]*times[None,:])
            values.append(kernel@(self.signals[:,i]*weights).to(kernel.dtype)*self.time_step)
        return torch.stack(values,dim=-1)


class _Grid:
    """Weak-referenceable owner for the existing fused CUDA kernel interface."""
    pass


class _System:
    def __init__(self, project, epsilon, *, prepare_updates=True, observation_monitors=None):
        self.project=project
        self.region=r=project.region
        self.epsilon=epsilon
        self.eps4=epsilon[...,None] if epsilon.ndim==3 else epsilon
        self.device,self.dtype=epsilon.device,epsilon.dtype
        self.field_dtype=(torch.complex128 if self.dtype==torch.float64 else torch.complex64) if r.complex_fields else self.dtype
        if not prepare_updates and self.device.type != 'cpu':
            raise ValueError('Storage-only systems require CPU epsilon.')
        self.current_step=0
        # Preparing coefficients must not allocate another full-volume E/H
        # field or touch fdtd's process-global backend.
        template=BoundaryDescription(r)
        g=self.grid=_Grid()
        def initial(shape):
            if not prepare_updates:return torch.zeros((),device=self.device,dtype=self.field_dtype).expand(shape)
            return torch.zeros(shape,device=self.device,dtype=self.field_dtype)
        g.E=initial((*r.shape,3))
        g.H=initial(g.E.shape)
        g.inverse_permittivity=(1/self.eps4.detach()).expand_as(g.E).contiguous() if prepare_updates else None
        g.inverse_permeability=torch.ones(1,device=self.device,dtype=self.dtype)
        g.is_torch=True
        g.courant_number=r.rectangular_courant
        g.time_step=r.time_step
        g.material_states=[]
        g.wrap=template.wrap.copy()
        g.metric={key:(self.tensor(value),edge) for key,(value,edge) in template.metric.items()}
        g.cpml={}
        self.segments=[]
        self.keys={}
        for key,segs in template.cpml.items():
            g.cpml[key]=[]
            self.keys[key]=[]
            for seg in segs:
                item={'slice':seg['slice'], 'psi':initial(seg['shape']),
                      **{name:self.tensor(seg[name]) for name in ('b','c','inv_k')}}
                self.keys[key].append(len(self.segments))
                self.segments.append(item)
                g.cpml[key].append(item)
        self.sources={'E':[],'H':[]}
        from .injection import source_terms,validate_oneway_materials
        if any(s.enabled and s.injection=='oneway' for s in project.sources):
            validate_oneway_materials(project,epsilon.detach().cpu().numpy(),np.broadcast_to(np.array(-1,dtype=np.int32),r.shape))
        for source in project.sources:
            for component,loc,waveform,profile in source_terms(project,source):
                self.sources[component[0]].append((loc,'xyz'.index(component[1].lower()),
                                                  self.tensor(waveform),None if profile is None else self.tensor(profile)))
        self.monitors=[(m.component,index_at(m.center,r,m.component),'xyz'.index(m.component[1].lower()))
                       for m in project.monitors if m.enabled]
        if observation_monitors is not None:self.monitors=list(observation_monitors)
        self.prepare_observations()
        self.kernel=None
        if self.device.type=='cuda' and not r.complex_fields:
            from .cuda_kernels import FusedYeeCUDA
            self.kernel=FusedYeeCUDA(g)
        elif self.device.type=='cuda' and r.cuda_kernel=='fused':
            from .cuda_complex import FusedComplexYeeCUDA
            self.kernel=FusedComplexYeeCUDA(g)

    def prepare_observations(self):
        self.observation_maps=[]
        for family in ('E','H'):
            positions=[];indices=[]
            for position,(name,loc,component) in enumerate(self.monitors):
                if name[0]==family:
                    positions.append(position)
                    indices.append(((loc[0]*self.region.shape[1]+loc[1])*self.region.shape[2]+loc[2])*3+component)
            self.observation_maps.append((torch.tensor(positions,device=self.device,dtype=torch.long),
                                          torch.tensor(indices,device=self.device,dtype=torch.long)))

    def tensor(self,value):
        is_complex=value.is_complex() if isinstance(value,torch.Tensor) else np.iscomplexobj(value)
        dtype=(torch.complex128 if self.dtype==torch.float64 else torch.complex64) if is_complex else self.dtype
        return torch.as_tensor(value,device=self.device,dtype=dtype)

    def state(self):return (self.grid.E,self.grid.H,*(seg['psi'] for seg in self.segments))

    def zero(self):
        for value in self.state():value.zero_()
        self.current_step=0

    def curl(self,field,psis,forward):
        g=self.grid
        result=torch.zeros_like(field)
        updated=list(psis)
        for axis,component,out,sign in CURL_TERMS:
            if field.shape[axis]==1:continue
            low,high=_slice(axis,slice(None,-1),component),_slice(axis,slice(1,None),component)
            derivative=field[high]-field[low]
            metric=g.metric.get((forward,axis))
            if metric:derivative=derivative*metric[0]
            for i in self.keys[forward,axis,component]:
                seg=self.segments[i];sl=seg['slice']
                data=derivative[sl]
                psi=seg['b']*psis[i]+seg['c']*data
                updated[i]=psi
                derivative=derivative.clone()
                derivative[sl]=data*seg['inv_k']+psi
            target=_slice(axis,slice(None,-1) if forward else slice(1,None),out)
            result[target]=result[target]+sign*derivative
            if axis in g.wrap:
                phase=g.wrap[axis]
                first,last=field[_slice(axis,0,component)],field[_slice(axis,-1,component)]
                edge=phase*first-last if forward else first-last/phase
                if metric:edge=edge*metric[1]
                dest=_slice(axis,-1 if forward else 0,out)
                result[dest]=result[dest]+sign*edge
        return result,tuple(updated)

    def curl_transpose(self,bar,psi_bar,forward):
        g=self.grid
        result=torch.zeros_like(bar)
        previous=list(psi_bar)
        for axis,component,out,sign in CURL_TERMS:
            if bar.shape[axis]==1:continue
            target=_slice(axis,slice(None,-1) if forward else slice(1,None),out)
            derivative=sign*bar[target]
            for i in self.keys[forward,axis,component]:
                seg=self.segments[i];sl=seg['slice']
                value=derivative[sl]
                memory_bar=psi_bar[i]+value
                previous[i]=seg['b']*memory_bar
                derivative=derivative.clone()
                derivative[sl]=value*seg['inv_k']+seg['c']*memory_bar
            metric=g.metric.get((forward,axis))
            if metric:derivative=derivative*metric[0]
            low,high=_slice(axis,slice(None,-1),component),_slice(axis,slice(1,None),component)
            result[high]=result[high]+derivative
            result[low]=result[low]-derivative
            if axis in g.wrap:
                edge=sign*bar[_slice(axis,-1 if forward else 0,out)]
                if metric:edge=edge*metric[1]
                first,last=_slice(axis,0,component),_slice(axis,-1,component)
                phase=g.wrap[axis]
                result[first]=result[first]+(np.conj(phase)*edge if forward else edge)
                result[last]=result[last]-(edge if forward else np.conj(1/phase)*edge)
        return result,tuple(previous)

    def inject(self,value,family,step,*,functional=False):
        if functional and self.sources[family]:value=value.clone()
        for loc,component,wave,profile in self.sources[family]:
            amplitude=wave[step] if profile is None else wave[step]*profile
            value[loc+(component,)]=value[loc+(component,)]+amplitude
        return value

    def reference_step(self,state,step,epsilon):
        e,h,*psis=state
        ce,psis=self.curl(h,psis,False)
        eps=epsilon[...,None] if epsilon.ndim==3 else epsilon
        e=self.inject(e+self.grid.courant_number/eps*ce,'E',step,functional=True)
        ch,psis=self.curl(e,psis,True)
        h=self.inject(h-self.grid.courant_number*ch,'H',step,functional=True)
        return (e,h,*psis)

    def advance(self,start,end):
        if self.grid.inverse_permittivity is None:
            raise RuntimeError('Storage-only initial states cannot be advanced in place. Use a tile operator.')
        for step in range(start,end):
            if self.kernel is not None:
                self.kernel.update_E();self.inject(self.grid.E,'E',step)
                self.kernel.update_H();self.inject(self.grid.H,'H',step)
            else:
                new=self.reference_step(self.state(),step,self.epsilon)
                for target,value in zip(self.state(),new):target.copy_(value)
        self.current_step=end

    def observe(self,state):
        result=state[0].new_empty(len(self.monitors))
        for field,(positions,indices) in zip(state[:2],self.observation_maps):
            if indices.numel():result.index_copy_(0,positions,field.reshape(-1).index_select(0,indices))
        return result

    def transpose_step(self,state,adjoint,signal_bar):
        e_bar,h_bar,*psi_bar=adjoint
        # Every point sample is taken after both source injections of this step.
        # Multiple monitors may coincide, so their adjoints must accumulate.
        for target,(positions,indices) in zip((e_bar,h_bar),self.observation_maps):
            if indices.numel():target.reshape(-1).index_add_(0,indices,signal_bar.index_select(0,positions))
        contribution,psi_bar=self.curl_transpose(-self.grid.courant_number*h_bar,psi_bar,True)
        e_bar=e_bar+contribution
        curl_e,_=self.curl(state[1],state[2:],False)
        full=-self.grid.courant_number*(e_bar.conj()*curl_e).real/self.eps4.square()
        gradient=full.sum_to_size(self.eps4.shape)
        if self.epsilon.ndim==3:gradient=gradient[...,0]
        contribution,psi_bar=self.curl_transpose(self.grid.courant_number/self.eps4*e_bar,psi_bar,False)
        return (e_bar,h_bar+contribution,*psi_bar),gradient


class _Checkpoints:
    def __init__(self,system,options,report,*,admission=False):
        self.system,self.options,self.report=system,options,report
        self.values={};self.times={};self.prefetched={};self.serial=0;self.directory=None;self.staging=None
        self.size=sum(x.numel()*x.element_size() for x in system.state())
        if options.storage=='hierarchical':
            disk=options.checkpoints-options.device_checkpoints-options.host_checkpoints
            # Outer recursion has the longest reuse distance. Keep those states
            # on slower tiers and the innermost, frequently reused states nearby.
            self.tiers=['disk']*disk+['host']*options.host_checkpoints+['device']*options.device_checkpoints
        else:self.tiers=[options.storage]*options.checkpoints
        disk_count=self.tiers.count('disk');host_count=self.tiers.count('host')
        asynchronous=options.checkpoint_transfers=='async' and (disk_count or host_count)
        host_bytes=self.size*(host_count+(options.staging_slots if asynchronous else 0)+(1 if disk_count else 0))
        archive_bound=self.size+4096+512*len(system.state())
        if options.host_budget_bytes is not None and host_bytes>options.host_budget_bytes:
            raise ValueError('Host checkpoint budget cannot hold its slots and disk staging state.')
        if disk_count and archive_bound*disk_count>options.disk_budget_bytes:
            raise ValueError('Disk checkpoint budget must include its slots and archive headers.')
        if disk_count:
            root=Path(options.checkpoint_directory).resolve()
            root.mkdir(parents=True,exist_ok=True)
            self.directory=Path(tempfile.mkdtemp(prefix='photonweave-adjoint-',dir=root)).resolve()
            if self.directory.parent!=root:raise RuntimeError('Checkpoint path escaped the selected directory.')
        report.update(restart_bytes=self.size,checkpoint_capacity=options.checkpoints,
                      checkpoint_storage=options.storage,peak_checkpoints=0,checkpoint_bytes_written=0,
                      checkpoint_bytes_read=0,checkpoint_io_seconds=0.,replayed_steps=0,
                      checkpoint_tiers=self.tiers.copy(),peak_checkpoints_by_tier={t:0 for t in ('device','host','disk')})
        if asynchronous and not admission:
            from .staging import AsyncStateStaging
            self.staging=AsyncStateStaging(system.state(),options.staging_slots,report)

    def save(self):
        if len(self.values)>=self.options.checkpoints:raise RuntimeError('Checkpoint scheduler exceeded its slot budget.')
        started=time.perf_counter();key=self.serial;self.serial+=1
        state=self.system.state()
        tier=self.tiers[len(self.values)]
        if self.staging is not None and tier!='device':
            path=self.directory/f'{key}.npz' if tier=='disk' else None
            value=self.staging.save(state,path=path,max_file_bytes=self.size+4096+512*len(state))
        elif tier=='device':
            value=tuple(x.clone() for x in state)
        elif tier=='host':
            value=tuple(x.detach().to('cpu',copy=True) for x in state)
        else:
            value=self.directory/f'{key}.npz'
            # Uncompressed arrays preserve exact field bits. Only this owned
            # file is later removed. No existing user directory is deleted.
            try:
                np.savez(value,**{f's{i}':x.detach().cpu().numpy() for i,x in enumerate(state)})
                if sum(p.stat().st_size for p in self.directory.iterdir())>self.options.disk_budget_bytes:
                    raise ValueError('Disk checkpoint budget must include archive headers.')
            except BaseException:
                value.unlink(missing_ok=True)
                raise
        self.values[key]=(tier,value)
        self.times[key]=self.system.current_step
        self.report['peak_checkpoints']=max(self.report['peak_checkpoints'],len(self.values))
        count=sum(t==tier for t,_ in self.values.values())
        self.report['peak_checkpoints_by_tier'][tier]=max(self.report['peak_checkpoints_by_tier'][tier],count)
        self.report['checkpoint_bytes_written']+=self.size
        self.report['checkpoint_io_seconds']+=time.perf_counter()-started
        return key

    def restore(self,key):
        target_time=0 if key is None else self.times[key]
        if self.system.current_step==target_time:
            if key in self.prefetched:self.staging.consume(self.prefetched.pop(key))
            return
        if key is None:
            self.system.zero();return
        started=time.perf_counter();tier,value=self.values[key]
        if self.staging is not None and tier!='device':
            ticket=self.prefetched.pop(key,None)
            if ticket is None:ticket=self.staging.load(value,disk=tier=='disk')
            self.staging.consume(ticket,self.system.state())
        elif tier=='disk':
            with np.load(value,allow_pickle=False) as archive:
                for i,target in enumerate(self.system.state()):
                    target.copy_(torch.from_numpy(archive[f's{i}']))
        else:
            for target,source in zip(self.system.state(),value):target.copy_(source)
        self.report['checkpoint_bytes_read']+=self.size
        self.report['checkpoint_io_seconds']+=time.perf_counter()-started
        self.system.current_step=target_time

    def prefetch(self,key):
        if self.staging is None or key is None or key in self.prefetched:return
        tier,value=self.values[key]
        if tier!='device':self.prefetched[key]=self.staging.load(value,disk=tier=='disk')

    def drop(self,key):
        error=None
        if key in self.prefetched:
            try:self.staging.consume(self.prefetched.pop(key))
            except BaseException as exc:error=exc
        tier,value=self.values.pop(key)
        self.times.pop(key)
        future=value if hasattr(value,'result') else None
        try:
            if future is not None:value=future.result()
            if tier=='disk':value.unlink()
        except BaseException as exc:
            if error is None:error=exc
        finally:
            if self.staging is not None and future is not None:self.staging.forget(future)
        if error is not None:raise error

    def close(self):
        error=None
        for key in list(self.values):
            try:self.drop(key)
            except BaseException as exc:
                if error is None:error=exc
        if self.staging is not None:
            try:self.staging.close()
            except BaseException as exc:
                if error is None:error=exc
        if self.directory is not None:self.directory.rmdir()
        if error is not None:raise error


def _split(length,slots):
    """Binomial-capacity split, with a bounded depth in checkpoint slots."""
    # The interval's restart state is available in addition to the free slots.
    # At the root it is the implicit zero state. Count that level as well, so
    # even one saved checkpoint reduces replay instead of repeatedly saving
    # the penultimate state. Pascal's identity gives the left/right capacities.
    repetitions=0
    while math.comb(slots+repetitions+1,slots+1)<length:repetitions+=1
    return min(length-1,math.comb(slots+repetitions,slots+1))


class _FDTD(torch.autograd.Function):
    @staticmethod
    def forward(ctx,epsilon,system,options,report,spectral):
        ctx.save_for_backward(epsilon)
        ctx.system,ctx.options,ctx.report=system,options,report
        ctx.spectral=spectral
        system.zero()
        signals=system.grid.E.new_empty((system.region.steps,len(system.monitors))) if spectral is None else spectral.zeros()
        samples=None if spectral is None else system.grid.E.new_empty((spectral.block_size,len(system.monitors)))
        started=time.perf_counter()
        for step in range(system.region.steps):
            system.advance(step,step+1)
            values=system.observe(system.state())
            if spectral is None:signals[step]=values
            else:
                local=step%spectral.block_size
                samples[local]=values
                if local+1==spectral.block_size or step+1==system.region.steps:
                    spectral.accumulate(signals,samples[:local+1],step-local)
        if epsilon.is_cuda:torch.cuda.synchronize(epsilon.device)
        report['forward_seconds']=time.perf_counter()-started
        return signals

    @staticmethod
    def backward(ctx,signal_bar):
        if torch.is_grad_enabled():
            raise RuntimeError('Higher-order derivatives are not supported by the discrete adjoint yet.')
        epsilon,=ctx.saved_tensors
        system,options,report=ctx.system,ctx.options,ctx.report
        started=time.perf_counter()
        gradient=torch.zeros(epsilon.shape,device=epsilon.device,dtype=epsilon.dtype)
        fused=None
        if epsilon.is_cuda and options.backward_kernel!='torch' and (not system.region.complex_fields or options.backward_kernel=='fused'):
            if system.region.complex_fields:
                from .cuda_complex_adjoint import FusedComplexAdjointCUDA as Kernel
            else:
                from .cuda_adjoint import FusedAdjointCUDA as Kernel
            fused_seed=signal_bar if ctx.spectral is None else torch.empty((ctx.spectral.block_size,len(system.monitors)),device=epsilon.device,dtype=system.field_dtype)
            fused=Kernel(system,gradient,fused_seed)
        adjoint=None if fused else tuple(torch.zeros_like(x) for x in system.state())
        checkpoints=_Checkpoints(system,options,report)

        def replay(key,start,end):
            checkpoints.restore(key)
            system.advance(start,end)
            report['replayed_steps']+=end-start

        spectral_start=-1
        spectral_seed=None
        def reverse(start,end,key,slots):
            nonlocal adjoint,spectral_start,spectral_seed
            # The left recursion is a loop. Only the right branch consumes a
            # checkpoint slot, so Python call depth never grows with duration.
            while end>start:
                if end-start==1 or slots==0:
                    for step in range(end-1,start-1,-1):
                        replay(key,start,step)
                        if step>start:checkpoints.prefetch(key)
                        if ctx.spectral is None:
                            seed=signal_bar[step]
                            observation_index=None
                        else:
                            begin=(step//ctx.spectral.block_size)*ctx.spectral.block_size
                            if begin!=spectral_start:
                                spectral_seed=ctx.spectral.transpose(signal_bar,begin,min(begin+ctx.spectral.block_size,system.region.steps))
                                spectral_start=begin
                                if fused:fused.signal_bar[:len(spectral_seed)].copy_(spectral_seed)
                            observation_index=step-begin
                            seed=spectral_seed[observation_index]
                        if fused:
                            fused.step(step,observation_index=observation_index)
                        else:
                            adjoint,part=system.transpose_step(system.state(),adjoint,seed)
                            gradient.add_(part)
                    return
                middle=start+_split(end-start,slots)
                replay(key,start,middle)
                saved=checkpoints.save()
                try:reverse(middle,end,saved,slots-1)
                finally:checkpoints.drop(saved)
                end=middle

        try:
            reverse(0,system.region.steps,None,options.checkpoints)
            if epsilon.is_cuda:torch.cuda.synchronize(epsilon.device)
            report['backward_seconds']=time.perf_counter()-started
        finally:
            # Break the recursive closure cycle so solver buffers do not wait
            # for cyclic GC after the caller releases its result graph.
            reverse=None
            checkpoints.close()
        return gradient,None,None,None,None


class DifferentiableSimulation(torch.nn.Module):
    """Torch-native epsilon-to-point-signal operation with a discrete adjoint.

    Epsilon has shape (Nx,Ny,Nz), or (Nx,Ny,Nz,3) for diagonal Yee values.
    Geometry uses the existing micrometre convention. This is an experimental
    fixed-mesh design API, not a claim that every forward feature differentiates.
    """
    def __init__(self,project: Project,options: AdjointOptions | None=None):
        super().__init__()
        self.project=Project.model_validate(project.model_dump())
        self.options=options or AdjointOptions()
        p=self.project;r=p.region
        if r.interface_method!='staircase':
            raise ValueError('DifferentiableSimulation currently requires staircase coefficients.')
        active={s.material for s in p.structures if s.enabled}
        if any(m.oscillators and m.name in active for m in p.materials):
            raise ValueError('Dispersive ADE derivatives are not implemented yet.')
        if any(s.enabled and s.kind=='tfsf' for s in p.sources):
            raise ValueError('Live TFSF incident-state derivatives are not implemented yet.')
        if not any(m.enabled for m in p.monitors) or any(m.enabled and m.kind!='point' for m in p.monitors):
            raise ValueError('The differentiable API currently requires point monitors only.')
        if r.run_control.auto_shutoff:
            raise ValueError('Differentiable simulations require a fixed number of timesteps.')

    def spectrum(self,epsilon,frequency_hz,*,window=None,block_size=32):
        """Online DFT with fixed settings and a bounded observation transpose."""
        from .adjoint_spectrum import SpectralObservation
        spectral=SpectralObservation(epsilon,self.project.region,
                                     [m.component for m in self.project.monitors if m.enabled],frequency_hz,window,block_size)
        return self._run(epsilon,spectral)

    def forward(self,epsilon: torch.Tensor):
        return self._run(epsilon,None)

    def _run(self,epsilon,spectral):
        r=self.project.region
        r.require_resident()
        if not isinstance(epsilon,torch.Tensor) or epsilon.dtype not in (torch.float32,torch.float64):
            raise ValueError('epsilon must be a real float32 or float64 torch Tensor.')
        if epsilon.device.type not in ('cpu','cuda'):
            raise ValueError('Only CPU and CUDA tensors are supported.')
        if epsilon.device.type!='cuda' and self.options.backward_kernel=='fused':
            raise ValueError('The fused backward requires a CUDA tensor.')
        if epsilon.device.type!='cuda' and self.options.checkpoint_transfers=='async':
            raise ValueError('Asynchronous checkpoints require a CUDA tensor.')
        if tuple(epsilon.shape) not in (r.shape,r.shape+(3,)):
            raise ValueError('epsilon shape must match the scene grid, optionally with three Yee components.')
        if not bool(torch.isfinite(epsilon).all()) or bool((epsilon<1).any()):
            raise ValueError('This conservative CFL contract requires finite epsilon >= 1.')
        if (epsilon.dtype==torch.float64)!=(r.precision=='float64'):
            raise ValueError('epsilon dtype must match the project precision.')
        # Reserve a conservative bound before creating native fields or tapes.
        # This includes replay, transposed curls, full epsilon gradient and CPML.
        n=math.prod(r.shape);item=epsilon.element_size()*(2 if r.complex_fields else 1)
        cpml_upper=12*n
        state_upper=(6*n+cpml_upper)*item
        workspace=(42*n+5*cpml_upper)*item
        monitor_count=sum(m.enabled for m in self.project.monitors) if spectral is None else len(spectral.components)
        source_terms_count=sum(len(s.polarization_components)*(2 if s.injection=='oneway' else 1)
                               for s in self.project.sources if s.enabled)
        output_bytes=r.steps*monitor_count*item if spectral is None else spectral.reservation(spectral.block_size)['spectral_output_bytes']
        source_bytes=r.steps*source_terms_count*item
        # The physical tape is bounded, but outputs and prepared drives are not.
        # Reserve the returned signals and their incoming first-order adjoints.
        # User objectives, spectrum matrices and geometry graphs have separate
        # allocations and cannot be bounded by this solver admission estimate.
        history_bytes=2*output_bytes+source_bytes if spectral is None else spectral.reservation(spectral.block_size)['spectral_reservation_bytes']+source_bytes
        device_slots=self.options.checkpoints if self.options.storage=='device' else self.options.device_checkpoints if self.options.storage=='hierarchical' else 0
        if self.options.checkpoint_transfers=='async' and self.options.checkpoints>device_slots:
            device_slots+=self.options.staging_slots
        observation_index_bytes=16*monitor_count
        required=workspace+device_slots*state_upper+history_bytes+observation_index_bytes
        if epsilon.is_cuda:
            free,_=torch.cuda.mem_get_info(epsilon.device)
            budget=min(int(free*.8),self.options.gpu_budget_bytes or int(free*.8))
            if required>budget:raise ValueError('Adjoint workspace and checkpoint reservation exceed the GPU budget.')
        report=dict(experimental=True,adjoint='discrete Yee/CPML',higher_order=False,
                    spatial_streaming=False,full_time_autograd=False,steps=r.steps,
                    forward_backend='fused CUDA' if epsilon.is_cuda and (not r.complex_fields or r.cuda_kernel=='fused') else 'torch CUDA' if epsilon.is_cuda else 'torch CPU',
                    backward_backend='fused CUDA complex transpose' if epsilon.is_cuda and r.complex_fields and self.options.backward_kernel=='fused' else 'fused CUDA transpose' if epsilon.is_cuda and not r.complex_fields and self.options.backward_kernel!='torch' else 'torch explicit transpose',memory_reservation_bytes=required,
                    workspace_reservation_bytes=workspace,history_reservation_bytes=history_bytes,
                    checkpoint_transfers=self.options.checkpoint_transfers,output_history_bytes=output_bytes if spectral is None else 0,
                    source_history_bytes=source_bytes,observation_index_bytes=observation_index_bytes)
        # A later wavelength/ray configuration must not alter an earlier graph's replay.
        with torch.no_grad():system=_System(self.project.model_copy(deep=True),epsilon,observation_monitors=None if spectral is None else spectral.observers)
        # Check host/disk admission before spending the forward compute time.
        admission=_Checkpoints(system,self.options,report,admission=True)
        admission.close()
        report['observation_storage']='time_history' if spectral is None else 'online_spectrum'
        if spectral is not None:report.update(spectral.reservation(spectral.block_size),spectral_block_size=spectral.block_size)
        signals=_FDTD.apply(epsilon,system,self.options,report,spectral)
        if spectral is not None:return spectral.result(signals,report)
        return DifferentiableResult(signals,r.time_step,tuple(m.component for m in self.project.monitors if m.enabled),report)

    def reference(self,epsilon):
        """Small-problem full-autograd oracle. Not the large-simulation path."""
        if math.prod(self.project.region.shape)*self.project.region.steps>2_000_000:
            raise ValueError('Full-autograd reference is restricted to at most two million cell-steps.')
        system=_System(self.project,epsilon)
        state=tuple(torch.zeros_like(x) for x in system.state())
        signals=[]
        for step in range(system.region.steps):
            state=system.reference_step(state,step,epsilon)
            signals.append(system.observe(state))
        return torch.stack(signals)


def smooth_sphere_epsilon(region,radius,*,center=None,inside=4.,outside=1.,width=None,yee=False):
    """Differentiable sigmoid sphere, in um. A regularized geometry, not CAD subpixel.

    Radius/center/material parameters retain their Torch gradients. Decrease
    smoothing width only with an independent mesh/physical-gradient study.
    """
    if not isinstance(radius,torch.Tensor) or radius.ndim!=0 or not radius.is_floating_point():
        raise ValueError('radius must be a scalar floating-point Torch tensor.')
    width=region.reference_step if width is None else width
    if not math.isfinite(width) or width<=0:raise ValueError('Smoothing width must be positive.')
    center=radius.new_zeros(3) if center is None else torch.as_tensor(center,device=radius.device,dtype=radius.dtype)
    if center.shape!=(3,):raise ValueError('center must contain three coordinates in um.')
    if not bool(torch.isfinite(radius)) or not bool(radius>0):raise ValueError('Radius must be finite and positive.')
    def at(axes):
        coords=torch.meshgrid(*(torch.tensor(a,device=radius.device,dtype=radius.dtype) for a in axes),indexing='ij')
        square=sum((c-center[i]).square() for i,c in enumerate(coords))
        # Avoid the undefined derivative of sqrt at the sphere centre.
        distance=torch.sqrt(square+torch.finfo(radius.dtype).tiny)
        fraction=torch.sigmoid((radius-distance)/width)
        return outside+(inside-outside)*fraction
    if yee:return torch.stack([at(field_axes(region,c)) for c in ('Ex','Ey','Ez')],dim=-1)
    return at([(a[:-1]+a[1:])/2 if len(a)>2 else np.array([0.]) for a in region.mesh_nodes])
