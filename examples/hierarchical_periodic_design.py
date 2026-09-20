"""Synthetic density optimization with budgeted two-polarization FDTD.

This small example demonstrates the graph and placement API. It is not the
private CR study, a converged photonic design or a performance measurement.
"""
import argparse
import json

import torch

from photonweave import (AdjointBatchOptions, AdjointExecutionPolicy, AdjointOptions,
    PeriodicLayerResponse, PlaneReferenceCache, StreamedAdjointOptions)


def main(argv=None):
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--device',choices=['cpu','cuda'],default='cpu')
    parser.add_argument('--execution',choices=['resident','dram'],default='resident')
    parser.add_argument('--iterations',type=int,default=2)
    args=parser.parse_args(argv)
    if args.iterations<1:raise ValueError('iterations must be positive')
    torch.set_num_threads(4)
    budget=2*1024**3
    if args.execution=='resident':
        policy=AdjointExecutionPolicy(device=args.device,host_budget_bytes=budget,
            resident=AdjointOptions(checkpoints=2,gpu_budget_bytes=budget,host_budget_bytes=budget,
                resident_budget_bytes=budget,backward_kernel='fused' if args.device=='cuda' else 'torch'))
    else:
        policy=AdjointExecutionPolicy(device=args.device,host_budget_bytes=budget,
            streamed=StreamedAdjointOptions(device=args.device,slab_width=4,temporal_depth=4,
                gpu_budget_bytes=budget,host_budget_bytes=budget,
                tile_transfers='async' if args.device=='cuda' else 'sync'))
    spec=dict(wavelength_um=.5,background_index=1.4,design_index=1.8,period_um=(.8,.8),
        height_um=.2,detector_offset_um=.5,theta_inside_rad=.1,phi_rad=.3)
    model=PeriodicLayerResponse(spec,density_shape=(4,4),policy=policy,
        batch_options=AdjointBatchOptions(host_budget_bytes=budget,gpu_budget_bytes=budget),
        mesh=.1,steps=160,pml_cells=6,quadrature_counts=(4,4),reference_cache=PlaneReferenceCache(1024**2))
    plan=model.plan()
    logits=torch.linspace(-.7,.7,16,dtype=torch.float32).reshape(4,4).requires_grad_()
    optimizer=torch.optim.Adam([logits],lr=.03)
    history=[]
    for _ in range(args.iterations):
        optimizer.zero_grad(set_to_none=True)
        response=model(logits.sigmoid())
        # Couple polarizations before selecting a synthetic detector objective.
        mean=response.mean(0)
        loss=-mean[0]+.2*(response[0]-response[1]).square().sum()
        loss.backward()
        if not torch.isfinite(logits.grad).all():raise RuntimeError('Nonfinite design gradient')
        history.append(dict(loss=float(loss.detach()),gradient_l2=float(logits.grad.norm()),
                            mean_response=mean.detach().tolist()))
        optimizer.step()
    result=dict(scope=__doc__,device=args.device,execution=args.execution,history=history,
        final_density=logits.detach().sigmoid().tolist(),plan=plan,last_execution=model.last_report)
    print(json.dumps(result,indent=2))
    return result


if __name__=='__main__':main()
