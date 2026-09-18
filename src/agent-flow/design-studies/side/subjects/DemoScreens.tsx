import React from 'react';
import {SUBJECTS,type Subject} from './data';

// Semantic tokens are inherited from the customer / staff application surface.
const ink='var(--app-ink)',muted='var(--app-muted)',line='var(--app-line)',accentColor='var(--app-accent)',originalColor='#b7c9ed';
const surface='var(--app-surface)';
const staff={
 '--app-ink':'#f0f1f3','--app-muted':'#a0a3ac','--app-line':'#34363d',
 '--app-surface':'#202126','--app-accent':'#dce5f4','--app-button':'#eef1f6','--app-button-ink':'#141519',
} as React.CSSProperties;
const customer={
 '--app-ink':'#172c4b','--app-muted':'#5e7290','--app-line':'#d6e1f0',
 '--app-surface':'#ffffff','--app-accent':'#2260cc','--app-button':'#235ed0','--app-button-ink':'#ffffff',
} as React.CSSProperties;
const cases={
 Proposal:{message:'希望に合うお部屋を探したいです。条件を登録します。',items:['候補 A','候補 B','候補 C','候補 D','候補 E']},
 Inquiry:{message:'設備の不具合について相談したいです。写真を送ります。',reply:'お問い合わせを受け付けました。いただいた内容をもとに、対応方針をご案内します。'},
 Restoration:{caption:'クロス / 変色・損耗',period:'6年2か月',life:'6年'}
} as const;
const Tag:React.FC<{children:React.ReactNode;color?:string}>=({children,color=accentColor})=><span style={{fontSize:11,padding:'4px 7px',borderRadius:4,border:`1px solid ${line}`,background:surface,color,whiteSpace:'nowrap',fontWeight:600}}>{children}</span>;
const Label:React.FC<{children:React.ReactNode}>=({children})=><div style={{fontSize:11,color:muted,margin:'12px 0 6px',letterSpacing:.3}}>{children}</div>;
const Box:React.FC<{children:React.ReactNode}>=({children})=><div style={{border:`1px solid ${line}`,borderRadius:5,padding:12,background:surface}}>{children}</div>;
const CTA:React.FC<{children:React.ReactNode}>=({children})=><div style={{background:'var(--app-button)',color:'var(--app-button-ink)',borderRadius:5,padding:'11px 14px',textAlign:'center',fontSize:13,fontWeight:700,marginTop:12}}>{children}<span style={{float:'right'}}>→</span></div>;
const Field:React.FC<{label:string;value:string}>=({label,value})=><div><Label>{label}</Label><div style={{border:`1px solid ${line}`,borderRadius:5,padding:'10px 12px',fontSize:14,background:surface}}>{value}</div></div>;
const Shell:React.FC<{title:string;section:string;children:React.ReactNode}>=({title,section,children})=><div data-app-audience="staff" style={{...staff,height:462,color:ink,background:'#141519',border:'1px solid #41434b',borderRadius:8,overflow:'hidden',boxShadow:'0 12px 28px #0003'}}>
 <div style={{height:38,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',background:'#0b0c0e',borderBottom:`1px solid ${line}`}}><span style={{fontSize:10,fontWeight:700,letterSpacing:1.4}}>OPERATIONS <span style={{color:muted,fontWeight:400,letterSpacing:0}}> / 社内</span></span><span style={{fontSize:10,color:muted}}>担当者ワークスペース</span></div>
 <div style={{padding:'12px 16px 10px',borderBottom:`1px solid ${line}`}}><div style={{fontSize:9,letterSpacing:1.3,color:muted,marginBottom:7}}>CASE / {section}</div><strong style={{fontSize:19,fontWeight:600,letterSpacing:-.5}}>{title}</strong></div>
 <div style={{padding:'0 16px 16px'}}>{children}</div>
 </div>;
const Phone:React.FC<{title:string;internal?:boolean;children:React.ReactNode}>=({title,internal=false,children})=><div data-app-audience={internal?'staff':'customer'} style={{...(internal?staff:customer),width:312,height:462,margin:'0 auto',border:internal?'1px solid #454750':'1px solid #7ca4e7',borderRadius:16,overflow:'hidden',background:internal?'#141519':'#edf3fc',color:ink,position:'relative',boxShadow:'0 12px 30px #0003'}}>
 <div style={{height:24,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px',background:internal?'#0b0c0e':'#17479b',color:'#dce8ff',fontSize:9,letterSpacing:1}}><span>{internal?'FIELD WORK / 社内':'RESIDENT PORTAL / 外部'}</span><span>接続済み</span></div>
 <div style={{padding:'14px 16px',fontSize:16,fontWeight:600,background:internal?'#202126':'#205bc4',color:'#fff',borderBottom:`1px solid ${line}`}}>{title}<span style={{float:'right',fontWeight:400}}>···</span></div>
 <div style={{padding:'4px 16px 16px'}}>{children}</div>
 <div style={{position:'absolute',bottom:0,left:0,right:0,height:24,display:'flex',justifyContent:'space-around',alignItems:'center',borderTop:`1px solid ${line}`,background:surface,color:muted,fontSize:9}}><span>{internal?'記録':'ホーム'}</span><span style={{color:accentColor}}>{internal?'立会い':'メッセージ'}</span><span>{internal?'案件一覧':'マイページ'}</span></div>
 </div>;
const Bubble:React.FC<{children:React.ReactNode;out?:boolean}>=({children,out})=><div style={{margin:out?'12px 0 12px 24px':'12px 24px 12px 0',background:out?'#245dcc':'#fff',color:out?'#fff':'#172c4b',padding:12,borderRadius:out?'10px 10px 2px 10px':'2px 10px 10px 10px',fontSize:13,lineHeight:1.7,border:out?'1px solid #245dcc':'1px solid #d6e1f0'}}>{children}</div>;
const Attachment:React.FC<{caption:string}>=({caption})=><div style={{borderRadius:5,border:`1px solid ${line}`,background:surface,padding:12}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}><span style={{fontSize:10,fontWeight:700,letterSpacing:1,color:muted}}>ATTACHMENT</span><Tag>JPEG</Tag></div><div style={{fontSize:13,fontWeight:600,marginBottom:6}}>{caption}</div><div style={{fontSize:10,color:muted}}>画像ファイル · アップロード完了</div><div style={{fontSize:11,color:accentColor,borderTop:`1px solid ${line}`,marginTop:10,paddingTop:9}}>添付画像を開く <span style={{float:'right'}}>↗</span></div></div>;
const Json:React.FC<{title:string;value:Record<string,unknown>;note:string}>=({title,value,note})=>{
 const lines=JSON.stringify(value,null,2).split('\n');
 return <div data-app-audience="staff" style={{...staff,height:462,background:'#101114',border:'1px solid #41434b',borderRadius:8,overflow:'hidden'}}><div style={{padding:'14px 16px',fontSize:13,borderBottom:'1px solid #34363d',color:'#e3e6ed',background:'#1c1d22'}}>{title}<span style={{float:'right',color:'#a0a3ac',fontSize:10}}>JSON / 社内</span></div><div style={{padding:'18px 8px',fontFamily:'monospace',fontSize:13,lineHeight:1.85}}>{lines.map((l,i)=><div key={i} style={{display:'flex'}}><span style={{width:30,flexShrink:0,color:'#777b86',textAlign:'right',marginRight:12}}>{i+1}</span><span style={{color:l.includes(':')?'#a9c9ee':'#ccd0d9',whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{l}</span></div>)}</div><div style={{fontSize:12,lineHeight:1.7,color:'#a9afb9',borderTop:'1px solid #34363d',margin:'0 16px',paddingTop:14}}>{note}</div></div>;
};
const Row:React.FC<{name:string;value:string;color?:string}>=({name,value,color=ink})=><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'10px 0',borderBottom:`1px solid ${line}`,fontSize:13}}><span style={{color:muted}}>{name}</span><strong style={{color}}>{value}</strong></div>;

export const DemoAppScreen:React.FC<{subject:Subject;step:number}>=({subject,step})=>{
 const data=SUBJECTS[subject],rows=data.rows;
 let screen:React.ReactNode;
 if(subject==='Proposal'){
  const sample=cases.Proposal;
  if(step===0)screen=<Phone title="お部屋探しの相談"><Tag>相談受付</Tag><Bubble out>{sample.message}</Bubble><Bubble>ご希望をお聞かせください。</Bubble><Field label="希望条件" value="エリア・予算・間取り"/><CTA>希望条件を登録する</CTA></Phone>;
  else if(step===1)screen=<Shell title="希望条件を整理" section="CONSULTATION"><Field label="入力元" value="相談の会話"/><Field label="整理する項目" value="エリア / 予算 / 間取り"/><Field label="次の工程" value="在庫と照合して候補を検索"/><CTA>条件を候補検索へ渡す</CTA></Shell>;
  else if(step===2)screen=<Json title="AI / candidates.json" value={{order:'適合度順',candidates:sample.items,original:'保存'}} note={data.scenes[step].note}/>;
  else if(step===3||step===4)screen=<Shell title={step===3?'候補のルール照合':'審査の見込み'} section="CANDIDATES"><Label>AIの抽出 {rows[0].value} / 原値は保存</Label>{sample.items.map((name,i)=>{const excluded=i===3||i===4||(step===4&&i===2);return <div key={name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${line}`,fontSize:13}}><span style={{color:excluded?muted:ink}}>{name}</span><Tag color={excluded?'#d8b28a':accentColor}>{i===3?'成約済み':i===4?'徒歩表示の不整合':step===4&&i===2?'保証会社の基準':'候補に残す'}</Tag></div>;})}<div style={{fontSize:12,color:muted,marginTop:18}}>除外した候補も、理由とともに保持</div></Shell>;
  else if(step===5)screen=<Shell title="候補の復帰を確認" section="REVIEW"><Label>対象の候補</Label><Box><strong>候補 C</strong><div style={{fontSize:12,color:muted,marginTop:9}}>保証会社の基準で除外</div></Box><Field label="復帰理由・必須" value={data.scenes[step].fields[0][1]}/><Row name="操作できる人" value="営業担当" color="#d8b28a"/><CTA>理由を残して候補へ戻す</CTA></Shell>;
  else screen=<Phone title="ご提案のお部屋"><Tag>ご提案 {rows[4].value}</Tag>{sample.items.slice(0,3).map((name,i)=><div key={name} style={{display:'flex',gap:10,alignItems:'center',padding:12,marginTop:12,background:'#fff',border:'1px solid #d6e1f0',borderRadius:6}}><div style={{width:43,height:43,background:'#eaf1fc',color:'#235ed0',display:'grid',placeItems:'center',fontSize:20,fontWeight:500,fontFamily:'monospace'}}>{String(i+1).padStart(2,'0')}</div><div><strong style={{fontSize:14}}>{name}</strong><div style={{fontSize:10,color:muted,marginTop:5}}>詳細・条件を確認</div></div></div>)}<CTA>気になるお部屋を相談する</CTA></Phone>;
 }else if(subject==='Inquiry'){
  if(step===0)screen=<Phone title="管理窓口への相談"><Bubble out>{cases.Inquiry.message}</Bubble><Attachment caption="設備の状態 / 添付写真"/><Bubble>ご相談を受け付けました。</Bubble></Phone>;
  else if(step===1)screen=<Shell title="問い合わせの整理" section="INQUIRY"><Tag>会話・写真を受信</Tag><Field label="物件" value="問い合わせにひも付け"/><Field label="症状" value="設備の不具合 / 写真あり"/><Field label="緊急度" value="次のAI判定で確認"/></Shell>;
  else if(step===2)screen=<Json title="AI / triage.json" value={{input:'会話・写真',priority:'要確認',initial_action:['症状を確認','業者への連絡案'],writeback:'問い合わせデータ'}} note="優先度と初期対応方針を保存。連絡・一次回答の根拠として使います。"/>;
  else if(step===3)screen=<Shell title="業者への連絡案" section="OUTBOX"><Label>送信経路</Label><Tag color="#d8b28a">下書き / 承認待ち</Tag><Row name="宛先" value="業者マスタから選択"/><Row name="チャネル" value="Gmail / LINE"/><Label>本文</Label><Box><div style={{fontSize:13,lineHeight:1.9}}>設備の不具合についてご相談です。<br/>入居者からの内容と写真を共有します。<br/>対応方針の確認をお願いします。</div></Box><CTA>内容を確認して承認</CTA></Shell>;
  else if(step===4)screen=<Phone title="管理窓口からの回答"><Tag>一次回答</Tag><Bubble>{cases.Inquiry.reply}</Bubble><div style={{fontSize:11,color:muted,textAlign:'right'}}>LINEで回答</div><Label>回答の根拠</Label><Box><div style={{fontSize:13}}>AIの初期対応方針</div></Box></Phone>;
  else screen=<Shell title="判断のレビュー" section="FEEDBACK"><Label>担当者からのフィードバック</Label><Box><div style={{fontSize:13,lineHeight:1.8}}>判定内容を振り返り、次の問い合わせに使う基準を調整します。</div></Box><Row name="更新対象" value="ルール / 文脈"/><Row name="反映先" value="次の問い合わせ"/><Label>変更の記録</Label><Box><span style={{fontSize:12,color:muted}}>変更理由と判断の根拠を記録</span></Box><CTA>レビューを判断基準に反映</CTA></Shell>;
 }else{
  if(step===0)screen=<Phone title="退去立会い" internal><Tag>立会い記録</Tag><Label>室内の状態</Label><Attachment caption={cases.Restoration.caption}/><Field label="所見" value="クロスの変色・損耗を確認"/><CTA>写真と所見を保存</CTA></Phone>;
  else if(step===1)screen=<Json title="AI / classifications.json" value={{item:'クロス',classification:'故意過失',scope:rows[0].value,original:'保存'}} note={data.scenes[step].note}/>;
  else if(step===2)screen=<Shell title="ガイドライン照合" section="ASSESSMENT"><Label>原値と判断を分けて保持</Label><Row name="AIの分類" value={rows[0].value} color={originalColor}/><Row name="ルール適用後" value={rows[1].value}/><Label>判断の根拠</Label><Box><div style={{fontSize:14,lineHeight:1.8}}>{rows[1].note}</div></Box><div style={{marginTop:20,fontSize:12,color:muted}}>AIの分類は書き換えず、区分の結論を追加</div></Shell>;
  else if(step===3)screen=<Shell title="残存価値の確認" section="DEPRECIATION"><Row name="入居期間" value={cases.Restoration.period}/><Row name="クロスの基準" value={cases.Restoration.life}/><Label>経過年数</Label><div style={{height:6,background:'#d7e2df',borderRadius:5,margin:'16px 0 24px'}}><div style={{width:'100%',height:6,background:accentColor,borderRadius:5}}/></div><Box><div style={{fontSize:12,color:muted}}>残存価値</div><div style={{fontSize:42,color:accentColor,marginTop:5}}>{rows[2].value}</div></Box><div style={{fontSize:12,lineHeight:1.7,color:'#d8b28a',marginTop:18}}>材料と作業費は別に確認。<br/>残存価値1円でも作業費は残りうる。</div></Shell>;
  else if(step===4)screen=<Shell title="見積の突き合わせ" section="ESTIMATE"><Label>業者見積 / 照合項目</Label><Row name="損耗の分類" value="AI原値を参照"/><Row name="負担区分" value={rows[1].value}/><Row name="残存価値" value={rows[2].value}/><Row name="作業費" value="別途確認" color="#d8b28a"/><Label>確認事項</Label><Box><span style={{fontSize:12}}>区分・経過年数・見積の整合性</span></Box></Shell>;
  else if(step===5)screen=<Shell title="担当者の確認" section="REVIEW"><Row name="AIの原値" value={rows[0].value} color={originalColor}/><Row name="現在の確定値" value={rows[3].value}/><Label>借主負担を増額する場合</Label><Box><div style={{fontSize:13,lineHeight:1.8}}>人による判断が必要です。<br/>理由と根拠を記録してください。</div></Box><Field label="理由" value="増額する場合は必須"/></Shell>;
  else screen=<Shell title="精算書" section="SETTLEMENT"><Label>原状回復 / クロス</Label><Row name="AIの原判定" value={rows[0].value} color={originalColor}/><Row name="ガイドライン" value={rows[1].value}/><Row name="残存価値" value={rows[2].value}/><Row name="確定値" value={rows[3].value} color={accentColor}/><div style={{fontSize:12,lineHeight:1.7,color:muted,marginTop:18}}>作業費は別途確認。<br/>分類・根拠・確定値を記録に残します。</div></Shell>;
 }
 return <div data-demo-app={`${subject}-${step}`} style={{fontFamily:'"Hiragino Sans",sans-serif'}}>{screen}</div>;
};
