// The FSP inspector retains vendor settings separately from native GPU scenes.
export function setupFspInspector({esc, toast, log}) {
 const dialog=document.createElement('dialog');dialog.id='fsp-dialog';document.body.append(dialog);
 const input=document.createElement('input');input.type='file';input.accept='.fsp';input.hidden=true;document.body.append(input);
 let job=null,selected='',busy=false,filter='',patches=new Map();
 async function request(path,options){const r=await fetch('/api/fsp'+path,options);const data=await r.json();if(!r.ok)throw Error(typeof data.detail==='string'?data.detail:JSON.stringify(data.detail));return data;}
 function rows(){if(!job?.inspection)return [];const m=job.inspection;return [...m.objects.map(o=>({...o,editable:true})),...Object.entries(m.globals).map(([k,v])=>({id:'Global '+k,...v})),...Object.entries(m.referenced_materials).map(([k,v])=>({id:'Material: '+k,...v}))];}
 function selectedRow(){return rows().find(o=>o.id===selected);}
 function key(id,p){return JSON.stringify([id,p]);}
 function status(text){dialog.querySelector('#fsp-status').textContent=text;}
 function render(){
  const m=job?.inspection;
  dialog.innerHTML=`<div class="fsp-heading"><div><h2>FSP project inspector</h2><span>${esc(job?.filename||'Open a Lumerical project')}</span></div><button data-fsp="close" aria-label="Close FSP inspector">Close</button></div>
   <p class="fsp-notice">Installed Lumerical bridge · <strong>Native GPU execution unavailable</strong><br>Original settings are retained. Values below use Lumerical SI units: metres, seconds and Hz. Edited exports clear saved simulation results.</p>
   <div class="fsp-toolbar"><button data-fsp="open" ${busy?'disabled':''}>Open .fsp</button><button data-fsp="original" ${!m||busy?'disabled':''}>Download original .fsp</button><button data-fsp="archive" ${!m||busy?'disabled':''}>Preservation archive</button><button data-fsp="export" ${!patches.size||busy?'disabled':''}>Save edited .fsp <span id="fsp-patch-count">(${patches.size})</span></button></div>
   <div id="fsp-status" role="status">${busy?'Reading with Lumerical…':m?`${m.objects.length} objects · Lumerical ${esc(m.bridge.vendor_version)} · ${patches.size} pending edits`:'Select an FSP file. The GPU workstation reads it in a separate Lumerical session.'}</div>
   <div class="fsp-body"><div id="fsp-tree">${rows().map(o=>`<button data-fsp-object="${esc(o.id)}" class="${selected===o.id?'active':''}"><span>${esc(o.id)}</span><small>${esc(o.properties.type||'Settings')}</small></button>`).join('')}</div><section class="fsp-details"><input id="fsp-filter" placeholder="Filter properties (e.g. wavelength, pml, apodization)" aria-label="Filter FSP properties" value="${esc(filter)}"><div id="fsp-properties"></div></section></div>
   ${m?`<details class="fsp-diagnostics"><summary>Native compatibility: ${m.native_execution.issues.length} unresolved items</summary><ul>${m.native_execution.issues.map(i=>`<li><b>${esc(i.object_id||'Project')}</b>: ${esc(i.message)}</li>`).join('')}${m.read_diagnostics.map(i=>`<li>${esc(i.object_id)}: ${esc(i.message)}</li>`).join('')}</ul></details>`:''}`;
  renderProperties();
  dialog.querySelector('#fsp-filter').oninput=e=>{filter=e.target.value;renderProperties();};
 }
 function renderProperties(){
  const o=selectedRow(),container=dialog.querySelector('#fsp-properties');
  if(!o){container.innerHTML='<p>Select an object to inspect its complete property list.</p>';return;}
  const props=Object.entries(o.properties).filter(([name])=>name.toLowerCase().includes(filter.toLowerCase()));
  container.innerHTML=`<h3>${esc(o.id)}</h3>${props.map(([name,value])=>{
   const patch=patches.get(key(o.id,name)),shown=patch?patch.value:value;
   const editable=o.editable&&!['name','type','script','setup script','analysis script'].includes(name)&&['number','string','boolean'].includes(typeof shown)&&!String(shown).includes('\n')&&String(shown).length<2000;
   const rendered=typeof shown==='object'?JSON.stringify(shown,null,2):String(shown);
   return `<label class="fsp-property ${patch?'modified':''}"><span>${esc(name)}</span>${editable?`<input data-fsp-property="${esc(name)}" aria-label="FSP ${esc(name)}" type="${typeof shown==='number'?'number':typeof shown==='boolean'?'checkbox':'text'}" step="any" ${typeof shown==='boolean'?(shown?'checked':''):`value="${esc(rendered)}"`} ${busy?'disabled':''}>`:`<pre>${esc(rendered)}</pre>`}</label>`;
  }).join('')}${Object.entries(o.read_errors||{}).map(([k,v])=>`<p class="error">${esc(k)}: ${esc(v)}</p>`).join('')}`;
  container.querySelectorAll('[data-fsp-property]').forEach(el=>el.onchange=()=>{
   const name=el.dataset.fspProperty,value=el.type==='number'?Number(el.value):el.type==='checkbox'?el.checked:el.value;
   if(el.type==='number'&&(!el.value||!Number.isFinite(value))){toast('Enter a finite number.');renderProperties();return;}
   if(value===o.properties[name])patches.delete(key(o.id,name));else patches.set(key(o.id,name),{object_id:o.id,property:name,value});
   el.closest('label').classList.toggle('modified',patches.has(key(o.id,name)));
   dialog.querySelector('#fsp-patch-count').textContent=`(${patches.size})`;dialog.querySelector('[data-fsp="export"]').disabled=!patches.size||busy;
   status(`${patches.size} pending edits. Save edited .fsp verifies each saved value in Lumerical.`);
  });
 }
 async function wait(id){
  for(;;){const current=await request('/'+id);status(current.status==='queued'?'Waiting for Lumerical bridge…':'Reading and verifying project settings…');if(current.status==='failed')throw Error(current.error);if(current.status==='ready')return current;await new Promise(resolve=>setTimeout(resolve,700));}
 }
 function download(path){const a=document.createElement('a');a.href='/api/fsp/'+job.id+'/'+path;a.download='';a.click();}
 async function openFile(file){
  if(busy)return;busy=true;patches.clear();filter='';selected='';job=null;render();if(!dialog.open)dialog.showModal();
  try{status('Uploading '+file.name+'…');const created=await request('/import',{method:'POST',headers:{'Content-Type':'application/octet-stream','X-Filename':encodeURIComponent(file.name)},body:file});job=await wait(created.id);selected=job.inspection.objects.find(o=>o.properties.type==='FDTD')?.id||job.inspection.objects[0]?.id;log('Inspected '+file.name+' through Lumerical. Native GPU execution of this FSP remains unavailable.');}
  catch(e){toast(e.message);log('FSP: '+e.message,'error');}
  finally{busy=false;render();}
 }
 input.onchange=()=>{const file=input.files[0];input.value='';if(file)openFile(file);};
 dialog.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b||b.disabled)return;
  if(b.dataset.fspObject){selected=b.dataset.fspObject;render();return;}
  const action=b.dataset.fsp;if(action==='close'){dialog.close();return;}if(action==='open'){input.click();return;}
  if(action==='original'){download('download');return;}if(action==='archive'){download('archive');return;}
  if(action==='export'){
   busy=true;render();
   try{const created=await request('/'+job.id+'/export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({patches:[...patches.values()]})});const exported=await wait(created.id);const a=document.createElement('a');a.href='/api/fsp/'+exported.id+'/download';a.download='';a.click();patches.clear();job=exported;log('Saved '+exported.filename+' and verified '+exported.export_verification.patches.length+' property edits by reopening in Lumerical.');}
   catch(e){toast(e.message);log('FSP export failed: '+e.message,'error');}
   finally{busy=false;render();}
  }
 });
 return {openFile,open(){render();if(!dialog.open)dialog.showModal();}};
}
