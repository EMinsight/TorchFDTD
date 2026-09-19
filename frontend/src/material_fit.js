import { drawPlot } from './views.js';

export function setupMaterialFit({host,material,editable,api,esc,begin,current,invalidate,timestep,use}) {
 const $=s=>host.querySelector(s);
 const band=material.fit_band_um||[material.samples?.wavelength_um[0]||'',material.samples?.wavelength_um.at(-1)||''];
 host.innerHTML=`<details class="material-fit"><summary>Measured optical data · import and fit</summary>
 <p>Supply your own passive isotropic n/k or complex permittivity samples. The table and its reference are saved with the project.</p>
 <fieldset ${editable?'':'disabled'}>
 <div class="fit-controls"><label>Columns <select aria-label="Optical data columns"><option value="nk">Wavelength, n, k</option><option value="epsilon">Wavelength, ε real, ε imaginary</option></select></label>
 <label>Wavelength unit <select aria-label="Optical wavelength unit"><option value="um">µm</option><option value="nm">nm</option><option value="m">m</option></select></label>
 <label>CSV / text file <input aria-label="Optical data file" type="file" accept=".csv,.txt,.tsv"></label></div>
 <textarea aria-label="Optical data table" rows="5" placeholder="wavelength_um,n,k&#10;1.0,1.50,0.01&#10;1.5,1.49,0.01&#10;2.0,1.48,0.01"></textarea>
 <label class="fit-reference">Data reference <input aria-label="Optical data reference" maxlength="2000" value="${esc(material.samples?.reference||'')}" placeholder="Citation or measurement description"></label>
 <button data-import>Import data</button><span data-data-status>${material.samples?`${material.samples.wavelength_um.length} samples retained`:'No samples imported'}</span>
 <div class="fit-controls"><label>Fit start (µm) <input aria-label="Fit wavelength start" type="number" step="any" min="0" value="${band[0]}"></label>
 <label>Fit stop (µm) <input aria-label="Fit wavelength stop" type="number" step="any" min="0" value="${band[1]}"></label>
 <label>Maximum poles <input aria-label="Maximum fit poles" type="number" min="1" max="16" value="6"></label>
 <label>RMS tolerance <input aria-label="Fit tolerance" type="number" min="0" max="1" step="any" value="0.001"></label>
 <label>Response <select aria-label="Fit response"><option value="analytic">Continuous material</option><option value="ade">FDTD at current timestep</option></select></label>
 <label><input aria-label="Include Drude pole" type="checkbox" checked> Include Drude pole</label></div>
 <button data-fit ${material.samples?'':'disabled'}>Fit optical data</button> <button data-use-fit disabled>Use fitted material</button>
 </fieldset><p class="fit-status" role="status">Fit accuracy applies inside the sampled band. Device accuracy also requires time and mesh convergence.</p>
 <canvas aria-label="Measured and fitted optical response"></canvas></details>`;
 let candidate=null;
 const status=message=>{$('.fit-status').textContent=message;};
 function changed(){candidate=null;$('[data-use-fit]').disabled=true;invalidate();status('Inputs changed. Fit again to update the candidate.');const canvas=$('canvas');canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);}
 host.querySelectorAll('input,select,textarea').forEach(input=>input.oninput=changed);
 host.querySelectorAll('textarea,[aria-label="Optical data columns"],[aria-label="Optical wavelength unit"],[aria-label="Optical data file"]').forEach(input=>input.addEventListener('input',()=>{$('[data-fit]').disabled=true;}));
 $('[aria-label="Optical data file"]').onchange=async e=>{
  const token=begin(),file=e.target.files[0];if(!file)return;
  if(file.size>2_000_000){status('Optical data file exceeds 2 MB.');return;}
  try {const text=await file.text();if(!current(token))return;$('textarea').value=text;$('[aria-label="Optical data reference"]').value=file.name;changed();}
  catch(e){if(current(token))status(e.message);}
 };
 $('[data-import]').onclick=async()=>{
  const token=begin();status('Reading optical samples…');
  try {
   const data=await api('/materials/data',{text:$('textarea').value,kind:$('[aria-label="Optical data columns"]').value,
    unit:$('[aria-label="Optical wavelength unit"]').value,reference:$('[aria-label="Optical data reference"]').value});
   if(!current(token))return;
   material.samples=data;material.fit_band_um=null;material.fit_dt_s=null;candidate=null;
   $('[aria-label="Fit wavelength start"]').value=data.wavelength_um[0];$('[aria-label="Fit wavelength stop"]').value=data.wavelength_um.at(-1);
   $('[data-data-status]').textContent=`${data.wavelength_um.length} samples · ${data.wavelength_um[0]}–${data.wavelength_um.at(-1)} µm`;
   $('[data-fit]').disabled=!editable;$('[data-use-fit]').disabled=true;
   invalidate();status('Data imported. Fit to create simulation coefficients.');
  }catch(e){if(current(token))status(e.message);}
 };
 $('[data-fit]').onclick=async()=>{
  const token=begin();candidate=null;$('[data-use-fit]').disabled=true;status('Fitting passive oscillators…');
  try {
   const options={max_poles:Number($('[aria-label="Maximum fit poles"]').value),tolerance:Number($('[aria-label="Fit tolerance"]').value),
    wavelength_range_um:[Number($('[aria-label="Fit wavelength start"]').value),Number($('[aria-label="Fit wavelength stop"]').value)],
    include_drude:$('[aria-label="Include Drude pole"]').checked,target:$('[aria-label="Fit response"]').value};
   const data=structuredClone(material.samples);data.reference=$('[aria-label="Optical data reference"]').value;
   options.dt_s=await timestep();if(!current(token))return;
   const result=await api('/materials/fit',{data,options,name:material.name,color:material.color});if(!current(token))return;
   candidate=result;const r=result.report,key=r.target==='ade'?'numerical':'fitted';
   drawPlot($('canvas'),[['measured_n','n (data)'],['measured_k','k (data)'],[`${key}_n`,'n (fit)'],[`${key}_k`,'k (fit)']].map(([key,name])=>({name,wavelength_um:r.wavelength_um,spectrum:r[key],spectrum_label:'Wavelength (µm) · measured and fitted n + i k'})),true,true);
   status(`${r.converged?'Tolerance met':'Tolerance NOT met'} · ${r.pole_count} poles · ${r.sample_count} samples · analytic RMS ${r.analytic.normalized_rms.toExponential(3)} · FDTD RMS ${r.ade.normalized_rms.toExponential(3)} at Δt ${(r.dt_s*1e15).toPrecision(5)} fs · ${r.seconds.toFixed(2)} s. ${r.converged?'Use fitted material, then Apply materials to save.':'Adjust the fit band or pole limit. Current coefficients have not changed.'}`);
   $('[data-use-fit]').disabled=!editable||!r.converged;
  }catch(e){if(current(token))status(e.message);}
 };
 $('[data-use-fit]').onclick=()=>{if(candidate?.report.converged)use(candidate.material);};
 return {invalidate(){candidate=null;$('[data-use-fit]').disabled=true;status('Material parameters changed. Fit again to update the candidate.');}};
}
