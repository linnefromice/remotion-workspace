import { RouteOverview } from './RouteOverview';
import { ROUTE_LEGEND } from './RouteLines';
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NODES, STEPS, type NodeId } from '../../inquiry/cards/constants';
import { FONT, ROLE, color, moment, pointAlong, type Layout, type Point } from './model';
import { Mark, StudyFooter } from './StudyParts';

const POS: Layout = {
  resident: [170, 330], intake: [450, 330], normalize: [310, 570], reply: [170, 810], triage: [450, 810],
  dispatch: [1470, 330], vendorDb: [1750, 330], approval: [1610, 570], policy: [1470, 810], vendor: [1750, 810], staff: [960, 901],
};
const CONTENT = ['会話・写真を受け付ける', '物件・症状・緊急度を整理', '優先度・初期対応方針を判定', '業者参照 → 下書き承認 → 連絡', 'LINEで一次回答を返す', '人が判断基準を調整 → 次の判定へ'];
const CENTER: Point = [960, 548];
const HALF: Point = [335, 270];
function edge(point: Point): Point {
  const dx = point[0] - CENTER[0], dy = point[1] - CENTER[1];
  const factor = Math.min(HALF[0] / Math.abs(dx), HALF[1] / Math.abs(dy));
  return [CENTER[0] + dx * factor, CENTER[1] + dy * factor];
}

export const InquiryCaseboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, link, progress } = moment(frame);
  const positions: Layout = { ...POS };
  for (const { id } of NODES) {
    const [x, y] = POS[id];
    const reach = id === link.from || id === link.to ? Math.sin(progress * Math.PI) * .028 : 0;
    positions[id] = [x + (CENTER[0] - x) * reach, y + (CENTER[1] - y) * reach];
  }
  const route = (id: NodeId, receiving: boolean) => {
    const actor = positions[id], port = edge(actor);
    const dx = port[0] - actor[0], dy = port[1] - actor[1], length = Math.hypot(dx, dy);
    const start: Point = [actor[0] + dx / length * 47, actor[1] + dy / length * 47];
    const points: Point[] = id === 'resident'
      ? [[actor[0] - 47, actor[1]], [80, actor[1]], [80, 460], [CENTER[0] - HALF[0], 460]]
      : id === 'vendorDb'
        ? [[actor[0] + 47, actor[1]], [1840, actor[1]], [1840, 460], [CENTER[0] + HALF[0], 460]]
        : [start, port];
    return receiving ? points.reverse() : points;
  };
  return <AbsoluteFill style={{ background: '#e7e2eb', color: '#352f47', fontFamily: FONT }}>
    <div style={{ position: 'absolute', left: 64, top: 38, color: '#706479', fontSize: 17, letterSpacing: 3 }}>FARLEAP / INQUIRY · DESIGN STUDY 06 · CASEBOARD</div>
    <div style={{ position: 'absolute', left: 64, top: 81, fontSize: 49, fontWeight: 700 }}>案件を中心に、みんなが動く。</div>
    <div style={{ position: 'absolute', left: 64, right: 64, top: 185, textAlign: 'center', fontSize: 24, color: '#6e567e' }}>{ROLE[link.from]} → {ROLE[link.to]}　 /　{link.payload}</div>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {[link.from, link.to].map((id, i) => {
        const points = route(id, i === 1);
        const t = Math.max(0, Math.min(1, i === 0 ? progress * 2 : (progress - .5) * 2));
        const [px, py] = pointAlong(points, t);
        return <g key={`${id}-${i}`}><path d={points.map(([x, y], n) => `${n ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={color(id, true)} strokeWidth={3} strokeDasharray={link.dashed ? '6 9' : undefined} /><circle cx={px} cy={py} r={7} fill={color(id, true)} /></g>;
      })}
    </svg>
    <div style={{ position: 'absolute', left: CENTER[0] - HALF[0], top: CENTER[1] - HALF[1], width: HALF[0] * 2, height: HALF[1] * 2,
      background: '#fffcf7', border: '1px solid #c6b7cd', borderRadius: 18, padding: '26px 32px', boxShadow: '0 18px 38px #52436312' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#847487', fontSize: 15, letterSpacing: 2 }}><span>CASE 01 / 問い合わせ</span><span>説明用の案件カード</span></div>
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 15, marginBottom: 12 }}>{link.title}。</div>
      {STEPS.map((name, i) => <div key={name} style={{ display: 'flex', gap: 18, alignItems: 'center', height: 32, borderTop: '1px solid #e9e2e8', color: i > step ? '#85808a' : '#40374c', background: i === step ? '#f1eaf3' : 'transparent', padding: '0 12px' }}>
        <div style={{ width: 95, flexShrink: 0, fontSize: 17, fontWeight: 700 }}>{i + 1} {name}</div>
        <div style={{ fontSize: 16 }}>{i <= step ? CONTENT[i] : 'このあとの工程'}</div>
      </div>)}
      <div style={{fontSize:14,marginTop:8,color:'#706479'}}>全体経路 / ※ 承認は下書きの場合のみ</div>
      <div style={{height:185}}><RouteOverview link={link} progress={progress} id="caseboard"/></div>
    </div>
    {NODES.map(({ id }) => {
      const [x, y] = positions[id];
      const active = id === link.from || id === link.to;
      return <div key={id} style={{ position: 'absolute', left: x - 135, top: y - 42, width: 270, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ padding: 6, border: `2px ${id === 'approval' ? 'dashed' : 'solid'} ${active ? color(id, true) : '#c1b5c7'}`, borderRadius: 70, background: '#f7f4f8' }}><Mark id={id} size={68} light /></div></div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10 }}>{ROLE[id]}</div>
      </div>;
    })}
    <div style={{position:'absolute',left:64,top:220,fontSize:16,color:'#706479'}}>外側の線は案件への関与の演出 / 実際の接続は中央の全体経路を参照</div>
    <StudyFooter step={step} light note={ROUTE_LEGEND} />
  </AbsoluteFill>;
};
