import type { ServiceIconName } from "../../../shared/ServiceIcon";

// 設計メモ: docs/agent-flow-inquiry.md
// ノードもエッジもこのファイルのグリッドから導出する。座標を2箇所に書かない。

export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const FPS = 30;
export const STEP_LEN = 120; // 4秒
export const STEPS = ["受付", "データ化", "AI判定", "業者連絡", "一次回答", "改善"] as const;
export const STEP_COUNT = STEPS.length;
export const TOTAL_FRAMES = STEP_LEN * STEP_COUNT; // 720 = 24秒

export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

export const COLORS = {
  bg: "#0A101A",
  panelInternal: "#141020",
  panelExternal: "#0E1A24",
  borderInternal: "#3E3560",
  borderExternal: "#2A5668",
  frame: "#6B5BA0",
  grid: "#121B27",
  textMain: "#EDF3FA",
  textSub: "#8798AC",
  // 系統色
  cyan: "#22D3EE",
  violet: "#8B5CF6",
  orange: "#FF6B1A",
  green: "#34D399",
  grey: "#4A5769",
} as const;

export const STEP_COLORS: readonly string[] = [
  COLORS.cyan,
  COLORS.violet,
  COLORS.violet,
  COLORS.green,
  COLORS.green,
  COLORS.orange,
];

export const LEGEND: ReadonlyArray<readonly [color: string, label: string]> = [
  [COLORS.cyan, "入力"],
  [COLORS.violet, "AIの判断"],
  [COLORS.orange, "人の介在"],
  [COLORS.green, "送信"],
  [COLORS.grey, "参照"],
];

// --- レイアウトグリッド ----------------------------------------------------
// 表示量が多いのでノードは小さめ。フレーム内は3列2行＋ルール用の3行目。

export const NODE_W = 208;
export const NODE_H = 116;
export const GATE_W = 168;
export const GATE_H = 92;
export const NODE_RADIUS = 12;

const FRAME_MARGIN = 40;
const COL_GAP = 176;
const ROW_GAP = 90;
const ROW3_GAP = 74;
const OUTSIDE_GAP = 60;
const GATE_GAP = 50;

export const FRAME_X = 328;
export const FRAME_Y = 130;
export const FRAME_W = NODE_W * 3 + COL_GAP * 2 + FRAME_MARGIN * 2; // 1056
export const FRAME_RADIUS = 20;

const COL_A = FRAME_X + FRAME_MARGIN + NODE_W / 2; // 472
const COL_B = COL_A + NODE_W + COL_GAP; // 856
const COL_C = COL_B + NODE_W + COL_GAP; // 1240

const ROW_1 = FRAME_Y + FRAME_MARGIN + NODE_H / 2; // 228
const ROW_2 = ROW_1 + NODE_H + ROW_GAP; // 434
const ROW_3 = ROW_2 + NODE_H + ROW3_GAP; // 624

export const FRAME_H = ROW_3 + NODE_H / 2 + FRAME_MARGIN - FRAME_Y; // 592
const FRAME_BOTTOM = FRAME_Y + FRAME_H; // 722
const FRAME_RIGHT = FRAME_X + FRAME_W; // 1384

const RESIDENT_CX = FRAME_X - OUTSIDE_GAP - NODE_W / 2; // 164
const RESIDENT_CY = (ROW_1 + ROW_2) / 2; // 331
const GATE_CX = FRAME_RIGHT + GATE_GAP + GATE_W / 2; // 1518
const VENDOR_CX = GATE_CX + GATE_W / 2 + GATE_GAP + NODE_W / 2; // 1756
const STAFF_CY = FRAME_BOTTOM + 70 + NODE_H / 2; // 850

export const FRAME_LABEL = "AGENT RUNTIME";
export const FRAME_SUBLABEL = "/ INQUIRY RUNTIME";
export const FRAME_TAGLINE = "問い合わせを構造化し、判断の基準を人が育てる";

export type NodeId =
  | "resident"
  | "intake"
  | "normalize"
  | "triage"
  | "dispatch"
  | "reply"
  | "policy"
  | "vendorDb"
  | "staff"
  | "approval"
  | "vendor";

export type NodeDef = {
  id: NodeId;
  /** 通し番号。本線のノードだけ持つ */
  num?: string;
  jp: string;
  en: string;
  desc: string;
  icon: ServiceIconName;
  internal: boolean;
  /** 破線で描き「通らないことがある」を示す */
  optional?: boolean;
  steps: StepIndex[];
  cx: number;
  cy: number;
  w: number;
  h: number;
};

const card = (cx: number, cy: number) => ({ cx, cy, w: NODE_W, h: NODE_H });

export const NODES: NodeDef[] = [
  {
    id: "resident",
    jp: "入居者",
    en: "LINE",
    desc: "写真つきで相談する",
    icon: "message",
    internal: false,
    steps: [0, 4],
    ...card(RESIDENT_CX, RESIDENT_CY),
  },
  {
    id: "intake",
    num: "1",
    jp: "受付",
    en: "LINE WEBHOOK",
    desc: "会話と写真を受け取る",
    icon: "inbox",
    internal: true,
    steps: [0],
    ...card(COL_A, ROW_1),
  },
  {
    id: "normalize",
    num: "2",
    jp: "データ化",
    en: "NORMALIZE",
    desc: "物件・症状・緊急度に分解",
    icon: "branch",
    internal: true,
    steps: [1, 2],
    ...card(COL_B, ROW_1),
  },
  {
    id: "dispatch",
    num: "4",
    jp: "業者連絡",
    en: "DISPATCH",
    desc: "自動送信 または 下書き",
    icon: "phone",
    internal: true,
    steps: [3],
    ...card(COL_C, ROW_1),
  },
  {
    id: "reply",
    num: "5",
    jp: "一次回答",
    en: "REPLY",
    desc: "入居者へLINEで返す",
    icon: "message",
    internal: true,
    steps: [4],
    ...card(COL_A, ROW_2),
  },
  {
    id: "triage",
    num: "3",
    jp: "AI判定",
    en: "TRIAGE",
    desc: "優先度と初期対応方針",
    icon: "agent",
    internal: true,
    steps: [2, 5],
    ...card(COL_B, ROW_2),
  },
  {
    id: "vendorDb",
    jp: "業者マスタ",
    en: "VENDOR DB",
    desc: "対応エリア・得意分野",
    icon: "database",
    internal: true,
    steps: [3],
    // 判断基準と同じ行に置き、3行目を「参照データ層」としてまとめる
    ...card(COL_C, ROW_3),
  },
  {
    id: "policy",
    jp: "判断基準",
    en: "POLICY & CONTEXT",
    desc: "ルールと文脈を調整",
    icon: "sliders",
    internal: true,
    steps: [5],
    ...card(COL_B, ROW_3),
  },
  {
    id: "approval",
    jp: "承認",
    en: "DRAFT APPROVAL",
    desc: "下書きのときだけ",
    icon: "check",
    internal: false,
    optional: true,
    steps: [3],
    cx: GATE_CX,
    cy: ROW_1,
    w: GATE_W,
    h: GATE_H,
  },
  {
    id: "vendor",
    jp: "業者",
    en: "GMAIL / LINE",
    desc: "現地対応を手配",
    icon: "tool",
    internal: false,
    steps: [3],
    ...card(VENDOR_CX, ROW_1),
  },
  {
    id: "staff",
    jp: "担当者",
    en: "HUMAN REVIEW",
    desc: "判定を見て基準を直す",
    icon: "people",
    internal: false,
    steps: [5],
    ...card(COL_B, STAFF_CY),
  },
];

const byId = (id: NodeId): NodeDef => NODES.find((n) => n.id === id)!;
const left = (id: NodeId) => byId(id).cx - byId(id).w / 2;
const right = (id: NodeId) => byId(id).cx + byId(id).w / 2;
const top = (id: NodeId) => byId(id).cy - byId(id).h / 2;
const bottom = (id: NodeId) => byId(id).cy + byId(id).h / 2;
const cx = (id: NodeId) => byId(id).cx;
const cy = (id: NodeId) => byId(id).cy;

export type Point = [number, number];

export type EdgeDef = {
  id: string;
  points: Point[];
  color: string;
  step: StepIndex;
  /** 参照・非同期・任意のいずれか。実線は「必ずその場で流れる」ものだけ */
  dashed?: boolean;
  delay?: number;
};

// ②と③のあいだは往復するので、2本を左右にずらして並走させる
const DUPLEX_OFFSET = 24;
// 改善サイクルの下り線は「判断基準」を避けて左の空きチャネルを通す
const FEEDBACK_CHANNEL_X = 700;
const FEEDBACK_TURN_Y = 530;
// 入居者の出入口は上下にずらして、行きと帰りが重ならないようにする
const RESIDENT_PORT_OFFSET = 14;
// 行きも帰りもフレーム枠の外側の同じ縦チャネルを使う。y の範囲が重ならないので
// 1本の通り道に見えて、かつ枠線とも十分離れる。
const RESIDENT_CHANNEL_X = 298;

export const EDGES: EdgeDef[] = [
  {
    id: "resident-intake",
    points: [
      [right("resident"), cy("resident") - RESIDENT_PORT_OFFSET],
      [RESIDENT_CHANNEL_X, cy("resident") - RESIDENT_PORT_OFFSET],
      [RESIDENT_CHANNEL_X, cy("intake")],
      [left("intake"), cy("intake")],
    ],
    color: COLORS.cyan,
    step: 0,
  },
  {
    id: "intake-normalize",
    points: [
      [right("intake"), cy("intake")],
      [left("normalize"), cy("normalize")],
    ],
    color: COLORS.cyan,
    step: 1,
  },
  {
    id: "normalize-triage",
    points: [
      [cx("normalize") - DUPLEX_OFFSET, bottom("normalize")],
      [cx("triage") - DUPLEX_OFFSET, top("triage")],
    ],
    color: COLORS.violet,
    step: 2,
  },
  {
    id: "triage-normalize",
    points: [
      [cx("triage") + DUPLEX_OFFSET, top("triage")],
      [cx("normalize") + DUPLEX_OFFSET, bottom("normalize")],
    ],
    color: COLORS.violet,
    step: 2,
    delay: 45,
  },
  {
    id: "normalize-dispatch",
    points: [
      [right("normalize"), cy("normalize")],
      [left("dispatch"), cy("dispatch")],
    ],
    color: COLORS.violet,
    step: 3,
  },
  {
    id: "vendorDb-dispatch",
    points: [
      [cx("vendorDb"), top("vendorDb")],
      [cx("dispatch"), bottom("dispatch")],
    ],
    color: COLORS.grey,
    step: 3,
    dashed: true,
    delay: 20,
  },
  {
    id: "dispatch-approval",
    points: [
      [right("dispatch"), cy("dispatch")],
      [left("approval"), cy("approval")],
    ],
    color: COLORS.green,
    step: 3,
    dashed: true,
    delay: 40,
  },
  {
    id: "approval-vendor",
    points: [
      [right("approval"), cy("approval")],
      [left("vendor"), cy("vendor")],
    ],
    color: COLORS.green,
    step: 3,
    dashed: true,
    delay: 60,
  },
  {
    id: "triage-reply",
    points: [
      [left("triage"), cy("triage")],
      [right("reply"), cy("reply")],
    ],
    color: COLORS.violet,
    step: 4,
  },
  {
    id: "reply-resident",
    points: [
      [left("reply"), cy("reply")],
      [RESIDENT_CHANNEL_X, cy("reply")],
      [RESIDENT_CHANNEL_X, cy("resident") + RESIDENT_PORT_OFFSET],
      [right("resident"), cy("resident") + RESIDENT_PORT_OFFSET],
    ],
    color: COLORS.green,
    step: 4,
    delay: 45,
  },
  {
    id: "triage-staff",
    points: [
      [cx("triage") - DUPLEX_OFFSET * 1.8, bottom("triage")],
      [cx("triage") - DUPLEX_OFFSET * 1.8, FEEDBACK_TURN_Y],
      [FEEDBACK_CHANNEL_X, FEEDBACK_TURN_Y],
      [FEEDBACK_CHANNEL_X, cy("staff")],
      [left("staff"), cy("staff")],
    ],
    color: COLORS.orange,
    step: 5,
    dashed: true,
  },
  {
    id: "staff-policy",
    points: [
      [cx("staff"), top("staff")],
      [cx("policy"), bottom("policy")],
    ],
    color: COLORS.orange,
    step: 5,
    delay: 40,
  },
  {
    id: "policy-triage",
    points: [
      [cx("policy"), top("policy")],
      [cx("triage"), bottom("triage")],
    ],
    color: COLORS.orange,
    step: 5,
    dashed: true,
    delay: 70,
  },
];

export const STEP_BAR = { top: 26, left: 60, badge: 30 };
export const LEGEND_POS = { top: 26, right: 60 };
export const PROGRESS = { y: 1012, x: FRAME_X, w: FRAME_W };
