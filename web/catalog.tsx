import React from 'react';
import {AgentFlowInquiryLogoSeal,AgentFlowInquiryIconsV2} from '@flow/agent-flow/inquiry/icons';
import {AgentFlowClaimIntakeIconsV2} from '@flow/agent-flow/claim-intake/icons';
import {AgentFlowProposalIconsV2} from '@flow/agent-flow/proposal';
import {AgentFlowRestorationIconsV2} from '@flow/agent-flow/restoration';
import {DiagramLanes,DiagramOrbit,DiagramTransit} from '@flow/agent-flow/design-studies/agent-diagram';
import {SideDemoDiagram} from '@flow/agent-flow/design-studies/side/demo-full/Diagram';
import {SideSlotMinimal} from '@flow/agent-flow/design-studies/side/SlotExample';
import {SideStacked} from '@flow/agent-flow/design-studies/side/Stacked';
import {SubjectSide,SUBJECTS} from '@flow/agent-flow/design-studies/side/subjects';
import {STEPS as CLAIM_STEPS} from '@flow/agent-flow/claim-intake/cards/constants';
import {STEPS as INQUIRY_STEPS} from '@flow/agent-flow/inquiry/cards/constants';
export type Category='diagram'|'side'|'business';
export type Subject='ClaimIntake'|'Proposal'|'Inquiry'|'Restoration';
export type Entry={id:string;title:string;tagline:string;concept:string;features:string[];watch:string;recommended?:boolean;component:React.FC;steps:readonly string[];stepLength:number};
export const MENUS:{id:Category;title:string;label:string;intro:string}[]=[
 {id:'diagram',title:'AgentDiagram',label:'図の見せ方',intro:'同じ問い合わせ対応を、5つの図で比較。主体の見分けやすさと、流れの追いやすさを見てください。'},
 {id:'side',title:'Side',label:'図と情報の配置',intro:'図に何を添えるか、どこに置くか。題材を揃えて、3つの配置を比べられます。'},
 {id:'business',title:'BusinessContents',label:'業務の内容',intro:'4つの業務で、AI・ルール・人がどのように関わるかを確認します。'}
];
const inquiry={steps:INQUIRY_STEPS,stepLength:120};
export const DIAGRAMS:Entry[]=[
 {id:'LogoSeal',title:'LogoSeal',tagline:'役割を、統一したアイコンで読む。',concept:'主体を同じ形のアイコンで揃え、全体の経路を落ち着いて追える図。見た目のばらつきを抑え、役割とつながりを主役にします。',features:['統一した円形のアイコン','外部・AI・人の役割を色で区別','現在の工程を線と点灯で強調'],watch:'予備知識がなくても、誰が何をしているか分かるか。',recommended:true,component:AgentFlowInquiryLogoSeal,...inquiry},
 {id:'IconsV2',title:'IconsV2',tagline:'見慣れたロゴで、接点が伝わる。',concept:'LogoSealの構造にLINEやGmailなどの実ロゴを加えた版。入居者や業者との接点を、利用するサービスから直感的に理解できます。',features:['外部チャネルに実ロゴを使用','エージェント内部は共通のピクトグラム','全体図のまま工程を順にたどる'],watch:'ロゴが理解の助けになるか、図の中で強く見えすぎないか。',recommended:true,component:AgentFlowInquiryIconsV2,...inquiry},
 {id:'Lanes',title:'Lanes',tagline:'担当の境界を、横の帯で分ける。',concept:'外部チャネル・エージェント・人と参照情報を3つのレーンに分離。どの主体からどの主体へ仕事を渡すかを明確にします。',features:['3レーンで責任の範囲を整理','レーンをまたぐ受け渡しを可視化','通らない経路も破線で保持'],watch:'人とAIの境界や、承認が必要な場面を読み取れるか。',component:DiagramLanes,...inquiry},
 {id:'Orbit',title:'Orbit',tagline:'関係を一望し、循環を追う。',concept:'主体を環状に配置し、問い合わせから回答、レビューから次の判断へ戻る関係を見せます。一方向の処理だけでなく、改善の循環も捉えるための図です。',features:['環状の配置で関係を俯瞰','受け渡す情報に合わせて経路を強調','全経路を常設して位置関係を保つ'],watch:'循環の意味が伝わるか、視線の移動を追いやすいか。',component:DiagramOrbit,...inquiry},
 {id:'Transit',title:'Transit',tagline:'路線図のように、経路をたどる。',concept:'主体を駅のように配置し、情報がどの経路を通るかを見せる図。分岐や戻り道を含めて、つながりを一枚で確認できます。',features:['直交する路線で構造を整理','現在の受け渡しを点と線で表示','任意の承認や参照の経路も保持'],watch:'経路の分岐と、情報が戻る理由を迷わず説明できるか。',component:DiagramTransit,...inquiry}
];
const claim={steps:CLAIM_STEPS,stepLength:120};
export const SIDES:Entry[]=[
 {id:'DemoDiagram',title:'DemoDiagram',tagline:'全体像・工程・画面を、一緒に見る。',concept:'大きなAgentDiagramを左に置き、右に縦の工程一覧、その隣に画面と解説を配置。全体の流れと現場の情報を対応づけて確認できます。',features:['図を最も大きく表示','縦タイムラインで現在地を案内','画面の下に「この画面で見ること」'],watch:'視線が図と右側の情報の間を自然に行き来できるか。',component:SideDemoDiagram,steps:CLAIM_STEPS,stepLength:180},
 {id:'SlotMinimal',title:'SlotMinimal',tagline:'図と現場だけに、視線を集める。',concept:'図と工程ごとの画面を横並びにし、余白を縦中央に配分。下部の比較帯を省いて、俯瞰と具体例をすっきりと見比べる配置です。',features:['図と現場を縦中央揃え','下部の比較パネル・進捗バーを省略','右上に時間表示を配置'],watch:'情報量は足りているか、説明なしでも画面との関係が分かるか。',component:SideSlotMinimal,...claim},
 {id:'Stacked',title:'Stacked',tagline:'上で流れを追い、下で判断を読む。',concept:'上約70%をAgentDiagram、下約30%を判断ストーリーに使用。図と説明の横幅を揃えて、上下の視線移動で理由を確認できます。',features:['図と判断ストーリーを上下7:3に配置','背景枠は固定したまま文字のみフェード','AIの判断とその後の結論を並べる'],watch:'流れと判断理由を順に理解できるか。文字の大きさは適切か。',component:SideStacked,...claim}
];
export const BUSINESSES:Entry[]=[
 {id:'ClaimIntake',title:'ClaimIntake',tagline:'通報受付と、安全ルールの判断。',concept:'会話や音声で届いた通報を受け付け、AIの原判定と安全ルールの結論を別々に保存。担当者の確認を経て、記録と一次回答につなげます。',features:['AIのP2を残したままルールでP1へ昇格','ルールは昇格、人による降格には理由が必要','判断の根拠を出口の記録にも保持'],watch:'AIの判断だけで対応を決めない仕組みが伝わるか。',component:AgentFlowClaimIntakeIconsV2,...claim},
 {id:'Proposal',title:'Proposal',tagline:'希望に合う候補を、理由とともに提案。',concept:'候補者の希望を構造化し、AIが抽出した物件を規約・現況・審査基準で絞り込みます。除外した理由も残し、人の確定を経て提案します。',features:['AIが抽出した候補の並びを保存','ルールは候補を除外する方向に限定','人が候補を戻すときは根拠を記録'],watch:'候補を出す判断だけでなく、出さない理由も伝わるか。',component:AgentFlowProposalIconsV2,steps:SUBJECTS.Proposal.steps,stepLength:120},
 {id:'Inquiry',title:'Inquiry',tagline:'問い合わせから一次回答、次の改善へ。',concept:'入居者の相談を整理し、優先度と初期対応方針を判断。業者への連絡と一次回答に加え、担当者のレビューを次の問い合わせの判断に戻します。',features:['会話・写真を物件や症状のデータへ整理','業者連絡は自動送信または下書き承認','レビューをルールと文脈へ反映'],watch:'受付・対応・改善が一続きの仕組みとして見えるか。',component:AgentFlowInquiryLogoSeal,...inquiry},
 {id:'Restoration',title:'Restoration',tagline:'原状回復の負担を、根拠から確かめる。',concept:'立会いの記録から損耗を分類し、ガイドライン・経過年数・見積を照合。AIの分類を残しつつ、借主負担の確定値と根拠を精算書へつなげます。',features:['AIの分類と確定した負担を分けて保存','ルールは借主負担を下げる方向に限定','増額には人の判断と理由が必要'],watch:'負担を決める根拠と、人が関わる範囲を理解できるか。',component:AgentFlowRestorationIconsV2,steps:SUBJECTS.Restoration.steps,stepLength:120}
];
export const CATALOG:Record<Category,Entry[]>={diagram:DIAGRAMS,side:SIDES,business:BUSINESSES};
// Stable component identity keeps playback intact when changing speed or saving a candidate.
const sideComponents=Object.fromEntries(SIDES.flatMap(entry=>(['Proposal','Inquiry','Restoration'] as const).map(subject=>[
 `${entry.id}/${subject}`,()=> <SubjectSide subject={subject} layout={entry.id as 'DemoDiagram'|'SlotMinimal'|'Stacked'}/>
]))) as Record<string,React.FC>;
export function resolveEntry(category:Category,id:string,subject:Subject):Entry{
 const entry=CATALOG[category].find(e=>e.id===id)??CATALOG[category][0];
 if(category!=='side'||subject==='ClaimIntake')return entry;
 return {...entry,component:sideComponents[`${entry.id}/${subject}`],steps:SUBJECTS[subject].steps};
}
export function readRoute(hash:string){
 const [section,id,chosen]=hash.replace(/^#/,'').split('/');
 const category:Category=section==='side'||section==='business'?section:'diagram';
 const entry=CATALOG[category].find(e=>e.id===id)??CATALOG[category][0];
 const subject:Subject=['ClaimIntake','Proposal','Inquiry','Restoration'].includes(chosen)?chosen as Subject:'ClaimIntake';
 return {category,id:entry.id,subject,home:!hash||hash==='#'||hash==='#home'};
}
