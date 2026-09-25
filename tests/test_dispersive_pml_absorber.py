"""Adiabatic absorber for dispersive media crossing the PML (Region.pml_dispersion='absorber').

The acceptance record (docs/validation/dispersive_pml_absorber.json, written by
benchmarks/dispersive_pml_absorber.py for docs/validation/cases/DISPERSIVE_PML_ABSORBER.json)
is judged again from its own numbers here. The other tests check the absorber
coefficients, the coupled trapezoidal ADE update, the refusals of the paths that
do not implement it and a short run of the diverging fixture.
"""
import json
from pathlib import Path
from types import SimpleNamespace

import fdtd
import numpy as np
import pytest
import torch

from benchmarks import dispersive_pml_absorber as bench
from torchfdtd import Project, Region, Structure, Source, Monitor, Material, Simulation
from torchfdtd.models import Boundaries, BoundaryFace, FieldMonitor
from torchfdtd.boundaries import BoundaryDescription, YeeGrid, absorber_faces, absorber_loss, absorber_profiles
from torchfdtd.materials import configure_materials
from torchfdtd.plan import resolve_plan
from torchfdtd.solver import voxelize
from torchfdtd.stability_checks import stability_warnings

ROOT = Path(__file__).resolve().parents[1]
CASE_PATH = ROOT/'docs'/'validation'/'cases'/'DISPERSIVE_PML_ABSORBER.json'
RECORD_PATH = ROOT/'docs'/'validation'/'dispersive_pml_absorber.json'
CUDA = pytest.mark.skipif(not torch.cuda.is_available(), reason='CUDA unavailable')
SIN = Material(name='sin', model='lorentz', epsilon_inf=1., resonance_rad_s=1.4e16, linewidth_rad_s=1e13, delta_epsilon=3.)


def slab_project(mode='absorber', *, dimension='2d', backend='cpu', precision='float64', kernel='torch', steps=40, sampling='yee',
                 everywhere=False):
    """A SiN slab through the y faces and the x_max face into the corners; x faces 5 and 7 layers deep, x_min stays vacuum."""
    three = dimension == '3d'
    faces = dict(x_min=BoundaryFace(layers=5), x_max=BoundaryFace(layers=7, sigma_scale=.8, polynomial=2))
    r = Region(dimension=dimension, size=(2., 1.6, 1.4 if three else 1.), mesh=.1, pml_cells=4, steps=steps, precision=precision,
               backend=backend, cuda_kernel=kernel, material_sampling=sampling, pml_dispersion=mode, boundaries=Boundaries(**faces))
    slab = Structure(name='slab', center=(0 if everywhere else .75, 0, 0), size=(100. if everywhere else .8, 100., 100. if three else 1.),
                     material='sin')
    return Project(region=r, materials=[Material(name='void', index=1), SIN], structures=[slab],
                   sources=[Source(kind='point', component='Ex', center=(-.3, .1, 0), wavelength=.55, pulse_cycles=2)],
                   monitors=[Monitor(component='Ex', center=(.2, 0, 0))])


def numpy_grid(p):
    fdtd.set_backend('numpy')
    fdtd.backend.float = np.float64
    eps, _, owner = voxelize(p, with_ownership=True)
    g = YeeGrid(p.region, absorber_faces(p))
    g.inverse_permittivity[:] = 1/(eps if eps.ndim == 4 else eps[..., None])
    configure_materials(g, p, owner)
    return g, owner


# ----------------------------------------------------------------------------------------------- the record
@pytest.fixture(scope='module')
def case():
    return json.loads(CASE_PATH.read_text(encoding='utf-8'))


@pytest.fixture(scope='module')
def record():
    return json.loads(RECORD_PATH.read_text(encoding='utf-8'))


def test_record_covers_the_declared_case(case, record):
    assert record['case']['case_id'] == case['case_id'] and record['case']['declared_at_commit'] == case['declared_at_commit']
    assert record['acceptance'] == case['acceptance']
    assert {row['id'] for row in record['rows']} == {spec['id'] for spec in bench.rows()}
    for row in record['rows']:
        if row['kind'] == 'stability':
            assert row['steps_completed'] == row['steps'] and len(row['samples']) == row['steps']//row['sample_interval'], row['id']


def test_every_verdict_follows_from_the_record_and_the_case_limits(case, record):
    for row in record['rows']:
        again = bench.verdict({k: v for k, v in row.items() if k not in ('judgement', 'passed')}, case['acceptance'])
        assert again['judgement'] == row['judgement'] and again['passed'] == row['passed'], row['id']
    assert record['failing_ids'] == [row['id'] for row in record['rows'] if not row['passed']]
    assert record['passed'] and not record['failing_ids'], record['failing_ids']


def test_document_is_rendered_from_the_record(record):
    assert (ROOT/'docs'/'DISPERSIVE_PML_ABSORBER.md').read_text(encoding='utf-8') == bench.render(record)
    assert record['passed'] == (not record['failing_ids'])


# ----------------------------------------------------------------------------------------------- coefficients
def test_faces_reached_by_dispersive_structures_become_the_absorber():
    p = slab_project()
    assert absorber_faces(p) == ((0, 1), (1, 0), (1, 1))
    assert absorber_faces(slab_project('ade')) == () and absorber_faces(slab_project('frozen')) == ()
    three = slab_project(dimension='3d')
    assert absorber_faces(three) == ((0, 1), (1, 0), (1, 1), (2, 0), (2, 1))
    inside = slab_project()
    inside.structures[0].size = (.2, .2, 1.)
    inside.structures[0].center = (0, 0, 0)
    assert absorber_faces(Project.model_validate(inside.model_dump())) == ()
    with pytest.raises(ValueError, match='Absorber faces require pml_dispersion="absorber"'):
        BoundaryDescription(slab_project('ade').region, ((0, 1),))


def test_profile_is_the_graded_depth_of_each_absorber_face_and_corners_add():
    p = slab_project()
    r = p.region
    courant = r.rectangular_courant
    profiles = absorber_profiles(r, courant, absorber_faces(p))
    assert set(profiles) == {0, 1}
    nodes = np.asarray(r.mesh_nodes[0])
    assert not np.any(profiles[0][0][:len(nodes)//2]) and not np.any(profiles[0][1][:len(nodes)//2])   # x_min keeps the CPML
    for side, layers, scale, power in ((1, 7, .8, 2),):
        inner, outer = (nodes[layers], nodes[0]) if side == 0 else (nodes[-1-layers], nodes[-1])
        for k, points in enumerate((nodes[:-1], (nodes[:-1]+nodes[1:])/2)):
            rho = np.clip((points-inner)/(outer-inner), 0, 1)
            half = slice(0, len(points)//2) if side == 0 else slice(len(points)//2, None)
            np.testing.assert_allclose(profiles[0][k][half], (scale*40/(layers+1)*rho**power*courant/2)[half], rtol=1e-15, atol=0)
    n = len(nodes)-1
    assert profiles[1][0][0] == pytest.approx(40/5*courant/2) and profiles[0][0][n-7] == 0 and profiles[0][1][n-7] > 0
    full = absorber_loss(profiles, r.shape, 'E')
    # Ex is a half node along x and an integer node along y; Ez an integer node on both.
    assert full[-1, 0, 0, 0] == profiles[0][1][-1]+profiles[1][0][0] and full[-1, 0, 0, 2] == profiles[0][0][-1]+profiles[1][0][0]
    h = absorber_loss(profiles, r.shape, 'H')
    assert h[-1, 0, 0, 2] == profiles[0][1][-1]+profiles[1][1][0]
    rng = np.random.default_rng(3)
    flat = rng.choice(full.size, 50, replace=False)
    np.testing.assert_array_equal(absorber_loss(profiles, r.shape, 'E', flat, True), full.reshape(-1)[flat])
    cells = rng.choice(full.size//3, 20, replace=False)
    np.testing.assert_array_equal(absorber_loss(profiles, r.shape, 'H', cells, False), h.reshape(-1, 3)[cells])


def test_absorber_replaces_the_stretched_coordinates_of_its_faces_and_enters_the_plan():
    p = slab_project()
    template = BoundaryDescription(p.region, absorber_faces(p))
    segments = [(axis, s['side']) for (_, axis, _), items in template.cpml.items() for s in items]
    assert set(segments) == {(0, 0)} and template.absorber is not None
    ade = slab_project('ade')
    assert BoundaryDescription(ade.region).absorber is None
    assert {(axis, s['side']) for (_, axis, _), items in BoundaryDescription(ade.region).cpml.items() for s in items} == {(0, 0), (0, 1), (1, 0), (1, 1)}
    plan, reference = resolve_plan(p), resolve_plan(ade)
    assert plan.plan_hash != reference.plan_hash and plan.pml_dispersion == 'absorber'
    g, _ = numpy_grid(p)
    plan.verify_grid(g)
    assert Simulation(p).run().summary['absorber_faces'] == ['x_max', 'y_min', 'y_max']


def test_absorber_update_is_the_trapezoidal_lossy_ade_update():
    """(eps_inf + s eps_ref) E_new + (P_new - P_old) = (eps_inf - s eps_ref) E_old + courant*curl H on every E sample,
    eps_ref the bilinear Re eps at the source centre (eps elsewhere); H decays with the same s."""
    for sampling in ('yee', 'cell'):
        # The slab fills the region, so every face is an absorber and no CPML memory advances with the extra curls below.
        p = slab_project(dimension='3d', sampling=sampling, everywhere=True)
        p.structures.append(Structure(name='hole', center=(0, 0, 0), size=(.4, .4, .4), material='void'))
        p = Project.model_validate(p.model_dump())
        assert len(absorber_faces(p)) == 6
        g, owner = numpy_grid(p)
        rng = np.random.default_rng(7)
        g.E[:] = rng.standard_normal(g.E.shape)
        g.H[:] = rng.standard_normal(g.H.shape)
        (state,) = g.material_states
        state.P[:] = rng.standard_normal(state.P.shape)
        state.Q[:] = rng.standard_normal(state.Q.shape)
        e0, h0, p0 = g.E.copy(), g.H.copy(), state.P.copy()
        curl_h = g.curl(g.H, False)
        g.update_E()
        s = absorber_loss(g.absorber, p.region.shape, 'E')
        assert s.max() > .5 and state.absorber is not None
        eps = 1/g.inverse_permittivity
        f = 299792458./.55e-6
        omega = 2/g.time_step*np.tan(np.pi*f*g.time_step)
        reference = (SIN.epsilon_inf+SIN.delta_epsilon*SIN.resonance_rad_s**2/(SIN.resonance_rad_s**2-omega**2-2j*SIN.linewidth_rad_s*omega)).real
        assert 4 < reference < 4.3
        ref, dp = eps.copy(), np.zeros_like(g.E)
        for array, value in ((ref, reference), (dp, state.P-p0)):
            (array.reshape(-1) if state.components else array.reshape(-1, 3))[state.indices] = value
        lhs = (eps+s*ref)*g.E+dp
        rhs = (eps-s*ref)*e0+g.courant_number*curl_h
        np.testing.assert_allclose(lhs, rhs, rtol=0, atol=1e-12)
        assert np.abs(dp).max() > 1e-3
        curl_e = g.curl(g.E, True)
        g.update_H()
        sh = absorber_loss(g.absorber, p.region.shape, 'H')
        np.testing.assert_allclose((1+sh)*g.H, (1-sh)*h0-g.courant_number*curl_e, rtol=0, atol=1e-12)


def test_default_ade_keeps_the_cpml_update_and_kernel_text():
    from torchfdtd.cuda_kernels import FusedYeeCUDA
    old_dtype = torch.get_default_dtype()
    fdtd.set_backend('torch.float64')
    try:
        texts = {}
        for mode in ('ade', 'absorber'):
            p = slab_project(mode)
            g = YeeGrid(p.region, absorber_faces(p))
            texts[mode] = FusedYeeCUDA._source(SimpleNamespace(grid=g), False)[0]+FusedYeeCUDA._source(SimpleNamespace(grid=g), True)[0]
            assert (g.absorber is None) == (mode == 'ade')
    finally:
        fdtd.set_backend('numpy')
        fdtd.backend.float = np.float64
        torch.set_default_dtype(old_dtype)
    assert 'absorber' not in texts['ade'] and {f'psi{t}_1' in texts['ade'] for t in range(4)} == {True}
    # x_min keeps its CPML memory; x_max and the y faces are absorbers.
    assert 'psi0_0' in texts['absorber'] and 'psi0_1' not in texts['absorber'] and 'psi2_0' not in texts['absorber']
    assert texts['absorber'].count('(1-s)/(1+s)') == 6


# ----------------------------------------------------------------------------------------------- refusals and warnings
def test_paths_without_the_absorber_refuse_it():
    from torchfdtd import DifferentiableSimulation, StreamedSimulation, StreamedAdjointOptions, DifferentiablePlaneSimulation
    from torchfdtd.differentiable import _System
    from torchfdtd.open_mode_operators import plan_open_mode_operators
    p = slab_project()
    p.materials[1] = Material(name='sin', index=2.)
    for build in (lambda: DifferentiableSimulation(p), lambda: StreamedSimulation(p, StreamedAdjointOptions(device='cpu')),
                  lambda: _System(p, torch.ones(p.region.shape, dtype=torch.float64))):
        with pytest.raises(ValueError, match='pml_dispersion="absorber" is implemented by the resident Simulation and run_tensor_batch only'):
            build()
    plane = p.model_copy(deep=True)
    plane.monitors = [FieldMonitor(normal='x', center=(.2, 0, 0), size=(0, .6, 1))]
    with pytest.raises(ValueError, match='not by DifferentiablePlaneSimulation'):
        DifferentiablePlaneSimulation(plane)
    with pytest.raises(ValueError, match='Open waveguide modes are solved with the CPML'):
        plan_open_mode_operators(p.region, 'x', 1.55)
    frozen = slab_project('frozen')
    frozen.materials[1] = Material(name='sin', index=2.)
    with pytest.raises(ValueError, match='not by DifferentiablePlaneSimulation'):
        plane.region.pml_dispersion = 'frozen'
        DifferentiablePlaneSimulation(Project.model_validate(plane.model_dump()))


def test_absorber_refuses_pmc_faces_and_subpixel_interfaces():
    r = Region(dimension='3d', size=(1.2, 1.2, 1.2), mesh=.1, pml_cells=3, material_sampling='yee', pml_dispersion='absorber',
               boundaries=Boundaries(x_min=BoundaryFace(kind='pmc'), x_max=BoundaryFace(kind='pmc')))
    with pytest.raises(ValueError, match='does not implement PMC/symmetric faces'):
        BoundaryDescription(r, ((1, 0),))
    sub = Region(dimension='2d', size=(1.6, 1.6, 1.), mesh=.1, pml_cells=3, material_sampling='yee', interface_method='subpixel',
                 pml_dispersion='absorber')
    with pytest.raises(ValueError, match='requires staircase interfaces'):
        BoundaryDescription(sub, ((0, 0),))
    for face in (dict(kappa=3.), dict(alpha=.1), dict(alpha_polynomial=1.)):
        stretched = Region(dimension='2d', size=(1.6, 1.6, 1.), mesh=.1, pml_cells=3, pml_dispersion='absorber',
                           boundaries=Boundaries(y_max=BoundaryFace(**face)))
        with pytest.raises(ValueError, match='kappa and alpha of its faces must keep their defaults'):
            BoundaryDescription(stretched, ((1, 1),))
        BoundaryDescription(stretched, ((1, 0),))


def test_validation_warning_names_the_absorber_and_is_silent_with_it():
    p = slab_project('ade')
    (warning,) = stability_warnings(p)
    assert 'pml_dispersion="absorber"' in warning and 'slab (x_max, y_min, y_max)' in warning
    assert stability_warnings(slab_project('absorber')) == []


# ----------------------------------------------------------------------------------------------- short runs
def test_short_run_of_the_diverging_fixture_grows_with_the_cpml_and_decays_with_the_absorber():
    """The case's corner post in a 0.8 um cube for 2000 steps; the pulse ends at step 1390."""
    torch.set_num_threads(2)
    out = {}
    for mode in ('ade', 'absorber'):
        samples, _, error = bench.run_samples(bench.corner_post_project('sin', mode, size=(.8, .8, .8), steps=2000, sample=200))
        assert error is None
        peak = max(s['state_norm'] for s in samples if s['step'] <= 1400)
        out[mode] = samples[-1]['state_norm']/peak
    assert out['ade'] > 1e6 and out['absorber'] < 1e-6, out


@pytest.mark.parametrize('material', ['dilute', 'sin'])
def test_short_normal_incidence_reflection_of_a_thin_absorber(material):
    """12 layers and 60 fs: a homogeneous fill (vacuum with a 1e-6 pole, or SiN) through the x absorbers stays below the normal limit."""
    kw = dict(material=material, pol='TE', layers=12, duration_fs=60., fill='full')
    short, long = (Simulation(bench.reflection_project(long=flag, **kw)).run() for flag in (False, True))
    assert short.summary['absorber_faces'] == ['x_min', 'x_max']
    assert bench.reflection(short, long, 0)['R_max_on_band'] < 1e-6


# ----------------------------------------------------------------------------------------------- CUDA
@CUDA
@pytest.mark.parametrize('precision,tolerance', [('float64', 1e-11), ('float32', 1e-4)])
def test_fused_kernel_matches_the_torch_update(precision, tolerance):
    pytest.importorskip('cupy')
    runs = {}
    for kernel in ('torch', 'fused'):
        p = slab_project(dimension='3d', backend='cuda', precision=precision, kernel=kernel, steps=200)
        runs[kernel] = Simulation(p).run()
    reference = runs['torch'].signals[:, 0]
    scale = np.abs(reference).max()
    assert scale > 0 and np.abs(runs['fused'].signals[:, 0]-reference).max() <= tolerance*scale
    if precision == 'float64':
        cpu = Simulation(slab_project(dimension='3d', steps=200)).run().signals[:, 0]
        assert np.abs(cpu-reference).max() <= 1e-11*scale


@CUDA
def test_tensor_batch_matches_the_fused_simulation():
    pytest.importorskip('cupy')
    from torchfdtd import run_tensor_batch
    p = slab_project(dimension='3d', backend='cuda', precision='float32', kernel='fused', steps=200)
    single = Simulation(p).run().signals
    other = p.model_copy(deep=True)
    other.structures[0].center = (.65, 0, 0)
    report = run_tensor_batch([p, other], device=0)
    np.testing.assert_array_equal(report.items[0].result.signals, single)
    mixed = p.model_copy(deep=True)
    mixed.region.pml_dispersion = 'ade'
    with pytest.raises(ValueError, match='identical'):
        run_tensor_batch([p, Project.model_validate(mixed.model_dump())], device=0)


# ----------------------------------------------------------------------------------------------- long
@pytest.mark.long
@pytest.mark.parametrize('material', ['sin', 'drude'])
def test_twenty_thousand_steps_of_the_diverging_fixture_in_float64(case, material):
    """The judged float64 stability rows, rerun: G3-07 decay and late-growth limits and the sweep growth ratio."""
    torch.set_num_threads(2)
    spec = next(s for s in bench.rows() if s['id'] == f'stability-{material}-post-absorber-cpu-float64')
    out = bench.verdict(bench.execute(spec), case['acceptance'])
    assert out['passed'], out['judgement']
