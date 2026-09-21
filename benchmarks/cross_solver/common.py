"""Shared fixture definitions, references and record helpers for the cross-solver comparison.

Every solver driver imports only this module and its own solver. Fixtures are
defined once in fixtures/*.json; this module evaluates the shared waveforms,
frequency samples, analytic references and the material arrays so that all
three solvers receive the same numbers.
"""
from __future__ import annotations

import hashlib
import importlib.metadata
import json
import math
import os
import platform
import statistics
import subprocess
import sys
import time
from pathlib import Path

import numpy as np

C0 = 299792458.0
HERE = Path(__file__).resolve().parent
FIXTURES = HERE / 'fixtures'
RECORDS = HERE.parents[1] / 'docs' / 'validation' / 'cross_solver'


def load_fixture(name):
    path = FIXTURES / f'{name}.json'
    spec = json.loads(path.read_text(encoding='utf-8'))
    spec['_sha256'] = sha256_file(path)
    return spec


def sha256_file(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def sha256_array(array):
    array = np.ascontiguousarray(array)
    return hashlib.sha256(array.tobytes()).hexdigest()


def driver_hashes(*names):
    return {name: sha256_file(HERE / name) for name in names}


# ----------------------------------------------------------------------------
# Waveforms. These reproduce torchfdtd.waveforms.source_time_signal for the two
# pulse definitions used by the fixtures; the TorchFDTD driver asserts equality.
# ----------------------------------------------------------------------------
def waveform(wave, times):
    times = np.asarray(times, dtype=np.float64)
    frequency = C0 / (wave['wavelength_um'] * 1e-6)
    omega = 2 * math.pi * frequency
    amplitude = wave.get('amplitude', 1.0)
    if wave['type'] == 'gaussian_cycles':
        sigma = wave['pulse_cycles'] / frequency
        offset = 4 * sigma
        u = (times - offset) / sigma
        return amplitude * np.exp(-.5 * u * u) * np.sin(omega * times)
    if wave['type'] == 'gaussian_standard':
        sigma = wave['pulse_length_s'] / (2 * math.sqrt(math.log(2)))
        x = times - wave['pulse_offset_s']
        u = x / sigma
        return amplitude * np.exp(-.5 * u * u) * np.sin(-omega * x)
    raise ValueError(f'Unknown waveform type {wave["type"]}')


def frequencies_hz(spectrum):
    a, b, n = spectrum['wavelength_start_um'], spectrum['wavelength_stop_um'], spectrum['points']
    if spectrum['sampling'] == 'wavelength':
        return C0 / (np.linspace(a, b, n) * 1e-6)
    if spectrum['sampling'] == 'frequency':
        return np.linspace(C0 / (b * 1e-6), C0 / (a * 1e-6), n)
    raise ValueError('Unsupported spectrum sampling')


# ----------------------------------------------------------------------------
# Analytic references
# ----------------------------------------------------------------------------
def fresnel_slab_transmission(wavelength_um, index, thickness_um):
    wavelength_um = np.asarray(wavelength_um, dtype=np.float64)
    return 1 / (1 + ((index**2 - 1) / (2 * index))**2 * np.sin(2 * np.pi * index * thickness_um / wavelength_um)**2)


def mie_cross_section(wavelength_um, radius_um, index):
    """Lossless nonmagnetic sphere in vacuum. Same evaluation as examples/tfsf_sphere.py."""
    from scipy.special import spherical_jn, spherical_yn
    values = []
    for wavelength in np.atleast_1d(wavelength_um):
        x = 2 * np.pi * radius_um / wavelength
        m = index
        orders = np.arange(1, math.ceil(x + 4 * np.cbrt(x) + 10) + 1)

        def psi(z):
            j = spherical_jn(orders, z)
            return z * j, j + z * spherical_jn(orders, z, derivative=True)
        px, dx = psi(x)
        pm, dm = psi(m * x)
        y = spherical_yn(orders, x)
        dy = spherical_yn(orders, x, derivative=True)
        xi = px + 1j * x * y
        dxi = dx + 1j * (y + x * dy)
        a = (m * pm * dx - px * dm) / (m * pm * dxi - xi * dm)
        b = (pm * dx - m * px * dm) / (pm * dxi - m * xi * dm)
        values.append(2 * np.pi / (2 * np.pi / wavelength)**2 * np.sum((2 * orders + 1) * (abs(a)**2 + abs(b)**2)))
    return np.asarray(values)


# ----------------------------------------------------------------------------
# Shared material arrays
# ----------------------------------------------------------------------------
def yee_axes(shape, mesh_um, size_um, component):
    """Physical Yee coordinates of one E component in micrometres (E along its own edge)."""
    axis = 'xyz'.index(component[1].lower())
    out = []
    for i, (n, s) in enumerate(zip(shape, size_um)):
        nodes = np.arange(n + 1) * mesh_um - s / 2
        out.append((nodes[:-1] + nodes[1:]) / 2 if i == axis else nodes[:-1])
    return out


def sphere_epsilon_yee(shape, mesh_um, size_um, radius_um, index, center_um=(0, 0, 0), background=1.0):
    """Per-component staircase permittivity (Nx,Ny,Nz,3), TorchFDTD 'yee' sampling."""
    parts = []
    for component in ('Ex', 'Ey', 'Ez'):
        axes = yee_axes(shape, mesh_um, size_um, component)
        x, y, z = np.meshgrid(*axes, indexing='ij', sparse=True)
        inside = (x - center_um[0])**2 + (y - center_um[1])**2 + (z - center_um[2])**2 <= radius_um**2
        parts.append(np.where(inside, index**2, background))
    return np.stack(parts, axis=-1).astype(np.float32)


def adjoint_epsilon(spec):
    shape = tuple(spec['shape'])
    eps = np.ones(shape, dtype=np.float32)
    z0, z1 = spec['slab']['z_cell_range']
    eps[:, :, z0:z1] = spec['slab']['epsilon']
    return eps


def adjoint_kick(spec):
    times = np.arange(1, spec['steps'] + 1) * spec['dt_s']
    return waveform(spec['source']['waveform'], times).astype(np.float32)


# ----------------------------------------------------------------------------
# Environment and hardware
# ----------------------------------------------------------------------------
def package_versions(names):
    out = {}
    for name in names:
        try:
            out[name] = importlib.metadata.version(name)
        except importlib.metadata.PackageNotFoundError:
            out[name] = None
    return out


def cpu_model():
    try:
        for line in Path('/proc/cpuinfo').read_text().splitlines():
            if line.startswith('model name'):
                return line.split(':', 1)[1].strip()
    except OSError:
        pass
    return platform.processor()


def nvidia_smi(fields=('name', 'driver_version', 'memory.total', 'memory.used', 'utilization.gpu')):
    try:
        out = subprocess.run(['nvidia-smi', f'--query-gpu={",".join(fields)}', '--format=csv,noheader,nounits'],
                             capture_output=True, text=True, timeout=30, check=True).stdout.strip()
    except (OSError, subprocess.SubprocessError):
        return None
    values = [v.strip() for v in out.split(',')]
    return dict(zip(fields, values))


def environment(extra=None):
    info = dict(platform=platform.platform(), python=sys.version.split()[0], cpu=cpu_model(),
                logical_cpus=os.cpu_count(), wsl_distribution=os.environ.get('WSL_DISTRO_NAME'),
                gpu=nvidia_smi())
    if extra:
        info.update(extra)
    return info


def host_cpu_load_percent():
    """Windows host CPU load in percent (WSL interop through powershell.exe), or None outside WSL."""
    try:
        out = subprocess.run(['powershell.exe', '-NoProfile', '-Command', '(Get-CimInstance Win32_Processor).LoadPercentage'],
                             capture_output=True, text=True, timeout=30, check=True).stdout.strip()
        return float(out.splitlines()[0])
    except (OSError, subprocess.SubprocessError, ValueError, IndexError):
        return None


def wait_for_idle_cpu(limit_percent, *, samples=3, interval=5.0, timeout=3600, log=print):
    """Block until the Windows host CPU load stays at or below limit_percent (the WSL load average cannot see host processes)."""
    started = time.time()
    quiet = 0
    history = []
    while True:
        load = host_cpu_load_percent()
        if load is None:
            return dict(checked=False, load_average=list(os.getloadavg()))
        history.append(dict(host_cpu_percent=load, load_average=list(os.getloadavg()), t=time.time() - started))
        if load <= limit_percent:
            quiet += 1
            if quiet >= samples:
                return dict(checked=True, limit_percent=limit_percent, host_cpu_percent=load, waited_seconds=time.time() - started,
                            samples=history[-samples:])
        else:
            quiet = 0
            log(f'host CPU busy: {load:.0f}% load; waiting', flush=True)
        if time.time() - started > timeout:
            raise TimeoutError('Host CPU did not become idle in time.')
        time.sleep(interval)


def gpu_memory_used_mb():
    smi = nvidia_smi()
    return None if smi is None else float(smi['memory.used'])


def own_context_mb(create_context):
    """Device memory taken by this process's own CUDA context: nvidia-smi reports the whole GPU."""
    before = gpu_memory_used_mb()
    create_context()
    time.sleep(1.0)
    after = gpu_memory_used_mb()
    if before is None or after is None:
        return dict(before_mb=before, after_mb=after, own_mb=0.0)
    return dict(before_mb=before, after_mb=after, own_mb=max(0.0, after - before))


def wait_for_idle_gpu(limit_mb, *, utilization_limit=5, samples=3, interval=5.0, timeout=7200, log=print):
    """Block until the GPU holds at most limit_mb MiB and stays below the utilization limit."""
    started = time.time()
    quiet = 0
    history = []
    while True:
        smi = nvidia_smi()
        if smi is None:
            return dict(checked=False)
        used = float(smi['memory.used'])
        util = float(smi['utilization.gpu'])
        history.append(dict(memory_used_mb=used, utilization=util, t=time.time() - started))
        if used <= limit_mb and util <= utilization_limit:
            quiet += 1
            if quiet >= samples:
                return dict(checked=True, limit_mb=limit_mb, memory_used_mb=used, utilization=util,
                            waited_seconds=time.time() - started, samples=history[-samples:])
        else:
            quiet = 0
            log(f'GPU busy: {used:.0f} MiB used, {util:.0f}% utilization; waiting', flush=True)
        if time.time() - started > timeout:
            raise TimeoutError('GPU did not become idle in time.')
        time.sleep(interval)


# ----------------------------------------------------------------------------
# Timing and records
# ----------------------------------------------------------------------------
def median_of(rows, key):
    return statistics.median(row[key] for row in rows)


def stable_runs(sample, repeats, idle_limit_mb, *, key='wall_seconds', max_spread=1.25, attempts=4, log=print):
    """Warm up once, take `repeats` timed samples, and repeat the whole block while the samples spread too much.

    The GPU is shared with the desktop, so a block whose max/min wall time exceeds `max_spread`
    is treated as disturbed: the block waits for the idle criterion again and is re-taken.
    Every attempt is kept in the returned record; `runs` holds the accepted block.
    """
    history = []
    for attempt in range(attempts):
        idle = wait_for_idle_gpu(idle_limit_mb, log=log)
        runs = []
        for repeat in range(-1, repeats):
            row = sample(repeat)
            if repeat >= 0:
                runs.append(row)
        spread = max(r[key] for r in runs) / max(min(r[key] for r in runs), 1e-12)
        history.append(dict(attempt=attempt, gpu_idle=idle, runs=runs, spread=spread, accepted=spread <= max_spread))
        log(json.dumps(dict(attempt=attempt, spread=spread, accepted=spread <= max_spread)), flush=True)
        if spread <= max_spread:
            break
    accepted = next((h for h in history if h['accepted']), history[-1])
    return dict(runs=accepted['runs'], gpu_idle=accepted['gpu_idle'], spread=accepted['spread'], accepted_attempt=accepted['attempt'],
                attempts=history, max_spread=max_spread)


def write_record(name, record):
    RECORDS.mkdir(parents=True, exist_ok=True)
    path = RECORDS / f'{name}.json'
    path.write_bytes((json.dumps(record, indent=2, allow_nan=False) + '\n').encode('utf-8'))
    return path


def relative_l2(a, b):
    a, b = np.asarray(a, dtype=np.float64).ravel(), np.asarray(b, dtype=np.float64).ravel()
    return float(np.linalg.norm(a - b) / max(np.linalg.norm(b), 1e-300))
