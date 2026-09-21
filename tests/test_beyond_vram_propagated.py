"""The propagated beyond-VRAM case: declared cases, the rehearsal record, the report and the time model.

Nothing here simulates. The rehearsal record under docs/validation/g5 is judged
against the declared cases exactly as the workstation record will be, and the
wall-time model of the driver is checked against the recorded runs it was
fitted on.
"""
import json
import math
from argparse import Namespace
from pathlib import Path

import pytest

from benchmarks.beyond_vram_propagated import TIME_MODEL, fixture, pillar_mask, plan, time_estimate
from benchmarks.report_beyond_vram_propagated import evaluate, load_cases, render, sanitize

ROOT = Path(__file__).resolve().parents[1]
REHEARSAL = ROOT/'docs/validation/g5/G5-05_rehearsal_3060.json'


@pytest.fixture(scope='module')
def cases():
    return load_cases(ROOT)


@pytest.fixture(scope='module')
def rehearsal():
    return sanitize(json.loads(REHEARSAL.read_text(encoding='utf-8')))


def test_cases_are_declared_before_the_run_and_match_the_fixture_generator(cases):
    for task in ('G5-05', 'G5-06'):
        case = cases[task]
        assert case['kind'] == 'acceptance_case' and case['task'] == task and case['declared_before_run'] is True
    declared = cases['G5-05']['fixture']
    spec = fixture(declared['footprint_um'], declared['mesh_um'], duration_fs=175.)
    region = spec['project'].region
    assert list(region.shape) == declared['grid'] and region.steps == declared['steps']
    assert math.prod(region.shape) == declared['cells'] and len(spec['radii']) == declared['pillars']
    assert list(spec['pillar_layers']) == declared['pillar_layers']
    assert 6*math.prod(region.shape)*4 == declared['planner']['eh_bytes']
    workstation = cases['G5-05']['acceptance']['fixture_of_record']['workstation']
    assert workstation['grid'] == declared['grid'] and workstation['steps'] == declared['steps']
    rehearsal = cases['G5-05']['fixture']['rehearsal']
    small = fixture(rehearsal['footprint_um'], declared['mesh_um'], duration_fs=175.)
    assert list(small['project'].region.shape) == rehearsal['grid'] and small['project'].region.steps == rehearsal['steps']
    assert len(small['radii']) == rehearsal['pillars']
    # The finite-difference direction covers 316 pillars on the workstation and every pillar in the rehearsal.
    radius = cases['G5-05']['acceptance']['gradient']['finite_difference']['radius_um']
    assert sum(math.hypot(*c) <= radius for c in spec['centres']) == 316
    assert sum(math.hypot(*c) <= radius for c in small['centres']) == rehearsal['pillars']
    assert pillar_mask(small, radius).sum() == pillar_mask(small).sum()


def test_rehearsal_record_passes_every_rehearsal_criterion(cases, rehearsal):
    verdict = evaluate(rehearsal, cases, 'rehearsal')
    failed = [row['name'] for row in verdict['criteria'] if not row['passed']]
    assert not failed, failed
    assert verdict['all_passed']
    streamed = rehearsal['executions']['streamed']
    assert streamed['fd']['kind'] == 'central' and streamed['fd']['relative_error'] <= .03
    assert rehearsal['comparison']['design_slab_gradient_relative_l2'] <= 1e-4
    assert rehearsal['runs']['streamed_forward']['energy_decayed_fraction'] <= 1e-3
    assert rehearsal['environment']['hardware'].startswith('NVIDIA GeForce RTX 3060')
    assert set(rehearsal['executions']) == {'resident', 'streamed'}


def test_rehearsal_record_is_complete_for_the_report_and_carries_no_machine_paths(rehearsal):
    for key in ('fixture', 'grid', 'cells', 'steps', 'eh_bytes', 'runs', 'executions', 'comparison', 'source_sha256',
                'source_amplitude_ratio', 'frequency_resolution_hz', 'elapsed_seconds', 'artifact_sha256'):
        assert key in rehearsal, key
    for phase in ('resident_forward', 'streamed_forward', 'streamed_fd_plus', 'streamed_fd_minus'):
        run = rehearsal['runs'][phase]
        assert run['peak_torch_allocated_bytes'] > 0 and run['memory']['peak_process_rss_bytes'] > 0
    assert 'artifacts_directory' not in rehearsal
    assert rehearsal['arguments']['output'] == '<redacted path>'
    text = json.dumps(rehearsal)
    assert 'D:/' not in text and 'D:\\\\' not in text and 'C:\\\\Users' not in text


def test_report_renders_from_the_record_alone(cases, rehearsal, tmp_path):
    verdict = evaluate(rehearsal, cases, 'rehearsal')
    document = render(dict(record=rehearsal, verdict=verdict))
    assert document.startswith('# Beyond-VRAM propagated case')
    assert 'Verdict against the declared cases: **PASS**' in document
    for heading in ('## Fixture', '## Policy and reservation', '## Results', '## Resident reference (rehearsal)', '## Timings',
                    '## Memory and disk, measured separately', '## Criteria', '## What this does and does not show'):
        assert heading in document
    assert f"{rehearsal['runs']['streamed_forward']['objective']:.6e}" in document
    assert '| plane energy decayed fraction at the final step |' in document
    assert 'not added together' in document
    # A workstation context refuses to judge a rehearsal record as the workstation run.
    workstation = evaluate(rehearsal, cases, 'workstation')
    assert not workstation['all_passed']
    failed = {row['name'] for row in workstation['criteria'] if not row['passed']}
    assert 'grid equals the declared grid' in failed and 'physical VRAM recorded' in failed


def test_time_model_reproduces_the_records_it_was_fitted_on():
    from torchfdtd import Monitor, Project, Region, Source, StreamedAdjointOptions
    from torchfdtd.streamed_work import estimate_streamed_work
    for name in ('compact-host-large-5880', 'compact-host-capacity-5880'):
        record = json.loads((ROOT/'docs/validation'/f'{name}.json').read_text(encoding='utf-8'))
        shape, steps = record['grid'], record['steps']
        region = Region(dimension='3d', size=tuple(n*.1 for n in shape), mesh=.1, steps=steps, precision='float32',
                        pml_cells=3, memory_mode='streamed')
        project = Project(region=region, sources=[Source(center=(0, 0, 0), pulse='continuous')],
                          monitors=[Monitor(center=(.1, 0, 0)), Monitor(center=(0, .1, 0), component='Hy')])
        for row in record['records']:
            report = row['report']
            options = StreamedAdjointOptions(device='cuda', slab_width=report['slab_width'], temporal_depth=report['temporal_depth'],
                                             checkpoints=report['checkpoint_capacity'], local_checkpoints=report['local_checkpoint_capacity'],
                                             host_budget_bytes=256*1024**3, gpu_budget_bytes=64*1024**3)
            estimate = time_estimate(estimate_streamed_work(project, options))
            assert abs(estimate['forward_seconds']/report['forward_seconds']-1) < .35
            assert abs(estimate['backward_seconds']/report['backward_seconds']-1) < .35
    assert TIME_MODEL['payload_gb_per_s'] > 0 and TIME_MODEL['gcell_steps_per_s'] > 0


def test_plan_against_the_recorded_workstation_needs_no_device(cases):
    from torchfdtd import StreamedAdjointOptions
    declared = cases['G5-05']['fixture']
    spec = fixture(declared['rehearsal']['footprint_um'], declared['mesh_um'], duration_fs=175.)
    options = StreamedAdjointOptions(device='cuda', slab_width=32, temporal_depth=16, checkpoints=2, local_checkpoints=1,
                                     host_budget_bytes=100*1024**3, gpu_budget_bytes=40*1024**3, state_storage='host')
    args = Namespace(assume_5880=True, fd_check='central', journal=None, journal_every=4, banks='host')
    result = plan(args, spec, options)
    assert result['assumed_workstation']['hardware'] == 'NVIDIA RTX 5880 Ada Generation'
    assert result['reservation']['observers'] == 58800 and result['reservation']['host_reservation_bytes'] > 0
    assert result['estimate']['fd_forward_seconds'] == pytest.approx(2*result['estimate']['forward_seconds'])
    assert result['eh_bytes'] == 6*result['cells']*4 and result['disk_writes_estimate_gb'] == 0.
    import torchfdtd.streamed as streamed_module
    from torchfdtd.memory_profile import host_memory
    assert streamed_module.host_memory is host_memory
