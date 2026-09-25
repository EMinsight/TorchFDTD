"""Validation-time warnings for configurations known to be unstable in long runs.

These checks read the project only; they change nothing and reject nothing.
/api/validate appends them to the estimate's warnings and `torchfdtd run`
prints them with the run summary.
"""
from __future__ import annotations

import numpy as np


def _pml_contacts(project):
    """(structure, [(face, ends inside the layer)]) of every enabled dispersive structure whose support bounds reach a PML layer.

    Touching the inner edge of a layer counts, within 1e-6 of a cell: the upper
    CPML rows of E include the node on that edge. A structure ends inside the
    layer when its whole extent along the face normal lies in the layer.
    """
    from .mesh import object_bounds
    r = project.region
    dispersive = {m.name for m in project.materials if m.oscillators}
    active = 2 if r.dimension == '2d' else 3
    tolerance = 1e-6*r.reference_step
    found = []
    for s in project.structures:
        if not s.enabled or s.material not in dispersive:
            continue
        center, size = object_bounds(s)
        faces = []
        for axis in range(active):
            low, high = r.interior_bounds(axis)
            lo, hi = center[axis]-size[axis]/2, center[axis]+size[axis]/2
            if r.pml_layers(axis, 0) and lo <= low+tolerance:
                faces.append(('xyz'[axis]+'_min', hi <= low+tolerance))
            if r.pml_layers(axis, 1) and hi >= high-tolerance:
                faces.append(('xyz'[axis]+'_max', lo >= high-tolerance))
        if faces:
            found.append((s, faces))
    return found


def dispersive_structures_in_pml(project):
    """(structure name, PML faces) of every enabled dispersive structure whose support bounds reach or touch a PML layer."""
    return [(s.name, [face for face, _ in faces]) for s, faces in _pml_contacts(project)]


def negative_permittivity_in_band(material, dt):
    """Whether the discrete (bilinear) Re eps of the material turns negative anywhere below the Nyquist frequency."""
    from .materials import permittivity
    frequencies = np.logspace(-6, np.log10(.4999), 4001)/dt
    return bool(np.any(permittivity(material, frequencies, dt).real < 0))


def stability_warnings(project):
    """Warnings about configurations the long-run stability evidence marks as unsafe (docs/BOUNDARIES.md)."""
    warnings = []
    r = project.region
    contacts = _pml_contacts(project) if r.pml_dispersion == 'ade' else []
    # One band test per material, not per structure: a metalens tile names thousands of posts.
    used = {s.material for s, _ in contacts}
    negative = {m.name: negative_permittivity_in_band(m, r.time_step) for m in project.materials if m.name in used}
    ending, crossing = [], []
    for s, faces in contacts:
        named = f'{s.name} ({", ".join(face for face, _ in faces)})'
        inside = any(ends for _, ends in faces) and negative[s.material]
        (ending if inside else crossing).append(named)
    if ending:
        warnings.append(f'Dispersive material inside PML layers, ending there: {"; ".join(ending)}. A pole whose Re eps turns '
                        'negative in the band of the grid, in a structure that ends inside a CPML layer, is the configuration that '
                        'diverged in the records (a post in the outer cells of a layer corner grows by e^0.057 per step, '
                        'docs/BOUNDARIES.md); set region.pml_dispersion="absorber", whose crossed faces reflect about 1e-2 to 1 at '
                        'oblique incidence and across transverse interfaces, or end the structure before the PML.')
    if crossing:
        warnings.append(f'Dispersive material inside PML layers: {"; ".join(crossing)}. The CPML stayed stable for structures that '
                        'cross the layer from the interior in the records and reflects far less there (4e-9 to 7e-6 per monitor in '
                        'the G3-07 half space, against 0.016 to 1.2 with pml_dispersion="absorber"); keep pml_dispersion="ade" and '
                        'the run-control divergence check, switch to "absorber" only if the run diverges, or end the structure '
                        'before the PML.')
    return warnings
