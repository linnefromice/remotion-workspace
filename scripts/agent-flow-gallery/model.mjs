import ts from 'typescript';

// Read the existing JSX registration without maintaining a second composition list.
// Dynamic registrations must be handled deliberately rather than silently omitted.
export function discoverAgentFlows(source) {
  const ast = ts.createSourceFile('Root.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const result = [];
  function literalAttribute(node, name) {
    const attribute = node.attributes.properties.find((p) => ts.isJsxAttribute(p) && p.name.text === name);
    const value = attribute?.initializer;
    if (value && ts.isStringLiteral(value)) return value.text;
    if (value && ts.isJsxExpression(value) && value.expression && ts.isStringLiteral(value.expression)) return value.expression.text;
    throw new Error(`${node.tagName.getText(ast)} ${name} must be a string literal in src/Root.tsx`);
  }
  function visit(node, folders = []) {
    const element = ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
    let path = folders;
    if (element?.tagName.getText(ast) === 'Folder') path = [...folders, literalAttribute(element, 'name')];
    const start = path.indexOf('AgentFlow');
    if (element?.tagName.getText(ast) === 'Composition' && start !== -1) {
      result.push({ id: literalAttribute(element, 'id'), group: path.slice(start + 1).join(' / ') || 'AgentFlow' });
    }
    ts.forEachChild(node, (child) => visit(child, path));
  }
  visit(ast);
  if (!result.length) throw new Error('No AgentFlow compositions found in src/Root.tsx');
  if (new Set(result.map((item) => item.id)).size !== result.length) throw new Error('Duplicate composition IDs');
  return result;
}

export function captureFrame(duration, requested) {
  if (!Number.isSafeInteger(duration) || duration < 1) throw new Error('Invalid duration');
  if (requested !== undefined && (!Number.isSafeInteger(requested) || requested < 0)) throw new Error('Frame must be a non-negative integer');
  return Math.min(requested ?? Math.floor(duration / 2), duration - 1);
}
