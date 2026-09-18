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
const {subjectBands}=require('../src/agent-flow/design-studies/agent-diagram/bands/layout.ts');
const {BAND_SPECS}=require('../src/agent-flow/design-studies/agent-diagram/bands/specs.ts');
for(const [subject,counts] of Object.entries({restoration:[15,13],proposal:[17,16],claimIntake:[16,12]}))test(`${subject}: complete graph, finite orthogonal routes and separate records`,()=>{
 const spec=BAND_SPECS[subject],result=subjectBands(spec);
 assert.equal(result.nodes.length,counts[0]);assert.equal(result.edges.length,counts[1]);
 assert.deepEqual(result.nodes.map(n=>n.id).sort(),spec.nodes.map(n=>n.id).sort());
 assert.deepEqual(result.edges.map(n=>n.id).sort(),spec.edges.map(n=>n.id).sort());
 for(const n of result.nodes){assert.equal(n.band==='records',!!n.record);assert.ok(Number.isFinite(n.cx)&&Number.isFinite(n.cy));assert.ok(n.cx-n.w/2>=0&&n.cx+n.w/2<=1920);}
 for(const e of result.edges){assert.ok(result.nodes.some(n=>n.id===e.from));assert.ok(result.nodes.some(n=>n.id===e.to));for(let i=1;i<e.points.length;i++)assert.ok(e.points[i][0]===e.points[i-1][0]||e.points[i][1]===e.points[i-1][1]);}
});
test('Band assignment uses left boundary only; planned follows a connected neighbor',()=>{
 const r=subjectBands(BAND_SPECS.restoration).nodes;
 assert.equal(r.find(n=>n.id==='tenant').band,0);
 for(const id of ['walkthrough','photos','vendor'])assert.equal(r.find(n=>n.id===id).band,1);
 assert.equal(r.find(n=>n.id==='staff').band,2);
 const c=subjectBands(BAND_SPECS.claimIntake).nodes;
 assert.equal(c.find(n=>n.id==='line').band,1);
 assert.equal(c.find(n=>n.id==='followup').band,1);
 assert.equal(c.find(n=>n.id==='csv').band,0);
});
test('Missing endpoints fail explicitly; Inquiry cannot silently invent tones',()=>{
 const spec=BAND_SPECS.restoration;
 assert.throws(()=>subjectBands({...spec,edges:[{...spec.edges[0],from:undefined}]}),/endpoints/);
 const inquiry=require('../src/agent-flow/inquiry/cards/constants.ts');
 assert.equal(inquiry.NODES.filter(n=>!n.tone).length,11);
 assert.throws(()=>subjectBands({...spec,nodes:inquiry.NODES,edges:inquiry.EDGES}),/tone/);
});
const {DiagramBands}=require('../src/agent-flow/design-studies/agent-diagram/bands/index.tsx');
for(const subject of Object.keys(BAND_SPECS))test(`${subject}: rendered counts, white rules and retained dashed routes at each stage`,()=>{
 const spec=BAND_SPECS[subject];
 for(const f of [0,119,120,239,240,359,360,479,480,599,600,719,720,839]){
  frame=f;
  const html=renderToStaticMarkup(React.createElement(DiagramBands,{subject}));
  const nodes=[...html.matchAll(/<div\b[^>]*data-band-node="([^"]+)"[^>]*>/g)];
  const edges=[...html.matchAll(/<path\b[^>]*data-band-edge="([^"]+)"[^>]*>/g)];
  assert.equal(nodes.length,spec.nodes.length);assert.equal(edges.length,spec.edges.length);
  for(const [tag,id] of nodes){const n=spec.nodes.find(n=>n.id===id);if(n.tone==='rule')assert.match(tag,/background:#ffffff/);if(n.tone==='planned'||n.dashed)assert.match(tag,/dashed/);}
  for(const [tag,id] of edges){const e=spec.edges.find(e=>e.id===id);if(e.dashed||e.step===null||tag.includes('data-active="false"'))assert.match(tag,/stroke-dasharray="7 8"/);}
  assert.doesNotMatch(html,/NaN|Infinity/);
 }
});
test('Endpoint metadata handles aliases and paths without names of their nodes',()=>{
 const r=BAND_SPECS.restoration.edges;
 assert.equal(r.find(e=>e.id==='staff-resolved').to,'recResolved');
 assert.deepEqual([r.find(e=>e.id==='special-clause').from,r.find(e=>e.id==='special-clause').to],['classify','staff']);
 assert.equal(BAND_SPECS.proposal.edges.find(e=>e.id==='relist').to,'retrieve');
});
