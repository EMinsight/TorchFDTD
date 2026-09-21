"""Independent continuum mode oracles, not production eigenmode code.

Lengths are micrometres, beta is rad/um, fields use exp(i beta z-i omega t)
and reduced H=Z0*H_SI. Scalar roots and Bessel evaluation deliberately use
FP64. No Torch, native curls, FDTD profiles, vendor data or vendor code.

The fiber equation is independently assembled from continuity of Ez, Hz,
Ephi and Hphi. For longitudinal amplitudes Ez=A*f*exp(i phi), Hz=i*b*f*exp(i
phi), normalized radial f(a)=1, transverse recovery follows directly from
curl E=i*k*H and curl H=-i*k*epsilon*E. The real boundary matrix is
[[-L,k*D],[k*De,-L]], where D=fcore'/qcore^2-fclad'/qclad^2,
De=epscore*fcore'/qcore^2-epsclad*fclad'/qclad^2 and
L=beta/a*(1/qcore^2-1/qclad^2). No weak-guidance approximation is made.

Equation review references (not source-code dependencies):
- Gopalakrishnan et al., Computing Optical Fiber Modes, vector step-index
  chapter, hybrid characteristic equation and exp(i beta z-i omega t):
  https://jayggg.github.io/fibermode/1_4_stepindex_vector.html
- NIST DLMF 10.6 and 10.29, Bessel derivative recurrences:
  https://dlmf.nist.gov/10.6 and https://dlmf.nist.gov/10.29
Slab equations below follow directly from tangential E/H continuity at
x=+/-thickness/2. Profiles have arbitrary fixed amplitude, not unit power.
"""
from dataclasses import dataclass
import math

import numpy as np
from scipy.optimize import brentq
from scipy.special import jv, jvp, kve


def _parameters(wavelength_um, n_core, n_clad, size_um):
    values=(wavelength_um,n_core,n_clad,size_um)
    if any(isinstance(x,(bool,complex)) or not np.isscalar(x) or not np.isfinite(x) for x in values):
        raise ValueError('Use finite real scalar wavelength, indices and size.')
    if wavelength_um<=0 or size_um<=0 or not n_core>n_clad>=1:
        raise ValueError('Require positive sizes and n_core > n_clad >= 1.')
    return 2*math.pi/float(wavelength_um)


@dataclass(frozen=True)
class SlabMode:
    wavelength_um: float
    n_core: float
    n_clad: float
    thickness_um: float
    polarization: str
    beta_per_um: float
    transverse_k_per_um: float
    decay_per_um: float
    root_residual: float

    @property
    def neff(self): return self.beta_per_um*self.wavelength_um/(2*math.pi)

    def fields(self,x_um):
        """Six Cartesian components, +z propagation, invariant along y."""
        x=np.asarray(x_um,dtype=np.float64)
        if not np.isfinite(x).all(): raise ValueError('Coordinates must be finite.')
        a=self.thickness_um/2
        inside=np.abs(x)<=a
        q,g=self.transverse_k_per_um,self.decay_per_um
        f=np.where(inside,np.cos(q*x),np.cos(q*a)*np.exp(-g*np.maximum(np.abs(x)-a,0)))
        derivative=np.where(inside,-q*np.sin(q*x),-np.sign(x)*g*f)
        epsilon=np.where(inside,self.n_core**2,self.n_clad**2)
        k=2*math.pi/self.wavelength_um
        out=np.zeros((*x.shape,6),dtype=np.complex128)
        if self.polarization=='TE':
            out[...,1]=f;out[...,3]=-self.beta_per_um*f/k;out[...,5]=-1j*derivative/k
        else:
            out[...,4]=f;out[...,0]=self.beta_per_um*f/(k*epsilon);out[...,2]=1j*derivative/(k*epsilon)
        return out


def solve_slab(*, wavelength_um=1.55,n_core=1.8,n_clad=1.4,thickness_um=.8,polarization='TE'):
    """Even fundamental TE0 or TM0 in an infinite symmetric dielectric slab."""
    k=_parameters(wavelength_um,n_core,n_clad,thickness_um)
    if polarization not in ('TE','TM'): raise ValueError('Use TE or TM.')
    a=thickness_um/2
    v=k*a*math.sqrt(n_core**2-n_clad**2)
    if v<1e-4: raise ValueError('Extremely weak confinement is outside this FP64 root oracle.')
    ratio=1. if polarization=='TE' else (n_core/n_clad)**2
    def equation(u): return u*math.tan(u)-ratio*math.sqrt(max(0.,v*v-u*u))
    upper=min(v,math.pi/2)*(1-1e-13)
    u=brentq(equation,1e-14,upper,xtol=5e-15,rtol=1e-14)
    q=u/a;g=math.sqrt(v*v-u*u)/a
    beta=math.sqrt((k*n_clad)**2+g*g)
    return SlabMode(wavelength_um,n_core,n_clad,thickness_um,polarization,beta,q,g,abs(equation(u))/v)


def _fiber_terms(u,v,n_core,n_clad):
    w=math.sqrt(max(0.,v*v-u*u))
    a=float(jvp(1,u)/(u*jv(1,u)))
    # Scaled K avoids cladding underflow without changing logarithmic derivatives.
    b=float(-.5*(kve(0,w)+kve(2,w))/(w*kve(1,w)))
    neff2=n_core*n_core-(n_core*n_core-n_clad*n_clad)*(u/v)**2
    return w,a,b,neff2


def fiber_characteristic(u,v,n_core,n_clad):
    """Scaled exact hybrid determinant, m=1, no LP substitution."""
    w,a,b,neff2=_fiber_terms(u,v,n_core,n_clad)
    first=(a+b)*(n_core*n_core*a+n_clad*n_clad*b)
    second=neff2*(1/u**2+1/w**2)**2
    return (first-second)/max(abs(first),abs(second),1.)


@dataclass(frozen=True)
class FiberMode:
    wavelength_um: float
    n_core: float
    n_clad: float
    radius_um: float
    beta_per_um: float
    u: float
    w: float
    longitudinal_amplitudes: tuple
    root_residual: float
    boundary_residual: float

    @property
    def neff(self): return self.beta_per_um*self.wavelength_um/(2*math.pi)

    @property
    def decay_per_um(self): return self.w/self.radius_um

    def boundary_matrix(self):
        """Two continuity conditions after Ez and Hz have been matched."""
        k=2*math.pi/self.wavelength_um;a=self.radius_um
        qc2=(self.u/a)**2;qd2=-(self.w/a)**2
        fc=self.u/a*jvp(1,self.u)/jv(1,self.u)
        fd=-self.w/(2*a)*(kve(0,self.w)+kve(2,self.w))/kve(1,self.w)
        d=fc/qc2-fd/qd2
        de=self.n_core**2*fc/qc2-self.n_clad**2*fd/qd2
        ell=self.beta_per_um/a*(1/qc2-1/qd2)
        return np.array([[-ell,k*d],[k*de,-ell]])

    def fields(self,x_um,y_um,*,side=None):
        """Six Cartesian fields of the m=+1 HE11 member (degenerate circular basis).

        side='core'/'cladding' evaluates that analytic branch, allowing exact
        one-sided interface comparisons. Default selects the physical branch.
        At the origin the removable m=1 singularity is evaluated analytically.
        """
        x,y=np.broadcast_arrays(np.asarray(x_um,dtype=float),np.asarray(y_um,dtype=float))
        if not np.isfinite(x).all() or not np.isfinite(y).all(): raise ValueError('Coordinates must be finite.')
        if side not in (None,'core','cladding'): raise ValueError('Unknown interface side.')
        r=np.hypot(x,y);phi=np.arctan2(y,x);a=self.radius_um
        core=r<=a if side is None else np.full(r.shape,side=='core')
        if np.any((~core)&(r==0)): raise ValueError('The cladding branch is singular at the origin.')
        f=np.empty(r.shape);fp=np.empty(r.shape);fr=np.empty(r.shape)
        t=self.u*r[core]/a
        f[core]=jv(1,t)/jv(1,self.u)
        fp[core]=self.u/a*jvp(1,t)/jv(1,self.u)
        fr[core]=np.divide(f[core],r[core],out=np.full_like(t,self.u/(2*a*jv(1,self.u))),where=r[core]!=0)
        t=self.w*r[~core]/a
        decay=np.exp(self.w-t)/kve(1,self.w)
        f[~core]=kve(1,t)*decay
        fp[~core]=-self.w/(2*a)*(kve(0,t)+kve(2,t))*decay
        fr[~core]=f[~core]/r[~core]
        epsilon=np.where(core,self.n_core**2,self.n_clad**2)
        q2=np.where(core,(self.u/a)**2,-(self.w/a)**2)
        A,b=self.longitudinal_amplitudes;B=1j*b
        k=2*math.pi/self.wavelength_um;beta=self.beta_per_um
        phase=np.exp(1j*phi)
        er=1j*(beta*A*fp+1j*k*B*fr)/q2*phase
        ep=1j*(1j*beta*A*fr-k*B*fp)/q2*phase
        hr=1j*(beta*B*fp-1j*k*epsilon*A*fr)/q2*phase
        hp=1j*(1j*beta*B*fr+k*epsilon*A*fp)/q2*phase
        c,s=np.cos(phi),np.sin(phi)
        return np.stack((er*c-ep*s,er*s+ep*c,A*f*phase,
                         hr*c-hp*s,hr*s+hp*c,B*f*phase),axis=-1)


def solve_fiber_he11(*,wavelength_um=1.55,n_core=1.8,n_clad=1.4,radius_um=.4):
    """Exact vector HE11, infinite cladding, real bound beta.

    Restricts V>=1 to avoid exponentially weak roots indistinguishable from
    the cladding light line in FP64. The no-cutoff limit V->0 is not claimed.
    """
    k=_parameters(wavelength_um,n_core,n_clad,radius_um)
    v=k*radius_um*math.sqrt(n_core*n_core-n_clad*n_clad)
    if not 1<=v<=100: raise ValueError('This bounded FP64 oracle supports 1 <= V <= 100.')
    def he_branch(u):
        w,a,b,n2=_fiber_terms(u,v,n_core,n_clad)
        mean=(n_core*n_core+n_clad*n_clad)/(2*n_core*n_core)
        contrast=(n_core*n_core-n_clad*n_clad)/(2*n_core*n_core)
        return a+mean*b+math.sqrt((contrast*b)**2+n2/n_core**2*(1/u**2+1/w**2)**2)
    # The fundamental HE branch lies below the first J0 zero, hence no J1 pole.
    upper=min(v,2.4048255576957728)*(1-1e-12)
    u=brentq(he_branch,1e-5,upper,xtol=5e-15,rtol=1e-14)
    w,_,_,neff2=_fiber_terms(u,v,n_core,n_clad)
    result=FiberMode(wavelength_um,n_core,n_clad,radius_um,k*math.sqrt(neff2),u,w,(1.,0.),
                     abs(fiber_characteristic(u,v,n_core,n_clad)),0.)
    matrix=result.boundary_matrix()
    _,_,vh=np.linalg.svd(matrix)
    vector=vh[-1];vector=vector/vector[0]
    residual=float(np.linalg.norm(matrix@vector)/(np.linalg.norm(matrix)*np.linalg.norm(vector)))
    from dataclasses import replace
    result=replace(result,longitudinal_amplitudes=tuple(vector),boundary_residual=residual)
    if result.root_residual>1e-10 or residual>1e-10 or not n_clad<result.neff<n_core:
        raise RuntimeError('Fiber root fails independent determinant/boundary checks.')
    return result
