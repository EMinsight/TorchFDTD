export function snapMesh(r,axis,value){
 if(r.dimension==='2d'&&axis===2)return 0;
 if(r.mesh_type==='explicit'&&r.mesh_coordinates?.[axis]){
  const nodes=r.mesh_coordinates[axis];let lo=0,hi=nodes.length-1;
  while(hi-lo>1){const mid=(lo+hi)>>1;if(nodes[mid]<value)lo=mid;else hi=mid;}
  return Math.abs(nodes[lo]-value)<=Math.abs(nodes[hi]-value)?nodes[lo]:nodes[hi];
 }
 const step=r.mesh_steps?.[axis]??r.mesh;return Math.round(value/step)*step;
}
export function pmlThickness(r,axis,side){
 if(r.dimension==='2d'&&axis===2)return 0;
 const face=r.boundaries?.['xyz'[axis]+'_'+side];if(face&&face.kind!=='pml')return 0;
 const n=face?.layers??r.pml_cells,nodes=r.mesh_coordinates?.[axis];
 if(r.mesh_type==='explicit'&&nodes)return side==='min'?nodes[n]-nodes[0]:nodes.at(-1)-nodes.at(-n-1);
 return n*(r.mesh_steps?.[axis]??r.mesh);
}
export function meshControls(r,numeric,dropdown,esc){
 r.mesh_type??='uniform';r.material_sampling??='cell';r.interface_method??='staircase';r.subpixel_quadrature??=8;r.mesh_max??=.15;r.mesh_grading??=1.25;r.mesh_ppw??=24;r.mesh_auto_refine??=true;r.mesh_refinements??=[];
 const graded=r.mesh_type==='graded',explicit=r.mesh_type==='explicit',axis=!!r.mesh_steps;
 return dropdown('mesh type','mesh_type',r.mesh_type,[['uniform','Uniform'],['graded','Graded · local refinement'],...(explicit?[['explicit','Explicit node arrays']]:[])])+
 (explicit?'<p class="property-help">Frozen node arrays. Geometry edits keep these nodes. Edit the arrays or select a generated mesh to change the grid.</p>':
 `<label class="enabled-row"><input type="checkbox" data-axis-steps ${axis?'checked':''}> Independent axis spacing</label>`+
 (axis?r.mesh_steps.map((v,i)=>numeric('d'+'xyz'[i],`mesh_steps.${i}`,v,'µm',{min:.001})).join(''):numeric(graded?'fine mesh step':'dx = dy = dz','mesh',r.mesh,'µm',{min:.001})))+
 dropdown('interface method','interface_method',r.interface_method,[['staircase','Staircase'],['subpixel','Subpixel · experimental dielectric']])+
 dropdown('interface sampling','material_sampling',r.material_sampling,graded||explicit||axis||r.interface_method==='subpixel'?[['yee','Yee component locations']]:[['cell','Cell centers (legacy)'],['yee','Yee component locations']])+
 (r.interface_method==='subpixel'?numeric('face quadrature order','subpixel_quadrature',r.subpixel_quadrature,'',{min:2,max:32,step:1})+'<p class="property-help">Lossless dielectrics and constant spacing on each axis only. Compare quadrature orders and mesh refinement. Curved-interface accuracy is under validation, especially at high index contrast.</p>':'')+
 `<label class="enabled-row"><input type="checkbox" data-fixed-dt ${r.time_step_override?'checked':''}> Set a smaller fixed time step</label>`+
 (r.time_step_override?numeric('time step','time_step_override',r.time_step_override*1e15,'fs',{min:.000001,scale:1e-15}):'')+
 (graded?numeric('maximum step','mesh_max',r.mesh_max,'µm',{min:r.mesh})+numeric('grading factor','mesh_grading',r.mesh_grading,'',{min:1.05})+numeric('background cells / λ','mesh_ppw',r.mesh_ppw,'',{min:6})+
 `<label class="enabled-row"><input type="checkbox" data-path="mesh_auto_refine" ${r.mesh_auto_refine?'checked':''}> Refine structures, sources and monitors</label><p class="property-help">Fine spacing is retained in refinement regions and PML. The wavelength setting caps the background step. The timestep stays fixed by the fine spacing.</p>`+
 r.mesh_refinements.map((b,i)=>`<details class="boundary-options"><summary>${esc(b.name)}</summary><label class="enabled-row"><input type="checkbox" data-path="mesh_refinements.${i}.enabled" ${b.enabled?'checked':''}> Enabled</label>${b.center.map((v,j)=>numeric('xyz'[j],`mesh_refinements.${i}.center.${j}`,v,'µm')).join('')}${b.size.map((v,j)=>numeric('xyz'[j]+' span',`mesh_refinements.${i}.size.${j}`,v,'µm',{min:.001})).join('')}<button data-action="mesh-remove" data-index="${i}">Remove refinement</button></details>`).join('')+
 `<button data-action="mesh-add">+ Add refinement region</button><button data-action="mesh-freeze">Freeze automatic refinements</button>`:'')+
 `<button data-action="mesh-nodes">Edit explicit node arrays</button><button data-action="mesh-preview">Preview simulation mesh</button><p class="property-help">Yee sampling places materials at each electric field component. ${r.interface_method==='subpixel'?'Subpixel also couples neighboring components across interfaces. The permittivity image shows only the reciprocal diagonal of that operator.':'Staircase interfaces follow the grid.'} Test mesh convergence for the required accuracy.</p>`;
}

export function setupMesh({state,api,esc,commit}){
 const dialog=document.createElement('dialog');dialog.className='mesh-dialog';document.body.append(dialog);
 let data,plane='xy';
 const $=s=>dialog.querySelector(s);
 function draw(){
  const canvas=$('canvas'),ctx=canvas.getContext('2d');canvas.width=1000;canvas.height=600;
  const [a,b]=[...plane].map(v=>'xyz'.indexOf(v)),nodes=data.nodes_um;
  const x=nodes[a],y=nodes[b],sx=x.at(-1)-x[0],sy=y.at(-1)-y[0],scale=Math.min(880/sx,480/sy);
  const left=(1000-sx*scale)/2,top=(600-sy*scale)/2;
  const px=v=>left+(v-x[0])*scale,py=v=>top+(y.at(-1)-v)*scale;
  ctx.fillStyle='#101c2b';ctx.fillRect(0,0,1000,600);
  for(const box of data.refinements){ctx.fillStyle='rgba(71,191,169,.13)';ctx.fillRect(px(box.center[a]-box.size[a]/2),py(box.center[b]+box.size[b]/2),box.size[a]*scale,box.size[b]*scale);}
  ctx.save();ctx.beginPath();ctx.rect(left,top,sx*scale,sy*scale);ctx.clip();ctx.strokeStyle='#7087a56e';ctx.lineWidth=.7;
  ctx.beginPath();for(const v of x){ctx.moveTo(px(v),top);ctx.lineTo(px(v),top+sy*scale);}for(const v of y){ctx.moveTo(left,py(v));ctx.lineTo(left+sx*scale,py(v));}ctx.stroke();
  for(const box of data.structures){ctx.strokeStyle='#ecb86a';ctx.lineWidth=2;ctx.strokeRect(px(box.center[a]-box.size[a]/2),py(box.center[b]+box.size[b]/2),box.size[a]*scale,box.size[b]*scale);}ctx.restore();
  ctx.fillStyle='#d9e7f5';ctx.font='15px system-ui';ctx.textAlign='center';ctx.fillText(`${plane[0]} (µm) · ${x[0].toPrecision(4)} … ${x.at(-1).toPrecision(4)}`,500,585);
  ctx.save();ctx.translate(20,300);ctx.rotate(-Math.PI/2);ctx.fillText(`${plane[1]} (µm) · ${y[0].toPrecision(4)} … ${y.at(-1).toPrecision(4)}`,0,0);ctx.restore();
 }
 return {
  async open(){
   data=await api('/mesh/preview',state.project);const s=data.summary;
   dialog.innerHTML=`<div class="fsp-heading"><h2>Simulation mesh</h2><button data-dismiss>Close</button></div><div class="mesh-metrics"><strong>${s.shape.join(' × ')} cells</strong><span>${s.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span><span>~${s.estimated_memory_mb} MB · Δt ${s.dt_fs.toFixed(4)} fs</span></div><label>Projection <select aria-label="Mesh projection">${(state.project.region.dimension==='2d'?['xy']:['xy','xz','yz']).map(p=>`<option>${p}</option>`).join('')}</select></label><canvas aria-label="Simulation mesh grid"></canvas><p>Gold: structure bounds. Green: refinement bounds projected onto this view. Grid lines show actual cell boundaries${data.preview_decimated?' (preview decimated to 1,000 lines per axis)':''}. Refinements extend across coordinate planes.</p><p>Step range: ${s.axis_min_step_um.map((v,i)=>`${'xyz'[i]} ${v.toPrecision(4)}–${s.axis_max_step_um[i].toPrecision(4)} µm`).join(' · ')}. Largest adjacent ratio: ${s.max_adjacent_ratio.toFixed(3)}.</p>`;
   plane='xy';$('[data-dismiss]').onclick=()=>dialog.close();$('select').onchange=e=>{plane=e.target.value;draw();};dialog.showModal();draw();
  },
  async freeze(){const p=await api('/mesh/freeze',state.project);commit(p);},
  async editNodes(){
   const {nodes_um:nodes}=await api('/mesh/coordinates',state.project);
   dialog.innerHTML='<div class="fsp-heading"><h2>Explicit mesh nodes</h2><button data-dismiss>Close</button></div><p>Coordinates in µm. Each axis must increase strictly and be centered on zero. Array endpoints set the domain spans. In 2D, z needs exactly two endpoints. Changing geometry will keep this grid.</p>'+nodes.map((v,i)=>`<label>${'xyz'[i]} nodes (µm)<textarea aria-label="${'xyz'[i]} mesh nodes" data-node-axis="${i}" rows="5" style="width:100%">${v.join(', ')}</textarea></label>`).join('')+'<p data-node-error role="alert"></p><button data-apply-nodes>Apply node arrays</button>';
   $('[data-dismiss]').onclick=()=>dialog.close();
   $('[data-apply-nodes]').onclick=async()=>{try{
    const arrays=[...dialog.querySelectorAll('[data-node-axis]')].map(el=>el.value.trim().split(/[\s,]+/).filter(Boolean).map(Number));
    if(arrays.some(v=>v.length<2||v.some(x=>!Number.isFinite(x))))throw Error('Enter at least two finite numbers for each axis.');
    const p=structuredClone(state.project);Object.assign(p.region,{mesh_type:'explicit',mesh_steps:null,mesh_coordinates:arrays,size:arrays.map(v=>v.at(-1)-v[0]),material_sampling:'yee',mesh_auto_refine:false});
    const checked=await api('/validate',p);commit(checked.project);dialog.close();
   }catch(e){$('[data-node-error]').textContent=e.message;}};
   dialog.showModal();
  },
  add(){const p=structuredClone(state.project);p.region.mesh_refinements.push({name:`Refinement ${p.region.mesh_refinements.length+1}`,center:[0,0,0],size:[1,1,1],enabled:true});commit(p);},
  remove(index){const p=structuredClone(state.project);p.region.mesh_refinements.splice(index,1);commit(p);}
 };
}
