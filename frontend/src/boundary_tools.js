// Validate all six face edits together before replacing the current project.
export function setupBoundaryTools({state,api,esc,commit}) {
 const dialog=document.createElement('dialog');
 dialog.className='boundary-dialog';
 document.body.append(dialog);
 const kinds=[['pml','PML'],['periodic','Periodic'],['bloch','Bloch'],['pec','PEC'],['antisymmetric','Anti-symmetric (PEC)'],['pmc','PMC'],['symmetric','Symmetric (PMC)']];
 const faces=['x_min','x_max','y_min','y_max','z_min','z_max'];
 function open(){
  if(state.mode!=='layout')throw Error('Switch to Layout before editing boundaries.');
  const original=state.project,draft=structuredClone(original);
  dialog.innerHTML=`<h2>Boundary conditions</h2><p>Apply the complete face configuration in one edit.</p><div class="dialog-buttons"><button data-boundary-preset="pmc">All PMC</button><button data-boundary-preset="pec">All PEC</button><button data-boundary-preset="pml">All PML</button></div>${faces.map(face=>`<label class="property-row"><span>${esc(face.replace('_',' '))}</span><select aria-label="${esc(face.replace('_',' '))} boundary" data-face="${face}" ${face.startsWith('z_')&&draft.region.dimension==='2d'?'disabled':''}>${kinds.map(([value,label])=>`<option value="${value}" ${draft.region.boundaries[face].kind===value?'selected':''}>${label}</option>`).join('')}</select></label>`).join('')}<p class="property-help">PMC and magnetic symmetry support PEC/PMC walls and restricted endpoint CPML. Use real FP32, fixed Yee meshes, point electric sources and point E/H monitors. Mixed CPML additionally requires uniform equal-spacing axes and a fixed isotropic PML exterior. Periodic/Bloch mixing is unsupported. Active PML faces must have equal layers and sigma scale, kappa 1, alpha 0, polynomial 3 and alpha polynomial 0.</p><p class="property-help">Face selections change kinds only. The explicit profile button below also sets active PML parameters. Source, material and mesh settings are preserved. Bloch phases are cleared on axes changed away from Bloch.</p><button data-endpoint-profile>Set supported endpoint CPML profile</button><p class="property-help">Profile button: selected PML faces use default region layers, sigma scale 1, kappa 1, alpha 0, cubic grading. Endpoint target sampling differs from ordinary scalar-Yee PML. Keep sources/monitors outside PML and material in PML plus one cell equal to background.</p><p data-boundary-status role="status" aria-live="polite"></p><div class="dialog-actions"><button data-boundary-apply>Apply boundaries</button><button data-boundary-close>Cancel</button></div>`;
  const selects=[...dialog.querySelectorAll('[data-face]')];
  dialog.querySelectorAll('[data-boundary-preset]').forEach(button=>button.onclick=()=>selects.filter(s=>!s.disabled).forEach(s=>s.value=button.dataset.boundaryPreset));
  dialog.querySelector('[data-endpoint-profile]').onclick=()=>{
   const active=selects.filter(s=>!s.disabled&&s.value==='pml');
   active.forEach(s=>Object.assign(draft.region.boundaries[s.dataset.face],{layers:null,sigma_scale:1,kappa:1,alpha:0,polynomial:3,alpha_polynomial:0}));
   dialog.querySelector('[data-boundary-status]').textContent=active.length?'Supported endpoint CPML profile staged for '+active.length+' selected PML faces. Apply to validate.':'Select at least one PML face first.';
  };
  dialog.querySelector('[data-boundary-close]').onclick=()=>dialog.close();
  dialog.querySelector('[data-boundary-apply]').onclick=async()=>{
   const controls=[...dialog.querySelectorAll('button,select')],disabled=controls.map(c=>c.disabled);
   controls.forEach(c=>c.disabled=true);
   const status=dialog.querySelector('[data-boundary-status]');status.textContent='Validating boundaries and project…';
   try{
    selects.forEach(select=>draft.region.boundaries[select.dataset.face].kind=select.value);
    for(const [axis,index] of ['x','y','z'].map((axis,index)=>[axis,index])){
     if(draft.region.boundaries[axis+'_min'].kind!=='bloch'&&draft.region.boundaries[axis+'_max'].kind!=='bloch')draft.region.bloch_phase[index]=0;
    }
    const validated=await api('/validate',draft);
    if(state.project!==original||state.mode!=='layout')throw Error('The project changed. Close this dialog and open it again.');
    commit(validated.project);dialog.close();
   }catch(error){status.textContent=error.message;}
   finally{controls.forEach((control,index)=>control.disabled=disabled[index]);}
  };
  dialog.showModal();
 }
 return {open};
}
