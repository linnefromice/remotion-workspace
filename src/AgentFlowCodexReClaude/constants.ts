// This is a maintainability/readability refactor of `AgentFlowCodex`.
// The rendered output is intentionally byte-for-byte identical — every
// number below was reverse-engineered from the original literals and
// verified against them (see the derivation comments). Nothing was
// "improved" visually; only *how the numbers are produced* changed:
//
//   - AgentFlowCodex hardcoded each node's x/y/w/h AND each edge's full SVG
//     path string as independent literals. Moving a node meant hunting down
//     every edge string that happened to touch it and hand-editing pixels.
//   - Here, node geometry comes from a small column/row grid, and edge path
//     strings are built from that same grid (see `right`/`left`/`top`/
//     `bottom` below) plus a handful of named "lane" and "curve" constants
//     for the parts that were hand-drawn rather than grid-aligned. Moving a
//     node now moves every edge attached to it automatically.

export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const FPS = 30;

/** Frames each of the 4 steps holds the stage for. */
export const STEP_LEN = 150;
export const TOTAL_FRAMES = STEP_LEN * 4;

/** Which of the 4 steps is "current" — used to type `NodeDef.steps` /
 * `EdgeDef.step` so a typo (e.g. `step: 4`) is a compile error. */
export type StepIndex = 0 | 1 | 2 | 3;

export const COLORS = {
  bg: "#0b1a24",
  text: "#edf3f6",
  muted: "#adbdc7",
  // Signal colors — also the 4 legend entries below.
  blue: "#83cdf7",
  orange: "#f5b77c",
  green: "#8cd5ac",
  control: "#acbbc5",
  // Card surfaces: "external" (the caller's browser / a human) vs.
  // "internal" (infrastructure owned by the runtime).
  external: "#192d3b",
  externalBorder: "#526a79",
  internal: "#342f27",
  internalBorder: "#a57c50",
  internalAccentText: "#e7bf92", // an internal card's small caption label
  cloud: "#242426",
  // One-off UI accents that were previously inline hex strings scattered
  // through index.tsx.
  stepInactiveLine: "#4a5d68",
  stepInactiveText: "#94a4b0",
  stepInactiveRing: "#61737e",
  cloudflareText: "#ffc38a",
  cloudflareLogo: "#f79a32",
  tagline: "#c0b7a9",
  progressTrack: "#233540",
} as const;

export const STEPS = ["話す", "AI応対", "予約確認", "人へ引き継ぐ"] as const;
export const STEP_COLORS: readonly string[] = [
  COLORS.blue,
  COLORS.orange,
  COLORS.control,
  COLORS.green,
];

export const LEGEND: ReadonlyArray<readonly [color: string, label: string]> = [
  [COLORS.blue, "発話"],
  [COLORS.orange, "返答"],
  [COLORS.green, "有人音声"],
  [COLORS.control, "制御・業務"],
];

// Every edge's `color` is always one of the 4 legend colors, so each gets a
// stable arrowhead <marker> id. A direct map avoids re-scanning LEGEND by
// value equality (`findIndex`) on every edge, every render.
export const MARKER_ID_BY_COLOR: Readonly<Record<string, string>> = Object.fromEntries(
  LEGEND.map(([color], index) => [color, `codex-arrow-${index}`])
);

// ---------------------------------------------------------------------------
// Layout grid
//
// The reference diagram is a 4-column x 2-row grid: each column has a fixed
// x/width shared by its top-row and bottom-row card, and each row has a
// fixed y/height shared by every card in it. (Verified: every one of the 7
// cards below is exactly `{...column, ...row}` — no card has a one-off
// position.)
// ---------------------------------------------------------------------------

type Column = { x: number; w: number };
type Row = { y: number; h: number };

const COL_CLIENT = { x: 68, w: 312 }; // 利用者 / 担当者
const COL_SESSION = { x: 575, w: 348 }; // Realtime SFU / Durable Objects
const COL_BUSINESS = { x: 1040, w: 402 }; // WebSocket Adapter / Workers+D1
const COL_AI = { x: 1564, w: 288 }; // GPT-Live-1 (top row only)

const ROW_TOP = { y: 240, h: 242 };
const ROW_BOTTOM = { y: 782, h: 170 };

const cardRect = (col: Column, row: Row) => ({ x: col.x, y: row.y, w: col.w, h: row.h });

export type NodeId = "user" | "sfu" | "adapter" | "ai" | "human" | "state" | "business";

export type NodeDef = {
  id: NodeId;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Small caption above the title, e.g. "音声の中継". */
  label: string;
  /** The big product/service name, e.g. "Realtime SFU". */
  title: string;
  lines: string[];
  /** True for infrastructure the runtime owns; false/absent for the
   * caller's browser or a human. Drives card surface color + icon tint. */
  internal?: boolean;
  /** True to render the animated waveform strip inside the card. */
  wave?: boolean;
  /** Which steps light this card up. */
  steps: StepIndex[];
};

export const NODES: NodeDef[] = [
  {
    id: "user",
    ...cardRect(COL_CLIENT, ROW_TOP),
    label: "ブラウザ / アプリ",
    title: "利用者",
    lines: ["マイクで話す"],
    wave: true,
    steps: [0, 1, 3],
  },
  {
    id: "sfu",
    ...cardRect(COL_SESSION, ROW_TOP),
    label: "音声の中継",
    title: "Realtime SFU",
    lines: ["音声トラックを配信"],
    internal: true,
    wave: true,
    steps: [0, 1, 3],
  },
  {
    id: "adapter",
    ...cardRect(COL_BUSINESS, ROW_TOP),
    label: "音声の橋渡し",
    title: "WebSocket Adapter",
    lines: ["+ Workers", "音声形式・イベント変換"],
    internal: true,
    steps: [0, 1],
  },
  {
    id: "ai",
    ...cardRect(COL_AI, ROW_TOP),
    label: "OPENAI",
    title: "GPT-Live-1",
    lines: ["音声で対話する"],
    wave: true,
    steps: [0, 1, 2],
  },
  {
    id: "human",
    ...cardRect(COL_CLIENT, ROW_BOTTOM),
    label: "有人サポート",
    title: "担当者",
    lines: ["同じ通話に参加"],
    steps: [3],
  },
  {
    id: "state",
    ...cardRect(COL_SESSION, ROW_BOTTOM),
    label: "通話管理",
    title: "Durable Objects",
    lines: ["参加者・引き継ぎ状態"],
    internal: true,
    steps: [2, 3],
  },
  {
    id: "business",
    ...cardRect(COL_BUSINESS, ROW_BOTTOM),
    label: "制御・業務ロジック",
    title: "Workers + D1",
    lines: ["参加制御・予約照会 / 登録"],
    internal: true,
    steps: [2, 3],
  },
];

const nodeById = (id: NodeId): NodeDef => NODES.find((node) => node.id === id)!;
const right = (id: NodeId): number => {
  const node = nodeById(id);
  return node.x + node.w;
};
const left = (id: NodeId): number => nodeById(id).x;

// ---------------------------------------------------------------------------
// Edge lanes
//
// The four horizontal "talk"/"reply" lines in the top row, and the
// business/state control line in the bottom row, are exact grid offsets —
// every endpoint below is a node edge, nothing is eyeballed.
// ---------------------------------------------------------------------------

const TALK_LANE_Y = ROW_TOP.y + 66; // 306 — speech flows left -> right
const REPLY_LANE_Y = ROW_TOP.y + 120; // 360 — replies flow right -> left
const TOP_ROW_BOTTOM = ROW_TOP.y + ROW_TOP.h; // 482
const BOTTOM_ROW_TOP = ROW_BOTTOM.y; // 782
const BUSINESS_LANE_Y = ROW_BOTTOM.y + 84; // 866

// The two vertical "control" drops (delegate / api) and the human hand-off
// S-curves are hand-drawn in the reference image — their lane positions
// don't reduce to a clean grid formula. Named here (rather than left as
// bare numbers inside a path string) so they can still be found, reasoned
// about, and safely reused if the same lane is needed elsewhere.
const DELEGATE_DROP_X = 1714; // roughly under the GPT-Live-1 card
const DELEGATE_CORNER_R = 24;
const API_LANE_X = 1240; // ~ business card's horizontal center
const PARTICIPANTS_LANE_X = 802; // ~ between the sfu and state cards

const HUMAN_CURVE_R = 26;
// "human-in": 担当者 card curving up into the Realtime SFU card.
const HUMAN_IN_ROW_LANE_Y = ROW_BOTTOM.y + 63; // 845
const HUMAN_IN_ENTRY_X = right("user") + 48; // 428
const HUMAN_IN_CHANNEL_X = HUMAN_IN_ENTRY_X + HUMAN_CURVE_R; // 454
const HUMAN_IN_TOP_LANE_Y = ROW_TOP.y + 164; // 404
const HUMAN_IN_EXIT_X = left("sfu") - 95; // 480
// "human-out": the mirrored return path, offset so the two lines run in
// parallel instead of overlapping.
const HUMAN_OUT_TOP_LANE_Y = ROW_TOP.y + 192; // 432
const HUMAN_OUT_ENTRY_X = left("sfu") - 68; // 507
const HUMAN_OUT_CHANNEL_X = HUMAN_OUT_ENTRY_X - HUMAN_CURVE_R; // 481
const HUMAN_OUT_ROW_LANE_Y = ROW_BOTTOM.y + 87; // 869

export type EdgeDef = {
  id: string;
  /** SVG path `d` string. */
  path: string;
  color: string;
  step: StepIndex;
  dashed?: boolean;
  /** Frames after the step starts before this edge lights up. */
  delay?: number;
};

export const EDGES: EdgeDef[] = [
  // Speech travels from the browser, through the SFU/Adapter relay, to the
  // model — one segment per hop, staggered by `delay` so it visibly
  // travels the whole chain.
  { id: "talk-user-to-sfu", path: `M${right("user")} ${TALK_LANE_Y} H${left("sfu")}`, color: COLORS.blue, step: 0 },
  { id: "talk-sfu-to-adapter", path: `M${right("sfu")} ${TALK_LANE_Y} H${left("adapter")}`, color: COLORS.blue, step: 0, delay: 15 },
  { id: "talk-adapter-to-ai", path: `M${right("adapter")} ${TALK_LANE_Y} H${left("ai")}`, color: COLORS.blue, step: 0, delay: 30 },

  // The model's reply flows back the other way along a parallel lane.
  { id: "reply-ai-to-adapter", path: `M${left("ai")} ${REPLY_LANE_Y} H${right("adapter")}`, color: COLORS.orange, step: 1 },
  { id: "reply-adapter-to-sfu", path: `M${left("adapter")} ${REPLY_LANE_Y} H${right("sfu")}`, color: COLORS.orange, step: 1, delay: 15 },
  { id: "reply-sfu-to-user", path: `M${left("sfu")} ${REPLY_LANE_Y} H${right("user")}`, color: COLORS.orange, step: 1, delay: 30 },

  // Step 2: the adapter delegates the booking request down into the
  // business logic, and the business logic calls back up for call state.
  {
    id: "delegate-ai-to-business",
    path: `M${DELEGATE_DROP_X} ${TOP_ROW_BOTTOM} V${BUSINESS_LANE_Y - DELEGATE_CORNER_R} Q${DELEGATE_DROP_X} ${BUSINESS_LANE_Y} ${DELEGATE_DROP_X - DELEGATE_CORNER_R} ${BUSINESS_LANE_Y} H${right("business")}`,
    color: COLORS.control,
    step: 2,
    dashed: true,
  },
  {
    id: "api-adapter-to-business",
    path: `M${API_LANE_X} ${BOTTOM_ROW_TOP} V${TOP_ROW_BOTTOM}`,
    color: COLORS.control,
    step: 2,
    dashed: true,
    delay: 25,
  },

  // Step 3: business logic hands participant/session state to the SFU via
  // Durable Objects, and the human joins the call.
  {
    id: "state-business-to-state",
    path: `M${left("business")} ${BUSINESS_LANE_Y} H${right("state")}`,
    color: COLORS.control,
    step: 3,
    dashed: true,
  },
  {
    id: "participants-sfu-to-state",
    path: `M${PARTICIPANTS_LANE_X} ${BOTTOM_ROW_TOP} V${TOP_ROW_BOTTOM}`,
    color: COLORS.control,
    step: 3,
    dashed: true,
    delay: 15,
  },
  {
    id: "human-in",
    path: `M${right("user")} ${HUMAN_IN_ROW_LANE_Y} H${HUMAN_IN_ENTRY_X} Q${HUMAN_IN_CHANNEL_X} ${HUMAN_IN_ROW_LANE_Y} ${HUMAN_IN_CHANNEL_X} ${HUMAN_IN_ROW_LANE_Y - HUMAN_CURVE_R} V${HUMAN_IN_TOP_LANE_Y + HUMAN_CURVE_R} Q${HUMAN_IN_CHANNEL_X} ${HUMAN_IN_TOP_LANE_Y} ${HUMAN_IN_EXIT_X} ${HUMAN_IN_TOP_LANE_Y} H${left("sfu")}`,
    color: COLORS.green,
    step: 3,
    delay: 30,
  },
  {
    id: "human-out",
    path: `M${left("sfu")} ${HUMAN_OUT_TOP_LANE_Y} H${HUMAN_OUT_ENTRY_X} Q${HUMAN_OUT_CHANNEL_X} ${HUMAN_OUT_TOP_LANE_Y} ${HUMAN_OUT_CHANNEL_X} ${HUMAN_OUT_TOP_LANE_Y + HUMAN_CURVE_R} V${HUMAN_OUT_ROW_LANE_Y} Q${HUMAN_OUT_CHANNEL_X} ${HUMAN_OUT_ROW_LANE_Y + HUMAN_CURVE_R} ${HUMAN_OUT_CHANNEL_X - HUMAN_CURVE_R} ${HUMAN_OUT_ROW_LANE_Y + HUMAN_CURVE_R} H${right("human")}`,
    color: COLORS.green,
    step: 3,
    delay: 40,
  },
];
