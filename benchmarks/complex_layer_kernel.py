"""Matched selected-layer forward timings for Torch and fused complex updates."""
import argparse
import hashlib
import json
import statistics
import time
from pathlib import Path
import numpy as np
import torch
from photonweave import periodic_layer_response


def main():
    ap=argparse.ArgumentParser()
    for name in ('spec','density','output'):ap.add_argument('--'+name,required=True)
    ap.add_argument('--steps',type=int,default=1600)
    ap.add_argument('--mesh',type=float,default=.05)
    ap.add_argument('--repeats',type=int,default=3)
    args=ap.parse_args()
    if args.repeats<2:raise ValueError('Use at least two alternating measurements.')
    spec=json.loads(Path(args.spec).read_text())
    digest=hashlib.sha256(Path(args.density).read_bytes()).hexdigest()
    if digest!=spec['density_sha256']:raise ValueError('Density hash mismatch.')
    seed=torch.tensor(np.load(args.density,allow_pickle=False),device='cuda',dtype=torch.float64)
    density=.01+.98*seed
    records={k:[] for k in ('torch','fused')};responses={};peaks={k:[] for k in records}
    with torch.no_grad():
        for repetition in range(-1,args.repeats):
            for kernel in (('torch','fused') if repetition%2 else ('fused','torch')):
                torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats();start=time.perf_counter()
                value=periodic_layer_response(density,spec,mesh=args.mesh,steps=args.steps,forward_kernel=kernel)
                torch.cuda.synchronize();elapsed=time.perf_counter()-start
                responses[kernel]=value.cpu()
                if repetition>=0:
                    records[kernel].append(elapsed);peaks[kernel].append(torch.cuda.max_memory_allocated())
                print(json.dumps(dict(repetition=repetition,kernel=kernel,seconds=elapsed)),flush=True)
    torch.testing.assert_close(responses['fused'],responses['torch'],rtol=1e-10,atol=1e-12)
    medians={k:statistics.median(v) for k,v in records.items()}
    record=dict(hardware=torch.cuda.get_device_name(),density_sha256=digest,
        spec_sha256=hashlib.sha256(Path(args.spec).read_bytes()).hexdigest(),mesh_um=args.mesh,steps=args.steps,
        precision='float64',relaxation='0.01 + 0.98 * seed',seconds=records,median_seconds=medians,
        peak_cuda_allocated_bytes=peaks,speedup=medians['torch']/medians['fused'],
        response_max_absolute_difference=float((responses['fused']-responses['torch']).abs().max()),
        responses={k:v.tolist() for k,v in responses.items()},
        scope='One selected CR ray/wavelength, complete forward API including two reference and two sample solves, preparation and reduction. One warmup per path excluded. No backward, full-pupil, competitor or equal-accuracy claim.')
    p=Path(args.output);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(record,indent=2)+'\n')
    print(json.dumps(record),flush=True)


if __name__=='__main__':main()
