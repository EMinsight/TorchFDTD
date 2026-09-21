"""Native fixed open-fiber two-port S matrix and complex objective VJP."""
import argparse
import hashlib
import json
from pathlib import Path
import time
import numpy as np
import torch
from torchfdtd import AdjointOptions
from torchfdtd.open_mode_injection import OpenPortOptions
from torchfdtd.mode_network import ModeNetwork, FixedModePort
from benchmarks.open_mode_injection import make_case, fiber


def run(device='cuda'):
    started=time.perf_counter()
    p=make_case()
    ports=(FixedModePort('left',-1.,-2.,1),FixedModePort('right',1.,2.,-1))
    network=ModeNetwork(p,ports,fiber,AdjointOptions(checkpoints=8),num_modes=1,
        open_ports=OpenPortOptions(1.))
    base=network.reference_epsilon(device=device)
    with torch.no_grad():
        straight=network(base).s
    expected=np.exp(2j*network._launches[0].mode.beta_per_um)
    phase_error=float(abs(complex(straight[1,0])-expected))
    mask=torch.zeros_like(base)
    mask[38:42,17:23,17:23]=1
    parameter=torch.tensor(.3,device=device,requires_grad=True)
    material=(base+parameter*mask).detach().requires_grad_(True)
    result=network(material)
    score=result.s[1,0].real+.3*result.s[0,1].imag
    material_gradient,=torch.autograd.grad(score,material)
    derivative=(material_gradient*mask).sum()
    fixed_max=[float(material_gradient[:32].abs().max()),float(material_gradient[49:].abs().max())]
    for axis,lo,hi in network._launches[0].fixed_transverse_slices:
        slab=[slice(None)]*3;slab[axis]=slice(lo,hi)
        fixed_max.append(float(material_gradient[tuple(slab)].abs().max()))
    differences=[]
    for h in (.008,.004):
        with torch.no_grad():
            high=network(base+(parameter+h)*mask).s
            low=network(base+(parameter-h)*mask).s
            finite=((high[1,0].real+.3*high[0,1].imag)-(low[1,0].real+.3*low[0,1].imag))/(2*h)
        differences.append(dict(step=h,finite_difference=float(finite),
            relative_error=float(abs((derivative.cpu()-finite)/finite))))
    def pairs(matrix):
        return [[[float(z.real),float(z.imag)] for z in row] for row in matrix.detach().tolist()]
    row=dict(device=device,hardware=torch.cuda.get_device_name() if device=='cuda' else 'CPU',
        precision='float32',grid=list(p.region.shape),steps=p.region.steps,
        scope='Two opposing fixed bound-mode ports and interior scalar dielectric VJP. No eigenmode derivative or general routing.',
        straight_s=pairs(straight),straight_complex_error=phase_error,
        perturbed_s=pairs(result.s),reciprocity_error=float((result.s-result.s.T).abs().max().detach()),
        guided_power_sums=result.s.detach().abs().square().sum(0).tolist(),
        objective=float(score.detach()),gradient=float(derivative),finite_differences=differences,
        fixed_gradient_max=max(fixed_max),elapsed_seconds=time.perf_counter()-started)
    row['accepted']=(row['straight_complex_error']<.01 and row['reciprocity_error']<1e-3
        and max(x['relative_error'] for x in differences)<1e-3 and row['fixed_gradient_max']==0)
    return row


def run_four_channels(device='cuda'):
    p=make_case()
    ports=(FixedModePort('left',-1.,-2.,1,(0,1)),FixedModePort('right',1.,2.,-1,(0,1)))
    network=ModeNetwork(p,ports,fiber,AdjointOptions(checkpoints=8),num_modes=2,
        open_ports=OpenPortOptions(1.))
    with torch.no_grad():
        result=network(network.reference_epsilon(device=device))
    expected=torch.zeros_like(result.s)
    for index in range(2):
        phase=np.exp(2j*network._launches[index].mode.beta_per_um)
        expected[2+index,index]=phase
        expected[index,2+index]=phase
    error=float((result.s-expected).abs().max())
    return dict(device=device,hardware=torch.cuda.get_device_name() if device=='cuda' else 'CPU',
        scope='Actual four-channel straight confined fiber. Fixed degenerate polarization basis, no mode derivative.',
        complex_error=error,reciprocity_error=float((result.s-result.s.T).abs().max()),
        column_power_defect=float((result.s.abs().square().sum(0)-1).abs().max()),
        s=[[[float(z.real),float(z.imag)] for z in row] for row in result.s.tolist()],
        beta_per_um=[[x.mode.beta_per_um.real,x.mode.beta_per_um.imag] for x in network._launches[:2]],
        accepted=error<.01 and float((result.s-result.s.T).abs().max())<1e-3
                 and float((result.s.abs().square().sum(0)-1).abs().max())<.005)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    parser.add_argument('--device',default='cuda')
    parser.add_argument('--four-channel',action='store_true')
    args=parser.parse_args()
    torch.set_num_threads(1)
    if args.device=='cuda':
        from torchfdtd.cuda_bootstrap import prepare_cuda_kernels
        prepare_cuda_kernels()
    root=Path(__file__).resolve().parents[1]
    paths=('torchfdtd/open_mode_ports.py','torchfdtd/open_mode_operators.py',
        'torchfdtd/open_mode_injection.py','torchfdtd/mode_injection.py',
        'torchfdtd/mode_network.py','torchfdtd/mode_ports.py',
        'benchmarks/open_mode_injection.py','benchmarks/open_mode_network.py')
    hashes={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in paths}
    row=run_four_channels(args.device) if args.four_channel else run(args.device)
    row['source_sha256_before']=hashes
    row['source_sha256_after']={name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in paths}
    Path(args.output).write_text(json.dumps(row,indent=2,allow_nan=False)+'\n',encoding='utf8')
    print(json.dumps(row,indent=2),flush=True)
    if not row['accepted']:
        raise SystemExit('Open modal network did not pass the predeclared gates.')


if __name__=='__main__':
    main()
