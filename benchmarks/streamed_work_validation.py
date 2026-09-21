"""Validate metadata policy selection against bounded real CUDA file-bank work.

No speed ranking. Each policy runs once, including its cold setup. Logical file
traffic does not measure physical disk/PCIe traffic or OS cache memory.
"""
from dataclasses import asdict,replace
import argparse
import hashlib
import json
from pathlib import Path
import tempfile
import time

import torch

from torchfdtd import (BoundaryFace,Monitor,Project,Region,Source,
    StreamedAdjointOptions,StreamedSimulation,estimate_streamed_work,plan_streamed_work)


def scene(shape=(64,32,32)):
    region=Region(dimension='3d',size=tuple(n*.1 for n in shape),mesh=.1,steps=10,
        precision='float32',pml_cells=3,memory_mode='streamed',cuda_kernel='fused')
    region.boundaries.x_min=region.boundaries.x_max=BoundaryFace(kind='periodic')
    return Project(region=region,sources=[Source(pulse='continuous',center=(0,0,0))],
        monitors=[Monitor(center=(.1,0,0)),Monitor(center=(0,.1,0),component='Hy')])


def compare(a,b):
    a,b=a.detach().double(),b.detach().double()
    return float((a-b).norm()/b.norm().clamp_min(1e-30))


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,default=Path('results/streamed-work-validation.json'))
    parser.add_argument('--scratch',type=Path,required=True)
    args=parser.parse_args()
    if not torch.cuda.is_available():raise SystemExit('A CUDA device is required.')
    torch.set_num_threads(1)
    root=Path(__file__).resolve().parents[1]
    files=sorted((root/'torchfdtd').glob('*.py'))
    hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
    args.scratch.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='work-validation-',dir=args.scratch) as scratch:
        base=StreamedAdjointOptions(device='cuda',slab_width=4,temporal_depth=2,
            checkpoints=0,local_checkpoints=0,state_storage='disk',state_directory=scratch,
            disk_budget_bytes=128*1024**2,disk_free_reserve_bytes=2*1024**3,
            host_budget_bytes=512*1024**2,gpu_budget_bytes=512*1024**2)
        deeper=replace(base,temporal_depth=4)
        project=scene()
        plan=plan_streamed_work(project,base,candidates=[base,deeper],
            host_free_reserve_bytes=2*1024**3,selection='min_disk_traffic')
        if plan.options!=deeper:raise AssertionError(plan.report)
        epsilon=torch.full(project.region.shape,1.6,requires_grad=True)
        results=[];reference=None
        for name,policy in (('manual',base),('selected',plan.options)):
            predicted=estimate_streamed_work(project,policy)
            started=time.perf_counter()
            result=StreamedSimulation(project,policy)(epsilon)
            gradient,=torch.autograd.grad(result.signals.square().sum(),epsilon)
            elapsed=time.perf_counter()-started
            observed={}
            for phase in ('forward','backward'):
                bank=result.report[phase+'_backing_store']
                if not bank['closed'] or bank['live_logical_file_bytes']:
                    raise AssertionError('File bank did not close')
                for metric,field in (('read','logical_read_bytes'),('write','logical_written_bytes')):
                    key=phase+'_state_'+metric+'_bytes';observed[key]=bank[field]
                    if predicted[key]!=bank[field]:raise AssertionError((name,key,predicted[key],bank[field]))
            observed['total_state_io_bytes']=sum(observed.values())
            for key,path in (('global_replayed_blocks',('replayed_blocks',)),
                             ('local_replayed_steps',('backward_workspace','local_replayed_steps'))):
                value=result.report
                for part in path:value=value[part]
                if predicted[key]!=value:raise AssertionError((name,key,predicted[key],value))
            if not bool(torch.isfinite(gradient).all()) or not float(gradient.norm())>0:
                raise AssertionError('Invalid material gradient')
            errors=None
            if reference is None:reference=(result.signals.detach().clone(),gradient.detach().clone())
            else:
                errors=dict(signals_relative_l2=compare(result.signals,reference[0]),gradient_relative_l2=compare(gradient,reference[1]))
                if max(errors.values())>2e-4:raise AssertionError(errors)
            options=asdict(policy);options['state_directory']='<temporary validation directory>'
            results.append(dict(name=name,options=options,predicted=predicted,observed=observed,
                comparison_to_manual=errors,wall_seconds_including_setup=elapsed,
                host_reservation_bytes=result.report['host_reservation_bytes'],
                gpu_reservation_bytes=result.report['gpu_reservation_bytes']))
            if list(Path(scratch).iterdir()):raise AssertionError('Residual field banks')
            del result,gradient
    for path in files:
        if hashlib.sha256(path.read_bytes()).hexdigest()!=hashes[path.name]:raise AssertionError('Runtime changed during validation')
    report=plan.report
    for row in report['candidates']:row['options']['state_directory']='<temporary validation directory>'
    record=dict(status='passed',scope='Small real FP32 CUDA correctness and logical-work integration, not capacity or speed evidence.',
        hardware=torch.cuda.get_device_name(),torch_version=torch.__version__,grid=list(project.region.shape),steps=project.region.steps,
        planner=report,policies=results,source_sha256=hashes,
        logical_file_traffic_ratio=results[1]['observed']['total_state_io_bytes']/results[0]['observed']['total_state_io_bytes'])
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_bytes((json.dumps(record,indent=2)+'\n').encode())
    print(json.dumps(dict(status='passed',logical_file_traffic_ratio=record['logical_file_traffic_ratio'],
        numerical_errors=results[1]['comparison_to_manual'],output=str(args.output))))


if __name__=='__main__':main()
