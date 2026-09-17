import { z } from "zod";
import { CANVAS_H, CANVAS_W } from "../cards/constants";

/**
 * このページのレイアウトと、見せ方の切り替え。
 * 座標を本体と2箇所に書かないよう、寸法はここだけに置く。
 */

/** 左に置くフロー図の枠。1920x1080 をこの幅に収める */
export const FLOW = { x: 56, y: 200, w: 1140 };
export const FLOW_SCALE = FLOW.w / CANVAS_W; // 0.59375
export const FLOW_H = CANVAS_H * FLOW_SCALE; // 641.25

/** 右カラム。x + paddingLeft + w が、左端と同じ 56px の余白で終わるようにする */
export const STAGE = { x: 1244, y: 150, w: 590 };

/**
 * 何を足すかは Studio の props パネルから切り替えられるようにしてある。
 * 案を1つずつコンポジションに切ると数が増えるわりに、組み合わせを試せない。
 */
export const sideBySideSchema = z.object({
	/** 埋め込むフロー図から判定の非対称パネルを外し、地図に徹させる（メモ §4-2） */
	mapOnly: z.boolean(),
	/** 下段に、ルールの有無で結末が変わることを置く（メモ §3-1 / §4-3） */
	counterfactual: z.boolean(),
	/** 下段を inquiry_events の追記タイムラインにする。counterfactual とは排他 */
	timeline: z.boolean(),
	/** ヘッダ右に、受付からの経過秒を出す（メモ §3-2） */
	clock: z.boolean(),
});

/** Studio に出す組み合わせ。schema があるので props パネルから他の組み合わせも試せる */
export const SIDE_BY_SIDE_PRESETS = {
	/** 仮置きのまま。何も足していない */
	plain: { mapOnly: false, counterfactual: false, timeline: false, clock: false },
	/** 案1: 左のフロー図を地図に徹させ、左右で同じことを言わないようにする */
	map: { mapOnly: true, counterfactual: false, timeline: false, clock: false },
	/** 案2: 下段に、ルールの有無で結末が変わることを置く */
	counterfactual: { mapOnly: false, counterfactual: true, timeline: false, clock: false },
	/** 案1+案2に時計を足したもの。#15 で「両方入れるのが素直」と書いた形 */
	full: { mapOnly: true, counterfactual: true, timeline: false, clock: true },
	/** 案3: 下段を inquiry_events の追記タイムラインにする */
	timeline: { mapOnly: true, counterfactual: false, timeline: true, clock: false },
} as const satisfies Record<string, z.infer<typeof sideBySideSchema>>;
