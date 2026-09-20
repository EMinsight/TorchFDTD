"""Measure CPU tensor allocations during lossless tile packing, not FDTD speed."""
import argparse
import hashlib
import json
from pathlib import Path

import torch

from torchfdtd.tensor_packet import TensorLayout, pack_tensors


def allocated_during(call):
    with torch.profiler.profile(activities=[torch.profiler.ProfilerActivity.CPU],
                                profile_memory=True) as profiler:
        result = call()
    # Sum individual positive self events. Aggregating net values first would
    # hide allocations paired with deallocations. This is not peak RSS.
    allocated = sum(max(0, event.self_cpu_memory_usage) for event in profiler.events())
    return result, allocated


def measure(shape, precision):
    real = getattr(torch, precision)
    field = torch.complex128 if real == torch.float64 else torch.complex64
    epsilon = torch.full(shape, 1.8, dtype=real)
    records = []
    for initial in (True, False):
        fields = tuple(torch.zeros((), dtype=field).expand(*shape, 3) if initial else
                       torch.full((*shape, 3), complex(index+1, -.25), dtype=field)
                       for index in range(2))
        # A strided CPML-like view exercises direct copies into typed packet
        # views without separately materializing the source's contiguous form.
        auxiliary = fields[0][:, ::2, :, 0]
        values = (epsilon, *fields, auxiliary)
        layout = TensorLayout.from_tensors(values)
        destination = torch.empty(layout.count, dtype=layout.dtype)
        # Initialize profiler machinery before collecting either measurement.
        allocated_during(lambda: pack_tensors((torch.ones(1),)))
        (reference, expected_layout), baseline = allocated_during(lambda: pack_tensors(values))
        (actual, actual_layout), reused = allocated_during(lambda: pack_tensors(values, out=destination))
        assert actual_layout == expected_layout == layout
        assert torch.equal(actual.view(torch.uint8), reference.view(torch.uint8))
        records.append(dict(state='scalar_backed_initial' if initial else 'evolved',
                            packet_bytes=destination.numel()*destination.element_size(),
                            allocating_pack_positive_cpu_tensor_bytes=baseline,
                            reused_pack_positive_cpu_tensor_bytes=reused,
                            bitwise_equal=True))
    return records


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--shape', nargs=3, type=int, default=(64,96,64))
    parser.add_argument('--precision', choices=('float32','float64'), default='float64')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if any(n < 1 for n in args.shape):parser.error('Shape dimensions must be positive.')
    torch.set_num_threads(4)
    root = Path(__file__).resolve().parents[1]
    paths = ('torchfdtd/tensor_packet.py', 'torchfdtd/tile_workspace.py',
             'torchfdtd/spacetime.py', 'benchmarks/packet_staging.py')
    report = dict(torch_version=torch.__version__, shape=args.shape, precision=args.precision,
                  cpu_threads=torch.get_num_threads(), measurements=measure(tuple(args.shape),args.precision),
                  source_sha256={path:hashlib.sha256((root/path).read_bytes()).hexdigest() for path in paths},
                  scope='CPU packet construction only. Reused destination allocated before measurement. '
                        'Positive tensor allocation events, not peak process RAM or CUDA usage. '
                        'No PCIe, file I/O, FDTD throughput or physical-VRAM-overflow claim.')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps(report, indent=2))


if __name__ == '__main__':main()
