"""Build the TFSF validation table from retained measurements, without solving."""
import json
from pathlib import Path
import numpy as np

DATA=Path('docs/validation')


def rows():
    return [c for name in ('tfsf-sphere','tfsf-sphere-finer','tfsf-sphere-long')
            for c in json.loads((DATA/(name+'.json')).read_text())['cases']]


def table():
    lines=['| Mesh (µm) | Grid | Requested time (fs) | Max relative Mie error | Empty-box cross section (µm²) |',
           '|---|---:|---:|---:|---:|']
    for c in rows():
        r=c['project']['region'];s=c['sample_summary']
        requested=240 if s['duration_fs']>200 else 120
        lines.append(f"| {r['mesh']:.4g} | {s['shape'][0]}³ | {requested} | {100*c['max_relative_error']:.4f}% | {c['max_empty_box_cross_section_um2']:.3e} |")
    return '\n'.join(lines)


def main():
    discrete=json.loads((DATA/'tfsf-sources.json').read_text())
    error=max(v for c in discrete['cases'] for v in c['relative_l2'].values())
    leak=max(v for c in discrete['cases'] for v in c['outside_peak_ratio'].values())
    long=rows()[-1];short=rows()[2]
    time_error=max(abs(np.asarray(long['scattering_cross_section_um2'])/
                       np.asarray(short['scattering_cross_section_um2'])-1))
    pml='\n'.join(f"| {L} | {max(c['relative_l2'] for c in discrete['incident_line'] if c['layers']==L):.3e} |"
                  for L in (32,96,192))
    text=f'''# Closed-box TFSF validation

Native inputs and independent references only. The independent discrete comparison uses float64 NumPy. Sphere solves use float32 fused CUDA on RTX 5880 Ada, PyTorch 2.10/CUDA 12.8. This is accuracy validation, not an external-library speed comparison.

## Independent homogeneous reference

All 20 active-axis, direction and Cartesian transverse-polarization combinations in 2D/3D were evaluated. The independent recurrence reconstructs the Gaussian directly, advances on a scalar line whose ends cannot affect the sampled fields, and applies geometric masks at each Yee coordinate. It does not call the native waveform, curl, CPML or surface-map routines. At 90 steps the maximum full-field relative L2 difference is {error:.3e}. The maximum exterior field peak divided by the full field peak is {leak:.3e}. These short runs do not measure long-duration incident-line error.

For 1600-step entry E/H and exit E histories, background indices 1, 1.5 and 3 give the following worst relative L2 differences from the independent line:

| Auxiliary PML cells per end | Max relative L2 difference |
|---:|---:|
{pml}

[All discrete cases and incident-line histories' errors](tfsf-sources.json). Reproduce with `python -m benchmarks.tfsf_sources`.

## Dielectric sphere scattering

A radius-0.3 µm, index-1.5 sphere is illuminated along +x with transverse Ez. The cubic domain is 3.2 µm, the TFSF box is 1.6 µm and each exterior PML has physical thickness 0.4 µm. Six scattered-field planes at ±1.1 µm integrate outward flux. A matched empty-box run supplies incident intensity and residual-field subtraction. Nine wavelengths span 1.3–1.8 µm. The Gaussian power FWHM is 8 fs with offset 30 fs. Physical duration is rounded upward to whole steps and the actual duration is retained in each result.

The analytic reference evaluates the standard Mie coefficients using SciPy spherical Bessel functions. Zero index contrast and the small-sphere Rayleigh limit are checked separately. This reference is intended for the modest real size parameters in this fixture, not arbitrary absorbing or very large spheres. Formula context: [Prahl, Mie Scattering Algorithms](https://miepython.readthedocs.io/en/latest/07_algorithm.html). No external Mie implementation is called.

{table()}

**The mesh error is not monotonic.** The 0.05 µm result is unusually close to the analytic series. It is not a demonstrated asymptotic error estimate or a reason to prefer that mesh generally. Increasing the 0.025 µm run from 120 to 240 fs changes the cross section by at most {time_error:.3e} relative. This rules out a significant duration effect for that comparison, but does not isolate staircase geometry, monitor interpolation, numerical dispersion or physical-PML error. The source and geometry still require convergence studies for each new problem.

The attempted 0.0125 µm mesh requires 256³ cells and was rejected by the existing eight-million-cell job limit. It produced no calculation result and is not included as a measured point.

[Three initial meshes](tfsf-sphere.json), [0.02 µm refinement](tfsf-sphere-finer.json), [240 fs control](tfsf-sphere-long.json), [executable sphere example](../../examples/tfsf_sphere.py).

## Execution and scope checks

`tests/test_tfsf.py` covers float32/64 CPU agreement, Torch/fused and graph/eager equivalence, independent tensor cases, transverse vector polarization, both directions, overlapping boxes, soft-source superposition, graded exterior mesh and passive dispersive scatterers. It checks invalid shell material, geometry and boundary combinations. Full incident-line state contributes to decay and non-finite diagnostics, including delayed drives. A zero-area sampled pulse verifies that automatic termination preserves the fixed-duration trace prefix.

The UI test creates a box, changes axis/direction without losing spans, previews incidence and runs an empty-box exterior-leakage check. Native support does not imply FSP TFSF conversion or oblique injection. See [source definition and limits](../TFSF_SOURCES.md).
'''
    (DATA/'TFSF_REPORT.md').write_text(text,encoding='utf8')
    print('Wrote docs/validation/TFSF_REPORT.md')


if __name__=='__main__':main()
