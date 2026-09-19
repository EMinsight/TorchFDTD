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
    with torch.no_grad():
        tuned = tune_streamed(p,epsilon,candidates=candidates,probe_steps=10,repeats=1)
    assert tuned.report['candidates'][0]['status'] == 'rejected'
    assert tuned.options in candidates[1:]
    assert tuned.report['probe_steps'] == 10 and p.region.steps == 13
    assert tuned.report['calibration_steps'] == [10,13]
    assert tuned.report['candidates'][tuned.report['selected_index']]['prediction']['method'] == 'measured full duration'
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
    with torch.inference_mode(),pytest.raises(ValueError,match='inference_mode'):
        tune_streamed(p,epsilon)


def test_deep_default_search_compares_local_replay_without_mutating_design():
    p = project(steps=17,periodic=True)
    epsilon = torch.full(p.region.shape,1.7,dtype=torch.float64,requires_grad=True)
    options = StreamedAdjointOptions(device='cpu',slab_width=4,temporal_depth=8)
    tuned = tune_streamed(p,epsilon,options=options,probe_steps=10,repeats=1)
    measured = [row for row in tuned.report['candidates'] if row['status']=='measured']
    assert {row['policy']['local_checkpoints'] for row in measured} == {0,1}
    assert epsilon.grad is None
    assert tuned.options.local_checkpoints in (0,1)
