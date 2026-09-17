import React from "react";
import type { z } from "zod";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AgentFlowClaimIntakeIcons } from "../icons";
import {
	CANVAS_H,
	CANVAS_W,
	COLORS,
	STEPS,
	STEP_COLORS,
	STEP_LEN,
	TOTAL_FRAMES,
} from "../cards/constants";
import { FLOW, FLOW_H, FLOW_SCALE, STAGE, sideBySideSchema } from "./constants";
import { Counterfactual } from "./panels/Counterfactual";
import { ElapsedClock, EventTimeline } from "./panels/EventTimeline";
import { ElapsedSummary, SCENES } from "./scenes";

export { SIDE_BY_SIDE_PRESETS, sideBySideSchema } from "./constants";

/**
 * プレゼン用1枚サイトの仮置き版。検討メモ: docs/presentation-site.md
 *
 * 既存のフロー図をそのまま縮小して左に置き、右に同じステップの「現場」を出す。
 * フロー図側は `useCurrentFrame()` だけで状態が決まるので、
 * 同期のためのコードは要らない（縮小して埋めるだけで勝手に揃う）。
 *
 * 尺・ステップ割りは ClaimIntake と共有している（28秒 / 7ステップ）。
 */

export const ClaimIntakeSideBySide: React.FC<z.infer<typeof sideBySideSchema>> = ({
	mapOnly,
	counterfactual,
	timeline,
	clock,
}) => {
	const frame = useCurrentFrame();
	const step = Math.min(SCENES.length - 1, Math.floor(frame / STEP_LEN));
	const { title, Screen } = SCENES[step];
	const localFrame = frame % STEP_LEN;
	const accent = STEP_COLORS[step];

	// ステップが切り替わった瞬間だけ、右側を短く入れ直す
	const enter = interpolate(localFrame, [0, 14], [0, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				background: COLORS.bg,
				color: COLORS.textMain,
				fontFamily: '"Hiragino Sans", "Noto Sans CJK JP", sans-serif',
			}}
		>
			<div style={{ position: "absolute", left: FLOW.x + 4, top: 52 }}>
				<div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "0.02em" }}>
					1件の通報を、俯瞰と現場で同時に見る
				</div>
				<div style={{ fontSize: 19, color: COLORS.textSub, marginTop: 14 }}>
					FARLEAP / CLAIM INTAKE。左はエージェントの全体像、右はそのとき実際に出ている画面
				</div>
			</div>

			{clock && (
				<div style={{ position: "absolute", right: FLOW.x, top: 52 }}>
					<ElapsedClock frame={frame} />
				</div>
			)}

			{/* 左: 既存のフロー図をそのまま縮小して埋め込む */}
			<div
				style={{
					position: "absolute",
					left: FLOW.x,
					top: FLOW.y,
					width: FLOW.w,
					height: FLOW_H,
					borderRadius: 14,
					border: `1px solid ${COLORS.borderRest}`,
					overflow: "hidden",
				}}
			>
				<div
					style={{
						width: CANVAS_W,
						height: CANVAS_H,
						transform: `scale(${FLOW_SCALE})`,
						transformOrigin: "top left",
					}}
				>
					<AgentFlowClaimIntakeIcons
						nodeVariant="logoSeal"
						brandIcons
						hidePanel={mapOnly}
					/>
				</div>
			</div>

			<div
				style={{
					position: "absolute",
					left: FLOW.x + 4,
					top: FLOW.y + FLOW_H + 20,
					fontSize: 17,
					color: COLORS.textSub,
				}}
			>
				いま光っているところが、右の画面が起きている工程
			</div>

			{/* 右: 同じステップの現場 */}
			<div
				style={{
					position: "absolute",
					left: STAGE.x,
					top: STAGE.y,
					width: STAGE.w,
					borderLeft: `2px solid ${accent}`,
					paddingLeft: 30,
				}}
			>
				<div
					style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 10 }}
				>
					<span style={{ fontSize: 19, color: accent, fontFamily: "monospace" }}>
						{String(step + 1).padStart(2, "0")}
					</span>
					<span style={{ fontSize: 19, color: accent }}>{STEPS[step]}</span>
				</div>
				<div style={{ fontSize: 32, fontWeight: 700, marginBottom: 30 }}>{title}</div>
				<div style={{ opacity: enter, transform: `translateY(${(1 - enter) * 12}px)` }}>
					<Screen />
					{/* 時計や時間軸を出しているときは、出口で同じ数字を繰り返さない */}
					{step === SCENES.length - 1 && !clock && !timeline && <ElapsedSummary />}
				</div>
			</div>

			{/* 下段。縦に積める余地が1帯ぶんしか無いので、どちらか一方だけ置ける */}
			{(counterfactual || timeline) && (
				<div
					style={{
						position: "absolute",
						left: FLOW.x,
						right: FLOW.x,
						top: counterfactual ? 902 : 890,
					}}
				>
					{counterfactual ? (
						<Counterfactual step={step} />
					) : (
						<EventTimeline frame={frame} width={CANVAS_W - FLOW.x * 2} />
					)}
				</div>
			)}

			<div
				style={{
					position: "absolute",
					left: FLOW.x,
					right: 60,
					bottom: 34,
					height: 3,
					background: COLORS.grid,
				}}
			>
				<div
					style={{
						width: `${((frame + 1) / TOTAL_FRAMES) * 100}%`,
						height: "100%",
						background: accent,
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};
