"""Durable restart journal: interrupted streamed runs resume and reproduce results.

Interruptions are injected after a chosen number of forward or transpose block
operations, and one case kills a real child process. Resumed runs must report
the block they continued from, reproduce the uninterrupted signals and gradient,
reject journals written for other inputs or another signal adjoint, and remove
their state records on completion.
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

import pytest
import torch

import torchfdtd
from torchfdtd import StreamedSimulation, StreamedAdjointOptions
from torchfdtd.spacetime import SlabBlockOperator
from test_differentiable import project, gpu


def options(tmp_path, storage='host', device='cpu', **overrides):
    values = dict(device=device, slab_width=4, temporal_depth=3, checkpoints=1, local_checkpoints=1,
                  restart_directory=tmp_path / 'journal')
    if storage == 'disk':
        values.update(state_storage='disk', state_directory=tmp_path / 'scratch', disk_budget_bytes=64 * 1024 ** 2)
    values.update(overrides)
    return StreamedAdjointOptions(**values)


def scene():
    return project(steps=13)  # five blocks of depth three, the last one partial


class Interrupted(RuntimeError):
    pass


def interrupt(monkeypatch, method, allowed):
    original = getattr(SlabBlockOperator, method)
    calls = [0]

    def wrapper(self, *args, **kwargs):
        calls[0] += 1
        if calls[0] > allowed:
            raise Interrupted(f'interrupted {method} after {allowed} calls')
        return original(self, *args, **kwargs)
    monkeypatch.setattr(SlabBlockOperator, method, wrapper)
    return calls


def reference(p, eps, storage, device, tmp_path):
    settings = options(tmp_path / 'reference', storage, device, restart_directory=None)
    result = StreamedSimulation(p, settings)(eps)
    gradient, = torch.autograd.grad(result.signals.square().sum(), eps)
    return result.signals.detach().clone(), gradient


def _same(actual, expected, device):
    if device == 'cuda':
        torch.testing.assert_close(actual, expected, rtol=1e-6, atol=0)
    else:
        torch.testing.assert_close(actual, expected, rtol=0, atol=0)


@pytest.mark.parametrize('storage', ['host', 'disk'])
@pytest.mark.parametrize('device', ['cpu', 'cuda'])
@pytest.mark.parametrize('transposes', [1, 3])
def test_backward_resumes_after_interrupt(tmp_path, monkeypatch, storage, device, transposes):
    if device == 'cuda':
        gpu()
    p = scene()
    eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
    signals, gradient = reference(p, eps, storage, device, tmp_path)
    settings = options(tmp_path, storage, device)
    result = StreamedSimulation(p, settings)(eps)
    _same(result.signals.detach(), signals, device)
    assert result.report['restart_reservation_bytes'] == 2 * (result.report['state_bytes'] + eps.numel() * eps.element_size())
    calls = interrupt(monkeypatch, 'transpose', transposes)
    with pytest.raises(Interrupted):
        torch.autograd.grad(result.signals.square().sum(), eps)
    monkeypatch.undo()
    assert calls[0] == transposes + 1
    latest = json.loads((tmp_path / 'journal' / 'latest-backward.json').read_text())
    assert latest['kind'] == 'backward' and latest['block'] == 5 - transposes
    resumed = StreamedSimulation(p, settings)(eps)
    assert resumed.report['forward_resumed_from_block'] == 'complete'
    _same(resumed.signals.detach(), signals, device)
    later, = torch.autograd.grad(resumed.signals.square().sum(), eps)
    assert resumed.report['backward_resumed_from_block'] == 5 - transposes
    _same(later, gradient, device)
    journal = tmp_path / 'journal'
    assert (journal / 'complete.json').exists() and not list(journal.glob('latest-*.json'))
    assert not [d for d in journal.iterdir() if d.is_dir()]
    if storage == 'disk':
        assert not list((tmp_path / 'scratch').iterdir())


@pytest.mark.parametrize('storage', ['host', 'disk'])
@pytest.mark.parametrize('forwards', [1, 3])
def test_forward_resumes_after_interrupt(tmp_path, monkeypatch, storage, forwards):
    p = scene()
    eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
    signals, gradient = reference(p, eps, storage, 'cpu', tmp_path)
    settings = options(tmp_path, storage)
    interrupt(monkeypatch, 'forward', forwards)
    with pytest.raises(Interrupted):
        StreamedSimulation(p, settings)(eps)
    monkeypatch.undo()
    latest = json.loads((tmp_path / 'journal' / 'latest-forward.json').read_text())
    assert latest['kind'] == 'forward' and latest['block'] == forwards
    resumed = StreamedSimulation(p, settings)(eps)
    assert resumed.report['forward_resumed_from_block'] == forwards
    torch.testing.assert_close(resumed.signals.detach(), signals, rtol=0, atol=0)
    later, = torch.autograd.grad(resumed.signals.square().sum(), eps)
    assert 'backward_resumed_from_block' not in resumed.report
    torch.testing.assert_close(later, gradient, rtol=0, atol=0)
    assert (tmp_path / 'journal' / 'complete.json').exists()


def test_every_blocks_controls_record_count(tmp_path):
    p = scene()
    eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
    result = StreamedSimulation(p, options(tmp_path, restart_every_blocks=2))(eps)
    torch.autograd.grad(result.signals.square().sum(), eps)
    # Forward records after blocks two and four plus the completion record.
    # Backward records after blocks three and one.
    assert result.report['journal_records_written'] == dict(forward=3, backward=2)
    assert result.report['journal_seconds'] > 0


def test_contract_and_signal_adjoint_mismatch_are_rejected(tmp_path, monkeypatch):
    p = scene()
    eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
    settings = options(tmp_path)
    result = StreamedSimulation(p, settings)(eps)
    interrupt(monkeypatch, 'transpose', 2)
    with pytest.raises(Interrupted):
        torch.autograd.grad(result.signals.square().sum(), eps)
    monkeypatch.undo()
    other = torch.full(p.region.shape, 1.71, dtype=torch.float64, requires_grad=True)
    with pytest.raises(ValueError, match='contract mismatch'):
        StreamedSimulation(p, settings)(other)
    resumed = StreamedSimulation(p, settings)(eps)
    with pytest.raises(ValueError, match='different signal adjoint'):
        torch.autograd.grad(resumed.signals.abs().sum(), eps)
    # The journal is intact after the rejected attempt and the original loss resumes.
    later, = torch.autograd.grad(resumed.signals.square().sum(), eps)
    assert resumed.report['backward_resumed_from_block'] == 3
    assert torch.isfinite(later).all()


def test_restart_journal_space_is_checked(tmp_path, monkeypatch):
    p = scene()
    eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
    monkeypatch.setattr('torchfdtd.state_store.disk_free', lambda _: 1024)
    with pytest.raises(ValueError, match='Restart journal reservation'):
        StreamedSimulation(p, options(tmp_path))(eps)
    assert not (tmp_path / 'journal').exists()


CHILD = '''
import sys, time, torch
sys.path.insert(0, sys.argv[1]); sys.path.insert(0, sys.argv[2])
from torchfdtd import StreamedSimulation, StreamedAdjointOptions
from torchfdtd.spacetime import SlabBlockOperator
from test_differentiable import project
original = SlabBlockOperator.transpose
def slow(self, *args, **kwargs):
    value = original(self, *args, **kwargs)
    time.sleep(0.4)
    return value
SlabBlockOperator.transpose = slow
p = project(steps=13)
eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
settings = StreamedAdjointOptions(device='cpu', slab_width=4, temporal_depth=3, checkpoints=1, local_checkpoints=1,
    state_storage='disk', state_directory=sys.argv[3], disk_budget_bytes=64*1024**2, restart_directory=sys.argv[4])
result = StreamedSimulation(p, settings)(eps)
torch.autograd.grad(result.signals.square().sum(), eps)
print('child finished without being killed', flush=True)
'''


def test_killed_process_is_resumed_by_a_new_process(tmp_path):
    p = scene()
    eps = torch.full(p.region.shape, 1.7, dtype=torch.float64, requires_grad=True)
    signals, gradient = reference(p, eps, 'disk', 'cpu', tmp_path)
    source = str(Path(torchfdtd.__file__).resolve().parents[1])
    tests = str(Path(__file__).resolve().parent)
    scratch, journal = tmp_path / 'scratch', tmp_path / 'journal'
    scratch.mkdir()
    child = subprocess.Popen([sys.executable, '-c', CHILD, source, tests, str(scratch), str(journal)],
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    deadline = time.time() + 120
    seen = None
    while time.time() < deadline and child.poll() is None:
        latest = journal / 'latest-backward.json'
        if latest.exists():
            try:
                seen = json.loads(latest.read_text())
            except (json.JSONDecodeError, OSError):
                seen = None
            if seen and seen['kind'] == 'backward' and seen['block'] <= 3:
                break
        time.sleep(0.05)
    assert child.poll() is None, child.stderr.read().decode('utf8', 'replace')[-2000:]
    child.kill()
    child.wait(timeout=60)
    assert child.returncode != 0
    # A killed process leaves its scratch banks behind; the journal survives.
    resumed = StreamedSimulation(p, options(tmp_path, 'disk'))(eps)
    assert resumed.report['forward_resumed_from_block'] == 'complete'
    later, = torch.autograd.grad(resumed.signals.square().sum(), eps)
    assert resumed.report['backward_resumed_from_block'] == seen['block']
    torch.testing.assert_close(resumed.signals.detach(), signals, rtol=0, atol=0)
    torch.testing.assert_close(later, gradient, rtol=0, atol=0)
    assert (journal / 'complete.json').exists()
