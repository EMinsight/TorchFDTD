export function runControls(region,numeric){
 const defaults={auto_shutoff:false,decay_threshold:1e-6,check_interval:50,consecutive_checks:3,min_steps:100,source_tail_amplitude:1e-8,after_source_s:0,divergence_check:true,growth_limit:1e6,field_limit:null};
 region.run_control??={};const c=region.run_control;
 for(const [key,value] of Object.entries(defaults))if(c[key]===undefined)c[key]=value;
 const number=(label,key,unit='',options={})=>numeric(label,'run_control.'+key,c[key],unit,options);
 return `<label class="enabled-row"><input aria-label="Automatic decay shutoff" type="checkbox" data-path="run_control.auto_shutoff" ${c.auto_shutoff?'checked':''}> Automatic decay shutoff</label>`+
 number('decay threshold','decay_threshold','',{min:1e-15})+
 number('check every','check_interval','steps',{min:1,step:1})+
 number('consecutive low checks','consecutive_checks','',{min:2,step:1})+
 number('minimum time steps','min_steps','',{min:10,step:1})+
 number('source tail cutoff','source_tail_amplitude','',{min:1e-15})+
 numeric('wait after source','run_control.after_source_s',c.after_source_s*1e15,'fs',{min:0,scale:1e-15})+
 `<label class="enabled-row"><input aria-label="Divergence checking" type="checkbox" data-path="run_control.divergence_check" ${c.divergence_check?'checked':''}> Divergence checking</label>`+
 number('post-source growth limit','growth_limit','',{min:1.01})+
 `<label class="enabled-row"><input aria-label="Absolute field limit" type="checkbox" data-run-field-limit ${c.field_limit!==null?'checked':''}> Absolute field limit</label>`+
 (c.field_limit!==null?number('maximum field magnitude','field_limit','',{min:1e-30}):'')+
 `<p class="property-help">Decay threshold and growth limit are ratios of the whole-domain state norm. Source tail cutoff is a relative envelope amplitude. Absolute field limits use reduced field units. All finite sources must finish before decay checks. Continuous sources disable automatic termination. Confirm spectra with a longer run.</p>`;
}
