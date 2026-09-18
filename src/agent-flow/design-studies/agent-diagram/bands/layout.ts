import type {FlowSpec,NodeDef} from '../../../../shared/flowTheme';
import type {Point} from '../../../../shared/orthogonalRouting';
export type BandsSpec=Pick<FlowSpec,'nodes'|'edges'|'frame'|'steps'|'stepLen'|'tagline'|'sublabel'>;
export type Band=0|1|2|'records';
export const BAND_LABELS=['入力元・結果','エージェントが処理する','ルールと人が決める'] as const;
export const BAND_TOP=210, BAND_HEIGHT=212, BAND_GAP=30;
export type PlacedNode=NodeDef & {band:Band};
const tones=['input','ai','rule','human','record','planned'];

/** 主体・元の左右関係・接続関係から配置。題材IDや座標表は持たない。 */
export function subjectBands(spec:BandsSpec){
 const ids=new Set(spec.nodes.map(n=>n.id));
 if(ids.size!==spec.nodes.length)throw Error('Duplicate node IDs');
 for(const n of spec.nodes)if(!tones.includes(n.tone))throw Error(`Missing/unknown tone: ${n.id}`);
 for(const e of spec.edges)if(!e.from||!e.to||!ids.has(e.from)||!ids.has(e.to))throw Error(`Missing/unknown endpoints: ${e.id}`);
 const assigned=new Map<string,Band>();
 for(const n of spec.nodes){
  if(n.record)assigned.set(n.id,'records');
  else if(n.tone==='record'||(n.tone==='input'&&n.cx<spec.frame.x))assigned.set(n.id,0);
  else if(n.tone==='input'||n.tone==='ai')assigned.set(n.id,1);
  else if(n.tone==='rule'||n.tone==='human')assigned.set(n.id,2);
 }
 // plannedは接続先の帯を借りる。複数なら元の位置が最も近いノードを優先。
 const pending=spec.nodes.filter(n=>!assigned.has(n.id));
 while(pending.length){
  let progress=false;
  for(let i=pending.length-1;i>=0;i--){
   const n=pending[i];
   const neighbors=new Set(spec.edges.flatMap(e=>e.from===n.id?[e.to!]:e.to===n.id?[e.from!]:[]));
   const candidates=spec.nodes.filter(v=>neighbors.has(v.id)&&assigned.has(v.id)&&assigned.get(v.id)!=='records')
    .sort((a,b)=>Math.hypot(a.cx-n.cx,a.cy-n.cy)-Math.hypot(b.cx-n.cx,b.cy-n.cy)||a.id.localeCompare(b.id));
   if(candidates.length){assigned.set(n.id,assigned.get(candidates[0].id)!);pending.splice(i,1);progress=true;}
  }
  if(!progress)throw Error(`Planned nodes need a neighbor in a band: ${pending.map(n=>n.id).join(', ')}`);
 }
 const nodes:PlacedNode[]=[];
 for(const band of [0,1,2,'records'] as const){
  const members=spec.nodes.filter(n=>assigned.get(n.id)===band).sort((a,b)=>band==='records'?a.cy-b.cy||a.id.localeCompare(b.id):a.cx-b.cx||a.cy-b.cy||a.id.localeCompare(b.id));
  members.forEach((n,i)=>nodes.push({...n,band,
   cx:band==='records'?1710:200+(i+.5)*1280/Math.max(1,members.length),
   cy:band==='records'?284+i*124:BAND_TOP+band*(BAND_HEIGHT+BAND_GAP)+122,
   w:band==='records'?264:Math.min(206,1280/Math.max(1,members.length)-24),h:band==='records'?88:102}));
 }
 const byId=new Map(nodes.map(n=>[n.id,n]));
 const edges=spec.edges.map((e,i)=>{
  const a=byId.get(e.from!)!,b=byId.get(e.to!)!;
  let points:Point[];
  if(a.band===b.band){
   const y=Math.min(a.cy-a.h/2,b.cy-b.h/2)-22-(i%4)*8;
   points=[[a.cx,a.cy-a.h/2],[a.cx,y],[b.cx,y],[b.cx,b.cy-b.h/2]];
  }else{
   const right=b.cx>=a.cx;
   const ax=a.cx+(right?1:-1)*a.w/2,bx=b.cx+(right?-1:1)*b.w/2;
   const x=(ax+bx)/2+(i%3-1)*10;
   points=[[ax,a.cy],[x,a.cy],[x,b.cy],[bx,b.cy]];
  }
  return {...e,from:e.from!,to:e.to!,points};
 });
 return {nodes,edges};
}
