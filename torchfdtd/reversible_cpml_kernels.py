"""Recorded-interface reconstruction with an untruncated CPML field transpose.

Internal helper for FP32 scalar/diagonal material, real or complex64 fields,
uniform periodic/Bloch x/y and z CPML. The
caller admits memory, validates fixed sources/materials and owns terminal/trace
storage. This module never reconstructs exterior primal fields or CPML psi.
"""
from __future__ import annotations

import torch

from .cuda_bootstrap import prepare_cuda_kernels
from .cuda_kernels import _compile, _direct_cuda_view
from .cuda_adjoint import FusedAdjointCUDA
from .cuda_complex_adjoint import FusedComplexAdjointCUDA, complex_definition


def _local_curl(field, a, b, forward, wrap):
    """Interior curl with positive/reciprocal Bloch factors at transverse seams."""
    value = field[:, :, a:b+1]
    differences = []
    for axis in (0, 1):
        if value.shape[axis] == 1:
            differences.append(torch.zeros_like(value))
            continue
        phase = wrap[axis]
        shifted = torch.roll(value, -1 if forward else 1, axis)
        if phase != 1:
            seam = [slice(None)] * 4
            seam[axis] = -1 if forward else 0
            shifted[tuple(seam)] *= phase if forward else 1 / phase
        differences.append(shifted-value if forward else value-shifted)
    dx, dy = differences
    dz = (field[:, :, a+1:b+2, :2] - value[..., :2] if forward
          else value[..., :2] - field[:, :, a-1:b, :2])
    return torch.stack((dy[..., 2]-dz[..., 1], dz[..., 0]-dx[..., 2],
                        dx[..., 1]-dy[..., 0]), dim=-1)


class _InteriorCUDA:
 def __init__(self,s,a,b,gradient,eb):
  self.s=s;self.cp=prepare_cuda_kernels();self.a=a;self.b=b
  nx,ny,nz=s.region.shape;cn=s.grid.courant_number
  diagonal=s.epsilon.ndim==4
  # Each thread owns one interior cell. Only x/y wrap, no exterior target write.
  common=f'''const long long q=(long long)blockIdx.x*blockDim.x+threadIdx.x;
 const long long depth={b-a+1};if(q>={nx*ny*(b-a+1)})return;
 const long long z=q%depth+{a},y=(q/depth)%{ny},x=q/(depth*{ny});
 const long long i=(x*{ny}+y)*{nz}+z;
 const long long xp=(((x+1)%{nx})*{ny}+y)*{nz}+z;
 const long long xm=(((x+{nx}-1)%{nx})*{ny}+y)*{nz}+z;
 const long long yp=(x*{ny}+(y+1)%{ny})*{nz}+z;
 const long long ym=(x*{ny}+(y+{ny}-1)%{ny})*{nz}+z;
 '''
  self.kernels={};self.count=nx*ny*(b-a+1)
  for phase in ('h','e','g'):
   forward=phase=='h'
   diffs={}
   for axis,plus,minus in [('x','xp','xm'),('y','yp','ym'),('z','i+1','i-1')]:
    for c in range(3):
     diffs[axis,c]=f'(f[3*({plus})+{c}]-f[3*i+{c}])' if forward else f'(f[3*i+{c}]-f[3*({minus})+{c}])'
   curls=[diffs['y',2]+'-'+diffs['z',1],diffs['z',0]+'-'+diffs['x',2],diffs['x',1]+'-'+diffs['y',0]]
   body=common+'\n'+''.join(f'const float c{c}={v};\n' for c,v in enumerate(curls))
   if phase=='g':
    if diagonal:
     body+=''.join(f'out[3*i+{c}]+=(-((float){cn:.17g})*bar[3*i+{c}]*c{c})/(eps[3*i+{c}]*eps[3*i+{c}]);' for c in range(3))
    else:body+=f'out[i]+=(-((float){cn:.17g})*((bar[3*i]*c0+bar[3*i+1]*c1)+bar[3*i+2]*c2))/(eps[i]*eps[i]);'
   else:
    for c in range(3):
     ep=f'eps[3*i+{c}]' if diagonal else 'eps[i]'
     scale=f'((float){cn:.17g})' if forward else f'(-((float){cn:.17g})/{ep})'
     body+=f'out[3*i+{c}]+={scale}*c{c};'
   source='extern "C" __global__ void interior(const float* f,float* out,const float* eps,const float* bar){'+body+'}'
   with self.cp.cuda.Device(s.device.index):
    fn,module=_compile(source,s.device.index,self.cp.cuda.Device(s.device.index).compute_capability,'interior')
    tensors=(s.grid.E,s.grid.H,s.epsilon,eb) if phase=='h' else ((s.grid.H,s.grid.E,s.epsilon,eb) if phase=='e' else (s.grid.H,gradient,s.epsilon,eb))
    arrays=tuple(_direct_cuda_view(self.cp,t) for t in tensors)
   self.kernels[phase]=(fn,arrays,module)
 def run(self,phase):
  fn,arrays,_=self.kernels[phase]
  with self.cp.cuda.Device(self.s.device.index),self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.s.device).cuda_stream,device_id=self.s.device.index):
   fn(((self.count+127)//128,),(128,),arrays)


class _ComplexInteriorCUDA:
    def __init__(self,s,a,b,gradient,bar):
        self.s=s;self.cp=prepare_cuda_kernels();self.launches={}
        nx,ny,nz=s.region.shape;depth=b-a+1;self.count=nx*ny*depth;cn=s.grid.courant_number
        diagonal=s.epsilon.ndim==4
        def eps(c):return f'eps[3*i+{c}]' if diagonal else 'eps[i]'
        common=f'''const long long q=(long long)blockIdx.x*blockDim.x+threadIdx.x;
 if(q>={self.count})return;
 const long long z=q%{depth}+{a}, y=(q/{depth})%{ny}, x=q/({depth}LL*{ny});
 const long long i=(x*{ny}+y)*{nz}+z;
 const long long xp=(((x+1)%{nx})*{ny}+y)*{nz}+z, xm=(((x+{nx}-1)%{nx})*{ny}+y)*{nz}+z;
 const long long yp=(x*{ny}+(y+1)%{ny})*{nz}+z, ym=(x*{ny}+(y+{ny}-1)%{ny})*{nz}+z;
 '''
        for name in ('h','e','g'):
            forward=name=='h';diff={}
            for axis,size in (('x',nx),('y',ny)):
                if size==1:
                    for c in range(3):diff[axis,c]='C()'
                    continue
                phase=complex(s.grid.wrap['xy'.index(axis)])
                if not forward:phase=1/phase
                factor=f'C((float)({phase.real:.17g}),(float)({phase.imag:.17g}))'
                pos=axis+('p' if forward else 'm');seam=f'{axis}=={size-1 if forward else 0}'
                for c in range(3):
                    neighbor=f'({seam}?f[3*{pos}+{c}]*{factor}:f[3*{pos}+{c}])'
                    diff[axis,c]=f'({neighbor}-f[3*i+{c}])' if forward else f'(f[3*i+{c}]-{neighbor})'
            for c in (0,1):diff['z',c]=f'(f[3*(i+1)+{c}]-f[3*i+{c}])' if forward else f'(f[3*i+{c}]-f[3*(i-1)+{c}])'
            curl=[diff['y',2]+'-'+diff['z',1],diff['z',0]+'-'+diff['x',2],diff['x',1]+'-'+diff['y',0]]
            body=common+''.join(f'const C c{c}={value};\n' for c,value in enumerate(curl))
            if name=='g':
                terms=[f'(-((float){cn:.17g})*(bar[3*i+{c}].r*c{c}.r+bar[3*i+{c}].j*c{c}.j))/({eps(c)}*{eps(c)})' for c in range(3)]
                body+=(''.join(f'out[3*i+{c}]+={terms[c]};' for c in range(3)) if diagonal else f'out[i]+=({terms[0]}+{terms[1]})+{terms[2]};')
            else:
                body+=''.join(f'out[3*i+{c}]+=c{c}*'+(f'((float){cn:.17g});' if forward else f'(-((float){cn:.17g})/{eps(c)});') for c in range(3))
            source=complex_definition('float')+'extern "C" __global__ void interior(const C* f,'+('float' if name=='g' else 'C')+'* out,const float* eps,const C* bar){'+body+'}'
            tensors=(s.grid.E,s.grid.H,s.epsilon,bar) if name=='h' else ((s.grid.H,s.grid.E,s.epsilon,bar) if name=='e' else (s.grid.H,gradient,s.epsilon,bar))
            with self.cp.cuda.Device(s.device.index):
                fn,module=_compile(source,s.device.index,self.cp.cuda.Device(s.device.index).compute_capability,'interior')
                views=tuple(_direct_cuda_view(self.cp,t) for t in tensors)
            self.launches[name]=(fn,views,module)
    def run(self,name):
        fn,views,_=self.launches[name]
        with self.cp.cuda.Device(self.s.device.index),self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.s.device).cuda_stream,device_id=self.s.device.index):
            fn(((self.count+127)//128,),(128,),views)


class InteriorReconstruction:
    """One backward execution's primal reconstruction and full CPML adjoint.

    ``step(n, trace)`` consumes shape (2, Nx, Ny, 2), with post-E tangential
    upper halo in trace[0] and pre-H tangential lower halo in trace[1]. It
    restores E/H at step n on inclusive [a,b] and adds its material VJP only
    there. The caller initializes interior E/H from an owned terminal pair,
    passes a zero gradient, and applies its fixed-material mask externally.

    ``signal_bar`` is a stable contiguous buffer with B rows, 1 <= B <= steps.
    Noncontiguous inputs are normalized once. Copy online seed blocks into this
    member (or the original contiguous input). ``observation_index`` chooses a
    row independently of physical n. Omitting it requires a full-time buffer.
    Never replace the buffer storage while CUDA pointer views are live.

    ``e_bar``, ``h_bar`` and ``psi_bars`` expose the current full-domain
    adjoints. A new helper is required for each retained backward. No member
    is installed on system, so ownership does not form a cycle.
    """

    def __init__(self, system, a, b, gradient, signal_bar):
        shape = tuple(system.region.shape)
        if (type(a) is not int or type(b) is not int
                or not 0 < a <= b < shape[2]-1):
            raise ValueError('Reconstruction needs an interior inclusive z interval with halos.')
        epsilon = system.epsilon
        material_shape = tuple(epsilon.shape)
        if material_shape not in (shape, (*shape, 3)):
            raise ValueError('Reconstruction epsilon must be scalar 3D or diagonal NxNyNz3.')
        field_dtype = system.field_dtype
        for tensor in (epsilon, gradient):
            if (tensor.dtype != torch.float32 or tensor.device != system.device
                    or tuple(tensor.shape) != material_shape or tensor.layout != torch.strided
                    or tensor.is_conj() or tensor.is_neg() or not tensor.is_contiguous()):
                raise ValueError('Reconstruction material and gradient require resolved contiguous FP32 arrays.')
        if (not isinstance(signal_bar, torch.Tensor) or signal_bar.ndim != 2
                or not 1 <= signal_bar.shape[0] <= system.region.steps
                or signal_bar.shape[1] != len(system.monitors)
                or signal_bar.dtype != field_dtype or signal_bar.device != system.device
                or signal_bar.layout != torch.strided or signal_bar.is_conj() or signal_bar.is_neg()):
            raise ValueError('Seed buffer must match field dtype/device and have shape (B,M), 1 <= B <= steps.')
        if (field_dtype not in (torch.float32, torch.complex64)
                or system.grid.E.dtype != field_dtype or system.grid.H.dtype != field_dtype
                or system.grid.metric or set(system.grid.wrap) != {0, 1}
                or (field_dtype == torch.float32 and any(value != 1 for value in system.grid.wrap.values()))):
            raise ValueError('Reconstruction supports uniform real/complex64 periodic or Bloch x/y with z CPML only.')
        if any(face.kind != 'pml' for face in system.region.boundaries.pair(2)):
            raise ValueError('Reconstruction requires CPML at both z faces.')
        # Protect one CPML-free layer beyond either reconstruction cut using
        # actual staggered target rows, not nominal face layer counts.
        for (forward, axis, _), indices in system.keys.items():
            for index in indices:
                if axis != 2:
                    raise ValueError('Transverse CPML reconstruction is unsupported.')
                cut = system.segments[index]['slice'][2]
                offset = 0 if forward else 1
                if cut.start + offset <= b+1 and cut.stop + offset > a-1:
                    raise ValueError('Reconstruction interval needs a CPML-free collar at both cuts.')
        self.system, self.a, self.b = system, a, b
        self.gradient, self.signal_bar = gradient, signal_bar.contiguous()
        self._next_step = system.region.steps-1
        self._fused = self._inverse = None
        if epsilon.is_cuda:
            prepare_cuda_kernels()
            adjoint_class = FusedComplexAdjointCUDA if field_dtype == torch.complex64 else FusedAdjointCUDA
            inverse_class = _ComplexInteriorCUDA if field_dtype == torch.complex64 else _InteriorCUDA
            self._fused = adjoint_class(system, gradient, self.signal_bar,
                                        direct_views=True, material_gradient=False)
            self._inverse = inverse_class(system, a, b, gradient, self._fused.e_bar)
        else:
            self._e_bar = torch.zeros_like(system.grid.E)
            self._h_bar = torch.zeros_like(system.grid.H)
            self._psi_bars = tuple(torch.zeros_like(seg['psi']) for seg in system.segments)

    @property
    def e_bar(self):
        return self._fused.e_bar if self._fused is not None else self._e_bar

    @property
    def h_bar(self):
        return self._fused.h_bar if self._fused is not None else self._h_bar

    @property
    def psi_bars(self):
        return (self._fused.psi_bars[self._fused.phase]
                if self._fused is not None else self._psi_bars)

    def _undo_sources(self, family, field, n):
        for loc, component, wave, profile in reversed(self.system.sources[family]):
            field[loc + (component,)] -= wave[n] if profile is None else wave[n]*profile

    @torch.no_grad()
    def step(self, n, trace, *, observation_index=None):
        if type(n) is not int or n < 0 or n != self._next_step:
            raise ValueError('Reconstruction steps must be consumed once in descending order.')
        if observation_index is None:
            if self.signal_bar.shape[0] != self.system.region.steps:
                raise ValueError('A block seed buffer requires explicit observation_index.')
            row = n
        else:
            if type(observation_index) is not int or not 0 <= observation_index < self.signal_bar.shape[0]:
                raise ValueError('observation_index must select a valid seed buffer row.')
            row = observation_index
        expected = (2, *self.system.region.shape[:2], 2)
        if (not isinstance(trace, torch.Tensor) or trace.dtype != self.system.field_dtype
                or trace.device != self.system.device or tuple(trace.shape) != expected
                or trace.layout != torch.strided or trace.is_conj() or trace.is_neg()):
            raise ValueError('Trace must be resolved (2,Nx,Ny,2) with the system field dtype/device.')
        s, a, b = self.system, self.a, self.b
        e, h = s.grid.E, s.grid.H
        e[:, :, b+1, :2].copy_(trace[0])
        self._undo_sources('H', h, n)
        if self._inverse is not None:
            self._inverse.run('h')
        else:
            h[:, :, a:b+1].add_(s.grid.courant_number * _local_curl(e, a, b, True, s.grid.wrap))
        h[:, :, a-1, :2].copy_(trace[1])
        self._undo_sources('E', e, n)
        if self._inverse is not None:
            self._inverse.run('e')
            self._fused.step(n, observation_index=row)
            # E-transpose only changes h_bar, so e_bar is still the required
            # post-observation, post-H-transpose electric cotangent here.
            self._inverse.run('g')
        else:
            curl = _local_curl(h, a, b, False, s.grid.wrap)
            eps = s.eps4[:, :, a:b+1]
            e[:, :, a:b+1].sub_(s.grid.courant_number / eps * curl)
            for target, (positions, indices) in zip((self._e_bar, self._h_bar), s.observation_maps):
                if indices.numel():
                    target.reshape(-1).index_add_(0, indices, self.signal_bar[row].index_select(0, positions))
            part, self._psi_bars = s.curl_transpose(
                -s.grid.courant_number * self._h_bar, self._psi_bars, True)
            self._e_bar.add_(part)
            contribution = -s.grid.courant_number * (
                self._e_bar[:, :, a:b+1].conj() * curl).real / eps.square()
            self.gradient[:, :, a:b+1].add_(
                contribution.sum(-1) if s.epsilon.ndim == 3 else contribution)
            part, self._psi_bars = s.curl_transpose(
                s.grid.courant_number / s.eps4 * self._e_bar, self._psi_bars, False)
            self._h_bar.add_(part)
        self._next_step -= 1
