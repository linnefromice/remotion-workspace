import { RouteLines, ROUTE_LEGEND, type StudyLink } from './RouteLines';
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NODES, type NodeId } from '../../inquiry/cards/constants';
import { ACTION, FONT, ROLE, color, moment, pointAlong, type Layout, type Point } from './model';
import { Mark, StudyFooter } from './StudyParts';

/** レーンの帯の高さと、行の中心から帯の上端までの距離。中心合わせではなく目で合わせた値 */
const LANE_H = 204;
const LANE_TOP = 88;

const POS: Layout = {
  resident: [400, 340], vendor: [1530, 340],
  intake: [400, 570], normalize: [685, 570], triage: [970, 570], dispatch: [1255, 570], reply: [1540, 570],
  approval: [400, 800], staff: [685, 800], policy: [970, 800], vendorDb: [1255, 800],
};
/** レーンは担当の境界。中心の y は POS と同じ値を2度書かないよう、代表ノードから引く */
const LANES = [
  { title: '外部チャネル', subtitle: '相談する・受け取る', at: 'resident', bg: '#193b40' },
  { title: 'エージェント', subtitle: '整理する・判断する・返す', at: 'intake', bg: '#18323c' },
  { title: '人・参照情報', subtitle: '確認する・基準を育てる', at: 'approval', bg: '#2f3439' },
] as const;

const LANE: Record<NodeId, string> = Object.fromEntries(
  (Object.keys(POS) as NodeId[]).map((id) => [
    id,
    LANES.find((lane) => POS[lane.at][1] === POS[id][1])!.title,
  ]),
) as Record<NodeId, string>;

function pointsFor(link: StudyLink): Point[] {
  const [sx, sy] = POS[link.from], [tx, ty] = POS[link.to];
  if (link.id === 'triage-normalize') return [[sx - 52, sy + 14], [tx + 52, ty + 14]];
  const sameRow = sy === ty;
  const direction = tx >= sx ? 1 : -1;
  // レーンをまたぐ線は、移動先のレーンのすぐ上の余白を通す
  const gutter = ty > sy ? ty - 116 : sy - 116;
  return  !sameRow
    ? // レーンをまたぐときは、移動先のレーンのすぐ上の余白を横に走る
      [[sx + 52, sy], [sx + 144, sy], [sx + 144, gutter], [tx - 144, gutter], [tx - 144, ty], [tx - 52, ty]]
    : Math.abs(tx - sx) > 300
      ? // 同じレーンでも離れているときは、いったん上へ逃がして他のノードを跨がない
        [[sx, sy - 52], [sx, sy - 104], [tx, ty - 104], [tx, ty - 52]]
      : [[sx + direction * 52, sy], [tx - direction * 52, ty]];
}

export const DiagramLanes: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, link, progress } = moment(frame);
  const points = pointsFor(link);
  const [x, y] = pointAlong(points, Math.min(progress / .82, 1));
  const accent = color(link.from);
  return <AbsoluteFill style={{ background: '#10262d', fontFamily: FONT, color: '#edf5f1' }}>
    <div style={{ position: 'absolute', left: 64, top: 38, color: '#a6bdc3', fontSize: 17, letterSpacing: 3 }}>INQUIRY · DESIGN STUDY 04 · LANES</div>
    <div style={{ position: 'absolute', left: 64, top: 82, fontSize: 49, fontWeight: 700 }}>担当の境界を、見えるように。</div>
    <div style={{ position: 'absolute', right: 64, top: 43, borderLeft: '3px solid #b5e4c3', paddingLeft: 24, width: 660 }}>
      <div style={{ color: '#b5e4c3', fontSize: 18 }}>{LANE[link.from]} → {LANE[link.to]}</div>
      <div style={{ fontSize: 29, marginTop: 12, fontWeight: 700 }}>{link.title}</div>
      <div style={{ fontSize: 20, color: '#aec4c9', marginTop: 10 }}>{link.payload}</div>
    </div>
    {LANES.map((lane) => (
      <div
        key={lane.title}
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          top: POS[lane.at][1] - LANE_TOP,
          height: LANE_H,
          background: lane.bg,
          borderRadius: 18,
        }}
      >
        <div style={{ position: 'absolute', left: 26, top: 55, fontSize: 23, fontWeight: 700 }}>
          {lane.title}
        </div>
        <div style={{ position: 'absolute', left: 26, top: 97, fontSize: 14, color: '#adc2c4' }}>
          {lane.subtitle}
        </div>
      </div>
    ))}
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <RouteLines activeId={link.id} pointsFor={pointsFor} accent={accent} muted="#657e86" markerId="lanes-all-arrow" />
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
    <StudyFooter step={step} note={ROUTE_LEGEND} />
  </AbsoluteFill>;
};
