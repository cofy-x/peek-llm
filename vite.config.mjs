import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { root, portalRoot, siteBase } from './scripts/paths.mjs';
import { licenseNotices } from './scripts/licenses.mjs';

export default defineConfig(async ({command,isPreview}) => {
  const base = command === 'build' || isPreview ? siteBase : '/';
  // Load the registry in Node without bundling its deferred TSX imports into Vite's config.
  const registryUrl = pathToFileURL(resolve(root, 'scripts/site.mjs')).href;
  const { experiences } = await import(registryUrl);
  const startupPaths = experiences.map(({path}) => `${base.replace(/\/$/, '')}${path}`);
  return {
    root: portalRoot,
    base,
    server: {fs: {allow: [root]}},
    plugins: [react(), {
      name: 'peek-release-assets',
      transformIndexHtml: {order: 'pre', handler(html) {
        return html.replace("'__PEEK_EXPERIENCE_PATHS__'", JSON.stringify(startupPaths));
      }},
      generateBundle: {order: 'post', async handler(_options,bundle) {
        const modules = new Set();
        for (const output of Object.values(bundle)) if (output.type === 'chunk') {
          for (const [id,info] of Object.entries(output.modules)) if (info.renderedLength > 0) modules.add(id);
        }
        this.emitFile({type:'asset',fileName:'THIRD-PARTY-NOTICES.txt',source:await licenseNotices(modules)});
        const home = bundle['index.html'];
        if (!home || home.type !== 'asset') throw new Error('Missing portal entry');
        // GitHub Pages uses this identical SPA entry for direct client-route visits.
        this.emitFile({type:'asset',fileName:'404.html',source:home.source});
      }},
    }],
    build: {outDir:resolve(root,'dist'),emptyOutDir:true,manifest:true},
  };
});
