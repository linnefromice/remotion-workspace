import {access} from 'node:fs/promises';
import {pathToFileURL,fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {openReviewPage} from '../browser.mjs';
const layoutOnly=process.argv.includes('--layout-only');
const {page,shot,close}=await openReviewPage({url:pathToFileURL(process.cwd()+'/out/side-prototype/index.html').href});
try{
 const data=await page.evaluate(async()=>{for(const img of document.images){img.loading='eager';await img.decode()}return {images:document.images.length,links:[...document.querySelectorAll('a')].map(a=>a.href)}});
 assert.equal(data.images,23);
 for(const href of data.links){const u=new URL(href);if(u.hash)assert.ok(await page.evaluate(id=>!!document.getElementById(id),u.hash.slice(1)));else if(!layoutOnly||!href.endsWith('.mp4'))await access(fileURLToPath(u));}
 for(const width of [320,768,1024,1440]){
  await page.setViewport({width,height:1080,deviceScaleFactor:1});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await shot(`out/side-prototype/page-${width}.png`);
 }
 if(!layoutOnly){
  const result=await page.evaluate(async()=>{
   const video=document.querySelector('video');
   if(video.readyState<1)await new Promise((resolve,reject)=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',reject,{once:true})});
   const seeks=[];
   for(const button of document.querySelectorAll('[data-seek]')){await new Promise(resolve=>{video.addEventListener('seeked',resolve,{once:true});button.click()});seeks.push(video.currentTime)}
   return {duration:video.duration,width:video.videoWidth,height:video.videoHeight,seeks};
  });
  assert.deepEqual(result,{duration:42,width:1920,height:1080,seeks:[3,9,15,21,27,33,39]});
 }
 console.log('23 images, links, four widths, chapter controls: passed'+(layoutOnly?' (video pending)':''));
}finally{await close()}
