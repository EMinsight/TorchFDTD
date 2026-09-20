"""Restartable full-schedule density optimization with explicit CR input files.

Projected Adam maximizes the supplied fixed-calibration information objective.
No binarization, manufacturing or converged-optics claim is implicit in a run.
"""
import argparse
from dataclasses import asdict, replace
import functools
import hashlib
import json
import math
from pathlib import Path
import time

import numpy as np
import torch

from photonweave import PeriodicLayerResponse, PlaneReferenceCache, spectral_pupil_response
from benchmarks.cr_optimization import ProjectedAdamRun
from benchmarks.cr_resume import CaseJournal, runtime_identity, source_hashes, tensor_digest, write_json
from benchmarks.cr_spectral_objective import execution_settings, information_objective


def load_inputs(args):
    paths = {key:Path(getattr(args,key)) for key in ('schedule','density','context')}
    hashes = {key:hashlib.sha256(path.read_bytes()).hexdigest() for key,path in paths.items()}
    schedule = json.loads(paths['schedule'].read_text())
    context = torch.load(paths['context'], map_location='cpu', weights_only=True)['context']
    if hashes['density'] != schedule['density_sha256']:
        raise ValueError('Initial density hash does not match the schedule.')
    wavelengths = torch.as_tensor(context['wavelengths_nm'], dtype=torch.float64)
    if not torch.equal(wavelengths, torch.tensor(schedule['wavelengths_nm'], dtype=torch.float64)):
        raise ValueError('Schedule/context wavelength grids differ.')
    rows, weights = schedule['cases'], schedule['ray_weights']
    if len(rows) != len(wavelengths) or not weights or any(len(row) != len(weights) for row in rows):
        raise ValueError('Incomplete wavelength/ray schedule.')
    if any(not math.isfinite(w) or w < 0 for w in weights) or sum(weights) <= 0:
        raise ValueError('Ray weights must be finite, nonnegative and have positive sum.')
    for wavelength, row in zip(wavelengths, rows):
        if any(abs(spec['wavelength_um']*1000-float(wavelength)) > 1e-10 for spec in row):
            raise ValueError('Case wavelengths differ from the electron context.')
    seed = torch.tensor(np.load(paths['density'], allow_pickle=False), dtype=getattr(torch, args.precision))
    if seed.ndim != 2 or not seed.numel() or not bool(((seed == 0) | (seed == 1)).all()):
        raise ValueError('Expected a nonempty binary two-dimensional locked seed.')
    return schedule, context, hashes, .01+.98*seed


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    for key in ('schedule','density','context','output-directory'):
        parser.add_argument('--'+key, required=True)
    parser.add_argument('--mesh', type=float, required=True)
    parser.add_argument('--steps', type=int, required=True)
    parser.add_argument('--iterations', type=int, required=True, help='Total committed optimizer updates, including a resumed run')
    parser.add_argument('--learning-rate', type=float, default=.01)
    parser.add_argument('--pml-cells', type=int, default=12)
    parser.add_argument('--pixel-origin', choices=['cell_edges','sample_centers'], default='cell_edges')
    parser.add_argument('--execution-policy', choices=['resident','dram','file'], default='resident')
    parser.add_argument('--precision', choices=['float32','float64'], default='float32',
        help='One precision for density, optical fields, information and Adam. FP64 is optional validation.')
    parser.add_argument('--gpu-budget-gib', type=float, default=32.)
    parser.add_argument('--host-budget-gib', type=float, default=64.)
    parser.add_argument('--slab-width', type=int, default=32)
    parser.add_argument('--temporal-depth', type=int, default=8)
    parser.add_argument('--state-directory')
    parser.add_argument('--disk-budget-gib', type=float)
    parser.add_argument('--reference-cache-mib', type=int, default=64)
    parser.add_argument('--cpu-threads', type=int, default=4)
    parser.add_argument('--checkpoint-free-reserve-gib', type=float, default=100.)
    parser.add_argument('--resume', action='store_true')
    args = parser.parse_args(argv)
    if args.iterations < 1 or args.cpu_threads < 1 or args.reference_cache_mib < 0:
        parser.error('Positive iterations/threads and nonnegative cache size are required.')
    if not math.isfinite(args.checkpoint_free_reserve_gib) or args.checkpoint_free_reserve_gib < 0:
        parser.error('Checkpoint free-space reserve must be finite and nonnegative.')
    if not torch.cuda.is_available():
        raise ValueError('This explicit-input CR driver requires CUDA.')
    torch.set_num_threads(args.cpu_threads)
    args.forward_kernel = args.backward_kernel = 'fused'
    schedule, context, hashes, initial = load_inputs(args)
    # Validate fixed electron/covariance inputs before any optical execution.
    information_objective(torch.ones((4, len(schedule['cases'])), dtype=initial.dtype), context)
    # Keep optimizer/copy work outside the solver's own shared host reservation.
    # Context and ordinary interpreter/OS overhead are reported separately.
    optimizer_reservation = 16*initial.numel()*initial.element_size() + 1024**2
    execution = execution_settings(args)
    dtype = initial.dtype
    remaining_host = execution['batch_options'].host_budget_bytes-optimizer_reservation
    if remaining_host <= 0:
        raise ValueError('Host budget cannot hold the optimizer reservation.')
    execution['batch_options'] = replace(execution['batch_options'], host_budget_bytes=remaining_host)
    sources = source_hashes()
    for name in ('cr_inverse_design.py','cr_optimization.py'):
        path = Path(__file__).with_name(name)
        sources['benchmarks/'+name] = hashlib.sha256(path.read_bytes()).hexdigest()
    settings = dict(mesh=args.mesh, steps=args.steps, pml_cells=args.pml_cells,
        pixel_origin=args.pixel_origin, forward_kernel='fused')
    contract = dict(input_sha256=hashes, source_sha256=sources, runtime=runtime_identity(),
        settings=settings, execution={key:asdict(value) for key,value in execution.items()},
        cpu_threads=args.cpu_threads, reference_cache_mib=args.reference_cache_mib,
        precision=args.precision,
        optimizer_reservation_bytes=optimizer_reservation,
        checkpoint_free_reserve_bytes=int(args.checkpoint_free_reserve_gib*1024**3),
        density_parameterization='Projected continuous density initialized as 0.01 + 0.98 * binary seed',
        objective='Maximize weighted_bits_per_pixel with fixed supplied electron context',
        scope='Caller context, interpreter/runtime overhead and OS file cache are outside the solver/optimizer reservation.')
    cache = PlaneReferenceCache(args.reference_cache_mib*1024**2)
    def module(spec):
        return PeriodicLayerResponse(spec, density_shape=tuple(initial.shape), dtype=dtype,
            reference_cache=cache, **settings, **execution)
    directory = Path(args.output_directory)
    started = time.perf_counter()
    with ProjectedAdamRun(directory, initial, contract, learning_rate=args.learning_rate,
            resume=args.resume, disk_free_reserve_bytes=contract['checkpoint_free_reserve_bytes']) as run:
        if args.iterations < run.updates:
            raise ValueError('Requested total iterations precede the committed optimizer state.')
        maxima = dict(host_reservation_bytes=0, gpu_reservation_bytes=0, disk_reservation_bytes=0)
        for row in schedule['cases']:
            for spec in row:
                plan = module(spec).plan()
                for key in maxima:
                    maxima[key] = max(maxima[key], plan[key])
        write_json(directory/'plan.json', dict(stage='all_cases_admitted_before_fields',
            contract=run.contract, cases=len(schedule['cases'])*len(schedule['ray_weights']),
            solver_maxima=maxima, optimizer_reservation_bytes=optimizer_reservation,
            total_host_reservation_bytes=maxima['host_reservation_bytes']+optimizer_reservation))

        def progress(stage, error=None):
            write_json(directory/'progress.json', dict(stage=stage, completed_updates=run.committed_updates,
                requested_updates=args.iterations, last_evaluation=run.last_evaluation,
                in_memory_density_sha256=tensor_digest(run.density), error=error,
                note='checkpoint.pt is authoritative. result.json is the last completed export.'))
        progress('running')

        def evaluate(gradient):
            torch.cuda.synchronize()
            torch.cuda.reset_peak_memory_stats()
            case_start = time.perf_counter()
            path = directory/f'cases-{run.updates:06d}.json'
            case_contract = dict(run=run.contract, update=run.updates, density_sha256=tensor_digest(run.density))
            with_gradient = torch.enable_grad() if gradient else torch.no_grad()
            journal = CaseJournal(path, case_contract, resume=path.exists())
            try:
                def case(density, spec, index):
                    value = journal.evaluate(density, index, lambda: module(spec)(density))
                    print(f'update {run.updates} case {index} complete, replay_grad={torch.is_grad_enabled()}', flush=True)
                    return value
                cases = [[functools.partial(case, spec=spec, index=(w,r)) for r,spec in enumerate(row)]
                         for w,row in enumerate(schedule['cases'])]
                with with_gradient:
                    response = spectral_pupil_response(cases, run.density, schedule['ray_weights'],
                        replay_rtol=1e-10, replay_atol=1e-30)
                    result = information_objective(response, context)
                    metadata = dict(response=response.detach().tolist(), bits_per_pixel=result.bits_per_pixel.detach().tolist(),
                        computed_forward_cases=journal.computed, restored_forward_cases=journal.hits)
                    if gradient:
                        row = run.step(result.weighted_bits_per_pixel, metadata)
                    else:
                        row = run.observe(result.weighted_bits_per_pixel, metadata)
                        run.save()
                torch.cuda.synchronize()
                print(json.dumps(dict(update=row['update'], information=row['weighted_bits_per_pixel'],
                    gradient=gradient, seconds=time.perf_counter()-case_start,
                    peak_torch_cuda_bytes=torch.cuda.max_memory_allocated())), flush=True)
            finally:
                journal.close()

        try:
            while run.updates < args.iterations:
                evaluate(True)
                progress('running')
            # Every exported final design receives its own complete forward objective.
            if run.last_evaluation is None or run.last_evaluation['density_sha256'] != tensor_digest(run.density):
                evaluate(False)
        except Exception as exc:
            progress('failed', repr(exc))
            raise
        artifacts = {}
        for name, density in (('latest-density', run.density), ('best-density', run.best['density'])):
            path = directory/(name+'.npy')
            temporary = path.with_suffix('.npy.tmp')
            with temporary.open('wb') as stream:
                np.save(stream, density.detach().numpy(), allow_pickle=False)
            temporary.replace(path)
            artifacts[name] = dict(file=path.name, sha256=hashlib.sha256(path.read_bytes()).hexdigest())
        report = dict(stage='requested_updates_and_final_forward_complete', contract=run.contract,
            completed_updates=run.updates, history=run.history, final=run.last_evaluation,
            best=run.best['record'], artifacts=artifacts,
            checkpoint=dict(file=run.path.name, sha256=hashlib.sha256(run.path.read_bytes()).hexdigest()),
            current_invocation_seconds=time.perf_counter()-started, resumed=args.resume,
            scope=__doc__, convergence='Not established. Final and best densities remain continuous, not manufactured binary designs.')
        write_json(directory/'result.json', report)
        progress('requested_updates_and_final_forward_complete')
        return report


if __name__ == '__main__':
    main()
