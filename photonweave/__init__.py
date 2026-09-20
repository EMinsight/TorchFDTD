"""PhotonWeave: micrometre geometry, SI time, open-source Yee FDTD."""
# The upstream grid package changes process-wide Torch defaults on first import.
# A forward simulator must not disable gradients in its caller's training code.
import torch as _torch
_previous_dtype, _previous_grad = _torch.get_default_dtype(), _torch.is_grad_enabled()
try:
    import fdtd as _fdtd
finally:
    _torch.set_default_dtype(_previous_dtype)
    _torch.set_grad_enabled(_previous_grad)
del _torch, _fdtd, _previous_dtype, _previous_grad

from .models import Project, Region, MeshRefinement, Structure, Source, SourceTimeSettings, TimeSignal, Monitor, Material, BoundaryFace, Boundaries, SpectrumSettings
from .solver import Simulation, Result
from .session import FDTD
from .mesh import freeze_refinements
from .models import FieldMonitor
from .field_monitors import normalize_flux
from .batch import BatchCase, BatchItem, BatchReport, BatchRunner, run_batch, parameter_case, parameter_sweep
from .design import DesignResult, optimize
from .models import LorentzPole, RunControl
from .convergence import ConvergenceReport, mesh_refinement_projects, mesh_convergence

__all__ = ['Project', 'Region', 'MeshRefinement', 'freeze_refinements', 'Structure', 'Source', 'SourceTimeSettings', 'TimeSignal', 'Monitor', 'FieldMonitor', 'normalize_flux', 'Material', 'BoundaryFace', 'Boundaries', 'SpectrumSettings', 'Simulation', 'Result', 'FDTD']
__all__ += ['BatchCase','BatchItem','BatchReport','BatchRunner','run_batch','parameter_case','parameter_sweep','DesignResult','optimize']
__all__ += ['LorentzPole', 'RunControl']
__all__ += ['ConvergenceReport', 'mesh_refinement_projects', 'mesh_convergence']
from .tensor_batch import run_tensor_batch
__all__ += ['run_tensor_batch']
from .grouped_batch import plan_grouped_batch, run_grouped_batch
__all__ += ['plan_grouped_batch', 'run_grouped_batch']
from .tuning import TensorBatchTuning, tune_tensor_batch
__all__ += ['TensorBatchTuning', 'tune_tensor_batch']
from .fsp_geometry import write_fsp_geometry, write_fsp_scene
__all__ += ['write_fsp_geometry', 'write_fsp_scene']
from .optical_data import OpticalData
from .material_fit import FitOptions, MaterialFitResult, fit_material, material_fit_report
__all__ += ['OpticalData', 'FitOptions', 'MaterialFitResult', 'fit_material', 'material_fit_report']
from .differentiable import AdjointOptions, DifferentiableSimulation, DifferentiableResult, smooth_sphere_epsilon
__all__ += ['AdjointOptions', 'DifferentiableSimulation', 'DifferentiableResult', 'smooth_sphere_epsilon']
from .adjoint_spectrum import DifferentiableSpectrum
__all__ += ['DifferentiableSpectrum']
from .memory_profile import profile_memory_transfers
__all__ += ['profile_memory_transfers']
from .streamed import StreamedAdjointOptions, StreamedSimulation
__all__ += ['StreamedAdjointOptions', 'StreamedSimulation']
from .streamed_tuning import StreamedTuning, tune_streamed
__all__ += ['StreamedTuning', 'tune_streamed']
from .adjoint_planes import DifferentiablePlaneSimulation, DifferentiablePlaneResult
__all__ += ['DifferentiablePlaneSimulation', 'DifferentiablePlaneResult']
from .information import GaussianTargetResult, gaussian_target_information, shot_read_covariance
__all__ += ['GaussianTargetResult', 'gaussian_target_information', 'shot_read_covariance']
from .recomputed_batch import recompute_cases
__all__ += ['recompute_cases']
from .detector_allocation import quadrant_intensity_allocation
__all__ += ['quadrant_intensity_allocation']
from .polarization import calibrate_plane_polarization, mix_plane_fields
__all__ += ['calibrate_plane_polarization', 'mix_plane_fields']
from .electron_model import spectral_interpolate, spectral_electron_model, exposure_target_information, SpectralElectronModel, ExposureInformation
__all__ += ['spectral_interpolate', 'spectral_electron_model', 'exposure_target_information', 'SpectralElectronModel', 'ExposureInformation']
from .density_layer import periodic_density_layer
__all__ += ['periodic_density_layer']
from .pupil_response import spectral_pupil_response
__all__ += ['spectral_pupil_response']
from .periodic_response import periodic_layer_response
__all__ += ['periodic_layer_response']
