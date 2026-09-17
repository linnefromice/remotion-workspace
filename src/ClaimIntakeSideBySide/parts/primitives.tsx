import React from "react";
import { COLORS } from "../../AgentFlowClaimIntake/constants";

/**
 * 「現場」の画面を組み立てる小部品。
 *
 * どれも `src/ClaimIntakeSideBySide/scenes/` からしか使わない想定だが、
 * 等幅フォントの指定（MONO）だけは下段の帯とも共有している。
 */

export const MONO = '"SF Mono", Menlo, Consolas, monospace';

/** シナリオ全体で使い回す1件の通報 */
export const TICKET = "#2026-0917-014";

// --- 小さな部品 -------------------------------------------------------------

export const Caption: React.FC<{ color?: string; children: React.ReactNode }> = ({
	color = COLORS.textSub,
	children,
}) => (
	<div style={{ fontSize: 17, lineHeight: 1.8, color, marginTop: 22 }}>
		{children}
	</div>
);

/**
 * JSON や CSV を出す等幅のブロック。
 * CSV のヘッダ行だけは1行が長いので、呼び出し側で size を落とす。
 */
export const CodeBlock: React.FC<{
	children: React.ReactNode;
	accent: string;
	size?: number;
}> = ({ children, accent, size = 18 }) => (
	<pre
		style={{
			margin: 0,
			padding: "20px 22px",
			background: "#0D131D",
			border: `1px solid ${COLORS.borderRest}`,
			borderLeft: `3px solid ${accent}`,
			borderRadius: 10,
			fontFamily: MONO,
			fontSize: size,
			lineHeight: 1.85,
			color: "#C9D6E6",
			whiteSpace: "pre",
			overflow: "hidden",
		}}
	>
		{children}
	</pre>
);

/** JSON の値だけ色を付ける。強調したい行は em で太らせる */
export const V: React.FC<{ color?: string; em?: boolean; children: React.ReactNode }> = ({
	color = "#9FE8C6",
	em,
	children,
}) => (
	<span style={{ color, fontWeight: em ? 700 : 400 }}>{children}</span>
);

export const Badge: React.FC<{ color: string; filled?: boolean; children: React.ReactNode }> = ({
	color,
	filled,
	children,
}) => (
	<span
		style={{
			display: "inline-block",
			padding: "4px 12px",
			borderRadius: 6,
			fontSize: 16,
			border: `1px solid ${color}`,
			background: filled ? color : "transparent",
			color: filled ? "#0A101A" : color,
			fontWeight: filled ? 700 : 400,
		}}
	>
		{children}
	</span>
);

/** 入居者のスマホ。LINE のトーク画面に寄せる */
export const Phone: React.FC<{ children: React.ReactNode }> = ({ children }) => (
	<div
		style={{
			width: 330,
			height: 470,
			borderRadius: 26,
			border: "6px solid #1B2432",
			background: "#8CA9C4",
			padding: "16px 14px",
			boxSizing: "border-box",
			display: "flex",
			flexDirection: "column",
			gap: 12,
			overflow: "hidden",
		}}
	>
		{children}
	</div>
);

export const Bubble: React.FC<{ mine?: boolean; children: React.ReactNode }> = ({
	mine,
	children,
}) => (
	<div style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
		<div
			style={{
				maxWidth: 250,
				padding: "10px 14px",
				borderRadius: 14,
				background: mine ? "#8DE055" : "#FFFFFF",
				color: "#12202C",
				fontSize: 16,
				lineHeight: 1.7,
			}}
		>
			{children}
		</div>
	</div>
);

/** 送られた写真の代わり。実物が無いので枠とラベルだけ置く */
export const PhotoStub: React.FC = () => (
	<div style={{ display: "flex", justifyContent: "flex-end" }}>
		<div
			style={{
				width: 160,
				height: 110,
				borderRadius: 12,
				background: "#5C6B7A",
				border: "2px solid #8DE055",
				display: "grid",
				placeItems: "center",
				color: "#D8E2EC",
				fontSize: 14,
			}}
		>
			シンク下の写真
		</div>
	</div>
);

/** ラベルと値を横に並べる行。ルール昇格と管理画面で使う */
export const Row: React.FC<{
	label: string;
	value: string;
	note?: string;
	color: string;
	dim?: boolean;
}> = ({ label, value, note, color, dim }) => (
	<div
		style={{
			display: "flex",
			alignItems: "baseline",
			gap: 16,
			padding: "12px 0",
			borderBottom: `1px solid ${COLORS.borderRest}`,
			opacity: dim ? 0.55 : 1,
		}}
	>
		<span style={{ width: 168, fontSize: 17, color: COLORS.textSub }}>{label}</span>
		<strong style={{ fontSize: 30, color, width: 62, fontFamily: MONO }}>{value}</strong>
		{note && <span style={{ fontSize: 15, color: COLORS.textSub }}>{note}</span>}
	</div>
);
