from __future__ import annotations

import io
import os
import socket
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request, Query
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from .models import Project, Material, demo_project
from .solver import Simulation, estimate, hardware
from .material_fit import OpticalDataRequest, MaterialFitRequest, fit_material, material_fit_report
from .optical_data import OpticalData


def create_app(result_dir=None):
    app = FastAPI(title='TorchFDTD', version='0.14.0.dev0')
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=['localhost', '127.0.0.1', '[::1]', 'testserver'])
    app.add_middleware(GZipMiddleware, minimum_size=4096, compresslevel=1)
    root = Path(result_dir or os.environ.get('TORCHFDTD_RESULTS') or os.environ.get('PHOTONWEAVE_RESULTS', 'results')).resolve()
    root.mkdir(parents=True, exist_ok=True)
    pool = ThreadPoolExecutor(max_workers=1, thread_name_prefix='fdtd')
    jobs, lock = {}, threading.Lock()

    @app.middleware('http')
    async def local_origin(request: Request, call_next):
        origin = request.headers.get('origin')
        if origin and origin != str(request.base_url).rstrip('/'):
            return JSONResponse({'detail': 'Cross-origin requests are not allowed.'}, status_code=403)
        from .fsp import MAX_FSP_BYTES
        limit = MAX_FSP_BYTES if request.url.path in ('/api/fsp/import', '/api/fsp/native-import') else 32_000_000
        if int(request.headers.get('content-length', 0)) > limit:
            return JSONResponse({'detail': 'Request payload exceeds the upload limit.'}, status_code=413)
        response = await call_next(request)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    @app.get('/api/health')
    def health():
        return {**hardware(), 'hostname': socket.gethostname(), 'version': '0.14.0.dev0'}

    @app.get('/api/capabilities')
    def capabilities():
        import json
        return json.loads(Path(__file__).with_name('feature_inventory.json').read_text(encoding='utf-8'))

    @app.get('/api/examples/{name}')
    def example(name: str):
        if name not in ('waveguide', 'scatterer', '3d'):
            raise HTTPException(404, 'Unknown example')
        return demo_project(name)

    @app.post('/api/validate')
    def validate(project: Project):
        return {**estimate(project), 'project': project.model_dump()}

    @app.post('/api/python')
    def python(project: Project):
        return Response(project.python_script(), media_type='text/plain')

    @app.post('/api/mesh/preview')
    def mesh_preview(project: Project):
        from .mesh import object_bounds
        r=project.region
        axes=[]
        for nodes in r.mesh_nodes:
            stride=max(1,(len(nodes)+999)//1000)
            axes.append(sorted(set(nodes[::stride].tolist()+[float(nodes[-1])])))
        return dict(summary=estimate(project), nodes_um=axes,
                    preview_decimated=any(len(v)>1000 for v in r.mesh_nodes),
                    structures=[dict(center=object_bounds(s)[0],size=object_bounds(s)[1],name=s.name) for s in project.structures if s.enabled],
                    refinements=[dict(center=c,size=s) for c,s in r._auto_boxes]+[b.model_dump() for b in r.mesh_refinements if b.enabled])

    @app.post('/api/mesh/freeze')
    def mesh_freeze(project: Project):
        from .mesh import freeze_refinements
        try: return freeze_refinements(project).model_dump()
        except ValueError as exc: raise HTTPException(422,str(exc)) from exc

    @app.post('/api/mesh/coordinates')
    def mesh_coordinates(project: Project):
        return {'nodes_um':[a.tolist() for a in project.region.mesh_nodes]}

    @app.post('/api/materials/data')
    def optical_data(request: OpticalDataRequest):
        try:return OpticalData.from_text(request.text,kind=request.kind,unit=request.unit,reference=request.reference).model_dump()
        except ValueError as exc:raise HTTPException(422,str(exc)) from exc

    @app.post('/api/materials/fit')
    def fit_optical_data(request: MaterialFitRequest):
        try:return fit_material(request.data,name=request.name,color=request.color,options=request.options).as_dict()
        except ValueError as exc:raise HTTPException(422,str(exc)) from exc

    @app.post('/api/materials/preview')
    def material_preview(material: Material, wavelength_start: float = Query(1.3, gt=0),
                         wavelength_stop: float = Query(1.8, gt=0), dt_fs: float = Query(0, ge=0)):
        import numpy as np
        from .materials import permittivity
        if wavelength_start > wavelength_stop: raise HTTPException(422, 'Wavelength start must not exceed stop.')
        wavelength = np.linspace(wavelength_start, wavelength_stop, 301)
        try:
            epsilon = permittivity(material, 299792458/(wavelength*1e-6))
            numerical = permittivity(material, 299792458/(wavelength*1e-6), dt_fs*1e-15)
        except ValueError as exc: raise HTTPException(422, str(exc)) from exc
        if not np.isfinite(epsilon).all() or not np.isfinite(numerical).all():
            raise HTTPException(422, 'Undamped resonance is singular in this range. Add damping or change the range.')
        n, numerical_n = np.sqrt(epsilon), np.sqrt(numerical)
        try:sampled=material_fit_report(material,dt_s=dt_fs*1e-15) if material.samples else None
        except ValueError as exc:raise HTTPException(422,str(exc)) from exc
        return dict(wavelength_um=wavelength.tolist(), epsilon_real=epsilon.real.tolist(), epsilon_imag=epsilon.imag.tolist(),
                    n=n.real.tolist(), k=n.imag.tolist(), numerical_n=numerical_n.real.tolist(), numerical_k=numerical_n.imag.tolist(),
                    samples=sampled,fit_dt_s=material.fit_dt_s)

    @app.post('/api/sources/{source_id}/preview')
    def source_preview(source_id: str, project: Project):
        from .source_preview import preview_source
        try:
            return preview_source(project, source_id)
        except ValueError as exc:
            raise HTTPException(404, str(exc)) from exc

    def work(key, project):
        job = jobs[key]
        if job['cancel'].is_set():
            job['status'] = 'cancelled'
            return
        job['status'] = 'running'
        def update(data):
            job['progress'] = data
        try:
            result = Simulation(project).run(progress=update, cancel=job['cancel'])
            result.save(root / f'{key}.npz')
            job['summary'] = result.summary
            job['monitors'] = result.monitor_data() if len(result.times)>1 else []
            job['flux_monitors'] = result.flux_data()
            job['frequency_fields'] = result.frequency_fields
            job['frames'] = result.frames
            job['frame_steps'] = result.frame_steps.tolist()
            job['epsilon'] = result.epsilon
            job['status'] = 'cancelled' if result.summary['cancelled'] else 'completed'
        except Exception as exc:
            job['error'] = str(exc)
            job['status'] = 'failed'

    @app.post('/api/jobs', status_code=202)
    def run(project: Project):
        with lock:
            if sum(j['status'] in ('queued', 'running') for j in jobs.values()) >= 3:
                raise HTTPException(409, 'The run queue is full (one running and two waiting).')
            if len(jobs) >= 12:
                old = next((k for k,j in jobs.items() if j['status'] in ('completed','cancelled','failed')), None)
                if old:
                    del jobs[old]
            key = uuid4().hex
            jobs[key] = {'id': key, 'status': 'queued', 'progress': {'step':0,'total':project.region.steps},
                         'cancel': threading.Event(), 'project': project.model_dump(), 'created': time.time()}
            pool.submit(work, key, project)
        return {'id':key, 'status':'queued'}

    def get_job(key):
        if key not in jobs:
            raise HTTPException(404, 'Job not found in this server session.')
        return jobs[key]

    @app.get('/api/jobs/{key}')
    def status(key: str):
        job = get_job(key)
        result = {k:v for k,v in list(job.items()) if k not in ('cancel','frames','epsilon','frame_steps','frequency_fields')}
        result['cancel_requested'] = job['cancel'].is_set()
        return result

    @app.get('/api/jobs')
    def job_list():
        return [dict(id=k,name=j['project']['name'],status=j['status'],created=j['created'],
                     flux_monitors=j.get('flux_monitors',[])) for k,j in list(jobs.items())]

    @app.get('/api/jobs/{key}/flux.csv')
    def flux_csv(key:str):
        import csv
        job=get_job(key)
        if 'flux_monitors' not in job:raise HTTPException(409,'Flux results are not ready.')
        out=io.StringIO();writer=csv.writer(out)
        writer.writerow(['monitor','normal','frequency_thz','wavelength_um','signed_flux','units'])
        for m in job['flux_monitors']:
            writer.writerows(zip([m['name']]*len(m['flux']),[m['normal']]*len(m['flux']),m['frequency_thz'],m['wavelength_um'],m['flux'],[m['units']]*len(m['flux'])))
        return Response(out.getvalue(),media_type='text/csv',headers={'Content-Disposition':'attachment; filename=flux.csv'})

    @app.get('/api/jobs/{key}/normalize-flux')
    def normalized_flux(key:str,reference:str,monitor:str,subtract_incident:bool=False):
        from .field_monitors import normalize_flux
        sample_job,ref_job=get_job(key),get_job(reference)
        try:
            sample=next(m for m in sample_job.get('frequency_fields',[]) if m['id']==monitor)
            ref=next(m for m in ref_job.get('frequency_fields',[]) if m['id']==monitor)
        except StopIteration:raise HTTPException(409,'Both completed runs must contain this frequency monitor.')
        try:result=normalize_flux(sample,ref,subtract_incident=subtract_incident)
        except ValueError as exc:raise HTTPException(422,str(exc)) from exc
        return dict(frequency_thz=(result['frequency_hz']*1e-12).tolist(),
                    wavelength_um=(299792458/result['frequency_hz']*1e6).tolist(),valid=result['valid'].tolist(),
                    ratio=[float(v) if ok else None for v,ok in zip(result['ratio'],result['valid'])],subtract_incident=subtract_incident)

    @app.get('/api/jobs/{key}/field-monitors/{monitor}')
    def frequency_field(key:str,monitor:str,frequency_index:int=Query(0,ge=0),component:str='Ez'):
        import numpy as np
        if component not in ('Ex','Ey','Ez','Hx','Hy','Hz'):raise HTTPException(422,'Invalid field component.')
        try:m=next(m for m in get_job(key).get('frequency_fields',[]) if m['id']==monitor)
        except StopIteration:raise HTTPException(409,'Frequency fields unavailable.')
        if frequency_index>=len(m['frequency_hz']):raise HTTPException(422,'Frequency index out of range.')
        names=m.get('components',['Ex','Ey','Ez','Hx','Hy','Hz'])
        if component not in names:raise HTTPException(422,'This field component was not recorded. Enable it and rerun.')
        c=names.index(component)
        data=m['fields'][frequency_index,:,c].reshape(m['shape']).squeeze(axis=m['normal'])
        return dict(real=data.real.tolist(),imag=data.imag.tolist(),magnitude=abs(data).tolist(),shape=data.shape,
                    frequency_thz=float(m['frequency_hz'][frequency_index]*1e-12),points_um=m['points_um'].tolist(),
                    normal=m['normal_axis'],component=component,units=m['field_units'])

    @app.post('/api/jobs/{key}/cancel')
    def cancel(key: str):
        job = get_job(key)
        if job['status'] in ('running','queued'):
            job['cancel'].set()
        return {'status':job['status'], 'cancel_requested':job['cancel'].is_set()}

    @app.get('/api/jobs/{key}/fields')
    def fields(key: str):
        job = get_job(key)
        if 'frames' not in job:
            raise HTTPException(409, 'Fields are available after the run finishes.')
        return {'frames':job['frames'].tolist(), 'epsilon':job['epsilon'].tolist(),
                'frame_steps':job['frame_steps'], 'summary':job['summary']}

    @app.get('/api/jobs/{key}/download')
    def download(key: str):
        get_job(key)
        path = root/f'{key}.npz'
        if not path.exists():
            raise HTTPException(409, 'Result is not ready.')
        return FileResponse(path, filename=f'torchfdtd-{key[:8]}.npz')

    @app.get('/api/jobs/{key}/monitors.csv')
    def csv(key: str):
        import csv
        job = get_job(key)
        if 'monitors' not in job:
            raise HTTPException(409, 'Monitor results are not ready.')
        out = io.StringIO()
        writer = csv.writer(out)
        writer.writerow(['monitor', 'component', 'time_fs', 'reduced_field', 'reduced_field_imag'])
        for m in job['monitors']:
            for t,s,i in zip(m['time_fs'], m['signal'], m['signal_imag']):
                writer.writerow([m['name'], m['component'], t, s, i])
        return Response(out.getvalue(), media_type='text/csv', headers={'Content-Disposition':'attachment; filename=monitors.csv'})

    @app.get('/api/jobs/{key}/spectra.csv')
    def spectra_csv(key: str):
        import csv
        job = get_job(key)
        if 'monitors' not in job:
            raise HTTPException(409, 'Monitor results are not ready.')
        out = io.StringIO()
        writer = csv.writer(out)
        writer.writerow(['monitor', 'component', 'frequency_thz', 'wavelength_um', 'real', 'imag', 'magnitude', 'units', 'apodization'])
        for m in job['monitors']:
            for f, wl, re, im, mag in zip(m['frequency_thz'], m['wavelength_um'], m['spectrum_real'], m['spectrum_imag'], m['spectrum']):
                writer.writerow([m['name'], m['component'], f, wl, re, im, mag, m['spectrum_units'], m['spectrum_settings']['apodization']])
        return Response(out.getvalue(), media_type='text/csv', headers={'Content-Disposition':'attachment; filename=spectra.csv'})

    from .design_service import attach_design_routes
    attach_design_routes(app, root, pool, jobs, lock)
    from .fsp_service import attach_fsp_routes
    attach_fsp_routes(app, root)
    static = Path(__file__).parent/'web'
    if static.exists():
        app.mount('/', StaticFiles(directory=static, html=True), name='workbench')
    app.state.jobs = jobs
    app.state.pool = pool
    return app
