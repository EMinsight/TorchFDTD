# Source time signals and shared settings

Version 0.12 adds [electric/magnetic theta/phi vector excitation](DIPOLE_SOURCES.md), including per-component Yee placement and H half-step injection.

Version 0.5 adds user-supplied temporal signals, global temporal settings, and source waveform/spectrum previews. Version 0.6 also implements [automatic wavelength/frequency ranges, chirped pulses and endpoint tapering](BROADBAND.md). Native geometry and wavelength use micrometres. Time arrays use seconds, table phase uses unwrapped radians, and each source's additional phase uses degrees.

## Workbench

Select a source in the Objects Tree. **Use global source settings** inherits the shared wavelength and temporal pulse definition. **Edit global source settings** edits that shared definition. The local amplitude, phase, polarization and geometry remain independent. Turning inheritance off restores the saved local pulse. Imported unsupported global settings are unavailable until explicitly configured in this dialog.

**Load / edit time signal** opens a CSV/JSON editor. The first CSV row must be `time_s,amplitude,phase_rad`; subsequent rows contain three finite numbers. JSON uses three arrays with those names. Arrays need equal lengths, from 2 to 100,000 samples, with nonnegative, strictly increasing times. The dialog shows a short table preview and exports the complete CSV. Applying a signal selects the User time signal pulse. Earlier Gaussian parameters remain available when switching back.

**Preview time signal / spectrum** evaluates the same samples used by the solver: `t = dt, 2*dt, ..., steps*dt`, including source amplitude and phase and the selected float precision. Disabled sources preview as zero. The FFT uses the full time interval, without a window, and reports a single-sided amplitude spectrum. DC is omitted from the spectrum plot; the even-length Nyquist bin is not doubled. The preview is a temporal injection in reduced units. A sheet's Bloch spatial phase is not displayed.

Large tables can exceed browser local-storage quotas. A failed automatic save leaves editing and file export available and displays a message to use **Save** before closing or reloading. The server accepts native project requests up to 32 MB; a time-table upload is limited to 16 MB. JSON, Python export and result NPZ preserve the complete arrays and global/local settings.

## Temporal definition

For a custom table, native injection is

`source.amplitude * interp(table.amplitude, t) * sin(interp(table.phase_rad, t) + radians(source.phase))`.

Amplitude and unwrapped phase are interpolated separately and linearly. Interpolating the already oscillating electric field gives a different waveform. Injection is zero outside the closed table time range. Wavelength remains descriptive for the custom table and mesh-resolution warnings; changing it does not rescale or regenerate the supplied phase. Users must sample their phase/envelope adequately and resolve the actual spectrum with the mesh and time step.

The legacy Gaussian uses `sigma = pulse_cycles*wavelength/c`, offset `4*sigma`, and `sin(+omega*t+phase)`. Standard Gaussian mode uses `sigma = pulselength/(2*sqrt(log(2)))` and `sin(-omega*(t-offset)+phase)`, where pulselength is the power FWHM. Continuous mode uses a smooth turn-on and ignores Gaussian offset. Native injection is not a calibrated physical dipole moment.

## Python

```python
from photonweave import FDTD

f = FDTD()
f.adddipole(name='source')
f.setglobalsource('set time domain', True)
f.setglobalsource('frequency', 210e12)
f.setglobalsource('pulselength', 23e-15)
f.setglobalsource('offset', 67e-15)
f.setnamed('source', 'override global source settings', False)
assert abs(f.getglobalsource('frequency') - 210e12) < 1

# Loading a local signal turns off global inheritance for this source.
f.setsourcesignal('source', [0, 10e-15, 40e-15, 60e-15],
                  [0, 1, .5, 0], [0, -12, -48, -72])
f.save('custom-source.json')
```

The familiar facade supports the four-argument `setsourcesignal` form and a documented subset of global temporal properties. It does not implement the optional frequency/bandwidth overload, automatic bandwidth estimation, material fitting, or automatic source-range mesh selection. The [official custom-signal command](https://optics.ansys.com/hc/en-us/articles/360034929053-setsourcesignal-Script-command) and [global-source command](https://optics.ansys.com/hc/en-us/articles/360034928813-setglobalsource-Script-command) describe the broader vendor APIs. Native `SourceTimeSettings` and `TimeSignal` also allow direct project construction, including a shared custom signal.

## FSP and validation

The independent importer maps tested v241 local custom arrays and standard global settings, while retaining the local overrides and original FSP bytes. Saved effective values are checked against the global record. Unknown active source definitions block conversion. Automatic range and manual chirp definitions are supported since v0.6. Unsupported unused global settings produce a warning instead of an invented replacement pulse.

DC removal, calibrated dipole normalization, oblique/finite-aperture beams and mode/port sources remain unimplemented. Version 0.6 implements the measured Gaussian endpoint taper, which is not a general signal-smoothing filter. Matching a source waveform does not establish full physical or application parity.


Current validation uses mathematical waveform identities and native CPU/CUDA parity. Historical vendor waveform measurements are excluded from active documentation and distribution. The provenance of legacy automatic timing rules remains recorded for release review.

Version 0.13 adds [normal-incidence one-way planes](ONEWAY_SOURCES.md), using these same temporal controls to prepare paired discrete E/H corrections. Their incident-line delay and amplitude definition are documented separately.

Version 0.14 adds [closed normal-incidence TFSF boxes](TFSF_SOURCES.md). The same temporal drive advances a live scalar Yee line, with sparse E/H corrections on the surrounding faces. These are available through Python, the SI facade, the UI and CUDA tensor batches. Oblique and FSP TFSF support remain open.
