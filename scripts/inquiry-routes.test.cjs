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
const studies = require('../src/agent-flow/design-studies/inquiry/index.tsx');
const {LINKS, moment} = require('../src/agent-flow/design-studies/inquiry/model.ts');
const frames = new Set([0, 719, 60, 180, 300, 420, 540, 660]);
for(let f=1;f<720;f++) if(moment(f).link.id !== moment(f-1).link.id){frames.add(f-1);frames.add(f);}
for(const [name, Composition] of Object.entries(studies)) test(`${name}: all routes survive every handoff boundary`, () => {
  for(const f of frames){
    frame=f;
    const html=renderToStaticMarkup(React.createElement(Composition));
    const paths=[...html.matchAll(/<path\b[^>]*data-route-id="([^"]+)"[^>]*>/g)];
    assert.equal(paths.length, LINKS.length, `${name} frame ${f}: missing or duplicate routes`);
    assert.deepEqual(paths.map(p=>p[1]).sort(), LINKS.map(e=>e.id).sort());
    const active=moment(f).link;
    for(const [tag,id] of paths){
      assert.ok(tag.includes(`data-active="${id===active.id}"`));
      if(id!==active.id || active.dashed) assert.match(tag,/stroke-dasharray="[^"]+"/);
      else assert.doesNotMatch(tag,/stroke-dasharray=/);
      assert.doesNotMatch(tag,/NaN|Infinity/);
    }
  }
});
