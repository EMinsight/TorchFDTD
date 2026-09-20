"""Single-writer projected Adam checkpoints for explicit-input CR experiments.

The checkpoint is authoritative. JSON reports and NPY exports are derived views.
Only committed updates survive a restart. No time-domain graph is serialized.
"""
import hashlib
import json
from pathlib import Path
import shutil

import torch

from benchmarks.cr_resume import CaseJournal, tensor_digest


def _digest(value):
    def compact(item):
        if isinstance(item, torch.Tensor):
            return {'tensor_sha256': tensor_digest(item)}
        if isinstance(item, dict):
            return {str(k): compact(v) for k, v in item.items()}
        if isinstance(item, (list, tuple)):
            return [compact(v) for v in item]
        return item
    return hashlib.sha256(json.dumps(compact(value), sort_keys=True, allow_nan=False).encode()).hexdigest()


class ProjectedAdamRun:
    """CPU density in [0,1], maximizing a scalar differentiable objective.

    This class provides checkpoint ownership and iteration bookkeeping, not a
    new optimization algorithm. The caller supplies a complete Torch objective.
    """
    def __init__(self, directory, initial_density, contract, *, learning_rate,
                 resume=False, disk_free_reserve_bytes=0):
        if (initial_density.device.type != 'cpu' or initial_density.dtype not in (torch.float32, torch.float64)
                or initial_density.ndim != 2 or not initial_density.numel()):
            raise ValueError('Use a nonempty two-dimensional CPU FP32 or FP64 density.')
        self._validate_density(initial_density)
        if not 0 < learning_rate < 1 or not isinstance(disk_free_reserve_bytes, int) or disk_free_reserve_bytes < 0:
            raise ValueError('Use 0 < learning_rate < 1 and a nonnegative disk reserve.')
        self.directory = Path(directory).resolve()
        self.directory.mkdir(parents=True, exist_ok=True)
        self.path = self.directory/'checkpoint.pt'
        self.disk_free_reserve_bytes = disk_free_reserve_bytes
        self._failed = False
        self.committed_updates = 0
        self.contract = json.loads(json.dumps(dict(inputs=contract,
            optimizer=dict(name='projected Adam', learning_rate=learning_rate,
                betas=[.9,.999], eps=1e-8, bounds=[0.,1.], foreach=False),
            initial_density_sha256=tensor_digest(initial_density)), allow_nan=False))
        self.owner = CaseJournal(self.directory/'ownership.json', self.contract, resume=resume)
        try:
            self.density = torch.nn.Parameter(initial_density.detach().clone())
            self.optimizer = torch.optim.Adam([self.density], lr=learning_rate, foreach=False)
            self.updates, self.history, self.best, self.last_evaluation = 0, [], None, None
            if resume:
                payload = torch.load(self.path, map_location='cpu', weights_only=True)
                digest = payload.pop('sha256', None)
                if digest != _digest(payload):
                    raise ValueError('Optimization checkpoint checksum mismatch.')
                if payload.get('version') != 1 or payload.get('contract') != self.contract:
                    raise ValueError('Optimization checkpoint contract mismatch.')
                saved = payload['density']
                if saved.shape != self.density.shape or saved.dtype != self.density.dtype:
                    raise ValueError('Checkpoint density shape or dtype mismatch.')
                self._validate_density(saved)
                self.updates = payload['updates']
                self.history = payload['history']
                self.best, self.last_evaluation = payload['best'], payload['last_evaluation']
                if not isinstance(self.updates, int) or self.updates < 0 or len(self.history) != self.updates:
                    raise ValueError('Checkpoint update/history mismatch.')
                if [row['update'] for row in self.history] != list(range(self.updates)):
                    raise ValueError('Checkpoint history is not contiguous.')
                with torch.no_grad():
                    self.density.copy_(saved)
                self.optimizer.load_state_dict(payload['optimizer'])
                state = self.optimizer.state.get(self.density, {})
                if self.updates and (float(state['step']) != self.updates or any(
                        state[key].shape != self.density.shape or not bool(torch.isfinite(state[key]).all())
                        for key in ('exp_avg', 'exp_avg_sq'))):
                    raise ValueError('Checkpoint Adam moments or step count are invalid.')
                self.committed_updates = self.updates
            else:
                if self.path.exists():
                    raise FileExistsError('Optimization checkpoint already exists. Use resume or a new directory.')
                self.save()
        except Exception:
            self.close()
            # A failed initial save must not strand a newly owned empty run.
            if not resume and not self.path.exists():
                self.owner.path.unlink(missing_ok=True)
            raise

    @staticmethod
    def _validate_density(value):
        if not bool(torch.isfinite(value).all()) or bool(((value < 0) | (value > 1)).any()):
            raise ValueError('Density must be finite within [0,1].')

    def observe(self, score, metadata):
        self._require_open()
        if not isinstance(score, torch.Tensor) or score.numel() != 1 or not bool(torch.isfinite(score)):
            raise ValueError('Expected a finite scalar Torch objective.')
        row = dict(update=self.updates, weighted_bits_per_pixel=float(score.detach()),
            density_sha256=tensor_digest(self.density),
            metadata=json.loads(json.dumps(metadata, allow_nan=False)))
        self.last_evaluation = row
        if self.best is None or row['weighted_bits_per_pixel'] > self.best['record']['weighted_bits_per_pixel']:
            self.best = dict(record=row, density=self.density.detach().clone())
        return row

    def step(self, score, metadata):
        self._require_open()
        self.optimizer.zero_grad(set_to_none=True)
        (-score).backward()
        gradient = self.density.grad
        if gradient is None or not bool(torch.isfinite(gradient).all()):
            raise ValueError('Expected a finite density gradient from the complete objective.')
        row = dict(self.observe(score, metadata), loss_gradient_l2=float(gradient.norm()))
        self.optimizer.step()
        with torch.no_grad():
            self.density.clamp_(0., 1.)
        self._validate_density(self.density)
        row['next_density_sha256'] = tensor_digest(self.density)
        self.history.append(row)
        self.updates += 1
        self.save()
        return row

    def save(self):
        try:
            self._write_state()
        except Exception:
            # The in-memory optimizer may be ahead of disk. It must not be
            # stepped again until the last committed checkpoint is reopened.
            self._failed = True
            raise
        self.committed_updates = self.updates

    def _write_state(self):
        self._require_open()
        # Reserve room for a new archive before replacing the committed one.
        # Sixteen design arrays conservatively cover density/moments/best copies.
        archive_allowance = 16*self.density.numel()*self.density.element_size() + 1024**2
        archive_allowance += len(json.dumps(self.history, allow_nan=False).encode())
        if shutil.disk_usage(self.directory).free < self.disk_free_reserve_bytes + archive_allowance:
            raise OSError('Optimization checkpoint would cross the free-space reserve.')
        payload = dict(version=1, contract=self.contract, density=self.density.detach(),
            optimizer=self.optimizer.state_dict(), updates=self.updates, history=self.history,
            best=self.best, last_evaluation=self.last_evaluation)
        payload['sha256'] = _digest(payload)
        temporary = self.path.with_suffix('.pt.tmp')
        torch.save(payload, temporary)
        temporary.replace(self.path)

    def _require_open(self):
        if self.owner._lock is None:
            raise RuntimeError('Optimization run is closed.')
        if self._failed:
            raise RuntimeError('Checkpoint commit failed. Reopen with resume before continuing.')

    def close(self):
        if getattr(self, 'owner', None) is not None:
            self.owner.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
