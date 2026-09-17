import React from "react";
import { COLORS } from "../../AgentFlowClaimIntake/constants";
import {
	Badge,
	Bubble,
	Caption,
	CodeBlock,
	MONO,
	Phone,
	PhotoStub,
	Row,
	V,
} from "../parts/primitives";
import { CASE, ELAPSED_SECONDS } from "../scenario";

/**
 * フロー図の横に置く「現場」。
 *
 * 検討メモ: docs/presentation-site.md
 *
 * フロー図は三人称の俯瞰なので、当事者が何を見ているかを映せない。
 * ここでは同じ工程について、入居者のスマホ・AIの生出力・管理画面といった
 * 一人称の画面を出す。「AIがP2と言った」は抽象だが、
 * JSON に "P2" と書いてあるのを見せると現実になる、という狙い。
 *
 * 判定の値やルールIDは `../scenario` から引く。文中の言い回しだけここに置く。
 */

/** どれもフレームに依らない。いまの工程は呼び出し側が選ぶ */
type Screen = React.FC;

// --- 工程ごとの画面 ---------------------------------------------------------

const ResidentPhone: Screen = () => (
	<>
		<Phone>
			<Bubble mine>
				キッチンの下から水が漏れています。ガスのようなにおいも少しします。
			</Bubble>
			<PhotoStub />
			<Bubble>
				ご連絡ありがとうございます。受付番号 {CASE.ticket} で承りました。
			</Bubble>
		</Phone>
		<Caption>
			会話も添付も、届いた形のまま保存される。受付番号はこの時点で返る。
		</Caption>
	</>
);

const Transcript: Screen = () => (
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

const AiOutput: Screen = () => (
	<>
		<CodeBlock accent={COLORS.violet}>
			{"{\n  \"kind\": "}
			<V>{'"claim"'}</V>
			{",\n  \"category\": "}
			<V>{'"water_leak"'}</V>
			{",\n  \"urgency\": "}
			<V color={COLORS.violet} em>
				{`"${CASE.aiUrgency}"`}
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

const FiredRule: Screen = () => (
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
			{CASE.ruleId}
		</div>
		<Row
			label="AI（生出力）"
			value={CASE.aiUrgency}
			note="judgments.raw"
			color={COLORS.violet}
			dim
		/>
		<Row
			label="ルールの結論"
			value={CASE.resolvedUrgency}
			note="昇格しかできない"
			color={COLORS.rule}
		/>
		<Row
			label="現在値"
			value={CASE.resolvedUrgency}
			note="urgency_source = rule"
			color={COLORS.rule}
		/>
		<Caption color={COLORS.rule}>
			「ガスのようなにおい」に反応した5本のうちの1本。
			AIの値を消すのではなく、強い方を現在値に採る。両方が残る。
		</Caption>
	</>
);

const NextActions: Screen = () => (
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

const AdminScreen: Screen = () => (
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
				<span style={{ fontFamily: MONO, fontSize: 19 }}>{CASE.ticket}</span>
				<Badge color={COLORS.rule} filled>
					{CASE.resolvedUrgency}
				</Badge>
				<Badge color={COLORS.rule}>ルール昇格</Badge>
			</div>
			<Row label="AI判定" value={CASE.aiUrgency} note="medium" color={COLORS.violet} dim />
			<Row
				label="現在値"
				value={CASE.resolvedUrgency}
				note={CASE.ruleId}
				color={COLORS.rule}
			/>
			<div style={{ fontSize: 18, color: COLORS.orange, marginTop: 18 }}>
				{CASE.aiUrgency} に戻すには理由の入力が必要です
			</div>
		</div>
		<Caption color={COLORS.orange}>
			担当者は、AIが何と言ったかと、なぜ上がったかを同じ画面で見る。
			下げられるのは人だけで、下げた理由は履歴に残る。
		</Caption>
	</>
);

const CsvRow: Screen = () => (
	<>
		<CodeBlock accent={COLORS.green} size={16}>
			{"id,urgency,urgency_ai,urgency_source,fired_rule_ids\n"}
			<V color={COLORS.green} em>
				{`${CASE.id},${CASE.resolvedUrgency},${CASE.aiUrgency},rule,${CASE.ruleId}`}
			</V>
		</CodeBlock>
		<Caption color={COLORS.green}>
			出口にも AIの値（urgency_ai）と、昇格させたルール（fired_rule_ids）が並ぶ。
			あとから「なぜP1だったのか」を1行で追える。
		</Caption>
	</>
);

/**
 * ヘッダに時計を出していないときだけ、出口で経過時間に触れる。
 * 同じ数字を2箇所で言わないための切り分けなので、判断は呼び出し側が持つ。
 */
export const ElapsedSummary: React.FC = () => (
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
			{ELAPSED_SECONDS}
		</strong>{" "}
		秒
	</div>
);

/**
 * 見出しと画面は必ず対で動く。
 * 以前は見出しだけ別の配列に持っていて、片方だけ足すとずれる形になっていた。
 */
export const SCENES = [
	{ title: "入居者のスマホ", Screen: ResidentPhone },
	{ title: "文字起こしの結果", Screen: Transcript },
	{ title: "AIの生出力", Screen: AiOutput },
	{ title: "発火したルール", Screen: FiredRule },
	{ title: "提案された次の対応", Screen: NextActions },
	{ title: "担当者の管理画面", Screen: AdminScreen },
	{ title: "CSVの1行", Screen: CsvRow },
] as const;
