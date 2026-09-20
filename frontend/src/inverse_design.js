import './inverse_design.css';

export function setupInverseDesign({esc}){
 const dialog=document.createElement('dialog');dialog.className='inverse-design-dialog';document.body.append(dialog);
 const $=s=>dialog.querySelector(s), storage='photonweave.periodicDesign.v1', jobStorage=storage+'.job';
 let config,jobId=localStorage.getItem(jobStorage),timer,busy=false,latest=null,showResult=false,painting=false;
 async function request(path,data){
  const r=await fetch('/api/'+path,data===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const value=r.headers.get('content-type')?.includes('json')?await r.json():await r.text();
  if(!r.ok)throw Error(typeof value.detail==='string'?value.detail:JSON.stringify(value.detail||value));return value;
 }
 function save(){localStorage.setItem(storage,JSON.stringify(config));}
 function download(value,name,type='application/json'){
  const url=URL.createObjectURL(new Blob([value],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 function error(e){$('[data-design-status]').textContent=e.message;}
 const field=(label,key,value,step='any')=>`<label>${label}<input aria-label="${label}" data-key="${key}" type="number" step="${step}" value="${esc(value)}"></label>`;
 const select=(label,key,values)=>`<label>${label}<select aria-label="${label}" data-key="${key}">${values.map(([v,t])=>`<option value="${v}" ${config[key]===v?'selected':''}>${t}</option>`).join('')}</select></label>`;
 function draw(){
  const data=showResult&&latest?.progress?.density_preview?latest.progress.density_preview:config.initial_density;
  const canvas=$('[data-density]'),ctx=canvas.getContext('2d'),nx=data.length,ny=data[0].length;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++){
   const v=Math.max(0,Math.min(1,Number(data[x][y])));ctx.fillStyle=`rgb(${Math.round(18+207*v)},${Math.round(39+190*v)},${Math.round(65+95*v)})`;
   ctx.fillRect(x*canvas.width/nx,(ny-1-y)*canvas.height/ny,Math.ceil(canvas.width/nx),Math.ceil(canvas.height/ny));
  }
  $('[data-density-caption]').textContent=(showResult?'Latest evaluated density':'Initial density')+` · x: ${nx}, y: ${ny} · 0 background / 1 design material`;
 }
 function setBusy(value){
  busy=value;dialog.querySelectorAll('fieldset').forEach(f=>f.disabled=value);
  $('[data-start-design]').disabled=value;$('[data-plan-design]').disabled=value;
  $('[data-stop-design]').disabled=!value;$('[data-load-design]').disabled=value;
  $('[data-use-seed]').disabled=value||!latest?.summary;
 }
 function render(){
  dialog.innerHTML=`<div class="fsp-heading"><div><h2>Inverse design · periodic layer</h2><p>FP32 · Torch adjoint · automatic memory placement</p></div><button data-close-design>Close</button></div>
  <p class="design-scope">Optimize a continuous density layer at one wavelength. This setup is separate from the CAD scene. Fixed materials, periodic x/y boundaries and PML in z. Mesh convergence and fabrication constraints require separate validation.</p>
  <div class="design-grid"><section class="design-settings"><fieldset><legend>Structure & illumination</legend>
   ${field('Wavelength (µm)','wavelength_um',config.wavelength_um)}
   ${field('Period x (µm)','period_um.0',config.period_um[0])}${field('Period y (µm)','period_um.1',config.period_um[1])}
   ${field('Layer height (µm)','height_um',config.height_um)}${field('Detector offset (µm)','detector_offset_um',config.detector_offset_um)}
   ${field('Background index','background_index',config.background_index)}${field('Design index','design_index',config.design_index)}
   ${field('Incidence θ (degrees)','theta_deg',config.theta_deg)}${field('Azimuth φ (degrees)','phi_deg',config.phi_deg)}
   ${field('Mesh (µm)','mesh_um',config.mesh_um)}${field('Time steps','steps',config.steps,1)}${field('PML cells','pml_cells',config.pml_cells,1)}
  </fieldset><fieldset><legend>Objective & optimizer</legend><p>Maximize weighted quadrant power, averaged over two polarizations.</p>
   ${['R','G2','G1','B'].map((n,i)=>field(n+' weight','objective_weights.'+i,config.objective_weights[i])).join('')}
   ${field('Adam updates','iterations',config.iterations,1)}${field('Learning rate','learning_rate',config.learning_rate)}
  </fieldset><fieldset><legend>Memory & execution</legend>
   ${select('Compute device','device',[['cpu','CPU'],['cuda','CUDA GPU']])}
   ${select('Execution mode','execution',[['auto','Automatic'],['resident','Resident'],['dram','DRAM streaming'],['file','File streaming']])}
   ${field('GPU budget (GiB)','gpu_budget_gib',config.gpu_budget_gib)}${field('DRAM budget (GiB)','host_budget_gib',config.host_budget_gib)}
   ${field('Checkpoints','checkpoints',config.checkpoints,1)}${field('Maximum slab width','slab_width',config.slab_width,1)}${field('Temporal depth','temporal_depth',config.temporal_depth,1)}
   <details><summary>Optional file backing</summary><label>State directory<input aria-label="State directory" data-key="state_directory" value="${esc(config.state_directory||'')}"></label>
   ${field('File budget (GiB)','disk_budget_gib',config.disk_budget_gib??'')}${field('Keep disk free (GiB)','disk_free_reserve_gib',config.disk_free_reserve_gib)}<p>Used only when explicitly configured. Default free-space reserve: 100 GiB.</p></details>
  </fieldset></section>
  <section class="design-density"><h3>Design region</h3><canvas data-density width="512" height="512" aria-label="Density editor"></canvas><p data-density-caption></p>
   <fieldset><legend>Initial density</legend><div class="design-density-tools"><label>x pixels<input aria-label="Density x pixels" data-nx type="number" value="${config.initial_density.length}" min="1" max="1024"></label><label>y pixels<input aria-label="Density y pixels" data-ny type="number" value="${config.initial_density[0].length}" min="1" max="1024"></label><label>Paint value<input aria-label="Density paint value" data-paint type="number" value="0.5" min="0" max="1" step="0.1"></label></div><button data-reset-density>Fill / resize initial density</button><button data-show-initial>Show initial density</button><p>Click or drag to paint. x increases right and y increases upward.</p></fieldset>
   <div class="design-file-tools"><button data-save-design>Save setup JSON</button><button data-load-design>Load setup JSON</button><button data-export-design>Export Python</button><input data-import-design type="file" accept=".json" hidden></div>
   <button data-use-seed disabled>Use evaluated result as new seed</button>
  </section>
  <section class="design-run"><h3>Execution plan</h3><button data-plan-design>Check memory</button><p data-plan-summary>No fields or trial simulations are run by the memory check.</p>
   <div class="design-run-buttons"><button data-start-design>Run inverse design</button><button data-stop-design disabled>Stop</button></div><p data-design-status role="status">Ready</p><p class="design-stop-note">Stop takes effect between solver calls. Closing this panel keeps the job running.</p>
   <h3>Evaluated objective</h3><table><thead><tr><th>Update</th><th>Score ↑</th><th>Gradient L2</th></tr></thead><tbody data-design-history></tbody></table><a data-design-download hidden>Download evaluated designs</a>
  </section></div>`;
  $('[data-close-design]').onclick=()=>dialog.close();
  dialog.querySelectorAll('[data-key]').forEach(input=>input.onchange=()=>{
   const [key,index]=input.dataset.key.split('.');let v=input.type==='number'?(input.value===''?null:Number(input.value)):input.value;
   if(key==='state_directory'&&!v)v=null;
   if(index!==undefined)config[key][Number(index)]=v;else config[key]=v;
   save();showResult=false;draw();$('[data-plan-summary]').textContent='Settings changed. Check memory before running.';
  });
  $('[data-reset-density]').onclick=()=>{try{
   const nx=Number($('[data-nx]').value),ny=Number($('[data-ny]').value),v=Number($('[data-paint]').value);
   if(!Number.isInteger(nx)||!Number.isInteger(ny)||nx<1||ny<1||nx*ny>1048576||v<0||v>1)throw Error('Use positive pixel counts and a density in [0,1].');
   config.initial_density=Array.from({length:nx},()=>Array(ny).fill(v));save();showResult=false;draw();$('[data-plan-summary]').textContent='Settings changed. Check memory before running.';
  }catch(e){error(e);}};
  $('[data-show-initial]').onclick=()=>{showResult=false;draw();};
  const canvas=$('[data-density]');
  function paint(e){if(busy||showResult)return;const r=canvas.getBoundingClientRect(),d=config.initial_density,v=Number($('[data-paint]').value);if(!Number.isFinite(v)||v<0||v>1)return;
   const x=Math.min(d.length-1,Math.max(0,Math.floor((e.clientX-r.left)/r.width*d.length))),y=Math.min(d[0].length-1,Math.max(0,d[0].length-1-Math.floor((e.clientY-r.top)/r.height*d[0].length)));
   d[x][y]=v;draw();
  }
  canvas.onpointerdown=e=>{painting=true;canvas.setPointerCapture(e.pointerId);paint(e);};canvas.onpointermove=e=>{if(painting)paint(e);};canvas.onpointerup=()=>{painting=false;save();};
  $('[data-plan-design]').onclick=async()=>{try{const plan=await request('design/plan',config);showPlan(plan);}catch(e){error(e);}};
  $('[data-start-design]').onclick=async()=>{try{setBusy(true);latest=null;const job=await request('design/jobs',config);jobId=job.id;localStorage.setItem(jobStorage,jobId);await poll();}catch(e){setBusy(false);error(e);}};
  $('[data-stop-design]').onclick=async()=>{try{await request('jobs/'+jobId+'/cancel',{});$('[data-design-status]').textContent='Stop requested. Waiting for the current solver call.';}catch(e){error(e);}};
  $('[data-save-design]').onclick=()=>download(JSON.stringify(config,null,2),'periodic-design.json');
  $('[data-export-design]').onclick=async()=>{try{download(await request('design/python',config),'periodic_design.py','text/x-python');}catch(e){error(e);}};
  $('[data-load-design]').onclick=()=>$('[data-import-design]').click();
  $('[data-import-design]').onchange=async e=>{try{
   const file=e.target.files[0];if(!file)return;const candidate=JSON.parse(await file.text());
   config=await request('design/config',candidate);save();showResult=false;latest=null;jobId=null;localStorage.removeItem(jobStorage);render();
  }catch(errorValue){error(errorValue);}};
  $('[data-use-seed]').onclick=async()=>{try{const result=await request('design/jobs/'+jobId+'/download');if(!result.last_evaluated)throw Error('No evaluated density is available.');config={...result.config,initial_density:result.last_evaluated.density};save();showResult=false;latest=null;jobId=null;localStorage.removeItem(jobStorage);render();}catch(e){error(e);}};
  draw();setBusy(busy);if(latest)showJob(latest);
 }
 function showPlan(plan){const mode=plan.selection?.mode||plan.execution;
  $('[data-plan-summary]').textContent=`${plan.device==='cuda'?'CUDA GPU':'CPU'} · ${mode} · FP32\nGPU ${(plan.gpu_reservation_bytes/1024**3).toFixed(3)} GiB · DRAM ${(plan.total_host_reservation_bytes/1024**3).toFixed(3)} GiB · file ${(plan.disk_reservation_bytes/1024**3).toFixed(3)} GiB reserved. No calibration solves.`;
 }
 function showJob(job){
  latest=job;const p=job.progress||{};setBusy(['queued','running'].includes(job.status));
  const sameSetup=JSON.stringify(job.config)===JSON.stringify(config);
  $('[data-design-status]').textContent=job.error||`${busy&&job.cancel_requested?'Stopping':job.status} · ${p.stage||'waiting'} · ${p.updates_completed||0} / ${job.config?.iterations||config.iterations} updates`;
  if(p.plan&&sameSetup)showPlan(p.plan);
  else if(!sameSetup)$('[data-plan-summary]').textContent='Settings differ from the displayed run. Check memory for this setup.';
  $('[data-design-history]').innerHTML=(p.history||[]).map(h=>`<tr><td>${h.update}</td><td>${h.objective.toPrecision(7)}</td><td>${h.gradient_l2===undefined?'—':h.gradient_l2.toExponential(3)}</td></tr>`).join('');
  if(p.density_preview&&sameSetup){showResult=true;draw();}
  const link=$('[data-design-download]');link.hidden=!job.summary;link.href='/api/design/jobs/'+jobId+'/download';
 }
 async function poll(){clearTimeout(timer);try{const job=await request('jobs/'+jobId);showJob(job);if(busy&&dialog.open)timer=setTimeout(poll,1500);}catch(e){setBusy(false);error(e);}}
 dialog.addEventListener('close',()=>clearTimeout(timer));
 return {async open(){
  if(!config){const defaults=await request('design/defaults');try{const saved=JSON.parse(localStorage.getItem(storage));config=saved?await request('design/config',saved):defaults;}catch{config=defaults;}
   if(!localStorage.getItem(storage)){const h=await request('health');config.device=h.cuda?'cuda':'cpu';}
  }
  render();dialog.showModal();if(jobId)await poll();
 }};
}
