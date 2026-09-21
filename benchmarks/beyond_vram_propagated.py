"""Beyond-VRAM propagated case: a pillar-array lens through the streamed plane adjoint.

A square array of silicon-nitride pillars on a 1 um period is lit from below by
a plane-wave pulse; a downsampled output plane above the pillars accumulates the
six-component spectrum at three wavelengths; the objective is the on-axis
intensity at the design focal distance after angular-spectrum propagation. The
streamed adjoint returns the dense epsilon VJP. The fixture is public and
synthetic; the geometry is generated from the arguments below and lives in the
epsilon tensor, not in project structures.

The case files docs/validation/cases/G5-05.json and G5-06.json fix the
acceptance criteria before the judged run. ``--plan`` prints the reservation,
the work counts and the wall-time estimate without allocating the domain;
``--rehearsal`` selects the small footprint and budgets of the local rehearsal.

python -m benchmarks.beyond_vram_propagated --rehearsal --mode both --output results/rehearsal.json
python -m benchmarks.beyond_vram_propagated --footprint 120 --plan --assume-5880
"""
import argparse
import gc
import hashlib
import json
import math
from pathlib import Path
import platform
import threading
import time

import numpy as np
import psutil
import torch

C0 = 299792458.0
WAVELENGTHS_UM = (1.65, 1.55, 1.45)  # increasing frequency

# Wall-time model fitted on the four recorded RTX 5880 host-bank runs
# (docs/validation/compact-host-large-5880.json and compact-host-capacity-5880.json):
# seconds = payload bytes / GBPS + cell-steps / GCS + tile visits * TILE_S, with
# the measured payload per block being 1.38 x gathered + owned bytes for a
# forward or replay block and 2.6 x gathered + 1.7 x owned for a transpose block.
TIME_MODEL = dict(payload_gb_per_s=5.46, gcell_steps_per_s=4.68, seconds_per_tile_visit=.0033,
                  forward_h2d_factor=1.38, forward_d2h_factor=1., transpose_h2d_factor=2.6, transpose_d2h_factor=1.7,
                  journal_gb_per_s=1.5,
                  scope='Least-squares fit of the eight forward/backward timings of the two host-bank records above; '
                        'an estimate with about 30 percent scatter on those records, not a measurement of this fixture.')
# Resources of the RTX 5880 workstation as recorded in docs/validation/beyond_vram_restart_5880.json.
WORKSTATION_5880 = dict(total_ram_bytes=137116830924, available_ram_bytes=129165385728,
                        physical_vram_bytes=51526500352, free_vram_bytes=49643782144, hardware='NVIDIA RTX 5880 Ada Generation')


def fixture(footprint_um, mesh_um, *, period_um=1., height_um=.6, focal_um=150., downsample=8,
            radius_um=(.15, .42), pml_cells=10, margin_um=.5, source_z_um=-.8, pillar_top_um=.2,
            monitor_z_um=.6, z_size_um=3.2, pulse_fs=15., pulse_offset_fs=30., duration_fs=160.,
            steps=None, memory_mode='streamed', backend='cuda'):
    """The project (no structures), the pillar centres/radii and the design-slab z range."""
    from torchfdtd import FieldMonitor, Project, Region, Source
    from torchfdtd.run_control import source_end_time
    lateral = footprint_um+2*margin_um+2*pml_cells*mesh_um
    cells = int(round(lateral/mesh_um))
    inner = int(round(footprint_um/mesh_um))
    if inner % downsample:
        raise ValueError('The footprint must hold a whole number of coalesced monitor cells.')
    size = (cells*mesh_um, cells*mesh_um, int(round(z_size_um/mesh_um))*mesh_um)
    region = Region(dimension='3d', size=size, mesh=mesh_um, pml_cells=pml_cells, steps=100, precision='float32',
                    memory_mode=memory_mode, backend=backend, cuda_kernel='fused' if backend == 'cuda' else 'torch')
    source = Source(kind='plane', normal='z', center=(0., 0., source_z_um), size=(size[0], size[1], 0.), component='Ex',
                    wavelength=WAVELENGTHS_UM[1], pulse='gaussian', time_definition='standard',
                    pulse_length=pulse_fs*1e-15, pulse_offset=pulse_offset_fs*1e-15, extend_through_pml=True)
    frequencies = [C0/(w*1e-6) for w in WAVELENGTHS_UM]  # strictly increasing
    monitor = FieldMonitor(id='out', normal='z', center=(0., 0., monitor_z_um), size=(footprint_um, footprint_um, 0.),
                           downsample=downsample, spectrum=dict(sampling='custom', custom_frequencies_hz=frequencies, apodization='none'))
    project = Project(region=region, sources=[source], monitors=[monitor])
    if steps is None:
        steps = math.ceil(duration_fs*1e-15/project.region.time_step)
    project.region.steps = int(steps)
    project = Project.model_validate(project.model_dump())
    count = int(round(footprint_um/period_um))
    start = -(count-1)*period_um/2
    centres = np.array([(start+period_um*i, start+period_um*j) for i in range(count) for j in range(count)])
    # Hyperbolic lens phase wrapped onto the radius range: a lens-like array
    # whose exact focusing efficiency is not claimed.
    rho2 = (centres**2).sum(1)
    phase = -2*math.pi/WAVELENGTHS_UM[1]*(np.sqrt(rho2+focal_um**2)-focal_um)
    radii = radius_um[0]+(radius_um[1]-radius_um[0])*np.mod(phase/(2*math.pi), 1.)
    z_lo = pillar_top_um-height_um
    nodes = project.region.mesh_nodes[2]
    k_lo = int(np.searchsorted(nodes, z_lo-1e-9))
    k_hi = int(np.searchsorted(nodes, pillar_top_um-1e-9))
    return dict(project=project, centres=centres, radii=radii, pillar_layers=(k_lo, k_hi), focal_um=focal_um,
                frequencies_hz=frequencies, wavelengths_um=list(WAVELENGTHS_UM), epsilon_pillar=4., footprint_um=footprint_um,
                mesh_um=mesh_um, period_um=period_um, height_um=height_um, radius_um=list(radius_um), downsample=downsample,
                source_z_um=source_z_um, monitor_z_um=monitor_z_um, pulse_fs=pulse_fs, pulse_offset_fs=pulse_offset_fs,
                duration_fs=project.region.steps*project.region.time_step*1e15, source_end_fs=source_end_time(project)*1e15,
                pillar_count=len(radii))


def pillar_mask(spec, radius_um=None):
    """Cell-centred staircase mask of the pillars, optionally only those within radius_um of the axis."""
    project = spec['project']
    shape = project.region.shape
    mesh = spec['mesh_um']
    nodes = project.region.mesh_nodes
    x = (nodes[0][:-1]+nodes[0][1:])/2
    y = (nodes[1][:-1]+nodes[1][1:])/2
    mask = np.zeros(shape[:2], dtype=bool)
    reach = int(math.ceil(max(spec['radii'])/mesh))+1
    for (cx, cy), r in zip(spec['centres'], spec['radii']):
        if radius_um is not None and math.hypot(cx, cy) > radius_um:
            continue
        i0 = max(0, int(np.searchsorted(x, cx))-reach)
        j0 = max(0, int(np.searchsorted(y, cy))-reach)
        i1, j1 = min(shape[0], i0+2*reach+1), min(shape[1], j0+2*reach+1)
        mask[i0:i1, j0:j1] |= (x[i0:i1, None]-cx)**2+(y[None, j0:j1]-cy)**2 <= r*r
    return mask


def rasterize(spec, dtype=torch.float32):
    """Epsilon of the pillar array: 1 everywhere, epsilon_pillar inside the pillars over their layers."""
    k_lo, k_hi = spec['pillar_layers']
    mask = pillar_mask(spec)
    epsilon = torch.ones(spec['project'].region.shape, dtype=dtype)
    layer = torch.from_numpy(mask)
    epsilon[:, :, k_lo:k_hi] = torch.where(layer[:, :, None], torch.tensor(spec['epsilon_pillar'], dtype=dtype), torch.tensor(1., dtype=dtype))
    return epsilon, mask


def sha256_tensor(value):
    from torchfdtd.streamed_restart import sha256_tensor as digest
    return digest(value.detach().contiguous().cpu())


class _EnergySpectrum:
    """Mixin recording the per-step sum of squares of the electric plane samples."""
    def accumulate(self, output, samples, start):
        electric = self.groups['E']
        energy = samples[:, electric].double().square().sum(1).cpu()
        self.energy_history[start:start+len(energy)] = energy
        return super().accumulate(output, samples, start)


def energy_plane_model(project, options):
    """DifferentiablePlaneSimulation whose spectral observation also records the sample energy history."""
    from torchfdtd import DifferentiablePlaneSimulation
    from torchfdtd.adjoint_planes import _PlaneSpectrum

    class EnergyPlaneSpectrum(_EnergySpectrum, _PlaneSpectrum):
        pass

    class EnergyPlaneSimulation(DifferentiablePlaneSimulation):
        def _spectral(self, epsilon, frequency_hz, block_size):
            points = sum(len(plan['weights']) for _, _, plan, _ in self.plans)
            maps = sum(i.nbytes+w.nbytes for _, _, _, entries in self.plans for i, w in entries)
            spectral = EnergyPlaneSpectrum(epsilon, self.project.region, self.components, frequency_hz,
                                           block_size=block_size, points=points, maps=maps)
            spectral.observers = self.observers
            spectral.energy_history = torch.zeros(self.project.region.steps, dtype=torch.float64)
            self.last_spectral = spectral
            return spectral
    return EnergyPlaneSimulation(project, options)


def objective(plane, spec):
    """On-axis intensity at the focal distance, summed over the frequencies, of the time-normalized spectrum."""
    from dataclasses import replace
    from torchfdtd.angular_spectrum import propagate_points
    region = spec['project'].region
    scale = 1./(region.time_step*region.steps)
    scaled = replace(plane, fields=plane.fields*scale)
    focus = propagate_points(scaled, [[0., 0., spec['monitor_z_um']+spec['focal_um']]], pad=3)
    intensity = focus.intensity().reshape(-1)
    return intensity.sum(), intensity, scaled


def plane_summary(scaled, spec):
    """Per-frequency electric energy on the plane (reduced units, time-normalized) and the plane shape."""
    electric = scaled.fields[..., :3].abs().square().sum(-1)
    return dict(plane_shape=list(scaled.shape), plane_points=int(scaled.fields.shape[1]),
                plane_electric_energy_per_frequency=(electric@scaled.weights.to(electric.dtype)).detach().cpu().tolist())


def source_amplitude_ratio(spec):
    """Amplitude spectrum of the sampled source waveform at the three frequencies over its peak."""
    from torchfdtd.waveforms import source_time_signal
    project = spec['project']
    source = project.resolved_source(project.sources[0])
    dt = project.region.time_step
    times = (np.arange(project.region.steps)+1)*dt
    wave = source_time_signal(source, times)
    frequencies = np.fft.rfftfreq(len(wave), dt)
    spectrum = np.abs(np.fft.rfft(wave))
    peak = spectrum.max()
    return [float(np.interp(f, frequencies, spectrum)/peak) for f in spec['frequencies_hz']]


class Sampler:
    """Process RSS/private bytes, whole-device CUDA use and machine disk counters, sampled in a thread."""
    def __init__(self, interval=.5):
        self.process = psutil.Process()
        self.interval = interval
        self.stop = threading.Event()
        self.peak_rss = self.peak_private = self.peak_device_in_use = 0
        self.disk_start = psutil.disk_io_counters()
        self.thread = threading.Thread(target=self.run, daemon=True)

    def sample(self):
        info = self.process.memory_full_info() if hasattr(self.process, 'memory_full_info') else self.process.memory_info()
        self.peak_rss = max(self.peak_rss, info.rss)
        self.peak_private = max(self.peak_private, getattr(info, 'private', 0))
        if torch.cuda.is_available():
            free, total = torch.cuda.mem_get_info()
            self.peak_device_in_use = max(self.peak_device_in_use, total-free)

    def run(self):
        self.sample()
        while not self.stop.wait(self.interval):
            self.sample()

    def __enter__(self):
        self.thread.start()
        return self

    def __exit__(self, *exc):
        self.stop.set()
        self.thread.join()
        self.sample()

    def report(self):
        disk = psutil.disk_io_counters()
        return dict(peak_process_rss_bytes=self.peak_rss, peak_process_private_bytes=self.peak_private,
                    peak_device_in_use_bytes=self.peak_device_in_use,
                    machine_disk_read_bytes=disk.read_bytes-self.disk_start.read_bytes,
                    machine_disk_write_bytes=disk.write_bytes-self.disk_start.write_bytes,
                    scope='RSS and private bytes are this process, sampled every half second; device in use is the whole GPU '
                          '(every process) from cudaMemGetInfo; disk bytes are psutil machine-wide counters over the phase. '
                          'None of these are added together.')


def torch_memory():
    if not torch.cuda.is_available():
        return dict(peak_torch_allocated_bytes=None, peak_torch_reserved_bytes=None)
    return dict(peak_torch_allocated_bytes=int(torch.cuda.max_memory_allocated()),
                peak_torch_reserved_bytes=int(torch.cuda.max_memory_reserved()))


def streamed_options(args, project):
    from torchfdtd import StreamedAdjointOptions
    kwargs = dict(device='cuda', slab_width=args.width, temporal_depth=args.depth, checkpoints=args.checkpoints,
                  local_checkpoints=args.local_checkpoints, host_budget_bytes=int(args.host_gib*1024**3),
                  gpu_budget_bytes=int(args.gpu_gib*1024**3), state_storage=args.banks)
    if args.banks == 'disk':
        if not args.scratch:
            raise ValueError('Disk banks need --scratch.')
        kwargs.update(state_directory=args.scratch, disk_budget_bytes=int(args.disk_gib*1024**3),
                      disk_free_reserve_bytes=int(args.disk_reserve_gib*1024**3))
    if args.journal:
        kwargs.update(restart_directory=args.journal, restart_every_blocks=args.journal_every)
    return StreamedAdjointOptions(**kwargs)


def resident_options(args):
    from torchfdtd import AdjointOptions
    return AdjointOptions(checkpoints=args.resident_checkpoints, storage='host')


def time_estimate(work, *, fd_forwards=0, journal_records=0, parameter_bytes=0):
    """Wall-time estimate of one streamed forward, its VJP and the extra forwards from the work counts and TIME_MODEL."""
    m = TIME_MODEL
    block = work['block_work'][0]
    gathered, owned = block['gathered_state_bytes']/1e9, block['owned_state_bytes']/1e9
    tiles, blocks, replayed = work['tile_count'], work['blocks'], work['global_replayed_blocks']
    block_cells = block['extended_cells']*work['temporal_depth']/1e9
    forward_block = (m['forward_h2d_factor']*gathered+m['forward_d2h_factor']*owned)/m['payload_gb_per_s']+block_cells/m['gcell_steps_per_s']+tiles*m['seconds_per_tile_visit']
    local_cells = work['local_replay_cell_steps']/1e9/blocks
    transpose_block = (m['transpose_h2d_factor']*gathered+m['transpose_d2h_factor']*owned)/m['payload_gb_per_s']+(block_cells+local_cells)/m['gcell_steps_per_s']+tiles*m['seconds_per_tile_visit']
    forward = blocks*forward_block
    backward = replayed*forward_block+blocks*transpose_block
    journal_gb = journal_records*2*(work['state_bytes']+parameter_bytes)/1e9
    journal_seconds = journal_gb/m['journal_gb_per_s']
    total = forward+backward+fd_forwards*forward+journal_seconds
    return dict(forward_seconds=forward, backward_seconds=backward, fd_forward_seconds=fd_forwards*forward,
                journal_seconds=journal_seconds, journal_write_gb=journal_gb, total_seconds=total, total_hours=total/3600, model=m)


def plan(args, spec, options):
    """Reservation, work counts and the wall-time estimate; no domain allocation."""
    import torchfdtd.streamed as streamed_module
    from torchfdtd.streamed_work import estimate_streamed_work
    project = spec['project']
    cells = math.prod(project.region.shape)
    assumed = None
    original = streamed_module.host_memory, streamed_module.cuda_budget_limit
    if args.assume_5880:
        assumed = WORKSTATION_5880
        streamed_module.host_memory = lambda: dict(total_bytes=assumed['total_ram_bytes'], available_bytes=assumed['available_ram_bytes'])
        streamed_module.cuda_budget_limit = lambda device, required, budget=None: min(budget or assumed['physical_vram_bytes'], int(assumed['free_vram_bytes']*.8))
    try:
        plane = energy_plane_model(project, options)
        # The plane's own spectral observation carries the true observer count; a
        # point-spectrum estimate on the internal project would reserve for one.
        meta = torch.empty(plane.model.project.region.shape, dtype=torch.float32, device='meta')
        spectral = plane._spectral(torch.empty((), dtype=torch.float32), spec['frequencies_hz'], 32)
        reservation = streamed_module._reservation(plane.model.project, meta, options, spectral)
    finally:
        streamed_module.host_memory, streamed_module.cuda_budget_limit = original
    reservation.update(spectral.reservation(min(options.temporal_depth, project.region.steps)))
    reservation['plane_layout_reservation_bytes'] = plane.layout_reservation_bytes
    reservation['observers'] = len(plane.observers)
    work = estimate_streamed_work(plane.model.project, options)
    fd_forwards = {'none': 0, 'forward': 1, 'central': 2}[args.fd_check]
    estimate = time_estimate(work, fd_forwards=fd_forwards, journal_records=work['blocks']//args.journal_every if args.journal else 0,
                             parameter_bytes=cells*4)
    eh_bytes = 6*cells*4
    resident = dict(eh_bytes=eh_bytes, primal_adjoint_material_gradient_bytes=60*cells,
                    bytes_per_resident_checkpoint=work['state_bytes'],
                    resident_cell_cap=8_000_000,
                    note='A resident adjoint keeps one primal and one adjoint E/H state, epsilon, its inverse and the gradient '
                         '(60 bytes per cell) plus one full state per checkpoint; the public resident path also caps scenes at eight million cells.')
    return dict(assumed_workstation=assumed, cells=cells, grid=list(project.region.shape), steps=project.region.steps,
                eh_bytes=eh_bytes, state_bytes=work['state_bytes'], reservation=reservation, work=work, estimate=estimate, resident=resident,
                disk_writes_estimate_gb=(work['total_state_io_bytes']/2e9 if args.banks == 'disk' else 0.)+estimate['journal_write_gb'])


def run_forward(model, epsilon, spec, label, record, args, sampler_scope):
    """One forward through the plane model; returns the plane, the objective and the timings."""
    project = spec['project']
    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
        torch.cuda.synchronize()
    started = time.perf_counter()
    with Sampler() as sampler:
        planes = model(epsilon, spec['frequencies_hz'])
        plane = planes['out']
        J, per_frequency, scaled = objective(plane, spec)
        if torch.cuda.is_available():
            torch.cuda.synchronize()
    seconds = time.perf_counter()-started
    history = model.last_spectral.energy_history.numpy()
    peak = int(history.argmax())
    entry = dict(seconds=seconds, objective=float(J), focal_intensity_per_frequency=per_frequency.detach().cpu().tolist(),
                 energy_peak_step=peak, energy_peak_fs=(peak+1)*project.region.time_step*1e15,
                 energy_peak=float(history[peak]), energy_final=float(history[-1]),
                 energy_decayed_fraction=float(history[-1]/history[peak]) if history[peak] > 0 else None,
                 energy_rise_step=int(np.argmax(history > 1e-3*history[peak])) if history[peak] > 0 else None,
                 report=plane.report, **plane_summary(scaled, spec), **torch_memory(), memory=sampler.report())
    record.setdefault('runs', {})[label] = entry
    return plane, J, scaled, history, entry


def directional(gradient, delta_mask, layers):
    k_lo, k_hi = layers
    inside = torch.from_numpy(delta_mask)
    return float(gradient[:, :, k_lo:k_hi][inside].double().sum())


def execute(args, spec, mode, record, artifacts):
    """Forward, VJP and the optional finite-difference check in one execution mode."""
    project = spec['project']
    project.region.memory_mode = 'streamed' if mode == 'streamed' else 'resident'
    project = spec['project'] = type(project).model_validate(project.model_dump())
    device = 'cuda' if mode == 'resident' else 'cpu'
    options = streamed_options(args, project) if mode == 'streamed' else resident_options(args)
    model = energy_plane_model(project, options)
    epsilon, mask = rasterize(spec)
    fd_mask = pillar_mask(spec, args.fd_radius_um)
    k_lo, k_hi = spec['pillar_layers']
    entry = dict(mode=mode, options=dict(vars(options)) if mode == 'resident' else {k: (str(v) if isinstance(v, Path) else v) for k, v in vars(options).items()},
                 observers=len(model.observers), epsilon_sha256=sha256_tensor(epsilon),
                 pillar_cells_per_layer=int(mask.sum()), design_cells=int(mask.sum())*(k_hi-k_lo),
                 fd_cells=int(fd_mask.sum())*(k_hi-k_lo), fd_radius_um=args.fd_radius_um, fd_step=args.fd_step, fd_check=args.fd_check)
    record['executions'][mode] = entry
    if mode == 'streamed':
        from torchfdtd import estimate_streamed_memory
        entry['reservation'] = estimate_streamed_memory(model.model.project, options, frequency_hz=spec['frequencies_hz'])
    design = epsilon.to(device).requires_grad_(True)
    plane, J, scaled, history, forward = run_forward(model, design, spec, mode+'_forward', record, args, mode)
    np.save(artifacts/f'{mode}_energy_history.npy', history)
    np.save(artifacts/f'{mode}_plane_fields.npy', scaled.fields.detach().cpu().numpy())
    print(json.dumps(dict(mode=mode, stage='forward', seconds=forward['seconds'], objective=forward['objective'],
                          decayed=forward['energy_decayed_fraction'])), flush=True)
    if torch.cuda.is_available():
        torch.cuda.reset_peak_memory_stats()
        torch.cuda.synchronize()
    started = time.perf_counter()
    with Sampler() as sampler:
        gradient, = torch.autograd.grad(J, design)
        if torch.cuda.is_available():
            torch.cuda.synchronize()
    backward_seconds = time.perf_counter()-started
    gradient = gradient.detach().cpu()
    slab = gradient[:, :, k_lo:k_hi]
    entry['backward'] = dict(seconds=backward_seconds, gradient_norm=float(gradient.double().norm()),
                             design_slab_gradient_norm=float(slab.double().norm()),
                             design_slab_gradient_sha256=sha256_tensor(slab.contiguous()),
                             gradient_nonzero=int(torch.count_nonzero(gradient)), gradient_finite=bool(torch.isfinite(gradient).all()),
                             directional_derivative=directional(gradient, fd_mask, (k_lo, k_hi)),
                             report=plane.report, **torch_memory(), memory=sampler.report())
    np.save(artifacts/f'{mode}_design_slab_gradient.npy', slab.contiguous().numpy())
    print(json.dumps(dict(mode=mode, stage='backward', seconds=backward_seconds, gradient_norm=entry['backward']['gradient_norm'])), flush=True)
    del plane, J, scaled, design
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
    if args.fd_check != 'none':
        delta = torch.zeros_like(epsilon)
        delta[:, :, k_lo:k_hi] = torch.from_numpy(fd_mask)[:, :, None].to(epsilon.dtype)
        h = args.fd_step
        values = {}
        with torch.no_grad():
            for sign in ((1,) if args.fd_check == 'forward' else (1, -1)):
                perturbed = (epsilon+sign*h*delta).to(device)
                _, J_side, _, _, side = run_forward(model, perturbed, spec, f'{mode}_fd_{"plus" if sign > 0 else "minus"}', record, args, mode)
                values[sign] = float(J_side)
                del perturbed
                gc.collect()
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
        base = forward['objective']
        if args.fd_check == 'forward':
            fd = (values[1]-base)/h
            response = abs(values[1]-base)/abs(base)
        else:
            fd = (values[1]-values[-1])/(2*h)
            response = abs(values[1]-values[-1])/abs(base)
        derivative = entry['backward']['directional_derivative']
        entry['fd'] = dict(kind=args.fd_check, step=h, objective_plus=values.get(1), objective_minus=values.get(-1), objective=base,
                           finite_difference=fd, directional_derivative=derivative,
                           relative_error=abs(fd-derivative)/abs(derivative) if derivative else None,
                           relative_response=response)
        print(json.dumps(dict(mode=mode, stage='fd', **{k: v for k, v in entry['fd'].items() if k != 'kind'})), flush=True)
    return entry


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--footprint', type=float, default=120., help='Pillar array side in um')
    parser.add_argument('--mesh', type=float, default=.05)
    parser.add_argument('--duration-fs', type=float, default=160.)
    parser.add_argument('--steps', type=int, default=None, help='Override the step count derived from --duration-fs')
    parser.add_argument('--downsample', type=int, default=8, help='Output plane sample spacing in cells')
    parser.add_argument('--mode', choices=['streamed', 'resident', 'both'], default='streamed')
    parser.add_argument('--banks', choices=['host', 'disk'], default='host')
    parser.add_argument('--scratch', default=None, help='Directory of the disk state banks')
    parser.add_argument('--journal', default=None, help='Restart journal directory (streamed)')
    parser.add_argument('--journal-every', type=int, default=4)
    parser.add_argument('--width', type=int, default=128)
    parser.add_argument('--depth', type=int, default=32)
    parser.add_argument('--checkpoints', type=int, default=2)
    parser.add_argument('--local-checkpoints', type=int, default=1)
    parser.add_argument('--resident-checkpoints', type=int, default=8)
    parser.add_argument('--host-gib', type=float, default=96.)
    parser.add_argument('--gpu-gib', type=float, default=40.)
    parser.add_argument('--disk-gib', type=float, default=250.)
    parser.add_argument('--disk-reserve-gib', type=float, default=50.)
    parser.add_argument('--fd-check', choices=['none', 'forward', 'central'], default='forward')
    parser.add_argument('--fd-step', type=float, default=.05, help='Epsilon perturbation of the finite-difference direction')
    parser.add_argument('--fd-radius-um', type=float, default=10., help='Pillars within this distance of the axis form the direction')
    parser.add_argument('--output', required=True)
    parser.add_argument('--artifacts', default=None, help='Directory of the .npy artifacts (default: next to --output)')
    parser.add_argument('--plan', action='store_true', help='Print the reservation, work and time estimate only')
    parser.add_argument('--assume-5880', action='store_true', help='Plan against the recorded RTX 5880 resources instead of this machine')
    parser.add_argument('--rehearsal', action='store_true', help='Local preset: 14 um footprint, 6 GiB host, 1.5 GiB GPU, W=32 K=16')
    args = parser.parse_args(argv)
    if args.rehearsal:
        args.footprint, args.host_gib, args.gpu_gib, args.width, args.depth = 14., 6., 1.5, 32, 16
        args.fd_check = 'central' if args.fd_check == 'forward' else args.fd_check
    if args.mode != 'streamed' and args.journal:
        raise ValueError('The restart journal applies to the streamed mode only.')
    spec = fixture(args.footprint, args.mesh, downsample=args.downsample, duration_fs=args.duration_fs, steps=args.steps)
    project = spec['project']
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    record = dict(stage='planned', fixture={k: v for k, v in spec.items() if k not in ('project', 'centres', 'radii')},
                  project=project.model_dump(mode='json'), grid=list(project.region.shape), cells=math.prod(project.region.shape),
                  steps=project.region.steps, time_step_s=project.region.time_step, eh_bytes=6*math.prod(project.region.shape)*4,
                  precision='float32', arguments=vars(args), source_amplitude_ratio=source_amplitude_ratio(spec),
                  frequency_resolution_hz=1./(project.region.steps*project.region.time_step),
                  minimum_frequency_separation_hz=float(min(np.diff(spec['frequencies_hz']))),
                  radii_sha256=hashlib.sha256(spec['radii'].tobytes()).hexdigest(),
                  environment=dict(python=platform.python_version(), torch=torch.__version__, platform=platform.platform(),
                                   cuda=torch.version.cuda, hardware=torch.cuda.get_device_name() if torch.cuda.is_available() else None,
                                   physical_vram_bytes=int(torch.cuda.mem_get_info()[1]) if torch.cuda.is_available() else None,
                                   total_ram_bytes=psutil.virtual_memory().total, available_ram_bytes=psutil.virtual_memory().available),
                  source_sha256={path.name: hashlib.sha256(path.read_bytes()).hexdigest()
                                 for path in [Path(__file__), *sorted(Path(__file__).resolve().parents[1].joinpath('torchfdtd').glob('*.py'))]},
                  scope='Propagated beyond-VRAM case: a plane-wave pulse through a pillar-array lens, a downsampled spectral output '
                        'plane, an angular-spectrum focal objective and the dense epsilon VJP. Physical-VRAM comparison, timing and '
                        'memory figures are stated separately; no throughput superiority or converged design is claimed.')

    def save():
        temp = output.with_suffix('.tmp')
        temp.write_text(json.dumps(record, indent=1, allow_nan=False)+'\n', encoding='utf-8', newline='\n')
        temp.replace(output)
    if args.plan:
        options = streamed_options(args, project)
        record['plan'] = plan(args, spec, options)
        record['stage'] = 'planned'
        save()
        summary = dict(grid=record['grid'], cells=record['cells'], steps=record['steps'], eh_gb=record['eh_bytes']/1e9,
                       host_reservation_gb=record['plan']['reservation']['host_reservation_bytes']/1e9,
                       gpu_reservation_gb=record['plan']['reservation']['gpu_reservation_bytes']/1e9,
                       observers=record['plan']['reservation']['observers'],
                       blocks=record['plan']['work']['blocks'], replayed_blocks=record['plan']['work']['global_replayed_blocks'],
                       estimate=record['plan']['estimate'], disk_writes_estimate_gb=record['plan']['disk_writes_estimate_gb'])
        print(json.dumps(summary, indent=1))
        return record
    artifacts = Path(args.artifacts) if args.artifacts else output.parent/(output.stem+'_artifacts')
    artifacts.mkdir(parents=True, exist_ok=True)
    record['executions'] = {}
    record['artifacts_directory'] = str(artifacts)
    started = time.perf_counter()
    record['execution_timestamp'] = time.strftime('%Y-%m-%dT%H:%M:%S%z')
    save()
    try:
        for mode in (('resident', 'streamed') if args.mode == 'both' else (args.mode,)):
            execute(args, spec, mode, record, artifacts)
            save()
        if args.mode == 'both':
            resident = np.load(artifacts/'resident_design_slab_gradient.npy')
            streamed = np.load(artifacts/'streamed_design_slab_gradient.npy')
            reference, candidate = record['runs']['resident_forward']['objective'], record['runs']['streamed_forward']['objective']
            record['comparison'] = dict(
                objective_relative_difference=abs(reference-candidate)/abs(reference),
                design_slab_gradient_relative_l2=float(np.linalg.norm(resident.astype(np.float64)-streamed)/np.linalg.norm(resident.astype(np.float64))),
                energy_history_relative_l2=float(np.linalg.norm(np.load(artifacts/'resident_energy_history.npy')-np.load(artifacts/'streamed_energy_history.npy'))
                                                 /np.linalg.norm(np.load(artifacts/'resident_energy_history.npy'))))
        record['stage'] = 'complete'
        record['elapsed_seconds'] = time.perf_counter()-started
        record['artifact_sha256'] = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(artifacts.iterdir())}
        save()
        print(json.dumps(dict(stage='complete', elapsed_seconds=record['elapsed_seconds'], comparison=record.get('comparison'))), flush=True)
    except BaseException as exc:
        record.update(stage='failed', error=repr(exc), elapsed_seconds=time.perf_counter()-started)
        save()
        raise
    return record


if __name__ == '__main__':
    main()
