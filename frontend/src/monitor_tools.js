import {openDiffraction} from './radiation_tools.js';
import {openFarfield} from './farfield_tools.js';
import {openPropagation} from './propagation_tools.js';
import {drawPlot} from './views.js';

export function spectralControls(s,numeric,dropdown,{plane=false,prefix='spectrum.'}={}){
 const sampling=s.sampling,options=[...(!plane?[['fft','FFT bins']]:[]),['frequency','Uniform frequency'],['wavelength','Uniform wavelength'],['chebyshev','Chebyshev nodes'],['custom','Custom frequencies']];
 return dropdown('sample spacing',prefix+'sampling',sampling,options)+(sampling==='custom'?`<label class="monitor-custom">Frequencies (THz)<textarea data-frequency-table data-prefix="${prefix}" aria-label="Custom frequencies (THz)">${(s.custom_frequencies_hz||[]).map(f=>f*1e-12).join('\n')}</textarea></label>`:sampling!=='fft'?`<label class="enabled-row"><input type="checkbox" data-path="${prefix}use_source_limits" ${s.use_source_limits?'checked':''}> Use source wavelength limits</label><fieldset ${s.use_source_limits?'disabled':''}>`+numeric('minimum wavelength',prefix+'wavelength_start',s.wavelength_start,'µm',{min:.001})+numeric('maximum wavelength',prefix+'wavelength_stop',s.wavelength_stop,'µm',{min:.001})+'</fieldset>'+numeric('frequency points',prefix+'frequency_points',s.frequency_points,'',{min:1,step:1})+(sampling==='chebyshev'?dropdown('Chebyshev node rule',prefix+'chebyshev_nodes',s.chebyshev_nodes||'roots',[['roots','Roots (interior)'],['lobatto','Lobatto (include endpoints)']])+`<label class="enabled-row"><input type="checkbox" data-path="${prefix}chebyshev_wavelength" ${s.chebyshev_wavelength?'checked':''}> Chebyshev nodes in wavelength</label>`:''):'');
}

export function fieldMonitorControls(m,r,numeric,dropdown){
 const fields=m.record_fields??['Ex','Ey','Ez','Hx','Hy','Hz'],poynting=m.record_poynting??['x','y','z'];
 const strides=m.downsample_xyz??[m.downsample||1,m.downsample||1,m.downsample||1];
 const outputs=(family,names,selected)=>names.map(c=>`<label class="enabled-row"><input type="checkbox" data-record-family="${family}" value="${c}" ${selected.includes(c)?'checked':''}> Record ${family==='record_poynting'?'P'+c:c}</label>`).join('');
 return dropdown('normal axis','normal',m.normal,r.dimension==='2d'?['x','y']:['x','y','z'])+
  ['x','y','z'].filter(a=>a!==m.normal&&(r.dimension==='3d'||a!=='z')).map(a=>numeric('downsample '+a,'downsample_xyz.'+'xyz'.indexOf(a),strides['xyz'.indexOf(a)],'',{min:1,max:32,step:1})).join('')+
  dropdown('spatial interpolation','spatial_interpolation',m.spatial_interpolation||'specified',[['specified','Specified plane'],['nearest','Nearest normal mesh node']])+
  dropdown('DFT accumulation precision','dft_precision',m.dft_precision||'field',[['field','Match solver precision'],['float64','Double precision']])+
  outputs('record_fields',['Ex','Ey','Ez','Hx','Hy','Hz'],fields)+outputs('record_poynting',['x','y','z'],poynting)+
  `<label class="enabled-row"><input type="checkbox" data-path="record_flux" ${m.record_flux!==false?'checked':''}> Record signed flux</label><p class="property-help">Only fields required by the selected outputs are accumulated. Flux alone requires four tangential E/H components. Incident subtraction also requires storing those fields.</p><button data-action="flux-results">Open flux results</button>`;
}

export function setupMonitorTools({state,api,esc,toast,commit,numeric,dropdown}){
 const dialog=document.createElement('dialog');dialog.className='monitor-dialog';document.body.append(dialog);
 const $=s=>dialog.querySelector(s);let revision=0;
 function dismiss(){dialog.querySelectorAll('[data-dismiss]').forEach(b=>b.onclick=()=>{revision++;dialog.close();});}
 return {
  globals(){
   const draft=structuredClone(state.project);draft.global_monitor??={sampling:'frequency',wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:'none',apodization_center:20e-15,apodization_time_width:10e-15,custom_frequencies_hz:[],chebyshev_wavelength:false};
   function render(){const s=draft.global_monitor;dialog.innerHTML=`<div class="fsp-heading"><h2>Global monitor settings</h2><button data-dismiss>Close</button></div><fieldset ${state.mode!=='layout'?'disabled':''}>${spectralControls(s,numeric,dropdown,{plane:true,prefix:''})}${dropdown('apodization','apodization',s.apodization,['none','start','end','full'])}${numeric('apodization center','apodization_center',s.apodization_center*1e15,'fs',{scale:1e-15})}${numeric('apodization time width','apodization_time_width',s.apodization_time_width*1e15,'fs',{scale:1e-15})}<button data-apply>Apply monitor settings</button></fieldset><p class="monitor-status"></p>`;dismiss();
    dialog.querySelectorAll('[data-path]').forEach(input=>input.onchange=()=>{s[input.dataset.path]=input.type==='checkbox'?input.checked:input.type==='number'?Number(input.value)*Number(input.dataset.scale||1):input.value;if(['sampling','use_source_limits'].includes(input.dataset.path)){if(s.sampling==='custom'&&!s.custom_frequencies_hz?.length)s.custom_frequencies_hz=[200e12];render();}});
    const table=$('[data-frequency-table]');if(table)table.onchange=()=>{s.custom_frequencies_hz=table.value.trim().split(/[\s,;]+/).filter(Boolean).map(v=>Number(v)*1e12);};
    $('[data-apply]').onclick=async()=>{try{const v=await api('/validate',draft);commit(v.project);dialog.close();}catch(e){$('.monitor-status').textContent=e.message;}};
   }render();dialog.showModal();
  },
  async flux(){
   if(!state.job)throw Error('Run a project with a frequency monitor first.');
   const job=await api('/jobs/'+state.job),monitors=job.flux_monitors||[];
   // Diffraction may use six stored fields even when raw flux was disabled.
   const jobs=await api('/jobs');
   dialog.innerHTML=`<div class="fsp-heading"><h2>Frequency fields / power flux</h2><button data-dismiss>Close</button></div><label>Monitor <select aria-label="Flux monitor">${monitors.map(m=>`<option value="${esc(m.id)}">${esc(m.name)} · +${m.normal}</option>`).join('')}</select></label><label>Reference run <select aria-label="Flux reference"><option value="">Raw signed flux</option>${jobs.filter(j=>j.id!==state.job&&j.flux_monitors.length).map(j=>`<option value="${j.id}">${esc(j.name)} · ${j.id.slice(0,8)}</option>`).join('')}</select></label><label class="enabled-row"><input type="checkbox" aria-label="Subtract incident fields"> Subtract reference E/H before computing flux (reflection)</label><button data-plot-flux>Plot flux</button><button data-diffraction>Diffraction orders</button><button data-farfield>Closed-box far field</button><button data-propagate>Angular spectrum</button><a href="/api/jobs/${state.job}/flux.csv">Export raw flux CSV</a><canvas></canvas><p class="monitor-status"></p><p>Flux is signed along the positive monitor normal. A reflected wave can be negative. Reference normalization requires identical sources, mesh, duration and unapodized monitors. For an air reference, freeze graded refinements before removing structures, then run both scenes with the same monitor IDs. Absolute watt calibration is not provided.</p>`;
   dismiss();
   async function plot(){const token=++revision;try{
    const m=monitors.find(m=>m.id===$('[aria-label="Flux monitor"]').value),ref=$('[aria-label="Flux reference"]').value,subtract=$('[aria-label="Subtract incident fields"]').checked;
    let series={...m,spectrum:m.flux,signed:true,spectrum_label:`Wavelength (µm) · signed flux (${m.units})`};
    if(ref){const result=await api(`/jobs/${state.job}/normalize-flux?reference=${encodeURIComponent(ref)}&monitor=${encodeURIComponent(m.id)}&subtract_incident=${subtract}`);if(token!==revision)return;series={...m,...result,spectrum:result.ratio,signed:true,spectrum_label:'Wavelength (µm) · signed normalized flux'};$('.monitor-status').textContent=`${result.valid.filter(Boolean).length}/${result.valid.length} frequencies above the reference threshold. Reflection is negative for propagation opposite the positive normal.`;}
    else $('.monitor-status').textContent=`${m.points} spatial samples · collocated E/H · ${m.flux.length} frequencies. Raw reduced flux is not normalized transmission.`;
    drawPlot($('canvas'),[series],true,true);
   }catch(e){if(token===revision){$('.monitor-status').textContent=e.message;toast(e.message);}}}
   $('[data-diffraction]').onclick=async()=>{try{await openDiffraction({state,api,esc,toast});dialog.close();}catch(error){toast(error.message);}};
   $('[data-farfield]').onclick=async()=>{try{await openFarfield({state,api,esc,toast});dialog.close();}catch(error){toast(error.message);}};
   $('[data-propagate]').onclick=async()=>{try{await openPropagation({state,api,esc,toast});dialog.close();}catch(error){toast(error.message);}};
   $('[data-plot-flux]').onclick=plot;$('[data-plot-flux]').disabled=!monitors.length;dialog.showModal();if(monitors.length)await plot();else $('.monitor-status').textContent='No raw flux recorded. Diffraction orders can use a stored six-field plane.';
  }
 };
}
