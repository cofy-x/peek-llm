/** Compare public bytes with the exact artifact, including lazy runtime assets. */
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetClosure } from './check-build.mjs';

export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export async function record(directory) {
  const manifest = JSON.parse(await readFile(resolve(directory, '.vite/manifest.json'), 'utf8'));
  const paths = new Set(['index.html', '404.html', 'THIRD-PARTY-NOTICES.txt', ...assetClosure(manifest, 'index.html')]);
  const checks = {};
  for (const path of paths) checks[path] = digest(await readFile(resolve(directory, path)));
  return checks;
}
export async function verify(base, checks, request = globalThis.fetch) {
  const root = new URL(base.endsWith('/') ? base : `${base}/`);
  for (const [path, expected] of Object.entries(checks)) {
    const url = new URL(path, root);
    url.searchParams.set('peek-check', expected);
    const response = await request(url, { signal: globalThis.AbortSignal.timeout(20000), cache: 'no-store' });
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    if (digest(new Uint8Array(await response.arrayBuffer())) !== expected) throw new Error(`${path}: published bytes differ from the build`);
    const type = response.headers.get('content-type') ?? '';
    if (path.endsWith('.js') && !/(?:javascript|ecmascript)/i.test(type)) throw new Error(`${path}: invalid JavaScript MIME type ${type}`);
    if (path.endsWith('.css') && !/text\/css/i.test(type)) throw new Error(`${path}: invalid CSS MIME type ${type}`);
  }
}
async function main() {
  const [mode, location, file] = process.argv.slice(2);
  if (mode === 'record' && location && file) {
    await writeFile(file, JSON.stringify(await record(location), null, 2) + '\n');
  } else if (mode === 'verify' && location && file) {
    const checks = JSON.parse(await readFile(file, 'utf8'));
    for (let attempt = 1; ; attempt++) {
      try { await verify(location, checks); break; }
      catch (error) {
        if (attempt === 6) throw error;
        console.error(`Attempt ${attempt}: ${error.message}; retrying in 10s`);
        await new Promise(done => globalThis.setTimeout(done, 10000));
      }
    }
    console.log(`ok: ${Object.keys(checks).length} published files match the build`);
  } else throw new Error('Usage: check-deployment.mjs record <dist> <checks.json> | verify <site-url> <checks.json>');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
