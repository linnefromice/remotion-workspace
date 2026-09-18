import type { ServiceIconName } from "../../../shared/ServiceIcon";

// 設計メモ: docs/agent-flow-claim-intake.md
// 題材: farleap/tenant-claim-intake-demoapp
//
// この図の主題は「処理が流れる様子」ではなく、
// AI・決定論のルール・人の三者が、それぞれ何を決められて何を決められないか。

export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const FPS = 30;
export const STEP_LEN = 120; // 4秒
export const STEPS = [
	"受付",
	"文字起こし",
	"AI判定",
	"ルール昇格",
	"業務判断",
	"人の確認",
	"出口",
] as const;
export const STEP_COUNT = STEPS.length;
export const TOTAL_FRAMES = STEP_LEN * STEP_COUNT; // 840 = 28秒

export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const COLORS = {
	bg: "#0A101A",
	grid: "#121B27",
	textMain: "#EDF3FA",
	textSub: "#8798AC",
	frame: "#6B5BA0",
	// 系統色
	cyan: "#22D3EE",
	violet: "#8B5CF6",
	orange: "#FF6B1A",
	green: "#34D399",
	grey: "#4A5769",
	// 決定論のルールだけ色相を持たせない。
	// demoapp の「AI でも人でもない第3の主体を、新しい色を発明せずに
	// 最強コントラストで示す」という判断をそのまま借りている。
	rule: "#FFFFFF",
	// カード面
	panelAi: "#141020",
	panelInput: "#0E1A24",
	panelRule: "#1B2230",
	panelHuman: "#1C1410",
	panelRecord: "#0F1A16",
	borderRest: "#2C3647",
} as const;

export const STEP_COLORS: readonly string[] = [
	COLORS.cyan,
	COLORS.cyan,
	COLORS.violet,
	COLORS.rule,
	COLORS.violet,
	COLORS.orange,
	COLORS.green,
];

export const LEGEND: ReadonlyArray<readonly [color: string, label: string]> = [
	[COLORS.cyan, "入力"],
	[COLORS.violet, "AIの推論"],
	[COLORS.rule, "決定論のルール"],
	[COLORS.orange, "人の判断"],
	[COLORS.green, "記録"],
];

// --- レイアウト -------------------------------------------------------------

export const NODE_W = 208;
export const NODE_H = 116;
export const REC_W = 208;
export const REC_H = 62;
export const NODE_RADIUS = 12;

const FRAME_MARGIN = 36;
const COL_GAP = 75;
const ROW_GAP = 80;

export const FRAME_X = 320;
export const FRAME_Y = 120;
export const FRAME_W = NODE_W * 4 + COL_GAP * 3 + FRAME_MARGIN * 2; // 1129
export const FRAME_RADIUS = 20;

const COL_A = FRAME_X + FRAME_MARGIN + NODE_W / 2; // 460
const COL_B = COL_A + NODE_W + COL_GAP; // 743
const COL_C = COL_B + NODE_W + COL_GAP; // 1026
const COL_D = COL_C + NODE_W + COL_GAP; // 1309

const ROW_1 = FRAME_Y + FRAME_MARGIN + NODE_H / 2; // 214
const ROW_2 = ROW_1 + NODE_H + ROW_GAP; // 410

export const FRAME_H = ROW_2 + NODE_H / 2 + FRAME_MARGIN - FRAME_Y; // 384
const FRAME_RIGHT = FRAME_X + FRAME_W; // 1449

const OUTSIDE_CX = 150;
const REC_CX = 1620;
const REC_TOP = 130;
const REC_STEP = REC_H + 14; // 76

export const RECORD_HEADER = { x: REC_CX - REC_W / 2, y: REC_TOP - 34 };

export const FRAME_LABEL = "FARLEAP";
export const FRAME_SUBLABEL = "/ CLAIM INTAKE RUNTIME";
export const FRAME_TAGLINE = "昇格はルールが強制し、降格は人だけができる";

export type NodeTone = "input" | "ai" | "rule" | "human" | "record" | "planned";

export type NodeId =
	| "resident"
	| "line"
	| "intake"
	| "stt"
	| "followup"
	| "judge"
	| "safety"
	| "work"
	| "guardrails"
	| "staff"
	| "csv"
	| "recConv"
	| "recJudgments"
	| "recInquiries"
	| "recWork"
	| "recEvents";

export type NodeDef = {
	id: NodeId;
	jp: string;
	en: string;
	desc: string;
	icon?: ServiceIconName;
	tone: NodeTone;
	/** 破線で描く。未実装、またはこのシナリオでは通らない工程 */
	dashed?: boolean;
	/** 記録層のチップ。小さく、アイコンを持たない */
	record?: boolean;
	steps: StepIndex[];
	cx: number;
	cy: number;
	w: number;
	h: number;
};

const card = (cx: number, cy: number) => ({ cx, cy, w: NODE_W, h: NODE_H });
const chip = (cy: number) => ({ cx: REC_CX, cy, w: REC_W, h: REC_H });

export const NODES: NodeDef[] = [
	{
		id: "resident",
		jp: "入居者",
		en: "RESIDENT",
		desc: "音声かテキストで通報",
		icon: "message",
		tone: "input",
		steps: [0, 5],
		...card(OUTSIDE_CX, ROW_1),
	},
	{
		id: "line",
		jp: "LINE",
		en: "WEBHOOK",
		desc: "未実装（設計済み）",
		icon: "message",
		tone: "planned",
		dashed: true,
		steps: [],
		...card(OUTSIDE_CX, ROW_2 - 50),
	},
	{
		id: "intake",
		jp: "受付",
		en: "INTAKE()",
		desc: "会話と添付を保存し受付番号を返す",
		icon: "inbox",
		tone: "input",
		steps: [0],
		...card(COL_A, ROW_1),
	},
	{
		id: "stt",
		jp: "文字起こし",
		en: "STT",
		desc: "Private Blob から読み出す",
		icon: "wave",
		tone: "input",
		steps: [1],
		...card(COL_B, ROW_1),
	},
	{
		id: "judge",
		jp: "AI判定",
		en: "JUDGE / 1段目",
		desc: "緊急度とカテゴリを構造化出力",
		icon: "agent",
		tone: "ai",
		steps: [2],
		...card(COL_C, ROW_1),
	},
	{
		id: "safety",
		jp: "セーフティルール",
		en: "SAFETY RULES",
		desc: "決定論5本・昇格しかできない",
		icon: "check",
		tone: "rule",
		steps: [3],
		...card(COL_D, ROW_1),
	},
	{
		id: "followup",
		jp: "追加質問",
		en: "FOLLOW-UP",
		desc: "音声のみ1回だけ・P1では聞かない",
		icon: "message",
		tone: "planned",
		dashed: true,
		steps: [],
		...card(COL_B, ROW_2),
	},
	{
		id: "work",
		jp: "業務判断",
		en: "WORK / 2段目",
		desc: "責任区分とNextAction候補",
		icon: "branch",
		tone: "ai",
		steps: [4],
		...card(COL_C, ROW_2),
	},
	{
		id: "guardrails",
		jp: "ガードレール",
		en: "GUARDRAILS G1-G5",
		desc: "追加と制止のみ・削除の経路が無い",
		icon: "check",
		tone: "rule",
		steps: [4],
		...card(COL_D, ROW_2),
	},
	{
		id: "staff",
		jp: "担当者",
		en: "ADMIN",
		desc: "降格は理由必須",
		icon: "people",
		tone: "human",
		steps: [5],
		...card(COL_C, 660),
	},
	{
		id: "csv",
		jp: "CSV出力",
		en: "EXPORT",
		desc: "urgency_ai と fired_rule_ids が並ぶ",
		icon: "database",
		tone: "record",
		steps: [6],
		...card(REC_CX, 660),
	},
	{
		id: "recConv",
		jp: "会話",
		en: "conversations / turns",
		desc: "",
		tone: "record",
		record: true,
		steps: [0, 1],
		...chip(REC_TOP + REC_H / 2),
	},
	{
		id: "recJudgments",
		jp: "judgments",
		en: "AIの生出力・履歴",
		desc: "",
		tone: "record",
		record: true,
		steps: [2, 3],
		...chip(REC_TOP + REC_H / 2 + REC_STEP),
	},
	{
		id: "recInquiries",
		jp: "inquiries",
		en: "現在値（human > rule > ai）",
		desc: "",
		tone: "record",
		record: true,
		steps: [3, 5],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 2),
	},
	{
		id: "recWork",
		jp: "work_judgments",
		en: "2段目の履歴",
		desc: "",
		tone: "record",
		record: true,
		steps: [4],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 3),
	},
	{
		id: "recEvents",
		jp: "inquiry_events",
		en: "追記のみ",
		desc: "",
		tone: "record",
		record: true,
		// 全ステップで積まれる。痕跡が消えないことを点灯し続けることで示す。
		steps: [0, 1, 2, 3, 4, 5, 6],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 4),
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
	/** 再配置用。旧版のpointsは変更しない。 */
	from?: NodeId;
	to?: NodeId;
	points: Point[];
	color: string;
	/** null なら常に非アクティブ（未実装、またはこのシナリオでは通らない経路） */
	step: StepIndex | null;
	dashed?: boolean;
	delay?: number;
	label?: string;
};

const LINE_CHANNEL_X = 287;
const WORK_TURN_Y = 330;
const CALLBACK_Y = 920;

export const EDGES: EdgeDef[] = [
	{
		id: "resident-intake",
		from: "resident",
		to: "intake",
		points: [
			[right("resident"), cy("resident")],
			[left("intake"), cy("intake")],
		],
		color: COLORS.cyan,
		step: 0,
	},
	{
		id: "line-intake",
		from: "line",
		to: "intake",
		points: [
			[right("line"), cy("line")],
			[LINE_CHANNEL_X, cy("line")],
			[LINE_CHANNEL_X, cy("intake") + 26],
			[left("intake"), cy("intake") + 26],
		],
		color: COLORS.grey,
		step: null,
		dashed: true,
	},
	{
		id: "intake-stt",
		from: "intake",
		to: "stt",
		points: [
			[right("intake"), cy("intake")],
			[left("stt"), cy("stt")],
		],
		color: COLORS.cyan,
		step: 1,
	},
	{
		id: "stt-judge",
		from: "stt",
		to: "judge",
		points: [
			[right("stt"), cy("stt")],
			[left("judge"), cy("judge")],
		],
		color: COLORS.violet,
		step: 2,
		label: "別リクエスト",
	},
	{
		id: "judge-safety",
		from: "judge",
		to: "safety",
		points: [
			[right("judge"), cy("judge")],
			[left("safety"), cy("safety")],
		],
		color: COLORS.violet,
		step: 3,
	},
	{
		id: "judge-followup",
		from: "judge",
		to: "followup",
		points: [
			[cx("judge") - 40, bottom("judge")],
			[cx("judge") - 40, ROW_2 - 58 - 26],
			[cx("followup"), ROW_2 - 58 - 26],
			[cx("followup"), top("followup")],
		],
		color: COLORS.grey,
		step: null,
		dashed: true,
	},
	{
		id: "followup-resident",
		from: "followup",
		to: "resident",
		points: [
			[left("followup"), cy("followup")],
			[LINE_CHANNEL_X, cy("followup")],
			[LINE_CHANNEL_X, bottom("resident")],
			[cx("resident"), bottom("resident")],
		],
		color: COLORS.grey,
		step: null,
		dashed: true,
	},
	{
		id: "safety-work",
		from: "safety",
		to: "work",
		points: [
			[cx("safety"), bottom("safety")],
			[cx("safety"), WORK_TURN_Y],
			[cx("work"), WORK_TURN_Y],
			[cx("work"), top("work")],
		],
		color: COLORS.violet,
		step: 4,
	},
	{
		id: "work-guardrails",
		from: "work",
		to: "guardrails",
		points: [
			[right("work"), cy("work")],
			[left("guardrails"), cy("guardrails")],
		],
		color: COLORS.violet,
		step: 4,
		delay: 45,
	},
	{
		id: "staff-inquiries",
		from: "staff",
		to: "recInquiries",
		points: [
			[right("staff"), cy("staff")],
			[FRAME_RIGHT + 34, cy("staff")],
			[FRAME_RIGHT + 34, cy("recInquiries")],
			[left("recInquiries"), cy("recInquiries")],
		],
		color: COLORS.orange,
		step: 5,
		label: "override",
	},
	{
		id: "records-csv",
		from: "recEvents",
		to: "csv",
		points: [
			[cx("recEvents"), bottom("recEvents")],
			[cx("csv"), top("csv")],
		],
		color: COLORS.green,
		step: 6,
	},
	{
		id: "staff-resident",
		from: "staff",
		to: "resident",
		points: [
			[cx("staff"), bottom("staff")],
			[cx("staff"), CALLBACK_Y],
			[cx("resident"), CALLBACK_Y],
			[cx("resident"), bottom("resident")],
		],
		color: COLORS.orange,
		step: 5,
		dashed: true,
		delay: 55,
		label: "SLA内に折り返す（アプリ外）",
	},
];

// --- 判定の非対称パネル -----------------------------------------------------
// この図の山場。AI の値とルールの結論を並べ、どちらも残ることを見せる。
// 上書きのアニメーションは作らない。実装が「書き換えない」設計だから。

export const PANEL = { x: 300, y: 600, w: 560, h: 250 };

export type PanelRow = {
	label: string;
	value: string;
	note: string;
	color: string;
	revealStep: StepIndex;
	emphasis?: boolean;
};

export const PANEL_ROWS: PanelRow[] = [
	{
		label: "AI（生出力）",
		value: "P2",
		note: "judgments.raw に残る",
		color: COLORS.violet,
		revealStep: 2,
	},
	{
		label: "セーフティルール",
		value: "P1",
		note: "SAFETY_GAS_ODOR",
		color: COLORS.rule,
		revealStep: 3,
	},
	{
		label: "現在値",
		value: "P1",
		note: "ルール昇格",
		color: COLORS.rule,
		revealStep: 3,
		emphasis: true,
	},
];

export const PANEL_FOOTER = "降格できるのは人だけ（理由必須）";
export const PANEL_TITLE = "判定の非対称";
export const PANEL_SUBTITLE = "強い方を採る。AIの出力は書き換えない";

export const STEP_BAR = { top: 26, left: 60, badge: 28 };
export const LEGEND_POS = { top: 26, right: 60 };
export const PROGRESS = { y: 1012, x: FRAME_X, w: FRAME_W };
