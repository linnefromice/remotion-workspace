import React from 'react';
import {AbsoluteFill,interpolate,useCurrentFrame} from 'remotion';
import {AgentFlowClaimIntakeIcons} from '../../../claim-intake/icons';
import {STEP_COLORS,STEPS} from '../../../claim-intake/cards/constants';
import {CASE,EVENTS} from '../../../claim-intake/side-by-side/scenario';
import {SCENES} from '../../../claim-intake/side-by-side/scenes';
import {clockSlot,resolveSlotClaims} from '../../../claim-intake/side-by-side/slots';
import {DemoScreen} from './Screen';
import {demoMoment,DEMO_FRAMES,DEMO_NOTES} from './model';
export {DEMO_FRAMES} from './model';

/** 画面主体の説明デモ。フレームだけで決まる見せ方で、操作・通信は行わない。 */
export const SideDemoFull:React.FC=()=>{
 const frame=useCurrentFrame(),{step,local,sourceFrame}=demoMoment(frame);
 const enter=interpolate(local,[0,16],[0,1],{extrapolateRight:'clamp'});
 const accent=STEP_COLORS[step];
 const claims=resolveSlotClaims(clockSlot);
 return <AbsoluteFill data-demo-step={step} style={{background:'#0b121b',color:'#edf3fa',fontFamily:'"Hiragino Sans", "Noto Sans CJK JP", sans-serif'}}>
  <div style={{position:'absolute',left:0,top:0,right:0,height:116,background:'#152330',borderBottom:'1px solid #344656'}}/>
  <div style={{position:'absolute',left:48,top:32,fontSize:23,fontWeight:700,letterSpacing:2}}><span style={{fontSize:16,color:'#9eb2c2',fontWeight:400}}>CLAIM INTAKE · SCREEN DEMO</span></div>
  <div style={{position:'absolute',left:48,top:76,fontSize:16,color:'#9eb2c2'}}>説明用の画面再構成 / 実システムへの接続なし</div>
  <div style={{position:'absolute',right:48,top:18,transform:'scale(.8)',transformOrigin:'top right'}}>{clockSlot.render({frame:sourceFrame,step,width:240,showElapsed:claims.headerElapsed})}</div>
  <div style={{position:'absolute',left:48,top:161,fontSize:15,color:'#9eb2c2',letterSpacing:2}}>CASE WORKSPACE</div>
  <div style={{position:'absolute',left:48,top:208,width:192}}>{STEPS.map((label,i)=><div key={label} style={{height:84,boxSizing:'border-box',padding:'22px 12px',borderLeft:`3px ${i===step?'solid':'dashed'} ${i===step?accent:'#344656'}`,background:i===step?'#20313e':'transparent',fontSize:18,color:i===step?'#edf3fa':'#93a6b7'}}><span style={{fontFamily:'monospace',marginRight:14}}>{String(i+1).padStart(2,'0')}</span>{label}</div>)}</div>
  <div style={{position:'absolute',left:284,top:150,fontSize:32,fontWeight:700}}>{SCENES[step].title}</div>
  <div style={{position:'absolute',left:284,top:204,width:1032,height:768,background:'#121e2b',border:'1px solid #354557',borderTop:`3px solid ${accent}`,borderRadius:12,overflow:'hidden'}}>
   <div style={{height:58,borderBottom:'1px solid #354557',padding:'18px 28px',boxSizing:'border-box',fontSize:16,color:'#a8bac9'}}>案件 {CASE.ticket}<span style={{float:'right'}}>説明画面 / {step+1} of {SCENES.length}</span></div>
   <div style={{position:'absolute',left:32,top:90,width:760,transform:`translateY(${(1-enter)*10}px) scale(1.25)`,transformOrigin:'top left',opacity:enter}}><DemoScreen step={step}/></div>
  </div>
  <div style={{position:'absolute',left:1360,top:151,width:504}}>
   <div style={{fontSize:16,color:'#9eb2c2',marginBottom:20}}>位置案内 / 全経路を常設</div>
   <div style={{width:504,height:283.5,overflow:'hidden',border:'1px solid #344656'}}><div style={{width:1920,height:1080,transform:'scale(.2625)',transformOrigin:'top left'}}><AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons hidePanel inactiveDashed frameOverride={sourceFrame}/></div></div>
   <div style={{fontSize:15,color:'#9eb2c2',marginTop:14}}>その他の経路は破線 / 強調線が現在の工程</div>
   <div style={{marginTop:44,borderTop:`3px solid ${accent}`,paddingTop:22}}><div style={{fontSize:15,color:accent}}>この画面で見ること</div><h2 style={{fontSize:27,lineHeight:1.6,margin:'16px 0'}}>{DEMO_NOTES[step][0]}</h2><div style={{fontSize:21,lineHeight:1.9,color:'#b6c6d4'}}>{DEMO_NOTES[step][1]}</div></div>
   <div style={{marginTop:36,paddingTop:20,borderTop:'1px solid #344656'}}><div style={{fontSize:15,color:'#9eb2c2'}}>この工程の記録</div><div style={{fontFamily:'monospace',fontSize:21,marginTop:14,color:'#a7d7c1'}}>{EVENTS[step].name}</div></div>
  </div>
  <div style={{position:'absolute',left:48,bottom:58,fontSize:16,color:'#9eb2c2'}}>経過秒はシナリオ値・実測や性能保証ではありません / 画面は説明順に切り替え / 映像42秒</div>
  <div style={{position:'absolute',left:48,right:48,bottom:32,height:3,background:'#344656'}}><div style={{height:3,width:`${(frame+1)/DEMO_FRAMES*100}%`,background:accent}}/></div>
 </AbsoluteFill>;
};
