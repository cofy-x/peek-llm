import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistry, experiences } from './site.mjs';
import { assetClosure, assetPath } from './check-build.mjs';

const registry = patch => [{ ...experiences[0], ...patch }];
test('registry requires unique routes, owning source, a loader, and budget', () => {
  assert.equal(validateRegistry(registry({})).length, 1);
  assert.equal(validateRegistry(registry({source:'packages/another-topic/attention-atlas/src/entry.tsx'}))[0].path, experiences[0].path);
  for (const patch of [{source:'outside.tsx'}, {source:'packages/model-architectures/other/src/entry.tsx'}, {source:'packages/../attention-atlas/src/entry.tsx'}, {path:'/old.html'}, {path:'/model-architectures/other'}, {path:'/model-architectures/attention-atlas/'}, {path:'/../attention-atlas'}, {path:'/model-architectures/attention-atlas?x=1'}, {load:null}, {maxBytes:0}, {sizeReason:''}, {category:''}]) assert.throws(() => validateRegistry(registry(patch)));
  assert.equal(validateRegistry(registry({path:'/another-topic/attention-atlas'}))[0].source, experiences[0].source);
  assert.throws(() => validateRegistry([experiences[0],experiences[0]]));
});
test('initial portal budget excludes lazy experience modules', () => {
  const manifest = {home:{file:'home.js',imports:['shared'],dynamicImports:['experience']},shared:{file:'react.js'},experience:{file:'three.js'}};
  assert.deepEqual([...assetClosure(manifest,'home',new Set(),false)].sort(), ['home.js','react.js']);
});
test('budgets include shared, dynamic, and CSS assets exactly once', () => {
  const manifest = { entry: { file: 'a.js', imports: ['shared'], dynamicImports: ['detail'], css: ['a.css'] }, shared: { file: 'shared.js' }, detail: { file: 'detail.js', imports: ['shared'], assets: ['image.svg'] } };
  assert.deepEqual([...assetClosure(manifest, 'entry')].sort(), ['a.css', 'a.js', 'detail.js', 'image.svg', 'shared.js']);
});
test('missing build imports fail', () => assert.throws(() => assetClosure({ entry: { file: 'a.js', imports: ['missing'] } }, 'entry')));
test('cyclic import graphs terminate', () => assert.equal(assetClosure({ a: { file: 'a.js', imports: ['b'] }, b: { file: 'b.js', imports: ['a'] } }, 'a').size, 2));
test('runtime assets cannot escape the static site', () => {
  for (const path of ['../paper.pdf', '/absolute.js', 'https://cdn.example/lib.js', '//cdn.example/x', 'a\\b']) assert.throws(() => assetPath(path));
});
