import React from 'react';
import {SCENES} from '../../../claim-intake/side-by-side/scenes';
import {CASE} from '../../../claim-intake/side-by-side/scenario';
/** 既存7画面を拡張。CSVだけは横切れを避けて列の内容を縦に展開する。 */
export const DemoScreen:React.FC<{step:number}>=({step})=>{
 if(step===SCENES.length-1)return <div style={{fontSize:22}}>
  <div style={{fontSize:16,color:'#95aabd',marginBottom:26}}>CSV / 1行の内容を列ごとに表示</div>
  {Object.entries({id:CASE.id,urgency:CASE.resolvedUrgency,urgency_ai:CASE.aiUrgency,urgency_source:'rule',fired_rule_ids:CASE.ruleId}).map(([key,value])=><div key={key} style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:24,padding:'20px 0',borderBottom:'1px solid #354557'}}><span style={{fontFamily:'monospace',color:'#95aabd'}}>{key}</span><strong style={{color:key==='urgency_ai'?'#b69bec':'#edf3fa',fontFamily:'monospace'}}>{value}</strong></div>)}
  <div style={{marginTop:30,fontSize:20,color:'#a9c7bc'}}>原判定を消さず、追加された判断とともに残す。</div>
 </div>;
 const {Screen}=SCENES[step];
 return <div style={step===0?{display:'flex',flexDirection:'column',alignItems:'center'}:undefined}><Screen/></div>;
};
