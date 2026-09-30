"""Broadband fixed-angle source technique (docs/BFAST.md): validation, stability and oblique-incidence physics."""
import math

import numpy as np
import pytest

from torchfdtd import Project, Region, Structure, Source, Monitor, Simulation
from torchfdtd.bfast import bfast_angle, bfast_scaled_k, physical_field, trapped_band
from torchfdtd.models import Boundaries, BoundaryFace, FieldMonitor, SpectrumSettings
from torchfdtd.solver import C0, estimate

PERIODIC_X = dict(x_min=BoundaryFace(kind='periodic'), x_max=BoundaryFace(kind='periodic'))
BAND = dict(pulse='broadband', time_definition='wavelength', wavelength_start=1.0, wavelength_stop=2.0, wavelength=1.5)


def film(wavelength, n, d, theta, polarization):
    """Transmittance and reflectance of a free-standing film by the characteristic matrix."""
    s = math.sin(math.radians(theta))
    c0, c1 = math.cos(math.radians(theta)), np.sqrt(1-(s/n)**2+0j)
    y0, y1 = (c0, n*c1) if polarization == 's' else (1/c0, n/c1)
    delta = 2*np.pi/wavelength*n*d*c1
    b = np.cos(delta)+1j*np.sin(delta)/y1*y0
    c = 1j*y1*np.sin(delta)+np.cos(delta)*y0
    return abs(2*y0/(y0*b+c))**2, abs((y0*b-c)/(y0*b+c))**2


def slab_project(theta, component, slab, *, mesh=.04, steps=4000, period=.4):
    region = Region(size=(period, 8, 1), mesh=mesh, steps=steps, pml_cells=12, backend='cpu', precision='float64',
                    material_sampling='yee', snapshot_interval=500, boundaries=Boundaries(**PERIODIC_X),
                    bfast_scaled_k=bfast_scaled_k(theta, phi=90, normal='y'))
    spectrum = SpectrumSettings(sampling='wavelength', wavelength_start=1, wavelength_stop=2, frequency_points=11, apodization='none')
    monitors = [FieldMonitor(name=name, normal='y', center=(0, y, 0), size=(period, 0, 1), spectrum=spectrum)
                for name, y in (('T', 2.5), ('R', -2.5))]
    # Faces a quarter cell off the Yee samples: every sample sees exactly 8 cells (0.32 um) of film.
    structures = [Structure(size=(2*period, .32, 1), center=(0, .16+mesh/4, 0), material='SiO2 (constant n)')] if slab else []
    p = Project(region=region, structures=structures, monitors=monitors,
                sources=[Source(kind='plane', normal='y', center=(0, -2, 0), size=(period, 0, 0), component=component, **BAND)])
    p.materials[1].index = 1.5
    return p


def reflected_flux(monitor, fields):
    c = {name: fields[..., i] for i, name in enumerate(monitor['components'])}
    return .5*np.real(c['Ez']*c['Hx'].conj()-c['Ex']*c['Hz'].conj())@monitor['weights']


def test_scaled_wavevector_and_angle():
    k = bfast_scaled_k(30, normal='z')
    assert k == pytest.approx((.5, 0, 0)) and k[1] == 0
    assert bfast_scaled_k(30, phi=90, normal='y') == pytest.approx((.5, 0, 0))
    assert bfast_scaled_k(20, phi=45, index=1.5, normal='z') == pytest.approx((1.5*math.sin(math.radians(20))/math.sqrt(2),)*2+(0,))
    assert bfast_angle(bfast_scaled_k(35, phi=30, index=1.2), index=1.2) == pytest.approx((35, 30))
    with pytest.raises(ValueError, match='90'):
        bfast_scaled_k(90)


def test_region_validation_serialization_and_time_step():
    periodic = Boundaries(**PERIODIC_X)
    plain = Region(size=(.4, 8, 1), boundaries=periodic)
    r = Region(size=(.4, 8, 1), boundaries=periodic, bfast_scaled_k=(.5, 0, 0))
    assert r.bfast and not r.complex_fields
    assert r.time_step == pytest.approx(.5*plain.time_step) and r.rectangular_courant == pytest.approx(.5*plain.rectangular_courant)
    # Off, the region serializes (and hashes) exactly as before the fields existed.
    assert 'bfast_scaled_k' not in plain.model_dump() and 'bfast_taper_cells' not in plain.model_dump()
    assert r.model_dump()['bfast_scaled_k'] == (.5, 0, 0) and Region.model_validate(r.model_dump()) == r
    with pytest.raises(ValueError, match='periodic'):
        Region(size=(2, 8, 1), bfast_scaled_k=(.5, 0, 0))
    with pytest.raises(ValueError, match='periodic'):
        Region(size=(.4, 8, 1), boundaries=Boundaries(x_min=BoundaryFace(kind='bloch'), x_max=BoundaryFace(kind='bloch')), bfast_scaled_k=(.5, 0, 0))
    with pytest.raises(ValueError, match='below 1'):
        Region(size=(.4, 8, 1), boundaries=periodic, bfast_scaled_k=(1, 0, 0))
    with pytest.raises(ValueError, match='periodic'):
        Region(size=(.4, 8, 1), boundaries=periodic, bfast_scaled_k=(0, 0, .2))
    with pytest.raises(ValueError, match='one axis'):
        Region(dimension='3d', size=(.4, 3, 3), mesh=.05, boundaries=periodic, bfast_scaled_k=(.3, 0, 0))
    with pytest.raises(ValueError, match='taper'):
        Region(size=(.4, 1.6, 1), boundaries=periodic, bfast_scaled_k=(.3, 0, 0), bfast_taper_cells=10)


def test_other_paths_refuse_bfast():
    from torchfdtd.differentiable import DifferentiableSimulation
    p = Project(region=Region(size=(.4, 8, 1), boundaries=Boundaries(**PERIODIC_X), bfast_scaled_k=(.3, 0, 0), backend='cpu'),
                sources=[Source(kind='plane', normal='y', center=(0, -2, 0), size=(.4, 0, 0))], monitors=[Monitor()])
    with pytest.raises(ValueError, match='BFAST'):
        DifferentiableSimulation(p)
    with pytest.raises(ValueError, match='normal incidence'):
        Project(region=p.region, sources=[Source(kind='plane', normal='y', center=(0, -2, 0), size=(.4, 0, 0),
                                                 injection='oneway', component='Ez')])


@pytest.mark.parametrize('theta,component,polarization', [(30, 'Ez', 's'), (50, 'Ex', 'p')])
def test_broadband_oblique_film_matches_analytic(theta, component, polarization):
    """One BFAST run gives R and T of a film at a fixed angle over an octave (1-2 um)."""
    steps = 3000 if theta == 30 else 4500
    film_run = Simulation(slab_project(theta, component, True, steps=steps)).run()
    air = Simulation(slab_project(theta, component, False, steps=steps)).run()
    t_air = air.field_monitor('T')
    T = film_run.field_monitor('T')['flux']/t_air['flux']
    r_film, r_air = film_run.field_monitor('R'), air.field_monitor('R')
    R = -reflected_flux(r_film, r_film['fields']-r_air['fields'])/t_air['flux']
    wavelengths = C0/t_air['frequency_hz']*1e6
    expected = np.array([film(w, 1.5, .32, theta, polarization) for w in wavelengths])
    assert np.max(abs(T-expected[:, 0])) < 6e-3, (T, expected[:, 0])
    assert np.max(abs(R-expected[:, 1])) < 6e-3, (R, expected[:, 1])
    assert np.max(abs(R+T-1)) < 1e-3


def test_long_run_stays_bounded_with_pml():
    """Stretched-coordinate PMLs amplify the spurious BFAST modes; the compensated taper keeps them out."""
    p = slab_project(50, 'Ez', True, steps=20000)
    p.region.snapshot_interval = 1000
    r = Simulation(p).run()
    peaks = np.array([abs(f).max() for f in r.frames])
    assert peaks.max() > 1e-2
    assert np.all(peaks[5:] < 1e-4*peaks.max()), peaks


def test_specular_order_does_not_reflect_at_the_taper():
    """Air only: a short cell against a long one. The compensated switch into the k = 0 PML is reflectionless
    for the zeroth order; an uncompensated switch reflects about 1e-3 of the power."""
    def plane(length):
        p = slab_project(40, 'Ez', False, steps=2000)
        p.region.size = (.4, length, 1)
        p.monitors = [FieldMonitor(name='M', normal='y', center=(0, 1.5, 0), size=(.4, 0, 1), spectrum=p.monitors[0].spectrum)]
        return Simulation(p).run().field_monitor('M')
    short, long = plane(8), plane(30)
    reflection = abs(reflected_flux(short, short['fields']-long['fields']))/abs(long['flux'])
    assert np.max(reflection) < 1e-7


def test_physical_field_matches_bloch_run():
    """At one frequency, a Bloch run with phase k_x*period is the same fixed-angle problem: the BFAST field times
    exp(i omega k.x/c) has the Bloch field's transverse profile and the same transmittance."""
    theta, period, wavelength = 20, .8, 1.7
    k = bfast_scaled_k(theta, phi=90, normal='y')
    spectrum = SpectrumSettings(sampling='custom', custom_frequencies_hz=[C0/(wavelength*1e-6)], apodization='none')

    def project(bloch, grating):
        if bloch:
            boundaries = Boundaries(x_min=BoundaryFace(kind='bloch'), x_max=BoundaryFace(kind='bloch'))
            extra = dict(bloch_phase=(2*math.pi*math.sin(math.radians(theta))/wavelength*period, 0, 0))
            time = dict(pulse='gaussian', wavelength=wavelength, pulse_cycles=4)
        else:
            boundaries, extra, time = Boundaries(**PERIODIC_X), dict(bfast_scaled_k=k), dict(BAND, wavelength_stop=1.9)
        region = Region(size=(period, 8, 1), mesh=.04, steps=6000 if bloch else 7000, pml_cells=12, backend='cpu',
                        precision='float64', material_sampling='yee', snapshot_interval=1000, boundaries=boundaries, **extra)
        structures = [Structure(size=(.4, .32, 1), center=(0, .17, 0), material='Si (constant n)')] if grating else []
        p = Project(region=region, structures=structures,
                    sources=[Source(kind='plane', normal='y', center=(0, -2, 0), size=(period, 0, 0), component='Ez', **time)],
                    monitors=[FieldMonitor(name='T', normal='y', center=(0, 2.5, 0), size=(period, 0, 1), spectrum=spectrum)])
        p.materials[3].index = 2
        return p
    runs = {(b, g): Simulation(project(b, g)).run().field_monitor('T') for b in (False, True) for g in (False, True)}
    t_bfast = runs[False, True]['flux'][0]/runs[False, False]['flux'][0]
    t_bloch = runs[True, True]['flux'][0]/runs[True, False]['flux'][0]
    assert t_bfast == pytest.approx(t_bloch, abs=5e-3)
    grating = runs[False, True]
    column = grating['components'].index('Ez')
    physical = physical_field(grating['fields'], grating['points_um'], grating['frequency_hz'], k)[0, :, column]
    ratio = runs[True, True]['fields'][0, :, column]/physical
    assert np.std(ratio)/abs(np.mean(ratio)) < 2e-2


def test_estimate_reports_trapped_orders_and_placement():
    region = Region(size=(.8, 8, 1), boundaries=Boundaries(**PERIODIC_X), bfast_scaled_k=bfast_scaled_k(20, phi=90, normal='y'))
    (axis, low, high), = trapped_band(region)
    assert axis == 0 and low == pytest.approx(.8*math.sqrt(1-math.sin(math.radians(20))**2))
    assert high == pytest.approx(.8*(1+math.sin(math.radians(20))))
    p = Project(region=region, sources=[Source(kind='plane', normal='y', center=(0, -3.3, 0), size=(.8, 0, 0), **dict(BAND, wavelength_start=.95))],
                monitors=[Monitor(center=(0, 1, 0))])
    warnings = estimate(p)['warnings']
    assert any('diffraction order' in w for w in warnings)
    assert any('source: outside the full BFAST wavevector span' in w for w in warnings)
