// GDS contributes geometry only. Stack materials and port contracts are explicit.
import './gds.css';
export function setupGds({esc,toast,log,getProject,loadProject}) {
 const dialog=document.createElement('dialog');dialog.id='gds-dialog';dialog.className='gds-dialog';document.body.append(dialog);
 let upload=null,candidate=null,snapshot=null,busy=false;
 async function request(url,options){const response=await fetch('/api/gds/'+url,options);const body=await response.json();if(!response.ok)throw Error(typeof body.detail==='string'?body.detail:JSON.stringify(body.detail));return body;}
 function configuration(){return JSON.stringify([...dialog.querySelectorAll('input,select,textarea')].map(el=>[el.value,el.checked]));}
 function invalidate(){candidate=null;dialog.querySelector('[data-gds="apply"]').disabled=true;dialog.querySelector('[data-gds="report"]').disabled=true;}
 function status(text){dialog.querySelector('#gds-status').textContent=text;}
 function download(name,value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function render(){
  const pairs=[...new Set((upload?.cells||[]).flatMap(c=>c.geometry_pairs.map(p=>p.join('/'))))].sort();
  dialog.innerHTML=`<div class="fsp-heading"><h2>Import GDS geometry</h2><button data-gds="close">Close</button></div>
   <p>Select a cell and explicitly assign each included layer its physical Z bounds (µm) and an existing project material. No sources or fabrication materials are inferred.</p>
   <input id="gds-input" aria-label="GDS file" type="file" accept=".gds,.gdsii"><p id="gds-status" role="status">${upload?esc(upload.filename):'Choose a GDSII file (maximum 32 MB).'}</p>
   ${upload?`<label>Cell <select id="gds-cell">${upload.cells.map(c=>`<option>${esc(c.name)}</option>`).join('')}</select></label>
   <p>Pairs below include all library cells. Select pairs present in the selected cell hierarchy. Duplicate a row to extrude the same pair at multiple Z intervals. Etch by lists layer/datatype pairs, such as <code>2/0, 3/1</code>, whose polygons are subtracted from the row before extrusion; bridged hole contours import as polygon holes.</p>
   <table><thead><tr><th>Include</th><th>Layer / datatype</th><th>Z min (µm)</th><th>Z max (µm)</th><th>Material</th><th>Etch by</th><th></th></tr></thead><tbody id="gds-stack">${pairs.map(pair=>`<tr data-pair="${pair}"><td><input type="checkbox" aria-label="Include ${pair}"></td><td>${pair}</td><td><input size="8" type="number" step="any" aria-label="Z min ${pair}"></td><td><input size="8" type="number" step="any" aria-label="Z max ${pair}"></td><td><select aria-label="Material ${pair}"><option value="">Select material</option>${getProject().materials.map(m=>`<option value="${esc(m.name)}">${esc(m.name)}</option>`).join('')}</select></td><td><input size="10" aria-label="Etch by ${pair}" placeholder="none"></td><td><button data-gds="duplicate">Duplicate</button></td></tr>`).join('')}</tbody></table>
   <p><label>Unmapped geometry <select id="gds-unmapped"><option value="error">Reject (strict)</option><option value="report">Omit and record in report</option></select></label></p>
   <p><label><input id="gds-replace" type="checkbox"> Replace current structures (sources, monitors and materials stay in the project)</label></p>
   <details><summary>Optional TEXT port metadata contracts</summary><p>JSON array using layer, datatype (= TEXTTYPE), z_min, z_max, width_um and normal_xy. Metadata only, no source/detector integration. Available TEXT pairs: ${esc(JSON.stringify([...new Set(upload.cells.flatMap(c=>c.text_pairs.map(p=>p.join('/'))))]))}</p><textarea id="gds-ports" aria-label="Port contracts" rows="3" style="width:100%">[]</textarea></details>
   <button data-gds="preview">Preview conversion</button>`:''}
   <button data-gds="apply" disabled>Apply imported geometry</button><button data-gds="report" disabled>Download report</button><pre id="gds-report" style="max-height:240px;overflow:auto;white-space:pre-wrap"></pre>`;
  dialog.querySelector('#gds-input').onchange=async event=>{const file=event.target.files[0];if(!file||busy)return;busy=true;invalidate();status('Inspecting GDS…');try{upload=await request('inspect',{method:'POST',headers:{'Content-Type':'application/octet-stream','X-Filename':encodeURIComponent(file.name)},body:file});render();}catch(error){status(error.message);}finally{busy=false;}};
 }
 dialog.addEventListener('input',event=>{if(event.target.id!=='gds-input')invalidate();});
 dialog.addEventListener('click',async event=>{
  const action=event.target.closest('[data-gds]')?.dataset.gds;if(!action||busy)return;
  if(action==='close'){dialog.close();return;}
  if(action==='duplicate'){const row=event.target.closest('tr');row.after(row.cloneNode(true));invalidate();return;}
  if(action==='report'){download('gds-import-report.json',candidate.report);return;}
  busy=true;
  try{
   if(action==='preview'){
    invalidate();const layers=[];
    for(const row of dialog.querySelectorAll('#gds-stack tr')){const inputs=row.querySelectorAll('input');if(!inputs[0].checked)continue;if(!inputs[1].value||!inputs[2].value||!row.querySelector('select').value)throw Error('Every included row needs explicit Z bounds and material.');const [layer,datatype]=row.dataset.pair.split('/').map(Number);
     const etch_by=inputs[3].value.split(/[\s,]+/).filter(Boolean).map(token=>{const pair=token.split('/').map(Number);if(pair.length!==2||pair.some(n=>!Number.isInteger(n)||n<0))throw Error(`Etch pairs must be layer/datatype, not "${token}".`);return pair;});
     layers.push({layer,datatype,z_min:Number(inputs[1].value),z_max:Number(inputs[2].value),material:row.querySelector('select').value,...(etch_by.length?{etch_by}:{})});}
    snapshot=JSON.stringify(getProject());const configSnapshot=configuration();status('Converting and validating native geometry…');
    candidate=await request(upload.id+'/convert',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({project:JSON.parse(snapshot),cell:dialog.querySelector('#gds-cell').value,layers,port_layers:JSON.parse(dialog.querySelector('#gds-ports').value),unmapped:dialog.querySelector('#gds-unmapped').value,replace_geometry:dialog.querySelector('#gds-replace').checked})});
    if(configSnapshot!==configuration()){invalidate();throw Error('Import settings changed during conversion. Preview again.');}
    dialog.querySelector('#gds-report').textContent=JSON.stringify(candidate.report,null,2);status('Ready to apply. Review the report and bounds; the FDTD region is unchanged.');dialog.querySelector('[data-gds="apply"]').disabled=false;dialog.querySelector('[data-gds="report"]').disabled=false;
   }else if(action==='apply'){
    if(snapshot!==JSON.stringify(getProject())){invalidate();throw Error('Project changed after preview. Preview again before applying.');}
    await loadProject(candidate.project);dialog.close();log('Imported GDS native geometry. Port metadata is available in the separate conversion report.');toast('GDS geometry imported');
   }
  }catch(error){status(error.message);}finally{busy=false;}
 });
 return {open(){upload=null;candidate=null;render();dialog.showModal();}};
}
// GDS export: XY outlines of enabled rectangles and polygons with an explicit layer per structure; the Z/material stack goes to a JSON sidecar.
export function setupGdsExport({esc,toast,log,api,getProject,download}) {
 const dialog=document.createElement('dialog');dialog.id='gds-export-dialog';dialog.className='gds-dialog';document.body.append(dialog);
 let busy=false;
 function render(){
  const project=getProject(),rows=project.structures.filter(s=>s.enabled),exportable=rows.filter(s=>['rectangle','polygon'].includes(s.kind)),other=rows.filter(s=>!['rectangle','polygon'].includes(s.kind));
  dialog.innerHTML=`<div class="fsp-heading"><h2>Export GDS</h2><button data-gds-export="close">Close</button></div>
   <p>Writes the XY outline of every enabled rectangle and polygon to one GDSII cell. GDS holds no extrusion or material, so the Z bounds, materials and mesh orders are returned in a JSON sidecar next to the file. Sources, monitors and solver settings are not exported.</p>
   <label>Cell name <input id="gds-export-cell" aria-label="GDS cell name" value="TOP" maxlength="32"></label>
   <table class="gds-export-table"><thead><tr><th>Structure</th><th>Kind</th><th>Material</th><th>Layer</th><th>Datatype</th></tr></thead><tbody>${exportable.map((s,i)=>`<tr data-id="${esc(s.id)}"><td>${esc(s.name)}</td><td>${esc(s.kind)}</td><td>${esc(s.material)}</td><td><input type="number" min="0" max="65535" step="1" value="${i+1}" aria-label="Layer ${esc(s.name)}"></td><td><input type="number" min="0" max="65535" step="1" value="0" aria-label="Datatype ${esc(s.name)}"></td></tr>`).join('')}</tbody></table>
   ${other.length?`<p class="warning">Not exportable and must be disabled first: ${esc(other.map(s=>s.name+' ('+s.kind+')').join(', '))}. GDS export supports rectangles and polygons only.</p>`:''}
   <p id="gds-export-status" role="status">${exportable.length?`${exportable.length} structure${exportable.length===1?'':'s'} ready.`:'No enabled rectangle or polygon to export.'}</p>
   <button data-gds-export="run" ${exportable.length?'':'disabled'}>Export .gds and sidecar</button>`;
 }
 dialog.addEventListener('click',async event=>{
  const action=event.target.closest('[data-gds-export]')?.dataset.gdsExport;if(!action||busy)return;
  if(action==='close'){dialog.close();return;}
  busy=true;const status=dialog.querySelector('#gds-export-status');
  try{
   const layers={};
   for(const row of dialog.querySelectorAll('tbody tr')){const [layer,datatype]=[...row.querySelectorAll('input')].map(el=>Number(el.value));if(![layer,datatype].every(v=>Number.isInteger(v)&&v>=0&&v<=65535))throw Error('Layer and datatype must be integers from 0 to 65535.');layers[row.dataset.id]=[layer,datatype];}
   const cell=dialog.querySelector('#gds-export-cell').value.trim();status.textContent='Exporting…';
   const result=await api('/gds/export',{project:getProject(),layers,cell});
   const bytes=Uint8Array.from(atob(result.gds_base64),c=>c.charCodeAt(0)),name=getProject().name.replace(/[^a-z0-9]/gi,'_');
   download(bytes,name+'.gds','application/octet-stream');download(JSON.stringify(result.sidecar,null,2),name+'.gds.json');
   status.textContent=`Exported ${result.sidecar.structures} structure${result.sidecar.structures===1?'':'s'} (${result.bytes} bytes) with the layer stack sidecar.`;
   log(`Exported GDS cell ${cell}: ${result.sidecar.structures} structures, ${result.bytes} bytes, sidecar ${name}.gds.json.`);toast('GDS exported with its layer stack sidecar');
  }catch(error){status.textContent=error.message;}finally{busy=false;}
 });
 return {open(){render();dialog.showModal();}};
}
