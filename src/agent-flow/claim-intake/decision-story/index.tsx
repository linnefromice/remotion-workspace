import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";

/**
 * 図をやめて、1件の判断記録が積まれていく様子を文字で見せる版。
 * 索引: docs/presentation-site-variants.md §3
 *
 * 遠くからでも読めるのが狙いなので、文字を大きく、1画面の主張を1つに絞る。
 * どこからどこへ流れているかは語らない。そこはフロー図に任せる（WithMap.tsx）。
 */

export const decisionStorySchema = z.object({ showComparison: z.boolean() });
export const decisionStoryDefaults = { showComparison: true };

const c = {
	bg: "#101619",
	panel: "#1a2327",
	line: "#3c494f",
	text: "#f3f3ea",
	muted: "#a8b6bb",
	ai: "#c2adff",
	human: "#8ecbff",
};

const label: React.CSSProperties = { fontSize: 20, letterSpacing: 2, color: c.muted };
const card: React.CSSProperties = {
	boxSizing: "border-box",
	background: c.panel,
	border: `1px solid ${c.line}`,
	borderRadius: 18,
	padding: 30,
};

/**
 * 工程ごとの文言。見出し・補足・記録の3つは必ず同時に変わるので、
 * 別々の配列に持たず1つにまとめている。
 */
export const STORY_STEPS = [
	{
		name: "通報受付",
		title: "この一文を、見逃さない。",
		note: "写真付きの通報を受け付ける",
		event: "通報を受付",
	},
	{
		name: "入力の確認",
		title: "判断の根拠は、通報の中に。",
		note: "ガスのにおいという記述を次の判定へ渡す",
		event: "入力を確認",
	},
	{
		name: "AIの原判定",
		title: "AIは、翌営業日と判断した。",
		note: "AIの生出力を保存。この値は後から書き換えない",
		event: "AI : P2 を保存",
	},
	{
		name: "安全ルール",
		title: "安全ルールが、即時対応を要求。",
		note: "SAFETY_GAS_ODOR が発火。別の値としてP1を保持",
		event: "ルール : P1 を追加",
	},
	{
		name: "次の対応",
		title: "対応候補にも、制約を。",
		note: "第2段階は責任区分と次の対応候補を判定",
		event: "対応候補を提示",
	},
	{
		name: "担当者の確認",
		title: "下げる判断は、人にしかできない。",
		note: "このケースでは、昇格したP1を担当者が確認",
		event: "担当者が確認",
	},
	{
		name: "記録と一次回答",
		title: "違う判断も、同じ記録に残る。",
		note: "受付から一次回答まで47秒のシナリオ",
		event: "一次回答を記録",
	},
] as const;

/** 中段の帯に出す1行。見出しと本文の対で、工程ごとに入れ替わる */
export const StoryTextOpacity = React.createContext<number | undefined>(undefined);

const Note: React.FC<{
	label: string;
	size: number;
	marginTop?: number;
	labelColor?: string;
	mono?: boolean;
	children: React.ReactNode;
}> = ({ label: text, size, marginTop = 15, labelColor, mono, children }) => {
 const opacity = React.useContext(StoryTextOpacity);
 return (
	<>
		<div style={{...label, ...(labelColor ? {color: labelColor} : null), ...(opacity === undefined ? null : {opacity})}}>{text}</div>
		<div
			style={{
				fontSize: size,
				...(opacity === undefined ? null : {opacity}),
				marginTop,
				...(mono ? { fontFamily: "monospace" } : null),
			}}
		>
			{children}
		</div>
	</>
);
};

/** 安全ルールの工程だけ、帯を左右に割って仮定と実際を並べる */
const Comparison: React.FC = () => (
	<div style={{ display: "flex", gap: 70 }}>
		<div>
			<Note label="比較用の仮定 / 安全ルールがなければ" size={30} marginTop={16}>
				P2のまま → 翌営業日の対応判断
			</Note>
		</div>
		<div style={{ borderLeft: `2px solid ${c.text}`, paddingLeft: 35 }}>
			<Note label="このケース / 安全ルールあり" size={30} marginTop={16}>
				P1へ昇格 → 即時対応の判断
			</Note>
		</div>
	</div>
);

/**
 * 工程ごとに、いま言うべきことを1つだけ出す。
 * 安全ルールの工程で比較を出さない選択をしたときは、原値を保存する話に替える。
 */
export const StoryBand: React.FC<{ step: number; showComparison: boolean }> = ({
	step,
	showComparison,
}) => {
	if (step < 3) {
		return (
			<Note label="問い / AIが緊急度を低く見積もったら？" size={32}>
				その判断だけで、対応を決めてよいのか。
			</Note>
		);
	}
	if (step === 3) {
		return showComparison ? (
			<Comparison />
		) : (
			<Note label="安全ルール / 昇格を強制" size={31}>
				AIの原判定を保持したまま、別の結論を追加する。
			</Note>
		);
	}
	if (step === 4) {
		return (
			<Note label="第2段階 / 5本のガードレール" size={31}>
				対応候補への追加と制止だけ。候補を削る経路はない。
			</Note>
		);
	}
	if (step === 5) {
		return (
			<Note label="権限の非対称" size={31} labelColor={c.human}>
				昇格はルールが強制。降格は人だけが、理由を残して行う。
			</Note>
		);
	}
	return (
		<Note label="追跡可能な記録 / 追記のみ" size={29} mono>
			AI: P2　 /　 RULE: SAFETY_GAS_ODOR → P1　 /　 担当者確認
		</Note>
	);
};

export const ClaimIntakeDecisionStory: React.FC<z.infer<typeof decisionStorySchema>> = ({
	showComparison,
}) => {
	const frame = useCurrentFrame();
	const step = Math.min(STORY_STEPS.length - 1, Math.floor(frame / 120));
	const enter = interpolate(frame % 120, [0, 18], [0, 1], { extrapolateRight: "clamp" });
	const current = STORY_STEPS[step];

	return (
		<AbsoluteFill
			style={{
				background: c.bg,
				color: c.text,
				fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif',
				padding: "48px 64px",
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", ...label }}>
				<span>CLAIM INTAKE / 判断の記録</span>
				<span>PoC シナリオ再現 · 28秒</span>
			</div>

			<h1 style={{ fontSize: 58, letterSpacing: -2, margin: "30px 0 12px" }}>
				{current.title}
			</h1>
			<div style={{ fontSize: 25, color: c.muted }}>{current.note}</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: 28,
					marginTop: 40,
				}}
			>
				<div style={{ ...card, height: 430 }}>
					<div style={label}>01 / 入居者から届いた内容</div>
					<div style={{ fontSize: 35, lineHeight: 1.85, marginTop: 30 }}>
						キッチンの下から水が漏れています。
						<br />
						<span
							style={{
								borderBottom: step >= 1 ? "3px solid white" : "3px solid transparent",
								paddingBottom: 7,
							}}
						>
							ガスのようなにおい
						</span>
						も少しします。
					</div>
					<div
						style={{ display: "flex", gap: 14, marginTop: 35, alignItems: "center" }}
					>
						<div
							style={{
								border: `1px dashed ${c.line}`,
								borderRadius: 8,
								padding: "15px 22px",
								fontSize: 23,
							}}
						>
							添付写真 × 1
						</div>
						<span style={{ fontSize: 20, color: c.muted }}>通報文・写真付きの想定ケース</span>
					</div>
					<div style={{ marginTop: 26, fontSize: 22, color: c.muted }}>
						着目点：水漏れの記述に、ガスのにおいが併記されている。
					</div>
				</div>

				{/* AIの原判定とルールの結論を別の欄に置く。片方が消えないことを形で示す */}
				<div style={{ ...card, height: 430 }}>
					<div style={label}>02 / 判断を別々に保持する</div>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: 20,
							marginTop: 24,
						}}
					>
						<div style={{ borderTop: `3px solid ${c.ai}`, paddingTop: 16 }}>
							<div style={{ color: c.ai, fontSize: 23 }}>AIの原判定</div>
							<div style={{ fontSize: 68, fontWeight: 700, margin: "4px 0" }}>
								{step >= 2 ? "P2" : "—"}
							</div>
							<div style={{ fontSize: 24 }}>{step >= 2 ? "翌営業日" : "判定待ち"}</div>
							<div style={{ fontSize: 19, color: c.muted, marginTop: 14 }}>
								urgency_ai / 原値を保存
							</div>
						</div>
						<div style={{ borderTop: `3px solid ${c.text}`, paddingTop: 16 }}>
							<div style={{ fontSize: 23 }}>安全ルールの結論</div>
							<div style={{ fontSize: 68, fontWeight: 700, margin: "4px 0" }}>
								{step >= 3 ? "P1" : "—"}
							</div>
							<div style={{ fontSize: 24 }}>{step >= 3 ? "即時対応" : "評価待ち"}</div>
							<div style={{ fontSize: 19, color: c.muted, marginTop: 14 }}>
								{step >= 3 ? "SAFETY_GAS_ODOR" : "決定論のルールで評価"}
							</div>
						</div>
					</div>
					<div
						style={{
							borderTop: `1px solid ${c.line}`,
							marginTop: 18,
							paddingTop: 12,
							fontSize: 25,
							color: step >= 5 ? c.human : c.text,
						}}
					>
						{step >= 5
							? "担当者がP1を確認 ／ 降格には理由が必要"
							: step >= 3
								? "P2は残る。運用上の緊急度はP1へ。"
								: "判断が出た順に、記録を積み重ねる。"}
					</div>
				</div>
			</div>

			<div style={{ marginTop: 24, height: 132, ...card, padding: "22px 30px" }}>
				<div style={{ opacity: enter }}>
					<StoryBand step={step} showComparison={showComparison} />
				</div>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(7, 1fr)",
					gap: 12,
					marginTop: 25,
				}}
			>
				{STORY_STEPS.map((s, i) => (
					<div
						key={s.name}
						style={{
							borderTop: `3px ${i <= step ? "solid" : "dashed"} ${i <= step ? c.text : c.line}`,
							paddingTop: 14,
						}}
					>
						<div style={{ fontSize: 18, color: c.muted }}>
							{String(i + 1).padStart(2, "0")} / {s.name}
						</div>
						<div style={{ fontSize: 20, marginTop: 12, color: i <= step ? c.text : c.muted }}>
							{i <= step ? s.event : "記録待ち"}
						</div>
					</div>
				))}
			</div>

			<div
				style={{
					position: "absolute",
					bottom: 30,
					left: 64,
					right: 64,
					display: "flex",
					justifyContent: "space-between",
					fontSize: 18,
					color: c.muted,
				}}
			>
				<span>説明用の画面再構成 / 実システムへの接続なし</span>
				<span>47秒はシナリオ値であり、実測・性能保証ではありません</span>
			</div>
		</AbsoluteFill>
	);
};
