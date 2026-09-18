import {openBrowser} from '@remotion/renderer';
import {writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
try{
 const page=await browser.newPage({context:undefined,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.goto({url:pathToFileURL(process.cwd()+'/out/side-subjects/index.html').href,timeout:30000,options:{waitUntil:'load'}});
 const counts=await page.evaluate(async()=>{for(const im of document.images){im.loading='eager';await im.decode()}return {cards:document.querySelectorAll('article').length,images:document.images.length}});
 assert.deepEqual(counts,{cards:9,images:69});
 for(const width of [390,1440]){
  await page.setViewport({width,height:1000,deviceScaleFactor:1});
  for(const expanded of [false,true]){
   await page.evaluate(value=>document.querySelectorAll('details').forEach(d=>d.open=value),expanded);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await page.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=false));
  const {value}=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile(`out/side-subjects/page-${width}.png`,Buffer.from(value.data,'base64'));
 }
 console.log('PASS: 9 cards, 69 images, expandable scenes, mobile and desktop widths');
}finally{await browser.close({silent:true})}
