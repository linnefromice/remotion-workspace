import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { readdir, readFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";

const icons = path.resolve(__dirname, "../public/service-icons");

/**
 * 図は staticFile('service-icons/…') でブランドのロゴを読む。これはサイトの
 * 直下を指すので、配ってやらないとここだけ 404 になる。
 *
 * public/ を丸ごと配らないのは、examples 用の音声サンプル（861KB）が
 * 混ざるため。このページが実際に読むものだけを置く。
 */
const serviceIcons = (): Plugin => ({
	name: "service-icons",
	configureServer(server) {
		server.middlewares.use("/service-icons", (req, res, next) => {
			const name = path.basename(req.url ?? "");
			if (!name.endsWith(".svg")) return next();
			res.setHeader("Content-Type", "image/svg+xml");
			createReadStream(path.join(icons, name)).on("error", next).pipe(res);
		});
	},
	async generateBundle() {
		for (const name of await readdir(icons)) {
			if (!name.endsWith(".svg")) continue;
			this.emitFile({ type: "asset", fileName: `service-icons/${name}`, source: await readFile(path.join(icons, name)) });
		}
	},
});

/**
 * 段2（@remotion/player）のサンプル。
 *
 * ルートを web/ に置きつつ、コンポジションは ../src から読む。
 * Remotion 側のビルドとは別系統なので、動画の書き出しには影響しない。
 */
export default defineConfig({
	root: path.resolve(__dirname),
	publicDir: false,
	plugins: [react(), serviceIcons()],
	server: { fs: { allow: [path.resolve(__dirname, "..")] } },
	resolve: { alias: { "@flow": path.resolve(__dirname, "../src") } },
});
