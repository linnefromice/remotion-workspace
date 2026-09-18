import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NODES } from '../cards/constants';
import { FONT, ROLE, moment, pointAlong, type Layout, type Point } from './model';
import { Mark, StudyFooter } from './StudyParts';

const POS: Layout = {
 resident:[320,350],intake:[560,350],normalize:[800,350],triage:[1040,350],
 dispatch:[1060,575],approval:[1320,575],vendor:[1580,575],reply:[800,575],
 staff:[510,805],policy:[770,805],vendorDb:[1030,805],
};
const DECKS = [
 {x:155,y:280,w:1090,label:'01 / 相談を理解する',fill:'#e1e8e2',side:'#bdcbc1'},
 {x:635,y:505,w:1110,label:'02 / 判断を届ける',fill:'#dce6ef',side:'#b7cbdc'},
 {x:345,y:735,w:870,label:'03 / 判断を支える',fill:'#ebe1d7',side:'#d0bca9'},
];
export const InquiryTerraces: React.FC = () => {
 const {step,link,progress}=moment(useCurrentFrame());
 const [sx,sy]=POS[link.from],[tx,ty]=POS[link.to];
 const gutter=Math.min(sy,ty)-100;
 const points:Point[] = sy===ty ? [[sx,sy-48],[sx,gutter],[tx,gutter],[tx,ty-48]]
   : [[sx-54,sy],[sx-120,sy],[sx-120,gutter],[tx-120,gutter],[tx-120,ty],[tx-54,ty]];
 const [x,y]=pointAlong(points,Math.min(1,progress/.85));
 return <AbsoluteFill style={{background:'#f7f4ed',color:'#303d42',fontFamily:FONT}}>
  <div style={{position:'absolute',left:64,top:40,fontSize:17,letterSpacing:3,color:'#677476'}}>FARLEAP / INQUIRY · 08 · TERRACES</div>
  <div style={{position:'absolute',left:64,top:84,fontSize:49,fontWeight:700}}>判断を支える、もうひとつの層。</div>
  <div style={{position:'absolute',right:64,top:45,width:590,borderLeft:'3px solid #536b80',paddingLeft:26}}><div style={{fontSize:28,fontWeight:700}}>{link.title}</div><div style={{fontSize:20,marginTop:14,color:'#69767a'}}>{link.payload}</div></div>
  <svg width={1920} height={1080} style={{position:'absolute'}}>
   {DECKS.map(d=><g key={d.label}><path d={`M${d.x-60} ${d.y+165}H${d.x+d.w-60}L${d.x+d.w} ${d.y+115}V${d.y+141}L${d.x+d.w-60} ${d.y+191}H${d.x-60}Z`} fill={d.side}/><path d={`M${d.x} ${d.y}H${d.x+d.w}V${d.y+115}L${d.x+d.w-60} ${d.y+165}H${d.x-60}V${d.y+50}Z`} fill={d.fill}/></g>)}
   <defs><marker id="terraces-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="#67568d" strokeWidth="1.5"/></marker></defs>
   <path d={points.map(([px,py],i)=>`${i?'L':'M'}${px} ${py}`).join(' ')} fill="none" stroke="#67568d" strokeWidth={3} strokeDasharray={link.dashed?'6 7':undefined} markerEnd="url(#terraces-arrow)"/>
   <circle cx={x} cy={y} r={9} fill="#67568d" stroke="#f7f4ed" strokeWidth={3}/>
  </svg>
  {DECKS.map(d=><div key={d.label} style={{position:'absolute',left:d.x-20,top:d.y+168,fontSize:14,fontWeight:700,color:'#526365'}}>{d.label}</div>)}
  {NODES.map(({id})=>{const [cx,cy]=POS[id];const active=id===link.from||id===link.to;const lift=active?10*Math.sin(Math.PI*progress):0;return <div key={id} style={{position:'absolute',left:cx-112,top:cy-50-lift,width:224,textAlign:'center'}}>
   <div style={{display:'inline-flex',padding:8,borderRadius:60,background:'#fffdf8',boxShadow:`0 ${12+lift}px 0 -4px #34464e18`,border:`2px ${id==='approval'?'dashed':'solid'} ${active?'#67568d':'#c1cbd0'}`}}><Mark id={id} size={68} light/></div><div style={{fontSize:19,fontWeight:700,marginTop:12}}>{ROLE[id]}</div>
  </div>;})}
  <div style={{position:'absolute',left:1315,top:770,width:465,fontSize:21,lineHeight:1.9,color:'#626c70'}}>人が判定をレビューし、基準を調整。<br/>業者マスタとともに、次の判断を支える。<div style={{fontSize:16,marginTop:12}}>下書きの連絡は、担当者が確認して送る。</div></div>
  <StudyFooter step={step} light note="段は役割のまとまりを表現 / 現在の接続のみ表示・立体配置はシステム構成を示しません"/>
 </AbsoluteFill>;
};
