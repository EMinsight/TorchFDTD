"""G7-01: the metagrating application workflow of docs/G7_WORKFLOWS.md, judged on the criteria of
docs/validation/cases/G7-01.json.

The fast tests check the mechanics at a CPU size: the permittivity transfer, the diffraction-order
decomposition against the fixture's compare.py, the objective's adjoint gradient against finite
differences, the bare-substrate Fresnel balance for TE and TM at both incidences, the TORCWA script
against a uniform film, and the records of a short run. TORCHFDTD_G7_FULL=1 runs the declared
workflow (the RTX 3060 and the TORCWA interpreter); TORCHFDTD_G7_RECORD=<dir> writes its records
there (docs/validation/g7/G7-01 for the committed evidence) and TORCHFDTD_G7_CHECKPOINT_DIR=<dir>
keeps the design states there so that an interrupted run resumes. Without the flag, the committed
records are re-judged when present. Every seed is judged; none is selected.
"""
import importlib.util
import json
import math
import os
from dataclasses import replace
from pathlib import Path
import subprocess
from types import SimpleNamespace

import numpy as np
import pytest
import torch

from examples.g7.metagrating import workflow

ROOT = Path(__file__).resolve().parents[1]
RECORDS = ROOT/'docs'/'validation'/'g7'/'G7-01'
FULL = os.environ.get('TORCHFDTD_G7_FULL') == '1'
RECORD = os.environ.get('TORCHFDTD_G7_RECORD')
CHECKPOINTS = os.environ.get('TORCHFDTD_G7_CHECKPOINT_DIR')
RCWA_PYTHON = os.environ.get('TORCHFDTD_RCWA_PYTHON', 'C:/anaconda3/python.exe')
CRITERIA = ('all_seeds', 'performance', 'rcwa_agreement', 'mesh', 'energy_balance', 'fabrication')


@pytest.fixture(scope='module')
def fixture():
    case, g, _ = workflow.declared()
    return case, g


def small(**changes):
    return replace(workflow.Settings.small_run(), **changes)


def fake_plane(x_um, fields):
    x = torch.as_tensor(x_um, dtype=torch.float64)
    return SimpleNamespace(fields=torch.as_tensor(fields), points_um=torch.stack([x, torch.zeros_like(x), torch.zeros_like(x)], 1),
                           weights=torch.full_like(x, x[1]-x[0]))


def test_binary_density_is_an_exact_staircase_on_the_design_mesh(fixture):
    _, g = fixture
    region = workflow.build_project(g, .02, 'TE', 'normal', small()).region
    ez = workflow.layer_epsilon(torch.as_tensor(workflow.two_ridge_density(g)), region, g)[:, :, 0, 2].numpy()
    si, sub = g['ridge_index']**2, g['substrate_index']**2
    # the fixture's staircase: Ez columns 2-5 and 29-39, rows 92-116, substrate rows 0-91
    assert np.flatnonzero(np.isclose(ez[:, 100], si)).tolist() == list(range(2, 6))+list(range(29, 40))
    assert np.flatnonzero(np.isclose(ez[3], si)).tolist() == list(range(92, 117))
    assert np.flatnonzero(np.isclose(ez[0], sub)).tolist() == list(range(92))
    assert set(np.unique(np.round(ez, 6))) <= {1., round(sub, 6), round(si, 6)}
    fine = workflow.build_project(g, .01, 'TM', 'normal', small()).region
    eps = workflow.layer_epsilon(torch.as_tensor(workflow.two_ridge_density(g)), fine, g)[:, :, 0].numpy()
    # on the 0.01 um grid Ez column 3 (x = -0.97 um) lies on the left edge of the first ridge and row 183 on the substrate top:
    # both receive the mean of the two sides; the normal components Ex (walls) and Ey (layer faces) never straddle
    assert math.isclose(eps[3, 200, 2], (si+1)/2, rel_tol=1e-6) and math.isclose(eps[0, 183, 2], (sub+1)/2, rel_tol=1e-6)
    assert set(np.unique(np.round(eps[:, 184:233, 0], 5))) == {1., round(si, 5)}
    assert set(np.unique(np.round(eps[4:11, :, 1], 5))) == {1., round(sub, 5), round(si, 5)}


def test_te_decomposition_matches_the_fixture_routine(fixture):
    _, g = fixture
    spec = importlib.util.spec_from_file_location('metagrating_compare', ROOT/'examples'/'meep_comparison'/'metagrating'/'compare.py')
    compare = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(compare)
    rng = np.random.default_rng(7)
    x = -.99+.02*np.arange(100)
    wavelength = np.array([1.5, 1.55, 1.6])
    ez, hx = (rng.normal(size=(3, 100))+1j*rng.normal(size=(3, 100)) for _ in range(2))
    fields = np.zeros((3, 100, 6), complex)
    fields[..., 2], fields[..., 3] = ez, hx
    for index, name in ((g['substrate_index'], 'reflection'), (1., 'transmission')):
        forward, backward, _, _ = compare.order_powers(x, ez, hx, wavelength, g['period_um'], index, list(workflow.ORDERS))
        plus, minus, factor, _ = workflow.order_branches(fake_plane(x, fields), wavelength, index, 0., g['period_um'], 'TE', workflow.ORDERS)
        np.testing.assert_allclose(.5*(factor*plus.abs()**2).numpy(), forward, rtol=1e-12, err_msg=name)
        np.testing.assert_allclose(.5*(factor*minus.abs()**2).numpy(), backward, rtol=1e-12, err_msg=name)


@pytest.mark.parametrize('polarization', ['TE', 'TM'])
def test_decomposition_separates_known_waves_at_the_bloch_wavevector(fixture, polarization):
    _, g = fixture
    n, wavelength, kx0 = g['substrate_index'], np.array([1.52]), workflow.bloch_kx(g)
    x = -.99+.02*np.arange(100)
    orders = (-2, -1, 0, 1)
    k0, kx, ky, propagating = workflow.order_wavevectors(wavelength, n, kx0, g['period_um'], orders)
    assert propagating.all()
    up, down = np.array([.3+.1j, -.2j, 1., .05]), np.array([.1, .4-.3j, .2j, -.6])
    fields = np.zeros((1, 100, 6), complex)
    for j in range(len(orders)):
        wave = np.exp(1j*kx[j].item()*x)
        ratio = ky[0, j].item()/k0[0, 0].item()
        if polarization == 'TE':        # Hx = +-(k_y/k_0) Ez
            fields[0, :, 2] += (up[j]+down[j])*wave
            fields[0, :, 3] += ratio*(up[j]-down[j])*wave
        else:                           # Ex = -+(k_y/(k_0 n^2)) Hz
            fields[0, :, 5] += (up[j]+down[j])*wave
            fields[0, :, 0] += -ratio/n**2*(up[j]-down[j])*wave
    plus, minus, _, _ = workflow.order_branches(fake_plane(x, fields), wavelength, n, kx0, g['period_um'], polarization, orders)
    np.testing.assert_allclose(plus[0].numpy(), up, atol=1e-12)
    np.testing.assert_allclose(minus[0].numpy(), down, atol=1e-12)


@pytest.mark.parametrize('polarization,incidence', [('TE', 'normal'), ('TM', 'normal'), ('TE', 'bloch'), ('TM', 'bloch')])
def test_bare_substrate_matches_fresnel(fixture, polarization, incidence):
    _, g = fixture
    evaluator = workflow.CaseEvaluator(g, small(time_fraction=.3, band_points=3), .04, polarization, incidence)
    d = evaluator.diagnostics
    assert d['max_abs_R0_minus_fresnel'] < 3e-3 and d['max_abs_T0_minus_fresnel'] < 3e-3, d
    assert d['max_other_order_power_over_incident'] < 1e-8, d
    e = evaluator.evaluate(np.zeros(workflow.pixel_count(g)))
    assert e['max_abs_energy_residual'] < 3e-3 and e['propagating_orders']['R'] == ([-2, -1, 0, 1] if incidence == 'bloch' else [-1, 0, 1])


def test_objective_gradient_matches_central_differences(fixture):
    _, g = fixture
    objective = workflow.TransmissionObjective(g, small(time_fraction=.1))
    rho = (.2+.6*torch.rand((workflow.pixel_count(g), 1), generator=torch.Generator().manual_seed(3))).requires_grad_(True)
    loss, metrics = objective(rho)
    assert set(metrics) == {'T+1 1.50 um', 'T+1 1.55 um', 'T+1 1.60 um', 'T-1 mean', 'T+0 mean', 'T+1 mean'}
    loss.backward()
    h = 1e-2
    for k in (3, 30, 71):
        with torch.no_grad():
            plus, minus = rho.detach().clone(), rho.detach().clone()
            plus[k] += h
            minus[k] -= h
            fd = (objective(plus)[0].item()-objective(minus)[0].item())/(2*h)
        assert abs(rho.grad[k, 0].item()-fd) <= 1e-2*abs(fd)+1e-7, (k, rho.grad[k, 0].item(), fd)


def uniform_film(g, wavelength, kx, polarization):
    """Power reflectance of a uniform silicon layer between the substrate and air (Airy sum)."""
    k0 = 2*np.pi/wavelength
    eps = [g['substrate_index']**2, g['ridge_index']**2, 1.]
    kz = [np.sqrt(e*k0**2-kx**2+0j) for e in eps]
    q = kz if polarization == 'TE' else [k/e for k, e in zip(kz, eps)]
    r12, r23 = (q[0]-q[1])/(q[0]+q[1]), (q[1]-q[2])/(q[1]+q[2])
    phase = np.exp(2j*kz[1]*g['ridge_height_um'])
    return abs((r12+r23*phase)/(1+r12*r23*phase))**2


def rcwa_available():
    try:
        return subprocess.run([RCWA_PYTHON, '-c', 'import torcwa'], capture_output=True, timeout=120).returncode == 0
    except (OSError, subprocess.SubprocessError):
        return False


def test_rcwa_script_reproduces_a_uniform_film(fixture, tmp_path):
    if not rcwa_available():
        pytest.skip(f'TORCWA interpreter {RCWA_PYTHON} not found (set TORCHFDTD_RCWA_PYTHON)')
    _, g = fixture
    settings = small(band_points=2, rcwa_harmonics=(3, 5), rcwa_device='auto')
    job = workflow.rcwa_job(g, settings, dict(film=[1]*workflow.pixel_count(g)))
    result = workflow.run_rcwa(job, RCWA_PYTHON, tmp_path)
    assert result['package']['torcwa'] == '0.1.4.2'
    assert len(result['cases']) == 4
    for c in result['cases']:
        kx = c['kx_per_um']
        expected = uniform_film(g, np.asarray(c['wavelengths_um']), kx, c['polarization'])
        np.testing.assert_allclose(c['R']['0'], expected, atol=1e-8, err_msg=f"{c['polarization']} {c['incidence']}")
        assert c['max_abs_total_minus_one'] < 1e-8
        assert all(v < 1e-12 for m in c['T'] if m != '0' for v in c['T'][m])


def load_records(directory):
    directory = Path(directory)
    summary = json.loads((directory/'summary.json').read_text(encoding='utf-8'))
    records = [json.loads(path.read_text(encoding='utf-8')) for path in sorted(directory.glob('seed*.json'))]
    return summary, records


def rejudge(directory):
    """Recompute every criterion from the seed records and check it against the summary."""
    summary, records = load_records(directory)
    case, _, provenance = workflow.declared()
    assert summary['provenance'] == provenance, 'the records were judged against another case file or geometry'
    settings = workflow.Settings(**{k: tuple(v) if isinstance(v, list) else v for k, v in summary['settings'].items()})
    criteria = json.loads(json.dumps(workflow.judge(records, case, settings)))
    assert criteria == summary['criteria']
    assert set(criteria) == set(CRITERIA)
    return summary, records, criteria


def test_short_run_writes_complete_records(tmp_path):
    settings = small(time_fraction=.1, band_points=3)
    workflow.run(settings, tmp_path, rcwa_python=RCWA_PYTHON, skip_rcwa=True)
    summary, records, criteria = rejudge(tmp_path)
    assert [r['seed'] for r in records] == [1]
    record = records[0]
    assert len(record['history']) == settings.iterations and len(record['binary']) == workflow.pixel_count(workflow.declared()[1])
    assert [h['beta'] for h in record['history']] == [8., 16., 32., 64.]
    assert len(record['evaluations']) == 8
    for e in record['evaluations']:
        assert len(e['wavelength_um']) == 3 and set(e['T']) == set(e['R']) == {str(m) for m in workflow.ALL_ORDERS}
        assert set(e['amplitudes']['t']) == set(e['amplitudes']['r']) == {'-1', '0', '1'}
    assert record['fabrication']['declared'] == dict(min_linewidth_um=.06, min_gap_um=.06, perturbation_um=.02, boundary=['periodic', 'extend'])
    # a development run is not the declared workflow: one seed and no TORCWA check fail (a) and (c)
    assert not criteria['all_seeds']['passed'] and not criteria['rcwa_agreement']['passed'] and not summary['all_passed']
    assert summary['rcwa'] is None and len(summary['references']) == 8


def assert_every_criterion(directory):
    summary, records, criteria = rejudge(directory)
    report = {name: dict(value=c['value'], passed=c['passed']) for name, c in criteria.items()}
    assert summary['all_passed'] == all(c['passed'] for c in criteria.values())
    assert all(c['passed'] for c in criteria.values()), json.dumps(report, indent=1)


def test_two_ridge_fixture_reproduces_the_committed_native_record(fixture):
    if not torch.cuda.is_available():
        pytest.skip('CUDA unavailable')
    _, g = fixture
    result = workflow.fixture_reproduction(workflow.CaseEvaluator(g, workflow.Settings(), .02, 'TE', 'normal'), g)
    assert result['max_abs_order_efficiency_difference'] < 1e-4, result


@pytest.mark.skipif(not FULL, reason='set TORCHFDTD_G7_FULL=1 for the declared three-seed workflow and its TORCWA check (hours)')
def test_declared_workflow_meets_every_acceptance_criterion(tmp_path):
    directory = Path(RECORD) if RECORD else tmp_path
    workflow.main(['--out', str(directory), '--rcwa-python', RCWA_PYTHON]+(['--checkpoint-dir', CHECKPOINTS] if CHECKPOINTS else []))
    assert_every_criterion(directory)


def test_committed_records_meet_every_acceptance_criterion():
    if not (RECORDS/'summary.json').exists():
        pytest.skip('no committed G7-01 records under docs/validation/g7/G7-01')
    assert_every_criterion(RECORDS)
