"""Synthetic native conversion fixtures and physics checks, no vendor files."""
import math
import struct
import time

import numpy as np
import pytest
from fastapi.testclient import TestClient

from photonweave.fsp_binary import FspDocument
from photonweave.fsp_native import DIPOLE, FDTD, ROOT, TIME, ZERO_UUID, convert_fsp
from photonweave.models import Project, Region, Source
from photonweave.server import create_app
from photonweave.solver import Simulation, source_time_signal
from test_fsp_binary import mapping, node, string, u


def items(data):
    return {k: (0 if isinstance(v, str) else 2 if isinstance(v, int) else 3 if isinstance(v, np.ndarray) else 1, v)
            for k, v in data.items()}


def fixture(source_overrides=None, region_overrides=None, *, source_class=DIPOLE,
            monitor_class=TIME, monitor_overrides=None):
    dx = .1e-6; dt = .8*dx/299792458/math.sqrt(3)
    region = dict(name='::model::FDTD', enabled=1, customGrid=2, meshRefineDesired=5,
                  fullSymmetry=0, forceComplex=0, splitFieldFDTD=0, checkpointDuringSimulation=0,
                  checkpointAtShutoff=0, mMaterialId=ZERO_UUID, mRefIndex='1.0', dimension=1,
                  dx=dx, dy=dx, dz=dx, PMLLayersV7p0=np.full((6, 1), 4), GUIx=0., GUIy=0.,
                  GUIz1=-2e-6, GUIz2=2e-6, GUIwidth=4e-6, GUIheight=4e-6,
                  courantFactor=.8, dt=dt, MaxSimTime=20*dt, useAutoShutoffMin=0, useAutoShutoffMax=1)
    region.update({f'BCType{i}':0 for i in range(6)})
    region.update({a+'Grid':np.linspace(-2.4e-6, 2.4e-6, 49) for a in 'xyz'})
    source = dict(name='::model::source', enabled=1, sourceType=0, useGlobalSource=0,
                  sourcePreference=0, frequencyEnvelopeType=0, optimizeForShortPulse=0, mEliminateDC=0, eliminateDiscontinuities=0,
                  theta=0., angle=0., frequency=299792458/1.55e-6, amplitude0=1.,
                  pulseLength=2e-15, offset=4e-15, phase=23., xcoord=-.5e-6, ycoord=0., zcoord=0.)
    source.update(source_overrides or {})
    region.update(region_overrides or {})
    monitor = dict(name='::model::monitor', enabled=1, monitorShape=0, spatialAveraging=1,
                   recordInPML=0, simulationType=0, outputPower=0, startTime=0., stopMethod=0, downsampleT=1,
                   outputP=np.zeros(3), outputE=np.array([0, 0, 1, 0, 0, 0]), left=.5e-6, bottom=0., z1=0.)
    monitor.update(monitor_overrides or {})
    # Controlled legacy sphere with real scalar transforms and material order.
    tail = bytearray(167)
    tail[:23] = b'\0'+u(0)+b'\1'+struct.pack('<d', .3e-6)+b'\1'+struct.pack('<d', .3e-6)
    tail[23:38] = (b'\0'+struct.pack('<i', -1))*3
    tail[38:91] = u(3)+b'\0'+u(3)+u(2)+u(3)+u(1)+u(1)+u(1)+bytes(24)
    tail[-56:-52] = u(1); tail[-51:-47] = u(2); tail[-9:-5] = u(1)
    body = u(8)+u(25)+struct.pack('<i5d', -1, 2., .3e-6, 0., 0., 0.)+string('2')+bytes(8)+string('sphere')
    body += tail+mapping(items(dict(materialuuid=ZERO_UUID, use_relative_coordinates=1, gridAttributeName='')))+u(0)
    sphere = u(1000)+u(38)+b'{23046316-141b-4111-aa2f-9e18de790b6c}'+body
    root = node(ROOT, items(dict(name='::model', setupscript='', analysisscript='', enabled=1,
                                constructionflag=0, x=0., y=0., z=0.)),
                [node(FDTD, items(region)), sphere, node(source_class, items(source)), node(monitor_class, items(monitor))])
    return (b'LUMERICAL file version 1.1\0'+struct.pack('<5I', 3, 10, 4, 8, 1)+bytes(24)
            +b'table of contents\0end table of contents\0Lumerical material data file version 2.0\0'
            +u(0)+root+u(0)+bytes(12))


def test_conversion_retains_geometry_timestep_pulse_and_fingerprint(monkeypatch):
    from photonweave import fsp
    monkeypatch.setattr(fsp, 'load_api', lambda: pytest.fail('Independent conversion loaded Lumerical'))
    raw = fixture(); doc = FspDocument(raw); report = convert_fsp(doc, 'Synthetic sphere', 'cpu')
    assert report.project is not None, report.issues
    p = report.project
    assert p.region.shape == (48, 48, 48)
    assert p.region.courant_factor == .8
    assert p.structures[0].radius == pytest.approx(.3)
    assert p.materials[0].index == 2
    assert p.sources[0].center == pytest.approx((-.5, 0, 0))
    assert p.sources[0].pulse_length == 2e-15 and p.sources[0].phase == 23
    assert p.import_provenance.source_sha256 == doc.fingerprint()
    result = Simulation(p).run()
    np.testing.assert_allclose(np.diff(result.times), p.region.time_step, rtol=1e-13)
    assert np.max(abs(result.electric)) > 0
    assert doc.data == raw


@pytest.mark.parametrize('class_id,key,bad', [(DIPOLE,'frequencyEnvelopeType',3),
    (DIPOLE,'sourceType',1), (DIPOLE,'useGlobalSource',1), (FDTD,'meshRefineDesired',0),
    (FDTD,'mMaterialId','a dispersive material'), (FDTD,'dt',1e-12),
    (TIME,'outputPower',1), (TIME,'monitorShape',6), (ROOT,'setupscript','deleteall;')])
def test_unsupported_physics_never_produces_a_runnable_partial_scene(class_id, key, bad):
    doc = FspDocument(fixture())
    target = next(n for n in doc.nodes() if n.uid == class_id)
    target.properties[key].value = bad
    report = convert_fsp(doc)
    assert report.project is None
    assert any(i['severity'] == 'error' for i in report.issues)
    assert not report.as_dict()['native_execution_allowed']


def test_nonzero_rotations_and_ellipsoids_are_not_silently_dropped():
    for change in ({'rotation_axes':['x','none','none'], 'rotation_angles':[17,0,0]},
                   {'make ellipsoid':True,'rotation_axes':['z','none','none'],'rotation_angles':[17,0,0]}):
        doc = FspDocument(fixture()); shape = next(n for n in doc.nodes() if n.legacy)
        shape.legacy.update(change)
        p=convert_fsp(doc).project
        assert p is not None
        assert p.structures[0].rotation_axes==tuple(change['rotation_axes'])
        assert p.structures[0].rotation_angles==tuple(change['rotation_angles'])
        assert p.structures[0].make_ellipsoid==change.get('make ellipsoid',False)


def test_standard_pulse_fwhm_phase_and_legacy_compatibility():
    source = Source(time_definition='standard', pulse_length=16e-15, pulse_offset=40e-15, phase=90)
    assert source_time_signal(source, [40e-15])[0] == pytest.approx(1)
    t = np.linspace(0, 100e-15, 201)
    w = source.pulse_length/(2*math.sqrt(math.log(2)))
    expected = np.exp(-.5*((t-source.pulse_offset)/w)**2)*np.cos(-2*np.pi*299792458/(source.wavelength*1e-6)*(t-source.pulse_offset))
    np.testing.assert_allclose(source_time_signal(source, t), expected, atol=1e-14)
    assert np.exp(-.5*((source.pulse_length/2)/w)**2)**2 == pytest.approx(.5)
    legacy = Source(); w = legacy.pulse_cycles*legacy.wavelength*1e-6/299792458
    np.testing.assert_allclose(source_time_signal(legacy,t), np.exp(-.5*((t-4*w)/w)**2)*np.sin(2*np.pi*299792458/(legacy.wavelength*1e-6)*t))
    assert Region(size=(6.000000000000001, 6, 6), mesh=6/128, dimension='3d').shape == (128,128,128)
    assert Region(size=(6.000001, 6, 6), mesh=6/128, dimension='3d').shape == (129,128,128)


@pytest.mark.parametrize('precision', ['float32','float64'])
def test_imported_standard_pulse_with_nondefault_cfl_cpu_cuda_parity(precision):
    import torch
    if not torch.cuda.is_available():pytest.skip('CUDA GPU not available')
    p = convert_fsp(FspDocument(fixture()), backend='cpu').project
    p.region.precision = precision
    cpu = Simulation(p).run()
    p.region.backend = 'cuda'
    gpu = Simulation(p).run()
    tolerance = 2e-6 if precision=='float32' else 1e-13
    assert gpu.summary['cuda_graph']
    np.testing.assert_allclose(gpu.electric, cpu.electric, rtol=tolerance, atol=tolerance)
    np.testing.assert_allclose(gpu.signals, cpu.signals, rtol=tolerance, atol=tolerance)


def test_native_upload_download_and_run_without_vendor_runtime(tmp_path, monkeypatch):
    from photonweave import fsp
    monkeypatch.setattr(fsp, 'availability', lambda: {'installed':False, 'reason':'Not installed'})
    monkeypatch.setattr(fsp, 'load_api', lambda: pytest.fail('Independent import loaded Lumerical'))
    app = create_app(tmp_path)
    try:
        with TestClient(app) as client:
            raw = fixture()
            response = client.post('/api/fsp/native-import', content=raw, headers={'x-filename':'test.fsp'})
            assert response.status_code == 202
            key = response.json()['id']
            deadline = time.monotonic()+5
            while time.monotonic() < deadline:
                job = client.get('/api/fsp/'+key).json()
                if job['status'] in ('ready', 'failed'):break
                time.sleep(.01)
            assert job['status'] == 'ready', job
            assert job['conversion']['native_execution_allowed']
            assert client.get('/api/fsp/'+key+'/download').content == raw
            assert client.get('/api/fsp/'+key+'/conversion').json()['requires_lumerical'] is False
            assert client.get('/api/fsp/'+key+'/archive').status_code == 409
            assert client.post('/api/validate', json=job['conversion']['project']).status_code == 200
    finally:
        app.state.pool.shutdown(); app.state.fsp_pool.shutdown()
