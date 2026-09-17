import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AgentFlowClaimIntakeIcons } from "../AgentFlowClaimIntakeIcons";
import {
	CANVAS_H,
	CANVAS_W,
	COLORS,
	STEPS,
	STEP_COLORS,
	STEP_LEN,
	TOTAL_FRAMES,
} from "../AgentFlowClaimIntake/constants";
import { Counterfactual, Scene, SCENE_TITLES } from "./scenes";

/**
 * プレゼン用1枚サイトの仮置き版。検討メモ: docs/presentation-site.md
 *
 * 既存のフロー図をそのまま縮小して左に置き、右に同じステップの「現場」を出す。
 * フロー図側は `useCurrentFrame()` だけで状態が決まるので、
 * 同期のためのコードは要らない（縮小して埋めるだけで勝手に揃う）。
 *
 * 尺・ステップ割りは ClaimIntake と共有している（28秒 / 7ステップ）。
 */

/** 左に置くフロー図の枠。1920x1080 をこの幅に収める */
const FLOW = { x: 56, y: 200, w: 1140 };
const FLOW_SCALE = FLOW.w / CANVAS_W; // 0.59375
const FLOW_H = CANVAS_H * FLOW_SCALE; // 641.25

/** 右カラム。x + paddingLeft + w が、左端と同じ 56px の余白で終わるようにする */
const STAGE = { x: 1244, y: 150, w: 590 };

export const ClaimIntakeSideBySide: React.FC<{
	/** 埋め込むフロー図から判定の非対称パネルを外し、地図に徹させる（メモ §4-2） */
	mapOnly?: boolean;
	/** 余っている下段に、ルールの有無で結末が変わることを置く（メモ §3-1 / §4-3） */
	counterfactual?: boolean;
}> = ({ mapOnly = false, counterfactual = false }) => {
	const frame = useCurrentFrame();
	const step = Math.min(STEPS.length - 1, Math.floor(frame / STEP_LEN));
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
				<div style={{ fontSize: 32, fontWeight: 700, marginBottom: 30 }}>
					{SCENE_TITLES[step]}
				</div>
				<div style={{ opacity: enter, transform: `translateY(${(1 - enter) * 12}px)` }}>
					<Scene step={step} />
				</div>
			</div>

			{counterfactual && (
				<div
					style={{
						position: "absolute",
						left: FLOW.x,
						right: FLOW.x,
						top: 902,
					}}
				>
					<Counterfactual step={step} />
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

/** 案1: 左のフロー図を地図に徹させ、左右で同じことを言わないようにする */
export const ClaimIntakeSideBySideMap: React.FC = () => <ClaimIntakeSideBySide mapOnly />;

/** 案2: 余っている下段に、ルールの有無で結末が変わることを置く */
export const ClaimIntakeSideBySideCounterfactual: React.FC = () => (
	<ClaimIntakeSideBySide counterfactual />
);
