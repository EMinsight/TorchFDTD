"""Measured resident/streamed adjoint selection with a common CPU design API."""
from dataclasses import dataclass, replace
import math

import torch

from .adjoint_memory import estimate_adjoint_memory
from .differentiable import AdjointOptions, DifferentiableSimulation
from .memory_profile import host_memory
from .streamed import StreamedAdjointOptions, StreamedSimulation
from .streamed_tuning import (_TuningWorkload, _DispersiveTuningWorkload,
                             _generated_candidates, _tune_streamed, _validate_tuning_arguments)


@dataclass(frozen=True)
class AdjointExecutionPolicy:
    """One explicit execution candidate. host_budget_bytes bounds solver RAM.

    CPU caller inputs and geometry/optimizer graphs remain outside the budget.
    Exactly one of resident or streamed must be supplied. Resident CUDA uses
    differentiable input/output copies so both modes expose CPU design tensors.
    """
    resident: AdjointOptions | None = None
    streamed: StreamedAdjointOptions | None = None
    device: str = 'cuda'
    host_budget_bytes: int = 8*1024**3

    def __post_init__(self):
        if (self.resident is None)==(self.streamed is None):
            raise ValueError('Supply exactly one resident or streamed execution policy.')
        if self.resident is not None and not isinstance(self.resident,AdjointOptions):
            raise ValueError('resident must be AdjointOptions.')
        if self.streamed is not None and not isinstance(self.streamed,StreamedAdjointOptions):
            raise ValueError('streamed must be StreamedAdjointOptions.')
        if torch.device(self.device).type not in ('cpu','cuda'):
            raise ValueError('Execution selection supports CPU or CUDA.')
        if self.streamed is not None and torch.device(self.streamed.device)!=torch.device(self.device):
            raise ValueError('Streamed policy must use the selected execution device.')
        if isinstance(self.host_budget_bytes,bool) or not isinstance(self.host_budget_bytes,int) or self.host_budget_bytes<1:
            raise ValueError('host_budget_bytes must be a positive integer.')

    @property
    def temporal_depth(self):return 1 if self.resident is not None else self.streamed.temporal_depth

    @property
    def checkpoints(self):return (self.resident or self.streamed).checkpoints

    def simulation(self,project,*,dispersive=False):
        if self.resident is not None:return _ResidentFromHost(project,self,dispersive)
        model=StreamedSimulation
        if dispersive:
            from .streamed_dispersive import StreamedDispersiveSimulation
            model=StreamedDispersiveSimulation
        return model(project,_streamed_options(self))


def _streamed_options(policy):
    return replace(policy.streamed,host_budget_bytes=min(policy.host_budget_bytes,policy.streamed.host_budget_bytes))


def _resident_project(project):
    # The original project may opt into large streamed grids. Retain the actual
    # resident cell guard when considering this candidate, rather than removing it.
    project=project.model_copy(deep=True)
    project.region.memory_mode='resident'
    project.region.require_resident()
    return project


def _resident_reservation(project,shapes,policy,frequency_hz=None,window=None,block_size=32):
    project=_resident_project(project)
    if shapes[0] not in (project.region.shape,project.region.shape+(3,)):
        raise ValueError('epsilon shape must match the grid, optionally with three components.')
    settings=dict(device=policy.device,frequency_hz=frequency_hz,window=window,block_size=block_size)
    if len(shapes)==4:settings['parameter_shapes']=shapes
    result=estimate_adjoint_memory(project,policy.resident,**settings)
    item=8 if project.region.precision=='float64' else 4
    parameters=sum(math.prod(shape) for shape in shapes)*item
    output=result.get('spectral_output_bytes',result['output_history_bytes'])
    cuda=torch.device(policy.device).type=='cuda'
    # Inputs copied to CUDA and their incoming gradients coexist with the
    # solver. CPU output/gradient copies must also fit outside caller storage.
    gpu_copy=2*parameters if cuda else 0
    host_copy=2*parameters+2*output if cuda else 0
    gpu=result['gpu_reservation_bytes']+gpu_copy
    host=result['host_reservation_bytes']+host_copy
    available=host_memory()['available_bytes']
    limit=policy.host_budget_bytes
    if available is not None:limit=min(limit,int(available*.8))
    if host>limit:raise ValueError('Resident solver and transfer reservation exceed the unified host budget.')
    if cuda:
        free,_=torch.cuda.mem_get_info(torch.device(policy.device))
        limit=min(int(free*.8),policy.resident.gpu_budget_bytes or int(free*.8))
        if gpu>limit:raise ValueError('Resident solver and transfer reservation exceed the GPU budget.')
    return dict(result,host_reservation_bytes=host,gpu_reservation_bytes=gpu,
                host_transfer_reservation_bytes=host_copy,gpu_transfer_reservation_bytes=gpu_copy)


class _ResidentFromHost(torch.nn.Module):
    def __init__(self,project,policy,dispersive):
        super().__init__()
        self.project=_resident_project(project)
        self.policy,self.dispersive=policy,dispersive
        model=DifferentiableSimulation
        if dispersive:
            from .dispersive_adjoint import DispersiveSimulation
            model=DispersiveSimulation
        self.model=model(self.project,policy.resident)

    def _run(self,values,frequency_hz=None,window=None,block_size=32):
        if len(values)!=(4 if self.dispersive else 1):raise ValueError('Wrong number of material inputs.')
        epsilon=values[0]
        if not isinstance(epsilon,torch.Tensor) or epsilon.device.type!='cpu' or epsilon.dtype not in (torch.float32,torch.float64):
            raise ValueError('Unified execution requires real CPU design tensors.')
        if (epsilon.dtype==torch.float64)!=(self.project.region.precision=='float64'):
            raise ValueError('epsilon dtype must match the project precision.')
        for value in values:
            if isinstance(value,torch.Tensor) and (value.device.type!='cpu' or value.dtype!=epsilon.dtype):
                raise ValueError('Material tensors must match epsilon CPU device and dtype.')
        values=tuple(torch.as_tensor(v,dtype=epsilon.dtype,device='cpu') for v in values)
        shapes=tuple(tuple(v.shape) for v in values)
        reservation=_resident_reservation(self.project,shapes,self.policy,frequency_hz,window,block_size)
        # Do not detach: copies are part of the user's geometry-to-loss graph.
        copied=tuple(v.to(self.policy.device) for v in values)
        if frequency_hz is None:
            result=self.model(*copied)
            result=replace(result,signals=result.signals.cpu())
        else:
            result=self.model.spectrum(*copied,frequency_hz,window=window,block_size=block_size)
            result=replace(result,fields=result.fields.cpu(),frequency_hz=result.frequency_hz.cpu())
        result.report.update(unified_execution='resident',host_input_interface=True,
                             execution_reservation=reservation)
        return result

    def forward(self,*values):return self._run(values)

    def spectrum(self,*values,frequency_hz=None,window=None,block_size=32):
        if frequency_hz is None:
            if len(values)!=(5 if self.dispersive else 2):raise ValueError('Provide materials followed by frequency_hz.')
            values,frequency_hz=values[:-1],values[-1]
        return self._run(values,frequency_hz,window,block_size)


class _ExecutionWorkload:
    def __init__(self,workload):self.workload=workload

    def __getattr__(self,name):return getattr(self.workload,name)

    def reservation(self,policy):
        if policy.streamed is not None:return self.workload.reservation(_streamed_options(policy))
        spectral=self.workload.spectral
        return _resident_reservation(self.workload.project,
            tuple(tuple(v.shape) for v in self.workload.design),policy,
            None if spectral is None else spectral.frequency,
            None if spectral is None else spectral.window)

    def model(self,project,policy):
        return policy.simulation(project,dispersive=isinstance(self.workload,_DispersiveTuningWorkload))


@dataclass(frozen=True)
class AdjointExecutionSelection:
    policy: AdjointExecutionPolicy
    report: dict
    dispersive: bool

    def simulation(self,project):return self.policy.simulation(project,dispersive=self.dispersive)


def tune_adjoint_execution(project,epsilon,*material_parameters,options=None,candidates=None,
        frequency_hz=None,window=None,probe_steps=24,repeats=2,max_calibration_steps=512,
        refine_candidates=0,reference_cache_bytes=64*1024**2):
    """Compare resident and streamed full-iteration cost under shared budgets.

    Supply epsilon only, or epsilon_inf, strength, omega0 and gamma for ADE.
    Defaults combine generated streamed policies with device/host resident
    checkpoints. Input and result tensors remain on CPU with intact gradients.
    Tuning uses detached leaves and a proxy energy objective, never modifies
    caller .grad, and does not establish a globally optimal execution policy.
    File banks require explicit streamed directory, budget and headroom settings.
    """
    if len(material_parameters) not in (0,3):raise ValueError('Supply epsilon or four ADE material inputs.')
    _validate_tuning_arguments(probe_steps,repeats,'replay_cost',max_calibration_steps,
                               refine_candidates,reference_cache_bytes)
    if candidates is None and options is not None and not isinstance(options,StreamedAdjointOptions):
        raise ValueError('Default execution proposals require StreamedAdjointOptions budgets.')
    workload=(_DispersiveTuningWorkload(project,epsilon,*material_parameters,frequency_hz,window)
              if material_parameters else _TuningWorkload(project,epsilon,frequency_hz,window))
    planning=[]
    if candidates is None:
        base=options or StreamedAdjointOptions()
        streamed,planning=_generated_candidates(project,workload,base,reference_cache_bytes,max_calibration_steps)
        device=base.device
        kernel='fused' if torch.device(device).type=='cuda' else 'torch'
        resident=AdjointOptions(checkpoints=base.checkpoints,backward_kernel=kernel,
            gpu_budget_bytes=base.gpu_budget_bytes,host_budget_bytes=base.host_budget_bytes)
        residents=[resident,replace(resident,checkpoints=0)]
        if torch.device(device).type=='cuda':
            residents.append(replace(resident,storage='host',checkpoint_transfers='async'))
        candidates=[AdjointExecutionPolicy(resident=p,device=device,host_budget_bytes=base.host_budget_bytes)
                    for p in dict.fromkeys(residents)]
        candidates.extend(AdjointExecutionPolicy(streamed=p,device=device,host_budget_bytes=base.host_budget_bytes)
                          for p in streamed)
    tuned=_tune_streamed(project,_ExecutionWorkload(workload),candidates=candidates,
        probe_steps=probe_steps,repeats=repeats,max_calibration_steps=max_calibration_steps,
        refine_candidates=refine_candidates,reference_cache_bytes=reference_cache_bytes,
        _policy_type=AdjointExecutionPolicy)
    tuned.report.update(default_candidate_planning=planning,
        scope='Measured resident and streamed prefixes with checkpoint-replay extrapolation. CPU-to-device design and CPU-result copies are included for resident CUDA. Full-duration optimality, geometry/optimizer cost, microbatch budgeting, multi-GPU and sustained physical-storage performance are not established.')
    return AdjointExecutionSelection(tuned.options,tuned.report,bool(material_parameters))
