import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CANVAS_H, CANVAS_W, COLORS, EDGES, LEGEND, NODES, STEP_COLORS, STEP_LEN, STEPS, type NodeDef } from './constants';

// All animation is derived from the frame, including SVG dash travel.
// No CSS animations or wall-clock state: seeking and rendering are identical.
const Icon: React.FC<{id: NodeDef['id']; color: string}> = ({id, color}) => {
  const paths: Record<NodeDef['id'], React.ReactNode> = {
    user: <><rect x="19" y="6" width="12" height="25" rx="6"/><path d="M12 22v4a13 13 0 0 0 26 0v-4M25 39v8"/></>,
    human: <><path d="M8 29v-7a17 17 0 0 1 34 0v16q0 9-12 9"/><rect x="7" y="25" width="9" height="15" rx="4"/><rect x="34" y="25" width="9" height="15" rx="4"/></>,
    sfu: <path d="m13 6-7 9q-3 9 12 23t24 6l6-7-12-9-6 6q-11-6-14-14l6-5Z"/>,
    adapter: <><path d="m17 8-12 17 12 17m15-34 12 17-12 17M23 8l12 17-12 17"/></>,
    ai: <>{Array.from({length: 6}, (_, i) => <path key={i} transform={`rotate(${i * 60} 25 25)`} d="M25 7c15-7 25 12 13 22L25 37 14 30V17l11-6 12 7v12"/>)}</>,
    state: <><circle cx="25" cy="25" r="20"/><ellipse cx="25" cy="25" rx="9" ry="20"/><path d="M5 25h40M25 5v40"/></>,
    business: <><ellipse cx="27" cy="10" rx="17" ry="6"/><path d="M10 10v30c0 8 34 8 34 0V10M10 21c0 8 34 8 34 0M10 32c0 8 34 8 34 0"/></>,
  };
  return <svg width="48" height="48" viewBox="0 0 50 50" fill="none" stroke={color} strokeWidth={id === 'ai' ? 2 : 3} strokeLinecap="round" strokeLinejoin="round">{paths[id]}</svg>;
};

const Waveform: React.FC<{width: number; frame: number; color: string; active: boolean}> = ({width, frame, color, active}) => (
  <svg width={width} height={34} viewBox={`0 0 ${width} 34`}>
    {Array.from({length: 23}, (_, i) => {
      const wave = (Math.sin(frame * .17 + i * 1.3) + Math.sin(frame * .09 + i * .7) + 2) / 4;
      const h = active ? 5 + wave * 25 : 5 + wave * 6;
      return <rect key={i} x={i * (width - 6) / 22} y={(34 - h) / 2} width={6} height={h} rx={3} fill={color} opacity={active ? 1 : .65}/>;
    })}
  </svg>
);

const NodeCard: React.FC<{node: NodeDef; frame: number; step: number}> = ({node, frame, step}) => {
  const active = node.steps.includes(step);
  const color = STEP_COLORS[step];
  const compact = node.h < 200;
  return <div style={{position: 'absolute', left: node.x, top: node.y, width: node.w, height: node.h, boxSizing: 'border-box', borderRadius: 26, background: node.internal ? COLORS.internal : COLORS.external, border: `2px solid ${active ? color : node.internal ? COLORS.internalBorder : COLORS.externalBorder}`, boxShadow: active ? `0 0 25px ${color}12, inset 0 0 32px ${color}06` : 'none', padding: '28px 28px', color: COLORS.text}}>
    <div style={{fontSize: 21, fontWeight: 600, color: node.internal ? '#e7bf92' : COLORS.muted}}>{node.label}</div>
    <div style={{position: 'absolute', right: 24, top: 20}}><Icon id={node.id} color={node.id === 'human' ? COLORS.green : node.internal ? COLORS.orange : COLORS.blue}/></div>
    <div style={{fontSize: node.id === 'adapter' ? 33 : compact ? 32 : 37, fontWeight: 700, letterSpacing: -.8, marginTop: compact ? 12 : 20, whiteSpace: 'nowrap'}}>{node.title}</div>
    {node.lines.map((line, i) => <div key={line} style={{fontSize: compact ? 23 : i === 1 ? 23 : 27, color: COLORS.muted, marginTop: compact ? 7 : i === 0 ? 14 : 13, whiteSpace: 'nowrap'}}>{line}</div>)}
    {node.wave && <div style={{position: 'absolute', bottom: 12, left: 28}}><Waveform width={node.w - 74} frame={frame} active={active} color={step === 1 ? COLORS.orange : step === 3 ? COLORS.green : COLORS.blue}/></div>}
  </div>;
};

const Label: React.FC<{x: number; y: number; children: React.ReactNode; dark?: boolean}> = ({x, y, children, dark}) => <div style={{position: 'absolute', left: x, top: y, fontSize: 23, color: COLORS.muted, padding: '3px 9px', background: dark ? COLORS.bg : COLORS.cloud, borderRadius: 8}}>{children}</div>;

export const AgentFlowCodex: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.min(3, Math.floor(frame / STEP_LEN));
  const localFrame = frame % STEP_LEN;
  return <AbsoluteFill style={{background: COLORS.bg, fontFamily: '"Hiragino Sans", "Noto Sans CJK JP", sans-serif', color: COLORS.text}}>
    <svg width={CANVAS_W} height={CANVAS_H} style={{position: 'absolute'}}>
      <defs>
        {LEGEND.map(([color], i) => <marker key={color} id={`codex-arrow-${i}`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1L8 5L1 9" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></marker>)}
      </defs>
      <rect x="520" y="131" width="963" height="853" rx="36" fill={COLORS.cloud} stroke={COLORS.internalBorder} strokeWidth="2.5"/>
      {EDGES.map(edge => {
        const active = edge.step === step && localFrame >= (edge.delay ?? 0);
        const colorIndex = LEGEND.findIndex(([color]) => color === edge.color);
        return <g key={edge.id}>
          <path d={edge.d} fill="none" stroke={edge.color} strokeWidth={3} opacity={active ? .6 : .26} strokeDasharray={edge.dashed ? '9 10' : undefined} strokeLinecap="round" markerEnd={`url(#codex-arrow-${colorIndex})`}/>
          {active && <>
            <path d={edge.d} fill="none" stroke={edge.color} strokeWidth={12} opacity={.09} strokeLinecap="round"/>
            <path d={edge.d} fill="none" stroke={edge.color} strokeWidth={edge.dashed ? 4 : 7} strokeDasharray={edge.dashed ? '10 30' : '1 62'} strokeDashoffset={-(localFrame - (edge.delay ?? 0)) * 4} strokeLinecap="round"/>
          </>}
        </g>;
      })}
    </svg>
    <div style={{position: 'absolute', left: 68, top: 66, display: 'flex', alignItems: 'center', gap: 15}}>
      {STEPS.map((label, i) => <React.Fragment key={label}>
        {i > 0 && <div style={{width: 39, height: 2, background: '#4a5d68'}}/>}
        <div style={{display: 'flex', alignItems: 'center', gap: 11, color: step === i ? STEP_COLORS[i] : '#94a4b0', fontSize: 24}}>
          <span style={{width: 36, height: 36, border: `2px solid ${step === i ? STEP_COLORS[i] : '#61737e'}`, background: step === i ? `${STEP_COLORS[i]}24` : 'transparent', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</span>{label}
        </div>
      </React.Fragment>)}
    </div>
    <div style={{position: 'absolute', right: 68, top: 67, display: 'flex', gap: 30}}>
      {LEGEND.map(([color, label]) => <div key={label} style={{display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted, fontSize: 22}}><span style={{width: 30, height: 4, background: color}}/>{label}</div>)}
    </div>
    <div style={{position: 'absolute', left: 553, top: 153, display: 'flex', alignItems: 'center', gap: 14, color: '#ffc38a', fontSize: 29, fontWeight: 700, letterSpacing: 1}}>
      <svg width="55" height="37" viewBox="0 0 64 40"><path d="M2 31q-1-12 11-12Q13 8 25 9 36-5 47 12q13-2 15 13l-3 7H2Z" fill="#f79a32"/><path d="M3 33h53" stroke={COLORS.cloud} strokeWidth="3"/></svg>CLOUDFLARE
    </div>
    <div style={{position: 'absolute', left: 1035, top: 163, color: '#c0b7a9', fontSize: 23}}>音声を運び、通話と業務を支える</div>
    <Label x={399} y={256} dark>WebRTC</Label>
    <Label x={1448} y={202} dark>WebSocket</Label>
    <Label x={934} y={389}>音声</Label>
    <Label x={642} y={595}>配信先・参加状態</Label>
    <Label x={1081} y={595}>接続・API制御</Label>
    <Label x={1556} y={595} dark>処理を委譲</Label>
    <Label x={1556} y={668} dark>delegation / 結果</Label>
    <div style={{position: 'absolute', left: 87, top: 650, color: COLORS.green, fontSize: 24, opacity: step === 3 ? 1 : .7}}>必要なときだけ人へ</div>
    {NODES.map(node => <NodeCard key={node.id} node={node} frame={frame} step={step}/>)}
    <div style={{position: 'absolute', left: 520, top: 1017, width: 963, height: 3, background: '#233540', borderRadius: 2}}>
      <div style={{height: '100%', width: `${(frame + 1) / (STEP_LEN * 4) * 100}%`, background: STEP_COLORS[step], borderRadius: 2}}/>
    </div>
  </AbsoluteFill>;
};
