"""Recorded-interface reconstruction with an untruncated CPML field transpose.

Internal helper for real scalar FP32, uniform periodic x/y and z CPML. The
caller admits memory, validates fixed sources/materials and owns terminal/trace
storage. This module never reconstructs exterior primal fields or CPML psi.
"""
from __future__ import annotations

import torch

from .cuda_bootstrap import prepare_cuda_kernels
from .cuda_kernels import _compile, _direct_cuda_view
from .cuda_adjoint import FusedAdjointCUDA


def _local_curl(field, a, b, forward):
    """Interior curl, reading only the required tangential z halo."""
    value = field[:, :, a:b+1]
    if forward:
        dx = torch.roll(value, -1, 0) - value
        dy = torch.roll(value, -1, 1) - value
        dz = field[:, :, a+1:b+2, :2] - value[..., :2]
    else:
        dx = value - torch.roll(value, 1, 0)
        dy = value - torch.roll(value, 1, 1)
        dz = value[..., :2] - field[:, :, a-1:b, :2]
    return torch.stack((dy[..., 2]-dz[..., 1], dz[..., 0]-dx[..., 2],
                        dx[..., 1]-dy[..., 0]), dim=-1)


class _InteriorCUDA:
 def __init__(self,s,a,b,gradient,eb):
  self.s=s;self.cp=prepare_cuda_kernels();self.a=a;self.b=b
  nx,ny,nz=s.region.shape;cn=s.grid.courant_number
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
   if phase=='g':body+=f'out[i]+=(-((float){cn:.17g})*((bar[3*i]*c0+bar[3*i+1]*c1)+bar[3*i+2]*c2))/(eps[i]*eps[i]);'
   else:
    scale=f'((float){cn:.17g})' if forward else f'(-((float){cn:.17g})/eps[i])'
    body+=''.join(f'out[3*i+{c}]+={scale}*c{c};' for c in range(3))
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


class InteriorReconstruction:
    """One backward execution's primal reconstruction and full CPML adjoint.

    ``step(n, trace)`` consumes shape (2, Nx, Ny, 2), with post-E tangential
    upper halo in trace[0] and pre-H tangential lower halo in trace[1]. It
    restores E/H at step n on inclusive [a,b] and adds its material VJP only
    there. The caller initializes interior E/H from an owned terminal pair,
    passes a zero gradient, and applies its fixed-material mask externally.

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
        for tensor, expected in ((epsilon, shape), (gradient, shape),
                                 (signal_bar, (system.region.steps, len(system.monitors)))):
            if (tensor.dtype != torch.float32 or tensor.device != system.device
                    or tuple(tensor.shape) != expected or tensor.layout != torch.strided
                    or tensor.is_conj() or tensor.is_neg()):
                raise ValueError('Reconstruction requires resolved scalar FP32 tensors on one device.')
        if not epsilon.is_contiguous() or not gradient.is_contiguous():
            raise ValueError('Reconstruction epsilon and gradient must be contiguous.')
        if (system.grid.E.dtype != torch.float32 or system.grid.H.dtype != torch.float32
                or system.grid.metric or set(system.grid.wrap) != {0, 1}
                or any(value != 1 for value in system.grid.wrap.values())):
            raise ValueError('Reconstruction supports uniform real periodic x/y with z CPML only.')
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
        self.gradient, self.signal_bar = gradient, signal_bar
        self._next_step = system.region.steps-1
        self._fused = self._inverse = None
        if epsilon.is_cuda:
            prepare_cuda_kernels()
            self._fused = FusedAdjointCUDA(system, gradient, signal_bar,
                                           direct_views=True, material_gradient=False)
            self._inverse = _InteriorCUDA(system, a, b, gradient, self._fused.e_bar)
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
    def step(self, n, trace):
        if type(n) is not int or n < 0 or n != self._next_step:
            raise ValueError('Reconstruction steps must be consumed once in descending order.')
        expected = (2, *self.system.region.shape[:2], 2)
        if (not isinstance(trace, torch.Tensor) or trace.dtype != torch.float32
                or trace.device != self.system.device or tuple(trace.shape) != expected
                or trace.layout != torch.strided or trace.is_conj() or trace.is_neg()):
            raise ValueError('Trace must be resolved FP32 (2,Nx,Ny,2) on the system device.')
        s, a, b = self.system, self.a, self.b
        e, h = s.grid.E, s.grid.H
        e[:, :, b+1, :2].copy_(trace[0])
        self._undo_sources('H', h, n)
        if self._inverse is not None:
            self._inverse.run('h')
        else:
            h[:, :, a:b+1].add_(s.grid.courant_number * _local_curl(e, a, b, True))
        h[:, :, a-1, :2].copy_(trace[1])
        self._undo_sources('E', e, n)
        if self._inverse is not None:
            self._inverse.run('e')
            self._fused.step(n)
            # E-transpose only changes h_bar, so e_bar is still the required
            # post-observation, post-H-transpose electric cotangent here.
            self._inverse.run('g')
        else:
            curl = _local_curl(h, a, b, False)
            eps = s.eps4[:, :, a:b+1]
            e[:, :, a:b+1].sub_(s.grid.courant_number / eps * curl)
            for target, (positions, indices) in zip((self._e_bar, self._h_bar), s.observation_maps):
                if indices.numel():
                    target.reshape(-1).index_add_(0, indices, self.signal_bar[n].index_select(0, positions))
            part, self._psi_bars = s.curl_transpose(
                -s.grid.courant_number * self._h_bar, self._psi_bars, True)
            self._e_bar.add_(part)
            self.gradient[:, :, a:b+1].add_(
                (-s.grid.courant_number * self._e_bar[:, :, a:b+1] * curl / eps.square()).sum(-1))
            part, self._psi_bars = s.curl_transpose(
                s.grid.courant_number / s.eps4 * self._e_bar, self._psi_bars, False)
            self._h_bar.add_(part)
        self._next_step -= 1
