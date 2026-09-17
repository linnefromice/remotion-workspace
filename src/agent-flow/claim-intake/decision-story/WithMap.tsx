import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { AgentFlowClaimIntakeIcons } from "../icons";
import { CANVAS_H, CANVAS_W, COLORS } from "../cards/constants";
import { ClaimIntakeDecisionStory } from ".";

/**
 * DecisionStory に、フロー図を地図として添えたもの。
 *
 * DecisionStory は図をやめて文字で見せる版なので、遠くからでも読める代わりに
 * 「どこからどこへ流れているのか」が分からない（docs/presentation-site-variants.md §3）。
 * そこを既存のフロー図で埋める。
 *
 * どちらも 1920x1080 を前提に作られているので、**2枚とも読める大きさでは収まらない**。
 * 主役は DecisionStory のままにして、フロー図は「いまどこの話か」だけを示す
 * 地図まで小さくしている。判定の値は DecisionStory 側が言うので、
 * 埋め込むフロー図からは判定パネルを外している（hidePanel）。
 */

export const withMapSchema = z.object({
	/** side: 横に並べる / stacked: 縦に積む */
	layout: z.enum(["side", "stacked"]),
});

export const withMapDefaults = { layout: "side" } as const;
export const withMapStacked = { layout: "stacked" } as const;

/** 横に並べたとき。上端をそろえ、全体を縦の中央に置く */
const SIDE = {
	story: { scale: 0.68, x: 44, y: (CANVAS_H - CANVAS_H * 0.68) / 2 },
	map: { scale: 0.255, x: 1386, y: (CANVAS_H - CANVAS_H * 0.68) / 2 },
};

/** 縦に積んだとき。どちらも横位置を中央にそろえる */
const STACKED = {
	story: { scale: 0.62, x: (CANVAS_W - CANVAS_W * 0.62) / 2, y: 30 },
	map: { scale: 0.26, x: (CANVAS_W - CANVAS_W * 0.26) / 2, y: 30 + CANVAS_H * 0.62 + 26 },
};

/** 1920x1080 の作りものを、指定の倍率で切り抜いて置く */
const Embed: React.FC<{
	scale: number;
	x: number;
	y: number;
	children: React.ReactNode;
}> = ({ scale, x, y, children }) => (
	<div
		style={{
			position: "absolute",
			left: x,
			top: y,
			width: CANVAS_W * scale,
			height: CANVAS_H * scale,
			borderRadius: 12,
			border: `1px solid ${COLORS.borderRest}`,
			overflow: "hidden",
		}}
	>
		<div
			style={{
				width: CANVAS_W,
				height: CANVAS_H,
				transform: `scale(${scale})`,
				transformOrigin: "top left",
			}}
		>
			{children}
		</div>
	</div>
);

export const ClaimIntakeDecisionStoryWithMap: React.FC<z.infer<typeof withMapSchema>> = ({
	layout,
}) => {
	const place = layout === "side" ? SIDE : STACKED;

	return (
		<AbsoluteFill
			style={{
				background: "#101619",
				color: "#f3f3ea",
				fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif',
			}}
		>
			<Embed {...place.story}>
				<ClaimIntakeDecisionStory showComparison />
			</Embed>

			<Embed {...place.map}>
				<AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons hidePanel />
			</Embed>

			{/* 地図の役割だけ言う。工程名は DecisionStory 側が出しているので繰り返さない */}
			<div
				style={{
					position: "absolute",
					left: place.map.x,
					top: place.map.y + CANVAS_H * place.map.scale + 16,
					width: CANVAS_W * place.map.scale,
					fontSize: 17,
					color: "#a8b6bb",
					textAlign: layout === "side" ? "left" : "center",
				}}
			>
				全体の経路。光っているところが、{layout === "side" ? "左" : "上"}で話している工程
			</div>
		</AbsoluteFill>
	);
};
