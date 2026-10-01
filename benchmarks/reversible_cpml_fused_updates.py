"""Interleaved public-API benchmark of optional recorded CPML CUDA kernels.

Run under the workstation GPU lock. Large 16/24 um cores require more VRAM
than a 12 GiB card; admission fails before simulation allocations. All modes
use the same pillar interval, fixed source, monitor and material parameterization.
"""
from __future__ import annotations

import argparse
from dataclasses import replace
import gc
import hashlib
import json
import math
from pathlib import Path
import statistics
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
import numpy as np
import torch
from torchfdtd import (Project, Region, Source, FieldMonitor, SpectrumSettings,
    Boundaries, BoundaryFace, ReversibleCPMLPlaneSimulation, ReversibleCPMLOptions)

PITCH, H, MESH, PMLC, Z0, QPC = .29, .7, .02, 12, .35, 2
ZM, N_SIN, N_SIO2 = H+.5, 2., 1.444
LAM_NM = [420, 450, 470, 510, 540, 570, 600, 635, 670]

def build_tile(core=16.0, over=1.2, steps=1200, trace="device", diagonal=True, gpu_gib=10.0, device="cuda", pol="Ex", launch_modes=None):
    """Public-API tile solver for a core x core um tile with `over` um margins (monitor: whole 0.29 um cells, centred)."""
    L = core + 2 * over
    spec = SpectrumSettings(sampling="custom", custom_frequencies_hz=sorted(299792458.0 / (l * 1e-9) for l in LAM_NM), apodization="none")
    ncell = max(1, int(math.floor(core / PITCH + 1e-9)))
    p = Project(name="Fused CPML tile benchmark",
        region=Region(dimension="3d", size=(L, L, 2.5), mesh=MESH, mesh_type="uniform", mesh_auto_refine=False,
                      boundaries=Boundaries(x_min=BoundaryFace(kind="periodic"), x_max=BoundaryFace(kind="periodic"),
                                            y_min=BoundaryFace(kind="periodic"), y_max=BoundaryFace(kind="periodic")),
                      steps=steps, pml_cells=PMLC, backend="cuda" if device == "cuda" else "cpu", precision="float32",
                      material_sampling="yee", interface_method="staircase", memory_mode="budgeted", snapshot_interval=10000),
        structures=[], sources=[Source(name="plane", kind="plane", injection="soft", normal="z", direction="+", center=(0, 0, -0.55 - Z0),
                                       size=(L, L, 0), component=pol, pulse="broadband", time_definition="wavelength",
                                       wavelength_start=0.40, wavelength_stop=0.70)],
        monitors=[FieldMonitor(id="xy", name="exit", normal="z", center=(0, 0, ZM - Z0), size=(ncell * PITCH, ncell * PITCH, 0),
                               spectrum=spec, spatial_interpolation="specified", record_fields=["Ex", "Ey", "Ez"], record_poynting=[], record_flux=False)])
    p = Project.model_validate(p.model_dump())
    shape = tuple(p.region.shape); nodes = [np.asarray(v) for v in p.region.mesh_nodes]
    zc = 0.5 * (nodes[2][:-1] + nodes[2][1:]) + Z0
    sub = torch.tensor(zc < 0.0); pil = torch.tensor((zc >= 0.0) & (zc < H))
    adj = ReversibleCPMLOptions(trace_storage=trace, trace_transfers="async" if trace == "cpu" and device == "cuda" else "sync", trace_chunk_steps=32,
                                resident_budget_bytes=int(gpu_gib * 1024 ** 3), host_budget_bytes=int(110 * 1024 ** 3))
    model = ReversibleCPMLPlaneSimulation(p, adj, quadrature_counts={"xy": (ncell * QPC, ncell * QPC)})
    freq = torch.tensor(sorted(299792458.0 / (l * 1e-9) for l in LAM_NM), dtype=torch.float32)
    comps = 3 if diagonal else 1
    if launch_modes is not None:
        indices = torch.nonzero(pil).flatten().tolist()
        for mode in launch_modes:
            options = replace(adj, interior_z=(indices[0], indices[-1]),
                diagnostic_chunk_elements=1 << 24, **MODES[mode])
            planner = ReversibleCPMLPlaneSimulation(p, options,
                quadrature_counts={"xy": (ncell * QPC, ncell * QPC)})
            planner.plan(freq, device=device, material_components=comps)
    sub, pil = sub.to(device), pil.to(device)
    def eps_of(q):                                                      # q: (nx, ny) scalar or (nx, ny, 3) diagonal fill in [0, 1]
        full = shape + ((3,) if diagonal else ())
        eps = torch.ones(full, device=device, dtype=torch.float32)
        s = sub.view(1, 1, -1, *((1,) if diagonal else ())); m = pil.view(1, 1, -1, *((1,) if diagonal else ()))
        eps = torch.where(s, torch.full_like(eps, N_SIO2 ** 2), eps)
        lay = (1.0 + q * (N_SIN ** 2 - 1.0))[:, :, None].expand(full)
        return torch.where(m, lay, eps).contiguous()
    eps_bg = eps_of(torch.zeros(shape[:2] + ((3,) if diagonal else ()), device=device)).detach()
    return dict(project=p, model=model, qc={"xy": (ncell * QPC, ncell * QPC)}, adj_options=adj, shape=shape, pil=pil, sub=sub, eps_of=eps_of, eps_bg=eps_bg, freq=freq, device=device,
                diagonal=diagonal, comps=comps, steps=steps, trace=trace, core=core, over=over, cells=math.prod(shape))


def design(tile, seed=0):
    """Binary pillar-like pattern on the 20 nm lattice (smoothed noise > 0); diagonal: three shifted copies."""
    g = torch.Generator().manual_seed(seed)
    nx, ny = tile["shape"][:2]
    n = torch.randn((1, 1, nx + 8, ny + 8), generator=g)
    k = torch.ones((1, 1, 7, 7)) / 49.0
    s = torch.nn.functional.conv2d(n, k)[0, 0, :nx, :ny]
    q = (s > 0).float()
    if tile["diagonal"]:
        q = torch.stack([q, torch.roll(q, 1, 0), torch.roll(q, 1, 1)], -1)
    return q.to(tile["device"])


MODES = {
    'split': {},
    'auto': dict(block_size='auto'),
    'cells2': dict(cells_per_thread=2),
    'cells4': dict(cells_per_thread=4),
    'cells_auto': dict(cells_per_thread='auto', block_size='auto'),
    'fused_eh': dict(forward_kernel='fused_eh'),
    'fused_eh_auto': dict(forward_kernel='fused_eh', block_size='auto'),
    'one_pass': dict(adjoint_kernel='one_pass'),
    'all': dict(forward_kernel='fused_eh', adjoint_kernel='one_pass', block_size='auto'),
}


def run(tile, design, options):
    model = ReversibleCPMLPlaneSimulation(tile['project'], options, quadrature_counts=tile['qc'])
    leaf = design.detach().clone().requires_grad_()
    frequency = tile['freq'].to(tile['device'])
    torch.cuda.synchronize()
    before = torch.cuda.memory_allocated()
    torch.cuda.reset_peak_memory_stats()
    started = time.perf_counter()
    result = model(tile['eps_of'](leaf), frequency, fixed_epsilon=tile['eps_bg'], block_size=32)['xy']
    fields = result.fields
    # Normalize the spectrum's dt factor before constructing a deterministic
    # mixed real/imaginary objective, to avoid tiny FP32 gradient magnitudes.
    scaled = fields / tile['project'].region.time_step
    objective = (scaled.real+.37*scaled.imag).square().mean()
    gradient, = torch.autograd.grad(objective, leaf)
    torch.cuda.synchronize()
    total = time.perf_counter()-started
    report = result.report
    peak = torch.cuda.max_memory_allocated()-before
    if peak > report['gpu_reservation_bytes']:
        raise AssertionError('Measured memory exceeds admission')
    values = (fields.detach().cpu(), gradient.detach().cpu())
    torch.cuda.synchronize()
    started = time.perf_counter()
    with torch.no_grad():
        no_grad = model(tile['eps_of'](design), frequency, fixed_epsilon=tile['eps_bg'], block_size=32)['xy']
    torch.cuda.synchronize()
    forward_only = time.perf_counter()-started
    if not torch.equal(no_grad.fields.cpu(), values[0]):
        raise AssertionError('Forward-only and recorded spectra differ')
    return values, dict(total_seconds=total, recorded_forward_seconds=report['forward_seconds'],
        backward_seconds=report['last_backward']['seconds'], forward_only_seconds=forward_only,
        peak_increment_bytes=peak, gpu_reservation_bytes=report['gpu_reservation_bytes'],
        forward_kernel_used=report['forward_kernel_used'], adjoint_kernel_used=report['adjoint_kernel_used'],
        fallback_reason=report['fallback_reason'], cuda_launches=report['cuda_launches'])


def profile_kernels(tile, design_value, options):
    """CUDA event times on a separate disposable zero-state system.

    The byte figures are the ideal unique-array model, excluding CPML traffic,
    duplicate gathers, cache effects, sources, observations and trace copies.
    They are effective model GB/s, not measured DRAM transactions.
    """
    from torchfdtd.reversible_cpml import _recorded_system
    from torchfdtd.reversible_cpml_kernels import InteriorReconstruction
    model = ReversibleCPMLPlaneSimulation(tile['project'], options, quadrature_counts=tile['qc'])
    material = tile['eps_of'](design_value)
    project, interval = model.model._snapshot()
    spectral = model._spectral(material, tile['freq'].to(tile['device']), 32)
    report = {}
    system = _recorded_system(material, project, spectral, options, report)
    cells = math.prod(tile['shape'])
    fraction = (interval[1]-interval[0]+1)/tile['shape'][2]
    result = {}

    def measure(label, fn, grid, block, arrays, bytes_per_cell):
        with system.kernel._stream() if system.kernel is not None else system.fused_eh._stream():
            for _ in range(2):
                fn(grid, block, arrays)
            samples = []
            for _ in range(7):
                start, stop = torch.cuda.Event(enable_timing=True), torch.cuda.Event(enable_timing=True)
                start.record()
                fn(grid, block, arrays)
                stop.record()
                stop.synchronize()
                samples.append(start.elapsed_time(stop))
        ms = statistics.median(samples)
        result[label] = dict(median_ms=ms, samples_ms=samples,
            model_bytes_per_full_cell=bytes_per_cell, model_GB_per_second=bytes_per_cell*cells/(ms*1e6))

    if system.kernel is None:
        engine = system.fused_eh
        measure('forward_fused_eh', engine.fn, engine.grid, engine.block,
                engine.args[0][1]+(np.int32(0),), 60)
    else:
        for forward, label, byte_count in ((False, 'forward_E', 48), (True, 'forward_H', 36)):
            fn, arrays, _ = system.kernel.launches[forward]
            block = getattr(system.kernel, 'tuned_blocks', {}).get(forward, 256)
            measure(label, fn, ((cells+block-1)//block,), (block,), arrays, byte_count)
    gradient = torch.zeros_like(material)
    seed = material.new_zeros((32, len(system.monitors)))
    helper = InteriorReconstruction(system, *interval, gradient, seed, options=options, report=report)
    for phase, byte_count in (('h', 36), ('eg', 84 if tile['diagonal'] else 68)):
        helper._inverse.run(phase)
        fn, arrays, _ = helper._inverse.kernels[phase]
        block = helper._inverse.launch_blocks[phase]
        count = helper._inverse.count
        measure('interior_'+phase, fn, ((count+block-1)//block,), (block,), arrays, byte_count*fraction)
    adj = helper._fused
    one = getattr(adj, 'one_pass', None)
    if one is not None:
        measure('adjoint_one_pass', one.fn, ((cells+one.bs-1)//one.bs,), (one.bs,), one.args[0][1], 60 if tile['diagonal'] else 52)
    else:
        for forward, label, byte_count in ((True, 'adjoint_Ht', 36), (False, 'adjoint_Et', 48 if tile['diagonal'] else 40)):
            fn, arrays, _ = adj.launches[forward, 0]
            block = getattr(adj, 'tuned_blocks', {}).get((forward, 0), 256)
            measure(label, fn, ((cells+block-1)//block,), (block,), arrays, byte_count)
    return result


def benchmark(args):
    modes = args.modes.split(',')
    if 'split' not in modes or any(mode not in MODES for mode in modes):
        raise ValueError('Modes must include split and use the documented names.')
    tile = build_tile(args.core, args.over, args.steps, args.trace, not args.scalar,
        args.gpu_gib, launch_modes=modes)
    pil = torch.nonzero(tile['pil']).flatten().tolist()
    interval = (pil[0], pil[-1])
    design_value = design(tile)
    options = {mode: replace(tile['adj_options'], interior_z=interval,
        diagnostic_chunk_elements=1 << 24, **MODES[mode]) for mode in modes}
    samples = {mode: [] for mode in modes}
    reference = None
    for repetition in range(-1, args.repeats):
        # Warm every distinct program once. Reverse each successive sweep so
        # thermal and clock drift do not consistently favor one mode.
        order = modes if repetition % 2 else list(reversed(modes))
        for mode in order:
            values, row = run(tile, design_value, options[mode])
            if reference is None:
                reference = values
            if not all(torch.equal(a, b) for a, b in zip(reference, values)):
                raise AssertionError(f'{mode}: fields or gradients differ from the split expression')
            if row['fallback_reason']:
                raise AssertionError(f'{mode}: requested kernel fell back: {row["fallback_reason"]}')
            if repetition >= 0:
                samples[mode].append(row)
            print(f'{repetition:2d} {mode:9s} total={row["total_seconds"]:.6f}s '
                  f'forward={row["recorded_forward_seconds"]:.6f}s backward={row["backward_seconds"]:.6f}s', flush=True)
            del values
            gc.collect()
    metrics = ('total_seconds', 'recorded_forward_seconds', 'backward_seconds', 'forward_only_seconds')
    medians = {mode: {metric: statistics.median(row[metric] for row in rows) for metric in metrics}
               for mode, rows in samples.items()}
    kernels = {mode: profile_kernels(tile, design_value, options[mode]) for mode in modes}
    files = ['torchfdtd/reversible_cpml.py', 'torchfdtd/reversible_cpml_kernels.py',
             'torchfdtd/reversible_cuda_fused.py', 'torchfdtd/reversible_cuda_tuning.py',
             'torchfdtd/cuda_kernels.py', 'torchfdtd/cuda_adjoint.py', 'torchfdtd/recorded_observations.py',
             'torchfdtd/reversible_cpml_memory.py', 'benchmarks/reversible_cpml_fused_updates.py']
    return dict(device=torch.cuda.get_device_name(0), torch_version=torch.__version__,
        cuda_version=torch.version.cuda, shape=tile['shape'], core_um=args.core, over_um=args.over,
        steps=args.steps, repeats=args.repeats, trace_storage=args.trace, interval=interval,
        material_components=tile['comps'], scope='single tile, one polarization, same reconstruction interval',
        spectra_bitwise_equal=True, gradients_bitwise_equal=True, samples=samples, medians=medians,
        kernel_profiles=kernels, byte_model='Ideal unique-array bytes, CPML and gather/cache overhead excluded; not measured DRAM bandwidth',
        reduction_fraction={mode: {metric: 1-values[metric]/medians['split'][metric] for metric in metrics}
                            for mode, values in medians.items()},
        source_sha256={name: hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in files})


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--core', type=float, default=4.)
    parser.add_argument('--over', type=float, default=1.8)
    parser.add_argument('--steps', type=int, default=1200)
    parser.add_argument('--repeats', type=int, default=5)
    parser.add_argument('--trace', choices=('cpu', 'device'), default='cpu')
    parser.add_argument('--gpu-gib', type=float, default=10.)
    parser.add_argument('--scalar', action='store_true')
    parser.add_argument('--modes', default=','.join(MODES))
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    if args.core <= 0 or args.over <= 0 or args.steps <= 0 or args.repeats < 2:
        parser.error('Positive dimensions/steps and at least two repetitions are required.')
    result = benchmark(args)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(result['medians'], indent=2), flush=True)
