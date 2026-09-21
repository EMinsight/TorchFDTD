# Port diagnostics

`torchfdtd.ports` adds per-port diagnostics on top of the fixed periodic-supercell
eigenmodes of [mode_ports.md](mode_ports.md): mode tracking across a wavelength band,
the normalization convention, reference-plane shifts, forward/backward separation, and
diagnostics for degenerate pairs and weakly confined modes. It computes nothing new about
the solver; it organizes what the solver returns so that a user can inspect a port
without assembling private functions. Gate task G6-04 records it against
[cases/G6-04.json](validation/cases/G6-04.json).

```python
from torchfdtd import track_port_modes, port_diagnostics, deembed_s_matrix, separate_directions

tracked = track_port_modes(section, (1.5, 1.55, 1.6), shape=(80, 4), spacing_um=(.05, .05),
                           normal='z', num_modes=2, candidates=4, minimum_overlap=.9)
tracked.neff            # (wavelengths, tracks)
tracked.minimum_overlap # smallest |power overlap| between consecutive wavelengths

report = port_diagnostics(tracked.modes[1], core=lambda u, v: abs(u) < .25, confinement_threshold=.5)
report.clusters, report.overlap, report.confinement, report.weak_modes
```

## Gradients: fixed basis, fixed section

Every mode here is a fixed basis. `solve_waveguide_modes` carries no Torch graph, so the
propagation constant and the profile are constants of the design problem; the functions
of this module that accept Torch tensors (`separate_directions`, `shift_reference_plane`,
`deembed_s_matrix`) preserve the graph of the *plane fields or amplitudes* only. A
gradient that reaches a design variable through a port therefore is the derivative at a
fixed mode: the interior material moves the fields that are projected onto the mode, the
mode itself never moves. The eigenmode's own derivative with respect to the permittivity
is not implemented in any layer ([COMPATIBILITY.md](COMPATIBILITY.md), known limitations).

A port cross-section that becomes a design variable is refused by name. `fixed_port_section`
returns the section as the solvers see it and raises `FixedPortSectionError` (a `ValueError`)
when the section is a tensor with `requires_grad`, or a callable that returns one.
`track_port_modes`, `ModeNetwork` and `ModeBranchNetwork` all pass their sections through it,
so a trainable section fails before any eigenproblem is assembled, never silently detached.

## Normalization

`port_normalization()` returns the convention as data; every `PortDiagnostics` and
`TrackedPortModes` report carries the same dictionary:

- power: `0.5 Re(Eu Hv* - Ev Hu*)` summed over the transverse Yee cells times the SI cell
  area equals +1 for a forward mode and -1 for `mode.backward()`;
- phasor: `exp(+i beta w - i omega t)` with reduced H, beta in inverse micrometres;
- phase: the largest transverse E component is real and positive at the reference plane;
- degenerate clusters are power orthogonalized and rotated onto the canonical Eu-diagonal
  basis (`mode_ports.md`);
- units are reduced fields, not watts.

## Mode tracking across a band

`track_port_modes(section, wavelengths_um, *, shape, spacing_um, normal, num_modes,
candidates, minimum_overlap, precision, origin_um, target_neff)` solves the port at every
wavelength. The first wavelength's first `num_modes` modes define the tracks; at each later
wavelength `candidates` modes (default `num_modes + 2`) are solved and assigned to the
tracks by the maximum-weight matching of the absolute power overlaps
(`mode_power_overlap`) with the previous wavelength, so two tracks can never claim one
candidate and a crossing pair is followed by overlap, not by solver order. `overlaps[w-1, m]`
and `minimum_overlap` are reported; a minimum below the declared `minimum_overlap` issues
`ModeTrackingWarning` and is never repaired. `solver_index` records which solver mode became
each track. On the analytic slab of `tests/test_ports.py` (TE0 and TM0, 1.45 to 1.65 um) the
minimum overlap exceeds 0.99 and both tracks follow the analytic dispersion within 2e-3 in
effective index.

## Reference planes

`shift_reference_plane(amplitude, mode, distance_um, direction)` multiplies a forward
amplitude by `exp(+i beta d)` and a backward amplitude by `exp(-i beta d)`, the phase of
the mode's own propagation constant over the stated distance; nothing is re-solved.
`deembed_s_matrix(s, modes, lengths_um)` strips `lengths_um[k]` of matched straight guide
from channel k of a network matrix: `S'[i, j] = S[i, j] exp(-i beta_i l_i) exp(-i beta_j l_j)`.
A straight guide of length 2L between phase planes at -L and +L has `S21 = exp(2 i beta L)`
(the recorded network fixture) and becomes the identity after de-embedding L at each end.
Both accept NumPy values or Torch tensors and keep a Torch graph on the amplitudes.

## Forward and backward separation

`separate_directions(plane, mode)` returns the forward and backward amplitudes of one
fixed mode on a `DifferentiablePlaneResult`, per frequency, from the Lorentz overlaps
`a+ = int[(E x Hm*) + (Em* x H)] . w / (4 Pm)` and `a- = int[(E x Hm*) - (Em* x H)] . w / (4 Pm)`,
so a pure forward field gives exactly `a- = 0`. `|a|^2` is the modal reduced power in the
plane field units; `normalized_mode_power` divides by a reference and is the objective to
optimize. The plane must use the complete uniform midpoint quadrature of the mode supercell
at the mode's single frequency, the same admission as `normalized_mode_power`. Float32 plane
fields of SI scale (1e-22) must be divided by a reference scale before squaring, as the
objective does, or the square underflows.

## Degenerate pairs and weak modes

`port_diagnostics(modes, *, core, confinement_threshold, degeneracy_tolerance)` returns
`PortDiagnostics` with:

- `clusters`: index tuples of equal-beta modes (`|beta_i - beta_j| <= tolerance * max`),
  the canonical basis the solver already applied within each cluster;
- `overlap`: the complex power Gram matrix; its distance from the identity is the
  non-orthonormality of the returned basis (`report()['overlap_max_off_diagonal']`);
- `confinement`: the fraction of the summed squared six-component amplitude inside the
  declared core (a boolean cell mask or `core(u_um, v_um)` at the cell centres); `NaN`
  without a core;
- `weak_modes`: indices below `confinement_threshold`, each with a `WeakModeWarning` that
  names the mode, its effective index and its confinement. A weak mode's periodic images and
  aperture edges are not negligible, so its port is not an isolated guide.

The square guide of `tests/test_ports.py` (0.6 um core of epsilon 4 in 2.25) reports the
cluster `(0, 1)`, an overlap matrix within 2e-4 of the identity, the u-polarized mode first,
and both modes above 0.5 confinement; a 0.1 um core of epsilon 2.3 in 2.25 reports its
fundamental mode weak below 0.5 and warns.

## Limits

The confinement factor counts amplitude, not flux, and assigns every component of a cell to
that cell. Tracking follows overlap only; a mode that leaves the propagating window is
absent from the solver's candidates and the assignment then reports the best remaining
overlap, which the minimum-overlap warning exposes. Open (CPML) port modes of
[OPEN_MODE_PORTS.md](OPEN_MODE_PORTS.md) have their own solver and are not tracked here.
