import { test } from 'node:test';
import assert from 'node:assert/strict';
import { discoverAgentFlows, captureFrame } from './model.mjs';

test('only compositions nested in AgentFlow are selected, with their folder path', () => {
  const source = `const Root = () => <><Folder name="Examples"><Composition id="No" /></Folder>
    <Folder name="AgentFlow"><Folder name="ClaimIntake"><Composition id="Yes" />
    <Folder name="Variants"><Composition id={'Nested'} /></Folder></Folder></Folder></>`;
  assert.deepEqual(discoverAgentFlows(source), [
    { id: 'Yes', group: 'ClaimIntake' }, { id: 'Nested', group: 'ClaimIntake / Variants' },
  ]);
});
test('dynamic IDs fail explicitly rather than silently omitting a composition', () => {
  assert.throws(() => discoverAgentFlows('<Folder name="AgentFlow"><Composition id={name} /></Folder>'), /literal/);
});
test('midpoint is valid for short and normal compositions; requested frame is clamped', () => {
  assert.equal(captureFrame(840), 420);
  assert.equal(captureFrame(1), 0);
  assert.equal(captureFrame(600, 780), 599);
  assert.equal(captureFrame(840, 60), 60);
  assert.throws(() => captureFrame(840, -1));
  assert.throws(() => captureFrame(840, 1.5));
});
