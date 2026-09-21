"""Long-run soak of the streamed engine with the restart journal enabled (G5-10).

Three parts on one light 2D fixture, CPU by design:

1. one forward pass of `--steps` steps in blocks with a journal record every
   `--record-every` blocks, sampling process RSS, Torch allocated and reserved
   device bytes and the journal's size at every record, and the discrete
   state norm (sum eps E^2 + sum H^2, the volume-weighted E/H norm of
   torchfdtd.run_control on a uniform mesh) after every block, judged by
   `DecayDecision` with the declared growth limit after the source ends;
2. `--runs` repeated forward-plus-backward runs in one process, each with its
   own journal, sampling the same memory counters after each run;
3. an optimization of `--updates` projected Adam updates through the streamed
   adjoint with a per-iteration journal and a design checkpoint, sampling
   after every update.

Growth is the least-squares slope of each counter after the declared warm-up,
compared with the bound of the pre-declared case; no sample is required to
decrease. The record is written as JSON; `--render` turns a record into
docs/RESTART_SOAK.md.

python -m benchmarks.restart_soak --output docs/validation/g5/G5-10_soak_3060.json
python -m benchmarks.restart_soak --render docs/validation/g5/G5-10_soak_3060.json --markdown docs/RESTART_SOAK.md
"""
import argparse
from dataclasses import replace
import datetime
import gc
import json
import math
import os
import platform
import shutil
import subprocess
import sys
import time
from pathlib import Path

import numpy as np
import psutil
import torch

from torchfdtd import Project, Region, Source, Monitor, RunControl, StreamedSimulation, StreamedAdjointOptions
from torchfdtd import spacetime, streamed_restart
from torchfdtd.design_checkpoint import DesignCheckpoint
from torchfdtd.design_parameterization import DensityParameterization
from torchfdtd.run_control import DecayDecision, source_end_time
from torchfdtd.streamed import _journal_bytes

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CASE = ROOT / 'docs' / 'validation' / 'cases' / 'G5-10_restart_soak.json'


def fixture(steps, precision='float32'):
    """Light 2D domain: 16 x 15 cells, three-cell PML, one Gaussian point source, three point monitors."""
    region = Region(dimension='2d', size=(1.6, 1.5, 1.4), mesh=.1, pml_cells=3, steps=steps, precision=precision,
                    backend='cpu')
    return Project(region=region, sources=[Source(center=(-.2, 0, 0), pulse='gaussian', wavelength=1.1)],
                   monitors=[Monitor(component='Ez', center=(.1, 0, 0)), Monitor(component='Hy', center=(0, .1, 0)),
                             Monitor(component='Ez', center=(.1, 0, 0))])


def options(journal, *, depth, every, checkpoints=4):
    return StreamedAdjointOptions(device='cpu', slab_width=16, temporal_depth=depth, checkpoints=checkpoints,
                                  local_checkpoints=2, restart_directory=None if journal is None else str(journal),
                                  restart_every_blocks=every)


def counters(process):
    gc.collect()
    cuda = torch.cuda.is_available()
    return dict(rss_bytes=process.memory_info().rss,
                torch_allocated_bytes=torch.cuda.memory_allocated() if cuda else 0,
                torch_reserved_bytes=torch.cuda.memory_reserved() if cuda else 0)


def state_norm(epsilon, state):
    """sum eps E^2 + sum H^2 in float64 on the uniform mesh, and the peak field magnitude."""
    e, h = state[0].to(torch.float64), state[1].to(torch.float64)
    eps = epsilon.detach().to(torch.float64)[..., None]
    energy = float((eps*e.square()).sum()+h.square().sum())
    peak = float(torch.maximum(e.abs().amax(), h.abs().amax()))
    return energy, peak


def slope_per(samples, x_key, y_key, scale, after):
    """Least-squares slope of y against x over the samples with x >= after, in units of y per scale of x."""
    points = [(s[x_key], s[y_key]) for s in samples if s[x_key] >= after]
    if len(points) < 3:
        return None
    x = np.array([p[0] for p in points], dtype=np.float64)
    y = np.array([p[1] for p in points], dtype=np.float64)
    slope = float(np.polyfit(x, y, 1)[0])
    return slope*scale


def growth(samples, x_key, after, scale):
    keys = ('rss_bytes', 'torch_allocated_bytes', 'torch_reserved_bytes')
    result = {}
    for key in keys:
        included = [s for s in samples if s[x_key] >= after]
        result[key] = dict(slope_bytes_per_unit=slope_per(samples, x_key, key, scale, after),
                           first_after_warmup=included[0][key] if included else None,
                           last=included[-1][key] if included else None,
                           max_after_warmup=max(s[key] for s in included) if included else None,
                           samples_after_warmup=len(included))
    return result


# ---- part 1: long forward -------------------------------------------------------------
def long_forward(steps, depth, every, growth_limit, warmup_steps, root, process):
    project = fixture(steps)
    dt = project.region.time_step
    source_end = source_end_time(project)
    control = RunControl(divergence_check=True, growth_limit=growth_limit, min_steps=10, auto_shutoff=False, check_interval=depth)
    decision = DecayDecision(control, source_end, dt)
    epsilon = torch.full(project.region.shape, 1.7, dtype=torch.float32)
    journal = root / 'long-forward'
    settings = options(journal, depth=depth, every=every)
    memory, energy = [], []
    started = time.perf_counter()

    original_forward = spacetime.SlabBlockOperator.forward

    def forward(self, eps, state, start, block_depth):
        state, values = original_forward(self, eps, state, start, block_depth)
        step = start+block_depth
        norm, peak = state_norm(eps, state)
        decision.update(step, norm, peak)
        energy.append(dict(step=step, time_s=step*dt, state_norm=norm, field_peak=peak,
                           relative_norm=decision.history[-1]['relative_norm'], source_finished=decision.history[-1]['source_finished']))
        return state, values

    class SamplingJournal(streamed_restart.RestartJournal):
        def record_forward(self, completed_blocks, state, signals):
            super().record_forward(completed_blocks, state, signals)
            memory.append(dict(step=completed_blocks*depth, block=completed_blocks, elapsed_s=time.perf_counter()-started,
                               journal_bytes=_journal_bytes(journal), **counters(process)))

    spacetime.SlabBlockOperator.forward = forward
    streamed_restart.RestartJournal = SamplingJournal
    try:
        result = StreamedSimulation(project, settings)(epsilon)
    finally:
        spacetime.SlabBlockOperator.forward = original_forward
        streamed_restart.RestartJournal = SamplingJournal.__mro__[1]
    elapsed = time.perf_counter()-started
    memory.append(dict(step=steps, block=steps//depth, elapsed_s=elapsed, journal_bytes=_journal_bytes(journal), **counters(process)))
    report = result.report
    finished = [e for e in energy if e['source_finished']]
    frozen = decision.frozen_peak
    post = dict(source_end_s=source_end, source_end_step=math.ceil(source_end/dt), frozen_peak=frozen,
                max_relative_norm_after_source=max(e['relative_norm'] for e in finished) if finished else None,
                max_relative_norm_last_half=max(e['relative_norm'] for e in finished[len(finished)//2:]) if finished else None,
                final_relative_norm=finished[-1]['relative_norm'] if finished else None,
                samples_after_source=len(finished), nonfinite=any(not math.isfinite(e['state_norm']) for e in energy))
    shutil.rmtree(journal)
    return dict(steps=steps, temporal_depth=depth, restart_every_blocks=every, blocks=steps//depth+(steps % depth > 0),
                elapsed_s=elapsed, journal_records_written=report['journal_records_written'], journal_seconds=report['journal_seconds'],
                restart_reservation_bytes=report['restart_reservation_bytes'], host_reservation_bytes=report['host_reservation_bytes'],
                max_journal_bytes=max(s['journal_bytes'] for s in memory), signals_finite=bool(torch.isfinite(result.signals).all()),
                memory_samples=memory, energy_samples=energy[::max(1, len(energy)//200)], energy=post,
                memory_growth=growth(memory, 'step', warmup_steps, 1000.))


# ---- part 2: repeated runs -----------------------------------------------------------------
def repeated_runs(runs, steps, depth, every, root, process, warmup_runs):
    project = fixture(steps)
    epsilon = torch.full(project.region.shape, 1.7, dtype=torch.float32, requires_grad=True)
    samples = [dict(run=0, elapsed_s=0., **counters(process))]
    started = time.perf_counter()
    gradients = []
    for run in range(1, runs+1):
        journal = root / f'run-{run}'
        result = StreamedSimulation(project, options(journal, depth=depth, every=every))(epsilon)
        gradient, = torch.autograd.grad(result.signals.square().sum(), epsilon)
        gradients.append(gradient.detach().clone())
        assert result.report['restart_state'] == 'completed'
        del result, gradient
        shutil.rmtree(journal)
        samples.append(dict(run=run, elapsed_s=time.perf_counter()-started, **counters(process)))
    same = all(torch.equal(g, gradients[0]) for g in gradients[1:])
    return dict(runs=runs, steps=steps, temporal_depth=depth, restart_every_blocks=every, elapsed_s=time.perf_counter()-started, samples=samples,
                gradients_identical=same, memory_growth=growth(samples, 'run', warmup_runs, 1.))


# ---- part 3: optimization -------------------------------------------------------------------
def optimization(updates, steps, depth, every, root, process, warmup_updates):
    project = fixture(steps)
    param = DensityParameterization((16, 15), spacing_um=.1, mode='density', initial=.5, filter_radius_um=.15,
                                    boundary='truncate', beta=1., eta=.5, dtype=torch.float32)
    optimizer = torch.optim.Adam(param.parameters(), lr=.02, foreach=False)
    base = options(None, depth=depth, every=every)
    model = StreamedSimulation(project, base)
    checkpoint = DesignCheckpoint(root / 'checkpoint', model.plan, options=base)
    torch.manual_seed(3)
    history = []
    samples = [dict(update=0, elapsed_s=0., **counters(process))]
    started = time.perf_counter()
    for k in range(updates):
        if k and k % 25 == 0:
            param.advance_beta(2., maximum=16.)
        density = param()
        epsilon = (1+density)[:, :, None].contiguous()
        journal = root / f'iteration-{k}'
        result = StreamedSimulation(project, replace(base, restart_directory=str(journal)))(epsilon)
        objective = result.signals.square().sum()
        optimizer.zero_grad(set_to_none=True)
        objective.backward()
        history.append(dict(update=k, objective=float(objective.detach()), gradient_l2=float(param.design.grad.norm()), beta=float(param.beta)))
        optimizer.step()
        param.project_parameters_()
        checkpoint.save(iteration=k+1, parameterization=param, optimizer=optimizer, history=history)
        assert result.report['restart_state'] == 'completed'
        del result, objective, epsilon, density
        shutil.rmtree(journal)
        samples.append(dict(update=k+1, elapsed_s=time.perf_counter()-started, **counters(process)))
    shutil.rmtree(root / 'checkpoint')
    finite = all(math.isfinite(h['objective']) and math.isfinite(h['gradient_l2']) for h in history)
    return dict(updates=updates, steps=steps, temporal_depth=depth, restart_every_blocks=every, elapsed_s=time.perf_counter()-started, samples=samples,
                history=history, objectives_finite=finite, final_beta=float(param.beta),
                memory_growth=growth(samples, 'update', warmup_updates, 1.))


# ---- judging and rendering --------------------------------------------------------------------
def judge(record, criteria):
    verdicts = {}
    long, runs, opt = record['long_forward'], record['repeated_runs'], record['optimization']
    mb = 1024**2
    verdicts['long_forward_steps'] = long['steps'] >= criteria['long_forward']['min_steps']
    slope = long['memory_growth']['rss_bytes']['slope_bytes_per_unit']
    verdicts['long_forward_rss_growth'] = slope is not None and slope <= criteria['long_forward']['max_rss_growth_mb_per_1000_steps']*mb
    verdicts['long_forward_journal_bounded'] = long['max_journal_bytes'] <= long['restart_reservation_bytes']
    verdicts['long_forward_energy_growth'] = (long['energy']['max_relative_norm_after_source'] is not None
                                              and long['energy']['max_relative_norm_after_source'] <= criteria['long_forward']['energy_growth_limit']
                                              and not long['energy']['nonfinite'] and long['signals_finite'])
    verdicts['long_forward_late_norm'] = (long['energy']['max_relative_norm_last_half'] is not None
                                          and long['energy']['max_relative_norm_last_half'] <= criteria['long_forward']['max_relative_norm_last_half'])
    verdicts['repeated_runs_count'] = runs['runs'] >= criteria['repeated_runs']['min_runs']
    slope = runs['memory_growth']['rss_bytes']['slope_bytes_per_unit']
    verdicts['repeated_runs_rss_growth'] = slope is not None and slope <= criteria['repeated_runs']['max_rss_growth_mb_per_run']*mb
    verdicts['repeated_runs_gradients_identical'] = runs['gradients_identical']
    verdicts['optimization_updates'] = opt['updates'] >= criteria['optimization']['min_updates']
    slope = opt['memory_growth']['rss_bytes']['slope_bytes_per_unit']
    verdicts['optimization_rss_growth'] = slope is not None and slope <= criteria['optimization']['max_rss_growth_mb_per_update']*mb
    verdicts['optimization_finite'] = opt['objectives_finite']
    for part in ('long_forward', 'repeated_runs', 'optimization'):
        for key in ('torch_allocated_bytes', 'torch_reserved_bytes'):
            slope = record[part]['memory_growth'][key]['slope_bytes_per_unit']
            verdicts[f'{part}_{key}_growth'] = slope is not None and slope <= criteria['max_torch_growth_bytes_per_unit']
    verdicts['all'] = all(verdicts.values())
    return verdicts


def environment():
    def git(*args):
        try:
            return subprocess.run(['git', *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
        except (OSError, subprocess.CalledProcessError):
            return None
    return dict(python=platform.python_version(), torch=torch.__version__, numpy=np.__version__, psutil=psutil.__version__,
                os=platform.platform(), machine=platform.machine(), cpu=platform.processor(),
                cuda_available=torch.cuda.is_available(), gpu=torch.cuda.get_device_name() if torch.cuda.is_available() else None,
                threads=torch.get_num_threads(), commit=git('rev-parse', 'HEAD'),
                dirty_paths=len([line for line in (git('status', '--porcelain', '--untracked-files=no') or '').splitlines()]),
                recorded_at=datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'))


def render(record, markdown):
    long, runs, opt, v = record['long_forward'], record['repeated_runs'], record['optimization'], record['verdicts']
    c = record['criteria']
    mb = 1024**2

    def mbs(value):
        return 'n/a' if value is None else f'{value/mb:.3f}'

    def ok(flag):
        return 'pass' if flag else 'FAIL'
    lines = ['# Restart journal soak', '',
             'Long-run stability of the streamed engine with the restart journal enabled, on one light 2D fixture, CPU by design.',
             f'Rendered by `benchmarks/restart_soak.py --render` from `{record["record_path"]}`; the criteria were declared in',
             f'`{record["case_path"]}` before the run. This is a memory-growth and discrete-stability soak, not a throughput or physics-accuracy measurement.', '',
             '## Fixture and environment', '',
             f'- Domain 16 x 15 cells (1.6 x 1.5 um, mesh 0.1 um), three-cell PML, one Gaussian point source, three point monitors, float32, epsilon 1.7, CPU tiles, slab width 16.',
             f'- Long forward: {long["steps"]} steps in blocks of {long["temporal_depth"]}, a journal record every {long["restart_every_blocks"]} blocks ({long["journal_records_written"]["forward"]} records, {long["journal_seconds"]:.1f} s of journal writes), {long["elapsed_s"]:.0f} s.',
             f'- Repeated runs: {runs["runs"]} forward-plus-backward runs of {runs["steps"]} steps (blocks of {runs["temporal_depth"]}), each with its own journal, {runs["elapsed_s"]:.0f} s.',
             f'- Optimization: {opt["updates"]} projected Adam updates over a filtered 16 x 15 density, {opt["steps"]} steps per solve, a journal per iteration and a design checkpoint per update, final beta {opt["final_beta"]:g}, {opt["elapsed_s"]:.0f} s.',
             f'- {record["environment"]["os"]}, {record["environment"]["cpu"]}, Python {record["environment"]["python"]}, torch {record["environment"]["torch"]}, {record["environment"]["threads"]} threads, commit {record["environment"]["commit"]}, recorded {record["environment"]["recorded_at"]}.', '',
             '## Memory growth after warm-up', '',
             'Least-squares slope of each counter over the samples after the declared warm-up; the bound is the pre-declared limit. Torch counters are the CUDA allocator statistics and stay zero on CPU.', '',
             '| Part | Warm-up | RSS slope | Bound | RSS first / last after warm-up | Torch allocated slope | Torch reserved slope | Verdict |',
             '|---|---|---|---|---|---|---|---|']
    g = long['memory_growth']
    lines.append(f'| Long forward | {c["long_forward"]["warmup_steps"]} steps | {mbs(g["rss_bytes"]["slope_bytes_per_unit"])} MB per 1000 steps | {c["long_forward"]["max_rss_growth_mb_per_1000_steps"]} MB | {mbs(g["rss_bytes"]["first_after_warmup"])} / {mbs(g["rss_bytes"]["last"])} MB | {g["torch_allocated_bytes"]["slope_bytes_per_unit"]:.0f} B | {g["torch_reserved_bytes"]["slope_bytes_per_unit"]:.0f} B | {ok(v["long_forward_rss_growth"] and v["long_forward_torch_allocated_bytes_growth"] and v["long_forward_torch_reserved_bytes_growth"])} |')
    g = runs['memory_growth']
    lines.append(f'| Repeated runs | {c["repeated_runs"]["warmup_runs"]} run | {mbs(g["rss_bytes"]["slope_bytes_per_unit"])} MB per run | {c["repeated_runs"]["max_rss_growth_mb_per_run"]} MB | {mbs(g["rss_bytes"]["first_after_warmup"])} / {mbs(g["rss_bytes"]["last"])} MB | {g["torch_allocated_bytes"]["slope_bytes_per_unit"]:.0f} B | {g["torch_reserved_bytes"]["slope_bytes_per_unit"]:.0f} B | {ok(v["repeated_runs_rss_growth"] and v["repeated_runs_torch_allocated_bytes_growth"] and v["repeated_runs_torch_reserved_bytes_growth"])} |')
    g = opt['memory_growth']
    lines.append(f'| Optimization | {c["optimization"]["warmup_updates"]} updates | {mbs(g["rss_bytes"]["slope_bytes_per_unit"])} MB per update | {c["optimization"]["max_rss_growth_mb_per_update"]} MB | {mbs(g["rss_bytes"]["first_after_warmup"])} / {mbs(g["rss_bytes"]["last"])} MB | {g["torch_allocated_bytes"]["slope_bytes_per_unit"]:.0f} B | {g["torch_reserved_bytes"]["slope_bytes_per_unit"]:.0f} B | {ok(v["optimization_rss_growth"] and v["optimization_torch_allocated_bytes_growth"] and v["optimization_torch_reserved_bytes_growth"])} |')
    e = long['energy']
    lines += ['', '## Journal and discrete stability', '',
              f'- Journal bytes never exceeded the reservation: peak {long["max_journal_bytes"]} of {long["restart_reservation_bytes"]} reserved bytes ({ok(v["long_forward_journal_bounded"])}).',
              f'- State norm sum eps E^2 + sum H^2 after every block; the source ends at {e["source_end_s"]*1e15:.1f} fs (step {e["source_end_step"]}), the post-source peak is frozen at {e["frozen_peak"]:.6g}.',
              f'- Largest norm relative to that peak over the {e["samples_after_source"]} later blocks: {e["max_relative_norm_after_source"]:.6g} against the declared growth limit {c["long_forward"]["energy_growth_limit"]} ({ok(v["long_forward_energy_growth"])}); monotone decay is not demanded.',
              f'- Largest relative norm over the last half of the run: {e["max_relative_norm_last_half"]:.3g} against the declared ceiling {c["long_forward"]["max_relative_norm_last_half"]} ({ok(v["long_forward_late_norm"])}); at the last step {e["final_relative_norm"]:.3g}; all signals finite: {long["signals_finite"]}.',
              f'- Repeated runs returned bitwise identical gradients: {runs["gradients_identical"]} ({ok(v["repeated_runs_gradients_identical"])}); optimization objectives and gradients finite: {opt["objectives_finite"]} ({ok(v["optimization_finite"])}).',
              '', f'## Verdict: {"pass" if v["all"] else "FAIL"}', '',
              'Every criterion above is judged by `tests/test_restart_soak_record.py` against this record; the test runs nothing long.', '',
              'Not shown: throughput, CUDA execution, large domains, multi-hour wall time and power-loss durability. RSS is the process resident set sampled between blocks; it includes the interpreter and every library, and transient peaks inside a block are not sampled.']
    Path(markdown).write_text('\n'.join(lines)+'\n', encoding='utf-8', newline='\n')


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--steps', type=int, default=100000)
    parser.add_argument('--depth', type=int, default=100)
    parser.add_argument('--record-every', type=int, default=10)
    parser.add_argument('--runs', type=int, default=8)
    parser.add_argument('--run-steps', type=int, default=600)
    parser.add_argument('--updates', type=int, default=100)
    parser.add_argument('--update-steps', type=int, default=120)
    parser.add_argument('--run-every', type=int, default=2)
    parser.add_argument('--update-every', type=int, default=3)
    parser.add_argument('--parts', default='long,runs,optimization', help='comma-separated parts to run (pilots); a record needs all three')
    parser.add_argument('--case', default=str(DEFAULT_CASE))
    parser.add_argument('--scratch', default=str(ROOT / '.local' / 'tmp' / 'restart_soak'))
    parser.add_argument('--output')
    parser.add_argument('--render', help='render an existing record instead of running')
    parser.add_argument('--markdown', default=str(ROOT / 'docs' / 'RESTART_SOAK.md'))
    args = parser.parse_args(argv)
    if args.render:
        render(json.loads(Path(args.render).read_text(encoding='utf-8')), args.markdown)
        return 0
    case = json.loads(Path(args.case).read_text(encoding='utf-8'))
    criteria = case['acceptance']
    torch.set_num_threads(min(4, torch.get_num_threads()))
    process = psutil.Process()
    root = Path(args.scratch)
    if root.exists():
        shutil.rmtree(root)
    root.mkdir(parents=True)
    record = dict(task='G5-10', case_path=os.path.relpath(args.case, ROOT).replace('\\', '/'), record_path=None, criteria=criteria,
                  environment=environment(), arguments=vars(args))
    parts = args.parts.split(',')
    if 'long' in parts:
        record['long_forward'] = long_forward(args.steps, args.depth, args.record_every, criteria['long_forward']['energy_growth_limit'],
                                              criteria['long_forward']['warmup_steps'], root, process)
    if 'runs' in parts:
        record['repeated_runs'] = repeated_runs(args.runs, args.run_steps, 20, args.run_every, root, process, criteria['repeated_runs']['warmup_runs'])
    if 'optimization' in parts:
        record['optimization'] = optimization(args.updates, args.update_steps, 20, args.update_every, root, process, criteria['optimization']['warmup_updates'])
    record['verdicts'] = judge(record, criteria) if len(parts) == 3 else dict(all=False, partial_pilot=True)
    shutil.rmtree(root, ignore_errors=True)
    if args.output:
        record['record_path'] = os.path.relpath(args.output, ROOT).replace('\\', '/')
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output).write_text(json.dumps(record, indent=1)+'\n', encoding='utf-8', newline='\n')
    summary = {}
    for part in ('long_forward', 'repeated_runs', 'optimization'):
        if part in record:
            samples = record[part].get('samples', record[part].get('memory_samples'))
            summary[part] = dict(elapsed_s=record[part]['elapsed_s'], rss_growth=record[part]['memory_growth']['rss_bytes'],
                                 rss_mb=[(s.get('step', s.get('run', s.get('update'))), round(s['rss_bytes']/1024**2, 2)) for s in samples])
    if 'long_forward' in record:
        summary['long_forward'].update(energy=record['long_forward']['energy'], max_journal_bytes=record['long_forward']['max_journal_bytes'],
                                       reservation=record['long_forward']['restart_reservation_bytes'])
    summary['verdicts'] = record['verdicts']
    print(json.dumps(summary, indent=1))
    return 0 if record['verdicts']['all'] else 1


if __name__ == '__main__':
    sys.exit(main())
