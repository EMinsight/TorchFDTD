"""The size guards and their Python opt-in, the server's refusal to raise them, and the fused resident estimate.

Region.resident_cell_limit and Project.limits (max_structures, max_monitor_samples)
default to the historical guards and raise them only when a Python caller sets
them. Inside models.default_guards(), which wraps every workbench request, a
carried limit can lower a guard but never raise it (the server check is in
tests/test_server_security.py). A small fused CUDA run stays within the
calibrated resident estimate (docs/EXECUTION_MODES.md).
"""
import json
import math
from pathlib import Path

import numpy as np
import pytest
import torch

from torchfdtd import FieldMonitor, Project, Region, Simulation, Source, Structure
from torchfdtd.execution_modes import _resident_fit, resolve_execution
from torchfdtd.models import (MAX_MONITOR_SAMPLES, MAX_STRUCTURES, RESIDENT_CELL_LIMIT, ProjectLimits, default_guards,
                              demo_project)
from torchfdtd.plan import resolve_plan
from torchfdtd.solver import estimate, run_signature

ROOT = Path(__file__).resolve().parents[1]
CPU_RECORD = dict(cuda=False, cupy=False, gpu=None, gpu_free_bytes=0, gpu_total_bytes=0,
                  host_total_bytes=64*2**30, host_available_bytes=32*2**30)
# 256 x 256 x 128 = 8,388,608 cells: just above the default resident cell guard.
LARGE = dict(dimension='3d', size=(25.6, 25.6, 12.8), mesh=.1, pml_cells=3, backend='cpu')


def structures(count):
    return [Structure(id=f's{i}', center=(0, 0, 0), size=(.1, .1, .1)).model_dump() for i in range(count)]


def wide_plane(**limits):
    """A 3D scene whose z-normal plane holds 19,881 points x 200 frequencies x 6 components (23.9 million samples)."""
    region = Region(dimension='3d', size=(8, 8, 1), mesh=.05, pml_cells=3, steps=40, backend='cpu')
    plane = FieldMonitor(id='plane', normal='z', center=(0, 0, 0), size=(7, 7, 0),
                         spectrum=dict(sampling='frequency', wavelength_start=1., wavelength_stop=1.2,
                                       frequency_points=200, apodization='none'))
    return Project(region=region, limits=ProjectLimits(**limits), sources=[Source(center=(0, 0, 0), wavelength=1.1)],
                   monitors=[plane])


# ------------------------------------------------------------------------------------------ defaults and JSON
def test_defaults_are_the_historical_guards_and_stay_out_of_the_json():
    p = demo_project()
    assert p.region.resident_cell_limit == RESIDENT_CELL_LIMIT == 8_000_000
    assert (p.limits.max_structures, p.limits.max_monitor_samples) == (MAX_STRUCTURES, MAX_MONITOR_SAMPLES) == (1000, 12_000_000)
    # A project at the defaults serializes exactly as before the fields existed, so its content
    # hash is unchanged and a reader without the fields (extra='forbid') still loads it.
    for dump in (p.model_dump(), json.loads(p.model_dump_json()), p.model_dump(mode='json')):
        assert 'limits' not in dump and 'resident_cell_limit' not in dump['region']
    assert "'limits'" not in p.python_script() and 'resident_cell_limit' not in p.python_script()


def test_old_project_json_loads_unchanged_and_raised_limits_round_trip(tmp_path):
    for path in sorted((ROOT/'tests'/'fixtures'/'projects').glob('*.json')):
        payload = json.loads(path.read_text(encoding='utf-8'))
        payload = payload.get('project', payload)
        if not isinstance(payload, dict) or 'region' not in payload and 'schema_version' not in payload:
            continue
        project = Project.model_validate(payload)
        assert project.limits == ProjectLimits() and project.region.resident_cell_limit == RESIDENT_CELL_LIMIT, path.name
        dumped = json.loads(project.model_dump_json())
        assert 'limits' not in dumped and 'resident_cell_limit' not in dumped['region'], path.name
    raised = demo_project()
    raised.limits = ProjectLimits(max_structures=None, max_monitor_samples=50_000_000)
    raised.region.resident_cell_limit = None
    raised = Project.model_validate(raised.model_dump())
    dumped = raised.model_dump()
    assert dumped['limits'] == dict(max_structures=None, max_monitor_samples=50_000_000)
    assert dumped['region']['resident_cell_limit'] is None
    raised.save(tmp_path/'raised.json')
    loaded = Project.load(tmp_path/'raised.json')
    assert loaded.limits == raised.limits and loaded.region.resident_cell_limit is None
    assert loaded.content_hash() == raised.content_hash() != demo_project().content_hash()
    lowered = Project.model_validate({**demo_project().model_dump(), 'limits': {'max_structures': 5}})
    assert lowered.limits == ProjectLimits(max_structures=5) and lowered.model_dump()['limits']['max_structures'] == 5


@pytest.mark.parametrize('value', [0, -1, True, 1.5, 9e6, '9000000', 'many'])
def test_limits_accept_only_positive_integers_or_none(value):
    for build in (lambda v: Region(resident_cell_limit=v), lambda v: ProjectLimits(max_structures=v),
                  lambda v: ProjectLimits(max_monitor_samples=v)):
        with pytest.raises(ValueError):
            build(value)
    with pytest.raises(ValueError):
        Project.model_validate_json(json.dumps({'region': {'resident_cell_limit': value}}))
    assert Region(resident_cell_limit=None).resident_cell_limit is None
    assert ProjectLimits(max_structures=None, max_monitor_samples=None) == ProjectLimits.model_validate_json(
        '{"max_structures": null, "max_monitor_samples": null}')


# ------------------------------------------------------------------------------------------------ opt-in
def test_resident_cell_limit_opt_in_admits_a_larger_resident_grid():
    with pytest.raises(ValueError, match='Resident execution is limited to 8 million cells'):
        Region(**LARGE, execution_mode='resident')
    region = Region(**LARGE, execution_mode='resident', resident_cell_limit=None)
    assert math.prod(region.shape) == 8_388_608 and region.resident_refusal() is None
    region.require_resident()
    Simulation(Project(region=region, sources=[Source(center=(0, 0, 0))]))
    Region(**LARGE, execution_mode='resident', resident_cell_limit=9_000_000).require_resident()
    with pytest.raises(ValueError, match=r'resident_cell_limit=5,000,000 cells, and the grid has 8,388,608'):
        Region(**LARGE, execution_mode='resident', resident_cell_limit=5_000_000)
    # A lowered limit refuses a default-sized grid too.
    with pytest.raises(ValueError, match='resident_cell_limit=1,000'):
        Simulation(Project(region=Region(resident_cell_limit=1_000), sources=[Source(center=(0, 0, 0))]))


def test_auto_policy_reads_the_region_cell_limit(tmp_path):
    raised = Project(region=Region(**LARGE, resident_cell_limit=None), sources=[Source(center=(0, 0, 0))])
    record = resolve_execution(raised, health=CPU_RECORD, scratch=tmp_path, summary=estimate(raised))
    assert record['mode'] == 'resident' and record['resident']['fits'] and record['resident']['cell_limit'] is None
    default = Project(region=Region(**LARGE), sources=[Source(center=(0, 0, 0))])
    record = resolve_execution(default, health=CPU_RECORD, scratch=tmp_path, summary=estimate(default))
    assert not record['resident']['fits'] and record['resident']['cell_limit'] == RESIDENT_CELL_LIMIT
    assert record['resident']['reason'] == '8,388,608 cells exceed the resident limit of 8,000,000'


def test_the_32_bit_field_index_bound_holds_without_a_cell_limit():
    # 1000 x 1000 x 716 real cells: 3 x cells reaches 2**31, which the fused kernels cannot address.
    settings = dict(dimension='3d', size=(100., 100., 71.6), mesh=.1, pml_cells=3, resident_cell_limit=None)
    with pytest.raises(ValueError, match='signed 32-bit indices, which 716,000,000 cells exceed'):
        Region(**settings, execution_mode='resident')
    region = Region(**settings)
    assert 3*math.prod(region.shape) >= 2**31 and 'signed 32-bit' in region.resident_refusal()
    project = Project(region=region, sources=[Source(center=(0, 0, 0))])
    fit = _resident_fit(project, dict(estimated_memory_mb=1.), 'cpu', dict(CPU_RECORD, host_available_bytes=2**50), math.prod(region.shape))
    assert not fit['fits'] and 'signed 32-bit' in fit['reason'] and fit['cell_limit'] is None
    below = Region(**{**settings, 'size': (100., 100., 71.5)}, execution_mode='resident')
    assert 3*math.prod(below.shape) < 2**31 and below.resident_refusal() is None


def test_structure_limit_opt_in():
    base = demo_project().model_dump()
    with pytest.raises(ValueError, match='1,001 structures exceed the limit of 1,000'):
        Project.model_validate({**base, 'structures': structures(1001)})
    for cap in (1001, None):
        p = Project.model_validate({**base, 'limits': {'max_structures': cap}, 'structures': structures(1001)})
        assert len(p.structures) == 1001
        assert len(Project.model_validate(p.model_dump()).structures) == 1001
    with pytest.raises(ValueError, match='3 structures exceed the limit of 2'):
        Project.model_validate({**base, 'limits': {'max_structures': 2}, 'structures': structures(3)})


def test_monitor_sample_limit_opt_in():
    with pytest.raises(ValueError, match='frequency field buffer exceeds 12 million complex samples'):
        estimate(wide_plane())
    for cap in (30_000_000, None):
        summary = estimate(wide_plane(max_monitor_samples=cap))
        assert summary['estimated_memory_mb'] > 0
    with pytest.raises(ValueError, match='frequency field buffer exceeds 20,000,000 complex samples'):
        resolve_plan(wide_plane(max_monitor_samples=20_000_000))
    assert resolve_plan(wide_plane(max_monitor_samples=None)).resources['cells'] == 160*160*20


def test_tiles_inherit_the_project_limits():
    from test_tiled import small_row
    from torchfdtd.tiled import plan_tiles
    p = small_row()
    p.limits = ProjectLimits(max_structures=5000, max_monitor_samples=None)
    p.region.resident_cell_limit = 20_000_000
    plan = plan_tiles(Project.model_validate(p.model_dump()), 1.5, .5)
    assert len(plan.tiles) > 1
    for tile in plan.tiles:
        assert tile.project.limits == p.limits and tile.project.region.resident_cell_limit == 20_000_000


def test_limits_change_admission_not_the_plan_identity():
    from torchfdtd.identity import identity
    p = demo_project('3d')
    raised = Project.model_validate({**p.model_dump(), 'limits': {'max_structures': None, 'max_monitor_samples': None},
                                     'region': {**p.region.model_dump(), 'resident_cell_limit': None}})
    before, after = resolve_plan(p), resolve_plan(raised)
    assert before.plan_hash == after.plan_hash and before.diff(after) == []
    assert identity(before) == identity(after) and before.placement == after.placement
    assert run_signature(p, p.region.steps) == run_signature(raised, p.region.steps)


# ------------------------------------------------------------------------------------------ server context
# The server's refusal is tests/test_server_security.py::test_raised_size_limits_do_not_lift_the_server_caps.
def test_default_guards_clamp_raised_limits_and_keep_lowered_ones():
    raised = {**demo_project().model_dump(), 'limits': {'max_structures': None, 'max_monitor_samples': 10**9}}
    raised['region'] = {**raised['region'], 'resident_cell_limit': 10**9}
    with default_guards():
        p = Project.model_validate(raised)
        lowered = ProjectLimits(max_structures=10)
        assert Region(resident_cell_limit=None).resident_cell_limit == RESIDENT_CELL_LIMIT
    assert p.limits == ProjectLimits() and p.region.resident_cell_limit == RESIDENT_CELL_LIMIT
    assert lowered.max_structures == 10
    # Outside the block the same payload keeps its raised limits.
    assert Project.model_validate(raised).region.resident_cell_limit == 10**9


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
