import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {z} from 'zod';
import {ServiceIcon} from '../../../../shared/ServiceIcon';
import {roundedPath,pointAtFraction} from '../../../../shared/orthogonalRouting';
import type {NodeTone} from '../../../../shared/flowTheme';
import {BAND_SPECS} from './specs';
import {subjectBands,BAND_LABELS,BAND_TOP,BAND_HEIGHT,BAND_GAP} from './layout';
export const bandsSchema=z.object({subject:z.enum(['restoration','proposal','claimIntake'])});
export const bandsDefaults={subject:'restoration' as const};
const PALETTE:Record<NodeTone,{fill:string;ink:string;line:string}>={
 input:{fill:'#dceee8',ink:'#175f56',line:'#287d70'},
 ai:{fill:'#e9e1f1',ink:'#59447f',line:'#785aa6'},
 rule:{fill:'#ffffff',ink:'#293b3d',line:'#ffffff'},
 human:{fill:'#f2dfcf',ink:'#89491e',line:'#b56732'},
 record:{fill:'#e0eadc',ink:'#325e3b',line:'#527d58'},
 planned:{fill:'#e8e8e1',ink:'#596362',line:'#74817d'},
};
export const DiagramBands:React.FC<z.infer<typeof bandsSchema>>=({subject})=>{
 const spec=BAND_SPECS[subject],frame=useCurrentFrame();
 const step=Math.min(spec.steps.length-1,Math.floor(frame/spec.stepLen)),local=frame%spec.stepLen;
 const {nodes,edges}=subjectBands(spec);
 const byId=new Map(nodes.map(n=>[n.id,n]));
 return <AbsoluteFill style={{background:'#f3f1e8',color:'#263d38',fontFamily:'"Hiragino Sans", "Noto Sans CJK JP", sans-serif'}}>
  <div style={{position:'absolute',left:64,top:32,fontSize:16,letterSpacing:3}}>{spec.sublabel.replace(/^\/\s*/, "")} / SUBJECT BANDS</div>
  <h1 style={{position:'absolute',left:64,top:70,fontSize:43,margin:0}}>処理する主体と、決める主体を分ける。</h1>
  <div style={{position:'absolute',left:64,top:145,fontSize:20,color:'#586e64'}}>{spec.tagline}</div>
  <div style={{position:'absolute',right:64,top:48,textAlign:'right'}}><div style={{fontSize:17}}>工程 {step+1} / {spec.steps.length}</div><div style={{fontSize:28,marginTop:12,fontWeight:700}}>{spec.steps[step]}</div></div>
  {BAND_LABELS.map((label,i)=><div key={label} style={{position:'absolute',left:64,top:BAND_TOP+i*(BAND_HEIGHT+BAND_GAP),width:1460,height:BAND_HEIGHT,borderRadius:20,background:['#e4e9df','#e8e4ed','#ece5db'][i]}}><div style={{padding:'17px 22px',fontSize:18,fontWeight:700}}>{String(i+1).padStart(2,'0')} / {label}</div></div>)}
  <div style={{position:'absolute',left:1558,top:BAND_TOP,width:298,height:696,borderLeft:'1px solid #a7b7ab'}}><div style={{fontSize:18,fontWeight:700,paddingLeft:22}}>RECORDS / 積み重なる記録</div></div>
  <svg width={1920} height={1080} style={{position:'absolute',inset:0}}>
   <defs><marker id="bands-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="context-stroke" strokeWidth="1.6"/></marker></defs>
   {edges.map(e=>{
    const active=e.step===step&&local>=(e.delay??0);
    const color=PALETTE[byId.get(e.from)!.tone].line;
    const d=roundedPath(e.points,12),dash=!active||e.dashed?'7 8':undefined;
    const [x,y]=pointAtFraction(e.points,Math.max(0,(local-(e.delay??0))/(spec.stepLen-(e.delay??0))));
    return <g key={e.id}>
     {active&&color==='#ffffff'&&<path d={d} fill="none" stroke="#88958d" strokeWidth={6} strokeDasharray={dash}/>}
     <path data-band-edge={e.id} data-active={active} data-from={e.from} data-to={e.to} d={d} fill="none" stroke={active?color:'#85968c'} strokeWidth={active?3:1.5} strokeDasharray={dash} markerEnd="url(#bands-arrow)"/>
     {active&&<circle cx={x} cy={y} r={6} fill={color} stroke="#263d38" strokeWidth={1}/>}
    </g>;
   })}
  </svg>
  {nodes.map(n=>{
   const palette=PALETTE[n.tone],active=n.steps.includes(step),dashed=n.dashed||n.tone==='planned';
   return <div key={n.id} data-band-node={n.id} data-tone={n.tone} data-band={n.band} style={{position:'absolute',left:n.cx-n.w/2,top:n.cy-n.h/2,width:n.w,height:n.h,boxSizing:'border-box',background:palette.fill,border:`${active?3:1}px ${dashed?'dashed':'solid'} ${active?palette.ink:'#9aa99f'}`,borderRadius:n.record?8:16,color:palette.ink,padding:'12px 14px'}}>
    <div style={{display:'flex',alignItems:'center',gap:9}}>{n.icon&&!n.record&&<ServiceIcon name={n.icon} size={26}/>}<strong style={{fontSize:n.record?17:18,lineHeight:1.35}}>{n.jp}</strong></div>
    <div style={{fontSize:13,lineHeight:1.5,marginTop:10}}>{n.record?n.en:n.desc}</div>
   </div>;
  })}
  <div style={{position:'absolute',left:64,top:939,fontSize:17,color:'#586e64'}}>配置検証 / {nodes.length}ノード・{edges.length}経路を常設 / 薄い破線：その他の経路 / 任意・未実装は強調時も破線</div>
  <div style={{position:'absolute',left:64,top:984,fontSize:16,color:'#586e64'}}>主体：入力＝青緑　AI＝紫　ルール＝白　人＝橙　記録＝緑　未実装＝灰 / 元の横位置で整列・座標表なし</div>
  <div style={{position:'absolute',left:64,right:64,bottom:32,height:3,background:'#cbd3c8'}}><div style={{height:3,background:'#526d62',width:`${(frame+1)/(spec.steps.length*spec.stepLen)*100}%`}}/></div>
 </AbsoluteFill>;
};
