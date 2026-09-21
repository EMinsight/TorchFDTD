"""Record distinct live file-bank counts of the streamed adjoint per phase.

Counts bank identities through StateStore.banks weak references at every
allocation with cyclic GC disabled. This is a lifetime measurement of the
current schedule on a small CPU scene. It is not a timing, capacity or physical
I/O result, and the recorded bound is the observed maximum, not a proof for
untested physics paths.

python -m benchmarks.streamed_bank_lifetime --output docs/validation/streamed_bank_lifetime.json
"""
import argparse
import gc
import hashlib
import json
import sys
import tempfile
from pathlib import Path

import torch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'tests'))
from torchfdtd import StreamedSimulation, StreamedAdjointOptions  # noqa: E402
from torchfdtd import state_store, streamed  # noqa: E402
from test_bloch_adjoint import scene  # noqa: E402


class TrackingStore(state_store.StateStore):
    instances = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.peak_live_banks = 0
        TrackingStore.instances.append(self)

    def new_state(self, templates):
        arrays = super().new_state(templates)
        self.peak_live_banks = max(self.peak_live_banks, len(self.banks))
        return arrays


def measure(steps, depth, checkpoints, local, scratch):
    TrackingStore.instances.clear()
    p = scene()
    p.region.steps = steps
    eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
    with tempfile.TemporaryDirectory(dir=scratch) as tmp:
        options = StreamedAdjointOptions(device='cpu', state_storage='disk', state_directory=tmp,
                                         disk_budget_bytes=64 * 1024 ** 2, slab_width=8, temporal_depth=depth,
                                         checkpoints=checkpoints, local_checkpoints=local)
        gc.disable()
        try:
            result = StreamedSimulation(p, options)(eps)
            gradient, = torch.autograd.grad(result.signals.abs().square().sum(), eps)
        finally:
            gc.enable()
        forward, backward = TrackingStore.instances
        state = result.report['state_bytes']
        assert forward.peak_bytes == forward.peak_live_banks * state
        assert backward.peak_bytes == backward.peak_live_banks * state
        return dict(path='nondispersive', steps=steps, temporal_depth=depth, checkpoints=checkpoints, local_checkpoints=local,
                    blocks=-(-steps // depth), partial_final_block=bool(steps % depth),
                    forward_peak_live_banks=forward.peak_live_banks, backward_peak_live_banks=backward.peak_live_banks,
                    backward_created_banks=backward.created_banks, bound_checkpoints_plus_three=checkpoints + 3,
                    reached_bound=backward.peak_live_banks == checkpoints + 3,
                    peak_block_checkpoints=result.report['peak_block_checkpoints'],
                    current_state_bank_capacity=result.report['state_bank_capacity'],
                    stores_closed=forward.closed and backward.closed,
                    scratch_empty=not list(Path(tmp).iterdir()), gradient_finite=bool(torch.isfinite(gradient).all()))


def measure_dispersive(steps, depth, checkpoints, scratch):
    from torchfdtd import StreamedDispersiveSimulation
    from test_streamed_dispersive import scene as dispersive_scene, inputs
    TrackingStore.instances.clear()
    p = dispersive_scene(bloch=True, steps=steps)
    values = inputs(p, 'shared', True)
    with tempfile.TemporaryDirectory(dir=scratch) as tmp:
        options = StreamedAdjointOptions(device='cpu', state_storage='disk', state_directory=tmp,
                                         disk_budget_bytes=64 * 1024 ** 2, slab_width=3, temporal_depth=depth,
                                         checkpoints=checkpoints, local_checkpoints=1)
        gc.disable()
        try:
            result = StreamedDispersiveSimulation(p, options)(*values)
            gradients = torch.autograd.grad(result.signals.abs().square().sum(), values)
        finally:
            gc.enable()
        forward, backward = TrackingStore.instances
        state = result.report['state_bytes']
        assert forward.peak_bytes == forward.peak_live_banks * state
        assert backward.peak_bytes == backward.peak_live_banks * state
        return dict(path='ade', steps=steps, temporal_depth=depth, checkpoints=checkpoints, local_checkpoints=1,
                    blocks=-(-steps // depth), partial_final_block=bool(steps % depth),
                    forward_peak_live_banks=forward.peak_live_banks, backward_peak_live_banks=backward.peak_live_banks,
                    backward_created_banks=backward.created_banks, bound_checkpoints_plus_three=checkpoints + 3,
                    reached_bound=backward.peak_live_banks == checkpoints + 3,
                    current_state_bank_capacity=result.report['state_bank_capacity'],
                    stores_closed=forward.closed and backward.closed, scratch_empty=not list(Path(tmp).iterdir()),
                    gradient_finite=bool(all(torch.isfinite(g).all() for g in gradients)))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', default='docs/validation/streamed_bank_lifetime.json')
    parser.add_argument('--scratch', default=None)
    args = parser.parse_args()
    state_store.StateStore = TrackingStore
    rows = [measure(steps, depth, c, lc, args.scratch)
            for steps, depth in [(10, 1), (13, 3), (24, 4), (29, 4), (41, 7)]
            for c in (0, 1, 2, 4) for lc in (0, 1, 2)]
    rows += [measure_dispersive(steps, depth, c, args.scratch)
             for steps, depth in [(10, 1), (13, 3)] for c in (0, 1, 2, 4)]
    by_c = {c: max(r['backward_peak_live_banks'] for r in rows if r['checkpoints'] == c) for c in (0, 1, 2, 4)}
    sources = {name: hashlib.sha256(Path(streamed.__file__).with_name(name).read_bytes()).hexdigest()
               for name in ('streamed.py', 'state_store.py', 'spacetime.py')}
    record = dict(
        scope='Distinct live file banks per phase on small CPU nondispersive Bloch and ADE scenes with cyclic GC '
              'disabled. Not a timing, capacity or physical I/O measurement. The recorded capacity is the '
              'reservation in force when this record was produced.',
        torch_version=torch.__version__, runtime_source_sha256=sources,
        forward_max_live_banks=max(r['forward_peak_live_banks'] for r in rows),
        backward_max_live_banks_by_checkpoints=by_c,
        every_case_within_checkpoints_plus_three=all(r['backward_peak_live_banks'] <= r['checkpoints'] + 3 for r in rows),
        bound_reached_for_each_checkpoint_count=all(by_c[c] == c + 3 for c in by_c),
        local_checkpoints_change_bank_counts=any(
            len({r['backward_peak_live_banks'] for r in rows
                 if r['path'] == 'nondispersive' and (r['steps'], r['checkpoints']) == key}) > 1
            for key in {(r['steps'], r['checkpoints']) for r in rows if r['path'] == 'nondispersive'}),
        ade_matches_nondispersive=all(
            r['backward_peak_live_banks'] == next(n['backward_peak_live_banks'] for n in rows
                                                  if n['path'] == 'nondispersive' and n['steps'] == r['steps']
                                                  and n['checkpoints'] == r['checkpoints'] and n['local_checkpoints'] == 1)
            for r in rows if r['path'] == 'ade'),
        cases=rows)
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes((json.dumps(record, indent=2) + '\n').encode('utf-8'))
    print(json.dumps({k: v for k, v in record.items() if k != 'cases'}, indent=2))


if __name__ == '__main__':
    main()
