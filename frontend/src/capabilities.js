export function setupCapabilities({api,esc}){
 const dialog=document.createElement('dialog');dialog.className='capability-dialog';document.body.append(dialog);let data;
 const $=s=>dialog.querySelector(s);
 // Combination support comes from the registry in torchfdtd/capabilities.py (the `combinations` block of /api/capabilities).
 function combinations(){
  const c=data.combinations;if(!c)return '';
  const axes=Object.keys(c.axes);const options=(selected)=>axes.map(a=>`<option value="${a}" ${a===selected?'selected':''}>${esc(c.axis_labels[a])}</option>`).join('');
  return `<details class="capability-combinations" open><summary>Combination support: ${c.summary.admitted.toLocaleString()} of ${c.summary.total.toLocaleString()} axis combinations run (${c.summary.rules} rejection rules, ${c.summary.lanes} entry points)</summary><p>Every combination of dimension, mesh, material, boundaries, source, monitor, execution, precision and backend is one small scene executed through its entry point. A cell runs (✓) when at least one full combination with its two values runs; otherwise it names the rule that explains the pair, and its tooltip gives the code path and the exact message. Generated from torchfdtd/capabilities.py; the full tables are docs/CAPABILITIES.md.</p><div class="capability-filters"><label>Rows <select data-axis-a aria-label="Combination rows">${options(axes[6])}</select></label><label>Columns <select data-axis-b aria-label="Combination columns">${options(axes[3])}</select></label></div><div class="capability-table"><div class="combination-grid" data-combination-table></div></div></details>`;
 }
 function combinationTable(){
  const c=data.combinations;if(!c)return;
  const axes=Object.keys(c.axes);let a=$('[data-axis-a]').value,b=$('[data-axis-b]').value;const grid=$('[data-combination-table]');
  if(a===b){grid.style.gridTemplateColumns='auto';grid.innerHTML='<div>Choose two different axes.</div>';return;}
  if(axes.indexOf(a)>axes.indexOf(b))[a,b]=[b,a];
  const cells=c.pairs[a+'|'+b],rules=Object.fromEntries(c.rules.map(r=>[r.name,r])),lanes=Object.fromEntries(c.lanes.map(l=>[l.name,l]));
  grid.style.gridTemplateColumns=`repeat(${c.axes[b].length+1},max-content)`;
  let html=`<div class="combination-head">${esc(c.axis_labels[a])} / ${esc(c.axis_labels[b])}</div>${c.axes[b].map(v=>`<div class="combination-head">${esc(c.value_labels[b][v])}</div>`).join('')}`;
  for(const va of c.axes[a]){
   html+=`<div class="combination-head">${esc(c.value_labels[a][va])}</div>`;
   for(const vb of c.axes[b]){
    const cell=cells[va+'|'+vb];
    if(cell.status==='admitted'){const names=Object.keys(cell.lanes);html+=`<div class="combination-cell cap-status implemented" title="${esc(names.map(n=>n+': '+(lanes[n]?.code_path||'')).join('\n'))}">✓ ${cell.admitted}/${cell.total}</div>`;}
    else{const name=cell.reason||Object.keys(cell.rules)[0],rule=rules[name]||{};html+=`<div class="combination-cell cap-status missing" title="${esc((rule.code_path||'')+'\n'+(rule.message||''))}">✗ ${esc(name)}</div>`;}
   }
  }
  grid.innerHTML=html;
 }
 return {async open(){
  data=await api('/capabilities');dialog.innerHTML=`<div class="fsp-heading"><h2>Supported combinations</h2><button data-close-panel>Close</button></div>${combinations()}<p><a href="/api/capabilities" target="_blank">JSON</a></p>`;
  $('[data-close-panel]').onclick=()=>dialog.close();
  for(const field of ['data-axis-a','data-axis-b'])if($('['+field+']'))$('['+field+']').onchange=combinationTable;
  combinationTable();dialog.showModal();
 }};
}
