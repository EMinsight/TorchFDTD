from __future__ import annotations

import json
import math
import threading
import time
from dataclasses import dataclass,field
from functools import cached_property
from pathlib import Path

import fdtd
import numpy as np
import torch
from fdtd.backend import NumpyBackend

from .waveforms import TAIL_INNER, TAIL_OUTER, pulse_parameters, source_time_signal
from .models import Project
from .boundaries import YeeGrid
from .materials import configure_materials, permittivity
from .spectra import point_spectrum, apodization_window
from .mesh import configure_auto_mesh, mesh_summary
from .field_monitors import FrequencyPlane,FrequencyUpdates,monitor_memory

C0 = 299792458.0
# fdtd changes a process-global backend and torch default dtype.
ENGINE_LOCK = threading.Lock()


def hardware():
    cuda = torch.cuda.is_available()
    return {'cuda': cuda, 'gpu': torch.cuda.get_device_name(0) if cuda else None,
            'gpu_memory_gb': round(torch.cuda.get_device_properties(0).total_memory / 2**30, 1) if cuda else 0,
            'torch': torch.__version__, 'engine': 'TorchFDTD Yee/CPML on fdtd grid', 'cpu_threads': torch.get_num_threads()}


def field_axes(region, component):
    """Physical Yee locations: E along its own edge, H on its dual face."""
    axis = 'xyz'.index(component[1].lower())
    offsets = [(.5 if i == axis else 0.) if component[0] == 'E' else (0. if i == axis else .5) for i in range(3)]
    # Nodal axes ending on a PMC/symmetric wall keep that stored upper node.
    from .boundaries import pmc_faces
    upper = pmc_faces(region)[1]
    return [np.array([0.]) if region.dimension == '2d' and i == 2 else
            (nodes[:-1]+nodes[1:])/2 if offsets[i] else (nodes if i in upper else nodes[:-1])
            for i,nodes in enumerate(region.mesh_nodes)]


def voxelize(p: Project, *, with_ownership=False, interface_plan=None):
    from .tensor_project import uses_tensor
    if uses_tensor(p):
        raise ValueError('Tensor materials require tensor_from_project().rasterize(), not scalar Yee voxelization.')
    if p.region.interface_method=='subpixel':
        from .subpixel import prepare_interfaces
        plan=interface_plan if interface_plan is not None else prepare_interfaces(p)
        return (plan.epsilon,plan.counts,plan.ownership) if with_ownership else (plan.epsilon,plan.counts)
    if p.region.material_sampling == 'yee':
        parts = [_voxelize_at(p, field_axes(p.region, component), with_ownership) for component in ('Ex','Ey','Ez')]
        # Every component shares one extended array. Half-cell axes have no
        # upper PMC sample, so their padding row is inert edge replication.
        from .boundaries import material_shape
        target = material_shape(p.region)
        def padded(array):
            width = [(0, t-n) for n, t in zip(array.shape, target)]
            return np.pad(array, width, mode='edge') if any(w for _, w in width) else array
        eps = np.stack([padded(part[0]) for part in parts], axis=-1)
        counts = {key:max(part[1].get(key,0) for part in parts) for key in parts[0][1]}
        return (eps,counts,np.stack([padded(part[2]) for part in parts],axis=-1)) if with_ownership else (eps,counts)
    r = p.region
    from .boundaries import pmc_faces
    upper = pmc_faces(r)[1]
    axes = [np.r_[(np.arange(n) + .5) * r.mesh - s / 2, [s / 2]] if i in upper else (np.arange(n) + .5) * r.mesh - s / 2
            for i, (n, s) in enumerate(zip(r.shape, r.actual_size))]
    if r.dimension == '2d':
        axes[2] = np.array([0.])
    return _voxelize_at(p, axes, with_ownership)


def _voxelize_at(p, axes, with_ownership):
    from .geometry import contains,object_bounds
    r = p.region
    shape = tuple(len(axis) for axis in axes)
    eps = np.full(shape, r.background_index**2, dtype=np.float64 if r.precision == 'float64' else np.float32)
    active = {obj.material for obj in p.structures if obj.enabled}
    materials = {m.name: (i, m.instantaneous_epsilon) for i, m in enumerate(p.materials) if m.name in active}
    ownership = np.full(shape, -1, dtype=np.int32) if with_ownership else None
    counts = {}
    # Lower mesh order wins. At equal order, the later tree object wins.
    for obj in sorted(p.structures, key=lambda s: -s.mesh_order):
        if not obj.enabled:
            continue
        center,size=object_bounds(obj)
        # Restrict analytic membership to the solid's conservative support.
        # This changes preparation work, never the Yee grid or time stepping.
        slices=[]
        for axis,c,span in zip(axes,center,size):
            tol=128*np.finfo(float).eps*max(abs(c),span,1e-300)
            slices.append(slice(int(np.searchsorted(axis,c-span/2-tol,'left')),
                                int(np.searchsorted(axis,c+span/2+tol,'right'))))
        slices=tuple(slices)
        if any(s.start==s.stop for s in slices):
            counts[obj.id]=0
            continue
        xyz=np.meshgrid(*(axis[s] for axis,s in zip(axes,slices)),indexing='ij',sparse=True)
        mask=contains(obj,*xyz)
        material_id, epsilon = materials[obj.material]
        eps[slices][mask] = epsilon
        if ownership is not None:
            ownership[slices][mask] = material_id
        counts[obj.id] = int(np.count_nonzero(mask))
    return (eps, counts, ownership) if with_ownership else (eps, counts)


def index_at(center, region, component=None):
    if component and region.material_sampling == 'yee':
        return tuple(int(np.argmin(abs(axis-c))) for axis,c in zip(field_axes(region,component),center))
    return tuple(0 if n == 1 else min(n-1, max(0, int(math.floor((v+s/2)/region.mesh))))
                 for v, s, n in zip(center, region.actual_size, region.shape))


def source_slice(src, r):
    if src.kind == 'point':
        return index_at(src.center, r, src.component)
    if r.material_sampling == 'yee':
        parts=[]
        for axis,c,span,n in zip(field_axes(r,src.component),src.center,src.size,r.shape):
            if n == 1: parts.append(slice(0,1))
            elif span == 0:
                k=int(np.argmin(abs(axis-c)));parts.append(slice(k,k+1))
            else:
                indices=np.flatnonzero((axis>=c-span/2-1e-12)&(axis<=c+span/2+1e-12))
                if len(indices)==0:raise ValueError(f'{src.name} is smaller than one mesh cell.')
                parts.append(slice(int(indices[0]),int(indices[-1])+1))
        return tuple(parts)
    parts = []
    for c, span, total, n in zip(src.center, src.size, r.actual_size, r.shape):
        if n == 1:
            parts.append(slice(0, 1))
        elif span == 0:
            k = min(n-1, max(0, int((c+total/2)/r.mesh)))
            parts.append(slice(k, k+1))
        else:
            # Select cell centres inside the requested support, not a diagonal line.
            lo = max(0, int(math.ceil((c-span/2+total/2)/r.mesh-.5)))
            hi = min(n, int(math.floor((c+span/2+total/2)/r.mesh-.5))+1)
            if hi <= lo:
                raise ValueError(f'{src.name} is smaller than one mesh cell.')
            parts.append(slice(lo, hi))
    return tuple(parts)


def source_profile(src, loc, region):
    """Apply the fundamental Bloch spatial phase to an E or H sheet."""
    if src.kind != 'plane' or not region.complex_fields:
        return None
    phase = 0.0
    for axis, (n, span) in enumerate(zip(region.shape, region.actual_size)):
        if n > 1 and region.boundaries.pair(axis)[0].kind == 'bloch':
            coords = (field_axes(region,src.component)[axis] if region.material_sampling == 'yee' else (np.arange(n)+.5)*region.mesh-span/2)[loc[axis]]
            shape = [1, 1, 1]
            shape[axis] = len(coords)
            phase = phase + (region.bloch_phase[axis]*(coords-src.center[axis])/span).reshape(shape)
    return np.exp(1j*phase)


def estimate(p: Project, *, endpoint_dispatch=True):
    """Native resident estimate. PMC projects describe the endpoint dispatch unless
    endpoint_dispatch is False, which describes the volume-plus-face Yee grid."""
    from .tensor_project import uses_tensor
    if uses_tensor(p):
        from .tensor_native import estimate_tensor
        return estimate_tensor(p)
    from .endpoint_native import uses_endpoint, estimate_endpoint
    if endpoint_dispatch and uses_endpoint(p.region):return estimate_endpoint(p)
    configure_auto_mesh(p)
    r = p.region
    n = math.prod(r.shape)
    from .boundaries import material_shape
    stored = math.prod(material_shape(r))
    dt = r.time_step
    active_materials = [m for m in p.materials if any(s.enabled and s.material == m.name for s in p.structures)]
    warnings = list(p.import_provenance.differences) if p.import_provenance else []
    if r.memory_mode == 'streamed':
        warnings.append('Streamed scenes run through the workbench streamed path or the Python StreamedSimulation API. This estimate describes resident storage, not streamed budget admission.')
    for material in active_materials:
        if material.fit_dt_s is not None and not math.isclose(material.fit_dt_s,dt,rel_tol=1e-10,abs_tol=0):
            warnings.append(f'{material.name}: ADE-target material was fitted at a different timestep. Refit or inspect the numerical n/k error at the current timestep.')
        if material.samples is not None and material.fit_band_um is None:
            warnings.append(f'{material.name}: optical samples are retained but no fitted wavelength band is recorded. Inspect the model/data error before quantitative use.')
    for source in p.sources:
        s = p.resolved_source(source)
        shortest = s.wavelength_start if s.time_definition in ('wavelength','frequency') else s.wavelength
        wavelengths = np.linspace(s.wavelength_start, s.wavelength_stop, 201) if s.time_definition in ('wavelength','frequency') else np.array([s.wavelength])
        if s.enabled:
            for material in active_materials:
                if material.fit_band_um is not None:
                    low,high=material.fit_band_um
                    if s.pulse=='sampled':
                        warnings.append(f'{material.name}: supplied time signal may extend beyond its material fit band ({low:g}–{high:g} um). Inspect its spectrum.')
                    elif min(wavelengths)<low or max(wavelengths)>high:
                        warnings.append(f'{s.name}: source wavelength lies outside {material.name} fit band ({low:g}–{high:g} um). Extrapolated material accuracy is not validated.')
        max_n = max([r.background_index] + [float(np.max(abs(np.sqrt(permittivity(m, C0/(wavelengths*1e-6)))))) for m in active_materials])
        finest=max(r.axis_steps[:2 if r.dimension=='2d' else 3])
        if s.enabled and shortest / (max_n*finest) < 15:
            warnings.append(f'{s.name}: only {shortest/(max_n*finest):.1f} cells per material wavelength on the least-resolved fine axis. Run a mesh convergence study (15+ recommended).')
        if s.enabled and r.mesh_type=='graded' and shortest/(r.background_index*finest)<r.mesh_ppw:
            warnings.append(f'{s.name}: fine mesh step is too large to reach {r.mesh_ppw:g} background cells per wavelength. Reduce the fine step to achieve that target.')
        width, offset = pulse_envelope_parameters(s)
        tail_width=(TAIL_OUTER if s.eliminate_discontinuities else TAIL_INNER)*width
        if s.enabled and s.pulse in ('gaussian','broadband') and r.steps*dt < offset + tail_width:
            warnings.append(f'{s.name}: simulation ends before the Gaussian pulse tail. Increase simulation time.')
        if s.enabled and s.pulse == 'sampled' and r.steps*dt < s.signal.time_s[-1]:
            warnings.append(f'{s.name}: simulation ends before the supplied source time table. Increase simulation time to include the complete signal.')
    if not any(s.enabled for s in p.sources):
        warnings.append('No enabled sources: the fields will remain zero.')
    dispersive = [m for m in active_materials if m.oscillators]
    max_poles = max((len(m.oscillators) for m in dispersive), default=0)
    if dispersive:
        warnings.append('Dispersive materials use passive isotropic trapezoidal ADE. The epsilon field image stores epsilon-infinity; inspect wavelength-dependent n/k in Materials. Resolve skin depth and resonance with a mesh/time convergence study.')
    if r.material_sampling == 'cell' and any(m.model == 'drude' and any(s.enabled and s.material == m.name and s.kind != 'rectangle' for s in p.structures) for m in dispersive):
        warnings.append('Drude curved-interface accuracy is not established for legacy shared-cell staircase sampling. Compare physical Yee sampling and refine space/time before using quantitative results.')
    if any(r.boundaries.pair(i)[0].kind in ('periodic', 'bloch') for i in range(2 if r.dimension == '2d' else 3)):
        warnings.append('Periodic/Bloch cells repeat every structure and source. A point source represents an array of sources, not an isolated dipole.')
    if r.complex_fields:
        warnings.append('Bloch runs retain complex fields and traces. Display selection affects snapshots only; NPZ retains real and imaginary parts.')
    for m in p.monitors:
        m=p.resolved_monitor(m)
        if not m.enabled:
            continue
        if m.spectrum.apodization in ('start', 'end', 'full'):
            warnings.append(f'{m.name}: apodized fields are not source-normalized power or absolute intensity.')
            if m.spectrum.apodization == 'start' and m.spectrum.apodization_center > r.steps*dt:
                warnings.append(f'{m.name}: start-apodization center is beyond the simulation end.')
    if r.mesh_type == 'graded':
        warnings.append('Graded rectilinear mesh coarsens background gaps and retains the fine timestep. Refinement boxes project across each coordinate axis. Check convergence against a uniform Yee mesh, especially near resonances and thin features.')
    interface_bytes=0
    if r.interface_method=='subpixel':
        real_bytes=8 if r.precision=='float64' else 4
        field_bytes=real_bytes*(2 if r.complex_fields else 1)
        interface_bytes=n*(3*8*(field_bytes+4)+24+3*field_bytes)
        warnings.append('Subpixel uses a bounded symmetric edge/face operator on lossless uniform-axis grids. The epsilon image shows only its reciprocal diagonal. Check face-quadrature and mesh convergence, especially at corners, overlaps and unresolved thin features.')
    from .injection import oneway_metadata
    planes=[oneway_metadata(s,r) for s in p.sources if s.enabled and s.injection=='oneway' and s.kind!='tfsf']
    if planes:
        warnings.append('One-way planes retain the eight-cell incident-line delay and discrete dispersion. Amplitude scales the incident-line drive. The opposite side contains scattered fields. Check incident PML layer convergence for very small reflections.')
    from .tfsf import tfsf_metadata
    boxes=[tfsf_metadata(s,r) for s in p.sources if s.enabled and s.kind=='tfsf']
    auxiliary_bytes=0
    for box in boxes:
        spans=[h-l+1 for l,h in zip(box['lower_node_indices'],box['upper_node_indices'])]
        # Conservative surface-map bound includes both index tables and real
        # weights. The live auxiliary line has linear, not time-surface memory.
        surface=24*sum(math.prod(spans[b] for b in range(3) if b!=a) for a in range(2 if r.dimension=='2d' else 3))
        real_bytes=8 if r.precision=='float64' else 4
        auxiliary_bytes+=surface*(16+real_bytes)+(10*box['incident_line_cells']+r.steps)*real_bytes
    if boxes:warnings.append('TFSF boxes use normal-incidence live Yee lines and a homogeneous background shell. Inside is total field, outside is scattered field. Amplitude scales the auxiliary soft drive. Check incident PML, mesh and time convergence before quantitative scattering.')
    return {**mesh_summary(p), 'shape': r.shape, 'actual_size_um':r.actual_size, 'cells': n, 'dt_fs': dt*1e15, 'duration_fs': dt*r.steps*1e15,
            'estimated_memory_mb': round((stored * ((400 if r.precision == 'float64' else 200)+(160 if r.precision == 'float64' else 80)*max_poles)*(2 if r.complex_fields else 1)+monitor_memory(p)+auxiliary_bytes+interface_bytes)/2**20, 1),
            'warnings': warnings, 'oneway_planes':planes,'tfsf_boxes':boxes,'tfsf_auxiliary_estimated_bytes':auxiliary_bytes}


def pulse_envelope_parameters(source):
    p = pulse_parameters(source)
    return p.sigma_s, p.offset_s


def run_signature(p: Project, steps):
    """Physical identity of a run for matched frequency-plane references.

    Execution placement (backend, kernels, execution mode) and display settings
    are excluded, so resident and streamed runs of one scene share a signature."""
    import hashlib
    r = p.region
    config = dict(region=r.model_dump(exclude={'backend','cuda_kernel','cuda_monitor_kernel','execution_mode','tiling','field','slice_axis','slice_position','complex_display','snapshot_interval'}),
                  sources=[p.resolved_source(s).model_dump() for s in p.sources], steps=steps,
                  nodes=[a.tolist() for a in r.mesh_nodes])
    return hashlib.sha256(json.dumps(config, sort_keys=True).encode()).hexdigest()


@dataclass
class Result:
    project: Project
    summary: dict
    frames: np.ndarray
    frame_steps: np.ndarray
    epsilon: np.ndarray
    signals: np.ndarray
    times: np.ndarray
    electric: np.ndarray
    magnetic: np.ndarray
    frequency_fields: list[dict] = field(default_factory=list)
    endpoint_fields: dict | None = None

    @property
    def point_monitors(self):
        return [self.project.resolved_monitor(m) for m in self.project.monitors if m.enabled and m.kind=='point']

    @cached_property
    def spectra(self):
        # H is sampled after its half-step update, E after its full-step update.
        dt = self.times[1]-self.times[0] if len(self.times)>1 else 0
        return [point_spectrum((self.times + (dt/2 if m.component.startswith('H') else 0))[::m.time_downsample], self.signals[::m.time_downsample, k], m.spectrum)
                for k, m in enumerate(self.point_monitors)]

    def save(self, path):
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        spectral_arrays = {}
        metadata = []
        for k, (m, spec) in enumerate(zip(self.point_monitors, self.spectra)):
            spectral_arrays[f'monitor_{k}_frequency_hz'] = spec['frequency_hz']
            spectral_arrays[f'monitor_{k}_spectrum'] = spec['value']
            metadata.append({'id': m.id, 'name': m.name, 'component': m.component,
                             'settings': m.spectrum.model_dump(), 'units': spec['units'], 'transform': spec['transform']})
        plane_metadata=[]
        for k,result in enumerate(self.frequency_fields):
            plane_metadata.append({key:v for key,v in result.items() if not isinstance(v,np.ndarray)})
            for key,v in result.items():
                if isinstance(v,np.ndarray):spectral_arrays[f'field_monitor_{k}_{key}']=v
        if self.endpoint_fields is not None:
            spectral_arrays.update({'endpoint_'+key:value for key,value in self.endpoint_fields.items()})
        np.savez_compressed(path, project=self.project.model_dump_json(), summary=json.dumps(self.summary),
                            field_monitors=json.dumps(plane_metadata),
                            **{f'mesh_{a}_um': nodes for a,nodes in zip('xyz',self.project.region.mesh_nodes)},
                            frames=self.frames, frame_steps=self.frame_steps, epsilon=self.epsilon,
                            signals=self.signals, times=self.times, E=self.electric, H=self.magnetic,
                            monitor_spectra=json.dumps(metadata), **spectral_arrays)

    def monitor_data(self):
        output = []
        monitors = self.point_monitors
        dt = self.times[1]-self.times[0] if len(self.times)>1 else 1
        for k, m in enumerate(monitors):
            signal = self.signals[:, k]
            complex_signal = np.iscomplexobj(signal)
            spec = self.spectra[k]
            f, value = spec['frequency_hz'], spec['value']
            times = self.times + (dt/2 if m.component.startswith('H') else 0)
            stride = max(1, len(signal)//2000)
            output.append({'id': m.id, 'name': m.name, 'component': m.component,
                           'time_fs': (times[::stride]*1e15).tolist(), 'signal': signal[::stride].real.tolist(),
                           'signal_imag': signal[::stride].imag.tolist(), 'complex': complex_signal,
                           'window': apodization_window(times, m.spectrum)[::stride].tolist(),
                           'frequency_thz': (f*1e-12).tolist(), 'wavelength_um': (C0/f*1e6).tolist(),
                           'spectrum': abs(value).tolist(), 'spectrum_real': value.real.tolist(), 'spectrum_imag': value.imag.tolist(),
                           'spectrum_units': spec['units'], 'transform': spec['transform'], 'spectrum_settings': m.spectrum.model_dump()})
        return output

    @classmethod
    def load(cls, path):
        """Load our NPZ result without pickle or an installed CAD application."""
        with np.load(path, allow_pickle=False) as data:
            planes = json.loads(str(data['field_monitors'])) if 'field_monitors' in data else []
            for k, plane in enumerate(planes):
                prefix = f'field_monitor_{k}_'
                plane.update({key[len(prefix):]: data[key].copy() for key in data.files if key.startswith(prefix)})
            return cls(Project.model_validate_json(str(data['project'])), json.loads(str(data['summary'])),
                       *(data[key].copy() for key in ('frames', 'frame_steps', 'epsilon', 'signals', 'times', 'E', 'H')), planes,
                       {key:data['endpoint_'+key].copy() for key in ('E_upper','H_upper')} if 'endpoint_E_upper' in data else None)

    def field_monitor(self, name_or_id):
        """Return full complex E/H arrays, physical coordinates and signed flux."""
        matches = [m for m in self.frequency_fields if name_or_id in (m['id'], m['name'])]
        if len(matches) != 1:
            raise ValueError('Expected one enabled frequency plane with this name or id.')
        return matches[0]

    def flux_data(self):
        return [dict(id=m['id'],name=m['name'],normal=m['normal_axis'],frequency_thz=(m['frequency_hz']*1e-12).tolist(),
                     wavelength_um=(C0/m['frequency_hz']*1e6).tolist(),flux=m['flux'].tolist(),units=m['flux_units'],
                     points=len(m['weights']),shape=m['shape'],settings=m['settings']) for m in self.frequency_fields if m['flux'] is not None]


class Simulation:
    """Run native Yee/CPML operators on the fdtd CPU/CUDA grid backend.

    Coordinates, spans, wavelength and mesh use micrometres. E/H are the
    solver's reduced fields, not calibrated V/m or A/m.
    """
    def __init__(self, project: Project):
        self.project = Project.model_validate(project.model_dump())
        self.project.region.require_resident()

    def run(self, progress=None, cancel=None, cuda_graph=True, cuda_graph_steps=1):
        with ENGINE_LOCK:
            old_dtype = torch.get_default_dtype()
            try:
                return self._run(progress, cancel, cuda_graph, cuda_graph_steps)
            finally:
                fdtd.set_backend('numpy')
                fdtd.backend.float = np.float64
                torch.set_default_dtype(old_dtype)

    def _run(self, progress, cancel, cuda_graph, cuda_graph_steps):
        from .tensor_project import uses_tensor
        if uses_tensor(self.project):
            from .tensor_native import run_tensor
            return run_tensor(self.project, progress, cancel)
        from .endpoint_native import uses_endpoint, run_endpoint
        if uses_endpoint(self.project.region):return run_endpoint(self.project,progress,cancel)
        from .cuda_graph import CudaStepGraphs, observation_schedule, validate_graph_steps
        p, r = self.project, self.project.region
        r.require_resident()
        use_cuda = r.backend == 'cuda' or (r.backend == 'auto' and torch.cuda.is_available())
        validate_graph_steps(cuda_graph_steps, use_cuda and cuda_graph)
        if use_cuda and not torch.cuda.is_available():
            raise RuntimeError('CUDA requested but unavailable. Install a CUDA-enabled PyTorch build or choose CPU.')
        if use_cuda and r.cuda_kernel == 'fused' and r.complex_fields:
            # The same refusal as FusedYeeCUDA, before the grid is allocated.
            raise ValueError('The fused CUDA kernel currently supports real fields. Select cuda_kernel="torch" for Bloch fields.')
        stats = estimate(p)
        if use_cuda:
            free, _ = torch.cuda.mem_get_info()
            if stats['estimated_memory_mb']*2**20 > free*.75:
                raise ValueError('Insufficient free GPU memory. Increase mesh spacing or reduce the domain.')
        dtype = torch.float64 if r.precision == 'float64' else torch.float32
        fdtd.set_backend(f'torch.cuda.{r.precision}' if use_cuda else 'numpy')
        # Upstream 0.2.2 leaves a dtype class attribute behind on backend switches.
        fdtd.backend.float = dtype if use_cuda else (np.float64 if r.precision == 'float64' else np.float32)
        if not use_cuda:
            cpu_dtype = np.float64 if r.precision == 'float64' else np.float32
            class PrecisionNumpyBackend(NumpyBackend):
                @staticmethod
                def zeros(shape, dtype=None):
                    return np.zeros(shape, dtype=dtype or cpu_dtype)

                @staticmethod
                def ones(shape, dtype=None):
                    return np.ones(shape, dtype=dtype or cpu_dtype)
            fdtd.backend.__class__ = PrecisionNumpyBackend
        started = time.perf_counter()
        from .subpixel import prepare_interfaces,configure_interfaces
        interface_plan=prepare_interfaces(p)
        if interface_plan is not None:stats['subpixel']=interface_plan.metadata
        eps, counts, ownership = voxelize(p, with_ownership=True,interface_plan=interface_plan)
        from .injection import source_terms, validate_oneway_materials
        validate_oneway_materials(p, eps, ownership)
        for obj in p.structures:
            if obj.enabled and counts.get(obj.id) == 0:
                message='no Yee component centers intersect this object; subpixel integration may still include it. Check quadrature and mesh convergence.' if interface_plan is not None else 'no cells intersect this object. Refine mesh or reposition it.'
                stats['warnings'].append(f'{obj.name}: {message}')
        g = YeeGrid(r)
        if use_cuda:
            g.inverse_permittivity[:] = torch.as_tensor(1/(eps if eps.ndim == 4 else eps[..., None]), device='cuda', dtype=dtype)
        else:
            g.inverse_permittivity[:] = 1/(eps if eps.ndim == 4 else eps[..., None])
        configure_materials(g, p, ownership)
        configure_interfaces(g,interface_plan)
        from .cuda_kernels import configure_cuda_kernel
        configure_cuda_kernel(g, r.cuda_kernel)
        from .tfsf import prepare_tfsf,TfsfInjection
        prepare_tfsf(g,p,eps,ownership)
        from .run_control import StateDiagnostics, DecayDecision, source_end_time
        control = r.run_control
        diagnostics = StateDiagnostics(g) if control.auto_shutoff or control.divergence_check else None
        source_end = source_end_time(p)
        decision = DecayDecision(control, source_end, g.time_step)
        if control.auto_shutoff and not math.isfinite(source_end):
            stats['warnings'].append('Automatic decay shutoff is inactive while a continuous source is enabled.')
        sources = {'E': [], 'H': []}
        for source in p.sources:
            for field, loc, values, profile in source_terms(p, source):
                if isinstance(profile, np.ndarray):
                    profile = torch.as_tensor(profile, device='cuda', dtype=g.E.dtype) if use_cuda else profile.astype(g.E.dtype)
                values = torch.as_tensor(values, device='cuda', dtype=dtype) if use_cuda else values.astype(g.E.real.dtype)
                sources[field[0]].append((values, loc, 'xyz'.index(field[1].lower()), profile))
        monitors = [(m, index_at(m.center, r, m.component), 'xyz'.index(m.component[1].lower())) for m in p.monitors if m.enabled and m.kind=='point']
        frequency_monitors=[FrequencyPlane(g,p.resolved_monitor(m)) for m in p.monitors if m.enabled and m.kind=='field']
        frequency_updates=FrequencyUpdates(frequency_monitors)
        if use_cuda:
            counter = torch.zeros(1, device='cuda', dtype=torch.long)
            traces = torch.zeros((r.steps, len(monitors)), device='cuda', dtype=g.E.dtype)
        else:
            counter = np.zeros(1, dtype=np.int64)
            traces = np.zeros((r.steps, len(monitors)), dtype=g.E.dtype)

        tfsf=TfsfInjection([g],counter,fused=use_cuda and r.cuda_kernel=='fused')

        def inject(family):
            field=g.E if family=='E' else g.H
            for values, loc, component, profile in sources[family]:
                value = values.index_select(0, counter)[0] if use_cuda else values[counter[0]]
                field[loc+(component,)] += value if profile is None else value*profile
            tfsf.inject(family)

        def step():
            g.update_E()
            inject('E')
            g.update_H()
            inject('H')
            frequency_updates.update(counter)
            if monitors:
                values = [(g.E if m.component[0] == 'E' else g.H)[loc+(comp,)] for m,loc,comp in monitors]
                if use_cuda:
                    traces.index_copy_(0, counter, torch.stack(values).reshape(1, -1))
                else:
                    traces[counter[0]] = values
            counter.add_(1) if use_cuda else np.add(counter, 1, out=counter)

        graph = None
        setup_warnings = []
        if use_cuda and cuda_graph:
            # Capture a complete native Yee + CPML step, including tensor-time
            # sources and monitor recording. Coefficients stay fixed on device.
            states = [g.E, g.H, counter, traces]
            states += g.memory_states
            graph = CudaStepGraphs(step, states, r.steps, cuda_graph_steps)
        axis = 'xyz'.index(r.slice_axis)
        plane_index = index_at(tuple(r.slice_position if i == axis else 0 for i in range(3)), r, r.field)[axis]
        component = 'xyz'.index(r.field[1].lower())
        display_indices = None
        if r.mesh_type != 'uniform':
            display_indices = []
            for i, coords in enumerate(field_axes(r,r.field)):
                if i == axis: continue
                count = min(256, r.base_shape[i])
                pixels = (np.arange(count)+.5)*r.actual_size[i]/count-r.actual_size[i]/2
                nearest = np.abs(coords[:,None]-pixels).argmin(axis=0)
                display_indices.append(torch.as_tensor(nearest,device='cuda') if use_cuda else nearest)
        def host(a):
            return a.detach().cpu().numpy().copy() if use_cuda else np.asarray(a).copy()
        def plane(a):
            sl = [slice(None)]*3
            sl[axis] = plane_index
            data = a[tuple(sl)]
            if display_indices is not None:
                indices = display_indices if isinstance(data,torch.Tensor) else [v.cpu().numpy() if isinstance(v,torch.Tensor) else v for v in display_indices]
                return data[indices[0][:,None],indices[1][None,:]]
            return data[::max(1, math.ceil(data.shape[0]/256)), ::max(1, math.ceil(data.shape[1]/256))]
        eps_plane = plane(eps[...,component] if eps.ndim == 4 else eps)
        interval = max(r.snapshot_interval, math.ceil(r.steps/100))
        frames, frame_steps = [], []
        if use_cuda:
            torch.cuda.synchronize()
        setup_seconds = time.perf_counter()-started
        compute_start = time.perf_counter()
        completed = 0
        termination_reason = 'max_steps'
        diagnostic_seconds = 0.
        barriers = set(range(interval, r.steps+1, interval))
        if diagnostics is not None:
            barriers.update(range(control.check_interval, r.steps+1, control.check_interval))
        width = graph.width if graph is not None else 1
        graph_replays = 0
        with torch.no_grad():
            for target, advance in observation_schedule(r.steps, width, barriers):
                if cancel is not None and cancel.is_set():
                    termination_reason = 'cancelled'
                    break
                graph.replay(advance) if graph is not None else step()
                graph_replays += graph is not None
                completed = target
                stop = False
                if diagnostics is not None and (completed % control.check_interval == 0 or completed == r.steps):
                    diagnostic_start = time.perf_counter()
                    try:
                        stop = decision.update(completed, *diagnostics.measure())
                    except FloatingPointError as exc:
                        raise FloatingPointError(f'{exc} (diagnostic step {completed})') from exc
                    diagnostic_seconds += time.perf_counter()-diagnostic_start
                if stop:
                    termination_reason = 'decayed'
                if completed % interval == 0 or completed == r.steps or stop:
                    field = host(plane((g.E if r.field[0] == 'E' else g.H)[..., component]))
                    if not np.isfinite(field).all():
                        raise FloatingPointError('Fields diverged. Check mesh, sources and precision.')
                    field = {'real': np.real, 'imag': np.imag, 'magnitude': np.abs, 'phase': np.angle}[r.complex_display](field)
                    frames.append(field)
                    frame_steps.append(completed)
                    if progress:
                        progress({'step': completed, 'total': r.steps, 'frame': field.tolist(),
                                  'elapsed': time.perf_counter()-compute_start,
                                  'termination_reason': termination_reason if stop else None,
                                  'diagnostics': decision.history[-1] if decision.history else None})
                if stop:
                    break
        if use_cuda:
            torch.cuda.synchronize()
        seconds = time.perf_counter()-compute_start
        e, h = host(g.E), host(g.H)
        if not np.isfinite(e).all() or not np.isfinite(h).all():
            raise FloatingPointError('Non-finite fields detected.')
        stats.update(backend='cuda' if use_cuda else 'cpu', precision=r.precision,
                     gpu=torch.cuda.get_device_name() if use_cuda else None, cuda_graph=graph is not None,
                     cuda_graph_steps=width, cuda_graph_replays=graph_replays,
                     cuda_kernel=r.cuda_kernel if use_cuda else None,
                     cuda_monitor_kernel=r.cuda_monitor_kernel if use_cuda else None,
                     steps=completed, requested_steps=r.steps, cancelled=termination_reason=='cancelled',
                     termination_reason=termination_reason, auto_shutoff=termination_reason=='decayed',
                      diagnostics=decision.history, diagnostic_seconds=diagnostic_seconds,
                      diagnostic_backend=diagnostics.backend if diagnostics is not None else None,
                     source_end_s=source_end if math.isfinite(source_end) else None,
                     seconds=seconds, setup_seconds=setup_seconds,
                     mcells_per_second=math.prod(r.shape)*completed/max(seconds, 1e-9)/1e6,
                     field_peak=float(np.max(np.abs(e))), slice_index=plane_index,
                     slice_position=float(field_axes(r,r.field)[axis][plane_index]) if r.material_sampling=='yee' else (0 if r.dimension=='2d' else (plane_index+.5)*r.mesh-r.actual_size[axis]/2),
                     complex_fields=r.complex_fields, complex_display=r.complex_display,
                     material_update='trapezoidal ADE' if g.material_states else 'nondispersive',
                     dispersive_samples=sum(state.P.numel() if use_cuda else state.P.size for state in g.material_states),
                     material_sampling=r.material_sampling,
                     epsilon_definition=interface_plan.metadata['epsilon_image'] if interface_plan is not None else 'instantaneous relative permittivity (epsilon-infinity for dispersive cells)',
                     boundaries=r.boundaries.model_dump(), bloch_phase=r.bloch_phase,
                     units='geometry: um; time: s; E/H: reduced fields; Bloch phase: rad', engine='TorchFDTD Yee/CPML on fdtd grid')
        frequency_results=[m.result() for m in frequency_monitors]
        if frequency_results:
            signature=run_signature(p,completed)
            for m in frequency_results:m['run_signature']=signature
        return Result(p, stats, np.array(frames), np.array(frame_steps), eps_plane,
                      host(traces[:completed]), np.arange(1,completed+1)*g.time_step, e,h,frequency_results)
