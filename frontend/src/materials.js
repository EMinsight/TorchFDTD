import { drawPlot } from './views.js';

const defaults={model:'dielectric',index:1.5,color:'#60bdaa',epsilon_inf:1,plasma_rad_s:2e15,collision_rad_s:1e14,resonance_rad_s:2e15,linewidth_rad_s:1e14,delta_epsilon:1,poles:[]};
export function setupMaterials({state,api,esc,toast,commit}) {
 const dialog=document.createElement('dialog');dialog.className='material-dialog';document.body.append(dialog);
 let draft,selected=0,revision=0;
 const $=s=>dialog.querySelector(s);
 const label=(title,key,unit='',min=0)=>`<label class="material-field"><span>${title}</span><input aria-label="${title}" data-material-field="${key}" type="${key==='name'?'text':key==='color'?'color':'number'}" value="${esc(draft.materials[selected][key])}" ${key==='name'?'maxlength="100"':`min="${min}" step="any"`}><small>${unit}</small></label>`;
 const defaultPole=()=>({resonance_rad_s:2e15,strength_rad_s_squared:4e30,damping_rad_s:1e14});
 function poleEditor(m){
  return `<div class="pole-editor">${m.poles.map((pole,i)=>`<details open class="boundary-options"><summary>Pole ${i+1}</summary>${[['Resonance','resonance_rad_s','rad/s',0],['Oscillator strength','strength_rad_s_squared','rad²/s²',1e-30],['Damping','damping_rad_s','rad/s',0]].map(([title,key,unit,min])=>`<label class="material-field"><span>${title}</span><input aria-label="Pole ${i+1} ${title}" type="number" min="${min}" step="any" data-pole-index="${i}" data-pole-field="${key}" value="${esc(pole[key])}"><small>${unit}</small></label>`).join('')}<button data-remove-pole="${i}" ${m.poles.length<2?'disabled':''}>Remove pole ${i+1}</button></details>`).join('')}<button data-add-pole ${m.poles.length>=16?'disabled':''}>+ Add pole</button><p>Set resonance to zero for a Drude pole. Strength must be positive and damping nonnegative. This editor does not fit measured data.</p></div>`;
 }
 function render(){
  revision++;const m=draft.materials[selected];Object.entries(defaults).forEach(([k,v])=>m[k]??=structuredClone(v));
  dialog.innerHTML=`<div class="fsp-heading"><h2>Material database</h2><button data-dismiss>Close</button></div><p>Dielectric, Drude, Lorentz and multiple passive poles.</p><div class="material-workspace"><aside><select size="8" aria-label="Material list">${draft.materials.map((a,i)=>`<option value="${i}" ${i===selected?'selected':''}>${esc(a.name)}</option>`).join('')}</select><button data-add-material>+ Add material</button></aside><section><fieldset ${state.mode!=='layout'?'disabled':''}>${label('Material name','name')}${label('Display color','color')}<label class="material-field"><span>Material model</span><select aria-label="Material model" data-material-field="model">${[['dielectric','Dielectric'],['drude','Plasma (Drude)'],['lorentz','Lorentz'],['multipole','Multiple Drude / Lorentz poles']].map(([v,t])=>`<option value="${v}" ${m.model===v?'selected':''}>${t}</option>`).join('')}</select></label>${m.model==='dielectric'?label('Refractive index','index','',1):label('Permittivity (epsilon infinity)','epsilon_inf','',1)}${m.model==='drude'?label('Plasma resonance','plasma_rad_s','rad/s')+label('Plasma collision','collision_rad_s','rad/s'):m.model==='lorentz'?label('Lorentz permittivity','delta_epsilon')+label('Lorentz resonance','resonance_rad_s','rad/s')+label('Lorentz linewidth','linewidth_rad_s','rad/s'):m.model==='multipole'?poleEditor(m):''}</fieldset><p class="material-formula">${m.model==='dielectric'?'ε = n²':m.model==='drude'?'ε(ω) = ε∞ − ωp² / (ω² + i γ ω)':m.model==='multipole'?'ε(ω) = ε∞ + Σ Aⱼ / (ωⱼ² − ω² − i γⱼ ω)':'ε(ω) = ε∞ + Δε ω₀² / (ω₀² − ω² − 2 i δ ω)'}<br>Frequency parameters above are angular frequencies, in rad/s.</p></section></div><div class="material-range"><label>Wavelength start (µm) <input aria-label="Material wavelength start" type="number" value="1.3" min="0.001" step=".01"></label><label>Wavelength stop (µm) <input aria-label="Material wavelength stop" type="number" value="1.8" min="0.001" step=".01"></label><button data-preview>Plot n / k</button></div><canvas></canvas><p class="material-status" role="status">Preview includes the current simulation timestep.</p><div class="dialog-actions"><button data-apply ${state.mode!=='layout'?'disabled':''}>Apply materials</button><button data-dismiss>Cancel</button></div>`;
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
  $('[data-preview]').onclick=preview;
  $('[data-apply]').onclick=async()=>{try{const valid=await api('/validate',draft);commit(valid.project);dialog.close();}catch(e){$('.material-status').textContent=e.message;toast(e.message);}};
 }
 function invalidatePreview(){revision++;const canvas=$('canvas');canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);$('.material-status').textContent='Parameters changed. Select Plot n / k to refresh.';}
 async function preview(){
  const token=++revision;
  try {
   const start=Number($('[aria-label="Material wavelength start"]').value),stop=Number($('[aria-label="Material wavelength stop"]').value);
   const r=draft.region,dt=r.courant_factor/Math.sqrt(r.dimension==='2d'?2:3)*r.mesh*1e9/299792458;
   const data=await api(`/materials/preview?wavelength_start=${start}&wavelength_stop=${stop}&dt_fs=${dt}`,draft.materials[selected]);
   if(token!==revision)return;
   drawPlot($('canvas'),['n','k','numerical_n','numerical_k'].map((key,i)=>({name:['n (analytic)','k (analytic)','n (ADE)','k (ADE)'][i],wavelength_um:data.wavelength_um,spectrum:data[key],spectrum_label:'Wavelength (µm) · complex index n + i k'})),true,true);
   $('.material-status').textContent=`${data.wavelength_um.length} wavelengths · analytic response and ADE at Δt = ${dt.toPrecision(5)} fs. Positive k means absorption.`;
  }catch(e){if(token===revision)$('.material-status').textContent=e.message;}
 }
 return {open(){draft=structuredClone(state.project);selected=0;render();dialog.showModal();}};
}
