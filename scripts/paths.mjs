import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const portalRoot = resolve(root, 'apps/portal');
export const siteBase = '/peek-llm/';
// React + router + lightweight previews; experience renderers remain lazy.
export const portalBudget = 400000;
