import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadMPlusRounded1c } from "@remotion/google-fonts/MPLUSRounded1c";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";
import { roundedPath, pointAtFraction, type Point } from "./orthogonalRouting";
import { ArrowMarkerDefs, arrowMarkerId } from "./ArrowMarkers";
import { IconGlyph } from "./IconGlyph";
import { BrandSealNode, type ChannelBrand } from "./BrandSealNode";
import { FlowServiceNode } from "./FlowServiceNode";
import {
	CANVAS_H,
	CANVAS_W,
	COLORS,
	NODE_RADIUS,
	TONE_ACCENT,
	TONE_PANEL,
	type EdgeDef,
	type FlowSpec,
	type NodeDef,
} from "./flowTheme";

/**
 * フロー図1枚の描画。図ごとの違いは `FlowSpec`（データ）だけに閉じる。
 *
 * ClaimIntake / Inquiry は先に作ったので自前の描画を持っている。
 * この共有版は Restoration / Proposal 以降が使う。
 * 描画の作法は docs/agent-flow-diagram-patterns.md にまとめてある。
 */

const { fontFamily: jpFont } = loadMPlusRounded1c("normal", {
	weights: ["400", "500", "700"],
	subsets: ["japanese"],
	ignoreTooManyRequestsWarning: true,
});

const { fontFamily: enFont } = loadQuicksand("normal", {
	weights: ["500", "600"],
	subsets: ["latin"],
});

/** 角の丸め。ルーティング本体は shared/orthogonalRouting.ts */
const CORNER_RADIUS = 18;

const midpoint = (points: Point[]): Point => pointAtFraction(points, 0.5);

/** 一定フレームで 0 から 1 へ。点灯の立ち上がりに使う */
const rampIn = (elapsed: number, frames = 10) => Math.max(0, Math.min(1, elapsed / frames));

/**
 * ノードの見た目の版。構造とタイムラインは共有し、差分は描き方だけに閉じる。
 * docs/agent-flow-diagram-patterns.md §6
 */
export type DiagramVariant = "cards" | "logoSeal" | "actionRow";

export const FlowDiagram: React.FC<{
	spec: FlowSpec;
	variant?: DiagramVariant;
	/** ロゴを持つノードだけ実ロゴに差し替える（IconsV2） */
	brandIcons?: boolean;
}> = ({ spec, variant = "cards", brandIcons = false }) => {
	const frame = useCurrentFrame();
	const total = spec.stepLen * spec.steps.length;
	const step = Math.min(spec.steps.length - 1, Math.floor(frame / spec.stepLen));
	const localFrame = frame - step * spec.stepLen;
	const glowId = `${spec.markerPrefix}glow`;

	return (
		<AbsoluteFill style={{ background: COLORS.bg, fontFamily: jpFont, color: COLORS.textMain }}>
			<BackgroundGrid />

			<svg width={CANVAS_W} height={CANVAS_H} style={{ position: "absolute", inset: 0 }}>
				<defs>
					<filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
						<feGaussianBlur stdDeviation="5" />
					</filter>
					<ArrowMarkerDefs
						prefix={spec.markerPrefix}
						colors={[...spec.stepColors, COLORS.grey, COLORS.textSub, COLORS.rule]}
					/>
				</defs>

				<rect
					x={spec.frame.x}
					y={spec.frame.y}
					width={spec.frame.w}
					height={spec.frame.h}
					rx={spec.frame.radius}
					fill="none"
					stroke={COLORS.frame}
					strokeWidth={2}
				/>

				{spec.edges.map((edge) => (
					<Edge
						key={edge.id}
						edge={edge}
						prefix={spec.markerPrefix}
						glowId={glowId}
						stepLen={spec.stepLen}
						active={edge.step === step && localFrame >= (edge.delay ?? 0)}
						localFrame={localFrame}
					/>
				))}
			</svg>

			<EdgeLabels edges={spec.edges} step={step} />
			<FrameLabel spec={spec} />
			<Notes spec={spec} />
			<StepBar spec={spec} step={step} />
			<Legend spec={spec} />

			{spec.nodes.map((node) => (
				<NodeCard
					key={node.id}
					node={node}
					step={step}
					localFrame={localFrame}
					variant={variant}
					brand={brandIcons ? spec.brands?.[node.id] : undefined}
				/>
			))}

			<HeroPanel spec={spec} step={step} localFrame={localFrame} />
			<ProgressBar spec={spec} frame={frame} total={total} step={step} />
		</AbsoluteFill>
	);
};

const BackgroundGrid: React.FC = () => (
	<>
		<div
			style={{
				position: "absolute",
				inset: 0,
				backgroundImage: `linear-gradient(${COLORS.grid} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.grid} 1px, transparent 1px)`,
				backgroundSize: "48px 48px",
			}}
		/>
		<div
			style={{
				position: "absolute",
				inset: 0,
				background: `radial-gradient(ellipse at 50% 42%, transparent 40%, ${COLORS.bg} 96%)`,
			}}
		/>
	</>
);

const Edge: React.FC<{
	edge: EdgeDef;
	prefix: string;
	glowId: string;
	stepLen: number;
	active: boolean;
	localFrame: number;
}> = ({ edge, prefix, glowId, stepLen, active, localFrame }) => {
	const d = roundedPath(edge.points, CORNER_RADIUS);
	const stroke = active ? edge.color : COLORS.textSub;
	const elapsed = localFrame - (edge.delay ?? 0);
	const travel = rampIn(elapsed, stepLen - (edge.delay ?? 0) - 12);
	const [dotX, dotY] = pointAtFraction(edge.points, travel);

	return (
		<g>
			{active && (
				<path
					d={d}
					stroke={edge.color}
					strokeWidth={5}
					fill="none"
					opacity={0.3}
					filter={`url(#${glowId})`}
				/>
			)}
			<path
				d={d}
				stroke={stroke}
				strokeWidth={active ? 2 : 1.25}
				fill="none"
				strokeDasharray={edge.dashed ? "7 7" : active ? "12 9" : undefined}
				strokeDashoffset={active ? -elapsed * 3 : 0}
				opacity={active ? 1 : edge.step === null ? 0.24 : 0.32}
				strokeLinecap="round"
				markerEnd={`url(#${arrowMarkerId(prefix, stroke)})`}
			/>
			{active && (
				<circle cx={dotX} cy={dotY} r={5.5} fill={edge.color} filter={`url(#${glowId})`} />
			)}
		</g>
	);
};

/** エッジに添える短い注記。線の中点に置く */
const EdgeLabels: React.FC<{ edges: EdgeDef[]; step: number }> = ({ edges, step }) => (
	<>
		{edges
			.filter((edge) => edge.label)
			.map((edge) => {
				const [x, y] = midpoint(edge.points);
				const active = edge.step === step;
				return (
					<div
						key={edge.id}
						style={{
							position: "absolute",
							left: x,
							top: y - 22,
							transform: "translateX(-50%)",
							fontSize: 11,
							color: active ? edge.color : COLORS.textSub,
							background: COLORS.bg,
							padding: "1px 6px",
							borderRadius: 4,
							whiteSpace: "nowrap",
							opacity: active ? 1 : 0.6,
						}}
					>
						{edge.label}
					</div>
				);
			})}
	</>
);

const NodeCard: React.FC<{
	node: NodeDef;
	step: number;
	localFrame: number;
	variant: DiagramVariant;
	brand?: ChannelBrand;
}> = ({ node, step, localFrame, variant, brand }) => {
	const isActive = node.steps.includes(step);
	const glow = isActive ? rampIn(localFrame) : 0;
	const accent = TONE_ACCENT[node.tone];
	const border = isActive ? accent : COLORS.borderRest;

	// 記録層と小さな入力元は、版が変わってもいつもの箱のまま
	if (variant !== "cards" && !node.record && !node.plain) {
		// 部品側の左右のポートが、カードの左右の辺の中点に一致するよう置く
		const portOffset = variant === "actionRow" ? 52 : 64;
		return (
			<div style={{ position: "absolute", left: node.cx - 104, top: node.cy - portOffset }}>
				{brand ? (
					<BrandSealNode
						brand={brand}
						role={node.jp}
						action={node.action ?? node.desc}
						active={isActive}
						planned={node.dashed}
					/>
				) : (
					<FlowServiceNode
						variant={variant}
						icon={node.icon ?? "database"}
						title={node.jp}
						action={node.action ?? node.desc}
						service={node.en}
						color={accent}
						active={isActive}
						dashed={node.dashed}
					/>
				)}
			</div>
		);
	}

	if (node.record) {
		return (
			<div
				style={{
					position: "absolute",
					left: node.cx - node.w / 2,
					top: node.cy - node.h / 2,
					width: node.w,
					height: node.h,
					boxSizing: "border-box",
					borderRadius: 8,
					background: TONE_PANEL[node.tone],
					border: `1.5px solid ${border}`,
					boxShadow: glow > 0 ? `0 0 ${20 * glow}px 1px ${accent}33` : "none",
					padding: "10px 14px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					opacity: isActive ? 1 : 0.5,
				}}
			>
				<div
					style={{
						fontFamily: enFont,
						fontSize: 15,
						fontWeight: 600,
						color: isActive ? accent : COLORS.textMain,
					}}
				>
					{node.jp}
				</div>
				<div style={{ fontSize: 10.5, color: COLORS.textMain, opacity: 0.6, marginTop: 2 }}>
					{node.en}
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				position: "absolute",
				left: node.cx - node.w / 2,
				top: node.cy - node.h / 2,
				width: node.w,
				height: node.h,
				boxSizing: "border-box",
				borderRadius: NODE_RADIUS,
				background: TONE_PANEL[node.tone],
				border: `1.5px ${node.dashed ? "dashed" : "solid"} ${border}`,
				boxShadow: glow > 0 ? `0 0 ${26 * glow}px 2px ${accent}33` : "none",
				padding: "14px 16px",
				display: "flex",
				flexDirection: "column",
				opacity: isActive ? 1 : node.dashed ? 0.4 : 0.58,
			}}
		>
			<div
				style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}
			>
				<span
					style={{
						fontFamily: enFont,
						fontSize: 11,
						fontWeight: 600,
						letterSpacing: "0.07em",
						color: COLORS.textSub,
						lineHeight: 1.3,
					}}
				>
					{node.en}
				</span>
				{node.icon && (
					<span style={{ color: isActive ? accent : COLORS.textSub, display: "flex", flexShrink: 0 }}>
						<IconGlyph name={node.icon} size={22} />
					</span>
				)}
			</div>

			<div
				style={{
					// 長い見出しだけ一段落として、カード幅に1行で収める
					fontSize: node.jp.length >= 9 ? 17 : node.jp.length >= 7 ? 20 : 25,
					fontWeight: 500,
					letterSpacing: "0.03em",
					color: isActive ? "#FFFFFF" : COLORS.textMain,
					lineHeight: 1.1,
					marginTop: 6,
					whiteSpace: "nowrap",
				}}
			>
				{node.jp}
			</div>

			<div
				style={{
					fontSize: 12,
					color: COLORS.textMain,
					opacity: 0.62,
					lineHeight: 1.35,
					marginTop: 5,
				}}
			>
				{node.desc}
			</div>
		</div>
	);
};

/**
 * 図の山場。AIの生出力とルールの結論を並べ、両方が残ることを見せる。
 * 値は進行に合わせて1行ずつ現れる。上書きのアニメーションは作らない。
 */
const HeroPanel: React.FC<{ spec: FlowSpec; step: number; localFrame: number }> = ({
	spec,
	step,
	localFrame,
}) => {
	const { panel } = spec;
	const isHero = step === panel.heroStep;
	const heroGlow = isHero ? rampIn(localFrame, 14) : 0;

	return (
		<div
			style={{
				position: "absolute",
				left: panel.x,
				top: panel.y,
				width: panel.w,
				boxSizing: "border-box",
				borderRadius: 14,
				border: `1.5px solid ${isHero ? COLORS.rule : COLORS.borderRest}`,
				background: "#131A26",
				boxShadow: heroGlow > 0 ? `0 0 ${30 * heroGlow}px 2px ${COLORS.rule}22` : "none",
				padding: "18px 22px",
			}}
		>
			<div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "0.04em" }}>{panel.title}</div>
			<div style={{ fontSize: 12, color: COLORS.textSub, marginTop: 5 }}>{panel.subtitle}</div>

			{panel.rows.map((row) => {
				const shown = step >= row.revealStep;
				return (
					<div
						key={row.label}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 14,
							marginTop: 11,
							color: shown ? row.color : COLORS.textSub,
						}}
					>
						<span style={{ width: 132, fontSize: 13 }}>{row.label}</span>
						<strong
							style={{
								fontSize: row.emphasis ? 24 : 20,
								minWidth: 96,
								fontWeight: row.emphasis ? 700 : 500,
							}}
						>
							{shown ? row.value : "—"}
						</strong>
						<span style={{ fontSize: 11, color: COLORS.textSub }}>{shown ? row.note : ""}</span>
					</div>
				);
			})}

			<div style={{ fontSize: 12.5, color: COLORS.orange, marginTop: 14 }}>{panel.footer}</div>
		</div>
	);
};

/** 枠の外に置く短い注記。「破線＝任意」などの読み方を添える */
const Notes: React.FC<{ spec: FlowSpec }> = ({ spec }) => (
	<>
		{(spec.notes ?? []).map((note) => (
			<div
				key={note.text}
				style={{
					position: "absolute",
					left: note.x,
					top: note.y,
					fontSize: 12,
					lineHeight: 1.5,
					color: note.color ?? COLORS.textSub,
					background: COLORS.bg,
					padding: "2px 6px",
					borderRadius: 4,
					whiteSpace: "pre-line",
				}}
			>
				{note.text}
			</div>
		))}
	</>
);

const FrameLabel: React.FC<{ spec: FlowSpec }> = ({ spec }) => (
	<>
		<div
			style={{
				position: "absolute",
				left: spec.frame.x + 18,
				top: spec.frame.y - 13,
				background: COLORS.bg,
				padding: "0 10px",
				fontFamily: enFont,
				fontSize: 13,
				fontWeight: 600,
				letterSpacing: "0.12em",
				color: COLORS.frame,
			}}
		>
			{spec.label}
			<span style={{ color: COLORS.textSub, marginLeft: 8 }}>{spec.sublabel}</span>
		</div>
		{spec.recordHeader && (
			<div
				style={{
					position: "absolute",
					left: spec.recordHeader.x,
					top: spec.recordHeader.y,
					fontFamily: enFont,
					fontSize: 12,
					fontWeight: 600,
					letterSpacing: "0.1em",
					color: COLORS.green,
				}}
			>
				{spec.recordHeader.text}
			</div>
		)}
	</>
);

const StepBar: React.FC<{ spec: FlowSpec; step: number }> = ({ spec, step }) => (
	<>
		<div style={{ position: "absolute", left: 60, top: 26, display: "flex", gap: 22 }}>
			{spec.steps.map((label, i) => {
				const current = i === step;
				return (
					<div
						key={label}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							fontSize: 15,
							color: current ? spec.stepColors[i] : COLORS.textSub,
							opacity: current ? 1 : 0.7,
						}}
					>
						<span
							style={{
								width: 22,
								height: 22,
								borderRadius: "50%",
								border: `1px solid ${current ? spec.stepColors[i] : COLORS.borderRest}`,
								display: "grid",
								placeItems: "center",
								fontFamily: enFont,
								fontSize: 11,
								fontWeight: 600,
							}}
						>
							{i + 1}
						</span>
						{label}
					</div>
				);
			})}
		</div>
		<div
			style={{
				position: "absolute",
				right: 60,
				top: 30,
				fontSize: 16,
				color: COLORS.textMain,
				opacity: 0.85,
			}}
		>
			{spec.tagline}
		</div>
	</>
);

const Legend: React.FC<{ spec: FlowSpec }> = ({ spec }) => (
	<div
		style={{
			position: "absolute",
			right: 60,
			top: 66,
			display: "flex",
			gap: 16,
			fontSize: 12,
			color: COLORS.textSub,
		}}
	>
		{spec.legend.map(([color, label]) => (
			<span key={label} style={{ color }}>
				━ <span style={{ color: COLORS.textSub }}>{label}</span>
			</span>
		))}
	</div>
);

const ProgressBar: React.FC<{ spec: FlowSpec; frame: number; total: number; step: number }> = ({
	spec,
	frame,
	total,
	step,
}) => (
	<div
		style={{
			position: "absolute",
			left: spec.frame.x,
			width: spec.frame.w,
			top: 1012,
			height: 3,
			background: COLORS.grid,
		}}
	>
		<div
			style={{
				width: `${((frame + 1) / total) * 100}%`,
				height: "100%",
				background: spec.stepColors[step],
			}}
		/>
	</div>
);
