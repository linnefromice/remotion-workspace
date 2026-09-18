import {
	COLORS,
	type EdgeDef,
	type FlowSpec,
	type NodeDef,
	type Point,
} from "./spec";

// 設計メモ: docs/agent-flow-restoration.md
//
// この図の主題は「AIが借主負担と言った請求を、そのまま入居者に出してよいのか」。
// ClaimIntake の鏡像で、ルールは**借主負担を下げる方向にしか効かない**。
// 人が上げるときだけ理由が要る。

export const STEP_LEN = 120; // 4秒
export const STEPS = [
	"立会い",
	"損耗の分類",
	"区分の確定",
	"経過年数",
	"見積の突合",
	"人の確認",
	"精算書",
] as const;
export const TOTAL_FRAMES = STEP_LEN * STEPS.length; // 840 = 28秒

const STEP_COLORS = [
	COLORS.cyan,
	COLORS.violet,
	COLORS.rule,
	COLORS.rule,
	COLORS.violet,
	COLORS.orange,
	COLORS.green,
];

// --- レイアウト -------------------------------------------------------------

const NODE_W = 208;
const NODE_H = 116;
const REC_W = 208;
const REC_H = 62;

const FRAME_MARGIN = 36;
const COL_GAP = 75;
// LogoSeal 版はノードの下にラベルが約160px伸びる。4版すべてが収まる行間にする
const ROW_GAP = 164;

const FRAME_X = 320;
const FRAME_Y = 120;
const FRAME_W = NODE_W * 4 + COL_GAP * 3 + FRAME_MARGIN * 2;

const COL_A = FRAME_X + FRAME_MARGIN + NODE_W / 2;
const COL_B = COL_A + NODE_W + COL_GAP;
const COL_C = COL_B + NODE_W + COL_GAP;
const COL_D = COL_C + NODE_W + COL_GAP;

const ROW_1 = FRAME_Y + FRAME_MARGIN + NODE_H / 2;
const ROW_2 = ROW_1 + NODE_H + ROW_GAP;

const FRAME_H = ROW_2 + NODE_H / 2 + FRAME_MARGIN - FRAME_Y;

const OUTSIDE_CX = 150;
const REC_CX = 1620;
const REC_TOP = 130;
const REC_STEP = REC_H + 14;

const card = (cx: number, cy: number) => ({ cx, cy, w: NODE_W, h: NODE_H });
const chip = (cy: number) => ({ cx: REC_CX, cy, w: REC_W, h: REC_H });

const NODES: NodeDef[] = [
	{
		id: "tenant",
		jp: "退去者",
		en: "TENANT",
		desc: "立会いに同席する",
		icon: "people",
		tone: "input",
		steps: [0, 6],
		...card(OUTSIDE_CX, ROW_1),
	},
	{
		id: "walkthrough",
		jp: "立会い",
		en: "WALKTHROUGH",
		desc: "担当者が所見を自由文で記録",
		action: "所見を自由文で残す",
		icon: "inbox",
		tone: "input",
		steps: [0],
		...card(COL_A, ROW_1),
	},
	{
		// 写真とチェックシートは任意。自由文だけでも先へ進める
		id: "photos",
		jp: "写真・チェック表",
		en: "ATTACHMENTS (OPTIONAL)",
		desc: "あれば分類の裏付けに使う",
		icon: "message",
		tone: "input",
		dashed: true,
		steps: [0],
		...card(COL_A, ROW_2),
	},
	{
		id: "classify",
		jp: "損耗の分類",
		en: "CLASSIFY / AI",
		desc: "通常損耗か、故意過失かを構造化出力",
		action: "損耗を分類する",
		icon: "agent",
		tone: "ai",
		steps: [1],
		...card(COL_B, ROW_1),
	},
	{
		id: "guideline",
		jp: "ガイドライン",
		en: "MLIT GUIDELINE",
		desc: "通常損耗は貸主負担に確定する",
		icon: "check",
		tone: "rule",
		steps: [2],
		...card(COL_C, ROW_1),
	},
	{
		id: "depreciation",
		jp: "経過年数",
		en: "DEPRECIATION",
		desc: "残存価値割合を引く・クロスは6年で1円",
		action: "残存価値割合を引く",
		icon: "database",
		tone: "rule",
		steps: [3],
		...card(COL_C, ROW_2),
	},
	{
		id: "estimate",
		jp: "見積の突合",
		en: "ESTIMATE CHECK",
		desc: "施工範囲が過大でないか・㎡単位が原則",
		action: "施工範囲を確かめる",
		icon: "branch",
		tone: "ai",
		steps: [4],
		...card(COL_D, ROW_1),
	},
	{
		id: "vendor",
		jp: "見積の受領",
		en: "ESTIMATE INTAKE",
		desc: "施工業者から受け取る（枠の外の主体）",
		action: "業者から受け取る",
		icon: "tool",
		tone: "input",
		steps: [4],
		...card(COL_D, ROW_2),
	},
	{
		id: "staff",
		jp: "担当者",
		en: "ADMIN",
		desc: "増額には理由が必要",
		icon: "people",
		tone: "human",
		steps: [5],
		...card(COL_C, 794),
	},
	{
		id: "invoice",
		jp: "精算書",
		en: "SETTLEMENT",
		desc: "根拠とあわせて借主に渡る",
		icon: "database",
		tone: "record",
		steps: [6],
		...card(COL_D, 794),
	},
	{
		id: "recWalk",
		jp: "walkthroughs",
		en: "所見・添付",
		desc: "",
		tone: "record",
		record: true,
		steps: [0],
		...chip(REC_TOP + REC_H / 2),
	},
	{
		id: "recClassify",
		jp: "classifications",
		en: "AIの生出力・不変",
		desc: "",
		tone: "record",
		record: true,
		steps: [1, 2],
		...chip(REC_TOP + REC_H / 2 + REC_STEP),
	},
	{
		id: "recResolved",
		jp: "resolved_shares",
		en: "確定した負担割合",
		desc: "",
		tone: "record",
		record: true,
		steps: [2, 3, 5],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 2),
	},
	{
		id: "recEstimate",
		jp: "estimates",
		en: "見積と突合の結果",
		desc: "",
		tone: "record",
		record: true,
		steps: [4],
		...chip(REC_TOP + REC_H / 2 + REC_STEP * 3),
	},
	{
		id: "recEvents",
		jp: "settlement_events",
		en: "追記のみ",
		desc: "",
		tone: "record",
		record: true,
		// 全工程で積まれる。痕跡が消えないことを点灯し続けることで示す
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

const OPTIONAL_LANE = 287;
/** ROW_1 の下端と ROW_2 の上端のあいだ。横に抜けてもカードに当たらない */
const GAP_Y = 330;
/** COL_C と COL_D のあいだ。縦に抜けてもカードに当たらない */
const GAP_X = 1167;
/** 枠の下、担当者の行より上。記録層へ回り込むときに使う */
const SETTLE_LANE = 640;
const SPECIAL_Y = 985;

const EDGES: EdgeDef[] = [
	{
		id: "tenant-walkthrough",
		from: "tenant",
		to: "walkthrough",
		points: [
			[right("tenant"), cy("tenant")],
			[left("walkthrough"), cy("walkthrough")],
		] as Point[],
		color: COLORS.cyan,
		step: 0,
	},
	{
		// 任意の入力。自由文だけでも次へ進むので破線
		id: "photos-classify",
		from: "photos",
		to: "classify",
		points: [
			[right("photos"), cy("photos")],
			[cx("classify"), cy("photos")],
			[cx("classify"), bottom("classify")],
		] as Point[],
		color: COLORS.grey,
		step: 0,
		dashed: true,
		delay: 30,
		label: "任意",
	},
	{
		id: "walkthrough-classify",
		from: "walkthrough",
		to: "classify",
		points: [
			[right("walkthrough"), cy("walkthrough")],
			[left("classify"), cy("classify")],
		] as Point[],
		color: COLORS.violet,
		step: 1,
		label: "自由文は必須",
	},
	{
		id: "classify-guideline",
		from: "classify",
		to: "guideline",
		points: [
			[right("classify"), cy("classify")],
			[left("guideline"), cy("guideline")],
		] as Point[],
		color: COLORS.rule,
		step: 2,
	},
	{
		id: "guideline-depreciation",
		from: "guideline",
		to: "depreciation",
		points: [
			[cx("guideline"), bottom("guideline")],
			[cx("depreciation"), top("depreciation")],
		] as Point[],
		color: COLORS.rule,
		step: 3,
	},
	{
		id: "depreciation-estimate",
		from: "depreciation",
		to: "estimate",
		points: [
			[right("depreciation"), cy("depreciation")],
			[GAP_X, cy("depreciation")],
			[GAP_X, GAP_Y],
			[cx("estimate") - 45, GAP_Y],
			[cx("estimate") - 45, bottom("estimate")],
		] as Point[],
		color: COLORS.violet,
		step: 4,
	},
	{
		id: "vendor-estimate",
		from: "vendor",
		to: "estimate",
		points: [
			[cx("vendor") + 45, top("vendor")],
			[cx("vendor") + 45, bottom("estimate")],
		] as Point[],
		color: COLORS.grey,
		step: 4,
		delay: 45,
		label: "業者から",
	},
	{
		id: "estimate-staff",
		from: "estimate",
		to: "staff",
		points: [
			[left("estimate"), cy("estimate")],
			[GAP_X, cy("estimate")],
			[GAP_X, cy("staff")],
			[right("staff"), cy("staff")],
		] as Point[],
		color: COLORS.orange,
		step: 5,
	},
	{
		id: "staff-resolved",
		from: "staff",
		to: "recResolved",
		points: [
			[cx("staff"), top("staff")],
			[cx("staff"), SETTLE_LANE],
			[left("recResolved") - 40, SETTLE_LANE],
			[left("recResolved") - 40, cy("recResolved")],
			[left("recResolved"), cy("recResolved")],
		] as Point[],
		color: COLORS.orange,
		step: 5,
		delay: 40,
		label: "増額なら理由つき",
	},
	{
		id: "staff-invoice",
		from: "staff",
		to: "invoice",
		points: [
			[right("staff"), cy("staff")],
			[left("invoice"), cy("invoice")],
		] as Point[],
		color: COLORS.green,
		step: 6,
	},
	{
		id: "invoice-tenant",
		from: "invoice",
		to: "tenant",
		points: [
			[cx("invoice"), bottom("invoice")],
			[cx("invoice"), SPECIAL_Y],
			[cx("tenant"), SPECIAL_Y],
			[cx("tenant"), bottom("tenant")],
		] as Point[],
		color: COLORS.green,
		step: 6,
		delay: 50,
		label: "根拠とあわせて渡す",
	},
	{
		// 要件を満たさない特約は無効。この筋では通らない
		id: "special-clause",
		from: "classify",
		to: "staff",
		points: [
			[left("classify"), cy("classify") + 34],
			[OPTIONAL_LANE, cy("classify") + 34],
			[OPTIONAL_LANE, SETTLE_LANE + 40],
			[cx("staff") - 60, SETTLE_LANE + 40],
			[cx("staff") - 60, top("staff")],
		] as Point[],
		color: COLORS.grey,
		step: null,
		dashed: true,
	},
	{
		// 残存価値1円でも作業費は借主負担になりうる。今回の筋では通らない
		id: "labor-cost",
		from: "depreciation",
		to: "staff",
		points: [
			[left("depreciation"), cy("depreciation")],
			[left("depreciation") - 50, cy("depreciation")],
			[left("depreciation") - 50, SETTLE_LANE],
			[cx("staff") + 60, SETTLE_LANE],
			[cx("staff") + 60, top("staff")],
		] as Point[],
		color: COLORS.grey,
		step: null,
		dashed: true,
	},
];

export const RESTORATION: FlowSpec = {
	markerPrefix: "rst-arrow-",
	label: "FARLEAP",
	sublabel: "/ RESTORATION RUNTIME",
	tagline: "ルールは借主負担を下げるだけ。上げられるのは人だけ",
	steps: STEPS,
	stepLen: STEP_LEN,
	stepColors: STEP_COLORS,
	frame: { x: FRAME_X, y: FRAME_Y, w: FRAME_W, h: FRAME_H, radius: 20 },
	recordHeader: { x: REC_CX - REC_W / 2, y: REC_TOP - 34, text: "RECORDS / 根拠と確定値" },
	nodes: NODES,
	edges: EDGES,
	panel: {
		x: 300,
		y: 726,
		w: 560,
		title: "負担の下げ方",
		subtitle: "AIの分類は書き換えない。弱い方を確定値に採る",
		heroStep: 3,
		rows: [
			{
				label: "AI（生出力）",
				value: "部屋全面",
				note: "故意過失・classifications に残る",
				color: COLORS.violet,
				revealStep: 1,
			},
			{
				label: "ガイドライン",
				value: "一面まで",
				note: "変色は通常損耗 → 貸主負担",
				color: COLORS.rule,
				revealStep: 2,
			},
			{
				label: "残存価値",
				value: "1円",
				note: "入居6年2か月・クロスは6年",
				color: COLORS.rule,
				revealStep: 3,
			},
			{
				label: "確定",
				value: "実質ゼロ",
				note: "urgency ではなく share を下げる",
				color: COLORS.rule,
				revealStep: 3,
				emphasis: true,
			},
		],
		footer: "増額できるのは人だけ（理由必須）",
	},
	brands: { vendor: "gmailLine" },
	legend: [
		[COLORS.cyan, "入力"],
		[COLORS.violet, "AIの推論"],
		[COLORS.rule, "決定論のルール"],
		[COLORS.orange, "人の判断"],
		[COLORS.green, "記録"],
	],
	notes: [
		{ x: 62, y: 690, text: "破線：任意の入力・通らない経路" },
		{
			x: 62,
			y: 920,
			text: "特約は要件を満たさないと無効\n残存価値1円でも作業費は残りうる",
			color: COLORS.textSub,
		},
	],
};
