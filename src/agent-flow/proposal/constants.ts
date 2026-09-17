import { COLORS, type EdgeDef, type FlowSpec, type NodeDef, type Point } from "./spec";

// 設計メモ: docs/agent-flow-proposal.md
//
// この図の主題は「AIが薦めた物件を、そのまま候補者に出してよいのか」。
// ルールは**候補を落とす方向にしか効かない**。足せるのは人だけで、理由が要る。
//
// 他の2枚と違うのは ROW_2 の使い方。落ちた候補を消さずに下へ落として残す。
// 提案は出したものだけ見えるが、出さなかった判断のほうが説明責任を負うため。

export const STEP_LEN = 120; // 4秒
export const STEPS = [
	"相談受付",
	"希望の構造化",
	"候補の抽出",
	"規約と現況",
	"審査の見込み",
	"人の確定",
	"提案と記録",
] as const;
export const TOTAL_FRAMES = STEP_LEN * STEPS.length; // 840 = 28秒

const STEP_COLORS = [
	COLORS.cyan,
	COLORS.violet,
	COLORS.violet,
	COLORS.rule,
	COLORS.rule,
	COLORS.orange,
	COLORS.green,
];

// --- レイアウト -------------------------------------------------------------

const NODE_W = 208;
const NODE_H = 116;
const SRC_W = 150;
const SRC_H = 56;
const REC_W = 208;
const REC_H = 62;

const FRAME_MARGIN = 36;
const COL_GAP = 75;

const FRAME_X = 320;
const FRAME_Y = 200;
const FRAME_W = NODE_W * 4 + COL_GAP * 3 + FRAME_MARGIN * 2;

const COL_A = FRAME_X + FRAME_MARGIN + NODE_W / 2;
const COL_B = COL_A + NODE_W + COL_GAP;
const COL_C = COL_B + NODE_W + COL_GAP;
const COL_D = COL_C + NODE_W + COL_GAP;

const ROW_1 = FRAME_Y + FRAME_MARGIN + NODE_H / 2;
/** 落ちた候補を置く行。枠の中に残すことで「消えていない」ことを見せる */
const ROW_2 = ROW_1 + NODE_H + 84;

const FRAME_H = ROW_2 + NODE_H / 2 + FRAME_MARGIN - FRAME_Y;

const OUTSIDE_CX = 150;
const REC_CX = 1620;
const REC_TOP = 212;
const REC_STEP = REC_H + 14;

/** 在庫の入力元。3つとも入る。自社基幹・レインズ・ポータル連携 */
const SRC_Y = 116;
const SRC_GAP = 12;
const SRC_CX_0 = COL_D - SRC_W - SRC_GAP;

const card = (cx: number, cy: number) => ({ cx, cy, w: NODE_W, h: NODE_H });
const chip = (cy: number) => ({ cx: REC_CX, cy, w: REC_W, h: REC_H });
const source = (i: number) => ({
	cx: SRC_CX_0 + i * (SRC_W + SRC_GAP),
	cy: SRC_Y,
	w: SRC_W,
	h: SRC_H,
});

const NODES: NodeDef[] = [
	{
		id: "lead",
		jp: "候補者",
		en: "LEAD",
		desc: "希望を自由文か口頭で伝える",
		icon: "people",
		tone: "input",
		steps: [0, 6],
		...card(OUTSIDE_CX, ROW_1),
	},
	{
		id: "intake",
		jp: "相談受付",
		en: "INTAKE",
		desc: "会話をそのまま保存する",
		icon: "inbox",
		tone: "input",
		steps: [0],
		...card(COL_A, ROW_1),
	},
	{
		id: "structure",
		jp: "希望の構造化",
		en: "STRUCTURE / AI",
		desc: "エリア・予算・入居時期・譲れない条件",
		icon: "agent",
		tone: "ai",
		steps: [1],
		...card(COL_B, ROW_1),
	},
	{
		id: "retrieve",
		jp: "候補の抽出",
		en: "RETRIEVE / AI",
		desc: "適合度つきで並べる（生出力）",
		icon: "branch",
		tone: "ai",
		steps: [2],
		...card(COL_C, ROW_1),
	},
	{
		id: "compliance",
		jp: "規約と現況",
		en: "ADS CODE + STOCK",
		desc: "成約済み・表示不備を落とす",
		icon: "check",
		tone: "rule",
		steps: [3],
		...card(COL_D, ROW_1),
	},
	{
		// 在庫の入力元。どれか1つではなく、3つとも入る
		id: "srcCore",
		jp: "自社基幹",
		en: "CORE",
		desc: "",
		tone: "rule",
		steps: [3],
		...source(0),
	},
	{
		id: "srcReins",
		jp: "レインズ",
		en: "REINS",
		desc: "",
		tone: "rule",
		steps: [3],
		...source(1),
	},
	{
		id: "srcPortal",
		jp: "ポータル",
		en: "PORTAL",
		desc: "",
		tone: "rule",
		steps: [3],
		...source(2),
	},
	{
		id: "screening",
		jp: "審査の見込み",
		en: "SCREENING",
		desc: "保証会社の基準で落とす",
		icon: "sliders",
		tone: "rule",
		steps: [4],
		...card(COL_D, ROW_2),
	},
	{
		// この図の肝。落ちた候補は消えずにここへ落ちて残る
		id: "dropped",
		jp: "落ちた候補",
		en: "DROPPED + REASON",
		desc: "理由とともに残る・消さない",
		icon: "database",
		tone: "record",
		steps: [3, 4, 5],
		...card(COL_C, ROW_2),
	},
	{
		id: "agent",
		jp: "営業担当",
		en: "SALES",
		desc: "戻すには根拠が必要",
		icon: "people",
		tone: "human",
		steps: [5],
		...card(COL_C, 760),
	},
	{
		id: "proposal",
		jp: "提案一覧",
		en: "PROPOSAL",
		desc: "候補者に渡る3件",
		icon: "message",
		tone: "record",
		steps: [6],
		...card(COL_D, 760),
	},
	{
		id: "recIntake",
		jp: "consultations",
		en: "相談の生ログ",
		desc: "",
		tone: "record",
		record: true,
		steps: [0, 1],
		...chip(REC_TOP + REC_H / 2),
	},
	{
		id: "recCandidates",
		jp: "candidates",
		en: "AIの生出力・不変",
		desc: "",
		tone: "record",
		record: true,
		steps: [2],
		...chip(REC_TOP + REC_H / 2 + REC_STEP),
	},
	{
		id: "recExclusions",
		jp: "exclusions",
		en: "落とした理由",
		desc: "",
		tone: "record",
		record: true,
		steps: [3, 4, 5],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 2),
	},
	{
		id: "recProposals",
		jp: "proposals",
		en: "提案した組み合わせ",
		desc: "",
		tone: "record",
		record: true,
		steps: [6],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 3),
	},
	{
		id: "recEvents",
		jp: "proposal_events",
		en: "追記のみ",
		desc: "",
		tone: "record",
		record: true,
		steps: [0, 1, 2, 3, 4, 5, 6],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 4),
	},
];

const byId = (id: string): NodeDef => NODES.find((n) => n.id === id)!;
const left = (id: string) => byId(id).cx - byId(id).w / 2;
const right = (id: string) => byId(id).cx + byId(id).w / 2;
const top = (id: string) => byId(id).cy - byId(id).h / 2;
const bottom = (id: string) => byId(id).cy + byId(id).h / 2;
const cx = (id: string) => byId(id).cx;
const cy = (id: string) => byId(id).cy;

/** 枠の下、営業担当の行より上 */
const LANE_Y = 640;
const DELIVER_Y = 960;

const EDGES: EdgeDef[] = [
	{
		id: "lead-intake",
		points: [
			[right("lead"), cy("lead")],
			[left("intake"), cy("intake")],
		] as Point[],
		color: COLORS.cyan,
		step: 0,
	},
	{
		id: "intake-structure",
		points: [
			[right("intake"), cy("intake")],
			[left("structure"), cy("structure")],
		] as Point[],
		color: COLORS.violet,
		step: 1,
	},
	{
		id: "structure-retrieve",
		points: [
			[right("structure"), cy("structure")],
			[left("retrieve"), cy("retrieve")],
		] as Point[],
		color: COLORS.violet,
		step: 2,
		label: "5件",
	},
	{
		id: "retrieve-compliance",
		points: [
			[right("retrieve"), cy("retrieve")],
			[left("compliance"), cy("compliance")],
		] as Point[],
		color: COLORS.rule,
		step: 3,
	},
	// 在庫の3つの入力元。どれも規約・現況の判定に入る
	...(["srcCore", "srcReins", "srcPortal"] as const).map((id, i) => ({
		id: `${id}-compliance`,
		points: [
			[cx(id), bottom(id)],
			[cx(id), (bottom(id) + top("compliance")) / 2],
			[cx("compliance"), (bottom(id) + top("compliance")) / 2],
			[cx("compliance"), top("compliance")],
		] as Point[],
		color: COLORS.rule,
		step: 3 as number,
		delay: 10 + i * 8,
	})),
	{
		id: "compliance-dropped",
		points: [
			[cx("compliance"), bottom("compliance")],
			[cx("compliance"), (bottom("compliance") + top("dropped")) / 2],
			[right("dropped"), (bottom("compliance") + top("dropped")) / 2],
			[right("dropped"), cy("dropped") - 20],
		] as Point[],
		color: COLORS.rule,
		step: 3,
		delay: 50,
		label: "−2件",
	},
	{
		id: "compliance-screening",
		points: [
			[right("compliance"), cy("compliance")],
			[right("compliance") + 44, cy("compliance")],
			[right("compliance") + 44, cy("screening")],
			[right("screening"), cy("screening")],
		] as Point[],
		color: COLORS.rule,
		step: 4,
	},
	{
		id: "screening-dropped",
		points: [
			[left("screening"), cy("screening") + 20],
			[right("dropped"), cy("screening") + 20],
		] as Point[],
		color: COLORS.rule,
		step: 4,
		delay: 45,
		label: "−1件",
	},
	{
		id: "screening-agent",
		points: [
			[cx("screening"), bottom("screening")],
			[cx("screening"), LANE_Y],
			[cx("agent") + 50, LANE_Y],
			[cx("agent") + 50, top("agent")],
		] as Point[],
		color: COLORS.orange,
		step: 5,
		label: "2件",
	},
	{
		id: "dropped-agent",
		points: [
			[cx("dropped") - 50, bottom("dropped")],
			[cx("dropped") - 50, top("agent")],
		] as Point[],
		color: COLORS.orange,
		step: 5,
		delay: 40,
		label: "戻すなら根拠",
	},
	{
		id: "agent-proposal",
		points: [
			[right("agent"), cy("agent")],
			[left("proposal"), cy("proposal")],
		] as Point[],
		color: COLORS.green,
		step: 6,
		label: "3件",
	},
	{
		id: "agent-exclusions",
		points: [
			[right("agent"), cy("agent") - 30],
			[left("recExclusions") - 40, cy("agent") - 30],
			[left("recExclusions") - 40, cy("recExclusions")],
			[left("recExclusions"), cy("recExclusions")],
		] as Point[],
		color: COLORS.orange,
		step: 5,
		delay: 70,
		label: "理由を記録",
	},
	{
		id: "proposal-lead",
		points: [
			[cx("proposal"), bottom("proposal")],
			[cx("proposal"), DELIVER_Y],
			[cx("lead"), DELIVER_Y],
			[cx("lead"), bottom("lead")],
		] as Point[],
		color: COLORS.green,
		step: 6,
		delay: 45,
		label: "落とした理由も説明できる",
	},
	{
		// 成約済みの再掲載はおとり広告。止まっていることを見せる
		id: "relist",
		points: [
			[left("dropped"), cy("dropped")],
			[left("dropped") - 60, cy("dropped")],
			[left("dropped") - 60, cy("retrieve") + 34],
			[left("retrieve"), cy("retrieve") + 34],
		] as Point[],
		color: COLORS.grey,
		step: null,
		dashed: true,
	},
];

export const PROPOSAL: FlowSpec = {
	markerPrefix: "prp-arrow-",
	label: "FARLEAP",
	sublabel: "/ PROPOSAL RUNTIME",
	tagline: "ルールは候補を落とすだけ。戻せるのは人だけ",
	steps: STEPS,
	stepLen: STEP_LEN,
	stepColors: STEP_COLORS,
	frame: { x: FRAME_X, y: FRAME_Y, w: FRAME_W, h: FRAME_H, radius: 20 },
	recordHeader: { x: REC_CX - REC_W / 2, y: REC_TOP - 34, text: "RECORDS / 候補と除外理由" },
	nodes: NODES,
	edges: EDGES,
	panel: {
		x: 300,
		y: 726,
		w: 560,
		title: "候補の減り方",
		subtitle: "AIの並びは書き換えない。落とした理由を残す",
		heroStep: 3,
		rows: [
			{
				label: "AI（生出力）",
				value: "5件",
				note: "適合度順・candidates に残る",
				color: COLORS.violet,
				revealStep: 2,
			},
			{
				label: "規約と現況",
				value: "−2件",
				note: "成約済み / 徒歩表示の不整合",
				color: COLORS.rule,
				revealStep: 3,
			},
			{
				label: "審査の見込み",
				value: "−1件",
				note: "保証会社の基準",
				color: COLORS.rule,
				revealStep: 4,
			},
			{
				label: "営業担当",
				value: "+1件",
				note: "内見済みで本人が希望（理由必須）",
				color: COLORS.orange,
				revealStep: 5,
			},
			{
				label: "提案",
				value: "3件",
				note: "落とした2件の理由も残る",
				color: COLORS.green,
				revealStep: 6,
				emphasis: true,
			},
		],
		footer: "戻せるのは人だけ（根拠必須）",
	},
	legend: [
		[COLORS.cyan, "入力"],
		[COLORS.violet, "AIの推論"],
		[COLORS.rule, "決定論のルール"],
		[COLORS.orange, "人の判断"],
		[COLORS.green, "記録"],
	],
	notes: [
		{ x: 62, y: 690, text: "破線：通らない経路（成約済みの再掲載）" },
		{ x: 62, y: 920, text: "在庫は3つの入力元をすべて受ける", color: COLORS.textSub },
	],
};
