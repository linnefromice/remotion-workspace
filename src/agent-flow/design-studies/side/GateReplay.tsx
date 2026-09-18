import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AgentFlowClaimIntakeIcons} from '../../claim-intake/icons';
import {CASE} from '../../claim-intake/side-by-side/scenario';

const font='"Hiragino Sans", "Noto Sans CJK JP", sans-serif';
const colors=['#b59aef','#ffffff','#edaa76'];
const gateCopy=[['届いた相談を、判断へ。','水漏れと「ガスのようなにおい」。写真とともに受け付ける。'],['判断の材料をそろえる。','においの記述も残し、AIと安全ルールの判断へ渡す。'],['AIは原判定をつくる。','P2 / 翌営業日。あとから昇格しても原値を保持する。'],['安全ルールが昇格を強制。','SAFETY_GAS_ODORにより、運用上の緊急度をP1へ。'],['対応候補にも制約がある。','5本のガードレールは追加と制止のみ。候補を削らない。'],['下げる判断は、人だけ。','降格する場合は理由必須。このケースではP1を確認する。'],['別々の判断を、回答につなぐ。','AI原判定・安全ルール・人の確認を記録に残す。']];
const replay=[
 {step:6,title:'なぜ、即時対応になった？',body:'判断後の振り返り。結論から、残された根拠をたどります。',focus:3},
 {step:5,title:'人はP1を確認している。',body:'このケースでは降格していません。降格できるのは人だけで、理由が必要です。',focus:3},
 {step:4,title:'対応候補も、制約を受ける。',body:'第2段階の責任区分と次の対応。ガードレールは追加と制止のみ。',focus:2},
 {step:3,title:'P1を加えたのは、安全ルール。',body:'SAFETY_GAS_ODORが発火。AIのP2を消さず、運用上のP1を追加します。',focus:2},
 {step:2,title:'AIの原判定は、P2だった。',body:'翌営業日の原判定は、そのまま記録に残っています。',focus:1},
 {step:1,title:'根拠は、通報のこの一節。',body:'「ガスのようなにおい」。水漏れだけでなく、この記述も判断の材料です。',focus:0},
 {step:6,title:'結論と理由を、一緒に残す。',body:'入力 → AI原判定 → ルール昇格 → 人の確認。判断の違いまで追えます。',focus:3},
];
const Map:React.FC<{frame:number;caption:string}>=({frame,caption})=><>
 <div style={{position:'absolute',left:1080,top:186,fontSize:19,color:'#afbecd'}}>{caption}</div>
 <div style={{position:'absolute',left:1072,top:254,width:800,height:450,border:'1px solid #3b4d61',overflow:'hidden'}}><div style={{width:1920,height:1080,transform:'scale(0.4166666667)',transformOrigin:'top left'}}><AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons hidePanel inactiveDashed frameOverride={frame}/></div></div>
 <div style={{position:'absolute',left:1080,top:735,width:780,fontSize:20,color:'#afbecd',lineHeight:1.9}}>全経路を常設 / その他の経路は破線<br/>強調線と動く点は、説明している工程</div>
</>;
export const ClaimIntakeSideGate:React.FC=()=>{
 const frame=useCurrentFrame(),step=Math.min(6,Math.floor(frame/120));
 const actor=step===2||step===4?0:step===3?1:step===5?2:-1;
 const pulse=interpolate(frame%120,[0,24],[0,1],{extrapolateRight:'clamp'});
 return <AbsoluteFill style={{background:'#101a29',color:'#f4f3ef',fontFamily:font}}>
 <div style={{position:'absolute',left:56,top:38,letterSpacing:3,fontSize:16,color:'#a9b9cc'}}>FARLEAP / SIDE GATE · {CASE.ticket}</div>
 <h1 style={{position:'absolute',left:56,top:91,fontSize:48,margin:0}}>誰が、何を決められるか。</h1>
 <div style={{position:'absolute',left:56,top:187,fontSize:21,color:'#afbecd'}}>AI・安全ルール・人。それぞれの権限を、3つの門で示す。</div>
 <svg width="1020" height="580" style={{position:'absolute',left:28,top:242}}><path d="M 90 240 H 920" stroke="#617187" strokeWidth="2" strokeDasharray="8 9"/><path d="M 832 240 V 485 H 595" fill="none" stroke="#edaa76" strokeWidth="2" strokeDasharray="8 9"/></svg>
 {['AI','安全ルール','人'].map((name,i)=><div key={name} style={{position:'absolute',left:56+i*328,top:310,width:292,height:320,borderTop:`6px solid ${colors[i]}`,borderLeft:`1px solid ${actor===i?colors[i]:'#405066'}`,borderRight:`1px solid ${actor===i?colors[i]:'#405066'}`,background:actor===i?'#243149':'#162234',boxShadow:actor===i?`0 0 ${24*pulse}px ${colors[i]}30`:undefined,padding:24,boxSizing:'border-box'}}>
 <div style={{color:colors[i],fontSize:19}}>0{i+1} / {name}</div><div style={{fontSize:36,fontWeight:700,marginTop:28}}>{['原判定を保存','昇格を強制','確認・降格'][i]}</div><div style={{fontSize:22,lineHeight:1.8,color:'#c1cbd7',marginTop:20}}>{['P2を原値として保持','原値に運用P1を追加','降格には理由が必須'][i]}</div><div style={{fontSize:29,color:colors[i],marginTop:20}}>{i===0?(step>=2?'P2 / 保存済み':'判定待ち'):i===1?(step>=3?'P1 / 発火':'発火待ち'):(step>=5?'P1 / 確認':'確認待ち')}</div></div>)}
 <div style={{position:'absolute',left:420,top:690,padding:'18px 24px',border:'1px dashed #edaa76',color:'#edaa76',fontSize:20}}>人による降格 / 今回は未実施</div>
 <Map frame={frame} caption={`実行の流れ / ${step+1} of 7`}/>
 <div style={{position:'absolute',left:56,top:830,width:1780,borderTop:'1px solid #405066',paddingTop:28}}><div style={{fontSize:36,fontWeight:700}}>{gateCopy[step][0]}</div><div style={{fontSize:24,color:'#bac6d5',marginTop:18}}>{gateCopy[step][1]}</div></div>
 <div style={{position:'absolute',left:56,bottom:28,fontSize:16,color:'#899aaf'}}>説明用の権限図 / 想定ケース / 動画28秒</div>
 </AbsoluteFill>;
};
export const ClaimIntakeSideReplay:React.FC=()=>{
 const frame=useCurrentFrame(),chapter=Math.min(6,Math.floor(frame/120)),item=replay[chapter];
 const entries=[['01 / 入力','「ガスのようなにおい」','水漏れの通報・添付写真'],['02 / AI原判定',`${CASE.aiUrgency} · 翌営業日`,'原値は変更しない'],['03 / 安全ルール',`${CASE.resolvedUrgency} · 即時対応`,CASE.ruleId],['04 / 人の確認','P1を確認','このケースでは降格なし']];
 return <AbsoluteFill style={{background:'#e8e5df',fontFamily:font,color:'#253044'}}>
 <div style={{position:'absolute',left:1032,top:0,right:0,bottom:0,background:'#101a29'}}/>
 <div style={{position:'absolute',left:56,top:38,fontSize:16,letterSpacing:3}}>FARLEAP / SIDE REPLAY</div>
 <h1 style={{position:'absolute',left:56,top:94,fontSize:44,margin:0}}>結論から、根拠をたどる。</h1>
 <div style={{position:'absolute',left:56,top:181,fontSize:20}}>判断後の振り返り / 実行順の再生ではありません</div>
 {entries.map(([label,value,note],i)=><div key={label} style={{position:'absolute',left:56,top:266+i*151,width:916,height:130,boxSizing:'border-box',padding:'18px 26px',borderLeft:`6px solid ${i===1?'#8064ad':i===2?'#ffffff':i===3?'#be7742':'#596a80'}`,background:item.focus===i?'#ffffff':'#deddd8',opacity:item.focus===i?1:.66,transform:`translateX(${item.focus===i?12:0}px)`}}><div style={{fontSize:17,color:'#647083'}}>{label}</div><div style={{fontSize:32,fontWeight:700,marginTop:8}}>{value}</div><div style={{position:'absolute',right:24,bottom:20,fontSize:17,color:'#647083'}}>{note}</div></div>)}
 <div style={{position:'absolute',left:56,top:918,fontSize:21}}>証拠は消さず、注目する場所だけを変える。</div>
 <Map frame={item.step*120+frame%120} caption={`振り返っている工程 / ${['受付','入力確認','AI判定','ルール昇格','業務判断','人の確認','出口'][item.step]}`}/>
 <div style={{position:'absolute',left:1080,top:82,color:'#edf3fa',fontSize:30}}>REPLAY / {String(chapter+1).padStart(2,'0')}</div>
 <div style={{position:'absolute',left:1080,top:827,width:770,color:'#edf3fa'}}><div style={{fontSize:32,fontWeight:700}}>{item.title}</div><div style={{fontSize:21,lineHeight:1.8,marginTop:18,color:'#afbecd'}}>{item.body}</div></div>
 <div style={{position:'absolute',left:56,bottom:28,fontSize:16,color:'#647083'}}>説明用の根拠シート / 想定ケース / 動画28秒</div>
 </AbsoluteFill>;
};
