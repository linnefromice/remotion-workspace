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
  if(name.startsWith("@remotion/google-fonts/")) return {loadFont:()=>({fontFamily:"sans-serif"})};
  const value = load.call(this, name, ...args);
  return name === 'remotion' ? {...value, useCurrentFrame: () => frame, Img: 'img'} : value;
};
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
  }).outputText, filename);
};
const {SubjectSide,SUBJECTS,sideMoment}=require('../src/agent-flow/design-studies/side/subjects');
for(const subject of ['Proposal','Inquiry','Restoration'])test(`${subject}: all layouts match diagram stages and retain routes`,()=>{
 const data=SUBJECTS[subject];assert.equal(data.scenes.length,data.steps.length);
 for(const layout of ['DemoDiagram','SlotMinimal','Stacked'])for(let step=0;step<data.steps.length;step++){
  const len=layout==='DemoDiagram'?180:120;
  for(const local of [0,len-1]){
   frame=step*len+local;const moment=sideMoment(frame,subject,layout);
   assert.equal(moment.step,step);assert.equal(Math.floor(moment.sourceFrame/120),step);
   const html=renderToStaticMarkup(React.createElement(SubjectSide,{subject,layout}));
   assert.match(html,new RegExp(`data-side-step="${step}"`));assert.ok(html.includes(data.scenes[step].title));
   assert.match(html,/stroke-dasharray/);assert.doesNotMatch(html,/NaN|Infinity|SAFETY_GAS_ODOR|実システムへの接続なし/);
   if(subject==='Inquiry')assert.doesNotMatch(html,/brand-seal/);
   if(layout!=='Stacked')assert.match(html,/映像の経過時間/);
  }
 }
});
test('Demo clock is presentation time; subject facts come from original panel rows',()=>{
 const {PROPOSAL}=require('../src/agent-flow/proposal/constants');
 const {RESTORATION}=require('../src/agent-flow/restoration/constants');
 assert.strictEqual(SUBJECTS.Proposal.rows,PROPOSAL.panel.rows);
 assert.strictEqual(SUBJECTS.Restoration.rows,RESTORATION.panel.rows);
 assert.equal(sideMoment(1079,'Inquiry','DemoDiagram').step,5);
 assert.equal(sideMoment(1259,'Proposal','DemoDiagram').step,6);
});
