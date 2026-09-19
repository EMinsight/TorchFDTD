from __future__ import annotations

import json
import math
import pprint
from pathlib import Path
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field, PrivateAttr, model_validator
from .optical_data import OpticalData


class Model(BaseModel):
    model_config = ConfigDict(extra='forbid', allow_inf_nan=False)


class LorentzPole(Model):
    """Passive oscillator A / (omega_0**2 - omega**2 - i*gamma*omega).

    A zero resonance gives a Drude pole. All rates are angular SI units.
    """
    resonance_rad_s: float = Field(default=2e15, ge=0, le=1e18)
    strength_rad_s_squared: float = Field(default=4e30, gt=0, le=1e40)
    damping_rad_s: float = Field(default=1e14, ge=0, le=1e18)

    @property
    def coefficients(self):
        return self.resonance_rad_s, self.strength_rad_s_squared, self.damping_rad_s


class Material(Model):
    name: str = Field(min_length=1, max_length=100)
    index: float = Field(default=1.5, ge=1, le=20)
    color: str = '#6ca8dd'
    model: Literal['dielectric', 'drude', 'lorentz', 'multipole'] = 'dielectric'
    epsilon_inf: float = Field(default=1, ge=1, le=400)
    plasma_rad_s: float = Field(default=2e15, gt=0, le=1e18)
    collision_rad_s: float = Field(default=1e14, ge=0, le=1e18)
    resonance_rad_s: float = Field(default=2e15, gt=0, le=1e18)
    linewidth_rad_s: float = Field(default=1e14, ge=0, le=1e18)
    delta_epsilon: float = Field(default=1, gt=0, le=10000)
    poles: list[LorentzPole] = Field(default_factory=list, max_length=16)
    samples: OpticalData | None = None
    fit_band_um: tuple[float,float] | None = None
    fit_dt_s: float | None = Field(default=None,gt=0)

    @model_validator(mode='after')
    def valid_poles(self):
        if self.model == 'multipole' and not self.poles:
            raise ValueError('A multipole material requires at least one passive pole.')
        if self.fit_band_um is not None:
            low,high=self.fit_band_um
            if self.samples is None or not 0<low<high or low<self.samples.wavelength_um[0] or high>self.samples.wavelength_um[-1]:
                raise ValueError('A fitted band must lie inside the retained optical data.')
            if sum(low<=w<=high for w in self.samples.wavelength_um)<3:
                raise ValueError('A fitted band must contain at least three optical samples.')
        if self.fit_dt_s is not None and self.fit_band_um is None:
            raise ValueError('An ADE-target fit timestep requires a fitted wavelength band.')
        return self

    @property
    def instantaneous_epsilon(self):
        return self.index**2 if self.model == 'dielectric' else self.epsilon_inf

    @property
    def oscillator(self):
        """Legacy single-pole accessor. Use oscillators for general materials."""
        if self.model == 'drude':
            return 0., self.plasma_rad_s**2, self.collision_rad_s
        if self.model == 'lorentz':
            return self.resonance_rad_s, self.delta_epsilon*self.resonance_rad_s**2, 2*self.linewidth_rad_s
        return None

    @property
    def oscillators(self):
        if self.model == 'multipole':
            return tuple(pole.coefficients for pole in self.poles)
        return (self.oscillator,) if self.oscillator else ()


class BoundaryFace(Model):
    kind: Literal['pml', 'periodic', 'bloch'] = 'pml'
    layers: int | None = Field(default=None, ge=3, le=100)
    # Dimensionless native CPML coefficients, not Lumerical's normalized values.
    sigma_scale: float = Field(default=1, gt=0, le=20)
    kappa: float = Field(default=1, ge=1, le=50)
    alpha: float = Field(default=1e-8, ge=0, le=5)
    polynomial: float = Field(default=3, ge=1, le=10)
    alpha_polynomial: float = Field(default=0, ge=0, le=10)


class Boundaries(Model):
    x_min: BoundaryFace = Field(default_factory=BoundaryFace)
    x_max: BoundaryFace = Field(default_factory=BoundaryFace)
    y_min: BoundaryFace = Field(default_factory=BoundaryFace)
    y_max: BoundaryFace = Field(default_factory=BoundaryFace)
    z_min: BoundaryFace = Field(default_factory=BoundaryFace)
    z_max: BoundaryFace = Field(default_factory=BoundaryFace)

    def pair(self, axis):
        return tuple(getattr(self, 'xyz'[axis] + '_' + side) for side in ('min', 'max'))


class MeshRefinement(Model):
    name: str = Field(default='Refinement', min_length=1, max_length=100)
    center: tuple[float,float,float] = (0,0,0)
    size: tuple[float,float,float] = (1,1,1)
    enabled: bool = True

    @model_validator(mode='after')
    def positive_size(self):
        if any(v<=0 for v in self.size):raise ValueError('Refinement spans must be positive.')
        return self


class RunControl(Model):
    auto_shutoff: bool = False
    decay_threshold: float = Field(default=1e-6, gt=0, lt=1)
    check_interval: int = Field(default=50, ge=1, le=10000)
    consecutive_checks: int = Field(default=3, ge=2, le=100)
    min_steps: int = Field(default=100, ge=10, le=100000)
    source_tail_amplitude: float = Field(default=1e-8, gt=0, le=1e-3)
    after_source_s: float = Field(default=0, ge=0)
    divergence_check: bool = True
    growth_limit: float = Field(default=1e6, gt=1)
    field_limit: float | None = Field(default=None, gt=0)


class Region(Model):
    def __eq__(self,other):
        if not isinstance(other,Region):return NotImplemented
        # Cached NumPy node arrays are derived state and have no scalar truth
        # value. Geometry-dependent refinement context remains part of equality.
        return (type(self) is type(other) and self.model_dump()==other.model_dump()
                and self._auto_boxes==other._auto_boxes and self._coarse_limit==other._coarse_limit)

    dimension: Literal['2d', '3d'] = '2d'
    size: tuple[float, float, float] = (8, 6, 2)
    mesh: float = Field(default=0.05, gt=0, le=10)
    mesh_steps: tuple[float,float,float] | None = None
    mesh_coordinates: tuple[tuple[float,...],tuple[float,...],tuple[float,...]] | None = None
    material_sampling: Literal['cell', 'yee'] = 'cell'
    interface_method: Literal['staircase','subpixel'] = 'staircase'
    subpixel_quadrature: int = Field(default=8,ge=2,le=32)
    mesh_type: Literal['uniform','graded','explicit'] = 'uniform'
    mesh_max: float = Field(default=.15, gt=0, le=10)
    mesh_grading: float = Field(default=1.25, ge=1.05, le=1.5)
    mesh_ppw: float = Field(default=24, ge=6, le=80)
    mesh_auto_refine: bool = True
    mesh_refinements: list[MeshRefinement] = Field(default_factory=list, max_length=64)
    _auto_boxes: tuple = PrivateAttr(default=())
    _coarse_limit: float | None = PrivateAttr(default=None)
    _mesh_cache: object = PrivateAttr(default=None)
    courant_factor: float = Field(default=0.99, gt=0, le=0.99)
    time_step_override: float | None = Field(default=None,gt=0)
    steps: int = Field(default=1000, ge=10, le=100000)
    run_control: RunControl = Field(default_factory=RunControl)
    pml_cells: int = Field(default=10, ge=3, le=50)
    boundaries: Boundaries = Field(default_factory=Boundaries)
    bloch_phase: tuple[float, float, float] = (0, 0, 0)  # radians per positive unit-cell translation
    background_index: float = Field(default=1, ge=1, le=20)
    backend: Literal['auto', 'cuda', 'cpu'] = 'auto'
    cuda_kernel: Literal['torch', 'fused'] = 'torch'
    cuda_monitor_kernel: Literal['torch', 'fused'] = 'torch'
    precision: Literal['float32', 'float64'] = 'float32'
    snapshot_interval: int = Field(default=20, ge=1, le=10000)
    field: Literal['Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz'] = 'Ez'
    slice_axis: Literal['x', 'y', 'z'] = 'z'
    slice_position: float = 0
    complex_display: Literal['real', 'imag', 'magnitude', 'phase'] = 'real'

    @property
    def complex_fields(self):
        return any(self.boundaries.pair(i)[0].kind == 'bloch' for i in range(2 if self.dimension == '2d' else 3))

    def pml_layers(self, axis, side):
        face = self.boundaries.pair(axis)[side]
        return (face.layers or self.pml_cells) if face.kind == 'pml' else 0

    def interior_bounds(self, axis):
        if axis==2 and self.dimension=='2d':return (-self.size[2]/2,self.size[2]/2)
        nodes=self.mesh_nodes[axis];lo=self.pml_layers(axis,0);hi=self.pml_layers(axis,1)
        return (float(nodes[lo]) if lo else -self.actual_size[axis]/2,
                float(nodes[-hi-1]) if hi else self.actual_size[axis]/2)

    @property
    def axis_steps(self):
        if self.mesh_type=='explicit':
            if self.mesh_coordinates is None:raise ValueError('Explicit mesh requires all three coordinate arrays.')
            return tuple(min(b-a for a,b in zip(v,v[1:])) for v in self.mesh_coordinates)
        return self.mesh_steps or (self.mesh,)*3

    @property
    def reference_step(self):
        return min(self.axis_steps[:2 if self.dimension=='2d' else 3])

    @property
    def rectangular_courant(self):
        if self.mesh_steps is None and self.mesh_type!='explicit' and self.time_step_override is None:
            return self.courant_factor/math.sqrt(2 if self.dimension=='2d' else 3)
        return self.time_step*299792458.0/(self.reference_step*1e-6)

    @property
    def base_shape(self):
        # Decimal unit conversions can place an integer ratio a few ulps above
        # its mathematical value. Do not silently add a whole mesh cell.
        def cells(span,step):
            ratio = span / step
            nearest = round(ratio)
            if self.mesh_type=='explicit' and math.isclose(ratio,nearest,rel_tol=1e-10):return max(1,nearest)
            return max(1, nearest if abs(ratio-nearest) <= 8*math.ulp(ratio) else math.ceil(ratio))
        return tuple(cells(s,self.axis_steps[i]) if i < 2 or self.dimension == '3d' else 1 for i, s in enumerate(self.size))

    @property
    def mesh_nodes(self):
        from .mesh import mesh_nodes
        return mesh_nodes(self)

    @property
    def shape(self):
        return self.base_shape if self.mesh_type=='uniform' else tuple(len(a)-1 for a in self.mesh_nodes)

    @property
    def time_step(self):
        return self.time_step_override or self.cfl_time_step

    @property
    def cfl_time_step(self):
        if self.mesh_steps is None and self.mesh_type!='explicit':
            return self.courant_factor / math.sqrt(2 if self.dimension == '2d' else 3) * self.mesh*1e-6 / 299792458.0
        steps=self.axis_steps[:2 if self.dimension=='2d' else 3]
        return self.courant_factor*1e-6/(299792458.0*math.sqrt(sum(1/h**2 for h in steps)))

    @property
    def actual_size(self):
        if self.mesh_type=='explicit':return tuple(v[-1]-v[0] for v in self.mesh_coordinates)
        return tuple(n*self.axis_steps[i] if n>1 else self.size[i] for i,n in enumerate(self.base_shape))

    @model_validator(mode='after')
    def valid_grid(self):
        if any(s <= 0 for s in self.size):
            raise ValueError('Region spans must be positive.')
        if self.mesh_steps is not None and any(not 0<h<=10 for h in self.mesh_steps):
            raise ValueError('Axis mesh steps must be positive and no greater than 10 um.')
        if self.mesh_type=='explicit':
            if self.mesh_coordinates is None:raise ValueError('Explicit mesh requires all three coordinate arrays.')
            for a,nodes in enumerate(self.mesh_coordinates):
                if not 2<=len(nodes)<=1_000_001 or any(v>=w for v,w in zip(nodes,nodes[1:])):
                    raise ValueError('Explicit mesh coordinates must be strictly increasing with at least two nodes.')
                if not math.isclose(nodes[0],-self.size[a]/2,rel_tol=1e-10,abs_tol=1e-12) or not math.isclose(nodes[-1],self.size[a]/2,rel_tol=1e-10,abs_tol=1e-12):
                    raise ValueError('Explicit mesh endpoints must match the centered region spans.')
                if self.dimension=='2d' and a==2 and len(nodes)!=2:
                    raise ValueError('The invariant z axis needs exactly two bounding nodes.')
        if (self.mesh_type!='uniform' or self.mesh_steps is not None) and self.material_sampling=='cell':
            raise ValueError('Graded, explicit and axis-specific meshes require Yee material sampling.')
        if self.interface_method=='subpixel':
            if self.material_sampling!='yee':raise ValueError('Subpixel interfaces require Yee material sampling.')
            if any(any(not math.isclose(b-a,nodes[1]-nodes[0],rel_tol=1e-10,abs_tol=0) for a,b in zip(nodes,nodes[1:])) for nodes in self.mesh_nodes):
                raise ValueError('Subpixel interfaces currently require uniform spacing on each axis. Choose staircase for nonuniform nodes.')
        if self.time_step_override is not None and self.time_step_override>self.cfl_time_step*(1+1e-12):
            raise ValueError('The time-step override exceeds the configured conservative CFL limit.')
        active = self.shape[:2] if self.dimension == '2d' else self.shape
        for axis, n in enumerate(active):
            low, high = self.boundaries.pair(axis)
            if low.kind != high.kind and ({low.kind, high.kind} & {'periodic', 'bloch'}):
                raise ValueError('Periodic/Bloch boundaries must be paired on the same axis.')
            if low.kind != 'bloch' and self.bloch_phase[axis] != 0:
                raise ValueError('A nonzero Bloch phase requires Bloch boundaries on that axis.')
            if n <= self.pml_layers(axis, 0) + self.pml_layers(axis, 1) + 4:
                raise ValueError('Mesh must leave at least 5 cells between the PML boundaries.')
        if self.dimension == '2d' and (any(f.kind != 'pml' for f in self.boundaries.pair(2)) or self.bloch_phase[2] != 0):
            raise ValueError('The invariant z axis has no boundary condition in 2D; keep its defaults.')
        if math.prod(self.shape) > 8_000_000:
            raise ValueError('This workbench limits a job to 8 million cells. Increase mesh spacing.')
        if self.dimension == '2d' and self.slice_axis != 'z':
            raise ValueError('2D simulations use the XY (z-normal) field plane.')
        if abs(self.slice_position) > self.size['xyz'.index(self.slice_axis)] / 2:
            raise ValueError('Field slice must lie inside the simulation region.')
        return self


class Item(Model):
    id: str = Field(default_factory=lambda: uuid4().hex[:12], min_length=1, max_length=100)
    name: str = Field(default='object', min_length=1, max_length=100)
    center: tuple[float, float, float] = (0, 0, 0)
    enabled: bool = True


class Structure(Item):
    kind: Literal['rectangle', 'circle', 'sphere', 'ring', 'polygon'] = 'rectangle'
    size: tuple[float, float, float] = (1, 1, 0.5)
    radius: float = Field(default=0.5, gt=0)
    inner_radius: float = Field(default=0.3, ge=0)
    rotation: float = 0
    rotation_axes: tuple[Literal['x','y','z','none'],Literal['x','y','z','none'],Literal['x','y','z','none']] = ('z','x','y')
    rotation_angles: tuple[float,float,float] = (0,0,0)
    make_ellipsoid: bool = False
    radius_2: float = Field(default=.5,gt=0)
    radius_3: float = Field(default=.5,gt=0)
    inner_radius_2: float = Field(default=.3,ge=0)
    theta_start: float = 0
    theta_stop: float = 360
    vertices: tuple[tuple[float,float],...] = ((-.5,-.5),(.5,-.5),(0,.5))
    material: str = 'SiN (constant n)'
    mesh_order: int = Field(default=2, ge=1, le=100)

    @model_validator(mode='after')
    def valid_shape(self):
        if any(s <= 0 for s in self.size):
            raise ValueError('Object spans must be positive.')
        if self.kind == 'ring' and self.inner_radius >= self.radius:
            raise ValueError('Ring inner radius must be less than its outer radius.')
        if self.kind=='ring':
            if self.make_ellipsoid and (self.inner_radius_2>=self.radius_2 or (self.inner_radius==0)!=(self.inner_radius_2==0)):
                raise ValueError('Inner ellipse radii must both be zero or positive and smaller than the corresponding outer radii.')
            if not 0<abs(self.theta_stop-self.theta_start)<=360:raise ValueError('Ring angles must define a nonzero arc of at most 360 degrees.')
        if self.kind=='polygon':
            from .geometry import validate_polygon
            validate_polygon(self.vertices)
        return self

    @property
    def angular_span(self):return (self.theta_stop-self.theta_start)%360 or 360.


class TimeSignal(Model):
    time_s: list[float] = Field(min_length=2, max_length=100000)
    amplitude: list[float] = Field(min_length=2, max_length=100000)
    phase_rad: list[float] = Field(min_length=2, max_length=100000)

    @model_validator(mode='after')
    def valid_samples(self):
        if len(self.time_s) != len(self.amplitude) or len(self.time_s) != len(self.phase_rad):
            raise ValueError('Time, amplitude and phase arrays must have equal lengths.')
        if self.time_s[0] < 0 or any(b <= a for a,b in zip(self.time_s, self.time_s[1:])):
            raise ValueError('Source sample times must be nonnegative and strictly increasing.')
        return self


class SourceTimeSettings(Model):
    wavelength: float = Field(default=1.55, gt=0)
    pulse: Literal['gaussian', 'continuous', 'sampled', 'broadband'] = 'gaussian'
    pulse_cycles: float = Field(default=3, ge=1, le=50)
    time_definition: Literal['cycles', 'standard', 'wavelength', 'frequency'] = 'cycles'
    pulse_length: float = Field(default=20e-15, gt=0)  # power FWHM, seconds
    pulse_offset: float = Field(default=50e-15, ge=0)  # envelope centre, seconds
    signal: TimeSignal | None = None
    wavelength_start: float = Field(default=1.3, gt=0)
    wavelength_stop: float = Field(default=1.8, gt=0)
    optimize_for_short_pulse: bool = True
    eliminate_discontinuities: bool = False
    chirp_bandwidth_hz: float = Field(default=100e12, gt=0)

    @model_validator(mode='after')
    def valid_waveform(self):
        if self.pulse == 'sampled' and self.signal is None:
            raise ValueError('A sampled source requires time, amplitude and phase data.')
        if self.wavelength_stop < self.wavelength_start:
            raise ValueError('Source stop wavelength must be at least its start wavelength.')
        if self.time_definition in ('wavelength','frequency') and self.pulse != 'broadband':
            raise ValueError('Automatic wavelength/frequency ranges require the broadband pulse generator.')
        if self.pulse == 'broadband' and self.time_definition == 'cycles':
            raise ValueError('Broadband pulses require a wavelength/frequency range or standard time-domain parameters.')
        if self.pulse == 'broadband' and self.time_definition == 'standard' and self.chirp_bandwidth_hz >= 2*299792458.0/(self.wavelength*1e-6):
            raise ValueError('Chirp bandwidth must leave its lowest frequency positive.')
        return self


class Source(Item, SourceTimeSettings):
    name: str = 'source'
    kind: Literal['point', 'plane', 'tfsf'] = 'point'
    injection: Literal['soft', 'oneway'] = 'soft'
    normal: Literal['x', 'y', 'z'] = 'x'
    direction: Literal['+', '-'] = '+'
    incident_pml_cells: int = Field(default=96, ge=32, le=512)
    size: tuple[float, float, float] = (0, 2, 0)
    component: Literal['Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz'] = 'Ez'
    # None preserves the legacy Cartesian component. Angles select a unit
    # vector in that component's E/H family. theta is measured from +z.
    theta: float | None = Field(default=None, ge=0, le=180)
    phi: float = 0
    amplitude: float = Field(default=1, gt=0, le=100)
    phase: float = 0  # degrees
    use_global_source: bool = False

    @model_validator(mode='before')
    @classmethod
    def tfsf_defaults(cls, data):
        if isinstance(data,dict) and data.get('kind')=='tfsf':
            data=dict(data)
            data.setdefault('injection','oneway')
            data.setdefault('size',(2,2,2))
        return data

    @model_validator(mode='after')
    def valid_size(self):
        if any(v < 0 for v in self.size):
            raise ValueError('Source spans cannot be negative.')
        if self.kind=='tfsf' and self.injection!='oneway':
            raise ValueError('A TFSF box requires paired one-way E/H injection.')
        if self.injection == 'oneway':
            if self.kind not in ('plane','tfsf') or not self.component.startswith('E'):
                raise ValueError('One-way injection requires an electric polarization and kind="plane" or "tfsf".')
            if any(field[1].lower() == self.normal for field, _ in self.polarization_components):
                raise ValueError('One-way electric polarization must be transverse to the propagation axis.')
        return self

    @property
    def polarization_components(self):
        if self.theta is None:return ((self.component,1.),)
        def sincos(degrees):
            # Exact cardinal angles avoid spurious components without discarding
            # intentionally weak components at other angles.
            cardinal={0:(0.,1.),90:(1.,0.),180:(0.,-1.),270:(-1.,0.)}
            degrees%=360
            return cardinal[degrees] if degrees in cardinal else (math.sin(math.radians(degrees)),math.cos(math.radians(degrees)))
        st,ct=sincos(self.theta);sp,cp=sincos(self.phi)
        return tuple((self.component[0]+axis,value) for axis,value in zip('xyz',(st*cp,st*sp,ct)) if value!=0)

    @property
    def time_offset_steps(self):
        return .5 if self.component.startswith('H') else 0.


class SpectrumSettings(Model):
    sampling: Literal['fft', 'frequency', 'wavelength', 'chebyshev', 'custom'] = 'fft'
    chebyshev_wavelength: bool = False
    chebyshev_nodes: Literal['roots','lobatto'] = 'roots'
    use_source_limits: bool = False
    custom_frequencies_hz: list[float] = Field(default_factory=list, max_length=2001)
    wavelength_start: float = Field(default=1.3, gt=0)
    wavelength_stop: float = Field(default=1.8, gt=0)
    frequency_points: int = Field(default=101, ge=1, le=2001)
    # Preserve the legacy Hann FFT when opening existing native projects.
    apodization: Literal['hann', 'none', 'start', 'end', 'full'] = 'hann'
    apodization_center: float = Field(default=20e-15, ge=0)  # seconds
    apodization_time_width: float = Field(default=10e-15, gt=0)  # seconds

    @model_validator(mode='after')
    def valid_band(self):
        if self.sampling=='fft' and self.use_source_limits:
            raise ValueError('Source limits require explicit DFT samples, not FFT bins.')
        if self.sampling=='custom':
            if not self.custom_frequencies_hz or any(f<=0 for f in self.custom_frequencies_hz):
                raise ValueError('Custom frequencies must be a nonempty positive list in Hz.')
            if any(b<=a for a,b in zip(self.custom_frequencies_hz,self.custom_frequencies_hz[1:])):
                raise ValueError('Custom frequencies must be strictly increasing.')
            return self
        if self.wavelength_stop < self.wavelength_start:
            raise ValueError('Maximum wavelength must be at least the minimum wavelength.')
        if self.wavelength_start == self.wavelength_stop and self.frequency_points != 1:
            raise ValueError('A single wavelength requires one frequency point.')
        return self


class Monitor(Item):
    kind: Literal['point'] = 'point'
    name: str = 'monitor'
    component: Literal['Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz'] = 'Ez'
    spectrum: SpectrumSettings = Field(default_factory=SpectrumSettings)
    use_global_monitor: bool = False
    inherit_apodization: bool = True
    time_downsample: int = Field(default=1,ge=1,le=10000)


class FieldMonitor(Monitor):
    kind: Literal['field'] = 'field'
    name: str = 'frequency monitor'
    normal: Literal['x','y','z'] = 'x'
    size: tuple[float,float,float] = (0,1,1)
    downsample: int = Field(default=1,ge=1,le=32)
    downsample_xyz: tuple[int,int,int] | None = None
    record_fields: tuple[Literal['Ex','Ey','Ez','Hx','Hy','Hz'], ...] = ('Ex','Ey','Ez','Hx','Hy','Hz')
    record_poynting: tuple[Literal['x','y','z'], ...] = ('x','y','z')
    record_flux: bool = True
    dft_precision: Literal['field','float64'] = 'field'
    spatial_interpolation: Literal['specified','nearest'] = 'specified'
    spectrum: SpectrumSettings = Field(default_factory=lambda:SpectrumSettings(sampling='frequency',apodization='none'))

    @model_validator(mode='after')
    def valid_plane(self):
        if self.downsample_xyz is not None and any(not 1<=v<=32 for v in self.downsample_xyz):
            raise ValueError('Axis downsampling must be from 1 to 32.')
        if len(set(self.record_fields))!=len(self.record_fields) or len(set(self.record_poynting))!=len(self.record_poynting):
            raise ValueError('Recorded components must be unique.')
        if not self.record_fields and not self.record_poynting and not self.record_flux:
            raise ValueError('A frequency monitor needs at least one selected output.')
        axis='xyz'.index(self.normal)
        if self.size[axis]!=0 or any(v<=0 for i,v in enumerate(self.size) if i!=axis):
            raise ValueError('Frequency monitor normal span must be zero and transverse spans positive.')
        if not self.use_global_monitor and self.spectrum.sampling=='fft':
            raise ValueError('Distributed frequency monitors require explicit frequency samples, not FFT bins.')
        if not self.use_global_monitor and self.spectrum.apodization=='hann':
            raise ValueError('Distributed monitors support none/start/end/full apodization.')
        return self

    @property
    def required_fields(self):
        fields=set(self.record_fields)
        axes=set(self.record_poynting)|({self.normal} if self.record_flux else set())
        for axis in axes:
            for component in 'xyz':
                if component!=axis:fields.update(('E'+component,'H'+component))
        return tuple(c for c in ('Ex','Ey','Ez','Hx','Hy','Hz') if c in fields)


def default_materials():
    return [Material(name='Air', index=1, color='#b7c5d7'),
            Material(name='SiO2 (constant n)', index=1.444, color='#80c4d7'),
            Material(name='SiN (constant n)', index=2, color='#69a1e8'),
            Material(name='Si (constant n)', index=3.48, color='#cc8bdc')]


class ImportProvenance(Model):
    format: Literal['fsp-native'] = 'fsp-native'
    source_sha256: str = Field(pattern=r'^[a-f0-9]{64}$')
    origin_m: tuple[float, float, float] = (0, 0, 0)
    differences: list[str] = Field(default_factory=list, max_length=1000)


class Project(Model):
    schema_version: Literal[1] = 1
    name: str = Field(default='Untitled', min_length=1, max_length=120)
    region: Region = Field(default_factory=Region)
    materials: list[Material] = Field(default_factory=default_materials, min_length=1, max_length=100)
    structures: list[Structure] = Field(default_factory=list, max_length=1000)
    sources: list[Source] = Field(default_factory=list, max_length=32)
    global_source: SourceTimeSettings | None = Field(default_factory=SourceTimeSettings)
    monitors: list[Monitor | FieldMonitor] = Field(default_factory=list, max_length=32)
    global_monitor: SpectrumSettings = Field(default_factory=lambda:SpectrumSettings(sampling='frequency',apodization='none'))
    import_provenance: ImportProvenance | None = None

    @model_validator(mode='after')
    def valid_scene(self):
        names = [m.name for m in self.materials]
        if len(set(names)) != len(names):
            raise ValueError('Material names must be unique.')
        items = self.structures + self.sources + self.monitors
        ids = [x.id for x in items]
        if len(set(ids)) != len(ids) or 'fdtd' in ids:
            raise ValueError('Object IDs must be unique and cannot be fdtd.')
        if any(s.material not in names for s in self.structures):
            raise ValueError('A structure references an unknown material.')
        if self.global_source is None and any(s.use_global_source for s in self.sources):
            raise ValueError('Global source settings are unavailable. Configure them before enabling inheritance.')
        r = self.region
        from .mesh import configure_auto_mesh
        configure_auto_mesh(self)
        r.valid_grid()
        if r.interface_method=='subpixel':
            active={s.material for s in self.structures if s.enabled}
            if any(m.oscillators and m.name in active for m in self.materials):
                raise ValueError('Subpixel interfaces currently require lossless nondispersive materials. Choose staircase for dispersive materials.')
        dt = r.time_step
        from .waveforms import pulse_parameters
        for source in self.sources:
            resolved=self.resolved_source(source)
            if resolved.enabled and resolved.kind == 'tfsf':
                from .tfsf import tfsf_plan
                tfsf_plan(resolved,r)
            elif resolved.enabled and resolved.injection == 'oneway':
                from .injection import oneway_plan
                oneway_plan(resolved, r)
            if resolved.enabled and resolved.pulse=='broadband':
                pulse=pulse_parameters(resolved)
                if pulse.frequency_hz+pulse.frequency_span_hz/2 >= .5/dt:
                    raise ValueError(f'{source.name}: source range exceeds the temporal Nyquist limit. Refine the mesh.')
        for monitor in self.monitors:
            monitor=self.resolved_monitor(monitor);spec = monitor.spectrum
            from .spectra import frequency_samples
            if monitor.enabled and spec.sampling != 'fft' and max(frequency_samples(spec)) >= .5/(dt*monitor.time_downsample):
                raise ValueError(f'{monitor.name}: requested spectrum exceeds the temporal Nyquist limit. Refine the mesh or increase the minimum wavelength.')
            if monitor.kind=='field' and r.dimension=='2d' and monitor.normal=='z':
                raise ValueError('A 2D flux monitor must be x-normal or y-normal.')
        for obj in self.sources + self.monitors:
            if not obj.enabled:
                continue
            for axis in range(2 if r.dimension == '2d' else 3):
                half = obj.size[axis] / 2 if (isinstance(obj, Source) and obj.kind in ('plane','tfsf')) or isinstance(obj,FieldMonitor) else 0
                lower, upper = r.interior_bounds(axis)
                tolerance=16*math.ulp(max(abs(lower),abs(upper),r.size[axis]))
                if obj.center[axis]-half < lower-tolerance or obj.center[axis]+half > upper+tolerance or (half == 0 and obj.center[axis] >= upper):
                    raise ValueError(f'{obj.name} must lie entirely inside the non-PML region.')
            if r.dimension == '2d' and obj.center[2] != 0:
                raise ValueError(f'{obj.name}: z must be 0 in a 2D simulation.')
        return self

    def resolved_monitor(self, monitor):
        spec=(self.global_monitor if monitor.use_global_monitor else monitor.spectrum).model_dump()
        if monitor.use_global_monitor and not monitor.inherit_apodization:
            for key in ('apodization','apodization_center','apodization_time_width'):
                spec[key]=getattr(monitor.spectrum,key)
        if spec['use_source_limits'] and spec['sampling']!='custom':
            bands=[]
            for raw in self.sources:
                if not raw.enabled:continue
                source=self.resolved_source(raw)
                if source.time_definition not in ('wavelength','frequency'):
                    raise ValueError(f'{monitor.name}: source limits require explicitly ranged wavelength/frequency sources. Set an explicit monitor range for other pulse definitions.')
                bands.append((source.wavelength_start,source.wavelength_stop))
            if not bands:raise ValueError(f'{monitor.name}: source limits require an enabled ranged source.')
            spec.update(wavelength_start=min(a for a,b in bands),wavelength_stop=max(b for a,b in bands))
        spec['use_source_limits']=False
        return type(monitor).model_validate({**monitor.model_dump(),'spectrum':spec,'use_global_monitor':False})

    def resolved_source(self, source: Source):
        """Resolve pulse inheritance while retaining local geometry/amplitude/phase."""
        if not source.use_global_source:
            return source
        if self.global_source is None:
            raise ValueError('Global source settings are unavailable.')
        return Source.model_validate({**source.model_dump(), **self.global_source.model_dump(), 'use_global_source':False})

    def save(self, path):
        Path(path).write_text(self.model_dump_json(indent=2), encoding='utf-8')

    @classmethod
    def load(cls, path):
        return cls.model_validate_json(Path(path).read_text(encoding='utf-8'))

    def python_script(self):
        payload = pprint.pformat(self.model_dump(), sort_dicts=False, width=90)
        return ('from photonweave import Project, Simulation\n\n'
                '# Geometry and wavelength: micrometres. Time: seconds.\n'
                f'project = Project.model_validate({payload})\n'
                'result = Simulation(project).run()\n'
                'result.save("results/simulation.npz")\n'
                'print(result.summary)\n')


def demo_project(name='waveguide'):
    p = Project(name='SiN waveguide | 2D TMz',
                structures=[Structure(id='waveguide', name='waveguide', size=(8, 0.65, 0.4))],
                sources=[Source(id='source', center=(-2.5, 0, 0))],
                monitors=[Monitor(id='input', name='input', center=(-1.8, 0, 0)),
                          Monitor(id='output', name='output', center=(2, 0, 0))])
    if name == 'scatterer':
        p.name = 'Dielectric cylinder | 2D TMz'
        p.structures = [Structure(id='cylinder', name='cylinder', kind='circle', radius=0.65)]
        p.sources = [Source(id='source', kind='plane', center=(-2.5, 0, 0), size=(0, 4, 0))]
    elif name == '3d':
        p.name = 'Dielectric sphere | 3D'
        p.region = Region(dimension='3d', size=(4, 4, 4), mesh=0.1, steps=300, pml_cells=6)
        p.structures = [Structure(id='sphere', name='sphere', kind='sphere', radius=0.6)]
        p.sources = [Source(id='source', center=(-1, 0, 0))]
        p.monitors = [Monitor(id='output', name='output', center=(1, 0, 0))]
    return Project.model_validate(p.model_dump())
