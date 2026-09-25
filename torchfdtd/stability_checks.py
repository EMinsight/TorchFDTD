"""Validation-time warnings for configurations known to be unstable in long runs.

These checks read the project only; they change nothing and reject nothing.
/api/validate appends them to the estimate's warnings and `torchfdtd run`
prints them with the run summary.
"""
from __future__ import annotations


def dispersive_structures_in_pml(project):
    """(structure name, PML faces) of every enabled dispersive structure whose support bounds reach a PML layer."""
    from .mesh import object_bounds
    r = project.region
    dispersive = {m.name for m in project.materials if m.oscillators}
    active = 2 if r.dimension == '2d' else 3
    found = []
    for s in project.structures:
        if not s.enabled or s.material not in dispersive:
            continue
        center, size = object_bounds(s)
        faces = []
        for axis in range(active):
            low, high = r.interior_bounds(axis)
            if r.pml_layers(axis, 0) and center[axis]-size[axis]/2 < low:
                faces.append('xyz'[axis]+'_min')
            if r.pml_layers(axis, 1) and center[axis]+size[axis]/2 > high:
                faces.append('xyz'[axis]+'_max')
        if faces:
            found.append((s.name, faces))
    return found


def stability_warnings(project):
    """Warnings about configurations the long-run stability evidence marks as unsafe (docs/BOUNDARIES.md)."""
    warnings = []
    inside = dispersive_structures_in_pml(project)
    if inside and project.region.pml_dispersion == 'ade':
        named = '; '.join(f'{name} ({", ".join(faces)})' for name, faces in inside)
        warnings.append(f'Dispersive material inside PML layers: {named}. The coupled ADE/CPML update is not a stable absorber for '
                        'dispersive media that reach the outer boundary (docs/BOUNDARIES.md); set region.pml_dispersion="absorber" '
                        '(or "frozen" for a dielectric), or end the structure before the PML.')
    return warnings
