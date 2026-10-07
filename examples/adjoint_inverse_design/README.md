# A small adjoint inverse-design example

Optimize 256 continuous density parameters in a 1.6 x 1.6 um dielectric region
between a point source and a target point. The public
`DifferentiableSimulation` API computes the discrete Yee/CPML adjoint. PyTorch
then differentiates the density filter and takes an Adam step.

## Run

Install TorchFDTD from PyPI, download `optimize.py` or enter this directory in a
repository checkout, and run:

```sh
pip install torchfdtd
python optimize.py --iterations 12 --check-gradient --output results/adjoint
```

The default uses one CPU thread, a 48 x 40 x 1 grid, 160 timesteps, FP64 fields
and four checkpoints. No CUDA device or Node.js is required. The seed is fixed.
The optional gradient check compares one adjoint derivative with a central
finite difference before the optimization starts.

The recorded TorchFDTD 1.1.7 run increases the objective from
0.0002143691 to 0.0004442127 (**2.07x**) in 12 updates. The initial adjoint
derivative agrees with a central finite difference to 1.41e-9 relative error.
[Conditions and numerical record](../../docs/assets/adjoint-inverse-design.json)
and [`reference.npz`](reference.npz) retain the actual results.

![Measured CPU adjoint design](../../docs/assets/adjoint-inverse-design.png)

## Objective and design

The objective is the mean squared Ez at the target over the fixed simulation
window. The optimizer minimizes its negative logarithm, so maximizing this
quantity is unchanged. This is a point-field objective in arbitrary units,
not normalized transmission or focusing efficiency.

Sigmoid density followed by a 3 x 3 averaging filter sets relative permittivity
between 1 and 2.25. The source, target, mesh, CPML and time window remain fixed.
The optimized density stays continuous. This small tutorial does not establish
mesh convergence or manufacturability, and does not reproduce the large
E1/E2/E3 devices of the paper.

Outputs:

- `summary.png`: initial/final dielectric, measured objective history and target signals.
- `design.npz`: density and permittivity arrays, target signals and objective history.
- `result.json`: package version, driver hash, conditions, objective values and gradient check.
- `project.json`: the fixed source/monitor/simulation setup. The optimized material array is
  in `design.npz`; `project.json` alone does not include that custom permittivity.

For the full-aperture nine-wavelength lens, color hologram and polarization-switched
hologram, see [the paper examples](../full-aperture-tiled-adjoint/).
