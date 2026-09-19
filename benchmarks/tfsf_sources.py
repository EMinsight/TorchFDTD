"""Independent finite-light-cone reference for closed TFSF boxes."""
import argparse
import json
from pathlib import Path
import numpy as np

from photonweave import Project,Region,Source,Monitor,Simulation


def box_project(axis=0,component=2,direction='+',dimension='3d',index=1.):
    return Project(region=Region(dimension=dimension,size=(3.2,3.2,3.2),mesh=.1,
        steps=90,pml_cells=4,backend='cpu',precision='float64',material_sampling='yee',
        background_index=index,snapshot_interval=30),
        sources=[Source(kind='tfsf',size=(1.6,1.6,1.6),normal='xyz'[axis],
            component='E'+'xyz'[component],direction=direction,wavelength=.8,
            time_definition='standard',pulse_length=1.5e-15,pulse_offset=3e-15,phase=19)],
        monitors=[Monitor(center=(0,0,0),component='E'+'xyz'[component]),
                  Monitor(center=(1.1,1.1,0),component='E'+'xyz'[component])])


def reference(project, *, probes=False):
    """No native waveform, source map, CPML or curl routines are called.

    Direct scalar recurrence on a line extending beyond the discrete light cone.
    Physical Yee coordinates determine each component's closed-box mask.
    """
    r,s=project.region,project.sources[0]
    active=2 if r.dimension=='2d' else 3
    axis='xyz'.index(s.normal);d=1 if s.direction=='+' else -1
    assert s.pulse=='gaussian' and s.time_definition=='standard'
    n=2*r.steps+2*r.shape[axis]+80;drive_at=n//2;entry=drive_at+8
    e=np.zeros(n);h=np.zeros(n)
    spacing=r.mesh_steps or (r.mesh,)*3
    c=299792458*r.time_step/(spacing[axis]*1e-6)
    sigma=s.pulse_length/(2*np.sqrt(np.log(2)))
    span=round(s.size[axis]/spacing[axis])
    history=[np.zeros(r.steps) for _ in range(3)]
    for q in range(1,r.steps+1):
        t=q*r.time_step
        value=s.amplitude*np.exp(-.5*((t-s.pulse_offset)/sigma)**2)*np.sin(
            -2*np.pi*299792458/(s.wavelength*1e-6)*(t-s.pulse_offset)+np.deg2rad(s.phase))
        e[1:]-=c/r.background_index**2*(h[1:]-h[:-1]);e[drive_at]+=value
        h[:-1]-=c*(e[1:]-e[:-1])
        if probes:
            history[0][q-1]=e[entry]
            history[1][q-1]=h[entry]
            history[2][q-1]=e[entry+span]
    if probes:return history
    low=np.array(s.center)-np.array(s.size)/2
    high=np.array(s.center)+np.array(s.size)/2
    start=round(((low[axis] if d==1 else high[axis])+r.actual_size[axis]/2)/spacing[axis])
    j=np.arange(r.shape[axis]);ei=entry+d*(j-start);hi=ei-(1 if d==-1 else 0)
    expected=[np.zeros((*r.shape,3)) for _ in range(2)];masks=[]
    for family in ('E','H'):
        family_masks=[]
        for component in range(3):
            coords=[(np.arange(r.shape[a])+(.5 if ((a==component) if family=='E' else (a!=component)) else 0))*spacing[a]-r.actual_size[a]/2
                    for a in range(3)]
            mask=np.ones(r.shape,dtype=bool)
            for a in range(active):
                shape=[1,1,1];shape[a]=r.shape[a]
                mask&=((coords[a]>=low[a]-1e-12)&(coords[a]<=high[a]+1e-12)).reshape(shape)
            family_masks.append(mask)
        masks.append(np.stack(family_masks,axis=-1))
    shape=[1,1,1];shape[axis]=r.shape[axis]
    for field,weight in s.polarization_components:
        ec='xyz'.index(field[1]);hc=3-axis-ec
        cross=1 if (axis+1)%3==ec else -1
        expected[0][...,ec]=weight*e[ei].reshape(shape)
        expected[1][...,hc]=weight*d*cross*h[hi].reshape(shape)
    return [field*mask for field,mask in zip(expected,masks)],masks


def measure(project):
    expected,masks=reference(project);result=Simulation(project).run()
    fields=(result.electric,result.magnetic)
    return dict(normal=project.sources[0].normal,component=project.sources[0].component,
        direction=project.sources[0].direction,dimension=project.region.dimension,
        relative_l2={family:float(np.linalg.norm(a-b)/np.linalg.norm(b))
                     for family,a,b in zip(('E','H'),fields,expected)},
        outside_peak_ratio={family:float(np.max(abs(a[~mask]))/np.max(abs(a)))
                            for family,a,mask in zip(('E','H'),fields,masks)},
        project=project.model_dump())


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',default='results/tfsf-sources.json')
    args=parser.parse_args();rows=[]
    for dimension in ('2d','3d'):
        for axis in range(2 if dimension=='2d' else 3):
            for component in range(3):
                if component==axis:continue
                for direction in ('+','-'):
                    row=measure(box_project(axis,component,direction,dimension))
                    rows.append(row)
                    print(dimension,axis,component,direction,row['relative_l2'],row['outside_peak_ratio'],flush=True)
    from photonweave.tfsf import incident_preview
    incident=[]
    for index in (1.,1.5,3.):
        p=box_project(dimension='2d',index=index);p.region.steps=1600
        s=p.sources[0];s.wavelength=1.55;s.pulse_length=6e-15;s.pulse_offset=15e-15
        expected=reference(p,probes=True)
        for layers in (32,96,192):
            s.incident_pml_cells=layers;actual=incident_preview(s,p.region)
            error=max(float(np.linalg.norm(a-b)/np.linalg.norm(b)) for a,b in zip(actual,expected))
            incident.append(dict(background_index=index,layers=layers,relative_l2=error,project=p.model_dump()))
            print('Incident line',index,layers,error,flush=True)
    target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(json.dumps(dict(method='Independent scalar Yee recurrence beyond the finite light cone and component-wise geometric masks.',cases=rows,incident_line=incident),indent=2,allow_nan=False)+'\n',encoding='utf-8')


if __name__=='__main__':main()
