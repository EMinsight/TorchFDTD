import {test,expect} from '@playwright/test';

// The 2D examples launch one-way sheets toward +x, so nothing radiates into the left PML.
test('the waveguide and scatterer examples use one-way sheets toward +x and the views draw their arrows',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const name of ['waveguide','scatterer']){
  const example=await (await page.request.get('/api/examples/'+name)).json();
  expect(example.sources[0]).toMatchObject({id:'source',kind:'plane',injection:'oneway',normal:'x',direction:'+'});
  expect(example.region.boundaries.y_min.kind).toBe('periodic');
  expect(example.monitors.map(m=>m.id)).toEqual(name==='waveguide'?['input','output']:['input','output']);
 }
 await page.goto('/');await expect(page.locator('#tree')).toContainText('waveguide');
 await page.locator('[data-select="source"]').click();
 await expect(page.locator('#property-type')).toHaveText('plane');
 await expect(page.getByLabel('injection',{exact:true})).toHaveValue('oneway');
 await expect(page.getByLabel('direction',{exact:true})).toHaveValue('+');
 await expect(page.getByLabel('propagation axis',{exact:true})).toHaveValue('x');
 await page.screenshot({path:'results/ui-example-sources.png',fullPage:true});
 expect(errors).toEqual([]);
});
