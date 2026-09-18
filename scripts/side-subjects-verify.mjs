import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {openReviewPage} from './browser.mjs';
const {page,shot,close}=await openReviewPage({url:pathToFileURL(process.cwd()+'/out/side-subjects/index.html').href});
try{
 const counts=await page.evaluate(async()=>{for(const im of document.images){im.loading='eager';await im.decode()}return {cards:document.querySelectorAll('article').length,images:document.images.length}});
 assert.deepEqual(counts,{cards:9,images:69});
 for(const width of [390,1440]){
  await page.setViewport({width,height:1000,deviceScaleFactor:1});
  for(const expanded of [false,true]){
   await page.evaluate(value=>document.querySelectorAll('details').forEach(d=>d.open=value),expanded);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
  await shot(`out/side-subjects/page-${width}.png`);
 }
 console.log('PASS: 9 cards, 69 images, expandable scenes, mobile and desktop widths');
}finally{await close()}
