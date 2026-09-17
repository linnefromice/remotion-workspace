/**
 * この見せ物が扱う1件の通報。
 *
 * 「AIの値」「ルールのID」「経過秒」は、現場の画面・下段の帯・タイムラインの
 * 3箇所から参照される。以前ここを各所に直書きしていて、
 * 同じ数字を3箇所で言ってしまう事故が実際に起きたので、事実は1箇所に置く。
 *
 * 値そのものは demoapp（farleap/tenant-claim-intake-demoapp）の語彙に合わせた。
 */
export const CASE = {
	id: "2026-0917-014",
	ticket: "#2026-0917-014",
	/** 発火した安全ルール。5本のうちの1本 */
	ruleId: "SAFETY_GAS_ODOR",
	/** AIの生出力。誰にも書き換えられない */
	aiUrgency: "P2",
	/** ルールが昇格させたあとの現在値 */
	resolvedUrgency: "P1",
} as const;

export type CaseEvent = {
	/** 受付からの経過秒 */
	t: number;
	/** この秒数に到達する動画上の工程 */
	step: number;
	name: string;
	detail: string;
};

/** 追記されていくイベント。時刻はこのシナリオでの想定値で、実測ではない */
export const EVENTS: CaseEvent[] = [
	{ t: 0, step: 0, name: "inquiry.created", detail: CASE.ticket },
	{ t: 4, step: 1, name: "transcript.completed", detail: "音声 0:12" },
	{ t: 9, step: 2, name: "judgment.created", detail: `urgency=${CASE.aiUrgency} / ai` },
	{
		t: 11,
		step: 3,
		name: "urgency.promoted",
		detail: `${CASE.aiUrgency}→${CASE.resolvedUrgency} ${CASE.ruleId}`,
	},
	{ t: 16, step: 4, name: "work_judgment.created", detail: "next_action ×3" },
	{ t: 22, step: 5, name: "staff.viewed", detail: "admin" },
	{ t: 47, step: 6, name: "reply.sent", detail: "一次回答" },
];

/** 受付から一次回答まで。最後のイベントから引くので、2箇所に書かれない */
export const ELAPSED_SECONDS = EVENTS[EVENTS.length - 1].t;

/** ルールが効き始める工程。下段の帯が点灯を切り替える境目でもある */
export const PROMOTION_STEP = EVENTS.find((e) => e.name === "urgency.promoted")!.step;
