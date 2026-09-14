/** @typedef {{id:string, title:string, path:string, category:string, description:string, interaction:string, format:string, preview:string, previewAlt:string, source:string, maxBytes:number, sizeReason:string, load:()=>Promise<{default:import('react').ComponentType}>}} Experience */

/** The portal catalog and lazy routes share one registry. @type {Experience[]} */
export const EXPERIENCES = [{
  id: 'attention-atlas',
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
}];
