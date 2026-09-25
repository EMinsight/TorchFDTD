"""Bounded, symmetric subpixel constitutive operator on a rectangular Yee grid.

Analytic edge integrals and quadrature over dual faces define local tensors.
Eight edge-triplet permutations assemble a global Hermitian positive operator.
Each tensor is spectrally bounded by the constituent inverse permittivities,
so the vacuum rectangular CFL remains a conservative bound in the lossless
periodic problem. CPML and device accuracy are validated separately.

Method context: Werner, Bauer and Cary, JCP 250, 2013 (arXiv:1212.4857).
Geometry, spectral bounding and implementation here are independently written.
Samples whose cell meets a dispersive object leave this operator: their edge
triplets are dropped and torchfdtd.subpixel_dispersive gives them a diagonal
sample-wise passive Lorentz medium, so the operator stays block diagonal.
"""
from dataclasses import dataclass
from itertools import product
import time
import weakref

import numpy as np
import torch

from .subpixel_geometry import DielectricGeometry


def interface_tensor(line_inverse,face_epsilon,normal,epsilon_bounds):
    """Symmetric edge/dual-face inverse tensor, bounded in Loewner order."""
    eye=np.eye(3);nn=normal[:,:,None]*normal[:,None,:]
    gamma=eye+(line_inverse-1)[:,:,None]*nn
    inv=1/face_epsilon
    # Sherman-Morrison inverse of diag(face_epsilon)*(I-nn') + nn'.
    u=(inv-1)*normal;v=inv*normal;den=1+np.sum(u*normal,axis=1)
    pi_inverse=inv[:,:,None]*eye-u[:,:,None]*v[:,None,:]/den[:,None,None]
    raw=gamma@pi_inverse;raw=(raw+raw.transpose(0,2,1))*.5
    eigen,axes=np.linalg.eigh(raw)
    lower,upper=1/epsilon_bounds[1],1/epsilon_bounds[0]
    limited=np.clip(eigen,lower,upper)
    clipped=np.any(abs(eigen-limited)>1e-12*upper,axis=1)
    # Preserve exact entries for already-bounded tensors, including aligned
    # layers, instead of introducing unnecessary eigenvector roundoff.
    result=raw.copy()
    result[clipped]=(axes[clipped]*limited[clipped,None,:])@axes[clipped].transpose(0,2,1)
    return result,clipped


@dataclass
class SubpixelPlan:
    diagonal: np.ndarray
    rows: np.ndarray
    columns: np.ndarray
    values: np.ndarray
    ownership: np.ndarray
    counts: dict
    metadata: dict
    dispersive: object = None

    @property
    def epsilon(self):return 1/self.diagonal

    def apply(self,field):
        result=self.diagonal*field
        result.reshape(-1)[self.rows]+=np.sum(self.values*field.reshape(-1)[self.columns],axis=1)
        return result


def prepare_interfaces(project):
    if project.region.interface_method!='subpixel':return None
    from scipy.sparse import coo_matrix
    from .solver import _voxelize_at,field_axes
    started=time.perf_counter();r=project.region;geometry=DielectricGeometry(project)
    parts=[_voxelize_at(project,field_axes(r,c),True) for c in ('Ex','Ey','Ez')]
    diagonal=np.stack([1/p[0].astype(float) for p in parts],axis=-1)
    baseline=diagonal.reshape(-1).copy();ownership=np.stack([p[2] for p in parts],axis=-1)
    from .subpixel_dispersive import prepare_dispersive
    dispersive=prepare_dispersive(project,ownership)
    # Every sample of a dispersive medium leaves the coupled operator, including round-off couplings inside it.
    blocked=np.isin(ownership.reshape(-1),[i for i,m in enumerate(project.materials) if m.oscillators])
    if dispersive is not None:blocked[dispersive.touched]=True
    counts={key:max(p[1].get(key,0) for p in parts) for key in parts[0][1]}
    shape=np.array(r.shape);steps=np.array([v[1]-v[0] for v in r.mesh_nodes]);dim=geometry.dim
    node_shape=tuple(int(shape[a]) if a in geometry.periodic or a>=dim else int(shape[a]+1) for a in range(3))
    radius=np.linalg.norm(steps[:dim]);node_ids=[];positions=[];normals=[]
    for start in range(0,int(np.prod(node_shape)),32768):
        flat=np.arange(start,min(start+32768,int(np.prod(node_shape))))
        coords=np.stack(np.unravel_index(flat,node_shape),axis=1)
        points=np.column_stack([r.mesh_nodes[a][coords[:,a]] if a<dim else np.zeros(len(coords)) for a in range(3)])
        n,mask=geometry.normals_and_candidates(points,radius)
        if np.any(mask):node_ids.append(coords[mask]);positions.append(points[mask]);normals.append(n[mask])
    all_rows=[];all_cols=[];all_values=[];clipped_count=0;triplet_count=0;degenerate=0
    candidate_count=sum(map(len,positions))
    if candidate_count:
        node_ids=np.concatenate(node_ids);positions=np.concatenate(positions);normals=np.concatenate(normals)
        for start in range(0,candidate_count,512):
            nodes=node_ids[start:start+512];points=positions[start:start+512];normal=normals[start:start+512];m=len(points)
            degenerate+=int(np.count_nonzero(np.linalg.norm(normal,axis=1)<.5))
            line=np.empty((3,2,m));face=np.empty_like(line)
            for a in range(3):
                for sign in range(2):
                    p=points.copy()
                    if a<dim:p[:,a]+=(.5 if sign==0 else -.5)*steps[a]
                    line[a,sign]=geometry.line_average(p,a,steps[a],inverse=True)
                    face[a,sign]=geometry.face_average(p,a,steps,r.subpixel_quadrature,normal)
            for signs in product((0,1),repeat=3):
                inv=np.column_stack([line[a,s] for a,s in enumerate(signs)])
                eps=np.column_stack([face[a,s] for a,s in enumerate(signs)])
                tensor,clipped=interface_tensor(inv,eps,normal,geometry.epsilon_bounds)
                clipped_count+=int(np.count_nonzero(clipped));triplet_count+=m
                indices=[];valid=[];phases=[]
                for a,s in enumerate(signs):
                    edge=nodes.copy()
                    if a<dim:edge[:,a]-=s
                    good=np.ones(m,bool);phase=np.ones(m,complex)
                    for b in range(3):
                        if b in geometry.periodic:
                            turns=np.floor_divide(edge[:,b],shape[b]);phase*=np.exp(1j*turns*r.bloch_phase[b]);edge[:,b]%=shape[b]
                        else:good&=(edge[:,b]>=0)&(edge[:,b]<shape[b]);edge[:,b]=np.clip(edge[:,b],0,shape[b]-1)
                    indices.append(np.ravel_multi_index(edge.T,r.shape)*3+a);valid.append(good);phases.append(phase)
                touched=np.any([v&blocked[i] for v,i in zip(valid,indices)],axis=0)
                valid=[v&~touched for v in valid]
                for a in range(3):
                    mask=valid[a];idx=indices[a][mask]
                    np.add.at(diagonal.reshape(-1),idx,(tensor[mask,a,a]-baseline[idx])/8)
                    for b in range(3):
                        if a==b:continue
                        mask=valid[a]&valid[b]&(tensor[:,a,b]!=0)
                        if not np.any(mask):continue
                        value=tensor[mask,a,b]/8
                        if r.complex_fields:value=value*np.conj(phases[a][mask])*phases[b][mask]
                        all_rows.append(indices[a][mask]);all_cols.append(indices[b][mask]);all_values.append(value)
    size=int(np.prod(shape))*3
    if dispersive is not None:
        diagonal.reshape(-1)[dispersive.indices]=1/dispersive.epsilon
        diagonal.reshape(-1)[dispersive.full]=1/dispersive.full_epsilon
        ownership.reshape(-1)[dispersive.indices]=-1
        ownership.reshape(-1)[dispersive.full]=dispersive.owners
    if all_rows:
        sparse=coo_matrix((np.concatenate(all_values),(np.concatenate(all_rows),np.concatenate(all_cols))),shape=(size,size)).tocsr()
        sparse.eliminate_zeros();length=np.diff(sparse.indptr);rows=np.flatnonzero(length)
        if np.max(length,initial=0)>8:raise RuntimeError('Unexpected subpixel stencil width.')
        columns=np.zeros((len(rows),8),np.int32);values=np.zeros((len(rows),8),complex if r.complex_fields else float)
        for k,row in enumerate(rows):
            lo,hi=sparse.indptr[row:row+2];columns[k,:hi-lo]=sparse.indices[lo:hi];values[k,:hi-lo]=sparse.data[lo:hi]
    else:rows=np.empty(0,np.int64);columns=np.empty((0,8),np.int32);values=np.empty((0,8),complex if r.complex_fields else float)
    real_bytes=8 if r.precision=='float64' else 4;field_bytes=real_bytes*(2 if r.complex_fields else 1)
    memory=rows.nbytes+columns.nbytes+values.size*field_bytes+size*field_bytes
    metadata=dict(method='bounded_symmetric_edge_face',quadrature=r.subpixel_quadrature,
                  candidate_nodes=candidate_count,coupled_edges=len(rows),triplets=triplet_count,
                  spectrally_bounded_triplets=clipped_count,degenerate_normals=degenerate,
                  inverse_epsilon_bounds=[1/geometry.epsilon_bounds[1],1/geometry.epsilon_bounds[0]],
                  auxiliary_device_bytes=memory,preparation_seconds=time.perf_counter()-started,
                  epsilon_image='Reciprocal diagonal of the global inverse constitutive operator. Off-diagonal terms also act on fields.'
                  +(' Samples of mixed dispersive cells show their epsilon-infinity; their poles act through the ADE.' if dispersive is not None else ''))
    if dispersive is not None:metadata['dispersive']=dispersive.metadata
    return SubpixelPlan(diagonal,rows,columns,values,ownership,counts,metadata,dispersive)


class SubpixelState:
    def __init__(self,grid,plan):
        self._grid=weakref.ref(grid)
        if grid.is_torch:
            self.rows=torch.as_tensor(plan.rows,device=grid.E.device,dtype=torch.int64)
            self.columns=torch.as_tensor(plan.columns,device=grid.E.device,dtype=torch.int32)
            self.values=torch.as_tensor(plan.values,device=grid.E.device,dtype=grid.E.dtype)
            grid.inverse_permittivity[:]=torch.as_tensor(plan.diagonal,device=grid.E.device,dtype=grid.E.real.dtype)
        else:
            self.rows=plan.rows;self.columns=plan.columns;self.values=plan.values.astype(grid.E.dtype)
            grid.inverse_permittivity[:]=plan.diagonal
        self.curl_buffer=grid._zeros(grid.E.shape)
        grid.memory_states.append(self.curl_buffer)

    @property
    def grid(self):return self._grid()

    def add(self,curl):
        if not len(self.rows):return
        values=curl.reshape(-1)[self.columns]
        correction=(self.values*values).sum(axis=1)*self.grid.courant_number
        self.grid.E.reshape(-1)[self.rows]+=correction


def configure_interfaces(grid,plan):
    grid.subpixel=SubpixelState(grid,plan) if plan is not None else None
    if plan is not None and plan.dispersive is not None and len(plan.dispersive.indices):
        from .subpixel_dispersive import InterfaceADE
        grid.material_states.append(InterfaceADE(grid,plan.dispersive))
