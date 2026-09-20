"""Bounded resident exact-endpoint PMC/PEC simulation and first derivatives.

Separate from Project/Simulation dispatch. Coordinates are micrometres, time
seconds, E is in electric-field units and magnetic output is impedance-scaled
Z0*H. Only nondispersive diagonal sampled relative epsilon and real FP32 are
supported. Point sources add E between the electric and magnetic Yee substeps.
"""
import math
from itertools import count
import numpy as np
import torch
from torch.autograd.function import once_differentiable

from .differentiable import _split
from .pmc_cuda import CompactEndpointTopology, EndpointCUDA
from .pmc_reference import EndpointTopology, EndpointReference, ReferenceState

C_UM_S = 299792458.0 * 1e6



def _reverse_schedule(steps,slots):
    """Binomial replay actions with recursion bounded by checkpoint slots."""
    keys=count()
    def interval(start,end,key,available):
        while end>start:
            if end-start==1 or available==0:
                for step in range(end-1,start-1,-1):
                    yield ('replay',key,start,step)
                    yield ('reverse',step)
                return
            middle=start+_split(end-start,available)
            yield ('replay',key,start,middle)
            saved=next(keys)
            yield ('save',saved)
            yield from interval(middle,end,saved,available-1)
            yield ('drop',saved)
            end=middle
    yield from interval(0,steps,None,slots)


class EndpointSimulation:
    """Resident closed-cavity solver with explicit packed Yee source/observation DOFs.

    ``sources`` contains (component, (ix, iy, iz)) electric DOFs.
    ``observations`` contains (family, component, (ix, iy, iz)). Sources must be
    unique, active electric DOFs. Waveforms [steps, sources] are additive E
    increments, not current-density amplitudes. The magnetic update sees the
    kicked E field. Samples follow the complete step.
    ``checkpoints`` controls resident saved states; replay trades time for space.
    ``tensor_budget_bytes`` bounds solver tensor payload, not allocator/runtime
    overhead or the Python sparse metadata used by the CPU correctness backend.
    """
    def __init__(self, nodes_um, faces, *, dt_seconds, sources, observations,
                 device='cpu', checkpoints=4, tensor_budget_bytes=256_000_000):
        aliases={'pec':'pec','antisymmetric':'pec','pmc':'pmc','symmetric':'pmc'}
        try:faces=tuple(tuple(aliases[x.lower()] for x in pair) for pair in faces)
        except (KeyError,AttributeError) as exc:raise ValueError('Only PEC/PMC and antisymmetric/symmetric closed faces are supported.') from exc
        self.topology=CompactEndpointTopology(nodes_um,faces)
        if isinstance(checkpoints,bool) or not isinstance(checkpoints,int) or not 0<=checkpoints<=64:
            raise ValueError('checkpoints must be an integer in [0, 64].')
        if isinstance(tensor_budget_bytes,bool) or not isinstance(tensor_budget_bytes,int) or tensor_budget_bytes<=0:
            raise ValueError('A positive integer tensor_budget_bytes is required.')
        self.dt=float(dt_seconds)*C_UM_S
        if not math.isfinite(self.dt) or self.dt<=0:raise ValueError('dt_seconds must be finite and positive.')
        self.device=torch.device(device)
        if self.device.type not in ('cpu','cuda'):raise ValueError('Only CPU reference and CUDA devices are supported.')
        if self.device.type=='cuda':self.device=torch.device('cuda',torch.cuda.current_device() if self.device.index is None else self.device.index)
        self.checkpoints=checkpoints;self.tensor_budget_bytes=tensor_budget_bytes
        self.source_ids=tuple(self.dof('E',c,q) for c,q in sources)
        if len(set(self.source_ids))!=len(self.source_ids):raise ValueError('Source DOFs must be unique.')
        self.observation_ids=tuple((f,self.dof(f,c,q)) for f,c,q in observations)
        if not self.observation_ids:raise ValueError('At least one observation is required.')
        # Reject even a minimal working set before constructing CPU incidence maps.
        if self.device.type=='cpu' and math.prod(self.topology.shape)>32768:
            raise ValueError('CPU endpoint reference is limited to 32768 cells; use CUDA for larger resident simulations.')
        preliminary_metadata=(81*sum(self.topology.counts.values()) if self.device.type=='cpu'
                              else sum(4*(2*n+1) for n in self.topology.shape))
        if self._payload(1,0)+preliminary_metadata+8*len(self.source_ids)>tensor_budget_bytes:
            raise ValueError('Endpoint tensor budget is too small for fields/workspaces/metadata.')
        if self.device.type=='cuda':
            self.backend=EndpointCUDA(self.topology,device=self.device)
            self.metadata_bytes=self.backend.metadata_bytes
        else:
            reference=EndpointTopology(self.topology.nodes,self.topology.faces)
            self.backend=EndpointReference(reference)
            self.metadata_bytes=sum(t.numel()*t.element_size() for group in self.backend.operators.values() for t in group)+sum(t.numel()*t.element_size() for t in self.backend.active.values())
        self.source_tensor=torch.tensor(self.source_ids,device=self.device,dtype=torch.long)
        self.metadata_bytes+=self.source_tensor.numel()*8

    def dof(self,family,component,index):
        """Resolve exact Yee integer coordinates without nearest-cell snapping."""
        if family not in ('E','H') or isinstance(component,bool) or component not in (0,1,2):raise ValueError('DOF requires E/H and component 0, 1 or 2.')
        q=tuple(index)
        if len(q)!=3 or any(isinstance(x,bool) or not isinstance(x,(int,np.integer)) for x in q):raise ValueError('DOF indices must be three integers.')
        upper=[]
        for a,(i,n) in enumerate(zip(q,self.topology.shape)):
            node=component!=a if family=='E' else component==a
            if i<0 or i>n or (i==n and (not node or self.topology.faces[a][1]!='pmc')):
                raise ValueError('DOF is outside the stored physical endpoint topology.')
            if i==0 and node and self.topology.faces[a][0]=='pec':raise ValueError('DOF is constrained by a PEC wall.')
            if i==n:upper.append(a)
        if not upper:return int(np.ravel_multi_index(q,self.topology.shape))*3+component
        for block in self.topology.blocks[family][1:]:
            if block.component==component and block.upper_axes==tuple(upper):
                local=tuple(0 if a in upper else i for a,i in enumerate(q))
                return block.start+int(np.ravel_multi_index(local,block.shape))
        raise ValueError('No stored endpoint block for this DOF.')

    def sample_epsilon(self,sampler,*,chunk_size=65536):
        """Evaluate sampler(xyz_um, component) at actual E coordinates, including edges.

        Autograd may link these samples to geometry/material parameters. It does
        not infer an endpoint material by replicating an interior volume cell.
        """
        if isinstance(chunk_size,bool) or not isinstance(chunk_size,int) or chunk_size<=0:raise ValueError('chunk_size must be positive.')
        pieces=[]
        for block in self.topology.blocks['E']:
            for start in range(block.start,block.stop,chunk_size):
                offset=torch.arange(start,min(start+chunk_size,block.stop),device=self.device)-block.start
                comp=offset%3 if block.component is None else torch.full_like(offset,block.component)
                linear=offset//3 if block.component is None else offset
                shape=block.shape[:3];indices=[]
                for a in range(3):
                    index=(linear//math.prod(shape[a+1:]))%shape[a]
                    if a in block.upper_axes:index=torch.full_like(index,self.topology.shape[a])
                    indices.append(index)
                coordinates=[]
                for a,index in enumerate(indices):
                    nodes=torch.tensor(self.topology.nodes[a],device=self.device,dtype=torch.float32)
                    node=comp!=a
                    coordinates.append(torch.where(node,nodes[index],(nodes[index]+nodes[torch.clamp(index+1,max=len(nodes)-1)])/2))
                value=sampler(torch.stack(coordinates,dim=1),comp)
                if not isinstance(value,torch.Tensor) or value.shape!=comp.shape:raise ValueError('Sampler must return one epsilon per electric DOF.')
                pieces.append(value)
        return torch.cat(pieces)

    def _payload(self,steps,saved):
        state=4*sum(self.topology.counts.values());electric=4*self.topology.counts['E']
        return (saved+12)*state+3*electric+8*steps*(len(self.source_ids)+len(self.observation_ids))

    def memory_plan(self,steps):
        if isinstance(steps,bool) or not isinstance(steps,int) or steps<=0:raise ValueError('steps must be a positive integer.')
        count=min(self.checkpoints,max(0,steps-1))
        return {'checkpoint_states':count,'tensor_upper_bound_bytes':self._payload(steps,count)+self.metadata_bytes,
                'backend':'cuda-direct' if self.device.type=='cuda' else 'cpu-reference',
                'excludes':'allocator/runtime overhead, caller sampler graph and CPU Python topology metadata',
                'replay':'binomial bounded-slot schedule; no segment-state cache'}

    def _configuration(self):
        def token(value):return (id(value),value._version,tuple(value.shape),value.dtype,value.device)
        tensors=([self.source_tensor]+list(self.backend.metrics) if self.device.type=='cuda' else
                 [self.source_tensor]+[v for key in sorted(self.backend.operators) for v in self.backend.operators[key]]+
                 [self.backend.active[key] for key in sorted(self.backend.active)])
        return (self.dt,self.source_ids,self.observation_ids,self.device,self.checkpoints,
                id(self.backend),tuple(token(value) for value in tensors))

    def _material(self,epsilon):
        if self.device.type=='cuda':return self.backend.prepare_epsilon(epsilon)
        return epsilon

    def _zero(self):return ReferenceState(*(torch.zeros(self.topology.counts[f],device=self.device,dtype=torch.float32) for f in ('E','H')))

    def _step(self,state,material,drive):
        result=self.backend.step(state,material,self.dt)
        if self.source_ids:
            kick=torch.zeros_like(result.electric).index_add_(0,self.source_tensor,drive)
            result.electric.add_(kick)
            result.magnetic.sub_(self.dt*self.backend.curl(kick,True))
        return result

    def __call__(self,epsilon,waveforms):
        for value in (epsilon,waveforms):
            if not isinstance(value,torch.Tensor) or value.device!=self.device or value.dtype!=torch.float32 or not value.is_contiguous():
                raise ValueError('Inputs must be contiguous real FP32 tensors on the configured device.')
        if epsilon.shape!=(self.topology.counts['E'],):raise ValueError('Positive sampled epsilon is required at every E DOF.')
        if waveforms.ndim!=2 or waveforms.shape[1]!=len(self.source_ids):raise ValueError('Waveforms must have shape [steps, sources].')
        plan=self.memory_plan(waveforms.shape[0])
        if plan['tensor_upper_bound_bytes']>self.tensor_budget_bytes:raise ValueError('Requested simulation exceeds endpoint tensor budget.')
        for value in (epsilon,waveforms):
            if not bool(torch.isfinite(value.detach()).all()):raise ValueError('Inputs must be finite.')
        if bool((epsilon.detach()<=0).any()):raise ValueError('Positive sampled epsilon is required at every E DOF.')
        if self.dt>math.sqrt(float(epsilon.detach().min()))*self.topology.cfl_unit*(1+1e-7):raise ValueError('dt_seconds exceeds conservative Yee CFL.')
        return _EndpointTrace.apply(epsilon,waveforms,self)


class _EndpointTrace(torch.autograd.Function):
    @staticmethod
    def forward(ctx,epsilon,waveforms,simulation):
        sim=simulation;steps=len(waveforms)
        material=sim._material(epsilon.detach());state=sim._zero()
        report={'forward_steps':steps,'replayed_steps':0,'checkpoint_saves':0,
                'peak_checkpoints':0,'reverse_steps':0}
        sim.last_report=report
        trace=epsilon.new_empty((steps,len(sim.observation_ids)))
        for n in range(steps):
            state=sim._step(state,material,waveforms[n])
            for j,(family,index) in enumerate(sim.observation_ids):trace[n,j]=(state.electric if family=='E' else state.magnetic)[index]
        ctx.save_for_backward(epsilon,waveforms);ctx.sim=sim;ctx.report=report;ctx.configuration=sim._configuration()
        return trace

    @staticmethod
    @once_differentiable
    def backward(ctx,gradient):
        epsilon,waveforms=ctx.saved_tensors;sim=ctx.sim
        if sim._configuration()!=ctx.configuration:raise RuntimeError('Endpoint configuration changed before backward.')
        material=sim._material(epsilon.detach());seed=sim._zero()
        ge=torch.zeros_like(epsilon);gw=torch.zeros_like(waveforms)
        saved={};state=None;report=ctx.report
        try:
            for action in _reverse_schedule(len(waveforms),sim.checkpoints):
                kind=action[0]
                if kind=='replay':
                    _,key,start,end=action
                    state=sim._zero() if key is None else saved[key]
                    for step in range(start,end):state=sim._step(state,material,waveforms[step])
                    report['replayed_steps']+=end-start
                elif kind=='save':
                    saved[action[1]]=state
                    report['checkpoint_saves']+=1
                    report['peak_checkpoints']=max(report['peak_checkpoints'],len(saved))
                elif kind=='drop':
                    del saved[action[1]]
                else:
                    n=action[1]
                    for j,(family,index) in enumerate(sim.observation_ids):
                        (seed.electric if family=='E' else seed.magnetic)[index]+=gradient[n,j]
                    if sim.source_ids:
                        source_seed=seed.electric-sim.dt*sim.backend.curl(seed.magnetic,True,transpose=True)
                        gw[n]=source_seed[sim.source_tensor]
                    seed,local=sim.backend.transpose_step(state,seed,material,sim.dt)
                    ge.add_(local);report['reverse_steps']+=1
        finally:
            saved.clear()
        return ge,gw,None
