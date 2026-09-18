import { openBrowser } from '@remotion/renderer';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { access, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

/**
 * 段1のページを実ブラウザで確かめる。
 * 「速度が本当に変わるか」は DOM を読むだけでは分からないので、実際に再生させる。
 */

const browser = await openBrowser('chrome', { chromiumOptions: { gl: 'swangle' } });
try {
	const page = await browser.newPage({ context: undefined, logLevel: 'error', indent: false, pageIndex: 0, onBrowserLog: null, onLog: () => {} });
	await page.goto({ url: pathToFileURL(process.cwd() + '/out/video-page/index.html').href, timeout: 30000, options: { waitUntil: 'load' } });

	const { count, sources, links } = await page.evaluate(() => ({
		count: document.querySelectorAll('video').length,
		sources: [...document.querySelectorAll('video source')].map((s) => s.src),
		links: [...document.querySelectorAll('a')].map((a) => a.href),
	}));
	assert.equal(count, 5);
	assert.equal(sources.length, count);
	// 一式が自己完結しているか。外へ出ていくリンクが無いこと
	for (const href of [...sources, ...links]) {
		assert.ok(href.startsWith('file://'), `外部を参照しています: ${href}`);
		await access(fileURLToPath(new URL(href)));
	}

	// 速度ボタンが全部の動画に効くか
	for (const rate of [2, 0.5, 1]) {
		const applied = await page.evaluate((rate) => {
			document.querySelector(`[data-speed="${rate}"]`).click();
			return [...document.querySelectorAll('video')].map((v) => v.playbackRate);
		}, rate);
		assert.deepEqual(applied, Array(count).fill(rate), `${rate}倍`);
	}

	// 実際に流して、速度どおりに進むか。2倍なら同じ待ち時間で倍すすむ
	const advanced = await page.evaluate(async () => {
		const video = document.querySelector('video');
		document.querySelector('[data-speed="2"]').click();
		video.muted = true;
		await video.play();
		await new Promise((done) => setTimeout(done, 1500));
		const at = video.currentTime;
		video.pause();
		return at;
	});
	assert.ok(advanced > 1.5, `2倍で1.5秒待って ${advanced}秒しか進んでいません`);

	// 1本だけ鳴る
	const playing = await page.evaluate(async () => {
		const [first, second] = document.querySelectorAll('video');
		first.muted = second.muted = true;
		await first.play();
		await second.play();
		await new Promise(requestAnimationFrame);
		return { first: !first.paused, second: !second.paused };
	});
	assert.deepEqual(playing, { first: false, second: true });

	for (const width of [390, 768, 1280, 1600]) {
		await page._client().send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false });
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
		assert.equal(overflow, false, `${width}px で横スクロールが出ています`);
	}

	const { value } = await page._client().send('Page.captureScreenshot', { format: 'png' });
	await writeFile('out/video-page/page.png', Buffer.from(value.data, 'base64'));
	console.log(`PASS: ${count} videos, 自己完結, 速度3種, 実再生で2倍を確認 (${advanced.toFixed(1)}s), 排他再生, 4画面幅`);
} finally {
	await browser.close({ silent: true });
}
