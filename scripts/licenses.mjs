import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { root } from './paths.mjs';

export async function licenseNotices(inputs) {
  const packages = new Map();
  for (const input of [...inputs].sort()) {
    if (input.includes('\0') || !input.includes('node_modules/')) continue;
    let dir = dirname(resolve(root, input));
    while (dir.startsWith(root + sep)) {
      try {
        const pkg = JSON.parse(await readFile(resolve(dir, 'package.json'), 'utf8'));
        if (pkg.name && pkg.version) {
          const id = `${pkg.name}@${pkg.version}`;
          if (!packages.has(id)) {
            const names = (await readdir(dir)).filter(name => /^(licen[sc]e|copying)(\.|$)/i.test(name)).sort();
            const texts = [];
            for (const name of names) if ((await stat(resolve(dir, name))).isFile()) texts.push(await readFile(resolve(dir, name), 'utf8'));
            if (!texts.length && id === '@react-three/fiber@9.6.1') texts.push(await readFile(resolve(root, 'scripts/licenses/react-three-fiber-9.6.1.txt'), 'utf8'));
            if (!texts.length) throw new Error(`No license text found for ${id}`);
            packages.set(id, `${id}\nSource: https://www.npmjs.com/package/${pkg.name}/v/${pkg.version}\nLicense: ${pkg.license ?? 'see notice'}\n\n${texts.join('\n')}`);
          }
          break;
        }
      } catch (error) { if (error.code !== 'ENOENT') throw error; }
      dir = dirname(dir);
    }
  }
  return [...packages.entries()].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([, notice]) => notice).join('\n\n--------------------\n\n');
}
