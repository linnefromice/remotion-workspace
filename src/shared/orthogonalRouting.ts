/**
 * フロー図のエッジを、経由点の配列から「角を丸めた直角の折れ線」として描く。
 *
 * 斜めのベジェ曲線はノードの枠や文字を横切りやすいので、どの図でも経由点を
 * 与えて直角に曲げる方式に揃えている。進行ドットの位置も、同じ経由点の
 * 距離から求める。
 *
 * AgentFlow / AgentFlowInquiry / AgentFlowClaimIntake が同じ実装を各自持って
 * いたのをここへ寄せた。角の半径だけ図ごとに違うので引数にしている。
 */

export type Point = [number, number];

const sub = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
const scale = (a: Point, s: number): Point => [a[0] * s, a[1] * s];
const dist = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);

const normalize = (a: Point): Point => {
	const len = Math.hypot(a[0], a[1]);
	return len === 0 ? [0, 0] : [a[0] / len, a[1] / len];
};

/** 経由点を結ぶ SVG パス。各頂点は cornerRadius で丸める */
export const roundedPath = (points: Point[], cornerRadius: number): string => {
	if (points.length < 2) return "";
	let d = `M ${points[0][0]} ${points[0][1]} `;
	for (let i = 1; i < points.length - 1; i++) {
		const prev = points[i - 1];
		const curr = points[i];
		const next = points[i + 1];
		// 隣り合う線分より大きくは丸めない
		const r = Math.min(cornerRadius, dist(prev, curr) / 2, dist(curr, next) / 2);
		const p1 = sub(curr, scale(normalize(sub(curr, prev)), r));
		const p2 = add(curr, scale(normalize(sub(next, curr)), r));
		d += `L ${p1[0]} ${p1[1]} Q ${curr[0]} ${curr[1]} ${p2[0]} ${p2[1]} `;
	}
	const last = points[points.length - 1];
	return `${d}L ${last[0]} ${last[1]}`;
};

/**
 * 折れ線の全長に対する割合 t (0..1) の位置。
 * 角の丸めは無視して直線の折れ線として測るが、半径ぶんのずれは見た目に出ない。
 */
export const pointAtFraction = (points: Point[], t: number): Point => {
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
