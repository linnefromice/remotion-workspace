import {bundle} from '@remotion/bundler';
import {openBrowser,getCompositions,renderStill} from '@remotion/renderer';
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const phase=process.argv[2]??'after',out=path.resolve('out/subject-bands',phase);
await mkdir(out,{recursive:true});
async function hashes(dir='src'){const result={};for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())Object.assign(result,await hashes(p));else result[p]=createHash('md5').update(await readFile(p)).digest('hex')}return result;}
const before=await hashes();await writeFile(out+'/md5-before.json',JSON.stringify(before,null,2));
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:out+'/bundle',publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
try{
 const all=await getCompositions(serveUrl,{puppeteerInstance:browser});
 const ids=['Restoration','Proposal','ClaimIntake'].flatMap(s=>['Cards','LogoSeal','IconsV2','ActionRow'].map(v=>s+'-'+v)).concat('Diagram-Transit');
 for(const id of ids){const c=all.find(c=>c.id===id);await renderStill({serveUrl,composition:c,frame:Math.floor(c.durationInFrames/2),output:`${out}/${id}.png`,imageFormat:'png',puppeteerInstance:browser});if(phase==='after')execFileSync('cmp',[`out/subject-bands/before/${id}.png`,`${out}/${id}.png`]);}
 console.log(`${ids.length} existing stills ${phase==='after'?'cmp PASS':'saved'}`);
 if(phase==='after')for(const subject of ['restoration','proposal','claimIntake']){
  const c=all.find(c=>c.id==='Diagram-Bands');
  for(const frame of subject==='restoration'?[60,180,300,420,540,660,780]:[420])await renderStill({serveUrl,composition:{...c,props:{subject}},inputProps:{subject},frame,output:`${out}/${subject}-${frame}.png`,imageFormat:'png',puppeteerInstance:browser});
 }
}finally{await browser.close({silent:true})}
const after=await hashes();await writeFile(out+'/md5-after.json',JSON.stringify(after,null,2));
if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Source changed while rendering');
console.log('Source MD5 unchanged during render');
