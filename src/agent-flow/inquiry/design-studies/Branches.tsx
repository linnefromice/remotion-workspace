import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NODES } from '../cards/constants';
import { FONT, ROLE, color, moment, pointAlong, type Layout, type Point } from './model';
import { Mark, StudyFooter } from './StudyParts';

const POS: Layout = {
  resident: [235, 485], intake: [485, 485], normalize: [735, 485], triage: [985, 485],
  dispatch: [1235, 305], approval: [1490, 305], vendor: [1750, 305], reply: [1490, 605],
  vendorDb: [1235, 765], staff: [735, 805], policy: [985, 805],
};

/**
 * 背景の太い帯。座標は POS から導くので、ノードを動かすと帯も追従する。
 * triage で手配（上）と回答（下）に分かれることを、線の太さで示している。
 */
const spine = () => {
  const [rx, ry] = POS.resident;
  const [gx] = POS.triage;
  const [dx, dy] = POS.dispatch;
  const [vx] = POS.vendor;
  const [px, py] = POS.reply;
  // ふくらみの量は目で合わせた値。グリッドから導けるものではないので、そう書いておく
  const UPPER = { out: 105, turn: 125, bulge: 85 };
  const LOWER = { out: 115, turn: 165, bulge: -40 };
  return (
    `M${rx} ${ry}H${gx}` +
    `Q${gx + UPPER.out} ${ry} ${gx + UPPER.turn} ${dy + UPPER.bulge}T${dx} ${dy}H${vx}` +
    ` M${gx} ${ry}` +
    `Q${gx + LOWER.out} ${ry} ${gx + LOWER.turn} ${py + LOWER.bulge}T${px} ${py}`
  );
};

export const InquiryBranches: React.FC = () => {
  const {step, link, progress} = moment(useCurrentFrame());
  const [sx, sy] = POS[link.from], [tx, ty] = POS[link.to];
  const points: Point[] = link.id === 'triage-staff'
    ? [[1040, 485], [1080, 485], [1080, 640], [735, 640], [735, 753]]
    : link.id === 'policy-triage'
      ? [[985, 753], [985, 710], [1080, 710], [1080, 485], [1040, 485]]
    : link.id === 'reply-resident'
    ? [[1542, 605], [1588, 605], [1588, 710], [170, 710], [170, 485], [183, 485]]
    : link.id === 'vendorDb-dispatch'
      ? [[sx + 65, sy], [1360, sy], [1360, 410], [tx, 410], [tx, ty + 50]]
      : [[sx, sy - 52], [sx, Math.min(sy, ty) - 92], [tx, Math.min(sy, ty) - 92], [tx, ty - 52]];
  const [x,y] = pointAlong(points, Math.min(1, progress / .85));
  // 色は工程ではなく主体で決める。工程で決めると、同じ主体が工程ごとに色を変えてしまう。
  // ここでは情報の受け手を採る（いまどの主体に渡っているか）
  const accent = color(link.to);
  return <AbsoluteFill style={{background:'#211f25', color:'#fff3e6', fontFamily:FONT}}>
    <div style={{position:'absolute',left:64,top:40,fontSize:17,letterSpacing:3,color:'#c7b7b1'}}>FARLEAP / INQUIRY · 07 · BRANCHES</div>
    <div style={{position:'absolute',left:64,top:84,fontSize:49,fontWeight:700}}>ひとつの相談から、ふたつの着地へ。</div>
    {/* 背景の2本の帯は主体ではなく着地のまとまり。だから主体の色は使わない */}
    <div style={{position:'absolute',left:1110,top:210,width:750,height:225,borderRadius:110,background:'#42312d'}} />
    <div style={{position:'absolute',left:1100,top:515,width:760,height:185,borderRadius:100,background:'#243d3b'}} />
    <div style={{position:'absolute',left:1510,top:190,fontSize:18,color:'#ffbd8e'}}>01 / 現地対応を手配する</div>
    <div style={{position:'absolute',left:1640,top:570,fontSize:24,color:'#80dec9',lineHeight:1.7}}>02 / 入居者へ<br/>回答を返す</div>
    <div style={{position:'absolute',left:630,top:725,width:760,height:190,borderRadius:26,background:'#302d38'}} />
    <svg width={1920} height={1080} style={{position:'absolute'}}>
      <path d={spine()} fill="none" stroke="#665554" strokeWidth={18} strokeLinecap="round" />
      <defs><marker id="branches-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke={accent} strokeWidth="1.5"/></marker></defs>
      <path d={points.map(([px,py],i)=>`${i?'L':'M'}${px} ${py}`).join(' ')} fill="none" stroke={accent} strokeWidth={3} strokeDasharray={link.dashed?'7 8':undefined} markerEnd="url(#branches-arrow)"/>
      <circle cx={x} cy={y} r={9} fill={accent}/>
    </svg>
    {NODES.map(({id})=>{const [cx,cy]=POS[id];const active=id===link.from||id===link.to;return <div key={id} style={{position:'absolute',left:cx-112,top:cy-48,width:224,textAlign:'center'}}>
      <div style={{display:'inline-flex',padding:7,borderRadius:60,background:'#211f25',border:`2px ${id==='approval'?'dashed':'solid'} ${active?accent:'#645b65'}`,transform:`scale(${active?1.08:1})`}}><Mark id={id} size={72}/></div>
      <div style={{fontSize:19,marginTop:12,fontWeight:700}}>{ROLE[id]}</div>
    </div>;})}
    <div style={{position:'absolute',left:64,top:790,width:510}}><div style={{fontSize:28,fontWeight:700,color:accent}}>{link.title}</div><div style={{fontSize:20,marginTop:16,color:'#cdbfba'}}>{link.payload}</div></div>
    <div style={{position:'absolute',left:1460,top:800,fontSize:19,lineHeight:1.9,color:'#cdbfba'}}>下書きの場合は担当者が承認。<br/>レビューで判断基準を調整し、<br/>次の問い合わせに生かす。</div>
    <StudyFooter step={step} note="太い帯は成果へのまとまり / 矢印は現在の実際の受け渡し・破線は参照や任意の工程"/>
  </AbsoluteFill>;
};
