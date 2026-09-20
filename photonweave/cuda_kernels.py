"""Optional, independently implemented fused Yee/CPML CUDA updates.

One kernel updates E and another updates H, with source injection between them.
The stream boundary supplies the necessary global ordering. CPML memory lives
only in boundary slabs. No full-volume derivative or curl temporary is created.
Torch owns every array. CuPy supplies NVRTC compilation and zero-copy launches.
This forward-only implementation deliberately does not advertise autograd.
"""
from __future__ import annotations

import math
import weakref
from functools import lru_cache

import torch

from .boundaries import CURL_TERMS


def _direct_cuda_view(cupy, tensor):
    """Internal contiguous view for kernels launched on the current Torch stream.

    Torch owns the allocation and records the consumer stream. CuPy only wraps
    its pointer and retains a detached tensor owner. This avoids a DLPack stream
    negotiation for every small coefficient view in a short-lived slab.
    """
    if not tensor.is_cuda or not tensor.is_contiguous() or tensor.dtype not in (torch.float32, torch.float64):
        raise ValueError('Direct CUDA views require contiguous CUDA FP32/FP64 tensors.')
    tensor.record_stream(torch.cuda.current_stream(tensor.device))
    memory = cupy.cuda.UnownedMemory(tensor.data_ptr(), tensor.numel()*tensor.element_size(),
                                    tensor.detach(), device_id=tensor.device.index)
    return cupy.ndarray(tensor.shape, dtype='float64' if tensor.dtype == torch.float64 else 'float32',
                        memptr=cupy.cuda.MemoryPointer(memory, 0))


@lru_cache(maxsize=64)
def _compile(source, device, capability, kernel_name='yee_update'):
    # CuPy RawKernel unconditionally adds -ftz=true. FDTD weak fields must
    # retain subnormals, so use the NVRTC API with explicit IEEE options.
    # Compilation stays entirely in memory and needs no include files.
    from cupy_backends.cuda.libs import nvrtc
    from cupy.cuda.function import Module
    program = nvrtc.createProgram(source, 'photonweave_yee.cu', (), ())
    try:
        options = ('--std=c++11', '--fmad=false', '--ftz=false',
                   '--gpu-architecture=compute_'+capability)
        try:
            nvrtc.compileProgram(program, options)
        except Exception as exc:
            raise RuntimeError('CUDA kernel compilation failed: '+nvrtc.getProgramLog(program)) from exc
        ptx = nvrtc.getPTX(program)
    finally:
        nvrtc.destroyProgram(program)
    module = Module()
    module.load(ptx)
    return module.get_function(kernel_name), module


class FusedYeeCUDA:
    """Specialize a real-valued grid while retaining its CPML and ADE states."""

    complex_fields = False

    def __init__(self, grid, *, direct_views=False, bindings_cache=None):
        if not grid.is_torch or not grid.E.is_cuda:
            raise ValueError('The fused CUDA kernel requires backend="cuda" and a CUDA GPU.')
        if grid.E.is_complex() and not self.complex_fields:
            raise ValueError('The fused CUDA kernel currently supports real fields. Select cuda_kernel="torch" for Bloch fields.')
        try:
            import cupy
        except ImportError as exc:
            raise RuntimeError('Install photonweave[cuda-kernels] to use the fused CUDA kernel.') from exc
        self.cp = cupy
        self._grid = weakref.ref(grid)
        self.device = grid.E.device.index
        self.launches = {}
        self.interface_update=None
        if getattr(grid,'subpixel',None) is not None:
            from .cuda_subpixel import SubpixelCUDA
            self.interface_update=SubpixelCUDA([grid])
        # Compile and create all views before CUDA graph capture. Keep ownership
        # in both the grid and DLPack views for the complete graph lifetime.
        with cupy.cuda.Device(self.device), self._stream():
            for forward in (False, True):
                source, tensors = self._source(forward)
                kernel, module = _compile(source, self.device, cupy.cuda.Device(self.device).compute_capability)
                view = lambda t: _direct_cuda_view(cupy, t) if direct_views else cupy.from_dlpack(t.detach())
                arrays = bindings_cache.cuda_arguments(source, tensors, view) if bindings_cache is not None else tuple(view(t) for t in tensors)
                self.launches[forward] = kernel, arrays, module

    @property
    def grid(self):
        grid = self._grid()
        if grid is None:
            raise RuntimeError('The CUDA grid is no longer alive.')
        return grid

    def _stream(self):
        return self.cp.cuda.ExternalStream(torch.cuda.current_stream(self.device).cuda_stream, device_id=self.device)

    def _source(self, forward):
        g = self.grid
        shape = tuple(g.E.shape[:3])
        strides = (shape[1]*shape[2], shape[2], 1)
        real = 'double' if g.E.dtype == torch.float64 else 'float'
        tensors, parameters = [], []

        def argument(name, tensor, write=False):
            if not tensor.is_contiguous():
                raise ValueError('Fused CUDA arrays must be contiguous.')
            if tensor.dtype != g.E.dtype or tensor.device != g.E.device:
                raise ValueError('Fused CUDA arrays must have one real dtype and device.')
            tensors.append(tensor)
            parameters.append(f'{"" if write else "const "}{real}* __restrict__ {name}')
            return name

        argument('src', g.E if forward else g.H)
        argument('dst', g.H if forward else g.E, True)
        subpixel=not forward and getattr(g,'subpixel',None) is not None
        if subpixel:argument('curl_buffer',g.subpixel.curl_buffer,True)
        inverse = g.inverse_permeability if forward else g.inverse_permittivity
        argument('inverse', inverse)
        count = math.prod(shape)
        lines = [f'const int i = blockIdx.x * blockDim.x + threadIdx.x;',
                 f'if (i >= {count}) return;',
                 f'const int x = i / {strides[0]};',
                 f'const int y = (i / {strides[1]}) % {shape[1]};',
                 f'const int z = i % {shape[2]};',
                 f'{real} c0=0, c1=0, c2=0;']
        for term, (axis, comp, out, sign) in enumerate(CURL_TERMS):
            n, stride = shape[axis], strides[axis]
            if n == 1:
                continue
            coord = 'xyz'[axis]
            guard = f'{coord} < {n-1}' if forward else f'{coord} > 0'
            high = f'i+{stride}' if forward else 'i'
            low = 'i' if forward else f'i-{stride}'
            lines.extend(['{', f'{real} d=0;', f'if ({guard}) {{',
                          f'd = src[3*({high})+{comp}] - src[3*({low})+{comp}];'])
            metric = g.metric.get((forward, axis))
            if metric:
                name = argument(f'metric{term}', metric[0])
                lines.append(f'd *= {name}[{coord}{"" if forward else "-1"}];')
            active_start = 0 if forward else 1
            for si, seg in enumerate(g.cpml.get((forward, axis, comp), [])):
                lo = seg['slice'][axis].start + active_start
                hi = seg['slice'][axis].stop + active_start
                psi = argument(f'psi{term}_{si}', seg['psi'], True)
                b, c, inv_k = [argument(f'{key}{term}_{si}', seg[key]) for key in ('b', 'c', 'inv_k')]
                coords = ['x', 'y', 'z']
                coords[axis] = f'({coord}-{lo})'
                slab = list(shape)
                slab[axis] = hi-lo
                index = f'({coords[0]}*{slab[1]}+{coords[1]})*{slab[2]}+{coords[2]}'
                lines.extend([f'if ({coord} >= {lo} && {coord} < {hi}) {{',
                              f'const int p = {index};', f'const int q = {coord}-{lo};',
                              f'{real} memory = {psi}[p]*{b}[q] + {c}[q]*d;',
                              f'{psi}[p] = memory;', f'd = d*{inv_k}[q] + memory;', '}'])
            lines.append('}')
            if axis in g.wrap:
                if g.wrap[axis] != 1:
                    raise ValueError('Complex wrapping is not supported by the fused kernel.')
                first = f'i-{(n-1)*stride}' if forward else 'i'
                last = 'i' if forward else f'i+{(n-1)*stride}'
                lines.extend(['else {', f'd = src[3*({first})+{comp}] - src[3*({last})+{comp}];'])
                if metric:
                    lines.append(f'd *= ({real})({metric[1]:.17g});')
                lines.append('}')
            lines.extend([f'c{out} += {"-" if sign < 0 else ""}d;', '}'])
        for comp in range(3):
            if subpixel:lines.append(f'curl_buffer[3*i+{comp}]=c{comp};')
            index = '0' if inverse.numel() == 1 else str(comp) if inverse.numel() == 3 else f'3*i+{comp}'
            lines.append(f'dst[3*i+{comp}] {"-=" if forward else "+="} '
                         f'(({real})({g.courant_number:.17g}) * inverse[{index}]) * c{comp};')
        return ('extern "C" __global__ void yee_update(' + ', '.join(parameters) + ') {\n' + '\n'.join(lines) + '\n}'), tensors

    def update(self, forward):
        kernel, arrays, _ = self.launches[forward]
        with self.cp.cuda.Device(self.device), self._stream():
            kernel(((math.prod(self.grid.E.shape[:3])+255)//256,), (256,), arrays)

    def update_E(self):
        g = self.grid
        prepared = [state.prepare(g.E) for state in g.material_states]
        self.update(False)
        if self.interface_update is not None:self.interface_update.update()
        for state, (old, response) in zip(g.material_states, prepared):
            state.correct(g.E, old, response)

    def update_H(self):
        self.update(True)


def configure_cuda_kernel(grid, choice):
    if choice == 'torch':
        return
    implementation = FusedYeeCUDA(grid)
    grid.update_E = implementation.update_E
    grid.update_H = implementation.update_H
