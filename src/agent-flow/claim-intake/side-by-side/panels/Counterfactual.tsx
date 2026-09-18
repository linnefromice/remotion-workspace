import React from "react";
import { COLORS } from "../../cards/constants";
import { CASE, ELAPSED_SECONDS, PROMOTION_STEP } from "../scenario";

// --- 反実仮想 ---------------------------------------------------------------
// 検討メモ §3-1。フロー図は仕組みを語れるが、失敗したときの損失を語れない。
// 同じ通報が、ルールの有無で違う結末になることを下段に置いておく。

/** 帯の中の1手。矢印でつないで結末まで運ぶ */
const Beat: React.FC<{ color: string; dim?: boolean; children: React.ReactNode }> = ({
	color,
	dim,
	children,
}) => (
	<span
		style={{
			padding: "7px 14px",
			border: `1px solid ${color}`,
			borderRadius: 7,
			fontSize: 17,
			color,
			opacity: dim ? 0.6 : 1,
			whiteSpace: "nowrap",
		}}
	>
		{children}
	</span>
);

const Track: React.FC<{
	title: string;
	beats: string[];
	color: string;
	dim: boolean;
}> = ({ title, beats, color, dim }) => (
	<div
		style={{
			flex: 1,
			padding: "16px 22px",
			boxSizing: "border-box",
			border: `1px solid ${dim ? COLORS.borderRest : color}`,
			borderRadius: 12,
			background: dim ? "transparent" : "#151D2B",
		}}
	>
		<div style={{ fontSize: 16, color: dim ? COLORS.textSub : color, marginBottom: 14 }}>
			{title}
		</div>
		<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
			{beats.map((beat, i) => (
				<React.Fragment key={beat}>
					{i > 0 && <span style={{ color: COLORS.textSub, fontSize: 16 }}>→</span>}
					<Beat color={dim ? COLORS.textSub : color} dim={dim}>
						{beat}
					</Beat>
				</React.Fragment>
			))}
		</div>
	</div>
);

export const Counterfactual: React.FC<{ step: number; hideElapsed?: boolean; explanatory?: boolean }> = ({ step, hideElapsed = false, explanatory = false }) => {
	// ルールが効くのは昇格の工程から。それまではどちらも中立に置く
	const fired = step >= PROMOTION_STEP;

	return (
		<div style={{ display: "flex", gap: 24 }}>
			<Track
				title={explanatory ? "比較の仮定 / ルールが無い場合" : "セーフティルールが無い場合"}
				beats={explanatory ? [`AIの${CASE.aiUrgency}のまま`, "翌営業日の判断", "安全ルールによる昇格なし"] : [`AIの${CASE.aiUrgency}のまま`, "翌営業日に手配", "ガスのにおいは誰も見ない"]}
				color={COLORS.grey}
				dim
			/>
			<Track
				title="セーフティルールがある場合"
				beats={[
					`${CASE.resolvedUrgency}へ昇格`,
					explanatory ? "即時対応の判断" : "即時架電・当日手配",
					hideElapsed ? "一次回答を記録" : `${ELAPSED_SECONDS}秒で一次回答`,
				]}
				color={COLORS.rule}
				dim={!fired}
			/>
		</div>
	);
};
