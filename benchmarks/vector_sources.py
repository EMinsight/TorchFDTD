"""Electric/magnetic vector sources against independent periodic Fourier updates."""
import json
from pathlib import Path
import numpy as np
from photonweave import Project,Region,Source,Monitor,Simulation,RunControl
from photonweave.models import Boundaries,BoundaryFace


def periodic_project(dimension='3d',family='H'):
    boundaries=Boundaries(**{a+'_'+s:BoundaryFace(kind='periodic') for a in ('xy' if dimension=='2d' else 'xyz') for s in ('min','max')})
    return Project(region=Region(dimension=dimension,size=(1.6,1.4,1.2),mesh=.1,steps=80,
        boundaries=boundaries,backend='cpu',precision='float64',material_sampling='yee',
        snapshot_interval=80,run_control=RunControl(divergence_check=False)),
        sources=[Source(component=family+'z',theta=38,phi=127,center=(.023,.021,.016 if dimension=='3d' else 0),
            wavelength=1,time_definition='standard',pulse_offset=4e-15,pulse_length=2e-15,phase=19)],
        monitors=[Monitor(component=family+'x',center=(.3,.2,0))])


def fourier_reference(p):
    """Periodic Yee recurrence from analytic Fourier symbols, without native curls."""
    r=p.region;s=p.sources[0];shape=r.shape;dt=r.time_step
    axes=np.meshgrid(*(2*np.pi*np.fft.fftfreq(n) for n in shape),indexing='ij')
    q=np.stack(axes,axis=-1)
    minus=1-np.exp(-1j*q);plus=np.exp(1j*q)-1
    electric=np.zeros((*shape,3),complex);magnetic=np.zeros_like(electric)
    theta,phi=np.deg2rad([s.theta,s.phi])
    direction=np.array([np.sin(theta)*np.cos(phi),np.sin(theta)*np.sin(phi),np.cos(theta)])
    injection=np.zeros_like(electric)
    for component in range(3):
        # Physical Yee coordinates: E has its own half-cell offset, H the complement.
        offsets=np.eye(3)[component]/2
        if s.component[0]=='H':offsets=.5-offsets
        index=[0 if n==1 else int(np.floor((c+length/2)/r.mesh-offset+.5))
               for n,c,length,offset in zip(shape,s.center,r.actual_size,offsets)]
        injection[...,component]=direction[component]*np.exp(-1j*sum(a*k for a,k in zip(axes,index)))
    t=np.arange(1,r.steps+1)*dt+(.5*dt if s.component[0]=='H' else 0)
    # Independent standard Gaussian formula, in reduced field-increment units.
    sigma=s.pulse_length/(2*np.sqrt(np.log(2)))
    wave=s.amplitude*np.exp(-.5*((t-s.pulse_offset)/sigma)**2)*np.sin(
        -2*np.pi*299792458/(s.wavelength*1e-6)*(t-s.pulse_offset)+np.deg2rad(s.phase))
    courant=.99/np.sqrt(2 if r.dimension=='2d' else 3)
    for value in wave:
        electric+=courant*np.cross(minus,magnetic)
        if s.component[0]=='E':electric+=value*injection
        magnetic-=courant*np.cross(plus,electric)
        if s.component[0]=='H':magnetic+=value*injection
    return [np.fft.ifftn(v,axes=(0,1,2)).real for v in (electric,magnetic)]


def main():
    records=[]
    for dimension in ('2d','3d'):
        for family in ('E','H'):
            p=periodic_project(dimension,family)
            expected=fourier_reference(p);result=Simulation(p).run()
            errors={}
            for name,actual,reference in zip(('E','H'),(result.electric,result.magnetic),expected):
                errors[name]=dict(max_absolute=float(np.max(abs(actual-reference))),
                    relative_l2=float(np.linalg.norm(actual-reference)/np.linalg.norm(reference)))
                assert np.allclose(actual,reference,rtol=2e-12,atol=2e-13)
            records.append(dict(project=p.model_dump(),errors=errors))
    target=Path('results/vector-sources.json');target.parent.mkdir(parents=True,exist_ok=True)
    data=dict(method='Periodic Yee recurrence from analytic Fourier difference symbols, without the native curl or waveform functions. Real float64, 80 steps, 2D/3D and electric/magnetic vector excitation. Same discrete problem, not a continuum convergence or calibrated dipole-power claim.',cases=records)
    target.write_text(json.dumps(data,indent=2,allow_nan=False)+'\n',encoding='utf-8')
    print(json.dumps([dict(dimension=c['project']['region']['dimension'],family=c['project']['sources'][0]['component'][0],errors=c['errors']) for c in records],indent=2))


if __name__=='__main__':main()
