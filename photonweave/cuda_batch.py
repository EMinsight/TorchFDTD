"""Shared CUDA launches over independent, compatible native FDTD grids.

The second CUDA grid dimension selects a simulation. Pointer tables preserve
independent field, CPML and material allocations. No physics code is copied
from another solver, and the single-case Yee kernel generator is reused.
"""
from __future__ import annotations

import math
from types import SimpleNamespace

import numpy as np
import torch

from .cuda_kernels import FusedYeeCUDA, _compile
from .solver import index_at


class FusedBatchYeeCUDA:
    def __init__(self, grids):
        import cupy
        self.cp, self.grids = cupy, grids
        self.device=grids[0].E.device.index
        self.launches={}
        self.owners=[]
        with cupy.cuda.Device(self.device), self._stream():
            for forward in (False,True):
                templates=[FusedYeeCUDA._source(SimpleNamespace(grid=g),forward) for g in grids]
                source=templates[0][0]
                if any(s!=source for s,_ in templates):
                    raise ValueError('Tensor batch requires identical grid metrics, boundaries and timestep.')
                signature,body=source.split(') {\n',1)
                parameters=signature.split('(',1)[1].split(', ')
                declarations=[]
                for j,param in enumerate(parameters):
                    kind,name=param.rsplit(' ',1)
                    cast=kind.replace('__restrict__','').strip()
                    declarations.append(f'{param} = ({cast})pointers[blockIdx.y*{len(parameters)}+{j}];')
                source='extern "C" __global__ void yee_update(const long long* pointers) {\n'+'\n'.join(declarations)+'\n'+body
                table=torch.tensor([[v.data_ptr() for v in arrays] for _,arrays in templates],device=grids[0].E.device,dtype=torch.int64)
                self.owners.append(table)
                self.owners.extend(v for _,arrays in templates for v in arrays)
                kernel,module=_compile(source,self.device,cupy.cuda.Device(self.device).compute_capability)
                self.launches[forward]=(kernel,cupy.from_dlpack(table),module)

    def _stream(self):
        return self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.device).cuda_stream,device_id=self.device)

    def update(self,forward):
        kernel,table,_=self.launches[forward]
        with self.cp.cuda.Device(self.device),self._stream():
            kernel(((math.prod(self.grids[0].region.shape)+255)//256,len(self.grids)),(256,),(table,))

    def update_E(self):
        prepared=[[(state,*state.prepare(g.E)) for state in g.material_states] for g in self.grids]
        self.update(False)
        for g,states in zip(self.grids,prepared):
            for state,old,response in states:state.correct(g.E,old,response)

    def update_H(self):self.update(True)


class FusedBatchIO:
    """One source launch and one trace/counter launch for a whole cohort."""
    def __init__(self,grids,projects,traces,counter):
        import cupy
        self.cp=cupy;self.device=grids[0].E.device.index
        dtype=grids[0].E.dtype;device=grids[0].E.device
        self.owners=[counter,*traces]
        injections={'E':[],'H':[]};profiles={'E':[],'H':[]};monitors=[];occupied=set()
        for case,(g,p,trace) in enumerate(zip(grids,projects,traces)):
            r=p.region;nx,ny,nz=r.shape
            from .injection import source_terms
            for raw in p.sources:
                for field,loc,waveform,profile in source_terms(p,raw):
                    family=field[0];target=g.E if family=='E' else g.H
                    component='xyz'.index(field[1].lower())
                    coords=[np.atleast_1d(np.arange(n)[part]) for n,part in zip(r.shape,loc)]
                    ix,iy,iz=np.ix_(*coords)
                    indices=(((ix*ny+iy)*nz+iz)*3+component).reshape(-1)
                    profile=np.ones(len(indices)) if profile is None else np.broadcast_to(profile,tuple(len(c) for c in coords)).reshape(-1)
                    values=torch.as_tensor(waveform,device=device,dtype=dtype)
                    self.owners.append(values)
                    for index,weight in zip(indices,profile):
                        key=case,family,int(index)
                        if key in occupied:
                            raise ValueError('Tensor batch currently requires non-overlapping source supports per field component. Use BatchRunner for overlapping sources.')
                        occupied.add(key)
                        injections[family].append((target.data_ptr(),int(index),values.data_ptr()));profiles[family].append(float(weight))
            for j,m in enumerate([m for m in p.monitors if m.enabled and m.kind=='point']):
                x,y,z=index_at(m.center,r,m.component)
                field=g.E if m.component[0]=='E' else g.H
                monitors.append((field.data_ptr(),((x*ny+y)*nz+z)*3+'xyz'.index(m.component[1].lower()),
                                 trace.data_ptr(),j,trace.shape[1]))
        self.n_injections={family:len(tasks) for family,tasks in injections.items()};self.n_monitors=len(monitors)
        inject={family:torch.tensor(tasks,device=device,dtype=torch.int64) for family,tasks in injections.items()}
        profile={family:torch.tensor(values,device=device,dtype=dtype) for family,values in profiles.items()}
        monitor=torch.tensor(monitors,device=device,dtype=torch.int64)
        self.owners.extend((*inject.values(),*profile.values(),monitor))
        real='double' if dtype==torch.float64 else 'float'
        source=r'''
typedef REAL real;
extern "C" __global__ void batch_inject(const long long* tasks, const real* profiles,
                                        const long long* counter, int n) {
    int i=blockIdx.x*blockDim.x+threadIdx.x;
    if(i>=n) return;
    const long long* task=tasks+3*i;
    real* field=(real*)task[0];
    const real* values=(const real*)task[2];
    field[task[1]] += values[counter[0]]*profiles[i];
}
extern "C" __global__ void batch_record(const long long* tasks, long long* counter, int n) {
    long long t=counter[0];
    for(int i=threadIdx.x;i<n;i+=blockDim.x) {
        const long long* task=tasks+5*i;
        const real* field=(const real*)task[0];
        real* trace=(real*)task[2];
        trace[t*task[4]+task[3]]=field[task[1]];
    }
    __syncthreads();
    if(threadIdx.x==0) counter[0]=t+1;
}
'''.replace('REAL',real)
        with cupy.cuda.Device(self.device),self._stream():
            self.inject_kernel,self.module=_compile(source,self.device,cupy.cuda.Device(self.device).compute_capability,'batch_inject')
            self.record_kernel=self.module.get_function('batch_record')
            self.injection_views={family:tuple(cupy.from_dlpack(v) for v in (inject[family],profile[family])) for family in ('E','H')}
            self.monitor_view,self.counter_view=(cupy.from_dlpack(v) for v in (monitor,counter))

    def _stream(self):
        return self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.device).cuda_stream,device_id=self.device)

    def inject(self,family='E'):
        count=self.n_injections[family]
        if not count:return
        inject,profile=self.injection_views[family]
        with self.cp.cuda.Device(self.device),self._stream():
            self.inject_kernel(((count+255)//256,),(256,),(inject,profile,self.counter_view,np.int32(count)))

    def record(self):
        with self.cp.cuda.Device(self.device),self._stream():
            self.record_kernel((1,),(256,),(self.monitor_view,self.counter_view,np.int32(self.n_monitors)))
