"""Finite-domain harmonic diagnosis and one lower-reflection CPU followup.

The diagnostic assembles a scalar complex linear system, not a time-domain
FDTD run. Native CPML coefficients and source tables are data inputs. Spatial
differences, temporal response, outgoing boundaries and projection are derived
here independently. Only this homogeneous normal-incidence interface applies.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import time
import numpy as np
import torch

from benchmarks.mode_network_unequal_oracle import yee_interface,packed,MAX_COMPLEX_ERROR
from torchfdtd import Project,Region,Source,AdjointOptions
from torchfdtd.mode_network import FixedModePort,ModeNetwork
from torchfdtd.boundaries import BoundaryDescription


def make(domain_um,pml_cells):
    r=Region(dimension='3d',size=(domain_um,1.,1.),mesh=.2,pml_cells=pml_cells,steps=600,
        material_sampling='yee',precision='float32',
        boundaries={a+'_'+side:dict(kind='periodic') for a in 'yz' for side in ('min','max')})
    p=Project(region=r,sources=[Source(kind='plane',normal='x',center=(-2.,0.,0.),
        size=(0.,1.,1.),pulse_cycles=2)],monitors=[])
    ports=(FixedModePort('left',-1.,-2.,1,(0,)),FixedModePort('right',1.,2.,-1,(0,)))
    return ModeNetwork(p,ports,options=AdjointOptions(checkpoints=4,backward_kernel='torch'),
                       port_permittivities={'left':1.,'right':1.44})


def harmonic(network,*,transparent=False):
    r=network.project.region;n=r.shape[0];courant=r.rectangular_courant
    omega=2*np.pi*299792458/(1.55e-6)*r.time_step
    inverse_z=np.exp(1j*omega);kappa=2*np.sin(omega/2)/courant
    eye=np.eye(n);minus=np.zeros((n,n));plus=np.zeros((n,n))
    for j in range(1,n):minus[j,j]=1;minus[j,j-1]=-1
    for j in range(n-1):plus[j,j+1]=1;plus[j,j]=-1
    boundary=BoundaryDescription(r);factors=[]
    for forward,component in ((False,2),(True,1)):
        factor=np.ones(n,complex)
        if not transparent:
            for segment in boundary.cpml[forward,0,component]:
                span=segment['slice'][0];offset=0 if forward else 1
                ids=np.arange(span.start+offset,span.stop+offset)
                b,c,ik=[segment[key].ravel().astype(np.float32) for key in ('b','c','inv_k')]
                # psi_n=b psi_(n-1)+c derivative_n.
                factor[ids]=ik+c/(1-b*inverse_z)
        factors.append(factor)
    admittance=[];basis=[]
    for index,launch in enumerate(network._launches):
        fields=launch.detector_mode(network.ports[index].coordinate_um).fields.mean((0,1))
        e=fields[1:3];unit=e/np.linalg.norm(e)
        if abs(unit[0])<.1:raise ValueError('This scalar diagnostic requires nonzero Ey in the selected homogeneous mode.')
        admittance.append(float(((e[0].conj()*fields[5]-e[1].conj()*fields[4])/(abs(e)**2).sum()).real))
        basis.append(unit)
    def solve(epsilon,kicks):
        matrix=np.block([[(1-inverse_z)*eye,courant*inverse_z*(factors[0]/epsilon)[:,None]*minus],
                         [courant*factors[1][:,None]*plus,(1-inverse_z)*eye]])
        if transparent:
            qleft,qright=2*np.arcsin(np.sqrt(epsilon[[0,-1]])*kappa/2)
            # Left outgoing H[+1/2]/E[0]=-n exp(-i(q+Omega)/2).
            # Right outgoing H[N-1/2]/E[N-1]=+n exp(i(q-Omega)/2).
            matrix[0,:]=0;matrix[0,0]=np.sqrt(epsilon[0])*np.exp(-.5j*(qleft+omega));matrix[0,n]=1
            matrix[-1,:]=0;matrix[-1,n-1]=-np.sqrt(epsilon[-1])*np.exp(.5j*(qright-omega));matrix[-1,-1]=1
        electric,magnetic=np.split(np.linalg.solve(matrix,kicks),2)
        amplitudes=[]
        for j,y in zip(network.indices,admittance):
            # Native plane DFT corrects H's +dt/2 sampling time. Spatial
            # colocation averages the two adjacent half-cell H samples.
            h=.5*(magnetic[j-1]+magnetic[j])*np.exp(.5j*omega)
            amplitudes.append(.5*np.sqrt(y)*np.array([electric[j]+h/y,electric[j]-h/y]))
        return amplitudes
    result=np.zeros((2,2),complex)
    for column,launch in enumerate(network._launches):
        kicks=np.zeros(2*n,complex)
        for component,location,waveform,profile in launch.terms:
            if component not in ('Ey','Hz'):continue
            offset=0 if component=='Ey' else n
            kicks[offset+location[0].start]+=np.dot(waveform,np.exp(1j*omega*np.arange(r.steps)))*float(profile.mean())
        epsilon=np.ones(n);epsilon[n//2:]=np.float32(1.44)
        reference=solve(np.full(n,[1.,np.float32(1.44)][column]),kicks)
        sample=solve(epsilon,kicks)
        for row in range(2):
            result[row,column]=(sample[row][1-row]-(reference[row][1-row] if row==column else 0))/reference[column][column]
            if row!=column:result[row,column]*=np.vdot(basis[row],basis[column])
    return result,dict(native_detector_admittance=admittance,
                       native_q_rad_per_cell=[l.mode.beta_per_um*.2 for l in network._launches])


def run():
    root=Path(__file__).resolve().parents[1]
    prior_path=root/'docs/validation/mode_network_unequal_interface_cpu.json'
    prior_bytes=prior_path.read_bytes();prior=json.loads(prior_bytes)
    names=list(prior['source_sha256'])+['benchmarks/mode_network_unequal_cpml.py']
    hashes={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in names}
    coarse=make(8.,5)
    oracle,details=yee_interface(epsilon_left=1.,epsilon_right=float(np.float32(1.44)),
        h_um=.2,dt_seconds=coarse.project.region.time_step)
    finite,basis=harmonic(coarse)
    outgoing,_=harmonic(coarse,transparent=True)
    raw=np.asarray(prior['measured_s_real_imag']);previous=raw[...,0]+1j*raw[...,1]
    diagnosis=dict(coarse_finite_cpml_s_real_imag=packed(finite),
        coarse_finite_cpml_vs_native_error=abs(finite-previous).tolist(),
        maximum_coarse_finite_cpml_vs_native_error=float(abs(finite-previous).max()),
        exact_outgoing_s_real_imag=packed(outgoing),
        maximum_exact_outgoing_vs_interface_error=float(abs(outgoing-oracle).max()),
        prepared_basis=basis,interface_oracle=details)
    del coarse
    # One predeclared physical PML trial, not a fitted sigma/interface shift.
    network=make(12.,15)
    prediction,_=harmonic(network)
    trial=dict(domain_um=[12.,1.,1.],shape=list(network.project.region.shape),
        h_um=.2,pml_cells=15,pml_thickness_um=3.,ports_um=[-1.,1.],sources_um=[-2.,2.],
        interface_first_sample_um=0.,steps=600,dt_seconds=network.project.region.time_step,
        harmonic_s_real_imag=packed(prediction),maximum_predicted_complex_error=float(abs(prediction-oracle).max()))
    if trial['maximum_predicted_complex_error']>MAX_COMPLEX_ERROR:
        raise RuntimeError('The sole harmonic PML trial failed. No native followup was run: '+json.dumps(trial))
    epsilon=network.reference_epsilon(port='left',device='cpu');epsilon[network.project.region.shape[0]//2:]=1.44
    started=time.perf_counter()
    with torch.no_grad():result=network(epsilon)
    elapsed=time.perf_counter()-started
    measured=result.s.numpy();errors=abs(measured-oracle)
    assert prior_path.read_bytes()==prior_bytes
    changed=[name for name,value in hashes.items() if hashlib.sha256((root/name).read_bytes()).hexdigest()!=value]
    if changed:raise RuntimeError('Source changed during followup: '+', '.join(changed))
    return dict(recorded_utc=datetime.now(timezone.utc).isoformat(),device='cpu',precision='float32',
        revision=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
        source_sha256=hashes,prior_record=prior_path.relative_to(root).as_posix(),
        prior_record_sha256=hashlib.sha256(prior_bytes).hexdigest(),diagnosis=diagnosis,
        harmonic_trials=[trial],criterion=prior['criterion'],accepted=bool(errors.max()<=MAX_COMPLEX_ERROR),
        measured_s_real_imag=packed(measured),oracle_s_real_imag=packed(oracle),
        complex_entry_absolute_error=errors.tolist(),maximum_complex_error=float(errors.max()),
        maximum_native_vs_finite_cpml_error=float(abs(measured-prediction).max()),
        native_power_columns=(abs(measured)**2).sum(0).tolist(),
        native_network_forward_seconds=elapsed,
        scope='One lower-reflection physical CPML followup. Same mesh, interface, port/source planes and duration. No new VJP, continuum refinement, GPU or general guide claim.')


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--output',required=True,type=Path)
    args=parser.parse_args();record=run()
    args.output.write_text(json.dumps(record,indent=2,allow_nan=False)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps({key:record[key] for key in ('accepted','diagnosis','harmonic_trials','measured_s_real_imag',
        'maximum_complex_error','maximum_native_vs_finite_cpml_error','native_network_forward_seconds')}))
    if not record['accepted']:raise SystemExit('Unchanged complex-S criterion failed.')
