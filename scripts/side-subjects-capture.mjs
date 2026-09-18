import {bundle} from '@remotion/bundler';
import {openBrowser,getCompositions,renderStill} from '@remotion/renderer';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve('out/side-subjects');await mkdir(out,{recursive:true});
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:out+'/bundle',publicDir:path.resolve('public')});
const browser=await openBrowser('chrome',{chromiumOptions:{gl:'swangle'}});
const items=[];
try{
 const comps=await getCompositions(serveUrl,{puppeteerInstance:browser});
 for(const subject of ['Proposal','Inquiry','Restoration'])for(const layout of ['DemoDiagram','SlotMinimal','Stacked']){
  const id=`${subject}-Side-${layout}`,composition=comps.find(c=>c.id===id),stepLen=layout==='DemoDiagram'?180:120,count=composition.durationInFrames/stepLen;
  for(let i=0;i<count;i++)await renderStill({serveUrl,composition,frame:(i+.5)*stepLen,imageFormat:'png',output:`${out}/${id}-${i}.png`,puppeteerInstance:browser});
  items.push({id,subject,layout,count,duration:composition.durationInFrames/30});console.log(id,count+' scenes');
 }
}finally{await browser.close({silent:true})}
await writeFile(out+'/manifest.json',JSON.stringify(items,null,2));
await writeFile(out+'/index.html',`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Side × 3題材</title><style>*{box-sizing:border-box}body{margin:0;padding:32px;background:#0b121b;color:#edf3fa;font:16px sans-serif}h1{font-size:32px}h2{margin-top:48px}h3{font-size:18px;overflow-wrap:anywhere}p{color:#a9bdcc;line-height:1.8}a{color:#b1ddce}nav{display:flex;gap:24px}main{max-width:1800px;margin:auto}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}article{background:#15212e;border:1px solid #344656;border-radius:12px;padding:16px}img{width:100%;height:auto;display:block}summary{cursor:pointer;padding:12px 0;color:#b1ddce}figure{margin:16px 0}figcaption{font-size:14px;padding:8px 0}a:focus-visible,summary:focus-visible{outline:3px solid #71d7ef} @media(max-width:1000px){.grid{grid-template-columns:1fr}body{padding:16px}}</style><main><h1>Side × 3題材</h1><p>9パターンを同じ工程で比較。画像を選ぶと原寸で開きます。<br>DemoDiagram：図＋縦工程＋画面／解説　·　SlotMinimal：図＋現場を中央揃え　·　Stacked：上下7:3、文字のみフェード</p><nav>${['Proposal','Inquiry','Restoration'].map(s=>`<a href="#${s}">${s}</a>`).join('')}</nav>${['Proposal','Inquiry','Restoration'].map(s=>`<section id="${s}"><h2>${s}</h2><div class="grid">${items.filter(i=>i.subject===s).map(item=>`<article><h3>${item.id}</h3><p>${item.duration}秒 / ${item.count}工程</p><a href="${item.id}-3.png"><img src="${item.id}-3.png" alt="${item.id} 工程4"></a><details><summary>全${item.count}工程を確認</summary>${Array.from({length:item.count},(_,i)=>`<figure><a href="${item.id}-${i}.png"><img loading="lazy" src="${item.id}-${i}.png" alt="${item.id} 工程${i+1}"></a><figcaption>工程 ${i+1}</figcaption></figure>`).join('')}</details></article>`).join('')}</div></section>`).join('')}</main></html>`);
