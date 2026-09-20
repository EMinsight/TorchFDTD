import time

from fastapi.testclient import TestClient

from torchfdtd.models import demo_project
from torchfdtd.server import create_app


def test_api_job_lifecycle(tmp_path):
    app=create_app(tmp_path)
    with TestClient(app) as client:
        p=demo_project();p.region.backend='cpu';p.region.steps=100
        assert client.post('/api/validate',json=p.model_dump()).status_code==200
        response=client.post('/api/jobs',json=p.model_dump());assert response.status_code==202
        key=response.json()['id']
        deadline=time.monotonic()+20
        while time.monotonic()<deadline:
            job=client.get('/api/jobs/'+key).json()
            if job['status'] in ('completed','failed'):
                break
            time.sleep(.03)
        assert job['status']=='completed',job
        assert client.get('/api/jobs/'+key+'/fields').json()['frames']
        assert client.get('/api/jobs/'+key+'/download').content[:2]==b'PK'
        assert 'time_fs' in client.get('/api/jobs/'+key+'/monitors.csv').text
        assert 'wavelength_um,real,imag,magnitude,units,apodization' in client.get('/api/jobs/'+key+'/spectra.csv').text
        assert 'Simulation(project).run()' in client.post('/api/python',json=p.model_dump()).text
        assert client.post('/api/jobs',json=p.model_dump(),headers={'Origin':'https://unrelated.example'}).status_code==403
        assert client.get('/api/health',headers={'Host':'evil.example'}).status_code==400
    app.state.pool.shutdown()
