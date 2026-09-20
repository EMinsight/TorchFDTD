"""Scalar-only physical-gradient diagnostic using immutable slab oracles.

No FDTD, GPU, eigensolver or native material VJP runs are performed here.
The historical coarse native derivatives are quoted with explicit provenance.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import subprocess
import numpy as np
from benchmarks.mode_network_slab_oracle import continuum_slab, discrete_slab, C_UM_S


def objective(s):
    return float(s[1, 0].real + .3*s[0, 1].imag)


def run():
    root = Path(__file__).resolve().parents[1]
    inputs = ['benchmarks/mode_network_slab_oracle.py',
              'docs/validation/mode_network_refinement_3060.json',
              'docs/validation/mode_network_slab_oracle_3060.json']
    originals = {name: (root/name).read_bytes() for name in inputs}
    source_hashes = {name: hashlib.sha256(data).hexdigest() for name, data in originals.items()}
    source_hashes['benchmarks/mode_network_gradient_diagnostic.py'] = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    meshes = (.2, .1, .05)
    steps = (4e-5, 2e-5, 1e-5, 5e-6, 2.5e-6)
    epsilon = 2.6
    def continuum(value):
        return objective(continuum_slab(epsilon=value))
    def discrete(h, value):
        dt = .99*h/(np.sqrt(3)*C_UM_S)
        return objective(discrete_slab(h, dt, epsilon=value))
    rows = []
    for delta in steps:
        rows.append(dict(central_epsilon_step=delta,
            continuum_derivative=(continuum(epsilon+delta)-continuum(epsilon-delta))/(2*delta),
            discrete_derivatives=[(discrete(h, epsilon+delta)-discrete(h, epsilon-delta))/(2*delta)
                                  for h in meshes]))
    values = np.array([[r['continuum_derivative'], *r['discrete_derivatives']] for r in rows])
    chosen = rows[2]
    coarse_native_ad = -.20350411534309387
    continuum_derivative = chosen['continuum_derivative']
    coarse_exact_derivative = chosen['discrete_derivatives'][0]
    # An illustrative descent step, fixed before evaluating its objective change.
    descent_step = 1e-3
    proposed_change = -np.sign(coarse_native_ad)*descent_step
    result = dict(recorded_utc=datetime.now(timezone.utc).isoformat(),
        revision=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip(),
        computation='FP64 scalar NumPy continuity/lattice oracle calculations only. No new FDTD or native adjoint.',
        objective='Re(S21) + 0.3 Im(S12)', parameter='Slab relative permittivity epsilon = 2.25 + increment',
        epsilon=epsilon, background_epsilon=2.25, wavelength_um=1.55,
        slab_bounds_um=[-.2, .2], port_phase_planes_um=[-1., 1.],
        spatial_steps_um=list(meshes), courant=.99/float(np.sqrt(3)),
        central_difference_rows=rows,
        derivative_max_minus_min_over_step_halving=np.ptp(values, axis=0).tolist(),
        representative_epsilon_step=1e-5,
        discrete_relative_error_against_continuum=[abs(x/continuum_derivative-1) for x in chosen['discrete_derivatives']],
        discrete_sign_matches_continuum=[bool(np.sign(x)==np.sign(continuum_derivative)) for x in chosen['discrete_derivatives']],
        historical_native_coarse=dict(spacing_um=.2, measured_adjoint=coarse_native_ad,
            measured_central_difference=-.2034902423620224, measured_epsilon_step=.004,
            recorded_native_adjoint_fd_relative_difference=6.817516259616241e-5,
            native_adjoint_relative_difference_from_exact_discrete=abs(coarse_native_ad/coarse_exact_derivative-1),
            native_adjoint_sign_matches_continuum=bool(np.sign(coarse_native_ad)==np.sign(continuum_derivative)),
            provenance='Verbatim values from the original test_mode_network.py::test_reciprocal_two_port_native_propagation_and_material_gradient console output, also documented in MODE_NETWORK.md. That original run had no contemporaneous source hash. Quoted here, not rerun.'),
        finer_native_material_vjp_measured=False,
        illustrative_minimization_step=dict(epsilon_change=float(proposed_change),
            direction='Coarse native adjoint suggests increasing epsilon for descent.',
            continuum_objective_change=continuum(epsilon+proposed_change)-continuum(epsilon),
            coarse_discrete_objective_change=discrete(.2, epsilon+proposed_change)-discrete(.2, epsilon),
            native_fdtd_step_evaluated=False),
        source_and_input_sha256=source_hashes,
        conclusion='The coarse native gradient agrees in sign with its discrete problem but points opposite to the continuum derivative. Finer scalar discrete derivatives have the continuum sign and reduced error. Their native material VJPs have not been measured. No physical-gradient acceptance threshold is introduced.')
    for name, data in originals.items():
        assert (root/name).read_bytes() == data
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    result = run()
    target = Path(args.output)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(result, indent=2, allow_nan=False)+'\n', encoding='utf-8', newline='\n')
    print(json.dumps(result, indent=2))
