"""Workbench execution modes: Auto resolution from a resource record and streamed browser jobs."""
from dataclasses import replace
import time

import numpy as np
import pytest
import torch
from fastapi.testclient import TestClient

from torchfdtd import FieldMonitor, Monitor, Project, Region, Simulation, Source
from torchfdtd.execution_modes import (RESIDENT_CELL_LIMIT, _base_options, _browser_scene, resolve_execution)
from torchfdtd.server import create_app
from torchfdtd.solver import estimate

CPU_RECORD = dict(cuda=False, cupy=False, gpu=None, gpu_free_bytes=0, gpu_total_bytes=0,
                  host_total_bytes=64*2**30, host_available_bytes=32*2**30)


def scene(length_um=1.6, steps=60, **region):
    settings = {**dict(dimension='3d', size=(length_um, 1.2, 1.2), mesh=.1, pml_cells=3, steps=steps, backend='cpu'), **region}
    return Project(name='modes', region=Region(**settings),
                   sources=[Source(center=(-.3, 0, 0), component='Ez', wavelength=1., pulse_cycles=2)],
                   monitors=[Monitor(id='pt', center=(.3, .1, 0), component='Ez'),
                             Monitor(id='ph', center=(.2, 0, .1), component='Hy'),
                             FieldMonitor(id='plane', center=(.4, 0, 0), normal='x', size=(0, .6, .6),
                                          spectrum=dict(sampling='frequency', wavelength_start=.9, wavelength_stop=1.2,
                                                        frequency_points=5, apodization='none'))])


def test_auto_picks_resident_for_a_small_scene(tmp_path):
    p = scene()
    record = resolve_execution(p, health=CPU_RECORD, scratch=tmp_path/'scratch', summary=estimate(p))
    assert (record['requested'], record['mode'], record['backend']) == ('auto', 'resident', 'cpu')
    assert record['resident']['fits'] and record['resident']['limit_bytes'] == int(32*2**30*.8)
    assert record['error'] is None and 'streamed_host' not in record
    gpu = dict(CPU_RECORD, cuda=True, cupy=True, gpu='fake', gpu_free_bytes=8*2**30, gpu_total_bytes=12*2**30)
    p.region.backend = 'auto'
    record = resolve_execution(p, health=gpu, scratch=tmp_path/'scratch', summary=estimate(p))
    assert (record['mode'], record['backend'], record['gpu']) == ('resident', 'cuda', 'fake')
    assert record['resident']['limit_bytes'] == int(8*2**30*.75)
    p.region.execution_mode = 'streamed_host'
    record = resolve_execution(p, health=CPU_RECORD, scratch=tmp_path/'scratch', summary=estimate(p))
    assert record['mode'] == 'streamed_host' and record['policy']['checkpoints'] == 0
    assert record['policy']['tile_device'] == 'cpu' and record['options']['state_storage'] == 'host'


@pytest.mark.skipif(not torch.cuda.is_available(), reason='CUDA tile admission needs a CUDA device')
def test_auto_streams_through_host_above_the_injected_device_memory(tmp_path):
    pytest.importorskip('cupy')
    p = scene(25.6, backend='cuda')
    summary = estimate(p)
    resident_bytes = int(summary['estimated_memory_mb']*2**20)
    # The record's free device memory admits the tile workspace but not the resident estimate.
    free = int(resident_bytes/.75*.6)
    fake = dict(cuda=True, cupy=True, gpu='fake', gpu_free_bytes=free, gpu_total_bytes=12*2**30,
                host_total_bytes=64*2**30, host_available_bytes=32*2**30)
    record = resolve_execution(p, health=fake, scratch=tmp_path/'scratch', summary=summary)
    assert record['mode'] == 'streamed_host' and record['backend'] == 'cuda'
    assert not record['resident']['fits'] and 'exceeds 75%' in record['resident']['reason']
    assert record['policy']['tile_device'] == 'cuda' and record['policy']['state_storage'] == 'host'
    assert record['options']['gpu_budget_bytes'] == int(free*.8)
    assert record['reservation']['gpu_reservation_bytes'] <= int(free*.8)
    assert record['reservation']['host_reservation_bytes'] <= int(32*2**30*.8)
    assert 'streamed_disk' not in record


def test_auto_streams_through_disk_when_host_memory_is_short(tmp_path):
    from torchfdtd.streamed import _reservation
    from torchfdtd.streamed_planning import plan_streamed_work
    from torchfdtd.boundaries import material_shape
    p = scene(51.2)
    summary = estimate(p)
    internal, observations = _browser_scene(p)
    epsilon = torch.empty(material_shape(internal.region), device='meta')
    def reservation(storage, **policy):
        base = _base_options(storage, 'cpu', CPU_RECORD, tmp_path/'scratch')
        return _reservation(internal, epsilon, replace(base, **policy), observations)['host_reservation_bytes']
    disk_default = reservation('disk')
    host_base = _base_options('host', 'cpu', CPU_RECORD, tmp_path/'scratch')
    smallest_host = min(reservation('host', slab_width=c['options']['slab_width'], temporal_depth=c['options']['temporal_depth'])
                        for c in plan_streamed_work(internal, host_base).report['candidates'])
    assert disk_default < smallest_host
    available = int((disk_default+smallest_host)/2/.8)
    short = dict(CPU_RECORD, host_available_bytes=available)
    record = resolve_execution(p, health=short, scratch=tmp_path/'scratch', summary=summary)
    assert record['mode'] == 'streamed_disk'
    assert not record['resident']['fits'] and 'exceeds 80%' in record['resident']['reason']
    assert not record['streamed_host']['admitted'] and 'host budget' in record['streamed_host']['reason']
    assert record['policy']['state_storage'] == 'disk' and record['options']['state_directory'] == str(tmp_path/'scratch')
    assert record['options']['host_budget_bytes'] == int(available*.8)
    assert record['reservation']['disk_reservation_bytes'] > 0
    assert record['scratch_directory'] == str(tmp_path/'scratch')
    nothing = resolve_execution(p, health=dict(CPU_RECORD, host_available_bytes=1), scratch=tmp_path/'scratch', summary=summary)
    assert nothing['mode'] is None and nothing['error'].startswith('No execution mode fits')
    p.region.execution_mode = 'resident'
    forced = resolve_execution(p, health=dict(CPU_RECORD, host_available_bytes=1), scratch=tmp_path/'scratch', summary=summary)
    assert forced['mode'] == 'resident' and forced['warnings']


def test_resident_cell_guard_applies_to_explicit_resident_regions():
    settings = dict(dimension='3d', size=(25.6, 25.6, 12.8), mesh=.1, pml_cells=3)
    with pytest.raises(ValueError, match='8 million'):
        Region(**settings, execution_mode='resident')
    region = Region(**settings)
    assert region.execution_mode == 'auto' and np.prod(region.shape) > RESIDENT_CELL_LIMIT
    with pytest.raises(ValueError, match='8 million'):
        Simulation(Project(region=region, sources=[Source(center=(0, 0, 0))]))


def _finished(client, key, timeout=180):
    deadline = time.monotonic()+timeout
    while time.monotonic() < deadline:
        job = client.get('/api/jobs/'+key).json()
        if job['status'] in ('completed', 'failed', 'cancelled'):
            return job
        time.sleep(.05)
    raise AssertionError('job did not finish')


def test_streamed_browser_job_matches_the_resident_job(tmp_path, monkeypatch):
    monkeypatch.setenv('TORCHFDTD_SCRATCH', str(tmp_path/'scratch'))
    app = create_app(tmp_path)
    with TestClient(app) as client:
        p = scene()
        def run(mode):
            q = Project.model_validate(p.model_dump())
            q.region.execution_mode = mode
            validated = client.post('/api/validate', json=q.model_dump())
            assert validated.status_code == 200 and validated.json()['execution']['mode'] == mode
            key = client.post('/api/jobs', json=q.model_dump()).json()['id']
            job = _finished(client, key)
            assert job['status'] == 'completed', job.get('error')
            job['fields'] = client.get(f'/api/jobs/{key}/fields').json()
            job['plane'] = client.get(f'/api/jobs/{key}/field-monitors/plane', params=dict(component='Ey')).json()
            job['csv'] = client.get(f'/api/jobs/{key}/monitors.csv').text
            job['flux_csv'] = client.get(f'/api/jobs/{key}/flux.csv').text
            assert client.get(f'/api/jobs/{key}/download').content[:2] == b'PK'
            return job
        resident = run('resident')
        assert resident['execution']['mode'] == 'resident' and resident['summary']['steps'] == 60
        for mode in ('streamed_host', 'streamed_disk'):
            streamed = run(mode)
            execution = streamed['execution']
            assert execution['mode'] == mode and execution['policy']['checkpoints'] == 0
            assert execution['policy']['state_storage'] == ('disk' if mode == 'streamed_disk' else 'host')
            assert execution['reservation']['host_reservation_bytes'] > 0 and execution['scratch_directory'] == str(tmp_path/'scratch')
            assert execution['report']['completed_blocks'] == execution['report']['blocks'] == 15
            assert (execution['report']['disk_reservation_bytes'] > 0) == (mode == 'streamed_disk')
            summary = streamed['summary']
            assert summary['steps'] == 60 and not summary['cancelled'] and summary['execution']['snapshot'] == 'final step only'
            assert summary['backend'] == 'cpu' and summary['engine'].startswith('TorchFDTD streamed')
            assert [m['id'] for m in streamed['monitors']] == [m['id'] for m in resident['monitors']] == ['pt', 'ph']
            for a, b in zip(streamed['monitors'], resident['monitors']):
                scale = np.abs(b['signal']).max()
                np.testing.assert_allclose(a['signal'], b['signal'], rtol=1e-5, atol=1e-6*scale)
                np.testing.assert_allclose(a['time_fs'], b['time_fs'], rtol=1e-12)
                np.testing.assert_allclose(a['spectrum'], b['spectrum'], rtol=1e-5, atol=1e-6*np.abs(b['spectrum']).max())
            flux_a, flux_b = streamed['flux_monitors'][0], resident['flux_monitors'][0]
            assert flux_a['id'] == flux_b['id'] == 'plane' and flux_a['points'] == flux_b['points']
            np.testing.assert_allclose(flux_a['flux'], flux_b['flux'], rtol=1e-5, atol=1e-6*np.abs(flux_b['flux']).max())
            np.testing.assert_allclose(flux_a['frequency_thz'], flux_b['frequency_thz'], rtol=1e-12)
            plane_a, plane_b = streamed['plane'], resident['plane']
            assert plane_a['shape'] == plane_b['shape'] and plane_a['component'] == 'Ey'
            np.testing.assert_allclose(plane_a['magnitude'], plane_b['magnitude'], rtol=1e-5, atol=1e-6*np.abs(plane_b['magnitude']).max())
            np.testing.assert_allclose(plane_a['real'], plane_b['real'], rtol=1e-5, atol=1e-6*np.abs(plane_b['magnitude']).max())
            assert streamed['fields']['frame_steps'] == [60] and resident['fields']['frame_steps'][-1] == 60
            frame_a, frame_b = np.array(streamed['fields']['frames'][0]), np.array(resident['fields']['frames'][-1])
            assert frame_a.shape == frame_b.shape
            np.testing.assert_allclose(frame_a, frame_b, rtol=1e-5, atol=1e-6*np.abs(frame_b).max())
            np.testing.assert_allclose(streamed['fields']['epsilon'], resident['fields']['epsilon'], rtol=0, atol=0)
            assert streamed['csv'].count('\n') == resident['csv'].count('\n')
            assert streamed['flux_csv'].count('\n') == resident['flux_csv'].count('\n')
            ratio = client.get(f'/api/jobs/{streamed["id"]}/normalize-flux', params=dict(reference=resident['id'], monitor='plane'))
            assert ratio.status_code == 200
            np.testing.assert_allclose([v for v in ratio.json()['ratio'] if v is not None], 1., rtol=1e-5)
        assert not list((tmp_path/'scratch').glob('torchfdtd-state-*'))
    app.state.pool.shutdown()


def test_streamed_browser_job_cancels_between_tiles(tmp_path, monkeypatch):
    monkeypatch.setenv('TORCHFDTD_SCRATCH', str(tmp_path/'scratch'))
    app = create_app(tmp_path)
    with TestClient(app) as client:
        p = scene(steps=4000, execution_mode='streamed_host')
        key = client.post('/api/jobs', json=p.model_dump()).json()['id']
        deadline = time.monotonic()+60
        while time.monotonic() < deadline:
            job = client.get('/api/jobs/'+key).json()
            if job['status'] == 'running' and job['progress'].get('block', 0) >= 2:
                break
            time.sleep(.02)
        assert job['progress']['blocks'] == 1000 and job['progress']['tiles'] >= 1
        assert client.post(f'/api/jobs/{key}/cancel').json()['cancel_requested']
        job = _finished(client, key)
        assert job['status'] == 'cancelled' and job['summary']['cancelled']
        assert 0 < job['summary']['steps'] < 4000 and job['summary']['steps'] % 4 == 0
        fields = client.get(f'/api/jobs/{key}/fields').json()
        assert fields['frame_steps'] == [job['summary']['steps']] and len(fields['frames']) == 1
        assert len(job['monitors'][0]['signal']) == job['summary']['steps']
    app.state.pool.shutdown()


def test_large_auto_scene_validates_and_resolves_streamed(tmp_path):
    from torchfdtd.memory_profile import host_memory
    available = host_memory()['available_bytes']
    if available is not None and available < 6*2**30:
        pytest.skip('needs a few GiB of free RAM for the streamed reservation')
    app = create_app(tmp_path)
    with TestClient(app) as client:
        p = Project(region=Region(dimension='3d', size=(25.6, 25.6, 12.8), mesh=.1, pml_cells=3, steps=100, backend='cpu'),
                    sources=[Source(center=(0, 0, 0))], monitors=[Monitor(center=(1, 0, 0))])
        assert np.prod(p.region.shape) > RESIDENT_CELL_LIMIT
        response = client.post('/api/validate', json=p.model_dump())
        assert response.status_code == 200
        execution = response.json()['execution']
        assert not execution['resident']['fits'] and 'exceed the resident limit' in execution['resident']['reason']
        assert execution['mode'] in ('streamed_host', 'streamed_disk'), execution
        p.region.execution_mode = 'resident'
        assert client.post('/api/validate', json=p.model_dump()).status_code == 422
    app.state.pool.shutdown()
