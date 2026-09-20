"""Differentiable collocated spectral planes on the real Yee/CPML contract."""
from dataclasses import dataclass
import hashlib
import json
import numpy as np
import torch
from .adjoint_spectrum import SpectralObservation
from .differentiable import DifferentiableSimulation
from .field_monitors import plane_plan, interpolation_map
from .models import Project, Monitor
from .streamed import StreamedSimulation, StreamedAdjointOptions

COMPONENTS = ('Ex','Ey','Ez','Hx','Hy','Hz')


def _plane_signature(project):
    # Execution placement must not invalidate a physically matched reference.
    region=project.region.model_dump(mode='json')
    for key in ('memory_mode','backend','cuda_kernel','cuda_monitor_kernel'):
        region.pop(key,None)
    payload=dict(region=region,sources=[project.resolved_source(s).model_dump(mode='json') for s in project.sources])
    return hashlib.sha256(json.dumps(payload,sort_keys=True).encode()).hexdigest()


@dataclass
class DifferentiablePlaneResult:
    fields: torch.Tensor  # frequency, flattened quadrature point, component
    frequency_hz: torch.Tensor
    points_um: torch.Tensor
    weights: torch.Tensor
    shape: tuple
    normal: str
    run_signature: str
    report: dict
    components: tuple = COMPONENTS
    field_units: str = 'reduced field * s'
    flux_units: str = 'reduced E*H * s^2 * m^2'
    fourier_convention: str = 'exp(+2 pi i f t)'

    def poynting(self, normal=None):
        normal=self.normal if normal is None else normal
        if normal not in ('x','y','z'):raise ValueError('Normal must be x, y or z.')
        axis='xyz'.index(normal)
        b,c=(axis+1)%3,(axis+2)%3
        return .5*(self.fields[...,b]*self.fields[...,3+c].conj()-self.fields[...,c]*self.fields[...,3+b].conj()).real

    def flux(self):
        """Signed reduced Poynting integral, not incident normalization."""
        return self.poynting()@self.weights

    def normalized_flux(self, reference, *, subtract_incident=False, min_reference_fraction=.01):
        """Matched-reference ratio, optionally subtracting incident fields."""
        if not 0<min_reference_fraction<1:raise ValueError('Reference threshold must lie between zero and one.')
        if self.run_signature!=reference.run_signature or self.normal!=reference.normal:
            raise ValueError('Reference mesh, sources, duration and normal must match.')
        for name in ('frequency_hz','points_um','weights'):
            a,b=getattr(self,name),getattr(reference,name)
            if a.device!=b.device or a.dtype!=b.dtype or a.shape!=b.shape or not torch.equal(a,b):
                raise ValueError(f'Reference {name} must match exactly, including device and dtype.')
        # Normalize before multiplying SI-scale spectral fields and areas.
        # Dividing an O(dt^2*area) FP32 flux afterward can underflow the value
        # or overflow its backward seed. Common detached scales cancel from
        # the ratio and preserve derivatives wrt both sample and reference.
        field_scale=reference.fields.detach().abs().amax()
        area_scale=reference.weights.detach().abs().amax()
        if not bool(torch.isfinite(field_scale)) or not bool(field_scale>0) or not bool(torch.isfinite(area_scale)) or not bool(area_scale>0):
            raise ValueError('Reference power is zero, nonfinite or too weak. Select a supported frequency band.')
        fields=self.fields/field_scale
        reference_fields=reference.fields/field_scale
        weights=self.weights/area_scale
        a='xyz'.index(self.normal);b,c=(a+1)%3,(a+2)%3
        def density(value):
            return .5*(value[...,b]*value[...,3+c].conj()-value[...,c]*value[...,3+b].conj()).real
        denominator=(density(reference_fields)@weights).abs()
        if not bool(torch.isfinite(denominator).all()) or bool((denominator<=0).any()) or bool((denominator<=min_reference_fraction*denominator.max()).any()):
            raise ValueError('Reference power is zero, nonfinite or too weak. Select a supported frequency band.')
        if subtract_incident:
            fields=fields-reference_fields
        numerator=density(fields)@weights
        return numerator/denominator


class _PlaneSpectrum(SpectralObservation):
    def __init__(self,*args,points,maps,**kwargs):
        super().__init__(*args,**kwargs)
        self.point_count,self.map_bytes=points,maps

    def kernel(self,start,stop,family):
        # Match native FrequencyPlane's positive-frequency exponential.
        # Point-spectrum API retains its documented negative exponential.
        return super().kernel(start,stop,family).conj()

    def reservation(self,depth):
        result=super().reservation(depth)
        item=8 if self.dtype==torch.float64 else 4
        # Collocated output/VJP, eight-corner gathers/products and map copies.
        workspace=128*self.frequency.numel()*self.point_count*item+2*self.map_bytes
        result['plane_workspace_reservation_bytes']=workspace
        result['plane_output_bytes']=12*self.frequency.numel()*self.point_count*item
        result['spectral_reservation_bytes']+=workspace
        return result


class DifferentiablePlaneSimulation(torch.nn.Module):
    """Fixed planes and common explicit frequencies. All six fields are returned.

    Geometry/epsilon differentiates. Monitor positions and mesh remain fixed.
    Every enabled project monitor must be a field plane.
    """
    _resident_model_type = DifferentiableSimulation

    def __init__(self,project,options=None,*,quadrature_counts=None):
        super().__init__()
        self.project=Project.model_validate(project.model_dump())
        active=[m for m in self.project.monitors if m.enabled]
        if not active or any(m.kind!='field' for m in active):
            raise ValueError('DifferentiablePlaneSimulation requires enabled field monitors only.')
        quadrature_counts={} if quadrature_counts is None else dict(quadrature_counts)
        if set(quadrature_counts)-{m.id for m in active}:
            raise ValueError('Quadrature counts must refer to enabled monitor IDs.')
        self.plans=[]
        observers=[]
        lookup={}
        for raw in active:
            monitor=self.project.resolved_monitor(raw)
            if monitor.time_downsample!=1 or monitor.spectrum.apodization!='none':
                raise ValueError('Differentiable planes require time_downsample=1 and no apodization.')
            if monitor.dft_precision=='float64' and self.project.region.precision!='float64':
                raise ValueError('Mixed field/DFT precision is not supported by plane adjoints.')
            plan=plane_plan(self.project.region,monitor,quadrature_counts.get(monitor.id))
            maps=[]
            for component in COMPONENTS:
                indices,weights=interpolation_map(self.project.region,component,plan['points_um'])
                samples=np.empty_like(indices)
                for position,index in np.ndenumerate(indices):
                    key=(component,int(index))
                    if key not in lookup:
                        loc=tuple(int(v) for v in np.unravel_index(int(index)//3,self.project.region.shape))
                        lookup[key]=len(observers)
                        observers.append((component,loc,COMPONENTS.index(component)%3))
                    samples[position]=lookup[key]
                maps.append((samples,weights))
            self.plans.append((monitor.id,monitor.normal,plan,maps))
        self.observers=tuple(observers)
        self.components=tuple(o[0] for o in observers)
        self.signature=_plane_signature(self.project)
        # Indexed internal observations avoid thousands of UI point objects.
        internal=self.project.model_copy(deep=True)
        internal.monitors=[Monitor()]
        self.model=getattr(self, '_streamed_model_type', StreamedSimulation)(internal,options) if isinstance(options,StreamedAdjointOptions) else self._resident_model_type(internal,options)
        self._project_snapshot=self.project.model_dump()
        self._internal_snapshot=self.model.project.model_dump()

    def forward(self,epsilon,frequency_hz,*,block_size=32):
        """Return an ordered mapping from monitor IDs to spectral plane results."""
        return self._planes(epsilon,frequency_hz,block_size,lambda spectral:self.model._run(epsilon,spectral))

    @property
    def layout_reservation_bytes(self):
        arrays=sum(plan['points_um'].nbytes+plan['weights'].nbytes+
            sum(i.nbytes+w.nbytes for i,w in entries) for _,_,plan,entries in self.plans)
        # Include an allowance for indexed Python observations and construction
        # containers, in addition to the retained NumPy interpolation arrays.
        return arrays+1024*len(self.observers)+4096*len(self.plans)

    def _spectral(self,epsilon,frequency_hz,block_size):
        points=sum(len(plan['weights']) for _,_,plan,_ in self.plans)
        maps=sum(i.nbytes+w.nbytes for _,_,_,entries in self.plans for i,w in entries)
        spectral=_PlaneSpectrum(epsilon,self.project.region,self.components,frequency_hz,
                                block_size=block_size,points=points,maps=maps)
        spectral.observers=self.observers
        return spectral

    def _planes(self,epsilon,frequency_hz,block_size,run):
        if self.project.model_dump()!=self._project_snapshot or self.model.project.model_dump()!=self._internal_snapshot:
            raise ValueError('Plane configuration changed. Rebuild the model to regenerate fixed interpolation and source plans.')
        spectral=self._spectral(epsilon,frequency_hz,block_size)
        result=run(spectral)
        output={}
        for identifier,normal,plan,entries in self.plans:
            fields=[]
            for indices,weights in entries:
                index=torch.as_tensor(indices,device=epsilon.device,dtype=torch.int64)
                weight=torch.as_tensor(weights,device=epsilon.device,dtype=result.fields.dtype if np.iscomplexobj(weights) else epsilon.dtype)
                fields.append((result.fields[:,index]*weight[None,:,:]).sum(dim=1))
            fields=torch.stack(fields,dim=-1)
            output[identifier]=DifferentiablePlaneResult(fields,result.frequency_hz.clone(),
                torch.as_tensor(plan['points_um'],device=epsilon.device,dtype=epsilon.dtype).clone(),
                torch.as_tensor(plan['weights'],device=epsilon.device,dtype=epsilon.dtype).clone(),
                plan['shape'],normal,self.signature,result.report,
                flux_units='reduced E*H * s^2 * '+('m per invariant length' if self.project.region.dimension=='2d' else 'm^2'))
        return output
