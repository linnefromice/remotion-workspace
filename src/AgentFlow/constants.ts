export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const FPS = 30;
export const STEP_LEN = 120; // 4s per step @ 30fps
export const STEP_COUNT = 5;
export const TOTAL_FRAMES = STEP_LEN * STEP_COUNT; // 600

export const COLORS = {
  bg: "#070B12",
  panel: "#0E1520",
  border: "#1E2A3A",
  gridLine: "#101A26",
  textMain: "#E8F0FA",
  textSub: "#7B90A8",
  cyan: "#22D3EE",
  violet: "#8B5CF6",
  orange: "#FF6B1A",
  green: "#34D399",
  controlGrey: "#3A4756",
  // Reference-image derived: cards are tinted by "which side of the runtime
  // boundary" they're on, independent of their per-step signal color.
  panelExternal: "#0E1A22",
  panelInternal: "#150F22",
  externalBorder: "#2E6E86",
  internalBorder: "#4A3E7A",
  boxBorder: "#7C6BB0",
};

export type NodeId = "reception" | "match" | "draft" | "approve" | "log";
export type NodeCategory = "external" | "internal";

export type NodeDef = {
  id: NodeId;
  index: number;
  num: string;
  jp: string;
  en: string;
  sentence: string;
  color: string;
  category: NodeCategory;
  waveform: boolean;
  actor?: string;
  cx: number;
  cy: number;
};

// Node box size (shared by all 5 nodes). Kept deliberately compact — an
// earlier pass used 400x380 which read as oversized on screen.
export const NODE_W = 340;
export const NODE_H = 260;
export const NODE_RADIUS = 12;
export const BOX_RADIUS = 18;

// The three nodes fully owned by the agent runtime sit in one row inside the
// group box. Reception (human->system entry) and Approve (the human gate)
// live outside the box. Gaps are generous on purpose: longer connector lines
// read more clearly as "a transition is happening" than short ones.
const BOX_MARGIN = 40;
const GAP_X = 70;
const GAP_OUT_H = 90;
const GAP_OUT_V = 150;

export const NODE_ROW_TOP = 150;
export const NODE_ROW_CY = NODE_ROW_TOP + NODE_H / 2; // 290

export const BOX_TOP = NODE_ROW_TOP - BOX_MARGIN; // 110
export const BOX_WIDTH = NODE_W * 3 + GAP_X * 2 + BOX_MARGIN * 2; // 1180
export const BOX_HEIGHT = NODE_H + BOX_MARGIN * 2; // 360
export const BOX_LEFT = Math.round(
  (CANVAS_W - (NODE_W + GAP_OUT_H + BOX_WIDTH)) / 2 + NODE_W + GAP_OUT_H
); // centers [reception][gap][box] as one block
export const BOX_RIGHT = BOX_LEFT + BOX_WIDTH;
export const BOX_BOTTOM = BOX_TOP + BOX_HEIGHT; // 470

const matchCx = BOX_LEFT + BOX_MARGIN + NODE_W / 2;
const draftCx = matchCx + NODE_W + GAP_X;
const logCx = draftCx + NODE_W + GAP_X;

const receptionCx = BOX_LEFT - GAP_OUT_H - NODE_W / 2;

const approveCy = BOX_BOTTOM + GAP_OUT_V + NODE_H / 2; // 760

export const NODES: NodeDef[] = [
  {
    id: "reception",
    index: 0,
    num: "①",
    jp: "受付",
    en: "LINE WEBHOOK",
    sentence: "LINEに入居者から連絡",
    color: COLORS.cyan,
    category: "external",
    waveform: false,
    actor: "入居者",
    cx: receptionCx,
    cy: NODE_ROW_CY,
  },
  {
    id: "match",
    index: 1,
    num: "②",
    jp: "照合",
    en: "VECTOR SEARCH / DB",
    sentence: "物件・契約を引き当てる",
    color: COLORS.violet,
    category: "internal",
    waveform: true,
    cx: matchCx,
    cy: NODE_ROW_CY,
  },
  {
    id: "draft",
    index: 2,
    num: "③",
    jp: "起案",
    en: "LLM DRAFT",
    sentence: "返信案を書く",
    color: COLORS.violet,
    category: "internal",
    waveform: true,
    cx: draftCx,
    cy: NODE_ROW_CY,
  },
  {
    id: "approve",
    index: 3,
    num: "④",
    jp: "承認",
    en: "HUMAN GATE",
    sentence: "担当者が確認して押す",
    color: COLORS.orange,
    category: "external",
    waveform: false,
    actor: "担当者",
    cx: draftCx,
    cy: approveCy,
  },
  {
    id: "log",
    index: 4,
    num: "⑤",
    jp: "記録",
    en: "AUDIT LOG",
    sentence: "送信し、履歴に残る",
    color: COLORS.green,
    category: "internal",
    waveform: false,
    cx: logCx,
    cy: NODE_ROW_CY,
  },
];

export const BOX_LABEL = "FARLEAP";
export const BOX_SUBLABEL = "/ AGENT RUNTIME";
export const BOX_TAGLINE = "入居者対応を自動化し、要所は人が確認する";

export type EdgeDef = {
  from: NodeId;
  to: NodeId;
  color: string;
  // Waypoints for an orthogonal (right-angle) route. Rendered as straight
  // segments with a small rounded corner at each interior point, so lines
  // never cut diagonally across a node's border or text.
  points: [number, number][];
};

const n = (id: NodeId) => NODES.find((node) => node.id === id)!;

// How far above the box top the return arc travels, and how far to the side
// of a node its horizontal detours run — kept generous per the "give the
// routing room to breathe" instruction.
const TOP_LANE_Y = BOX_TOP - 34;

export const EDGES: EdgeDef[] = [
  // ① -> ② : straight hop into the box
  (() => {
    const a = n("reception");
    const b = n("match");
    return {
      from: "reception" as NodeId,
      to: "match" as NodeId,
      color: COLORS.cyan,
      points: [
        [a.cx + NODE_W / 2, a.cy],
        [b.cx - NODE_W / 2, b.cy],
      ] as [number, number][],
    };
  })(),
  // ② -> ③ : straight line inside the box
  (() => {
    const a = n("match");
    const b = n("draft");
    return {
      from: "match" as NodeId,
      to: "draft" as NodeId,
      color: COLORS.violet,
      points: [
        [a.cx + NODE_W / 2, a.cy],
        [b.cx - NODE_W / 2, b.cy],
      ] as [number, number][],
    };
  })(),
  // ③ -> ④ : straight down, out of the box into the human gate
  (() => {
    const a = n("draft");
    const b = n("approve");
    return {
      from: "draft" as NodeId,
      to: "approve" as NodeId,
      color: COLORS.violet,
      points: [
        [a.cx, a.cy + NODE_H / 2],
        [b.cx, b.cy - NODE_H / 2],
      ] as [number, number][],
    };
  })(),
  // ④ -> ⑤ : right, then up — an orthogonal "L" into the log node's floor
  (() => {
    const a = n("approve");
    const b = n("log");
    return {
      from: "approve" as NodeId,
      to: "log" as NodeId,
      color: COLORS.orange,
      points: [
        [a.cx + NODE_W / 2, a.cy],
        [b.cx, a.cy],
        [b.cx, b.cy + NODE_H / 2],
      ] as [number, number][],
    };
  })(),
  // ⑤ -> ① : up, across the top lane, then down — closes the loop without
  // crossing any node.
  (() => {
    const a = n("log");
    const b = n("reception");
    return {
      from: "log" as NodeId,
      to: "reception" as NodeId,
      color: COLORS.green,
      points: [
        [a.cx, a.cy - NODE_H / 2],
        [a.cx, TOP_LANE_Y],
        [b.cx, TOP_LANE_Y],
        [b.cx, b.cy - NODE_H / 2],
      ] as [number, number][],
    };
  })(),
];

export const STEP_BAR = {
  top: 20,
  left: 60,
  badgeSize: 36,
};

export const LEGEND = {
  top: 20,
  right: 60,
};

export const ACTOR_CAPTION = {
  // Reception's caption sits above the node, in the gap between the step
  // bar and the node row — sized so it never touches the node's top edge.
  reception: { cy: STEP_BAR.top + STEP_BAR.badgeSize + 34 },
  approve: { cx: draftCx + NODE_W / 2 + GAP_OUT_H }, // beside approve node
};

export const LEGEND_ITEMS = [
  { color: COLORS.cyan, label: "入力（人→システム）" },
  { color: COLORS.violet, label: "AIの処理" },
  { color: COLORS.orange, label: "人の判断" },
  { color: COLORS.green, label: "完了・記録" },
];

export const STEP_LABELS = NODES.map((node) => node.jp);
