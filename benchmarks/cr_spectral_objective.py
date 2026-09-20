"""Explicit-input spectral/pupil FDTD objective evaluation, not an optimizer."""
import argparse
import functools
import hashlib
import json
import math
import time
from pathlib import Path
import numpy as np
import torch
from photonweave import (periodic_layer_response,spectral_pupil_response,
    spectral_electron_model,exposure_target_information,PlaneReferenceCache,AdjointOptions)
from benchmarks.cr_resume import (CaseJournal, load_gradient_record, runtime_identity,
                                  source_hashes, write_json)


def information_objective(response, context):
    """Shared fixed-calibration CR objective for evaluation and optimization."""
    c = context
    model = spectral_electron_model(response,c['wavelengths_nm'],c['sampled_qe'],c['source_spectrum'],
        c['scene_spectral_basis'],calibration=c['electron_calibration'])
    # Imported calibration matrices follow the response precision and device.
    # Tensor.to returns the same tensor when already matched. No promotion occurs.
    moments = [c[key].to(response) for key in ('scene_covariance',
        'scene_target_cross_covariance_xyz', 'target_covariance_xyz')]
    return exposure_target_information(model,*moments,
        exposure_scales=[e/c['reference_weighted_cfa_green_e'] for e in c['exposure_weighted_cfa_green_e']],
        probabilities=c['exposure_probabilities'],read_noise_e_rms=c['read_noise_e_rms'],raw_pixels=4)


def execution_settings(args):
    """Prepare explicit hierarchy policies without allocating design fields."""
    if args.execution_policy == 'legacy':return None
    from photonweave import AdjointExecutionPolicy, AdjointBatchOptions, StreamedAdjointOptions
    if any(not math.isfinite(v) or v <= 0 for v in (args.gpu_budget_gib,args.host_budget_gib)):
        raise ValueError('Execution memory budgets must be finite and positive.')
    gpu,host=int(args.gpu_budget_gib*1024**3),int(args.host_budget_gib*1024**3)
    disk=None
    if args.execution_policy=='resident':
        policy=AdjointExecutionPolicy(device='cuda',host_budget_bytes=host,
            resident=AdjointOptions(checkpoints=4,backward_kernel=args.backward_kernel,
                gpu_budget_bytes=gpu,host_budget_bytes=host,resident_budget_bytes=gpu))
    else:
        if args.backward_kernel=='torch':
            raise ValueError('Streamed CUDA execution uses fused backward, not backward-kernel=torch.')
        extra={}
        if args.execution_policy=='file':
            if not args.state_directory or args.disk_budget_gib is None or not math.isfinite(args.disk_budget_gib) or args.disk_budget_gib<=0:
                raise ValueError('File execution requires an explicit directory and positive disk budget.')
            disk=int(args.disk_budget_gib*1024**3)
            extra=dict(state_storage='disk',state_directory=args.state_directory,
                disk_budget_bytes=disk,disk_free_reserve_bytes=100*1024**3)
        policy=AdjointExecutionPolicy(device='cuda',host_budget_bytes=host,
            streamed=StreamedAdjointOptions(device='cuda',checkpoints=4,
                slab_width=args.slab_width,temporal_depth=args.temporal_depth,
                gpu_budget_bytes=gpu,host_budget_bytes=host,tile_transfers='async',**extra))
    return dict(policy=policy,batch_options=AdjointBatchOptions(host_budget_bytes=host,
        gpu_budget_bytes=gpu,disk_budget_bytes=disk,replay_rtol=1e-9,replay_atol=0.))


def check_density_direction(objective, density, gradient, steps, *, seed=1729,
                            rtol=1e-3, atol=1e-8):
    """Full-objective central differences along a reproducible fixed direction.

    Perturb the relaxed density directly, without clipping or renormalizing.
    This checks a discrete VJP, not mesh convergence or every gradient entry.
    """
    steps=sorted(set(float(h) for h in steps),reverse=True)
    if not steps or any(not math.isfinite(h) or h<=0 for h in steps):
        raise ValueError('Directional steps must be finite and positive.')
    if any(not math.isfinite(v) or v<0 for v in (rtol,atol)):
        raise ValueError('Directional tolerances must be finite and nonnegative.')
    x=density.detach();g=gradient.detach()
    if x.shape!=g.shape or not bool(torch.isfinite(x).all() & torch.isfinite(g).all()):
        raise ValueError('Finite matching density and gradient are required.')
    generator=torch.Generator(device='cpu').manual_seed(seed)
    direction=(2*torch.randint(0,2,x.shape,generator=generator)-1).to(x)
    if bool(((x-steps[0]*direction)<0).any() | ((x-steps[0]*direction)>1).any()
            | ((x+steps[0]*direction)<0).any() | ((x+steps[0]*direction)>1).any()):
        raise ValueError('Directional perturbation exceeds the density interval [0, 1].')
    derivative=float((g*direction).sum())
    rows=[]
    with torch.no_grad():
        baseline=float(objective(x))
        for h in steps:
            plus=float(objective(x+h*direction));minus=float(objective(x-h*direction))
            if not all(math.isfinite(v) for v in (baseline,plus,minus,derivative)):
                raise ValueError('Non-finite directional objective or derivative.')
            central=(plus-minus)/(2*h);error=abs(central-derivative)
            rows.append(dict(step=h,plus=plus,minus=minus,central_difference=central,
                absolute_error=error,relative_error=error/max(abs(central),abs(derivative),1e-300),
                first_order_residual=max(abs(plus-baseline-h*derivative),abs(minus-baseline+h*derivative)),
                passed=error<=atol+rtol*max(abs(central),abs(derivative))))
    return dict(stage='completed',seed=seed,direction='CPU seeded Rademacher, components +/-1',
        density_shape=list(x.shape),baseline=baseline,adjoint_directional_derivative=derivative,
        rtol=rtol,atol=atol,rows=rows,passed=rows[-1]['passed'],
        criterion='Smallest supplied step passes. Inspect the sweep for cancellation and Taylor behavior. One direction does not establish physical gradient convergence.')


def main():
    ap=argparse.ArgumentParser()
    for name in ('schedule','density','context','output'):ap.add_argument('--'+name,required=True)
    ap.add_argument('--mesh',type=float,required=True)
    ap.add_argument('--steps',type=int,required=True)
    ap.add_argument('--pml-cells',type=int,default=12)
    ap.add_argument('--pixel-origin',choices=['cell_edges','sample_centers'],default='cell_edges')
    ap.add_argument('--forward-only',action='store_true')
    ap.add_argument('--forward-kernel',choices=['torch','fused'],default='torch')
    ap.add_argument('--reference-cache-mib',type=int,default=0)
    ap.add_argument('--backward-kernel',choices=['auto','torch','fused'],default='auto')
    ap.add_argument('--precision',choices=['float32','float64'],default='float32',
        help='One precision for density, optical fields, information and gradients. FP64 is optional validation.')
    ap.add_argument('--execution-policy',choices=['legacy','resident','dram','file'],default='legacy')
    ap.add_argument('--gpu-budget-gib',type=float,default=32.)
    ap.add_argument('--host-budget-gib',type=float,default=64.)
    ap.add_argument('--slab-width',type=int,default=32)
    ap.add_argument('--temporal-depth',type=int,default=8)
    ap.add_argument('--state-directory')
    ap.add_argument('--disk-budget-gib',type=float)
    ap.add_argument('--cpu-threads',type=int,help='Explicit host Torch threads, recorded in the restart contract')
    ap.add_argument('--directional-steps',type=float,nargs='+',
        help='Optional full-schedule finite differences after gradient evaluation, e.g. 0.002 0.001 0.0005')
    ap.add_argument('--directional-seed',type=int,default=1729)
    ap.add_argument('--resume',action='store_true',
        help='Reuse completed forward cases and a saved gradient only with an identical restart contract.')
    args=ap.parse_args()
    if args.cpu_threads is not None:
        if args.cpu_threads<1:ap.error('--cpu-threads must be positive')
        torch.set_num_threads(args.cpu_threads)
    execution=execution_settings(args)
    dtype=getattr(torch,args.precision)
    if args.forward_only and args.directional_steps:
        ap.error('--directional-steps requires a gradient run')
    if args.directional_steps and any(not math.isfinite(h) or not 0<h<.01 for h in args.directional_steps):
        ap.error('--directional-steps must be positive and below 0.01 for the locked relaxed seed')
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
    seed=torch.tensor(np.load(args.density,allow_pickle=False),device='cpu' if execution else 'cuda',dtype=dtype)
    if not bool(((seed==0)|(seed==1)).all()):raise ValueError('Expected a binary locked seed.')
    density=(.01+.98*seed).requires_grad_(not args.forward_only)
    output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
    contract=dict(input_sha256=hashes,source_sha256=source_hashes(),runtime=runtime_identity(),
        mesh_um=args.mesh,steps=args.steps,pml_cells=args.pml_cells,pixel_origin=args.pixel_origin,
        forward_kernel=args.forward_kernel,backward_kernel=args.backward_kernel,
        precision=args.precision,
        reference_cache_mib=args.reference_cache_mib,forward_only=args.forward_only,
        relaxation='0.01 + 0.98 * binary seed',dtype=str(density.dtype),shape=list(density.shape))
    if execution:
        from dataclasses import asdict
        contract['execution']={key:asdict(value) for key,value in execution.items()}
    if args.cpu_threads is not None:contract['cpu_threads']=torch.get_num_threads()
    if output.exists() and not args.resume:
        raise FileExistsError('Output already exists. Use --resume or a new output.')
    journal=CaseJournal(output.with_suffix('.cases.json'),contract,resume=args.resume)
    cache=PlaneReferenceCache(args.reference_cache_mib*1024**2) if args.reference_cache_mib or execution else None
    execution_preflight=None
    if execution:
        from photonweave import PeriodicLayerResponse
        preflight_started=time.perf_counter()
        maxima=dict(host_reservation_bytes=0,gpu_reservation_bytes=0,disk_reservation_bytes=0)
        for row in rows:
            for spec in row:
                candidate=PeriodicLayerResponse(spec,density_shape=tuple(density.shape),dtype=dtype,
                    mesh=args.mesh,steps=args.steps,pml_cells=args.pml_cells,pixel_origin=args.pixel_origin,
                    reference_cache=cache,forward_kernel=args.forward_kernel,**execution)
                planned=candidate.plan()
                for key in maxima:maxima[key]=max(maxima[key],planned[key])
                del candidate
        execution_preflight=dict(cases=len(rows)*len(weights),maxima=maxima,
            seconds=time.perf_counter()-preflight_started,
            scope='All case metadata admitted before any fields. Sequential cases, not simultaneous reservations.')
        write_json(output.with_suffix('.plan.json'),dict(stage='admitted_not_executed',
            restart_contract=contract,execution_preflight=execution_preflight))
    def evaluate(d,spec,index):
        previous_hits=journal.hits
        def compute():
            settings=dict(mesh=args.mesh,steps=args.steps,pml_cells=args.pml_cells,
                pixel_origin=args.pixel_origin,reference_cache=cache,forward_kernel=args.forward_kernel)
            if execution:
                from photonweave import PeriodicLayerResponse
                response=PeriodicLayerResponse(spec,density_shape=tuple(d.shape),dtype=dtype,**execution,**settings)(d)
            else:
                response=periodic_layer_response(d,spec,**settings,
                    options=AdjointOptions(checkpoints=4,backward_kernel=args.backward_kernel))
            return response
        result=journal.evaluate(d,index,compute)
        print(f'case {index} complete, replay_grad={torch.is_grad_enabled()}, restored={journal.hits>previous_hits}',flush=True)
        return result
    cases=[[functools.partial(evaluate,spec=spec,index=(w,r)) for r,spec in enumerate(row)] for w,row in enumerate(rows)]
    def electron_objective(response):
        return information_objective(response, c)
    torch.cuda.synchronize();torch.cuda.reset_peak_memory_stats();start=time.perf_counter()
    if args.resume and output.exists() and not args.forward_only:
        record,gradient=load_gradient_record(output,contract,density)
        print('Restored completed gradient. Continuing directional probes.',flush=True)
    else:
        response=spectral_pupil_response(cases,density,weights,replay_rtol=1e-10,replay_atol=1e-30)
        result=electron_objective(response)
        # Preserve the full optical response before the longer replay/VJP stage.
        # This snapshot is explicitly incomplete for a requested gradient run.
        torch.cuda.synchronize()
        output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
        snapshot=output.with_suffix('.forward.json')
        partial_record=dict(restart_contract=contract,resumed=args.resume,restored_cases=journal.hits,
            timing_scope='Current invocation, including case journal I/O. Resumed timing excludes previous work.',
            stage='forward_complete_gradient_not_computed',input_sha256=hashes,
            hardware=torch.cuda.get_device_name(),mesh_um=args.mesh,steps=args.steps,pml_cells=args.pml_cells,
            pixel_origin=args.pixel_origin,forward_kernel=args.forward_kernel,
            precision=args.precision,
            relaxation='0.01 + 0.98 * binary seed',wavelength_count=len(rows),ray_count=len(weights),
            ray_weight_sum=sum(weights),response=response.detach().tolist(),
            weighted_bits_per_pixel=float(result.weighted_bits_per_pixel.detach()),
            bits_per_pixel=result.bits_per_pixel.detach().tolist(),elapsed_seconds=time.perf_counter()-start,
            peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated())
        write_json(snapshot,partial_record)
        print('Full forward objective saved to '+str(snapshot),flush=True)
        gradient=None
        if not args.forward_only:gradient,=torch.autograd.grad(result.weighted_bits_per_pixel,density)
        torch.cuda.synchronize()
        gradient_artifact=None
        if gradient is not None:
            if not bool(torch.isfinite(gradient).all()):
                raise RuntimeError('Non-finite density gradient. Forward snapshot is incomplete.')
            gradient_path=output.with_suffix('.gradient.npy')
            temporary=gradient_path.with_suffix('.npy.tmp')
            with temporary.open('wb') as stream:
                np.save(stream,gradient.detach().cpu().numpy(),allow_pickle=False)
            temporary.replace(gradient_path)
            gradient_artifact=dict(file=gradient_path.name,shape=list(gradient.shape),
                dtype=str(gradient.dtype),sha256=hashlib.sha256(gradient_path.read_bytes()).hexdigest(),
                variable='relaxed density',objective='weighted_bits_per_pixel',
                sign='positive gradient increases the information objective locally')
        record=dict(restart_contract=contract,resumed=args.resume,restored_cases=journal.hits,
            timing_scope='Current invocation through gradient, including case journal I/O. Resumed timing excludes previous work.',
            input_sha256=hashes,hardware=torch.cuda.get_device_name(),mesh_um=args.mesh,steps=args.steps,
            pml_cells=args.pml_cells,pixel_origin=args.pixel_origin,forward_kernel=args.forward_kernel,backward_kernel=args.backward_kernel,relaxation='0.01 + 0.98 * binary seed',
            precision=args.precision,
            wavelength_count=len(rows),ray_count=len(weights),ray_weight_sum=sum(weights),response=response.detach().tolist(),
            weighted_bits_per_pixel=float(result.weighted_bits_per_pixel.detach()),bits_per_pixel=result.bits_per_pixel.detach().tolist(),
            gradient_l2=None if gradient is None else float(gradient.norm()),elapsed_seconds=time.perf_counter()-start,
            gradient_artifact=gradient_artifact,
            directional_check=None if not args.directional_steps else dict(stage='pending',steps=args.directional_steps,seed=args.directional_seed),
            peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),
            reference_cache=None if cache is None else dict(budget_bytes=cache.budget_bytes,tensor_bytes=cache.tensor_bytes,hits=cache.hits,misses=cache.misses,evictions=cache.evictions),
            scope='Full supplied spectral/pupil schedule and supplied development electron context. No optimization, optical convergence or competitor speed claim.')
        output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True)
        write_json(output,record)
    if args.directional_steps:
        # Persist the expensive gradient before running additional forward probes.
        def objective(d):
            probe_response=spectral_pupil_response(cases,d,weights,replay_rtol=1e-10,replay_atol=1e-30)
            return electron_objective(probe_response).weighted_bits_per_pixel
        check_started=time.perf_counter()
        try:
            check=check_density_direction(objective,density,gradient,args.directional_steps,seed=args.directional_seed)
        except Exception as exc:
            record['directional_check']=dict(stage='failed',error=repr(exc),steps=args.directional_steps,
                seed=args.directional_seed,elapsed_seconds=time.perf_counter()-check_started)
            write_json(output,record)
            raise
        torch.cuda.synchronize()
        check['elapsed_seconds']=time.perf_counter()-check_started
        record['directional_check']=check
        write_json(output,record)
        if not check['passed']:raise RuntimeError('Full objective directional derivative check failed. See saved result.')
    record['restart_session']=dict(resumed=args.resume,elapsed_seconds=time.perf_counter()-start,
        restored_cases=journal.hits,computed_cases=journal.computed,
        peak_cuda_allocated_bytes=torch.cuda.max_memory_allocated(),
        timing_scope='This invocation only. A resumed run is not a fresh wall-clock benchmark.')
    if execution_preflight is not None:record['execution_preflight']=execution_preflight
    write_json(output,record)
    print(json.dumps(record),flush=True)
    journal.close()


if __name__=='__main__':main()
