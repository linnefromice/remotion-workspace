import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AgentFlowClaimIntakeIcons} from '../../claim-intake/icons';
import {CANVAS_H, CANVAS_W, STEP_LEN, STEPS, STEP_COLORS} from '../../claim-intake/cards/constants';
import {CASE, EVENTS} from '../../claim-intake/side-by-side/scenario';

const C = {bg:'#101619', panel:'#1b2428', line:'#3e4e54', text:'#f3f3ea', muted:'#b2bec2', ai:'#c2adff', rule:'#ffffff', human:'#ffaf83'};
const MAP = {x:1208,y:272,w:648};
const COPY = [
 {title:'ひとつの通報に、複数の判断を残す。',label:'受け取った事実',note:'写真付きの相談を受け付ける。まだ、緊急度は決めない。'},
 {title:'判断の根拠は、この一文にある。',label:'入力を確認',note:'水漏れだけでなく「ガスのようなにおい」も、次の判断に渡す。'},
 {title:'AIはP2と判断。その原値を保存する。',label:'AIの原判定',note:'この値は後から書き換えない。次の判断と別々に保持する。'},
 {title:'P2は残す。安全ルールがP1を加える。',label:'比較用の仮定 / 安全ルールがなければ',note:'AIのP2なら翌営業日の判断。このケースではルールが即時対応へ昇格。'},
 {title:'次の対応にも、制約をかける。',label:'第2段階 / 責任区分と対応候補',note:'5本のガードレールは、候補の追加と制止だけ。候補は削らない。'},
 {title:'下げる判断は、人だけが理由を残す。',label:'権限の非対称',note:'昇格はルールが強制。このケースでは担当者がP1を確認する。'},
 {title:'違う判断を、ひとつの履歴で追える。',label:'追記のみの記録',note:'AIの原判定、発火ルール、人の確認。どの判断も消さずに残る。'},
];

export const ClaimIntakeSideEvidence: React.FC = () => {
 const frame=useCurrentFrame();
 const step=Math.min(STEPS.length-1,Math.floor(frame/STEP_LEN));
 const enter=interpolate(frame%STEP_LEN,[0,18],[0,1],{extrapolateRight:'clamp'});
 const current=COPY[step];
 const decisions=[
  {name:'AI / 原判定',value:CASE.aiUrgency,detail:'翌営業日',foot:'urgency_ai · 原値を保存',at:2,color:C.ai},
  {name:'安全ルール / 結論',value:CASE.resolvedUrgency,detail:'即時対応',foot:CASE.ruleId,at:3,color:C.rule},
  {name:'人 / 確認',value:'確認',detail:`${CASE.resolvedUrgency}を確認`,foot:'降格は人のみ・理由必須',at:5,color:C.human},
 ];
 return <AbsoluteFill style={{background:C.bg,color:C.text,fontFamily:'"Hiragino Sans", "Noto Sans CJK JP", sans-serif'}}>
  <div style={{position:'absolute',left:64,right:64,top:40,display:'flex',justifyContent:'space-between',fontSize:17,letterSpacing:2,color:C.muted}}><span>FARLEAP / SIDE EVIDENCE</span><span>CLAIM INTAKE · {CASE.ticket}</span></div>
  <h1 style={{position:'absolute',left:64,top:93,margin:0,fontSize:52,letterSpacing:-1,fontWeight:700}}>{current.title}</h1>
  <div style={{position:'absolute',left:64,top:181,fontSize:20,color:C.muted}}>判断の記録を主役に、同じ瞬間の経路を横に。</div>
  <div style={{position:'absolute',left:64,top:260,width:1064,borderTop:`1px solid ${C.line}`,paddingTop:24}}>
   <div style={{fontSize:17,color:C.muted,letterSpacing:2}}>SOURCE / 入居者から届いた内容 · 添付写真 × 1</div>
   <div style={{fontSize:30,lineHeight:1.8,marginTop:16}}>キッチンの下から水が漏れています。<br/><span style={{borderBottom:`2px solid ${step>=1?C.rule:'transparent'}`,paddingBottom:5}}>ガスのようなにおい</span>も少しします。</div>
  </div>
  <div style={{position:'absolute',left:64,top:458,width:1064,display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:24}}>
   {decisions.map(d=>{const ready=step>=d.at;const active=step===d.at;return <div key={d.name} style={{height:242,padding:'20px 18px',boxSizing:'border-box',background:C.panel,borderTop:`3px ${ready?'solid':'dashed'} ${ready?d.color:C.line}`}}>
    <div style={{fontSize:20,color:ready?d.color:C.muted}}>{d.name}</div>
    <div style={{transform:`translateY(${active?(1-enter)*12:0}px)`,opacity:active?.35+.65*enter:1}}><div style={{fontSize:d.value==='確認'?60:72,fontWeight:700,marginTop:8,lineHeight:1.2,color:ready?d.color:C.muted}}>{ready?d.value:'—'}</div><div style={{fontSize:22,marginTop:10}}>{ready?d.detail:'記録待ち'}</div></div>
    <div style={{fontSize:15,color:C.muted,marginTop:20,whiteSpace:'nowrap'}}>{d.foot}</div>
   </div>;})}
  </div>
  <div style={{position:'absolute',left:1172,top:260,bottom:294,width:1,background:C.line}}/>
  <div style={{position:'absolute',left:MAP.x,top:234,fontSize:17,letterSpacing:2,color:C.muted}}>MAP / 全体の経路</div>
  <div style={{position:'absolute',left:MAP.x,top:MAP.y,width:MAP.w,height:CANVAS_H*MAP.w/CANVAS_W,overflow:'hidden',border:`1px solid ${C.line}`}}><div style={{width:CANVAS_W,height:CANVAS_H,transform:`scale(${MAP.w/CANVAS_W})`,transformOrigin:'top left'}}><AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons hidePanel/></div></div>
  <div style={{position:'absolute',left:MAP.x,top:665,width:MAP.w,display:'flex',alignItems:'center',gap:18}}><div style={{width:54,height:54,border:`1px solid ${STEP_COLORS[step]}`,display:'grid',placeItems:'center',fontSize:26,color:STEP_COLORS[step]}}>{String(step+1).padStart(2,'0')}</div><div><div style={{fontSize:25,fontWeight:700}}>{STEPS[step]}</div><div style={{fontSize:17,color:C.muted,marginTop:7}}>地図の点灯と、左の判断が同期</div></div></div>
  <div style={{position:'absolute',left:64,right:64,top:738,borderLeft:`3px solid ${step===3?C.rule:STEP_COLORS[step]}`,paddingLeft:24}}><div style={{fontSize:17,color:C.muted}}>{current.label}</div><div style={{fontSize:26,marginTop:10}}>{current.note}</div></div>
  <div style={{position:'absolute',left:64,right:64,top:856,display:'grid',gridTemplateColumns:'repeat(7,minmax(0,1fr))',gap:16}}>
   {EVENTS.map((event,i)=><div key={event.name} style={{borderTop:`3px ${i<=step?'solid':'dashed'} ${i===step?STEP_COLORS[step]:i<step?C.muted:C.line}`,paddingTop:14}}><div style={{display:'flex',justifyContent:'space-between',fontSize:18,color:i<=step?C.text:C.muted}}><span>{STEPS[i]}</span><span>{i<=step?`+${event.t}s`:'—'}</span></div><div style={{fontSize:14,marginTop:14,color:C.muted}}>{i<=step?event.name:'記録待ち'}</div><div style={{fontSize:14,marginTop:7,color:C.muted}}>{i<=step?'記録を保持':'これからの工程'}</div></div>)}
  </div>
  <div style={{position:'absolute',left:64,right:64,bottom:32,display:'flex',justifyContent:'space-between',fontSize:16,color:C.muted}}><span>説明用の画面再構成 / 実システムへの接続なし</span><span>経過秒はシナリオ値・実測や性能保証ではありません / 動画28秒</span></div>
 </AbsoluteFill>;
};
