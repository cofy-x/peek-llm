import test from 'node:test';
import assert from 'node:assert/strict';
import { digest, verify } from './check-deployment.mjs';

test('checks direct paths under the hosting prefix and rejects source deployment', async () => {
  const checks = { 'index.html': digest('built') };
  await verify('https://example.org/peek-llm/', checks, async url => {
    assert.equal(url.pathname, '/peek-llm/index.html');
    return new globalThis.Response('built');
  });
  await assert.rejects(verify('https://example.org/', checks, async () => new globalThis.Response('source')), /differ/);
});
test('missing assets and HTML responses masquerading as JavaScript fail', async () => {
  const checks = { 'assets/app.js': digest('code') };
  await assert.rejects(verify('https://example.org/', checks, async () => new globalThis.Response('', { status: 404 })), /HTTP 404/);
  await assert.rejects(verify('https://example.org/', checks, async () => new globalThis.Response('code', { headers: { 'content-type': 'text/html' } })), /MIME/);
  await verify('https://example.org/', checks, async () => new globalThis.Response('code', { headers: { 'content-type': 'text/javascript' } }));
});
