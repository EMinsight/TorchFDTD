# Dispersive materials

The native CPU and CUDA engines support passive isotropic **Dielectric**, **Plasma (Drude)** and **Lorentz** materials. Version 0.10 adds up to 16 coupled poles with a **Multiple Drude / Lorentz poles** editor and native Python API. See the [multipole guide](RUN_CONTROL_AND_CONVERGENCE.md). Open **Materials**, select or add a material, choose its model, edit parameters, and select **Apply materials**. Assign it to a structure in Object properties. **Plot n / k** shows the continuous response and the constitutive response at the current simulation timestep. Editing a parameter invalidates the preview. Material edits are disabled in Analysis mode.

The convention is fields proportional to `exp(-i omega t)`, so positive imaginary permittivity and positive `k` mean absorption. All resonance, collision and linewidth values below are **angular frequencies in rad/s**, not ordinary frequencies in Hz. The parameter conventions follow [Ansys's documented models](https://optics.ansys.com/hc/en-us/articles/360034394634-Standard-optical-permittivity-material-models-in-FDTD-and-MODE).

| Model | Relative permittivity | Parameters |
| --- | --- | --- |
| Dielectric | `n²` | `index >= 1` |
| Drude | `epsilon_inf - plasma_rad_s² / (omega² + i collision_rad_s omega)` | `epsilon_inf >= 1`, plasma frequency > 0, collision >= 0 |
| Lorentz | `epsilon_inf + delta_epsilon resonance_rad_s² / (resonance_rad_s² - omega² - 2 i linewidth_rad_s omega)` | `epsilon_inf >= 1`, strength and resonance > 0, linewidth >= 0 |

The built-in Si, SiN and SiO2 entries remain explicitly labelled constant-index approximations. There is no bundled measured optical-constant database or automatic fit of sampled n/k data. Gain, anisotropy, Debye, conductivity models, magnetic response, nonlinear materials and subcell/conformal material averaging remain unimplemented. The background medium remains a constant dielectric. A successful import is not evidence that these other material families are supported.

## Native API and familiar commands

```python
from photonweave import Material
from photonweave.materials import permittivity

metal = Material(name='Example Drude', model='drude', epsilon_inf=2,
                 plasma_rad_s=2e15, collision_rad_s=1.5e14)
epsilon = permittivity(metal, [180e12, 200e12])
```

```python
from photonweave import FDTD
fd = FDTD()
name = fd.addmaterial('Lorentz')
fd.setmaterial(name, 'name', 'Example Lorentz')
fd.setmaterial('Example Lorentz', 'Permittivity', 2)
fd.setmaterial('Example Lorentz', 'Lorentz Permittivity', 1.2)
fd.setmaterial('Example Lorentz', 'Lorentz Resonance', 1.7e15)
fd.setmaterial('Example Lorentz', 'Lorentz Linewidth', 1e14)
fd.addrect(material='Example Lorentz')
n = fd.getfdtdindex('Example Lorentz', [180e12, 200e12])
```

The facade supports `addmaterial('Dielectric'|'Plasma'|'Lorentz')`, model-specific `setmaterial`, renaming with structure-reference updates, and analytic `getfdtdindex`. Optional fitting-band arguments do not change these analytic models. Unsupported properties raise errors. Native JSON, generated Python and NPZ project metadata retain all parameters. Inactive model parameters are retained when switching models and are not used by the selected model.

## Time integration and memory

For each dispersive cell, the engine evolves relative polarization `P` and a scaled current `Q = dt dP/dt`. It solves the oscillator and electric-field update together using the trapezoidal rule. Scaling the current keeps femtosecond factors out of the stored state, including float32 calculations. Its discrete constitutive permittivity follows the analytic expression with `omega` replaced by `2/dt tan(omega dt/2)`. This is a constitutive response, not the complete spatial numerical dispersion of the Yee grid.

Only the cells finally owned by a dispersive material allocate auxiliary states. Lower mesh order takes priority, with later objects winning equal orders. Dielectric overlays erase the underlying dispersive ownership. Complex Bloch fields evolve complex auxiliary states. All state buffers participate in CUDA Graph warm-up/capture resets. Coefficients and state remain on the GPU during stepping.

The epsilon snapshot stores **instantaneous epsilon**, which is `epsilon_inf` in dispersive cells. It is not a frequency-dependent dielectric image. Spatial material placement uses selectable legacy shared-cell or per-component Yee staircase sampling. Resolve both internal wavelength and skin depth, and check convergence near resonances. The UI's wavelength resolution warning samples the configured source range and cannot prove adequate resolution for every narrow resonance.

## Independent FSP mapping

Observed v241 layout material records with types 0, 2 and 4 map to Dielectric, Plasma and Lorentz. The converter resolves each structure's material UUID, verifies isotropic 3×3 tensors and passive supported parameters, preserves color, and applies database mesh priority unless the object overrides it. Unknown material families and anisotropy block conversion. Mapping does not call the vendor API or use a cached material fit. General FSP material editing/writeback remains open.

Current checks use analytic permittivity, a driven discrete oscillator, Fresnel transmission and native CPU/CUDA agreement. Curved-interface convergence remains unestablished. Historical commercial comparisons are excluded.
