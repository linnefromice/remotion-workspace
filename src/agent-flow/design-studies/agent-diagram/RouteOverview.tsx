import React from 'react';
import {NODES, type NodeId} from '../../inquiry/cards/constants';
import {color, pointAlong, type Layout, type Point} from './model';
import {RouteLines, type StudyLink} from './RouteLines';

const POS:Layout={resident:[60,45],intake:[210,45],normalize:[360,45],dispatch:[510,45],vendor:[660,45],
  reply:[210,130],triage:[360,130],vendorDb:[510,130],approval:[660,130],staff:[360,220],policy:[510,220]};
const LABEL:Record<NodeId,string>={resident:'入居者',intake:'受付',normalize:'データ化',dispatch:'業者連絡',vendor:'業者',reply:'一次回答',triage:'AI判定',vendorDb:'業者マスタ',approval:'承認 ※',staff:'レビュー',policy:'判断基準'};
const p=(id:NodeId,dx=0,dy=0):Point=>[POS[id][0]+dx,POS[id][1]+dy];
export function overviewRoute(edge:StudyLink):Point[]{
 const routes:Record<string,Point[]>={
  'normalize-triage':[p('normalize',-10,18),p('triage',-10,-18)],
  'triage-normalize':[p('triage',10,-18),p('normalize',10,18)],
  'vendorDb-dispatch':[p('vendorDb',0,-18),p('dispatch',0,18)],
  'dispatch-approval':[p('dispatch',48),p('dispatch',95),p('approval',-55),p('approval',-48)],
  'approval-vendor':[p('approval',0,-18),p('vendor',0,18)],
  'triage-reply':[p('triage',-48),p('reply',48)],
  'reply-resident':[p('reply',-48),p('resident',0,85),p('resident',0,18)],
  'triage-staff':[p('triage',0,18),p('staff',0,-18)],
  'policy-triage':[p('policy',0,-18),p('policy',0,-50),p('triage',48,40),p('triage',48)],
 };
 return routes[edge.id]??[p(edge.from,48),p(edge.to,-48)];
}

/** A complete, persistent graph for views whose main stage shows only a close-up. */
export const RouteOverview:React.FC<{link:StudyLink;progress:number;id:string}> = ({link,progress,id})=>{
 const accent=color(link.from,true);const [x,y]=pointAlong(overviewRoute(link),Math.min(1,progress/.85));
 return <svg viewBox="0 0 720 250" width="100%" height="100%" role="img" aria-label="全11主体・全13経路。現在以外の経路も破線で表示">
  <RouteLines activeId={link.id} pointsFor={overviewRoute} accent={accent} muted="#6d7d84" markerId={`${id}-overview-arrow`}/>
  <circle cx={x} cy={y} r={4} fill={accent}/>
  {NODES.map(({id:nodeId})=>{const [cx,cy]=POS[nodeId];const active=nodeId===link.from||nodeId===link.to;return <g key={nodeId}>
   <rect x={cx-48} y={cy-18} width={96} height={36} rx={6} fill="#fffdf8" stroke={active?accent:'#aebbbd'} strokeWidth={active?2:1}/>
   <text x={cx} y={cy+5} textAnchor="middle" fill="#30464a" fontSize={15} fontWeight={active?700:500}>{LABEL[nodeId]}</text>
  </g>;})}
 </svg>;
};
