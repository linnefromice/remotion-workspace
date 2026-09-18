import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * 段2（@remotion/player）のサンプル。
 *
 * ルートを web/ に置きつつ、コンポジションは ../src から読む。
 * Remotion 側のビルドとは別系統なので、動画の書き出しには影響しない。
 */
export default defineConfig({
	root: path.resolve(__dirname),
	plugins: [react()],
	server: { fs: { allow: [path.resolve(__dirname, "..")] } },
	resolve: { alias: { "@flow": path.resolve(__dirname, "../src") } },
});
