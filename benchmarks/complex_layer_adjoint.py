"""Matched full selected-layer objective/VJP timings for complex backward paths."""
import argparse
import hashlib
import json
import statistics
import time
from pathlib import Path
import numpy as np
import torch
from torchfdtd import periodic_layer_response,AdjointOptions


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
    density=(.01+.98*torch.tensor(np.load(args.density,allow_pickle=False),device='cuda',dtype=torch.float64)).requires_grad_()
    weights=density.new_tensor([.1,.3,-.2,.7])
    def evaluate(kernel):
        response=periodic_layer_response(density,spec,mesh=args.mesh,steps=args.steps,forward_kernel='fused',
            options=AdjointOptions(checkpoints=4,backward_kernel=kernel)).mean(0)
        objective=(response*weights).sum()+.2*response.square().sum()
        gradient,=torch.autograd.grad(objective,density)
        return float(objective.detach()),gradient.cpu()
    records={k:[] for k in ('torch','fused')};peaks={k:[] for k in records};baselines={k:[] for k in records};values={}
    max_error=0.
    for repetition in range(-1,args.repeats):
        for kernel in (('torch','fused') if repetition%2 else ('fused','torch')):
            torch.cuda.synchronize();baseline=torch.cuda.memory_allocated();torch.cuda.reset_peak_memory_stats();start=time.perf_counter()
            values[kernel]=evaluate(kernel)
            torch.cuda.synchronize();elapsed=time.perf_counter()-start
            if repetition>=0:
                records[kernel].append(elapsed);peaks[kernel].append(torch.cuda.max_memory_allocated());baselines[kernel].append(baseline)
            if len(values)==2:
                a,b=values['torch'],values['fused']
                assert abs(a[0]-b[0])<1e-12
                torch.testing.assert_close(a[1],b[1],rtol=1e-9,atol=1e-12)
                max_error=max(max_error,float((a[1]-b[1]).abs().max()))
            print(json.dumps(dict(repetition=repetition,backward=kernel,seconds=elapsed)),flush=True)
    medians={k:statistics.median(v) for k,v in records.items()}
    x=(torch.arange(density.shape[0],dtype=torch.float64)+.5)/density.shape[0]
    y=(torch.arange(density.shape[1],dtype=torch.float64)+.5)/density.shape[1]
    direction=torch.cos(2*torch.pi*x[:,None])*torch.sin(4*torch.pi*y[None,:])
    record=dict(hardware=torch.cuda.get_device_name(),density_sha256=digest,
        spec_sha256=hashlib.sha256(Path(args.spec).read_bytes()).hexdigest(),mesh_um=args.mesh,steps=args.steps,
        precision='float64',forward_kernel='fused',checkpoints=4,relaxation='0.01 + 0.98 * seed',
        seconds=records,median_seconds=medians,peak_cuda_allocated_bytes=peaks,baseline_cuda_allocated_bytes=baselines,
        speedup=medians['torch']/medians['fused'],gradient_max_absolute_difference=max_error,
        objective=values['fused'][0],directional_derivative=float((values['fused'][1]*direction).sum()),
        scope='One selected CR ray/wavelength, complete objective and density VJP including homogeneous references. Fused forward for both paths. No reference cache. One warmup per path excluded. No full-pupil, competitor or physical-convergence claim.')
    p=Path(args.output);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(record,indent=2)+'\n')
    print(json.dumps(record),flush=True)


if __name__=='__main__':main()
