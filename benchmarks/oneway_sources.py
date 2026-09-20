"""One-way plane validation without commercial data or a second solver."""
import argparse
import json
from pathlib import Path
import numpy as np

from torchfdtd import Project, Region, Source, Monitor, Boundaries, BoundaryFace, Simulation


def plane_project(axis=0, component=2, direction='+', dimension='3d', index=1.):
    size = [.4, .4, .4]
    size[axis] = 16.
    bc = Boundaries()
    for a in range(2 if dimension == '2d' else 3):
        if a != axis:
            for side in ('min','max'):setattr(bc,'xyz'[a]+'_'+side,BoundaryFace(kind='periodic'))
    span = [0 if i == axis or (i==2 and dimension=='2d') else v for i,v in enumerate(size)]
    centers = [tuple(sign if i==axis else 0 for i in range(3)) for sign in (-.5,.5)]
    return Project(region=Region(dimension=dimension,size=tuple(size),mesh=.05,steps=120,pml_cells=30,
                       precision='float64',backend='cpu',material_sampling='yee',background_index=index,boundaries=bc),
        sources=[Source(kind='plane',injection='oneway',normal='xyz'[axis],direction=direction,
                        size=tuple(span),component='E'+'xyz'[component],wavelength=.8,
                        time_definition='standard',pulse_length=1.5e-15,pulse_offset=3e-15,phase=19)],
        monitors=[Monitor(center=c,component='E'+'xyz'[component]) for c in centers])


def long_line_reference(project):
    """Scalar recurrence on a line too long for any end to affect the answer.

    No native curl, waveform, CPML, source-preparation or injection code is used.
    The common Gaussian drive is constructed directly from its stated parameters.
    """
    r, s = project.region, project.sources[0]
    assert s.pulse=='gaussian' and s.time_definition=='standard' and not s.eliminate_discontinuities
    axis='xyz'.index(s.normal);d=1 if s.direction=='+' else -1
    spacing=r.mesh_steps or (r.mesh,)*3
    courant=299792458*r.time_step/(spacing[axis]*1e-6)
    size=2*r.steps+2*r.shape[axis]+40;drive_at=size//2;probe=drive_at+8
    e=np.zeros(size);h=np.zeros(size)
    times=np.arange(1,r.steps+1)*r.time_step
    sigma=s.pulse_length/(2*np.sqrt(np.log(2)))
    drive=s.amplitude*np.exp(-.5*((times-s.pulse_offset)/sigma)**2)*np.sin(
        -2*np.pi*299792458/(s.wavelength*1e-6)*(times-s.pulse_offset)+np.deg2rad(s.phase))
    corrections=[np.zeros(r.steps),np.zeros(r.steps)]
    for j,value in enumerate(drive):
        corrections[0][j]=courant/r.background_index**2*h[probe-1]
        e[1:]-=courant/r.background_index**2*(h[1:]-h[:-1]);e[drive_at]+=value
        corrections[1][j]=courant*e[probe]
        h[:-1]-=courant*(e[1:]-e[:-1])
    k=int(np.argmin(abs(r.mesh_nodes[axis][:-1]-s.center[axis])))
    j=np.arange(r.shape[axis]);ei=probe+d*(j-k);hi=ei if d==1 else ei-1
    ev=e[ei]*((j>=k) if d==1 else (j<=k))
    hv=h[hi]*((j>=k) if d==1 else (j<k))
    expected=[np.zeros((*r.shape,3)) for _ in range(2)]
    view=[1,1,1];view[axis]=len(j)
    for field,weight in s.polarization_components:
        ec='xyz'.index(field[1]);hc=3-axis-ec;cross=1 if (axis+1)%3==ec else -1
        expected[0][...,ec]=weight*ev.reshape(view)
        expected[1][...,hc]=weight*d*cross*hv.reshape(view)
    return expected, corrections


def measure(project):
    reference,_=long_line_reference(project)
    result=Simulation(project).run()
    errors={name:float(np.linalg.norm(actual-expected)/np.linalg.norm(expected))
            for name,actual,expected in zip(('E','H'),(result.electric,result.magnetic),reference)}
    s=project.sources[0];a='xyz'.index(s.normal)
    k=int(np.argmin(abs(project.region.mesh_nodes[a][:-1]-s.center[a])))
    outside=[slice(None)]*3;outside[a]=slice(None,k) if s.direction=='+' else slice(k+1,None)
    leak=float(np.max(abs(result.electric[tuple(outside)]))/np.max(abs(result.electric)))
    return dict(normal=s.normal,component=s.component,direction=s.direction,dimension=project.region.dimension,
                background_index=project.region.background_index,relative_l2=errors,
                outside_electric_peak_ratio=leak,project=project.model_dump())


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',default='results/oneway-sources.json')
    args=parser.parse_args();cases=[]
    for dimension in ('2d','3d'):
        for axis in range(2 if dimension=='2d' else 3):
            for ec in range(3):
                if ec==axis:continue
                for d in ('+','-'):
                    row=measure(plane_project(axis,ec,d,dimension))
                    cases.append(row)
                    print(dimension,row['normal'],row['component'],d,row['relative_l2'],row['outside_electric_peak_ratio'])
    from torchfdtd.injection import oneway_tables
    incident=[]
    for index in (1.,1.5,3.):
        p=plane_project(dimension='2d',index=index);p.region.steps=1600
        s=p.sources[0];s.wavelength=1.55;s.pulse_length=6e-15;s.pulse_offset=15e-15
        _,reference=long_line_reference(p)
        for layers in (32,96,192):
            s.incident_pml_cells=layers;actual=oneway_tables(s,p.region)
            error=max(float(np.linalg.norm(a-b)/np.linalg.norm(b)) for a,b in zip(actual,reference))
            incident.append(dict(background_index=index,layers=layers,relative_l2=error,project=p.model_dump()))
            print('Incident line',index,layers,error)
    data=dict(method='Finite-light-cone independent 1D Yee reference, no native curls or waveforms',
              cases=cases,incident_line=incident,
              scope='Early homogeneous propagation and finite incident-line errors, not general plane-wave or FSP equivalence')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(data,indent=2),encoding='utf8')


if __name__=='__main__':main()
