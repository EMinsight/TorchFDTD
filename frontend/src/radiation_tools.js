/** Postprocess complete native periodic planes, never an open-plane far field. */
export async function openDiffraction({state,api,esc,toast}){
 const jobId=state.job;
 if(!jobId)throw Error('Complete a 3D run with a six-field frequency plane first.');
 const [monitors,jobs]=await Promise.all([api(`/jobs/${jobId}/diffraction-monitors`),api('/jobs')]);
 if(!monitors.length)throw Error('Add a full-cell frequency monitor and record all six E/H fields, then rerun.');
 const dialog=document.createElement('dialog');dialog.className='radiation-dialog monitor-dialog';dialog.style.width='min(1000px,92vw)';document.body.append(dialog);
 const $=s=>dialog.querySelector(s);
 dialog.innerHTML=`<div class="fsp-heading"><h2>Diffraction orders</h2><button data-close>Close</button></div>
 <p>Requires a complete periodic unit-cell plane with six collocated E/H fields in a homogeneous lossless isotropic medium outside PML. This is not an isolated-object far-field projection.</p>
 <label>Stored plane <select aria-label="Diffraction plane">${monitors.map(m=>`<option value="${esc(m.id)}">${esc(m.name)} (+${m.normal})</option>`).join('')}</select></label>
 <label>Frequency <select aria-label="Diffraction frequency"></select></label>
 <label>Exterior refractive index <input aria-label="Exterior refractive index" type="number" min="0.001" max="20" step="0.01" value="1"></label>
 <label>Integer orders (m,n per line)<textarea aria-label="Diffraction orders" rows="3">0,0</textarea></label>
 <label>Matched reference <select aria-label="Diffraction reference"><option value="">Raw directional powers only</option>${jobs.filter(j=>j.id!==jobId&&j.status==='completed').map(j=>`<option value="${esc(j.id)}">${esc(j.name)} (${esc(j.id.slice(0,8))})</option>`).join('')}</select></label>
 <label><input type="checkbox" aria-label="Subtract incident diffraction fields"> Subtract matched incident fields before normalized power</label>
 <label><input type="checkbox" aria-label="Confirm diffraction exterior"> I confirm both planes are in the declared homogeneous, lossless isotropic exterior, outside PML.</label>
 <button data-calculate>Calculate diffraction</button><p role="status"></p><div data-results></div>`;
 let generation=0;
 function invalidate(){generation++;$('[data-results]').innerHTML='';$('[role="status"]').textContent='';$('[data-calculate]').disabled=false;}
 function frequency(){const m=monitors.find(m=>m.id===$('[aria-label="Diffraction plane"]').value);$('[aria-label="Diffraction frequency"]').innerHTML=m.frequency_thz.map((f,i)=>`<option value="${i}">${f.toPrecision(7)} THz</option>`).join('');$('[data-results]').innerHTML='';}
 $('[aria-label="Diffraction plane"]').onchange=frequency;frequency();
 dialog.querySelectorAll('input,select,textarea').forEach(input=>{input.addEventListener('input',invalidate);input.addEventListener('change',invalidate);});
 $('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{generation++;dialog.remove();},{once:true});
 $('[data-calculate]').onclick=async()=>{const token=++generation;const button=$('[data-calculate]');button.disabled=true;$('[data-results]').innerHTML='';
 try{
  const orders=$('[aria-label="Diffraction orders"]').value.trim().split(/\n+/).map(line=>line.trim().split(/[\s,]+/).map(Number));
  if(!orders.length||orders.some(pair=>pair.length!==2||pair.some(n=>!Number.isInteger(n))))throw Error('Enter one pair of integers per line, for example 0,0.');
  const reference=$('[aria-label="Diffraction reference"]').value;
  const result=await api(`/jobs/${jobId}/diffraction`,{monitor:$('[aria-label="Diffraction plane"]').value,frequency_index:Number($('[aria-label="Diffraction frequency"]').value),orders,refractive_index:Number($('[aria-label="Exterior refractive index"]').value),reference:reference||null,subtract_incident:$('[aria-label="Subtract incident diffraction fields"]').checked,confirm_homogeneous_exterior:$('[aria-label="Confirm diffraction exterior"]').checked});
  if(token!==generation)return;
  const number=x=>Number(x).toExponential(6);
  $('[role="status"]').textContent=`${result.frequency_thz.toPrecision(7)} THz; orders along ${result.transverse_axes.join(', ')}. ${result.normalized?'Reference-normalized efficiencies shown alongside raw directional powers.':'Raw directional powers only, not efficiencies.'}`;
  $('[data-results]').innerHTML=`<table style="width:100%;text-align:left;border-spacing:8px"><thead><tr><th>Order</th><th>Type</th><th>+ normal raw power</th><th>- normal raw power</th>${result.normalized?'<th>Forward efficiency</th><th>Backward efficiency</th>':''}</tr></thead><tbody>${result.orders.map((order,i)=>`<tr><td>${order.join(', ')}</td><td>${result.propagating[i]?'Propagating':'Evanescent (zero real power)'}</td><td>${number(result.forward_power[i])}</td><td>${number(result.backward_power[i])}</td>${result.normalized?`<td>${number(result.forward_efficiency[i])}</td><td>${number(result.backward_efficiency[i])}</td>`:''}</tr>`).join('')}</tbody></table><p>Raw units: ${esc(result.units)}. ${esc(result.note)}${result.subtract_incident?' Normalized columns use incident-subtracted fields; raw columns retain total fields.':''}</p>`;
 }catch(error){if(token===generation){$('[role="status"]').textContent=error.message;toast(error.message);}}
 finally{if(token===generation)button.disabled=false;}
 };dialog.showModal();
}
