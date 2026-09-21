import './mode_network_tools.css';

const clone=value=>structuredClone(value);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GiB=1024**3;
const progressLabels={validating:'Checking setup',preparing_modes:'Preparing port modes',admitting_material:'Checking material and memory limits',rasterizing:'Sampling project materials',calibration_and_forward:'Calibrating ports and solving fields',backward:'Calculating material derivatives',completed:'Results ready'};
const activeSource=project=>(project.sources||[]).find(source=>source.enabled!==false);
async function request(path,value){
 const response=await fetch('/api/'+path,value===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});
 const body=response.headers.get('content-type')?.includes('json')?await response.json():await response.text();
 if(!response.ok)throw Error(typeof body.detail==='string'?body.detail:JSON.stringify(body.detail||body));
 return body;
}
function download(text,name,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function initial(project){
 const source=activeSource(project);const normal=source?.normal||'x',axis='xyz'.indexOf(normal);
 const length=project.region?.size?.[axis]||4,mesh=project.region?.mesh||.1;
 const snap=x=>Math.round(x/mesh)*mesh;
 return {version:1,project:clone(project),normal,ports:[
  {name:'left',coordinate_um:snap(-length*.15),source_coordinate_um:snap(-length*.25),direction:1,mode_indices:[0]},
  {name:'right',coordinate_um:snap(length*.15),source_coordinate_um:snap(length*.25),direction:-1,mode_indices:[0]}],
  num_modes:1,open_ports:null,execution:{device:'cpu',checkpoints:4,gpu_budget_bytes:null,host_budget_bytes:8*GiB,resident_budget_bytes:null,network_budget_bytes:256*1024**2,output_budget_bytes:64*1024**2},
  objective:{output_channel:['right',0],input_channel:['left',0],quantity:'power'},differentiate_materials:[]};
}
function checkEnvelope(value){
 if(value?.version!==1||!value.project?.region||!Array.isArray(value.ports)||value.ports.length!==2||!value.execution||!['x','y','z'].includes(value.normal))throw Error('Choose a version 1 mode-network setup, not a Project file.');
 if(value.ports.some(p=>typeof p.name!=='string'||!Array.isArray(p.mode_indices)))throw Error('The setup needs two named ports with mode lists.');
 if(!Array.isArray(value.differentiate_materials))throw Error('The setup needs a material selection list.');
  const finite=x=>typeof x==='number'&&Number.isFinite(x);
 if(!Array.isArray(value.project.materials)||value.project.materials.some(m=>!m||typeof m.name!=='string')||!Array.isArray(value.project.sources)||value.project.sources.some(s=>!s||typeof s!=='object'))throw Error('The setup contains an invalid Project.');
 if(!Number.isInteger(value.num_modes)||value.num_modes<1||value.ports.some(p=>!finite(p.coordinate_um)||!finite(p.source_coordinate_um)||![1,-1].includes(p.direction)||!p.mode_indices.length||p.mode_indices.some(i=>!Number.isInteger(i)||i<0)))throw Error('Check the port coordinates, directions and mode indices.');
 const ex=value.execution;
 if(!['cpu','cuda'].includes(ex.device)||!Number.isInteger(ex.checkpoints)||ex.checkpoints<0||['host_budget_bytes','network_budget_bytes','output_budget_bytes'].some(k=>!finite(ex[k])||ex[k]<=0)||['gpu_budget_bytes','resident_budget_bytes'].some(k=>ex[k]!==null&&(!finite(ex[k])||ex[k]<=0)))throw Error('The setup contains invalid execution limits.');
 if(value.open_ports!==null&&(!value.open_ports||!finite(value.open_ports.cladding_epsilon)||!finite(value.open_ports.mode_budget_bytes)||!finite(value.open_ports.confinement_tolerance)||(value.open_ports.target_neff!==null&&!finite(value.open_ports.target_neff))))throw Error('The setup contains invalid open-guide settings.');
 if(value.objective!==null&&(!value.objective||!['real','imag','power'].includes(value.objective.quantity)||['input_channel','output_channel'].some(k=>!Array.isArray(value.objective[k])||value.objective[k].length!==2)))throw Error('The setup contains an invalid S objective.');
 return clone(value);
}

/** Separate version-1 setup, owning its Project snapshot and submitted job. */
export async function openModeNetwork(project,{toast=()=>{}}={}){
 if(!project?.region)throw Error('Open a project before setting up mode ports.');
 let draft=initial(project),generation=0,closed=false,job=null,pendingJob=false,timer=null,validation=null;
 const invalidInputs=new Set();
 const dialog=document.createElement('dialog');dialog.className='mode-network-dialog';document.body.append(dialog);
 const $=selector=>dialog.querySelector(selector);
 const status=text=>{$('[data-status]').textContent=text;};
 const error=e=>{status(e.message);toast(e.message);};
 const channels=()=>draft.ports.flatMap(p=>p.mode_indices.map(i=>[p.name,i]));
 const source=()=>activeSource(draft.project);
 const field=(label,path,value,{type='number',optional=false,step='any'}={})=>`<label>${esc(label)}<input aria-label="${esc(label)}" data-path="${path}" type="${type}" value="${esc(value??'')}" ${type==='number'?`step="${step}"`:''} ${optional?'data-optional':''}></label>`;
 const select=(label,path,value,options)=>`<label>${esc(label)}<select aria-label="${esc(label)}" data-path="${path}">${options.map(([v,t])=>`<option value="${esc(v)}" ${String(value)===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
 function updateButtons(){
  $('[data-run]').disabled=pendingJob||!!job||invalidInputs.size>0;
  for(const key of ['validate','python','export'])$(`[data-${key}]`).disabled=invalidInputs.size>0;
  $('[data-cancel]').disabled=!job&&!pendingJob;
 }
 function changed(){
  generation++;validation=null;$('[data-results]').replaceChildren();$('[data-downloads]').replaceChildren();
  status(job?'Setup changed. The earlier run is still active; its result will not replace this setup.':'Setup changed. Validate before running.');
 }
 function setPath(path,value){
  const keys=path.split('.');let target=draft;for(const key of keys.slice(0,-1))target=target[key];target[keys.at(-1)]=value;
 }
 function objectiveControls(){
  const choices=channels().map(c=>[JSON.stringify(c),`${c[0]} · mode ${c[1]}`]);
  return `<label><input type="checkbox" data-objective ${draft.objective?'checked':''}> Evaluate a selected S entry</label>${draft.objective?select('S quantity','objective.quantity',draft.objective.quantity,[['power','Power |S|²'],['real','Real S'],['imag','Imaginary S']])+select('Output channel','objective.output_channel',JSON.stringify(draft.objective.output_channel),choices)+select('Input channel','objective.input_channel',JSON.stringify(draft.objective.input_channel),choices):''}`;
 }
 function render(){
  const s=source(),materials=draft.project.materials||[];
  dialog.innerHTML=`<header><div><h2>Mode ports</h2><p>Two opposing fixed-mode ports · ${esc(draft.normal)} direction</p></div><button data-close>Close</button></header>
   <p>Closing this window cancels its active run. This setup uses its own copy of the current project. Main-scene edits do not change it. Mode profiles and port sections stay fixed; selected material derivatives apply only in the allowed interior.</p>
   <div class="mode-network-grid"><fieldset><legend>Port phase planes</legend>${draft.ports.map((p,i)=>`<section class="mode-port-row"><h3>${i?'Right port · inward −':'Left port · inward +'}</h3>${field(`${i?'Right':'Left'} port name`,`ports.${i}.name`,p.name,{type:'text'})}${field(`${i?'Right':'Left'} phase plane (µm)`,`ports.${i}.coordinate_um`,p.coordinate_um)}${field(`${i?'Right':'Left'} source plane (µm)`,`ports.${i}.source_coordinate_um`,p.source_coordinate_um)}${field(`${i?'Right':'Left'} mode indices`,`ports.${i}.mode_indices`,p.mode_indices.join(', '),{type:'text'})}</section>`).join('')}
   ${field('Number of solved modes','num_modes',draft.num_modes,{step:1})}<p>Phase planes and sources must align with the grid. Sources lie outside the two phase planes.</p></fieldset>
   <fieldset><legend>Guide and illumination</legend>${select('Transverse boundary','boundary',draft.open_ports?'open':'periodic',[['periodic','Periodic cell'],['open','Open guide with PML']])}
   ${draft.open_ports?field('Cladding permittivity','open_ports.cladding_epsilon',draft.open_ports.cladding_epsilon)+field('Target effective index','open_ports.target_neff',draft.open_ports.target_neff,{optional:true})+field('Mode budget (GiB)','open_ports.mode_budget_bytes',draft.open_ports.mode_budget_bytes/GiB)+field('Maximum tail fraction','open_ports.confinement_tolerance',draft.open_ports.confinement_tolerance):''}
   <p>Propagation normal: <strong>${esc(draft.normal)}</strong>, from the enabled source. Boundary choices must match the project.</p>
   ${s?field('Carrier wavelength (µm)','carrier',s.wavelength)+field('Pulse cycles','cycles',s.pulse_cycles??2):'<p>Add one enabled plane source in the main project, then reopen this setup.</p>'}
   ${field('Time steps','project.region.steps',draft.project.region.steps,{step:1})}<p>Requires one soft Gaussian plane source. Material, source and boundary support are checked by validation.</p></fieldset>
   <fieldset><legend>Execution</legend>${select('Compute device','execution.device',draft.execution.device,[['cpu','CPU'],['cuda','CUDA GPU']])}${field('Checkpoints','execution.checkpoints',draft.execution.checkpoints,{step:1})}
   ${[['Host budget (GiB)','host_budget_bytes'],['GPU budget (GiB)','gpu_budget_bytes'],['Resident budget (GiB)','resident_budget_bytes'],['Network budget (GiB)','network_budget_bytes'],['Output budget (GiB)','output_budget_bytes']].map(([label,key])=>field(label,`execution.${key}`,draft.execution[key]==null?null:draft.execution[key]/GiB,{optional:['gpu_budget_bytes','resident_budget_bytes'].includes(key)})).join('')}<p>Blank GPU or resident limits use backend defaults. Limits include the separately admitted solver and fixed mode preparation.</p></fieldset>
   <fieldset><legend>Objective and material derivatives</legend><div data-objective-controls>${objectiveControls()}</div><h3>Differentiate permittivity</h3>${materials.map(m=>`<label class="mode-material"><input type="checkbox" data-material="${esc(m.name)}" ${draft.differentiate_materials.includes(m.name)?'checked':''}> ${esc(m.name)} <small>${esc(m.model||'dielectric')}</small></label>`).join('')||'<p>No named materials in this project.</p>'}<p>Choose an objective to request material derivatives. Fixed source, port and PML regions are excluded. This does not differentiate the eigenmodes.</p></fieldset></div>
   <div class="mode-network-actions"><button data-import>Import setup</button><button data-export>Export setup JSON</button><button data-python>Export Python</button><input data-file type="file" accept=".json,application/json" hidden><button data-validate>Validate setup</button><button data-run>Run mode network</button><button data-cancel>Cancel run</button></div>
   <p data-status role="status">Ready to validate. Validation does not run the field simulation.</p><div data-results></div><div data-downloads></div>`;
  bind();updateButtons();
 }
 function bind(){
  dialog.querySelectorAll('[data-path]').forEach(input=>{
   const update=redraw=>{
   try{
    const path=input.dataset.path;let value=input.value;
    if(input.type==='number'){
     if(value===''&&input.hasAttribute('data-optional'))value=null;
     else {if(value.trim()===''||!Number.isFinite(Number(value)))throw Error('Enter a finite number.');value=Number(value);}
     if(path.endsWith('_bytes')&&value!==null)value=Math.round(value*GiB);
    }
    if(path==='boundary')draft.open_ports=value==='open'?{cladding_epsilon:(draft.project.region.background_index||1)**2,mode_budget_bytes:2*GiB,target_neff:null,confinement_tolerance:1e-4}:null;
    else if(path.endsWith('mode_indices')){value=value.split(',').map(v=>v.trim());if(value.some(v=>!/^\d+$/.test(v)))throw Error('Enter nonnegative mode indices separated by commas.');setPath(path,value.map(Number));}
    else if(path.startsWith('objective.')&&path.endsWith('_channel'))setPath(path,JSON.parse(value));
    else if(path==='carrier')source().wavelength=value;
    else if(path==='cycles')source().pulse_cycles=value;
    else setPath(path,value);
    if(path.startsWith('ports.')&&draft.objective){const list=channels();draft.objective.output_channel=list.find(c=>JSON.stringify(c)===JSON.stringify(draft.objective.output_channel))||list.at(-1);draft.objective.input_channel=list.find(c=>JSON.stringify(c)===JSON.stringify(draft.objective.input_channel))||list[0];}
    invalidInputs.delete(path);changed();updateButtons();if(redraw&&invalidInputs.size===0&&(path==='boundary'||path.startsWith('ports.'))){render();status('Setup changed. Validate before running.');}
   }catch(e){invalidInputs.add(input.dataset.path);changed();updateButtons();error(e);}
   };
   input.addEventListener('input',()=>update(false));
   input.addEventListener('change',()=>update(true));
  });
  $('[data-objective]').onchange=e=>{draft.objective=e.target.checked?{output_channel:channels().at(-1),input_channel:channels()[0],quantity:'power'}:null;changed();render();};
  dialog.querySelectorAll('[data-material]').forEach(input=>input.onchange=()=>{draft.differentiate_materials=[...dialog.querySelectorAll('[data-material]:checked')].map(x=>x.dataset.material);changed();});
  $('[data-close]').onclick=()=>dialog.close();
  $('[data-export]').onclick=()=>download(JSON.stringify(draft,null,2),'mode-network-v1.json');
  $('[data-import]').onclick=()=>$('[data-file]').click();
  $('[data-file]').onchange=async e=>{const file=e.target.files[0];if(!file)return;const token=++generation;try{const value=checkEnvelope(JSON.parse(await file.text()));if(closed||token!==generation)return;draft=value;invalidInputs.clear();changed();render();status('Setup imported. Validate before running.');}catch(err){if(!closed&&token===generation)error(err);}finally{e.target.value='';}};
  $('[data-validate]').onclick=()=>validate();
  $('[data-python]').onclick=async()=>{const token=generation;const snapshot=clone(draft);try{const value=await request('mode-networks/python',snapshot);if(closed||token!==generation)return;const text=typeof value==='string'?value:value.python;if(typeof text!=='string')throw Error('Python export returned no source.');download(text,'mode_network.py','text/x-python');status('Python exported for this setup.');}catch(e){if(!closed&&token===generation)error(e);}};
  $('[data-run]').onclick=run;
  $('[data-cancel]').onclick=cancel;
 }
 async function validate(){const token=generation,snapshot=clone(draft);status('Validating setup…');try{const value=await request('mode-networks/validate',snapshot);if(closed||token!==generation)return;validation=JSON.stringify(snapshot);status(`Setup validated. ${value.summary||'Ready for an explicitly requested run.'}`);}catch(e){if(!closed&&token===generation)error(e);}}
 function showResult(result){
  if(!Array.isArray(result.channels)||!Array.isArray(result.s_real)||!Array.isArray(result.s_imag))throw Error('The completed job has no S matrix.');
  const name=c=>`${c[0]} · ${c[1]}`,number=x=>Number(x).toPrecision(6);
  $('[data-results]').innerHTML=`<h3>Complex S matrix</h3><p>Rows: outgoing channel. Columns: incident channel. Phase planes: ${esc((result.phase_planes_um||[]).join(', '))} µm.</p><div class="mode-network-table"><table><thead><tr><th>Output / input</th>${result.channels.map(c=>`<th>${esc(name(c))}</th>`).join('')}</tr></thead><tbody>${result.channels.map((c,i)=>`<tr><th>${esc(name(c))}</th>${result.channels.map((_,j)=>{const re=result.s_real[i][j],im=result.s_imag[i][j];return `<td>${number(re)} ${im<0?'−':'+'} ${number(Math.abs(im))}i<small>|S|² ${number(re*re+im*im)}</small></td>`;}).join('')}</tr>`).join('')}</tbody></table></div><p>Selected objective: ${result.objective==null?'Not requested':number(result.objective)}</p><h3>Material permittivity derivatives</h3>${Object.entries(result.material_gradients||{}).length?`<table><thead><tr><th>Material</th><th>d objective / d epsilon</th></tr></thead><tbody>${Object.entries(result.material_gradients).map(([name,value])=>`<tr><td>${esc(name)}</td><td>${number(value)}</td></tr>`).join('')}</tbody></table>`:'<p>No material derivatives requested.</p>'}<details><summary>Run identity and preparation</summary><p>Request digest: <code data-request-digest>${esc(result.request_digest||'Unavailable')}</code></p><pre>${esc(JSON.stringify({modes:result.mode_summaries,admission:result.admission},null,2))}</pre></details>`;
 }
 async function poll(owned){
  if(closed||job!==owned)return;
  try{
   const value=await request(`mode-network-jobs/${encodeURIComponent(owned.id)}`);
   if(closed||job!==owned)return;
   const terminal=['completed','failed','cancelled','canceled'].includes(value.status);
   if(owned.generation===generation){
    const progress=typeof value.progress==='string'?value.progress:(value.progress?.message||progressLabels[value.progress?.phase]||value.progress?.phase);
    status(`${value.status}${progress?' · '+progress:''}`);
    if(value.status==='completed'){showResult(value.result);$('[data-downloads]').innerHTML=`<a href="/api/mode-network-jobs/${encodeURIComponent(owned.id)}/download" download>Download NPZ</a> <a href="/api/mode-network-jobs/${encodeURIComponent(owned.id)}/s.csv" download>Download S CSV</a>`;}
    if(value.status==='failed')status(`Failed: ${typeof value.error==='string'?value.error:JSON.stringify(value.error||'See server log')}`);
   }else status(terminal?'Earlier run finished. Validate and run the edited setup when ready.':'Earlier setup is still running. Cancel it before starting this setup.');
   if(terminal){job=null;updateButtons();return;}
   timer=setTimeout(()=>poll(owned),750);
  }catch(e){if(!closed&&job===owned){error(e);timer=setTimeout(()=>poll(owned),2000);}}
 }
 async function run(){
  if(job||pendingJob)return;
  const token=generation,snapshot=clone(draft);pendingJob=true;updateButtons();
  try{
   if(validation!==JSON.stringify(snapshot)){status('Validating before submission…');await request('mode-networks/validate',snapshot);}
   if(closed||token!==generation)return;
   status('Submitting to the shared queue…');const value=await request('mode-network-jobs',snapshot);
   if(!value.id)throw Error('Job submission returned no identifier.');
   if(closed||token!==generation){await request(`mode-network-jobs/${encodeURIComponent(value.id)}/cancel`,{});return;}
   job={id:value.id,generation:token};status(value.status||'queued');poll(job);
  }catch(e){if(!closed&&token===generation)error(e);}
  finally{pendingJob=false;if(!closed)updateButtons();}
 }
 async function cancel(){
  if(pendingJob&&!job){generation++;status('Submission cancelled. Any accepted worker will be stopped.');return;}
  if(!job)return;const owned=job;
  try{await request(`mode-network-jobs/${encodeURIComponent(owned.id)}/cancel`,{});if(!closed&&job===owned)status('Cancellation requested. Waiting for the worker to stop.');}catch(e){if(!closed)error(e);}
 }
 dialog.addEventListener('close',()=>{closed=true;generation++;clearTimeout(timer);if(job)request(`mode-network-jobs/${encodeURIComponent(job.id)}/cancel`,{}).catch(()=>{});dialog.remove();},{once:true});
 render();dialog.showModal();return dialog;
}
