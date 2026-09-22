"""Independent FSP layout -> native scene conversion with explicit diagnostics.

No Lumerical API is loaded. The immutable original document remains the round-
trip authority. A converted JSON scene is a separate, editable simulation.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

import numpy as np

from .fsp_binary import FspDocument, Node
from .waveforms import pulse_parameters
from .models import Boundaries, BoundaryFace, ImportProvenance, Material, Monitor, FieldMonitor, Project, Region, Source, SourceTimeSettings, TimeSignal, SpectrumSettings, Structure

C0 = 299792458.0
ZERO_UUID = '{00000000-0000-0000-0000-000000000000}'
ROOT = '{ba475c44-6315-46ba-866f-0d85a97d5267}'
FDTD = '{fe02bef9-527c-46fe-9644-0533eafd11d2}'
DIPOLE = '{0164a52e-217d-45f1-900b-e038bffe78a6}'
PLANE = '{361ccac0-cfa0-46be-9e86-de30278d9d2e}'
TFSF = '{c3b168bf-cbac-42ba-bfd4-f1a45d767ac3}'
SOURCE_CLASSES = (DIPOLE, PLANE, TFSF)
TIME = '{3cbd368f-83d1-45a9-8b2b-154d82400a51}'
DFT = '{15879b8f-3efb-45dd-a50f-acd1106124bc}'
STATE = '{5126557e-473e-4885-8285-4461cc51f71a}'


class Unsupported(ValueError):
    pass


def value(node: Node, key):
    if key not in node.properties:
        raise Unsupported(f'Missing required setting: {key}.')
    return node.properties[key].value


def number(node, key):
    v = value(node, key)
    if not isinstance(v, (int, float)) or not math.isfinite(v):
        raise Unsupported(f'{key} must be a finite scalar.')
    return v


def require(node, key, expected):
    if not np.array_equal(value(node, key), expected):
        raise Unsupported(f'{key}={value(node, key)!s} is not yet supported (requires {expected!s}).')


def vector(node, key, count=None):
    result = np.asarray(value(node, key)).reshape(-1)
    if np.iscomplexobj(result) or not np.isfinite(result).all() or (count is not None and len(result) != count):
        raise Unsupported(f'{key} has unsupported dimensions or values.')
    return result


def integral_ceil(ratio):
    nearest = round(ratio)
    return nearest if abs(ratio-nearest) <= max(8*math.ulp(ratio), 1e-10) else math.ceil(ratio)


@dataclass
class Conversion:
    source_sha256: str
    project: Project | None = None
    issues: list[dict] = field(default_factory=list)
    mappings: list[dict] = field(default_factory=list)
    origin_m: tuple = (0, 0, 0)

    def issue(self, node, code, message, severity='error'):
        self.issues.append(dict(severity=severity, code=code, object_id=node.name,
                                record_offset=node.start, message=message))

    def as_dict(self):
        return dict(source_sha256=self.source_sha256, requires_lumerical=False,
                    native_execution_allowed=self.project is not None,
                    fidelity='native discretization; see conversion differences',
                    project=self.project.model_dump() if self.project else None,
                    issues=self.issues, mappings=self.mappings, origin_m=self.origin_m)


def convert_fsp(document: FspDocument, name='Imported FSP', backend='auto') -> Conversion:
    report = Conversion(document.fingerprint())
    fdtds = [n for n in document.root.children if n.uid == FDTD]
    if len(fdtds) != 1:
        report.issue(document.root, 'fdtd_region', 'Exactly one top-level FDTD region is required.')
        return report
    domain = fdtds[0]
    if document.root.uid != ROOT:
        report.issue(document.root, 'model_mapping', 'Unrecognized model root class.')
        return report
    # Model-level scripts and transforms are listed, not fatal, so that every
    # unsupported object below still reaches the report.
    try:
        for key in ('setupscript', 'analysisscript'):
            if value(document.root, key) != '':
                report.issue(document.root, 'model_script', f'The model {key} is not mapped yet; native scenes do not run scripts.')
        require(document.root, 'enabled', 1)
        require(document.root, 'constructionflag', 0)
        for key in 'xyz':
            require(document.root, key, 0)
    except (Unsupported, ValueError) as exc:
        report.issue(document.root, 'model_mapping', str(exc))
    try:
        region, origin = convert_region(domain, backend, report)
        report.origin_m = tuple(origin)
    except (Unsupported, ValueError) as exc:
        report.issue(domain, 'region_mapping', str(exc))
        report.issue(domain, 'region_mapping', 'Structures, sources and monitors were not checked because the FDTD region could not be mapped.', 'warning')
        region = origin = None

    try:
        global_source = source_settings(domain, global_=True)
    except (Unsupported, ValueError) as exc:
        global_source = None
        active_global = any(n.uid in SOURCE_CLASSES and
                            n.properties.get('useGlobalSource') is not None and
                            n.properties['useGlobalSource'].value != 0 for n in document.root.children)
        report.issue(domain, 'global_source_mapping', ('Referenced' if active_global else 'Unused')+
                     ' global source settings could not be imported: '+str(exc), 'error' if active_global else 'warning')
    materials, structures, sources, monitors = [], [], [], []
    global_monitor=None
    referenced_global=any(n.uid==DFT and n.properties.get('useGlobalDFT') is not None and
                          n.properties['useGlobalDFT'].value!=0 for n in document.root.children)
    if referenced_global or 'fStart' in domain.properties:
        try:global_monitor=monitor_spectrum(domain,global_=True)
        except (Unsupported,ValueError) as exc:
            report.issue(domain,'global_monitor_mapping',str(exc),'error' if referenced_global else 'warning')
    for node in document.root.children:
        if node.uid == FDTD:
            # The region contains an observed drawing rectangle, not a scene
            # dielectric. Reject unfamiliar descendants rather than dropping them.
            if any(c.legacy.get('kind') != 6 or c.name != 'rectangle' or c.children for c in node.children):
                report.issue(node, 'region_children', 'Unrecognized objects inside the FDTD record.')
            continue
        if node.uid == STATE:
            if node.children or number(node, 'simulationFlag') != 0:
                report.issue(node, 'simulation_state', 'Saved simulation state is not a layout-only record.')
            continue
        try:
            if node.legacy.get('kind') == 13:
                raise Unsupported(f'Structure group with a setup script and {len(node.children)} script-generated objects is not mapped yet.')
            if node.children:
                raise Unsupported('Hierarchical/group transforms and scripts are not mapped yet.')
            if region is None and (node.legacy.get('kind') in (4, 5, 6, 8, 11) or node.uid in (*SOURCE_CLASSES, TIME, DFT)):
                continue
            if node.legacy.get('kind') in (4, 5, 6, 8, 11):
                shape, material = convert_structure(node, origin, region, document.materials)
                structures.append(shape)
                if not any(m.name == material.name for m in materials): materials.append(material)
                if material.oscillator:
                    report.issue(node, 'material_ade', 'Passive isotropic '+material.model+' coefficients are mapped in rad/s. Native trapezoidal ADE and Yee sampling may differ from Lumerical; compare convergence.', 'warning')
                if material.model == 'drude' and shape.kind != 'rectangle':
                    report.issue(node, 'drude_curve_accuracy', 'Experimental curved Drude geometry: quantitative curved-interface accuracy is not established. Refine space/time and compare material sampling choices.', 'warning')
                mapped = [shape.id]
            elif node.uid == DIPOLE:
                source = convert_source(node, origin, report, global_source)
                sources.append(source); mapped = [source.id]
            elif node.uid in (PLANE, TFSF):
                source = convert_paired_source(node, origin, region, report, global_source)
                sources.append(source); mapped = [source.id]
            elif node.uid in (TIME, DFT):
                outputs = convert_monitor(node, origin, report, region, global_monitor)
                monitors.extend(outputs); mapped = [m.id for m in outputs]
            else:
                raise Unsupported(f'Object class {node.uid} has no native scene mapping yet.')
            report.mappings.append(dict(record_offset=node.start, object_id=node.name, native_ids=mapped))
        except (Unsupported, ValueError) as exc:
            report.issue(node, 'object_mapping', str(exc))
    if not materials and region is not None:
        materials = [Material(name='Background', index=region.background_index)]
    if not any(i['severity'] == 'error' for i in report.issues):
        try:
            candidate = Project(name=name[:120], region=region, materials=materials,
                                     structures=structures, sources=sources, monitors=monitors,
                                     global_source=global_source,
                                     global_monitor=global_monitor or SpectrumSettings(sampling='frequency',apodization='none'),
                                     import_provenance=ImportProvenance(source_sha256=report.source_sha256,
                                         origin_m=report.origin_m, differences=[i['object_id']+': '+i['message'] for i in report.issues]))
            # Paired injection is only valid in its specified incident medium.
            # Catch invalid imported shells before exposing a runnable scene.
            if any(s.enabled and s.injection=='oneway' for s in sources):
                from .solver import voxelize
                from .injection import validate_oneway_materials
                from .tfsf import validate_tfsf_materials
                epsilon,_,ownership=voxelize(candidate,with_ownership=True)
                for source in sources:
                    if not source.enabled or source.injection!='oneway':continue
                    source_node=next(n for n in document.root.children if identity(n)['id']==source.id)
                    try:
                        scene=candidate.model_copy(update={'sources':[source]})
                        validate_oneway_materials(scene,epsilon,ownership)
                        validate_tfsf_materials(scene,epsilon,ownership)
                    except ValueError as exc:
                        report.issue(source_node,'source_environment',str(exc))
            if not any(i['severity']=='error' for i in report.issues):report.project=candidate
        except ValueError as exc:
            report.issue(domain, 'native_validation', str(exc))
    return report


def convert_region(node, backend, report):
    require(node, 'enabled', 1)
    mode = number(node, 'customGrid')
    if mode not in (0, 1, 2):raise Unsupported('Unrecognized saved mesh selection.')
    require(node, 'meshRefineDesired', 5)  # staircase selection, not cached meshRefine
    for key in ('fullSymmetry', 'forceComplex', 'splitFieldFDTD', 'checkpointDuringSimulation', 'checkpointAtShutoff'):
        require(node, key, 0)
    require(node, 'mMaterialId', ZERO_UUID)
    try:
        background = float(value(node, 'mRefIndex'))
    except (TypeError, ValueError):
        raise Unsupported('Background requires a constant, real scalar index.')
    dimension = number(node, 'dimension')
    if dimension not in (0, 1):raise Unsupported('Unrecognized FDTD dimension.')
    active = 2 if dimension == 0 else 3
    spacing = [number(node, 'd'+axis) for axis in 'xyz'[:active]]
    if min(spacing) <= 0:raise Unsupported('Requested mesh spacings must be positive.')
    legacy = mode == 2 and np.allclose(spacing, spacing[0], rtol=1e-10, atol=0)
    layers = vector(node, 'PMLLayersV7p0', 6)
    fields, shape, origin, nodes = {}, [], [], []
    cad_centres = [number(node, 'GUIx'), number(node, 'GUIy'), (number(node, 'GUIz1')+number(node, 'GUIz2'))/2]
    cad_spans = [number(node, 'GUIwidth'), number(node, 'GUIheight'), number(node, 'GUIz2')-number(node, 'GUIz1')]
    for axis in range(active):
        a = 'xyz'[axis]
        kinds = [number(node, f'BCType{2*axis+s}') for s in (0, 1)]
        if any(k not in (0, 1) for k in kinds) or (1 in kinds and kinds != [1, 1]):
            raise Unsupported(f'{a}: boundary codes {kinds} are not mapped yet; only verified PML (0) and paired Periodic (1) FSP boundary codes are.')
        grid = vector(node, a+'Grid')
        if len(grid) < 6 or np.any(np.diff(grid) <= 0):
            raise Unsupported(f'{a}: saved grid must contain strictly increasing nodes.')
        dx = float(np.min(np.diff(grid)))
        if mode == 2 and not np.allclose(np.diff(grid), spacing[axis], rtol=1e-8, atol=spacing[axis]*1e-8):
            raise Unsupported(f'{a}: saved grid is not uniformly spaced at the requested mesh.')
        if kinds == [1, 1]:
            # Saved periodic layouts include one boundary plane on each side.
            widths = np.diff(grid)
            if not np.allclose(widths[[0,-1]], widths[[-2,1]], rtol=1e-8, atol=dx*1e-8):
                raise Unsupported(f'{a}: periodic ghost intervals do not match the opposite boundary.')
            grid = grid[1:-1]
        for side in (0, 1):
            count = int(layers[2*axis+side])
            if count != layers[2*axis+side]:raise Unsupported('Nonintegral PML layer count.')
            if kinds[side] == 0 and not 3 <= count < len(grid)-1:raise Unsupported('Invalid PML layer count.')
            fields[f'{a}_{("min", "max")[side]}'] = BoundaryFace(kind='periodic') if kinds[side] == 1 else BoundaryFace(layers=count)
        low = grid[int(layers[2*axis]) if kinds[0] == 0 else 0]
        high = grid[-1-int(layers[2*axis+1]) if kinds[1] == 0 else -1]
        desired = (cad_centres[axis]-cad_spans[axis]/2, cad_centres[axis]+cad_spans[axis]/2)
        if not np.allclose((low, high), desired, rtol=0, atol=dx*1e-6):
            raise Unsupported(f'{a}: stored mesh bounds do not exactly align with current CAD/PML settings. Regenerate the mesh in Lumerical before import.')
        centre = (grid[0]+grid[-1])/2
        if abs(centre-cad_centres[axis]) < dx*1e-8:centre = cad_centres[axis]
        shape.append(len(grid)-1); origin.append(centre)
        nodes.append(tuple((grid-centre)*1e6))
    if active == 2:
        shape.append(1); origin.append(cad_centres[2])
        nodes.append((-spacing[0]*.5e6,spacing[0]*.5e6))
    cfl = number(node, 'courantFactor')
    dt = number(node, 'dt')
    if dt <= 0:raise Unsupported('Stored timestep must be positive.')
    dx = spacing[0]
    if legacy and not math.isclose(dt, cfl*dx/C0/math.sqrt(active), rel_tol=1e-8):
        raise Unsupported('Stored timestep does not match the requested uniform mesh/CFL settings.')
    steps = integral_ceil(number(node, 'MaxSimTime')/dt)
    common = dict(dimension='2d' if active == 2 else '3d', courant_factor=cfl, steps=steps,
                  boundaries=Boundaries(**fields), background_index=background, backend=backend)
    if legacy:
        region = Region(mesh=dx*1e6,size=tuple(n*dx*1e6 for n in shape),**common)
    else:
        region = Region(mesh=min(float(np.min(np.diff(a))) for a in nodes[:active]),
                        mesh_type='explicit',mesh_coordinates=tuple(nodes),
                        size=tuple(a[-1]-a[0] for a in nodes),material_sampling='yee',
                        time_step_override=dt,**common)
        report.issue(node,'frozen_rectilinear_mesh',
            'Saved rectilinear nodes and a conservative stored timestep are retained. This is a frozen mesh, not the original mesh generator. Geometry edits do not regenerate these nodes. Native material interfaces and CPML can differ.', 'warning')
    if tuple(shape) != region.shape:raise Unsupported('Native mesh dimensions do not match the stored grid.')
    if any(k.kind == 'pml' for k in fields.values()):
        report.issue(node, 'pml_formulation', 'PML layer counts and domain extents are retained. Native CPML coefficients replace Lumerical profiles, whose coefficient definitions differ.', 'warning')
    report.issue(node, 'yee_material_sampling', 'Staircase geometry is retained. Material placement at staggered Yee components and field sampling differ from Lumerical.', 'warning')
    if number(node, 'useAutoShutoffMin'):
        report.issue(node, 'fixed_duration', 'Native execution runs the full maximum simulation time. Lumerical early shutoff is not reproduced.', 'warning')
    if number(node, 'useAutoShutoffMax'):
        report.issue(node, 'divergence_detection', 'Native nonfinite-field checking is active. The Lumerical energy-based divergence threshold is not reproduced.', 'warning')
    return region, np.asarray(origin)


def identity(node):
    return dict(id=f'fsp-{node.start}', name=node.name.rsplit('::', 1)[-1][:100])


def convert_material(records, uid):
    matches = [record for record in records if record.get('materialuuid') and record['materialuuid'].value == uid]
    if len(matches) != 1:
        raise Unsupported('Material UUID must resolve to exactly one material record.')
    record = Node(uid, 0, matches[0])
    require(record, 'anisotropy', 0)
    def isotropic(key):
        matrix = np.asarray(value(record, key))
        if matrix.shape != (3,3) or not np.isfinite(matrix).all() or not np.array_equal(matrix, np.eye(3)*matrix[0,0]):
            raise Unsupported('Material '+key+' must be an isotropic 3 by 3 tensor.')
        return float(matrix[0,0])
    epsilon = isotropic('permittivity')
    kind = number(record, 'type')
    data = dict(name=str(value(record, 'name'))[:50]+' ['+uid.strip('{}')+']')
    if all(key in record.properties for key in ('red','green','blue')):
        rgb = [number(record,key) for key in ('red','green','blue')]
        if any(v<0 or v>1 for v in rgb): raise Unsupported('Invalid material display color.')
        data['color'] = '#'+''.join(f'{round(v*255):02x}' for v in rgb)
    if kind == 0:
        if epsilon < 1: raise Unsupported('Dielectric permittivity must be at least one.')
        data.update(index=math.sqrt(epsilon))
    elif kind == 2:
        data.update(model='drude', epsilon_inf=epsilon, plasma_rad_s=isotropic('omegaplasma'), collision_rad_s=isotropic('nuplasma'))
    elif kind == 4:
        data.update(model='lorentz', epsilon_inf=epsilon, resonance_rad_s=isotropic('omegalorentz'), linewidth_rad_s=isotropic('deltalorentz'), delta_epsilon=isotropic('epsilonlorentz'))
    else:
        raise Unsupported(f'Material type {kind} is not supported. Only isotropic Dielectric, Plasma and Lorentz records are mapped.')
    return Material(**data), number(record, 'priority')


def convert_structure(node, origin, region, material_records=()):
    p, g = node.properties, node.legacy
    if not g.get('transform_metadata_decoded'):
        raise Unsupported('Legacy geometry transformations/expressions are not fully decoded.')
    require(node, 'gridAttributeName', '')
    mesh_order = g['mesh_order']
    if value(node, 'materialuuid') == ZERO_UUID:
        try:
            index = float(g['index_expression'])
        except (TypeError, ValueError):
            raise Unsupported('Spatially varying or tensor index expressions are not supported.')
        if not math.isclose(index, g['index'], rel_tol=1e-12):
            raise Unsupported('Stored index and index expression disagree.')
        material = Material(name=f'FSP n={index:g} [{node.start}]', index=index)
    else:
        material, priority = convert_material(material_records, value(node, 'materialuuid'))
        if not g['override_mesh_order']: mesh_order = priority
    if 'mIsEllipse' in p and number(node,'mIsEllipse') not in (0,1):
        raise Unsupported('Ring ellipse switch must be zero or one.')
    ellipsoid=bool(g.get('make ellipsoid') or ('mIsEllipse' in p and value(node, 'mIsEllipse')))
    kind = {6:'rectangle', 8:'sphere', 4:'circle', 5:'ring',11:'polygon'}[g['kind']]
    extra={}
    if kind == 'rectangle':
        center = [(g[a+' min']+g[a+' max'])/2 for a in 'xyz']
        size = [(g[a+' max']-g[a+' min'])*1e6 for a in 'xyz']
        radius, inner = .5, .3
    elif kind=='polygon':
        if 'pivot_x' not in g or 'pivot_y' not in g:raise Unsupported('Polygon rotation pivot is not decoded.')
        center=[g['pivot_x'],g['pivot_y'],(g['z min']+g['z max'])/2]
        vertices=np.asarray(g['vertices_global'],dtype=float)
        if vertices.ndim!=2 or vertices.shape[1]!=2:raise Unsupported('Polygon vertices require two coordinates.')
        if len(vertices)>1 and np.array_equal(vertices[0],vertices[-1]):vertices=vertices[:-1]
        local=(vertices-np.asarray(center[:2]))*1e6
        size=[float(np.ptp(local[:,0])),float(np.ptp(local[:,1])),(g['z max']-g['z min'])*1e6]
        radius,inner=.5,.3;extra['vertices']=local.tolist()
    else:
        center = [g['x'], g['y'], g['z'] if kind == 'sphere' else (g['z min']+g['z max'])/2]
        radius = g['outer radius' if kind == 'ring' else 'radius']*1e6
        inner = g['inner radius']*1e6 if kind == 'ring' else 0
        size = [2*radius, 2*radius, 2*radius if kind == 'sphere' else (g['z max']-g['z min'])*1e6]
        if kind=='ring':extra.update(theta_start=g['theta start'],theta_stop=g['theta stop'])
    if ellipsoid:
        if kind=='ring':
            extra.update(make_ellipsoid=True,radius_2=number(node,'ro2')*1e6,inner_radius_2=number(node,'ri2')*1e6)
        elif 'radius 2' not in g or (kind=='sphere' and 'radius 3' not in g):
            raise Unsupported('Ellipsoid radii are not completely decoded.')
        else:extra.update(make_ellipsoid=True,radius_2=g['radius 2']*1e6,
                          radius_3=g['radius 3']*1e6 if kind=='sphere' else radius)
    shape = Structure(**identity(node), kind=kind, enabled=g['enabled'], center=tuple((np.asarray(center)-origin)*1e6),
                      size=tuple(size), radius=radius, inner_radius=inner,
                      rotation_axes=tuple(g['rotation_axes']),rotation_angles=tuple(g['rotation_angles']),
                      material=material.name, mesh_order=mesh_order,**extra)
    # Automatic extrusion through PML is not equivalent to clipping a shape.
    if shape.enabled:
        from .geometry import object_bounds
        bound_center,bounds=object_bounds(shape)
        for a in range(2 if region.dimension == '2d' else 3):
            low, high = region.interior_bounds(a)
            if (region.pml_layers(a, 0) and bound_center[a]-bounds[a]/2 < low) or (region.pml_layers(a, 1) and bound_center[a]+bounds[a]/2 > high):
                raise Unsupported('Structure intersects PML. Automatic structure extension through PML is not mapped yet.')
    return shape, material


def source_settings(node, global_=False, local_override=False):
    """Read selected properties, never cached local::pulse::* coefficients."""
    if global_:
        envelope = number(node, 'frequencyEnvelopeType')
        preference = number(node, 'sourcePreference')
        frequency = number(node, 'globalFrequency')
        dc = number(node, 'globalEliminateDC')
        length, offset = number(node, 'pulseLength'), number(node, 'offset')
        optimize = number(node, 'optimizeForShortPulse')
    else:
        prefix = 'local::' if local_override else ''
        envelope = number(node, prefix+'pulseTypeActual' if local_override else 'frequencyEnvelopeType')
        preference = number(node, prefix+'defineSourceBy' if local_override else 'sourcePreference')
        frequency = number(node, prefix+'frequency')
        dc = number(node, prefix+'mEliminateDC')
        length, offset = number(node, prefix+'pulseLength'), number(node, prefix+'offset')
        optimize = number(node, prefix+'optimizeForShortPulse')
    if frequency <= 0:raise Unsupported('Source frequency must be positive.')
    if dc:raise Unsupported('Eliminate-DC source processing is not implemented yet.')
    smooth_key = 'local::eliminateDiscontinuities' if local_override else 'eliminateDiscontinuities'
    smooth = bool(number(node, smooth_key))
    common = dict(wavelength=C0/frequency*1e6, pulse_length=length, pulse_offset=offset,
                  optimize_for_short_pulse=bool(optimize), eliminate_discontinuities=smooth)
    if envelope == 2 and not global_ and not local_override:
        signal = TimeSignal(time_s=vector(node, 'userTime').tolist(), amplitude=vector(node, 'userAmp').tolist(),
                            phase_rad=vector(node, 'userPhs').tolist())
        return SourceTimeSettings(pulse='sampled', signal=signal, time_definition='standard', **common)
    if envelope not in (0,1) or preference not in (0,1,2):
        raise Unsupported('This stored source pulse definition is not mapped yet.')
    if preference == 0 and envelope == 0:
        return SourceTimeSettings(time_definition='standard', **common)
    low_key, high_key = ('local::minGUIFrequency','local::maxGUIFrequency') if local_override else ('BBFrequencyStart','BBFrequencyStop')
    low, high = number(node,low_key), number(node,high_key)
    if low <= 0 or high < low:raise Unsupported('Source frequency range is invalid.')
    result = SourceTimeSettings(pulse='broadband', time_definition={0:'standard',1:'frequency',2:'wavelength'}[preference],
                                wavelength_start=C0/high*1e6, wavelength_stop=C0/low*1e6,
                                chirp_bandwidth_hz=max(high-low,1.), **common)
    parameters = pulse_parameters(result)
    if preference:
        for name, actual, expected in [('frequency',frequency,parameters.frequency_hz),
                ('pulselength',length,parameters.as_dict()['pulse_length_s']),('offset',offset,parameters.offset_s)]:
            if not math.isclose(actual,expected,rel_tol=2e-10,abs_tol=0):
                raise Unsupported(f'Automatic source {name} disagrees with the verified range-generation rule.')
        if int(parameters.chirped) != envelope:
            raise Unsupported('Automatic source pulse type disagrees with the verified bandwidth rule.')
    return result


def source_temporal(node, global_source=None):
    """Preserve local settings separately from the resolved global pulse."""
    use_global = number(node, 'useGlobalSource')
    if use_global not in (0,1):raise Unsupported('Invalid global source inheritance switch.')
    local = source_settings(node, local_override=bool(use_global))
    effective = global_source if use_global else local
    if effective is None:raise Unsupported('The referenced global source settings are not supported.')
    if use_global:
        params = pulse_parameters(effective)
        for key, expected in [('frequency', params.frequency_hz),
                              ('pulseLength', params.as_dict()['pulse_length_s']), ('offset', params.offset_s)]:
            if not math.isclose(number(node, key), expected, rel_tol=1e-10, abs_tol=0):
                raise Unsupported(f'Resolved global source {key} disagrees with the region settings.')
    return local,bool(use_global),effective


def convert_source(node, origin, report, global_source=None):
    require(node, 'sourceType', 0)  # electric dipole
    local,use_global,effective=source_temporal(node,global_source)
    theta, phi = math.radians(number(node, 'theta')), math.radians(number(node, 'angle'))
    direction = np.array([math.sin(theta)*math.cos(phi), math.sin(theta)*math.sin(phi), math.cos(theta)])
    component = int(np.argmax(abs(direction)))
    axial = number(node,'theta') in (0,180) or (number(node,'theta')==90 and number(node,'angle')%360 in (0,90,180,270))
    result = Source(**identity(node), **local.model_dump(), use_global_source=bool(use_global), enabled=bool(number(node, 'enabled')),
                    center=tuple((np.array([number(node, a+'coord') for a in 'xyz'])-origin)*1e6),
                    component='E'+'xyz'[component], amplitude=number(node, 'amplitude0'),
                    theta=None if axial else number(node,'theta'),phi=number(node,'angle'),
                    phase=number(node, 'phase')+(180 if axial and direction[component] < 0 else 0))
    report.issue(node, 'dipole_units', 'Position, Cartesian or theta/phi orientation, carrier frequency, power-FWHM, delay and phase are mapped. Native injection is a reduced-field soft source, not a calibrated Lumerical dipole moment. Vector components use their individual Yee locations.', 'warning')
    report_source_pulse(node,report,effective)
    return result


def report_source_pulse(node, report, effective):
    if effective.pulse == 'sampled':
        report.issue(node, 'sampled_pulse', 'The saved time/amplitude/phase table is retained. Linear interpolation of amplitude and unwrapped phase matches the tested v241 source signals within their saved time range. Native injection is zero outside that range.', 'info')
    elif effective.pulse == 'broadband':
        report.issue(node, 'broadband_pulse', 'Independent range generation, sinusoidal chirp and optional endpoint taper are used. Automatic narrow-band cases select a standard pulse. DC removal is not implemented.', 'info')
    else:
        report.issue(node, 'standard_pulse', 'The analytic standard Gaussian and saved endpoint-taper setting are used. Source amplitudes remain reduced injection units.', 'info')


def paired_polarization(axis, angle):
    """3D E = C(axis) Rz(phi) Rz(polarization) x, at theta=0.

    Encode the documented cyclic Cartesian permutation as native theta/phi.
    Piecewise angles preserve exact zero longitudinal components at cardinals.
    Backward propagation changes k and H, not the real electric basis.
    """
    angle%=360
    if axis==2:return 90.,angle
    if axis==1:return (angle,0.) if angle<=180 else (360-angle,180.)
    if angle<=90:return 90-angle,90.
    if angle<=270:return angle-90,270.
    return 450-angle,90.


def convert_paired_source(node, origin, region, report, global_source=None):
    """Observed v241 plane/TFSF records, normal incidence and linear E only."""
    box=node.uid==TFSF
    codes={3:0,4:1,9:2} if box else {1:0,2:1,5:2}
    code=number(node,'type')
    if code not in codes:raise Unsupported('Unrecognized plane/TFSF injection-axis code.')
    axis=codes[code]
    if region.dimension!='3d':
        raise Unsupported('FSP paired-source polarization is currently mapped for 3D only. The 2D orientation convention requires separate verification. Native 2D paired sources remain available.')
    direction=number(node,'direction')
    if direction not in (0,1):raise Unsupported('Unrecognized plane/TFSF propagation-direction code.')
    require(node,'theta',0)
    if np.any(vector(node,'unfold',6)):raise Unsupported('Source symmetry unfolding is not supported.')
    if not box:
        for key,expected in (('planeWaveSource',1),('planeWaveType',0),('angleDefinition',0),
                             ('polarizationDefinition',0),('useIFT',0),('additionalDelay',0),
                             ('useCustomPupilFunction',0)):
            require(node,key,expected)
    enabled=number(node,'enabled')
    if enabled not in (0,1):raise Unsupported('Source enabled flag must be zero or one.')
    local,use_global,effective=source_temporal(node,global_source)
    center=np.array([number(node,a+'coord') for a in 'xyz'])
    if box:
        low=np.array([number(node,'left'),number(node,'bottom'),number(node,'z1')])
        spans=np.array([number(node,'width'),number(node,'height'),number(node,'z2')-low[2]])
        if min(spans)<=0:raise Unsupported('TFSF box spans must be positive.')
        if not np.allclose(low+spans/2,center,rtol=0,atol=max(spans)*1e-10):
            raise Unsupported('TFSF stored bounds disagree with the source center.')
        spans*=1e6;center=(center-origin)*1e6
    else:
        spans=np.array([number(node,'GUI'+a+'span') for a in 'xyz'])*1e6
        center=(center-origin)*1e6;spans[axis]=0
        clipped=False
        for a in range(3):
            if a==axis:continue
            half=region.actual_size[a]/2;tol=region.mesh*1e-8
            if spans[a]<=0 or center[a]-spans[a]/2>-half+tol or center[a]+spans[a]/2<half-tol:
                raise Unsupported('The plane source must cover the complete transverse periodic cell. A finite aperture cannot be expanded silently.')
            clipped|=abs(center[a])>tol or abs(spans[a]-2*half)>tol
            center[a]=0.;spans[a]=2*half
        if clipped:
            report.issue(node,'plane_cell_support','The uniform normal-incidence source covers the transverse periodic cell. Native support is clipped to that cell while the original FSP remains unchanged.','info')
    theta,phi=paired_polarization(axis,number(node,'phi')+number(node,'polarizationAngle'))
    result=Source(**identity(node),**local.model_dump(),kind='tfsf' if box else 'plane',
                  injection='oneway',normal='xyz'[axis],direction='+' if direction else '-',
                  center=tuple(center),size=tuple(spans),enabled=bool(enabled),
                  component='Ex' if axis==2 else 'Ez',theta=theta,phi=phi,
                  use_global_source=use_global,amplitude=number(node,'amplitude'),phase=number(node,'phase'))
    report.issue(node,'paired_source_units','The 3D source geometry, direction and documented electric polarization are mapped to native discrete paired E/H injection. Amplitude scales the native auxiliary soft drive, not calibrated incident E or source power. Absolute field equivalence is not established.','warning')
    report.issue(node,'incident_line_delay','Native injection retains an eight-cell drive-to-entry delay, finite auxiliary CPML and numerical dispersion. Saved pulse settings are retained, but the incident waveform at the face is not identical to an ideal analytic pulse. Converge the incident line and use a native matched reference.','warning')
    report_source_pulse(node,report,effective)
    return result


def flag(node,key):
    result=number(node,key)
    if result not in (0,1):raise Unsupported(f'{key} must be zero or one.')
    return bool(result)


def monitor_spectrum(node,global_=False):
    spacing=number(node,'sampleSpacing')
    if spacing not in (0,1,2):raise Unsupported('Unrecognized monitor frequency sampling code.')
    wl=flag(node,'useWavelengthSpacing')
    use_source=flag(node,'useSourceLimits')
    common=dict(apodization='none',use_source_limits=use_source)
    if not global_:
        apo=number(node,'apodizationType')
        if apo not in (0,1,2,3):raise Unsupported('Unrecognized monitor apodization code.')
        common.update(apodization={0:'none',1:'full',2:'start',3:'end'}[apo],
                      apodization_center=number(node,'apodizationCenter'),
                      apodization_time_width=number(node,'apodizationWidth'))
    if spacing==2:
        return SpectrumSettings(sampling='custom',custom_frequencies_hz=vector(node,'customFrequencySamples').tolist(),**common)
    low,high=(number(node,k) for k in (('fStart','fEnd') if global_ else ('userF1','userF2')))
    if not 0<low<=high:raise Unsupported('Invalid monitor frequency limits.')
    return SpectrumSettings(sampling='chebyshev' if spacing==1 else 'wavelength' if wl else 'frequency',
        chebyshev_wavelength=wl,chebyshev_nodes='lobatto' if spacing==1 else 'roots',
        wavelength_start=C0/high*1e6,wavelength_stop=C0/low*1e6,
        frequency_points=number(node,'nfreqDesired'),**common)


def convert_monitor(node, origin, report, region=None, global_monitor=None):
    require(node, 'recordInPML', 0)
    require(node, 'simulationType', 0)
    shape=number(node,'monitorShape')
    interpolation=number(node,'spatialAveraging')
    if interpolation not in (0,1):raise Unsupported('Uncollocated monitor components are not mapped. Select nearest mesh cell or specified position interpolation.')
    if node.uid == TIME:
        require(node,'monitorShape',0);require(node,'spatialAveraging',1);require(node,'outputPower',0)
        require(node, 'startTime', 0); require(node, 'stopMethod', 0); require(node, 'downsampleT', 1)
        if np.any(vector(node, 'outputP', 3)):raise Unsupported('Poynting vector recording is not implemented yet.')
        outputs = vector(node, 'outputE', 6)
        spectrum = SpectrumSettings(apodization='none')
        use_global=False;stride=1
    else:
        require(node,'standardDFT',1)
        require(node, 'partialSpectralAverage', 0); require(node, 'totalSpectralAverage', 0)
        if 'unfold' in node.properties and np.any(vector(node,'unfold',6)):
            raise Unsupported('Monitor symmetry unfolding is not supported.')
        use_global=flag(node,'useGlobalDFT')
        if use_global and global_monitor is None:raise Unsupported('Referenced global monitor settings are unavailable.')
        # Local apodization remains active even with global frequency settings.
        if use_global:
            local=global_monitor.model_dump()
            apo=number(node,'apodizationType')
            if apo not in (0,1,2,3):raise Unsupported('Unrecognized monitor apodization code.')
            local.update(apodization={0:'none',1:'full',2:'start',3:'end'}[apo],
                         apodization_center=number(node,'apodizationCenter'),apodization_time_width=number(node,'apodizationWidth'))
            spectrum=SpectrumSettings(**local)
        else:spectrum=monitor_spectrum(node)
        outputs = [flag(node, 'output'+c) for c in ('Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz')]
        stride=number(node,'downsampleT')
        if stride!=int(stride) or stride<1:raise Unsupported('Monitor temporal stride must be a positive integer.')
        stride=int(stride)
        record_power=flag(node,'outputPower')
        poynting=tuple(c for c in 'xyz' if flag(node,'outputP'+c))
        if shape in (4,5,6) or (region is not None and region.dimension=='2d' and shape in (1,2)):
            axis={4:0,5:1,6:2,1:1,2:0}[shape]
            low=np.array([number(node,'left'),number(node,'bottom'),number(node,'z1')])
            size=np.array([number(node,'width'),number(node,'height'),number(node,'z2')-low[2]])
            if size[axis]!=0:raise Unsupported('Monitor shape and normal span disagree.')
            center=(low+size/2-origin)*1e6;size*=1e6
            if region is not None and region.dimension=='2d':center[2]=0;size[2]=1
            downsample=tuple(number(node,'downsample'+c) for c in 'XYZ')
            if any(v!=int(v) or v<1 for v in downsample):raise Unsupported('Monitor spatial strides must be positive integers.')
            result=FieldMonitor(**identity(node),enabled=flag(node,'enabled'),normal='xyz'[axis],
                center=tuple(center),size=tuple(size),downsample_xyz=tuple(int(v) for v in downsample),
                time_downsample=stride,spectrum=spectrum,use_global_monitor=use_global,inherit_apodization=False,
                record_fields=tuple(c for c,on in zip(('Ex','Ey','Ez','Hx','Hy','Hz'),outputs) if on),
                record_poynting=poynting,record_flux=record_power,
                dft_precision='float64' if flag(node,'highPrecisionDFT') else 'field',
                spatial_interpolation='nearest' if interpolation else 'specified')
            report.issue(node,'plane_dft_convention','Native DFT uses the selected field/Poynting/flux outputs and saved temporal stride. E samples start at dt, H at 1.5*dt, with stride*dt quadrature. Spatial strides merge clipped native integration bins. Nearest interpolation snaps the normal coordinate to a native node. Vendor grids, temporal sample phase and spatial quadrature are not identical.','warning')
            report.issue(node,'dft_normalization','Native fields and signed flux are unnormalized reduced integrals. Source-normalized fields, watts and transmission require a native matched reference or a separate calibration.','warning')
            return [result]
        if shape!=0:raise Unsupported('This spatial DFT shape has no native mapping yet.')
        if record_power or poynting:raise Unsupported('Point-monitor power/Poynting outputs are not mapped to scalar time traces.')
        if interpolation!=1:raise Unsupported('Point traces require nearest-cell interpolation.')
        report.issue(node, 'dft_normalization', 'Native point DFT is an unnormalized field integral. Selected E/H traces are sampled at their native Yee locations. Saved temporal stride is used for the postprocessed DFT, while full time traces are retained. Vendor normalization and sample phase are not reproduced.', 'warning')
    if any(v not in (0, 1) for v in outputs):raise Unsupported('Unrecognized monitor component switches.')
    center = np.array([number(node, 'left'), number(node, 'bottom'), number(node, 'z1')])
    selected = [c for c, on in zip(('Ex', 'Ey', 'Ez', 'Hx', 'Hy', 'Hz'), outputs) if on]
    if not selected:raise Unsupported('Monitor has no enabled field components.')
    base = identity(node)
    return [Monitor(id=base['id']+'-'+c, name=base['name']+(' '+c if len(selected)>1 else ''),
                    center=tuple((center-origin)*1e6), enabled=flag(node, 'enabled'),
                    component=c, spectrum=spectrum,time_downsample=stride,
                    use_global_monitor=use_global,inherit_apodization=False) for c in selected]
