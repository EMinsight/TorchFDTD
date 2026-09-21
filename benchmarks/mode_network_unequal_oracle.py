"""Independent scalar Yee interface oracle and one CPU fixed-port comparison.

Only a homogeneous-transverse, isotropic single interface is covered. No fit
to measured S, continuum interface displacement, or native curl is used.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import time

import numpy as np
from benchmarks.provenance import git_revision

C_UM_S=299792458.0*1e6
MAX_COMPLEX_ERROR=.004  # Declared before the new native measurement.


def yee_interface(*, epsilon_left,epsilon_right,h_um,dt_seconds,
                  wavelength_um=1.55,first_right_sample_um=0.,ports_um=(-1.,1.)):
    """Solve the two interface recurrences, with collocated power amplitudes.

    For exp(i q j - i omega t), kappa=2 sin(omega dt/2)/(c dt/h).
    q=2 asin(sqrt(epsilon) kappa/2). At j=-1 (left epsilon), the
    recurrence fixes the continuation to E[0]. At j=0 (right epsilon),
    it fixes E[-1]. These two samples determine both reflection amplitudes.
    Spatial interpolation of H[j-1/2],H[j+1/2] multiplies H/E by cos(q/2).
    The native temporal DFT offsets remove the temporal half-step phase.
    Thus positive sampled admittance is Y=sqrt(epsilon)*cos(q/2).
    """
    values=np.asarray([epsilon_left,epsilon_right,h_um,dt_seconds,wavelength_um,*ports_um,first_right_sample_um])
    if not np.isfinite(values).all() or min(epsilon_left,epsilon_right,h_um,dt_seconds,wavelength_um)<=0:
        raise ValueError('Finite positive physical parameters are required.')
    kappa=2*np.sin(np.pi*C_UM_S*dt_seconds/wavelength_um)/(C_UM_S*dt_seconds/h_um)
    ratio=np.sqrt([epsilon_left,epsilon_right])*kappa/2
    if np.any(ratio<=0) or np.any(ratio>=1):raise ValueError('Require propagating modes below the Yee band edge.')
    ql,qr=2*np.arcsin(ratio)
    # Unknown [r,t]. Left incidence: t=1+r and continuation at E[-1].
    rleft,tleft=np.linalg.solve(np.array([[1,-1],[np.exp(1j*ql),-np.exp(-1j*qr)]]),
                               [-1,-np.exp(-1j*ql)])
    # Right incidence: t=1+r and continuation at E[-1] into the left guide.
    rright,tright=np.linalg.solve(np.array([[1,-1],[np.exp(-1j*qr),-np.exp(1j*ql)]]),
                                 [-1,-np.exp(1j*qr)])
    admittance=np.sqrt([epsilon_left,epsilon_right])*np.cos(np.array([ql,qr])/2)
    pl=np.exp(1j*ql*(first_right_sample_um-ports_um[0])/h_um)
    pr=np.exp(1j*qr*(ports_um[1]-first_right_sample_um)/h_um)
    s=np.array([[rleft*pl**2,tright*np.sqrt(admittance[0]/admittance[1])*pl*pr],
                [tleft*np.sqrt(admittance[1]/admittance[0])*pl*pr,rright*pr**2]])
    return s,dict(kappa=float(kappa),q_rad_per_cell=[float(ql),float(qr)],
                  collocated_admittance=admittance.tolist(),
                  interface_electric_amplitudes=[[float(z.real),float(z.imag)] for z in (rleft,tleft,rright,tright)])


def packed(values):
    return np.stack((np.asarray(values).real,np.asarray(values).imag),axis=-1).tolist()


def run_native_case():
    import torch
    from torchfdtd import Project,Region,Source,AdjointOptions
    from torchfdtd.mode_network import FixedModePort,ModeNetwork
    from torchfdtd.solver import field_axes
    root=Path(__file__).resolve().parents[1]
    names=['benchmarks/mode_network_unequal_oracle.py','tests/test_mode_network_unequal.py']
    names += ['torchfdtd/'+name+'.py' for name in ('mode_network','mode_injection','mode_ports',
        'adjoint_planes','adjoint_spectrum','field_monitors','models','solver','waveforms',
        'differentiable','recomputed_batch','injection','boundaries','adjoint_memory')]
    hashes={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    region=Region(dimension='3d',size=(8.,1.,1.),mesh=.2,pml_cells=5,steps=600,
        material_sampling='yee',precision='float32',
        boundaries={a+'_'+side:dict(kind='periodic') for a in 'yz' for side in ('min','max')})
    project=Project(region=region,sources=[Source(kind='plane',normal='x',center=(-2.,0.,0.),
        size=(0.,1.,1.),pulse_cycles=2)],monitors=[])
    ports=(FixedModePort('left',-1.,-2.,1,(0,)),FixedModePort('right',1.,2.,-1,(0,)))
    network=ModeNetwork(project,ports,options=AdjointOptions(checkpoints=4,backward_kernel='torch'),
                        port_permittivities={'left':1.,'right':1.44})
    epsilon=network.reference_epsilon(port='left',device='cpu')
    epsilon[20:]=1.44
    x=field_axes(region,'Ey')[0]
    config=dict(shape=list(region.shape),h_um=.2,dt_seconds=region.time_step,steps=region.steps,
        duration_seconds=region.steps*region.time_step,epsilon_left=float(epsilon[0,0,0,1]),
        epsilon_right=float(epsilon[20,0,0,1]),wavelength_um=1.55,
        first_right_sample_index=20,first_right_sample_um=float(x[20]),
        transverse_E_sample_coordinates_um=x.tolist(),
        transverse_E_epsilon_sequence=epsilon[:,0,0,1].tolist(),
        ports_um=[-1.,1.],sources_um=[-2.,2.],pml_cells=5,
        source_pulse_cycles=2,source_template=project.sources[0].model_dump(mode='json'))
    oracle,details=yee_interface(**{key:config[key] for key in ('epsilon_left','epsilon_right','h_um',
        'dt_seconds','wavelength_um','first_right_sample_um','ports_um')})
    # Criterion is fixed before execution and applies to every complex entry.
    criterion=dict(maximum_complex_entry_absolute_error=MAX_COMPLEX_ERROR,
                   meaning='all four S entries, independent Yee interface including reference-plane phases')
    started=time.perf_counter()
    with torch.no_grad():result=network(epsilon)
    elapsed=time.perf_counter()-started
    measured=result.s.numpy();errors=abs(measured-oracle)
    changes=[name for name,value in hashes.items() if hashlib.sha256((root/name).read_bytes()).hexdigest()!=value]
    if changes:raise RuntimeError('Measured source changed: '+', '.join(changes))
    return dict(recorded_utc=datetime.now(timezone.utc).isoformat(),device='cpu',precision='float32',
        revision=git_revision(root),
        torch_version=torch.__version__,source_sha256=hashes,configuration=config,
        criterion=criterion,accepted=bool(errors.max()<=MAX_COMPLEX_ERROR),
        measured_s_real_imag=packed(measured),oracle_s_real_imag=packed(oracle),
        complex_entry_absolute_error=errors.tolist(),maximum_complex_error=float(errors.max()),
        native_power_columns=(abs(measured)**2).sum(0).tolist(),
        oracle_power_columns=(abs(oracle)**2).sum(0).tolist(),oracle_details=details,
        native_network_forward_seconds=elapsed,
        reflectionless_rejection_margin=float(min(abs(oracle[0,0]),abs(oracle[1,1]))-MAX_COMPLEX_ERROR),
        scope='One homogeneous unequal-interface CPU forward. No new FD/VJP, continuum convergence, GPU, or general guide claim.')


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output',required=True,type=Path)
    args=parser.parse_args();record=run_native_case()
    args.output.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({key:record[key] for key in ('accepted','measured_s_real_imag','oracle_s_real_imag',
        'maximum_complex_error','complex_entry_absolute_error','native_network_forward_seconds')}))
    if not record['accepted']:raise SystemExit('Predeclared complex-S acceptance failed.')
