import { readFile, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { parseArgs } from "node:util";
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderMedia } from "@remotion/renderer";
import { discoverAgentFlows } from "../agent-flow-gallery/model.mjs";
import { outputName, progressStep, renderFps, selectTargets } from "./model.mjs";

/**
 * AgentFlow の図を mp4 に書き出す。
 *
 * 素の `remotion render` は、このリポジトリでは3つのフラグを毎回付けないと
 * 正しく出ない（`--gl=swangle` と、`--image-format=png` `--pixel-format=yuv420p` の両方）。
 * remotion.config.ts が JPEG 出力なので、片方だけだと pix_fmt が yuvj420p になる。
 * ここに埋め込んで、呼ぶ側が覚えなくて済むようにする。
 *
 * 対象は src/Root.tsx を読んで決めるので、登録漏れが起きない。
 */

const root = fileURLToPath(new URL("../../", import.meta.url));
const out = path.join(root, "out/video");
const run = promisify(execFile);

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		group: { type: "string" },
		all: { type: "boolean" },
		speed: { type: "string" },
		fps: { type: "string" },
		help: { type: "boolean" },
	},
});

if (values.help || (!positionals.length && !values.group && !values.all)) {
	console.log(`pnpm video <Id> | --group=<題材> | --all  [--speed=2] [--fps=60]

  <Id>        1本だけ書き出す
  --group     題材ごと（入れ子も含む。例: --group=Inquiry）
  --all       AgentFlow 全部
  --speed     再生速度。2 で2倍速。同じコマを速く流すので動きは滑らかなまま
  --fps       書き出す fps を直接指定する（--speed とは排他）

出力: out/video/`);
	process.exit(values.help ? 0 : 1);
}

await main().catch((error) => {
	console.error(error.message ?? error);
	process.exitCode = 1;
});

async function main() {
	if (values.speed !== undefined && values.fps !== undefined) {
		throw new Error("--speed と --fps は同時に指定できません");
	}
	const speed = values.speed === undefined ? 1 : Number(values.speed);
	const fps = values.fps === undefined ? undefined : Number(values.fps);

	const registration = await readFile(path.join(root, "src/Root.tsx"), "utf8");
	const targets = selectTargets(discoverAgentFlows(registration), {
		id: positionals[0],
		group: values.group,
		all: values.all,
	});

	await mkdir(out, { recursive: true });
	const bundleDir = path.join(out, ".bundle");
	let browser;
	try {
		console.log(`Bundling once for ${targets.length} composition(s)…`);
		const serveUrl = await bundle({
			entryPoint: path.join(root, "src/index.ts"),
			outDir: bundleDir,
			publicDir: path.join(root, "public"),
		});
		if (registration !== (await readFile(path.join(root, "src/Root.tsx"), "utf8"))) {
			throw new Error("バンドル中に Root.tsx が変わりました。やり直してください");
		}
		// WebGL を使う図があるので swangle で開く。angle では足りない
		browser = await openBrowser("chrome", { chromiumOptions: { gl: "swangle" } });
		const compositions = await getCompositions(serveUrl, { puppeteerInstance: browser });

		for (const [index, target] of targets.entries()) {
			const composition = compositions.find((item) => item.id === target.id);
			if (!composition) throw new Error(`見つかりません: ${target.id}`);

			const actualFps = renderFps(composition.fps, { speed, fps });
			const file = path.join(out, outputName(target.id, composition.fps, actualFps));
			const seconds = (composition.durationInFrames / actualFps).toFixed(1);
			console.log(
				`[${index + 1}/${targets.length}] ${target.id} · ${actualFps}fps · ${seconds}秒`,
			);

			let last = -1;
			await renderMedia({
				serveUrl,
				// fps だけ差し替える。コマは間引かないので、速度が変わっても動きは滑らか
				composition: { ...composition, fps: actualFps },
				codec: "h264",
				imageFormat: "png",
				pixelFormat: "yuv420p",
				outputLocation: file,
				puppeteerInstance: browser,
				concurrency: 4,
				onProgress: ({ progress }) => {
					const step = progressStep(Math.floor(progress * 100), last);
					if (step !== null) {
						last = step;
						process.stdout.write(`  ${step}%\r`);
					}
				},
			});
			await verify(file);
		}
		console.log(`\n出力: ${out}`);
	} finally {
		try {
			if (browser) await browser.close({ silent: true });
		} finally {
			await rm(bundleDir, { recursive: true, force: true });
		}
	}
}

/**
 * pix_fmt を実際に確かめる。yuvj420p になる事故が過去に起きていて、
 * 見た目では気づけないため。ffprobe が無い環境では黙って飛ばす。
 */
async function verify(file) {
	let stdout;
	try {
		({ stdout } = await run("ffprobe", [
			"-v", "error",
			"-select_streams", "v:0",
			"-show_entries", "stream=pix_fmt",
			"-of", "csv=p=0",
			file,
		]));
	} catch {
		return;
	}
	const pixFmt = stdout.trim();
	if (pixFmt !== "yuv420p") {
		throw new Error(`pix_fmt が ${pixFmt} になりました（yuv420p のはず）: ${file}`);
	}
	console.log(`  ✓ ${path.basename(file)} · ${pixFmt}`);
}
