"""Dispersive subpixel interfaces: the diagonal inverse Kottke tensor with dispersive averages.

An electric Yee sample averages over the cell of one mesh step per axis centred
on it. When that cell holds a fraction f of one single-pole medium
eps_m(w) = eps_inf + s/(w0^2 - w^2 - i g w) and nondispersive media elsewhere,
the tangential and normal averages of the laminate are

    eps_par(w)    = C + f eps_m(w),     C = cell average of eps over the nondispersive part,
    1/eps_perp(w) = B + f / eps_m(w),   B = cell average of 1/eps over the nondispersive part,

(Farjadpour et al., Opt. Lett. 31, 2972, 2006; Kottke, Farjadpour and Johnson,
Phys. Rev. E 77, 036611, 2008; the tangential/normal split of the dispersive
response follows Deinega and Valuev, Opt. Lett. 32, 3429, 2007). Component c
keeps the diagonal of the inverse tensor, as the dielectric operator of
torchfdtd.subpixel does for a planar interface,

    1/eps_c(w) = (1 - n_c^2)/eps_par(w) + n_c^2/eps_perp(w),

n the unit normal of the dispersive surface. In L = w0^2 - w^2 - i g w,
1/eps_c = c0 - a1/(L + b1) - a2/(L + b2) with c0, a_j, b_j >= 0, so eps_c is a
rational Nevanlinna function of -L bounded at infinity: exactly
eps' + sum_j r_j/(w0^2 + mu_j - w^2 - i g w) with eps' = 1/c0 >= 1, r_j >= 0 and
mu_j >= 0. Every sample therefore carries a passive two-pole Lorentz medium that
the unchanged trapezoidal ADE advances; see docs/SUBPIXEL_INTERFACES.md.
"""
from dataclasses import dataclass
import time

import numpy as np
import torch

from .materials import MaterialADE
from .subpixel_geometry import DielectricGeometry


def interface_poles(fraction, arithmetic, harmonic, weight, epsilon, strength):
    """(eps', mu, r) of the sample response eps' + sum_j r_j/(L + mu_j), L the metal denominator.

    fraction f, arithmetic C and harmonic B averages, weight n_c^2, and the metal
    epsilon-infinity and strength, all broadcast per sample; mu and r have shape (2, n).
    With lambda = -L, 1/eps_c = c0 (1 - sum_k v_k^2/(b_k - lambda)), so its zeros are the
    eigenvalues lambda_j of diag(b) - v v^T and eps_c = (1 + sum_j (x_j.v)^2/(lambda_j - lambda))/c0
    for the eigenvectors x_j: the residues are squares and the weights 0 and 1 need no special case."""
    f,c,b,w,e,s=np.broadcast_arrays(*(np.asarray(v,dtype=float) for v in (fraction,arithmetic,harmonic,weight,epsilon,strength)))
    a=c+f*e
    c0=(1-w)/a+w*(f/e+b)
    v=np.sqrt(np.stack([(1-w)*f*s/a**2,w*f*s/e**2],-1)/c0[...,None])
    matrix=np.stack([f*s/a,s/e],-1)[...,None]*np.eye(2)-v[...,:,None]*v[...,None,:]
    lam,x=np.linalg.eigh(matrix)
    residue=np.einsum('...kj,...k->...j',x,v)**2/c0[...,None]
    # A residue below 1e-12 of the metal strength is decomposition round-off of a vanishing pole.
    residue[residue<=1e-12*s[...,None]]=0
    return 1/c0,np.moveaxis(np.maximum(lam,0),-1,0),np.moveaxis(residue,-1,0)


@dataclass
class DispersiveInterfaces:
    """Flat Yee indices (cell*3+component) touched by dispersive media.

    ``indices`` are mixed samples with sample-wise epsilon-infinity and two
    poles (w0, strength, gamma), each of shape (2, n); ``full`` are samples
    whose whole cell lies in one dispersive material, owned by ``owners``."""
    indices: np.ndarray
    epsilon: np.ndarray
    oscillators: tuple
    full: np.ndarray
    owners: np.ndarray
    full_epsilon: np.ndarray
    metadata: dict

    @property
    def touched(self):return np.concatenate([self.indices,self.full])


def prepare_dispersive(project, ownership):
    """Sample-wise laminate media of every E sample whose cell meets a dispersive object, or None."""
    from .solver import field_axes
    r=project.region;materials=project.materials
    active={s.material for s in project.structures if s.enabled}
    dispersive=[i for i,m in enumerate(materials) if m.oscillators and m.name in active]
    if not dispersive:return None
    started=time.perf_counter()
    index={m.name:i for i,m in enumerate(materials)}
    marks=DielectricGeometry(project,lambda m:0. if m is None or not m.oscillators else 1.+dispersive.index(index[m.name]))
    media=DielectricGeometry(project,lambda m:0. if m is None else 1.+index[m.name])
    background=r.background_index**2
    table=np.zeros((len(materials)+1,len(dispersive)+2));table[0,-2:]=background,1/background
    for i,m in enumerate(materials):
        if i in dispersive:table[i+1,dispersive.index(i)]=1
        elif m.name in active:table[i+1,-2:]=m.instantaneous_epsilon,1/m.instantaneous_epsilon
    steps=np.array([v[1]-v[0] for v in r.mesh_nodes]);dim=marks.dim
    radius=np.linalg.norm(steps[:dim])/2*(1+1e-12)
    flat_owner=ownership.reshape(-1);tolerance=1e-12
    found=dict(index=[],values=[],normal=[])
    for c,component in enumerate(('Ex','Ey','Ez')):
        axes=field_axes(r,component)
        for start in range(0,int(np.prod(r.shape)),32768):
            cells=np.arange(start,min(start+32768,int(np.prod(r.shape))))
            coords=np.unravel_index(cells,r.shape)
            points=np.column_stack([axes[a][coords[a]] for a in range(3)])
            normal,near=marks.normals_and_candidates(points,radius)
            if not np.any(near):continue
            values=media.volume_average(points[near],steps,r.subpixel_quadrature,normal[near],table)
            flat=cells[near]*3+c
            owned=np.isin(flat_owner[flat],dispersive)
            keep=(values[:,:len(dispersive)].sum(axis=1)>tolerance)|owned
            found['index'].append(flat[keep]);found['values'].append(values[keep]);found['normal'].append(normal[near][keep][:,c])
    if not found['index']:
        empty=np.empty(0,np.int64)
        return DispersiveInterfaces(empty,np.empty(0),(np.empty((2,0)),)*3,empty,empty.astype(np.int32),np.empty(0),
                                    dict(materials=[materials[i].name for i in dispersive],mixed_samples=0,full_samples=0,
                                         preparation_seconds=time.perf_counter()-started))
    flat=np.concatenate(found['index']);values=np.concatenate(found['values']);normal=np.concatenate(found['normal'])
    fractions=values[:,:len(dispersive)];present=fractions>tolerance
    if np.any(present.sum(axis=1)>1):
        pairs=sorted({tuple(materials[dispersive[k]].name for k in np.flatnonzero(row)) for row in present[present.sum(axis=1)>1]})
        raise ValueError(f'Dispersive subpixel interfaces allow one dispersive material per Yee cell; {int(np.count_nonzero(present.sum(axis=1)>1))} '
                         f'samples mix {", ".join(" and ".join(p) for p in pairs)}. Separate them by at least one cell or choose staircase interfaces.')
    # The cell's material is its dispersive fraction, or the owner of a sample whose fraction vanished (a touching surface).
    which=np.where(present.any(axis=1),np.argmax(fractions,axis=1),[dispersive.index(o) if o in dispersive else 0 for o in flat_owner[flat]])
    total=np.clip(fractions.sum(axis=1),0,1);full=total>=1-tolerance
    owner=np.asarray(dispersive)[which]
    w0,strength,gamma=(np.array([materials[i].oscillators[0][j] for i in owner]) for j in range(3))
    epsilon_inf=np.array([materials[i].epsilon_inf for i in owner])
    mixed=~full
    epsilon,mu,residue=interface_poles(total[mixed],values[mixed,-2],values[mixed,-1],normal[mixed]**2,epsilon_inf[mixed],strength[mixed])
    oscillators=(np.sqrt(w0[mixed]**2+mu),residue,np.broadcast_to(gamma[mixed],mu.shape).copy())
    metadata=dict(method='diagonal_inverse_laminate_two_pole',materials=[materials[i].name for i in dispersive],
                  mixed_samples=int(np.count_nonzero(mixed)),full_samples=int(np.count_nonzero(full)),
                  epsilon_infinity_range=[float(epsilon.min()),float(epsilon.max())] if len(epsilon) else None,
                  preparation_seconds=time.perf_counter()-started)
    return DispersiveInterfaces(flat[mixed],epsilon,oscillators,flat[full],owner[full].astype(np.int32),epsilon_inf[full],metadata)


class InterfaceADE(MaterialADE):
    """MaterialADE's coupled trapezoidal update with sample-wise epsilon-infinity and poles."""
    def __init__(self, grid, interfaces):
        self.torch=grid.is_torch
        self.indices=torch.as_tensor(interfaces.indices,device=grid.E.device,dtype=torch.long) if self.torch else interfaces.indices
        self.components=True;self.multiple=True
        w0,strength,gamma=interfaces.oscillators
        self.oscillators=tuple(zip(w0,strength,gamma))
        self.P=grid._zeros(w0.shape);self.Q=grid._zeros(w0.shape)
        grid.memory_states.extend((self.P,self.Q))
        dt=grid.time_step
        denominator=1+.5*gamma*dt+.25*(w0*dt)**2
        self.a=grid._coefficient(.5*(w0*dt)**2)
        self.d=grid._coefficient(denominator)
        self.k=grid._coefficient(strength*dt*dt/(4*denominator))
        self.k_sum=self.k.sum(axis=0)
        self.eps=grid._coefficient(interfaces.epsilon)

    def energy_weights(self, grid, weight):
        """Per-pole (Q, P) weights of the Lorentz energy, zero where a pole has no strength."""
        pairs=[]
        for w0,strength,_ in self.oscillators:
            inverse=np.divide(1,strength,out=np.zeros_like(strength),where=strength>0)
            pairs.append(tuple(weight*grid._coefficient(v) for v in (inverse/grid.time_step**2,w0*w0*inverse)))
        return pairs
