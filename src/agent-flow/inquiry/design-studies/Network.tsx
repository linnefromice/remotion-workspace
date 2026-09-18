import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { NODES, STEPS, TOTAL_FRAMES } from '../cards/constants';
import { Actor } from './parts';
import { FONT, LINKS, ORBIT, TRANSIT, color, moment, pointAlong, route } from './model';

export const Network: React.FC<{ orbit: boolean }> = ({ orbit }) => {
  const frame = useCurrentFrame();
  const { step, link, progress } = moment(frame);
  const layout = orbit ? ORBIT : TRANSIT;
  const bg = orbit ? '#0e1c27' : '#f6f5ed';
  const ink = orbit ? '#e9f1f1' : '#183931';
  const muted = orbit ? '#9bb3c1' : '#536f64';
  const accent = color(link.from, !orbit);
  return <AbsoluteFill style={{ background: bg, color: ink, fontFamily: FONT }}>
    <div style={{ position: 'absolute', left: 64, top: 38, fontSize: 17, letterSpacing: 3, color: muted }}>FARLEAP / INQUIRY · DESIGN STUDY {orbit ? '02' : '01'}</div>
    <div style={{ position: 'absolute', left: 64, top: 74, fontSize: 48, fontWeight: 700 }}>{orbit ? '判断を中心に、つながる。' : '相談から、対応へ。'}</div>
    <div style={{ position: 'absolute', right: 64, top: 40, width: 730, borderLeft: `3px solid ${accent}`, paddingLeft: 24 }}>
      <div style={{ fontSize: 18, color: muted }}>{String(step + 1).padStart(2, '0')} / {STEPS[step]}　　{orbit ? 'ORBIT' : 'TRANSIT'}</div>
      <div style={{ fontSize: 30, fontWeight: 600, marginTop: 10 }}>{link.title}</div>
      <div style={{ fontSize: 19, color: accent, marginTop: 10 }}>{link.payload}{link.from === 'approval' || link.to === 'approval' ? ' / 下書きの場合のみ' : ''}</div>
    </div>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      {orbit ? <>
        <ellipse cx={850} cy={555} rx={480} ry={325} stroke="#263c4b" strokeWidth={1} fill="none" />
        <ellipse cx={850} cy={555} rx={235} ry={235} stroke="#263c4b" strokeWidth={1} strokeDasharray="2 12" fill="none" />
        <circle cx={850} cy={555} r={97} fill="none" stroke="#bcafff" strokeOpacity={.2} />
        <path d="M64 190 H1856" stroke="#344956" />
      </> : <>
        <rect x={64} y={278} width={1792} height={210} rx={38} fill="#e9eee4" />
        <rect x={340} y={520} width={1280} height={205} rx={38} fill="#eeebf4" />
        <rect x={550} y={755} width={820} height={192} rx={38} fill="#f1e8db" />
        <text x={65} y={246} fontSize={18} fill={muted}>01 — 受け付ける・手配する</text>
        <text x={66} y={680} fontSize={18} fill={muted}>02 — 判断して返す</text>
        <text x={65} y={880} fontSize={18} fill={muted}>03 — 人が基準を育てる</text>
      </>}
      <defs><marker id={orbit ? 'orbit-arrow' : 'transit-arrow'} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1 L9 5 L1 9" fill="none" stroke="context-stroke" strokeWidth="1.6" /></marker></defs>
      {LINKS.map((edge) => {
        const points = route(edge.id, layout, orbit);
        const active = link.id === edge.id;
        const stroke = color(edge.from, !orbit);
        const [x, y] = pointAlong(points, Math.min(1, progress / .82));
        const d = points.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px} ${py}`).join(' ');
        return <g key={edge.id}>
          <path d={d} fill="none" stroke={active ? stroke : orbit ? '#637987' : '#9baba5'} strokeWidth={active ? 4 : 2} strokeOpacity={active ? 1 : .6}
            strokeDasharray={edge.dashed ? '7 9' : undefined} strokeLinejoin="round" markerEnd={`url(#${orbit ? 'orbit-arrow' : 'transit-arrow'})`} />
          {active && <>
            <circle cx={x} cy={y} r={14} fill={bg} />
            <rect x={x - 7} y={y - 7} width={14} height={14} rx={orbit ? 7 : 3} fill={stroke} />
          </>}
        </g>;
      })}
    </svg>
    {NODES.map(({ id }) => <Actor key={id} id={id} x={layout[id][0]} y={layout[id][1]} light={!orbit}
      size={orbit && id === 'triage' ? 168 : 112} active={id === link.from || id === link.to}
      receiving={id === link.to && progress > .65 ? (progress - .65) / .35 : 0} />)}
    {orbit && <div style={{ position: 'absolute', left: 67, top: 800, width: 330, fontSize: 20, lineHeight: 1.8, color: muted }}>
      データを渡す。判断が戻る。<br />人は基準を調整し、<br />次の問い合わせへつなぐ。
    </div>}
    <div style={{ position: 'absolute', left: 64, right: 64, top: 975, display: 'flex', justifyContent: 'space-between', fontSize: 17, color: muted }}>
      <span>実線：情報の受け渡し　 /　 破線：参照・非同期・任意</span>
      <span>業者連絡：自動送信 または 下書き承認　 /　 構想の説明</span>
    </div>
    <div style={{ position: 'absolute', left: 64, right: 64, top: 1020, display: 'flex', gap: 12 }}>
      {STEPS.map((name, i) => <div key={name} style={{ flex: 1, borderTop: `3px solid ${i === step ? accent : orbit ? '#344956' : '#ced7cf'}`, paddingTop: 10, fontSize: 16, color: i === step ? ink : muted }}>{i + 1} / {name}</div>)}
    </div>
    <div style={{ position: 'absolute', bottom: 0, height: 4, width: `${(frame + 1) / TOTAL_FRAMES * 100}%`, background: accent }} />
  </AbsoluteFill>;
};
