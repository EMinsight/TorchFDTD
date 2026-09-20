"""Explicit-input spectral/pupil FDTD objective evaluation, not an optimizer."""
import argparse
import functools
import hashlib
import json
import time
from pathlib import Path
import numpy as np
import torch
from photonweave import (periodic_layer_response,spectral_pupil_response,
    spectral_electron_model,exposure_target_information,PlaneReferenceCache)


def main():
    ap=argparse.ArgumentParser()
    for name in ('schedule','density','context','output'):ap.add_argument('--'+name,required=True)
    ap.add_argument('--mesh',type=float,required=True)
    ap.add_argument('--steps',type=int,required=True)
    ap.add_argument('--pml-cells',type=int,default=12)
    ap.add_argument('--pixel-origin',choices=['cell_edges','sample_centers'],default='cell_edges')
    ap.add_argument('--forward-only',action='store_true')
    ap.add_argument('--reference-cache-mib',type=int,default=0)
    args=ap.parse_args()
    schedule=json.loads(Path(args.schedule).read_text())
    hashes={k:hashlib.sha256(Path(getattr(args,k)).read_bytes()).hexdigest() for k in ('schedule','density','context')}
    if hashes['density']!=schedule['density_sha256']:raise ValueError('Density hash mismatch.')
    c=torch.load(args.context,weights_only=True,map_location='cpu')['context']
    wavelengths=torch.as_tensor(c['wavelengths_nm'],dtype=torch.float64)
    if not torch.equal(wavelengths,torch.tensor(schedule['wavelengths_nm'],dtype=torch.float64)):
        raise ValueError('Optical schedule and electron context wavelength grids differ.')
    rows=schedule['cases'];weights=schedule['ray_weights']
    if len(rows)!=len(wavelengths) or any(len(row)!=len(weights) for row in rows):
        raise ValueError('Incomplete wavelength/ray schedule.')
    for w,row in zip(wavelengths,rows):
        if any(abs(spec['wavelength_um']*1000-float(w))>1e-10 for spec in row):
            raise ValueError('Case wavelength ordering differs from electron context.')
    seed=torch.tensor(np.load(args.density,allow_pickle=False),device='cuda',dtype=torch.float64)
    if not bool(((seed==0)|(seed==1)).all()):raise ValueError('Expected a binary locked seed.')
    density=(.01+.98*seed).requires_grad_(not args.forward_only)
    cache=PlaneReferenceCache(args.reference_cache_mib*1024**2) if args.reference_cache_mib else None
    def evaluate(d,spec,index):
        result=periodic_layer_response(d,spec,mesh=args.mesh,steps=args.steps,
            pml_cells=args.pml_cells,pixel_origin=args.pixel_origin,reference_cache=cache)
        print(f'case {index} complete, replay_grad={torch.is_grad_enabled()}',flush=True)
        return result
    cases=[[functools.partial(evaluate,spec=spec,index=(w,r)) for r,spec in enumerate(row)] for w,row in enumerate(rows)]
    torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats();start=time.perf_counter()
    response=spectral_pupil_response(cases,density,weights,replay_rtol=1e-10,replay_atol=1e-30)
    model=spectral_electron_model(response,c['wavelengths_nm'],c['sampled_qe'],c['source_spectrum'],
        c['scene_spectral_basis'],calibration=c['electron_calibration'])
    result=exposure_target_information(model,c['scene_covariance'],c['scene_target_cross_covariance_xyz'],c['target_covariance_xyz'],
        exposure_scales=[e/c['reference_weighted_cfa_green_e'] for e in c['exposure_weighted_cfa_green_e']],
        probabilities=c['exposure_probabilities'],read_noise_e_rms=c['read_noise_e_rms'],raw_pixels=4)
    gradient=None
    if not args.forward_only:gradient,=torch.autograd.grad(result.weighted_bits_per_pixel,density)
    torch.cuda.synchronize()
    record=dict(input_sha256=hashes,hardware=torch.cuda.get_device_name(),mesh_um=args.mesh,steps=args.steps,
        pml_cells=args.pml_cells,pixel_origin=args.pixel_origin,relaxation='0.01 + 0.98 * binary seed',
        wavelength_count=len(rows),ray_count=len(weights),ray_weight_sum=sum(weights),response=response.detach().tolist(),
        weighted_bits_per_pixel=float(result.weighted_bits_per_pixel.detach()),bits_per_pixel=result.bits_per_pixel.detach().tolist(),
        gradient_l2=None if gradient is None else float(gradient.norm()),elapsed_seconds=time.perf_counter()-start,
        peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),
        reference_cache=None if cache is None else dict(budget_bytes=cache.budget_bytes,tensor_bytes=cache.tensor_bytes,hits=cache.hits,misses=cache.misses,evictions=cache.evictions),
        scope='Full supplied spectral/pupil schedule and supplied development electron context. No optimization, optical convergence or competitor speed claim.')
    output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(record,indent=2)+'\n')
    print(json.dumps(record),flush=True)


if __name__=='__main__':main()
