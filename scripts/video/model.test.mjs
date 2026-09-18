import { test } from "node:test";
import assert from "node:assert/strict";
import { outputName, progressStep, renderFps, selectTargets } from "./model.mjs";

const REGISTERED = [
	{ id: "ClaimIntake-Cards", group: "ClaimIntake" },
	{ id: "Inquiry-Cards", group: "Inquiry" },
	{ id: "Diagram-Transit", group: "Inquiry / DesignStudies" },
	{ id: "Exhibition-Loop", group: "Exhibition" },
];

test("題材を指定すると、入れ子の題材も含める", () => {
	assert.deepEqual(
		selectTargets(REGISTERED, { group: "Inquiry" }).map((item) => item.id),
		["Inquiry-Cards", "Diagram-Transit"],
	);
	// 入れ子の側だけを名指しすることもできる
	assert.deepEqual(
		selectTargets(REGISTERED, { group: "Inquiry / DesignStudies" }).map((item) => item.id),
		["Diagram-Transit"],
	);
});

test("対象の指定は1つだけ。0個も2個も、黙って進めずに止める", () => {
	assert.throws(() => selectTargets(REGISTERED, {}), /対象を指定/);
	assert.throws(() => selectTargets(REGISTERED, { all: true, group: "Inquiry" }), /同時に指定/);
});

test("存在しない対象は、ある題材を添えて落とす", () => {
	assert.throws(() => selectTargets(REGISTERED, { id: "Nope" }), /登録されていません/);
	assert.throws(() => selectTargets(REGISTERED, { group: "Nope" }), /ある題材: /);
});

test("速度は fps の倍率。--fps を渡したらそちらが勝つ", () => {
	assert.equal(renderFps(30, { speed: 1 }), 30);
	assert.equal(renderFps(30, { speed: 2 }), 60);
	assert.equal(renderFps(30, { speed: 0.5 }), 15);
	// 割り切れないものは丸める
	assert.equal(renderFps(30, { speed: 1.5 }), 45);
	assert.equal(renderFps(30, { speed: 1.1 }), 33);
	assert.equal(renderFps(30, { fps: 24, speed: 99 }), 24);
});

test("速度と fps の異常値は落とす", () => {
	assert.throws(() => renderFps(30, { speed: 0 }), /正の数/);
	assert.throws(() => renderFps(30, { speed: -1 }), /正の数/);
	assert.throws(() => renderFps(30, { speed: Number.NaN }), /正の数/);
	assert.throws(() => renderFps(30, { fps: 0 }), /1以上の整数/);
	assert.throws(() => renderFps(30, { fps: 1.5 }), /1以上の整数/);
	// 30fps を 1/60 にすると fps が 0 になる
	assert.throws(() => renderFps(30, { speed: 0.01 }), /fps が 0/);
});

test("等速なら素の名前。速度を変えたら元を上書きしない", () => {
	assert.equal(outputName("A", 30, 30), "A.mp4");
	assert.equal(outputName("A", 30, 60), "A-2x.mp4");
	assert.equal(outputName("A", 30, 15), "A-0.50x.mp4");
	assert.equal(outputName("A", 30, 45), "A-1.50x.mp4");
});

test("進捗は20%刻みだけ通す", () => {
	assert.equal(progressStep(0, -1), 0);
	assert.equal(progressStep(7, 0), null);
	assert.equal(progressStep(20, 0), 20);
	assert.equal(progressStep(39, 20), null);
	assert.equal(progressStep(100, 80), 100);
});
