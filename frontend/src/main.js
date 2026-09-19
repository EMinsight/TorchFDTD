import { createIcons, Waves, FolderOpen, Save, FileCode2, Box, Cylinder, Circle, Orbit, Scan, Radio, MoveRight, Activity, Copy, Trash2, Maximize, PencilRuler, Play, Square, Settings2, Undo2, Redo2, GitCommitHorizontal, CircleDot, Shapes, ChartNoAxesCombined, Terminal, Download, RefreshCw } from 'lucide';
const icons={Waves,FolderOpen,Save,FileCode2,Box,Cylinder,Circle,Orbit,Scan,Radio,MoveRight,Activity,Copy,Trash2,Maximize,PencilRuler,Play,Square,Settings2,Undo2,Redo2,GitCommitHorizontal,CircleDot,Shapes,ChartNoAxesCombined,Terminal,Download,RefreshCw};
import { Views, drawField, drawPlot } from './views.js';
import './style.css';
import { setupFspInspector } from './fsp.js';
import { setupNativeFsp } from './fsp_native.js';
import { setupSourceTools, temporalControls, updateTemporalField, polarizationControls, planeControls, configureOneWayPlane } from './sources.js';
import { setupMaterials } from './materials.js';
import { meshControls, setupMesh } from './mesh.js';
import { setupCapabilities } from './capabilities.js';
import { runControls } from './run_control.js';
import { geometryDefaults,geometryControls,rotationControls,setupGeometryEditor } from './geometry.js';
import { setupMonitorTools, spectralControls, fieldMonitorControls } from './monitor_tools.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=n=>`<i data-lucide="${n}"></i>`;
const state={project:null,selected:'fdtd',mode:'layout',snap:true,history:[],future:[],job:null,results:null,frame:0,tab:'geometry',bottom:'messages',dirty:false};
let views,health,pollTimer,playTimer,stats;
const messages=[];

$('#app').innerHTML=`
<header><div class="brand"><span class="brand-mark">${icon('waves')}</span><strong>PhotonWeave</strong><span class="product">FDTD</span></div><div class="project-title" id="project-title"></div><div class="connection" id="connection"><span class="dot"></span>Connecting to solver…</div></header>
<nav class="menubar"><button data-action="new">File</button><button data-action="undo">Edit</button><button data-action="fit">View</button><button data-action="materials">Materials</button><button data-action="region">Simulation</button><button data-action="capabilities">Feature checklist</button><button data-action="flux-results">Flux results</button><button data-action="help">Help</button><span class="version">DEVELOPMENT</span></nav>
<div class="ribbon-tabs"><button class="active" data-ribbon="design">Design</button><button data-ribbon="simulation">FDTD</button><button data-ribbon="view">View</button><span class="ribbon-note">Geometry and wavelength in µm</span></div>
<div class="ribbon">
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="open">${icon('folder-open')}<span>Open</span></button><button class="tool" data-action="save">${icon('save')}<span>Save</span></button><button class="tool" data-action="fsp">${icon('folder-open')}<span>FSP inspect</span></button><button class="tool editable" data-action="fsp-native">${icon('folder-open')}<span>FSP → GPU</span></button><button class="tool" data-action="python">${icon('file-code-2')}<span>Python</span></button></div><label>Project</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-add="rectangle">${icon('box')}<span>Rectangle</span></button><button class="tool editable" data-add="circle">${icon('cylinder')}<span>Circle</span></button><button class="tool editable" data-add="ring">${icon('circle')}<span>Ring</span></button><button class="tool editable" data-add="sphere">${icon('orbit')}<span>Sphere</span></button><button class="tool editable" data-add="polygon">${icon('shapes')}<span>Polygon</span></button></div><label>Structures</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="region">${icon('scan')}<span>FDTD region</span></button><button class="tool editable" data-add="point">${icon('radio')}<span>Dipole</span></button><button class="tool editable" data-add="plane">${icon('move-right')}<span>Sheet source</span></button><button class="tool editable" data-add="tfsf">${icon('scan')}<span>TFSF box</span></button><button class="tool editable" data-add="monitor">${icon('activity')}<span>Time monitor</span></button><button class="tool editable" data-add="field">${icon('activity')}<span>DFT / Flux</span></button></div><label>Simulation objects</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-action="duplicate">${icon('copy')}<span>Duplicate</span></button><button class="tool editable" data-action="delete">${icon('trash-2')}<span>Delete</span></button><button class="tool" data-action="fit">${icon('maximize')}<span>Fit view</span></button></div><label>Edit & view</label></div>
 <div class="tool-group run-tools"><div class="tool-row"><button class="tool" id="layout-button" data-action="layout">${icon('pencil-ruler')}<span>Layout</span></button><button class="tool run" id="run-button" data-action="run">${icon('play')}<span>Run</span></button><button class="tool stop" id="stop-button" data-action="stop" disabled>${icon('square')}<span>Stop</span></button></div><label>Run simulation</label></div>
</div>
<main>
 <aside class="left-panel"><div class="panel-heading">Objects Tree <span id="object-count"></span></div><div class="tree-tools"><button data-action="region" title="Edit selected object">${icon('settings-2')}</button><button data-action="undo" title="Undo (Ctrl+Z)">${icon('undo-2')}</button><button data-action="redo" title="Redo (Ctrl+Y)">${icon('redo-2')}</button><label><input type="checkbox" id="snap" checked> Snap</label></div><div id="tree"></div><div class="panel-heading results-heading">Results View</div><div id="results-tree" class="results-tree"><div class="muted empty-hint">Select Run to calculate fields<br>and monitor signals.</div></div><div class="left-footer"><span class="eyebrow">EXAMPLE PROJECTS</span><button data-example="waveguide">${icon('git-commit-horizontal')}SiN waveguide<span>2D</span></button><button data-example="scatterer">${icon('circle-dot')}Cylinder scattering<span>2D</span></button><button data-example="3d">${icon('orbit')}Dielectric sphere<span>3D</span></button></div></aside>
 <section class="workspace"><div class="workspace-tabs"><button class="active" data-tab="geometry">${icon('shapes')} Layout editor</button><button data-tab="fields">${icon('chart-no-axes-combined')} Field visualizer</button><span class="mode-badge" id="mode-badge">LAYOUT</span></div><div id="viewports" class="viewports"></div><div id="field-view" hidden><div class="field-tools"><strong id="field-label">Ez · XY plane</strong><span id="frame-label">No data</span><button data-action="playback" title="Animate stored frames">${icon('play')}</button><input type="range" id="frame-slider" min="0" max="0" value="0"><button data-action="download">${icon('download')} NPZ</button></div><canvas id="field-canvas"></canvas><div class="plot-title"><strong>Point monitor</strong><select id="plot-monitor" aria-label="Plot monitor"></select><select id="plot-axis" aria-label="Spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select><button data-plot="time" class="active">Time signal</button><button data-plot="spectrum">Field spectrum</button><button data-action="csv">${icon('download')} CSV</button></div><canvas id="monitor-canvas"></canvas></div>
 <section class="bottom-panel"><div class="bottom-tabs"><button class="active" data-bottom="messages">${icon('terminal')} Simulation log <span id="log-count"></span></button><button data-bottom="python">${icon('file-code-2')} Python script</button><div class="bottom-actions"><button data-action="export-python">Export .py</button></div></div><div id="messages" role="log"></div><textarea id="python-editor" spellcheck="false" readonly hidden aria-label="Generated Python script"></textarea></section></section>
 <aside class="right-panel"><div class="panel-heading">Object properties <span id="property-type"></span></div><div id="properties"></div><div class="mesh-card"><div><span class="eyebrow">SIMULATION SUMMARY</span><button data-action="validate" title="Validate mesh and geometry">${icon('refresh-cw')}</button></div><div id="mesh-summary">Validating project…</div></div></aside>
</main>
<footer><span id="status-text"><span class="dot"></span>Ready</span><span id="footer-grid"></span><div class="progress-track"><div id="progress-bar"></div></div><span id="progress-label"></span><span id="footer-device">Solver connecting</span></footer>
<input id="file-input" type="file" accept=".json,.fsp" hidden><dialog id="dialog"><div id="dialog-content"></div></dialog><div id="toast" role="alert" hidden></div>`;

function refreshIcons(){createIcons({icons,attrs:{'stroke-width':1.65}});}
function log(text,kind='info'){messages.push({text,kind,time:new Date().toLocaleTimeString('en-GB')});$('#messages').innerHTML=messages.slice(-100).map(m=>`<div class="log ${m.kind}"><time>${m.time}</time><span>${esc(m.text)}</span></div>`).join('');$('#messages').scrollTop=$('#messages').scrollHeight;$('#log-count').textContent=messages.length;}
function toast(text){$('#toast').textContent=text;$('#toast').hidden=false;setTimeout(()=>$('#toast').hidden=true,5000);}
async function api(path,body){const r=await fetch('/api'+path,body===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok){let data;try{data=await r.json();}catch{throw Error(`Server returned ${r.status}`);}throw Error(Array.isArray(data.detail)?data.detail.map(e=>e.loc.join('.')+': '+e.msg).join('\n'):data.detail||`Server returned ${r.status}`);}return r.headers.get('content-type')?.includes('json')?r.json():r.text();}
function selected(){return [...state.project.structures,...state.project.sources,...state.project.monitors].find(o=>o.id===state.selected);}
function category(id){return state.project.structures.some(o=>o.id===id)?'structures':state.project.sources.some(o=>o.id===id)?'sources':'monitors';}
function remember(){state.history.push(JSON.stringify(state.project));if(state.history.length>80)state.history.shift();state.future=[];}
function persist(){state.dirty=true;try{localStorage.setItem('photonweave.project.v1',JSON.stringify(state.project));}catch{toast('Browser storage is full. Use Save to keep this project before closing or reloading.');log('Automatic browser save failed. Export this project with Save to retain the current settings.','warning');}}
function change(id,patch,commit=true){Object.assign([...state.project.structures,...state.project.sources,...state.project.monitors].find(o=>o.id===id)||{},patch);if(commit){persist();renderProperties();renderTree();validate();}}
function select(id){state.selected=id;renderTree();renderProperties();views?.render();}
function setMode(mode){state.mode=mode;$('#mode-badge').textContent=mode.toUpperCase();$('#mode-badge').className='mode-badge '+mode;$$('.editable').forEach(b=>b.disabled=mode!=='layout');$('#run-button').disabled=mode!=='layout';$('#stop-button').disabled=mode!=='running';$('#layout-button').disabled=mode==='running';$$('[data-example]').forEach(b=>b.disabled=mode==='running');renderProperties();views?.render();}
function renderTree(){
 const p=state.project;$('#project-title').textContent=p.name;$('#object-count').textContent=p.structures.length+p.sources.length+p.monitors.length+1;
 const row=(o,symbol,cls='')=>`<button class="tree-row ${state.selected===o.id?'selected':''} ${cls}" data-select="${esc(o.id)}"><span class="tree-icon">${icon(symbol)}</span><span>${esc(o.name)}</span>${o.enabled===false?'<small>off</small>':''}</button>`;
 $('#tree').innerHTML=`<div class="tree-root">${icon('folder-open')} model</div>${row({id:'fdtd',name:'FDTD'},'scan','region-row')}<div class="tree-group">Structures <span>${p.structures.length}</span></div>${p.structures.map(o=>row(o,{rectangle:'box',circle:'cylinder',ring:'circle',sphere:'orbit',polygon:'shapes'}[o.kind])).join('')}<div class="tree-group">Sources <span>${p.sources.length}</span></div>${p.sources.map(o=>row(o,'radio','source-row')).join('')}<div class="tree-group">Monitors <span>${p.monitors.length}</span></div>${p.monitors.map(o=>row(o,'activity','monitor-row')).join('')}`;refreshIcons();
}
function numeric(label,path,value,unit='',options={}){return `<label class="property-row"><span>${label}</span><div><input aria-label="${label}" data-path="${path}" data-scale="${options.scale||1}" ${options.reciprocal?`data-reciprocal="${options.reciprocal}"`:''} type="number" value="${Number(value.toPrecision?.(12)??value)}" step="${options.step||'any'}" ${options.min!==undefined?`min="${options.min}"`:''}><small>${unit}</small></div></label>`;}
function dropdown(label,path,value,options){return `<label class="property-row"><span>${label}</span><select aria-label="${label}" data-path="${path}">${options.map(o=>{const [v,n]=Array.isArray(o)?o:[o,o];return `<option value="${esc(v)}" ${v===value?'selected':''}>${esc(n)}</option>`;}).join('')}</select></label>`;}
function section(name,body){return `<section class="property-section"><h3>${name}</h3>${body}</section>`;}
function renderProperties(){
 if(!state.project)return;const p=state.project,o=selected(),r=p.region;$('#property-type').textContent=o?o.kind||'monitor':'solver';
 let html='';
 if(!o){
 html=`<div class="object-title">${icon('scan')}<div><strong>FDTD</strong><small>Simulation region</small></div></div>`;
 html+=section('General',dropdown('dimension','dimension',r.dimension,[['2d','2D (XY)'],['3d','3D']])+dropdown('resource','backend',r.backend,[['auto','GPU if available'],['cuda','GPU · CUDA'],['cpu','CPU · NumPy']])+dropdown('precision','precision',r.precision,['float32','float64'])+dropdown('CUDA kernel','cuda_kernel',r.cuda_kernel||'torch',[['torch','PyTorch reference'],['fused','Fused Yee / CPML (experimental)']])+dropdown('Frequency monitor kernel','cuda_monitor_kernel',r.cuda_monitor_kernel||'torch',[['torch','PyTorch reference'],['fused','Shared CUDA plane DFT (experimental)']]));
 html+=section('Geometry',r.size.map((v,i)=>numeric('xyz'[i]+' span','size.'+i,v,'µm',{min:.01})).join(''));
 html+=section('Mesh settings',meshControls(r,numeric,dropdown,esc));
 html+=section('Boundary conditions',numeric('PML layers','pml_cells',r.pml_cells,'cells',{step:1,min:3})+['x','y',...(r.dimension==='3d'?['z']:[])].map((axis,i)=>{
 const faces=['min','max'].map(side=>{const key=axis+'_'+side,b=r.boundaries[key];return dropdown(axis+' '+side+' bc','boundaries.'+key+'.kind',b.kind,[['pml','PML'],['periodic','Periodic'],['bloch','Bloch']])+(b.kind==='pml'?`<details class="boundary-options"><summary>${axis} ${side} PML settings</summary>${numeric(axis+' '+side+' layers','boundaries.'+key+'.layers',b.layers??r.pml_cells,'cells',{step:1,min:3})}<label class="enabled-row"><input type="checkbox" data-boundary-default="${key}" ${b.layers===null?'checked':''}> Use default layers</label>${numeric('sigma scale','boundaries.'+key+'.sigma_scale',b.sigma_scale)}${numeric('kappa','boundaries.'+key+'.kappa',b.kappa)}${numeric('alpha','boundaries.'+key+'.alpha',b.alpha)}${numeric('polynomial','boundaries.'+key+'.polynomial',b.polynomial)}${numeric('alpha polynomial','boundaries.'+key+'.alpha_polynomial',b.alpha_polynomial)}</details>`:'');}).join('');
 return faces+(r.boundaries[axis+'_min'].kind==='bloch'?numeric('Bloch phase '+axis,'bloch_phase.'+i,r.bloch_phase[i],'rad'):'');
 }).join('')+numeric('background index','background_index',r.background_index,'',{min:1})+`<p class="property-help">Cyclic boundaries are paired. Bloch phase is the phase gained over one positive unit-cell translation. PML coefficients use the native CPML convention.</p>`);
 html+=section('Simulation time',numeric('dt stability factor','courant_factor',r.courant_factor??.99,'',{min:.01})+numeric('time steps','steps',r.steps,'',{step:1,min:10})+numeric('snapshot every','snapshot_interval',r.snapshot_interval,'steps',{step:1,min:1}));
 html+=section('Termination and diagnostics',runControls(r,numeric));
 html+=section('Field output',dropdown('component','field',r.field,['Ex','Ey','Ez','Hx','Hy','Hz'])+dropdown('plane normal','slice_axis',r.slice_axis,r.dimension==='2d'?['z']:['x','y','z'])+numeric('plane position','slice_position',r.slice_position,'µm')+dropdown('field display','complex_display',r.complex_display,[['real','Real'],['imag','Imaginary'],['magnitude','Magnitude'],['phase','Phase (rad)']]));
 }else{
 const cat=category(o.id),isStructure=cat==='structures',isSource=cat==='sources';
 html=`<div class="object-title">${icon(isStructure?'box':isSource?'radio':'activity')}<div><strong>${esc(o.name)}</strong><small>${isStructure?o.kind:isSource?o.kind+' source':o.kind==='field'?'Frequency / flux monitor':'Point time monitor'}</small></div></div><label class="property-row name-row"><span>name</span><input aria-label="name" data-path="name" value="${esc(o.name)}"></label><label class="enabled-row"><input type="checkbox" data-path="enabled" ${o.enabled?'checked':''}> Enabled in simulation</label>`;
 const spanAxes=o.kind==='field'?[0,1,2].filter(i=>i!=='xyz'.indexOf(o.normal)&&(r.dimension==='3d'||i<2)):o.kind==='tfsf'?[0,1,2].filter(i=>r.dimension==='3d'||i<2):o.kind==='rectangle'||o.kind==='plane'?[0,1,2]:['circle','ring','polygon'].includes(o.kind)?[2]:[];
 html+=section('Geometry',o.center.map((v,i)=>numeric('xyz'[i],'center.'+i,v,'µm')).join('')+spanAxes.map(i=>numeric('xyz'[i]+' span','size.'+i,o.size[i],'µm',{min:isStructure?.001:0})).join('')+(['circle','sphere','ring'].includes(o.kind)?numeric('radius','radius',o.radius,'µm',{min:.001}):'')+(o.kind==='ring'?numeric('inner radius','inner_radius',o.inner_radius,'µm',{min:0}):'')+(isStructure?geometryControls(o,numeric):''));
 if(isStructure){html+=section('Material',dropdown('material','material',o.material,p.materials.map(m=>m.name))+`<div class="static-row">refractive index <b>${(p.materials.find(m=>m.name===o.material)?.model||'dielectric')==='dielectric'?p.materials.find(m=>m.name===o.material)?.index:'dispersive'}</b></div>`+numeric('mesh order','mesh_order',o.mesh_order,'',{step:1,min:1})+`<p class="property-help">Lower order takes priority in overlaps. Open Materials to edit dielectric, Drude or Lorentz parameters and inspect n/k.</p>`);html+=section('Rotation',rotationControls(o,numeric,dropdown));}
 if(isStructure){const index=p.structures.findIndex(s=>s.id===o.id);html+=section('Structure order',`<button data-action="structure-earlier" ${index===0?'disabled':''}>Move earlier in tree</button><button data-action="structure-later" ${index===p.structures.length-1?'disabled':''}>Move later in tree</button><p class="property-help">When mesh orders are equal, the later structure takes priority in overlaps.</p>`);}
 if(isSource){
 o.time_definition??='cycles';o.pulse_length??=20e-15;o.pulse_offset??=50e-15;o.phase??=0;
 const s=o.use_global_source?p.global_source:o;
 html+=section('Source settings',planeControls(o,r,numeric,dropdown)+polarizationControls(o,numeric,dropdown)+`<label class="enabled-row"><input type="checkbox" data-path="use_global_source" ${o.use_global_source?'checked':''} ${!p.global_source?'disabled':''}> Use global source settings</label><button data-action="global-source">Edit global source settings</button>${!p.global_source?'<p class="property-help">Imported global settings are unavailable. Configure them before enabling inheritance.</p>':''}`+(s?`<fieldset ${o.use_global_source?'disabled':''}>`+temporalControls(s,numeric,dropdown)+`<button data-action="source-signal">Load / edit time signal</button></fieldset>`:'')+numeric('phase','phase',o.phase,'deg')+numeric('amplitude','amplitude',o.amplitude,'',{min:.001})+`<button data-action="source-preview">Preview time signal / spectrum</button><p class="property-help">${o.kind==='tfsf'?'Closed box with six-face E/H corrections and a live incident Yee line. Source preview shows the incident field at the entry face.':o.injection==='oneway'?'Normal-incidence discrete E/H plane with an eight-cell incident-line delay. Amplitude scales the incident-line soft drive. Source preview includes both corrections.':o.kind==='plane'?'Bidirectional E/H sheet. Bloch axes apply the unit-cell phase across the sheet.':'Reduced electric or magnetic point excitation. Magnetic sources use the H half-step time. Vector orientation may excite both 2D polarizations.'}</p>`);
 }
 if(!isStructure&&!isSource){
 o.spectrum??={sampling:'fft',wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:'hann',apodization_center:20e-15,apodization_time_width:10e-15};const s=o.use_global_monitor?p.global_monitor:o.spectrum,inheritApo=o.use_global_monitor&&o.inherit_apodization!==false,a=inheritApo?s:o.spectrum;
 html+=section('Monitor settings',(o.kind==='field'?fieldMonitorControls(o,r,numeric,dropdown):dropdown('component','component',o.component,['Ex','Ey','Ez','Hx','Hy','Hz'])+`<p class="property-help">Records one Yee field component at every time step. DFT downsampling affects spectral processing only.</p>`)+numeric('DFT time downsample','time_downsample',o.time_downsample||1,'',{min:1,step:1})+`<label class="enabled-row"><input type="checkbox" data-path="use_global_monitor" ${o.use_global_monitor?'checked':''}> Use global monitor settings</label>${o.use_global_monitor?`<label class="enabled-row"><input type="checkbox" data-path="inherit_apodization" ${inheritApo?'checked':''}> Inherit global apodization</label>`:''}<button data-action="global-monitor">Edit global monitor settings</button>`);
 html+=section('Frequency / wavelength',`<fieldset ${o.use_global_monitor?'disabled':''}>`+spectralControls(s,numeric,dropdown,{plane:o.kind==='field'})+`</fieldset><p class="property-help">DFT values are unnormalized field integrals. Power ratios require a matching air reference.</p>`);
 html+=section('Apodization',`<fieldset ${inheritApo?'disabled':''}>`+dropdown('apodization','spectrum.apodization',a.apodization,[['none','None'],['start','Start'],['end','End'],['full','Full'],...(o.kind==='field'?[]:[['hann','Hann (legacy FFT)']])])+(['start','end','full'].includes(a.apodization)?numeric('apodization center','spectrum.apodization_center',a.apodization_center*1e15,'fs',{min:0,scale:1e-15})+numeric('apodization time width','spectrum.apodization_time_width',a.apodization_time_width*1e15,'fs',{min:.001,scale:1e-15})+`<p class="property-help">Width is the intensity FWHM of the Gaussian window. Apodized spectra are not normalized transmission or absolute intensity.</p>`:'')+'</fieldset>');
 }
 }
 $('#properties').innerHTML=`<fieldset ${state.mode!=='layout'?'disabled':''}>${html}</fieldset>`;refreshIcons();bindBoundaryDefaults();
 $('#properties').querySelectorAll('[data-path]').forEach(input=>input.addEventListener('change',()=>{
  if(state.mode!=='layout')return;remember();const obj=selected()||p.region,parts=input.dataset.path.split('.');if(parts[0]==='downsample_xyz'&&!obj.downsample_xyz)obj.downsample_xyz=[obj.downsample||1,obj.downsample||1,obj.downsample||1];let target=obj;for(const part of parts.slice(0,-1))target=target[part];
  const value=input.type==='checkbox'?input.checked:input.type==='number'?(input.dataset.reciprocal?Number(input.dataset.reciprocal)/Number(input.value):Number(input.value)*Number(input.dataset.scale||1)):input.value;
  if(parts.length===1&&p.sources.includes(obj))updateTemporalField(obj,parts[0],value);else target[parts.at(-1)]=value;
  if(obj===r&&parts[0]==='mesh_type'&&value==='graded'){r.material_sampling='yee';r.mesh_max=Math.max(r.mesh_max,r.mesh);}
  if(obj===r&&parts[0]==='mesh_type'&&value!=='explicit')r.mesh_coordinates=null;
  if(p.sources.includes(obj)&&['injection','normal'].includes(parts[0]))configureOneWayPlane(obj,r,{boundaries:true});
  if(obj.kind==='field'&&parts[0]==='normal'){const old=obj.size.indexOf(0),axis='xyz'.indexOf(value);if(old!==axis){obj.size[old]=Math.min(1,r.size[old]/2);obj.size[axis]=0;}}
  if(parts.join('.')==='spectrum.sampling'&&value==='custom'&&!obj.spectrum.custom_frequencies_hz?.length)obj.spectrum.custom_frequencies_hz=[200e12];
  if(parts.join('.')==='spectrum.sampling'&&input.value!=='fft'&&obj.spectrum.apodization==='hann')obj.spectrum.apodization='none';
  if(parts.join('.')==='spectrum.sampling'&&value==='fft')obj.spectrum.use_source_limits=false;
  if(obj===r&&parts[0]==='boundaries'&&parts[2]==='kind'){const [axis,side]=parts[1].split('_');const kind=input.value,other=axis+'_'+(side==='min'?'max':'min');if(kind!=='pml'||r.boundaries[other].kind!=='pml')r.boundaries[other].kind=kind;if(kind!=='bloch')r.bloch_phase['xyz'.indexOf(axis)]=0;}
  if(obj===r&&parts[0]==='dimension'&&r.dimension==='2d'){r.slice_axis='z';r.slice_position=0;r.bloch_phase[2]=0;r.boundaries.z_min.kind='pml';r.boundaries.z_max.kind='pml';p.sources.forEach(s=>s.center[2]=0);p.monitors.forEach(s=>{s.center[2]=0;if(s.kind==='field'&&s.normal==='z'){s.normal='x';s.size[0]=0;s.size[2]=1;}});}
  if(obj===r&&parts[0]==='dimension'&&r.mesh_type==='explicit'){r.mesh_type='uniform';r.mesh_coordinates=null;}
  if(obj===r&&['size','mesh','dimension'].includes(parts[0]))p.sources.forEach(s=>configureOneWayPlane(s,r));
  persist();renderTree();views.render();renderProperties();validate();
 }));
 $('#properties').querySelectorAll('[data-record-family]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();const key=input.dataset.recordFamily,defaults=key==='record_fields'?['Ex','Ey','Ez','Hx','Hy','Hz']:['x','y','z'],chosen=new Set(o[key]??defaults);if(input.checked)chosen.add(input.value);else chosen.delete(input.value);o[key]=defaults.filter(c=>chosen.has(c));persist();renderProperties();validate();});
 $('#properties').querySelectorAll('[data-source-vector]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();o.theta=input.checked?(o.component[1]==='z'?0:90):null;o.phi=o.component[1]==='y'?90:0;persist();renderProperties();views.render();validate();});
 $('#properties').querySelectorAll('[data-source-family]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();o.component=input.value+o.component[1];persist();renderProperties();views.render();validate();});
 $('#properties').querySelectorAll('[data-frequency-table]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();o.spectrum.custom_frequencies_hz=input.value.trim().split(/[\s,;]+/).filter(Boolean).map(v=>Number(v)*1e12);persist();validate();});
 $('#properties').querySelectorAll('[data-run-field-limit]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();r.run_control.field_limit=input.checked?1e6:null;persist();renderProperties();validate();});
 $('#properties').querySelectorAll('[data-axis-steps]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();r.mesh_steps=input.checked?[r.mesh,r.mesh,r.mesh]:null;if(input.checked)r.material_sampling='yee';persist();renderProperties();views.render();validate();});
 $('#properties').querySelectorAll('[data-fixed-dt]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();r.time_step_override=input.checked?(stats?.dt_fs??.01)*.5e-15:null;persist();renderProperties();validate();});
}
function bindBoundaryDefaults(){
 $$('[data-boundary-default]').forEach(input=>input.onchange=()=>{if(state.mode!=='layout')return;remember();const r=state.project.region;r.boundaries[input.dataset.boundaryDefault].layers=input.checked?null:r.pml_cells;persist();renderProperties();views.render();validate();});
}
async function validate(){try{stats=await api('/validate',state.project);$('#mesh-summary').innerHTML=`<strong>${stats.shape.join(' × ')}</strong><span>${stats.cells.toLocaleString()} cells · ~${stats.estimated_memory_mb} MB</span>${stats.mesh_type==='graded'?`<span>${stats.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span>`:''}<span>Δt ${stats.dt_fs.toFixed(4)} fs · ${stats.duration_fs.toFixed(1)} fs total</span>${stats.warnings.map(w=>`<p class="warning">${esc(w)}</p>`).join('')}`;$('#footer-grid').textContent=stats.shape.join(' × ')+' cells';return true;}catch(e){$('#mesh-summary').innerHTML=`<p class="warning error">${esc(e.message)}</p>`;return false;}}
function add(kind){if(state.mode!=='layout'||!state.project||!views)return;remember();const id=crypto.randomUUID(),base={id,name:kind+'_'+(state.project.structures.length+state.project.sources.length+state.project.monitors.length+1),center:[0,0,0],enabled:true};
 if(['rectangle','circle','ring','sphere','polygon'].includes(kind))state.project.structures.push(geometryDefaults({...base,kind,size:[1,1,.5],radius:.5,inner_radius:.3,rotation:0,material:state.project.materials.find(m=>m.name.startsWith('SiN'))?.name||state.project.materials[0].name,mesh_order:2}));
 else if(kind==='field')state.project.monitors.push({...base,kind:'field',component:'Ez',normal:'x',size:[0,Math.min(1,state.project.region.size[1]/3),state.project.import_provenance&&state.project.region.dimension==='2d'?1:Math.min(1,state.project.region.size[2]/3)],downsample:1,use_global_monitor:false,spectrum:{sampling:'frequency',wavelength_start:1.3,wavelength_stop:1.8,frequency_points:41,apodization:'none',apodization_center:20e-15,apodization_time_width:10e-15}});
 else if(kind==='monitor')state.project.monitors.push({...base,component:'Ez',...(state.project.import_provenance?{spectrum:{sampling:'fft',apodization:'none'}}:{})});
 else if(kind==='tfsf'){
  const r=state.project.region,active=r.dimension==='2d'?2:3;
  const size=r.size.map((v,a)=>a>=active?0:Math.max(3*r.mesh,Math.min(2,v-2*(Math.max(r.boundaries['xyz'[a]+'_min'].layers??r.pml_cells,r.boundaries['xyz'[a]+'_max'].layers??r.pml_cells)+3)*r.mesh)));
  state.project.sources.push({...base,kind,injection:'oneway',normal:'x',direction:'+',size,component:'Ez',wavelength:1.55,amplitude:1,pulse:'gaussian',pulse_cycles:3,incident_pml_cells:96});
 }
 else state.project.sources.push({...base,kind,size:[0,1,0],component:'Ez',wavelength:1.55,amplitude:1,pulse:'gaussian',pulse_cycles:3});
 const source=state.project.sources.find(s=>s.id===id);
 if(source&&state.project.import_provenance)Object.assign(source,{time_definition:'standard',pulse_length:20e-15,pulse_offset:50e-15});
 persist();select(id);validate();log('Added '+base.name+'. Drag in a viewport or edit its properties.');
}
function download(text,name,type='application/json'){const u=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function setTab(tab){state.tab=tab;$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));$('#viewports').hidden=tab!=='geometry';$('#field-view').hidden=tab!=='fields';if(tab==='geometry')views.render();else renderResults();}
function setBottom(tab){state.bottom=tab;$$('[data-bottom]').forEach(b=>b.classList.toggle('active',b.dataset.bottom===tab));$('#messages').hidden=tab!=='messages';$('#python-editor').hidden=tab!=='python';if(tab==='python')api('/python',state.project).then(code=>$('#python-editor').value=code).catch(e=>toast(e.message));}
function renderResults(){const r=state.project.region,axis='xyz'.indexOf(r.slice_axis),dims=(state.results?.summary?.actual_size_um||r.size).filter((_,i)=>i!==axis);const result=state.results,frame=result?.frames[state.frame]||state.liveFrame;
 $('#field-label').textContent=r.field+' · '+r.complex_display+' · '+['YZ','XZ','XY'][axis]+' plane';$('#frame-label').textContent=result?'Step '+result.frame_steps[state.frame]:'Live field';$('#frame-slider').max=Math.max(0,(result?.frames.length||1)-1);$('#frame-slider').value=state.frame;
 const monitors=state.monitors||[];if(!monitors.some(m=>m.id===state.plotMonitor))state.plotMonitor=monitors[0]?.id;
 $('#plot-monitor').innerHTML=monitors.map(m=>`<option value="${esc(m.id)}" ${m.id===state.plotMonitor?'selected':''}>${esc(m.name)} · ${m.component}</option>`).join('');
 $('#plot-axis').hidden=!state.spectrum;
 drawField($('#field-canvas'),frame,dims,r.field+' '+r.complex_display,r.complex_display==='phase'?Math.PI:result?.max,r.complex_display==='phase'?'rad':'reduced field');drawPlot($('#monitor-canvas'),monitors.filter(m=>m.id===state.plotMonitor),state.spectrum,$('#plot-axis').value==='wavelength');
}
async function run(){
 if(state.mode!=='layout')return;if(!await validate()){toast('Fix the highlighted project settings before running.');return;}
 try{state.results=null;state.monitors=null;state.liveFrame=null;const job=await api('/jobs',state.project);state.job=job.id;localStorage.setItem('photonweave.activeJob',job.id);setMode('running');setTab('fields');log('Submitted '+state.project.name+' · '+state.project.region.backend+' · '+state.project.region.precision);stats.warnings.forEach(w=>log(w,'warning'));poll();}catch(e){log(e.message,'error');toast(e.message);}
}
async function poll(){
 try{const job=await api('/jobs/'+state.job),progress=job.progress;const pct=Math.round(100*progress.step/progress.total);$('#progress-bar').style.width=pct+'%';$('#progress-label').textContent=pct+'%';$('#status-text').textContent=job.status==='queued'?'Queued on solver':job.status==='running'?'Calculating fields…':job.status;state.liveFrame=progress.frame;
 if(state.tab==='fields')renderResults();
 if(['completed','cancelled','failed'].includes(job.status)){
  if(job.status==='failed'){localStorage.removeItem('photonweave.activeJob');setMode('analysis');log(job.error,'error');toast(job.error);return;}
  $('#status-text').textContent='Calculation complete · loading field results…';
  const result=await api('/jobs/'+state.job+'/fields');let max=1e-20;result.frames.forEach(f=>f.forEach(row=>row.forEach(v=>max=Math.max(max,Math.abs(v)))));result.max=max;state.results=result;state.frame=Math.max(0,result.frames.length-1);state.monitors=job.monitors;
  localStorage.removeItem('photonweave.activeJob');setMode('analysis');$('#status-text').textContent=job.status;
  $('#results-tree').innerHTML=`<button data-tab="fields">${icon('chart-no-axes-combined')} ${esc(state.project.region.field)} field snapshots</button>${job.monitors.map(m=>`<button data-tab="fields">${icon('activity')} ${esc(m.name)} · ${m.component}</button>`).join('')}<div class="run-summary"><b>${job.summary.seconds.toFixed(2)} s</b> solver loop<br>${job.summary.backend.toUpperCase()}${job.summary.cuda_graph?' · CUDA graph':''}${job.summary.cuda_kernel==='fused'?' · fused Yee / CPML':''}${job.summary.cuda_monitor_kernel==='fused'?' · shared plane DFT':''}<br>${job.summary.mcells_per_second.toFixed(1)} Mcells/s<br>${job.summary.gpu?esc(job.summary.gpu):'NumPy CPU'}<br>${job.summary.auto_shutoff?'Decay threshold reached':job.summary.cancelled?'Cancelled':'Step limit reached'}<br>${job.summary.steps} / ${job.summary.requested_steps??job.summary.steps} steps</div>`;
  refreshIcons();renderResults();log(`${job.status}: ${job.summary.steps} steps in ${job.summary.seconds.toFixed(3)} s, ${job.summary.mcells_per_second.toFixed(1)} Mcells/s. Setup ${job.summary.setup_seconds.toFixed(2)} s.`);job.summary.warnings.forEach(w=>log(w,'warning'));return;
 }
 pollTimer=setTimeout(poll,400);
 }catch(e){log('Connection lost: '+e.message+'. Retrying the same job…','warning');pollTimer=setTimeout(poll,2000);}
}
function showDialog(html){$('#dialog-content').innerHTML=html+'<div class="dialog-actions"><button data-close>Close</button></div>';$('#dialog').showModal();refreshIcons();}
function materials(){materialTools.open();}
const fspInspector=setupFspInspector({esc,toast,log});
const nativeFsp=setupNativeFsp({esc,toast,log,getProject:()=>state.project,loadProject:async project=>{
 if(state.mode==='running')throw Error('Wait for the active simulation to finish before opening a scene.');
 const validated=await api('/validate',project);remember();state.project=validated.project;state.selected='fdtd';
 state.results=null;state.monitors=null;state.liveFrame=null;state.job=null;
 $('#results-tree').innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>';
 persist();setMode('layout');setTab('geometry');renderTree();views.fit();await validate();
 log('Opened independently converted FSP scene. Conversion differences are retained with the project.');
}});
const materialTools=setupMaterials({state,api,esc,toast,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const meshTools=setupMesh({state,api,esc,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();views.render();validate();}});
const sourceTools=setupSourceTools({state,api,esc,toast,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const geometryTools=setupGeometryEditor({state,api,esc,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const capabilityTools=setupCapabilities({api,esc});
const monitorTools=setupMonitorTools({state,api,esc,toast,numeric,dropdown,commit:project=>{if(state.mode!=='layout')throw Error('Switch to Layout before editing.');remember();state.project=project;persist();renderProperties();renderTree();views.render();validate();}});
const actions={
 'geometry-vertices':()=>geometryTools.open(state.selected),
 'capabilities':()=>capabilityTools.open(),
 'global-monitor':()=>monitorTools.globals(),
 'flux-results':()=>monitorTools.flux(),
 'mesh-preview':()=>meshTools.open(),
 'mesh-freeze':()=>meshTools.freeze(),
 'mesh-nodes':()=>meshTools.editNodes(),
 'mesh-add':()=>meshTools.add(),
 'mesh-remove':button=>meshTools.remove(Number(button.dataset.index)),
 'global-source':()=>sourceTools.globals(),
 'source-signal':()=>sourceTools.signal(state.selected),
 'source-preview':()=>sourceTools.preview(state.selected),
 fsp:()=>fspInspector.open(),
 'fsp-native':()=>{if(state.mode==='layout')nativeFsp.open();},
 new:()=>{if(state.mode==='running')return;showDialog('<h2>Project files</h2><p>Save your current project before opening another design.</p><div class="dialog-buttons"><button data-action="save">Save current project</button><button data-action="open">Open project (.json)</button><button data-action="blank">New empty project</button></div>');},
 blank:async()=>{if(state.mode==='running')return;remember();const p=await api('/examples/waveguide');p.name='Untitled';p.structures=[];p.sources=[];p.monitors=[];state.project=p;state.selected='fdtd';state.results=null;state.monitors=null;state.liveFrame=null;persist();setMode('layout');setTab('geometry');renderTree();validate();$('#dialog').close();},
 save:()=>{download(JSON.stringify(state.project,null,2),state.project.name.replace(/[^a-z0-9]/gi,'_')+'.json');state.dirty=false;log('Project saved as JSON. Load the same file from Python with Project.load().');},
 open:()=>{if(state.mode!=='running')$('#file-input').click();},
 region:()=>select('fdtd'),fit:()=>views.fit(),materials,
 undo:()=>{if(state.mode!=='layout'||!state.history.length)return;state.future.push(JSON.stringify(state.project));state.project=JSON.parse(state.history.pop());persist();select('fdtd');validate();},
 redo:()=>{if(state.mode!=='layout'||!state.future.length)return;state.history.push(JSON.stringify(state.project));state.project=JSON.parse(state.future.pop());persist();select('fdtd');validate();},
 delete:()=>{if(state.mode!=='layout'||!selected())return;remember();const cat=category(state.selected);state.project[cat]=state.project[cat].filter(o=>o.id!==state.selected);persist();select('fdtd');validate();},
 duplicate:()=>{if(state.mode!=='layout'||!selected())return;remember();const o=structuredClone(selected());o.id=crypto.randomUUID();o.name+='_copy';o.center[0]+=.2;state.project[category(state.selected)].push(o);persist();select(o.id);validate();},
 'structure-earlier':()=>moveStructure(-1),
 'structure-later':()=>moveStructure(1),
 layout:()=>{if(state.mode==='running')return;state.results=null;state.liveFrame=null;state.monitors=null;state.job=null;$('#results-tree').innerHTML='<div class="muted empty-hint">Run again to calculate this layout.</div>';setMode('layout');setTab('geometry');log('Layout mode. Prior result downloads remain on the solver; the current visualizer was cleared.');},
 run,stop:async()=>{if(state.job){await api('/jobs/'+state.job+'/cancel',{});log('Stop requested. Waiting for the current time step to finish.');}},validate,
 python:()=>setBottom('python'),'export-python':async()=>{download(await api('/python',state.project),'simulation.py','text/x-python');},
 download:()=>{if(state.results)window.location.href='/api/jobs/'+state.job+'/download';else toast('Run the simulation first.');},
 csv:()=>{if(state.results)window.location.href='/api/jobs/'+state.job+(state.spectrum?'/spectra.csv':'/monitors.csv');else toast('Run the simulation first.');},
 playback:()=>{if(playTimer){clearInterval(playTimer);playTimer=null;return;}if(!state.results?.frames.length)return;playTimer=setInterval(()=>{if(!state.results){clearInterval(playTimer);playTimer=null;return;}state.frame=(state.frame+1)%state.results.frames.length;renderResults();},80);},
 'add-material':()=>{remember();state.project.materials.push({name:'Custom dielectric '+state.project.materials.length,index:1.5,color:'#60bdaa'});persist();$('#dialog').close();materials();},
 help:()=>showDialog(`<h2>From Lumerical to PhotonWeave</h2><p>The workbench follows the familiar Objects Tree, CAD views, FDTD region and Layout / Analysis workflow.</p><ol><li>Add a Rectangle, Circle, Ring or Sphere from the Design ribbon.</li><li>Select an object in the tree or any viewport. Drag to move. Edit x, y, z, spans, material and mesh order in Object properties.</li><li>Select FDTD to set dimension, mesh, PML and simulation time steps.</li><li>Add a dipole or bidirectional sheet source and point time monitors.</li><li>Run on the connected solver. Inspect field snapshots, time traces and field spectra.</li><li>Switch to Layout to edit, or export JSON, Python and NPZ results.</li></ol><p><b>Shortcuts:</b> Ctrl+S save · Ctrl+O open · Ctrl+D duplicate · Delete remove · Ctrl+Z undo · Ctrl+Y redo · F fit.</p><p>This is an independent open-source workbench. The FSP inspector reads and edits .fsp settings through an installed, licensed Lumerical API. FSP → GPU independently imports a verified subset of layout settings and displays unsupported settings and numerical differences. Arbitrary FSP execution and .lsf execution remain unimplemented. Sampled-data material fitting, anisotropy, mode ports, normalized flux, conformal interfaces and full commercial-solver equivalence are not implemented.</p>`),
};
function moveStructure(delta){
 if(state.mode!=='layout')return;
 const list=state.project.structures,index=list.findIndex(s=>s.id===state.selected),next=index+delta;
 if(index<0||next<0||next>=list.length)return;
 remember();[list[index],list[next]]=[list[next],list[index]];persist();select(state.selected);validate();
}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b||b.disabled||!state.project||!views)return;try{
 if(b.dataset.action)await actions[b.dataset.action]?.(b);
 if(b.dataset.add)add(b.dataset.add);
 if(b.dataset.select)select(b.dataset.select);
 if(b.dataset.tab)setTab(b.dataset.tab);
 if(b.dataset.bottom)setBottom(b.dataset.bottom);
 if(b.dataset.plot){state.spectrum=b.dataset.plot==='spectrum';$$('[data-plot]').forEach(a=>a.classList.toggle('active',a===b));renderResults();}
 if(b.dataset.example){if(state.mode==='running')return;remember();state.project=await api('/examples/'+b.dataset.example);state.results=null;state.monitors=null;state.liveFrame=null;state.selected='fdtd';persist();setMode('layout');setTab('geometry');renderTree();views.fit();validate();log('Opened example: '+state.project.name);}
 if(b.dataset.ribbon){$$('[data-ribbon]').forEach(a=>a.classList.toggle('active',a===b));if(b.dataset.ribbon==='simulation')select('fdtd');if(b.dataset.ribbon==='view')views.fit();}
 if(b.hasAttribute('data-close'))$('#dialog').close();
 }catch(error){toast(error.message);log(error.message,'error');}});
$('#file-input').onchange=async e=>{const file=e.target.files[0];if(!file)return;if(file.name.toLowerCase().endsWith('.fsp')){e.target.value='';$('#dialog').close();await fspInspector.openFile(file);return;}try{const p=JSON.parse(await file.text()),v=await api('/validate',p);remember();state.project=v.project;state.selected='fdtd';state.results=null;state.monitors=null;state.liveFrame=null;persist();setMode('layout');setTab('geometry');renderTree();views.fit();validate();$('#dialog').close();log('Opened '+file.name);}catch(error){toast(error.message);}e.target.value='';};
$('#snap').onchange=e=>state.snap=e.target.checked;
$('#frame-slider').oninput=e=>{state.frame=Number(e.target.value);renderResults();};
document.addEventListener('keydown',e=>{if(!state.project||!views||document.querySelector('dialog[open]'))return;if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;const key=e.key.toLowerCase();if(e.ctrlKey&&['s','o','d','z','y'].includes(key)){e.preventDefault();actions[{s:'save',o:'open',d:'duplicate',z:'undo',y:'redo'}[key]]();}else if(e.key==='Delete')actions.delete();else if(key==='f')views.fit();});
$('#plot-monitor').onchange=e=>{state.plotMonitor=e.target.value;renderResults();};
$('#plot-axis').onchange=()=>renderResults();
window.addEventListener('resize',()=>{if(state.tab==='fields')renderResults();});
async function init(){
 try{health=await api('/health');$('.version').textContent='DEVELOPMENT'+(health.version?' · '+health.version:'');$('#connection').innerHTML=`<span class="dot"></span>${health.cuda?esc(health.gpu):'CPU solver'} <small>${esc(health.hostname)}</small>`;$('#footer-device').textContent=health.cuda?'CUDA · '+health.gpu_memory_gb+' GB':'CPU · NumPy';
 const saved=localStorage.getItem('photonweave.project.v1');try{state.project=saved?(await api('/validate',JSON.parse(saved))).project:await api('/examples/waveguide');}catch{state.project=await api('/examples/waveguide');}
 views=new Views($('#viewports'),state,select,change,remember);renderTree();setMode('layout');views.fit();await validate();log('Connected to '+health.hostname+' · '+health.engine+'.');log('Select an object to edit. Add structures, configure FDTD and Run. Python and JSON use the same project model.');
 const active=localStorage.getItem('photonweave.activeJob');if(active){try{const job=await api('/jobs/'+active);state.project=job.project;state.job=active;setMode('running');renderTree();setTab('fields');poll();}catch{localStorage.removeItem('photonweave.activeJob');}}
 }catch(e){$('#connection').textContent='Solver unavailable';log(e.message,'error');toast('Cannot connect to the solver. Start photonweave serve and reload.');}
 refreshIcons();
}
$$('.editable').forEach(b=>b.disabled=true);$('#run-button').disabled=true;
init();
