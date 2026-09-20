"""Regularized analytic solids with a bounded, recomputed geometry VJP."""
from dataclasses import dataclass
import math

import torch
from torch.autograd.function import once_differentiable

from .solver import field_axes


def _scale(value, factor):
    if isinstance(value, torch.Tensor):
        return value * factor
    return tuple(v * factor for v in value)


@dataclass(frozen=True)
class DifferentiableSolid:
    """Tensor-valued analytic solid, in micrometres and degrees.

    Use the named constructors. Later solids overwrite earlier ones through
    their regularized occupancy. This is not the coupled CAD subpixel operator.
    """
    kind: str
    extent: object
    epsilon: object
    center: object = (0., 0., 0.)
    rotation: object = (0., 0., 0.)

    @classmethod
    def box(cls, size, *, epsilon, center=(0., 0., 0.), rotation=(0., 0., 0.)):
        return cls('box', _scale(size, .5), epsilon, center, rotation)

    @classmethod
    def ellipsoid(cls, radii, *, epsilon, center=(0., 0., 0.), rotation=(0., 0., 0.)):
        return cls('ellipsoid', radii, epsilon, center, rotation)

    @classmethod
    def sphere(cls, radius, *, epsilon, center=(0., 0., 0.)):
        return cls.ellipsoid((radius, radius, radius), epsilon=epsilon, center=center)

    @classmethod
    def cylinder(cls, radius, height, *, epsilon, radius_y=None,
                 center=(0., 0., 0.), rotation=(0., 0., 0.)):
        return cls('cylinder', (radius, radius if radius_y is None else radius_y, height / 2),
                   epsilon, center, rotation)


def _tensors(value):
    if isinstance(value, torch.Tensor):
        yield value
    elif isinstance(value, (tuple, list)):
        for item in value:
            yield from _tensors(item)


def _as_tensor(value, like):
    if isinstance(value, torch.Tensor):
        return value
    if isinstance(value, (tuple, list)):
        return torch.stack([_as_tensor(item, like) for item in value])
    return like.new_tensor(value)


def _rotation(angles):
    x, y, z = angles * (math.pi / 180)
    cx, cy, cz = x.cos(), y.cos(), z.cos()
    sx, sy, sz = x.sin(), y.sin(), z.sin()
    # Local -> world, fixed world axes x then y then z: Rz @ Ry @ Rx.
    return torch.stack((
        torch.stack((cz*cy, cz*sy*sx-sz*cx, cz*sy*cx+sz*sx)),
        torch.stack((sz*cy, sz*sy*sx+cz*cx, sz*sy*cx-cz*sx)),
        torch.stack((-sy, cy*sx, cy*cx)),
    ))


def _step(distance, width):
    fraction = (distance / width + .5).clamp(0, 1)
    return fraction.square() * (3 - 2*fraction)


def _evaluate(points, parameters, background, kinds, width):
    epsilon = background.expand(points.shape[0])
    for kind, row in zip(kinds, parameters):
        local = (points - row[:3]) @ _rotation(row[6:9])
        extent = row[3:6]
        if kind == 'box':
            occupancy = _step(extent-local.abs(), width).prod(-1)
        else:
            dimensions = 3 if kind == 'ellipsoid' else 2
            scaled = local[:, :dimensions] / extent[:dimensions]
            level = 1 - torch.linalg.vector_norm(scaled, dim=-1)
            occupancy = _step(level * extent[:dimensions].amin(), width)
            if kind == 'cylinder':
                occupancy = occupancy * _step(extent[2]-local[:, 2].abs(), width)
        epsilon = epsilon * (1-occupancy) + row[9] * occupancy
    return epsilon


def _points(axes, begin, end, shape):
    indices = torch.arange(begin, end, device=axes[0].device)
    x = indices // (shape[1]*shape[2])
    y = (indices // shape[2]) % shape[1]
    z = indices % shape[2]
    return torch.stack((axes[0][x], axes[1][y], axes[2][z]), -1)


class _Geometry(torch.autograd.Function):
    @staticmethod
    def forward(ctx, parameters, background, kinds, shape, width, chunk_cells, *axes):
        components = len(axes) // 3
        ctx.save_for_backward(parameters, background, *axes)
        ctx.spec = kinds, shape, width, chunk_cells, components
        output = parameters.new_empty((math.prod(shape), components))
        for begin in range(0, output.shape[0], chunk_cells):
            end = min(begin+chunk_cells, output.shape[0])
            for component in range(components):
                points = _points(axes[3*component:3*component+3], begin, end, shape)
                output[begin:end, component] = _evaluate(points, parameters, background, kinds, width)
        return output.reshape(shape + ((3,) if components == 3 else ()))

    @staticmethod
    @once_differentiable
    def backward(ctx, seed):
        parameters, background, *axes = ctx.saved_tensors
        kinds, shape, width, chunk_cells, components = ctx.spec
        dp, db = torch.zeros_like(parameters), torch.zeros_like(background)
        # Do not flatten a noncontiguous caller VJP into a full-domain copy.
        for begin in range(0, math.prod(shape), chunk_cells):
            end = min(begin+chunk_cells, math.prod(shape))
            indices = torch.arange(begin, end, device=seed.device)
            index = (indices // (shape[1]*shape[2]), (indices // shape[2]) % shape[1], indices % shape[2])
            for component in range(components):
                weights = seed[index + ((component,) if components == 3 else ())]
                with torch.enable_grad():
                    local_parameters = parameters.detach().requires_grad_(True)
                    local_background = background.detach().requires_grad_(True)
                    points = _points(axes[3*component:3*component+3], begin, end, shape)
                    value = _evaluate(points, local_parameters, local_background, kinds, width)
                    gradients = torch.autograd.grad(value, (local_parameters, local_background), weights,
                                                    allow_unused=True)
                if gradients[0] is not None:
                    dp.add_(gradients[0])
                db.add_(gradients[1])
                del value, gradients, points, local_parameters, local_background
        return (dp, db, None, None, None, None) + (None,)*len(axes)


def smooth_geometry_epsilon(region, solids, *, background=1., width=None, chunk_cells=65536,
                            device=None):
    """Rasterize and differentiate ordered solids without a full geometry graph.

    The mesh and transition width are fixed. A custom first-order backward
    replays one chunk and electric component at a time. The dense epsilon
    output and its incoming VJP still occupy full-grid storage. Local graph
    memory scales with chunk_cells and solid count, not global cell count.

    FP32 is the default for an FP32 region. Tensor inputs must share the
    region's precision and their device. For streamed FDTD keep them on CPU.
    Periodic copies are explicit solids, never inferred from boundary types.
    """
    solids = tuple(solids)
    if region.interface_method != 'staircase':
        raise ValueError('Regularized geometry supplies diagonal epsilon, not coupled subpixel coefficients.')
    if isinstance(chunk_cells, bool) or not isinstance(chunk_cells, int) or chunk_cells < 1:
        raise ValueError('chunk_cells must be a positive integer.')
    width = region.reference_step if width is None else width
    if isinstance(width, torch.Tensor) or not math.isfinite(width) or width <= 0:
        raise ValueError('Transition width must be a fixed positive finite scalar.')
    if any(not isinstance(s, DifferentiableSolid) or s.kind not in ('box', 'ellipsoid', 'cylinder') for s in solids):
        raise ValueError('Use DifferentiableSolid box, sphere, ellipsoid or cylinder constructors.')
    inputs = [background, *[v for s in solids for v in (s.center, s.extent, s.rotation, s.epsilon)]]
    tensors = list(_tensors(inputs))
    dtype = getattr(torch, region.precision)
    chosen_device = torch.device(device) if device is not None else tensors[0].device if tensors else torch.device('cpu')
    if chosen_device.type not in ('cpu', 'cuda'):
        raise ValueError('Geometry supports CPU or CUDA.')
    like = torch.empty((), dtype=dtype, device=chosen_device)
    if any(t.dtype != dtype or t.device != like.device for t in tensors):
        raise ValueError('Tensor geometry inputs must share the region precision and selected device.')
    rows = []
    for solid in solids:
        values = [_as_tensor(v, like) for v in (solid.center, solid.extent, solid.rotation, solid.epsilon)]
        if any(v.shape != (3,) for v in values[:3]) or values[3].ndim != 0:
            raise ValueError('Center, extent and rotation need three values, and epsilon must be scalar.')
        rows.append(torch.cat((*values[:3], values[3].reshape(1))))
    parameters = torch.stack(rows) if rows else like.new_empty((0, 10))
    background = _as_tensor(background, like)
    if background.ndim != 0 or not bool(torch.isfinite(background)) or not bool(background >= 1):
        raise ValueError('Background epsilon must be a finite scalar at least one.')
    if not bool(torch.isfinite(parameters).all()) or bool((parameters[:, 3:6] <= 0).any()):
        raise ValueError('Solid parameters must be finite and extents positive.')
    if bool((parameters[:, 9] < 1).any()):
        raise ValueError('Solid epsilon must be at least one for the conservative CFL contract.')
    if region.material_sampling == 'yee':
        coordinates = [axis for c in ('Ex', 'Ey', 'Ez') for axis in field_axes(region, c)]
    else:
        coordinates = [(nodes[:-1]+nodes[1:])/2 for nodes in region.mesh_nodes]
    axes = tuple(torch.tensor(axis, dtype=dtype, device=like.device) for axis in coordinates)
    return _Geometry.apply(parameters, background, tuple(s.kind for s in solids), region.shape,
                           width, chunk_cells, *axes)
