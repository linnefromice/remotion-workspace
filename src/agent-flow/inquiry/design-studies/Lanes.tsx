import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NODES, type NodeId } from '../cards/constants';
import { ACTION, FONT, ROLE, color, moment, pointAlong, type Layout, type Point } from './model';
import { Mark, StudyFooter } from './StudyParts';

const POS: Layout = {
  resident: [400, 340], vendor: [1530, 340],
  intake: [400, 570], normalize: [685, 570], triage: [970, 570], dispatch: [1255, 570], reply: [1540, 570],
  approval: [400, 800], staff: [685, 800], policy: [970, 800], vendorDb: [1255, 800],
};
const LANE: Record<NodeId, string> = { resident: '外部チャネル', vendor: '外部チャネル', intake: 'エージェント', normalize: 'エージェント', triage: 'エージェント', dispatch: 'エージェント', reply: 'エージェント', approval: '人・参照情報', staff: '人・参照情報', policy: '人・参照情報', vendorDb: '人・参照情報' };

export const InquiryLanes: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, link, progress } = moment(frame);
  const [sx, sy] = POS[link.from], [tx, ty] = POS[link.to];
  const sameRow = sy === ty;
  const direction = tx >= sx ? 1 : -1;
  // Cross-lane traffic uses the empty gutter above the destination row.
  const gutter = ty > sy ? ty - 116 : sy - 116;
  const points: Point[] = sameRow
    ? Math.abs(tx - sx) > 300 ? [[sx, sy - 52], [sx, sy - 104], [tx, ty - 104], [tx, ty - 52]] : [[sx + direction * 52, sy], [tx - direction * 52, ty]]
    : [[sx + 52, sy], [sx + 144, sy], [sx + 144, gutter], [tx - 144, gutter], [tx - 144, ty], [tx - 52, ty]];
  const [x, y] = pointAlong(points, Math.min(progress / .82, 1));
  const accent = color(link.from);
  return <AbsoluteFill style={{ background: '#10262d', fontFamily: FONT, color: '#edf5f1' }}>
    <div style={{ position: 'absolute', left: 64, top: 38, color: '#a6bdc3', fontSize: 17, letterSpacing: 3 }}>FARLEAP / INQUIRY · DESIGN STUDY 04 · LANES</div>
    <div style={{ position: 'absolute', left: 64, top: 82, fontSize: 49, fontWeight: 700 }}>担当の境界を、見えるように。</div>
    <div style={{ position: 'absolute', right: 64, top: 43, borderLeft: '3px solid #b5e4c3', paddingLeft: 24, width: 660 }}>
      <div style={{ color: '#b5e4c3', fontSize: 18 }}>{LANE[link.from]} → {LANE[link.to]}</div>
      <div style={{ fontSize: 29, marginTop: 12, fontWeight: 700 }}>{link.title}</div>
      <div style={{ fontSize: 20, color: '#aec4c9', marginTop: 10 }}>{link.payload}</div>
    </div>
    {[['外部チャネル', '相談する・受け取る', 340, '#193b40'], ['エージェント', '整理する・判断する・返す', 570, '#18323c'], ['人・参照情報', '確認する・基準を育てる', 800, '#2f3439']].map(([title, subtitle, center, bg]) => <div key={title} style={{ position: 'absolute', left: 64, right: 64, top: Number(center) - 88, height: 204, background: String(bg), borderRadius: 18 }}>
      <div style={{ position: 'absolute', left: 26, top: 55, fontSize: 23, fontWeight: 700 }}>{title}</div>
      <div style={{ position: 'absolute', left: 26, top: 97, fontSize: 14, color: '#adc2c4' }}>{subtitle}</div>
    </div>)}
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <defs><marker id="lanes-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.5" /></marker></defs>
      <path markerEnd="url(#lanes-arrow)" d={points.map(([px, py], i) => `${i ? 'L' : 'M'}${px} ${py}`).join(' ')} stroke={accent} strokeWidth={3} fill="none" strokeLinejoin="round" strokeDasharray={link.dashed ? '6 8' : undefined} />
      <circle cx={x} cy={y} r={9} fill={accent} stroke="#10262d" strokeWidth={4} />
    </svg>
    {NODES.map(({ id }) => {
      const [cx, cy] = POS[id];
      const active = id === link.from || id === link.to;
      return <div key={id} style={{ position: 'absolute', left: cx - 125, top: cy - 50, width: 250, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', transform: active ? 'translateY(-5px)' : undefined }}>
          <div style={{ padding: 7, borderRadius: 60, border: `2px ${id === 'approval' ? 'dashed' : 'solid'} ${active ? color(id) : '#49636a'}` }}><Mark id={id} size={76} /></div>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 10, color: active ? '#ffffff' : '#b7cbcd' }}>{ROLE[id]}</div>
        <div style={{ fontSize: 14, marginTop: 5, color: '#a4bcc1' }}>{ACTION[id]}</div>
      </div>;
    })}
    <div style={{ position: 'absolute', left: 1480, top: 785, width: 295, color: '#c9c4bc', lineHeight: 1.9, fontSize: 18 }}>下書きは人が承認。<br />判断基準は人が調整。<br />業者マスタは参照情報。</div>
    <StudyFooter step={step} note="担当別の受け渡しビュー / 現在の接続を表示・破線は参照や任意の工程" />
  </AbsoluteFill>;
};
