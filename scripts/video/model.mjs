/**
 * 動画書き出しの、副作用のない部分。
 * ここだけテストして、実際のレンダリングは render.mjs に置く。
 */

/** 対象の選び方。ID / 題材 / 全部 のどれか1つ */
export function selectTargets(registered, { id, group, all }) {
	const chosen = [id, group, all].filter(Boolean).length;
	if (chosen === 0) throw new Error("対象を指定してください: <Id> / --group=<題材> / --all");
	if (chosen > 1) throw new Error("<Id> / --group / --all は同時に指定できません");

	if (all) return registered;

	if (group) {
		// 題材は Studio のフォルダ。入れ子は "Inquiry / DesignStudies" のように出るので、
		// "Inquiry" と書いたら入れ子も含める
		const hit = registered.filter(
			(item) => item.group === group || item.group.startsWith(`${group} / `),
		);
		if (!hit.length) {
			const groups = [...new Set(registered.map((item) => item.group))].join(", ");
			throw new Error(`題材が見つかりません: ${group}\n  ある題材: ${groups}`);
		}
		return hit;
	}

	const hit = registered.find((item) => item.id === id);
	if (!hit) throw new Error(`登録されていません: ${id}`);
	return [hit];
}

/**
 * 書き出す fps。
 *
 * 速度は**同じコマを違う速さで流す**ことで変える。コマを間引かないので
 * 速くしても動きは滑らかなまま、尺だけが縮む。
 * 逆に遅くすると fps が下がるので、0.5 を下回るとカクつきが見えてくる。
 *
 * AgentFlow の図は `useVideoConfig()` の fps を見ていないので、
 * fps を変えても図の中身は変わらない。
 */
export function renderFps(sourceFps, { speed = 1, fps } = {}) {
	if (fps !== undefined) {
		if (!Number.isInteger(fps) || fps < 1) throw new Error("--fps は1以上の整数");
		return fps;
	}
	if (!(speed > 0) || !Number.isFinite(speed)) throw new Error("--speed は正の数");
	const result = Math.round(sourceFps * speed);
	if (result < 1) throw new Error(`--speed=${speed} では fps が 0 になります`);
	return result;
}

/** 速さを変えたものは、元のファイルを上書きしないよう名前を分ける */
export function outputName(id, sourceFps, actualFps) {
	if (actualFps === sourceFps) return `${id}.mp4`;
	const ratio = actualFps / sourceFps;
	const label = Number.isInteger(ratio) ? `${ratio}x` : `${ratio.toFixed(2)}x`;
	return `${id}-${label}.mp4`;
}

/** 進捗の出しすぎを防ぐ。20%刻みだけ通す */
export function progressStep(percent, last) {
	const step = Math.floor(percent / 20) * 20;
	return step !== last ? step : null;
}
