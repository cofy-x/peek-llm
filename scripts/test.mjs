/** Discover tests in repository tooling and every registered source exhibit. */
import { readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { experiences, root } from './site.mjs';

export function discoverTests(directories) {
  const files = [];
  const excluded = new Set(['node_modules', 'dist', 'papers', 'assets']);
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || excluded.has(entry.name)) continue;
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile() && entry.name.endsWith('.test.mjs')) files.push(path);
    }
  }
  for (const directory of directories) visit(directory);
  return [...new Set(files)].sort();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = discoverTests([resolve(root, 'scripts'), ...experiences.map(exhibit => dirname(dirname(resolve(root, exhibit.source))))]);
  if (!files.length) throw new Error('No tests found');
  console.log(`Running ${files.length} test files across tooling and registered experiences`);
  const result = spawnSync(process.execPath, ['--test', ...files], { stdio: 'inherit' });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
}
