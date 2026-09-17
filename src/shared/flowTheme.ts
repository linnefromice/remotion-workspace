import type { ServiceIconName } from "./ServiceIcon";
import type { Point } from "./orthogonalRouting";

/**
 * 図をまたいで使う配色と、図の形の型。
 *
 * 値は `agent-flow/claim-intake/cards/constants.ts` の COLORS と同じ。
 * ClaimIntake 側は出力を変えないため自前の定数のままにしてあり、
 * ここは Restoration / Proposal が使う。いずれ ClaimIntake も寄せたい。
 *
 * 配色の考え方は docs/agent-flow-diagram-patterns.md §4。
 * 色は工程ではなく**主体**に割り当て、決定論のルールだけ色相を持たせない。
 */
export const COLORS = {
	bg: "#0A101A",
	grid: "#121B27",
	textMain: "#EDF3FA",
	textSub: "#8798AC",
	frame: "#6B5BA0",
	cyan: "#22D3EE",
	violet: "#8B5CF6",
	orange: "#FF6B1A",
	green: "#34D399",
	grey: "#4A5769",
	/** AIでも人でもない第3の主体。新しい色相を発明せず最強コントラストで立てる */
	rule: "#FFFFFF",
	panelAi: "#141020",
	panelInput: "#0E1A24",
	panelRule: "#1B2230",
	panelHuman: "#1C1410",
	panelRecord: "#0F1A16",
	borderRest: "#2C3647",
} as const;

export type NodeTone = "input" | "ai" | "rule" | "human" | "record" | "planned";

export const TONE_PANEL: Record<NodeTone, string> = {
	input: COLORS.panelInput,
	ai: COLORS.panelAi,
	rule: COLORS.panelRule,
	human: COLORS.panelHuman,
	record: COLORS.panelRecord,
	planned: COLORS.panelInput,
};

export const TONE_ACCENT: Record<NodeTone, string> = {
	input: COLORS.cyan,
	ai: COLORS.violet,
	rule: COLORS.rule,
	human: COLORS.orange,
	record: COLORS.green,
	planned: COLORS.grey,
};

export type NodeDef = {
	id: string;
	jp: string;
	en: string;
	desc: string;
	icon?: ServiceIconName;
	tone: NodeTone;
	/** 破線で描く。未実装、任意の工程、またはこの筋では通らないもの */
	dashed?: boolean;
	/** 記録層のチップ。小さく、アイコンを持たない */
	record?: boolean;
	steps: number[];
	cx: number;
	cy: number;
	w: number;
	h: number;
};

export type EdgeDef = {
	id: string;
	points: Point[];
	color: string;
	/** null なら常に非アクティブ（通らない経路） */
	step: number | null;
	dashed?: boolean;
	delay?: number;
	label?: string;
};

export type PanelRow = {
	label: string;
	value: string;
	note: string;
	color: string;
	/** この工程に入ってから値を出す。それまでは「—」 */
	revealStep: number;
	emphasis?: boolean;
};

/** 図1枚ぶんの定義。描画は shared/FlowDiagram.tsx */
export type FlowSpec = {
	/** SVG の marker id の接頭辞。図ごとに変えないと同一ページで衝突する */
	markerPrefix: string;
	label: string;
	sublabel: string;
	tagline: string;
	steps: readonly string[];
	stepLen: number;
	stepColors: readonly string[];
	frame: { x: number; y: number; w: number; h: number; radius: number };
	recordHeader?: { x: number; y: number; text: string };
	nodes: NodeDef[];
	edges: EdgeDef[];
	panel: {
		x: number;
		y: number;
		w: number;
		title: string;
		subtitle: string;
		rows: PanelRow[];
		footer: string;
		/** この工程のときパネルを強調する。図の山場 */
		heroStep: number;
	};
	legend: ReadonlyArray<readonly [color: string, label: string]>;
	notes?: ReadonlyArray<{ x: number; y: number; text: string; color?: string }>;
};

export const CANVAS_W = 1920;
export const CANVAS_H = 1080;
export const FPS = 30;
export const NODE_RADIUS = 12;
