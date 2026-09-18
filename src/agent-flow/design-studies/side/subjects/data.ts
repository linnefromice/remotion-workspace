import {PROPOSAL} from '../../../proposal/constants';
import {RESTORATION} from '../../../restoration/constants';
import {STEPS as INQUIRY_STEPS, STEP_COLORS} from '../../../inquiry/cards/constants';
import type {FlowSpec, PanelRow} from '../../../../shared/flowTheme';

export type Subject = 'Proposal' | 'Inquiry' | 'Restoration';
export type SideLayout = 'DemoDiagram' | 'SlotMinimal' | 'Stacked';
type Scene = {title:string; note:string; fields:readonly (readonly [string,string])[]};
export type SubjectData = {title:string; diagramId:string; steps:readonly string[]; colors:readonly string[]; spec?:FlowSpec; scenes:readonly Scene[]; rows:PanelRow[]; principle:string};
const scene=(title:string,note:string,...fields:(readonly [string,string])[]):Scene=>({title,note,fields});
export const SUBJECTS:Record<Subject,SubjectData> = {
 Proposal:{title:'新規契約候補者への提案',diagramId:'Proposal-IconsV2',steps:PROPOSAL.steps,colors:PROPOSAL.stepColors,spec:PROPOSAL,rows:PROPOSAL.panel.rows,principle:PROPOSAL.tagline,scenes:[
  scene('希望を会話から受け付ける','相談内容を候補抽出の出発点にする。',['窓口','LINE'],['入力','候補者の希望条件'],['次へ','希望の構造化']),
  scene('希望を検索できる条件へ','会話の希望を構造化し、在庫との照合へ渡す。',['入力','相談の会話'],['整理','希望条件'],['用途','候補検索']),
  scene('AIの候補を原値として残す',PROPOSAL.panel.subtitle,['並び','適合度順'],['保存先','candidates']),
  scene('規約と現況で候補を絞る','成約済みと徒歩表示の不整合を除外理由として残す。',['参照','規約・現況'],['除外理由','成約済み / 徒歩表示の不整合']),
  scene('審査基準を照合する','保証会社の基準による除外を、AIの並びとは別に記録する。',['参照','保証会社の基準'],['処理','候補を除外'],['保存','除外した理由']),
  scene('戻す判断は、理由と一緒に',PROPOSAL.panel.footer,['根拠','内見済みで本人が希望'],['権限','営業担当'],['必須','復帰の理由']),
  scene('提案と除外理由を記録する','提案した候補だけでなく、出さなかった理由も追える。',['出力','候補者への提案'],['記録','除外した2件の理由'])
 ]},
 Restoration:{title:'原状回復の負担区分',diagramId:'Restoration-IconsV2',steps:RESTORATION.steps,colors:RESTORATION.stepColors,spec:RESTORATION,rows:RESTORATION.panel.rows,principle:RESTORATION.tagline,scenes:[
  scene('立会いの記録を集める','損耗の状態と契約の情報を、判断の根拠として受け付ける。',['入力','立会い記録・写真'],['参照','契約の情報'],['次へ','損耗の分類']),
  scene('AIの分類を保存する',RESTORATION.panel.subtitle,['分類','故意過失'],['保存先','classifications']),
  scene('ガイドラインで区分を確定','通常損耗は貸主負担として、借主負担を下げる。',['照合','通常損耗 / 故意過失'],['変色','通常損耗 → 貸主負担']),
  scene('経過年数と残存価値を反映','残存価値1円でも、作業費は残りうる。',['入居期間','6年2か月'],['クロス','6年'],['確認','材料と作業費を分ける']),
  scene('見積を判断の根拠と突き合わせる','見積の内容と負担区分を照合する。',['入力','業者の見積'],['照合','分類・区分・残存価値'],['確認','作業費']),
  scene('人が根拠を確認する',RESTORATION.panel.footer,['確認','負担区分と見積'],['増額する場合','人の判断と理由が必要']),
  scene('根拠を精算書へ残す','分類と確定値を分けて残し、負担の理由を追える。',['出力','精算書'],['記録','分類 / 根拠 / 確定値'])
 ]},
 Inquiry:{title:'問い合わせ対応',diagramId:'Inquiry-LogoSeal',steps:INQUIRY_STEPS,colors:STEP_COLORS,principle:'判定をレビューし、ルールと文脈を次の判断へ返す',rows:[
  {label:'受付',value:'会話・写真',note:'LINEから受け付ける',color:'#71d7ef',revealStep:0},
  {label:'AI判定',value:'優先度・方針',note:'データへ書き戻す',color:'#b398f9',revealStep:2},
  {label:'業者連絡',value:'自動 / 下書き',note:'下書きの場合のみ承認',color:'#70dbb0',revealStep:3},
  {label:'一次回答',value:'LINE',note:'AIの方針をもとに返す',color:'#70dbb0',revealStep:4},
  {label:'改善',value:'ルール・文脈',note:'担当者のレビューを反映',color:'#ffb17c',revealStep:5}
 ],scenes:[
  scene('入居者からの会話を受け付ける','会話と写真を、問い合わせの入力として残す。',['窓口','LINE'],['入力','会話 / 写真']),
  scene('物件・症状・緊急度に分ける','問い合わせを構造化して、判断に使うデータにする。',['項目','物件'],['項目','症状'],['項目','緊急度']),
  scene('優先度と初期対応方針を判定','判定した方針をデータへ書き戻し、連絡と回答へ渡す。',['判断','優先度'],['判断','初期対応方針'],['保存','問い合わせデータ']),
  scene('業者を参照して連絡する','下書きの場合のみ、承認を経て送信する。',['参照','業者マスタ'],['送信先','Gmail / LINE'],['経路','自動送信 または 下書き承認']),
  scene('入居者へ一次回答を返す','AIの方針をもとにLINEで一次回答を返す。',['根拠','初期対応方針'],['宛先','入居者'],['窓口','LINE']),
  scene('レビューを次の判断へ返す','担当者がルールと文脈を調整し、次の問い合わせに反映する。',['確認者','担当者'],['更新','ルール / コンテキスト'],['反映先','次の問い合わせ'])
 ]}
};
export function sideMoment(frame:number,subject:Subject,layout:SideLayout){
 const data=SUBJECTS[subject],length=layout==='DemoDiagram'?180:120;
 const bounded=Math.max(0,Math.min(frame,data.steps.length*length-1));
 const step=Math.floor(bounded/length),local=bounded%length;
 return {step,local,length,sourceFrame:step*120+local*120/length};
}
