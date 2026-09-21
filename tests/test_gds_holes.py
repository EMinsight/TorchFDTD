"""Hole-bearing GDS geometry: keyhole contours, layer NOT, export and native sampling."""
import tempfile
from pathlib import Path
from datetime import datetime

import numpy as np
import pytest

gdstk=pytest.importorskip('gdstk')
from torchfdtd.gds import GDSLayer,import_gds,export_gds
from torchfdtd import Project,Region,Material,Source,Monitor,Simulation,Structure
from torchfdtd.solver import voxelize,field_axes


def write(tmp_path,polygons,name='layout.gds'):
    lib=gdstk.Library();cell=lib.new_cell('TOP');cell.add(*polygons);path=tmp_path/name
    with tempfile.TemporaryDirectory(prefix='.synthetic-gds-',dir='.') as directory:
        temporary=Path(directory)/'independent.gds'
        lib.write_gds(temporary,max_points=0,timestamp=datetime(2020,1,1))
        path.write_bytes(temporary.read_bytes())
    return path


def scene(steps=60,**region):
    return Project(region=Region(size=(4,4,1),mesh=.1,pml_cells=3,steps=steps,backend='cpu',precision='float32',
                                 material_sampling='yee',**region),materials=[Material(name='core',index=2.)],
                   sources=[Source(center=(-1.65,0,0),pulse='continuous',wavelength=1.)],monitors=[Monitor(center=(1.65,0,0))])


def world_contours(obj):
    return [np.asarray(obj.vertices)+obj.center[:2]]+[np.asarray(h)+obj.center[:2] for h in obj.holes]


def even_odd(x,y,contours):
    """Independent crossing-number membership, XOR over every contour, no boundary rule."""
    inside=np.zeros(np.broadcast_shapes(x.shape,y.shape),bool)
    for contour in contours:
        c=np.asarray(contour,dtype=float)
        for (x0,y0),(x1,y1) in zip(c,np.roll(c,-1,axis=0)):
            if y0==y1:continue
            inside^=((y0>y)!=(y1>y))&(x<x0+(x1-x0)*(y-y0)/(y1-y0))
    return inside


def assert_matches_even_odd(project,structures,z_min,z_max):
    eps,counts=voxelize(project)
    contours=[c for obj in structures for c in world_contours(obj)]
    for c,component in enumerate(('Ex','Ey','Ez')):
        x,y,z=np.meshgrid(*field_axes(project.region,component),indexing='ij',sparse=True)
        expected=np.where(even_odd(x,y,contours)&(z>z_min)&(z<z_max),4.,1.)
        np.testing.assert_array_equal(eps[...,c],expected.astype(eps.dtype))
    return eps,counts


def test_keyhole_ring_matches_independent_even_odd_rasterization(tmp_path):
    outer=gdstk.rectangle((-1.53,-1.53),(1.53,1.53));inner=gdstk.rectangle((-.62,-.62),(.62,.62))
    path=write(tmp_path,gdstk.boolean(outer,inner,'not',layer=1))
    result=import_gds(path,cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    assert len(result.structures)==1 and result.report['hole_count']==1
    ring=result.structures[0]
    assert len(ring.vertices)==4 and len(ring.holes)==1 and len(ring.holes[0])==4
    np.testing.assert_allclose(sorted(map(tuple,world_contours(ring)[1])),[(-.62,-.62),(-.62,.62),(.62,-.62),(.62,.62)],atol=1e-9)
    project=result.add_to(scene())
    eps,counts=assert_matches_even_odd(project,result.structures,-.23,.23)
    assert counts[ring.id]>0 and result.report==import_gds(path,cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')]).report


def test_etched_via_through_slab_and_cpu_simulation(tmp_path):
    path=write(tmp_path,[gdstk.rectangle((-1.53,-.62),(1.53,.62),layer=1),gdstk.ellipse((.07,.03),.33,tolerance=.01,layer=2)])
    with pytest.raises(ValueError,match='Unmapped'):import_gds(path,cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    result=import_gds(path,cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core',etch_by=((2,0),))])
    slab=result.structures[0]
    assert len(result.structures)==1 and len(slab.holes)==1 and len(slab.holes[0])>=8
    assert result.report['etched_layers']==[dict(layer=1,datatype=0,etch_by=[[2,0]],polygons=1)]
    assert result.report['ignored_geometry']==[]
    project=result.add_to(scene())
    eps,_=assert_matches_even_odd(project,result.structures,-.23,.23)
    x,y,z=np.meshgrid(*field_axes(project.region,'Ez'),indexing='ij')
    via=(np.hypot(x-.07,y-.03)<.25)&(abs(z)<.2);slab_mask=(abs(x)<1.4)&(abs(y)<.5)&(abs(z)<.2)&(np.hypot(x-.07,y-.03)>.45)
    assert np.all(eps[...,2][via]==1) and np.all(eps[...,2][slab_mask]==4)
    actual=Simulation(project).run()
    assert np.isfinite(actual.electric).all() and np.max(np.abs(actual.signals))>0


def test_nested_islands_and_multiple_holes(tmp_path):
    outer=gdstk.rectangle((-1.53,-1.53),(1.53,1.53));hole=gdstk.rectangle((-1.02,-1.02),(1.02,1.02))
    island=gdstk.rectangle((-.62,-.62),(.62,.62));pit=gdstk.rectangle((-.23,-.23),(.23,.23))
    nested=gdstk.boolean(outer,hole,'not',layer=1)+gdstk.boolean(island,pit,'not',layer=1)
    two=gdstk.boolean(gdstk.rectangle((-1.53,-1.53),(1.53,1.53)),
                      [gdstk.rectangle((-1.12,-.43),(-.37,.43)),gdstk.rectangle((.37,-.43),(1.12,.43))],'not',layer=1)
    result=import_gds(write(tmp_path,nested),cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    assert sorted(len(s.holes) for s in result.structures)==[1,1] and result.report['hole_count']==2
    assert_matches_even_odd(result.add_to(scene()),result.structures,-.23,.23)
    result=import_gds(write(tmp_path,two,'two.gds'),cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    assert len(result.structures)==1 and len(result.structures[0].holes)==2
    assert_matches_even_odd(result.add_to(scene()),result.structures,-.23,.23)


def test_hole_touching_the_outer_boundary_is_never_silently_filled(tmp_path):
    outer=gdstk.rectangle((-1.53,-1.53),(1.53,1.53))
    # A hole sharing an outer edge is a notch: one simple contour, empty notch.
    result=import_gds(write(tmp_path,gdstk.boolean(outer,gdstk.rectangle((-.62,-.62),(1.53,.62)),'not',layer=1)),
                      cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    assert len(result.structures)==1 and result.structures[0].holes==()
    eps,_=assert_matches_even_odd(result.add_to(scene()),result.structures,-.23,.23)
    x,y,z=np.meshgrid(*field_axes(scene().region,'Ez'),indexing='ij')
    assert np.all(eps[...,2][(abs(x-.5)<.4)&(abs(y)<.5)&(abs(z)<.2)]==1)
    # A hole touching the outer contour at isolated vertices is rejected explicitly.
    diamond=gdstk.Polygon([(-1.53,0),(0,-.62),(1.53,0),(0,.62)])
    with pytest.raises(ValueError,match='touching'):
        import_gds(write(tmp_path,gdstk.boolean(outer,diamond,'not',layer=1),'diamond.gds'),
                   cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    with pytest.raises(ValueError,match='simple polygon'):
        import_gds(write(tmp_path,[gdstk.Polygon([(0,0),(1,1),(1,0),(0,1)],layer=1)],'bowtie.gds'),
                   cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])


def test_native_polygon_hole_admission():
    square=((-2,-2),(2,-2),(2,2),(-2,2));hole=((-1,-1),(1,-1),(1,1),(-1,1))
    Structure(kind='polygon',vertices=square,holes=(hole,((1.2,-1),(1.5,-1),(1.5,1),(1.2,1))),size=(4,4,.5))
    for holes in ((((-1,-1),(2,-1),(2,1),(-1,1)),),(((-2,0),(0,-1),(2,0),(0,1)),),(hole,((-.5,-.5),(.5,-.5),(.5,.5),(-.5,.5))),
                  (hole,((1,-1),(1.5,-1),(1.5,1),(1,1))),(((0,0),(1,1),(1,0),(0,1)),)):
        with pytest.raises(ValueError):Structure(kind='polygon',vertices=square,holes=holes,size=(4,4,.5))
    with pytest.raises(ValueError,match='Only polygons'):Structure(kind='rectangle',holes=(hole,))


def test_same_layer_inner_contour_is_union_and_etch_pair_is_mapped(tmp_path):
    outer=gdstk.rectangle((-1.53,-1.53),(1.53,1.53),layer=1);inner=lambda layer:gdstk.rectangle((-.62,-.62),(.62,.62),layer=layer)
    result=import_gds(write(tmp_path,[outer,inner(1)]),cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    assert len(result.structures)==2 and result.report['hole_count']==0
    eps,_=voxelize(result.add_to(scene()))
    x,y,z=np.meshgrid(*field_axes(scene().region,'Ez'),indexing='ij')
    assert np.all(eps[...,2][(abs(x)<.5)&(abs(y)<.5)&(abs(z)<.2)]==4)
    layer=GDSLayer(1,0,-.23,.23,'core',etch_by=[[2,0]])
    assert layer.etch_by==((2,0),)
    result=import_gds(write(tmp_path,[outer,inner(2)],'etched.gds'),cell='TOP',layers=[layer])
    assert len(result.structures)==1 and len(result.structures[0].holes)==1 and result.report['ignored_geometry']==[]
    assert result.report['mapped_layers']==[dict(layer=1,datatype=0,polygons=1)]
    eps,_=voxelize(result.add_to(scene()))
    assert np.all(eps[...,2][(abs(x)<.5)&(abs(y)<.5)&(abs(z)<.2)]==1)
    with pytest.raises(ValueError,match='etch_by'):GDSLayer(1,0,-.23,.23,'core',etch_by=((1,0),))
    with pytest.raises(ValueError,match='etch_by'):GDSLayer(1,0,-.23,.23,'core',etch_by=((2,0,1),))


def test_export_writes_bridged_holes_and_rejects_rounding_collapse(tmp_path):
    original=Structure(id='ring',kind='polygon',vertices=((-2,-2),(2,-2),(2,2),(-2,2)),
                       holes=(((-1,-1),(1,-1),(1,1),(-1,1)),((1.2,-1),(1.5,-1),(1.5,1),(1.2,1))),
                       center=(1,2,.3),size=(4,4,.4),rotation=90,material='core')
    path=tmp_path/'holes.gds'
    report=export_gds(path,[original],layers={'ring':(7,3)})
    assert report==export_gds(path,[original],layers={'ring':(7,3)})
    imported=import_gds(path,cell='TOP',layers=[GDSLayer(7,3,.1,.5,'core')])
    back=imported.structures[0]
    assert len(imported.structures)==1 and len(back.holes)==2
    expected=[sorted(map(tuple,np.asarray(c)@np.array([[0,1],[-1,0]])+(1,2))) for c in (original.vertices,*original.holes)]
    actual=[sorted(map(tuple,np.round(c,9))) for c in world_contours(back)]
    for contour in expected:
        assert any(np.allclose(contour,candidate,atol=1e-9) for candidate in actual)
    tight=Structure(id='tight',kind='polygon',vertices=((-1,-1),(1,-1),(1,1),(-1,1)),
                    holes=(((-.9996,-.5),(.9996,-.5),(.9996,.5),(-.9996,.5)),),size=(2,2,.2),material='core')
    with pytest.raises(ValueError,match='no longer admitted'):export_gds(tmp_path/'tight.gds',[tight],layers={'tight':(1,0)},precision_m=1e-9)


def test_subpixel_interfaces_include_hole_edges(tmp_path):
    outer=gdstk.rectangle((-1.53,-1.53),(1.53,1.53));inner=gdstk.rectangle((-.62,-.62),(.62,.62))
    result=import_gds(write(tmp_path,gdstk.boolean(outer,inner,'not',layer=1)),cell='TOP',layers=[GDSLayer(1,0,-.23,.23,'core')])
    project=result.add_to(scene(interface_method='subpixel'))
    eps,_=voxelize(project)
    x,y,z=np.meshgrid(*field_axes(project.region,'Ez'),indexing='ij')
    hole=(abs(x)<.4)&(abs(y)<.4)&(abs(z)<.15);ring=(abs(x)>.8)&(abs(x)<1.3)&(abs(y)<.4)&(abs(z)<.15)
    edge=(abs(abs(x)-.62)<.06)&(abs(y)<.4)&(abs(z)<.15)
    assert np.allclose(eps[...,2][hole],1) and np.allclose(eps[...,2][ring],4)
    assert np.all((eps[...,2][edge]>1)&(eps[...,2][edge]<4))
