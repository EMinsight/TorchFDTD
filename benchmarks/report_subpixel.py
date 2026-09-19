"""Render the complete retained sphere study, without selecting winners."""
import json
from pathlib import Path


DATA=Path('docs/validation')
NAMES=['initial','fine','long','duration','finest','quadrature']


def main():
    cases=[];links=[]
    for name in NAMES:
        path=DATA/f'subpixel-sphere-{name}.json'
        data=json.loads(path.read_text(encoding='utf-8'))
        cases.extend((data['arguments'],c) for c in data['cases'])
        links.append(f'[{name}]({path.name})')
    groups={}
    for args,c in cases:
        key=(c['index'],args['duration_fs'],args['quadrature'],c['mesh_um'],c['translation'])
        groups.setdefault(key,{})[c['interface_method']]=c
    lines=['| Index | Time (fs) | Face order | Mesh (nm) | Center | Staircase max error | Subpixel max error |',
           '|---:|---:|---:|---:|---|---:|---:|']
    for (index,duration,order,h,center),pair in sorted(groups.items()):
        if set(pair)!=set(('staircase','subpixel')):raise ValueError(f'Incomplete pair: {(index,duration,order,h,center)}')
        errors=[100*pair[k]['max_relative_error'] for k in ('staircase','subpixel')]
        lines.append(f'| {index:g} | {duration:g} | {order} | {1000*h:g} | {center} | {errors[0]:.4f}% | {errors[1]:.4f}% |')
    report='''# Experimental subpixel sphere validation

This study measures accuracy against an independent analytic Mie series on an
RTX 5880 Ada. It does not establish general device accuracy or a performance
ranking. The interface-accuracy priority remains open.

The sphere radius is 0.3 µm. The domain is 3.2 µm cubed, the TFSF box is 1.6 µm
cubed, and the six scattered-field planes lie at ±1.1 µm. PML thickness remains
0.4 µm. Nine wavelengths span 1.3–1.8 µm. A Gaussian pulse has 8 fs intensity
FWHM and 30 fs offset. The requested duration is rounded up to whole steps.
The shifted center is (0.013, -0.019, 0.007) µm at every mesh. Each pair uses
the same physical settings and a matched homogeneous reference. Runs use
float32 fused CUDA. Inputs, spectra and actual durations remain in the raw files.

The Mie evaluator uses independently written Riccati-Bessel coefficients,
with its zero-contrast and small-particle limits checked in the existing TFSF
tests. This study uses no commercial solver results or models.

## All requested pairs

'''+ '\n'.join(lines)+'''

The low-index sphere shows reduced translation sensitivity and smaller fine-grid
errors with subpixel. It also includes a centered 50 nm case where staircase is
closer to the analytic answer. High-index resonances need finer grids and longer
time windows. At 25 nm, extending 120 fs to 480 fs changes the comparison
substantially. Extending to 1920 fs changes it further. The 480 fs values must
therefore not be presented as certified time-converged values.

Some high-index cases remain less accurate with subpixel. The spectral bounding
needed for the stability construction can affect interface accuracy. These
measurements do not isolate that contribution from numerical dispersion,
quadrature, flux interpolation, CPML or residual time truncation.

Face-order and duration controls are included in the table. Tighter targets,
independent waveguide/port devices, rotated interfaces, dispersive mixtures and
nonuniform subpixel remain follow-up requirements. See [the method and scope](../SUBPIXEL_INTERFACES.md).

## Reproduction and records

```sh
python -m benchmarks.subpixel_sphere --meshes .1 .05 --indices 1.5 3.48 --output results/subpixel-sphere-initial.json
python -m benchmarks.subpixel_sphere --meshes .025 .02 --indices 1.5 3.48 --output results/subpixel-sphere-fine.json
python -m benchmarks.subpixel_sphere --meshes .05 .025 .02 --indices 3.48 --duration-fs 480 --output results/subpixel-sphere-long.json
python -m benchmarks.subpixel_sphere --meshes .025 --indices 3.48 --translations centered --duration-fs 1920 --output results/subpixel-sphere-duration.json
python -m benchmarks.subpixel_sphere --meshes .016 --indices 3.48 --duration-fs 480 --output results/subpixel-sphere-finest.json
python -m benchmarks.subpixel_sphere --meshes .025 --indices 3.48 --translations centered --duration-fs 480 --quadrature 32 --output results/subpixel-sphere-quadrature.json
```

Raw records: '''+', '.join(links)+'''.

Single-run setup, loop and wall timers are retained only as diagnostic data.
The final fine-grid pair and the beginning of the longer-duration study overlapped
on the workstation. Those timings cannot support a speed comparison. No timing
ratio or equal-error speed claim is made from this exploratory study.
'''
    (DATA/'SUBPIXEL_REPORT.md').write_text(report,encoding='utf-8')
    print(f'{len(cases)} solves, {len(groups)} complete pairs')


if __name__=='__main__':main()
