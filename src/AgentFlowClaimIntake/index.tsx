import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadMPlusRounded1c } from "@remotion/google-fonts/MPLUSRounded1c";
import { loadFont as loadQuicksand } from "@remotion/google-fonts/Quicksand";
import { ServiceIcon } from "../AgentFlowCodexReClaude/components/ServiceIcon";
import {
	CANVAS_H,
	CANVAS_W,
	COLORS,
	EDGES,
	FRAME_H,
	FRAME_LABEL,
	FRAME_RADIUS,
	FRAME_SUBLABEL,
	FRAME_TAGLINE,
	FRAME_W,
	FRAME_X,
	FRAME_Y,
	LEGEND,
	LEGEND_POS,
	NODES,
	NODE_RADIUS,
	PANEL,
	PANEL_FOOTER,
	PANEL_ROWS,
	PANEL_SUBTITLE,
	PANEL_TITLE,
	PROGRESS,
	RECORD_HEADER,
	STEPS,
	STEP_BAR,
	STEP_COLORS,
	STEP_COUNT,
	STEP_LEN,
	TOTAL_FRAMES,
	type EdgeDef,
	type NodeDef,
	type NodeTone,
	type Point,
	type StepIndex,
} from "./constants";

const { fontFamily: jpFont } = loadMPlusRounded1c("normal", {
	weights: ["400", "500", "700"],
	subsets: ["japanese"],
	ignoreTooManyRequestsWarning: true,
});

const { fontFamily: enFont } = loadQuicksand("normal", {
	weights: ["500", "600"],
	subsets: ["latin"],
});

// --- 直角ルーティング -------------------------------------------------------

const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Point, s: number): Point => [a[0] * s, a[1] * s];
const dist = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const normalize = (a: Point): Point => {
	const len = Math.hypot(a[0], a[1]);
	return len === 0 ? [0, 0] : [a[0] / len, a[1] / len];
};

const CORNER_RADIUS = 18;

const roundedPath = (points: Point[]): string => {
	if (points.length < 2) return "";
	let d = `M ${points[0][0]} ${points[0][1]} `;
	for (let i = 1; i < points.length - 1; i++) {
		const prev = points[i - 1];
		const curr = points[i];
		const next = points[i + 1];
		const r = Math.min(CORNER_RADIUS, dist(prev, curr) / 2, dist(curr, next) / 2);
		const p1 = sub(curr, scale(normalize(sub(curr, prev)), r));
		const p2 = add(curr, scale(normalize(sub(next, curr)), r));
		d += `L ${p1[0]} ${p1[1]} Q ${curr[0]} ${curr[1]} ${p2[0]} ${p2[1]} `;
	}
	const last = points[points.length - 1];
	return `${d}L ${last[0]} ${last[1]}`;
};

const pointAtFraction = (points: Point[], t: number): Point => {
	const clamped = Math.max(0, Math.min(1, t));
	const total = points.slice(1).reduce((sum, p, i) => sum + dist(points[i], p), 0);
	let target = total * clamped;
	for (let i = 0; i < points.length - 1; i++) {
		const segment = dist(points[i], points[i + 1]);
		if (target <= segment || i === points.length - 2) {
			const ratio = segment === 0 ? 0 : target / segment;
			return [
				points[i][0] + (points[i + 1][0] - points[i][0]) * ratio,
				points[i][1] + (points[i + 1][1] - points[i][1]) * ratio,
			];
		}
		target -= segment;
	}
	return points[points.length - 1];
};

const midpoint = (points: Point[]): Point => pointAtFraction(points, 0.5);

const MARKER_COLORS = [
	COLORS.cyan,
	COLORS.violet,
	COLORS.orange,
	COLORS.green,
	COLORS.grey,
	COLORS.rule,
	COLORS.textSub,
];
const markerId = (color: string) => `ci-arrow-${color.replace("#", "")}`;

const TONE_PANEL: Record<NodeTone, string> = {
	input: COLORS.panelInput,
	ai: COLORS.panelAi,
	rule: COLORS.panelRule,
	human: COLORS.panelHuman,
	record: COLORS.panelRecord,
	planned: COLORS.panelInput,
};

const TONE_ACCENT: Record<NodeTone, string> = {
	input: COLORS.cyan,
	ai: COLORS.violet,
	rule: COLORS.rule,
	human: COLORS.orange,
	record: COLORS.green,
	planned: COLORS.grey,
};

/** 一定フレームで 0 から 1 へ。点灯の立ち上がりに使う */
const rampIn = (elapsed: number, frames = 10) => Math.max(0, Math.min(1, elapsed / frames));

export const AgentFlowClaimIntake: React.FC = () => {
	const frame = useCurrentFrame();
	const step = Math.min(STEP_COUNT - 1, Math.floor(frame / STEP_LEN)) as StepIndex;
	const localFrame = frame - step * STEP_LEN;

	return (
		<AbsoluteFill style={{ background: COLORS.bg, fontFamily: jpFont, color: COLORS.textMain }}>
			<BackgroundGrid />

			<svg width={CANVAS_W} height={CANVAS_H} style={{ position: "absolute", inset: 0 }}>
				<defs>
					<filter id="ci-glow" x="-60%" y="-60%" width="220%" height="220%">
						<feGaussianBlur stdDeviation="5" />
					</filter>
					{MARKER_COLORS.map((color) => (
						<marker
							key={color}
							id={markerId(color)}
							viewBox="0 0 10 10"
							refX="8"
							refY="5"
							markerWidth="6"
							markerHeight="6"
							orient="auto-start-reverse"
						>
							<path d="M0 0 L10 5 L0 10 Z" fill={color} />
						</marker>
					))}
				</defs>

				<rect
					x={FRAME_X}
					y={FRAME_Y}
					width={FRAME_W}
					height={FRAME_H}
					rx={FRAME_RADIUS}
					fill="none"
					stroke={COLORS.frame}
					strokeWidth={2}
				/>

				{EDGES.map((edge) => (
					<Edge
						key={edge.id}
						edge={edge}
						active={edge.step === step && localFrame >= (edge.delay ?? 0)}
						localFrame={localFrame}
					/>
				))}
			</svg>

			<EdgeLabels step={step} />
			<FrameLabel />
			<RecordHeader />
			<StepBar step={step} />
			<Legend />

			{NODES.map((node) => (
				<NodeCard key={node.id} node={node} step={step} localFrame={localFrame} />
			))}

			<AsymmetryPanel step={step} localFrame={localFrame} />
			<ProgressBar frame={frame} step={step} />
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

const Edge: React.FC<{ edge: EdgeDef; active: boolean; localFrame: number }> = ({
	edge,
	active,
	localFrame,
}) => {
	const d = roundedPath(edge.points);
	const stroke = active ? edge.color : COLORS.textSub;
	const elapsed = localFrame - (edge.delay ?? 0);
	const travel = rampIn(elapsed, STEP_LEN - (edge.delay ?? 0) - 12);
	const [dotX, dotY] = pointAtFraction(edge.points, travel);

	return (
		<g>
			{active && (
				<path d={d} stroke={edge.color} strokeWidth={5} fill="none" opacity={0.3} filter="url(#ci-glow)" />
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
				markerEnd={`url(#${markerId(stroke)})`}
			/>
			{active && <circle cx={dotX} cy={dotY} r={5.5} fill={edge.color} filter="url(#ci-glow)" />}
		</g>
	);
};

/** エッジに添える短い注記。線の中点に置く */
const EdgeLabels: React.FC<{ step: StepIndex }> = ({ step }) => (
	<>
		{EDGES.filter((edge) => edge.label).map((edge) => {
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

const NodeCard: React.FC<{ node: NodeDef; step: StepIndex; localFrame: number }> = ({
	node,
	step,
	localFrame,
}) => {
	const isActive = node.steps.includes(step);
	const glow = isActive ? rampIn(localFrame) : 0;
	const accent = TONE_ACCENT[node.tone];
	const border = isActive ? accent : COLORS.borderRest;

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
				<div style={{ fontFamily: enFont, fontSize: 15, fontWeight: 600, color: isActive ? accent : COLORS.textMain }}>
					{node.jp}
				</div>
				<div style={{ fontSize: 10.5, color: COLORS.textMain, opacity: 0.6, marginTop: 2 }}>{node.en}</div>
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
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
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
					// 「セーフティルール」のような長い見出しだけ一段落とし、
					// カード幅 208px に1行で収める
					fontSize: node.jp.length >= 7 ? 20 : 25,
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

/** ServiceIcon は 56px 固定なので、必要なサイズへ縮めて使う */
const IconGlyph: React.FC<{ name: NonNullable<NodeDef["icon"]>; size: number }> = ({ name, size }) => (
	<span
		style={{
			display: "block",
			width: size,
			height: size,
			lineHeight: 0,
			transform: `scale(${size / 56})`,
			transformOrigin: "top left",
		}}
	>
		<ServiceIcon name={name} />
	</span>
);

/**
 * この図の山場。AI の生出力とルールの結論を並べ、両方が残ることを見せる。
 * 値は進行に合わせて1行ずつ現れる。上書きのアニメーションは作らない。
 */
const AsymmetryPanel: React.FC<{ step: StepIndex; localFrame: number }> = ({ step, localFrame }) => {
	const isHero = step === 3;
	const heroGlow = isHero ? rampIn(localFrame, 14) : 0;

	return (
		<div
			style={{
				position: "absolute",
				left: PANEL.x,
				top: PANEL.y,
				width: PANEL.w,
				height: PANEL.h,
				boxSizing: "border-box",
				borderRadius: NODE_RADIUS,
				background: COLORS.panelRule,
				border: `1.5px solid ${isHero ? COLORS.rule : COLORS.borderRest}`,
				boxShadow: heroGlow > 0 ? `0 0 ${34 * heroGlow}px 3px ${COLORS.rule}22` : "none",
				padding: "18px 22px",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
				<span style={{ fontSize: 19, fontWeight: 700, color: isHero ? "#FFFFFF" : COLORS.textMain }}>
					{PANEL_TITLE}
				</span>
				<span style={{ fontSize: 11.5, color: COLORS.textSub }}>{PANEL_SUBTITLE}</span>
			</div>

			<div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
				{PANEL_ROWS.map((row) => {
					const revealed = step >= row.revealStep;
					const justRevealed = step === row.revealStep;
					const reveal = revealed ? (justRevealed ? rampIn(localFrame, 12) : 1) : 0;
					return (
						<React.Fragment key={row.label}>
							{row.emphasis && (
								<div style={{ height: 1, background: COLORS.borderRest, margin: "3px 0" }} />
							)}
							<div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.25 + 0.75 * reveal }}>
								<span style={{ fontSize: 13, color: COLORS.textSub, width: 128, flexShrink: 0 }}>
									{row.label}
								</span>
								<span
									style={{
										fontFamily: enFont,
										fontSize: row.emphasis ? 26 : 22,
										fontWeight: 600,
										color: reveal > 0 ? row.color : COLORS.textSub,
										width: 44,
										flexShrink: 0,
									}}
								>
									{reveal > 0 ? row.value : "--"}
								</span>
								<span
									style={{
										fontSize: 11.5,
										color: COLORS.textMain,
										opacity: 0.66,
										...(row.emphasis && reveal > 0
											? {
													background: COLORS.rule,
													color: COLORS.bg,
													opacity: 1,
													padding: "2px 8px",
													borderRadius: 4,
													fontWeight: 700,
												}
											: {}),
									}}
								>
									{row.note}
								</span>
							</div>
						</React.Fragment>
					);
				})}
			</div>

			<div
				style={{
					marginTop: "auto",
					fontSize: 12.5,
					color: step >= 5 ? COLORS.orange : COLORS.textSub,
					fontWeight: step >= 5 ? 700 : 400,
				}}
			>
				{PANEL_FOOTER}
			</div>
		</div>
	);
};

const RecordHeader: React.FC = () => (
	<div style={{ position: "absolute", left: RECORD_HEADER.x, top: RECORD_HEADER.y }}>
		<span style={{ fontFamily: enFont, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", color: COLORS.textSub }}>
			RECORDS / APPEND-ONLY
		</span>
	</div>
);

const FrameLabel: React.FC = () => (
	<div
		style={{
			position: "absolute",
			left: FRAME_X + 20,
			right: CANVAS_W - FRAME_X - FRAME_W + 20,
			top: FRAME_Y,
			transform: "translateY(-50%)",
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
		}}
	>
		<div style={{ display: "flex", alignItems: "center", gap: 7, background: COLORS.bg, padding: "2px 8px" }}>
			<svg width={14} height={14} viewBox="0 0 22 22">
				<path d="M11 1 L20 6.5 V15.5 L11 21 L2 15.5 V6.5 Z" fill="none" stroke={COLORS.frame} strokeWidth={2} />
				<circle cx={11} cy={11} r={3.5} fill={COLORS.frame} />
			</svg>
			<span style={{ fontFamily: enFont, fontSize: 14, fontWeight: 600, letterSpacing: "0.06em" }}>
				{FRAME_LABEL}
			</span>
			<span style={{ fontFamily: enFont, fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", color: COLORS.textSub }}>
				{FRAME_SUBLABEL}
			</span>
		</div>
		<span style={{ fontSize: 13, color: COLORS.textSub, background: COLORS.bg, padding: "2px 8px" }}>
			{FRAME_TAGLINE}
		</span>
	</div>
);

const StepBar: React.FC<{ step: StepIndex }> = ({ step }) => (
	<div
		style={{
			position: "absolute",
			top: STEP_BAR.top,
			left: STEP_BAR.left,
			display: "flex",
			alignItems: "center",
		}}
	>
		{STEPS.map((label, i) => {
			const isCurrent = step === i;
			const color = isCurrent ? STEP_COLORS[i] : COLORS.textSub;
			return (
				<React.Fragment key={label}>
					{i > 0 && <div style={{ width: 18, height: 1.5, background: COLORS.grey, margin: "0 6px" }} />}
					<div style={{ display: "flex", alignItems: "center", gap: 7, color }}>
						<span
							style={{
								width: STEP_BAR.badge,
								height: STEP_BAR.badge,
								borderRadius: "50%",
								border: `1.5px solid ${color}`,
								background: isCurrent ? color : "transparent",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								flexShrink: 0,
								fontFamily: enFont,
								fontSize: 12,
								fontWeight: 600,
								color: isCurrent ? COLORS.bg : COLORS.textSub,
							}}
						>
							{i + 1}
						</span>
						<span style={{ fontSize: 16, fontWeight: 500, whiteSpace: "nowrap" }}>{label}</span>
					</div>
				</React.Fragment>
			);
		})}
	</div>
);

const Legend: React.FC = () => (
	<div
		style={{
			position: "absolute",
			top: LEGEND_POS.top,
			right: LEGEND_POS.right,
			height: STEP_BAR.badge,
			display: "flex",
			alignItems: "center",
			gap: 14,
		}}
	>
		{LEGEND.map(([color, label]) => (
			<div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<span style={{ width: 16, height: 2, background: color }} />
				<span style={{ fontSize: 12, color: COLORS.textSub, whiteSpace: "nowrap" }}>{label}</span>
			</div>
		))}
		<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
			<span style={{ width: 16, height: 0, borderTop: `2px dashed ${COLORS.textSub}` }} />
			<span style={{ fontSize: 12, color: COLORS.textSub, whiteSpace: "nowrap" }}>未実装・通らない経路</span>
		</div>
	</div>
);

const ProgressBar: React.FC<{ frame: number; step: StepIndex }> = ({ frame, step }) => (
	<div
		style={{
			position: "absolute",
			left: PROGRESS.x,
			top: PROGRESS.y,
			width: PROGRESS.w,
			height: 2,
			background: COLORS.grid,
			borderRadius: 1,
		}}
	>
		<div
			style={{
				height: "100%",
				width: `${((frame + 1) / TOTAL_FRAMES) * 100}%`,
				background: STEP_COLORS[step],
				borderRadius: 1,
			}}
		/>
	</div>
);
