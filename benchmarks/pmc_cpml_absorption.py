"""Restricted endpoint CPML absorption gate with fixed predeclared conditions.

Run from a source checkout: python benchmarks/pmc_cpml_absorption.py
--output-dir results/new-absorption-run. The destination must not exist.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys
import time

import numpy as np
import torch

REPOSITORY = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPOSITORY))
from torchfdtd.pmc_cpml import EndpointCPMLSimulation
from torchfdtd.pmc_simulation import C_UM_S

DX, DT, STEPS = .1, .05, 240
TIME = np.arange(1, STEPS+1)*DT
DRIVE = np.exp(-.5*((TIME-3)/.65)**2)*np.sin(2*np.pi*(TIME-3)/1.6)
CONTRACT = dict(dx_um=DX, c_dt_um=DT, steps=STEPS, source_x_um=0, probe_x_um=1,
    left_pec_x_um=-8, candidate_cpml_interface_x_um=3, reference_cpml_interface_x_um=20,
    transverse_cells=[2,2], source='Ez at x=0, all y nodes 0,1,2 and z halfcells 0,1',
    faces=[['pec','pml'],['pmc','pmc'],['pec','pec']], epsilon=1,
    pulse=dict(wavelength_um=1.6, center_ct_um=3, sigma_ct_um=.65),
    depths=[6,12], sigma_scale=.3, reflection_mapping='exp(-20*.3*L/(L+1))',
    incident_window_ct_um=[0,6], reflection_window_ct_um=[6,12],
    thresholds=dict(field_amplitude_ratio=.01, reflected_flux_ratio=.001,
                    independent_1d_max_relative_error=2e-5),
    flux='-Ez*Hy; Hy averaged at neighboring x halfcells, then consecutive magnetic half timesteps')


def run(interface, layers):
    nx=round((interface+8)/DX)+layers
    nodes=[-8+np.arange(nx+1)*DX, np.arange(3)*DX, np.arange(3)*DX]
    source=80; probe=90
    sim=EndpointCPMLSimulation(nodes, CONTRACT['faces'],dt_seconds=DT/C_UM_S,
        sources=[(2,(source,y,z)) for y in range(3) for z in range(2)],
        observations=[('E',2,(probe,1,0)),('H',1,(probe-1,1,0)),('H',1,(probe,1,0))],
        pml_cells=layers, background_epsilon=1.,reflection=math.exp(-20*.3*layers/(layers+1)),
        checkpoints=0,tensor_budget_bytes=64*1024**2)
    epsilon=torch.ones(sim.topology.counts['E']);state=sim._zero();values=[]
    with torch.no_grad():
        for kick in DRIVE:
            state=sim._step(state,epsilon,torch.full((6,),float(kick)))
            values.append([float((state.electric if family=='E' else state.magnetic)[index])
                           for family,index in sim.observation_ids])
    trace=np.asarray(values)
    assert np.isfinite(trace).all()
    return trace,sim.memory_plan(STEPS)


def independent_1d():
    # Independent scalar Yee recurrence with distant PEC ends, no native operators.
    nx=300;e=np.zeros(nx+1);h=np.zeros(nx);trace=[]
    for kick in DRIVE:
        e[1:-1]+=DT/DX*(h[1:]-h[:-1])
        e[80]+=kick
        h+=DT/DX*(e[1:]-e[:-1])
        trace.append([e[90],h[89],h[90]])
    return np.asarray(trace)


def flux(trace):
    space=(trace[:,1]+trace[:,2])/2
    aligned=(space+np.r_[0.,space[:-1]])/2
    return -trace[:,0]*aligned


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir',type=Path,required=True,help='New destination directory, never overwritten.')
    args=parser.parse_args()
    ROOT=args.output_dir.resolve()
    ROOT.mkdir(parents=True,exist_ok=False)
    target=ROOT/'result.json'
    contract=json.dumps(CONTRACT,sort_keys=True,indent=2)+'\n'
    (ROOT/'contract.json').write_text(contract,encoding='utf-8',newline='\n')
    sources=['torchfdtd/pmc_cpml.py','torchfdtd/pmc_simulation.py','torchfdtd/pmc_reference.py',Path(__file__).resolve().relative_to(REPOSITORY).as_posix()]
    hashes={name:hashlib.sha256((REPOSITORY/name).read_bytes()).hexdigest() for name in sources}
    begin=time.perf_counter()
    reference,plan=run(20,12)
    independent=independent_1d()
    oracle_error=float(np.max(abs(reference-independent))/np.max(abs(independent)))
    incident=TIME<6; returned=TIME>=6
    peak=float(np.max(abs(reference[incident,0])))
    incident_flux=float(np.sum(flux(reference)[incident])*DT)
    independent_flux=float(np.sum(flux(independent)[incident])*DT)
    rows=[];arrays={'time_ct_um':TIME,'drive':DRIVE,'reference':reference,'independent_1d':independent}
    for layers in (6,12):
        trace,memory=run(3,layers);residual=trace-reference
        ratio=float(np.max(abs(residual[returned,0]))/peak)
        signed=float(np.sum(flux(residual)[returned])*DT)
        power=abs(signed)/incident_flux
        sign_ok=signed<=0 if ratio>1e-5 else True
        rows.append(dict(layers=layers,field_amplitude_ratio=ratio,
            reflected_signed_flux_integral=signed,reflected_flux_ratio=power,
            backwards_flux_sign_pass=sign_ok,passed=ratio<=.01 and power<=.001 and sign_ok,
            tensor_plan_bytes=memory['tensor_upper_bound_bytes']))
        arrays['depth'+str(layers)]=trace
    record=dict(contract=CONTRACT,contract_sha256=hashlib.sha256(contract.encode()).hexdigest(),
        revision=subprocess.check_output(['git','-C',str(REPOSITORY),'rev-parse','HEAD'],text=True).strip(),
        source_sha256=hashes,post_run_hashes_match=all(hashlib.sha256((REPOSITORY/k).read_bytes()).hexdigest()==v for k,v in hashes.items()),
        api='direct EndpointCPMLSimulation; native translated coefficients, not native Project dispatch',
        backend='CPU FP32 sparse endpoint reference',torch_version=torch.__version__,
        independent_1d_relative_error=oracle_error,incident_flux_integral=incident_flux,
        independent_incident_flux_integral=independent_flux,reference_tensor_plan_bytes=plan['tensor_upper_bound_bytes'],
        cases=rows,seconds=time.perf_counter()-begin,
        passed=oracle_error<=2e-5 and incident_flux>0 and all(row['passed'] for row in rows),
        scope='Normal incidence, one polarization, homogeneous background; no general absorption or performance claim.')
    np.savez_compressed(ROOT/'traces.npz',**arrays)
    target.write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8',newline='\n')
    print(json.dumps(record,indent=2))
    if not record['passed']:raise SystemExit(1)


if __name__=='__main__':main()
