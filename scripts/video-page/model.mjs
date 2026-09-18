/**
 * 段1（動画ファイル＋ <video>）のページの、副作用のない部分。
 * ファイルを触る処理は build.mjs に置く。
 */

/** `Side-Stacked-2x.mp4` → {id:'Side-Stacked', speed:'2x'}。速度違いは名前で見分ける */
export function parseVideoName(file) {
	const name = file.replace(/\.mp4$/, '');
	if (name === file) throw new Error(`mp4 ではありません: ${file}`);
	const variant = name.match(/^(.+)-(\d+(?:\.\d+)?x)$/);
	return variant ? { id: variant[1], speed: variant[2] } : { id: name, speed: null };
}

/**
 * 置ける動画を選ぶ。
 *
 * 一覧（正本）に無い ID は**黙って落とさず**返す。書き出したあとに ID を
 * 変えると古いファイルが残るので、それを見えるようにしておく。
 *
 * 速度違いのファイルもページには載せない。段1は再生側で速度を変えられるので、
 * 速さのぶんだけファイルを持つ必要がない。
 */
export function selectVideos(files, items) {
	const byId = new Map(items.map((item) => [item.id, item]));
	const videos = [];
	const variants = [];
	const unknown = [];
	for (const file of [...files].sort()) {
		const { id, speed } = parseVideoName(file);
		const item = byId.get(id);
		if (!item) {
			unknown.push(file);
			continue;
		}
		if (speed) {
			variants.push({ file, id, speed });
			continue;
		}
		videos.push({ file, id, group: item.group, image: item.image, seconds: item.durationInFrames / item.fps });
	}
	if (!videos.length) throw new Error('載せられる動画がありません。先に pnpm video <Id> で書き出してください');
	// 題材でまとめる。同じ題材のなかは ID 順（sort 済みの順を保つ）
	videos.sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id));
	return { videos, variants, unknown };
}

/** 秒を 0:28 の形に。尺を並べて比べるための表示 */
export function formatSeconds(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) throw new Error(`尺が不正です: ${seconds}`);
	const whole = Math.round(seconds);
	return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** バイト数を MB で。デプロイ先の容量に収まるかを、その場で見せるため */
export function formatSize(bytes) {
	if (!Number.isInteger(bytes) || bytes < 0) throw new Error(`サイズが不正です: ${bytes}`);
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
