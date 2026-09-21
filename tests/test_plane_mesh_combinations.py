"""Plane plans and solver meshes agree across mesh kinds, paths, devices and execution."""
from functools import lru_cache

import numpy as np
import pytest
import torch

from torchfdtd import (Project,Region,Source,Structure,FieldMonitor,SpectrumSettings,Simulation,
                        AdjointOptions,StreamedAdjointOptions,DifferentiablePlaneSimulation,freeze_refinements)
from torchfdtd.field_monitors import plane_plan
from torchfdtd.solver import voxelize

FREQUENCIES=[3e14,3.75e14]
MESHES=['graded','frozen','uniform']
DEVICES=['cpu',pytest.param('cuda',marks=pytest.mark.skipif(not torch.cuda.is_available(),reason='CUDA unavailable'))]


def scene(mesh,device):
    r=Region(dimension='3d',size=(3.2,3.2,3.2),mesh=.1,mesh_type='uniform' if mesh=='uniform' else 'graded',
             material_sampling='yee',mesh_max=.3,mesh_ppw=6,pml_cells=3,steps=60,backend=device,precision='float64',
             snapshot_interval=60)
    p=Project(region=r,structures=[Structure(id='block',center=(.9,0,0),size=(.2,.6,.6))],
        sources=[Source(id='source',center=(-.4,0,0),wavelength=.8,pulse_cycles=1)],
        monitors=[FieldMonitor(id='plane',center=(.4,0,0),size=(0,1,1),
            spectrum=SpectrumSettings(sampling='custom',custom_frequencies_hz=FREQUENCIES,apodization='none'))])
    p=freeze_refinements(p) if mesh=='frozen' else Project.model_validate(p.model_dump())
    assert (p.region.mesh_type=='graded' and p.region.mesh_auto_refine)==(mesh=='graded')
    assert (p.region.shape!=p.region.base_shape)==(mesh!='uniform')
    assert max(p.region.shape)<=32
    return p


def assert_same_nodes(actual,expected):
    assert tuple(len(a)-1 for a in actual)==tuple(len(b)-1 for b in expected)
    for a,b in zip(actual,expected):np.testing.assert_array_equal(a,b)


@lru_cache(maxsize=None)
def ordinary(mesh,device):
    """Ordinary Simulation plane monitor on the project's own mesh."""
    p=scene(mesh,device)
    result=Simulation(p).run()
    assert result.summary['backend']==device and result.summary['steps']==p.region.steps
    assert_same_nodes(result.project.region.mesh_nodes,p.region.mesh_nodes)
    plan=plane_plan(p.region,p.resolved_monitor(p.monitors[0]))
    record=result.frequency_fields[0]
    np.testing.assert_array_equal(record['points_um'],plan['points_um'])
    np.testing.assert_array_equal(record['weights'],plan['weights'])
    assert record['shape']==plan['shape'] and record['fields'].shape==(len(FREQUENCIES),len(plan['weights']),6)
    assert np.abs(record['fields']).max()>0 and np.isfinite(record['fields']).all()
    return p,record


@pytest.mark.parametrize('mesh',MESHES)
@pytest.mark.parametrize('device',DEVICES)
def test_ordinary_plane_monitor_uses_the_project_mesh(mesh,device):
    p,record=ordinary(mesh,device)
    assert record['run_signature']
    assert_same_nodes(p.region.mesh_nodes,scene(mesh,device).region.mesh_nodes)


@pytest.mark.parametrize('mesh',MESHES)
@pytest.mark.parametrize('device',DEVICES)
@pytest.mark.parametrize('execution',['resident','streamed'])
def test_differentiable_planes_share_the_solver_mesh_and_spectra(mesh,device,execution):
    if device=='cuda':pytest.importorskip('cupy')
    p,record=ordinary(mesh,device)
    if execution=='resident':options=AdjointOptions(checkpoints=2)
    else:options=StreamedAdjointOptions(device=device,slab_width=8,temporal_depth=4,checkpoints=2,
                                         tile_transfers='async' if device=='cuda' else 'sync')
    model=DifferentiablePlaneSimulation(p,options)
    assert_same_nodes(model.project.region.mesh_nodes,p.region.mesh_nodes)
    assert_same_nodes(model.model.project.region.mesh_nodes,p.region.mesh_nodes)
    assert model.model.project.region.shape==p.region.shape
    epsilon,_=voxelize(p)
    epsilon=torch.as_tensor(epsilon,dtype=torch.float64,device=device if execution=='resident' else 'cpu')
    with torch.no_grad():plane=model(epsilon,FREQUENCIES)['plane']
    np.testing.assert_array_equal(plane.points_um.cpu().numpy(),record['points_um'])
    np.testing.assert_array_equal(plane.weights.cpu().numpy(),record['weights'])
    assert plane.shape==record['shape'] and plane.run_signature==model.signature
    fields=plane.fields.cpu().numpy();scale=np.abs(record['fields']).max()
    np.testing.assert_allclose(fields/scale,record['fields']/scale,rtol=1e-10,atol=1e-11)
    flux=plane.flux().cpu().numpy();flux_scale=np.abs(record['flux']).max()
    np.testing.assert_allclose(flux/flux_scale,record['flux']/flux_scale,rtol=1e-10,atol=1e-11)
