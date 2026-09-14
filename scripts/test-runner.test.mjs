import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { discoverTests } from './test.mjs';

test('discovers tests in multiple exhibits without traversing data or dependencies', () => {
  const root = mkdtempSync(resolve(tmpdir(), 'peek-test-discovery-'));
  try {
    const dirs = ['first/src', 'second/tests', 'second/papers', 'second/node_modules', 'second/.cache'];
    for (const dir of dirs) mkdirSync(resolve(root, dir), { recursive: true });
    for (const file of ['first/src/math.test.mjs', 'second/tests/state.test.mjs', 'second/papers/ignored.test.mjs', 'second/node_modules/ignored.test.mjs', 'second/.cache/ignored.test.mjs']) writeFileSync(resolve(root, file), '');
    symlinkSync(resolve(root, 'first'), resolve(root, 'second', 'linked-source'));
    assert.deepEqual(discoverTests([resolve(root, 'first'), resolve(root, 'second'), resolve(root, 'first')]), [resolve(root, 'first/src/math.test.mjs'), resolve(root, 'second/tests/state.test.mjs')]);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
