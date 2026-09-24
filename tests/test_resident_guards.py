"""Memory-admitted resident execution on the Python API, optional user caps, the server limits and the fused estimate.

The Python API has no fixed size caps: resident execution is admitted by the
memory estimate against the free device memory (host memory on the CPU), and
Region.resident_cell_limit and Project.limits are optional user caps, None by
default. Inside models.server_limits(), which wraps every workbench request,
job thread and modal worker, SERVER_LIMITS apply whatever a project carries
(the route checks are in tests/test_server_security.py). The fused CUDA
resident estimate is checked against the peaks recorded in
docs/validation/resident_memory_fused_3060.json (docs/EXECUTION_MODES.md).
"""
import json
import math
from pathlib import Path

import numpy as np
import pytest
import torch

from torchfdtd import FieldMonitor, Project, Region, Simulation, Source, Structure
from torchfdtd.execution_modes import _resident_fit, resolve_execution
from torchfdtd.models import SERVER_LIMITS, ProjectLimits, demo_project, effective_limit, server_limit, server_limits
from torchfdtd.plan import resolve_plan
from torchfdtd.solver import estimate, run_signature

ROOT = Path(__file__).resolve().parents[1]
RECORD = ROOT/'docs'/'validation'/'resident_memory_fused_3060.json'
CPU_RECORD = dict(cuda=False, cupy=False, gpu=None, gpu_free_bytes=0, gpu_total_bytes=0,
                  host_total_bytes=64*2**30, host_available_bytes=32*2**30)
# 256 x 256 x 128 = 8,388,608 cells: just above the server's resident cell limit.
LARGE = dict(dimension='3d', size=(25.6, 25.6, 12.8), mesh=.1, pml_cells=3, backend='cpu')
LIMIT_FIELDS = ('max_structures', 'max_sources', 'max_monitors', 'max_materials', 'max_mesh_refinements', 'max_monitor_samples')


def structures(count):
    return [Structure(id=f's{i}', center=(0, 0, 0), size=(.1, .1, .1)).model_dump() for i in range(count)]


def wide_plane(**limits):
    """A 3D scene whose z-normal plane holds 19,600 points x 200 frequencies x 6 components (23.5 million samples)."""
    region = Region(dimension='3d', size=(8, 8, 1), mesh=.05, pml_cells=3, steps=40, backend='cpu')
    plane = FieldMonitor(id='plane', normal='z', center=(0, 0, 0), size=(7, 7, 0),
                         spectrum=dict(sampling='frequency', wavelength_start=1., wavelength_stop=1.2,
                                       frequency_points=200, apodization='none'))
    return Project(region=region, limits=ProjectLimits(**limits), sources=[Source(center=(0, 0, 0), wavelength=1.1)],
                   monitors=[plane])


def oversized():
    """One Python-API project above every count and size limit of the server."""
    base = demo_project()
    signal = dict(time_s=list(np.arange(100_001)*1e-18), amplitude=[1.]*100_001, phase_rad=[0.]*100_001)
    sources = [dict(base.sources[0].model_dump(), id=f'src{i}', use_global_source=False) for i in range(513)]
    sources[0].update(pulse='sampled', signal=signal)
    monitors = [dict(base.monitors[0].model_dump(), id=f'mon{i}') for i in range(513)]
    monitors[0]['spectrum'] = dict(sampling='frequency', frequency_points=2002, wavelength_start=1.3, wavelength_stop=1.8)
    monitors[1]['spectrum'] = dict(sampling='custom', custom_frequencies_hz=list(np.linspace(1.6e14, 2.3e14, 2002)))
    materials = [*base.model_dump()['materials'], *[dict(name=f'm{i}', index=1.5) for i in range(97)]]
    region = dict(base.region.model_dump(), steps=100_001,
                  mesh_refinements=[dict(center=(0, 0, 0), size=(.1, .1, .1)) for _ in range(65)])
    return dict(base.model_dump(), region=region, materials=materials, structures=structures(1001), sources=sources,
                monitors=monitors)


# Each part of oversized() that one server limit refuses, with the refusal the server reports.
SERVER_CASES = {
    'structures': '1,001 structures exceed the limit of 1,000', 'sources': '513 sources exceed the limit of 512',
    'monitors': '513 monitors exceed the limit of 512', 'materials': '101 materials exceed the limit of 100',
    'mesh_refinements': '65 mesh refinements exceed the limit of 64', 'steps': '100,001 time steps exceed the limit of 100,000',
    'frequency_points': '2,002 frequency points exceed the limit of 2,001',
    'custom_frequencies': '2,002 custom frequencies exceed the limit of 2,001',
    'signal_samples': '100,001 source signal samples exceed the limit of 100,000'}


def single_oversized(field, payload=None):
    """The demo project with one part of oversized() above its server limit."""
    payload, base = payload or oversized(), demo_project().model_dump()
    single = dict(base)
    if field in ('structures', 'sources', 'monitors', 'materials'):
        single[field] = payload[field]
    elif field in ('mesh_refinements', 'steps'):
        single['region'] = dict(base['region'], **{field: payload['region'][field]})
    elif field == 'signal_samples':
        single['sources'] = [payload['sources'][0]]
    else:
        single['monitors'] = [payload['monitors'][{'frequency_points': 0, 'custom_frequencies': 1}[field]]]
    return single


# ------------------------------------------------------------------------------------------ defaults and JSON
def test_defaults_are_uncapped_and_stay_out_of_the_json():
    p = demo_project()
    assert p.region.resident_cell_limit is None
    assert all(getattr(p.limits, name) is None for name in LIMIT_FIELDS)
    # A project without caps serializes exactly as before the fields existed, so its content
    # hash is unchanged and a reader without the fields (extra='forbid') still loads it.
    for dump in (p.model_dump(), json.loads(p.model_dump_json()), p.model_dump(mode='json')):
        assert 'limits' not in dump and 'resident_cell_limit' not in dump['region']
    assert "'limits'" not in p.python_script() and 'resident_cell_limit' not in p.python_script()
    assert effective_limit(None, 'structures') is None and server_limit('structures') is None


def test_old_project_json_loads_unchanged_and_caps_round_trip(tmp_path):
    for path in sorted((ROOT/'tests'/'fixtures'/'projects').glob('*.json')):
        payload = json.loads(path.read_text(encoding='utf-8'))
        payload = payload.get('project', payload)
        if not isinstance(payload, dict) or 'region' not in payload and 'schema_version' not in payload:
            continue
        project = Project.model_validate(payload)
        assert project.limits == ProjectLimits() and project.region.resident_cell_limit is None, path.name
        dumped = json.loads(project.model_dump_json())
        assert 'limits' not in dumped and 'resident_cell_limit' not in dumped['region'], path.name
    capped = demo_project()
    capped.limits = ProjectLimits(max_structures=5, max_monitor_samples=50_000_000)
    capped.region.resident_cell_limit = 9_000_000
    capped = Project.model_validate(capped.model_dump())
    dumped = capped.model_dump()
    assert dumped['limits'] == dict({name: None for name in LIMIT_FIELDS}, max_structures=5, max_monitor_samples=50_000_000)
    assert dumped['region']['resident_cell_limit'] == 9_000_000
    capped.save(tmp_path/'capped.json')
    loaded = Project.load(tmp_path/'capped.json')
    assert loaded.limits == capped.limits and loaded.region.resident_cell_limit == 9_000_000
    assert loaded.content_hash() == capped.content_hash() != demo_project().content_hash()


@pytest.mark.parametrize('value', [0, -1, True, 1.5, 9e6, '9000000', 'many'])
def test_limits_accept_only_positive_integers_or_none(value):
    builds = [lambda v: Region(resident_cell_limit=v)]+[lambda v, name=name: ProjectLimits(**{name: v}) for name in LIMIT_FIELDS]
    for build in builds:
        with pytest.raises(ValueError):
            build(value)
    with pytest.raises(ValueError):
        Project.model_validate_json(json.dumps({'region': {'resident_cell_limit': value}}))
    assert Region(resident_cell_limit=None).resident_cell_limit is None
    assert ProjectLimits() == ProjectLimits.model_validate_json(json.dumps({name: None for name in LIMIT_FIELDS}))


# ------------------------------------------------------------------------------------------------ Python API
def test_python_api_admits_resident_grids_by_memory_and_applies_a_user_cap():
    region = Region(**LARGE, execution_mode='resident')
    assert math.prod(region.shape) == 8_388_608 and region.resident_refusal() is None
    region.require_resident()
    Simulation(Project(region=region, sources=[Source(center=(0, 0, 0))]))
    Region(**LARGE, execution_mode='resident', resident_cell_limit=9_000_000).require_resident()
    with pytest.raises(ValueError, match=r'resident_cell_limit=5,000,000 cells, and the grid has 8,388,608'):
        Region(**LARGE, execution_mode='resident', resident_cell_limit=5_000_000)
    with pytest.raises(ValueError, match='resident_cell_limit=1,000'):
        Simulation(Project(region=Region(resident_cell_limit=1_000), sources=[Source(center=(0, 0, 0))]))


def test_auto_policy_admits_resident_by_the_estimate(tmp_path):
    p = Project(region=Region(**LARGE), sources=[Source(center=(0, 0, 0))])
    summary = estimate(p)
    record = resolve_execution(p, health=CPU_RECORD, scratch=tmp_path, summary=summary)
    assert record['mode'] == 'resident' and record['resident']['fits'] and record['resident']['cell_limit'] is None
    # The same scene is refused as resident once its estimate exceeds 80% of the available host memory.
    required = int(summary['estimated_memory_mb']*2**20)
    fit = _resident_fit(p, summary, 'cpu', dict(CPU_RECORD, host_available_bytes=int(required/.8)-2**20), math.prod(p.region.shape))
    assert not fit['fits'] and 'exceeds 80%' in fit['reason']
    capped = Project(region=Region(**LARGE, resident_cell_limit=8_000_000), sources=[Source(center=(0, 0, 0))])
    fit = _resident_fit(capped, summary, 'cpu', CPU_RECORD, math.prod(p.region.shape))
    assert not fit['fits'] and fit['reason'] == '8,388,608 cells exceed the resident limit of 8,000,000'
    with server_limits():
        fit = _resident_fit(p, summary, 'cpu', CPU_RECORD, math.prod(p.region.shape))
    assert not fit['fits'] and fit['cell_limit'] == SERVER_LIMITS['resident_cells']


def test_cpu_simulation_is_admitted_by_the_available_host_memory(monkeypatch):
    p = demo_project()
    p.region.backend = 'cpu'
    required = int(estimate(p)['estimated_memory_mb']*2**20)
    monkeypatch.setattr('torchfdtd.memory_profile.host_memory', lambda: dict(total_bytes=4*required, available_bytes=required))
    with pytest.raises(ValueError, match='Insufficient available host memory'):
        Simulation(p).run()


def test_the_32_bit_field_index_bound_holds_without_a_cell_limit():
    # 1000 x 1000 x 716 real cells: 3 x cells reaches 2**31, which the fused kernels cannot address.
    settings = dict(dimension='3d', size=(100., 100., 71.6), mesh=.1, pml_cells=3)
    with pytest.raises(ValueError, match='signed 32-bit indices, which 716,000,000 cells exceed'):
        Region(**settings, execution_mode='resident')
    region = Region(**settings)
    assert 3*math.prod(region.shape) >= 2**31 and 'signed 32-bit' in region.resident_refusal()
    project = Project(region=region, sources=[Source(center=(0, 0, 0))])
    fit = _resident_fit(project, dict(estimated_memory_mb=1.), 'cpu', dict(CPU_RECORD, host_available_bytes=2**50), math.prod(region.shape))
    assert not fit['fits'] and 'signed 32-bit' in fit['reason'] and fit['cell_limit'] is None
    below = Region(**{**settings, 'size': (100., 100., 71.5)}, execution_mode='resident')
    assert 3*math.prod(below.shape) < 2**31 and below.resident_refusal() is None


def test_python_api_lifts_the_count_and_size_constraints():
    p = Project.model_validate(oversized())
    assert (len(p.structures), len(p.sources), len(p.monitors), len(p.materials), len(p.region.mesh_refinements)) == (1001, 513, 513, 101, 65)
    assert p.region.steps == 100_001 and len(p.sources[0].signal.time_s) == 100_001
    assert p.monitors[0].spectrum.frequency_points == 2002 and len(p.monitors[1].spectrum.custom_frequencies_hz) == 2002


@pytest.mark.parametrize('name, what', [('max_structures', 'structures'), ('max_sources', 'sources'), ('max_monitors', 'monitors'),
                                        ('max_materials', 'materials'), ('max_mesh_refinements', 'mesh refinements')])
def test_user_caps_refuse_each_list(name, what):
    payload = oversized()
    counts = dict(max_structures=1001, max_sources=513, max_monitors=513, max_materials=101, max_mesh_refinements=65)
    with pytest.raises(ValueError, match=f'{counts[name]:,} {what} exceed the limit of 3'):
        Project.model_validate(dict(payload, limits={name: 3}))
    assert getattr(Project.model_validate(dict(payload, limits={name: counts[name]})).limits, name) == counts[name]


def test_monitor_samples_are_admitted_by_the_estimate_with_an_optional_cap():
    summary = estimate(wide_plane())
    assert summary['estimated_memory_mb'] > 0
    with pytest.raises(ValueError, match='frequency field buffer of 23,520,000 complex samples exceeds the limit of 20,000,000'):
        resolve_plan(wide_plane(max_monitor_samples=20_000_000))
    assert resolve_plan(wide_plane()).resources['cells'] == 160*160*20
    with server_limits(), pytest.raises(ValueError, match='exceeds the limit of 12,000,000'):
        estimate(wide_plane())


def test_estimate_covers_steps_through_traces_windows_and_source_waveforms():
    p = demo_project('3d')
    long = Project.model_validate(dict(p.model_dump(), region=dict(p.region.model_dump(), steps=200_000)))
    short, extended = estimate(p), estimate(long)
    assert short['source_waveform_estimated_bytes'] == p.region.steps*4
    assert extended['source_waveform_estimated_bytes'] == 200_000*4
    assert extended['point_trace_estimated_bytes'] > short['point_trace_estimated_bytes']
    grown = (extended['source_waveform_estimated_bytes']+extended['point_trace_estimated_bytes']
             -short['source_waveform_estimated_bytes']-short['point_trace_estimated_bytes'])/2**20
    assert extended['estimated_memory_mb']-short['estimated_memory_mb'] == pytest.approx(grown, abs=.1)


def test_tiles_inherit_the_project_limits():
    from test_tiled import small_row
    from torchfdtd.tiled import plan_tiles
    p = small_row()
    p.limits = ProjectLimits(max_structures=5000, max_monitor_samples=20_000_000)
    p.region.resident_cell_limit = 20_000_000
    plan = plan_tiles(Project.model_validate(p.model_dump()), 1.5, .5)
    assert len(plan.tiles) > 1
    for tile in plan.tiles:
        assert tile.project.limits == p.limits and tile.project.region.resident_cell_limit == 20_000_000


def test_limits_change_admission_not_the_plan_identity():
    from torchfdtd.identity import identity
    p = demo_project('3d')
    capped = Project.model_validate({**p.model_dump(), 'limits': {'max_structures': 10, 'max_monitor_samples': 10**7},
                                     'region': {**p.region.model_dump(), 'resident_cell_limit': 10**7}})
    before, after = resolve_plan(p), resolve_plan(capped)
    assert before.plan_hash == after.plan_hash and before.diff(after) == []
    assert identity(before) == identity(after) and before.placement == after.placement
    assert run_signature(p, p.region.steps) == run_signature(capped, p.region.steps)


# ------------------------------------------------------------------------------------------ server context
# The routes are covered by tests/test_server_security.py::test_every_server_limit_refuses_an_oversized_request.
@pytest.mark.parametrize('field', list(SERVER_CASES))
def test_server_limits_refuse_each_oversized_part(field):
    single = single_oversized(field)
    Project.model_validate(single)
    with server_limits(), pytest.raises(ValueError, match=SERVER_CASES[field]):
        Project.model_validate(single)
    # A cap carried by the project can lower a server limit but never raise it.
    with server_limits():
        assert effective_limit(None, 'structures') == effective_limit(10**9, 'structures') == 1000
        assert effective_limit(10, 'structures') == 10


def test_server_limits_leave_the_submitted_project_unchanged():
    payload = dict(demo_project().model_dump(), limits={'max_structures': 10**6, 'max_monitor_samples': 10**9})
    payload['region'] = dict(payload['region'], resident_cell_limit=10**9)
    with server_limits():
        p = Project.model_validate(payload)
        assert p.region.resident_cell_limit == 10**9 and p.limits.max_structures == 10**6
        assert effective_limit(p.region.resident_cell_limit, 'resident_cells') == SERVER_LIMITS['resident_cells']
    assert Project.model_validate(payload).model_dump()['limits']['max_structures'] == 10**6


def test_server_executor_threads_run_under_the_server_limits():
    from torchfdtd.server import ServerExecutor
    with ServerExecutor(max_workers=1) as pool:
        assert pool.submit(server_limit, 'resident_cells').result() == SERVER_LIMITS['resident_cells']
        assert pool.submit(effective_limit, 10**9, 'monitor_samples').result() == SERVER_LIMITS['monitor_samples']
    assert server_limit('resident_cells') is None


def test_the_server_modal_worker_runs_under_the_server_limits(monkeypatch):
    from torchfdtd import mode_network_project
    from torchfdtd.mode_network_worker import mode_network_worker
    seen, sent = [], []

    def validate(snapshot):
        seen.append(server_limit('structures'))
        raise ValueError('stop')

    class Connection:
        def send_bytes(self, payload):
            sent.append(json.loads(payload))

        def close(self):
            pass
    monkeypatch.setattr(mode_network_project.ModeNetworkConfig, 'model_validate', staticmethod(validate))
    mode_network_worker({}, 'unused', Connection())
    assert seen == [SERVER_LIMITS['structures']] and sent[-1]['type'] == 'error'


# ------------------------------------------------------------------------------------------------ estimate
def test_estimate_selects_the_fused_model_only_for_explicit_real_fused_cuda():
    p = demo_project('3d')
    for backend, kernel, model in (('cuda', 'fused', 'fused_cuda'), ('cuda', 'torch', 'tensor_expression'),
                                   ('auto', 'fused', 'tensor_expression'), ('cpu', 'fused', 'tensor_expression')):
        q = Project.model_validate({**p.model_dump(), 'region': {**p.region.model_dump(), 'backend': backend, 'cuda_kernel': kernel}})
        assert estimate(q)['memory_model'] == model
    large = [Project(region=Region(**{**LARGE, 'backend': 'cuda'}, cuda_kernel=kernel), sources=[Source(center=(0, 0, 0))])
             for kernel in ('fused', 'torch')]
    assert estimate(large[0])['estimated_memory_mb'] < estimate(large[1])['estimated_memory_mb']


def _recorded_projects(case):
    from benchmarks import resident_memory_fused as bench
    if case['projects'] is None:
        return [bench.metalens_tile(case['metalens'])]
    return [Project.model_validate(p) for p in case['projects']]


def test_estimate_bounds_every_recorded_peak():
    record = json.loads(RECORD.read_text(encoding='utf-8'))
    assert record['kind'] == 'resident_memory' and record['environment']['device']
    names = set()
    for case in record['cases']:
        names.add(case['name'])
        projects = _recorded_projects(case)
        assert len(projects) == case['batch'] and math.prod(projects[0].region.shape) == case['cells']
        summaries = [estimate(p) for p in projects]
        assert {s['memory_model'] for s in summaries} == {'fused_cuda' if case['kernel'] == 'fused' else 'tensor_expression'}
        current = sum(int(round(s['estimated_memory_mb']*2**20)) for s in summaries)
        # The record was made with this model; a changed model must be measured again.
        assert current == case['estimate_bytes'], case['name']
        assert case['finite'] and case['peak_allocated_bytes'] <= case['peak_reserved_bytes']
        assert current >= case['peak_reserved_bytes'], (case['name'], current, case['peak_reserved_bytes'])
    for required in ('fused-f32-cpml-64m', 'fused-f32-periodic-64m', 'fused-f32-plane-16m', 'fused-f32-lorentz-16m',
                     'fused-f64-cpml-32m', 'fused-f32-metalens-62m', 'torch-f32-cpml-16m', 'tensor-batch-f32-2x16m'):
        assert required in names


def test_record_states_the_prediction_for_the_rtx_5880_tile():
    from benchmarks import resident_memory_fused as bench
    reference = json.loads(RECORD.read_text(encoding='utf-8'))['reference_5880']
    assert reference == bench.reference_5880()
    assert reference['shape'] == [2050, 2050, 103] and reference['cells'] == 432_857_500 and reference['pillars'] == 19_881
    assert reference['measured_peak_gb'] == 25.6 and reference['memory_model'] == 'fused_cuda'
    # The estimate stays above the measured peak read in either unit.
    assert reference['estimate_bytes'] > 25.6*2**30


@pytest.mark.skipif(not torch.cuda.is_available(), reason='CUDA unavailable')
def test_a_fused_run_stays_within_its_estimate():
    pytest.importorskip('cupy')
    from benchmarks import resident_memory_fused as bench
    project = bench.project(bench._case((100, 100, 100)))
    torch.cuda.synchronize()
    start = torch.cuda.memory_allocated()
    torch.cuda.reset_peak_memory_stats()
    result = Simulation(project).run()
    peak = torch.cuda.max_memory_allocated()-start
    assert np.isfinite(result.electric).all()
    assert result.summary['memory_model'] == 'fused_cuda'
    assert 0 < peak <= result.summary['estimated_memory_mb']*2**20
