import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AgentFlowClaimIntakeIcons} from '../icons';
import {CASE} from '../side-by-side/scenario';
import {STORY_STEPS, StoryBand, StoryTextOpacity} from './index';

/** 上70%は図。下30%は読みやすい横長の判断記録。 */
export const ClaimIntakeDecisionStoryDiagramStacked:React.FC = () => {
 const frame=useCurrentFrame();
 const step=Math.min(6,Math.floor(frame/120));
 const local=frame%120;
 // 0.5秒で入り、次工程の直前0.3秒で消える。最終工程は読める状態を保つ。
 const enter=interpolate(local,[0,15],[0,1],{extrapolateRight:'clamp'});
 const leave=step===6?1:interpolate(local,[110,119],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const opacity=enter*leave;
 const current=STORY_STEPS[step];
 return <AbsoluteFill style={{background:'#101619',color:'#f3f3ea',fontFamily:'"Hiragino Sans", sans-serif'}}>
  <div style={{position:'absolute',left:297.6,top:0,width:1324.8,height:745.2,overflow:'hidden'}}><div style={{width:1920,height:1080,transform:'scale(.69)',transformOrigin:'top left'}}><AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons hidePanel inactiveDashed/></div></div>
  <div style={{position:'absolute',left:297.6,width:1840,top:756,transform:'scale(.72)',transformOrigin:'top left',borderTop:'1px solid #3c494f',paddingTop:24}}>
   <StoryTextOpacity.Provider value={opacity}>
   <div style={{display:'grid',gridTemplateColumns:'1.65fr 1fr 1fr',gap:32,height:202}}>
    <div data-story-transition={step} style={{opacity}}><div style={{fontSize:17,color:'#a8b6bb'}}>DECISION STORY / {String(step+1).padStart(2,'0')} · {current.name}</div><h1 style={{fontSize:34,margin:'14px 0',lineHeight:1.5}}>{current.title}</h1><div style={{fontSize:21,color:'#a8b6bb',lineHeight:1.7}}>{current.note}</div></div>
    <div style={{borderLeft:'3px solid #c2adff',paddingLeft:24}}><div style={{opacity}}><div style={{fontSize:21,color:'#c2adff'}}>AIの原判定 / 原値を保存</div><div style={{fontSize:56,fontWeight:700,margin:'8px 0'}}>{step>=2?CASE.aiUrgency:'—'}</div><div style={{fontSize:20}}>{step>=2?'翌営業日':'判定待ち'}</div></div></div>
    <div style={{borderLeft:'3px solid #f3f3ea',paddingLeft:24}}><div style={{opacity}}><div style={{fontSize:21}}>安全ルールの結論</div><div style={{fontSize:56,fontWeight:700,margin:'8px 0'}}>{step>=3?CASE.resolvedUrgency:'—'}</div><div style={{fontSize:20}}>{step>=3?CASE.ruleId:'評価待ち'}</div><div style={{fontSize:18,color:'#efa96d',marginTop:12}}>{step>=5?'担当者がP1を確認':''}</div></div></div>
   </div>
   <div style={{height:132,boxSizing:'border-box',marginTop:22,background:'#1a2327',border:'1px solid #3c494f',borderRadius:12,padding:'20px 26px'}}><StoryBand step={step} showComparison/></div>
   </StoryTextOpacity.Provider>
  </div>
 </AbsoluteFill>;
};
