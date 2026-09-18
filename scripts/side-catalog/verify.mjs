import {openBrowser} from '@remotion/renderer';
import {access,writeFile} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
try{
 const page=await browser.newPage({context:undefined,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.goto({url:pathToFileURL(process.cwd()+'/out/side-catalog/index.html').href,timeout:30000,options:{waitUntil:'load'}});
 const data=await page.evaluate(async()=>{for(const im of document.images){im.loading='eager';await im.decode()}return {images:document.images.length,links:[...document.querySelectorAll('a')].map(a=>a.href)}});
 assert.equal(data.images,32);
 for(const href of data.links){const u=new URL(href);if(u.hash)assert.ok(await page.evaluate(id=>!!document.getElementById(id),u.hash.slice(1)));else await access(fileURLToPath(u));}
 for(const [zone,count] of [['right',5],['corner',1],['bottom',2],['all',8]]){
  const actual=await page.evaluate(zone=>{document.querySelector(`[data-zone-filter="${zone}"]`).click();return [...document.querySelectorAll('[data-zone]')].filter(e=>!e.hidden).length},zone);
  assert.equal(actual,count,zone);
 }
 for(const [query,count] of [['Clock',1],['台帳',2],['does-not-exist',0],['',24]]){
  const actual=await page.evaluate(query=>{const input=document.getElementById('search');input.value=query;input.dispatchEvent(new Event('input',{bubbles:true}));return {count:[...document.querySelectorAll('[data-search]')].filter(e=>!e.hidden).length,empty:!document.getElementById('empty').hidden}},query);
  assert.equal(actual.count,count,query);assert.equal(actual.empty,count===0);
 }
 await page.evaluate(()=>{document.getElementById('search').value='Clock';document.getElementById('search').dispatchEvent(new Event('input'));document.getElementById('clear-search').click()});
 assert.equal(await page.evaluate(()=>document.activeElement.id),'search');
 for(const width of [320,768,1024,1440]){
  await page.setViewport({width,height:1080,deviceScaleFactor:1});
  await page.evaluate(()=>window.scrollTo(0,0));
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
  const {value}=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile(`out/side-catalog/page-${width}.png`,Buffer.from(value.data,'base64'));
 }
 await page.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';document.getElementById('elements').scrollIntoView({behavior:'instant'});await new Promise(requestAnimationFrame)});
 const {value}=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile('out/side-catalog/elements.png',Buffer.from(value.data,'base64'));
 await page.evaluate(async()=>{document.getElementById('finished').scrollIntoView({behavior:'instant'});await new Promise(requestAnimationFrame)});
 const shot=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile('out/side-catalog/finished.png',Buffer.from(shot.value.data,'base64'));
 console.log('PASS: 32 images, all links, place filters, search/empty/clear/focus, 4 widths');
}finally{await browser.close({silent:true})}
