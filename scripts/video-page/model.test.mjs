import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseVideoName, selectVideos, formatSeconds, formatSize } from './model.mjs';

const items = [
	{ id: 'Side-Stacked', group: 'DesignStudies / Side', image: 'captures-x/Side-Stacked.png', fps: 30, durationInFrames: 840 },
	{ id: 'Exhibition-Loop', group: 'Exhibition', image: 'captures-x/Exhibition-Loop.png', fps: 30, durationInFrames: 900 },
];

test('速度違いは名前で見分ける', () => {
	assert.deepEqual(parseVideoName('Side-Stacked.mp4'), { id: 'Side-Stacked', speed: null });
	assert.deepEqual(parseVideoName('Side-Stacked-2x.mp4'), { id: 'Side-Stacked', speed: '2x' });
	assert.deepEqual(parseVideoName('Side-Stacked-1.5x.mp4'), { id: 'Side-Stacked', speed: '1.5x' });
	// ID の途中の数字を速度と取り違えない
	assert.deepEqual(parseVideoName('Inquiry-Side-Stacked.mp4'), { id: 'Inquiry-Side-Stacked', speed: null });
	assert.throws(() => parseVideoName('Side-Stacked.mov'), /mp4 ではありません/);
});

test('速度違いと、一覧に無いものは載せずに返す', () => {
	const result = selectVideos(
		['Side-Stacked.mp4', 'Side-Stacked-2x.mp4', 'ClaimIntake-DecisionStory-Side-Replay.mp4', 'Exhibition-Loop.mp4'],
		items,
	);
	// 題材でまとまる。DesignStudies が Exhibition より前
	assert.deepEqual(result.videos.map((v) => v.id), ['Side-Stacked', 'Exhibition-Loop']);
	assert.deepEqual(result.variants, [{ file: 'Side-Stacked-2x.mp4', id: 'Side-Stacked', speed: '2x' }]);
	assert.deepEqual(result.unknown, ['ClaimIntake-DecisionStory-Side-Replay.mp4']);
	assert.equal(result.videos[0].seconds, 28);
});

test('載せられるものが1本も無ければ止まる', () => {
	assert.throws(() => selectVideos(['Gone.mp4'], items), /載せられる動画がありません/);
	assert.throws(() => selectVideos(['Side-Stacked-2x.mp4'], items), /載せられる動画がありません/);
});

test('尺とサイズの表示', () => {
	assert.equal(formatSeconds(28), '0:28');
	assert.equal(formatSeconds(90), '1:30');
	assert.equal(formatSize(1_356_588), '1.3 MB');
	assert.throws(() => formatSeconds(-1), /尺が不正/);
	assert.throws(() => formatSize(1.5), /サイズが不正/);
});
