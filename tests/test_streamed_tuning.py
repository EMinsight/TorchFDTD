from dataclasses import replace

import pytest
import torch

from photonweave import StreamedAdjointOptions, StreamedSimulation, DifferentiableSimulation, tune_streamed
from test_differentiable import project


def test_tuning_preserves_design_and_selects_full_duration_policy():
    p = project(steps=13, periodic=True)
    epsilon = torch.full(p.region.shape,1.7,dtype=torch.float64,requires_grad=True)
    epsilon.grad = torch.full_like(epsilon,3.)
    original = epsilon.detach().clone()
    base = StreamedAdjointOptions(device='cpu',slab_width=4,temporal_depth=2)
    candidates = [replace(base,host_budget_bytes=1), base, replace(base,slab_width=6,temporal_depth=3)]
    tuned = tune_streamed(p,epsilon,candidates=candidates,probe_steps=10,repeats=1)
    assert tuned.report['candidates'][0]['status'] == 'rejected'
    assert tuned.options in candidates[1:]
    assert tuned.report['probe_steps'] == 10 and p.region.steps == 13
    torch.testing.assert_close(epsilon,original,rtol=0,atol=0)
    torch.testing.assert_close(epsilon.grad,torch.full_like(epsilon,3.),rtol=0,atol=0)
    result = StreamedSimulation(p,tuned.options)(epsilon)
    reference = DifferentiableSimulation(p).reference(epsilon)
    assert result.signals.shape[0] == 13
    torch.testing.assert_close(result.signals,reference,rtol=1e-11,atol=1e-12)


def test_tuner_rejects_empty_or_inadmissible_search():
    p = project(steps=10)
    epsilon = torch.ones(p.region.shape,dtype=torch.float64)
    with pytest.raises(ValueError,match='one to twelve'):tune_streamed(p,epsilon,candidates=[])
    with pytest.raises(ValueError,match='No streamed'):
        tune_streamed(p,epsilon,candidates=[StreamedAdjointOptions(device='cpu',host_budget_bytes=1)])
