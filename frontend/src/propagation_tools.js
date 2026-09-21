/** Angular-spectrum post-processing of a stored DFT plane. Server computation on the run's device; no FDTD. */
export async function openPropagation({state,api,esc,toast}){
 const jobId=state.job;if(!jobId)throw Error('Complete a run with a frequency plane first.');
 const meta=await api(`/jobs/${jobId}/propagation-monitors`);
 const monitors=meta.monitors||[];if(!monitors.length)throw Error('This run stored no frequency plane to propagate.');
 const dialog=document.createElement('dialog');dialog.className='propagation-dialog';document.body.append(dialog);
 const $=s=>dialog.querySelector(s);let generation=0;
 const number=(label,key,value,step='any')=>`<label>${esc(label)}<input aria-label="${esc(label)}" data-key="${key}" type="number" step="${step}" value="${value}"></label>`;
 dialog.innerHTML=`<header><div><h2>Angular spectrum</h2><p>Stored run: ${esc(meta.name||jobId)} · ${esc(meta.device.toUpperCase())}${meta.mode?` · ${esc(meta.mode)}`:''}</p></div><button data-close>Close</button></header>
 <p>Propagates a stored DFT plane through a homogeneous, lossless, source-free exterior with outgoing waves only, on the run's device. The recorded window is zero padded and the field beyond it is taken as zero. This is post-processing of stored fields, not FDTD. See docs/ANGULAR_SPECTRUM.md.</p>
 <div class="propagation-grid">
  <fieldset><legend>Plane and exterior</legend><label>Monitor<select aria-label="Propagation monitor" data-key="monitor">${monitors.map(m=>`<option value="${esc(m.id)}">${esc(m.name)} · +${m.normal} at ${Number(m.position_um).toPrecision(4)} µm</option>`).join('')}</select></label><label>Frequency<select aria-label="Propagation frequency" data-key="frequency_index"></select></label><label>Direction<select aria-label="Propagation direction" data-key="direction"><option value="auto">Auto (from the sources)</option><option value="+">Toward +normal</option><option value="-">Toward −normal</option></select></label>${number('Exterior index','index',meta.background_index??1)}${number('Zero padding factor','pad',2,'1')}</fieldset>
  <fieldset><legend>Section</legend><label>Kind<select aria-label="Propagation kind" data-key="kind"></select></label>${number('Section offset (µm)','offset_um',0)}${number('Distance start (µm)','z_start_um',0)}${number('Distance stop (µm)','z_stop_um',10)}${number('Planes','planes',200,'1')}${number('Plane distance (µm)','distance_um',10)}</fieldset>
 </div>
 <div class="propagation-actions"><button data-calculate>Calculate</button><span data-plane-note></span></div><p role="status">Choose the plane, the exterior and the section, then calculate.</p><canvas data-map width="900" height="400"></canvas><div data-report></div>`;
 const monitor=()=>monitors.find(m=>m.id===$('[data-key="monitor"]').value);
 function refresh(){
  const m=monitor();
  $('[data-key="frequency_index"]').innerHTML=m.frequency_thz.map((f,i)=>`<option value="${i}">${Number(f).toPrecision(6)} THz · ${Number(m.wavelength_um[i]).toPrecision(4)} µm</option>`).join('');
  $('[data-key="kind"]').innerHTML=m.transverse.map(a=>`<option value="section:${a}">Section ${a}${m.normal}</option>`).join('')+`<option value="plane">Plane parallel to the monitor</option>`;
  const spacing=Object.values(m.spacing_um||{});
  $('[data-plane-note]').textContent=`${m.direction>0?'+':'−'}${m.normal} ${m.direction_note}; spacing ${spacing.map(v=>Number(v).toPrecision(3)).join(' × ')} µm; ${m.components.join(', ')}`;
 }
 refresh();
 $('[data-key="monitor"]').onchange=refresh;
 $('[data-close]').onclick=()=>{generation++;dialog.close();dialog.remove();};
 dialog.addEventListener('close',()=>dialog.remove());
 function collect(){
  const value=key=>{const raw=$(`[data-key="${key}"]`).value;if(raw.trim()===''||!Number.isFinite(Number(raw)))throw Error('Enter finite numerical settings.');return Number(raw);};
  const kind=$('[data-key="kind"]').value;
  const body={monitor:$('[data-key="monitor"]').value,frequency_index:Number($('[data-key="frequency_index"]').value),direction:$('[data-key="direction"]').value,index:value('index'),pad:value('pad')};
  if(kind==='plane')Object.assign(body,{kind:'plane',distance_um:value('distance_um')});
  else Object.assign(body,{kind:'section',axis:kind.split(':')[1],offset_um:value('offset_um'),z_start_um:value('z_start_um'),z_stop_um:value('z_stop_um'),planes:value('planes')});
  return body;
 }
 $('[data-calculate]').onclick=async()=>{
  const token=++generation;$('[data-calculate]').disabled=true;$('[role="status"]').textContent='Calculating on the server…';
  try{
   const body=collect(),result=await api(`/jobs/${jobId}/propagate`,body);if(token!==generation)return;
   draw($('[data-map]'),result);
   const f=result.focus,s=result.spectrum,g=result.geometry,fmt=v=>v==null?'n/a':Number(v).toPrecision(4);
   const peak=result.kind==='section'?`Peak intensity ${fmt(f.peak_intensity)} at ${fmt(f.z_um)} µm from the plane (${g.axes[0]} = ${fmt(f.normal_um)} µm), ${g.axes[1]} = ${fmt(f.a_um)} µm; FWHM along ${g.axes[1]} ${fmt(f.fwhm_um)} µm.`:`Peak intensity ${fmt(f.peak_intensity)} on the plane ${fmt(f.z_um)} µm away (${result.geometry.axes[0]} = ${fmt(f.a_um)} µm, ${result.geometry.axes[1]} = ${fmt(f.b_um)} µm); FWHM along ${g.axes[0]} ${fmt(f.fwhm_um)} µm.`;
   $('[data-report]').innerHTML=`<p class="focus-report"><b>Focus.</b> ${esc(peak)}</p><p class="spectrum-report"><b>Spectrum.</b> Largest representable angle ${fmt(s.max_angle_deg)}°, evanescent fraction ${fmt(s.evanescent_fraction)}, spacing ${fmt(s.spacing_um)} µm, wavelength in the exterior ${fmt(s.wavelength_um)} µm, index ${fmt(s.index)}, pad ${s.pad} (padded ${s.padded_shape.join(' × ')}). Direction ${result.direction>0?'+':'−'}normal (${esc(result.direction_note)}), ${esc(result.device.toUpperCase())}, ${esc(result.components.join(', '))}.</p>${s.aliasing?`<p class="aliasing-warning">${esc(s.warning)}</p>`:''}`;
   $('[role="status"]').textContent=`${result.method} · ${(result.bytes/2**20).toFixed(1)} MiB of ${(result.budget_bytes/2**20).toFixed(0)} MiB budget`;
  }catch(error){if(token===generation){$('[role="status"]').textContent=error.message;toast(error.message);}}
  finally{if(token===generation)$('[data-calculate]').disabled=false;}
 };
 dialog.showModal();
}

function draw(canvas,result){
 const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height,g=result.geometry,image=result.image;
 ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,W,H);ctx.font='12px ui-monospace,monospace';ctx.fillStyle='#607086';
 const rows=image.length,cols=image[0]?.length||0;
 let vmax=0;for(const row of image)for(const v of row)vmax=Math.max(vmax,v);vmax=vmax||1;
 const left=70,top=24,right=W-24,bottom=H-40,w=right-left,h=bottom-top;
 const horizontal=result.kind==='section'?g.extent_um.a:g.extent_um.v,vertical=result.kind==='section'?g.extent_um.z:g.extent_um.u;
 const hLabel=result.kind==='section'?`${g.axes[1]} (µm)`:`${g.axes[1]} (µm)`,vLabel=result.kind==='section'?`distance from the plane (µm)`:`${g.axes[0]} (µm)`;
 if(cols===1||rows===1){
  // A 2D device gives a profile: intensity against the remaining coordinate.
  const values=cols===1?image.map(r=>r[0]):image[0],coordinates=cols===1?(result.kind==='section'?g.z_um:g.u_um):(result.kind==='section'?g.a_um:g.v_um);
  ctx.strokeStyle='#c4cfdb';ctx.strokeRect(left,top,w,h);ctx.strokeStyle='#1972cc';ctx.lineWidth=1.5;ctx.beginPath();
  values.forEach((v,i)=>{const x=left+w*(coordinates[i]-coordinates[0])/((coordinates[coordinates.length-1]-coordinates[0])||1),y=bottom-h*v/vmax;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.stroke();ctx.lineWidth=1;ctx.fillStyle='#607086';ctx.textAlign='center';
  ctx.textAlign='left';ctx.fillText(`${Number(coordinates[0]).toPrecision(4)}`,left,bottom+16);ctx.textAlign='right';ctx.fillText(`${Number(coordinates[coordinates.length-1]).toPrecision(4)} ${cols===1?(result.kind==='section'?'µm from the plane':g.axes[0]+' (µm)'):hLabel}`,right,bottom+16);
  ctx.textAlign='right';ctx.fillText(vmax.toExponential(2),left-6,top+10);ctx.fillText('0',left-6,bottom);ctx.textAlign='left';ctx.fillText(`|E|² (reduced) · ${result.kind}`,left,top-8);return;
 }
 const off=document.createElement('canvas');off.width=cols;off.height=rows;const oc=off.getContext('2d'),im=oc.createImageData(cols,rows);
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const t=Math.min(1,image[r][c]/vmax),i=(r*cols+c)*4;im.data[i]=Math.round(250-t*225);im.data[i+1]=Math.round(248-t*170);im.data[i+2]=Math.round(250-t*80);im.data[i+3]=255;}
 oc.putImageData(im,0,0);ctx.imageSmoothingEnabled=false;
 // rows increase upward on the canvas (distance or first axis), columns to the right.
 ctx.save();ctx.translate(left,bottom);ctx.scale(1,-1);ctx.drawImage(off,0,0,w,h);ctx.restore();
 ctx.strokeStyle='#c4cfdb';ctx.strokeRect(left,top,w,h);ctx.fillStyle='#607086';ctx.textAlign='center';
 ctx.textAlign='left';ctx.fillText(`${Number(horizontal[0]).toPrecision(4)}`,left,bottom+16);ctx.textAlign='right';ctx.fillText(`${Number(horizontal[1]).toPrecision(4)} ${hLabel}`,right,bottom+16);
 ctx.textAlign='right';ctx.fillText(`${Number(vertical[1]).toPrecision(4)}`,left-6,top+10);ctx.fillText(`${Number(vertical[0]).toPrecision(4)}`,left-6,bottom);
 ctx.textAlign='left';ctx.fillText(`${vLabel} ↑ · |E|² up to ${vmax.toExponential(2)} (reduced)`,left,top-8);
}
