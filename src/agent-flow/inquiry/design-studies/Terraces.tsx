import { RouteLines, ROUTE_LEGEND, type StudyLink } from './RouteLines';
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NODES } from '../cards/constants';
import { FONT, ROLE, moment, pointAlong, type Layout, type Point } from './model';
import { Mark, StudyFooter } from './StudyParts';

const POS: Layout = {
  resident: [320, 350], intake: [560, 350], normalize: [800, 350], triage: [1040, 350],
  dispatch: [1060, 575], approval: [1320, 575], vendor: [1580, 575], reply: [800, 575],
  staff: [510, 805], policy: [770, 805], vendorDb: [1030, 805],
};

/** 段の形。奥行きの見え方を作る値で、グリッドから導けるものではない */
const DECK = { top: 115, front: 165, side: 191, skew: 60, riser: 50, label: 168 };

const DECKS = [
  { x: 155, y: 280, w: 1090, label: '01 / 相談を理解する', fill: '#e1e8e2', side: '#bdcbc1' },
  { x: 635, y: 505, w: 1110, label: '02 / 判断を届ける', fill: '#dce6ef', side: '#b7cbdc' },
  { x: 345, y: 735, w: 870, label: '03 / 判断を支える', fill: '#ebe1d7', side: '#d0bca9' },
];

/** 段1つの輪郭。上面と側面の2枚で、立体らしく見せる */
const deckPaths = (d: (typeof DECKS)[number]) => ({
  side:
    `M${d.x - DECK.skew} ${d.y + DECK.front}H${d.x + d.w - DECK.skew}` +
    `L${d.x + d.w} ${d.y + DECK.top}V${d.y + 141}` +
    `L${d.x + d.w - DECK.skew} ${d.y + DECK.side}H${d.x - DECK.skew}Z`,
  top:
    `M${d.x} ${d.y}H${d.x + d.w}V${d.y + DECK.top}` +
    `L${d.x + d.w - DECK.skew} ${d.y + DECK.front}H${d.x - DECK.skew}V${d.y + DECK.riser}Z`,
});
function pointsFor(link: StudyLink): Point[] {
 const [sx,sy]=POS[link.from],[tx,ty]=POS[link.to];
 // 行をまたぐ線は、移動先の段のすぐ上の余白を通す。
 // Math.min(sy,ty) にすると、下へ向かうときも最上段の上まで上がってしまう
 const gutter = ty - (link.id === 'triage-normalize' ? 122 : 100);
 return  sy===ty ? [[sx,sy-48],[sx,gutter],[tx,gutter],[tx,ty-48]]
   : [[sx-54,sy],[sx-120,sy],[sx-120,gutter],[tx-120,gutter],[tx-120,ty],[tx-54,ty]];
}

export const InquiryTerraces: React.FC = () => {
 const {step,link,progress}=moment(useCurrentFrame());
  const points = pointsFor(link);
 const [x,y]=pointAlong(points,Math.min(1,progress/.85));
 return <AbsoluteFill style={{background:'#f7f4ed',color:'#303d42',fontFamily:FONT}}>
  <div style={{position:'absolute',left:64,top:40,fontSize:17,letterSpacing:3,color:'#677476'}}>FARLEAP / INQUIRY · 08 · TERRACES</div>
  <div style={{position:'absolute',left:64,top:84,fontSize:49,fontWeight:700}}>判断を支える、もうひとつの層。</div>
  <div style={{position:'absolute',right:64,top:45,width:590,borderLeft:'3px solid #536b80',paddingLeft:26}}><div style={{fontSize:28,fontWeight:700}}>{link.title}</div><div style={{fontSize:20,marginTop:14,color:'#69767a'}}>{link.payload}</div></div>
  <svg width={1920} height={1080} style={{position:'absolute'}}>
   {DECKS.map((d) => {
     const shape = deckPaths(d);
     return (
       <g key={d.label}>
         <path d={shape.side} fill={d.side} />
         <path d={shape.top} fill={d.fill} />
       </g>
     );
   })}
      <RouteLines activeId={link.id} pointsFor={pointsFor} accent="#67568d" muted="#77818a" markerId="terraces-all-arrow" />
   <circle cx={x} cy={y} r={9} fill="#67568d" stroke="#f7f4ed" strokeWidth={3}/>
  </svg>
  {DECKS.map((d) => (
    <div
      key={d.label}
      style={{
        position: 'absolute',
        left: d.x - 20,
        top: d.y + DECK.label,
        fontSize: 14,
        fontWeight: 700,
        color: '#526365',
      }}
    >
      {d.label}
    </div>
  ))}
  {NODES.map(({ id }) => {
    const [cx, cy] = POS[id];
    const active = id === link.from || id === link.to;
    // 受け渡しに関わっているノードだけ、段から少し浮かせる
    const lift = active ? 10 * Math.sin(Math.PI * progress) : 0;
    return (
      <div
        key={id}
        style={{ position: 'absolute', left: cx - 112, top: cy - 50 - lift, width: 224, textAlign: 'center' }}
      >
        <div
          style={{
            display: 'inline-flex',
            padding: 8,
            borderRadius: 60,
            background: '#fffdf8',
            boxShadow: `0 ${12 + lift}px 0 -4px #34464e18`,
            border: `2px ${id === 'approval' ? 'dashed' : 'solid'} ${active ? '#67568d' : '#c1cbd0'}`,
          }}
        >
          <Mark id={id} size={68} light />
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, marginTop: 12 }}>{ROLE[id]}</div>
      </div>
    );
  })}
  <div style={{position:'absolute',left:1315,top:770,width:465,fontSize:21,lineHeight:1.9,color:'#626c70'}}>人が判定をレビューし、基準を調整。<br/>業者マスタとともに、次の判断を支える。<div style={{fontSize:16,marginTop:12}}>下書きの連絡は、担当者が確認して送る。</div></div>
    <div style={{position:'absolute',left:64,top:180,fontSize:16,color:'#677476'}}>段は役割のまとまり / 実際のシステム構成を表すものではありません</div>
  <StudyFooter step={step} light note={ROUTE_LEGEND}/>
 </AbsoluteFill>;
};
