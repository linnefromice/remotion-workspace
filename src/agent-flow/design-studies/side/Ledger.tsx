import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AgentFlowClaimIntakeIcons} from '../../claim-intake/icons';
import {CANVAS_H, CANVAS_W, STEP_LEN, STEPS} from '../../claim-intake/cards/constants';
import {CASE, EVENTS} from '../../claim-intake/side-by-side/scenario';

const C={paper:'#eeeae1',ink:'#243536',muted:'#5d6b69',rule:'#ffffff',ai:'#68569a',human:'#9d4c29',dark:'#102126',light:'#edf4f0'};
const ROW_H=84;
const MAP={x:1024,y:238,w:832};
const RECORDS=[
 {label:'相談を受け付けた',value:'受付',detail:'通報文・添付写真を保持',color:C.ink},
 {label:'判断の根拠を確認',value:'入力',detail:'「ガスのようなにおい」も判定へ',color:C.ink},
 {label:'AIの原判定を保存',value:CASE.aiUrgency,detail:'翌営業日 / 原値を書き換えない',color:C.ai},
 {label:'安全ルールの結論を追加',value:CASE.resolvedUrgency,detail:CASE.ruleId,color:C.ink},
 {label:'次の対応候補を提示',value:'候補',detail:'第2段階 / 責任区分と次の対応',color:C.ai},
 {label:'担当者が判断を確認',value:'確認',detail:`このケースは${CASE.resolvedUrgency}を確認`,color:C.human},
 {label:'一次回答を記録',value:'回答',detail:'過去の判断を消さず、履歴に追記',color:C.ink},
];
const FOCUS=[
 ['まだ、結論は出さない。','まずは届いた相談を受け付ける。'],
 ['判断の材料を、取りこぼさない。','水漏れに加え、においの記述を判断へ渡す。'],
 [`AIの${CASE.aiUrgency}を、原値として残す。`,'次の判断が加わっても、この記録は変えない。'],
 [`${CASE.aiUrgency}と${CASE.resolvedUrgency}を、別の記録に。`,'ルールが運用上の緊急度を即時対応へ昇格。'],
 ['対応候補にも、制約をかける。','5本のガードレールは追加と制止だけ。候補を削らない。'],
 ['下げる権限は、人だけに。','降格する場合は理由必須。今回は降格せず確認する。'],
 ['判断の違いまで、あとから追える。','AIの原値、発火ルール、人の確認が一緒に残る。'],
];
export const SideLedger:React.FC=()=>{
 const frame=useCurrentFrame();const step=Math.min(STEPS.length-1,Math.floor(frame/STEP_LEN));
 const enter=interpolate(frame%STEP_LEN,[0,18],[0,1],{extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:C.paper,color:C.ink,fontFamily:'"Hiragino Sans", "Noto Sans CJK JP", sans-serif'}}>
  <div style={{position:'absolute',left:976,top:0,right:0,bottom:0,background:C.dark}}/>
  <div style={{position:'absolute',left:56,top:36,fontSize:16,letterSpacing:3,color:C.muted}}>SIDE LEDGER</div>
  <h1 style={{position:'absolute',left:56,top:82,margin:0,fontSize:44,letterSpacing:-1}}>判断は、消さずに積み重ねる。</h1>
  <div style={{position:'absolute',left:56,top:166,width:864,borderLeft:'3px solid #899995',paddingLeft:22,fontSize:22,lineHeight:1.7}}>キッチンの下から水が漏れています。<br/><span style={{borderBottom:step>=1?'2px solid #243536':undefined}}>ガスのようなにおい</span>も少しします。<span style={{fontSize:15,marginLeft:18,color:C.muted}}>写真付きの想定ケース</span></div>
  <div style={{position:'absolute',left:56,top:278,width:864}}>
   {RECORDS.map((record,i)=>{const done=i<=step;const active=i===step;return <div key={record.label} data-ledger-step={i} data-recorded={done} style={{height:ROW_H,display:'grid',gridTemplateColumns:'64px 1fr 112px',gap:18,alignItems:'center',borderTop:`1px ${done?'solid':'dashed'} #aab5af`,background:i===3&&done?C.rule:active?'#dedfd4':'transparent',padding:'0 14px',boxSizing:'border-box'}}>
    <div style={{fontSize:17,color:C.muted}}>{done?`+${EVENTS[i].t}s`:'—'}</div>
    <div style={{borderLeft:`3px solid ${done?record.color:'#bac1ba'}`,paddingLeft:18}}><div style={{fontSize:23,fontWeight:active?700:500,color:done?record.color:C.muted}}>{record.label}</div><div style={{fontSize:16,marginTop:7,color:C.muted}}>{done?record.detail:'このあとの工程 / 記録待ち'}</div></div>
    <div style={{fontSize:i===2||i===3?44:30,fontWeight:700,textAlign:'right',color:record.color,opacity:done?active?.35+.65*enter:1:.35,transform:`translateX(${active?(1-enter)*12:0}px)`}}>{done?record.value:'—'}</div>
   </div>;})}
  </div>
  <div style={{position:'absolute',left:56,top:907,width:864,borderTop:'2px solid #899995',paddingTop:18}}><div style={{fontSize:16,color:C.muted}}>同じ通報に、複数の判断が残る</div><div style={{fontSize:24,marginTop:12}}>{step<3?'AIの原判定と、安全ルールの結論を分けて保存。':step===3?`比較用の仮定：ルールがなければ${CASE.aiUrgency}、翌営業日の判断。`:'昇格はルールが強制。降格は人だけが理由を残す。'}</div></div>
  <div style={{position:'absolute',left:MAP.x,top:38,width:MAP.w,color:'#a9c2c4',fontSize:16,letterSpacing:2}}>CLAIM INTAKE / {CASE.ticket}</div>
  <div style={{position:'absolute',left:MAP.x,top:92,width:MAP.w,color:C.light,fontSize:34,fontWeight:700}}>その判断は、どこで起きたか。</div>
  <div style={{position:'absolute',left:MAP.x,top:155,width:MAP.w,color:'#a9c2c4',fontSize:19,lineHeight:1.8}}>全体の経路を常設。<br/>薄い破線はその他の経路。現在の工程は動く点で強調。</div>
  <div style={{position:'absolute',left:MAP.x,top:MAP.y,width:MAP.w,height:CANVAS_H*MAP.w/CANVAS_W,overflow:'hidden',border:'1px solid #40585e'}}><div style={{width:CANVAS_W,height:CANVAS_H,transform:`scale(${MAP.w/CANVAS_W})`,transformOrigin:'top left'}}><AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons hidePanel inactiveDashed/></div></div>
  <div style={{position:'absolute',left:MAP.x,top:753,width:MAP.w,color:C.light,borderTop:'1px solid #587074',paddingTop:24}}><div style={{fontSize:17,color:'#a9c2c4'}}>FOCUS / {String(step+1).padStart(2,'0')} · {STEPS[step]}</div><div style={{fontSize:32,fontWeight:700,marginTop:20}}>{FOCUS[step][0]}</div><div style={{fontSize:21,lineHeight:1.8,color:'#bed0d0',marginTop:16}}>{FOCUS[step][1]}</div></div>
  <div style={{position:'absolute',left:56,bottom:28,fontSize:15,color:C.muted}}>説明用の判断台帳 / 実画面・実ログの再現ではありません</div>
  <div style={{position:'absolute',left:MAP.x,bottom:28,fontSize:15,color:'#a9c2c4'}}>経過秒はシナリオ値・実測や性能保証ではありません / 動画28秒</div>
 </AbsoluteFill>;
};
