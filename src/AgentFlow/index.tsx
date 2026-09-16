import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadMPlusRounded1c } from "@remotion/google-fonts/MPLUSRounded1c";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";
import {
  ACTOR_CAPTION,
  BOX_HEIGHT,
  BOX_LABEL,
  BOX_LEFT,
  BOX_RADIUS,
  BOX_SUBLABEL,
  BOX_TAGLINE,
  BOX_TOP,
  BOX_WIDTH,
  CANVAS_H,
  CANVAS_W,
  COLORS,
  EDGES,
  LEGEND,
  LEGEND_ITEMS,
  NODE_H,
  NODE_RADIUS,
  NODE_W,
  NODES,
  STEP_BAR,
  STEP_COUNT,
  STEP_LABELS,
  STEP_LEN,
  type EdgeDef,
  type NodeDef,
} from "./constants";

type Point = [number, number];

// M PLUS Rounded 1c's "japanese" subset is served as many unicode-range
// chunks per weight (a CJK font covers thousands of glyphs), so this
// triggers a large number of font requests during bundling; harmless here
// since it's a one-time cost, but worth flagging (see README "詰まった点").
// It's a soft, rounded-terminal JP gothic — deliberately lighter and less
// "shouty" than the earlier Noto Sans JP / M PLUS 2 passes.
const { fontFamily: jpFontFamily } = loadMPlusRounded1c("normal", {
  weights: ["300", "400", "500"],
  subsets: ["japanese"],
  ignoreTooManyRequestsWarning: true,
});

const { fontFamily: enFontFamily } = loadQuicksand("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

// ---- Orthogonal edge routing -------------------------------------------
// Edges are defined as waypoint polylines (see constants.ts). We render them
// as straight segments joined by a small rounded corner, and place the
// traveling dot / dash animation by walking distance along the polyline —
// this keeps every connector line-of-sight axis-aligned ("直角的") instead
// of cutting diagonally across node borders or text.

const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Point, s: number): Point => [a[0] * s, a[1] * s];
const dist = (a: Point, b: Point): number => Math.hypot(b[0] - a[0], b[1] - a[1]);
const normalize = (a: Point): Point => {
  const len = Math.hypot(a[0], a[1]);
  return len === 0 ? [0, 0] : [a[0] / len, a[1] / len];
};

const CORNER_RADIUS = 26;

const roundedPath = (points: Point[]): string => {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0][0]} ${points[0][1]} L ${points[1][0]} ${points[1][1]}`;
  }
  let d = `M ${points[0][0]} ${points[0][1]} `;
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    const dirIn = normalize(sub(curr, prev));
    const dirOut = normalize(sub(next, curr));
    const r = Math.min(CORNER_RADIUS, dist(prev, curr) / 2, dist(curr, next) / 2);
    const p1 = sub(curr, scale(dirIn, r));
    const p2 = add(curr, scale(dirOut, r));
    d += `L ${p1[0]} ${p1[1]} Q ${curr[0]} ${curr[1]} ${p2[0]} ${p2[1]} `;
  }
  const last = points[points.length - 1];
  d += `L ${last[0]} ${last[1]}`;
  return d;
};

const pointAtFraction = (points: Point[], t: number): Point => {
  const clamped = Math.max(0, Math.min(1, t));
  const total = points.slice(1).reduce((sum, p, i) => sum + dist(points[i], p), 0);
  let target = total * clamped;
  for (let i = 0; i < points.length - 1; i++) {
    const segLen = dist(points[i], points[i + 1]);
    if (target <= segLen || i === points.length - 2) {
      const ratio = segLen === 0 ? 0 : target / segLen;
      return [
        points[i][0] + (points[i + 1][0] - points[i][0]) * ratio,
        points[i][1] + (points[i + 1][1] - points[i][1]) * ratio,
      ];
    }
    target -= segLen;
  }
  return points[points.length - 1];
};

// A deterministic pseudo-wave built from a couple of summed sine waves. Pure
// function of frame number, so the same frame always renders the same bar
// heights (no Math.random / Date.now anywhere).
const waveValue = (frame: number, seed: number): number => {
  const raw =
    Math.sin(frame * 0.18 + seed * 0.9) +
    Math.sin(frame * 0.07 + seed * 1.7) * 0.6;
  return (raw + 1.6) / 3.2; // normalize to roughly 0..1
};

// Edge colors actually used, so we can pre-declare one arrowhead <marker> per
// color (SVG markers don't reliably inherit a dynamic stroke color across
// headless-Chromium renders, so each color gets its own marker id).
const MARKER_COLORS = [
  COLORS.cyan,
  COLORS.violet,
  COLORS.orange,
  COLORS.green,
  COLORS.border,
];
const markerId = (color: string) => `arrow-${color.replace("#", "")}`;

export const AgentFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const stepIndex = Math.min(STEP_COUNT - 1, Math.floor(frame / STEP_LEN));
  const stepStart = stepIndex * STEP_LEN;
  const localFrame = frame - stepStart;
  const activeEdgeIndex = (stepIndex - 1 + STEP_COUNT) % STEP_COUNT;
  const edgeT = localFrame / (STEP_LEN - 1);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <BackgroundGrid />
      <DiagramLayer activeEdgeIndex={activeEdgeIndex} edgeT={edgeT} />
      <BoxLabel />
      <StepBar stepIndex={stepIndex} />
      <Legend />
      {NODES.map((node) => (
        <NodeCard
          key={node.id}
          node={node}
          frame={frame}
          isActive={node.index === stepIndex}
          localFrame={node.index === stepIndex ? localFrame : 0}
        />
      ))}
      <ActorCaptions />
    </AbsoluteFill>
  );
};

const BackgroundGrid: React.FC = () => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `linear-gradient(${COLORS.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.gridLine} 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 48%, transparent 35%, ${COLORS.bg} 96%)`,
      }}
    />
  </>
);

const DiagramLayer: React.FC<{
  activeEdgeIndex: number;
  edgeT: number;
}> = ({ activeEdgeIndex, edgeT }) => {
  const t = Math.max(0, Math.min(1, edgeT));

  return (
    <svg
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <filter id="edge-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
        </filter>
        {MARKER_COLORS.map((color) => (
          <marker
            key={color}
            id={markerId(color)}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 Z" fill={color} />
          </marker>
        ))}
      </defs>

      {EDGES.map((edge: EdgeDef, index) => {
        const isActive = index === activeEdgeIndex;
        const d = roundedPath(edge.points);
        const strokeColor = isActive ? edge.color : COLORS.border;
        const midpoint = pointAtFraction(edge.points, 0.5);

        return (
          <g key={`${edge.from}-${edge.to}`}>
            {isActive && (
              <path
                d={d}
                stroke={edge.color}
                strokeWidth={5}
                fill="none"
                opacity={0.35}
                filter="url(#edge-glow)"
              />
            )}
            <path
              d={d}
              stroke={strokeColor}
              strokeWidth={isActive ? 2 : 1.5}
              fill="none"
              strokeDasharray={isActive ? "14 10" : "8 8"}
              strokeDashoffset={isActive ? -edgeT * 240 : 0}
              opacity={isActive ? 1 : 0.55}
              strokeLinecap="round"
              markerEnd={`url(#${markerId(strokeColor)})`}
            />
            {/* A fixed relay dot on inactive edges, echoing the reference
                diagram's waypoint markers on its connector lines. */}
            {!isActive && (
              <circle
                cx={midpoint[0]}
                cy={midpoint[1]}
                r={3.5}
                fill={COLORS.border}
                opacity={0.7}
              />
            )}
          </g>
        );
      })}

      {(() => {
        const edge = EDGES[activeEdgeIndex];
        const [x, y] = pointAtFraction(edge.points, t);
        return (
          <circle
            cx={x}
            cy={y}
            r={7}
            fill={edge.color}
            filter="url(#edge-glow)"
          />
        );
      })()}

      <rect
        x={BOX_LEFT}
        y={BOX_TOP}
        width={BOX_WIDTH}
        height={BOX_HEIGHT}
        rx={BOX_RADIUS}
        fill="none"
        stroke={COLORS.boxBorder}
        strokeWidth={2}
      />
    </svg>
  );
};

const BoxLogo: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 22 22" style={{ flexShrink: 0 }}>
    <path
      d="M11 1 L20 6.5 V15.5 L11 21 L2 15.5 V6.5 Z"
      fill="none"
      stroke={COLORS.boxBorder}
      strokeWidth={2}
    />
    <circle cx={11} cy={11} r={3.5} fill={COLORS.boxBorder} />
  </svg>
);

const BoxLabel: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: BOX_LEFT + 20,
      right: CANVAS_W - BOX_LEFT - BOX_WIDTH + 20,
      top: BOX_TOP,
      transform: "translateY(-50%)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: COLORS.bg,
        padding: "2px 8px",
      }}
    >
      <BoxLogo />
      <span
        style={{
          fontFamily: enFontFamily,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "0.06em",
          color: COLORS.textMain,
        }}
      >
        {BOX_LABEL}
      </span>
      <span
        style={{
          fontFamily: enFontFamily,
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.06em",
          color: COLORS.textSub,
        }}
      >
        {BOX_SUBLABEL}
      </span>
    </div>
    <span
      style={{
        fontFamily: jpFontFamily,
        fontSize: 16,
        fontWeight: 400,
        color: COLORS.textSub,
        background: COLORS.bg,
        padding: "2px 8px",
      }}
    >
      {BOX_TAGLINE}
    </span>
  </div>
);

const StepBar: React.FC<{ stepIndex: number }> = ({ stepIndex }) => (
  <div
    style={{
      position: "absolute",
      top: STEP_BAR.top,
      left: STEP_BAR.left,
      display: "flex",
      alignItems: "center",
    }}
  >
    {STEP_LABELS.map((label, index) => {
      const isCurrent = index === stepIndex;
      const color = isCurrent ? NODES[index].color : COLORS.textSub;
      return (
        <React.Fragment key={label}>
          {index > 0 && (
            <div
              style={{
                width: 28,
                height: 2,
                background: COLORS.border,
                margin: "0 8px",
              }}
            />
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: STEP_BAR.badgeSize,
                height: STEP_BAR.badgeSize,
                borderRadius: "50%",
                border: `2px solid ${color}`,
                background: isCurrent ? color : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: enFontFamily,
                  fontSize: 15,
                  fontWeight: 600,
                  color: isCurrent ? COLORS.bg : COLORS.textSub,
                }}
              >
                {index + 1}
              </span>
            </div>
            <span
              style={{
                fontFamily: jpFontFamily,
                fontSize: 22,
                fontWeight: 500,
                color,
              }}
            >
              {label}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const ICON_STROKE = 1.6;

const NodeIcon: React.FC<{ id: NodeDef["id"]; color: string }> = ({
  id,
  color,
}) => {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: color,
    strokeWidth: ICON_STROKE,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (id) {
    case "reception":
      return (
        <svg {...common}>
          <path d="M4 5 h16 a1 1 0 0 1 1 1 v9 a1 1 0 0 1 -1 1 H9 l-4 4 v-4 H4 a1 1 0 0 1 -1 -1 V6 a1 1 0 0 1 1 -1 Z" />
        </svg>
      );
    case "match":
      return (
        <svg {...common}>
          <circle cx={10} cy={10} r={6} />
          <line x1={14.5} y1={14.5} x2={20} y2={20} />
        </svg>
      );
    case "draft":
      return (
        <svg {...common}>
          <path d="M4 20 v-3.75 L15.5 4.75 a1.5 1.5 0 0 1 2.12 0 l1.63 1.63 a1.5 1.5 0 0 1 0 2.12 L7.75 20 Z" />
          <line x1={14} y1={6.5} x2={17.5} y2={10} />
        </svg>
      );
    case "approve":
      return (
        <svg {...common}>
          <path d="M4 12.5 L9.5 18 L20 6" />
        </svg>
      );
    case "log":
      return (
        <svg {...common}>
          <line x1={4} y1={7} x2={20} y2={7} />
          <line x1={4} y1={13} x2={20} y2={13} />
          <line x1={4} y1={19} x2={14} y2={19} />
        </svg>
      );
    default:
      return null;
  }
};

const Waveform: React.FC<{ frame: number; seed: number; activeAmt: number }> = ({
  frame,
  seed,
  activeAmt,
}) => {
  const bars = 10;
  const minH = 4;
  const maxH = 18;
  return (
    <div style={{ display: "flex", gap: 4, height: maxH, alignItems: "flex-end" }}>
      {Array.from({ length: bars }).map((_, i) => {
        const norm = waveValue(frame, seed + i * 3.1);
        const h = minH + (maxH - minH) * norm * activeAmt;
        return (
          <div
            key={i}
            style={{
              width: 5,
              height: Math.max(minH, h),
              background: COLORS.violet,
              opacity: 0.35 + 0.65 * activeAmt,
              borderRadius: 1,
            }}
          />
        );
      })}
    </div>
  );
};

const NodeCard: React.FC<{
  node: NodeDef;
  frame: number;
  isActive: boolean;
  localFrame: number;
}> = ({ node, frame, isActive, localFrame }) => {
  const rampLen = 10;
  const activeAmt = isActive ? Math.min(1, localFrame / rampLen) : 0;
  const categoryBorder =
    node.category === "external" ? COLORS.externalBorder : COLORS.internalBorder;
  const categoryBg =
    node.category === "external" ? COLORS.panelExternal : COLORS.panelInternal;
  const borderColor = activeAmt > 0 ? node.color : categoryBorder;
  const iconColor = activeAmt > 0 ? node.color : COLORS.textSub;

  return (
    <div
      style={{
        position: "absolute",
        left: node.cx - NODE_W / 2,
        top: node.cy - NODE_H / 2,
        width: NODE_W,
        height: NODE_H,
        background: categoryBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: NODE_RADIUS,
        boxShadow: isActive
          ? `0 0 40px 4px ${node.color}40, 0 0 90px 18px ${node.color}1A`
          : "none",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Content is dimmed via an opaque-parent opacity so the background
          grid/edges never show through an "inactive" card. */}
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "26px 28px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          opacity: isActive ? 1 : 0.32,
          filter: isActive ? "saturate(1)" : "saturate(0.35)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: enFontFamily,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: COLORS.textSub,
              lineHeight: 1.3,
            }}
          >
            {node.en}
          </span>
          <NodeIcon id={node.id} color={iconColor} />
        </div>

        <div
          style={{
            fontFamily: jpFontFamily,
            fontSize: 42,
            fontWeight: 300,
            letterSpacing: "0.06em",
            color: "#FFFFFF",
            lineHeight: 1.1,
            marginTop: 14,
          }}
        >
          {node.jp}
        </div>

        <div
          style={{
            fontFamily: jpFontFamily,
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.textMain,
            opacity: 0.7,
            lineHeight: 1.35,
            marginTop: 8,
          }}
        >
          {node.sentence}
        </div>

        {node.waveform && (
          <div style={{ marginTop: "auto" }}>
            <Waveform frame={frame} seed={node.index * 11} activeAmt={activeAmt} />
          </div>
        )}
      </div>
    </div>
  );
};

const PersonGlyph: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div
      style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,
      }}
    />
    <div
      style={{
        width: 21,
        height: 11,
        borderRadius: "7px 7px 0 0",
        background: color,
        marginTop: 2,
      }}
    />
  </div>
);

// Total rendered height of a caption (glyph + gap + label), used to center
// it on a given cy without guessing magic numbers that drift out of sync
// when font/icon sizes change.
const CAPTION_HEIGHT = 12 + 2 + 11 + 6 + 24; // ~55

const ActorCaptions: React.FC = () => {
  const reception = NODES[0];
  const approve = NODES[3];

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: reception.cx - 100,
          top: ACTOR_CAPTION.reception.cy - CAPTION_HEIGHT / 2,
          width: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <PersonGlyph color={COLORS.textSub} />
        <span
          style={{
            fontFamily: jpFontFamily,
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.textSub,
          }}
        >
          入居者
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: ACTOR_CAPTION.approve.cx - 60,
          top: approve.cy - CAPTION_HEIGHT / 2,
          width: 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        <PersonGlyph color={COLORS.orange} />
        <span
          style={{
            fontFamily: jpFontFamily,
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.textSub,
          }}
        >
          担当者
        </span>
      </div>
    </>
  );
};

const Legend: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: LEGEND.top,
      right: LEGEND.right,
      display: "flex",
      alignItems: "center",
      gap: 24,
      height: STEP_BAR.badgeSize,
    }}
  >
    {LEGEND_ITEMS.map((item) => (
      <div
        key={item.label}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <div style={{ width: 20, height: 2, background: item.color }} />
        <span
          style={{
            fontFamily: jpFontFamily,
            fontSize: 16,
            fontWeight: 400,
            color: COLORS.textSub,
            whiteSpace: "nowrap",
          }}
        >
          {item.label}
        </span>
      </div>
    ))}
  </div>
);
