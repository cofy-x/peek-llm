/** @typedef {{id:string, title:string, theme:"light"|"dark", path:string, category:string, description:string, interaction:string, format:string, preview:string, previewAlt:string, source:string, maxBytes:number, sizeReason:string, load:()=>Promise<{default:import('react').ComponentType}>}} Experience */

/** The portal catalog and lazy routes share one registry. @type {Experience[]} */
export const EXPERIENCES = [{
  id: 'attention-atlas',
  theme: 'dark',
  title: 'Attention Atlas',
  path: '/model-architectures/attention-atlas',
  category: 'Model architectures',
  description: 'Trace the original Transformer and DeepSeek V4.1 Flash. Explore the modules, follow the connections, and replay the mechanisms.',
  interaction: 'Inspect / Compare / Replay',
  format: 'Interactive 3D exhibit',
  preview: new URL('../../../packages/model-architectures/attention-atlas/preview.svg', import.meta.url).href,
  previewAlt: 'Conceptual overview of the original Transformer and DeepSeek V4.1 Flash architecture stacks',
  source: 'packages/model-architectures/attention-atlas/src/entry.tsx',
  maxBytes: 1600000,
  sizeReason: 'Portal plus the complete React / Three.js experience, its lazy modules, styles, assets, and license notices.',
  load: () => import('../../../packages/model-architectures/attention-atlas/src/entry'),
}, {
  id: 'token-workshop',
  theme: 'light',
  title: 'Token Workshop',
  path: '/tokenization/token-workshop',
  category: 'Tokenization',
  description: 'Turn your own text into tokens. Inspect UTF-8 bytes, replay real BPE merges, and discover how one edit changes the model’s input.',
  interaction: 'Type / Inspect / Replay',
  format: 'Interactive text lab',
  preview: new URL('../../../packages/tokenization/token-workshop/preview.svg', import.meta.url).href,
  previewAlt: 'Hello, 世界! 👋 shown as nine tokens, with 世 expanded into three UTF-8 bytes and two token IDs',
  source: 'packages/tokenization/token-workshop/src/entry.tsx',
  maxBytes: 1600000,
  sizeReason: 'Portal, complete cl100k_base vocabulary (about 1.1 MB), DOM/SVG inspection, styles, and runtime licenses; no 3D renderer, model weights, or remote runtime.',
  load: () => import('../../../packages/tokenization/token-workshop/src/entry'),
}];
