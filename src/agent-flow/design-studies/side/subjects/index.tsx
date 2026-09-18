import React from 'react';
import {DemoAppScreen} from './DemoScreens';
import {AbsoluteFill,interpolate,useCurrentFrame} from 'remotion';
import {FlowDiagram} from '../../../../shared/FlowDiagram';
import {AgentFlowInquiryIcons} from '../../../inquiry/icons';
import {SUBJECTS,sideMoment,type Subject,type SideLayout,type SubjectData} from './data';
export {SUBJECTS,sideMoment} from './data';

const muted='#9eb2c2',line='#344656';
const Diagram:React.FC<{subject:Subject;frame:number;scale:number}>=({subject,frame,scale})=>{
 const data=SUBJECTS[subject],step=Math.floor(frame/120);
 return <div style={{width:1920*scale,height:1080*scale,overflow:'hidden',borderRadius:10}}><div style={{width:1920,height:1080,transform:`scale(${scale})`,transformOrigin:'top left'}}>
  {data.spec?<FlowDiagram spec={{...data.spec,edges:data.spec.edges.map(edge=>({...edge,dashed:edge.dashed||edge.step!==step}))}} variant="logoSeal" brandIcons hidePanel frameOverride={frame}/>:<AgentFlowInquiryIcons nodeVariant="logoSeal" hidePanel inactiveDashed frameOverride={frame}/>}
 </div></div>;
};
/** 各題材の定義にある値を参照。未到達の判断値は表示しない。 */
const Screen:React.FC<{data:SubjectData;step:number}>=({data,step})=> <>
 <div style={{fontSize:14,color:muted,letterSpacing:1,marginBottom:18}}>CASE WORKSPACE / {String(step+1).padStart(2,'0')}</div>
 {data.scenes[step].fields.map(([key,value],i)=><div key={i} style={{display:'grid',gridTemplateColumns:'100px 1fr',gap:12,fontSize:17,lineHeight:1.6,padding:'8px 0',borderBottom:`1px solid ${line}`}}><span style={{color:muted}}>{key}</span><span>{value}</span></div>)}
 <div style={{marginTop:22,fontSize:14,color:muted}}>判断の記録</div>
 {data.rows.filter(r=>r.revealStep<=step).map(row=><div key={row.label} style={{padding:'10px 0',borderBottom:`1px solid ${line}`,display:'flex',justifyContent:'space-between',gap:12,fontSize:17}}><span style={{color:muted}}>{row.label}</span><strong style={{color:row.color}}>{row.value}</strong></div>)}
 {data.rows.every(r=>r.revealStep>step)&&<div style={{paddingTop:16,fontSize:18,color:muted}}>入力を整理中</div>}
</>;
export const SubjectSide:React.FC<{subject:Subject;layout:SideLayout}>=({subject,layout})=>{
 const frame=useCurrentFrame(),data=SUBJECTS[subject];
 const {step,local,length,sourceFrame}=sideMoment(frame,subject,layout);
 const current=data.scenes[step],accent=data.colors[step];
 const enter=interpolate(local,[0,15],[0,1],{extrapolateRight:'clamp'});
 const leave=step===data.steps.length-1?1:interpolate(local,[length-10,length-1],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const opacity=enter*leave;
 const first=data.rows[0],latest=[...data.rows].reverse().find(r=>r.revealStep<=step);
 const clock=<div style={{position:'absolute',right:40,top:24,textAlign:'right'}}><div style={{fontSize:14,color:muted}}>映像の経過時間</div><div style={{fontSize:38,fontFamily:'monospace',marginTop:8}}>{String(Math.floor(frame/1800)).padStart(2,'0')}:{String(Math.floor(frame/30)%60).padStart(2,'0')}</div></div>;
 if(layout==='Stacked')return <AbsoluteFill data-subject={subject} data-side-step={step} style={{background:'#101619',color:'#edf3fa',fontFamily:'"Hiragino Sans",sans-serif'}}>
  <div style={{position:'absolute',left:297.6,top:0}}><Diagram subject={subject} frame={sourceFrame} scale={.69}/></div>
  <div style={{position:'absolute',left:297.6,top:756,width:1324.8,borderTop:`1px solid ${line}`,paddingTop:18}}>
   <div style={{display:'grid',gridTemplateColumns:'1.65fr 1fr 1fr',gap:24,height:145}}>
    <div style={{opacity}}><div style={{fontSize:13,color:muted}}>DECISION STORY / {step+1} · {data.steps[step]}</div><h1 style={{fontSize:24,lineHeight:1.5,margin:'12px 0'}}>{current.title}</h1><div style={{fontSize:15,color:muted,lineHeight:1.7}}>{current.note}</div></div>
    {[first,latest].map((row,i)=><div key={i} style={{borderLeft:`2px solid ${i===0?'#b398f9':'#edf3fa'}`,paddingLeft:18}}><div style={{opacity}}><div style={{fontSize:15,color:row?.color??muted}}>{i===0?first.label:'この工程までの判断'}</div><div style={{fontSize:32,fontWeight:700,margin:'12px 0',color:row?.color}}>{row&&row.revealStep<=step?row.value:'—'}</div><div style={{fontSize:14,color:muted,lineHeight:1.6}}>{row&&row.revealStep<=step?row.note:'判断待ち'}</div></div></div>)}
   </div>
   <div style={{height:95,boxSizing:'border-box',marginTop:16,padding:'18px 20px',background:'#1a2327',border:`1px solid ${line}`,borderRadius:9}}><div style={{opacity}}><div style={{fontSize:13,color:muted,marginBottom:10}}>判断の原則</div><div style={{fontSize:21}}>{data.principle}</div></div></div>
  </div>
 </AbsoluteFill>;
 const demo=layout==='DemoDiagram';
 return <AbsoluteFill data-subject={subject} data-side-step={step} style={{background:'#0b121b',color:'#edf3fa',fontFamily:'"Hiragino Sans",sans-serif'}}>
  <div style={{position:'absolute',left:40,top:32,fontSize:30,fontWeight:700}}>{data.title}</div><div style={{position:'absolute',left:40,top:85,fontSize:17,color:muted}}>{data.diagramId}</div>{clock}
  <div style={{position:'absolute',left:demo?40:56,top:demo?218:309}}><Diagram subject={subject} frame={sourceFrame} scale={demo?.6:.59375}/></div>
  {demo&&<div style={{position:'absolute',left:1220,top:163,width:170}}><div style={{fontSize:14,color:muted,marginBottom:30}}>CASE WORKSPACE</div>{data.steps.map((name,i)=><div key={name} style={{height:101,boxSizing:'border-box',padding:'16px 12px',borderLeft:`3px ${i===step?'solid':'dashed'} ${i===step?accent:line}`,background:i===step?'#20313e':undefined}}><div style={{fontSize:14,color:muted,marginBottom:10}}>{String(i+1).padStart(2,'0')}</div><div style={{fontSize:16,lineHeight:1.5}}>{name}</div></div>)}</div>}
  <div style={{position:'absolute',left:demo?1416:1244,top:demo?155:630,width:demo?464:590,transform:demo?undefined:'translateY(-50%)'}}>
   <div style={{fontSize:demo?24:30,fontWeight:700,lineHeight:1.5,marginBottom:18}}>{current.title}</div>
   <div style={{height:510,boxSizing:'border-box',padding:22,background:'#121e2b',border:`1px solid ${line}`,borderTop:`3px solid ${accent}`,borderRadius:10}}><div style={{opacity:enter}}>{demo?<DemoAppScreen subject={subject} step={step}/>:<Screen data={data} step={step}/>}</div></div>
   <div style={{marginTop:26,borderTop:`3px solid ${accent}`,paddingTop:18}}><div style={{fontSize:15,color:accent,marginBottom:14}}>この画面で見ること</div><div style={{fontSize:20,lineHeight:1.8,color:'#b6c6d4'}}>{current.note}</div></div>
  </div>
 </AbsoluteFill>;
};
