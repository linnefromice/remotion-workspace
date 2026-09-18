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
const newId='Side-Evidence';
const ledgerId='Side-Ledger';
const additions=['Gate','Replay'].map(n=>`Side-${n}`);
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
   for(const id of additions)await still(id,frame);
   await still(newId,frame);
   await still(ledgerId,frame);
   if(frame!==420)await still('ClaimIntake-DecisionStory-Side',frame);
  }
  for(const frame of [0,359,360,599,600,839])await still(ledgerId,frame);
  const template=await readFile(new URL('./side-design-studies/page.html',import.meta.url),'utf8');
  const steps=['受付','入力確認','AI判定','ルール昇格','業務判断','人の確認','出口'];
  const strip=(id)=>(id.endsWith("-Replay")?["結論","人の確認","業務判断","ルール昇格","AI原判定","入力の根拠","まとめ"]:steps).map((s,i)=>`<a href="${id}-${60+i*120}.png"><img loading="lazy" src="${id}-${60+i*120}.png" width="1920" height="1080" alt="${s}の静止画">${i+1} / ${s}</a>`).join('');
  const variants=names.map(n=>`<figure><a href="ClaimIntake-${n}-420.png"><img loading="lazy" src="ClaimIntake-${n}-420.png" width="1920" height="1080" alt="${n}"></a><figcaption>${n}</figcaption></figure>`).join('');
  await writeFile(path.join(out,'index.html'),template.replace('__GATE_STEPS__',strip(additions[0])).replace('__REPLAY_STEPS__',strip(additions[1])).replace('__LEDGER_STEPS__',strip(ledgerId)).replace('__NEW_STEPS__',strip(newId)).replace('__OLD_STEPS__',strip('ClaimIntake-DecisionStory-Side')).replace('__VARIANTS__',variants));
 }
 if(!onlyStills){
  for(const id of process.argv.includes('--additions-only')?additions:process.argv.includes('--ledger-only')?[ledgerId]:[newId,ledgerId,...additions]){
  let lastProgress=-1;
  await renderMedia({serveUrl,composition:all.find(c=>c.id===id),codec:'h264',pixelFormat:'yuv420p',imageFormat:'png',outputLocation:path.join(out,`${id}.mp4`),puppeteerInstance:browser,concurrency:4,onProgress:({progress})=>{const percent=Math.floor(progress*100);if(percent%20===0&&percent!==lastProgress){console.log(id,`${percent}%`);lastProgress=percent;}}});
  console.log('Rendered',id);
  }
 }
} finally {await browser.close({silent:true});}
