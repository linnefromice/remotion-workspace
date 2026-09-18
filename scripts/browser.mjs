import { openBrowser } from '@remotion/renderer';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

/**
 * 生成したページを実ブラウザで見るための共通部分。
 *
 * `newPage` は使わない引数まで必須で、`captureScreenshot` は base64 を自分で
 * 解く必要がある。同じ定型を5つの検証スクリプトが写していたので、ここに集めた。
 *
 * `gl: 'swangle'` はこのリポジトリのレンダリング全体の決まり（docs/agent-flow-diagram-patterns.md）。
 */
export async function openReviewPage({ url, collectErrors = false } = {}) {
	const browser = await openBrowser('chrome', { chromiumOptions: { gl: 'swangle' } });
	/** collectErrors を頼んだ場合だけ、コンソールの error を貯める */
	const errors = [];
	const page = await browser.newPage({
		context: undefined,
		logLevel: 'error',
		indent: false,
		pageIndex: 0,
		onBrowserLog: collectErrors ? (log) => { if (log.type === 'error') errors.push(log.text); } : null,
		onLog: () => {},
	});
	if (url) await page.goto({ url, timeout: 30000, options: { waitUntil: 'load' } });

	/** 撮って書くまで。置き先のフォルダが無ければ作る */
	const shot = async (file) => {
		const { value } = await page._client().send('Page.captureScreenshot', { format: 'png' });
		await mkdir(path.dirname(file), { recursive: true });
		await writeFile(file, Buffer.from(value.data, 'base64'));
	};

	return { browser, page, errors, shot, close: () => browser.close({ silent: true }) };
}
