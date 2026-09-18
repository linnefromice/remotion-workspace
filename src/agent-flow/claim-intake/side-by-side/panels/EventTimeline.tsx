import React from "react";
import { interpolate } from "remotion";
import { COLORS, STEP_COLORS, STEP_LEN } from "../../cards/constants";
import { MONO } from "../parts/primitives";
import { ELAPSED_SECONDS, EVENTS } from "../scenario";

/**
 * 経過時間（検討メモ §3-2）と、inquiry_events の追記（demoapp の設計の核）を
 * 1つの帯にまとめたもの。
 *
 * 別々に作ろうとしたが、1920x1080 に左右2カラムを置くと、縦に積める余地が
 * 下の1帯ぶんしか無い。横軸を時間にして、イベントを左から積んでいく形にすると、
 * どちらも同じ場所で言える:
 *
 * - 速さ（受付から一次回答まで47秒）は、目盛りの詰まり方で見える
 * - 追記のみ（消えない）は、一度出た点が最後まで残ることで見える
 *
 * 時刻はこのシナリオでの想定値。demoapp の実測ではない。
 */

/** 軸の右端。47秒の点を端に寄せきらないための余白込み */
const AXIS_SECONDS = 50;

/** フレームから、シナリオ上の経過秒を出す。イベントの間は線形に進める */
export const elapsedSeconds = (frame: number): number =>
	interpolate(
		frame,
		EVENTS.map((e) => e.step * STEP_LEN),
		EVENTS.map((e) => e.t),
		{ extrapolateRight: "clamp" },
	);

const mmss = (sec: number) => `00:${String(Math.floor(sec)).padStart(2, "0")}`;

/** ヘッダ右端に置く時計。図では伝わらない「速さ」を数字で出す */
export const ElapsedClock: React.FC<{ frame: number }> = ({ frame }) => {
	const sec = elapsedSeconds(frame);
	const settled = sec >= ELAPSED_SECONDS;

	return (
		<div style={{ textAlign: "right" }}>
			<div style={{ fontSize: 15, color: COLORS.textSub, letterSpacing: "0.08em" }}>
				受付からの経過
			</div>
			<div
				style={{
					fontSize: 46,
					fontFamily: MONO,
					color: settled ? COLORS.green : COLORS.textMain,
					lineHeight: 1.3,
				}}
			>
				{mmss(sec)}
			</div>
			<div style={{ fontSize: 15, color: settled ? COLORS.green : COLORS.textSub }}>
				{settled ? "一次回答まで完了" : "進行中"}
			</div>
		</div>
	);
};

export const EventTimeline: React.FC<{ frame: number; width: number; hideElapsed?: boolean }> = ({
	frame,
	width,
	hideElapsed = false,
}) => {
	const sec = elapsedSeconds(frame);
	const x = (t: number) => (t / AXIS_SECONDS) * width;
	// ヘッダと、軸の上に振ったラベルが同じ行に来ないだけの高さを取る
	const axisY = 84;

	return (
		<div style={{ position: "relative", width, height: 150 }}>
			<div style={{ fontSize: 15, color: COLORS.textSub, letterSpacing: "0.06em" }}>
				inquiry_events / 追記のみ
			</div>

			<div
				style={{
					position: "absolute",
					left: 0,
					top: axisY,
					width,
					height: 2,
					background: COLORS.borderRest,
				}}
			/>
			{/* 現在地。ここまでが起きたこと */}
			<div
				style={{
					position: "absolute",
					left: 0,
					top: axisY,
					width: x(sec),
					height: 2,
					background: COLORS.green,
				}}
			/>

			{EVENTS.map((event, i) => {
				const fired = sec >= event.t;
				const color = fired ? STEP_COLORS[event.step] : COLORS.borderRest;
				// 9秒と11秒のように近いイベントはラベルがぶつかるので、1つおきに上下へ振る
				const above = i % 2 === 0;
				// 右端のイベントは、ラベルがはみ出さないよう右詰めにする
				const alignRight = x(event.t) > width * 0.8;

				return (
					<React.Fragment key={event.name}>
						<div
							style={{
								position: "absolute",
								left: x(event.t) - 5,
								top: axisY - 4,
								width: 10,
								height: 10,
								borderRadius: "50%",
								background: fired ? color : COLORS.bg,
								border: `2px solid ${color}`,
								boxSizing: "border-box",
							}}
						/>
						<div
							style={{
								position: "absolute",
								left: x(event.t),
								top: above ? axisY - 52 : axisY + 18,
								transform: alignRight ? "translateX(-100%)" : undefined,
								textAlign: alignRight ? "right" : "left",
								opacity: fired ? 1 : 0.35,
								whiteSpace: "nowrap",
							}}
						>
							<div style={{ fontSize: 14, fontFamily: MONO, color }}>
								{hideElapsed ? '' : mmss(event.t)} {event.name}
							</div>
							<div style={{ fontSize: 13, color: COLORS.textSub, marginTop: 3 }}>
								{event.detail}
							</div>
						</div>
					</React.Fragment>
				);
			})}
		</div>
	);
};
