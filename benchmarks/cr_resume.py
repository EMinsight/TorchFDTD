"""Strict, single-writer restart records for the spectral CR evaluator.

Only compact, completed forward responses are cached. Gradient replay always
executes the differentiable solver. These records are not field checkpoints.
"""
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path

import numpy as np
import torch


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, indent=2, allow_nan=False) + '\n', encoding='utf8')
    temporary.replace(path)


def tensor_digest(value):
    cpu = value.detach().contiguous().cpu()
    header = json.dumps([str(cpu.dtype), list(cpu.shape)]).encode()
    return hashlib.sha256(header + cpu.numpy().tobytes()).hexdigest()


def source_hashes():
    root = Path(__file__).resolve().parents[1]
    paths = sorted((root / 'torchfdtd').rglob('*.py'))
    paths += [Path(__file__).resolve(), root / 'benchmarks/cr_spectral_objective.py']
    return {p.relative_to(root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}


def runtime_identity():
    try:
        cupy = importlib.metadata.version('cupy-cuda12x')
    except importlib.metadata.PackageNotFoundError:
        cupy = None
    props = torch.cuda.get_device_properties(torch.cuda.current_device())
    return dict(torch=torch.__version__, numpy=np.__version__, cupy=cupy,
                cuda=torch.version.cuda, gpu=props.name,
                capability=[props.major, props.minor])


class CaseJournal:
    """Persist tiny (polarization, quadrant) outputs bound to exact run inputs.

    One process must own a journal. A mismatch fails closed, rather than mixing
    runs. Atomic replace protects the previous complete file on interruption.
    """
    def __init__(self, path, contract, *, resume=False):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = self.path.with_suffix(self.path.suffix + '.lock').open('a+b')
        try:
            if os.name == 'nt':
                import msvcrt
                if self._lock.tell() == 0:
                    self._lock.write(b'0')
                    self._lock.flush()
                self._lock.seek(0)
                msvcrt.locking(self._lock.fileno(), msvcrt.LK_NBLCK, 1)
            else:
                import fcntl
                fcntl.flock(self._lock.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError as exc:
            self.close()
            raise RuntimeError('Another process owns this case journal.') from exc
        try:
            self._initialize(contract, resume)
        except Exception:
            self.close()
            raise

    def close(self):
        if getattr(self, '_lock', None) is not None:
            self._lock.close()
            self._lock = None

    def __del__(self):
        self.close()

    def _initialize(self, contract, resume):
        self.contract = json.loads(json.dumps(contract, allow_nan=False))
        if resume:
            self.record = json.loads(self.path.read_text(encoding='utf8'))
            if self.record.get('version') != 1 or self.record.get('contract') != self.contract:
                raise ValueError('Restart contract mismatch: use a new output for changed inputs, settings, code or runtime.')
            if not isinstance(self.record.get('cases'), dict):
                raise ValueError('Invalid case journal.')
        else:
            if self.path.exists():
                raise FileExistsError('Case journal already exists. Use --resume or a new output.')
            self.record = dict(version=1, contract=self.contract, cases={})
            write_json(self.path, self.record)
        self.hits = 0
        self.computed = 0

    def evaluate(self, density, index, compute):
        if self._lock is None:
            raise RuntimeError('Case journal is closed.')
        # Never substitute a detached response for differentiable replay.
        if torch.is_grad_enabled():
            return compute()
        key = tensor_digest(density) + ':' + ':'.join(str(i) for i in index)
        entry = self.record['cases'].get(key)
        if entry is not None:
            value = torch.tensor(entry['value'], device=density.device, dtype=density.dtype)
            self._validate(value)
            if tensor_digest(value) != entry['sha256']:
                raise ValueError('Cached case checksum mismatch.')
            self.hits += 1
            return value
        value = compute()
        self._validate(value)
        if value.dtype != density.dtype:
            raise ValueError('CR response dtype must match density dtype.')
        self.record['cases'][key] = dict(value=value.detach().cpu().tolist(), sha256=tensor_digest(value))
        write_json(self.path, self.record)
        self.computed += 1
        return value

    @staticmethod
    def _validate(value):
        if value.shape != (2, 4) or value.dtype not in (torch.float32, torch.float64):
            raise ValueError('Expected a real (2, 4) CR response.')
        if not bool(torch.isfinite(value).all()) or bool((value < 0).any()):
            raise ValueError('CR response must be finite and nonnegative.')


def load_gradient_record(path, contract, density):
    """Validate provenance and NPY bytes before reusing a completed VJP."""
    path = Path(path)
    record = json.loads(path.read_text(encoding='utf8'))
    if record.get('restart_contract') != contract:
        raise ValueError('Saved gradient restart contract mismatch.')
    artifact = record.get('gradient_artifact')
    if not artifact:
        raise ValueError('No completed gradient artifact to resume.')
    expected = path.with_suffix('.gradient.npy')
    if artifact.get('file') != expected.name:
        raise ValueError('Gradient artifact must be the adjacent named NPY file.')
    if hashlib.sha256(expected.read_bytes()).hexdigest() != artifact.get('sha256'):
        raise ValueError('Gradient artifact checksum mismatch.')
    array = np.load(expected, allow_pickle=False)
    expected_dtype = density.detach().cpu().numpy().dtype
    if array.shape != tuple(density.shape) or array.dtype != expected_dtype:
        raise ValueError('Gradient artifact shape or dtype mismatch.')
    if artifact.get('shape') != list(density.shape) or artifact.get('dtype') != str(density.dtype):
        raise ValueError('Gradient metadata shape or dtype mismatch.')
    gradient = torch.from_numpy(array).to(density.device)
    if not bool(torch.isfinite(gradient).all()):
        raise ValueError('Non-finite saved gradient.')
    if artifact.get('variable') != 'relaxed density' or artifact.get('objective') != 'weighted_bits_per_pixel':
        raise ValueError('Gradient variable or objective mismatch.')
    return record, gradient
