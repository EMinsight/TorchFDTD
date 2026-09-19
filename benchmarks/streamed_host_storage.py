"""Measure explicit host initial-state storage, not whole-process RSS."""
import argparse
import json
from pathlib import Path
import time

import torch

from photonweave import Region,Project,Source,Monitor,StreamedAdjointOptions
from photonweave.differentiable import _System
from photonweave.streamed import _reservation


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',required=True)
    args=parser.parse_args()
    region=Region(dimension='3d',size=(25.6,25.6,12.8),mesh=.1,pml_cells=3,
                  steps=10,precision='float32',memory_mode='streamed')
    project=Project(region=region,sources=[Source(pulse='continuous')],monitors=[Monitor()])
    epsilon=torch.full(region.shape,1.7,dtype=torch.float32)
    rows=[]
    for prepared in (True,False):
        start=time.perf_counter()
        host=_System(project,epsilon,prepare_updates=prepared)
        elapsed=time.perf_counter()-start
        state=host.state()
        logical=sum(s.numel()*s.element_size() for s in state)
        storage=sum(s.untyped_storage().nbytes() for s in state)
        inverse=host.grid.inverse_permittivity
        inverse_bytes=0 if inverse is None else inverse.untyped_storage().nbytes()
        rows.append(dict(prepare_updates=prepared,initial_state_logical_bytes=logical,
                         initial_state_storage_bytes=storage,inverse_permittivity_bytes=inverse_bytes,
                         constructor_seconds=elapsed))
        if not prepared:assert storage==len(state)*epsilon.element_size()
        del host,state,inverse
    options=StreamedAdjointOptions(device='cpu',host_budget_bytes=12*1024**3)
    reservation=_reservation(project,epsilon,options)
    result=dict(grid=region.shape,precision='float32',torch_version=torch.__version__,rows=rows,
                eliminated_persistent_tensor_bytes=rows[0]['initial_state_storage_bytes']+rows[0]['inverse_permittivity_bytes']-rows[1]['initial_state_storage_bytes'],
                host_reservation_reduction_bytes=reservation['state_bytes']-reservation['host_initial_state_reservation_bytes'],reservation=reservation,
                scope='Explicit tensor storage for the initial E/H/CPML bank and inverse permittivity only. Excludes epsilon, metadata, sources, later state banks and allocator overhead. Not process RSS, peak process memory or a throughput benchmark. Construction times are single cold observations.')
    path=Path(args.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(result,indent=2),encoding='utf8')
    print(json.dumps(result))


if __name__=='__main__':main()
