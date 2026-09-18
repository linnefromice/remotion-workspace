import {bundle} from '@remotion/bundler';
import {getCompositions, openBrowser, renderStill, renderMedia} from '@remotion/renderer';
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=path.join(root,'out/side-design-studies');
const onlyStills=process.argv.includes('--stills-only');
const onlyVideo=process.argv.includes('--video-only');
const names=['DecisionStory','DecisionStory-Side','DecisionStory-Stacked','SideBySide','SideBySide-Map','SideBySide-Counterfactual','SideBySide-Full','SideBySide-Timeline'];
const newId='ClaimIntake-DecisionStory-Side-Evidence';
const ledgerId='ClaimIntake-DecisionStory-Side-Ledger';
await mkdir(out,{recursive:true});
const serveUrl=onlyVideo?path.join(out,'bundle'):await bundle({entryPoint:path.join(root,'src/index.ts'),outDir:path.join(out,'bundle'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
try {
 const all=await getCompositions(serveUrl,{puppeteerInstance:browser});
 const still=async(id,frame)=>{
  await renderStill({serveUrl,composition:all.find(c=>c.id===id),frame,output:path.join(out,`${id}-${frame}.png`),imageFormat:'png',puppeteerInstance:browser});
  console.log(id,frame);
 };
 if(!onlyVideo){
  for(const name of names)await still(`ClaimIntake-${name}`,420);
  for(const frame of [60,180,300,420,540,660,780]){
   await still(newId,frame);
   await still(ledgerId,frame);
   if(frame!==420)await still('ClaimIntake-DecisionStory-Side',frame);
  }
  for(const frame of [0,359,360,599,600,839])await still(ledgerId,frame);
  const template=await readFile(new URL('./side-design-studies/page.html',import.meta.url),'utf8');
  const steps=['受付','入力確認','AI判定','ルール昇格','業務判断','人の確認','出口'];
  const strip=(id)=>steps.map((s,i)=>`<a href="${id}-${60+i*120}.png"><img loading="lazy" src="${id}-${60+i*120}.png" width="1920" height="1080" alt="${s}の静止画">${i+1} / ${s}</a>`).join('');
  const variants=names.map(n=>`<figure><a href="ClaimIntake-${n}-420.png"><img loading="lazy" src="ClaimIntake-${n}-420.png" width="1920" height="1080" alt="${n}"></a><figcaption>${n}</figcaption></figure>`).join('');
  await writeFile(path.join(out,'index.html'),template.replace('__LEDGER_STEPS__',strip(ledgerId)).replace('__NEW_STEPS__',strip(newId)).replace('__OLD_STEPS__',strip('ClaimIntake-DecisionStory-Side')).replace('__VARIANTS__',variants));
 }
 if(!onlyStills){
  for(const id of process.argv.includes('--ledger-only')?[ledgerId]:[newId,ledgerId]){
  await renderMedia({serveUrl,composition:all.find(c=>c.id===id),codec:'h264',pixelFormat:'yuv420p',imageFormat:'png',outputLocation:path.join(out,`${id}.mp4`),puppeteerInstance:browser,concurrency:4});
  console.log('Rendered',id);
  }
 }
} finally {await browser.close({silent:true});}
