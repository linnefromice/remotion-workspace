import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { discoverAgentFlows } from "./model.mjs";

/**
 * 一覧（デザインリスト）が実態とずれていないかを見る。
 *
 * 一覧は `out/` にあって git に入らないので、「作り直し忘れ」を人の記憶に
 * 頼ることになる。ここでは、公開されている一覧と `src/Root.tsx` の登録を
 * 突き合わせて、**古い一覧を見せ続けている状態**を落とす。
 *
 * 一覧をまだ一度も作っていない場合は skip する。その状態には
 * 「古い一覧に騙される」危険が無く、落としても直す先が無いため。
 *
 * 検出できないもの: 図の見た目だけを変えて作り直していない場合。
 * 登録は変わらないので、ここでは分からない。
 */

const root = fileURLToPath(new URL("../../", import.meta.url));
const galleryHtml = path.join(root, "out/agent-flow-gallery/index.html");

const exists = async (file) =>
	access(file).then(
		() => true,
		() => false,
	);

/** 公開されている一覧。index.html に埋め込まれた JSON が、見る人が見ているもの */
async function publishedGallery() {
	if (!(await exists(galleryHtml))) return null;
	const html = await readFile(galleryHtml, "utf8");
	const embedded = html.match(
		/<script id="gallery-data" type="application\/json">(.*?)<\/script>/s,
	);
	assert.ok(embedded, "index.html に埋め込みデータが見つからない");
	return JSON.parse(embedded[1].replaceAll("\\u003c", "<"));
}

const registered = async () =>
	discoverAgentFlows(await readFile(path.join(root, "src/Root.tsx"), "utf8"));

const skipUnlessGenerated = async () =>
	(await exists(galleryHtml))
		? false
		: "一覧がまだ作られていない（pnpm gallery:agent-flow）";

test("公開中の一覧に、登録されている図がすべて載っている", async (t) => {
	const reason = await skipUnlessGenerated();
	if (reason) return t.skip(reason);

	const gallery = await publishedGallery();
	const listed = new Set(gallery.items.map((item) => item.id));
	const missing = (await registered())
		.map((item) => item.id)
		.filter((id) => !listed.has(id));

	assert.deepEqual(
		missing,
		[],
		`一覧が古い。登録済みだが載っていない: ${missing.join(", ")}\n` +
			"→ pnpm gallery:agent-flow で作り直す",
	);
});

test("一覧に、もう登録されていない図が残っていない", async (t) => {
	const reason = await skipUnlessGenerated();
	if (reason) return t.skip(reason);

	const gallery = await publishedGallery();
	const ids = new Set((await registered()).map((item) => item.id));
	const stale = gallery.items.map((item) => item.id).filter((id) => !ids.has(id));

	assert.deepEqual(
		stale,
		[],
		`一覧が古い。消えた図が残っている: ${stale.join(", ")}\n` +
			"→ pnpm gallery:agent-flow で作り直す",
	);
});

test("題材の括りが Root.tsx のフォルダと一致している", async (t) => {
	const reason = await skipUnlessGenerated();
	if (reason) return t.skip(reason);

	const gallery = await publishedGallery();
	const groupOf = new Map((await registered()).map((item) => [item.id, item.group]));
	const moved = gallery.items
		.filter((item) => groupOf.has(item.id) && groupOf.get(item.id) !== item.group)
		.map((item) => `${item.id}: ${item.group} → ${groupOf.get(item.id)}`);

	assert.deepEqual(moved, [], `題材が変わっている:\n${moved.join("\n")}`);
});

test("一覧が参照している画像が実在する", async (t) => {
	const reason = await skipUnlessGenerated();
	if (reason) return t.skip(reason);

	const gallery = await publishedGallery();
	const base = path.dirname(galleryHtml);
	const broken = [];
	for (const item of gallery.items) {
		if (!(await exists(path.join(base, item.image)))) broken.push(item.image);
	}

	assert.deepEqual(
		broken,
		[],
		`画像が消えている（撮影フォルダを消した？）: ${broken.join(", ")}\n` +
			"→ pnpm gallery:agent-flow で作り直す",
	);
});
