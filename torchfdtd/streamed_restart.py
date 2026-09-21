"""Durable restart journal for streamed adjoints.

The journal records, at block boundaries, everything a later process needs to
continue: the forward state and partial signals, or the adjoint state, the
partial material gradient and the block that was completed. Resuming a backward
pass replays from the all-zero initial state up to the recorded block, so no
saved restart bank has to be preserved. A strict contract (project, epsilon,
options, runtime sources, signal adjoint) rejects a journal written for other
inputs. Records are written to a temporary directory, synced, renamed and only
then published through `latest.json`, and the previous record is removed
afterwards. This is crash consistency for our own files, not a filesystem
quota, a mid-block checkpoint or a guarantee against corrupted storage.
"""
from dataclasses import asdict
import hashlib
import json
import os
from pathlib import Path
import shutil
import time

import numpy as np
import torch

CHUNK_BYTES = 256 * 1024 ** 2
MARKER = 'torchfdtd-streamed-restart'


def sha256_tensor(value):
    """Hash a CPU tensor in bounded row chunks without copying the whole array."""
    digest = hashlib.sha256()
    if value.numel() == 0:
        return digest.hexdigest()
    rows = max(1, CHUNK_BYTES // max(1, value[0].numel() * value.element_size())) if value.ndim else 1
    if value.ndim == 0:
        digest.update(value.detach().contiguous().numpy().tobytes())
        return digest.hexdigest()
    for lo in range(0, value.shape[0], rows):
        chunk = value[lo:lo + rows].detach().contiguous()
        digest.update(memoryview(chunk.numpy()).cast('B'))
    return digest.hexdigest()


def sha256_file(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def runtime_sources(package=None):
    """SHA-256 of every Python file under the package, keyed by relative POSIX path.

    Boundaries, waveforms, differentiable systems and the inline CUDA kernel
    sources all take part in the numerics, so the whole package is the runtime
    contract rather than the streamed modules alone.
    """
    root = Path(package if package is not None else Path(__file__).resolve().parent)
    return {path.relative_to(root).as_posix(): sha256_file(path) for path in sorted(root.rglob('*.py'))}


def _write_array(path, array):
    """Write a CPU tensor or file bank to a raw file in row chunks and sync it."""
    shape = tuple(int(n) for n in array.shape)
    dtype = array.dtype
    item = torch.empty((), dtype=dtype).element_size()
    row_bytes = int(np.prod(shape[1:])) * item if len(shape) > 1 else item
    rows = max(1, CHUNK_BYTES // max(1, row_bytes))
    with open(path, 'wb', buffering=0) as handle:
        for lo in range(0, shape[0], rows):
            chunk = array[lo:lo + rows]
            if isinstance(chunk, torch.Tensor):
                chunk = chunk.detach().contiguous()
            view = memoryview(chunk.numpy()).cast('B')
            done = 0
            while done < len(view):
                count = handle.write(view[done:])
                if not count:
                    raise OSError('Incomplete restart record write.')
                done += count
        handle.flush()
        os.fsync(handle.fileno())
    return dict(shape=shape, dtype=str(dtype).replace('torch.', ''), bytes=int(np.prod(shape)) * item)


def _read_array(path, description, target):
    """Fill a CPU tensor or file bank from a raw record in row chunks."""
    shape = tuple(description['shape'])
    dtype = getattr(torch, description['dtype'])
    if tuple(target.shape) != shape or target.dtype != dtype:
        raise ValueError('Restart record shape or dtype does not match the current state.')
    item = torch.empty((), dtype=dtype).element_size()
    row_bytes = int(np.prod(shape[1:])) * item if len(shape) > 1 else item
    rows = max(1, CHUNK_BYTES // max(1, row_bytes))
    with open(path, 'rb', buffering=0) as handle:
        for lo in range(0, shape[0], rows):
            hi = min(shape[0], lo + rows)
            buffer = torch.empty((hi - lo, *shape[1:]), dtype=dtype)
            view = memoryview(buffer.numpy()).cast('B')
            done = 0
            while done < len(view):
                count = handle.readinto(view[done:])
                if not count:
                    raise OSError('Truncated restart record.')
                done += count
            if isinstance(target, torch.Tensor):
                target[lo:hi].copy_(buffer)
            else:
                target.index_copy_(0, torch.arange(lo, hi, dtype=torch.int64), buffer)
    return target


def _atomic_json(path, payload):
    temp = path.with_name(path.name + '.tmp')
    data = (json.dumps(payload, indent=1, sort_keys=True) + '\n').encode('utf-8')
    with open(temp, 'wb') as handle:
        handle.write(data)
        handle.flush()
        os.fsync(handle.fileno())
    os.replace(temp, path)


class RestartJournal:
    def __init__(self, directory, contract, every_blocks=1):
        self.root = Path(directory).expanduser().resolve()
        self.contract = contract
        self.every = every_blocks
        self.root.mkdir(parents=True, exist_ok=True)
        self.contract_path = self.root / 'contract.json'
        self.written = dict(forward=0, backward=0)
        self.seconds = 0.
        if self.contract_path.exists():
            existing = json.loads(self.contract_path.read_text(encoding='utf-8'))
            if existing != contract:
                changed = sorted(k for k in set(existing) | set(contract) if existing.get(k) != contract.get(k))
                for group in ('options', 'runtime_sha256'):
                    if group in changed:
                        old, new = existing.get(group) or {}, contract.get(group) or {}
                        changed += [f'{group}.{k}' for k in sorted(set(old) | set(new)) if old.get(k) != new.get(k)]
                raise ValueError('Restart journal contract mismatch. Use a new directory for changed inputs, options or runtime. Differences: '+', '.join(changed))
        else:
            _atomic_json(self.contract_path, contract)
        # A crash leaves the record it was writing as `<name>.tmp` beside the
        # published records, never pointed at by a latest-*.json. Only such
        # entries directly under this journal's own directory are removed.
        for stale in self.root.glob('*.tmp'):
            if stale.is_dir():
                shutil.rmtree(stale)
            else:
                stale.unlink()

    # ---- helpers -----------------------------------------------------------------
    def _pointer(self, kind):
        # Forward and backward records are published independently: the completed
        # forward signals stay available while backward records rotate.
        return self.root / f'latest-{kind}.json'

    def _latest(self, kind):
        pointer = self._pointer(kind)
        if not pointer.exists():
            return None
        latest = json.loads(pointer.read_text(encoding='utf-8'))
        record = self.root / latest['directory']
        if record.parent != self.root or record.name.endswith('.tmp'):
            raise ValueError('Restart pointer names a record outside this journal directory.')
        meta = record / 'meta.json'
        if not meta.exists():
            return None
        payload = json.loads(meta.read_text(encoding='utf-8'))
        if payload.get('marker') != MARKER:
            raise ValueError('Restart record was not written by this journal.')
        payload['directory'] = record
        return payload

    def _publish(self, name, meta, writer):
        started = time.perf_counter()
        temp = self.root / (name + '.tmp')
        if temp.exists():
            shutil.rmtree(temp)
        temp.mkdir()
        try:
            arrays = writer(temp)
        except BaseException:
            shutil.rmtree(temp, ignore_errors=True)
            raise
        meta = dict(meta, marker=MARKER, arrays=arrays, written=time.time())
        _atomic_json(temp / 'meta.json', meta)
        final = self.root / name
        if final.exists():
            shutil.rmtree(final)
        for attempt in range(5):
            try:
                os.replace(temp, final)
                break
            except PermissionError:
                # Windows can briefly deny renaming a directory whose fresh
                # files an indexer still holds open. Retry before giving up.
                if attempt == 4:
                    raise
                time.sleep(.05*(attempt+1))
        previous = self._latest(meta['kind'])
        _atomic_json(self._pointer(meta['kind']), dict(directory=name, kind=meta['kind'], block=meta['block']))
        if previous is not None and previous['directory'] != final and previous['directory'].exists():
            shutil.rmtree(previous['directory'])
        self.seconds += time.perf_counter() - started
        self.written[meta['kind']] += 1

    # ---- forward ------------------------------------------------------------------
    def forward_due(self, completed_blocks, total_blocks):
        return 0 < completed_blocks < total_blocks and completed_blocks % self.every == 0

    def record_forward(self, completed_blocks, state, signals):
        def writer(directory):
            arrays = [_write_array(directory / f'state-{i}.bin', value) for i, value in enumerate(state)]
            arrays.append(_write_array(directory / 'signals.bin', signals))
            return arrays
        self._publish(f'forward-{completed_blocks}', dict(kind='forward', block=completed_blocks, complete=False), writer)

    def record_signals(self, signals):
        def writer(directory):
            return [_write_array(directory / 'signals.bin', signals)]
        self._publish('forward-complete', dict(kind='forward', block=None, complete=True), writer)

    def load_forward(self, state_factory, signals_template):
        """Return (completed_blocks, state, signals) or (None, None, signals) when complete, else None."""
        latest = self._latest('forward')
        if latest is None:
            return None
        directory = latest['directory']
        if latest['complete']:
            signals = _read_array(directory / 'signals.bin', latest['arrays'][-1], torch.empty_like(signals_template))
            return None, None, signals
        state = state_factory()
        for i, (value, description) in enumerate(zip(state, latest['arrays'][:-1])):
            _read_array(directory / f'state-{i}.bin', description, value)
        signals = _read_array(directory / 'signals.bin', latest['arrays'][-1], torch.empty_like(signals_template))
        return latest['block'], state, signals

    # ---- backward -----------------------------------------------------------------
    def backward_due(self, block, total_blocks):
        return block > 0 and (total_blocks - block) % self.every == 0

    def record_backward(self, block, adjoint, gradient, signal_bar_sha256):
        def writer(directory):
            arrays = [_write_array(directory / f'adjoint-{i}.bin', value) for i, value in enumerate(adjoint)]
            arrays.append(_write_array(directory / 'gradient.bin', gradient))
            return arrays
        self._publish(f'backward-{block}', dict(kind='backward', block=block, signal_bar_sha256=signal_bar_sha256), writer)

    def load_backward(self, signal_bar_sha256, adjoint_factory, gradient_template):
        """Return (block, adjoint, gradient) for a recorded backward, else None."""
        latest = self._latest('backward')
        if latest is None:
            return None
        if latest['signal_bar_sha256'] != signal_bar_sha256:
            raise ValueError('Restart journal was written for a different signal adjoint. Use a new directory. Differences: signal_bar_sha256')
        directory = latest['directory']
        adjoint = adjoint_factory()
        for i, (value, description) in enumerate(zip(adjoint, latest['arrays'][:-1])):
            _read_array(directory / f'adjoint-{i}.bin', description, value)
        gradient = _read_array(directory / 'gradient.bin', latest['arrays'][-1], torch.empty_like(gradient_template))
        return latest['block'], adjoint, gradient

    def complete(self):
        """Mark the run complete and remove state records; the contract and marker stay."""
        records = [self._latest(kind) for kind in ('forward', 'backward')]
        _atomic_json(self.root / 'complete.json', dict(marker=MARKER, written=time.time(), records=self.written))
        for kind in ('forward', 'backward'):
            pointer = self._pointer(kind)
            if pointer.exists():
                pointer.unlink()
        for latest in records:
            if latest is not None and latest['directory'].exists():
                shutil.rmtree(latest['directory'])

    def report(self):
        return dict(restart_journal=str(self.root), restart_every_blocks=self.every,
                    journal_records_written=dict(self.written), journal_seconds=self.seconds)


def journal_contract(project, epsilon, options, starts):
    settings = asdict(options)
    settings.pop('restart_directory', None)
    settings.pop('restart_every_blocks', None)
    settings = {k: (str(v) if isinstance(v, Path) else v) for k, v in settings.items()}
    # Item ids are generated labels that differ between processes; the physics
    # contract hashes the scene without them.
    labels = {'__all__': {'id'}}
    scene = project.model_dump_json(exclude={'structures': labels, 'sources': labels, 'monitors': labels})
    return dict(project_sha256=hashlib.sha256(scene.encode('utf-8')).hexdigest(),
                epsilon_sha256=sha256_tensor(epsilon), epsilon_shape=list(epsilon.shape), epsilon_dtype=str(epsilon.dtype),
                options=settings, starts=list(starts), runtime_sha256=runtime_sources(), torch=torch.__version__)
