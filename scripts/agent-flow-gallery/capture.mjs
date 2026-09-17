import { readFile, writeFile, mkdir, mkdtemp, rm, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { bundle } from '@remotion/bundler';
import { getCompositions, openBrowser, renderStill } from '@remotion/renderer';
import { discoverAgentFlows, captureFrame } from './model.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const { values } = parseArgs({ options: { frame: { type: 'string' }, help: { type: 'boolean' } } });
if (values.help) {
  console.log('pnpm gallery:agent-flow [--frame=420]\nDefault: each composition midpoint. Frames beyond the duration use the last frame.');
} else {
  await capture().catch((error) => { console.error(error); process.exitCode = 1; });
}

async function capture() {
  const requested = values.frame === undefined ? undefined : Number(values.frame);
  if (values.frame !== undefined && !/^\d+$/.test(values.frame)) throw new Error('--frame must be a non-negative integer');
  captureFrame(1, requested);
  const output = path.join(root, 'out/agent-flow-gallery');
  const registration = await readFile(path.join(root, 'src/Root.tsx'), 'utf8');
  const targets = discoverAgentFlows(registration);
  await mkdir(output, { recursive: true });
  // A run gets its own images. Failed runs cannot corrupt the currently published gallery.
  const run = await mkdtemp(path.join(output, 'captures-'));
  const bundleDir = path.join(run, 'bundle');
  let browser;
  let published = false;
  try {
    console.log(`Bundling once for ${targets.length} AgentFlow compositions…`);
    const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts'), outDir: bundleDir, publicDir: path.join(root, 'public') });
    if (registration !== await readFile(path.join(root, 'src/Root.tsx'), 'utf8')) throw new Error('Root.tsx changed during bundling. Please retry.');
    browser = await openBrowser('chrome', { chromiumOptions: { gl: 'swangle' } });
    const compositions = await getCompositions(serveUrl, { puppeteerInstance: browser });
    const items = [];
    for (const [index, target] of targets.entries()) {
      const composition = compositions.find((item) => item.id === target.id);
      if (!composition) throw new Error(`Registered composition not found: ${target.id}`);
      const frame = captureFrame(composition.durationInFrames, requested);
      const filename = `${composition.id}.png`;
      console.log(`[${index + 1}/${targets.length}] ${composition.id} · frame ${frame}`);
      await renderStill({ serveUrl, composition, frame, imageFormat: 'png', output: path.join(run, filename), puppeteerInstance: browser });
      items.push({ ...target, frame, fps: composition.fps, width: composition.width, height: composition.height,
        durationInFrames: composition.durationInFrames, image: `${path.basename(run)}/${filename}` });
    }
    const data = { generatedAt: new Date().toISOString(), mode: requested === undefined ? '各動画の中間フレーム' : `指定フレーム ${requested}（尺を超える場合は最終フレーム）`, items };
    const template = await readFile(new URL('./page.html', import.meta.url), 'utf8');
    const html = template.replace('__GALLERY_DATA__', () => JSON.stringify(data).replaceAll('<', '\\u003c'));
    await writeFile(path.join(run, 'manifest.json'), JSON.stringify(data, null, 2));
    await writeFile(path.join(run, 'index.html'), html);
    await rename(path.join(run, 'index.html'), path.join(output, 'index.html'));
    published = true;
    console.log(`\nGallery: ${path.join(output, 'index.html')}`);
  } finally {
    try { if (browser) await browser.close({ silent: true }); }
    finally { await rm(published ? bundleDir : run, { recursive: true, force: true }); }
  }
}
