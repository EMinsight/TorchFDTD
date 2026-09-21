import { drawPlot } from './views.js';
import { setupMaterialFit } from './material_fit.js';

const defaults={model:'dielectric',index:1.5,color:'#60bdaa',epsilon_inf:1,plasma_rad_s:2e15,collision_rad_s:1e14,resonance_rad_s:2e15,linewidth_rad_s:1e14,delta_epsilon:1,poles:[],epsilon_tensor:[2.25,2.25,2.25,0,0,0]};
export function setupMaterials({state,api,esc,toast,commit}) {
 const dialog=document.createElement('dialog');dialog.className='material-dialog';document.body.append(dialog);
 let draft,selected=0,revision=0,fitEditor;
 dialog.onclose=()=>{revision++;};
 const $=s=>dialog.querySelector(s);
 const label=(title,key,unit='',min=0)=>`<label class="material-field"><span>${title}</span><input aria-label="${title}" data-material-field="${key}" type="${key==='name'?'text':key==='color'?'color':'number'}" value="${esc(draft.materials[selected][key])}" ${key==='name'?'maxlength="100"':`min="${min}" step="any"`}><small>${unit}</small></label>`;
 const defaultPole=()=>({resonance_rad_s:2e15,strength_rad_s_squared:4e30,damping_rad_s:1e14});
 function poleEditor(m){
  return `<div class="pole-editor">${m.poles.map((pole,i)=>`<details open class="boundary-options"><summary>Pole ${i+1}</summary>${[['Resonance','resonance_rad_s','rad/s',0],['Oscillator strength','strength_rad_s_squared','rad²/s²',1e-30],['Damping','damping_rad_s','rad/s',0]].map(([title,key,unit,min])=>`<label class="material-field"><span>${title}</span><input aria-label="Pole ${i+1} ${title}" type="number" min="${min}" step="any" data-pole-index="${i}" data-pole-field="${key}" value="${esc(pole[key])}"><small>${unit}</small></label>`).join('')}<button data-remove-pole="${i}" ${m.poles.length<2?'disabled':''}>Remove pole ${i+1}</button></details>`).join('')}<button data-add-pole ${m.poles.length>=16?'disabled':''}>+ Add pole</button><p>Set resonance to zero for a Drude pole. Strength must be positive and damping nonnegative. Measured optical samples can be fitted below.</p></div>`;
 }
 function tensorEditor(m){
  return `<div class="tensor-material-editor"><p>Real symmetric relative permittivity in the Cartesian x, y, z basis. Principal permittivities must be at least 1.</p>${['xx','yy','zz','xy','xz','yz'].map((key,i)=>`<label class="material-field"><span>ε${key}</span><input aria-label="Tensor epsilon ${key}" data-tensor-index="${i}" type="number" step="any" value="${esc(m.epsilon_tensor[i])}"><small>relative</small></label>`).join('')}<p>Uniform 3D grid, resident FP32, point sources and monitors. Periodic/Bloch boundaries or PML with a fixed isotropic exterior. Geometry is sampled at common nodes.</p><button data-tensor-sampling>Use supported tensor sampling</button><p>This stages staircase geometry and Yee field sampling. Apply materials saves both changes.</p></div>`;
 }
 function tensorStatus(){return 'Tensor material: six Cartesian coefficients are used directly. Scalar n / k and isotropic optical-data fitting do not apply.';}
 // Provenance and band panel: what the fitted coefficients came from, the band they are valid in, and the
 // extrapolation warning the server's validation raises when a source band leaves it (docs/MATERIAL_FITTING.md).
 function provenancePanel(m){
  if(m.model==='tensor')return '';
  const p=m.provenance,band=m.fit_band_um;
  const row=(title,value)=>`<div><span>${title}</span><span>${value}</span></div>`;
  const rows=p?row('Source',esc(p.source))+row('Licence / usage',esc(p.licence||'not stated'))+row('Raw SHA-256',`<code title="${esc(p.raw_sha256)}">${esc(p.raw_sha256.slice(0,16))}\u2026</code>`)+row('File / columns',`${esc(p.file_name||'pasted text')} \u00b7 ${esc(p.columns)} in ${esc(p.wavelength_unit)}${p.imported?` \u00b7 imported ${esc(p.imported)}`:''}`):row('Source','No provenance recorded. Name the data source before importing a table.');
  const bandText=band?`${band[0]}\u2013${band[1]} \u00b5m${m.fit_dt_s?` \u00b7 ADE-target fit at \u0394t ${(m.fit_dt_s*1e15).toPrecision(5)} fs`:''}`:m.samples?'Samples retained, not fitted: no accuracy statement.':'No fitted band: analytic coefficients only.';
  return `<details open class="material-provenance" data-provenance><summary>Provenance and fitted band</summary><div class="provenance-grid">${rows}${row('Fitted band',bandText)}${row('Discretization n / k error',`<span data-discretization>Select Plot n / k to evaluate at the current timestep.</span>`)}${row('Simulation band',`<span data-band-status>Checking the project sources\u2026</span>`)}</div></details>`;
 }
 async function bandStatus(m){
  // Fills the panel rendered for this material; a re-render replaces the element, so a stale answer is dropped.
  const element=$('[data-band-status]');if(!element)return;
  try{const valid=await api('/validate',draft);if(!element.isConnected)return;
   const hits=(valid.warnings||[]).filter(w=>w.includes('fit band')&&w.includes(m.name));
   element.textContent=hits.length?hits.join(' '):m.fit_band_um?'Every enabled source band lies inside the fitted band.':'No fitted band to check against.';
   element.classList.toggle('band-warning',hits.length>0);
  }catch(e){if(element.isConnected)element.textContent=e.message;}
 }
 function render(){
  revision++;const m=draft.materials[selected];Object.entries(defaults).forEach(([k,v])=>m[k]??=structuredClone(v));
  dialog.innerHTML=`<div class="fsp-heading"><h2>Material database</h2><button data-dismiss>Close</button></div><p>Dielectric, full symmetric tensor, Drude, Lorentz and multiple passive poles.</p><div class="material-workspace"><aside><select size="8" aria-label="Material list">${draft.materials.map((a,i)=>`<option value="${i}" ${i===selected?'selected':''}>${esc(a.name)}</option>`).join('')}</select><button data-add-material>+ Add material</button></aside><section><fieldset ${state.mode!=='layout'?'disabled':''}>${label('Material name','name')}${label('Display color','color')}<label class="material-field"><span>Material model</span><select aria-label="Material model" data-material-field="model">${[['dielectric','Dielectric'],['tensor','Symmetric dielectric tensor'],['drude','Plasma (Drude)'],['lorentz','Lorentz'],['multipole','Multiple Drude / Lorentz poles']].map(([v,t])=>`<option value="${v}" ${m.model===v?'selected':''}>${t}</option>`).join('')}</select></label>${m.model==='tensor'?tensorEditor(m):m.model==='dielectric'?label('Refractive index','index','',1):label('Permittivity (epsilon infinity)','epsilon_inf','',1)}${m.model==='drude'?label('Plasma resonance','plasma_rad_s','rad/s')+label('Plasma collision','collision_rad_s','rad/s'):m.model==='lorentz'?label('Lorentz permittivity','delta_epsilon')+label('Lorentz resonance','resonance_rad_s','rad/s')+label('Lorentz linewidth','linewidth_rad_s','rad/s'):m.model==='multipole'?poleEditor(m):''}</fieldset><p class="material-formula">${m.model==='tensor'?'ε = [[εxx, εxy, εxz], [εxy, εyy, εyz], [εxz, εyz, εzz]]':m.model==='dielectric'?'ε = n²':m.model==='drude'?'ε(ω) = ε∞ − ωp² / (ω² + i γ ω)':m.model==='multipole'?'ε(ω) = ε∞ + Σ Aⱼ / (ωⱼ² − ω² − i γⱼ ω)':'ε(ω) = ε∞ + Δε ω₀² / (ω₀² − ω² − 2 i δ ω)'}${m.model==='tensor'?'':'<br>Frequency parameters above are angular frequencies, in rad/s.'}</p></section></div><div data-optical-fit></div>${provenancePanel(m)}<div class="material-range"><label>Wavelength start (µm) <input aria-label="Material wavelength start" type="number" value="1.3" min="0.001" step=".01"></label><label>Wavelength stop (µm) <input aria-label="Material wavelength stop" type="number" value="1.8" min="0.001" step=".01"></label><button data-preview>Plot n / k</button></div><canvas></canvas><p class="material-status" role="status">Preview includes the current simulation timestep.</p><div class="dialog-actions"><button data-apply ${state.mode!=='layout'?'disabled':''}>Apply materials</button><button data-dismiss>Cancel</button></div>`;
  fitEditor=m.model==='tensor'?null:setupMaterialFit({host:$('[data-optical-fit]'),material:m,editable:state.mode==='layout',api,esc,begin:()=>++revision,current:token=>token===revision&&dialog.open,invalidate:invalidatePreview,timestep:async()=>(await api('/validate',draft)).dt_fs*1e-15,use:material=>{draft.materials[selected]=material;render();preview();}});
  $('[aria-label="Material list"]').onchange=e=>{selected=+e.target.value;render();};
  $('[data-add-material]').disabled=state.mode!=='layout';
  $('[data-add-material]').onclick=()=>{let i=draft.materials.length;while(draft.materials.some(a=>a.name===`Custom material ${i}`))i++;draft.materials.push({...structuredClone(defaults),name:`Custom material ${i}`});selected=draft.materials.length-1;render();};
  dialog.querySelectorAll('[data-material-field]').forEach(input=>input.onchange=()=>{
   const key=input.dataset.materialField,old=m.name;
   if(key==='name'&&(!input.value.trim()||draft.materials.some((a,i)=>i!==selected&&a.name===input.value))){input.value=old;$('.material-status').textContent='Material names must be nonempty and unique.';return;}
   m[key]=['name','model','color'].includes(key)?input.value:Number(input.value);
   if(key==='name')draft.structures.forEach(s=>{if(s.material===old)s.material=m.name;});
   if(key==='model'&&m.model==='multipole'&&!m.poles.length)m.poles.push(defaultPole());
   if(key==='model'||key==='name')render();else invalidatePreview();
  });
  dialog.querySelectorAll('.material-range input').forEach(input=>input.onchange=invalidatePreview);
  dialog.querySelectorAll('[data-dismiss]').forEach(b=>b.onclick=()=>dialog.close());
  if($('[data-add-pole]'))$('[data-add-pole]').onclick=()=>{if(m.poles.length<16){m.poles.push(defaultPole());render();}};
  dialog.querySelectorAll('[data-remove-pole]').forEach(button=>button.onclick=()=>{m.poles.splice(+button.dataset.removePole,1);render();});
  dialog.querySelectorAll('[data-pole-field]').forEach(input=>input.onchange=()=>{m.poles[+input.dataset.poleIndex][input.dataset.poleField]=Number(input.value);invalidatePreview();});
  dialog.querySelectorAll('[data-material-field],[data-pole-field]').forEach(input=>input.addEventListener('input',invalidatePreview));
  dialog.querySelectorAll('[data-tensor-index]').forEach(input=>{
   input.onchange=()=>{m.epsilon_tensor[+input.dataset.tensorIndex]=Number(input.value);invalidatePreview();};
   input.addEventListener('input',invalidatePreview);
  });
  if($('[data-tensor-sampling]'))$('[data-tensor-sampling]').onclick=()=>{draft.region.interface_method='staircase';draft.region.material_sampling='yee';invalidatePreview();$('.material-status').textContent='Staircase geometry and Yee field sampling staged. Apply materials to save.';};
  $('[data-preview]').disabled=m.model==='tensor';
  $('.material-range').hidden=m.model==='tensor';
  $('.material-range + canvas').hidden=m.model==='tensor';
  if(m.model==='tensor')$('.material-status').textContent=tensorStatus();
  $('[data-preview]').onclick=preview;
  bandStatus(m);
  $('[data-apply]').onclick=async()=>{try{const valid=await api('/validate',draft);commit(valid.project);dialog.close();}catch(e){$('.material-status').textContent=e.message;toast(e.message);}};
 }
 function invalidatePreview(){revision++;fitEditor?.invalidate();const canvas=$('.material-range + canvas');canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);$('.material-status').textContent=draft.materials[selected].model==='tensor'?tensorStatus():'Parameters changed. Select Plot n / k to refresh.';}
 async function preview(){
  if(draft.materials[selected].model==='tensor'){$('.material-status').textContent=tensorStatus();return;}
  const token=++revision;
  try {
   const start=Number($('[aria-label="Material wavelength start"]').value),stop=Number($('[aria-label="Material wavelength stop"]').value);
   const dt=(await api('/validate',draft)).dt_fs;
   if(token!==revision)return;
   const data=await api(`/materials/preview?wavelength_start=${start}&wavelength_stop=${stop}&dt_fs=${dt}`,draft.materials[selected]);
   if(token!==revision)return;
   drawPlot($('.material-range + canvas'),['n','k','numerical_n','numerical_k'].map((key,i)=>({name:['n (analytic)','k (analytic)','n (ADE)','k (ADE)'][i],wavelength_um:data.wavelength_um,spectrum:data[key],spectrum_label:'Wavelength (µm) · complex index n + i k'})),true,true);
   if($('[data-discretization]'))$('[data-discretization]').textContent=data.discretization?`max |\u0394n| ${data.discretization.max_abs_n_error.toExponential(3)} at ${data.discretization.max_abs_n_error_at_um.toFixed(4)} \u00b5m, max |\u0394k| ${data.discretization.max_abs_k_error.toExponential(3)} at ${data.discretization.max_abs_k_error_at_um.toFixed(4)} \u00b5m on ${data.discretization.band_um[0]}\u2013${data.discretization.band_um[1]} \u00b5m at \u0394t ${dt.toPrecision(5)} fs (trapezoidal ADE against the fitted continuum).`:'Import and fit optical samples to evaluate the ADE error over the fitted band.';
   $('.material-status').textContent=`${data.wavelength_um.length} wavelengths · analytic response and ADE at Δt = ${dt.toPrecision(5)} fs. Positive k means absorption.${data.samples?` Retained samples: analytic RMS ${data.samples.analytic.normalized_rms.toExponential(3)}, FDTD RMS ${data.samples.ade.normalized_rms.toExponential(3)}.`:''}`;
  }catch(e){if(token===revision)$('.material-status').textContent=e.message;}
 }
 return {open(){draft=structuredClone(state.project);selected=0;render();dialog.showModal();}};
}
