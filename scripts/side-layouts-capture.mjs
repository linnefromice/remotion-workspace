import {bundle} from '@remotion/bundler';
import {openBrowser,getCompositions,renderStill} from '@remotion/renderer';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve('out/side-layouts');await mkdir(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:out+'/bundle',publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
const ids=['Side-DemoDiagram','Side-SlotMinimal','Side-Stacked'];
try {
 const comps=await getCompositions(serveUrl,{puppeteerInstance:browser});
 for(const id of ids){const composition=comps.find(c=>c.id===id);for(let step=0;step<7;step++)await renderStill({serveUrl,composition,frame:(step+.5)*(id==='Side-DemoDiagram'?180:120),output:`${out}/${id}-${step}.png`,imageFormat:'png',puppeteerInstance:browser});console.log(id,'7 scenes');}
}finally{await browser.close({silent:true})}
await writeFile(out+'/index.html',`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Side 配置比較</title><style>body{margin:32px;background:#0b121b;color:#edf3fa;font:16px sans-serif}h1{font-size:28px}section{margin:40px 0}nav{display:flex;gap:20px;flex-wrap:wrap}a{color:#b9dbc9}div{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr));gap:20px}img{width:100%;border:1px solid #344656}figure{margin:0}figcaption{padding:10px}h2{overflow-wrap:anywhere}</style><h1>Side / AgentDiagram を主役にした3案</h1><p>各工程の中間フレーム。画像を開くと原寸で比較できます。</p><nav>${ids.map(id=>`<a href="#${id}">${id}</a>`).join('')}</nav>${ids.map(id=>`<section id="${id}"><h2>${id}</h2><div>${Array.from({length:7},(_,i)=>`<figure><a href="${id}-${i}.png"><img src="${id}-${i}.png" alt="${id} 工程${i+1}"></a><figcaption>工程 ${i+1}</figcaption></figure>`).join('')}</div></section>`).join('')}</html>`);
