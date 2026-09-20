"""Explicit full-supercell GDS TEXT adapter for opposing fixed mode ports."""
import math
from collections.abc import Mapping

from .gds import GDSImport
from .mode_network import FixedModePort, ModeNetwork


def prepare_gds_mode_network(imported, project, *, port_names, normal_convention,
                             source_offsets_um, mode_indices, wavelength_um,
                             permittivity, options=None, num_modes=2,
                             network_budget_bytes=256*1024**2, gram_tolerance=1e-4):
    """Map two selected TEXT names to native opposing complete-cell ports.

    ``normal_convention`` must explicitly be 'outward' or 'inward'. Offsets
    and mode indices are mappings keyed by the selected GDS names. Positive
    offsets place sources outside the phase planes. Native channel order is
    increasing propagation coordinate, independent of selection order.

    The project supplies one Gaussian plane pulse template. Its wavelength and
    normal are replaced by the explicit wavelength and admitted marker axis.
    Imported geometry is added to a project copy. Geometry is NOT rasterized:
    caller-provided runtime Yee epsilon remains authoritative, including both
    fixed exterior cross-sections. ``permittivity`` is the one common fixed
    isotropic mode cross-section, following ModeNetwork's scalar/callable API.
    """
    if not isinstance(imported, GDSImport):
        raise ValueError('Provide an explicit GDSImport with TEXT port metadata.')
    names = tuple(port_names)
    if len(names) != 2 or len(set(names)) != 2:
        raise ValueError('Select exactly two distinct GDS port names.')
    if normal_convention not in ('outward', 'inward'):
        raise ValueError('Declare normal_convention as outward or inward.')
    if any(not isinstance(m, Mapping) or set(m) != set(names)
           for m in (source_offsets_um, mode_indices)):
        raise ValueError('Offsets and mode indices must map exactly the selected port names.')
    if isinstance(wavelength_um, bool) or not isinstance(wavelength_um, (int, float)) or not math.isfinite(wavelength_um) or wavelength_um <= 0:
        raise ValueError('Provide a finite positive wavelength_um.')
    if len({p.name for p in imported.ports}) != len(imported.ports):
        raise ValueError('GDS port names must be unique.')
    by_name = {p.name: p for p in imported.ports}
    if any(name not in by_name for name in names):
        raise ValueError('Selected GDS port name is missing.')
    selected = [by_name[name] for name in names]
    axes, directions = [], []
    close = lambda a, b: math.isclose(a, b, rel_tol=0, abs_tol=1e-8)
    for port in selected:
        if port.marker_record != 'TEXT' or len(port.normal) != 3 or len(port.center_um) != 3:
            raise ValueError('Require three-coordinate GDS TEXT ports.')
        axis = next((a for a in (0, 1) if close(abs(port.normal[a]), 1)
                     and all(close(port.normal[b], 0) for b in range(3) if b != a)), None)
        if axis is None:
            raise ValueError('Only cardinal x/y GDS port normals are supported.')
        axes.append(axis)
        directions.append((1 if port.normal[axis] > 0 else -1)
                          * (-1 if normal_convention == 'outward' else 1))
        r = project.region
        if any(not close(port.center_um[b], 0) for b in range(3) if b != axis):
            raise ValueError('Port transverse centers must coincide with the full-cell center.')
        if not close(port.width_um, r.actual_size[1-axis]) or not close(port.height_um, r.actual_size[2]):
            raise ValueError('GDS aperture must cover the full transverse cell width and height.')
        offset = source_offsets_um[port.name]
        if isinstance(offset, bool) or not isinstance(offset, (int, float)) or not math.isfinite(offset) or offset <= 0:
            raise ValueError('Source offsets must be finite positive outward distances.')
    if axes[0] != axes[1] or directions[0] == directions[1]:
        raise ValueError('Select cardinal opposing ports on the same axis.')
    axis = axes[0]
    ports = tuple(sorted((FixedModePort(p.name, p.center_um[axis],
                         p.center_um[axis]-d*source_offsets_um[p.name], d,
                         tuple(mode_indices[p.name])) for p, d in zip(selected, directions)),
                         key=lambda p: p.coordinate_um))
    if tuple(p.direction for p in ports) != (1, -1):
        raise ValueError('Declared normals must point into the interval between selected ports.')
    copied = imported.add_to(project)
    active = [copied.resolved_source(s) for s in copied.sources if s.enabled]
    if len(active) != 1 or active[0].kind != 'plane':
        raise ValueError('Provide exactly one plane source as the pulse timing template.')
    source = active[0].model_copy(deep=True)
    source.normal, source.wavelength = 'xyz'[axis], float(wavelength_um)
    source.center = tuple(ports[0].source_coordinate_um if a == axis else 0. for a in range(3))
    source.size = tuple(0. if a == axis else copied.region.actual_size[a] for a in range(3))
    source.direction = '+'
    copied.sources = [source]
    return ModeNetwork(copied, ports, permittivity, options, num_modes=num_modes,
                       network_budget_bytes=network_budget_bytes, gram_tolerance=gram_tolerance)
