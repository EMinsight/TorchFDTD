"""Observation-only timing with repeated, interleaved complex E/H samples."""
import argparse,json,statistics,time
from pathlib import Path
import torch
from photonweave import Project,Region,BoundaryFace,Boundaries
from photonweave.differentiable import _System


def main():
    ap=argparse.ArgumentParser();ap.add_argument('--output',required=True);args=ap.parse_args()
    p=Project(region=Region(dimension='3d',size=(1.6,1.6,1.6),mesh=.1,pml_cells=3,steps=10,
        precision='float64',boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'),x_max=BoundaryFace(kind='bloch')),bloch_phase=(.3,0,0)))
    observations=[(('E' if i%2==0 else 'H')+'xyz'[i%3],((i*3)%16,(i*5)%16,(i*7)%16),i%3) for i in range(10000)]
    system=_System(p,torch.ones(p.region.shape,device='cuda',dtype=torch.float64),observation_monitors=observations)
    state=tuple(torch.randn_like(v) for v in system.state())
    def scalar():return torch.stack([state[0 if name[0]=='E' else 1][loc+(component,)] for name,loc,component in observations])
    def batched():return system.observe(state)
    torch.testing.assert_close(scalar(),batched(),rtol=0,atol=0)
    rows={'scalar':[],'batched':[]}
    for fn in (scalar,batched):fn()
    for repeat in range(5):
        for name,fn in ([('scalar',scalar),('batched',batched)] if repeat%2==0 else [('batched',batched),('scalar',scalar)]):
            torch.cuda.synchronize();start=time.perf_counter();fn();torch.cuda.synchronize();rows[name].append(time.perf_counter()-start)
    data=dict(hardware=torch.cuda.get_device_name(),observations=len(observations),seconds=rows,
        medians={k:statistics.median(v) for k,v in rows.items()},scope='Observation gather only. Includes duplicate mixed E/H complex samples. Not a whole-solver speedup.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(data,indent=2)+'\n');print(json.dumps(data))


if __name__=='__main__':main()
