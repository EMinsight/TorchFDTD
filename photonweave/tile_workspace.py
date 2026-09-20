"""Bounded slab allocations and cached CUDA argument views.

Every geometry specialization aliases the same high-water buffers. Cache growth
cannot retain a separate field bank per slab. Reallocation invalidates bindings
before replacing an allocation. The tile driver waits for the previous slot's
device work and host consumer before handing it to the next tile.
"""
from collections import OrderedDict
from .tensor_packet import pack_tensors

import torch


class HostTransfer:
    def __init__(self, values, event=None, owner=None):
        self.values, self.event, self.owner = values, event, owner

    def wait(self):
        if self.event is not None:self.event.synchronize()
        self.owner = None
        return self.values


class TileWorkspace:
    def __init__(self, device, *, cache_entries=32, asynchronous=False):
        self.device = torch.device(device)
        self.buffers = {}
        self.bindings = OrderedDict()
        self.cache_entries = cache_entries
        self.allocations = 0
        self.binding_hits = 0
        self.binding_misses = 0
        self.asynchronous = asynchronous
        self.pinned = {}
        self.h2d_bytes = self.d2h_bytes = 0
        self.events = []
        if asynchronous:
            if self.device.type != 'cuda':raise ValueError('Asynchronous tiles require CUDA.')
            self.h2d = torch.cuda.Stream(device=self.device)
            self.d2h = torch.cuda.Stream(device=self.device)

    def pinned_array(self, name, value):
        current = self.pinned.get(name)
        if current is None or current.numel() < value.numel() or current.dtype != value.dtype:
            current = torch.empty(value.numel(), dtype=value.dtype, pin_memory=True)
            self.pinned[name] = current
        return current[:value.numel()].view(value.shape)

    def array(self, name, shape, dtype):
        count = 1
        for length in shape:count *= length
        value = self.buffers.get(name)
        if value is None or value.numel() < count or value.dtype != dtype:
            # Cached views own allocations. Invalidate them before replacement.
            self.bindings.clear()
            value = torch.empty(count, dtype=dtype, device=self.device)
            self.buffers[name] = value
            self.allocations += 1
        if value.is_cuda:value.record_stream(torch.cuda.current_stream(self.device))
        return value[:count].view(shape)

    def zeros(self, name, like):
        return self.array(name, like.shape, like.dtype).zero_()

    def copy(self, name, value):
        target = self.array(name, value.shape, value.dtype)
        if self.asynchronous and value.device.type == 'cpu':
            pinned = self.pinned_array('input:'+name, value)
            pinned.copy_(value)
            with torch.cuda.stream(self.h2d):
                target.copy_(pinned, non_blocking=True)
                target.record_stream(self.h2d)
                ready = torch.cuda.Event()
                ready.record(self.h2d)
            torch.cuda.current_stream(self.device).wait_event(ready)
            self.events.append(ready)
            self.h2d_bytes += value.numel()*value.element_size()
            return target
        target.copy_(value)
        if target.is_cuda and value.device.type == 'cpu':
            self.h2d_bytes += value.numel()*value.element_size()
        return target

    def to_host(self, tensors):
        packed,layout = pack_tensors(tensors)
        event = None
        if self.asynchronous:
            host = self.pinned_array('output', packed)
            ready = torch.cuda.Event()
            ready.record(torch.cuda.current_stream(self.device))
            with torch.cuda.stream(self.d2h):
                self.d2h.wait_event(ready)
                host.copy_(packed, non_blocking=True)
                packed.record_stream(self.d2h)
                event = torch.cuda.Event()
                event.record(self.d2h)
            self.events.append(event)
        else:host = packed.cpu()
        if packed.is_cuda:self.d2h_bytes += packed.numel()*packed.element_size()
        values = layout.unpack(host)
        return HostTransfer(values, event, packed if self.asynchronous else None)

    def drain(self):
        for event in self.events:event.synchronize()
        self.events.clear()

    def cuda_arguments(self, source, tensors, view):
        key = (source, tuple((t.data_ptr(), tuple(t.shape), t.dtype, t.device.index) for t in tensors))
        if key in self.bindings:
            self.binding_hits += 1
            self.bindings.move_to_end(key)
            return self.bindings[key]
        self.binding_misses += 1
        arrays = tuple(view(t) for t in tensors)
        self.bindings[key] = arrays
        if len(self.bindings) > self.cache_entries:self.bindings.popitem(last=False)
        return arrays

    @property
    def allocated_bytes(self):
        return sum(t.numel()*t.element_size() for t in self.buffers.values())

    @property
    def pinned_bytes(self):
        return sum(t.numel()*t.element_size() for t in self.pinned.values())
