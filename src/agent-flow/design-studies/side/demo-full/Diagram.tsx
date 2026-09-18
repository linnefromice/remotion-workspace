import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AgentFlowClaimIntakeIcons} from '../../../claim-intake/icons';
import {STEP_COLORS, STEPS} from '../../../claim-intake/cards/constants';
import {CASE} from '../../../claim-intake/side-by-side/scenario';
import {SCENES} from '../../../claim-intake/side-by-side/scenes';
import {clockSlot} from '../../../claim-intake/side-by-side/slots';
import {DemoScreen} from './Screen';
import {demoMoment, DEMO_NOTES} from './model';

/** 図を主役にし、右側を工程リストと画面・解説の2列にまとめる。 */
export const SideDemoDiagram: React.FC = () => {
 const {step, local, sourceFrame} = demoMoment(useCurrentFrame());
 const accent = STEP_COLORS[step];
 const enter = interpolate(local, [0,16], [0,1], {extrapolateRight:'clamp'});
 return <AbsoluteFill
   style={{
     background: '#0b121b',
     color: '#edf3fa',
     fontFamily: '"Hiragino Sans", sans-serif',
     translate: '-20.7px 0px'
   }}
 >
  <div style={{height:116,background:'#152330',borderBottom:'1px solid #344656'}}/>
  <div style={{position:'absolute',left:40,top:30,fontSize:26,fontWeight:700}}><span style={{fontSize:17,color:'#9eb2c2'}}>CLAIM INTAKE · AGENT DIAGRAM</span></div>
  <div style={{position:'absolute',right:40,top:18,transform:'scale(.8)',transformOrigin:'top right'}}>{clockSlot.render({frame:sourceFrame,step,width:240,showElapsed:true})}</div>
  <div style={{position:'absolute',left:40,top:163,fontSize:18,color:'#9eb2c2'}}>AGENT DIAGRAM / 全経路と現在の工程</div>
  <div style={{position:'absolute',left:40,top:218,width:1152,height:648,border:'1px solid #344656',borderRadius:12,overflow:'hidden'}}>
   <div style={{width:1920,height:1080,transform:'scale(.6)',transformOrigin:'top left'}}><AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons hidePanel inactiveDashed frameOverride={sourceFrame}/></div>
  </div>
  <div style={{position:'absolute',left:40,top:894,fontSize:18,color:'#9eb2c2'}}>強調線が現在の工程 / その他の経路は破線で表示</div>
  <div style={{position:'absolute',left:1220,top:163,width:170}}>
   <div style={{fontSize:14,letterSpacing:1,color:'#9eb2c2',marginBottom:30}}>CASE WORKSPACE</div>
   {STEPS.map((name,i)=><div key={name} style={{height:101,boxSizing:'border-box',borderLeft:`3px ${i===step?'solid':'dashed'} ${i===step?accent:'#344656'}`,padding:'18px 12px',background:i===step?'#20313e':undefined,color:i===step?'#edf3fa':'#93a6b7'}}><div style={{fontSize:14,fontFamily:'monospace',marginBottom:10}}>{String(i+1).padStart(2,'0')}</div><div style={{fontSize:17}}>{name}</div></div>)}
  </div>
  <div style={{position:'absolute',left:1416,top:155,width:464}}>
   <div style={{fontSize:25,fontWeight:700,marginBottom:18}}>{SCENES[step].title}</div>
   <div style={{height:510,position:'relative',background:'#121e2b',border:'1px solid #354557',borderTop:`3px solid ${accent}`,borderRadius:10,overflow:'hidden'}}>
    <div style={{fontSize:14,padding:16,borderBottom:'1px solid #354557',color:'#a8bac9'}}>案件 {CASE.ticket} / {step+1} of 7</div>
    <div style={{position:'absolute',left:20,top:72,width:590,transform:'scale(.71)',transformOrigin:'top left',opacity:enter}}><DemoScreen step={step}/></div>
   </div>
   <div style={{marginTop:28,borderTop:`3px solid ${accent}`,paddingTop:20}}><div style={{fontSize:16,color:accent}}>この画面で見ること</div><h2 style={{fontSize:25,lineHeight:1.5,margin:'14px 0'}}>{DEMO_NOTES[step][0]}</h2><div style={{fontSize:20,lineHeight:1.8,color:'#b6c6d4'}}>{DEMO_NOTES[step][1]}</div></div>
  </div>
  <div style={{position:'absolute',left:40,bottom:30,fontSize:16,color:'#9eb2c2'}}>経過秒はシナリオ値・実測や性能保証ではありません / 映像42秒</div>
 </AbsoluteFill>;
};
