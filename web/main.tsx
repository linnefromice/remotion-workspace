import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
import { AgentFlowClaimIntake } from "@flow/agent-flow/claim-intake/cards";
import { STEPS, STEP_LEN } from "@flow/agent-flow/claim-intake/cards/constants";
import { ClaimIntakeSideBySide } from "@flow/agent-flow/claim-intake/side-by-side";
import { SIDE_BY_SIDE_PRESETS } from "@flow/agent-flow/claim-intake/side-by-side/constants";
import { DiagramBands, bandsDefaults } from "@flow/agent-flow/design-studies/agent-diagram/bands";
import { SideReplay } from "@flow/agent-flow/design-studies/side/GateReplay";

/**
 * 段2のサンプル：動画ファイルを作らず、コンポジションをその場で描く。
 *
 * 動画にできないことが2つできる。
 *   1. フレーム単位のシーク（工程の頭へ正確に飛べる）
 *   2. props の差し替え（題材や見せ方を、その場で切り替えられる）
 *
 * 検討メモ: docs/deploy-options.md
 */

const CLAIM_FRAMES = STEPS.length * STEP_LEN;

/** 出せるもの。props を持つものは、切り替えの選択肢も添える */
const ENTRIES = [
	{
		id: "ClaimIntake-Cards",
		title: "通報受付 / Cards",
		note: "規定の4版のひとつ。単体で読ませるとき",
		component: AgentFlowClaimIntake,
		durationInFrames: CLAIM_FRAMES,
		options: null,
	},
	{
		id: "Diagram-Bands",
		title: "主体別3帯",
		note: "題材を切り替えられる。座標表を持たず定義から配置を導いている",
		component: DiagramBands,
		durationInFrames: CLAIM_FRAMES,
		options: {
			label: "題材",
			key: "subject",
			values: ["restoration", "proposal", "claimIntake"],
			initial: bandsDefaults,
		},
	},
	{
		id: "ClaimIntake-SideBySide",
		title: "俯瞰＋現場",
		note: "足す要素を切り替えられる。図の横に何を置くか",
		component: ClaimIntakeSideBySide,
		durationInFrames: CLAIM_FRAMES,
		options: {
			label: "見せ方",
			key: "preset",
			values: Object.keys(SIDE_BY_SIDE_PRESETS),
			initial: SIDE_BY_SIDE_PRESETS.full,
		},
	},
	{
		id: "Side-Replay",
		title: "根拠の逆再生",
		note: "結論から根拠をさかのぼる。証拠は消えない",
		component: SideReplay,
		durationInFrames: CLAIM_FRAMES,
		options: null,
	},
] as const;

const SPEEDS = [0.5, 1, 1.5, 2, 4];

const C = {
	bg: "#0f1418",
	panel: "#1a2227",
	line: "#31414a",
	text: "#eef3f4",
	muted: "#9fb0b6",
	accent: "#9ddad4",
};

const button = (on: boolean): React.CSSProperties => ({
	padding: "8px 16px",
	borderRadius: 6,
	border: `1px solid ${on ? C.accent : C.line}`,
	background: on ? C.accent : "transparent",
	color: on ? "#0f1418" : C.text,
	font: "inherit",
	cursor: "pointer",
});

const App: React.FC = () => {
	const [index, setIndex] = React.useState(0);
	const [speed, setSpeed] = React.useState(1);
	const [option, setOption] = React.useState<string | null>(null);
	const entry = ENTRIES[index];
	const player = React.useRef<React.ComponentRef<typeof Player>>(null);

	// 作品を変えたら、選択肢は既定へ戻す
	React.useEffect(() => setOption(null), [index]);

	const inputProps = React.useMemo(() => {
		if (!entry.options) return {};
		const chosen = option ?? entry.options.values[0];
		return entry.options.key === "preset"
			? SIDE_BY_SIDE_PRESETS[chosen as keyof typeof SIDE_BY_SIDE_PRESETS]
			: { [entry.options.key]: chosen };
	}, [entry, option]);

	/** 工程の頭へ正確に飛ぶ。動画では作れない動き */
	const seekToStep = (step: number) => player.current?.seekTo(step * STEP_LEN);

	return (
		<main
			style={{
				background: C.bg,
				color: C.text,
				minHeight: "100vh",
				margin: 0,
				padding: 28,
				font: '15px/1.7 system-ui, "Hiragino Sans", sans-serif',
				boxSizing: "border-box",
			}}
		>
			<h1 style={{ fontSize: 26, margin: 0 }}>AgentFlow プレイヤー</h1>
			<p style={{ color: C.muted, margin: "8px 0 24px" }}>
				動画を作らずに、コンポジションをその場で描いている。速度・シーク・
				<strong style={{ color: C.text }}>props の差し替え</strong>がその場でできる。
			</p>

			<div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
				{ENTRIES.map((item, i) => (
					<button key={item.id} type="button" style={button(i === index)} onClick={() => setIndex(i)}>
						{item.title}
					</button>
				))}
			</div>

			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					gap: 24,
					alignItems: "center",
					marginBottom: 18,
					paddingBottom: 18,
					borderBottom: `1px solid ${C.line}`,
				}}
			>
				<label style={{ display: "flex", gap: 10, alignItems: "center" }}>
					<span style={{ color: C.muted }}>再生速度</span>
					{SPEEDS.map((value) => (
						<button
							key={value}
							type="button"
							style={button(value === speed)}
							onClick={() => setSpeed(value)}
						>
							{value}×
						</button>
					))}
				</label>

				{entry.options && (
					<label style={{ display: "flex", gap: 10, alignItems: "center" }}>
						<span style={{ color: C.muted }}>{entry.options.label}</span>
						{entry.options.values.map((value) => (
							<button
								key={value}
								type="button"
								style={button(value === (option ?? entry.options!.values[0]))}
								onClick={() => setOption(value)}
							>
								{value}
							</button>
						))}
					</label>
				)}
			</div>

			<Player
				ref={player}
				component={entry.component as React.ComponentType<Record<string, unknown>>}
				inputProps={inputProps}
				durationInFrames={entry.durationInFrames}
				fps={30}
				compositionWidth={1920}
				compositionHeight={1080}
				playbackRate={speed}
				controls
				loop
				style={{ width: "100%", border: `1px solid ${C.line}`, borderRadius: 10 }}
			/>

			<div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
				<span style={{ color: C.muted, alignSelf: "center" }}>工程へ飛ぶ</span>
				{STEPS.map((name, i) => (
					<button key={name} type="button" style={button(false)} onClick={() => seekToStep(i)}>
						{i + 1} {name}
					</button>
				))}
			</div>

			<p style={{ color: C.muted, marginTop: 20 }}>
				{entry.note}　/　説明用の画面再構成・実システムへの接続なし
			</p>
		</main>
	);
};

createRoot(document.getElementById("root")!).render(<App />);
