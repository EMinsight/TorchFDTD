"""Preview exactly the temporal samples passed to the native field updates."""
import numpy as np

from .solver import source_time_signal
from .waveforms import pulse_parameters


def preview_source(project, source_id):
    original = next((s for s in project.sources if s.id == source_id), None)
    if original is None:raise ValueError('Source not found in this project')
    source = project.resolved_source(original)
    region = project.region
    times = np.arange(1, region.steps+1)*region.time_step+source.time_offset_steps*region.time_step
    values = source_time_signal(source, times).astype(region.precision)
    injections = []
    plane = None
    box=None
    if source.kind=='tfsf' and source.enabled:
        from .tfsf import incident_preview,tfsf_metadata
        values,h,far=incident_preview(source,region)
        box=tfsf_metadata(source,region)
        injections=[dict(field='incident E at entry',signal=values.tolist(),time_fs=(times*1e15).tolist()),
                    dict(field='incident H at entry',signal=h.tolist(),time_fs=((times+.5*region.time_step)*1e15).tolist()),
                    dict(field='incident E at exit',signal=far.tolist(),time_fs=(times*1e15).tolist())]
    elif source.injection == 'oneway' and source.enabled:
        from .injection import oneway_tables, source_terms, oneway_metadata
        plane = oneway_metadata(source,region)
        values = oneway_tables(source, region)[0].astype(region.precision)
        for field, loc, increment, _ in source_terms(project, source):
            offset = .5 if field.startswith('H') else 0.
            injections.append(dict(field=field,
                time_fs=((np.arange(1, region.steps+1)*region.time_step+offset*region.time_step)*1e15).tolist(),
                signal=increment.astype(region.precision).tolist(),
                slice_indices=[[part.start,part.stop] for part in loc]))
    if not source.enabled:values[:] = 0
    # Single-sided amplitude, no window, no source-power normalization.
    transform = np.fft.rfft(values)/len(values)
    transform[1:-1 if len(values)%2 == 0 else None] *= 2
    frequencies = np.fft.rfftfreq(len(values), region.time_step)
    # Keep every actual sample: downsampling oscillations can hide aliasing.
    return dict(name=source.name, id=source.id, enabled=source.enabled,
                inherited=original.use_global_source, dt_fs=region.time_step*1e15,
                pulse_parameters=pulse_parameters(source).as_dict() if source.pulse in ('gaussian','broadband') else None,
                time_fs=(times*1e15).tolist(), signal=values.astype(float).tolist(),
                field_family=source.component[0],time_offset_steps=source.time_offset_steps,
                injection=source.injection, injections=injections, plane=plane,tfsf=box,
                polarization_components=dict(source.polarization_components),
                frequency_thz=(frequencies[1:]*1e-12).tolist(),
                wavelength_um=(299792458/frequencies[1:]*1e6).tolist(),
                spectrum=abs(transform[1:]).tolist(), spectrum_units='reduced injection',
                spectrum_settings={'sampling':'fft','apodization':'none'},
                time_label='Time (fs) · temporal injection (reduced units)',
                note=('TFSF incident E at the entry face before polarization weights. The preview also includes canonical incident H and exit-face E. '
                     'These are the live auxiliary-line fields, not the individual face correction amplitudes. '
                     'The eight-cell delay and numerical dispersion are retained. Amplitude scales the soft drive, not calibrated incident power.' if source.kind=='tfsf' else
                     'One-way E correction before polarization weights. Paired E/H correction arrays are included in this preview. '
                     'The incident Yee line retains an eight-cell propagation delay and discrete dispersion. '
                     'Amplitude scales its soft drive, not a calibrated incident power.' if source.injection=='oneway' else
                     'Actual mesh-time samples, including local amplitude and phase. '
                     'Magnetic injection uses the H half-step time. The plotted envelope precedes signed vector weights. '
                     'Sheet spatial phase is not plotted. FFT uses the full simulation interval without a window.'))
