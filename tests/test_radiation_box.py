"""Owned stored-face adapters against one analytic dipole, no FDTD runs."""
from copy import deepcopy
import math
import numpy as np
import pytest
import torch
from torchfdtd import Project,Region,Source,Material,Structure
from torchfdtd.radiation_box import native_radiation_box
from torchfdtd.radiation import project_farfield
from test_radiation import dipole_faces


def data(dtype=torch.float64):
    faces,bounds,dipole=dipole_faces(12,dtype=dtype)
    p=Project(region=Region(dimension='3d',size=(4.,4.,4.),mesh=.1,pml_cells=4,
        steps=10,background_index=1.3,precision='float32',material_sampling='yee'),
        sources=[Source(center=(.12,-.08,.05),component='Ez')],structures=[],monitors=[])
    records=[]
    for name,f in faces.items():
        records.append(dict(id=name,components=list(f.components),fields=f.fields.numpy().copy(),
            frequency_hz=f.frequency_hz.numpy().copy(),points_um=f.points_um.numpy().copy(),weights=f.weights.numpy().copy(),
            shape=f.shape,normal_axis=f.normal,run_signature=f.run_signature,flux_units=f.flux_units,
            settings=dict(spectrum=dict(apodization='none'),time_downsample=1)))
    result=dict(project=p.model_dump(mode='json'),summary=dict(steps=10,requested_steps=10,
        cancelled=False,termination_reason='max_steps'),frequency_fields=records)
    return result,{name:name for name in faces},bounds,faces,dipole


@pytest.mark.parametrize('dtype',[torch.float32,torch.float64])
def test_analytic_dipole_owned_adapter_and_direct_transform(dtype):
    result,ids,bounds,faces,dipole=data(dtype)
    packet=native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3)
    directions=torch.tensor([[1.,0,0],[0,1.,0],[0,0,1.],[-1.,0,0]],dtype=dtype)
    got=packet.project(directions,direction_chunk=2,point_chunk=73)
    expected=project_farfield(faces,directions,bounds_um=bounds,refractive_index=1.3,direction_chunk=2,point_chunk=73)
    torch.testing.assert_close(got.electric_amplitude,expected.electric_amplitude,rtol=0,atol=0)
    transverse=dipole-directions*(directions*dipole).sum(-1,keepdim=True)
    phase=torch.exp(-1j*(2*math.pi*1.3/1.55)*(directions@torch.tensor([.12,-.08,.05],dtype=dtype)))
    analytic=(2*math.pi/1.55)**2*transverse*phase[:,None]*1e-6
    assert float((got.electric_amplitude[0]-analytic).norm()/analytic.norm())<.01
    assert packet.field_dtype==str(got.electric_amplitude.dtype).removeprefix('torch.')
    assert packet.report['field_kind']=='total' and packet.report['normalization']=='none'
    result['frequency_fields'][0]['fields'][:]=0
    result['project']['region']['background_index']=9
    report=packet.report;report['field_kind']='corrupted'
    assert packet.report['field_kind']=='total'
    again=packet.project(directions,direction_chunk=2,point_chunk=73)
    torch.testing.assert_close(again.electric_amplitude,got.electric_amplitude,rtol=0,atol=0)
    with pytest.raises(ValueError): packet._records[0][1]['fields'].setflags(write=True)


def test_coherent_matched_incident_subtraction_on_every_face():
    result,ids,bounds,faces,_=data();reference=deepcopy(result)
    for sample,ref in zip(result['frequency_fields'],reference['frequency_fields']):
        incident=np.full_like(ref['fields'],.27+.14j)
        ref['fields']=incident;sample['fields']+=incident
    packet=native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3,reference=reference)
    got=packet.project([[1.,0,0],[0,1.,0]])
    expected=project_farfield(faces,[[1.,0,0],[0,1.,0]],bounds_um=bounds,refractive_index=1.3)
    torch.testing.assert_close(got.electric_amplitude,expected.electric_amplitude,rtol=1e-12,atol=1e-18)
    assert packet.report['field_kind']=='scattered'
    reference['frequency_fields'][-1]['run_signature']='other'
    with pytest.raises(ValueError,match='signature'):
        native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3,reference=reference)


@pytest.mark.parametrize('defect,reason',[
    ('duplicate','distinct'),('cancelled','Cancelled'),('periodic','isolated'),
    ('face_position','closed box'),('partial','rectangle'),('apodization','unapodized'),
    ('object','contrast-object'),('source','source support'),('index','background')])
def test_geometry_metadata_and_completion_rejections(defect,reason):
    result,ids,bounds,_,_=data();index=1.3
    if defect=='duplicate': ids['x_max']=ids['x_min']
    elif defect=='cancelled': result['summary']['cancelled']=True
    elif defect=='periodic':
        for s in ('min','max'): result['project']['region']['boundaries']['x_'+s]['kind']='periodic'
    elif defect=='face_position': result['frequency_fields'][0]['points_um'][:,0]+=.01
    elif defect=='partial': result['frequency_fields'][0]['points_um'][:,1]+=.01
    elif defect=='apodization': result['frequency_fields'][0]['settings']['spectrum']['apodization']='hann'
    elif defect=='object':
        result['project']['materials']=[Material(name='contrast',index=2).model_dump()]
        result['project']['structures']=[Structure(material='contrast',size=(2,2,2)).model_dump()]
    elif defect=='source': result['project']['sources'][0]['center']=[1.1,0,0]
    else: index=1.
    with pytest.raises(ValueError,match=reason): native_radiation_box(result,ids,bounds_um=bounds,refractive_index=index)


def test_preparation_and_projection_budget_precede_copies(monkeypatch):
    result,ids,bounds,_,_=data()
    def forbidden(*a,**k): raise AssertionError('copied before budget')
    with monkeypatch.context() as patch:
        patch.setattr('torchfdtd.radiation_box._immutable',forbidden)
        with pytest.raises(ValueError,match='budget'):
            native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3,host_budget_bytes=1)
    packet=native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3)
    monkeypatch.setattr('torchfdtd.radiation_box.native_radiation_plane',forbidden)
    with pytest.raises(ValueError,match='budget'): packet.project([[1.,0,0]],host_budget_bytes=1)


def test_raw_fp32_frequency_and_native_plane_shape_mismatch_rejected():
    result,ids,bounds,_,_=data(torch.float32)
    for row in result['frequency_fields']: row['frequency_hz']=row['frequency_hz'].astype(np.float64)
    result['frequency_fields'][-1]['frequency_hz'][0]+=1.
    with pytest.raises(ValueError,match='stored frequency'): native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3)
    result,ids,bounds,_,_=data();result['frequency_fields'][0]['shape']=(1,2,2)
    with pytest.raises(ValueError,match='shape'): native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3)


def test_upper_node_interpolation_cannot_touch_pml_indices():
    from torchfdtd.radiation_box import _support
    result,ids,bounds,faces,_=data()
    p=Project.model_validate(result['project']);face=faces['x_max']
    # x=1.55 midpoint's high Ex/Ey bracket reaches index36, first upper PML.
    face.points_um[:,0]=1.55
    with pytest.raises(ValueError,match='support enters PML'): _support(p,face)


def test_matched_external_source_and_nonhomogeneous_reference_contract():
    result,ids,bounds,_,_=data();reference=deepcopy(result)
    for item in (result,reference): item['project']['sources'][0]['center']=[1.1,0,0]
    packet=native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3,reference=reference)
    assert packet.report['field_kind']=='scattered'
    torch.testing.assert_close(packet.project([[1.,0,0]]).electric_amplitude,torch.zeros((1,1,3),dtype=torch.complex128))
    reference['project']['materials']=[Material(name='contrast',index=2).model_dump()]
    reference['project']['structures']=[Structure(material='contrast',size=(.2,.2,.2)).model_dump()]
    with pytest.raises(ValueError,match='reference must be homogeneous'):
        native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3,reference=reference)


def test_explicit_wrong_dft_and_trainable_projection_metadata_rejected():
    result,ids,bounds,_,_=data()
    result['frequency_fields'][0]['fourier_convention']='exp(-2 pi i f t)'
    with pytest.raises(ValueError,match='positive-time DFT'):
        native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3)
    del result['frequency_fields'][0]['fourier_convention']
    packet=native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3)
    with pytest.raises(ValueError,match='fixed CPU metadata'):
        packet.project(torch.tensor([[1.,0,0]],requires_grad=True))


def test_long_axis_workspace_rejects_before_project_or_mesh_allocation(monkeypatch):
    from torchfdtd.radiation_box import _axis_workspace_bytes
    result,ids,bounds,_,_=data()
    result['project']['region']['size']=[100000.,4.,4.]
    result['project']['region']['memory_mode']='budgeted'
    assert _axis_workspace_bytes(result['project'])>256_000_000
    def forbidden(*a,**k): raise AssertionError('Project/axis allocation preceded resource admission')
    monkeypatch.setattr('torchfdtd.radiation_box.Project.model_validate',forbidden)
    monkeypatch.setattr('torchfdtd.mesh.mesh_nodes',forbidden)
    monkeypatch.setattr('torchfdtd.radiation_box._immutable',forbidden)
    with pytest.raises(ValueError,match='budget'):
        native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3,host_budget_bytes=4*1024**2)


@pytest.mark.parametrize('key',['points_um','weights'])
def test_reference_raw_quadrature_difference_cannot_hide_in_fp32_cast(key,monkeypatch):
    result,ids,bounds,_,_=data(torch.float32)
    # Native FP32 fields can carry higher precision coordinate/area metadata.
    for record in result['frequency_fields']:
        record['points_um']=record['points_um'].astype(np.float64)
        record['weights']=record['weights'].astype(np.float64)
    reference=deepcopy(result)
    original=reference['frequency_fields'][0][key]
    changed=original.copy()
    changed.flat[0]=np.nextafter(changed.flat[0],np.inf)
    assert not np.array_equal(original,changed)
    np.testing.assert_array_equal(original.astype(np.float32),changed.astype(np.float32))
    reference['frequency_fields'][0][key]=changed
    from torchfdtd import radiation_box as module
    adapt=module.native_radiation_plane
    def guarded(record,**kwargs):
        assert record is not reference['frequency_fields'][0], 'Reference converted before raw equality gate'
        return adapt(record,**kwargs)
    monkeypatch.setattr(module,'native_radiation_plane',guarded)
    with pytest.raises(ValueError,match='raw points and weights'):
        native_radiation_box(result,ids,bounds_um=bounds,refractive_index=1.3,reference=reference)
