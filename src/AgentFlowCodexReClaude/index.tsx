import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  CANVAS_H,
  CANVAS_W,
  COLORS,
  EDGES,
  LEGEND,
  MARKER_ID_BY_COLOR,
  NODES,
  STEP_COLORS,
  STEP_LEN,
  STEPS,
  TOTAL_FRAMES,
  type EdgeDef,
  type NodeDef,
  type StepIndex,
} from "./constants";

// All animation is derived from the frame, including SVG dash travel.
// No CSS animations or wall-clock state: seeking and rendering are identical.

export const Icon: React.FC<{ id: NodeDef["id"]; color: string }> = ({ id, color }) => {
  // Glyph geometry only — these are fixed icon shapes, not layout, so the
  // path data is left as literal SVG commands.
  const paths: Record<NodeDef["id"], React.ReactNode> = {
    user: (
      <>
        <rect x="19" y="6" width="12" height="25" rx="6" />
        <path d="M12 22v4a13 13 0 0 0 26 0v-4M25 39v8" />
      </>
    ),
    human: (
      <>
        <path d="M8 29v-7a17 17 0 0 1 34 0v16q0 9-12 9" />
        <rect x="7" y="25" width="9" height="15" rx="4" />
        <rect x="34" y="25" width="9" height="15" rx="4" />
      </>
    ),
    sfu: <path d="m13 6-7 9q-3 9 12 23t24 6l6-7-12-9-6 6q-11-6-14-14l6-5Z" />,
    adapter: <path d="m17 8-12 17 12 17m15-34 12 17-12 17M23 8l12 17-12 17" />,
    ai: (
      <>
        {Array.from({ length: 6 }, (_, i) => (
          <path
            key={i}
            transform={`rotate(${i * 60} 25 25)`}
            d="M25 7c15-7 25 12 13 22L25 37 14 30V17l11-6 12 7v12"
          />
        ))}
      </>
    ),
    state: (
      <>
        <circle cx="25" cy="25" r="20" />
        <ellipse cx="25" cy="25" rx="9" ry="20" />
        <path d="M5 25h40M25 5v40" />
      </>
    ),
    business: (
      <>
        <ellipse cx="27" cy="10" rx="17" ry="6" />
        <path d="M10 10v30c0 8 34 8 34 0V10M10 21c0 8 34 8 34 0M10 32c0 8 34 8 34 0" />
      </>
    ),
  };

  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 50 50"
      fill="none"
      stroke={color}
      strokeWidth={id === "ai" ? 2 : 3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[id]}
    </svg>
  );
};

export const Waveform: React.FC<{
  width: number;
  frame: number;
  color: string;
  active: boolean;
}> = ({ width, frame, color, active }) => (
  <svg width={width} height={34} viewBox={`0 0 ${width} 34`}>
    {Array.from({ length: 23 }, (_, i) => {
      // Deterministic pseudo-wave from two summed sines — pure function of
      // frame + bar index, no Math.random.
      const wave = (Math.sin(frame * 0.17 + i * 1.3) + Math.sin(frame * 0.09 + i * 0.7) + 2) / 4;
      const height = active ? 5 + wave * 25 : 5 + wave * 6;
      return (
        <rect
          key={i}
          x={(i * (width - 6)) / 22}
          y={(34 - height) / 2}
          width={6}
          height={height}
          rx={3}
          fill={color}
          opacity={active ? 1 : 0.65}
        />
      );
    })}
  </svg>
);

export const NodeCard: React.FC<{ node: NodeDef; frame: number; step: StepIndex }> = ({
  node,
  frame,
  step,
}) => {
  const active = node.steps.includes(step);
  const stepColor = STEP_COLORS[step];
  // The two bottom-row-only cards are shorter, so their text sits tighter.
  const compact = node.h < 200;
  const iconColor = node.id === "human" ? COLORS.green : node.internal ? COLORS.orange : COLORS.blue;
  const borderColor = active ? stepColor : node.internal ? COLORS.internalBorder : COLORS.externalBorder;
  const waveColor = step === 1 ? COLORS.orange : step === 3 ? COLORS.green : COLORS.blue;
  // "WebSocket Adapter" is the longest title in the deck; it gets a
  // slightly smaller size so it still fits on one line.
  const titleFontSize = node.id === "adapter" ? 33 : compact ? 32 : 37;

  const cardStyle: React.CSSProperties = {
    position: "absolute",
    left: node.x,
    top: node.y,
    width: node.w,
    height: node.h,
    boxSizing: "border-box",
    borderRadius: 26,
    background: node.internal ? COLORS.internal : COLORS.external,
    border: `2px solid ${borderColor}`,
    boxShadow: active ? `0 0 25px ${stepColor}12, inset 0 0 32px ${stepColor}06` : "none",
    padding: "28px 28px",
    color: COLORS.text,
  };

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 21, fontWeight: 600, color: node.internal ? COLORS.internalAccentText : COLORS.muted }}>
        {node.label}
      </div>
      <div style={{ position: "absolute", right: 24, top: 20 }}>
        <Icon id={node.id} color={iconColor} />
      </div>
      <div
        style={{
          fontSize: titleFontSize,
          fontWeight: 700,
          letterSpacing: -0.8,
          marginTop: compact ? 12 : 20,
          whiteSpace: "nowrap",
        }}
      >
        {node.title}
      </div>
      {node.lines.map((line, i) => (
        <div
          key={line}
          style={{
            fontSize: compact ? 23 : i === 1 ? 23 : 27,
            color: COLORS.muted,
            marginTop: compact ? 7 : i === 0 ? 14 : 13,
            whiteSpace: "nowrap",
          }}
        >
          {line}
        </div>
      ))}
      {node.wave && (
        <div style={{ position: "absolute", bottom: 12, left: 28 }}>
          <Waveform width={node.w - 74} frame={frame} active={active} color={waveColor} />
        </div>
      )}
    </div>
  );
};

export const Label: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  dark?: boolean;
}> = ({ x, y, children, dark }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      fontSize: 23,
      color: COLORS.muted,
      padding: "3px 9px",
      background: dark ? COLORS.bg : COLORS.cloud,
      borderRadius: 8,
    }}
  >
    {children}
  </div>
);

export const CloudflareLogo: React.FC = () => (
  <svg width="55" height="37" viewBox="0 0 64 40">
    <path d="M2 31q-1-12 11-12Q13 8 25 9 36-5 47 12q13-2 15 13l-3 7H2Z" fill={COLORS.cloudflareLogo} />
    <path d="M3 33h53" stroke={COLORS.cloud} strokeWidth="3" />
  </svg>
);

export const RuntimeFrame: React.FC = () => (
  // The dashed-boundary "cloud" box grouping everything the runtime owns
  // (Realtime SFU / WebSocket Adapter / Durable Objects / Workers+D1).
  <rect x="520" y="131" width="963" height="853" rx="36" fill={COLORS.cloud} stroke={COLORS.internalBorder} strokeWidth="2.5" />
);

export const ArrowheadDefs: React.FC = () => (
  <defs>
    {LEGEND.map(([color], i) => (
      <marker
        key={color}
        id={`codex-arrow-${i}`}
        markerWidth="10"
        markerHeight="10"
        refX="8"
        refY="5"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M1 1L8 5L1 9" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    ))}
  </defs>
);

export const EdgeLine: React.FC<{ edge: EdgeDef; active: boolean; localFrame: number }> = ({
  edge,
  active,
  localFrame,
}) => {
  const markerId = MARKER_ID_BY_COLOR[edge.color];
  const elapsed = localFrame - (edge.delay ?? 0);

  return (
    <g>
      <path
        d={edge.path}
        fill="none"
        stroke={edge.color}
        strokeWidth={3}
        opacity={active ? 0.6 : 0.26}
        strokeDasharray={edge.dashed ? "9 10" : undefined}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
      {active && (
        <>
          {/* Soft glow trailing the line. */}
          <path d={edge.path} fill="none" stroke={edge.color} strokeWidth={12} opacity={0.09} strokeLinecap="round" />
          {/* The traveling dash/dot signal itself. */}
          <path
            d={edge.path}
            fill="none"
            stroke={edge.color}
            strokeWidth={edge.dashed ? 4 : 7}
            strokeDasharray={edge.dashed ? "10 30" : "1 62"}
            strokeDashoffset={-elapsed * 4}
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  );
};

export const StepBar: React.FC<{ step: StepIndex }> = ({ step }) => (
  <div style={{ position: "absolute", left: 68, top: 66, display: "flex", alignItems: "center", gap: 15 }}>
    {STEPS.map((label, i) => {
      const isCurrent = step === i;
      const color = isCurrent ? STEP_COLORS[i] : COLORS.stepInactiveText;
      return (
        <React.Fragment key={label}>
          {i > 0 && <div style={{ width: 39, height: 2, background: COLORS.stepInactiveLine }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 11, color, fontSize: 24 }}>
            <span
              style={{
                width: 36,
                height: 36,
                border: `2px solid ${isCurrent ? STEP_COLORS[i] : COLORS.stepInactiveRing}`,
                background: isCurrent ? `${STEP_COLORS[i]}24` : "transparent",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </span>
            {label}
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

export const Legend: React.FC = () => (
  <div style={{ position: "absolute", right: 68, top: 67, display: "flex", gap: 30 }}>
    {LEGEND.map(([color, label]) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, color: COLORS.muted, fontSize: 22 }}>
        <span style={{ width: 30, height: 4, background: color }} />
        {label}
      </div>
    ))}
  </div>
);

export const ProgressBar: React.FC<{ frame: number; step: StepIndex }> = ({ frame, step }) => (
  <div style={{ position: "absolute", left: 520, top: 1017, width: 963, height: 3, background: COLORS.progressTrack, borderRadius: 2 }}>
    <div
      style={{
        height: "100%",
        width: `${((frame + 1) / TOTAL_FRAMES) * 100}%`,
        background: STEP_COLORS[step],
        borderRadius: 2,
      }}
    />
  </div>
);

export const AgentFlowCodexReClaude: React.FC = () => {
  const frame = useCurrentFrame();
  // frame >= 0, so floor(frame / STEP_LEN) >= 0; Math.min(3, ...) caps it at
  // 3, so this is always exactly 0 | 1 | 2 | 3.
  const step = Math.min(3, Math.floor(frame / STEP_LEN)) as StepIndex;
  const localFrame = frame % STEP_LEN;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily: '"Hiragino Sans", "Noto Sans CJK JP", sans-serif',
        color: COLORS.text,
      }}
    >
      <svg width={CANVAS_W} height={CANVAS_H} style={{ position: "absolute" }}>
        <ArrowheadDefs />
        <RuntimeFrame />
        {EDGES.map((edge) => (
          <EdgeLine
            key={edge.id}
            edge={edge}
            active={edge.step === step && localFrame >= (edge.delay ?? 0)}
            localFrame={localFrame}
          />
        ))}
      </svg>

      <StepBar step={step} />
      <Legend />

      <div
        style={{
          position: "absolute",
          left: 553,
          top: 153,
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: COLORS.cloudflareText,
          fontSize: 29,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        <CloudflareLogo />
        CLOUDFLARE
      </div>
      <div style={{ position: "absolute", left: 1035, top: 163, color: COLORS.tagline, fontSize: 23 }}>
        音声を運び、通話と業務を支える
      </div>

      <Label x={399} y={256} dark>
        WebRTC
      </Label>
      <Label x={1448} y={202} dark>
        WebSocket
      </Label>
      <Label x={934} y={389}>音声</Label>
      <Label x={642} y={595}>配信先・参加状態</Label>
      <Label x={1081} y={595}>接続・API制御</Label>
      <Label x={1556} y={595} dark>
        処理を委譲
      </Label>
      <Label x={1556} y={668} dark>
        delegation / 結果
      </Label>
      <div style={{ position: "absolute", left: 87, top: 650, color: COLORS.green, fontSize: 24, opacity: step === 3 ? 1 : 0.7 }}>
        必要なときだけ人へ
      </div>

      {NODES.map((node) => (
        <NodeCard key={node.id} node={node} frame={frame} step={step} />
      ))}

      <ProgressBar frame={frame} step={step} />
    </AbsoluteFill>
  );
};
