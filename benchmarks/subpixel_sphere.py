"""Equal-domain/time sphere-scattering checks for selectable interfaces.

Retain all requested cases, including cases where smoothing is less accurate.
Full wall time includes constitutive preparation and result construction.
This is an independent analytic-reference study, not a vendor comparison.
"""
import argparse
import json
from pathlib import Path
import time

from photonweave import Simulation
from examples.tfsf_sphere import make_project,evaluate


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--backend',choices=['cpu','cuda'],default='cuda')
    parser.add_argument('--meshes',type=float,nargs='+',default=[.1,.05,.025])
    parser.add_argument('--indices',type=float,nargs='+',default=[1.5,3.48])
    parser.add_argument('--translations',choices=['centered','shifted'],nargs='+',default=['centered','shifted'])
    parser.add_argument('--quadrature',type=int,default=8)
    parser.add_argument('--duration-fs',type=float,default=120.)
    parser.add_argument('--output',default='results/subpixel-sphere.json')
    args=parser.parse_args();cases=[];references=[]
    target=Path(args.output);target.parent.mkdir(parents=True,exist_ok=True)
    def save():
        target.write_text(json.dumps(dict(
            method='Matched empty-box reference and analytic Mie cross section. Fixed physical domain, PML thickness and duration across meshes. All requested cases retained. Single-run timings include preparation, without performance claims.',
            arguments=vars(args),references=references,cases=cases),indent=2,allow_nan=False)+'\n',encoding='utf-8')
    for mesh in args.meshes:
        base=make_project(mesh,args.backend,duration_fs=args.duration_fs)
        empty=base.model_copy(deep=True);empty.structures=[]
        started=time.perf_counter();reference=Simulation(empty).run()
        references.append(dict(mesh_um=mesh,wall_seconds=time.perf_counter()-started,summary=reference.summary))
        for index in args.indices:
            for translation in args.translations:
                center=(0.,0.,0.) if translation=='centered' else (.013,-.019,.007)
                for method in ('staircase','subpixel'):
                    p=base.model_copy(deep=True);p.materials[0].index=index;p.structures[0].center=center
                    p.region.interface_method=method;p.region.subpixel_quadrature=args.quadrature
                    started=time.perf_counter();sample=Simulation(p).run();wall=time.perf_counter()-started
                    row=evaluate(sample,reference,index=index)
                    row.update(mesh_um=mesh,index=index,translation=translation,center_um=list(center),interface_method=method,wall_seconds=wall)
                    cases.append(row);save()
                    print(json.dumps({k:row[k] for k in ('mesh_um','index','translation','interface_method','max_relative_error','wall_seconds')}),flush=True)


if __name__=='__main__':main()
