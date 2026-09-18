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
