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

test('the region panel and the visualizer report stored frames per optical period and warn when they alias',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('#tree')).toContainText('waveguide');
 const rate=page.locator('#snapshot-rate');
 await expect(rate).toHaveText('4.4');
 await expect(page.locator('#snapshot-status')).toContainText('at most 100 frames are stored');
 await expect(page.locator('#snapshot-warning')).toHaveCount(0);
 await expect(page.locator('#mesh-summary')).not.toContainText('alias the carrier');
 await page.getByLabel('snapshot every',{exact:true}).fill('40');await page.getByLabel('snapshot every',{exact:true}).press('Tab');
 await expect(rate).toHaveText('1.1');
 await expect(page.locator('#snapshot-warning')).toContainText('the playback will look like backward motion');
 await expect(page.locator('#mesh-summary')).toContainText('alias the carrier');
 const gpu=page.getByLabel('GPU',{exact:true});
 if(await gpu.isEnabled())await gpu.uncheck();
 await page.getByLabel('time steps',{exact:true}).fill('200');await page.getByLabel('time steps',{exact:true}).press('Tab');
 const submitted=page.waitForResponse(r=>r.url().endsWith('/api/jobs')&&r.request().method()==='POST');
 await page.locator('#run-button').click();await submitted;
 await expect(page.locator('#mode-badge')).toHaveText('ANALYSIS',{timeout:90000});
 await expect(page.locator('#frame-label')).toContainText('aliased: 1.1 frames per optical period');
 await page.locator('#layout-button').click();
 await page.getByLabel('snapshot every',{exact:true}).fill('5');await page.getByLabel('snapshot every',{exact:true}).press('Tab');
 await expect(page.locator('#snapshot-warning')).toHaveCount(0);
 expect(errors).toEqual([]);
});
