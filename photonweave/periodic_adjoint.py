"""Budgeted periodic density responses through resident or streamed adjoints."""
from copy import deepcopy
from dataclasses import asdict, replace
import hashlib
import json
import math

import torch

from .adjoint_batch import AdjointBatchOptions, AdjointCase, RecomputedAdjointBatch
from .density_layer import periodic_density_layer
from .detector_allocation import quadrant_intensity_allocation
from .execution_tuning import AdjointExecutionPolicy
from .memory_profile import host_memory
from .periodic_response import _periodic_project
from .polarization import calibrate_plane_polarization, mix_plane_fields
from .reference_cache import PlaneReferenceCache
from .solver import C0


class PeriodicLayerResponse(torch.nn.Module):
    """Fixed-frequency two-polarization response with one active solver graph.

    A real CPU density tensor of density_shape produces a CPU (2, 4) response
    in R/G2/G1/B order. Mesh, materials, incidence and detector geometry are
    fixed. Coherent source synthesis precedes intensity/power reduction.
    First-order density gradients flow through both source-basis solutions.

    policy selects resident CPU/CUDA or DRAM/file spatial execution. The host
    budget includes solver replay, material-map construction and this module's
    bounded reference cache. Caller optimizer/other graphs, process/runtime
    overhead and OS file cache are excluded. The material map remains dense
    in CPU RAM even with file-backed field states. This is not lazy geometry,
    concurrent adjoint batching or a converged CR optimization by itself.
    """
    def __init__(self, spec, *, density_shape, policy, batch_options,
                 mesh, steps, dtype=torch.float64, pml_cells=12,
                 quadrature_counts=(24, 24), pixel_origin='cell_edges',
                 reference_cache=None, forward_kernel='fused'):
        super().__init__()
        if not isinstance(policy, AdjointExecutionPolicy) or not isinstance(batch_options, AdjointBatchOptions):
            raise ValueError('Provide an AdjointExecutionPolicy and shared AdjointBatchOptions.')
        if dtype not in (torch.float32, torch.float64):
            raise ValueError('Density dtype must be real FP32 or FP64.')
        density_shape, quadrature_counts = tuple(density_shape), tuple(quadrature_counts)
        if len(density_shape) != 2 or any(isinstance(v, bool) or not isinstance(v, int) or v < 1 for v in density_shape):
            raise ValueError('density_shape must contain two positive integer counts.')
        if len(quadrature_counts) != 2 or any(isinstance(v, bool) or not isinstance(v, int) or v < 2 for v in quadrature_counts):
            raise ValueError('Use at least two detector quadrature points per axis.')
        if pixel_origin not in ('cell_edges', 'sample_centers'):
            raise ValueError('Unknown density pixel origin.')
        if forward_kernel not in ('torch', 'fused'):
            raise ValueError('forward_kernel must be torch or fused.')
        period = spec['period_um']
        if len(period) != 2 or any(isinstance(v, torch.Tensor) or not math.isfinite(v) or v <= 0 for v in period):
            raise ValueError('Period must contain two fixed positive finite lengths.')
        if any(isinstance(spec[k], torch.Tensor) or not math.isfinite(spec[k]) or spec[k] < 1
               for k in ('background_index', 'design_index')):
            raise ValueError('Fixed lossless indices must be finite and at least one.')
        if reference_cache is not None and not isinstance(reference_cache, PlaneReferenceCache):
            raise ValueError('Expected PlaneReferenceCache.')
        self._spec = deepcopy(spec)
        self._density_shape, self._dtype, self._pixel_origin = density_shape, dtype, pixel_origin
        self._cache = reference_cache if reference_cache is not None else PlaneReferenceCache()
        self._cache_budget = self._cache.budget_bytes
        self._host_budget = batch_options.host_budget_bytes
        self._project, self._kt = _periodic_project(self._spec, dtype=dtype,
            mesh=mesh, steps=steps, pml_cells=pml_cells, forward_kernel=forward_kernel,
            memory_mode='streamed')
        region = self._project.region
        lo, hi = region.interior_bounds(2)
        if -spec['height_um']/2 < lo or spec['height_um']/2 > hi:
            raise ValueError('Patterned layer must lie inside the non-PML region.')
        self._epsilon_shape = region.shape + (3,)
        item = torch.empty((), dtype=dtype).element_size()
        parameter_bytes = math.prod(self._epsilon_shape)*item
        # Yee averaging constructs three component arrays and then stacks them.
        # The batch's own gradient-carrier reservation is additional to this
        # material-map/geometry allowance. Reference planes stay compact.
        nx, ny, nz = region.shape
        dx, dy = density_shape
        maps = 8*(nx*dx + ny*dy + nx*ny + nx + ny + nz)*item
        reference_copies = 4*4*(16*math.prod(quadrature_counts)+1)*item + 65536
        self._geometry_allowance = 2*parameter_bytes + 4*dx*dy*item + maps
        self._reference_allowance = reference_copies + self._cache_budget
        self._outside_batch = self._geometry_allowance + self._reference_allowance
        if self._outside_batch >= self._host_budget:
            raise ValueError('Material map, geometry and reference cache exceed the host budget.')
        frequency = [C0/(spec['wavelength_um']*1e-6)]
        cases = []
        for component in ('Ex', 'Ey'):
            project = self._project.model_copy(deep=True)
            project.sources[0].component = component
            cases.append(AdjointCase(project, policy, frequency_hz=frequency,
                quadrature_counts={'incident':quadrature_counts, 'detector':quadrature_counts}))
        self._batch = RecomputedAdjointBatch(cases, replace(batch_options,
            host_budget_bytes=self._host_budget-self._outside_batch))
        payload = dict(version='budgeted-periodic-response-1',
            projects=[c.project.model_dump(mode='json') for c in cases],
            policy=asdict(policy), frequency=frequency, quadrature_counts=quadrature_counts,
            dtype=str(dtype))
        # Placement/kernel policy is part of the key. Numerically different
        # execution paths must not silently reuse another path's reference.
        self._reference_key = hashlib.sha256(json.dumps(payload, sort_keys=True, default=str).encode()).hexdigest()
        self.last_report = None

    @property
    def project(self):
        """Return an inspection copy. Rebuild the module to change the project."""
        return self._project.model_copy(deep=True)

    def plan(self):
        """Live admission without full material maps or field allocations."""
        if self._cache.budget_bytes != self._cache_budget:
            raise ValueError('Reference-cache budget changed. Rebuild the response module.')
        logical = torch.empty((), dtype=self._dtype).expand(self._epsilon_shape)
        batch = self._batch.plan(logical)
        total = batch['host_reservation_bytes'] + self._outside_batch
        available = host_memory()['available_bytes']
        limit = self._host_budget if available is None else min(self._host_budget, int(.8*available))
        if total > limit:
            raise ValueError('Periodic solver, geometry and references exceed the shared host budget.')
        return dict(batch=batch, host_reservation_bytes=total,
            gpu_reservation_bytes=batch['gpu_reservation_bytes'],
            disk_reservation_bytes=batch['disk_reservation_bytes'],
            geometry_allowance_bytes=self._geometry_allowance,
            reference_allowance_bytes=self._reference_allowance,
            density_shape=self._density_shape, epsilon_shape=self._epsilon_shape,
            scope='One invocation. Excludes caller optimizer/other graphs, runtime and OS cache.')

    def _references(self):
        def compute():
            background = torch.full(self._epsilon_shape, self._spec['background_index']**2,
                                    dtype=self._dtype)
            result = self._batch(background)
            return {f'{basis}/{name}':plane for basis, planes in enumerate(result.cases)
                    for name, plane in planes.items()}
        cached = self._cache._get(self._reference_key, 'cpu', compute)
        return [{name:cached[f'{basis}/{name}'] for name in ('incident', 'detector')} for basis in range(2)]

    def forward(self, density):
        if torch.is_inference_mode_enabled():
            raise ValueError('Use torch.no_grad(), not inference_mode, for periodic adjoints.')
        if not isinstance(density, torch.Tensor) or density.device.type != 'cpu' or density.dtype != self._dtype or tuple(density.shape) != self._density_shape:
            raise ValueError('Density must be a real CPU tensor matching the prepared shape and dtype.')
        if not bool(torch.isfinite(density).all()) or bool(((density < 0) | (density > 1)).any()):
            raise ValueError('Density must be finite in [0,1].')
        plan = self.plan()
        with torch.no_grad():
            hits, misses = self._cache.hits, self._cache.misses
            refs = self._references()
            theta, phi = self._spec['theta_inside_rad'], self._spec['phi_rad']
            pvec = density.new_tensor([math.cos(theta)*math.cos(phi), math.cos(theta)*math.sin(phi)])
            svec = density.new_tensor([-math.sin(phi), math.cos(phi)])
            targets = [math.cos(phi)*pvec-math.sin(phi)*svec, math.sin(phi)*pvec+math.cos(phi)*svec]
            coefficients = [calibrate_plane_polarization([r['incident'] for r in refs], [self._kt], v[None])
                            for v in targets]
        # Revalidate after reference computation, before dense geometry creation.
        self.plan()
        epsilon = periodic_density_layer(density, self._project.region,
            bottom_um=-self._spec['height_um']/2, top_um=self._spec['height_um']/2,
            background_epsilon=self._spec['background_index']**2,
            design_epsilon=self._spec['design_index']**2, pixel_origin=self._pixel_origin)
        result = self._batch(epsilon)
        planes = [p['detector'] for p in result.cases]
        responses = []
        for c in coefficients:
            sample = mix_plane_fields(planes, c)
            reference = mix_plane_fields([r['detector'] for r in refs], c)
            responses.append(quadrant_intensity_allocation(sample, sample.normalized_flux(reference))[0])
        self.last_report = dict(plan=plan, batch=result.report,
            reference_cache_hits=self._cache.hits-hits, reference_cache_misses=self._cache.misses-misses,
            reference_cache_tensor_bytes=self._cache.tensor_bytes)
        return torch.stack(responses)
