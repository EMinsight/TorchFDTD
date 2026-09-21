"""Independent RCWA oracle for the G3-08 binary grating, run with TORCWA in a separate interpreter.

TORCWA (Kim and Lee, Comput. Phys. Commun. 282, 108552, 2023) is installed in
the C:/anaconda3 interpreter, not in the project virtual environment. This
script never imports torchfdtd. It writes one JSON file with the harmonic
convergence sequence and the oracle values that tests/test_physics_g3_b.py
reads for G3-08.

Conventions: exp(-i omega t) phasors, the grating ridge centred on x = 0, the
input (top) face of the layer is the phase reference of the reflected orders
and the output (bottom) face is the phase reference of the transmitted orders
(the empty-layer check in the output asserts t = exp(i k_z d)). TE means the
electric field along the ridges (TORCWA y, TorchFDTD 2D z); TM means the
electric field in the plane of incidence (TORCWA x, TorchFDTD x).

Run:
  C:/anaconda3/python.exe benchmarks/g3_torcwa_grating.py --output docs/validation/g3/G3-08_torcwa_reference.json
"""
import argparse
import hashlib
import json
import math
import platform
import time
from pathlib import Path

import torch
import torcwa

PERIOD_UM = 1.2
FILL = .5
HEIGHT_UM = .5
INDEX = 2.
WAVELENGTHS_UM = (.92, 1.02, 1.06)
ANGLES_DEG = (0., 20.)
HARMONICS = (20, 40, 80, 160, 320, 640)
SAMPLES = 2**14
POLARIZATIONS = {'TE': 'yy', 'TM': 'xx'}


def profile(dtype, device):
    """Symmetric binary profile sampled at x_j = j L / P with the two edge samples averaged."""
    x = torch.arange(SAMPLES, dtype=torch.float64, device=device)*PERIOD_UM/SAMPLES
    eps = torch.ones(SAMPLES, dtype=dtype, device=device)
    half = FILL*PERIOD_UM/2
    eps[(x < half-1e-12) | (x > PERIOD_UM-half+1e-12)] = INDEX**2
    eps[(abs(x-half) < 1e-12) | (abs(x-(PERIOD_UM-half)) < 1e-12)] = (INDEX**2+1)/2
    return eps.reshape(SAMPLES, 1)


def propagating_orders(wavelength, angle_deg):
    orders = []
    for m in range(-4, 5):
        kx = math.sin(math.radians(angle_deg))+m*wavelength/PERIOD_UM
        if abs(kx) < 1:
            orders.append(m)
    return orders


def solve(wavelength, angle_deg, harmonics, dtype, device, empty=False):
    sim = torcwa.rcwa(freq=1/wavelength, order=[harmonics, 0], L=[PERIOD_UM, PERIOD_UM], dtype=dtype, device=device)
    sim.add_input_layer(eps=1.)
    sim.add_output_layer(eps=1.)
    sim.set_incident_angle(inc_ang=math.radians(angle_deg), azi_ang=0.)
    sim.add_layer(thickness=HEIGHT_UM, eps=1. if empty else profile(dtype, device))
    sim.solve_global_smatrix()
    result = {}
    for m in propagating_orders(wavelength, angle_deg):
        row = {}
        for name, pol in POLARIZATIONS.items():
            values = {}
            for port, key in (('transmission', 't'), ('reflection', 'r')):
                power = sim.S_parameters(orders=[m, 0], direction='forward', port=port, polarization=pol, power_norm=True)
                amplitude = sim.S_parameters(orders=[m, 0], direction='forward', port=port, polarization=pol, power_norm=False)
                values[key+'_efficiency'] = float(abs(power)**2)
                values[key+'_amplitude'] = [float(amplitude.real), float(amplitude.imag)]
                values[key+'_phase_rad'] = float(torch.angle(amplitude))
            row[name] = values
        result[str(m)] = row
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    parser.add_argument('--output', default='docs/validation/g3/G3-08_torcwa_reference.json')
    parser.add_argument('--device', choices=['cpu', 'cuda'], default='cpu')
    parser.add_argument('--harmonics', type=int, nargs='+', default=list(HARMONICS))
    args = parser.parse_args()
    device = torch.device(args.device)
    dtype = torch.complex128
    started = time.perf_counter()
    empty = solve(1.02, 20., 20, dtype, device, empty=True)['0']['TE']['t_amplitude']
    kz = 2*math.pi/1.02*math.cos(math.radians(20.))
    expected = (math.cos(kz*HEIGHT_UM), math.sin(kz*HEIGHT_UM))
    empty_error = max(abs(empty[0]-expected[0]), abs(empty[1]-expected[1]))
    configurations = []
    for angle in ANGLES_DEG:
        for wavelength in WAVELENGTHS_UM:
            sequence = {}
            for harmonics in args.harmonics:
                sequence[str(harmonics)] = solve(wavelength, angle, harmonics, dtype, device)
                print(f'angle {angle} wavelength {wavelength} harmonics {harmonics} done at {time.perf_counter()-started:.1f} s', flush=True)
            last, previous = sequence[str(args.harmonics[-1])], sequence[str(args.harmonics[-2])]
            convergence = {}
            for m, row in last.items():
                convergence[m] = {}
                for name in POLARIZATIONS:
                    convergence[m][name] = {}
                    for key in ('t_efficiency', 'r_efficiency', 't_phase_rad', 'r_phase_rad'):
                        change = last[m][name][key]-previous[m][name][key]
                        if key.endswith('phase_rad'):
                            change = math.remainder(change, 2*math.pi)
                        convergence[m][name][key+'_change_from_previous'] = change
                        # Laurent-rule TM sequences converge like 1/N; the
                        # Richardson estimate is a diagnostic, not the oracle.
                        convergence[m][name][key+'_richardson_1_over_N'] = last[m][name][key]+change
            configurations.append(dict(angle_deg=angle, wavelength_um=wavelength,
                                       propagating_orders=propagating_orders(wavelength, angle),
                                       harmonic_sequence=sequence, oracle_harmonics=args.harmonics[-1],
                                       oracle=last, convergence=convergence))
    record = dict(
        kind='g3_torcwa_reference', task='G3-08',
        reference_method='TORCWA rigorous coupled-wave analysis, Kim and Lee, Comput. Phys. Commun. 282, 108552 (2023)',
        torcwa_version=getattr(torcwa, '__version__', 'unknown'), torch_version=torch.__version__,
        python=platform.python_version(), device=args.device, dtype='complex128',
        grating=dict(period_um=PERIOD_UM, fill=FILL, height_um=HEIGHT_UM, index=INDEX, superstrate_index=1., substrate_index=1.),
        profile_samples=SAMPLES, harmonic_sequence=list(args.harmonics),
        factorization='TORCWA 0.1.4.2 forms the Toeplitz matrix of epsilon directly (Laurent rule); TM sequences converge like 1/N, TE sequences converge geometrically',
        wavelengths_um=list(WAVELENGTHS_UM), angles_deg=list(ANGLES_DEG),
        polarization_map={'TE': 'TORCWA yy: E along the ridges = TorchFDTD 2D Ez', 'TM': 'TORCWA xx: E in the plane of incidence = TorchFDTD Ex'},
        phase_reference='transmitted amplitudes at the bottom face relative to the incident field at the top face; reflected amplitudes at the top face; ridge centred on x = 0',
        empty_layer_check=dict(t_amplitude=empty, expected=list(expected), max_abs_error=empty_error),
        configurations=configurations, elapsed_s=time.perf_counter()-started,
        script_sha256=hashlib.sha256(Path(__file__).read_bytes()).hexdigest())
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(record, indent=1)+'\n', encoding='utf-8', newline='\n')
    print('wrote', target, 'empty-layer error', empty_error)


if __name__ == '__main__':
    main()
