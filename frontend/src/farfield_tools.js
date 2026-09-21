import './farfield_tools.css';
const faces=['x_min','x_max','y_min','y_max','z_min','z_max'];
const labels={x_min:'X minimum',x_max:'X maximum',y_min:'Y minimum',y_max:'Y maximum',z_min:'Z minimum',z_max:'Z maximum'};
const clone=value=>structuredClone(value);
function save(value,name,type='application/json'){
 const url=URL.createObjectURL(new Blob([typeof value==='string'?value:JSON.stringify(value,null,2)],{type}));
 const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
/** CPU postprocessing of already stored fields. Closing does not cancel server work. */
export async function openFarfield({state,api,esc,toast}){
 const jobId=state.job;if(!jobId)throw Error('Complete a run with six closed-box frequency planes first.');
 const [metadata,jobs]=await Promise.all([api(`/jobs/${jobId}/farfield-monitors`),api('/jobs')]);
 const monitors=metadata.monitors||[];
 const dialog=document.createElement('dialog');dialog.className='farfield-dialog';document.body.append(dialog);
 const $=s=>dialog.querySelector(s);let generation=0,closed=false,result=null;
 const number=(label,path,value)=>`<label>${esc(label)}<input aria-label="${esc(label)}" data-number="${path}" type="number" step="any" value="${value}"></label>`;
 dialog.innerHTML=`<header><div><h2>Closed-box far field</h2><p>Stored run: ${esc(metadata.name||jobId)}</p></div><button data-close>Close</button></header>
 <p>Project radiation from six stored frequency planes. This performs CPU postprocessing only and does not run FDTD. Closing this window discards pending results but does not cancel server calculation.</p>
 <p data-scope>${metadata.isolated_pml?'All outer faces use PML.':'This run is not an isolated all-PML domain. The backend will reject unsupported boundaries.'} ${esc(metadata.note||'')}</p>
 <div class="farfield-grid"><fieldset><legend>Six closed-box faces</legend>${faces.map(face=>`<label>${labels[face]}<select aria-label="${labels[face]} face" data-face="${face}"><option value="">Select stored plane</option>${monitors.filter(m=>m.normal===face[0]).map(m=>`<option value="${esc(m.id)}">${esc(m.name)} · ${esc(m.position_um)} µm · ${m.points} points</option>`).join('')}</select></label>`).join('')}<button data-fill>Fill bounds from selected planes</button><p>Minimum faces retain native positive-axis fields. Outward signs are applied automatically.</p></fieldset>
 <fieldset><legend>Surface and exterior</legend>${['x','y','z'].map((axis,i)=>number(`${axis.toUpperCase()} lower bound (µm)`,`bounds.${i}.0`,-1)+number(`${axis.toUpperCase()} upper bound (µm)`,`bounds.${i}.1`,1)).join('')}${number('Exterior refractive index','index',metadata.background_index||1)}<label>Stored frequency<select aria-label="Far-field frequency" data-frequency></select></label><p>Bounds must match all face extents and stay inside the PML-free region. No frequency interpolation.</p></fieldset>
 <fieldset><legend>Directions and phase</legend>${number('Theta start (degrees)','theta.start',0)+number('Theta stop (degrees)','theta.stop',180)+number('Theta samples','theta.count',19)+number('Phi start (degrees)','phi.start',0)+number('Phi stop (degrees, excluded)','phi.stop',360)+number('Phi samples','phi.count',36)}${['x','y','z'].map((axis,i)=>number(`Phase origin ${axis} (µm)`,`origin.${i}`,0)).join('')}<p>Theta starts at +z. Phi rotates from +x toward +y. Theta includes both endpoints, phi excludes its stop. Maximum 8192 directions.</p></fieldset>
 <fieldset><legend>Reference and physical scope</legend><label>Reference run<select aria-label="Far-field reference" data-reference><option value="">Total fields, no reference</option>${jobs.filter(j=>j.id!==jobId&&j.status==='completed').map(j=>`<option value="${esc(j.id)}">${esc(j.name)} (${esc(j.id.slice(0,8))})</option>`).join('')}</select></label><label class="farfield-check"><input type="checkbox" data-subtract aria-label="Subtract matched incident fields"> Subtract matched complex E/H on all six faces</label><p>Reference runs must contain the same face IDs and matching source, mesh, duration and monitor settings. Subtraction produces scattered fields, not normalized efficiency.</p><label class="farfield-check"><input type="checkbox" data-confirm aria-label="Confirm homogeneous closed surface"> I confirm a closed surface in the declared homogeneous, lossless isotropic exterior, outside PML, enclosing the radiating objects. For total fields it encloses sources. For scattering the matched incident source does not cross a measurement face.</label></fieldset></div>
 <div class="farfield-actions"><button data-calculate>Calculate far field</button><button data-setup>Export setup JSON</button></div><p role="status">Choose all six faces and confirm the surface assumptions.</p><div data-results></div>`;
 const selected=()=>faces.map(face=>monitors.find(m=>m.id===$(`[data-face="${face}"]`).value));
 function frequencies(){
  const previous=$('[data-frequency]').value,chosen=selected();
  const valid=chosen.every(Boolean)&&chosen.every(m=>JSON.stringify(m.frequency_thz)===JSON.stringify(chosen[0].frequency_thz));
  $('[data-frequency]').innerHTML=valid?chosen[0].frequency_thz.map((f,i)=>`<option value="${i}">${Number(f).toPrecision(7)} THz</option>`).join(''):'<option value="">Select six planes with identical frequency lists</option>';
  if(valid&&Number(previous)<chosen[0].frequency_thz.length)$('[data-frequency]').value=previous||'0';
 }
 function fillBounds(){selected().forEach((m,i)=>{if(m)$(`[data-number="bounds.${Math.floor(i/2)}.${i%2}"]`).value=m.position_um;});}
 for(const axis of ['x','y','z']){const candidates=monitors.filter(m=>m.normal===axis).sort((a,b)=>a.position_um-b.position_um);if(candidates.length===2&&candidates[0].position_um<candidates[1].position_um){$(`[data-face="${axis}_min"]`).value=candidates[0].id;$(`[data-face="${axis}_max"]`).value=candidates[1].id;}}
 fillBounds();frequencies();
 function invalidate(){generation++;result=null;$('[data-results]').replaceChildren();$('[role="status"]').textContent='Setup changed. Calculate when ready.';$('[data-calculate]').disabled=false;}
 dialog.querySelectorAll('input,select').forEach(input=>{input.addEventListener('input',invalidate);input.addEventListener('change',()=>{invalidate();if(input.dataset.face)frequencies();});});
 $('[data-fill]').onclick=()=>{fillBounds();invalidate();};
 function collect(){
  const num=key=>{const raw=$(`[data-number="${key}"]`).value;if(raw.trim()===''||!Number.isFinite(Number(raw)))throw Error('Enter finite numerical settings.');return Number(raw);};
  const mapping=Object.fromEntries(faces.map(face=>[face,$(`[data-face="${face}"]`).value]));if(new Set(Object.values(mapping)).size!==6||Object.values(mapping).some(v=>!v))throw Error('Select six distinct stored planes.');
  const frequency=$('[data-frequency]').value;if(frequency==='')throw Error('All faces need identical stored frequency lists.');
  const theta={start:num('theta.start'),stop:num('theta.stop'),count:num('theta.count')},phi={start:num('phi.start'),stop:num('phi.stop'),count:num('phi.count')};
  if(![theta.count,phi.count].every(n=>Number.isInteger(n)&&n>=2)||theta.count*phi.count>8192)throw Error('Use at least two samples per angular axis and at most 8192 directions.');
  if(theta.start<0||theta.stop>180||theta.stop<=theta.start||phi.start<0||phi.stop>360||phi.stop<=phi.start)throw Error('Theta must increase within 0–180 degrees. Phi must increase within 0–360 degrees.');
  const reference=$('[data-reference]').value||null,subtract=$('[data-subtract]').checked;if(Boolean(reference)!==subtract)throw Error('Choose a matched reference and enable complex-field subtraction together.');
  return {version:1,faces:mapping,frequency_index:Number(frequency),bounds_um:[0,1,2].map(a=>[num(`bounds.${a}.0`),num(`bounds.${a}.1`)]),refractive_index:num('index'),phase_origin_um:[0,1,2].map(i=>num(`origin.${i}`)),theta_deg:theta,phi_deg:phi,reference,subtract_incident:subtract,confirm_homogeneous_closed_surface:$('[data-confirm]').checked};
 }
 function fail(e){$('[role="status"]').textContent=e.message;toast(e.message);}
 $('[data-setup]').onclick=()=>{try{save({job_id:jobId,request:collect()},'farfield-setup.json');}catch(e){fail(e);}};
 $('[data-calculate]').onclick=async()=>{const token=++generation;result=null;$('[data-results]').replaceChildren();try{
  const request=collect();if(!request.confirm_homogeneous_closed_surface)throw Error('Confirm the homogeneous closed-surface assumptions first.');
  $('[data-calculate]').disabled=true;$('[role="status"]').textContent='Projecting stored fields on CPU…';
  const response=await api(`/jobs/${jobId}/farfield`,request);if(closed||token!==generation)return;result=response;renderResult();
 }catch(e){if(!closed&&token===generation)fail(e);}finally{if(!closed&&token===generation)$('[data-calculate]').disabled=false;}};
 function renderResult(){
  $('[role="status"]').textContent=`${Number(result.frequency_thz).toPrecision(7)} THz · ${result.field_kind==='scattered'?'Scattered':'Total'} fields · ${result.directions.length} directions. ${result.zero_pattern?'Zero pattern. ':''}${result.note||''}`;
  $('[data-results]').innerHTML=`<h3>Angular radiation pattern</h3><p>Raw quantity: reduced spectral power per steradian (${esc(result.intensity_units)}). This is not calibrated W/sr or an efficiency.</p><label>Display scale<select aria-label="Far-field display scale" data-scale><option value="relative">Relative intensity I / max(I)</option><option value="raw">Raw reduced spectral intensity</option></select></label><canvas data-heat width="800" height="370" aria-label="Far-field angular heatmap"></canvas><p data-range></p><div class="farfield-grid"><section><label>Theta cut at phi<select data-phi-cut aria-label="Theta cut at phi">${result.phi_deg.map((v,i)=>`<option value="${i}">${v}°</option>`).join('')}</select></label><canvas data-theta-canvas width="500" height="260" aria-label="Theta intensity cut"></canvas></section><section><label>Phi cut at theta<select data-theta-cut-select aria-label="Phi cut at theta">${result.theta_deg.map((v,i)=>`<option value="${i}">${v}°</option>`).join('')}</select></label><canvas data-phi-canvas width="500" height="260" aria-label="Phi intensity cut"></canvas></section></div><p>Complex amplitude is A in E(r) = A exp(ikr) / r, in ${esc(result.amplitude_units)}. Phase origin: ${esc(result.phase_origin_um.join(', '))} µm.</p><div class="farfield-actions"><button data-result-json>Export result JSON</button><button data-csv>Export direction CSV</button></div><details><summary>Result identity and admission</summary><p>Request digest: <code>${esc(result.request_digest)}</code></p><pre>${esc(JSON.stringify(result.report,null,2))}</pre></details>`;
  $('[data-scale]').onchange=plots;$('[data-phi-cut]').onchange=plots;$('[data-theta-cut-select]').onchange=plots;
  $('[data-result-json]').onclick=()=>save(result,'farfield-result.json');
  $('[data-csv]').onclick=()=>{const rows=[['theta_deg','phi_deg','sx','sy','sz','intensity_reduced_EH_s2_m2_per_sr','relative_intensity','Ax_real','Ay_real','Az_real','Ax_imag','Ay_imag','Az_imag']];result.theta_deg.forEach((t,i)=>result.phi_deg.forEach((p,j)=>{const k=i*result.phi_deg.length+j;rows.push([t,p,...result.directions[k],result.intensity[i][j],result.relative_intensity[i][j],...result.electric_real[k],...result.electric_imag[k]]);}));save(rows.map(row=>row.join(',')).join('\n')+'\n','farfield-directions.csv','text/csv');};plots();
 }
 function plots(){
  const data=$('[data-scale]').value==='raw'?result.intensity:result.relative_intensity;
  const maximum=Math.max(0,...data.flat()),height=data.length,width=data[0].length,c=$('[data-heat]'),ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);
  const left=65,top=20,w=c.width-left-25,h=c.height-top-55;
  for(let i=0;i<height;i++)for(let j=0;j<width;j++){const f=maximum>0?data[i][j]/maximum:0;ctx.fillStyle=`hsl(${240-240*f} 85% ${25+30*f}%)`;ctx.fillRect(left+j*w/width,top+i*h/height,w/width+1,h/height+1);}
  ctx.fillStyle='#26394c';ctx.font='14px sans-serif';ctx.fillText(`Phi (degrees): ${result.phi_deg[0]} to ${result.phi_deg.at(-1)}`,left,c.height-12);ctx.fillText(`Theta ${result.theta_deg[0]}°`,4,top+12);ctx.fillText(`${result.theta_deg.at(-1)}°`,18,top+h);$('[data-range]').textContent=`Color range: 0 to ${maximum.toExponential(6)} ${$('[data-scale]').value==='raw'?result.intensity_units:'(relative)'}.`;
  line($('[data-theta-canvas]'),result.theta_deg,data.map(row=>row[Number($('[data-phi-cut]').value)]),'Theta (degrees)');
  line($('[data-phi-canvas]'),result.phi_deg,data[Number($('[data-theta-cut-select]').value)],'Phi (degrees)');
 }
 function line(canvas,x,y,label){const c=canvas.getContext('2d'),max=Math.max(0,...y),left=65,top=25,w=canvas.width-85,h=canvas.height-75;c.clearRect(0,0,canvas.width,canvas.height);c.strokeStyle='#bccbd7';c.strokeRect(left,top,w,h);c.beginPath();c.strokeStyle='#146ba5';y.forEach((v,i)=>{const px=left+(x[i]-x[0])/(x.at(-1)-x[0]||1)*w,py=top+h-(max?v/max:0)*h;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();c.fillStyle='#26394c';c.font='12px sans-serif';c.fillText(max.toExponential(2),3,top+5);c.fillText('0',45,top+h);c.fillText(`${label}: ${x[0]} to ${x.at(-1)}`,left,canvas.height-12);}
 $('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{closed=true;generation++;result=null;dialog.remove();},{once:true});dialog.showModal();return dialog;
}
