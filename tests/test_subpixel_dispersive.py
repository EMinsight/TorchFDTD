"""Dispersive subpixel interfaces (torchfdtd.subpixel_dispersive): laminate poles, preparation, stability and backends."""
from types import SimpleNamespace

import fdtd
import numpy as np
import pytest
import torch

from torchfdtd import Project, Region, Material, Structure, Simulation, DifferentiableSimulation, run_tensor_batch
from torchfdtd.boundaries import YeeGrid
from torchfdtd.materials import configure_materials
from torchfdtd.run_control import StateDiagnostics
from torchfdtd.subpixel import prepare_interfaces, configure_interfaces
from torchfdtd.subpixel_dispersive import DispersiveInterfaces, InterfaceADE, interface_poles
from test_solver import small

DRUDE = dict(model='drude', epsilon_inf=5., plasma_rad_s=1.37e16, collision_rad_s=1.5e14)


def laminate(f, c, b, w, e, s, w0, gamma, omega):
    """The diagonal of the inverse dispersive Kottke tensor evaluated directly."""
    metal = e+s/(w0**2-omega**2-1j*gamma*omega)
    return 1/((1-w)/(c+f*metal)+w*(b+f/metal))


def test_laminate_poles_are_the_inverse_tensor_diagonal_and_passive():
    rng = np.random.default_rng(5)
    n = 4000
    f = rng.uniform(0, 1, n); f[:40] = .5; f[40:60] = 0
    w = rng.uniform(0, 1, n); w[:20] = 1; w[20:40] = 0; w[60:80] = 1-1e-15; w[80:100] = 1e-15
    dielectric = rng.uniform(1, 12, n); dielectric[:40] = 1
    c, b = (1-f)*dielectric, (1-f)/dielectric
    e, s = rng.uniform(1, 8, n), rng.uniform(.1, 5, n)*1e32
    w0, gamma = rng.choice([0., 1e16], n), rng.uniform(0, 3e14, n)
    eps, mu, r = interface_poles(f, c, b, w, e, s)
    assert eps.min() >= 1-1e-12 and mu.min() >= 0 and r.min() >= 0
    for omega in (1e15, 3e15, 5.2e15, 7e15, 2e16):
        L = w0**2-omega**2-1j*gamma*omega
        np.testing.assert_allclose(eps+(r/(L+mu)).sum(0), laminate(f, c, b, w, e, s, w0, gamma, omega), rtol=1e-12)
    # Tangential samples keep the fill-fraction average; normal samples the harmonic (series) laminate.
    omega = 4e15
    for weight, expected in ((0., lambda m: .7+.3*m), (1., lambda m: 1/(.7+.3/m))):
        eps, mu, r = interface_poles(.3, .7, .7, weight, 5., 1.8e32)
        L = -omega**2-1j*1e14*omega
        np.testing.assert_allclose(eps+(r/(L+mu)).sum(0), expected(5.+1.8e32/L), rtol=1e-13)


def test_sample_ade_is_the_bilinear_image_of_the_laminate():
    """The trapezoidal update of one sample reproduces eps_c at (2/dt) tan(omega dt/2), like MaterialADE."""
    dt, omega = 1.2e-17, 4.6e15
    f, c, b, w = np.array([.2, .5, .8, .5]), np.array([.8, .5, .2, 1.]), np.array([.8, .5, .2, .25]), np.array([.3, 1., 0., .6])
    e, s, gamma = 5., 1.37e16**2, 1.5e14
    eps, mu, r = interface_poles(f, c, b, w, e, s)
    interfaces = DispersiveInterfaces(np.arange(len(f)), eps, (np.sqrt(mu), r, np.full(mu.shape, gamma)), np.empty(0, int),
                                      np.empty(0, np.int32), np.empty(0), {})
    grid = SimpleNamespace(is_torch=False, time_step=dt, E=np.zeros(len(f)), memory_states=[],
                           _zeros=np.zeros, _coefficient=lambda a: np.asarray(a, dtype=float))
    state = InterfaceADE(grid, interfaces)
    steps = 24000
    t = np.arange(steps+1)*dt
    drive = np.cos(omega*t)*(1-np.exp(-(t/(400*dt))**2))
    history = np.empty((steps, len(f)))
    for n in range(steps):
        old, response = state.prepare(grid.E)
        grid.E += (drive[n+1]-drive[n])/eps
        state.correct(grid.E, old, response)
        history[n] = grid.E
    tail = slice(steps//2, steps)
    basis = np.stack([np.cos(omega*t[1:][tail]), np.sin(omega*t[1:][tail])], 1)
    fit = np.linalg.lstsq(basis, history[tail], rcond=None)[0]
    measured = 1/(fit[0]+1j*fit[1])
    Omega = 2/dt*np.tan(omega*dt/2)
    np.testing.assert_allclose(measured, laminate(f, c, b, w, e, s, 0., gamma, Omega), rtol=1e-5)
    assert np.all(abs(measured/laminate(f, c, b, w, e, s, 0., gamma, omega)-1) > 1e-4)


def slab_project(axis, shift=.013):
    bounds = {a+'_'+s: dict(kind='periodic') for a in 'xyz' for s in ('min', 'max')}
    r = Region(dimension='3d', size=(1, 1, 1), mesh=1/10, material_sampling='yee', interface_method='subpixel',
               boundaries=bounds, precision='float64', backend='cpu', steps=100)
    size = [3., 3., 3.]; size[axis] = .37; center = [0., 0., 0.]; center[axis] = shift
    return Project(region=r, materials=[Material(name='metal', **DRUDE), Material(name='glass', index=1.5)],
                   structures=[Structure(kind='rectangle', material='metal', size=tuple(size), center=tuple(center))])


@pytest.mark.parametrize('axis', [0, 1, 2])
def test_off_grid_slab_samples_take_exact_fractions_and_the_laminate_branches(axis):
    p = slab_project(axis); r = p.region; h = r.mesh
    plan = prepare_interfaces(p); d = plan.dispersive
    lo, hi = .013-.185, .013+.185
    cells, components = np.divmod(d.indices, 3)
    position = np.stack(np.unravel_index(cells, r.shape), 1)[:, axis]*h-.5+np.where(components == axis, h/2, 0)
    fraction = np.clip(np.minimum(position+h/2, hi)-np.maximum(position-h/2, lo), 0, h)/h
    metal = p.materials[0]
    s = metal.oscillators[0][1]
    normal = components == axis
    expected = np.where(normal, 5/(fraction+(1-fraction)*5), (1-fraction)+5*fraction)
    np.testing.assert_allclose(d.epsilon, expected, rtol=1e-12)
    strength = np.where(normal, fraction*s/(fraction+(1-fraction)*5)**2, fraction*s)
    np.testing.assert_allclose(d.oscillators[1].sum(0), strength, rtol=1e-12)
    assert np.all((fraction > 0) & (fraction < 1))
    assert np.all(plan.ownership.reshape(-1)[d.indices] == -1)
    np.testing.assert_allclose(plan.diagonal.reshape(-1)[d.indices], 1/d.epsilon, rtol=0)
    assert not np.isin(plan.rows, d.touched).any() and not np.isin(plan.columns[plan.values != 0], d.touched).any()
    assert plan.metadata['dispersive']['mixed_samples'] == len(d.indices) == 2*r.shape[(axis+1) % 3]*r.shape[(axis+2) % 3]*3


def periodic_sphere(collision, mesh=.02, dielectric=False):
    bounds = {a+'_'+s: dict(kind='periodic') for a in 'xyz' for s in ('min', 'max')}
    r = Region(dimension='3d', size=(.24, .24, .24), mesh=mesh, material_sampling='yee', interface_method='subpixel',
               boundaries=bounds, precision='float64', backend='cpu', steps=100)
    materials = [Material(name='metal', **dict(DRUDE, collision_rad_s=collision)), Material(name='glass', index=2)]
    structures = [Structure(kind='sphere', material='metal', radius=.071, center=(.013, -.007, .004))]
    if dielectric:
        structures.append(Structure(kind='rectangle', material='glass', size=(.3, .3, .05), center=(0, 0, -.09)))
    return Project(region=r, materials=materials, structures=structures)


def leapfrog_norms(project, steps, every):
    plan = prepare_interfaces(project)
    fdtd.set_backend('numpy'); fdtd.backend.float = np.float64
    grid = YeeGrid(project.region)
    grid.inverse_permittivity[:] = plan.diagonal
    configure_materials(grid, project, plan.ownership)
    configure_interfaces(grid, plan)
    rng = np.random.default_rng(3)
    grid.E[:] = rng.normal(size=grid.E.shape); grid.H[:] = rng.normal(size=grid.H.shape)
    diagnostics = StateDiagnostics(grid)
    norms = []
    for n in range(steps):
        grid.update_E(); grid.update_H()
        if n % every == 0:
            norms.append(diagnostics.measure()[0])
    return np.array(norms), plan


def check_bounded(norms, collision):
    assert np.all(np.isfinite(norms))
    quarter = len(norms)//4
    if collision:
        assert norms[-quarter:].max() < norms[:quarter].max()
    else:
        # Lossless: the state norm oscillates about a conserved discrete energy and never trends upward.
        assert norms[-quarter:].max() <= 1.05*norms[:quarter].max()
        assert norms.min() >= .5*norms[0]


@pytest.mark.parametrize('collision', [0., 1.5e14])
def test_closed_box_state_norm_does_not_grow(collision):
    norms, plan = leapfrog_norms(periodic_sphere(collision, dielectric=True), 3000, 25)
    assert plan.metadata['dispersive']['mixed_samples'] > 0 and len(plan.rows) > 0
    check_bounded(norms, collision)


@pytest.mark.long
@pytest.mark.parametrize('collision', [0., 1.5e14])
def test_closed_box_state_norm_does_not_grow_over_200000_steps(collision):
    norms, _ = leapfrog_norms(periodic_sphere(collision, dielectric=True), 200000, 500)
    check_bounded(norms, collision)


def drude_scene(backend='cpu', precision='float64', dimension='3d'):
    p = small(backend, dimension, precision)
    p.region.material_sampling = 'yee'; p.region.interface_method = 'subpixel'; p.region.steps = 160
    p.materials.append(Material(name='metal', **DRUDE))
    p.structures[0].material = 'metal'; p.structures[0].center = (.013, -.021, .007)
    if dimension == '3d':
        p.region.size = (2.4, 2.4, 2.4); p.sources[0].center = (-.6, 0, 0); p.monitors[0].center = (.6, .1, 0)
    return Project.model_validate(p.model_dump())


def test_open_scene_runs_and_reports_interface_samples():
    result = Simulation(drude_scene()).run()
    info = result.summary['subpixel']['dispersive']
    assert info['mixed_samples'] > 0 and info['method'] == 'diagonal_inverse_laminate_two_pole'
    assert np.all(np.isfinite(result.electric)) and abs(result.signals).max() > 0
    assert any('dispersive laminate' in w for w in result.summary['warnings'])


def test_unsupported_dispersive_interfaces_are_refused():
    p = drude_scene()
    data = p.model_dump(); data['materials'][-1] = dict(name='metal', model='multipole', poles=[
        dict(resonance_rad_s=3e15, strength_rad_s_squared=1e31, damping_rad_s=1e14),
        dict(resonance_rad_s=5e15, strength_rad_s_squared=1e31, damping_rad_s=1e14)])
    with pytest.raises(ValueError, match='one Drude or Lorentz pole'):
        Project.model_validate(data)
    data = p.model_dump(); data['region']['pml_dispersion'] = 'frozen'
    with pytest.raises(ValueError, match='frozen'):
        Project.model_validate(data)
    p = periodic_sphere(1e14)
    p.materials.append(Material(name='gold', **dict(DRUDE, plasma_rad_s=1.2e16)))
    p.structures.append(Structure(kind='sphere', material='gold', radius=.03, center=(.013, -.007, .09)))
    with pytest.raises(ValueError, match='one dispersive material per Yee cell'):
        prepare_interfaces(p)
    with pytest.raises(ValueError, match='staircase'):
        DifferentiableSimulation(drude_scene())


@pytest.mark.skipif(not torch.cuda.is_available(), reason='CUDA unavailable')
@pytest.mark.parametrize('precision', ['float32', 'float64'])
def test_cpu_cuda_fused_and_tensor_cohorts_agree(precision):
    pytest.importorskip('cupy')
    p = drude_scene(precision=precision)
    cpu = Simulation(p).run()
    p.region.backend = 'cuda'; p.region.cuda_kernel = 'torch'
    reference = Simulation(p).run(cuda_graph=False)
    p.region.cuda_kernel = 'fused'
    fused = Simulation(p).run()
    shifted = p.model_copy(deep=True); shifted.structures[0].center = (.05, .03, 0)
    batch = run_tensor_batch([p, shifted]); batch.raise_for_errors()
    tol = 3e-5 if precision == 'float32' else 2e-12
    peak = abs(cpu.electric).max()
    for actual in (reference, fused):
        np.testing.assert_allclose(actual.electric, cpu.electric, rtol=0, atol=tol*peak)
        np.testing.assert_allclose(actual.signals, cpu.signals, rtol=0, atol=tol*abs(cpu.signals).max())
    for item, expected in zip(batch.items, (fused, Simulation(shifted).run())):
        np.testing.assert_array_equal(item.result.electric, expected.electric)
        np.testing.assert_array_equal(item.result.signals, expected.signals)
