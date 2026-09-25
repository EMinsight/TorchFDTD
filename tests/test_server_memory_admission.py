"""Memory admission of the workbench server: torchfdtd serve --memory-admission.

By default the server applies SERVER_LIMITS to every request, job thread and
modal worker (tests/test_server_security.py, tests/test_resident_guards.py).
With create_app(memory_admission=True) the size limits are lifted and resident
execution is admitted by the memory estimate as on the Python API, in the
requests and in the job threads and modal worker they start, while the input
limits of the server stay (docs/SECURITY.md). The host outputs of a resident
run (final E and H, point traces, display frames) count against the available
host memory in this mode. Memory is simulated: the resolver reads CPU_RECORD
and the CPU Simulation a patched host_memory.
"""
import contextlib
import inspect
import math
import threading
import time

import pytest
import torch
from fastapi.testclient import TestClient

import test_server_security as security
from test_mode_network_integration import payload as modal_payload
from test_resident_guards import CPU_RECORD, LARGE, SERVER_CASES, oversized, single_oversized, structures, wide_plane
from torchfdtd import Project, Region, Simulation, Source, cli, server
from torchfdtd.models import SERVER_LIMITS, demo_project, server_admission, server_limit, server_limits
from torchfdtd.execution_modes import _resident_fit
from torchfdtd.solver import estimate, resident_output_bytes


@pytest.fixture(autouse=True)
def simulated_resources(monkeypatch):
    monkeypatch.setattr(server, 'execution_resources', lambda: dict(CPU_RECORD))


@contextlib.contextmanager
def workbench(root, memory_admission):
    app = server.create_app(root, memory_admission=memory_admission)
    try:
        with TestClient(app, raise_server_exceptions=False) as client:
            yield client
    finally:
        app.state.pool.shutdown()
        app.state.fsp_pool.shutdown()


@pytest.fixture
def memory_app(tmp_path):
    application = server.create_app(tmp_path / 'results', memory_admission=True)
    yield application
    application.state.pool.shutdown()
    application.state.fsp_pool.shutdown()


@pytest.fixture
def memory_client(memory_app):
    with TestClient(memory_app, raise_server_exceptions=False) as c:
        yield c


def resident(**region):
    """An explicit resident grid of 8,388,608 cells, above the server's resident cell limit."""
    return Project(region=Region(**LARGE, execution_mode='resident', **region), sources=[Source(center=(0, 0, 0))])


def finished(client, path, seconds=20):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        job = client.get(path).json()
        if job['status'] in ('completed', 'failed', 'cancelled'):
            return job
        time.sleep(.02)
    raise AssertionError(f'{path} did not finish: {job}')


# ---------------------------------------------------------------------------------------------- switch
def test_serve_passes_the_memory_admission_flag(monkeypatch):
    import uvicorn
    calls = []
    monkeypatch.setattr(uvicorn, 'run', lambda app, **kw: calls.append((app, kw)))
    monkeypatch.setattr(server, 'create_app', lambda **kwargs: kwargs)
    cli.main(['serve'])
    cli.main(['serve', '--memory-admission', '--port', '8123'])
    assert calls == [({'memory_admission': False}, {'host': '127.0.0.1', 'port': 8765}),
                     ({'memory_admission': True}, {'host': '127.0.0.1', 'port': 8123})]
    with pytest.raises(SystemExit) as exit_info:
        cli.main(['serve', '--memory-admission', '--host', '0.0.0.0'])
    assert exit_info.value.code == 2 and len(calls) == 2


def test_health_reports_the_admission(tmp_path):
    with workbench(tmp_path / 'fixed', False) as client:
        health = client.get('/api/health').json()
        assert health['admission'] == 'fixed' and health['server_limits'] == SERVER_LIMITS
    with workbench(tmp_path / 'memory', True) as client:
        health = client.get('/api/health').json()
        assert health['admission'] == 'memory' and health['server_limits'] is None


def test_server_executor_tasks_keep_the_admission_of_the_submitting_request():
    with server.ServerExecutor(max_workers=1) as pool:
        assert pool.submit(server_admission).result() == 'fixed'
        with server_limits(memory_admission=True):
            assert pool.submit(server_admission).result() == 'memory'
            assert pool.submit(server_limit, 'resident_cells').result() is None
        with server_limits():
            assert pool.submit(server_limit, 'resident_cells').result() == SERVER_LIMITS['resident_cells']
    assert server_admission() is None


# -------------------------------------------------------------------------------------------- admission
def test_a_resident_grid_above_the_server_cell_limit_is_admitted_by_the_estimate(tmp_path):
    body = resident().model_dump(mode='json')
    with workbench(tmp_path / 'fixed', False) as client:
        response = client.post('/api/validate', json=body)
        assert response.status_code == 422 and 'server limits resident execution to 8,000,000 cells' in response.text
    with workbench(tmp_path / 'memory', True) as client:
        response = client.post('/api/validate', json=body)
        assert response.status_code == 200, response.text
        execution = response.json()['execution']
        assert execution['mode'] == 'resident' and execution['warnings'] == [] and execution['cells'] == 8_388_608
        assert execution['resident']['fits'] and execution['resident']['cell_limit'] is None
        assert 'within 80% of available host memory' in execution['resident']['reason']
        auto = dict(body, region=dict(body['region'], execution_mode='auto'))
        assert client.post('/api/validate', json=auto).json()['execution']['mode'] == 'resident'
        for route in ('/api/mesh/preview', '/api/python'):
            assert client.post(route, json=body).status_code == 200, route
        # A cap the project carries still applies, as on the Python API.
        capped = dict(body, region=dict(body['region'], resident_cell_limit=8_000_000))
        response = client.post('/api/validate', json=capped)
        assert response.status_code == 422 and 'resident_cell_limit=8,000,000 cells' in response.text


def test_memory_admission_refuses_a_resident_grid_whose_estimate_does_not_fit(tmp_path, monkeypatch):
    project = resident()
    required = int(estimate(project)['estimated_memory_mb']*2**20)
    # With the estimate itself available, 80% of it cannot hold the grid: in the resolver and in Simulation.
    monkeypatch.setattr(server, 'execution_resources', lambda: dict(CPU_RECORD, host_available_bytes=required))
    monkeypatch.setattr('torchfdtd.memory_profile.host_memory', lambda: dict(total_bytes=4*required, available_bytes=required))
    body = project.model_dump(mode='json')
    with workbench(tmp_path, True) as client:
        execution = client.post('/api/validate', json=body).json()['execution']
        assert not execution['resident']['fits'] and 'exceeds 80% of available host memory' in execution['resident']['reason']
        assert execution['warnings'] == ['Resident execution was requested but '+execution['resident']['reason']+'.']
        response = client.post('/api/jobs', json=body)
        assert response.status_code == 202, response.text
        job = finished(client, '/api/jobs/'+response.json()['id'])
        assert job['status'] == 'failed' and 'Insufficient available host memory' in job['error'], job
        # Auto passes over the resident rung.
        auto = dict(body, region=dict(body['region'], execution_mode='auto'))
        execution = client.post('/api/validate', json=auto).json()['execution']
        assert execution['mode'] != 'resident' and not execution['resident']['fits']


def test_memory_admission_lifts_every_server_size_limit(memory_client):
    payload = oversized()
    for field, message in SERVER_CASES.items():
        project = single_oversized(field, payload)
        response = memory_client.post('/api/validate', json=project)
        assert response.status_code == 200, (field, response.text[:300])
        # The nested project of a GDS export and a mode-network request validates too.
        for route, body in (('/api/gds/export', {'project': project, 'layers': {'s0': [1, 0]}}),
                            ('/api/mode-networks/validate', {'project': project})):
            assert message not in memory_client.post(route, json=body).text, (field, route)
    assert memory_client.post('/api/validate', json=wide_plane().model_dump(mode='json')).status_code == 200
    response = memory_client.post('/api/validate', json=wide_plane(max_monitor_samples=20_000_000).model_dump(mode='json'))
    assert response.status_code == 422 and 'exceeds the limit of 20,000,000' in response.text


# ------------------------------------------------------------------------------------------ run outputs
def small_resident(**region):
    p = demo_project()
    p.region = Region(**{**p.region.model_dump(), 'backend': 'cpu', 'steps': 100, 'execution_mode': 'resident', **region})
    return p


def test_the_run_outputs_bound_what_a_resident_run_returns():
    # A 600 x 300 grid: the display frames are decimated to 200 x 150, the final fields are full size.
    p = small_resident(size=(30., 15., demo_project().region.size[2]), steps=60)
    with server_limits(memory_admission=True):
        result = Simulation(p).run()
    r = p.region
    assert r.shape[:2] == (600, 300) and result.frames.shape[1:] == (200, 150)
    assert len(result.frames) <= r.steps//max(r.snapshot_interval, math.ceil(r.steps/100))+1
    frames = 2*result.frames.nbytes
    assert frames <= 2*len(result.frames)*256*256*4
    fields = result.electric.nbytes+result.magnetic.nbytes
    assert fields+fields//2+result.signals.nbytes+frames <= resident_output_bytes(p)


def test_memory_admission_refuses_a_run_whose_outputs_exceed_host_memory(tmp_path, monkeypatch):
    """The estimate alone fits 80% of the host memory, the estimate plus the run outputs do not."""
    p = small_resident()
    required, outputs = int(estimate(p)['estimated_memory_mb']*2**20), resident_output_bytes(p)
    available = int((required+outputs//2)/.8)
    monkeypatch.setattr('torchfdtd.memory_profile.host_memory', lambda: dict(total_bytes=4*available, available_bytes=available))
    monkeypatch.setattr(server, 'execution_resources', lambda: dict(CPU_RECORD, host_available_bytes=available))
    assert Simulation(p).run().summary['steps'] == 100
    with server_limits(memory_admission=True), pytest.raises(ValueError, match='host memory for the run outputs'):
        Simulation(p).run()
    body = p.model_dump(mode='json')
    with workbench(tmp_path / 'fixed', False) as client:
        job = finished(client, '/api/jobs/'+client.post('/api/jobs', json=body).json()['id'])
        assert job['status'] == 'completed', job
    with workbench(tmp_path / 'memory', True) as client:
        execution = client.post('/api/validate', json=body).json()['execution']
        reason = execution['resident']['reason']
        assert not execution['resident']['fits'] and execution['resident']['host_output_bytes'] == required+outputs
        assert reason.startswith('resident estimate and run outputs') and 'exceed 80% of available host memory' in reason
        assert execution['warnings'] == ['Resident execution was requested but '+reason+'.']
        job = finished(client, '/api/jobs/'+client.post('/api/jobs', json=body).json()['id'])
        assert job['status'] == 'failed', job
        assert job['error'].startswith('Insufficient available host memory for the run outputs (final E and H fields, point traces, '
                                       'display frames, with the resident estimate)'), job['error']
        auto = dict(body, region=dict(body['region'], execution_mode='auto'))
        assert client.post('/api/validate', json=auto).json()['execution']['mode'] != 'resident'


def test_on_the_gpu_the_run_outputs_alone_meet_the_host_memory():
    p = Project(region=Region(**{**LARGE, 'backend': 'cuda', 'execution_mode': 'resident'}), sources=[Source(center=(0, 0, 0))])
    summary, cells, outputs = estimate(p), math.prod(p.region.shape), resident_output_bytes(p)
    assert outputs > 9*cells*4
    device = dict(CPU_RECORD, cuda=True, gpu='simulated', gpu_free_bytes=64*2**30, gpu_total_bytes=64*2**30)
    fit = _resident_fit(p, summary, 'cuda', dict(device, host_available_bytes=outputs), cells)
    assert fit['fits'] and 'host_output_bytes' not in fit
    with server_limits(memory_admission=True):
        fit = _resident_fit(p, summary, 'cuda', dict(device, host_available_bytes=outputs), cells)
        assert not fit['fits'] and fit['host_output_bytes'] == outputs
        assert fit['reason'].startswith('run outputs') and 'exceed 80% of available host memory' in fit['reason']
        fit = _resident_fit(p, summary, 'cuda', device, cells)
        assert fit['fits'] and 'within 75% of free device memory' in fit['reason'] and 'within 80% of available host memory' in fit['reason']


@pytest.mark.skipif(not torch.cuda.is_available(), reason='CUDA unavailable')
def test_cuda_dispatch_counts_the_run_outputs_under_memory_admission(monkeypatch):
    p = small_resident(backend='cuda')
    outputs = resident_output_bytes(p)
    monkeypatch.setattr('torchfdtd.memory_profile.host_memory', lambda: dict(total_bytes=4*outputs, available_bytes=outputs))
    with server_limits(memory_admission=True), pytest.raises(ValueError, match=r'run outputs \(final E and H fields, point traces, display frames\): '):
        Simulation(p).run()


# ------------------------------------------------------------------------------------ threads and workers
def test_job_threads_run_under_the_admission_of_their_request(tmp_path, monkeypatch):
    seen, release = [], threading.Event()

    class Recording:
        def __init__(self, project):
            self.cells = math.prod(project.region.shape)

        def run(self, progress, cancel):
            seen.append((server_admission(), server_limit('resident_cells'), self.cells))
            release.wait(10)
            raise ValueError('recorded')
    monkeypatch.setattr(server, 'Simulation', Recording)
    small = demo_project()
    small.region.backend = 'cpu'
    for memory_admission, project in ((False, small), (True, resident())):
        release.clear()
        with workbench(tmp_path / str(memory_admission), memory_admission) as client:
            body = project.model_dump(mode='json')
            keys = [client.post('/api/jobs', json=body).json()['id'] for _ in range(3)]
            # The queue cap holds under either admission.
            response = client.post('/api/jobs', json=body)
            assert response.status_code == 409 and 'queue is full' in response.text
            release.set()
            for key in keys:
                job = finished(client, '/api/jobs/'+key)
                assert job['status'] == 'failed' and job['error'] == 'recorded', job
    cells = math.prod(small.region.shape)
    assert seen == [('fixed', SERVER_LIMITS['resident_cells'], cells)]*3+[('memory', None, 8_388_608)]*3


def test_design_jobs_run_under_the_admission_of_their_request(tmp_path, monkeypatch):
    from torchfdtd import design_service
    seen = []

    def run(config, on_progress, cancel):
        seen.append(server_admission())
        raise ValueError('recorded')
    monkeypatch.setattr(design_service, 'run_periodic_design', run)
    for memory_admission in (False, True):
        with workbench(tmp_path / str(memory_admission), memory_admission) as client:
            config = client.get('/api/design/defaults').json()
            key = client.post('/api/design/jobs', json=config).json()['id']
            job = finished(client, '/api/jobs/'+key)
            assert job['status'] == 'failed' and job['error'] == 'recorded', job
    assert seen == ['fixed', 'memory']


def test_the_modal_worker_receives_the_admission_of_its_request(tmp_path, monkeypatch):
    """The job thread passes the admission to the spawned worker, which applies it to the snapshot it validates and runs."""
    from torchfdtd import mode_network_project, mode_network_service as service
    from torchfdtd.mode_network_worker import mode_network_worker
    spawned, seen, sent = [], [], []

    class Unstarted:
        pid = None

        def start(self):
            raise OSError('recorded')

        def close(self):
            pass

    class Context:
        def Pipe(self, duplex):
            return Unstarted(), Unstarted()

        def Process(self, target, args, daemon):
            spawned.append(args)
            return Unstarted()

    class Connection:
        def send_bytes(self, data):
            sent.append(data)

        def close(self):
            pass

    def run(config, on_progress=None):
        seen.append((server_admission(), server_limit('structures'), len(config.project.structures)))
        raise ValueError('recorded')
    monkeypatch.setattr(service, 'mode_network_plan', lambda config: {})
    monkeypatch.setattr(service.multiprocessing, 'get_context', lambda kind: Context())
    monkeypatch.setattr(mode_network_project, 'run_mode_network', run)
    small = modal_payload()
    large = dict(small, project=dict(small['project'], structures=structures(1001)))
    for memory_admission, body in ((False, small), (True, large)):
        with workbench(tmp_path / str(memory_admission), memory_admission) as client:
            key = client.post('/api/mode-network-jobs', json=body).json()['id']
            job = finished(client, '/api/mode-network-jobs/'+key)
            assert job['status'] == 'failed' and job['error'] == 'recorded', job
    assert [args[3] for args in spawned] == [False, True]
    # A spawned child starts without the job thread's context; a new thread does too.
    for snapshot, output, _, memory_admission in spawned:
        worker = threading.Thread(target=mode_network_worker, args=(snapshot, output, Connection(), memory_admission))
        worker.start()
        worker.join(30)
    assert seen == [('fixed', SERVER_LIMITS['structures'], len(small['project']['structures'])), ('memory', None, 1001)]
    assert all(b'recorded' in data for data in sent)


# ---------------------------------------------------------------------------------------- input limits
@pytest.mark.parametrize('name', ['test_foreign_host_headers_are_rejected', 'test_the_test_host_is_allowed_only_through_the_environment',
                                  'test_foreign_origins_are_rejected_on_state_changing_routes',
                                  'test_path_parameters_and_static_paths_stay_inside_their_directories',
                                  'test_upload_filename_headers_cannot_choose_the_stored_path',
                                  'test_gds_upload_names_are_display_only_and_hostile_layouts_are_rejected',
                                  'test_request_size_limits_apply_to_declared_and_chunked_bodies',
                                  'test_malformed_json_bodies_get_a_client_error_not_a_server_error',
                                  'test_gds_uploads_keep_the_vertex_limit_the_python_api_lifts'])
def test_security_checks_hold_under_memory_admission(name, tmp_path, monkeypatch, memory_app, memory_client):
    """The server security checks, run against memory-admission apps, including the apps a check builds itself."""
    create = server.create_app
    monkeypatch.setattr(server, 'create_app', lambda result_dir=None: create(result_dir, memory_admission=True))
    check = getattr(security, name)
    available = dict(app=memory_app, client=memory_client, tmp_path=tmp_path, monkeypatch=monkeypatch)
    check(**{parameter: available[parameter] for parameter in inspect.signature(check).parameters})


def test_input_limits_of_the_models_hold_under_memory_admission(memory_client):
    base = demo_project().model_dump(mode='json')
    lorentz = dict(base['materials'][1], model='lorentz', poles=[{}]*17)
    index_bound = dict(dimension='3d', size=(100., 100., 71.6), mesh=.1, pml_cells=3, execution_mode='resident')
    cases = {'at most 16 items': dict(base, materials=[base['materials'][0], lorentz, *base['materials'][2:]]),
             'at most 120 characters': dict(base, name='x'*121),
             'at most one million cells': dict(base, region=dict(base['region'], mesh=1e-9)),
             'signed 32-bit indices, which 716,000,000 cells exceed': dict(base, region=dict(base['region'], **index_bound))}
    for message, project in cases.items():
        response = memory_client.post('/api/validate', json=project)
        assert response.status_code == 422 and message in response.text, (message, response.text[:300])
    response = memory_client.post('/api/materials/data', json={'text': '1 1.5 0', 'reference': 'x'*2001})
    assert response.status_code == 422 and 'at most 2000 characters' in response.text
