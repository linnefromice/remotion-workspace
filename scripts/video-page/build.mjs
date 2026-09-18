import { readFile, writeFile, mkdir, readdir, copyFile, stat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectVideos, formatSeconds, formatSize } from './model.mjs';

/**
 * 段1のページを組む。
 *
 * 動画と代表画像を1つのフォルダへ集めて、そのまま上げれば公開できる形にする。
 * 外を参照しないのが要点で、リンク先を直さずに置き場を変えられる。
 */

const root = fileURLToPath(new URL('../../', import.meta.url));
const out = path.join(root, 'out/video-page');
const SPEEDS = [0.5, 1, 1.5, 2, 4];

const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const galleryHtml = await readFile(path.join(root, 'out/agent-flow-gallery/index.html'), 'utf8');
const gallery = JSON.parse(galleryHtml.match(/<script id="gallery-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);

const videoDir = path.join(root, 'out/video');
const files = (await readdir(videoDir)).filter((name) => name.endsWith('.mp4'));
const { videos, variants, unknown } = selectVideos(files, gallery.items);

// 前回の一式は捨てる。消した動画がフォルダに残り続けないように
await rm(out, { recursive: true, force: true });
await mkdir(path.join(out, 'media'), { recursive: true });

let total = 0;
const cards = [];
for (const video of videos) {
	const source = path.join(videoDir, video.file);
	await copyFile(source, path.join(out, 'media', video.file));

	// 代表画像は poster として使う。再生前に何の図か分かる
	const poster = `${video.id}.png`;
	const posterSource = path.join(root, 'out/agent-flow-gallery', video.image);
	await copyFile(posterSource, path.join(out, 'media', poster));

	// 合計は**上げる一式の大きさ**。動画だけでなく poster も数える
	const bytes = (await stat(source)).size;
	total += bytes + (await stat(posterSource)).size;
	const size = formatSize(bytes);
	cards.push(
		`<article class="card"><video controls preload="metadata" playsinline poster="media/${escape(poster)}" width="1920" height="1080"><source src="media/${escape(video.file)}" type="video/mp4"><a href="media/${escape(video.file)}">動画をダウンロード</a></video><div class="card-copy"><div class="meta">${escape(video.group)} · ${formatSeconds(video.seconds)} · ${size}</div><h3>${escape(video.id)}</h3></div></article>`,
	);
}

/** 載せなかったものは黙って消さず、理由と一緒に出す */
const notes = [];
if (variants.length)
	notes.push(
		`<h2>速度違いのファイルは載せていません</h2><p>このページは再生側で速度を変えられるので、速さのぶんだけファイルを持つ必要がありません。</p><ul>${variants.map((v) => `<li><code>${escape(v.file)}</code> — <code>${escape(v.id)}</code> の ${escape(v.speed)}</li>`).join('')}</ul>`,
	);
if (unknown.length)
	notes.push(
		`<h2>一覧に無い動画があります</h2><p>ID を変えたあとに書き出し直していない可能性があります。<code>pnpm video &lt;Id&gt;</code> で作り直すか、ファイルを消してください。</p><ul>${unknown.map((file) => `<li><code>${escape(file)}</code></li>`).join('')}</ul>`,
	);

const template = await readFile(new URL('./page.html', import.meta.url), 'utf8');
const html = template
	.replace('__CARDS__', cards.join(''))
	.replace('__SPEEDS__', SPEEDS.map((rate) => `<button type="button" data-speed="${rate}" aria-pressed="${rate === 1}">${rate}×</button>`).join(''))
	.replace('__NOTES__', notes.length ? `<aside class="aside">${notes.join('')}</aside>` : '')
	.replaceAll('__COUNT__', String(videos.length))
	.replaceAll('__TOTAL__', formatSize(total));
await writeFile(path.join(out, 'index.html'), html);

console.log(`Video page: ${videos.length} videos, ${formatSize(total)} (動画と poster の合計)`);
if (variants.length) console.log(`  速度違いのため除外: ${variants.map((v) => v.file).join(', ')}`);
if (unknown.length) console.log(`  一覧に無いため除外: ${unknown.join(', ')}`);
console.log(`${out}/index.html`);
