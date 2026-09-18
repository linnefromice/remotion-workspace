import {openBrowser} from '@remotion/renderer';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const url=process.env.WEB_REVIEW_URL??'http://127.0.0.1:4174/';
await mkdir('out/web-review',{recursive:true});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
const errors=[];
try{
 const page=await browser.newPage({context:undefined,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:log=>{if(log.type==='error')errors.push(log.text)},onLog:()=>{}});
 await page.goto({url,timeout:30000,options:{waitUntil:'load'}});
 await page.evaluate(async()=>{for(let i=0;i<50&&!document.querySelector('.reference');i++)await new Promise(r=>setTimeout(r,100));});
 await page.setViewport({width:1440,height:1100,deviceScaleFactor:1});
 assert.equal(await page.evaluate(()=>document.querySelectorAll('.collection').length),3);
 assert.equal(await page.evaluate(()=>/farleap|仕組みが見える。|価値が伝わる。/i.test(document.body.textContent)),false);
 assert.ok(await page.evaluate(()=>document.querySelector('.outcome').textContent.includes('最終成果物のイメージ')));
 assert.ok(await page.evaluate(()=>document.querySelector('.reference').textContent.includes('Reference-Cloudflare-Refactored')));
 assert.ok(await page.evaluate(()=>document.querySelectorAll('.reference svg').length>0));
 const homeShot=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile('out/web-review/home.png',Buffer.from(homeShot.value.data,'base64'));
 const navigate=async(hash)=>{
  await page.evaluate(async hash=>{location.hash=hash;await new Promise(r=>setTimeout(r,200));},hash);
  await page.evaluate(async()=>{for(const image of document.querySelectorAll('.player-shell img'))await image.decode();});
  const state=await page.evaluate(()=>({title:document.querySelector('.viewer-heading h2').textContent,description:document.querySelector('.description').textContent,svg:document.querySelectorAll('.player-shell svg').length,error:document.querySelector('.player-error')?.textContent}));
  assert.ok(state.svg>0,hash);assert.equal(await page.evaluate(()=>/farleap/i.test(document.body.textContent)),false,hash);assert.ok(state.description.includes('CONCEPT'));assert.ok(state.description.includes('特徴'));assert.equal(state.error,undefined,hash);
 };
 for(const id of ['LogoSeal','IconsV2','Lanes','Orbit','Transit'])await navigate('diagram/'+id);
 for(const id of ['DemoDiagram','SlotMinimal','Stacked'])for(const subject of ['ClaimIntake','Proposal','Inquiry','Restoration'])await navigate(`side/${id}/${subject}`);
 // Check every app screen at its stage midpoint, including clipped footer actions.
 for(const subject of ['Proposal','Inquiry','Restoration']){
  await navigate(`side/DemoDiagram/${subject}`);
  const count=subject==='Inquiry'?6:7;
  for(let step=0;step<count;step++){
   const result=await page.evaluate(async({step})=>{
    document.querySelectorAll('.steps button')[step].click();
    await new Promise(r=>setTimeout(r,80));
    const app=document.querySelector('[data-demo-app]');
    const surface=app.firstElementChild, bounds=surface.getBoundingClientRect();
    const clipped=[...surface.querySelectorAll('*')].filter(el=>el.children.length===0&&el.textContent.trim()).filter(el=>{const rect=el.getBoundingClientRect();return rect.bottom>bounds.bottom+1||rect.right>bounds.right+1;}).map(el=>el.textContent);
    return {audience:surface.dataset.appAudience,clipped};
   },{step});
   const external=(subject==='Proposal'&&(step===0||step===6))||(subject==='Inquiry'&&(step===0||step===4));
   assert.equal(result.audience,external?'customer':'staff',`${subject} ${step}: audience`);
   assert.deepEqual(result.clipped,[],`${subject} ${step}: clipped app content`);
  }
 }
 for(const id of ['ClaimIntake','Proposal','Inquiry','Restoration'])await navigate('business/'+id);
 await navigate('side/Stacked/Inquiry');
 assert.equal(await page.evaluate(()=>document.querySelectorAll('.steps button').length),6);
 await page.evaluate(()=>document.querySelectorAll('.steps button')[3].click());
 assert.match(await page.evaluate(()=>document.querySelector('.player-shell').textContent),/業者/);
 const playerButtons=await page.evaluate(()=>[...document.querySelectorAll('.player-shell button')].map(b=>({label:b.getAttribute('aria-label'),title:b.title})));
 assert.ok(playerButtons.some(b=>b.label==='Enter Fullscreen'));
 await page._client().send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await page._client().send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 assert.ok(await page.evaluate(()=>['A','BUTTON','INPUT','SELECT'].includes(document.activeElement.tagName)),'keyboard focus');
 // Player play/pause buttons expose accessible labels.
 const played=await page.evaluate(async()=>{const button=[...document.querySelectorAll('.player-shell button')].find(b=>/play|再生/i.test(b.getAttribute('aria-label')??b.title));if(!button)return false;button.click();await new Promise(r=>setTimeout(r,400));return !![...document.querySelectorAll('.player-shell button')].find(b=>/pause|一時停止/i.test(b.getAttribute('aria-label')??b.title));});
 assert.ok(played,'playback starts');
 for(const rate of [3,4]){
  await page.evaluate(rate=>{const select=document.querySelector('.external-controls select');select.value=String(rate);select.dispatchEvent(new Event('change',{bubbles:true}));},rate);
  assert.equal(await page.evaluate(()=>document.querySelector('.external-controls select').value),String(rate));
 }
 const external=async(label)=>page.evaluate(async label=>{[...document.querySelectorAll('.external-controls button')].find(b=>b.textContent===label).click();await new Promise(r=>setTimeout(r,100));return [...document.querySelectorAll('.player-shell button')].map(b=>b.getAttribute('aria-label'));},label);
 assert.ok((await external('一時停止')).includes('Play video'));
 assert.ok((await external('開始／再開')).includes('Pause video'));
 assert.ok((await external('最初から再生')).includes('Pause video'));
 await external('一時停止');

 await page.evaluate(()=>{const button=[...document.querySelectorAll('.player-shell button')].find(b=>/pause|一時停止/i.test(b.getAttribute('aria-label')??b.title));button?.click();});
 assert.equal(await page.evaluate(()=>document.querySelector('.shortlist, .save')),null);
 await navigate('diagram/LogoSeal');
 for(const width of [320,768,1024,1440]){
  await page.setViewport({width,height:1100,deviceScaleFactor:1});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'overflow '+width);
  assert.ok(await page.evaluate(()=>document.querySelector('.player-shell').getBoundingClientRect().width>=innerWidth-70),'large player');
  if(width===320)assert.ok(await page.evaluate(()=>{const list=document.querySelector('.pattern-list');list.scrollLeft=1000;return list.scrollWidth>list.clientWidth&&list.scrollLeft>0;}),'horizontal pattern scrolling');
  const {value}=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile(`out/web-review/page-${width}.png`,Buffer.from(value.data,'base64'));
 }
 await navigate('side/DemoDiagram/Proposal');
 const shot=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile('out/web-review/side.png',Buffer.from(shot.value.data,'base64'));
 await page.evaluate(async()=>{location.hash='home';await new Promise(r=>setTimeout(r,200));document.querySelector('.reference').scrollIntoView();});
 assert.equal(await page.evaluate(()=>document.querySelectorAll('.external-controls button').length),3);
 assert.equal(await page.evaluate(()=>document.querySelector('.external-controls option[value="4"]').textContent),'4×');
 const refShot=await page._client().send('Page.captureScreenshot',{format:'png'});await writeFile('out/web-review/reference.png',Buffer.from(refShot.value.data,'base64'));
 for(const width of [320,768,1024,1440]){await page.setViewport({width,height:1100,deviceScaleFactor:1});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'home overflow '+width);}
 await navigate('bad/unknown');assert.match(await page.evaluate(()=>document.querySelector('.viewer-heading h2').textContent),/LogoSeal/);
 assert.deepEqual(errors,[]);
 console.log('PASS: 21 views, descriptions, step seek, playback, home/reference, no shortlist, horizontal submenu, invalid URL, 4 widths, no console errors');
}finally{await browser.close({silent:true})}
