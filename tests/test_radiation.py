"""Analytic Rayleigh waves, closed-surface dipoles and a native FDTD VJP."""
from dataclasses import replace
import math
import numpy as np
import pytest
import torch
from torchfdtd.adjoint_planes import DifferentiablePlaneResult
from torchfdtd.radiation import (C0, diffraction_orders, diffraction_efficiency,
    project_farfield, normalized_farfield_intensity)


def plane(normal='z', bounds=((-1, 1), (-1, 1), (-1, 1)), side=1, count=16,
          wavelength=1.1, dtype=torch.float64):
    a = 'xyz'.index(normal)
    coords = []
    for d in range(3):
        lo, hi = bounds[d]
        coords.append(torch.tensor([bounds[d][side]], dtype=dtype) if d == a else
                      lo + (torch.arange(count, dtype=dtype) + .5) * (hi - lo) / count)
    points = torch.stack(torch.meshgrid(*coords, indexing='ij'), -1).reshape(-1, 3)
    area = math.prod(bounds[d][1] - bounds[d][0] for d in range(3) if d != a) * 1e-12
    return DifferentiablePlaneResult(torch.zeros((1, len(points), 6), dtype=torch.complex64 if dtype == torch.float32 else torch.complex128),
        torch.tensor([C0 / (wavelength * 1e-6)], dtype=dtype), points,
        torch.full((len(points),), area / len(points), dtype=dtype),
        tuple(len(c) for c in coords), normal, 'same-run', {})


def rayleigh(p, order, *, n=1.4, direction=1, bloch=(.17, -.13), amplitude=(.7 + .2j, .3 - .4j)):
    a = 'xyz'.index(p.normal)
    b, c = (a + 1) % 3, (a + 2) % 3
    k0 = 2 * math.pi * float(p.frequency_hz[0]) / C0 * 1e-6
    k = torch.zeros(3, dtype=p.fields.dtype)
    k[b], k[c] = bloch[0] + math.pi * order[0], bloch[1] + math.pi * order[1]
    k[a] = direction * torch.sqrt(torch.as_tensor((n * k0)**2, dtype=p.fields.dtype) - k[b]**2 - k[c]**2)
    e = torch.zeros(3, dtype=p.fields.dtype)
    e[b], e[c] = amplitude
    e[a] = -(k[b]*e[b] + k[c]*e[c]) / k[a]
    h = torch.linalg.cross(k, e) / k0
    origin = p.points_um.mean(0)
    phase = torch.exp(1j * ((p.points_um - origin).to(k.dtype) @ k))
    return phase[None, :, None] * torch.cat((e, h))[None, None, :], torch.cat((e, h))


@pytest.mark.parametrize('normal', ['x', 'y', 'z'])
def test_rayleigh_orders_bloch_direction_complex_phase_and_power_sum(normal):
    p = plane(normal)
    one, expected_one = rayleigh(p, (1, -1))
    two, expected_two = rayleigh(p, (-1, 0), direction=-1)
    p.fields = one + .4j * two
    result = diffraction_orders(p, [(1, -1), (-1, 0), (0, 0)], period_um=(2, 2), refractive_index=1.4,
                                bloch_wavevector_per_um=(.17, -.13))
    torch.testing.assert_close(result.forward_fields[0, 0], expected_one, rtol=1e-12, atol=1e-12)
    torch.testing.assert_close(result.backward_fields[0, 1], .4j * expected_two, rtol=1e-12, atol=1e-12)
    assert result.backward_power[0, 0] < 1e-40
    assert result.forward_power[0, 1] < 1e-40
    torch.testing.assert_close((result.forward_power - result.backward_power).sum(-1), p.flux(), rtol=1e-12, atol=1e-26)


def test_evanescent_amplitudes_zero_power_and_cutoff_rejection():
    p = plane(wavelength=2.)
    p.fields, expected = rayleigh(p, (2, 0), n=1., bloch=(0., 0.))
    result = diffraction_orders(p, [(2, 0)], period_um=(2, 2))
    assert not bool(result.propagating[0, 0])
    torch.testing.assert_close(result.forward_fields[0, 0], expected, rtol=1e-12, atol=1e-12)
    assert result.forward_power[0, 0] == 0
    with pytest.raises(ValueError, match='cutoff'):
        diffraction_orders(p, [(1, 0)], period_um=(2, 2))


def test_fp32_efficiency_preserves_sample_and_reference_gradients_at_si_scales():
    base = plane(dtype=torch.float32)
    base.fields, _ = rayleigh(base, (0, 0), bloch=(0., 0.))
    a, r = [torch.tensor(x, requires_grad=True) for x in (1.7, .8)]
    sample = replace(base, fields=base.fields * a * 1e-22)
    reference = replace(base, fields=base.fields * r * 1e-22)
    ratio = diffraction_efficiency(sample, reference, [(0, 0)], period_um=(2, 2), refractive_index=1.4)
    torch.testing.assert_close(ratio, (a/r).square().reshape(1, 1), rtol=1e-6, atol=1e-6)
    got = torch.autograd.grad(ratio.sum(), (a, r))
    for actual, expected in zip(got, (2*a/r**2, -2*a*a/r**3)):
        torch.testing.assert_close(actual, expected, rtol=2e-6, atol=1e-6)


def test_fp32_grazing_cutoff_roundoff_is_rejected_for_multiple_indices():
    for n in (.7, 1., 1.1, 1.2, 1.3, 1.4, 1.7, 3.4):
        p = plane(dtype=torch.float32, wavelength=2*n)
        with pytest.raises(ValueError, match='cutoff'):
            diffraction_orders(p, [(1, 0)], period_um=(2, 2), refractive_index=n)


def dipole_faces(count, *, n=1.3, shift=(.12, -.08, .05), dtype=torch.float64, amplitude=1.):
    bounds = ((-.65, .65), (-.7, .7), (-.6, .6))
    faces = {}
    dipole = torch.tensor([.3 + .1j, -.2j, 1.], dtype=torch.complex64 if dtype == torch.float32 else torch.complex128)
    for d in 'xyz':
        for side in (0, 1):
            p = plane(d, bounds, side, count, wavelength=1.55, dtype=dtype)
            rvec = p.points_um - torch.tensor(shift, dtype=dtype)
            r = rvec.norm(dim=-1)
            unit = rvec.to(dipole.dtype) / r[:, None]
            dot = (unit * dipole).sum(-1, keepdim=True)
            transverse = dipole - unit * dot
            k = 2*math.pi*n/1.55
            wave = torch.exp(1j*k*r)[:, None]
            electric = wave/n**2 * (k*k*transverse/r[:, None] + (3*unit*dot-dipole)*(1/r**3-1j*k/r**2)[:, None])
            magnetic = wave*k*k/n * torch.linalg.cross(unit, dipole.expand_as(unit)) * (1/r + 1j/(k*r*r))[:, None]
            faces[d + ('_min' if side == 0 else '_max')] = replace(p, fields=amplitude*torch.cat((electric, magnetic), -1)[None])
    return faces, bounds, dipole


def test_closed_surface_dipole_complex_amplitude_converges_and_translation_phase():
    directions = torch.tensor([[1., 0, 0], [0, 1., 0], [0, 0, 1.], [-1., 0, 0], [1., 2., 3.]], dtype=torch.float64)
    directions = directions / directions.norm(dim=-1, keepdim=True)
    errors = []
    for count in (14, 28, 56):
        faces, bounds, dipole = dipole_faces(count)
        result = project_farfield(faces, directions, bounds_um=bounds, refractive_index=1.3,
                                  direction_chunk=3, point_chunk=153)
        transverse = dipole - directions * (directions * dipole).sum(-1, keepdim=True)
        phase = torch.exp(-1j*(2*math.pi*1.3/1.55)*(directions @ torch.tensor([.12, -.08, .05], dtype=torch.float64)))
        expected = (2*math.pi/1.55)**2 * transverse * phase[:, None] * 1e-6
        errors.append(float((result.electric_amplitude[0] - expected).norm()/expected.norm()))
    assert errors[0]/errors[1] > 3.8 and errors[1]/errors[2] > 3.8
    assert errors[-1] < 2e-4
    assert (result.electric_amplitude * directions).sum(-1).abs().max() < 1e-19
    remote = result.fields_at_radius(.5)
    torch.testing.assert_close(remote[..., 3:], 1.3*torch.linalg.cross(directions.to(remote.dtype)[None], remote[..., :3]))


def test_closed_surface_near_flux_matches_sphere_integrated_far_power():
    faces, bounds, _ = dipole_faces(28)
    z, weight = np.polynomial.legendre.leggauss(12)
    phi = np.arange(24)*2*np.pi/24
    direction = np.stack([np.sqrt(1-z[:, None]**2)*np.cos(phi)[None],
                          np.sqrt(1-z[:, None]**2)*np.sin(phi)[None], np.broadcast_to(z[:, None], (12, 24))], -1).reshape(-1, 3)
    result = project_farfield(faces, direction, bounds_um=bounds, refractive_index=1.3)
    far = (result.intensity().reshape(12, 24)*torch.tensor(weight)[:, None]).sum()*2*np.pi/24
    near = sum(face.flux()[0] * (-1 if name.endswith('min') else 1) for name, face in faces.items())
    torch.testing.assert_close(far, near, rtol=5e-4, atol=1e-25)


def test_fp32_farfield_both_graphs_and_phase_origin():
    a, r = [torch.tensor(x, requires_grad=True) for x in (1.7, .8)]
    faces, bounds, _ = dipole_faces(16, dtype=torch.float32, amplitude=a*1e-22)
    reference = plane(dtype=torch.float32, wavelength=1.55)
    reference.fields, _ = rayleigh(reference, (0, 0), n=1.3, bloch=(0., 0.))
    reference.fields = reference.fields*r*1e-22
    ratio = normalized_farfield_intensity(faces, reference, [[1., 0, 0]], bounds_um=bounds, refractive_index=1.3)
    gradients = torch.autograd.grad(ratio.sum(), (a, r))
    torch.testing.assert_close(gradients[0], 2*ratio.sum()/a, rtol=2e-6, atol=1e-6)
    torch.testing.assert_close(gradients[1], -2*ratio.sum()/r, rtol=2e-6, atol=1e-6)
    unscaled, bounds, _ = dipole_faces(12)
    direct = project_farfield(unscaled, [[1., 0, 0]], bounds_um=bounds, refractive_index=1.3)
    shifted = project_farfield(unscaled, [[1., 0, 0]], bounds_um=bounds, refractive_index=1.3, phase_origin_um=(.2, 0, 0))
    torch.testing.assert_close(shifted.electric_amplitude, direct.electric_amplitude*complex(np.exp(1j*2*np.pi*1.3/1.55*.2)))


def test_invalid_surface_quadrature_and_conventions_fail_explicitly():
    p = plane()
    with pytest.raises(ValueError, match='Nyquist'):
        diffraction_orders(p, [(8, 0)], period_um=(2, 2))
    with pytest.raises(ValueError, match='integer'):
        diffraction_orders(p, [(1.2, 0)], period_um=(2, 2))
    with pytest.raises(ValueError, match='midpoints'):
        diffraction_orders(p, [(0, 0)], period_um=(1., 2.))
    faces, bounds, _ = dipole_faces(4)
    with pytest.raises(ValueError, match='six'):
        project_farfield({'x_min': faces['x_min']}, [[1., 0, 0]], bounds_um=bounds)
    faces['z_max'] = replace(faces['z_max'], weights=faces['z_max'].weights*2)
    with pytest.raises(ValueError, match='weights'):
        project_farfield(faces, [[1., 0, 0]], bounds_um=bounds)


def test_fp32_farfield_macroscopic_radius_preserves_coherent_phase():
    from torchfdtd.radiation import FarFieldResult
    frequency = torch.tensor([C0/1.55e-6], dtype=torch.float32)
    amplitude = torch.tensor([[[0, 1., 0]]], dtype=torch.complex64, requires_grad=True)
    result = FarFieldResult(amplitude, torch.tensor([[1., 0, 0]]), frequency, 1.3, torch.zeros(3))
    got = result.fields_at_radius(.5)
    phase = complex(np.exp(1j*2*np.pi*float(frequency[0])/C0*1.3*.5)/.5)
    assert abs(complex(got[0, 0, 1].detach())-phase) < 2e-7
    assert got.dtype == torch.complex64
    gradient, = torch.autograd.grad(got.abs().square().sum(), amplitude)
    assert torch.isfinite(gradient).all()


def test_complex_radiation_geometry_is_rejected_without_silent_real_cast():
    with pytest.raises(ValueError, match='must be real'):
        diffraction_orders(plane(), [(0, 0)], period_um=(2, 2),
                           bloch_wavevector_per_um=torch.tensor([.2+1j, 0j]))
    faces, bounds, _ = dipole_faces(4)
    with pytest.raises(ValueError, match='must be real'):
        project_farfield(faces, torch.tensor([[1+1j, 0j, 0j]]), bounds_um=bounds)
    with pytest.raises(ValueError, match='must be real'):
        project_farfield(faces, [[1., 0, 0]], bounds_um=bounds, phase_origin_um=torch.tensor([1j, 0j, 0j]))


def test_native_fdtd_closed_surface_objective_material_vjp_matches_difference():
    from torchfdtd import FieldMonitor, DifferentiablePlaneSimulation, AdjointOptions
    from test_differentiable import project
    p = project('3d', steps=35)
    p.monitors = []
    bounds = ((-.3, .3),)*3
    for d in range(3):
        for side in (0, 1):
            center, size = [0.]*3, [.6]*3
            center[d], size[d] = bounds[d][side], 0.
            p.monitors.append(FieldMonitor(id='xyz'[d]+('_min' if side == 0 else '_max'),
                center=tuple(center), size=tuple(size), normal='xyz'[d]))
    model = DifferentiablePlaneSimulation(p, AdjointOptions(checkpoints=2),
        quadrature_counts={m.id: (5, 5) for m in p.monitors})
    base = torch.ones(p.region.shape, dtype=torch.float64)
    mask = torch.zeros_like(base)
    mask[9:11, 6:9, 6:9] = 1
    frequency = torch.tensor([C0/1.1e-6], dtype=torch.float64)
    def objective(parameter):
        faces = model(base + parameter*mask, frequency)
        faces = {key: replace(face, fields=face.fields/p.region.time_step) for key, face in faces.items()}
        far = project_farfield(faces, [[1., 0, 0], [0., 1, 0]], bounds_um=bounds)
        return far.intensity().sum()*1e12
    x = torch.tensor(.3, dtype=torch.float64, requires_grad=True)
    value = objective(x)
    gradient, = torch.autograd.grad(value, x)
    h = 1e-4
    difference = (objective(x.detach()+h) - objective(x.detach()-h))/(2*h)
    assert abs(float(gradient)) > 1e-8
    torch.testing.assert_close(gradient, difference, rtol=2e-6, atol=1e-10)
