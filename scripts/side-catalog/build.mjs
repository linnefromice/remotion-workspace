import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const doc=await readFile(path.join(root,'docs/side-catalog.md'),'utf8');
const galleryHtml=await readFile(path.join(root,'out/agent-flow-gallery/index.html'),'utf8');
const gallery=JSON.parse(galleryHtml.match(/<script id="gallery-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const inline=s=>escape(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const section=n=>{const text=doc.split(new RegExp(`^## ${n}\\. `,'m'))[1];if(!text)throw Error(`Missing section ${n}`);return text.split(/^## /m)[0];};
const table=n=>section(n).split('\n').filter(l=>l.startsWith('|')).slice(2).map(l=>l.split('|').slice(1,-1).map(s=>s.trim()));
const zoneNames={right:'右 / 本体',corner:'右上 / 小さく1つ',bottom:'下 / 横長の1帯'};
const previewIds={SCENES:'ClaimIntake-SideBySide-Clock',clockSlot:'ClaimIntake-SideBySide-Clock',counterfactualSlot:'Side-SlotExample',timelineSlot:'ClaimIntake-SideBySide-Timeline'};
const imageFor=id=>{const item=gallery.items.find(i=>i.id===id);if(!item)throw Error(`Gallery is missing ${id}; run pnpm gallery:agent-flow`);return {item,src:`../agent-flow-gallery/${item.image}`};};
const components=[1,2,3].flatMap((n)=>table(n).map(([name,description,implementation])=>{
 const keys=[...implementation.matchAll(/`([^`]+)`/g)].map(m=>m[1]);
 const key=keys.find(k=>k in previewIds||k.startsWith('Side-'));
 if(!key)throw Error(`No preview mapping: ${implementation}`);
 const id=previewIds[key]??key;
 return {name,description,implementation,id,zone:['right','corner','bottom'][n-1],standalone:key.startsWith('Side-')};
}));
const completed=table(6).flatMap(([ids,...cells])=>[...ids.matchAll(/`([^`]+)`/g)].map(m=>({id:m[1],cells})));
for(const {id} of [...components,...completed]){const {item}=imageFor(id);await access(path.join(root,'out/agent-flow-gallery',item.image));}
const elements=components.map(c=>{const {src}=imageFor(c.id);return `<article class="element" data-zone="${c.zone}"><div class="element-copy"><div class="eyebrow">${zoneNames[c.zone]}</div><h3>${inline(c.name)}</h3><p>${inline(c.description)}</p><span class="status ${c.standalone?'whole':''}">${c.standalone?'独立した1枚 · 部品化には切り出しが必要':'既存の部品'}</span><div class="implementation">${inline(c.implementation)}</div></div><a class="preview" href="${src}" aria-label="${escape(c.name.replaceAll('**',''))}の完成例を原寸で開く"><img loading="lazy" src="${src}" width="1920" height="1080" alt="${escape(c.id)} の完成例"><span>配置した完成例を見る ↗</span></a></article>`;}).join('');
const cards=[];
for(const c of completed){const {item,src}=imageFor(c.id);let video='';try{await access(path.join(root,'out/video',c.id+'.mp4'));video=`<a href="../video/${c.id}.mp4">動画を開く ↗</a>`;}catch{}
 cards.push(`<article class="finished" data-search="${escape([c.id,...c.cells,...components.filter(element=>element.id===c.id).flatMap(element=>[element.name,element.description])].join(' ').toLowerCase())}"><a href="${src}"><img loading="lazy" src="${src}" width="1920" height="1080" alt="${escape(c.id)} の代表画像"></a><div class="finished-copy"><div class="eyebrow">${item.durationInFrames/item.fps}秒 · ${item.width} × ${item.height}</div><h3>${escape(c.id)}</h3><p>${c.cells.map((v,i)=>v?`${['本体','右上','下'][i]}：${inline(v)}`:'').filter(Boolean).join('<br>')}</p><div class="card-links"><a href="${src}">原寸画像 ↗</a>${video}</div></div></article>`);
}
const ideas=table(4).map(([place,idea,why])=>`<tr><th scope="row">${inline(place)}</th><td>${inline(idea)}</td><td>${inline(why)}</td></tr>`).join('');
const rules=section(5).split('\n').reduce((out,line)=>{if(line.startsWith('- '))out.push(line.slice(2));else if(line.startsWith('  ')&&out.length)out[out.length-1]+=' '+line.trim();return out;},[]).map(s=>`<li>${inline(s)}</li>`).join('');
const template=await readFile(new URL('./page.html',import.meta.url),'utf8');
const html=template.replace('__ELEMENTS__',elements).replace('__FINISHED__',cards.join('')).replaceAll('__COUNT__',String(cards.length)).replaceAll('__ELEMENT_COUNT__',String(components.length)).replace('__IDEAS__',ideas).replace('__RULES__',rules);
const out=path.join(root,'out/side-catalog');await mkdir(out,{recursive:true});await writeFile(path.join(out,'index.html'),html);
console.log(`Side catalog: ${components.length} elements, ${cards.length} complete layouts\n${out}/index.html`);
