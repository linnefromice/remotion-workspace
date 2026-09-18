import {bundle} from '@remotion/bundler';
import {getCompositions,openBrowser,renderStill} from '@remotion/renderer';
import {mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const phase=process.argv[2]??'before';
const out=path.resolve('out/side-prototype',phase);await mkdir(out,{recursive:true});
async function sources(dir='src'){let result={};for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())Object.assign(result,await sources(p));else result[p]=createHash('md5').update(await readFile(p)).digest('hex')}return result}
const before=await sources();await writeFile(`${out}/sources-before.json`,JSON.stringify(before,null,2));
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:`${out}/bundle`,publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
try{
 const comps=await getCompositions(serveUrl,{puppeteerInstance:browser});
 const ids=['','-Map','-Counterfactual','-Full','-Timeline'].map(s=>'ClaimIntake-SideBySide'+s);
 if(phase!=='before')ids.push('ClaimIntake-SideBySide-Clock');
 if(phase==='final')ids.push('Side-DemoFull','Side-SlotExample');
 const capture=async(id,frame,suffix='',inputProps)=>{const composition=comps.find(c=>c.id===id);if(!composition)throw Error(id);await renderStill({serveUrl,composition:{...composition,props:{...composition.props,...inputProps}},frame,inputProps,output:`${out}/${id}${suffix}-${frame}.png`,imageFormat:'png',puppeteerInstance:browser});};
 for(const id of ids){for(const frame of id==='Side-DemoFull'?[90,270,450,630,810,990,1170]:[60,180,300,420,540,660,780])await capture(id,frame);console.log(phase,id)}
 if(phase==='before')for(const mapOnly of [false,true])await capture(ids[0],420,`-clock-map-${mapOnly}`,{mapOnly,counterfactual:false,timeline:false,clock:true});
 if(phase==='final')for(const frame of [420,780])await capture(ids[0],frame,'-all-flags',{mapOnly:true,counterfactual:true,timeline:true,clock:true});
}finally{await browser.close({silent:true});}
const after=await sources();await writeFile(`${out}/sources-after.json`,JSON.stringify(after,null,2));
if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Source changed during capture');
console.log('MD5 source manifest unchanged');
