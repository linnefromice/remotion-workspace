import {openBrowser,getCompositions,renderStill} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
try{
 const props={mapOnly:true,counterfactual:true,timeline:true,clock:true};
 const old=path.resolve('out/side-prototype/before/bundle');
 const comps=await getCompositions(old,{puppeteerInstance:browser});
 const c=comps.find(c=>c.id==='ClaimIntake-SideBySide');
 for(const frame of [420,780]){
  const filename=`ClaimIntake-SideBySide-all-flags-${frame}.png`;
  await renderStill({serveUrl:old,composition:{...c,props:{...c.props,...props}},frame,inputProps:props,output:`out/side-prototype/before/${filename}`,imageFormat:'png',puppeteerInstance:browser});
  execFileSync('cmp',[`out/side-prototype/before/${filename}`,`out/side-prototype/final/${filename}`]);
 }
 console.log('Non-preset all-flags branch: 2 PNGs byte-identical');
 const serveUrl=path.resolve('out/side-prototype/final/bundle');
 const all=await getCompositions(serveUrl,{puppeteerInstance:browser});
 for(const frame of [0,179,180,359,360,539,540,719,720,899,900,1079,1080,1259])await renderStill({serveUrl,composition:all.find(c=>c.id==='Side-DemoFull'),frame,output:`out/side-prototype/final/boundary-${frame}.png`,imageFormat:'png',puppeteerInstance:browser});
 console.log('14 C boundary stills rendered');
}finally{await browser.close({silent:true})}
