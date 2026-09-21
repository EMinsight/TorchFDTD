# Point monitor spectra and apodization

Reflection, transmission and absorption against a reference run, S-parameters with group delay, mode decomposition, diffraction orders and far-field projections are read from the recorded planes through one record type; see [RESULTS.md](RESULTS.md) and the guards of its normalizations in [NUMERICAL_GUARDS.md](NUMERICAL_GUARDS.md).

Version 0.3 adds native point-trace DFT sampling and time apodization. A monitor's wavelength range does **not** change the source bandwidth. Source centre wavelength, [global temporal settings and custom tables](SOURCES.md), and [automatic broadband source ranges](BROADBAND.md) are configured separately.

## Workbench

Select a point monitor in the Objects Tree. Under **Frequency / wavelength**, choose FFT bins, Uniform frequency (DFT), or Uniform wavelength (DFT). The DFT choices expose minimum wavelength, maximum wavelength, and frequency points. Under **Apodization**, choose None, Start, End, Full, or the legacy Hann window. Start/End/Full expose center and time width in femtoseconds. Saved JSON and Python use seconds.

After Run, select the monitor in the plot toolbar. The time view overlays its window as a dashed curve, from zero at the plot midline to one at the top. Field spectrum can use a frequency or wavelength axis. The CSV button exports the displayed result type for all monitors. NPZ preserves full traces, complex spectral values, frequency samples, and the exact settings.

## Definition

Let `d = t - apodization_center` and `w = apodization_time_width`.

| Mode | Window |
| --- | --- |
| None | 1 |
| Full | `exp(-2 ln(2) (d/w)^2)` |
| Start | Full for `d < 0`, otherwise 1 |
| End | Full for `d > 0`, otherwise 1 |
| Hann | `0.5 - 0.5 cos(2 pi j/(N-1))`, indexed over the recorded trace |

The Gaussian width is the **intensity FWHM**: the squared Full window equals 0.5 at `center ± width/2`. This defines the native Gaussian window convention. The official [monitor reference](https://optics.ansys.com/hc/en-us/articles/360034902393-Frequency-domain-monitor-Simulation-object) describes the sampling and window controls. The [apodization explanation](https://optics.ansys.com/hc/en-us/articles/360034902473-Understanding-time-apodization-in-frequency-domain-monitors) explains why windowed fields generally do not retain source power normalization.

Custom-frequency output is `dt * sum(E(t) * window(t) * exp(+2 pi i f t))`, with units of reduced field × seconds. Frequency spacing is uniform between `c/lambda_max` and `c/lambda_min`; wavelength spacing is uniform between the two wavelengths. One point uses the center in the chosen spacing coordinate. Samples must remain below temporal Nyquist. Increasing the number of samples does not improve the resolution imposed by simulation duration and window width.

The legacy FFT path retains its historical magnitude and scale, `2/N` for real traces and `1/N` for complex traces, with the negative Fourier sign. Complex phase includes the recorded time origin. No window-gain correction is applied. The two transform conventions and units are included in exported metadata. The plot shows one monitor at a time to avoid overlaying incompatible scales.

## Python and exports

```python
from torchfdtd import Monitor, SpectrumSettings

monitor = Monitor(
    name="resonance", center=(2, 0, 0),
    spectrum=SpectrumSettings(
        sampling="wavelength", wavelength_start=1.3, wavelength_stop=1.8,
        frequency_points=101, apodization="start",
        apodization_center=50e-15, apodization_time_width=25e-15,
    ),
)
```

`result.spectra[k]` contains complex values and frequencies in Hz. `result.monitor_data()` supplies JSON-safe real/imaginary arrays and display units. In NPZ, `monitor_k_frequency_hz` and `monitor_k_spectrum` are paired with the JSON `monitor_spectra` metadata. `times` tags E; H samples follow their half-step update and their spectral/time-view tags are offset by `dt/2`. E/H remain spatially staggered and are not collocated flux samples.

The limited familiar facade supports `adddft()` for a **point** DFT, `minimum wavelength`/`maximum wavelength` in metres, `frequency points`, `use wavelength spacing`, and the three apodization properties. It intentionally does not expose an `addpower()` alias that would imply surface power integration.

## Limits and evidence

Spectral processing uses bounded-memory CPU chunks after the CPU/CUDA field solver completes. It does not add DFT operations to the CUDA time-stepping graph. `summary.seconds` remains solver-loop time and must not be presented as spectral-processing or end-to-end time.

There is no source normalization, power/flux integration, distributed DFT monitor, spectral averaging, Chebyshev/custom sample table, or global monitor inheritance yet. The licensed FSP inspector remains separate. The independent [native importer](FSP_NATIVE.md) maps a subset of point monitor settings, with additional FSP-specific restrictions.

Plane E/H monitors, global/custom sampling and reference-normalized flux are described in the [Python guide](PYTHON_BATCH.md). Current validation uses analytic transforms, the native lossless-slab solution and CPU/CUDA parity only.
