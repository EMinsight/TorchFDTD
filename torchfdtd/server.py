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
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

from .models import Project, Material, demo_project
from .plan import resolve_plan
from .solver import Simulation, estimate, hardware
from .execution_modes import execution_resources, resolve_execution, run_streamed_job, run_tiled_job, scratch_directory
from .material_fit import OpticalDataRequest, MaterialFitRequest, fit_material, material_fit_report
from .optical_data import OpticalData

# Bytes accepted in one request body on every route except the FSP uploads,
# which stream under fsp.MAX_FSP_BYTES. Module level so tests can lower it.
MAX_REQUEST_BYTES = 32_000_000


def _finite(value):
    # A NaN or Infinity literal in a request body is rejected by the models, but
    # the rejected input must not resurface in the 422 body, which is strict JSON.
    return value if value == value and value not in (float('inf'), float('-inf')) else repr(value)


class WorkbenchFiles(StaticFiles):
    def lookup_path(self, path):
        # On Windows os.path.join lets a drive letter or a UNC prefix replace the
        # web directory, so realpath would probe a drive root or a network share
        # before the containment check. Only plain relative names reach the lookup.
        if os.path.isabs(path) or os.path.splitdrive(path)[0] or path.startswith(('\\\\', '//')) or ':' in path:
            return '', None
        return super().lookup_path(path)


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
        limit = MAX_FSP_BYTES if request.url.path in ('/api/fsp/import', '/api/fsp/native-import') else MAX_REQUEST_BYTES
        declared = request.headers.get('content-length')
        if declared is None:
            # A chunked body has no declared size, so the limit below could not
            # be applied before the route reads the whole body into memory.
            if 'chunked' in request.headers.get('transfer-encoding', '').lower():
                return JSONResponse({'detail': 'Request bodies must declare Content-Length.'}, status_code=411)
        elif not declared.isdigit():
            return JSONResponse({'detail': 'Malformed Content-Length header.'}, status_code=400)
        elif int(declared) > limit:
            return JSONResponse({'detail': 'Request payload exceeds the upload limit.'}, status_code=413)
        response = await call_next(request)
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError):
        return JSONResponse({'detail': jsonable_encoder(exc.errors(), custom_encoder={float: _finite})}, status_code=422)

    @app.get('/api/health')
    def health():
        return {**hardware(), **execution_resources(), 'hostname': socket.gethostname(), 'version': '0.14.0.dev0'}

    @app.get('/api/capabilities')
    def capabilities():
        import json
        # The Lumerical property inventory plus the combination registry
        # (torchfdtd/capabilities.py rendered by scripts/build_capability_tables.py).
        inventory = json.loads(Path(__file__).with_name('feature_inventory.json').read_text(encoding='utf-8'))
        inventory['combinations'] = json.loads(Path(__file__).with_name('capabilities.json').read_text(encoding='utf-8'))
        return inventory

    @app.get('/api/examples/{name}')
    def example(name: str):
        if name not in ('waveguide', 'scatterer', '3d', 'pmc'):
            raise HTTPException(404, 'Unknown example')
        return demo_project(name)

    @app.post('/api/validate')
    def validate(project: Project):
        # Dispatch-time contracts (exact-endpoint PMC, tensor media) are rejections, not server faults.
        try:summary=estimate(project);plan_hash=resolve_plan(project).plan_hash
        except ValueError as exc:raise HTTPException(422,str(exc)) from exc
        return {**summary, 'plan_hash': plan_hash, 'execution': resolution(project, summary), 'project': project.model_dump()}

    def resolution(project, summary=None):
        # Auto/streamed selection reads live resources; a scene that fits nothing
        # is reported in the record, not raised.
        try:return resolve_execution(project, health=execution_resources(), scratch=scratch_directory(root), summary=summary)
        except Exception as exc:
            return dict(requested=project.region.execution_mode, mode=None, error=str(exc), warnings=[])

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
        try:summary=estimate(project)
        except ValueError as exc:raise HTTPException(422,str(exc)) from exc
        return dict(summary=summary, nodes_um=axes,
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
            job['execution'] = execution = resolution(project)
            if execution.get('error'):
                raise ValueError(execution['error'])
            if execution['mode'] == 'resident':
                result = Simulation(project).run(progress=update, cancel=job['cancel'])
            elif execution['mode'] == 'tiled':
                result = run_tiled_job(project, execution, progress=update, cancel=job['cancel'])
                job['execution'] = {**execution, 'report': result.summary['execution']['report'], 'indicator': result.summary['execution']['indicator']}
            else:
                result = run_streamed_job(project, execution, progress=update, cancel=job['cancel'])
                job['execution'] = {**execution, 'report': result.summary['execution']['report']}
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

    from .radiation_api import register_radiation_routes
    register_radiation_routes(app, get_job)
    from .farfield_api import register_farfield_routes
    register_farfield_routes(app, get_job)
    from .propagation_api import register_propagation_routes
    register_propagation_routes(app, get_job)

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
        # Modal publication uses this same lock. Alternate generic-route
        # cancellation must linearize with its final status/file publication.
        with lock:
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
    from .mode_network_service import attach_mode_network_routes
    attach_mode_network_routes(app, root, pool, jobs, lock)
    from .fsp_service import attach_fsp_routes
    attach_fsp_routes(app, root)
    from .gds_service import attach_gds_routes
    attach_gds_routes(app, root)
    static = Path(__file__).parent/'web'
    if static.exists():
        app.mount('/', WorkbenchFiles(directory=static, html=True), name='workbench')
    app.state.jobs = jobs
    app.state.pool = pool
    return app
