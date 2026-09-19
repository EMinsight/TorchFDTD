export function setupNativeFsp({esc, toast, log, loadProject, getProject}) {
 const dialog=document.createElement('dialog');dialog.id='fsp-native-dialog';document.body.append(dialog);
 const input=document.createElement('input');input.type='file';input.accept='.fsp';input.id='fsp-native-input';input.hidden=true;document.body.append(input);
 let job=null,exported=null,busy=false,error='';
 function render(){const c=job?.conversion,p=c?.project,current=getProject(),objects=[...(current?.structures||[]),...(current?.sources||[]),...(current?.monitors||[])];
  const settingLabel=value=>{const item=objects.find(o=>value.startsWith(o.id+'.'));return item?item.name+': '+value.slice(item.id.length+1):value;};
  dialog.innerHTML=`<div class="fsp-heading"><div><h2>Import FSP for GPU</h2><span>${esc(job?.filename||'Independent scene import')}</span></div><button data-native="close">Close</button></div>
   <p>Reads supported layout settings without Lumerical. The original FSP is retained. A converted scene uses the native solver and its documented numerical definitions.</p>
   <div class="fsp-toolbar"><button data-native="open" ${busy?'disabled':''}>Choose .fsp</button><button data-native="load" ${!p||busy?'disabled':''}>Open converted scene</button>${c?'<button data-native="original">Download original .fsp</button><button data-native="report">Conversion report</button>':''}<button data-native="export" ${!p||busy?'disabled':''}>Export current scene</button></div>
   <p id="fsp-native-status" role="status">${busy?'Processing FSP settings…':error?esc(error):exported?'Scene export verified · download below':c?(p?'Ready to open · review calculation differences below':'Cannot run this FSP yet · unsupported settings below'):'Choose an FSP file to check and convert.'}</p>
   ${exported?`<p><button data-native="edited">Download edited .fsp</button> <button data-native="write-report">Scene export report</button></p>${exported.export_verification.native_only_settings.length?`<details><summary>Native JSON retains additional settings</summary><ul>${exported.export_verification.native_only_settings.map(s=>`<li>${esc(settingLabel(s))}</li>`).join('')}</ul></details>`:''}`:''}
   ${exported?.export_verification.structure_list?.changed?`<p data-native-structure-export>Structure list saved: ${exported.export_verification.structure_list.added.length} added · ${exported.export_verification.structure_list.removed.length} removed · ${exported.export_verification.structure_list.output_order.length} total. Native order and material priority verified. Reimport the edited file to use its updated object IDs. New object records have not been verified in external readers.</p>`:''}
   ${exported?.export_verification.source_list?.changed?`<p data-native-source-export>Source list saved: ${exported.export_verification.source_list.added.length} added · ${exported.export_verification.source_list.removed.length} removed · ${exported.export_verification.source_list.output_order.length} total. Native waveforms and order verified.</p>`:''}
   ${exported?.export_verification.monitor_list?.changed?`<p data-native-monitor-export>Monitor list saved: ${exported.export_verification.monitor_list.added.length} added · ${exported.export_verification.monitor_list.removed.length} removed · ${exported.export_verification.monitor_list.output_order.length} outputs. ${exported.export_verification.monitor_list.splits.length} component records separated. Native sampling and output order verified. Reimport the edited file before further FSP edits. External reader acceptance is unverified.</p>`:''}
   ${exported?.export_verification.mesh_export?.nodes_changed?`<p data-native-mesh-export>Mesh updated: ${exported.export_verification.mesh_export.shape_before.join(' × ')} → ${exported.export_verification.mesh_export.shape_after.join(' × ')} cells. Native reimport verified. External remeshing has not been verified.</p>`:''}
   ${p?'<p class="property-help">Exports mapped primitive, electric source and monitor additions, deletions, duplicates and order, source pulses, monitor spectra, duration, PML/Periodic settings and uniform mesh spacing/spans. New sources need explicit or ranged pulse settings. New time monitors need FFT with no apodization. Uniform isotropic export requires Cell centers sampling, and independent unequal axis spacing requires Yee sampling. Edited graded/explicit meshes and groups are not exported yet. Save native JSON to retain every native option and inheritance link.</p>':''}
   ${p?`<p>Original import: <b>${p.region.dimension.toUpperCase()}</b> · ${p.structures.length} structures · ${p.sources.length} sources · ${p.monitors.length} monitors · ${p.region.steps} steps</p>`:''}
   ${c?`<div class="native-issues">${c.issues.map(i=>`<p class="${i.severity==='error'?'error':'warning'}"><b>${esc(i.object_id)}</b><br>${esc(i.message)}</p>`).join('')}</div><p class="property-help">Coordinate origin in the source FSP: ${c.origin_m.map(v=>(v*1e6).toPrecision(5)).join(', ')} µm. Differences and source fingerprint remain in the saved native project.</p>`:''}`;
 }
 async function request(path,options){const r=await fetch('/api/fsp'+path,options),data=await r.json();if(!r.ok)throw Error(data.detail||'FSP conversion failed');return data;}
 async function wait(key){for(;;){const result=await request('/'+key);if(result.status==='failed')throw Error(result.error);if(result.status==='ready')return result;await new Promise(resolve=>setTimeout(resolve,400));}}
 async function openFile(file){if(busy)return;job=null;exported=null;error='';busy=true;render();if(!dialog.open)dialog.showModal();
  try{const created=await request('/native-import',{method:'POST',headers:{'Content-Type':'application/octet-stream','X-Filename':encodeURIComponent(file.name)},body:file});
   job=await wait(created.id);
   log(file.name+': '+(job.conversion.project?'native scene conversion ready.':'native execution blocked by unsupported settings.'),job.conversion.project?'info':'warning');
  }catch(e){error=e.message;toast(error);log('FSP conversion: '+error,'error');}finally{busy=false;render();}
 }
 input.onchange=()=>{const file=input.files[0];input.value='';if(file)openFile(file);};
 dialog.onclick=async e=>{const action=e.target.closest('[data-native]')?.dataset.native;
  if(action==='close')dialog.close();if(action==='open')input.click();
  if(action==='load'&&job?.conversion.project){try{await loadProject(job.conversion.project);dialog.close();}catch(e){toast(e.message);}}
  if(action==='original'||action==='report'){const a=document.createElement('a');a.href='/api/fsp/'+job.id+(action==='original'?'/download':'/conversion');a.download='';a.click();}
  if(action==='edited'||action==='write-report'){const a=document.createElement('a');a.href='/api/fsp/'+exported.id+(action==='edited'?'/download':'/write-report');a.download='';a.click();}
  if(action==='export'&&!busy){busy=true;error='';exported=null;render();
   try{const created=await request('/'+job.id+'/native-scene-export',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(getProject())});exported=await wait(created.id);log('Independent scene export verified.'+(exported.export_verification.mesh_export?.nodes_changed?' Mesh nodes updated.':''));}
   catch(e){error=e.message;toast(error);log('FSP scene export: '+error,'error');}finally{busy=false;render();}
  }
 };
 return {open(){render();if(!dialog.open)dialog.showModal();},openFile};
}
