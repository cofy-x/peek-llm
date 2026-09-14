/** Validate runtime budgets, relative resources, and the publication allowlist. */
import { readFile, stat, readdir } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { experiences, root, portalRoot, portalBudget, siteBase } from './site.mjs';

export function assetPath(name) {
  if (typeof name !== 'string' || !name || name.startsWith('/') || name.includes('..') || name.includes('\\') || /^[a-z]+:/i.test(name)) throw new Error(`Nonlocal build asset: ${name}`);
  return resolve(root, 'dist', name);
}
export function assetClosure(manifest, key, visited = new Set(), includeDynamic = true) {
  if (visited.has(key)) return new Set();
  visited.add(key);
  const entry = manifest[key];
  if (!entry) throw new Error(`Missing manifest entry: ${key}`);
  const files = new Set([entry.file, ...(entry.css ?? []), ...(entry.assets ?? [])]);
  for (const dependency of [...(entry.imports ?? []), ...(includeDynamic ? entry.dynamicImports ?? [] : [])]) for (const file of assetClosure(manifest, dependency, visited, includeDynamic)) files.add(file);
  return files;
}
export async function checkBuild() {
  const manifest = JSON.parse(await readFile(assetPath('.vite/manifest.json'), 'utf8'));
  const initial = assetClosure(manifest, 'index.html', new Set(), false);
  initial.add('index.html'); initial.add('THIRD-PARTY-NOTICES.txt');
  async function budget(label, files, limit) {
    let bytes = 0;
    for (const file of files) bytes += (await stat(assetPath(file))).size;
    if (bytes > limit) throw new Error(`${label}: ${bytes} bytes exceeds ${limit}`);
    console.log(`ok: ${label} (${bytes} bytes; budget ${limit})`);
  }
  await budget('Portal initial load', initial, portalBudget);
  for (const experience of experiences) {
    const key = relative(portalRoot, resolve(root, experience.source));
    const files = new Set([...initial, ...assetClosure(manifest, key)]);
    await budget(experience.id, files, experience.maxBytes);
  }
  const html = await readFile(assetPath('index.html'), 'utf8');
  if (/\.tsx?["']|https?:\/\/[^"']+\.(?:js|css)["']/i.test(html)) throw new Error('Build references source or remote runtime');
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)="([^"]+)"/g)) {
    if (match[1].startsWith('data:')) continue;
    if (!match[1].startsWith(siteBase)) throw new Error('Build resource does not use the configured site base');
    await stat(assetPath(match[1].slice(siteBase.length)));
  }
  if (!(await readFile(assetPath('index.html'))).equals(await readFile(assetPath('404.html')))) throw new Error('Pages fallback differs from the portal entry');
  const allowed = new Set(['index.html', '404.html', '.vite/manifest.json', 'THIRD-PARTY-NOTICES.txt', ...assetClosure(manifest, 'index.html')]);
  for (const file of await readdir(assetPath('.'), {recursive:true,withFileTypes:true})) {
    if (!file.isFile()) continue;
    const path = relative(resolve(root,'dist'), resolve(file.parentPath,file.name));
    if (!allowed.has(path)) throw new Error(`Unregistered published file: ${path}`);
  }
  console.log('ok: single portal entry, Pages fallback, and bundled runtime assets only');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) checkBuild().catch(error => { console.error(error.message); process.exitCode = 1; });
