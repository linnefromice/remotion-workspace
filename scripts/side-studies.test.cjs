const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
// Render real compositions at frame boundaries; native img stands in for Remotion image loading.
let frame = 0;
const load = Module._load;
Module._load = function(name, ...args) {
  const value = load.call(this, name, ...args);
  return name === 'remotion' ? {...value, useCurrentFrame: () => frame, Img: 'img'} : value;
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
  }).outputText, filename);
};
const {AgentFlowClaimIntakeIcons} = require('../src/agent-flow/claim-intake/icons/index.tsx');
const {SideGate, SideReplay} = require('../src/agent-flow/design-studies/side/GateReplay.tsx');
const render = (component, props={}) => renderToStaticMarkup(React.createElement(component,props));
test('Replay map frame override matches the historical stage, including boundaries', () => {
  for(const target of [0,119,120,239,240,359,360,479,480,599,600,719,720,839]) {
    frame=target;
    const expected=render(AgentFlowClaimIntakeIcons,{nodeVariant:'logoSeal',inactiveDashed:true});
    frame=0;
    assert.equal(render(AgentFlowClaimIntakeIcons,{nodeVariant:'logoSeal',inactiveDashed:true,frameOverride:target}),expected);
  }
});
test('Gate retains P2 after promotion and never presents a performed downgrade', () => {
  for(const f of [0,239,240,359,360,599,600,839]) {
    frame=f;
    const html=render(SideGate);
    assert.match(html,/今回は未実施/);
    assert.match(html,/stroke-dasharray="8 9"/);
    if(f>=240) assert.match(html,/P2 \/ 保存済み/);
    if(f>=360) assert.match(html,/P1 \/ 発火/);
    if(f>=600) assert.match(html,/P1 \/ 確認/);
    assert.doesNotMatch(html,/NaN|Infinity/);
  }
});
test('Replay retains evidence throughout the retrospective', () => {
  for(const f of [0,119,120,239,240,359,360,479,480,599,600,719,720,839]) {
    frame=f;
    const html=render(SideReplay);
    for(const text of ['判断後の振り返り','実行順の再生ではありません','P2 · 翌営業日','P1 · 即時対応','SAFETY_GAS_ODOR','このケースでは降格なし','ガスのようなにおい']) assert.ok(html.includes(text),text);
    assert.doesNotMatch(html,/NaN|Infinity/);
  }
});

const {ClaimIntakeSideBySideLayout} = require('../src/agent-flow/claim-intake/side-by-side/index.tsx');
const {clockSlot,timelineSlot,counterfactualSlot} = require('../src/agent-flow/claim-intake/side-by-side/slots.tsx');
test('Slots assign elapsed time once across header, bottom and scene',()=>{
 frame=780;
 for(const bottom of [timelineSlot,counterfactualSlot]){
  const html=render(ClaimIntakeSideBySideLayout,{mapOnly:true,headerSlot:clockSlot,bottomSlot:bottom});
  assert.equal((html.match(/00:47/g)||[]).length,1);
  assert.ok(!html.includes('47秒で一次回答'));
  assert.ok(!html.includes('受付から一次回答まで'));
 }
 const plain=render(ClaimIntakeSideBySideLayout,{mapOnly:true});
 assert.ok(plain.includes('受付から一次回答まで'));
 const bottom=render(ClaimIntakeSideBySideLayout,{mapOnly:true,bottomSlot:counterfactualSlot});
 assert.equal((bottom.match(/47秒で一次回答/g)||[]).length,1);
 assert.ok(!bottom.includes('受付から一次回答まで'));
});
test('A custom slot can claim elapsed without changing schema or layout',()=>{
 frame=780;
 const custom={claims:['elapsed'],render:({showElapsed})=>React.createElement('span',null,showElapsed?'CUSTOM ELAPSED':'CUSTOM WITHOUT TIME')};
 const html=render(ClaimIntakeSideBySideLayout,{headerSlot:custom,bottomSlot:custom});
 assert.equal((html.match(/CUSTOM ELAPSED/g)||[]).length,1);
 assert.ok(html.includes('CUSTOM WITHOUT TIME'));
 assert.ok(!html.includes('受付から一次回答まで'));
});
const {SideDemoFull}=require('../src/agent-flow/design-studies/side/demo-full/index.tsx');
const {demoMoment,DEMO_FRAMES}=require('../src/agent-flow/design-studies/side/demo-full/model.ts');
const {CASE,EVENTS}=require('../src/agent-flow/claim-intake/side-by-side/scenario.ts');
test('Full demo maps all seven six-second scenes to the original four-second stages',()=>{
 assert.equal(DEMO_FRAMES,1260);
 for(let i=0;i<7;i++)for(const offset of [0,90,179]){
  frame=i*180+offset;
  const moment=demoMoment(frame);
  assert.equal(moment.step,i);
  assert.equal(Math.floor(moment.sourceFrame/120),i);
  const html=render(SideDemoFull);
  assert.ok(html.includes(`data-demo-step="${i}"`));
  assert.ok(html.includes(CASE.ticket));
  assert.ok(html.includes(EVENTS[i].name));
  assert.ok(html.includes('経過秒はシナリオ値'));
  assert.ok(html.includes('実システムへの接続なし'));
  if(i===3||i===5||i===6){assert.ok(html.includes(CASE.aiUrgency));assert.ok(html.includes(CASE.resolvedUrgency));assert.ok(html.includes(CASE.ruleId));}
  assert.doesNotMatch(html,/NaN|Infinity/);
 }
});

test('Stacked story fades at stage boundaries, remains readable, and holds its ending', () => {
  const {ClaimIntakeDecisionStoryDiagramStacked}=require('../src/agent-flow/claim-intake/decision-story/DiagramStacked.tsx');
  const opacityAt=f=>{frame=f;const html=render(ClaimIntakeDecisionStoryDiagramStacked);return Number(html.match(/data-story-transition="\d" style="opacity:([\d.]+)/)[1]);};
  for(let stage=0;stage<7;stage++) {
    const start=stage*120;
    assert.equal(opacityAt(start),0);
    assert.ok(opacityAt(start+7)>0 && opacityAt(start+7)<1);
    assert.equal(opacityAt(start+15),1);
    assert.equal(opacityAt(start+60),1);
    if(stage<6){assert.ok(opacityAt(start+115)<1);assert.equal(opacityAt(start+119),0);}
  }
  assert.equal(opacityAt(839),1);
});

test('Stacked story keeps panel geometry and borders outside faded text', () => {
  const {ClaimIntakeDecisionStoryDiagramStacked}=require('../src/agent-flow/claim-intake/decision-story/DiagramStacked.tsx');
  for(const f of [0,15,119,120,360,479,600,719,839]) {
    frame=f;
    const html=render(ClaimIntakeDecisionStoryDiagramStacked);
    const story=html.slice(html.indexOf('left:297.6px;width:1840px'));
    assert.doesNotMatch(story,/translateY/);
    const styles=[...story.matchAll(/style="([^"]*)"/g)].map(m=>m[1]);
    const shapes=styles.filter(s=>/border|background/.test(s));
    assert.ok(shapes.length>=3);
    assert.ok(shapes.every(s=>!s.includes('opacity')));
    assert.match(story,/height:202px/);
    assert.match(story,/height:132px;box-sizing:border-box/);
  }
});
