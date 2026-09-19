import { drawPlot } from './views.js';

const defaults={wavelength:1.55,pulse:'gaussian',pulse_cycles:3,time_definition:'cycles',pulse_length:20e-15,pulse_offset:50e-15,signal:null,wavelength_start:1.3,wavelength_stop:1.8,optimize_for_short_pulse:true,eliminate_discontinuities:false,chirp_bandwidth_hz:100e12};

export function polarizationControls(s,numeric,dropdown) {
 const vector=s.theta!=null;
 const oneWay=s.injection==='oneway';
 const family=vector?(oneWay?'<p class="property-help">Electric polarization. Its magnetic partner is generated automatically.</p>':`<label class="property-row"><span>field type</span><select aria-label="field type" data-source-family><option value="E" ${s.component[0]==='E'?'selected':''}>Electric</option><option value="H" ${s.component[0]==='H'?'selected':''}>Magnetic</option></select></label>`):dropdown('polarization','component',s.component,oneWay?['Ex','Ey','Ez'].filter(c=>c[1]!==s.normal):['Ex','Ey','Ez','Hx','Hy','Hz']);
 return family+`<label class="enabled-row"><input type="checkbox" data-source-vector ${vector?'checked':''}> Use theta / phi orientation</label>`+(vector?numeric('theta','theta',s.theta,'deg',{min:0,max:180})+numeric('phi','phi',s.phi??0,'deg')+`<p class="property-help">Theta is measured from +z. Phi turns from +x toward +y. The source has unit vector (sin θ cos φ, sin θ sin φ, cos θ).</p>`:'');
}

export function planeControls(s,r,numeric,dropdown) {
 if(s.kind==='tfsf')return dropdown('propagation axis','normal',s.normal??'x',r.dimension==='2d'?['x','y']:['x','y','z'])+dropdown('direction','direction',s.direction??'+',[['+','Forward (+axis)'],['-','Backward (-axis)']])+numeric('incident PML layers','incident_pml_cells',s.incident_pml_cells??96,'',{min:32,max:512,step:1})+'<p class="property-help">Normal-incidence TFSF box. Inside contains total fields and outside contains scattered fields. Keep the scatterer away from every face, with homogeneous background on the faces and PML on all active domain boundaries.</p>';
 if(s.kind!=='plane')return '';
 return dropdown('injection','injection',s.injection??'soft',[['soft','Soft sheet / bidirectional'],['oneway','One-way plane / normal incidence']])+(s.injection==='oneway'?dropdown('propagation axis','normal',s.normal??'x',r.dimension==='2d'?['x','y']:['x','y','z'])+dropdown('direction','direction',s.direction??'+',[['+','Forward (+axis)'],['-','Backward (-axis)']])+numeric('incident PML layers','incident_pml_cells',s.incident_pml_cells??96,'',{min:32,max:512,step:1}):'')+'<p class="property-help">Selecting one-way fills the transverse cell, sets its boundaries to Periodic and the propagation boundaries to PML. Place its full plane in homogeneous background. This source does not select a waveguide mode or an oblique angle.</p>';
}

export function configureOneWayPlane(s,r,{boundaries=false}={}) {
 if(s.kind==='tfsf'){
  if(r.dimension==='2d'&&s.normal==='z')s.normal='x';
  if(s.component[0]!=='E'||s.component[1]===s.normal){s.component=s.normal==='z'?'Ex':'Ez';s.theta=null;s.phi=0;}
  return;
 }
 if(s.injection!=='oneway')return;
 s.normal??='x';s.direction??='+';
 if(r.dimension==='2d'&&s.normal==='z')s.normal='x';
 const a='xyz'.indexOf(s.normal),active=r.dimension==='2d'?2:3;
 s.size=[0,0,0];
 for(let i=0;i<active;i++){
  if(i!==a){s.center[i]=0;s.size[i]=Math.ceil(r.size[i]/r.mesh-1e-12)*r.mesh;}
  if(boundaries){for(const side of ['min','max'])r.boundaries['xyz'[i]+'_'+side].kind=i===a?'pml':'periodic';r.bloch_phase[i]=0;}
 }
 if(s.component[0]!=='E'||s.component[1]===s.normal){s.component='E'+(a===2?'x':'z');s.theta=null;s.phi=0;}
}

function rangeParameters(s) {
 const low=299792458/(s.wavelength_stop*1e-6),high=299792458/(s.wavelength_start*1e-6),f=(low+high)/2;
 const length=(s.optimize_for_short_pulse?2:8)/(high+.01*low),sigma=length/(2*Math.sqrt(Math.log(2)));
 return {wavelength:299792458/f*1e6,length,offset:1.1*Math.sqrt(2*Math.log(1e4))*sigma,span:high-low,chirped:high-low>Math.sqrt(Math.log(2))/(Math.PI*sigma)};
}

export function updateTemporalField(s,key,value) {
 const wasRange=['wavelength','frequency'].includes(s.time_definition),p=wasRange?rangeParameters(s):null;
 s[key]=value;
 if(key==='pulse'&&value==='broadband'&&!wasRange){s.time_definition='wavelength';s.eliminate_discontinuities=true;}
 if((key==='pulse'&&value!=='broadband'&&wasRange)||(key==='time_definition'&&value==='standard'&&wasRange)){
  s.time_definition='standard';s.wavelength=p.wavelength;s.pulse_length=p.length;s.pulse_offset=p.offset;s.chirp_bandwidth_hz=Math.max(p.span,1);
  if(key==='time_definition'&&!p.chirped)s.pulse='gaussian';
 }
}

export function temporalControls(s,numeric,dropdown,prefix='') {
 for(const [key,value] of Object.entries(defaults))s[key]??=value;
 const broad=s.pulse==='broadband',range=['wavelength','frequency'].includes(s.time_definition);
 const checkbox=(label,key)=>`<label class="enabled-row"><input type="checkbox" aria-label="${prefix}${label}" data-path="${key}" ${s[key]?'checked':''}> ${label}</label>`;
 let html=dropdown('pulse','pulse',s.pulse,[['gaussian','Gaussian'],['broadband','Broadband / automatic range'],['continuous','Continuous wave'],...(s.signal?[['sampled','User time signal']]:[])]);
 if(s.pulse==='sampled')return numeric('wavelength','wavelength',s.wavelength,'µm',{min:.001})+html+`<p class="property-help">${s.signal.time_s.length.toLocaleString()} time/amplitude/phase samples. Time in seconds, phase in radians.</p>`;
 html+=dropdown('time definition','time_definition',s.time_definition,broad?[['wavelength','Wavelength range'],['frequency','Frequency range'],['standard','Time domain']]:[['cycles','Pulse cycles'],['standard','Standard time domain']]);
 if(range){
  if(s.time_definition==='wavelength')html+=numeric('wavelength start','wavelength_start',s.wavelength_start,'µm',{min:.001})+numeric('wavelength stop','wavelength_stop',s.wavelength_stop,'µm',{min:.001});
  else html+=numeric('frequency start','wavelength_stop',299.792458/s.wavelength_stop,'THz',{min:.001,reciprocal:299.792458})+numeric('frequency stop','wavelength_start',299.792458/s.wavelength_start,'THz',{min:.001,reciprocal:299.792458});
  const p=rangeParameters(s);
  html+=checkbox('Optimize for short pulse','optimize_for_short_pulse')+`<p class="property-help" data-source-band-summary>${p.chirped?'Chirped':'Standard'} Gaussian · center ${p.wavelength.toFixed(5)} µm · power FWHM ${(p.length*1e15).toFixed(4)} fs · offset ${(p.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.</p>`;
 }else{
  html+=numeric('wavelength','wavelength',s.wavelength,'µm',{min:.001});
  html+=s.time_definition==='standard'?numeric('pulselength (power FWHM)','pulse_length',s.pulse_length*1e15,'fs',{min:.001,scale:1e-15})+(s.pulse!=='continuous'?numeric('offset','pulse_offset',s.pulse_offset*1e15,'fs',{min:0,scale:1e-15}):''):numeric('pulse width','pulse_cycles',s.pulse_cycles,'cycles',{min:1});
  if(broad)html+=numeric('chirp bandwidth','chirp_bandwidth_hz',s.chirp_bandwidth_hz*1e-12,'THz',{min:.001,scale:1e12});
 }
 if(s.pulse!=='continuous')html+=checkbox('Eliminate discontinuities','eliminate_discontinuities');
 return html;
}

export function parseTimeSignal(text, filename='signal.csv') {
 if(filename.toLowerCase().endsWith('.json'))return JSON.parse(text);
 const rows=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/).filter(row=>row.trim());
 if(rows.shift()?.trim()!=='time_s,amplitude,phase_rad')throw Error('CSV header must be time_s,amplitude,phase_rad. Use seconds and unwrapped radians.');
 const signal={time_s:[],amplitude:[],phase_rad:[]};
 rows.forEach((row,i)=>{const cells=row.split(',');if(cells.length!==3||cells.some(v=>!v.trim()||!Number.isFinite(Number(v))))throw Error(`Invalid numeric data on CSV row ${i+2}.`);Object.keys(signal).forEach((key,k)=>signal[key].push(Number(cells[k])));});
 return signal;
}

export function setupSourceTools({state,api,esc,commit,toast}) {
 const dialog=document.createElement('dialog');dialog.className='source-dialog';document.body.append(dialog);
 const $=s=>dialog.querySelector(s);
 const close=()=>dialog.close();
 const open=html=>{dialog.innerHTML=html;dialog.showModal();dialog.querySelectorAll('[data-source-close]').forEach(b=>b.onclick=close);};
 const fail=e=>{$('[role="alert"]').textContent=e.message;};
 const download=signal=>{const text=['time_s,amplitude,phase_rad',...signal.time_s.map((t,i)=>[t,signal.amplitude[i],signal.phase_rad[i]].join(','))].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='source-signal.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 const summary=signal=>signal?`${signal.time_s.length.toLocaleString()} samples · ${(signal.time_s[0]*1e15).toFixed(3)}–${(signal.time_s.at(-1)*1e15).toFixed(3)} fs`:'No time signal loaded';
 const table=signal=>signal?`<table><thead><tr><th>Time (fs)</th><th>Amplitude</th><th>Phase (rad)</th></tr></thead><tbody>${signal.time_s.slice(0,6).map((t,i)=>`<tr><td>${(t*1e15).toPrecision(6)}</td><td>${signal.amplitude[i].toPrecision(6)}</td><td>${signal.phase_rad[i].toPrecision(6)}</td></tr>`).join('')}</tbody></table>`:'';
 const signalInputs=`<label class="signal-file">Load time signal (CSV or JSON)<input type="file" accept=".csv,.json" aria-label="Time signal file"></label><p class="property-help">CSV: time_s,amplitude,phase_rad. Time is in seconds; phase is unwrapped radians. JSON uses arrays with the same names. 2–100,000 strictly increasing times. Amplitude and phase are interpolated separately; injection is zero outside the table.</p>`;
 async function validatedSignal(file, project, target) {
  if(file.size>16_000_000)throw Error('Time signal file exceeds 16 MB.');
  const signal=parseTimeSignal(await file.text(),file.name);
  target.signal=signal;target.pulse='sampled';
  if(['wavelength','frequency'].includes(target.time_definition))target.time_definition='standard';
  return (await api('/validate',project)).project;
 }
 async function signal(sourceId) {
  if(state.mode!=='layout')return;
  let draft=structuredClone(state.project),target=draft.sources.find(s=>s.id===sourceId);
  if(!target||target.use_global_source)throw Error('Edit the global source settings for an inherited signal.');
  open(`<h2>Time signal · ${esc(target.name)}</h2>${signalInputs}<div class="signal-summary"></div><div class="signal-table"></div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export>Download CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply time signal</button></div>`);
  const render=()=>{$('.signal-summary').textContent=summary(target.signal);$('.signal-table').innerHTML=table(target.signal);$('[data-export]').disabled=!target.signal;$('[data-apply]').disabled=!target.signal;};render();
  $('[type="file"]').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const candidate=structuredClone(draft);const source=candidate.sources.find(s=>s.id===sourceId);const valid=await validatedSignal(file,candidate,source);draft=valid;target=draft.sources.find(s=>s.id===sourceId);$('[role="alert"]').textContent='';render();}catch(e){fail(e);}finally{$('[type="file"]').value='';}};
  $('[data-export]').onclick=()=>download(target.signal);
  $('[data-apply]').onclick=async()=>{try{target.pulse='sampled';if(['wavelength','frequency'].includes(target.time_definition))target.time_definition='standard';const valid=await api('/validate',draft);commit(valid.project);close();}catch(e){fail(e);}};
 }
 async function globals() {
  if(state.mode!=='layout')return;
  let draft=structuredClone(state.project);draft.global_source??=structuredClone(defaults);
  const input=(name,path,value,unit='',options={})=>{
   const label={'wavelength':'wavelength (µm)','pulselength (power FWHM)':'pulselength (fs)','offset':'offset (fs)','pulse width':'pulse cycles'}[name]||name;
   return `<label class="property-row"><span>${name}</span><input aria-label="global ${label}" data-path="${path}" type="number" step="any" data-scale="${options.scale||1}" ${options.reciprocal?`data-reciprocal="${options.reciprocal}"`:''} value="${value}"><small>${unit}</small></label>`;
  };
  const select=(name,path,value,options)=>`<label class="property-row"><span>${name}</span><select aria-label="global ${name}" data-path="${path}">${options.map(([v,label])=>`<option value="${v}" ${v===value?'selected':''}>${label}</option>`).join('')}</select></label>`;
  const render=()=>{
   const s=draft.global_source;
   dialog.innerHTML=`<h2>Global source settings</h2><p>Shared temporal settings for sources with “Use global source settings” enabled. Each source keeps its own amplitude, phase and position.</p>${temporalControls(s,input,select,'global ')}${signalInputs}<div class="signal-summary">${summary(s.signal)}</div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export ${!s.signal?'disabled':''}>Download signal CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply global settings</button></div>`;
   $('[data-source-close]').onclick=close;
   dialog.querySelectorAll('[data-path]').forEach(el=>el.onchange=()=>{const value=el.type==='checkbox'?el.checked:el.type==='number'?(el.dataset.reciprocal?Number(el.dataset.reciprocal)/Number(el.value):Number(el.value)*Number(el.dataset.scale||1)):el.value;updateTemporalField(s,el.dataset.path,value);if(el.type!=='number')render();else if($('[data-source-band-summary]')){const p=rangeParameters(s);$('[data-source-band-summary]').textContent=`${p.chirped?'Chirped':'Standard'} Gaussian · center ${p.wavelength.toFixed(5)} µm · power FWHM ${(p.length*1e15).toFixed(4)} fs · offset ${(p.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.`;}});
   $('[type="file"]').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const candidate=structuredClone(draft);draft=await validatedSignal(file,candidate,candidate.global_source);render();}catch(e){fail(e);}};
   $('[data-export]').onclick=()=>download(s.signal);
   $('[data-apply]').onclick=async()=>{try{const valid=await api('/validate',draft);commit(valid.project);close();}catch(e){fail(e);}};
  };render();dialog.showModal();
 }
 async function preview(sourceId) {
  const project=structuredClone(state.project);
  open('<h2>Source time signal and spectrum</h2><p>Computing the injection at the current mesh time step…</p><p role="alert" class="error"></p><div class="dialog-actions"><button data-source-close>Close</button></div>');
  try {
   const data=await api('/sources/'+encodeURIComponent(sourceId)+'/preview',project);if(!dialog.open)return;
   dialog.innerHTML=`<h2>Source preview · ${esc(data.name)}</h2><p>${data.inherited?'Global':'Local'} pulse settings · ${data.enabled?'Enabled':'Disabled: zero injection'} · Δt ${data.dt_fs.toFixed(5)} fs · ${data.signal.length.toLocaleString()} samples</p>${data.pulse_parameters?`<p>${data.pulse_parameters.chirped?'Chirped':'Unchirped'} carrier · center ${data.pulse_parameters.center_wavelength_um.toFixed(5)} µm · power FWHM ${(data.pulse_parameters.pulse_length_s*1e15).toFixed(4)} fs</p>`:''}<div class="source-plot-tabs"><button data-mode="time" class="active">Time signal</button><button data-mode="spectrum">Spectrum</button><select aria-label="Source spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select></div><canvas aria-label="Source waveform"></canvas><p>${esc(data.note)}</p><div class="dialog-actions"><button data-source-close>Close</button></div>`;
   let spectrum=false;const draw=()=>drawPlot($('canvas'),[data],spectrum,$('select').value==='wavelength');
   dialog.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{spectrum=b.dataset.mode==='spectrum';$('select').hidden=!spectrum;dialog.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));draw();});
   $('select').onchange=draw;$('[data-source-close]').onclick=close;draw();
  }catch(e){if(dialog.open)fail(e);else toast(e.message);}
 }
 return {signal,globals,preview};
}
