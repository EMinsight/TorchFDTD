"""Conservative periodic density transfer to a uniform Yee grid."""
import math
import torch
from .solver import field_axes


def _overlap(centers,width,count,period,like):
    edges=torch.linspace(-period/2,period/2,count+1,device=like.device,dtype=like.dtype)
    centers=torch.tensor(centers,device=like.device,dtype=like.dtype)
    lo=centers[:,None]-width/2;hi=centers[:,None]+width/2
    result=like.new_zeros((centers.numel(),count))
    for shift in (-period,0.,period):
        result+=(torch.minimum(hi,edges[None,1:]+shift)-torch.maximum(lo,edges[None,:-1]+shift)).clamp_min(0)/width
    return result


def periodic_density_layer(density,region,*,bottom_um,top_um,background_epsilon,design_epsilon):
    """Lift xy density pixels into an extruded layer with differentiable averages.

    Density axes are x,y, with piecewise-constant pixels spanning the full
    centered periodic cell. Each electric component receives volume-averaged
    permittivity over a cell-sized box centered at its own Yee location. This
    is arithmetic volume averaging, not a conformal interface prescription.
    Validate optical convergence before using a coarse transfer for design.
    The z interfaces and lossless selected-frequency material values are fixed.
    """
    if not isinstance(density,torch.Tensor) or density.dtype not in (torch.float32,torch.float64) or density.ndim!=2 or min(density.shape)<1:
        raise ValueError('Density must be a nonempty real floating x,y tensor.')
    if not bool(torch.isfinite(density).all()) or bool(((density<0)|(density>1)).any()):
        raise ValueError('Density must be finite in [0,1].')
    if region.dimension!='3d' or region.mesh_type!='uniform' or region.material_sampling!='yee':
        raise ValueError('Density transfer requires a uniform 3D Yee-material grid.')
    if any(face.kind not in ('periodic','bloch') for axis in (0,1) for face in region.boundaries.pair(axis)):
        raise ValueError('Density transfer requires periodic/Bloch x and y boundaries.')
    values=(bottom_um,top_um,background_epsilon,design_epsilon)
    if any(isinstance(v,torch.Tensor) or not math.isfinite(v) for v in values):
        raise ValueError('Layer interfaces and material values must be fixed finite scalars.')
    if bottom_um>=top_um or min(background_epsilon,design_epsilon)<1:
        raise ValueError('Layer thickness must be positive and permittivities at least one.')
    lower,upper=region.interior_bounds(2)
    if bottom_um<lower or top_um>upper:raise ValueError('Patterned layer must lie inside the non-PML region.')
    step=region.axis_steps;period=region.actual_size
    fields=[]
    for component in ('Ex','Ey','Ez'):
        x,y,z=field_axes(region,component)
        wx=_overlap(x,step[0],density.shape[0],period[0],density)
        wy=_overlap(y,step[1],density.shape[1],period[1],density)
        xy=wx@density@wy.T
        z=torch.tensor(z,device=density.device,dtype=density.dtype)
        fraction=(torch.minimum(z+step[2]/2,z.new_tensor(top_um))-torch.maximum(z-step[2]/2,z.new_tensor(bottom_um))).clamp_min(0)/step[2]
        fields.append(background_epsilon+(design_epsilon-background_epsilon)*xy[:,:,None]*fraction)
    return torch.stack(fields,-1)
