import React from "react";
import { COLORS } from "../AgentFlowClaimIntake/constants";

/**
 * フロー図の横に置く「現場」。
 *
 * 検討メモ: docs/presentation-site.md
 *
 * フロー図は三人称の俯瞰なので、当事者が何を見ているかを映せない。
 * ここでは同じステップについて、入居者のスマホ・AIの生出力・管理画面といった
 * 一人称の画面を出す。「AIがP2と言った」は抽象だが、
 * JSON に "P2" と書いてあるのを見せると現実になる、という狙い。
 *
 * 仮置き版なので、シナリオの値はすべてここに直書きしている。
 * 値そのものは demoapp（farleap/tenant-claim-intake-demoapp）の語彙に合わせた。
 */

const MONO = '"SF Mono", Menlo, Consolas, monospace';

/** シナリオ全体で使い回す1件の通報 */
const TICKET = "#2026-0917-014";

// --- 小さな部品 -------------------------------------------------------------

const Caption: React.FC<{ color?: string; children: React.ReactNode }> = ({
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
const CodeBlock: React.FC<{
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
const V: React.FC<{ color?: string; em?: boolean; children: React.ReactNode }> = ({
	color = "#9FE8C6",
	em,
	children,
}) => (
	<span style={{ color, fontWeight: em ? 700 : 400 }}>{children}</span>
);

const Badge: React.FC<{ color: string; filled?: boolean; children: React.ReactNode }> = ({
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
const Phone: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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

const Bubble: React.FC<{ mine?: boolean; children: React.ReactNode }> = ({
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
const PhotoStub: React.FC = () => (
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
const Row: React.FC<{
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

export const Counterfactual: React.FC<{ step: number }> = ({ step }) => {
	// ルールが効くのはステップ4（ルール昇格）から。それまではどちらも中立に置く
	const fired = step >= 3;

	return (
		<div style={{ display: "flex", gap: 24 }}>
			<Track
				title="セーフティルールが無い場合"
				beats={["AIのP2のまま", "翌営業日に手配", "ガスのにおいは誰も見ない"]}
				color={COLORS.grey}
				dim
			/>
			<Track
				title="セーフティルールがある場合"
				beats={["P1へ昇格", "即時架電・当日手配", "47秒で一次回答"]}
				color={COLORS.rule}
				dim={!fired}
			/>
		</div>
	);
};

// --- ステップごとの現場 -----------------------------------------------------

/** 現場の見出し。フロー図のステップ名とは別に、何の画面かを言う */
export const SCENE_TITLES = [
	"入居者のスマホ",
	"文字起こしの結果",
	"AIの生出力",
	"発火したルール",
	"提案された次の対応",
	"担当者の管理画面",
	"CSVの1行",
] as const;

export const Scene: React.FC<{
	step: number;
	/** ヘッダに時計を出しているときは、出口の「47秒」を繰り返さない */
	hideElapsed?: boolean;
}> = ({ step, hideElapsed = false }) => {
	switch (step) {
		case 0:
			return (
				<>
					<Phone>
						<Bubble mine>
							キッチンの下から水が漏れています。ガスのようなにおいも少しします。
						</Bubble>
						<PhotoStub />
						<Bubble>
							ご連絡ありがとうございます。受付番号 {TICKET} で承りました。
						</Bubble>
					</Phone>
					<Caption>
						会話も添付も、届いた形のまま保存される。受付番号はこの時点で返る。
					</Caption>
				</>
			);

		case 1:
			return (
				<>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 3,
							marginBottom: 24,
						}}
					>
						{/* 音声の波形。長さと「入力が声だった」ことだけ示せればよい */}
						{Array.from({ length: 34 }, (_, i) => (
							<div
								key={i}
								style={{
									width: 4,
									height: 8 + ((i * 37) % 44),
									borderRadius: 2,
									background: COLORS.cyan,
									opacity: 0.75,
								}}
							/>
						))}
						<span
							style={{
								fontSize: 17,
								color: COLORS.textSub,
								fontFamily: MONO,
								marginLeft: 14,
							}}
						>
							0:12
						</span>
					</div>
					<CodeBlock accent={COLORS.cyan}>
						{"キッチンの下から水が漏れてて、\nガスみたいなにおいもするんですけど\n見てもらえますか"}
					</CodeBlock>
					<Caption>音声は一度だけ文字に起こされ、会話の1ターンとして積まれる。</Caption>
				</>
			);

		case 2:
			return (
				<>
					<CodeBlock accent={COLORS.violet}>
						{"{\n  \"kind\": "}
						<V>{'"claim"'}</V>
						{",\n  \"category\": "}
						<V>{'"water_leak"'}</V>
						{",\n  \"urgency\": "}
						<V color={COLORS.violet} em>
							{'"P2"'}
						</V>
						{",\n  \"confidence\": "}
						<V color={COLORS.violet}>{'"medium"'}</V>
						{",\n  \"summary\": "}
						<V>{'"キッチン下部からの漏水"'}</V>
						{"\n}"}
					</CodeBlock>
					<Caption color={COLORS.violet}>
						AIはP2（翌営業日）と言った。この出力はこのまま judgments に残り、
						このあと誰にも書き換えられない。
					</Caption>
				</>
			);

		case 3:
			return (
				<>
					<div
						style={{
							display: "inline-block",
							padding: "10px 18px",
							border: `1px solid ${COLORS.rule}`,
							borderRadius: 8,
							fontFamily: MONO,
							fontSize: 22,
							color: COLORS.rule,
							marginBottom: 26,
						}}
					>
						SAFETY_GAS_ODOR
					</div>
					<Row label="AI（生出力）" value="P2" note="judgments.raw" color={COLORS.violet} dim />
					<Row label="ルールの結論" value="P1" note="昇格しかできない" color={COLORS.rule} />
					<Row label="現在値" value="P1" note="urgency_source = rule" color={COLORS.rule} />
					<Caption color={COLORS.rule}>
						「ガスのようなにおい」に反応した5本のうちの1本。
						AIの値を消すのではなく、強い方を現在値に採る。両方が残る。
					</Caption>
				</>
			);

		case 4:
			return (
				<>
					<div style={{ fontSize: 17, color: COLORS.textSub, marginBottom: 8 }}>
						責任区分
					</div>
					<div style={{ fontSize: 24, marginBottom: 28 }}>貸主負担（設備起因の疑い）</div>
					<div style={{ fontSize: 17, color: COLORS.textSub, marginBottom: 14 }}>
						NextAction 候補
					</div>
					{[
						["入居者へ架電", "G1 が追加（P1は必ず架電）"],
						["水道業者へ手配", ""],
						["現地確認の日程調整", ""],
					].map(([action, by]) => (
						<div
							key={action}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 14,
								padding: "12px 0",
								borderBottom: `1px solid ${COLORS.borderRest}`,
							}}
						>
							<span style={{ color: COLORS.green, fontSize: 20 }}>✓</span>
							<span style={{ fontSize: 21, flex: 1 }}>{action}</span>
							{by && (
								<span style={{ fontSize: 15, color: COLORS.rule }}>{by}</span>
							)}
						</div>
					))}
					<Caption>
						ガードレールができるのは追加と制止だけ。候補を削る経路は実装に存在しない。
					</Caption>
				</>
			);

		case 5:
			return (
				<>
					<div
						style={{
							border: `1px solid ${COLORS.borderRest}`,
							borderRadius: 12,
							background: COLORS.panelHuman,
							padding: "22px 24px",
						}}
					>
						<div
							style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}
						>
							<span style={{ fontFamily: MONO, fontSize: 19 }}>{TICKET}</span>
							<Badge color={COLORS.rule} filled>
								P1
							</Badge>
							<Badge color={COLORS.rule}>ルール昇格</Badge>
						</div>
						<Row label="AI判定" value="P2" note="medium" color={COLORS.violet} dim />
						<Row label="現在値" value="P1" note="SAFETY_GAS_ODOR" color={COLORS.rule} />
						<div style={{ fontSize: 18, color: COLORS.orange, marginTop: 18 }}>
							P2 に戻すには理由の入力が必要です
						</div>
					</div>
					<Caption color={COLORS.orange}>
						担当者は、AIが何と言ったかと、なぜ上がったかを同じ画面で見る。
						下げられるのは人だけで、下げた理由は履歴に残る。
					</Caption>
				</>
			);

		default:
			return (
				<>
					<CodeBlock accent={COLORS.green} size={16}>
						{"id,urgency,urgency_ai,urgency_source,fired_rule_ids\n"}
						<V color={COLORS.green} em>
							{"2026-0917-014,P1,P2,rule,SAFETY_GAS_ODOR"}
						</V>
					</CodeBlock>
					<Caption color={COLORS.green}>
						出口にも AIの値（urgency_ai）と、昇格させたルール（fired_rule_ids）が並ぶ。
						あとから「なぜP1だったのか」を1行で追える。
					</Caption>
					{!hideElapsed && (
						<div
							style={{
								marginTop: 34,
								paddingTop: 22,
								borderTop: `1px solid ${COLORS.borderRest}`,
								fontSize: 19,
							}}
						>
							受付から一次回答まで{" "}
							<strong style={{ fontSize: 34, color: COLORS.green, fontFamily: MONO }}>
								47
							</strong>{" "}
							秒
						</div>
					)}
				</>
			);
	}
};
