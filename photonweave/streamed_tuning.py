"""Measured, budget-constrained selection among streamed execution policies.

This is a bounded prefix experiment, not a globally optimal runtime model. The
selected policy must still pass admission when the full simulation is invoked.
"""
from dataclasses import dataclass, replace, asdict
import statistics
import time

import torch

from .streamed import StreamedAdjointOptions, StreamedSimulation, _reservation


@dataclass(frozen=True)
class StreamedTuning:
    options: StreamedAdjointOptions
    report: dict


def tune_streamed(project, epsilon, *, options=None, candidates=None, probe_steps=24, repeats=2):
    """Return a measured slab/K/transfer policy without changing design gradients.

    Costs include preparation, forward, checkpoint replay and backward over the
    same prefix for each candidate. An explicit candidate list allows checkpoint
    counts and buffer counts to vary. No NVMe or multi-GPU policy is inferred.
    """
    if isinstance(probe_steps,bool) or not isinstance(probe_steps,int) or not 10 <= probe_steps <= 256:
        raise ValueError('probe_steps must be an integer between 10 and 256.')
    if isinstance(repeats,bool) or not isinstance(repeats,int) or not 1 <= repeats <= 5:
        raise ValueError('repeats must be an integer between one and five.')
    if not isinstance(epsilon,torch.Tensor) or epsilon.device.type != 'cpu' or epsilon.dtype not in (torch.float32,torch.float64):
        raise ValueError('Tuning requires a real CPU epsilon tensor.')
    base = options or StreamedAdjointOptions()
    if candidates is None:
        n = project.region.shape[0]
        candidates = [replace(base, slab_width=min(n,width), temporal_depth=depth, tile_transfers='sync')
                      for width,depth in ((base.slab_width,1),(base.slab_width,base.temporal_depth),
                                         (2*base.slab_width,base.temporal_depth))]
        if torch.device(base.device).type == 'cuda' and base.reuse_tile_buffers:
            candidates.append(replace(base, slab_width=min(n,2*base.slab_width), tile_transfers='async', tile_buffers=2))
        candidates = list(dict.fromkeys(candidates))
    else:candidates = list(candidates)
    if not 1 <= len(candidates) <= 12 or not all(isinstance(p,StreamedAdjointOptions) for p in candidates):
        raise ValueError('Supply one to twelve StreamedAdjointOptions candidates.')
    if len({torch.device(p.device) for p in candidates}) != 1:
        raise ValueError('Compare policies on a single selected execution device.')
    started = time.perf_counter()
    prefix = project.model_copy(deep=True)
    prefix.region.steps = min(project.region.steps,probe_steps)
    design = epsilon.detach().requires_grad_()
    reference = None
    records, feasible = [], []
    # The tuner holds a reference signal/gradient while evaluating later modes.
    extra = 2*epsilon.numel()*epsilon.element_size()+2*prefix.region.steps*sum(m.enabled for m in project.monitors)*epsilon.element_size()
    for index,policy in enumerate(candidates):
        row = dict(index=index, policy=asdict(policy))
        try:
            if policy.host_budget_bytes <= extra:raise ValueError('Host budget cannot hold tuning reference buffers.')
            admitted = replace(policy,host_budget_bytes=policy.host_budget_bytes-extra)
            # Check the real duration's source/output storage, not only the prefix.
            reservation = _reservation(project,epsilon,admitted)
        except ValueError as exc:
            row.update(status='rejected',reason=str(exc))
            records.append(row)
            continue
        model = StreamedSimulation(prefix,admitted)
        samples = []
        for repeat in range(repeats+1):
            before = time.perf_counter()
            result = model(design)
            gradient, = torch.autograd.grad(result.signals.square().sum(),design)
            elapsed = time.perf_counter()-before
            values = result.signals.detach()
            if reference is None:reference = (values.clone(),gradient.clone())
            tolerance = dict(rtol=5e-5,atol=2e-6) if epsilon.dtype == torch.float32 else dict(rtol=1e-9,atol=1e-11)
            torch.testing.assert_close(values,reference[0],**tolerance)
            torch.testing.assert_close(gradient,reference[1],**tolerance)
            if repeat:samples.append(elapsed)
            del result, gradient, values
        row.update(status='measured',seconds=samples,median_seconds=statistics.median(samples),reservation=reservation)
        records.append(row)
        feasible.append((row['median_seconds'],index))
    if not feasible:raise ValueError('No streamed tuning candidate fits the full-workload memory budgets.')
    _, selected = min(feasible)
    device = torch.device(candidates[selected].device)
    report = dict(selected_index=selected, candidates=records, probe_steps=prefix.region.steps,
                  full_steps=project.region.steps, warmups_per_candidate=1,repeats=repeats,
                  tuning_seconds=time.perf_counter()-started,tuning_reference_reservation_bytes=extra,
                  torch_version=torch.__version__,device=str(device),
                  hardware=torch.cuda.get_device_name(device) if device.type == 'cuda' else 'CPU',
                  scope='Fastest measured equivalent prefix among admitted candidates. Full-duration optimality, overlap utilization, resident-vs-streamed selection and SSD policies are not established.')
    return StreamedTuning(candidates[selected],report)
