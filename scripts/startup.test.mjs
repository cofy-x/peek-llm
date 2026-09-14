import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import configure from '../vite.config.mjs';

const template = await readFile(new URL('../apps/portal/index.html', import.meta.url), 'utf8');

test('startup theme follows registered routes under development and production bases', async () => {
  for (const [command, base] of [['serve', ''], ['build', '/peek-llm']]) {
    const config = await configure({command, mode:'test', isPreview:false});
    const plugin = config.plugins.find(item => item.name === 'peek-release-assets');
    const html = plugin.transformIndexHtml.handler(template);
    assert.ok(!html.includes('__PEEK_EXPERIENCE_PATHS__'));
    const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
    for (const [path, theme] of [
      ['/model-architectures/attention-atlas', 'dark'],
      ['/model-architectures/attention-atlas/', 'dark'],
      ['/', 'light'],
      ['/Model-Architectures/Attention-Atlas', 'light'],
      ['/model-architectures/unknown', 'light'],
    ]) {
      const document = {documentElement:{dataset:{}}};
      runInNewContext(script, {document, window:{
        location:{pathname:base + path}, addEventListener() { /* Only synchronous first paint is exercised. */ }, setTimeout() { /* Do not schedule startup timeouts in this test. */ },
      }});
      assert.equal(document.documentElement.dataset.theme, theme, base + path);
    }
  }
});
